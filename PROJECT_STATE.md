# PROJECT_STATE.md — AP Galaxy Explorer

## 1. Project Overview

- **Purpose**: Astronomy Pathshala (AP) Galaxy Explorer is an interactive, space-themed educational simulation that combines 2D space flight, real-time spectrographic galaxy scanning, cinematic discovery reveals, and interactive NASA/JWST/Hubble educational dossiers.
- **Target Audience**: Students, astronomy enthusiasts, self-learners, and science educators seeking an engaging visual platform to explore deep-space astrophysics.
- **Gameplay Loop**: Safe Sector Spawn → Open-Space Navigation & Inertial Thruster Control → Galaxy Proximity Lock → Active Spectrographic Scanning → Cinematic Reveal & AURA AI Dialogue → Interactive Educational Dossier → Star dust Collection & Return to Exploration.
- **Educational Goal**: Deliver authentic astrophysical insights—including galactic classification, spectral signatures, distance metrics, tidal collisions, black hole absence/presence, and Hubble/JWST discoveries—through interactive gameplay and curated educational modules.

---

## 2. Technology Stack

- **React 18 & Vite**: Modular HUD overlays, responsive modals, state management, and localized UI components.
- **Phaser 3.80+**: 2D WebGL/Canvas rendering engine managing physics bodies, camera tracking, particle systems, procedural starfields, and space objects.
- **TypeScript (Strict Mode)**: Type safety across game engines, event buses, telemetry interfaces, and educational schemas.
- **EventBus Architecture**: Decoupled Pub/Sub event pipeline (`EventEmitter`) bridging Phaser 3 canvas updates with React UI state without direct DOM coupling.
- **Web Audio API Engine**: Custom procedural synthesizer and audio engine handling multi-channel sound FX, thruster rumbles, scanner sweeps, warp jump hums, and ambient music crossfades.
- **Electron Preparation**: Clean modular separation enabling standalone desktop compilation with native IPC bindings.

---

## 3. Current Folder Structure

```
/
├── public/                     # Static public assets (sounds, icons)
├── src/
│   ├── components/             # React UI components
│   │   ├── common/             # Reusable UI containers & buttons
│   │   └── hud/                # Gameplay HUD overlays (Status, Radar, Briefing, AURA, Warp)
│   ├── core/                   # Shared types, event bus, and global configuration
│   │   ├── config.ts           # Game configuration constants & physics settings
│   │   ├── events.ts           # EventBus typed interfaces & event names
│   │   └── types.ts            # Core TypeScript models (Ship, Galaxy, Profile)
│   ├── data/                   # Data registries & educational content
│   │   ├── educational/        # Handcrafted galaxy JSON dossiers & content pipeline
│   │   └── galaxies.json       # Master galaxy catalog & coordinates
│   ├── engine/                 # Custom sound engine & audio management
│   ├── phaser/                 # Phaser game engine architecture
│   │   ├── entities/           # PlayerShip, GalaxyObject, SpaceStation entities
│   │   ├── managers/           # GalaxyManager, SaveManager, ParticleManager
│   │   ├── scenes/             # MainGameplayScene & LoadingScene
│   │   └── systems/            # ScannerSystem, DiscoveryController, AudioSystem
│   ├── store/                  # Zustand global state (game options, user profile, language)
│   └── App.tsx / main.tsx      # Main application entry point & canvas integration
└── QUALITY_SPRINT_1_REPORT.md  # Quality Sprint execution and verification report
```

---

## 4. Core Architecture

- **Managers**:
  - `GalaxyManager`: Handles spatial indexing, proximity detection, galaxy entity instantiation, and discovery status tracking.
  - `SaveManager`: Manages persistent local storage state (stardust, mapped galaxies, custom options).
- **Controllers**:
  - `DiscoveryController`: Manages state machine flow for galaxy discoveries (`IDLE` → `SCANNING` → `CINEMATIC_ZOOM` → `AURA_PRESENTING` → `BRIEFING`).
- **Systems**:
  - `ScannerSystem`: Computes player-to-target distance, energy consumption during scanning, and triggers scan events.
  - `InputSystem`: Processes keyboard (WASD/Arrows/Space/Shift/E) and virtual touch controls, calculating thrust vectors.
  - `ScannerVisualSystem`: Renders dynamic scanning reticles and spectrographic beams in WebGL.
- **Components**:
  - `ShipStatusHUD`: Displays real-time Hull Integrity, Deflector Shield, Plasma Energy, and Stardust.
  - `RadarHUD`: Displays 2D minimap with player position/heading, space stations, and discovered/unmapped galaxy indicators.
  - `DiscoveryOverlay`: Provides player-controlled AURA dialogue progression (`PREV`, `NEXT`, `SKIP`, `CONTINUE`).
  - `LearningBriefingModal`: Renders 2-column NASA/JWST educational dossiers with telescope visual showcases.
  - `WarpJumpOverlay`: Renders multi-phase HTML5 canvas hyperdrive particle tunnels.
- **Data Pipeline**:
  - `contentPipeline.ts` dynamically imports educational JSON files with automatic fallback content for unmapped deep-space objects.
- **EventBus**:
  - `eventBus` (`EventEmitter`) provides bidirectional communication between Phaser systems and React HUD components.
- **Rendering**:
  - Phaser WebGL pipeline handles smooth camera follow (`lerp 0.08`), parallax background starfields, thruster particle emissions, and glow filters.
- **Audio**:
  - `audioEngine.ts` triggers procedural synthesis and layered audio streams based on game state changes.
- **Persistence**:
  - LocalStorage sync maintains pilot logbooks, stardust counts, mapped IDs, and language preferences.

---

## 5. Current Gameplay Loop

```
  Player Launch (Safe Sector Alpha)
                 ↓
  Exploration (Inertial Space Movement & Booster)
                 ↓
  Galaxy Proximity Lock (Target Detected)
                 ↓
  Scanner Activation (E Key / Energy Consumption)
                 ↓
  Discovery Cinematic Reveal (Camera Zoom & Focus)
                 ↓
  AURA AI Dialogue (Paced Narrative & Telemetry)
                 ↓
  Learning Briefing Dossier (NASA / JWST Telescope Cards)
                 ↓
  Return to Exploration (Stardust Reward & Mapped Status)
```

---

## 6. Implemented Features

- **Spacecraft Physics**: Refined heavy inertial drift, smooth turn rates (`3.2 rad/s`), tuned acceleration (`220 px/s²`), and top speed bounds (`320 px/s` base, `520 px/s` boost).
- **Plasma Energy System**: Dynamic 100-point energy pool powering hyperspace boosters and spectrographic scanners with automatic passive regeneration (`14/s`).
- **Player-Controlled AURA Dialogue**: Paginated dialogue flow with explicit `PREV`, `NEXT`, `SKIP CINEMATIC`, and `CONTINUE TO BRIEFING` controls.
- **NASA / JWST / Hubble Educational Cards**: Structured 2-column learning dossiers featuring high-resolution telescope visual placeholders, spectral charts, and key astrophysical metrics.
- **Interactive Minimap / Radar HUD**: 2D radar displaying player heading angle, nearby targets, discovery markers, space station hub, and collapsible toggle mode.
- **Multi-Phase Warp Animation**: Hyperspace warp jump sequence featuring engine charge, star stretching, radial bloom, particle tunnel rendering, and exit flashes.
- **Handcrafted Educational Datasets**: Complete astrophysical datasets for 10 major galaxies.
- **Bilingual Interface**: Seamless runtime toggle between English and Bengali (বাংলা) across all HUD elements.

---

## 7. Educational Pipeline

Educational content is loaded dynamically via `contentPipeline.ts`:

1. **JSON Dataset Registry**: Handcrafted JSON files located in `src/data/educational/` are mapped by `galaxyId`.
2. **Dynamic Resolution**: When a galaxy is scanned, `getEducationalContent(galaxyId)` retrieves the primary JSON.
3. **Fallback Generation**: If a custom JSON file is missing or corrupted, `contentPipeline.ts` automatically generates a valid `EducationalContent` structure from core `galaxies.json` attributes to prevent UI crashes.

---

## 8. Galaxy Database

The following 10 handcrafted galaxies are fully integrated with coordinate data, spectral metrics, and educational cards:

1. **Milky Way Galaxy (`milky-way`)**: Barred spiral, 100,000 light-years diameter, home galaxy.
2. **Andromeda Galaxy (`andromeda`)**: M31, largest Local Group member, 2.5 million light-years distance.
3. **Sombrero Galaxy (`sombrero`)**: M104, prominent halo and dust lane in Virgo constellation.
4. **Whirlpool Galaxy (`whirlpool`)**: M51, grand design spiral interacting with companion NGC 5195.
5. **Triangulum Galaxy (`triangulum`)**: M33, third largest Local Group spiral, lacks central SMBH.
6. **Black Eye Galaxy (`black-eye`)**: M64, counter-rotating gas disks and dark absorbing dust lane.
7. **Pinwheel Galaxy (`pinwheel`)**: M101, face-on giant spiral spanning 170,000 light-years.
8. **Cartwheel Galaxy (`cartwheel`)**: ESO 350-40, ring galaxy created by direct galactic collision.
9. **Large Magellanic Cloud (`large-magellanic-cloud`)**: LMC, Milky Way satellite housing Tarantula Nebula.
10. **Small Magellanic Cloud (`small-magellanic-cloud`)**: SMC, dwarf irregular galaxy with low metallicity.

---

## 9. Controls

- **W / Up Arrow**: Engage Main Forward Thrusters
- **A / Left Arrow**: Rotate Ship Left
- **D / Right Arrow**: Rotate Ship Right
- **S / Down Arrow**: Reverse Dampeners / Slow Down
- **Shift (Hold)**: Engage Plasma Booster
- **E**: Initiate Spectrographic Scanner / Open Briefing
- **Space**: Quick Action / Warp Engage
- **F3**: Toggle Developer Diagnostic Telemetry
- **ESC**: Skip Active Cinematic / Close Modals

---

## 10. Audio

- **Synthesizer Engine**: Procedural Web Audio oscillator generating custom thruster rumbles and scanner sweeps.
- **Multi-Channel Mixing**: Independent gain nodes for BGM (`ambientVolume`) and SFX (`sfxVolume`).
- **Seamless Crossfading**: Dynamic volume attenuation during warp sequences, dialogue triggers, and modal overlays.

---

## 11. UI

- **Design Aesthetic**: Clean, high-contrast dark sci-fi glassmorphism utilizing dark slate/cyan themes (`#0284c7`, `#0f172a`, `#f59e0b`).
- **Responsive HUD Layout**: Desktop-first layout with fluid mobile scaling, non-overlapping action bars, and clear status indicators.
- **Typography**: Inter and Mono font pairing with strict single-line label enforcement.

---

## 12. Performance

- **Target Framerate**: Sustained 60 FPS across WebGL and Canvas fallback engines.
- **Memory Management**: Automatic sprite pooling, particle emitter recycling, and EventBus listener cleanup on unmount.
- **Build Optimization**: Vite bundler output clean modular chunks with fast initial load.

---

## 13. Current Limitations

- **Single-System Canvas**: Exploration canvas operates within a 2D boundary grid (`8000x8000 px`).
- **Mock Image Assets**: Educational card showcases currently utilize stylized WebGL/SVG deep-space reticles in lieu of live external NASA API image streaming.
- **Offline Local Storage**: User progress is saved to browser `localStorage` without multi-device cloud sync.

---

## 14. Next Milestone

- **Quality Sprint 1.0**: ✅ **COMPLETE**
- **Next Milestone**: **Sprint 2.0 — Adaptive Quiz & Skill Evaluation System** (Interactive astrophysical quizzes, knowledge badges, and pilot progression levelling).
