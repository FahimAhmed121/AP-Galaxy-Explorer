# Discovery System & Cinematic Reveal Architecture

This document specifies the architectural design, state machine, event lifecycles, AURA holographic assistant integration, and future educational roadmap for the **Discovery Experience & Cinematic Reveal System** implemented in Sprint 1.8.

---

## 1. Executive Summary & Philosophy

The Discovery Experience transforms successful scanner completion into an emotional, memorable scientific milestone. Designed to evoke NASA mission control operational standards:
- **Cinematic Transition**: Smoothly locks ship velocity, centers camera focus on the discovered galaxy, and smoothly zooms in.
- **AURA Assistance**: Introduces AURA (Astronomical Universal Research Assistant), providing calm, professional, template-driven scientific analysis.
- **Clean NASA Overlay**: Minimal overlay displaying essential astronomical metadata (Galaxy Name, Type, Constellation, Distance from Earth) without cognitive overload.
- **Decoupled Event Architecture**: The `DiscoveryController` orchestrates timing and emits events while React UI and Web Audio handle presentation layers independently.

---

## 2. Architecture & System Flow Diagram

```
┌─────────────────┐           SCAN_COMPLETED           ┌────────────────────────────┐
│ ScannerSystem   ├───────────────────────────────────►│ DiscoveryController        │
└─────────────────┘                                    │ (State Machine System)     │
                                                       └─────────────┬──────────────┘
                                                                     │
                                             Emits Events & Controls │
                                             Camera / Ship Controls  │
                                                                     ▼
                        ┌────────────────────────────────────────────┴────────────────────────────────────────────┐
                        │                                            │                                            │
                        ▼                                            ▼                                            ▼
           ┌─────────────────────────┐                  ┌─────────────────────────┐                  ┌─────────────────────────┐
           │ PlayerShip & Camera     │                  │ EventBus & Audio        │                  │ React DiscoveryOverlay  │
           │ (Dampen & Zoom Lerp)    │                  │ (Harmonic Swells & SFX) │                  │ (AURA & Spec Metadata)  │
           └─────────────────────────┘                  └─────────────────────────┘                  └─────────────────────────┘
```

---

## 3. State Machine Specification (`DiscoveryState`)

The `DiscoveryController` manages a 5-stage state machine:

```
                          SCAN_COMPLETED
                                │
                                ▼
                           ┌──────────┐
                           │   IDLE   │
                           └────┬─────┘
                                │
                                ▼
                        ┌──────────────┐
                        │ DISCOVERING  │  (0.0s - 2.0s: Ship slowed, camera zooms, galaxy highlighted)
                        └───────┬──────┘
                                │
                                ▼
                     ┌──────────────────┐
                     │ AURA_PRESENTING  │  (2.0s - 4.5s: Hologram appears with dialogue)
                     └──────────┬───────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ READY_FOR_LEARNING   │  (4.5s+: Holds pause, emits DISCOVERY_READY)
                    └───────────┬──────────┘
                                │
                                ▼
                           ┌──────────┐
                           │ FINISHED │  (Camera zooms back, ship controls unlocked -> IDLE)
                           └──────────┘
```

### State Behavior Breakdown:
1. **IDLE**:
   - Listens on `eventBus` for `SCAN_COMPLETED`.
   - On event receipt, locks current target galaxy and transitions to `DISCOVERING`.
2. **DISCOVERING** (~2.0s duration):
   - Sets `playerShip.isControlsLocked = true` to dampen movement smoothly.
   - Pans and zooms camera toward galaxy center (zoom level lerps from 1.0 to 1.65).
   - Emits `DISCOVERY_STARTED`.
3. **AURA_PRESENTING** (~2.5s duration):
   - Generates AURA scientific dialogue from galaxy metadata template.
   - Emits `DISCOVERY_OVERLAY_SHOWN` (`{ galaxyData, auraText }`).
   - Plays holographic chime audio feedback.
4. **READY_FOR_LEARNING** (~2.0s duration):
   - Emits `DISCOVERY_READY` (`{ galaxyData }`).
   - Holds presentation screen so players can absorb metadata.
5. **FINISHED**:
   - Resets camera zoom to 1.0 onto player ship.
   - Restores ship movement controls (`playerShip.isControlsLocked = false`).
   - Emits `DISCOVERY_FINISHED`.
   - Resets state to `IDLE`.

---

## 4. Key Event Payload Specifications

All discovery events use strict TypeScript payloads defined in `/src/core/events.ts`:

| Event Name | Trigger Condition | Payload Definition |
| :--- | :--- | :--- |
| `DISCOVERY_STARTED` | Scan completion transitions controller | `{ galaxyId: string, galaxyName: string, galaxyData: Galaxy }` |
| `DISCOVERY_OVERLAY_SHOWN` | AURA presentation state reached | `{ galaxyData: Galaxy, auraText: string }` |
| `DISCOVERY_READY` | Discovery sequence ready for educational layer | `{ galaxyData: Galaxy }` |
| `DISCOVERY_FINISHED` | Cinematic sequence completes or skipped | `{ galaxyId: string }` |

---

## 5. AURA Holographic Assistant & Template Engine

AURA (Astronomical Universal Research Assistant) provides calm, scientific, supportive commentary using localized dialogue templates:

```typescript
private generateAuraDialogue(galaxy: Galaxy): string {
  const templates = [
    `Discovery confirmed. Target identified as ${galaxy.name}. Spectral classification: ${galaxy.type}. Coordinates saved to NASA Knowledge Archive.`,
    `Signal verified. Galaxy ${galaxy.name} located at distance of ${galaxy.distance}. Astronomical profile compiled.`,
    `Astrophysical scan complete. ${galaxy.name} (${galaxy.type}) in constellation ${galaxy.constellation}. Deep space records updated.`,
  ];
  return templates[Math.abs(galaxy.name.length) % templates.length];
}
```

---

## 6. Accessibility & Skip Mechanics

- **Esc Key Skip**: Players can press `Esc` at any time during `DISCOVERING`, `AURA_PRESENTING`, or `READY_FOR_LEARNING` to immediately complete the sequence.
- **Controls Safety**: Ship velocity is safely dampened rather than instantly frozen, preventing physics glitching or collision errors.

---

## 7. Educational & Progression Integration Status

1. **Sprint 1.9 — Interactive Learning Cards**: ✅ **COMPLETED**
   - `DISCOVERY_READY` triggers transition into full interactive 2-column NASA/JWST galaxy specification cards (`LearningBriefingModal`) featuring HD imagery, dimensions, age, and fun facts.
2. **Sprint 2.0 — Astrophysics Quiz Engine**: ✅ **COMPLETED**
   - Following card briefing, `QuizController` opens interactive MCQ quizzes (`QuizAssessmentModal`) to test knowledge, evaluate accuracy, and reward Stardust.
3. **Sprint 2.1 — Persistent Galactic Archive & Codex**: ✅ **COMPLETED**
   - `DISCOVERY_FINISHED` permanently registers the galaxy in `profile.discoveredGalaxyIds` in Zustand store `useGameStore`. Discovered galaxies populate `ArchiveModal.tsx` for searching, morphology filtering, inspection, and direct quiz retakes.
