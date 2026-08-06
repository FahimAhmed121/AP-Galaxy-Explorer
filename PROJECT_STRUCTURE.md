# PROJECT_STRUCTURE.md — AP Galaxy Explorer

## 📁 Repository Directory Structure

Below is the authoritative directory layout of **AP Galaxy Explorer V2** as of Sprint 2.3 completion:

```
/
├── .env.example                # Template for environment variables
├── index.html                  # Main DOM entry HTML
├── metadata.json               # Application identity, frame permissions, major capabilities
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
│
├── electron/                   # Electron Desktop Main & Preload Scripts
│   ├── main.ts
│   └── preload.ts
│
├── docs/                       # Architectural & Engineering Specifications
│   ├── DISCOVERY_SYSTEM_ARCHITECTURE.md
│   ├── ENGINEERING_STANDARDS.md
│   ├── GALAXY_SYSTEM_ARCHITECTURE.md
│   ├── LEARNING_SYSTEM_ARCHITECTURE.md
│   ├── QUIZ_SYSTEM_ARCHITECTURE.md
│   ├── SCANNER_SYSTEM_ARCHITECTURE.md
│   └── UNIVERSE_ARCHITECTURE.md
│
├── public/                     # Static Public Assets
│   └── sounds/                 # Procedural audio assets & samples
│
└── src/
    ├── main.tsx                # Application Entry Point
    ├── App.tsx                 # Main Application Shell & GameState Switcher
    ├── index.css               # Global CSS & Tailwind Directives
    │
    ├── components/             # React UI Component Hierarchy
    │   ├── common/             # Reusable UI Containers & Buttons
    │   │   ├── AboutCredits.tsx     # Credits Modal & Team Roster
    │   │   ├── GalaxyImage.tsx      # SVG/WebGL Procedural Deep-Space Galaxy Visual
    │   │   └── GameContainer.tsx    # Phaser HTML Canvas Mounting Wrapper
    │   │
    │   ├── educational/        # Interactive Educational Widgets & Dossiers
    │   │   ├── Certificate.tsx      # Explorer Completion Certificate (HTML5 Canvas Render)
    │   │   └── GalaxyInfo.tsx       # Galaxy Deep-Dive Inspection Dossier & Quiz Retake
    │   │
    │   ├── hud/                # Modernized Heads-Up Displays & Modals
    │   │   ├── DiscoveryOverlay.tsx       # AURA AI Narrative Dialogue & Telemetry
    │   │   ├── GameOverModal.tsx          # Hull Destruction & Respawn Console
    │   │   ├── LearningBriefingModal.tsx # 2-Column NASA/JWST Educational Dossiers
    │   │   ├── PilotDashboardModal.tsx    # Pilot Station (Upgrades, Customization, Dossier)
    │   │   ├── QuizAssessmentModal.tsx    # NASA Mission Console Adaptive Quiz
    │   │   ├── RadarHUD.tsx               # 2D Minimap Radar with Spatial Coordinates
    │   │   ├── ShipStatusHUD.tsx          # Top Status Bar (Vitals, Level/Rank, Mission, Controls)
    │   │   └── WarpJumpOverlay.tsx        # HTML5 Canvas Particle Hyperdrive Tunnel
    │   │
    │   └── views/              # Full-Screen Screen Views
    │       ├── ArchiveModal.tsx           # Persistent Galactic Archive & Codex
    │       ├── MainMenu.tsx               # Title Screen & Main Menu
    │       ├── OpeningCinematic.tsx       # Narrative Intro Cutscene
    │       └── SettingsModal.tsx          # Audio Controls & Profile Reset
    │
    ├── core/                   # Shared Infrastructure & Contracts
    │   ├── config.ts           # Game Physics, World Bounds (8000x8000 px), Energy Constants
    │   ├── constants.ts        # World Bounds and App Constants
    │   ├── errors.ts           # Custom Error Classes & Handling
    │   ├── events.ts           # Decoupled EventBus Interfaces & Event Payload Contracts
    │   ├── logger.ts           # Centralized Diagnostic Logger
    │   └── types.ts            # Core TypeScript Types (Ship, Galaxy, Profile, Quiz, Cosmetics)
    │
    ├── data/                   # Data Registries & Pipelines
    │   ├── educational/        # Handcrafted Educational Dossier JSON Datasets
    │   ├── quizzes/            # Handcrafted Scientific Quiz JSON Datasets
    │   ├── contentPipeline.ts  # Educational Dossier Loader with Fallback Protection
    │   ├── quizPipeline.ts     # Asynchronous Quiz Loader & Dynamic Evaluator
    │   ├── galaxies.json       # Master Catalog of 10 Galaxies & Spatial Coordinates
    │   ├── galaxies.ts         # TypeScript Export Wrapper for Master Catalog
    │   └── progressionData.ts  # Explorer Levels, Ranks, Merit Badges, Cosmetics & Perks
    │
    ├── engine/                 # Custom Audio Synthesis Engine
    │   └── audioEngine.ts      # Web Audio Procedural Sound Synthesizer & Multi-Channel Mixer
    │
    ├── phaser/                 # Phaser 3 2D Game Engine Engine Architecture
    │   ├── Game.ts             # Phaser Game Instance Lifecycle & Container Binding
    │   ├── entities/           # Phaser Game Object Entities
    │   │   ├── Asteroid.ts        # Procedural Asteroid Entity & Fragmentation Physics
    │   │   ├── GalaxyEntity.ts    # Deep-space Galaxy Visual & Pulse Ring
    │   │   ├── PlayerShip.ts      # Player Spacecraft, Thrusters, Shield, Weapons, Magnet
    │   │   └── Sector.ts          # Background Parallax Starfields & Nebula Clouds
    │   │
    │   ├── managers/           # Gameplay Engine Managers
    │   │   ├── AsteroidManager.ts # Asteroid Cluster Generation, Collision & Stardust Drops
    │   │   ├── GalaxyManager.ts   # Spatial Indexing, Proximity Reticles & Discovery Tracking
    │   │   ├── SaveManager.ts     # Persistent Browser LocalStorage Synchronization
    │   │   └── WorldManager.ts    # Camera Bounds, Tracking & Spatial Constraints
    │   │
    │   ├── scenes/             # Phaser Scene Hierarchy
    │   │   └── MainGameplayScene.ts # Primary Gameplay Scene & Render Loop
    │   │
    │   └── systems/            # Low-Level Controller Systems
    │       ├── AudioSystem.ts           # EventBus Audio Trigger Synchronizer
    │       ├── DebugOverlaySystem.ts    # Toggleable Developer Diagnostic Overlay (`~` key)
    │       ├── DiscoveryController.ts   # Discovery Sequence State Machine & Camera Zoom
    │       ├── InputSystem.ts           # Keyboard & Touch Vector Input Engine
    │       ├── LearningController.ts    # Educational Briefing Flow Controller
    │       ├── QuizController.ts        # Scientific Assessment Controller & Score Tracker
    │       ├── ScannerSystem.ts         # Spectrographic Range & Energy Consumption Engine
    │       └── ScannerVisualSystem.ts   # Dynamic WebGL Reticle & Scan Ray Renderer
    │
    ├── store/                  # Zustand Reactive State Store
    │   └── useGameStore.ts     # Single Source of Truth for Profile, Inventory, Upgrades & Options
    │
    └── utils/                  # Pure Utility Functions
        └── mathUtils.ts        # Trigonometry, Vector Math & Spatial Calculations
```

---

## 🏗️ Architectural Overview by Module

### 1. Presentation Layer (`src/components/`)
Contains all React 18 user interface elements, HUD overlays, modals, and screen views. Styled exclusively with Tailwind CSS. Interacts with the Phaser game engine solely via Zustand store hooks and the central EventBus (`eventBus`).

### 2. Game Engine Layer (`src/phaser/`)
Built on Phaser 3 WebGL/Canvas 2D renderer. Manages physics simulation, spatial entity tracking, procedural starfield backdrop, particle emitters, asteroid mining, and spectrographic scanning visuals. Completely decoupled from React DOM nodes.

### 3. Core & Data Layer (`src/core/` & `src/data/`)
Defines strictly typed contracts (`types.ts`), game constants (`config.ts`), centralized EventBus contracts (`events.ts`), and static content registries (`galaxies.json`, `progressionData.ts`, `contentPipeline.ts`, `quizPipeline.ts`).

### 4. State Management Layer (`src/store/`)
Uses Zustand (`useGameStore.ts`) to maintain pilot profile metrics, stardust currency, discovered galaxy IDs, quiz attempt histories, hardware upgrade levels, equipped cosmetics, unlocked merit badges, active perks, and application options with automated browser `localStorage` persistence.
