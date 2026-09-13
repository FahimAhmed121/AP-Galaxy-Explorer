# AP Galaxy Explorer — System Architecture Document

**Target Platforms:** Cross-Platform Web & Electron Standalone Desktop  
**Tech Stack:** React 18, TypeScript, Phaser (^4.2.1), Zustand, Tailwind CSS, Web Audio API, Firebase Auth & Firestore, Electron  

---

## 1. Architectural Overview

AP Galaxy Explorer employs a decoupled, multi-tier architecture separating high-speed 60 FPS physics and rendering from state management, presentation UI, authentication, and persistent cloud storage.

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               REACT PRESENTATION LAYER                          │
│                                                                                 │
│   ┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐   │
│   │   ShipStatusHUD     │    │ PilotDashboardModal  │    │   ArchiveModal   │   │
│   └──────────┬──────────┘    └──────────┬───────────┘    └────────┬─────────┘   │
│              │                          │                         │             │
│   ┌──────────┴──────────┐    ┌──────────┴───────────┐    ┌────────┴─────────┐   │
│   │  LearningBriefing   │    │ QuizAssessmentModal  │    │ DiscoveryOverlay │   │
│   └──────────┬──────────┘    └──────────┬───────────┘    └────────┬─────────┘   │
└──────────────┼──────────────────────────┼─────────────────────────┼─────────────┘
               │                          │                         │
               ▼                          ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ZUSTAND STATE STORE                                │
│                              (`useGameStore.ts`)                                │
│                                                                                 │
│   - `profile.discoveredGalaxyIds` (Single Source of Truth)                      │
│   - `profile.stardustReserves` & `profile.totalScore`                           │
│   - `profile.xp`, `profile.level`, `profile.rankTitle`                          │
│   - `profile.unlockedBadges` & `profile.unlockedCosmetics`                      │
│   - Hardware Upgrade Levels (Engine, Shield, Cannon, Magnet)                    │
└──────────────┬──────────────────────────┬─────────────────────────┬─────────────┘
               │                          │                         │
               ▼                          ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CENTRAL DECOUPLED EVENTBUS                            │
│                                (`core/events.ts`)                               │
│                                                                                 │
│   `SCAN_COMPLETED` ──> `DISCOVERY_READY` ──> `LEARNING_STARTED` ──> `QUIZ_STARTED` │
│   `RESUME_GAMEPLAY` <── `QUIZ_PASSED` <── `UPDATE_SHIP_STATS` <── `BADGE_UNLOCKED`  │
└──────────────┬──────────────────────────┬─────────────────────────┬─────────────┘
               │                          │                         │
               ▼                          ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          PHASER ENGINE LAYER (Phaser ^4.2.1)                    │
│                                                                                 │
│   ┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐   │
│   │   GalaxyManager     │    │   AsteroidManager    │    │   PlayerShip     │   │
│   └─────────────────────┘    └──────────────────────┘    └──────────────────┘   │
│   ┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐   │
│   │ DiscoveryController │    │    ScannerSystem     │    │  InputSystem     │   │
│   └─────────────────────┘    └──────────────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Desktop Electron & Authentication Subsystem

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          ELECTRON MAIN PROCESS (`electron/main.ts`)             │
│                                                                                 │
│   - Single-Instance Lock (`app.requestSingleInstanceLock()`)                    │
│   - Sandboxed BrowserWindow (1280 x 720, `ready-to-show`)                       │
│   - Embedded Loopback HTTP Server (`http://127.0.0.1:39228` / persistent port)  │
│   - Static Asset Serving for Firebase Auth, Firestore & Storage Origin Parity   │
│   - App Lifecycle Management & Secure Navigation Filters                        │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            RENDERER CONTEXT BRIDGE                              │
│                           (`electron/preload.ts`)                               │
│                                                                                 │
│   `window.electron = { isDesktop: true, platform: '...' }`                      │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          FIREBASE AUTH SERVICE LAYER                            │
│                        (`src/services/auth/AuthService.ts`)                     │
│                                                                                 │
│   - Email & Password Authentication (`signInWithEmail`, `signUpWithEmail`)      │
│   - User Profile Management & Callsign Display Names (`updateProfile`)          │
│   - Email Verification & Password Reset Workflows                               │
│   - Emits `onAuthStateChanged` to SyncManager & Zustand Store                   │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CLOUD SAVE & SYNCMANAGER LAYER                           │
│                     (`src/services/cloudSave/SyncManager.ts`)                   │
│                                                                                 │
│   - 3-Second Debounced Auto-Sync Engine                                         │
│   - Generation-Based Session Token Tracking (`activeSyncSessionId`)             │
│   - Deterministic Conflict Resolution (`CloudSaveResolver.ts`)                  │
│   - Firestore Persistence: `users/{uid}/profile/main`                           │
│   - Security Boundary Enforcement: `firestore.rules`                            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Breakdown

### 3.1. React Presentation Layer (`src/components/`)
- **`hud/`**: High-contrast, responsive glassmorphic overlays for ship vitals (`ShipStatusHUD`), minimap radar (`RadarHUD`), AURA AI dialogue (`DiscoveryOverlay`), educational dossiers (`LearningBriefingModal`), scientific assessments (`QuizAssessmentModal`), and warp jump animations (`WarpJumpOverlay`). Includes dedicated Home navigation in `ShipStatusHUD` (ELEC-PLAY-03) that safely returns to the Main Menu without state loss.
- **`views/`**: Full-screen views for the title screen (`MainMenu`), persistent codex (`ArchiveModal`), and application settings (`SettingsModal`). Supports non-destructive mission resumption ("Resume Exploration") preserving flight coordinates and ship vitals.
- **`common/`**: Reusable containers, `AuthModal` login dialog, and `AboutCredits` portfolio.

### 3.2. Zustand State Store (`src/store/useGameStore.ts`)
- Single source of truth for player identity, discovered galaxies, stardust currency, lifetime scores, unlocked merit badges, equipped cosmetics, and ship hardware upgrades.
- Backed by client-side persistence with seamless Firestore cloud synchronization.
- **Persistence Verification Status (Post-Playtest & Stabilization)**:
  - *Verified*: Active in-session state and persistence across window minimize/restore during the same session.
  - *Resolved & Manually Verified (ELEC-PLAY-02)*: Restoring local save progress across a complete Electron application restart is resolved. The loopback server uses preferred port `39228` with origin persistence under `userData/app_port.json`. Because origin is stable across launches, origin-scoped `localStorage` reliably rehydrates into the Zustand store on every application restart.

### 3.3. EventBus Architecture (`src/core/events.ts`)
- Strongly typed publish/subscribe contract decoupling the Phaser game canvas from React UI state.
- Lifecycle events include `SCAN_COMPLETED`, `DISCOVERY_READY`, `LEARNING_STARTED`, `QUIZ_STARTED`, `QUIZ_PASSED`, `RESUME_GAMEPLAY`, `UPDATE_SHIP_STATS`, and `BADGE_UNLOCKED`.

### 3.4. Phaser Game Engine Layer (`src/phaser/`)
- **Entities**: `PlayerShip` (inertial flight, weapon firing, deflector shield, magnetic stardust vacuum), `GalaxyObject`, `SpaceStation`, `AlienSurveyDrone`, `Asteroid`.
- **Managers**: `GalaxyManager` (spatial indexing & proximity), `AsteroidManager` (cluster generation & fragmentation), `DroneManager` (AI survey probe spawning), `ParticleManager` (thruster & weapon FX).
- **Controllers & Systems**: `DiscoveryController`, `LearningController`, `QuizController`, `ScannerSystem`, `InputSystem` (hardened with DOM focus detection `isInputFocused()` to neutralize gameplay keys while typing into HTML modals, ELEC-PLAY-01), `AudioSystem`.

### 3.5. Audio Synthesis Engine (`src/engine/audioEngine.ts`)
- Procedural Web Audio API sound synthesizer generating thruster hums, laser discharges, explosion rumbles, scanner sweeps, and warp hyperdrive resonances without external audio files.

### 3.6. Cloud Save & Synchronization Layer (`src/services/cloudSave/`)
- **`cloudSaveTypes.ts`**: Schema definitions and DTO contracts (`CloudSaveProfileDTO`).
- **`CloudSaveSerializer.ts`**: Bidirectional transformation and boundary sanitization.
- **`CloudSaveResolver.ts`**: Deterministic conflict resolution rules:
  - Additive Set Union ($A \cup B$) for collections and badges.
  - Monotonic Maximum ($\max(A, B)$) for XP, level, and high scores.
  - Stardust Net-Delta Reconciliation for currency: $\text{Reconciled} = \text{Cloud} + (\text{Local} - \text{LastSynced})$.
  - Timestamp Ordering for callsign and equipped cosmetics.
- **`CloudSaveService.ts`**: Firestore read/write operations strictly locked to `users/{uid}/profile/main`.
- **`SyncManager.ts`**: 3-second debounced synchronization engine with session generation protection.
