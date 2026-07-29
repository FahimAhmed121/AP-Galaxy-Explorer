import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Galaxy, Spaceship, GameSettings, ExplorerProfile } from '../types';
import { GALAXIES } from '../data/galaxies';

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
  
  // Progress Actions
  discoverGalaxy: (galaxyId: string) => void;
  recordQuizScore: (galaxyId: string, score: number, maxScore: number) => void;
  setExplorerName: (name: string) => void;
  saveShipState: (ship: Spaceship) => void;
  resetProgress: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  sfxVolume: 0.8,
  bgmVolume: 0.5,
  language: 'EN',
};

const DEFAULT_PROFILE: ExplorerProfile = {
  name: 'COSMIC EXPLORER',
  rankTitle: 'Space Cadet',
  xp: 0,
  totalScore: 0,
  stardustReserves: 0,
  discoveredGalaxyIds: [],
  quizBestScores: {},
  unlockedBadges: [],
};

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

      discoverGalaxy: (galaxyId) => {
        set((state) => {
          if (state.profile.discoveredGalaxyIds.includes(galaxyId)) return state;
          const newDiscovered = [...state.profile.discoveredGalaxyIds, galaxyId];
          
          // Compute XP and Rank Title
          const xp = newDiscovered.length * 250;
          let rankTitle = 'Space Cadet';
          if (newDiscovered.length >= 7) rankTitle = 'Master Galactic Voyager';
          else if (newDiscovered.length >= 5) rankTitle = 'Senior Astro Navigator';
          else if (newDiscovered.length >= 3) rankTitle = 'Cosmic Explorer';
          else if (newDiscovered.length >= 1) rankTitle = 'Starlight Scout';

          return {
            profile: {
              ...state.profile,
              discoveredGalaxyIds: newDiscovered,
              xp: Math.max(state.profile.xp, xp),
              rankTitle,
            },
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

          // Also make sure galaxy is marked as discovered
          const discovered = state.profile.discoveredGalaxyIds.includes(galaxyId)
            ? state.profile.discoveredGalaxyIds
            : [...state.profile.discoveredGalaxyIds, galaxyId];

          return {
            profile: {
              ...state.profile,
              discoveredGalaxyIds: discovered,
              quizBestScores: updatedScores,
              totalScore: state.profile.totalScore + score * 100,
            },
          };
        });
      },

      setExplorerName: (name) =>
        set((state) => ({
          profile: { ...state.profile, name: name.trim() || 'COSMIC EXPLORER' },
        })),

      saveShipState: (ship) => set({ savedShipState: ship }),

      resetProgress: () =>
        set({
          profile: DEFAULT_PROFILE,
          savedShipState: null,
          gameState: 'MENU',
        }),
    }),
    {
      name: 'ap_galaxy_explorer_store_v1',
      partialize: (state) => ({
        settings: state.settings,
        profile: state.profile,
        savedShipState: state.savedShipState,
      }),
    }
  )
);
