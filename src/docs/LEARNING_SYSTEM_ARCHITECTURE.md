# Educational Learning Layer Architecture (Sprint 1.9)

This document specifies the architectural design, content pipeline, controller system, UI architecture, JSON schema, multilingual strategy, and future assessment integration for the **Educational Learning Layer** in AP Galaxy Explorer.

---

## 1. Executive Summary & Design Philosophy

The Educational Learning Layer transforms scientific discovery into an engaging, immersive briefing from AURA (Astronomical Universal Research Assistant). Designed around NASA mission control aesthetics:
- **Briefing Interface**: Full-screen glassmorphism modal featuring live AURA dialogue and high-contrast typography.
- **Card System**: Modular paginated cards broken down into Overview, Formation, Structure, History, and Facts.
- **JSON Pipeline**: Asynchronous lazy loading of educational content per galaxy to scale seamlessly across hundreds of celestial targets.
- **Decoupled Architecture**: `LearningController` manages state and logic, emitting events via `EventBus` while React components render the UI independently.

---

## 2. System Flow & Architecture

```
┌─────────────────────────┐               DISCOVERY_READY               ┌───────────────────────────┐
│ DiscoveryController     ├────────────────────────────────────────────►│ LearningController        │
└─────────────────────────┘                                             │ (State & Logic Controller)│
                                                                        └─────────────┬─────────────┘
                                                                                      │
                                                                 Lazy Loads JSON &    │
                                                                 Emits Events         │
                                                                                      ▼
                        ┌─────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────┐
                        │                                                             │                                                             │
                        ▼                                                             ▼                                                             ▼
           ┌──────────────────────────┐                                  ┌──────────────────────────┐                                  ┌──────────────────────────┐
           │ ContentPipeline          │                                  │ EventBus & Audio System  │                                  │ React Briefing Interface │
           │ (Lazy JSON / Dynamic)    │                                  │ (Chimes, Card Flip SFX)  │                                  │ (Cards, Progress, AURA)  │
           └──────────────────────────┘                                  └──────────────────────────┘                                  └──────────────────────────┘
```

---

## 3. Learning State Machine (`LearningState`)

`LearningController` operates as a 4-stage state machine:

```
                            DISCOVERY_READY
                                   │
                                   ▼
                              ┌──────────┐
                              │   IDLE   │
                              └────┬─────┘
                                   │
                                   ▼
                             ┌───────────┐
                             │  LOADING  │  (Asynchronously fetches educational JSON via ContentPipeline)
                             └─────┬─────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │  PRESENTING   │  (Active card view; fires LEARNING_STARTED & LEARNING_CARD_CHANGED)
                           └───────┬───────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │   COMPLETED   │  (Fires LEARNING_COMPLETED; prepares quiz transition)
                           └───────────────┘
```

---

## 4. Educational Content JSON Schema Specification

Educational files are stored in `/src/data/educational/` as JSON or generated dynamically.

```json
{
  "galaxyId": "milky-way",
  "galaxyName": "Milky Way Galaxy",
  "auraIntro": "Welcome home, Explorer. Review the classified briefing on our home galaxy.",
  "overview": "The Milky Way is a barred spiral galaxy...",
  "formation": "Formed approximately 13.6 billion years ago...",
  "structure": "Barred spiral with two major arms...",
  "distance": "0 Light Years",
  "diameter": "100,000 Light Years",
  "age": "13.6 Billion Years",
  "constellation": "Sagittarius (Galactic Center)",
  "discoveryHistory": "Observed since antiquity...",
  "observationTips": "Best viewed on clear, moonless summer nights...",
  "funFacts": ["Fact 1...", "Fact 2..."],
  "quizReferences": ["milky-way-q1", "milky-way-q2"],
  "cards": [
    {
      "id": "milky-way-card-1",
      "title": "Galactic Overview & Home Base",
      "subtitle": "Barred Spiral Architecture",
      "category": "OVERVIEW",
      "body": "The Milky Way is our cosmic home...",
      "keyMetrics": [
        { "label": "CLASSIFICATION", "value": "Barred Spiral (SBbc)" },
        { "label": "DISTANCE FROM EARTH", "value": "0 Light Years" }
      ],
      "visualPlaceholder": {
        "title": "Milky Way Panoramic Composite",
        "caption": "All-sky infrared survey.",
        "assetType": "TELESCOPE_IMAGE",
        "url": "https://..."
      }
    }
  ],
  "translations": {
    "BN": {
      "galaxyName": "মিল্কিওয়ে গ্যালাক্সি",
      "auraIntro": "স্বাগতম অভিযাত্রী। আমাদের নিজস্ব গ্যালাক্সির বৈজ্ঞানিক তথ্য পর্যালোচনার জন্য প্রস্তুত।"
    }
  }
}
```

---

## 5. EventBus Specification

| Event Name | Trigger Condition | Payload Definition |
| :--- | :--- | :--- |
| `LEARNING_STARTED` | Content loaded and presentation opened | `{ galaxyId: string, galaxyName: string, totalCards: number, content: EducationalContent }` |
| `LEARNING_CARD_CHANGED` | User navigates to next/previous card | `{ galaxyId: string, currentCardIndex: number, totalCards: number, progressPercentage: number }` |
| `LEARNING_COMPLETED` | User completes final card or finishes briefing | `{ galaxyId: string, galaxyData: Galaxy, timeSpentSeconds: number }` |

---

## 6. Accessibility & Keyboard Navigation

- `ArrowRight` / `Space` / `D` : Advance to next card.
- `ArrowLeft` / `A` : Return to previous card.
- `Enter` : Complete briefing on final card.
- `Escape` : Complete briefing / close modal safely.
- Scalable text with responsive grid layout and high-contrast color palette.

---

## 7. Multilingual Strategy & Future Quiz Integration

1. **Multilingual Architecture**:
   - The JSON schema contains a `translations` object allowing localization across languages (e.g., Bengali `BN`, Spanish `ES`).
   - `ContentPipeline` reads `GameSettings.language` to automatically hydrate localized card strings.
2. **Sprint 2.0 Quiz Integration**:
   - `LEARNING_COMPLETED` carries `timeSpentSeconds` and `galaxyData`.
   - The game scene intercepts `LEARNING_COMPLETED` and seamlessly transitions into the interactive **Astrophysics Quiz Engine** pre-populated with questions mapped in `quizReferences`.
