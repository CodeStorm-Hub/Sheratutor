import { PhysicsChapterFullData } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';

const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === 6)!;

export const CH06_HEAT_DATA: PhysicsChapterFullData = {
  ...meta,
  step1: {
    summaryBn:
      'তাপ হলো এক প্রকার শক্তি যা তাপমাত্রার পার্থক্যের কারণে এক বস্তু থেকে অন্য বস্তুতে প্রবাহিত হয়। তাপমাত্রা হলো বস্তুর তাপীয় অবস্থা যা তাপ প্রবাহের দিক নির্ধারণ করে। তাপীয় প্রসারণ (দৈর্ঘ্য, ক্ষেত্র ও আয়তন), আপেক্ষিক তাপ ($Q = ms\\Delta\\theta$), ক্যালরিমিতির মূলনীতি এবং গলন ও বাষ্পায়নের সুপ্ততাপ এ অধ্যায়ের মূল শিক্ষণীয় বিষয়।',
    summaryEn:
      'Heat is thermal energy transferred due to temperature difference. Temperature determines the direction of heat flow. Thermal expansion ($\alpha, \beta, \gamma$), specific heat ($Q = ms\Delta\theta$), principle of mixtures, and latent heat form the core of this chapter.',
    nodes: [
      {
        id: 'c6-temp-scales',
        titleBn: 'তাপমাত্রা ও স্কেলের সম্পর্ক',
        titleEn: 'Temperature & Scale Conversion',
        descriptionBn:
          'সেলসিয়াস ($C$), ফারেনহাইট ($F$) ও কেলভিন ($K$) স্কেলের মধ্যকার মৌলিক সম্পর্ক: $\\frac{C}{5} = \\frac{F - 32}{9} = \\frac{K - 273}{5}$। তাপমাত্রা পার্থক্যের ক্ষেত্রে ১ ডিগ্রি সেলসিয়াস বৃদ্ধি ১ কেলভিন বৃদ্ধির সমান ($\\Delta C = \\Delta K$)।',
        descriptionEn:
          'Interconversion between Celsius, Fahrenheit, and Kelvin scales: $C/5 = (F - 32)/9 = (K - 273)/5$. Temperature interval is identical in Celsius and Kelvin ($\Delta C = \Delta K$).',
        formulaLatex: '\\frac{C}{5} = \\frac{F - 32}{9} = \\frac{K - 273}{5}',
        realWorldExampleBn:
          'মানবদেহের স্বাভাবিক তাপমাত্রা $98.4^\\circ\\text{F}$ কে সেলসিয়াসে নিলে তা প্রায় $36.9^\\circ\\text{C}$ হয়।',
        realWorldExampleEn:
          'Normal human body temperature of $98.4^\circ\text{F}$ converts to approximately $36.9^\circ\text{C}$.',
      },
      {
        id: 'c6-expansion-coeffs',
        titleBn: 'কঠিনের প্রসারণ সহগ (α, β, γ)',
        titleEn: 'Thermal Expansion Coefficients (α, β, γ)',
        descriptionBn:
          'তাপ দিলে কঠিন পদার্থের দৈর্ঘ্য, ক্ষেত্রফল ও আয়তন বৃদ্ধি পায়। দৈর্ঘ্য প্রসারণ সহগ $\\alpha = \\frac{\\Delta L}{L_0 \\Delta\\theta}$, ক্ষেত্র প্রসারণ সহগ $\\beta = 2\\alpha$, এবং আয়তন প্রসারণ সহগ $\\gamma = 3\\alpha$। তাদের অনুপাত $\\alpha : \\beta : \\gamma = 1 : 2 : 3$।',
        descriptionEn:
          'Solids expand in length ($\alpha$), area ($\beta = 2\alpha$), and volume ($\gamma = 3\alpha$) upon heating. The canonical ratio is $\alpha : \beta : \gamma = 1 : 2 : 3$.',
        formulaLatex: '\\Delta L = L_0\\alpha\\Delta\\theta, \\quad \\beta = 2\\alpha, \\quad \\gamma = 3\\alpha',
        realWorldExampleBn:
          'রেললাইনে দুটি লোহার পাতের সংযোগস্থলে ফাঁক রাখা হয়, যাতে গ্রীষ্মকালে রোদে পাত প্রসারিত হলেও লাইন বেঁকে না যায়।',
        realWorldExampleEn:
          'Gaps are deliberately engineered between railway track joints to accommodate summer thermal expansion without buckling.',
      },
      {
        id: 'c6-specific-heat',
        titleBn: 'আপেক্ষিক তাপ ও গৃহীত তাপ (Q = msΔθ)',
        titleEn: 'Specific Heat Capacity & Thermal Energy',
        descriptionBn:
          '১ কেজি ভরের কোনো বস্তুর তাপমাত্রা ১ কেলভিন বাড়াতে যে তাপের প্রয়োজন তাকে তার আপেক্ষিক তাপ ($s$) বলে। পানির আপেক্ষিক তাপ অনেক বেশি ($4200\\text{ J/(kg}\\cdot\\text{K)}$), তাই পানি সহজে গরম বা ঠান্ডা হয় না।',
        descriptionEn:
          'Specific heat ($s$) is heat needed to raise the temperature of $1\text{ kg}$ by $1\text{ K}$. Water has an unusually high capacity ($4200\text{ J/(kg}\cdot\text{K)}$).',
        formulaLatex: 'Q = ms\\Delta\\theta = ms(\\theta_2 - \\theta_1)',
        realWorldExampleBn:
          'গাড়ির ইঞ্জিনের কুল্যান্ট হিসেবে এবং সেঁক দেওয়ার হট-ওয়াটার ব্যাগে পানি ব্যবহার করা হয় কারণ পানি প্রচুর পরিমাণ তাপ ধারণ করতে পারে।',
        realWorldExampleEn:
          'Water is chosen as car engine coolant and in heating pads because its high specific heat retains huge quantities of thermal energy.',
      },
      {
        id: 'c6-latent-heat',
        titleBn: 'সুপ্ততাপ ও অবস্থার পরিবর্তন',
        titleEn: 'Latent Heat & Phase Change',
        descriptionBn:
          'তাপমাত্রার কোনো পরিবর্তন না ঘটিয়ে কেবল পদার্থের ভৌত অবস্থা পরিবর্তনের জন্য যে তাপ শোষিত বা বর্জিত হয়, তাকে সুপ্ততাপ বলে। বরফ গলনের আপেক্ষিক সুপ্ততাপ $L_f = 3.36 \\times 10^5\\text{ J/kg}$ এবং পানির বাষ্পীভবনের সুপ্ততাপ $L_v = 2.26 \\times 10^6\\text{ J/kg}$।',
        descriptionEn:
          'Latent heat is absorbed or released during phase transition without temperature change. Latent heat of fusion for ice is $L_f = 3.36 \times 10^5\text{ J/kg}$; vaporization is $L_v = 2.26 \times 10^6\text{ J/kg}$.',
        formulaLatex: 'Q = mL_f \\quad (\\text{গলন}), \\quad Q = mL_v \\quad (\\text{বাষ্পীভবন})',
        realWorldExampleBn:
          '১০০ ডিগ্রি সেলসিয়াসের ফুটন্ত পানির চেয়ে ১০০ ডিগ্রি সেলসিয়াসের জলীয় বাষ্পে হাত দিলে বেশি জ্বালা করে, কারণ বাষ্পে অতিরিক্ত বাষ্পীভবনের সুপ্ততাপ সঞ্চিত থাকে।',
        realWorldExampleEn:
          'Steam at $100^\circ\text{C}$ causes much worse burns than water at $100^\circ\text{C}$ due to the latent heat of vaporization.',
      },
    ],
  },
  step2: {
    simulatorType: 'thermal',
    instructionsBn:
      '১ম ট্যাবে তামা, লোহা, পিতল বা ইনভার ধাতুর দণ্ড নির্বাচন করে চূড়ান্ত তাপমাত্রা বৃদ্ধি করো এবং মাইক্রোমিটারে দৈর্ঘ্য বৃদ্ধি (ΔL) লক্ষ করো। ২য় ট্যাবে ভর ও আপেক্ষিক তাপ পরিবর্তন করে প্রয়োজনীয় তাপশক্তি (Q) হিসাব করো।',
    instructionsEn:
      'In Tab 1, select a metal rod and increase temperature to observe micrometer extension (ΔL). In Tab 2, alter mass and specific heat to compute required thermal energy (Q).',
    controls: [
      {
        key: 'temp2C',
        labelBn: 'চূড়ান্ত তাপমাত্রা θ₂ (°C)',
        labelEn: 'Final Temperature θ₂ (°C)',
        defaultValue: 100,
        min: 20,
        max: 250,
        step: 5,
        unit: '°C',
      },
      {
        key: 'initialLengthM',
        labelBn: 'আদি দৈর্ঘ্য L₀ (মিটার)',
        labelEn: 'Initial Length L₀ (m)',
        defaultValue: 2.0,
        min: 0.5,
        max: 10,
        step: 0.5,
        unit: 'm',
      },
    ],
    keyObservationTipBn:
      'বোর্ডের অনুধাবন ও বহুনির্বাচনিতে প্রায়ই আসে: তামার দৈর্ঘ্য প্রসারণ সহগ $16.7 \\times 10^{-6}\\text{ K}^{-1}$ বলতে কী বোঝায়? এর অর্থ হলো: ১ মিটার দৈর্ঘ্যের তামার দণ্ডের তাপমাত্রা ১ কেলভিন বাড়ালে এর দৈর্ঘ্য $16.7 \\times 10^{-6}\\text{ m}$ বৃদ্ধি পায়।',
    keyObservationTipEn:
      'Board favorite comprehension question: What does $\alpha = 16.7 \times 10^{-6}\text{ K}^{-1}$ signify? It means raising the temperature of a 1-meter copper rod by 1 Kelvin extends its length by $16.7 \times 10^{-6}\text{ m}$.',
  },
  step3: {
    coreFormulaLatex: '\\Delta L = L_0\\alpha\\Delta\\theta \\quad \\text{এবং} \\quad Q = ms\\Delta\\theta',
    variableDefinitions: [
      {
        symbol: 'L_0',
        nameBn: 'আদি দৈর্ঘ্য',
        nameEn: 'Initial Length',
        siUnit: 'm',
      },
      {
        symbol: '\\alpha',
        nameBn: 'দৈর্ঘ্য প্রসারণ সহগ',
        nameEn: 'Linear Expansion Coefficient',
        siUnit: 'K^{-1} \\text{ বা } ^\\circ\\text{C}^{-1}',
      },
      {
        symbol: '\\Delta\\theta',
        nameBn: 'তাপমাত্রার বৃদ্ধি বা পার্থক্য',
        nameEn: 'Temperature Difference',
        siUnit: 'K \\text{ বা } ^\\circ\\text{C}',
      },
      {
        symbol: 's',
        nameBn: 'আপেক্ষিক তাপ',
        nameEn: 'Specific Heat Capacity',
        siUnit: 'J/(kg\\cdot K)',
      },
      {
        symbol: 'Q',
        nameBn: 'গৃহীত বা বর্জিত তাপ',
        nameEn: 'Heat Energy',
        siUnit: 'J \\text{ (Joule)}',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'দৈর্ঘ্য প্রসারণের সমানুপাতিকতা',
        labelEn: 'Proportionality of Thermal Expansion',
        latexExpression: '\\Delta L \\propto L_0 \\quad \\text{এবং} \\quad \\Delta L \\propto \\Delta\\theta',
        explanationBn:
          'দৈর্ঘ্য বৃদ্ধি দণ্ডের আদি দৈর্ঘ্য এবং তাপমাত্রা বৃদ্ধির উভয়েরই সমানুপাতিক।',
        explanationEn:
          'Extension is directly proportional to both initial length and temperature change.',
      },
      {
        stepNumber: 2,
        labelBn: 'প্রসারণ সহগের সমীকরণ প্রতিষ্ঠা',
        labelEn: 'Formulation of Linear Coefficient',
        latexExpression: '\\Delta L = \\alpha L_0 \\Delta\\theta \\implies \\alpha = \\frac{\\Delta L}{L_0 \\Delta\\theta}',
        explanationBn:
          'সমানুপাতিক ধ্রুবক $\\alpha$ হলো উপাদানটির দৈর্ঘ্য প্রসারণ সহগ।',
        explanationEn:
          'The constant of proportionality $\alpha$ is the material coefficient.',
      },
      {
        stepNumber: 3,
        labelBn: 'ক্যালরিমিতির তাপের সমীকরণ',
        labelEn: 'Heat Exchange Equation',
        latexExpression: 'Q = ms\\Delta\\theta = ms(\\theta_2 - \\theta_1)',
        explanationBn:
          'গৃহীত বা বর্জিত তাপ ভর ($m$), আপেক্ষিক তাপ ($s$) এবং তাপমাত্রার পরিবর্তনের গুণফলের সমান।',
        explanationEn:
          'Thermal energy equals the product of mass, specific heat, and temperature change.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        '$20^\\circ\\text{C}$ তাপমাত্রায় একটি তামার তারের দৈর্ঘ্য $100\\text{ m}$। তাপমাত্রা বাড়িয়ে $70^\\circ\\text{C}$ করা হলে তারটির দৈর্ঘ্য কত বৃদ্ধি পাবে? (তামার $\\alpha = 16.7 \\times 10^{-6}\\text{ K}^{-1}$)',
      problemEn:
        'A copper wire is $100\\text{ m}$ long at $20^\circ\text{C}$. Find the extension when heated to $70^\circ\text{C}$. ($\alpha = 16.7 \times 10^{-6}\text{ K}^{-1}$)',
      solutionStepsBn: [
        '১. প্রদত্ত উপাত্ত: $L_0 = 100\\text{ m}, \\theta_1 = 20^\\circ\\text{C}, \\theta_2 = 70^\\circ\\text{C}, \\alpha = 16.7 \\times 10^{-6}\\text{ K}^{-1}$',
        '২. তাপমাত্রার পার্থক্য: $\\Delta\\theta = 70 - 20 = 50^\\circ\\text{C} = 50\\text{ K}$',
        '৩. সূত্র লিখি: $\\Delta L = L_0\\alpha\\Delta\\theta$',
        '৪. মান বসাই: $\\Delta L = 100 \\times (16.7 \\times 10^{-6}) \\times 50 = 0.0835\\text{ m} = 8.35\\text{ cm}$',
      ],
      solutionStepsEn: [
        '1. Given: $L_0 = 100\text{ m}, \Delta\theta = 50\text{ K}, \alpha = 16.7 \times 10^{-6}\text{ K}^{-1}$',
        '2. Formula: $\Delta L = L_0\alpha\Delta\theta$',
        '3. Substitute: $\Delta L = 100 \times (16.7 \times 10^{-6}) \times 50 = 0.0835\text{ m} = 8.35\text{ cm}$',
      ],
      finalAnswerWithUnit: '\\Delta L = 0.0835\\text{ m} = 8.35\\text{ cm}',
    },
  },
  step4: {
    traps: [
      {
        id: 'trap-1-celsius-kelvin-difference',
        titleBn: 'তাপমাত্রার পার্থক্যে (Δθ) ২৭৩ যোগ করে ভুল করা',
        titleEn: 'Incorrectly Adding 273 to Temperature Difference (Δθ)',
        lostMarks: 2,
        frequentlyTestedIn: 'গ ও ঘ-অংশ',
        commonMistakeBn:
          'তাপমাত্রা $20^\\circ\\text{C}$ থেকে $80^\\circ\\text{C}$ হলে পার্থক্য $60^\\circ\\text{C}$। কিন্তু ছাত্রছাত্রীরা পার্থক্যকে কেলভিন বানাতে গিয়ে $60 + 273 = 333\\text{ K}$ লিখে দেয়!',
        commonMistakeEn:
          'Adding 273 to a temperature INTERVAL ($\Delta\theta$) instead of recognizing that $\Delta 1^\circ\text{C} = \Delta 1\text{ K}$.',
        correctApproachBn:
          'তাপমাত্রার পার্থক্যের ক্ষেত্রে সেলসিয়াস আর কেলভিনের মান হুবহু এক: $\\Delta\\theta = 80 - 20 = 60^\\circ\\text{C} = 60\\text{ K}$। ২৭৩ যোগ করতে হয় কেবল কোনো একক তাপমাত্রার মান রূপান্তরে।',
        correctApproachEn:
          'Temperature differences are identical in Celsius and Kelvin scales: $\Delta\theta = 60^\circ\text{C} = 60\text{ K}$. Never add 273 to a difference.',
        examinerSecretTipBn:
          'মনে রাখবে: তাপমাত্রা পার্থক্য মানেই $\\Delta C = \\Delta K$। এখানে কোনো ২৭৩ যোগ হবে না।',
        examinerSecretTipEn:
          'Mnemonic: $\Delta T$ has the same numeric value in Celsius and Kelvin. Zero offset cancelled out.',
      },
      {
        id: 'trap-2-expansion-coeffs-ratio',
        titleBn: 'ক্ষেত্র প্রসারণ (β) বা আয়তন প্রসারণে (γ) দৈর্ঘ্য প্রসারণ সহগকে ২ বা ৩ দিয়ে গুণ না করা',
        titleEn: 'Failing to Multiply Linear Expansion Coefficient by 2 or 3 for Area or Volume',
        lostMarks: 2,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক)',
        commonMistakeBn:
          'প্রশ্নে ক্ষেত্রফল প্রসারণ চেয়েছে কিন্তু উদ্দীপকে দেওয়া আছে দৈর্ঘ্য প্রসারণ সহগ $\\alpha$। ছাত্রছাত্রীরা সরাসরি $\\alpha$ বসিয়ে ক্ষেত্রফল হিসাব করে ফেলে।',
        commonMistakeEn:
          'Using $\alpha$ directly for area expansion without multiplying by 2 ($\beta = 2\alpha$).',
        correctApproachBn:
          'ক্ষেত্রফল প্রসারণে $\\beta = 2\\alpha$ এবং আয়তন প্রসারণে $\\gamma = 3\\alpha$ ব্যবহার করতে হবে।',
        correctApproachEn:
          'Always convert: Area expansion coefficient $\beta = 2\alpha$; volume coefficient $\gamma = 3\alpha$.',
        examinerSecretTipBn:
          'উদ্দীপকে ভালো করে খেয়াল করো—কোন সহগ দেওয়া আছে: আলফা (দৈর্ঘ্য), বিটা (ক্ষেত্র) নাকি গামা (আয়তন)!',
        examinerSecretTipEn:
          'Check the symbol in the problem: $\alpha$ (length), $\beta$ (area), or $\gamma$ (volume).',
      },
      {
        id: 'trap-3-latent-heat-temperature',
        titleBn: 'সুপ্ততাপের সমীকরণে তাপমাত্রা পরিবর্তন (Δθ) বসিয়ে ফেলা',
        titleEn: 'Adding Temperature Difference into Latent Heat Equation',
        lostMarks: 1,
        frequentlyTestedIn: 'ঘ-অংশ (ক্যালরিমিতি মিশ্রণ)',
        commonMistakeBn:
          'বরফ গলনের সময় $Q = mL_f\\Delta\\theta$ লিখে ফেলা। অথচ বরফ গলনের সময় তাপমাত্রার কোনো পরিবর্তন হয় না!',
        commonMistakeEn:
          'Writing $Q = mL_f\Delta\theta$ instead of $Q = mL_f$. Phase change occurs at constant temperature.',
        correctApproachBn:
          'অবস্থার পরিবর্তনে তাপমাত্রা স্থির থাকে, তাই সুপ্ততাপের সূত্রে কোনো $\\Delta\\theta$ থাকে না: $Q = mL_f$ (গলন) এবং $Q = mL_v$ (বাষ্পীভবন)।',
        correctApproachEn:
          'Phase change is isothermal: $Q = mL_f$ for melting and $Q = mL_v$ for boiling.',
        examinerSecretTipBn:
          '০ ডিগ্রি সেলসিয়াসের বরফকে ১০০ ডিগ্রি সেলসিয়াসের বাষ্পে নিতে ৩টি ধাপ থাকে: বরফ গলন ($mL_f$), পানি গরম ($ms\\Delta\\theta$), এবং বাষ্পীভবন ($mL_v$)।',
        examinerSecretTipEn:
          'Three distinct steps exist from ice to steam: $mL_f \to ms\Delta\theta \to mL_v$.',
      },
    ],
  },
  step5: {
    quizzes: [
      {
        id: 'q1-heat-scale-equal',
        questionBn: 'কোন তাপমাত্রায় সেলসিয়াস ও ফারেনহাইট স্কেল একই পাঠ প্রদর্শন করে?',
        questionEn: 'At what temperature do Celsius and Fahrenheit scales indicate the same numeric reading?',
        questionType: 'MCQ',
        optionsBn: ['-40°', '40°', '-32°', '0°'],
        optionsEn: ['-40°', '40°', '-32°', '0°'],
        correctOptionIndex: 0,
        explanationBn:
          'ধরি $C = F = x$। তাহলে $\\frac{x}{5} = \\frac{x - 32}{9} \\implies 9x = 5x - 160 \\implies 4x = -160 \\implies x = -40^\\circ$।',
        explanationEn:
          'Let $C = F = x$. Then $x/5 = (x - 32)/9 \implies 4x = -160 \implies x = -40^\circ$. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৩',
      },
      {
        id: 'q2-heat-expansion-ratio',
        questionBn:
          'কঠিন পদার্থের দৈর্ঘ্য, ক্ষেত্র ও আয়তন প্রসারণ সহগের মধ্যকার অনুপাত (α : β : γ) কত?',
        questionEn:
          'What is the ratio between linear, areal, and volumetric expansion coefficients (α : β : γ)?',
        questionType: 'MCQ',
        optionsBn: ['1 : 2 : 3', '3 : 2 : 1', '1 : 4 : 9', '2 : 4 : 6'],
        optionsEn: ['1 : 2 : 3', '3 : 2 : 1', '1 : 4 : 9', '2 : 4 : 6'],
        correctOptionIndex: 0,
        explanationBn:
          'যেহেতু $\\beta = 2\\alpha$ এবং $\\gamma = 3\\alpha$, তাই $\\alpha : \\beta : \\gamma = \\alpha : 2\\alpha : 3\\alpha = 1 : 2 : 3$।',
        explanationEn:
          'Since $\beta = 2\alpha$ and $\gamma = 3\alpha$, the canonical ratio is $1 : 2 : 3$. Option A is correct.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৪',
      },
      {
        id: 'q3-heat-water-capacity',
        questionBn: 'পানির আপেক্ষিক তাপ কত?',
        questionEn: 'What is the specific heat capacity of pure water?',
        questionType: 'MCQ',
        optionsBn: [
          '4200 J/(kg·K)',
          '2100 J/(kg·K)',
          '336000 J/(kg·K)',
          '1000 J/(kg·K)',
        ],
        optionsEn: [
          '4200 J/(kg·K)',
          '2100 J/(kg·K)',
          '336000 J/(kg·K)',
          '1000 J/(kg·K)',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'পানির আপেক্ষিক তাপ $s = 4200\\text{ J/(kg}\\cdot\\text{K)}$। বরফের আপেক্ষিক তাপ $2100\\text{ J/(kg}\\cdot\\text{K)}$।',
        explanationEn:
          'Specific heat of water is $4200\text{ J/(kg}\cdot\text{K)}$. Ice is $2100\text{ J/(kg}\cdot\text{K)}$. Option A is correct.',
        boardSource: 'রাজশাহী বোর্ড ২০২২',
      },
    ],
  },
};
