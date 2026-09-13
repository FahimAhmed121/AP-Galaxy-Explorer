import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Galaxy, Spaceship, GameSettings, ExplorerProfile, EquippedCosmetics } from '../types';
import { GALAXIES } from '../data/galaxies';
import {
  PROGRESSION_LEVELS,
  EXPLORER_BADGES,
  SHIP_SKINS,
  THRUSTER_FX,
  SCANNER_FX,
  PASSIVE_PERKS,
  CosmeticType,
} from '../data/progressionData';
import { eventBus } from '../core/events';
import { logger } from '../core/logger';

interface GameStoreState {
  // Navigation
  gameState: GameState;
  selectedGalaxy: Galaxy | null;

  // Settings
  settings: GameSettings;

  // Profile & Progress
  profile: ExplorerProfile;

  // Active Ship state
  savedShipState: Spaceship | null;

  // Actions
  setGameState: (state: GameState) => void;
  setSelectedGalaxy: (galaxy: Galaxy | null) => void;
  updateSettings: (partialSettings: Partial<GameSettings>) => void;
  toggleSound: () => void;
  setLanguage: (lang: 'EN' | 'BN') => void;
  
  // Progression & XP Actions
  addXP: (amount: number, source?: string) => void;
  discoverGalaxy: (galaxyId: string) => void;
  recordQuizScore: (galaxyId: string, score: number, maxScore: number) => void;
  recordDroneDefeated: (stardustReward: number, xpReward: number) => void;
  recordDroneEncounter: () => void;
  addStardust: (amount: number) => void;
  spendStardust: (amount: number) => void;
  setExplorerName: (name: string) => void;

  // Customization & Perks Actions
  equipCosmetic: (type: CosmeticType, cosmeticId: string) => void;
  unlockCosmetic: (cosmeticId: string) => void;
  toggleEquipPerk: (perkId: string) => void;
  getActivePerkBonus: (effectType: string) => number;

  setStardustLastSynced: (amount: number) => void;
  updateProfileFromCloud: (updatedProfile: ExplorerProfile) => void;

  saveShipState: (ship: Spaceship) => void;
  resetProgress: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  sfxVolume: 0.8,
  bgmVolume: 0.5,
  language: 'EN',
};

const DEFAULT_COSMETICS: EquippedCosmetics = {
  shipSkin: 'skin_standard_cobalt',
  thrusterFx: 'thruster_plasma_blue',
  scannerFx: 'scanner_cyan_pulse',
};

const DEFAULT_PROFILE: ExplorerProfile = {
  name: 'COSMIC EXPLORER',
  rankTitle: 'Space Cadet',
  xp: 0,
  level: 1,
  totalScore: 0,
  stardustReserves: 0,
  stardustLastSynced: 0,
  discoveredGalaxyIds: [],
  quizBestScores: {},
  unlockedBadges: [],
  dronesDefeated: 0,
  droneEncountersCount: 0,
  equippedCosmetics: DEFAULT_COSMETICS,
  unlockedCosmetics: ['skin_standard_cobalt', 'thruster_plasma_blue', 'scanner_cyan_pulse'],
  equippedPerks: [],
  unlockedPerks: [],
};

// Helper function to evaluate progression state, level up, badges & unlocks
function evaluateProfileProgression(currentProfile: ExplorerProfile, additionalXp: number, source?: string): ExplorerProfile {
  // 1. Calculate XP bonus from active perks (e.g., Curiosity Matrix)
  let perkXpMultiplier = 1.0;
  if (currentProfile.equippedPerks?.includes('perk_xp_1')) {
    perkXpMultiplier += 0.25;
  }
  const safeAdditionalXp = Number.isFinite(additionalXp) ? Math.max(0, Math.floor(additionalXp)) : 0;
  const xpGained = Math.round(safeAdditionalXp * perkXpMultiplier);
  const currentXp = Number.isFinite(currentProfile.xp) ? Math.max(0, Math.floor(currentProfile.xp)) : 0;
  const newXp = currentXp + xpGained;

  // 2. Evaluate current Level from XP
  let newLevel = 1;
  let newRankTitle = PROGRESSION_LEVELS[0].rankTitle;
  let levelStardustReward = 0;

  for (let i = PROGRESSION_LEVELS.length - 1; i >= 0; i--) {
    if (newXp >= PROGRESSION_LEVELS[i].xpRequired) {
      newLevel = PROGRESSION_LEVELS[i].level;
      newRankTitle = PROGRESSION_LEVELS[i].rankTitle;
      break;
    }
  }

  const isLevelUp = newLevel > (currentProfile.level || 1);

  // Collect newly unlocked items from levels
  const newlyUnlockedCosmetics = [...(currentProfile.unlockedCosmetics || [])];
  const newlyUnlockedPerks = [...(currentProfile.unlockedPerks || [])];

  if (isLevelUp) {
    for (let lvl = (currentProfile.level || 1) + 1; lvl <= newLevel; lvl++) {
      const lvlDef = PROGRESSION_LEVELS.find((l) => l.level === lvl);
      if (lvlDef) {
        if (lvlDef.stardustReward > 0) {
          levelStardustReward += lvlDef.stardustReward;
        }
        if (lvlDef.unlockedCosmetics) {
          lvlDef.unlockedCosmetics.forEach((cId) => {
            if (!newlyUnlockedCosmetics.includes(cId)) newlyUnlockedCosmetics.push(cId);
          });
        }
        if (lvlDef.unlockedPerks) {
          lvlDef.unlockedPerks.forEach((pId) => {
            if (!newlyUnlockedPerks.includes(pId)) newlyUnlockedPerks.push(pId);
          });
        }
      }
    }

    eventBus.emit('PROGRESSION_LEVEL_UP', {
      level: newLevel,
      rankTitle: newRankTitle,
      stardustReward: levelStardustReward,
    });
  }

  const currentStardust = Number.isFinite(currentProfile.stardustReserves) ? Math.max(0, currentProfile.stardustReserves) : 0;
  const updatedStardust = currentStardust + levelStardustReward;

  // 3. Evaluate Badges
  const tempProfileState = {
    ...currentProfile,
    xp: newXp,
    level: newLevel,
    rankTitle: newRankTitle,
    stardustReserves: updatedStardust,
    unlockedCosmetics: newlyUnlockedCosmetics,
    unlockedPerks: newlyUnlockedPerks,
  };

  const currentBadgeIds = currentProfile.unlockedBadges || [];
  const newlyEarnedBadgeIds: string[] = [];

  EXPLORER_BADGES.forEach((badge) => {
    if (!currentBadgeIds.includes(badge.id)) {
      if (badge.checkUnlocked(tempProfileState)) {
        newlyEarnedBadgeIds.push(badge.id);
        eventBus.emit('BADGE_UNLOCKED', {
          badgeId: badge.id,
          title: badge.title,
          description: badge.description,
          iconName: badge.iconName,
        });
      }
    }
  });

  const allBadges = [...currentBadgeIds, ...newlyEarnedBadgeIds];

  // Also check perks unlocked by level
  PASSIVE_PERKS.forEach((perk) => {
    if (newLevel >= perk.unlockLevel && !newlyUnlockedPerks.includes(perk.id)) {
      newlyUnlockedPerks.push(perk.id);
    }
  });

  // Emit XP gained event
  if (xpGained > 0) {
    eventBus.emit('PROGRESSION_XP_GAINED', {
      amount: xpGained,
      totalXp: newXp,
      source,
    });
  }

  return {
    ...tempProfileState,
    xp: newXp,
    level: newLevel,
    rankTitle: newRankTitle,
    stardustReserves: updatedStardust,
    unlockedBadges: allBadges,
    unlockedCosmetics: newlyUnlockedCosmetics,
    unlockedPerks: newlyUnlockedPerks,
    updatedAt: Date.now(),
  };
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      gameState: 'MENU',
      selectedGalaxy: null,
      settings: DEFAULT_SETTINGS,
      profile: DEFAULT_PROFILE,
      savedShipState: null,

      setGameState: (state) => set({ gameState: state }),
      setSelectedGalaxy: (galaxy) => set({ selectedGalaxy: galaxy }),

      updateSettings: (partialSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...partialSettings },
        })),

      toggleSound: () =>
        set((state) => ({
          settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
        })),

      setLanguage: (lang) =>
        set((state) => ({
          settings: { ...state.settings, language: lang },
        })),

      addXP: (amount, source) => {
        if (amount <= 0) return;
        set((state) => {
          const updatedProfile = evaluateProfileProgression(state.profile, amount, source);
          return { profile: updatedProfile };
        });
      },

      discoverGalaxy: (galaxyId) => {
        set((state) => {
          if (state.profile.discoveredGalaxyIds.includes(galaxyId)) return state;
          const newDiscovered = [...state.profile.discoveredGalaxyIds, galaxyId];
          const discoveryBonusStardust = 75;

          const baseProfile = {
            ...state.profile,
            discoveredGalaxyIds: newDiscovered,
            stardustReserves: (state.profile.stardustReserves || 0) + discoveryBonusStardust,
          };

          // 300 base XP for discovery
          const updatedProfile = evaluateProfileProgression(baseProfile, 300, 'GALAXY_DISCOVERY');

          return {
            profile: updatedProfile,
            savedShipState: state.savedShipState
              ? { ...state.savedShipState, stardust: (state.savedShipState.stardust || 0) + discoveryBonusStardust }
              : null,
          };
        });
      },

      recordQuizScore: (galaxyId, score, maxScore) => {
        set((state) => {
          const currentBest = state.profile.quizBestScores[galaxyId] || 0;
          const newBest = Math.max(currentBest, score);
          const isPerfect = score === maxScore;

          const updatedScores = {
            ...state.profile.quizBestScores,
            [galaxyId]: newBest,
          };

          const discovered = state.profile.discoveredGalaxyIds.includes(galaxyId)
            ? state.profile.discoveredGalaxyIds
            : [...state.profile.discoveredGalaxyIds, galaxyId];

          const stardustReward = score * 15 + (isPerfect ? 35 : 0);
          const baseProfile = {
            ...state.profile,
            discoveredGalaxyIds: discovered,
            quizBestScores: updatedScores,
            totalScore: state.profile.totalScore + score * 100,
            stardustReserves: (state.profile.stardustReserves || 0) + stardustReward,
          };

          // XP: 100 per correct answer + 100 bonus for perfect score
          const xpEarned = score * 100 + (isPerfect ? 100 : 0);
          const updatedProfile = evaluateProfileProgression(baseProfile, xpEarned, 'QUIZ_PASSED');

          return {
            profile: updatedProfile,
            savedShipState: state.savedShipState
              ? { ...state.savedShipState, stardust: (state.savedShipState.stardust || 0) + stardustReward }
              : null,
          };
        });
      },

      recordDroneDefeated: (stardustReward, xpReward) => {
        set((state) => {
          const currentDefeated = (state.profile.dronesDefeated || 0) + 1;
          const newStardust = (state.profile.stardustReserves || 0) + stardustReward;
          const baseProfile = {
            ...state.profile,
            dronesDefeated: currentDefeated,
            totalScore: state.profile.totalScore + 250,
            stardustReserves: newStardust,
          };

          const updatedProfile = evaluateProfileProgression(baseProfile, xpReward, 'DRONE_DEFECTED');

          return {
            profile: updatedProfile,
            savedShipState: state.savedShipState
              ? { ...state.savedShipState, stardust: (state.savedShipState.stardust || 0) + stardustReward }
              : null,
          };
        });
      },

      recordDroneEncounter: () => {
        set((state) => ({
          profile: {
            ...state.profile,
            droneEncountersCount: (state.profile.droneEncountersCount || 0) + 1,
            updatedAt: Date.now(),
          },
        }));
      },

      addStardust: (amount) => {
        if (amount <= 0 || !Number.isFinite(amount)) return;
        set((state) => {
          const currentReserves = Number.isFinite(state.profile.stardustReserves) ? state.profile.stardustReserves : 0;
          const newTotal = currentReserves + Math.floor(amount);
          // Grant 2 XP per stardust collected
          const updatedProfile = evaluateProfileProgression(
            { ...state.profile, stardustReserves: newTotal },
            amount * 2,
            'STARDUST_COLLECTION'
          );

          return {
            profile: updatedProfile,
            savedShipState: state.savedShipState
              ? { ...state.savedShipState, stardust: (state.savedShipState.stardust || 0) + Math.floor(amount) }
              : null,
          };
        });
      },

      spendStardust: (amount) => {
        if (amount <= 0 || !Number.isFinite(amount)) return;
        set((state) => {
          const currentReserves = Number.isFinite(state.profile.stardustReserves) ? state.profile.stardustReserves : 0;
          const newTotal = Math.max(0, currentReserves - Math.floor(amount));
          return {
            profile: { ...state.profile, stardustReserves: newTotal, updatedAt: Date.now() },
            savedShipState: state.savedShipState
              ? { ...state.savedShipState, stardust: Math.max(0, (state.savedShipState.stardust || 0) - Math.floor(amount)) }
              : null,
          };
        });
      },

      equipCosmetic: (type, cosmeticId) => {
        set((state) => {
          const currentEquipped = state.profile.equippedCosmetics || DEFAULT_COSMETICS;
          let newEquipped = { ...currentEquipped };

          if (type === 'SHIP_SKIN') newEquipped.shipSkin = cosmeticId;
          else if (type === 'THRUSTER_FX') newEquipped.thrusterFx = cosmeticId;
          else if (type === 'SCANNER_FX') newEquipped.scannerFx = cosmeticId;

          eventBus.emit('COSMETICS_CHANGED', { equippedCosmetics: newEquipped });

          return {
            profile: {
              ...state.profile,
              equippedCosmetics: newEquipped,
              updatedAt: Date.now(),
            },
          };
        });
      },

      unlockCosmetic: (cosmeticId) => {
        set((state) => {
          const unlocked = state.profile.unlockedCosmetics || [];
          if (unlocked.includes(cosmeticId)) return state;

          return {
            profile: {
              ...state.profile,
              unlockedCosmetics: [...unlocked, cosmeticId],
              updatedAt: Date.now(),
            },
          };
        });
      },

      toggleEquipPerk: (perkId) => {
        set((state) => {
          const currentEquipped = state.profile.equippedPerks || [];
          const MAX_EQUIPPED_PERKS = 2; // Allow up to 2 active passive perks simultaneously

          let newEquipped: string[];
          if (currentEquipped.includes(perkId)) {
            newEquipped = currentEquipped.filter((id) => id !== perkId);
          } else {
            if (currentEquipped.length >= MAX_EQUIPPED_PERKS) {
              // Replace oldest perk
              newEquipped = [...currentEquipped.slice(1), perkId];
            } else {
              newEquipped = [...currentEquipped, perkId];
            }
          }

          return {
            profile: {
              ...state.profile,
              equippedPerks: newEquipped,
              updatedAt: Date.now(),
            },
          };
        });
      },

      getActivePerkBonus: (effectType) => {
        const { profile } = get();
        const equipped = profile.equippedPerks || [];
        let totalBonus = 0;

        equipped.forEach((perkId) => {
          const perkDef = PASSIVE_PERKS.find((p) => p.id === perkId);
          if (perkDef && perkDef.effectType === effectType) {
            totalBonus += perkDef.effectValue;
          }
        });

        return totalBonus;
      },

      setExplorerName: (name) =>
        set((state) => ({
          profile: {
            ...state.profile,
            name: name.trim() || 'COSMIC EXPLORER',
            updatedAt: Date.now(),
          },
        })),

      setStardustLastSynced: (amount) =>
        set((state) => ({
          profile: {
            ...state.profile,
            stardustLastSynced: Number.isFinite(amount) ? Math.max(0, amount) : 0,
            updatedAt: Date.now(),
          },
        })),

      updateProfileFromCloud: (updatedProfile) =>
        set({
          profile: updatedProfile,
        }),

      saveShipState: (ship) => set({ savedShipState: ship }),

      resetProgress: () => {
        set({
          profile: { ...DEFAULT_PROFILE, updatedAt: Date.now() },
          savedShipState: null,
          gameState: 'MENU',
        });
        eventBus.emit('RESET_GAME');
      },
    }),
    {
      name: 'ap_galaxy_explorer_store_v1',
      partialize: (state) => ({
        settings: state.settings,
        profile: state.profile,
        savedShipState: state.savedShipState,
      }),
      // Migration & Fallback for existing save state in localStorage
      merge: (persistedState: any, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }

        const p = persistedState.profile || {};
        const safeNum = (n: any, fallback: number) => (typeof n === 'number' && Number.isFinite(n) ? n : fallback);

        const mergedProfile: ExplorerProfile = {
          name: p.name || DEFAULT_PROFILE.name,
          rankTitle: p.rankTitle || DEFAULT_PROFILE.rankTitle,
          xp: safeNum(p.xp, DEFAULT_PROFILE.xp),
          level: safeNum(p.level, 1),
          totalScore: safeNum(p.totalScore, DEFAULT_PROFILE.totalScore),
          stardustReserves: safeNum(p.stardustReserves, DEFAULT_PROFILE.stardustReserves),
          stardustLastSynced: safeNum(p.stardustLastSynced, safeNum(p.stardustReserves, 0)),
          discoveredGalaxyIds: Array.isArray(p.discoveredGalaxyIds) ? p.discoveredGalaxyIds : DEFAULT_PROFILE.discoveredGalaxyIds,
          quizBestScores: p.quizBestScores && typeof p.quizBestScores === 'object' ? p.quizBestScores : DEFAULT_PROFILE.quizBestScores,
          unlockedBadges: Array.isArray(p.unlockedBadges) ? p.unlockedBadges : DEFAULT_PROFILE.unlockedBadges,
          dronesDefeated: safeNum(p.dronesDefeated, 0),
          droneEncountersCount: safeNum(p.droneEncountersCount, 0),
          equippedCosmetics: {
            shipSkin: p.equippedCosmetics?.shipSkin || DEFAULT_COSMETICS.shipSkin,
            thrusterFx: p.equippedCosmetics?.thrusterFx || DEFAULT_COSMETICS.thrusterFx,
            scannerFx: p.equippedCosmetics?.scannerFx || DEFAULT_COSMETICS.scannerFx,
          },
          unlockedCosmetics: Array.isArray(p.unlockedCosmetics) ? p.unlockedCosmetics : DEFAULT_PROFILE.unlockedCosmetics,
          equippedPerks: Array.isArray(p.equippedPerks) ? p.equippedPerks : DEFAULT_PROFILE.equippedPerks,
          unlockedPerks: Array.isArray(p.unlockedPerks) ? p.unlockedPerks : DEFAULT_PROFILE.unlockedPerks,
          updatedAt: safeNum(p.updatedAt, Date.now()),
        };

        const evaluatedProfile = evaluateProfileProgression(mergedProfile, 0, 'STORAGE_REHYDRATION');

        return {
          ...currentState,
          settings: {
            ...DEFAULT_SETTINGS,
            ...(persistedState.settings || {}),
          },
          savedShipState: persistedState.savedShipState !== undefined ? persistedState.savedShipState : currentState.savedShipState,
          profile: evaluatedProfile,
        };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          logger.error('Zustand store rehydration error from localStorage:', error);
        } else {
          logger.info('Zustand store rehydrated successfully from localStorage.', {
            profileName: state?.profile?.name,
            level: state?.profile?.level,
            xp: state?.profile?.xp,
            discoveredGalaxies: state?.profile?.discoveredGalaxyIds?.length,
          });
        }
      },
    }
  )
);
