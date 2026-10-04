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
  TrendingUp,
  Flame,
  ArrowRight,
  ArrowLeftRight,
  Thermometer,
  Gauge,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Oxidation Number Target Compounds
interface OxidationTarget {
  formula: string;
  nameBn: string;
  nameEn: string;
  targetElementBn: string;
  targetElementEn: string;
  targetSymbol: string;
  targetOxidation: number;
  equationBn: string;
  equationEn: string;
}

const OXIDATION_TARGETS: OxidationTarget[] = [
  {
    formula: 'KMnO₄',
    nameBn: 'পটাশিয়াম পারম্যাঙ্গানেট',
    nameEn: 'Potassium Permanganate',
    targetElementBn: 'ম্যাঙ্গানিজ',
    targetElementEn: 'Manganese',
    targetSymbol: 'Mn',
    targetOxidation: 7,
    equationBn: '(+১) + x + ৪(-২) = ০ ⟹ x - ৭ = ০ ⟹ x = +৭',
    equationEn: '(+1) + x + 4(-2) = 0 ⟹ x - 7 = 0 ⟹ x = +7',
  },
  {
    formula: 'K₂Cr₂O₇',
    nameBn: 'পটাশিয়াম ডাইক্রোমেট',
    nameEn: 'Potassium Dichromate',
    targetElementBn: 'ক্রোমিয়াম',
    targetElementEn: 'Chromium',
    targetSymbol: 'Cr',
    targetOxidation: 6,
    equationBn: '২(+১) + ২x + ৭(-২) = ০ ⟹ ২ + ২x - ১৪ = ০ ⟹ ২x = ১২ ⟹ x = +৬',
    equationEn: '2(+1) + 2x + 7(-2) = 0 ⟹ 2x = 12 ⟹ x = +6',
  },
  {
    formula: 'H₂SO₄',
    nameBn: 'সালফিউরিক এসিড',
    nameEn: 'Sulfuric Acid',
    targetElementBn: 'সালফার',
    targetElementEn: 'Sulfur',
    targetSymbol: 'S',
    targetOxidation: 6,
    equationBn: '২(+১) + x + ৪(-২) = ০ ⟹ ২ + x - ৮ = ০ ⟹ x = +৬',
    equationEn: '2(+1) + x + 4(-2) = 0 ⟹ 2 + x - 8 = 0 ⟹ x = +6',
  },
  {
    formula: 'HNO₃',
    nameBn: 'নাইট্রিক এসিড',
    nameEn: 'Nitric Acid',
    targetElementBn: 'নাইট্রোজেন',
    targetElementEn: 'Nitrogen',
    targetSymbol: 'N',
    targetOxidation: 5,
    equationBn: '(+১) + x + ৩(-২) = ০ ⟹ ১ + x - ৬ = ০ ⟹ x = +৫',
    equationEn: '(+1) + x + 3(-2) = 0 ⟹ 1 + x - 6 = 0 ⟹ x = +5',
  },
  {
    formula: 'Na₂S₂O₃',
    nameBn: 'সোডিয়াম থায়োসালফেট',
    nameEn: 'Sodium Thiosulfate',
    targetElementBn: 'সালফার',
    targetElementEn: 'Sulfur',
    targetSymbol: 'S',
    targetOxidation: 2,
    equationBn: '২(+১) + ২x + ৩(-২) = ০ ⟹ ২ + ২x - ৬ = ০ ⟹ ২x = ৪ ⟹ x = +২',
    equationEn: '2(+1) + 2x + 3(-2) = 0 ⟹ 2x = 4 ⟹ x = +2',
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
    questionBn: 'KMnO₄ যৌগে ম্যাঙ্গানিজ (Mn) এর জারণ সংখ্যা (Oxidation Number) কত?',
    questionEn: 'What is the oxidation number of Manganese (Mn) in KMnO₄?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২৩, রাজশাহী বোর্ড ২০২১',
    boardInfoEn: 'Dhaka Board 2023, Rajshahi Board 2021',
    options: [
      { key: 'A', textBn: '+২', textEn: '+2' },
      { key: 'B', textBn: '+৪', textEn: '+4' },
      { key: 'C', textBn: '+৬', textEn: '+6' },
      { key: 'D', textBn: '+৭', textEn: '+7' },
    ],
    correctKey: 'D',
    explanationBn:
      'K এর জারণ সংখ্যা +১ এবং প্রতিটি O এর জারণ সংখ্যা -২। সামগ্রিক নিরপেক্ষ যৌগে: (+১) + x + ৪(-২) = ০ ⟹ x - ৭ = ০ ⟹ x = +৭।',
    explanationEn:
      'Sum of oxidation states in neutral molecule is 0: (+1) + x + 4(-2) = 0 ⟹ x = +7.',
  },
  {
    id: 2,
    questionBn: 'নিচের কোনটি নন-রেডক্স (Non-Redox) বিক্রিয়া?',
    questionEn: 'Which of the following is a non-redox reaction?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২২, চট্টগ্রাম বোর্ড ২০২০',
    boardInfoEn: 'Dinajpur Board 2022, Chattogram Board 2020',
    options: [
      { key: 'A', textBn: '2Mg + O₂ → 2MgO', textEn: '2Mg + O₂ → 2MgO' },
      { key: 'B', textBn: 'Zn + CuSO₄ → ZnSO₄ + Cu', textEn: 'Zn + CuSO₄ → ZnSO₄ + Cu' },
      { key: 'C', textBn: 'HCl + NaOH → NaCl + H₂O', textEn: 'HCl + NaOH → NaCl + H₂O' },
      { key: 'D', textBn: 'CH₄ + 2O₂ → CO₂ + 2H₂O', textEn: 'CH₄ + 2O₂ → CO₂ + 2H₂O' },
    ],
    correctKey: 'C',
    explanationBn:
      'HCl + NaOH → NaCl + H₂O একটি এসিড-ক্ষার প্রশমন বিক্রিয়া। এখানে কোনো মৌলের জারণ সংখ্যার পরিবর্তন হয় না (H=+1, Cl=-1, Na=+1, O=-2)। কোনো ইলেকট্রন স্থানান্তর ঘটে না, তাই এটি নন-রেডক্স।',
    explanationEn:
      'Acid-base neutralization involves no transfer of electrons; oxidation states of all elements remain unchanged throughout.',
  },
  {
    id: 3,
    questionBn: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g) ; ΔH = -92 kJ/mol বিক্রিয়াটিতে চাপ বৃদ্ধি করলে কী ঘটবে?',
    questionEn: 'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH = -92 kJ/mol), what happens if pressure is increased?',
    boardInfoBn: 'কুমিল্লা বোর্ড ২০২৩, সিলেট বোর্ড ২০২১',
    boardInfoEn: 'Cumilla Board 2023, Sylhet Board 2021',
    options: [
      { key: 'A', textBn: 'সাম্যাবস্থা বামে সরবে এবং NH₃ কমবে', textEn: 'Equilibrium shifts left, NH₃ decreases' },
      { key: 'B', textBn: 'সাম্যাবস্থা ডানে সরবে এবং NH₃ এর উৎপাদন বৃদ্ধি পাবে', textEn: 'Equilibrium shifts right, increasing NH₃ yield' },
      { key: 'C', textBn: 'চাপের কোনো প্রভাব থাকবে না', textEn: 'No effect on equilibrium' },
      { key: 'D', textBn: 'বিক্রিয়া বন্ধ হয়ে যাবে', textEn: 'Reaction will stop' },
    ],
    correctKey: 'B',
    explanationBn:
      'লা-শাতেলীয়ার নীতি অনুসারে চাপ বাড়ালে বিক্রিয়াটি বেশি মোলের দিক থেকে কম মোলের দিকে সরে যায়। বিক্রিয়কের গ্যাসীয় মোল সংখ্যা ১ + ৩ = ৪ এবং উৎপাদের মোল সংখ্যা ২। তাই চাপ বৃদ্ধি করলে সাম্যাবস্থা ডানে (সম্মুখমুখী) স্থানান্তরিত হবে এবং NH₃ উৎপাদন বাড়বে।',
    explanationEn:
      'Le Chatelier’s Principle states that increasing pressure shifts equilibrium toward fewer gas moles (4 moles reactants ➔ 2 moles NH₃), favoring ammonia formation.',
  },
  {
    id: 4,
    questionBn: 'Zn + CuSO₄ → ZnSO₄ + Cu বিক্রিয়াটিতে বিজারক (Reducing Agent) কোনটি?',
    questionEn: 'In Zn + CuSO₄ → ZnSO₄ + Cu, which substance acts as the reducing agent?',
    boardInfoBn: 'বরিশাল বোর্ড ২০২২, যশোর বোর্ড ২০১৯',
    boardInfoEn: 'Barishal Board 2022, Jashore Board 2019',
    options: [
      { key: 'A', textBn: 'জিঙ্ক (Zn)', textEn: 'Zinc (Zn)' },
      { key: 'B', textBn: 'কপার সালফেট (CuSO₄)', textEn: 'Copper Sulfate (CuSO₄)' },
      { key: 'C', textBn: 'কপার (Cu)', textEn: 'Copper (Cu)' },
      { key: 'D', textBn: 'সালফেট আয়ন (SO₄²⁻)', textEn: 'Sulfate ion (SO₄²⁻)' },
    ],
    correctKey: 'A',
    explanationBn:
      'এখানে Zn দুটি ইলেকট্রন বর্জন করে Zn²⁺ আয়নে পরিণত হয় (জারণ ঘটে)। যে পদার্থ ইলেকট্রন ত্যাগ করে জারিত হয়, সে নিজে বিজারক (Reducing Agent) হিসেবে কাজ করে।',
    explanationEn:
      'Zinc loses 2 electrons to oxidize from Zn(0) to Zn(2+). The electron donor is the reducing agent.',
  },
  {
    id: 5,
    questionBn: 'তীব্র এসিড ও তীব্র ক্ষারের প্রশমন তাপের (Enthalpy of Neutralization) মান কত?',
    questionEn: 'What is the standard heat of neutralization for strong acid and strong base?',
    boardInfoBn: 'ময়মনসিংহ বোর্ড ২০২২, ঢাকা বোর্ড ২০২০',
    boardInfoEn: 'Mymensingh Board 2022, Dhaka Board 2020',
    options: [
      { key: 'A', textBn: '+৫৭.৩৪ kJ/mol', textEn: '+57.34 kJ/mol' },
      { key: 'B', textBn: '-৫৭.৩৪ kJ/mol', textEn: '-57.34 kJ/mol' },
      { key: 'C', textBn: '-৯২.০০ kJ/mol', textEn: '-92.00 kJ/mol' },
      { key: 'D', textBn: '-১৩.৭ kJ/mol', textEn: '-13.7 kJ/mol' },
    ],
    correctKey: 'B',
    explanationBn:
      'যেহেতু তীব্র এসিড ও ক্ষারের প্রশমন বিক্রিয়ার প্রকৃত রূপ হলো H⁺(aq) + OH⁻(aq) → H₂O(l), তাই তীব্র এসিড ও তীব্র ক্ষার যেটাই হোক না কেন, উৎপন্ন তাপ সর্বদাই নির্দিষ্ট: ΔH = -৫৭.৩৪ kJ/mol।',
    explanationEn:
      'The net ionic reaction is universally H⁺(aq) + OH⁻(aq) → H₂O(l), which always releases 57.34 kJ per mole of water formed (ΔH = -57.34 kJ/mol).',
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

export const CHAPTER_7_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "পদার্থের পরিবর্তন ও সমীকরণ সমতাকরণ",
    titleEn: "Physical vs Chemical Changes & Balancing",
    overviewBn: "ভৌত ও রাসায়নিক পরিবর্তনের পার্থক্য, বিক্রিয়ক-উৎপাদ এবং সমীকরণ সমতাকরণের নিয়মাবলি।",
    overviewEn: "Distinction between physical and chemical processes, reactant-product notation, and mass balancing.",
    studyTipBn: "মোমের জ্বলনে ভৌত ও রাসায়নিক উভয় পরিবর্তনই ঘটে (মোম গলে যাওয়া ভৌত, হাইড্রোকার্বনের দহন রাসায়নিক)!",
    studyTipEn: "A burning candle exhibits both physical melting and chemical hydrocarbon combustion!",
    badgeText: "ভৌত ও রাসায়নিক পরিবর্তন",
  },
  2: {
    no: "০২",
    titleBn: "রাসায়নিক বিক্রিয়ার ৫টি মৌলিক শ্রেণিবিভাগ",
    titleEn: "5 Fundamental Chemical Reaction Classes",
    overviewBn: "সংযোজন (সংশ্লেষণ), বিয়োজন (বিশ্লেষণ), প্রতিস্থাপন, দহন এবং এসিড-ক্ষার প্রশমন বিক্রিয়া।",
    overviewEn: "Addition, decomposition, single displacement, combustion, and acid-base neutralization.",
    studyTipBn: "সব সংশ্লেষণ বিক্রিয়াই সংযোজন, কিন্তু সব সংযোজন সংশ্লেষণ নয় (কেবল মৌল যুক্ত হলে সংশ্লেষণ)!",
    studyTipEn: "All synthesis reactions are addition, but only reactions joining pure elements qualify as synthesis!",
    badgeText: "বিক্রিয়ার শ্রেণিবিভাগ",
  },
  3: {
    no: "০৩",
    titleBn: "জারণ-বিজারণ (রেডক্স) ও ইলেকট্রন স্থানান্তর",
    titleEn: "Redox Reactions & Simultaneous Electron Transfer",
    overviewBn: "ইলেকট্রন বর্জন জারণ (বিজারণ ঘটে জারকের), ইলেকট্রন গ্রহণ বিজারণ এবং যুগপৎ সংঘটনের প্রমাণ।",
    overviewEn: "Electron loss is oxidation, electron gain is reduction, and simultaneous transfer proofs.",
    studyTipBn: "মনে রাখবে: জারণ মানে ইলেকট্রন ছারণ (LEO: Loss of Electrons is Oxidation)!",
    studyTipEn: "Memorize OIL RIG: Oxidation Is Loss of electrons, Reduction Is Gain of electrons!",
    badgeText: "রেডক্স ও যুগপৎ সংঘটন",
  },
  4: {
    no: "০৪",
    titleBn: "জারণ সংখ্যা নির্ণয় ও বিশেষ বিক্রিয়া",
    titleEn: "Oxidation Number & Non-Redox Reactions",
    overviewBn: "নিরপেক্ষ যৌগে জারণ সংখ্যার বীজগণিতীয় হিসাব এবং অধঃক্ষেপণ ও আর্দ্র বিশ্লেষণ নন-রেডক্স বিক্রিয়া।",
    overviewEn: "Algebraic oxidation number determinations, alongside non-redox precipitation and hydrolysis.",
    studyTipBn: "মুক্ত মৌলের জারণ সংখ্যা শূন্য এবং নিরপেক্ষ যৌগে পরমাণুগুলোর মোট জারণ সংখ্যার যোগফল শূন্য!",
    studyTipEn: "Free elements have oxidation state zero, and the sum of oxidation states in neutral compounds is zero!",
    badgeText: "জারণ সংখ্যা নির্ণয়",
  },
  5: {
    no: "০৫",
    titleBn: "লা-শাতেলীয়ার নীতি ও সাম্যাবস্থা ল্যাব",
    titleEn: "Le Chatelier Principle & Equilibrium Lab",
    overviewBn: "তাপমাত্রা, চাপ ও ঘনমাত্রার প্রভাব এবং হেবার পদ্ধতিতে অ্যামোনিয়া উৎপাদনের শিল্প সাম্যাবস্থা।",
    overviewEn: "Equilibrium shifts driven by temperature, pressure, and concentration in the Haber-Bosch ammonia synthesis.",
    studyTipBn: "তাপোৎপাদী বিক্রিয়ায় তাপমাত্রা বৃদ্ধি করলে সাম্যাবস্থা বামে সরে উৎপাদ কমে যায়!",
    studyTipEn: "Raising temperature in an exothermic equilibrium shifts the balance leftward, reducing product yield!",
    badgeText: "লা-শাতেলীয়ার সাম্যাবস্থা",
  },
};

export function ChemicalReactionsGuidebook() {
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
        ? 'স্বাগতম রাসায়নিক বিক্রিয়া ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Chemical Reactions Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_7_LESSONS[activeLesson] || CHAPTER_7_LESSONS[1];
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
          chapter: '7 - রাসায়নিক বিক্রিয়া (Chemical Reactions)',
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
          { role: 'ai', text: isBn ? 'রাসায়নিক বিক্রিয়া হলো যেখানে এক বা একাধিক পদার্থ সম্পূর্ণ ভিন্ন নতুন পদার্থে রূপান্তরিত হয়। রেডক্স বিক্রিয়ায় ইলেকট্রন স্থানান্তর ঘটে।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ৭: রাসায়নিক বিক্রিয়া (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. বিক্রিয়ার শ্রেণিবিভাগ:\n   - সংযোজন: দুই বা ততোধিক পদার্থ যুক্ত হয়ে একটি উৎপাদ।\n   - বিয়োজন: একটি যৌগ ভেঙে একাধিক পদার্থ।\n   - প্রতিস্থাপন: অধিক সক্রিয় মৌল কম সক্রিয় মৌলকে স্থানচ্যুত করে।\n   - দহন: বাতাসের অক্সিজেনে পুড়ে অক্সাইড ও শক্তি তৈরি।\n   - প্রশমন: এসিড + ক্ষার → লবণ + পানি (সর্বদা তাপোৎপাদী)।\n২. রেডক্স মেকানিজম:\n   - জারণ: ইলেকট্রন বর্জন, জারণ সংখ্যা বৃদ্ধি।\n   - বিজারণ: ইলেকট্রন গ্রহণ, জারণ সংখ্যা হ্রাস।\n৩. লা-শাতেলীয়ার নীতি:\n   - N₂ + 3H₂ ⇌ 2NH₃ + 92 kJ\n   - তাপমাত্রা কমালে ও চাপ বাড়ালে অ্যামোনিয়ার উৎপাদন বৃদ্ধি পায়।`
      : `SSC Chemistry Chapter 7: Chemical Reactions Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1: Redox Transfer
  const [redoxType, setRedoxType] = useState<'zn_cu' | 'na_cl' | 'fe_cl'>('zn_cu');
  const [isRedoxTriggered, setIsRedoxTriggered] = useState<boolean>(false);

  // Simulator 2: Oxidation Solver
  const [selectedOxTargetIndex, setSelectedOxTargetIndex] = useState<number>(0);

  // Simulator 3: Le Chatelier Equilibrium Chamber
  const [temperatureMode, setTemperatureMode] = useState<'low' | 'high'>('low');
  const [pressureMode, setPressureMode] = useState<'low' | 'high'>('high');

  // Simulator 4: Precipitation & Neutralization
  const [labReaction, setLabReaction] = useState<'precipitation' | 'neutralization'>('precipitation');
  const [isFlaskPoured, setIsFlaskPoured] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // CQ Rubric Accordion
  const [openRubric, setOpenRubric] = useState<string | null>('c');

  const currentOxTarget = OXIDATION_TARGETS[selectedOxTargetIndex];

  // Le Chatelier ammonia yield calculation
  // N2 + 3H2 <=> 2NH3 + 92kJ (Exothermic, 4 moles -> 2 moles)
  // Low T -> Forward (+15%)
  // High P -> Forward (+20%)
  const calculateAmmoniaYield = () => {
    let base = 50;
    if (temperatureMode === 'low') base += 20; // Favors forward
    else base -= 25; // High T shifts backward
    if (pressureMode === 'high') base += 25; // Favors forward
    else base -= 20;
    return Math.max(10, Math.min(95, base));
  };
  const ammoniaYield = calculateAmmoniaYield();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-amber-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={7}
        chapterTitleBn="রাসায়নিক বিক্রিয়া"
        chapterTitleEn="Chemical Reactions"
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
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-amber-600 dark:text-amber-400" />
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
                  <span className="text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    CHAPTER 07
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'রাসায়নিক বিক্রিয়া' : 'Chemical Reactions'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = CHAPTER_7_LESSONS[lNum];
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
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs'
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
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
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
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
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
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় 7 (পৃষ্ঠা ১৪৬ - ১৭২) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 7 (Printed pp. ১৪৬ - ১৭২) aligned with NCTB syllabus.'}
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
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20">
                  <Flame className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 07 • পাঠ ${currentLessonMeta.no}` : `Chapter 07 • Lesson ${activeLesson}`}
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
                        ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
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
          {/* Section 7.1: Reaction Direction & Thermal Changes */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Thermometer className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৭.১ বিক্রিয়ার দিক ও তাপের পরিবর্তন'
                    : '7.1 Reaction Direction & Thermal Changes'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'একমুখী বনাম উভমুখী এবং তাপোৎপাদী বনাম তাপহারী বিক্রিয়ার নিয়ম'
                    : 'Irreversible vs reversible and exothermic vs endothermic reactions'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Irreversible vs Reversible */}
              <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">বিক্রিয়ার দিক (Direction)</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    • <strong>একমুখী বিক্রিয়া (Irreversible):</strong> যে বিক্রিয়ায় বিক্রিয়কগুলো কেবল উৎপাদে পরিণত হয় (উৎপাদ পুনরায় বিক্রিয়ক হতে পারে না)। তীরচিহ্ন (→) দিয়ে প্রকাশ করা হয়। যেমন খোলা পাত্রে চুনাপাথর উত্তপ্ত করলে CO₂ উড়ে যায়:
                  </p>
                  <div className="p-2 rounded-lg bg-muted/40 font-mono text-foreground text-center">
                    CaCO₃ → CaO + CO₂↑
                  </div>
                  <p>
                    • <strong>উভমুখী বিক্রিয়া (Reversible):</strong> যে বিক্রিয়ায় সম্মুখমুখী ও পশ্চাৎমুখী উভয় প্রক্রিয়াই একসাথে ঘটে। উভয়মুখী তীর (⇌) দিয়ে প্রকাশ করা হয়। যেমন বন্ধ পাত্রে:
                  </p>
                  <div className="p-2 rounded-lg bg-muted/40 font-mono text-foreground text-center">
                    CaCO₃ ⇌ CaO + CO₂
                  </div>
                </div>
              </div>

              {/* Exothermic vs Endothermic */}
              <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">তাপের পরিবর্তন (Heat Change)</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    • <strong>তাপোৎপাদী বিক্রিয়া (Exothermic, ΔH &lt; 0):</strong> যে বিক্রিয়ায় তাপ উৎপন্ন হয় এবং পরিবেশ উত্তপ্ত হয়।
                  </p>
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20 font-mono text-[11px] text-center">
                    N₂ + 3H₂ ⇌ 2NH₃ ; ΔH = -৯২ kJ/mol
                  </div>
                  <p>
                    • <strong>তাপহারী বিক্রিয়া (Endothermic, ΔH &gt; 0):</strong> যে বিক্রিয়ায় তাপ শোষিত হয় এবং পরিবেশ শীতল হয়।
                  </p>
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20 font-mono text-[11px] text-center">
                    N₂ + O₂ ⇌ 2NO ; ΔH = +১৮০ kJ/mol
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7.2: Redox vs Non-Redox */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৭.২ ইলেকট্রন স্থানান্তরের ভিত্তিতে শ্রেণিবিন্যাস (রেডক্স ও নন-রেডক্স)'
                    : '7.2 Classification by Electron Transfer: Redox & Non-Redox'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'জারণ-বিজারণ যুগপৎ ক্রিয়া এবং অধঃক্ষেপণ ও প্রশমনের বৈসাদৃশ্য'
                    : 'Simultaneous redox mechanism compared against non-redox reactions'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Redox Box */}
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  রেডক্স বিক্রিয়া (Redox)
                </div>
                <h3 className="text-base font-bold text-foreground">ইলেকট্রন স্থানান্তর ঘটে</h3>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    • <strong>জারণ (Oxidation):</strong> ইলেকট্রন বর্জন বা ত্যাগ (<RenderMathText text="e^-" /> ত্যাগ)। জারণ মান বৃদ্ধি পায়। যে ইলেকট্রন ত্যাগ করে সে হলো <strong>বিজারক (Reducing Agent)</strong>।
                  </p>
                  <p>
                    • <strong>বিজারণ (Reduction):</strong> ইলেকট্রন গ্রহণ। জারণ মান হ্রাস পায়। যে ইলেকট্রন গ্রহণ করে সে হলো <strong>জারক (Oxidizing Agent)</strong>।
                  </p>
                  <div className="p-2.5 rounded-xl bg-background/80 border border-border/60 font-mono text-[11px] text-foreground">
                    সংযোজন, বিয়োজন, প্রতিস্থাপন ও দহন বিক্রিয়া = রেডক্স!
                  </div>
                </div>
              </div>

              {/* Non-Redox Box */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                  নন-রেডক্স বিক্রিয়া (Non-Redox)
                </div>
                <h3 className="text-base font-bold text-foreground">ইলেকট্রন স্থানান্তর ঘটে না</h3>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    • <strong>প্রশমন বিক্রিয়া (Neutralization):</strong> এসিড ও ক্ষার বিক্রিয়া করে নিরপেক্ষ লবণ ও পানি তৈরি করে। জারণ সংখ্যার কোনো পরিবর্তন হয় না।
                  </p>
                  <p>
                    • <strong>অধঃক্ষেপণ বিক্রিয়া (Precipitation):</strong> দুটি দ্রবণ মেশালে কঠিন অদ্রবণীয় তলানি পড়ে (<RenderMathText text="\text{AgCl}\downarrow" />)।
                  </p>
                  <div className="p-2.5 rounded-xl bg-muted/40 font-mono text-[11px] text-foreground">
                    HCl + NaOH → NaCl + H₂O (প্রশমন)
                    <br />
                    AgNO₃ + NaCl → AgCl↓ + NaNO₃ (অধঃক্ষেপণ)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7.3: Le Chatelier's Principle */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৭.৩ লা-শাতেলীয়ার নীতি (Le Chatelier’s Principle)'
                    : '7.3 Le Chatelier’s Principle on Chemical Equilibrium'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'উভমুখী বিক্রিয়ার সাম্যাবস্থায় তাপমাত্রা, চাপ ও ঘনমাত্রা পরিবর্তনের প্রভাব'
                    : 'How temperature, pressure, and concentration alter equilibrium position'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-semibold">
              &quot;কোনো উভমুখী বিক্রিয়ার সাম্যাবস্থায় থাকাকালীন যদি তাপ, চাপ বা ঘনমাত্রার মতো নিয়ামকগুলোর কোনো একটি পরিবর্তন করা হয়, তবে সাম্যের অবস্থান এমনভাবে পরিবর্তিত হবে যাতে নিয়ামক পরিবর্তনের প্রভাব প্রশমিত হয়।&quot;
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-2">
                <h4 className="font-bold text-foreground">১. তাপমাত্রার প্রভাব</h4>
                <p className="text-muted-foreground">
                  • তাপোৎপাদী বিক্রিয়ায় তাপ বাড়ালে বিক্রিয়া পশ্চাৎমুখী হয় (উৎপাদ কমে); তাপ কমালে সম্মুখমুখী হয় (উৎপাদ বাড়ে)।
                </p>
              </div>
              <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-2">
                <h4 className="font-bold text-foreground">২. চাপের প্রভাব</h4>
                <p className="text-muted-foreground">
                  • চাপ বাড়ালে বিক্রিয়া বেশি গ্যাসীয় মোলের দিক থেকে কম গ্যাসীয় মোলের দিকে সরে যায়। যদি উভয়পাশে মোল সংখ্যা সমান হয় (Δn = 0), তবে চাপের কোনো প্রভাব থাকে না।
                </p>
              </div>
              <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-2">
                <h4 className="font-bold text-foreground">৩. ঘনমাত্রার প্রভাব</h4>
                <p className="text-muted-foreground">
                  • সাম্যাবস্থায় বিক্রিয়ক যোগ করলে বিক্রিয়া সম্মুখমুখী হয়ে উৎপাদ বাড়ায়; উৎপাদ সরিয়ে নিলেও বিক্রিয়া সম্মুখমুখী হয়।
                </p>
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
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? 'বোর্ড ভিত্তিক গাণিতিক ও ব্যাখ্যামূলক সমস্যা সমাধান'
                    : 'Board-Standard Solved Questions & Explanations'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'জারণ-বিজারণ যুগপৎ ক্রিয়া প্রমাণ ও জারণ সংখ্যা নির্ণয়ের আদর্শ ধাপ'
                    : 'Step-by-step proofs of simultaneous redox and oxidation state calculations'}
                </p>
              </div>
            </div>

            {/* Problem 1 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600">সমস্যা ০১ (জারণ-বিজারণ যুগপৎ ক্রিয়া প্রমাণ)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                  ৪ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                <RenderMathText text="\text{Zn} + \text{CuSO}_4 \rightarrow \text{ZnSO}_4 + \text{Cu}" /> বিক্রিয়াটি যে একটি জারণ-বিজারণ যুগপৎ ক্রিয়া তা ইলেকট্রনীয় মতবাদের আলোকে প্রমাণ করো।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <p>
                  বিক্রিয়াটির আয়নিক রূপ হলো: <RenderMathText text="\text{Zn}^0 + \text{Cu}^{2+} \rightarrow \text{Zn}^{2+} + \text{Cu}^0" /> (যেখানে SO₄²⁻ দর্শক আয়ন)।
                </p>
                <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-2 text-foreground">
                  <p>
                    ১. জারণ অর্ধ-বিক্রিয়া (Oxidation Half-Reaction):
                    <br />
                    Zn পরমাণু দুটি ইলেকট্রন বর্জন করে Zn²⁺ আয়নে পরিণত হয়:
                    <br />
                    <span className="text-amber-600 font-bold">Zn → Zn²⁺ + 2e⁻ (জারণ, Zn হলো বিজারক)</span>
                  </p>
                  <div className="border-t border-border/60 my-1" />
                  <p>
                    ২. বিজারণ অর্ধ-বিক্রিয়া (Reduction Half-Reaction):
                    <br />
                    Cu²⁺ আয়ন সেই বর্জিত দুটি ইলেকট্রন গ্রহণ করে নিস্তড়িৎ Cu ধাতুতে পরিণত হয়:
                    <br />
                    <span className="text-amber-600 font-bold">Cu²⁺ + 2e⁻ → Cu (বিজারণ, CuSO₄ হলো জারক)</span>
                  </p>
                </div>
                <p>
                  <strong>যুক্তি:</strong> জিঙ্ক যতক্ষণ পর্যন্ত ইলেকট্রন ত্যাগ না করে, Cu²⁺ ততোক্ষণ ইলেকট্রন গ্রহণ করতে পারে না। অর্থাৎ ইলেকট্রন বর্জন (জারণ) ও ইলেকট্রন গ্রহণ (বিজারণ) একই সাথে ঘটে। একটি ছাড়া অন্যটি ঘটা অসম্ভব। অতএব জারণ-বিজারণ একটি যুগপৎ ক্রিয়া।
                </p>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600">সমস্যা ০২ (লা-শাতেলীয়ার প্রয়োগ)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                  ৪ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                হেবার-বশ পদ্ধতিতে অ্যামোনিয়া উৎপাদনে <RenderMathText text="\text{N}_2(g) + 3\text{H}_2(g) \rightleftharpoons 2\text{NH}_3(g); \Delta H = -92 \text{ kJ/mol}" /> বিক্রিয়ায় সর্বোচ্চ উৎপাদ পাওয়ার শর্ত কী?
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <p>
                  লা-শাতেলীয়ার নীতির আলোকে অ্যামোনিয়া (NH₃) এর সর্বোচ্চ উৎপাদন নিশ্চিত করার শর্তসমূহ:
                </p>
                <div className="bg-muted/40 p-3 rounded-xl space-y-1.5 text-xs text-foreground">
                  <p>
                    • <strong>১. তাপমাত্রার প্রভাব:</strong> বিক্রিয়াটি তাপোৎপাদী (ΔH = -92 kJ/mol)। তাই লা-শাতেলীয়ার নীতি অনুসারে তাপমাত্রা কমালে NH₃ উৎপাদন বাড়বে। কিন্তু তাপমাত্রা অতিমাত্রায় কমালে বিক্রিয়ার গতি মন্থর হয়ে যায়। তাই একটি <strong>অনুকূল তাপমাত্রা (৪৫০°C - ৫৫০°C)</strong> বজায় রাখা হয়।
                  </p>
                  <p>
                    • <strong>২. চাপের প্রভাব:</strong> বামে গ্যাসীয় মোল সংখ্যা ৪ এবং ডানে ২। চাপ বৃদ্ধি করলে সাম্যাবস্থা কম মোলের দিকে অর্থাৎ ডানদিকে স্থানান্তরিত হয়। এজন্য শিল্পক্ষেত্রে <strong>২০০ atm উচ্চ চাপ</strong> প্রয়োগ করা হয়।
                  </p>
                  <p>
                    • <strong>৩. প্রভাবক:</strong> সাম্যাবস্থা দ্রুত অর্জন করার জন্য সূক্ষ্ম <strong>আয়রন চূর্ণ (Fe)</strong> প্রভাবক হিসেবে ব্যবহৃত হয়।
                  </p>
                </div>
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
          {/* SIMULATOR 1: Live Redox Electron Transfer Simulator */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  {isBn
                    ? '১. রেডক্স ইলেকট্রন স্থানান্তর লাইভ সিমুলেটর'
                    : '1. Live Redox Electron Transfer Simulator'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'বিজারক থেকে ইলেকট্রন কীভাবে জারকে স্থানান্তরিত হয়ে যুগপৎ ক্রিয়া সম্পন্ন করে তা অ্যানিমেশনে দেখো।'
                    : 'Observe electrons physically transfer from the reducing agent to the oxidizing agent.'}
                </p>
              </div>

              {/* Redox Selector */}
              <div className="flex gap-2">
                {[
                  { id: 'zn_cu', label: 'Zn + Cu²⁺' },
                  { id: 'na_cl', label: '2Na + Cl₂' },
                  { id: 'fe_cl', label: '2Fe²⁺ + Cl₂' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setRedoxType(btn.id as any);
                      setIsRedoxTriggered(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      redoxType === btn.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Stage */}
            <div className="relative h-64 rounded-2xl border border-border/80 bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-6">
              <div className="flex items-center justify-between w-full max-w-lg px-4">
                {/* Reducing Agent (Electron Donor) */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-700 ${
                      isRedoxTriggered
                        ? 'border-amber-400 bg-amber-500/20 shadow-lg'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    <span className="text-xl font-black text-white">
                      {redoxType === 'zn_cu'
                        ? isRedoxTriggered ? 'Zn²⁺' : 'Zn⁰'
                        : redoxType === 'na_cl'
                        ? isRedoxTriggered ? 'Na⁺' : 'Na⁰'
                        : isRedoxTriggered ? 'Fe³⁺' : 'Fe²⁺'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {isRedoxTriggered ? 'জারিত (Oxidized)' : 'বিজারক (Donor)'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 mt-2">
                    {isRedoxTriggered ? '-২e⁻ বর্জিত' : 'ইলেকট্রন সমৃদ্ধ'}
                  </span>
                </div>

                {/* Flying Electrons in Middle */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
                  {isRedoxTriggered ? (
                    <div className="flex items-center gap-2 animate-bounce">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        ⚡ 2e⁻ স্থানান্তরিত হচ্ছে ➔
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">স্থানান্তরের অপেক্ষায়...</span>
                  )}
                </div>

                {/* Oxidizing Agent (Electron Acceptor) */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-700 ${
                      isRedoxTriggered
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-lg'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    <span className="text-xl font-black text-white">
                      {redoxType === 'zn_cu'
                        ? isRedoxTriggered ? 'Cu⁰' : 'Cu²⁺'
                        : redoxType === 'na_cl'
                        ? isRedoxTriggered ? '2Cl⁻' : 'Cl₂⁰'
                        : isRedoxTriggered ? '2Cl⁻' : 'Cl₂⁰'}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {isRedoxTriggered ? 'বিজারিত (Reduced)' : 'জারক (Acceptor)'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-300 mt-2">
                    {isRedoxTriggered ? '+২e⁻ গৃহীত' : 'ইলেকট্রন ঘাটতি'}
                  </span>
                </div>
              </div>

              {/* Trigger Button */}
              <div className="absolute bottom-4">
                <button
                  onClick={() => setIsRedoxTriggered(!isRedoxTriggered)}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>
                    {isRedoxTriggered ? 'পুনরায় শুরু করুন (Reset)' : 'ইলেকট্রন স্থানান্তর করো (Transfer 2e⁻)'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* SIMULATOR 2: Step-by-Step Oxidation State Calculator */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-500" />
                  {isBn
                    ? '২. জারণ সংখ্যা নির্ণয়ক ক্যালকুলেটর (Oxidation State Solver)'
                    : '2. Step-by-Step Oxidation State Solver'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'যেকোনো জটিল যৌগ সিলেক্ট করো এবং বীজগণিতীয় সমীকরণের ধাপে ধাপে জারণ মান দেখো।'
                    : 'Select a compound to reveal the step-by-step algebraic oxidation state solution.'}
                </p>
              </div>

              {/* Selector */}
              <div className="flex flex-wrap gap-1.5">
                {OXIDATION_TARGETS.map((t, idx) => (
                  <button
                    key={t.formula}
                    onClick={() => setSelectedOxTargetIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedOxTargetIndex === idx
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {t.formula}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Target Element Badge */}
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-center space-y-2">
                <span className="text-xs text-muted-foreground">
                  {currentOxTarget.formula} যৌগে
                </span>
                <div className="text-2xl font-black text-foreground">
                  {currentOxTarget.targetSymbol} ({isBn ? currentOxTarget.targetElementBn : currentOxTarget.targetElementEn})
                </div>
                <div className="text-3xl font-mono font-black text-amber-600 dark:text-amber-400">
                  +{currentOxTarget.targetOxidation}
                </div>
                <span className="text-[10px] text-muted-foreground block">নির্ণীত জারণ মান</span>
              </div>

              {/* Algebraic Equation Steps */}
              <div className="md:col-span-2 p-5 rounded-2xl border border-border/70 bg-muted/20 space-y-3">
                <span className="text-xs font-bold text-muted-foreground block">
                  বীজগণিতীয় সমাধানের ধাপ:
                </span>
                <div className="p-3 rounded-xl bg-background border border-border/60 font-mono text-xs text-foreground space-y-1">
                  <p className="text-muted-foreground">মনে করি {currentOxTarget.targetSymbol} এর জারণ সংখ্যা = x</p>
                  <p className="text-amber-600 font-bold">{currentOxTarget.equationBn}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 <em>নিয়ম: ক্ষার ধাতু সর্বদাই +১, অক্সিজেন সাধারণত -২, এবং নিরপেক্ষ অণুতে মোট জারণ সংখ্যার যোগফল = ০।</em>
                </p>
              </div>
            </div>
          </div>

          {/* SIMULATOR 3: Le Chatelier Equilibrium Chamber */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-amber-500" />
                  {isBn
                    ? '৩. লা-শাতেলীয়ার সাম্যাবস্থা চেম্বার (N₂ + 3H₂ ⇌ 2NH₃)'
                    : '3. Le Chatelier Equilibrium Chamber (Haber Process)'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'তাপমাত্রা ও চাপ পরিবর্তন করে দেখো কীভাবে সাম্যাবস্থা সরে যায় এবং অ্যামোনিয়ার উৎপাদন (%) প্রভাবিত হয়।'
                    : 'Manipulate temperature and pressure to see live equilibrium shifts and ammonia yield.'}
                </p>
              </div>

              {/* T & P Toggles */}
              <div className="flex flex-wrap gap-3 items-center text-xs">
                {/* Temperature */}
                <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl">
                  <span className="text-[10px] font-bold px-2 text-muted-foreground">তাপমাত্রা:</span>
                  <button
                    onClick={() => setTemperatureMode('low')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      temperatureMode === 'low'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    নিম্ন (Low)
                  </button>
                  <button
                    onClick={() => setTemperatureMode('high')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      temperatureMode === 'high'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    উচ্চ (High)
                  </button>
                </div>

                {/* Pressure */}
                <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl">
                  <span className="text-[10px] font-bold px-2 text-muted-foreground">চাপ:</span>
                  <button
                    onClick={() => setPressureMode('low')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      pressureMode === 'low'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ১ atm (Low)
                  </button>
                  <button
                    onClick={() => setPressureMode('high')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      pressureMode === 'high'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ২০০ atm (High)
                  </button>
                </div>
              </div>
            </div>

            {/* Chamber Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">অ্যামোনিয়া (NH₃) এর উৎপাদন:</span>
                  <span className="font-mono font-black text-amber-600 text-base">{ammoniaYield}%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: `${ammoniaYield}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>০%</span>
                  <span>৫০%</span>
                  <span>১০০%</span>
                </div>
              </div>

              {/* Equilibrium Direction Card */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">সাম্যের গতিপথ:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      ammoniaYield > 50
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-rose-500/15 text-rose-600'
                    }`}
                  >
                    {ammoniaYield > 50 ? 'সম্মুখমুখী (Forward ➔)' : 'পশ্চাৎমুখী (Backward ⬅)'}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {temperatureMode === 'low' && pressureMode === 'high' && (
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                      সর্বোত্তম অবস্থা! নিম্ন তাপমাত্রা তাপোৎপাদী বিক্রিয়াকে ডানদিকে ঠেলে দেয় এবং ২০০ atm উচ্চ চাপ গ্যাসীয় মোল কমার দিকে (৪ মোল ➔ ২ মোল) বিক্রিয়া ত্বরান্বিত করে।
                    </span>
                  )}
                  {temperatureMode === 'high' && (
                    <span className="text-rose-700 dark:text-rose-300 font-semibold">
                      উচ্চ তাপমাত্রার কারণে অতিরিক্ত তাপ উৎপন্ন হতে না পেরে সাম্যাবস্থা বামে সরে গেছে, ফলে NH₃ ভেঙে N₂ ও H₂ হচ্ছে!
                    </span>
                  )}
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
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
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
                      ? 'বিগত বোর্ড পরীক্ষার গুরুত্বপূর্ণ রেডক্স ও সাম্যাবস্থা প্রশ্নের তাৎক্ষণিক মূল্যায়ন'
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
                      <span className="text-xs font-mono font-bold text-amber-600">
                        প্রশ্ন ০{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
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
                          btnStyle = 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold';
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
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
              >
                {isBn ? 'উত্তর যাচাই করুন (Submit & Check Answers)' : 'Submit & Check Answers'}
              </button>
            )}

            {showResults && (
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
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
                      ? 'অসাধারণ! রাসায়নিক বিক্রিয়ার রেডক্স ও সাম্যাবস্থা কনসেপ্ট তোমার আয়ত্তে।'
                      : 'ভুলগুলো দেখে নিয়ে ব্যাখ্যাগুলো পুনরায় পড়ে নাও।'}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
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
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
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
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
              </button>

            {/* Stimulus */}
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <span className="text-xs font-bold text-amber-600 block">উদ্দীপকটি লক্ষ্য করো:</span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                বিক্রিয়া ১: <RenderMathText text="\text{Zn} + \text{CuSO}_4 \rightarrow \text{ZnSO}_4 + \text{Cu}" />
                <br />
                বিক্রিয়া ২: <RenderMathText text="\text{N}_2(g) + 3\text{H}_2(g) \rightleftharpoons 2\text{NH}_3(g) \quad (\Delta H = -92 \text{ kJ/mol})" />
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600">
                      (ক) জ্ঞানমূলক [১]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">লা-শাতেলীয়ার নীতিটি বিবৃত করো।</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'a' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'a' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> কোনো উভমুখী বিক্রিয়ার সাম্যাবস্থায় থাকাকালীন যদি তাপমাত্রা, চাপ বা ঘনমাত্রার মতো নিয়ামকগুলোর কোনো একটি পরিবর্তন করা হয়, তবে সাম্যের অবস্থান এমনভাবে পরিবর্তিত হবে যাতে নিয়ামক পরিবর্তনের ফলাফল প্রশমিত হয়।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600">
                      (খ) অনুধাবনমূলক [২]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">সকল প্রতিস্থাপন বিক্রিয়াই রেডক্স বিক্রিয়া কেন?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'b' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'b' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1.5">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> প্রতিস্থাপন বিক্রিয়ায় একটি অধিক সক্রিয় মৌল অন্য একটি কম সক্রিয় মৌলকে তার যৌগ থেকে প্রতিস্থাপিত করে।
                    </p>
                    <p>
                      যেমন: Zn + CuSO₄ → ZnSO₄ + Cu। এখানে মুক্ত মৌল Zn (জারণ মান ০) ইলেকট্রন ত্যাগ করে Zn²⁺ হয় এবং Cu²⁺ সেই ইলেকট্রন গ্রহণ করে Cu (জারণ মান ০) হয়। যেহেতু প্রতিস্থাপন প্রক্রিয়ায় সর্বদাই ইলেকট্রন বর্জন ও গ্রহণ ঘটে এবং মৌলসমূহের জারণ মানের পরিবর্তন হয়, তাই সকল প্রতিস্থাপন বিক্রিয়াই রেডক্স বিক্রিয়া।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600">
                      (গ) প্রয়োগমূলক [৩]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের ১ নং বিক্রিয়াটি যে একটি জারণ-বিজারণ যুগপৎ ক্রিয়া তা বিশ্লেষণ করো।
                    </h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'c' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'c' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-2">
                    <p>
                      <strong>মডেল উত্তর ও নম্বর বিভাজন:</strong>
                    </p>
                    <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-2 text-foreground">
                      <p>
                        ১ নং বিক্রিয়া: Zn + CuSO₄ → ZnSO₄ + Cu
                        <br />
                        আয়নিক রূপ: Zn⁰ + Cu²⁺ → Zn²⁺ + Cu⁰ [১ নম্বর]
                      </p>
                      <p>
                        • জারণ অর্ধ-বিক্রিয়া: Zn → Zn²⁺ + 2e⁻ (Zn ইলেকট্রন ত্যাগ করে জারিত হয়েছে, Zn বিজারক)। [১ নম্বর]
                        <br />
                        • বিজারণ অর্ধ-বিক্রিয়া: Cu²⁺ + 2e⁻ → Cu (Cu²⁺ ইলেকট্রন গ্রহণ করে বিজারিত হয়েছে, CuSO₄ জারক)। [১ নম্বর]
                      </p>
                      <p className="text-amber-700 dark:text-amber-300 font-bold">
                        যেহেতু ইলেকট্রন ত্যাগ ও গ্রহণ একই সাথে ঘটেছে এবং একটি ছাড়া অন্যটি সম্ভব নয়, তাই ১ নং বিক্রিয়াটি একটি যুগপৎ জারণ-বিজারণ ক্রিয়া।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600">
                      (ঘ) উচ্চতর দক্ষতা [৪]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের ২ নং বিক্রিয়ায় তাপ ও চাপের প্রভাব লা-শাতেলীয়ার নীতির আলোকে ব্যাখ্যা করো।
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
                      উদ্দীপকের ২ নং বিক্রিয়া: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) ; ΔH = -92 kJ/mol
                    </p>
                    <p>
                      <strong>১. তাপমাত্রার প্রভাব:</strong> বিক্রিয়াটি একটি তাপোৎপাদী বিক্রিয়া (ΔH ঋণাত্মক)। লা-শাতেলীয়ার নীতি অনুযায়ী সাম্যাবস্থায় তাপমাত্রা বৃদ্ধি করলে অতিরিক্ত তাপ প্রশমিত করার জন্য বিক্রিয়া পশ্চাৎমুখী হবে, ফলে NH₃ ভেঙে N₂ ও H₂ এ পরিণত হবে এবং উৎপাদন হ্রাস পাবে। পক্ষান্তরে তাপমাত্রা হ্রাস করলে সাম্যাবস্থা ডানদিকে সরে গিয়ে NH₃ এর উৎপাদন বৃদ্ধি করবে। (শিল্পক্ষেত্রে ৪৫০°C - ৫৫০°C অনুকূল তাপমাত্রা রাখা হয়)।
                    </p>
                    <p>
                      <strong>২. চাপের প্রভাব:</strong> সমতাকৃত বিক্রিয়ায় বিক্রিয়কের গ্যাসীয় মোল সংখ্যা ১ + ৩ = ৪ এবং উৎপাদের মোল সংখ্যা = ২। এখানে বিক্রিয়ার ফলে আয়তন বা মোল সংখ্যা হ্রাস পায়। লা-শাতেলীয়ার নীতি অনুসারে চাপ বৃদ্ধি করলে সাম্যাবস্থা কম মোলের দিকে অর্থাৎ ডানদিকে (সম্মুখমুখী) স্থানান্তরিত হবে এবং NH₃ এর উৎপাদন বৃদ্ধি পাবে। তাই শিল্পক্ষেত্রে প্রায় ২০০ atm উচ্চ চাপ প্রয়োগ করা হয়।
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
              {isBn ? 'অধ্যায় ০৭ রিভিশন চেকলিস্ট' : 'Chapter 07 Revision Checklist'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { labelBn: 'একমুখী বনাম উভমুখী বিক্রিয়ার শর্ত', ok: true },
                { labelBn: 'তাপোৎপাদী (ΔH < 0) ও তাপহারী (ΔH > 0) এর পার্থক্য', ok: true },
                { labelBn: 'জারণ-বিজারণ যুগপৎ ক্রিয়া ও অর্ধ-বিক্রিয়া লিখন', ok: true },
                { labelBn: 'জারক বনাম বিজারক শনাক্তকরণ কৌশল', ok: true },
                { labelBn: 'জারণ সংখ্যা নির্ণয় (KMnO₄, K₂Cr₂O₇, H₂SO₄)', ok: true },
                { labelBn: 'লা-শাতেলীয়ার নীতি ও তাপমাত্রা/চাপের প্রভাব', ok: true },
                { labelBn: 'প্রশমন ও অধঃক্ষেপণ নন-রেডক্স বিক্রিয়ার প্রমাণ', ok: true },
                { labelBn: 'তীব্র এসিড-ক্ষারে প্রশমন তাপ (-৫৭.৩৪ kJ/mol) ধ্রুবক', ok: true },
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
        chapterNumberBn="অধ্যায় 07"
        chapterNumberEn="Chapter 07"
        chapterTitleBn="রাসায়নিক বিক্রিয়া"
        chapterTitleEn="Chemical Reactions"
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
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {isBn ? 'অধ্যায় 7 বিশেষজ্ঞ' : 'Chapter 7 Specialist'}
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
                  ? 'bg-amber-600 text-white ml-6 rounded-tr-xs'
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
              placeholder={isBn ? 'রাসায়নিক বিক্রিয়া নিয়ে প্রশ্ন করো...' : 'Ask about Chemical Reactions...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all disabled:opacity-50 shrink-0"
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
