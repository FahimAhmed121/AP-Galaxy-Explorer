# PROJECT_STRUCTURE.md — AP Galaxy Explorer

## 📁 Repository Directory Structure

Below is the authoritative directory layout of **AP Galaxy Explorer**:

```text
/
├── .env.example                # Template for environment variables (Vite & Electron)
├── firestore.rules             # Security rules for Firestore Cloud Save & profile data
├── index.html                  # Main DOM entry HTML
├── metadata.json               # Application identity, frame permissions, major capabilities
├── package.json                # Project dependencies, build, and packaging scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundler configuration (base: './')
├── CHANGELOG.md                # Project version, sprint, and architecture history
├── PROJECT_STATE.md            # Master project state & technical inventory
├── DEVELOPMENT_ROADMAP.md      # Development milestone roadmap & progress
├── SYSTEM_ARCHITECTURE.md      # Deep-dive system architecture specification
├── ARCHITECTURE_OVERVIEW.md    # High-level architecture map
├── AI_DEVELOPMENT_GUIDE.md     # AI development constitution & engineering handbook
│
├── electron/                   # Electron Desktop Foundation
│   ├── main.ts                 # Main process (single-instance lock, loopback server)
│   └── preload.ts              # Secure context bridge (window.electron)
│
├── docs/                       # Architectural & Engineering Specifications
│   ├── ARCHITECTURE.md         # Consolidated master architecture specification
│   ├── AUTHENTICATION.md       # Firebase Email & Password authentication guide
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
├── public/                     # Static Public Assets
│   └── sounds/                 # Procedural audio assets & samples
│
└── src/
    ├── main.tsx                # Application Entry Point
    ├── App.tsx                 # Main Application Shell & GameState Switcher
    ├── index.css               # Global CSS, Tailwind Directives & Offline Fonts
    │
    ├── components/             # React UI Component Hierarchy
    │   ├── common/             # Reusable UI Containers & Buttons
    │   │   ├── AboutCredits.tsx     # Credits Modal & Team Roster
    │   │   ├── AuthModal.tsx        # Firebase Authentication Modal (Email & Password)
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
    ├── phaser/                 # Phaser 3 2D Game Engine Architecture
    │   ├── Game.ts             # Phaser Game Instance Lifecycle & Container Binding
    │   ├── entities/           # Phaser Game Object Entities
    │   │   ├── AlienSurveyDrone.ts# Autonomous Survey Drone Entity & AI FSM
    │   │   ├── Asteroid.ts        # Procedural Asteroid Entity & Fragmentation Physics
    │   │   ├── GalaxyEntity.ts    # Deep-space Galaxy Visual & Pulse Ring
    │   │   ├── PlayerShip.ts      # Player Spacecraft, Thrusters, Shield, Weapons, Magnet
    │   │   └── Sector.ts          # Background Parallax Starfields & Nebula Clouds
    │   │
    │   ├── managers/           # Gameplay Engine Managers
    │   │   ├── AsteroidManager.ts # Asteroid Cluster Generation, Collision & Stardust Drops
    │   │   ├── DroneManager.ts    # Drone Spawner, Target Tracking & Combat Management
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
    ├── services/               # Decoupled External Services & Cloud Save
    │   ├── auth/
    │   │   └── AuthService.ts         # Firebase Authentication wrapper (Email/Password)
    │   ├── cloudSave/
    │   │   ├── cloudSaveTypes.ts      # Cloud Save DTOs & Schemas
    │   │   ├── CloudSaveSerializer.ts # Bidirectional State/DTO Serializer
    │   │   ├── CloudSaveResolver.ts   # Deterministic Conflict Resolution Engine
    │   │   ├── CloudSaveService.ts    # Firestore Persistence Service (users/{uid}/profile/main)
    │   │   └── SyncManager.ts         # 3s Debounced Auto-Sync Orchestrator
    │   └── firebase.ts                # Firebase SDK Initialization Singleton
    │
    ├── store/                  # Zustand Reactive State Store
    │   └── useGameStore.ts     # Single Source of Truth for Profile, Inventory, Upgrades & Options
    │
    └── utils/                  # Pure Utility Functions
        └── mathUtils.ts        # Trigonometry, Vector Math & Spatial Calculations
```
