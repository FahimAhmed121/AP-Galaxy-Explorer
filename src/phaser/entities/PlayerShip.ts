import Phaser from 'phaser';
import { GAME_CONFIG } from '../../core/config';
import { InputState } from '../systems/InputSystem';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { useGameStore } from '../../store/useGameStore';
import { SHIP_SKINS, THRUSTER_FX } from '../../data/progressionData';

export class PlayerShip extends Phaser.GameObjects.Container {
  public body!: Phaser.Physics.Arcade.Body;

  // Ship Stats
  public health: number = 100;
  public maxHealth: number = 100;
  public shield: number = 100;
  public maxShield: number = 100;
  public energy: number = 100;
  public maxEnergy: number = 100;
  public stardust: number = 0;
  public score: number = 0;

  // Upgrade Levels
  public speedUpgrade: number = 1;
  public shieldUpgrade: number = 1;
  public weaponUpgrade: number = 1;
  public magnetUpgrade: number = 1;

  // Active Cosmetic IDs
  private currentSkinId: string = 'skin_standard_cobalt';
  private currentThrusterId: string = 'thruster_plasma_blue';

  // Visual Components
  private shipGraphics: Phaser.GameObjects.Graphics;
  private thrusterGraphics: Phaser.GameObjects.Graphics;
  private particleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  // Physics Control Variables (Refined Heavy Exploration Spacecraft Feel)
  private turnSpeed: number = 3.2;
  private accelerationRate: number = 220;
  private maxSpeed: number = 320;
  private dragCoefficient: number = 0.988; // Smooth, heavy inertia drift

  private isThrusting: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // Setup Arcade Physics Body
    this.body.setCircle(22, -22, -22);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(0.2, 0.2);

    // Render Vector Graphics Ship Body
    this.shipGraphics = this.scene.add.graphics();
    this.thrusterGraphics = this.scene.add.graphics();
    this.add([this.thrusterGraphics, this.shipGraphics]);

    this.loadEquippedCosmetics();
    this.drawShipShape();
    this.createThrusterParticles();
    this.setupEventListeners();

    logger.info(`PlayerShip: Spawned at (${x}, ${y}) with Arcade Physics body.`);
  }

  private loadEquippedCosmetics(): void {
    const profile = useGameStore.getState().profile;
    if (profile && profile.equippedCosmetics) {
      this.currentSkinId = profile.equippedCosmetics.shipSkin || 'skin_standard_cobalt';
      this.currentThrusterId = profile.equippedCosmetics.thrusterFx || 'thruster_plasma_blue';
    }
  }

  private setupEventListeners(): void {
    const handleUpdate = (updatedShip: any) => {
      if (!updatedShip) return;
      this.applyShipState(updatedShip);
    };

    const handleCosmeticsChanged = (payload: any) => {
      if (payload && payload.equippedCosmetics) {
        this.currentSkinId = payload.equippedCosmetics.shipSkin || 'skin_standard_cobalt';
        this.currentThrusterId = payload.equippedCosmetics.thrusterFx || 'thruster_plasma_blue';
        this.drawShipShape();
      }
    };

    const handleResetGame = () => {
      this.setPosition(GAME_CONFIG.world.width / 2, GAME_CONFIG.world.height / 2 - 800);
      if (this.body) {
        this.body.setVelocity(0, 0);
      }
      this.health = 100;
      this.maxHealth = 100;
      this.shield = 100;
      this.maxShield = 100;
      this.energy = 100;
      this.maxEnergy = 100;
      this.stardust = 0;
      this.score = 0;
      this.speedUpgrade = 1;
      this.shieldUpgrade = 1;
      this.weaponUpgrade = 1;
      this.magnetUpgrade = 1;
      this.isControlsLocked = false;
      this.loadEquippedCosmetics();
      this.drawShipShape();
    };

    eventBus.on('UPDATE_SHIP_STATS', handleUpdate);
    eventBus.on('COSMETICS_CHANGED', handleCosmeticsChanged);
    eventBus.on('RESET_GAME', handleResetGame);

    this.once('destroy', () => {
      eventBus.off('UPDATE_SHIP_STATS', handleUpdate);
      eventBus.off('COSMETICS_CHANGED', handleCosmeticsChanged);
      eventBus.off('RESET_GAME', handleResetGame);
    });
  }

  public applyShipState(state: any): void {
    if (state.speedUpgrade !== undefined) this.speedUpgrade = state.speedUpgrade;
    if (state.shieldUpgrade !== undefined) this.shieldUpgrade = state.shieldUpgrade;
    if (state.weaponUpgrade !== undefined) this.weaponUpgrade = state.weaponUpgrade;
    if (state.magnetUpgrade !== undefined) this.magnetUpgrade = state.magnetUpgrade;

    if (state.stardust !== undefined) this.stardust = state.stardust;
    if (state.score !== undefined) this.score = state.score;

    // Apply upgrade effects and passive perks to physics constants
    const speedPerkBonus = useGameStore.getState().getActivePerkBonus('MAX_SPEED');
    const baseMaxSpeed = 320 + (this.speedUpgrade - 1) * 35;
    this.maxSpeed = baseMaxSpeed * (1 + speedPerkBonus);
    this.accelerationRate = (220 + (this.speedUpgrade - 1) * 30) * (1 + speedPerkBonus * 0.5);

    const newMaxShield = 100 + (this.shieldUpgrade - 1) * 25;
    if (newMaxShield !== this.maxShield) {
      this.maxShield = newMaxShield;
      this.shield = Math.min(this.shield, this.maxShield);
    }

    if (state.health !== undefined) this.health = Math.min(state.health, this.maxHealth);
    if (state.shield !== undefined) this.shield = Math.min(state.shield, this.maxShield);

    this.syncState();
  }

  private drawShipShape(): void {
    const g = this.shipGraphics;
    g.clear();

    // Lookup equipped skin colors or fallback
    const skinDef = SHIP_SKINS.find((s) => s.id === this.currentSkinId) || SHIP_SKINS[0];
    const c = skinDef.colors;

    // 1. Outer Glow/Shield Ring
    g.lineStyle(2, c.glow || 0x38bdf8, 0.4);
    g.strokeCircle(0, 0, 26);

    // 2. Main Wings
    g.fillStyle(c.primary, 1);
    g.beginPath();
    g.moveTo(22, 0);       // Nose
    g.lineTo(-18, -20);    // Left Wing Tip
    g.lineTo(-10, -8);     // Left Wing Inset
    g.lineTo(-18, 20);     // Right Wing Tip
    g.closePath();
    g.fillPath();

    // 3. Central Hull
    g.fillStyle(c.secondary, 1);
    g.beginPath();
    g.moveTo(24, 0);
    g.lineTo(-12, -10);
    g.lineTo(-16, 0);
    g.lineTo(-12, 10);
    g.closePath();
    g.fillPath();

    // 4. Cockpit Canopy
    g.fillStyle(c.canopy || 0xf59e0b, 0.95);
    g.beginPath();
    g.moveTo(10, 0);
    g.lineTo(-2, -5);
    g.lineTo(-5, 0);
    g.lineTo(-2, 5);
    g.closePath();
    g.fillPath();

    // 5. Wing Edge Accents
    g.lineStyle(1.5, c.accent, 0.9);
    g.beginPath();
    g.moveTo(22, 0);
    g.lineTo(-18, -20);
    g.moveTo(22, 0);
    g.lineTo(-18, 20);
    g.strokePath();

    // Set container depth
    this.setDepth(10);
  }

  private createThrusterParticles(): void {
    const thrusterDef = THRUSTER_FX.find((t) => t.id === this.currentThrusterId) || THRUSTER_FX[0];
    const pColor = thrusterDef.colors.secondary;

    // Recreate particle texture if missing or needed
    const textureKey = `thruster_particle_${pColor.toString(16)}`;
    if (!this.scene.textures.exists(textureKey)) {
      const pGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      pGraphics.fillStyle(pColor, 1);
      pGraphics.fillCircle(4, 4, 4);
      pGraphics.generateTexture(textureKey, 8, 8);
      pGraphics.destroy();
    }

    if (this.particleEmitter) {
      this.particleEmitter.destroy();
    }

    this.particleEmitter = this.scene.add.particles(0, 0, textureKey, {
      speed: { min: 80, max: 180 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 250,
      blendMode: 'ADD',
      frequency: 30,
      emitting: false,
    });

    this.particleEmitter.setDepth(9);
  }

  public isControlsLocked: boolean = false;

  public applyVibration(intensity: number = 1.5): void {
    const offsetX = (Math.random() - 0.5) * intensity;
    const offsetY = (Math.random() - 0.5) * intensity;
    this.shipGraphics.setPosition(offsetX, offsetY);
  }

  public handleInput(input: InputState, delta: number): void {
    const dt = delta / 1000; // convert to seconds

    // Reset graphics vibration offset when normal
    this.shipGraphics.setPosition(0, 0);

    if (this.isControlsLocked) {
      this.isThrusting = false;
      this.drawThrusterGlow(false, false);
      if (this.particleEmitter) this.particleEmitter.stop();
      // Smoothly dampen ship movement
      this.body.velocity.x *= Math.pow(0.85, dt * 60);
      this.body.velocity.y *= Math.pow(0.85, dt * 60);
      return;
    }

    this.isThrusting = input.forward;

    // Energy handling logic
    const isBoosting = input.boost && this.energy > 5 && input.forward;
    if (isBoosting) {
      this.energy = Math.max(0, this.energy - 18 * dt);
    } else {
      // Regenerate energy over time (~2.5x slower than original)
      this.energy = Math.min(this.maxEnergy, this.energy + 5.5 * dt);
    }

    // 1. Rotation Logic
    if (input.left) {
      this.rotation -= this.turnSpeed * dt;
    } else if (input.right) {
      this.rotation += this.turnSpeed * dt;
    }

    // 2. Thrust & Acceleration
    if (input.forward) {
      const currentBoost = isBoosting ? 1.45 : 1.0;
      const accel = this.accelerationRate * currentBoost;

      // Calculate direction vector based on rotation angle
      const forwardX = Math.cos(this.rotation);
      const forwardY = Math.sin(this.rotation);

      this.body.velocity.x += forwardX * accel * dt;
      this.body.velocity.y += forwardY * accel * dt;

      // Thruster Visual Effect
      this.drawThrusterGlow(true, isBoosting);
      if (this.particleEmitter) {
        const offsetDist = 18;
        const emitterX = this.x - Math.cos(this.rotation) * offsetDist;
        const emitterY = this.y - Math.sin(this.rotation) * offsetDist;

        this.particleEmitter.setPosition(emitterX, emitterY);
        const particleAngle = Phaser.Math.RadToDeg(this.rotation) + 180;
        this.particleEmitter.setAngle(particleAngle);
        this.particleEmitter.emitting = true;
      }
    } else {
      this.drawThrusterGlow(false, false);
      if (this.particleEmitter) {
        this.particleEmitter.emitting = false;
      }
    }

    // 3. Reverse / Braking Damping
    if (input.backward) {
      this.body.velocity.x *= 0.94;
      this.body.velocity.y *= 0.94;
    } else {
      // Natural Space Drag/Damping
      this.body.velocity.x *= this.dragCoefficient;
      this.body.velocity.y *= this.dragCoefficient;
    }

    // 4. Cap Velocity to Max Speed
    const currentSpeed = Math.hypot(this.body.velocity.x, this.body.velocity.y);
    const topSpeed = isBoosting ? this.maxSpeed * 1.4 : this.maxSpeed;
    if (currentSpeed > topSpeed) {
      const scale = topSpeed / currentSpeed;
      this.body.velocity.x *= scale;
      this.body.velocity.y *= scale;
    }

    // Passive Shield Recharge with Perk bonus (~1.3/s base)
    const shieldPerkBonus = useGameStore.getState().getActivePerkBonus('SHIELD_RECHARGE');
    const shieldRechargeRate = 1.3 * (1 + shieldPerkBonus);

    if (this.shield < this.maxShield) {
      this.shield = Math.min(this.maxShield, this.shield + shieldRechargeRate * dt);
    }

    // Sync state continuously
    this.syncState();
  }

  public takeDamage(damage: number): void {
    if (this.shield > 0) {
      const shieldDmg = Math.min(this.shield, damage);
      this.shield -= shieldDmg;
      const leftover = damage - shieldDmg;
      if (leftover > 0) {
        // Reduced direct hull damage taken when shield depleted
        this.health = Math.max(0, this.health - leftover * 0.5);
      }
    } else {
      // Direct hull damage absorbs impact with 50% structural resistance
      this.health = Math.max(0, this.health - damage * 0.5);
    }

    this.syncState();

    if (this.health <= 0) {
      eventBus.emit('PLAYER_DESTROYED', { x: this.x, y: this.y });
    }
  }

  public collectStardust(amount: number): void {
    const stardustMult = useGameStore.getState().getActivePerkBonus('STARDUST_MULT');
    const finalAmount = Math.max(1, Math.round(amount * (1 + stardustMult)));

    this.stardust += finalAmount;
    this.score += 15;
    eventBus.emit('STARDUST_COLLECTED', { amount: finalAmount, total: this.stardust });
    this.syncState();
  }

  public addScore(points: number): void {
    this.score += points;
    this.syncState();
  }

  private drawThrusterGlow(active: boolean, boost: boolean): void {
    const tg = this.thrusterGraphics;
    tg.clear();

    if (!active) return;

    const thrusterDef = THRUSTER_FX.find((t) => t.id === this.currentThrusterId) || THRUSTER_FX[0];

    const length = boost ? 28 : 18;
    const color = boost ? thrusterDef.colors.primary : thrusterDef.colors.primary;
    const coreColor = thrusterDef.colors.accent || 0xffffff;

    tg.fillStyle(color, 0.9);
    tg.beginPath();
    tg.moveTo(-16, -6);
    tg.lineTo(-16 - length, 0);
    tg.lineTo(-16, 6);
    tg.closePath();
    tg.fillPath();

    tg.fillStyle(coreColor, 0.85);
    tg.beginPath();
    tg.moveTo(-16, -3);
    tg.lineTo(-16 - (length * 0.5), 0);
    tg.lineTo(-16, 3);
    tg.closePath();
    tg.fillPath();
  }

  public syncState(): void {
    eventBus.emit('SHIP_POSITION_CHANGED', {
      x: this.x,
      y: this.y,
      angle: this.rotation,
      speed: this.body ? this.body.speed : 0,
    });
    eventBus.emit('SHIP_HEALTH_CHANGED', { current: this.health, max: this.maxHealth });
    eventBus.emit('SHIP_SHIELD_CHANGED', { current: this.shield, max: this.maxShield });
    eventBus.emit('SHIP_ENERGY_CHANGED', { current: this.energy, max: this.maxEnergy });
    eventBus.emit('SHIP_STATS_CHANGED', {
      stardust: this.stardust,
      score: this.score,
      speedUpgrade: this.speedUpgrade,
      shieldUpgrade: this.shieldUpgrade,
      weaponUpgrade: this.weaponUpgrade,
      magnetUpgrade: this.magnetUpgrade,
      health: this.health,
      maxHealth: this.maxHealth,
      shield: this.shield,
      maxShield: this.maxShield,
    });
  }

  public destroy(fromScene?: boolean): void {
    if (this.particleEmitter) {
      this.particleEmitter.destroy();
    }
    super.destroy(fromScene);
  }
}
