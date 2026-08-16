# AP Galaxy Explorer V2 — Astronomy Pathshala

An interactive 2D astronomy exploration game and educational platform built with React 18, TypeScript, Phaser (^4.2.1), Zustand, Tailwind CSS, Firebase Authentication & Cloud Save, and Web Audio API. Designed for cross-platform Web and Electron Desktop deployment.

---

## 🚀 Architecture & Folder Structure

```
/
├── electron/               # Electron Desktop Main & Preload Scripts
│   ├── main.ts             # Main process (sandboxing, lifecycle, loopback server)
│   └── preload.ts          # Minimal context bridge
├── firestore.rules         # Security rules for user profile & cloud save
├── docs/                   # Architectural & Engineering Documentation
│   └── ENGINEERING_STANDARDS.md
└── src/
    ├── core/               # Shared Core Foundation
    │   ├── constants.ts    # Application Constants & World Bounds
    │   ├── config.ts       # Physics, World, and Combat Configurations
    │   ├── errors.ts       # Custom Error Classes
    │   ├── events.ts       # EventBus & System Contracts
    │   ├── logger.ts       # Centralized Logger Utility
    │   └── types.ts        # Pure TypeScript Contracts & Schemas
    ├── components/         # React UI Component Hierarchy
    │   ├── common/         # Reusable UI Elements (Buttons, AuthModal, Certificate)
    │   ├── educational/    # Astronomy Spec Cards, Quiz Modals, Certificates
    │   ├── hud/            # Heads-Up Displays & Modals (Status, Radar, Pilot Dashboard)
    │   └── views/          # Screen Views (MainMenu, Archive, Settings)
    ├── data/               # Data Registries (Galaxies, Quizzes, Ships)
    │   └── galaxies.ts
    ├── engine/             # Core Engines (Synthesizer Audio Engine)
    │   └── audioEngine.ts
    ├── phaser/             # Phaser Engine Architecture (V2 Gameplay Foundation)
    │   ├── scenes/
    │   ├── systems/
    │   ├── entities/
    │   └── managers/
    ├── services/           # External & Cloud Services
    │   ├── auth/           # Firebase Authentication Service (OAuth, Email/Password)
    │   ├── cloudSave/      # Cloud Save, Conflict Resolver, DTOs & SyncManager
    │   └── firebase.ts     # Firebase App & SDK Singleton
    ├── store/              # State Management (Zustand with localStorage fallback)
    │   └── useGameStore.ts
    ├── utils/              # Math & Helper Utilities
    │   └── mathUtils.ts
    ├── App.tsx             # Main App Shell & State Switcher
    └── main.tsx            # DOM Entry Point
```

---

## 🛠️ Tech Stack

- **UI & Application Shell:** React 18, Tailwind CSS, Lucide React
- **Game Engine & Renderer:** HTML5 Canvas / WebGL (Phaser `^4.2.1`)
- **State Engine:** Zustand with `localStorage` fallback persistence
- **Authentication & Cloud Save:** Firebase Authentication (Google OAuth & Email/Password) + Cloud Firestore
- **Audio Synthesizer:** Web Audio API (`audioEngine.ts`)
- **Desktop Target:** Electron Framework (Sandboxed, Local Loopback Server, Preload Context Bridge)

---

## 📍 Lean V1 Roadmap Overview

- **Completed**: Foundation Refactor, Phaser Foundation, Gameplay Migration, Universe Generation, Interactive Galaxy System, Scanner System, Discovery Experience, Educational Learning Layer, Quality Sprint 1.0, Sprint 2.0 Adaptive Quiz, Stabilization Sprint 1.0, Sprint 2.1 Discovery Log & Galactic Archive, Sprint 2.1.1 Regression Fixes, Sprint 2.2 Asteroids, Stardust Economy & Ship Progression, Sprint 2.2.1 Gameplay Balance & Feel, Documentation Synchronization & HUD Redesign, Sprint 2.3 Explorer Progression & Cosmetics, Sprint 2.4 Alien Survey Drones, Sprint 2.4.5 Educational Content & Media Polish.
- **Sprint 2.5 (Completed)**: Firebase Authentication & Cloud Save (Google OAuth, Email/Password, Firestore sync, conflict resolution, Stardust Net-Delta reconciliation, SyncManager).
- **Sprint 2.6 (Active)**: Electron Desktop Release
  - *Phase 1 (Completed & Audited)*: Electron Core & Build Integration (Sandboxed main process, preload bridge, relative assets, embedded loopback server, dual build pipeline).
  - *Phase 2 (Completed & Audited)*: Desktop Window Management & Lifecycle Integration (Single-instance locking, window sizing/centering, ready-to-show visual gating, loopback server shutdown hooks, lifecycle orchestration).
  - *Phase 3 (Not Started)*: Desktop Packaging & Distribution.
- **Beta & V1.0 Release**: Final playtesting, polish, and Version 1.0 release for Astronomy Pathshala students.

