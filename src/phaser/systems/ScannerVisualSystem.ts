import Phaser from 'phaser';
import { ScannerSystem } from './ScannerSystem';
import { PlayerShip } from '../entities/PlayerShip';
import { useGameStore } from '../../store/useGameStore';
import { SCANNER_FX } from '../../data/progressionData';

export class ScannerVisualSystem {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private animTimer: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = this.scene.add.graphics();
    this.graphics.setDepth(20); // Above ship and galaxies
  }

  public update(delta: number, scannerSystem: ScannerSystem, ship: PlayerShip): void {
    this.graphics.clear();
    this.animTimer += delta * 0.003;

    const state = scannerSystem.getState();
    const currentTarget = scannerSystem.getCurrentTarget();
    const nearbyTarget = scannerSystem.getNearbyTarget();

    // Query active scanner FX colors
    const profile = useGameStore.getState().profile;
    const fxId = profile?.equippedCosmetics?.scannerFx || 'scanner_cyan_pulse';
    const fxDef = SCANNER_FX.find((f) => f.id === fxId) || SCANNER_FX[0];

    const mainColor = fxDef.colors.primary;
    const arcColor = fxDef.colors.secondary;
    const coreColor = fxDef.colors.accent;

    // 1. Render Target Lock Indicator when nearby a scannable galaxy (IDLE)
    if (state === 'IDLE' && nearbyTarget) {
      this.drawTargetLock(nearbyTarget.x, nearbyTarget.y, nearbyTarget.discoveryRadius || 280, mainColor);
      this.drawScannerBeam(ship.x, ship.y, nearbyTarget.x, nearbyTarget.y, 0.2, mainColor);
    }

    // 2. Render Active Scanning Beam & FX when SCANNING
    if (state === 'SCANNING' && currentTarget) {
      const progress = scannerSystem.getScanProgress();
      this.drawActiveScan(ship.x, ship.y, currentTarget.x, currentTarget.y, progress, mainColor, arcColor, coreColor);
    }
  }

  private drawTargetLock(tx: number, ty: number, radius: number, color: number): void {
    const g = this.graphics;
    const pulseScale = 1.0 + Math.sin(this.animTimer * 4) * 0.05;
    const r = (radius * 0.45) * pulseScale;

    g.lineStyle(2, color, 0.7);

    // 4 Corner Reticle Brackets
    const bracketSize = 16;
    const offsets = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];

    offsets.forEach(([sx, sy]) => {
      const cornerX = tx + sx * r;
      const cornerY = ty + sy * r;

      g.beginPath();
      g.moveTo(cornerX, cornerY - sy * bracketSize);
      g.lineTo(cornerX, cornerY);
      g.lineTo(cornerX - sx * bracketSize, cornerY);
      g.strokePath();
    });
  }

  private drawScannerBeam(
    sx: number,
    sy: number,
    tx: number,
    ty: number,
    alpha: number,
    color: number
  ): void {
    const g = this.graphics;

    // Subtle dashed line connecting ship to target
    g.lineStyle(1.5, color, alpha);
    const dist = Math.hypot(tx - sx, ty - sy);
    const steps = Math.floor(dist / 20);
    const dx = (tx - sx) / steps;
    const dy = (ty - sy) / steps;

    for (let i = 0; i < steps; i += 2) {
      g.beginPath();
      g.moveTo(sx + dx * i, sy + dy * i);
      g.lineTo(sx + dx * (i + 1), sy + dy * (i + 1));
      g.strokePath();
    }
  }

  private drawActiveScan(
    sx: number,
    sy: number,
    tx: number,
    ty: number,
    progress: number,
    mainColor: number,
    arcColor: number,
    coreColor: number
  ): void {
    const g = this.graphics;

    // 1. Pulse scanner beam
    const pulseWidth = 3 + Math.sin(this.animTimer * 12) * 2;
    g.lineStyle(pulseWidth, mainColor, 0.8);
    g.beginPath();
    g.moveTo(sx, sy);
    g.lineTo(tx, ty);
    g.strokePath();

    // Central beam core highlight
    g.lineStyle(1.5, coreColor, 0.9);
    g.beginPath();
    g.moveTo(sx, sy);
    g.lineTo(tx, ty);
    g.strokePath();

    // 2. Expanding scanner ring along beam line
    const dist = Math.hypot(tx - sx, ty - sy);
    const beamAngle = Math.atan2(ty - sy, tx - sx);
    const wavePos = (this.animTimer * 1.5) % 1.0;
    const waveX = sx + Math.cos(beamAngle) * dist * wavePos;
    const waveY = sy + Math.sin(beamAngle) * dist * wavePos;

    g.fillStyle(mainColor, 0.8);
    g.fillCircle(waveX, waveY, 5);

    // 3. Scanner Ring around ship
    const shipRingR = 32 + Math.sin(this.animTimer * 6) * 4;
    g.lineStyle(1.5, mainColor, 0.6);
    g.strokeCircle(sx, sy, shipRingR);

    // 4. Progress HUD arc around ship
    g.lineStyle(3, arcColor, 0.9);
    g.beginPath();
    g.arc(sx, sy, shipRingR + 6, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2, false);
    g.strokePath();
  }

  public destroy(): void {
    this.graphics.destroy();
  }
}
