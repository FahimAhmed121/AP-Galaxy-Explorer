import Phaser from 'phaser';
import { Galaxy } from '../../core/types';

export class GalaxyEntity extends Phaser.GameObjects.Container {
  public galaxyData: Galaxy;
  public discoveryRadius: number;
  public labelRadius: number;
  public discoveryState: 'UNDISCOVERED' | 'SCANNING' | 'DISCOVERED' = 'UNDISCOVERED';
  public scanProgress: number = 0; // 0 to 1

  private bodyGraphics: Phaser.GameObjects.Graphics;
  private ringGraphics: Phaser.GameObjects.Graphics;
  private scannerGraphics: Phaser.GameObjects.Graphics;
  private labelContainer: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private typeText: Phaser.GameObjects.Text;
  private statusBadgeText: Phaser.GameObjects.Text;
  private labelBg: Phaser.GameObjects.Graphics;

  private rotationSpeed: number = 0.05;
  private armRotation: number = 0;
  private scanAngle: number = 0;

  constructor(scene: Phaser.Scene, galaxyData: Galaxy) {
    super(scene, galaxyData.x, galaxyData.y);
    this.galaxyData = galaxyData;
    this.discoveryRadius = galaxyData.discoveryRadius || 280;
    this.labelRadius = galaxyData.labelRadius || 520;
    this.discoveryState = galaxyData.discoveryState || 'UNDISCOVERED';

    scene.add.existing(this);
    this.setDepth(10); // Above space sector background, below player & lasers

    // 1. Procedural Galaxy Graphics
    this.bodyGraphics = this.scene.add.graphics();
    this.add(this.bodyGraphics);

    // 2. Discovery Boundary Ring
    this.ringGraphics = this.scene.add.graphics();
    this.add(this.ringGraphics);

    // 3. Scanner Ring & Reticle Graphics
    this.scannerGraphics = this.scene.add.graphics();
    this.add(this.scannerGraphics);

    // 4. Floating Label
    this.labelContainer = this.scene.add.container(0, galaxyData.radius + 35);
    this.labelContainer.setAlpha(0); // Initially hidden

    // Label background pill
    this.labelBg = this.scene.add.graphics();
    this.drawLabelBackground();

    this.nameText = this.scene.add.text(0, -10, galaxyData.name, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#f8fafc',
    }).setOrigin(0.5);

    this.typeText = this.scene.add.text(0, 6, `${galaxyData.type.toUpperCase()}`, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#38bdf8',
    }).setOrigin(0.5);

    this.statusBadgeText = this.scene.add.text(0, 18, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      fontStyle: 'bold',
      color: '#10b981',
    }).setOrigin(0.5);

    this.labelContainer.add([this.labelBg, this.nameText, this.typeText, this.statusBadgeText]);
    this.add(this.labelContainer);

    if (galaxyData.visualTheme?.rotationSpeed) {
      this.rotationSpeed = galaxyData.visualTheme.rotationSpeed;
    }

    this.renderGalaxyVisuals();
    this.renderDiscoveryRing(0.2);
    this.updateStatusBadge();
  }

  public setDiscoveryState(state: 'UNDISCOVERED' | 'SCANNING' | 'DISCOVERED', progress: number = 0): void {
    this.discoveryState = state;
    this.scanProgress = progress;
    this.updateStatusBadge();
    this.drawLabelBackground();
  }

  private updateStatusBadge(): void {
    if (this.discoveryState === 'DISCOVERED') {
      this.statusBadgeText.setText('● SCANNED & DISCOVERED').setColor('#10b981');
    } else if (this.discoveryState === 'SCANNING') {
      const pct = Math.floor(this.scanProgress * 100);
      this.statusBadgeText.setText(`[SCANNING ${pct}%]`).setColor('#38bdf8');
    } else {
      this.statusBadgeText.setText('PRESS [E] TO SCAN').setColor('#94a3b8');
    }
  }

  private drawLabelBackground(): void {
    const bg = this.labelBg;
    bg.clear();

    if (this.discoveryState === 'DISCOVERED') {
      bg.fillStyle(0x064e3b, 0.85); // Emerald dark background
      bg.lineStyle(1.5, 0x10b981, 0.8);
    } else if (this.discoveryState === 'SCANNING') {
      bg.fillStyle(0x0f172a, 0.9);
      bg.lineStyle(1.5, 0x38bdf8, 1.0);
    } else {
      bg.fillStyle(0x0f172a, 0.75);
      bg.lineStyle(1, 0x38bdf8, 0.4);
    }

    bg.fillRoundedRect(-120, -22, 240, 52, 8);
    bg.strokeRoundedRect(-120, -22, 240, 52, 8);
  }

  private renderGalaxyVisuals(): void {
    const g = this.bodyGraphics;
    g.clear();

    const theme = this.galaxyData.visualTheme || {
      coreColor: 0x38bdf8,
      armColor: 0x0284c7,
      armCount: 2,
      coreRadius: 25,
      rotationSpeed: 0.05,
    };

    const coreColorNum = typeof theme.coreColor === 'string' ? Number(theme.coreColor) : theme.coreColor;
    const armColorNum = typeof theme.armColor === 'string' ? Number(theme.armColor) : theme.armColor;

    const r = this.galaxyData.radius;

    // 1. Core Halo Glow
    g.fillStyle(coreColorNum, 0.15);
    g.fillCircle(0, 0, r * 1.3);
    g.fillStyle(coreColorNum, 0.35);
    g.fillCircle(0, 0, r * 0.7);
    g.fillStyle(0xffffff, 0.85);
    g.fillCircle(0, 0, theme.coreRadius);

    // 2. Procedural arm/ring drawing based on iconStyle
    const style = this.galaxyData.iconStyle;

    if (style === 'spiral') {
      const armCount = theme.armCount || 2;
      for (let arm = 0; arm < armCount; arm++) {
        const baseAngle = (arm * Math.PI * 2) / armCount;
        for (let i = 0; i < 45; i++) {
          const t = i / 45;
          const distance = theme.coreRadius + t * (r - theme.coreRadius);
          const angle = baseAngle + t * Math.PI * 1.8;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const dotSize = 1.2 + (1 - t) * 2.5;

          g.fillStyle(armColorNum, 0.65 - t * 0.4);
          g.fillCircle(x, y, dotSize);
        }
      }
    } else if (style === 'barred-spiral') {
      // Central Bar
      g.lineStyle(6, coreColorNum, 0.8);
      g.lineBetween(-r * 0.5, 0, r * 0.5, 0);

      // Sweeping arms from bar tips
      for (const side of [-1, 1]) {
        const startX = side * r * 0.5;
        for (let i = 0; i < 35; i++) {
          const t = i / 35;
          const distance = t * r * 0.6;
          const angle = (side > 0 ? 0 : Math.PI) + t * Math.PI * 1.2;
          const x = startX + Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          g.fillStyle(armColorNum, 0.7 - t * 0.4);
          g.fillCircle(x, y, 2.5 - t * 1.2);
        }
      }
    } else if (style === 'ring') {
      // Inner & Outer Rings
      g.lineStyle(3, armColorNum, 0.75);
      g.strokeCircle(0, 0, r * 0.9);
      g.lineStyle(1.5, coreColorNum, 0.4);
      g.strokeCircle(0, 0, r * 0.5);

      // Connecting spokes
      g.lineStyle(1, armColorNum, 0.25);
      for (let a = 0; a < 8; a++) {
        const angle = (a * Math.PI * 2) / 8;
        g.lineBetween(
          Math.cos(angle) * r * 0.3,
          Math.sin(angle) * r * 0.3,
          Math.cos(angle) * r * 0.9,
          Math.sin(angle) * r * 0.9
        );
      }
    } else {
      // Elliptical / Irregular Halo
      g.fillStyle(armColorNum, 0.3);
      g.fillEllipse(0, 0, r * 1.6, r * 1.1);
      g.fillStyle(coreColorNum, 0.4);
      g.fillEllipse(0, 0, r * 1.1, r * 0.7);
    }
  }

  private renderDiscoveryRing(alpha: number): void {
    const g = this.ringGraphics;
    g.clear();

    const isDisc = this.discoveryState === 'DISCOVERED';
    const color = isDisc ? 0x10b981 : 0x38bdf8;
    g.lineStyle(isDisc ? 2.0 : 1.5, color, alpha);

    // Dashed discovery radius ring
    const dashCount = isDisc ? 36 : 28;
    for (let i = 0; i < dashCount; i += 2) {
      const startAngle = (i * Math.PI * 2) / dashCount;
      const endAngle = ((i + 1) * Math.PI * 2) / dashCount;
      g.beginPath();
      g.arc(0, 0, this.discoveryRadius, startAngle, endAngle, false);
      g.strokePath();
    }
  }

  private renderScannerFX(delta: number): void {
    const sg = this.scannerGraphics;
    sg.clear();

    if (this.discoveryState !== 'SCANNING') {
      return;
    }

    this.scanAngle += delta * 0.003;
    const r = this.galaxyData.radius * 1.35;

    // Outer rotating scanner reticle arc
    sg.lineStyle(2, 0x38bdf8, 0.85);
    sg.beginPath();
    sg.arc(0, 0, r, this.scanAngle, this.scanAngle + Math.PI * 1.2, false);
    sg.strokePath();

    sg.lineStyle(1.5, 0x06b6d4, 0.6);
    sg.beginPath();
    sg.arc(0, 0, r * 1.15, -this.scanAngle * 1.5, -this.scanAngle * 1.5 + Math.PI * 0.8, false);
    sg.strokePath();

    // Progress ring arc (0 to 2*PI)
    const endArc = this.scanProgress * Math.PI * 2;
    sg.lineStyle(4, 0x38bdf8, 0.95);
    sg.beginPath();
    sg.arc(0, 0, r * 0.85, -Math.PI / 2, -Math.PI / 2 + endArc, false);
    sg.strokePath();

    // Soft glowing center pulse
    const pulseR = (r * 0.85) * (0.2 + (this.scanAngle % 1) * 0.8);
    sg.fillStyle(0x38bdf8, 0.15);
    sg.fillCircle(0, 0, pulseR);
  }

  public update(delta: number, playerX: number, playerY: number): void {
    // 1. Slow rotation animation of galaxy arms
    this.armRotation += this.rotationSpeed * (delta / 1000);
    this.bodyGraphics.setRotation(this.armRotation);

    // 2. Compute distance to player
    const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);

    // 3. Update Label Alpha (fades smoothly based on distance)
    if (dist <= this.labelRadius) {
      // Smooth lerp: 0 at labelRadius, 1 at discoveryRadius
      const norm = Phaser.Math.Clamp(
        1 - (dist - this.discoveryRadius) / (this.labelRadius - this.discoveryRadius),
        0.1,
        1.0
      );
      this.labelContainer.setAlpha(norm);
    } else {
      this.labelContainer.setAlpha(0);
    }

    // 4. Update Discovery Ring Glow & Scanner Effects
    if (this.discoveryState === 'SCANNING') {
      this.renderScannerFX(delta);
      this.renderDiscoveryRing(0.85);
      this.updateStatusBadge();
    } else if (this.discoveryState === 'DISCOVERED') {
      this.scannerGraphics.clear();
      this.renderDiscoveryRing(0.6);
    } else if (dist <= this.discoveryRadius) {
      this.scannerGraphics.clear();
      const pulseAlpha = 0.5 + Math.sin(this.scene.time.now * 0.005) * 0.25;
      this.renderDiscoveryRing(pulseAlpha);
    } else if (dist <= this.labelRadius) {
      this.scannerGraphics.clear();
      this.renderDiscoveryRing(0.25);
    } else {
      this.scannerGraphics.clear();
      this.renderDiscoveryRing(0.12);
    }
  }

  public destroy(fromScene?: boolean): void {
    this.bodyGraphics.destroy();
    this.ringGraphics.destroy();
    this.scannerGraphics.destroy();
    this.labelContainer.destroy();
    super.destroy(fromScene);
  }
}
