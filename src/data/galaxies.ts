import { Galaxy } from '../types';

export const GALAXIES: Galaxy[] = [
  {
    id: 'milky-way',
    name: 'Milky Way Galaxy',
    type: 'Barred Spiral Galaxy',
    distance: '0 Light Years (We Live Here!)',
    diameter: '100,000 Light Years',
    constellation: 'Sagittarius (Galactic Center)',
    age: '13.6 Billion Years',
    description: 'The Milky Way is a barred spiral galaxy that contains our Solar System, along with an estimated 100 to 400 billion other stars. From Earth, it appears as a band of light stretching across the night sky, which is actually the view of our galaxy\'s spiral arms from the inside. At its absolute core lies Sagittarius A*, a supermassive black hole with a mass about 4.3 million times that of our Sun.',
    funFacts: [
      'The Solar System takes about 230 million years to complete one full orbit around the galactic center (a "Galactic Year").',
      'The galaxy is constantly moving through space at about 600 kilometers per second (1.3 million mph).',
      'It has a warped, potato-chip-like shape caused by gravitational interactions with its satellite galaxies, the Magellanic Clouds.',
      'Our galaxy is currently cannibalizing other smaller galaxies, such as the Sagittarius Dwarf Spheroidal Galaxy.'
    ],
    visualColor: '#00d2ff',
    iconStyle: 'barred-spiral',
    x: 2500, // Central starting region
    y: 2500,
    radius: 90,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/43/ESO-VLT-Laser-phot-33a-07_composite.jpg',
    youtubeVideoId: '7u_Z2K6u1Y0',
    banglaTranslation: {
      name: 'মিল্কিওয়ে গ্যালাক্সি (Milky Way Galaxy)',
      type: 'দণ্ডযুক্ত সর্পিল গ্যালাক্সি (Barred Spiral Galaxy)',
      distance: '০ আলোকবর্ষ (আমরা এখানেই বাস করি!) (0 Light Years)',
      diameter: '১০০,০০০ আলোকবর্ষ (100,000 Light Years)',
      constellation: 'ধনু রাশি (Sagittarius - Galactic Center)',
      age: '১৩.৬ বিলিয়ন বছর (13.6 Billion Years)',
      description: 'মিল্কিওয়ে (Milky Way) হলো একটি দণ্ডযুক্ত সর্পিল গ্যালাক্সি (barred spiral galaxy) যা আমাদের সৌরজগৎকে (Solar System) ধারণ করে। আমাদের এই ছায়াপথে আনুমানিক ১০০ থেকে ৪০০ বিলিয়ন নক্ষত্র রয়েছে। পৃথিবী থেকে একে রাতের আকাশে আলোর একটি ব্যান্ড বা ফিতা হিসেবে দেখা যায়, যা মূলত ভেতর থেকে আমাদের গ্যালাক্সির সর্পিল বাহুগুলোর দৃশ্য। এর একদম কেন্দ্রে স্যাজিটেরিয়াস এ* (Sagittarius A*) নামের একটি সুপারম্যাসিভ ব্ল্যাক হোল (supermassive black hole) রয়েছে, যার ভর আমাদের সূর্যের ভরের চেয়ে প্রায় ৪.৩ মিলিয়ন গুণ বেশি।',
      funFacts: [
        'আমাদের সৌরজগৎ ছায়াপথের কেন্দ্রের চারপাশ দিয়ে একবার ঘুরে আসতে প্রায় ২৩০ மில்லியன் বছর সময় নেয়, একে একটি "গ্যালাকটিক বছর" (Galactic Year) বলা হয়।',
        'গ্যালাক্সিটি অনবরত প্রতি সেকেন্ডে প্রায় ৬০০ কিলোমিটার (১৩ লক্ষ মাইল প্রতি ঘন্টা) বেগে মহাবিশ্বের মধ্য দিয়ে ভ্রমণ করছে।',
        'ম্যাজেলানিক ক্লাউডস (Magellanic Clouds) নামক উপগ্রহ গ্যালাক্সিগুলোর মহাকর্ষীয় বলের কারণে এর আকৃতি কিছুটা বাঁকা এবং আলুর চিপসের মতো।',
        'আমাদের গ্যালাক্সি বর্তমানে অন্যান্য ছোট গ্যালাক্সিগুলোকে গ্রাস করছে, যেমন স্যাজিটেরিয়াস ডোয়ার্ফ স্ফেরয়ডাল গ্যালাক্সি।'
      ]
    },
    quizzes: [
      {
        question: 'What type of galaxy is the Milky Way?',
        options: [
          'Elliptical Galaxy',
          'Barred Spiral Galaxy',
          'Irregular Galaxy',
          'Lenticular Galaxy'
        ],
        correctAnswer: 1,
        explanation: 'The Milky Way is classified as a Barred Spiral Galaxy, meaning it has a central bar-shaped structure of stars with spiral arms extending outward.'
      },
      {
        question: 'What is the name of the supermassive black hole at the center of the Milky Way?',
        options: [
          'Sagittarius A*',
          'Ton 618',
          'M87*',
          'Cygnus X-1'
        ],
        correctAnswer: 0,
        explanation: 'Sagittarius A* (pronounced Sagittarius A-star) is the supermassive black hole located in the dense core of the Milky Way.'
      },
      {
        question: 'How long does the Solar System take to complete one full orbit around the Milky Way\'s center?',
        options: [
          '10,000 Years',
          '1 Million Years',
          '230 Million Years',
          '4.5 Billion Years'
        ],
        correctAnswer: 2,
        explanation: 'The Solar System takes about 230 million years to complete one "Galactic Year" around the center of our galaxy.'
      }
    ]
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (M31)',
    type: 'Spiral Galaxy',
    distance: '2.537 Million Light Years',
    diameter: '220,000 Light Years',
    constellation: 'Andromeda',
    age: '10 Billion Years',
    description: 'Andromeda is the closest major spiral galaxy to the Milky Way and is the largest galaxy in our Local Group. In dark, clear skies, Andromeda is one of the most distant objects visible to the naked eye. Crucially, Andromeda and the Milky Way are rushing toward each other under the pull of gravity and are predicted to collide in about 4.5 billion years, eventually merging to form a giant elliptical galaxy nicknamed "Milkomeda".',
    funFacts: [
      'Andromeda contains an estimated 1 trillion stars, which is more than double the number in the Milky Way.',
      'It is approaching the Milky Way at a velocity of about 110 kilometers per second.',
      'Andromeda has a double nucleus, indicating it likely swallowed a smaller companion galaxy in its past.',
      'Its halo of gas is massive, extending halfway to the Milky Way, meaning our galactic outer shells may already be touching!'
    ],
    visualColor: '#a855f7',
    iconStyle: 'spiral',
    x: 400,
    y: 1100,
    radius: 110,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/M31_09-01-2011_%28cropped%29.jpg',
    youtubeVideoId: '4M8r_F6VMyU',
    banglaTranslation: {
      name: 'অ্যান্ড্রোমিডা গ্যালাক্সি (Andromeda Galaxy - M31)',
      type: 'সর্পিল গ্যালাক্সি (Spiral Galaxy)',
      distance: '২.৫৩৭ মিলিয়ন আলোকবর্ষ (2.537 Million Light Years)',
      diameter: '২২০,০০০ আলোকবর্ষ (220,000 Light Years)',
      constellation: 'অ্যান্ড্রোমিডা তারামণ্ডল (Andromeda Constellation)',
      age: '১০ বিলিয়ন বছর (10 Billion Years)',
      description: 'অ্যান্ড্রোমিডা (Andromeda) আমাদের মিল্কিওয়ের সবচেয়ে কাছের প্রধান সর্পিল গ্যালাক্সি এবং এটি আমাদের লোকাল গ্রুপ (Local Group) বা স্থানীয় দলের বৃহত্তম গ্যালাক্সি। রাতের অন্ধকার মেঘমুক্ত আকাশে অ্যান্ড্রোমিডাকে খালি চোখে দেখা যায়। অ্যান্ড্রোমিডা এবং মিল্কিওয়ে মহাকর্ষীয় আকর্ষণে একে অপরের দিকে ছুটে আসছে এবং প্রায় ৪.৫ বিলিয়ন বছর পর এদের মধ্যে তীব্র সংঘর্ষ বা মহাকর্ষীয় মিলন ঘটবে, যা "মিল্কোমিডা" (Milkomeda) নামের এক বিশাল উপবৃত্তাকার গ্যালাক্সি গঠন করবে।',
      funFacts: [
        'অ্যান্ড্রোমিডাতে প্রায় ১ ট্রিলিয়ন (১,০০০,০০০,০০০,০০০) নক্ষত্র রয়েছে, যা মিল্কিওয়ের নক্ষত্রের চেয়ে দ্বিগুণেরও বেশি।',
        'এটি প্রতি সেকেন্ডে প্রায় ১১০ কিলোমিটার গতিতে মিল্কিওয়ের দিকে এগিয়ে আসছে।',
        'অ্যান্ড্রোমিডার দুটি কেন্দ্রস্থল রয়েছে, যা নির্দেশ করে যে এটি অতীতে কোনো ছোট গ্যালাক্সিকে গিলে ফেলেছে।',
        'এর চারপাশের গ্যাসের হ্যালো (gas halo) অত্যন্ত বিশাল, যা মিল্কিওয়ের অর্ধেক পথ পর্যন্ত বিস্তৃত।'
      ]
    },
    quizzes: [
      {
        question: 'In approximately how many years are the Milky Way and Andromeda galaxies predicted to collide?',
        options: [
          '100 Million Years',
          '1 Billion Years',
          '4.5 Billion Years',
          '10 Billion Years'
        ],
        correctAnswer: 2,
        explanation: 'The Milky Way and Andromeda are on a collision course and are predicted to merge in about 4.5 billion years due to mutual gravitational attraction.'
      },
      {
        question: 'Approximately how many stars does the Andromeda galaxy contain?',
        options: [
          '10 Billion',
          '100 Billion',
          '500 Billion',
          '1 Trillion'
        ],
        correctAnswer: 3,
        explanation: 'Andromeda is extremely dense and populous, housing roughly 1 trillion stars compared to the Milky Way\'s 100-400 billion.'
      },
      {
        question: 'Which group of galaxies do both the Milky Way and Andromeda belong to?',
        options: [
          'The Local Group',
          'The Virgo Supercluster',
          'The Hercules Cluster',
          'The Sombrero Cluster'
        ],
        correctAnswer: 0,
        explanation: 'Both galaxies, along with Triangulum and dozens of smaller dwarf galaxies, are part of our gravitationally bound "Local Group".'
      }
    ]
  },
  {
    id: 'sombrero',
    name: 'Sombrero Galaxy (M104)',
    type: 'Unbarred Spiral (approaching Lenticular)',
    distance: '28 Million Light Years',
    diameter: '50,000 Light Years',
    constellation: 'Virgo',
    age: '13.2 Billion Years',
    description: 'The Sombrero Galaxy is famous for its striking resemblance to a traditional Mexican hat. It features an exceptionally bright, bulbous central bulge of stars and a dramatic, dark dust lane traversing its equator. This thick dust ring is the primary site of star formation within the galaxy. Sombrero contains a massive supermassive black hole at its core (1 billion solar masses) and boasts an incredibly dense population of nearly 2,000 globular clusters.',
    funFacts: [
      'The central black hole of Sombrero is one of the most massive ever detected in a nearby galaxy—over 200 times the mass of Sagittarius A*.',
      'Its prominent dark dust lane is actually a symmetrical ring of dust and hydrogen gas encircling the galactic center.',
      'It is not a member of the Local Group; it resides in the southern edge of the Virgo Cluster.',
      'Astronomers are still debating whether Sombrero is a flat spiral galaxy or a giant elliptical galaxy that has engulfed a spiral.'
    ],
    visualColor: '#f43f5e',
    iconStyle: 'ring',
    x: 4600,
    y: 600,
    radius: 80,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/M104_ngc4594_sombrero_galaxy_hubble_heritage_00-07a.jpg',
    youtubeVideoId: 'UWeP9tM7XoM',
    banglaTranslation: {
      name: 'সোম্ব্রেরো গ্যালাক্সি (Sombrero Galaxy - M104)',
      type: 'দণ্ডহীন সর্পিল গ্যালাক্সি (Unbarred Spiral Galaxy)',
      distance: '২৮ মিলিয়ন আলোকবর্ষ (28 Million Light Years)',
      diameter: '৫০,০০০ আলোকবর্ষ (50,000 Light Years)',
      constellation: 'কন্যা রাশি (Virgo Constellation)',
      age: '১৩.২ বিলিয়ন বছর (13.2 Billion Years)',
      description: 'সোম্ব্রেরো গ্যালাক্সি (Sombrero Galaxy) তার মেক্সিকান হ্যাট বা টুপির মতো অনন্য আকৃতির জন্য অত্যন্ত বিখ্যাত। এর মাঝখানে একটি উজ্জ্বল ও স্ফীত নক্ষত্রপুঞ্জ রয়েছে এবং তার বিষুবরেখা বরাবর একটি অন্ধকার ধূলিকণার স্তর (dust lane) রয়েছে। এই ধূলিকণার রিংটিই মূলত নতুন নক্ষত্র তৈরির প্রধান স্থান। এর কেন্দ্রে ১ বিলিয়ন সৌর ভরের একটি অতিদানব কৃষ্ণগহ্বর (supermassive black hole) রয়েছে এবং এখানে প্রায় ২,০০০ গ্লোবিউলার ক্লাস্টার (globular cluster) রয়েছে।',
      funFacts: [
        'এর কেন্দ্রের ব্ল্যাক হোলটি আমাদের মিল্কিওয়ের কেন্দ্রের ব্ল্যাক হোলের চেয়ে প্রায় ২০০ গুণ বেশি শক্তিশালী এবং ভারী।',
        'এর বিষুবরেখার ডাস্ট রিংটি মূলত হাইড্রোজেন গ্যাস এবং মহাজাগতিক ধূলিকণা দ্বারা গঠিত একটি নিখুঁত প্রতিসম রিং।',
        'এটি লোকাল গ্রুপের সদস্য নয়; এটি কন্যা সুপারক্লাস্টারের (Virgo Cluster) দক্ষিণ প্রান্তে অবস্থিত।',
        'জ্যোতির্বিজ্ঞানীদের মধ্যে এখনো তর্ক চলছে যে এটি একটি চ্যাপ্টা সর্পিল গ্যালাক্সি নাকি একটি উপবৃত্তাকার গ্যালাক্সি যা অন্য সর্পিল গ্যালাক্সিকে গ্রাস করেছে।'
      ]
    },
    quizzes: [
      {
        question: 'What gives the Sombrero Galaxy its distinctive "Mexican hat" appearance?',
        options: [
          'A giant black hole jet shoots out of the poles',
          'A bright central stellar bulge and a dark, equatorial dust lane',
          'It is bent in half due to a collision',
          'It has multiple concentric rings of glowing nebula gas'
        ],
        correctAnswer: 1,
        explanation: 'The Sombrero Galaxy owes its look to its thick, dark, equatorial dust ring contrasted against a very large, bright central bulge of stars.'
      },
      {
        question: 'How massive is the supermassive black hole at the center of the Sombrero Galaxy?',
        options: [
          '10,000 solar masses',
          '4.3 million solar masses',
          '1 billion solar masses',
          '1 trillion solar masses'
        ],
        correctAnswer: 2,
        explanation: 'The supermassive black hole in Sombrero is incredibly massive, weighing in at approximately 1 billion Suns.'
      },
      {
        question: 'Sombrero is exceptionally rich in which type of star clusters?',
        options: [
          'Open clusters',
          'Globular clusters',
          'Pleiades clusters',
          'Stellar nurseries'
        ],
        correctAnswer: 1,
        explanation: 'Sombrero has an extremely rich system of nearly 2,000 globular clusters, which are spherical collections of very old stars orbiting the galactic core.'
      }
    ]
  },
  {
    id: 'whirlpool',
    name: 'Whirlpool Galaxy (M51)',
    type: 'Classic Grand Design Spiral',
    distance: '23 Million Light Years',
    diameter: '76,000 Light Years',
    constellation: 'Canes Venatici',
    age: '400 Million Years (current structure)',
    description: 'The Whirlpool Galaxy is the textbook example of a "grand design" spiral galaxy, with beautifully defined, sweeping spiral arms. It is highly famous for its intense gravitational interaction with its smaller, yellowish companion galaxy, NGC 5195, which is visible at the tip of one of its arms. This ongoing interaction has sent gravitational shockwaves through Whirlpool, compressing gas clouds and triggering a massive burst of new star formation.',
    funFacts: [
      'M51 was the very first astronomical nebula recognized as having a spiral structure, discovered by Lord Rosse in 1845.',
      'The spiral arms are actually "density waves"—areas of higher density where stars and gas slow down, like a traffic jam.',
      'The smaller companion galaxy (NGC 5195) is passing behind Whirlpool and has been doing so for hundreds of millions of years.',
      'The intense blue color in its spiral arms is due to clusters of young, hot, massive stars.'
    ],
    visualColor: '#10b981',
    iconStyle: 'spiral',
    x: 500,
    y: 4400,
    radius: 95,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Messier51a.jpg',
    youtubeVideoId: 'D3v9bO6eYRE',
    banglaTranslation: {
      name: 'হোয়ার্লপুল গ্যালাক্সি (Whirlpool Galaxy - M51)',
      type: 'ক্লাসিক গ্র্যান্ড ডিজাইন সর্পিল গ্যালাক্সি (Grand Design Spiral)',
      distance: '২৩ মিলিয়ন আলোকবর্ষ (23 Million Light Years)',
      diameter: '৭৬,০০০ আলোকবর্ষ (76,000 Light Years)',
      constellation: 'ক্যানিস ভেনাটিকি (Canes Venatici Constellation)',
      age: '৪০০ মিলিয়ন বছর (বর্তমান কাঠামো)',
      description: 'হোয়ার্লপুল গ্যালাক্সি (Whirlpool Galaxy) হলো একটি "গ্র্যান্ড ডিজাইন" সর্পিল গ্যালাক্সির চমৎকার উদাহরণ, যার সর্পিল বাহুগুলো অত্যন্ত সুস্পষ্ট ও নিখুঁত। এর অন্যতম প্রধান আকর্ষণ হলো এর একটি বাহুর প্রান্তে থাকা এনজিসি ৫১৯৫ (NGC 5195) নামক ছোট এবং হলুদ রঙের সঙ্গী গ্যালাক্সিটির সাথে চলমান মহাকর্ষীয় পারস্পরিক মিথস্ক্রিয়া। এই মহাকর্ষীয় টান হোয়ার্লপুলের মধ্যে মহাকর্ষীয় শকওয়েভ তৈরি করেছে, যা গ্যাসের মেঘকে সংকুচিত করে নতুন নক্ষত্র তৈরির তীব্র প্রক্রিয়া (starburst) শুরু করেছে।',
      funFacts: [
        '১৮৪৫ সালে লর্ড রস (Lord Rosse) প্রথম সর্পিল আকৃতির নীহারিকা হিসেবে এম৫১ (M51) কে চিহ্নিত করেন।',
        'এর সর্পিল বাহুগুলো মূলত "ঘনত্ব তরঙ্গ" (density waves) — এমন এলাকা যেখানে তারা এবং গ্যাস ট্রাফিক জ্যামের মতো ধীর হয়ে যায়।',
        'এনজিসি ৫১৯৫ সঙ্গী গ্যালাক্সিটি হোয়ার্লপুলের পিছন দিক দিয়ে কয়েকশো মিলিয়ন বছর ধরে অতিক্রম করছে।',
        'এর সর্পিল বাহুগুলোর উজ্জ্বল নীল রঙের কারণ হলো সেখানে সদ্য জন্ম নেওয়া তরুণ ও অতিউষ্ণ নক্ষত্রদের উপস্থিতি।'
      ]
    },
    quizzes: [
      {
        question: 'Whirlpool is a "grand design" spiral galaxy. What does this mean?',
        options: [
          'It was created by an alien civilization',
          'It has prominent, well-defined, and sweeping spiral arms',
          'It is perfectly spherical with no dust',
          'It is a double-decker galaxy with two core disks'
        ],
        correctAnswer: 1,
        explanation: 'A grand design spiral galaxy is characterized by having highly visible, distinct, and beautifully organized spiral arms wrapping around its core.'
      },
      {
        question: 'What triggers the intense starburst (star creation) in the Whirlpool Galaxy?',
        options: [
          'High amounts of dark energy',
          'Gravitational interaction with its small companion galaxy NGC 5195',
          'Explosions of central black holes',
          'Intense solar flares from its old stars'
        ],
        correctAnswer: 1,
        explanation: 'Gravitational forces from the nearby companion galaxy NGC 5195 compress gas clouds inside Whirlpool\'s arms, inducing rapid starbirth.'
      },
      {
        question: 'Who first discovered the spiral nature of the Whirlpool Galaxy in 1845?',
        options: [
          'Edwin Hubble',
          'Lord Rosse',
          'Charles Messier',
          'Albert Einstein'
        ],
        correctAnswer: 1,
        explanation: 'William Parsons (the 3rd Earl of Rosse) identified Whirlpool\'s spiral structure in 1845 using his giant telescope, the "Leviathan of Parsonstown".'
      }
    ]
  },
  {
    id: 'triangulum',
    name: 'Triangulum Galaxy (M33)',
    type: 'Spiral Galaxy',
    distance: '2.73 Million Light Years',
    diameter: '60,000 Light Years',
    constellation: 'Triangulum',
    age: '12 Billion Years',
    description: 'The Triangulum Galaxy is the third-largest member of our Local Group, behind Andromeda and the Milky Way. It is a smaller spiral galaxy with no central bar structure, orbiting its larger neighbor Andromeda. Despite its smaller size, Triangulum is incredibly active. It houses NGC 604, one of the largest and most active stellar nurseries (H II starbirth regions) in the entire Local Group, which glows brightly with ionized hydrogen gas.',
    funFacts: [
      'NGC 604 is so massive that if it were at the same distance as the Orion Nebula, it would be the brightest object in our night sky besides the Moon.',
      'Triangulum is sometimes considered a satellite galaxy of Andromeda, bound by its heavy gravitational pull.',
      'Unlike the Milky Way, Triangulum lacks a supermassive black hole at its center, or if it has one, it is extremely small (under 3,000 solar masses).',
      'It is rotating in the opposite direction of what is typical, which might be a result of past galactic encounters.'
    ],
    visualColor: '#eab308',
    iconStyle: 'spiral',
    x: 4500,
    y: 4300,
    radius: 85,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Messier_33_by_HST.jpg',
    youtubeVideoId: '5aT9wZ6fJc0',
    banglaTranslation: {
      name: 'ট্রায়াঙ্গুলাম গ্যালাক্সি (Triangulum Galaxy - M33)',
      type: 'সর্পিল গ্যালাক্সি (Spiral Galaxy)',
      distance: '২.৭৩ মিলিয়ন আলোকবর্ষ (2.73 Million Light Years)',
      diameter: '৬০,০০০ আলোকবর্ষ (60,000 Light Years)',
      constellation: 'ত্রিকোণ তারামণ্ডল (Triangulum Constellation)',
      age: '১২ বিলিয়ন বছর (12 Billion Years)',
      description: 'ট্রায়াঙ্গুলাম গ্যালাক্সি (Triangulum Galaxy) আমাদের লোকাল গ্রুপের তৃতীয় বৃহত্তম সদস্য। এটি অ্যান্ড্রোমিডা গ্যালাক্সির একটি উপগ্রহ গ্যালাক্সি যা কোনো কেন্দ্রীয় দণ্ড (central bar) ছাড়াই গঠিত। আকারে তুলনামূলক ছোট হলেও এটি অত্যন্ত সক্রিয়। এখানে এনজিসি ৬০৪ (NGC 604) নামক লোকাল গ্রুপের অন্যতম বৃহৎ এবং সক্রিয় নক্ষত্র তৈরির নার্সারি বা অঞ্চল রয়েছে, যা আয়োনাইজড হাইড্রোজেন গ্যাসের কারণে উজ্জ্বল হয়ে জ্বলে।',
      funFacts: [
        'এনজিসি ৬০৪ এতটাই বিশাল যে এটি যদি ওরিয়ন নেবুলার মতো আমাদের কাছাকাছি থাকত, তবে এটি রাতের আকাশে চাঁদের পর দ্বিতীয় উজ্জ্বলতম বস্তু হতো।',
        'ট্রায়াঙ্গুলাম গ্যালাক্সির কেন্দ্রে কোনো সুপারম্যাসিভ ব্ল্যাক হোল নেই বা থাকলেও তা ৩,০০০ সৌর ভরের চেয়ে কম।',
        'এটি সাধারণ গ্যালাক্সির বিপরীত দিকে ঘোরে, যা অতীতে অন্যান্য গ্যালাক্সির সাথে মুখোমুখি সংঘর্ষের ফলাফল হতে পারে।',
        'ভবিষ্যতে এটি অ্যান্ড্রোমিডা বা মিল্কিওয়ের সাথে একীভূত হয়ে যাবে।'
      ]
    },
    quizzes: [
      {
        question: 'What major astronomical feature does Triangulum lack at its center?',
        options: [
          'Stars',
          'Dark matter',
          'A supermassive black hole',
          'Nebulae'
        ],
        correctAnswer: 2,
        explanation: 'Unlike most large spiral galaxies (including the Milky Way and Andromeda), Triangulum does not appear to possess a central supermassive black hole.'
      },
      {
        question: 'What is NGC 604, found in one of Triangulum\'s spiral arms?',
        options: [
          'A newly discovered exoplanet',
          'One of the largest known starburst nurseries in the Local Group',
          'A mysterious neutron star pulsar',
          'A supermassive black hole'
        ],
        correctAnswer: 1,
        explanation: 'NGC 604 is an enormous stellar nursery (H II region) in Triangulum, measuring 1,500 light-years across and glowing with hot, newly formed stars.'
      },
      {
        question: 'Which larger galaxy is Triangulum gravitationally bound to and likely orbiting?',
        options: [
          'The Milky Way',
          'Andromeda Galaxy',
          'Sombrero Galaxy',
          'Whirlpool Galaxy'
        ],
        correctAnswer: 1,
        explanation: 'Triangulum is gravitationally bound to Andromeda (M31) and is considered a satellite galaxy, eventually merging with it or the Milky Way.'
      }
    ]
  },
  {
    id: 'black-eye',
    name: 'Black Eye Galaxy (M64)',
    type: 'Spiral Galaxy',
    distance: '17 Million Light Years',
    diameter: '40,000 Light Years',
    constellation: 'Coma Berenices',
    age: '13 Billion Years',
    description: 'The Black Eye Galaxy (sometimes called the "Evil Eye" or "Sleeping Beauty" galaxy) is famous for its dark, sweeping band of dust that lies in front of its bright core, giving it a shadowed, bruised appearance. Deeply bizarre, astronomers discovered that the gas in its outer region is rotating in the OPPOSITE direction of the gas and stars in its inner region. This counter-rotation is highly unstable and is the result of a massive collision with a smaller satellite galaxy about 1 billion years ago.',
    funFacts: [
      'The inner gas disk rotates clockwise, while the outer gas disk—extending up to 40,000 light-years—rotates counter-clockwise.',
      'Active star formation occurs exclusively at the boundary zone where the oppositely-rotating gas disks collide and compress.',
      'It is a popular target for amateur astronomers due to its prominent dust lane, visible even with modest backyard telescopes.',
      'The collision that caused its counter-rotation has completely settled, leaving behind no remaining structural traces of the swallowed dwarf galaxy.'
    ],
    visualColor: '#f97316',
    iconStyle: 'elliptical',
    x: 2500,
    y: 300,
    radius: 75,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/M64_Hubble.jpg',
    youtubeVideoId: 'fD3t93-H6g8',
    banglaTranslation: {
      name: 'ব্ল্যাক আই গ্যালাক্সি (Black Eye Galaxy - M64)',
      type: 'সর্পিল গ্যালাক্সি (Spiral Galaxy)',
      distance: '১৭ মিলিয়ন আলোকবর্ষ (17 Million Light Years)',
      diameter: '৪০,০০০ আলোকবর্ষ (40,000 Light Years)',
      constellation: 'কোমা বেরেনিসেস (Coma Berenices Constellation)',
      age: '১৩ বিলিয়ন বছর (13 Billion Years)',
      description: 'ব্ল্যাক আই গ্যালাক্সি (কখনো কখনো "ইভিল আই" বা "স্লিপিং বিউটি" গ্যালাক্সি বলা হয়) এর কেন্দ্রের সামনে থাকা একটি অন্ধকার ও বিস্তৃত ধূলিকণার ব্যান্ডের জন্য পরিচিত, যা একে একটি কালচে কালশিটে পড়া বা আঘাতপ্রাপ্ত চোখের মতো দেখায়। অত্যন্ত অদ্ভুতভাবে, জ্যোতির্বিজ্ঞানীরা আবিষ্কার করেছেন যে এর বাইরের অঞ্চলের গ্যাস ভেতরের গ্যাস এবং তারার ঘূর্ণনের সম্পূর্ণ বিপরীত দিকে ঘোরে! এই বিপরীতমুখী ঘূর্ণনটি অত্যন্ত অস্থির এবং ১ বিলিয়ন বছর আগে একটি ছোট উপগ্রহ গ্যালাক্সির সাথে সংঘর্ষের ফলে সৃষ্ট হয়েছে।',
      funFacts: [
        'এর ভেতরের গ্যাস ঘড়ির কাঁটার দিকে ঘোরে, কিন্তু বাইরের গ্যাস ঘড়ির কাঁটার বিপরীত দিকে ঘোরে।',
        'যেখানে এই দুটি বিপরীতমুখী ঘূর্ণায়মান গ্যাসস্তর একে অপরকে ঘষে বা ধাক্কা দেয়, ঠিক সেই সীমানা অঞ্চলেই নতুন নক্ষত্র জন্ম নেওয়ার প্রক্রিয়া (star formation) শুরু হয়।',
        'ধূলিকণার এই স্পষ্ট কালচে ফিতার কারণে বাড়ির ছাদে থাকা ছোট টেলিস্কোপ দিয়েও অপেশাদার জ্যোতির্বিজ্ঞানীরা এটি সহজে পর্যবেক্ষণ করতে পারেন।',
        'এই সংঘর্ষের ফলে যে বিপরীতমুখী ধূলিকণা সৃষ্টি হয়েছে, তা ছাড়া গ্রাসকৃত বামন গ্যালাক্সিটির আর কোনো চিহ্ন অবশিষ্ট নেই।'
      ]
    },
    quizzes: [
      {
        question: 'What bizarre rotational feature does the Black Eye Galaxy exhibit?',
        options: [
          'It does not rotate at all',
          'Its core rotates vertically while its outer arms rotate horizontally',
          'Its outer gas disk rotates in the opposite direction of its inner gas disk',
          'It is spinning faster than the speed of light'
        ],
        correctAnswer: 2,
        explanation: 'The gas in the outer parts of M64 spins counter-clockwise, while the stars and gas in the inner parts spin clockwise—a rare phenomenon called counter-rotation.'
      },
      {
        question: 'What historical event caused M64\'s opposing rotational disks?',
        options: [
          'A supermassive supernova explosion',
          'The merger with a gas-rich dwarf satellite galaxy about 1 billion years ago',
          'Passing near a massive dark matter clump',
          'High tidal pull from the Milky Way'
        ],
        correctAnswer: 1,
        explanation: 'The counter-rotating gas is believed to be the remnant of a gas-rich satellite galaxy that merged with M64 about a billion years ago.'
      },
      {
        question: 'Where does star formation actively occur in the Black Eye Galaxy?',
        options: [
          'Only at the absolute center',
          'At the boundary where the two oppositely-spinning gas disks rub together',
          'In the empty space outside the galaxy',
          'Nowhere; the galaxy is completely dead'
        ],
        correctAnswer: 1,
        explanation: 'Star formation is compressed and triggered specifically along the sheer boundary zone where the two oppositely-rotating gas sheets crash into each other.'
      }
    ]
  },
  {
    id: 'pinwheel',
    name: 'Pinwheel Galaxy (M101)',
    type: 'Face-On Grand Spiral',
    distance: '21 Million Light Years',
    diameter: '170,000 Light Years',
    constellation: 'Ursa Major',
    age: '13.1 Billion Years',
    description: 'The Pinwheel Galaxy is an enormous face-on spiral galaxy located in the constellation Ursa Major (the Great Bear). It is nearly twice the diameter of the Milky Way and contains over 1 trillion stars. Because Earth views Pinwheel directly face-on, its graceful spiral arms and over 3,000 glowing star-forming nebulae (H II regions) are visible in vivid, breathtaking detail.',
    funFacts: [
      'Pinwheel contains huge starbirth regions called H II regions, where massive clouds of molecular hydrogen collapse to form bright blue star clusters.',
      'Gravitational interactions with neighboring companion galaxies have pulled its spiral arms slightly asymmetrical and lopsided.',
      'It contains an estimated 1 trillion stars, making it one of the largest spiral galaxies in our cosmological neighborhood.',
      'A famous Type Ia supernova (SN 2023ixf) erupted in one of its spiral arms in May 2023, visible with amateur telescopes!'
    ],
    visualColor: '#06b6d4',
    iconStyle: 'spiral',
    x: 1200,
    y: 3800,
    radius: 100,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/m101_hst_big.jpg',
    youtubeVideoId: 'f0X1X1P8PjE',
    banglaTranslation: {
      name: 'পিনহুইল গ্যালাক্সি (Pinwheel Galaxy - M101)',
      type: 'ফেস-অন গ্র্যান্ড সর্পিল গ্যালাক্সি (Face-On Grand Spiral)',
      distance: '২১ মিলিয়ন আলোকবর্ষ (21 Million Light Years)',
      diameter: '১৭০,০০০ আলোকবর্ষ (170,000 Light Years)',
      constellation: 'সপ্তর্ষি মণ্ডল (Ursa Major Constellation)',
      age: '১৩.১ বিলিয়ন বছর (13.1 Billion Years)',
      description: 'পিনহুইল গ্যালাক্সি (Pinwheel Galaxy) হলো সপ্তর্ষি মণ্ডলে (Ursa Major) অবস্থিত একটি বিশাল ফেস-অন সর্পিল গ্যালাক্সি। এটি আমাদের মিল্কিওয়ের ব্যাসের প্রায় দ্বিগুণ এবং এতে ১ ট্রিলিয়নেরও বেশি নক্ষত্র রয়েছে। পৃথিবী থেকে একে একদম সরাসরি উপর থেকে দেখা যায় বলে এর চোখ ধাঁধানো সর্পিল বাহু এবং ৩,০০০ এরও বেশি নক্ষত্র তৈরির জ্বলন্ত নীহারিকা অঞ্চল অত্যন্ত স্পষ্টভাবে দেখা যায়।',
      funFacts: [
        'পিনহুইলে এইচ ২ (H II) নামক বিশাল নক্ষত্র তৈরির অঞ্চল রয়েছে, যেখানে হাইড্রোজেনের বড় বড় মেঘ সংকুচিত হয়ে নতুন নীল নক্ষত্র তৈরি করে।',
        'পাশের ছোট প্রতিবেশী গ্যালাক্সিগুলোর মহাকর্ষীয় টানের কারণে এর সর্পিল বাহুগুলো কিছুটা অসম ও বাঁকানো।',
        '২০২৩ সালের মে মাসে এর একটি বাহুতে একটি বিখ্যাত টাইপ ১এ সুপারনোভা (SN 2023ixf) বিস্ফোরিত হয়েছিল।',
        'এটি মহাবিশ্বের অন্যতম উজ্জ্বল এবং সুন্দর সর্পিল গ্যালাক্সির একটি উৎকৃষ্ট উদাহরণ।'
      ]
    },
    quizzes: [
      {
        question: 'Why is the Pinwheel Galaxy (M101) so famous among astronomers?',
        options: [
          'It is oriented completely face-on to Earth, revealing all spiral arms in detail',
          'It is made entirely of dark matter with no stars',
          'It is moving faster than light',
          'It has three central black holes'
        ],
        correctAnswer: 0,
        explanation: 'Because M101 is oriented face-on toward Earth, astronomers get an unobstructed, textbook view of its entire spiral structure and star nurseries.'
      },
      {
        question: 'How does the diameter of the Pinwheel Galaxy compare to the Milky Way?',
        options: [
          'It is half the size',
          'It is nearly twice as wide (170,000 light-years across)',
          'It is exactly identical',
          'It is ten times smaller'
        ],
        correctAnswer: 1,
        explanation: 'M101 is an exceptionally large spiral galaxy, spanning roughly 170,000 light-years across compared to the Milky Way\'s 100,000 light-years.'
      },
      {
        question: 'What major stellar explosion event occurred in M101 in May 2023?',
        options: [
          'A gamma-ray burst',
          'A Type Ia Supernova (SN 2023ixf)',
          'A black hole merger',
          'A pulsar wind pulse'
        ],
        correctAnswer: 1,
        explanation: 'In May 2023, Japanese amateur astronomer Koichi Itagaki discovered SN 2023ixf, a bright supernova in M101 that was studied by telescopes worldwide.'
      }
    ]
  },
  {
    id: 'cartwheel',
    name: 'Cartwheel Galaxy (ESO 350-40)',
    type: 'Ring Galaxy',
    distance: '500 Million Light Years',
    diameter: '150,000 Light Years',
    constellation: 'Sculptor',
    age: '500 Million Years (Ring Structure)',
    description: 'The Cartwheel Galaxy is a spectacular ring galaxy formed as the result of a violent, head-on galactic collision. Roughly 440 million years ago, a smaller companion galaxy plummeted directly through the center of Cartwheel like a bullseye. This created high-speed gravitational shockwaves expanding outward—much like throwing a pebble into a pond—pushing gas and dust to trigger an intense outer ring of starburst star creation.',
    funFacts: [
      'The expanding outer ring spans 150,000 light-years and is moving outward at 217,000 miles per hour (350,000 km/h).',
      'Cartwheel has two rings: a bright inner ring surrounding the core and a massive outer ring brimming with young, hot blue stars.',
      'NASA\'s James Webb Space Telescope (JWST) captured detailed infrared images revealing spokes connecting the inner and outer rings.',
      'It was originally a normal spiral galaxy before the high-speed collision shattered its shape.'
    ],
    visualColor: '#38bdf8',
    iconStyle: 'ring',
    x: 3800,
    y: 2200,
    radius: 90,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Cartwheel_Galaxy.jpg',
    youtubeVideoId: 'k1_J0S2193M',
    banglaTranslation: {
      name: 'কার্টহুইল গ্যালাক্সি (Cartwheel Galaxy)',
      type: 'রিং বা আংটি আকৃতির গ্যালাক্সি (Ring Galaxy)',
      distance: '৫০০ মিলিয়ন আলোকবর্ষ (500 Million Light Years)',
      diameter: '১৫০,০০০ আলোকবর্ষ (150,000 Light Years)',
      constellation: 'ভাস্কর তারামণ্ডল (Sculptor Constellation)',
      age: '৫০০ মিলিয়ন বছর (রিং কাঠামো)',
      description: 'কার্টহুইল গ্যালাক্সি (Cartwheel Galaxy) হলো একটি দুর্দান্ত রিং গ্যালাক্সি যা দুটি গ্যালাক্সির মুখোমুখি তীব্র সংঘর্ষের ফলে গঠিত হয়েছে। প্রায় ৪৪০ মিলিয়ন বছর আগে একটি ছোট সঙ্গী গ্যালাক্সি কার্টহুইলের মাঝখান দিয়ে সরাসরি বুলেট বা বলের মতো আঘাত করে চলে যায়। এর ফলে সৃষ্টি হওয়া মহাকর্ষীয় শকওয়েভ বাইরের দিকে ছড়িয়ে পড়ে এবং গ্যাসের মেঘকে সংকুচিত করে একটি নতুন নক্ষত্রভরা বাহ্যিক আংটি বা রিং তৈরি করে।',
      funFacts: [
        'বাইরের প্রসারিত রিংটি প্রতি ঘন্টায় ৩৫০,০০০ কিলোমিটার বেগে বাইরের দিকে প্রসারিত হচ্ছে।',
        'কার্টহুইলের দুটি রিং রয়েছে: কেন্দ্র ঘিরে থাকা একটি উজ্জ্বল ভেতরের রিং এবং তরুণ নীল নক্ষত্রে ভরা একটি বিশাল বাইরের রিং।',
        'জেমস ওয়েব স্পেস টেলিস্কোপ (JWST) এর অবলোহিত চিত্রে এর রিংগুলোর মধ্যে সংযোগকারী "স্পোক" বা চাকার শিকের মতো কাঠামো দেখা গেছে।',
        'সংঘর্ষের আগে এটি একটি সাধারণ সর্পিল গ্যালাক্সি ছিল।'
      ]
    },
    quizzes: [
      {
        question: 'What catastrophic astronomical event formed the unique ring shape of the Cartwheel Galaxy?',
        options: [
          'A supermassive black hole explosion',
          'A small companion galaxy plunged head-on through its center',
          'Rapid rotation threw off all its outer gas',
          'Passing through a dense dark matter web'
        ],
        correctAnswer: 1,
        explanation: 'Cartwheel\'s ring structure is the result of a cosmic bullseye collision where a smaller galaxy punched straight through its central core.'
      },
      {
        question: 'Which space telescope captured landmark infrared images of Cartwheel revealing spokes in its ring?',
        options: [
          'Hubble Space Telescope',
          'James Webb Space Telescope (JWST)',
          'Kepler Observatory',
          'Spitzer Telescope'
        ],
        correctAnswer: 1,
        explanation: 'JWST\'s NIRCam and MIRI instruments pierced through thick cosmic dust, imaging the glowing spokes connecting the inner and outer rings.'
      },
      {
        question: 'At approximately what speed is Cartwheel\'s outer starburst ring expanding outward?',
        options: [
          '1,000 mph',
          '217,000 mph (350,000 km/h)',
          'Speed of sound',
          'Speed of light'
        ],
        correctAnswer: 1,
        explanation: 'The gravitational shockwave continues pushing gas outward into space at an astonishing 217,000 miles per hour.'
      }
    ]
  }
];

