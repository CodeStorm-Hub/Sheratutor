import { PhysicsChapterFullData } from '../types';

export const CH10_STATIC_ELEC_DATA: PhysicsChapterFullData = {
  id: 'ssc-phy-ch10',
  chapterNo: 10,
  subjectCode: 'SSC-PHY',
  titleEn: 'Static Electricity',
  titleBn: 'স্থির তড়িৎ',
  division: 'electricity_magnetism',
  divisionTitleEn: 'Electricity & Magnetism',
  divisionTitleBn: 'তড়িৎ ও চৌম্বকবিজ্ঞান',
  iconName: 'Zap',
  estimatedMinutes: 45,
  boardMarksAllocation: 'CQ ১০ নম্বর (ক: ১, খ: ২, গ: ৩, ঘ: ৪) + MCQ ৩-৪ নম্বর',
  overviewBn:
    'ঘর্ষণ বা আবেশের মাধ্যমে কোনো বস্তুতে যে আধানের সৃষ্টি হয় এবং যা সঞ্চালিত না হয়ে একই স্থানে স্থির থাকে, তাকে স্থির তড়িৎ বলে। এই অধ্যায়ে কুলম্বের সূত্র, তড়িৎ ক্ষেত্র, তড়িৎ প্রাবল্য, তড়িৎ বিভব এবং ধারকত্বের গাণিতিক সমস্যা বোর্ড পরীক্ষার আলোকে পুঙ্খানুপুঙ্খভাবে সাজানো হয়েছে।',
  overviewEn:
    'Static electricity examines stationary electric charges produced by friction or electrostatic induction. This chapter provides exhaustive mastery over Coulomb’s inverse-square law, electric field intensity, scalar potential, electric field lines, and capacitance for SSC board examinations.',
  keyTopicsBn: [
    'আধান ও তড়িৎ আবেশের মূলনীতি',
    'কুলম্বের সূত্র ($F = k \\frac{q_1 q_2}{r^2}$)',
    'তড়িৎ প্রাবল্য ও নিরপেক্ষ বিন্দু ($E = k \\frac{q}{r^2}$)',
    'তড়িৎ বলরেখার বৈশিষ্ট্যসমূহ',
    'তড়িৎ বিভব ও কাজ ($V = k \\frac{q}{r}$, $W = qV$)',
    'ধারক ও ধারকত্ব ($C = \\frac{Q}{V}$)',
  ],
  keyTopicsEn: [
    'Electric Charge & Principles of Induction',
    'Coulomb’s Law ($F = k \\frac{q_1 q_2}{r^2}$)',
    'Field Intensity & Neutral Points ($E = k \\frac{q}{r^2}$)',
    'Properties of Electric Field Lines',
    'Electric Potential & Work ($V = k \\frac{q}{r}$, $W = qV$)',
    'Capacitors & Capacitance ($C = \\frac{Q}{V}$)',
  ],
  status: 'available',

  // ----------------------------------------------------
  // STEP 1: Concept Tree
  // ----------------------------------------------------
  step1: {
    summaryBn:
      'স্থির তড়িতের মূল চালিকাশক্তি হলো ধনাত্মক ও ঋণাত্মক চার্জ। সমধর্মী চার্জ পরস্পরকে বিকর্ষণ করে এবং বিপরীতধর্মী চার্জ পরস্পরকে আকর্ষণ করে। তড়িৎ বিভব একটি স্কেলার রাশি এবং তড়িৎ প্রাবল্য একটি ভেক্টর রাশি।',
    summaryEn:
      'Electrostatic interactions are governed by signed point charges. Like charges repel and opposite charges attract. Electric potential is a scalar superposition whereas electric field intensity is a vector field.',
    nodes: [
      {
        id: 'node-charge-induction',
        titleBn: 'আধান ও তড়িৎ আবেশ',
        titleEn: 'Electric Charge & Induction',
        descriptionBn:
          'পদার্থের মৌলিক কণিকাসমূহের (ইলেকট্রন ও প্রোটন) মৌলিক ও বৈশিষ্ট্যমূলক ধর্মকে আধান (Charge) বলে। কোনো চার্জিত বস্তুর উপস্থিতিতে স্পর্শ ছাড়াই একটি অনাহিত বস্তুতে ক্ষণস্থায়ী আধান সৃষ্টি করার পদ্ধতিকে তড়িৎ আবেশ বলে।',
        descriptionEn:
          'Electric charge is an intrinsic property of subatomic particles. Electrostatic induction produces temporary induced charge on a neutral conductor without physical contact.',
        iconName: 'Sparkles',
        realWorldExampleBn:
          'শুকনো চুলে প্লাস্টিকের চিরুনি দিয়ে আঁচড়ানোর পর তা কাগজের ছোট টুকরোকে আকর্ষণ করে।',
        realWorldExampleEn:
          'Combing dry hair charges a plastic comb via friction, enabling it to pick up neutral bits of paper by induction.',
        formulaLatex: 'q = ne \\quad (e = 1.6 \\times 10^{-19}\\text{ C})',
      },
      {
        id: 'node-coulomb-law',
        titleBn: 'কুলম্বের সূত্র ও বল',
        titleEn: 'Coulomb’s Law of Electrostatics',
        descriptionBn:
          'নির্দিষ্ট মাধ্যমে দুটি বিন্দু আধানের মধ্যকার আকর্ষণ বা বিকর্ষণ বল আধানদ্বয়ের পরিমাণের গুণফলের সমানুপাতিক, এদের মধ্যবর্তী দূরত্বের বর্গের ব্যস্তানুপাতিক এবং এ বল এদের সংযোগকারী সরলরেখা বরাবর ক্রিয়া করে: $F = k \\frac{q_1 q_2}{r^2}$। শূন্যস্থানে $k = 9 \\times 10^9\\text{ N}\\cdot\\text{m}^2\\text{C}^{-2}$।',
        descriptionEn:
          'The electrostatic force between two point charges is proportional to the product of charges and inversely proportional to the square of distance between them: $F = k \\frac{q_1 q_2}{r^2}$.',
        iconName: 'Zap',
        realWorldExampleBn:
          'পরমাণুর নিউক্লিয়াসের প্রোটন এবং কক্ষপথের ইলেকট্রনের মধ্যে কুলম্ব আকর্ষণ বলের কারণেই পরমাণু স্থায়ী গঠন বজায় রাখে।',
        realWorldExampleEn:
          'Coulomb attraction between positively charged atomic nuclei and negative orbital electrons binds atoms together.',
        formulaLatex: 'F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2} = k \\frac{q_1 q_2}{r^2}',
      },
      {
        id: 'node-electric-field',
        titleBn: 'তড়িৎ ক্ষেত্র ও তড়িৎ প্রাবল্য ($E$)',
        titleEn: 'Electric Field & Intensity ($E$)',
        descriptionBn:
          'একটি আধানের চারপাশে যে অঞ্চল জুড়ে তার আকর্ষণ বা বিকর্ষণ প্রভাব বজায় থাকে, তাকে তড়িৎ ক্ষেত্র বলে। তড়িৎ ক্ষেত্রের কোনো বিন্দুতে একটি একক ধনাত্মক আধান স্থাপন করলে সেটি যে বল অনুভব করে, তাকে ওই বিন্দুর তড়িৎ প্রাবল্য ($E$) বলে: $E = \\frac{F}{q_0} = k \\frac{q}{r^2}$। এর একক $\\text{N/C}$ বা $\\text{V/m}$।',
        descriptionEn:
          'Electric field intensity is the force experienced per unit positive test charge placed at that point ($E = F/q_0 = k q / r^2$). It is a vector pointing away from positive charges.',
        iconName: 'Compass',
        realWorldExampleBn:
          'বজ্রপাতের সময় মেঘ এবং ভূ-পৃষ্ঠের মধ্যকার উচ্চ তড়িৎ প্রাবল্য বায়ুর অন্তরক ধর্ম ভেঙে ফেলে তীব্র বিদ্যুৎ প্রবাহ সৃষ্টি করে।',
        realWorldExampleEn:
          'During thunderstorms, intense electric fields between thunderclouds and the earth ionize atmospheric air.',
        formulaLatex: 'E = \\frac{F}{q_0} = k \\frac{q}{r^2} \\quad [\\text{Unit: N/C বা V/m}]',
      },
      {
        id: 'node-electric-potential',
        titleBn: 'তড়িৎ বিভব ($V$)',
        titleEn: 'Electric Potential ($V$)',
        descriptionBn:
          'অসীম দূরত্ব থেকে প্রতি একক ধনাত্মক আধানকে তড়িৎ ক্ষেত্রের কোনো বিন্দুতে আনতে যে পরিমাণ কাজ সম্পন্ন হয়, তাকে ওই বিন্দুর তড়িৎ বিভব বলে: $V = \\frac{W}{q_0} = k \\frac{q}{r}$। বিভব একটি স্কেলার রাশি। ধনাত্মক চার্জের জন্য বিভব ধনাত্মক এবং ঋণাত্মক চার্জের জন্য ঋণাত্মক।',
        descriptionEn:
          'Electric potential is the work done in bringing a unit positive charge from infinity to a point in the field ($V = W/q_0 = k q / r$). It is a scalar quantity measured in Volts (J/C).',
        iconName: 'Gauge',
        realWorldExampleBn:
          'উঁচু স্থান থেকে যেমন পানি নিচে গড়ায়, তেমনি তড়িৎ প্রবাহ সর্বদা উচ্চ বিভব থেকে নিম্ন বিভবের দিকে প্রবাহিত হয়।',
        realWorldExampleEn:
          'Positive charges naturally move from high potential regions toward lower potential regions.',
        formulaLatex: 'V = \\frac{W}{q} = k \\frac{q}{r} \\quad [\\text{Unit: Volt (V) = J/C}]',
      },
      {
        id: 'node-capacitor-capacitance',
        titleBn: 'ধারক ও ধারকত্ব ($C$)',
        titleEn: 'Capacitor & Capacitance ($C$)',
        descriptionBn:
          'খুব কাছাকাছি স্থাপিত দুটি পরিবাহীর মধ্যবর্তী স্থানে অন্তরক পদার্থ রেখে তড়িৎ আধান ও শক্তি সঞ্চয় করে রাখার যান্ত্রিক ব্যবস্থাকে ধারক বলে। ধারকের বিভব ১ ভোল্ট বৃদ্ধি করতে যে আধানের প্রয়োজন হয়, তাকে এর ধারকত্ব বলে: $C = \\frac{Q}{V}$। এর একক ফ্যারাড (Farad / F)।',
        descriptionEn:
          'A capacitor stores electrostatic charge and energy via two conducting plates separated by an insulator dielectric. Capacitance $C = Q/V$, measured in Farads (F).',
        iconName: 'Layers',
        realWorldExampleBn:
          'ক্যামেরার ফ্ল্যাশ লাইট এবং সিলিং ফ্যানের মোটরে দ্রুত গতি সঞ্চার করতে ক্যাপাসিটর বা ধারক ব্যবহৃত হয়।',
        realWorldExampleEn:
          'Camera flash units and ceiling fan motors employ capacitors to discharge sudden bursts of stored electrical energy.',
        formulaLatex: 'C = \\frac{Q}{V} \\quad [\\text{Unit: Farad (F)}]',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 2: Interactive Sandbox Configuration
  // ----------------------------------------------------
  step2: {
    simulatorType: 'static_elec',
    instructionsBn:
      '১ম ও ২য় আধানের মান এবং এদের মধ্যবর্তী দূরত্ব পরিবর্তন করে কুলম্বের আকর্ষণ-বিকর্ষণ বল, তড়িৎ প্রাবল্য ($E$) ও বিভব ($V$) পর্যবেক্ষণ করো।',
    instructionsEn:
      'Adjust charge magnitudes $q_1, q_2$ and separation distance $r$ to explore Coulomb interaction, vector field intensity ($E$), and scalar potential ($V$).',
    controls: [
      {
        key: 'q1',
        labelBn: '১ম আধান ($q_1$)',
        labelEn: 'Charge 1 ($q_1$)',
        defaultValue: 4,
        min: -10,
        max: 10,
        step: 1,
        unit: 'μC',
        descriptionBn: '১ম বিন্দু আধানের মান ও চিহ্ন',
      },
      {
        key: 'q2',
        labelBn: '২য় আধান ($q_2$)',
        labelEn: 'Charge 2 ($q_2$)',
        defaultValue: -3,
        min: -10,
        max: 10,
        step: 1,
        unit: 'μC',
        descriptionBn: '২য় বিন্দু আধানের মান ও চিহ্ন',
      },
      {
        key: 'distanceM',
        labelBn: 'মধ্যবর্তী দূরত্ব ($r$)',
        labelEn: 'Separation Distance ($r$)',
        defaultValue: 0.2,
        min: 0.05,
        max: 1.0,
        step: 0.01,
        unit: 'm',
        descriptionBn: 'আধানদ্বয়ের মধ্যবর্তী সরলরৈখিক দূরত্ব',
      },
    ],
    keyObservationTipBn:
      'তড়িৎ প্রাবল্য ($E$) একটি ভেক্টর রাশি— এর দিক সর্বদা ধনাত্মক আধান থেকে বাইরের দিকে এবং ঋণাত্মক আধানের দিকে। কিন্তু তড়িৎ বিভব ($V$) স্কেলার রাশি— এতে সরাসরি চার্জের ধনাত্মক বা ঋণাত্মক চিহ্ন বসিয়ে সাধারণ বীজগাণিতিক যোগ ($V_{\\text{net}} = V_1 + V_2$) করতে হয়!',
    keyObservationTipEn:
      'Electric field ($E$) is a directional vector. Potential ($V$) is a signed scalar quantity: calculate via pure algebraic addition ($V_{\\text{net}} = V_1 + V_2$) maintaining positive/negative signs.',
  },

  // ----------------------------------------------------
  // STEP 3: Pattern & Formula Decoder
  // ----------------------------------------------------
  step3: {
    coreFormulaLatex:
      'F = k \\frac{q_1 q_2}{r^2} \\quad \\Longleftrightarrow \\quad E = k \\frac{q}{r^2} \\quad \\Longleftrightarrow \\quad V = k \\frac{q}{r}',
    variableDefinitions: [
      {
        symbol: 'F',
        nameBn: 'কুলম্ব বল (Electrostatic Force)',
        nameEn: 'Electrostatic Force',
        siUnit: 'নিউটন (N)',
      },
      {
        symbol: 'q_1, q_2',
        nameBn: 'বিন্দু আধানের পরিমাণ',
        nameEn: 'Point Charges',
        siUnit: 'কুলম্ব (C)',
      },
      {
        symbol: 'r',
        nameBn: 'আধানদ্বয়ের মধ্যবর্তী দূরত্ব',
        nameEn: 'Separation Distance',
        siUnit: 'মিটার (m)',
      },
      {
        symbol: 'k',
        nameBn: 'কুলম্বের ধ্রুবক ($1 / 4\\pi\\varepsilon_0$)',
        nameEn: 'Coulomb’s Constant',
        siUnit: '$\\text{N}\\cdot\\text{m}^2/\\text{C}^2$',
      },
      {
        symbol: 'E',
        nameBn: 'তড়িৎ ক্ষেত্রের প্রাবল্য',
        nameEn: 'Electric Field Intensity',
        siUnit: '$\\text{N/C}$ বা $\\text{V/m}$',
      },
      {
        symbol: 'V',
        nameBn: 'তড়িৎ বিভব (Electric Potential)',
        nameEn: 'Electric Potential',
        siUnit: 'ভোল্ট ($\\text{Volt / V} = \\text{J/C}$)',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'কুলম্বের সূত্রের গাণিতিক রূপ ও ধ্রুবক',
        labelEn: 'Coulomb Inverse Square Law Formulation',
        latexExpression:
          'F \\propto \\frac{q_1 q_2}{r^2} \\implies F = k \\frac{q_1 q_2}{r^2} \\quad [k = 9 \\times 10^9 \\text{ N}\\cdot\\text{m}^2\\text{C}^{-2}]',
        explanationBn:
          'শূন্যস্থান বা বায়ু মাধ্যমে ধ্রুবক $k = \\frac{1}{4\\pi\\varepsilon_0} = 9 \\times 10^9$। সমধর্মী আধান হলে বল বিকর্ষণধর্মী (+F) এবং বিপরীতধর্মী হলে আকর্ষণধর্মী (-F)।',
        explanationEn:
          'Coulomb constant $k = 9 \\times 10^9 \\text{ N}\\cdot\\text{m}^2\\text{C}^{-2}$ in air. Like charges repel; unlike charges attract.',
      },
      {
        stepNumber: 2,
        labelBn: 'প্রাবল্য ও বিভবের মধ্যকার সম্পর্ক',
        labelEn: 'Relation Between Field Intensity and Potential Gradient',
        latexExpression:
          'E = -\\frac{\\Delta V}{\\Delta r} \\implies V = E \\times r \\quad [\\text{সুষম তড়িৎ ক্ষেত্রের জন্য}]',
        explanationBn:
          'তড়িৎ প্রাবল্য হলো দূরত্বের সাথে বিভব পরিবর্তনের হারের সমান। তাই প্রাবল্যের একক $\\text{N/C}$ এর পাশাপাশি $\\text{V/m}$ হিসেবেও লেখা যায়।',
        explanationEn:
          'Electric field represents the negative spatial gradient of potential ($E = -dV/dr$). Hence units $\\text{N/C} \\equiv \\text{V/m}$.',
      },
      {
        stepNumber: 3,
        labelBn: 'সংযোজক রেখার মধ্যবিন্দুতে লব্ধি বিভব',
        labelEn: 'Superposition of Electric Potential at Midpoint',
        latexExpression:
          'V_{\\text{mid}} = V_1 + V_2 = k \\frac{q_1}{r/2} + k \\frac{q_2}{r/2} = \\frac{2k}{r} (q_1 + q_2)',
        explanationBn:
          'যেহেতু বিভব একটি স্কেলার রাশি, তাই মধ্যবিন্দুতে মোট বিভব বের করতে আধানদ্বয়ের নিজস্ব চিহ্নসহ সরাসরি যোগ করতে হয়।',
        explanationEn:
          'Potential is a scalar: evaluate total potential at midpoint via direct algebraic addition using signed charge values.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'বায়ুতে পরস্পর থেকে $20\\text{ cm}$ দূরে দুটি বিন্দু আধান $+4\\ \\mu\\text{C}$ এবং $-3\\ \\mu\\text{C}$ রাখা আছে। (ক) এদের মধ্যবর্তী পারস্পরিক বল কত এবং এর প্রকৃতি কী? (খ) এদের সংযোজক রেখার মধ্যবিন্দুতে তড়িৎ বিভব কত হবে?',
      problemEn:
        'Two point charges $+4\\ \\mu\\text{C}$ and $-3\\ \\mu\\text{C}$ are placed $20\\text{ cm}$ apart in air. (a) Find the electrostatic force and its nature. (b) Calculate the electric potential at the midpoint of their connecting line.',
      solutionStepsBn: [
        '১. প্রদত্ত তথ্য: $q_1 = +4\\ \\mu\\text{C} = 4 \\times 10^{-6}\\text{ C}$, $q_2 = -3\\ \\mu\\text{C} = -3 \\times 10^{-6}\\text{ C}$, $r = 20\\text{ cm} = 0.2\\text{ m}$, $k = 9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$।',
        '২. পারস্পরিক বল: $F = k \\frac{|q_1 q_2|}{r^2} = \\frac{(9 \\times 10^9) \\times (4 \\times 10^{-6}) \\times (3 \\times 10^{-6})}{(0.2)^2} = \\frac{0.108}{0.04} = 2.7\\text{ N}$। যেহেতু আধান দুটি বিপরীতধর্মী, তাই বলটি আকর্ষণ বল।',
        '৩. মধ্যবিন্দুর দূরত্ব: $r_1 = r_2 = \\frac{0.2}{2} = 0.1\\text{ m}$।',
        '৪. মধ্যবিন্দুতে বিভব: $V = k \\frac{q_1}{r_1} + k \\frac{q_2}{r_2} = \\frac{k}{0.1} (q_1 + q_2) = \\frac{9 \\times 10^9}{0.1} \\times (4 - 3) \\times 10^{-6} = (9 \\times 10^{10}) \\times (10^{-6}) = 90,000\\text{ V} = +90\\text{ kV}$।',
      ],
      solutionStepsEn: [
        '1. Given: $q_1 = +4 \\times 10^{-6}\\text{ C}$, $q_2 = -3 \\times 10^{-6}\\text{ C}$, $r = 0.2\\text{ m}$, $k = 9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$.',
        '2. Force: $F = \\frac{(9 \\times 10^9)(4 \\times 10^{-6})(3 \\times 10^{-6})}{(0.2)^2} = 2.7\\text{ N}$. Since charges are opposite, force is attractive.',
        '3. Distance to midpoint: $r_1 = r_2 = 0.1\\text{ m}$.',
        '4. Midpoint potential: $V = \\frac{k}{0.1}(q_1 + q_2) = \\frac{9 \\times 10^9}{0.1} \\times (4 - 3) \\times 10^{-6} = +90,000\\text{ V} = +90\\text{ kV}$.',
      ],
      finalAnswerWithUnit: 'F = 2.7\\text{ N (আকর্ষণধর্মী)}, \\quad V_{\\text{mid}} = +90\\text{ kV}',
    },
  },

  // ----------------------------------------------------
  // STEP 4: Board Traps (Examiner Mark Deductions)
  // ----------------------------------------------------
  step4: {
    traps: [
      {
        id: 'trap-1-microcoulomb-conversion',
        titleBn: 'মাইক্রোকুলম্ব (μC) কে কুলম্বে (C) রূপান্তর না করে সূত্রে বসানো',
        titleEn: 'Omitting μC to Coulomb Conversion in Formula Substitution',
        lostMarks: 1,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক)',
        commonMistakeBn:
          'উদ্দীপকে $q_1 = 5\\ \\mu\\text{C}$ দেওয়া থাকলে ছাত্রছাত্রীরা সরাসরি $q_1 = 5$ বসিয়ে $F = 9 \\times 10^9 \\times 5 \\times \\dots$ গুণ করে ফেলে!',
        commonMistakeEn:
          'Plugging $q = 5$ directly without converting $5\\ \\mu\\text{C} = 5 \\times 10^{-6}\\text{ C}$.',
        correctApproachBn:
          'অংকের শুরুতে স্পষ্ট করে এসআই এককে নাও: $1\\ \\mu\\text{C} = 10^{-6}\\text{ C}$ এবং $1\\text{ nC} = 10^{-9}\\text{ C}$।',
        correctApproachEn:
          'Always standardize to SI units: $1\\ \\mu\\text{C} = 10^{-6}\\text{ C}$ and $1\\text{ nC} = 10^{-9}\\text{ C}$.',
        examinerSecretTipBn:
          'বোর্ডের গ-অংশে এই ভুলের কারণে গুণফল $10^{12}$ গুণ বড় হয়ে যায় এবং পরীক্ষক সঙ্গে সঙ্গে ১ নম্বর কেটে নেন।',
        examinerSecretTipEn:
          'This blunder skews calculations by a factor of $10^{12}$, prompting automatic mark deduction.',
      },
      {
        id: 'trap-2-potential-sign-omission',
        titleBn: 'তড়িৎ বিভব বের করার সময় ঋণাত্মক চিহ্ন বাদ দেওয়া',
        titleEn: 'Neglecting Signed Polarity in Electric Potential Calculations',
        lostMarks: 1,
        frequentlyTestedIn: 'গ ও ঘ-অংশ',
        commonMistakeBn:
          'বিভব বের করার সময় ঋণাত্মক চার্জ $-3\\ \\mu\\text{C}$ এর পরম মান $+3$ বসিয়ে যোগ করে ফেলা।',
        commonMistakeEn:
          'Using absolute magnitude $+3$ instead of signed value $-3\\ \\mu\\text{C}$ in scalar potential sum.',
        correctApproachBn:
          'তড়িৎ বিভব স্কেলার রাশি। এতে ঋণাত্মক চার্জ ঋণাত্মক বিভব তৈরি করে। তাই $V = V_1 + V_2 = k \\frac{q_1}{r_1} + k \\frac{(-q_2)}{r_2}$।',
        correctApproachEn:
          'Electric potential is a signed scalar: negative charges produce negative potentials ($V = V_1 + V_2$).',
        examinerSecretTipBn:
          'মনে রাখবে: প্রাবল্য ($E$) ভেক্টর— তাই চিহ্নের বদলে দিক দেখবে। বিভব ($V$) স্কেলার— তাই চিহ্নের সরাসরি হিসাব হবে।',
        examinerSecretTipEn:
          'Rule of thumb: Field $E$ uses vector directions; Potential $V$ strictly preserves sign algebra.',
      },
      {
        id: 'trap-3-neutral-point-opposite-charges',
        titleBn: 'বিপরীতধর্মী আধানের ক্ষেত্রে মধ্যবর্তী স্থানে নিরপেক্ষ বিন্দু খোঁজা',
        titleEn: 'Searching for Neutral Point Between Opposite Polarity Charges',
        lostMarks: 2,
        frequentlyTestedIn: 'ঘ-অংশ (উচ্চতর দক্ষতা)',
        commonMistakeBn:
          'উদ্দীপকে একটি $+20\\ \\mu\\text{C}$ ও একটি $-5\\ \\mu\\text{C}$ আধান দেওয়া থাকলে ছাত্রছাত্রীরা ধরে নেয় নিরপেক্ষ বিন্দু এদের মাঝখানে অবস্থিত ($0 < x < r$)।',
        commonMistakeEn:
          'Assuming null point ($E_{\\text{net}} = 0$) lies between two opposite charges.',
        correctApproachBn:
          'বিপরীতধর্মী আধানের ক্ষেত্রে মাঝের যেকোনো বিন্দুতে উভয় আধানের প্রাবল্যের দিক একই দিকে থাকে ($E_{\\text{net}} = E_1 + E_2 \\neq 0$)। তাই নিরপেক্ষ বিন্দু সর্বদা সংযোগকারী সরলরেখায় "ক্ষুদ্রতর আধানের বাইরের দিকে" অবস্থিত হবে।',
        correctApproachEn:
          'For opposite charges, fields add up in between. The neutral point ($E=0$) strictly lies outside, adjacent to the smaller magnitude charge.',
        examinerSecretTipBn:
          'বোর্ডের ঘ-অংশে এটি অত্যন্ত কমন ৪ নম্বরের প্রশ্ন। চিত্র এঁকে ভেতরের বদলে বাইরের অবস্থান প্রমাণ করতে হয়।',
        examinerSecretTipEn:
          'A flagship 4-mark CQ trap. Proving external location with direction vectors earns full credit.',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 5: Rapid Board Quiz
  // ----------------------------------------------------
  step5: {
    quizzes: [
      {
        id: 'q1-coulomb-distance-halving',
        questionBn:
          'দুটি নির্দিষ্ট বিন্দু আধানের মধ্যবর্তী দূরত্ব অর্ধেক ($r/2$) করা হলে এদের মধ্যবর্তী তড়িৎ বলের কী পরিবর্তন ঘটবে?',
        questionEn:
          'If the distance between two fixed point charges is halved ($r/2$), what happens to the electrostatic force?',
        questionType: 'MCQ',
        optionsBn: ['বল ৪ গুণ হবে', 'বল দ্বিগুণ হবে', 'বল অর্ধেক হবে', 'বল অপরিবর্তিত থাকবে'],
        optionsEn: ['Force quadruples (4F)', 'Force doubles (2F)', 'Force halves (F/2)', 'Force unchanged'],
        correctOptionIndex: 0,
        explanationBn:
          'কুলম্বের সূত্রানুযায়ী $F \\propto \\frac{1}{r^2}$। দূরত্ব অর্ধেক ($r\' = r/2$) হলে $F\' = \\frac{k q_1 q_2}{(r/2)^2} = 4 \\times \\frac{k q_1 q_2}{r^2} = 4F$। সঠিক উত্তর ক (৪ গুণ)।',
        explanationEn:
          'By inverse square law, $F \\propto 1/r^2$. When $r\' = r/2$, $F\' = 4F$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৪ / রাজশাহী বোর্ড ২০২৩',
      },
      {
        id: 'q2-electric-field-unit',
        questionBn: 'নিচের কোনটি তড়িৎ ক্ষেত্রের প্রাবল্যের (Electric Field Intensity) সঠিক এসআই একক?',
        questionEn: 'Which of the following is the correct SI unit of Electric Field Intensity?',
        questionType: 'MCQ',
        optionsBn: ['N/C বা V/m', 'J/C বা Volt', 'N·m বা Joule', 'C/m²'],
        optionsEn: ['N/C or V/m', 'J/C or Volt', 'N·m or Joule', 'C/m²'],
        correctOptionIndex: 0,
        explanationBn:
          'তড়িৎ প্রাবল্য $E = \\frac{F}{q} \\implies \\text{N/C}$। আবার বিভব নতিমাত্রা থেকে $E = \\frac{V}{d} \\implies \\text{V/m}$। সুতরাং সঠিক উত্তর ক।',
        explanationEn:
          '$E = F/q$ yields N/C; potential gradient $E = V/d$ yields V/m. Both are equivalent SI units.',
        boardSource: 'দিনাজপুর বোর্ড ২০২৪',
      },
      {
        id: 'q3-potential-work-calc',
        questionBn:
          'কোনো তড়িৎ ক্ষেত্রের দুটি বিন্দুর বিভব পার্থক্য ২০ ভোল্ট ($20\\text{ V}$)। এক বিন্দু থেকে অন্য বিন্দুতে ৫ কুলম্ব ($5\\text{ C}$) চার্জ স্থানান্তরে কত জুল কাজ সম্পন্ন হবে?',
        questionEn:
          'The potential difference between two points in an electric field is $20\\text{ V}$. How much work in Joules is required to move a $5\\text{ C}$ charge between them?',
        questionType: 'MCQ',
        optionsBn: ['100 J', '4 J', '0.25 J', '25 J'],
        optionsEn: ['100 J', '4 J', '0.25 J', '25 J'],
        correctOptionIndex: 0,
        explanationBn:
          'কাজের সূত্র: $W = q \\times V = 5\\text{ C} \\times 20\\text{ V} = 100\\text{ J}$। সঠিক উত্তর ক (100 J)।',
        explanationEn:
          'Work done $W = q \\times V = 5\\text{ C} \\times 20\\text{ V} = 100\\text{ J}$. Option A is correct.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৩',
      },
      {
        id: 'q4-field-lines-property',
        questionBn: 'তড়িৎ বলরেখার বৈশিষ্ট্য সম্পর্কে নিচের কোন তথ্যটি সঠিক?',
        questionEn: 'Which statement regarding electric field lines is correct?',
        questionType: 'MCQ',
        optionsBn: [
          'দুটি বলরেখা কখনোই পরস্পরকে ছেদ করে না',
          'বলরেখা সর্বদা ঋণাত্মক আধান থেকে নির্গত হয়ে ধনাত্মকে প্রবেশ করে',
          'বলরেখা পরিবাহীর ভেতরের স্থান দিয়ে চলাচল করে',
          'বলরেখাগুলো সর্বদা বন্ধ লুপ (Closed Loop) গঠন করে',
        ],
        optionsEn: [
          'Two field lines never intersect each other',
          'Field lines always emerge from negative and enter positive',
          'Field lines propagate through the interior of conductors',
          'Field lines always form closed continuous loops',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'যদি দুটি বলরেখা পরস্পরকে ছেদ করতো, তবে ছেদবিন্দুতে একই সাথে দুটি স্পর্শক বা প্রাবল্যের দুটি ভিন্ন দিক নির্দেশিত হতো— যা বাস্তবে অসম্ভব। তাই বলরেখা কখনো পরস্পরকে ছেদ করে না।',
        explanationEn:
          'Intersection would imply two conflicting electric field directions at a single point, which is physically impossible.',
        boardSource: 'বরিশাল বোর্ড ২০২৪',
      },
    ],
  },
};
