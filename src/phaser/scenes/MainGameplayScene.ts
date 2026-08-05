import Phaser from 'phaser';
import { GAME_CONFIG } from '../../core/config';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { PlayerShip } from '../entities/PlayerShip';
import { WorldManager } from '../managers/WorldManager';
import { AsteroidManager } from '../managers/AsteroidManager';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { DebugOverlaySystem } from '../systems/DebugOverlaySystem';
import { ScannerSystem } from '../systems/ScannerSystem';
import { ScannerVisualSystem } from '../systems/ScannerVisualSystem';
import { DiscoveryController } from '../systems/DiscoveryController';
import { LearningController } from '../systems/LearningController';

export class MainGameplayScene extends Phaser.Scene {
  private isPaused: boolean = false;

  // Systems & Managers
  private worldManager?: WorldManager;
  private asteroidManager?: AsteroidManager;
  private inputSystem?: InputSystem;
  private audioSystem?: AudioSystem;
  private debugOverlay?: DebugOverlaySystem;
  private scannerSystem?: ScannerSystem;
  private scannerVisuals?: ScannerVisualSystem;
  private discoveryController?: DiscoveryController;
  private learningController?: LearningController;

  // Entities
  private playerShip?: PlayerShip;

  constructor() {
    super({ key: 'MainGameplayScene' });
  }

  public create(): void {
    logger.info('MainGameplayScene: Initializing gameplay systems and player entity...');

    // 1. Initialize World Manager (Bounds, Grid, Space Stars & Dust)
    this.worldManager = new WorldManager(this);

    // 2. Initialize Input System
    this.inputSystem = new InputSystem(this);

    // 3. Initialize Audio System
    this.audioSystem = new AudioSystem();

    // 4. Initialize Scanner System & Visuals
    this.scannerSystem = new ScannerSystem();
    this.scannerVisuals = new ScannerVisualSystem(this);

    // 5. Initialize Discovery & Learning Systems
    this.discoveryController = new DiscoveryController();
    this.discoveryController.setCamera(this.cameras.main);
    this.learningController = new LearningController();

    // 6. Spawn Player Ship at Safe Sector Alpha (2500, 1700)
    const spawnX = GAME_CONFIG.world.width / 2;
    const spawnY = GAME_CONFIG.world.height / 2 - 800;
    this.playerShip = new PlayerShip(this, spawnX, spawnY);

    // 7. Initialize Asteroid & Stardust Manager
    this.asteroidManager = new AsteroidManager(this, this.playerShip);

    // 8. Configure Camera Follow & Lerp
    const camera = this.cameras.main;
    camera.setBounds(0, 0, GAME_CONFIG.world.width, GAME_CONFIG.world.height);
    camera.startFollow(this.playerShip, true, 0.08, 0.08);
    camera.setZoom(1.0);

    // 9. Initialize Debug Overlay System
    this.debugOverlay = new DebugOverlaySystem(this);

    // 10. Setup EventBus Listeners
    this.setupEventBus();

    // 11. Handle Resize Events
    this.scale.on('resize', this.handleResize, this);

    // 12. Notify React Shell of Readiness
    eventBus.emit('PHASER_READY', { sceneKey: 'MainGameplayScene' });
    logger.info('MainGameplayScene: Player entity active and camera locked.');
  }

  public update(_time: number, delta: number): void {
    if (this.isPaused || !this.playerShip || !this.inputSystem) return;

    // 1. Poll Keyboard Input State
    const inputState = this.inputSystem.getInputState();

    // 2. Toggle Debug Overlay
    if (inputState.debugToggle && this.debugOverlay) {
      this.debugOverlay.toggle();
    }

    // 3. Update Player Ship Movement & Physics
    this.playerShip.handleInput(inputState, delta);

    // 3.5 Laser Firing
    if (inputState.fireRequested && this.asteroidManager) {
      this.asteroidManager.fireLaser();
    }

    // 3.6 Update Asteroids, Lasers & Stardust Pickup Loops
    if (this.asteroidManager) {
      this.asteroidManager.update(delta);
    }

    // 4. Update World, Universe & Galaxy Streaming
    if (this.worldManager) {
      this.worldManager.update(this.playerShip.x, this.playerShip.y, delta);
    }

    // 5. Update Scanner System Logic & Visual FX
    if (this.scannerSystem && this.worldManager) {
      const galaxyManager = this.worldManager.getGalaxyManager();
      this.scannerSystem.update(
        this.playerShip.x,
        this.playerShip.y,
        delta,
        inputState.scanJustPressed,
        inputState.scanRequested,
        galaxyManager,
        this.playerShip
      );

      if (this.scannerVisuals) {
        this.scannerVisuals.update(delta, this.scannerSystem, this.playerShip);
      }
    }

    // 6. Update Cinematic Discovery Controller
    if (this.discoveryController && this.playerShip) {
      this.discoveryController.update(
        delta,
        this.playerShip,
        this.cameras.main,
        inputState.skipJustPressed
      );
    }

    // 7. Update Audio Engine Feedback
    if (this.audioSystem) {
      this.audioSystem.updateThrustSound(inputState.forward, inputState.boost);
    }

    // 8. Sync Player State to UI EventBus
    this.playerShip.syncState();

    // 9. Update Debug Overlay Stats
    if (this.debugOverlay) {
      this.debugOverlay.update(
        this.playerShip,
        this.worldManager ? this.worldManager.getUniverseManager() : undefined,
        this.worldManager ? this.worldManager.getGalaxyManager() : undefined,
        this.scannerSystem,
        this.discoveryController
      );
    }
  }

  private setupEventBus(): void {
    const handlePause = () => {
      this.isPaused = true;
      this.scene.pause();
      logger.info('MainGameplayScene: Scene paused via EventBus.');
    };

    const handleResume = () => {
      this.isPaused = false;
      this.scene.resume();
      if (this.playerShip) {
        this.playerShip.isControlsLocked = false;
      }
      if (this.cameras && this.cameras.main && this.playerShip) {
        this.cameras.main.setZoom(1.0);
        this.cameras.main.startFollow(this.playerShip, true, 0.08, 0.08);
      }
      logger.info('MainGameplayScene: Scene resumed and player ship controls/camera restored via EventBus.');
    };

    eventBus.on('PAUSE_GAMEPLAY', handlePause);
    eventBus.on('RESUME_GAMEPLAY', handleResume);

    this.events.once('shutdown', () => {
      eventBus.off('PAUSE_GAMEPLAY', handlePause);
      eventBus.off('RESUME_GAMEPLAY', handleResume);
      this.cleanUpSystems();
    });
  }

  private handleResize(gameSize: Phaser.Structs.Size): void {
    logger.debug(`MainGameplayScene: Viewport resized to ${gameSize.width}x${gameSize.height}`);
    this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
  }

  private cleanUpSystems(): void {
    if (this.worldManager) this.worldManager.destroy();
    if (this.asteroidManager) this.asteroidManager.destroy();
    if (this.inputSystem) this.inputSystem.destroy();
    if (this.audioSystem) this.audioSystem.destroy();
    if (this.debugOverlay) this.debugOverlay.destroy();
    if (this.scannerSystem) this.scannerSystem.destroy();
    if (this.scannerVisuals) this.scannerVisuals.destroy();
    if (this.discoveryController) this.discoveryController.destroy();
    if (this.learningController) this.learningController.destroy();
  }
}
