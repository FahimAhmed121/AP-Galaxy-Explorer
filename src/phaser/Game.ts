import Phaser from 'phaser';
import { BootScene, MainGameplayScene } from './scenes';
import { logger } from '../core/logger';
import { AppError } from '../core/errors';
import { eventBus } from '../core/events';

let activeGameInstance: Phaser.Game | null = null;

export const createPhaserConfig = (parentElement: HTMLElement): Phaser.Types.Core.GameConfig => {
  return {
    type: Phaser.AUTO,
    parent: parentElement,
    width: parentElement.clientWidth || window.innerWidth,
    height: parentElement.clientHeight || window.innerHeight,
    backgroundColor: '#050508',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, MainGameplayScene],
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    render: {
      antialias: true,
      pixelArt: false,
      powerPreference: 'high-performance',
    },
  };
};

/**
 * Initialize or retrieve the active Phaser Game instance.
 */
export const initPhaserGame = (parentElement: HTMLElement): Phaser.Game => {
  if (activeGameInstance) {
    logger.warn('Phaser instance already exists. Destroying duplicate before creation.');
    destroyPhaserGame();
  }

  try {
    logger.info('Initializing Phaser 3 Game Engine...');
    const config = createPhaserConfig(parentElement);
    activeGameInstance = new Phaser.Game(config);
    return activeGameInstance;
  } catch (error) {
    logger.error('Failed to initialize Phaser Game instance', error);
    throw new AppError('Phaser Game Engine initialization error');
  }
};

/**
 * Safely destroy the active Phaser Game instance and release memory.
 */
export const destroyPhaserGame = (): void => {
  if (activeGameInstance) {
    logger.info('Destroying active Phaser Game instance...');
    activeGameInstance.destroy(true);
    activeGameInstance = null;
    eventBus.emit('PHASER_DESTROYED', undefined);
  }
};

/**
 * Get the current active Phaser Game instance.
 */
export const getPhaserGame = (): Phaser.Game | null => {
  return activeGameInstance;
};
