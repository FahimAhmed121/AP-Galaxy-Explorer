import Phaser from 'phaser';
import { logger } from '../../core/logger';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  boost: boolean;
  fireRequested: boolean;
  scanRequested: boolean;
  scanJustPressed: boolean;
  skipJustPressed: boolean;
  debugToggle: boolean;
}

export class InputSystem {
  private scene: Phaser.Scene;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private keyE?: Phaser.Input.Keyboard.Key;
  private keyF?: Phaser.Input.Keyboard.Key;
  private keyK?: Phaser.Input.Keyboard.Key;
  private keyEsc?: Phaser.Input.Keyboard.Key;
  private keySpace?: Phaser.Input.Keyboard.Key;
  private keyShift?: Phaser.Input.Keyboard.Key;
  private keyTilde?: Phaser.Input.Keyboard.Key;
  private keyF2?: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initKeys();
  }

  private initKeys(): void {
    if (!this.scene.input.keyboard) {
      logger.warn('InputSystem: Keyboard plugin unavailable on current scene.');
      return;
    }

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keyF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.keyK = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.keyEsc = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keyTilde = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKTICK);
    this.keyF2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2);

    logger.info('InputSystem: Keyboard keys mapped successfully (W, A, S, D, E, F, K, Esc, Space, Shift).');
  }

  public getInputState(): InputState {
    const forward = Boolean(
      (this.keyW && this.keyW.isDown) || (this.cursors && this.cursors.up.isDown)
    );
    const backward = Boolean(
      (this.keyS && this.keyS.isDown) || (this.cursors && this.cursors.down.isDown)
    );
    const left = Boolean(
      (this.keyA && this.keyA.isDown) || (this.cursors && this.cursors.left.isDown)
    );
    const right = Boolean(
      (this.keyD && this.keyD.isDown) || (this.cursors && this.cursors.right.isDown)
    );
    const boost = Boolean(
      (this.keyShift && this.keyShift.isDown)
    );

    const fireRequested = Boolean(
      (this.keySpace && this.keySpace.isDown) ||
      (this.keyF && this.keyF.isDown) ||
      (this.keyK && this.keyK.isDown) ||
      (this.scene.input.activePointer && this.scene.input.activePointer.isDown)
    );

    const scanRequested = Boolean(this.keyE && this.keyE.isDown);
    const scanJustPressed = Boolean(this.keyE && Phaser.Input.Keyboard.JustDown(this.keyE));
    const skipJustPressed = Boolean(this.keyEsc && Phaser.Input.Keyboard.JustDown(this.keyEsc));

    const debugPressed = Boolean(
      (this.keyTilde && Phaser.Input.Keyboard.JustDown(this.keyTilde)) ||
      (this.keyF2 && Phaser.Input.Keyboard.JustDown(this.keyF2))
    );

    return {
      forward,
      backward,
      left,
      right,
      boost,
      fireRequested,
      scanRequested,
      scanJustPressed,
      skipJustPressed,
      debugToggle: debugPressed,
    };
  }

  public destroy(): void {
    // Remove listeners if needed
  }
}
