# Scanner System & Discovery Framework Architecture

This document details the architectural design, event lifecycles, state machine specifications, and integration roadmap for the **Scanner System & Discovery Framework** implemented in Sprint 1.7.

---

## 1. Executive Summary & Core Philosophy

The Scanner System defines the core scientific exploration mechanic of AP Galaxy Explorer. 

Key design principles:
- **Action-Driven Discovery**: Player ships never automatically discover galaxies simply by flying near them. Discovery requires explicit, intentional player action (pressing `E`).
- **Cinematic & NASA-Inspired Feedback**: Scanning features clean, high-precision visual reticles, laser target alignment beams, subtle ship vibration/jitter, and procedural audio feedback.
- **Decoupled Architecture**: Logic (`ScannerSystem`), visuals (`ScannerVisualSystem`), audio (`AudioSystem`), state storage (`GalaxyManager`), and user interface (`EventBus`) are completely decoupled for modular maintainability and future extensibility.

---

## 2. System Architecture Overview

```
                        ┌────────────────────────┐
                        │   InputSystem (Key E)  │
                        └───────────┬────────────┘
                                    │ (poll input)
                                    ▼
 ┌──────────────────┐   update   ┌────────────────────────┐   events   ┌──────────────────┐
 │ PlayerShip       ├───────────►│ ScannerSystem          ├───────────►│ EventBus         │
 └──────────────────┘            │ (Pure Logic System)    │            └────────┬─────────┘
                                 └───────────┬────────────┘                     │
                                             │                                  │
                       queries & updates     │                                  │ listens
                                             ▼                                  ▼
                        ┌────────────────────────┐            ┌──────────────────┐
                        │ GalaxyManager          │            │ AudioSystem      │
                        │ (In-memory discovery)  │            └──────────────────┘
                        └───────────┬────────────┘
                                    │
                         updates    ▼
                        ┌────────────────────────┐
                        │ GalaxyEntity Visuals   │
                        │ & ScannerVisualSystem  │
                        └────────────────────────┘
```

---

## 3. State Machine Specification

The `ScannerSystem` operates on a strict 3-state state machine (`ScannerState`):

```
       [No target or range check]
                 │
                 ▼
              ┌──────┐         Press 'E' inside scan radius
              │ IDLE ├─────────────────────────────────────────┐
              └──▲───┘                                         │
                 │                                             ▼
       Cooldown completes                             ┌─────────────────┐
       (cooldownRemaining <= 0)                        │    SCANNING     │
                 │                                    │ (~5s duration)  │
                 │                                    └────────┬────────┘
                 │                                             │
                 │  Scan Completed (progress >= 1.0)           │
                 │  OR Scan Cancelled (Out of range / Manual)  │
                 │                                             │
                 └─────────────────┌──────────┐◄───────────────┘
                                   │ COOLDOWN │
                                   │  (1.5s)  │
                                   └──────────┘
```

### State Breakdown:
1. **IDLE**:
   - Continuously evaluates nearest undiscovered galaxy within `SCANNER_CONFIG.scanRadius`.
   - Renders target brackets / alignment laser when in range.
   - Waits for player to press `E`.
2. **SCANNING**:
   - Initiated upon key `E` press when near a valid undiscovered galaxy.
   - Sets target state to `SCANNING` and advances `elapsedTime`.
   - Emits `SCAN_PROGRESS` events every frame.
   - Evaluates range continuously. If player exceeds max discovery radius, cancels scan (`OUT_OF_RANGE`).
   - Listens for manual cancellation if `E` is pressed again (`USER_CANCELLED`).
   - Applies subtle ship vibration feedback.
3. **COOLDOWN**:
   - Locks scanner for `SCANNER_CONFIG.cooldownDuration` (1.5 seconds) to prevent rapid scan spam.
   - Automatically resets to `IDLE` once timer expires.

---

## 4. Configuration Parameters (`SCANNER_CONFIG`)

All scanner values are centralized in `/src/core/config.ts`:

```typescript
export const SCANNER_CONFIG = {
  scanDuration: 5.0,           // Scan duration in seconds (5 seconds)
  scanRadius: 350,             // Distance threshold from galaxy center to allow scanning
  cooldownDuration: 1.5,       // Cooldown in seconds after scan completes or cancels
  pulseSpeed: 2.5,             // Visual rotation and pulse frequency
  ringSizeMultiplier: 1.25,    // Visual target ring scale relative to galaxy radius
  shipVibrationIntensity: 1.5, // Subtle ship jitter intensity during scan
};
```

---

## 5. Event Flow & Typed Event Payloads

The Scanner System communicates with React UI and Phaser sub-systems via `eventBus`:

| Event Name | Trigger Condition | Payload Definition |
| :--- | :--- | :--- |
| `SCAN_STARTED` | Player presses `E` near valid galaxy target | `{ targetId: string, targetName: string, duration: number }` |
| `SCAN_PROGRESS` | Frame update during active scanning | `{ targetId: string, progress: number, elapsed: number, total: number }` |
| `SCAN_CANCELLED` | Target out of range or manually aborted | `{ targetId: string, reason: 'OUT_OF_RANGE' \| 'USER_CANCELLED' \| 'NO_TARGET' }` |
| `SCAN_COMPLETED` | Scan progress reaches 100% | `{ targetId: string, galaxyData: Galaxy }` |
| `GALAXY_DISCOVERED` | Immediately follows scan completion | `{ galaxyId: string, galaxyName: string }` |

---

## 6. Procedural Audio Feedback

Sound effects are synthesized natively via Web Audio API (`audioEngine.ts`):
- `scan-start`: Resonant rising sweep frequency tone.
- `scan-pulse`: Periodic mid-frequency tone pulse every 650ms during scan progress.
- `scan-complete`: C5-E5-G5-C6 harmonic victory chime upon scientific discovery.
- `scan-cancel`: Low descending sawtooth error tone.

---

## 7. System Integrations Status

The Scanner System was intentionally architected as a modular framework and is fully integrated across all major subsystems:

1. **AURA AI Companion Guidance**: ✅ **COMPLETED** (Sprint 1.8)
   - `SCAN_STARTED` → Triggers AURA dialogue: *"Analyzing spectrographic signatures of [Galaxy Name]..."*
   - `SCAN_CANCELLED` → AURA warning: *"Signal lost. Re-establish proximity threshold."*
   - `SCAN_COMPLETED` → AURA discovery announcement: *"Spectral analysis complete! Data uploaded to Knowledge Archive."*

2. **Discovery Cinematic Hook**: ✅ **COMPLETED** (Sprint 1.8)
   - `SCAN_COMPLETED` triggers camera smooth zoomlerp towards galaxy core with particle impulse burst before presenting discovery HUD.

3. **Learning Cards & Educational Content**: ✅ **COMPLETED** (Sprint 1.9)
   - React UI listens for `SCAN_COMPLETED` to open interactive 2-column NASA/JWST Galaxy Overview cards featuring real imagery, astronomical dimensions, and age metrics.

4. **Quiz System**: ✅ **COMPLETED** (Sprint 2.0)
   - Scanning unlocks galaxy-specific interactive astrophysics quizzes in the React HUD (`QuizAssessmentModal`).

5. **Discovery Log & Explorer Profile**: ✅ **COMPLETED** (Sprint 2.1 & 2.1.1)
   - Marks discovered galaxy IDs in `profile.discoveredGalaxyIds` in `useGameStore`, populating the Galactic Archive (`ArchiveModal`) and Pilot Station (`PilotDashboardModal`).
