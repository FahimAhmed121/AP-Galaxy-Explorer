# Quiz System Architecture — Astronomy Pathshala (AP Galaxy Explorer)

## 1. System Overview & Goals

The Adaptive Quiz & Scientific Assessment System forms the final phase of the educational gameplay loop in AP Galaxy Explorer. Rather than resembling a generic classroom test, the system is designed as a **NASA Mission Debriefing & Telemetry Assessment** administered by AURA (Automated Universal Research Assistant).

### Key Architectural Objectives:
* **Decoupled Architecture**: Strict separation of data/logic (`QuizController.ts`) from visual rendering (`QuizAssessmentModal.tsx`).
* **NASA Mission Console Aesthetic**: High-contrast, minimal dark-tech HUD styling with scanline effects and clean typography.
* **Calm & Scientific Persona**: AURA provides non-judgmental, analytical feedback for both correct and incorrect answers.
* **Flexible Question Architecture**: Supports `MULTIPLE_CHOICE` natively with structural support for `TRUE_FALSE` and `IMAGE_QUESTION`.
* **Bilingual Support**: Dynamic runtime language toggling between English (EN) and Bengali (BN).
* **Non-Destructive Progress**: Failing an assessment (<80%) never revokes galaxy discovery status. Players may review briefings and retry anytime.

---

## 2. Architecture & Data Flow

```
[ LearningBriefingModal / GalaxyInfo ]
                   │
                   ▼ (Invokes startQuiz)
         [ QuizController ]
                   │
  ┌────────────────┼────────────────┐
  │ (Lazy Load)    │ (State Update)  │ (Emit Events)
  ▼                ▼                ▼
[ quizPipeline ] [ State Machine ] [ EventBus ]
  (Cache/JSON)     (Score/Time)     (QUIZ_STARTED,
                                     QUESTION_ANSWERED,
                                     QUIZ_PASSED / FAILED,
                                     QUIZ_COMPLETED)
                                    │
                                    ▼
                         [ QuizAssessmentModal ]
                                    │
                                    ▼ (Store Best Score)
                           [ useGameStore ]
```

---

## 3. Quiz Controller Specification (`src/phaser/systems/QuizController.ts`)

The `QuizController` class manages all data fetching, question state, timing, and metric computations.

### State Machine States:
1. `IDLE`: Controller is inactive.
2. `LOADING`: Lazy-loading quiz questions for target galaxy.
3. `INTRO`: Displaying AURA Mission Assessment Briefing.
4. `QUESTION`: Active question evaluation view.
5. `FEEDBACK`: Immediate answer feedback view.
6. `RESULTS`: Calculating final accuracy, streak, and pass/fail state.
7. `COMPLETED`: Assessment session ended.

### Core Controller API:
```ts
class QuizController {
  public async startQuiz(galaxy: Galaxy): Promise<void>;
  public beginQuestions(): boolean;
  public submitAnswer(selectedOptionIndex: number): boolean;
  public nextQuestion(): void;
  public retryQuiz(): void;
  public destroy(): void;

  // Getters
  public getState(): QuizState;
  public getCurrentQuestion(): QuizQuestion | null;
  public getScore(): number;
  public getStreak(): number;
  public getAccuracy(): number;
}
```

---

## 4. Quiz Data Schema (`src/core/types.ts`)

```ts
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'IMAGE_QUESTION';

export interface QuizQuestion {
  id?: string;
  type?: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed option key
  explanation: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
  imageUrl?: string;
  banglaTranslation?: {
    question: string;
    options: string[];
    explanation: string;
  };
}
```

---

## 5. Event Bus Interface

The quiz system communicates asynchronously via `eventBus`:

| Event Name | Payload Description |
| :--- | :--- |
| `QUIZ_STARTED` | Emitted on quiz initialization with galaxy info and question count. |
| `QUESTION_ANSWERED` | Emitted on option submit with correctness, score, streak, and response latency. |
| `QUIZ_PASSED` | Emitted if final score accuracy is ≥ 80%. |
| `QUIZ_FAILED` | Emitted if final score accuracy is < 80%. |
| `QUIZ_COMPLETED` | Emitted at the end of assessment with summary metrics. |

---

## 6. NASA Mission Console UI (`src/components/hud/QuizAssessmentModal.tsx`)

### Keyboard Navigation & Shortcuts:
* `1`, `2`, `3`, `4` or `A`, `B`, `C`, `D`: Select option choice.
* `Enter`: Confirm answer / Advance to next question / Begin assessment.
* `Escape`: Abort assessment modal.

### Reduced Motion Support:
Detects `prefers-reduced-motion` and disables pulsing borders, bouncing icons, and entrance animations for full accessibility compliance.

---

## 7. Progression & Reward Integration (Sprint 2.3)

* **Explorer XP Integration**: Passing a quiz awards +50 Explorer XP (+25 bonus XP for 100% accuracy). XP rewards are scaled by +25% when the *Curiosity Matrix* passive perk (`perk_xp_1`) is unlocked.
* **Merit Badge Evaluation**:
  * `Curious Scholar` (`badge_curious_mind`): Unlocks on completing first quiz assessment.
  * `Perfect Scholar` (`badge_perfect_score`): Unlocks when achieving 100% accuracy on any galaxy quiz, dynamically evaluated against the target galaxy quiz question count (`score >= maxScore`).
* **Stardust Rewards**: +15 Stardust per correct answer + 25 Stardust bonus for 100% accuracy.

