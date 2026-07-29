import { audioEngine } from '../../engine/audioEngine';
import { logger } from '../../core/logger';

export class AudioSystem {
  private isThrustPlaying: boolean = false;

  constructor() {
    logger.info('AudioSystem: Game Audio System initialized.');
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
    this.isThrustPlaying = false;
  }
}
