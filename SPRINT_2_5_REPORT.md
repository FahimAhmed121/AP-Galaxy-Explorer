# SPRINT_2_5_REPORT.md — Firebase Authentication & Cloud Save Completion Report

**Milestone:** Sprint 2.5 — Firebase Authentication & Cloud Save  
**Date:** 2026-08-15  
**Auditor:** AP Galaxy Explorer Architecture Team  
**Status:** ✅ **COMPLETED & VERIFIED**

---

## 1. Executive Summary

Sprint 2.5 successfully implemented a robust, decoupled, and secure Firebase Authentication and Cloud Save synchronization architecture for **AP Galaxy Explorer V2**. The system enables cross-device player profile synchronization, authenticated cloud backups, guest/anonymous migration, and deterministic conflict resolution while preserving offline gameplay and zero latency during high-speed space flight.

All subsystems were built with clean architectural boundaries, keeping Firebase and Firestore dependencies strictly isolated from the Phaser rendering engine and Web Audio synthesis layers.

---

## 2. Sprint 2.5 Phases & Implemented Subsystems

### Phase 1: Firebase SDK & AuthService Foundation
* **Firebase Configuration (`src/services/firebase.ts`)**:
  * Initialized Firebase Web SDK singleton with resilient fallback parameters.
  * Configured `GoogleAuthProvider` with `select_account` prompt.
  * Exported typed singletons: `app`, `auth`, `db`.
* **Auth Service (`src/services/auth/AuthService.ts`)**:
  * Implemented Google OAuth popup authentication (`signInWithGoogle`).
  * Implemented Email & Password sign-in (`signInWithEmail`) and account registration (`signUpWithEmail`).
  * Implemented password reset email dispatch (`sendPasswordReset`) and email verification (`sendEmailVerification`).
  * Implemented session sign-out (`signOut`) and auth state listener subscription (`onAuthStateChanged`).
  * Structured human-readable error formatting for all Firebase error codes.
* **Authentication UI (`src/components/common/AuthModal.tsx`)**:
  * Created NASA Mission Control themed modal supporting Google One-Click Login, Email/Password Login, and Account Registration with form validation and error handling.

### Phase 2: Cloud Save Service & Serialization Layer
* **Data Transfer Objects (`src/services/cloudSave/cloudSaveTypes.ts`)**:
  * Defined `CloudSaveProfileDTO`, `CloudSaveMetadataDTO`, and `CloudSavePayload` with schema versioning (`schemaVersion: 1`, `appVersion: '2.5.0'`).
* **Deterministic Serialization (`src/services/cloudSave/CloudSaveSerializer.ts`)**:
  * Implemented bidirectional conversion between Zustand `ExplorerProfile` and Firestore DTOs.
  * Enforced sanitization bounds (string trims, array caps, numeric clamps) to prevent data corruption.
  * Implemented payload validation (`validateCloudSavePayload`).
* **Field-by-Field Conflict Resolver (`src/services/cloudSave/CloudSaveResolver.ts`)**:
  * **Additive Set Union ($A \cup B$):** Applied to `discoveredGalaxyIds`, `unlockedBadges`, `unlockedCosmetics`, and `unlockedPerks`.
  * **Monotonic Max ($\max(A, B)$):** Applied to Explorer XP, career level, lifetime drone encounters, drones defeated, total score, and per-galaxy quiz best scores.
  * **Stardust Net-Delta Reconciliation:** Tracks `stardustLastSynced` baseline so locally earned or spent Stardust across sessions is reconciled additively ($\text{Reconciled} = \text{Cloud} + (\text{Local} - \text{LastSynced})$), eliminating lost currency or infinite duplication exploits.
  * **Timestamp Ordering:** Preserves newest callsigns, equipped cosmetics, and active perks based on `updatedAt` timestamps.
* **Firestore Storage Service (`src/services/cloudSave/CloudSaveService.ts`)**:
  * Implemented isolated document operations targeting locked Firestore paths:
    * `users/{uid}/profile/main`
    * `users/{uid}/metadata/main`
  * Added strict client-side session authorization guards (`verifyUserAuthorization(uid)`).
* **Firestore Security Rules (`firestore.rules`)**:
  * Enforced document ownership checks (`request.auth.uid == userId`).
  * Validated schema attributes, payload sizes, string lengths, and numeric ranges.

### Phase 3: Sync Manager & UI Integration
* **Synchronization Orchestrator (`src/services/cloudSave/SyncManager.ts`)**:
  * Implemented debounced background synchronization ($3000\text{ ms}$ debounce timer).
  * Implemented dirty-state tracking subscribed to Zustand store mutations (`useGameStore.subscribe`).
  * Implemented reentrancy protection (`applyCloudUpdateToStore`) to prevent cloud sync writes from triggering false local dirty flags.
  * Managed session generation tokens (`currentSessionId`) to isolate rapid user login/logout/switch transitions.
  * Managed browser online/offline event listeners and tab visibility synchronization (`visibilitychange`).
  * Protected Stardust baseline advancement: `stardustLastSynced` is updated in local state **only after** Firestore write confirmation.
* **UI Integration**:
  * Integrated Cloud Sync Badge in `ShipStatusHUD` and `PilotDashboardModal` indicating real-time sync state (`idle`, `syncing`, `synced`, `pending`, `offline`, `error`).
  * Integrated User Identity header in `MainMenu` and `SettingsModal` with Login / Logout buttons and auth state feedback.

---

## 3. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Zustand Reactive Store                   │
│                     (`useGameStore.ts`)                     │
└──────────────┬───────────────────────────────▲──────────────┘
               │ Local Profile Mutations       │ Merged Cloud State
               ▼                               │
┌──────────────────────────────┐ ┌─────────────┴──────────────┐
│         SyncManager          │ │      CloudSaveResolver     │
│  - 3s Debounced Auto-Sync    │ │  - Additive Set Union (∪)  │
│  - Dirty State Tracking      │ │  - Monotonic Max (XP/Score)│
│  - Session Generation Guard  │ │  - Stardust Net-Delta      │
└──────────────┬───────────────┘ └─────────────▲──────────────┘
               │                               │
               ▼                               │
┌──────────────────────────────┐               │
│     CloudSaveSerializer      │               │
│  - Validate Payload Bounds   │               │
│  - DTO Transformation        │               │
└──────────────┬───────────────┘               │
               │ CloudSavePayload              │
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│                      CloudSaveService                       │
│  - UID Session Guard                                        │
│  - Firestore Read/Write: users/{uid}/profile/main           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Google Firestore                       │
│                   (Security Rules Locked)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Verification & Validation

* **Type Safety (`lint_applet`):** `tsc --noEmit` passed with 0 errors.
* **Compilation (`compile_applet`):** Vite production build compiled successfully.
* **Regression Testing:** Verified that all offline gameplay loops, Phaser scenes, asteroid mining, drone combat, spectrographic scanning, and quiz pipelines execute seamlessly without network or Firebase dependency.
* **Session Isolation:** Verified that logging out clears active sync listeners and prevents background timers from overwriting subsequent user profiles.

---

## 5. Milestone Status

**Sprint 2.5 is 100% COMPLETE and locked.**
Sprint 2.6 builds directly upon this completed foundation.
