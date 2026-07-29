export type LearningCardCategory =
  | 'OVERVIEW'
  | 'FORMATION'
  | 'STRUCTURE'
  | 'HISTORY'
  | 'FACTS';

export interface KeyMetric {
  label: string;
  value: string;
  hint?: string;
}

export interface VisualPlaceholder {
  title: string;
  caption: string;
  assetType: 'TELESCOPE_IMAGE' | 'FORMATION_DIAGRAM' | 'SPECTRAL_CHART' | 'ARTIST_CONCEPT';
  url?: string;
}

export interface LearningCard {
  id: string;
  title: string;
  subtitle: string;
  category: LearningCardCategory;
  body: string;
  keyMetrics?: KeyMetric[];
  bulletPoints?: string[];
  visualPlaceholder?: VisualPlaceholder;
}

export interface EducationalContent {
  galaxyId: string;
  galaxyName: string;
  auraIntro: string;
  overview: string;
  formation: string;
  structure: string;
  distance: string;
  diameter: string;
  age: string;
  constellation: string;
  discoveryHistory: string;
  observationTips: string;
  funFacts: string[];
  cards: LearningCard[];
  quizReferences: string[];
  translations?: Record<string, Partial<EducationalContent>>;
}
