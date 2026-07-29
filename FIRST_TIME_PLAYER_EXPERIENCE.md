# AP Galaxy Explorer — First-Time Player Experience & Onboarding Specification

## 1. Onboarding Philosophy & Narrative Goals

The First-Time Player Experience (FTPE) introduces players to AP Galaxy Explorer not as a generic video game, but as an authentic scientific space expedition conducted by Astronomy Pathshala.

Every transition is deliberate, immersive, and designed with NASA Mission Control aesthetics:
- High-contrast typography on dark glassmorphism backdrops.
- Atmospheric ambient audio drones.
- Clear player identity: A newly certified Master Explorer candidate.

---

## 2. Cinematic Opening Timeline (35–45 Seconds)

```
[0.0s - 4.5s]  Astronomy Pathshala Logo & Title Entrance
               • Gold spiral galaxy emblem rotates
               • "ASTRONOMY PATHSHALA PRESENTS: AP GALAXY EXPLORER"

[4.5s - 8.5s]  Earth & Deep Space Reveal
               • Canvas renders distant photorealistic Earth with blue atmospheric aura
               • Background starfield fades in with subtle twinkle animation

[8.5s - 18.0s] Mission Briefing & Narration (Typewriter / Fade Progression)
               1. "Earth has lost contact with thousands of deep space galaxies."
               2. "Astronomy Pathshala has launched the AP Explorer Program."
               3. "You are the newest certified Explorer."
               4. "Your mission: Scan galaxies, review scientific briefings, upload data."

[18.0s - 25.0s] AP Explorer Orbital Station Pan
               • Camera pans across rotating station spokes, solar panels, and docking beacons
               • Service drones hover around station outer ring
               • Hangar Bay 01 highlights the player's exploration vessel

[25.0s - 32.0s] AURA Welcome & Mission Confirmation
               • AURA AI Voice Assistant introduces the vessel state
               • Player clicks "ENGAGE LAUNCH PROTOCOL" (or presses Enter)

[32.0s - 38.0s] Hangar Launch Sequence & Countdown
               • Flashing hangar bay indicator lights (1 -> 2 -> 3)
               • Ship powerup sound & cyan shield ignition
               • Countdown: 3... 2... 1... Engine thrust maximum

[38.0s - 40.0s] Hyperdrive Space-Time Warp
               • Stars stretch into blue/cyan streak vectors
               • Warp tunnel transition audio plays
               • Smooth camera transition into gameplay scene
```

---

## 3. Accessibility & Control Directives

- **Skip Functionality**: The entire opening sequence can be skipped instantly at any point by pressing the `ESC` key or clicking the `SKIP INTRO (ESC)` button on the top right. Skipping triggers the warp sound and places the player directly into Safe Sector Alpha.
- **Subtitles & Text Formatting**: High-contrast cyan/slate text styled in monospace (`font-mono`) with high WCAG AA legibility.
- **Keyboard Navigation**:
  - `ESC`: Skip Intro / Cancel Scan / Close Modals.
  - `WASD` / `Arrow Keys`: Pilot Spaceship / Rotate & Accelerate.
  - `SPACE`: Fire Lasers / Initiate Scan.
  - `ENTER`: Confirm Dialogue / Advance Briefing.

---

## 4. Safe Exploration Sector Alpha (Spawn System)

To eliminate disorientation and ensure player agency:
- **Spawn Coordinates**: `(2500, 1700)` inside 5000x5000 unit world.
- **Nearest Galaxy Distance**: Milky Way is located at `(2500, 2500)`, giving a buffer distance of 800 units.
- **Flight Time Buffer**: At top cruising velocity (260–300 px/sec), the player enjoys ~20–30 seconds of open flight navigation before entering any galaxy's discovery threshold (280 units).
- **Hazard Clearance**: No asteroids or cosmic debris spawn within 800 units of Sector Alpha.

---

## 5. Ambient Music & Audio Integration

The audio engine (`src/engine/audioEngine.ts`) implements native Web Audio API space synthesis with zero external audio assets:
- **MENU MODE**: Lowpass filtered drone at 280Hz with warm minor third frequencies (C2 / G2 / Eb2).
- **GAMEPLAY MODE**: Deep space exploration drone with 480Hz resonant filter, LFO sweeping space swells, and random star sparkle chimes.
- **DISCOVERY MODE**: Bright 950Hz major triadic harmonic swells (E2 / B2 / G#2) with uplifting discovery chimes.

---

*Specification verified for AP Galaxy Explorer v1.95.*
