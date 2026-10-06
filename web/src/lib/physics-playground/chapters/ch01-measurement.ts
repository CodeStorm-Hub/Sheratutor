import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 1)!;

export const CH01_MEASUREMENT_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'পদার্থবিজ্ঞানের মূল ভিত্তি হলো পরিমাপ। যেসকল রাশিকে প্রত্যক্ষ বা পরোক্ষভাবে পরিমাপ করা যায়, তাদেরকে ভৌত রাশি বলে। মৌলিক রাশি (৭টি) থেকে মাত্রা বিশ্লেষণের মাধ্যমে লব্ধ রাশি গঠিত হয়।',
    summaryEn:
      'Measurement forms the bedrock of physics. Any quantity that can be measured directly or indirectly is a physical quantity. Derived quantities and dimensional equations originate from 7 fundamental SI units.',
    nodes: [
      {
        id: 'c1-fundamental',
        titleBn: 'মৌলিক ও লব্ধ রাশি',
        titleEn: 'Fundamental & Derived Quantities',
        descriptionBn:
          'যেসব রাশি স্বাধীন বা নিরপেক্ষ এবং অন্য কোনো রাশির ওপর নির্ভর করে না, তাদের মৌলিক রাশি বলে (এসআই পদ্ধতিতে মোট ৭টি: দৈর্ঘ্য, ভর, সময়, তাপমাত্রা, তড়িৎপ্রবাহ, দীপন তীব্রতা ও পদার্থের পরিমাণ)। অন্যদিকে মৌলিক রাশির সমন্বয়ে গঠিত রাশিকে লব্ধ রাশি বলে (যেমন: বেগ, বল, কাজ)।',
        descriptionEn:
          'Fundamental quantities are independent and do not rely on other units (7 in SI: length, mass, time, temperature, electric current, luminous intensity, amount of substance). Derived quantities (e.g. velocity, force, work) are built from fundamental units.',
        realWorldExampleBn:
          'দৈর্ঘ্য (মিটার) একটি মৌলিক রাশি, কিন্তু যখন আমরা ঘরের মেঝের ক্ষেত্রফল বের করি (দৈর্ঘ্য × প্রস্থ = $m^2$), তখন সেটি একটি লব্ধ রাশিতে পরিণত হয়।',
        realWorldExampleEn:
          'Length (meters) is fundamental, but computing floor area (length × width = $m^2$) yields a derived quantity.',
      },
      {
        id: 'c2-dimension',
        titleBn: 'মাত্রা ও মাত্রা সমীকরণ',
        titleEn: 'Dimensions & Dimensional Analysis',
        descriptionBn:
          'কোনো ভৌত রাশিতে উপস্থিত মৌলিক রাশিগুলোর সূচক বা ঘাতকে তার মাত্রা (Dimension) বলে। যেকোনো সমীকরণের বামপক্ষ ও ডানপক্ষের মাত্রা সবসময় সমান হতে হয় (মাত্রাগত সমসত্ত্বতার নীতি)।',
        descriptionEn:
          'The dimension of a physical quantity indicates the powers to which fundamental units are raised. In any valid physical equation, dimensions on both sides must match (Principle of Dimensional Homogeneity).',
        formulaLatex: '[F] = [m][a] = MLT^{-2}',
        realWorldExampleBn:
          'বল $F = ma$ সত্য কিনা তা পরীক্ষা করতে: ভরের মাত্রা $M$ এবং ত্বরণের মাত্রা $LT^{-2}$, সুতরাং বলের মাত্রা $[F] = MLT^{-2}$।',
        realWorldExampleEn:
          'Checking force $F = ma$: Mass has dimension $M$, acceleration has $LT^{-2}$, so $[F] = MLT^{-2}$.',
      },
      {
        id: 'c3-vernier',
        titleBn: 'ভার্নিয়ার স্কেল ও ভার্নিয়ার ধ্রুবক (VC)',
        titleEn: 'Vernier Scale & Vernier Constant (VC)',
        descriptionBn:
          'সাধারণ মিটার স্কেলে ১ মিলিমিটারের চেয়ে ছোট ভগ্নাংশ নির্ভুলভাবে মাপা যায় না। প্রধান স্কেলের ক্ষুদ্রতম এক ভাগের চেয়ে ভার্নিয়ার স্কেলের এক ভাগ যতটুকু ছোট, তাকে ভার্নিয়ার ধ্রুবক (VC) বলে।',
        descriptionEn:
          'Standard meter rules cannot measure below 1 mm reliably. The difference between one main scale division and one vernier scale division is the Vernier Constant (VC).',
        formulaLatex: 'VC = \\frac{s}{n} = \\frac{1\\text{ mm}}{10} = 0.1\\text{ mm} = 0.01\\text{ cm}',
        realWorldExampleBn:
          'একটি টেস্টটিউবের সঠিক বহির্ব্যাস বা একটি মার্বেলের নিখুঁত ব্যাস বের করতে ভার্নিয়ার ক্যালিপার্স ব্যবহার করা হয়।',
        realWorldExampleEn:
          'Determining the exact outer diameter of a test tube or spherical marble requires a vernier caliper.',
      },
      {
        id: 'c4-error',
        titleBn: 'পরিমাপের ত্রুটি ও অনিশ্চয়তা',
        titleEn: 'Measurement Error & Uncertainty',
        descriptionBn:
          'বাস্তব পরিমাপে যান্ত্রিক ত্রুটি (ধনাত্মক বা ঋণাত্মক) এবং শতকরা আপেক্ষিক ত্রুটি নির্ণয় করতে হয়। পরম ত্রুটিকে প্রকৃত মান দিয়ে ভাগ করে ১০০ দিয়ে গুণ করলে শতকরা ত্রুটি পাওয়া যায়।',
        descriptionEn:
          'Every measurement carries mechanical zero error and relative uncertainty. Percentage error equals absolute error divided by measured value multiplied by 100%.',
        formulaLatex: '\\text{শতকরা ত্রুটি} = \\frac{\\text{পরম ত্রুটি}}{\\text{পরিমাপকৃত মান}} \\times 100\\%',
        realWorldExampleBn:
          'একটি ঘনকের বাহু পরিমাপে ৫% ত্রুটি থাকলে, তার আয়তন ($V = a^3$) নির্ণয়ে প্রায় ১৫% ($3 \\times 5\\%$) পর্যন্ত ত্রুটি ঘটতে পারে!',
        realWorldExampleEn:
          'A 5% error in measuring cube side length propagates to approximately 15% ($3 \\times 5\\%$) error in its volume ($V = a^3$).',
      },
    ],
  },
  step2: {
    simulatorType: 'vernier',
    instructionsBn:
      'স্লাইডার টেনে ধাতব বস্তুর আকার পরিবর্তন করো। পর্যবেক্ষণ করো কীভাবে মূল স্কেলের পাঠ (M) এবং ভার্নিয়ার সমপাতন (V) পরিবর্তিত হচ্ছে। যান্ত্রিক ত্রুটি (e) চালু করে দেখো কীভাবে চূড়ান্ত পাঠ সংশোধিত হয়।',
    instructionsEn:
      'Adjust object dimensions using the slider. Observe how the main scale reading (M) and vernier coincidence (V) dynamically respond. Toggle zero error (e) to see calibrated final results.',
    controls: [
      {
        key: 'objectWidthMm',
        labelBn: 'বস্তুর আকার (মি.মি.)',
        labelEn: 'Object Width (mm)',
        defaultValue: 18.4,
        min: 0,
        max: 45,
        step: 0.1,
        unit: 'mm',
      },
      {
        key: 'vernierDivisions',
        labelBn: 'ভার্নিয়ার ভাগ সংখ্যা (n)',
        labelEn: 'Vernier Divisions (n)',
        defaultValue: 10,
        min: 10,
        max: 20,
        step: 10,
        unit: 'ভাগ',
      },
    ],
    keyObservationTipBn:
      'বোর্ড পরীক্ষার ব্যবহারিক ও সৃজনশীলে প্রায়ই সমপাতন নিয়ে প্রশ্ন আসে: ভার্নিয়ার স্কেলের যে দাগটি প্রধান স্কেলের যেকোনো দাগের সাথে সবচেয়ে নিখুঁতভাবে সোজাসুজি মিলে যায়, সেটাই হলো ভার্নিয়ার সমপাতন (V)। এখানে প্রধান স্কেলের দাগের মান দেখার দরকার নেই, কেবল ভার্নিয়ারের দাগ নম্বরটি (০ থেকে ১০) নেওয়া হয়।',
    keyObservationTipEn:
      'In board exams, vernier coincidence (V) is the exact division on the vernier scale that lines up directly with any division on the main scale. Do not count the main scale mark number—only read the vernier scale division index (0 to 10).',
  },
  step3: {
    coreFormulaLatex: 'L = M + (V \\times VC) - (\\pm e)',
    variableDefinitions: [
      {
        symbol: 'L',
        nameBn: 'বস্তুর প্রকৃত দৈর্ঘ্য / ব্যাস',
        nameEn: 'True Length / Diameter',
        siUnit: 'm \\text{ বা } cm',
      },
      {
        symbol: 'M',
        nameBn: 'প্রধান স্কেল পাঠ',
        nameEn: 'Main Scale Reading',
        siUnit: 'mm \\text{ বা } cm',
      },
      {
        symbol: 'V',
        nameBn: 'ভার্নিয়ার সমপাতন',
        nameEn: 'Vernier Coincidence',
        siUnit: '\\text{এককহীন (Integer)}',
      },
      {
        symbol: 'VC',
        nameBn: 'ভার্নিয়ার ধ্রুবক',
        nameEn: 'Vernier Constant',
        siUnit: 'mm \\text{ বা } cm',
      },
      {
        symbol: 'e',
        nameBn: 'যান্ত্রিক শূন্য ত্রুটি',
        nameEn: 'Mechanical Zero Error',
        siUnit: 'mm',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'ভার্নিয়ার ধ্রুবকের সংজ্ঞা',
        labelEn: 'Definition of Vernier Constant',
        latexExpression: 'VC = s - v',
        explanationBn:
          'প্রধান স্কেলের ক্ষুদ্রতম এক ভাগের মান $s$ এবং ভার্নিয়ার স্কেলের এক ভাগের মান $v$ এর পার্থক্যই হলো ভার্নিয়ার ধ্রুবক।',
        explanationEn:
          'Difference between one main scale division $s$ and one vernier scale division $v$.',
      },
      {
        stepNumber: 2,
        labelBn: 'ভাগ সংখ্যার সম্পর্ক স্থাপন',
        labelEn: 'Division Equivalence',
        latexExpression: 'n \\times v = (n - 1) \\times s \\implies v = \\frac{n - 1}{n} s',
        explanationBn:
          'ভার্নিয়ারের $n$ টি ভাগ প্রধান স্কেলের $(n - 1)$ টি ভাগের সমান দৈর্ঘ্য দখল করে।',
        explanationEn:
          'n vernier divisions cover the exact length of (n - 1) main scale divisions.',
      },
      {
        stepNumber: 3,
        labelBn: 'চূড়ান্ত সমীকরণ',
        labelEn: 'Final Equation',
        latexExpression: 'VC = s - \\left(\\frac{n - 1}{n}\\right)s = \\frac{s}{n}',
        explanationBn:
          'সাধারণ মেট্রিক স্কেলে $s = 1\\text{ mm}$ এবং $n = 10$ হলে $VC = \\frac{1}{10} = 0.1\\text{ mm}$।',
        explanationEn:
          'For a metric scale where $s = 1\\text{ mm}$ and $n = 10$, $VC = 0.1\\text{ mm}$.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'একটি স্লাইড ক্যালিপার্স দিয়ে একটি গোলকের ব্যাস মাপতে গিয়ে প্রধান স্কেল পাঠ পাওয়া গেল $3.2\\text{ cm}$, ভার্নিয়ার সমপাতন $7$ এবং ভার্নিয়ার ধ্রুবক $0.005\\text{ cm}$ পাওয়া গেল। গোলকটির ব্যাস ও আয়তন নির্ণয় করো।',
      problemEn:
        'Using a vernier caliper to measure a sphere: Main scale reading is $3.2\\text{ cm}$, vernier coincidence is $7$, and $VC = 0.005\\text{ cm}$. Find the diameter and volume of the sphere.',
      solutionStepsBn: [
        '১. সূত্র লিখি: $d = M + (V \\times VC)$',
        '২. মান বসাই: $d = 3.2\\text{ cm} + (7 \\times 0.005\\text{ cm}) = 3.2 + 0.035 = 3.235\\text{ cm}$',
        '৩. ব্যাসার্ধ নির্ণয়: $r = \\frac{d}{2} = \\frac{3.235}{2} = 1.6175\\text{ cm}$',
        '৪. আয়তনের সূত্র: $V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3} \\times 3.1416 \\times (1.6175)^3 \\approx 17.72\\text{ cm}^3$',
      ],
      solutionStepsEn: [
        '1. Formula: $d = M + (V \\times VC)$',
        '2. Substitute: $d = 3.2\\text{ cm} + (7 \\times 0.005\\text{ cm}) = 3.235\\text{ cm}$',
        '3. Radius: $r = d / 2 = 1.6175\\text{ cm}$',
        '4. Volume: $V = \\frac{4}{3}\\pi r^3 \\approx 17.72\\text{ cm}^3$',
      ],
      finalAnswerWithUnit: 'd = 3.235\\text{ cm},\\; V = 17.72\\text{ cm}^3',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-vc-lc',
        titleBn: 'ভার্নিয়ার ধ্রুবক (VC) ও স্ক্রু গজের লঘিষ্ঠ গণন (LC) গুলিয়ে ফেলা',
        titleEn: 'Confusing Vernier Constant with Screw Gauge Least Count',
        lostMarks: 1,
        frequentlyTestedIn: 'ক ও খ-অংশ এবং বহুনির্বাচনি (MCQ)',
        commonMistakeBn:
          'স্ক্রু গজের ক্ষেত্রে $VC = \\frac{s}{n}$ সূত্র লিখে ফেলা, অথবা ভার্নিয়ার স্কেলে পিচ দিয়ে ভাগ করা।',
        commonMistakeEn:
          'Writing $VC = s/n$ for screw gauge or using circular divisions for vernier calipers.',
        correctApproachBn:
          'ভার্নিয়ার ক্যালিপার্সে $VC = \\frac{s}{n}$ (যেখানে $s = \\text{প্রধান স্কেলের ১ ভাগ}$)। আর স্ক্রু গজে $LC = \\frac{\\text{পিচ (Pitch)}}{\\text{বৃত্তাকার স্কেলের মোট ভাগ সংখ্যা}}$।',
        correctApproachEn:
          'Vernier caliper: $VC = s/n$. Screw gauge: $LC = \\text{Pitch} / \\text{Total circular divisions}$.',
        examinerSecretTipBn:
          'বোর্ড পরীক্ষায় প্রশ্ন ভালো করে লক্ষ করো—যন্ত্রটি কি ভার্নিয়ার ক্যালিপার্স নাকি স্ক্রু গজ! দুটি আলাদা যন্ত্রের ধ্রুবকের নাম ও প্রতীক ভিন্ন।',
        examinerSecretTipEn:
          'Always check whether the problem specifies a Vernier Caliper or a Screw Gauge before writing the constant formula.',
      },
      {
        id: 'trap-2-zero-error-sign',
        titleBn: 'যান্ত্রিক শূন্য ত্রুটির চিহ্ন উল্টো বসানো (+ কে যোগ করে ফেলা)',
        titleEn: 'Inverting Mechanical Zero Error Sign Correction',
        lostMarks: 2,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক ৩ নম্বর)',
        commonMistakeBn:
          'ধনাত্মক ত্রুটি থাকলে ছাত্রছাত্রীরা যোগ করে ফেলে ($+e$ যোগ করে)। ফলে উত্তর ভুল হয় এবং পরীক্ষক পুরো ২ নম্বর কেটে নেন।',
        commonMistakeEn:
          'Adding positive zero error to the measured reading instead of subtracting it.',
        correctApproachBn:
          'সাধারণ সূত্র: $\\text{প্রকৃত পাঠ} = \\text{প্রাপ্ত পাঠ} - (\\pm \\text{ত্রুটি})$। ধনাত্মক ত্রুটি হলে বিয়োগ করতে হবে, আর ঋণাত্মক ত্রুটি হলে বিয়োগে-বিয়োগে যোগ হবে ($ - (-e) = +e$)।',
        correctApproachEn:
          'Rule: $\\text{Actual reading} = \\text{Observed reading} - (\\pm \\text{Zero Error})$. Positive error must be subtracted; negative error becomes addition.',
        examinerSecretTipBn:
          'মনে রাখার সহজ কৌশল: যন্ত্র যদি আগে থেকেই বেশি দেখায় (ধনাত্মক ত্রুটি), তবে সঠিক মানের জন্য বাড়তি অংশ বাদ (বিয়োগ) দিতে হবে!',
        examinerSecretTipEn:
          'Mnemonic: If the device starts ahead of zero, it over-measures, so the excess must be subtracted.',
      },
      {
        id: 'trap-3-volume-uncertainty',
        titleBn: 'আয়তনের শতকরা ত্রুটিতে ৩ দিয়ে গুণ না করা',
        titleEn: 'Failing to Multiply Relative Error by Power for Volume',
        lostMarks: 2,
        frequentlyTestedIn: 'ঘ-অংশ (উচ্চতর দক্ষতা ৪ নম্বর)',
        commonMistakeBn:
          'গোলকের ব্যাসার্ধের ত্রুটি ৫% হলে সরাসরি বলে দেয় যে আয়তনের ত্রুটিও ৫%।',
        commonMistakeEn:
          'Assuming a 5% error in radius means the volume error is also simply 5%.',
        correctApproachBn:
          'আয়তন $V \\propto r^3$। ঘাত ৩ থাকার কারণে শতকরা ত্রুটির সমীকরণে $\\frac{\\Delta V}{V} = 3 \\times \\frac{\\Delta r}{r}$ হবে। সুতরাং আয়তনের শতকরা ত্রুটি হবে $3 \\times 5\\% = 15\\%$।',
        correctApproachEn:
          'Since $V \\propto r^3$, power rule gives $\\Delta V / V = 3 \\times (\\Delta r / r)$. The percentage error is $3 \\times 5\\% = 15\\%$.',
        examinerSecretTipBn:
          'বোর্ডের উচ্চতর দক্ষতায় এই অঙ্কটি প্রতি বছর কোনো না কোনো বোর্ডে আসে। ক্ষেত্রফলে ঘাত ২ এবং আয়তনে ঘাত ৩ দিয়ে গুণ করতে ভুলো না।',
        examinerSecretTipEn:
          'The power propagates error: Multiply by 2 for area, and multiply by 3 for volume.',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-vc',
        questionBn:
          'একটি প্রধান স্কেলের ক্ষুদ্রতম এক ভাগের মান $1\\text{ mm}$ এবং ভার্নিয়ার স্কেলের ২০টি ভাগ প্রধান স্কেলের ১৯ ভাগের সমান। স্কেলটির ভার্নিয়ার ধ্রুবক (VC) কত?',
        questionEn:
          'One division of the main scale is $1\\text{ mm}$, and 20 vernier divisions equal 19 main scale divisions. What is the Vernier Constant (VC)?',
        questionType: 'MCQ',
        optionsBn: ['0.1 mm', '0.05 mm', '0.01 mm', '0.02 mm'],
        optionsEn: ['0.1 mm', '0.05 mm', '0.01 mm', '0.02 mm'],
        correctOptionIndex: 1,
        explanationBn:
          'আমরা জানি, $VC = \\frac{s}{n} = \\frac{1\\text{ mm}}{20} = 0.05\\text{ mm}$। সঠিক উত্তর খ (0.05 mm)।',
        explanationEn:
          'Formula: $VC = s / n = 1\\text{ mm} / 20 = 0.05\\text{ mm}$. Option B is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৩',
      },
      {
        id: 'q2-dimension',
        questionBn: 'কাজের মাত্রা সমীকরণ নিচের কোনটি?',
        questionEn: 'Which of the following is the dimensional equation for work?',
        questionType: 'MCQ',
        optionsBn: ['[W] = MLT⁻¹', '[W] = ML²T⁻²', '[W] = MLT⁻²', '[W] = ML²T⁻¹'],
        optionsEn: ['[W] = MLT⁻¹', '[W] = ML²T⁻²', '[W] = MLT⁻²', '[W] = ML²T⁻¹'],
        correctOptionIndex: 1,
        explanationBn:
          'কাজ = বল × সরণ $\\implies [W] = [F] \\times [s] = (MLT^{-2}) \\times L = ML^2T^{-2}$।',
        explanationEn:
          'Work = Force × Displacement $\\implies [W] = [F] \\times [s] = (MLT^{-2}) \\times L = ML^2T^{-2}$.',
        boardSource: 'রাজশাহী বোর্ড ২০২২',
      },
      {
        id: 'q3-zero-error',
        questionBn:
          'ভার্নিয়ার ক্যালিপার্সে চোয়াল দুটি একত্রিত করলে ভার্নিয়ারের শূন্য দাগ প্রধান স্কেলের শূন্য দাগের ডানপাশে থাকলে কোন ধরনের ত্রুটি হয়?',
        questionEn:
          'When jaws are closed, if the vernier zero line lies to the right of the main scale zero, what type of error occurs?',
        questionType: 'MCQ',
        optionsBn: [
          'ধনাত্মক যান্ত্রিক ত্রুটি (Positive Zero Error)',
          'ঋণাত্মক যান্ত্রিক ত্রুটি (Negative Zero Error)',
          'পিছুটান ত্রুটি (Backlash Error)',
          'ব্যক্তিগত ত্রুটি (Personal Error)',
        ],
        optionsEn: [
          'Positive Zero Error',
          'Negative Zero Error',
          'Backlash Error',
          'Personal Error',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'ভার্নিয়ারের শূন্য দাগ মূল স্কেলের শূন্যের ডানে অবস্থান করলে তা ধনাত্মক যান্ত্রিক ত্রুটি। চূড়ান্ত পাঠ থেকে এই ত্রুটি বিয়োগ করতে হয়।',
        explanationEn:
          'If the vernier zero lies to the right of the main scale zero, it is a positive zero error. It must be subtracted from the final reading.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৪',
      },
    ],
  },
};
