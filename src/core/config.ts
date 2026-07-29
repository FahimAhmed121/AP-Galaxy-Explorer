import { WORLD_SIZE } from './constants';

export const GAME_CONFIG = {
  world: {
    width: WORLD_SIZE,
    height: WORLD_SIZE,
    gridSize: 250,
  },
  physics: {
    turnSpeed: 3.8,
    baseAcceleration: 260,
    speedUpgradeMultiplier: 45,
    friction: 0.982,
    shieldRechargeRate: 4,
  },
  combat: {
    laserBaseDamage: 20,
    laserUpgradeBonus: 10,
    laserSpeed: 750,
  },
  asteroids: {
    initialCount: 45,
    spawnSafeDistance: 500,
  },
  magneticDust: {
    baseMagnetRange: 100,
    magnetUpgradeBonus: 45,
    pullSpeed: 280,
  },
};
