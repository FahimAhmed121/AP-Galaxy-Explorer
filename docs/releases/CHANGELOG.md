# CHANGELOG — AP Galaxy Explorer

All notable changes, architectural iterations, and milestone updates for AP Galaxy Explorer are documented in this file.

---

## [Sprint 2.8] — 2026-09-13
### Post-Playtest Stabilization Pass (ELEC-PLAY-01, ELEC-PLAY-02, ELEC-PLAY-03) — Completed & Verified
- **Form Keyboard Input Isolation (ELEC-PLAY-01) — RESOLVED & MANUALLY VERIFIED:**
  - Configured Phaser key registration to non-capturing mode (`enableCapture = false`), cleared default cursor key captures, and disabled default key event interception.
  - Implemented centralized DOM focus detection (`isInputFocused()`) checking for active `<input>`, `<textarea>`, `<select>`, or content-editable elements, neutralizing gameplay controls while the pilot types into form fields.
  - Guarded global window listeners for `Tab` and `KeyP` in `GameCanvas.tsx` against form field focus.
  - *Manual Electron Verification*: PASSED. Text entry in `AuthModal` and `SettingsModal` fields accepts `S`, `D`, `F`, `E`, `Space`, and all other keys cleanly without triggering ship acceleration, turning, or weapon discharge. Normal gameplay controls resume immediately upon blur/exit.
- **Electron Restart Local Persistence (ELEC-PLAY-02) — RESOLVED & MANUALLY VERIFIED:**
  - Resolved root cause: The production embedded loopback server previously bound to dynamic port `0` (`listen(0, '127.0.0.1')`), changing the origin (`http://127.0.0.1:<port>`) on every launch and isolating `localStorage`/`IndexedDB` data across restarts.
  - Implemented deterministic port binding with preferred port `39228`, fallback candidate checking (`+1`, `+2`, `+3`), and port persistence via `userData/app_port.json` in `electron/main.ts`.
  - Hardened Zustand `merge` logic and rehydration lifecycle in `useGameStore.ts` with diagnostic logging to safeguard profile, stardust, badges, quizzes, and ship state.
  - *Manual Electron Verification*: PASSED. Progress survives a complete application shutdown and relaunch in the local standalone Electron desktop application; explorer profile, discovered galaxies, and progression metrics restore intact.
- **Gameplay → Home Navigation (ELEC-PLAY-03) — RESOLVED & MANUALLY VERIFIED:**
  - Added a dedicated Home navigation button to the top-right Action Bar in `ShipStatusHUD.tsx`.
  - Added an exit action to `SettingsModal.tsx` when accessed from active gameplay.
  - Wired `onExitToMenu` in `App.tsx` to non-destructively save active ship coordinates and vitals into `useGameStore.savedShipState` without signing out, resetting progress, or wiping discoveries.
  - Updated `MainMenu.tsx` with active mission detection, displaying a contextual "Resume Exploration" action that returns the player directly to active space flight without replaying the intro cutscene.
  - *Manual Electron Verification*: PASSED. Navigation loop (`Gameplay → Home → Main Menu → Resume Exploration → Gameplay`) verified with full state preservation.
- **Build Verification:**
  - `bunx tsc --noEmit` — PASS (0 errors)
  - `bun run build` — PASS (Vite production bundle generated cleanly)
  - `bun run build:electron` — PASS (Electron main and preload bundles compiled cleanly via esbuild)
- **Configuration Safety:**
  - `.env` and `.env.example` remain unchanged.
  - Direct Firebase Email/Password authentication retained; Google OAuth remains permanently retired.
  - Dependencies and package definitions remain unchanged.
  - Core gameplay mechanics, flight physics, and rendering remain untouched.

---

## [Sprint 2.7] — 2026-09-11
### Permanent Retirement of Google OAuth & Native Firebase Authentication
- **Permanently Dropped "Continue with Google" Feature:**
  - Removed "Continue with Google" button, OAuth loading spinners, and Google icons from `src/components/auth/AuthModal.tsx`.
  - Removed `signInWithGoogle` method and `ElectronAuthResult` types from `electron/preload.ts` and `src/vite-env.d.ts`.
  - Purged ephemeral OAuth loopback HTTP listener, PKCE SHA-256 generation, Google token exchange HTTPS POST (`postFormUrlEncoded`), and `auth:google-sign-in` IPC handler from `electron/main.ts`.
  - Removed `signInWithGoogle`, `GoogleAuthProvider`, and `signInWithCredential` from `src/services/auth/AuthService.ts` and `src/services/firebase.ts`.
  - Removed `GOOGLE_DESKTOP_CLIENT_SECRET` and `VITE_GOOGLE_DESKTOP_CLIENT_ID` from `.env.example`.
- **Preserved & Hardened Core Architecture:**
  - Standardized on direct Firebase Email & Password Authentication (`signInWithEmail`, `signUpWithEmail`, `updateProfile`, `sendEmailVerification`, `sendPasswordResetEmail`, `signOut`).
  - Preserved Electron's embedded local HTTP production server (`http://127.0.0.1:<port>`) for standard HTTP origin compatibility with Firebase Auth and Firestore.
  - Retained Firestore Cloud Save, SyncManager 3-second debouncing, session generation locks, and deterministic conflict resolution.
- **Documentation Audit:**
  - Fully synchronized `docs/AUTHENTICATION.md`, `docs/ARCHITECTURE.md`, `docs/TESTING_GUIDE.md`, `README.md`, `PROJECT_STATE.md`, and `DEVELOPMENT_ROADMAP.md` to reflect the updated architecture.

---

## [Sprint 2.6.5] — 2026-08-20
### QA Remediation & Stability Hardening
- **Cloud Sync Session Concurrency (SYNC-001):**
  - Implemented generation-based session tracking (`activeSyncSessionId`) in `SyncManager.ts` to isolate rapid login/logout auth transitions.
- **Timestamp Conflict Resolution (SYNC-002):**
  - Added `updatedAt` tracking in `useGameStore.ts` and deterministic timestamp precedence in `CloudSaveResolver.ts` for callsigns and equipped cosmetics/perks.
- **Electron Navigation Hardening (SEC-001):**
  - Enforced strict loopback origin matching and prevented unauthorized protocol navigation in `electron/main.ts`.
- **Firestore Rules Hardening (SEC-002 / SEC-003):**
  - Added upper/lower numeric bounds validation on progression fields and strict metadata subcollection schema rules in `firestore.rules`.
- **Single-Instance Startup (ELEC-001):**
  - Structured single-instance locking in `electron/main.ts` with early exit and duplicate window prevention.
- **Listener Memory Cleanup (LEAK-001):**
  - Bound and properly unregistered `SCANNER_INTERFERENCE_CHANGED` event listeners on system destruction in `ScannerVisualSystem.ts`.
- **Offline Font Reliability (BUILD-001):**
  - Replaced external CSS font imports with local system fallback stacks in `src/index.css`.
- **Finite Numeric Validation (DATA-001):**
  - Guarded XP, Stardust, and score arithmetic against `NaN` and `Infinity` across store, serializer, and resolver layers.

---

## [Sprint 2.6] — 2026-08-15
### Electron Desktop Release
- **Phase 1 (Core & Build):** Sandboxed Electron main process (`electron/main.ts`), preload bridge (`electron/preload.ts`), Vite relative asset base (`base: './'`), dual-target `esbuild` pipeline.
- **Phase 2 (Window Lifecycle):** Single-instance lock, window dimensioning ($1280 \times 720$), `ready-to-show` visual gating, embedded local loopback HTTP production server (`127.0.0.1:<port>`).
- **Phase 3 (Release Candidate):** Release candidate audit, packaged application validation, and security boundary audit.

---

## [Sprint 2.5] — 2026-08-01
### Firebase Authentication & Cloud Save
- **Authentication Foundation:** Firebase Web SDK integration, `AuthService.ts` supporting Google OAuth and Email/Password, session management, and `AuthModal.tsx`.
- **Cloud Save & Serialization:** DTOs (`CloudSaveProfileDTO`), `CloudSaveSerializer.ts` boundary validation, `CloudSaveResolver.ts` deterministic field-by-field conflict resolution (Additive Set Union, Monotonic Max, Stardust Net-Delta Reconciliation), and `CloudSaveService.ts` Firestore operations.
- **Sync Manager & UI:** `SyncManager.ts` 3-second debounced auto-sync, dirty state tracking, reentrancy guards, session generation tokens, offline/online recovery, and Cloud Sync badges.

---

## [Sprint 2.4.5] — 2026-07-20
### Educational Content & Media Polish
- Complete 5-card bilingual (EN/BN) educational dossiers for all 10 core galaxies.
- 50-question scientific quiz expansion (5 questions per galaxy).
- High-resolution astronomical image integration with fallback system.
- In-app YouTube video tours and learning card replayability via Galactic Archive.

---

## [Sprint 2.4] — 2026-07-10
### Alien Survey Drones
- Autonomous AI survey drones (`AlienSurveyDrone.ts`) with 5-state AI FSM (PATROL, SURVEY, INVESTIGATE, ATTACK, RETURN).
- Off-screen galaxy-centric sector spawning (`DroneManager.ts`), proximity-driven AURA alerts, defensive plasma laser combat, and Stardust/XP rewards.

---

## [Sprint 2.3] — 2026-06-25
### Explorer Progression & Cosmetic Unlocks
- 15 Explorer levels and rank titles (Space Cadet → Master Voyager of the Cosmos).
- Explorer XP reward pipeline and 7 Merit Badges across 4 categories.
- 12 customizable cosmetics (Ship Skins, Thruster Effects, Scanner Effects) and 5 Passive Perks.

---

## [Sprint 2.2 & 2.2.1] — 2026-06-10
### Asteroids, Stardust Economy & Ship Progression
- Procedural Phaser-based `AsteroidManager.ts`, organic asteroid clusters, plasma cannon laser combat, and fragmentation physics.
- 4-tier Pilot Dashboard upgrade progression system (Ion Engine, Deflector Shield, Plasma Cannon, Vacuum Dust Magnet).

---

## [Sprint 2.1 & 2.1.1] — 2026-05-25
### Discovery Log & Galactic Archive
- Persistent Galactic Archive (`ArchiveModal.tsx`), search filtering, morphology classification filters, and quiz retake capability.
- Unified single source of truth using Zustand (`profile.discoveredGalaxyIds`) and bidirectional EventBus synchronization.

---

## [Sprint 2.0] — 2026-05-10
### Adaptive Quiz & Scientific Assessment
- Dedicated `QuizController.ts`, lazy-loaded dataset pipeline (`quizPipeline.ts`), NASA Mission Console UI (`QuizAssessmentModal.tsx`), and score rewards.

---

## [Quality Sprint 1.0 & Stabilization] — 2026-04-25
- Flight physics tuning, 100-point Plasma Energy system, multi-phase hyperdrive warp jump animation (`WarpJumpOverlay.tsx`), 2D minimap (`RadarHUD.tsx`), and EventBus stabilization.
