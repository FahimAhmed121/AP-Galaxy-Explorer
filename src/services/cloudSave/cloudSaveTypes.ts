/**
 * Cloud Save Data Transfer Objects (DTO)
 * Represents the whitelisted, clean, serializable cloud payload stored in Firestore.
 */

export interface CloudSaveProfileDTO {
  schemaVersion: number;        // Current schema version: 1
  appVersion: string;           // Current application version: e.g. "2.5.0"
  updatedAt: number;            // Client / Unix timestamp in ms
  
  // Pilot Identity
  name: string;
  rankTitle: string;
  
  // Progression Metrics
  xp: number;
  level: number;
  stardustReserves: number;
  totalScore: number;
  
  // Collections & Unlocks
  discoveredGalaxyIds: string[];
  unlockedBadges: string[];
  unlockedCosmetics: string[];
  equippedCosmetics: {
    shipSkin: string;
    thrusterFx: string;
    scannerFx: string;
  };
  unlockedPerks: string[];
  equippedPerks: string[];
  
  // Educational Performance
  quizBestScores: Record<string, number>;
  
  // Lifetime Statistics
  dronesDefeated: number;
  droneEncountersCount: number;
}

export interface CloudSaveMetadataDTO {
  createdAt: number;
  lastLoginAt: number;
  platform: 'web' | 'electron';
  email: string | null;
}

export interface CloudSavePayload {
  profile: CloudSaveProfileDTO;
  metadata: CloudSaveMetadataDTO;
}
