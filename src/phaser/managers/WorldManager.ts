import Phaser from 'phaser';
import { GAME_CONFIG } from '../../core/config';
import { UniverseManager } from './UniverseManager';
import { GalaxyManager } from './GalaxyManager';
import { logger } from '../../core/logger';

export class WorldManager {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;

  private universeManager: UniverseManager;
  private galaxyManager: GalaxyManager;
  private boundaryGraphics?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.width = GAME_CONFIG.world.width;
    this.height = GAME_CONFIG.world.height;

    this.initWorldBounds();
    this.universeManager = new UniverseManager(scene);
    this.galaxyManager = new GalaxyManager(scene);
    this.renderWorldBoundaries();

    logger.info(`WorldManager: Configured universe world bounds (${this.width}x${this.height}) and GalaxyManager.`);
  }

  private initWorldBounds(): void {
    this.scene.physics.world.setBounds(0, 0, this.width, this.height);
  }

  private renderWorldBoundaries(): void {
    if (this.boundaryGraphics) {
      this.boundaryGraphics.destroy();
    }

    const g = this.scene.add.graphics();
    this.boundaryGraphics = g;
    g.setDepth(2);

    // Red Outer World Containment Barrier
    g.lineStyle(4, 0xef4444, 0.6);
    g.strokeRect(0, 0, this.width, this.height);
  }

  public update(playerX: number, playerY: number, delta: number): void {
    this.universeManager.update(playerX, playerY);
    this.galaxyManager.update(playerX, playerY, delta);
  }

  public getUniverseManager(): UniverseManager {
    return this.universeManager;
  }

  public getGalaxyManager(): GalaxyManager {
    return this.galaxyManager;
  }

  public getBounds(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  public destroy(): void {
    if (this.boundaryGraphics) this.boundaryGraphics.destroy();
    this.universeManager.destroy();
    this.galaxyManager.destroy();
  }
}
