import { Galaxy } from '../../core/types';
import { EducationalContent, LearningCard } from './types';

import milkyWayData from './milky-way.json';
import andromedaData from './andromeda.json';
import sombreroData from './sombrero.json';
import whirlpoolData from './whirlpool.json';
import triangulumData from './triangulum.json';
import blackEyeData from './black-eye.json';
import pinwheelData from './pinwheel.json';
import cartwheelData from './cartwheel.json';
import lmcData from './large-magellanic-cloud.json';
import smcData from './small-magellanic-cloud.json';

/**
 * Registry of educational content loaders.
 */
const staticContentRegistry: Record<string, EducationalContent> = {
  'milky-way': milkyWayData as unknown as EducationalContent,
  'andromeda': andromedaData as unknown as EducationalContent,
  'sombrero': sombreroData as unknown as EducationalContent,
  'whirlpool': whirlpoolData as unknown as EducationalContent,
  'triangulum': triangulumData as unknown as EducationalContent,
  'black-eye': blackEyeData as unknown as EducationalContent,
  'pinwheel': pinwheelData as unknown as EducationalContent,
  'cartwheel': cartwheelData as unknown as EducationalContent,
  'large-magellanic-cloud': lmcData as unknown as EducationalContent,
  'small-magellanic-cloud': smcData as unknown as EducationalContent,
};

/**
 * Content Pipeline Cache to store loaded educational briefings in memory.
 */
const contentCache = new Map<string, EducationalContent>();

/**
 * Lazy loads educational content for a galaxy. Fallback generator builds a full 5-card
 * structured briefing if dedicated JSON file is missing.
 */
export async function getEducationalContent(galaxy: Galaxy): Promise<EducationalContent> {
  if (contentCache.has(galaxy.id)) {
    return contentCache.get(galaxy.id)!;
  }

  if (staticContentRegistry[galaxy.id]) {
    const content = staticContentRegistry[galaxy.id];
    contentCache.set(galaxy.id, content);
    return content;
  }

  // Fallback: Dynamically generate educational briefing from Galaxy metadata
  const generated = generateEducationalBriefing(galaxy);
  contentCache.set(galaxy.id, generated);
  return generated;
}

/**
 * Generates a full 5-card NASA briefing for any galaxy dynamically.
 */
export function generateEducationalBriefing(galaxy: Galaxy): EducationalContent {
  const cards: LearningCard[] = [
    {
      id: `${galaxy.id}-card-1`,
      title: 'Galactic Overview',
      subtitle: 'Classification & Spatial Profile',
      category: 'OVERVIEW',
      body: galaxy.description || `The ${galaxy.name} is a magnificent celestial structure located in the constellation ${galaxy.constellation}. Spanning ${galaxy.diameter}, it represents a vital research focal point for astrophysicists studying deep-space evolution.`,
      keyMetrics: [
        { label: 'CLASSIFICATION', value: galaxy.type || 'Spiral Galaxy' },
        { label: 'CONSTELLATION', value: galaxy.constellation || 'Deep Space' },
        { label: 'DISTANCE FROM EARTH', value: galaxy.distance || 'Unknown' },
        { label: 'DIAMETER', value: galaxy.diameter || '100,000 Light Years' },
      ],
      visualPlaceholder: {
        title: 'NASA Optical Observation',
        caption: `Composite image of ${galaxy.name} captured across visible and infrared spectra.`,
        assetType: 'TELESCOPE_IMAGE',
        url: galaxy.realImageUrl,
      },
    },
    {
      id: `${galaxy.id}-card-2`,
      title: 'Formation & Cosmic Origins',
      subtitle: 'Gravitational Collapse & Accretion History',
      category: 'FORMATION',
      body: `Estimated to be ${galaxy.age || '10-13 Billion Years'} old, ${galaxy.name} condensed from primal hydrogen and helium clouds during the early epoch of cosmic expansion. Over billions of years, density waves drove star-forming activity throughout its structure.`,
      bulletPoints: [
        'Initiated via early cosmic dark matter halo gravitational collapse.',
        'Continuous star formation fueled by interstellar gas accretion.',
        'Gravitational interaction with surrounding satellite dwarf galaxies.',
      ],
      visualPlaceholder: {
        title: 'Cosmic Formation Model',
        caption: 'Computer simulation of dark matter and gas cloud condensation.',
        assetType: 'FORMATION_DIAGRAM',
      },
    },
    {
      id: `${galaxy.id}-card-3`,
      title: 'Morphology & Core Dynamics',
      subtitle: 'Stellar Populations & Nuclear Core',
      category: 'STRUCTURE',
      body: `The core of ${galaxy.name} houses a high-density stellar bulge and supermassive black hole candidate. Surrounding stellar disks display complex spiral or elliptical density dynamics with interstellar dust lanes.`,
      keyMetrics: [
        { label: 'ESTIMATED AGE', value: galaxy.age || '13 Billion Years' },
        { label: 'CORE REGION', value: 'Active Galactic Nucleus' },
      ],
      bulletPoints: [
        'Contains older Population II stars within central bulge.',
        'Active starburst nurseries containing young, hot Population I stars.',
        'Surrounded by a vast, diffuse dark matter halo extending far beyond visible stars.',
      ],
      visualPlaceholder: {
        title: 'Spectrographic Analysis',
        caption: 'Infrared & X-Ray emission profiles mapping core density.',
        assetType: 'SPECTRAL_CHART',
      },
    },
    {
      id: `${galaxy.id}-card-4`,
      title: 'Observational History',
      subtitle: 'Historical Discovery & Amateur Telescope Guidance',
      category: 'HISTORY',
      body: `Deep space astronomical surveys have tracked ${galaxy.name} across centuries. Observers using ground-based observatories and space instruments like Hubble and JWST continue to analyze its spectral signatures.`,
      bulletPoints: [
        'Best observed under dark sky conditions with high-aperture telescopes.',
        'Infrared imaging reveals hidden stellar nurseries behind dust clouds.',
        'Spectroscopic redshift measurements confirm precise cosmic distance.',
      ],
      visualPlaceholder: {
        title: 'JWST Infrared Concept',
        caption: 'Artist rendering of multi-spectrum telescope alignment.',
        assetType: 'ARTIST_CONCEPT',
      },
    },
    {
      id: `${galaxy.id}-card-5`,
      title: 'Astrophysical Highlights',
      subtitle: 'Key Scientific Findings & Cosmic Curiosities',
      category: 'FACTS',
      body: `Key scientific discoveries regarding ${galaxy.name} continue to refine our understanding of galactic physics and cosmic expansion.`,
      bulletPoints: galaxy.funFacts && galaxy.funFacts.length > 0
        ? galaxy.funFacts
        : [
            `Distanced at ${galaxy.distance} from our solar system.`,
            `Spans across a vast diameter of ${galaxy.diameter}.`,
            'Serves as an essential milestone in mapping cosmic web structures.',
          ],
      visualPlaceholder: {
        title: 'Astrophysics Data Summary',
        caption: 'Verified dataset saved to NASA Knowledge Archive.',
        assetType: 'TELESCOPE_IMAGE',
      },
    },
  ];

  return {
    galaxyId: galaxy.id,
    galaxyName: galaxy.name,
    auraIntro: `Explorer, scientific verification of ${galaxy.name} is complete. Review this briefing before taking your assessment.`,
    overview: galaxy.description || '',
    formation: `Condensed approximately ${galaxy.age} ago during early epoch.`,
    structure: `Classified as ${galaxy.type} with a diameter of ${galaxy.diameter}.`,
    distance: galaxy.distance,
    diameter: galaxy.diameter,
    age: galaxy.age,
    constellation: galaxy.constellation,
    discoveryHistory: `Tracked in constellation ${galaxy.constellation}.`,
    observationTips: 'Best observed via mid-to-high aperture telescopes or infrared space platforms.',
    funFacts: galaxy.funFacts || [],
    cards,
    quizReferences: [galaxy.id],
  };
}
