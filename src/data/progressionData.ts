import { GALAXIES } from './galaxies';

export interface ProgressionLevelDef {
  level: number;
  xpRequired: number; // Total cumulative XP required to reach this level
  rankTitle: string;
  rankTitleBn: string;
  stardustReward: number;
  unlockedPerks?: string[];
  unlockedCosmetics?: string[];
}

export interface BadgeDef {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
  category: 'DISCOVERY' | 'KNOWLEDGE' | 'COLLECTION' | 'PILOTING';
  checkUnlocked: (profile: {
    xp: number;
    level: number;
    discoveredGalaxyIds: string[];
    quizBestScores: Record<string, number>;
    stardustReserves: number;
    totalScore: number;
  }) => boolean;
}

export type CosmeticType = 'SHIP_SKIN' | 'THRUSTER_FX' | 'SCANNER_FX';

export interface CosmeticItem {
  id: string;
  type: CosmeticType;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  unlockType: 'DEFAULT' | 'LEVEL' | 'BADGE' | 'STARDUST';
  unlockValue: number | string; // Level number, Badge ID, or Stardust cost
  unlockCost: number;
  unlockLevel: number;
  colors: {
    primary: number;   // Hex color number (e.g. 0x06b6d4)
    secondary: number;
    accent: number;
    glow?: number;
    canopy?: number;
  };
}

export interface PassivePerkDef {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
  category: string;
  effectType: 'SCAN_SPEED' | 'MAGNET_RANGE' | 'MAX_SPEED' | 'SHIELD_RECHARGE' | 'XP_BONUS';
  effectValue: number; // Percentage bonus (e.g. 0.20 = +20%)
  unlockLevel: number;
}

export function getXpForLevel(level: number): number {
  const levelDef = PROGRESSION_LEVELS.find((l) => l.level === level);
  if (levelDef) return levelDef.xpRequired;
  const maxDef = PROGRESSION_LEVELS[PROGRESSION_LEVELS.length - 1];
  if (level <= maxDef.level) return maxDef.xpRequired;
  return maxDef.xpRequired + (level - maxDef.level) * 1000;
}

// 1. XP Thresholds and Levels (Levels 1 to 15 - balanced for 10 galaxies & quiz scope)
export const PROGRESSION_LEVELS: ProgressionLevelDef[] = [
  { level: 1, xpRequired: 0, rankTitle: 'Space Cadet', rankTitleBn: 'স্পেস ক্যাডেট', stardustReward: 0 },
  { level: 2, xpRequired: 150, rankTitle: 'Star Finder', rankTitleBn: 'স্টার ফাইন্ডার', stardustReward: 50 },
  { level: 3, xpRequired: 350, rankTitle: 'Starlight Scout', rankTitleBn: 'স্টারলাইট স্কাউট', stardustReward: 75, unlockedPerks: ['perk_scanner_1'] },
  { level: 4, xpRequired: 650, rankTitle: 'Cosmic Navigator', rankTitleBn: 'কসমিক নেভিগেটর', stardustReward: 100, unlockedCosmetics: ['skin_neon_pulse'] },
  { level: 5, xpRequired: 1000, rankTitle: 'Astro Cartographer', rankTitleBn: 'অ্যাস্ট্রো কার্টোগ্রাফার', stardustReward: 150, unlockedPerks: ['perk_magnet_1'] },
  { level: 6, xpRequired: 1450, rankTitle: 'Galactic Explorer', rankTitleBn: 'গ্যালাকটিক এক্সপ্লোরার', stardustReward: 200, unlockedCosmetics: ['thruster_amber_flare'] },
  { level: 7, xpRequired: 2000, rankTitle: 'Deep Space Scout', rankTitleBn: 'ডিপ স্পেস স্কাউট', stardustReward: 250, unlockedPerks: ['perk_engine_1'] },
  { level: 8, xpRequired: 2650, rankTitle: 'Nebula Surveyor', rankTitleBn: 'নেবুলা সার্ভেয়ার', stardustReward: 300, unlockedCosmetics: ['scanner_quantum_magenta'] },
  { level: 9, xpRequired: 3400, rankTitle: 'Starlight Voyager', rankTitleBn: 'স্টারলাইট ভয়েজার', stardustReward: 350, unlockedPerks: ['perk_shield_1'] },
  { level: 10, xpRequired: 4250, rankTitle: 'Master Astro Voyager', rankTitleBn: 'মাস্টার অ্যাস্ট্রো ভয়েজার', stardustReward: 500, unlockedCosmetics: ['skin_void_stealth', 'thruster_violet_hyper'] },
  { level: 11, xpRequired: 5200, rankTitle: 'Cosmic Scholar', rankTitleBn: 'কসমিক স্কলার', stardustReward: 600, unlockedPerks: ['perk_xp_1'] },
  { level: 12, xpRequired: 6250, rankTitle: 'Deep Space Pioneer', rankTitleBn: 'ডিপ স্পেস পাইওনিয়ার', stardustReward: 700, unlockedCosmetics: ['scanner_emerald_sweep'] },
  { level: 13, xpRequired: 7400, rankTitle: 'Celestial Captain', rankTitleBn: 'সেলেস্টিয়াল ক্যাপ্টেন', stardustReward: 800 },
  { level: 14, xpRequired: 8650, rankTitle: 'Quantum Commander', rankTitleBn: 'কোয়ান্টাম কমান্ডার', stardustReward: 900, unlockedCosmetics: ['skin_quantum_emerald'] },
  { level: 15, xpRequired: 10000, rankTitle: 'Master Voyager of the Cosmos', rankTitleBn: 'মহাবিশ্বের মাস্টার ভয়েজার', stardustReward: 1200, unlockedCosmetics: ['skin_celestial_gold', 'thruster_gold_warp'] },
];

// 2. Badges Definitions
export const EXPLORER_BADGES: BadgeDef[] = [
  {
    id: 'badge_first_contact',
    title: 'First Contact',
    titleBn: 'প্রথম সংযোগ',
    description: 'Discover your first galaxy in deep space.',
    descriptionBn: 'মহাকাশে আপনার প্রথম গ্যালাক্সি আবিষ্কার করুন।',
    iconName: 'Compass',
    category: 'DISCOVERY',
    checkUnlocked: (p) => p.discoveredGalaxyIds.length >= 1,
  },
  {
    id: 'badge_galaxy_scout',
    title: 'Galactic Scout',
    titleBn: 'গ্যালাকটিক স্কাউট',
    description: 'Discover 3 unique galaxies.',
    descriptionBn: '৩টি অনন্য গ্যালাক্সি আবিষ্কার করুন।',
    iconName: 'Telescope',
    category: 'DISCOVERY',
    checkUnlocked: (p) => p.discoveredGalaxyIds.length >= 3,
  },
  {
    id: 'badge_master_cartographer',
    title: 'Master Cartographer',
    titleBn: 'মাস্টার কার্টোগ্রাফার',
    description: 'Discover all 9 cataloged galaxies in the universe.',
    descriptionBn: 'মহাবিশ্বের সমস্ত ৯টি নিবন্ধিত গ্যালাক্সি আবিষ্কার করুন।',
    iconName: 'Globe',
    category: 'DISCOVERY',
    checkUnlocked: (p) => p.discoveredGalaxyIds.length >= 9,
  },
  {
    id: 'badge_curious_mind',
    title: 'Curious Scholar',
    titleBn: 'কৌতূহলী শিক্ষার্থী',
    description: 'Pass your first galaxy knowledge assessment quiz.',
    descriptionBn: 'আপনার প্রথম গ্যালাক্সি জ্ঞান যাচাই কুইজে উত্তীর্ণ হন।',
    iconName: 'BookOpen',
    category: 'KNOWLEDGE',
    checkUnlocked: (p) => Object.values(p.quizBestScores).some((s) => s > 0),
  },
  {
    id: 'badge_perfect_score',
    title: 'Perfect Scholar',
    titleBn: 'নিখুঁত শিক্ষার্থী',
    description: 'Achieve 100% score on any galaxy quiz.',
    descriptionBn: 'যেকোনো গ্যালাক্সি কুইজে ১০০% স্কোর অর্জন করুন।',
    iconName: 'Award',
    category: 'KNOWLEDGE',
    checkUnlocked: (p) =>
      Object.entries(p.quizBestScores || {}).some(([galaxyId, score]) => {
        const galaxy = GALAXIES.find((g) => g.id === galaxyId);
        const maxScore = galaxy?.quizzes?.length || 3;
        return score >= maxScore && score > 0;
      }),
  },
  {
    id: 'badge_stardust_collector',
    title: 'Stardust Miner',
    titleBn: 'স্টারডাস্ট মাইনার',
    description: 'Accumulate 250 units of Stardust energy.',
    descriptionBn: '২৫০ ইউনিট স্টারডাস্ট শক্তি সঞ্চয় করুন।',
    iconName: 'Sparkles',
    category: 'COLLECTION',
    checkUnlocked: (p) => p.stardustReserves >= 250,
  },
  {
    id: 'badge_veteran_pilot',
    title: 'Veteran Aviator',
    titleBn: 'ভেটেরান পাইলট',
    description: 'Reach Explorer Level 5.',
    descriptionBn: 'অভিযাত্রী লেভেল ৫ এ পৌঁছান।',
    iconName: 'Shield',
    category: 'PILOTING',
    checkUnlocked: (p) => p.level >= 5,
  },
];

// 3. Cosmetic Definitions
export const SHIP_SKINS: CosmeticItem[] = [
  {
    id: 'skin_standard_cobalt',
    type: 'SHIP_SKIN',
    name: 'Cobalt Vanguard',
    nameBn: 'কোবাল্ট ভ্যানগার্ড',
    description: 'Standard issue AP Explorer hull with deep cobalt wings and cyan accents.',
    descriptionBn: 'গভীর কোবাল্ট ডানা এবং সায়ান অ্যাকসেন্ট সহ স্ট্যান্ডার্ড মানক হুল।',
    unlockType: 'DEFAULT',
    unlockValue: 0,
    unlockCost: 0,
    unlockLevel: 1,
    colors: {
      primary: 0x1e3a8a,    // Navy Blue wings
      secondary: 0x06b6d4,  // Cyan central hull
      accent: 0x22d3ee,     // Edge lines
      canopy: 0xf59e0b,     // Amber canopy
      glow: 0x38bdf8,       // Shield glow
    },
  },
  {
    id: 'skin_neon_pulse',
    type: 'SHIP_SKIN',
    name: 'Neon Cyberpunk',
    nameBn: 'নিয়ন সাইবারপাঙ্ক',
    description: 'High-contrast synthetic composite hull with vibrant magenta and cyan highlights.',
    descriptionBn: 'উজ্জ্বল ম্যাজেন্টা এবং সায়ান হাইলাইট সহ সাইবারপাঙ্ক ডিজাইন।',
    unlockType: 'LEVEL',
    unlockValue: 4,
    unlockCost: 100,
    unlockLevel: 4,
    colors: {
      primary: 0x701a75,    // Deep magenta wings
      secondary: 0xec4899,  // Pink central hull
      accent: 0x22d3ee,     // Neon cyan edges
      canopy: 0x38bdf8,     // Bright cyan canopy
      glow: 0xf43f5e,       // Pink glow
    },
  },
  {
    id: 'skin_void_stealth',
    type: 'SHIP_SKIN',
    name: 'Void Shadow',
    nameBn: 'ভয়েড শ্যাডো',
    description: 'Stealth-coated matte obsidian plating with luminous violet energy channels.',
    descriptionBn: 'উজ্জ্বল বেগুনি শক্তি চ্যানেল সহ অবসিডিয়ান স্টিলথ হুল।',
    unlockType: 'LEVEL',
    unlockValue: 10,
    unlockCost: 250,
    unlockLevel: 10,
    colors: {
      primary: 0x0f172a,    // Slate black wings
      secondary: 0x3b0764,  // Deep violet central hull
      accent: 0xa855f7,     // Purple edge lines
      canopy: 0xc084fc,     // Bright purple canopy
      glow: 0x8b5cf6,       // Violet glow
    },
  },
  {
    id: 'skin_quantum_emerald',
    type: 'SHIP_SKIN',
    name: 'Quantum Emerald',
    nameBn: 'কোয়ান্টাম এমেরাল্ড',
    description: 'Infused with dark matter crystal composites emitting emerald bio-luminescence.',
    descriptionBn: 'এমারাল্ড বায়ো-লুমিনেসেন্স নির্গমনকারী কোয়ান্টাম হুল।',
    unlockType: 'LEVEL',
    unlockValue: 14,
    unlockCost: 400,
    unlockLevel: 14,
    colors: {
      primary: 0x064e3b,    // Emerald wings
      secondary: 0x10b981,  // Bright green hull
      accent: 0x34d399,     // Mint edge lines
      canopy: 0xfacc15,     // Gold canopy
      glow: 0x10b981,       // Emerald glow
    },
  },
  {
    id: 'skin_celestial_gold',
    type: 'SHIP_SKIN',
    name: 'Celestial Monarch',
    nameBn: 'সেলেস্টিয়াল মোনার্ক',
    description: 'Polished solar gold hull reserved for elite explorers of deep space.',
    descriptionBn: 'মহাকাশের এলিট অভিযাত্রীদের জন্য পলিশড গোল্ড হুল।',
    unlockType: 'LEVEL',
    unlockValue: 15,
    unlockCost: 500,
    unlockLevel: 15,
    colors: {
      primary: 0x78350f,    // Deep amber wings
      secondary: 0xd97706,  // Gold central hull
      accent: 0xfde047,     // Bright yellow edge lines
      canopy: 0xffffff,     // Pure white canopy
      glow: 0xf59e0b,       // Golden glow
    },
  },
];

export const THRUSTER_FX: CosmeticItem[] = [
  {
    id: 'thruster_plasma_blue',
    type: 'THRUSTER_FX',
    name: 'Plasma Ion Blue',
    nameBn: 'প্লাজমা আয়ন ব্লু',
    description: 'Standard plasma ion drive with cyan exhaust and particle trail.',
    descriptionBn: 'সায়ান এক্সজস্ট এবং পার্টিকেল ট্রেইল সহ স্ট্যান্ডার্ড থ্রাস্টার।',
    unlockType: 'DEFAULT',
    unlockValue: 0,
    unlockCost: 0,
    unlockLevel: 1,
    colors: {
      primary: 0x06b6d4,   // Main flame
      secondary: 0x38bdf8, // Particle trail
      accent: 0xffffff,    // Core flame
    },
  },
  {
    id: 'thruster_amber_flare',
    type: 'THRUSTER_FX',
    name: 'Solar Amber Flare',
    nameBn: 'সোলার অ্যাম্বার ফ্লেয়ার',
    description: 'High-temperature solar flare discharge with blazing golden exhaust.',
    descriptionBn: 'উচ্চ তাপমাত্রার সৌর শিখা নির্গমনকারী অ্যাম্বার থ্রাস্টার।',
    unlockType: 'LEVEL',
    unlockValue: 6,
    unlockCost: 150,
    unlockLevel: 6,
    colors: {
      primary: 0xf59e0b,   // Amber flame
      secondary: 0xfbbf24, // Particle trail
      accent: 0xffedd5,    // Core flame
    },
  },
  {
    id: 'thruster_violet_hyper',
    type: 'THRUSTER_FX',
    name: 'Hyper Violet Pulse',
    nameBn: 'হাইপার ভায়োলেট পালস',
    description: 'Anti-matter particle beam producing a sleek purple thrust cloud.',
    descriptionBn: 'বেগুনি থ্রাস্ট ক্লাউড তৈরি করে এমন অ্যান্টি-ম্যাটার ড্রাইভ।',
    unlockType: 'LEVEL',
    unlockValue: 10,
    unlockCost: 250,
    unlockLevel: 10,
    colors: {
      primary: 0x8b5cf6,   // Violet flame
      secondary: 0xa855f7, // Particle trail
      accent: 0xf3e8ff,    // Core flame
    },
  },
  {
    id: 'thruster_gold_warp',
    type: 'THRUSTER_FX',
    name: 'Celestial Warp Drive',
    nameBn: 'সেলেস্টিয়াল ওয়ার্প ড্রাইভ',
    description: 'Pure radiant stardust emission leaving a brilliant golden tail.',
    descriptionBn: 'উজ্জ্বল সোনালী লেজ ফেলে যাওয়া স্টাডাস্ট ড্রাইভ।',
    unlockType: 'LEVEL',
    unlockValue: 15,
    unlockCost: 500,
    unlockLevel: 15,
    colors: {
      primary: 0xeab308,   // Gold flame
      secondary: 0xfde047, // Particle trail
      accent: 0xffffff,    // Core flame
    },
  },
];

export const SCANNER_FX: CosmeticItem[] = [
  {
    id: 'scanner_cyan_pulse',
    type: 'SCANNER_FX',
    name: 'Standard Cyan Array',
    nameBn: 'স্ট্যান্ডার্ড সায়ান অ্যারে',
    description: 'Reliable spectral scanner emitting crisp cyan target tracking reticles.',
    descriptionBn: 'সায়ান ট্র্যাকিং রেটিকেল নির্গমনকারী স্ট্যান্ডার্ড স্ক্যানার।',
    unlockType: 'DEFAULT',
    unlockValue: 0,
    unlockCost: 0,
    unlockLevel: 1,
    colors: {
      primary: 0x38bdf8,   // Beam and Reticle color
      secondary: 0x10b981, // Progress arc
      accent: 0xffffff,    // Core beam
    },
  },
  {
    id: 'scanner_quantum_magenta',
    type: 'SCANNER_FX',
    name: 'Quantum Magenta Matrix',
    nameBn: 'কোয়ান্টাম ম্যাজেন্টা ম্যাট্রিক্স',
    description: 'Pulsing magenta scanner beam with high-frequency target lock rings.',
    descriptionBn: 'হাই-ফ্রিকোয়েন্সি টার্গেট লক সহ ম্যাজেন্টা স্ক্যানার বিম।',
    unlockType: 'LEVEL',
    unlockValue: 8,
    unlockCost: 200,
    unlockLevel: 8,
    colors: {
      primary: 0xec4899,   // Magenta color
      secondary: 0xa855f7, // Progress arc
      accent: 0xfdba74,    // Core beam
    },
  },
  {
    id: 'scanner_emerald_sweep',
    type: 'SCANNER_FX',
    name: 'Emerald Aurora Sweep',
    nameBn: 'এমারাল্ড অরোরা সুইপ',
    description: 'Emerald sensor wave highlighting cosmic formations with high contrast.',
    descriptionBn: 'উচ্চ বৈসাদৃশ্যে মহাজাগতিক ফর্মেশন হাইলাইটকারী এমারাল্ড বিম।',
    unlockType: 'LEVEL',
    unlockValue: 12,
    unlockCost: 350,
    unlockLevel: 12,
    colors: {
      primary: 0x10b981,   // Emerald color
      secondary: 0x34d399, // Progress arc
      accent: 0xfef08a,    // Core beam
    },
  },
];

// 4. Passive Exploration Perks Definitions
export const PASSIVE_PERKS: PassivePerkDef[] = [
  {
    id: 'perk_scanner_1',
    name: 'High-Frequency Sensor',
    nameBn: 'হাই-ফ্রিকোয়েন্সি সেন্সর',
    description: 'Increases scanner analysis speed by +20% during galaxy scans.',
    descriptionBn: 'গ্যালাক্সি স্ক্যানের সময় স্ক্যানার বিশ্লেষণের গতি +২০% বাড়ায়।',
    iconName: 'Zap',
    category: 'SCANNER',
    effectType: 'SCAN_SPEED',
    effectValue: 0.20,
    unlockLevel: 3,
  },
  {
    id: 'perk_magnet_1',
    name: 'Attraction Field Boost',
    nameBn: 'অ্যাট্রাকশন ফিল্ড বুস্ট',
    description: 'Expands Stardust collection magnet radius by +30%.',
    descriptionBn: 'স্টারডাস্ট সংগ্রহের ম্যাগনেট ব্যাসার্ধ +৩০% বাড়ায়।',
    iconName: 'Magnet',
    category: 'COLLECTION',
    effectType: 'MAGNET_RANGE',
    effectValue: 0.30,
    unlockLevel: 5,
  },
  {
    id: 'perk_engine_1',
    name: 'Overclocked Thrusters',
    nameBn: 'ওভারক্লকড থ্রাস্টার',
    description: 'Increases maximum sub-light flight velocity by +15%.',
    descriptionBn: 'সর্বোচ্চ সাব-লাইট উড্ডয়ন বেগ +১৫% বাড়ায়।',
    iconName: 'Rocket',
    category: 'PROPULSION',
    effectType: 'MAX_SPEED',
    effectValue: 0.15,
    unlockLevel: 7,
  },
  {
    id: 'perk_shield_1',
    name: 'Capacitor Overdrive',
    nameBn: 'ক্যাপাসিটর ওভারড্রাইভ',
    description: 'Accelerates passive shield regeneration rate by +35%.',
    descriptionBn: 'প্যাসিভ শিল্ড পুনর্জন্মের হার +৩৫% ত্বরান্বিত করে।',
    iconName: 'Shield',
    category: 'DEFENSE',
    effectType: 'SHIELD_RECHARGE',
    effectValue: 0.35,
    unlockLevel: 9,
  },
  {
    id: 'perk_xp_1',
    name: 'Curiosity Matrix',
    nameBn: 'কিউরিওসিটি ম্যাট্রিক্স',
    description: 'Grants +25% bonus Explorer XP on galaxy discoveries and quizzes.',
    descriptionBn: 'গ্যালাক্সি আবিষ্কার ও কুইজে +২৫% বোনাস এক্সপ্লোরার এক্সপি প্রদান করে।',
    iconName: 'Award',
    category: 'KNOWLEDGE',
    effectType: 'XP_BONUS',
    effectValue: 0.25,
    unlockLevel: 11,
  },
];
