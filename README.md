# AP Galaxy Explorer

**AP Galaxy Explorer** is an educational 2D space-exploration game by **Astronomy Pathshala**, designed to make astronomy learning interactive through exploration, discovery, quizzes, learning dossiers, and progression.

The project combines a browser-based React interface with a Phaser-powered game world and an Electron desktop runtime.

## Download

**Windows:** [Download AP Galaxy Explorer v1.0.0](https://github.com/FahimAhmed121/AP-Galaxy-Explorer/releases/tag/v1.0.0-windows)

The Windows release is distributed as an NSIS installer:

`AP Galaxy Explorer Setup 1.0.0.exe`

**Windows:** x64  
**Version:** 1.0.0  
**Release tag:** `v1.0.0-windows`

### What you can do

- Explore a 2D space environment and visit different galaxies
- Scan and discover astronomical objects
- Read astronomy learning dossiers
- Complete astronomy quizzes
- Progress through explorer ranks and earn rewards
- Deploy and use drones during exploration
- Maintain local game progress
- Sign in with Firebase Email/Password authentication
- Sync supported player data through Firebase Cloud Save

## Educational Focus

AP Galaxy Explorer is built for astronomy learning rather than as a conventional arcade game. Gameplay systems are used to encourage exploration and reinforce scientific concepts.

The application includes:

- **Galaxy exploration** - a navigable 2D space environment containing multiple galaxies and astronomical objects
- **Discovery system** - scan and record objects encountered during exploration
- **Learning system** - structured astronomy dossiers associated with discovered content
- **Quiz system** - a 50-question astronomy quiz dataset
- **Progression system** - explorer ranks, merit badges, cosmetics, and progression rewards
- **Drone system** - exploration and combat-support mechanics
- **AURA** - Astronomical Universal Research Assistant integrated into the exploration experience

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Game Engine | Phaser |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Build Tool | Vite |
| Desktop Runtime | Electron |
| Authentication | Firebase Authentication |
| Cloud Data | Firebase Cloud Firestore |
| Audio | Web Audio API |
| Package Management | Bun / npm-compatible scripts |

## Project Structure

```text
/
├── electron/                  # Electron main and preload processes
├── docs/                      # Architecture, testing, and engineering documentation
├── src/
│   ├── components/            # React UI components and views
│   ├── core/                  # Shared types, configuration, events, and utilities
│   ├── data/                  # Galaxies, educational content, quizzes, and progression data
│   ├── engine/                # Procedural Web Audio engine
│   ├── phaser/                # Game entities, scenes, managers, and gameplay systems
│   ├── services/              # Authentication and cloud-save services
│   ├── store/                 # Zustand game state and persistence
│   └── utils/                 # General utilities
├── build/                     # Electron packaging resources
├── firestore.rules            # Firestore security rules
├── index.html                 # Web application entry point
├── package.json               # Dependencies and build/package scripts
└── vite.config.ts             # Vite configuration
```

## Running the Project Locally

### Prerequisites

- Node.js or Bun
- A Windows environment for Electron/Windows packaging
- Firebase project configuration for authentication and cloud features

### Environment Configuration

Create a local `.env` file based on `.env.example`.

The application uses the following Vite environment variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Do **not** commit your local `.env` file.

### Development

Install dependencies:

```bash
bun install
```

Start the Vite development server:

```bash
bun dev
```

Or with npm:

```bash
npm install
npm run dev
```

### Electron Development

Build the frontend and Electron processes, then launch Electron:

```bash
npm run electron:dev
```

### Windows Packaging

Create an unpacked Windows build:

```bash
npm run package:win:dir
```

Create the Windows NSIS installer:

```bash
npm run package:win
```

The installer is generated in:

```text
release/
```

## Authentication & Cloud Save

The application uses Firebase Authentication with **Email/Password** sign-in.

Cloud Save is backed by Firebase Cloud Firestore. Local persistence is also used so that core game progress can continue to work across application restarts.

The Electron desktop application serves the production frontend through its local runtime so that browser-dependent functionality such as authentication and localStorage operates consistently within the desktop application.

For implementation details, see:

- [Authentication & Cloud Save](./docs/AUTHENTICATION.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)
- [System Architecture](./docs/ARCHITECTURE.md)

## Documentation

The repository contains detailed technical documentation for contributors and maintainers.

Key documents include:

- [Architecture](./docs/ARCHITECTURE.md)
- [Engineering Standards](./docs/ENGINEERING_STANDARDS.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)
- [Authentication](./docs/AUTHENTICATION.md)
- [Galaxy System](./docs/GALAXY_SYSTEM_ARCHITECTURE.md)
- [Discovery System](./docs/DISCOVERY_SYSTEM_ARCHITECTURE.md)
- [Learning System](./docs/LEARNING_SYSTEM_ARCHITECTURE.md)
- [Quiz System](./docs/QUIZ_SYSTEM_ARCHITECTURE.md)
- [Scanner System](./docs/SCANNER_SYSTEM_ARCHITECTURE.md)
- [Drone System](./docs/DRONE_SYSTEM_ARCHITECTURE.md)
- [Universe Architecture](./docs/UNIVERSE_ARCHITECTURE.md)

## Release Status

**Current public release: v1.0.0 for Windows**

The Windows release has completed the desktop packaging and manual runtime verification process.

Release assets and version history are available on the [GitHub Releases page](https://github.com/FahimAhmed121/AP-Galaxy-Explorer/releases).

## About Astronomy Pathshala

**Astronomy Pathshala** is a Bangladesh-based astronomy education initiative focused on making space science more accessible through Bengali educational content, programs, and technology.

AP Galaxy Explorer is one of its interactive educational projects.

## License

See the repository for the applicable project licensing and usage terms.
