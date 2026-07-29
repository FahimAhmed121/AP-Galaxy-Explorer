import Phaser from 'phaser';
import { UNIVERSE_CONFIG } from '../../core/config';
import { Sector, SectorType } from '../entities/Sector';
import { logger } from '../../core/logger';

export class UniverseManager {
  private scene: Phaser.Scene;
  private seed: number;
  private sectorSize: number;
  private streamingRadius: number;

  private sectorMap: Map<string, Sector> = new Map();
  private currentSectorX: number = NaN;
  private currentSectorY: number = NaN;

  constructor(scene: Phaser.Scene, seed: number = UNIVERSE_CONFIG.seed) {
    this.scene = scene;
    this.seed = seed;
    this.sectorSize = UNIVERSE_CONFIG.sectorSize;
    this.streamingRadius = UNIVERSE_CONFIG.streamingRadius;

    logger.info(`UniverseManager: Initialized with seed [${this.seed}], Sector Size [${this.sectorSize}px].`);
  }

  /**
   * Update universe sector streaming based on player location
   */
  public update(playerX: number, playerY: number): void {
    const secX = Math.floor(playerX / this.sectorSize);
    const secY = Math.floor(playerY / this.sectorSize);

    // Only stream if player has transitioned to a new sector grid coordinate
    if (secX === this.currentSectorX && secY === this.currentSectorY) {
      return;
    }

    this.currentSectorX = secX;
    this.currentSectorY = secY;

    this.streamSectors(secX, secY);
  }

  private streamSectors(targetSecX: number, targetSecY: number): void {
    const neededKeys = new Set<string>();

    // 1. Identify all required sectors within streaming radius
    for (let x = targetSecX - this.streamingRadius; x <= targetSecX + this.streamingRadius; x++) {
      for (let y = targetSecY - this.streamingRadius; y <= targetSecY + this.streamingRadius; y++) {
        const key = `${x}_${y}`;
        neededKeys.add(key);

        if (!this.sectorMap.has(key)) {
          // Generate new sector on demand
          const sector = new Sector(this.scene, x, y, this.seed);
          this.sectorMap.set(key, sector);
        }
      }
    }

    // 2. Unload distant sectors outside radius
    for (const [key, sector] of this.sectorMap.entries()) {
      if (!neededKeys.has(key)) {
        logger.debug(`UniverseManager: Streaming out sector [${key}]`);
        sector.destroy();
        this.sectorMap.delete(key);
      }
    }
  }

  public getCurrentSectorCoords(playerX: number, playerY: number): { x: number; y: number } {
    return {
      x: Math.floor(playerX / this.sectorSize),
      y: Math.floor(playerY / this.sectorSize),
    };
  }

  public getCurrentSectorType(playerX: number, playerY: number): SectorType {
    const coords = this.getCurrentSectorCoords(playerX, playerY);
    const key = `${coords.x}_${coords.y}`;
    const sector = this.sectorMap.get(key);
    return sector ? sector.sectorType : 'DEEP_VOID';
  }

  public getLoadedSectorCount(): number {
    return this.sectorMap.size;
  }

  public getTotalObjectCount(): number {
    let total = 0;
    for (const sector of this.sectorMap.values()) {
      total += sector.objectCount;
    }
    return total;
  }

  public getSeed(): number {
    return this.seed;
  }

  public destroy(): void {
    logger.info('UniverseManager: Unloading all active universe sectors...');
    for (const sector of this.sectorMap.values()) {
      sector.destroy();
    }
    this.sectorMap.clear();
  }
}
