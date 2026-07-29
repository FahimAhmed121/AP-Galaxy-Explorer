export interface Spaceship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  stardust: number;
  score: number;
  level: number;
  speedUpgrade: number;
  shieldUpgrade: number;
  weaponUpgrade: number;
  magnetUpgrade: number;
}

export interface Asteroid {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  health: number;
  maxHealth: number;
  points: number;
  type: 'large' | 'medium' | 'small';
}

export interface Laser {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  damage: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
}

export interface StardustItem {
  id: string;
  x: number;
  y: number;
  value: number;
  size: number;
}

export interface GalaxyVisualTheme {
  coreColor: number;
  armColor: number;
  armCount: number;
  coreRadius: number;
  rotationSpeed: number;
}

export interface GalaxySpawnRules {
  minDistance: number;
  rarityWeight: number;
  sectorX: number;
  sectorY: number;
}

export interface Galaxy {
  id: string;
  name: string;
  type: string;
  distance: string;
  diameter: string;
  constellation: string;
  age: string;
  description: string;
  funFacts: string[];
  visualColor: string; // Hex or CSS color for rendering
  iconStyle: 'spiral' | 'elliptical' | 'ring' | 'barred-spiral';
  x: number; // World map coordinates
  y: number;
  radius: number;
  discoveryRadius?: number;
  labelRadius?: number;
  rarity?: 'COMMON' | 'RARE' | 'LEGENDARY' | 'MYTHIC';
  spawnRules?: GalaxySpawnRules;
  visualTheme?: GalaxyVisualTheme;
  quizzes: QuizQuestion[];
  realImageUrl?: string;
  youtubeVideoId?: string;
  banglaTranslation?: {
    name: string;
    type: string;
    distance: string;
    diameter: string;
    constellation: string;
    age: string;
    description: string;
    funFacts: string[];
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface ExplorerBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export interface ExplorerProfile {
  name: string;
  rankTitle: string;
  xp: number;
  totalScore: number;
  stardustReserves: number;
  discoveredGalaxyIds: string[];
  quizBestScores: Record<string, number>; // galaxyId -> score
  unlockedBadges: string[]; // Badge IDs
}

export interface GameSettings {
  soundEnabled: boolean;
  sfxVolume: number; // 0 to 1
  bgmVolume: number; // 0 to 1
  language: 'EN' | 'BN';
}

export type GameState = 
  | 'MENU' 
  | 'PLAYING' 
  | 'WARPING' 
  | 'GALAXY_INFO' 
  | 'QUIZ' 
  | 'CERTIFICATE' 
  | 'ARCHIVE' 
  | 'SETTINGS' 
  | 'GAME_OVER';
