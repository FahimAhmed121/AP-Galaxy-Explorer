# ARCHITECTURE_OVERVIEW.md — High-Level Codebase Map

## 1. Directory Responsibilities

- `/src/components/`:
  - `hud/`: React HUD overlays and modals (`ShipStatusHUD`, `RadarHUD`, `DiscoveryOverlay`, `LearningBriefingModal`, `QuizAssessmentModal`, `WarpJumpOverlay`, `PilotDashboardModal`, `GameOverModal`).
  - `common/`: Reusable UI containers, buttons, and theme wrappers.
  - `educational/`: Educational visualization components.
  - `views/`: Full-screen views (Options, Archive).
- `/src/core/`:
  - `types.ts`: Shared TypeScript interfaces and enums (`Ship`, `Galaxy`, `Profile`, `Quiz`, `EducationalContent`).
  - `config.ts`: Physics constants, world bounds (`8000x8000 px`), and default game settings.
  - `events.ts`: Central typed Pub/Sub event bus definitions and payloads.
  - `logger.ts`: Centralized application logging utility.
- `/src/data/`:
  - `educational/`: Handcrafted galaxy JSON dossiers.
  - `quizzes/`: Handcrafted quiz JSON question banks.
  - `contentPipeline.ts`: Dynamic educational dossier loader with fallback safety.
  - `quizPipeline.ts`: Asynchronous quiz loader and question generator.
  - `galaxies.json`: Master galaxy spatial catalog and astrophysical properties.
- `/src/engine/`:
  - `audioEngine.ts`: Custom Web Audio procedural oscillator sound synthesizer and multi-channel mixer.
- `/src/phaser/`:
  - `entities/`: Game entities (`PlayerShip`, `GalaxyObject`, `SpaceStation`).
  - `managers/`: Persistent state and entity managers (`GalaxyManager`, `AsteroidManager`, `SaveManager`, `ParticleManager`).
  - `systems/`: Controllers and low-level processing systems (`DiscoveryController`, `LearningController`, `QuizController`, `ScannerSystem`, `ScannerVisualSystem`, `InputSystem`, `AudioSystem`, `DebugOverlaySystem`).
  - `scenes/`: Phaser scenes (`MainGameplayScene`, `LoadingScene`).
- `/src/store/`:
  - `useGameStore.ts`: Zustand reactive store for pilot profile, option settings, language, stardust currency, and 4-tier ship upgrade levels.

---

## 2. Structural Layer Responsibilities

### Phaser Engine Layer (`/src/phaser/`)
- **Entities (`/entities/`)**:
  - `PlayerShip`: Handles physics body, rotation, thrust velocity vectors, Plasma Energy expenditure (6 energy / laser shot), Deflector Shield regeneration, weapon firing, magnetic stardust attraction, and collision damage.
  - `GalaxyObject`: Handles galaxy sprite rendering, pulse glow animations, and coordinate positioning.
  - `SpaceStation`: Handles station rendering and docking interaction bounds.
- **Managers (`/managers/`)**:
  - `GalaxyManager`: Handles spatial indexing, proximity detection (`checkProximity`), entity lifecycle, and discovery state tracking.
  - `AsteroidManager`: Handles procedural asteroid field generation across 7 organic clusters, fragmentation physics (Large → Medium → Small), collision damage calculations, laser overlap checks, and Stardust orb creation.
  - `SaveManager`: Handles persistent `localStorage` synchronization for user progress, scores, ship upgrades, and options.
  - `ParticleManager`: Manages particle emitters for thruster exhaust, scanner beams, laser flashes, and warp flares.
- **Controllers (`/systems/`)**:
  - `DiscoveryController`: Manages the discovery state machine (`IDLE` → `DISCOVERING` → `AURA_PRESENTING` → `READY_FOR_LEARNING` → `FINISHED`), camera zooming, and ship velocity dampening.
  - `LearningController`: Manages the educational briefing state machine (`IDLE` → `LOADING` → `PRESENTING` → `COMPLETED`), loading content via `contentPipeline.ts`.
  - `QuizController`: Manages the adaptive quiz assessment state machine (`IDLE` → `LOADING` → `QUESTION_ACTIVE` → `EVALUATING` → `PASSED` / `FAILED` → `COMPLETED`), timing, and score calculations.
- **Systems (`/systems/`)**:
  - `ScannerSystem`: Computes scanning range, plasma energy expenditure, and triggers scan completion.
  - `InputSystem`: Binds WASD/Arrow/Touch inputs to thruster forces, `Shift` to Plasma Booster, and `Spacebar`/`F`/`K`/`Left Click` to Plasma Cannon firing.
  - `ScannerVisualSystem`: Renders dynamic WebGL spectrographic reticles and scan rays.
  - `AudioSystem`: Bridges EventBus events with procedural sound synthesis (thruster rumbles, laser zaps, explosion rumbles, scanner sweeps).
  - `DebugOverlaySystem`: Toggleable developer overlay (`~` key) for inspecting performance and coordinates.

### React Presentation Layer (`/src/components/`)
- **Top HUD Bar (`ShipStatusHUD.tsx`)**:
  - Displays Pilot Identity & Rank, Hull Integrity, Deflector Shield, Plasma Energy, Current Galaxy, Mission Objective (`Map Galaxies [x/10]`), Stardust, Score, and Command Action buttons (Pilot Station, Codex Archive, Settings).
  - Positioned along a single top alignment plane with high-contrast glassmorphic panels.
- **Galactic Archive & Codex (`ArchiveModal.tsx`)**:
  - Full-screen catalog showcasing discovered and unmapped galaxies with real-time name search, morphology filters (ALL, SPIRAL, ELLIPTICAL, IRREGULAR), discovery status badges, completion stats, and direct dossier inspection / quiz retakes.
- **Galaxy Dossier (`GalaxyInfo.tsx`)**:
  - Detailed scientific inspection screen providing deep-dive summaries, JWST/Hubble telescope visual showcases, key astrophysical parameters, and retake quiz button.
- **Explorer Dossier & Station (`PilotDashboardModal.tsx`)**:
  - Pilot profile HUD displaying flight stats, total galaxies mapped, average quiz accuracy %, stardust count, rank titles, and unlocked badges.
- **Minimap Radar (`RadarHUD.tsx`)**:
  - Renders 2D vector radar with spatial coordinates, space station hub, player heading angle, and target dots.
- **Dialogue Overlay (`DiscoveryOverlay.tsx`)**:
  - Displays AURA AI dialogue with player-controlled pagination (`PREV`, `NEXT`, `SKIP`, `CONTINUE TO BRIEFING`).
- **Educational Briefing (`LearningBriefingModal.tsx`)**:
  - Full-screen 2-column NASA/JWST dossier showcasing telescope images, key metrics, and structured cards.
- **Quiz Assessment Console (`QuizAssessmentModal.tsx`)**:
  - NASA Mission Console interface presenting adaptive MCQ questions, immediate scientific feedback, and score debriefing.
- **Warp Jump Hyperdrive (`WarpJumpOverlay.tsx`)**:
  - Canvas overlay rendering star stretching, camera shake, and hyperdrive particle tunnels.

### Progression Subsystems & State Architecture:
- **Ship Hardware Progression (Sprint 2.2)**:
  - *Currency & Cost*: Stardust reserves earned from asteroid mining, galaxy discoveries, and quiz completions.
  - *Upgrade Path*: Ion Engine Speed, Deflector Shield Capacity & Regen, Plasma Cannon Damage & Fire Rate, Vacuum Dust Magnet Radius.
  - *Data Flow*: React `PilotDashboardModal` → Zustand `useGameStore` → `UPDATE_SHIP_STATS` EventBus event → Phaser `PlayerShip` dynamic hardware property update. Modifies physical flight, combat, and resource gathering performance.
- **Explorer Career Progression (Sprint 2.3)**:
  - *XP & Ranks*: Explorer XP earned from discovery milestones and quiz scores → Explorer Levels & Rank Titles (Space Cadet → Junior Explorer → Stellar Navigator → Galactic Cartographer → Senior Astronomer → Chief Astronomer).
  - *Customization & Perks*: Unlockable ship skins, thruster color themes, scanner pulse FX, badges, banners, and lightweight passive perks (scanner range expansion, energy regen efficiency).
  - *Data Flow*: Zustand `useGameStore` profile career metrics → UI profile displays and cosmetic visual overlays. Operates independently from ship hardware upgrades to maintain architectural separation between physical flight performance and career identity.

---

## 3. Communication & Data Flow

### EventBus Pub/Sub Pipeline
Communication between Phaser 3 WebGL engine systems and React DOM UI overlays is entirely decoupled through `eventBus` (`core/events.ts`).

```
[ InputSystem / PlayerShip ] ──────> [ ScannerSystem ]
                                             │
                                      SCAN_COMPLETED
                                             │
                                             ▼
                                   [ DiscoveryController ]
                                             │
                                    DISCOVERY_READY
                                             │
                                             ▼
                                   [ LearningController ]
                                             │
                                      LEARNING_STARTED
                                             │
                                             ▼
                                [ LearningBriefingModal ]
                                             │
                                     LEARNING_COMPLETED
                                             │
                                             ▼
                                     [ QuizController ]
                                             │
                                       QUIZ_STARTED
                                             │
                                             ▼
                                  [ QuizAssessmentModal ]
                                             │
                                  QUIZ_PASSED / COMPLETED
                                             │
                                             ▼
                                   [ RESUME_GAMEPLAY ]
```

### End-to-End Data Flow Execution:
1. **Flight & Proximity**: `InputSystem` applies forces to `PlayerShip`. `GalaxyManager` performs spatial proximity checks against target coordinates in `galaxies.json`.
2. **Scan & Discovery**: Player presses `E`. `ScannerSystem` validates range/energy and emits `SCAN_COMPLETED`. `DiscoveryController` locks controls, lerps camera zoom, generates AURA dialogue, and emits `DISCOVERY_READY`.
3. **Educational Briefing**: `LearningController` receives `DISCOVERY_READY`, fetches `EducationalContent` via `contentPipeline.ts`, and emits `LEARNING_STARTED`. `LearningBriefingModal` opens interactive NASA cards.
4. **Adaptive Quiz Assessment**: On finishing briefing, `LearningBriefingModal` emits `LEARNING_COMPLETED`. `QuizController` fetches `QuizData` via `quizPipeline.ts` and emits `QUIZ_STARTED`. `QuizAssessmentModal` presents questions and evaluates answers.
5. **Reward, Save & Persistent Archive Sync**: Upon passing or completing a quiz, stardust and score rewards are persisted to Zustand store (`useGameStore`) and `SaveManager`. `profile.discoveredGalaxyIds` acts as the single source of truth across Phaser (`GalaxyManager`), top HUD (`ShipStatusHUD`), Archive (`ArchiveModal`), and Pilot Dashboard. `QuizController` emits `RESUME_GAMEPLAY`, restoring camera and flight controls. Discovered galaxies remain permanently accessible in the Galactic Archive for deep inspection and retaking assessments anytime.
