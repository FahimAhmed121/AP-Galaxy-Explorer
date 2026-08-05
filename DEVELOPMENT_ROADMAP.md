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
- ✅ **Documentation Synchronization**: Comprehensive synchronization of project state, engineering standards, system architectures, and Lean V1 roadmap.

---

## Upcoming Milestones (Lean V1 Roadmap)

### Sprint 2.3 — Explorer Progression
**Goal**: Introduce lightweight long-term player career progression and cosmetic rewards while keeping educational exploration as the primary gameplay focus.
**Deliverables**:
- **Explorer XP System**: Earn XP from galaxy discoveries, quiz performances, and exploration milestones.
- **Explorer Levels & Ranks**: Progress through titles (Space Cadet → Junior Explorer → Stellar Navigator → Galactic Cartographer → Senior Astronomer → Chief Astronomer).
- **Cosmetic Unlocks**: Unlockable ship skins, thruster color themes, scanner pulse colors, explorer badges, and profile banners.
- **Passive Explorer Perks**: Lightweight passive bonuses (slight scanner range expansion, energy regen efficiency boost, small discovery XP multiplier).
- **Architectural Separation**: Operates independently from Sprint 2.2 Ship Hardware Upgrades (which use Stardust currency for hardware stats). Explorer Progression tracks career achievement, cosmetics, and rank titles.

### Sprint 2.4 — Alien Survey Drones
**Goal**: Introduce autonomous AI survey drones for optional environmental encounters.
**Deliverables**:
- Simple AI survey drone entities patrolling deep space sectors.
- Basic defensive combat mechanics and sensor jammer abilities.
- Optional non-destructive encounters.
*(Educational exploration remains the primary focus).*

### Sprint 2.5 — Firebase Authentication & Cloud Save
**Goal**: Implement user account management and cross-device save state persistence.
**Deliverables**:
- User login (Google OAuth & Anonymous authentication).
- Firestore cloud save synchronization for pilot profiles and mapped catalog.
- Cross-device progress restoration.

### Sprint 2.6 — Electron Desktop Release
**Goal**: Package the application into a standalone cross-platform desktop game.
**Deliverables**:
- Desktop packaging configuration using Electron.
- Executable installers (Windows, macOS, Linux).
- Production bundle verification and release candidate build.

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
