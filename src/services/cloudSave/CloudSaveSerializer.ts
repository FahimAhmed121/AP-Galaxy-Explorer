import { ExplorerProfile } from '../../core/types';
import { CloudSavePayload, CloudSaveProfileDTO, CloudSaveMetadataDTO } from './cloudSaveTypes';

export const CURRENT_SCHEMA_VERSION = 1;
export const CURRENT_APP_VERSION = '2.5.0';

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

    const profileDTO: CloudSaveProfileDTO = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      appVersion,
      updatedAt: now,

      name: (profile.name || 'COSMIC EXPLORER').trim().substring(0, 50),
      rankTitle: profile.rankTitle || 'Space Cadet',

      xp: Math.max(0, Math.floor(profile.xp || 0)),
      level: Math.max(1, Math.floor(profile.level || 1)),
      stardustReserves: Math.max(0, Math.floor(profile.stardustReserves || 0)),
      totalScore: Math.max(0, Math.floor(profile.totalScore || 0)),

      discoveredGalaxyIds: Array.from(new Set(profile.discoveredGalaxyIds || [])).slice(0, 200),
      unlockedBadges: Array.from(new Set(profile.unlockedBadges || [])).slice(0, 100),
      unlockedCosmetics: Array.from(new Set(profile.unlockedCosmetics || [])).slice(0, 100),
      equippedCosmetics: {
        shipSkin: profile.equippedCosmetics?.shipSkin || 'skin_standard_cobalt',
        thrusterFx: profile.equippedCosmetics?.thrusterFx || 'thruster_plasma_blue',
        scannerFx: profile.equippedCosmetics?.scannerFx || 'scanner_cyan_pulse',
      },
      unlockedPerks: Array.from(new Set(profile.unlockedPerks || [])).slice(0, 50),
      equippedPerks: Array.from(new Set(profile.equippedPerks || [])).slice(0, 2),

      quizBestScores: { ...(profile.quizBestScores || {}) },

      dronesDefeated: Math.max(0, Math.floor(profile.dronesDefeated || 0)),
      droneEncountersCount: Math.max(0, Math.floor(profile.droneEncountersCount || 0)),
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

    return {
      name: dto.name || 'COSMIC EXPLORER',
      rankTitle: dto.rankTitle || 'Space Cadet',
      xp: dto.xp || 0,
      level: dto.level || 1,
      stardustReserves: dto.stardustReserves || 0,
      stardustLastSynced: dto.stardustReserves || 0,
      totalScore: dto.totalScore || 0,
      discoveredGalaxyIds: dto.discoveredGalaxyIds || [],
      quizBestScores: dto.quizBestScores || {},
      unlockedBadges: dto.unlockedBadges || [],
      dronesDefeated: dto.dronesDefeated || 0,
      droneEncountersCount: dto.droneEncountersCount || 0,
      equippedCosmetics: {
        shipSkin: dto.equippedCosmetics?.shipSkin || 'skin_standard_cobalt',
        thrusterFx: dto.equippedCosmetics?.thrusterFx || 'thruster_plasma_blue',
        scannerFx: dto.equippedCosmetics?.scannerFx || 'scanner_cyan_pulse',
      },
      unlockedCosmetics: dto.unlockedCosmetics || ['skin_standard_cobalt', 'thruster_plasma_blue', 'scanner_cyan_pulse'],
      equippedPerks: dto.equippedPerks || [],
      unlockedPerks: dto.unlockedPerks || [],
    };
  }

  /**
   * Validate raw data from Firestore against CloudSavePayload structure
   */
  static validateCloudSavePayload(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    const p = data.profile;
    if (!p || typeof p !== 'object') return false;

    if (typeof p.schemaVersion !== 'number' || p.schemaVersion < 1) return false;
    if (typeof p.name !== 'string') return false;
    if (typeof p.xp !== 'number' || p.xp < 0) return false;
    if (typeof p.level !== 'number' || p.level < 1) return false;
    if (typeof p.stardustReserves !== 'number' || p.stardustReserves < 0) return false;
    if (!Array.isArray(p.discoveredGalaxyIds)) return false;

    return true;
  }
}
