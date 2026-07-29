import Phaser from 'phaser';
import { PlayerShip } from '../entities/PlayerShip';
import { UniverseManager } from '../managers/UniverseManager';

export class DebugOverlaySystem {
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Graphics;
  private debugText: Phaser.GameObjects.Text;
  private isVisible: boolean = true;

  constructor(scene: Phaser.Scene) {
    // Create Container and set to top depth fixed to camera
    this.container = scene.add.container(12, 12);
    this.container.setScrollFactor(0);
    this.container.setDepth(1000);

    // Background Panel
    this.background = scene.add.graphics();
    this.background.fillStyle(0x0f172a, 0.88);
    this.background.lineStyle(1, 0x38bdf8, 0.5);
    this.background.fillRoundedRect(0, 0, 290, 195, 6);
    this.background.strokeRoundedRect(0, 0, 290, 195, 6);

    // Text Display
    this.debugText = scene.add.text(12, 10, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#38bdf8',
      lineSpacing: 3,
    });

    this.container.add([this.background, this.debugText]);
  }

  public toggle(): void {
    this.isVisible = !this.isVisible;
    this.container.setVisible(this.isVisible);
  }

  public update(playerShip?: PlayerShip, universeManager?: UniverseManager): void {
    if (!this.isVisible) return;

    const fps = Math.round(this.container.scene.game.loop.actualFps);
    const cam = this.container.scene.cameras.main;

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

    let sectorCoords = 'X: 0 | Y: 0';
    let sectorType = 'N/A';
    let loadedSectors = 0;
    let totalObjects = 0;
    let seed = 0;

    if (universeManager) {
      const coords = universeManager.getCurrentSectorCoords(posX, posY);
      sectorCoords = `X: ${coords.x} | Y: ${coords.y}`;
      sectorType = universeManager.getCurrentSectorType(posX, posY);
      loadedSectors = universeManager.getLoadedSectorCount();
      totalObjects = universeManager.getTotalObjectCount();
      seed = universeManager.getSeed();
    }

    const lines = [
      `[DEBUG SYSTEM OVERLAY - ~ to toggle]`,
      `FPS        : ${fps}`,
      `SCENE      : ${this.container.scene.scene.key}`,
      `POS        : X: ${posX} | Y: ${posY}`,
      `VELOCITY   : Vx: ${vx} | Vy: ${vy} (${speed} px/s)`,
      `HEADING    : ${angleDeg}°`,
      `CAMERA     : Z: ${cam.zoom.toFixed(2)} | (${Math.round(cam.scrollX)}, ${Math.round(cam.scrollY)})`,
      `--- UNIVERSE SYSTEM ---`,
      `SEED       : ${seed}`,
      `SECTOR     : ${sectorCoords} [${sectorType}]`,
      `ACTIVE SEC : ${loadedSectors} loaded`,
      `ENV OBJECTS: ${totalObjects} rendered`,
    ];

    this.debugText.setText(lines.join('\n'));
  }

  public destroy(): void {
    this.container.destroy();
  }
}
