import Phaser from 'phaser';
import { PlayerShip } from '../entities/PlayerShip';
import { GAME_CONFIG } from '../../core/config';
import { eventBus } from '../../core/events';
import { audioEngine } from '../../engine/audioEngine';
import { logger } from '../../core/logger';
import { useGameStore } from '../../store/useGameStore';

export interface AsteroidData {
  id: string;
  type: 'large' | 'medium' | 'small';
  radius: number;
  health: number;
  maxHealth: number;
  points: number;
}

export interface StardustData {
  id: string;
  value: number;
  size: number;
}

export class AsteroidManager {
  private scene: Phaser.Scene;
  private playerShip: PlayerShip;

  // Groups
  private asteroidGroup: Phaser.Physics.Arcade.Group;
  private laserGroup: Phaser.Physics.Arcade.Group;
  private stardustGroup: Phaser.Physics.Arcade.Group;

  // Visual Graphics & Textures
  private laserTextureKey = 'laser_beam_tex';
  private stardustTextureKey = 'stardust_orb_tex';

  private lastShotTime: number = 0;

  constructor(scene: Phaser.Scene, playerShip: PlayerShip) {
    this.scene = scene;
    this.playerShip = playerShip;

    // Create Arcade Physics Groups
    this.asteroidGroup = this.scene.physics.add.group({
      bounceX: 0.8,
      bounceY: 0.8,
      collideWorldBounds: true,
    });

    this.laserGroup = this.scene.physics.add.group({
      allowGravity: false,
    });

    this.stardustGroup = this.scene.physics.add.group({
      allowGravity: false,
    });

    this.createProceduralTextures();
    this.initAsteroidField();
    this.setupCollisions();

    logger.info('AsteroidManager: Initialized procedural asteroid field, laser systems, and stardust pools.');
  }

  private createProceduralTextures(): void {
    // 1. Create Laser Beam Texture
    if (!this.scene.textures.exists(this.laserTextureKey)) {
      const g = this.scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x38bdf8, 1);
      g.fillRoundedRect(0, 0, 16, 4, 2);
      g.fillStyle(0xffffff, 0.9);
      g.fillRoundedRect(2, 1, 12, 2, 1);
      g.generateTexture(this.laserTextureKey, 16, 4);
      g.destroy();
    }

    // 2. Create Stardust Orb Texture
    if (!this.scene.textures.exists(this.stardustTextureKey)) {
      const g = this.scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xf59e0b, 1);
      g.fillCircle(6, 6, 6);
      g.fillStyle(0xfef08a, 0.9);
      g.fillCircle(6, 6, 3);
      g.generateTexture(this.stardustTextureKey, 12, 12);
      g.destroy();
    }

    // 3. Create Asteroid Textures (Large, Medium, Small)
    ['large', 'medium', 'small'].forEach((type) => {
      const key = `asteroid_${type}_tex`;
      if (!this.scene.textures.exists(key)) {
        const radius = type === 'large' ? 58 : type === 'medium' ? 38 : 22;
        const size = radius * 2 + 6;
        const g = this.scene.make.graphics({ x: 0, y: 0 });

        // Outer Dark Slate Body
        g.fillStyle(0x334155, 1);
        g.lineStyle(2.5, 0x64748b, 1);

        // Draw rough cratered polygon
        const pointsCount = type === 'large' ? 12 : type === 'medium' ? 9 : 7;
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < pointsCount; i++) {
          const angle = (i / pointsCount) * Math.PI * 2;
          const variance = radius * (0.85 + Math.random() * 0.3);
          points.push({
            x: radius + 3 + Math.cos(angle) * variance,
            y: radius + 3 + Math.sin(angle) * variance,
          });
        }

        g.beginPath();
        g.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          g.lineTo(points[i].x, points[i].y);
        }
        g.closePath();
        g.fillPath();
        g.strokePath();

        // Add internal crater details
        g.fillStyle(0x1e293b, 0.7);
        g.fillCircle(radius * 0.7, radius * 0.7, radius * 0.28);
        if (type !== 'small') {
          g.fillCircle(radius * 1.3, radius * 1.2, radius * 0.22);
          g.fillCircle(radius * 0.6, radius * 1.4, radius * 0.18);
        }

        g.generateTexture(key, size, size);
        g.destroy();
      }
    });
  }

  private initAsteroidField(): void {
    const worldW = GAME_CONFIG.world.width;
    const worldH = GAME_CONFIG.world.height;

    // Create 7 organic asteroid field clusters scattered across deep space
    const clusterCount = 7;
    for (let c = 0; c < clusterCount; c++) {
      let clusterX = 400 + Math.random() * (worldW - 800);
      let clusterY = 400 + Math.random() * (worldH - 800);

      // Keep initial safe zone around player ship
      while (Math.hypot(clusterX - this.playerShip.x, clusterY - this.playerShip.y) < 750) {
        clusterX = 400 + Math.random() * (worldW - 800);
        clusterY = 400 + Math.random() * (worldH - 800);
      }

      // Cluster core: 1-2 Large Asteroids
      const largeCount = 1 + (Math.random() > 0.5 ? 1 : 0);
      for (let l = 0; l < largeCount; l++) {
        const x = clusterX + (Math.random() - 0.5) * 160;
        const y = clusterY + (Math.random() - 0.5) * 160;
        this.spawnAsteroid(x, y, 'large');
      }

      // Cluster body: 2-4 Medium Asteroids
      const medCount = 2 + Math.floor(Math.random() * 3);
      for (let m = 0; m < medCount; m++) {
        const x = clusterX + (Math.random() - 0.5) * 280;
        const y = clusterY + (Math.random() - 0.5) * 280;
        this.spawnAsteroid(x, y, 'medium');
      }

      // Cluster fringe: 4-7 Small debris fragments
      const smallCount = 4 + Math.floor(Math.random() * 4);
      for (let s = 0; s < smallCount; s++) {
        const x = clusterX + (Math.random() - 0.5) * 380;
        const y = clusterY + (Math.random() - 0.5) * 380;
        this.spawnAsteroid(x, y, 'small');
      }
    }
  }

  public spawnAsteroid(
    x: number,
    y: number,
    type: 'large' | 'medium' | 'small',
    velX?: number,
    velY?: number
  ): Phaser.Physics.Arcade.Sprite {
    const radius = type === 'large' ? 58 : type === 'medium' ? 38 : 22;
    const key = `asteroid_${type}_tex`;

    const asteroid = this.asteroidGroup.create(x, y, key) as Phaser.Physics.Arcade.Sprite;
    asteroid.setCircle(radius, (asteroid.width - radius * 2) / 2, (asteroid.height - radius * 2) / 2);

    // Natural drifting speeds (Large moves slowest - heavy, smooth deep space motion)
    const maxSpd = type === 'large' ? 12 : type === 'medium' ? 22 : 35;
    const vx = velX !== undefined ? velX : (Math.random() - 0.5) * maxSpd * 2;
    const vy = velY !== undefined ? velY : (Math.random() - 0.5) * maxSpd * 2;
    asteroid.setVelocity(vx, vy);
    asteroid.setAngularVelocity((Math.random() - 0.5) * 10);

    const health = type === 'large' ? 150 : type === 'medium' ? 80 : 35;
    const points = type === 'large' ? 120 : type === 'medium' ? 60 : 30;

    asteroid.setData('asteroidData', {
      id: `ast-${Date.now()}-${Math.random()}`,
      type,
      radius,
      health,
      maxHealth: health,
      points,
    } as AsteroidData);

    return asteroid;
  }

  public spawnStardust(x: number, y: number, value: number = 5): Phaser.Physics.Arcade.Sprite {
    const dust = this.stardustGroup.create(x, y, this.stardustTextureKey) as Phaser.Physics.Arcade.Sprite;
    dust.setCircle(6);
    dust.setVelocity((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
    dust.setDrag(0.96, 0.96);
    dust.setDepth(5);

    dust.setData('stardustData', {
      id: `dust-${Date.now()}-${Math.random()}`,
      value,
      size: 6,
    } as StardustData);

    return dust;
  }

  public fireLaser(soundEnabled: boolean = true, sfxVolume: number = 0.5): void {
    const now = this.scene.time.now;
    const weaponLevel = this.playerShip.weaponUpgrade || 1;
    const cooldown = Math.max(120, 320 - (weaponLevel - 1) * 45);

    if (now - this.lastShotTime < cooldown) return;

    // Check Plasma Energy requirement
    const energyCost = 6;
    if (this.playerShip.energy < energyCost) {
      return; // Not enough plasma energy
    }

    this.lastShotTime = now;

    // Consume Plasma Energy
    this.playerShip.energy = Math.max(0, this.playerShip.energy - energyCost);
    this.playerShip.syncState();

    // Spawn laser beam from ship nose
    const offset = 26;
    const angle = this.playerShip.rotation;
    const startX = this.playerShip.x + Math.cos(angle) * offset;
    const startY = this.playerShip.y + Math.sin(angle) * offset;

    const laser = this.laserGroup.create(startX, startY, this.laserTextureKey) as Phaser.Physics.Arcade.Sprite;
    laser.setRotation(angle);
    laser.setDepth(8);

    const laserSpeed = 850 + weaponLevel * 60;
    laser.setVelocity(Math.cos(angle) * laserSpeed, Math.sin(angle) * laserSpeed);

    const damage = 25 + weaponLevel * 12;
    laser.setData('damage', damage);
    laser.setData('spawnTime', now);

    audioEngine.playSound('laser', soundEnabled, sfxVolume * 0.6);
  }

  private setupCollisions(): void {
    // 1. Laser <-> Asteroid Overlap
    this.scene.physics.add.overlap(
      this.laserGroup,
      this.asteroidGroup,
      (laserObj, asteroidObj) => {
        const laser = laserObj as Phaser.Physics.Arcade.Sprite;
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Sprite;

        const data = asteroid.getData('asteroidData') as AsteroidData;
        const damage = (laser.getData('damage') as number) || 25;

        // Destroy laser
        laser.destroy();

        if (!data) return;

        data.health -= damage;

        // Spark particles
        this.createHitSparks(laser.x, laser.y);

        if (data.health <= 0) {
          this.destroyAsteroid(asteroid, data);
        } else {
          asteroid.setData('asteroidData', data);
        }
      }
    );

    // 2. Ship <-> Asteroid Overlap (Durability & Collision Mechanics)
    this.scene.physics.add.overlap(
      this.playerShip,
      this.asteroidGroup,
      (_, asteroidObj) => {
        const asteroid = asteroidObj as Phaser.Physics.Arcade.Sprite;
        const data = asteroid.getData('asteroidData') as AsteroidData;

        if (!data) return;

        // Impact damage to ship
        const shipDmg = data.type === 'large' ? 40 : data.type === 'medium' ? 25 : 15;
        this.playerShip.takeDamage(shipDmg);

        // Asteroid takes collision damage (does not instant-die unless health reaches 0)
        const astDmg = 40;
        data.health -= astDmg;

        // Push/bounce asteroid slightly away from ship
        const bounceAngle = Math.atan2(asteroid.y - this.playerShip.y, asteroid.x - this.playerShip.x);
        asteroid.setVelocity(Math.cos(bounceAngle) * 90, Math.sin(bounceAngle) * 90);

        // Screen shake
        this.scene.cameras.main.shake(150, 0.008);
        audioEngine.playSound('impact', true, 0.6);

        if (data.health <= 0) {
          this.destroyAsteroid(asteroid, data);
        } else {
          asteroid.setData('asteroidData', data);
        }
      }
    );

    // 3. Ship <-> Stardust Overlap
    this.scene.physics.add.overlap(
      this.playerShip,
      this.stardustGroup,
      (_, dustObj) => {
        const dust = dustObj as Phaser.Physics.Arcade.Sprite;
        const data = dust.getData('stardustData') as StardustData;
        const val = data ? data.value : 5;

        dust.destroy();

        this.playerShip.collectStardust(val);
        audioEngine.playSound('powerup', true, 0.4);
      }
    );
  }

  private destroyAsteroid(asteroid: Phaser.Physics.Arcade.Sprite, data: AsteroidData): void {
    const x = asteroid.x;
    const y = asteroid.y;
    const type = data.type;

    asteroid.destroy();

    audioEngine.playSound('explosion', true, 0.5);
    this.playerShip.addScore(data.points);

    // Spawn Stardust (Large yields 3 orbs, Medium 2 orbs, Small 1 orb @ 5 stardust each)
    const dustCount = type === 'large' ? 3 : type === 'medium' ? 2 : 1;
    for (let i = 0; i < dustCount; i++) {
      this.spawnStardust(x + (Math.random() - 0.5) * data.radius * 0.6, y + (Math.random() - 0.5) * data.radius * 0.6, 5);
    }

    // Split larger asteroids with gentle natural drift physics
    if (type === 'large') {
      for (let s = 0; s < 2; s++) {
        const vx = (Math.random() - 0.5) * 45;
        const vy = (Math.random() - 0.5) * 45;
        this.spawnAsteroid(x, y, 'medium', vx, vy);
      }
    } else if (type === 'medium') {
      for (let s = 0; s < 2; s++) {
        const vx = (Math.random() - 0.5) * 60;
        const vy = (Math.random() - 0.5) * 60;
        this.spawnAsteroid(x, y, 'small', vx, vy);
      }
    }
  }

  private createHitSparks(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      const particle = this.scene.add.circle(x, y, 2, 0x38bdf8, 1);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 120 + 40;

      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed * 0.2,
        y: y + Math.sin(angle) * speed * 0.2,
        alpha: 0,
        scale: 0.2,
        duration: 250,
        onComplete: () => particle.destroy(),
      });
    }
  }

  public update(delta: number): void {
    const now = this.scene.time.now;

    // Clean up old laser beams
    this.laserGroup.getChildren().forEach((obj) => {
      const laser = obj as Phaser.Physics.Arcade.Sprite;
      const spawnTime = (laser.getData('spawnTime') as number) || 0;
      if (now - spawnTime > 1800) {
        laser.destroy();
      }
    });

    // Magnetic attraction for Stardust towards PlayerShip
    const magnetLevel = this.playerShip.magnetUpgrade || 1;
    const magnetPerkBonus = useGameStore.getState().getActivePerkBonus('MAGNET_RANGE');
    const magnetRange = (120 + magnetLevel * 50) * (1 + magnetPerkBonus);
    const pullSpeed = (300 + magnetLevel * 40) * (1 + magnetPerkBonus * 0.5);
    const dt = delta / 1000;

    this.stardustGroup.getChildren().forEach((obj) => {
      const dust = obj as Phaser.Physics.Arcade.Sprite;
      const dist = Math.hypot(this.playerShip.x - dust.x, this.playerShip.y - dust.y);

      if (dist < magnetRange) {
        const angle = Math.atan2(this.playerShip.y - dust.y, this.playerShip.x - dust.x);
        dust.x += Math.cos(angle) * pullSpeed * dt;
        dust.y += Math.sin(angle) * pullSpeed * dt;
      }
    });

    // Replenish asteroids dynamically around active player sector if count is low
    if (this.asteroidGroup.countActive(true) < 30) {
      const spawnAngle = Math.random() * Math.PI * 2;
      const spawnDist = 700 + Math.random() * 400;
      const spawnX = Math.max(100, Math.min(GAME_CONFIG.world.width - 100, this.playerShip.x + Math.cos(spawnAngle) * spawnDist));
      const spawnY = Math.max(100, Math.min(GAME_CONFIG.world.height - 100, this.playerShip.y + Math.sin(spawnAngle) * spawnDist));
      const type = Math.random() > 0.6 ? 'large' : Math.random() > 0.3 ? 'medium' : 'small';
      this.spawnAsteroid(spawnX, spawnY, type);
    }
  }

  public destroy(): void {
    this.asteroidGroup.destroy(true);
    this.laserGroup.destroy(true);
    this.stardustGroup.destroy(true);
  }
}
