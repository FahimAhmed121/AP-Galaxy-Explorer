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
   * net-delta reconciliation for Stardust currency, and timestamp precedence for customization.
   */
  static merge(
    localProfile: ExplorerProfile,
    cloudProfileDTO: CloudSaveProfileDTO,
    localUpdatedAt?: number
  ): ConflictResolutionResult {
    const toSafeNum = (n: any, fallback = 0) => (typeof n === 'number' && Number.isFinite(n) ? n : fallback);

    // 1. Sets & Collections (Additive Union A ∪ B)
    const discoveredGalaxyIds = Array.from(
      new Set([...(localProfile.discoveredGalaxyIds || []), ...(cloudProfileDTO.discoveredGalaxyIds || [])])
    ).filter((id): id is string => typeof id === 'string' && id.length <= 50);

    const unlockedBadges = Array.from(
      new Set([...(localProfile.unlockedBadges || []), ...(cloudProfileDTO.unlockedBadges || [])])
    ).filter((id): id is string => typeof id === 'string' && id.length <= 50);

    const unlockedCosmetics = Array.from(
      new Set([...(localProfile.unlockedCosmetics || []), ...(cloudProfileDTO.unlockedCosmetics || [])])
    ).filter((id): id is string => typeof id === 'string' && id.length <= 50);

    const unlockedPerks = Array.from(
      new Set([...(localProfile.unlockedPerks || []), ...(cloudProfileDTO.unlockedPerks || [])])
    ).filter((id): id is string => typeof id === 'string' && id.length <= 50);

    // 2. Monotonic XP & Level Progression
    const localXp = toSafeNum(localProfile.xp, 0);
    const cloudXp = toSafeNum(cloudProfileDTO.xp, 0);
    const reconciledXp = Math.max(0, Math.max(localXp, cloudXp));

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
    const quizBestScores: Record<string, number> = {};
    if (cloudProfileDTO.quizBestScores && typeof cloudProfileDTO.quizBestScores === 'object') {
      Object.entries(cloudProfileDTO.quizBestScores).forEach(([galaxyId, score]) => {
        if (typeof galaxyId === 'string') {
          quizBestScores[galaxyId] = toSafeNum(score, 0);
        }
      });
    }
    if (localProfile.quizBestScores && typeof localProfile.quizBestScores === 'object') {
      Object.entries(localProfile.quizBestScores).forEach(([galaxyId, score]) => {
        if (typeof galaxyId === 'string') {
          quizBestScores[galaxyId] = Math.max(quizBestScores[galaxyId] || 0, toSafeNum(score, 0));
        }
      });
    }

    // 4. Lifetime Cumulative Counters (Conservative Max)
    const dronesDefeated = Math.max(0, Math.max(toSafeNum(localProfile.dronesDefeated, 0), toSafeNum(cloudProfileDTO.dronesDefeated, 0)));
    const droneEncountersCount = Math.max(0, Math.max(toSafeNum(localProfile.droneEncountersCount, 0), toSafeNum(cloudProfileDTO.droneEncountersCount, 0)));
    const totalScore = Math.max(0, Math.max(toSafeNum(localProfile.totalScore, 0), toSafeNum(cloudProfileDTO.totalScore, 0)));

    // 5. Stardust Currency Net-Delta Reconciliation
    const localReserves = toSafeNum(localProfile.stardustReserves, 0);
    const stardustLastSynced = toSafeNum(localProfile.stardustLastSynced ?? localProfile.stardustReserves, 0);
    const localDelta = localReserves - stardustLastSynced;
    const cloudReserves = toSafeNum(cloudProfileDTO.stardustReserves, 0);
    const reconciledStardust = Math.max(0, cloudReserves + localDelta);
    const newStardustLastSynced = reconciledStardust;

    // 6. Timestamp Preference for Customization & Callsign
    const effectiveLocalUpdatedAt = typeof localUpdatedAt === 'number' && Number.isFinite(localUpdatedAt)
      ? localUpdatedAt
      : toSafeNum(localProfile.updatedAt, 0);
    const effectiveCloudUpdatedAt = toSafeNum(cloudProfileDTO.updatedAt, 0);

    const isCloudNewer = effectiveCloudUpdatedAt > effectiveLocalUpdatedAt;

    const name = isCloudNewer ? (cloudProfileDTO.name || localProfile.name) : localProfile.name;
    const equippedCosmetics = isCloudNewer
      ? {
          shipSkin: cloudProfileDTO.equippedCosmetics?.shipSkin || localProfile.equippedCosmetics?.shipSkin || 'skin_standard_cobalt',
          thrusterFx: cloudProfileDTO.equippedCosmetics?.thrusterFx || localProfile.equippedCosmetics?.thrusterFx || 'thruster_plasma_blue',
          scannerFx: cloudProfileDTO.equippedCosmetics?.scannerFx || localProfile.equippedCosmetics?.scannerFx || 'scanner_cyan_pulse',
        }
      : localProfile.equippedCosmetics;

    const equippedPerks = isCloudNewer
      ? (Array.isArray(cloudProfileDTO.equippedPerks) ? cloudProfileDTO.equippedPerks : localProfile.equippedPerks || [])
      : (localProfile.equippedPerks || []);

    const mergedUpdatedAt = Math.max(effectiveLocalUpdatedAt, effectiveCloudUpdatedAt, Date.now());

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
      updatedAt: mergedUpdatedAt,
    };

    return {
      mergedProfile,
      stardustLastSynced: newStardustLastSynced,
    };
  }
}
