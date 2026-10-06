import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 8)!;

export const CH08_REFLECTION_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'আলো যখন কোনো স্বচ্ছ সমসত্ত্ব মাধ্যমে চলতে চলতে অন্য কোনো মাধ্যমের তলে আপতিত হয়, তখন কিছু অংশ আবার প্রথম মাধ্যমে ফিরে আসে—এ ঘটনাকে আলোর প্রতিফলন বলে। প্রতিফলনের সূত্র, অবতল ও উত্তল গোলীয় দর্পণে প্রতিবিম্ব গঠন, রশ্মিচিত্র অঙ্কন এবং দর্পণ সমীকরণ ($1/u + 1/v = 1/f$) এ অধ্যায়ের মূল আলোচ্য বিষয়।',
    summaryEn:
      'When light traveling in a medium encounters a boundary, a fraction rebounds into the original medium—a phenomenon known as reflection. Laws of reflection, concave and convex mirrors, ray tracing diagrams, and the mirror formula ($1/u + 1/v = 1/f$) form this chapter’s core.',
    nodes: [
      {
        id: 'c8-reflection-laws',
        titleBn: 'প্রতিফলনের সূত্র ও সমতল দর্পণ',
        titleEn: 'Laws of Reflection & Plane Mirrors',
        descriptionBn:
          '১ম সূত্র: আপতিত রশ্মি, প্রতিফলিত রশ্মি এবং আপতন বিন্দুতে অঙ্কিত অভিলম্ব একই সমতলে অবস্থান করে। ২য় সূত্র: আপতন কোণ এবং প্রতিফলন কোণ সর্বদা সমান হয় ($\\angle i = \\angle r$)। সমতল দর্পণে গঠিত প্রতিবিম্ব সর্বদা অবাস্তব, সোজা, বস্তুর সমান আকারের এবং পার্শ্বীয় পরিবর্তন ঘটে।',
        descriptionEn:
          '1st Law: Incident ray, reflected ray, and normal lie in the same plane. 2nd Law: Angle of incidence equals angle of reflection ($\angle i = \angle r$). Plane mirrors form virtual, erect, equal-sized images with lateral inversion.',
        formulaLatex: '\\angle i = \\angle r',
        realWorldExampleBn:
          'ড্রেসিং টেবিলের আয়নার সামনে দাঁড়ালে তোমার ডান হাত তুললে আয়নায় তা বাম হাত মনে হয়—এটি হলো সমতল দর্পণের পার্শ্বীয় পরিবর্তন (Lateral Inversion)।',
        realWorldExampleEn:
          'Looking into a dressing table mirror, raising your right hand appears as the left hand—a classic example of lateral inversion.',
      },
      {
        id: 'c8-spherical-mirrors',
        titleBn: 'গোলীয় দর্পণ (অবতল বনাম উত্তল)',
        titleEn: 'Spherical Mirrors (Concave vs Convex)',
        descriptionBn:
          'কোনো গোলীয় পৃষ্ঠের ভিতরের অবতল অংশ প্রতিফলক হিসেবে কাজ করলে তাকে অবতল দর্পণ (অভিসারী) বলে। আর বাইরের উত্তল অংশ প্রতিফলক হলে তাকে উত্তল দর্পণ (অপসারী) বলে। বক্রতার ব্যাসার্ধ ফোকাস দূরত্বের দ্বিগুণ: $r = 2f$।',
        descriptionEn:
          'If the inner hollow curve reflects light, it is a concave mirror (converging). If the outer bulge reflects, it is convex (diverging). Radius of curvature is twice focal length ($r = 2f$).',
        formulaLatex: 'f = \\frac{r}{2}',
        realWorldExampleBn:
          'একটি চকচকে স্টিলের চামচের ভেতরের খোলস অবতল দর্পণের মতো এবং পেছনের মসৃণ পিঠ উত্তল দর্পণের মতো কাজ করে।',
        realWorldExampleEn:
          'A shiny stainless-steel spoon’s bowl acts as a concave mirror, while its backside acts as a convex mirror.',
      },
      {
        id: 'c8-mirror-formula',
        titleBn: 'দর্পণ সমীকরণ ও দূরত্ব চিহ্ন প্রথা',
        titleEn: 'Mirror Formula & Cartesian Sign Convention',
        descriptionBn:
          'লক্ষ্যবস্তুর দূরত্ব ($u$), প্রতিবিম্বের দূরত্ব ($v$) এবং ফোকাস দূরত্ব ($f$) এর মধ্যকার মৌলিক সমীকরণ: $\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f}$। অবতল দর্পণের ফোকাস দূরত্ব ধনাত্মক ($f > 0$) এবং উত্তল দর্পণের ফোকাস দূরত্ব ঋণাত্মক ($f < 0$)। বাস্তব প্রতিবিম্বে $v > 0$ এবং অবাস্তব প্রতিবিম্বে $v < 0$।',
        descriptionEn:
          'The governing spherical mirror relationship is $1/u + 1/v = 1/f$. For concave mirrors, $f > 0$; for convex mirrors, $f < 0$. Real images have $v > 0$, while virtual images have $v < 0$.',
        formulaLatex: '\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f}',
        realWorldExampleBn:
          'দাঁতের ডাক্তাররা মুখের ভেতরের দাঁত বড় করে দেখার জন্য অবতল দর্পণ ব্যবহার করেন (ফোকাসের ভেতরে বস্তু রাখলে সোজা ও বিশাল বিবর্ধিত অবাস্তব প্রতিবিম্ব গঠিত হয়)।',
        realWorldExampleEn:
          'Dentists use concave mirrors to inspect teeth because placing the object inside the focal length yields an enlarged, erect virtual image.',
      },
      {
        id: 'c8-magnification',
        titleBn: 'রৈখিক বিবর্ধন (Linear Magnification)',
        titleEn: 'Linear Magnification (m)',
        descriptionBn:
          'প্রতিবিম্বের দৈর্ঘ্য ও লক্ষ্যবস্তুর দৈর্ঘ্যের অনুপাতকে রৈখিক বিবর্ধন ($m$) বলে: $m = -\\frac{v}{u} = \\frac{l\'}{l}$। বিবর্ধন ঋণাত্মক হলে প্রতিবিম্ব বাস্তব ও উল্টো, আর ধনাত্মক হলে অবাস্তব ও সোজা।',
        descriptionEn:
          'Linear magnification ($m$) is image length divided by object length: $m = -v/u = l\'/l$. Negative $m$ signifies real and inverted images; positive $m$ indicates virtual and erect images.',
        formulaLatex: 'm = -\\frac{v}{u} = \\frac{\\text{প্রতিবিম্বের দৈর্ঘ্য (}l\'\\text{)}}{\\text{বস্তুর দৈর্ঘ্য (}l\\text{)}}',
        realWorldExampleBn:
          'গাড়ির সাইড মিররে উত্তল দর্পণ ব্যবহার করা হয় কারণ এতে পেছনের বিশাল এলাকা নিয়ে সবসময় ছোট ও সোজা ($m < 1$) অবাস্তব প্রতিবিম্ব দেখা যায়।',
        realWorldExampleEn:
          'Vehicle rear-view side mirrors employ convex surfaces to produce diminished, upright ($m < 1$) virtual images covering wide visual angles.',
      },
    ],
  },
  step2: {
    simulatorType: 'reflection',
    instructionsBn:
      'অবতল ও উত্তল দর্পণ ট্যাবে ক্লিক করে সুইচ করো। লক্ষ্যবস্তুর দূরত্বের (u) স্লাইডার পরিবর্তন করে দেখো কীভাবে ফোকাস বিন্দু (F) ও বক্রতার কেন্দ্র (C) সাপেক্ষে রশ্মিগুলো প্রতিফলিত হয়ে প্রতিবিম্ব গঠন করে।',
    instructionsEn:
      'Toggle between concave and convex mirror tabs. Adjust object distance (u) to observe how principal rays reflect through Focus (F) and Center of Curvature (C) to form real or virtual images.',
    controls: [
      {
        key: 'objectDistU',
        labelBn: 'বস্তুর দূরত্ব u (সে.মি.)',
        labelEn: 'Object Distance u (cm)',
        defaultValue: 25,
        min: 5,
        max: 45,
        step: 1,
        unit: 'cm',
      },
    ],
    keyObservationTipBn:
      'বোর্ডের আঁকা রশ্মিচিত্রের মূল রহস্য: ১) সমান্তরাল রশ্মি ফোকাস দিয়ে যায়, ২) বক্রতার কেন্দ্রগামী রশ্মি ঠিক একই পথে ফিরে আসে, ৩) লক্ষ্যবস্তু বক্রতার কেন্দ্রে ($u = 2f$) থাকলে প্রতিবিম্বও ঠিক বক্রতার কেন্দ্রেই গঠিত হয় এবং তার আকার বস্তুর হুবহু সমান হয় ($m = 1$)!',
    keyObservationTipEn:
      'Key rule of ray tracing: 1) Parallel rays reflect through focus, 2) Rays through center of curvature retrace their path, 3) Placing an object at center of curvature ($u = 2f$) forms an inverted image at the identical location with unit magnification ($m = 1$).',
  },
  step3: {
    coreFormulaLatex: '\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f} \\quad \\text{এবং} \\quad m = -\\frac{v}{u}',
    variableDefinitions: [
      {
        symbol: 'u',
        nameBn: 'দর্পণ থেকে লক্ষ্যবস্তুর দূরত্ব',
        nameEn: 'Object Distance',
        siUnit: 'm \\text{ বা } cm',
      },
      {
        symbol: 'v',
        nameBn: 'দর্পণ থেকে প্রতিবিম্বের দূরত্ব',
        nameEn: 'Image Distance',
        siUnit: 'm \\text{ বা } cm',
      },
      {
        symbol: 'f',
        nameBn: 'দর্পণের ফোকাস দূরত্ব',
        nameEn: 'Focal Length',
        siUnit: 'm \\text{ বা } cm',
      },
      {
        symbol: 'r',
        nameBn: 'বক্রতার ব্যাসার্ধ (r = 2f)',
        nameEn: 'Radius of Curvature',
        siUnit: 'm \\text{ বা } cm',
      },
      {
        symbol: 'm',
        nameBn: 'রৈখিক বিবর্ধন',
        nameEn: 'Linear Magnification',
        siUnit: '\\text{এককহীন (Dimensionless)}',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'দর্পণ সমীকরণ প্রতিষ্ঠা',
        labelEn: 'Establishing Mirror Relationship',
        latexExpression: '\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f} = \\frac{2}{r}',
        explanationBn:
          'ক্ষুদ্র উন্মেষযুক্ত গোলীয় দর্পণে জ্যামিতিক সদৃশকোণী ত্রিভুজের অনুপাত থেকে সমীকরণটি প্রতিপাদিত হয়।',
        explanationEn:
          'Derived via similar triangles formed by object and image rays under small aperture approximations.',
      },
      {
        stepNumber: 2,
        labelBn: 'প্রতিবিম্বের দূরত্বের সমাধান',
        labelEn: 'Solving for Image Distance v',
        latexExpression: '\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{u - f}{uf} \\implies v = \\frac{uf}{u - f}',
        explanationBn:
          'বীজগাণিতিক ভগ্নাংশের লঘিষ্ঠ সাধারণ গুণিতক করে সরাসরি প্রতিবিম্বের দূরত্বের সূত্র পাওয়া যায়।',
        explanationEn:
          'Inverting the fractional sum yields the explicit solution: $v = (uf) / (u - f)$.',
      },
      {
        stepNumber: 3,
        labelBn: 'রৈখিক বিবর্ধনের সূত্র',
        labelEn: 'Formulation of Magnification',
        latexExpression: 'm = -\\frac{v}{u}',
        explanationBn:
          'মাইনাস চিহ্ন দিয়ে প্রতিবিম্বের দিক নির্দেশ করা হয়: $m < 0$ হলে বাস্তব ও উল্টো, $m > 0$ হলে অবাস্তব ও সোজা।',
        explanationEn:
          'The negative sign represents orientation: $m < 0$ is inverted; $m > 0$ is upright.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        '$15\\text{ cm}$ ফোকাস দূরত্বের একটি অবতল দর্পণের সামনে $30\\text{ cm}$ দূরে একটি বস্তু স্থাপন করা হলো। প্রতিবিম্বের দূরত্ব ও প্রকৃতি নির্ণয় করো।',
      problemEn:
        'An object is placed $30\\text{ cm}$ in front of a concave mirror of focal length $15\\text{ cm}$. Find the image distance and nature.',
      solutionStepsBn: [
        '১. প্রদত্ত উপাত্ত: অবতল দর্পণ হওয়ায় $f = +15\\text{ cm}$, বস্তুর দূরত্ব $u = +30\\text{ cm}$',
        '২. সূত্র লিখি: $\\frac{1}{u} + \\frac{1}{v} = \\frac{1}{f} \\implies \\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u}$',
        '৩. মান বসাই: $\\frac{1}{v} = \\frac{1}{15} - \\frac{1}{30} = \\frac{2 - 1}{30} = \\frac{1}{30}$',
        '৪. হিসাব: $v = +30\\text{ cm}$',
        '৫. বিবর্ধন: $m = -\\frac{v}{u} = -\\frac{30}{30} = -1$',
        '৬. সিদ্ধান্ত: প্রতিবিম্ব দর্পণের সামনে $30\\text{ cm}$ দূরে গঠিত হবে; এটি বাস্তব, উল্টো এবং বস্তুর সমান আকারের হবে।',
      ],
      solutionStepsEn: [
        '1. Given: $f = +15\text{ cm}, u = +30\text{ cm}$',
        '2. Formula: $1/v = 1/f - 1/u$',
        '3. Substitute: $1/v = 1/15 - 1/30 = 1/30 \implies v = +30\text{ cm}$',
        '4. Magnification: $m = -v/u = -30/30 = -1$',
        '5. Conclusion: Real, inverted, equal size, located at center of curvature ($30\text{ cm}$).',
      ],
      finalAnswerWithUnit: 'v = 30\\text{ cm},\\; m = -1 \\text{ (বাস্তব ও উল্টো)}',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-convex-mirror-focal-sign',
        titleBn: 'উত্তল দর্পণের ফোকাস দূরত্বে ঋণাত্মক (-) চিহ্ন না দেওয়া',
        titleEn: 'Forgetting Negative Sign for Convex Mirror Focal Length',
        lostMarks: 2,
        frequentlyTestedIn: 'গ ও ঘ-অংশ (বোর্ডে সবচেয়ে মারাত্মক ফাঁদ)',
        commonMistakeBn:
          'উদ্দীপকে বলে "একটি উত্তল দর্পণের ফোকাস দূরত্ব ২০ সে.মি.", ছাত্রছাত্রীরা সূত্রে সরাসরি $f = +20$ বসিয়ে দেয়।',
        commonMistakeEn:
          'Plugging $f = +20$ instead of $f = -20$ for convex mirrors in the mirror equation.',
        correctApproachBn:
          'উত্তল দর্পণের ফোকাস ও বক্রতার কেন্দ্র দর্পণের পেছনে (অবাস্তব দিকে) থাকে। তাই উত্তল দর্পণের ক্ষেত্রে ফোকাস দূরত্ব সর্বদা ঋণাত্মক: $f = -20\\text{ cm}$।',
        correctApproachEn:
          'Convex mirror focal points lie behind the reflective surface; $f$ is strictly negative: $f = -20\text{ cm}$.',
        examinerSecretTipBn:
          'খাতায় উত্তল দর্পণ দেখলেই আগে খাতায় লিখে নাও $f = -\\text{মান}$। এটি মিস করলে পুরো অংক শূন্য পাবে।',
        examinerSecretTipEn:
          'Whenever you see the word "convex mirror", immediately write $f$ as negative.',
      },
      {
        id: 'trap-2-virtual-image-sign',
        titleBn: 'অবাস্তব প্রতিবিম্বের ক্ষেত্রে v এর চিহ্নে প্লাস লিখে বসা',
        titleEn: 'Using Positive Sign for Virtual Image Distances',
        lostMarks: 1,
        frequentlyTestedIn: 'গ-অংশ',
        commonMistakeBn:
          'উদ্দীপকে বলে "দর্পণ থেকে ১০ সে.মি. পেছনে অবাস্তব প্রতিবিম্ব গঠিত হলো", কিন্তু সূত্রে $v = +10$ বসিয়ে দেয়।',
        commonMistakeEn:
          'Writing $v = +10$ when the prompt specifies a virtual image formed behind the mirror.',
        correctApproachBn:
          'অবাস্তব প্রতিবিম্বের জন্য $v$ ঋণাত্মক: $v = -10\\text{ cm}$।',
        correctApproachEn:
          'Virtual images formed behind reflective boundaries take negative sign: $v = -10\text{ cm}$.',
        examinerSecretTipBn:
          'বাস্তব প্রতিবিম্ব = $v$ ধনাত্মক (+), অবাস্তব প্রতিবিম্ব = $v$ ঋণাত্মক (-)।',
        examinerSecretTipEn:
          'Real image = positive $v$; virtual image = negative $v$.',
      },
      {
        id: 'trap-3-magnification-minus-sign',
        titleBn: 'বিবর্ধনে ঋণাত্মক চিহ্নের প্রকৃত অর্থ না বোঝা',
        titleEn: 'Misinterpreting Negative Sign in Magnification Formula',
        lostMarks: 1,
        frequentlyTestedIn: 'খ ও ঘ-অংশ',
        commonMistakeBn:
          'বিবর্ধন $m = -2$ বের হলে ছাত্রছাত্রীরা মনে করে প্রতিবিম্বটি হয়তো ছোট হয়ে গেছে (যেহেতু মান মাইনাস)!',
        commonMistakeEn:
          'Believing $m = -2$ means the image is diminished because $-2 < 1$.',
        correctApproachBn:
          'বিবর্ধনে মাইনাস চিহ্ন বোঝায় প্রতিবিম্বটি "উল্টো ও বাস্তব"। আর সংখ্যামান $|m| = 2 > 1$ বোঝায় প্রতিবিম্বটি বস্তুর চেয়ে দ্বিগুণ বড় (বিবর্ধিত)।',
        correctApproachEn:
          'The negative sign strictly signifies inversion. The absolute magnitude $|m| = 2$ means the image is twice as large.',
        examinerSecretTipBn:
          'পরীক্ষক ব্যাখ্যার সময় দেখতে চান তুমি চিহ্নের প্রকৃতি এবং মানের আকার পৃথকভাবে ব্যাখ্যা করেছ কি না।',
        examinerSecretTipEn:
          'Examiners check that you decoupled orientation (inverted) from size scaling ($|m| > 1$).',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-mirror-center-mag',
        questionBn:
          'একটি অবতল দর্পণের বক্রতার কেন্দ্রে কোনো লক্ষ্যবস্তু স্থাপন করলে এর রৈখিক বিবর্ধন (m) কত হবে?',
        questionEn:
          'What is the linear magnification (m) when an object is placed at the center of curvature of a concave mirror?',
        questionType: 'MCQ',
        optionsBn: ['-1', '+1', '-0.5', 'অসীম (Infinity)'],
        optionsEn: ['-1', '+1', '-0.5', 'Infinity'],
        correctOptionIndex: 0,
        explanationBn:
          'বক্রতার কেন্দ্রে বস্তু রাখলে প্রতিবিম্ব বক্রতার কেন্দ্রেই গঠিত হয় ($u = v = 2f$)। এটি বাস্তব ও উল্টো হওয়ায় $m = -v/u = -2f/2f = -1$। সঠিক উত্তর ক (-1)।',
        explanationEn:
          'At center of curvature, $u = v = 2f$. The real inverted image has $m = -v/u = -1$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৪',
      },
      {
        id: 'q2-mirror-convex-nature',
        questionBn: 'উত্তল দর্পণে গঠিত প্রতিবিম্ব সর্বদা কেমন হয়?',
        questionEn: 'What is always the nature of an image formed by a convex mirror?',
        questionType: 'MCQ',
        optionsBn: [
          'অবাস্তব ও সোজা (Virtual & Erect)',
          'বাস্তব ও উল্টো (Real & Inverted)',
          'বাস্তব ও সোজা (Real & Erect)',
          'অবাস্তব ও উল্টো (Virtual & Inverted)',
        ],
        optionsEn: [
          'Virtual & Erect',
          'Real & Inverted',
          'Real & Erect',
          'Virtual & Inverted',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'উত্তল দর্পণ অপসারী হওয়ায় এর প্রতিবিম্ব সর্বদা দর্পণের পেছনে অবাস্তব, সোজা এবং লক্ষ্যবস্তুর চেয়ে খর্বিত (ছোট) হয়।',
        explanationEn:
          'A convex mirror is diverging, always creating virtual, upright, diminished images behind the mirror.',
        boardSource: 'দিনাজপুর বোর্ড ২০২৩',
      },
      {
        id: 'q3-mirror-focal-calc',
        questionBn:
          'একটি গোলীয় দর্পণের বক্রতার ব্যাসার্ধ $40\\text{ cm}$ হলে এর ফোকাস দূরত্ব কত?',
        questionEn:
          'What is the focal length of a spherical mirror with radius of curvature $40\text{ cm}$?',
        questionType: 'MCQ',
        optionsBn: ['20 cm', '40 cm', '80 cm', '10 cm'],
        optionsEn: ['20 cm', '40 cm', '80 cm', '10 cm'],
        correctOptionIndex: 0,
        explanationBn:
          '$f = \\frac{r}{2} = \\frac{40}{2} = 20\\text{ cm}$। সঠিক উত্তর ক।',
        explanationEn:
          '$f = r / 2 = 40 / 2 = 20\text{ cm}$. Option A is correct.',
        boardSource: 'রাজশাহী বোর্ড ২০২২',
      },
    ],
  },
};
