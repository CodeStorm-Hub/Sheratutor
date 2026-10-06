import { PhysicsChapterFullData } from '../types';

export const CH13_MODERN_PHYSICS_DATA: PhysicsChapterFullData = {
  id: 'ssc-phy-ch13',
  chapterNo: 13,
  subjectCode: 'SSC-PHY',
  titleEn: 'Modern Physics and Electronics',
  titleBn: 'আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স',
  division: 'modern_biomedical',
  divisionTitleEn: 'Modern Physics & Electronics',
  divisionTitleBn: 'আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স',
  iconName: 'Cpu',
  estimatedMinutes: 45,
  boardMarksAllocation: 'CQ ১০ নম্বর (ক: ১, খ: ২, গ: ৩, ঘ: ৪) + MCQ ৩-৪ নম্বর',
  overviewBn:
    'বিংশ শতাব্দীর শুরুতে কোয়ান্টাম তত্ত্ব ও আপেক্ষিকতা তত্ত্বের আবির্ভাবের মাধ্যমে আধুনিক পদার্থবিজ্ঞানের সূচনা হয়। এই অধ্যায়ে তেজস্ক্রিয়তা, অর্ধায়ু ও ক্ষয় সূত্র, সেমিকন্ডাক্টর ডোপিং, পি-এন জংশন ডায়োড, ট্রানজিস্টর এবং ডিজিটাল লজিক গেট বোর্ড পরীক্ষার কঠোর মানদণ্ডে বিশদভাবে অন্তর্ভুক্ত করা হয়েছে।',
  overviewEn:
    'Modern physics emerged with relativity and quantum mechanics in the early 20th century, laying the foundation of solid-state electronics. This chapter covers radioactivity, exponential half-life kinetics, semiconductor doping, p-n junction diodes, transistors, and digital logic gates for SSC examinations.',
  keyTopicsBn: [
    'তেজস্ক্রিয়তা ও আলফা, বিটা, গামা রশ্মি',
    'তেজস্ক্রিয় ক্ষয় ও অর্ধায়ু ($T_{1/2} = 0.693 / \\lambda$)',
    'অর্ধপরিবাহী, ডোপিং ও পি-এন জংশন ডায়োড',
    'রেকটিফিকেশন বা একমুখীকরণ (AC $\\to$ DC)',
    'ট্রানজিস্টর ও বিবর্ধক হিসেবে ব্যবহার',
    'ডিজিটাল ইলেকট্রনিক্স ও লজিক গেট (AND, OR, NOT, NAND)',
  ],
  keyTopicsEn: [
    'Radioactivity & Alpha, Beta, Gamma Emissions',
    'Radioactive Decay & Half-life ($T_{1/2} = 0.693 / \\lambda$)',
    'Semiconductor Doping & p-n Junction Diode',
    'AC to DC Rectification Mechanism',
    'Transistor Construction & Amplification',
    'Digital Electronics & Logic Gates (AND, OR, NOT, NAND)',
  ],
  status: 'available',

  // ----------------------------------------------------
  // STEP 1: Concept Tree
  // ----------------------------------------------------
  step1: {
    summaryBn:
      'আধুনিক ইলেকট্রনিক্সের ভিত্তি হলো সিলিকন সেমিকন্ডাক্টরে ডোপিং এবং তেজস্ক্রিয় পরমাণুর স্বতঃস্ফূর্ত রূপান্তর। ডায়োড একমুখী ভালভ হিসেবে এবং ট্রানজিস্টর বিবর্ধক ও ইলেকট্রনিক সুইচ হিসেবে ব্যবহৃত হয়।',
    summaryEn:
      'Solid-state semiconductor engineering and nuclear transformations underpin modern technology. Diodes function as unidirectional current valves while transistors act as power amplifiers and binary logic switches.',
    nodes: [
      {
        id: 'node-radioactivity-rays',
        titleBn: 'তেজস্ক্রিয়তা ও রশ্মিসমূহ (α, β, γ)',
        titleEn: 'Radioactivity & Nuclear Emissions',
        descriptionBn:
          'ভারী ও অস্থিতিশীল নিউক্লিয়াস থেকে স্বতঃস্ফূর্তভাবে উচ্চ শক্তিসম্পন্ন বিকিরণ নির্গত হয়ে নতুন স্থায়ী নিউক্লিয়াসে রূপান্তরিত হওয়ার ঘটনাকে তেজস্ক্রিয়তা বলে। আলফা ($\\alpha$) হলো হিলিয়াম নিউক্লিয়াস ($+2e$), বিটা ($\\beta$) হলো দ্রুতগামী ইলেকট্রন ($-e$), এবং গামা ($\\gamma$) হলো আধানহীন উচ্চ শক্তির তড়িৎচৌম্বকীয় তরঙ্গ যার ভেদন ক্ষমতা সর্বোচ্চ।',
        descriptionEn:
          'Spontaneous nuclear decay of unstable heavy isotopes emitting alpha particles (He nuclei), beta particles (electrons), and high-penetration uncharged gamma photons.',
        iconName: 'Radio',
        realWorldExampleBn:
          'বাসাবাড়ির ধোঁয়া শনাক্তকারী স্মোক ডিটেক্টরে অ্যামেরিসিয়াম-২৪১ তেজস্ক্রিয় আইসোটোপ ব্যবহৃত হয়।',
        realWorldExampleEn:
          'Household smoke detectors utilize tiny traces of Americium-241 alpha emitters to monitor ambient air ionization.',
        formulaLatex: '\\alpha = {^4_2\\text{He}}^{2+}, \\quad \\beta = {^0_{-1}e}, \\quad \\gamma = h\\nu',
      },
      {
        id: 'node-half-life-kinetics',
        titleBn: 'অর্ধায়ু ($T_{1/2}$) ও ক্ষয় সূত্র',
        titleEn: 'Half-Life & Exponential Decay',
        descriptionBn:
          'যে সময়ে কোনো তেজস্ক্রিয় পদার্থের মোট পরমাণুর ঠিক অর্ধেক পরিমাণ ($N_0/2$) ক্ষয়প্রাপ্ত হয়, তাকে ওই পদার্থের অর্ধায়ু ($T_{1/2}$) বলে। অর্ধায়ু পদার্থের একটি নিজস্ব ধ্রুব বৈশিষ্ট্য, যা চাপ, তাপমাত্রা বা রাসায়নিক বিক্রিয়া দ্বারা পরিবর্তন করা যায় না: $T_{1/2} = \\frac{0.693}{\\lambda}$। $n$ টি অর্ধায়ু পর অবশিষ্ট থাকে $N = N_0 \\left(\\frac{1}{2}\\right)^n$।',
        descriptionEn:
          'Half-life is the time required for half of the radioactive nuclei in a sample to undergo decay: $T_{1/2} = 0.693 / \\lambda$. After $n$ half-lives, remaining fraction is $(1/2)^n$.',
        iconName: 'Clock',
        realWorldExampleBn:
          'কার্বন ডেটিং পদ্ধতিতে প্রাচীন মিশরীয় মমি ও ডাইনোসরের জীবাশ্মের বয়স সঠিকভাবে নির্ণয় করা হয়।',
        realWorldExampleEn:
          'Radiocarbon dating of Carbon-14 ($T_{1/2} = 5730\\text{ yr}$) dates ancient fossils and archaeological artifacts.',
        formulaLatex: 'N = N_0 \\left(\\frac{1}{2}\\right)^{\\frac{t}{T_{1/2}}} \\quad \\Longleftrightarrow \\quad T_{1/2} = \\frac{\\ln 2}{\\lambda} = \\frac{0.693}{\\lambda}',
      },
      {
        id: 'node-semiconductor-doping',
        titleBn: 'অর্ধপরিবাহী ও ডোপিং (p-type & n-type)',
        titleEn: 'Semiconductors & Doping',
        descriptionBn:
          'বিশুদ্ধ অর্ধপরিবাহীতে (সিলিকন বা জার্মেনিয়াম) নিয়ন্ত্রিত মাত্রায় উপযুক্ত অপদ্রব্য পরমাণু মিশিয়ে এর পরিবাহিতা শতগুণ বৃদ্ধি করার প্রক্রিয়াকে ডোপিং বলে। ত্রিযোজী মৌল (বোরন, অ্যালুমিনিয়াম) মেশালে তৈরি হয় p-টাইপ অর্ধপরিবাহী (সংখ্যাগরিষ্ঠ আধান বাহক হোল $h^+$); পঞ্চযোজী মৌল (ফসফরাস, আর্সেনিক) মেশালে তৈরি হয় n-টাইপ অর্ধপরিবাহী (সংখ্যাগরিষ্ঠ আধান বাহক মুক্ত ইলেকট্রন $e^-$)।',
        descriptionEn:
          'Doping introduces trace impurity atoms into pure intrinsic silicon. Trivalent dopants (Boron) produce p-type (majority holes); pentavalent dopants (Phosphorus) produce n-type (majority electrons).',
        iconName: 'Cpu',
        realWorldExampleBn:
          'সোলার প্যানেলের ফটোভোলটাইক সেল মূলত সিলিকনের p-n জংশন দ্বারা তৈরি যা সূর্যের আলোকে বিদ্যুতে রূপান্তর করে।',
        realWorldExampleEn:
          'Solar panels consist of engineered silicon p-n junctions converting incident solar photons into usable electrical current.',
        formulaLatex: '\\text{p-type: Boron (Trivalent)}, \\quad \\text{n-type: Phosphorus (Pentavalent)}',
      },
      {
        id: 'node-diode-rectifier',
        titleBn: 'পি-এন জংশন ডায়োড ও একমুখীকরণ',
        titleEn: 'p-n Junction Diode & Rectification',
        descriptionBn:
          'একটি p-টাইপ ও একটি n-টাইপ অর্ধপরিবাহীকে বিশেষ উপায়ে যুক্ত করলে সংযোগস্থলকে p-n জংশন ডায়োড বলে। p-প্রান্তে ব্যাটারির পজিটিভ ও n-প্রান্তে নেগেটিভ দিলে তাকে সম্মুখী ঝোঁক (Forward Bias) বলে এবং এতে বিদ্যুৎ চলে। উল্টো সংযোগ দিলে তাকে বিমুখী ঝোঁক (Reverse Bias) বলে এবং নিঃশেষিত স্তর প্রশস্ত হয়ে বিদ্যুৎ প্রবাহ বন্ধ করে দেয়। এই ধর্মে পরিবর্তী প্রবাহকে (AC) একমুখী প্রবাহে (DC) রূপান্তর করাকে একমুখীকরণ (Rectification) বলে।',
        descriptionEn:
          'A p-n junction diode conducts current only under forward bias and blocks current under reverse bias, enabling AC to DC rectification.',
        iconName: 'Zap',
        realWorldExampleBn:
          'মোবাইল ফোন ও ল্যাপটপের অ্যাডাপ্টারে ডায়োড রেকটিফায়ার ব্যবহার করে বাসার ২২০V এসি কারেন্টকে ডিসি কারেন্টে রূপান্তর করা হয়।',
        realWorldExampleEn:
          'Smartphone power adapters utilize bridge diode rectifiers to convert household 220V AC into smooth DC output.',
        formulaLatex: '\\text{Forward Bias: Conduction ON}, \\quad \\text{Reverse Bias: Blocked (Depletion Layer Wide)}',
      },
      {
        id: 'node-logic-gates',
        titleBn: 'ডিজিটাল লজিক গেট',
        titleEn: 'Digital Logic Gates',
        descriptionBn:
          'যেসব ইলেকট্রনিক বর্তনী নির্দিষ্ট বুলিয়ান যুক্তি (Boolean Logic) মেনে কাজ করে এবং এক বা একাধিক ইনপুট গ্রহণ করে একটিমাত্র আউটপুট দেয় তাদের লজিক গেট বলে। মৌলিক গেট তিনটি: AND (গুণ), OR (যোগ), NOT (বিপরীত)। সার্বজনীন গেট দুটি: NAND ও NOR।',
        descriptionEn:
          'Logic gates are decision-making binary switching circuits. Fundamental gates: AND (conjunction), OR (disjunction), NOT (inversion). Universal gates: NAND and NOR.',
        iconName: 'Cpu',
        realWorldExampleBn:
          'কম্পিউটারের প্রসেসর ও মাইক্রোচিপ মূলত শত কোটি ন্যানো আকারের লজিক গেটের সমন্বয়ে গঠিত।',
        realWorldExampleEn:
          'Modern computer microprocessors combine billions of nanoscale logic gates on a single silicon die.',
        formulaLatex: 'Y_{\\text{AND}} = A \\cdot B, \\quad Y_{\\text{OR}} = A + B, \\quad Y_{\\text{NOT}} = \\bar{A}',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 2: Interactive Sandbox Configuration
  // ----------------------------------------------------
  step2: {
    simulatorType: 'electronics',
    instructionsBn:
      'তেজস্ক্রিয় আইসোটোপ নির্বাচন করে অর্ধায়ু স্লাইডার টেনে ক্ষয় পর্যবেক্ষণ করো, অথবা ডায়োড মোডে সম্মুখী/বিমুখী ঝোঁক ও ডিজিটাল লজিক গেট পরীক্ষা করো।',
    instructionsEn:
      'Select radioactive isotopes and adjust elapsed half-life periods to observe exponential decay, or test diode biasing and digital logic gates.',
    controls: [
      {
        key: 'halfLifePeriodsElapsed',
        labelBn: 'অতিবাহিত অর্ধায়ুর সংখ্যা (n = t / T½)',
        labelEn: 'Elapsed Half-Lives (n)',
        defaultValue: 1.0,
        min: 0,
        max: 4,
        step: 0.1,
        unit: 'T½',
        descriptionBn: 'কতটি অর্ধায়ু সময় পার হয়েছে',
      },
      {
        key: 'initialAtoms',
        labelBn: 'প্রাথমিক পরমাণু সংখ্যা ($N_0$)',
        labelEn: 'Initial Atoms ($N_0$)',
        defaultValue: 1000,
        min: 100,
        max: 10000,
        step: 100,
        unit: 'পরমাণু',
        descriptionBn: 'শুরুতে থাকা অস্থিতিশীল পরমাণু সংখ্যা',
      },
    ],
    keyObservationTipBn:
      'বোর্ড পরীক্ষায় প্রায়ই প্রশ্ন আসে "২টি অর্ধায়ু পর কতটুকু ক্ষয়প্রাপ্ত হবে?" ছাত্রছাত্রীরা ২৫% উত্তর লেখে যা সম্পূর্ণ ভুল! ২৫% অবশিষ্ট থাকে ($N$), কিন্তু ক্ষয়প্রাপ্ত হয় (১০০% - ২৫%) = ৭৫%! উদ্দীপকে "অবশিষ্ট" চেয়েছে নাকি "ক্ষয়প্রাপ্ত" চেয়েছে তা নিশ্চিত করো।',
    keyObservationTipEn:
      'Examiners frequently ask for decayed fraction rather than remaining fraction. After 2 half-lives, 25% remains ($N/N_0 = 0.25$) while 75% has decayed ($1 - 0.25 = 0.75$).',
  },

  // ----------------------------------------------------
  // STEP 3: Pattern & Formula Decoder
  // ----------------------------------------------------
  step3: {
    coreFormulaLatex:
      'N = N_0 \\left(\\frac{1}{2}\\right)^{\\frac{t}{T_{1/2}}} = N_0 e^{-\\lambda t} \\quad \\Longleftrightarrow \\quad T_{1/2} = \\frac{0.693}{\\lambda}',
    variableDefinitions: [
      {
        symbol: 'N',
        nameBn: 't সময় পর অবশিষ্ট অবিভাজিত পরমাণুর সংখ্যা',
        nameEn: 'Remaining Undecayed Nuclei',
        siUnit: 'এককহীন (সংখ্যা)',
      },
      {
        symbol: 'N_0',
        nameBn: 'আদি বা প্রারম্ভিক পরমাণুর সংখ্যা',
        nameEn: 'Initial Nuclei Count',
        siUnit: 'এককহীন (সংখ্যা)',
      },
      {
        symbol: 'T_{1/2}',
        nameBn: 'অর্ধায়ু (Half-Life)',
        nameEn: 'Half-Life',
        siUnit: 'সেকেন্ড / দিন / বছর',
      },
      {
        symbol: 't',
        nameBn: 'মোট অতিবাহিত সময়কাল',
        nameEn: 'Total Elapsed Time',
        siUnit: 'সেকেন্ড / দিন / বছর',
      },
      {
        symbol: '\\lambda',
        nameBn: 'ক্ষয় ধ্রুবক (Decay Constant)',
        nameEn: 'Decay Constant',
        siUnit: '$\\text{s}^{-1}$ বা $\\text{year}^{-1}$',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'তেজস্ক্রিয় ক্ষয়ের সূচকীয় সূত্র ও অর্ধায়ুর সংজ্ঞা',
        labelEn: 'Radioactive Exponential Decay & Half-Life Definition',
        latexExpression:
          'N = N_0 e^{-\\lambda t} \\quad \\text{যখন } t = T_{1/2}, \\, N = \\frac{N_0}{2} \\implies \\frac{1}{2} = e^{-\\lambda T_{1/2}}',
        explanationBn:
          'অর্ধায়ু সময়ে পরমাণুর সংখ্যা ঠিক অর্ধেক হয়ে যায়। উভয় পক্ষে প্রাকৃতিক লগারিদম ($\\ln$) নিলে সম্পর্কটি স্পষ্ট হয়।',
        explanationEn:
          'At $t = T_{1/2}$, surviving population is precisely $N_0/2$. Taking natural logarithms resolves half-life kinetics.',
      },
      {
        stepNumber: 2,
        labelBn: 'ক্ষয় ধ্রুবক ও অর্ধায়ুর সম্পর্ক নিষ্পত্তি',
        labelEn: 'Decay Constant and Half-Life Resolution',
        latexExpression:
          '\\ln(2) = \\lambda T_{1/2} \\implies T_{1/2} = \\frac{\\ln 2}{\\lambda} \\approx \\frac{0.693}{\\lambda}',
        explanationBn:
          'যেহেতু $\\ln(2) \\approx 0.69315$, তাই অর্ধায়ু বের করতে ০.৬৯৩ কে ক্ষয় ধ্রুবক $\\lambda$ দিয়ে ভাগ করতে হয়।',
        explanationEn:
          'Since $\\ln(2) \\approx 0.693$, half-life is universally related to decay constant by $T_{1/2} = 0.693 / \\lambda$.',
      },
      {
        stepNumber: 3,
        labelBn: 'পূর্ণ অর্ধায়ুর সংখ্যার ক্ষেত্রে সংক্ষিপ্ত সূত্র',
        labelEn: 'Integer Half-Life Step Reduction Formulation',
        latexExpression:
          'N = \\frac{N_0}{2^n} \\quad \\text{যেখানে } n = \\frac{t}{T_{1/2}} \\text{ (অর্ধায়ুর সংখ্যা)}',
        explanationBn:
          'ক্যালকুলেটর ছাড়া দ্রুত এমসিকিউ সমাধানের জন্য এই শর্টকাট সূত্রটি বোর্ড পরীক্ষার্থীদের জন্য অত্যন্ত কার্যকর।',
        explanationEn:
          'For discrete half-life cycles $n$, sample remaining count simply halves successively: $N = N_0 / 2^n$.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'চিকিৎসায় ব্যবহৃত একটি তেজস্ক্রিয় আইসোটোপের অর্ধায়ু ৮ দিন। (ক) আইসোটোপটির ক্ষয় ধ্রুবক ($\\lambda$) কত? (খ) ২৪ দিন পর উক্ত নমুনার শতকরা কত ভাগ পরমাণু ক্ষয়প্রাপ্ত হবে?',
      problemEn:
        'A medical radioactive isotope has a half-life of 8 days. (a) Determine its decay constant ($\\lambda$). (b) What percentage of the initial nuclei will have decayed after 24 days?',
      solutionStepsBn: [
        '১. অর্ধায়ু $T_{1/2} = 8\\text{ দিন} = 8 \\times 86400\\text{ s} = 691200\\text{ s}$ (অথবা দিনে হিসাব রাখা যায়)।',
        '২. ক্ষয় ধ্রুবক: $\\lambda = \\frac{0.693}{T_{1/2}} = \\frac{0.693}{8\\text{ দিন}} \\approx 0.0866\\text{ দিন}^{-1}$ (এসআই এককে $\\lambda = \\frac{0.693}{691200} \\approx 1.002 \\times 10^{-6}\\text{ s}^{-1}$)।',
        '৩. অতিবাহিত অর্ধায়ুর সংখ্যা: $n = \\frac{t}{T_{1/2}} = \\frac{24\\text{ দিন}}{8\\text{ দিন}} = 3$ টি অর্ধায়ু।',
        '৪. ২৪ দিন পর অবশিষ্ট পরমাণুর ভগ্নাংশ: $\\frac{N}{N_0} = \\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8} = 0.125 = 12.5\\%$।',
        '৫. অতএব ক্ষয়প্রাপ্ত অংশের শতকরা হার: $100\\% - 12.5\\% = 87.5\\%$।',
      ],
      solutionStepsEn: [
        '1. Half-life: $T_{1/2} = 8\\text{ days}$.',
        '2. Decay constant: $\\lambda = 0.693 / 8 = 0.0866\\text{ day}^{-1} = 1.002 \\times 10^{-6}\\text{ s}^{-1}$.',
        '3. Number of half-lives: $n = 24 / 8 = 3$.',
        '4. Fraction remaining: $N/N_0 = (1/2)^3 = 1/8 = 12.5\\%$.',
        '5. Fraction decayed: $100\\% - 12.5\\% = 87.5\\%$.',
      ],
      finalAnswerWithUnit: '\\lambda = 0.0866\\text{ দিন}^{-1}, \\quad \\text{ক্ষয়প্রাপ্ত অংশ} = 87.5\\%',
    },
  },

  // ----------------------------------------------------
  // STEP 4: Board Traps (Examiner Mark Deductions)
  // ----------------------------------------------------
  step4: {
    traps: [
      {
        id: 'trap-1-decayed-vs-remaining',
        titleBn: '"ক্ষয়প্রাপ্ত" পরমাণু আর "অবশিষ্ট" পরমাণু গুলিয়ে ফেলা',
        titleEn: 'Confusing Decayed Percentage with Remaining Percentage',
        lostMarks: 1,
        frequentlyTestedIn: 'গ ও ঘ-অংশ',
        commonMistakeBn:
          'প্রশ্নে চায় "কত শতাংশ ক্ষয়প্রাপ্ত হয়েছে?", কিন্তু পরীক্ষার্থী $N/N_0 = 12.5\\%$ বের করেই অংক শেষ করে দেয়!',
        commonMistakeEn:
          'Stopping at remaining fraction $12.5\\%$ when the question explicitly asks for decayed fraction.',
        correctApproachBn:
          'সর্বদা মনে রাখবে: সূত্রের $N$ হলো যা "অবশিষ্ট বা অক্ষত আছে"। আর ক্ষয়প্রাপ্ত অংশ হলো $(N_0 - N)$। তাই ক্ষয়প্রাপ্ত শতাংশ = $100\\% - (N/N_0 \\times 100\\%)$।',
        correctApproachEn:
          'Formula yields remaining nuclei $N$. Decayed fraction is strictly $(N_0 - N)/N_0 = 1 - N/N_0$.',
        examinerSecretTipBn:
          'বোর্ডের গ-অংশে এটি পরীক্ষকদের সবচেয়ে প্রিয় ফাঁদ। প্রশ্নটি মনোযোগ দিয়ে ২ বার পড়বে: "অবশিষ্ট" নাকি "ক্ষয়প্রাপ্ত"।',
        examinerSecretTipEn:
          'Standard board pitfall. Always subtract remaining percentage from 100% if asked for decayed amount.',
      },
      {
        id: 'trap-2-doping-valency-confusion',
        titleBn: 'p-টাইপ ও n-টাইপ ডোপিংয়ের যোজ্যতা উল্টো লেখা',
        titleEn: 'Swapping Trivalent and Pentavalent Impurity Doping',
        lostMarks: 1,
        frequentlyTestedIn: 'ক ও খ-অংশ',
        commonMistakeBn:
          'ছাত্রছাত্রীরা মনে করে p-টাইপে পঞ্চযোজী (যেহেতু p দিয়ে প-ঞ্চযোজী শুরু!) এবং n-টাইপে ত্রিযোজী মেশানো হয়!',
        commonMistakeEn:
          'Mnemonic misfire: Assuming p-type uses pentavalent dopants due to initial letter.',
        correctApproachBn:
          'ঠিক উল্টো: p-টাইপে ত্রিযোজী (বোরন, অ্যালুমিনিয়াম) যার ফলে একটি ইলেকট্রনের ঘাটতিতে "হোল" (ধনাত্মক ফাঁকা স্থান) তৈরি হয়। আর n-টাইপে পঞ্চযোজী (ফসফরাস, আর্সেনিক) যার ফলে একটি "অতিরিক্ত মুক্ত ইলেকট্রন" তৈরি হয়।',
        correctApproachEn:
          'Opposite: p-type uses trivalent dopants creating positive holes; n-type uses pentavalent dopants adding free electrons.',
        examinerSecretTipBn:
          'মনে রাখবে: "প" তে p-টাইপ = "তি" তে ত্রিযোজী (p-3)। n-টাইপ = ৫ (n-5)।',
        examinerSecretTipEn:
          'Examiners penalize swapped dopant valencies with immediate 1-mark deduction.',
      },
      {
        id: 'trap-3-diode-reverse-bias-infinite-resistance',
        titleBn: 'ডায়োডের বিমুখী ঝোঁকে কারেন্ট চলার ভুল ধারণা',
        titleEn: 'Assuming Current Flows Under Reverse Biased Diode',
        lostMarks: 1,
        frequentlyTestedIn: 'খ ও গ-অংশ',
        commonMistakeBn:
          'ডায়োড উল্টো লাগানো থাকা সত্ত্বেও সাধারণ রোধের মতো ওহমের সূত্র খাটিয়ে কারেন্ট বের করে ফেলা।',
        commonMistakeEn:
          'Applying Ohm’s law to a reverse-biased diode as if it were a linear conductor.',
        correctApproachBn:
          'আদর্শ ডায়োড বিমুখী ঝোঁকে অসীম রোধ প্রদর্শন করে এবং কোনো কারেন্ট প্রবাহিত হতে দেয় না ($I = 0\\text{ A}$)। ফলে বর্তনীর সকল উপাদান বন্ধ থাকবে।',
        correctApproachEn:
          'Ideal reverse-biased diodes provide infinite impedance, completely cutting circuit current to 0A.',
        examinerSecretTipBn:
          'বোর্ডের বর্তনী চিত্রে ডায়োডের তীর চিহ্নের দিক খেয়াল করো। ব্যাটারির পজিটিভ ডায়োডের খাড়া দাগের সাথে যুক্ত থাকলে তা রিভার্স বায়াস।',
        examinerSecretTipEn:
          'Inspect diode symbol direction carefully: if positive terminal connects to cathode bar, it is reverse biased.',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 5: Rapid Board Quiz
  // ----------------------------------------------------
  step5: {
    quizzes: [
      {
        id: 'q1-radioactive-halflife-decayed-fraction',
        questionBn:
          'কোনো তেজস্ক্রিয় মৌলের অর্ধায়ু ১০ দিন হলে ৩০ দিন পর ওই নমুনার কত শতাংশ ক্ষয়প্রাপ্ত হবে?',
        questionEn:
          'If a radioactive element has a half-life of 10 days, what percentage will have decayed after 30 days?',
        questionType: 'MCQ',
        optionsBn: ['87.5%', '12.5%', '75%', '25%'],
        optionsEn: ['87.5%', '12.5%', '75%', '25%'],
        correctOptionIndex: 0,
        explanationBn:
          '৩০ দিনে অর্ধায়ু অতিবাহিত হয় $n = 30/10 = 3$ টি। ৩টি অর্ধায়ু পর অবশিষ্ট থাকে $(1/2)^3 = 1/8 = 12.5\\%$। সুতরাং ক্ষয়প্রাপ্ত হয় $100\\% - 12.5\\% = 87.5\\%$। সঠিক উত্তর ক (87.5%)।',
        explanationEn:
          '3 half-lives elapse. Remaining is $(1/2)^3 = 12.5\\%$. Decayed fraction is $100\\% - 12.5\\% = 87.5\\%$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৪ / দিনাজপুর বোর্ড ২০২৩',
      },
      {
        id: 'q2-gamma-ray-nature',
        questionBn: 'তেজস্ক্রিয় গামা (γ) রশ্মির প্রকৃতি নিচের কোনটি?',
        questionEn: 'Which of the following describes the fundamental nature of radioactive gamma (γ) rays?',
        questionType: 'MCQ',
        optionsBn: [
          'আধানহীন উচ্চ কম্পাঙ্কের তড়িৎচৌম্বকীয় তরঙ্গ',
          'দ্বি-ধনাত্মক হিলিয়াম নিউক্লিয়াস',
          'দ্রুতগামী ঋণাত্মক ইলেকট্রন কণা',
          'ধনাত্মক প্রোটন কণার স্রোত',
        ],
        optionsEn: [
          'Uncharged high-frequency electromagnetic radiation',
          'Doubly-charged helium nuclei',
          'High-speed negative electron particles',
          'Stream of positive protons',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'গামা রশ্মি কোনো কণা নয়, এটি অত্যন্ত উচ্চ কম্পাঙ্কের আধানহীন তড়িৎচৌম্বকীয় তরঙ্গ। এর ভেদন ক্ষমতা আলফা ও বিটা রশ্মির চেয়ে অনেক বেশি। সঠিক উত্তর ক।',
        explanationEn:
          'Gamma rays are uncharged high-frequency electromagnetic radiation possessing the highest penetration power. Option A is correct.',
        boardSource: 'রাজশাহী বোর্ড ২০২৪',
      },
      {
        id: 'q3-p-type-semiconductor-majority-carrier',
        questionBn: 'p-টাইপ অর্ধপরিবাহীতে প্রধান আধান পরিবাহক (Majority Charge Carrier) কোনটি?',
        questionEn: 'What is the majority charge carrier in a p-type semiconductor?',
        questionType: 'MCQ',
        optionsBn: [
          'হোল (Holes)',
          'মুক্ত ইলেকট্রন (Free Electrons)',
          'প্রোটন (Protons)',
          'ধনাত্মক আয়ন (Positive Ions)',
        ],
        optionsEn: [
          'Holes',
          'Free Electrons',
          'Protons',
          'Positive Ions',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'সিলিকনে ত্রিযোজী অপদ্রব্য (বোরন) ডোপিং করলে ইলেকট্রনের ঘাটতির কারণে বিপুল পরিমাণ ধনাত্মক হোলের সৃষ্টি হয়, যা p-টাইপের প্রধান আধান বাহক। সঠিক উত্তর ক।',
        explanationEn:
          'Trivalent doping creates an abundance of positive electron-deficiency vacancies known as holes. Option A is correct.',
        boardSource: 'যশোর বোর্ড ২০২৩',
      },
      {
        id: 'q4-universal-logic-gate',
        questionBn: 'নিচের কোনটি সার্বজনীন লজিক গেট (Universal Logic Gate)?',
        questionEn: 'Which of the following is a Universal Logic Gate?',
        questionType: 'MCQ',
        optionsBn: ['NAND গেট', 'AND গেট', 'OR গেট', 'NOT গেট'],
        optionsEn: ['NAND Gate', 'AND Gate', 'OR Gate', 'NOT Gate'],
        correctOptionIndex: 0,
        explanationBn:
          'NAND ও NOR গেটকে সার্বজনীন গেট বলা হয়, কারণ এদের যেকোনো একটি এককভাবে ব্যবহার করে অন্য যেকোনো মৌলিক বা জটিল লজিক গেট তৈরি করা সম্ভব। সঠিক উত্তর ক।',
        explanationEn:
          'NAND and NOR gates are universal because any Boolean logic function can be constructed using them exclusively.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৪',
      },
    ],
  },
};
