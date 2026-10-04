'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Flame,
  Droplets,
  Wind,
  Sparkles,
  Thermometer,
  ShieldCheck,
  Zap,
  Activity,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  AlertCircle,
  Copy,
  Send,
  Sliders,
  ChevronDown,
  ChevronRight,
  Eye,
  Info,
  HelpCircle,
  Trophy,
  Bookmark,
  Lightbulb,
  Check,
  X,
  Layers,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Sublimation Substances in NCTB Chapter 2
interface SublimationSubstance {
  id: string;
  nameBn: string;
  nameEn: string;
  formula: string;
  formulaLatex: string;
  usesBn: string;
  usesEn: string;
  color: string;
  vaporColor: string;
}

const SUBLIMATION_SUBSTANCES: SublimationSubstance[] = [
  {
    id: 'naphthalene',
    nameBn: 'ন্যাপথালিন',
    nameEn: 'Naphthalene',
    formula: 'C10H8',
    formulaLatex: '\\text{C}_{10}\\text{H}_8',
    usesBn: 'পোকা-মাকড় ও কীট প্রতিরোধে কাপড়ের আলমারিতে ব্যবহৃত হয়; স্বাভাবিক তাপমাত্রাতেই ধীরে ধীরে উবে যায়।',
    usesEn: 'Moth repellent in clothes wardrobes; sublimes slowly even at room temperature.',
    color: '#e2e8f0',
    vaporColor: 'rgba(241, 245, 249, 0.6)',
  },
  {
    id: 'camphor',
    nameBn: 'কর্পূর',
    nameEn: 'Camphor',
    formula: 'C10H16O',
    formulaLatex: '\\text{C}_{10}\\text{H}_{16}\\text{O}',
    usesBn: 'সুগন্ধি ও ওষুধশিল্পে বহুল ব্যবহৃত উদ্বায়ী সুগন্ধযুক্ত জৈব যৌগ।',
    usesEn: 'Volatile aromatic compound prized in medicinal ointments and fragrances.',
    color: '#f8fafc',
    vaporColor: 'rgba(248, 250, 252, 0.7)',
  },
  {
    id: 'ammonium_chloride',
    nameBn: 'নিশাদল (অ্যামোনিয়াম ক্লোরাইড)',
    nameEn: 'Ammonium Chloride (Sal Ammoniac)',
    formula: 'NH4Cl',
    formulaLatex: '\\text{NH}_4\\text{Cl}',
    usesBn: 'শুষ্ক কোষে (Dry Cell) তড়িৎ বিশ্লেষ্য এবং ধাতব ঝালাইয়ের কাজে ব্যবহৃত হয়; তাপ দিলে সরাসরি সাদা বাষ্প হয়।',
    usesEn: 'Electrolyte in dry cells and soldering flux; thermal dissociation produces white dense vapor.',
    color: '#cbd5e1',
    vaporColor: 'rgba(203, 213, 225, 0.8)',
  },
  {
    id: 'iodine',
    nameBn: 'আয়োডিন',
    nameEn: 'Iodine Crystals',
    formula: 'I2',
    formulaLatex: '\\text{I}_2',
    usesBn: 'গাঢ় বেগুনি বর্ণের কঠিন ক্রিস্টাল; সামান্য উত্তাপেই রক্তিম-বেগুনি আকর্ষণীয় বাষ্পে পরিণত হয়।',
    usesEn: 'Deep violet lustrous solid crystal; sublimes into magnificent purple vapor upon gentle heating.',
    color: '#581c87',
    vaporColor: 'rgba(168, 85, 247, 0.7)',
  },
  {
    id: 'dry_ice',
    nameBn: 'ড্রাই আইস (কঠিন CO₂)',
    nameEn: 'Dry Ice (Solid CO₂)',
    formula: 'CO2 (solid)',
    formulaLatex: '\\text{CO}_2\\,(s)',
    usesBn: 'হিমায়িত খাদ্য সংরক্ষণ ও মঞ্চের ধোঁয়ার কৃত্রিম ইফেক্টে ব্যবহৃত হয় (-৭৮.৫°C এ সরাসরি গ্যাস হয়)।',
    usesEn: 'Frozen food preservation and stage fog; sublimes directly at -78.5°C without wetting.',
    color: '#93c5fd',
    vaporColor: 'rgba(147, 197, 253, 0.7)',
  },
  {
    id: 'aluminum_chloride',
    nameBn: 'অ্যালুমিনিয়াম ক্লোরাইড',
    nameEn: 'Aluminum Chloride',
    formula: 'AlCl3',
    formulaLatex: '\\text{AlCl}_3',
    usesBn: 'জৈব সংশ্লেষণে লুইস এসিড অনুঘটক হিসেবে ব্যবহৃত উদ্বায়ী অজৈব লবণ।',
    usesEn: 'Lewis acid catalyst in organic synthesis; undergoes sublime vaporization upon heating.',
    color: '#fef08a',
    vaporColor: 'rgba(254, 240, 138, 0.6)',
  },
];

// Authentic Board MCQs for Chapter 2
interface BoardMcq {
  id: number;
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
  boardSource: string;
}

const CHEMISTRY_CH2_BOARD_MCQS: BoardMcq[] = [
  {
    id: 1,
    questionBn: 'নিচের কোন গ্যাসটির ব্যাপনের হার সবচেয়ে বেশি?',
    questionEn: 'Which of the following gases possesses the highest rate of diffusion?',
    optionsBn: ['CO₂ (কার্বন ডাই-অক্সাইড)', 'NH₃ (অ্যামোনিয়া)', 'HCl (হাইড্রোজেন ক্লোরাইড)', 'SO₂ (সালফার ডাই-অক্সাইড)'],
    optionsEn: ['CO₂ (Carbon Dioxide)', 'NH₃ (Ammonia)', 'HCl (Hydrogen Chloride)', 'SO₂ (Sulfur Dioxide)'],
    correctIndex: 1,
    explanationBn:
      'গ্রাহামের ব্যাপন সূত্রানুসারে, যে গ্যাসের আণবিক ভর যত কম তার ব্যাপন হার তত বেশি। এখানে: NH₃ = ১৭, CO₂ = ৪৪, HCl = ৩৬.৫ এবং SO₂ = ৬৪। যেহেতু NH₃ এর আণবিক ভর সর্বনিম্ন (১৭), তাই এর ব্যাপন হার সবচেয়ে বেশি।',
    explanationEn:
      'According to Graham’s Law, diffusion rate is inversely proportional to square root of molecular mass. Masses: NH₃=17, HCl=36.5, CO₂=44, SO₂=64. Having the lowest molecular weight (17), NH₃ diffuses fastest.',
    boardSource: 'ঢাকা বোর্ড ২০২০ / রাজশাহী বোর্ড ২০২৩',
  },
  {
    id: 2,
    questionBn: 'কাচনলের ভেতরে NH₃ ও HCl গ্যাস ব্যাপিত হলে কোন মুখের কাছাকাছি সাদা ধোঁয়ার বলয় সৃষ্টি হবে?',
    questionEn: 'When NH₃ and HCl diffuse in a glass tube, near which end will the dense white ring appear?',
    optionsBn: [
      'NH₃ মুখের কাছাকাছি',
      'HCl মুখের কাছাকাছি',
      'কাচনলের ঠিক মধ্যবিন্দুতে',
      'কাচনলের বাইরের বায়ুমণ্ডলে',
    ],
    optionsEn: [
      'Closer to the NH₃ end',
      'Closer to the HCl end',
      'Exactly at the midpoint',
      'Outside the glass tube',
    ],
    correctIndex: 1,
    explanationBn:
      'NH₃ (ভর ১৭) হালকা হওয়ায় দ্রুত পথ অতিক্রম করে (প্রায় ৬০%), আর HCl (ভর ৩৬.৫) ভারী হওয়ায় ধীরে চলে (প্রায় ৪০%)। ফলে তুলনামূলক ভারী HCl গ্যাসের মুখের কাছাকাছি স্থানে কঠিন NH₄Cl এর ঘন সাদা বলয় উৎপন্ন হয়।',
    explanationEn:
      'Lighter NH₃ (mass 17) travels faster (~60% of tube length) than heavier HCl (mass 36.5, ~40%). Consequently, the white NH₄Cl salt ring precipitates significantly closer to the slower HCl cotton plug.',
    boardSource: 'যশোর বোর্ড ২০১৯ / চট্টগ্রাম বোর্ড ২০২২',
  },
  {
    id: 3,
    questionBn: 'রান্নার এলপিজি গ্যাস সিলিন্ডারের মুখ খুলে দিলে ব্যাপন ও নিঃসরণের মধ্যে কোনটি আগে ঘটে?',
    questionEn: 'When opening a cooking LPG gas cylinder valve, which occurs first between effusion and diffusion?',
    optionsBn: [
      'ব্যাপন আগে ঘটে, পরে নিঃসরণ',
      'নিঃসরণ আগে ঘটে, পরে চারদিকে ব্যাপন',
      'উভয়ই একযোগে শুরু ও শেষ হয়',
      'শুধু ব্যাপন ঘটে, কোনো নিঃসরণ ঘটে না',
    ],
    optionsEn: [
      'Diffusion occurs first, then effusion',
      'Effusion occurs first, then widespread diffusion',
      'Both happen strictly simultaneously',
      'Only diffusion takes place without effusion',
    ],
    correctIndex: 1,
    explanationBn:
      'সিলিন্ডারের ভেতরে গ্যাস অত্যন্ত উচ্চচাপে সংকুচিত থাকে। মুখ খুললে সরু ছিদ্রপথে উচ্চচাপ থেকে নিম্নচাপে সজোরে গ্যাস বেরিয়ে আসে—যা নিঃসরণ (Effusion)। এরপর বায়ুমণ্ডলে গ্যাসটি স্বতঃস্ফূর্তভাবে সবদিকে সমভাবে ছড়িয়ে পড়ে—যা ব্যাপন (Diffusion)।',
    explanationEn:
      'Gas inside pressurized cylinders is stored under intense pressure. Opening the nozzle forces gas out through the narrow aperture via effusion; once in open air, it disperses spontaneously via diffusion.',
    boardSource: 'কুমিল্লা বোর্ড ২০২১ / দিনাজপুর বোর্ড ২০২৩',
  },
  {
    id: 4,
    questionBn: 'বরফের তাপ প্রদানের লেখচিত্রে (Heating Curve) ০°C তাপমাত্রার অনুভূমিক সমান্তরাল অংশটি কী নির্দেশ করে?',
    questionEn: 'In the heating curve of ice, what does the horizontal flat plateau at 0°C represent?',
    optionsBn: [
      'বরফের তাপগ্রাহিতা হ্রাস',
      'গলনের সুপ্ততাপ ও বরফ-পানির সহাবস্থান',
      'পানির স্ফুটনাঙ্ক',
      'সম্পূর্ণ বাষ্পীভবন',
    ],
    optionsEn: [
      'Decrease of ice heat capacity',
      'Latent heat of fusion & solid-liquid coexistence',
      'Boiling point of water',
      'Total vaporization',
    ],
    correctIndex: 1,
    explanationBn:
      '০°C তাপমাত্রায় প্রদেয় তাপ কণার তাপমাত্রা বৃদ্ধি না করে কঠিন বরফের আন্তঃকণা বন্ধন ভেঙে তরলে রূপান্তরে ব্যবহৃত হয় (গলনের সুপ্ততাপ)। এই সময় পুরো বরফ না গলা পর্যন্ত তাপমাত্রা ০°C-এ স্থির থাকে এবং বরফ ও তরল পানি একসাথে বিরাজ করে।',
    explanationEn:
      'At 0°C, input energy acts as latent heat of fusion breaking crystalline intermolecular bonds rather than raising temperature. Solid ice and liquid water coexist in equilibrium at constant 0°C.',
    boardSource: 'সিলেট বোর্ড ২০২০ / ময়মনসিংহ বোর্ড ২০২২',
  },
  {
    id: 5,
    questionBn: 'নিচের কোনটি ঊর্ধ্বপাতিত বা উদ্বায়ী (Subliming) পদার্থ নয়?',
    questionEn: 'Which of the following is NOT a subliming substance?',
    optionsBn: ['ন্যাপথালিন (C₁₀H₈)', 'আয়োডিন (I₂)', 'সোডিয়াম ক্লোরাইড (খাবার লবণ - NaCl)', 'কপূর (C₁₀H₁₆O)'],
    optionsEn: ['Naphthalene (C₁₀H₈)', 'Iodine (I₂)', 'Sodium Chloride (Table Salt - NaCl)', 'Camphor (C₁₀H₁₆O)'],
    correctIndex: 2,
    explanationBn:
      'খাবার লবণ (NaCl) একটি তীব্র আয়নিক যৌগ যার গলনাঙ্ক প্রায় ৮০১°C। তাপ দিলে এটি গলে তরল হয়, কিন্তু ঊর্ধ্বপাতিত হয় না। পক্ষান্তরে ন্যাপথালিন, কর্পূর, নিশাদল, আয়োডিন ও কঠিন CO₂ সরাসরি বাষ্পে পরিণত হয়।',
    explanationEn:
      'Sodium chloride (NaCl) is a rigid ionic crystal with a melting point of 801°C that melts into liquid before boiling. Naphthalene, camphor, ammonium chloride, and iodine sublime directly from solid to gas.',
    boardSource: 'সকল বোর্ড সমন্বিত প্রশ্নব্যাংক',
  },
];

export function StatesOfMatterGuidebook() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Navigation State
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);

  // AI Chat Drawer State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: isBn
        ? 'স্বাগতম পদার্থের অবস্থা ল্যাবে! আমি তোমার AI শিক্ষক। কঠিন-তরল-গ্যাসের কণার গতিতত্ত্ব, NH₃ ও HCl এর ব্যাপন কাচনল, বরফের তাপীয় বক্ররেখা কিংবা ঊর্ধ্বপাতন নিয়ে যেকোনো প্রশ্ন করতে পারো!'
        : 'Welcome to the States of Matter Lab! I am your AI Chemistry Tutor. Ask me anything about particle kinetic theory, NH₃ vs HCl diffusion tube, ice heating curves, or sublimation!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // SIMULATOR 1: Kinetic Theory Particle Chamber State
  const [particleTemperature, setParticleTemperature] = useState<number>(25); // -20°C to 130°C
  const [isParticleAnimActive, setIsParticleAnimActive] = useState<boolean>(true);

  // SIMULATOR 2: Glass Tube Diffusion State (NH3 vs HCl)
  const [diffusionProgress, setDiffusionProgress] = useState<number>(0); // 0 to 100
  const [isDiffusing, setIsDiffusing] = useState<boolean>(false);
  const [selectedGasPair, setSelectedGasPair] = useState<'nh3_hcl' | 'ch4_so2'>('nh3_hcl');

  // SIMULATOR 3: Heating Curve Interactive Graph State
  const [heatingTimeMinutes, setHeatingTimeMinutes] = useState<number>(10); // 0 to 30 mins

  // SIMULATOR 4: Sublimation Chamber State
  const [selectedSubstanceId, setSelectedSubstanceId] = useState<string>('naphthalene');
  const [isBurnerOn, setIsBurnerOn] = useState<boolean>(false);
  const [sublimationVaporLevel, setSublimationVaporLevel] = useState<number>(0); // 0 to 100

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Toast
  const [copyToast, setCopyToast] = useState<boolean>(false);

  // Sublimation burner effect timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBurnerOn) {
      timer = setInterval(() => {
        setSublimationVaporLevel((prev) => Math.min(100, prev + 10));
      }, 300);
    } else {
      timer = setInterval(() => {
        setSublimationVaporLevel((prev) => Math.max(0, prev - 15));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isBurnerOn]);

  // Diffusion simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDiffusing) {
      interval = setInterval(() => {
        setDiffusionProgress((prev) => {
          if (prev >= 100) {
            setIsDiffusing(false);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isDiffusing]);

  // Save Progress
  const saveProgressToBackend = async (newCompleted: number[]) => {
    try {
      await fetch('/api/playground/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: 2,
          subject: 'chemistry',
          completedLessons: newCompleted,
          currentLesson: activeLesson,
        }),
      });
    } catch (err) {
      console.error('Failed to save chemistry progress:', err);
    }
  };

  // Lesson Metadata
  const LESSONS_META: Record<
    number,
    {
      no: string;
      titleBn: string;
      titleEn: string;
      overviewBn: string;
      overviewEn: string;
      studyTipBn: string;
      studyTipEn: string;
      badgeText: string;
    }
  > = {
    1: {
      no: '০১',
      titleBn: 'পদার্থের ৩ অবস্থা ও কণার গতিতত্ত্ব',
      titleEn: 'Three States of Matter & Kinetic Theory',
      overviewBn:
        'কঠিন, তরল ও গ্যাসীয় দশায় কণার বিন্যাস, আন্তঃকণা আকর্ষণ বল বনাম গতিশক্তির দ্বন্দ্ব এবং তাপ ও চাপের প্রভাব।',
      overviewEn:
        'Lattice arrangement in solids, sliding fluids in liquids, chaotic high-velocity gases, and the particle kinetic model.',
      studyTipBn: 'তাপমাত্রা বাড়লে কণার গতিশক্তি বৃদ্ধি পায় এবং আন্তঃকণা আকর্ষণ বল শিথিল হয়!',
      studyTipEn: 'Thermal energy directly enhances particle kinetic velocity while weakening attractive lattice forces!',
      badgeText: 'কঠিন, তরল, গ্যাস ও গতিতত্ত্ব',
    },
    2: {
      no: '০২',
      titleBn: 'ব্যাপন বনাম নিঃসরণ ল্যাব',
      titleEn: 'Diffusion vs Effusion Laboratory',
      overviewBn:
        'উচ্চ ঘনমাত্রা থেকে সমভাবে স্বতঃস্ফূর্ত ছড়িয়ে পড়া (ব্যাপন) বনাম সরু ছিদ্রপথে উচ্চচাপ থেকে সজোরে নির্গমন (নিঃসরণ)।',
      overviewEn:
        'Spontaneous concentration dispersion (diffusion) contrasted with pressure-driven micro-pore ejection (effusion).',
      studyTipBn: 'এলপিজি সিলিন্ডারের মুখ খুললে আগে ঘটে নিঃসরণ, তারপর ঘরের চারদিকে ঘটে ব্যাপন!',
      studyTipEn: 'Opening pressurized gas valves triggers effusion first through the nozzle, followed by ambient diffusion!',
      badgeText: 'ব্যাপন ও নিঃসরণের পার্থক্য',
    },
    3: {
      no: '০৩',
      titleBn: 'NH₃ ও HCl কাচনল ব্যাপন সিমুলেটর',
      titleEn: 'NH₃ & HCl Glass Tube Diffusion Simulator',
      overviewBn:
        'গ্রাহামের ব্যাপন সূত্রের লাইভ কাচনল পরীক্ষা—কেন হালকা NH₃ দ্রুত ছুটে ভারী HCl মুখের কাছে সাদা NH₄Cl ধোঁয়ার বলয় তৈরি করে।',
      overviewEn:
        'Live simulation of the textbook glass tube lab demonstrating inverse root mass diffusion and formation of white NH₄Cl rings.',
      studyTipBn: 'বোর্ড পরীক্ষায় অংক আসে: NH₃ এর ভর ১৭ ও HCl এর ভর ৩৬.৫; আণবিক ভর কম হওয়ায় NH₃ দ্রুত চলে!',
      studyTipEn: 'Gram-molecular masses: NH₃ = 17, HCl = 36.5. Lower molar mass produces faster spatial diffusion rate!',
      badgeText: 'কাচনলে সাদা ধোঁয়ার বলয়',
    },
    4: {
      no: '০৪',
      titleBn: 'গলনাঙ্ক, স্ফুটনাঙ্ক ও বরফের তাপীয় বক্ররেখা',
      titleEn: 'Melting/Boiling Points & Ice Heating Curve',
      overviewBn:
        'বিশুদ্ধ পদার্থের প্রমাণ গলনাঙ্ক ও স্ফুটনাঙ্ক, সুপ্ততাপ এবং হিটিং কার্ভে ০°C ও ১০০°C তাপমাত্রার সমান্তরাল মালভূমির বৈজ্ঞানিক তাৎপর্য।',
      overviewEn:
        'Standard melting/boiling points, latent heat of phase transitions, and flat thermal plateaus on ice heating curves.',
      studyTipBn: 'সুপ্ততাপের সময় থার্মোমিটারের পাঠ স্থির থাকে কারণ সমস্ত তাপ কণার অভ্যন্তরীণ বন্ধন ভাঙতে ব্যবহৃত হয়!',
      studyTipEn: 'Temperature remains flat during phase transitions as thermal flux overcomes intermolecular bonds!',
      badgeText: 'হিটিং কার্ভ ও সুপ্ততাপ',
    },
    5: {
      no: '০৫',
      titleBn: 'পাতন ও ঊর্ধ্বপাতন উদ্বায়ী পদার্থ ল্যাব',
      titleEn: 'Distillation & Sublimation Volatile Lab',
      overviewBn:
        'বাষ্পীভবন + ঘনীভবন = পাতন; এবং ন্যাপথালিন, কর্পূর, নিশাদল, আয়োডিন ও ড্রাই আইসের সরাসরি কঠিন থেকে বাষ্পে রূপান্তর ল্যাব।',
      overviewEn:
        'Distillation thermodynamics paired with sublimation of naphthalene, camphor, sal ammoniac, iodine, and dry ice.',
      studyTipBn: 'ঊর্ধ্বপাতিত ৬টি পদার্থ মুখস্থ রাখো: ন্যাপথালিন, কর্পূর, নিশাদল (NH₄Cl), আয়োডিন, কঠিন CO₂ ও AlCl₃!',
      studyTipEn: 'Memorize the 6 classic sublimation substances: Naphthalene, Camphor, NH₄Cl, Iodine, Dry Ice, and AlCl₃!',
      badgeText: 'উদ্বায়ী পদার্থ ও ঊর্ধ্বপাতন',
    },
  };

  const currentLessonMeta = LESSONS_META[activeLesson] || LESSONS_META[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

  // AI Chat Handler
  const handleSendAiMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userQuery = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userQuery,
          subject: 'chemistry',
          chapter: '2 - পদার্থের অবস্থা (States of Matter)',
          context: `বর্তমান পাঠ: ${activeLesson}, ধাপ: ${activeStep}, তাপমাত্রা: ${particleTemperature}°C`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: data.response || data.message || (isBn ? 'উত্তর প্রস্তুত হয়েছে!' : 'Answer ready!'),
          },
        ]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // High-quality contextual fallback
      setTimeout(() => {
        let fallback = isBn
          ? 'পদার্থের কণার গতিতত্ত্ব অনুসারে কণার গতিশক্তি ও আন্তঃকণা আকর্ষণ বলের পারস্পরিক প্রতিযোগিতাই কঠিন, তরল ও গ্যাসীয় অবস্থা নির্ধারণ করে।'
          : 'According to kinetic particle theory, states of matter represent the balance between thermal kinetic energy and intermolecular attraction.';

        if (userQuery.toLowerCase().includes('ব্যাপন') || userQuery.toLowerCase().includes('diffusion')) {
          fallback = isBn
            ? 'ব্যাপন হলো কোনো মাধ্যমে কঠিন, তরল বা গ্যাসীয় বস্তুর স্বতঃস্ফূর্ত ও সমভাবে চারদিকে ছড়িয়ে পড়ার প্রক্রিয়া। যে গ্যাসের আণবিক ভর কম, তার ব্যাপনের হার তত বেশি।'
            : 'Diffusion is the spontaneous dispersion of particles from higher to lower concentration. Rate is inversely proportional to square root of molar mass.';
        } else if (userQuery.toLowerCase().includes('কাচনল') || userQuery.toLowerCase().includes('সাদা ধোয়া') || userQuery.toLowerCase().includes('nh3')) {
          fallback = isBn
            ? 'কাচনলে NH₃ (ভর ১৭) এবং HCl (ভর ৩৬.৫) ব্যাপিত হলে NH₃ হালকা হওয়ায় দ্রুত পথ অতিক্রম করে এবং ভারী HCl এর কাছাকাছি প্রান্তে ঘন সাদা ধোঁয়ার NH₄Cl বলয় সৃষ্টি করে।'
            : 'In the glass tube experiment, NH₃ (mass 17) diffuses faster than HCl (mass 36.5), forming the white ammonium chloride (NH₄Cl) ring closer to the HCl plug.';
        } else if (userQuery.toLowerCase().includes('বক্ররেখা') || userQuery.toLowerCase().includes('heating curve') || userQuery.toLowerCase().includes('সুপ্ততাপ')) {
          fallback = isBn
            ? 'বরফের তাপীয় বক্ররেখায় ০°C ও ১০০°C এ সমান্তরাল রেখা দেখা যায়। এই সময় গৃহীত তাপমাত্রার বৃদ্ধি না ঘটিয়ে বরফের গলন ও পানির বাষ্পীভবনে সুপ্ততাপ হিসেবে ব্যয় হয়।'
            : 'On the heating curve of ice, plateaus at 0°C and 100°C signify latent heat of fusion and vaporization where temperature remains invariant during phase changes.';
        } else if (userQuery.toLowerCase().includes('ঊর্ধ্বপাতন') || userQuery.toLowerCase().includes('ন্যাপথালিন') || userQuery.toLowerCase().includes('sublimation')) {
          fallback = isBn
            ? 'যে প্রক্রিয়ায় কোনো কঠিন পদার্থকে তাপ দিলে তা তরলে পরিণত না হয়ে সরাসরি বাষ্পে পরিণত হয় তাকে ঊর্ধ্বপাতন বলে। উদাহরণ: ন্যাপথালিন, কর্পূর, নিশাদল, আয়োডিন ও ড্রাই আইস।'
            : 'Sublimation is the direct transition from solid to gas without entering a liquid state upon heating (e.g. Naphthalene, Camphor, NH₄Cl, Iodine, Dry Ice).';
        }

        setChatMessages((prev) => [...prev, { role: 'ai', text: fallback }]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Start diffusion test
  const handleStartDiffusion = () => {
    setDiffusionProgress(0);
    setIsDiffusing(true);
  };

  const handleResetDiffusion = () => {
    setIsDiffusing(false);
    setDiffusionProgress(0);
  };

  // Quiz submission
  const handleSelectQuiz = (qId: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    CHEMISTRY_CH2_BOARD_MCQS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score += 1;
    });
    return score;
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    if (!completedLessons.includes(activeLesson)) {
      const updated = Array.from(new Set([...completedLessons, activeLesson]));
      setCompletedLessons(updated);
      await saveProgressToBackend(updated);
    }
  };

  // Copy Study Notes
  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ২: পদার্থের অবস্থা (রিভিশন হ্যান্ডনোট)
--------------------------------------------------
১. পদার্থের তিন অবস্থা ও কণার গতিতত্ত্ব:
   - কঠিন (Solid): আন্তঃকণা আকর্ষণ বল সর্বোচ্চ, দূরত্ব সর্বনিম্ন, কণাগুলো নির্দিষ্ট স্থানে কম্পিত হয়।
   - তরল (Liquid): নির্দিষ্ট আয়তন আছে কিন্তু আকার নেই, কণাগুলো একে অপরের ওপর পিছলে চলে।
   - গ্যাসীয় (Gas): আকর্ষণ বল প্রায় শূন্য, দূরত্ব সর্বাধিক, কণাগুলো ইতস্তত দ্রুতগতিতে ছোটাছুটি করে।

২. ব্যাপন বনাম নিঃসরণ:
   - ব্যাপন (Diffusion): স্বতঃস্ফূর্ত ও সমভাবে ছড়িয়ে পড়া (স্বাভাবিক চাপে)।
   - নিঃসরণ (Effusion): সরু ছিদ্রপথে উচ্চচাপ অঞ্চল থেকে নিম্নচাপ অঞ্চলে সজোরে বের হওয়া।
   - সিলিন্ডারের ক্ষেত্রে: আগে ঘটে নিঃসরণ, পরে চারদিকে ঘটে ব্যাপন।
   - গ্রাহামের ব্যাপন সূত্র: ব্যাপন হার ∝ ১ / √(আণবিক ভর)। আণবিক ভর কম হলে ব্যাপন দ্রুত হয়।

৩. NH₃ ও HCl এর কাচনল পরীক্ষা:
   - NH₃ এর আণবিক ভর = ১৭ (হালকা), HCl এর আণবিক ভর = ৩৬.৫ (ভারী)।
   - NH₃ দ্রুত অতিক্রম করে (~৬০ সেমি) এবং HCl ধীরে অতিক্রম করে (~৪০ সেমি)।
   - ফলে HCl মুখের কাছাকাছি ঘন সাদা ধোঁয়ার NH₄Cl বলয় সৃষ্টি হয়: NH₃(g) + HCl(g) → NH₄Cl(s)।

৪. গলনাঙ্ক, স্ফুটনাঙ্ক ও তাপীয় বক্ররেখা:
   - গলনাঙ্ক: বরফের ০°C; স্ফুটনাঙ্ক: পানির ১০০°C।
   - সুপ্ততাপ (Latent Heat): গলন ও স্ফুটনের সময় তাপমাত্রা স্থির থাকে (০°C ও ১০০°C সমান্তরাল রেখা)।

৫. পাতন ও ঊর্ধ্বপাতন:
   - পাতন = বাষ্পীভবন + ঘনীভবন।
   - ঊর্ধ্বপাতন (Sublimation): কঠিন → সরাসরি গ্যাস (তরল না হয়ে)।
   - ৬টি উদ্বায়ী পদার্থ: ন্যাপথালিন (C₁₀H₈), কর্পূর (C₁₀H₁₆O), নিশাদল (NH₄Cl), আয়োডিন (I₂), ড্রাই আইস (কঠিন CO₂), অ্যালুমিনিয়াম ক্লোরাইড (AlCl₃)।
--------------------------------------------------
শেরাটুটোর ভার্চুয়াল গাইডবুক (SheraTutor.com)`
      : `SSC Chemistry Chapter 2: States of Matter (Revision Notes)
--------------------------------------------------
1. Three States & Kinetic Theory:
   - Solid: Maximum intermolecular attraction, minimal distance, vibrating fixed lattice.
   - Liquid: Definite volume, indefinite shape, sliding fluid molecules.
   - Gas: Negligible attraction, maximal spacing, chaotic high-velocity collisions.

2. Diffusion vs Effusion:
   - Diffusion: Spontaneous equal dispersion at ambient pressure.
   - Effusion: Pressure-driven escape through a tiny orifice.
   - Pressurized cylinder: Effusion first, followed by ambient diffusion.
   - Graham's Law: Rate ∝ 1 / √(Molecular Mass). Lower mass = faster diffusion.

3. NH₃ vs HCl Glass Tube Lab:
   - NH₃ (M=17) is lighter and travels faster (~60 cm).
   - HCl (M=36.5) is heavier and travels slower (~40 cm).
   - White smoke ring of NH₄Cl precipitates closer to the HCl plug.

4. Heating Curves & Latent Heat:
   - Ice melts at 0°C; Water boils at 100°C.
   - Plateaus represent latent heat where temperature stays constant during phase transitions.

5. Distillation & Sublimation:
   - Distillation = Evaporation + Condensation.
   - Sublimation: Solid to gas directly without melting.
   - 6 Subliming Agents: Naphthalene, Camphor, NH₄Cl, Iodine, Dry Ice (CO₂), AlCl₃.
--------------------------------------------------
SheraTutor Virtual Guidebook (SheraTutor.com)`;

    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  const currentSubstance =
    SUBLIMATION_SUBSTANCES.find((s) => s.id === selectedSubstanceId) || SUBLIMATION_SUBSTANCES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-cyan-500/20">
      {/* High-Contrast Top Navigation Bar */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={2}
        chapterTitleBn="পদার্থের অবস্থা (States of Matter)"
        chapterTitleEn="States of Matter"
        activeLesson={activeLesson}
        activeLessonTitle={isBn ? LESSONS_META[activeLesson]?.titleBn : LESSONS_META[activeLesson]?.titleEn}
        isSidebarOpen={isLeftSidebarOpen}
        onToggleSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onOpenAi={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto p-3 sm:p-4 lg:p-6 gap-5 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT SIDEBAR (Hideable Chapter Rail & Syllabus) */}
        {/* ========================================================= */}
        {isLeftSidebarOpen && (
          <aside className="w-64 sm:w-72 shrink-0 space-y-4 animate-in fade-in duration-200">
            {/* Subject Selector Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'শ্রেণি ও বিষয়' : 'Grade & Subject'}
                </span>
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <div>
                  <div className="text-foreground">Class 9–10 (SSC)</div>
                  <div className="text-[10px] text-muted-foreground font-normal">
                    {isBn ? 'রসায়ন (Chemistry) • কোড ১৩৭' : 'Chemistry • Code 137'}
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Progress & Lessons Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">CHAPTER 02</span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'পদার্থের অবস্থা' : 'States of Matter'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = LESSONS_META[lNum];
                  const isCurrent = activeLesson === lNum;
                  const isDone = completedLessons.includes(lNum);

                  return (
                    <button
                      key={lNum}
                      onClick={() => {
                        setActiveLesson(lNum);
                        setActiveStep('concept');
                      }}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-xs'
                          : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center text-[9px] font-mono ${
                              isCurrent
                                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                : 'border-muted-foreground/40 text-muted-foreground'
                            }`}
                          >
                            {lNum}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {isBn ? `পাঠ ${meta.no}` : `Lesson ${lNum}`}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                              {isBn ? 'সক্রিয়' : 'Active'}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-xs truncate mt-0.5 text-foreground">
                          {isBn ? meta.titleBn : meta.titleEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NCTB Authenticity Badge */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় ২ (পৃষ্ঠা ১৭-৩৪) এর কণার গতিতত্ত্ব, ব্যাপন কাচনল, বরফের তাপীয় বক্ররেখা ও ৬টি উদ্বায়ী পদার্থের নির্ভুল বিবরণ।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 2 (Printed pp. 17–34) with kinetic particle simulation and heating curves.'}
              </p>
            </div>
          </aside>
        )}

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER WORKSPACE (5-Step Pedagogical Engine)   */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Lesson Header Banner */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold border border-cyan-500/20">
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় ০২ • পাঠ ${currentLessonMeta.no}` : `Chapter 02 • Lesson ${activeLesson}`}
                  </span>
                  <span>•</span>
                  <span>{currentLessonMeta.badgeText}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {isBn ? currentLessonMeta.titleBn : currentLessonMeta.titleEn}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                  {isBn ? currentLessonMeta.overviewBn : currentLessonMeta.overviewEn}
                </p>
              </div>

              {/* Study Tip Pill */}
              <div className="shrink-0 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 max-w-xs text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{isBn ? 'বোর্ড পরীক্ষার টিপ' : 'Exam Study Tip'}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {isBn ? currentLessonMeta.studyTipBn : currentLessonMeta.studyTipEn}
                </p>
              </div>
            </div>

            {/* 5-Step Horizontal Tab Navigation */}
            <div className="mt-6 pt-4 border-t border-border/70 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { key: 'concept', labelBn: '১. কনসেপ্ট ল্যাব', labelEn: '1. Concept Lab', icon: BookOpen },
                { key: 'example', labelBn: '২. বোর্ড উদাহরণ (CQ)', labelEn: '2. Board CQ', icon: Award },
                { key: 'try', labelBn: '৩. নিজে চেষ্টা করুন', labelEn: '3. Try Yourself', icon: Sliders },
                { key: 'check', labelBn: '৪. অনুধাবন যাচাই (MCQ)', labelEn: '4. Check MCQ', icon: HelpCircle },
                { key: 'summary', labelBn: '৫. সারসংক্ষেপ ও সূত্র', labelEn: '5. Summary Vault', icon: CheckCircle2 },
              ].map((step) => {
                const isStepActive = activeStep === step.key;
                const Icon = step.icon;
                return (
                  <button
                    key={step.key}
                    onClick={() => setActiveStep(step.key as LearningStep)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isStepActive
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                        : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{isBn ? step.labelBn : step.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 1: CONCEPT LAB                                       */}
          {/* ========================================================= */}
          {activeStep === 'concept' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Lesson 1 Concept: States of Matter & Kinetic Theory */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  {/* Definition Card */}
                  <div className="rounded-3xl border border-cyan-500/30 bg-card p-6 shadow-xs relative overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                        <Layers className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                          {isBn ? 'এনসিটিবি প্রামাণ্য নীতি' : 'Core NCTB Principle'}
                        </span>
                        <h3 className="text-lg font-black text-foreground">
                          {isBn ? 'কণার গতিতত্ত্ব কী? (Kinetic Theory of Particles)' : 'What is Kinetic Theory of Particles?'}
                        </h3>
                        <blockquote className="p-4 rounded-2xl bg-muted/50 border-l-4 border-cyan-500 text-sm font-medium leading-relaxed italic text-foreground">
                          {isBn
                            ? '“সকল পদার্থই ক্ষুদ্রাতিক্ষুদ্র কণা দিয়ে গঠিত। এই কণাগুলোর মধ্যে বিদ্যমান আন্তঃকণা আকর্ষণ বল এবং তাদের অভ্যন্তরীণ গতিশক্তির মধ্যকার পারস্পরিক দ্বন্দ্বকেই কণার গতিতত্ত্ব বলে।”'
                            : '“All matter is composed of tiny moving particles. The dynamic interplay between their mutual intermolecular attraction forces and their kinetic velocities defines the kinetic theory of particles.”'}
                        </blockquote>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'পদার্থ কঠিন থাকবে, তরল হবে নাকি গ্যাসে রূপান্তরিত হবে—তা সম্পূর্ণ নির্ভর করে কণাগুলোর গতিশক্তি তাদের মধ্যকার আকর্ষণ বলকে পরাভূত করতে পারছে কি না তার ওপর।'
                            : 'Whether matter exists as solid, liquid, or gas depends on whether thermal kinetic energy overcomes intermolecular cohesion.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3 States Comparison Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Solid */}
                    <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 hover:border-cyan-500/40 transition-colors">
                      <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500 w-fit font-bold text-xs">
                        🧊 {isBn ? 'কঠিন অবস্থা (Solid)' : 'Solid State'}
                      </div>
                      <h4 className="text-sm font-black text-foreground">
                        {isBn ? 'নির্দিষ্ট আকার ও আয়তন' : 'Definite Shape & Volume'}
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                        <li>
                          <strong>আন্তঃকণা আকর্ষণ বল:</strong> সর্বাধিক তীব্র।
                        </li>
                        <li>
                          <strong>আন্তঃকণা দূরত্ব:</strong> সর্বনিম্ন (ঘন সন্নিবিষ্ট)।
                        </li>
                        <li>
                          <strong>কণার গতি:</strong> স্থান পরিবর্তন করে না, কেবল নিজস্ব অবস্থানে থেকে কাঁপতে থাকে।
                        </li>
                      </ul>
                    </div>

                    {/* Liquid */}
                    <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 hover:border-cyan-500/40 transition-colors">
                      <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit font-bold text-xs">
                        💧 {isBn ? 'তরল অবস্থা (Liquid)' : 'Liquid State'}
                      </div>
                      <h4 className="text-sm font-black text-foreground">
                        {isBn ? 'নির্দিষ্ট আয়তন কিন্তু পাত্রের আকার' : 'Definite Volume, Flowing Shape'}
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                        <li>
                          <strong>আন্তঃকণা আকর্ষণ বল:</strong> কঠিনের চেয়ে শিথিল।
                        </li>
                        <li>
                          <strong>আন্তঃকণা দূরত্ব:</strong> কিছুটা বেশি।
                        </li>
                        <li>
                          <strong>কণার গতি:</strong> কণাগুলো একে অপরের গায়ের ওপর দিয়ে পিছলে চলাচল করতে পারে।
                        </li>
                      </ul>
                    </div>

                    {/* Gas */}
                    <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 hover:border-cyan-500/40 transition-colors">
                      <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 w-fit font-bold text-xs">
                        💨 {isBn ? 'গ্যাসীয় অবস্থা (Gas)' : 'Gaseous State'}
                      </div>
                      <h4 className="text-sm font-black text-foreground">
                        {isBn ? 'আকার ও আয়তন কোনোটিই নির্দিষ্ট নয়' : 'Indefinite Shape & Volume'}
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                        <li>
                          <strong>আন্তঃকণা আকর্ষণ বল:</strong> প্রায় নেই বললেই চলে।
                        </li>
                        <li>
                          <strong>আন্তঃকণা দূরত্ব:</strong> সর্বাধিক।
                        </li>
                        <li>
                          <strong>কণার গতি:</strong> প্রচণ্ড গতিতে চারদিকে অনবরত এলোমেলো ছোটাছুটি ও সংঘর্ষ।
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 2 Concept: Diffusion vs Effusion */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                      <Wind className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      <span>{isBn ? 'ব্যাপন ও নিঃসরণের মৌলিক তুলনা' : 'Diffusion vs Effusion Deep Dive'}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'ব্যাপন ও নিঃসরণ দুটি ভিন্ন প্রক্রিয়া হলেও উভয়ের মূলেই রয়েছে পদার্থের কণাগুলোর উচ্চ ঘনত্ব বা উচ্চচাপ থেকে নিম্ন অঞ্চলের দিকে ছড়িয়ে পড়ার প্রবণতা।'
                        : 'While distinct phenomena, both diffusion and effusion arise from particles escaping higher energy gradients into ambient low-concentration regions.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Diffusion */}
                      <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            {isBn ? 'ব্যাপন (Diffusion)' : 'Diffusion'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                            {isBn ? 'স্বাভাবিক বায়ুমণ্ডলীয় চাপ' : 'Ambient Pressure'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'কোনো মাধ্যমে কঠিন, তরল বা গ্যাসীয় বস্তুর স্বতঃস্ফূর্ত ও সমানভাবে চারদিকে ছড়িয়ে পড়ার প্রক্রিয়াকে ব্যাপন বলে।'
                            : 'The spontaneous and homogeneous dispersion of solid, liquid, or gaseous molecules through a medium.'}
                        </p>
                        <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                          <strong className="text-foreground block">{isBn ? 'বাস্তব উদাহরণ:' : 'Real-world Examples:'}</strong>
                          <span className="text-muted-foreground">
                            {isBn
                              ? 'পানিতে পটাশিয়াম পারম্যাঙ্গানেট (KMnO₄) বা নীলের ফোঁটা দ্রবীভূত হওয়া, পাকা কাঁঠালের মিষ্টি গন্ধ ঘরের চারদিকে ছড়ানো।'
                              : 'KMnO₄ crystals dissolving uniformly in still water; ripe jackfruit scent spreading naturally through a room.'}
                          </span>
                        </div>
                      </div>

                      {/* Effusion */}
                      <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                            {isBn ? 'নিঃসরণ (Effusion)' : 'Effusion'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                            {isBn ? 'উচ্চচাপের পার্থক্য' : 'Pressure Differential'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'সরু ছিদ্রপথে কোনো গ্যাসের উচ্চচাপের অঞ্চল থেকে নিম্নচাপের অঞ্চলের দিকে সজোরে বেরিয়ে আসার প্রক্রিয়াকে নিঃসরণ বলে।'
                            : 'The rapid, pressure-driven escape of gas molecules from high pressure to low pressure through a micro-orifice.'}
                        </p>
                        <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                          <strong className="text-foreground block">{isBn ? 'বাস্তব উদাহরণ:' : 'Real-world Examples:'}</strong>
                          <span className="text-muted-foreground">
                            {isBn
                              ? 'বেলুনে পিন ফুটালে বাতাস হিসহিস শব্দে বেরিয়ে যাওয়া, বডি স্প্রে বা সেন্টের নজল চাপা, সিএনজি সিলিন্ডারের মুখ খোলা।'
                              : 'Air rushing through a pinhole in a balloon; pressing aerosol perfume nozzles; gas flowing out of CNG cylinders.'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cylinder Question Card */}
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 font-bold text-cyan-700 dark:text-cyan-300">
                        <Lightbulb className="h-4 w-4" />
                        <span>{isBn ? 'বোর্ড ক্লাসিক প্রশ্ন: সিলিন্ডারের ক্ষেত্রে কোনটি আগে ঘটে?' : 'Board Classic: In cylinders, which occurs first?'}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {isBn
                          ? 'সিলিন্ডারের ভেতরের সংকুচিত গ্যাস উচ্চচাপের কারণে সরু মুখ দিয়ে সজোরে বাইরে বেরিয়ে আসে—এটি নিঃসরণ। বাইরে এসে সেই গ্যাসটি বায়ুমণ্ডলের স্বাভাবিক চাপে চারদিকে স্বতঃস্ফূর্তভাবে ছড়িয়ে পড়ে—এটি ব্যাপন। সুতরাং, নিঃসরণ আগে ঘটে এবং ব্যাপন পরে ঘটে।'
                          : 'Pressurized gas first rushes forcefully through the nozzle due to pressure differential (Effusion). Once entering the atmosphere, it naturally diffuses in all directions (Diffusion). Thus, Effusion precedes Diffusion.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 3 Concept: NH3 vs HCl Glass Tube Lab */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'NH₃ ও HCl এর কাচনল ব্যাপন পরীক্ষা (চিত্র ২.০৪)' : 'NH₃ vs HCl Glass Tube Diffusion Lab'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'এনসিটিবি পাঠ্যবইয়ের সর্বাধিক গুরুত্বপূর্ণ ব্যবহারিক পরীক্ষা। একটি দীর্ঘ কাচনলের দুই মুখে দুটি তুলা ভিজিয়ে রাখা হলে গ্যাস দুটি ব্যাপিত হয়ে কাচনলের নির্দিষ্ট স্থানে মিলিত হয়।'
                        : 'The quintessential NCTB practical: Cotton wads soaked in concentrated NH₄OH and HCl are placed at opposite ends of an airtight horizontal tube.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-2">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                          {isBn ? 'বাম প্রান্ত: অ্যামোনিয়া গ্যাস (NH₃)' : 'Left End: Ammonia Gas (NH₃)'}
                        </span>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>উৎস: অ্যামোনিয়াম হাইড্রোক্সাইড দ্রবণ ($NH_4OH$)</div>
                          <div>
                            <RenderMathText text="আণবিক ভর: $M = 14 + (1 \times 3) = 17\text{ g/mol}$" />
                          </div>
                          <div className="font-bold text-emerald-600">হালকা গ্যাস $\rightarrow$ দ্রুত গতিতে ব্যাপিত হয় (~৬০ সেমি)</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-2">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                          {isBn ? 'ডান প্রান্ত: হাইড্রোজেন ক্লোরাইড গ্যাস (HCl)' : 'Right End: Hydrogen Chloride Gas (HCl)'}
                        </span>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>উৎস: হাইড্রোক্লোরিক এসিড দ্রবণ ($HCl$)</div>
                          <div>
                            <RenderMathText text="আণবিক ভর: $M = 1 + 35.5 = 36.5\text{ g/mol}$" />
                          </div>
                          <div className="font-bold text-amber-600">ভারী গ্যাস $\rightarrow$ ধীর গতিতে ব্যাপিত হয় (~৪০ সেমি)</div>
                        </div>
                      </div>
                    </div>

                    {/* Reaction Equation Box */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 text-center space-y-2">
                      <span className="text-xs font-bold text-foreground block">
                        {isBn ? 'সংঘটিত রাসায়নিক বিক্রিয়া ও ঘন সাদা ধোঁয়ার বলয়:' : 'Precipitation Reaction & Dense White Smoke Ring:'}
                      </span>
                      <div className="font-mono text-cyan-600 dark:text-cyan-400 text-sm">
                        <RenderMathText text="$\text{NH}_3(g) + \text{HCl}(g) \rightarrow \text{NH}_4\text{Cl}(s) \quad (\text{অ্যামোনিয়াম ক্লোরাইডের সাদা ধোঁয়া})$" />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {isBn
                          ? 'গ্রাহামের ব্যাপন সূত্র মতে: $r_{\text{NH}_3} / r_{\text{HCl}} = \sqrt{36.5 / 17} \approx 1.465$। তাই NH₃ গ্যাস HCl এর চেয়ে প্রায় দেড়গুণ দ্রুত চলে এবং বলয়টি HCl প্রান্তের কাছাকাছি গঠিত হয়।'
                          : 'By Graham’s law: $r_{\text{NH}_3} / r_{\text{HCl}} = \sqrt{36.5 / 17} \approx 1.465$. Ammonia moves nearly 1.5x faster, forcing the precipitate closer to the slower HCl cotton.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 4 Concept: Heating & Cooling Curves */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'বরফের তাপ প্রদানের বক্ররেখা (Heating Curve of Ice)' : 'Heating Curve of Ice & Phase Changes'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'এনসিটিবি চিত্র ২.০৯: কঠিন বরফে অবিরাম তাপ দিলে তাপমাত্রা ক্রমাগত সুষমভাবে বাড়ে না। গলনাঙ্ক (০°C) ও স্ফুটনাঙ্কে (১০০°C) তাপমাত্রা স্থির থাকে যতক্ষণ না পুরো দশা পরিবর্তিত হয়।'
                        : 'NCTB Figure 2.09: Continuous heat input does not raise temperature linearly. Plateaus at 0°C and 100°C represent latent energy overcoming crystalline lattice bonds.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">ধাপ ১ (-২০°C থেকে ০°C)</span>
                        <h4 className="text-xs font-bold text-foreground">কঠিন বরফ উত্তপ্ত হওয়া</h4>
                        <p className="text-[11px] text-muted-foreground">বরফের কণাগুলোর কম্পন বৃদ্ধি পায় ও তাপমাত্রা শূন্যে ওঠে।</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300">ধাপ ২ (০°C স্থির মালভূমি - AB)</span>
                        <h4 className="text-xs font-bold text-foreground">বরফের গলন (সুপ্ততাপ)</h4>
                        <p className="text-[11px] text-muted-foreground">বরফ ও পানি একসাথে অবস্থান করে; সম্পূর্ণ না গলা পর্যন্ত তাপমাত্রা ০°C থাকে।</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">ধাপ ৩ (০°C থেকে ১০০°C)</span>
                        <h4 className="text-xs font-bold text-foreground">তরল পানি উত্তপ্ত হওয়া</h4>
                        <p className="text-[11px] text-muted-foreground">পানির অণুগুলোর গতিশক্তি বৃদ্ধি পায় এবং তাপমাত্রা ১০০°C এ পৌঁছায়।</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">ধাপ ৪ (১০০°C স্থির মালভূমি - CD)</span>
                        <h4 className="text-xs font-bold text-foreground">পানির স্ফুটন (বাষ্পীভবন সুপ্ততাপ)</h4>
                        <p className="text-[11px] text-muted-foreground">পানি ও জলীয় বাষ্পের সহাবস্থান; সম্পূর্ণ বাষ্প না হওয়া পর্যন্ত তাপমাত্রা ১০০°C থাকে।</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 5 Concept: Distillation & Sublimation */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'পাতন ও ৬টি ঊর্ধ্বপাতিত উদ্বায়ী পদার্থ' : 'Distillation & 6 Sublimation Substances'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'পাতন হলো বাষ্পীভবন ও ঘনীভবনের যৌথ রূপ (পাতন = বাষ্পীভবন + ঘনীভবন)। কিন্তু কিছু বিশেষ কঠিন পদার্থ তাপ দিলে তরল না হয়ে সরাসরি বাষ্পে পরিণত হয়—এদের ঊর্ধ্বপাতিত পদার্থ বলে।'
                        : 'Distillation unites evaporation and condensation. In contrast, sublimation skips the liquid intermediate phase, converting solids directly into gaseous vapor upon heating.'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {SUBLIMATION_SUBSTANCES.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-4 rounded-2xl border border-border/70 bg-card space-y-1.5 hover:border-cyan-500/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-foreground">
                              {isBn ? sub.nameBn : sub.nameEn}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                            <RenderMathText text={`$${sub.formulaLatex}$`} />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            {isBn ? sub.usesBn : sub.usesEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: BOARD EXAMPLE (CQ Breakdown & Rubric)             */}
          {/* ========================================================= */}
          {activeStep === 'example' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                      SSC BOARD CREATIVE QUESTION (CQ)
                    </span>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? 'সৃজনশীল প্রশ্ন ০২: কাচনলে NH₃ ও HCl এর ব্যাপন ও সাদা বলয়' : 'Board CQ 02: NH₃ & HCl Diffusion in Glass Tube'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    ১০ নম্বর (10 Marks)
                  </span>
                </div>

                {/* Stimulus Box */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wide block">
                    {isBn ? 'উদ্দীপক:' : 'Stimulus:'}
                  </span>
                  <div className="p-3.5 rounded-xl bg-card border border-border/50 text-xs text-muted-foreground space-y-2">
                    <p>
                      {isBn
                        ? '১০০ সেমি দৈর্ঘ্যের একটি কাচনলের A মুখে গাঢ় হাইড্রোক্লোরিক এসিড ($HCl$) দ্রবণে ভেজানো তুলা এবং B মুখে গাঢ় অ্যামোনিয়াম হাইড্রোক্সাইড ($NH_4OH$) দ্রবণে ভেজানো তুলা একই সাথে প্রবেশ করিয়ে দুই মুখ কর্ক দিয়ে বন্ধ করে দেওয়া হলো। কিছুক্ষণ পর কাচনলের অভ্যন্তরে A মুখ থেকে প্রায় ৪০ সেমি দূরে এবং B মুখ থেকে প্রায় ৬০ সেমি দূরে একটি ঘন সাদা ধোঁয়ার বলয় সৃষ্টি হলো।'
                        : 'A 100 cm horizontal glass tube has its A-end sealed with a cotton wad soaked in concentrated hydrochloric acid (HCl) and its B-end with concentrated ammonium hydroxide (NH₄OH). Soon after sealing, a dense white annular smoke ring precipitates at 40 cm from end A (60 cm from end B).'}
                    </p>
                  </div>
                </div>

                {/* Questions & 4-Tier Rubric Answers */}
                <div className="space-y-4">
                  {/* (ক) জ্ঞানমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(ক) নিঃসরণ কী? [মান: ১]' : '(a) What is effusion? [Mark: 1]'}</span>
                      <span className="text-emerald-600 font-mono">1 Mark</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500">
                      {isBn
                        ? 'সরু ছিদ্রপথে কোনো গ্যাসের উচ্চচাপ অঞ্চল থেকে নিম্নচাপ অঞ্চলের দিকে সজোরে বেরিয়ে আসার প্রক্রিয়াকে নিঃসরণ বলে।'
                        : 'Effusion is the process in which gas molecules escape from a high-pressure region to a low-pressure region through a tiny pinhole.'}
                    </div>
                  </div>

                  {/* (খ) অনুধাবনমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(খ) একই পদার্থের গলনাঙ্ক ও স্ফুটনাঙ্ক ভিন্ন কেন? ব্যাখ্যা করো। [মান: ২]' : '(b) Why are the melting and boiling points of the same substance different? [Mark: 2]'}</span>
                      <span className="text-emerald-600 font-mono">2 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1">
                      <p>
                        {isBn
                          ? 'গলনের সময় কঠিন পদার্থের কণাগুলোর মধ্যকার শক্তিশালী আন্তঃকণা আকর্ষণ বল কিছুটা শিথিল করে কণাগুলোকে কেবল তরলে স্থানান্তরের জন্য তুলনামূলক কম তাপশক্তির প্রয়োজন হয়।'
                          : 'Melting requires merely enough thermal energy to weaken crystalline lattice bonds so molecules slide over one another into a liquid.'}
                      </p>
                      <p>
                        {isBn
                          ? 'কিন্তু স্ফুটনের সময় তরলের কণাগুলোর মধ্যকার আন্তঃকণা আকর্ষণ বলকে সম্পূর্ণ বিচ্ছিন্ন করে অণুগুলোকে মুক্ত গ্যাসীয় দশায় রূপান্তর করতে অনেক বেশি তাপশক্তির দরকার হয়। তাই স্ফুটনাঙ্ক সর্বদা গলনাঙ্কের চেয়ে অনেক বেশি হয়।'
                          : 'Boiling demands breaking all residual cohesive forces completely to liberate molecules into chaotic gaseous flight. Hence, boiling points are fundamentally higher than melting points.'}
                      </p>
                    </div>
                  </div>

                  {/* (গ) প্রয়োগমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(গ) কাচনলে উৎপন্ন সাদা ধোঁয়াটির গঠন ও রাসায়নিক রূপান্তর ব্যাখ্যা করো। [মান: ৩]' : '(c) Explain the chemical formation of the white annular ring. [Mark: 3]'}</span>
                      <span className="text-emerald-600 font-mono">3 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1.5">
                      <p>
                        {isBn
                          ? 'উদ্দীপকের A মুখ থেকে হাইড্রোক্লোরিক এসিড দ্রবণ হতে হাইড্রোজেন ক্লোরাইড গ্যাস ($HCl$) এবং B মুখ থেকে অ্যামোনিয়াম হাইড্রোক্সাইড দ্রবণ হতে অ্যামোনিয়া গ্যাস ($NH_3$) নির্গত হয়ে কাচনলে ব্যাপিত হয়।'
                          : 'End A liberates gaseous hydrogen chloride ($HCl$) while end B emits ammonia gas ($NH_3$). Both gases diffuse inward toward each other.'}
                      </p>
                      <p>
                        {isBn
                          ? 'উভয় গ্যাস পরস্পরের সংস্পর্শে এসে সংযোগ রাসায়নিক বিক্রিয়া সম্পন্ন করে এবং কঠিন অ্যামোনিয়াম ক্লোরাইড ($NH_4Cl$) এর মিহি কণা তৈরি করে যা ঘন সাদা ধোঁয়ার বলয় হিসেবে দৃশ্যমান হয়:'
                          : 'Upon encountering each other, the two gaseous reagents react in a direct gas-phase addition reaction synthesizing solid ammonium chloride particles, visible as dense white smoke:'}
                      </p>
                      <div className="p-2 rounded-xl bg-muted/50 font-mono text-center text-foreground">
                        <RenderMathText text="$\text{NH}_3(g) + \text{HCl}(g) \rightarrow \text{NH}_4\text{Cl}(s)$" />
                      </div>
                    </div>
                  </div>

                  {/* (ঘ) উচ্চতর দক্ষতামূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(ঘ) সাদা ধোঁয়ার বলয়টি কাচনলের ঠিক মাঝে না হয়ে A প্রান্তের (HCl) কাছাকাছি উৎপন্ন হওয়ার কারণ গাণিতিক যুক্তিসহ বিশ্লেষণ করো। [মান: ৪]' : '(d) Mathematically analyze why the white ring precipitates closer to the A (HCl) end. [Mark: 4]'}</span>
                      <span className="text-emerald-600 font-mono">4 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1.5">
                      <p>
                        {isBn
                          ? 'গ্রাহামের ব্যাপন সূত্র অনুসারে, নির্দিষ্ট তাপমাত্রা ও চাপে কোনো গ্যাসের ব্যাপন হার ($r$) তার আণবিক ভর ($M$) এর বর্গমূলের ব্যস্তানুপাতিক ($r \propto 1 / \sqrt{M}$)। অর্থাৎ যে গ্যাসের আণবিক ভর কম তার ব্যাপন হার বেশি।'
                          : 'According to Graham’s Law, at constant temperature and pressure, the rate of diffusion ($r$) of a gas is inversely proportional to the square root of its molecular mass ($M$): $r \propto 1 / \sqrt{M}$.'}
                      </p>
                      <p>
                        {isBn
                          ? 'অ্যামোনিয়া ($NH_3$) এর আণবিক ভর $= ১৪ + (১ \times ৩) = ১৭\text{ g/mol}$। অন্যদিকে হাইড্রোজেন ক্লোরাইড ($HCl$) এর আণবিক ভর $= ১ + ৩৫.৫ = ৩৬.৫\text{ g/mol}$।'
                          : 'Molar mass of ammonia: $M_{\text{NH}_3} = 14 + 3 = 17\text{ g/mol}$. Molar mass of hydrogen chloride: $M_{\text{HCl}} = 1 + 35.5 = 36.5\text{ g/mol}$.'}
                      </p>
                      <div className="p-2 rounded-xl bg-muted/50 font-mono text-center text-foreground">
                        <RenderMathText text="$\frac{r_{\text{NH}_3}}{r_{\text{HCl}}} = \sqrt{\frac{M_{\text{HCl}}}{M_{\text{NH}_3}}} = \sqrt{\frac{36.5}{17}} \approx 1.465$" />
                      </div>
                      <p>
                        {isBn
                          ? 'যেহেতু একই সময়ে $NH_3$ গ্যাস $HCl$ এর তুলনায় প্রায় দেড়গুণ বেশি দূরত্ব অতিক্রম করতে পারে, তাই ১০০ সেমি কাচনলের মধ্যে হালকা $NH_3$ গ্যাস প্রায় ৬০ সেমি অতিক্রম করে এবং ভারী $HCl$ গ্যাস মাত্র ৪০ সেমি অতিক্রম করে। ফলে মিলনস্থলটি A প্রান্তের (HCl) নিকটবর্তী হয়।'
                          : 'Because lighter $NH_3$ moves nearly 1.465 times faster than heavier $HCl$, over identical duration $NH_3$ travels approximately 60 cm while $HCl$ covers only 40 cm. Thus, the precipitate naturally forms closer to the slower HCl cotton.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Examiner Warning Trap */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <AlertCircle className="h-4 w-4" />
                    <span>{isBn ? 'পরীক্ষকের ফাঁদ ও সাবধানতা' : 'Examiner Warning & Scoring Trap'}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {isBn
                      ? 'অনেক শিক্ষার্থী মনে করে NH₃ এর তুলা A প্রান্তে ছিল। প্রশ্ন উদ্দীপক ভালো করে পড়ে নেবে কোন প্রান্তে কোন গ্যাস আছে। এবং অবশ্যই আণবিক ভর ১৭ ও ৩৬.৫ গণনা করে গ্রাহামের সূত্রের অনুপাত দেখাতে হবে!'
                      : 'Carefully verify which letter designates which end in the exam stimulus. Always calculate molar masses (17 vs 36.5) explicitly to secure full mathematical credit!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: TRY YOURSELF (Interactive Simulators)             */}
          {/* ========================================================= */}
          {activeStep === 'try' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* SIMULATOR 1: Kinetic Theory Particle Chamber */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? '১. কণার গতিতত্ত্ব ইন্টারঅ্যাক্টিভ চেম্বার' : '1. Kinetic Theory Particle Chamber'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isBn
                        ? 'তাপমাত্রা পরিবর্তন করে কঠিন বরফ, তরল পানি ও জলীয় বাষ্পে কণার সরণ ও গতিশক্তি পর্যবেক্ষণ করো।'
                        : 'Adjust temperature slider to watch solid crystal, liquid fluid, and gaseous particle behaviors.'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {particleTemperature <= 0
                      ? (isBn ? 'কঠিন বরফ (Solid Ice)' : 'Solid Ice')
                      : particleTemperature < 100
                      ? (isBn ? 'তরল পানি (Liquid Water)' : 'Liquid Water')
                      : (isBn ? 'জলীয় বাষ্প (Steam/Gas)' : 'Gaseous Steam')}
                  </span>
                </div>

                {/* Particle Canvas Box */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Container with particles */}
                  <div className="relative w-64 h-56 rounded-2xl border-2 border-cyan-500/50 bg-card/80 overflow-hidden shadow-inner flex items-center justify-center p-2">
                    <div className="w-full h-full relative">
                      {Array.from({ length: 20 }).map((_, i) => {
                        const isSolid = particleTemperature <= 0;
                        const isGas = particleTemperature >= 100;

                        // Grid positions for solid
                        const row = Math.floor(i / 5);
                        const col = i % 5;
                        const solidTop = 25 + row * 20;
                        const solidLeft = 15 + col * 18;

                        // Random-like jitter based on temp
                        const jitterX = Math.sin(i * 1.5 + particleTemperature) * (isSolid ? 2 : isGas ? 25 : 8);
                        const jitterY = Math.cos(i * 2.1 + particleTemperature) * (isSolid ? 2 : isGas ? 25 : 8);

                        return (
                          <div
                            key={i}
                            className="absolute w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center"
                            style={{
                              top: `${isSolid ? solidTop : isGas ? 10 + (i * 13) % 80 : 45 + (i * 7) % 45}%`,
                              left: `${isSolid ? solidLeft : isGas ? 10 + (i * 17) % 80 : 15 + (i * 11) % 70}%`,
                              transform: `translate(${jitterX}px, ${jitterY}px)`,
                              backgroundColor: isSolid ? '#38bdf8' : isGas ? '#c084fc' : '#06b6d4',
                            }}
                          >
                            <span className="text-[7px] text-white font-bold select-none">H₂O</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Gauges */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>{isBn ? 'চেম্বারের তাপমাত্রা:' : 'Chamber Temperature:'}</span>
                        <span className="font-mono text-cyan-600 font-bold text-sm">{particleTemperature}°C</span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="130"
                        value={particleTemperature}
                        onChange={(e) => setParticleTemperature(Number(e.target.value))}
                        className="w-full accent-cyan-600 h-2 bg-muted rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>-২০°C (হিমায়িত)</span>
                        <span>০°C (গলনাঙ্ক)</span>
                        <span>১০০°C (স্ফুটনাঙ্ক)</span>
                        <span>১৩০°C (বাষ্প)</span>
                      </div>
                    </div>

                    {/* Metrics Breakdown */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block font-bold">আন্তঃকণা আকর্ষণ</span>
                        <span className="text-xs font-black text-foreground">
                          {particleTemperature <= 0 ? 'সর্বোচ্চ তীব্র' : particleTemperature < 100 ? 'মাঝারি' : 'নগণ্য/শূন্য'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block font-bold">কণার গতিশক্তি</span>
                        <span className="text-xs font-black text-rose-500">
                          {particleTemperature <= 0 ? 'ন্যূনতম' : particleTemperature < 100 ? 'মাঝারি' : 'চরম ক্ষিপ্র'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5">
                        <span className="text-[10px] text-muted-foreground block font-bold">আন্তঃকণা দূরত্ব</span>
                        <span className="text-xs font-black text-cyan-600">
                          {particleTemperature <= 0 ? 'ন্যূনতম' : particleTemperature < 100 ? 'মধ্যম' : 'সর্বাধিক'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIMULATOR 2: NH3 vs HCl Glass Tube Diffusion Lab */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? '২. NH₃ ও HCl কাচনল ব্যাপন সিমুলেটর' : '2. NH₃ vs HCl Glass Tube Diffusion Simulator'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isBn
                        ? '১০০ সেমি কাচনলে গ্যাস দুটির ব্যাপন পরীক্ষা শুরু করে ঠিক কোথায় সাদা বলয় সৃষ্টি হয় তা লাইভ পরিমাপ করো।'
                        : 'Simulate Graham’s law diffusion in a 100 cm tube and measure where the white smoke precipitates.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStartDiffusion}
                      disabled={isDiffusing || diffusionProgress === 100}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs disabled:opacity-40 transition-colors flex items-center gap-1.5"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>{isBn ? 'ব্যাপন শুরু' : 'Start'}</span>
                    </button>
                    <button
                      onClick={handleResetDiffusion}
                      className="p-1.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 100cm Glass Tube Visualizer */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 space-y-4">
                  <div className="relative w-full h-16 rounded-xl border-2 border-slate-400 bg-card/60 overflow-hidden flex items-center shadow-inner">
                    {/* Left Cotton Wad (NH3) */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-emerald-500/30 border-r border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 z-20">
                      NH₃
                    </div>

                    {/* Right Cotton Wad (HCl) */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-amber-500/30 border-l border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-700 dark:text-amber-300 z-20">
                      HCl
                    </div>

                    {/* NH3 Gas Front (travels 60% of tube) */}
                    <div
                      className="absolute left-8 top-1 bottom-1 bg-emerald-500/20 transition-all duration-150 rounded-r-full"
                      style={{
                        width: `calc(${(diffusionProgress / 100) * 59.4}% - 8px)`,
                      }}
                    />

                    {/* HCl Gas Front (travels 40% of tube) */}
                    <div
                      className="absolute right-8 top-1 bottom-1 bg-amber-500/20 transition-all duration-150 rounded-l-full"
                      style={{
                        width: `calc(${(diffusionProgress / 100) * 40.6}% - 8px)`,
                      }}
                    />

                    {/* White NH4Cl Ring when 100% */}
                    {diffusionProgress >= 100 && (
                      <div
                        className="absolute top-0 bottom-0 w-4 bg-white/95 border-x-2 border-cyan-400 shadow-md shadow-white/80 animate-pulse z-30 flex items-center justify-center"
                        style={{ left: '59.4%' }}
                      >
                        <span className="sr-only">NH4Cl ring</span>
                      </div>
                    )}
                  </div>

                  {/* Distance Ruler Labels */}
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground px-2">
                    <span>০ সেমি (NH₃ মুখ)</span>
                    <span className="font-bold text-cyan-600">৫৯.৪ সেমি (NH₄Cl বলয়)</span>
                    <span>১০০ সেমি (HCl মুখ)</span>
                  </div>

                  {/* Calculations Ledger */}
                  {diffusionProgress >= 100 && (
                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-foreground space-y-1 animate-in fade-in">
                      <div className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isBn ? 'সঠিক ফলাফল যাচাই সম্পন্ন:' : 'Measurement Complete:'}</span>
                      </div>
                      <p className="text-muted-foreground">
                        {isBn
                          ? 'হালকা NH₃ অতিক্রম করেছে ৫৯.৪ সেমি এবং ভারী HCl অতিক্রম করেছে ৪০.৬ সেমি। ফলে HCl প্রান্ত থেকে মাত্র ৪০.৬ সেমি দূরে ঘন সাদা ধোঁয়ার বলয় উৎপন্ন হয়েছে!'
                          : 'Lighter NH₃ traveled 59.4 cm while heavier HCl covered 40.6 cm. Thus the NH₄Cl white ring precipitated precisely 40.6 cm from the HCl end!'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SIMULATOR 3: Ice Heating Curve Scrubber */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-black text-foreground">
                    {isBn ? '৩. বরফের তাপীয় বক্ররেখা (Heating Curve Graph Scrubber)' : '3. Heating Curve of Ice Interactive Scrubber'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBn
                      ? 'সময় স্লাইডার টেনে ০°C (গলনাঙ্ক) ও ১০০°C (স্ফুটনাঙ্ক) এ সুপ্ততাপীয় অনুভূমিক মালভূমি পর্যবেক্ষণ করো।'
                      : 'Slide elapsed time to inspect latent heat flat plateaus at 0°C and 100°C.'}
                  </p>
                </div>

                {(() => {
                  // Approximate temp curve based on time 0 to 30 mins
                  let temp = -20;
                  let phase = 'solid';
                  let phaseBn = 'কঠিন বরফের তাপমাত্রা বৃদ্ধি';

                  if (heatingTimeMinutes <= 4) {
                    temp = -20 + (heatingTimeMinutes / 4) * 20; // -20 to 0
                    phase = 'solid';
                    phaseBn = 'কঠিন বরফ উত্তপ্ত হচ্ছে (-২০°C থেকে ০°C)';
                  } else if (heatingTimeMinutes <= 10) {
                    temp = 0;
                    phase = 'melting';
                    phaseBn = 'AB রেখা: বরফের গলন (সুপ্ততাপ শোষণ, বরফ+পানি সহাবস্থান, ০°C স্থির)';
                  } else if (heatingTimeMinutes <= 18) {
                    temp = ((heatingTimeMinutes - 10) / 8) * 100; // 0 to 100
                    phase = 'liquid';
                    phaseBn = 'তরল পানির তাপমাত্রা বৃদ্ধি (০°C থেকে ১০০°C)';
                  } else if (heatingTimeMinutes <= 25) {
                    temp = 100;
                    phase = 'boiling';
                    phaseBn = 'CD রেখা: পানির স্ফুটন (বাষ্পীভবন সুপ্ততাপ, পানি+বাষ্প সহাবস্থান, ১০০°C স্থির)';
                  } else {
                    temp = 100 + (heatingTimeMinutes - 25) * 5; // 100 to 125
                    phase = 'gas';
                    phaseBn = 'জলীয় বাষ্পের তাপমাত্রা বৃদ্ধি (> ১০০°C)';
                  }

                  return (
                    <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 space-y-4">
                      {/* SVG Curve Canvas */}
                      <div className="h-44 w-full bg-card rounded-xl border border-border p-3 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                          <span>তাপমাত্রা (°C)</span>
                          <span className="font-bold text-foreground">বর্তমান তাপমাত্রা: {temp.toFixed(1)}°C</span>
                        </div>

                        {/* Visual graph line representation */}
                        <div className="relative h-28 w-full border-b border-l border-slate-500/60 my-1">
                          {/* 0°C guideline */}
                          <div className="absolute top-[65%] left-0 right-0 border-b border-dashed border-cyan-500/30 text-[9px] text-cyan-600 pl-1">
                            ০°C (গলনাঙ্ক - AB)
                          </div>
                          {/* 100°C guideline */}
                          <div className="absolute top-[20%] left-0 right-0 border-b border-dashed border-rose-500/30 text-[9px] text-rose-500 pl-1">
                            ১০০°C (স্ফুটনাঙ্ক - CD)
                          </div>

                          {/* Cursor indicator */}
                          <div
                            className="absolute bottom-0 top-0 w-0.5 bg-cyan-600 z-10 transition-all duration-200"
                            style={{ left: `${(heatingTimeMinutes / 30) * 100}%` }}
                          >
                            <div className="w-3 h-3 rounded-full bg-cyan-600 -ml-1.5 -mt-1.5 shadow" />
                          </div>
                        </div>

                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                          <span>০ মিনিট</span>
                          <span>সময় (মিনিট)</span>
                          <span>৩০ মিনিট</span>
                        </div>
                      </div>

                      {/* Time Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>{isBn ? 'তাপ প্রয়োগের সময়:' : 'Heating Time:'}</span>
                          <span className="font-mono text-cyan-600 font-bold">{heatingTimeMinutes} মিনিট</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={heatingTimeMinutes}
                          onChange={(e) => setHeatingTimeMinutes(Number(e.target.value))}
                          className="w-full accent-cyan-600 h-2 bg-muted rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Phase Callout */}
                      <div className="p-3.5 rounded-xl bg-card border border-border text-xs space-y-1">
                        <span className="text-muted-foreground block font-bold">বর্তমান দশা ও তাপগতিবিদ্যা:</span>
                        <div className="font-bold text-cyan-600 dark:text-cyan-400">{phaseBn}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SIMULATOR 4: Sublimation Apparatus Explorer */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? '৪. ঊর্ধ্বপাতন চেম্বার (Sublimation Chamber Lab)' : '4. Sublimation Chamber Lab'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isBn
                        ? 'উদ্বায়ী পদার্থ নির্বাচন করো এবং বুনসেন বার্নার জ্বালিয়ে সরাসরি কঠিন থেকে বাষ্পে রূপান্তর দেখো।'
                        : 'Select volatile compound and fire the burner to witness direct solid-to-gas sublimation.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBurnerOn(!isBurnerOn)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isBurnerOn
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    <Flame className="h-4 w-4" />
                    <span>{isBurnerOn ? (isBn ? 'বার্নার বন্ধ করুন' : 'Extinguish Burner') : (isBn ? 'বার্নার জ্বালান' : 'Ignite Burner')}</span>
                  </button>
                </div>

                {/* Substance Selector Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {SUBLIMATION_SUBSTANCES.map((sub) => {
                    const isSelected = selectedSubstanceId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubstanceId(sub.id)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                            : 'border-border/70 hover:border-border bg-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-xs block">{isBn ? sub.nameBn : sub.nameEn}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {sub.formula}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sublimation Visualizer */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 flex flex-col md:flex-row items-center justify-around gap-6">
                  {/* Flask/Funnel Apparatus */}
                  <div className="relative w-48 h-56 flex flex-col items-center justify-end">
                    {/* Inverted Funnel with cotton plug */}
                    <div className="w-4 h-6 bg-slate-300 border border-slate-400 rounded-t-sm" />
                    <div
                      className="w-36 h-28 border-2 border-cyan-500/40 border-b-0 rounded-t-full relative flex items-center justify-center overflow-hidden transition-all duration-500"
                      style={{
                        backgroundColor: isBurnerOn ? currentSubstance.vaporColor : 'transparent',
                      }}
                    >
                      {sublimationVaporLevel > 20 && (
                        <span className="text-[10px] font-mono text-foreground font-bold animate-pulse">
                          {currentSubstance.nameBn} বাষ্প
                        </span>
                      )}
                    </div>

                    {/* China Dish with Solid */}
                    <div className="w-40 h-8 rounded-b-2xl bg-slate-200 dark:bg-slate-700 border-2 border-slate-400 flex items-center justify-center shadow-md">
                      <div
                        className="w-20 h-3 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: currentSubstance.color,
                          opacity: Math.max(0.3, 1 - sublimationVaporLevel / 120),
                        }}
                      />
                    </div>

                    {/* Burner Flame */}
                    {isBurnerOn && (
                      <div className="flex flex-col items-center mt-2 animate-bounce">
                        <Flame className="h-6 w-6 text-rose-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-rose-500">বুনসেন বার্নার</span>
                      </div>
                    )}
                  </div>

                  {/* Sublimation Explanation */}
                  <div className="flex-1 space-y-3">
                    <div className="p-4 rounded-2xl bg-card border border-border text-xs space-y-1.5">
                      <span className="font-bold text-foreground block">
                        {isBn ? `${currentSubstance.nameBn} এর ঊর্ধ্বপাতন আচরণ:` : `${currentSubstance.nameEn} Sublimation Behavior:`}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {isBn
                          ? 'উত্তাপের ফলে এটি কোনো তরলে পরিণত না হয়ে সরাসরি বাষ্পীভূত হয়। উপরের শীতল ফানেলের গায়ে লেগে বাষ্পটি পুনরায় ঘনীভূত হয়ে খাঁটি স্ফটিক আকারে জমা হয়।'
                          : 'Upon heating, solid crystals vaporize directly without melting into liquid. Cold inverted funnel walls condense the pure vapor back into solid crystalline deposits.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: CHECK MCQ (Interactive Board Quiz)                */}
          {/* ========================================================= */}
          {activeStep === 'check' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? 'অনুধাবন যাচাই: ৫টি বোর্ড বহুনির্বাচনী প্রশ্ন (MCQ)' : 'Diagnostic Quiz: 5 Board Standard MCQs'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isBn ? 'বিগত বছরের বোর্ড প্রশ্ন থেকে নির্বাচিত। উত্তর নির্বাচন করে তাৎক্ষণিক ফিডব্যাক যাচাই করো।' : 'Instant grading and official NCTB rationale explanations.'}
                    </p>
                  </div>
                  {quizSubmitted && (
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20">
                      {isBn ? `স্কোর: ৫ এ ${calculateQuizScore()}` : `Score: ${calculateQuizScore()} / 5`}
                    </div>
                  )}
                </div>

                {/* 5 Questions */}
                <div className="space-y-6 pt-2">
                  {CHEMISTRY_CH2_BOARD_MCQS.map((q, idx) => {
                    const selectedOpt = quizAnswers[q.id];

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl border border-border/70 bg-card space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                              QUESTION 0{idx + 1} • {q.boardSource}
                            </span>
                            <h4 className="text-sm font-bold text-foreground">
                              {isBn ? q.questionBn : q.questionEn}
                            </h4>
                          </div>
                        </div>

                        {/* 4 Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {(isBn ? q.optionsBn : q.optionsEn).map((opt, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            let btnStyle = 'border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground';

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                              } else if (isChosen) {
                                btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold';
                              }
                            } else if (isChosen) {
                              btnStyle = 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleSelectQuiz(q.id, optIdx)}
                                className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-2.5 ${btnStyle}`}
                              >
                                <span className="h-5 w-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-bold">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation on submit */}
                        {quizSubmitted && (
                          <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground space-y-1 animate-in fade-in">
                            <span className="font-bold text-foreground block">
                              {isBn ? 'সঠিক ব্যাখ্যার বিশ্লেষণ:' : 'Correct Explanation:'}
                            </span>
                            <p>{isBn ? q.explanationBn : q.explanationEn}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz Button */}
                <div className="pt-2 flex justify-end">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>{isBn ? 'কুইজের উত্তর জমা দিন' : 'Submit Answers'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>{isBn ? 'পুনরায় চেষ্টা করুন' : 'Retake Quiz'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: SUMMARY VAULT & CHEAT SHEET                       */}
          {/* ========================================================= */}
          {activeStep === 'summary' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                      ONE-CLICK REVISION VAULT
                    </span>
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'অধ্যায় ২: সম্পূর্ণ রিভিশন হ্যান্ডনোট ও সূত্রকোষ' : 'Chapter 2: Master Revision Notes & Formula Vault'}
                    </h3>
                  </div>
                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
                  </button>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Kinetic Theory */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span>{isBn ? '১. কণার গতিতত্ত্ব' : '1. Kinetic Particle Theory'}</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>কঠিন: আকর্ষণ বল সর্বাধিক, দূরত্ব সর্বনিম্ন।</li>
                      <li>তরল: আয়তন নির্দিষ্ট, আকার অনির্দিষ্ট, কণাগুলো পিছলে চলে।</li>
                      <li>গ্যাস: আকর্ষণ প্রায় শূন্য, দূরত্ব সর্বাধিক, এলোমেলো তীব্র বেগ।</li>
                    </ul>
                  </div>

                  {/* Card 2: Diffusion Law */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Wind className="h-4 w-4 text-emerald-500" />
                      <span>{isBn ? '২. গ্রাহামের ব্যাপন সূত্র' : '2. Graham’s Law'}</span>
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="p-2 rounded-xl bg-muted/40 font-mono text-center text-foreground">
                        <RenderMathText text="$r \propto \frac{1}{\sqrt{M}} \quad (\text{ব্যাপন হার})$" />
                      </div>
                      <p className="text-muted-foreground text-[11px] pt-1">
                        NH₃ (ভর ১৭) легক হওয়ায় দ্রুত চলে; HCl (ভর ৩৬.৫) ভারী হওয়ায় ধীরে চলে।
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Heating Curve */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-purple-500" />
                      <span>{isBn ? '৩. বরফের তাপীয় বক্ররেখা' : '3. Heating Curve of Ice'}</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>০°C এ AB রেখা: বরফের গলন (সুপ্ততাপ, তাপমাত্রা স্থির)।</li>
                      <li>১০০°C এ CD রেখা: পানির স্ফুটন (বাষ্পীভবন সুপ্ততাপ, তাপমাত্রা স্থির)।</li>
                      <li>বিশুদ্ধ পানির প্রমাণ স্ফুটনাঙ্ক ১০০°C এবং গলনাঙ্ক ০°C।</li>
                    </ul>
                  </div>

                  {/* Card 4: Sublimation */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Flame className="h-4 w-4 text-rose-500" />
                      <span>{isBn ? '৪. ৬টি ঊর্ধ্বপাতিত পদার্থ' : '4. 6 Sublimation Substances'}</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>ন্যাপথালিন (C₁₀H₈), কর্পূর (C₁₀H₁₆O)</li>
                      <li>নিশাদল (NH₄Cl), আয়োডিন (I₂)</li>
                      <li>ড্রাই আইস (কঠিন CO₂), অ্যালুমিনিয়াম ক্লোরাইড (AlCl₃)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom 5-Step Unified Footer */}
          <StepNavigationFooter
            currentStep={activeStep}
            onStepChange={(step) => setActiveStep(step as LearningStep)}
            chapterNumberBn="অধ্যায় ০২"
            chapterNumberEn="Chapter 02"
            chapterTitleBn="পদার্থের অবস্থা"
            chapterTitleEn="States of Matter"
            subjectHref="/dashboard/playground/v2?subject=chemistry"
          />
        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT SIDEBAR (AI Chemistry Tutor Drawer)       */}
        {/* ========================================================= */}
        {isRightSidebarOpen && (
          <aside className="w-80 shrink-0 rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4 animate-in slide-in-from-right duration-200 sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">
                    {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    {isBn ? 'অধ্যায় ২ বিশেষজ্ঞ' : 'Chapter 2 Specialist'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Transcript Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white ml-6 rounded-tr-xs'
                      : 'bg-muted/50 text-foreground mr-6 rounded-tl-xs border border-border/60'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {isAiLoading && (
                <div className="p-3 rounded-2xl bg-muted/40 text-muted-foreground text-xs animate-pulse">
                  {isBn ? 'উত্তরের বিশ্লেষণ তৈরি হচ্ছে...' : 'Formulating response...'}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="pt-2 border-t border-border/70 space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  placeholder={isBn ? 'ব্যাপন, নিঃসরণ বা কার্ভ নিয়ে প্রশ্ন করো...' : 'Ask about diffusion or curves...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  disabled={!chatInput.trim() || isAiLoading}
                  onClick={handleSendAiMessage}
                  className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
