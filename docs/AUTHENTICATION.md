# AP Galaxy Explorer — Authentication Architecture & Security Guide

**Document Version:** 3.0.0  
**Target Platforms:** Cross-Platform Web & Standalone Windows/macOS/Linux Desktop (Electron)  
**Security Level:** High (Direct Firebase Authentication, Embedded Origin Loopback, Zero Desktop Secret Dependencies)  

---

## 1. Executive Summary

AP Galaxy Explorer utilizes direct **Firebase Authentication** for user identity, authentication state management, and **Cloud Firestore** cloud-save telemetry synchronization.

In Sprint 2.7, **Google OAuth was permanently retired** across all platforms in favor of native, robust **Email & Password Authentication**:
- **Cross-Platform Parity:** Web browsers and Electron desktop use the identical, direct Firebase Authentication SDK.
- **Zero Third-Party Dependencies:** No external OAuth redirect handlers, PKCE verifiers, browser-hopping context switches, or client secret exchanges are required.
- **Complete Feature Set:** Full support for User Registration, Display Name/Callsign assignment, Email Verification, Secure Sign-In, Password Reset links, and Session Termination (Sign Out).
- **Embedded Desktop Server:** Standalone Electron runs an embedded local static HTTP server on `http://127.0.0.1:<port>` to provide an authorized HTTP origin required by Firebase Auth and Firestore, completely avoiding the restrictive `file://` protocol.

---

## 2. Authentication Flow & State Architecture

### 2.1. Authentication Architecture Sequence

```text
[User / Explorer Interface]
        │
        │ 1. Opens AuthModal ("EXPLORER AUTHENTICATION")
        │ 2. Selects: Sign In, Register, or Reset Password
        ▼
[AuthModal Component (`src/components/auth/AuthModal.tsx`)]
        │
        │ 3. Collects credentials (email, password, callsign)
        │ 4. Invokes AuthService method:
        │    - AuthService.signInWithEmail(email, password)
        │    - AuthService.signUpWithEmail(email, password, callsign)
        │    - AuthService.sendPasswordReset(email)
        ▼
[AuthService (`src/services/auth/AuthService.ts`)]
        │
        │ 5. Interacts directly with Firebase Auth SDK:
        │    - signInWithEmailAndPassword(auth, email, password)
        │    - createUserWithEmailAndPassword(auth, email, password)
        │    - updateProfile(user, { displayName })
        │    - sendEmailVerification(user)
        │    - sendPasswordResetEmail(auth, email)
        ▼
[Firebase Authentication Backend]
        │
        │ 6. Validates credentials, issues JWT token and Firebase User record
        ▼
[AuthService & Zustand / Session Bridge]
        │
        │ 7. onAuthStateChanged listener triggers automatically
        │ 8. Emits authenticated User object (uid, email, displayName, emailVerified)
        ▼
[SyncManager & Cloud Save (`src/services/cloudSave/SyncManager.ts`)]
        │
        │ 9. Detects authenticated user session
        │ 10. Loads player profile from Firestore (`users/{uid}/profile/main`)
        │ 11. Reconciles local progress with cloud progress via CloudSaveResolver
```

---

## 3. Permanent Retirement of Google OAuth

### 3.1. Rationale for Removal
Previous iterations attempted to integrate Google OAuth on desktop via custom loopback ports, PKCE generation, browser redirection, and token exchange. This introduced:
1. Friction with desktop client secret distribution and configuration.
2. Inconsistent OS browser redirects, port collision risks, and firewall interruptions.
3. Complex maintenance of multiple distinct authentication code paths across web and desktop.

### 3.2. Retired Components
The following Google OAuth components were surgically excised:
- **UI:** The "Continue with Google" button, OAuth loading spinners, and Google branding in `src/components/auth/AuthModal.tsx`.
- **Preload Bridge:** `signInWithGoogle` method and token exchange types in `electron/preload.ts` and `src/vite-env.d.ts`.
- **Main Process:** Ephemeral loopback HTTP OAuth listener, PKCE SHA-256 generation, Google token exchange HTTPS POST (`postFormUrlEncoded`), and IPC handler `auth:google-sign-in` in `electron/main.ts`.
- **Auth Service:** `signInWithGoogle`, `GoogleAuthProvider`, and `signInWithCredential` in `src/services/auth/AuthService.ts`.
- **Environment:** `GOOGLE_DESKTOP_CLIENT_SECRET` and `VITE_GOOGLE_DESKTOP_CLIENT_ID` in `.env.example`.

### 3.3. Retained & Strengthened Components
- **Manual Authentication:** Complete email/password registration, login, profile name updating, email verification dispatch, and password reset workflows.
- **Firebase Core:** Initialized Firebase Auth singleton (`auth`) and Firestore singleton (`db`) in `src/services/firebase.ts`.
- **Embedded Production Server:** The Electron production loopback static file server (`http://127.0.0.1:<port>`, using preferred port `39228` with origin persistence under `userData`) serving `dist/` is maintained to satisfy Firebase Auth and Firestore origin requirements without running into `file://` security sandbox blocks or port drift.
- **Cloud Save & SyncManager:** Full Firestore synchronization, offline queueing, optimistic local cache, and conflict resolution based on `auth.currentUser.uid`.

---

## 4. Security Model

### 4.1. Zero-Secret Architecture
With Google OAuth retired:
- **No Client Secrets:** There are **zero** confidential secrets required in either the Electron main process or client bundles.
- **Public Identifiers Only:** Firebase environment variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.) are public client configuration identifiers intended for web/desktop clients.
- **Origin Isolation:** Electron's preload script (`electron/preload.ts`) exposes only safe platform flags (`isDesktop: true`, `platform: process.platform`) with zero Node.js execution primitives or token handlers exposed to the DOM.

### 4.2. Environment Configuration
Required variables in `.env`:
```env
# Firebase Client-Side Configuration
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="ap-galaxy-explorer.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="ap-galaxy-explorer"
VITE_FIREBASE_STORAGE_BUCKET="ap-galaxy-explorer.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

---

## 5. Troubleshooting & Diagnostics

### 5.1. `auth/invalid-credential` or `auth/wrong-password`
- **Cause:** Incorrect email or password entered.
- **Resolution:** Check typos or use the "Reset" tab in the AuthModal to dispatch a password reset email.

### 5.2. `auth/email-already-in-use`
- **Cause:** Attempting to register an email address that already has an account.
- **Resolution:** Switch to the "Sign In" tab or request a password reset if credentials were forgotten.

### 5.3. `auth/weak-password`
- **Cause:** Password does not meet the minimum length (at least 6 characters).
- **Resolution:** Supply a password of 6 characters or more.

### 5.4. Email Verification Not Arriving
- **Cause:** Email provider filtering or spam folder placement.
- **Resolution:** Inspect Spam/Junk folder. Use the "Resend Verification Email" button in the pilot profile panel within the AuthModal.

### 5.5. [Resolved] Keyboard Conflict in Auth Input Fields in Electron (ELEC-PLAY-01)
- **Previous Observed Behavior:** In the standalone Electron desktop runtime, when typing into the Email and Password text inputs in `AuthModal.tsx`, keys that correspond to gameplay flight controls (specifically `S`, `D`, `F`, `E`) could fail to enter into the text field or trigger unintended ship flight/combat actions.
- **Browser Behavior:** This issue did **NOT** occur in standard browser environments (such as the Google AI Studio preview), where input typing functioned normally.
- **Root Cause:** Phaser's keyboard input system registered mapped keys with global capture and preventDefault behaviors on `window`. When HTML form inputs received focus, keydown events still dispatched to Phaser game systems.
- **Implemented Solution:**
  1. Disabled default Phaser key captures (`enableCapture = false`), cleared captures via `clearCaptures()`, and disabled default event interception.
  2. Implemented active DOM focus detection (`isInputFocused()`) in `InputSystem.ts` that detects when `<input>`, `<textarea>`, `<select>`, or content-editable elements are focused, neutralizing gameplay controls.
  3. Added input element guards to `GameCanvas.tsx`'s window key listeners for `Tab` and `KeyP`.
- **Verification:**
  - `bunx tsc --noEmit` — PASS
  - `bun run build` — PASS
  - `bun run build:electron` — PASS
  - **Manual Electron Verification**: PASSED. Manually tested in the local standalone Electron application. All keys (including `S`, `D`, `F`, `E`, `Space`) type cleanly into authentication and settings fields without dropped keystrokes or background ship actions. Controls resume normally upon blur.
- **Status:** **RESOLVED / VERIFIED (Sprint 2.8 Stabilization Pass)**
- **Configuration Note:** Current `.env` and Firebase initialization parameters in `src/services/firebase.ts` are verified correct and remain unchanged. Google OAuth remains permanently retired and will not be reintroduced.
