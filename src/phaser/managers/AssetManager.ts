import Phaser from 'phaser';
import { logger } from '../../core/logger';

export class AssetManager {
  /**
   * Preload baseline core assets and placeholders safely with error handling.
   */
  public static preloadCoreAssets(scene: Phaser.Scene): void {
    logger.info('AssetManager: Preloading core assets pipeline...');

    // Progress listener
    scene.load.on('progress', (value: number) => {
      logger.debug(`Asset Loading Progress: ${Math.round(value * 100)}%`);
    });

    scene.load.on('loaderror', (fileObj: Phaser.Loader.File) => {
      logger.warn(`Asset failed to load: ${fileObj.key} (${fileObj.url})`);
    });

    scene.load.on('complete', () => {
      logger.info('AssetManager: Preload pipeline completed successfully.');
    });

    // Asset Preload placeholders for future spritesheets, audio, and JSON data
    // Note: Actual assets will be registered here as gameplay assets are added.
  }
}
