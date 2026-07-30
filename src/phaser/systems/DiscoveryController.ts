import Phaser from 'phaser';
import { Galaxy } from '../../core/types';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { PlayerShip } from '../entities/PlayerShip';

export type DiscoveryState =
  | 'IDLE'
  | 'DISCOVERING'
  | 'AURA_PRESENTING'
  | 'READY_FOR_LEARNING'
  | 'FINISHED';

export class DiscoveryController {
  private state: DiscoveryState = 'IDLE';
  private currentTarget: Galaxy | null = null;
  private elapsedTime: number = 0; // seconds in current state
  private totalCinematicTime: number = 0; // total seconds since discovery started

  private originalZoom: number = 1.0;
  private targetZoom: number = 1.65;
  private sceneCamera?: Phaser.Cameras.Scene2D.Camera;

  private handleScanCompleted = (payload: { targetId: string; galaxyData: Galaxy }) => {
    if (this.state !== 'IDLE') return;

    logger.info(`DiscoveryController: Received SCAN_COMPLETED for galaxy [${payload.galaxyData.name}]. Starting Discovery sequence.`);
    this.startDiscoverySequence(payload.galaxyData);
  };

  constructor() {
    logger.info('DiscoveryController: Discovery Controller initialized.');
    this.setupListeners();
  }

  private setupListeners(): void {
    eventBus.on('SCAN_COMPLETED', this.handleScanCompleted);
  }

  public setCamera(camera: Phaser.Cameras.Scene2D.Camera): void {
    this.sceneCamera = camera;
    this.originalZoom = camera.zoom;
  }

  public startDiscoverySequence(galaxy: Galaxy): void {
    this.currentTarget = galaxy;
    this.state = 'DISCOVERING';
    this.elapsedTime = 0;
    this.totalCinematicTime = 0;

    eventBus.emit('DISCOVERY_STARTED', {
      galaxyId: galaxy.id,
      galaxyName: galaxy.name,
      galaxyData: galaxy,
    });
  }

  public update(
    delta: number,
    playerShip: PlayerShip,
    camera: Phaser.Cameras.Scene2D.Camera,
    skipJustPressed: boolean
  ): void {
    const deltaSec = delta / 1000;

    if (this.state === 'IDLE') return;

    this.elapsedTime += deltaSec;
    this.totalCinematicTime += deltaSec;

    // Handle user pressing ESC to skip the cinematic reveal
    if (skipJustPressed && this.state !== 'FINISHED') {
      logger.info('DiscoveryController: Player skipped cinematic reveal sequence via [ESC].');
      this.finishSequence(playerShip, camera);
      return;
    }

    switch (this.state) {
      case 'DISCOVERING':
        // Lock player controls & dampen movement
        playerShip.isControlsLocked = true;

        // Smooth camera zoom & pan toward discovered galaxy center
        if (this.currentTarget) {
          const lerpFactor = Math.min(1.0, deltaSec * 3.0);
          const currentZoom = camera.zoom + (this.targetZoom - camera.zoom) * lerpFactor;
          camera.setZoom(currentZoom);

          // Pan camera slightly toward galaxy position
          const targetCamX = (playerShip.x + this.currentTarget.x) / 2;
          const targetCamY = (playerShip.y + this.currentTarget.y) / 2;
          camera.pan(targetCamX, targetCamY, 200, 'Power2', false);
        }

        // Transition to AURA_PRESENTING after 2.0s
        if (this.elapsedTime >= 2.0) {
          this.state = 'AURA_PRESENTING';
          this.elapsedTime = 0;

          if (this.currentTarget) {
            const auraDialogue = this.generateAuraDialogue(this.currentTarget);
            eventBus.emit('DISCOVERY_OVERLAY_SHOWN', {
              galaxyData: this.currentTarget,
              auraText: auraDialogue,
            });
          }
        }
        break;

      case 'AURA_PRESENTING':
        playerShip.isControlsLocked = true;
        // Hold state until player interacts with AURA dialogue controls (Next/Continue/Skip)
        break;

      case 'READY_FOR_LEARNING':
        playerShip.isControlsLocked = true;
        break;

      case 'FINISHED':
        // Restores state to IDLE
        this.state = 'IDLE';
        this.currentTarget = null;
        break;
    }
  }

  public finishSequence(playerShip: PlayerShip, camera: Phaser.Cameras.Scene2D.Camera): void {
    if (!this.currentTarget) {
      this.state = 'IDLE';
      playerShip.isControlsLocked = false;
      return;
    }

    const galaxyId = this.currentTarget.id;

    // Reset camera zoom & follow target
    camera.setZoom(1.0);
    camera.startFollow(playerShip, true, 0.08, 0.08);

    // Unlock ship controls
    playerShip.isControlsLocked = false;

    this.state = 'FINISHED';
    eventBus.emit('DISCOVERY_FINISHED', { galaxyId });

    logger.info(`DiscoveryController: Cinematic sequence finished for galaxy [${galaxyId}]. Controls restored.`);
  }

  private generateAuraDialogue(galaxy: Galaxy): string {
    const templates = [
      `Discovery confirmed. Target identified as ${galaxy.name}. Spectral classification: ${galaxy.type}. Coordinates saved to NASA Knowledge Archive.`,
      `Signal verified. Galaxy ${galaxy.name} located at distance of ${galaxy.distance}. Astronomical profile compiled.`,
      `Astrophysical scan complete. ${galaxy.name} (${galaxy.type}) in constellation ${galaxy.constellation}. Deep space records updated.`,
    ];

    const idx = Math.abs(galaxy.name.length) % templates.length;
    return templates[idx];
  }

  public getState(): DiscoveryState {
    return this.state;
  }

  public getCurrentTarget(): Galaxy | null {
    return this.currentTarget;
  }

  public destroy(): void {
    eventBus.off('SCAN_COMPLETED', this.handleScanCompleted);
    this.currentTarget = null;
  }
}
