import { Galaxy, QuizQuestion } from '../../core/types';
import { logger } from '../../core/logger';

// Static quiz database for all 10 core galaxies (5 verified questions per galaxy = 50 total)
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
        'Barred Spiral Galaxy',
        'Giant Irregular Dwarf Galaxy',
        'Peculiar Ring Galaxy'
      ],
      correctAnswer: 1,
      explanation: 'The Milky Way features a central bar structure of stars connecting two major spiral arms, classifying it as a Barred Spiral Galaxy.',
      banglaTranslation: {
        question: 'আমাদের মূল মিল্কিওয়ে গ্যালাক্সি কোন ধরনের শ্রেণিবিন্যাসের অন্তর্ভুক্ত?',
        options: [
          'দণ্ডহীন গ্র্যান্ড ডিজাইন সর্পিল',
          'দণ্ডযুক্ত সর্পিল গ্যালাক্সি (Barred Spiral)',
          'দৈত্যাকৃতির অনিয়মিত বামন গ্যালাক্সি',
          'বিশেষ রিং গ্যালাক্সি'
        ],
        explanation: 'মিল্কিওয়ে গ্যালাক্সির কেন্দ্রে একটি তারার বার কাঠামো রয়েছে যা প্রধান সর্পিল বাহুগুলোকে সংযুক্ত করে।'
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
      explanation: 'Sagittarius A* (Sgr A*) is the supermassive black hole at the center of the Milky Way, with a mass of roughly 4.1 million Suns.',
      banglaTranslation: {
        question: 'মিল্কিওয়ের ঠিক মহাকর্ষীয় কেন্দ্রে কোন মহাজাগতিক বস্তুটি অবস্থিত?',
        options: [
          'ম্যাগনেটার SGR 1806-20',
          'স্যাজিটেরিয়াস এ* সুপারম্যাসিভ ব্ল্যাক হোল',
          'সাইগনাস X-1 দ্বৈত ব্যবস্থা',
          'প্রক্সিমা সেন্টোরি সিস্টেম'
        ],
        explanation: 'স্যাজিটেরিয়াস এ* (Sgr A*) হলো মিল্কিওয়ের কেন্দ্রে অবস্থিত সুপারম্যাসিভ ব্ল্যাক হোল।'
      }
    },
    {
      id: 'milky-way-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['ORBIT', 'SOLAR_SYSTEM'],
      question: 'Where is our Solar System located inside the Milky Way?',
      options: [
        'At the exact central bulge',
        'In the distant dark matter halo',
        'In the Orion Spur of the galactic disk',
        'Outside the Milky Way disk'
      ],
      correctAnswer: 2,
      explanation: 'Our Solar System resides roughly halfway from the galactic core inside a smaller spiral structure called the Orion Spur.',
      banglaTranslation: {
        question: 'মিল্কিওয়ে গ্যালাক্সির ভেতরে আমাদের সৌরজগৎ কোথায় অবস্থিত?',
        options: [
          'ঠিক কেন্দ্রীয় অংশে',
          'দূরবর্তী ডার্ক ম্যাটার হ্যালোতে',
          'গ্যালাকটিক ডিস্কের ওরিয়ন স্পারে',
          'মিল্কিওয়ের ডিস্কের বাইরে'
        ],
        explanation: 'আমাদের সৌরজগৎ কেন্দ্র থেকে প্রায় অর্ধেক দূরত্বে ওরিয়ন স্পার নামের সর্পিল বাহুতে অবস্থিত।'
      }
    },
    {
      id: 'milky-way-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['ORBIT', 'TIME'],
      question: 'How long does it take our Solar System to complete one orbit around the galactic core (a Cosmic Year)?',
      options: [
        '240,000 Earth Years',
        '2.4 Million Earth Years',
        '240 Million Earth Years',
        '2.4 Billion Earth Years'
      ],
      correctAnswer: 2,
      explanation: 'Traveling at roughly 828,000 km/h, the Sun takes approximately 240 million Earth years to complete one orbit around the galactic center.',
      banglaTranslation: {
        question: 'আমাদের সৌরজগতের গ্যালাকটিক কেন্দ্রের চারপাশে একবার ঘুরে আসতে কত সময় লাগে (এক গ্যালাকটিক বছর)?',
        options: [
          '২ লাখ ৪০ হাজার বছর',
          '২৪ লাখ বছর',
          '২৪ কোটি বছর (240 Million Years)',
          '২.৪ বিলিয়ন বছর'
        ],
        explanation: 'সূর্যের গ্যালাকটিক কেন্দ্রের চারপাশে একবার ঘুরে আসতে প্রায় ২৪ কোটি (২৪০ মিলিয়ন) বছর সময় লাগে।'
      }
    },
    {
      id: 'milky-way-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['OBSERVATION', 'PERSPECTIVE'],
      question: 'Why can we not take a single camera photograph showing the entire exterior of the Milky Way?',
      options: [
        'The galaxy emits no visible light',
        'Because Earth is located inside the galactic disk',
        'The galaxy has no defined shape',
        'Interstellar dust destroys all radio waves'
      ],
      correctAnswer: 1,
      explanation: 'Because our Solar System is embedded inside the Milky Way disk, we must reconstruct its full spiral structure from the inside out.',
      banglaTranslation: {
        question: 'আমরা কেন বাইরের স্থান থেকে মিল্কিওয়ের একটি একক ছবি তুলতে পারি না?',
        options: [
          'গ্যালাক্সিটি কোনো দৃশ্যমান আলো নির্গত করে না',
          'কারণ পৃথিবী গ্যালাকটিক ডিস্কের ভেতরে অবস্থিত',
          'গ্যালাক্সির কোনো নির্দিষ্ট আকার নেই',
          'ধূলিকণা সব রেডিও তরঙ্গ ধ্বংস করে'
        ],
        explanation: 'যেহেতু আমরা মিল্কিওয়ের ভেতরে বাস করি, তাই পুরো গ্যালাক্সির একক ছবি বাইরে থেকে তোলা সম্ভব নয়।'
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
        '25,000 Light Years',
        '250,000 Light Years',
        '2.5 Million Light Years',
        '25 Million Light Years'
      ],
      correctAnswer: 2,
      explanation: 'Andromeda lies approximately 2.5 million light-years away and is our nearest major spiral neighbor.',
      banglaTranslation: {
        question: 'পৃথিবী থেকে অ্যান্ড্রোমিডা গ্যালাক্সির (M31) আনুমানিক দূরত্ব কত?',
        options: [
          '২৫,০০০ আলোকবর্ষ',
          '২,৫০,০০০ আলোকবর্ষ',
          '২৫ লাখ আলোকবর্ষ (2.5 Million Light Years)',
          '২.৫ কোটি আলোকবর্ষ'
        ],
        explanation: 'অ্যান্ড্রোমিডা গ্যালাক্সি আমাদের থেকে প্রায় ২৫ লাখ আলোকবর্ষ দূরে অবস্থিত।'
      }
    },
    {
      id: 'andromeda-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['HUBBLE', 'STARS'],
      question: 'How many stars were resolved in NASA\'s giant Hubble panorama of Andromeda?',
      options: [
        'About 1 Million Stars',
        'About 200 Million Stars',
        'Every Star in Andromeda',
        'Fewer than 10,000 Stars'
      ],
      correctAnswer: 1,
      explanation: 'Hubble\'s monumental mosaic resolved roughly 200 million individual stars within a portion of Andromeda\'s stellar disk.',
      banglaTranslation: {
        question: 'নাসার হাবল প্যানোরামায় অ্যান্ড্রোমিডার কতগুলো স্বতন্ত্র নক্ষত্র স্পষ্ট দেখা গেছে?',
        options: [
          'প্রায় ১০ লাখ নক্ষত্র',
          'প্রায় ২০ কোটি নক্ষত্র (200 Million Stars)',
          'অ্যান্ড্রোমিডার সব নক্ষত্র',
          '১০,০০০ এর কম নক্ষত্র'
        ],
        explanation: 'হাবলের ঐতিহাসিক মোজাইক চিত্রে অ্যান্ড্রোমিডার প্রায় ২০ কোটি নক্ষত্র আলাদাভাবে চিহ্নিত করা হয়েছে।'
      }
    },
    {
      id: 'andromeda-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['HUBBLE', 'OBSERVATION'],
      question: 'How many overlapping Hubble snapshots were combined to construct the 2025 Andromeda mosaic?',
      options: [
        'About 60 Snapshots',
        'About 600 Snapshots',
        'Over 6,000 Snapshots',
        'A single exposure'
      ],
      correctAnswer: 1,
      explanation: 'The project required over 10 years and more than 600 overlapping Hubble observations to map Andromeda in detail.',
      banglaTranslation: {
        question: '২০২৫ সালের অ্যান্ড্রোমিডা হাবল মোজাইক তৈরি করতে কতগুলো ওভারল্যাপিং ছবি যুক্ত করা হয়েছিল?',
        options: [
          'প্রায় ৬০টি ছবি',
          'প্রায় ৬০০টি ছবি (600 Snapshots)',
          '৬,০০০ এর বেশি ছবি',
          'একটি মাত্র এক্সপোজার'
        ],
        explanation: '১০ বছরের বেশি সময় ধরে হাবল টেলিস্কোপের ৬০০টিরও বেশি ছবি মিলিয়ে এই প্যানোরামা তৈরি করা হয়।'
      }
    },
    {
      id: 'andromeda-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['MERGER', 'SATELLITES'],
      question: 'What evidence do Andromeda\'s companion galaxies and halo structures preserve?',
      options: [
        'Proof of a recent supernova explosion in Sol',
        'Evidence of ancient interactions and absorbed satellite galaxies',
        'Traces of extinct solar atmospheres',
        'Signatures of gamma-ray destruction'
      ],
      correctAnswer: 1,
      explanation: 'Stellar streams and compact satellite companions like M32 preserve evidence of ancient galactic interactions.',
      banglaTranslation: {
        question: 'অ্যান্ড্রোমিডার স্যাটেলাইট গ্যালাক্সিগুলো কিসের প্রমাণ বহন করে?',
        options: [
          'সূর্যের সুপারনোভা বিস্ফোরণের প্রমাণ',
          'প্রাচীন মহাজাগতিক সংঘর্ষ ও স্যাটেলাইট শোষণের প্রমাণ',
          'বিলুপ্ত সৌর বায়ুমণ্ডলের চিহ্ন',
          'গামা-রশ্মি ধ্বংসের স্বাক্ষর'
        ],
        explanation: 'অ্যান্ড্রোমিডার আশেপাশের তারার স্রোত এবং M32 এর মতো স্যাটেলাইট প্রাচীন গ্যালাকটিক সংঘর্ষের প্রমাণ দেয়।'
      }
    },
    {
      id: 'andromeda-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['LOCAL_GROUP', 'RESEARCH'],
      question: 'Why is Andromeda especially valuable to astrophysicists studying galaxy evolution?',
      options: [
        'It is located inside our Solar System',
        'It is our nearest major spiral neighbor, providing a clear external view',
        'It contains no interstellar dust',
        'It has stopped rotating completely'
      ],
      correctAnswer: 1,
      explanation: 'Because Andromeda is our nearest giant spiral neighbor, astronomers can study stellar neighborhoods at high resolution.',
      banglaTranslation: {
        question: 'জ্যোতির্বিজ্ঞানীদের কাছে অ্যান্ড্রোমিডা কেন বিশেষভাবে গুরুত্বপূর্ণ?',
        options: [
          'এটি আমাদের সৌরজগতের ভেতরে অবস্থিত',
          'এটি আমাদের নিকটতম প্রধান সর্পিল গ্যালাক্সি যা বাহ্যিক দৃশ্য প্রদান করে',
          'এতে কোনো ধূলিকণা নেই',
          'এটি ঘোরা সম্পূর্ণ বন্ধ করে দিয়েছে'
        ],
        explanation: 'অ্যান্ড্রোমিডা আমাদের নিকটতম বড় সর্পিল প্রতিবেশী হওয়ায় বাইরে থেকে সর্পিল গ্যালাক্সির গঠন নিখুঁতভাবে বিশ্লেষণ করা যায়।'
      }
    }
  ],
  'triangulum': [
    {
      id: 'triangulum-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DISTANCE', 'LOCAL_GROUP'],
      question: 'Approximately how far away from Earth is the Triangulum Galaxy (M33)?',
      options: [
        '300,000 Light Years',
        '3 Million Light Years',
        '30 Million Light Years',
        '300 Million Light Years'
      ],
      correctAnswer: 1,
      explanation: 'M33 is located approximately 3 million light-years away in our Local Group.',
      banglaTranslation: {
        question: 'ট্রায়াঙ্গুলাম গ্যালাক্সি (M33) পৃথিবী থেকে আনুমানিক কত দূরে অবস্থিত?',
        options: [
          '৩ লাখ আলোকবর্ষ',
          '৩০ লাখ আলোকবর্ষ (3 Million Light Years)',
          '৩ কোটি আলোকবর্ষ',
          '৩০ কোটি আলোকবর্ষ'
        ],
        explanation: 'ট্রায়াঙ্গুলাম গ্যালাক্সি (M33) আমাদের লোকাল গ্রুপে প্রায় ৩০ লাখ আলোকবর্ষ দূরে অবস্থিত।'
      }
    },
    {
      id: 'triangulum-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['STAR_FORMATION', 'NGC604'],
      question: 'What is NGC 604 inside the Triangulum Galaxy famous for?',
      options: [
        'A supermassive black hole candidate',
        'One of the largest starburst nurseries in the Local Group',
        'An ancient globular cluster',
        'A planetary nebula remnant'
      ],
      correctAnswer: 1,
      explanation: 'NGC 604 is a massive starburst region inside M33 where hot young stars ionize surrounding hydrogen gas.',
      banglaTranslation: {
        question: 'ট্রায়াঙ্গুলাম গ্যালাক্সির ভেতরে অবস্থিত NGC 604 কেন বিখ্যাত?',
        options: [
          'একটি সুপারম্যাসিভ ব্ল্যাক হোল',
          'লোকাল গ্রুপের বৃহত্তম তারা জন্মদানকারী অঞ্চলের একটি (NGC 604)',
          'একটি প্রাচীন গ্লোবুলার ক্লাস্টার',
          'গ্রহসংক্রান্ত নেবুলার অবশিষ্টাংশ'
        ],
        explanation: 'NGC 604 হলো M33 এর ভেতরে অবস্থিত একটি বিশাল তারা গঠনকারী হাইড্রোজেন গ্যাস মেঘ।'
      }
    },
    {
      id: 'triangulum-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['HUBBLE', 'MOSAIC'],
      question: 'How many separate Hubble fields of view were combined to create the landmark M33 portrait?',
      options: [
        '5 Fields',
        '15 Fields',
        '54 Fields',
        '540 Fields'
      ],
      correctAnswer: 2,
      explanation: 'NASA\'s detailed Hubble mosaic of M33 combined 54 separate pointing fields, resolving nearly 25 million stars.',
      banglaTranslation: {
        question: 'হাবলের M33 পোর্ট্রেট তৈরি করতে কতগুলো আলাদা ফিল্ড ভিউ যুক্ত করা হয়েছিল?',
        options: [
          '৫টি ফিল্ড',
          '১৫টি ফিল্ড',
          '৫৪টি ফিল্ড (54 Fields)',
          '৫৪০টি ফিল্ড'
        ],
        explanation: 'হাবলের M33 মোজাইকে ৫৪টি আলাদা ফিল্ড যুক্ত করে প্রায় ২.৫ কোটি নক্ষত্র উন্মোচন করা হয়।'
      }
    },
    {
      id: 'triangulum-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['ORIENTATION', 'SPIRAL_ARMS'],
      question: 'Why does M33 provide astronomers an exceptionally clear view of its spiral arms?',
      options: [
        'It is oriented nearly face-on to Earth',
        'It has no interstellar dust lanes',
        'It orbits inside the Milky Way halo',
        'It emits only infrared radiation'
      ],
      correctAnswer: 0,
      explanation: 'M33\'s face-on orientation gives observers an unobstructed view across its stellar disk and spiral structure.',
      banglaTranslation: {
        question: 'M33 কেন জ্যোতির্বিজ্ঞানীদের সর্পিল বাহু পর্যবেক্ষণের জন্য চমৎকার সুযোগ দেয়?',
        options: [
          'এটি পৃথিবীর দিকে প্রায় মুখোমুখি (Face-On) কোণে অবস্থিত',
          'এতে কোনো ধূলিকণা নেই',
          'এটি মিল্কিওয়ের হ্যালোর ভেতরে ঘোরে',
          'এটি কেবল ইনফ্রারেড আলো নির্গত করে'
        ],
        explanation: 'M33 মুখোমুখি (Face-On) অবস্থানে থাকায় এর সর্পিল বাহুগুলো স্পষ্ট দেখা যায়।'
      }
    },
    {
      id: 'triangulum-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['SCALE', 'LOCAL_GROUP'],
      question: 'Compared to our home Milky Way Galaxy, the Triangulum Galaxy is approximately:',
      options: [
        'Twice as large in diameter',
        'Roughly half the size of the Milky Way',
        'Identical in mass and diameter',
        '100 times larger'
      ],
      correctAnswer: 1,
      explanation: 'With a diameter of ~60,000 light-years, M33 is roughly half the size of the Milky Way and the 3rd largest Local Group galaxy.',
      banglaTranslation: {
        question: 'মিল্কিওয়ের তুলনায় ট্রায়াঙ্গুলাম গ্যালাক্সির আকার আনুমানিক কেমন?',
        options: [
          'দ্বিগুণ বড়',
          'মিল্কিওয়ের প্রায় অর্ধেক (Half the size)',
          'ঠিক একই ভরের ও আকারের',
          '১০০ গুণ বড়'
        ],
        explanation: 'প্রায় ৬০,০০০ আলোকবর্ষ ব্যাস নিয়ে M33 মিল্কিওয়ের আকারের প্রায় অর্ধেক।'
      }
    }
  ],
  'whirlpool': [
    {
      id: 'whirlpool-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['ARCHETYPE', 'GRAND_DESIGN'],
      question: 'What structural designation makes the Whirlpool Galaxy (M51) famous in astronomy?',
      options: [
        'It is a classic Grand Design Spiral Galaxy',
        'It is an unbarred supergiant elliptical galaxy',
        'It is a featureless lenticular galaxy',
        'It is a polar-ring dwarf galaxy'
      ],
      correctAnswer: 0,
      explanation: 'M51 is world-renowned for its prominent, highly defined, symmetric spiral arms, making it the classic Grand Design spiral.',
      banglaTranslation: {
        question: 'হোয়ার্লপুল গ্যালাক্সি (M51) কোন বিশেষ সর্পিল গঠনের জন্য বিশ্বখ্যাত?',
        options: [
          'এটি একটি নিখুঁত গ্র্যান্ড ডিজাইন সর্পিল গ্যালাক্সি (Grand Design)',
          'এটি একটি অনিয়মিত বিশালাকার উপবৃত্তাকার গ্যালাক্সি',
          'এটি গঠনহীন লেনটিকুলার গ্যালাক্সি',
          'এটি মেরু-রিং বামন গ্যালাক্সি'
        ],
        explanation: 'M51 এর সর্পিল বাহুগুলো অত্যন্ত স্পষ্ট ও নিখুঁত হওয়ায় এটি ক্লাসিক গ্র্যান্ড ডিজাইন স্পাইরালের উদাহরণ।'
      }
    },
    {
      id: 'whirlpool-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['DISTANCE', 'NASA'],
      question: 'How far away is M51 according to NASA\'s current Hubble catalog?',
      options: [
        '3.1 Million Light Years',
        '13 Million Light Years',
        '31 Million Light Years',
        '310 Million Light Years'
      ],
      correctAnswer: 2,
      explanation: 'NASA\'s Hubble catalog places the Whirlpool Galaxy at a distance of approximately 31 million light-years.',
      banglaTranslation: {
        question: 'নাসার হাবল ক্যাটালগ অনুসারে M51 পৃথিবী থেকে কত দূরে অবস্থিত?',
        options: [
          '৩১ লাখ আলোকবর্ষ',
          '১.৩ কোটি আলোকবর্ষ',
          '৩.১ কোটি আলোকবর্ষ (31 Million Light Years)',
          '৩১ কোটি আলোকবর্ষ'
        ],
        explanation: 'নাসার তথ্য অনুযায়ী হোয়ার্লপুল গ্যালাক্সি পৃথিবী থেকে প্রায় ৩.১ কোটি আলোকবর্ষ দূরে অবস্থিত।'
      }
    },
    {
      id: 'whirlpool-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['INTERACTION', 'NGC5195'],
      question: 'What is NGC 5195 in relation to the Whirlpool Galaxy?',
      options: [
        'M51\'s interacting smaller companion galaxy',
        'A planetary nebula in the foreground',
        'A supermassive black hole jet',
        'A distant quasar background source'
      ],
      correctAnswer: 0,
      explanation: 'NGC 5195 is the smaller companion galaxy whose gravitational interaction helps sculpt M51\'s prominent arms.',
      banglaTranslation: {
        question: 'হোয়ার্লপুল গ্যালাক্সির সাথে NGC 5195 এর সম্পর্ক কী?',
        options: [
          'M51 এর সাথে মিথস্ক্রিয়ারত ছোট সঙ্গী গ্যালাক্সি (Companion Galaxy)',
          'সামনে অবস্থিত একটি গ্রহসংক্রান্ত নেবুলা',
          'সুপারম্যাসিভ ব্ল্যাক হোলের নির্গত জেস্ট',
          'একটি দূরবর্তী কোয়াসার উৎস'
        ],
        explanation: 'NGC 5195 হলো হোয়ার্লপুলের সর্পিল বাহুর প্রান্তে অবস্থিত ছোট সঙ্গী গ্যালাক্সি।'
      }
    },
    {
      id: 'whirlpool-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['GRAVITY', 'STARBURST'],
      question: 'What effect can gravitational tides from a companion galaxy have on spiral gas clouds?',
      options: [
        'They evaporate all gas into empty space',
        'They compress gas clouds and trigger new star formation',
        'They transform gas into dark energy',
        'They stop galactic rotation completely'
      ],
      correctAnswer: 1,
      explanation: 'Gravitational tides drive density waves through the disk, compressing interstellar gas and fueling starburst activity.',
      banglaTranslation: {
        question: 'সঙ্গী গ্যালাক্সির মহাকর্ষীয় প্রভাব সর্পিল বাহুর গ্যাসের ওপর কী ভূমিকা রাখে?',
        options: [
          'সব গ্যাসকে শূন্যস্থানে বাষ্পীভূত করে',
          'গ্যাস মেঘকে সংকুচিত করে নতুন তারা গঠন ত্বরান্বিত করে',
          'গ্যাসকে ডার্ক এনার্জিতে রূপান্তরিত করে',
          'গ্যালাক্সির ঘূর্ণন পুরোপুরি থামিয়ে দেয়'
        ],
        explanation: 'মহাকর্ষীয় আকর্ষণ সর্পিল বাহুর গ্যাস সংকুচিত করে নতুন তারা গঠনের হার বাড়িয়ে দেয়।'
      }
    },
    {
      id: 'whirlpool-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DUST', 'COMPOSITION'],
      question: 'What do the prominent dark lanes along M51\'s spiral arms mainly consist of?',
      options: [
        'Empty cosmic voids',
        'Interstellar dust and dense gas clouds',
        'Atmospheres of exoplanets',
        'Miniature black holes'
      ],
      correctAnswer: 1,
      explanation: 'Dark lanes trace clouds of interstellar dust blocking visible background starlight, containing material for future stars.',
      banglaTranslation: {
        question: 'M51 এর বাহুতে অবস্থিত অন্ধকার লেনগুলো কী দিয়ে গঠিত?',
        options: [
          'খালি মহাজাগতিক শূন্যস্থান',
          'আন্তঃনক্ষত্রীয় ধূলিকণা ও ঘন গ্যাস মেঘ (Interstellar Dust)',
          'বহির্গ্রহের বায়ুমণ্ডল',
          'ছোট ছোট ব্ল্যাক হোল'
        ],
        explanation: 'অন্ধকার লেনগুলো মূলত আন্তঃনক্ষত্রীয় ধূলিকণা যা পেছনের তারার আলোকে বাধা দেয়।'
      }
    }
  ],
  'sombrero': [
    {
      id: 'sombrero-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['APPEARANCE', 'ORIENTATION'],
      question: 'Why does the Sombrero Galaxy (M104) appear shaped like a broad-brimmed hat?',
      options: [
        'Its disk is viewed nearly edge-on from Earth with a prominent dust lane',
        'It is an artificial structure built around a star',
        'It has no central stellar bulge',
        'Its spiral arms were sheared off by a black hole'
      ],
      correctAnswer: 0,
      explanation: 'Viewing M104 nearly edge-on highlights its brilliant nuclear bulge wrapped by a thick, dark equatorial dust lane.',
      banglaTranslation: {
        question: 'সোমব্রেরো গ্যালাক্সিটি (M104) দেখতে চওড়া টুপির মতো মনে হয় কেন?',
        options: [
          'কারণ এটি পৃথিবী থেকে প্রায় পাশ থেকে (Edge-On) ঘন ধূলিকণাসহ দেখা যায়',
          'এটি তারার চারপাশে তৈরি একটি কৃত্রিম কাঠামো',
          'এর কোনো কেন্দ্রীয় তারার স্ফীতি নেই',
          'এর সর্পিল বাহু ব্ল্যাক হোল কেটে ফেলেছিল'
        ],
        explanation: 'পাশ থেকে (Edge-On) দৃশ্যমান হওয়ার কারণে এর উজ্জ্বল কেন্দ্র ও ধূলিকণার রিং টুপির মতো দেখায়।'
      }
    },
    {
      id: 'sombrero-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['GLOBULAR_CLUSTERS', 'HUBBLE'],
      question: 'About how many globular star clusters can Hubble resolve in M104\'s vast halo?',
      options: [
        'About 20 Clusters',
        'About 200 Clusters',
        'About 2,000 Clusters',
        'Over 200,000 Clusters'
      ],
      correctAnswer: 2,
      explanation: 'Hubble observations resolve roughly 2,000 globular clusters orbiting M104—nearly ten times the Milky Way\'s system.',
      banglaTranslation: {
        question: 'হাবল টেলিস্কোপ দিয়ে M104 এর চারপাশে কতগুলো গ্লোবুলার ক্লাস্টার চিহ্নিত করা হয়েছে?',
        options: [
          'প্রায় ২০টি ক্লাস্টার',
          'প্রায় ২০০টি ক্লাস্টার',
          'প্রায় ২,০০০টি ক্লাস্টার (About 2,000 Clusters)',
          '২ লাখের বেশি ক্লাস্টার'
        ],
        explanation: 'হাবল টেলিস্কোপ M104 এর হ্যালোতে প্রায় ২,০০০ গ্লোবুলার ক্লাস্টার উন্মোচন করেছে।'
      }
    },
    {
      id: 'sombrero-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['WEBB', 'INFRARED'],
      question: 'What feature does NASA\'s Webb Space Telescope reveal especially clearly in M104?',
      options: [
        'Earth-like exoplanets',
        'Clumpy dust ring structures in mid-infrared wavelengths',
        'Surface water oceans',
        'Radio broadcasts'
      ],
      correctAnswer: 1,
      explanation: 'Webb\'s MIRI and NIRCam instruments penetrate optical extinction, revealing detailed clumpy dust structure in the outer ring.',
      banglaTranslation: {
        question: 'ওয়েব স্পেস টেলিস্কোপের ইনফ্রারেড চিত্রে M104 এর কোন বৈশিষ্ট্য স্পষ্ট ধরা পড়ে?',
        options: [
          'পৃথিবীর মতো বহির্গ্রহ',
          'ইনফ্রারেড তরঙ্গে বাইরের রিংয়ের ধূলিকণার খাঁজকাটা গঠন',
          'পৃষ্ঠতলের তরল জলের মহাসাগর',
          'রেডিও সম্প্রচার'
        ],
        explanation: 'ওয়েব টেলিস্কোপের ইনফ্রারেড আলো ধূলিকণার আড়ালে লুকিয়ে থাকা সুক্ষ্ম গঠন প্রকাশ করে।'
      }
    },
    {
      id: 'sombrero-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DUST', 'LIGHT'],
      question: 'What creates the famous dark lane running across the front of M104?',
      options: [
        'A supermassive black hole shadow',
        'Dust and gas in the galaxy\'s disk absorbing visible light',
        'Empty space between two distinct galaxies',
        'A shadow cast by Earth\'s atmosphere'
      ],
      correctAnswer: 1,
      explanation: 'The dark band is composed of interstellar dust particles blocking visible starlight from the bright bulge behind it.',
      banglaTranslation: {
        question: 'সোমব্রেরো গ্যালাক্সির সামনের বিখ্যাত অন্ধকার ব্যান্ডটি কী দিয়ে তৈরি?',
        options: [
          'ব্ল্যাক হোলের ছায়া',
          'ডিস্কের ধূলিকণা ও গ্যাস যা পেছনের আলকে বাধা দেয়',
          'দুটি আলাদা গ্যালাক্সির মধ্যবর্তী খালি স্থান',
          'পৃথিবীর বায়ুমণ্ডলের ছায়া'
        ],
        explanation: 'অন্ধকার ব্যান্ডটি আন্তঃনক্ষত্রীয় ধূলিকণা দ্বারা গঠিত যা দৃশ্যমান আলো শোষণ করে।'
      }
    },
    {
      id: 'sombrero-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['WAVELENGTHS', 'ASTRONOMY'],
      question: 'Why is combining visible and infrared telescope observations useful in galaxy research?',
      options: [
        'Different wavelengths reveal different physical structures like stars versus dust',
        'It changes the galaxy\'s actual distance from Earth',
        'It cancels gravitational pull',
        'It makes galaxies disappear'
      ],
      correctAnswer: 0,
      explanation: 'Visible light highlights hot stars while infrared penetrates dust to map warm gas chemistry and embedded star formation.',
      banglaTranslation: {
        question: 'দৃশ্যমান ও ইনফ্রারেড টেলিস্কোপ পর্যবেক্ষণ একত্রে ব্যবহার করা কেন প্রয়োজনীয়?',
        options: [
          'বিভিন্ন তরঙ্গদৈর্ঘ্য তারা ও ধূলিকণার মতো আলাদা ভৌত গঠন উন্মোচন করে',
          'এটি পৃথিবী থেকে গ্যালাক্সির দূরত্ব বদলে দেয়',
          'এটি মহাকর্ষীয় আকর্ষণ বাতিল করে',
          'এটি গ্যালাক্সিকে অদৃশ্য করে দেয়'
        ],
        explanation: 'দৃশ্যমান আলো নক্ষত্র দেখায় এবং ইনফ্রারেড ধূলিকণা ভেদ করে ভেতরে লুকিয়ে থাকা বিষয় উন্মোচন করে।'
      }
    }
  ],
  'pinwheel': [
    {
      id: 'pinwheel-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DISTANCE', 'CATALOG'],
      question: 'How far away is the Pinwheel Galaxy (M101) according to NASA\'s Hubble catalog?',
      options: [
        '2.5 Million Light Years',
        '25 Million Light Years',
        '250 Million Light Years',
        '2.5 Billion Light Years'
      ],
      correctAnswer: 1,
      explanation: 'NASA\'s Hubble catalog measures the distance to M101 at approximately 25 million light-years.',
      banglaTranslation: {
        question: 'নাসার হাবল ক্যাটালগ অনুসারে পিনহুইল গ্যালাক্সি (M101) কত দূরে অবস্থিত?',
        options: [
          '২৫ লাখ আলোকবর্ষ',
          '২.৫ কোটি আলোকবর্ষ (25 Million Light Years)',
          '২৫ কোটি আলোকবর্ষ',
          '২.৫ বিলিয়ন আলোকবর্ষ'
        ],
        explanation: 'নাসার তথ্যানুসারে M101 গ্যালাক্সি আমাদের থেকে প্রায় ২.৫ কোটি আলোকবর্ষ দূরে।'
      }
    },
    {
      id: 'pinwheel-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['SCALE', 'DIAMETER'],
      question: 'Approximately how wide is the stellar disk of the Pinwheel Galaxy?',
      options: [
        '17,000 Light Years',
        '70,000 Light Years',
        '170,000 Light Years',
        '1.7 Million Light Years'
      ],
      correctAnswer: 2,
      explanation: 'M101 is an enormous spiral galaxy spanning roughly 170,000 light-years—nearly double the Milky Way\'s diameter.',
      banglaTranslation: {
        question: 'পিনহুইল গ্যালাক্সির ডিস্কের ব্যাস আনুমানিক কত?',
        options: [
          '১৭,০০০ আলোকবর্ষ',
          '৭০,০০০ আলোকবর্ষ',
          '১,৭০,০০০ আলোকবর্ষ (170,000 Light Years)',
          '১৭ লাখ আলোকবর্ষ'
        ],
        explanation: 'M101 গ্যালাক্সিটি সুবিশাল, যার ব্যাস প্রায় ১,৭০,০০০ আলোকবর্ষ (মিল্কিওয়ের প্রায় দ্বিগুণ)।'
      }
    },
    {
      id: 'pinwheel-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['ASYMMETRY', 'GRAVITY'],
      question: 'Why are M101\'s spiral arms noticeably asymmetric across its disk?',
      options: [
        'Gravitational tidal forces from neighboring companion galaxies distorted its shape',
        'It has no internal dark matter halo',
        'Solar wind from Earth pushed its arms',
        'It rotates in a square shape'
      ],
      correctAnswer: 0,
      explanation: 'Past close encounters with small companion galaxies exerted asymmetrical gravitational tugs on M101\'s outer disk.',
      banglaTranslation: {
        question: 'M101 এর সর্পিল বাহুগুলো অসামঞ্জস্যপূর্ণ (Asymmetric) কেন?',
        options: [
          'পাশের সঙ্গী গ্যালাক্সিগুলোর মহাকর্ষীয় জোয়ারের বল এর আকৃতি বিকৃত করেছে',
          'এর কোনো অভ্যন্তরীণ ডার্ক ম্যাটার হ্যালো নেই',
          'পৃথিবীর সৌর বায়ু এর বাহুকে ধাক্কা দিয়েছে',
          'এটি বর্গাকারে ঘোরে'
        ],
        explanation: 'আশেপাশের ছোট সঙ্গী গ্যালাক্সিগুলোর মহাকর্ষীয় প্রভাব M101 এর বাহুগুলোকে বিকৃত করেছে।'
      }
    },
    {
      id: 'pinwheel-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['SUPERNOVA', 'EVENTS'],
      question: 'What significant astronomical event occurred in M101 in 2023?',
      options: [
        'A supermassive black hole collision',
        'Supernova SN 2023ixf exploded in one of its spiral arms',
        'The galaxy merged with Andromeda',
        'A planetary ring formed around its core'
      ],
      correctAnswer: 1,
      explanation: 'SN 2023ixf was a brilliant Type II supernova observed in M101 in May 2023, offering a nearby stellar death laboratory.',
      banglaTranslation: {
        question: '২০২৩ সালে M101 গ্যালাক্সিতে কোন তাৎপর্যপূর্ণ জ্যোতির্বিজ্ঞান ঘটনাটি ঘটেছিল?',
        options: [
          'ব্ল্যাক হোল সংঘর্ষ',
          'একটি বাহুতে সুপারনোভা SN 2023ixf বিস্ফোরণ ঘটেছিল',
          'গ্যালাক্সিটি অ্যান্ড্রোমিডার সাথে একীভূত হয়',
          'কেন্দ্রে বলয় তৈরি হয়েছিল'
        ],
        explanation: '২০২৩ সালের মে মাসে M101 গ্যালাক্সিতে উজ্জ্বল টাইপ II সুপারনোভা (SN 2023ixf) ঘটেছিল।'
      }
    },
    {
      id: 'pinwheel-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['WEBB', 'CHEMISTRY'],
      question: 'What additional details does Webb\'s infrared view contribute to studying M101?',
      options: [
        'Infrared detection of dust lanes and complex organic molecules in star-forming zones',
        'Sound recordings of galactic core vibrations',
        'Cancelation of interstellar distance',
        'Color changes to Earth\'s sky'
      ],
      correctAnswer: 0,
      explanation: 'Webb\'s infrared optics map fine dust structures and polycyclic aromatic hydrocarbons (PAHs) associated with starbirth.',
      banglaTranslation: {
        question: 'ওয়েব টেলিস্কোপের ইনফ্রারেড চিত্র M101 গবেষণায় কী নতুন তথ্য যোগ করে?',
        options: [
          'ধূলিকণা এবং জটিল জৈব অণুর (PAHs) ইনফ্রারেড মানচিত্র',
          'গ্যালাকটিক কম্পনের শব্দ রেকর্ডিং',
          'মহাজাগতিক দূরত্বের অবসান',
          'পৃথিবীর আকাশের রঙ পরিবর্তন'
        ],
        explanation: 'ওয়েব টেলিস্কোপ ইনফ্রারেড আলো ব্যবহার করে তারা গঠনের স্থান ও ধূলিকণার রসায়ন উন্মোচন করে।'
      }
    }
  ],
  'black-eye': [
    {
      id: 'black-eye-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['NAME', 'DUST_LANE'],
      question: 'Why is Messier 64 popularly nicknamed the Black Eye Galaxy?',
      options: [
        'A prominent dark band of dust sits across the bright central core',
        'It contains a void with zero stars in the middle',
        'It is completely invisible in visible light',
        'It looks like an eye from every viewing angle'
      ],
      correctAnswer: 0,
      explanation: 'A dramatic dark cloud of absorbing interstellar dust obscures stars in front of the galaxy\'s bright nuclear core.',
      banglaTranslation: {
        question: 'মেসিয়ার ৬৪ গ্যালাক্সিটি কেন "ব্ল্যাক আই গ্যালাক্সি" নামে পরিচিত?',
        options: [
          'উজ্জ্বল কেন্দ্রের সামনে ধূলিকণার একটি অন্ধকার ব্যান্ড রয়েছে',
          'এর মাঝখানে কোনো তারা নেই',
          'এটি দৃশ্যমান আলোতে সম্পূর্ণ অদৃশ্য',
          'সব কোণ থেকে দেখতে চোখের মতো'
        ],
        explanation: 'উজ্জ্বল কেন্দ্রীয় অংশের সামনে অন্ধকার ধূলিকণা থাকার কারণে এটিকে "ব্ল্যাক আই" বলা হয়।'
      }
    },
    {
      id: 'black-eye-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['DISTANCE', 'COMA'],
      question: 'Approximately how far away from Earth is M64 located?',
      options: [
        '1.7 Million Light Years',
        '17 Million Light Years',
        '170 Million Light Years',
        '1.7 Billion Light Years'
      ],
      correctAnswer: 1,
      explanation: 'M64 resides approximately 17 million light-years away in the constellation Coma Berenices.',
      banglaTranslation: {
        question: 'M64 গ্যালাক্সিটি পৃথিবী থেকে আনুমানিক কত দূরে অবস্থিত?',
        options: [
          '১৭ লাখ আলোকবর্ষ',
          '১.৭ কোটি আলোকবর্ষ (17 Million Light Years)',
          '১৭ কোটি আলোকবর্ষ',
          '১.৭ বিলিয়ন আলোকবর্ষ'
        ],
        explanation: 'M64 গ্যালাক্সিটি আমাদের থেকে প্রায় ১.৭ কোটি আলোকবর্ষ দূরে অবস্থিত।'
      }
    },
    {
      id: 'black-eye-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['COUNTER_ROTATION', 'KINEMATICS'],
      question: 'What extraordinary kinematic motion occurs inside M64\'s gas disk?',
      options: [
        'The outer gas rotates in the OPPOSITE direction of the inner gas and stars',
        'The entire galaxy moves faster than the speed of light',
        'The core orbits in a vertical ring perpendicular to the disk',
        'The gas is completely frozen in place'
      ],
      correctAnswer: 0,
      explanation: 'M64 contains two counter-rotating disks: outer gas rotates in the opposite direction from the inner gas and stellar disk.',
      banglaTranslation: {
        question: 'M64 এর গ্যাস ডিস্কে কোন অসাধারণ গতিশীল ঘটনা ঘটে?',
        options: [
          'বাইরের গ্যাস অভ্যন্তরীণ গ্যাস ও তারার বিপরীত দিকে ঘোরে (Counter-rotation)',
          'পুরো গ্যালাক্সি আলোর গতির চেয়ে দ্রুত চলে',
          'কেন্দ্রটি খাড়া বলয়ে ঘোরে',
          'গ্যাস জমে এক জায়গায় স্থির হয়ে আছে'
        ],
        explanation: 'M64 এর বাইরের অংশের গ্যাস অভ্যন্তরীণ নক্ষত্র ও গ্যাসের বিপরীত দিকে ঘোরে।'
      }
    },
    {
      id: 'black-eye-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['MERGER', 'HISTORY'],
      question: 'What is the leading scientific explanation for M64\'s counter-rotating gas system?',
      options: [
        'An ancient galactic merger with a gas-rich satellite over 1 billion years ago',
        'Gravitational influence from Earth\'s orbit',
        'A solar eclipse in the constellation',
        'Radio wave reflection from black holes'
      ],
      correctAnswer: 0,
      explanation: 'Astrophysicists interpret counter-rotation as the fingerprint of absorbing a smaller gas-rich satellite galaxy in its past.',
      banglaTranslation: {
        question: 'M64 এর এই বিপরীত ঘূর্ণনের প্রধান বৈজ্ঞানিক ব্যাখ্যা কী?',
        options: [
          '১ বিলিয়ন বছরেরও আগে একটি ছোট স্যাটেলাইট গ্যালাক্সির সাথে প্রাচীন একীভূতকরণ (Merger)',
          'পৃথিবীর কক্ষপথের মহাকর্ষীয় প্রভাব',
          'তারামণ্ডলে সূর্যগ্রহণ',
          'ব্ল্যাক হোল থেকে রেডিও তরঙ্গের প্রতিফলন'
        ],
        explanation: 'প্রাচীনকালে একটি ছোট স্যাটেলাইট গ্যালাক্সিকে শোষণের ফলে এই বিপরীত ঘূর্ণনের সৃষ্টি হয়েছে।'
      }
    },
    {
      id: 'black-eye-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DUST', 'NATURE'],
      question: 'What is the dark patch in M64 actually composed of?',
      options: [
        'A giant black hole hole in space',
        'Solid interstellar dust grains and obscuring gas clouds',
        'A shadow cast by the Moon',
        'An empty void devoid of dark matter'
      ],
      correctAnswer: 1,
      explanation: 'The dark patch is composed of microscopic dust grains scattering and absorbing light, not a black hole or empty void.',
      banglaTranslation: {
        question: 'M64 এর অন্ধকার অংশটি প্রকৃতপক্ষে কী দিয়ে তৈরি?',
        options: [
          'একটি বিশাল ব্ল্যাক হোল',
          'ক্ষুদ্র আন্তঃনক্ষত্রীয় ধূলিকণা ও আলো শোষক গ্যাস মেঘ',
          'চাঁদের ছায়া',
          'খালি মহাজাগতিক শূন্যস্থান'
        ],
        explanation: 'অন্ধকার অংশটি একটি ব্ল্যাক হোল নয়, এটি আলো শোষক আন্তঃনক্ষত্রীয় ধূলিকণামেঘ।'
      }
    }
  ],
  'cartwheel': [
    {
      id: 'cartwheel-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DISTANCE', 'CATALOG'],
      question: 'Approximately how far away from Earth is the Cartwheel Galaxy located?',
      options: [
        '5 Million Light Years',
        '50 Million Light Years',
        '500 Million Light Years',
        '5 Billion Light Years'
      ],
      correctAnswer: 2,
      explanation: 'The Cartwheel Galaxy lies in the constellation Sculptor, roughly 500 million light-years from Earth.',
      banglaTranslation: {
        question: 'কার্টহুইল গ্যালাক্সিটি পৃথিবী থেকে আনুমানিক কত দূরে অবস্থিত?',
        options: [
          '৫০ লাখ আলোকবর্ষ',
          '৫ কোটি আলোকবর্ষ',
          '৫০ কোটি আলোকবর্ষ (500 Million Light Years)',
          '৫ বিলিয়ন আলোকবর্ষ'
        ],
        explanation: 'কার্টহুইল গ্যালাক্সিটি স্কাল্পটর তারামণ্ডলে প্রায় ৫০ কোটি (৫০০ মিলিয়ন) আলোকবর্ষ দূরে অবস্থিত।'
      }
    },
    {
      id: 'cartwheel-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['RING', 'COLLISION'],
      question: 'What cosmic process created the Cartwheel Galaxy\'s bright inner and outer ring structure?',
      options: [
        'A high-speed head-on collision with a smaller companion galaxy plunging through its disk',
        'A central supernova explosion',
        'Spontaneous decay of dark matter',
        'A stellar jet emitted by a magnetar'
      ],
      correctAnswer: 0,
      explanation: 'A smaller galaxy passed directly through the disk of the Cartwheel, producing expanding ripple-like density rings.',
      banglaTranslation: {
        question: 'কার্টহুইল গ্যালাক্সির উজ্জ্বল ভেতরের ও বাইরের রিং গঠন কীভাবে তৈরি হয়েছিল?',
        options: [
          'একটি ছোট সঙ্গী গ্যালাক্সির সাথে সরাসরি উচ্চগতির মহাজাগতিক সংঘর্ষ (Collision)',
          'কেন্দ্রীয় সুপারনোভা বিস্ফোরণ',
          'ডার্ক ম্যাটারের তেজস্ক্রিয় ক্ষয়',
          'ম্যাগনেটার থেকে নির্গত তারার জেস্ট'
        ],
        explanation: 'একটি ছোট গ্যালাক্সি এর ডিস্ক ভেদ করে চলে যাওয়ার ফলে পুকুরে ঢিল ফেলার মতো রিং তৈরি হয়।'
      }
    },
    {
      id: 'cartwheel-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['SHOCKWAVES', 'STARBURST'],
      question: 'What happens as the collision shockwaves expand outward through the Cartwheel\'s gas disk?',
      options: [
        'They destroy all existing stars permanently',
        'They compress gas clouds and trigger intense ring star formation',
        'They stop gravity from working',
        'They convert hydrogen into gold'
      ],
      correctAnswer: 1,
      explanation: 'Expanding density waves compress interstellar gas as they travel outward, sparking vibrant starburst rings.',
      banglaTranslation: {
        question: 'সংঘর্ষের ধাক্কা গ্যালাক্সির বাহ্যিক ডিস্কে ছড়িয়ে পড়ার সময় কী ঘটে?',
        options: [
          'বিদ্যমান নক্ষত্রগুলোকে স্থায়ীভাবে ধ্বংস করে',
          'গ্যাস সংকুচিত করে রিংয়ের চতুর্দিকে নতুন তারা গঠন ত্বরান্বিত করে',
          'মহাকর্ষ বন্ধ করে দেয়',
          'হাইড্রোজেনকে সোনায় পরিণত করে'
        ],
        explanation: 'প্রসারিত ঘনত্বের তরঙ্গ গ্যাস সংকুচিত করে বাহ্যিক রিংয়ে নতুন তারার জন্ম দেয়।'
      }
    },
    {
      id: 'cartwheel-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['WEBB', 'INSTRUMENTS'],
      question: 'Which James Webb Space Telescope instruments produced the famous composite view of the Cartwheel?',
      options: [
        'NIRCam (Near-Infrared Camera) and MIRI (Mid-Infrared Instrument)',
        'GPS and Sonar sensors',
        'Ultraviolet Spectrograph only',
        'Radio Telescope Array'
      ],
      correctAnswer: 0,
      explanation: 'Webb\'s NIRCam and MIRI composite reveals both young stars and fine silicate dust structure obscured in visible light.',
      banglaTranslation: {
        question: 'ওয়েব স্পেস টেলিস্কোপের কোন দুটি যন্ত্র কার্টহুইলের বিখ্যাত যৌথ চিত্র তৈরি করেছে?',
        options: [
          'NIRCam (নিয়ার-ইনফ্রারেড) এবং MIRI (মিড-ইনফ্রারেড)',
          'জিপিএস ও সোনার সেন্সর',
          'কেবল আল্ট্রাভায়োলেট স্পেকট্রোগ্রাফ',
          'রেডিও টেলিস্কোপ অ্যারে'
        ],
        explanation: 'ওয়েব টেলিস্কোপের NIRCam এবং MIRI ইনফ্রারেড আলো ব্যবহার করে এই স্পষ্ট দৃশ্য তৈরি করেছে।'
      }
    },
    {
      id: 'cartwheel-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['EVOLUTION', 'TRANSITION'],
      question: 'Why is the Cartwheel Galaxy of high scientific importance to astrophysicists?',
      options: [
        'It captures a galaxy in a temporary evolutionary state following a major collision',
        'It is located inside our Solar System',
        'It contains no stars whatsoever',
        'It is the oldest object in the universe'
      ],
      correctAnswer: 0,
      explanation: 'The Cartwheel offers a rare snapshot of a galaxy undergoing a transient ring phase while reconstructing its structure.',
      banglaTranslation: {
        question: 'জ্যোতির্বিজ্ঞানীদের কাছে কার্টহুইল গ্যালাক্সির বৈজ্ঞানিক গুরুত্ব কী?',
        options: [
          'এটি সংঘর্ষের পর গ্যালাক্সির একটি বিরল অস্থায়ী রূপান্তরের চিত্র প্রদান করে',
          'এটি আমাদের সৌরজগতের ভেতরে অবস্থিত',
          'এতে কোনো নক্ষত্র নেই',
          'এটি মহাবিশ্বের সবচেয়ে প্রাচীন বস্তু'
        ],
        explanation: 'এটি গ্যালাকটিক সংঘর্ষের পর অস্থায়ী রিং পর্যায়ের বিরল ঐতিহাসিক দলিল।'
      }
    }
  ],
  'large-magellanic-cloud': [
    {
      id: 'lmc-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DISTANCE', 'SATELLITE'],
      question: 'Approximately how far away from Earth is the Large Magellanic Cloud (LMC)?',
      options: [
        '16,000 Light Years',
        '160,000 Light Years',
        '1.6 Million Light Years',
        '16 Million Light Years'
      ],
      correctAnswer: 1,
      explanation: 'The LMC is a satellite dwarf galaxy orbiting the Milky Way at a distance of roughly 160,000 light-years.',
      banglaTranslation: {
        question: 'লার্জ ম্যাগেলানিক ক্লাউড (LMC) পৃথিবী থেকে আনুমানিক কত দূরে অবস্থিত?',
        options: [
          '১৬,০০০ আলোকবর্ষ',
          '১,৬০,০০০ আলোকবর্ষ (160,000 Light Years)',
          '১৬ লাখ আলোকবর্ষ',
          '১.৬ কোটি আলোকবর্ষ'
        ],
        explanation: 'LMC হলো মিল্কিওয়ের একটি স্যাটেলাইট বামন গ্যালাক্সি যা প্রায় ১,৬০,০০০ আলোকবর্ষ দূরে অবস্থিত।'
      }
    },
    {
      id: 'lmc-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['TARANTULA', 'STARBURST'],
      question: 'What is the name of the colossal energetic star-forming region located inside the LMC?',
      options: [
        'The Orion Nebula',
        'The Tarantula Nebula (30 Doradus)',
        'The Eagle Nebula',
        'The Crab Nebula'
      ],
      correctAnswer: 1,
      explanation: 'The Tarantula Nebula (30 Doradus) is the largest and most intense starburst region in the entire Local Group.',
      banglaTranslation: {
        question: 'LMC এর ভেতরে অবস্থিত বিশাল ও শক্তিপ্রদ তারা গঠনকারী অঞ্চলের নাম কী?',
        options: [
          'ওরিয়ন নেবুলা',
          'তারানতুলা নেবুলা (30 Doradus)',
          'ঈগল নেবুলা',
          'ক্র্যাব নেবুলা'
        ],
        explanation: 'LMC তে অবস্থিত তারানতুলা নেবুলা লোকাল গ্রুপের সবচেয়ে বড় তারা জন্মদানকারী অঞ্চল।'
      }
    },
    {
      id: 'lmc-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['MASS', 'RATIO'],
      question: 'How massive is the LMC compared to our Milky Way Galaxy?',
      options: [
        'Roughly 10–20% of the Milky Way\'s mass',
        'Equal in mass to the Milky Way',
        '10 times heavier than the Milky Way',
        'Less than 0.001%'
      ],
      correctAnswer: 0,
      explanation: 'Despite its compact size (~10-20% Milky Way mass), the LMC drives extraordinary massive star formation.',
      banglaTranslation: {
        question: 'মিল্কিওয়ের তুলনায় LMC এর ভর আনুমানিক কতটুকু?',
        options: [
          'মিল্কিওয়ের ভরের প্রায় ১০–২০% (10–20%)',
          'মিল্কিওয়ের সমান ভর সম্পন্ন',
          'মিল্কিওয়ের চেয়ে ১০ গুণ ভারী',
          '০.০০১% এরও কম'
        ],
        explanation: 'আকারে ছোট হলেও (মিল্কিওয়ের ভরের প্রায় ১০-২০%) LMC তে প্রচুর তারা তৈরি হয়।'
      }
    },
    {
      id: 'lmc-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['MASSIVE_STARS', 'WINDS'],
      question: 'How do supermassive young stars in the Tarantula Nebula affect their surrounding gas clouds?',
      options: [
        'Their intense ultraviolet radiation and stellar winds sculpt gas cavities',
        'They freeze gas into solid ice',
        'They extinguish all star formation',
        'They turn hydrogen into anti-matter'
      ],
      correctAnswer: 0,
      explanation: 'Massive star clusters radiate high UV energy and powerful stellar winds, blowing bubbles and carving gas pillars.',
      banglaTranslation: {
        question: 'তারানতুলা নেবুলার বিশাল নবীন তারাগুলো চারপাশের গ্যাস মেঘের ওপর কীভাবে প্রভাব ফেলে?',
        options: [
          'তাদের ইউভি বিকিরণ ও তারা বায়ু গ্যাস মেঘ খোদাই করে বুদ্বুদ তৈরি করে',
          'গ্যাসকে বরফে জমিয়ে ফেলে',
          'তারা গঠন পুরোপুরি বন্ধ করে দেয়',
          'হাইড্রোজেনকে অ্যান্টি-ম্যাটারে পরিণত করে'
        ],
        explanation: 'অতিবেগুনি বিকিরণ ও তারা বায়ু চারপাশের গ্যাস মেঘকে সরিয়ে ফাঁকা গহ্বর তৈরি করে।'
      }
    },
    {
      id: 'lmc-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['LABORATORY', 'PROXIMITY'],
      question: 'Why is the LMC considered a premier cosmic laboratory for astrophysicists?',
      options: [
        'It is close enough for space telescopes to resolve individual stars and nebulae',
        'It contains no dark matter halo',
        'It is located inside Sol\'s atmosphere',
        'It has no stars'
      ],
      correctAnswer: 0,
      explanation: 'Its relative proximity permits astronomers to study individual stellar lifetimes, dust physics, and starburst environments.',
      banglaTranslation: {
        question: 'জ্যোতির্বিজ্ঞানীদের কাছে LMC কেন একটি অন্যতম সেরা মহাজাগতিক গবেষণাগার?',
        options: [
          'এটি যথেষ্ট কাছে হওয়ায় একক নক্ষত্র ও নেবুলা স্পষ্ট পর্যবেক্ষণ করা যায়',
          'এর কোনো ডার্ক ম্যাটার হ্যালো নেই',
          'এটি সূর্যের বায়ুমণ্ডলের ভেতরে অবস্থিত',
          'এতে কোনো তারা নেই'
        ],
        explanation: 'কাছে অবস্থিত হওয়ায় টেলিস্কোপ দিয়ে এর একক নক্ষত্র ও নেবুলা নিখুঁতভাবে বিশ্লেষণ করা যায়।'
      }
    }
  ],
  'small-magellanic-cloud': [
    {
      id: 'smc-q1',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['DISTANCE', 'SOUTHERN_SKY'],
      question: 'Approximately how far away from Earth is the Small Magellanic Cloud (SMC)?',
      options: [
        '20,000 Light Years',
        '200,000 Light Years',
        '2 Million Light Years',
        '20 Million Light Years'
      ],
      correctAnswer: 1,
      explanation: 'The SMC is a dwarf satellite galaxy located approximately 200,000 light-years away from Earth.',
      banglaTranslation: {
        question: 'স্মল ম্যাগেলানিক ক্লাউড (SMC) পৃথিবী থেকে আনুমানিক কত দূরে অবস্থিত?',
        options: [
          '২০,০০০ আলোকবর্ষ',
          '২ লাখ আলোকবর্ষ (200,000 Light Years)',
          '২০ লাখ আলোকবর্ষ',
          '২ কোটি আলোকবর্ষ'
        ],
        explanation: 'SMC গ্যালাক্সিটি পৃথিবী থেকে প্রায় ২ লাখ আলোকবর্ষ দূরে অবস্থিত।'
      }
    },
    {
      id: 'smc-q2',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['CLASSIFICATION', 'DWARF'],
      question: 'What type of galaxy classification applies to the Small Magellanic Cloud?',
      options: [
        'Dwarf Irregular Satellite Galaxy',
        'Grand Design Spiral Galaxy',
        'Supergiant Elliptical Galaxy',
        'Polar-Ring Galaxy'
      ],
      correctAnswer: 0,
      explanation: 'The SMC is classified as a dwarf irregular satellite galaxy bound gravitationally to the Milky Way system.',
      banglaTranslation: {
        question: 'স্মল ম্যাগেলানিক ক্লাউড কোন ধরনের গ্যালাক্সির অন্তর্ভুক্ত?',
        options: [
          'অনিয়মিত বামন স্যাটেলাইট গ্যালাক্সি (Dwarf Irregular)',
          'গ্র্যান্ড ডিজাইন সর্পিল গ্যালাক্সি',
          'বিশালাকার উপবৃত্তাকার গ্যালাক্সি',
          'মেরু-বলয় গ্যালাক্সি'
        ],
        explanation: 'SMC হলো একটি অনিয়মিত বামন গ্যালাক্সি যা মিল্কিওয়ের চারপাশে ঘোরে।'
      }
    },
    {
      id: 'smc-q3',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      tags: ['METALLICITY', 'EARLY_UNIVERSE'],
      question: 'Why is the SMC\'s low heavy-element metallicity valuable to scientists?',
      options: [
        'It mimics primitive cosmic environments of the early universe',
        'It proves the universe has no dark matter',
        'It converts hydrogen into iron',
        'It stops star formation'
      ],
      correctAnswer: 0,
      explanation: 'Lower metallicity (~1/10th Milky Way) simulates chemical conditions common during early cosmic star formation epochs.',
      banglaTranslation: {
        question: 'SMC এর নিম্নের ধাতবতা (Low Metallicity) বিজ্ঞানীদের কাছে কেন গুরুত্বপূর্ণ?',
        options: [
          'এটি প্রারম্ভিক মহাবিশ্বের প্রাচীন পরিবেশের নমুনা প্রদান করে',
          'এটি প্রমাণ করে মহাবিশ্বে ডার্ক ম্যাটার নেই',
          'এটি হাইড্রোজেনকে লোহায় রূপান্তর করে',
          'এটি তারা গঠন থামিয়ে দেয়'
        ],
        explanation: 'SMC এর নিম্ন ধাতব উপাদান প্রাচীন মহাবিশ্বের প্রাথমিক পরিবেশের মতো।'
      }
    },
    {
      id: 'smc-q4',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      tags: ['NGC346', 'HUBBLE'],
      question: 'How many newborn stars did Hubble identify in the NGC 346 nursery inside the SMC?',
      options: [
        'About 25 Stars',
        'About 250 Stars',
        'More than 2,500 Newborn Stars',
        '25 Million Stars'
      ],
      correctAnswer: 2,
      explanation: 'Hubble observations of NGC 346 identified more than 2,500 low-mass newborn stars feeding on inward gas streams.',
      banglaTranslation: {
        question: 'হাবল টেলিস্কোপ SMC এর NGC 346 অঞ্চলে কতগুলো নতুন তারার সন্ধান পেয়েছে?',
        options: [
          'প্রায় ২৫টি তারা',
          'প্রায় ২৫০টি তারা',
          '২,৫০০টির বেশি নতুন তারা (More than 2,500 Stars)',
          '২.৫ কোটি তারা'
        ],
        explanation: 'হাবল টেলিস্কোপ NGC 346 অঞ্চলে ২,৫০০ এর বেশি নবজাতক তারা শনাক্ত করেছে।'
      }
    },
    {
      id: 'smc-q5',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      tags: ['VISIBILITY', 'OBSERVATION'],
      question: 'How does the SMC appear to observers under dark Southern Hemisphere skies without a telescope?',
      options: [
        'As a faint, hazy patch of light resembling a cloud',
        'As a bright red laser point',
        'It is completely invisible to human eyes',
        'As a giant ring around the Moon'
      ],
      correctAnswer: 0,
      explanation: 'Under clear dark skies in the Southern Hemisphere, the SMC is visible to the unaided eye as a faint hazy cloud.',
      banglaTranslation: {
        question: 'টেলিস্কোপ ছাড়া খালি চোখে রাতের আকাশে SMC কে কেমন দেখায়?',
        options: [
          'একটি আবছা মেঘের মতো আলোর ছোপ (Hazy patch of light)',
          'একটি উজ্জ্বল লাল লেজার বিন্দুর মতো',
          'খালি চোখে একেবারেই অদৃশ্য',
          'চাঁদের চারপাশে একটি বিশাল বলয়'
        ],
        explanation: 'দক্ষিণ গোলার্ধের আকাশে খালি চোখে SMC কে একটি আবছা মেঘের মতো দেখায়।'
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
