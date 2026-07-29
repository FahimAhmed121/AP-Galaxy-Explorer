import Phaser from 'phaser';
import { Galaxy } from '../../core/types';
import { GALAXIES } from '../../data/galaxies';
import { GalaxyEntity } from '../entities/GalaxyEntity';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';

export class GalaxyManager {
  private scene: Phaser.Scene;
  private galaxyCatalog: Galaxy[] = [];
  private activeEntities: Map<string, GalaxyEntity> = new Map();
  private proximitySet: Set<string> = new Set(); // Track galaxies player is currently inside discovery radius of
  private discoveryStates: Map<string, 'UNDISCOVERED' | 'SCANNING' | 'DISCOVERED'> = new Map();

  private spawnDistanceThreshold: number = 2200; // Load galaxies within 2200px of player

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.galaxyCatalog = GALAXIES;

    for (const g of this.galaxyCatalog) {
      this.discoveryStates.set(g.id, g.discoveryState || 'UNDISCOVERED');
    }

    logger.info(`GalaxyManager: Initialized with ${this.galaxyCatalog.length} catalog galaxies.`);
  }

  public getDiscoveryState(galaxyId: string): 'UNDISCOVERED' | 'SCANNING' | 'DISCOVERED' {
    return this.discoveryStates.get(galaxyId) || 'UNDISCOVERED';
  }

  public setDiscoveryState(galaxyId: string, state: 'UNDISCOVERED' | 'SCANNING' | 'DISCOVERED', progress: number = 0): void {
    this.discoveryStates.set(galaxyId, state);

    const catalogGalaxy = this.galaxyCatalog.find((g) => g.id === galaxyId);
    if (catalogGalaxy) {
      catalogGalaxy.discoveryState = state;
    }

    const entity = this.activeEntities.get(galaxyId);
    if (entity) {
      entity.setDiscoveryState(state, progress);
    }
  }

  public getScannableGalaxyNear(playerX: number, playerY: number, maxRadius: number): Galaxy | null {
    let nearest: Galaxy | null = null;
    let minDistance = Infinity;

    for (const g of this.galaxyCatalog) {
      const state = this.getDiscoveryState(g.id);
      if (state === 'DISCOVERED') continue; // Skip already discovered galaxies

      const dist = Phaser.Math.Distance.Between(g.x, g.y, playerX, playerY);
      const effectiveScanRadius = g.discoveryRadius || maxRadius;

      if (dist <= effectiveScanRadius && dist < minDistance) {
        minDistance = dist;
        nearest = g;
      }
    }

    return nearest;
  }

  public update(playerX: number, playerY: number, delta: number): void {
    this.streamGalaxyEntities(playerX, playerY);
    this.updateActiveEntities(playerX, playerY, delta);
    this.checkProximityEvents(playerX, playerY);
  }

  /**
   * Dynamically spawn/unload galaxy entities depending on player distance
   */
  private streamGalaxyEntities(playerX: number, playerY: number): void {
    for (const data of this.galaxyCatalog) {
      const dist = Phaser.Math.Distance.Between(data.x, data.y, playerX, playerY);

      if (dist <= this.spawnDistanceThreshold) {
        if (!this.activeEntities.has(data.id)) {
          const currentState = this.getDiscoveryState(data.id);
          const entity = new GalaxyEntity(this.scene, {
            ...data,
            discoveryState: currentState,
          });
          this.activeEntities.set(data.id, entity);
          logger.debug(`GalaxyManager: Spawned galaxy [${data.name}] at (${data.x}, ${data.y})`);
        }
      } else {
        if (this.activeEntities.has(data.id)) {
          const entity = this.activeEntities.get(data.id)!;
          entity.destroy();
          this.activeEntities.delete(data.id);
          logger.debug(`GalaxyManager: Unloaded galaxy [${data.name}]`);
        }
      }
    }
  }

  private updateActiveEntities(playerX: number, playerY: number, delta: number): void {
    for (const entity of this.activeEntities.values()) {
      entity.update(delta, playerX, playerY);
    }
  }

  private checkProximityEvents(playerX: number, playerY: number): void {
    for (const data of this.galaxyCatalog) {
      const dist = Phaser.Math.Distance.Between(data.x, data.y, playerX, playerY);
      const discoveryRadius = data.discoveryRadius || 280;

      if (dist <= discoveryRadius) {
        if (!this.proximitySet.has(data.id)) {
          this.proximitySet.add(data.id);
          logger.info(`GalaxyManager: Player entered discovery radius of galaxy [${data.name}]`);
          eventBus.emit('GALAXY_PROXIMITY_ENTER', {
            galaxyId: data.id,
            galaxyName: data.name,
          });
        }
      } else {
        if (this.proximitySet.has(data.id)) {
          this.proximitySet.delete(data.id);
          logger.info(`GalaxyManager: Player exited discovery radius of galaxy [${data.name}]`);
          eventBus.emit('GALAXY_PROXIMITY_EXIT', {
            galaxyId: data.id,
          });
        }
      }
    }
  }

  public getNearestGalaxy(playerX: number, playerY: number): { galaxy: Galaxy; distance: number } | null {
    if (this.galaxyCatalog.length === 0) return null;

    let nearest: Galaxy | null = null;
    let minDistance = Infinity;

    for (const g of this.galaxyCatalog) {
      const dist = Math.round(Phaser.Math.Distance.Between(g.x, g.y, playerX, playerY));
      if (dist < minDistance) {
        minDistance = dist;
        nearest = g;
      }
    }

    return nearest ? { galaxy: nearest, distance: minDistance } : null;
  }

  public getActiveGalaxyCount(): number {
    return this.activeEntities.size;
  }

  public getLoadedGalaxyIds(): string[] {
    return Array.from(this.activeEntities.keys());
  }

  public getAllGalaxies(): Galaxy[] {
    return this.galaxyCatalog;
  }

  public getMinimapData(): { id: string; name: string; x: number; y: number; color: string; iconStyle: string }[] {
    return this.galaxyCatalog.map((g) => ({
      id: g.id,
      name: g.name,
      x: g.x,
      y: g.y,
      color: g.visualColor,
      iconStyle: g.iconStyle,
    }));
  }

  public destroy(): void {
    logger.info('GalaxyManager: Unloading all galaxy entities...');
    for (const entity of this.activeEntities.values()) {
      entity.destroy();
    }
    this.activeEntities.clear();
    this.proximitySet.clear();
  }
}
