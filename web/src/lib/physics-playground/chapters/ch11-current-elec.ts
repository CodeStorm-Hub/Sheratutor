import { PhysicsChapterFullData } from '../types';

export const CH11_CURRENT_ELEC_DATA: PhysicsChapterFullData = {
  id: 'ssc-phy-ch11',
  chapterNo: 11,
  subjectCode: 'SSC-PHY',
  titleEn: 'Current Electricity',
  titleBn: 'চল তড়িৎ',
  division: 'electricity_magnetism',
  divisionTitleEn: 'Electricity & Magnetism',
  divisionTitleBn: 'তড়িৎ ও চৌম্বকবিজ্ঞান',
  iconName: 'Activity',
  estimatedMinutes: 50,
  boardMarksAllocation: 'CQ ১০ নম্বর (ক: ১, খ: ২, গ: ৩, ঘ: ৪) + MCQ ৪-৫ নম্বর (বোর্ডের সর্বোচ্চ গুরুত্বপূর্ণ অধ্যায়)',
  overviewBn:
    'কোনো পরিবাহীর মধ্য দিয়ে আধানের নিরবচ্ছিন্ন প্রবাহই হলো চল তড়িৎ। এসএসসি পদার্থবিজ্ঞান বোর্ড পরীক্ষায় এই অধ্যায় থেকে প্রতি বছর নিশ্চিত ১টি বা ২টি সৃজনশীল প্রশ্ন (CQ) আসে। ওহমের সূত্র, আপেক্ষিক রোধ, তার টেনে লম্বা করার নিয়ম, তুল্য রোধ, তড়িচ্চালক শক্তি ও হারানো ভোল্ট, এবং বিদ্যুৎ বিলের হিসাব এখানে বোর্ড স্ট্যান্ডার্ড কাঠামোর সাথে উপস্থাপন করা হয়েছে।',
  overviewEn:
    'Continuous flow of charge constitutes electric current. A flagship pillar of SSC Physics, this chapter reliably contributes 1-2 complete CQ sets every year. Master Ohm’s law, resistivity, wire stretching scaling laws, equivalent circuits, internal resistance with lost volts, and commercial energy billing.',
  keyTopicsBn: [
    'তড়িৎ প্রবাহ ও ওহমের সূত্র ($I = V/R$)',
    'আপেক্ষিক রোধ ও তার টানার সূত্র ($R \\propto L^2$)',
    'শ্রেণি ও সমান্তরাল তুল্য রোধ ($R_s, R_p$)',
    'তড়িচ্চালক শক্তি ও হারানো ভোল্ট ($E = V + Ir$)',
    'তড়িৎ ক্ষমতা ও শক্তির রূপান্তর ($P = VI = I^2R$)',
    'বিদ্যুৎ বিল ও বিওটি ইউনিট হিসাব (kWh / Unit)',
  ],
  keyTopicsEn: [
    'Electric Current & Ohm’s Law ($I = V/R$)',
    'Resistivity & Wire Stretching Scaling ($R \\propto L^2$)',
    'Series & Parallel Equivalent Resistance ($R_s, R_p$)',
    'EMF & Lost Volts ($E = V + Ir$)',
    'Electric Power Dissipation ($P = VI = I^2R$)',
    'Electric Energy Billing (kWh / Board of Trade Units)',
  ],
  status: 'available',

  // ----------------------------------------------------
  // STEP 1: Concept Tree
  // ----------------------------------------------------
  step1: {
    summaryBn:
      'চল তড়িতের গাণিতিক হিসাব মূলত তিনটি মূল কাঠামোর উপর প্রতিষ্ঠিত: (১) ওহমের সূত্র ও তুল্য রোধ, (২) ব্যাটারির তড়িচ্চালক শক্তি ও অভ্যন্তরীণ রোধ, এবং (৩) ব্যয়িত তড়িৎ শক্তি ও বিদ্যুৎ বিলের বাণিজ্যিক হিসাব।',
    summaryEn:
      'Current electricity rests upon three mathematical pillars: (1) Ohm’s law & network reduction, (2) EMF and battery internal resistance losses, and (3) Joule heating with commercial kilowatt-hour energy accounting.',
    nodes: [
      {
        id: 'node-ohm-law',
        titleBn: 'ওহমের সূত্র ও তড়িৎ প্রবাহ',
        titleEn: 'Ohm’s Law & Current',
        descriptionBn:
          'নির্দিষ্ট তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক: $I \\propto V \\implies V = IR$। পরিবাহীর যে ধর্মের জন্য এর মধ্য দিয়ে বিদ্যুৎ প্রবাহ বাধাগ্রস্ত হয়, তাকে রোধ ($R$) বলে। এর এসআই একক ওহম ($\\Omega$)।',
        descriptionEn:
          'At constant temperature, current through a conductor is proportional to potential difference across its terminals: $V = IR$. Resistance ($R$) is measured in Ohms ($\\Omega$).',
        iconName: 'Zap',
        realWorldExampleBn:
          'ঘরের ফ্যানের রেগুলেটর ঘুরিয়ে মূলত বর্তনীর রোধ বাড়িয়ে বা কমিয়ে ফ্যানে বিদ্যুৎ প্রবাহ নিয়ন্ত্রণ করা হয়।',
        realWorldExampleEn:
          'A ceiling fan regulator varies internal circuit resistance, controlling current and rotation speed.',
        formulaLatex: 'I = \\frac{V}{R} \\quad \\Longleftrightarrow \\quad V = IR',
      },
      {
        id: 'node-resistivity-stretching',
        titleBn: 'আপেক্ষিক রোধ ও তারের প্রসারণ',
        titleEn: 'Specific Resistance & Wire Stretching',
        descriptionBn:
          'নির্দিষ্ট তাপমাত্রায় একক দৈর্ঘ্য ও একক প্রস্থচ্ছেদের ক্ষেত্রফল বিশিষ্ট কোনো পরিবাহীর রোধকে ওই উপাদানের আপেক্ষিক রোধ বলে: $\\rho = \\frac{RA}{L}$। কোনো তারকে টেনে দৈর্ঘ্য $n$ গুণ করা হলে তারের আয়তন ধ্রুব থাকায় প্রস্থচ্ছেদ $1/n$ গুণ হয়ে যায়— ফলে নতুন রোধ $n^2$ গুণ বৃদ্ধি পায়: $R\' = n^2 R$।',
        descriptionEn:
          'Specific resistance $\\rho = RA/L$. When a wire of resistance $R$ is stretched to $n$ times its initial length, volume conservation scales resistance by $n^2$: $R\' = n^2 R$.',
        iconName: 'Sliders',
        realWorldExampleBn:
          'হিটারের তার হিসেবে বেশি আপেক্ষিক রোধবিশিষ্ট নাইক্রোম তার ব্যবহার করা হয় যাতে বেশি তাপ উৎপন্ন হতে পারে।',
        realWorldExampleEn:
          'Electric heaters utilize high-resistivity Nichrome wire coils to maximize Joule heating output.',
        formulaLatex: 'R = \\rho \\frac{L}{A} \\quad \\implies \\quad R\' = n^2 R \\quad (\\text{টেনে } n \\text{ গুণ লম্বা করলে})',
      },
      {
        id: 'node-resistor-combinations',
        titleBn: 'রোধের সন্নিবেশ (শ্রেণি ও সমান্তরাল)',
        titleEn: 'Resistor Network Combinations',
        descriptionBn:
          'শ্রেণি সংযোগে সবগুলো রোধের মধ্য দিয়ে একই কারেন্ট প্রবাহিত হয় ($R_s = R_1 + R_2 + \\dots$)। সমান্তরাল সংযোগে সবগুলো রোধের দুই প্রান্তে একই ভোল্টেজ থাকে এবং কারেন্ট বিভক্ত হয় ($\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots$)।',
        descriptionEn:
          'Series networks share identical current ($R_s = \\sum R_i$). Parallel branches share identical terminal voltage while currents divide inversely proportional to resistances.',
        iconName: 'Layers',
        realWorldExampleBn:
          'বাসাবাড়ির সকল বৈদ্যুতিক যন্ত্রপাতি সমান্তরাল সংযোগে যুক্ত থাকে যাতে প্রতিটি যন্ত্র পূর্ণ ভোল্টেজ পায় এবং একটি বন্ধ করলে অন্যগুলো চালু থাকে।',
        realWorldExampleEn:
          'Household appliances are connected in parallel so each receives full 220V grid voltage independently.',
        formulaLatex: 'R_s = R_1 + R_2, \\quad \\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}',
      },
      {
        id: 'node-emf-lost-volt',
        titleBn: 'তড়িচ্চালক শক্তি ($E$) ও হারানো ভোল্ট ($Ir$)',
        titleEn: 'Electromotive Force & Lost Volts',
        descriptionBn:
          'প্রতি একক আধানকে সম্পূর্ণ বর্তনী ঘুরিয়ে আনতে যে কাজ হয় তা হলো তড়িচ্চালক শক্তি ($E$)। ব্যাটারির নিজস্ব উপাদানের ভেতর যে রোধ থাকে তাকে অভ্যন্তরীণ রোধ ($r$) বলে। অভ্যন্তরীণ রোধ অতিক্রম করতে যে ভোল্টেজ নষ্ট হয় তাকে হারানো ভোল্ট ($v = Ir$) বলে: $E = V + Ir = I(R + r)$।',
        descriptionEn:
          'Total EMF $E$ divides into external useful terminal voltage $V$ and internal lost voltage $v = Ir$ dissipated as waste heat across cell internal resistance $r$: $E = V + Ir$.',
        iconName: 'Gauge',
        realWorldExampleBn:
          'পুরোনো ব্যাটারিতে অভ্যন্তরীণ রোধ বেড়ে যাওয়ার কারণে লোড যুক্ত করলেই টার্মিনাল ভোল্টেজ অনেক কমে যায়।',
        realWorldExampleEn:
          'Aging electrochemical cells develop elevated internal resistance, causing steep terminal voltage drops under heavy load.',
        formulaLatex: 'E = V + Ir = I(R_{\\text{eq}} + r) \\quad [v_{\\text{lost}} = Ir]',
      },
      {
        id: 'node-power-energy-billing',
        titleBn: 'তড়িৎ ক্ষমতা ও বিদ্যুৎ বিলের হিসাব',
        titleEn: 'Electric Power & Commercial Energy Billing',
        descriptionBn:
          'কোনো যন্ত্রে তড়িৎ শক্তি ব্যয়ের হারকে ক্ষমতা বলে: $P = VI = I^2R = \\frac{V^2}{R}$ ওয়াট। বাণিজ্যিক বিদ্যুৎ বিল হিসাব করা হয় কিলোওয়াট-ঘণ্টা (kWh) বা বোর্ড অব ট্রেড (BOT) ইউনিটে: $\\text{Unit} = \\frac{P\\text{ (W)} \\times t\\text{ (h)}}{1000}$।',
        descriptionEn:
          'Electric power $P = VI = I^2R = V^2/R$. Commercial energy consumption is metered in Board of Trade (BOT) units: $1\\text{ Unit} = 1\\text{ kWh} = \\frac{P(\\text{W}) \\times t(\\text{h})}{1000}$.',
        iconName: 'Activity',
        realWorldExampleBn:
          '১০০ ওয়াটের একটি বাতি দিনে ১০ ঘণ্টা জ্বললে ১ ইউনিট বিদ্যুৎ খরচ হয়: $(100 \\times 10) / 1000 = 1\\text{ kWh}$।',
        realWorldExampleEn:
          'A 100W light bulb running for 10 hours consumes exactly 1 unit of electricity: $(100 \\times 10)/1000 = 1\\text{ kWh}$.',
        formulaLatex: 'W = Pt = \\frac{P(\\text{W}) \\times t(\\text{hour})}{1000} \\text{ kWh (Unit)}',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 2: Interactive Sandbox Configuration
  // ----------------------------------------------------
  step2: {
    simulatorType: 'current_elec',
    instructionsBn:
      'বর্তনী ধরন (শ্রেণি, সমান্তরাল, মিশ্র) নির্বাচন করো এবং ব্যাটারির তড়িচ্চালক শক্তি ($E$), অভ্যন্তরীণ রোধ ($r$) ও রোধকগুলোর মান পরিবর্তন করে কারেন্ট, টার্মিনাল ভোল্টেজ ও মাসিক বিদ্যুৎ বিল পর্যবেক্ষণ করো।',
    instructionsEn:
      'Select network topology (series, parallel, mixed), adjust battery EMF ($E$), internal resistance ($r$), and resistor parameters to explore branch currents, lost volts, and billing.',
    controls: [
      {
        key: 'emf',
        labelBn: 'তড়িচ্চালক শক্তি ($E$)',
        labelEn: 'Battery EMF ($E$)',
        defaultValue: 12,
        min: 1,
        max: 24,
        step: 1,
        unit: 'V',
        descriptionBn: 'উৎস কোষের তড়িচ্চালক বল',
      },
      {
        key: 'internalR',
        labelBn: 'অভ্যন্তরীণ রোধ ($r$)',
        labelEn: 'Internal Resistance ($r$)',
        defaultValue: 1.0,
        min: 0,
        max: 5,
        step: 0.5,
        unit: 'Ω',
        descriptionBn: 'কোষের নিজস্ব অভ্যন্তরীণ রোধ',
      },
      {
        key: 'r1',
        labelBn: '১ম রোধক ($R_1$)',
        labelEn: 'Resistor 1 ($R_1$)',
        defaultValue: 6,
        min: 1,
        max: 50,
        step: 1,
        unit: 'Ω',
        descriptionBn: '১ম রোধের মান',
      },
      {
        key: 'r2',
        labelBn: '২য় রোধক ($R_2$)',
        labelEn: 'Resistor 2 ($R_2$)',
        defaultValue: 12,
        min: 1,
        max: 50,
        step: 1,
        unit: 'Ω',
        descriptionBn: '২য় রোধের মান',
      },
    ],
    keyObservationTipBn:
      'বোর্ড পরীক্ষায় প্রায়ই ছাত্রছাত্রীরা ব্যাটারির অভ্যন্তরীণ রোধ $r$ বাদ দিয়ে সরাসরি $I = E / R$ লিখে ফেলে। মনে রাখবে: মোট রোধ সর্বদা $(R_{\\text{eq}} + r)$। আর কোনো তারকে টেনে দ্বিগুণ করলে রোধ ২ গুণ নয়, বরং ৪ গুণ ($2^2$) বাড়ে!',
    keyObservationTipEn:
      'Never omit internal resistance $r$ from total circuit resistance: $I = E / (R_{\\text{eq}} + r)$. When stretching a wire, resistance scales with length squared ($n^2$), not linearly!',
  },

  // ----------------------------------------------------
  // STEP 3: Pattern & Formula Decoder
  // ----------------------------------------------------
  step3: {
    coreFormulaLatex:
      'I = \\frac{E}{R_{\\text{eq}} + r} \\quad \\Longleftrightarrow \\quad V = E - Ir \\quad \\Longleftrightarrow \\quad \\text{Unit} = \\frac{P(\\text{W}) \\times t(\\text{h})}{1000}',
    variableDefinitions: [
      {
        symbol: 'E',
        nameBn: 'তড়িচ্চালক শক্তি (EMF)',
        nameEn: 'Electromotive Force',
        siUnit: 'ভোল্ট (V)',
      },
      {
        symbol: 'V',
        nameBn: 'প্রান্তীয় বিভব পার্থক্য (Terminal Voltage)',
        nameEn: 'Terminal Voltage',
        siUnit: 'ভোল্ট (V)',
      },
      {
        symbol: 'I',
        nameBn: 'তড়িৎ প্রবাহ (Electric Current)',
        nameEn: 'Electric Current',
        siUnit: 'অ্যাম্পিয়ার (A)',
      },
      {
        symbol: 'R_{\\text{eq}}',
        nameBn: 'বহিস্থ বর্তনীর তুল্য রোধ',
        nameEn: 'Equivalent Resistance',
        siUnit: 'ওহম ($\\Omega$)',
      },
      {
        symbol: 'r',
        nameBn: 'কোষের অভ্যন্তরীণ রোধ',
        nameEn: 'Internal Resistance',
        siUnit: 'ওহম ($\\Omega$)',
      },
      {
        symbol: 'P',
        nameBn: 'তড়িৎ ক্ষমতা (Power)',
        nameEn: 'Electric Power',
        siUnit: 'ওয়াট ($\\text{Watt / W} = \\text{J/s}$)',
      },
      {
        symbol: 'W',
        nameBn: 'ব্যয়িত তড়িৎ শক্তি (Electrical Energy)',
        nameEn: 'Electrical Energy',
        siUnit: 'কিলোওয়াট-ঘণ্টা ($\\text{kWh} = \\text{Unit}$)',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'সমান্তরাল সন্নিবেশের তুল্য রোধ নিষ্পত্তি',
        labelEn: 'Parallel Network Equivalent Formula',
        latexExpression:
          '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} \\implies R_p = \\frac{R_1 R_2}{R_1 + R_2}',
        explanationBn:
          'দুটি রোধ সমান্তরালে থাকলে তাদের গুণফলকে যোগফল দিয়ে ভাগ করলে সরাসরি তুল্য রোধ পাওয়া যায়।',
        explanationEn:
          'For two parallel branches, equivalent resistance is calculated directly as product over sum.',
      },
      {
        stepNumber: 2,
        labelBn: 'বর্তনীতে মোট তড়িৎ প্রবাহ ও হারানো ভোল্ট সমীকরণ',
        labelEn: 'Circuit Closed Loop Formulation with Internal Resistance',
        latexExpression:
          'E = V_{\\text{terminal}} + v_{\\text{lost}} = I R_{\\text{eq}} + I r = I (R_{\\text{eq}} + r)',
        explanationBn:
          'শক্তি সংরক্ষণ নীতি অনুসারে উৎসের মোট কাজ বহিস্থ রোধে ব্যয়িত শক্তি এবং অভ্যন্তরীণ রোধে উৎপন্ন তাপের সমষ্টি।',
        explanationEn:
          'By energy conservation, input chemical EMF balances external terminal voltage and internal dissipation.',
      },
      {
        stepNumber: 3,
        labelBn: 'বাণিজ্যিক বিদ্যুৎ বিল নির্ণয়ের সূত্র',
        labelEn: 'Commercial BOT Energy & Cost Calculation Formula',
        latexExpression:
          '\\text{Cost (BDT)} = \\left( \\frac{\\sum P_i \\times t_i \\times 30}{1000} \\right) \\times \\text{Unit Price}',
        explanationBn:
          'ওয়াটকে ঘণ্টায় ব্যবহৃত মোট সময় দিয়ে গুণ করে ১০০০ দিয়ে ভাগ করলে ইউনিট পাওয়া যায়, যা একক প্রতি মূল্যের সাথে গুণ হয়।',
        explanationEn:
          'Total monthly consumption is computed in kWh (units) by dividing Watt-hours by 1000 and multiplying by the tariff.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'একটি বর্তনীতে $12\\text{ V}$ তড়িচ্চালক শক্তি ও $1\\ \\Omega$ অভ্যন্তরীণ রোধের একটি ব্যাটারির সাথে $6\\ \\Omega$ রোধক শ্রেণি সংযোগে এবং তার সাথে $12\\ \\Omega$ ও $12\\ \\Omega$ মানের দুটি রোধক সমান্তরাল সংযোগে যুক্ত আছে। (ক) বর্তনীর মূল প্রবাহ ও হারানো ভোল্টেজ নির্ণয় করো। (খ) এই বর্তনীটি দৈনিক ৮ ঘণ্টা করে ৩০ দিন চললে প্রতি ইউনিট ৭.৫০ টাকা দরে বিদ্যুৎ বিল কত হবে?',
      problemEn:
        'A circuit contains an EMF source $E = 12\\text{ V}, r = 1\\ \\Omega$ connected to a series resistor $R_1 = 6\\ \\Omega$ followed by two parallel resistors $R_2 = 12\\ \\Omega$ and $R_3 = 12\\ \\Omega$. (a) Determine the main current and lost voltage. (b) Operating 8 hours daily for 30 days at 7.50 BDT/unit, calculate the monthly electricity bill.',
      solutionStepsBn: [
        '১. সমান্তরাল অংশের তুল্য রোধ: $R_p = \\frac{R_2 \\times R_3}{R_2 + R_3} = \\frac{12 \\times 12}{12 + 12} = 6\\ \\Omega$।',
        '২. বহিস্থ বর্তনীর মোট তুল্য রোধ: $R_{\\text{eq}} = R_1 + R_p = 6 + 6 = 12\\ \\Omega$।',
        '৩. বর্তনীর মূল প্রবাহ: $I = \\frac{E}{R_{\\text{eq}} + r} = \\frac{12}{12 + 1} = \\frac{12}{13} \\approx 0.923\\text{ A}$।',
        '৪. হারানো ভোল্টেজ: $v = Ir = 0.923 \\times 1 = 0.923\\text{ V}$। প্রান্তীয় বিভব $V = E - v = 12 - 0.923 = 11.077\\text{ V}$।',
        '৫. বহিস্থ বর্তনীর ক্ষমতা: $P = I^2 R_{\\text{eq}} = (0.923)^2 \\times 12 \\approx 10.22\\text{ W}$।',
        '৬. ৩০ দিনে মোট শক্তি: $W = \\frac{10.22\\text{ W} \\times 8\\text{ h} \\times 30}{1000} = 2.453\\text{ kWh (Unit)}$।',
        '৭. বিদ্যুৎ বিল: $2.453 \\times 7.50 = 18.40\\text{ টাকা}$।',
      ],
      solutionStepsEn: [
        '1. Parallel branch: $R_p = (12 \\times 12) / (12 + 12) = 6\\ \\Omega$.',
        '2. Total external resistance: $R_{\\text{eq}} = 6 + 6 = 12\\ \\Omega$.',
        '3. Total circuit current: $I = 12 / (12 + 1) = 0.923\\text{ A}$.',
        '4. Lost volts: $v = Ir = 0.923 \\times 1 = 0.923\\text{ V}$. Terminal voltage: $V = 11.08\\text{ V}$.',
        '5. Dissipated power: $P = I^2 R_{\\text{eq}} = (0.923)^2 \\times 12 \\approx 10.22\\text{ W}$.',
        '6. Monthly energy: $W = (10.22 \\times 8 \\times 30)/1000 = 2.453\\text{ Units (kWh)}$.',
        '7. Total electricity bill: $2.453 \\times 7.50 = 18.40\\text{ BDT}$.',
      ],
      finalAnswerWithUnit: 'I = 0.923\\text{ A}, \\quad v = 0.923\\text{ V}, \\quad \\text{Bill} = 18.40\\text{ BDT}',
    },
  },

  // ----------------------------------------------------
  // STEP 4: Board Traps (Examiner Mark Deductions)
  // ----------------------------------------------------
  step4: {
    traps: [
      {
        id: 'trap-1-wire-stretching-square-rule',
        titleBn: 'তার টেনে দৈর্ঘ্য দ্বিগুণ করলে রোধ দ্বিগুণ ভাবা',
        titleEn: 'Assuming Linear Resistance Scaling When Wire is Stretched',
        lostMarks: 2,
        frequentlyTestedIn: 'গ ও ঘ-অংশ',
        commonMistakeBn:
          'উদ্দীপকে বলা হলো "$10\\ \\Omega$ রোধের একটি তামার তারকে টেনে দৈর্ঘ্য দ্বিগুণ করা হলো, এর রোধ কত হবে?" ছাত্রছাত্রীরা $R \\propto L$ মনে করে উত্তর লেখে $20\\ \\Omega$!',
        commonMistakeEn:
          'Writing $R\' = 2 \\times 10 = 20\\ \\Omega$ by falsely applying $R \\propto L$ to a stretched wire.',
        correctApproachBn:
          'তার টানলে আয়তন ধ্রুব থাকে ($V = AL$)। দৈর্ঘ্য দ্বিগুণ ($2L$) হলে প্রস্থচ্ছেদের ক্ষেত্রফল অর্ধেক ($A/2$) হয়ে যায়। অতএব $R\' = \\rho \\frac{2L}{A/2} = 4 \\rho \\frac{L}{A} = 4R = 40\\ \\Omega$। অর্থাৎ রোধ $n^2 = 2^2 = 4$ গুণ হবে।',
        correctApproachEn:
          'Wire stretching preserves constant volume. Doubling length halves cross-sectional area, yielding $R\' = n^2 R = 4R = 40\\ \\Omega$.',
        examinerSecretTipBn:
          'যদি তার "টেনে লম্বা" না করে একই উপাদানের অন্য একটি দ্বিগুণ দৈর্ঘ্যের তার নেওয়া হয়, তবেই কেবল দ্বিগুণ ($2R$) হবে। কিন্তু "টেনে লম্বা" শব্দ দেখলেই $n^2$ হবে!',
        examinerSecretTipEn:
          'Keyword vigilance: "Stretched" implies $n^2$ scaling. A separate independent wire with double length scales linearly.',
      },
      {
        id: 'trap-2-lost-volt-neglect',
        titleBn: 'উদ্দীপকে অভ্যন্তরীণ রোধ (r) থাকা সত্ত্বেও মোট রোধে তা যোগ না করা',
        titleEn: 'Omitting Internal Resistance (r) in Circuit Current Calculations',
        lostMarks: 1,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক)',
        commonMistakeBn:
          'উদ্দীপকে ব্যাটারির পাশে $(12\\text{ V}, 0.5\\ \\Omega)$ লেখা থাকে, কিন্তু ছাত্রছাত্রীরা কারেন্ট বের করে $I = \\frac{12}{R_{\\text{eq}}}$ সূত্রে!',
        commonMistakeEn:
          'Calculating current via $I = E / R_{\\text{eq}}$, completely ignoring internal cell resistance $r = 0.5\\ \\Omega$.',
        correctApproachBn:
          'সঠিক সূত্র: $I = \\frac{E}{R_{\\text{eq}} + r}$। এবং প্রান্তীয় ভোল্টেজ বের করতে বললে $V = E - Ir$ অথবা $V = I R_{\\text{eq}}$ ব্যবহার করতে হবে।',
        correctApproachEn:
          'Always include $r$ in denominator: $I = E / (R_{\\text{eq}} + r)$. Terminal voltage is $V = E - Ir$.',
        examinerSecretTipBn:
          'বোর্ডের গ-অংশে অভ্যন্তরীণ রোধ মিস হলে পুরো অংকের কারেন্ট ভুল আসে এবং ৩ নম্বরের মধ্যে ১-২ নম্বর কাটা যায়।',
        examinerSecretTipEn:
          'Missing $r$ cascades arithmetic errors across subsequent CQ steps, costing 1 to 2 marks.',
      },
      {
        id: 'trap-3-electricity-bill-kwh-conversion',
        titleBn: 'বিদ্যুৎ বিল বের করার সময় ওয়াটকে ১০০০ দিয়ে ভাগ না করা',
        titleEn: 'Failing to Divide Watts by 1000 in Commercial Electricity Billing',
        lostMarks: 1,
        frequentlyTestedIn: 'ঘ-অংশ (উচ্চতর দক্ষতা)',
        commonMistakeBn:
          'ক্ষমতা ওয়াটে ($W$) থাকা সত্ত্বেও সরাসরি সময়ের সাথে গুণ করে $P \\times t \\times \\text{দর}$ হিসাব করে কোটি টাকার বিল বানিয়ে ফেলা!',
        commonMistakeEn:
          'Multiplying Watt hours directly with unit tariff without dividing by 1000.',
        correctApproachBn:
          '১ ইউনিট বিদ্যুৎ খরচ মানে ১ কিলোওয়াট-ঘণ্টা ($1\\text{ kWh}$)। তাই সর্বদা ক্ষমতাকে ওয়াট থেকে কিলোওয়াটে নিতে ১০০০ দিয়ে ভাগ করতে হবে: $\\text{Unit} = \\frac{P\\text{ (W)} \\times t\\text{ (h)}}{1000}$।',
        correctApproachEn:
          '1 Unit $\\equiv 1\\text{ kWh}$. Watts must be converted to kilowatts by dividing by 1000 before computing price.',
        examinerSecretTipBn:
          'বোর্ডের ঘ-অংশে ইউনিট বের করার ধাপে ১ নম্বর এবং চূড়ান্ত টাকা গুণ করার ধাপে ১ নম্বর বরাদ্দ থাকে। ১০০০ ভাগ না করলে পুরো ধাপ কাটা যায়।',
        examinerSecretTipEn:
          'Board scoring rubric reserves 1 mark specifically for dividing by 1000.',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 5: Rapid Board Quiz
  // ----------------------------------------------------
  step5: {
    quizzes: [
      {
        id: 'q1-wire-stretched-triple',
        questionBn:
          'একটি ৫ ওহম ($5\\ \\Omega$) রোধের পরিবাহী তারকে টেনে এর আদি দৈর্ঘ্যের তিনগুণ ($3L$) করা হলো। তারটির বর্তমান রোধ কত হবে?',
        questionEn:
          'A conductor wire of initial resistance $5\\ \\Omega$ is stretched to three times its original length ($3L$). What is its new resistance?',
        questionType: 'MCQ',
        optionsBn: ['45 Ω', '15 Ω', '25 Ω', '1.67 Ω'],
        optionsEn: ['45 Ω', '15 Ω', '25 Ω', '1.67 Ω'],
        correctOptionIndex: 0,
        explanationBn:
          'তার টেনে $n$ গুণ লম্বা করলে রোধ $n^2$ গুণ হয়। এখানে $n = 3$, সুতরাং নতুন রোধ $R\' = 3^2 \\times R = 9 \\times 5 = 45\\ \\Omega$। সঠিক উত্তর ক (45 Ω)।',
        explanationEn:
          'Stretching scales resistance as $R\' = n^2 R$. With $n=3$, $R\' = 9 \\times 5 = 45\\ \\Omega$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৪ / রাজশাহী বোর্ড ২০২৩',
      },
      {
        id: 'q2-parallel-equal-resistors',
        questionBn:
          '১২ ওহম ($12\\ \\Omega$) মানের চারটি রোধক সমান্তরাল সংযোগে যুক্ত করলে এদের তুল্য রোধ কত হবে?',
        questionEn:
          'What is the equivalent resistance when four $12\\ \\Omega$ resistors are connected in parallel?',
        questionType: 'MCQ',
        optionsBn: ['3 Ω', '48 Ω', '4 Ω', '6 Ω'],
        optionsEn: ['3 Ω', '48 Ω', '4 Ω', '6 Ω'],
        correctOptionIndex: 0,
        explanationBn:
          'একই মানের $n$ টি রোধ সমান্তরালে থাকলে তুল্য রোধ $R_p = \\frac{R}{n} = \\frac{12}{4} = 3\\ \\Omega$। সঠিক উত্তর ক (3 Ω)।',
        explanationEn:
          'For $n$ identical parallel resistors, $R_p = R/n = 12/4 = 3\\ \\Omega$. Option A is correct.',
        boardSource: 'কুমিল্লা বোর্ড ২০২৩',
      },
      {
        id: 'q3-kwh-joule-equivalence',
        questionBn: '১ কিলোওয়াট-ঘণ্টা (1 kWh) কত জুলের (Joule) সমান?',
        questionEn: 'How many Joules are equivalent to 1 kilowatt-hour (1 kWh)?',
        questionType: 'MCQ',
        optionsBn: ['3.6 × 10⁶ J', '3.6 × 10³ J', '1000 J', '3.6 × 10⁵ J'],
        optionsEn: ['3.6 × 10⁶ J', '3.6 × 10³ J', '1000 J', '3.6 × 10⁵ J'],
        correctOptionIndex: 0,
        explanationBn:
          '$1\\text{ kWh} = 1000\\text{ W} \\times 3600\\text{ s} = 3,600,000\\text{ J} = 3.6 \\times 10^6\\text{ J}$। সঠিক উত্তর ক।',
        explanationEn:
          '$1\\text{ kWh} = 1000\\text{ W} \\times 3600\\text{ s} = 3.6 \\times 10^6\\text{ J}$. Option A is correct.',
        boardSource: 'ময়মনসিংহ বোর্ড ২০২৪',
      },
      {
        id: 'q4-household-circuit-parallel',
        questionBn: 'বাসাবাড়িতে বৈদ্যুতিক বাতি, পাখা ইত্যাদি কোন ধরনের সংযোগে যুক্ত করা হয় এবং কেন?',
        questionEn: 'Which type of circuit combination is used in household electrical wiring and why?',
        questionType: 'MCQ',
        optionsBn: [
          'সমান্তরাল সংযোগ, যাতে প্রতিটি যন্ত্র পূর্ণ ভোল্টেজ পায় ও স্বাধীনভাবে চলে',
          'শ্রেণি সংযোগ, যাতে বিদ্যুৎ বিল কম আসে',
          'শ্রেণি সংযোগ, যাতে একটি সুইচ দিয়ে সব নিয়ন্ত্রণ করা যায়',
          'মিশ্র সংযোগ, যাতে উচ্চ কারেন্ট প্রবাহিত হয়',
        ],
        optionsEn: [
          'Parallel combination, ensuring full voltage and independent operation',
          'Series combination to reduce electricity costs',
          'Series combination so a single switch controls all appliances',
          'Mixed combination to drive high current',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'সমান্তরাল সংযোগে প্রতিটি যন্ত্রের দুই প্রান্তে সম্পূর্ণ মেইন লাইনের বিভব পার্থক্য (২২০V) বজায় থাকে এবং যেকোনো একটি যন্ত্র নষ্ট হলেও অন্যগুলো সচল থাকে। সঠিক উত্তর ক।',
        explanationEn:
          'Parallel wiring ensures all household loads receive full 220V grid voltage with independent branch switches.',
        boardSource: 'সিলেট বোর্ড ২০২৪',
      },
    ],
  },
};
