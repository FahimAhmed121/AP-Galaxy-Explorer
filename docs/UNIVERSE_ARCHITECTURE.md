# Universe Generation System Architecture — AP Galaxy Explorer

## Overview
The Universe Generation System transforms the gameplay space into a living, procedurally generated, scientifically-inspired cosmic environment. Built for 60 FPS performance across desktop and low-spec web clients, it dynamically streams sectors around the player with zero frame drops or memory leaks.

---

## Architecture Blueprint

```
+-----------------------------------------------------------------------+
|                         MainGameplayScene                             |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                            WorldManager                               |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                          UniverseManager                              |
|  - Tracks active sectors via Map<string, Sector>                     |
|  - Manages streaming window radius (3x3 grid around player)          |
|  - Computes current sector coordinates: (X = x / size, Y = y / size)  |
+-----------------------------------------------------------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|    Active Sector      |                   |    Unloaded Sector    |
| (Instantiated/Loaded) |                   | (Destroyed/Recycled)  |
+-----------------------+                   +-----------------------+
```

---

## Key Components

### 1. Seeded Deterministic Generation (`SeededRandom`)
- Uses a fast 32-bit PRNG (Mulberry32) combined with a sector hash multiplier `getSectorSeed(baseSeed, sectorX, sectorY)`.
- Guarantees that any given sector coordinate `(X, Y)` always generates the exact same arrangement of stars, nebulae, and background galaxies across sessions and clients.

### 2. Sector Hierarchy (`Sector.ts`)
- The universe is discretized into `1000x1000` pixel grid units (`UNIVERSE_CONFIG.sectorSize`).
- Each sector determines its sector theme based on seed rolls:
  - **NEBULA_NEXUS**: Dense translucent colorful gas clouds (blue, purple, magenta, cyan).
  - **GALAXY_FIELD**: Distant background galaxies (spiral arms, elliptical cores).
  - **STAR_CLUSTER**: High density of bright, multi-colored stars with lens flare accents.
  - **DEEP_VOID**: Dark space, high contrast, sparse stellar density.

### 3. Dynamic Sector Streaming (`UniverseManager.ts`)
- Keeps a streaming radius of 1 sector around the player (a 3x3 active grid of 9 sectors).
- As the player flies across sector boundaries, newly entered sectors are instantiated on demand while distant out-of-range sectors are immediately destroyed to prevent memory bloat.

### 4. Vector-Based Lightweight Rendering
- All nebulae, starfields, and background galaxies are rendered onto vector graphics instances within each sector container.
- Eliminates heavy GPU shaders and expensive texture downloads, ensuring low cold-start latency and silky smooth performance.

---

## System Integrations Status
1. **Interactive Galaxy Entities**: ✅ **COMPLETED** (Sprint 1.6) - Celestial bodies in the AP Galaxy catalog register their sector coordinates with `UniverseManager`.
2. **Scanner System**: ✅ **COMPLETED** (Sprint 1.7) - Long-range scanner pulses query loaded and adjacent sectors to highlight targets on the HUD radar.
3. **Asteroid & Hazard Systems**: ✅ **COMPLETED** (Sprint 2.2 & 2.2.1) - Procedural asteroid fields, organic clusters, fragmentation physics, collision damage, and stardust drop mechanics via Phaser `AsteroidManager`.
