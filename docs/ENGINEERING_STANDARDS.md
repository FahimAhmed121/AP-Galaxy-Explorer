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
   - **React**: UI, Routing, Authentication, Mission Control, Galaxy Info, Quizzes, Certificates, and Persistent Player Profile.  
   - **Phaser**: 60 FPS Render Loop, Camera, Entity Physics, Ship Movement, Particle Systems, Collision Detection, and Space Navigation.
3. **Composition Over Inheritance**  
   Prefer functional components, custom hooks, and modular entity systems over deep OOP class hierarchies.
4. **Data-Driven Systems**  
   Galaxies, quizzes, ship upgrades, achievements, and dialogue are strictly decoupled from rendering code into validated JSON/TypeScript schema data registries.
5. **Strict Type Safety & Zero Ambiguity**  
   No `any` types. Pure typed contracts for all state actions, EventBus payloads, and entity interfaces.
6. **Zero Desktop Secret Dependencies**  
   Desktop builds require no third-party OAuth client secrets. Client-side configuration uses only public Firebase project identifiers.

---

## 2. Folder Structure Standards

### Production Architecture Layout
```text
/
├── electron/               # Electron Main Process & Preload Bridge
│   ├── main.ts             # Main process (single-instance, loopback server, lifecycle)
│   └── preload.ts          # Minimal context bridge
├── firestore.rules         # Security Rules for Firestore Cloud Saves
└── src/
    ├── components/         # React UI Components (HUD, Common, Views, Educational)
    ├── core/               # Shared Constants, Config, Events, Logger, Types
    ├── data/               # Static Data Registries (Galaxies, Quizzes, Progression)
    ├── engine/             # Web Audio Procedural Synthesizer Engine
    ├── phaser/             # Phaser Engine (Entities, Managers, Scenes, Systems)
    ├── services/           # Decoupled Services (Firebase, Auth, CloudSave, SyncManager)
    │   ├── auth/           # Firebase Authentication Wrapper (Email/Password & Profile)
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

* **React Components:** PascalCase + `.tsx` (e.g., `ShipStatusHUD.tsx`, `GalaxyInfo.tsx`, `AuthModal.tsx`)
* **Phaser Scenes & Classes:** PascalCase + `.ts` (e.g., `MainGameplayScene.ts`, `PlayerShip.ts`, `GalaxyManager.ts`)
* **React Hooks & Stores:** camelCase with `use` prefix + `.ts` (e.g., `useGameStore.ts`)
* **Utilities & Managers:** camelCase + `.ts` (e.g., `events.ts`, `audioEngine.ts`, `mathUtils.ts`)
* **Data Registries:** camelCase + `.json` / `.ts` (e.g., `galaxies.json`, `progressionData.ts`)

---

## 4. React Standards

* **Functional Components Only:** Use standard React 18 functional components with hooks.
* **Component Boundaries:** Keep components under 300 lines. Extract sub-components into modular files.
* **Prop Interfaces:** Every component must define an explicit `interface Props` type contract.
* **Avoid useEffect Dependency Pitfalls:** Never pass unstabilized objects or inline functions into `useEffect` dependency arrays. Prefer primitive values or memoized handlers.

---

## 5. Phaser Standards & React Bridge

### Separation Matrix
* React **NEVER** mutates Phaser scene internals directly.
* Phaser **NEVER** mutates React DOM state directly.
* All cross-boundary communication flows asynchronously through an event-driven `EventBus` (`src/core/events.ts`).

---

## 6. Zustand State Management Standards

* **Atomic Slices:** Keep state slice definitions focused (User Profile, Mission Progress, Settings, Active Ship State).
* **Persistence Middleware:** Persist settings, discovered galaxy IDs, quiz best scores, and ship upgrade levels in browser `localStorage`.
* **Immutable Updates:** Always treat state objects as immutable.

---

## 7. Cloud Save & Conflict Resolution Standards

* **Additive Set Union ($A \cup B$):** Unlocked items (galaxies, badges, cosmetics, perks) never lose unlocked entries during sync.
* **Monotonic Max ($\max(A, B)$):** Career XP, rank level, total score, and quiz high scores always take the higher value.
* **Stardust Net-Delta:** $\text{Reconciled} = \max(0, \text{Cloud} + (\text{Local} - \text{LastSynced}))$. Baseline advances only on confirmed cloud write.
* **Session Concurrency:** All sync operations check `activeSyncSessionId` to eliminate race conditions on account switching.

---

## 8. Electron & Security Standards

* **Sandboxing:** Chromium sandboxing (`sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`) must remain strictly enabled.
* **Loopback Production Server:** Production assets are served over `127.0.0.1:<port>` with directory traversal validation to ensure HTTP origin parity for Firebase Auth and Firestore.
* **Direct Firebase Authentication:** Uses direct Firebase Email & Password authentication across Web and Desktop with zero external OAuth redirect complexity.
* **Zero Desktop Secrets:** No confidential OAuth secrets or keys are required in client bundles or desktop builds.

---

## 9. TypeScript Standards

* **Strict Mode:** `"strict": true` in `tsconfig.json`.
* **No `any` or `unknown` casts without type guards.**
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
