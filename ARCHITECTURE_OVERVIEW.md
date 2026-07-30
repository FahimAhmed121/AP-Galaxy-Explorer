# ARCHITECTURE_OVERVIEW.md — High-Level Codebase Map

## 1. Directory Responsibilities

- `/src/components/`: React HUD overlays, modals (Briefing, AURA Dialogue, Status, Radar, Warp Jump), and theme containers.
- `/src/core/`: Global TypeScript interfaces (`types.ts`), game physics constants (`config.ts`), and central pub/sub events (`events.ts`).
- `/src/data/`: Educational JSON datasets (`/educational/`), master galaxy catalogs (`galaxies.json`), and the dynamic loader (`contentPipeline.ts`).
- `/src/engine/`: Custom Web Audio sound synthesizer (`audioEngine.ts`) managing multi-channel sound FX and ambient crossfades.
- `/src/phaser/`: Core 2D game engine architecture containing entities, scene pipelines, system controllers, and entity managers.
- `/src/store/`: Zustand global reactive store (`useGameStore.ts`) managing pilot profile, options, stardust currency, and language settings.

---

## 2. Structural Layer Responsibilities

- **Managers (`/phaser/managers/`)**: Handle persistent game state, entity lifecycle tracking (`GalaxyManager`), stardust particle pooling (`ParticleManager`), and client storage sync (`SaveManager`).
- **Controllers (`/phaser/systems/`)**: Orchestrate complex state machines. `DiscoveryController` manages state transitions from spatial lock to AURA presentation and educational briefing modal triggers.
- **Systems (`/phaser/systems/`)**: Low-level per-frame engine processing. `InputSystem` translates WASD/touch to force vectors; `ScannerSystem` calculates range/energy consumption; `ScannerVisualSystem` renders spectrographic WebGL beams.

---

## 3. Communication & Data Pipelines

### EventBus Philosophy
The application decouples the Phaser 3 WebGL game loop from the React DOM overlay via a typed `EventEmitter` (`eventBus` in `core/events.ts`). Phaser systems emit state triggers (e.g., `DISCOVERY_STARTED`, `WARP_JUMP_TRIGGERED`), while React components listen reactively without direct coupling or DOM querying.

### Architectural Flows

```
[ Input System / Physics ] ────> [ Entity Update Loop ] ────> [ Proximity & Scanner System ]
                                                                        │
                                                                 EventBus Emit
                                                                        │
[ React HUD / Briefing Modal ] <──── [ Discovery Controller ] <─────────┘
            │
      Data Pipeline
            │
[ JSON Educational Pipeline ] ────> [ JWST / Hubble Card Render ]
```

1. **Gameplay Flow**: Player thrust vectoring → Position updates in `MainGameplayScene` → Proximity detection in `GalaxyManager` → Scanner activation.
2. **Data Flow**: `galaxies.json` supplies baseline spatial coordinates → `contentPipeline.ts` resolves deep educational JSON dossiers with graceful fallback safety.
3. **UI Flow**: React components mounted on top of `GameCanvas` react to `eventBus` triggers to render overlay cards, dialogs, status bars, and hyperspace canvas tunnels.
4. **Educational Flow**: Discovery trigger → AURA paginated dialogue (`PREV`/`NEXT`/`SKIP`) → NASA/JWST 2-column dossier modal → Player evaluation/acknowledgment.
5. **Rendering Flow**: Dual-layer architecture: Phaser 3 WebGL canvas renders 60 FPS background space flight; overlay React elements render interactive UI and particle tunnel canvas overlays.
