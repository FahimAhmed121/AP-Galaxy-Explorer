# DEVELOPMENT_ROADMAP.md — AP Galaxy Explorer

## 💡 Development Philosophy & Lean V1 Vision

- **Educational Exploration First**: Version 1 focuses strictly on delivering a highly polished, interactive, and authentic educational exploration experience for Astronomy Pathshala students.
- **Scope Discipline & Feature Creep Prevention**: Advanced or unneeded complex infrastructure systems are intentionally postponed to maintain high craftsmanship on core features.
- **Lightweight & Maintainable Architecture**: Every sprint keeps the codebase lightweight, highly maintainable, type-safe, and optimized for rapid iterative development within Google AI Studio.

---

## Completed Milestones

- ✅ **Foundation Refactor**: React 18 + Vite template, TypeScript strict mode, and decoupled EventBus architecture.
- ✅ **Phaser Foundation**: Phaser 3 WebGL 2D engine integration, canvas rendering layer, and scene lifecycle management.
- ✅ **Gameplay Foundation Migration**: Refactored game entities, state management, and asset pipelines to Phaser 3 system architecture.
- ✅ **Universe Generation System**: Open-space 8000x8000 px space grid, parallax background starfields, and smooth camera tracking.
- ✅ **Interactive Galaxy System**: Spatial indexing (`GalaxyManager`), proximity detection reticles, and 10 handcrafted deep-space galaxies.
- ✅ **Scanner System**: Spectrographic scanner system (`ScannerSystem`), energy expenditure, beam visuals, and interactive target locking.
- ✅ **Discovery Experience**: Cinematic camera focus (`DiscoveryController`) and narrative AURA AI dialogue with step pagination (`DiscoveryOverlay`).
- ✅ **Educational Learning Layer**: Authentic 2-column NASA/JWST educational dossiers (`LearningBriefingModal`) and dynamic content dataset loader (`contentPipeline.ts`).
- ✅ **Quality Sprint 1.0**: Flight physics tuning, 100-point Plasma Energy system, multi-phase HTML5 canvas hyperdrive warp jump animation (`WarpJumpOverlay`), interactive 2D minimap (`RadarHUD`), and HUD bar streamlining.
- ✅ **Sprint 2.0 — Adaptive Quiz & Scientific Assessment**: Dedicated `QuizController`, lazy-loaded dataset pipeline (`quizPipeline.ts`), NASA Mission Console UI (`QuizAssessmentModal`), immediate scientific feedback, score rewards, and keyboard accessibility.
- ✅ **Stabilization Sprint 1.0**: Traced and resolved event payload mismatch in AURA transition, eliminated runtime property crashes, verified complete 9-step progression loop for all 10 galaxies, and set developer debug overlay to hidden by default.
- ✅ **Sprint 2.1 — Discovery Log & Galactic Archive**: Persistent Galactic Archive (`ArchiveModal`), search filtering, morphology classification filters (Spiral, Elliptical, Irregular), galaxy cards with status badges, Explorer Dossier integration (`PilotDashboardModal`), discovery progress metrics, educational dossier inspection, quiz retake capability, image fallback system, and NASA-inspired dark-tech archive UI.
- ✅ **Sprint 2.1.1 — Regression Fixes & State Synchronization**: Unified single source of truth using Zustand (`profile.discoveredGalaxyIds`), bidirectional EventBus synchronization between Phaser `GalaxyManager` and React components (`App`, `ShipStatusHUD`, `ArchiveModal`, `PilotDashboardModal`), dynamic `Map Galaxies: X/10` HUD counter sync, Archive → Inspect → Back flow state restoration, quiz retake score/stardust persistence fix, and navigation fixes.
- ✅ **Sprint 2.2 — Asteroids, Stardust Economy & Ship Progression**: Procedural Phaser-based `AsteroidManager`, organic asteroid fields, plasma cannon laser combat, fragmentation physics, stardust harvesting, vacuum dust magnetics, and 4-tier Pilot Dashboard upgrade progression system (Ion Engine, Deflector Shield, Plasma Cannon, Vacuum Dust Magnet).
- ✅ **Sprint 2.2.1 — Gameplay Balance, Feel & Polish**: Natural drifting asteroid velocities, 7 organic deep-space clusters, enlarged visual scale (~1.5-2x), increased collision ramming durability, Spacebar weapon firing input fix, Plasma Energy audit and consumption (6 energy/shot), tuned shield regeneration (2.0/s), balanced Stardust economy curves ($60 \cdot 2^{lvl-1}$ upgrades), and full documentation synchronization.
- ✅ **Sprint 2.3 — Explorer Progression & Cosmetic Unlocks**: Centralized career progression system (`progressionData.ts`), 15 Explorer levels & rank titles (Space Cadet → Master Voyager of the Cosmos), Explorer XP reward pipeline (discoveries, quizzes, perfect score bonuses), 7 Merit Badges across 4 categories, 5 Passive Perks (scanner speed, magnet radius, max speed, shield regen, XP bonus), 12 customizable cosmetics (Ship Skins, Thruster Effects, Scanner Effects), interactive Pilot Dashboard customization tab, top HUD rank/level display, and comprehensive stabilization fixes.
- ✅ **Sprint 2.4 — Alien Survey Drones**: Autonomous AI survey drones (`AlienSurveyDrone.ts`), 5-state AI FSM (PATROL, SURVEY, INVESTIGATE, ATTACK, RETURN), off-screen galaxy-centric sector spawning (`DroneManager.ts`), proximity/context-driven AURA alerts, defensive plasma laser combat, Arcade Physics overlap object identity collision safeguards, Stardust and XP rewards, and forensic audit cleanup.
- ✅ **Sprint 2.4.5 — Educational Content, UI/UX & Media Polish**: Complete 5-card bilingual (EN/BN) educational content and narrative briefs for all 10 core galaxies, 50-question scientific quiz expansion (5 questions per galaxy), real astronomical image integration (`realImageUrl` and resilient fallback system in `GalaxyImage.tsx`), verified active YouTube video tour support with high-res thumbnails, in-app embedded player, and direct YouTube watch option, learning card replayability via Galactic Archive, streamlined learning briefing modal UI/UX, and opaque asteroid crater visual polish (`AsteroidManager.ts`).
- ✅ **Sprint 2.5 — Firebase Authentication & Cloud Save**: Comprehensive user authentication and cloud persistence system:
  - *Phase 1 (Auth Foundation)*: Firebase Web SDK integration, `AuthService` supporting Google OAuth (`signInWithGoogle`) and Email/Password (`signInWithEmail`, `signUpWithEmail`), session management, and `AuthModal` UI.
  - *Phase 2 (Cloud Save & Serialization)*: Explicit DTOs (`CloudSaveProfileDTO`), `CloudSaveSerializer` with boundary validation, `CloudSaveResolver` deterministic field-by-field conflict resolution (Additive Set Union, Monotonic Max for XP/scores, Stardust Net-Delta Reconciliation), `CloudSaveService` Firestore operations under `users/{uid}/profile/main`, and `firestore.rules`.
  - *Phase 3 (Sync Manager & UI)*: `SyncManager` 3-second debounced auto-sync, dirty state tracking, reentrancy guards, session generation tokens, offline/online recovery, Cloud Sync badges in HUD/Dashboard, and Main Menu / Settings user profile controls.
- ✅ **Documentation Synchronization**: Comprehensive synchronization of project state, engineering standards, system architectures, drone system architecture, and Lean V1 roadmap.

---

## Active & Upcoming Milestones (Lean V1 Roadmap)

### Sprint 2.6 — Electron Desktop Release
**Goal**: Package the application into a standalone cross-platform desktop game with local loopback server, robust window lifecycle, and offline/online save parity.

- ✅ **Phase 1 — Electron Core & Build Integration (COMPLETED & AUDITED)**:
  - Minimal, secure Electron main process (`electron/main.ts`) and preload bridge (`electron/preload.ts`).
  * Strict security settings: `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, `webSecurity: true`, `allowRunningInsecureContent: false`.
  - Vite relative asset base configuration (`base: './'`) for static bundle resolution.
  - Embedded local loopback HTTP server (`127.0.0.1:<port>`) serving `/dist` in production.
  - External link interception routing to OS default browser via `shell.openExternal`.
  - `esbuild` desktop build pipeline (`build:electron`, `electron:build`, `electron:dev`) in `package.json`.
  - Sprint 2.5 regression audit verified 100% intact.
  - Audit Verdict: **PASS WITH WARNINGS — READY FOR PHASE 2**.

- ✅ **Phase 2 — Desktop Window Management & Lifecycle Integration (COMPLETED & AUDITED)**:
  - Single-instance locking (`app.requestSingleInstanceLock()`) and duplicate process prevention.
  - Window sizing ($1280 \times 720$, min $1024 \times 600$), centering (`center: true`), resizability, and dark background (`#030712`).
  - Gated visual presentation (`ready-to-show`) to prevent white startup flashes.
  - Robust embedded production server lifecycle (`startLocalProductionServer`, `stopLocalProductionServer`) with path traversal safeguards and SPA routing fallback.
  - Cross-platform application lifecycle event orchestration (`whenReady`, `activate`, `window-all-closed`, `will-quit`).
  - Strict security sandboxing and external URL navigation containment via `shell.openExternal`.
  - Audit Verdict: **PASS**.

- 📋 **Phase 3 — Desktop Packaging & Distribution (NOT STARTED)**:
  - Cross-platform packaging configuration (`electron-builder` / packager).
  - Cross-platform clean and build script stabilization.
  - Executable installers (Windows `.exe`/NSIS, macOS `.dmg`, Linux `.AppImage`).
  - Production release candidate verification.

---

## Beta & Release Phase

### Beta Phase
- Comprehensive user playtesting with Astronomy Pathshala students and educators.
- Bug fixing and edge-case resolution.
- WebGL performance optimization for low-end hardware.
- UI/UX interaction polish and responsive layout refinement.
- Web Audio synthesizer sound mixing and soundscape polish.

### Version 1.0 Release
- Production-ready educational space exploration desktop & web game ready for Astronomy Pathshala students!
