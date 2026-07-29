import { audioEngine } from '../../engine/audioEngine';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';

export class AudioSystem {
  private isThrustPlaying: boolean = false;
  private lastPulseTime: number = 0;

  private handleScanStart = () => {
    audioEngine.playSound('scan-start');
  };

  private handleScanProgress = () => {
    const now = Date.now();
    if (now - this.lastPulseTime > 650) {
      this.lastPulseTime = now;
      audioEngine.playSound('scan-pulse');
    }
  };

  private handleScanCompleted = () => {
    audioEngine.playSound('scan-complete');
  };

  private handleScanCancelled = () => {
    audioEngine.playSound('scan-cancel');
  };

  constructor() {
    logger.info('AudioSystem: Game Audio System initialized.');
    this.setupListeners();
  }

  private setupListeners(): void {
    eventBus.on('SCAN_STARTED', this.handleScanStart);
    eventBus.on('SCAN_PROGRESS', this.handleScanProgress);
    eventBus.on('SCAN_COMPLETED', this.handleScanCompleted);
    eventBus.on('SCAN_CANCELLED', this.handleScanCancelled);
  }

  public updateThrustSound(isThrusting: boolean, _isBoosting: boolean): void {
    if (isThrusting && !this.isThrustPlaying) {
      this.isThrustPlaying = true;
      audioEngine.playSound('thrust');
    } else if (!isThrusting && this.isThrustPlaying) {
      this.isThrustPlaying = false;
    }
  }

  public playScanPing(): void {
    audioEngine.playSound('warp');
  }

  public playStardustCollect(): void {
    audioEngine.playSound('powerup');
  }

  public playLaser(): void {
    audioEngine.playSound('laser');
  }

  public playExplosion(): void {
    audioEngine.playSound('explosion');
  }

  public destroy(): void {
    eventBus.off('SCAN_STARTED', this.handleScanStart);
    eventBus.off('SCAN_PROGRESS', this.handleScanProgress);
    eventBus.off('SCAN_COMPLETED', this.handleScanCompleted);
    eventBus.off('SCAN_CANCELLED', this.handleScanCancelled);
    this.isThrustPlaying = false;
  }
}
