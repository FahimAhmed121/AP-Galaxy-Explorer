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
  addStardust: (amount: number) => void;
  spendStardust: (amount: number) => void;
  setExplorerName: (name: string) => void;

  // Customization & Perks Actions
  equipCosmetic: (type: CosmeticType, cosmeticId: string) => void;
  unlockCosmetic: (cosmeticId: string) => void;
  toggleEquipPerk: (perkId: string) => void;
  getActivePerkBonus: (effectType: string) => number;

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
  discoveredGalaxyIds: [],
  quizBestScores: {},
  unlockedBadges: [],
  equippedCosmetics: DEFAULT_COSMETICS,
  unlockedCosmetics: ['skin_standard_cobalt', 'thruster_plasma_blue', 'scanner_cyan_pulse'],
  equippedPerks: [],
  unlockedPerks: [],
};

// Helper function to evaluate progression state, level up, badges & unlocks
function evaluateProfileProgression(currentProfile: ExplorerProfile, additionalXp: number, source?: string): ExplorerProfile {
  // 1. Calculate XP bonus from active perks (e.g., Curiosity Matrix)
  let perkXpMultiplier = 1.0;
  if (currentProfile.equippedPerks.includes('perk_xp_1')) {
    perkXpMultiplier += 0.25;
  }
  const xpGained = Math.round(additionalXp * perkXpMultiplier);
  const newXp = currentProfile.xp + xpGained;

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

  const updatedStardust = (currentProfile.stardustReserves || 0) + levelStardustReward;

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

      addStardust: (amount) => {
        if (amount <= 0) return;
        set((state) => {
          const newTotal = (state.profile.stardustReserves || 0) + amount;
          // Grant 2 XP per stardust collected
          const updatedProfile = evaluateProfileProgression(
            { ...state.profile, stardustReserves: newTotal },
            amount * 2,
            'STARDUST_COLLECTION'
          );

          return {
            profile: updatedProfile,
            savedShipState: state.savedShipState
              ? { ...state.savedShipState, stardust: (state.savedShipState.stardust || 0) + amount }
              : null,
          };
        });
      },

      spendStardust: (amount) => {
        if (amount <= 0) return;
        set((state) => {
          const newTotal = Math.max(0, (state.profile.stardustReserves || 0) - amount);
          return {
            profile: { ...state.profile, stardustReserves: newTotal },
            savedShipState: state.savedShipState
              ? { ...state.savedShipState, stardust: Math.max(0, (state.savedShipState.stardust || 0) - amount) }
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
          profile: { ...state.profile, name: name.trim() || 'COSMIC EXPLORER' },
        })),

      saveShipState: (ship) => set({ savedShipState: ship }),

      resetProgress: () => {
        set({
          profile: DEFAULT_PROFILE,
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
        const p = persistedState?.profile || {};
        const mergedProfile: ExplorerProfile = {
          name: p.name || DEFAULT_PROFILE.name,
          rankTitle: p.rankTitle || DEFAULT_PROFILE.rankTitle,
          xp: p.xp || DEFAULT_PROFILE.xp,
          level: p.level || 1,
          totalScore: p.totalScore || DEFAULT_PROFILE.totalScore,
          stardustReserves: p.stardustReserves ?? DEFAULT_PROFILE.stardustReserves,
          discoveredGalaxyIds: p.discoveredGalaxyIds || DEFAULT_PROFILE.discoveredGalaxyIds,
          quizBestScores: p.quizBestScores || DEFAULT_PROFILE.quizBestScores,
          unlockedBadges: p.unlockedBadges || DEFAULT_PROFILE.unlockedBadges,
          equippedCosmetics: {
            shipSkin: p.equippedCosmetics?.shipSkin || DEFAULT_COSMETICS.shipSkin,
            thrusterFx: p.equippedCosmetics?.thrusterFx || DEFAULT_COSMETICS.thrusterFx,
            scannerFx: p.equippedCosmetics?.scannerFx || DEFAULT_COSMETICS.scannerFx,
          },
          unlockedCosmetics: p.unlockedCosmetics || DEFAULT_PROFILE.unlockedCosmetics,
          equippedPerks: p.equippedPerks || DEFAULT_PROFILE.equippedPerks,
          unlockedPerks: p.unlockedPerks || DEFAULT_PROFILE.unlockedPerks,
        };

        const evaluatedProfile = evaluateProfileProgression(mergedProfile, 0, 'STORAGE_REHYDRATION');

        return {
          ...currentState,
          ...persistedState,
          profile: evaluatedProfile,
        };
      },
    }
  )
);
