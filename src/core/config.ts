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

export const UNIVERSE_CONFIG = {
  seed: 421337,
  sectorSize: 1000,           // 1000x1000 unit sectors
  streamingRadius: 1,         // 3x3 active sector grid around player
  starDensity: 45,            // stars per sector
  nebulaProbability: 0.40,    // chance of nebula cloud in sector
  galaxyProbability: 0.30,    // chance of decorative background galaxy
  cosmicDustDensity: 12,      // ambient dust particles per sector
  nebulaColors: [
    0x3b82f6, // Blue
    0x8b5cf6, // Purple
    0xec4899, // Pink / Magenta
    0x06b6d4, // Cyan
    0x10b981, // Emerald
  ],
  starColors: [
    0xffffff, // White
    0x38bdf8, // Ice Blue
    0xa855f7, // Deep Violet
    0xfde047, // Golden Yellow
    0xf97316, // Orange Red
  ],
};

