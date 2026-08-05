# AI_DEVELOPMENT_GUIDE.md — AI Development Constitution & Engineering Handbook

## 1. Project Identity

- **Name**: AP Galaxy Explorer (Astronomy Pathshala Galaxy Explorer).
- **Core Purpose**: An interactive space exploration educational desktop/web simulation created for Astronomy Pathshala.
- **Mission**: Teach real astrophysics and astronomy through immersive exploration, spectrographic scanning, interactive NASA/JWST/Hubble educational dossiers, and adaptive scientific assessments—rather than passive memorization.
- **Narrative Atmosphere**: The game experience is designed to feel like participating in an authentic NASA scientific research mission.
- **Core Pillars**: Exploration and scientific discovery are the primary gameplay pillars. Secondary mechanics (combat, resources, customization) exist strictly to support and enrich exploration, never to replace it.
- **Target Audience**: Students from Class 6–12, science educators, and space enthusiasts.
- **Target Quality**: Lightweight, visually clean, highly maintainable, type-safe, and production-ready for both web deployment and standalone Electron desktop distribution.

---

## 2. Core Design Philosophy

- **Education First**: Every visual element, dialogue sequence, and game mechanic must reinforce authentic scientific discovery.
- **Enjoyable Learning**: Gamification (inertia physics, spectrographic scanning, hyperdrive warps, score rewards) serves to make learning engaging and memorable.
- **Distraction-Free UI**: The user interface must remain minimal, high-contrast, professional, and free from visual clutter or intrusive developer debug data.
- **Simplicity Over Complexity**: Prefer straightforward, elegant architectural solutions over complex abstractions or unnecessary background layers.
- **Scope Discipline**: Avoid feature creep. Prioritize high quality and pristine execution of requested features over volume.

---

## 3. Development Principles

- **Preserve Working Architecture**: Never rewrite or refactor working systems unless explicitly instructed to do so.
- **Incremental Enhancement**: Build modular, incremental features on top of existing patterns rather than replacing foundational logic.
- **Backward Compatibility**: Maintain compatibility across EventBus contracts, data models, and local save states.
- **Dependency Hygiene**: Avoid adding external libraries unless strictly required and justified.
- **Modular Code Organization**: Keep components and functions focused, small, and reusable. Keep files reasonably sized.
- **Composition Over Duplication**: Reuse existing utility components, modals, and store hooks across feature modules.

---

## 4. Architecture Rules

The codebase is split into distinct architectural boundaries. Every developer and AI agent MUST respect these boundaries:

- **React Presentation Layer (`src/components/`)**: Handles UI overlays, HUD bars, interactive modals, Pilot Hangar upgrades, and accessibility controls. Strictly presentation and state display.
- **Phaser 3 Engine Layer (`src/phaser/`)**: Manages 2D WebGL canvas rendering, physics bodies, camera tracking, particle systems, asteroid fields, laser projectiles, and world entity rendering. All 2D gameplay execution occurs strictly inside Phaser 3.
- **Controllers (`src/phaser/systems/`)**: Orchestrate gameplay state machine transitions (`DiscoveryController`, `LearningController`, `QuizController`). Controllers are the sole authorities for state transitions.
- **Managers (`src/phaser/managers/`)**: Own and manage game entities and persistent objects (`GalaxyManager`, `AsteroidManager`, `SaveManager`, `ParticleManager`).
  - *AsteroidManager Responsibilities*: Owns procedural asteroid field generation, 7 organic cluster formations, fragmentation physics (Large → Medium → Small), collision impact mechanics, laser projectile physics, and Stardust orb spawning.
- **Systems (`src/phaser/systems/`)**: Process continuous gameplay mechanics (`ScannerSystem`, `InputSystem`, `AudioSystem`).
  - *Input & Weapon Bindings*: Spacebar, F, K, and Mouse Click fire the Plasma Cannon. Shift strictly engages thruster boost. Never bind Spacebar to boost to avoid weapon input conflicts.
- **EventBus (`src/core/events.ts`)**: Serves as the single, decoupled Pub/Sub communication channel bridging Phaser 3 canvas events and React UI overlays without direct DOM coupling. Includes `UPDATE_SHIP_STATS` and `SHIP_STATS_CHANGED` contracts.
- **Data Pipelines (`src/data/`)**: Store educational datasets and quizzes in modular JSON registries with dynamic pipeline resolution (`contentPipeline.ts`, `quizPipeline.ts`).
- **Global State Store (`src/store/useGameStore.ts`)**: Serves as the single source of truth for user profile state, discovered galaxy IDs (`profile.discoveredGalaxyIds`), quiz attempts (`profile.quizAttempts`), quiz high scores (`profile.quizHighScores`), stardust currency, and ship upgrade levels—automatically synced to browser `localStorage`.
  - *Ship Upgrade Synchronization*: React `PilotDashboardModal` updates Zustand `useGameStore` and emits `UPDATE_SHIP_STATS`. Phaser `PlayerShip` listens to `UPDATE_SHIP_STATS` and dynamically updates speed, shield capacity, weapon cooldown, and vacuum magnet pull radius in real-time.
  - *Progression Architecture Rule*: Ship Hardware Upgrades (Sprint 2.2 — Ion Engine, Deflector Shield, Plasma Cannon, Vacuum Dust Magnet purchased with Stardust) and Explorer Progression (Sprint 2.3 — Explorer XP, Levels, Rank Titles, Cosmetic Unlocks, Badges, Passive Perks) MUST remain strictly separate systems. Future AI development must never merge them into a single upgrade tree. Ship upgrades modify physical ship flight and combat performance, whereas Explorer Progression tracks player career identity, rank titles, cosmetic customizations, and lightweight passive bonuses.

### Strict Execution Rules:
1. **Never Bypass Controllers**: React UI components must emit intent to the EventBus or trigger controller methods rather than attempting to mutate Phaser internal state directly.
2. **Never Duplicate Logic**: Do not re-implement proximity detection, scoring, or state validation if an existing manager or controller already handles it.

---

## 5. Performance Standards

- **Framerate Target**: Maintain a rock-solid 60 FPS across WebGL and Canvas fallback rendering pipelines.
- **Resource Management**: Recycle particle emitters, pool game objects, and detach EventBus listeners on component unmount to eliminate memory leaks.
- **Procedural Rendering**: Prefer WebGL graphics shaders, procedural canvas particle tunnels, and SVG icons over heavy static raster image bundles where appropriate.
- **Lazy Loading**: Asynchronously load educational dossiers and quiz datasets on demand via dynamic pipelines.
- **Platform Compatibility**: Ensure seamless cross-platform execution on Web Browsers (Chrome, Firefox, Safari) and Electron Desktop containers.

---

## 6. UI / UX Standards

- **Visual Theme**: NASA Mission Control dark sci-fi glassmorphic aesthetic (`slate-950`, `amber-400`, `cyan-400`).
- **Typography & Hierarchy**: Pair clean display typography with high-contrast monospace indicators and serif headings for celestial nomenclature.
- **Top Alignment**: Aligned top HUD elements sharing consistent top and side margins (`ShipStatusHUD`).
- **Readability & Whitespace**: Maintain generous padding around containers and legible text contrast (WCAG AA compliant).
- **Educational Priority**: Educational cards and mission quizzes always take precedence over ambient flight overlay controls during discovery sequences.

---

## 7. Code Quality Standards

- **TypeScript Strict Mode**: Fully typed interfaces, zero `any` assertions, and explicit enum/type exports in `src/core/types.ts`.
- **Meaningful Naming**: Use clear, self-documenting function and variable names (`activeGalaxyRef`, `finishDiscovery`, `handleOverlayShown`).
- **Centralized Configuration**: Maintain global physics parameters, world bounds, and key constants in `src/core/config.ts`.
- **No Magic Numbers**: Move arbitrary numbers into central config or local descriptive constants.
- **Clean Logging**: Use `src/core/logger.ts` for structured application logging instead of raw `console.log` statements.

---

## 8. AI Collaboration Rules

When an AI coding agent or developer works on this codebase, they MUST strictly abide by the following operational directives:

1. **Read Documentation First**: Read `AI_DEVELOPMENT_GUIDE.md`, `PROJECT_STATE.md`, and relevant architecture docs before making changes.
2. **Respect Current Architecture**: Work within the established React-Phaser-EventBus architecture.
3. **Surgical Scope**: Implement only what is explicitly requested. Do not add unsolicited features, unrequested tabs, or background services.
4. **No Unnecessary File Creation**: Do not generate extraneous documentation or wrapper files unless asked.
5. **No Destructive Overwrites**: Never delete existing functionality or overwrite working components without explicit confirmation.
6. **Explain Architectural Choices**: Briefly state rationale for key technical decisions in commit or response summaries.
7. **Document Maintenance**: Update `PROJECT_STATE.md` and `DEVELOPMENT_ROADMAP.md` whenever milestones are completed.

---

## 9. Required Reading Order

Before writing code or making edits, AI assistants and developers MUST inspect documentation in this exact order:

1. `AI_DEVELOPMENT_GUIDE.md` (This constitution)
2. `PROJECT_STATE.md` (Current project status, folder structure, implemented features)
3. `DEVELOPMENT_ROADMAP.md` (Lean V1 roadmap and milestone status)
4. `ARCHITECTURE_OVERVIEW.md` (High-level architecture and EventBus flows)
5. `docs/ENGINEERING_STANDARDS.md` (Detailed coding standards)
6. Relevant system architecture doc in `docs/` (`DISCOVERY_SYSTEM_ARCHITECTURE.md`, `LEARNING_SYSTEM_ARCHITECTURE.md`, `QUIZ_SYSTEM_ARCHITECTURE.md`, etc.)
7. Latest sprint reports (`SPRINT_2_1_REPORT.md`, `STABILIZATION_SPRINT_1_REPORT.md`, `QUALITY_SPRINT_1_REPORT.md`)

---

## 10. Sprint Workflow

All sprint work follows this deterministic execution pipeline:

```
  1. Understand Current Project State
                 ↓
  2. Read Required Documentation
                 ↓
  3. Implement Minimal Requested Scope
                 ↓
  4. Run Type Linter (lint_applet)
                 ↓
  5. Compile Application (compile_applet)
                 ↓
  6. Verify Visual & Functional Output
                 ↓
  7. Update Documentation & Summarize Changes
```

---

## 11. Non-Goals

The following patterns and additions are STRICTLY PROHIBITED for Version 1.0:

- **No Over-Engineering**: Do not build complex backend microservices, SQL databases, or multi-tenant servers unless explicitly requested.
- **No Unplanned Combat Systems**: Do not transform the game into a space shooter or heavy combat simulator.
- **No UI Clutter**: Do not re-introduce developer debug text or crowded panel grids to the main gameplay canvas.
- **No Framework Swapping**: Do not attempt to replace Phaser 3, React 18, Vite, or Zustand with alternative frameworks.
- **No Mock Placeholders for Core Data**: Do not hardcode fake UI stubs when working with real dataset pipelines.

---

## 12. Long-Term Vision

The ultimate goal for Version 1.0 is to deliver a world-class, polished educational desktop application where students travel across a 2D deep-space cosmos, discover real galaxies, read authentic NASA/JWST astronomical research cards, test their understanding through adaptive scientific assessments, collect stardust rewards, and build a persistent Galactic Archive.

The application must look, feel, and perform like a commercial educational software product suitable for deployment in Astronomy Pathshala classrooms worldwide.

---

## 13. AI Implementation Checklist

Before finishing any task, the AI agent MUST verify:

- [ ] Read all required documentation files.
- [ ] Strictly followed architectural boundaries (React, Phaser, EventBus, Controllers).
- [ ] Implemented only the requested functional scope without feature creep.
- [ ] Preserved all existing working functionality.
- [ ] Maintained 60 FPS performance and clean memory management.
- [ ] Verified build succeeds using `compile_applet`.
- [ ] Verified strict typing passes using `lint_applet`.
- [ ] Synchronized documentation if project state or roadmap changed.
- [ ] Provided a concise, professional summary of modifications to the user.
