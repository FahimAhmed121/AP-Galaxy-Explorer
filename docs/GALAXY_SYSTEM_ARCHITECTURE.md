# Interactive Galaxy System Architecture — AP Galaxy Explorer

## Overview
The Interactive Galaxy System introduces content-driven celestial destinations across the procedural universe. The initial pack contains 10 handcrafted galaxies with scientific metadata, custom procedural rendering, and proximity detection events.

---

## Architecture & Data Pipeline

```
+--------------------------------------------------------------------+
|                         src/data/galaxies.json                     |
|  - Content-driven external JSON definitions                         |
|  - Initial 10 Galaxies (Milky Way, M31, M33, M51, M104, etc.)      |
+--------------------------------------------------------------------+
                                   |
                                   v
+--------------------------------------------------------------------+
|                             GalaxyManager                          |
|  - Loads galaxy data catalog                                       |
|  - Streams active GalaxyEntity instances within 2200px threshold   |
|  - Tracks proximity events (GALAXY_PROXIMITY_ENTER / EXIT)         |
|  - Exposes radar & minimap data hooks                              |
+--------------------------------------------------------------------+
                                   |
                                   v
+--------------------------------------------------------------------+
|                             GalaxyEntity                           |
|  - Extends Phaser.GameObjects.Container                            |
|  - Procedural visual rendering (Spiral, Barred, Ring, Irregular)   |
|  - Rotating galaxy arms & core glow animations                     |
|  - Animated discovery boundary ring & smooth label distance fade   |
+--------------------------------------------------------------------+
```

---

## Initial 10 Galaxy Pack
1. **Milky Way Galaxy**: Barred Spiral Galaxy (Core Sector 2, 2)
2. **Andromeda Galaxy (M31)**: Giant Spiral Galaxy (Sector 0, 1)
3. **Triangulum Galaxy (M33)**: Spiral Galaxy (Sector 4, 4)
4. **Whirlpool Galaxy (M51)**: Grand Design Spiral (Sector 0, 4)
5. **Sombrero Galaxy (M104)**: Unbarred Spiral / Ring (Sector 4, 0)
6. **Pinwheel Galaxy (M101)**: Face-On Grand Spiral (Sector 1, 3)
7. **Black Eye Galaxy (M64)**: Counter-Rotating Spiral (Sector 2, 0)
8. **Cartwheel Galaxy**: Cosmic Collision Ring Galaxy (Sector 3, 2)
9. **Large Magellanic Cloud (LMC)**: Satellite Irregular Galaxy (Sector 1, 1)
10. **Small Magellanic Cloud (SMC)**: Satellite Dwarf Irregular Galaxy (Sector 3, 3)

---

## Proximity & Event Integration
- **Discovery Radius**: Configurable per galaxy (e.g., 250px – 320px).
- **Proximity Detection**: When the player ship enters the discovery radius, `GalaxyManager` fires `GALAXY_PROXIMITY_ENTER` on the central `EventBus`.
- **Labels**: Interactive labels fade in smoothly when within label radius (e.g., 500px), reaching full opacity at discovery radius.

---

## Future Integrations
- **Scanner System**: Long-range scanner pulses can target galaxy coordinates provided by `GalaxyManager.getMinimapData()`.
- **Educational Cards & Quizzes**: Triggers when player activates scanner or landing interaction inside discovery radius.
- **Save State & Discovery Log**: `GalaxyManager` provides serializable discovery states for profile saving.
