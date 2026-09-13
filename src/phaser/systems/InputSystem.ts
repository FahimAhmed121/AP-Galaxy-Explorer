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

    // Disable default key captures so typing into input elements (Auth, Settings) is not blocked
    this.scene.input.keyboard.clearCaptures();
    (this.scene.input.keyboard as any).preventDefault = false;

    // Map keys without capture (enableCapture = false) so native DOM events pass through to input fields
    this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, false);
    this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false);
    this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, false);
    this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, false);
    this.keyE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E, false);
    this.keyF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F, false);
    this.keyK = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K, false);
    this.keyEsc = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, false);
    this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, false);
    this.keyShift = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT, false);
    this.keyTilde = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKTICK, false);
    this.keyF2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2, false);

    // Re-clear captures to override any default cursor key captures
    this.scene.input.keyboard.clearCaptures();

    logger.info('InputSystem: Keyboard keys mapped with non-capturing mode (W, A, S, D, E, F, K, Esc, Space, Shift).');
  }

  /**
   * Checks if an interactive text input element currently has active DOM focus.
   * If focused, game controls should remain neutral to avoid interfering with typing.
   */
  private isInputFocused(): boolean {
    if (typeof document === 'undefined') return false;
    const active = document.activeElement;
    if (!active) return false;
    const tag = active.tagName ? active.tagName.toUpperCase() : '';
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      (active as HTMLElement).isContentEditable
    );
  }

  public getInputState(): InputState {
    // If the user is currently typing in an input element (e.g. AuthModal, SettingsModal),
    // return neutral input state so the ship does not move, turn, or fire.
    if (this.isInputFocused()) {
      return {
        forward: false,
        backward: false,
        left: false,
        right: false,
        boost: false,
        fireRequested: false,
        scanRequested: false,
        scanJustPressed: false,
        skipJustPressed: false,
        debugToggle: false,
      };
    }

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

    const activePointer = this.scene.input.activePointer;
    const isPointerOverCanvas = Boolean(
      activePointer &&
      activePointer.isDown &&
      activePointer.event &&
      (activePointer.event.target as HTMLElement)?.tagName === 'CANVAS'
    );

    const fireRequested = Boolean(
      (this.keySpace && this.keySpace.isDown) ||
      (this.keyF && this.keyF.isDown) ||
      (this.keyK && this.keyK.isDown) ||
      isPointerOverCanvas
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
