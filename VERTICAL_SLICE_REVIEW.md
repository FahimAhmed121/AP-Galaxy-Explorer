# AP Galaxy Explorer — Vertical Slice Architectural Review

## 1. Executive Summary

AP Galaxy Explorer is a web-based deep space exploration and astronomy education platform built with Phaser 3 (2D Canvas WebGL rendering) and React (NASA Mission Control HUD interface). 

The application implements a full-stack educational gameplay loop:
1. **Space Exploration & Navigation**: Physics-based spaceship controls across an expansive, infinite-feel 5000x5000 unit universe.
2. **Scanner & Discovery**: Proximity detection, directional radar lock, active radio-frequency scanning, and camera zooming.
3. **Cinematic Reveal**: Deep-space cinematic discovery sequence accompanied by dynamic lighting, camera tracking, and procedural audio synthesis.
4. **Interactive Scientific Briefing**: Multi-card NASA-grade educational briefing with real Hubble/JWST telescope imagery, spectrographic metrics, and bilingual support (EN/BN).
5. **Assessment & Certification**: Multiple-choice quiz validation and official downloadable PDF/Canvas certificate generation.

---

## 2. System Architecture & Event-Driven Engine

```
+-------------------------------------------------------------------------+
|                              React UI Shell                             |
|    (HUD, Modals, Discovery Overlay, Learning Briefings, Archives)       |
+-------------------------------------------------------------------------+
                                    ^
                                    | (EventBus Bus-Driven Sync)
                                    v
+-------------------------------------------------------------------------+
|                           Phaser 3 Game Canvas                          |
|  MainGameplayScene • WorldManager • GalaxyManager • ScannerSystem      |
+-------------------------------------------------------------------------+
                                    ^
                                    | (Native Web Audio API)
                                    v
+-------------------------------------------------------------------------+
|                            Audio Engine Synth                           |
|       Ambient Deep Space Drones • SFX • Mode Crossfading (Menu/Play)    |
+-------------------------------------------------------------------------+
```

### Core Event Bus API (`src/core/events.ts`)
Communication between the Phaser physics canvas and the React HUD overlay relies exclusively on a typed `EventBus`.

Key Events:
- `PHASER_READY`: Signals initialization complete.
- `SCAN_STARTED`, `SCAN_PROGRESS`, `SCAN_COMPLETED`, `SCAN_CANCELLED`: High-frequency scanner updates.
- `DISCOVERY_TRIGGERED`, `DISCOVERY_COMPLETED`: Triggers camera zoom and AURA dialogue.
- `LEARNING_STARTED`, `LEARNING_CARD_CHANGED`, `LEARNING_COMPLETED`: Syncs educational card modal state.
- `SHIP_HEALTH_CHANGED`, `SHIP_SHIELD_CHANGED`: Syncs ship status HUD indicators.

---

## 3. Educational Content Pipeline

Located in `src/data/educational/contentPipeline.ts`:
- Static JSON Briefings: High-fidelity pre-authored briefings (`milky-way.json`, `andromeda.json`, `sombrero.json`).
- Dynamic Fallback Briefing Engine: `generateEducationalBriefing()` constructs a complete 5-card NASA briefing dynamically from galaxy catalog metadata for any catalog galaxy.
- Zero Missing Data Guarantee: Fallback mechanism ensures players never encounter empty or undefined learning briefings.

---

## 4. Performance & Rendering Constraints

- **Frame Rate**: Locked 60 FPS using standard requestAnimationFrame and Phaser Arcade physics delta scaling.
- **Sector Streaming**: `UniverseManager` dynamically streams 1000x1000 unit sectors in a 3x3 active grid around the player, keeping offscreen objects unmounted.
- **Audio Synthesis**: Zero heavy external MP3/WAV assets; procedural audio synthesizes all ambient BGM drones and sound effects in real-time via the browser's Web Audio API (`AudioContext`).

---

## 5. Production Readiness Status

| Subsystem | Status | Verification |
| :--- | :--- | :--- |
| First-Time Player Experience | **COMPLETE** | 35-45s cinematic onboarding with skippable ESC key |
| Safe Sector Spawn | **COMPLETE** | Player spawns in Safe Sector Alpha (2500, 1700) with ~25s flight buffer |
| Scanner System | **COMPLETE** | 360° radar tracking, progress bar, audio pitch modulation |
| Cinematic Discovery | **COMPLETE** | Camera zoom, AURA dialogue, particle flares |
| Educational Briefing | **COMPLETE** | 5-card NASA briefing with spectrographic data & Bengali support |
| Adaptive Quiz Engine | **COMPLETE** | Mission Console UI, score tracking, stardust rewards, keyboard support |
| Galactic Archive & Codex | **COMPLETE** | Full-screen catalog, search, morphology filters, retake quiz flow |
| Single Source of Truth Sync | **COMPLETE** | Unified `profile.discoveredGalaxyIds` across Phaser, React & Zustand |
| Assessment & Certification | **COMPLETE** | Quiz engine, score tracking, official certificate output |
| Ambient Audio Engine | **COMPLETE** | Procedural space drones with MENU / GAMEPLAY / DISCOVERY modes |

---

*Report generated for AP Galaxy Explorer Vertical Slice after Sprint 2.1 & 2.1.1 Completion.*
