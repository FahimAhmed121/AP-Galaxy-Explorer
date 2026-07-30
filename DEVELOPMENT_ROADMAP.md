# DEVELOPMENT_ROADMAP.md — AP Galaxy Explorer

## Completed Milestones

### 1. Foundation
- **Goal**: Establish core 2D application architecture, React + Phaser engine integration, and EventBus pipeline.
- **Major Deliverables**:
  - React 18 + Vite SPA template setup with Tailwind CSS.
  - Phaser 3.80+ WebGL game container and scene pipeline (`MainGameplayScene`).
  - Decoupled `eventBus` architecture for DOM <-> Canvas communication.
- **Success Criteria**: WebGL game canvas renders at 60 FPS with responsive UI overlays.

### 2. Universe
- **Goal**: Create open-space navigation mechanics, parallax starfield, and spacecraft physics.
- **Major Deliverables**:
  - `PlayerShip` entity with WASD/Arrow key controls and inertia vector physics.
  - Parallax multi-layer starfield background.
  - 8000x8000 boundary space world with camera tracking (`lerp 0.08`).
- **Success Criteria**: Smooth space navigation with responsive inertia, turn velocity, and camera bounds.

### 3. Galaxy System
- **Goal**: Implement dynamic astronomical entities and spatial indexing.
- **Major Deliverables**:
  - `GalaxyObject` entity rendering procedural galaxy visuals.
  - `GalaxyManager` spatial index for proximity detection and state tracking.
  - 10 handcrafted deep-space galaxies placed across coordinate grid.
- **Success Criteria**: Player ship detects nearby galaxies within scanning radius with visual reticle locks.

### 4. Scanner
- **Goal**: Build spectrographic scanner system for scientific analysis of celestial bodies.
- **Major Deliverables**:
  - `ScannerSystem` and `ScannerVisualSystem` computing range and energy costs.
  - Spectrographic visual ray beams and scan progress feedback.
  - Interactive target lock triggered via `E` key or touch HUD button.
- **Success Criteria**: Activating scanner within range consumes energy and completes analysis.

### 5. Discovery
- **Goal**: Create cinematic galaxy discovery sequence and narrative AI assistant.
- **Major Deliverables**:
  - `DiscoveryController` state machine for cinematic camera zoom and camera pan.
  - `DiscoveryOverlay` presenting AURA research assistant dialogue.
  - Player-controlled dialogue progression (`PREV`, `NEXT`, `SKIP`, `CONTINUE`).
- **Success Criteria**: Scanning unmapped galaxies triggers cinematic reveal with player-controlled reading speed.

### 6. Learning
- **Goal**: Deliver authentic NASA / JWST / Hubble educational dossiers.
- **Major Deliverables**:
  - `LearningBriefingModal` rendering structured 2-column educational cards.
  - `contentPipeline.ts` dynamic dataset loader with automatic fallback safety.
  - Handcrafted educational JSON dossiers for 10 major galaxies.
- **Success Criteria**: Discovery sequence seamlessly displays astrophysical dossiers with spectral metrics and scientific takeaways.

### 7. Quality Sprint 1.0
- **Goal**: Polish flight physics, energy mechanics, dialogue pacing, HUD layout, warp visuals, and dataset routing.
- **Major Deliverables**:
  - Refined spacecraft mass, acceleration (`220 px/s²`), and drag (`0.988`).
  - 100-point Plasma Energy system powering boosters and scanners.
  - Cleaned HUD showing Hull, Shield, Energy, Stardust, and Mission status.
  - Multi-phase HTML5 canvas hyperspace warp jump animation (`WarpJumpOverlay`).
  - Interactive 2D Minimap (`RadarHUD`) showing player heading, galaxies, and space station.
- **Success Criteria**: Fully verified vertical slice with zero broken UI, zero JSON routing failures, and 60 FPS performance.

### 8. Sprint 2.0 — Adaptive Quiz & Scientific Assessment
- **Goal**: Complete the educational loop with a production-ready adaptive quiz system designed as a scientific mission debriefing.
- **Major Deliverables**:
  - Dedicated `QuizController.ts` managing quiz flow, scoring, accuracy, streak counters, and timing.
  - Lazy-loaded quiz dataset pipeline (`quizPipeline.ts`) with static JSON questions and dynamic fallback generation.
  - MCQ evaluation support with architecture for True/False and Image questions.
  - NASA Mission Console UI (`QuizAssessmentModal.tsx`) with dark-tech HUD aesthetic, AURA scientific tone, and immediate feedback.
  - 80% passing threshold leading to Discovery Log placeholder step.
  - EventBus integration (`QUIZ_STARTED`, `QUESTION_ANSWERED`, `QUIZ_PASSED`, `QUIZ_FAILED`, `QUIZ_COMPLETED`).
  - Keyboard accessibility (keys 1-4, Enter, Esc) and reduced motion support.
- **Success Criteria**: Scientific mission debriefing quiz runs seamlessly with immediate feedback, score persistence, and non-destructive retry mechanics.

---

## Upcoming Milestones

### 1. Sprint 2.1 — Discovery Logbook
- **Goal**: Provide a persistent galactic archive and pilot logbook.
- **Major Deliverables**:
  - Full-screen Pilot Logbook UI listing all discovered and unexplored galaxies.
  - Filterable catalog by constellation, galaxy type, distance, and completion score.
  - Re-read dossier access for previously mapped galaxies.
- **Success Criteria**: Players can review mapped galaxies, spectral data, and quiz scores from the main menu or pilot station.

### 3. Sprint 2.2 — Progression & Station Trading
- **Goal**: Expand pilot progression, rank badges, and space station upgrades.
- **Major Deliverables**:
  - Pilot XP and rank level system (Ensign → Commander → Chief Astronomer).
  - Space Station Alpha docking hub for repairing hull and upgrading scanner range.
  - Achievement badge notification toast engine.
- **Success Criteria**: Players can spend collected stardust at Space Station Alpha to upgrade ship capabilities.

### 4. Sprint 2.3 — Asteroid Fields & Stardust Mining
- **Goal**: Add ambient asteroid hazards and interactive stardust mining.
- **Major Deliverables**:
  - Procedural asteroid field generation in unmapped sector zones.
  - Mining laser beam mechanics to fracture asteroids into collectable stardust nodes.
  - Shield collision response and dynamic damage feedback.
- **Success Criteria**: Navigating asteroid belts requires piloting skill and provides stardust resource harvesting.

### 5. Sprint 2.4 — Alien Survey Drones
- **Goal**: Introduce autonomous AI survey drones and environmental space hazards.
- **Major Deliverables**:
  - Non-combat autonomous drone entities patrolling outer sectors.
  - Hacking/Scanning mini-games to download foreign navigational data.
  - Solar flare cosmic storms affecting ship sensor systems.
- **Success Criteria**: Sector exploration features dynamic environmental events and interactive survey drones.

### 6. Sprint 2.5 — Firebase Cloud Synchronization
- **Goal**: Enable cloud user authentication, cross-device save states, and leaderboards.
- **Major Deliverables**:
  - Firebase Authentication (Google & Anonymous sign-in).
  - Firestore sync for pilot profiles, mapped galaxies, and stardust currency.
  - Global Astronomer Leaderboard for quiz accuracy and mapped sectors.
- **Success Criteria**: Player progress persists across browser sessions and devices automatically.

### 7. Sprint 2.6 — Standalone Desktop Release (Electron)
- **Goal**: Package AP Galaxy Explorer into an offline cross-platform desktop application.
- **Major Deliverables**:
  - Electron wrapper configuration and main process file (`electron.js`).
  - Native filesystem access for local logbook backups.
  - Window management, native menus, and installer builds (Windows / macOS / Linux).
- **Success Criteria**: Executable desktop installer launches full-screen game without web browser dependency.
