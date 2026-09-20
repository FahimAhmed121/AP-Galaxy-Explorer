# CODING_GUIDELINES.md — Engineering Standards & Guidelines

## 1. TypeScript Conventions

- **Strict Typing**: All files must use strict TypeScript modes. Avoid `any` types unless interfacing with external raw untyped payload structures, in which case type narrowing or explicit casting interface guards must be applied.
- **Top-Level Named Imports**: Always import modules explicitly at top level using named imports. Do NOT use object destructuring for type imports.
- **No `import type` for Enums**: Never use `import type` when importing enum values.
- **Standard Enums Only**: Use standard `enum` declarations (`enum GalaxyType { ... }`). Do NOT use `const enum`.
- **Shared Type Definitions**: Declare domain models, interfaces, payload contracts, and state interfaces inside `/src/core/types.ts` or `/src/types.ts`. Avoid local inline interface redefinitions across multiple components.

---

## 2. Folder Conventions

Maintain strict separation of concerns across directories:

- `/src/components/hud/`: Modular React overlay components for in-game HUD (meters, radar, modals, dialogues).
- `/src/components/common/`: Shared layout wrappers, buttons, and backdrop blur containers.
- `/src/core/`: Application-wide non-UI primitives (EventBus, typed constants, global types).
- `/src/data/`: Educational datasets, galaxy coordinate definitions, and dynamic pipeline handlers.
- `/src/engine/`: Web Audio procedural sound synthesizer and sound effect managers.
- `/src/phaser/entities/`: Phaser game objects (`PlayerShip`, `GalaxyObject`, `SpaceStation`).
- `/src/phaser/managers/`: Stateful logic managers (`GalaxyManager`, `AsteroidManager`, `SaveManager`, `ParticleManager`).
- `/src/phaser/systems/`: Low-level per-frame calculation systems (`InputSystem`, `ScannerSystem`, `DiscoveryController`).
- `/src/store/`: Global reactive Zustand state hooks (`useGameStore`).

---

## 3. Naming Conventions

- **Files & Directories**:
  - React components & Phaser Class files: `PascalCase.tsx` / `PascalCase.ts` (e.g., `DiscoveryOverlay.tsx`, `PlayerShip.ts`, `AsteroidManager.ts`).
  - Helper modules, pipelines & utilities: `camelCase.ts` (e.g., `contentPipeline.ts`, `audioEngine.ts`).
  - Educational JSON files: `kebab-case.json` (e.g., `milky-way.json`, `black-eye.json`).
- **Variables & Functions**:
  - Functions & Hooks: `camelCase` (e.g., `calculateDistance`, `useGameStore`).
  - Global Constants: `UPPER_SNAKE_CASE` (e.g., `WORLD_SIZE`, `MAX_SPEED`).
  - React Event Handlers: `handle[Event]` prefix (e.g., `handleContinueToBriefing`, `handleSkip`, `handleUpgrade`).

---

## 4. EventBus Rules

- **Decoupled Architecture**: Direct DOM manipulation from Phaser scenes or direct calling of Phaser methods inside React components is strictly prohibited. All communication MUST pass through `eventBus` (`src/core/events.ts`).
- **Typed Payload Interfaces**: Every event key in `EventPayloads` (e.g., `STARDUST_COLLECTED`, `UPDATE_SHIP_STATS`, `SHIP_STATS_CHANGED`, `PLAYER_DESTROYED`) must have a defined interface contract.
- **Listener Cleanup**: Every `eventBus.on(...)` subscriber MUST be paired with `eventBus.off(...)` or cleaned up inside React `useEffect` teardown functions to prevent memory leaks.

---

## 5. Performance Rules

- **Target Framerate**: Maintain sustained 60 FPS execution in Phaser WebGL rendering loops.
- **Object Pooling**: Particle emitters, starfield background elements, and transient visual objects must be pooled or recycled instead of instantiated repeatedly in `update()` loops.
- **Debounced / Guarded Event Updates**: Avoid emitting `EventBus` signals on every frame (`60/s`) unless tracking high-frequency position data for minimaps. Status updates should only fire on state changes.
- **Canvas Sizing**: Always rely on dynamic container sizing or `ResizeObserver`. Never hardcode static pixel dimensions (`window.innerWidth - 200`).

---

## 6. UI Consistency & Styling

- **Tailwind CSS Utility Classes**: Use Tailwind CSS utility classes directly. Do NOT write separate `.css` stylesheets or inline `style` objects except when calculating dynamic CSS transforms or absolute canvas coordinates.
- **Color Palette**: Dark sci-fi glassmorphic aesthetic with deep slate backgrounds (`bg-slate-950/90`), cyan border highlights (`border-cyan-500/30`), amber indicators (`text-gold` / `text-amber-400`), and emerald status accents.
- **Single-Line Button Labels**: Text inside buttons, tabs, chips, and pills MUST sit on one line (`whitespace-nowrap`).
- **Nested Border Radius Rule**: `Inner Radius = Outer Radius - Padding`. Maintain crisp geometric hierarchy without overlapping radii.

---

## 7. Animation Rules

- **Fluid UI Transitions**: Use standard CSS transition utilities (`transition-all duration-200`) or `motion` layout animations.
- **Camera Lerp**: Phaser camera tracking must use smooth linear interpolation (`lerp: 0.08`) to prevent abrupt visual snaps.
- **Cinematic Pacing**: Dialogue and informational reveals must never auto-dismiss without explicit user action or clear controls.

---

## 8. Accessibility

- **Readable Contrast**: Text elements must pass WCAG AA contrast standards (minimum 4.5:1 ratio). Avoid gray text on saturated dark background elements.
- **Keyboard Navigation**: Critical overlays must support primary keyboard shortcuts (`ESC` to close/skip, `E` to interact, `Space` to engage).
- **Control Sizing**: Interactive touch and click targets must meet a minimum size of 44x44px for accessibility across mobile and desktop interfaces.

---

## 9. Documentation Requirements

- **JSDoc Annotation**: Annotate core architectural systems, complex algorithms, and event payload definitions with clear JSDoc descriptions.
- **Self-Documenting Code**: Prefer descriptive function and variable names over excessive inline commentary.
- **Handoff Records**: Keep `PROJECT_STATE.md`, `DEVELOPMENT_ROADMAP.md`, `QUALITY_SPRINT_1_REPORT.md`, and `SPRINT_2_1_REPORT.md` updated after major quality sprints or milestone deliveries.

---

## 10. JSON-Driven Content & Fallbacks

- **Data Driven**: All educational content, galaxy metrics, and quiz questions must be declared in modular JSON files inside `/src/data/`.
- **Pipeline Guarding**: Never allow a missing JSON entry or broken network route to crash the app. The `contentPipeline.ts` loader must intercept missing datasets and generate fallbacks gracefully.

---

## 11. Lazy Loading & Asset Management

- **Dynamic Imports**: Educational datasets and non-critical UI modals should be dynamically loaded on demand using ES module dynamic imports.
- **Web Audio Lazy Loading**: Synthesizer audio contexts and audio buffers must initialize lazily upon first user interaction to comply with browser autoplay policies.
