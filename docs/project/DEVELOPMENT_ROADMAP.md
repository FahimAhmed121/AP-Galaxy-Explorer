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
- ✅ **Sprint 2.5 — Firebase Authentication & Cloud Save (COMPLETED & VERIFIED)**: Comprehensive user authentication and cloud persistence system:
  - *Phase 1 (Auth Foundation)*: Firebase Web SDK integration, `AuthService` supporting Google OAuth (`signInWithGoogle`) and Email/Password (`signInWithEmail`, `signUpWithEmail`), session management, and `AuthModal` UI.
  - *Phase 2 (Cloud Save & Serialization)*: Explicit DTOs (`CloudSaveProfileDTO`), `CloudSaveSerializer` with boundary validation, `CloudSaveResolver` deterministic field-by-field conflict resolution (Additive Set Union, Monotonic Max for XP/scores, Stardust Net-Delta Reconciliation), `CloudSaveService` Firestore operations under `users/{uid}/profile/main`, and `firestore.rules`.
  - *Phase 3 (Sync Manager & UI)*: `SyncManager` 3-second debounced auto-sync, dirty state tracking, reentrancy guards, session generation tokens, offline/online recovery, Cloud Sync badges in HUD/Dashboard, and Main Menu / Settings user profile controls.
- ✅ **Sprint 2.6 Phase 1 — Electron Core & Build Integration (COMPLETED & AUDITED)**: Minimal, secure Electron main process (`electron/main.ts`), preload bridge (`electron/preload.ts`), strict sandboxing, Vite relative asset base (`base: './'`), embedded local loopback HTTP server (`127.0.0.1:<port>`), external link interception via `shell.openExternal`, and dual-target `esbuild` build pipeline.
- ✅ **Sprint 2.6 Phase 2 — Desktop Window Management & Lifecycle Integration (COMPLETED & AUDITED)**: Single-instance locking (`app.requestSingleInstanceLock()`), window sizing ($1280 \times 720$), centering, `ready-to-show` visual gating, embedded server lifecycle management, and application lifecycle event orchestration.
- ✅ **Sprint 2.6.5 — QA Remediation & Stability Hardening (COMPLETED & VERIFIED)**:
  - SYNC-001: Refactored `SyncManager` with `activeSyncSessionId` session generation tracking to prevent auth session race conditions.
  - SYNC-002: Added `updatedAt` to `ExplorerProfile` and deterministic timestamp precedence in `CloudSaveResolver` for callsign and equipped cosmetics/perks.
  - SEC-001: Hardened `electron/main.ts` with strict internal loopback origin validation, blocking unauthorized protocol schemes, and unconditionally delegating external links to OS browser.
  - SEC-002 / SEC-003: Added numeric boundary limits and metadata schema validation in `firestore.rules`.
  - ELEC-001: Structured single-instance startup with early exit and duplicate process prevention.
  - LEAK-001: Implemented clean deregistration of `SCANNER_INTERFERENCE_CHANGED` event listener in `ScannerVisualSystem.destroy()`.
  - BUILD-001: Replaced blocking Google Font imports in `src/index.css` with offline system font fallbacks and non-blocking HTML preconnects.
  - DATA-001: Guarded XP, Stardust, and score arithmetic against `NaN`/`Infinity` across store, serializer, and resolver layers using `Number.isFinite()`.
- ✅ **Pre-Phase-3 Content & UI Update — About Astronomy Pathshala & Credits (COMPLETED & VERIFIED)**: Updated `AboutCredits.tsx` with mission cards, official social links, Game Lead Developer profile for Md. Fahim Ahmed, NASA/ESA media attribution, technology stack, and support mailto.
- ✅ **Sprint 2.6 Phase 3.1–3.5 — Release Candidate & Build Hardening (COMPLETED & AUDITED)**: Release candidate audit, production bundle compilation, security sandboxing verification, and `ap-galaxy-explorer` package naming.
- ✅ **Sprint 2.7 — Google OAuth Clean Retirement (COMPLETED & VERIFIED)**:
  - Permanently dropped "Continue with Google" authentication across all platforms in favor of direct, robust Firebase Email & Password Authentication.
  - Surgically purged Google OAuth UI elements, Preload context bridge methods, main process ephemeral loopback server, PKCE hashing, token exchange HTTPS requests, and IPC channels.
  - Eliminated desktop client secret dependencies from `.env.example` and the runtime.
  - Preserved Electron's embedded loopback static server for HTTP origin parity required by Firebase Auth and Firestore.
  - Retained full user registration, callsign assignment, email verification, password reset, and Firestore cloud save synchronization.

- ✅ **Sprint 2.8 — Post-Playtest Stabilization Pass (COMPLETED & MANUALLY VERIFIED)**:
  - **Task 1 (ELEC-PLAY-01)**: Resolved keyboard input conflict in authentication and settings form fields in Electron. Disabled unnecessary Phaser key captures, implemented active DOM focus detection (`isInputFocused()`), and protected global listeners. Manually verified in Electron with flight keys `S`, `D`, `F`, `E`, `Space`.
  - **Task 2 (ELEC-PLAY-02)**: Resolved local persistence failure across Electron restarts. Implemented deterministic loopback port binding (preferred `39228`), port persistence in `userData/app_port.json`, and hardened Zustand rehydration. Manually verified in Electron across complete application shutdowns and relaunches.
  - **Task 3 (ELEC-PLAY-03)**: Implemented non-destructive Gameplay → Home navigation loop via HUD Action Bar and Settings, with contextual "Resume Exploration" from Main Menu. Manually verified in Electron without loss of discoveries, coordinates, or user session.
  - **Build Verification**: `bunx tsc --noEmit` (PASS), `bun run build` (PASS), `bun run build:electron` (PASS).

---

## Active & Upcoming Milestones

### Sprint 2.8 — Release Hardening & Final QA (ACTIVE STAGE)

```text
Current Stage:
Sprint 2.8 — Release Hardening & Final QA

Core gameplay:
Working (Verified)

Electron launch:
Working (Verified)

Electron gameplay:
Working (Verified)

Authentication:
Working baseline; form typing verified (ELEC-PLAY-01)

Local persistence across Electron restart:
Working & verified (ELEC-PLAY-02)

Gameplay → Home navigation:
Working & verified (ELEC-PLAY-03)

Electron Stabilization Pass:
COMPLETE / VERIFIED

Immediate Priority:
Systematic release testing & packaging validation (No new feature scope)
```

**Goal**: Systematically validate the stabilized application across packaging targets, fresh installations, and release QA scenarios without introducing new feature scope.

- ⏳ **Task 1 (Packaging & Installer Verification)**: Validate production standalone desktop executable bundling (Windows Portable / installer targets) and build artifact integrity.
- ⏳ **Task 2 (Fresh-Machine & Edge-Case Testing)**: Verify clean-slate installation, missing config fallbacks, and offline-to-online recovery flows.
- ⏳ **Task 3 (Multi-Session Cloud Sync QA)**: Validate multi-session Firestore reconciliation under live network transitions and account switching.
- ⏳ **Task 4 (Final Performance & Visual Sign-Off)**: Confirm consistent 60 FPS rendering, audio synthesis stability, and responsive layout across desktop aspect ratios.

---

## Beta & V1.0 Release Milestones

### Beta Phase
- Comprehensive user playtesting with Astronomy Pathshala students and educators.
- Low-end hardware WebGL rendering performance tuning.
- Audio synthesis balance and soundscape polish.

### Version 1.0 Release
- Production standalone desktop executable installer (NSIS / Windows Portable).
- Web preview distribution for online educational demonstrations.
