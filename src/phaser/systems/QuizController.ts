import { Galaxy, QuizQuestion } from '../../core/types';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { getQuizQuestions } from '../../data/educational/quizPipeline';
import { useGameStore } from '../../store/useGameStore';

export type QuizState = 'IDLE' | 'LOADING' | 'INTRO' | 'QUESTION' | 'FEEDBACK' | 'RESULTS' | 'COMPLETED';

export interface AnswerRecord {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
  timeTakenSeconds: number;
}

export class QuizController {
  private state: QuizState = 'IDLE';
  private currentGalaxy: Galaxy | null = null;
  private questions: QuizQuestion[] = [];
  private currentIndex: number = 0;
  
  // Active Question Answer state
  private selectedOption: number | null = null;
  private isCorrect: boolean | null = null;

  // Analytics & Metrics
  private score: number = 0;
  private streak: number = 0;
  private maxStreak: number = 0;
  private quizStartTime: number = 0;
  private questionStartTime: number = 0;
  private answerRecords: AnswerRecord[] = [];

  constructor() {
    logger.info('QuizController: System initialized.');
    this.setupListeners();
  }

  private setupListeners(): void {
    eventBus.on('LEARNING_COMPLETED', this.handleLearningCompleted);
    eventBus.on('RESET_GAME', this.handleReset);
    eventBus.on('RESUME_GAMEPLAY', this.handleReset);
  }

  private handleReset = () => {
    this.state = 'IDLE';
    this.currentGalaxy = null;
    this.questions = [];
    this.selectedOption = null;
    this.isCorrect = null;
    this.resetMetrics();
  };

  private handleLearningCompleted = async (payload: { galaxyId: string; galaxyData: Galaxy }) => {
    logger.info(`QuizController: Received LEARNING_COMPLETED for [${payload.galaxyData.name}]. Preparing assessment.`);
    // Automatically load quiz data so it's warm
    await getQuizQuestions(payload.galaxyData);
  };

  /**
   * Initialize and start a new mission assessment quiz for a galaxy.
   */
  public async startQuiz(galaxy: Galaxy): Promise<void> {
    this.currentGalaxy = galaxy;
    this.state = 'LOADING';
    this.resetMetrics();

    try {
      const questions = await getQuizQuestions(galaxy);
      if (!questions || questions.length === 0) {
        logger.error(`QuizController: No quiz questions available for [${galaxy.id}]`);
        this.state = 'IDLE';
        return;
      }

      this.questions = questions;
      this.state = 'INTRO';
      this.quizStartTime = Date.now();

      eventBus.emit('QUIZ_STARTED', {
        galaxyId: galaxy.id,
        galaxyName: galaxy.name,
        totalQuestions: questions.length,
        questions: this.questions,
      });

      logger.info(`QuizController: Quiz started for [${galaxy.name}] with ${questions.length} questions.`);
    } catch (error) {
      logger.error(`QuizController: Failed to load quiz for [${galaxy.id}]`, error);
      this.state = 'IDLE';
    }
  }

  /**
   * Transition from AURA Intro to the first question.
   */
  public beginQuestions(): boolean {
    if (this.state !== 'INTRO' || this.questions.length === 0) return false;
    this.currentIndex = 0;
    this.state = 'QUESTION';
    this.questionStartTime = Date.now();
    return true;
  }

  /**
   * Submit an answer for the current question.
   */
  public submitAnswer(selectedOptionIndex: number): boolean {
    if (this.state !== 'QUESTION' || !this.currentGalaxy || this.selectedOption !== null) {
      return false;
    }

    const currentQ = this.questions[this.currentIndex];
    if (!currentQ) return false;

    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - this.questionStartTime) / 1000));
    const isCorrect = selectedOptionIndex === currentQ.correctAnswer;

    this.selectedOption = selectedOptionIndex;
    this.isCorrect = isCorrect;

    if (isCorrect) {
      this.score += 1;
      this.streak += 1;
      if (this.streak > this.maxStreak) {
        this.maxStreak = this.streak;
      }
    } else {
      this.streak = 0;
    }

    this.answerRecords.push({
      questionIndex: this.currentIndex,
      selectedOption: selectedOptionIndex,
      isCorrect,
      timeTakenSeconds,
    });

    this.state = 'FEEDBACK';

    eventBus.emit('QUESTION_ANSWERED', {
      galaxyId: this.currentGalaxy.id,
      questionIndex: this.currentIndex,
      selectedOption: selectedOptionIndex,
      isCorrect,
      currentScore: this.score,
      streak: this.streak,
      timeTakenSeconds,
    });

    logger.info(`QuizController: Question ${this.currentIndex + 1} answered. Correct: ${isCorrect}, Score: ${this.score}, Streak: ${this.streak}`);
    return true;
  }

  /**
   * Advance to the next question or complete assessment.
   */
  public nextQuestion(): void {
    if (this.state !== 'FEEDBACK') return;

    this.selectedOption = null;
    this.isCorrect = null;

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex += 1;
      this.state = 'QUESTION';
      this.questionStartTime = Date.now();
    } else {
      this.evaluateResults();
    }
  }

  /**
   * Evaluate final score and pass/fail status (Passing requirement = 80%).
   */
  private evaluateResults(): void {
    if (!this.currentGalaxy || this.questions.length === 0) return;

    const totalQuestions = this.questions.length;
    const accuracy = Math.round((this.score / totalQuestions) * 100);
    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - this.quizStartTime) / 1000));
    const passed = accuracy >= 80;

    this.state = 'RESULTS';

    // Record score in global state store
    try {
      useGameStore.getState().recordQuizScore(this.currentGalaxy.id, this.score, totalQuestions);
    } catch (e) {
      logger.warn('QuizController: Failed to update Zustand store', e);
    }

    if (passed) {
      eventBus.emit('QUIZ_PASSED', {
        galaxyId: this.currentGalaxy.id,
        score: this.score,
        accuracy,
        totalTimeSeconds,
        maxStreak: this.maxStreak,
      });
    } else {
      eventBus.emit('QUIZ_FAILED', {
        galaxyId: this.currentGalaxy.id,
        score: this.score,
        accuracy,
        totalTimeSeconds,
        maxStreak: this.maxStreak,
        requiredAccuracy: 80,
      });
    }

    eventBus.emit('QUIZ_COMPLETED', {
      galaxyId: this.currentGalaxy.id,
      passed,
      score: this.score,
      accuracy,
      totalTimeSeconds,
    });

    logger.info(`QuizController: Assessment completed for [${this.currentGalaxy.name}]. Passed: ${passed}, Accuracy: ${accuracy}%`);
  }

  /**
   * Retry the current assessment.
   */
  public retryQuiz(): void {
    if (!this.currentGalaxy) return;
    this.resetMetrics();
    this.state = 'QUESTION';
    this.quizStartTime = Date.now();
    this.questionStartTime = Date.now();
  }

  private resetMetrics(): void {
    this.currentIndex = 0;
    this.selectedOption = null;
    this.isCorrect = null;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.answerRecords = [];
  }

  /**
   * Getters for Controller state
   */
  public getState(): QuizState {
    return this.state;
  }

  public getCurrentGalaxy(): Galaxy | null {
    return this.currentGalaxy;
  }

  public getCurrentQuestion(): QuizQuestion | null {
    return this.questions[this.currentIndex] || null;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getTotalQuestions(): number {
    return this.questions.length;
  }

  public getScore(): number {
    return this.score;
  }

  public getStreak(): number {
    return this.streak;
  }

  public getMaxStreak(): number {
    return this.maxStreak;
  }

  public getAccuracy(): number {
    if (this.questions.length === 0) return 0;
    return Math.round((this.score / this.questions.length) * 100);
  }

  public getSelectedOption(): number | null {
    return this.selectedOption;
  }

  public getIsCorrect(): boolean | null {
    return this.isCorrect;
  }

  public destroy(): void {
    this.handleReset();
  }
}

// Global instance export for convenience
export const quizController = new QuizController();
