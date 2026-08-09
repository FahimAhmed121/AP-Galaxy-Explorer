# DRONE_SYSTEM_ARCHITECTURE.md — Alien Survey Drone Architecture

## 1. Overview & System Purpose

The **Alien Survey Drone System** (`DroneManager` & `AlienSurveyDrone`) introduces autonomous AI survey probes to deep-space sectors in AP Galaxy Explorer.

The drone system is designed as an optional, atmospheric, non-destructive scientific encounter. Probes conduct autonomous spectrographic surveys of unmapped deep-space galaxies. They act primarily as scientific instruments rather than aggressive homing missiles, prioritizing galaxy survey tasks over player combat.

---

## 2. Core Components & Responsibilities

```
+-------------------------------------------------------------------+
|                        MainGameplayScene                          |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                           DroneManager                            |
|  - Manages drone spawning & off-screen placement                 |
|  - Controls start-of-game spawn cooldown (60s)                    |
|  - Manages plasma laser group & collision callbacks               |
|  - Handles proximity detection & AURA alert emissions             |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        AlienSurveyDrone                           |
|  - Owns AI Finite State Machine (FSM)                             |
|  - Manages galaxy-centric survey movement                         |
|  - Renders scanner beam & thruster particle emissions             |
|  - Handles health, damage feedback, and destruction rewards       |
+-------------------------------------------------------------------+
```

---

## 3. Finite State Machine (FSM) AI Architecture

The `AlienSurveyDrone` entity operates on a 5-state Finite State Machine:

```
           +------------+
           |   PATROL   | <-----------------------+
           +------------+                         |
                 |                                |
                 v (Near galaxy target)           |
           +------------+                         |
           |   SURVEY   |                         |
           +------------+                         |
                 |                                |
                 v (Player detected < 320px)      |
           +------------+                         |
           | INVESTIGATE| ------------------------+
           +------------+ (Player departs > 450px |
                 |         or survey window ends) |
                 v (Sustained proximity < 160px   |
           +------------+  or galaxy scanned /    |
           |   ATTACK   |  damage taken)          |
           +------------+                         |
                 |                                |
                 v (Player escapes > 600px)       |
           +------------+                         |
           |   RETURN   | ------------------------+
           +------------+ (Reached galaxy < 250px)
```

### State Behavior Details

1. **`PATROL` (Speed: 55 px/s)**
   - Slow, cruising search through deep space towards target galaxy.
   - Switches to `SURVEY` when within 350 px of target galaxy.
   - Switches to `INVESTIGATE` if player ship enters detection radius (< 320 px).

2. **`SURVEY` (Speed: 20 px/s)**
   - Gentle, orbiting motion around target galaxy.
   - Emits visual cyan spectrographic scan beam toward galaxy center.
   - Rotates smoothly to maintain scan alignment.
   - Switches to `PATROL` after survey duration (5–10s) or `INVESTIGATE` if player approaches (< 320 px).

3. **`INVESTIGATE` (Speed: 45 px/s)**
   - Cautiously reorients towards player ship.
   - Approaches until reaching an observation distance (~220 px), then decelerates to hover and observe.
   - Does NOT fire weapons or aggressively chase.
   - Transitions to `RETURN` if player moves away (> 450 px) or observation window expires (> 6s) without hostility.
   - Transitions to `ATTACK` only if player stays in sustained close proximity (< 160 px for > 4s), scans the drone's target galaxy, or attacks the drone.

4. **`ATTACK` (Speed: 145 px/s)**
   - Evasive combat maneuvering firing red plasma lasers (18 damage, 1.4s cooldown).
   - Returns to `RETURN` if player escapes beyond 600 px or combat duration expires (> 6s).

5. **`RETURN` (Speed: 95 px/s)**
   - Disengages from combat/observation and navigates back to target galaxy.
   - Resumes `SURVEY` upon reaching target galaxy (< 250 px).

---

## 4. Proximity & Contextual AURA Alerts

Alerts are fully decoupled from spawning:

- **No Immediate Alert On Spawn**: When a drone spawns off-screen, no alert is shown.
- **Proximity Evaluation**: `DroneManager` monitors distance between active drone and `PlayerShip`.
- **Trigger Condition**: When active drone is within 600 px (`DETECTION_RADIUS`), `DroneManager` emits:
  ```ts
  eventBus.emit('DRONE_DETECTED', { droneId, x, y });
  eventBus.emit('AURA_ALERT', { message: randomAuraMsg, severity: 'warning' });
  ```
- **Throttling**: Alerts are throttled with a 15-second cooldown timer to prevent banner spam.

---

## 5. Arcade Physics Collision Safety Protocol

To prevent accidental destruction of the `PlayerShip` during overlap callbacks, all collision handlers in `DroneManager` enforce strict object identity resolution:

```ts
// Explicit identity check pattern for Arcade Physics overlap callbacks
this.scene.physics.add.overlap(
  this.playerShip,
  this.droneLaserGroup,
  (objA, objB) => {
    // Determine which parameter is the ship and which is the laser
    let ship: PlayerShip | null = null;
    let laser: Phaser.GameObjects.GameObject | null = null;

    if (objA === this.playerShip) {
      ship = objA as PlayerShip;
      laser = objB as Phaser.GameObjects.GameObject;
    } else if (objB === this.playerShip) {
      ship = objB as PlayerShip;
      laser = objA as Phaser.GameObjects.GameObject;
    }

    if (!ship || !laser || ship.isDead) return;

    // Apply damage to ship
    const damage = (laser.getData('damage') as number) || DRONE_CONFIG.PLASMA_DAMAGE;
    ship.takeDamage(damage);

    // Destroy ONLY the laser projectile — NEVER the ship!
    laser.destroy();
  }
);
```

### Architectural Safeguard Rules
1. **Never assume parameter order**: Always compare `objA` and `objB` against expected references (`this.playerShip`, `this.droneLaserGroup`).
2. **Isolate destruction calls**: Only invoke `.destroy()` on confirmed laser/projectile objects.
3. **Check liveness**: Guard handlers with `!ship || ship.isDead` before applying damage or triggering FX.

---

## 6. EventBus Contracts

| Event Name | Sender | Payload | Description |
| :--- | :--- | :--- | :--- |
| `DRONE_DETECTED` | `DroneManager` | `{ droneId, galaxyName, x, y }` | Triggered when drone enters player proximity. |
| `DRONE_STATE_CHANGED` | `AlienSurveyDrone` | `{ droneId, state }` | Emitted on FSM state transition (`PATROL`, `SURVEY`, `INVESTIGATE`, `ATTACK`, `RETURN`). |
| `DRONE_ATTACKED` | `AlienSurveyDrone` | `{ droneId }` | Emitted when drone takes player laser damage. |
| `AURA_ALERT` | `DroneManager` | `{ message, severity }` | Contextual AURA alert emitted to HUD banner. |

---

## 7. Tuning Parameters Matrix (`src/core/constants.ts`)

```ts
export const DRONE_CONFIG = {
  SPAWN_CHANCE: 0.35,
  SPAWN_COOLDOWN_MS: 18000,         // Cooldown between spawn checks (18s)
  MIN_SPAWN_DIST: 1100,             // Off-screen minimum spawn distance
  MAX_SPAWN_DIST: 2400,             // Off-screen maximum spawn distance
  INTERFERENCE_RANGE: 650,          // Range for scanner interference
  DETECTION_RADIUS: 450,            // Awareness threshold
  ATTACK_RADIUS: 650,               // Max attack range
  ESCAPE_RADIUS: 900,               // Distance to break combat
  MAX_SPEED: 220,                   // Top flight speed
  TURN_SPEED: 2.8,                  // Rotation speed (rad/s)
  ATTACK_COOLDOWN: 1400,            // Laser fire rate (ms)
  MAX_HEALTH: 60,                   // Drone hull health
  PLASMA_DAMAGE: 18,                // Damage per laser bolt
  PLASMA_SPEED: 620,                // Laser bolt velocity
};
```
