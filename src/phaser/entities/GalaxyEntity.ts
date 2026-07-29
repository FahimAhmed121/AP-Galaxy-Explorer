import Phaser from 'phaser';
import { Galaxy } from '../../core/types';

export class GalaxyEntity extends Phaser.GameObjects.Container {
  public galaxyData: Galaxy;
  public discoveryRadius: number;
  public labelRadius: number;
  public isDiscovered: boolean = false;

  private bodyGraphics: Phaser.GameObjects.Graphics;
  private ringGraphics: Phaser.GameObjects.Graphics;
  private labelContainer: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private typeText: Phaser.GameObjects.Text;

  private rotationSpeed: number = 0.05;
  private armRotation: number = 0;

  constructor(scene: Phaser.Scene, galaxyData: Galaxy) {
    super(scene, galaxyData.x, galaxyData.y);
    this.galaxyData = galaxyData;
    this.discoveryRadius = galaxyData.discoveryRadius || 280;
    this.labelRadius = galaxyData.labelRadius || 520;

    scene.add.existing(this);
    this.setDepth(10); // Above space sector background, below player & lasers

    // 1. Procedural Galaxy Graphics
    this.bodyGraphics = this.scene.add.graphics();
    this.add(this.bodyGraphics);

    // 2. Discovery Boundary Ring
    this.ringGraphics = this.scene.add.graphics();
    this.add(this.ringGraphics);

    // 3. Floating Label
    this.labelContainer = this.scene.add.container(0, galaxyData.radius + 35);
    this.labelContainer.setAlpha(0); // Initially hidden

    // Label background pill
    const labelBg = this.scene.add.graphics();
    labelBg.fillStyle(0x0f172a, 0.75);
    labelBg.lineStyle(1, 0x38bdf8, 0.4);
    labelBg.fillRoundedRect(-110, -20, 220, 42, 8);
    labelBg.strokeRoundedRect(-110, -20, 220, 42, 8);

    this.nameText = this.scene.add.text(0, -9, galaxyData.name, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#f8fafc',
    }).setOrigin(0.5);

    this.typeText = this.scene.add.text(0, 9, `${galaxyData.type.toUpperCase()}`, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#38bdf8',
    }).setOrigin(0.5);

    this.labelContainer.add([labelBg, this.nameText, this.typeText]);
    this.add(this.labelContainer);

    if (galaxyData.visualTheme?.rotationSpeed) {
      this.rotationSpeed = galaxyData.visualTheme.rotationSpeed;
    }

    this.renderGalaxyVisuals();
    this.renderDiscoveryRing(0.2);
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

    const color = this.isDiscovered ? 0x22c55e : 0x38bdf8;
    g.lineStyle(1.5, color, alpha);

    // Dashed discovery radius ring
    const dashCount = 28;
    for (let i = 0; i < dashCount; i += 2) {
      const startAngle = (i * Math.PI * 2) / dashCount;
      const endAngle = ((i + 1) * Math.PI * 2) / dashCount;
      g.beginPath();
      g.arc(0, 0, this.discoveryRadius, startAngle, endAngle, false);
      g.strokePath();
    }
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

    // 4. Update Discovery Ring Glow
    if (dist <= this.discoveryRadius) {
      const pulseAlpha = 0.5 + Math.sin(this.scene.time.now * 0.005) * 0.25;
      this.renderDiscoveryRing(pulseAlpha);
    } else if (dist <= this.labelRadius) {
      this.renderDiscoveryRing(0.25);
    } else {
      this.renderDiscoveryRing(0.12);
    }
  }

  public destroy(fromScene?: boolean): void {
    this.bodyGraphics.destroy();
    this.ringGraphics.destroy();
    this.labelContainer.destroy();
    super.destroy(fromScene);
  }
}
