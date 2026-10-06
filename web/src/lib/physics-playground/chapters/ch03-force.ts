import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 3)!;

export const CH03_FORCE_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'বল হলো এমন এক বাহ্যিক প্রভাব যা স্থির বস্তুকে গতিশীল বা গতিশীল বস্তুকে স্থির করতে চায়। জড়তা, ভরবেগ, নিউটনের ৩টি বিখ্যাত গতিসূত্র, সংঘর্ষে ভরবেগের সংরক্ষণ এবং ঘর্ষণ বলের হিসাব এ অধ্যায়ের প্রাণকেন্দ্র।',
    summaryEn:
      'Force is the external interaction that alters or attempts to alter an object’s state of rest or uniform motion. Inertia, momentum, Newton’s 3 laws, conservation of momentum, and friction are the cornerstones of this chapter.',
    nodes: [
      {
        id: 'c3-inertia-newton1',
        titleBn: 'জড়তা ও নিউটনের ১ম গতিসূত্র',
        titleEn: 'Inertia & Newton’s First Law',
        descriptionBn:
          'বাহ্যিক কোনো বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং গতিশীল বস্তু সুষম দ্রুতিতে সরলপথে চলতে থাকবে। বস্তুর নিজস্ব অবস্থা বজায় রাখার এই স্বভাবসুলভ প্রবণতাকে জড়তা (Inertia) বলে। ভরের পরিমাণই হলো জড়তার পরিমাপ।',
        descriptionEn:
          'An object remains at rest or in uniform motion unless acted upon by a net external force. This intrinsic tendency to resist change in motion is inertia. Mass is the quantitative measure of inertia.',
        realWorldExampleBn:
          'চলন্ত বাস হঠাৎ ব্রেক কষলে যাত্রীরা সামনের দিকে ঝুঁকে পড়ে (গতি জড়তা), আবার থেমে থাকা বাস হঠাৎ চলতে শুরু করলে পেছনের দিকে হেলে পড়ে (স্থিতি জড়তা)।',
        realWorldExampleEn:
          'Sudden bus braking throws passengers forward (inertia of motion); rapid bus acceleration jolts passengers backward (inertia of rest).',
      },
      {
        id: 'c3-momentum-newton2',
        titleBn: 'ভরবেগ ও নিউটনের ২য় গতিসূত্র (F = ma)',
        titleEn: 'Momentum & Newton’s Second Law (F = ma)',
        descriptionBn:
          'কোনো বস্তুর ভর ও বেগের গুণফলকে ভরবেগ ($p = mv$) বলে। নিউটনের ২য় সূত্রানুসারে, বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে কাজ করে ভরবেগের পরিবর্তনও সেদিকে ঘটে। এর থেকে পাওয়া যায় বিখ্যাত বল সমীকরণ $F = ma$।',
        descriptionEn:
          'Momentum is mass times velocity ($p = mv$). Newton’s 2nd Law states that the rate of change of momentum is proportional to the applied force: $F = dp/dt = ma$.',
        formulaLatex: 'F = ma = m\\left(\\frac{v - u}{t}\\right)',
        realWorldExampleBn:
          'একটি ক্রিকেট বল ক্যাচ ধরার সময় ফিল্ডার হাত পেছনের দিকে টেনে নেয়। এর ফলে বলের বেগ শূন্য হতে বেশি সময় ($t$) লাগে, ফলে হাতের ওপর প্রযুক্ত বল ($F$) কমে যায় এবং হাতে চোট লাগে না।',
        realWorldExampleEn:
          'Cricket fielders pull their hands back while catching to increase collision time $t$, dramatically reducing impact force $F$.',
      },
      {
        id: 'c3-conservation-momentum',
        titleBn: 'ভরবেগের নিত্যতা ও সংঘর্ষ (Collision)',
        titleEn: 'Conservation of Momentum & Collisions',
        descriptionBn:
          'একাধিক বস্তুর মধ্যে ক্রিয়া ও প্রতিক্রিয়া ছাড়া অন্য কোনো বাহ্যিক বল কাজ না করলে যেকোনো সংঘর্ষের আগে মোট ভরবেগ এবং সংঘর্ষের পরে মোট ভরবেগ সর্বদা সমান ও সংরক্ষিত থাকে।',
        descriptionEn:
          'In the absence of external forces, the total momentum of interacting bodies before collision equals the total momentum after collision.',
        formulaLatex: 'm_1u_1 + m_2u_2 = m_1v_1 + m_2v_2',
        realWorldExampleBn:
          'বন্দুক থেকে গুলি ছুড়লে বন্দুকের বিপরীত দিকে ধাক্কা খাওয়া (Recoil of Gun) ভরবেগ সংরক্ষণের প্রত্যক্ষ প্রমাণ।',
        realWorldExampleEn:
          'A firing gun kicking backward (recoil velocity) is direct conservation of linear momentum.',
      },
      {
        id: 'c3-friction',
        titleBn: 'ঘর্ষণ ও ঘর্ষণ বলের প্রভাব',
        titleEn: 'Friction Types & Effects',
        descriptionBn:
          'একটি বস্তু যখন অপর একটি বস্তুর সংস্পর্শে থেকে গতিশীল হয় বা হতে চেষ্টা করে, তখন স্পর্শতলে গতির বিরুদ্ধে যে বাধার সৃষ্টি হয় তাকে ঘর্ষণ বল বলে (স্থিতি, পিছলানো, আবর্ত ও প্রবাহী ঘর্ষণ)। কার্যকর ত্বরণ নির্ণয়ে প্রযুক্ত বল থেকে ঘর্ষণ বল বিয়োগ করতে হয়: $F_{\\text{net}} = F - f_k = ma$।',
        descriptionEn:
          'Frictional force opposes relative motion between contacting surfaces (static, sliding, rolling, fluid). Net accelerating force subtracts friction: $F_{\\text{net}} = F - f_k = ma$.',
        formulaLatex: 'F_{\\text{net}} = F - f_k = ma',
        realWorldExampleBn:
          'বৃষ্টির দিনে রাস্তায় গাড়ির চাকা পিছলে যায় কারণ পানির জন্য রাস্তার ও টায়ারের মধ্যকার ঘর্ষণ কমে যায়।',
        realWorldExampleEn:
          'Wet roads cause car skidding because water film reduces sliding friction between tire treads and asphalt.',
      },
    ],
  },
  step2: {
    simulatorType: 'force',
    instructionsBn:
      '১ম ও ২য় গাড়ির ভর এবং আদিবেগ পরিবর্তন করো। "সংঘর্ষ শুরু" বোতাম চেপে সংঘর্ষ পর্যবেক্ষণ করো। অস্থিতিস্থাপক মোডে গাড়ি দুটি একত্রে মিলিত হয়ে কোন দিকে কত বেগে যায় তা লাইভ ভরবেগ সংরক্ষণের সাথে মিলিয়ে নাও।',
    instructionsEn:
      'Adjust masses and starting velocities for Cart 1 and Cart 2. Click "Launch" to simulate the impact. Observe combined final velocity and verify momentum conservation.',
    controls: [
      {
        key: 'm1',
        labelBn: '১ম গাড়ির ভর m₁ (কেজি)',
        labelEn: 'Cart 1 Mass (kg)',
        defaultValue: 4,
        min: 1,
        max: 10,
        step: 0.5,
        unit: 'kg',
      },
      {
        key: 'u1',
        labelBn: '১ম গাড়ির বেগ u₁ (মি./সে.)',
        labelEn: 'Cart 1 Velocity (m/s)',
        defaultValue: 6,
        min: 1,
        max: 10,
        step: 1,
        unit: 'm/s',
      },
      {
        key: 'm2',
        labelBn: '২য় গাড়ির ভর m₂ (কেজি)',
        labelEn: 'Cart 2 Mass (kg)',
        defaultValue: 2,
        min: 1,
        max: 10,
        step: 0.5,
        unit: 'kg',
      },
      {
        key: 'u2',
        labelBn: '২য় গাড়ির বেগ u₂ (মি./সে.)',
        labelEn: 'Cart 2 Velocity (m/s)',
        defaultValue: -4,
        min: -8,
        max: 5,
        step: 1,
        unit: 'm/s',
      },
    ],
    keyObservationTipBn:
      'লক্ষ করো: সংঘর্ষের পূর্বে ও পরে মোট ভরবেগ ($P = mv$) হুবহু অপরিবর্তিত থাকে। কিন্তু অস্থিতিস্থাপক সংঘর্ষে মোট গতিশক্তি ($E_k$) কিছুটা হ্রাস পায় কারণ তা শব্দ ও তাপে রূপান্তরিত হয়!',
    keyObservationTipEn:
      'Notice: Total linear momentum ($P = mv$) is strictly conserved before and after impact. In inelastic collisions, total kinetic energy decreases as it converts to thermal and acoustic energy.',
  },
  step3: {
    coreFormulaLatex: 'm_1u_1 + m_2u_2 = (m_1 + m_2)v \\quad \\text{এবং} \\quad F = ma',
    variableDefinitions: [
      {
        symbol: 'm_1, m_2',
        nameBn: 'সংঘর্ষে লিপ্ত বস্তুর ভর',
        nameEn: 'Masses of Colliding Bodies',
        siUnit: 'kg',
      },
      {
        symbol: 'u_1, u_2',
        nameBn: 'সংঘর্ষের পূর্বে আদিবেগ',
        nameEn: 'Initial Velocities before Impact',
        siUnit: 'm/s',
      },
      {
        symbol: 'v',
        nameBn: 'মিলিত শেষবেগ',
        nameEn: 'Common Combined Velocity',
        siUnit: 'm/s',
      },
      {
        symbol: 'F',
        nameBn: 'প্রযুক্ত কার্যকর বল',
        nameEn: 'Net Applied Force',
        siUnit: 'N \\text{ (Newton)}',
      },
      {
        symbol: 'f_k',
        nameBn: 'ঘর্ষণ বল',
        nameEn: 'Frictional Force',
        siUnit: 'N',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'নিউটনের ৩য় সূত্র থেকে বলের সমতা',
        labelEn: 'Equal and Opposite Forces via Newton’s 3rd Law',
        latexExpression: 'F_1 = -F_2',
        explanationBn:
          'সংঘর্ষের সময় ১ম বস্তু ২য় বস্তুর ওপর যে বল ($F_1$) প্রয়োগ করে, ২য় বস্তুও ১ম বস্তুর ওপর সমান ও বিপরীতমুখী বল ($F_2$) প্রয়োগ করে।',
        explanationEn:
          'Action and reaction forces between the two colliding bodies are equal in magnitude and opposite in direction.',
      },
      {
        stepNumber: 2,
        labelBn: 'নিউটনের ২য় সূত্র প্রয়োগ',
        labelEn: 'Applying Newton’s 2nd Law of Motion',
        latexExpression: 'm_1 \\left(\\frac{v_1 - u_1}{t}\\right) = -m_2 \\left(\\frac{v_2 - u_2}{t}\\right)',
        explanationBn:
          'উভয় পাশ থেকে সংঘর্ষকাল $t$ বর্জন করে পাই: $m_1(v_1 - u_1) = -m_2(v_2 - u_2)$।',
        explanationEn:
          'Multiplying by collision duration $t$ cancels the time parameter: $m_1(v_1 - u_1) = -m_2(v_2 - u_2)$.',
      },
      {
        stepNumber: 3,
        labelBn: 'ভরবেগের নিত্যতা সমীকরণ প্রতিষ্ঠা',
        labelEn: 'Final Conservation Law Formulation',
        latexExpression: 'm_1v_1 - m_1u_1 = -m_2v_2 + m_2u_2 \\implies m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2',
        explanationBn:
          'বস্তু দুটি যদি সংঘর্ষের পর একত্রে আটকে যায় ($v_1 = v_2 = v$), তবে সমীকরণটি দাঁড়ায় $m_1u_1 + m_2u_2 = (m_1 + m_2)v$।',
        explanationEn:
          'When bodies fuse into a single mass ($v_1 = v_2 = v$), the equation simplifies to $m_1u_1 + m_2u_2 = (m_1 + m_2)v$.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        '$1000\\text{ kg}$ ভরের একটি গাড়ি $20\\text{ m/s}$ বেগে চলার সময় বিপরীত দিক থেকে আসা $1500\\text{ kg}$ ভরের একটি স্থির পিকআপ ভ্যানকে ধাক্কা দিয়ে একত্রে আটকে গেল। গাড়ি দুটির সম্মিলিত শেষবেগ ও দিক নির্ণয় করো।',
      problemEn:
        'A $1000\\text{ kg}$ car moving at $20\\text{ m/s}$ hits a stationary $1500\\text{ kg}$ pickup van and they interlock. Determine the combined final velocity and direction.',
      solutionStepsBn: [
        '১. প্রদত্ত উপাত্ত: $m_1 = 1000\\text{ kg}, u_1 = 20\\text{ m/s}, m_2 = 1500\\text{ kg}, u_2 = 0\\text{ m/s}$',
        '২. সূত্র লিখি: $m_1u_1 + m_2u_2 = (m_1 + m_2)v$',
        '৩. মান বসাই: $(1000 \\times 20) + (1500 \\times 0) = (1000 + 1500)v$',
        '৪. হিসাব: $20000 = 2500v \\implies v = \\frac{20000}{2500} = 8\\text{ m/s}$',
        '৫. সিদ্ধান্ত: যেহেতু $v$ এর মান ধনাত্মক, সুতরাং গাড়ি দুটি ১ম গাড়ির গতির দিকে $8\\text{ m/s}$ বেগে চলবে।',
      ],
      solutionStepsEn: [
        '1. Given: $m_1 = 1000\\text{ kg}, u_1 = 20\\text{ m/s}, m_2 = 1500\\text{ kg}, u_2 = 0$',
        '2. Formula: $m_1u_1 + m_2u_2 = (m_1 + m_2)v$',
        '3. Substitute: $1000(20) + 0 = (1000 + 1500)v$',
        '4. Compute: $20000 = 2500v \\implies v = 8\\text{ m/s}$',
        '5. Conclusion: Since velocity is positive, combined mass travels along Cart 1’s direction at $8\\text{ m/s}$.',
      ],
      finalAnswerWithUnit: 'v = 8\\text{ m/s} \\text{ (১ম গাড়ির গতির দিকে)}',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-collision-sign',
        titleBn: 'বিপরীত দিক থেকে আসা বস্তুর আদিবেগে ঋণাত্মক (-) চিহ্ন না দেওয়া',
        titleEn: 'Forgetting Negative Sign for Opposing Velocity in Head-on Collisions',
        lostMarks: 2,
        frequentlyTestedIn: 'গ ও ঘ-অংশ (বোর্ডের সবচেয়ে কমন ট্র্যাপ)',
        commonMistakeBn:
          'উদ্দীপকে বলে "বিপরীত দিক থেকে $10 m/s$ বেগে আসা", কিন্তু ছাত্রছাত্রীরা সূত্রে $+10$ বসিয়ে হিসাব করে ফেলে।',
        commonMistakeEn:
          'Plugging opposing velocity as positive $+10$ instead of negative $-10$ in head-on collision formulas.',
        correctApproachBn:
          'যেহেতু বেগ ভেক্টর রাশি, তাই একদিকের বেগকে ধনাত্মক (+) ধরলে তার ঠিক বিপরীত দিকের বেগকে অবশ্যই ঋণাত্মক ($-$) ধরতে হবে: $u_2 = -10\\text{ m/s}$।',
        correctApproachEn:
          'Velocity is directional: If Cart 1 is positive ($+u_1$), the opposing cart must be negative ($-u_2$).',
        examinerSecretTipBn:
          'বোর্ড পরীক্ষক সরাসরি উত্তরের চিহ্নে চোখ বুলান। চিহ্ন ভুল হলে পুরো অঙ্কটির উত্তরের মান এবং দিক দুটোই ভুল হয়ে যায়।',
        examinerSecretTipEn:
          'Examiners check the sign immediately. A sign error ruins both the numerical magnitude and direction.',
      },
      {
        id: 'trap-2-gun-recoil',
        titleBn: 'বন্দুকের পশ্চাৎ বেগে (Recoil) ঋণাত্মক চিহ্ন নির্দেশ না করা',
        titleEn: 'Neglecting Negative Sign in Recoil Velocity of Gun',
        lostMarks: 1,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক)',
        commonMistakeBn:
          'বন্দুকের পশ্চাৎ বেগ বের করার পর লেখে $V = 1.5\\text{ m/s}$ কিন্তু "পশ্চাৎমুখী" কথাটি উল্লেখ করে না বা মাইনাস চিহ্ন এড়িয়ে যায়।',
        commonMistakeEn:
          'Reporting recoil velocity without negative sign and without specifying "in opposite direction".',
        correctApproachBn:
          'সূত্রে $MV + mv = 0 \\implies V = -\\frac{mv}{M}$। উত্তরের সময় লিখতে হবে: "বন্দুকটির বেগ $-1.5\\text{ m/s}$ অর্থাৎ গুলির গতির বিপরীতে পশ্চাৎ বেগ $1.5\\text{ m/s}$"।',
        correctApproachEn:
          'State: $V = -1.5\\text{ m/s}$, explaining that the negative sign denotes motion opposite to the bullet.',
        examinerSecretTipBn:
          'উত্তরে যদি স্পষ্ট করে "পশ্চাৎ বেগ" শব্দ লেখো, তবে মান শুধু $1.5\\text{ m/s}$ লিখলেও নম্বর কাটা যাবে না।',
        examinerSecretTipEn:
          'If you explicitly write the word "Recoil Velocity", positive magnitude is acceptable under board guidelines.',
      },
      {
        id: 'trap-3-friction-net-force',
        titleBn: 'ঘর্ষণ বল থাকলে ত্বরণ বের করার সময় প্রযুক্ত বল থেকে ঘর্ষণ বিয়োগ না করা',
        titleEn: 'Failing to Subtract Friction from Applied Force for Net Acceleration',
        lostMarks: 2,
        frequentlyTestedIn: 'ঘ-অংশ (উচ্চতর দক্ষতা)',
        commonMistakeBn:
          'উদ্দীপকে $50N$ বল প্রয়োগের সাথে $10N$ ঘর্ষণ বল উল্লেখ থাকলেও সরাসরি $a = 50 / m$ সূত্র লিখে ফেলে।',
        commonMistakeEn:
          'Computing $a = F / m$ directly without deducting opposing friction $f_k$.',
        correctApproachBn:
          'ত্বরণ সৃষ্টি করে কেবল কার্যকর নেট বল: $F_{\\text{net}} = F - f_k = 50 - 10 = 40\\text{ N}$। সুতরাং $a = \\frac{F - f_k}{m} = \\frac{40}{m}$।',
        correctApproachEn:
          'Only net force produces acceleration: $F_{\\text{net}} = F - f_k$. Thus $a = (F - f_k) / m$.',
        examinerSecretTipBn:
          'উদ্দীপকে ঘর্ষণ বল ($f_k$) বা ঘর্ষণ গুণাঙ্ক ($\mu$) দেওয়া থাকলে লাল কালির মতো সতর্ক হও—এটি প্রযুক্ত বল থেকে বাদ দিতেই হবে।',
        examinerSecretTipEn:
          'Whenever friction or roughness is mentioned in the stimulus, always subtract it before applying $F=ma$.',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-force-collision',
        questionBn:
          '$5\\text{ kg}$ ভরের একটি স্থির বস্তুর ওপর $20\\text{ N}$ বল $4\\text{ s}$ ধরে কাজ করল। বস্তুটির ভরবেগের পরিবর্তন কত?',
        questionEn:
          'A force of $20\\text{ N}$ acts on a stationary $5\\text{ kg}$ mass for $4\\text{ s}$. What is the change in momentum?',
        questionType: 'MCQ',
        optionsBn: ['80 kg·m/s', '100 kg·m/s', '20 kg·m/s', '40 kg·m/s'],
        optionsEn: ['80 kg·m/s', '100 kg·m/s', '20 kg·m/s', '40 kg·m/s'],
        correctOptionIndex: 0,
        explanationBn:
          'বলের ঘাত = ভরবেগের পরিবর্তন $\\implies \\Delta p = F \\times t = 20\\text{ N} \\times 4\\text{ s} = 80\\text{ kg}\\cdot\\text{m/s}$।',
        explanationEn:
          'Impulse = Change in momentum $\\implies \\Delta p = F \\times t = 20 \\times 4 = 80\\text{ kg}\\cdot\\text{m/s}$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৩',
      },
      {
        id: 'q2-force-recoil',
        questionBn:
          '$2\\text{ kg}$ ভরের একটি বন্দুক থেকে $10\\text{ g}$ ভরের একটি গুলি $400\\text{ m/s}$ বেগে বের হলো। বন্দুকের পশ্চাৎ বেগ কত?',
        questionEn:
          'A $10\\text{ g}$ bullet is fired from a $2\\text{ kg}$ rifle with velocity $400\\text{ m/s}$. What is the recoil velocity of the rifle?',
        questionType: 'MCQ',
        optionsBn: ['-2 m/s', '-4 m/s', '-1 m/s', '-0.5 m/s'],
        optionsEn: ['-2 m/s', '-4 m/s', '-1 m/s', '-0.5 m/s'],
        correctOptionIndex: 0,
        explanationBn:
          'গুলির ভর $m = 10\\text{ g} = 0.01\\text{ kg}$। বন্দুকের পশ্চাৎ বেগ $V = -\\frac{mv}{M} = -\\frac{0.01 \\times 400}{2} = -\\frac{4}{2} = -2\\text{ m/s}$।',
        explanationEn:
          'Bullet mass $m = 0.01\\text{ kg}$. Recoil $V = -mv/M = -(0.01 \\times 400)/2 = -2\\text{ m/s}$. Option A is correct.',
        boardSource: 'রাজশাহী বোর্ড ২০২৪',
      },
      {
        id: 'q3-force-friction-type',
        questionBn: 'কোন ঘর্ষণ বলের মান সাধারণত সবচেয়ে কম হয়?',
        questionEn: 'Which type of frictional force has the smallest magnitude?',
        questionType: 'MCQ',
        optionsBn: [
          'আবর্ত ঘর্ষণ (Rolling friction)',
          'পিছলানো ঘর্ষণ (Sliding friction)',
          'স্থিতি ঘর্ষণ (Static friction)',
          'প্রবাহী ঘর্ষণ (Fluid friction)',
        ],
        optionsEn: [
          'Rolling friction',
          'Sliding friction',
          'Static friction',
          'Fluid friction',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'আবর্ত ঘর্ষণে বস্তুর চাকা গড়িয়ে চলার কারণে স্পর্শতলের ক্ষেত্রফল খুব কম থাকে, ফলে আবর্ত ঘর্ষণ বলের মান সর্বনিম্ন হয়। এজন্যই গাড়িতে চাকা ও বিয়ারিং ব্যবহার করা হয়।',
        explanationEn:
          'Rolling friction has the smallest contact point deformation, making its resistance the lowest among mechanical frictions.',
        boardSource: 'দিনাজপুর বোর্ড ২০২২',
      },
    ],
  },
};
