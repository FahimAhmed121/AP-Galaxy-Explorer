import { ExplorerProfile } from '../../core/types';
import { CloudSaveProfileDTO } from './cloudSaveTypes';
import { PROGRESSION_LEVELS } from '../../data/progressionData';

export interface ConflictResolutionResult {
  mergedProfile: ExplorerProfile;
  stardustLastSynced: number;
}

/**
 * CloudSaveResolver
 * Implements field-by-field deterministic conflict resolution between local state and cloud state.
 */
export class CloudSaveResolver {
  /**
   * Merge local ExplorerProfile state with cloud CloudSaveProfileDTO.
   * Ensures additive set union for unlocks, monotonic max for XP/Counters/Quiz scores,
   * and net-delta reconciliation for Stardust currency.
   */
  static merge(
    localProfile: ExplorerProfile,
    cloudProfileDTO: CloudSaveProfileDTO,
    localUpdatedAt: number = Date.now()
  ): ConflictResolutionResult {
    // 1. Sets & Collections (Additive Union A ∪ B)
    const discoveredGalaxyIds = Array.from(
      new Set([...(localProfile.discoveredGalaxyIds || []), ...(cloudProfileDTO.discoveredGalaxyIds || [])])
    );

    const unlockedBadges = Array.from(
      new Set([...(localProfile.unlockedBadges || []), ...(cloudProfileDTO.unlockedBadges || [])])
    );

    const unlockedCosmetics = Array.from(
      new Set([...(localProfile.unlockedCosmetics || []), ...(cloudProfileDTO.unlockedCosmetics || [])])
    );

    const unlockedPerks = Array.from(
      new Set([...(localProfile.unlockedPerks || []), ...(cloudProfileDTO.unlockedPerks || [])])
    );

    // 2. Monotonic XP & Level Progression
    const reconciledXp = Math.max(localProfile.xp || 0, cloudProfileDTO.xp || 0);
    let reconciledLevel = 1;
    let reconciledRankTitle = PROGRESSION_LEVELS[0].rankTitle;

    for (let i = PROGRESSION_LEVELS.length - 1; i >= 0; i--) {
      if (reconciledXp >= PROGRESSION_LEVELS[i].xpRequired) {
        reconciledLevel = PROGRESSION_LEVELS[i].level;
        reconciledRankTitle = PROGRESSION_LEVELS[i].rankTitle;
        break;
      }
    }

    // 3. Per-Item Quiz Best Scores (Key-by-Key Max)
    const quizBestScores: Record<string, number> = { ...(cloudProfileDTO.quizBestScores || {}) };
    Object.entries(localProfile.quizBestScores || {}).forEach(([galaxyId, score]) => {
      quizBestScores[galaxyId] = Math.max(quizBestScores[galaxyId] || 0, score || 0);
    });

    // 4. Lifetime Cumulative Counters (Conservative Max)
    const dronesDefeated = Math.max(localProfile.dronesDefeated || 0, cloudProfileDTO.dronesDefeated || 0);
    const droneEncountersCount = Math.max(localProfile.droneEncountersCount || 0, cloudProfileDTO.droneEncountersCount || 0);
    const totalScore = Math.max(localProfile.totalScore || 0, cloudProfileDTO.totalScore || 0);

    // 5. Stardust Currency Net-Delta Reconciliation
    const stardustLastSynced = localProfile.stardustLastSynced ?? localProfile.stardustReserves ?? 0;
    const localDelta = (localProfile.stardustReserves || 0) - stardustLastSynced;
    const reconciledStardust = Math.max(0, (cloudProfileDTO.stardustReserves || 0) + localDelta);
    const newStardustLastSynced = reconciledStardust;

    // 6. Timestamp Preference for Customization & Callsign
    const isCloudNewer = cloudProfileDTO.updatedAt > localUpdatedAt;

    const name = isCloudNewer ? (cloudProfileDTO.name || localProfile.name) : localProfile.name;
    const equippedCosmetics = isCloudNewer
      ? {
          shipSkin: cloudProfileDTO.equippedCosmetics?.shipSkin || localProfile.equippedCosmetics?.shipSkin || 'skin_standard_cobalt',
          thrusterFx: cloudProfileDTO.equippedCosmetics?.thrusterFx || localProfile.equippedCosmetics?.thrusterFx || 'thruster_plasma_blue',
          scannerFx: cloudProfileDTO.equippedCosmetics?.scannerFx || localProfile.equippedCosmetics?.scannerFx || 'scanner_cyan_pulse',
        }
      : localProfile.equippedCosmetics;

    const equippedPerks = isCloudNewer
      ? cloudProfileDTO.equippedPerks || localProfile.equippedPerks || []
      : localProfile.equippedPerks;

    const mergedProfile: ExplorerProfile = {
      name,
      rankTitle: reconciledRankTitle,
      xp: reconciledXp,
      level: reconciledLevel,
      stardustReserves: reconciledStardust,
      stardustLastSynced: newStardustLastSynced,
      totalScore,
      discoveredGalaxyIds,
      quizBestScores,
      unlockedBadges,
      dronesDefeated,
      droneEncountersCount,
      equippedCosmetics,
      unlockedCosmetics,
      equippedPerks,
      unlockedPerks,
    };

    return {
      mergedProfile,
      stardustLastSynced: newStardustLastSynced,
    };
  }
}
