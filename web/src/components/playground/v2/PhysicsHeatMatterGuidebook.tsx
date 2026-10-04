'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChevronRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  X,
  Send,
  Thermometer,
  Flame,
  Droplet,
  Sliders,
  Scale,
  Compass,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';

interface LessonContent {
  id: number;
  title: string;
  subtitle: string;
  nctbPage: string;
  badge: string;
  intro: string;
}

const LESSONS: LessonContent[] = [
  {
    id: 1,
    title: 'তাপ, তাপমাত্রা ও স্কেল রূপান্তর',
    subtitle: 'Heat, Temperature & Scale Conversion',
    nctbPage: '১৬১-১৬৬',
    badge: 'বোর্ড বেসিক',
    intro: 'তাপ হলো মোট আণবিক গতিশক্তি আর তাপমাত্রা হলো বস্তুর তাপীয় অবস্থা যা নির্ধারণ করে তাপ কোন দিকে প্রবাহিত হবে। সেলসিয়াস, ফারেনহাইট ও কেলভিনের সর্বজনীন সম্পর্ক: $C/5 = (F-32)/9 = (K-273)/5$।',
  },
  {
    id: 2,
    title: 'কঠিনের তাপীয় প্রসারণ ও রেললাইন',
    subtitle: 'Thermal Expansion of Solids (α, β, γ)',
    nctbPage: '১৬৬-১৭০',
    badge: 'বোর্ড নিশ্চিত সৃজনশীল',
    intro: 'তাপ দিলে কঠিন পদার্থের অণুগুলোর স্প্রিং-সদৃশ কম্পন বেড়ে যাওয়ায় দৈর্ঘ্য, ক্ষেত্রফল ও আয়তন প্রসারিত হয়। সহগগুলোর অনুপাত: $\\beta = 2\\alpha$ এবং $\\gamma = 3\\alpha$। বাস্তব জীবনে রেললাইনে ফাঁক না রাখলে তা বেঁকে যায়!',
  },
  {
    id: 3,
    title: 'তরলের প্রসারণ ও পানির ব্যতিক্রম',
    subtitle: 'Real vs Apparent & Anomalous Water',
    nctbPage: '১৭১-১৭৫',
    badge: 'বোর্ড ও ভাইভা স্পেশাল',
    intro: 'তরলকে পাত্রে রেখে উত্তপ্ত করতে হয় বলে পাত্রের প্রসারণ বিবেচনায় আসে: প্রকৃত প্রসারণ = আপাত প্রসারণ + পাত্রের প্রসারণ ($V_r = V_a + V_g$)। $0^\\circ\\text{C}$ থেকে $4^\\circ\\text{C}$ পর্যন্ত পানির ব্যতিক্রমী প্রসারণের জন্যই শীতে জলজ প্রাণী বেঁচে থাকে!',
  },
  {
    id: 4,
    title: 'আপেক্ষিক তাপ ও ক্যালোরিমিতি',
    subtitle: 'Specific Heat & Calorimetry Principle',
    nctbPage: '১৭৮-১৮১',
    badge: 'বোর্ড ৪-নম্বর সৃজনশীল',
    intro: 'গৃহীত বা বর্জিত তাপ $Q = ms\\Delta\\theta$। ক্যালোরিমিতির মূলনীতি: তাপীয় অপচয় না থাকলে বর্জিত তাপ = গৃহীত তাপ ($Q_{\\text{lost}} = Q_{\\text{gained}}$)। পানির আপেক্ষিক তাপ সবচেয়ে বেশি ($4200\\text{ J/(kg}\\cdot\\text{K)}$)।',
  },
  {
    id: 5,
    title: 'সুপ্ততাপ ও প্রেশার কুকার',
    subtitle: 'Latent Heat, Phase Changes & Pressure',
    nctbPage: '১৭৫-১৭৭, ১৮১-১৮২',
    badge: 'বোর্ড কনসেপ্ট মাস্টার',
    intro: 'অবস্থার পরিবর্তনের সময় তাপমাত্রা স্থির থাকে এবং শোষিত তাপ আন্তঃআণবিক বন্ধন ভাঙতে ব্যবহৃত হয় ($Q = mL$) বরফ গলনের সুপ্ততাপ $L_f = 3.36 \\times 10^5\\text{ J/kg}$। প্রেশার কুকারে উচ্চ চাপে স্ফুটনাঙ্ক বৃদ্ধি পাওয়ায় রান্না দ্রুত হয়!',
  },
];

export default function PhysicsHeatMatterGuidebook() {
  // Navigation & Layout States
  const [activeStep, setActiveStep] = useState<'learn' | 'example' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [aiTutorOpen, setAiTutorOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'নমস্কার! আমি সেরাটিউটর পদার্থবিজ্ঞান সহকারী। অধ্যায় ৬: "বস্তুর ওপর তাপের প্রভাব" এর তাপমাত্রা স্কেল, প্রসারণ গুণাঙ্ক, ক্যালোরিমিতি বা সুপ্ততাপের যেকোনো জিজ্ঞাসা থাকলে নির্দ্বিধায় প্রশ্ন করো!',
    },
  ]);
  const [userQuestion, setUserQuestion] = useState<string>('');

  // -------------------------------------------------------------------------
  // LAB 1 STATE: Temperature Scales & Molecular Kinetics
  // -------------------------------------------------------------------------
  const [celsiusVal, setCelsiusVal] = useState<number>(37); // Human body temp default
  const fahrenheitVal = (celsiusVal * 9) / 5 + 32;
  const kelvinVal = celsiusVal + 273.15;

  // -------------------------------------------------------------------------
  // LAB 2 STATE: Solid Thermal Expansion & Railway Track Gap
  // -------------------------------------------------------------------------
  const [selectedMetal, setSelectedMetal] = useState<'copper' | 'iron' | 'aluminum' | 'brass' | 'invar'>('iron');
  const [initialLength, setInitialLength] = useState<number>(30); // 30 meters
  const [deltaTemp, setDeltaTemp] = useState<number>(40); // 40 degrees C
  const [railGap, setRailGap] = useState<number>(1.5); // 1.5 cm gap

  const metalCoeffs = {
    copper: { name: 'তামা (Copper)', alpha: 16.7e-6, color: 'text-amber-500' },
    iron: { name: 'লোহা / ইস্পাত (Steel)', alpha: 11.5e-6, color: 'text-slate-400' },
    aluminum: { name: 'অ্যালুমিনিয়াম (Aluminum)', alpha: 23.0e-6, color: 'text-cyan-400' },
    brass: { name: 'পিতল (Brass)', alpha: 19.0e-6, color: 'text-yellow-400' },
    invar: { name: 'ইনভার (Invar)', alpha: 0.9e-6, color: 'text-emerald-400' },
  };

  const currentAlpha = metalCoeffs[selectedMetal].alpha;
  const deltaLengthM = currentAlpha * initialLength * deltaTemp;
  const deltaLengthCm = deltaLengthM * 100;
  const remainingGapCm = railGap - deltaLengthCm;
  const isRailBuckled = remainingGapCm <= 0;

  // -------------------------------------------------------------------------
  // LAB 3 STATE: Liquid Expansion & Anomalous Water Expansion
  // -------------------------------------------------------------------------
  const [liquidMode, setLiquidMode] = useState<'flask' | 'anomalous'>('flask');
  // Flask mode steps: 1 = Initial (A), 2 = Glass expanded (B), 3 = Liquid expanded (C)
  const [flaskStep, setFlaskStep] = useState<number>(1);
  // Anomalous water temp: 0 to 10 C
  const [waterTemp, setWaterTemp] = useState<number>(4);

  // Density curve for water around 4 C: peaks at 1000 kg/m^3 at 4 C
  const waterDensity = (1000 - Math.pow(waterTemp - 4, 2) * 0.15).toFixed(2);

  // -------------------------------------------------------------------------
  // LAB 4 STATE: Calorimetry Thermal Exchange & Equilibrium Mixer
  // -------------------------------------------------------------------------
  const [hotMaterial, setHotMaterial] = useState<'iron' | 'copper' | 'lead' | 'water'>('iron');
  const [hotMass, setHotMass] = useState<number>(0.2); // 0.2 kg
  const [hotTemp, setHotTemp] = useState<number>(100); // 100 C
  const [coldMass, setColdMass] = useState<number>(0.5); // 0.5 kg
  const [coldTemp, setColdTemp] = useState<number>(20); // 20 C
  const [mixAnimated, setMixAnimated] = useState<boolean>(false);

  const materialsSpecificHeat = {
    iron: { name: 'লোহা (Iron)', s: 450, color: 'text-slate-300' },
    copper: { name: 'তামা (Copper)', s: 400, color: 'text-amber-400' },
    lead: { name: 'সীসা (Lead)', s: 130, color: 'text-indigo-400' },
    water: { name: 'গরম পানি (Hot Water)', s: 4200, color: 'text-blue-400' },
  };

  const sHot = materialsSpecificHeat[hotMaterial].s;
  const sCold = 4200; // Cold liquid is always water
  // Equilibrium temperature: T_final = (m1*s1*T1 + m2*s2*T2) / (m1*s1 + m2*s2)
  const finalEquilibriumTemp = (
    (hotMass * sHot * hotTemp + coldMass * sCold * coldTemp) /
    (hotMass * sHot + coldMass * sCold)
  ).toFixed(1);

  const heatTransferredJoules = Math.round(
    hotMass * sHot * (hotTemp - parseFloat(finalEquilibriumTemp))
  );

  // -------------------------------------------------------------------------
  // LAB 5 STATE: Latent Heat Phase Changes & Pressure Cooker
  // -------------------------------------------------------------------------
  const [heatEnergyInputKJ, setHeatEnergyInputKJ] = useState<number>(400); // 0 to 3200 kJ for 1 kg ice
  const [ambientPressureAtm, setAmbientPressureAtm] = useState<number>(1.0); // 0.5 to 2.0 atm

  // Boiling point based on pressure (approx linear/Clausius–Clapeyron near 1 atm)
  // At 1.0 atm -> 100 C; at 0.6 atm -> 85 C; at 2.0 atm -> 120 C
  const boilingPointC = Math.round(100 + (ambientPressureAtm - 1.0) * 20);

  // Phase calculation for 1 kg ice starting at -10 C:
  // Q1 = m*s_ice*10 = 1 * 2.1 * 10 = 21 kJ (warms ice -10C -> 0C)
  // Q2 = m*Lf = 1 * 336 = 336 kJ (ice melts at 0C, total = 357 kJ)
  // Q3 = m*s_water*100 = 1 * 4.2 * 100 = 420 kJ (water heats 0C -> 100C, total = 777 kJ)
  // Q4 = m*Lv = 1 * 2260 = 2260 kJ (vaporizes at 100C, total = 3037 kJ)
  let currentPhase = 'বরফ (Ice)';
  let currentPhaseTemp = 0;
  let phaseProgressPercent = 0;

  if (heatEnergyInputKJ < 21) {
    currentPhase = 'বরফ উত্তপ্ত হচ্ছে (-১০°C থেকে ০°C)';
    currentPhaseTemp = -10 + (heatEnergyInputKJ / 21) * 10;
    phaseProgressPercent = 10;
  } else if (heatEnergyInputKJ < 357) {
    currentPhase = 'গলন চলছে (বরফ + পানি মিশ্রণ)';
    currentPhaseTemp = 0;
    phaseProgressPercent = 30;
  } else if (heatEnergyInputKJ < 777) {
    currentPhase = 'পানির তাপমাত্রা বৃদ্ধি পাচ্ছে (০°C থেকে ১০০°C)';
    const waterHeat = heatEnergyInputKJ - 357;
    currentPhaseTemp = (waterHeat / 420) * 100;
    phaseProgressPercent = 60;
  } else if (heatEnergyInputKJ < 3037) {
    currentPhase = 'বাষ্পীভবন চলছে (ফুটন্ত পানি + বাষ্প)';
    currentPhaseTemp = boilingPointC;
    phaseProgressPercent = 85;
  } else {
    currentPhase = 'অতি উত্তপ্ত বাষ্প (Superheated Steam)';
    const steamHeat = heatEnergyInputKJ - 3037;
    currentPhaseTemp = boilingPointC + steamHeat / (1 * 2.0);
    phaseProgressPercent = 100;
  }

  // -------------------------------------------------------------------------
  // STEP 2: Worked Board CQs & Examiner Rubric States
  // -------------------------------------------------------------------------
  const [expandedCQ, setExpandedCQ] = useState<number[]>([1]);
  const [expandedRubric, setExpandedRubric] = useState<number[]>([1]);

  const toggleCQ = (id: number) => {
    setExpandedCQ((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleRubric = (id: number) => {
    setExpandedRubric((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // -------------------------------------------------------------------------
  // STEP 3: Interactive Calculation Challenges State
  // -------------------------------------------------------------------------
  const [challenge1Input, setChallenge1Input] = useState<string>('');
  const [challenge1Status, setChallenge1Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge2Input, setChallenge2Input] = useState<string>('');
  const [challenge2Status, setChallenge2Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge3Input, setChallenge3Input] = useState<string>('');
  const [challenge3Status, setChallenge3Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleVerifyChallenge1 = () => {
    // Body temp 38.5 C to F: F = 38.5 * 1.8 + 32 = 69.3 + 32 = 101.3 F
    const val = parseFloat(challenge1Input);
    if (!isNaN(val) && Math.abs(val - 101.3) <= 0.3) {
      setChallenge1Status('correct');
    } else {
      setChallenge1Status('wrong');
    }
  };

  const handleVerifyChallenge2 = () => {
    // 50 m copper wire heated from 20 to 70 C (deltaT = 50 C).
    // deltaL = 50 * 16.7e-6 * 50 = 0.04175 m = 4.18 cm
    const val = parseFloat(challenge2Input);
    if (!isNaN(val) && Math.abs(val - 4.18) <= 0.1) {
      setChallenge2Status('correct');
    } else {
      setChallenge2Status('wrong');
    }
  };

  const handleVerifyChallenge3 = () => {
    // 1 kg water at 80 C + 2 kg water at 20 C.
    // T = (1*80 + 2*20) / (1+2) = 120 / 3 = 40 C
    const val = parseFloat(challenge3Input);
    if (!isNaN(val) && Math.abs(val - 40) <= 0.5) {
      setChallenge3Status('correct');
    } else {
      setChallenge3Status('wrong');
    }
  };

  // -------------------------------------------------------------------------
  // STEP 4: Board Standard MCQs State
  // -------------------------------------------------------------------------
  const [selectedMCQAnswers, setSelectedMCQAnswers] = useState<{ [key: number]: number }>({});
  const [submittedMCQ, setSubmittedMCQ] = useState<boolean>(false);

  const MCQ_DATA = [
    {
      id: 1,
      question: 'কোন তাপমাত্রায় সেলসিয়াস ও ফারেনহাইট স্কেল সমান পাঠ নির্দেশ করে?',
      options: ['০°', '১০০°', '-৪০°', '৪০°'],
      correctIndex: 2,
      explanation:
        'আমরা জানি, $C/5 = (F-32)/9$। ধরি $C = F = x$। তাহলে $x/5 = (x-32)/9 \\implies 9x = 5x - 160 \\implies 4x = -160 \\implies x = -40^\\circ$।',
    },
    {
      id: 2,
      question: 'কঠিন পদার্থের ক্ষেত্র প্রসারণ সহগ (β) এবং দৈর্ঘ্য প্রসারণ সহগের (α) সম্পর্ক কোনটি?',
      options: ['β = α', 'β = 2α', 'β = 3α', 'β = α / 2'],
      correctIndex: 1,
      explanation:
        'ক্ষেত্রফল দুটি রৈখিক মাত্রার গুণফল হওয়ায় $\\beta = 2\\alpha$ এবং আয়তন প্রসারণ সহগের ক্ষেত্রে $\\gamma = 3\\alpha$।',
    },
    {
      id: 3,
      question: 'পানির ঘনত্ব কোন তাপমাত্রায় সর্বোচ্চ হয়?',
      options: ['০°C', '৪°C', '১০০°C', '-৪°C'],
      correctIndex: 1,
      explanation:
        'পানির ব্যতিক্রমী প্রসারণের কারণে $0^\\circ\\text{C}$ থেকে $4^\\circ\\text{C}$ পর্যন্ত উত্তপ্ত করলে এর আয়তন কমে ও ঘনত্ব বাড়ে। $4^\\circ\\text{C}$-এ ঘনত্ব সর্বোচ্চ ($1000\\text{ kg/m}^3$)।',
    },
    {
      id: 4,
      question: 'বরফ গলনের সুপ্ততাপ ($L_f$) এর মান কত?',
      options: [
        '$2.26 \\times 10^6\\text{ J/kg}$',
        '$3.36 \\times 10^5\\text{ J/kg}$',
        '$4.2 \\times 10^3\\text{ J/kg}$',
        '$2.1 \\times 10^3\\text{ J/kg}$',
      ],
      correctIndex: 1,
      explanation:
        '$0^\\circ\\text{C}$ তাপমাত্রার $1\\text{ kg}$ বরফকে গলিয়ে $0^\\circ\\text{C}$ পানিতে রূপান্তর করতে $3.36 \\times 10^5\\text{ J}$ তাপ প্রয়োজন। (বাষ্পীভবনের সুপ্ততাপ $L_v = 2.26 \\times 10^6\\text{ J/kg}$)।',
    },
    {
      id: 5,
      question: 'প্রেশার কুকারে খাবার তাড়াতাড়ি সেদ্ধ হওয়ার মূল কারণ কী?',
      options: [
        'তাপ নির্গত হতে পারে না বলে',
        'উচ্চ চাপে পানির স্ফুটনাঙ্ক বৃদ্ধি পায় বলে',
        'পানির আপেক্ষিক তাপ কমে যায় বলে',
        'বাষ্পের ঘনত্ব কমে যায় বলে',
      ],
      correctIndex: 1,
      explanation:
        'প্রেশার কুকারের ভেতরের বাষ্প বের হতে পারে না বলে চাপ প্রায় ২ গুণ বৃদ্ধি পায়। চাপের কারণে পানির স্ফুটনাঙ্ক $100^\\circ\\text{C}$ থেকে বেড়ে প্রায় $120^\\circ\\text{C}$ হয়, তাই উচ্চ তাপমাত্রায় দ্রুত রান্না হয়।',
    },
  ];

  const handleSelectMCQ = (qIndex: number, optIndex: number) => {
    if (submittedMCQ) return;
    setSelectedMCQAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  // -------------------------------------------------------------------------
  // STEP 5: Summary Note Copy State
  // -------------------------------------------------------------------------
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  const handleCopyNotes = () => {
    const summaryText = `[SheraTutor Physics Chapter 6: বস্তুর ওপর তাপের প্রভাব Formula Sheet]
1. স্কেল রূপান্তর: C / 5 = (F - 32) / 9 = (K - 273.15) / 5
2. দৈর্ঘ্য প্রসারণ: ΔL = α * L1 * ΔT
3. ক্ষেত্র প্রসারণ: ΔA = β * A1 * ΔT, যেখানে β = 2α
4. আয়তন প্রসারণ: ΔV = γ * V1 * ΔT, যেখানে γ = 3α
5. তরলের প্রকৃত প্রসারণ: Vr = Va + Vg (বা γr = γa + γg)
6. আপেক্ষিক তাপ ও তাপশক্তি: Q = m * s * Δθ, তাপ ধারণক্ষমতা C = m * s
7. ক্যালোরিমিতির মূলনীতি: বর্জিত তাপ = গৃহীত তাপ (Q_lost = Q_gained)
8. অবস্থার পরিবর্তন ও সুপ্ততাপ: Q = m * Lf (গলন: 3.36×10^5 J/kg), Q = m * Lv (বাষ্পীভবন: 2.26×10^6 J/kg)`;
    navigator.clipboard.writeText(summaryText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const handleSendAiMessage = () => {
    if (!userQuestion.trim()) return;
    const q = userQuestion;
    setUserQuestion('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: q }]);

    setTimeout(() => {
      let reply =
        'পদার্থবিজ্ঞান বলছে: তাপমাত্রার পার্থক্যই তাপ সঞ্চালনের চালিকাশক্তি। তোমার প্রশ্নে কোনো সুনির্দিষ্ট মান বা বোর্ড সমীকরণ সম্পর্কিত থাকলে আমাকে আরও বিশদে বলো!';
      if (q.includes('রেললাইন') || q.includes('ফাঁক')) {
        reply =
          'রেললাইনে ফাঁক রাখার কারণ হলো গ্রীষ্মকালে তাপমাত্রার কারণে ইস্পাত প্রসারিত হয় (ΔL = α·L1·ΔT)। ফাঁক না থাকলে পার্শ্ববর্তী প্রসারণের সুযোগ না পেয়ে রেললাইন বেঁকে গিয়ে মারাত্মক লাইনচ্যুতির ঝুঁকি তৈরি হতো!';
      } else if (q.includes('পানির ব্যতিক্রম') || q.includes('মাছ') || q.includes('হ্রদ')) {
        reply =
          'সাধারণ তরল ঠাণ্ডা হলে সংকুচিত হয়, কিন্তু পানি ৪°C থেকে ০°C পর্যন্ত ঠাণ্ডা হলে প্রসারিত হয় ও ঘনত্ব কমে যায়। তাই বরফ পানির ওপরে ভাসে এবং হ্রদের তলদেশে ৪°C তাপমাত্রার ভারী পানি অবস্থান করায় মাছ ও জলজ প্রাণী বেঁচে থাকে!';
      } else if (q.includes('প্রেশার কুকার') || q.includes('রান্না')) {
        reply =
          'প্রেশার কুকারে বাষ্প আবদ্ধ রেখে ভেতরের চাপ প্রায় ২ গুণ বৃদ্ধি করা হয়। চাপ বৃদ্ধির ফলে পানির স্ফুটনাঙ্ক ১০০°C থেকে বেড়ে প্রায় ১২০°C হয়। ফলে উচ্চ তাপমাত্রার পানিতে দ্রুত রান্না সম্পন্ন হয়!';
      } else if (q.includes('ক্যালোরিমিতি') || q.includes('মিশ্রণ')) {
        reply =
          'ক্যালোরিমিতির মূলনীতি হলো: যদি পরিবেশ বা পাত্রে কোনো তাপ অপচয় না ঘটে, তবে উচ্চ তাপমাত্রার বস্তু কর্তৃক বর্জিত তাপ = শীতল বস্তু কর্তৃক গৃহীত তাপ (Q_lost = Q_gained)।';
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="physics"
        subjectNameBn="পদার্থবিজ্ঞান"
        chapterNum={6}
        chapterTitleBn="বস্তুর ওপর তাপের প্রভাব (Effect of Heat on Matter)"
        activeLesson={activeLesson}
        activeLessonTitle={LESSONS[activeLesson - 1]?.title}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenAi={() => setAiTutorOpen(true)}
        aiButtonLabel="এআই টিউটর"
        centerContent={
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveStep('learn')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeStep === 'learn'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>১. কনসেপ্ট</span>
            </button>
            <button
              onClick={() => setActiveStep('example')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeStep === 'example'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>২. CQ</span>
            </button>
            <button
              onClick={() => setActiveStep('try')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeStep === 'try'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>৩. প্র্যাকটিস</span>
            </button>
            <button
              onClick={() => setActiveStep('quiz')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeStep === 'quiz'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>৪. কুইজ</span>
            </button>
            <button
              onClick={() => setActiveStep('summary')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeStep === 'summary'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>৫. সামারি</span>
            </button>
          </div>
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* MAIN WORKSPACE LAYOUT                                               */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR: Lesson Navigator */}
        {sidebarOpen && (
          <aside className="w-72 lg:w-80 border-r border-slate-800 bg-slate-900/60 backdrop-blur-sm flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  অধ্যায় সূচিপত্র (NCTB)
                </span>
                <span className="text-xs text-rose-400 font-mono">৫টি পূর্ণাঙ্গ পাঠ</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-2">
              {LESSONS.map((lesson) => {
                const isSelected = activeLesson === lesson.id && activeStep === 'learn';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(lesson.id);
                      setActiveStep('learn');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-rose-600/15 border-rose-500/40 text-rose-200 shadow-md shadow-rose-950/40'
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-rose-400">পাঠ ০{['১', '২', '৩', '৪', '৫'][lesson.id - 1]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        পৃ. {lesson.nctbPage}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-200 leading-tight mb-1">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-1">{lesson.subtitle}</div>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>বোর্ড পরীক্ষায় এই অধ্যায় থেকে গড়ে ১০ নম্বরের ১টি পূর্ণ CQ এসে থাকে।</span>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN INTERACTIVE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-950">
          {/* =============================================================== */}
          {/* STEP 1: LEARN CONCEPT & INTERACTIVE PHYSICS LABS                 */}
          {/* =============================================================== */}
          {activeStep === 'learn' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Lesson Hero Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {LESSONS[activeLesson - 1].badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    এনসিটিবি পৃষ্ঠা {LESSONS[activeLesson - 1].nctbPage}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  পাঠ ০{activeLesson}: {LESSONS[activeLesson - 1].title}
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  <RenderMathText text={LESSONS[activeLesson - 1].intro} />
                </p>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* LAB 1: TEMPERATURE SCALES & MOLECULAR KINETICS                */}
              {/* ------------------------------------------------------------- */}
              {activeLesson === 1 && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-rose-400" />
                        তাপমাত্রা স্কেল ও আণবিক গতিশক্তি লাইভ ল্যাব
                      </h3>
                      <p className="text-xs text-slate-400">
                        সেলসিয়াস, ফারেনহাইট ও কেলভিন স্কেলের আন্তঃরূপান্তর এবং তাপমাত্রায় অণুর কম্পন বিস্তার প্রত্যক্ষ করো।
                      </p>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => setCelsiusVal(-40)}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          celsiusVal === -40
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        সমবিন্দু (-৪০°)
                      </button>
                      <button
                        onClick={() => setCelsiusVal(0)}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          celsiusVal === 0
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        বরফ গলনাঙ্ক (০°C)
                      </button>
                      <button
                        onClick={() => setCelsiusVal(37)}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          celsiusVal === 37
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        মানবদেহ (৩৭°C)
                      </button>
                      <button
                        onClick={() => setCelsiusVal(100)}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          celsiusVal === 100
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        স্ফুটনাঙ্ক (১০০°C)
                      </button>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-300">সেলসিয়াস তাপমাত্রা নিয়ন্ত্রণ (T_C):</span>
                      <span className="text-rose-400 font-mono text-base font-bold">{celsiusVal}°C</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="150"
                      step="1"
                      value={celsiusVal}
                      onChange={(e) => setCelsiusVal(parseFloat(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>-৫০°C (চরম শৈত্য)</span>
                      <span>০°C (বরফ)</span>
                      <span>৫০°C (উষ্ণ)</span>
                      <span>১০০°C (বাষ্প)</span>
                      <span>১৫০°C (অতি উত্তপ্ত)</span>
                    </div>
                  </div>

                  {/* Dual Simulation View: 3 Thermometers & Molecular Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Visualizer 1: 3 Thermometers Side-by-Side */}
                    <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center justify-between">
                        <span>থার্মোমিটার পারদ স্তম্ভ তুলনা</span>
                        <span className="font-mono text-rose-400">C/5 = (F-32)/9 = (K-273)/5</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center my-auto py-2">
                        {/* Celsius */}
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-rose-400 mb-1">সেলসিয়াস (°C)</span>
                          <div className="w-8 h-44 bg-slate-800 rounded-full p-1 relative flex flex-col justify-end border border-slate-700">
                            {/* Mercury Column */}
                            <div
                              className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-full transition-all duration-300"
                              style={{
                                height: `${Math.min(100, Math.max(5, ((celsiusVal + 50) / 200) * 100))}%`,
                              }}
                            />
                            {/* Bulb */}
                            <div className="w-6 h-6 bg-rose-600 rounded-full mx-auto -mb-2 border-2 border-rose-400 shadow-lg shadow-rose-600/50" />
                          </div>
                          <span className="text-sm font-mono font-bold text-white mt-4">{celsiusVal}°C</span>
                        </div>

                        {/* Fahrenheit */}
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-amber-400 mb-1">ফারেনহাইট (°F)</span>
                          <div className="w-8 h-44 bg-slate-800 rounded-full p-1 relative flex flex-col justify-end border border-slate-700">
                            {/* Mercury Column */}
                            <div
                              className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-full transition-all duration-300"
                              style={{
                                height: `${Math.min(100, Math.max(5, ((fahrenheitVal + 58) / 360) * 100))}%`,
                              }}
                            />
                            {/* Bulb */}
                            <div className="w-6 h-6 bg-amber-600 rounded-full mx-auto -mb-2 border-2 border-amber-400 shadow-lg shadow-amber-600/50" />
                          </div>
                          <span className="text-sm font-mono font-bold text-white mt-4">
                            {fahrenheitVal.toFixed(1)}°F
                          </span>
                        </div>

                        {/* Kelvin */}
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-cyan-400 mb-1">কেলভিন (K)</span>
                          <div className="w-8 h-44 bg-slate-800 rounded-full p-1 relative flex flex-col justify-end border border-slate-700">
                            {/* Mercury Column */}
                            <div
                              className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-full transition-all duration-300"
                              style={{
                                height: `${Math.min(100, Math.max(5, ((kelvinVal - 223) / 200) * 100))}%`,
                              }}
                            />
                            {/* Bulb */}
                            <div className="w-6 h-6 bg-cyan-600 rounded-full mx-auto -mb-2 border-2 border-cyan-400 shadow-lg shadow-cyan-600/50" />
                          </div>
                          <span className="text-sm font-mono font-bold text-white mt-4">
                            {kelvinVal.toFixed(1)} K
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-2">
                        {celsiusVal === -40 ? (
                          <span className="text-emerald-400 font-semibold">
                            🎯 চমৎকার! -৪০° এ সেলসিয়াস ও ফারেনহাইট স্কেল ঠিক একই সংখ্যা নির্দেশ করে!
                          </span>
                        ) : (
                          <span>
                            সূত্র: <RenderMathText text="$$T_F = \frac{9}{5}T_C + 32, \quad T_K = T_C + 273.15$$" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Visualizer 2: Microscopic Molecular Simulation */}
                    <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                        <span>আণবিক স্তরে গতিশক্তি ($E_k \propto T_K$)</span>
                        <span className="text-[11px] text-rose-400 font-mono">
                          বেগ $\approx$ {Math.round(Math.sqrt(kelvinVal) * 18)} m/s
                        </span>
                      </div>

                      {/* Box with Jiggling Molecules */}
                      <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 p-4 gap-2">
                          {[...Array(15)].map((_, i) => {
                            const speed = Math.max(0.2, (celsiusVal + 60) / 100);
                            return (
                              <div key={i} className="flex items-center justify-center">
                                <div
                                  className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/50 animate-bounce"
                                  style={{
                                    animationDuration: `${Math.max(0.15, 1.2 / speed)}s`,
                                    transform: `scale(${0.8 + speed * 0.2})`,
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="absolute bottom-2 right-2 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                          {celsiusVal < 0
                            ? 'কঠিন ল্যাটিস: মৃদু কম্পন'
                            : celsiusVal < 100
                            ? 'তরল অবস্থা: মাঝারি ছোটাছুটি'
                            : 'বায়বীয় অবস্থা: তীব্র বিশৃঙ্খলা'}
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <span className="font-semibold text-rose-400">বোর্ড ভাইভা পয়েন্ট:</span>{' '}
                        <RenderMathText text="পরম শূন্য তাপমাত্রা ($0\text{ K} = -273.15^\circ\text{C}$)-এ বস্তুর সমস্ত আণবিক গতি সম্পূর্ণ স্তব্ধ হয়ে যায়। এর নিচে কোনো তাপমাত্রা সম্ভব নয়!" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 2: SOLID THERMAL EXPANSION & RAIL TRACK GAP               */}
              {/* ------------------------------------------------------------- */}
              {activeLesson === 2 && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-rose-400" />
                        কঠিনের তাপীয় প্রসারণ ও রেললাইনের ফাঁক ল্যাব
                      </h3>
                      <p className="text-xs text-slate-400">
                        ধাতুর দৈর্ঘ্য প্রসারণ সহগ ($\alpha$), ক্ষেত্র প্রসারণ ($\beta = 2\alpha$) এবং আয়তন প্রসারণ ($\gamma = 3\alpha$) পর্যবেক্ষণ করো।
                      </p>
                    </div>

                    {/* Metal Selector */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(Object.keys(metalCoeffs) as Array<keyof typeof metalCoeffs>).map((m) => (
                        <button
                          key={m}
                          onClick={() => setSelectedMetal(m)}
                          className={`px-3 py-1 rounded-lg border transition-all ${
                            selectedMetal === m
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {metalCoeffs[m].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">আদি দৈর্ঘ্য ($L_1$):</span>
                        <span className="font-mono text-rose-400 font-bold">{initialLength} m</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        step="5"
                        value={initialLength}
                        onChange={(e) => setInitialLength(parseFloat(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">তাপমাত্রা বৃদ্ধি ($\Delta T$):</span>
                        <span className="font-mono text-rose-400 font-bold">{deltaTemp}°C</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        step="5"
                        value={deltaTemp}
                        onChange={(e) => setDeltaTemp(parseFloat(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">রেলের জোড়ের ফাঁক (Gap):</span>
                        <span className="font-mono text-rose-400 font-bold">{railGap.toFixed(1)} cm</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={railGap}
                        onChange={(e) => setRailGap(parseFloat(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Railway Visual Simulation */}
                  <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                      <span>রেললাইনের জোড় সিমুলেশন (Live Expansion & Rail Buckling Risk)</span>
                      <span className="font-mono text-slate-300">
                        দৈর্ঘ্য বৃদ্ধি: <strong className="text-rose-400">{deltaLengthCm.toFixed(2)} cm</strong>
                      </span>
                    </div>

                    {/* Graphic Rails */}
                    <div className="bg-slate-900/90 p-6 rounded-xl border border-slate-800 relative">
                      {/* Sleepers under rail */}
                      <div className="flex justify-between mb-2 opacity-40">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-2.5 h-12 bg-amber-800/80 rounded" />
                        ))}
                      </div>

                      {/* Rail tracks */}
                      <div className="relative h-8 flex items-center">
                        {/* Left Rail Segment */}
                        <div
                          className="h-4 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-300 rounded-l shadow-md transition-all duration-300 relative"
                          style={{
                            width: `calc(50% + ${Math.min(25, deltaLengthCm * 8)}px)`,
                          }}
                        >
                          <span className="absolute -top-5 left-2 text-[10px] text-slate-400 font-mono">
                            রেলখণ্ড ১ ({initialLength} m)
                          </span>
                        </div>

                        {/* Gap Marker */}
                        <div className="mx-1 h-6 border-l border-r border-dashed border-rose-500/60 flex items-center justify-center">
                          {isRailBuckled && (
                            <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping absolute" />
                          )}
                        </div>

                        {/* Right Rail Segment */}
                        <div className="flex-1 h-4 bg-gradient-to-l from-slate-600 via-slate-400 to-slate-300 rounded-r shadow-md" />
                      </div>

                      {/* Ruler Indicator */}
                      <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2">
                        <span>আদি ফাঁক: {railGap.toFixed(1)} cm</span>
                        <span>প্রসারিত দৈর্ঘ্য: +{deltaLengthCm.toFixed(2)} cm</span>
                        <span>
                          অবশিষ্ট ফাঁক:{' '}
                          <strong className={isRailBuckled ? 'text-rose-400' : 'text-emerald-400'}>
                            {remainingGapCm.toFixed(2)} cm
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Safety Alert Banner */}
                    <div
                      className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                        isRailBuckled
                          ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                          : 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
                      }`}
                    >
                      {isRailBuckled ? (
                        <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      )}
                      <div className="text-xs leading-relaxed">
                        {isRailBuckled ? (
                          <>
                            <strong className="text-rose-300 block text-sm mb-0.5">
                              ⚠️ সতর্কবার্তা: রেললাইন বেঁকে যাওয়ার মহাবিপদ!
                            </strong>
                            রেলখণ্ডের প্রসারণ ({deltaLengthCm.toFixed(2)} cm) নির্ধারিত ফাঁক ({railGap} cm)-কে অতিক্রম
                            করেছে। দুই প্রান্ত পরস্পরকে তীব্র বল প্রয়োগ করবে, ফলে রেললাইন বেঁকে গিয়ে ট্রেন দুর্ঘটনার
                            কারণ ঘটবে!
                          </>
                        ) : (
                          <>
                            <strong className="text-emerald-300 block text-sm mb-0.5">
                              ✅ নিরাপদ ডিজাইন বজায় আছে!
                            </strong>
                            তাপমাত্রার সর্বোচ্চ প্রসারণের পরও {remainingGapCm.toFixed(2)} cm নিরাপদ ফাঁক অবশিষ্ট আছে।
                            রেললাইন সোজা ও নিরাপদ থাকবে।
                          </>
                        )}
                      </div>
                    </div>

                    {/* Mathematical Formulas Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block mb-1">দৈর্ঘ্য প্রসারণ গুণাঙ্ক:</span>
                        <span className="text-rose-400 font-bold">
                          <RenderMathText text={`$\\alpha = \\frac{\\Delta L}{L_1 \\Delta T} = ${currentAlpha.toExponential(2)}\\text{ K}^{-1}$`} />
                        </span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block mb-1">ক্ষেত্র প্রসারণ গুণাঙ্ক:</span>
                        <span className="text-amber-400 font-bold">
                          <RenderMathText text={`$\\beta = 2\\alpha = ${(2 * currentAlpha).toExponential(2)}\\text{ K}^{-1}$`} />
                        </span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block mb-1">আয়তন প্রসারণ গুণাঙ্ক:</span>
                        <span className="text-cyan-400 font-bold">
                          <RenderMathText text={`$\\gamma = 3\\alpha = ${(3 * currentAlpha).toExponential(2)}\\text{ K}^{-1}$`} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 3: LIQUID EXPANSION & ANOMALOUS WATER EXPANSION          */}
              {/* ------------------------------------------------------------- */}
              {activeLesson === 3 && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-rose-400" />
                        তরলের প্রসারণ ও হিমায়িত হ্রদের জীবন ল্যাব
                      </h3>
                      <p className="text-xs text-slate-400">
                        <RenderMathText text="কাচের ফ্লাস্কে তরলের আপাত ও প্রকৃত প্রসারণ ($V_r = V_a + V_g$) এবং পানির ব্যতিক্রমী প্রসারণ ($0^\circ\text{C}-4^\circ\text{C}$) অন্বেষণ করো।" />
                      </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => setLiquidMode('flask')}
                        className={`px-3 py-1.5 rounded-lg border transition-all ${
                          liquidMode === 'flask'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ফ্লাস্কে আপাত vs প্রকৃত প্রসারণ
                      </button>
                      <button
                        onClick={() => setLiquidMode('anomalous')}
                        className={`px-3 py-1.5 rounded-lg border transition-all ${
                          liquidMode === 'anomalous'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        পানির ব্যতিক্রমী প্রসারণ ও জলজ জীবন
                      </button>
                    </div>
                  </div>

                  {liquidMode === 'flask' ? (
                    /* Flask Mode */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                      {/* Flask Animation Display */}
                      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                        <div className="text-xs font-semibold text-slate-400 mb-4">
                          কাচের ফ্লাস্কে তরলের তাপীয় আচরণ (Step-by-Step)
                        </div>

                        {/* Flask Graphic */}
                        <div className="relative w-44 h-64 flex flex-col items-center">
                          {/* Narrow Neck */}
                          <div className="w-8 h-32 bg-slate-800/80 border-2 border-slate-600 rounded-t relative overflow-hidden">
                            {/* Liquid Column */}
                            <div
                              className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 absolute bottom-0 transition-all duration-500"
                              style={{
                                height:
                                  flaskStep === 1
                                    ? '60%' // Level A
                                    : flaskStep === 2
                                    ? '40%' // Level B (drops due to glass expansion)
                                    : '90%', // Level C (shoots up due to liquid expansion)
                              }}
                            />
                            {/* Level Markings */}
                            <div className="absolute top-[10%] right-0 text-[10px] font-mono text-rose-400 pr-1 font-bold">
                              C —
                            </div>
                            <div className="absolute top-[40%] right-0 text-[10px] font-mono text-amber-400 pr-1 font-bold">
                              A —
                            </div>
                            <div className="absolute top-[60%] right-0 text-[10px] font-mono text-cyan-400 pr-1 font-bold">
                              B —
                            </div>
                          </div>

                          {/* Round Bulb */}
                          <div className="w-36 h-32 bg-slate-800/80 border-2 border-slate-600 rounded-full -mt-2 relative overflow-hidden flex items-center justify-center">
                            <div className="w-full h-full bg-gradient-to-t from-blue-700 to-blue-500 opacity-90" />
                            {flaskStep > 1 && (
                              <div className="absolute bottom-2 flex gap-1">
                                <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                                <Flame className="w-6 h-6 text-rose-500 animate-bounce" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Step Buttons */}
                        <div className="flex gap-2 mt-6">
                          <button
                            onClick={() => setFlaskStep(1)}
                            className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                              flaskStep === 1
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            ১. আদি অবস্থা (A দাগ)
                          </button>
                          <button
                            onClick={() => setFlaskStep(2)}
                            className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                              flaskStep === 2
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            ২. পাত্রের প্রসারণ (B দাগে পতন)
                          </button>
                          <button
                            onClick={() => setFlaskStep(3)}
                            className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                              flaskStep === 3
                                ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            ৩. তরলের বৃদ্ধি (C দাগে পৌঁছা)
                          </button>
                        </div>
                      </div>

                      {/* Explanation Card */}
                      <div className="space-y-4 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                        <div className="font-semibold text-rose-400 text-sm border-b border-slate-800 pb-2">
                          এনসিটিবি বোর্ড মেকানিজম ব্যাখ্যা:
                        </div>
                        <p>
                          <strong className="text-amber-400">ধাপ ১ (A দাগ):</strong> তরল প্রাথমিকভাবে কাচের ফ্লাস্কের A দাগ পর্যন্ত পূর্ণ থাকে।
                        </p>
                        <p>
                          <strong className="text-cyan-400">ধাপ ২ (B দাগে কেন নামে?):</strong> তাপ প্রয়োগের সাথে সাথে প্রথমে কাচের পাত্রটি তাপ গ্রহণ করে এবং প্রসারিত হয়ে আয়তনে বড় হয়। ফলে তরলের তল সাময়িকভাবে A থেকে নিচে নেমে <strong>B দাগে</strong> চলে আসে।
                        </p>
                        <p>
                          <strong className="text-rose-400">ধাপ ৩ (C দাগে কেন পৌঁছায়?):</strong> তরল তাপ গ্রহণ শুরু করার পর এর প্রসারণ কাচের প্রসারণের চেয়ে অনেক বেশি হওয়ায় তরলটি দ্রুত উপরে উঠে <strong>C দাগে</strong> পৌঁছায়।
                        </p>

                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                          <div className="text-slate-400">
                            • পাত্রের প্রসারণ: $V_g = V_B$ (উচ্চতা $AB \times$ প্রস্থচ্ছেদ)
                          </div>
                          <div className="text-slate-400">
                            • তরলের আপাত প্রসারণ: $V_a = V_L - V_B$ (উচ্চতা $AC \times$ প্রস্থচ্ছেদ)
                          </div>
                          <div className="text-emerald-400 font-bold">
                            • তরলের প্রকৃত প্রসারণ: $V_r = V_a + V_g$ (উচ্চতা $BC \times$ প্রস্থচ্ছেদ)
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Anomalous Water Mode */
                    <div className="space-y-6">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">পানির তাপমাত্রা নিয়ন্ত্রণ:</span>
                          <span className="font-mono text-cyan-400 text-base font-bold">{waterTemp}°C</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={waterTemp}
                          onChange={(e) => setWaterTemp(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span>০°C (বরফ জমনাঙ্ক)</span>
                          <span className="text-cyan-400 font-bold">৪°C (সর্বোচ্চ ঘনত্ব ১০০০ kg/m³)</span>
                          <span>১০°C (স্বাভাবিক তরল প্রসারণ)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ice Lake Cross Section */}
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                          <div className="text-xs font-semibold text-slate-400 flex justify-between">
                            <span>শীতপ্রধান দেশে হিমায়িত হ্রদ (Frozen Lake Ecology)</span>
                            <span className="font-mono text-cyan-300">ঘনত্ব: {waterDensity} kg/m³</span>
                          </div>

                          <div className="h-48 rounded-xl border border-slate-700 overflow-hidden flex flex-col relative">
                            {/* Top Ice Layer */}
                            <div className="h-10 bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200 border-b border-cyan-300/40 flex items-center justify-between px-3 text-[10px] font-bold text-slate-800">
                              <span>হিমায়িত বরফ পৃষ্ঠ (০°C)</span>
                              <span>ঘনত্ব ৯২০ kg/m³ (ভাসমান)</span>
                            </div>

                            {/* Middle Water Layer */}
                            <div className="flex-1 bg-gradient-to-b from-blue-900/60 to-blue-950/90 p-3 flex flex-col justify-between">
                              <div className="text-[10px] text-cyan-300/70 font-mono">মধ্যম স্তর: ২°C</div>

                              {/* Bottom Dense Layer with Fish */}
                              <div className="border-t border-cyan-800/60 pt-2 flex items-center justify-between">
                                <div className="text-[11px] text-cyan-300 font-semibold font-mono flex items-center gap-1">
                                  <span>তলদেশ: ৪°C (ভারী পানি)</span>
                                </div>
                                <div className="text-xs animate-pulse text-amber-300">
                                  🐟 🐠 জলজ প্রাণীরা সুরক্ষিত ও জীবিত!
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Explanation Text */}
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                          <div className="text-sm font-semibold text-cyan-400 border-b border-slate-800 pb-1">
                            পানির ব্যতিক্রমী প্রসারণের তাৎপর্য:
                          </div>
                          <p>
                            সাধারণত যেকোনো তরল ঠান্ডা করলে আয়তন সংকুচিত হয় ও ঘনত্ব বৃদ্ধি পায়। কিন্তু পানির ক্ষেত্রে{' '}
                            <strong>৪°C থেকে ০°C পর্যন্ত ঠান্ডা করলে সংকোচন না হয়ে বরং প্রসারণ ঘটে</strong>!
                          </p>
                          <p>
                            • <strong>৪°C তাপমাত্রায় পানির ঘনত্ব সর্বোচ্চ (১০০০ kg/m³)</strong>। তাই ঠান্ডা দিনে হ্রদের ৪°C তাপমাত্রার পানি সবচেয়ে ভারী হয়ে তলদেশে গিয়ে জমে।
                          </p>
                          <p>
                            • ০°C তাপমাত্রার বরফের ঘনত্ব মাত্র ৯২০ kg/m³ হওয়ায় বরফ পানির ওপরে ভেসে থাকে এবং তাপ কুপরিবাহী হওয়ায় নিচের পানিকে পুরোপুরি জমাট বাঁধতে দেয় না। ফলে প্রচণ্ড শীতেও মাছ বেঁচে থাকে!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 4: CALORIMETRY THERMAL BALANCE & MIXER                   */}
              {/* ------------------------------------------------------------- */}
              {activeLesson === 4 && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-rose-400" />
                        ক্যালোরিমিতির মূলনীতি ও মিশ্রণের চূড়ান্ত তাপমাত্রা ল্যাব
                      </h3>
                      <p className="text-xs text-slate-400">
                        <RenderMathText text="উত্তপ্ত কঠিন বস্তুকে শীতল পানিতে নিমজ্জিত করে তাপীয় সাম্যাবস্থা ($Q_{\text{lost}} = Q_{\text{gained}}$) প্রমাণ করো।" />
                      </p>
                    </div>

                    {/* Hot Material Selector */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(Object.keys(materialsSpecificHeat) as Array<keyof typeof materialsSpecificHeat>).map((mat) => (
                        <button
                          key={mat}
                          onClick={() => {
                            setHotMaterial(mat);
                            setMixAnimated(false);
                          }}
                          className={`px-3 py-1 rounded-lg border transition-all ${
                            hotMaterial === mat
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {materialsSpecificHeat[mat].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Hot Mass */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">উত্তপ্ত বস্তুর ভর ($m_1$):</span>
                        <span className="font-mono text-rose-400 font-bold">{hotMass.toFixed(2)} kg</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={hotMass}
                        onChange={(e) => {
                          setHotMass(parseFloat(e.target.value));
                          setMixAnimated(false);
                        }}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    {/* Hot Temp */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">বস্তুর তাপমাত্রা ($T_1$):</span>
                        <span className="font-mono text-rose-400 font-bold">{hotTemp}°C</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        step="5"
                        value={hotTemp}
                        onChange={(e) => {
                          setHotTemp(parseInt(e.target.value));
                          setMixAnimated(false);
                        }}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>

                    {/* Cold Mass */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">পানির ভর ($m_2$):</span>
                        <span className="font-mono text-cyan-400 font-bold">{coldMass.toFixed(2)} kg</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="2.0"
                        step="0.1"
                        value={coldMass}
                        onChange={(e) => {
                          setColdMass(parseFloat(e.target.value));
                          setMixAnimated(false);
                        }}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    {/* Cold Temp */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">পানির তাপমাত্রা ($T_2$):</span>
                        <span className="font-mono text-cyan-400 font-bold">{coldTemp}°C</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="35"
                        step="1"
                        value={coldTemp}
                        onChange={(e) => {
                          setColdTemp(parseInt(e.target.value));
                          setMixAnimated(false);
                        }}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <div className="text-center">
                    <button
                      onClick={() => setMixAnimated(true)}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/50 flex items-center gap-2 mx-auto transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>ক্যালোরিমিটার মিশ্রণ প্রক্রিয়া শুরু করুন</span>
                    </button>
                  </div>

                  {/* Results Display */}
                  <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">বস্তু কর্তৃক বর্জিত তাপ ($Q_1$):</span>
                        <span className="text-lg font-mono font-bold text-rose-400">
                          {mixAnimated ? `${heatTransferredJoules.toLocaleString()} J` : '—'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          $m_1 s_1 (T_1 - T_f)$
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-500/40 shadow-lg shadow-rose-950/40">
                        <span className="text-xs text-slate-300 block mb-1 font-semibold">
                          মিশ্রণের চূড়ান্ত তাপমাত্রা ($T_f$):
                        </span>
                        <span className="text-2xl font-mono font-bold text-amber-300">
                          {mixAnimated ? `${finalEquilibriumTemp}°C` : '—'}
                        </span>
                        <span className="text-[10px] text-emerald-400 block mt-1 font-medium">
                          {mixAnimated ? 'তাপীয় সাম্যাবস্থা অর্জিত!' : 'মিশ্রণ বাটন চাপুন'}
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">পানি কর্তৃক গৃহীত তাপ ($Q_2$):</span>
                        <span className="text-lg font-mono font-bold text-cyan-400">
                          {mixAnimated ? `${heatTransferredJoules.toLocaleString()} J` : '—'}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          $m_2 s_2 (T_f - T_2)$
                        </span>
                      </div>
                    </div>

                    {mixAnimated && (
                      <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300 leading-relaxed">
                        <strong>ক্যালোরিমিতির মূলনীতি নিশ্চিতকরণ:</strong> এখানে বর্জিত তাপ ({heatTransferredJoules}{' '}
                        J) এবং গৃহীত তাপ ({heatTransferredJoules} J) হুবহু সমান। শক্তির কোনো ক্ষয় হয়নি, যা তাপীয়
                        শক্তির নিত্যতা সূত্র প্রমাণ করে!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 5: LATENT HEAT PHASE CHANGES & PRESSURE COOKER           */}
              {/* ------------------------------------------------------------- */}
              {activeLesson === 5 && (
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-rose-400 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-400" />
                        সুপ্ততাপ হিটিং কার্ভ ও প্রেশার কুকার ল্যাব
                      </h3>
                      <p className="text-xs text-slate-400">
                        ১ কেজি বরফের বাষ্পে রূপান্তর, সুপ্ততাপ শোষণ ($Q=mL_f, mL_v$) এবং চাপে স্ফুটনাঙ্ক পরিবর্তনের সিমুলেশন।
                      </p>
                    </div>

                    <div className="text-xs font-mono px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                      স্ফুটনাঙ্ক: <strong className="text-rose-400">{boilingPointC}°C</strong> (চাপ:{' '}
                      {ambientPressureAtm.toFixed(1)} atm)
                    </div>
                  </div>

                  {/* Dual Sliders: Heat Input & Pressure */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">প্রদত্ত তাপশক্তি ($Q$):</span>
                        <span className="font-mono text-rose-400 font-bold">{heatEnergyInputKJ} kJ</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3200"
                        step="50"
                        value={heatEnergyInputKJ}
                        onChange={(e) => setHeatEnergyInputKJ(parseInt(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>০ kJ</span>
                        <span>৩৫৭ kJ (গলন শেষ)</span>
                        <span>৭৭৭ kJ (স্ফুটন শুরু)</span>
                        <span>৩০৩৭ kJ (বাষ্পায়ন শেষ)</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">পারিপার্শ্বিক চাপ (Pressure):</span>
                        <span className="font-mono text-amber-400 font-bold">{ambientPressureAtm.toFixed(1)} atm</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={ambientPressureAtm}
                        onChange={(e) => setAmbientPressureAtm(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>০.৫ atm (পাহাড়ের চূড়া)</span>
                        <span>১.০ atm (স্বাভাবিক সমুদ্রপৃষ্ঠ)</span>
                        <span>২.০ atm (প্রেশার কুকার)</span>
                      </div>
                    </div>
                  </div>

                  {/* Graphic Phase Transition Box */}
                  <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs text-slate-400 block">বর্তমান পদার্থের অবস্থা:</span>
                        <span className="text-base font-bold text-rose-400">{currentPhase}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">কার্যকরী তাপমাত্রা:</span>
                        <span className="text-xl font-mono font-bold text-amber-300">
                          {currentPhaseTemp.toFixed(1)}°C
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Phase Change */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>বরফ (-১০°C)</span>
                        <span>গলন (০°C)</span>
                        <span>পানি (১০০°C)</span>
                        <span>বাষ্পীভবন (১০০°C)</span>
                        <span>বাষ্প</span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${phaseProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Board Application: Pressure Cooker vs Everest */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                        <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-amber-400" />
                          প্রেশার কুকারে রান্না দ্রুত হয় কেন?
                        </span>
                        <p className="text-slate-300">
                          প্রেশার কুকারে বাষ্প আবদ্ধ থাকায় ভেতরের চাপ প্রায় <strong>২ বায়ুমণ্ডলীয় চাপে (2 atm)</strong> পৌঁছে যায়। ফলে পানির স্ফুটনাঙ্ক ১০০°C থেকে বেড়ে প্রায় <strong>১২০°C</strong> হয়। উচ্চ তাপমাত্রার সুপ্ততাপ খাদ্যদ্রব্যকে দ্রুত সিদ্ধ করে!
                        </p>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                        <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-cyan-400" />
                          পাহাড়ের চূড়ায় ডাল ফুটতে দেরি হয় কেন?
                        </span>
                        <p className="text-slate-300">
                          এভারেস্টের মতো উচ্চতায় বায়ুর চাপ কম (০.৫-০.৬ atm)। ফলে পানি মাত্র <strong>৮৫°C</strong> তাপমাত্রাতেই ফুটতে শুরু করে এবং বাষ্প হয়ে উড়ে যায়। প্রয়োজনীয় উচ্চ তাপ না পাওয়ায় রান্না হতে অনেক বেশি সময় লাগে!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 2: SEE EXAMPLE (4 WORKED BOARD CQS WITH EXAMINER RUBRICS)  */}
          {/* =============================================================== */}
          {activeStep === 'example' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs mb-1">
                  <Award className="w-4 h-4" />
                  <span>বোর্ড সৃজনশীল প্রশ্ন ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  বোর্ড স্ট্যান্ডার্ড ৪টি সমাধানকৃত সৃজনশীল প্রশ্ন (CQs)
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  এনসিটিবি পাঠ্যবই এবং ঢাকা ও রাজশাহী শিক্ষা বোর্ডের বিগত বছরের গাণিতিক সমস্যাগুলোর পুঙ্খানুপুঙ্খ ধাপভিত্তিক সমাধান এবং পরীক্ষকের গোপন নম্বর বণ্টন নির্দেশিকা।
                </p>
              </div>

              {/* CQ 1: Textbook Electric Wire Snapping in Winter */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                      পাঠ্যবই সৃজনশীল ০১ (পৃষ্ঠা ১৮৫)
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      বৈদ্যুতিক তারের সংকোচন ও শীতকালে তার ছিঁড়ে যাওয়ার কারণ
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(1)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(1) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> <RenderMathText text="দুটি বৈদ্যুতিক খুঁটির মধ্যবর্তী দূরত্ব $30\text{ m}$। খুঁটি দুটির সাথে $30.001\text{ m}$ দৈর্ঘ্যের তামার তার যেদিন সংযোগ দেওয়া হয় সেদিন বায়ুর তাপমাত্রা ছিল $30^\circ\text{C}$। তামার দৈর্ঘ্য প্রসারণ সহগ $16.7 \times 10^{-6}\text{ K}^{-1}$। শীতকালে যেদিন বায়ুর তাপমাত্রা $4^\circ\text{C}$ হলো সেদিন তারটি ছিঁড়ে গেল।" />
                </div>

                {expandedCQ.includes(1) && (
                  <div className="space-y-4 pt-2 text-xs">
                    {/* Subquestion C */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-rose-300 flex justify-between">
                        <span>(গ) বায়ুর তাপমাত্রাকে ফারেনহাইট স্কেলে প্রকাশ করো। [৩ নম্বর]</span>
                        <span className="text-[11px] text-slate-500 font-mono">প্রয়োগমূলক</span>
                      </div>
                      <div className="text-slate-300 space-y-2 leading-relaxed">
                        <p>
                          আমরা জানি, সেলসিয়াস ও ফারেনহাইট স্কেলের সম্পর্ক:
                          <RenderMathText text="$$\frac{C}{5} = \frac{F - 32}{9} \implies F = \frac{9}{5}C + 32$$" />
                        </p>
                        <p><RenderMathText text="এখানে বায়ুর তাপমাত্রা $C = 30^\circ\text{C}$।" /></p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$F = \frac{9}{5} \times 30 + 32 = 54 + 32 = 86^\circ\text{F} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>

                    {/* Subquestion D */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-rose-300 flex justify-between">
                        <span>(ঘ) তারটি ছিঁড়ে যাবার কারণ গাণিতিক যুক্তিসহ ব্যাখ্যা করো। [৪ নম্বর]</span>
                        <span className="text-[11px] text-slate-500 font-mono">উচ্চতর দক্ষতা</span>
                      </div>
                      <div className="text-slate-300 space-y-2 leading-relaxed">
                        <div className="space-y-1">
                          <strong>দেওয়া আছে:</strong>
                          <br />
                          <RenderMathText text="আদি দৈর্ঘ্য $L_1 = 30.001\text{ m}$, তাপমাত্রা পার্থক্য $\Delta T = 30^\circ\text{C} - 4^\circ\text{C} = 26\text{ K}$" />
                          <br />
                          <RenderMathText text="তামার দৈর্ঘ্য প্রসারণ সহগ $\alpha = 16.7 \times 10^{-6}\text{ K}^{-1}$" />
                        </div>
                        <p>
                          তাপমাত্রা হ্রাসের ফলে তামার তারটির সংকোচন ($\Delta L$):
                          <RenderMathText text="$$\Delta L = \alpha L_1 \Delta T = 16.7 \times 10^{-6} \times 30.001 \times 26 = 0.01302\text{ m}$$" />
                        </p>
                        <p>
                          <RenderMathText text="অতএব, $4^\circ\text{C}$ তাপমাত্রায় তারটির চূড়ান্ত দৈর্ঘ্য ($L_2$):" />
                          <RenderMathText text="$$L_2 = L_1 - \Delta L = 30.001 - 0.01302 = 29.988\text{ m}$$" />
                        </p>
                        <div className="bg-rose-950/40 border border-rose-600/40 p-3 rounded-lg text-rose-200">
                          <strong>সিদ্ধান্ত:</strong> <RenderMathText text="দুটি খুঁটির মধ্যবর্তী অনমনীয় দূরত্ব $30\text{ m}$, অথচ শীতকালে তারটির সংকুচিত দৈর্ঘ্য হয়ে দাঁড়ায় $29.988\text{ m} (< 30\text{ m})$। খুঁটি দুটির দূরত্বের চেয়ে তারটির দৈর্ঘ্য কম হওয়ায় তারে প্রচণ্ড টানের (Tension) সৃষ্টি হয়। এই অসহ্য টানের বল সহ্য করতে না পেরে তারটি ছিঁড়ে গিয়েছিল।" />
                        </div>
                      </div>
                    </div>

                    {/* Examiner Marking Rubric Drawer */}
                    <div className="border border-amber-500/30 rounded-xl bg-amber-950/10 p-3">
                      <button
                        onClick={() => toggleRubric(1)}
                        className="w-full flex items-center justify-between text-amber-300 font-semibold text-xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-400" />
                          পরীক্ষকের গোপন কথা (Examiner Marking Rubric)
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedRubric.includes(1) ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {expandedRubric.includes(1) && (
                        <div className="mt-3 pt-3 border-t border-amber-500/20 text-slate-300 space-y-2 text-[11px]">
                          <div className="font-semibold text-amber-300">নম্বর বিভাজন কাঠামো:</div>
                          <ul className="list-disc list-inside space-y-1 text-slate-400">
                            <li><RenderMathText text="(গ) সূত্র $F = \frac{9}{5}C + 32$ লেখার জন্য ১ নম্বর।" /></li>
                            <li><RenderMathText text="(গ) মান বসিয়ে সঠিক একক সহ $86^\circ\text{F}$ বের করার জন্য ২ নম্বর।" /></li>
                            <li><RenderMathText text="(ঘ) সংকোচন সূত্র $\Delta L = \alpha L_1 \Delta T$ ও সঠিক গণনার জন্য ২ নম্বর।" /></li>
                            <li><RenderMathText text="(ঘ) সংকুচিত দৈর্ঘ্য $29.988\text{ m} < 30\text{ m}$ তুলনা ও টান বলের যৌক্তিক সিদ্ধান্তের জন্য ২ নম্বর।" /></li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 2: Textbook CQ 2 - Metal Rod Expansion & Material Identification */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                      পাঠ্যবই সৃজনশীল ০২ (পৃষ্ঠা ১৮৫)
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      দুটি ধাতব দণ্ডের দৈর্ঘ্য প্রসারণ ও উপাদান শনাক্তকরণ
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(2)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(2) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> <RenderMathText text="দুটি ধাতব দণ্ডের দৈর্ঘ্য $6\text{ m}$। একটির তাপমাত্রা $30^\circ\text{C}$ থেকে বাড়িয়ে $80^\circ\text{C}$ করা হলে দৈর্ঘ্য বৃদ্ধি পেয়ে $6.0051\text{ m}$ হয়। অপর দণ্ডের তাপমাত্রা $20^\circ\text{C}$ থেকে বাড়িয়ে $60^\circ\text{C}$ করা হলে দৈর্ঘ্য বৃদ্ধি পেয়ে $6.0041\text{ m}$ হয়।" />
                </div>

                {expandedCQ.includes(2) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-rose-300">
                        <RenderMathText text="(গ) একটি ধাতবদণ্ডের তাপমাত্রা $80^\circ\text{C}$ হলে সেটি কেলভিন স্কেলে কত? [৩ নম্বর]" />
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-1">
                        <p>আমরা জানি, কেলভিন স্কেলে তাপমাত্রা $T_K = T_C + 273.15$</p>
                        <div className="font-mono text-emerald-400">
                          <RenderMathText text="$$T_K = 80 + 273.15 = 353.15\text{ K} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-rose-300">
                        (ঘ) গাণিতিক ব্যাখ্যাসহ দণ্ড দুটির উপাদান সম্পর্কে মন্তব্য করো। [৪ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>
                          ১ম দণ্ডের ক্ষেত্রে:
                          <br />
                          <RenderMathText text="$L_1 = 6\text{ m}, \quad \Delta L_1 = 6.0051 - 6 = 0.0051\text{ m}, \quad \Delta T_1 = 80 - 30 = 50\text{ K}$" />
                          <RenderMathText text="$$\alpha_1 = \frac{\Delta L_1}{L_1 \Delta T_1} = \frac{0.0051}{6 \times 50} = 1.7 \times 10^{-5}\text{ K}^{-1} = 17 \times 10^{-6}\text{ K}^{-1}$$" />
                        </p>
                        <p>
                          ২য় দণ্ডের ক্ষেত্রে:
                          <br />
                          <RenderMathText text="$L_1 = 6\text{ m}, \quad \Delta L_2 = 6.0041 - 6 = 0.0041\text{ m}, \quad \Delta T_2 = 60 - 20 = 40\text{ K}$" />
                          <RenderMathText text="$$\alpha_2 = \frac{\Delta L_2}{L_1 \Delta T_2} = \frac{0.0041}{6 \times 40} = 1.708 \times 10^{-5}\text{ K}^{-1} \approx 17.1 \times 10^{-6}\text{ K}^{-1}$$" />
                        </p>
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-200">
                          <strong>উপাদান মূল্যায়ন:</strong> <RenderMathText text="উভয় দণ্ডের দৈর্ঘ্য প্রসারণ সহগের মান প্রায় সমান ($\approx 17 \times 10^{-6}\text{ K}^{-1}$)। পাঠ্যবইয়ের তালিকা অনুযায়ী এই মান তামার (Copper) প্রসারণ সহগের হুবহু অনুরূপ। সুতরাং, উভয় দণ্ডই তামার তৈরি!" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 3: Dhaka Board - Calorimetry & Equilibrium Mixture */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                      ঢাকা বোর্ড সৃজনশীল
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      উত্তপ্ত তামার গোলক ও ক্যালোরিমিতির মিশ্রণে তাপের সংরক্ষণশীলতা
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(3)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(3) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> <RenderMathText text="$120^\circ\text{C}$ তাপমাত্রায় উত্তপ্ত $0.2\text{ kg}$ ভরের একটি তামার গোলক ($s = 400\text{ J/(kg}\cdot\text{K)}$) একটি পাত্রে থাকা $20^\circ\text{C}$ তাপমাত্রার $0.5\text{ kg}$ পানিতে ছেড়ে দেওয়া হলো।" />
                </div>

                {expandedCQ.includes(3) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-rose-300">
                        (গ) মিশ্রণের চূড়ান্ত তাপমাত্রা নির্ণয় করো। [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>ধরি মিশ্রণের চূড়ান্ত সাম্যাবস্থার তাপমাত্রা $T$।</p>
                        <p>তামা কর্তৃক বর্জিত তাপ: $Q_1 = m_1 s_1 (120 - T) = 0.2 \times 400 \times (120 - T) = 80(120 - T)$</p>
                        <p>পানি কর্তৃক গৃহীত তাপ: $Q_2 = m_2 s_2 (T - 20) = 0.5 \times 4200 \times (T - 20) = 2100(T - 20)$</p>
                        <p>ক্যালোরিমিতির মূলনীতি অনুসারে, $Q_1 = Q_2$:</p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$80(120 - T) = 2100(T - 20) \implies 9600 - 80T = 2100T - 42000$$" />
                          <RenderMathText text="$$2180T = 51600 \implies T = \frac{51600}{2180} = 23.67^\circ\text{C} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 4: Rajshahi Board - Ice Melting & Latent Heat */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                      রাজশাহী বোর্ড সৃজনশীল
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      বরফ গলনের সুপ্ততাপ ও সমস্ত বরফ গলার সম্ভাব্যতা বিশ্লেষণ
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(4)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(4) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> <RenderMathText text="$0^\circ\text{C}$ তাপমাত্রার $50\text{ g}$ বরফ ($L_f = 3.36 \times 10^5\text{ J/kg}$) একটি পাত্রে রাখা $40^\circ\text{C}$ তাপমাত্রার $200\text{ g}$ পানিতে ছেড়ে দেওয়া হলো।" />
                </div>

                {expandedCQ.includes(4) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-rose-300">
                        (ঘ) উদ্দীপকের পাত্রে থাকা সমস্ত বরফ কি গলে যাবে? গাণিতিকভাবে বিশ্লেষণ করো। [৪ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>
                          <strong>বরফ সম্পূর্ণ গলতে প্রয়োজনীয় তাপ:</strong>
                          <RenderMathText text="$$Q_{\text{melt}} = m_1 L_f = 0.05 \times 3.36 \times 10^5 = 16,800\text{ J}$$" />
                        </p>
                        <p>
                          <strong><RenderMathText text="পানি $40^\circ\text{C}$ থেকে $0^\circ\text{C}$-এ নেমে আসলে সর্বোচ্চ তাপ বর্জন করতে পারে:" /></strong>
                          <RenderMathText text="$$Q_{\text{water}} = m_2 s \Delta \theta = 0.2 \times 4200 \times (40 - 0) = 33,600\text{ J}$$" />
                        </p>
                        <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-lg text-emerald-200">
                          <RenderMathText text="যেহেতু $Q_{\text{water}} (33,600\text{ J}) > Q_{\text{melt}} (16,800\text{ J})$, তাই পানি কর্তৃক সরবরাহকৃত তাপ বরফকে সম্পূর্ণ গলানোর জন্য যথেষ্টের চেয়েও বেশি। সুতরাং সমস্ত বরফ সম্পূর্ণরূপে গলে যাবে এবং পানির অবশিষ্ট তাপে চূড়ান্ত তাপমাত্রা $0^\circ\text{C}$-এর ওপরে থাকবে!" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 3: TRY YOURSELF (3 INTERACTIVE CALCULATION CHALLENGES)      */}
          {/* =============================================================== */}
          {activeStep === 'try' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs mb-1">
                  <Sliders className="w-4 h-4" />
                  <span>ইন্টারেক্টিভ গাণিতিক চ্যালেঞ্জ (Instant Validation)</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">নিজে করো: ৩টি সরাসরি হিসাব চ্যালেঞ্জ</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  পরীক্ষার হলে দ্রুত ও নির্ভুল হিসাব নিশ্চিত করতে ক্যালকুলেটর নিয়ে নিচের সমস্যাগুলোর সমাধান করো।
                </p>
              </div>

              {/* Challenge 1 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400">চ্যালেঞ্জ ০১: স্কেল রূপান্তর</span>
                  <span className="text-slate-500">বোর্ড স্ট্যান্ডার্ড</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  একজন শিক্ষার্থীর শরীরের তাপমাত্রা থার্মোমিটারে পরিমাপ করা হলো <strong>৩৮.৫°C</strong>। ফারেনহাইট স্কেলে তার এই তাপমাত্রা কত <strong>(°F)</strong> হবে?
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="উদা: 101.3"
                    value={challenge1Input}
                    onChange={(e) => setChallenge1Input(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={handleVerifyChallenge1}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    যাচাই করো
                  </button>
                </div>
                {challenge1Status === 'correct' && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                    <RenderMathText text="🎉 একদম সঠিক উত্তর! $F = \frac{9}{5} \times 38.5 + 32 = 69.3 + 32 = 101.3^\circ\text{F}$।" />
                  </div>
                )}
                {challenge1Status === 'wrong' && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                    <RenderMathText text="❌ সঠিক হয়নি। ক্লু: $F = 1.8 \times C + 32$ সূত্রটি ব্যবহার করো।" />
                  </div>
                )}
              </div>

              {/* Challenge 2 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400">চ্যালেঞ্জ ০২: তামার তারের প্রসারণ</span>
                  <span className="text-slate-500">বোর্ড সৃজনশীল (গ)</span>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed">
                  <RenderMathText text="৫০ মিটার দীর্ঘ একটি তামার তারের তাপমাত্রা ২০°C থেকে বৃদ্ধি পেয়ে ৭০°C হলো। তামার দৈর্ঘ্য প্রসারণ সহগ $\alpha = 16.7 \times 10^{-6}\text{ K}^{-1}$ হলে তারটির দৈর্ঘ্য বৃদ্ধি $\Delta L$ কত সেন্টিমিটার (cm)?" />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="উদা: 4.18"
                    value={challenge2Input}
                    onChange={(e) => setChallenge2Input(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={handleVerifyChallenge2}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    যাচাই করো
                  </button>
                </div>
                {challenge2Status === 'correct' && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                    <RenderMathText text="🎉 নিখুঁত গণনা! $\Delta L = 50 \times 16.7 \times 10^{-6} \times 50 = 0.04175\text{ m} \approx 4.18\text{ cm}$।" />
                  </div>
                )}
                {challenge2Status === 'wrong' && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                    ❌ সঠিক হয়নি। ক্লু: উত্তরে সেন্টিমিটারে (cm) চাওয়া হয়েছে, তাই মিটারে বের করে ১০০ দিয়ে গুণ করতে হবে।
                  </div>
                )}
              </div>

              {/* Challenge 3 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400">চ্যালেঞ্জ ০৩: ক্যালোরিমিতির মিশ্রণ</span>
                  <span className="text-slate-500">বোর্ড সৃজনশীল (ঘ)</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  ৮০°C তাপমাত্রার ১ কেজি গরম পানির সাথে ২০°C তাপমাত্রার ২ কেজি ঠান্ডা পানি মেশানো হলে মিশ্রণের চূড়ান্ত তাপমাত্রা কত <strong>(°C)</strong> হবে? (কোনো তাপ অপচয় বিবেচনা না করে)
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="1"
                    placeholder="উদা: 40"
                    value={challenge3Input}
                    onChange={(e) => setChallenge3Input(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={handleVerifyChallenge3}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    যাচাই করো
                  </button>
                </div>
                {challenge3Status === 'correct' && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                    <RenderMathText text="🎉 অভিনন্দন! $T = \frac{1 \times 80 + 2 \times 20}{1 + 2} = \frac{120}{3} = 40^\circ\text{C}$।" />
                  </div>
                )}
                {challenge3Status === 'wrong' && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                    <RenderMathText text="❌ সঠিক হয়নি। ক্লু: $m_1 s (80 - T) = m_2 s (T - 20) \implies (80 - T) = 2(T - 20)$ সমীকরণটি সমাধান করো।" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 4: CHECK UNDERSTANDING (5 BOARD STANDARD MCQS)              */}
          {/* =============================================================== */}
          {activeStep === 'quiz' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs mb-1">
                  <Award className="w-4 h-4" />
                  <span>বোর্ড স্ট্যান্ডার্ড বহুনির্বাচনি কুইজ (MCQ Assessment)</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">৫টি অত্যাবশ্যকীয় বোর্ড MCQ যাচাই</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  বিগত ৫ বছরের বোর্ড পরীক্ষায় সবচেয়ে বেশি আসা ৫টি বহুনির্বাচনি প্রশ্ন। প্রতিটি অপশন যাচাই করে সাবমিট করো।
                </p>
              </div>

              <div className="space-y-4">
                {MCQ_DATA.map((mcq, idx) => {
                  const isCorrect = selectedMCQAnswers[idx] === mcq.correctIndex;

                  return (
                    <div key={mcq.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3 text-sm font-medium text-white">
                        <span>
                          {idx + 1}. {mcq.question}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {mcq.options.map((opt, optIdx) => {
                          const checked = selectedMCQAnswers[idx] === optIdx;
                          let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800';

                          if (checked && !submittedMCQ) {
                            btnStyle = 'bg-rose-600/20 border-rose-500 text-rose-200 font-semibold';
                          }

                          if (submittedMCQ) {
                            if (optIdx === mcq.correctIndex) {
                              btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                            } else if (checked && !isCorrect) {
                              btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectMCQ(idx, optIdx)}
                              className={`p-3 rounded-xl border text-left transition-all ${btnStyle}`}
                            >
                              <RenderMathText text={opt} />
                            </button>
                          );
                        })}
                      </div>

                      {submittedMCQ && (
                        <div
                          className={`p-3 rounded-xl text-xs border ${
                            isCorrect
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <strong>{isCorrect ? '✅ সঠিক হয়েছে!' : '❌ ভুল হয়েছে!'}</strong> ব্যাখ্যা:{' '}
                          <RenderMathText text={mcq.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-2">
                {!submittedMCQ ? (
                  <button
                    onClick={() => setSubmittedMCQ(true)}
                    className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/60 transition-all"
                  >
                    ফলাফল ও ব্যাখ্যা দেখুন
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSubmittedMCQ(false);
                      setSelectedMCQAnswers({});
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 5: SUMMARY & FORMULA CHEAT SHEET                            */}
          {/* =============================================================== */}
          {activeStep === 'summary' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-mono text-xs mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>অধ্যায় সারসংক্ষেপ ও সূত্র ভাণ্ডার</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    অধ্যায় ০৬: বস্তুর ওপর তাপের প্রভাব — একনজরে রিভিশন
                  </h2>
                  <p className="text-xs text-slate-400">পরীক্ষার আগের রাতের জন্য দ্রুত রিভিশন নোট ও শীর্ষ ফাঁদসমূহ।</p>
                </div>
                <button
                  onClick={handleCopyNotes}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
                >
                  {copiedNote ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-rose-400" />
                      <span>নোট কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              {/* Complete Formula Table */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-rose-400 border-b border-slate-800 pb-2">
                  ১. মূল গাণিতিক সমীকরণসমূহ (Formula Bank)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-semibold text-amber-400">তাপমাত্রা স্কেল ও রূপান্তর:</div>
                    <div className="font-mono text-slate-200">
                      <RenderMathText text="$\frac{C}{5} = \frac{F - 32}{9} = \frac{K - 273.15}{5}$" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      • -৪০°-এ সেলসিয়াস ও ফারেনহাইট স্কেল সমান।
                      <br />• সেলসিয়াস ও কেলভিন স্কেল কখনোই সমান হতে পারে না!
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-semibold text-cyan-400">কঠিনের তাপীয় প্রসারণ সহগ:</div>
                    <div className="font-mono text-slate-200">
                      <RenderMathText text="$\Delta L = \alpha L_1 \Delta T, \quad \beta = 2\alpha, \quad \gamma = 3\alpha$" />
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <RenderMathText text="• একক: $\text{K}^{-1}$ বা $^\circ\text{C}^{-1}$।" />
                      <div>• মাত্রা: [Θ⁻¹]।</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-semibold text-rose-400">ক্যালোরিমিতি ও তাপ ধারণক্ষমতা:</div>
                    <div className="font-mono text-slate-200">
                      <RenderMathText text="$Q = ms\Delta\theta, \quad C = ms = \frac{Q}{\Delta T}$" />
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <RenderMathText text="• পানির আপেক্ষিক তাপ $s = 4200\text{ J/(kg}\cdot\text{K)}$।" />
                      <RenderMathText text="• ক্যালোরিমিতির মূলনীতি: $Q_{\text{lost}} = Q_{\text{gained}}$।" />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="font-semibold text-emerald-400">সুপ্ততাপ ও অবস্থার পরিবর্তন:</div>
                    <div className="font-mono text-slate-200">
                      <RenderMathText text="$Q_{\text{fusion}} = mL_f, \quad Q_{\text{vap}} = mL_v$" />
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <RenderMathText text="• বরফ গলনের সুপ্ততাপ $L_f = 3.36 \times 10^5\text{ J/kg}$।" />
                      <RenderMathText text="• বাষ্পীভবনের সুপ্ততাপ $L_v = 2.26 \times 10^6\text{ J/kg}$।" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top 4 Board Traps */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  ২. বোর্ড পরীক্ষার শীর্ষ ৪টি মারাত্মক ফাঁদ (Examiner Traps)
                </h3>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-rose-400 block mb-1">ফাঁদ ০১: তাপমাত্রা পার্থক্য (ΔT)-তে ২৭৩ যোগের ভুল!</strong>
                    <RenderMathText text="তাপমাত্রার পার্থক্য $\Delta T = 50^\circ\text{C}$ হলে কেলভিনেও এর মান হুবহু 50 K হবে ($\Delta T = 50\text{ K}$)। অনেকেই ভুল করে পার্থক্যের সাথে ২৭৩ যোগ করে ফেলে, যা মারাত্মক ভুল!" />
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-rose-400 block mb-1">ফাঁদ ০২: ক্ষেত্রফল ও আয়তন সহগে α-র সম্পর্ক!</strong>
                    <RenderMathText text="প্রশ্নে যদি $\beta$ চাওয়া হয় কিন্তু উদ্দীপকে $\alpha$ দেওয়া থাকে, তবে সরাসরি $\beta = 2\alpha$ এবং আয়তন প্রসারণে $\gamma = 3\alpha$ ব্যবহার করতে হবে।" />
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-rose-400 block mb-1">ফাঁদ ০৩: বরফ গলনে সুপ্ততাপ ভুলে যাওয়া!</strong>
                    <RenderMathText text="$0^\circ\text{C}$-এর বরফকে গরম পানিতে মেশালে বরফ সরাসরি তাপমাত্রা বাড়াতে পারে না; আগে $Q = mL_f$ তাপ নিয়ে $0^\circ\text{C}$-এর পানিতে পরিণত হতে হবে, তারপর তাপমাত্রা $0^\circ\text{C}$ থেকে বৃদ্ধি পাবে!" />
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-rose-400 block mb-1">ফাঁদ ০৪: একক রূপান্তরে অসাবধানতা!</strong>
                    <RenderMathText text="দূরত্ব বা প্রসারণ সেন্টিমিটারে ($\text{cm}$) থাকলে অবশ্যই মিটারে ($\text{m}$) এবং ভর গ্রামে ($\text{g}$) থাকলে কিলোগ্রামে ($\text{kg}$) রূপান্তর করে তবেই সমীকরণে মান বসাবে।" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SOCRATIC AI PHYSICS TUTOR DRAWER                                    */}
      {/* ------------------------------------------------------------------- */}
      {aiTutorOpen && (
        <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-semibold text-white">সক্রেটিক এআই পদার্থবিজ্ঞান টিউটর</span>
            </div>
            <button
              onClick={() => setAiTutorOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex flex-wrap gap-1.5 text-[11px]">
            <button
              onClick={() => setUserQuestion('রেললাইনে ফাঁক কেন রাখা হয়?')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              রেললাইনে ফাঁক কেন থাকে?
            </button>
            <button
              onClick={() => setUserQuestion('পানির ব্যতিক্রমী প্রসারণ কীভাবে মাছ বাঁচায়?')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              পানির ব্যতিক্রমী প্রসারণ কী?
            </button>
            <button
              onClick={() => setUserQuestion('প্রেশার কুকারে রান্না দ্রুত হয় কেন?')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              প্রেশার কুকারের নীতি কী?
            </button>
          </div>

          <div className="p-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="যেকোনো তাপীয় সমস্যা বা প্রশ্ন লেখো..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={handleSendAiMessage}
              className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
