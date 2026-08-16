# AP Galaxy Explorer V2 — Engineering Standards & Architecture Handbook
**Organization:** Astronomy Pathshala  
**Role:** Lead Software Engineer & Game Architect  
**Target Platform:** Windows Desktop (Electron) + Web Preview  
**Tech Stack:** React 18, TypeScript, Phaser (^4.2.1), Zustand, Tailwind CSS, Web Audio API, Firebase Auth & Firestore, Electron  

---

## 1. General Development Philosophy

### Core Directives
1. **The Player is an Explorer, Not a Soldier**  
   Gameplay mechanics emphasize curiosity, scanning, navigation, astrophotography, and data gathering before combat or destruction.
2. **Clean Architecture & Separation of Concerns**  
   React handles UI, Routing, Authentication, Mission Control, Galaxy Info, Quizzes, Certificates, and Persistent Player Profile.  
   Phaser handles 60FPS Render Loop, Camera, Entity Physics, Ship Movement, Particle Systems, Collision Detection, and Space Navigation.
3. **Composition Over Inheritance**  
   Prefer functional components, custom hooks, and modular entity systems over deep OOP class hierarchies (except where Phaser scene subclassing strictly requires it).
4. **Data-Driven Systems**  
   Galaxies, quizzes, ship upgrades, achievements, and dialogue are strictly decoupled from rendering code into validated JSON/TypeScript schema data registries.
5. **Strict Type Safety & Zero Ambiguity**  
   No `any` types. Pure typed contracts for all state actions, EventBus payloads, and entity interfaces.

---

## 2. Folder Structure Standards

### Production Architecture Layout
```
/
├── electron/               # Electron Main Process & Preload Bridge
│   ├── main.ts
│   └── preload.ts
├── firestore.rules         # Security Rules for Firestore Cloud Saves
└── src/
    ├── components/         # React UI Components (HUD, Common, Views, Educational)
    ├── core/               # Shared Constants, Config, Events, Logger, Types
    ├── data/               # Static Data Registries (Galaxies, Quizzes, Progression)
    ├── engine/             # Web Audio Procedural Synthesizer Engine
    ├── phaser/             # Phaser Engine (Entities, Managers, Scenes, Systems)
    ├── services/           # Decoupled Services (Firebase, Auth, CloudSave, SyncManager)
    │   ├── auth/           # Firebase Authentication Wrapper
    │   ├── cloudSave/      # Cloud Save Serializer, Resolver, Service, SyncManager
    │   └── firebase.ts     # Firebase App & SDK Singleton
    ├── store/              # Zustand Store with localStorage & Cloud Sync
    ├── utils/              # Helper Utilities (Math, Formatters)
    ├── App.tsx             # Main App Shell & State Switcher
    └── main.tsx            # DOM Entry Point
```

### File Placement Rules
* **Max Folder Depth:** 4 levels from `src`.
* **Phaser Code Isolation:** All Phaser scenes, game objects, physics bodies, and scene managers strictly reside inside `/src/phaser`.
* **React Code Isolation:** All UI components, overlays, and screens reside inside `/src/components`.
* **Shared Types:** All shared data contracts reside strictly in `/src/core/types.ts`.

---

## 3. File Naming Conventions

* **React Components:** PascalCase + `.tsx` (e.g., `ShipStatusHUD.tsx`, `GalaxyInfoModal.tsx`)
* **Phaser Scenes & Classes:** PascalCase + `.ts` (e.g., `SpaceScene.ts`, `ShipEntity.ts`)
* **React Hooks:** camelCase with `use` prefix + `.ts` (e.g., `useGameStore.ts`, `useAudio.ts`)
* **Utilities & Managers:** camelCase + `.ts` (e.g., `eventBus.ts`, `audioEngine.ts`, `mathUtils.ts`)
* **Data Registries:** Plural camelCase + `.ts` (e.g., `galaxies.ts`, `quizzes.ts`, `achievements.ts`)

---

## 4. React Standards

* **Functional Components Only:** Use standard React 18 functional components with hooks.
* **Component Boundaries:** Keep components under 250 lines. Extract sub-components into separate files.
* **Prop Interfaces:** Every component must define an explicit `Interface Props` type contract.
* **Avoid useEffect Dependency Pitfalls:** Never pass unstabilized objects or inline functions into `useEffect` dependency arrays. Prefer primitive values or memoized handlers.

---

## 5. Phaser Standards & React Bridge

### Separation Matrix
* React **NEVER** mutates Phaser scene internals directly.
* Phaser **NEVER** mutates React DOM state directly.
* All cross-boundary communication flows asynchronously through an event-driven `GameBridge` / `EventBus`.

### Game Bridge Architecture (`src/engine/bridge/eventBus.ts`)
```typescript
import Phaser from 'phaser';

export type GameEvent =
  | 'SHIP_HEALTH_CHANGED'
  | 'SHIP_SHIELD_CHANGED'
  | 'STARDUST_COLLECTED'
  | 'UPDATE_SHIP_STATS'
  | 'SHIP_STATS_CHANGED'
  | 'PLAYER_DESTROYED'
  | 'GALAXY_PROXIMITY_ENTER'
  | 'GALAXY_PROXIMITY_EXIT'
  | 'WARP_JUMP_TRIGGERED'
  | 'GAME_OVER_TRIGGERED';

class GameEventBus extends Phaser.Events.EventEmitter {
  emitEvent(event: GameEvent, payload?: any) {
    this.emit(event, payload);
  }

  onEvent(event: GameEvent, fn: (payload?: any) => void, context?: any) {
    this.on(event, fn, context);
  }
}

export const eventBus = new GameEventBus();
```

---

## 6. Zustand State Management Standards

* **Atomic Slices:** Keep state slice definitions focused (User Profile, Mission Progress, Settings, Active Ship State).
* **Persistence Middleware:** Persist settings, discovered galaxy IDs, quiz best scores, and ship upgrade levels in browser `localStorage`.
* **Immutable Updates:** Always treat state objects as immutable.

---

## 7. TypeScript Standards

* **Strict Mode:** `"strict": true` in `tsconfig.json`.
* **No `any` or `unknown` casts without guards.**
* **Use Discriminated Unions for Navigation State:**
  ```typescript
  export type GameState = 
    | 'MENU' 
    | 'PLAYING' 
    | 'WARPING' 
    | 'GALAXY_INFO' 
    | 'QUIZ' 
    | 'CERTIFICATE' 
    | 'ARCHIVE' 
    | 'SETTINGS' 
    | 'GAME_OVER';
  ```

---

## 8. Data Architecture & Localization

* **Bilingual Data Schema:** All educational content (names, descriptions, fun facts, quiz questions) includes English and Bengali (`banglaTranslation`) entries.
* **Schema Validation:** Ensure every galaxy record satisfies the `Galaxy` interface contract:
  ```typescript
  export interface Galaxy {
    id: string;
    name: string;
    type: string;
    distance: string;
    diameter: string;
    constellation: string;
    age: string;
    description: string;
    funFacts: string[];
    visualColor: string;
    x: number;
    y: number;
    radius: number;
    quizzes: QuizQuestion[];
    banglaTranslation?: BanglaTranslation;
  }
  ```

---

## 9. Code Quality & Performance Rules

* **Maximum File Length:** 300 lines for React components, 400 lines for Phaser scene classes.
* **Asset Loading:** Preload heavy textures and audio assets in Phaser `BootScene` with progress bars.
* **Clean Event Disposals:** Always remove Phaser event listeners and cleanup canvas contexts on component unmount.

---

## 10. Future Scalability Blueprint
* Designed to easily accommodate:
  - 100+ Celestial Objects (Galaxies, Nebulae, Black Holes)
  - Custom Ship Hangar & Hulls
  - Multi-mission Campaign System
  - Offline PDF Certificate Generation
