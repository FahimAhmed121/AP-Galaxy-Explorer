import { Galaxy } from '../../core/types';
import { SCANNER_CONFIG } from '../../core/config';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { GalaxyManager } from '../managers/GalaxyManager';
import { PlayerShip } from '../entities/PlayerShip';

export type ScannerState = 'IDLE' | 'SCANNING' | 'COOLDOWN';

export class ScannerSystem {
  private state: ScannerState = 'IDLE';
  private currentTarget: Galaxy | null = null;
  private elapsedTime: number = 0; // seconds
  private duration: number = SCANNER_CONFIG.scanDuration;
  private cooldownRemaining: number = 0; // seconds
  private nearbyTarget: Galaxy | null = null; // Target currently in scanner range

  constructor() {
    logger.info('ScannerSystem: Production Scanner System initialized.');
  }

  public update(
    playerX: number,
    playerY: number,
    delta: number,
    scanJustPressed: boolean,
    scanRequested: boolean,
    galaxyManager: GalaxyManager,
    playerShip?: PlayerShip
  ): void {
    const deltaSec = delta / 1000;

    // 1. Always evaluate nearest scannable target within scanner radius
    this.nearbyTarget = galaxyManager.getScannableGalaxyNear(
      playerX,
      playerY,
      SCANNER_CONFIG.scanRadius
    );

    // 2. State Machine Update
    switch (this.state) {
      case 'COOLDOWN':
        this.cooldownRemaining -= deltaSec;
        if (this.cooldownRemaining <= 0) {
          this.cooldownRemaining = 0;
          this.state = 'IDLE';
          logger.debug('ScannerSystem: Scanner cooldown completed. Ready.');
        }
        break;

      case 'IDLE':
        // Check if player initiated scanning with E key press
        if (scanJustPressed && this.nearbyTarget) {
          this.startScan(this.nearbyTarget, galaxyManager);
        }
        break;

      case 'SCANNING':
        if (!this.currentTarget) {
          this.cancelScan('NO_TARGET', galaxyManager);
          break;
        }

        // Validate target distance continuously
        const currentDist = Math.hypot(
          this.currentTarget.x - playerX,
          this.currentTarget.y - playerY
        );
        const maxRange = this.currentTarget.discoveryRadius || SCANNER_CONFIG.scanRadius;

        if (currentDist > maxRange) {
          logger.info(
            `ScannerSystem: Target [${this.currentTarget.name}] went out of range (${Math.round(currentDist)}px > ${maxRange}px). Cancelling scan.`
          );
          this.cancelScan('OUT_OF_RANGE', galaxyManager);
          break;
        }

        // Manual cancellation if press E again
        if (scanJustPressed) {
          logger.info(`ScannerSystem: Scan manually aborted by player.`);
          this.cancelScan('USER_CANCELLED', galaxyManager);
          break;
        }

        // Advance scan progress
        this.elapsedTime += deltaSec;
        const progress = Math.min(1.0, this.elapsedTime / this.duration);

        // Update galaxy entity scanning progress
        galaxyManager.setDiscoveryState(this.currentTarget.id, 'SCANNING', progress);

        // Apply subtle ship vibration effect during scan
        if (playerShip && typeof playerShip.applyVibration === 'function') {
          playerShip.applyVibration(SCANNER_CONFIG.shipVibrationIntensity);
        }

        // Emit progress event
        eventBus.emit('SCAN_PROGRESS', {
          targetId: this.currentTarget.id,
          progress,
          elapsed: this.elapsedTime,
          total: this.duration,
        });

        // Check completion
        if (progress >= 1.0) {
          this.completeScan(galaxyManager);
        }
        break;
    }
  }

  private startScan(target: Galaxy, galaxyManager: GalaxyManager): void {
    this.state = 'SCANNING';
    this.currentTarget = target;
    this.elapsedTime = 0;

    galaxyManager.setDiscoveryState(target.id, 'SCANNING', 0);

    logger.info(`ScannerSystem: Scanning initiated on target [${target.name}] (ID: ${target.id}).`);

    eventBus.emit('SCAN_STARTED', {
      targetId: target.id,
      targetName: target.name,
      duration: this.duration,
    });
  }

  public cancelScan(reason: string, galaxyManager: GalaxyManager): void {
    if (this.currentTarget) {
      galaxyManager.setDiscoveryState(this.currentTarget.id, 'UNDISCOVERED', 0);
      eventBus.emit('SCAN_CANCELLED', {
        targetId: this.currentTarget.id,
        reason,
      });
      logger.info(`ScannerSystem: Scan cancelled for [${this.currentTarget.name}]. Reason: ${reason}`);
    }

    this.state = 'COOLDOWN';
    this.cooldownRemaining = SCANNER_CONFIG.cooldownDuration;
    this.currentTarget = null;
    this.elapsedTime = 0;
  }

  private completeScan(galaxyManager: GalaxyManager): void {
    if (!this.currentTarget) return;

    const completedTarget = this.currentTarget;
    galaxyManager.setDiscoveryState(completedTarget.id, 'DISCOVERED', 1.0);

    logger.info(`ScannerSystem: Scan COMPLETED successfully for galaxy [${completedTarget.name}]!`);

    // Emit eventBus payloads
    eventBus.emit('SCAN_COMPLETED', {
      targetId: completedTarget.id,
      galaxyData: completedTarget,
    });

    eventBus.emit('GALAXY_DISCOVERED', {
      galaxyId: completedTarget.id,
      galaxyName: completedTarget.name,
    });

    // Enter cooldown
    this.state = 'COOLDOWN';
    this.cooldownRemaining = SCANNER_CONFIG.cooldownDuration;
    this.currentTarget = null;
    this.elapsedTime = 0;
  }

  // Getters for Debug Overlay & Visual Systems
  public getState(): ScannerState {
    return this.state;
  }

  public getCurrentTarget(): Galaxy | null {
    return this.currentTarget;
  }

  public getNearbyTarget(): Galaxy | null {
    return this.nearbyTarget;
  }

  public getScanProgress(): number {
    if (this.state !== 'SCANNING' || this.duration === 0) return 0;
    return Math.min(1.0, this.elapsedTime / this.duration);
  }

  public getCooldownRemaining(): number {
    return Math.max(0, this.cooldownRemaining);
  }

  public getScanRadius(): number {
    return SCANNER_CONFIG.scanRadius;
  }

  public destroy(): void {
    this.currentTarget = null;
    this.nearbyTarget = null;
  }
}
