# AP Galaxy Explorer V2 — Astronomy Pathshala

An interactive 2D astronomy exploration game and educational platform built with React, TypeScript, Phaser 3, Zustand, and Tailwind CSS. Designed for cross-platform Web and Electron Desktop deployment.

---

## 🚀 Architecture & Folder Structure

```
/
├── electron/               # Electron Desktop Main & Preload Scripts
│   ├── main.ts
│   └── preload.ts
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
    │   ├── common/         # Reusable UI Elements (Logo, About/Credits)
    │   ├── educational/    # Astronomy Spec Cards, Quiz Modals, Certificates
    │   ├── hud/            # Heads-Up Displays & Modals (Status, Radar, Pilot Dashboard)
    │   └── views/          # Screen Views (MainMenu, Archive, Settings)
    ├── data/               # Data Registries (Galaxies, Quizzes, Ships)
    │   └── galaxies.ts
    ├── engine/             # Core Engines (Synthesizer Audio Engine)
    │   └── audioEngine.ts
    ├── phaser/             # Phaser 3 Engine Architecture (V2 Gameplay Foundation)
    │   ├── scenes/
    │   ├── systems/
    │   ├── entities/
    │   └── managers/
    ├── store/              # State Management (Zustand)
    │   └── useGameStore.ts
    ├── utils/              # Math & Helper Utilities
    │   └── mathUtils.ts
    ├── App.tsx             # Main App Shell & State Switcher
    └── main.tsx            # DOM Entry Point
```

---

## 🛠️ Tech Stack

- **UI & Application Shell:** React 18, Tailwind CSS, Lucide React
- **Game Engine & Renderer:** HTML5 Canvas / Phaser 3 Architecture
- **State Engine:** Zustand with `localStorage` persistence
- **Audio Synthesizer:** Web Audio API (`audioEngine.ts`)
- **Desktop Target:** Electron Framework
