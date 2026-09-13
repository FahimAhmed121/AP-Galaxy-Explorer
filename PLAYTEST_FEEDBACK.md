# PLAYTEST_FEEDBACK.md — Manual Playtesting Log

This document records observed user behavior, UI/UX issues, bug reports, and resolution statuses across manual playtesting sessions for AP Galaxy Explorer. This document is updated after every playtest pass.

---

## Electron Desktop Playtest — Post-Sprint 2.7 Manual Verification & Stabilization Pass

**Test Date:** 2026-09-13  
**Environment:** Standalone Desktop (Electron on Windows)  
**Test Stage:** Sprint 2.8 — Post-Playtest Stabilization & Release Hardening  

### Verified Working Subsystems
During manual Electron desktop execution, the following areas have been manually tested and verified functional:
- [x] **Application launches in Electron** (clean boot via `node_modules\.bin\electron.exe .`)
- [x] **Main UI loads** (glassmorphic menus, buttons, title layout)
- [x] **Email/Password authentication UI loads** (`AuthModal` presentation and tab switches)
- [x] **Gameplay loads** (Phaser scene mount, starfield, canvas rendering)
- [x] **Player movement** (inertial thruster physics, drag, orientation rotation)
- [x] **Galaxy scanning** (proximity detection, spectrographic reticle lock)
- [x] **Galaxy discovery** (cinematic transition, AURA dialogue step pagination)
- [x] **Learning cards** (bilingual educational dossiers, tabs, media presentation)
- [x] **Quiz** (assessment questions, scientific feedback, score rewards)
- [x] **Alien/enemy gameplay** (alien survey drone AI FSM states, laser combat)
- [x] **General gameplay loop** (flight → exploration → scanning → discovery → quiz → progression)
- [x] **Session persistence during runtime** (gameplay state maintained while window active, survived minimize/restore in the same session)

---

### Post-Playtest Stabilization Issues (Sprint 2.8 Resolution)

#### Issue ELEC-PLAY-01: Keyboard Conflict in Authentication Input Fields
- **Observed Behaviour**: In the standalone Electron application, when typing into the Email/Password authentication and settings input fields (`AuthModal`, `SettingsModal`), keys mapped to gameplay flight controls failed to enter reliably into the text inputs or simultaneously triggered ship actions (e.g., `S`, `D`, `F`, `E`).
- **Browser Preview Comparison**: The same issue did not occur in the Google AI Studio browser preview; standard typing in input fields worked normally in the browser.
- **Root Cause**: Phaser's default keyboard listener registered keys globally on `window` with capture/preventDefault behaviors. When HTML input fields were active, keydown events still triggered ship movement and action states.
- **Implemented Solution**:
  1. Set `enableCapture = false` on all mapped keys in `InputSystem.ts`, called `clearCaptures()`, and disabled `preventDefault`.
  2. Implemented active DOM focus detection `isInputFocused()` in `InputSystem.ts` detecting `<input>`, `<textarea>`, `<select>`, and `contentEditable` elements, immediately returning neutral input states.
  3. Added input element guards to `GameCanvas.tsx`'s window key listener for `Tab` and `KeyP`.
- **Build Verification**:
  - `bunx tsc --noEmit` — PASS
  - `bun run build` — PASS
  - `bun run build:electron` — PASS
- **Manual Electron Verification**:
  - **PASSED.** Tested in the local standalone Electron application.
  - Verified that text can be entered normally into authentication and settings fields, including flight keys `S`, `D`, `F`, `E`, and `Space`, without unintended gameplay actions.
  - Normal flight and combat controls were tested after leaving the form fields and continued to work as expected.
- **Priority**: High / Critical
- **Status**: **RESOLVED / VERIFIED**

#### Issue ELEC-PLAY-02: Local Save Not Restoring Across Complete Electron Application Restart
- **Observed Behaviour Sequence**:
  1. User logged in with Email & Password.
  2. User played the game and made progression (discovered galaxies, earned stardust, XP, upgrades).
  3. User completely closed the Electron desktop application.
  4. User launched Electron again.
  5. The game started fresh instead of restoring previous saved progress.
- **Root Cause**: In production mode, Electron's embedded loopback server previously bound to dynamic port `0` (`listen(0, '127.0.0.1')`), rotating the origin URL on every application launch. Because browser storage is origin-scoped, a changing port isolated `localStorage` and `IndexedDB` data between launches.
- **Implemented Solution**:
  1. Configured deterministic port binding with preferred port `39228` and fallback candidate ports in `electron/main.ts`.
  2. Added port persistence via `userData/app_port.json` so the same loopback port and origin are reused across launches.
  3. Hardened Zustand `merge` logic in `useGameStore.ts` with diagnostic `onRehydrateStorage` logging to ensure profile and ship state restore cleanly.
- **Build Verification**:
  - `bunx tsc --noEmit` — PASS
  - `bun run build` — PASS
  - `bun run build:electron` — PASS
- **Manual Electron Verification**:
  - **PASSED.** Tested in the local standalone Electron application.
  - A complete Electron shutdown and relaunch was performed.
  - Previously created progress remained available after reopening the application, including relevant gameplay progress such as discovered content and progression state.
- **Priority**: High / Critical
- **Status**: **RESOLVED / VERIFIED**

#### Issue ELEC-PLAY-03: Missing Gameplay → Home/Main Menu Navigation
- **Observed Behaviour**: While inside the active gameplay screen, there was no accessible button or clear flow to return to the game's Home/Main Menu screen.
- **Expected Behaviour**: The application must support a full navigation loop:
  ```text
  Home Screen ──> Gameplay ──> In-Game Menu / Pause ──> Return to Home Screen
  ```
- **Constraint**: Navigating back to the Home screen must safely preserve the player's progress and must not unintentionally reset the game state, wipe local progress, clear discovered galaxies, reset upgrades or quiz progress, or terminate the authenticated user session.
- **Implemented Solution**:
  1. Added a dedicated Home navigation button to the top-right Action Bar in `ShipStatusHUD.tsx`.
  2. Added an exit action to `SettingsModal.tsx` when opened from gameplay.
  3. Wire-connected `onExitToMenu` in `App.tsx` and `GameCanvas.tsx` to save active ship coordinates and vitals into `useGameStore.savedShipState` before setting `gameState: 'MENU'`.
  4. Updated `MainMenu.tsx` to detect existing missions and present "Resume Exploration" to jump straight back into space without replaying the intro cutscene.
- **Build Verification**:
  - `bunx tsc --noEmit` — PASS
  - `bun run build` — PASS
  - `bun run build:electron` — PASS
- **Manual Electron Verification**:
  - **PASSED.** Tested in the local standalone Electron application.
  - Verified full navigation loop: `Gameplay → Home → Main Menu → Resume Exploration → Gameplay`.
  - Progress, active session state, callsign, and discoveries remained completely intact without sign-out or state reset.
- **Priority**: Medium / High
- **Status**: **RESOLVED / VERIFIED**

---

## Historical Playtesting Log (Previous Sprints)

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
