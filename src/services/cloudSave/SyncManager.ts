import { User } from 'firebase/auth';
import { useGameStore } from '../../store/useGameStore';
import { AuthService } from '../auth/AuthService';
import { CloudSaveService } from './CloudSaveService';
import { CloudSaveResolver } from './CloudSaveResolver';
import { CloudSaveSerializer } from './CloudSaveSerializer';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'pending' | 'offline' | 'error';

export interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  errorMessage: string | null;
  isDirty: boolean;
}

type SyncStateListener = (state: SyncState) => void;

/**
 * SyncManager
 * Application-level synchronization orchestrator managing debounced background sync,
 * dirty-state tracking, conflict resolution, network status, and user transition isolation.
 */
export class SyncManager {
  private static instance: SyncManager | null = null;

  private state: SyncState = {
    status: 'idle',
    lastSyncedAt: null,
    errorMessage: null,
    isDirty: false,
  };

  private listeners: Set<SyncStateListener> = new Set();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_MS = 3000;

  private isSyncing = false;
  private syncPending = false;
  private isApplyingCloudUpdate = false;
  private currentSessionId = 0;
  private activeUser: User | null = null;
  private unsubscribeStore: (() => void) | null = null;
  private unsubscribeAuth: (() => void) | null = null;

  private constructor() {
    this.setupNetworkListeners();
  }

  public static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  /**
   * Initialize SyncManager listeners and bind to AuthService & Zustand store
   */
  public initialize(): void {
    if (this.unsubscribeAuth) return; // Prevent duplicate initialization

    // Listen to Firebase Auth state
    this.unsubscribeAuth = AuthService.onAuthStateChanged((user) => {
      this.handleAuthChange(user);
    });

    // Subscribe to Zustand store profile changes for dirty state tracking
    this.unsubscribeStore = useGameStore.subscribe((curr, prev) => {
      if (!this.activeUser) return;
      // Guard against dirtying store when the mutation originates from cloud synchronization
      if (this.isApplyingCloudUpdate) return;
      if (curr.profile !== prev.profile) {
        this.markDirty();
      }
    });
  }

  /**
   * Clean up listeners
   */
  public destroy(): void {
    this.currentSessionId++;
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  /**
   * Subscribe to sync state changes
   */
  public subscribe(listener: SyncStateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): SyncState {
    return { ...this.state };
  }

  /**
   * Safely update Zustand store from cloud without triggering dirty tracking
   */
  private applyCloudUpdateToStore(fn: () => void): void {
    this.isApplyingCloudUpdate = true;
    try {
      fn();
    } finally {
      this.isApplyingCloudUpdate = false;
    }
  }

  /**
   * Handle Auth state transitions (User login, logout, user switch)
   */
  private async handleAuthChange(user: User | null): Promise<void> {
    // Invalidate previous user session generation and cancel pending timers
    this.currentSessionId++;
    const sessionId = this.currentSessionId;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.syncPending = false;

    if (!user) {
      this.activeUser = null;
      this.updateState({
        status: 'idle',
        isDirty: false,
        errorMessage: null,
      });
      return;
    }

    // User switched or newly logged in
    this.activeUser = user;
    this.updateState({ status: 'syncing', errorMessage: null });

    if (!navigator.onLine) {
      this.updateState({ status: 'offline' });
      return;
    }

    try {
      await this.performInitialAuthSync(user, sessionId);
    } catch (err: any) {
      if (this.currentSessionId !== sessionId) return;
      console.error('[SyncManager] Initial auth sync failed:', err);
      this.updateState({
        status: 'error',
        errorMessage: err.message || 'Initial sync failed.',
      });
    }
  }

  /**
   * Perform initial sync upon authentication or re-auth:
   * 1. Fetch cloud save from Firestore
   * 2. Run field-by-field CloudSaveResolver merge with local state
   * 3. Update Zustand store
   * 4. Save merged result to Firestore
   * 5. Advance Stardust baseline ONLY after successful persistence
   */
  private async performInitialAuthSync(user: User, sessionId: number): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const localProfile = useGameStore.getState().profile;
      const cloudPayload = await CloudSaveService.loadCloudSave(user.uid);

      if (this.currentSessionId !== sessionId) return;

      if (cloudPayload) {
        // Cloud save exists -> resolve conflicts
        const { mergedProfile, stardustLastSynced } = CloudSaveResolver.merge(
          localProfile,
          cloudPayload.profile
        );

        // Keep previous baseline on local store until cloud write succeeds
        const interimProfile = {
          ...mergedProfile,
          stardustLastSynced: localProfile.stardustLastSynced ?? localProfile.stardustReserves ?? 0,
        };

        // Update local Zustand store with reentrancy guard
        this.applyCloudUpdateToStore(() => {
          useGameStore.getState().updateProfileFromCloud(interimProfile);
        });

        // Prepare merged payload for cloud write (using reconciled stardust)
        const mergedPayload = CloudSaveSerializer.serializeCloudSave(
          mergedProfile,
          user.email
        );

        await CloudSaveService.saveCloudSave(user.uid, mergedPayload);

        if (this.currentSessionId !== sessionId) return;

        // ONLY advance Stardust baseline after persistence succeeds
        this.applyCloudUpdateToStore(() => {
          useGameStore.getState().setStardustLastSynced(stardustLastSynced);
        });
      } else {
        // No cloud save exists -> seed cloud with current local profile
        const newPayload = CloudSaveSerializer.serializeCloudSave(
          localProfile,
          user.email
        );
        await CloudSaveService.saveCloudSave(user.uid, newPayload);

        if (this.currentSessionId !== sessionId) return;

        this.applyCloudUpdateToStore(() => {
          useGameStore.getState().setStardustLastSynced(localProfile.stardustReserves || 0);
        });
      }

      this.updateState({
        status: 'synced',
        lastSyncedAt: Date.now(),
        isDirty: false,
        errorMessage: null,
      });
    } catch (error: any) {
      if (this.currentSessionId !== sessionId) return;
      this.updateState({
        status: 'error',
        errorMessage: error.message || 'Failed to sync cloud save.',
      });
      throw error;
    } finally {
      if (this.currentSessionId === sessionId) {
        this.isSyncing = false;
      }
    }
  }

  /**
   * Mark local state as dirty and schedule debounced cloud push
   */
  public markDirty(): void {
    if (!this.activeUser) return;

    this.updateState({ isDirty: true });
    if (this.state.status === 'synced' || this.state.status === 'idle') {
      this.updateState({ status: 'pending' });
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.triggerSync();
    }, this.DEBOUNCE_MS);
  }

  /**
   * Trigger cloud sync explicitly or via debounced queue
   */
  public async triggerSync(): Promise<void> {
    if (!this.activeUser) return;
    if (!navigator.onLine) {
      this.updateState({ status: 'offline' });
      return;
    }

    if (this.isSyncing) {
      this.syncPending = true;
      return;
    }

    this.isSyncing = true;
    const sessionId = this.currentSessionId;
    const user = this.activeUser;
    this.updateState({ status: 'syncing', errorMessage: null });

    try {
      const localProfile = useGameStore.getState().profile;

      // Load latest remote cloud save to reconcile concurrent offline or remote updates
      const remotePayload = await CloudSaveService.loadCloudSave(user.uid);

      if (this.currentSessionId !== sessionId) return;

      let finalProfile = localProfile;
      let targetStardustLastSynced = localProfile.stardustLastSynced ?? localProfile.stardustReserves ?? 0;

      if (remotePayload) {
        const { mergedProfile, stardustLastSynced } = CloudSaveResolver.merge(
          localProfile,
          remotePayload.profile
        );
        finalProfile = mergedProfile;
        targetStardustLastSynced = stardustLastSynced;

        // Apply merged content without advancing stardustLastSynced yet
        const interimProfile = {
          ...mergedProfile,
          stardustLastSynced: localProfile.stardustLastSynced ?? localProfile.stardustReserves ?? 0,
        };

        this.applyCloudUpdateToStore(() => {
          useGameStore.getState().updateProfileFromCloud(interimProfile);
        });
      }

      const newPayload = CloudSaveSerializer.serializeCloudSave(
        finalProfile,
        user.email
      );

      await CloudSaveService.saveCloudSave(user.uid, newPayload);

      if (this.currentSessionId !== sessionId) return;

      // ONLY advance Stardust baseline after persistence succeeds
      this.applyCloudUpdateToStore(() => {
        useGameStore.getState().setStardustLastSynced(targetStardustLastSynced);
      });

      this.updateState({
        status: 'synced',
        lastSyncedAt: Date.now(),
        isDirty: false,
        errorMessage: null,
      });
    } catch (error: any) {
      if (this.currentSessionId !== sessionId) return;
      console.error('[SyncManager] Push sync failed:', error);
      this.updateState({
        status: 'error',
        errorMessage: error.message || 'Failed to save progress to cloud.',
      });
    } finally {
      if (this.currentSessionId === sessionId) {
        this.isSyncing = false;

        // Execute queued sync if additional local mutations occurred during sync execution
        if (this.syncPending) {
          this.syncPending = false;
          this.triggerSync();
        }
      }
    }
  }

  private handleOnline = (): void => {
    if (this.activeUser && this.state.isDirty) {
      this.triggerSync();
    } else if (this.activeUser) {
      this.updateState({ status: 'idle' });
    }
  };

  private handleOffline = (): void => {
    this.updateState({ status: 'offline' });
  };

  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.activeUser && this.state.isDirty) {
        this.triggerSync();
      }
    });
  }

  private updateState(partial: Partial<SyncState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export const syncManager = SyncManager.getInstance();
