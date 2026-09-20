# PRODUCT_REQUIREMENTS_DOCUMENT.md — AP Galaxy Explorer

## 1. Executive Product Vision

**AP Galaxy Explorer (Astronomy Pathshala Galaxy Explorer)** is a web-based educational space flight and astrophysical exploration platform. It delivers real-time space navigation, procedural asteroid mining combat, spectrographic galaxy scanning, authentic NASA/JWST educational dossiers, adaptive scientific quizzes, and rewarding career progression to inspire deep scientific curiosity.

---

## 2. User Personas & Target Audience

| Persona | Description | Primary Needs |
|---|---|---|
| **Secondary Science Student** | 12–18 year old learner studying astronomy and physics. | Engaging visual gameplay, clear scientific concepts, adaptive quiz feedback, clear rank progression. |
| **Astronomy Educator** | Science teacher seeking interactive classroom software. | Scientifically accurate NASA data, zero fluff, bilingual support (English/Bengali), structured galaxy catalog. |
| **Self-Learner / Enthusiast** | Space enthusiast exploring deep astrophysics. | Rich dossiers, high-resolution imagery, deep-space cataloging, completion tracking, badges. |

---

## 3. Functional Requirements

### 3.1. Exploration & Flight Engine (FR-1)
- **FR-1.1**: Provide responsive 2D inertial spacecraft flight with thrust, rotation, reverse dampening, and boost acceleration.
- **FR-1.2**: Maintain dynamic Plasma Energy ($100\text{ Max}$) powering thruster boost, cannon lasers, and spectrographic scanners with passive regeneration ($14\text{ pts/s}$).
- **FR-1.3**: Maintain Hull Integrity ($100\text{ HP}$) and Deflector Shields ($100\text{ HP}$) with passive shield recharge ($2.0\text{ HP/s}$).

### 3.2. Asteroid Mining & Stardust Economy (FR-2)
- **FR-2.1**: Render 7 organic deep-space asteroid clusters with procedural fragmentation (Large → Medium → Small).
- **FR-2.2**: Allow plasma cannon lasers (`Space`/`F`/`K`/`Left Click`) to fragment asteroids, dropping glowing Stardust orbs ($5\text{ stardust/orb}$).
- **FR-2.3**: Provide magnetic attraction field pulling nearby Stardust orbs directly toward the spacecraft for automated collection.

### 3.3. Spectrographic Scanning & Discovery Sequence (FR-3)
- **FR-3.1**: Detect proximity lock when player spacecraft approaches within $400\text{ px}$ of an unmapped galaxy.
- **FR-3.2**: Trigger active spectrographic scan (`E` key or touch button), consuming $15\text{ plasma energy/s}$ until progress reaches 100%.
- **FR-3.3**: Lock flight controls, lerp camera focus, present paginated AURA AI dialogue, and open NASA/JWST educational briefing.

### 3.4. Educational Briefing & Adaptive Mission Quiz (FR-4)
- **FR-4.1**: Display 2-column NASA/JWST educational cards showcasing telescope photos, key astrophysical parameters, and scientific summaries.
- **FR-4.2**: Present adaptive multiple-choice quizzes evaluating comprehension, offering immediate scientific explanations.
- **FR-4.3**: Grant Stardust rewards ($15\text{ stardust/correct answer}$ + $25\text{ perfect score bonus}$) and Explorer XP ($100\text{ discovery}$, $50\text{ quiz pass}$, $25\text{ 100\% score bonus}$).

### 3.5. Explorer Career Progression & Customization (FR-5)
- **FR-5.1**: Track Explorer XP and progress pilot across 15 levels with rank titles from *Space Cadet* to *Master Voyager of the Cosmos*.
- **FR-5.2**: Evaluate and award 7 handcrafted Merit Badges across DISCOVERY, KNOWLEDGE, COLLECTION, and PILOTING categories.
- **FR-5.3**: Provide 12 unlockable cosmetics (5 Ship Skins, 4 Thruster FX, 3 Scanner FX) customizable in the Pilot Hangar.
- **FR-5.4**: Grant 5 passive perks (scanner speed, magnet range, max velocity, shield recharge, XP bonus) unlocked at level thresholds.

### 3.6. Pilot Station Hangar & Galactic Archive (FR-6)
- **FR-6.1**: Provide 4-tier Pilot Hangar hardware upgrades (Ion Engine, Deflector Shield, Plasma Cannon, Vacuum Magnet) using Stardust.
- **FR-6.2**: Provide persistent Galactic Archive & Codex searching and filtering all 10 galaxies by name, morphology, and discovery status.
- **FR-6.3**: Allow direct dossier inspection and quiz retakes from the Galactic Archive.

---

## 4. Technical & Infrastructure Requirements

- **TR-1. Port & Ingress**: Run strictly on hardcoded container Port `3000` bound to `0.0.0.0`.
- **TR-2. Dual Engine**: Integrate Phaser 3.80+ (WebGL/Canvas 2D) with React 18 DOM overlay components.
- **TR-3. Build Pipeline**: Compile backend TypeScript entry points using `esbuild` to single self-contained CommonJS bundles (`dist/server.cjs`).
- **TR-4. Performance Target**: Maintain steady 60 FPS WebGL rendering during active flight, asteroid combat, and spectrographic scanning.
- **TR-5. State Synchronization**: Use Zustand (`useGameStore.ts`) with browser `localStorage` persistence as single source of truth.
- **TR-6. Accessibility & i18n**: Support dynamic real-time language toggling between English and Bengali (বাংলা).

---

## 5. Acceptance Criteria & Sprint 2.3 Signoff

- ✅ All 10 galaxies cataloged, scan-able, and inspectable in Galactic Archive.
- ✅ Explorer XP, 15 Level ranks, 7 Merit Badges, 5 Passive Perks, and 12 Cosmetics verified and functioning.
- ✅ Hangar hardware upgrades and cosmetic previews operating smoothly in Pilot Dashboard.
- ✅ Modal input lock issues and `returnState` navigation Bugs 1 & 2 fully resolved and verified.
- ✅ Build passes cleanly (`npm run build`, `compile_applet`) without errors.
