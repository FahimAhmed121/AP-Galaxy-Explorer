export type GameEventType =
  | 'SHIP_HEALTH_CHANGED'
  | 'SHIP_SHIELD_CHANGED'
  | 'STARDUST_COLLECTED'
  | 'GALAXY_PROXIMITY_ENTER'
  | 'GALAXY_PROXIMITY_EXIT'
  | 'WARP_JUMP_TRIGGERED'
  | 'GAME_OVER_TRIGGERED';

export interface GameEventPayloads {
  SHIP_HEALTH_CHANGED: { current: number; max: number };
  SHIP_SHIELD_CHANGED: { current: number; max: number };
  STARDUST_COLLECTED: { amount: number; total: number };
  GALAXY_PROXIMITY_ENTER: { galaxyId: string; galaxyName: string };
  GALAXY_PROXIMITY_EXIT: { galaxyId: string };
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
