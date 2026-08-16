import { ExplorerProfile } from '../../core/types';
import { CloudSavePayload, CloudSaveProfileDTO, CloudSaveMetadataDTO } from './cloudSaveTypes';

export const CURRENT_SCHEMA_VERSION = 1;
export const CURRENT_APP_VERSION = '2.5.0';

function toSafeInt(val: any, defaultVal = 0, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  if (typeof val !== 'number' || !Number.isFinite(val)) {
    return defaultVal;
  }
  const intVal = Math.floor(val);
  return Math.min(Math.max(intVal, min), max);
}

/**
 * CloudSaveSerializer
 * Handles deterministic serialization, deserialization, and schema validation
 * between Zustand state (ExplorerProfile) and Firestore CloudSavePayload DTOs.
 */
export class CloudSaveSerializer {
  /**
   * Serialize Zustand ExplorerProfile into clean CloudSavePayload DTO for Firestore
   */
  static serializeCloudSave(
    profile: ExplorerProfile,
    userEmail?: string | null,
    appVersion: string = CURRENT_APP_VERSION
  ): CloudSavePayload {
    const now = Date.now();
    const updatedAt = toSafeInt(profile.updatedAt, now, 0);

    const sanitizedQuizScores: Record<string, number> = {};
    if (profile.quizBestScores && typeof profile.quizBestScores === 'object') {
      Object.entries(profile.quizBestScores).forEach(([k, v]) => {
        if (typeof k === 'string' && k.length <= 50) {
          sanitizedQuizScores[k] = toSafeInt(v, 0, 0, 100);
        }
      });
    }

    const profileDTO: CloudSaveProfileDTO = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      appVersion,
      updatedAt,

      name: (profile.name || 'COSMIC EXPLORER').trim().substring(0, 50),
      rankTitle: (profile.rankTitle || 'Space Cadet').trim().substring(0, 100),

      xp: toSafeInt(profile.xp, 0, 0, 10000000),
      level: toSafeInt(profile.level, 1, 1, 100),
      stardustReserves: toSafeInt(profile.stardustReserves, 0, 0, 10000000),
      totalScore: toSafeInt(profile.totalScore, 0, 0, 100000000),

      discoveredGalaxyIds: Array.from(new Set(profile.discoveredGalaxyIds || []))
        .filter((id): id is string => typeof id === 'string' && id.length <= 50)
        .slice(0, 200),
      unlockedBadges: Array.from(new Set(profile.unlockedBadges || []))
        .filter((id): id is string => typeof id === 'string' && id.length <= 50)
        .slice(0, 100),
      unlockedCosmetics: Array.from(new Set(profile.unlockedCosmetics || []))
        .filter((id): id is string => typeof id === 'string' && id.length <= 50)
        .slice(0, 100),
      equippedCosmetics: {
        shipSkin: typeof profile.equippedCosmetics?.shipSkin === 'string' ? profile.equippedCosmetics.shipSkin : 'skin_standard_cobalt',
        thrusterFx: typeof profile.equippedCosmetics?.thrusterFx === 'string' ? profile.equippedCosmetics.thrusterFx : 'thruster_plasma_blue',
        scannerFx: typeof profile.equippedCosmetics?.scannerFx === 'string' ? profile.equippedCosmetics.scannerFx : 'scanner_cyan_pulse',
      },
      unlockedPerks: Array.from(new Set(profile.unlockedPerks || []))
        .filter((id): id is string => typeof id === 'string' && id.length <= 50)
        .slice(0, 50),
      equippedPerks: Array.from(new Set(profile.equippedPerks || []))
        .filter((id): id is string => typeof id === 'string' && id.length <= 50)
        .slice(0, 2),

      quizBestScores: sanitizedQuizScores,

      dronesDefeated: toSafeInt(profile.dronesDefeated, 0, 0, 100000),
      droneEncountersCount: toSafeInt(profile.droneEncountersCount, 0, 0, 100000),
    };

    const metadataDTO: CloudSaveMetadataDTO = {
      createdAt: now,
      lastLoginAt: now,
      platform: 'web',
      email: userEmail || null,
    };

    return {
      profile: profileDTO,
      metadata: metadataDTO,
    };
  }

  /**
   * Deserialize CloudSaveProfileDTO back into Zustand ExplorerProfile format
   */
  static deserializeCloudSave(payload: CloudSavePayload): ExplorerProfile {
    const dto = payload.profile;

    const sanitizedQuizScores: Record<string, number> = {};
    if (dto.quizBestScores && typeof dto.quizBestScores === 'object') {
      Object.entries(dto.quizBestScores).forEach(([k, v]) => {
        if (typeof k === 'string') {
          sanitizedQuizScores[k] = toSafeInt(v, 0, 0, 100);
        }
      });
    }

    return {
      name: dto.name || 'COSMIC EXPLORER',
      rankTitle: dto.rankTitle || 'Space Cadet',
      xp: toSafeInt(dto.xp, 0, 0, 10000000),
      level: toSafeInt(dto.level, 1, 1, 100),
      stardustReserves: toSafeInt(dto.stardustReserves, 0, 0, 10000000),
      stardustLastSynced: toSafeInt(dto.stardustReserves, 0, 0, 10000000),
      totalScore: toSafeInt(dto.totalScore, 0, 0, 100000000),
      discoveredGalaxyIds: Array.isArray(dto.discoveredGalaxyIds) ? dto.discoveredGalaxyIds : [],
      quizBestScores: sanitizedQuizScores,
      unlockedBadges: Array.isArray(dto.unlockedBadges) ? dto.unlockedBadges : [],
      dronesDefeated: toSafeInt(dto.dronesDefeated, 0, 0, 100000),
      droneEncountersCount: toSafeInt(dto.droneEncountersCount, 0, 0, 100000),
      equippedCosmetics: {
        shipSkin: dto.equippedCosmetics?.shipSkin || 'skin_standard_cobalt',
        thrusterFx: dto.equippedCosmetics?.thrusterFx || 'thruster_plasma_blue',
        scannerFx: dto.equippedCosmetics?.scannerFx || 'scanner_cyan_pulse',
      },
      unlockedCosmetics: Array.isArray(dto.unlockedCosmetics) ? dto.unlockedCosmetics : ['skin_standard_cobalt', 'thruster_plasma_blue', 'scanner_cyan_pulse'],
      equippedPerks: Array.isArray(dto.equippedPerks) ? dto.equippedPerks : [],
      unlockedPerks: Array.isArray(dto.unlockedPerks) ? dto.unlockedPerks : [],
      updatedAt: toSafeInt(dto.updatedAt, Date.now(), 0),
    };
  }

  /**
   * Validate raw data from Firestore against CloudSavePayload structure
   */
  static validateCloudSavePayload(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    const p = data.profile;
    if (!p || typeof p !== 'object') return false;

    if (typeof p.schemaVersion !== 'number' || !Number.isFinite(p.schemaVersion) || p.schemaVersion < 1) return false;
    if (typeof p.name !== 'string') return false;
    if (typeof p.xp !== 'number' || !Number.isFinite(p.xp) || p.xp < 0) return false;
    if (typeof p.level !== 'number' || !Number.isFinite(p.level) || p.level < 1) return false;
    if (typeof p.stardustReserves !== 'number' || !Number.isFinite(p.stardustReserves) || p.stardustReserves < 0) return false;
    if (!Array.isArray(p.discoveredGalaxyIds)) return false;

    return true;
  }
}
