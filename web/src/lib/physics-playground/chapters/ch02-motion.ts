import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 2)!;

export const CH02_MOTION_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'গতি হলো সময়ের সাথে পারিপার্শ্বিকের সাপেক্ষে কোনো বস্তুর অবস্থানের পরিবর্তন। দূরত্ব, সরণ, বেগ, ত্বরণ এবং সুষম ত্বরণের ৪টি গতির সমীকরণ এসএসসি পদার্থবিজ্ঞানের সবচেয়ে গুরুত্বপূর্ণ ও নিয়মিত পরীক্ষিত অধ্যায়।',
    summaryEn:
      'Motion is the change in position of an object over time relative to a reference frame. Scalars vs vectors, velocity, acceleration, and the four kinematics equations are the most heavily tested topics in SSC Physics.',
    nodes: [
      {
        id: 'c2-scalar-vector',
        titleBn: 'দূরত্ব বনাম সরণ (স্কেলার ও ভেক্টর)',
        titleEn: 'Distance vs Displacement (Scalar & Vector)',
        descriptionBn:
          'দূরত্ব হলো কোনো বস্তু দ্বারা অতিক্রান্ত পথের মোট দৈর্ঘ্য (স্কেলার রাশি, দিক নেই)। কিন্তু সরণ হলো আদি অবস্থান থেকে শেষ অবস্থানের দিকে নির্দিষ্ট দিকে সরলরৈখিক ন্যূনতম দূরত্ব (ভেক্টর রাশি, দিক আছে)। একটি পূর্ণ বৃত্তাকার পথ ঘুরে আসলে দূরত্ব $2\\pi r$ হলেও সরণ হবে শূন্য ($s = 0$)!',
        descriptionEn:
          'Distance is the total path length traversed (scalar). Displacement is the shortest straight-line distance from initial to final position (vector). Completing a circular lap has distance $2\\pi r$, but displacement is zero ($s = 0$).',
        formulaLatex: '\\vec{s} = \\vec{r_f} - \\vec{r_i}',
        realWorldExampleBn:
          'তুমি স্কুল থেকে মাঠে গেলে, তারপর আবার স্কুলে ফিরলে। তোমার পায়ে হাঁটা দূরত্ব ৫০০ মিটার হতে পারে, কিন্তু তোমার সরণ কিন্তু ০ মিটার!',
        realWorldExampleEn:
          'Walking from school to the sports field and back: Traveled distance might be 500m, but total displacement is 0m.',
      },
      {
        id: 'c2-velocity-acceleration',
        titleBn: 'বেগ, সুষম ত্বরণ ও মন্দন',
        titleEn: 'Velocity, Uniform Acceleration & Deceleration',
        descriptionBn:
          'সময়ের সাথে সরণের পরিবর্তনের হারকে বেগ বলে ($v = s/t$)। আর বেগের পরিবর্তনের হারকে ত্বরণ ($a = \\frac{v - u}{t}$) বলে। বেগ হ্রাস পেলে তাকে ঋণাত্মক ত্বরণ বা মন্দন (Deceleration) বলা হয়।',
        descriptionEn:
          'Rate of change of displacement is velocity ($v = s/t$). Rate of change of velocity is acceleration ($a = (v - u) / t$). Decreasing velocity gives negative acceleration or deceleration.',
        formulaLatex: 'a = \\frac{v - u}{t}',
        realWorldExampleBn:
          'ট্রাফিক সিগন্যালে দাঁড়িয়ে থাকা একটি বাস সবুজ বাতি দেখে গতি বাড়াতে শুরু করলে তা ত্বরণ ($a > 0$), আবার পরবর্তী স্টপেজে ব্রেক কষলে তা মন্দন ($a < 0$)।',
        realWorldExampleEn:
          'A bus speeding up at green light undergoes acceleration ($a > 0$); pressing the brake at the next station creates deceleration ($a < 0$).',
      },
      {
        id: 'c2-equations',
        titleBn: 'সুষম ত্বরণে গতির ৪টি মৌলিক সমীকরণ',
        titleEn: '4 Fundamental Kinematics Equations',
        descriptionBn:
          'সরলরেখায় সুষম ত্বরণে চলমান কোনো বস্তুর ক্ষেত্রে আদিবেগ ($u$), শেষবেগ ($v$), ত্বরণ ($a$), সময় ($t$) ও সরণ ($s$) এর মধ্যকার চারটি সুনির্দিষ্ট সমীকরণ রয়েছে। উদ্দীপকে কোন কোন চলক দেওয়া আছে তা দেখে সঠিক সমীকরণ বাছাই করতে হয়।',
        descriptionEn:
          'For a body moving along a straight line under uniform acceleration, four equations link $u, v, a, t, s$. Identifying given and unknown variables dictates which formula to apply.',
        formulaLatex: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 = u^2 + 2as, \\quad s = \\left(\\frac{u + v}{2}\\right)t',
        realWorldExampleBn:
          'একটি গাড়ির আদিবেগ জানা থাকলে এবং নির্দিষ্ট সময় পর কত দূর যাবে তা হিসাব করতে $s = ut + \\frac{1}{2}at^2$ ব্যবহার করা হয়।',
        realWorldExampleEn:
          'Knowing a vehicle’s starting speed and acceleration, distance covered in time $t$ is calculated via $s = ut + \\frac{1}{2}at^2$.',
      },
      {
        id: 'c2-freefall',
        titleBn: 'পড়ন্ত বস্তুর সূত্র ও অভিকর্ষজ ত্বরণ (g)',
        titleEn: 'Freely Falling Bodies & Gravity (g)',
        descriptionBn:
          'স্থির অবস্থান থেকে মুক্তভাবে পড়ন্ত সকল বস্তু সমান সময়ে সমান পথ অতিক্রম করে। ভূপৃষ্ঠে অভিকর্ষজ ত্বরণ $g = 9.8\\text{ m/s}^2$। কোনো বস্তুকে খাড়া উপরের দিকে নিক্ষেপ করা হলে অভিকর্ষজ ত্বরণ ঋণাত্মক হিসেবে কাজ করে ($a = -g$)।',
        descriptionEn:
          'All bodies falling freely in a vacuum traverse equal distances in equal times. Acceleration due to gravity is $g = 9.8\\text{ m/s}^2$. For vertically upward thrown objects, gravity acts negatively ($a = -g$).',
        formulaLatex: 'v = u - gt, \\quad h = ut - \\frac{1}{2}gt^2, \\quad v^2 = u^2 - 2gh',
        realWorldExampleBn:
          'ছাদ থেকে একটি ভারী বল ও একটি হালকা মার্বেল ফেলে দিলে বায়ুর বাধা না থাকলে তারা একই সাথে মাটিতে পড়বে।',
        realWorldExampleEn:
          'Dropping a heavy ball and a marble simultaneously in a vacuum makes them strike the ground at the identical moment.',
      },
    ],
  },
  step2: {
    simulatorType: 'motion',
    instructionsBn:
      'গাড়ির আদিবেগ (u) ও সুষম ত্বরণ (a) স্লাইডার দিয়ে সেট করো। এরপর "স্টার্ট" বোতাম চেপে গাড়ির গতিশীল দৃশ্যটি দেখো। নিচে লাইভ বেগ (v), সরণ (s) এবং ৪টি সমীকরণের মান যুগপৎভাবে পর্যবেক্ষণ করো।',
    instructionsEn:
      'Set initial velocity (u) and uniform acceleration (a) via sliders. Click "Start Motion" to watch the animated vehicle. Live speed, distance, and all 4 kinematics formulas compute in real time.',
    controls: [
      {
        key: 'initialVelocityU',
        labelBn: 'আদিবেগ u (মি./সে.)',
        labelEn: 'Initial Velocity u (m/s)',
        defaultValue: 5,
        min: 0,
        max: 20,
        step: 1,
        unit: 'm/s',
      },
      {
        key: 'accelerationA',
        labelBn: 'ত্বরণ a (মি./সে.²)',
        labelEn: 'Acceleration a (m/s²)',
        defaultValue: 2,
        min: -3,
        max: 6,
        step: 0.5,
        unit: 'm/s²',
      },
    ],
    keyObservationTipBn:
      'লক্ষ করো: ত্বরণ যখন ধনাত্মক ($a > 0$), গাড়ির বেগ সময়ের সাথে সরলরৈখিকভাবে বাড়ে, কিন্তু সরণ সময়ের বর্গের সাথে দ্বিগুণ দ্রুত বাড়ে ($s \\propto t^2$)। আবার ত্বরণ শূন্য ($a = 0$) হলে বেগ স্থির থাকে এবং গাড়ি সুষম বেগে চলে ($s = vt$)।',
    keyObservationTipEn:
      'Notice: Under positive acceleration ($a > 0$), velocity increases linearly while displacement scales parabolically with time squared ($s \\propto t^2$). When $a = 0$, velocity is constant and $s = vt$.',
  },
  step3: {
    coreFormulaLatex: 'v = u + at \\quad \\text{এবং} \\quad s = ut + \\frac{1}{2}at^2',
    variableDefinitions: [
      {
        symbol: 'u',
        nameBn: 'আদিবেগ',
        nameEn: 'Initial Velocity',
        siUnit: 'm/s',
      },
      {
        symbol: 'v',
        nameBn: 'শেষবেগ',
        nameEn: 'Final Velocity',
        siUnit: 'm/s',
      },
      {
        symbol: 'a',
        nameBn: 'সুষম ত্বরণ / মন্দন',
        nameEn: 'Uniform Acceleration',
        siUnit: 'm/s^2',
      },
      {
        symbol: 't',
        nameBn: 'সময়কাল',
        nameEn: 'Time Duration',
        siUnit: 's',
      },
      {
        symbol: 's',
        nameBn: 'অতিক্রান্ত সরণ / দূরত্ব',
        nameEn: 'Displacement',
        siUnit: 'm',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'ত্বরণের সংজ্ঞা হতে ১ম সমীকরণ',
        labelEn: 'First Equation from Definition of Acceleration',
        latexExpression: 'a = \\frac{v - u}{t} \\implies at = v - u \\implies v = u + at',
        explanationBn:
          'ত্বরণ হলো একক সময়ে বেগের পরিবর্তন। বজ্রগুণন করে পাই $v = u + at$।',
        explanationEn:
          'Acceleration is change in velocity per unit time. Cross-multiplying yields $v = u + at$.',
      },
      {
        stepNumber: 2,
        labelBn: 'গড় বেগের সাহায্যে দূরত্ব নির্ণয়',
        labelEn: 'Displacement via Average Velocity',
        latexExpression: 'v_{\\text{avg}} = \\frac{u + v}{2} \\implies s = v_{\\text{avg}} \\times t = \\left(\\frac{u + v}{2}\\right)t',
        explanationBn:
          'সুষম ত্বরণের ক্ষেত্রে গড় বেগ হলো আদিবেগ ও শেষবেগের গাণিতিক গড়। সরণ = গড় বেগ × সময়।',
        explanationEn:
          'For uniform acceleration, average velocity is the arithmetic mean of $u$ and $v$. Displacement = $v_{\\text{avg}} \\times t$.',
      },
      {
        stepNumber: 3,
        labelBn: 'v এর মান প্রতিস্থাপন করে ২য় সমীকরণ',
        labelEn: 'Substituting v to derive Second Equation',
        latexExpression: 's = \\left(\\frac{u + (u + at)}{2}\\right)t = \\left(\\frac{2u + at}{2}\\right)t = ut + \\frac{1}{2}at^2',
        explanationBn:
          'প্রথম সমীকরণ থেকে প্রাপ্ত $v = u + at$ বসিয়ে পাই বিখ্যাত সমীকরণ $s = ut + \\frac{1}{2}at^2$।',
        explanationEn:
          'Substituting $v = u + at$ gives the milestone equation $s = ut + \\frac{1}{2}at^2$.',
      },
      {
        stepNumber: 4,
        labelBn: 'সময় t বর্জন করে ৩য় সমীকরণ',
        labelEn: 'Eliminating Time t for Third Equation',
        latexExpression: 't = \\frac{v - u}{a} \\implies s = \\left(\\frac{u + v}{2}\\right)\\left(\\frac{v - u}{a}\\right) = \\frac{v^2 - u^2}{2a} \\implies v^2 = u^2 + 2as',
        explanationBn:
          'সময় $t$ এর মান অপর সমীকরণে বর্জন করলে পাওয়া যায় $v^2 = u^2 + 2as$।',
        explanationEn:
          'Eliminating time parameter $t$ produces $v^2 = u^2 + 2as$.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'স্থির অবস্থান থেকে একটি গাড়ি $2\\text{ m/s}^2$ সুষম ত্বরণে $10\\text{ s}$ চলল। এরপর গাড়িটি $1\\text{ মিনিট}$ সুষম বেগে চলল। গাড়িটি মোট কত দূরত্ব অতিক্রম করবে?',
      problemEn:
        'Starting from rest, a car accelerates at $2\\text{ m/s}^2$ for $10\\text{ s}$, then travels at uniform velocity for $1\\text{ minute}$. What is the total distance covered?',
      solutionStepsBn: [
        '১. প্রথম ধাপ (সুষম ত্বরণে): আদিবেগ $u = 0$, $a = 2\\text{ m/s}^2$, $t_1 = 10\\text{ s}$',
        '   দূরত্ব $s_1 = ut_1 + \\frac{1}{2}at_1^2 = 0 + \\frac{1}{2}(2)(10)^2 = 100\\text{ m}$',
        '২. ১০ সেকেন্ড পর অর্জিত শেষবেগ $v = u + at_1 = 0 + (2)(10) = 20\\text{ m/s}$',
        '৩. দ্বিতীয় ধাপ (সুষম বেগে): বেগ $v = 20\\text{ m/s}$, সময় $t_2 = 1\\text{ min} = 60\\text{ s}$',
        '   দূরত্ব $s_2 = v \\times t_2 = 20 \\times 60 = 1200\\text{ m}$',
        '৪. মোট অতিক্রান্ত দূরত্ব: $s = s_1 + s_2 = 100\\text{ m} + 1200\\text{ m} = 1300\\text{ m}$',
      ],
      solutionStepsEn: [
        '1. Phase 1 (Acceleration): $u = 0, a = 2\\text{ m/s}^2, t_1 = 10\\text{ s} \\implies s_1 = 0 + \\frac{1}{2}(2)(10)^2 = 100\\text{ m}$',
        '2. Velocity attained at 10s: $v = u + at = 0 + (2)(10) = 20\\text{ m/s}$',
        '3. Phase 2 (Uniform speed): $t_2 = 60\\text{ s} \\implies s_2 = v \\times t_2 = 20 \\times 60 = 1200\\text{ m}$',
        '4. Total distance: $s = s_1 + s_2 = 100 + 1200 = 1300\\text{ m}$',
      ],
      finalAnswerWithUnit: 's = 1300\\text{ m} = 1.3\\text{ km}',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-kmh-to-ms',
        titleBn: 'কিমি/ঘণ্টা (km/h) কে মি./সেকেন্ডে (m/s) রূপান্তর না করে সূত্রে বসানো',
        titleEn: 'Failing to Convert km/h to m/s before Plugging into Equations',
        lostMarks: 2,
        frequentlyTestedIn: 'গ ও ঘ-অংশ (৩ ও ৪ নম্বর সৃজনশীল)',
        commonMistakeBn:
          'উদ্দীপকে দেওয়া থাকে $72\\text{ km/h}$, ছাত্রছাত্রীরা সরাসরি সূত্রে $u = 72$ বসিয়ে দেয়। ফলে ত্বরণ ও দূরত্বের পুরো হিসাবই ভুল হয়ে যায়।',
        commonMistakeEn:
          'Plugging $72\\text{ km/h}$ directly as $u = 72$ without converting to SI unit $m/s$.',
        correctApproachBn:
          'সবসময় $km/h$ কে $\\frac{1000}{3600}$ অর্থাৎ $\\frac{5}{18}$ দিয়ে গুণ করে $m/s$ এ নিতে হবে: $72 \\times \\frac{5}{18} = 20\\text{ m/s}$।',
        correctApproachEn:
          'Multiply by $5/18$ (or $1000/3600$) to convert to SI units: $72 \\times (5/18) = 20\\text{ m/s}$.',
        examinerSecretTipBn:
          'বোর্ড পরীক্ষক খাতা দেখেই প্রথমে তাকান তুমি একক রূপান্তর করেছ কি না। এটি প্রথম লাইনে রূপান্তর করে গোল দাগ দিয়ে স্পষ্ট রাখো।',
        examinerSecretTipEn:
          'Examiners check for unit conversion on line 1. Always convert units at the very beginning of your solution.',
      },
      {
        id: 'trap-2-upward-gravity',
        titleBn: 'নিক্ষিপ্ত বস্তুর ক্ষেত্রে অভিকর্ষজ ত্বরণের চিহ্ন ভুল করা',
        titleEn: 'Incorrect Sign for Gravitational Acceleration in Vertical Motion',
        lostMarks: 2,
        frequentlyTestedIn: 'ঘ-অংশ (উচ্চতর দক্ষতা ৪ নম্বর)',
        commonMistakeBn:
          'খাড়া উপরের দিকে নিক্ষিপ্ত বস্তুর সূত্রে $h = ut + \\frac{1}{2}gt^2$ লিখে ফেলা। বস্তু উপরের দিকে উঠলে $g$ গতির বিপরীতে কাজ করে।',
        commonMistakeEn:
          'Using $+g$ instead of $-g$ for upward thrown bodies: $h = ut + 0.5gt^2$ instead of $ut - 0.5gt^2$.',
        correctApproachBn:
          'উপরে ওঠার ক্ষেত্রে মন্দন ঘটে, তাই সূত্র হবে $v = u - gt$ এবং $h = ut - \\frac{1}{2}gt^2$। আর সর্বোচ্চ উচ্চতায় শেষবেগ $v = 0$।',
        correctApproachEn:
          'Since gravity opposes upward motion, use $v = u - gt$ and $h = ut - \\frac{1}{2}gt^2$. At peak height, $v = 0$.',
        examinerSecretTipBn:
          'স্মরণ রাখো: উপরে নিক্ষেপ মানেই সূত্রে মাইনাস ($-gt$), নিচে পড়া মানেই সূত্রে প্লাস ($+gt$)।',
        examinerSecretTipEn:
          'Upward flight = subtract gravity ($-gt$); downward fall = add gravity ($+gt$).',
      },
      {
        id: 'trap-3-vt-graph-area',
        titleBn: 'বেগ-সময় (v-t) লেখচিত্রে ক্ষেত্রফল বের করার সময় ত্রিভুজ ও আয়তক্ষেত্র গুলিয়ে ফেলা',
        titleEn: 'Miscalculating Area Under Velocity-Time (v-t) Graph',
        lostMarks: 3,
        frequentlyTestedIn: 'গ ও ঘ-অংশ (সৃজনশীল লেখচিত্রের অঙ্ক)',
        commonMistakeBn:
          'লেখচিত্র থেকে দূরত্ব বের করতে বলা হলে ছাত্রছাত্রীরা পুরো অংশের জন্য শুধু $s = vt$ সূত্র ব্যবহার করে ফেলে।',
        commonMistakeEn:
          'Applying $s = vt$ across accelerated zones of a velocity-time graph instead of computing geometric area.',
        correctApproachBn:
          'বেগ-সময় লেখচিত্রের নিচের ক্ষেত্রফলই হলো অতিক্রান্ত দূরত্ব: ত্বরণের অংশের জন্য ত্রিভুজের ক্ষেত্রফল ($\\frac{1}{2} \\times \\text{ভূমি} \\times \\text{উচ্চতা}$) এবং সুষম বেগের জন্য আয়তক্ষেত্রের ক্ষেত্রফল ($\\text{দৈর্ঘ্য} \\times \\text{প্রস্থ}$) যোগ করতে হবে।',
        correctApproachEn:
          'Total distance = Area under v-t graph. Sum the triangular area ($\frac{1}{2} b h$) for acceleration and rectangular area ($l w$) for uniform speed.',
        examinerSecretTipBn:
          'লেখচিত্রে কোনো জটিল সমীকরণ না লিখে জ্যামিতিক ক্ষেত্রফল (ট্র্যাপিজিয়াম বা ত্রিভুজ + আয়তক্ষেত্র) দিয়ে সমাধান করলে পরীক্ষক দ্রুত পূর্ণ নম্বর দেন।',
        examinerSecretTipEn:
          'Using trapezoid/geometric area on v-t graphs is faster and less prone to arithmetic error than stitching separate formulas.',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-motion-kmh',
        questionBn:
          'একটি গাড়ির বেগ $54\\text{ km/h}$ হলে এসআই (SI) এককে এর মান কত?',
        questionEn:
          'If a car’s velocity is $54\\text{ km/h}$, what is its value in SI units?',
        questionType: 'MCQ',
        optionsBn: ['15 m/s', '20 m/s', '10 m/s', '25 m/s'],
        optionsEn: ['15 m/s', '20 m/s', '10 m/s', '25 m/s'],
        correctOptionIndex: 0,
        explanationBn:
          '$\\text{বেগ} = 54 \\times \\frac{1000}{3600} = 54 \\times \\frac{5}{18} = 3 \\times 5 = 15\\text{ m/s}$। সঠিক উত্তর ক।',
        explanationEn:
          'Velocity $= 54 \\times (5/18) = 15\\text{ m/s}$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৪',
      },
      {
        id: 'q2-max-height',
        questionBn:
          'একটি বস্তুকে $19.6\\text{ m/s}$ বেগে খাড়া উপরের দিকে নিক্ষেপ করা হলে এটি সর্বোচ্চ কত উচ্চতায় উঠবে? ($g = 9.8\\text{ m/s}^2$)',
        questionEn:
          'A body is thrown vertically upward with $19.6\\text{ m/s}$. What is the maximum height attained? ($g = 9.8\\text{ m/s}^2$)',
        questionType: 'MCQ',
        optionsBn: ['19.6 m', '39.2 m', '9.8 m', '10 m'],
        optionsEn: ['19.6 m', '39.2 m', '9.8 m', '10 m'],
        correctOptionIndex: 0,
        explanationBn:
          'সর্বোচ্চ উচ্চতার সূত্র: $H = \\frac{u^2}{2g} = \\frac{(19.6)^2}{2 \\times 9.8} = \\frac{384.16}{19.6} = 19.6\\text{ m}$।',
        explanationEn:
          'Maximum height $H = u^2 / (2g) = (19.6)^2 / (2 \\times 9.8) = 19.6\\text{ m}$. Option A is correct.',
        boardSource: 'কুমিল্লা বোর্ড ২০২৩',
      },
      {
        id: 'q3-vt-slope',
        questionBn: 'বেগ-সময় (v-t) লেখচিত্রের ঢাল (Slope) কী নির্দেশ করে?',
        questionEn: 'What does the slope of a velocity-time (v-t) graph represent?',
        questionType: 'MCQ',
        optionsBn: ['সরণ', 'ত্বরণ', 'বল', 'ক্ষমতা'],
        optionsEn: ['Displacement', 'Acceleration', 'Force', 'Power'],
        correctOptionIndex: 1,
        explanationBn:
          '$\\text{ঢাল} = \\frac{\\Delta v}{\\Delta t} = a$ (ত্বরণ)। আর লেখচিত্রের ক্ষেত্রফল নির্দেশ করে সরণ।',
        explanationEn:
          'Slope $= \\Delta v / \\Delta t = a$ (acceleration). Area under the curve represents displacement.',
        boardSource: 'দিনাজপুর বোর্ড ২০২২',
      },
    ],
  },
};
