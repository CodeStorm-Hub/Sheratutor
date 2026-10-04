'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PanelLeftClose, PanelLeftOpen,
  FlaskConical,
  Atom,
  Zap,
  Layers,
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
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
  Scale,
  RefreshCw,
  Droplets,
  Calculator,
  PieChart,
  Percent,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Common Substances for Mole Calculations
interface SubstanceData {
  formula: string;
  nameBn: string;
  nameEn: string;
  molarMass: number; // g/mol
  isGasSTP: boolean;
  elements: { symbol: string; count: number; atomicMass: number }[];
  crystalWaterCount?: number;
}

const SUBSTANCES: SubstanceData[] = [
  {
    formula: 'CO₂',
    nameBn: 'কার্বন ডাই-অক্সাইড',
    nameEn: 'Carbon Dioxide',
    molarMass: 44,
    isGasSTP: true,
    elements: [
      { symbol: 'C', count: 1, atomicMass: 12 },
      { symbol: 'O', count: 2, atomicMass: 16 },
    ],
  },
  {
    formula: 'O₂',
    nameBn: 'অক্সিজেন গ্যাস',
    nameEn: 'Oxygen Gas',
    molarMass: 32,
    isGasSTP: true,
    elements: [{ symbol: 'O', count: 2, atomicMass: 16 }],
  },
  {
    formula: 'H₂O',
    nameBn: 'পানি',
    nameEn: 'Water',
    molarMass: 18,
    isGasSTP: false,
    elements: [
      { symbol: 'H', count: 2, atomicMass: 1 },
      { symbol: 'O', count: 1, atomicMass: 16 },
    ],
  },
  {
    formula: 'Na₂CO₃',
    nameBn: 'সোডিয়াম কার্বনেট',
    nameEn: 'Sodium Carbonate',
    molarMass: 106,
    isGasSTP: false,
    elements: [
      { symbol: 'Na', count: 2, atomicMass: 23 },
      { symbol: 'C', count: 1, atomicMass: 12 },
      { symbol: 'O', count: 3, atomicMass: 16 },
    ],
  },
  {
    formula: 'NaCl',
    nameBn: 'সোডিয়াম ক্লোরাইড (খাবার লবণ)',
    nameEn: 'Sodium Chloride (Table Salt)',
    molarMass: 58.5,
    isGasSTP: false,
    elements: [
      { symbol: 'Na', count: 1, atomicMass: 23 },
      { symbol: 'Cl', count: 1, atomicMass: 35.5 },
    ],
  },
  {
    formula: 'CuSO₄·5H₂O',
    nameBn: 'তুঁতে / ব্লু ভিট্রিওল',
    nameEn: 'Blue Vitriol (Copper Sulfate Pentahydrate)',
    molarMass: 249.5,
    isGasSTP: false,
    crystalWaterCount: 5,
    elements: [
      { symbol: 'Cu', count: 1, atomicMass: 63.5 },
      { symbol: 'S', count: 1, atomicMass: 32 },
      { symbol: 'O', count: 4, atomicMass: 16 },
      { symbol: 'H₂O', count: 5, atomicMass: 18 },
    ],
  },
  {
    formula: 'C₆H₁₂O₆',
    nameBn: 'গ্লুকোজ',
    nameEn: 'Glucose',
    molarMass: 180,
    isGasSTP: false,
    elements: [
      { symbol: 'C', count: 6, atomicMass: 12 },
      { symbol: 'H', count: 12, atomicMass: 1 },
      { symbol: 'O', count: 6, atomicMass: 16 },
    ],
  },
];

// 5 Authentic Board MCQs
interface BoardMCQ {
  id: number;
  questionBn: string;
  questionEn: string;
  boardInfoBn: string;
  boardInfoEn: string;
  options: {
    key: string;
    textBn: string;
    textEn: string;
  }[];
  correctKey: string;
  explanationBn: string;
  explanationEn: string;
}

const BOARD_MCQS: BoardMCQ[] = [
  {
    id: 1,
    questionBn: 'প্রমাণ অবস্থায় (STP) ২ গ্রাম হাইড্রোজেন (H₂) গ্যাসের আয়তন কত?',
    questionEn: 'What is the volume of 2 g of hydrogen (H₂) gas at STP?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২২, রাজশাহী বোর্ড ২০২০',
    boardInfoEn: 'Dhaka Board 2022, Rajshahi Board 2020',
    options: [
      { key: 'A', textBn: '২.২৪ লিটার', textEn: '2.24 Liters' },
      { key: 'B', textBn: '১১.২ লিটার', textEn: '11.2 Liters' },
      { key: 'C', textBn: '২২.৪ লিটার', textEn: '22.4 Liters' },
      { key: 'D', textBn: '৪৪.৮ লিটার', textEn: '44.8 Liters' },
    ],
    correctKey: 'C',
    explanationBn:
      'H₂ এর আণবিক ভর M = ২ g/mol। সুতরাং ২ গ্রাম H₂ = ১ মোল। প্রমাণ অবস্থায় (STP) যেকোনো ১ মোল গ্যাসের মোলার আয়তন ২২.৪ লিটার।',
    explanationEn:
      'Molecular mass of H₂ is 2 g/mol. Thus 2 g = 1 mole. The standard molar volume of 1 mole of any ideal gas at STP is 22.4 L.',
  },
  {
    id: 2,
    questionBn: '২৫০ মিলিলিটার দ্রবণে ৫.৩ গ্রাম Na₂CO₃ থাকলে দ্রবণটির মোলারিটি কত?',
    questionEn: 'If 250 mL of solution contains 5.3 g Na₂CO₃, what is its molarity?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২৩, কুমিল্লা বোর্ড ২০২১',
    boardInfoEn: 'Dinajpur Board 2023, Cumilla Board 2021',
    options: [
      { key: 'A', textBn: '০.১ M (ডেসিমোলার)', textEn: '0.1 M (Decimolar)' },
      { key: 'B', textBn: '০.২ M', textEn: '0.2 M' },
      { key: 'C', textBn: '০.৫ M (সেমিমোলার)', textEn: '0.5 M (Semimolar)' },
      { key: 'D', textBn: '১.০ M (মোলার)', textEn: '1.0 M (Molar)' },
    ],
    correctKey: 'B',
    explanationBn:
      'সূত্র: S = (1000 × W) / (V × M) = (1000 × 5.3) / (250 × 106) = 5300 / 26500 = 0.2 M।',
    explanationEn:
      'Formula: S = (1000 × W) / (V × M) = (1000 × 5.3) / (250 × 106) = 0.2 M.',
  },
  {
    id: 3,
    questionBn: 'তুঁতে বা ব্লু ভিট্রিওলে (CuSO₄·5H₂O) কেলাস পানির শতকরা পরিমাণ কত?',
    questionEn: 'What is the percentage of crystal water in Blue Vitriol (CuSO₄·5H₂O)?',
    boardInfoBn: 'যশোর বোর্ড ২০২২, সিলেট বোর্ড ২০১৯',
    boardInfoEn: 'Jashore Board 2022, Sylhet Board 2019',
    options: [
      { key: 'A', textBn: '২৫.৪৫%', textEn: '25.45%' },
      { key: 'B', textBn: '৩৬.০৭%', textEn: '36.07%' },
      { key: 'C', textBn: '৪২.১০%', textEn: '42.10%' },
      { key: 'D', textBn: '৫০.০০%', textEn: '50.00%' },
    ],
    correctKey: 'B',
    explanationBn:
      'CuSO₄·5H₂O এর মোট আণবিক ভর = 63.5 + 32 + 64 + (5 × 18) = 249.5 g/mol। ৫ অণু কেলাস পানির ভর = ৯০ g। অতএব পানির শতকরা পরিমাণ = (৯০ / ২৪৯.৫) × ১০০% = ৩৬.০৭%।',
    explanationEn:
      'Total molecular mass = 249.5 g/mol. Mass of 5 water molecules = 5 × 18 = 90 g. Percentage = (90 / 249.5) × 100% = 36.07%.',
  },
  {
    id: 4,
    questionBn: '৫টি ম্যাগনেসিয়াম (Mg) পরমাণুর সাথে ৪টি অক্সিজেন (O₂) অণু বিক্রিয়া করলে লিমিটিং বিক্রিয়ক কোনটি?',
    questionEn: 'If 5 Mg atoms react with 4 O₂ molecules, which is the limiting reactant?',
    boardInfoBn: 'চট্টগ্রাম বোর্ড ২০২৩, বরিশাল বোর্ড ২০২০',
    boardInfoEn: 'Chattogram Board 2023, Barishal Board 2020',
    options: [
      { key: 'A', textBn: 'ম্যাগনেসিয়াম (Mg)', textEn: 'Magnesium (Mg)' },
      { key: 'B', textBn: 'অক্সিজেন (O₂)', textEn: 'Oxygen (O₂)' },
      { key: 'C', textBn: 'ম্যাগনেসিয়াম অক্সাইড (MgO)', textEn: 'Magnesium Oxide (MgO)' },
      { key: 'D', textBn: 'উভয়টি সমান', textEn: 'Both are in stoichiometric balance' },
    ],
    correctKey: 'A',
    explanationBn:
      'সমতাকৃত বিক্রিয়া: 2Mg + O₂ → 2MgO। এখানে ২টি Mg এর জন্য ১টি O₂ অণু প্রয়োজন। সুতরাং ৫টি Mg এর জন্য মাত্র ২.৫টি O₂ অণু দরকার। কিন্তু দেওয়া আছে ৪টি O₂। ফলে ম্যাগনেসিয়াম (Mg) আগে শেষ হয়ে যাবে এবং এটিই লিমিটিং বিক্রিয়ক।',
    explanationEn:
      'Stoichiometry: 2Mg + O₂ → 2MgO. 5 Mg requires 2.5 O₂ molecules. Given 4 O₂, Mg runs out first, making Mg the limiting reactant.',
  },
  {
    id: 5,
    questionBn: 'একটি যৌগে C ও H এর শতকরা সংযুতি যথাক্রমে ৯২.৩১% এবং ৭.৬৯%। যৌগটির স্থূল সংকেত (Empirical Formula) কোনটি?',
    questionEn: 'A compound has 92.31% C and 7.69% H. What is its empirical formula?',
    boardInfoBn: 'ময়মনসিংহ বোর্ড ২০২২, ঢাকা বোর্ড ২০২১',
    boardInfoEn: 'Mymensingh Board 2022, Dhaka Board 2021',
    options: [
      { key: 'A', textBn: 'CH', textEn: 'CH' },
      { key: 'B', textBn: 'CH₂', textEn: 'CH₂' },
      { key: 'C', textBn: 'CH₄', textEn: 'CH₄' },
      { key: 'D', textBn: 'C₂H₂', textEn: 'C₂H₂' },
    ],
    correctKey: 'A',
    explanationBn:
      'C এর পরমাণু অনুপাত = ৯২.৩১ / ১২ = ৭.৬৯; H এর পরমাণু অনুপাত = ৭.৬৯ / ১ = ৭.৬৯। ক্ষুদ্রতম সংখ্যা ৭.৬৯ দিয়ে উভয়কে ভাগ করলে C : H = ১ : ১ হয়। অতএব স্থূল সংকেত CH।',
    explanationEn:
      'Moles: C = 92.31/12 = 7.69, H = 7.69/1 = 7.69. Dividing by 7.69 gives ratio C:H = 1:1, so empirical formula is CH.',
  },
];

export interface LessonMeta {
  no: string;
  titleBn: string;
  titleEn: string;
  overviewBn: string;
  overviewEn: string;
  studyTipBn: string;
  studyTipEn: string;
  badgeText: string;
}

export const CHAPTER_6_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "মোলের ধারণা ও অ্যাভোগাড্রো সংখ্যা",
    titleEn: "Concept of Mole & Avogadro Constant",
    overviewBn: "রাসায়নিক পদার্থের পরিমাপের একক মোল, অ্যাভোগাড্রো সংখ্যা (৬.০২৩ × ১০²³) এবং ভর-মোল রূপান্তর সূত্র।",
    overviewEn: "The mole as a chemical counting unit, Avogadro constant 6.023x10^23, and n = W/M calculations.",
    studyTipBn: "মনে রাখবে: ১ মোল যেকোনো পদার্থে ঠিক ৬.০২৩ × ১০²³ টি অণু, পরমাণু বা আয়ন বিদ্যমান থাকে!",
    studyTipEn: "1 mole of any chemical entity contains exactly 6.023 × 10²³ particles!",
    badgeText: "মোল ও অ্যাভোগাড্রো সংখ্যা",
  },
  2: {
    no: "০২",
    titleBn: "মোলার আয়তন ও প্রমাণ অবস্থা (STP)",
    titleEn: "Molar Volume at Standard Temperature & Pressure",
    overviewBn: "০°C ও ১ বায়ুমণ্ডলীয় চাপে যেকোনো ১ মোল গ্যাসের মোলার আয়তন ২২.৪ লিটার এবং n = V / ২২.৪ সূত্র।",
    overviewEn: "Standard molar volume of 22.4 L for any gas at STP and volume-mole mathematical conversions.",
    studyTipBn: "এসটিপিতে ১ মোল যেকোনো গ্যাসের আয়তন ২২.৪ লিটার (dm³); কক্ষ তাপমাত্রায় (২৫°C) তা ২৪.৭৮৯ লিটার!",
    studyTipEn: "Molar volume of any ideal gas at STP (0°C, 1 atm) is precisely 22.4 liters!",
    badgeText: "এসটিপিতে ২২.৪ লিটার",
  },
  3: {
    no: "০৩",
    titleBn: "মোলারিটি ও প্রমাণ দ্রবণ প্রস্তুতি ল্যাব",
    titleEn: "Molarity & Standard Solution Preparation Lab",
    overviewBn: "মোলার দ্রবণ, ডেসিমোলার (০.১ M), সেমিমোলার (০.৫ M) এবং W = (S × M × V) / ১০০০ সূত্র প্রয়োগ।",
    overviewEn: "Molarity calculations, standard volumetric flask preparations using W = SMV / 1000 formula.",
    studyTipBn: "দ্রবণের আয়তন V মিলিলিটারে (mL) থাকলে সূত্রে নিচে ১০০০ দিয়ে ভাগ দিতে ভুলবে না!",
    studyTipEn: "When solution volume V is in mL, always divide by 1000 in the W = SMV / 1000 formula!",
    badgeText: "মোলারিটি W = SMV / ১০০০",
  },
  4: {
    no: "০৪",
    titleBn: "শতকরা সংযুতি ও স্থূল/আণবিক সংকেত",
    titleEn: "Percentage Composition & Empirical Formula",
    overviewBn: "যৌগে মৌলের শতকরা সংযুতি নির্ণয় এবং পারমাণবিক ভর দিয়ে ভাগ করে স্থূল ও আণবিক সংকেত প্রতিষ্ঠা।",
    overviewEn: "Calculating percent elemental mass and deriving empirical and molecular chemical formulas.",
    studyTipBn: "শতকরা সংযুতিকে পারমাণবিক ভর দিয়ে ভাগ করে ক্ষুদ্রতম সংখ্যা দিয়ে ভাগ করলে পূর্ণসংখ্যার অনুপাত মেলে!",
    studyTipEn: "Divide percentages by atomic masses, then normalize by the smallest integer quotient!",
    badgeText: "স্থূল ও আণবিক সংকেত",
  },
  5: {
    no: "০৫",
    titleBn: "লিমিটিং বিক্রিয়ক ও উৎপাদের শতকরা পরিমাণ",
    titleEn: "Limiting Reactant & Percentage Yield Lab",
    overviewBn: "বিক্রিয়ায় যে পদার্থ আগে শেষ হয়ে যায় (লিমিটিং বিক্রিয়ক) এবং প্রত্যাশিত বনাম বাস্তব উৎপাদের শতকরা হার।",
    overviewEn: "Stoichiometric limiting reagent identification and theoretical vs empirical percentage yield.",
    studyTipBn: "বিক্রিয়ায় উৎপাদের পরিমাণ সর্বদা লিমিটিং বিক্রিয়কের পরিমাণের ওপর নির্ভর করে নির্ধারিত হয়!",
    studyTipEn: "The theoretical yield of product is governed strictly by the limiting reactant!",
    badgeText: "লিমিটিং বিক্রিয়ক ল্যাব",
  },
};

export function MoleCalculationsGuidebook() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Navigation State
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);

  // Alias for backward compatibility with existing step tabs
  const currentStep = activeStep;
  const setCurrentStep = setActiveStep;

  // AI Chat Drawer State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: isBn
        ? 'স্বাগতম মোলের ধারণা ও রাসায়নিক গণনা ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Concept of Mole & Calculations Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_6_LESSONS[activeLesson] || CHAPTER_6_LESSONS[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

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
          chapter: '6 - মোলের ধারণা ও রাসায়নিক গণনা (Concept of Mole & Calculations)',
          context: `বর্তমান পাঠ: ${activeLesson}, ধাপ: ${activeStep}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: data.response || data.message || (isBn ? 'উত্তর প্রস্তুত করা হয়েছে!' : 'Answer ready!'),
          },
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { role: 'ai', text: isBn ? 'মোল হলো পদার্থের পরিমাণের আন্তর্জাতিক একক। ১ মোল = ৬.০২৩ × ১০²³ টি কণা = গ্রাম আণবিক ভর = এসটিপিতে ২২.৪ লিটার গ্যাস।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ৬: মোলের ধারণা ও রাসায়নিক গণনা (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. মোলের ৪-মুখী মাস্টার সূত্র:\n   - n = W / M (ভর ও আণবিক ভর)\n   - n = N / N_A (কণা সংখ্যা ও ৬.০২৩ × ১০²³)\n   - n = V / ২২.৪ (এসটিপিতে গ্যাসের আয়তন লিটারে)\n   - n = S × V (মোলারিটি ও আয়তন লিটারে)\n২. দ্রবণ প্রস্তুতি:\n   - W = (S × M × V) / ১০০০ (যেখানে V মিলিলিটারে)\n   - মোলার দ্রবণ = ১ M; সেমিমোলার = ০.৫ M; ডেসিমোলার = ০.১ M।\n৩. লিমিটিং বিক্রিয়ক:\n   - যে বিক্রিয়ক বিক্রিয়া চলাকালীন সম্পূর্ণরূপে নিঃশেষিত হয়ে যায়।`
      : `SSC Chemistry Chapter 6: Concept of Mole & Calculations Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1 State: The 4-Way Mole Wheel
  const [selectedSubstanceIndex, setSelectedSubstanceIndex] = useState<number>(0); // CO2
  const [moleInput, setMoleInput] = useState<number>(1.5);

  // Simulator 2 State: Volumetric Flask Molarity Lab
  const [flaskSolute, setFlaskSolute] = useState<'Na2CO3' | 'NaCl' | 'NaOH'>('Na2CO3');
  const [flaskVolumeMl, setFlaskVolumeMl] = useState<number>(250);
  const [targetMolarity, setTargetMolarity] = useState<number>(0.1);

  // Simulator 3 State: Limiting Reactant Lab
  const [mgMassG, setMgMassG] = useState<number>(12); // 12g Mg (0.5 mol)
  const [o2MassG, setO2MassG] = useState<number>(16); // 16g O2 (0.5 mol O2 = 1 mol O atoms)

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // CQ Rubric Accordion
  const [openRubric, setOpenRubric] = useState<string | null>('c');

  const currentSub = SUBSTANCES[selectedSubstanceIndex];

  // Simulator 1 Calculated values
  const computedMassG = (moleInput * currentSub.molarMass).toFixed(2);
  const computedMolecules = (moleInput * 6.023).toFixed(3);
  const computedVolumeL = currentSub.isGasSTP ? (moleInput * 22.4).toFixed(2) : null;

  // Simulator 2 Calculation: W = (S * V * M) / 1000
  const getFlaskMolarMass = () => {
    if (flaskSolute === 'Na2CO3') return 106;
    if (flaskSolute === 'NaCl') return 58.5;
    return 40; // NaOH
  };
  const requiredGrams = (
    (targetMolarity * flaskVolumeMl * getFlaskMolarMass()) /
    1000
  ).toFixed(3);

  // Simulator 3 Calculation: 2Mg + O2 -> 2MgO
  // 48g Mg needs 32g O2
  const requiredO2ForGivenMg = (mgMassG * 32) / 48;
  const isMgLimiting = o2MassG >= requiredO2ForGivenMg;
  const limitingReactantName = isMgLimiting ? 'ম্যাগনেসিয়াম (Mg)' : 'অক্সিজেন (O₂)';
  const formedMgoMass = isMgLimiting
    ? ((mgMassG * 80) / 48).toFixed(2)
    : ((o2MassG * 80) / 32).toFixed(2);
  const excessGrams = isMgLimiting
    ? (o2MassG - requiredO2ForGivenMg).toFixed(2)
    : (mgMassG - (o2MassG * 48) / 32).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-emerald-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={6}
        chapterTitleBn="মোলের ধারণা ও রাসায়নিক গণনা"
        chapterTitleEn="Concept of Mole & Calculations"
        activeLesson={activeLesson}
        activeLessonTitle={isBn ? currentLessonMeta.titleBn : currentLessonMeta.titleEn}
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
            {/* Subject Selector Pill Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'শ্রেণি ও বিষয়' : 'Grade & Subject'}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
                  <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    CHAPTER 06
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'মোলের ধারণা ও রাসায়নিক গণনা' : 'Concept of Mole & Calculations'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = CHAPTER_6_LESSONS[lNum];
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
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
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
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
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
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
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
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় 6 (পৃষ্ঠা ১১৪ - ১৪৫) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 6 (Printed pp. ১১৪ - ১৪৫) aligned with NCTB syllabus.'}
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
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                  <Calculator className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 06 • পাঠ ${currentLessonMeta.no}` : `Chapter 06 • Lesson ${activeLesson}`}
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
                { key: 'example', labelBn: '২. board CQ', labelEn: '2. Board CQ', icon: Award },
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
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
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

          {/* STEP 1: মূল ধারণা (CONCEPT) */}
      {/* ========================================================= */}
      {currentStep === 'concept' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 6.1: Mole & Avogadro's Number */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৬.১ মোল ও অ্যাভোগাড্রো সংখ্যা (Avogadro’s Number)'
                    : '6.1 The Mole Concept & Avogadro’s Number'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'রাসায়নিক পদার্থ পরিমাপের আন্তর্জাতিক এসআই একক: ১ মোল = ৬.০২৩ × ১০²³ কণা'
                    : 'SI unit of amount of substance: 1 mole = 6.023 × 10²³ particles'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Definition */}
              <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                  সংজ্ঞা
                </div>
                <h3 className="text-sm font-bold text-foreground">মোল কাকে বলে?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  রাসায়নিক পদার্থের পারমাণবিক ভর বা আণবিক ভরকে <strong>গ্রাম এককে</strong> প্রকাশ করলে যে পরিমাণ পাওয়া যায়, তাকে ঐ পদার্থের <strong>১ মোল</strong> বলে।
                </p>
                <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono text-foreground space-y-1">
                  <p>C এর ১ মোল = ১২ গ্রাম</p>
                  <p>H₂O এর ১ মোল = ১৮ গ্রাম</p>
                  <p>CO₂ এর ১ মোল = ৪৪ গ্রাম</p>
                </div>
              </div>

              {/* Avogadro's Number */}
              <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                  অ্যাভোগাড্রো ধ্রুবক (Nₐ)
                </div>
                <h3 className="text-sm font-bold text-foreground">৬.০২৩ × ১০²³ কণা</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  যেকোনো পদার্থের ১ মোলে নির্দিষ্ট সংখ্যক কণা (পরমাণু, অণু বা আয়ন) বিদ্যমান থাকে। এই বিশাল সংখ্যাটিকে <strong>অ্যাভোগাড্রো সংখ্যা</strong> বলে।
                </p>
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-xs font-mono text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                  Nₐ = 6.023 × 10²³
                  <br />
                  ১ মোল H₂O তে অণু = ৬.০২৩ × ১০²³
                </div>
              </div>

              {/* Molar Volume */}
              <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                  প্রমাণ অবস্থায় আয়তন (STP)
                </div>
                <h3 className="text-sm font-bold text-foreground">মোলার আয়তন = ২২.৪ লিটার</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  প্রমাণ তাপমাত্রা ও চাপে (STP: 0°C ও 1 atm) যেকোনো গ্যাসের <strong>১ মোলের আয়তন ২২.৪ লিটার</strong> (বা ২২.৪ dm³)।
                </p>
                <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono text-foreground">
                  ১ মোল O₂ = ২২.৪ L (STP তে)
                  <br />
                  ১ মোল CO₂ = ২২.৪ L (STP তে)
                </div>
              </div>
            </div>

            {/* The Master Formula Ribbon */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200">
              <strong className="block text-sm mb-1 text-emerald-700 dark:text-emerald-300">
                মোল গণনার সার্বজনীন ৪-মুখী মাস্টার সমীকরণ:
              </strong>
              <div className="font-mono text-center text-sm sm:text-base py-2 font-bold text-foreground bg-background/80 rounded-xl border border-border/60">
                <RenderMathText text="n = \frac{W}{M} = \frac{N}{6.023 \times 10^{23}} = \frac{V}{22.4 \text{ L (STP)}} = S \times V_{(\text{L})}" />
              </div>
            </div>
          </div>

          {/* Section 6.2: Molarity & Solution Preparation */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৬.২ মোলারিটি ও নির্দিষ্ট ঘনমাত্রার দ্রবণ প্রস্তুতি'
                    : '6.2 Molarity & Preparing Standard Solutions'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'এনসিটিবি পৃষ্ঠা ১১৫-১১৯: মোলার, সেমিমোলার ও ডেসিমোলার দ্রবণ এবং W = (S × V × M) / ১০০০ সূত্র'
                    : 'NCTB pp. 115-119: Molar, semimolar, decimolar solutions and W = SVM / 1000'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Definition of Molarity */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">মোলারিটি (Molarity - S)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  একটি নির্দিষ্ট তাপমাত্রায় <strong>১ লিটার (১০০০ mL)</strong> দ্রবণে যত মোল দ্রব দ্রবীভূত থাকে, তাকে ঐ দ্রবণের <strong>মোলারিটি</strong> বলে। এর একক হলো mol/L বা সংক্ষেপে M।
                </p>
                <ul className="text-xs text-muted-foreground space-y-1.5 pt-1">
                  <li>• <strong>মোলার দ্রবণ (Molar):</strong> ঘনমাত্রা ১.০ M (১ লিটারে ১ মোল দ্রব)।</li>
                  <li>• <strong>সেমিমোলার দ্রবণ (Semimolar):</strong> ঘনমাত্রা ০.৫ M।</li>
                  <li>• <strong>ডেসিমোলার দ্রবণ (Decimolar):</strong> ঘনমাত্রা ০.১ M।</li>
                  <li>• <strong>সেন্টিমোলার দ্রবণ (Centimolar):</strong> ঘনমাত্রা ০.০১ M।</li>
                </ul>
              </div>

              {/* The Molarity Formula */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">ল্যাব দ্রবণ তৈরির মাস্টার সূত্র</h3>
                <div className="p-3 rounded-xl bg-muted/40 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="W = \frac{S \times V \times M}{1000}" />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>W</strong> = প্রয়োজনীয় দ্রবের ভর (গ্রামে)</p>
                  <p>• <strong>S</strong> = কাঙ্ক্ষিত মোলার ঘনমাত্রা (M বা mol/L)</p>
                  <p>• <strong>V</strong> = আয়তনিক ফ্লাস্কের আয়তন (mL-এ)</p>
                  <p>• <strong>M</strong> = দ্রবের আণবিক ভর (g/mol)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6.3 & 6.4: Percent Composition, Empirical & Limiting Reactant */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Percent className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৬.৩ শতকরা সংযুতি, স্থূল সংকেত ও লিমিটিং বিক্রিয়ক'
                    : '6.3 Percent Composition, Empirical Formula & Limiting Reactants'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'রাসায়নিক বিক্রিয়ার সমতাকরণ ও বিক্রিয়কের ঘাটতি-উদ্বৃত্ত বিশ্লেষণ'
                    : 'Stoichiometric balancing and identifying reaction bottlenecks'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Percentage Composition */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2">
                <h3 className="text-sm font-bold text-foreground">মৌলের শতকরা সংযুতি</h3>
                <p className="text-xs text-muted-foreground">
                  যৌগের ১০০ গ্রামের মধ্যে কোনো মৌল যত গ্রাম থাকে।
                </p>
                <div className="p-2.5 rounded-xl bg-muted/40 font-mono text-[11px] text-foreground">
                  <RenderMathText text="\text{\% সংযুতি} = \frac{\text{পারমাণবিক ভর} \times \text{সংখ্যা}}{\text{আণবিক ভর}} \times 100\%" />
                </div>
              </div>

              {/* Empirical Formula */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2">
                <h3 className="text-sm font-bold text-foreground">স্থূল বনাম আণবিক সংকেত</h3>
                <p className="text-xs text-muted-foreground">
                  পরমাণুগুলোর ক্ষুদ্রতম পূর্ণসংখ্যার অনুপাত হলো স্থূল সংকেত।
                </p>
                <div className="p-2.5 rounded-xl bg-muted/40 font-mono text-[11px] text-foreground">
                  গ্লুকোজ: আণবিক C₆H₁₂O₆
                  <br />
                  স্থূল সংকেত = CH₂O (n = 6)
                </div>
              </div>

              {/* Limiting Reactant */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2">
                <h3 className="text-sm font-bold text-foreground">লিমিটিং বিক্রিয়ক</h3>
                <p className="text-xs text-muted-foreground">
                  যে বিক্রিয়কটি বিক্রিয়ায় প্রথমে নিঃশেষ হয়ে যায় এবং উৎপাদের মোট পরিমাণ নির্ধারণ করে।
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] border border-emerald-500/20">
                  2Mg + O₂ → 2MgO
                  <br />
                  Mg কম থাকলে Mg-ই লিমিটিং!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: উদাহরণ ও সমস্যা সমাধান (WORKED EXAMPLES) */}
      {/* ========================================================= */}
      {currentStep === 'example' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? 'বোর্ড ভিত্তিক গাণিতিক সমস্যা সমাধান'
                    : 'Board-Standard Mathematical Worked Problems'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'এনসিটিবি পাঠ্যবই ও বিগত এসএসসি বোর্ড পরীক্ষার গাণিতিক প্রশ্নের সম্পূর্ণ সমাধান'
                    : 'Full step-by-step mathematical solutions for past board questions'}
                </p>
              </div>
            </div>

            {/* Problem 1 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">সমস্যা ০১ (মোলারিটি ও দ্রবণ প্রস্তুত)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  ৩ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                ২৫০ মিলিলিটার আয়তনিক ফ্লাস্কে ০.১ মোলার (ডেসিমোলার) Na₂CO₃ দ্রবণ প্রস্তুত করতে কত গ্রাম সোডিয়াম কার্বনেট প্রয়োজন হবে?
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-1.5 text-foreground">
                  <p>আমরা জানি, W = (S × V × M) / 1000</p>
                  <p>এখানে,</p>
                  <p>• দ্রবণের আয়তন, V = 250 mL</p>
                  <p>• দ্রবণের কাঙ্ক্ষিত ঘনমাত্রা, S = 0.1 M</p>
                  <p>• Na₂CO₃ এর আণবিক ভর, M = (23 × 2) + 12 + (16 × 3) = 46 + 12 + 48 = 106 g/mol</p>
                  <div className="border-t border-border/60 my-1" />
                  <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                    অতএব দ্রবের ভর, W = (0.1 × 250 × 106) / 1000 = 2650 / 1000 = ২.৬৫ গ্রাম।
                  </p>
                </div>
                <p className="text-xs">
                  <strong>ল্যাব পদ্ধতি:</strong> ডিজিটাল ব্যালেন্সে মেপে ২.৬৫ গ্রাম Na₂CO₃ নিয়ে ২৫০ mL আয়তনিক ফ্লাস্কে পাতিত পানি যোগ করে দাগ পর্যন্ত পূর্ণ করলে ০.১ M ডেসিমোলার দ্রবণ তৈরি হবে।
                </p>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">সমস্যা ০২ (লিমিটিং বিক্রিয়ক ও উৎপাদ গণনা)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  ৪ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                ৫ গ্রাম হাইড্রোজেন (H₂) গ্যাসের সাথে ৩৫ গ্রাম অক্সিজেন (O₂) মিশ্রিত করে পানি প্রস্তুত করা হলো। কোনটি লিমিটিং বিক্রিয়ক এবং কত গ্রাম পানি উৎপন্ন হবে?
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <p>সমতাকৃত রাসায়নিক বিক্রিয়া: <RenderMathText text="2\text{H}_2 + \text{O}_2 \rightarrow 2\text{H}_2\text{O}" /></p>
                <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-1 text-foreground">
                  <p>বিক্রিয়কের ভর অনুপাত:</p>
                  <p>2H₂ = 2 × 2 = 4 g</p>
                  <p>O₂ = 32 g</p>
                  <p>2H₂O = 2 × 18 = 36 g</p>
                </div>
                <p>
                  বিক্রিয়া অনুযায়ী ৪ গ্রাম H₂ এর সাথে বিক্রিয়া করে ৩২ গ্রাম O₂।
                  <br />
                  অতএব ৫ গ্রাম H₂ এর সাথে বিক্রিয়া করতে প্রয়োজন: (৩২ × ৫) / ৪ = <strong>৪০ গ্রাম O₂</strong>।
                </p>
                <p>
                  কিন্তু পাত্রে অক্সিজেন সরবরাহ করা হয়েছে মাত্র ৩৫ গ্রাম (৪০ গ্রামের চেয়ে কম)।
                  <br />
                  <strong className="text-emerald-700 dark:text-emerald-300">
                    অতএব অক্সিজেন (O₂) হলো লিমিটিং বিক্রিয়ক!
                  </strong>
                </p>
                <p>
                  উৎপন্ন পানির পরিমাণ লিমিটিং বিক্রিয়ক O₂ দ্বারা নির্ধারিত হবে:
                  <br />
                  ৩২ গ্রাম O₂ থেকে পানি তৈরি হয় ৩৬ গ্রাম।
                  <br />
                  অতএব ৩৫ গ্রাম O₂ থেকে পানি তৈরি হবে = (৩৬ × ৩৫) / ৩২ = <strong>৩৯.৩৮ গ্রাম H₂O</strong>।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: ইন্টারেক্টিভ সিমুলেটর ও ল্যাব (TRY IT YOURSELF) */}
      {/* ========================================================= */}
      {currentStep === 'try' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* SIMULATOR 1: The 4-Way Mole Machine */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-500" />
                  {isBn
                    ? '১. চারমুখী মোল কনভার্টার চাকা (The 4-Way Mole Wheel)'
                    : '1. The 4-Way Interactive Mole Machine'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'যেকোনো পদার্থ সিলেক্ট করে মোল সংখ্যা পরিবর্তন করো; ভর, অণু সংখ্যা ও আয়তন স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।'
                    : 'Adjust moles to instantly observe mass (W), molecules (N), and STP gas volume (V).'}
                </p>
              </div>

              {/* Substance Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {SUBSTANCES.map((s, idx) => (
                  <button
                    key={s.formula}
                    onClick={() => setSelectedSubstanceIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedSubstanceIndex === idx
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {s.formula}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider & Visual Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">মোল সংখ্যা (n):</span>
                    <span className="text-lg font-mono font-black text-emerald-600">
                      {moleInput} mol
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={5.0}
                    step={0.1}
                    value={moleInput}
                    onChange={(e) => setMoleInput(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>০.১ মোল</span>
                    <span>২.৫ মোল</span>
                    <span>৫.০ মোল</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs">
                  <span className="text-muted-foreground">নির্বাচিত পদার্থ: </span>
                  <strong className="text-foreground">
                    {isBn ? currentSub.nameBn : currentSub.nameEn} ({currentSub.formula})
                  </strong>
                  <br />
                  <span className="text-muted-foreground">আণবিক ভর (M): </span>
                  <strong className="font-mono text-emerald-600">{currentSub.molarMass} g/mol</strong>
                </div>
              </div>

              {/* 3 Outcome Display Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mass W */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
                    ভর (W = n × M)
                  </span>
                  <span className="text-xl font-mono font-black text-emerald-700 dark:text-emerald-300">
                    {computedMassG} g
                  </span>
                  <span className="text-[9px] text-muted-foreground block">গ্রাম এককে</span>
                </div>

                {/* Particle Count N */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-300 block">
                    অণু সংখ্যা (N)
                  </span>
                  <span className="text-sm font-mono font-black text-cyan-700 dark:text-cyan-300 block pt-1">
                    {computedMolecules}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono block">× ১০²³ টি অণু</span>
                </div>

                {/* STP Volume */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 block">
                    STP আয়তন (V)
                  </span>
                  <span className="text-xl font-mono font-black text-amber-700 dark:text-amber-300">
                    {computedVolumeL ? `${computedVolumeL} L` : 'N/A'}
                  </span>
                  <span className="text-[9px] text-muted-foreground block">
                    {computedVolumeL ? '২২.৪ লিটার স্কেল' : 'তরল/কঠিন'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR 2: Volumetric Flask Molarity Solution Mixer */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-emerald-500" />
                  {isBn
                    ? '২. আয়তনিক ফ্লাস্কে মোলার দ্রবণ প্রস্তুতি ল্যাব'
                    : '2. Volumetric Flask Solution Preparation Lab'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'W = (S × V × M) / ১০০০ সূত্র ব্যবহার করে দ্রবের কাঙ্ক্ষিত ভর ও ব্যালেন্স স্কেল রিডিং দেখো।'
                    : 'Calculate exact grams needed on the digital balance to prepare a targeted molar solution.'}
                </p>
              </div>

              {/* Solute Select */}
              <div className="flex gap-2">
                {(['Na2CO3', 'NaCl', 'NaOH'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFlaskSolute(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      flaskSolute === s
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {s === 'Na2CO3' ? 'Na₂CO₃ (106)' : s === 'NaCl' ? 'NaCl (58.5)' : 'NaOH (40)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Sliders */}
              <div className="space-y-4">
                {/* Volume Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">ফ্লাস্কের আয়তন (V):</span>
                    <span className="font-mono font-black text-emerald-600">{flaskVolumeMl} mL</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={1000}
                    step={50}
                    value={flaskVolumeMl}
                    onChange={(e) => setFlaskVolumeMl(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Molarity Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">কাঙ্ক্ষিত ঘনমাত্রা (S):</span>
                    <span className="font-mono font-black text-emerald-600">{targetMolarity} M</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={1.0}
                    step={0.05}
                    value={targetMolarity}
                    onChange={(e) => setTargetMolarity(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex gap-2 pt-1">
                    {[
                      { s: 0.1, label: 'ডেসিমোলার (০.১ M)' },
                      { s: 0.5, label: 'সেমিমোলার (০.৫ M)' },
                      { s: 1.0, label: 'মোলার (১.০ M)' },
                    ].map((btn) => (
                      <button
                        key={btn.s}
                        onClick={() => setTargetMolarity(btn.s)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted hover:bg-muted/80 text-muted-foreground"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Digital Balance Scale Simulation Box */}
              <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900 text-white space-y-4 text-center">
                <span className="text-xs uppercase font-mono text-emerald-400 font-bold block">
                  ডিজিটাল নিক্তির রিডিং (Weighing Balance)
                </span>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 inline-block px-8">
                  <span className="text-3xl font-mono font-black text-emerald-400">
                    {requiredGrams} g
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <p>
                    W = ({targetMolarity} × {flaskVolumeMl} × {getFlaskMolarMass()}) / 1000
                  </p>
                  <p className="text-emerald-400 font-bold">
                    = {requiredGrams} গ্রাম {flaskSolute} মেপে ফ্লাস্কে যোগ করো
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR 3: Limiting Reactant Lab (2Mg + O2 -> 2MgO) */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-500" />
                {isBn
                  ? '৩. লিমিটিং বিক্রিয়ক ও উৎপাদ ক্যালকুলেটর (2Mg + O₂ → 2MgO)'
                  : '3. Limiting Reactant & Theoretical Yield Simulator'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBn
                  ? 'ম্যাগনেসিয়াম ও অক্সিজেনের ভর পরিবর্তন করে দেখো কোনটি আগে শেষ হয়ে যায় এবং কত গ্রাম MgO উৎপন্ন হয়।'
                  : 'Adjust input grams of Mg and O₂ to identify the bottleneck reactant and excess left over.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Reactant Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">ম্যাগনেসিয়াম (Mg) এর ভর:</span>
                    <span className="font-mono font-black text-emerald-600">{mgMassG} g</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={48}
                    step={2}
                    value={mgMassG}
                    onChange={(e) => setMgMassG(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">অক্সিজেন (O₂) এর ভর:</span>
                    <span className="font-mono font-black text-cyan-600">{o2MassG} g</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={48}
                    step={2}
                    value={o2MassG}
                    onChange={(e) => setO2MassG(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Reaction Outcome Box */}
              <div className="p-5 rounded-2xl border border-border/70 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">লিমিটিং বিক্রিয়ক:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-600 border border-rose-500/30">
                    ⚠️ {limitingReactantName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border/60 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">উৎপন্ন ম্যাগনেসিয়াম অক্সাইড (MgO):</span>
                    <strong className="text-emerald-600 text-sm font-mono">{formedMgoMass} g</strong>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-1">
                    <span className="text-muted-foreground">বিক্রিয়া শেষে উদ্বৃত্ত অবশিষ্টাংশ:</span>
                    <strong className="text-amber-600 text-sm font-mono">
                      {excessGrams} g {isMgLimiting ? 'O₂' : 'Mg'}
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  💡 <em>স্টয়কিওমেট্রি নিয়ম: ৪৮ গ্রাম Mg এর জন্য ৩২ গ্রাম O₂ আবশ্যক।</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: কুইজ ও আত্মযাচাই (CHECK UNDERSTANDING) */}
      {/* ========================================================= */}
      {currentStep === 'check' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-foreground">
                    {isBn
                      ? 'এসএসসি বোর্ড মানসম্মত ৫টি বহুনির্বাচনি প্রশ্ন (MCQ)'
                      : '5 Authentic SSC Board Standard MCQs'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isBn
                      ? 'বিগত বোর্ড পরীক্ষার গুরুত্বপূর্ণ গাণিতিক বহুনির্বাচনি প্রশ্নের স্বয়ংক্রিয় মূল্যায়ন'
                      : 'Past board exam questions with immediate automated evaluation'}
                  </p>
                </div>
              </div>

              {showResults && (
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setShowResults(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isBn ? 'পুনরায় পরীক্ষা দিন' : 'Retake Quiz'}</span>
                </button>
              )}
            </div>

            {/* MCQ List */}
            <div className="space-y-6">
              {BOARD_MCQS.map((q, idx) => {
                const selected = selectedAnswers[q.id];
                const isCorrect = selected === q.correctKey;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-border/70 bg-card space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        প্রশ্ন ০{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                        {isBn ? q.boardInfoBn : q.boardInfoEn}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground">
                      {isBn ? q.questionBn : q.questionEn}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt) => {
                        const isThisSelected = selected === opt.key;
                        let btnStyle = 'border-border/70 bg-muted/20 hover:bg-muted/40 text-foreground';

                        if (showResults) {
                          if (opt.key === q.correctKey) {
                            btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold';
                          } else if (isThisSelected) {
                            btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-300 font-bold';
                          }
                        } else if (isThisSelected) {
                          btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-bold';
                        }

                        return (
                          <button
                            key={opt.key}
                            onClick={() => {
                              if (!showResults) {
                                setSelectedAnswers({
                                  ...selectedAnswers,
                                  [q.id]: opt.key,
                                });
                              }
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              <strong className="mr-2">{opt.key}.</strong>
                              {isBn ? opt.textBn : opt.textEn}
                            </span>
                            {showResults && opt.key === q.correctKey && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            )}
                            {showResults && isThisSelected && opt.key !== q.correctKey && (
                              <X className="h-4 w-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground mt-2">
                        <strong className="text-foreground">সঠিক উত্তরের ব্যাখ্যা: </strong>
                        <span>{isBn ? q.explanationBn : q.explanationEn}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showResults && (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
              >
                {isBn ? 'উত্তর যাচাই করুন (Submit & Check Answers)' : 'Submit & Check Answers'}
              </button>
            )}

            {showResults && (
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-foreground">
                    আপনার মোট স্কোর:{' '}
                    {
                      BOARD_MCQS.filter((q) => selectedAnswers[q.id] === q.correctKey).length
                    }{' '}
                    / {BOARD_MCQS.length}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {BOARD_MCQS.filter((q) => selectedAnswers[q.id] === q.correctKey).length === 5
                      ? 'অসাধারণ! মোলের ধারণা ও গণনার সমস্ত নিয়ম তোমার আয়ত্তে।'
                      : 'সমাধানগুলো দেখে নিয়ে আরও একবার চর্চা করে নাও।'}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 5: সারসংক্ষেপ ও বোর্ড সৃজনশীল (SUMMARY & CQ RUBRIC) */}
      {/* ========================================================= */}
      {currentStep === 'summary' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 1: 10-Mark Board Creative Question */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? 'এসএসসি বোর্ড সৃজনশীল প্রশ্ন ও পূর্ণাঙ্গ মডেল উত্তর'
                    : 'SSC Board Creative Question (CQ) with Model Answers'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? '১+২+৩+৪ = মোট ১০ নম্বরের আদর্শ বোর্ড প্রশ্নের বিশ্লেষণ ও মূল্যায়নের নির্দেশিকা'
                    : 'Standard 10-mark board question rubric with step-by-step model breakdown'}
                </p>
              </div>
            </div>
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
              </button>

            {/* Stimulus */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <span className="text-xs font-bold text-emerald-600 block">উদ্দীপকটি লক্ষ্য করো:</span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                একটি গবেষণাগারে শিক্ষার্থীকে ২৫০ mL এর একটি আয়তনিক ফ্লাস্কে ০.১ M দ্রবণ প্রস্তুত করতে বলা হলো। টেবিলে শুষ্ক{' '}
                <strong>
                  <RenderMathText text="\text{Na}_2\text{CO}_3" />
                </strong>{' '}
                রাখা ছিল। অন্য একটি পাত্রে ১৬ গ্রাম ম্যাগনেসিয়াম (Mg) ধাতুর সাথে ২০ গ্রাম অক্সিজেন (O₂) মিশ্রিত করে দহন করা হলো।
              </p>
            </div>

            {/* 4 CQ Questions & Accordion Rubric */}
            <div className="space-y-3">
              {/* Question Ka */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'a' ? null : 'a')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600">
                      (ক) জ্ঞানমূলক [১]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">মোলার আয়তন কাকে বলে?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'a' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'a' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> ১ মোল পরিমাণ কোনো পদার্থের যে আয়তন, তাকে ঐ পদার্থের মোলার আয়তন বলে। প্রমাণ অবস্থায় (STP) যেকোনো গ্যাসের মোলার আয়তন ২২.৪ লিটার।
                    </p>
                  </div>
                )}
              </div>

              {/* Question Kha */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'b' ? null : 'b')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600">
                      (খ) অনুধাবনমূলক [২]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">সেমিমোলার দ্রবণ ও ডেসিমোলার দ্রবণের মধ্যে পার্থক্য কী?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'b' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'b' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1.5">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> নির্দিষ্ট তাপমাত্রায় ১ লিটার দ্রবণে যদি ০.৫ মোল দ্রব দ্রবীভূত থাকে, তবে সেই দ্রবণকে <strong>সেমিমোলার দ্রবণ</strong> বলে (ঘনমাত্রা ০.৫ M)।
                    </p>
                    <p>
                      পক্ষান্তরে, ১ লিটার দ্রবণে যদি ০.১ মোল দ্রব দ্রবীভূত থাকে, তবে সেই দ্রবণকে <strong>ডেসিমোলার দ্রবণ</strong> বলে (ঘনমাত্রা ০.১ M)। অতএব সেমিমোলার দ্রবণ ডেসিমোলার দ্রবণের চেয়ে ৫ গুণ বেশি ঘন।
                    </p>
                  </div>
                )}
              </div>

              {/* Question Ga */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'c' ? null : 'c')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600">
                      (গ) প্রয়োগমূলক [৩]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের ফ্লাস্কে ০.১ M দ্রবণ প্রস্তুত করতে কত গ্রাম Na₂CO₃ মেপে নিতে হবে? গণনা করো।
                    </h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'c' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'c' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-2">
                    <p>
                      <strong>মডেল উত্তর ও নম্বর বিভাজন:</strong>
                    </p>
                    <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-1 text-foreground">
                      <p>১. প্রয়োজনীয় তথ্য:</p>
                      <p>• দ্রবণের আয়তন, V = 250 mL</p>
                      <p>• মোলারিটি, S = 0.1 M</p>
                      <p>• Na₂CO₃ এর আণবিক ভর, M = (23 × 2) + 12 + (16 × 3) = 106 g/mol [১ নম্বর]</p>
                      <div className="border-t border-border/60 my-1" />
                      <p>২. সূত্র প্রয়োগ: W = (S × V × M) / 1000 [১ নম্বর]</p>
                      <p>৩. হিসাব: W = (0.1 × 250 × 106) / 1000 = 2650 / 1000 = ২.৬৫ গ্রাম। [১ নম্বর]</p>
                      <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                        অতএব, ফ্লাস্কে দ্রবণ তৈরি করতে ২.৬৫ গ্রাম Na₂CO₃ প্রয়োজন।
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Gha */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'd' ? null : 'd')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600">
                      (ঘ) উচ্চতর দক্ষতা [৪]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের দ্বিতীয় পাত্রের বিক্রিয়াটিতে কোনো বিক্রিয়ক উদ্বৃত্ত থাকবে কি? গাণিতিকভাবে বিশ্লেষণ করো।
                    </h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'd' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'd' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-2">
                    <p>
                      <strong>৪ নম্বরের পূর্ণাঙ্গ মডেল উত্তর:</strong>
                    </p>
                    <p>
                      ম্যাগনেসিয়াম ও অক্সিজেনের দহনের সমতাকৃত সমীকরণ:
                      <br />
                      <RenderMathText text="2\text{Mg} + \text{O}_2 \rightarrow 2\text{MgO}" />
                    </p>
                    <div className="bg-muted/40 p-3 rounded-xl font-mono text-foreground space-y-1">
                      <p>ভর অনুপাত: 2Mg = 2 × 24 = 48 g; O₂ = 32 g; 2MgO = 80 g</p>
                    </div>
                    <p>
                      সমীকরণ অনুযায়ী, ৪৮ গ্রাম Mg বিক্রিয়া করে ৩২ গ্রাম O₂ এর সাথে।
                      <br />
                      অতএব পাত্রে সরবরাহকৃত ১৬ গ্রাম Mg বিক্রিয়া করতে প্রয়োজন:
                      <br />
                      (৩২ × ১৬) / ৪৮ = <strong>১০.৬৭ গ্রাম O₂</strong>।
                    </p>
                    <p>
                      কিন্তু পাত্রে অক্সিজেন সরবরাহ করা হয়েছিল <strong>২০ গ্রাম</strong>।
                      <br />
                      যেহেতু ১০.৬৭ গ্রাম O₂ ব্যয় হওয়ার পর ম্যাগনেসিয়াম সম্পূর্ণ নিঃশেষ হয়ে যাবে, তাই ম্যাগনেসিয়াম (Mg) হলো লিমিটিং বিক্রিয়ক।
                    </p>
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">
                      উদ্বৃত্ত অক্সিজেনের পরিমাণ = সরবরাহকৃত ভর - ব্যবহৃত ভর = ২০ - ১০.৬৭ = ৯.৩৩ গ্রাম O₂ বিক্রিয়া না করে পাত্রে উদ্বৃত্ত থেকে যাবে।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Revision Checklist */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              {isBn ? 'অধ্যায় ০৬ রিভিশন চেকলিস্ট' : 'Chapter 06 Revision Checklist'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { labelBn: 'মোল ও অ্যাভোগাড্রো সংখ্যা (৬.০২৩ × ১০²³) সম্পর্ক', ok: true },
                { labelBn: 'STP তে মোলার আয়তন ২২.৪ লিটার নিয়ম', ok: true },
                { labelBn: 'দ্রব্যের ভর নির্ণয় সূত্র: W = (SVM) / ১০০০', ok: true },
                { labelBn: 'ডেসিমোলার (০.১ M) ও সেমিমোলার (০.৫ M) দ্রবণের সংজ্ঞা', ok: true },
                { labelBn: 'যৌগে মৌলের শতকরা সংযুতি নির্ণয় কৌশল', ok: true },
                { labelBn: 'শতকরা সংযুতি থেকে স্থূল ও আণবিক সংকেত বের করার ধাপ', ok: true },
                { labelBn: 'বিক্রিয়ায় লিমিটিং বিক্রিয়ক শনাক্তকরণ ও উদ্বৃত্ত ভর', ok: true },
                { labelBn: 'তুঁতেতে কেলাস পানির শতকরা পরিমাণ (৩৬.০৭%)', ok: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/20 border border-border/60 text-foreground"
                >
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{item.labelBn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Footer Step Navigation */}
            {/* 3. Footer Step Navigation */}
      <StepNavigationFooter
        currentStep={activeStep as StepKey}
        onStepChange={(step) => setActiveStep(step as LearningStep)}
        chapterNumberBn="অধ্যায় 06"
        chapterNumberEn="Chapter 06"
        chapterTitleBn="মোলের ধারণা ও রাসায়নিক গণনা"
        chapterTitleEn="Concept of Mole & Calculations"
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
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {isBn ? 'অধ্যায় 6 বিশেষজ্ঞ' : 'Chapter 6 Specialist'}
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
                  ? 'bg-emerald-600 text-white ml-6 rounded-tr-xs'
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
              placeholder={isBn ? 'মোলের ধারণা ও রাসায়নিক গণনা নিয়ে প্রশ্ন করো...' : 'Ask about Concept of Mole & Calculations...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-50 shrink-0"
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
