import { Galaxy } from '../../core/types';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { EducationalContent } from '../../data/educational/types';
import { getEducationalContent } from '../../data/educational/contentPipeline';

export type LearningState = 'IDLE' | 'LOADING' | 'PRESENTING' | 'COMPLETED';

export class LearningController {
  private state: LearningState = 'IDLE';
  private currentGalaxy: Galaxy | null = null;
  private currentContent: EducationalContent | null = null;
  private currentCardIndex: number = 0;
  private startTime: number = 0;

  private handleDiscoveryReady = async (payload: { galaxyData: Galaxy }) => {
    // If state is not IDLE, force reset to IDLE first to ensure learning briefing always launches
    if (this.state !== 'IDLE') {
      logger.warn(`LearningController: DISCOVERY_READY received while state was [${this.state}]. Resetting to IDLE.`);
      this.resetState();
    }

    logger.info(`LearningController: Received DISCOVERY_READY for [${payload.galaxyData.name}]. Initializing briefing pipeline.`);
    await this.startBriefing(payload.galaxyData);
  };

  private resetState = () => {
    this.state = 'IDLE';
    this.currentGalaxy = null;
    this.currentContent = null;
    this.currentCardIndex = 0;
  };

  constructor() {
    logger.info('LearningController: Learning Controller initialized.');
    this.setupListeners();
  }

  private setupListeners(): void {
    eventBus.on('DISCOVERY_READY', this.handleDiscoveryReady);
    eventBus.on('LEARNING_COMPLETED', this.resetState);
    eventBus.on('QUIZ_STARTED', this.resetState);
    eventBus.on('QUIZ_COMPLETED', this.resetState);
    eventBus.on('RESUME_GAMEPLAY', this.resetState);
    eventBus.on('RESET_GAME', this.resetState);
  }

  public async startBriefing(galaxy: Galaxy): Promise<void> {
    this.currentGalaxy = galaxy;
    this.state = 'LOADING';
    this.currentCardIndex = 0;
    this.startTime = Date.now();

    try {
      const content = await getEducationalContent(galaxy);
      this.currentContent = content;
      this.state = 'PRESENTING';

      eventBus.emit('LEARNING_STARTED', {
        galaxyId: galaxy.id,
        galaxyName: galaxy.name,
        totalCards: content.cards.length,
        content,
      });

      logger.info(`LearningController: Briefing started for [${galaxy.name}] with ${content.cards.length} cards.`);
    } catch (error) {
      logger.error(`LearningController: Failed to load content for [${galaxy.id}]`, error);
      this.state = 'IDLE';
    }
  }

  public nextCard(): boolean {
    if (this.state !== 'PRESENTING' || !this.currentContent) return false;

    if (this.currentCardIndex < this.currentContent.cards.length - 1) {
      this.currentCardIndex++;
      this.emitCardChanged();
      return true;
    } else {
      // Reached final card
      this.completeLearning();
      return false;
    }
  }

  public previousCard(): boolean {
    if (this.state !== 'PRESENTING' || !this.currentContent) return false;

    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.emitCardChanged();
      return true;
    }
    return false;
  }

  public goToCard(index: number): boolean {
    if (this.state !== 'PRESENTING' || !this.currentContent) return false;

    if (index >= 0 && index < this.currentContent.cards.length) {
      this.currentCardIndex = index;
      this.emitCardChanged();
      return true;
    }
    return false;
  }

  public completeLearning(): void {
    if (this.state !== 'PRESENTING' || !this.currentGalaxy) return;

    const timeSpent = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
    const galaxyData = this.currentGalaxy;

    this.state = 'COMPLETED';

    eventBus.emit('LEARNING_COMPLETED', {
      galaxyId: galaxyData.id,
      galaxyData,
      timeSpentSeconds: timeSpent,
    });

    logger.info(`LearningController: Briefing completed for [${galaxyData.name}] in ${timeSpent}s.`);

    // Reset state to IDLE
    this.state = 'IDLE';
    this.currentGalaxy = null;
    this.currentContent = null;
    this.currentCardIndex = 0;
  }

  private emitCardChanged(): void {
    if (!this.currentContent || !this.currentGalaxy) return;

    const total = this.currentContent.cards.length;
    const progressPct = Math.round(((this.currentCardIndex + 1) / total) * 100);

    eventBus.emit('LEARNING_CARD_CHANGED', {
      galaxyId: this.currentGalaxy.id,
      currentCardIndex: this.currentCardIndex,
      totalCards: total,
      progressPercentage: progressPct,
    });
  }

  public getState(): LearningState {
    return this.state;
  }

  public getCurrentCardIndex(): number {
    return this.currentCardIndex;
  }

  public getTotalCards(): number {
    return this.currentContent?.cards.length || 0;
  }

  public destroy(): void {
    eventBus.off('DISCOVERY_READY', this.handleDiscoveryReady);
    eventBus.off('LEARNING_COMPLETED', this.resetState);
    eventBus.off('QUIZ_STARTED', this.resetState);
    eventBus.off('QUIZ_COMPLETED', this.resetState);
    eventBus.off('RESUME_GAMEPLAY', this.resetState);
    eventBus.off('RESET_GAME', this.resetState);
    this.currentGalaxy = null;
    this.currentContent = null;
  }
}
