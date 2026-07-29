export class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class GalaxyNotFoundError extends AppError {
  constructor(galaxyId: string) {
    super(`Galaxy with ID '${galaxyId}' was not found in catalog.`, 'GALAXY_NOT_FOUND');
    this.name = 'GalaxyNotFoundError';
  }
}

export class AudioInitializationError extends AppError {
  constructor(reason: string) {
    super(`Failed to initialize Web Audio Engine: ${reason}`, 'AUDIO_INIT_ERROR');
    this.name = 'AudioInitializationError';
  }
}
