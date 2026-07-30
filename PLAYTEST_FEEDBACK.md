# PLAYTEST_FEEDBACK.md — Manual Playtesting Log

This document records observed user behavior, UI/UX issues, bug reports, and resolution statuses across manual playtesting sessions for AP Galaxy Explorer. This document is updated after every playtest pass.

---

## Critical Priority Issues

### Issue CRIT-01: Interrupted AURA Dialogue Auto-Advancement
- **Observed Behaviour**: AURA AI assistant dialogue text auto-advanced and dismissed itself after a fixed 2.5-second timer, preventing players from finishing long educational descriptions.
- **Expected Behaviour**: Dialogue text must remain open until the player explicitly advances or dismisses it using interactive pagination controls.
- **Priority**: Critical
- **Status**: RESOLVED (Quality Sprint 1.0)
- **Recommendations**: Retain the `PREV`, `NEXT`, `SKIP CINEMATIC`, and `CONTINUE TO BRIEFING` control interface in `DiscoveryOverlay.tsx`.

### Issue CRIT-02: Non-Functional Plasma Energy Bar
- **Observed Behaviour**: The HUD Plasma/Energy meter remained at 0% or unlinked state, leaving a broken UI element on screen.
- **Expected Behaviour**: Energy meter must accurately reflect a 100-point reserve that depletes during scanner usage and booster thrust, regenerating passively over time.
- **Priority**: Critical
- **Status**: RESOLVED (Quality Sprint 1.0)
- **Recommendations**: Energy consumption is now wired to `PlayerShip.ts` (`100` max energy, `14/s` recharge rate, linked to `ShipStatusHUD.tsx`).

---

## High Priority Issues

### Issue HIGH-01: Light / Floaty Flight Dynamics
- **Observed Behaviour**: Spacecraft movement felt overly light with instant acceleration and floaty deceleration drift.
- **Expected Behaviour**: Spacecraft should feel heavy and substantial while maintaining responsive controls.
- **Priority**: High
- **Status**: RESOLVED (Quality Sprint 1.0)
- **Recommendations**: Maintain current mass tuning in `PlayerShip.ts` (acceleration: `220 px/s²`, heavy space drag coefficient: `0.988`, top speed: `320 px/s`).

### Issue HIGH-02: Instant / Plain Warp Jump
- **Observed Behaviour**: Clicking warp jump abruptly snapped the player ship to destination coordinates without visual feedback or cinematic sequence.
- **Expected Behaviour**: Warp jumps should display an immersive, multi-phase hyperspace visual effect with charge-up, star stretching, radial bloom, and exit flash.
- **Priority**: High
- **Status**: RESOLVED (Quality Sprint 1.0)
- **Recommendations**: Retain HTML5 Canvas particle tunnel renderer in `WarpJumpOverlay.tsx`.

---

## Medium Priority Issues

### Issue MED-01: HUD Debug Telemetry Clutter
- **Observed Behaviour**: Developer coordinate logs and raw FPS numbers overlapped gameplay HUD meters by default.
- **Expected Behaviour**: Gameplay HUD should show only survival metrics (Hull, Shield, Energy, Stardust, Mission); developer telemetry should appear only when toggled.
- **Priority**: Medium
- **Status**: RESOLVED (Quality Sprint 1.0)
- **Recommendations**: Keep developer debug overlay hidden by default, toggled via `F3` key.

### Issue MED-02: Minimap Radar Static Dots
- **Observed Behaviour**: Minimap displayed static dots without showing player heading orientation or space station landmarks.
- **Expected Behaviour**: Minimap radar must show live player position, heading direction vector, Space Station Alpha, mapped vs unexplored status, and collapse options.
- **Priority**: Medium
- **Status**: RESOLVED (Quality Sprint 1.0)
- **Recommendations**: Retain `RadarHUD.tsx` player heading arrow and collapsible panel toggle.

---

## Low Priority Issues

### Issue LOW-01: Mobile Touch Virtual Joystick Sensitivity
- **Observed Behaviour**: On small tablet/mobile viewports, the virtual joystick input sensitivity can feel overly fast during tight maneuvers.
- **Expected Behaviour**: Touch input should feature responsive dead-zone scaling for smaller touchscreens.
- **Priority**: Low
- **Status**: OPEN (Scheduled for Sprint 2.0 Polish)
- **Recommendations**: Implement adaptive dead-zone scaling in `InputSystem.ts` for touch events.

### Issue LOW-02: External NASA Live Image API Fetching
- **Observed Behaviour**: Learning cards rely on generated WebGL/SVG deep-space reticles for visual showcases.
- **Expected Behaviour**: When online connection is available, live telescope images can be fetched from the NASA Open API.
- **Priority**: Low
- **Status**: OPEN (Scheduled for Sprint 2.5 Cloud Integration)
- **Recommendations**: Integrate optional live image API calls with fallback to local SVG reticles when offline.
