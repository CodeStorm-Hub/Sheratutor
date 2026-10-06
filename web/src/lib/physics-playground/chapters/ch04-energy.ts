import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 4)!;

export const CH04_ENERGY_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'বল প্রয়োগের ফলে বস্তুর সরণ ঘটলে কাজ সম্পাদিত হয় ($W = Fs\\cos\\theta$)। কাজ করার সামর্থ্যই হলো শক্তি। শক্তির কোনো সৃষ্টি বা ধ্বংস নেই, কেবল রূপান্তর ঘটে। যান্ত্রিক শক্তির সংরক্ষণ ও মোটরের কর্মদক্ষতা (Efficiency) এই অধ্যায়ের প্রধান বোর্ড বিষয়বস্তু।',
    summaryEn:
      'Work is done when force causes displacement ($W = Fs\\cos\\theta$). Energy is capacity to do work. Conservation of mechanical energy and engine efficiency ($\eta$) form the core of this chapter.',
    nodes: [
      {
        id: 'c4-work',
        titleBn: 'কাজ ও বল-সরণের কোণ',
        titleEn: 'Work & Force-Displacement Angle',
        descriptionBn:
          'বল ও সরণের মধ্যবর্তী কোণ $\\theta$ হলে কাজ $W = Fs\\cos\\theta$। বলের দিকে সরণ হলে ধনাত্মক কাজ ($\\theta = 0^\\circ$), বলের বিপরীতে হলে ঋণাত্মক কাজ ($\\theta = 180^\\circ$), আর বল ও সরণ পরস্পর লম্ব হলে কাজ শূন্য হয় ($\\theta = 90^\\circ, \\cos 90^\\circ = 0$, কাজের বিরুদ্ধে বল বা কাজহীন বল)।',
        descriptionEn:
          'Work equals $W = Fs\\cos\\theta$. Positive work occurs along force ($\theta = 0^\circ$), negative work opposes force ($\theta = 180^\circ$), and zero work occurs when displacement is perpendicular to force ($\theta = 90^\circ$).',
        formulaLatex: 'W = Fs\\cos\\theta',
        realWorldExampleBn:
          'মাথায় বোঝা নিয়ে আনুভূমিক রাস্তায় হেঁটে চললে অভিকর্ষ বলের সাপেক্ষে কৃতকাজ শূন্য ($W = 0$), কারণ অভিকর্ষ বল খাড়া নিচের দিকে আর সরণ আনুভূমিক বরাবর ($90^\\circ$ কোণে)।',
        realWorldExampleEn:
          'Carrying luggage along a horizontal road yields zero work with respect to gravity because gravitational force is perpendicular to displacement ($90^\circ$).',
      },
      {
        id: 'c4-kinetic-energy',
        titleBn: 'গতিশক্তি ও ভরবেগের সম্পর্ক',
        titleEn: 'Kinetic Energy & Momentum Relation',
        descriptionBn:
          'কোনো গতিশীল বস্তু তার গতির জন্য কাজ করার যে সামর্থ্য লাভ করে, তাকে গতিশক্তি বলে ($E_k = \\frac{1}{2}mv^2$)। গতিশক্তি ও ভরবেগের মধ্যকার গভীর সম্পর্ক হলো $E_k = \\frac{p^2}{2m}$। ভরবেগ দ্বিগুণ করলে গতিশক্তি চারগুণ বৃদ্ধি পায়!',
        descriptionEn:
          'Kinetic energy is $E_k = \frac{1}{2}mv^2$. Linking with momentum $p = mv$ yields $E_k = p^2 / (2m)$. Doubling momentum quadruples kinetic energy.',
        formulaLatex: 'E_k = \\frac{1}{2}mv^2 = \\frac{p^2}{2m}',
        realWorldExampleBn:
          'বন্দুকের হালকা গুলির ভর কম হলেও প্রচণ্ড বেগের কারণে তার গতিশক্তি অত্যন্ত বেশি হয়, যা লক্ষ্যভেদ করতে সক্ষম।',
        realWorldExampleEn:
          'A tiny bullet packs tremendous kinetic energy because its velocity is squared ($v^2$) in the kinetic energy equation.',
      },
      {
        id: 'c4-potential-energy',
        titleBn: 'বিভব শক্তি ও যান্ত্রিক শক্তির নিত্যতা',
        titleEn: 'Potential Energy & Energy Conservation',
        descriptionBn:
          'স্বাভাবিক অবস্থান থেকে কোনো বস্তুকে অন্য অবস্থানে নিলে তার মধ্যে যে শক্তি সঞ্চিত হয় তাকে বিভব শক্তি বলে ($E_p = mgh$)। মুক্তভাবে পড়ন্ত বস্তুর ক্ষেত্রে যেকোনো বিন্দুতে মোট যান্ত্রিক শক্তি $E = E_p + E_k = mgh + \\frac{1}{2}mv^2 = \\text{ধ্রুবক}$।',
        descriptionEn:
          'Gravitational potential energy is $E_p = mgh$. For a freely falling body, total mechanical energy $E = E_p + E_k = \text{constant}$ at all altitudes.',
        formulaLatex: 'E_p = mgh, \\quad E_{\\text{total}} = E_p + E_k = mgH = \\text{ধ্রুবক}',
        realWorldExampleBn:
          'পাহাড়ের চূড়া থেকে রোলার কোস্টার নিচে নামার সময় তার বিভব শক্তি গতিশক্তিতে রূপ নেয়, আবার ওঠার সময় গতিশক্তি বিভব শক্তিতে রূপান্তরিত হয়।',
        realWorldExampleEn:
          'A roller coaster converts potential energy to kinetic speed down drops, then trades speed back to climb the next crest.',
      },
      {
        id: 'c4-power-efficiency',
        titleBn: 'ক্ষমতা ও কর্মদক্ষতা (Efficiency η)',
        titleEn: 'Power & Engine Efficiency (η)',
        descriptionBn:
          'কাজ করার হারকে ক্ষমতা বলে ($P = W/t = mgh/t$)। কোনো যন্ত্রে যে পরিমাণ শক্তি দেওয়া হয় তার পুরোটা কাজে লাগে না, কিছু অংশ তাপে ও শব্দে নষ্ট হয়। লভ্য কার্যকর ক্ষমতাকে মোট প্রদত্ত ক্ষমতা দিয়ে ভাগ করে শতকরায় প্রকাশ করলে কর্মদক্ষতা ($\eta$) পাওয়া যায়।',
        descriptionEn:
          'Power is work done per unit time ($P = W/t$). Efficiency $\eta$ is useful output power divided by total input power multiplied by 100%.',
        formulaLatex: '\\eta = \\frac{P_{\\text{out}}}{P_{\\text{in}}} \\times 100\\% = \\frac{W_{\\text{out}}}{W_{\\text{in}}} \\times 100\\%',
        realWorldExampleBn:
          'একটি ২ অশ্বক্ষমতার (2 HP) মোটর দিয়ে ছাদে পানি তুলতে গেলে যদি ৩০% শক্তি নষ্ট হয়, তবে মোটরটির কর্মদক্ষতা ৭০%।',
        realWorldExampleEn:
          'If a 2 HP water pump loses 30% of energy to heat and sound, its efficiency is $\eta = 70\%$.',
      },
    ],
  },
  step2: {
    simulatorType: 'energy',
    instructionsBn:
      'উচ্চতার স্লাইডার টেনে বস্তুর অবস্থান পরিবর্তন করো অথবা "পতন শুরু" বোতাম চেপে মুক্তভাবে পতন দেখো। ডানপাশের বিভব শক্তি ও গতিশক্তির বার চার্ট পর্যবেক্ষণ করো এবং দেখো কীভাবে তাদের যোগফল সর্বদা মোট শক্তির সমান থাকে।',
    instructionsEn:
      'Adjust height via slider or click "Drop Object". Watch the dual potential and kinetic energy bars exchange in real time while their sum stays constant.',
    controls: [
      {
        key: 'currentHeightH',
        labelBn: 'ভূমি থেকে উচ্চতা h (মিটার)',
        labelEn: 'Height from Ground (m)',
        defaultValue: 80,
        min: 0,
        max: 80,
        step: 1,
        unit: 'm',
      },
      {
        key: 'massKg',
        labelBn: 'বস্তুর ভর m (কেজি)',
        labelEn: 'Mass (kg)',
        defaultValue: 5,
        min: 1,
        max: 20,
        step: 1,
        unit: 'kg',
      },
    ],
    keyObservationTipBn:
      'বোর্ডের উচ্চতর দক্ষতার অঙ্কে সবচেয়ে বেশি আসে: "ভূমি থেকে কত উচ্চতায় বিভব শক্তি গতিশক্তির এক-তৃতীয়াংশ বা দ্বিগুণ হবে?" মনে রাখবে—বিভব শক্তির ক্ষেত্রে উচ্চতা $h$ মাপতে হয় মাটি থেকে, আর গতিশক্তির বেগে অতিক্রান্ত দূরত্ব $x$ মাপতে হয় উপর থেকে ($x = H - h$)!',
    keyObservationTipEn:
      'Classic board CQ problem: "At what height will potential energy equal half/double of kinetic energy?" Always measure $E_p$ height $h$ from the ground, but compute velocity $v$ for $E_k$ using distance fallen from the top ($x = H - h$).',
  },
  step3: {
    coreFormulaLatex: 'E_{\\text{total}} = mgh + \\frac{1}{2}mv^2 = mgH \\quad \\text{এবং} \\quad \\eta = \\frac{P_{\\text{out}}}{P_{\\text{in}}} \\times 100\\%',
    variableDefinitions: [
      {
        symbol: 'E_p',
        nameBn: 'বিভব শক্তি',
        nameEn: 'Potential Energy',
        siUnit: 'J \\text{ (Joule)}',
      },
      {
        symbol: 'E_k',
        nameBn: 'গতি শক্তি',
        nameEn: 'Kinetic Energy',
        siUnit: 'J',
      },
      {
        symbol: 'P_{\\text{out}}',
        nameBn: 'লভ্য কার্যকর ক্ষমতা',
        nameEn: 'Useful Output Power',
        siUnit: 'W \\text{ (Watt)}',
      },
      {
        symbol: 'P_{\\text{in}}',
        nameBn: 'মোট প্রদত্ত ক্ষমতা',
        nameEn: 'Total Input Power',
        siUnit: 'W',
      },
      {
        symbol: '\\eta',
        nameBn: 'কর্মদক্ষতা',
        nameEn: 'Efficiency',
        siUnit: '\\% \\text{ (Percentage)}',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'শীর্ষবিন্দু A তে মোট শক্তি',
        labelEn: 'Total Energy at Peak Point A',
        latexExpression: 'E_A = E_p + E_k = mgH + 0 = mgH',
        explanationBn:
          'শীর্ষবিন্দুতে বস্তুটি স্থির ($v = 0$), তাই গতিশক্তি শূন্য এবং সম্পূর্ণ শক্তিই বিভব শক্তি।',
        explanationEn:
          'At initial release point $v = 0$, so kinetic energy is 0 and total energy is purely potential energy $mgH$.',
      },
      {
        stepNumber: 2,
        labelBn: 'মধ্যবর্তী বিন্দু B তে মোট শক্তি (x দূরত্ব পতনের পর)',
        labelEn: 'Total Energy at Intermediate Point B',
        latexExpression: 'E_p = mg(H - x), \\quad E_k = \\frac{1}{2}m(2gx) = mgx \\implies E_B = mg(H - x) + mgx = mgH',
        explanationBn:
          'মাটি থেকে উচ্চতা $(H - x)$ এবং অতিক্রান্ত দূরত্ব $x$ হওয়ায় $v^2 = 2gx$। যোগফল পুনরায় $mgH$।',
        explanationEn:
          'Height above ground is $(H - x)$ while fall distance is $x$ ($v^2 = 2gx$). The sum resolves cleanly to $mgH$.',
      },
      {
        stepNumber: 3,
        labelBn: 'ভূমি স্পর্শ করার ঠিক পূর্বমুহূর্তে বিন্দু C তে শক্তি',
        labelEn: 'Total Energy at Ground Impact Point C',
        latexExpression: 'E_p = 0, \\quad E_k = \\frac{1}{2}m(2gH) = mgH \\implies E_C = mgH',
        explanationBn:
          'ভূমিতে উচ্চতা শূন্য ($h = 0$), তাই বিভব শক্তি শূন্য এবং সম্পূর্ণ শক্তি গতিশক্তিতে রূপান্তরিত হয়। সুতরাং $E_A = E_B = E_C$।',
        explanationEn:
          'At ground level $h = 0$, so potential energy vanishes and entire energy resides in velocity. $E_A = E_B = E_C$.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        '$1.5\\text{ kW}$ ক্ষমতার একটি মোটর দিয়ে $20\\text{ m}$ উচ্চতায় অবস্থিত $1000\\text{ L}$ পানির একটি ট্যাংক পূর্ণ করতে $3\\text{ মিনিট}$ সময় লাগে। মোটরটির লভ্য কার্যকর ক্ষমতা ও কর্মদক্ষতা কত? ($1\\text{ L পানি} = 1\\text{ kg}$)',
      problemEn:
        'A $1.5\\text{ kW}$ pump lifts $1000\\text{ L}$ of water to a tank at $20\\text{ m}$ in $3\\text{ minutes}$. Calculate the useful output power and efficiency of the pump.',
      solutionStepsBn: [
        '১. প্রদত্ত উপাত্ত: $P_{\\text{in}} = 1.5\\text{ kW} = 1500\\text{ W}$, ভর $m = 1000\\text{ kg}$, $h = 20\\text{ m}$, সময় $t = 3 \\times 60 = 180\\text{ s}$',
        '২. লভ্য কার্যকর কাজ $W = mgh = 1000 \\times 9.8 \\times 20 = 196000\\text{ J}$',
        '৩. লভ্য কার্যকর ক্ষমতা $P_{\\text{out}} = \\frac{W}{t} = \\frac{196000}{180} \\approx 1088.89\\text{ W}$',
        '৪. কর্মদক্ষতা $\\eta = \\frac{P_{\\text{out}}}{P_{\\text{in}}} \\times 100\\% = \\frac{1088.89}{1500} \\times 100\\% \\approx 72.59\\%$',
      ],
      solutionStepsEn: [
        '1. Given: $P_{\\text{in}} = 1500\\text{ W}, m = 1000\\text{ kg}, h = 20\\text{ m}, t = 180\\text{ s}$',
        '2. Output work: $W = mgh = 1000 \\times 9.8 \\times 20 = 196000\\text{ J}$',
        '3. Output power: $P_{\\text{out}} = W / t = 196000 / 180 = 1088.89\\text{ W}$',
        '4. Efficiency: $\\eta = (1088.89 / 1500) \\times 100\\% = 72.59\\%$',
      ],
      finalAnswerWithUnit: 'P_{\\text{out}} = 1088.89\\text{ W},\\; \\eta = 72.59\\%',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-height-ground-vs-fall',
        titleBn: 'বিভব শক্তিতে পতন দূরত্ব (x) আর উচ্চতা (h) গুলিয়ে ফেলা',
        titleEn: 'Confusing Distance Fallen (x) with Height from Ground (h)',
        lostMarks: 2,
        frequentlyTestedIn: 'গ ও ঘ-অংশ (বোর্ডে সবচেয়ে বেশি নম্বর কাটার ফাঁদ)',
        commonMistakeBn:
          'উপর থেকে $20\\text{ m}$ নিচে নামলে ছাত্রছাত্রীরা $E_p = mg(20)$ লিখে দেয়! অথচ মাটি থেকে উচ্চতা ছিল $(H - 20)$।',
        commonMistakeEn:
          'Using distance fallen from peak in the potential energy formula $E_p = mgx$ instead of height from ground $mg(H - x)$.',
        correctApproachBn:
          'সতর্ক সূত্র: বিভব শক্তি $E_p = mgh$ যেখানে $h$ হলো মাটি থেকে খাড়া উচ্চতা। আর বেগ $v^2 = 2gx$ যেখানে $x$ হলো উপর থেকে পতন দূরত্ব ($x = H - h$)।',
        correctApproachEn:
          'Potential energy ALWAYS depends on height from ground: $E_p = mg(H - x)$. Fall distance $x$ only calculates velocity $v^2 = 2gx$.',
        examinerSecretTipBn:
          'অঙ্কের শুরুতেই চিত্র এঁকে নাও। নিচ থেকে উচ্চতাকে $h$ এবং উপর থেকে পতনের দূরত্বকে $x$ দিয়ে চিহ্নিত করলে কখনোই ভুল হবে না।',
        examinerSecretTipEn:
          'Draw a sketch immediately: label height from ground $h$, and drop from top $x$. Never confuse them.',
      },
      {
        id: 'trap-2-efficiency-kw-to-w',
        titleBn: 'মোটরের ক্ষমতা কিলোওয়াট (kW) বা অশ্বক্ষমতা (HP) থেকে ওয়াটে (W) না নেওয়া',
        titleEn: 'Forgetting to Convert kW or Horsepower (HP) to Watts',
        lostMarks: 1,
        frequentlyTestedIn: 'ঘ-অংশ (উচ্চতর দক্ষতা)',
        commonMistakeBn:
          'মোটরের ক্ষমতা $2\\text{ HP}$ দেওয়া থাকলে ছাত্রছাত্রীরা সরাসরি সূত্রে $P_{\\text{in}} = 2$ বসিয়ে দেয়, ফলে কর্মদক্ষতা অবাস্তবভাবে লক্ষ লক্ষ শতাংশ আসে!',
        commonMistakeEn:
          'Plugging $2\\text{ HP}$ as $P = 2$ instead of converting to $2 \\times 746 = 1492\\text{ W}$.',
        correctApproachBn:
          '$1\\text{ HP} = 746\\text{ W}$ এবং $1\\text{ kW} = 1000\\text{ W}$। হিসাবের সময় সকল ক্ষমতাকে ওয়াট (W) এ রূপান্তর করে অনুপাত বের করতে হবে।',
        correctApproachEn:
          'Remember $1\\text{ HP} = 746\\text{ W}$ and $1\\text{ kW} = 1000\\text{ W}$. Convert to watts prior to ratio evaluation.',
        examinerSecretTipBn:
          'কর্মদক্ষতার মান সবসময় $0\\%$ থেকে $100\\%$ এর মধ্যে আসবে। যদি তোমার উত্তর ১০০% এর বেশি আসে, বুঝবে তুমি ওয়াটের রূপান্তর ভুলে গেছ!',
        examinerSecretTipEn:
          'Efficiency is physically bound between $0\\%$ and $100\\%$. If your answer exceeds 100%, an uncoverted kilowatt or HP is the culprit.',
      },
      {
        id: 'trap-3-zero-work-perpendicular',
        titleBn: 'বল ও সরণ লম্ব হলে কাজ শূন্য হওয়ার বিষয়টি ব্যাখ্যা না করা',
        titleEn: 'Missing Zero Work Condition when Force is Perpendicular to Displacement',
        lostMarks: 1,
        frequentlyTestedIn: 'খ-অংশ (অনুধাবনমূলক)',
        commonMistakeBn:
          'জিজ্ঞাসা করে "সূর্যকে প্রদক্ষিণরত পৃথিবীর ওপর অভিকর্ষ বল দ্বারা কৃতকাজ কত?" ছাত্রছাত্রীরা বলে বিশাল দূরত্ব অতিক্রম করায় কাজ অনেক বেশি!',
        commonMistakeEn:
          'Assuming Earth traversing millions of kilometers around the Sun means enormous work is done by gravity.',
        correctApproachBn:
          'বৃত্তাকার বা উপবৃত্তাকার কক্ষপথে অভিকর্ষ বল কেন্দ্রের দিকে কাজ করে এবং গতিপথের স্পর্শক বরাবর সরণ ঘটে (কোণ $\\theta = 90^\\circ$)। যেহেতু $\\cos 90^\\circ = 0$, তাই কোনো কাজ সম্পাদিত হয় না ($W = 0$)।',
        correctApproachEn:
          'Centripetal gravitational pull is perpendicular to instantaneous displacement ($\theta = 90^\circ$). Since $\cos 90^\circ = 0$, zero work is done.',
        examinerSecretTipBn:
          'খ-অংশে এই প্রশ্নের উত্তর দেওয়ার সময় অবশ্যই $W = Fs\\cos 90^\\circ = 0$ গাণিতিক সমীকরণটি লিখে দেখাবে।',
        examinerSecretTipEn:
          'Always explicitly write the mathematical justification $W = Fs\cos 90^\circ = 0$ to secure both marks.',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-energy-half',
        questionBn:
          'একটি বস্তুকে $60\\text{ m}$ উচ্চতা থেকে মুক্তভাবে ছেড়ে দেওয়া হলো। ভূমি থেকে কত উচ্চতায় এর গতিশক্তি বিভব শক্তির দ্বিগুণ ($E_k = 2E_p$) হবে?',
        questionEn:
          'A body is dropped freely from $60\\text{ m}$. At what height from the ground will kinetic energy be twice potential energy ($E_k = 2E_p$)?',
        questionType: 'MCQ',
        optionsBn: ['20 m', '30 m', '40 m', '15 m'],
        optionsEn: ['20 m', '30 m', '40 m', '15 m'],
        correctOptionIndex: 0,
        explanationBn:
          'ভূমি থেকে উচ্চতা $h$ হলে বিভব শক্তি $E_p = mgh$। মোট শক্তি $E = mgH = E_p + E_k = E_p + 2E_p = 3E_p$। সুতরাং $mgH = 3mgh \\implies h = H / 3 = 60 / 3 = 20\\text{ m}$। সঠিক উত্তর ক (20 m)।',
        explanationEn:
          'Total energy $mgH = E_p + E_k = 3E_p \implies mgH = 3mgh \implies h = H/3 = 60/3 = 20\text{ m}$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৪',
      },
      {
        id: 'q2-energy-hp',
        questionBn: '১ অশ্বক্ষমতা (1 Horsepower) সমান কত ওয়াট?',
        questionEn: 'How many Watts are there in 1 Horsepower (HP)?',
        questionType: 'MCQ',
        optionsBn: ['746 W', '1000 W', '550 W', '786 W'],
        optionsEn: ['746 W', '1000 W', '550 W', '786 W'],
        correctOptionIndex: 0,
        explanationBn:
          'সংজ্ঞানুসারে, $1\\text{ HP} = 746\\text{ W}$। এটি এসআই ও এফপিএস এককের মধ্যকার সুনির্দিষ্ট রূপান্তর।',
        explanationEn:
          'By international definition, $1\text{ HP} = 746\text{ W}$. Option A is correct.',
        boardSource: 'কুমিল্লা বোর্ড ২০২৩',
      },
      {
        id: 'q3-energy-momentum-double',
        questionBn: 'কোনো গতিশীল বস্তুর ভরবেগ দ্বিগুণ করা হলে এর গতিশক্তি কত গুণ হবে?',
        questionEn: 'If the momentum of a moving object is doubled, by what factor does its kinetic energy increase?',
        questionType: 'MCQ',
        optionsBn: ['৪ গুণ (4 times)', '২ গুণ (2 times)', '৮ গুণ (8 times)', 'অপরিবর্তিত থাকবে'],
        optionsEn: ['4 times', '2 times', '8 times', 'Remains unchanged'],
        correctOptionIndex: 0,
        explanationBn:
          'আমরা জানি, $E_k = \\frac{p^2}{2m}$। ভরবেগ $p$ দ্বিগুণ হলে $E_k\' = \\frac{(2p)^2}{2m} = 4 \\times \\left(\\frac{p^2}{2m}\\right) = 4E_k$।',
        explanationEn:
          'Since $E_k = p^2 / (2m)$, doubling momentum yields $E_k\' = (2p)^2 / (2m) = 4E_k$. Option A is correct.',
        boardSource: 'যশোর বোর্ড ২০২২',
      },
    ],
  },
};
