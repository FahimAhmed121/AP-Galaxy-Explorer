# ARCHITECTURE_OVERVIEW.md — High-Level Codebase Map

## 1. Directory Responsibilities

- `/electron/`:
  - `main.ts`: Electron main process single-instance lock (`app.requestSingleInstanceLock()`), window lifecycle manager ($1280 \times 720$, min $1024 \times 600$, `ready-to-show` visual gating), Chromium sandboxing configuration, embedded local loopback HTTP production server (`127.0.0.1:<port>`) with path traversal guards and graceful teardown (`stopLocalProductionServer`), and external navigation interceptor (`shell.openExternal`).
  - `preload.ts`: Minimal, secure context bridge exposing only `{ isDesktop: true, platform: process.platform }` with zero Node.js execution primitives exposed to the DOM.
- `/src/components/`:
  - `hud/`: React HUD overlays and modals (`ShipStatusHUD`, `RadarHUD`, `DiscoveryOverlay`, `LearningBriefingModal`, `QuizAssessmentModal`, `WarpJumpOverlay`, `PilotDashboardModal`, `GameOverModal`).
  - `common/`: Reusable UI containers, buttons, theme wrappers, `AboutCredits` (mission & developer profiles), and `AuthModal` (Firebase Email/Password registration and login dialog).
  - `educational/`: Educational visualization components and certificates (`Certificate.tsx`, `GalaxyInfo.tsx`).
  - `views/`: Full-screen views (`SettingsModal.tsx`, `ArchiveModal.tsx`, `MainMenu.tsx`).
- `/src/services/`:
  - `firebase.ts`: Singleton instance initialization for Firebase Auth and Firestore.
  - `auth/`: `AuthService.ts` managing user sessions, Email & Password registration/login, callsign assignment, email verification, password reset, and user sign out.
  - `cloudSave/`:
    - `cloudSaveTypes.ts`: DTO schemas (`CloudSaveProfileDTO`, `CloudSavePayload`).
    - `CloudSaveSerializer.ts`: Bidirectional state/DTO serialization and boundary sanitization.
    - `CloudSaveResolver.ts`: Field-by-field deterministic conflict resolution (Additive Set Union, Monotonic Max, Stardust Net-Delta).
    - `CloudSaveService.ts`: Firestore persistence under locked paths (`users/{uid}/profile/main`).
    - `SyncManager.ts`: 3-second debounced auto-sync orchestrator with dirty tracking, session generation tokens (`activeSyncSessionId`), and network listeners.
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
  - `progressionData.ts`: Explorer levels, rank titles, merit badges, cosmetic items, and passive perk definitions.
  - `galaxies.json`: Master galaxy spatial catalog and astrophysical properties.
- `/src/engine/`:
  - `audioEngine.ts`: Custom Web Audio procedural oscillator sound synthesizer and multi-channel mixer.
- `/src/phaser/`:
  - `entities/`: Game entities (`PlayerShip`, `GalaxyObject`, `SpaceStation`, `AlienSurveyDrone`, `Asteroid`).
  - `managers/`: Persistent state and entity managers (`GalaxyManager`, `AsteroidManager`, `DroneManager`, `SaveManager`, `ParticleManager`, `WorldManager`).
  - `systems/`: Controllers and low-level processing systems (`DiscoveryController`, `LearningController`, `QuizController`, `ScannerSystem`, `ScannerVisualSystem`, `InputSystem`, `AudioSystem`, `DebugOverlaySystem`).
  - `scenes/`: Phaser scenes (`MainGameplayScene`, `LoadingScene`).
- `/src/store/`:
  - `useGameStore.ts`: Zustand reactive store for pilot profile, option settings, language, stardust currency, career progression, and 4-tier ship upgrade levels.
- `/firestore.rules`:
  - Production security rules enforcing owner-only read/write access (`request.auth.uid == userId`), numeric upper/lower boundaries, and metadata schema validation.

---

## 2. Structural Layer Responsibilities

### Phaser Engine Layer (`/src/phaser/`)
- **Entities (`/entities/`)**:
  - `PlayerShip`: Handles physics body, rotation, thrust velocity vectors, Plasma Energy expenditure (6 energy / laser shot), Deflector Shield regeneration, weapon firing, magnetic stardust attraction, and collision damage.
  - `GalaxyObject`: Handles galaxy sprite rendering, pulse glow animations, and coordinate positioning.
  - `SpaceStation`: Handles station rendering and docking interaction bounds.
  - `AlienSurveyDrone`: Autonomous AI survey drone with 5-state FSM (`PATROL`, `SURVEY`, `INVESTIGATE`, `ATTACK`, `RETURN`).
  - `Asteroid`: Procedural asteroid entity with collision durability and multi-tier fragmentation physics.
- **Managers (`/managers/`)**:
  - `GalaxyManager`: Handles spatial indexing, proximity detection (`checkProximity`), entity lifecycle, and discovery state tracking.
  - `AsteroidManager`: Handles procedural asteroid field generation across 7 organic clusters, fragmentation physics (Large → Medium → Small), collision damage calculations, laser overlap checks, and Stardust orb creation.
  - `DroneManager`: Manages off-screen AI survey drone spawning near unmapped galaxies with a 60s cooldown and AURA alert throttling.
  - `SaveManager`: Handles persistent `localStorage` synchronization for user progress, scores, ship upgrades, and options.
  - `ParticleManager`: Manages particle emitters for thruster exhaust, scanner beams, laser flashes, and warp flares.
- **Controllers & Systems (`/systems/`)**:
  - `DiscoveryController`: Manages discovery state machine, camera zooming, and ship velocity dampening.
  - `LearningController`: Manages educational briefing state machine, loading content via `contentPipeline.ts`.
  - `QuizController`: Manages adaptive quiz assessment state machine, timing, and score calculations.
  - `ScannerSystem`: Computes scanning range, plasma energy expenditure, and triggers scan completion.
  - `InputSystem`: Binds WASD/Arrow/Touch inputs to thruster forces, `Shift` to Plasma Booster, and `Spacebar`/`F`/`K`/`Left Click` to Plasma Cannon firing.
  - `ScannerVisualSystem`: Renders dynamic WebGL spectrographic reticles and scan rays.
  - `AudioSystem`: Bridges EventBus events with procedural sound synthesis.
  - `DebugOverlaySystem`: Toggleable developer overlay (`~` key) for inspecting performance and coordinates.

### React Presentation Layer (`/src/components/`)
- **Top HUD Bar (`ShipStatusHUD.tsx`)**: Displays Pilot Identity & Rank, Hull Integrity, Deflector Shield, Plasma Energy, Current Galaxy, Mission Objective (`Map Galaxies [x/10]`), Stardust, Score, Cloud Sync status badge, and Command Action buttons.
- **Galactic Archive & Codex (`ArchiveModal.tsx`)**: Full-screen catalog showcasing mapped celestial objects with real-time text search, morphology filters, status badges, and direct dossier inspection / quiz retakes.
- **Galaxy Dossier (`GalaxyInfo.tsx`)**: Detailed scientific inspection screen providing deep-dive summaries, telescope visual showcases, YouTube video tours, key astrophysical parameters, and retake quiz button.
- **Explorer Dossier & Station (`PilotDashboardModal.tsx`)**: 3-tab pilot station featuring Hardware Upgrades, Cosmetics Customization, and Dossier with Badges/Perks.
- **Minimap Radar (`RadarHUD.tsx`)**: 2D vector radar with spatial coordinates, space station hub, player heading angle, and target indicators.
- **Dialogue Overlay (`DiscoveryOverlay.tsx`)**: AURA AI dialogue with player-controlled pagination (`PREV`, `NEXT`, `SKIP`, `CONTINUE TO BRIEFING`).
- **Educational Briefing (`LearningBriefingModal.tsx`)**: Full-screen 2-column NASA/JWST dossier showcasing telescope images, key metrics, and structured cards.
- **Quiz Assessment Console (`QuizAssessmentModal.tsx`)**: NASA Mission Console interface presenting adaptive MCQ questions, immediate feedback, and scoring.
- **Warp Jump Hyperdrive (`WarpJumpOverlay.tsx`)**: Canvas overlay rendering star stretching, camera shake, and hyperdrive particle tunnels.

---

## 3. Communication & Data Flow

### EventBus Pub/Sub Pipeline
Communication between Phaser 3 WebGL engine systems and React DOM UI overlays is entirely decoupled through `eventBus` (`core/events.ts`).

```text
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
5. **Reward, Save & Cloud Sync**: Upon passing a quiz, stardust, score, and XP rewards are persisted to Zustand store (`useGameStore`) and `localStorage`. `SyncManager` debounces changes and writes to Firestore (`users/{uid}/profile/main`). `QuizController` emits `RESUME_GAMEPLAY`, restoring camera and flight controls.
