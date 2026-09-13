# PROJECT_STATE.md — AP Galaxy Explorer Master State

## 1. Project Overview

- **Purpose**: Astronomy Pathshala (AP) Galaxy Explorer is an interactive, space-themed educational simulation that combines 2D space flight, real-time spectrographic galaxy scanning, cinematic discovery reveals, interactive NASA/JWST/Hubble educational dossiers, and adaptive scientific quizzes.
- **Target Audience**: Students, astronomy enthusiasts, self-learners, and science educators seeking an engaging visual platform to explore deep-space astrophysics.
- **Gameplay Loop**: Safe Sector Spawn → Open-Space Navigation & Inertial Thruster Control → Asteroid Mining & Plasma Cannon Combat → Stardust Harvesting & Magnetic Collection → Galaxy Proximity Lock → Active Spectrographic Scanning → Cinematic Reveal & AURA AI Dialogue → Interactive Educational Dossier (NASA/JWST Cards) → Adaptive Scientific Mission Quiz → Stardust & Explorer XP Rewards → Merit Badge Unlocks & Level Advancement → Ship Hardware Upgrades & Cosmetic Customization in Pilot Hangar → Galactic Archive Sync & Return to Exploration.
- **Educational Goal**: Deliver authentic astrophysical insights—including galactic classification, spectral signatures, distance metrics, tidal collisions, black hole absence/presence, and Hubble/JWST discoveries—through interactive gameplay, curated educational modules, and adaptive scientific assessments.
- **Development Philosophy**: Version 1 focuses strictly on a polished educational exploration experience. Advanced systems are intentionally postponed to avoid feature creep. Every sprint keeps the codebase lightweight, maintainable, and optimized for Google AI Studio development.

---

## 2. Technology Stack

- **React 18 & Vite**: Modular HUD overlays, responsive modals, state management, and localized UI components with `base: './'` relative bundle resolution.
- **Phaser (^4.2.1)**: 2D WebGL/Canvas rendering engine managing physics bodies, camera tracking, particle systems, procedural starfields, and space objects.
- **TypeScript (Strict Mode)**: Type safety across game engines, event buses, telemetry interfaces, educational schemas, and quiz pipelines.
- **EventBus Architecture**: Decoupled Pub/Sub event pipeline (`EventEmitter`) bridging Phaser canvas updates with React UI state without direct DOM coupling.
- **Web Audio API Engine**: Custom procedural synthesizer and audio engine handling multi-channel sound FX, thruster rumbles, scanner sweeps, warp jump hums, and ambient music crossfades.
- **Zustand State Store**: Global reactive state management for user profiles, discovered galaxies, stardust currency, scores, and application settings with `localStorage` fallback persistence.
- **Firebase Authentication & Firestore**: Client SDK integration (`AuthService`, `CloudSaveService`, `SyncManager`) for direct Email/Password authentication (with callsign assignment, email verification, and password resets) and debounced cloud save synchronization with deterministic conflict resolution.
- **Electron Desktop Architecture**: Secure, sandboxed Electron main process (`electron/main.ts`) and minimal preload context bridge (`electron/preload.ts`) with single-instance locking (`app.requestSingleInstanceLock()`), window lifecycle management (1280 x 720, min 1024 x 600), gated `ready-to-show` rendering, and embedded production loopback server (`127.0.0.1:<port>`) guaranteeing HTTP origin parity for Firebase Auth and Firestore without external secret dependencies.

---

## 3. Authoritative Repository Directory Structure

```text
/
├── .env.example                # Template for environment variables (Vite & Electron)
├── firestore.rules             # Security rules for user profile & cloud save
├── index.html                  # Main DOM entry HTML
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler configuration (base: './')
├── CHANGELOG.md                # Detailed project version & architecture changelog
├── PROJECT_STATE.md            # Master project state & technical inventory
├── DEVELOPMENT_ROADMAP.md      # Development milestone roadmap & progress
├── SYSTEM_ARCHITECTURE.md      # Deep-dive system architecture specification
├── ARCHITECTURE_OVERVIEW.md    # High-level architecture map
│
├── electron/                   # Electron Desktop Foundation
│   ├── main.ts                 # Main process (Loopback static server, single instance, sandboxing)
│   └── preload.ts              # Secure preload bridge (window.electron)
│
├── docs/                       # Architectural & Engineering Documentation
│   ├── ARCHITECTURE.md         # Master system architecture document
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
├── public/                     # Static public assets (sounds, icons)
│
└── src/
    ├── main.tsx                # DOM Application Entry Point
    ├── App.tsx                 # Main Application Shell & GameState Switcher
    ├── index.css               # Global CSS, Tailwind Directives & Offline Fonts
    │
    ├── components/             # React UI Component Hierarchy
    │   ├── common/             # Reusable UI elements (AuthModal, AboutCredits, Certificate)
    │   ├── educational/        # Astronomy dossiers, quiz modals, certificates
    │   ├── hud/                # Glassmorphic HUDs (ShipStatusHUD, RadarHUD, PilotDashboardModal)
    │   └── views/              # Full-screen views (MainMenu, ArchiveModal, SettingsModal)
    │
    ├── core/                   # Shared Infrastructure & Contracts
    │   ├── config.ts           # Game physics, energy, and world bounds configuration
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
    │   ├── scenes/             # MainGameplayScene & LoadingScene
    │   └── systems/            # InputSystem, ScannerSystem, DiscoveryController, AudioSystem
    │
    ├── services/               # External & Cloud Services
    │   ├── auth/
    │   │   └── AuthService.ts  # Firebase Authentication wrapper (Email/Password)
    │   ├── cloudSave/
    │   │   ├── cloudSaveTypes.ts      # DTO schemas & payloads
    │   │   ├── CloudSaveSerializer.ts # DTO serialization & sanitization
    │   │   ├── CloudSaveResolver.ts   # Deterministic conflict resolution
    │   │   ├── CloudSaveService.ts    # Firestore persistence (users/{uid}/profile/main)
    │   │   └── SyncManager.ts         # 3s debounced auto-sync & session manager
    │   └── firebase.ts         # Firebase SDK initialization singleton
    │
    ├── store/                  # Zustand global state (game options, user profile, language)
    │   └── useGameStore.ts
    │
    └── utils/                  # Helper Utilities (Math, formatting)
        └── mathUtils.ts
```

---

## 4. Subsystem & Component Status

### 4.1. Electron Desktop Subsystem
- **Main Process (`electron/main.ts`)**:
  - Configures single-instance locking (`app.requestSingleInstanceLock()`).
  - Launches sandboxed `BrowserWindow` with `ready-to-show` visual gating.
  - Serves production assets via built-in loopback server with preferred port `39228`, fallback candidate sequence, and port persistence in `userData/app_port.json`. This guarantees a stable HTTP origin for Firebase Auth and Firestore across restarts without port drift.
  - Denies unauthorized external window navigation, delegating external URLs to the system browser via `shell.openExternal`.
  - Zero confidential client secrets required in main process or renderer bundle.
- **Preload Bridge (`electron/preload.ts`)**:
  - Exposes `window.electron` with safe context `{ isDesktop: true, platform }`.
  - Zero Node.js primitives or OAuth endpoints exposed to the DOM.
- **Current Runtime Status (Electron Playtesting & Stabilization Pass)**:
  - Application launch, main UI loading, gameplay initialization, player movement, galaxy scanning, galaxy discovery, educational dossiers, quizzes, alien drones, and overall loop verified working in Electron.
  - **Stabilization Pass Completed & Manually Verified**:
    - *ELEC-PLAY-01 (Auth Keyboard Input Conflict)*: RESOLVED & MANUALLY VERIFIED. Form field typing accepts all keys (including S/D/F/E/Space) without triggering Phaser flight/combat actions.
    - *ELEC-PLAY-02 (Local Persistence Across Electron Restart)*: RESOLVED & MANUALLY VERIFIED. Origin stabilized via persistent loopback port; game progress restores across complete Electron process shutdowns and restarts.
    - *ELEC-PLAY-03 (Gameplay → Home Navigation)*: RESOLVED & MANUALLY VERIFIED. In-game HUD Action Bar and Settings include Home navigation, preserving active coordinates and session state, allowing "Resume Exploration" from Main Menu.

### 4.2. Authentication & Cloud Save Subsystem
- **AuthService (`src/services/auth/AuthService.ts`)**:
  - Direct Firebase Authentication via Email & Password across all platforms (Web and Electron Desktop).
  - Handles pilot registration, callsign attachment (`updateProfile`), sign in, sign out, email verification (`sendEmailVerification`), and password reset links (`sendPasswordResetEmail`).
  - Google OAuth permanently retired to streamline cross-platform architecture and eliminate external secret dependencies.
  - Current configuration in `.env` and `src/services/firebase.ts` remains active and unchanged.
  - *Stabilization Note*: Form keyboard conflict in Electron (ELEC-PLAY-01) resolved; Email/Password typing verified functional without interference from Phaser keyboard controls.
- **SyncManager (`src/services/cloudSave/SyncManager.ts`)**:
  - Debounced auto-sync (3000ms) subscribed to Zustand store mutations.
  - Generation-based session concurrency tracking (`activeSyncSessionId`) eliminating race conditions on rapid auth switches.
  - Reentrancy guard (`applyCloudUpdateToStore`) preventing cloud sync writes from re-triggering local dirty flags.
  - Baseline advancement for Stardust reserves occurs only on confirmed Firestore write.
- **CloudSaveResolver (`src/services/cloudSave/CloudSaveResolver.ts`)**:
  - Additive Set Union ($A \cup B$) for collections (`discoveredGalaxyIds`, `unlockedBadges`, `unlockedCosmetics`, `unlockedPerks`).
  - Monotonic Max ($\max(A, B)$) for XP, career level, total score, and quiz best scores.
  - Stardust Net-Delta Reconciliation: $\text{Reconciled} = \max(0, \text{Cloud} + (\text{Local} - \text{LastSynced}))$.
  - Timestamp Ordering for profile customization (`name`, `equippedCosmetics`, `equippedPerks`).
- **Persistence Status**:
  - *Verified*: Active in-session state and persistence across window minimize/restore during the same session.
  - *Verified (ELEC-PLAY-02)*: Restoring saved progress after a complete Electron application restart is resolved and manually verified in the local standalone Electron application via persistent loopback port origin and hardened Zustand rehydration.

---

## 5. Conservative Verification Matrix

| Subsystem / Feature | Build & Static Status | Runtime Test Status | Verification Notes |
| :--- | :---: | :---: | :--- |
| **Electron Application Launch** | ✅ **PASS** | ✅ **VERIFIED** | Clean desktop launch via `node_modules\.bin\electron.exe .`. |
| **Main UI & Presentation** | ✅ **PASS** | ✅ **VERIFIED** | Glassmorphic menus, buttons, title screen loading verified in Electron. |
| **Phaser 2D Gameplay & 60 FPS Engine** | ✅ **PASS** | ✅ **VERIFIED** | WebGL canvas, 10 galaxies, asteroids, laser combat, drone AI verified in Electron. |
| **Player Movement & Flight Physics** | ✅ **PASS** | ✅ **VERIFIED** | Inertial thrust, drag, rotation, and weapon firing verified in Electron. |
| **Galaxy Scanning & Discovery** | ✅ **PASS** | ✅ **VERIFIED** | Spectrographic scanning reticle, lock, reveal, and AURA dialogue verified in Electron. |
| **Learning Cards & Quizzes** | ✅ **PASS** | ✅ **VERIFIED** | Bilingual dossiers, media visuals, adaptive quizzes, score rewards verified in Electron. |
| **Alien Survey Drone Combat** | ✅ **PASS** | ✅ **VERIFIED** | AI drone FSM behavior, laser combat, stardust rewards verified in Electron. |
| **General Gameplay Loop** | ✅ **PASS** | ✅ **VERIFIED** | Complete flight → scan → discover → learn → quiz progression cycle verified. |
| **Firebase Email & Password Auth UI** | ✅ **PASS** | ✅ **VERIFIED** | UI functional; form field keyboard isolation (ELEC-PLAY-01) resolved and manually verified. |
| **Local Persistence Across Electron Restart** | ✅ **PASS** | ✅ **VERIFIED** | Origin stabilization (ELEC-PLAY-02) resolved and manually verified across full Electron restart. |
| **Gameplay → Home Navigation** | ✅ **PASS** | ✅ **VERIFIED** | Non-destructive Home/Resume loop (ELEC-PLAY-03) implemented and manually verified. |
| **Web Production Build (`dist/`)** | ✅ **PASS** | ✅ **VERIFIED** | Compiles cleanly via `bun run build`. |
| **Electron Main/Preload Build (`dist-electron/`)** | ✅ **PASS** | ✅ **VERIFIED** | Compiles cleanly via `esbuild` (0 errors). |
| **Electron Navigation Hardening & Loopback** | ✅ **PASS** | ✅ **VERIFIED** | Deny-by-default navigation, deterministic loopback server (preferred 39228) with origin persistence. |
| **Firestore Security Rules** | ✅ **PASS** | ✅ **VERIFIED** | User-owned paths, schema, and numeric upper/lower bounds. |
| **Google OAuth Permanent Retirement** | ✅ **PASS** | ✅ **VERIFIED** | UI, Preload bridge, IPC, main process loopback, and secret variables cleanly purged. |
| **Firestore Cloud Save Sync** | ✅ **PASS** | ⏳ **PENDING E2E RELEASE QA** | SyncManager active; targeted E2E release validation scheduled for Final QA stage. |

---

## 6. Milestones & Progress Tracking

### Current Stage: Sprint 2.8 — Post-Playtest Stabilization & Release Hardening

```text
Current Stage:
Sprint 2.8 — Post-Playtest Stabilization & Release Hardening

Core gameplay:
Working (Verified)

Electron launch:
Working (Verified)

Electron gameplay:
Working (Verified)

Authentication:
Working baseline; form input keyboard isolation verified (ELEC-PLAY-01)

Local persistence across Electron restart:
Working & verified (ELEC-PLAY-02)

Gameplay → Home navigation:
Working & verified (ELEC-PLAY-03)

Electron Stabilization Pass:
COMPLETE / VERIFIED

Next Phase:
Release Hardening / Final QA
```

### Completed Milestones
- **Sprint 2.0 through Sprint 2.4.5**: Core gameplay, discovery loop, educational briefings, 50-question quizzes, progression ranks, and alien drones complete.
- **Sprint 2.5 — Firebase Authentication & Cloud Save**: Complete and verified on Web.
- **Sprint 2.6 Phase 1–3 — Electron Desktop Integration**: Complete and audited.
- **Sprint 2.6.5 — QA Remediation & Stability Hardening**: Complete and verified.
- **Sprint 2.7 — Google OAuth Clean Retirement**: Permanent retirement of Google OAuth in favor of robust direct Firebase Email/Password Authentication across Web and Desktop.
- **Sprint 2.7 Phase 3.6 — Electron Desktop Manual Playtest**: Verified core gameplay loop, flight, scanning, discovery, quizzes, learning dossiers, and alien drone combat in standalone Electron. Cataloged 3 post-playtest issues.
- **Sprint 2.8 — Post-Playtest Stabilization Pass (ELEC-PLAY-01, ELEC-PLAY-02, ELEC-PLAY-03)**:
  - Form field keyboard isolation implemented and manually verified.
  - Loopback port stabilization and Electron restart persistence implemented and manually verified.
  - Non-destructive Gameplay → Home navigation and contextual mission resumption implemented and manually verified.
  - Validated with `bunx tsc --noEmit`, `bun run build`, and `bun run build:electron` (all PASS).

### Next Immediate Action: Release Hardening / Final QA
- **Release Hardening / Final QA**: Proceed to systematic release verification:
  - Comprehensive multi-platform packaged installer checks.
  - Fresh-machine installation and offline recovery edge-case verification.
  - Cloud-sync end-to-end multi-session verification.
  - Final visual and performance stability sign-off.
