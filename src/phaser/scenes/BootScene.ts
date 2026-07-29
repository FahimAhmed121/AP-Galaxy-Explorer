import Phaser from 'phaser';
import { AssetManager } from '../managers/AssetManager';
import { logger } from '../../core/logger';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    try {
      logger.info('BootScene: Initializing bootstrap asset loader...');
      AssetManager.preloadCoreAssets(this);
    } catch (error) {
      logger.error('BootScene: Asset preloading failed', error);
    }
  }

  public create(): void {
    logger.info('BootScene: Bootstrap completed. Launching MainGameplayScene...');
    this.scene.start('MainGameplayScene');
  }
}
