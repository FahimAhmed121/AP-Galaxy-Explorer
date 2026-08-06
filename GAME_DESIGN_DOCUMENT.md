# GAME_DESIGN_DOCUMENT.md — AP Galaxy Explorer

## 1. Game Overview & Vision

**AP Galaxy Explorer (Astronomy Pathshala Galaxy Explorer)** is an open-world 2D space exploration game, educational simulation, and astrophysical interactive laboratory.

Designed for students and space enthusiasts, the game combines high-velocity inertial spacecraft piloting, asteroid mining combat, spectrographic galaxy scanning, cinematic discovery reveals, authentic NASA/JWST educational dossiers, and adaptive scientific quizzes.

### Core Pillars
1. **Authentic Astronomy Education**: Real astrophysical parameters (redshift, distance, star formation rates, galactic morphology) curated from NASA, Hubble, and JWST archives.
2. **Engaging 2D Flight & Combat**: Fluid inertial flight physics, plasma cannon asteroid mining, stardust harvesting, and deflector shield management.
3. **Rewarding Career Progression**: Long-term career progression tracking Explorer XP, rank titles (Space Cadet → Master Voyager of the Cosmos), merit badges, passive perks, and customizable ship cosmetics.

---

## 2. Core Gameplay Loop

```
  Space Sector Flight & Exploration
                 │
                 ▼
  Asteroid Mining & Stardust Harvesting
                 │
                 ▼
  Galaxy Proximity Lock & Spectrographic Scan (Press E)
                 │
                 ▼
  Cinematic Discovery Reveal & AURA AI Paced Dialogue
                 │
                 ▼
  Interactive Learning Briefing (NASA / JWST Dossier)
                 │
                 ▼
  Adaptive Scientific Mission Quiz
                 │
                 ▼
  Stardust, XP & Merit Badge Rewards
                 │
                 ▼
  Hangar Hardware Upgrades & Cosmetic Customization
                 │
                 ▼
  Galactic Archive Sync & Continued Deep Space Exploration
```

---

## 3. Gameplay Systems

### 3.1. Spacecraft Flight & Physics
- **Controls**: Inertial thrust (`W`/`Up`), rotation (`A`/`D`/`Left`/`Right`), reverse dampening (`S`/`Down`), plasma booster (`Shift`), and plasma cannon (`Space`/`F`/`K`/`Left Click`).
- **Energy System**: Dynamic 100-point Plasma Energy pool powering flight boosters, cannon lasers, and scanners with passive regeneration ($14\text{ pts/s}$).
- **Vitals**: Hull Integrity ($100\text{ HP}$) and Deflector Shields ($100\text{ Max}$ with passive $2.0\text{ HP/s}$ recharge).

### 3.2. Asteroid Mining & Combat
- **Procedural Asteroid Fields**: 7 organic deep-space clusters containing Large, Medium, and Small asteroids drifting with serene natural velocities.
- **Plasma Cannon**: Fires energy beam bolts expending 6 Plasma Energy per shot, fragmenting large asteroids into smaller debris and dropping glowing Stardust orbs.
- **Vacuum Magnetism**: Magnetic attraction field pulling nearby Stardust orbs directly toward the ship for automated harvesting.

### 3.3. Ship Hardware Progression (Hangar)
Purchased using mined Stardust reserves in the Pilot Dashboard Hangar:
1. **Ion Engine**: Increases sub-light flight velocity and booster thrust.
2. **Deflector Shield**: Expands shield capacity and speeds up passive regeneration.
3. **Plasma Cannon**: Increases beam damage and firing rate.
4. **Vacuum Dust Magnet**: Expands magnetic orb collection radius.

---

## 4. Explorer Career Progression System (Sprint 2.3)

### 4.1. Explorer XP & Level Ranks
Players earn Explorer XP through discovery and educational achievements:
- **Galaxy Discovery**: +100 Base XP
- **Passed Quiz**: +50 Base XP
- **100% Quiz Mastery**: +25 Bonus XP
- **Perk Bonus**: +25% bonus XP with Curiosity Matrix perk active.

#### Level & Rank Table (15 Levels):
| Level | Rank Title | XP Required | Stardust Bonus | Key Unlocks |
|---|---|---|---|---|
| 1 | Space Cadet | 0 XP | 0 | Default Skins & FX |
| 2 | Star Finder | 150 XP | 50 | - |
| 3 | Starlight Scout | 350 XP | 75 | Perk: High-Frequency Sensor (+20% Scan Speed) |
| 4 | Cosmic Navigator | 650 XP | 100 | Cosmetic: Neon Cyberpunk Ship Skin |
| 5 | Astro Cartographer | 1,000 XP | 150 | Perk: Attraction Field Boost (+30% Magnet) |
| 6 | Galactic Explorer | 1,450 XP | 200 | Cosmetic: Solar Amber Flare Thruster FX |
| 7 | Deep Space Scout | 2,000 XP | 250 | Perk: Overclocked Thrusters (+15% Velocity) |
| 8 | Nebula Surveyor | 2,650 XP | 300 | Cosmetic: Quantum Magenta Scanner FX |
| 9 | Starlight Voyager | 3,400 XP | 350 | Perk: Capacitor Overdrive (+35% Shield Regen) |
| 10 | Master Astro Voyager | 4,250 XP | 500 | Cosmetics: Void Shadow Skin, Hyper Violet Thruster |
| 11 | Cosmic Scholar | 5,200 XP | 600 | Perk: Curiosity Matrix (+25% XP Bonus) |
| 12 | Deep Space Pioneer | 6,250 XP | 700 | Cosmetic: Emerald Aurora Scanner FX |
| 13 | Celestial Captain | 7,400 XP | 800 | - |
| 14 | Quantum Commander | 8,650 XP | 900 | Cosmetic: Quantum Emerald Ship Skin |
| 15 | Master Voyager of the Cosmos | 10,000 XP | 1,200 | Cosmetics: Celestial Monarch Gold Skin, Gold Warp Thruster |

---

### 4.2. Merit Badge System
Handcrafted achievement badges earned for flight and educational milestones:
1. **First Contact** (`badge_first_contact`): Discover your first galaxy.
2. **Galactic Scout** (`badge_galaxy_scout`): Discover 3 unique galaxies.
3. **Master Cartographer** (`badge_master_cartographer`): Discover all cataloged galaxies (>= 9).
4. **Curious Scholar** (`badge_curious_mind`): Pass first galaxy quiz.
5. **Perfect Scholar** (`badge_perfect_score`): Achieve 100% score on any galaxy quiz.
6. **Stardust Miner** (`badge_stardust_collector`): Accumulate 250 Stardust.
7. **Veteran Aviator** (`badge_veteran_pilot`): Reach Explorer Level 5.

---

### 4.3. Cosmetic Customization System
Customizable ship visual effects selected in the Pilot Hangar:
- **Ship Skins**: Cobalt Vanguard (Default), Neon Cyberpunk, Void Shadow, Quantum Emerald, Celestial Monarch.
- **Thruster FX**: Plasma Ion Blue (Default), Solar Amber Flare, Hyper Violet Pulse, Celestial Warp Drive.
- **Scanner FX**: Standard Cyan Array (Default), Quantum Magenta Matrix, Emerald Aurora Sweep.

---

## 5. Educational Content & Galaxy Catalog

The game features 10 handcrafted deep-space galaxies positioned across the $8000 \times 8000\text{ px}$ universe:
1. **Milky Way Galaxy (`milky-way`)**: Barred spiral, 100,000 light-years diameter.
2. **Andromeda Galaxy (`andromeda`)**: M31, 2.5 million light-years distance, largest Local Group spiral.
3. **Sombrero Galaxy (`sombrero`)**: M104, Virgo constellation, dark dust lane and luminous halo.
4. **Whirlpool Galaxy (`whirlpool`)**: M51, grand design spiral interacting with companion NGC 5195.
5. **Triangulum Galaxy (`triangulum`)**: M33, third largest Local Group spiral, lacks central SMBH.
6. **Black Eye Galaxy (`black-eye`)**: M64, counter-rotating gas disks and dark absorbing dust lane.
7. **Pinwheel Galaxy (`pinwheel`)**: M101, face-on giant spiral spanning 170,000 light-years.
8. **Cartwheel Galaxy (`cartwheel`)**: ESO 350-40, ring galaxy created by direct galactic collision.
9. **Large Magellanic Cloud (`large-magellanic-cloud`)**: LMC, satellite galaxy housing Tarantula Nebula.
10. **Small Magellanic Cloud (`small-magellanic-cloud`)**: SMC, dwarf irregular galaxy with low metallicity.

---

## 6. User Interface & Audio Aesthetics

- **Visual Style**: Modern dark-tech sci-fi theme (`#0f172a`, `#0284c7`, `#f59e0b`) featuring glassmorphic overlays, sharp status bars, and clean typography.
- **Audio Synthesizer**: Custom Web Audio procedural oscillator engine producing real-time thruster rumbles, laser bolts, scanner sweeps, explosion thuds, and warp hyperdrive tunnels.
- **Bilingual Interface**: Full toggleable support for English and Bengali (বাংলা).
