# PROJECT_STATE.md — AP Galaxy Explorer

## 1. Project Overview

- **Purpose**: Astronomy Pathshala (AP) Galaxy Explorer is an interactive, space-themed educational simulation that combines 2D space flight, real-time spectrographic galaxy scanning, cinematic discovery reveals, and interactive NASA/JWST/Hubble educational dossiers and adaptive scientific quizzes.
- **Target Audience**: Students, astronomy enthusiasts, self-learners, and science educators seeking an engaging visual platform to explore deep-space astrophysics.
- **Gameplay Loop**: Safe Sector Spawn → Open-Space Navigation & Inertial Thruster Control → Galaxy Proximity Lock → Active Spectrographic Scanning → Cinematic Reveal & AURA AI Dialogue → Interactive Educational Dossier (NASA/JWST Cards) → Adaptive Scientific Mission Quiz → Stardust & Score Rewards → Galactic Archive Sync & Return to Exploration.
- **Educational Goal**: Deliver authentic astrophysical insights—including galactic classification, spectral signatures, distance metrics, tidal collisions, black hole absence/presence, and Hubble/JWST discoveries—through interactive gameplay, curated educational modules, and adaptive scientific assessments.
- **Development Philosophy**: Version 1 focuses strictly on a polished educational exploration experience. Advanced systems are intentionally postponed to avoid feature creep. Every sprint keeps the codebase lightweight, maintainable, and optimized for Google AI Studio development.

---

## 2. Technology Stack

- **React 18 & Vite**: Modular HUD overlays, responsive modals, state management, and localized UI components.
- **Phaser 3.80+**: 2D WebGL/Canvas rendering engine managing physics bodies, camera tracking, particle systems, procedural starfields, and space objects.
- **TypeScript (Strict Mode)**: Type safety across game engines, event buses, telemetry interfaces, educational schemas, and quiz pipelines.
- **EventBus Architecture**: Decoupled Pub/Sub event pipeline (`EventEmitter`) bridging Phaser 3 canvas updates with React UI state without direct DOM coupling.
- **Web Audio API Engine**: Custom procedural synthesizer and audio engine handling multi-channel sound FX, thruster rumbles, scanner sweeps, warp jump hums, and ambient music crossfades.
- **Zustand State Store**: Global reactive state management for user profiles, discovered galaxies, stardust currency, scores, and application settings.
- **Electron Preparation**: Clean modular separation enabling standalone desktop compilation with native IPC bindings.

---

## 3. Current Folder Structure

```
/
├── public/                     # Static public assets (sounds, icons)
├── src/
│   ├── components/             # React UI components
│   │   ├── common/             # Reusable UI containers & buttons
│   │   ├── educational/        # Interactive educational widgets & dossiers
│   │   │   ├── Certificate.tsx            # Explorer Completion Certificate
│   │   │   └── GalaxyInfo.tsx             # Galaxy deep-dive inspection dossier
│   │   ├── hud/                # Modernized Gameplay HUD overlays
│   │   │   ├── DiscoveryOverlay.tsx       # AURA AI narrative dialogue
│   │   │   ├── GameOverModal.tsx          # Game over state UI
│   │   │   ├── LearningBriefingModal.tsx # 2-Column NASA/JWST educational dossiers
│   │   │   ├── PilotDashboardModal.tsx    # Pilot profile, stats & dossier
│   │   │   ├── QuizAssessmentModal.tsx    # Adaptive NASA Mission Console quiz
│   │   │   ├── RadarHUD.tsx               # 2D Minimap radar with spatial coordinates
│   │   │   ├── ShipStatusHUD.tsx          # Top HUD bar (Vitals, Mission, Controls)
│   │   │   └── WarpJumpOverlay.tsx        # Multi-phase hyperdrive canvas particle FX
│   │   └── views/              # Full-screen views (MainMenu, ArchiveModal, SettingsModal)
│   │       ├── ArchiveModal.tsx           # Persistent Galactic Archive & Codex
│   │       ├── MainMenu.tsx               # Main Menu view
│   │       └── SettingsModal.tsx          # Settings & Audio controls
│   ├── core/                   # Shared types, event bus, and global configuration
│   │   ├── config.ts           # Game physics, energy, and world bounds configuration
│   │   ├── events.ts           # EventBus typed interfaces & event names
│   │   ├── logger.ts           # Centralized logging engine
│   │   └── types.ts            # Core TypeScript models (Ship, Galaxy, Profile, Quiz)
│   ├── data/                   # Data registries & educational content
│   │   ├── educational/        # Handcrafted galaxy JSON dossiers & content pipeline
│   │   ├── quizzes/            # Handcrafted scientific quiz JSON datasets
│   │   ├── contentPipeline.ts  # Dynamic dossier loading with fallback safety
│   │   ├── quizPipeline.ts     # Asynchronous quiz pipeline & generator
│   │   └── galaxies.json       # Master galaxy catalog & spatial coordinates
│   ├── engine/                 # Custom sound engine & audio management
│   │   └── audioEngine.ts      # Web Audio procedural oscillator & SFX synthesis
│   ├── phaser/                 # Phaser game engine architecture
│   │   ├── entities/           # PlayerShip, GalaxyObject, SpaceStation entities
│   │   ├── managers/           # GalaxyManager, SaveManager, ParticleManager
│   │   ├── scenes/             # MainGameplayScene & LoadingScene
│   │   └── systems/            # ScannerSystem, DiscoveryController, QuizController, LearningController, InputSystem, AudioSystem, DebugOverlaySystem
│   ├── store/                  # Zustand global state (game options, user profile, language)
│   └── App.tsx / main.tsx      # Main application entry point & canvas integration
├── docs/                       # Architecture & engineering documentation
├── PROJECT_STATE.md            # Master project state documentation
├── DEVELOPMENT_ROADMAP.md      # Development milestone roadmap
├── ARCHITECTURE_OVERVIEW.md    # High-level architecture map
├── QUALITY_SPRINT_1_REPORT.md  # Quality Sprint execution report
└── STABILIZATION_SPRINT_1_REPORT.md # Stabilization & Root Cause Analysis report
```

---

## 4. Core Architecture & System Components

- **Managers (`/src/phaser/managers/`)**:
  - `GalaxyManager`: Handles spatial indexing, proximity detection, galaxy entity instantiation, and discovery status tracking.
  - `SaveManager`: Manages persistent local storage state (stardust, score, mapped galaxies, custom options).
  - `ParticleManager`: Manages thruster emissions, scanner particle beams, and explosion visual FX.
- **Controllers (`/src/phaser/systems/`)**:
  - `DiscoveryController`: Manages state machine flow for galaxy discoveries (`IDLE` → `DISCOVERING` → `AURA_PRESENTING` → `READY_FOR_LEARNING` → `FINISHED`).
  - `LearningController`: Manages educational dossier state machine (`IDLE` → `LOADING` → `PRESENTING` → `COMPLETED`), loading content via `contentPipeline.ts`.
  - `QuizController`: Manages adaptive quiz state machine (`IDLE` → `LOADING` → `QUESTION_ACTIVE` → `EVALUATING` → `PASSED` / `FAILED` → `COMPLETED`), question timing, scoring, and accuracy tracking.
- **Systems (`/src/phaser/systems/`)**:
  - `ScannerSystem`: Computes player-to-target distance, energy consumption during scanning, and triggers scan events.
  - `InputSystem`: Processes keyboard (WASD/Arrows/Space/Shift/E) and virtual touch controls, calculating thrust vectors.
  - `ScannerVisualSystem`: Renders dynamic scanning reticles and spectrographic beams in WebGL.
  - `AudioSystem`: Listens to EventBus triggers and synchronizes audio synthesis with gameplay events.
  - `DebugOverlaySystem`: Toggable developer overlay (hidden by default, toggled via `~` key).
- **HUD & View Components (`/src/components/`)**:
  - `ShipStatusHUD`: Modernized top HUD bar aligning Pilot Vitals (Hull, Shield, Energy, Current Galaxy), Mission Objectives (`Map Galaxies [x/10]`), Stardust, Score, and Command Actions (Pilot Station, Codex, Settings) on a clean horizontal plane.
  - `ArchiveModal`: Full-screen Galactic Archive & Codex providing instant search, morphology filters (Spiral, Elliptical, Irregular), discovery status badges, completion stats, and direct galaxy inspection / quiz retakes.
  - `GalaxyInfo`: Deep-dive galaxy inspection dossier featuring scientific summaries, telescope showcases, key astrophysical parameters, and retake quiz button.
  - `PilotDashboardModal`: Explorer Dossier displaying pilot statistics, total galaxies mapped, average accuracy, stardust count, rank titles, and unlocked badges.
  - `RadarHUD`: Displays 2D minimap with player position/heading, space stations, and discovered/unmapped galaxy indicators.
  - `DiscoveryOverlay`: Provides player-controlled AURA dialogue progression (`PREV`, `NEXT`, `SKIP`, `CONTINUE TO BRIEFING`).
  - `LearningBriefingModal`: Renders 2-column NASA/JWST educational dossiers with telescope visual showcases.
  - `QuizAssessmentModal`: NASA Mission Console interface for scientific mission debriefing, immediate feedback, and scoring.
  - `WarpJumpOverlay`: Renders multi-phase HTML5 canvas hyperdrive particle tunnels.
- **Data Pipeline**:
  - `contentPipeline.ts` dynamically imports educational JSON files with automatic fallback content for unmapped deep-space objects.
  - `quizPipeline.ts` dynamically imports quiz JSON datasets with fallback question generation.
- **EventBus**:
  - `eventBus` (`EventEmitter`) provides bidirectional communication between Phaser systems and React HUD components.
- **Rendering**:
  - Phaser WebGL pipeline handles smooth camera follow (`lerp 0.08`), parallax background starfields, thruster particle emissions, and glow filters.
- **Audio**:
  - `audioEngine.ts` triggers procedural synthesis and layered audio streams based on game state changes.
- **Persistence & State Synchronization**:
  - Zustand store (`useGameStore`) acts as the single source of truth for user profile data, discovered galaxy IDs (`profile.discoveredGalaxyIds`), quiz attempts (`profile.quizAttempts`), high scores (`profile.quizHighScores`), stardust currency, and settings—automatically synced to browser `localStorage`.
  - Phaser `GalaxyManager` initializes discovery state from Zustand store and updates the store upon discovery completion.

---

## 5. Current Gameplay Loop

```
  Player Launch (Safe Sector Alpha)
                 ↓
  Exploration (Inertial Space Movement & Booster)
                 ↓
  Galaxy Proximity Lock (Target Detected)
                 ↓
  Scanner Activation (E Key / Energy Consumption)
                 ↓
  Discovery Cinematic Reveal (Camera Zoom & Focus)
                 ↓
  AURA AI Dialogue (Paced Narrative & Telemetry)
                 ↓
  Learning Briefing Dossier (NASA / JWST Telescope Cards)
                 ↓
  Adaptive Scientific Mission Quiz (NASA Console Assessment)
                 ↓
  Stardust & Score Rewards (Mapped Status Updated)
                 ↓
  Return to Exploration / Galactic Archive Sync
```

---

## 6. Implemented Features

- **Spacecraft Physics**: Refined heavy inertial drift, smooth turn rates (`3.2 rad/s`), tuned acceleration (`220 px/s²`), and top speed bounds (`320 px/s` base, `520 px/s` boost).
- **Plasma Energy System**: Dynamic 100-point energy pool powering hyperspace boosters and spectrographic scanners with automatic passive regeneration (`14/s`).
- **Player-Controlled AURA Dialogue**: Paginated dialogue flow with explicit `PREV`, `NEXT`, `SKIP CINEMATIC`, and `CONTINUE TO BRIEFING` controls.
- **NASA / JWST / Hubble Educational Cards**: Structured 2-column learning dossiers featuring high-resolution telescope visual placeholders, spectral charts, and key astrophysical metrics.
- **Adaptive Scientific Mission Quiz**: Mission debriefing console evaluating galaxy-specific astrophysics with immediate explanation feedback, score calculation, and stardust rewards.
- **Modernized Distraction-Free HUD**: Cleaned top HUD bar removing all internal developer/debug data, perfectly aligning Pilot Identity, Ship Vitals, Mission Objectives, and Command Actions.
- **Interactive Minimap / Radar HUD**: 2D radar displaying player heading angle, nearby targets, discovery markers, space station hub, and collapsible toggle mode.
- **Multi-Phase Warp Animation**: Hyperspace warp jump sequence featuring engine charge, star stretching, radial bloom, particle tunnel rendering, and exit flashes.
- **Persistent Galactic Archive & Codex (`ArchiveModal.tsx`)**: Full-screen logbook showcasing mapped celestial objects with real-time text search, morphology filters (Spiral, Elliptical, Irregular), status badges, accuracy ratings, and completion metrics.
- **Single Source of Truth Discovery Synchronization**: Zustand `profile.discoveredGalaxyIds` drives discovery states seamlessly across Phaser engine (`GalaxyManager`), top HUD (`ShipStatusHUD`), Archive Modal, and Pilot Station.
- **Archive → Inspect → Back Navigation Flow**: Smooth modal navigation preserving return state when opening galaxy dossiers from the Archive (`openedFromArchive` state).
- **Quiz Retake Capability**: Players can re-inspect discovered galaxies and retake scientific quizzes anytime directly from the Archive / Galaxy Info screens to improve accuracy, score, and stardust rewards.
- **Mission Objective HUD Synchronization**: Dynamic `Map Galaxies: X/10` display updated in real-time in `ShipStatusHUD`.
- **Reliable Fallback Visual System**: SVG/WebGL procedural deep-space rendering for galaxies when external images are absent or mock assets.
- **Handcrafted Educational Datasets**: Complete astrophysical datasets for 10 major galaxies.
- **Bilingual Interface**: Seamless runtime toggle between English and Bengali (বাংলা) across all HUD elements and modals.

---

## 7. Educational & Quiz Pipeline

Educational and assessment content is loaded dynamically via dedicated pipelines:

1. **JSON Dataset Registry**: Handcrafted JSON files located in `src/data/educational/` and `src/data/quizzes/` are mapped by `galaxyId`.
2. **Dynamic Resolution**: When a galaxy is scanned, `contentPipeline.ts` retrieves the primary dossier JSON and `quizPipeline.ts` retrieves the corresponding quiz dataset.
3. **Fallback Generation**: If a custom JSON file is missing or corrupted, the pipelines automatically generate valid `EducationalContent` and `QuizData` structures from core `galaxies.json` attributes to prevent UI crashes.

---

## 8. Galaxy Database

The following 10 handcrafted galaxies are fully integrated with coordinate data, spectral metrics, educational cards, and adaptive quizzes:

1. **Milky Way Galaxy (`milky-way`)**: Barred spiral, 100,000 light-years diameter, home galaxy.
2. **Andromeda Galaxy (`andromeda`)**: M31, largest Local Group member, 2.5 million light-years distance.
3. **Sombrero Galaxy (`sombrero`)**: M104, prominent halo and dust lane in Virgo constellation.
4. **Whirlpool Galaxy (`whirlpool`)**: M51, grand design spiral interacting with companion NGC 5195.
5. **Triangulum Galaxy (`triangulum`)**: M33, third largest Local Group spiral, lacks central SMBH.
6. **Black Eye Galaxy (`black-eye`)**: M64, counter-rotating gas disks and dark absorbing dust lane.
7. **Pinwheel Galaxy (`pinwheel`)**: M101, face-on giant spiral spanning 170,000 light-years.
8. **Cartwheel Galaxy (`cartwheel`)**: ESO 350-40, ring galaxy created by direct galactic collision.
9. **Large Magellanic Cloud (`large-magellanic-cloud`)**: LMC, Milky Way satellite housing Tarantula Nebula.
10. **Small Magellanic Cloud (`small-magellanic-cloud`)**: SMC, dwarf irregular galaxy with low metallicity.

---

## 9. Controls

- **W / Up Arrow**: Engage Main Forward Thrusters
- **A / Left Arrow**: Rotate Ship Left
- **D / Right Arrow**: Rotate Ship Right
- **S / Down Arrow**: Reverse Dampeners / Slow Down
- **Shift (Hold)**: Engage Plasma Booster
- **E**: Initiate Spectrographic Scanner / Open Briefing
- **Space**: Quick Action / Warp Engage
- **~ (Tilde)**: Toggle Developer Diagnostic Overlay
- **ESC**: Skip Active Cinematic / Close Modals

---

## 10. Audio Architecture

- **Synthesizer Engine**: Procedural Web Audio oscillator generating custom thruster rumbles, scanner sweeps, and warp tunnels.
- **Multi-Channel Mixing**: Independent gain nodes for BGM (`ambientVolume`) and SFX (`sfxVolume`).
- **Seamless Crossfading**: Dynamic volume attenuation during warp sequences, dialogue triggers, and modal overlays.

---

## 11. UI & Visual Hierarchy

- **Design Aesthetic**: Clean, high-contrast dark sci-fi glassmorphism utilizing dark slate/cyan themes (`#0f172a`, `#0284c7`, `#f59e0b`).
- **Responsive HUD Layout**: Desktop-first layout with fluid mobile scaling, non-overlapping action bars, and aligned top status panels.
- **Typography**: Inter, Mono, and Serif font pairing with strict label hierarchy.

---

## 12. Performance & Reliability

- **Target Framerate**: Sustained 60 FPS across WebGL and Canvas fallback engines.
- **Memory Management**: Automatic sprite pooling, particle emitter recycling, and EventBus listener cleanup on unmount.
- **Build Optimization**: Vite bundler output clean modular chunks with fast initial load (`compile_applet` and `lint_applet` passed).

---

## 13. Known Limitations

- **Single-System Canvas**: Exploration canvas operates within a 2D boundary grid (`8000x8000 px`).
- **Mock Image Assets**: Educational card showcases currently utilize stylized WebGL/SVG deep-space reticles in lieu of live external NASA API image streaming.
- **Offline Local Storage**: User progress is saved to browser `localStorage` without multi-device cloud sync.

---

## 14. Milestones & Sprint Progress

### Completed Milestones
- **Foundation Refactor**: ✅ **COMPLETE**
- **Phaser Foundation**: ✅ **COMPLETE**
- **Gameplay Foundation Migration**: ✅ **COMPLETE**
- **Universe Generation System**: ✅ **COMPLETE**
- **Interactive Galaxy System**: ✅ **COMPLETE**
- **Scanner System**: ✅ **COMPLETE**
- **Discovery Experience**: ✅ **COMPLETE**
- **Educational Learning Layer**: ✅ **COMPLETE**
- **Quality Sprint 1.0**: ✅ **COMPLETE**
- **Sprint 2.0 — Adaptive Quiz & Scientific Assessment**: ✅ **COMPLETE**
- **Stabilization Sprint 1.0**: ✅ **COMPLETE**
- **Sprint 2.1 — Discovery Log & Galactic Archive**: ✅ **COMPLETE**
- **Sprint 2.1.1 — Regression Fixes & State Synchronization**: ✅ **COMPLETE**
- **Documentation Synchronization & HUD Redesign**: ✅ **COMPLETE**

### Next Milestone
- **Sprint 2.2 — Asteroids & Stardust**: Procedural asteroids, lightweight laser system, stardust collection, ambient gameplay.

### Future Milestones (Lean V1 Roadmap)
- **Sprint 2.3 — Progression**: Lightweight Explorer XP, levels, unlockable ships, small upgrades.
- **Sprint 2.4 — Alien Survey Drones**: Simple AI drones, basic defensive combat, optional encounters.
- **Sprint 2.5 — Firebase Authentication & Cloud Save**: Login, cloud save, progress synchronization.
- **Sprint 2.6 — Electron Desktop Release**: Desktop packaging, installer, production build.
- **Beta Phase**: Full playtesting, bug fixing, performance optimization, UI/UX polish, audio polish.
- **Version 1.0 Release**: Educational desktop game ready for Astronomy Pathshala students.
