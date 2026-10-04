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
  BatteryCharging,
  Flame,
  Activity,
  Gauge,
  Radiation,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Bond Energy Reactions Data
interface ReactionBondData {
  id: string;
  nameBn: string;
  nameEn: string;
  equation: string;
  b1Broken: { bond: string; count: number; energy: number }[];
  b2Formed: { bond: string; count: number; energy: number }[];
  deltaH: number;
  typeBn: string;
  typeEn: string;
}

const BOND_REACTIONS: ReactionBondData[] = [
  {
    id: 'ch4_cl2',
    nameBn: 'মিথেনের ক্লোরিনেশন',
    nameEn: 'Chlorination of Methane',
    equation: '\\text{CH}_4 + \\text{Cl}_2 \\rightarrow \\text{CH}_3\\text{Cl} + \\text{HCl}',
    b1Broken: [
      { bond: 'C-H', count: 1, energy: 414 },
      { bond: 'Cl-Cl', count: 1, energy: 244 },
    ],
    b2Formed: [
      { bond: 'C-Cl', count: 1, energy: 326 },
      { bond: 'H-Cl', count: 1, energy: 431 },
    ],
    deltaH: -99,
    typeBn: 'তাপোৎপাদী বিক্রিয়া (Exothermic)',
    typeEn: 'Exothermic (ΔH = -99 kJ/mol)',
  },
  {
    id: 'ch4_o2',
    nameBn: 'মিথেনের দহন (প্রাকৃতিক গ্যাস পোড়ানো)',
    nameEn: 'Combustion of Methane',
    equation: '\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}',
    b1Broken: [
      { bond: 'C-H', count: 4, energy: 414 },
      { bond: 'O=O', count: 2, energy: 498 },
    ],
    b2Formed: [
      { bond: 'C=O', count: 2, energy: 745 },
      { bond: 'O-H', count: 4, energy: 464 },
    ],
    deltaH: -696,
    typeBn: 'তীব্র তাপোৎপাদী বিক্রিয়া',
    typeEn: 'Highly Exothermic (ΔH = -696 kJ/mol)',
  },
  {
    id: 'h2_cl2',
    nameBn: 'হাইড্রোজেন ও ক্লোরিনের সংযোজন',
    nameEn: 'Synthesis of Hydrogen Chloride',
    equation: '\\text{H}_2 + \\text{Cl}_2 \\rightarrow 2\\text{HCl}',
    b1Broken: [
      { bond: 'H-H', count: 1, energy: 436 },
      { bond: 'Cl-Cl', count: 1, energy: 244 },
    ],
    b2Formed: [{ bond: 'H-Cl', count: 2, energy: 431 }],
    deltaH: -182,
    typeBn: 'তাপোৎপাদী বিক্রিয়া (Exothermic)',
    typeEn: 'Exothermic (ΔH = -182 kJ/mol)',
  },
  {
    id: 'n2_h2',
    nameBn: 'অ্যামোনিয়া সংশ্লেষণ (হেবার পদ্ধতি)',
    nameEn: 'Ammonia Synthesis (Haber Process)',
    equation: '\\text{N}_2 + 3\\text{H}_2 \\rightarrow 2\\text{NH}_3',
    b1Broken: [
      { bond: 'N≡N', count: 1, energy: 945 },
      { bond: 'H-H', count: 3, energy: 436 },
    ],
    b2Formed: [{ bond: 'N-H', count: 6, energy: 391 }],
    deltaH: -93,
    typeBn: 'তাপোৎপাদী বিক্রিয়া (Exothermic)',
    typeEn: 'Exothermic (ΔH = -93 kJ/mol)',
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
    questionBn: 'ড্যানিয়েল কোষে (Daniell Cell) লবণ সেতুর (Salt Bridge) প্রধান ভূমিকা কী?',
    questionEn: 'What is the primary role of the salt bridge in a Daniell cell?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২৩, রাজশাহী বোর্ড ২০২২',
    boardInfoEn: 'Dhaka Board 2023, Rajshahi Board 2022',
    options: [
      { key: 'A', textBn: 'ইলেকট্রন সরাসরি পরিবহন করা', textEn: 'Direct electron transport' },
      { key: 'B', textBn: 'উভয় অর্ধকোষের তরল নিরপেক্ষতা রক্ষা করা ও বর্তনী পূর্ণ করা', textEn: 'Maintain electrical neutrality & complete circuit' },
      { key: 'C', textBn: 'কোষের ভোল্টেজ দ্বিগুণ করা', textEn: 'Double cell voltage' },
      { key: 'D', textBn: 'জিঙ্ক দণ্ডকে দ্রবীভূত হওয়া থেকে রক্ষা করা', textEn: 'Prevent zinc electrode dissolution' },
    ],
    correctKey: 'B',
    explanationBn:
      'লবণ সেতুতে KCl বা KNO₃ এর মতো নিষ্ক্রিয় তড়িৎ বিশ্লেষ্য থাকে। এটি অ্যানোড ও ক্যাথোড দ্রবণে বিপরীত আয়নের ঘাটতি পূরণ করে উভয় দ্রবণের তড়িৎ নিরপেক্ষতা বজায় রাখে এবং অভ্যন্তরীণ বর্তনী সম্পূর্ণ করে।',
    explanationEn:
      'The salt bridge supplies mobile ions (e.g. K⁺ and Cl⁻) to neutralize charge buildup, maintaining electrical neutrality and completing the internal circuit.',
  },
  {
    id: 2,
    questionBn: 'ড্যানিয়েল কোষের প্রমিত কোষ বিভব (Standard Cell Potential, E°cell) কত?',
    questionEn: 'What is the standard cell potential (E°cell) of a Daniell cell?',
    boardInfoBn: 'কুমিল্লা বোর্ড ২০২১, চট্টগ্রাম বোর্ড ২০২৩',
    boardInfoEn: 'Cumilla Board 2021, Chattogram Board 2023',
    options: [
      { key: 'A', textBn: '১.১০ ভোল্ট (1.10 V)', textEn: '1.10 Volts (1.10 V)' },
      { key: 'B', textBn: '১.৫০ ভোল্ট (1.50 V)', textEn: '1.50 Volts (1.50 V)' },
      { key: 'C', textBn: '২.২০ ভোল্ট (2.20 V)', textEn: '2.20 Volts (2.20 V)' },
      { key: 'D', textBn: '০.৭৬ ভোল্ট (0.76 V)', textEn: '0.76 Volts (0.76 V)' },
    ],
    correctKey: 'A',
    explanationBn:
      'ড্যানিয়েল কোষে জিঙ্কের প্রমাণ জারণ বিভব +০.৭৬ V এবং কপারের প্রমাণ বিজারণ বিভব +০.৩৪ V। অতএব E°cell = E°(ox) + E°(red) = 0.76 V + 0.34 V = ১.১০ ভোল্ট।',
    explanationEn:
      'E°cell = E°(Zn/Zn²⁺) + E°(Cu²⁺/Cu) = +0.76 V + 0.34 V = 1.10 V.',
  },
  {
    id: 3,
    questionBn: 'একটি সাধারণ শুষ্ক কোষে (ড্রাই সেল) অ্যানোড হিসেবে কোনটি কাজ করে?',
    questionEn: 'What serves as the anode in a standard dry cell (Leclanché cell)?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২২, সিলেট বোর্ড ২০১৯',
    boardInfoEn: 'Dinajpur Board 2022, Sylhet Board 2019',
    options: [
      { key: 'A', textBn: 'গ্রাফাইট কার্বন দণ্ড', textEn: 'Graphite carbon rod' },
      { key: 'B', textBn: 'দস্তার পাত্র বা চোঙ (Zn casing)', textEn: 'Zinc casing (Zn)' },
      { key: 'C', textBn: 'ম্যাঙ্গানিজ ডাই-অক্সাইড পেস্ট', textEn: 'MnO₂ paste' },
      { key: 'D', textBn: 'তামার তার', textEn: 'Copper wire' },
    ],
    correctKey: 'B',
    explanationBn:
      'ড্রাই সেলের বাইরের আবরণের জিংক (Zn) ধাতুর চোঙটি অ্যানোড হিসেবে কাজ করে, যা ইলেকট্রন ত্যাগ করে জারিত হয় (Zn → Zn²⁺ + 2e⁻)। মাঝের গ্রাফাইট দণ্ডটি ক্যাথোড হিসেবে কাজ করে।',
    explanationEn:
      'The outer zinc can acts as the anode undergoing oxidation (Zn → Zn²⁺ + 2e⁻), while the central graphite rod is the cathode.',
  },
  {
    id: 4,
    questionBn: 'বিক্রিয়া তাপ নির্ণয়ের সূত্র ΔH = B₁ - B₂ তে B₁ ও B₂ কী নির্দেশ করে?',
    questionEn: 'In enthalpy change formula ΔH = B₁ - B₂, what do B₁ and B₂ represent?',
    boardInfoBn: 'যশোর বোর্ড ২০২০, ময়মনসিংহ বোর্ড ২০২৩',
    boardInfoEn: 'Jashore Board 2020, Mymensingh Board 2023',
    options: [
      { key: 'A', textBn: 'B₁ = উৎপাদের শক্তি, B₂ = বিক্রিয়কের শক্তি', textEn: 'B₁ = Product energy, B₂ = Reactant energy' },
      { key: 'B', textBn: 'B₁ = বিক্রিয়কের বন্ধন ভাঙার শক্তি, B₂ = উৎপাদের বন্ধন গড়ার শক্তি', textEn: 'B₁ = Bond breaking energy, B₂ = Bond forming energy' },
      { key: 'C', textBn: 'B₁ = সক্রিয়ণ শক্তি, B₂ = মুক্ত শক্তি', textEn: 'B₁ = Activation energy, B₂ = Free energy' },
      { key: 'D', textBn: 'B₁ = গতিশক্তি, B₂ = স্থিতিশক্তি', textEn: 'B₁ = Kinetic energy, B₂ = Potential energy' },
    ],
    correctKey: 'B',
    explanationBn:
      'রাসায়নিক বিক্রিয়ায় বিক্রিয়কের পুরাতন বন্ধন ভাঙতে শক্তি দিতে হয় (B₁) এবং উৎপাদের নতুন বন্ধন গঠিত হলে শক্তি নির্গত হয় (B₂)। অতএব বিক্রিয়ার মোট এনথালপি পরিবর্তন ΔH = B₁ - B₂।',
    explanationEn:
      'B₁ is the total energy required to break bonds in reactants, while B₂ is the total energy released when new bonds form in products.',
  },
  {
    id: 5,
    questionBn: 'লোহার চামচের উপর রূপার (Ag) ইলেকট্রোপ্লেটিং করতে চামচটিকে কোন তড়িৎদ্বারে যুক্ত করতে হবে?',
    questionEn: 'To electroplate an iron spoon with silver (Ag), where should the spoon be connected?',
    boardInfoBn: 'বরিশাল বোর্ড ২০২২, ঢাকা বোর্ড ২০২১',
    boardInfoEn: 'Barishal Board 2022, Dhaka Board 2021',
    options: [
      { key: 'A', textBn: 'অ্যানোড (ধনাত্মক প্রান্ত)', textEn: 'Anode (Positive terminal)' },
      { key: 'B', textBn: 'ক্যাথোড (ঋণাত্মক প্রান্ত)', textEn: 'Cathode (Negative terminal)' },
      { key: 'C', textBn: 'লবণ সেতুতে', textEn: 'In the salt bridge' },
      { key: 'D', textBn: 'যেকোনো প্রান্তে', textEn: 'Either electrode' },
    ],
    correctKey: 'B',
    explanationBn:
      'তড়িৎ প্রলেপনে যার উপর প্রলেপ দিতে হবে (যেমন লোহার চামচ) তাকে ব্যাটারির ঋণাত্মক ক্যাথোডের সাথে যুক্ত করতে হয়। দ্রবণের ধনাত্মক Ag⁺ আয়নগুলি ক্যাথোডে গিয়ে ইলেকট্রন গ্রহণ করে নিস্তড়িৎ Ag ধাতু হিসেবে চামচের গায়ে জমা হয়। বিশুদ্ধ রূপার পাতকে অ্যানোডে যুক্ত করতে হয়।',
    explanationEn:
      'The object to be plated must be connected to the cathode (negative terminal) where metal cations (Ag⁺) gain electrons and deposit as solid metallic silver.',
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

export const CHAPTER_8_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "রাসায়নিক শক্তি ও এনথ্যালপি পরিবর্তন (ΔH)",
    titleEn: "Chemical Energy & Enthalpy Change (ΔH)",
    overviewBn: "তাপোৎপাদী বিক্রিয়া (ΔH < 0, পাত্র উত্তপ্ত), তাপহারী বিক্রিয়া (ΔH > 0, পাত্র শীতল) এবং অভ্যন্তরীণ শক্তি।",
    overviewEn: "Exothermic reactions (ΔH < 0), endothermic reactions (ΔH > 0), and internal energy transformations.",
    studyTipBn: "ক্যালসিয়াম অক্সাইডে (চুন) পানি দিলে প্রচুর তাপ উৎপন্ন হয় (তাপোৎপাদী, ΔH ঋণাত্মক)!",
    studyTipEn: "Slaking quicklime (CaO + H₂O) releases intense heat (exothermic, negative ΔH)!",
    badgeText: "তাপোৎপাদী বনাম তাপহারী",
  },
  2: {
    no: "০২",
    titleBn: "বন্ধন শক্তি ও বিক্রিয়া তাপ হিসাব ল্যাব",
    titleEn: "Bond Energy & Reaction Heat Calculator Lab",
    overviewBn: "বিক্রিয়ক বন্ধন ভাঙার শক্তি B₁ এবং উৎপাদ বন্ধন গড়ার শক্তি B₂ দিয়ে ΔH = B₁ - B₂ গাণিতিক সমাধান।",
    overviewEn: "Bond dissociation energy B1 minus bond formation energy B2 via ΔH = B1 - B2 stoichiometry.",
    studyTipBn: "ΔH = বিক্রিয়কের মোট বন্ধন শক্তি (B₁) - উৎপাদের মোট বন্ধন শক্তি (B₂)!",
    studyTipEn: "ΔH = Total broken reactant bond energy (B₁) - Total formed product bond energy (B₂)!",
    badgeText: "ΔH = B₁ - B₂ হিসাব",
  },
  3: {
    no: "০৩",
    titleBn: "তড়িৎ পরিবাহী ও লবণ তড়িৎ বিশ্লেষণ ল্যাব",
    titleEn: "Electrolytic Conduction & Salt Electrolysis Lab",
    overviewBn: "তড়িৎ বিশ্লেষ্য বনাম অবিশ্লেষ্য, গলিত NaCl এর ডাউনস পদ্ধতি এবং জলীয় ব্রাইন দ্রবণের ক্লোর-ক্ষার প্রক্রিয়া।",
    overviewEn: "Electrolytic conduction mechanisms, molten NaCl Downs cell, and brine chlor-alkali electrolysis.",
    studyTipBn: "ক্যাথোডে সর্বদা বিজারণ (ইলেকট্রন গ্রহণ) এবং অ্যানোডে সর্বদা জারণ (ইলেকট্রন বর্জন) ঘটে!",
    studyTipEn: "Reduction occurs at the cathode, while oxidation occurs at the anode across all electrochemical cells!",
    badgeText: "তড়িৎ বিশ্লেষণ ল্যাব",
  },
  4: {
    no: "০৪",
    titleBn: "গ্যালভানিক কোষ ও ড্যানিয়েল সেল ল্যাব",
    titleEn: "Galvanic Cells & Daniell Cell Mechanism Lab",
    overviewBn: "রাসায়নিক শক্তি থেকে বিদ্যুৎ উৎপাদন, Zn অ্যানোড, Cu ক্যাথোড এবং লবণ সেতুর (Salt Bridge) কাজ।",
    overviewEn: "Electricity from spontaneous chemical reactions, Zn anode, Cu cathode, and salt bridge ion neutrality.",
    studyTipBn: "লবণ সেতু দুই অর্ধকোষের মধ্যে সংযোগ স্থাপন করে এবং দ্রবণে আয়নের ভারসাম্য বজায় রাখে!",
    studyTipEn: "The salt bridge maintains electrical neutrality by supplying mobile ions to both half-cells!",
    badgeText: "ড্যানিয়েল সেল ও লবণ সেতু",
  },
  5: {
    no: "০৫",
    titleBn: "ড্রাই সেল (শুষ্ক কোষ) ও ব্যাটারির ব্যবহার",
    titleEn: "Dry Cell Battery Anatomy & Electroplating",
    overviewBn: "দস্তা সিলিন্ডার (অ্যানোড), কার্বন দণ্ড (ক্যাথোড), NH₄Cl পেস্ট এবং তড়িৎলেপন (ইলেক্ট্রোপ্লেটিং) প্রক্রিয়া।",
    overviewEn: "Zinc anode can, carbon rod cathode, MnO2/NH4Cl paste in Leclanché dry cells and electroplating.",
    studyTipBn: "শুষ্ক কোষে বিভব পার্থক্য বা ভোল্টেজ হয় ১.৫ ভোল্ট (1.5 V)!",
    studyTipEn: "A commercial standard dry cell produces a terminal electromotive force of 1.5 Volts!",
    badgeText: "ড্রাই সেল ও তড়িৎলেপন",
  },
};

export function ChemistryEnergyGuidebook() {
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
        ? 'স্বাগতম রসায়ন ও শক্তি ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Chemistry & Energy Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_8_LESSONS[activeLesson] || CHAPTER_8_LESSONS[1];
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
          chapter: '8 - রসায়ন ও শক্তি (Chemistry & Energy)',
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
          { role: 'ai', text: isBn ? 'রসায়ন ও শক্তি অধ্যায়ে রাসায়নিক বন্ধন ভাঙা ও গড়ার সাথে তাপীয় পরিবর্তন (ΔH) এবং তড়িৎকোষের রাসায়নিক-বিদ্যুৎ রূপান্তর আলোচিত হয়।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ৮: রসায়ন ও শক্তি (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. বিক্রিয়া তাপ (ΔH):\n   - ΔH = B₁ (ভাঙার শক্তি) - B₂ (গড়ার শক্তি)\n   - ΔH < 0 হলে তাপোৎপাদী; ΔH > 0 হলে তাপহারী।\n২. তড়িৎ কোষ:\n   - তড়িৎ বিশ্লেষ্য কোষ: বিদ্যুৎ শক্তি → রাসায়নিক শক্তি।\n   - গ্যালভানিক কোষ (ড্যানিয়েল সেল): রাসায়নিক শক্তি → বিদ্যুৎ শক্তি।\n৩. সেল বিক্রিয়া:\n   - অ্যানোড: জারণ (ইলেকট্রন ত্যাগ)\n   - ক্যাথোড: বিজারণ (ইলেকট্রন গ্রহণ)\n   - শুষ্ক কোষ (Dry Cell): ১.৫ V, জিংক কন্টেইনার অ্যানোড, কার্বন রড ক্যাথোড।`
      : `SSC Chemistry Chapter 8: Chemistry & Energy Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1: Bond Energy Calculator
  const [selectedReactionId, setSelectedReactionId] = useState<string>('ch4_cl2');

  // Simulator 2: Daniell Cell Lab
  const [isSaltBridgeConnected, setIsSaltBridgeConnected] = useState<boolean>(true);
  const [isCellDischarging, setIsCellDischarging] = useState<boolean>(false);

  // Simulator 3: Dry Cell Anatomy
  const [selectedDryCellPart, setSelectedDryCellPart] = useState<'zinc' | 'graphite' | 'paste' | 'cap'>('zinc');

  // Simulator 4: Electroplating Lab
  const [electroplateProgress, setElectroplateProgress] = useState<number>(0);
  const [isPlating, setIsPlating] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // CQ Rubric Accordion
  const [openRubric, setOpenRubric] = useState<string | null>('c');

  const currentBondReaction =
    BOND_REACTIONS.find((r) => r.id === selectedReactionId) || BOND_REACTIONS[0];

  // Calculate B1 and B2
  const totalB1 = currentBondReaction.b1Broken.reduce(
    (acc, curr) => acc + curr.count * curr.energy,
    0
  );
  const totalB2 = currentBondReaction.b2Formed.reduce(
    (acc, curr) => acc + curr.count * curr.energy,
    0
  );

  // Plating trigger
  const runPlating = () => {
    setIsPlating(true);
    setElectroplateProgress(0);
    const interval = setInterval(() => {
      setElectroplateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlating(false);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-blue-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={8}
        chapterTitleBn="রসায়ন ও শক্তি"
        chapterTitleEn="Chemistry & Energy"
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
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                  <span className="text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    CHAPTER 08
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'রসায়ন ও শক্তি' : 'Chemistry & Energy'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = CHAPTER_8_LESSONS[lNum];
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
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 shadow-xs'
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
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300">
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
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় 8 (পৃষ্ঠা ১৭৩ - ২০৭) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 8 (Printed pp. ১৭৩ - ২০৭) aligned with NCTB syllabus.'}
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
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-500/20">
                  <BatteryCharging className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 08 • পাঠ ${currentLessonMeta.no}` : `Chapter 08 • Lesson ${activeLesson}`}
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
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
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
          {/* Section 8.1: Chemical Energy & Bond Enthalpy */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৮.১ রাসায়নিক শক্তি ও বন্ধন শক্তি (Bond Energy & ΔH)'
                    : '8.1 Chemical Energy & Bond Enthalpy (ΔH)'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'বন্ধন ভাঙার মোট শক্তি (B₁) এবং বন্ধন গড়ার মোট শক্তি (B₂) এর গাণিতিক সম্পর্ক'
                    : 'Mathematical relationship between bond breaking (B₁) and bond formation (B₂)'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formula & Rule */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">বিক্রিয়া তাপের সার্বজনীন সূত্র</h3>
                <div className="p-3 rounded-xl bg-muted/40 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="\Delta H = B_1 - B_2" />
                </div>
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p>
                    • <strong>B₁:</strong> বিক্রিয়কসমূহের মোট বন্ধন ভাঙার শক্তি (শোষিত শক্তি)।
                  </p>
                  <p>
                    • <strong>B₂:</strong> উৎপাদসমূহের মোট বন্ধন গঠনের শক্তি (নির্গত শক্তি)।
                  </p>
                  <p className="pt-1">
                    • যদি <strong>B₁ &lt; B₂</strong> হয় ⟹ <strong>ΔH ঋণাত্মক (-)</strong> ⟹ <strong>তাপোৎপাদী বিক্রিয়া</strong>।
                  </p>
                  <p>
                    • যদি <strong>B₁ &gt; B₂</strong> হয় ⟹ <strong>ΔH ধনাত্মক (+)</strong> ⟹ <strong>তাপহারী বিক্রিয়া</strong>।
                  </p>
                </div>
              </div>

              {/* Standard Bond Values */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">গুরুত্বপূর্ণ বন্ধন শক্তির মান (kJ/mol)</h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-muted/30">C-H : ৪১৪ kJ</div>
                  <div className="p-2 rounded-lg bg-muted/30">Cl-Cl : ২৪৪ kJ</div>
                  <div className="p-2 rounded-lg bg-muted/30">C-Cl : ৩২৬ kJ</div>
                  <div className="p-2 rounded-lg bg-muted/30">H-Cl : ৪৩১ kJ</div>
                  <div className="p-2 rounded-lg bg-muted/30">O=O : ৪৯৮ kJ</div>
                  <div className="p-2 rounded-lg bg-muted/30">O-H : ৪৬৪ kJ</div>
                  <div className="p-2 rounded-lg bg-muted/30">C=O : ৭৪৫ kJ</div>
                  <div className="p-2 rounded-lg bg-muted/30">N≡N : ৯৪৫ kJ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8.2: Electrochemical Cells (Galvanic vs Electrolytic) */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৮.২ তড়িৎ-রাসায়নিক কোষ: গ্যালভানিক বনাম তড়িৎ বিশ্লেষ্য'
                    : '8.2 Electrochemical Cells: Galvanic vs Electrolytic'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'রাসায়নিক শক্তি থেকে বিদ্যুৎ বনাম বিদ্যুৎ থেকে রাসায়নিক রূপান্তর'
                    : 'Chemical energy to electricity vs electricity driven chemical reactions'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Galvanic Cell */}
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 bg-blue-500/15 px-2 py-0.5 rounded">
                    রাসায়নিক শক্তি ➔ বিদ্যুৎ
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">ড্যানিয়েল সেল</span>
                </div>
                <h3 className="text-base font-bold text-foreground">১. গ্যালভানিক কোষ (Galvanic Cell)</h3>
                <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                  <p>• স্বতঃস্ফূর্ত রাসায়নিক বিক্রিয়ার মাধ্যমে বিদ্যুৎ শক্তি তৈরি হয়।</p>
                  <p>• <strong>অ্যানোড (-):</strong> জারণ ঘটে (ইলেকট্রন ত্যাগ, যেমন Zn দণ্ড ক্ষয়প্রাপ্ত হয়)।</p>
                  <p>• <strong>ক্যাথোড (+):</strong> বিজারণ ঘটে (ইলেকট্রন গ্রহণ, যেমন Cu জমা হয়)।</p>
                  <p>• বহির্বর্তনীতে ইলেকট্রন অ্যানোড (-) থেকে ক্যাথোডে (+) প্রবাহিত হয়।</p>
                </div>
              </div>

              {/* Electrolytic Cell */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-500/15 px-2 py-0.5 rounded">
                    বিদ্যুৎ ➔ রাসায়নিক শক্তি
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">ইলেকট্রোপ্লেটিং</span>
                </div>
                <h3 className="text-base font-bold text-foreground">২. তড়িৎ বিশ্লেষ্য কোষ (Electrolytic Cell)</h3>
                <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                  <p>• বাইরে থেকে বিদ্যুৎ শক্তি দিয়ে রাসায়নিক বিক্রিয়া ঘটানো হয়।</p>
                  <p>• <strong>অ্যানোড (+):</strong> ব্যাটারির পজিটিভে যুক্ত (জারণ ঘটে)।</p>
                  <p>• <strong>ক্যাথোড (-):</strong> ব্যাটারির নেগেটিভে যুক্ত (বিজারণ ঘটে)।</p>
                  <p>• ধাতু নিষ্কাশন ও ইলেকট্রোপ্লেটিং-এ ব্যবহৃত হয়।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8.3: Dry Cell & Nuclear Power */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৮.৩ ড্রাই সেল ও রূপপুর পারমাণবিক শক্তি'
                    : '8.3 Dry Cell & Nuclear Fission Energy'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? '১.৫ ভোল্ট ব্যাটারির অভ্যন্তরীণ কাঠামো এবং ফিশন চেইন রিঅ্যাকশন'
                    : 'Internal structure of 1.5V dry cells and Rooppur nuclear plant fission'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h4 className="font-bold text-foreground text-sm">ড্রাই সেল (১.৫ V) এর মূল উপাদান</h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>• <strong>অ্যানোড:</strong> দস্তার পাত্র (Zn casing)।</li>
                  <li>• <strong>ক্যাথোড:</strong> মাঝে কার্বন/গ্রাফাইট দণ্ড ও পিতলের টুপি।</li>
                  <li>• <strong>তড়িৎ বিশ্লেষ্য পেস্ট:</strong> NH₄Cl, ZnCl₂ ও MnO₂ এর কাই বা লেই।</li>
                  <li>• <strong>বিভব:</strong> ১.৫ ভোল্ট নির্দিষ্ট বিভব প্রদান করে।</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h4 className="font-bold text-foreground text-sm">রূপপুর পারমাণবিক ফিশন বিদ্যুৎ</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  পাবনার রূপপুরে পদ্মার তীরে রাশিয়ার সহায়তায় ২৪০০ মেগাওয়াটের রূপপুর পারমাণবিক বিদ্যুৎকেন্দ্র স্থাপিত হচ্ছে। এখানে ধীরগতির নিউট্রন দিয়ে ইউরেনিয়াম-২৩৫ কে আঘাত করে ফিশন চেইন রিঅ্যাকশনের মাধ্যমে বিপুল তাপশক্তি উৎপন্ন করা হয়, যা দিয়ে টারবাইন ঘুরিয়ে বিদ্যুৎ তৈরি হয়।
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
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? 'বোর্ড ভিত্তিক গাণিতিক সমস্যা সমাধান'
                    : 'Board Mathematical Worked Problems & Solutions'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'বন্ধন শক্তি ও ড্যানিয়েল কোষ সংক্রান্ত বোর্ড সৃজনশীলের মডেল উত্তর'
                    : 'Official marking steps for ΔH calculation and Daniell cell operations'}
                </p>
              </div>
            </div>

            {/* Problem 1 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">সমস্যা ০১ (বন্ধন শক্তি থেকে ΔH গণনা)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                  ৩ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                <RenderMathText text="\text{CH}_4 + \text{Cl}_2 \xrightarrow{h\nu} \text{CH}_3\text{Cl} + \text{HCl}" /> বিক্রিয়াটির বিক্রিয়া তাপ (ΔH) গণনা করো। (দেওয়া আছে: C-H = ৪১৪ kJ, Cl-Cl = ২৪৪ kJ, C-Cl = ৩২৬ kJ, H-Cl = ৪৩১ kJ)।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-2 text-foreground">
                  <p>
                    ১. বিক্রিয়কসমূহের মোট বন্ধন ভাঙার শক্তি (B₁):
                    <br />
                    • ১টি C-H বন্ধন ভাঙার শক্তি = ৪১৪ kJ
                    <br />
                    • ১টি Cl-Cl বন্ধন ভাঙার শক্তি = ২৪৪ kJ
                    <br />
                    <span className="font-bold">B₁ = ৪১৪ + ২৪৪ = ৬৫৮ kJ</span>
                  </p>
                  <div className="border-t border-border/60 my-1" />
                  <p>
                    ২. উৎপাদসমূহের মোট বন্ধন গড়ার শক্তি (B₂):
                    <br />
                    • ১টি C-Cl বন্ধন গড়ার শক্তি = ৩২৬ kJ
                    <br />
                    • ১টি H-Cl বন্ধন গড়ার শক্তি = ৪৩১ kJ
                    <br />
                    <span className="font-bold">B₂ = ৩২৬ + ৪৩১ = ৭৫৭ kJ</span>
                  </p>
                  <div className="border-t border-border/60 my-1" />
                  <p className="text-blue-700 dark:text-blue-300 font-bold">
                    ৩. বিক্রিয়া তাপ, ΔH = B₁ - B₂ = ৬৫৮ - ৭৫৭ = -৯৯ kJ/mol।
                  </p>
                </div>
                <p>
                  <strong>মন্তব্য:</strong> যেহেতু ΔH এর মান ঋণাত্মক (-৯৯ kJ/mol), তাই বিক্রিয়াটি একটি তাপোৎপাদী বিক্রিয়া।
                </p>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600">সমস্যা ০২ (ড্যানিয়েল সেল কোষ বিক্রিয়া)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                  ৪ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                একটি ড্যানিয়েল কোষে জিঙ্ক ও কপার তড়িৎদ্বারের অর্ধ-বিক্রিয়া এবং মোট কোষ বিক্রিয়া সমীকরণসহ লেখো।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-2 text-foreground">
                  <p>
                    • অ্যানোড অর্ধ-বিক্রিয়া (জারণ):
                    <br />
                    Zn(s) → Zn²⁺(aq) + 2e⁻ (অ্যানোডে জিঙ্ক দণ্ড ক্ষয়প্রাপ্ত হয়)
                  </p>
                  <p>
                    • ক্যাথোড অর্ধ-বিক্রিয়া (বিজারণ):
                    <br />
                    Cu²⁺(aq) + 2e⁻ → Cu(s) (ক্যাথোডে কপার দণ্ডের উপর লালচে কপার জমা হয়)
                  </p>
                  <div className="border-t border-border/60 my-1" />
                  <p className="text-blue-700 dark:text-blue-300 font-bold">
                    • সামগ্রিক কোষ বিক্রিয়া (Cell Reaction):
                    <br />
                    Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)
                    <br />
                    প্রমিত কোষ বিভব E°cell = ১.১০ ভোল্ট
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
          {/* SIMULATOR 1: Bond Energy Calculator (ΔH = B1 - B2) */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Flame className="h-5 w-5 text-blue-500" />
                  {isBn
                    ? '১. বন্ধন শক্তি ও বিক্রিয়া তাপ ক্যালকুলেটর (ΔH = B₁ - B₂)'
                    : '1. Bond Enthalpy Calculator (ΔH = B₁ - B₂)'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'যেকোনো বিক্রিয়া সিলেক্ট করে বন্ধন ভাঙা ও গড়ার শক্তির লাইভ তুলনা ও ΔH এর মান দেখো।'
                    : 'Compare bond breaking energy vs bond formation energy to determine ΔH.'}
                </p>
              </div>

              {/* Reaction Selector */}
              <div className="flex flex-wrap gap-1.5">
                {BOND_REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReactionId(r.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedReactionId === r.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {r.nameBn}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Equation & Outcome Card */}
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                <span className="text-xs font-bold text-muted-foreground">বিক্রিয়ার সমীকরণ:</span>
                <div className="p-3 rounded-xl bg-background border border-border/60 font-mono text-sm text-foreground text-center font-bold">
                  <RenderMathText text={currentBondReaction.equation} />
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    বিক্রিয়া তাপ (ΔH)
                  </span>
                  <span className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400">
                    {currentBondReaction.deltaH} kJ/mol
                  </span>
                  <span className="text-xs font-bold text-emerald-600 block">
                    {currentBondReaction.typeBn}
                  </span>
                </div>
              </div>

              {/* B1 vs B2 Visual Comparison */}
              <div className="md:col-span-2 p-5 rounded-2xl border border-border/70 bg-muted/20 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* B1 Broken */}
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                        বন্ধন ভাঙতে শোষিত (B₁)
                      </span>
                      <span className="text-base font-black text-rose-600 font-mono">{totalB1} kJ</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                      {currentBondReaction.b1Broken.map((b, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{b.count} × {b.bond} ({b.energy}):</span>
                          <span className="font-bold text-foreground">{b.count * b.energy} kJ</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* B2 Formed */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        বন্ধন গড়তে নির্গত (B₂)
                      </span>
                      <span className="text-base font-black text-emerald-600 font-mono">{totalB2} kJ</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                      {currentBondReaction.b2Formed.map((b, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{b.count} × {b.bond} ({b.energy}):</span>
                          <span className="font-bold text-foreground">{b.count * b.energy} kJ</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border/60 text-xs font-mono text-center text-foreground">
                  ΔH = B₁ - B₂ = {totalB1} - {totalB2} = <strong>{currentBondReaction.deltaH} kJ/mol</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR 2: Daniell Cell & Salt Bridge Virtual Lab */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <BatteryCharging className="h-5 w-5 text-blue-500" />
                  {isBn
                    ? '২. ড্যানিয়েল সেল ও লবণ সেতু ভার্চুয়াল ল্যাব'
                    : '2. Daniell Cell & Salt Bridge Virtual Lab'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'লবণ সেতু যুক্ত/বিযুক্ত করে দেখো কীভাবে অভ্যন্তরীণ বর্তনী ও ১.১০ ভোল্ট বিদ্যুৎ উৎপাদন নিয়ন্ত্রিত হয়।'
                    : 'Toggle the salt bridge to observe its role in maintaining electrical neutrality and 1.10V flow.'}
                </p>
              </div>

              {/* Salt bridge toggle */}
              <button
                onClick={() => setIsSaltBridgeConnected(!isSaltBridgeConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSaltBridgeConnected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isSaltBridgeConnected ? 'লবণ সেতু যুক্ত (Connected)' : 'লবণ সেতু বিচ্ছিন্ন (Disconnected)'}
              </button>
            </div>

            {/* Cell Chamber */}
            <div className="relative h-64 rounded-2xl border border-border/80 bg-slate-900 overflow-hidden flex flex-col items-center justify-between p-6">
              {/* Voltmeter on Top */}
              <div className="flex flex-col items-center">
                <div className="px-5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-center font-mono">
                  <span className="text-xs text-slate-400 block text-[10px]">ভোল্টমিটার রিডিং</span>
                  <span
                    className={`text-2xl font-black ${
                      isSaltBridgeConnected ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {isSaltBridgeConnected ? '1.10 V' : '0.00 V'}
                  </span>
                </div>
              </div>

              {/* Two Beakers & Salt Bridge in center */}
              <div className="flex items-end justify-center gap-8 sm:gap-16 w-full relative">
                {/* Zn Beaker */}
                <div className="w-36 h-28 rounded-b-2xl border-2 border-slate-600 bg-cyan-950/40 relative flex items-center justify-center">
                  <div className="w-5 h-24 bg-slate-300 rounded-t absolute -top-4 left-6" />
                  <span className="text-[10px] text-slate-200 z-10 font-bold mt-8">
                    Zn দণ্ড + ZnSO₄ দ্রবণ
                  </span>
                </div>

                {/* Salt Bridge (U-tube in middle) */}
                {isSaltBridgeConnected && (
                  <div className="absolute top-0 w-24 h-16 border-t-4 border-l-4 border-r-4 border-amber-400/80 rounded-t-xl z-20 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-amber-300 bg-slate-950 px-1 rounded">
                      KCl লবণ সেতু
                    </span>
                  </div>
                )}

                {/* Cu Beaker */}
                <div className="w-36 h-28 rounded-b-2xl border-2 border-slate-600 bg-blue-950/40 relative flex items-center justify-center">
                  <div className="w-5 h-24 bg-amber-600 rounded-t absolute -top-4 right-6" />
                  <span className="text-[10px] text-slate-200 z-10 font-bold mt-8">
                    Cu দণ্ড + CuSO₄ দ্রবণ
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground">
              {isSaltBridgeConnected ? (
                <span>
                  💡 <strong>লবণ সেতু সক্রিয়:</strong> বহির্বর্তনী দিয়ে জিংক থেকে কপারে ইলেকট্রন ধাবিত হচ্ছে এবং ভোল্টমিটারে ১.১০ ভোল্ট পাওয়া যাচ্ছে। লবণ সেতুর K⁺ ও Cl⁻ আয়নগুলি উভয় দ্রবণের নিরপেক্ষতা রক্ষা করছে।
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  ⚠️ লবণ সেতু বিচ্ছিন্ন থাকায় কোষের অভ্যন্তরীণ বর্তনী অসম্পূর্ণ। ফলে কোনো বিদ্যুৎ প্রবাহিত হচ্ছে না (০.০০ V)।
                </span>
              )}
            </div>
          </div>

          {/* SIMULATOR 3: Electroplating Virtual Chamber */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  {isBn
                    ? '৩. চামচে রূপার তড়িৎ প্রলেপন (Silver Electroplating Lab)'
                    : '3. Silver Electroplating on Iron Spoon Lab'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'অ্যানোড (Ag) ক্ষয় এবং ক্যাথোড (লোহার চামচ)-এ চকচকে রূপার স্তর জমার দৃশ্য দেখো।'
                    : 'Observe Ag oxidize at anode and deposit as lustrous silver coating on cathode.'}
                </p>
              </div>

              <button
                onClick={runPlating}
                disabled={isPlating}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{isPlating ? 'প্রলেপন চলছে...' : 'প্রলেপন শুরু করুন (Start Plating)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Plating visual chamber */}
              <div className="h-56 rounded-2xl border border-border/80 bg-slate-900 flex items-center justify-around p-6 relative">
                {/* Anode Ag Plate */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-28 bg-slate-300 rounded shadow-md border border-slate-400" />
                  <span className="text-[10px] text-slate-300 font-bold mt-2">অ্যানোড (+) রূপার পাত</span>
                </div>

                {/* Progress in center */}
                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-blue-400 block">
                    প্রলেপের ঘনত্ব: {electroplateProgress}%
                  </span>
                  <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden mt-1 mx-auto">
                    <div
                      style={{ width: `${electroplateProgress}%` }}
                      className="h-full bg-blue-500 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Cathode Spoon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-28 rounded-b-2xl border transition-colors duration-500 flex items-center justify-center ${
                      electroplateProgress > 50
                        ? 'bg-slate-100 border-white shadow-lg shadow-white/30' // Silver plated!
                        : 'bg-slate-700 border-slate-600' // Iron
                    }`}
                  >
                    <span className="text-[9px] font-bold text-black rotate-90">চামচ</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-bold mt-2">ক্যাথোড (-) লোহার চামচ</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 space-y-1">
                  <strong className="text-foreground block">তড়িৎদ্বারের বিক্রিয়া:</strong>
                  <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                    অ্যানোড (+): Ag(s) → Ag⁺(aq) + e⁻
                  </p>
                  <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                    ক্যাথোড (-): Ag⁺(aq) + e⁻ → Ag(s) (চামচে জমা হয়)
                  </p>
                </div>
                <p>
                  💡 <em>নিয়ম: যার প্রলেপ দিতে হবে তা অ্যানোডে এবং যার ওপর প্রলেপ দিতে হবে তা ক্যাথোডে রাখতে হবে।</em>
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
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
                      ? 'বন্ধন শক্তি ও তড়িৎ রাসায়নিক কোষের গুরুত্বপূর্ণ বোর্ড প্রশ্নের মূল্যায়ন'
                      : 'Evaluation of key board questions on bond energy and electrochemistry'}
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
                      <span className="text-xs font-mono font-bold text-blue-600">
                        প্রশ্ন ০{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
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
                          btnStyle = 'border-blue-500 bg-blue-500/15 text-blue-800 dark:text-blue-200 font-bold';
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
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
              >
                {isBn ? 'উত্তর যাচাই করুন (Submit & Check Answers)' : 'Submit & Check Answers'}
              </button>
            )}

            {showResults && (
              <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-between">
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
                      ? 'অসাধারণ! রসায়ন ও শক্তি অধ্যায়ের সমস্ত মৌলিক ধারণা তোমার সম্পূর্ণ আয়ত্তে।'
                      : 'ব্যাখ্যাগুলো মনোযোগ দিয়ে দেখে দুর্বল জায়গাগুলো ঝালিয়ে নাও।'}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
              </button>

            {/* Stimulus */}
            <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-2">
              <span className="text-xs font-bold text-blue-600 block">উদ্দীপকটি লক্ষ্য করো:</span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                পাত্র-১: ZnSO₄ দ্রবণে Zn দণ্ড এবং CuSO₄ দ্রবণে Cu দণ্ড ডুবিয়ে লবণ সেতু ও তার দ্বারা যুক্ত করে একটি তড়িৎ কোষ গঠন করা হলো।
                <br />
                বিক্রিয়া-২: <RenderMathText text="\text{CH}_4 + \text{Cl}_2 \xrightarrow{h\nu} \text{CH}_3\text{Cl} + \text{HCl}" /> (C-H = ৪১৪, Cl-Cl = ২৪৪, C-Cl = ৩২৬, H-Cl = ৪৩১ kJ/mol)।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-600">
                      (ক) জ্ঞানমূলক [১]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">তড়িৎ বিশ্লেষ্য কাকে বলে?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'a' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'a' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> যেসকল পদার্থ গলিত বা দ্রবীভূত অবস্থায় আয়ন সৃষ্টির মাধ্যমে বিদ্যুৎ পরিবহন করে এবং বিদ্যুৎ পরিবহনের সাথে সাথে রাসায়নিকভাবে বিশ্লিষ্ট হয়ে নতুন পদার্থে পরিণত হয়, তাদেরকে তড়িৎ বিশ্লেষ্য (Electrolyte) বলে।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-600">
                      (খ) অনুধাবনমূলক [২]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">গ্যালভানিক কোষে লবণ সেতু ব্যবহারের প্রয়োজনীয়তা কী?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'b' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'b' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1.5">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> গ্যালভানিক কোষে অ্যানোড পাত্রে ধনাত্মক Zn²⁺ আয়নের আধিক্য ঘটে এবং ক্যাথোড পাত্রে SO₄²⁻ ঋণাত্মক আয়নের আধিক্য ঘটে।
                    </p>
                    <p>
                      লবণ সেতু (KCl বা KNO₃) এই বিপরীত আধানগুলোকে ক্যাটায়ন ও অ্যানায়ন সরবরাহ করে প্রশমিত করে এবং উভয় দ্রবণের তড়িৎ নিরপেক্ষতা বজায় রাখে। এটি অভ্যন্তরীণ বর্তনী পূর্ণ করে নিরবচ্ছিন্ন বিদ্যুৎ প্রবাহ নিশ্চিত করে।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-600">
                      (গ) প্রয়োগমূলক [৩]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের বিক্রিয়া-২ এর বিক্রিয়া তাপ (ΔH) গণনা করো এবং বিক্রিয়ার প্রকৃতি উল্লেখ করো।
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
                      <p>১. বন্ধন ভাঙার শক্তি B₁ = C-H + Cl-Cl = ৪১৪ + ২৪৪ = ৬৫৮ kJ [১ নম্বর]</p>
                      <p>২. বন্ধন গড়ার শক্তি B₂ = C-Cl + H-Cl = ৩২৬ + ৪৩১ = ৭৫৭ kJ [১ নম্বর]</p>
                      <p>৩. বিক্রিয়া তাপ ΔH = B₁ - B₂ = ৬৫৮ - ৭৫৭ = -৯৯ kJ/mol [১ নম্বর]</p>
                      <p className="text-blue-700 dark:text-blue-300 font-bold">
                        যেহেতু ΔH ঋণাত্মক (-৯৯ kJ/mol), তাই এটি তাপোৎপাদী বিক্রিয়া।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-600">
                      (ঘ) উচ্চতর দক্ষতা [৪]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের পাত্র-১ এর কোষটিতে কীভাবে বিদ্যুৎ উৎপন্ন হয়? অর্ধ-বিক্রিয়াসহ কার্যপদ্ধতি বিশ্লেষণ করো।
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
                      উদ্দীপকের পাত্র-১ এ গঠিত কোষটি একটি ড্যানিয়েল সেল (গ্যালভানিক কোষ)। এখানে স্বতঃস্ফূর্ত জারণ-বিজারণ বিক্রিয়া থেকে বিদ্যুৎ শক্তি উৎপন্ন হয়।
                    </p>
                    <p>
                      <strong>১. অ্যানোডে জারণ বিক্রিয়া:</strong> জিঙ্ক কপার অপেক্ষা অধিক সক্রিয় হওয়ায় জিঙ্ক দণ্ড ইলেকট্রন ত্যাগ করে জারিত হয়:
                      <br />
                      <span className="font-mono text-foreground font-bold">Zn(s) → Zn²⁺(aq) + 2e⁻</span>
                      <br />
                      এই মুক্ত ইলেকট্রন দুটি বহির্বর্তনীর তারের মধ্য দিয়ে অ্যানোড থেকে ক্যাথোডের দিকে প্রবাহিত হয়।
                    </p>
                    <p>
                      <strong>২. ক্যাথোডে বিজারণ বিক্রিয়া:</strong> কপার সালফেট দ্রবণের Cu²⁺ আয়নগুলি ক্যাথোডে গিয়ে সেই আগত ইলেকট্রন গ্রহণ করে নিস্তড়িৎ কপার ধাতুতে পরিণত হয়:
                      <br />
                      <span className="font-mono text-foreground font-bold">Cu²⁺(aq) + 2e⁻ → Cu(s)</span>
                    </p>
                    <p className="font-bold text-blue-700 dark:text-blue-300">
                      সামগ্রিক বিক্রিয়া: Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)। ইলেকট্রনের এই অব্যাহত প্রবাহের ফলেই বহির্বর্তনীতে ১.১০ ভোল্ট বিদ্যুৎ শক্তি উৎপন্ন হয়।
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
              {isBn ? 'অধ্যায় ০৮ রিভিশন চেকলিস্ট' : 'Chapter 08 Revision Checklist'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { labelBn: 'বন্ধন শক্তি থেকে ΔH = B₁ - B₂ সূত্র প্রয়োগ', ok: true },
                { labelBn: 'গ্যালভানিক বনাম তড়িৎ বিশ্লেষ্য কোষের পার্থক্য', ok: true },
                { labelBn: 'ড্যানিয়েল কোষের অ্যানোড ও ক্যাথোড অর্ধ-বিক্রিয়া', ok: true },
                { labelBn: 'ড্যানিয়েল কোষে লবণ সেতুর ভূমিকা ও ১.১০ V বিভব', ok: true },
                { labelBn: 'ড্রাই সেলের গঠন (Zn অ্যানোড, গ্রাফাইট ক্যাথোড, ১.৫ V)', ok: true },
                { labelBn: 'তড়িৎ প্রলেপন (ইলেকট্রোপ্লেটিং) মেকানিজম', ok: true },
                { labelBn: 'রূপপুর পারমাণবিক ফিশন চেইন রিঅ্যাকশন', ok: true },
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
        chapterNumberBn="অধ্যায় 08"
        chapterNumberEn="Chapter 08"
        chapterTitleBn="রসায়ন ও শক্তি"
        chapterTitleEn="Chemistry & Energy"
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
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {isBn ? 'অধ্যায় 8 বিশেষজ্ঞ' : 'Chapter 8 Specialist'}
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
                  ? 'bg-blue-600 text-white ml-6 rounded-tr-xs'
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
              placeholder={isBn ? 'রসায়ন ও শক্তি নিয়ে প্রশ্ন করো...' : 'Ask about Chemistry & Energy...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 shrink-0"
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
