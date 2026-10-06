import { PhysicsChapterFullData } from '../types';

export const CH09_REFRACTION_DATA: PhysicsChapterFullData = {
  id: 'ssc-phy-ch09',
  chapterNo: 9,
  subjectCode: 'SSC-PHY',
  titleEn: 'Refraction of Light',
  titleBn: 'আলোর প্রতিসরণ',
  division: 'waves_optics',
  divisionTitleEn: 'Waves & Optics',
  divisionTitleBn: 'তরঙ্গ ও আলোকবিজ্ঞান',
  iconName: 'Glasses',
  estimatedMinutes: 45,
  boardMarksAllocation: 'CQ ১০ নম্বর (ক: ১, খ: ২, গ: ৩, ঘ: ৪) + MCQ ৩-৪ নম্বর',
  overviewBn:
    'আলোক রশ্মি এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে তির্যকভাবে প্রবেশের সময় মাধ্যমদ্বয়ের বিভেদতলে এর গতির দিক পরিবর্তিত হয়— একে আলোর প্রতিসরণ বলে। এই অধ্যায়ে স্নেলের সূত্র, প্রতিসরাঙ্ক, সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন, অপটিক্যাল ফাইবার এবং লেন্সের জ্যামিতিক সমীকরণ ও ক্ষমতা বোর্ড পরীক্ষার সর্বোচ্চ অগ্রাধিকারসহ বিশদভাবে আলোচনা করা হয়েছে।',
  overviewEn:
    'When light obliquely travels from one transparent medium to another, it deviates at the interface—a phenomenon known as refraction. This chapter covers Snell’s law, refractive indices, critical angles, total internal reflection (TIR), optical fibers, and geometric lens equations with focal power calculation tailored for SSC board examinations.',
  keyTopicsBn: [
    'আলোর প্রতিসরণের সূত্র ও স্নেলের সূত্র ($n = \\sin i / \\sin r$)',
    'প্রতিসরাঙ্ক ও আলোর বেগ ($n = c_1 / c_2$)',
    'সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন (TIR)',
    'অপটিক্যাল ফাইবার ও মরিচীকার মেকানিজম',
    'লেন্সের সমীকরণ ($\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f}$)',
    'লেন্সের ক্ষমতা ($P = \\frac{1}{f}$ ডাইঅপ্টার)',
  ],
  keyTopicsEn: [
    'Laws of Refraction & Snell’s Law ($n = \\sin i / \\sin r$)',
    'Refractive Index & Light Speed ($n = c_1 / c_2$)',
    'Critical Angle & Total Internal Reflection (TIR)',
    'Optical Fiber & Mechanism of Mirage',
    'Lens Equation ($\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f}$)',
    'Power of Lens ($P = \\frac{1}{f}$ Dioptres)',
  ],
  status: 'available',

  // ----------------------------------------------------
  // STEP 1: Concept Tree
  // ----------------------------------------------------
  step1: {
    summaryBn:
      'আলোর প্রতিসরণ মূলত আলোর বেগ পরিবর্তনের ফল। হালকা মাধ্যম থেকে ঘন মাধ্যমে প্রবেশকালে আলো অভিলম্বের দিকে এবং ঘন থেকে হালকা মাধ্যমে যাওয়ার সময় অভিলম্ব থেকে দূরে বেঁকে যায়।',
    summaryEn:
      'Refraction arises fundamentally from differences in the speed of light across media. Light bends towards the normal when entering a denser medium and away from the normal when entering a rarer medium.',
    nodes: [
      {
        id: 'node-snell-law',
        titleBn: 'প্রতিসরণের ২য় সূত্র (স্নেলের সূত্র)',
        titleEn: 'Snell’s Law of Refraction',
        descriptionBn:
          'একজোড়া নির্দিষ্ট মাধ্যম এবং নির্দিষ্ট বর্ণের আলোর জন্য আপতন কোণের সাইন ও প্রতিসরণ কোণের সাইনের অনুপাত সর্বদা একটি ধ্রুবক সংখ্যা, যাকে ১ম মাধ্যমের সাপেক্ষে ২য় মাধ্যমের প্রতিসরাঙ্ক বলে: $\\frac{\\sin i}{\\sin r} = \\text{ধ্রুবক} = {^1\\eta_2}$।',
        descriptionEn:
          'For a specific pair of media and given wavelength, the ratio of sine of incidence to sine of refraction is constant: $\\frac{\\sin i}{\\sin r} = {^1\\eta_2}$.',
        iconName: 'Compass',
        realWorldExampleBn:
          'কাঁচের গ্লাসে রাখা পেন্সিল পানির স্তরে ভাঙা বা বাঁকা দেখায় কারণ আলো পানি থেকে বাতাসে আসার সময় বেঁকে যায়।',
        realWorldExampleEn:
          'A pencil placed in a glass tumbler of water appears bent at the liquid boundary due to refraction.',
        formulaLatex: '\\frac{\\sin i}{\\sin r} = \\frac{\\eta_2}{\\eta_1}',
      },
      {
        id: 'node-refractive-index',
        titleBn: 'প্রতিসরাঙ্ক ও আলোর বেগ',
        titleEn: 'Refractive Index & Velocity of Light',
        descriptionBn:
          'কোনো মাধ্যমের পরম প্রতিসরাঙ্ক শূন্য মাধ্যমে আলোর বেগ ($c$) এবং ওই মাধ্যমে আলোর বেগের ($v$) অনুপাতের সমান: $\\eta = \\frac{c}{v}$। বায়ুর পরম প্রতিসরাঙ্ক প্রায় ১.০০, পানির ১.৩৩, কাঁচের ১.৫২ এবং হীরকের ২.৪২।',
        descriptionEn:
          'The absolute refractive index of a medium equals the ratio of speed of light in vacuum ($c$) to its speed in the medium ($v$): $\\eta = \\frac{c}{v}$.',
        iconName: 'Zap',
        realWorldExampleBn:
          'হীরকের প্রতিসরাঙ্ক সর্বোচ্চ ($2.42$) হওয়ায় এর সংকট কোণ অত্যন্ত কম ($24.4^\\circ$), যার ফলে এর ভেতরে আলো বারবার প্রতিফলিত হয়ে তীব্র দ্যুতি ছড়ায়।',
        realWorldExampleEn:
          'Diamond has high refractive index ($2.42$) and low critical angle ($24.4^\\circ$), causing multiple internal reflections and dazzling brilliance.',
        formulaLatex: '\\eta = \\frac{c}{v} = \\frac{\\lambda_0}{\\lambda}',
      },
      {
        id: 'node-critical-angle-tir',
        titleBn: 'সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন',
        titleEn: 'Critical Angle & Total Internal Reflection',
        descriptionBn:
          'ঘন মাধ্যম থেকে আলো হালকা মাধ্যমে প্রবেশের সময় যে নির্দিষ্ট আপতন কোণের জন্য প্রতিসরণ কোণ $90^\\circ$ হয়, তাকে সংকট কোণ ($\\theta_c$) বলে। আপতন কোণ সংকট কোণের চেয়ে বড় হলে আলো প্রতিসরিত না হয়ে সম্পূর্ণরূপে ১ম মাধ্যমে প্রতিফলিত হয়ে ফিরে আসে।',
        descriptionEn:
          'When light travels from denser to rarer medium, the angle of incidence producing a $90^\\circ$ angle of refraction is the critical angle ($\\theta_c$). Exceeding $\\theta_c$ causes Total Internal Reflection.',
        iconName: 'Sparkles',
        realWorldExampleBn:
          'মরুভূমির মরিচীকা এবং এন্ডোস্কোপি ক্যামেরার ফাইবার অপটিক ক্যাবল পূর্ণ অভ্যন্তরীণ প্রতিফলনের মূলনীতিতে কাজ করে।',
        realWorldExampleEn:
          'Optical fiber telecommunications and endoscopic medical probes guide optical signals via continuous total internal reflection.',
        formulaLatex: '\\sin \\theta_c = \\frac{\\eta_2}{\\eta_1} \\quad (\\eta_1 > \\eta_2)',
      },
      {
        id: 'node-lens-optics',
        titleBn: 'উত্তল ও অবতল লেন্স',
        titleEn: 'Convex & Concave Lenses',
        descriptionBn:
          'উত্তল লেন্স সমান্তরাল আলোক রশ্মিগুচ্ছকে একটি বিন্দুতে মিলিত করে (অভিসারী), তাই এর ফোকাস দূরত্ব ধনাত্মক ($+f$)। অবতল লেন্স আলোক রশ্মিকে ছড়িয়ে দেয় (অপসারী), তাই এর ফোকাস দূরত্ব ঋণাত্মক ($-f$)।',
        descriptionEn:
          'Convex lenses converge parallel rays to a real focus ($+f$). Concave lenses diverge rays outward having a virtual focus ($-f$).',
        iconName: 'Glasses',
        realWorldExampleBn:
          'চোখের দূরদৃষ্টি (Hypermetropia) দূর করতে উত্তল লেন্স এবং ক্ষীণদৃষ্টি (Myopia) দূর করতে অবতল লেন্সের চশমা ব্যবহৃত হয়।',
        realWorldExampleEn:
          'Hypermetropia is corrected using convex lenses while Myopia uses concave corrective eyeglasses.',
        formulaLatex: '\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f}',
      },
      {
        id: 'node-lens-power',
        titleBn: 'লেন্সের ক্ষমতা ($P$)',
        titleEn: 'Optical Power of Lens ($P$)',
        descriptionBn:
          'ফোকাস দূরত্বের বিপরীত রাশিকে লেন্সের ক্ষমতা বলে, যখন ফোকাস দূরত্ব মিটারে পরিমাপ করা হয়। এর এসআই একক ডাইঅপ্টার ($\\text{Dioptre / D}$)। উত্তল লেন্সের ক্ষমতা ধনাত্মক এবং অবতল লেন্সের ক্ষমতা ঋণাত্মক।',
        descriptionEn:
          'Optical power is the reciprocal of focal length measured in meters ($P = 1/f$). Expressed in Dioptres (D). Positive for convex, negative for concave lenses.',
        iconName: 'Gauge',
        realWorldExampleBn:
          'কোনো প্রেসক্রিপশনে $+2.5\\text{ D}$ লিখা থাকলে বুঝতে হবে রোগী উত্তল লেন্স ব্যবহার করবেন যার ফোকাস দূরত্ব $f = 1/2.5 = 0.4\\text{ m} = 40\\text{ cm}$।',
        realWorldExampleEn:
          'A prescription of $+2.5\\text{ D}$ indicates a converging lens with focal length $f = 1/2.5 = 0.4\\text{ m} = 40\\text{ cm}$.',
        formulaLatex: 'P = \\frac{1}{f\\text{ (m)}} = \\frac{100}{f\\text{ (cm)}}',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 2: Interactive Sandbox Configuration
  // ----------------------------------------------------
  step2: {
    simulatorType: 'refraction',
    instructionsBn:
      '১ম ও ২য় মাধ্যমের প্রতিসরাঙ্ক নির্বাচন করো এবং আপতন কোণের স্লাইডার টেনে প্রতিসরণ কোণ ($r$), সংকট কোণ ($\\theta_c$) ও পূর্ণ অভ্যন্তরীণ প্রতিফলনের শর্ত প্রত্যক্ষ করো।',
    instructionsEn:
      'Select refractive indices for Medium 1 & Medium 2, adjust the angle of incidence ($i$), and observe Snell’s law deviation, critical angle ($\\theta_c$), and Total Internal Reflection.',
    controls: [
      {
        key: 'incidentAngle',
        labelBn: 'আপতন কোণ ($i$)',
        labelEn: 'Angle of Incidence ($i$)',
        defaultValue: 30,
        min: 0,
        max: 85,
        step: 1,
        unit: '°',
        descriptionBn: 'অভিলম্বের সাথে আপাতিত রশ্মির কোণ',
      },
      {
        key: 'n1',
        labelBn: '১ম মাধ্যমের প্রতিসরাঙ্ক ($n_1$)',
        labelEn: 'Medium 1 Refractive Index ($n_1$)',
        defaultValue: 1.0,
        min: 1.0,
        max: 2.42,
        step: 0.01,
        unit: '',
        descriptionBn: 'বায়ু = ১.০০, পানি = ১.৩৩, কাঁচ = ১.৫২, হীরক = ২.৪২',
      },
      {
        key: 'n2',
        labelBn: '২য় মাধ্যমের প্রতিসরাঙ্ক ($n_2$)',
        labelEn: 'Medium 2 Refractive Index ($n_2$)',
        defaultValue: 1.52,
        min: 1.0,
        max: 2.42,
        step: 0.01,
        unit: '',
        descriptionBn: 'আলোক রশ্মি যে মাধ্যমে প্রবেশ করছে',
      },
    ],
    keyObservationTipBn:
      'পূর্ণ অভ্যন্তরীণ প্রতিফলনের (TIR) জন্য দুটি শর্ত বাধ্যতামূলক: (১) আলোকে অবশ্যই ঘন মাধ্যম থেকে হালকা মাধ্যমে যেতে হবে ($n_1 > n_2$) এবং (২) আপতন কোণ সংকট কোণের চেয়ে বেশি হতে হবে ($i > \\theta_c$)। বাতাস থেকে কাঁচে প্রবেশের সময় কখনোই TIR হবে না!',
    keyObservationTipEn:
      'Two strict conditions govern Total Internal Reflection: (1) Light must originate in the denser medium ($n_1 > n_2$) and (2) Angle of incidence must exceed critical angle ($i > \\theta_c$). TIR is impossible when going from air to glass!',
  },

  // ----------------------------------------------------
  // STEP 3: Pattern & Formula Decoder
  // ----------------------------------------------------
  step3: {
    coreFormulaLatex:
      'n_1 \\sin i = n_2 \\sin r \\quad \\Longleftrightarrow \\quad P = \\frac{1}{f\\text{ (m)}}',
    variableDefinitions: [
      {
        symbol: 'i',
        nameBn: 'আপতন কোণ (Angle of Incidence)',
        nameEn: 'Angle of Incidence',
        siUnit: 'ডিগ্রী / রেডিয়ান (°, rad)',
      },
      {
        symbol: 'r',
        nameBn: 'প্রতিসরণ কোণ (Angle of Refraction)',
        nameEn: 'Angle of Refraction',
        siUnit: 'ডিগ্রী / রেডিয়ান (°, rad)',
      },
      {
        symbol: 'n_1, n_2',
        nameBn: '১ম ও ২য় মাধ্যমের পরম প্রতিসরাঙ্ক',
        nameEn: 'Absolute Refractive Indices',
        siUnit: 'এককহীন (Dimensionless)',
      },
      {
        symbol: '\\theta_c',
        nameBn: 'সংকট কোণ (Critical Angle)',
        nameEn: 'Critical Angle',
        siUnit: 'ডিগ্রী (°)',
      },
      {
        symbol: 'P',
        nameBn: 'লেন্সের ক্ষমতা (Optical Power)',
        nameEn: 'Power of Lens',
        siUnit: 'ডাইঅপ্টার ($\\text{Dioptre / D} = \\text{m}^{-1}$)',
      },
      {
        symbol: 'f',
        nameBn: 'ফোকাস দূরত্ব (Focal Length)',
        nameEn: 'Focal Length',
        siUnit: 'মিটার (m)',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'স্নেলের প্রতিসরণ সমীকরণ ও মাধ্যমের অনুপাত',
        labelEn: 'Snell’s Law Interface Formulation',
        latexExpression:
          '{^1\\eta_2} = \\frac{\\sin i}{\\sin r} = \\frac{\\eta_2}{\\eta_1} = \\frac{v_1}{v_2}',
        explanationBn:
          '১ম মাধ্যমের সাপেক্ষে ২য় মাধ্যমের প্রতিসরাঙ্ক হলো মাধ্যমদ্বয়ে আলোর বেগের অনুপাত।',
        explanationEn:
          'Relative refractive index corresponds directly to the inverse ratio of wave propagation speeds.',
      },
      {
        stepNumber: 2,
        labelBn: 'সংকট কোণ সমীকরণ নিষ্পত্তি',
        labelEn: 'Critical Angle Boundary Formulation',
        latexExpression:
          '\\sin \\theta_c = \\frac{\\eta_2}{\\eta_1} \\quad \\text{যখন } r = 90^\\circ \\text{ এবং } \\eta_1 > \\eta_2',
        explanationBn:
          'যখন প্রতিসরণ কোণ $r = 90^\\circ$ হয়ে প্রতিসরিত রশ্মি বিভেদতল ঘেঁষে যায়, তখন আপতন কোণই হলো সংকট কোণ $\\theta_c$।',
        explanationEn:
          'When the refraction angle reaches the boundary tangent $r = 90^\\circ$, incident angle defines critical threshold $\\theta_c$.',
      },
      {
        stepNumber: 3,
        labelBn: 'লেন্সের ক্ষমতা ও ফোকাস দূরত্বের একক রূপান্তর',
        labelEn: 'Lens Power Metric Unit Harmonization',
        latexExpression:
          'P = \\frac{1}{f\\text{ (m)}} = \\frac{100}{f\\text{ (cm)}} \\quad [\\text{Unit: D বা } \\text{m}^{-1}]',
        explanationBn:
          'ফোকাস দূরত্ব সেন্টিমিটারে থাকলে অবশ্যই ১০০ দিয়ে ভাগ করে মিটারে রূপান্তর করে তারপর বিপরীত মান নিতে হবে।',
        explanationEn:
          'Focal length given in centimeters must be converted to meters ($f/100$) before computing dioptre reciprocal.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'একজন ব্যক্তির ব্যবহৃত চশমার ফোকাস দূরত্ব $-25\\text{ cm}$। (ক) লেন্সটির ক্ষমতা কত এবং এটি কোন ধরনের লেন্স? (খ) কাঁচ থেকে বাতাসে আলোর সংকট কোণ কত হবে ($n_g = 1.50, n_a = 1.00$)?',
      problemEn:
        'A patient uses corrective eyeglasses with focal length $-25\\text{ cm}$. (a) Calculate optical power and identify lens type. (b) Find the critical angle for crown glass into air ($n_g = 1.50, n_a = 1.00$).',
      solutionStepsBn: [
        '১. লেন্সের ফোকাস দূরত্ব $f = -25\\text{ cm} = -0.25\\text{ m}$।',
        '২. ক্ষমতা $P = \\frac{1}{f} = \\frac{1}{-0.25} = -4.0\\text{ D}$। যেহেতু ক্ষমতা ও ফোকাস দূরত্ব ঋণাত্মক, এটি একটি অবতল লেন্স (ক্ষীণদৃষ্টি দূর করতে ব্যবহৃত)।',
        '৩. সংকট কোণের সূত্র: $\\sin \\theta_c = \\frac{n_a}{n_g} = \\frac{1.00}{1.50} = 0.6667$।',
        '৪. অতএব $\\theta_c = \\sin^{-1}(0.6667) \\approx 41.8^\\circ$।',
      ],
      solutionStepsEn: [
        '1. Convert focal length: $f = -25\\text{ cm} = -0.25\\text{ m}$.',
        '2. Compute power: $P = \\frac{1}{f} = \\frac{1}{-0.25\\text{ m}} = -4.0\\text{ D}$. Negative sign denotes a concave (diverging) lens.',
        '3. Critical angle formula: $\\sin \\theta_c = \\frac{n_a}{n_g} = \\frac{1.00}{1.50} = 0.6667$.',
        '4. Therefore $\\theta_c = \\sin^{-1}(0.6667) \\approx 41.8^\\circ$.',
      ],
      finalAnswerWithUnit: 'P = -4.0\\text{ D (অবতল লেন্স)}, \\quad \\theta_c = 41.8^\\circ',
    },
  },

  // ----------------------------------------------------
  // STEP 4: Board Traps (Examiner Mark Deductions)
  // ----------------------------------------------------
  step4: {
    traps: [
      {
        id: 'trap-1-lens-power-unit',
        titleBn: 'ফোকাস দূরত্ব সেন্টিমিটার থেকে মিটারে রূপান্তর না করে ক্ষমতা বের করা',
        titleEn: 'Omitting Meter Conversion When Calculating Lens Power',
        lostMarks: 1,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক)',
        commonMistakeBn:
          'উদ্দীপকে $f = +20\\text{ cm}$ দেওয়া থাকলে সরাসরি $P = \\frac{1}{20} = 0.05\\text{ D}$ লিখে ফেলে!',
        commonMistakeEn:
          'Directly plugging $P = 1/20 = 0.05\\text{ D}$ without converting $20\\text{ cm}$ into meters.',
        correctApproachBn:
          'ডাইঅপ্টারের সংজ্ঞাই হলো $\\text{m}^{-1}$। তাই $f = 20\\text{ cm} = 0.2\\text{ m} \\implies P = \\frac{1}{0.2} = +5\\text{ D}$।',
        correctApproachEn:
          'Dioptre is strictly meters$^{-1}$. $f = 20\\text{ cm} = 0.2\\text{ m} \\implies P = \\frac{1}{0.2} = +5\\text{ D}$.',
        examinerSecretTipBn:
          'বোর্ডের গ-অংশে এটি অন্যতম জনপ্রিয় ট্র্যাপ। শত শত পরীক্ষার্থী ০.০৫ ডাইঅপ্টার লিখে ১ নম্বর হারায়।',
        examinerSecretTipEn:
          'One of the most frequent examiner deduction points in board scripts. Keep $f$ in meters.',
      },
      {
        id: 'trap-2-tir-conditions-incomplete',
        titleBn: 'পূর্ণ অভ্যন্তরীণ প্রতিফলনের দুটি আবশ্যক শর্তের একটি বাদ দেওয়া',
        titleEn: 'Stating Only One Condition for Total Internal Reflection',
        lostMarks: 1,
        frequentlyTestedIn: 'খ-অংশ (অনুধাবনমূলক)',
        commonMistakeBn:
          'পরীক্ষার্থীরা শুধু লিখে দেয় "আপতন কোণ সংকট কোণের চেয়ে বড় হতে হবে", কিন্তু মাধ্যমদ্বয়ের ঘনত্বের শর্ত উল্লেখ করতে ভুলে যায়।',
        commonMistakeEn:
          'Writing only $i > \\theta_c$ while forgetting to mention the density boundary requirement.',
        correctApproachBn:
          'উত্তরে স্পষ্ট করে দুটি শর্তই লিখতে হবে: (১) আলোক রশ্মিকে অবশ্যই ঘন মাধ্যম থেকে হালকা মাধ্যমে যেতে হবে এবং (২) আপতন কোণ সংশ্লিষ্ট মাধ্যমদ্বয়ের সংকট কোণের চেয়ে বড় হতে হবে ($i > \\theta_c$)।',
        correctApproachEn:
          'Explicitly state both: (1) Light must originate in dense medium entering rarer medium, and (2) Angle of incidence must exceed critical angle ($i > \\theta_c$).',
        examinerSecretTipBn:
          'বোর্ড মার্কিং স্কিমে প্রতি শর্তের জন্য ১ নম্বর নির্ধারিত থাকে। একটি শর্ত মিস হলে পূর্ণ ২ নম্বরের মধ্যে মাত্র ১ নম্বর দেওয়া হয়।',
        examinerSecretTipEn:
          'Official board marking guidelines assign 1 mark per condition. Missing either cuts 50% score.',
      },
      {
        id: 'trap-3-critical-angle-ratio-inversion',
        titleBn: 'সংকট কোণের সূত্রে লব ও হরের স্থান উল্টে ফেলা',
        titleEn: 'Inverting Numerator and Denominator in Critical Angle Formula',
        lostMarks: 1,
        frequentlyTestedIn: 'গ ও ঘ-অংশ',
        commonMistakeBn:
          'সংকট কোণ বের করার সময় $\\sin \\theta_c = \\frac{n_1}{n_2} = \\frac{1.5}{1.0} = 1.5$ বের করে ক্যালকুলেটরে Math Error দেখে ঘাবড়ে যায়!',
        commonMistakeEn:
          'Writing $\\sin \\theta_c = 1.5 / 1.0 = 1.5$, which yields a mathematical error on calculator.',
        correctApproachBn:
          'সাইন অনুপাত কখনো ১ এর চেয়ে বড় হতে পারে না ($\\sin \\theta \\le 1$)। তাই সর্বদা ছোট প্রতিসরাঙ্ক উপরে এবং বড় প্রতিসরাঙ্ক নিচে থাকবে: $\\sin \\theta_c = \\frac{n_{\\text{লঘু}}}{n_{\\text{ঘন}}} = \\frac{1.0}{1.5}$।',
        correctApproachEn:
          'Sine values cannot exceed 1. Always place rarer medium index on top: $\\sin \\theta_c = n_{\\text{rarer}} / n_{\\text{denser}}$.',
        examinerSecretTipBn:
          'মনে রাখবে: "ছোট/বড়" — সবসময় লঘুতর মাধ্যম উপরে, বৃহত্তর মাধ্যম নিচে।',
        examinerSecretTipEn:
          'Mental heuristic: Rarer index in numerator, denser index in denominator.',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 5: Rapid Board Quiz
  // ----------------------------------------------------
  step5: {
    quizzes: [
      {
        id: 'q1-lens-power-calculation',
        questionBn:
          'একটি উত্তল লেন্সের ফোকাস দূরত্ব ৫০ সে.মি. ($50\\text{ cm}$)। লেন্সটির ক্ষমতা কত?',
        questionEn:
          'A convex lens has a focal length of $50\\text{ cm}$. What is its optical power?',
        questionType: 'MCQ',
        optionsBn: ['+2.0 D', '-2.0 D', '+0.02 D', '+0.5 D'],
        optionsEn: ['+2.0 D', '-2.0 D', '+0.02 D', '+0.5 D'],
        correctOptionIndex: 0,
        explanationBn:
          'উত্তল লেন্সের ফোকাস দূরত্ব ধনাত্মক: $f = +50\\text{ cm} = +0.5\\text{ m}$। ক্ষমতা $P = \\frac{1}{f} = \\frac{1}{0.5} = +2.0\\text{ D}$। সঠিক উত্তর ক (+2.0 D)।',
        explanationEn:
          'Convex lens has positive focus: $f = +0.5\\text{ m}$. Power $P = 1/0.5 = +2.0\\text{ D}$. Correct choice is A.',
        boardSource: 'ঢাকা বোর্ড ২০২৩ / রাজশাহী বোর্ড ২০২২',
      },
      {
        id: 'q2-critical-angle-glass',
        questionBn:
          'কাঁচের প্রতিসরাঙ্ক ১.৫২ এবং বায়ুর প্রতিসরাঙ্ক ১.০০ হলে কাঁচ-বায়ু বিভেদতলের সংকট কোণ কত?',
        questionEn:
          'If refractive index of glass is 1.52 and air is 1.00, what is the critical angle for glass-air interface?',
        questionType: 'MCQ',
        optionsBn: ['41.1°', '48.6°', '30.0°', '90.0°'],
        optionsEn: ['41.1°', '48.6°', '30.0°', '90.0°'],
        correctOptionIndex: 0,
        explanationBn:
          '$\\sin \\theta_c = \\frac{n_a}{n_g} = \\frac{1.00}{1.52} \\approx 0.6579 \\implies \\theta_c = \\sin^{-1}(0.6579) \\approx 41.14^\\circ$। সঠিক উত্তর ক।',
        explanationEn:
          '$\\sin \\theta_c = 1.00 / 1.52 = 0.6579 \\implies \\theta_c = \\sin^{-1}(0.6579) \\approx 41.1^\\circ$. Option A is correct.',
        boardSource: 'দিনাজপুর বোর্ড ২০২৩',
      },
      {
        id: 'q3-optical-fiber-phenomenon',
        questionBn:
          'টেলিযোগাযোগে ব্যবহৃত অপটিক্যাল ফাইবারে আলোর কোন মূলনীতিটি কার্যকর ভূমিকা পালন করে?',
        questionEn:
          'Which optical principle forms the functional basis of telecommunication optical fibers?',
        questionType: 'MCQ',
        optionsBn: [
          'পূর্ণ অভ্যন্তরীণ প্রতিফলন (Total Internal Reflection)',
          'আলোর অপবর্তন (Diffraction)',
          'আলোর ব্যতিচার (Interference)',
          'আলোর বিচ্ছুরণ (Dispersion)',
        ],
        optionsEn: [
          'Total Internal Reflection (TIR)',
          'Diffraction of Light',
          'Interference of Light',
          'Dispersion of Light',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'অপটিক্যাল ফাইবারের কোরের প্রতিসরাঙ্ক ক্ল্যাডিংয়ের চেয়ে বেশি হওয়ায় সংকেত আলোক রশ্মি বারবার পূর্ণ অভ্যন্তরীণ প্রতিফলিত হয়ে প্রায় কোনো শক্তি ক্ষয় ছাড়াই দূরবর্তী স্থানে পৌঁছায়।',
        explanationEn:
          'With core index higher than cladding, light signals propagate via repeated total internal reflections with negligible loss.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৪',
      },
      {
        id: 'q4-concave-lens-nature',
        questionBn:
          'কোনো অবতল লেন্সের ক্ষেত্রে গঠিত প্রতিবিম্বের প্রকৃতি সর্বদা কেমন হবে?',
        questionEn:
          'What is always the characteristic nature of an image formed by a concave lens?',
        questionType: 'MCQ',
        optionsBn: [
          'অবাস্তব, সোজা ও খর্বিত (Virtual, erect and diminished)',
          'বাস্তব, উল্টো ও বিবর্ধিত (Real, inverted and magnified)',
          'বাস্তব ও সমান আকারের (Real and equal size)',
          'অবাস্তব ও অত্যন্ত বিবর্ধিত (Virtual and highly magnified)',
        ],
        optionsEn: [
          'Virtual, erect and diminished',
          'Real, inverted and magnified',
          'Real and equal size',
          'Virtual and highly magnified',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'অবতল লেন্স সমান্তরাল ও অপসারী রশ্মি তৈরি করায় লক্ষ্যবস্তু যেখানেই স্থাপন করা হোক না কেন, এর প্রতিসৃত রশ্মি সর্বদা অবাস্তব, সোজা ও খর্বিত (আকারে ছোট) প্রতিবিম্ব গঠন করে।',
        explanationEn:
          'A concave lens always produces a virtual, erect, and diminished image regardless of object position.',
        boardSource: 'যশোর বোর্ড ২০২৩ / সিলেট বোর্ড ২০২৪',
      },
    ],
  },
};
