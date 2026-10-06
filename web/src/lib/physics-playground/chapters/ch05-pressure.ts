import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 5)!;

export const CH05_PRESSURE_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'কোনো তলের একক ক্ষেত্রফলের ওপর লম্বভাবে প্রযুক্ত বলকে চাপ ($P = F/A$) বলে। তরলের অভ্যন্তরে চাপ গভীরতা ও ঘনত্বের ওপর নির্ভরশীল ($P = h\\rho g$)। পাস্কেলের নীতিতে আবদ্ধ পাত্রে চাপ চারদিকে সমানভাবে সঞ্চালিত হয়, এবং আর্কিমিডিসের সূত্রে বস্তুর অপসারিত তরলের ওজনের সমান প্লবতা লাভ করে।',
    summaryEn:
      'Pressure is force applied perpendicular to unit surface area ($P = F/A$). Hydrostatic pressure scales with depth and density ($P = h\rho g$). Pascal’s law governs hydraulic force multipliers, while Archimedes’ principle explains buoyant upthrust ($F_B = V\rho g$) and floatation.',
    nodes: [
      {
        id: 'c5-pressure-definition',
        titleBn: 'চাপ ও ঘনত্বের মৌলিক ধারণা',
        titleEn: 'Pressure & Density Fundamentals',
        descriptionBn:
          'ক্ষেত্রফল যত কমে, একই বলের জন্য প্রযুক্ত চাপ তত বৃদ্ধি পায় ($P = F/A$)। এসআই এককে চাপের একক প্যাসকেল ($1\\text{ Pa} = 1\\text{ N/m}^2$)। কোনো পদার্থের একক আয়তনের ভরকে তার ঘনত্ব বলে ($\\rho = m/V$)। পানির ঘনত্ব $1000\\text{ kg/m}^3$।',
        descriptionEn:
          'Decreasing contact area increases pressure for a given force ($P = F/A$). SI unit is Pascal ($1\text{ Pa} = 1\text{ N/m}^2$). Density is mass per unit volume ($\rho = m/V$). Water density is $1000\text{ kg/m}^3$.',
        formulaLatex: 'P = \\frac{F}{A}, \\quad \\rho = \\frac{m}{V}',
        realWorldExampleBn:
          'ছুঁচালো পেরেকের অগ্রভাগের ক্ষেত্রফল অত্যন্ত কম হওয়ায় হাতুড়ির হালকা আঘাতেই তা কাঠের দেয়াল ভেদ করে সহজে ঢুকে যায়।',
        realWorldExampleEn:
          'A sharp nail penetrates wood effortlessly because its tiny tip area concentrates striking force into massive pressure.',
      },
      {
        id: 'c5-liquid-pressure',
        titleBn: 'স্থির তরলের অভ্যন্তরে চাপ',
        titleEn: 'Hydrostatic Pressure in Liquids',
        descriptionBn:
          'স্থির তরলে $h$ গভীরতায় কোনো বিন্দুতে চাপ নির্ভর করে কেবল গভীরতা ($h$), তরলের ঘনত্ব ($\\rho$) এবং অভিকর্ষজ ত্বরণ ($g$) এর ওপর। পাত্রের আকার বা আকৃতির ওপর তরলের চাপ নির্ভর করে না (হাইড্রোস্ট্যাটিক প্যারাডক্স)।',
        descriptionEn:
          'Pressure at depth $h$ in a static fluid depends solely on depth, fluid density, and gravity ($P = h\rho g$), independent of vessel geometry.',
        formulaLatex: 'P = h\\rho g',
        realWorldExampleBn:
          'নদীর তলদেশে পানির বাঁধের প্রাচীর উপরের অংশের চেয়ে গোড়ায় অনেক বেশি পুরু ও চওড়া করে তৈরি করা হয়, কারণ গভীরতা বাড়ার সাথে সাথে পানির চাপ প্রচণ্ড বৃদ্ধি পায়।',
        realWorldExampleEn:
          'Hydroelectric dam bases are designed dramatically thicker than their tops because hydrostatic pressure increases with depth.',
      },
      {
        id: 'c5-pascal-law',
        titleBn: 'পাস্কেলের সূত্র ও বল বৃদ্ধিকরণ নীতি',
        titleEn: 'Pascal’s Law & Force Multiplication',
        descriptionBn:
          'একটি আবদ্ধ তরল বা গ্যাসীয় পাত্রের কোনো অংশে বাইরে থেকে চাপ প্রয়োগ করলে সেই চাপ কিছুমাত্র না কমে চারদিকে সমানভাবে সঞ্চালিত হয়। এই নীতির ওপর ভিত্তি করে হাইড্রোলিক প্রেস, হাইড্রোলিক ব্রেক ও জ্যাক কাজ করে। পিস্টনের ক্ষেত্রফলের অনুপাতে বল বহুগুণ বৃদ্ধি পায়: $\\frac{F_2}{F_1} = \\frac{A_2}{A_1}$।',
        descriptionEn:
          'Pressure applied to an enclosed static fluid transmits undiminished in all directions. Hydraulic presses leverage area ratios to multiply force: $F_2 / F_1 = A_2 / A_1$.',
        formulaLatex: '\\frac{F_2}{F_1} = \\frac{A_2}{A_1} = \\frac{\\pi r_2^2}{\\pi r_1^2} = \\left(\\frac{r_2}{r_1}\\right)^2',
        realWorldExampleBn:
          'গাড়ির সার্ভিসে সার্ভিসিং স্টেশনে একজন মেকানিক সাধারণ ফুট-পাম্পের সাহায্যে বাতাস বা তরলে অল্প বল দিয়ে আস্ত একটা ভারী গাড়িকে আকাশে তুলে ফেলে।',
        realWorldExampleEn:
          'Hydraulic car lifts raise two-ton vehicles using modest human pedal forces via area multiplication.',
      },
      {
        id: 'c5-archimedes-buoyancy',
        titleBn: 'আর্কিমিডিসের নীতি ও প্লবতা (Buoyant Force)',
        titleEn: 'Archimedes’ Principle & Buoyancy',
        descriptionBn:
          'কোনো বস্তুকে স্থির তরলে আংশিক বা সম্পূর্ণ নিমজ্জিত করলে বস্তুটি কিছু ওজন হারায় বলে মনে হয়। এই হারানো ওজন বস্তুর দ্বারা অপসারিত তরলের ওজনের সমান। তরল বস্তুটির ওপর যে নিট ঊর্ধ্বমুখী লব্ধি বল প্রয়োগ করে তাকে প্লবতা বলে: $F_B = V\\rho g$।',
        descriptionEn:
          'A body immersed in fluid experiences an upward buoyant force equal to the weight of fluid displaced ($F_B = V\rho g$). Loss of weight equals displaced fluid weight.',
        formulaLatex: 'F_B = V_{\\text{sub}}\\rho_{\\text{liquid}}g, \\quad W_{\\text{apparent}} = W - F_B',
        realWorldExampleBn:
          'হাজার হাজার টন ওজনের লোহার বিশাল জাহাজ সমুদ্রে ভেসে থাকে কারণ জাহাজের ফাঁপা কাঠামোর কারণে তা নিজের ওজনের চেয়ে বেশি ওজনের পানি অপসারণ করে।',
        realWorldExampleEn:
          'Massive steel cargo ships float because their hollow hull displaces a volume of water whose weight exceeds the ship’s own weight.',
      },
    ],
  },
  step2: {
    simulatorType: 'pressure',
    instructionsBn:
      '১ম ট্যাবে পাস্কেলের হাইড্রোলিক প্রেসে পিস্টনের ব্যাসার্ধ ও প্রযুক্ত বল বাড়িয়ে দেখো কীভাবে বল বহুগুণ গুণিতক হারে বাড়ে। ২য় ট্যাবে বিভিন্ন তরল (পানি, কেরোসিন) ও বস্তুর ঘনত্ব পরিবর্তন করে ভাসন ও নিমজ্জনের শর্ত পর্যবেক্ষণ করো।',
    instructionsEn:
      'In Tab 1, adjust piston radii and applied force to watch force multiply. In Tab 2, alter liquid and object densities to observe floatation vs sinking conditions.',
    controls: [
      {
        key: 'appliedForceF1',
        labelBn: 'ছোট পিস্টনে বল F₁ (নিউটন)',
        labelEn: 'Input Force F₁ (N)',
        defaultValue: 100,
        min: 20,
        max: 500,
        step: 10,
        unit: 'N',
      },
      {
        key: 'radiusR2Cm',
        labelBn: 'বড় পিস্টনের ব্যাসার্ধ r₂ (সে.মি.)',
        labelEn: 'Piston 2 Radius r₂ (cm)',
        defaultValue: 20,
        min: 10,
        max: 40,
        step: 2,
        unit: 'cm',
      },
    ],
    keyObservationTipBn:
      'বোর্ডের সৃজনশীলে পিস্টনের ব্যাসার্ধের বদলে ব্যাস দেওয়া থাকে! মনে রাখবে: ক্ষেত্রফলের অনুপাত ব্যাসার্ধ বা ব্যাস উভয়েরই বর্গের সমানুপাতিক: $\\frac{A_2}{A_1} = \\left(\\frac{r_2}{r_1}\\right)^2 = \\left(\\frac{d_2}{d_1}\\right)^2$। কিন্তু এককে সে.মি. থাকলে অবশ্যই মিটারে নিতে হবে।',
    keyObservationTipEn:
      'Board examiners often provide piston diameter instead of radius. The ratio scales with diameter squared: $A_2 / A_1 = (d_2 / d_1)^2$. Always convert centimeters to meters.',
  },
  step3: {
    coreFormulaLatex: '\\frac{F_2}{F_1} = \\frac{A_2}{A_1} = \\left(\\frac{r_2}{r_1}\\right)^2 \\quad \\text{এবং} \\quad F_B = V\\rho g',
    variableDefinitions: [
      {
        symbol: 'F_1, F_2',
        nameBn: '১ম ও ২য় পিস্টনের বল',
        nameEn: 'Piston 1 and Piston 2 Forces',
        siUnit: 'N \\text{ (Newton)}',
      },
      {
        symbol: 'A_1, A_2',
        nameBn: 'পিস্টনদ্বয়ের প্রস্থচ্ছেদের ক্ষেত্রফল',
        nameEn: 'Cross-sectional Areas of Pistons',
        siUnit: 'm^2',
      },
      {
        symbol: 'F_B',
        nameBn: 'ঊর্ধ্বমুখী প্লবতা বল',
        nameEn: 'Buoyant Upthrust',
        siUnit: 'N',
      },
      {
        symbol: 'V',
        nameBn: 'অপসারিত তরলের আয়তন',
        nameEn: 'Volume of Displaced Liquid',
        siUnit: 'm^3',
      },
      {
        symbol: '\\rho',
        nameBn: 'তরলের ঘনত্ব',
        nameEn: 'Density of Fluid',
        siUnit: 'kg/m^3',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'পাস্কেলের সূত্র অনুযায়ী চাপের সমতা',
        labelEn: 'Pressure Equivalence via Pascal’s Law',
        latexExpression: 'P_1 = P_2 \\implies \\frac{F_1}{A_1} = \\frac{F_2}{A_2}',
        explanationBn:
          'আবদ্ধ তরলের সর্বত্র চাপ সমান সঞ্চালিত হয়, তাই উভয় পিস্টনে তরলের চাপ সমান।',
        explanationEn:
          'Pressure is identical across connected static fluid: $P_1 = P_2$.',
      },
      {
        stepNumber: 2,
        labelBn: 'বল বৃদ্ধির সমীকরণ স্থাপন',
        labelEn: 'Deriving Output Force Multiplication',
        latexExpression: 'F_2 = F_1 \\times \\left(\\frac{A_2}{A_1}\\right) = F_1 \\times \\left(\\frac{\\pi r_2^2}{\\pi r_1^2}\\right) = F_1 \\left(\\frac{r_2}{r_1}\\right)^2',
        explanationBn:
          'পিস্টনদ্বয় বৃত্তাকার হওয়ায় ক্ষেত্রফলের অনুপাত ব্যাসার্ধের বর্গের সমানুপাতিক।',
        explanationEn:
          'For circular pistons, area ratio reduces to the square of radius ratio.',
      },
      {
        stepNumber: 3,
        labelBn: 'কাজ ও শক্তির নিত্যতা যাচাই',
        labelEn: 'Work & Energy Conservation Verification',
        latexExpression: 'A_1 l_1 = A_2 l_2 \\implies F_1 l_1 = F_2 l_2',
        explanationBn:
          'তরলের আয়তন অপনোদনের সমতার কারণে কৃতকাজ সংরক্ষিত থাকে। বল বৃদ্ধি পেলেও অতিরিক্ত শক্তি সৃষ্টি হয় না।',
        explanationEn:
          'Incompressible liquid volume displacement conservation proves that work input equals work output.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'একটি হাইড্রোলিক প্রেসের ছোট পিস্টনের ব্যাসার্ধ $5\\text{ cm}$ এবং বড় পিস্টনের ব্যাসার্ধ $25\\text{ cm}$। ছোট পিস্টনে $200\\text{ N}$ বল প্রয়োগ করলে বড় পিস্টনে কত ঊর্ধ্বমুখী বল পাওয়া যাবে এবং এটি দিয়ে কি $500\\text{ kg}$ ভরের একটি বস্তু তোলা সম্ভব?',
      problemEn:
        'A hydraulic press has piston radii $r_1 = 5\\text{ cm}$ and $r_2 = 25\\text{ cm}$. If $200\\text{ N}$ is applied to the small piston, find the lifting force and check whether it can lift a $500\\text{ kg}$ mass.',
      solutionStepsBn: [
        '১. প্রদত্ত উপাত্ত: $r_1 = 5\\text{ cm} = 0.05\\text{ m}, r_2 = 25\\text{ cm} = 0.25\\text{ m}, F_1 = 200\\text{ N}$',
        '২. সূত্র লিখি: $F_2 = F_1 \\times \\left(\\frac{r_2}{r_1}\\right)^2$',
        '৩. মান বসাই: $F_2 = 200 \\times \\left(\\frac{0.25}{0.05}\\right)^2 = 200 \\times (5)^2 = 200 \\times 25 = 5000\\text{ N}$',
        '৪. বস্তুর ওজন: $W = mg = 500 \\times 9.8 = 4900\\text{ N}$',
        '৫. সিদ্ধান্ত: যেহেতু প্রাপ্ত ঊর্ধ্বমুখী বল $F_2 (5000\\text{ N}) > W (4900\\text{ N})$, সুতরাং বস্তুটি তোলা সম্ভব হবে।',
      ],
      solutionStepsEn: [
        '1. Given: $r_1 = 0.05\\text{ m}, r_2 = 0.25\\text{ m}, F_1 = 200\\text{ N}$',
        '2. Formula: $F_2 = F_1 (r_2 / r_1)^2$',
        '3. Substitute: $F_2 = 200 \\times (25 / 5)^2 = 200 \\times 25 = 5000\\text{ N}$',
        '4. Object weight: $W = mg = 500 \\times 9.8 = 4900\\text{ N}$',
        '5. Conclusion: Since output force $F_2 (5000\\text{ N}) > W (4900\\text{ N})$, it can successfully lift the object.',
      ],
      finalAnswerWithUnit: 'F_2 = 5000\\text{ N} \\quad (\\text{বস্তুটি তোলা সম্ভব})',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-piston-diameter-vs-radius',
        titleBn: 'পিস্টনের ব্যাসকে সরাসরি ব্যাসার্ধ ধরে ক্ষেত্রফল বের করা',
        titleEn: 'Using Piston Diameter as Radius in Area Formula',
        lostMarks: 2,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক ৩ নম্বর)',
        commonMistakeBn:
          'উদ্দীপকে লেখা থাকে "পিস্টনের ব্যাস $10\\text{ cm}$", ছাত্রছাত্রীরা সরাসরি $\\pi(10)^2$ লিখে ফেলে!',
        commonMistakeEn:
          'Plugging diameter $d$ into $\pi r^2$ without dividing by 2 to obtain radius.',
        correctApproachBn:
          'ব্যাস $d$ দেওয়া থাকলে ব্যাসার্ধ $r = d / 2$ বের করে নেবে, অথবা সরাসরি ক্ষেত্রফলের সূত্র লিখবে $A = \\frac{\\pi d^2}{4}$।',
        correctApproachEn:
          'Always halve the diameter to get radius $r = d / 2$, or utilize $A = \pi d^2 / 4$.',
        examinerSecretTipBn:
          'প্রশ্নে চোখ বুলিয়ে দাগ দাও: "ব্যাস" লেখা নাকি "ব্যাসার্ধ"। এই এক ভুলের জন্য প্রতি বছর হাজার হাজার পরীক্ষার্থীর ২ নম্বর কাটা যায়।',
        examinerSecretTipEn:
          'Underline the word "diameter" vs "radius" immediately when reading the exam stimulus.',
      },
      {
        id: 'trap-2-cm3-to-m3-conversion',
        titleBn: 'ঘন সেন্টিমিটার (cm³) কে ঘনমিটারে (m³) রূপান্তরের ঘাত ভুল করা',
        titleEn: 'Incorrect Exponential Factor when Converting cm³ to m³',
        lostMarks: 1,
        frequentlyTestedIn: 'গ ও ঘ-অংশ',
        commonMistakeBn:
          'আয়তন $400\\text{ cm}^3$ থাকলে ছাত্রছাত্রীরা $400 \\times 10^{-2}$ বা $10^{-3}$ দিয়ে গুণ করে বসে!',
        commonMistakeEn:
          'Multiplying $cm^3$ by $10^{-2}$ or $10^{-3}$ instead of $(10^{-2})^3 = 10^{-6}$.',
        correctApproachBn:
          '$1\\text{ m} = 100\\text{ cm} = 10^2\\text{ cm} \\implies 1\\text{ m}^3 = (10^2)^3\\text{ cm}^3 = 10^6\\text{ cm}^3$। সুতরাং $1\\text{ cm}^3 = 10^{-6}\\text{ m}^3$।',
        correctApproachEn:
          'Since $1\text{ m} = 100\text{ cm}$, volume conversion scales by $(10^{-2})^3 = 10^{-6}\text{ m}^3$.',
        examinerSecretTipBn:
          'আয়তন মানেই দৈর্ঘ্যের কিউব বা ঘন ($L^3$), তাই রূপান্তরও হবে $10^{-6}$।',
        examinerSecretTipEn:
          'Always remember volume is length cubed: $(10^{-2})^3 = 10^{-6}$.',
      },
      {
        id: 'trap-3-apparent-weight-vs-buoyancy',
        titleBn: 'আপাত ওজন ও প্লবতার মধ্যকার পার্থক্য গুলিয়ে ফেলা',
        titleEn: 'Confusing Apparent Weight with Buoyant Force',
        lostMarks: 2,
        frequentlyTestedIn: 'ঘ-অংশ (উচ্চতর দক্ষতা)',
        commonMistakeBn:
          'পানিতে আপাত ওজন বের করতে বলা হলে ছাত্রছাত্রীরা শুধু প্লবতার মান ($F_B$) বের করে উত্তর লিখে ফেলে।',
        commonMistakeEn:
          'Reporting buoyant force $F_B$ as the apparent weight of the object.',
        correctApproachBn:
          'প্লবতা হলো পানি কর্তৃক ঊর্ধ্বমুখী ধাক্কা ($F_B = V\\rho g$)। আর আপাত ওজন হলো বাতাসে প্রকৃত ওজন থেকে প্লবতার বিয়োগফল: $W_{\\text{apparent}} = W - F_B$।',
        correctApproachEn:
          'Buoyancy $F_B$ is the upward force. Apparent weight is actual weight minus buoyancy: $W_{\text{apparent}} = W - F_B$.',
        examinerSecretTipBn:
          'প্রশ্ন ভালো করে পড়ো: "প্লবতা কত" চেয়েছে নাকি "পানিতে ওজন কত" চেয়েছে! দুটি সম্পূর্ণ ভিন্ন রাশি।',
        examinerSecretTipEn:
          'Double check whether the prompt asks for "Buoyant Force" or "Weight in Liquid". They are fundamentally different.',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-pressure-piston',
        questionBn:
          'একটি হাইড্রোলিক প্রেসের পিস্টন দুটির ব্যাসের অনুপাত $1:5$। ছোট পিস্টনে $40\\text{ N}$ বল প্রয়োগ করলে বড় পিস্টনে কত বল অনুভূত হবে?',
        questionEn:
          'The diameter ratio of pistons in a hydraulic press is $1:5$. If $40\text{ N}$ is applied to the smaller piston, what force is experienced at the larger piston?',
        questionType: 'MCQ',
        optionsBn: ['1000 N', '200 N', '500 N', '250 N'],
        optionsEn: ['1000 N', '200 N', '500 N', '250 N'],
        correctOptionIndex: 0,
        explanationBn:
          'বল বৃদ্ধির অনুপাত: $F_2 = F_1 \\times \\left(\\frac{d_2}{d_1}\\right)^2 = 40 \\times (5)^2 = 40 \\times 25 = 1000\\text{ N}$। সঠিক উত্তর ক।',
        explanationEn:
          'Force multiplier: $F_2 = F_1 (d_2/d_1)^2 = 40 \times (5)^2 = 40 \times 25 = 1000\text{ N}$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৩',
      },
      {
        id: 'q2-pressure-depth',
        questionBn:
          'পানির $10\\text{ m}$ গভীরতায় তরলের চাপ কত? (পানির ঘনত্ব $1000\\text{ kg/m}^3, g = 9.8\\text{ m/s}^2$)',
        questionEn:
          'What is the hydrostatic pressure at a water depth of $10\text{ m}$? ($\rho = 1000\text{ kg/m}^3, g = 9.8\text{ m/s}^2$)',
        questionType: 'MCQ',
        optionsBn: ['98,000 Pa', '9,800 Pa', '100,000 Pa', '980 Pa'],
        optionsEn: ['98,000 Pa', '9,800 Pa', '100,000 Pa', '980 Pa'],
        correctOptionIndex: 0,
        explanationBn:
          '$P = h\\rho g = 10 \\times 1000 \\times 9.8 = 98,000\\text{ Pa} = 98\\text{ kPa}$।',
        explanationEn:
          '$P = h\rho g = 10 \times 1000 \times 9.8 = 98,000\text{ Pa}$. Option A is correct.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৪',
      },
      {
        id: 'q3-pressure-floatation',
        questionBn: 'কোন শর্তে একটি বস্তু তরলে নিমজ্জিত অবস্থায় ভাসবে?',
        questionEn: 'Under what condition does an object remain neutrally suspended within a liquid?',
        questionType: 'MCQ',
        optionsBn: [
          'বস্তুর ঘনত্ব তরলের ঘনত্বের সমান হলে (ρ_obj = ρ_liquid)',
          'বস্তুর ঘনত্ব তরলের ঘনত্বের চেয়ে বেশি হলে (ρ_obj > ρ_liquid)',
          'বস্তুর ঘনত্ব তরলের ঘনত্বের চেয়ে কম হলে (ρ_obj < ρ_liquid)',
          'তরলের সান্দ্রতা শূন্য হলে',
        ],
        optionsEn: [
          'Object density equals liquid density (ρ_obj = ρ_liquid)',
          'Object density exceeds liquid density (ρ_obj > ρ_liquid)',
          'Object density is less than liquid density (ρ_obj < ρ_liquid)',
          'Fluid viscosity is zero',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'যখন বস্তুর ঘনত্ব ও তরলের ঘনত্ব সমান হয় ($\\rho_{\\text{obj}} = \\rho_{\\text{liquid}}$), তখন বস্তুর ওজন ও প্লবতা সমান হয় এবং বস্তুটি তরলের যেকোনো স্থানে সম্পূর্ণ নিমজ্জিত অবস্থায় ভেসে থাকে।',
        explanationEn:
          'When $\rho_{\text{obj}} = \rho_{\text{liquid}}$, weight balances buoyant upthrust exactly, causing neutral suspension.',
        boardSource: 'বরিশাল বোর্ড ২০২২',
      },
    ],
  },
};
