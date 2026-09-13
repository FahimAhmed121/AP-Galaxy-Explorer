# AP Galaxy Explorer — Testing Guide & Verification Protocols

**Document Version:** 2.0.0  
**Target Environments:** Local Windows Desktop / Production Web Container  
**Audience:** Developers, QA Engineers, and Architecture Reviewers  

---

## 1. Development & Testing Workflow

Development occurs primarily in **Google AI Studio** with local testing and verification performed on **Windows PC**:

```text
Google AI Studio (Gemini Engine)
        │
        │ Iterative coding, architectural alignment & static checks
        ▼
Download Updated Project ZIP
        │
        │ Export workspace via AI Studio interface
        ▼
Extract ZIP to Windows PC (e.g. D:\ap-galaxy-explorer-oauth-fix)
        │
        ▼
Configure Local Environment (.env)
        │
        │ Add Firebase configuration keys from your Firebase project
        ▼
Run Production & Electron Builds
        │
        │ bun run build
        │ bun run build:electron
        ▼
Launch Desktop Application in Electron
        │
        │ node_modules\.bin\electron.exe .
        ▼
Execute Verification Protocol (Sign-In, Cloud Save, Flight, Audio)
        │
        ▼
Report Results back to Google AI Studio for next iteration
```

---

## 2. Environment Configuration Guide

When extracting a newly downloaded ZIP, `.env` must be configured locally. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Environment Variable Matrix

| Variable | Target Process | Safety Level | Example / Description |
| :--- | :--- | :---: | :--- |
| `VITE_FIREBASE_API_KEY` | Client / Renderer | Safe for bundle | Firebase Public Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Client / Renderer | Safe for bundle | Firebase Auth Domain (e.g., `ap-galaxy-explorer.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Client / Renderer | Safe for bundle | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Client / Renderer | Safe for bundle | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Client / Renderer | Safe for bundle | Firebase Sender ID |
| `VITE_FIREBASE_APP_ID` | Client / Renderer | Safe for bundle | Firebase Application ID |

---

## 3. Build & Launch Commands (Windows / PowerShell)

### Step 3.1: Build Application Bundles

```powershell
# 1. Compile React Vite frontend into /dist
bun run build

# 2. Compile Electron main & preload scripts into /dist-electron
bun run build:electron
```

### Step 3.2: Launch Standalone Electron Desktop App

```powershell
# Launch Electron directly from local node_modules
node_modules\.bin\electron.exe .
```

*Alternative if using npm:*
```powershell
npm run electron:dev
```

---

## 4. Authentication & Cloud Save Verification Protocol

To verify end-to-end authentication and Firestore cloud save synchronization:

1. **Launch Desktop App**: Run `node_modules\.bin\electron.exe .`.
2. **Open Auth Modal**: In the Main Menu or top HUD, click **"Sign In"** / **"Pilot Station"**.
3. **Register or Sign In**:
   - **New Pilot**: Switch to the **Register** tab. Enter your callsign (e.g., `Commander Nova`), email address, and password (minimum 6 characters), then click **Register Pilot**.
   - **Existing Pilot**: Switch to the **Sign In** tab. Enter your registered email address and password, then click **Access Ship Systems**.
   - *Input Isolation Verified (ELEC-PLAY-01)*: In the Electron desktop build, typing flight control keys (`S`, `D`, `F`, `E`, `Space`) inside input fields functions cleanly without dropped keystrokes or unintended ship actions.
4. **Verify Session & Callsign**:
   - The UI immediately updates to display your pilot callsign, email, and authentication badge.
   - If your email is unverified, an informational banner appears with an option to **Resend Verification Email**.
5. **Verify Cloud Save Synchronization**:
   - Make a game progression change (e.g., scan a galaxy celestial object, mine stardust, or purchase an upgrade).
   - Verify the Cloud Save status indicator transitions: `idle` → `syncing` → `synced`.
   - Close the application, relaunch with `node_modules\.bin\electron.exe .`, and observe progress restoration.
   - *Restart Persistence Verified (ELEC-PLAY-02)*: Because Electron maintains a stable origin on `http://127.0.0.1:39228`, progress reliably survives complete application restarts.
6. **Verify Password Reset Flow (Optional)**:
   - In AuthModal, click **Forgot Password?** or switch to the **Reset** tab.
   - Enter your email and click **Send Recovery Link**. Confirm the green success confirmation message appears.

---

## 5. Electron Manual Playtest Results & Post-Playtest Stabilization

A comprehensive manual playtesting pass was performed on the standalone Electron desktop build (Windows environment), followed by a surgical stabilization pass and manual re-verification.

### 5.1. Verified Working Gameplay & Systems
- **Application Boot & Launch**: Clean launch via `node_modules\.bin\electron.exe .` with single-instance lock.
- **Main UI & Presentation**: Title screen, glassmorphic HUD overlays, typography, and responsive scaling functional.
- **Email/Password Authentication UI**: `AuthModal` modal presentation, tab switches (Sign In, Register, Reset), and error handling verified.
- **Phaser 2D Gameplay & Engine**: Canvas rendering, parallax starfields, and 60 FPS physics lifecycle verified.
- **Player Movement & Flight**: Inertial thrust, drag, rotation, and laser weapon firing verified.
- **Galaxy Scanning**: Proximity reticles and spectrographic beam scanning verified.
- **Galaxy Discovery**: Cinematic transition, camera lock, and AURA AI step-paginated dialogue verified.
- **Educational Learning Cards**: Authentic bilingual dossiers, astronomical tabs, and media presentation verified.
- **Scientific Quizzes**: Assessment questions, answer evaluation, immediate feedback, and score rewards verified.
- **Alien Survey Drones**: AI FSM states (Patrol, Survey, Attack), laser combat, and stardust rewards verified.
- **Core Progression Loop**: Complete flight → exploration → scanning → discovery → quiz → upgrade cycle verified.
- **In-Session Persistence**: State reliably preserved during active gameplay and across window minimize/restore during the same session.

### 5.2. Post-Playtest Stabilization Issues & Resolutions

| Issue ID | Description | Root Cause & Resolution | Verification | Status |
| :--- | :--- | :--- | :--- | :---: |
| **ELEC-PLAY-01** | **Keyboard conflict in auth & settings input fields** | *Root Cause*: Phaser's global window listeners registered keys with default captures and preventDefault.<br>*Resolution*: Set `enableCapture = false`, added DOM focus detection (`isInputFocused()`), and guarded global keys. | **Build: PASS**<br>**Manual Electron: PASSED** (Keys S/D/F/E/Space type cleanly; flight unaffected) | **RESOLVED / VERIFIED** |
| **ELEC-PLAY-02** | **Local persistence across complete Electron restart** | *Root Cause*: Dynamic port `0` rotated origin URL on every launch, isolating origin-partitioned `localStorage`.<br>*Resolution*: Deterministic loopback port binding (preferred `39228`), port persistence in `userData/app_port.json`, hardened Zustand rehydration. | **Build: PASS**<br>**Manual Electron: PASSED** (Game progress and discoveries restore after complete relaunch) | **RESOLVED / VERIFIED** |
| **ELEC-PLAY-03** | **Missing Gameplay → Home navigation** | *Root Cause*: No return path to Main Menu from in-game HUD.<br>*Resolution*: Added Home button to HUD Action Bar & Settings; non-destructively saved ship coordinates and session state; added "Resume Exploration" in Main Menu. | **Build: PASS**<br>**Manual Electron: PASSED** (Full Gameplay ↔ Home loop verified without reset or logout) | **RESOLVED / VERIFIED** |

### 5.3. Regression Testing Protocols

#### Protocol A: Form Keyboard Input Isolation (ELEC-PLAY-01)
1. Launch Electron desktop application.
2. Open `AuthModal` (Sign In / Register) or `SettingsModal`.
3. In any text input field (Callsign, Email, Password, Custom Seed), type strings containing flight control keys: e.g. `SPEED DEFENDER TEST 123`.
4. **Expected**: All characters appear in the input field without lag or drops. No Phaser sounds, thruster animations, ship rotation, or weapon firing occur in the background.
5. Blur or close the modal and resume gameplay.
6. **Expected**: Flight controls (`W`, `A`, `S`, `D`, `Space`) immediately resume normal operation.

#### Protocol B: Local Persistence Across Complete Restart (ELEC-PLAY-02)
1. Launch Electron desktop application.
2. Sign in or play as explorer; discover at least one galaxy, collect stardust, and answer a quiz.
3. Completely close the Electron application (exit the window).
4. Inspect `userData/app_port.json` to confirm the bound port (default `39228`).
5. Launch the Electron application again (`node_modules\.bin\electron.exe .`).
6. **Expected**: Discovered galaxy count, stardust balance, career XP/level, and merit badges are fully restored on the Main Menu and Pilot Station.

#### Protocol C: Gameplay → Home Navigation & Mission Resumption (ELEC-PLAY-03)
1. Launch gameplay and fly ship away from origin coordinates `(0, 0)`.
2. Click the **Home** button in the top-right Action Bar of `ShipStatusHUD` (or via Settings → Exit to Menu).
3. **Expected**: Main Menu appears immediately. Authenticated user remains signed in. Discovered galaxies and stardust are NOT reset.
4. Observe the primary action button on the Main Menu: it displays **"Resume Exploration"** instead of "Launch Mission".
5. Click **"Resume Exploration"**.
6. **Expected**: Game canvas mounts directly with previous ship coordinates, health, shield, and orientation preserved without replaying the intro sequence.

---

## 6. Security Verification Checklist

- [x] **Zero Desktop Secrets**: No third-party OAuth client secrets needed in desktop builds.
- [x] **No Secret in Client Bundle**: `dist/assets/*.js` contains zero private secrets.
- [x] **Strict Preload Context Isolation**: `electron/preload.ts` exposes only `{ isDesktop: true, platform: process.platform }`.
- [x] **No Secret in Git**: `.gitignore` safely ignores all `.env` files.
- [x] **Embedded Production HTTP Origin**: Desktop Electron serves static files from `http://127.0.0.1:<port>` (preferred `39228`), ensuring full Firebase Auth, Firestore, and localStorage compatibility without `file://` origin blocks or port drift.

---

## 7. Current Verification Matrix

| Subsystem / Feature | Status | Verification Detail |
| :--- | :---: | :--- |
| **Electron Application Launch** | **VERIFIED** | Boots cleanly via `node_modules\.bin\electron.exe .` with single instance. |
| **Main UI & Presentation** | **VERIFIED** | Glassmorphic HUD, menus, and typography verified in Electron. |
| **Phaser 2D Gameplay & Flight Physics** | **VERIFIED** | Verified player movement, inertia, rotation, weapon firing, 10 galaxies, and asteroids. |
| **Galaxy Scanning & Discovery** | **VERIFIED** | Proximity detection, spectrographic scan, and AURA dialogue verified in Electron. |
| **Educational Dossiers & Quizzes** | **VERIFIED** | Bilingual learning dossiers, NASA/JWST cards, quizzes, and score rewards verified. |
| **Alien Survey Drone Combat** | **VERIFIED** | Drone AI FSM states, defensive laser combat, and stardust rewards verified in Electron. |
| **Active Session State Persistence** | **VERIFIED** | Gameplay progress preserved during active session and survives window minimize/restore. |
| **Local Persistence Across Electron Restart** | **VERIFIED** | Origin stabilized via preferred port `39228` and `userData` persistence; verified across full restarts. |
| **Firebase Email & Password Auth UI** | **VERIFIED** | UI functional; form field keyboard isolation (ELEC-PLAY-01) verified with flight keys. |
| **Gameplay → Home Navigation** | **VERIFIED** | Non-destructive Home/Resume loop (ELEC-PLAY-03) verified with full state preservation. |
| **Vite Production Bundle (`dist/`)** | **VERIFIED** | Compiles cleanly with relative paths (`./assets/*`). |
| **Electron Main/Preload Build (`dist-electron/`)** | **VERIFIED** | Compiles cleanly with `esbuild` (0 errors). |
| **Static Production Loopback Server** | **VERIFIED** | Starts on `127.0.0.1:39228` (with fallback + persistence), path traversal protected, single-instance lock. |
| **Google OAuth Permanent Retirement** | **VERIFIED** | Purged OAuth UI, IPC channels, PKCE routines, and client secret dependencies. |
