'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PanelLeftClose, PanelLeftOpen, FlaskConical, HelpCircle, Lightbulb, X,
  Flame,
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
  Check,
  Zap,
  Activity,
  Boxes,
  Compass,
  Factory,
  Beaker,
  TestTube,
  Pipette,
  Atom,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';
import { RenderMathText } from '@/components/render-math-text';

type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Petroleum Fractional Distillation Fractions
interface DistillationFraction {
  id: string;
  nameBn: string;
  nameEn: string;
  tempRangeBn: string;
  tempRangeEn: string;
  carbonChain: string;
  percentageBn: string;
  percentageEn: string;
  usesBn: string;
  usesEn: string;
  colorHex: string;
}

const FRACTIONS: DistillationFraction[] = [
  {
    id: 'lpg',
    nameBn: 'পেট্রোলিয়াম গ্যাস (LPG)',
    nameEn: 'Petroleum Gas (LPG)',
    tempRangeBn: '০°C - ২০°C',
    tempRangeEn: '0°C - 20°C',
    carbonChain: 'C₁ - C₄',
    percentageBn: '২%',
    percentageEn: '2%',
    usesBn: 'সিলিন্ডারে এলপি গ্যাস হিসেবে রান্নার কাজে ও এলপিজি অটোগ্যাস হিসেবে জ্বালানি।',
    usesEn: 'Bottled LPG for domestic cooking and automotive fuel.',
    colorHex: '#38bdf8',
  },
  {
    id: 'petrol',
    nameBn: 'পেট্রোল / গ্যাসোলিন (Petrol)',
    nameEn: 'Petrol / Gasoline',
    tempRangeBn: '২১°C - ৭০°C',
    tempRangeEn: '21°C - 70°C',
    carbonChain: 'C₅ - C₈',
    percentageBn: '৫%',
    percentageEn: '5%',
    usesBn: 'মোটরগাড়ি ও হালকা যানবাহনের প্রধান উচ্চ-দক্ষতাসম্পন্ন জ্বালানি।',
    usesEn: 'Primary high-octane fuel for motor cars and light vehicles.',
    colorHex: '#fbbf24',
  },
  {
    id: 'naphtha',
    nameBn: 'ন্যাপথা (Naphtha)',
    nameEn: 'Naphtha',
    tempRangeBn: '৭১°C - ১২০°C',
    tempRangeEn: '71°C - 120°C',
    carbonChain: 'C₇ - C₁₄',
    percentageBn: '১০%',
    percentageEn: '10%',
    usesBn: 'পেট্রোকেমিক্যাল শিল্পে পলিমার ও বিভিন্ন প্লাস্টিক তৈরির মূল কাঁচামাল।',
    usesEn: 'Feedstock for petrochemical cracking to produce plastics & solvents.',
    colorHex: '#f97316',
  },
  {
    id: 'kerosene',
    nameBn: 'কেরোসিন (Kerosene)',
    nameEn: 'Kerosene (Jet Fuel)',
    tempRangeBn: '১২১°C - ১৭০°C',
    tempRangeEn: '121°C - 170°C',
    carbonChain: 'C₁₁ - C₁₆',
    percentageBn: '১৩%',
    percentageEn: '13%',
    usesBn: 'জেট বিমানের জ্বালানি (অ্যাভিয়েশন ফুয়েল) এবং গ্রামীণ হারিকেনের জ্বালানি।',
    usesEn: 'Jet engine aircraft fuel and domestic lighting fuel.',
    colorHex: '#34d399',
  },
  {
    id: 'diesel',
    nameBn: 'ডিজেল (Diesel Oil)',
    nameEn: 'Diesel Oil',
    tempRangeBn: '১৭১°C - ২৭০°C',
    tempRangeEn: '171°C - 270°C',
    carbonChain: 'C₁₆ - C₂₀',
    percentageBn: '১৭%',
    percentageEn: '17%',
    usesBn: 'বাস, ট্রাক, ট্রেন ও ভারী নৌযানের প্রধান জ্বালানি ও জেনারেটরে ব্যবহৃত।',
    usesEn: 'Heavy duty fuel for buses, trucks, trains and power generators.',
    colorHex: '#818cf8',
  },
  {
    id: 'lubricating',
    nameBn: 'লুব্রিকেটিং তেল ও মোম',
    nameEn: 'Lubricating Oil & Paraffin Wax',
    tempRangeBn: '২৭১°C - ৩৪০°C',
    tempRangeEn: '271°C - 340°C',
    carbonChain: 'C₂₀ - C₃₀',
    percentageBn: '১৮%',
    percentageEn: '18%',
    usesBn: 'কলকব্জার পিচ্ছিলকারক মবিল, প্যারাফিন মোমবাতি ও ভ্যাসলিন তৈরিতে।',
    usesEn: 'Engine lubricants, paraffin candles and petroleum jelly.',
    colorHex: '#c084fc',
  },
  {
    id: 'bitumen',
    nameBn: 'পিচ বা বিটুমিন (Pitch/Bitumen)',
    nameEn: 'Bitumen / Pitch',
    tempRangeBn: '> ৩৪০°C (অবশেষ)',
    tempRangeEn: '> 340°C (Residue)',
    carbonChain: '> C₃₀',
    percentageBn: '৩৫%',
    percentageEn: '35%',
    usesBn: 'পাকা রাস্তা তৈরির কাজে পিচ ঢালাই এবং ছাদের জলরোধী প্রলেপে।',
    usesEn: 'Road surface asphalt paving and roof waterproofing.',
    colorHex: '#475569',
  },
];

// 5 Authentic Board MCQs for Chapter 11
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
    questionBn: 'প্রাকৃতিক গ্যাসে মিথেনের (CH₄) পরিমাণ শতকরা কত ভাগ?',
    questionEn: 'What is the percentage of methane (CH₄) in natural gas?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২৩, রাজশাহী ২০২২ (পাঠ্যবই পৃষ্ঠা ২৬৩)',
    boardInfoEn: 'Dhaka Board 2023, Rajshahi 2022 (Textbook p. 263)',
    options: [
      { key: 'A', textBn: '৫০-৬০%', textEn: '50-60%' },
      { key: 'B', textBn: '৭০-৮০%', textEn: '70-80%' },
      { key: 'C', textBn: '৮০-৯০%', textEn: '80-90%' },
      { key: 'D', textBn: '৯৯.৯%', textEn: '99.9%' },
    ],
    correctKey: 'C',
    explanationBn:
      'প্রাকৃতিক গ্যাসে প্রধানত মিথেন থাকে ৮০% থেকে ৯০%। তবে বাংলাদেশে প্রাপ্ত প্রাকৃতিক গ্যাসে মিথেনের পরিমাণ সর্বাধিক (প্রায় ৯৯.৯৯%) হওয়ায় এটি অত্যন্ত উন্নত মানের জ্বালানি।',
    explanationEn:
      'Natural gas typically contains 80% to 90% methane. In Bangladesh, gas fields produce exceptionally pure natural gas containing up to 99.99% methane.',
  },
  {
    id: 2,
    questionBn: 'নিচের কোন হাইড্রোকার্বনটি ব্রোমিন দ্রবণের লাল বর্ণকে বর্ণহীন করতে পারে?',
    questionEn: 'Which hydrocarbon decolourizes red bromine water?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২৩, কুমিল্লা ২০২১ (পাঠ্যবই পৃষ্ঠা ২৮৫)',
    boardInfoEn: 'Dinajpur Board 2023, Cumilla 2021 (Textbook p. 285)',
    options: [
      { key: 'A', textBn: 'C₂H₆ (ইথেন)', textEn: 'C₂H₆ (Ethane)' },
      { key: 'B', textBn: 'C₃H₈ (প্রোপেন)', textEn: 'C₃H₈ (Propane)' },
      { key: 'C', textBn: 'C₂H₄ (ইথিন)', textEn: 'C₂H₄ (Ethene)' },
      { key: 'D', textBn: 'CH₄ (মিথেন)', textEn: 'CH₄ (Methane)' },
    ],
    correctKey: 'C',
    explanationBn:
      'অসম্পৃক্ত হাইড্রোকার্বনে (অ্যালকিন বা অ্যালকাইন) দুর্বল পাই (π) বন্ধন থাকে যা সহজে ভেঙে লাল বর্ণের ব্রোমিনের সাথে দ্রুত সংযোজন বিক্রিয়া দেয় এবং বর্ণহীন ১,২-ডাইব্রোমোইথেন উৎপন্ন করে: CH₂=CH₂ + Br₂ → CH₂Br-CH₂Br। সম্পৃক্ত অ্যালকেনসমূহ ব্রোমিন দ্রবণের সাথে বিক্রিয়া করে না।',
    explanationEn:
      'Ethene (C₂H₄) contains an unsaturated double bond that reacts additively with red bromine water to form colourless 1,2-dibromoethane. Saturated alkanes do not react.',
  },
  {
    id: 3,
    questionBn: 'ডিকার্বক্সিলেশন বিক্রিয়ায় সোডিয়াম ইথানয়েট (CH₃COONa) এবং সোডা লাইমের মিশ্রণকে উত্তপ্ত করলে কোন গ্যাস উৎপন্ন হয়?',
    questionEn: 'Which gas is produced by heating sodium ethanoate with soda lime in decarboxylation?',
    boardInfoBn: 'চট্টগ্রাম বোর্ড ২০২২, যশোর ২০২০',
    boardInfoEn: 'Chattogram Board 2022, Jashore 2020',
    options: [
      { key: 'A', textBn: 'মিথেন (CH₄)', textEn: 'Methane (CH₄)' },
      { key: 'B', textBn: 'ইথেন (C₂H₆)', textEn: 'Ethane (C₂H₆)' },
      { key: 'C', textBn: 'ইথিন (C₂H₄)', textEn: 'Ethene (C₂H₄)' },
      { key: 'D', textBn: 'কার্বন ডাই-অক্সাইড (CO₂)', textEn: 'Carbon dioxide (CO₂)' },
    ],
    correctKey: 'A',
    explanationBn:
      'সোডিয়াম ইথানয়েটের সাথে সোডা লাইম (NaOH + CaO) মিশিয়ে উত্তপ্ত করলে কার্বক্সিলিক মূলকের কার্বন Na₂CO₃ হিসেবে অপসারিত হয় এবং মিথেন গ্যাস তৈরি হয়: CH₃COONa + NaOH(CaO) → CH₄↑ + Na₂CO₃। এটি অ্যালকেন প্রস্তুতির একটি সুপরিচিত পদ্ধতি।',
    explanationEn:
      'Decarboxylation removes the carboxylate carbon as sodium carbonate, yielding methane: CH₃COONa + NaOH(CaO) → CH₄↑ + Na₂CO₃.',
  },
  {
    id: 4,
    questionBn: 'ইথিন থেকে পলিথিন তৈরির জন্য প্রয়োজনীয় চাপ ও তাপমাত্রা কত?',
    questionEn: 'What temperature and pressure are required to produce polythene from ethene?',
    boardInfoBn: 'বরিশাল বোর্ড ২০২৩, ময়মনসিংহ ২০২২',
    boardInfoEn: 'Barishal Board 2023, Mymensingh 2022',
    options: [
      { key: 'A', textBn: '১ atm এবং ১০০°C', textEn: '1 atm and 100°C' },
      { key: 'B', textBn: '১০০০ atm এবং ২০০°C', textEn: '1000 atm and 200°C' },
      { key: 'C', textBn: '১৪০ atm এবং ১২০°C', textEn: '140 atm and 120°C' },
      { key: 'D', textBn: '২০০ atm এবং ৫০০°C', textEn: '200 atm and 500°C' },
    ],
    correctKey: 'B',
    explanationBn:
      'অল্প পরিমাণ অক্সিজেনের উপস্থিতিতে ইথিন গ্যাসকে ১০০০ বায়ুমণ্ডলীয় চাপে এবং ২০০°C তাপমাত্রায় উত্তপ্ত করলে সংযোজন পলিমারকরণের মাধ্যমে পলিথিন উৎপন্ন হয়: n(CH₂=CH₂) → -[-CH₂-CH₂-]-ₙ।',
    explanationEn:
      'Addition polymerization of ethene into polythene requires 1000 atm pressure and 200°C in the presence of trace oxygen catalyst.',
  },
  {
    id: 5,
    questionBn: 'ইথানলকে অম্লীয় পটাশিয়াম ডাইক্রোমেট (K₂Cr₂O₇ + H₂SO₄) দ্বারা তীব্রভাবে জারিত করলে চূড়ান্ত উৎপাদ কোনটি?',
    questionEn: 'What is the final product of oxidising ethanol with acidified K₂Cr₂O₇?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২২, সিলেট ২০২১',
    boardInfoEn: 'Dhaka Board 2022, Sylhet 2021',
    options: [
      { key: 'A', textBn: 'ইথান্যাল (CH₃CHO)', textEn: 'Ethanal (CH₃CHO)' },
      { key: 'B', textBn: 'ইথানয়িক এসিড (CH₃COOH)', textEn: 'Ethanoic acid (CH₃COOH)' },
      { key: 'C', textBn: 'মিথেন (CH₄)', textEn: 'Methane (CH₄)' },
      { key: 'D', textBn: 'ইথেন (C₂H₆)', textEn: 'Ethane (C₂H₆)' },
    ],
    correctKey: 'B',
    explanationBn:
      'ইথানল প্রথমে জায়মান অক্সিজেন দ্বারা জারিত হয়ে ইথান্যাল (অ্যালডিহাইড) উৎপন্ন করে: C₂H₅OH + [O] → CH₃CHO + H₂O। অতিরিক্ত জারণে ইথান্যাল আরও জারিত হয়ে চূড়ান্তভাবে ইথানয়িক এসিড (ফ্যাটি এসিড) তৈরি করে: CH₃CHO + [O] → CH₃COOH।',
    explanationEn:
      'Ethanol is first oxidised to ethanal, which upon continued oxidation with acidified potassium dichromate converts into ethanoic acid (CH₃COOH).',
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

export const CHAPTER_11_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "জীবাশ্ম জ্বালানি ও পেট্রোলিয়ামের আংশিক পাতন",
    titleEn: "Fossil Fuels & Petroleum Fractional Distillation",
    overviewBn: "জীবাশ্ম জ্বালানির উৎপত্তি, ক্রুড অয়েল এবং ৭টি ভিন্ন স্ফুটনাঙ্কের ভগ্নাংশের আংশিক পাতন টাওয়ার।",
    overviewEn: "Origin of fossils, petroleum crude refining across 7 boiling fractions in the distillation column.",
    studyTipBn: "পেট্রোলিয়ামের প্রধান অংশ: এলপিজি (<২০°C), পেট্রোল (২১-৭০°C), কেরোসিন (১২১-১৭০°C), ডিজেল (১৭১-২৭০°C), পিচ (>৩৪০°C)!",
    studyTipEn: "Key distillation cuts: LPG (<20°C), Gasoline (21–70°C), Kerosene (121–170°C), Bitumen (>340°C)!",
    badgeText: "পেট্রোলিয়ামের আংশিক পাতন",
  },
  2: {
    no: "০২",
    titleBn: "সম্পৃক্ত হাইড্রোকার্বন (অ্যালকেন) ও বিক্রিয়া",
    titleEn: "Saturated Hydrocarbons (Alkanes) & Reactions",
    overviewBn: "CnH2n+2 সাধারণ সংকেত, প্যারাবিন বা নিষ্ক্রিয়তা, দহন এবং মিথেনের ৪-ধাপ ক্লোরিনেশন বিক্রিয়া।",
    overviewEn: "CnH2n+2 general formula, paraffin inertness, combustion, and stepwise photochemical chlorination.",
    studyTipBn: "সূর্যালোকের অতিবেগুনি রশ্মির উপস্থিতিতে মিথেন ক্লোরিনের সাথে বিক্রিয়া করে শেষ ধাপে CCl₄ গঠন করে!",
    studyTipEn: "Under ultraviolet sunlight, methane chlorination yields carbon tetrachloride (CCl4) in the 4th step!",
    badgeText: "অ্যালকেন ও ক্লোরিনেশন",
  },
  3: {
    no: "০৩",
    titleBn: "অসম্পৃক্ত হাইড্রোকার্বন ও ব্রোমিন/বেয়ার পরীক্ষা ল্যাব",
    titleEn: "Unsaturated Hydrocarbons & Bromine/Baeyer Lab",
    overviewBn: "অ্যালকিন (দ্বিবন্ধন) ও অ্যালকাইন (ত্রিবন্ধন) এবং লাল ব্রোমিন পানি ও গোলাপি ক্ষারীয় KMnO₄ বর্ণহীন করার পরীক্ষা।",
    overviewEn: "Alkenes and alkynes, addition reactions, and bromine water/alkaline KMnO4 unsaturation tests.",
    studyTipBn: "অসম্পৃক্ত হাইড্রোকার্বন ব্রোমিন পানির লাল বর্ণ এবং বেয়ার পরীক্ষার ক্ষারীয় KMnO₄ এর গোলাপি বর্ণ দ্রুত দূর করে!",
    studyTipEn: "Unsaturated hydrocarbons discharge the reddish-brown of Br2 and the purple of alkaline KMnO4!",
    badgeText: "ব্রোমিন ও বেয়ার পরীক্ষা",
  },
  4: {
    no: "০৪",
    titleBn: "অ্যালকোহল, অ্যালডিহাইড ও ফ্যাটি এসিড চক্র",
    titleEn: "Alcohol, Aldehyde & Carboxylic Acid Interconversion",
    overviewBn: "অ্যালকাইল হ্যালাইড থেকে অ্যালকোহল, জারণে অ্যালডিহাইড এবং চূড়ান্ত জারণে ইথানয়িক এসিড (ভিনেগার) রূপান্তর।",
    overviewEn: "Alcohol oxidation to ethanal, and subsequent oxidation using K2Cr2O7/H2SO4 to ethanoic acid.",
    studyTipBn: "ইথানলের জারণে ইথান্যাল (CH₃CHO) এবং পুনরায় জারণে ইথানয়িক এসিড (CH₃COOH) পাওয়া যায়!",
    studyTipEn: "Oxidizing ethanol yields ethanal, which upon continued oxidation yields ethanoic acid!",
    badgeText: "জৈব যৌগের আন্তঃরূপান্তর",
  },
  5: {
    no: "০৫",
    titleBn: "পলিমারকরণ বিক্রিয়া ও প্লাস্টিক কারখানা ল্যাব",
    titleEn: "Polymerization & Synthetic Plastics Lab",
    overviewBn: "মনোমার থেকে পলিমার, ইথিন থেকে পলিথিন (উচ্চ চাপ ও তাপমাত্রা), পলিপ্রোপিন এবং পিভিসি (PVC) পাইপ।",
    overviewEn: "Addition polymerization synthesizing polyethylene, polypropylene, and polyvinyl chloride (PVC).",
    studyTipBn: "১০০০ বায়ুমণ্ডলীয় চাপ ও ২০০°C তাপমাত্রায় সামান্য অক্সিজেনের উপস্থিতিতে ইথিন থেকে পলিথিন উৎপন্ন হয়!",
    studyTipEn: "Subjecting ethene to 1000 atm pressure and 200°C with trace O2 produces durable polythene polymer!",
    badgeText: "পলিমার ও প্লাস্টিক কারখানা",
  },
};

export function MineralResourcesFossilsGuidebook() {
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
        ? 'স্বাগতম খনিজ সম্পদ: জীবাশ্ম ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Mineral Resources: Fossils Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_11_LESSONS[activeLesson] || CHAPTER_11_LESSONS[1];
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
          chapter: '11 - খনিজ সম্পদ: জীবাশ্ম (Mineral Resources: Fossils)',
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
          { role: 'ai', text: isBn ? 'জীবাশ্ম জ্বালানি হলো কোটি বছর আগের উদ্ভিদ ও প্রাণীর ধ্বংসাবশেষ থেকে তৈরি জ্বালানি। হাইড্রোকার্বন হলো কেবল কার্বন ও হাইড্রোজেনের যৌগ।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ১১: খনিজ সম্পদ: জীবাশ্ম (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. হাইড্রোকার্বনের প্রকারভেদ:\n   - অ্যালকেন (CnH2n+2): একক বন্ধন, সম্পৃক্ত (প্যারাফিন)।\n   - অ্যালকিন (CnH2n): দ্বিবন্ধন, অসম্পৃক্ত।\n   - অ্যালকাইন (CnH2n-2): ত্রিবন্ধন, অসম্পৃক্ত।\n২. অসম্পৃক্ততার শনাক্তকারী পরীক্ষা:\n   - ব্রোমিন দ্রবণ পরীক্ষা: লালচে ব্রোমিন পানি বর্ণহীন হয়।\n   - বেয়ার পরীক্ষা: ক্ষারীয় KMnO₄ এর গোলাপি বর্ণ দূরীভূত হয়।\n৩. রূপান্তর শৃঙ্খল:\n   - অ্যালকেন → হ্যালোঅ্যালকেন → অ্যালকোহল → অ্যালডিহাইড → জৈব এসিড।\n৪. পলিমার:\n   - n CH₂=CH₂ → [-CH₂-CH₂-]n (পলিথিন)।\n   - ভিনাইল ক্লোরাইড → পিভিসি (PVC - পাইপ তৈরিতে)।`
      : `SSC Chemistry Chapter 11: Mineral Resources: Fossils Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1: Distillation Tower State
  const [selectedFractionId, setSelectedFractionId] = useState<string>('petrol');
  const [furnaceTemp, setFurnaceTemp] = useState<number>(150);

  // Simulator 2: Unsaturation Test Tubes
  const [unsaturationReagent, setUnsaturationReagent] = useState<'none' | 'bromine' | 'baeyer'>('none');
  const [shakingActive, setShakingActive] = useState<boolean>(false);

  // Simulator 3: Organic Cycle Machine
  const [activeCycleNode, setActiveCycleNode] = useState<number>(0);

  // Simulator 4: Polymer Factory
  const [polymerMonomer, setPolymerMonomer] = useState<'ethene' | 'propene' | 'vinyl_chloride'>('ethene');
  const [polymerPressure, setPolymerPressure] = useState<number>(1000);
  const [polymerizationTriggered, setPolymerizationTriggered] = useState<boolean>(false);

  // Board MCQ State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: number]: string }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [id: number]: boolean }>({});

  // CQ Accordion State
  const [openCqParts, setOpenCqParts] = useState<{ [key: string]: boolean }>({
    ka: true,
    kha: true,
    ga: false,
    gha: false,
  });

  const toggleCqPart = (key: string) => {
    setOpenCqParts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAnswer = (mcqId: number, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optionKey }));
    setSubmittedAnswers((prev) => ({ ...prev, [mcqId]: true }));
  };

  const resetMcqs = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
  };

  const currentFraction = FRACTIONS.find((f) => f.id === selectedFractionId) || FRACTIONS[1];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-cyan-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={11}
        chapterTitleBn="খনিজ সম্পদ: জীবাশ্ম"
        chapterTitleEn="Mineral Resources: Fossils"
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
                  <span className="text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                    CHAPTER 11
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'খনিজ সম্পদ: জীবাশ্ম' : 'Mineral Resources: Fossils'}
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
                  const meta = CHAPTER_11_LESSONS[lNum];
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
                  ? 'এনসিটিবি রসায়ন অধ্যায় 11 (পৃষ্ঠা ২৬১ - ২৯৩) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 11 (Printed pp. ২৬১ - ২৯৩) aligned with NCTB syllabus.'}
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
                  <Flame className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 11 • পাঠ ${currentLessonMeta.no}` : `Chapter 11 • Lesson ${activeLesson}`}
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

          {currentStep === 'concept' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Badge & Title */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                {isBn ? 'অধ্যায় ১১: তাত্ত্বিক ভিত্তি' : 'Chapter 11: Theoretical Foundation'}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {isBn ? 'খনিজ সম্পদ: জীবাশ্ম ও জৈব রসায়ন' : 'Mineral Resources: Fossils & Hydrocarbons'}
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'পেট্রোলিয়ামের আংশিক পাতন, সমগোত্রীয় শ্রেণি, ব্রোমিন ও বেয়ার অসম্পৃক্ততা পরীক্ষা, রূপান্তর চক্র এবং পলিমারাইজেশন।'
                  : 'Fractional distillation of crude oil, homologous series, bromine & Baeyer unsaturation tests, organic conversions, and addition polymers.'}
              </p>
            </div>

            {/* Concept Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Concept 1: জীবাশ্ম ও পেট্রোলিয়াম পাতন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '১. জীবাশ্ম জ্বালানি ও আংশিক পাতন' : '1. Fossil Fuels & Distillation'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'স্ফুটনাঙ্কের পার্থক্যের ভিত্তিতে ৭টি অংশ পৃথকীকরণ' : 'Separating crude oil by boiling points'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'শত শত মিলিয়ন বছর পূর্বে উদ্ভিদ ও প্রাণীর মৃতদেহ ভূগর্ভে তাপ ও চাপে রূপান্তরিত হয়ে কয়লা, পেট্রোলিয়াম ও প্রাকৃতিক গ্যাসে পরিণত হয়েছে। অপরিশোধিত তেলকে আংশিক পাতন স্তম্ভে স্ফুটনাঙ্কের ভিত্তিতে ৭টি প্রধান অংশে পৃথক করা হয়।'
                    : 'Fossil fuels formed from prehistoric biomass under heat and pressure. Crude oil is separated into 7 boiling-point fractions in a fractional distillation column.'}
                </p>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs space-y-1">
                  <div className="font-semibold text-amber-800 dark:text-amber-300">
                    পাতনের ৭টি ধারাবাহিক স্তর (নিচ থেকে উপরে স্ফুটনাঙ্ক কমে):
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300">
                    পিচ (&gt;৩৪০°C) → মবিল (২৭১-৩৪০°C) → ডিজেল (১৭১-২৭০°C) → কেরোসিন (১২১-১৭০°C) → ন্যাপথা (৭১-১২০°C) → পেট্রোল (২১-৭০°C) → LPG (০-২০°C)।
                  </div>
                </div>
              </div>

              {/* Concept 2: সমগোত্রীয় শ্রেণি ও হাইড্রোকার্বন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Atom className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '২. সমগোত্রীয় শ্রেণি (Homologous Series)' : '2. Homologous Series'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'নির্দিষ্ট কার্যকরী মূলক ও সাধারণ সংকেত' : 'Characteristic functional groups'}
                    </p>
                  </div>
                </div>
                <div className="text-xs space-y-2 font-mono text-slate-700 dark:text-slate-300">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>• অ্যালকেন (প্যারাফিন):</strong> CₙH₂ₙ₊₂ (একক বন্ধন C-C, আসক্তিহীন নিষ্ক্রিয়)
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>• অ্যালকিন:</strong> CₙH₂ₙ (দ্বিবন্ধন C=C, সক্রিয় ও সংযোজন বিক্রিয়াশীল)
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>• অ্যালকাইন:</strong> CₙH₂ₙ₋₂ (ত্রিবন্ধন C≡C, অধিক সক্রিয়)
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>• অ্যালকোহল:</strong> CₙH₂ₙ₊₁OH (কার্যকরী মূলক: -OH)
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>• ফ্যাটি এসিড:</strong> CₙH₂ₙ₊₁COOH (কার্যকরী মূলক: -COOH)
                  </div>
                </div>
              </div>

              {/* Concept 3: অসম্পৃক্ততার ব্রোমিন ও বেয়ার পরীক্ষা */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <TestTube className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৩. অসম্পৃক্ততার দুটি ক্লাসিক পরীক্ষা' : '3. Unsaturation Detection Tests'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'ব্রোমিন পানি ও ক্ষারীয় KMnO₄ (বেয়ার পরীক্ষা)' : 'Bromine water & Baeyer alkaline test'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono space-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="text-rose-600 dark:text-rose-400 font-semibold">
                    (ক) ব্রোমিন পরীক্ষা (লাল বর্ণ বর্ণহীন হওয়া):
                  </div>
                  <div>CH₂=CH₂ + Br₂(লাল) → CH₂Br-CH₂Br (বর্ণহীন)</div>
                  <div className="text-purple-600 dark:text-purple-400 font-semibold pt-1">
                    (খ) বেয়ার পরীক্ষা (গোলাপি KMnO₄ বর্ণহীন হওয়া):
                  </div>
                  <div>CH₂=CH₂ + [O] + H₂O → CH₂OH-CH₂OH (ইথিলিন গ্লাইকল)</div>
                  <p className="font-sans text-slate-500 text-[11px] pt-1">
                    অ্যালকেনে কোনো পাই বন্ধন না থাকায় এরা সাধারণ অবস্থায় ব্রোমিন পানি বা KMnO₄ এর বর্ণ বিনষ্ট করে না।
                  </p>
                </div>
              </div>

              {/* Concept 4: পলিমারকরণ ও প্লাস্টিক শিল্প */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৪. পলিমারকরণ বিক্রিয়া ও প্লাস্টিক' : '4. Polymerization & Plastics'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'সংযোজন বনাম ঘনীভবন পলিমার' : 'Addition vs Condensation polymers'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-1.5">
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                    বোর্ড পরীক্ষায় আসা প্রধান পলিমারসমূহ:
                  </div>
                  <div>• <strong>পলিথিন:</strong> n(CH₂=CH₂) → -[-CH₂-CH₂-]-ₙ (১০০০ atm, ২০০°C, O₂)</div>
                  <div>• <strong>পলিপ্রোপিন:</strong> n(CH₂=CH-CH₃) → -[-CH₂-CH(CH₃)-]-ₙ (১৪০ atm, ১২০°C, TiCl₃)</div>
                  <div>• <strong>পিভিসি (PVC):</strong> n(CH₂=CHCl) → -[-CH₂-CH(Cl)-]-ₙ [পানির পাইপ]</div>
                  <div>• <strong>নাইলন ৬:৬:</strong> এডিপিক এসিড + হেক্সামিথিলিন ডাইঅ্যামিন → কৃত্রিম তন্তু</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: EXAMPLE (বোর্ড গাণিতিক ও বিক্রিয়া সমস্যা)
           ========================================================================= */}
        {currentStep === 'example' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                {isBn ? 'বোর্ড স্ট্যান্ডার্ড উদাহরণ ও রূপান্তর বিক্রিয়া' : 'Standard Organic Conversion Solved Examples'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'ধাপ-ভিত্তিক জৈব রসায়ন সমীকরণ সমাধান' : 'Step-by-Step Organic Reaction Pathways'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'ঢাকা, রাজশাহী, দিনাজপুর ও চট্টগ্রাম বোর্ডে বিগত বছরগুলোতে আসা সবচেয়ে গুরুত্বপূর্ণ ৫টি সমাধান।'
                  : '5 authentic solved examples covering unsaturation proofs, soda lime decarboxylation, ethyne acetylene production, and ethanol oxidation.'}
              </p>
            </div>

            <div className="space-y-6">
              {/* Example 1: ইথিন ও ইথেনের ব্রোমিন টেস্ট পার্থক্য */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০১
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'ইথেন ও ইথিনের মধ্যে রাসায়নিক পরীক্ষার সাহায্যে পার্থক্য' : 'Chemical Differentiation between Ethane & Ethene'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'ঢাকা বোর্ড ২০২৩, রাজশাহী ২০২১' : 'Dhaka Board 2023'}
                  </span>
                </div>

                <div className="text-sm space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                    <p className="font-semibold text-cyan-600 dark:text-cyan-400">পরীক্ষা: ব্রোমিন দ্রবণ যোগকরণ</p>
                    <p>
                      • <strong>ইথিনের ক্ষেত্রে:</strong> লাল বর্ণের ব্রোমিন দ্রবণ দ্রুত বর্ণহীন হয়ে যায়:
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                      <RenderMathText text="\text{CH}_2=\text{CH}_2 + \text{Br}_2\text{(লাল)} \rightarrow \text{CH}_2\text{Br}-\text{CH}_2\text{Br} \text{ (বর্ণহীন ১,২-ডাইব্রোমোইথেন)}" />
                    </div>
                    <p>
                      • <strong>ইথেনের ক্ষেত্রে:</strong> সম্পৃক্ত একক বন্ধন থাকায় ব্রোমিন দ্রবণের লাল বর্ণ অপরিবর্তিত থাকে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Example 2: ডিকার্বক্সিলেশনে মিথেন প্রস্তুত */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০২
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'সোডা লাইম ডিকার্বক্সিলেশন পদ্ধতিতে অ্যালকেন প্রস্তুতি' : 'Preparation of Alkanes via Soda Lime Decarboxylation'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'দিনাজপুর বোর্ড ২০২২, চট্টগ্রাম ২০২০' : 'Dinajpur Board 2022'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p>সোডিয়াম ইথানয়েটকে সোডা লাইম (NaOH + CaO) সহ তীব্রভাবে উত্তপ্ত করলে ১টি কার্বন কম বিশিষ্ট মিথেন উৎপন্ন হয়:</p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="\text{CH}_3\text{COONa}(\text{s}) + \text{NaOH}(\text{s}) \xrightarrow{\text{CaO}, \Delta} \text{CH}_4(\text{g})\uparrow + \text{Na}_2\text{CO}_3(\text{s})" />
                  </div>
                  <p className="text-slate-500 text-xs">
                    * CaO (চুন) এর ভূমিকা: এটি মিশ্রণকে শুষ্ক রাখে এবং কাচনলের গায়ে সোডিয়াম হাইড্রোক্সাইড আটকে যাওয়া প্রতিরোধ করে।
                  </p>
                </div>
              </div>

              {/* Example 3: ক্যালসিয়াম কার্বাইড হতে ইথাইন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৩
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'ক্যালসিয়াম কার্বাইড (CaC₂) থেকে ইথাইন প্রস্তুত ও PVC তৈরি' : 'Acetylene from Calcium Carbide & PVC Synthesis'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'পাঠ্যবই পৃষ্ঠা ২৭৫ ও ২৮৬' : 'Textbook Page 275 & 286'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm font-mono">
                  <div>১. ইথাইন প্রস্তুতি: CaC₂ + 2H₂O → HC≡CH↑ + Ca(OH)₂</div>
                  <div>২. ভিনাইল ক্লোরাইড গঠন: HC≡CH + HCl → CH₂=CHCl (HgCl₂ অনুঘটক, ১৫০-২৫০°C)</div>
                  <div>৩. পলিমারকরণ: n(CH₂=CHCl) → -[-CH₂-CH(Cl)-]-ₙ (PVC পানির পাইপ)</div>
                </div>
              </div>

              {/* Example 4: জৈব রূপান্তর চক্র (ইথেন থেকে ইথানয়িক এসিড) */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৪
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'জৈব রূপান্তর চক্র: ইথেন → ইথাইল হ্যালাইড → ইথানল → ইথানয়িক এসিড' : 'Multi-Step Organic Conversion Pathway'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'যশোর বোর্ড ২০২৩, কুমিল্লা ২০২২' : 'Jashore Board 2023'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm font-mono">
                  <div>ধাপ ১: CH₃-CH₃ + Br₂ xrightarrow(সূর্যালোক) CH₃-CH₂Br + HBr</div>
                  <div>ধাপ ২: CH₃-CH₂Br + NaOH(aq) → CH₃-CH₂OH + NaBr</div>
                  <div>ধাপ ৩: CH₃-CH₂OH + [O] xrightarrow(K₂Cr₂O₇ + H₂SO₄) CH₃CHO + H₂O</div>
                  <div>ধাপ ৪: CH₃CHO + [O] xrightarrow(K₂Cr₂O₇ + H₂SO₄) CH₃COOH (ভিনেগার)</div>
                </div>
              </div>

              {/* Example 5: স্টার্চ বা আলু থেকে সন্ধান প্রক্রিয়ায় ইথানল */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৫
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'আলু/স্টার্চ থেকে ফারমেন্টেশন প্রক্রিয়ায় ইথানল উৎপাদন' : 'Ethanol Production via Fermentation of Starch'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'পাঠ্যবই পৃষ্ঠা ২৮৬ সৃজনশীল প্রশ্ন ০১' : 'Textbook Page 286 Model CQ'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p>আলুর স্টার্চকে ডায়াস্টেজ ও ম্যালটেজ এনজাইম দ্বারা গ্লুকোজে রূপান্তরিত করে ইস্টের জাইমেজ এনজাইম দ্বারা ইথানলে পরিণত করা হয়:</p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="\text{C}_6\text{H}_{12}\text{O}_6(\text{aq}) \xrightarrow{\text{Zymase (Yeast)}} 2\text{C}_2\text{H}_5\text{OH}(\text{aq}) + 2\text{CO}_2(\text{g})\uparrow" />
                  </div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                    এই ইথানলকে গ্যাসোহল (১০% ইথানল + ৯০% পেট্রোল) হিসেবে জীবাশ্ম জ্বালানির পরিবেশবান্ধব বিকল্প হিসেবে মোটরযানে ব্যবহার করা যায়।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: TRY (হাতে-কলমে ৪টি ভার্চুয়াল ইন্টারঅ্যাক্টিভ ল্যাব)
           ========================================================================= */}
        {currentStep === 'try' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Play className="w-3.5 h-3.5" />
                {isBn ? 'হাতে-কলমে জৈব রসায়ন ল্যাব' : 'Interactive Hydrocarbons & Organic Labs'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? '৪টি ভার্চুয়াল পাতন, রূপান্তর ও পলিমার ল্যাব' : '4 Virtual Distillation, Conversion & Polymer Labs'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'পেট্রোলিয়ামের আংশিক পাতন স্তম্ভ, ব্রোমিন ও বেয়ার অসম্পৃক্ততা টেস্ট, জৈব রূপান্তর চক্র এবং পলিমারাইজেশন কারখানা।'
                  : 'Crude oil distillation column, bromine & Baeyer test tubes, multi-step organic conversion, and polymerization factory.'}
              </p>
            </div>

            {/* =========================================================================
                SIMULATOR 1: FRACTIONAL DISTILLATION TOWER
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-600 text-white font-bold text-xs">ল্যাব ০১</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'পেট্রোলিয়ামের আংশিক পাতন টাওয়ার ল্যাব' : 'Petroleum Fractional Distillation Tower'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'টাওয়ারের বিভিন্ন ট্রে (ট্যাপ) নির্বাচন করে তাপমাত্রা, কার্বন শিকলের দৈর্ঘ্য ও বাস্তব ব্যবহার পর্যবেক্ষণ করুন।'
                      : 'Select different distillation trays to inspect temperature, chain length, and practical applications.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedFractionId('petrol');
                    setFurnaceTemp(150);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Fraction Trays Horizontal Buttons */}
              <div className="flex flex-wrap gap-2">
                {FRACTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFractionId(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedFractionId === f.id
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500'
                    }`}
                  >
                    {isBn ? f.nameBn.split(' ')[0] : f.nameEn.split(' ')[0]} ({f.carbonChain})
                  </button>
                ))}
              </div>

              {/* Visual Distillation Tower & Fraction Detail */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Tower Graphic */}
                <div className="space-y-1 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                  <div className="text-[10px] font-mono text-center text-slate-400 font-bold mb-1">
                    পাতন স্তম্ভ (উপরে কম তাপমাত্রা, নিচে বেশি)
                  </div>
                  {FRACTIONS.map((f) => {
                    const isSelected = selectedFractionId === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFractionId(f.id)}
                        className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-2 border-cyan-500 font-bold shadow-sm'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shadow"
                            style={{ backgroundColor: f.colorHex }}
                          />
                          <span>{isBn ? f.nameBn : f.nameEn}</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          {f.tempRangeBn} | {f.carbonChain}
                        </div>
                      </div>
                    );
                  })}
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-center text-[10px] font-mono text-red-600 font-bold">
                    ফার্নেস হিটার (৪০০°C এ অপরিশোধিত তেল প্রবেশ)
                  </div>
                </div>

                {/* Selected Fraction Information Card */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        নির্বাচিত অংশ তথ্য
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                        {currentFraction.percentageBn} অংশ
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {isBn ? currentFraction.nameBn : currentFraction.nameEn}
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <span className="text-slate-400 block text-[10px]">স্ফুটনাঙ্ক সীমা:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{currentFraction.tempRangeBn}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <span className="text-slate-400 block text-[10px]">কার্বন শিকল:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{currentFraction.carbonChain}</strong>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                      <strong>ব্যবহার:</strong> {isBn ? currentFraction.usesBn : currentFraction.usesEn}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 2: UNSATURATION DETECTION TEST TUBES
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-rose-600 text-white font-bold text-xs">ল্যাব ০২</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'অসম্পৃক্ততা পরীক্ষা ল্যাব (ব্রোমিন ও বেয়ার টেস্ট)' : 'Unsaturation Detection Lab (Bromine & Baeyer)'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'সম্পৃক্ত প্রোপেন (একক বন্ধন) ও অসম্পৃক্ত ইথিন (দ্বিবন্ধন) এ নির্দেশক যোগ করে ঝাঁকান।'
                      : 'Add red bromine water or purple Baeyer reagent to compare saturated vs unsaturated hydrocarbons.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setUnsaturationReagent('none');
                    setShakingActive(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Visual 2 Test Tubes Side by Side */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Tube A: Saturated Alkane (Propane) */}
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold text-slate-500">টেস্টটিউব ক: সম্পৃক্ত প্রোপেন (C₃H₈)</span>
                  <div className="w-36 h-60 relative bg-slate-200/90 dark:bg-slate-900 rounded-b-full border-4 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-3 shadow-inner overflow-hidden">
                    <div
                      className={`w-full h-32 rounded-b-full transition-all duration-700 flex items-center justify-center font-bold text-[10px] text-white ${
                        unsaturationReagent === 'none'
                          ? 'bg-cyan-500/20 text-slate-700 dark:text-slate-300'
                          : unsaturationReagent === 'bromine'
                          ? 'bg-rose-600 shadow-md'
                          : 'bg-purple-600 shadow-md'
                      }`}
                    >
                      {unsaturationReagent === 'none'
                        ? 'বর্ণহীন তরল'
                        : unsaturationReagent === 'bromine'
                        ? 'লাল বর্ণ অপরিবর্তিত'
                        : 'গোলাপি বর্ণ অপরিবর্তিত'}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">কোনো বিক্রিয়া নেই (একক বন্ধন)</span>
                </div>

                {/* Tube B: Unsaturated Alkene (Ethene) */}
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold text-slate-500">টেস্টটিউব খ: অসম্পৃক্ত ইথিন (C₂H₄)</span>
                  <div className="w-36 h-60 relative bg-slate-200/90 dark:bg-slate-900 rounded-b-full border-4 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-3 shadow-inner overflow-hidden">
                    <div
                      className={`w-full h-32 rounded-b-full transition-all duration-700 flex items-center justify-center font-bold text-[10px] ${
                        unsaturationReagent === 'none'
                          ? 'bg-cyan-500/20 text-slate-700 dark:text-slate-300'
                          : 'bg-cyan-100/50 text-cyan-800 dark:text-cyan-200 border-2 border-cyan-400 animate-pulse'
                      }`}
                    >
                      {unsaturationReagent === 'none' ? 'বর্ণহীন গ্যাস/তরল' : 'দ্রুত বর্ণহীন হয়ে গেল!'}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {unsaturationReagent === 'bromine'
                      ? '১,২-ডাইব্রোমোইথেন উৎপন্ন'
                      : unsaturationReagent === 'baeyer'
                      ? 'ইথিলিন গ্লাইকল উৎপন্ন'
                      : 'দ্বিবন্ধন উপস্থিত'}
                  </span>
                </div>

                {/* Reagent Action Controls */}
                <div className="space-y-4 max-w-sm w-full">
                  <div className="space-y-2">
                    <button
                      onClick={() => setUnsaturationReagent('bromine')}
                      className="w-full px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <Pipette className="w-4 h-4" />
                      {isBn ? '১. লাল ব্রোমিন দ্রবণ (Br₂) যোগ করো' : '1. Add Red Bromine Water'}
                    </button>

                    <button
                      onClick={() => setUnsaturationReagent('baeyer')}
                      className="w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <Beaker className="w-4 h-4" />
                      {isBn ? '২. বেয়ার ক্ষারীয় KMnO₄ দ্রবণ যোগ করো' : '2. Add Baeyer Alkaline KMnO₄'}
                    </button>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">পর্যবেক্ষণের সিদ্ধান্ত:</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      ইথিনের দুর্বল পাই (π) বন্ধন ভেঙে ব্রোমিন বা জায়মান অক্সিজেন যুক্ত হওয়ায় বর্ণ দূরীভূত হয়। এটি অসম্পৃক্ততা প্রমাণের নিখুঁত পরীক্ষা!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 3: ORGANIC INTERCONVERSION CYCLE MACHINE
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">ল্যাব ০৩</span>
                  <h3 className="text-xl font-bold">
                    {isBn ? 'জৈব রূপান্তর চক্র মেশিন (Organic Interconversion Machine)' : 'Organic Interconversion Pathway Machine'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'ধাপে ধাপে অগ্রসর হয়ে অ্যালকেন থেকে ফ্যাটি এসিডে রূপান্তরের শর্ত ও সমীকরণ দেখুন।'
                    : 'Step through the sequential reaction chain from alkane to carboxylic acid.'}
                </p>
              </div>

              {/* 5 Progression Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-bold">
                {[
                  { idx: 0, name: 'ইথেন (C₂H₆)', sub: 'অ্যালকেন' },
                  { idx: 1, name: 'ইথাইল ব্রোমাইড', sub: 'C₂H₅Br' },
                  { idx: 2, name: 'ইথানল (C₂H₅OH)', sub: 'অ্যালকোহল' },
                  { idx: 3, name: 'ইথান্যাল (CH₃CHO)', sub: 'অ্যালডিহাইড' },
                  { idx: 4, name: 'ইথানয়িক এসিড', sub: 'CH₃COOH' },
                ].map((s) => (
                  <button
                    key={s.idx}
                    onClick={() => setActiveCycleNode(s.idx)}
                    className={`p-3 rounded-xl border transition ${
                      activeCycleNode === s.idx
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : activeCycleNode > s.idx
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <div>{s.name}</div>
                    <div className="text-[10px] font-normal opacity-80">{s.sub}</div>
                  </button>
                ))}
              </div>

              {/* Interactive Current Step Detail */}
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                    রূপান্তর ধাপ ০{activeCycleNode + 1}
                  </span>
                  <button
                    onClick={() => setActiveCycleNode((prev) => (prev + 1) % 5)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition"
                  >
                    <span>পরবর্তী রূপান্তর</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  {activeCycleNode === 0 && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ইথেন (C₂H₆) → ইথাইল ব্রোমাইড (C₂H₅Br)
                      </div>
                      <div className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                        CH₃-CH₃ + Br₂ xrightarrow(সূর্যালোক / UV) CH₃-CH₂Br + HBr
                      </div>
                      <p className="text-xs text-slate-500">সূর্যালোকের উপস্থিতিতে মুক্ত মূলক প্রতিস্থাপন ঘটে।</p>
                    </div>
                  )}

                  {activeCycleNode === 1 && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ইথাইল ব্রোমাইড (C₂H₅Br) → ইথানল (C₂H₅OH)
                      </div>
                      <div className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                        CH₃-CH₂Br + NaOH(aq) xrightarrow(তাপ) CH₃-CH₂OH + NaBr
                      </div>
                      <p className="text-xs text-slate-500">জলীয় ক্ষার দ্বারা আর্দ্র বিশ্লেষণ ঘটে -OH যুক্ত হয়।</p>
                    </div>
                  )}

                  {activeCycleNode === 2 && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ইথানল (C₂H₅OH) → ইথান্যাল (CH₃CHO)
                      </div>
                      <div className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                        CH₃-CH₂OH + [O] xrightarrow(K₂Cr₂O₇ + H₂SO₄) CH₃CHO + H₂O
                      </div>
                      <p className="text-xs text-slate-500">মৃদু জারণে অ্যালকোহল থেকে অ্যালডিহাইড উৎপন্ন হয়।</p>
                    </div>
                  )}

                  {activeCycleNode === 3 && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ইথান্যাল (CH₃CHO) → ইথানয়িক এসিড (CH₃COOH)
                      </div>
                      <div className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                        CH₃CHO + [O] xrightarrow(K₂Cr₂O₇ + H₂SO₄) CH₃COOH
                      </div>
                      <p className="text-xs text-slate-500">তীব্র জারণে অ্যালডিহাইড থেকে কার্বক্সিলিক এসিড গঠিত হয়।</p>
                    </div>
                  )}

                  {activeCycleNode === 4 && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        ইথানয়িক এসিড (CH₃COOH) → পুনরায় মিথেন (CH₄)
                      </div>
                      <div className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                        CH₃COONa + NaOH(CaO) xrightarrow(তাপ) CH₄↑ + Na₂CO₃
                      </div>
                      <p className="text-xs text-slate-500">ডিকার্বক্সিলেশনের মাধ্যমে চক্রটি পূর্ণতা পায়!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 4: POLYMER FACTORY
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">ল্যাব ০৪</span>
                  <h3 className="text-xl font-bold">
                    {isBn ? 'পলিমারাইজেশন কারখানা ও প্লাস্টিক সিন্থেসিস ল্যাব' : 'Polymer Synthesis & Plastics Factory'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'মনোমার নির্বাচন করুন এবং উচ্চ চাপে হাজার হাজার অণু যুক্ত করে পলিমার তৈরি করুন।'
                    : 'Select monomers and apply high pressure to synthesize long-chain polymers.'}
                </p>
              </div>

              {/* Monomer Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setPolymerMonomer('ethene');
                    setPolymerizationTriggered(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    polymerMonomer === 'ethene'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">মনোমার ১</div>
                  <div className="text-sm font-bold">ইথিন → পলিথিন</div>
                  <div className="text-[11px] text-slate-400">১০০০ atm, ২০০°C, O₂</div>
                </button>

                <button
                  onClick={() => {
                    setPolymerMonomer('propene');
                    setPolymerizationTriggered(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    polymerMonomer === 'propene'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">মনোমার ২</div>
                  <div className="text-sm font-bold">প্রোপিন → পলিপ্রোপিন</div>
                  <div className="text-[11px] text-slate-400">১৪০ atm, ১২০°C, TiCl₃</div>
                </button>

                <button
                  onClick={() => {
                    setPolymerMonomer('vinyl_chloride');
                    setPolymerizationTriggered(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    polymerMonomer === 'vinyl_chloride'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">মনোমার ৩</div>
                  <div className="text-sm font-bold">ভিনাইল ক্লোরাইড → PVC</div>
                  <div className="text-[11px] text-slate-400">জৈব পারঅক্সাইড অনুঘটক</div>
                </button>
              </div>

              {/* Visual Polymer Chain Animator */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                <div className="w-64 h-36 bg-slate-200 dark:bg-slate-900 rounded-2xl border-4 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-3 shadow-inner">
                  {polymerizationTriggered ? (
                    <div className="text-center space-y-1 animate-pulse">
                      <div className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                        -[-CH₂-CH₂-]-ₙ
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        দীর্ঘ শিকল পলিমার গঠিত হয়েছে!
                      </span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <div className="font-mono text-sm font-bold text-slate-500">
                        n (CH₂=CH₂)
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        মুক্ত একক মনোমার অণু
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 max-w-sm w-full">
                  <button
                    onClick={() => setPolymerizationTriggered(true)}
                    className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                  >
                    <Factory className="w-4 h-4" />
                    {isBn ? 'উচ্চ চাপ প্রয়োগ করে পলিমার গঠন করো' : 'Trigger Polymerization'}
                  </button>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-blue-600 font-bold">উৎপন্ন প্লাস্টিকের প্রয়োগ:</div>
                    {polymerMonomer === 'ethene' && <div>পলিথিনের ব্যাগ, শিট ও প্যাকেজিং সামগ্রী।</div>}
                    {polymerMonomer === 'propene' && <div>প্লাস্টিক রশি, বোতল ও কার্পেট ফাইবার।</div>}
                    {polymerMonomer === 'vinyl_chloride' && <div>শক্ত ও দীর্ঘস্থায়ী পানির পাইপ ও বিদ্যুৎ নিরোধক।</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: CHECK (বোর্ড মূল্যায়ন)
           ========================================================================= */}
        {currentStep === 'check' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Award className="w-3.5 h-3.5" />
                {isBn ? 'বোর্ড পরীক্ষা মূল্যায়ন' : 'Board Examination Assessment'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? '৫টি বোর্ড MCQ এবং ১টি সম্পূর্ণ বোর্ড সৃজনশীল (CQ)' : '5 Authentic MCQs & 1 Complete Board CQ'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'ঢাকা, রাজশাহী, দিনাজপুর ও চট্টগ্রাম বোর্ডের বিগত প্রশ্নাবলী এবং এনসিটিবি পাঠ্যবই পৃষ্ঠা ২৮৬ এর মূল সৃজনশীল সমাধান।'
                  : 'Practice standard board questions with instant validation and official marking rubrics.'}
              </p>
            </div>

            {/* MCQs List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                  {isBn ? 'পর্ব ক: ৫টি বোর্ড বহুনিবার্চনী প্রশ্ন (MCQ)' : 'Part A: 5 Authentic Board MCQs'}
                </h3>
                <button
                  onClick={resetMcqs}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  {isBn ? 'পুনরায় পরীক্ষা' : 'Reset MCQs'}
                </button>
              </div>

              <div className="space-y-6">
                {BOARD_MCQS.map((mcq, idx) => {
                  const isSubmitted = submittedAnswers[mcq.id];
                  const chosenKey = selectedAnswers[mcq.id];
                  const isCorrect = chosenKey === mcq.correctKey;

                  return (
                    <div
                      key={mcq.id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                            প্রশ্ন ০{idx + 1}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                            {isBn ? mcq.questionBn : mcq.questionEn}
                          </h4>
                        </div>
                        <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium whitespace-nowrap">
                          {isBn ? mcq.boardInfoBn : mcq.boardInfoEn}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mcq.options.map((opt) => {
                          const isOptionChosen = chosenKey === opt.key;
                          const isThisCorrect = opt.key === mcq.correctKey;

                          let btnClasses =
                            'p-3 rounded-xl border text-left text-xs md:text-sm font-medium transition flex items-center justify-between ';
                          if (!isSubmitted) {
                            btnClasses +=
                              'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-800 dark:text-slate-200';
                          } else if (isThisCorrect) {
                            btnClasses +=
                              'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                          } else if (isOptionChosen && !isThisCorrect) {
                            btnClasses +=
                              'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 line-through';
                          } else {
                            btnClasses +=
                              'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={isSubmitted}
                              onClick={() => handleSelectAnswer(mcq.id, opt.key)}
                              className={btnClasses}
                            >
                              <span>
                                <strong className="mr-2">{opt.key}.</strong>
                                {isBn ? opt.textBn : opt.textEn}
                              </span>
                              {isSubmitted && isThisCorrect && (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div
                          className={`p-4 rounded-xl text-xs md:text-sm space-y-1.5 animate-fadeIn ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>{isBn ? 'সঠিক উত্তর!' : 'Correct!'}</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <span>
                                  {isBn
                                    ? `ভুল হয়েছে! সঠিক উত্তর হলো: ${mcq.correctKey}`
                                    : `Incorrect! Correct answer is: ${mcq.correctKey}`}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="leading-relaxed">
                            {isBn ? mcq.explanationBn : mcq.explanationEn}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Creative Question (CQ) */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">সৃজনশীল প্রশ্ন</span>
                  <h3 className="text-xl font-bold mt-1">
                    {isBn
                      ? 'আলু হতে ইথানল উৎপাদন ও পিভিসি পলিমার সম্পর্কিত সৃজনশীল'
                      : 'Creative Question: Ethanol from Starch & PVC Synthesis'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isBn ? 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ২৮৬ এর মূল বোর্ড সৃজনশীল ০১' : 'Textbook Page 286 Official Model CQ'}
                  </span>
                </div>
                <span className="text-sm font-black text-purple-600 dark:text-purple-400">১০ নম্বর (১+২+৩+৪)</span>
              </div>

              {/* Stem */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  উদ্দীপক (Stem):
                </span>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  মার্চ-জুন মাসে বাংলাদেশে সংরক্ষণের অভাবে প্রচুর পরিমাণে আলু নষ্ট হয়। আলু থেকে নিচের বিক্রিয়াটিতে ইথানল উৎপন্ন করা যায়:
                  <br />
                  <span className="font-mono block py-1 font-bold">
                    স্টার্চ (আলু) xrightarrow(এনজাইম) গ্লুকোজ xrightarrow(ইস্ট/জাইমেজ) ইথানল + CO₂
                  </span>
                  অন্যদিকে, মিথেন গ্যাস থেকে উচ্চ তাপমাত্রায় ইথাইন প্রস্তুত করে তা থেকে সংযোজন প্রক্রিয়ায় ভিনাইল ক্লোরাইড ও পিভিসি পলিমার উৎপন্ন করা হয়।
                </p>
              </div>

              {/* CQ Questions Accordion */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('ka')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (ক) পেট্রোলিয়ামের প্রধান উপাদান কী? <span className="text-xs text-slate-400 ml-2">[১ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ka ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ka && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>পেট্রোলিয়ামের প্রধান উপাদান হলো বিভিন্ন কার্বন সংখ্যার হাইড্রোকার্বন (প্রধানত সম্পৃক্ত অ্যালকেন)।</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('kha')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (খ) অ্যালকেন অপেক্ষা অ্যালকিন অধিক সক্রিয় কেন? ব্যাখ্যা করো। <span className="text-xs text-slate-400 ml-2">[২ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.kha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.kha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        অ্যালকেনে কার্বন-কার্বন কেবল একক শক্তিশালী সিগমা (σ) বন্ধন বিদ্যমান থাকে, যা ভাঙতে প্রচুর শক্তির প্রয়োজন হয়। তাই এরা রাসায়নিকভাবে নিষ্ক্রিয় বা প্যারাফিন। পক্ষান্তরে, অ্যালকিনে একটি শক্তিশালী সিগমা বন্ধনের পাশাপাশি একটি দুর্বল পাই (π) বন্ধন থাকে (C=C)। রাসায়নিক বিক্রিয়াকালে এই দুর্বল পাই বন্ধনটি খুব সহজেই ভেঙে গিয়ে বিকারকের সাথে দ্রুত সংযোজন বিক্রিয়ায় অংশ নেয়। এ কারণে অ্যালকেন অপেক্ষা অ্যালকিন অনেক বেশি সক্রিয়।
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('ga')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (গ) উদ্দীপকের আলুর ইথানল হতে কীভাবে মিথেন প্রস্তুত করা যায়? ধারাবাহিক সমীকরণ দাও। <span className="text-xs text-slate-400 ml-2">[৩ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ga ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ga && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        ১. ইথানলকে K₂Cr₂O₇ ও H₂SO₄ দ্বারা জারিত করে ইথানয়িক এসিড তৈরি:
                      </p>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-center text-xs">
                        C₂H₅OH + 2[O] → CH₃COOH + H₂O
                      </div>
                      <p>২. এসিডকে NaOH দ্বারা প্রশমিত করে সোডিয়াম ইথানয়েট লবণ গঠন:</p>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-center text-xs">
                        CH₃COOH + NaOH → CH₃COONa + H₂O
                      </div>
                      <p>৩. সোডা লাইম সহ ডিকার্বক্সিলেশনে উত্তপ্ত করে মিথেন প্রস্তুত:</p>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-center text-xs">
                        CH₃COONa + NaOH(CaO) xrightarrow(তাপ) CH₄↑ + Na₂CO₃
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('gha')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (ঘ) অতিরিক্ত আলুকে জীবাশ্ম জ্বালানির টেকসই বিকল্প হিসেবে ব্যবহারের সম্ভাবনা বিশ্লেষণ করো। <span className="text-xs text-slate-400 ml-2">[৪ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.gha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.gha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        ১. <strong>জীবাশ্ম জ্বালানির সীমাবদ্ধতা:</strong> কয়লা ও পেট্রোলিয়াম অনবায়নযোগ্য এবং পোড়ালে প্রচুর কার্বন মনোক্সাইড, সালফার ডাই-অক্সাইড ও গ্রিনহাউস গ্যাস নির্গত হয় যা বৈশ্বিক উষ্ণায়ন ও এসিড বৃষ্টির সৃষ্টি করে।<br />
                        ২. <strong>বায়ো-ইথানল ও গ্যাসোহল:</strong> নষ্ট হতে বসা আলু থেকে গাঁজন পদ্ধতিতে উৎপাদিত ইথানল একটি নবায়নযোগ্য জৈব জ্বালানি (Biofuel)। পেট্রোলের সাথে ১০% থেকে ২০% ইথানল মিশিয়ে &quot;গ্যাসোহল&quot; তৈরি করা হয়, যা কোনো ইঞ্জিনের ক্ষতি না করেই সরাসরি চালানো যায় (যেমনটি ব্রাজিলে ব্যাপকভাবে ব্যবহৃত)।<br />
                        ৩. <strong>অর্থনৈতিক ও পরিবেশগত লাভ:</strong> এর ফলে জ্বালানি আমদানির ওপর বৈদেশিক মুদ্রার সাশ্রয় হবে, কৃষকরা আলুর ন্যায্যমূল্য পাবে এবং বিষাক্ত ধোঁয়া হ্রাস পাবে। সুতরাং আলু থেকে বায়ো-জ্বালানি উৎপাদন একটি অত্যন্ত সম্ভাবনাময় ও পরিবেশবান্ধব প্রযুক্তি।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: SUMMARY (অধ্যায়ের চূড়ান্ত সারসংক্ষেপ ও চিটশিট)
           ========================================================================= */}
        {currentStep === 'summary' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isBn ? 'অধ্যায় ১১ সারসংক্ষেপ' : 'Chapter 11 Revision Summary'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'পরীক্ষার আগের রাতের রিভিশন চিটশিট' : 'Exam Revision & Formula Cheat Sheet'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'হাইড্রোকার্বনের সব সাধারণ সংকেত, পাতন তাপমাত্রা এবং পলিমারের এক নজরে সারসংক্ষেপ।'
                  : 'All hydrocarbon general formulas, petroleum boiling ranges, and polymer equations at a glance.'}
              </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
              </button>
            </div>
            </div>

            {/* Quick Flashcards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                  <Atom className="w-4 h-4" />
                  <span>সাধারণ সংকেত ম্যাট্রিক্স</span>
                </div>
                <div className="text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
                  <div>• অ্যালকেন: CₙH₂ₙ₊₂</div>
                  <div>• অ্যালকিন: CₙH₂ₙ</div>
                  <div>• অ্যালকাইন: CₙH₂ₙ₋₂</div>
                  <div>• অ্যালকোহল: CₙH₂ₙ₊₁OH</div>
                  <div>• অ্যালডিহাইড: CₙH₂ₙ₊₁CHO</div>
                  <div>• ফ্যাটি এসিড: CₙH₂ₙ₊₁COOH</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                  <TestTube className="w-4 h-4" />
                  <span>অসম্পৃক্ততা পরীক্ষার বর্ণ</span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div>• <strong>ব্রোমিন দ্রবণ:</strong> লাল → বর্ণহীন (অ্যালকিনে)</div>
                  <div>• <strong>বেয়ার পরীক্ষা:</strong> গোলাপি → বর্ণহীন + বাদামি তলানি</div>
                  <div>• <strong>অ্যালকেন:</strong> কোনো বর্ণ পরিবর্তন করে না</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <Factory className="w-4 h-4" />
                  <span>প্রধান পলিমার ও শর্ত</span>
                </div>
                <div className="text-xs space-y-1 font-mono text-slate-700 dark:text-slate-300">
                  <div>• পলিথিন: ১০০০ atm, ২০০°C, O₂</div>
                  <div>• পলিপ্রোপিন: ১৪০ atm, ১২০°C, TiCl₃</div>
                  <div>• PVC: জৈব পারঅক্সাইড অনুঘটক</div>
                </div>
              </div>
            </div>

            {/* Completion Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black">
                  {isBn ? 'অভিনন্দন! অধ্যায় ১১ সম্পূর্ণ প্রস্তুত!' : 'Congratulations! Chapter 11 Completed!'}
                </h3>
                <p className="text-sm text-cyan-100 max-w-lg">
                  {isBn
                    ? 'আপনি জীবাশ্ম জ্বালানি, পেট্রোলিয়ামের আংশিক পাতন, অসম্পৃক্ততা পরীক্ষা, রূপান্তর চক্র এবং পলিমার রসায়ন আয়ত্ত করেছেন।'
                    : 'You have mastered crude oil distillation, hydrocarbon homologues, unsaturation diagnostics, and polymer synthesis.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/playground/v2/chemistry/10"
                  className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {isBn ? 'পূর্ববর্তী অধ্যায় (১০)' : 'Previous Chapter (10)'}
                </Link>
                <Link
                  href={"/dashboard/playground/v2/chemistry/12" as any}
                  className="px-5 py-2.5 rounded-xl bg-white text-cyan-900 hover:bg-cyan-50 text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  {isBn ? 'পরবর্তী অধ্যায়: ১২ (আমাদের জীবনে রসায়ন)' : 'Next: Chapter 12 (Daily Life)'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
            {/* 3. Footer Step Navigation */}
      <StepNavigationFooter
        currentStep={activeStep as StepKey}
        onStepChange={(step) => setActiveStep(step as LearningStep)}
        chapterNumberBn="অধ্যায় 11"
        chapterNumberEn="Chapter 11"
        chapterTitleBn="খনিজ সম্পদ: জীবাশ্ম"
        chapterTitleEn="Mineral Resources: Fossils"
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
                {isBn ? 'অধ্যায় 11 বিশেষজ্ঞ' : 'Chapter 11 Specialist'}
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
              placeholder={isBn ? 'খনিজ সম্পদ: জীবাশ্ম নিয়ে প্রশ্ন করো...' : 'Ask about Mineral Resources: Fossils...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition-all disabled:opacity-50 shrink-0"
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
