# SYSTEM_ARCHITECTURE.md — AP Galaxy Explorer

## 1. Executive Architecture Summary

**AP Galaxy Explorer V2** is built on a hybrid dual-engine architecture designed for maximum modularity, type safety, and visual performance:
- **Phaser 3.80+ (WebGL / HTML5 Canvas 2D Engine)**: Executes high-frequency (60 FPS) space flight physics, camera tracking, parallax starfields, procedural asteroid fields, plasma laser collisions, particle emissions, and spectrographic scanning visuals.
- **React 18 & Tailwind CSS (UI & Educational Layer)**: Controls non-gameplay overlay HUDs, paginated AURA AI dialogue overlays, 2-column NASA/JWST educational briefing dossiers, adaptive scientific quiz consoles, persistent archive logbooks, and pilot station hangar modals.
- **Zustand Reactive Store**: Acts as the single source of truth for pilot progression, inventory, discovered galaxy IDs, hardware upgrades, unlocked badges, equipped cosmetics, and user options.
- **Decoupled Pub/Sub EventBus**: Bridges high-frequency Phaser WebGL canvas signals with React DOM components cleanly without direct DOM manipulation or tight component coupling.

---

## 2. High-Level System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 REACT PRESENTATION LAYER                        │
│                                                                                 │
│   ┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐   │
│   │   ShipStatusHUD     │    │ PilotDashboardModal  │    │   ArchiveModal   │   │
│   └──────────┬──────────┘    └──────────┬───────────┘    └────────┬─────────┘   │
│              │                          │                         │             │
│   ┌──────────┴──────────┐    ┌──────────┴───────────┐    ┌────────┴─────────┐   │
│   │  LearningBriefing   │    │ QuizAssessmentModal  │    │ DiscoveryOverlay │   │
│   └──────────┬──────────┘    └──────────┬───────────┘    └────────┬─────────┘   │
└──────────────┼──────────────────────────┼─────────────────────────┼─────────────┘
               │                          │                         │
               ▼                          ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ZUSTAND REACTIVE STORE                             │
│                              (`useGameStore.ts`)                                │
│                                                                                 │
│   - `profile.discoveredGalaxyIds` (Single Source of Truth)                      │
│   - `profile.stardustReserves` & `profile.totalScore`                           │
│   - `profile.xp`, `profile.level`, `profile.rankTitle`                          │
│   - `profile.unlockedBadges` & `profile.unlockedCosmetics`                      │
│   - `profile.equippedShipSkin`, `profile.equippedThrusterFx`, etc.              │
│   - Hardware Upgrade Levels (Engine, Shield, Cannon, Magnet)                    │
└──────────────┬──────────────────────────┬─────────────────────────┬─────────────┘
               │                          │                         │
               ▼                          ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CENTRAL DECOUPLED EVENTBUS                            │
│                                (`core/events.ts`)                               │
│                                                                                 │
│   `SCAN_COMPLETED` ──> `DISCOVERY_READY` ──> `LEARNING_STARTED` ──> `QUIZ_STARTED` │
│   `RESUME_GAMEPLAY` <── `QUIZ_PASSED` <── `UPDATE_SHIP_STATS` <── `BADGE_UNLOCKED`  │
└──────────────┬──────────────────────────┬─────────────────────────┬─────────────┘
               │                          │                         │
               ▼                          ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               PHASER 3 ENGINE LAYER                             │
│                                                                                 │
│   ┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐   │
│   │   GalaxyManager     │    │   AsteroidManager    │    │   PlayerShip     │   │
│   └─────────────────────┘    └──────────────────────┘    └──────────────────┘   │
│   ┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐   │
│   │ DiscoveryController │    │    ScannerSystem     │    │  InputSystem     │   │
│   └─────────────────────┘    └──────────────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Architectural Breakdown

### 3.1. Explorer Career Progression Subsystem (`src/data/progressionData.ts`)

The career progression subsystem operates independently from physical ship hardware upgrades:
- **XP & Levels Engine**: Tracks cumulative Explorer XP earned across three core activities:
  - Galaxy Discovery: +100 Base XP
  - Quiz Completion: +50 Base XP on pass
  - Quiz Mastery: +25 Bonus XP on 100% score
  - Perk Multiplier: +25% XP bonus when `Curiosity Matrix` (`perk_xp_1`) is active.
- **Level Thresholds & Ranks**: Defines 15 cumulative levels (0 to 10,000 XP) mapping directly to rank titles from **Space Cadet** (Level 1) to **Master Voyager of the Cosmos** (Level 15).
- **Merit Badges Engine**: Evaluates 7 merit badges across `DISCOVERY`, `KNOWLEDGE`, `COLLECTION`, and `PILOTING` categories. Unlocks are automatically evaluated upon store state changes and saved to `profile.unlockedBadges`.
- **Cosmetics Subsystem**: Manages 12 customizable cosmetics across 3 categories:
  - **Ship Skins**: Custom color schemes (primary, secondary, accent, canopy, shield glow) applied dynamically to `PlayerShip` graphics.
  - **Thruster Effects**: Custom exhaust flame and particle trail colors applied to `PlayerShip` thruster emitters.
  - **Scanner Effects**: Custom spectrographic beam and reticle colors rendered by `ScannerVisualSystem`.
- **Passive Perks**: Grants lightweight passive bonuses upon reaching specific level milestones:
  - Level 3: *High-Frequency Sensor* (+20% scanner speed)
  - Level 5: *Attraction Field Boost* (+30% magnetic collection radius)
  - Level 7: *Overclocked Thrusters* (+15% max velocity)
  - Level 9: *Capacitor Overdrive* (+35% shield recharge rate)
  - Level 11: *Curiosity Matrix* (+25% bonus XP)

---

### 3.2. State Synchronization & Single Source of Truth

To eliminate state drift between the Phaser engine and React HUD overlays, the application utilizes Zustand (`useGameStore.ts`) as the single source of truth:
- **Discovery State**: `profile.discoveredGalaxyIds` strictly drives mapped status across `GalaxyManager`, `ShipStatusHUD`, `ArchiveModal`, `PilotDashboardModal`, and `RadarHUD`.
- **State Reset Pipeline**: Invoking `resetGame()` cleanly resets profile metrics, resets `GalaxyManager` entities back to unmapped states, clears discovered array, re-evaluates badges, resets level/XP, and notifies Phaser via `RESUME_GAMEPLAY`.
- **Modal Input & Return State Engine**: `App.tsx` maintains a robust `returnState` engine ensuring opening modals (Settings, Archive, Pilot Station) during active gameplay or menus always preserves and restores the correct previous state upon exit without freezing input handlers.

---

### 3.3. EventBus Architecture (`src/core/events.ts`)

Communication is structured around strongly-typed EventBus payloads:

| Event Name | Origin | Target | Description |
|---|---|---|---|
| `SCAN_COMPLETED` | `ScannerSystem` | `DiscoveryController` | Emitted when target spectrographic scan completes |
| `DISCOVERY_READY` | `DiscoveryController` | `LearningController` | Emitted when camera zoom & AURA dialogue completes |
| `LEARNING_STARTED` | `LearningController` | `LearningBriefingModal` | Opens NASA/JWST educational dossier modal |
| `LEARNING_COMPLETED` | `LearningBriefingModal` | `QuizController` | Emitted when player finishes inspecting briefing |
| `QUIZ_STARTED` | `QuizController` | `QuizAssessmentModal` | Opens adaptive scientific mission quiz modal |
| `QUIZ_PASSED` | `QuizAssessmentModal` | Zustand Store / EventBus | Grants score, stardust & XP rewards |
| `RESUME_GAMEPLAY` | Modal / Controller | Phaser / InputSystem | Restores camera lerp, player inputs & UI focus |
| `BADGE_UNLOCKED` | Progression Engine | React HUD / Audio | Triggers badge unlock alert and SFX |
| `UPDATE_SHIP_STATS` | Hangar Upgrades | `PlayerShip` | Updates physical speed, shield, cannon, and magnet stats |
| `PLAY_SOUND` | Game Logic | `AudioSystem` | Triggers procedural Web Audio SFX synthesis |

---

### 3.4. Canonical Gameplay Loop Pipeline

The finalized, canonical gameplay loop proceeds in strict sequence:

$$\text{Approach Galaxy} \longrightarrow \text{Press E} \longrightarrow \text{Active Scan} \longrightarrow \text{Discovery Reveal} \longrightarrow \text{Learning Briefing} \longrightarrow \text{Mission Quiz} \longrightarrow \text{Resume Exploration}$$

1. **Approach Galaxy**: Player navigates open space grid ($8000 \times 8000\text{ px}$) until proximity lock threshold ($< 400\text{ px}$) is achieved.
2. **Press E**: Player initiates spectrographic scanner via `E` key or touch button.
3. **Active Scan**: `ScannerSystem` consumes energy ($15\text{ pts/s}$) and renders reticle sweep until scan progress reaches 100%.
4. **Discovery Reveal**: `DiscoveryController` locks flight controls, lerps camera focus to galaxy center, and presents paginated AURA AI dialogue.
5. **Learning Briefing**: `LearningBriefingModal` presents authentic 2-column NASA/JWST educational cards, telescope imagery, and spectral data.
6. **Mission Quiz**: `QuizAssessmentModal` evaluates understanding via adaptive MCQ assessment, granting Stardust and Explorer XP rewards.
7. **Resume Exploration**: `RESUME_GAMEPLAY` unlocks controls, syncs persistent archive, checks badge unlocks, and restores open-space flight.

---

## 4. Stabilization & Reliability History (Sprint 2.3)

During Sprint 2.3, the core architecture underwent comprehensive stabilization:
1. **Discovery & Input Lock Resolution**: Fixed edge cases where rapidly closing dialogue overlays could leave flight controls locked in discovery mode.
2. **State Synchronization Fix**: Ensured `profile.discoveredGalaxyIds` immediately updates Phaser `GalaxyManager` sprites and top HUD counters without requiring a scene reload.
3. **Modal State Restoration**: Refined `returnState` logic in `App.tsx` and `SettingsModal.tsx` so exiting options or reset screens from either the Main Menu or Active Gameplay returns the player to the exact expected view.
4. **Perfect Scholar Badge Evaluation**: Corrected quiz evaluation formula in `progressionData.ts` to dynamically inspect target galaxy quiz length (`score >= maxScore`) rather than relying on a hardcoded threshold.
5. **Save Compatibility**: Ensured legacy saved states missing Sprint 2.3 progression properties (`xp`, `level`, `unlockedBadges`, `equippedCosmetics`) automatically default safely without data corruption.
