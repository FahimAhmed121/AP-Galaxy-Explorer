import Phaser from 'phaser';
import { GAME_CONFIG } from '../../core/config';
import { logger } from '../../core/logger';

export class WorldManager {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;

  private gridGraphics?: Phaser.GameObjects.Graphics;
  private boundaryGraphics?: Phaser.GameObjects.Graphics;
  private spaceDustParticles?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.width = GAME_CONFIG.world.width;
    this.height = GAME_CONFIG.world.height;

    this.initWorldBounds();
    this.renderDeepSpaceGrid();
    this.createSpaceDust();

    logger.info(`WorldManager: Configured deep space world (${this.width}x${this.height}).`);
  }

  private initWorldBounds(): void {
    this.scene.physics.world.setBounds(0, 0, this.width, this.height);
  }

  private renderDeepSpaceGrid(): void {
    if (this.gridGraphics) {
      this.gridGraphics.destroy();
    }

    const g = this.scene.add.graphics();
    this.gridGraphics = g;
    g.setDepth(0);

    // Deep Canvas Base Fill
    g.fillStyle(0x030308, 1);
    g.fillRect(0, 0, this.width, this.height);

    // Draw Parallax Deep Space Star Clusters
    this.drawStarfield(g);

    // Subtle Coordinate Grid
    const gridSize = GAME_CONFIG.world.gridSize;
    g.lineStyle(1, 0x1e293b, 0.4);

    for (let x = 0; x <= this.width; x += gridSize) {
      g.lineBetween(x, 0, x, this.height);
    }
    for (let y = 0; y <= this.height; y += gridSize) {
      g.lineBetween(0, y, this.width, y);
    }

    // World Boundary Warning Line
    g.lineStyle(4, 0xef4444, 0.5);
    g.strokeRect(0, 0, this.width, this.height);
  }

  private drawStarfield(g: Phaser.GameObjects.Graphics): void {
    // Far layer (dim small stars)
    for (let i = 0; i < 900; i++) {
      const sx = Phaser.Math.Between(0, this.width);
      const sy = Phaser.Math.Between(0, this.height);
      const size = Phaser.Math.FloatBetween(0.5, 1.2);
      const alpha = Phaser.Math.FloatBetween(0.15, 0.5);

      g.fillStyle(0x94a3b8, alpha);
      g.fillCircle(sx, sy, size);
    }

    // Mid layer (bright stars)
    for (let i = 0; i < 350; i++) {
      const sx = Phaser.Math.Between(0, this.width);
      const sy = Phaser.Math.Between(0, this.height);
      const size = Phaser.Math.FloatBetween(1.2, 2.2);
      const alpha = Phaser.Math.FloatBetween(0.4, 0.85);
      const color = Phaser.Math.RND.pick([0x38bdf8, 0xa855f7, 0xfde047, 0xffffff]);

      g.fillStyle(color, alpha);
      g.fillCircle(sx, sy, size);
    }
  }

  private createSpaceDust(): void {
    if (!this.scene.textures.exists('ambient_dust')) {
      const dGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      dGraphics.fillStyle(0x60a5fa, 0.8);
      dGraphics.fillCircle(2, 2, 2);
      dGraphics.generateTexture('ambient_dust', 4, 4);
      dGraphics.destroy();
    }

    this.spaceDustParticles = this.scene.add.particles(0, 0, 'ambient_dust', {
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      },
      scale: { start: 0.6, end: 0.1 },
      alpha: { start: 0.4, end: 0 },
      lifespan: 4000,
      quantity: 2,
      frequency: 200,
    });
    this.spaceDustParticles.setDepth(1);
  }

  public getBounds(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  public destroy(): void {
    if (this.gridGraphics) this.gridGraphics.destroy();
    if (this.boundaryGraphics) this.boundaryGraphics.destroy();
    if (this.spaceDustParticles) this.spaceDustParticles.destroy();
  }
}
