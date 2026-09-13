# AP Galaxy Explorer V2 — Astronomy Pathshala

An interactive 2D astronomy exploration game and educational platform built with **React 18**, **TypeScript**, **Phaser (^4.2.1)**, **Zustand**, **Tailwind CSS**, **Firebase Authentication & Cloud Save**, and **Web Audio API**. Designed for high-performance cross-platform Web deployment and standalone Desktop execution via **Electron**.

---

## 🚀 Architectural Overview & Folder Structure

```text
/
├── .env.example                # Template for environment variables (Vite & Electron)
├── firestore.rules             # Security rules for user profile & cloud save
├── index.html                  # Main DOM entry HTML
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler configuration (relative asset paths)
│
├── electron/                   # Electron Desktop Architecture
│   ├── main.ts                 # Main process (Loopback static server, single instance, sandboxing)
│   └── preload.ts              # Secure preload context bridge (window.electron)
│
├── docs/                       # Technical Specifications & Guides
│   ├── ARCHITECTURE.md         # Full system architecture specification
│   ├── AUTHENTICATION.md       # In-depth Firebase Auth & Cloud Save guide
│   ├── ENGINEERING_STANDARDS.md# Engineering rules, patterns, and conventions
│   ├── TESTING_GUIDE.md        # Step-by-step test & verification protocols
│   ├── DISCOVERY_SYSTEM_ARCHITECTURE.md
│   ├── DRONE_SYSTEM_ARCHITECTURE.md
│   ├── GALAXY_SYSTEM_ARCHITECTURE.md
│   ├── LEARNING_SYSTEM_ARCHITECTURE.md
│   ├── QUIZ_SYSTEM_ARCHITECTURE.md
│   ├── SCANNER_SYSTEM_ARCHITECTURE.md
│   └── UNIVERSE_ARCHITECTURE.md
│
└── src/
    ├── main.tsx                # Application entry point
    ├── App.tsx                 # Main application shell & view switcher
    ├── index.css               # Global CSS & Tailwind directives
    │
    ├── components/             # React UI Component Hierarchy
    │   ├── common/             # Reusable UI elements (AuthModal, AboutCredits, Certificate)
    │   ├── educational/        # Astronomy dossiers, quiz modals, certificates
    │   ├── hud/                # Glassmorphic HUDs (Status, Radar, Pilot Dashboard, AURA)
    │   └── views/              # Full-screen views (MainMenu, Archive, Settings)
    │
    ├── core/                   # Shared Infrastructure & Contracts
    │   ├── config.ts           # Game physics, energy, and world configurations
    │   ├── constants.ts        # World bounds (8000x8000 px) & application constants
    │   ├── errors.ts           # Custom error definitions
    │   ├── events.ts           # Decoupled EventBus interfaces & payload contracts
    │   ├── logger.ts           # Diagnostic logging utility
    │   └── types.ts            # Global TypeScript types (Ship, Profile, Quiz, Cosmetics)
    │
    ├── data/                   # Educational & Gameplay Data Registries
    │   ├── educational/        # Handcrafted 5-card bilingual dossiers for 10 galaxies
    │   ├── quizzes/            # 50-question scientific quiz datasets
    │   ├── contentPipeline.ts  # Fallback-protected dossier loader
    │   ├── quizPipeline.ts     # Asynchronous quiz evaluator
    │   ├── galaxies.json       # Master catalog of 10 galaxies & spatial coordinates
    │   └── progressionData.ts  # 15 Explorer ranks, merit badges, cosmetics & perks
    │
    ├── engine/                 # Web Audio Procedural Synthesis
    │   └── audioEngine.ts      # Procedural sound synthesizer (lasers, engines, ambient)
    │
    ├── phaser/                 # Phaser 2D Game Engine Architecture
    │   ├── entities/           # PlayerShip, Asteroid, GalaxyObject, SpaceStation, Drone
    │   ├── managers/           # GalaxyManager, AsteroidManager, DroneManager, WorldManager
    │   ├── scenes/             # MainGameplayScene
    │   └── systems/            # InputSystem, ScannerSystem, DiscoveryController
    │
    ├── services/               # External & Cloud Services
    │   ├── auth/               # Firebase Authentication wrapper (Email/Password)
    │   ├── cloudSave/          # Cloud Save, Conflict Resolver, DTOs & SyncManager
    │   └── firebase.ts         # Firebase App & SDK Singleton
    │
    ├── store/                  # State Management (Zustand with localStorage fallback)
    │   └── useGameStore.ts
    │
    └── utils/                  # Helper Utilities (Math, formatting)
        └── mathUtils.ts
```

---

## 🛠️ Tech Stack

- **UI & Presentation:** React 18, Tailwind CSS, Lucide React, Motion
- **Game Engine & Renderer:** Phaser `^4.2.1` (WebGL / 2D Canvas)
- **State Management:** Zustand with LocalStorage fallback persistence
- **Authentication:** Firebase Authentication (Email & Password with Verification & Password Reset)
- **Cloud Database:** Firebase Cloud Firestore (with deterministic conflict resolution)
- **Audio Engine:** Custom procedural synthesizer using Web Audio API
- **Desktop Runtime:** Electron Framework (Sandboxed, Loopback Static Server, Single-Instance Lock)

---

## 🔄 Development & Testing Workflow

Development is driven iteratively in **Google AI Studio** with local execution and verification on **Windows PC**:

```text
Google AI Studio (Gemini) ──> Download ZIP ──> Extract to Windows ──> Local Build & Electron Test ──> Report Results
```

1. **Modify Codebase**: Development performed in Google AI Studio.
2. **Download & Extract**: Download updated ZIP package and extract to local workspace.
3. **Configure Environment**: Copy `.env.example` to `.env` and fill in required Firebase credentials.
4. **Build & Execute**: Compile assets and run Electron directly.

---

## ⚙️ Environment Configuration

| Variable Name | Scope | Security Level | Purpose |
| :--- | :--- | :---: | :--- |
| `VITE_FIREBASE_API_KEY` | Client / Vite | Safe for bundle | Firebase Public Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Client / Vite | Safe for bundle | Firebase Authentication Domain |
| `VITE_FIREBASE_PROJECT_ID` | Client / Vite | Safe for bundle | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Client / Vite | Safe for bundle | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| Client / Vite | Safe for bundle | Firebase Cloud Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Client / Vite | Safe for bundle | Firebase Application ID |

---

## 💻 Build & Run Commands

### 1. Web Application (Development)
```bash
# Start local Vite development server on port 3000
bun dev
# or: npm run dev
```

### 2. Desktop Application (Production Bundling & Launch)
```powershell
# Step 1: Compile React Vite frontend into /dist
bun run build

# Step 2: Compile Electron main & preload scripts into /dist-electron
bun run build:electron

# Step 3: Launch Desktop Application in Electron
node_modules\.bin\electron.exe .
# or: npm run electron:dev
```

---

## 🔐 Authentication & Cloud Save Architecture

Firebase Authentication operates seamlessly across both Web and Electron Desktop environments:

1. **Direct Registration & Login:** The user registers or signs in using Email & Password directly through `AuthModal.tsx` and `AuthService.ts`.
2. **Callsign & Profile:** Upon registration, the pilot's callsign is attached directly to the Firebase profile (`updateProfile`).
3. **Verification & Recovery:** Full support for email verification dispatch (`sendEmailVerification`) and password recovery links (`sendPasswordResetEmail`).
4. **Embedded Desktop Loopback Server:** In standalone desktop mode, Electron serves the production bundle over `http://127.0.0.1:<port>` (using preferred port `39228` with origin persistence under `userData`), providing consistent HTTP origin parity across restarts for Firebase Auth, Firestore, and `localStorage`.
5. **SyncManager Auto-Sync:** `SyncManager.ts` syncs player profile data with Cloud Firestore (`users/{uid}/profile/main`) using 3-second debouncing, session generation locks, and deterministic conflict resolution (Additive Set Union, Monotonic Max, Stardust Net-Delta).

For complete technical details and troubleshooting, see **[`docs/AUTHENTICATION.md`](./docs/AUTHENTICATION.md)** and **[`docs/TESTING_GUIDE.md`](./docs/TESTING_GUIDE.md)**.

---

## 📊 Current Development Status

- **Sprint 2.5 (Completed & Verified)**: Firebase Authentication & Cloud Save.
- **Sprint 2.6 (Completed & Audited)**: Electron Desktop Release.
  - *Phase 1 (Completed & Audited)*: Electron Core, Sandboxing & Dual-Target Build Pipeline.
  - *Phase 2 (Completed & Audited)*: Window Lifecycle, Single-Instance Lock & Loopback Asset Server.
  - *Sprint 2.6.5 (Completed & Verified)*: QA Remediation, Session Concurrency & Navigation Hardening.
  - *Phase 3.1–3.5 (Completed & Audited)*: Release Candidate Audit, Build Verification & Package Hardening.
- **Sprint 2.7 (Completed & Verified)**: Permanent retirement of Google OAuth in favor of robust, direct Firebase Email/Password Authentication.
  - *Phase 3.6 (Completed & Verified)*: Windows Desktop Manual Playtest. Core flight, scanning, discovery, quizzes, learning dossiers, and drone combat verified in Electron runtime.
- **Sprint 2.8 (Post-Playtest Stabilization & Release Hardening)**:
  - **Core gameplay**: Working (Verified)
  - **Electron launch**: Working (Verified)
  - **Electron gameplay**: Working (Verified)
  - **Authentication**: Working baseline; form keyboard conflict (ELEC-PLAY-01) resolved and manually verified
  - **Local persistence across Electron restart**: Origin stabilized (ELEC-PLAY-02); resolved and manually verified
  - **Gameplay → Home navigation**: In-game HUD/Settings loop (ELEC-PLAY-03); resolved and manually verified
  - **Status**: **Electron Stabilization Pass — COMPLETE / VERIFIED**
  - **Next Phase**: **Release Hardening / Final QA**
