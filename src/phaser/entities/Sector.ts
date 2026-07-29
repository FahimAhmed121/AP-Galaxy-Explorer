import Phaser from 'phaser';
import { UNIVERSE_CONFIG } from '../../core/config';
import { SeededRandom, getSectorSeed } from '../../utils/mathUtils';
import { logger } from '../../core/logger';

export type SectorType = 'STAR_CLUSTER' | 'NEBULA_NEXUS' | 'GALAXY_FIELD' | 'DEEP_VOID';

export class Sector extends Phaser.GameObjects.Container {
  public sectorX: number;
  public sectorY: number;
  public sectorType: SectorType;
  public objectCount: number = 0;

  private graphics: Phaser.GameObjects.Graphics;
  private rng: SeededRandom;

  constructor(scene: Phaser.Scene, sectorX: number, sectorY: number, baseSeed: number) {
    const size = UNIVERSE_CONFIG.sectorSize;
    const worldX = sectorX * size;
    const worldY = sectorY * size;

    super(scene, worldX, worldY);
    this.sectorX = sectorX;
    this.sectorY = sectorY;

    this.scene.add.existing(this);
    this.setDepth(1); // Above base void, below player

    // Seeded Random Generator for this specific sector coordinate
    const seed = getSectorSeed(baseSeed, sectorX, sectorY);
    this.rng = new SeededRandom(seed);

    // Pick Sector Type based on seed
    const typeRoll = this.rng.nextFloat();
    if (typeRoll < 0.25) {
      this.sectorType = 'NEBULA_NEXUS';
    } else if (typeRoll < 0.50) {
      this.sectorType = 'GALAXY_FIELD';
    } else if (typeRoll < 0.80) {
      this.sectorType = 'STAR_CLUSTER';
    } else {
      this.sectorType = 'DEEP_VOID';
    }

    this.graphics = this.scene.add.graphics();
    this.add(this.graphics);

    this.generateSectorContent(size);
    logger.debug(`Sector (${sectorX}, ${sectorY}) [${this.sectorType}] generated with ${this.objectCount} objects.`);
  }

  private generateSectorContent(size: number): void {
    const g = this.graphics;
    g.clear();

    // 1. Sector Grid Line (Subtle coordinate outline for navigation clarity)
    g.lineStyle(1, 0x1e293b, 0.2);
    g.strokeRect(0, 0, size, size);

    // 2. Procedural Nebulae (if present)
    if (this.sectorType === 'NEBULA_NEXUS' || this.rng.nextFloat() < UNIVERSE_CONFIG.nebulaProbability) {
      this.renderNebulaClouds(g, size);
    }

    // 3. Background Galaxies (if present)
    if (this.sectorType === 'GALAXY_FIELD' || this.rng.nextFloat() < UNIVERSE_CONFIG.galaxyProbability) {
      this.renderBackgroundGalaxies(g, size);
    }

    // 4. Starfield Population
    this.renderStarfield(g, size);

    // 5. Ambient Cosmic Dust
    this.renderCosmicDust(g, size);
  }

  private renderNebulaClouds(g: Phaser.GameObjects.Graphics, size: number): void {
    const cloudCount = this.rng.nextInt(2, 4);
    const color = this.rng.pick(UNIVERSE_CONFIG.nebulaColors);

    for (let c = 0; c < cloudCount; c++) {
      const cx = this.rng.nextRange(size * 0.15, size * 0.85);
      const cy = this.rng.nextRange(size * 0.15, size * 0.85);
      const blobCount = this.rng.nextInt(4, 7);

      for (let b = 0; b < blobCount; b++) {
        const bx = cx + this.rng.nextRange(-120, 120);
        const by = cy + this.rng.nextRange(-120, 120);
        const radius = this.rng.nextRange(70, 180);
        const alpha = this.rng.nextRange(0.04, 0.12);

        g.fillStyle(color, alpha);
        g.fillCircle(bx, by, radius);
        this.objectCount++;
      }
    }
  }

  private renderBackgroundGalaxies(g: Phaser.GameObjects.Graphics, size: number): void {
    const galaxyCount = this.sectorType === 'GALAXY_FIELD' ? this.rng.nextInt(2, 3) : 1;

    for (let i = 0; i < galaxyCount; i++) {
      const gx = this.rng.nextRange(100, size - 100);
      const gy = this.rng.nextRange(100, size - 100);
      const styleRoll = this.rng.nextFloat();
      const radius = this.rng.nextRange(25, 55);
      const color = this.rng.pick([0x38bdf8, 0xc084fc, 0xf472b6, 0xfde047]);
      const alpha = this.rng.nextRange(0.25, 0.6);

      g.fillStyle(color, alpha * 0.5);
      g.fillCircle(gx, gy, radius * 0.4); // Bright Core

      if (styleRoll < 0.5) {
        // Spiral Galaxy Arms (Elliptical loops)
        g.lineStyle(1.5, color, alpha);
        g.strokeEllipse(gx, gy, radius * 2, radius * 0.8, this.rng.nextRange(0, Math.PI));
        g.strokeEllipse(gx, gy, radius * 1.4, radius * 0.5, this.rng.nextRange(0, Math.PI));
      } else {
        // Elliptical / Irregular Halo
        g.fillStyle(color, alpha * 0.25);
        g.fillEllipse(gx, gy, radius * 1.8, radius * 1.1);
      }

      this.objectCount++;
    }
  }

  private renderStarfield(g: Phaser.GameObjects.Graphics, size: number): void {
    const densityMultiplier = this.sectorType === 'STAR_CLUSTER' ? 2.2 : (this.sectorType === 'DEEP_VOID' ? 0.4 : 1.0);
    const totalStars = Math.floor(UNIVERSE_CONFIG.starDensity * densityMultiplier);

    for (let i = 0; i < totalStars; i++) {
      const sx = this.rng.nextRange(0, size);
      const sy = this.rng.nextRange(0, size);
      const starRadius = this.rng.nextRange(0.6, 2.2);
      const alpha = this.rng.nextRange(0.25, 0.95);
      const color = this.rng.pick(UNIVERSE_CONFIG.starColors);

      g.fillStyle(color, alpha);
      g.fillCircle(sx, sy, starRadius);

      // Occasional lens flare cross on bright stars
      if (starRadius > 1.8 && this.rng.nextFloat() < 0.25) {
        g.lineStyle(1, color, alpha * 0.6);
        g.lineBetween(sx - 4, sy, sx + 4, sy);
        g.lineBetween(sx, sy - 4, sx, sy + 4);
      }

      this.objectCount++;
    }
  }

  private renderCosmicDust(g: Phaser.GameObjects.Graphics, size: number): void {
    const dustCount = UNIVERSE_CONFIG.cosmicDustDensity;

    for (let i = 0; i < dustCount; i++) {
      const dx = this.rng.nextRange(0, size);
      const dy = this.rng.nextRange(0, size);
      const alpha = this.rng.nextRange(0.1, 0.35);

      g.fillStyle(0x94a3b8, alpha);
      g.fillCircle(dx, dy, 1);
      this.objectCount++;
    }
  }

  public destroy(fromScene?: boolean): void {
    if (this.graphics) {
      this.graphics.destroy();
    }
    super.destroy(fromScene);
  }
}
