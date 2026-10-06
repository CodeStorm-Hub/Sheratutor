import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 7)!;

export const CH07_WAVES_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'তরঙ্গ হলো এক প্রকার পর্যায়বৃত্ত আন্দোলন যা মাধ্যমের কণাগুলোকে স্থানান্তরিত না করে কেবল শক্তি ও তথ্য এক স্থান থেকে অন্য স্থানে সঞ্চালিত করে। অনুপ্রস্থ ও অনুদৈর্ঘ্য তরঙ্গ, তরঙ্গদৈর্ঘ্য, কম্পাঙ্ক ($v = f\\lambda$), বায়ুতে শব্দের বেগ এবং প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব এ অধ্যায়ের মূল প্রতিপাদ্য।',
    summaryEn:
      'A wave is a periodic disturbance propagating energy through a medium without net matter transport. Transverse and longitudinal waves, wave equation $v = f\lambda$, temperature dependence of sound speed, and echo distance criteria form this chapter’s core.',
    nodes: [
      {
        id: 'c7-wave-types',
        titleBn: 'অনুপ্রস্থ বনাম অনুদৈর্ঘ্য তরঙ্গ',
        titleEn: 'Transverse vs Longitudinal Waves',
        descriptionBn:
          'তরঙ্গ সঞ্চালনের দিকের সাথে মাধ্যমের কণাগুলো লম্বভাবে স্পন্দিত হলে তাকে অনুপ্রস্থ তরঙ্গ বলে (যেমন: পানির ঢেউ, আলোক তরঙ্গ)। আর কণাগুলো সমান্তরালে বা একই দিকে স্পন্দিত হলে তাকে অনুদৈর্ঘ্য তরঙ্গ বলে (যেমন: শব্দ তরঙ্গ, যা সংকোচন ও প্রসারণের মাধ্যমে চলে)।',
        descriptionEn:
          'In transverse waves, particles vibrate perpendicular to wave propagation (water waves, light). In longitudinal waves, particles oscillate parallel to wave motion via compressions and rarefactions (sound waves).',
        realWorldExampleBn:
          'একটি লম্বা স্প্রিংকে টেনে ছেড়ে দিলে সংকোচন ও প্রসারণের মাধ্যমে অনুদৈর্ঘ্য শব্দ তরঙ্গের নিখুঁত দৃশ্য দেখা যায়।',
        realWorldExampleEn:
          'Stretching and releasing a Slinky coil produces compressions and rarefactions identical to longitudinal sound waves.',
      },
      {
        id: 'c7-wave-equation',
        titleBn: 'তরঙ্গ সমীকরণ (v = fλ)',
        titleEn: 'Fundamental Wave Equation (v = fλ)',
        descriptionBn:
          'তরঙ্গ বেগ ($v$), কম্পাঙ্ক ($f$) এবং তরঙ্গদৈর্ঘ্য ($\\lambda$) এর মধ্যকার সম্পর্ক হলো $v = f\\lambda$। একটি নির্দিষ্ট মাধ্যমে শব্দের বেগ স্থির থাকে; তাই কম্পাঙ্ক বাড়লে তরঙ্গদৈর্ঘ্য আনুপাতিক হারে কমে যায় ($f \\propto 1/\\lambda$)।',
        descriptionEn:
          'Wave speed equals frequency times wavelength ($v = f\lambda$). In a given uniform medium, wave speed is constant, meaning frequency and wavelength are inversely proportional.',
        formulaLatex: 'v = f\\lambda = \\frac{\\lambda}{T}',
        realWorldExampleBn:
          'উচ্চ স্বরের চিকন সুরের বাশির কম্পাঙ্ক বেশি হওয়ায় তার তরঙ্গদৈর্ঘ্য ছোট হয়, আর গম্ভীর ঢোলের শব্দের তরঙ্গদৈর্ঘ্য বড় হয়।',
        realWorldExampleEn:
          'A high-pitch flute tone has high frequency and short wavelength; a deep bass drum has long wavelength.',
      },
      {
        id: 'c7-speed-temp',
        titleBn: 'শব্দের বেগের ওপর তাপমাত্রার প্রভাব',
        titleEn: 'Temperature Effect on Sound Velocity',
        descriptionBn:
          'বায়ুতে শব্দের বেগ পরম তাপমাত্রার বর্গমূলের সমানুপাতিক ($v \\propto \\sqrt{T}$)। সাধারণ তাপমাত্রার জন্য প্রতি ১ ডিগ্রি সেলসিয়াস তাপমাত্রা বৃদ্ধিতে বায়ুতে শব্দের বেগ প্রায় $0.6\\text{ m/s}$ বৃদ্ধি পায়: $v_T = v_0 + 0.6T$।',
        descriptionEn:
          'Speed of sound in air is proportional to the square root of absolute temperature ($v \propto \sqrt{T}$). Approximately, speed increases by $0.6\text{ m/s}$ per $1^\circ\text{C}$ rise: $v_T = v_0 + 0.6T$.',
        formulaLatex: 'v_T = 332 + 0.6T \\text{ (মি./সে.)}, \\quad \\frac{v_1}{v_2} = \\sqrt{\\frac{T_1}{T_2}}',
        realWorldExampleBn:
          'শীতকালের কনকনে ঠান্ডায় ($0^\\circ\\text{C}$) বায়ুতে শব্দের বেগ $332\\text{ m/s}$, কিন্তু গ্রীষ্মের তপ্ত দিনে ($30^\\circ\\text{C}$) তা বেড়ে $350\\text{ m/s}$ হয়।',
        realWorldExampleEn:
          'At winter freezing point ($0^\circ\text{C}$) sound travels at $332\text{ m/s}$, increasing to $350\text{ m/s}$ on a scorching $30^\circ\text{C}$ summer day.',
      },
      {
        id: 'c7-echo-persistence',
        titleBn: 'প্রতিধ্বনি ও শব্দানুভূতির স্থায়িত্বকাল',
        titleEn: 'Echo & Persistence of Hearing',
        descriptionBn:
          'শব্দ কোনো প্রতিফলক পৃষ্ঠে বাধা পেয়ে উৎসে ফিরে এলে তাকে প্রতিধ্বনি বলে। মানুষের মস্তিষ্কে শব্দের অনুভূতির রেশ প্রায় $0.1\\text{ সেকেন্ড}$ বজায় থাকে। তাই প্রতিধ্বনি শুনতে হলে প্রতিফলিত শব্দকে অবশ্যই মূল শব্দ সৃষ্টির অন্তত $0.1\\text{ সেকেন্ড}$ পর কানে পৌঁছাতে হবে।',
        descriptionEn:
          'An echo is the reflection of sound arriving back after an obstacle. Human auditory perception persists for $0.1\text{ s}$. The reflected wave must return after at least $0.1\text{ s}$ to be perceived distinctly.',
        formulaLatex: '2d = vt \\implies d_{\\text{min}} = \\frac{v \\times 0.1}{2}',
        realWorldExampleBn:
          'সাধারণ পড়ার ঘরের দেয়াল কাছে থাকায় কোনো প্রতিধ্বনি শোনা যায় না, কিন্তু বড় শূন্য অডিটোরিয়াম বা পাহাড়ের সামনে জোরে চিৎকার করলে স্পষ্ট প্রতিধ্বনি ফিরে আসে।',
        realWorldExampleEn:
          'Standard living room walls are too close for distinct echoes, but large empty halls or canyon cliffs return crisp echoes.',
      },
    ],
  },
  step2: {
    simulatorType: 'wave',
    instructionsBn:
      '১ম ট্যাবে প্রতিফলকের দূরত্ব (d) এবং বায়ুর তাপমাত্রা (T) স্লাইডার দিয়ে পরিবর্তন করে "শব্দ তৈরি করো" চাপো। পর্যবেক্ষণ করো প্রতিফলিত তরঙ্গ ০.১ সেকেন্ডের পরে নাকি আগে ফিরে আসে এবং প্রতিধ্বনি শোনা যায় কি না।',
    instructionsEn:
      'In Tab 1, adjust wall distance (d) and temperature (T) then click "Emit Pulse". Observe return time against the 0.1s auditory persistence threshold to see if an echo is heard.',
    controls: [
      {
        key: 'distanceD',
        labelBn: 'প্রতিফলকের দূরত্ব d (মিটার)',
        labelEn: 'Reflector Distance d (m)',
        defaultValue: 18,
        min: 5,
        max: 40,
        step: 0.5,
        unit: 'm',
      },
      {
        key: 'temperatureC',
        labelBn: 'বায়ুর তাপমাত্রা T (°C)',
        labelEn: 'Temperature T (°C)',
        defaultValue: 20,
        min: 0,
        max: 45,
        step: 1,
        unit: '°C',
      },
    ],
    keyObservationTipBn:
      'বোর্ডের অত্যন্ত জনপ্রিয় প্রশ্ন: $0^\\circ\\text{C}$ তাপমাত্রায় প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব কত? হিসাব: $d_{\\text{min}} = \\frac{332 \\times 0.1}{2} = 16.6\\text{ m}$। আর তাপমাত্রা বাড়লে শব্দের বেগ বাড়ে, ফলে ন্যূনতম দূরত্বের মানও বেড়ে যায় (যেমন $25^\\circ\\text{C}$ এ তা $17.35\\text{ m}$)!',
    keyObservationTipEn:
      'At $0^\circ\text{C}$, minimum echo distance is $d_{\text{min}} = (332 \times 0.1) / 2 = 16.6\text{ m}$. As temperature rises, higher speed increases the minimum required distance ($17.35\text{ m}$ at $25^\circ\text{C}$).',
  },
  step3: {
    coreFormulaLatex: '2d = vt \\quad \\text{এবং} \\quad v = f\\lambda',
    variableDefinitions: [
      {
        symbol: 'd',
        nameBn: 'উৎস থেকে প্রতিফলকের দূরত্ব',
        nameEn: 'Distance to Reflector',
        siUnit: 'm',
      },
      {
        symbol: 'v',
        nameBn: 'বায়ুতে শব্দের বেগ',
        nameEn: 'Speed of Sound',
        siUnit: 'm/s',
      },
      {
        symbol: 't',
        nameBn: 'শব্দ উৎপন্ন ও ফিরে আসার সময়',
        nameEn: 'Echo Return Time',
        siUnit: 's',
      },
      {
        symbol: 'f',
        nameBn: 'কম্পাঙ্ক',
        nameEn: 'Frequency',
        siUnit: 'Hz \\text{ (Hertz)}',
      },
      {
        symbol: '\\lambda',
        nameBn: 'তরঙ্গদৈর্ঘ্য',
        nameEn: 'Wavelength',
        siUnit: 'm',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'প্রতিধ্বনির মোট অতিক্রান্ত দূরত্ব',
        labelEn: 'Total Travel Distance for Echo',
        latexExpression: 's = d + d = 2d',
        explanationBn:
          'শব্দকে উৎস থেকে গিয়ে প্রতিফলকে ধাক্কা খেয়ে পুনরায় উৎসে ফিরে আসতে হয়, তাই মোট অতিক্রান্ত দূরত্ব $2d$।',
        explanationEn:
          'Sound traverses forward to the reflector and rebounds backward, traveling a total path of $2d$.',
      },
      {
        stepNumber: 2,
        labelBn: 'সুষম বেগের সমীকরণ প্রয়োগ',
        labelEn: 'Uniform Speed Kinematics Application',
        latexExpression: 's = vt \\implies 2d = vt \\implies d = \\frac{vt}{2}',
        explanationBn:
          'শব্দ সুষম বেগে চলে, তাই $2d = vt$। এখান থেকে প্রতিফলকের দূরত্ব $d = vt / 2$।',
        explanationEn:
          'Since sound propagates with uniform velocity, $2d = vt$, giving distance $d = vt / 2$.',
      },
      {
        stepNumber: 3,
        labelBn: 'ন্যূনতম দূরত্বের শর্ত (t = 0.1 s)',
        labelEn: 'Minimum Distance Condition',
        latexExpression: 'd_{\\text{min}} = \\frac{v \\times 0.1}{2} = \\frac{v}{20}',
        explanationBn:
          'শব্দানুভূতির স্থায়িত্বকাল $0.1\\text{ s}$ বসিয়ে পাই যে ন্যূনতম দূরত্ব সবসময় শব্দের বেগের ২০ ভাগের ১ ভাগ।',
        explanationEn:
          'Substituting persistence threshold $t = 0.1\text{ s}$ demonstrates minimum distance is always $v / 20$.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        '$30^\\circ\\text{C}$ তাপমাত্রার এক দিনে একটি কূপের মুখে দাঁড়িয়ে শব্দ করার $0.12\\text{ s}$ পর প্রতিধ্বনি শোনা গেল। কূপটির গভীরতা কত? ($0^\\circ\\text{C}$ এ শব্দের বেগ $332\\text{ m/s}$)',
      problemEn:
        'On a $30^\circ\text{C}$ day, a person produces sound at a well’s mouth and hears an echo after $0.12\text{ s}$. Find the well’s depth. ($v_0 = 332\text{ m/s}$ at $0^\circ\text{C}$)',
      solutionStepsBn: [
        '১. $30^\\circ\\text{C}$ তাপমাত্রায় শব্দের বেগ: $v = 332 + (0.6 \\times 30) = 332 + 18 = 350\\text{ m/s}$',
        '২. সময় $t = 0.12\\text{ s}$',
        '৩. কূপের গভীরতার সূত্র: $2h = vt \\implies h = \\frac{vt}{2}$',
        '৪. মান বসাই: $h = \\frac{350 \\times 0.12}{2} = \\frac{42}{2} = 21\\text{ m}$',
      ],
      solutionStepsEn: [
        '1. Velocity at $30^\circ\text{C}$: $v = 332 + (0.6 \times 30) = 350\text{ m/s}$',
        '2. Time $t = 0.12\text{ s}$',
        '3. Depth formula: $h = vt / 2$',
        '4. Calculation: $h = (350 \times 0.12) / 2 = 21\text{ m}$',
      ],
      finalAnswerWithUnit: 'h = 21\\text{ m}',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-echo-distance-not-doubled',
        titleBn: 'প্রতিধ্বনির সূত্রে ২d এর বদলে শুধু d লিখে হিসাব করা',
        titleEn: 'Writing d = vt Instead of 2d = vt for Echoes',
        lostMarks: 2,
        frequentlyTestedIn: 'গ ও ঘ-অংশ (বোর্ডে সবচেয়ে কমন ভুল)',
        commonMistakeBn:
          'ছাত্রছাত্রীরা দূরত্ব বের করতে গিয়ে $d = vt$ লিখে ফেলে, ফলে তাদের উত্তর আসল গভীরতা বা দূরত্বের দ্বিগুণ চলে আসে!',
        commonMistakeEn:
          'Using $d = vt$ instead of $2d = vt$, yielding double the actual distance.',
        correctApproachBn:
          'শব্দকে গিয়ে আবার ফিরে আসতে হয়, তাই সর্বদা $2d = vt$ বা $d = \\frac{vt}{2}$ লিখতে হবে।',
        correctApproachEn:
          'Round trip travel mandates $2d = vt$, so one-way distance is $d = vt / 2$.',
        examinerSecretTipBn:
          'স্মরণ রাখার নিয়ম: "প্রতিধ্বনি মানেই যাওয়া ও আসা, তাই দূরত্ব হবে দুইবার $2d$!"',
        examinerSecretTipEn:
          'Echo = there and back again. The path length is strictly twice the distance ($2d$).',
      },
      {
        id: 'trap-2-sound-speed-temperature-formula',
        titleBn: 'তাপমাত্রা সেলসিয়াস থেকে কেলভিনে না নিয়ে বর্গমূলের সূত্রে বসানো',
        titleEn: 'Plugging Celsius Directly into Square Root Speed Formula',
        lostMarks: 2,
        frequentlyTestedIn: 'গ-অংশ',
        commonMistakeBn:
          'যখন $\\frac{v_1}{v_2} = \\sqrt{\\frac{T_1}{T_2}}$ সূত্র ব্যবহার করে, তখন তাপমাত্রায় সরাসরি সেলসিয়াসের মান বসিয়ে দেয়।',
        commonMistakeEn:
          'Plugging Celsius temperatures into $v_1 / v_2 = \sqrt{T_1 / T_2}$ without converting to Kelvin ($T = \theta + 273$).',
        correctApproachBn:
          'বর্গমূলের সূত্রে $T$ হলো পরম তাপমাত্রা (Kelvin)। তাই অবশ্যই $T_1 = \\theta_1 + 273$ এবং $T_2 = \\theta_2 + 273$ করে কেলভিনে নিতে হবে।',
        correctApproachEn:
          'The square-root ratio strictly requires absolute Kelvin temperatures: $T = \theta + 273$.',
        examinerSecretTipBn:
          'যদি প্রশ্নে $0.6\\text{ m/s}$ বৃদ্ধির শর্টকাট দেওয়া না থাকে, তবে পূর্ণ নম্বর পেতে কেলভিনের রূপান্তর দিয়ে অংকটি করো।',
        examinerSecretTipEn:
          'Unless the linear approximation is requested, board rubrics reward the Kelvin square-root derivation.',
      },
      {
        id: 'trap-3-frequency-medium-change',
        titleBn: 'শব্দ এক মাধ্যম থেকে অন্য মাধ্যমে গেলে কম্পাঙ্ক পরিবর্তন করে ফেলা',
        titleEn: 'Assuming Wave Frequency Changes Across Medium Boundaries',
        lostMarks: 1,
        frequentlyTestedIn: 'খ ও বহুনির্বাচনি (MCQ)',
        commonMistakeBn:
          'মনে করা যে বায়ু থেকে পানিতে শব্দ প্রবেশ করলে কম্পাঙ্ক ($f$) পরিবর্তিত হয়।',
        commonMistakeEn:
          'Believing that sound passing from air to water changes frequency.',
        correctApproachBn:
          'কম্পাঙ্ক ($f$) কেবল উৎসের বৈশিষ্ট্যের ওপর নির্ভর করে। এক মাধ্যম থেকে অন্য মাধ্যমে গেলে বেগ ($v$) এবং তরঙ্গদৈর্ঘ্য ($\\lambda$) পরিবর্তিত হয়, কিন্তু কম্পাঙ্ক ($f$) সর্বদা অপরিবর্তিত থাকে।',
        correctApproachEn:
          'Frequency depends solely on the source. Velocity and wavelength change across boundaries, but frequency remains invariant.',
        examinerSecretTipBn:
          'বোর্ডের এমসিকিউতে এটি প্রায়ই আসে: "বায়ু থেকে পানিতে গেলে কোনটি অপরিবর্তিত থাকে?" উত্তর: কম্পাঙ্ক ($f$)।',
        examinerSecretTipEn:
          'Standard board MCQ: Which property stays constant across media? Answer: Frequency.',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-wave-echo-dist',
        questionBn:
          '$0^\\circ\\text{C}$ তাপমাত্রায় বায়ুতে প্রতিধ্বনি শোনার জন্য প্রতিফলকের ন্যূনতম দূরত্ব কত? ($v = 332\\text{ m/s}$)',
        questionEn:
          'What is the minimum distance required to hear an echo in air at $0^\circ\text{C}$? ($v = 332\text{ m/s}$)',
        questionType: 'MCQ',
        optionsBn: ['16.6 m', '33.2 m', '17.3 m', '15 m'],
        optionsEn: ['16.6 m', '33.2 m', '17.3 m', '15 m'],
        correctOptionIndex: 0,
        explanationBn:
          '$d_{\\text{min}} = \\frac{vt}{2} = \\frac{332 \\times 0.1}{2} = 16.6\\text{ m}$। সঠিক উত্তর ক।',
        explanationEn:
          '$d_{\\text{min}} = (332 \times 0.1) / 2 = 16.6\text{ m}$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৩',
      },
      {
        id: 'q2-wave-audible',
        questionBn: 'মানব কানের শ্রাব্যতার পাল্লা (Audible Range) কত?',
        questionEn: 'What is the audible frequency range for human ears?',
        questionType: 'MCQ',
        optionsBn: ['20 Hz - 20,000 Hz', '2 Hz - 200 Hz', '20 kHz - 200 kHz', '0 Hz - 100 Hz'],
        optionsEn: ['20 Hz - 20,000 Hz', '2 Hz - 200 Hz', '20 kHz - 200 kHz', '0 Hz - 100 Hz'],
        correctOptionIndex: 0,
        explanationBn:
          'মানুষের কানের শ্রাব্যতার সীমা ২০ হার্জ থেকে ২০,০০০ হার্জ (বা ২০ কিলোহার্জ)। ২০ হার্জের নিচে শব্দেতর এবং ২০ কিলোহার্জের উপরে শব্দোত্তর তরঙ্গ।',
        explanationEn:
          'Human audible range is $20\text{ Hz}$ to $20,000\text{ Hz}$. Below is infrasound, above is ultrasound.',
        boardSource: 'কুমিল্লা বোর্ড ২০২৪',
      },
      {
        id: 'q3-wave-equation-calc',
        questionBn:
          'একটি তরঙ্গের কম্পাঙ্ক $500\\text{ Hz}$ এবং বেগ $350\\text{ m/s}$ হলে এর তরঙ্গদৈর্ঘ্য কত?',
        questionEn:
          'If a wave has frequency $500\text{ Hz}$ and velocity $350\text{ m/s}$, what is its wavelength?',
        questionType: 'MCQ',
        optionsBn: ['0.7 m', '1.43 m', '7 m', '0.35 m'],
        optionsEn: ['0.7 m', '1.43 m', '7 m', '0.35 m'],
        correctOptionIndex: 0,
        explanationBn:
          '$\\lambda = \\frac{v}{f} = \\frac{350}{500} = 0.7\\text{ m}$। সঠিক উত্তর ক।',
        explanationEn:
          '$\lambda = v / f = 350 / 500 = 0.7\text{ m}$. Option A is correct.',
        boardSource: 'রাজশাহী বোর্ড ২০২২',
      },
    ],
  },
};
