import Phaser from 'phaser';
import { PlayerShip } from '../entities/PlayerShip';

export class DebugOverlaySystem {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Graphics;
  private debugText: Phaser.GameObjects.Text;
  private isVisible: boolean = true;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Create Container and set to top depth fixed to camera
    this.container = this.scene.add.container(12, 12);
    this.container.setScrollFactor(0);
    this.container.setDepth(1000);

    // Background Panel
    this.background = this.scene.add.graphics();
    this.background.fillStyle(0x0f172a, 0.85);
    this.background.lineStyle(1, 0x38bdf8, 0.4);
    this.background.fillRoundedRect(0, 0, 260, 140, 6);
    this.background.strokeRoundedRect(0, 0, 260, 140, 6);

    // Text Display
    this.debugText = this.scene.add.text(12, 10, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#38bdf8',
      lineSpacing: 4,
    });

    this.container.add([this.background, this.debugText]);
  }

  public toggle(): void {
    this.isVisible = !this.isVisible;
    this.container.setVisible(this.isVisible);
  }

  public update(playerShip?: PlayerShip): void {
    if (!this.isVisible) return;

    const fps = Math.round(this.scene.game.loop.actualFps);
    const cam = this.scene.cameras.main;

    let posX = 0;
    let posY = 0;
    let vx = 0;
    let vy = 0;
    let speed = 0;
    let angleDeg = 0;

    if (playerShip && playerShip.body) {
      posX = Math.round(playerShip.x);
      posY = Math.round(playerShip.y);
      vx = Math.round(playerShip.body.velocity.x);
      vy = Math.round(playerShip.body.velocity.y);
      speed = Math.round(Math.hypot(vx, vy));
      angleDeg = Math.round(Phaser.Math.RadToDeg(playerShip.rotation));
    }

    const lines = [
      `[DEBUG SYSTEM OVERLAY - ~ to hide]`,
      `FPS        : ${fps}`,
      `SCENE      : ${this.scene.scene.key}`,
      `POS        : X: ${posX} | Y: ${posY}`,
      `VELOCITY   : Vx: ${vx} | Vy: ${vy}`,
      `SPEED      : ${speed} px/s`,
      `HEADING    : ${angleDeg}°`,
      `CAMERA     : Zoom: ${cam.zoom.toFixed(2)} | Pos: (${Math.round(cam.scrollX)}, ${Math.round(cam.scrollY)})`,
    ];

    this.debugText.setText(lines.join('\n'));
  }

  public destroy(): void {
    this.container.destroy();
  }
}
