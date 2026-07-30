import { Galaxy, QuizQuestion } from '../../core/types';
import { logger } from '../../core/logger';

// Static quiz database for all core galaxies
const staticQuizRegistry: Record<string, QuizQuestion[]> = {
  'milky-way': [
    {
      id: 'milky-way-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['CLASSIFICATION', 'STRUCTURE'],
      question: 'What morphological classification is assigned to our home Milky Way Galaxy?',
      options: [
        'Unbarred Grand Design Spiral',
        'Barred Spiral Galaxy (SBbc)',
        'Giant Irregular Dwarf Galaxy',
        'Peculiar Ring Galaxy'
      ],
      correctAnswer: 1,
      explanation: 'The Milky Way features a distinct central bar structure composed of stars feeding two major spiral arms, classifying it as a Barred Spiral Galaxy (SBbc).',
      banglaTranslation: {
        question: 'আমাদের মূল মিল্কিওয়ে গ্যালাক্সি কোন ধরনের শ্রেণিবিন্যাসের অন্তর্ভুক্ত?',
        options: [
          'দণ্ডহীন গ্র্যান্ড ডিজাইন সর্পিল',
          'দণ্ডযুক্ত সর্পিল গ্যালাক্সি (SBbc)',
          'দৈত্যাকৃতির অনিয়মিত বামন গ্যালাক্সি',
          'বিশেষ রিং গ্যালাক্সি'
        ],
        explanation: 'মিল্কিওয়ে গ্যালাক্সির কেন্দ্রে একটি বিশিষ্ট তারার বার কাঠামো রয়েছে যা দুটি প্রধান সর্পিল বাহুকে সংযুক্ত করে, যা এটিকে একটি দণ্ডযুক্ত সর্পিল গ্যালাক্সি (SBbc) হিসেবে চিহ্নিত করে।'
      }
    },
    {
      id: 'milky-way-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['BLACK_HOLE', 'CORE'],
      question: 'What celestial object occupies the exact gravitational central core of the Milky Way?',
      options: [
        'Magnetar SGR 1806-20',
        'Sagittarius A* Supermassive Black Hole',
        'Cygnus X-1 Binary System',
        'Proxima Centauri Triple System'
      ],
      correctAnswer: 1,
      explanation: 'Sagittarius A* (Sgr A*) is the supermassive black hole at the center of the Milky Way, possessing approximately 4.1 million solar masses.',
      banglaTranslation: {
        question: 'মিল্কিওয়ের ঠিক মহাকর্ষীয় কেন্দ্রে কোন মহাজাগতিক বস্তুটি অবস্থিত?',
        options: [
          'ম্যাগনেটার SGR 1806-20',
          'স্যাজিটেরিয়াস এ* সুপারম্যাসিভ ব্ল্যাক হোল',
          'সাইগナス X-1 দ্বৈত ব্যবস্থা',
          'প্রক্সিমা সেন্টোরি ট্রিপল সিস্টেম'
        ],
        explanation: 'স্যাজিটেরিয়াস এ* (Sgr A*) হলো মিল্কিওয়ের কেন্দ্রে অবস্থিত একটি অতিবৃহৎ ব্ল্যাক হোল, যার ভর সূর্য থেকে প্রায় ৪১ লাখ গুণ বেশি।'
      }
    },
    {
      id: 'milky-way-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['ORBIT', 'SOLAR_SYSTEM'],
      question: 'How long does it take our Solar System to complete one orbit around the galactic core (a Cosmic Year)?',
      options: [
        '100 Million Earth Years',
        '230 Million Earth Years',
        '500 Million Earth Years',
        '1.2 Billion Earth Years'
      ],
      correctAnswer: 1,
      explanation: 'Traveling at ~828,000 km/h, the Sun takes approximately 230 million Earth years to complete a single revolution around the galactic center.',
      banglaTranslation: {
        question: 'আমাদের সৌরজগতের গ্যালাকটিক কেন্দ্রের চারপাশে একবার ঘুরে আসতে কত সময় লাগে (এক কসমিক বছর)?',
        options: [
          '১০০ মিলিয়ন বছর',
          '২৩০ মিলিয়ন বছর',
          '৫০০ মিলিয়ন বছর',
          '১.২ বিলিয়ন বছর'
        ],
        explanation: 'প্রায় ৮,২৮,০০০ কিমি/ঘণ্টা বেগে ভ্রমণ করে, সূর্যের গ্যালাকটিক কেন্দ্রের চারপাশে একবার ঘুরে আসতে প্রায় ২৩ কোটি বছর সময় লাগে।'
      }
    }
  ],
  'andromeda': [
    {
      id: 'andromeda-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DISTANCE', 'LOCAL_GROUP'],
      question: 'What is the approximate distance from Earth to the Andromeda Galaxy (M31)?',
      options: [
        '100,000 Light Years',
        '2.5 Million Light Years',
        '15 Million Light Years',
        '65 Million Light Years'
      ],
      correctAnswer: 1,
      explanation: 'Andromeda lies approximately 2.5 million light-years away and is the closest major spiral galaxy to the Milky Way.',
      banglaTranslation: {
        question: 'পৃথিবী থেকে অ্যান্ড্রোমিডা গ্যালাক্সির (M31) আনুমানিক দূরত্ব কত?',
        options: [
          '১০০,০০০ আলোকবর্ষ',
          '২.৫ মিলিয়ন আলোকবর্ষ',
          '১৫ মিলিয়ন আলোকবর্ষ',
          '৬৫ মিলিয়ন আলোকবর্ষ'
        ],
        explanation: 'অ্যান্ড্রোমিডা গ্যালাক্সি প্রায় ২৫ লাখ আলোকবর্ষ দূরে অবস্থিত এবং এটি আমাদের মিল্কিওয়ের নিকটতম প্রধান সর্পিল গ্যালাক্সি।'
      }
    },
    {
      id: 'andromeda-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['STARS', 'SCALE'],
      question: 'How many stars is Andromeda estimated to harbor compared to the Milky Way?',
      options: [
        'Over 1 Trillion Stars (More than 2x Milky Way)',
        '10 Billion Stars (1/10th Milky Way)',
        '50 Billion Stars',
        'Equal star count (~200 Billion)'
      ],
      correctAnswer: 0,
      explanation: 'Andromeda hosts roughly 1 trillion stars, vastly outnumbering the Milky Way’s estimated 100-400 billion stars.',
      banglaTranslation: {
        question: 'মিল্কিওয়ের তুলনায় অ্যান্ড্রোমিডায় আনুমানিক কতগুলো নক্ষত্র রয়েছে?',
        options: [
          '১ ট্রিলিয়নেরও বেশি (মিল্কিওয়ের দ্বিগুণেরও বেশি)',
          '১০ বিলিয়ন নক্ষত্র',
          '৫০ বিলিয়ন নক্ষত্র',
          'সমান সংখ্যক নক্ষত্র'
        ],
        explanation: 'অ্যান্ড্রোমিডায় আনুমানিক ১ ট্রিলিয়ন (১ লাখ কোটি) নক্ষত্র রয়েছে, যা মিল্কিওয়ের তুলনায় অর্ধেকেরও বেশি।'
      }
    },
    {
      id: 'andromeda-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['FUTURE', 'COLLISION'],
      question: 'At what relative velocity is Andromeda approaching the Milky Way for their future merger?',
      options: [
        '110 km/s',
        '1,200 km/s',
        '500 km/s',
        '30 km/s'
      ],
      correctAnswer: 0,
      explanation: 'Andromeda is accelerating toward the Milky Way at approximately 110 kilometers per second, leading to a predicted merger in ~4.5 billion years.',
      banglaTranslation: {
        question: 'ভবিষ্যতের একীভূতকরণের জন্য অ্যান্ড্রোমিডা কত আপেক্ষিক বেগে মিল্কিওয়ের দিকে এগিয়ে আসছে?',
        options: [
          '১১০ কিমি/সেকেন্ড',
          '১,২০০ কিমি/সেকেন্ড',
          '৫০০ কিমি/সেকেন্ড',
          '৩০ কিমি/সেকেন্ড'
        ],
        explanation: 'অ্যান্ড্রোমিডা প্রতি সেকেন্ডে প্রায় ১১০ কিলোমিটার বেগে মিল্কিওয়ের দিকে ধাবিত হচ্ছে এবং ৪.৫ বিলিয়ন বছরে মার্জ বা একীভূত হবে।'
      }
    }
  ],
  'sombrero': [
    {
      id: 'sombrero-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['MORPHOLOGY', 'DUST_LANE'],
      question: 'What prominent structural feature gives the Sombrero Galaxy (M104) its distinctive hat-like appearance?',
      options: [
        'A dark, prominent dust lane encircling a massive central bulge',
        'Twin gamma-ray jet bursts projecting from the poles',
        'An outer ring of young blue star clusters without a core',
        'A distorted tidal bridge connecting to a dwarf companion'
      ],
      correctAnswer: 0,
      explanation: 'The Sombrero Galaxy features an extraordinarily bright central nuclear bulge wrapped by a thick, dark lane of interstellar dust.',
      banglaTranslation: {
        question: 'কোন বিশিষ্ট গঠনটি সোমব্রেরো গ্যালাক্সিকে (M104) টুপি সদৃশ রূপ প্রদান করে?',
        options: [
          'একটি বিশাল কেন্দ্রীয় অংশকে ঘিরে থাকা অন্ধকার ধূলিকণার রিং',
          'দুই মেরু থেকে নির্গত গামা-রশ্মি জেস্ট',
          'কেন্দ্রহীন তরুণ নীল তারার রিং',
          'একটি বামন সঙ্গীর সাথে সংযুক্ত জোয়ারের সেতু'
        ],
        explanation: 'সোমব্রেরো গ্যালাক্সিতে একটি বিশাল ও উজ্জ্বল কেন্দ্রীয় অংশ রয়েছে যা ঘন ধূলিকণার অন্ধকার রিং দ্বারা পরিবেষ্টিত।'
      }
    },
    {
      id: 'sombrero-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['GLOBULAR_CLUSTERS', 'HALO'],
      question: 'How many globular clusters populate the vast stellar halo of the Sombrero Galaxy?',
      options: [
        'Nearly 2,000 Globular Clusters (10x Milky Way)',
        'Fewer than 50 Clusters',
        'Over 50,000 Clusters',
        'No globular clusters have been detected'
      ],
      correctAnswer: 0,
      explanation: 'Sombrero possesses an immense globular cluster halo system containing nearly 2,000 clusters, compared to the Milky Way’s ~150.',
      banglaTranslation: {
        question: 'সোমব্রেরো গ্যালাক্সির হ্যালো সিস্টেমে আনুমানিক কতগুলো গ্লোবুলার ক্লাস্টার রয়েছে?',
        options: [
          'প্রায় ২,০০০ গ্লোবুলার ক্লাস্টার (মিল্কিওয়ের ১০ গুণ)',
          '৫০টিরও কম ক্লাস্টার',
          '৫০,০০০ এর বেশি ক্লাস্টার',
          'কোন গ্লোবুলার ক্লাস্টার পাওয়া যায়নি'
        ],
        explanation: 'সোমব্রেরো গ্যালাক্সির সুবিশাল হ্যালোতে প্রায় ২,০০০ গ্লোবুলার ক্লাস্টার রয়েছে, যা মিল্কিওয়ের ১৫০টির তুলনায় অনেক বেশি।'
      }
    }
  ],
  'whirlpool': [
    {
      id: 'whirlpool-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['SPIRAL_ARMS', 'GRAND_DESIGN'],
      question: 'Which galaxy is world-renowned as the classic archetype of a Grand Design Spiral Galaxy?',
      options: [
        'Whirlpool Galaxy (M51a)',
        'Large Magellanic Cloud',
        'Centaurus A',
        'NGC 1300'
      ],
      correctAnswer: 0,
      explanation: 'The Whirlpool Galaxy (Messier 51a) exhibits prominent, perfectly symmetric spiral arms, making it the classic Grand Design spiral.',
      banglaTranslation: {
        question: 'কোন গ্যালাক্সিটি ক্লাসিক গ্র্যান্ড ডিজাইন সর্পিল গ্যালাক্সির নিখুঁত উদাহরণ হিসেবে বিশ্বখ্যাত?',
        options: [
          'হোয়ার্লপুল গ্যালাক্সি (M51a)',
          'লার্জ ম্যাগেলানিক ক্লাউড',
          'সেন্টোরাস এ',
          'NGC 1300'
        ],
        explanation: 'হোয়ার্লপুল গ্যালাক্সির (M51a) অত্যন্ত স্পষ্ট ও নিখুঁত সর্পিল বাহু রয়েছে যা এটিকে গ্র্যান্ড ডিজাইন স্পাইরালের আর্কিটাইপ বানিয়েছে।'
      }
    },
    {
      id: 'whirlpool-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['INTERACTION', 'SATELLITE'],
      question: 'What companion dwarf galaxy is interacting gravitationally with the Whirlpool Galaxy, compressing its star-forming gas?',
      options: [
        'NGC 5195',
        'Messier 32',
        'Sagittarius Dwarf',
        'Triangulum II'
      ],
      correctAnswer: 0,
      explanation: 'NGC 5195 is the small companion galaxy at the tip of one of Whirlpool’s spiral arms, driving intense density wave bursts.',
      banglaTranslation: {
        question: 'কোন বামন সঙ্গি গ্যালাক্সিটি হোয়ার্লপুল গ্যালাক্সির সাথে মহাকর্ষীয় মিথস্ক্রিয়ায় আবদ্ধ?',
        options: [
          'NGC 5195',
          'মেসিয়ার ৩২',
          'স্যাজিটেরিয়াস বামন',
          'ট্রায়াঙ্গুলাম II'
        ],
        explanation: 'NGC 5195 হলো হোয়ার্লপুলের সর্পিল বাহুর শীর্ষে অবস্থিত ছোট সঙ্গী গ্যালাক্সি যা তারার জন্মকে ত্বরান্বিত করে।'
      }
    }
  ],
  'triangulum': [
    {
      id: 'triangulum-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['LOCAL_GROUP', 'MESS33'],
      question: 'What rank does the Triangulum Galaxy (M33) hold in size within our Local Group of galaxies?',
      options: [
        '3rd Largest Galaxy (Behind Andromeda and Milky Way)',
        '1st Largest Galaxy',
        '10th Largest Galaxy',
        'Smallest Dwarf Satellite'
      ],
      correctAnswer: 0,
      explanation: 'Triangulum is the 3rd largest member of the Local Group, following Andromeda (1st) and the Milky Way (2nd).',
      banglaTranslation: {
        question: 'আমাদের লোকাল গ্রুপের মধ্যে ট্রায়াঙ্গুলাম গ্যালাক্সি (M33) আকারের বিচারে কোন স্থানে রয়েছে?',
        options: [
          '৩য় বৃহত্তম গ্যালাক্সি (অ্যান্ড্রোমিডা ও মিল্কিওয়ের পর)',
          '১ম বৃহত্তম গ্যালাক্সি',
          '১০ম বৃহত্তম গ্যালাক্সি',
          'ক্ষুদ্রতম বামন স্যাটেলাইট'
        ],
        explanation: 'ট্রায়াঙ্গুলাম গ্যালাক্সি লোকাল গ্রুপের ৩য় বৃহত্তম সদস্য, যার সামনে রয়েছে অ্যান্ড্রোমিডা এবং মিল্কিওয়ে।'
      }
    }
  ],
  'black-eye': [
    {
      id: 'black-eye-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['REVERSE_ROTATION', 'GAS_DISK'],
      question: 'What extraordinary kinematic phenomenon occurs inside the core of the Black Eye Galaxy (M64)?',
      options: [
        'The inner gas disk rotates in the OPPOSITE direction of the outer stellar disk',
        'The core contains two active supermassive black holes in a tight binary',
        'All star formation ceased 10 billion years ago',
        'It lacks a central galactic bulge'
      ],
      correctAnswer: 0,
      explanation: 'M64 features a counter-rotating gas disk in its center—likely the result of absorbing a smaller satellite galaxy ~1 billion years ago.',
      banglaTranslation: {
        question: 'ব্ল্যাক আই গ্যালাক্সির (M64) কেন্দ্রে কোন অসাধারণ গতিশীল ঘটনা ঘটে?',
        options: [
          'অভ্যন্তরীণ গ্যাস ডিস্ক বাইরের তারার ডিস্কের বিপরীত দিকে ঘোরে',
          'কেন্দ্রে দুটি সক্রিয় সুপারম্যাসিভ ব্ল্যাক হোল রয়েছে',
          '১০ বিলিয়ন বছর আগে সব তারা গঠন বন্ধ হয়ে গেছে',
          'এর কেন্দ্রে কোনো গ্যালাকটিক বাল্জ নেই'
        ],
        explanation: 'M64 এর কেন্দ্রে একটি বিপরীতমুখী ঘূর্ণায়মান গ্যাসের ডিস্ক রয়েছে, যা প্রায় ১ বিলিয়ন বছর আগে একটি ছোট গ্যালাক্সিকে শোষণের ফলে তৈরি হয়েছে।'
      }
    }
  ],
  'pinwheel': [
    {
      id: 'pinwheel-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['STARBURST', 'HII_REGIONS'],
      question: 'Why is the Pinwheel Galaxy (M101) famous for its luminous pink nebulae along its arms?',
      options: [
        'Massive H II starburst regions fueled by gas tidal compression',
        'Reflections from iron-rich asteroid belts',
        'Synchrotron radiation from giant pulsars',
        'Atmospheric scattering from planetary nebulae'
      ],
      correctAnswer: 0,
      explanation: 'M101 possesses over 3,000 giant H II star-forming regions where massive young stars ionize hydrogen gas clouds.',
      banglaTranslation: {
        question: 'পিনহুইল গ্যালাক্সি (M101) কেন এর বাহুগুলোতে উজ্জ্বল গোলাপি নেবুলার জন্য বিখ্যাত?',
        options: [
          'বিশাল H II তারা গঠনকারী অঞ্চল যা হাইড্রোজেন গ্যাসকে আয়নিত করে',
          'আয়রন সমৃদ্ধ অ্যাস্টেরয়েড বেল্টের প্রতিফলন',
          'পালসার থেকে সিনক্রোট্রন বিকিরণ',
          'গ্রহসংক্রান্ত নেবুলা থেকে বায়ুমণ্ডলীয় প্রতিফলন'
        ],
        explanation: 'M101 এ ৩,০০০ এরও বেশি বিশাল H II অঞ্চল রয়েছে যেখানে নবীন তারার আলো হাইড্রোজেন গ্যাসকে আয়নিত করে গোলাপি আভা সৃষ্টি করে।'
      }
    }
  ],
  'cartwheel': [
    {
      id: 'cartwheel-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['RING_GALAXY', 'COLLISION'],
      question: 'What process produced the distinctive inner and outer expanding rings of the Cartwheel Galaxy?',
      options: [
        'A high-speed head-on collision with a smaller companion galaxy passing through its center',
        'A supermassive black hole explosion',
        'Slow thermal evaporation of dark matter',
        'Continuous stellar wind push from a central starburst'
      ],
      correctAnswer: 0,
      explanation: 'The Cartwheel Galaxy is a ring galaxy formed when a smaller companion plunged directly through its center like a pebble in a pond.',
      banglaTranslation: {
        question: 'কার্টহুইল গ্যালাক্সির ভেতরের ও বাইরের প্রসারিত রিং কীভাবে তৈরি হয়েছিল?',
        options: [
          'এর কেন্দ্রের মধ্য দিয়ে একটি ছোট সঙ্গি গ্যালাক্সির সরাসরি উচ্চগতির সংঘর্ষ',
          'সুপারম্যাসিভ ব্ল্যাক হোল বিস্ফোরণ',
          'ডার্ক ম্যাটারের ধীর তাপীয় বাষ্পীভবন',
          'কেন্দ্রীয় স্টারবার্স্টের তারা বায়ুর ধাক্কা'
        ],
        explanation: 'কার্টহুইল গ্যালাক্সি একটি রিং গ্যালাক্সি যা তৈরি হয় যখন একটি ছোট সঙ্গী গ্যালাক্সি ঠিক পুকুরে পাথর ফেলার মতো এর কেন্দ্রের মধ্য দিয়ে ভেদ করে যায়।'
      }
    }
  ],
  'large-magellanic-cloud': [
    {
      id: 'lmc-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['SATELLITE', 'TARANTULA_NEBULA'],
      question: 'Which famous energetic star-forming region resides inside the Large Magellanic Cloud (LMC)?',
      options: [
        'The Tarantula Nebula (30 Doradus)',
        'The Orion Nebula',
        'The Eagle Nebula',
        'The Crab Nebula'
      ],
      correctAnswer: 0,
      explanation: 'The Tarantula Nebula in the LMC is the most active starburst region in the entire Local Group.',
      banglaTranslation: {
        question: 'লার্জ ম্যাগেলানিক ক্লাউডের (LMC) ভেতরে কোন বিখ্যাত তারা গঠনকারী অঞ্চল অবস্থিত?',
        options: [
          'তারানতুলা নেবুলা (30 Doradus)',
          'ওরিয়ন নেবুলা',
          'ঈগল নেবুলা',
          'ক্ল্যাব নেবুলা'
        ],
        explanation: 'LMC তে অবস্থিত তারানতুলা নেবুলা হলো পুরো লোকাল গ্রুপের সবচেয়ে সক্রিয় তারা জন্মদানকারী অঞ্চল।'
      }
    }
  ],
  'small-magellanic-cloud': [
    {
      id: 'smc-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['DWARF_IRREGULAR', 'METALLICITY'],
      question: 'How does the chemical metallicity of the Small Magellanic Cloud (SMC) compare to our Milky Way?',
      options: [
        'Low metallicity (~1/10th Milky Way), mimicking early cosmic environments',
        'Extremely high metal enrichment',
        'Identical chemical composition',
        'Pure heavy element composition with no hydrogen'
      ],
      correctAnswer: 0,
      explanation: 'The SMC has low heavy-element metallicity, providing astrophysicists a laboratory to study early cosmic star formation.',
      banglaTranslation: {
        question: 'স্মল ম্যাগেলানিক ক্লাউডের (SMC) রাসায়নিক ধাতবতা মিল্কিওয়ের তুলনায় কেমন?',
        options: [
          'কম ধাতবতা (মিল্কিওয়ের ১/১০ অংশ), যা প্রারম্ভিক মহাজাগতিক পরিবেশের মতো',
          'অত্যন্ত উচ্চ ধাতব সমৃদ্ধি',
          'হুবহু একই রাসায়নিক গঠন',
          'হাইড্রোজেনহীন ভারী উপাদান'
        ],
        explanation: 'SMC-এর নিম্ন ধাতবতা জ্যোতির্বিজ্ঞানীদের প্রাচীন মহাবিশ্বের তারা গঠনের পরিবেশ নিয়ে গবেষণা করার সুযোগ দেয়।'
      }
    }
  ]
};

// In-memory cache for loaded quiz datasets
const quizCache = new Map<string, QuizQuestion[]>();

/**
 * Lazy loads quiz questions for a galaxy with dynamic generation fallback.
 */
export async function getQuizQuestions(galaxy: Galaxy): Promise<QuizQuestion[]> {
  if (quizCache.has(galaxy.id)) {
    return quizCache.get(galaxy.id)!;
  }

  if (staticQuizRegistry[galaxy.id]) {
    const questions = staticQuizRegistry[galaxy.id];
    quizCache.set(galaxy.id, questions);
    return questions;
  }

  // Fallback: Dynamically generate 3 structured scientific questions if static questions do not exist
  const generated = generateFallbackQuiz(galaxy);
  quizCache.set(galaxy.id, generated);
  return generated;
}

/**
 * Fallback generator for galaxies without static JSON quiz definitions
 */
function generateFallbackQuiz(galaxy: Galaxy): QuizQuestion[] {
  const gName = galaxy.name;
  const gType = galaxy.type || 'Spiral Galaxy';
  const gDist = galaxy.distance || 'Deep Space';
  const gConst = galaxy.constellation || 'Uncharted';

  return [
    {
      id: `${galaxy.id}-gen-q1`,
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['CLASSIFICATION'],
      question: `According to mission telemetry, what structural type is assigned to ${gName}?`,
      options: [
        gType,
        'Irregular Dwarf Galaxy',
        'Supergiant Elliptical',
        'Lenticular Cluster'
      ],
      correctAnswer: 0,
      explanation: `${gName} is classified as a ${gType} in astronomical research catalogs.`,
      banglaTranslation: {
        question: `মিশন টেলিমেট্রি অনুযায়ী, ${gName}-এর গঠনের ধরন কোনটি?`,
        options: [
          gType,
          'অনিয়মিত বামন গ্যালাক্সি',
          'সুপারজায়ান্ট উপবৃত্তাকার',
          'লেনটিকুলার ক্লাস্টার'
        ],
        explanation: `${gName} কে জ্যোতির্বিদ্যা ক্যাটালগে ${gType} হিসেবে চিহ্নিত করা হয়েছে।`
      }
    },
    {
      id: `${galaxy.id}-gen-q2`,
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['DISTANCE'],
      question: `What is the estimated cosmic distance from Earth to ${gName}?`,
      options: [
        gDist,
        '100 Light Years',
        '500 Billion Kilometers',
        'Unknown / Deep Void'
      ],
      correctAnswer: 0,
      explanation: `Observational measurements place ${gName} at approximately ${gDist} from Earth.`,
      banglaTranslation: {
        question: `পৃথিবী থেকে ${gName}-এর আনুমানিক দূরত্ব কত?`,
        options: [
          gDist,
          '১০০ আলোকবর্ষ',
          '৫০০ বিলিয়ন কিলোমিটার',
          'অজানা গভীর শূন্যস্থান'
        ],
        explanation: `পর্যবেক্ষণ থেকে দেখা যায় যে ${gName} আমাদের থেকে প্রায় ${gDist} দূরে অবস্থিত।`
      }
    },
    {
      id: `${galaxy.id}-gen-q3`,
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['CONSTELLATION'],
      question: `In which celestial constellation is ${gName} located as seen from Earth?`,
      options: [
        gConst,
        'Ursa Major',
        'Orion',
        'Cassiopeia'
      ],
      correctAnswer: 0,
      explanation: `From ground-based perspectives, ${gName} resides within the constellation bounds of ${gConst}.`,
      banglaTranslation: {
        question: `পৃথিবী থেকে পর্যবেক্ষণ করলে ${gName} কোন তারামণ্ডলে অবস্থিত?`,
        options: [
          gConst,
          'সপ্তর্ষি মণ্ডল (Ursa Major)',
          'কালপুরুষ (Orion)',
          'ক্যাসিওপিয়া (Cassiopeia)'
        ],
        explanation: `পৃথিবী কেন্দ্রিক পর্যবেক্ষণে ${gName} গ্যালাক্সিটি ${gConst} তারামণ্ডলের অন্তর্ভুক্ত।`
      }
    }
  ];
}
