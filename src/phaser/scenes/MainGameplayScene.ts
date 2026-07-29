import Phaser from 'phaser';
import { GAME_CONFIG } from '../../core/config';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { PlayerShip } from '../entities/PlayerShip';
import { WorldManager } from '../managers/WorldManager';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { DebugOverlaySystem } from '../systems/DebugOverlaySystem';

export class MainGameplayScene extends Phaser.Scene {
  private isPaused: boolean = false;

  // Systems & Managers
  private worldManager?: WorldManager;
  private inputSystem?: InputSystem;
  private audioSystem?: AudioSystem;
  private debugOverlay?: DebugOverlaySystem;

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

    // 4. Spawn Player Ship at World Center
    const spawnX = GAME_CONFIG.world.width / 2;
    const spawnY = GAME_CONFIG.world.height / 2;
    this.playerShip = new PlayerShip(this, spawnX, spawnY);

    // 5. Configure Camera Follow & Lerp
    const camera = this.cameras.main;
    camera.setBounds(0, 0, GAME_CONFIG.world.width, GAME_CONFIG.world.height);
    camera.startFollow(this.playerShip, true, 0.08, 0.08);
    camera.setZoom(1.0);

    // 6. Initialize Debug Overlay System
    this.debugOverlay = new DebugOverlaySystem(this);

    // 7. Setup EventBus Listeners
    this.setupEventBus();

    // 8. Handle Resize Events
    this.scale.on('resize', this.handleResize, this);

    // 9. Notify React Shell of Readiness
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

    // 4. Update World & Universe Sector Streaming
    if (this.worldManager) {
      this.worldManager.update(this.playerShip.x, this.playerShip.y);
    }

    // 5. Update Audio Engine Feedback
    if (this.audioSystem) {
      this.audioSystem.updateThrustSound(inputState.forward, inputState.boost);
    }

    // 6. Sync Player State to UI EventBus
    this.playerShip.syncState();

    // 7. Update Debug Overlay Stats
    if (this.debugOverlay) {
      this.debugOverlay.update(
        this.playerShip,
        this.worldManager ? this.worldManager.getUniverseManager() : undefined
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
      logger.info('MainGameplayScene: Scene resumed via EventBus.');
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
    if (this.inputSystem) this.inputSystem.destroy();
    if (this.audioSystem) this.audioSystem.destroy();
    if (this.debugOverlay) this.debugOverlay.destroy();
  }
}
