import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { CloudSavePayload, CloudSaveMetadataDTO, CloudSaveProfileDTO } from './cloudSaveTypes';
import { CloudSaveSerializer } from './CloudSaveSerializer';

/**
 * CloudSaveService
 * Isolated Firestore storage service managing cloud save persistence under the locked path structure:
 * users/{uid}/profile/main
 * users/{uid}/metadata/main
 */
export class CloudSaveService {
  /**
   * Verify callers request matches currently authenticated Firebase Auth UID.
   */
  private static verifyUserAuthorization(uid: string): void {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('[CloudSaveService] Unauthenticated access denied: No active Firebase Auth user session.');
    }
    if (currentUser.uid !== uid) {
      throw new Error(`[CloudSaveService] Unauthorized UID mismatch: Session user '${currentUser.uid}' cannot access user '${uid}'.`);
    }
  }

  /**
   * Load Cloud Save Profile DTO from Firestore
   */
  static async loadCloudSave(uid: string): Promise<CloudSavePayload | null> {
    try {
      this.verifyUserAuthorization(uid);

      const profileDocRef = doc(db, 'users', uid, 'profile', 'main');
      const metadataDocRef = doc(db, 'users', uid, 'metadata', 'main');

      const [profileSnap, metadataSnap] = await Promise.all([
        getDoc(profileDocRef),
        getDoc(metadataDocRef),
      ]);

      if (!profileSnap.exists()) {
        return null;
      }

      const rawProfileData = profileSnap.data();
      if (!CloudSaveSerializer.validateCloudSavePayload({ profile: rawProfileData })) {
        console.warn('[CloudSaveService] Cloud save document validation failed, falling back to null.');
        return null;
      }

      const profile = rawProfileData as CloudSaveProfileDTO;
      const metadata = metadataSnap.exists()
        ? (metadataSnap.data() as CloudSaveMetadataDTO)
        : {
            createdAt: Date.now(),
            lastLoginAt: Date.now(),
            platform: 'web' as const,
            email: auth.currentUser?.email || null,
          };

      return { profile, metadata };
    } catch (error: any) {
      console.error('[CloudSaveService] Error loading cloud save:', error);
      throw error;
    }
  }

  /**
   * Write Cloud Save Payload DTO to Firestore
   */
  static async saveCloudSave(uid: string, payload: CloudSavePayload): Promise<void> {
    try {
      this.verifyUserAuthorization(uid);

      const profileDocRef = doc(db, 'users', uid, 'profile', 'main');
      const metadataDocRef = doc(db, 'users', uid, 'metadata', 'main');

      const profileData: CloudSaveProfileDTO = {
        ...payload.profile,
        updatedAt: Date.now(),
      };

      const metadataData: CloudSaveMetadataDTO = {
        ...payload.metadata,
        lastLoginAt: Date.now(),
        email: auth.currentUser?.email || payload.metadata?.email || null,
      };

      await Promise.all([
        setDoc(profileDocRef, profileData, { merge: true }),
        setDoc(metadataDocRef, metadataData, { merge: true }),
      ]);
    } catch (error: any) {
      console.error('[CloudSaveService] Error writing cloud save:', error);
      throw error;
    }
  }

  /**
   * Fetch Cloud Save Metadata
   */
  static async getCloudSaveMetadata(uid: string): Promise<CloudSaveMetadataDTO | null> {
    try {
      this.verifyUserAuthorization(uid);
      const metadataDocRef = doc(db, 'users', uid, 'metadata', 'main');
      const metadataSnap = await getDoc(metadataDocRef);

      if (!metadataSnap.exists()) return null;
      return metadataSnap.data() as CloudSaveMetadataDTO;
    } catch (error: any) {
      console.error('[CloudSaveService] Error fetching metadata:', error);
      return null;
    }
  }
}
