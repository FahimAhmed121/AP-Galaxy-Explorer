import Phaser from 'phaser';
import { PlayerShip } from './PlayerShip';
import { Galaxy } from '../../core/types';
import { eventBus } from '../../core/events';
import { DRONE_CONFIG } from '../../core/constants';
import { audioEngine } from '../../engine/audioEngine';
import { logger } from '../../core/logger';

export type DroneState = 'PATROL' | 'SURVEY' | 'INVESTIGATE' | 'ATTACK' | 'RETURN';

export class AlienSurveyDrone extends Phaser.GameObjects.Container {
  public body!: Phaser.Physics.Arcade.Body;
  public id: string;

  // Drone Vitals
  public health: number = DRONE_CONFIG.MAX_HEALTH;
  public maxHealth: number = DRONE_CONFIG.MAX_HEALTH;
  public droneState: DroneState = 'PATROL';
  public targetGalaxy: Galaxy | null = null;
  public isMarkedForDestruction: boolean = false;

  // AI & Physics constants (Refined for calm, observational scientific probe behavior)
  private detectionRadius: number = 320; // Proximity threshold to trigger investigation
  private attackRadius: number = DRONE_CONFIG.ATTACK_RADIUS;
  private escapeRadius: number = DRONE_CONFIG.ESCAPE_RADIUS;
  private turnSpeed: number = DRONE_CONFIG.TURN_SPEED;

  // Speeds per state (Galaxy / survey target > PlayerShip priority)
  private patrolSpeed: number = 55;      // Calm cruising through deep space
  private surveySpeed: number = 20;      // Gentle, slow orbit around galaxy
  private investigateSpeed: number = 45; // Cautious, slow approach when observing player
  private attackSpeed: number = 145;     // Evasive combat maneuvering
  private returnSpeed: number = 95;      // Return to galaxy survey location

  // State timers & durations (Priority 2: 8–15s survey duration)
  private stateTimer: number = 0;
  private surveyPulseTimer: number = 0;
  private surveyDuration: number = 10000; // Random 8,000–15,000ms
  private patrolDuration: number = 12000; // Random 10,000–16,000ms
  private lastShotTime: number = 0;
  private attackCooldown: number = DRONE_CONFIG.ATTACK_COOLDOWN;
  private hitTimer?: Phaser.Time.TimerEvent;

  // Patrol / Orbit calculations
  private orbitAngle: number = Math.random() * Math.PI * 2;
  private orbitRadius: number = 220;

  // Visual Graphics
  private droneGraphics: Phaser.GameObjects.Graphics;
  private surveyGraphics: Phaser.GameObjects.Graphics;
  private thrusterGraphics: Phaser.GameObjects.Graphics;
  private sensorEye: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, targetGalaxy: Galaxy | null = null) {
    super(scene, x, y);

    this.id = `drone-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.targetGalaxy = targetGalaxy;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // Arcade Physics Setup
    this.body.setCircle(16, -16, -16);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(0.3, 0.3);

    // Setup visual components
    this.droneGraphics = this.scene.add.graphics();
    this.surveyGraphics = this.scene.add.graphics();
    this.thrusterGraphics = this.scene.add.graphics();
    this.sensorEye = this.scene.add.graphics();

    this.add([this.surveyGraphics, this.thrusterGraphics, this.droneGraphics, this.sensorEye]);

    this.drawDroneShape();
    this.setDepth(12);

    logger.info(`AlienSurveyDrone: Spawned [${this.id}] at (${Math.round(x)}, ${Math.round(y)}).`);
  }

  private drawDroneShape(): void {
    const dg = this.droneGraphics;
    dg.clear();

    // 1. Dark Gunmetal / Obsidian Angular Stealth Chassis
    dg.fillStyle(0x020617, 0.95);
    dg.lineStyle(2.5, this.droneState === 'ATTACK' ? 0xef4444 : 0x475569, 1);

    dg.beginPath();
    dg.moveTo(18, 0);     // Sharp nose
    dg.lineTo(6, -14);    // Upper forward winglet
    dg.lineTo(-16, -16);  // Upper stealth tip
    dg.lineTo(-8, 0);     // Rear core inset
    dg.lineTo(-16, 16);   // Lower stealth tip
    dg.lineTo(6, 14);     // Lower forward winglet
    dg.closePath();
    dg.fillPath();
    dg.strokePath();

    // 2. Interior Alien Glyph Lines / Energy Accent
    const accentColor = this.droneState === 'ATTACK' ? 0xf43f5e : 0xef4444;
    dg.lineStyle(1.5, accentColor, 0.85);
    dg.beginPath();
    dg.moveTo(8, 0);
    dg.lineTo(-8, -8);
    dg.moveTo(8, 0);
    dg.lineTo(-8, 8);
    dg.strokePath();

    // 3. Bright Glowing Red Sensor Eye
    this.drawSensorEye(false);
  }

  private drawSensorEye(isHitFlash: boolean): void {
    if (!this.sensorEye || !this.sensorEye.scene) return;
    const eye = this.sensorEye;
    eye.clear();
    if (isHitFlash) {
      eye.fillStyle(0xffffff, 1);
      eye.fillCircle(4, 0, 4.5);
    } else {
      eye.fillStyle(0xef4444, 1);
      eye.fillCircle(4, 0, 3.8);
      eye.fillStyle(0xfff1f2, 0.95);
      eye.fillCircle(5, 0, 1.8);
    }
  }

  public update(
    delta: number,
    playerShip: PlayerShip,
    isTargetGalaxyBeingScanned: boolean = false,
    onFireLaser?: (x: number, y: number, angle: number) => void
  ): void {
    if (!this.active || this.isMarkedForDestruction) return;

    const dt = delta / 1000;
    this.stateTimer += delta;
    this.surveyPulseTimer += delta;

    // Ensure playerShip is a valid entity with x, y coordinates
    if (!playerShip || typeof playerShip !== 'object' || typeof playerShip.x !== 'number' || playerShip.isDead) {
      if (this.droneState === 'ATTACK' || this.droneState === 'INVESTIGATE') {
        this.setDroneState('RETURN');
      }
      if (this.droneState === 'RETURN') this.executeReturnState(dt);
      else if (this.droneState === 'PATROL') this.executePatrolState(dt);
      else if (this.droneState === 'SURVEY') this.executeSurveyState(dt);
      this.updateVisualEffects(dt);
      return;
    }

    const distToPlayer = Math.hypot(playerShip.x - this.x, playerShip.y - this.y);
    const isScanned = typeof isTargetGalaxyBeingScanned === 'boolean' ? isTargetGalaxyBeingScanned : false;

    // FSM Transitions
    this.evaluateStateTransitions(distToPlayer, isScanned);

    // State Execution
    switch (this.droneState) {
      case 'PATROL':
        this.executePatrolState(dt);
        break;

      case 'SURVEY':
        this.executeSurveyState(dt);
        break;

      case 'INVESTIGATE':
        this.executeInvestigateState(dt, playerShip);
        break;

      case 'ATTACK':
        this.executeAttackState(dt, playerShip, onFireLaser);
        break;

      case 'RETURN':
        this.executeReturnState(dt);
        break;
    }

    // Render Thruster and Sensor Glow
    this.updateVisualEffects(dt);
  }

  private evaluateStateTransitions(distToPlayer: number, isTargetGalaxyBeingScanned: boolean): void {
    const prevState = this.droneState;

    // Trigger ATTACK if player begins scanning the drone's target galaxy while close
    if (isTargetGalaxyBeingScanned && distToPlayer < 400) {
      if (this.droneState !== 'ATTACK') {
        this.setDroneState('ATTACK');
      }
      return;
    }

    switch (this.droneState) {
      case 'PATROL':
        if (distToPlayer < this.detectionRadius) {
          this.setDroneState('INVESTIGATE');
        } else if (this.stateTimer > this.patrolDuration) {
          this.setDroneState('SURVEY');
        }
        break;

      case 'SURVEY':
        if (distToPlayer < this.detectionRadius) {
          this.setDroneState('INVESTIGATE');
        } else if (this.stateTimer > this.surveyDuration) {
          this.setDroneState('PATROL');
        }
        break;

      case 'INVESTIGATE':
        if (distToPlayer > 450) {
          this.setDroneState('RETURN');
        } else if (distToPlayer < 160 && this.stateTimer > 4000) {
          // Sustained proximity (< 160px) triggers defensive reaction
          this.setDroneState('ATTACK');
        } else if (this.stateTimer > 6000) {
          // Finished observation window without threat; return to galaxy survey
          this.setDroneState('RETURN');
        }
        break;

      case 'ATTACK':
        if (distToPlayer > this.escapeRadius) {
          this.setDroneState('RETURN');
        }
        break;

      case 'RETURN':
        if (this.targetGalaxy) {
          const distToGalaxy = Math.hypot(this.targetGalaxy.x - this.x, this.targetGalaxy.y - this.y);
          if (distToGalaxy < 250) {
            this.setDroneState('PATROL');
          }
        } else if (this.stateTimer > 7000) {
          this.setDroneState('PATROL');
        }
        break;
    }

    if (prevState !== this.droneState) {
      eventBus.emit('DRONE_STATE_CHANGED', { droneId: this.id, state: this.droneState });
    }
  }

  public setDroneState(newState: DroneState): void {
    this.droneState = newState;
    this.stateTimer = 0;

    if (this.surveyGraphics) {
      this.surveyGraphics.clear();
    }

    // Randomize durations for deep-space pacing (8–15s survey)
    if (newState === 'SURVEY') {
      this.surveyDuration = 8000 + Math.random() * 7000;
    } else if (newState === 'PATROL') {
      this.patrolDuration = 10000 + Math.random() * 6000;
    }

    // Redraw chassis if entering ATTACK to highlight hostile threat
    this.drawDroneShape();

    if (newState === 'INVESTIGATE') {
      audioEngine.playSound('aura-speak');
    } else if (newState === 'ATTACK') {
      eventBus.emit('DRONE_ATTACKED', { droneId: this.id });
      audioEngine.playSound('scan-cancel');
    }
  }

  private executePatrolState(dt: number): void {
    // Smooth orbit around target galaxy or spawn location
    const anchorX = this.targetGalaxy ? this.targetGalaxy.x : this.x;
    const anchorY = this.targetGalaxy ? this.targetGalaxy.y : this.y;

    this.orbitAngle += 0.25 * dt;
    const targetX = anchorX + Math.cos(this.orbitAngle) * this.orbitRadius;
    const targetY = anchorY + Math.sin(this.orbitAngle) * this.orbitRadius;

    this.moveTowards(targetX, targetY, this.patrolSpeed, dt);
  }

  private executeSurveyState(dt: number): void {
    // Dampen movement to near stop while conducting survey scan
    if (this.body && this.body.enable && this.body.velocity) {
      this.body.velocity.x *= 0.92;
      this.body.velocity.y *= 0.92;
    }

    const sg = this.surveyGraphics;
    sg.clear();

    // 1. Turn towards target galaxy if present
    if (this.targetGalaxy) {
      const dx = this.targetGalaxy.x - this.x;
      const dy = this.targetGalaxy.y - this.y;
      const targetAngle = Math.atan2(dy, dx);
      const diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation);
      this.rotation += diff * Math.min(1.0, this.turnSpeed * dt * 1.5);

      // Local coordinates pointing to target galaxy
      const localTargetX = dx * Math.cos(-this.rotation) - dy * Math.sin(-this.rotation);
      const localTargetY = dx * Math.sin(-this.rotation) + dy * Math.cos(-this.rotation);

      // 2. Animate High-Intensity Scientific Survey Beam
      const beamAlpha = 0.5 + Math.sin(this.surveyPulseTimer * 0.01) * 0.3;
      const pulseProgress = (this.surveyPulseTimer % 1400) / 1400;

      // Outer cone/beam ray
      sg.fillStyle(0xa855f7, beamAlpha * 0.15);
      sg.beginPath();
      sg.moveTo(12, 0);
      sg.lineTo(localTargetX, localTargetY - 24);
      sg.lineTo(localTargetX, localTargetY + 24);
      sg.closePath();
      sg.fillPath();

      // Core energetic laser line
      sg.lineStyle(2.5, 0x38bdf8, beamAlpha);
      sg.beginPath();
      sg.moveTo(12, 0);
      sg.lineTo(localTargetX, localTargetY);
      sg.strokePath();

      // Scanning wave moving along the beam line
      const waveDist = pulseProgress;
      const waveX = 12 + (localTargetX - 12) * waveDist;
      const waveY = localTargetY * waveDist;
      sg.lineStyle(2, 0xf0abfc, (1 - pulseProgress) * 0.9);
      sg.strokeCircle(waveX, waveY, 8 + pulseProgress * 16);
    }

    // 3. Local drone sensor field pulse
    const pulseProgress = (this.surveyPulseTimer % 1800) / 1800;
    const pulseRadius = 15 + pulseProgress * 50;
    const pulseAlpha = (1 - pulseProgress) * 0.5;

    sg.lineStyle(1.5, 0xa855f7, pulseAlpha);
    sg.strokeCircle(0, 0, pulseRadius);
  }

  private executeInvestigateState(dt: number, playerShip: PlayerShip): void {
    const dist = Math.hypot(playerShip.x - this.x, playerShip.y - this.y);

    // Cautiously face player
    const dx = playerShip.x - this.x;
    const dy = playerShip.y - this.y;
    const targetAngle = Math.atan2(dy, dx);
    if (!isNaN(targetAngle)) {
      const diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation);
      this.rotation += diff * Math.min(1.0, this.turnSpeed * dt * 0.8);
    }

    // Maintain a respectful observation distance (~220px) from player
    if (dist > 220) {
      this.moveTowards(playerShip.x, playerShip.y, this.investigateSpeed, dt);
    } else {
      // Hover/decelerate at observation distance
      if (this.body && this.body.enable && this.body.velocity) {
        this.body.velocity.x *= 0.90;
        this.body.velocity.y *= 0.90;
      }
    }
  }

  private executeAttackState(dt: number, playerShip: PlayerShip, onFireLaser?: (x: number, y: number, angle: number) => void): void {
    if (!playerShip || typeof playerShip.x !== 'number' || typeof playerShip.y !== 'number') return;

    // Flanking combat movement around player
    const flankAngle = this.rotation + Math.PI / 2.5;
    const flankX = playerShip.x + Math.cos(flankAngle) * 180;
    const flankY = playerShip.y + Math.sin(flankAngle) * 180;

    this.moveTowards(flankX, flankY, this.attackSpeed, dt);

    // Fire plasma projectile periodically
    const now = this.scene && this.scene.time ? this.scene.time.now : Date.now();
    if (now - this.lastShotTime > this.attackCooldown) {
      this.lastShotTime = now;

      const fireAngle = Math.atan2(playerShip.y - this.y, playerShip.x - this.x);
      const startX = this.x + Math.cos(fireAngle) * 20;
      const startY = this.y + Math.sin(fireAngle) * 20;

      if (typeof onFireLaser === 'function') {
        try {
          onFireLaser(startX, startY, fireAngle);
        } catch (err) {
          logger.error('AlienSurveyDrone: Error executing onFireLaser:', err);
        }
      }
      audioEngine.playSound('laser', true, 0.4);
    }
  }

  private executeReturnState(dt: number): void {
    const anchorX = this.targetGalaxy ? this.targetGalaxy.x : this.x;
    const anchorY = this.targetGalaxy ? this.targetGalaxy.y : this.y;

    this.moveTowards(anchorX, anchorY, this.returnSpeed, dt);
  }

  private moveTowards(targetX: number, targetY: number, speed: number, dt: number): void {
    if (isNaN(targetX) || isNaN(targetY) || isNaN(dt) || isNaN(speed)) return;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const targetAngle = Math.atan2(dy, dx);

    if (isNaN(targetAngle)) return;

    // Smooth rotation lerp
    const diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation);
    if (!isNaN(diff)) {
      this.rotation += diff * Math.min(1.0, this.turnSpeed * dt);
    }

    // Apply forward velocity
    const forwardX = Math.cos(this.rotation);
    const forwardY = Math.sin(this.rotation);

    if (this.body && this.body.enable && this.body.velocity) {
      this.body.velocity.x = forwardX * speed;
      this.body.velocity.y = forwardY * speed;
    }
  }

  private updateVisualEffects(dt: number): void {
    // Red Plasma Thruster Trail Glow
    const tg = this.thrusterGraphics;
    if (!tg || !tg.scene) return;
    tg.clear();

    const speed = this.body && this.body.enable && this.body.velocity ? Math.hypot(this.body.velocity.x, this.body.velocity.y) : 0;
    if (speed > 10) {
      const length = Math.min(26, 12 + speed * 0.06);

      tg.fillStyle(0xef4444, 0.85); // Hostile red thruster outer
      tg.beginPath();
      tg.moveTo(-8, -4);
      tg.lineTo(-8 - length, 0);
      tg.lineTo(-8, 4);
      tg.closePath();
      tg.fillPath();

      tg.fillStyle(0xfef2f2, 0.95); // Bright inner core
      tg.beginPath();
      tg.moveTo(-8, -2);
      tg.lineTo(-8 - length * 0.5, 0);
      tg.lineTo(-8, 2);
      tg.closePath();
      tg.fillPath();
    }
  }

  public takeDamage(damage: number): void {
    if (!this.active || this.isMarkedForDestruction) return;

    this.health -= damage;

    if (this.droneState !== 'ATTACK') {
      this.setDroneState('ATTACK');
    }

    // Flash sensor eye white on hit
    this.drawSensorEye(true);

    if (this.hitTimer) {
      this.hitTimer.remove();
      this.hitTimer = undefined;
    }
    if (this.scene && this.scene.time) {
      this.hitTimer = this.scene.time.delayedCall(120, () => {
        if (this.active && !this.isMarkedForDestruction) {
          this.drawSensorEye(false);
        }
      });
    }

    if (this.health <= 0) {
      this.destroyDrone();
    }
  }

  private destroyDrone(): void {
    if (this.isMarkedForDestruction) return;
    this.isMarkedForDestruction = true;

    // Immediately stop physics body to prevent mid-frame collision processing
    if (this.body) {
      this.body.enable = false;
      this.body.setVelocity(0, 0);
    }
    this.setActive(false);
    this.setVisible(false);

    const x = this.x;
    const y = this.y;

    // Create explosion sparks
    for (let i = 0; i < 12; i++) {
      const p = this.scene.add.circle(x, y, 3, 0xef4444, 1);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 160 + 50;

      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed * 0.25,
        y: y + Math.sin(angle) * speed * 0.25,
        alpha: 0,
        scale: 0.1,
        duration: 350,
        onComplete: () => {
          if (p && p.scene) p.destroy();
        },
      });
    }

    audioEngine.playSound('explosion', true, 0.7);

    // Emit event with rewards (25 stardust, 150 XP)
    eventBus.emit('DRONE_DESTROYED', {
      droneId: this.id,
      x,
      y,
      stardust: 25,
      xp: 150,
    });

    // Defer container destruction until after current Arcade Physics iteration finishes
    if (this.scene) {
      this.scene.time.delayedCall(0, () => {
        this.destroy();
      });
    } else {
      this.destroy();
    }
  }

  public destroy(fromScene?: boolean): void {
    if (this.hitTimer) {
      this.hitTimer.remove();
      this.hitTimer = undefined;
    }
    if (this.surveyGraphics && this.surveyGraphics.scene) this.surveyGraphics.clear();
    if (this.thrusterGraphics && this.thrusterGraphics.scene) this.thrusterGraphics.clear();
    if (this.droneGraphics && this.droneGraphics.scene) this.droneGraphics.clear();
    if (this.sensorEye && this.sensorEye.scene) this.sensorEye.clear();

    super.destroy(fromScene);
  }
}
