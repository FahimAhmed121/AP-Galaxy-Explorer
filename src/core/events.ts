import { Galaxy } from './types';

export type GameEventType =
  | 'PHASER_READY'
  | 'PHASER_DESTROYED'
  | 'PAUSE_GAMEPLAY'
  | 'RESUME_GAMEPLAY'
  | 'SHIP_HEALTH_CHANGED'
  | 'SHIP_SHIELD_CHANGED'
  | 'SHIP_ENERGY_CHANGED'
  | 'SHIP_POSITION_CHANGED'
  | 'SHIP_STATS_CHANGED'
  | 'UPDATE_SHIP_STATS'
  | 'PLAYER_DESTROYED'
  | 'STARDUST_COLLECTED'
  | 'GALAXY_PROXIMITY_ENTER'
  | 'GALAXY_PROXIMITY_EXIT'
  | 'SCAN_STARTED'
  | 'SCAN_PROGRESS'
  | 'SCAN_CANCELLED'
  | 'SCAN_COMPLETED'
  | 'GALAXY_DISCOVERED'
  | 'DISCOVERY_STARTED'
  | 'DISCOVERY_OVERLAY_SHOWN'
  | 'DISCOVERY_READY'
  | 'DISCOVERY_FINISHED'
  | 'LEARNING_STARTED'
  | 'LEARNING_CARD_CHANGED'
  | 'LEARNING_COMPLETED'
  | 'QUIZ_STARTED'
  | 'QUESTION_ANSWERED'
  | 'QUIZ_PASSED'
  | 'QUIZ_FAILED'
  | 'QUIZ_COMPLETED'
  | 'WARP_JUMP_TRIGGERED'
  | 'GAME_OVER_TRIGGERED';

export interface GameEventPayloads {
  PHASER_READY: { sceneKey: string };
  PHASER_DESTROYED: void;
  PAUSE_GAMEPLAY: void;
  RESUME_GAMEPLAY: void;
  SHIP_HEALTH_CHANGED: { current: number; max: number };
  SHIP_SHIELD_CHANGED: { current: number; max: number };
  SHIP_ENERGY_CHANGED: { current: number; max: number };
  SHIP_POSITION_CHANGED: { x: number; y: number; angle: number; speed: number };
  SHIP_STATS_CHANGED: any;
  UPDATE_SHIP_STATS: any;
  PLAYER_DESTROYED: { x: number; y: number };
  STARDUST_COLLECTED: { amount: number; total?: number };
  GALAXY_PROXIMITY_ENTER: { galaxyId: string; galaxyName: string };
  GALAXY_PROXIMITY_EXIT: { galaxyId: string };
  SCAN_STARTED: { targetId: string; targetName: string; duration: number };
  SCAN_PROGRESS: { targetId: string; progress: number; elapsed: number; total: number };
  SCAN_CANCELLED: { targetId: string; reason: string };
  SCAN_COMPLETED: { targetId: string; galaxyData: Galaxy };
  GALAXY_DISCOVERED: { galaxyId: string; galaxyName: string };
  DISCOVERY_STARTED: { galaxyId: string; galaxyName: string; galaxyData: Galaxy };
  DISCOVERY_OVERLAY_SHOWN: { galaxyData: Galaxy; auraText: string };
  DISCOVERY_READY: { galaxyData: Galaxy };
  DISCOVERY_FINISHED: { galaxyId: string };
  LEARNING_STARTED: { galaxyId: string; galaxyName: string; totalCards: number; content: any };
  LEARNING_CARD_CHANGED: { galaxyId: string; currentCardIndex: number; totalCards: number; progressPercentage: number };
  LEARNING_COMPLETED: { galaxyId: string; galaxyData: Galaxy; timeSpentSeconds: number };
  QUIZ_STARTED: { galaxyId: string; galaxyName: string; totalQuestions: number; questions: any[] };
  QUESTION_ANSWERED: { galaxyId: string; questionIndex: number; selectedOption: number; isCorrect: boolean; currentScore: number; streak: number; timeTakenSeconds: number };
  QUIZ_PASSED: { galaxyId: string; score: number; accuracy: number; totalTimeSeconds: number; maxStreak: number };
  QUIZ_FAILED: { galaxyId: string; score: number; accuracy: number; totalTimeSeconds: number; maxStreak: number; requiredAccuracy: number };
  QUIZ_COMPLETED: { galaxyId: string; passed: boolean; score: number; accuracy: number; totalTimeSeconds: number };
  WARP_JUMP_TRIGGERED: { targetGalaxyId: string };
  GAME_OVER_TRIGGERED: { finalScore: number };
}

type EventCallback<T> = (payload: T) => void;

class EventBus {
  private listeners: { [K in GameEventType]?: EventCallback<any>[] } = {};

  on<K extends GameEventType>(event: K, callback: EventCallback<GameEventPayloads[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<K extends GameEventType>(event: K, callback: EventCallback<GameEventPayloads[K]>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback);
  }

  emit<K extends GameEventType>(event: K, payload: GameEventPayloads[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event]!.forEach((cb) => cb(payload));
  }
}

export const eventBus = new EventBus();
