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

## 2. Development Workflow (Google AI Studio & Local Testing)

Development occurs iteratively in **Google AI Studio** with local execution and verification on a **Windows PC**:

```text
Google AI Studio (Gemini Engine)
        │
        │ Agent modifies codebase directly & performs static checks
        ▼
Download Updated Project ZIP
        │
        │ User exports ZIP from AI Studio
        ▼
Extract to Windows PC (e.g. D:\ap-galaxy-explorer-oauth-fix)
        │
        ▼
Configure Local .env
        │
        │ Add machine-local Firebase keys
        ▼
Run Production & Electron Builds
        │
        │ bun run build
        │ bun run build:electron
        ▼
Launch Desktop Application in Electron
        │
        │ node_modules\.bin\electron.exe .
        ▼
Verify Functionality & Report Results to AI Studio
```

**Golden Rule for AI Agents:** Do not instruct the user to manually edit source code files. Make all edits directly within the AI Studio workspace, verify compilation, and provide the updated codebase ready for export and download.

---

## 3. Security Model & Secrets Management

Every AI agent and developer MUST strictly adhere to the following security rules:

1. **Zero Desktop Secret Dependencies:**
   - With Google OAuth permanently retired in favor of direct Firebase Email & Password authentication, desktop builds require zero confidential client secrets.
   - Client-side configuration uses standard public Firebase project identifiers.
2. **Git & Environment Protection:**
   - Real credentials must never be committed to git.
   - `.env.example` serves as the public schema template with empty string values.
3. **Loopback Server Origin Hardening:**
   - Electron serves production bundle assets over a local loopback server (`127.0.0.1:<port>`) with strict path traversal validation to provide standard HTTP origin compatibility for Firebase Auth and Firestore.

---

## 4. Architecture Rules

The codebase is split into distinct architectural boundaries:

- **React Presentation Layer (`src/components/`)**: Handles UI overlays, HUD bars, interactive modals, Pilot Hangar upgrades, and accessibility controls. Strictly presentation and state display.
- **Phaser 3 Engine Layer (`src/phaser/`)**: Manages 2D WebGL canvas rendering, physics bodies, camera tracking, particle systems, asteroid fields, laser projectiles, and world entity rendering. All 2D gameplay execution occurs strictly inside Phaser 3.
- **Controllers (`src/phaser/systems/`)**: Orchestrate gameplay state machine transitions (`DiscoveryController`, `LearningController`, `QuizController`). Controllers are the sole authorities for state transitions.
- **Managers (`src/phaser/managers/`)**: Own and manage game entities and persistent objects (`GalaxyManager`, `AsteroidManager`, `DroneManager`, `SaveManager`, `ParticleManager`).
- **EventBus (`src/core/events.ts`)**: Serves as the single, decoupled Pub/Sub communication channel bridging Phaser 3 canvas events and React UI overlays without direct DOM coupling.
- **Data Pipelines (`src/data/`)**: Store educational datasets and quizzes in modular JSON registries with dynamic pipeline resolution (`contentPipeline.ts`, `quizPipeline.ts`).
- **Global State Store (`src/store/useGameStore.ts`)**: Serves as the single source of truth for user profile state, discovered galaxy IDs, quiz attempts, quiz high scores, stardust currency, and ship upgrade levels—automatically synced to `localStorage`.
- **External Services & Cloud Save Layer (`src/services/`)**:
  - *AuthService (`src/services/auth/AuthService.ts`)*: Manages Email & Password authentication (`signInWithEmail`, `signUpWithEmail`, `updateProfile`, `sendEmailVerification`, `sendPasswordResetEmail`, `signOut`) seamlessly across Web and Desktop platforms.
  - *CloudSaveService (`src/services/cloudSave/CloudSaveService.ts`)*: Firestore persistence strictly locked to `users/{uid}/profile/main`.
  - *CloudSaveSerializer (`src/services/cloudSave/CloudSaveSerializer.ts`)*: Handles bidirectional transformation, sanitization bounds, and schema validation.
  - *CloudSaveResolver (`src/services/cloudSave/CloudSaveResolver.ts`)*: Enforces deterministic conflict resolution (Additive Set Union, Monotonic Max, Stardust Net-Delta, Timestamp ordering).
  - *SyncManager (`src/services/cloudSave/SyncManager.ts`)*: Orchestrates 3-second debounced auto-sync, dirty state tracking, reentrancy guards, and generation-based session tracking (`activeSyncSessionId`).
- **Electron Desktop Architecture Layer (`electron/`)**:
  - *Main Process (`electron/main.ts`)*: Manages single-instance locking (`app.requestSingleInstanceLock()`), window lifecycle ($1280 \times 720$), Chromium sandboxing, and embedded loopback asset server (`127.0.0.1:<port>`).
  - *Preload Context Bridge (`electron/preload.ts`)*: Minimal context bridge exposing only `{ isDesktop: true, platform: process.platform }`.

---

## 5. Performance Standards

- **Framerate Target**: Maintain a rock-solid 60 FPS across WebGL and Canvas fallback rendering pipelines.
- **Resource Management**: Recycle particle emitters, pool game objects, and detach EventBus listeners on component unmount to eliminate memory leaks.
- **Procedural Rendering**: Prefer WebGL graphics shaders, procedural canvas particle tunnels, and SVG icons over heavy static raster image bundles where appropriate.
- **Lazy Loading**: Asynchronously load educational dossiers and quiz datasets on demand via dynamic pipelines.
- **Platform Compatibility**: Ensure seamless cross-platform execution on Web Browsers (Chrome, Firefox, Safari) and Electron Desktop containers.

---

## 6. Code Quality & AI Collaboration Rules

When an AI coding agent works on this codebase, they MUST strictly abide by the following operational directives:

1. **Read Documentation First**: Read `AI_DEVELOPMENT_GUIDE.md`, `PROJECT_STATE.md`, `DEVELOPMENT_ROADMAP.md`, and relevant architecture docs before making changes.
2. **Respect Current Architecture**: Work within the established React-Phaser-EventBus architecture.
3. **Surgical Scope**: Implement only what is explicitly requested. Do not add unsolicited features, unrequested tabs, or background services.
4. **No Destructive Overwrites**: Never delete existing functionality or overwrite working components without explicit confirmation.
5. **No Secret Leaks**: Never put secrets into client-side code, git tracking, or public templates.
6. **Maintain Documentation**: Keep all documentation files synchronized with actual code implementations.

---

## 7. Required Reading Order

Before writing code or making edits, AI assistants and developers MUST inspect documentation in this exact order:

1. `AI_DEVELOPMENT_GUIDE.md` (This guide)
2. `PROJECT_STATE.md` (Current project status, folder structure, implemented features)
3. `DEVELOPMENT_ROADMAP.md` (Lean V1 roadmap and milestone status)
4. `SYSTEM_ARCHITECTURE.md` & `ARCHITECTURE_OVERVIEW.md` (High-level architecture and EventBus flows)
5. `docs/AUTHENTICATION.md` (Firebase Authentication and Cloud Save specifications)
6. `docs/TESTING_GUIDE.md` (Testing and verification protocols)
7. `docs/ENGINEERING_STANDARDS.md` (Detailed coding standards)
8. Latest sprint reports (`SPRINT_2_6_5_REPORT.md`, `SPRINT_2_6_PHASE_3_REPORT.md`, `SPRINT_2_5_REPORT.md`, etc.)

---

## 8. AI Implementation Checklist

Before finishing any task, the AI agent MUST verify:

- [ ] Read all required documentation files.
- [ ] Strictly followed architectural boundaries (React, Phaser, EventBus, Services, Electron).
- [ ] Implemented only the requested functional scope without feature creep.
- [ ] Preserved all existing working functionality.
- [ ] Ensured client-side bundle and desktop builds contain zero private client secrets.
- [ ] Verified build succeeds using `compile_applet`.
- [ ] Verified strict typing passes using `lint_applet`.
- [ ] Synchronized documentation across the repository.
- [ ] Provided a concise, professional summary of modifications to the user.
