import { PhysicsChapterFullData } from '../types';

export const CH12_MAGNETISM_DATA: PhysicsChapterFullData = {
  id: 'ssc-phy-ch12',
  chapterNo: 12,
  subjectCode: 'SSC-PHY',
  titleEn: 'Magnetic Effect of Current',
  titleBn: 'বিদ্যুতের চৌম্বক ক্রিয়া',
  division: 'electricity_magnetism',
  divisionTitleEn: 'Electricity & Magnetism',
  divisionTitleBn: 'তড়িৎ ও চৌম্বকবিজ্ঞান',
  iconName: 'Magnet',
  estimatedMinutes: 45,
  boardMarksAllocation: 'CQ ১০ নম্বর (ক: ১, খ: ২, গ: ৩, ঘ: ৪) + MCQ ৩-৪ নম্বর',
  overviewBn:
    'বিদ্যুৎ প্রবাহের ফলে তারের চারপাশে একটি অদৃশ্য চৌম্বক ক্ষেত্র তৈরি হয়— এই আবিষ্কারের মাধ্যমেই আধুনিক মোটর, জেনারেটর ও ট্রান্সফরমার উদ্ভাবিত হয়েছে। এই অধ্যায়ে অরস্টেডের পরীক্ষা, সোলেনয়েড, তড়িৎচুম্বকীয় আবেশ, ফ্যারাডের সূত্র, লেঞ্জের সূত্র এবং আরোহী ও অবরোহী ট্রান্সফরমারের গাণিতিক সমীকরণ বোর্ড পরীক্ষার নিখুঁত মানদণ্ডে সাজানো হয়েছে।',
  overviewEn:
    'Electric currents generate surrounding magnetic fields, bridging electrical and mechanical engineering. This chapter rigorously explores Oersted’s experiment, solenoids, electromagnetic induction, Faraday and Lenz laws, and step-up/step-down transformer networks designed for SSC board exam mastery.',
  keyTopicsBn: [
    'অরস্টেডের পরীক্ষা ও ডানহাত মুষ্টি নিয়ম',
    'সোলেনয়েড ও তড়িৎচুম্বক ($B \\propto N \\cdot I$)',
    'তড়িৎচুম্বকীয় আবেশ ও ফ্যারাডের সূত্র',
    'লেঞ্জের সূত্র ও শক্তির নিত্যতা',
    'বৈদ্যুতিক মোটর বনাম জেনারেটর (ডায়নামো)',
    'ট্রান্সফরমারের রূপান্তর অনুপাত ($\\frac{V_p}{V_s} = \\frac{N_p}{N_s} = \\frac{I_s}{I_p}$)',
  ],
  keyTopicsEn: [
    'Oersted’s Experiment & Right-Hand Grip Rule',
    'Solenoids & Electromagnets ($B \\propto N \\cdot I$)',
    'Electromagnetic Induction & Faraday’s Laws',
    'Lenz’s Law & Conservation of Energy',
    'Electric Motors vs Dynamos/Generators',
    'Transformer Ratios ($\\frac{V_p}{V_s} = \\frac{N_p}{N_s} = \\frac{I_s}{I_p}$)',
  ],
  status: 'available',

  // ----------------------------------------------------
  // STEP 1: Concept Tree
  // ----------------------------------------------------
  step1: {
    summaryBn:
      'তড়িৎ প্রবাহের চৌম্বক ক্রিয়ার মাধ্যমে যান্ত্রিক শক্তিকে তড়িৎ শক্তিতে (জেনারেটর) এবং তড়িৎ শক্তিকে যান্ত্রিক শক্তিতে (মোটর) রূপান্তর করা সম্ভব। আর দূরবর্তী বিদ্যুৎ সঞ্চালনে ভোল্টেজ বাড়ানো বা কমানোর জন্য ট্রান্সফরমার অপরিহার্য।',
    summaryEn:
      'Electromagnetism enables bidirectional energy conversion: mechanical into electrical (generators) and electrical into mechanical (motors). Transformers scale transmission voltage to minimize Joule losses.',
    nodes: [
      {
        id: 'node-oersted-solenoid',
        titleBn: 'অরস্টেডের আবিষ্কার ও সোলেনয়েড',
        titleEn: 'Oersted’s Discovery & Solenoid',
        descriptionBn:
          '১৮২০ সালে বিজ্ঞানী হ্যান্স ক্রিশ্চিয়ান অরস্টেড আবিষ্কার করেন পরিবাহী তারের মধ্য দিয়ে তড়িৎ প্রবাহিত হলে এর পাশে রাখা চৌম্বক শলাকা বিক্ষিপ্ত হয়। একটি অন্তরক নলের উপর তার পেঁচিয়ে কুণ্ডলী তৈরি করলে তাকে সোলেনয়েড বলে। সোলেনয়েডের ভেতরে কাঁচা লোহার মজ্জা রাখলে শক্তিশালী তড়িৎচুম্বক তৈরি হয়।',
        descriptionEn:
          'Hans Christian Oersted demonstrated that electric current deflects magnetic compass needles. A tightly wound helical wire coil forms a solenoid, behaving as a powerful bar magnet when energized.',
        iconName: 'Compass',
        realWorldExampleBn:
          'ক্রেনের মাথায় লাগানো শক্তিশালী তড়িৎচুম্বক দিয়ে ভারী লোহা ও ধাতব বর্জ্য সহজে উঠিয়ে এক স্থান থেকে অন্য স্থানে সরানো হয়।',
        realWorldExampleEn:
          'Industrial scrapyard cranes use powerful electromagnets to lift and sort scrap metal with simple switch triggers.',
        formulaLatex: 'B = \\mu_0 \\mu_r \\frac{N}{L} I',
      },
      {
        id: 'node-faraday-induction',
        titleBn: 'তড়িৎচুম্বকীয় আবেশ ও ফ্যারাডের সূত্র',
        titleEn: 'Electromagnetic Induction & Faraday’s Law',
        descriptionBn:
          'একটি গতিশীল চুম্বক বা পরিবর্তনশীল চৌম্বক ক্ষেত্রের প্রভাবে একটি বদ্ধ কুণ্ডলীতে ক্ষণস্থায়ী তড়িচ্চালক শক্তি ও বিদ্যুৎ প্রবাহ সৃষ্টি হওয়ার ঘটনাকে তড়িৎচুম্বকীয় আবেশ বলে। আবিষ্ট তড়িচ্চালক শক্তি কুণ্ডলীর চৌম্বক ফ্লাক্সের পরিবর্তনের হারের সমানুপাতিক: $\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}$।',
        descriptionEn:
          'Electromagnetic induction produces induced EMF and current across a closed circuit via changing magnetic flux: $\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}$.',
        iconName: 'Zap',
        realWorldExampleBn:
          'সাইকেলের চাকায় ডায়নামো লাগানো থাকলে চাকা ঘোরার সাথে সাথে চুম্বক ঘোরে এবং বাতি জ্বলে ওঠে।',
        realWorldExampleEn:
          'Bicycle dynamos rotate magnets next to stationary wire coils to power headlights without batteries.',
        formulaLatex: '\\mathcal{E} = -N \\frac{d\\Phi}{dt} \\quad [\\Phi = B \\cdot A]',
      },
      {
        id: 'node-lenz-law',
        titleBn: 'লেঞ্জের সূত্র ও শক্তির নিত্যতা',
        titleEn: 'Lenz’s Law & Conservation of Energy',
        descriptionBn:
          'আবিষ্ট তড়িৎ প্রবাহের দিক এমন হয় যে, এটি সর্বদা সেই কারণকেই বাধা প্রদান করে যা দ্বারা এটি সৃষ্টি হয়েছে। লেঞ্জের সূত্র মূলত শক্তি সংরক্ষণশীলতার নীতিরই একটি বিশেষ রূপ। চুম্বককে কুণ্ডলীর কাছে আনতে চাইলে আবিষ্ট প্রবাহ বিকর্ষণ সৃষ্টি করে এবং চুম্বক সরাতে চাইলে আকর্ষণ করে বাধা দেয়।',
        descriptionEn:
          'Lenz’s law states that induced currents always oppose the change in magnetic flux that created them, directly embodying the law of conservation of energy.',
        iconName: 'Shield',
        realWorldExampleBn:
          'মেট্রোরেল ও আধুনিক ট্রেনের ম্যাগনেটিক ব্রেকিং সিস্টেম লেঞ্জের বিপরীতমুখী আবিষ্ট বলের নীতিতে অত্যন্ত মসৃণভাবে ট্রেন থামায়।',
        realWorldExampleEn:
          'Modern high-speed bullet trains employ eddy-current magnetic braking based on Lenz’s counter-force.',
        formulaLatex: '\\text{Direction of } \\mathcal{E} \\implies \\text{Opposes } \\Delta\\Phi',
      },
      {
        id: 'node-motor-generator',
        titleBn: 'মোটর বনাম জেনারেটর',
        titleEn: 'Electric Motor vs Generator',
        descriptionBn:
          'বৈদ্যুতিক মোটর তড়িৎ শক্তিকে যান্ত্রিক শক্তিতে রূপান্তরিত করে (ফ্লেমিংয়ের বাম হাত নিয়ম)। জেনারেটর বা ডায়নামো যান্ত্রিক শক্তিকে তড়িৎ শক্তিতে রূপান্তরিত করে (ফ্লেমিংয়ের ডান হাত নিয়ম)। মোটরে তড়িৎ দেওয়া হয় এবং জেনারেটর থেকে তড়িৎ পাওয়া যায়।',
        descriptionEn:
          'Motors convert electrical energy into mechanical rotation (Fleming’s left-hand rule). Generators convert mechanical motion into electrical output (Fleming’s right-hand rule).',
        iconName: 'RotateCcw',
        realWorldExampleBn:
          'কাপ্তাই জলবিদ্যুৎ কেন্দ্রে পানির স্রোতের সাহায্যে টারবাইন ঘুরিয়ে জেনারেটরের মাধ্যমে বিদ্যুৎ উৎপাদন করা হয়।',
        realWorldExampleEn:
          'Hydroelectric power plants spin massive generator turbines using pressurized water currents to produce electricity.',
        formulaLatex: '\\text{Motor: } E_{\\text{elec}} \\to E_{\\text{mech}}, \\quad \\text{Generator: } E_{\\text{mech}} \\to E_{\\text{elec}}',
      },
      {
        id: 'node-transformer-principle',
        titleBn: 'ট্রান্সফরমার ও রূপান্তর অনুপাত',
        titleEn: 'Transformer & Transformation Ratio',
        descriptionBn:
          'যে স্থির যন্ত্রের সাহায্যে পরিবর্তী উচ্চ বিভবকে নিম্ন বিভবে অথবা নিম্ন বিভবকে উচ্চ বিভবে রূপান্তর করা যায় তাকে ট্রান্সফরমার বলে। ট্রান্সফরমার পারস্পরিক আবেশ (Mutual Induction) মূলনীতিতে কাজ করে। এতে মুখ্য ও গৌণ কুণ্ডলীর ভোল্টেজ পাকসংখ্যার সমানুপাতিক: $\\frac{V_p}{V_s} = \\frac{N_p}{N_s}$।',
        descriptionEn:
          'A transformer alters alternating voltage and current via mutual induction across a shared magnetic core without changing frequency: $\\frac{V_p}{V_s} = \\frac{N_p}{N_s}$.',
        iconName: 'Magnet',
        realWorldExampleBn:
          'মোবাইল চার্জারে অবরোহী (Step-down) ট্রান্সফরমার ব্যবহার করে ২২০ ভোল্ট এসি বিদ্যুৎকে ৫ ভোল্ট ডিসিতে রূপান্তর করা হয়।',
        realWorldExampleEn:
          'Mobile phone chargers utilize step-down transformers to reduce household 220V AC down to 5V charging levels.',
        formulaLatex: '\\frac{V_p}{V_s} = \\frac{N_p}{N_s} = \\frac{I_s}{I_p}',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 2: Interactive Sandbox Configuration
  // ----------------------------------------------------
  step2: {
    simulatorType: 'magnetism',
    instructionsBn:
      'মুখ্য ও গৌণ কুণ্ডলীর পাকসংখ্যা ($N_p, N_s$), ইনপুট ভোল্টেজ ($V_p$) এবং লোড রোধ ($R_L$) পরিবর্তন করে আরোহী/অবরোহী ট্রান্সফরমারের ভোল্টেজ রূপান্তর, কারেন্ট এবং ক্ষমতার নিত্যতা পর্যবেক্ষণ করো।',
    instructionsEn:
      'Adjust primary/secondary turns ($N_p, N_s$), supply voltage ($V_p$), and load resistance to observe step-up/step-down voltage conversion, current transformation, and power conservation.',
    controls: [
      {
        key: 'np',
        labelBn: 'মুখ্য কুণ্ডলীর পাকসংখ্যা ($N_p$)',
        labelEn: 'Primary Coil Turns ($N_p$)',
        defaultValue: 500,
        min: 100,
        max: 2000,
        step: 50,
        unit: 'পাক',
        descriptionBn: 'ইনপুট কুণ্ডলীর তারের পাকসংখ্যা',
      },
      {
        key: 'ns',
        labelBn: 'গৌণ কুণ্ডলীর পাকসংখ্যা ($N_s$)',
        labelEn: 'Secondary Coil Turns ($N_s$)',
        defaultValue: 1000,
        min: 100,
        max: 2000,
        step: 50,
        unit: 'পাক',
        descriptionBn: 'আউটপুট কুণ্ডলীর তারের পাকসংখ্যা',
      },
      {
        key: 'vp',
        labelBn: 'মুখ্য ভোল্টেজ ($V_p$)',
        labelEn: 'Primary Voltage ($V_p$)',
        defaultValue: 220,
        min: 12,
        max: 440,
        step: 1,
        unit: 'V (AC)',
        descriptionBn: 'ইনপুট পরিবর্তী বিভব পার্থক্য',
      },
      {
        key: 'loadResistance',
        labelBn: 'লোড রোধ ($R_L$)',
        labelEn: 'Load Resistance ($R_L$)',
        defaultValue: 44,
        min: 5,
        max: 100,
        step: 1,
        unit: 'Ω',
        descriptionBn: 'গৌণ কুণ্ডলীর সাথে যুক্ত বহিস্থ রোধ',
      },
    ],
    keyObservationTipBn:
      'ট্রান্সফরমার শুধুমাত্র অল্টারনেটিং কারেন্টে (AC) কাজ করে। যদি উদ্দীপকে ব্যাটারি বা ডিসি (DC) ভোল্টেজ যুক্ত করার কথা বলা হয়, তবে গৌণ কুণ্ডলীর ভোল্টেজ সর্বদা ০ ভোল্ট ($V_s = 0\\text{ V}$) হবে! কারণ ডিসিতে ফ্লাক্সের পরিবর্তন হয় না।',
    keyObservationTipEn:
      'Transformers operate strictly on Alternating Current (AC). Connecting a DC battery yields zero induced secondary voltage ($V_s = 0$) because constant DC produces zero magnetic flux change.',
  },

  // ----------------------------------------------------
  // STEP 3: Pattern & Formula Decoder
  // ----------------------------------------------------
  step3: {
    coreFormulaLatex:
      '\\frac{V_p}{V_s} = \\frac{N_p}{N_s} = \\frac{I_s}{I_p} \\quad \\Longleftrightarrow \\quad P_p = P_s \\quad (V_p I_p = V_s I_s)',
    variableDefinitions: [
      {
        symbol: 'V_p, V_s',
        nameBn: 'মুখ্য ও গৌণ কুণ্ডলীর বিভব পার্থক্য',
        nameEn: 'Primary and Secondary Voltages',
        siUnit: 'ভোল্ট (V)',
      },
      {
        symbol: 'N_p, N_s',
        nameBn: 'মুখ্য ও গৌণ কুণ্ডলীর পাকসংখ্যা',
        nameEn: 'Primary and Secondary Turns',
        siUnit: 'এককহীন (পাক সংখ্যা)',
      },
      {
        symbol: 'I_p, I_s',
        nameBn: 'মুখ্য ও গৌণ কুণ্ডলীর তড়িৎ প্রবাহ',
        nameEn: 'Primary and Secondary Currents',
        siUnit: 'অ্যাম্পিয়ার (A)',
      },
      {
        symbol: 'P_p, P_s',
        nameBn: 'মুখ্য ও গৌণ কুণ্ডলীর তড়িৎ ক্ষমতা',
        nameEn: 'Primary and Secondary Power',
        siUnit: 'ওয়াট (W)',
      },
      {
        symbol: '\\eta',
        nameBn: 'ট্রান্সফরমারের কর্মদক্ষতা ($P_s / P_p \\times 100\\%$)',
        nameEn: 'Transformer Efficiency',
        siUnit: 'শতাংশ (%)',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'ফ্যারাডের সূত্র থেকে ভোল্টেজ ও পাকসংখ্যার অনুপাত',
        labelEn: 'Voltage and Turns Ratio Derivation from Faraday’s Law',
        latexExpression:
          'V_p = -N_p \\frac{\\Delta\\Phi}{\\Delta t}, \\quad V_s = -N_s \\frac{\\Delta\\Phi}{\\Delta t} \\implies \\frac{V_p}{V_s} = \\frac{N_p}{N_s}',
        explanationBn:
          'উভয় কুণ্ডলী একই নরম লোহার মজ্জায় পেঁচানো থাকায় প্রতি পাকে চৌম্বক ফ্লাক্সের পরিবর্তনের হার ($\\Delta\\Phi / \\Delta t$) সমান।',
        explanationEn:
          'Sharing an identical iron core ensures identical magnetic flux change per turn in both coils.',
      },
      {
        stepNumber: 2,
        labelBn: 'ক্ষমতার নিত্যতা থেকে কারেন্টের বিপরীত অনুপাত',
        labelEn: 'Current Inverse Ratio Derivation from Power Conservation',
        latexExpression:
          'P_p = P_s \\implies V_p I_p = V_s I_s \\implies \\frac{I_s}{I_p} = \\frac{V_p}{V_s} = \\frac{N_p}{N_s}',
        explanationBn:
          'একটি আদর্শ ট্রান্সফরমারে কোনো শক্তি অপচয় হয় না। ফলে ভোল্টেজ যে অনুপাতে বাড়ে, কারেন্ট ঠিক একই অনুপাতে কমে যায়।',
        explanationEn:
          'In an ideal transformer with zero loss, multiplying voltage necessarily divides current proportionately.',
      },
      {
        stepNumber: 3,
        labelBn: 'দূরবর্তী বিদ্যুৎ সঞ্চালনে উচ্চ ভোল্টেজ পাঠানোর কারণ',
        labelEn: 'High-Voltage Power Transmission Joule Loss Reduction',
        latexExpression:
          'P_{\\text{loss}} = I^2 R_{\\text{wire}} \\quad [V \\uparrow \\implies I \\downarrow \\implies P_{\\text{loss}} \\downarrow\\downarrow]',
        explanationBn:
          'স্টেপ-আপ ট্রান্সফরমার দিয়ে ভোল্টেজ বাড়িয়ে কারেন্ট ($I$) কমালে তারের ভেতর দিয়ে সঞ্চালনজনিত অপচয় ($I^2R$) নাটকীয়ভাবে হ্রাস পায়।',
        explanationEn:
          'Stepping up voltage reduces transmission current $I$, mitigating line resistance Joule heating loss ($I^2R$).',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'একটি ট্রান্সফরমারের মুখ্য কুণ্ডলীর পাকসংখ্যা ৫০০ এবং গৌণ কুণ্ডলীর পাকসংখ্যা ১০০০। মুখ্য কুণ্ডলীতে ২২০ ভোল্ট এসি বিদ্যুৎ সরবরাহ করা হলো এবং গৌণ কুণ্ডলীর সাথে ৪৪ ওহম রোধের একটি লোড যুক্ত করা হলো। (ক) গৌণ কুণ্ডলীর ভোল্টেজ ও প্রবাহ কত? (খ) মুখ্য কুণ্ডলীর প্রবাহ বের করে দেখাও যে ট্রান্সফরমারটিতে ক্ষমতার নিত্যতা বজায় থাকে।',
      problemEn:
        'A transformer has $N_p = 500$ and $N_s = 1000$. Primary is supplied with $220\\text{ V AC}$ and secondary connects to a load of $44\\ \\Omega$. (a) Find secondary voltage and current. (b) Compute primary current and verify conservation of power.',
      solutionStepsBn: [
        '১. প্রদত্ত তথ্য: $N_p = 500$, $N_s = 1000$, $V_p = 220\\text{ V}$, $R_L = 44\\ \\Omega$।',
        '২. গৌণ ভোল্টেজ: $\\frac{V_s}{V_p} = \\frac{N_s}{N_p} \\implies V_s = 220 \\times \\frac{1000}{500} = 440\\text{ V}$ (এটি একটি আরোহী বা Step-Up ট্রান্সফরমার)।',
        '৩. গৌণ প্রবাহ: $I_s = \\frac{V_s}{R_L} = \\frac{440}{44} = 10\\text{ A}$।',
        '৪. মুখ্য প্রবাহ: $\\frac{I_p}{I_s} = \\frac{N_s}{N_p} \\implies I_p = 10 \\times \\frac{1000}{500} = 20\\text{ A}$।',
        '৫. ক্ষমতার নিত্যতা যাচাই: মুখ্য ক্ষমতা $P_p = V_p \\times I_p = 220 \\times 20 = 4400\\text{ W}$। গৌণ ক্ষমতা $P_s = V_s \\times I_s = 440 \\times 10 = 4400\\text{ W}$। যেহেতু $P_p = P_s = 4400\\text{ W}$, সুতরাং ক্ষমতার নিত্যতা বজায় থাকে।',
      ],
      solutionStepsEn: [
        '1. Given: $N_p = 500, N_s = 1000, V_p = 220\\text{ V}, R_L = 44\\ \\Omega$.',
        '2. Secondary voltage: $V_s = V_p (N_s / N_p) = 220 \\times (1000 / 500) = 440\\text{ V}$ (Step-up).',
        '3. Secondary current: $I_s = V_s / R_L = 440 / 44 = 10\\text{ A}$.',
        '4. Primary current: $I_p = I_s (N_s / N_p) = 10 \\times (1000 / 500) = 20\\text{ A}$.',
        '5. Verification: $P_p = 220 \\times 20 = 4400\\text{ W}$; $P_s = 440 \\times 10 = 4400\\text{ W}$. $P_p = P_s$, confirming energy conservation.',
      ],
      finalAnswerWithUnit: 'V_s = 440\\text{ V}, \\quad I_s = 10\\text{ A}, \\quad I_p = 20\\text{ A}, \\quad P_p = P_s = 4400\\text{ W}',
    },
  },

  // ----------------------------------------------------
  // STEP 4: Board Traps (Examiner Mark Deductions)
  // ----------------------------------------------------
  step4: {
    traps: [
      {
        id: 'trap-1-dc-in-transformer',
        titleBn: 'ট্রান্সফরমারে ডিসি (DC) ভোল্টেজ বা ব্যাটারি যুক্ত করার পরিণতি না বোঝা',
        titleEn: 'Applying DC Voltage to a Transformer Primary Coil',
        lostMarks: 2,
        frequentlyTestedIn: 'খ ও ঘ-অংশ',
        commonMistakeBn:
          'উদ্দীপকে বলে "মুখ্য কুণ্ডলীতে ১২V এর একটি ডিসি ব্যাটারি যুক্ত করলে গৌণ কুণ্ডলীর ভোল্টেজ কত হবে?" ছাত্রছাত্রীরা সূত্র বসিয়ে $V_s = 12 \\times 2 = 24\\text{ V}$ উত্তর বের করে!',
        commonMistakeEn:
          'Applying $V_s = V_p (N_s/N_p)$ when the input source is explicitly a DC battery.',
        correctApproachBn:
          'ট্রান্সফরমার তড়িৎচুম্বকীয় আবেশ মূলনীতিতে কাজ করে, যার জন্য পরিবর্তনশীল চৌম্বক ফ্লাক্স ($\\Delta\\Phi / \\Delta t$) প্রয়োজন। ডিসিতে কারেন্ট ধ্রুব থাকায় ফ্লাক্সের পরিবর্তন শূন্য ($d\\Phi/dt = 0$), ফলে গৌণ কুণ্ডলীতে কোনো ভোল্টেজ আবিষ্ট হবে না ($V_s = 0\\text{ V}$)। উপরন্তু উচ্চ ডিসি কারেন্টের কারণে কুণ্ডলী পুড়ে যেতে পারে।',
        correctApproachEn:
          'Transformers require changing magnetic flux. Direct current maintains constant flux ($d\\Phi/dt = 0$), resulting strictly in zero secondary voltage ($V_s = 0$) and potential thermal coil burnout.',
        examinerSecretTipBn:
          'বোর্ডের অত্যন্ত জনপ্রিয় খ-অংশ ও MCQ ফাঁদ। ডিসি দেখলে চোখ বন্ধ করে গৌণ ভোল্টেজ ০ ভোল্ট লিখবে।',
        examinerSecretTipEn:
          'A classic board conceptual trap. DC input always yields $V_s = 0\\text{ V}$.',
      },
      {
        id: 'trap-2-current-ratio-inversion',
        titleBn: 'প্রবাহমাত্রার অনুপাত উল্টে ফেলা',
        titleEn: 'Inverting Current Ratio in Transformer Equation',
        lostMarks: 1,
        frequentlyTestedIn: 'গ ও ঘ-অংশ',
        commonMistakeBn:
          'ছাত্রছাত্রীরা তাড়াহুড়ো করে লিখে ফেলে: $\\frac{V_p}{V_s} = \\frac{N_p}{N_s} = \\frac{I_p}{I_s}$!',
        commonMistakeEn:
          'Writing $\\frac{V_p}{V_s} = \\frac{I_p}{I_s}$ instead of inverse ratio $\\frac{I_s}{I_p}$.',
        correctApproachBn:
          'যেহেতু ক্ষমতা সংরক্ষিত থাকে ($V_p I_p = V_s I_s$), তাই ভোল্টেজ ও প্রবাহের অনুপাত ব্যস্তানুপাতিক: $\\frac{V_p}{V_s} = \\frac{I_s}{I_p}$। স্টেপ-আপ ট্রান্সফরমারে ভোল্টেজ বাড়লে কারেন্ট কমবে!',
        correctApproachEn:
          'Power conservation demands an inverse ratio: $\\frac{V_p}{V_s} = \\frac{I_s}{I_p}$. Step-up transformer increases voltage while dropping current.',
        examinerSecretTipBn:
          'মনে রাখার সহজ কৌশল: যার ভোল্টেজ বেশি, তার কারেন্ট কম। ভোল্টেজ উপরে $p$ নিচে $s$ হলে কারেন্ট উপরে $s$ নিচে $p$ হবে।',
        examinerSecretTipEn:
          'Mnemonic: Inverted subscripts. $V_p/V_s$ equals $I_s/I_p$.',
      },
      {
        id: 'trap-3-motor-generator-rule-swap',
        titleBn: 'মোটর ও জেনারেটরের মূলনীতি বা শক্তির রূপান্তর উল্টো লেখা',
        titleEn: 'Swapping Operating Principles of Motor and Generator',
        lostMarks: 1,
        frequentlyTestedIn: 'ক ও খ-অংশ',
        commonMistakeBn:
          'মোটরকে ডায়নামো ভেবে "যান্ত্রিক থেকে তড়িৎ শক্তি" লিখে বসা অথবা মোটরে ফ্লেমিংয়ের ডান হাত নিয়ম প্রয়োগ করা।',
        commonMistakeEn:
          'Confusing electrical-to-mechanical conversion of motors with dynamos.',
        correctApproachBn:
          'বৈদ্যুতিক মোটর: তড়িৎ শক্তি $\\to$ যান্ত্রিক শক্তি (ফ্লেমিংয়ের বাম হাত নিয়ম)। জেনারেটর: যান্ত্রিক শক্তি $\\to$ তড়িৎ শক্তি (ফ্লেমিংয়ের ডান হাত নিয়ম বা তড়িৎচুম্বকীয় আবেশ)।',
        correctApproachEn:
          'Motor converts electrical to mechanical (Left-hand rule). Generator converts mechanical to electrical (Right-hand rule).',
        examinerSecretTipBn:
          'মনে রাখবে: "ম" তে মোটর = "ব" তে বাম হাত (ম-ব)। জেনারেটর = ডান হাত।',
        examinerSecretTipEn:
          'Examiners check clear delineation of energy input vs output.',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 5: Rapid Board Quiz
  // ----------------------------------------------------
  step5: {
    quizzes: [
      {
        id: 'q1-dc-battery-transformer-output',
        questionBn:
          'একটি আদর্শ ট্রান্সফরমারের মুখ্য কুণ্ডলীতে ১২ ভোল্টের একটি ডিসি ব্যাটারি যুক্ত করা হলে গৌণ কুণ্ডলীতে কত ভোল্ট পাওয়া যাবে?',
        questionEn:
          'If a 12V DC battery is connected across the primary coil of an ideal transformer, what will be the secondary voltage?',
        questionType: 'MCQ',
        optionsBn: ['0 V', '12 V', '24 V', 'অসীম (Infinity)'],
        optionsEn: ['0 V', '12 V', '24 V', 'Infinity'],
        correctOptionIndex: 0,
        explanationBn:
          'ট্রান্সফরমার কাজ করে ফ্যারাডের তড়িৎচুম্বকীয় আবেশ নীতিতে। ডিসি কারেন্টে চৌম্বক ফ্লাক্সের কোনো পরিবর্তন হয় না ($\\Delta\\Phi = 0$), ফলে গৌণ কুণ্ডলীতে কোনো ভোল্টেজ আবিষ্ট হয় না ($V_s = 0\\text{ V}$)। সঠিক উত্তর ক (0 V)।',
        explanationEn:
          'DC current creates constant flux with zero time variance ($d\\Phi/dt = 0$). Hence induced secondary voltage is 0V.',
        boardSource: 'ঢাকা বোর্ড ২০২৩ / কুমিল্লা বোর্ড ২০২৪',
      },
      {
        id: 'q2-step-up-transformer-characteristic',
        questionBn: 'একটি স্টেপ-আপ (আরোহী) ট্রান্সফরমারের ক্ষেত্রে নিচের কোন সম্পর্কটি সঠিক?',
        questionEn: 'Which relationship is correct for a Step-Up transformer?',
        questionType: 'MCQ',
        optionsBn: [
          'Ns > Np এবং Vs > Vp',
          'Ns < Np এবং Vs < Vp',
          'Ns > Np এবং Is > Ip',
          'Vs > Vp এবং Is > Ip',
        ],
        optionsEn: [
          'Ns > Np and Vs > Vp',
          'Ns < Np and Vs < Vp',
          'Ns > Np and Is > Ip',
          'Vs > Vp and Is > Ip',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'স্টেপ-আপ বা আরোহী ট্রান্সফরমারে গৌণ কুণ্ডলীর পাকসংখ্যা মুখ্য কুণ্ডলীর চেয়ে বেশি হয় ($N_s > N_p$), যার ফলে গৌণ ভোল্টেজ বাড়ে ($V_s > V_p$) এবং গৌণ কারেন্ট কমে ($I_s < I_p$)। সঠিক উত্তর ক।',
        explanationEn:
          'A step-up transformer increases voltage ($V_s > V_p$) via higher secondary turns ($N_s > N_p$). Option A is correct.',
        boardSource: 'রাজশাহী বোর্ড ২০২৪',
      },
      {
        id: 'q3-power-grid-transmission-loss',
        questionBn: 'দূরবর্তী স্থানে বিদ্যুৎ সঞ্চালনের সময় উচ্চ ভোল্টেজে বিদ্যুৎ পাঠানো হয় কেন?',
        questionEn: 'Why is electricity transmitted at high voltage across long-distance power grids?',
        questionType: 'MCQ',
        optionsBn: [
          'প্রবাহমাত্রা (I) কমিয়ে লাইনের তাপ অপচয় (I²R) কমানোর জন্য',
          'লাইনের রোধ বাড়ানোর জন্য',
          'বিদ্যুৎ অতি দ্রুত গন্তব্যে পৌঁছানোর জন্য',
          'ট্রান্সফরমার ঠান্ডা রাখার জন্য',
        ],
        optionsEn: [
          'To reduce line current (I) and minimize Joule heat losses (I²R)',
          'To increase transmission line resistance',
          'To accelerate electric transit speed',
          'To keep transformer coils cool',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'ক্ষমতা ধ্রুব রেখে ভোল্টেজ অনেক বাড়িয়ে দিলে প্রবাহমাত্রা ($I$) অনেক কমে যায়। ফলে তারের মধ্য দিয়ে চলাচলের সময় ঝুল তাপীয় অপচয় ($I^2R$) নাটকীয়ভাবে হ্রাস পায়। সঠিক উত্তর ক।',
        explanationEn:
          'Stepping up voltage reduces transmission line current, exponentially cutting down $I^2R$ resistive heating losses.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৩ / সিলেট বোর্ড ২০২৪',
      },
      {
        id: 'q4-lenz-law-conservation',
        questionBn: 'লেঞ্জের সূত্রটি মূলত পদার্থবিজ্ঞানের কোন মৌলিক সংরক্ষণশীলতার নীতির উপর প্রতিষ্ঠিত?',
        questionEn: 'Lenz’s law is fundamentally based on which conservation law in physics?',
        questionType: 'MCQ',
        optionsBn: [
          'শক্তির সংরক্ষণশীলতা নীতি (Conservation of Energy)',
          'ভরবেগের সংরক্ষণশীলতা নীতি (Conservation of Momentum)',
          'আধানের সংরক্ষণশীলতা নীতি (Conservation of Charge)',
          'ভরের সংরক্ষণশীলতা নীতি (Conservation of Mass)',
        ],
        optionsEn: [
          'Law of Conservation of Energy',
          'Law of Conservation of Momentum',
          'Law of Conservation of Charge',
          'Law of Conservation of Mass',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'লেঞ্জের সূত্রানুযায়ী চুম্বককে গতিশীল করতে যে যান্ত্রিক কাজ সম্পন্ন করতে হয়, ঠিক সেই পরিমাণ কাজই কুণ্ডলীতে তড়িৎ শক্তিতে রূপান্তরিত হয়। সুতরাং এটি শক্তির সংরক্ষণশীলতা নীতির বহিঃপ্রকাশ।',
        explanationEn:
          'The mechanical work done against the opposing induced magnetic field converts into electrical energy, fulfilling conservation of energy.',
        boardSource: 'দিনাজপুর বোর্ড ২০২৪',
      },
    ],
  },
};
