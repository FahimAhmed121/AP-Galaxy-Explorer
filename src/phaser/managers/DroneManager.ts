import Phaser from 'phaser';
import { PlayerShip } from '../entities/PlayerShip';
import { AlienSurveyDrone } from '../entities/AlienSurveyDrone';
import { GalaxyManager } from './GalaxyManager';
import { AsteroidManager } from './AsteroidManager';
import { eventBus } from '../../core/events';
import { useGameStore } from '../../store/useGameStore';
import { DRONE_CONFIG, AURA_DRONE_MESSAGES } from '../../core/constants';
import { logger } from '../../core/logger';

export class DroneManager {
  private scene: Phaser.Scene;
  private playerShip: PlayerShip;

  // Active Drone entity (max 1 active drone at a time)
  private activeDrone: AlienSurveyDrone | null = null;
  private droneGroup: Phaser.Physics.Arcade.Group;
  private droneLaserGroup: Phaser.Physics.Arcade.Group;

  // Spawning & Cooldown Timers
  private lastSpawnCheckTime: number = 0;
  private spawnCooldownUntil: number = 0;

  // Collision Setup Flags
  private hasSetupPlayerLaserOverlap: boolean = false;
  private lastPlayerDroneCollisionTime: number = 0;

  // Interference Tracking
  private isInterferenceActive: boolean = false;
  private hasWarnedAboutDrone: boolean = false;
  private droneTextureKey = 'drone_plasma_tex';

  constructor(scene: Phaser.Scene, playerShip: PlayerShip) {
    this.scene = scene;
    this.playerShip = playerShip;

    const initialNow = this.scene && this.scene.time ? this.scene.time.now : Date.now();
    this.spawnCooldownUntil = initialNow + DRONE_CONFIG.SPAWN_COOLDOWN_MS;

    this.droneGroup = this.scene.physics.add.group({
      allowGravity: false,
    });

    // Create Arcade Physics group for drone lasers
    this.droneLaserGroup = this.scene.physics.add.group({
      allowGravity: false,
    });

    this.createDroneTextures();
    this.setupListeners();
    this.setupPersistentCollisions();

    logger.info('DroneManager: Initialized Alien Survey Drone Manager with fixed physics collision handlers.');
  }

  private createDroneTextures(): void {
    if (!this.scene.textures.exists(this.droneTextureKey)) {
      const g = this.scene.make.graphics({ x: 0, y: 0 });
      // Red Hostile Plasma Texture
      g.fillStyle(0xef4444, 1);
      g.fillCircle(6, 6, 6);
      g.fillStyle(0xfef2f2, 0.95);
      g.fillCircle(6, 6, 3);
      g.generateTexture(this.droneTextureKey, 12, 12);
      g.destroy();
    }
  }

  // Listener references for clean unbinding
  private handleDroneDestroyedRef?: (payload: any) => void;
  private handleResetGameRef?: () => void;
  private handlePlayerDestroyedRef?: () => void;
  private handlePlayerRespawnedRef?: () => void;

  private setupListeners(): void {
    this.handleDroneDestroyedRef = (payload: { droneId: string; x: number; y: number; stardust: number; xp: number }) => {
      logger.info(`DroneManager: Drone destroyed [${payload.droneId}]. Rewarding ${payload.stardust} stardust and ${payload.xp} XP.`);

      // Record in Zustand store
      useGameStore.getState().recordDroneDefeated(payload.stardust, payload.xp);

      // Reset interference and set spawn cooldown
      this.updateInterferenceState(false, 0);
      if (this.activeDrone) {
        this.droneGroup.remove(this.activeDrone);
      }
      this.activeDrone = null;
      this.hasWarnedAboutDrone = false;
      const nowTime = this.scene && this.scene.time ? this.scene.time.now : Date.now();
      this.spawnCooldownUntil = nowTime + DRONE_CONFIG.SPAWN_COOLDOWN_MS;

      // Emit AURA narrative alert
      eventBus.emit('AURA_ALERT', {
        message: 'Alien Survey Drone neutralized. Stardust and telemetry data recovered.',
        severity: 'info',
      });
    };

    this.handleResetGameRef = () => {
      if (this.activeDrone) {
        this.activeDrone.destroy();
        this.activeDrone = null;
      }
      this.droneLaserGroup.clear(true, true);
      this.updateInterferenceState(false, 0);
      this.hasWarnedAboutDrone = false;
      const nowTime = this.scene && this.scene.time ? this.scene.time.now : Date.now();
      this.spawnCooldownUntil = nowTime + 10000;
    };

    this.handlePlayerDestroyedRef = () => {
      this.droneLaserGroup.clear(true, true);
      this.updateInterferenceState(false, 0);
      this.hasWarnedAboutDrone = false;
      if (this.activeDrone) {
        this.activeDrone.setDroneState('RETURN');
      }
      const nowTime = this.scene && this.scene.time ? this.scene.time.now : Date.now();
      this.spawnCooldownUntil = nowTime + 15000;
    };

    this.handlePlayerRespawnedRef = () => {
      if (this.activeDrone) {
        this.activeDrone.destroy();
        this.activeDrone = null;
      }
      this.droneLaserGroup.clear(true, true);
      this.updateInterferenceState(false, 0);
      this.hasWarnedAboutDrone = false;
      const nowTime = this.scene && this.scene.time ? this.scene.time.now : Date.now();
      this.spawnCooldownUntil = nowTime + 15000;
    };

    eventBus.on('DRONE_DESTROYED', this.handleDroneDestroyedRef);
    eventBus.on('RESET_GAME', this.handleResetGameRef);
    eventBus.on('PLAYER_DESTROYED', this.handlePlayerDestroyedRef);
    eventBus.on('PLAYER_RESPAWNED', this.handlePlayerRespawnedRef);
  }

  private setupPersistentCollisions(): void {
    // Registered ONCE during constructor to prevent per-frame physics collider memory leaks
    // A. Drone Plasma Projectiles <-> PlayerShip
    this.scene.physics.add.overlap(
      this.droneLaserGroup,
      this.playerShip,
      (objA, objB) => {
        try {
          if (!objA || !objB) return;

          // Accurately disambiguate parameters regardless of Phaser callback parameter ordering
          let laser: Phaser.Physics.Arcade.Sprite | null = null;
          let ship: PlayerShip | null = null;

          if (objA === this.playerShip) {
            ship = this.playerShip;
            laser = objB as Phaser.Physics.Arcade.Sprite;
          } else if (objB === this.playerShip) {
            ship = this.playerShip;
            laser = objA as Phaser.Physics.Arcade.Sprite;
          } else if (this.droneLaserGroup.contains(objA as Phaser.GameObjects.GameObject)) {
            laser = objA as Phaser.Physics.Arcade.Sprite;
            ship = this.playerShip;
          } else if (this.droneLaserGroup.contains(objB as Phaser.GameObjects.GameObject)) {
            laser = objB as Phaser.Physics.Arcade.Sprite;
            ship = this.playerShip;
          }

          // Safety check: NEVER destroy the PlayerShip inside projectile collision!
          if (!laser || !ship || (laser as unknown) === (ship as unknown)) {
            logger.warn('DroneManager: Overlap callback received non-laser object or player ship reference as projectile.');
            return;
          }
          if (!laser.active || ship.isDead) return;

          const damage = (laser.getData('damage') as number) || DRONE_CONFIG.PLASMA_DAMAGE;

          if (laser.body) {
            laser.body.enable = false;
          }
          laser.destroy();

          if (ship && !ship.isDead) {
            ship.takeDamage(damage);
          }

          if (this.scene && this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.shake(100, 0.005);
          }
        } catch (err) {
          logger.error('DroneManager: Exception in plasma projectile overlap:', err);
        }
      }
    );

    // B. PlayerShip <-> Drone Collision
    this.scene.physics.add.overlap(
      this.playerShip,
      this.droneGroup,
      (objA, objB) => {
        try {
          if (!objA || !objB) return;

          let ship: PlayerShip | null = null;
          let drone: AlienSurveyDrone | null = null;

          if (objA === this.playerShip) {
            ship = this.playerShip;
            drone = objB as unknown as AlienSurveyDrone;
          } else if (objB === this.playerShip) {
            ship = this.playerShip;
            drone = objA as unknown as AlienSurveyDrone;
          } else if (this.droneGroup.contains(objA as Phaser.GameObjects.GameObject)) {
            drone = objA as unknown as AlienSurveyDrone;
            ship = this.playerShip;
          } else if (this.droneGroup.contains(objB as Phaser.GameObjects.GameObject)) {
            drone = objB as unknown as AlienSurveyDrone;
            ship = this.playerShip;
          }

          if (!ship || !drone || (ship as unknown) === (drone as unknown)) return;
          if (!drone.active || drone.isMarkedForDestruction || ship.isDead) return;

          const now = this.scene && this.scene.time ? this.scene.time.now : Date.now();
          if (now - this.lastPlayerDroneCollisionTime < 500) return;
          this.lastPlayerDroneCollisionTime = now;

          if (!ship.isDead) {
            ship.takeDamage(15);
          }
          if (drone.active && !drone.isMarkedForDestruction) {
            drone.takeDamage(15);
          }

          // Gentle physics bounce impulse apart
          const angle = Math.atan2(drone.y - ship.y, drone.x - ship.x);
          if (!isNaN(angle)) {
            if (drone.body && drone.body.enable) {
              drone.body.setVelocity(Math.cos(angle) * 140, Math.sin(angle) * 140);
            }
            if (ship.body && ship.body.enable) {
              ship.body.setVelocity(Math.cos(angle - Math.PI) * 120, Math.sin(angle - Math.PI) * 120);
            }
          }

          if (this.scene && this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.shake(120, 0.005);
          }
        } catch (err) {
          logger.error('DroneManager: Exception in player-drone collision:', err);
        }
      }
    );
  }

  private setupPlayerLaserCollision(asteroidManager: AsteroidManager): void {
    if (this.hasSetupPlayerLaserOverlap) return;

    const playerLaserGroup = asteroidManager.getLaserGroup();
    if (playerLaserGroup) {
      this.hasSetupPlayerLaserOverlap = true;

      // C. Player Laser <-> Drone Group
      this.scene.physics.add.overlap(
        playerLaserGroup,
        this.droneGroup,
        (objA, objB) => {
          try {
            let laser: Phaser.Physics.Arcade.Sprite | null = null;
            let drone: AlienSurveyDrone | null = null;

            if (playerLaserGroup.contains(objA as Phaser.GameObjects.GameObject)) {
              laser = objA as Phaser.Physics.Arcade.Sprite;
              drone = objB as unknown as AlienSurveyDrone;
            } else if (playerLaserGroup.contains(objB as Phaser.GameObjects.GameObject)) {
              laser = objB as Phaser.Physics.Arcade.Sprite;
              drone = objA as unknown as AlienSurveyDrone;
            } else if (this.droneGroup.contains(objA as Phaser.GameObjects.GameObject)) {
              drone = objA as unknown as AlienSurveyDrone;
              laser = objB as Phaser.Physics.Arcade.Sprite;
            } else if (this.droneGroup.contains(objB as Phaser.GameObjects.GameObject)) {
              drone = objB as unknown as AlienSurveyDrone;
              laser = objA as Phaser.Physics.Arcade.Sprite;
            }

            if (!laser || !drone || (laser as unknown) === (drone as unknown) || (laser as unknown) === (this.playerShip as unknown)) return;
            if (!laser.active || !drone.active || drone.isMarkedForDestruction) return;

            const damage = (laser.getData('damage') as number) || 25;

            if (laser.body) laser.body.enable = false;
            laser.destroy();

            if (drone.active && !drone.isMarkedForDestruction) {
              drone.takeDamage(damage);
            }
          } catch (err) {
            logger.error('DroneManager: Exception in player laser overlap with drone:', err);
          }
        }
      );
    }
  }

  public update(delta: number, galaxyManager: GalaxyManager, asteroidManager?: AsteroidManager): void {
    const now = this.scene && this.scene.time ? this.scene.time.now : Date.now();

    if (this.playerShip.isDead) {
      if (this.activeDrone && this.activeDrone.active) {
        if (this.activeDrone.droneState === 'ATTACK' || this.activeDrone.droneState === 'INVESTIGATE') {
          this.activeDrone.setDroneState('RETURN');
        }
      }
      this.updateInterferenceState(false, 0);
      return;
    }

    // Setup player laser overlap once when asteroidManager is available
    if (asteroidManager) {
      this.setupPlayerLaserCollision(asteroidManager);
    }

    // 1. Procedurally Spawn Drone if no active drone exists and cooldown elapsed
    if (!this.activeDrone && now > this.spawnCooldownUntil) {
      if (now - this.lastSpawnCheckTime > 4000) {
        this.lastSpawnCheckTime = now;
        this.evaluateDroneSpawning(galaxyManager);
      }
    }

    // 2. Update Active Drone Logic
    if (this.activeDrone && this.activeDrone.active) {
      const targetGalaxy = this.activeDrone.targetGalaxy;
      const isTargetBeingScanned = targetGalaxy
        ? galaxyManager.getDiscoveryState(targetGalaxy.id) === 'SCANNING'
        : false;

      this.activeDrone.update(
        delta,
        this.playerShip,
        isTargetBeingScanned,
        (x, y, angle) => this.fireDronePlasma(x, y, angle)
      );

      // Check distance to player for Scanner Interference
      const distToPlayer = Math.hypot(this.playerShip.x - this.activeDrone.x, this.playerShip.y - this.activeDrone.y);
      const interferenceRange = DRONE_CONFIG.INTERFERENCE_RANGE;

      if (distToPlayer < interferenceRange) {
        const intensity = 1.0 - distToPlayer / interferenceRange;
        this.updateInterferenceState(true, intensity);

        if (!this.hasWarnedAboutDrone) {
          this.hasWarnedAboutDrone = true;
          eventBus.emit('DRONE_DETECTED', {
            droneId: this.activeDrone.id,
            galaxyName: targetGalaxy ? targetGalaxy.name : undefined,
            x: this.activeDrone.x,
            y: this.activeDrone.y,
          });

          // Pick random message from mystery pool
          const randomMsg = AURA_DRONE_MESSAGES[Math.floor(Math.random() * AURA_DRONE_MESSAGES.length)];
          eventBus.emit('AURA_ALERT', {
            message: randomMsg,
            severity: 'warning',
          });
        }
      } else {
        this.updateInterferenceState(false, 0);
      }
    }

    // 3. Update & Clean up Drone Plasma Projectiles
    this.droneLaserGroup.getChildren().forEach((obj) => {
      const laser = obj as Phaser.Physics.Arcade.Sprite;
      const spawnTime = (laser.getData('spawnTime') as number) || 0;
      if (now - spawnTime > 2200) {
        laser.destroy();
      }
    });
  }

  private evaluateDroneSpawning(galaxyManager: GalaxyManager): void {
    const galaxies = galaxyManager.getAllGalaxies();
    if (galaxies.length === 0) return;

    // Select a galaxy that is strictly OFF-SCREEN (between MIN_SPAWN_DIST and MAX_SPAWN_DIST)
    const eligibleGalaxies = galaxies.filter((g) => {
      const dist = Math.hypot(g.x - this.playerShip.x, g.y - this.playerShip.y);
      return dist > DRONE_CONFIG.MIN_SPAWN_DIST && dist < DRONE_CONFIG.MAX_SPAWN_DIST;
    });

    if (eligibleGalaxies.length === 0) return;

    // SPAWN_CHANCE chance of spawning
    if (Math.random() < DRONE_CONFIG.SPAWN_CHANCE) {
      const targetGalaxy = eligibleGalaxies[Math.floor(Math.random() * eligibleGalaxies.length)];
      const spawnAngle = Math.random() * Math.PI * 2;
      const spawnDist = 180 + Math.random() * 120;
      const spawnX = targetGalaxy.x + Math.cos(spawnAngle) * spawnDist;
      const spawnY = targetGalaxy.y + Math.sin(spawnAngle) * spawnDist;

      this.activeDrone = new AlienSurveyDrone(this.scene, spawnX, spawnY, targetGalaxy);
      this.droneGroup.add(this.activeDrone);
      useGameStore.getState().recordDroneEncounter();

      logger.info(`DroneManager: Spawned Alien Drone near distant galaxy [${targetGalaxy.name}].`);
    }
  }

  private fireDronePlasma(x: number, y: number, angle: number): void {
    const laser = this.droneLaserGroup.create(x, y, this.droneTextureKey) as Phaser.Physics.Arcade.Sprite;
    laser.setRotation(angle);
    laser.setDepth(11);

    const speed = DRONE_CONFIG.PLASMA_SPEED;
    laser.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    laser.setData('damage', DRONE_CONFIG.PLASMA_DAMAGE);
    const now = this.scene && this.scene.time ? this.scene.time.now : Date.now();
    laser.setData('spawnTime', now);
  }

  private updateInterferenceState(active: boolean, intensity: number): void {
    if (this.isInterferenceActive !== active) {
      this.isInterferenceActive = active;
      eventBus.emit('SCANNER_INTERFERENCE_CHANGED', {
        active,
        intensity,
        droneId: this.activeDrone ? this.activeDrone.id : undefined,
      });
    }
  }

  public isInterference(): boolean {
    return this.isInterferenceActive;
  }

  public getActiveDrone(): AlienSurveyDrone | null {
    return this.activeDrone;
  }

  public destroy(): void {
    if (this.handleDroneDestroyedRef) eventBus.off('DRONE_DESTROYED', this.handleDroneDestroyedRef);
    if (this.handleResetGameRef) eventBus.off('RESET_GAME', this.handleResetGameRef);
    if (this.handlePlayerDestroyedRef) eventBus.off('PLAYER_DESTROYED', this.handlePlayerDestroyedRef);
    if (this.handlePlayerRespawnedRef) eventBus.off('PLAYER_RESPAWNED', this.handlePlayerRespawnedRef);

    if (this.activeDrone) {
      this.activeDrone.destroy();
      this.activeDrone = null;
    }
    this.droneGroup.destroy(true);
    this.droneLaserGroup.destroy(true);
  }
}
