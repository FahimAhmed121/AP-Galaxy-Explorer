// Core Application Constants
export const APP_NAME = 'AP Galaxy Explorer';
export const APP_ORGANIZATION = 'Astronomy Pathshala';
export const APP_VERSION = '2.0.0-alpha';

export const WORLD_SIZE = 5000;
export const DEFAULT_PLAYER_CALLSIGN = 'COSMIC EXPLORER';

export const AUDIO_DEFAULTS = {
  BGM_VOLUME: 0.5,
  SFX_VOLUME: 0.8,
  SOUND_ENABLED: true,
};

export const DRONE_CONFIG = {
  SPAWN_CHANCE: 0.35,
  SPAWN_COOLDOWN_MS: 18000, // 18s cooldown between drone spawn checks
  MIN_SPAWN_DIST: 1100, // Strictly off-screen distance so spawns are never visible directly on player
  MAX_SPAWN_DIST: 2400,
  SCANNER_INTERFERENCE_PENALTY: 0.15, // 15% scanner speed penalty
  INTERFERENCE_RANGE: 650,
  DETECTION_RADIUS: 450,
  ATTACK_RADIUS: 650,
  ESCAPE_RADIUS: 900,
  MAX_SPEED: 220,
  TURN_SPEED: 2.8,
  ATTACK_COOLDOWN: 1400,
  INVESTIGATE_DURATION: 12000,
  PATROL_DURATION: 7000,
  SURVEY_DURATION: 5000,
  MAX_HEALTH: 60,
  PLASMA_DAMAGE: 18,
  PLASMA_SPEED: 620,
};

export const AURA_DRONE_MESSAGES = [
  "Unknown energy signature detected in deep space.",
  "Unidentified autonomous probe detected in sector.",
  "Origin unknown. Survey pattern does not match any known human spacecraft.",
  "Non-human survey activity detected. Exercise caution.",
  "Unidentified signal signature logged. Maintaining distance.",
  "Scanner interference increasing near autonomous entity.",
  "Foreign probe conducting scientific observations. Origin unconfirmed.",
  "Deep-space reconnaissance signature confirmed.",
];
