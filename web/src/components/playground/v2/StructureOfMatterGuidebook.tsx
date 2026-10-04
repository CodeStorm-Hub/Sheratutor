'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Atom,
  Zap,
  Activity,
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
  Radiation,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Subatomic Particles Data
interface SubatomicParticle {
  nameBn: string;
  nameEn: string;
  symbol: string;
  actualCharge: string;
  relativeCharge: string;
  actualMass: string;
  relativeMass: string;
  discovererBn: string;
}

const SUBATOMIC_PARTICLES: SubatomicParticle[] = [
  {
    nameBn: 'ইলেকট্রন',
    nameEn: 'Electron',
    symbol: 'e⁻',
    actualCharge: '-1.60 × 10⁻¹⁹ C',
    relativeCharge: '-1',
    actualMass: '9.11 × 10⁻²⁸ g (9.11 × 10⁻³¹ kg)',
    relativeMass: '0 (1/1840 of proton)',
    discovererBn: 'জে জে থমসন (১৮৯৭)',
  },
  {
    nameBn: 'প্রোটন',
    nameEn: 'Proton',
    symbol: 'p⁺',
    actualCharge: '+1.60 × 10⁻¹⁹ C',
    relativeCharge: '+1',
    actualMass: '1.673 × 10⁻²⁴ g (1.673 × 10⁻²⁷ kg)',
    relativeMass: '1',
    discovererBn: 'আর্নেস্ট রাদারফোর্ড (১৯১১/১৯১৯)',
  },
  {
    nameBn: 'নিউট্রন',
    nameEn: 'Neutron',
    symbol: 'n⁰',
    actualCharge: '0 (নিরপেক্ষ / Charge-neutral)',
    relativeCharge: '0',
    actualMass: '1.675 × 10⁻²⁴ g (1.675 × 10⁻²⁷ kg)',
    relativeMass: '1',
    discovererBn: 'জেমস চ্যাডউইক (১৯৩২)',
  },
];

// 1 to 30 Element configurations for the interactive orbital builder
interface ElementData {
  z: number;
  symbol: string;
  nameBn: string;
  nameEn: string;
  mass: number;
  electronConfig: string;
  isSpecial: boolean;
  specialNoteBn?: string;
  specialNoteEn?: string;
  shells: [number, number, number, number]; // K, L, M, N
}

const ELEMENTS_1_TO_30: ElementData[] = [
  { z: 1, symbol: 'H', nameBn: 'হাইড্রোজেন', nameEn: 'Hydrogen', mass: 1, electronConfig: '1s¹', isSpecial: false, shells: [1, 0, 0, 0] },
  { z: 2, symbol: 'He', nameBn: 'হিলিয়াম', nameEn: 'Helium', mass: 4, electronConfig: '1s²', isSpecial: false, shells: [2, 0, 0, 0] },
  { z: 3, symbol: 'Li', nameBn: 'লিথিয়াম', nameEn: 'Lithium', mass: 7, electronConfig: '1s² 2s¹', isSpecial: false, shells: [2, 1, 0, 0] },
  { z: 4, symbol: 'Be', nameBn: 'বেরিলিয়াম', nameEn: 'Beryllium', mass: 9, electronConfig: '1s² 2s²', isSpecial: false, shells: [2, 2, 0, 0] },
  { z: 5, symbol: 'B', nameBn: 'বোরন', nameEn: 'Boron', mass: 11, electronConfig: '1s² 2s² 2p¹', isSpecial: false, shells: [2, 3, 0, 0] },
  { z: 6, symbol: 'C', nameBn: 'কার্বন', nameEn: 'Carbon', mass: 12, electronConfig: '1s² 2s² 2p²', isSpecial: false, shells: [2, 4, 0, 0] },
  { z: 7, symbol: 'N', nameBn: 'নাইট্রোজেন', nameEn: 'Nitrogen', mass: 14, electronConfig: '1s² 2s² 2p³', isSpecial: false, shells: [2, 5, 0, 0] },
  { z: 8, symbol: 'O', nameBn: 'অক্সিজেন', nameEn: 'Oxygen', mass: 16, electronConfig: '1s² 2s² 2p⁴', isSpecial: false, shells: [2, 6, 0, 0] },
  { z: 9, symbol: 'F', nameBn: 'ফ্লোরিন', nameEn: 'Fluorine', mass: 19, electronConfig: '1s² 2s² 2p⁵', isSpecial: false, shells: [2, 7, 0, 0] },
  { z: 10, symbol: 'Ne', nameBn: 'নিয়ন', nameEn: 'Neon', mass: 20, electronConfig: '1s² 2s² 2p⁶', isSpecial: false, shells: [2, 8, 0, 0] },
  { z: 11, symbol: 'Na', nameBn: 'সোডিয়াম', nameEn: 'Sodium', mass: 23, electronConfig: '1s² 2s² 2p⁶ 3s¹', isSpecial: false, shells: [2, 8, 1, 0] },
  { z: 12, symbol: 'Mg', nameBn: 'ম্যাগনেসিয়াম', nameEn: 'Magnesium', mass: 24, electronConfig: '1s² 2s² 2p⁶ 3s²', isSpecial: false, shells: [2, 8, 2, 0] },
  { z: 13, symbol: 'Al', nameBn: 'অ্যালুমিনিয়াম', nameEn: 'Aluminum', mass: 27, electronConfig: '1s² 2s² 2p⁶ 3s² 3p¹', isSpecial: false, shells: [2, 8, 3, 0] },
  { z: 14, symbol: 'Si', nameBn: 'সিলিকন', nameEn: 'Silicon', mass: 28, electronConfig: '1s² 2s² 2p⁶ 3s² 3p²', isSpecial: false, shells: [2, 8, 4, 0] },
  { z: 15, symbol: 'P', nameBn: 'ফসফরাস', nameEn: 'Phosphorus', mass: 31, electronConfig: '1s² 2s² 2p⁶ 3s² 3p³', isSpecial: false, shells: [2, 8, 5, 0] },
  { z: 16, symbol: 'S', nameBn: 'সালফার', nameEn: 'Sulfur', mass: 32, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁴', isSpecial: false, shells: [2, 8, 6, 0] },
  { z: 17, symbol: 'Cl', nameBn: 'ক্লোরিন', nameEn: 'Chlorine', mass: 35.5, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁵', isSpecial: false, shells: [2, 8, 7, 0] },
  { z: 18, symbol: 'Ar', nameBn: 'আর্গন', nameEn: 'Argon', mass: 40, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶', isSpecial: false, shells: [2, 8, 8, 0] },
  {
    z: 19,
    symbol: 'K',
    nameBn: 'পটাশিয়াম',
    nameEn: 'Potassium',
    mass: 39,
    electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹',
    isSpecial: true,
    specialNoteBn: '১৯তম ইলেকট্রনটি 3d তে না গিয়ে 4s এ যায়, কারণ (n+l) নিয়মে 4s (৪) এর শক্তি 3d (৫) এর চেয়ে কম!',
    specialNoteEn: '19th electron enters 4s instead of 3d because (n+l) energy for 4s (4+0=4) is lower than 3d (3+2=5)!',
    shells: [2, 8, 8, 1],
  },
  { z: 20, symbol: 'Ca', nameBn: 'ক্যালসিয়াম', nameEn: 'Calcium', mass: 40, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s²', isSpecial: false, shells: [2, 8, 8, 2] },
  { z: 21, symbol: 'Sc', nameBn: 'স্ক্যান্ডিয়াম', nameEn: 'Scandium', mass: 45, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹ 4s²', isSpecial: false, shells: [2, 8, 9, 2] },
  { z: 22, symbol: 'Ti', nameBn: 'টাইটানিয়াম', nameEn: 'Titanium', mass: 48, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d² 4s²', isSpecial: false, shells: [2, 8, 10, 2] },
  { z: 23, symbol: 'V', nameBn: 'ভ্যানাডিয়াম', nameEn: 'Vanadium', mass: 51, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s²', isSpecial: false, shells: [2, 8, 11, 2] },
  {
    z: 24,
    symbol: 'Cr',
    nameBn: 'ক্রোমিয়াম',
    nameEn: 'Chromium',
    mass: 52,
    electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹',
    isSpecial: true,
    specialNoteBn: 'ব্যতিক্রম: d উপশক্তিস্তর অর্ধপূর্ণ (3d⁵) হলে পরমাণু অধিক স্থিতিশীল হয়, তাই 3d⁴ 4s² না হয়ে 3d⁵ 4s¹ হয়!',
    specialNoteEn: 'Exception: Half-filled d subshell (3d⁵) imparts extraordinary stability over 3d⁴ 4s²!',
    shells: [2, 8, 13, 1],
  },
  { z: 25, symbol: 'Mn', nameBn: 'ম্যাঙ্গানিজ', nameEn: 'Manganese', mass: 55, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s²', isSpecial: false, shells: [2, 8, 13, 2] },
  { z: 26, symbol: 'Fe', nameBn: 'আয়রন (লোহা)', nameEn: 'Iron', mass: 56, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²', isSpecial: false, shells: [2, 8, 14, 2] },
  { z: 27, symbol: 'Co', nameBn: 'কোবাল্ট', nameEn: 'Cobalt', mass: 59, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁷ 4s²', isSpecial: false, shells: [2, 8, 15, 2] },
  { z: 28, symbol: 'Ni', nameBn: 'নিকেল', nameEn: 'Nickel', mass: 58.7, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ 4s²', isSpecial: false, shells: [2, 8, 16, 2] },
  {
    z: 29,
    symbol: 'Cu',
    nameBn: 'কপার (তামা)',
    nameEn: 'Copper',
    mass: 63.5,
    electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹',
    isSpecial: true,
    specialNoteBn: 'ব্যতিক্রম: d উপশক্তিস্তর পূর্ণ (3d¹⁰) হলে পরমাণু সর্বাধিক স্থিতিশীল হয়, তাই 3d⁹ 4s² না হয়ে 3d¹⁰ 4s¹ হয়!',
    specialNoteEn: 'Exception: Fully-filled d subshell (3d¹⁰) delivers maximum electronic stability over 3d⁹ 4s²!',
    shells: [2, 8, 18, 1],
  },
  { z: 30, symbol: 'Zn', nameBn: 'জিংক (দস্তা)', nameEn: 'Zinc', mass: 65.4, electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s²', isSpecial: false, shells: [2, 8, 18, 2] },
];

// Authentic Board MCQs for Chapter 3
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

const CHEMISTRY_CH3_BOARD_MCQS: BoardMcq[] = [
  {
    id: 1,
    questionBn: 'পটাশিয়ামের (K, ১৯) ১৯তম ইলেকট্রনটি ৩d অরবিটালে না গিয়ে ৪s অরবিটালে প্রবেশ করে কেন?',
    questionEn: 'Why does the 19th electron of Potassium (K, 19) enter 4s rather than 3d?',
    optionsBn: [
      '৪s অরবিটালের শক্তি ৩d অরবিটালের চেয়ে কম',
      '৩d অরবিটালে ইলেকট্রন ধারণক্ষমতা নেই',
      '৪s অরবিটালে ঘূর্ণন গতিবেগ বেশি',
      '৩d অরবিটালের আকার অতি ক্ষুদ্র',
    ],
    optionsEn: [
      'Energy of 4s is lower than 3d orbital',
      '3d orbital lacks electron capacity',
      '4s orbital electron moves faster',
      '3d orbital is geometrically too small',
    ],
    correctIndex: 0,
    explanationBn:
      'আউফবাউ নীতি অনুসারে নিম্ন শক্তির অরবিটালে ইলেকট্রন আগে প্রবেশ করে। (n+l) শক্তিক্রম অনুযায়ী ৪s এর শক্তি = ৪ + ০ = ৪, আর ৩d এর শক্তি = ৩ + ২ = ৫। যেহেতু ৪s এর শক্তি কম, তাই ১৯তম ইলেকট্রনটি ৪s-এ প্রবেশ করে।',
    explanationEn:
      'By the Aufbau principle, electrons fill lower energy subshells first. Energy index (n+l): for 4s, 4+0=4; for 3d, 3+2=5. Since 4s possesses lower orbital energy, the 19th electron occupies 4s first.',
    boardSource: 'ঢাকা বোর্ড ২০১৮ / রাজশাহী বোর্ড ২০২২',
  },
  {
    id: 2,
    questionBn: 'ক্রোমিয়ামের (Cr, ২৪) সঠিক ইলেকট্রন বিন্যাস কোনটি?',
    questionEn: 'Which is the accurate electron configuration of Chromium (Cr, 24)?',
    optionsBn: [
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁴ 4s²',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s⁰',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁴',
    ],
    optionsEn: [
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁴ 4s²',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s⁰',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁴',
    ],
    correctIndex: 1,
    explanationBn:
      'd অরবিটাল অর্ধপূর্ণ (d⁵) বা সম্পূর্ণ পূর্ণ (d¹⁰) থাকলে পরমাণু সবচেয়ে সুষম ও স্থিতিশীল হয়। তাই ৪s থেকে ১টি ইলেকট্রন ৩d তে গিয়ে ক্রোমিয়ামের বিন্যাস হয় 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹।',
    explanationEn:
      'Half-filled (d⁵) and fully-filled (d¹⁰) subshells provide symmetrical quantum stability. Thus, one 4s electron promotes to 3d, yielding [Ar] 3d⁵ 4s¹ instead of 3d⁴ 4s².',
    boardSource: 'যশোর বোর্ড ২০২০ / কুমিল্লা বোর্ড ২০২৩',
  },
  {
    id: 3,
    questionBn: 'প্রকৃতিতে ক্লোরিনের দুটি আইসোটোপ ³⁵Cl (৭৫%) এবং ³⁷Cl (২৫%) হলে এর গড় আপেক্ষিক পারমাণবিক ভর কত?',
    questionEn: 'Given chlorine isotopes ³⁵Cl (75%) and ³⁷Cl (25%), what is chlorine’s relative atomic mass?',
    optionsBn: ['৩৫.০', '৩৫.৫', '৩৬.০', '৩৭.০'],
    optionsEn: ['35.0', '35.5', '36.0', '37.0'],
    correctIndex: 1,
    explanationBn:
      'গড় আপেক্ষিক পারমাণবিক ভর = (৩৫ × ৭৫ + ৩৭ × ২৫) / ১০০ = (২৬২৫ + ৯২৫) / ১০০ = ৩৫৫০ / ১০০ = ৩৫.৫।',
    explanationEn:
      'Average relative atomic mass = (35 × 75 + 37 × 25) / 100 = (2625 + 925) / 100 = 3550 / 100 = 35.5.',
    boardSource: 'দিনাজপুর বোর্ড ২০১৯ / চট্টগ্রাম বোর্ড ২০২২',
  },
  {
    id: 4,
    questionBn: 'ক্যান্সার আক্রান্ত কোষ ধ্বংস করতে চিকিৎসার ক্ষেত্রে কোন তেজস্ক্রিয় আইসোটোপটি ব্যবহৃত হয়?',
    questionEn: 'Which radioactive isotope is utilized in targeted radiotherapy to destroy cancer cells?',
    optionsBn: ['আয়োডিন-১৩১ (¹³¹I)', 'কোবাল্ট-৬০ (⁶⁰Co)', 'ফসফরাস-৩২ (³²P)', 'কার্বন-১৪ (¹⁴C)'],
    optionsEn: ['Iodine-131 (¹³¹I)', 'Cobalt-60 (⁶⁰Co)', 'Phosphorus-32 (³²P)', 'Carbon-14 (¹⁴C)'],
    correctIndex: 1,
    explanationBn:
      'কোবাল্ট-৬০ (⁶⁰Co) থেকে নির্গত তীব্র ভেদনক্ষমতাসম্পন্ন গামা (γ) রশ্মি ক্যান্সার টিউমারের ক্ষতিকারক কোষগুলোকে ধ্বংস করতে ব্যবহৃত হয়।',
    explanationEn:
      'Cobalt-60 (⁶⁰Co) emits high-energy penetrating gamma (γ) rays that selectively destroy malignant cancerous tumors in radiation therapy.',
    boardSource: 'বরিশাল বোর্ড ২০২০ / সিলেট বোর্ড ২০২১',
  },
  {
    id: 5,
    questionBn: 'রাদারফোর্ড পরমাণু মডেলের সবচেয়ে মারাত্মক তাত্ত্বিক সীমাবদ্ধতা কোনটি?',
    questionEn: 'What is the most critical theoretical limitation of the Rutherford planetary atomic model?',
    optionsBn: [
      'নিউক্লিয়াসের ভর সঠিকভাবে গণনা করতে পারেনি',
      'ম্যাক্সওয়েলের তত্ত্বানুসারে ঘূর্ণায়মান ইলেকট্রন শক্তি হারিয়ে নিউক্লিয়াসে পতিত হয়ে পরমাণু ধ্বংস হওয়ার কথা',
      'ইলেকট্রনের ঋণাত্মক আধান চিহ্নিত করতে পারেনি',
      'প্রোটন সংখ্যা নির্ধারণে ব্যর্থ হয়েছিল',
    ],
    optionsEn: [
      'Inaccurate computation of nuclear mass',
      'According to Maxwell, radiating electrons should spiral into the nucleus, destabilizing the atom',
      'Failed to detect negative charge of electrons',
      'Could not measure proton counts',
    ],
    correctIndex: 1,
    explanationBn:
      'ম্যাক্সওয়েলের তড়িৎচৌম্বকীয় তত্ত্ব অনুসারে চার্জযুক্ত কোনো কণা বৃত্তাকার পথে ঘুরলে ক্রমাগত শক্তি বিকিরণ করবে এবং সর্পিলাকারে ঘুরতে ঘুরতে নিউক্লিয়াসে পতিত হবে। ফলে পরমাণু স্থায়ী হতে পারে না, যা বাস্তব সত্যের বিরোধী। বোর মডেল এই ত্রুটি সংশোধন করে।',
    explanationEn:
      'By Maxwell’s electromagnetic theory, accelerating charged electrons in orbit should continuously radiate energy and spiral down into the nucleus, causing atomic collapse. Bohr solved this by postulating stationary orbits.',
    boardSource: 'সকল বোর্ড সমন্বিত প্রশ্নব্যাংক',
  },
];

export function StructureOfMatterGuidebook() {
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
        ? 'স্বাগতম পদার্থের গঠন ল্যাবে! আমি তোমার AI শিক্ষক। রাদারফোর্ড ও বোর মডেল, আউফবাউ নীতি, পটাসিয়াম ও ক্রোমিয়ামের ইলেকট্রন বিন্যাস কিংবা তেজস্ক্রিয় আইসোটোপ নিয়ে যেকোনো প্রশ্ন করো!'
        : 'Welcome to the Structure of Matter Lab! I am your AI Chemistry Tutor. Ask me anything about Rutherford vs Bohr models, Aufbau energy ladder, Potassium/Chromium configurations, or isotopes!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // SIMULATOR 1: Interactive Bohr Orbit Visualizer State
  const [selectedAtomicZ, setSelectedAtomicZ] = useState<number>(11); // Sodium by default
  const [isPhotonEmitting, setIsPhotonEmitting] = useState<boolean>(false);
  const [quantumJumpFrom, setQuantumJumpFrom] = useState<number>(3);
  const [quantumJumpTo, setQuantumJumpTo] = useState<number>(2);

  // SIMULATOR 2: Aufbau Orbital Energy Ladder
  const [aufbauOrbitalA, setAufbauOrbitalA] = useState<'4s' | '3d' | '5s' | '4d'>('4s');
  const [aufbauOrbitalB, setAufbauOrbitalB] = useState<'3d' | '4p' | '4d' | '5p'>('3d');

  // SIMULATOR 3: Isotope Chlorine Abundance Slider
  const [cl35Percent, setCl35Percent] = useState<number>(75);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Toast
  const [copyToast, setCopyToast] = useState<boolean>(false);

  const currentElement =
    ELEMENTS_1_TO_30.find((e) => e.z === selectedAtomicZ) || ELEMENTS_1_TO_30[10];

  // Photon emission trigger
  const handleTriggerQuantumJump = () => {
    setIsPhotonEmitting(true);
    setTimeout(() => {
      setIsPhotonEmitting(false);
    }, 1500);
  };

  // Save Progress
  const saveProgressToBackend = async (newCompleted: number[]) => {
    try {
      await fetch('/api/playground/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: 3,
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
      titleBn: 'মৌল, প্রতীক ও পরমাণুর ভেতরের কণিকাসমূহ',
      titleEn: 'Elements, Symbols & Subatomic Particles',
      overviewBn:
        '১১টি ল্যাটিন নামের প্রতীক, ইলেকট্রন, প্রোটন ও নিউট্রনের প্রকৃত ভর ও আধান এবং নিউক্লীয় সংকেত থেকে কণা সংখ্যা গণনা।',
      overviewEn:
        'Latin element etymology, real vs relative masses and charges of p⁺, e⁻, n⁰, and nuclear shorthand notations.',
      studyTipBn: 'ইলেকট্রন ও প্রোটনের চার্জ সমান কিন্তু বিপরীত (±১.৬০ × ১০⁻¹⁹ C) এবং নিউট্রন সম্পূর্ণ চার্জহীন!',
      studyTipEn: 'Electrons and protons share equal magnitude charges (±1.60 × 10⁻¹⁹ C) while neutrons are charge-neutral!',
      badgeText: 'ইলেকট্রন, প্রোটন ও নিউট্রন',
    },
    2: {
      no: '০২',
      titleBn: 'রাদারফোর্ড বনাম বোর পরমাণু মডেল ল্যাব',
      titleEn: 'Rutherford vs Bohr Atomic Models Lab',
      overviewBn:
        'রাদারফোর্ডের আলফা কণা বিচ্ছুরণ ও সৌরজগতের মডেল, ম্যাক্সওয়েলের সীমাবদ্ধতা এবং বোরের স্থির কক্ষপথ ও কোয়ান্টাম আলোক ফোটন নির্গমন।',
      overviewEn:
        'Rutherford alpha scattering planetary model limitations vs Bohr stationary quantum orbits and photon emissions.',
      studyTipBn: 'রাদারফোর্ড মডেল পরমাণুর স্থায়িত্ব ও বর্ণালী ব্যাখ্যায় ব্যর্থ হয়; বোর মডেল নির্দিষ্ট কক্ষপথের ধারণা দিয়ে তা সমাধান করে!',
      studyTipEn: 'Maxwellian decay doomed Rutherford’s solar model; Bohr introduced stationary quantization solving atomic stability!',
      badgeText: 'সৌর মডেল বনাম বোর মডেল',
    },
    3: {
      no: '০৩',
      titleBn: 'শক্তিস্তর, অরবিটাল ও আউফবাউ শক্তিক্রম',
      titleEn: 'Energy Shells, Orbitals & Aufbau Ladder',
      overviewBn:
        'প্রধান শক্তিস্তরে ২n² ইলেকট্রন ধারণক্ষমতা, s, p, d, f উপশক্তিস্তর এবং (n+l) শক্তিক্রম অনুযায়ী পটাসিয়ামের ১৯তম ইলেকট্রনের পথ।',
      overviewEn:
        '2n² capacity rule, subshell designations, and the Aufbau (n+l) energy rule explaining Potassium’s 4s vs 3d configuration.',
      studyTipBn: 'পটাশিয়ামের ১৯তম ইলেকট্রন 3d তে যায় না কারণ 4s (৪+০=৪) এর শক্তি 3d (৩+২=৫) এর চেয়ে কম!',
      studyTipEn: 'Potassium’s 19th electron chooses 4s over 3d because 4s (4+0=4) holds lower energy than 3d (3+2=5)!',
      badgeText: 'আউফবাউ নীতি ও (n+l) নিয়ম',
    },
    4: {
      no: '০৪',
      titleBn: '১ থেকে ৩০ মৌলের ইলেকট্রন বিন্যাস ও ব্যতিক্রম',
      titleEn: 'Elements 1–30 Configurations & Exceptions',
      overviewBn:
        'হাইড্রোজেন থেকে জিংক পর্যন্ত লাইভ ইলেকট্রন বিন্যাস বিল্ডার এবং ক্রোমিয়াম (২৪) ও কপার (২৯) এর ব্যতিক্রমী d⁵ ও d¹⁰ স্থিতিশীলতা।',
      overviewEn:
        'Interactive subshell configuration engine across elements 1–30, spotlighting Chromium & Copper’s d⁵ and d¹⁰ orbital stability.',
      studyTipBn: 'd অরবিটাল অর্ধপূর্ণ (d⁵) বা পূর্ণ (d¹⁰) হলে অধিক স্থিতিশীল হয়; তাই Cr হয় 3d⁵ 4s¹ এবং Cu হয় 3d¹⁰ 4s¹!',
      studyTipEn: 'Half-filled (d⁵) and full (d¹⁰) states grant maximum quantum stability: Cr is 3d⁵ 4s¹ and Cu is 3d¹⁰ 4s¹!',
      badgeText: 'Cr ও Cu এর ব্যতিক্রমী বিন্যাস',
    },
    5: {
      no: '০৫',
      titleBn: 'আইসোটোপ, আপেক্ষিক ভর ও রূপপুর পারমাণবিক চুল্লি',
      titleEn: 'Isotopes, Relative Mass & Rooppur Reactor',
      overviewBn:
        'ক্লোরিনের আপেক্ষিক পারমাণবিক ভর (৩৫.৫) হিসাবের মেশিন, চিকিৎসায় তেজস্ক্রিয় আইসোটোপ এবং রূপপুর পারমাণবিক বিদ্যুৎকেন্দ্র।',
      overviewEn:
        'Chlorine 35.5 average mass calculation machine, nuclear medicine isotopes, and Rooppur reactor fission chemistry.',
      studyTipBn: 'চিকিৎসায় কোবাল্ট-৬০ ক্যান্সার ধ্বংসে এবং আয়োডিন-১৩১ থাইরয়েড গ্রন্থির চিকিৎসায় ব্যবহৃত হয়!',
      studyTipEn: 'Cobalt-60 gamma therapy eliminates cancer tumors while Iodine-131 treats thyroid abnormalities!',
      badgeText: 'আইসোটোপ ও পারমাণবিক শক্তি',
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
          chapter: '3 - পদার্থের গঠন (Structure of Matter)',
          context: `বর্তমান পাঠ: ${activeLesson}, নির্বাচিত মৌল: ${currentElement.nameBn} (${currentElement.symbol}, Z=${currentElement.z})`,
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
      setTimeout(() => {
        let fallback = isBn
          ? 'পরমাণু অতি ক্ষুদ্র অবিভাজ্য কণা নয়, বরং এটি ইলেকট্রন, প্রোটন ও নিউট্রন নামক তিনটি স্থায়ী মৌলিক কণিকা নিয়ে গঠিত।'
          : 'Atoms are not indivisible units; they are composed of subatomic electrons, protons, and neutrons.';

        if (userQuery.toLowerCase().includes('রাদারফোর্ড') || userQuery.toLowerCase().includes('বোর') || userQuery.toLowerCase().includes('model')) {
          fallback = isBn
            ? 'রাদারফোর্ড মডেল অনুসারে কেন্দ্রে নিউক্লিয়াস ও বাইরে ইলেকট্রন ঘোরে। তবে ম্যাক্সওয়েলের তত্ত্বানুসারে শক্তি হারিয়ে ইলেকট্রন নিউক্লিয়াসে পড়ে যাওয়ার কথা। বোর মডেল নির্দিষ্ট অনুমোদিত শক্তিস্তর প্রস্তাব করে এই সমস্যার সমাধান দেয়।'
            : 'Rutherford proposed a planetary model with a central nucleus. However, classical electrodynamics dictates orbiting electrons radiate energy and collapse. Bohr resolved this via quantized stationary orbits.';
        } else if (userQuery.toLowerCase().includes('পটাশিয়াম') || userQuery.toLowerCase().includes('potassium') || userQuery.toLowerCase().includes('আউফবাউ')) {
          fallback = isBn
            ? 'পটাশিয়ামের (K, ১৯) ১৯তম ইলেকট্রনটি ৩d তে না গিয়ে ৪s এ যায় কারণ (n+l) শক্তিক্রম অনুযায়ী ৪s (৪+০=৪) এর শক্তি ৩d (৩+২=৫) এর চেয়ে কম। নিম্ন শক্তির অরবিটাল আগে পূর্ণ হয়।'
            : 'Potassium’s 19th electron fills 4s rather than 3d because (n+l) energy of 4s (4+0=4) is strictly lower than 3d (3+2=5). Aufbau dictates lower energy subshells fill first.';
        } else if (userQuery.toLowerCase().includes('ক্রোমিয়াম') || userQuery.toLowerCase().includes('কপার') || userQuery.toLowerCase().includes('ব্যতিক্রম')) {
          fallback = isBn
            ? 'ক্রোমিয়াম (২৪) ও কপার (২৯) এ d অরবিটাল যথাক্রমে অর্ধপূর্ণ (3d⁵) ও সম্পূর্ণ পূর্ণ (3d¹⁰) হলে অধিক স্থিতিশীল হয়। তাই Cr হয় 3d⁵ 4s¹ এবং Cu হয় 3d¹⁰ 4s¹।'
            : 'Chromium (24) and Copper (29) benefit from the quantum stability of half-filled (3d⁵) and fully-filled (3d¹⁰) d subshells, resulting in [Ar] 3d⁵ 4s¹ and [Ar] 3d¹⁰ 4s¹.';
        }

        setChatMessages((prev) => [...prev, { role: 'ai', text: fallback }]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quiz submission
  const handleSelectQuiz = (qId: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    CHEMISTRY_CH3_BOARD_MCQS.forEach((q) => {
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
      ? `SSC রসায়ন অধ্যায় ৩: পদার্থের গঠন (রিভিশন হ্যান্ডনোট)
--------------------------------------------------
১. মৌলিক কণিকাসমূহ:
   - ইলেকট্রন (e⁻): প্রকৃত আধান -১.৬০ × ১০⁻¹⁹ C, ভর ৯.১১ × ১০⁻²⁸ g।
   - প্রোটন (p⁺): প্রকৃত আধান +১.৬০ × ১০⁻¹⁹ C, ভর ১.৬৭৩ × ১০⁻²⁴ g।
   - নিউট্রন (n⁰): আধানহীন (০), ভর ১.৬৭৫ × ১০⁻²⁴ g।
   - নিউক্লীয় সংকেত: ᴬ_Z X; ভরসংখ্যা A = p + n, নিউট্রন সংখ্যা n = A - Z।

২. পরমাণু মডেল:
   - রাদারফোর্ড (১৯১১): সৌর মডেল; সীমাবদ্ধতা: ম্যাক্সওয়েলের তত্ত্বানুসারে পরমাণুর ধ্বংস হওয়া উচিত।
   - বোর (১৯১৩): নির্দিষ্ট বৃত্তাকার স্থির শক্তিস্তর (K, L, M, N); ইলেকট্রন লাফে আলোর ফোটন বিকিরণ (ΔE = hν)।

৩. ইলেকট্রন ধারণক্ষমতা ও আউফবাউ নীতি:
   - প্রধান শক্তিস্তরে সর্বোচ্চ ইলেকট্রন = ২n² (K=২, L=৮, M=১৮, N=৩২)।
   - উপশক্তিস্তরে ধারণক্ষমতা: s=২, p=৬, d=১০, f=১৪।
   - আউফবাউ নীতি (n+l শক্তিক্রম): ১s < ২s < ২p < ৩s < ৩p < ৪s < ৩d < ৪p...
   - পটাশিয়ামের ১৯তম ইলেকট্রন ৪s (৪+০=৪) এ যায়, ৩d (৩+২=৫) তে যায় না।

৪. ব্যতিক্রমী ইলেকট্রন বিন্যাস:
   - ক্রোমিয়াম: Cr(২৪) = ১s² ২s² ২p⁶ ৩s² ৩p⁶ ৩d⁵ ৪s¹ (অর্ধপূর্ণ d⁵ স্থিতিশীলতা)।
   - কপার: Cu(২৯) = ১s² ২s² ২p⁶ ৩s² ৩p⁶ ৩d¹⁰ ৪s¹ (পূর্ণ d¹⁰ স্থিতিশীলতা)।

৫. আইসোটোপ ও আপেক্ষিক ভর:
   - ক্লোরিন: (৩৫ × ৭৫ + ৩৭ × ২৫) / ১০০ = ৩৫.৫।
   - চিকিৎসায় আইসোটোপ: কোবাল্ট-৬০ (ক্যান্সার নিরাময়), আয়োডিন-১৩১ (থাইরয়েড), টেকনেশিয়াম-৯৯m (টিউমার)।
   - বিদ্যুৎ উৎপাদনে ইউরেনিয়াম-২৩৫ (রূপপুর পারমাণবিক বিদ্যুৎকেন্দ্র)।
--------------------------------------------------
শেরাটুটোর ভার্চুয়াল গাইডবুক (SheraTutor.com)`
      : `SSC Chemistry Chapter 3: Structure of Matter (Revision Notes)
--------------------------------------------------
1. Subatomic Particles:
   - Electron: -1.60 × 10⁻¹⁹ C, 9.11 × 10⁻²⁸ g.
   - Proton: +1.60 × 10⁻¹⁹ C, 1.673 × 10⁻²⁴ g.
   - Neutron: 0 C, 1.675 × 10⁻²⁴ g.
   - Nuclear shorthand: ᴬ_Z X; Mass A = p + n, Neutrons n = A - Z.

2. Atomic Models:
   - Rutherford (1911): Solar model; limited by Maxwell electrodynamics instability.
   - Bohr (1913): Quantized stationary orbits; photon emission on downward quantum jumps.

3. Aufbau (n+l) Rule:
   - Max electrons in shell = 2n² (K=2, L=8, M=18, N=32).
   - Capacity: s=2, p=6, d=10, f=14.
   - Potassium: 19th electron enters 4s (4+0=4) instead of 3d (3+2=5).

4. Anomalous Configurations:
   - Chromium: Cr(24) = [Ar] 3d⁵ 4s¹ (half-filled d⁵ stability).
   - Copper: Cu(29) = [Ar] 3d¹⁰ 4s¹ (fully-filled d¹⁰ stability).

5. Isotopes:
   - Chlorine: (35 × 75 + 37 × 25) / 100 = 35.5.
   - Cobalt-60 (cancer therapy), Iodine-131 (thyroid), Uranium-235 (nuclear power).
--------------------------------------------------
SheraTutor Virtual Guidebook (SheraTutor.com)`;

    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Calculate Aufbau (n+l) for the two selected orbitals
  const getOrbitalNL = (orb: string) => {
    const n = parseInt(orb[0], 10);
    const lChar = orb[1];
    const lMap: Record<string, number> = { s: 0, p: 1, d: 2, f: 3 };
    const l = lMap[lChar] || 0;
    return { n, l, sum: n + l };
  };

  const orbA_NL = getOrbitalNL(aufbauOrbitalA);
  const orbB_NL = getOrbitalNL(aufbauOrbitalB);

  // Calculate chlorine average mass from slider
  const cl37Percent = 100 - cl35Percent;
  const calculatedClMass = ((35 * cl35Percent + 37 * cl37Percent) / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-cyan-500/20">
      {/* High-Contrast Top Navigation Bar */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={3}
        chapterTitleBn="পদার্থের গঠন (Structure of Matter)"
        chapterTitleEn="Structure of Matter"
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
                  <span className="text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">CHAPTER 03</span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'পদার্থের গঠন' : 'Structure of Matter'}
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
                  ? 'এনসিটিবি রসায়ন অধ্যায় ৩ (পৃষ্ঠা ৩৫-৫৮) এর রাদারফোর্ড ও বোর পরমাণু মডেল, আউফবাউ নীতি ও আইসোটোপের সম্পূর্ণ প্রমাণ্য বিশ্লেষণ।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 3 (Printed pp. 35–58) with Bohr orbit jump and Aufbau energy simulators.'}
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
                  <Atom className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় ০৩ • পাঠ ${currentLessonMeta.no}` : `Chapter 03 • Lesson ${activeLesson}`}
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
              {/* Lesson 1 Concept: Elements & Subatomic Particles */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  {/* Definition Card */}
                  <div className="rounded-3xl border border-cyan-500/30 bg-card p-6 shadow-xs space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                        <Atom className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                          {isBn ? 'এনসিটিবি প্রামাণ্য ধারণা' : 'Core Concept'}
                        </span>
                        <h3 className="text-lg font-black text-foreground">
                          {isBn ? 'পরমাণুর ভেতরের মৌলিক কণিকাসমূহ' : 'Fundamental Subatomic Particles'}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'পরমাণু অবিভাজ্য নয়। প্রতিটি পরমাণু মূলত তিনটি স্থায়ী মৌলিক কণা নিয়ে গঠিত: ইলেকট্রন (e⁻), প্রোটন (p⁺) এবং নিউট্রন (n⁰)। পরমাণুর কেন্দ্রে অতি ক্ষুদ্র স্থানে প্রোটন ও নিউট্রন মিলে নিউক্লিয়াস গঠন করে, আর ইলেকট্রনগুলো বাইরে ঘূর্ণায়মান থাকে।'
                            : 'Atoms are structurally divisible into three permanent subatomic particles: electrons, protons, and neutrons. Protons and neutrons cluster tightly inside the central nucleus while electrons revolve externally.'}
                        </p>
                      </div>
                    </div>

                    {/* Subatomic Particles Table */}
                    <div className="border border-border/70 rounded-2xl overflow-hidden text-xs">
                      <div className="grid grid-cols-4 bg-muted/60 p-3 font-bold text-foreground border-b border-border/70">
                        <span>কণিকা</span>
                        <span>প্রকৃত আধান (C)</span>
                        <span>প্রকৃত ভর (g / kg)</span>
                        <span>আপেক্ষিক আধান ও ভর</span>
                      </div>
                      {SUBATOMIC_PARTICLES.map((p, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-4 p-3 border-b border-border/40 last:border-b-0 text-muted-foreground items-center"
                        >
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <span className="font-mono text-cyan-600 font-bold">{p.symbol}</span>
                            <span>{isBn ? p.nameBn : p.nameEn}</span>
                          </span>
                          <span className="font-mono">{p.actualCharge}</span>
                          <span className="font-mono">{p.actualMass}</span>
                          <span className="font-mono text-foreground font-semibold">
                            {p.relativeCharge} (ভর {p.relativeMass})
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Nuclear Notation Box */}
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-1.5 text-xs">
                      <strong className="text-cyan-700 dark:text-cyan-300 block font-bold">
                        {isBn ? 'নিউক্লীয় সংকেত কাঠামো (Nuclear Shorthand):' : 'Nuclear Notation Architecture:'}
                      </strong>
                      <div className="flex items-center gap-4 pt-1 font-mono text-foreground">
                        <div className="text-base font-black px-3 py-1 rounded-xl bg-card border border-border">
                          <RenderMathText text="$^A_Z\text{X}$" />
                        </div>
                        <div className="text-xs space-y-0.5 text-muted-foreground">
                          <div>Z = পারমাণবিক সংখ্যা = প্রোটন সংখ্যা = ইলেকট্রন সংখ্যা</div>
                          <div>A = ভরসংখ্যা = প্রোটন সংখ্যা + নিউট্রন সংখ্যা (নিউক্লিয়ন সংখ্যা)</div>
                          <div>নিউট্রন সংখ্যা = A - Z (ভরসংখ্যা - প্রোটন সংখ্যা)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 2 Concept: Rutherford vs Bohr */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'রাদারফোর্ড সৌর মডেল বনাম বোরের কোয়ান্টাম মডেল' : 'Rutherford vs Bohr Atomic Models'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? '১৯১১ সালে আর্নেস্ট রাদারফোর্ড তাঁর ঐতিহাসিক আলফা কণা বিচ্ছুরণ পরীক্ষার ওপর ভিত্তি করে সৌর মডেল প্রস্তাব করেন। ১৯১৩ সালে নীলস বোর ম্যাক্সওয়েলের সীমাবদ্ধতা দূর করে শক্তিস্তরের কোয়ান্টাম ধারণা প্রবর্তন করেন।'
                        : 'Ernest Rutherford’s 1911 solar model revolutionized nuclear discovery. In 1913, Niels Bohr resolved its fatal electrodynamic flaws with quantized stationary orbits.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Rutherford */}
                      <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                          {isBn ? 'রাদারফোর্ড সৌর মডেল (১৯১১)' : 'Rutherford Solar Model'}
                        </span>
                        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                          <li>পরমাণুর কেন্দ্রে একটি অত্যন্ত ক্ষুদ্র ধনাত্মক নিউক্লিয়াস অবস্থিত।</li>
                          <li>পরমাণুর প্রায় সমগ্র ভর নিউক্লিয়াসের ভেতর পুঞ্জীভূত।</li>
                          <li>সৌরজগতের গ্রহগুলোর মতো ইলেকট্রন নিউক্লিয়াসকে কেন্দ্র করে ঘোরে।</li>
                          <li className="text-rose-500 font-semibold">
                            <strong>সীমাবদ্ধতা:</strong> ম্যাক্সওয়েলের তত্ত্বানুসারে ঘূর্ণায়মান চার্জিত ইলেকট্রন অবিরাম শক্তি বিকিরণ করে নিউক্লিয়াসে পতিত হওয়া উচিত (পরমাণু ধ্বংস)।
                          </li>
                        </ul>
                      </div>

                      {/* Bohr */}
                      <div className="p-5 rounded-2xl border border-cyan-500/40 bg-cyan-500/5 space-y-3">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold text-xs">
                          {isBn ? 'বোর পরমাণু মডেল (১৯১৩)' : 'Bohr Quantum Model'}
                        </span>
                        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                          <li>ইলেকট্রন নিউক্লিয়াসকে কেন্দ্র করে কতগুলো নির্দিষ্ট বৃত্তাকার অনুমোদিত কক্ষপথে ঘোরে (K, L, M, N... শক্তিস্তর)।</li>
                          <li>স্থির কক্ষপথে ঘোরার সময় ইলেকট্রন কোনো শক্তি শোষণ বা বিকিরণ করে না।</li>
                          <li>উচ্চ শক্তিস্তর থেকে নিম্নে লাফ দিলে ফোটন আলো বিকিরিত হয়: <RenderMathText text="$\Delta E = h\nu = E_2 - E_1$" />।</li>
                          <li className="text-cyan-600 dark:text-cyan-400 font-semibold">
                            পরমাণুর স্থায়িত্ব ও হাইড্রোজেন বর্ণালী সফলভাবে ব্যাখ্যা করে।
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 3 Concept: Energy Shells & Aufbau Rule */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'শক্তিস্তর, উপশক্তিস্তর ও আউফবাউ নীতি (Aufbau Principle)' : 'Energy Shells, Subshells & Aufbau Rule'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'আউফবাউ (Aufbau) একটি জার্মান শব্দ যার অর্থ ‘গঠন করা’। পরমাণুতে ইলেকট্রন আগে নিম্ন শক্তির অরবিটালে প্রবেশ করে এবং তা পূর্ণ করে ক্রমান্বয়ে উচ্চ শক্তির অরবিটালে যায়।'
                        : 'Aufbau (German: "building up") dictates that electrons systematically occupy the lowest available quantum energy subshell first.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-2">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                          {isBn ? 'শক্তিস্তরে ইলেকট্রন ধারণক্ষমতা:' : 'Shell Capacities:'}
                        </span>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>প্রধান কক্ষপথ: সর্বোচ্চ ইলেকট্রন সংখ্যা = <RenderMathText text="$2n^2$" /></div>
                          <div>K শেল (n=1): <RenderMathText text="$2(1)^2 = 2$" /> টি</div>
                          <div>L শেল (n=2): <RenderMathText text="$2(2)^2 = 8$" /> টি</div>
                          <div>M শেল (n=3): <RenderMathText text="$2(3)^2 = 18$" /> টি</div>
                          <div>N শেল (n=4): <RenderMathText text="$2(4)^2 = 32$" /> টি</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-2">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                          {isBn ? 'অরবিটালের ধারণক্ষমতা ও (n+l) শক্তিক্রম:' : '(n+l) Energy Ordering Rule:'}
                        </span>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>s অরবিটাল: সর্বোচ্চ ২টি (l = 0)</div>
                          <div>p অরবিটাল: সর্বোচ্চ ৬টি (l = 1)</div>
                          <div>d অরবিটাল: সর্বোচ্চ ১০টি (l = 2)</div>
                          <div>f অরবিটাল: সর্বোচ্চ ১৪টি (l = 3)</div>
                          <div className="font-bold text-emerald-600 pt-1">
                            শক্তিক্রম: 1s &lt; 2s &lt; 2p &lt; 3s &lt; 3p &lt; 4s &lt; 3d &lt; 4p &lt; 5s...
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Potassium Classic Problem */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
                      <strong className="text-foreground block text-xs">
                        {isBn ? 'এনসিটিবি বোর্ড প্রশ্ন: পটাসিয়ামের ১৯তম ইলেকট্রন ৩d তে না গিয়ে ৪s এ যায় কেন?' : 'NCTB Question: Why does Potassium 19th electron enter 4s before 3d?'}
                      </strong>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>
                          ৪s অরবিটালের জন্য: <RenderMathText text="$n + l = 4 + 0 = 4$" />
                        </div>
                        <div>
                          ৩d অরবিটালের জন্য: <RenderMathText text="$n + l = 3 + 2 = 5$" />
                        </div>
                        <p className="text-foreground font-semibold pt-1">
                          যেহেতু ৪s অরবিটালের (n+l) এর মান ৩d এর চেয়ে কম, তাই ৪s অরবিটালের শক্তি কম। আউফবাউ নীতি অনুযায়ী ইলেকট্রন আগে নিম্ন শক্তির ৪s পূর্ণ করে, তারপর ৩d তে যায়!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 4 Concept: Exceptions (Cr & Cu) */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'ব্যতিক্রমী ইলেকট্রন বিন্যাস: ক্রোমিয়াম (২৪) ও কপার (২৯)' : 'Electronic Exceptions: Chromium (24) & Copper (29)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'সাধারণ নিয়মে ক্রোমিয়ামের ৩d⁴ ৪s² এবং কপারের ৩d⁹ ৪s² হওয়ার কথা ছিল। কিন্তু কোয়ান্টাম বলবিদ্যায় সমশক্তিসম্পন্ন d উপশক্তিস্তর অর্ধপূর্ণ (d⁵) বা সম্পূর্ণ পূর্ণ (d¹⁰) হলে অধিক স্থিতিশীল হয়।'
                        : 'Normal rules predict 3d⁴ 4s² for Cr and 3d⁹ 4s² for Cu. However, half-filled (d⁵) and fully-filled (d¹⁰) states impart heightened symmetric stability.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2.5">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                          ক্রোমিয়াম (Cr, পারমাণবিক সংখ্যা ২৪)
                        </span>
                        <div className="text-xs space-y-1 text-muted-foreground">
                          <div className="line-through text-rose-500">ভুল বিন্যাস: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁴ 4s²</div>
                          <div className="font-mono text-emerald-600 font-bold text-sm">
                            সঠিক: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹
                          </div>
                          <p className="text-[11px] pt-1">
                            ৪s থেকে একটি ইলেকট্রন ৩d তে স্থানান্তরিত হয়ে d⁵ (অর্ধপূর্ণ) স্থিতিশীল রূপ লাভ করে।
                          </p>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2.5">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                          কপার (Cu, পারমাণবিক সংখ্যা ২৯)
                        </span>
                        <div className="text-xs space-y-1 text-muted-foreground">
                          <div className="line-through text-rose-500">ভুল বিন্যাস: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁹ 4s²</div>
                          <div className="font-mono text-emerald-600 font-bold text-sm">
                            সঠিক: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹
                          </div>
                          <p className="text-[11px] pt-1">
                            ৪s থেকে একটি ইলেকট্রন ৩d তে স্থানান্তরিত হয়ে d¹⁰ (পূর্ণ) সর্বোচ্চ স্থিতিশীল কাঠামো অর্জন করে।
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 5 Concept: Isotopes & Medical Applications */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'আইসোটোপ ও মানবকল্যাণে পারমাণবিক প্রযুক্তি' : 'Isotopes & Peaceful Nuclear Technology'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'যেসব পরমাণুর প্রোটন সংখ্যা সমান কিন্তু ভরসংখ্যা ভিন্ন তাদেরকে পরস্পরের আইসোটোপ বলে। আধুনিক চিকিৎসাবিজ্ঞান, কৃষি ও বিদ্যুৎ উৎপাদনে আইসোটোপ এক যুগান্তকারী ভূমিকা রাখছে।'
                        : 'Atoms sharing identical proton counts but distinct neutron numbers are isotopes. Radioactive isotopes power cancer therapies, agronomy diagnostics, and nuclear fission energy.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1.5">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">কোবাল্ট-৬০ (⁶⁰Co)</span>
                        <h4 className="text-xs font-bold text-foreground">ক্যান্সার কোষ ধ্বংস</h4>
                        <p className="text-[11px] text-muted-foreground">গামা রশ্মির সাহায্যে টিউমার ও ক্যান্সার কোষ ধ্বংস করে রোগীর প্রাণ বাঁচায়।</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1.5">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">আয়োডিন-১৩১ (¹³¹I)</span>
                        <h4 className="text-xs font-bold text-foreground">থাইরয়েড গ্রন্থি নিরাময়</h4>
                        <p className="text-[11px] text-muted-foreground">গলগণ্ড ও থাইরয়েড গ্রন্থির ক্যান্সার শনাক্তকরণ ও চিকিৎসায় ব্যবহৃত হয়।</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1.5">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">ফসফরাস-৩২ (³²P)</span>
                        <h4 className="text-xs font-bold text-foreground">কৃষিক্ষেত্রে পুষ্টি নিরীক্ষা</h4>
                        <p className="text-[11px] text-muted-foreground">উদ্ভিদের মূল কীভাবে ফসফেট সার গ্রহণ করে তা ট্রেসার হিসেবে পর্যবেক্ষণ করে।</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border/70 space-y-1.5">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">ইউরেনিয়াম-২৩৫ (²³⁵U)</span>
                        <h4 className="text-xs font-bold text-foreground">রূপপুর পারমাণবিক কেন্দ্র</h4>
                        <p className="text-[11px] text-muted-foreground">নিয়ন্ত্রিত ফিশন বিক্রিয়ার মাধ্যমে বিপুল তাপশক্তি থেকে বিদ্যুৎ উৎপাদন করে।</p>
                      </div>
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
                      {isBn ? 'সৃজনশীল প্রশ্ন ০১: রাদারফোর্ড ও বোর পরমাণু মডেলের সীমাবদ্ধতা ও ইলেকট্রন বিন্যাস' : 'Board CQ 01: Rutherford vs Bohr Limits & Configurations'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    ১০ নম্বর (10 Marks)
                  </span>
                </div>

                {/* Stimulus Box */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground uppercase tracking-wide block">উদ্দীপক:</span>
                  <p>
                    {isBn
                      ? 'নবম শ্রেণির ছাত্র ফরিদ পরমাণু মডেল আঁকতে গিয়ে একটি কেন্দ্রীয় ধনাত্মক নিউক্লিয়াসকে কেন্দ্র করে ইলেকট্রন সর্পিলাকারে ঘুরতে ঘুরতে কেন্দ্রে পতিত হওয়ার চিত্র অঙ্কন করল। অন্যদিকে শিক্ষক ক্লাসে পটাশিয়াম (K, ১৯) ও ক্রোমিয়াম (Cr, ২৪) মৌল দুটির ইলেকট্রন বিন্যাস বিশ্লেষণ করে এদের ব্যতিক্রমী আচরণের কারণ ব্যাখ্যা করলেন।'
                      : 'Farid drew a model where an orbiting electron spirals into the central nucleus while radiating energy. In class, the instructor demonstrated electronic configurations of Potassium (K, 19) and Chromium (Cr, 24).'}
                  </p>
                </div>

                {/* 4-Tier Rubric Answers */}
                <div className="space-y-4">
                  {/* (ক) জ্ঞানমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>(ক) পারমাণবিক সংখ্যা কাকে বলে? [মান: ১]</span>
                      <span className="text-emerald-600 font-mono">1 Mark</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500">
                      কোনো মৌলের একটি পরমাণুর নিউক্লিয়াসে উপস্থিত মোট প্রোটন সংখ্যাকে ওই মৌলের পারমাণবিক সংখ্যা বলে।
                    </div>
                  </div>

                  {/* (খ) অনুধাবনমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>(খ) পরমাণুতে কখন বর্ণালির সৃষ্টি হয়? ব্যাখ্যা করো। [মান: ২]</span>
                      <span className="text-emerald-600 font-mono">2 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1">
                      <p>
                        বোর পরমাণু মডেল অনুসারে, পরমাণুর ইলেকট্রন যখন কোনো উচ্চ শক্তিস্তর থেকে নিম্ন শক্তিস্তরে নেমে আসে, তখন দুই শক্তিস্তরের শক্তির পার্থক্যের সমান ফোটন আলোক তরঙ্গ বিকিরিত হয়।
                      </p>
                      <p>
                        এই বিকিরিত আলোক তরঙ্গকে প্রিজম বা স্পেকট্রোমিটার দিয়ে বিশ্লেষণ করলে নির্দিষ্ট কম্পাঙ্কের উজ্জ্বল রেখা বা পারমাণবিক বর্ণালির সৃষ্টি হয়।
                      </p>
                    </div>
                  </div>

                  {/* (গ) প্রয়োগমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>(গ) উদ্দীপকের পটাশিয়ামের (K, ১৯) ১৯তম ইলেকট্রনটির অরবিটাল নির্বাচনের কারণ ব্যাখ্যা করো। [মান: ৩]</span>
                      <span className="text-emerald-600 font-mono">3 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1.5">
                      <p>
                        পটাশিয়ামের পারমাণবিক সংখ্যা ১৯। এর প্রথম ১৮টি ইলেকট্রন 1s² 2s² 2p⁶ 3s² 3p⁶ অরবিটালে বিন্যস্ত হয়।
                      </p>
                      <p>
                        আউফবাউ নীতি অনুসারে নিম্ন শক্তির অরবিটালে ইলেকট্রন আগে প্রবেশ করে। (n+l) শক্তিক্রম অনুযায়ী:
                      </p>
                      <div className="p-2 rounded-xl bg-muted/50 font-mono text-center text-foreground">
                        <RenderMathText text="4s \implies n + l = 4 + 0 = 4; \quad 3d \implies n + l = 3 + 2 = 5" />
                      </div>
                      <p>
                        যেহেতু ৪s এর শক্তি ৩d এর চেয়ে কম, তাই ১৯তম ইলেকট্রনটি ৩d তে না গিয়ে আগে ৪s এ প্রবেশ করে। ফলে সঠিক বিন্যাস হয়: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹।
                      </p>
                    </div>
                  </div>

                  {/* (ঘ) উচ্চতর দক্ষতামূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>(ঘ) ফরিদের অঙ্কিত চিত্র অনুসারে পরমাণু কেন স্থায়ী হতে পারে না এবং বোর কীভাবে তা সমাধান করেন—বিশ্লেষণ করো। [মান: ৪]</span>
                      <span className="text-emerald-600 font-mono">4 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1.5">
                      <p>
                        ফরিদের চিত্রটি রাদারফোর্ড পরমাণু মডেলের সবচেয়ে মারাত্মক তাত্ত্বিক সীমাবদ্ধতা নির্দেশ করে।
                      </p>
                      <p>
                        ম্যাক্সওয়েলের ক্লাসিক্যাল তড়িৎচৌম্বকীয় তত্ত্বানুসারে, কোনো চার্জযুক্ত কণা বৃত্তাকার পথে ঘুরলে তা অনবরত শক্তি বিকিরণ করবে। ফলে ঘূর্ণায়মান ইলেকট্রনের কক্ষপথ ক্রমাগত সংকুচিত হয়ে সর্পিলাকারে কেন্দ্রে অবস্থিত নিউক্লিয়াসে পতিত হওয়া উচিত। এর ফলে পরমাণুর অস্তিত্ব সম্পূর্ণ বিলীন হয়ে যেত। কিন্তু বাস্তবে পরমাণু অত্যন্ত সুস্থিত।
                      </p>
                      <p>
                        নীলস বোর ১৯১৩ সালে কোয়ান্টাম তত্ত্ব প্রয়োগ করে এই সংকট সমাধান করেন। বোর প্রমাণ করেন যে ইলেকট্রন নিউক্লিয়াসকে কেন্দ্র করে কতগুলো নির্দিষ্ট অনুমোদিত বৃত্তাকার কক্ষপথে ঘোরে, যেখানে ঘোরার সময় ইলেকট্রন কোনো শক্তি শোষণ বা বিকিরণ করে না। ফলে ইলেকট্রন নিউক্লিয়াসে পতিত হয় না এবং পরমাণুর অবিচল স্থায়িত্ব নিশ্চিত হয়।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Examiner Warning Trap */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <AlertCircle className="h-4 w-4" />
                    <span>পরীক্ষকের ফাঁদ ও সাবধানতা</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    পটাসিয়ামের প্রশ্ন এলে অনেকেই শুধুমাত্র লিখেন ৪s কম শক্তি। অবশ্যই (n+l) গণনা দেখিয়ে ৪+০=৪ এবং ৩+২=৫ লিখে প্রমাণ করতে হবে, নতুবা পূর্ণ নম্বর পাওয়া যায় না!
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
              {/* SIMULATOR 1: Interactive Bohr Atom Orbit Visualizer */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-foreground">
                      ১. বোর পরমাণু ৩D কক্ষপথ ও কোয়ান্টাম জাম্প সিমুলেটর
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      মৌল নির্বাচন করে এর কক্ষপথের ইলেকট্রন ঘূর্ণন দেখো এবং কোয়ান্টাম লাফে ফোটন বিকিরণ পর্যবেক্ষণ করো।
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerQuantumJump}
                    disabled={isPhotonEmitting}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>কোয়ান্টাম জাম্প (ফোটন বিকিরণ)</span>
                  </button>
                </div>

                {/* Concentric Shells Canvas */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 flex flex-col md:flex-row items-center justify-around gap-6">
                  {/* Concentric Orbits SVG / Div Box */}
                  <div className="relative w-72 h-72 flex items-center justify-center">
                    {/* Nucleus */}
                    <div className="w-10 h-10 rounded-full bg-rose-500 shadow-lg flex flex-col items-center justify-center z-20 text-[9px] font-bold text-white">
                      <span>{currentElement.symbol}</span>
                      <span className="text-[7px]">+{currentElement.z}p</span>
                    </div>

                    {/* Shell K (n=1) */}
                    {currentElement.shells[0] > 0 && (
                      <div className="absolute w-24 h-24 rounded-full border border-dashed border-cyan-500/50 flex items-center justify-center">
                        <span className="absolute -top-3 text-[8px] font-mono text-cyan-600 font-bold">K ({currentElement.shells[0]}e)</span>
                      </div>
                    )}

                    {/* Shell L (n=2) */}
                    {currentElement.shells[1] > 0 && (
                      <div className="absolute w-40 h-40 rounded-full border border-dashed border-blue-500/50 flex items-center justify-center">
                        <span className="absolute -top-3 text-[8px] font-mono text-blue-600 font-bold">L ({currentElement.shells[1]}e)</span>
                      </div>
                    )}

                    {/* Shell M (n=3) */}
                    {currentElement.shells[2] > 0 && (
                      <div className="absolute w-56 h-56 rounded-full border border-dashed border-purple-500/50 flex items-center justify-center">
                        <span className="absolute -top-3 text-[8px] font-mono text-purple-600 font-bold">M ({currentElement.shells[2]}e)</span>
                      </div>
                    )}

                    {/* Shell N (n=4) */}
                    {currentElement.shells[3] > 0 && (
                      <div className="absolute w-72 h-72 rounded-full border border-dashed border-amber-500/50 flex items-center justify-center">
                        <span className="absolute -top-3 text-[8px] font-mono text-amber-600 font-bold">N ({currentElement.shells[3]}e)</span>
                      </div>
                    )}

                    {/* Emitted Photon Light Flash */}
                    {isPhotonEmitting && (
                      <div className="absolute z-30 p-2 rounded-full bg-yellow-400 text-yellow-950 text-[10px] font-black animate-ping">
                        ফোটন (hν)
                      </div>
                    )}
                  </div>

                  {/* Element Selector Stepper & Readout */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>মৌল নির্বাচন করো (পারমাণবিক সংখ্যা ১ থেকে ৩০):</span>
                        <span className="font-mono text-cyan-600 font-bold text-sm">
                          {currentElement.nameBn} (Z = {currentElement.z})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={selectedAtomicZ}
                        onChange={(e) => setSelectedAtomicZ(Number(e.target.value))}
                        className="w-full accent-cyan-600 h-2 bg-muted rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Element Overview Card */}
                    <div className="p-4 rounded-xl bg-card border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm">
                          {currentElement.symbol} • {currentElement.nameBn} ({currentElement.nameEn})
                        </span>
                        <span className="font-mono text-muted-foreground">ভরসংখ্যা: {currentElement.mass}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50 font-mono text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                        {currentElement.electronConfig}
                      </div>
                      {currentElement.isSpecial && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                          💡 {currentElement.specialNoteBn}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SIMULATOR 2: Aufbau Orbital Energy Ladder Calculator */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-black text-foreground">
                    ২. আউফবাউ শক্তিক্রম (n+l) ক্যালকুলেটর
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    যেকোনো দুটি অরবিটালের মধ্যে তুলনা করে দেখো কোনটি নিম্ন শক্তির এবং কোনটি আগে ইলেকট্রন দ্বারা পূর্ণ হয়।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Orbital A Box */}
                  <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">প্রথম অরবিটাল নির্বাচন:</span>
                      <select
                        value={aufbauOrbitalA}
                        onChange={(e) => setAufbauOrbitalA(e.target.value as any)}
                        className="p-1.5 rounded-lg bg-muted border border-border text-xs font-bold"
                      >
                        <option value="4s">4s অরবিটাল</option>
                        <option value="3d">3d অরবিটাল</option>
                        <option value="5s">5s অরবিটাল</option>
                        <option value="4d">4d অরবিটাল</option>
                      </select>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 font-mono text-xs space-y-1">
                      <div>প্রধান কোয়ান্টাম সংখ্যা n = {orbA_NL.n}</div>
                      <div>সহকারী কোয়ান্টাম সংখ্যা l = {orbA_NL.l}</div>
                      <div className="font-bold text-cyan-600 text-sm">শক্তি (n + l) = {orbA_NL.sum}</div>
                    </div>
                  </div>

                  {/* Orbital B Box */}
                  <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">দ্বিতীয় অরবিটাল নির্বাচন:</span>
                      <select
                        value={aufbauOrbitalB}
                        onChange={(e) => setAufbauOrbitalB(e.target.value as any)}
                        className="p-1.5 rounded-lg bg-muted border border-border text-xs font-bold"
                      >
                        <option value="3d">3d অরবিটাল</option>
                        <option value="4p">4p অরবিটাল</option>
                        <option value="4d">4d অরবিটাল</option>
                        <option value="5p">5p অরবিটাল</option>
                      </select>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 font-mono text-xs space-y-1">
                      <div>প্রধান কোয়ান্টাম সংখ্যা n = {orbB_NL.n}</div>
                      <div>সহকারী কোয়ান্টাম সংখ্যা l = {orbB_NL.l}</div>
                      <div className="font-bold text-cyan-600 text-sm">শক্তি (n + l) = {orbB_NL.sum}</div>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Verdict */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-foreground space-y-1.5">
                  <div className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>তুলনামূলক সিদ্ধান্ত:</span>
                  </div>
                  <p className="text-muted-foreground">
                    {orbA_NL.sum < orbB_NL.sum ? (
                      <span>
                        {aufbauOrbitalA} এর শক্তি ({orbA_NL.sum}) &lt; {aufbauOrbitalB} এর শক্তি ({orbB_NL.sum})। তাই আউফবাউ নীতি অনুযায়ী <strong>{aufbauOrbitalA}</strong> অরবিটালে ইলেকট্রন আগে প্রবেশ করবে!
                      </span>
                    ) : orbA_NL.sum > orbB_NL.sum ? (
                      <span>
                        {aufbauOrbitalB} এর শক্তি ({orbB_NL.sum}) &lt; {aufbauOrbitalA} এর শক্তি ({orbA_NL.sum})। তাই আউফবাউ নীতি অনুযায়ী <strong>{aufbauOrbitalB}</strong> অরবিটালে ইলেকট্রন আগে প্রবেশ করবে!
                      </span>
                    ) : (
                      <span>
                        উভয় অরবিটালের (n+l) মান সমান ({orbA_NL.sum})। এ ক্ষেত্রে যেটির n এর মান কম ({orbA_NL.n < orbB_NL.n ? aufbauOrbitalA : aufbauOrbitalB}) সেটির শক্তি কম এবং সেটি আগে পূর্ণ হবে!
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* SIMULATOR 3: Isotope Abundance & Relative Atomic Mass Calculator */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-black text-foreground">
                    ৩. আইসোটোপ প্রাচুর্য ও গড় আপেক্ষিক পারমাণবিক ভর ক্যালকুলেটর
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    এনসিটিবি পৃষ্ঠা ৫২-৫৩: ক্লোরিনের দুটি আইসোটোপের শতকরা প্রাচুর্য পরিবর্তন করে গড় ভর ৩৫.৫ এর গাণিতিক উৎপত্তি দেখো।
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-card border border-border text-center space-y-1">
                      <span className="font-bold text-foreground">ক্লোরিন-৩৫ (³⁵Cl)</span>
                      <div className="text-base font-black text-cyan-600">{cl35Percent}%</div>
                      <span className="text-[10px] text-muted-foreground">প্রকৃতিতে স্বাভাবিক প্রাচুর্য: ৭৫%</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-card border border-border text-center space-y-1">
                      <span className="font-bold text-foreground">ক্লোরিন-৩৭ (³⁷Cl)</span>
                      <div className="text-base font-black text-purple-600">{cl37Percent}%</div>
                      <span className="text-[10px] text-muted-foreground">প্রকৃতিতে স্বাভাবিক প্রাচুর্য: ২৫%</span>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>³⁵Cl এর প্রাচুর্য সামঞ্জস্য করো:</span>
                      <span className="font-mono text-cyan-600">{cl35Percent}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={cl35Percent}
                      onChange={(e) => setCl35Percent(Number(e.target.value))}
                      className="w-full accent-cyan-600 h-2 bg-muted rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Live Formula Result */}
                  <div className="p-4 rounded-xl bg-card border border-border text-xs text-center space-y-2">
                    <span className="text-muted-foreground block font-semibold">গড় আপেক্ষিক পারমাণবিক ভর গণনা:</span>
                    <div className="font-mono text-foreground">
                      <RenderMathText
                        text={`$\\text{গড় ভর} = \\frac{35 \\times ${cl35Percent} + 37 \\times ${cl37Percent}}{100} = ${calculatedClMass}$`}
                      />
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
                      অনুধাবন যাচাই: ৫টি বোর্ড বহুনির্বাচনী প্রশ্ন (MCQ)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      বিগত বছরের বোর্ড প্রশ্ন থেকে নির্বাচিত। উত্তর নির্বাচন করে তাৎক্ষণিক ফিডব্যাক যাচাই করো।
                    </p>
                  </div>
                  {quizSubmitted && (
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20">
                      স্কোর: ৫ এ {calculateQuizScore()}
                    </div>
                  )}
                </div>

                {/* 5 Questions */}
                <div className="space-y-6 pt-2">
                  {CHEMISTRY_CH3_BOARD_MCQS.map((q, idx) => {
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
                            <span className="font-bold text-foreground block">সঠিক ব্যাখ্যার বিশ্লেষণ:</span>
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
                      <span>কুইজের উত্তর জমা দিন</span>
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
                      <span>পুনরায় চেষ্টা করুন</span>
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
                      অধ্যায় ৩: সম্পূর্ণ রিভিশন হ্যান্ডনোট ও সূত্রকোষ
                    </h3>
                  </div>
                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copyToast ? 'কপি সম্পন্ন!' : 'হ্যান্ডনোট কপি করুন'}</span>
                  </button>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Particles */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Atom className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span>১. মৌলিক কণিকাসমূহ</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>ইলেকট্রন: -১.৬০ × ১০⁻¹⁹ C, ভর ৯.১১ × ১০⁻²⁸ g।</li>
                      <li>প্রোটন: +১.৬০ × ১০⁻¹⁹ C, ভর ১.৬৭৩ × ১০⁻²⁴ g।</li>
                      <li>নিউট্রন: চার্জহীন, ভর ১.৬৭৫ × ১০⁻²⁴ g।</li>
                    </ul>
                  </div>

                  {/* Card 2: Models */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>২. পরমাণু মডেল ও সীমাবদ্ধতা</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>রাদারফোর্ড মডেল: ম্যাক্সওয়েলের তত্ত্বানুসারে পরমাণু ধ্বংসের আশঙ্কা।</li>
                      <li>বোর মডেল: নির্দিষ্ট অনুমোদিত বৃত্তাকার স্থির কক্ষপথ (K, L, M, N)।</li>
                      <li>আলো বিকিরণ: <RenderMathText text="$\Delta E = h\nu$" />।</li>
                    </ul>
                  </div>

                  {/* Card 3: Aufbau */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-purple-500" />
                      <span>৩. আউফবাউ নীতি ও ব্যতিক্রম</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>পটাশিয়াম (১৯): ৪s (৪+০=৪) &lt; ৩d (৩+২=৫) হওয়ায় ৪s আগে পূর্ণ হয়।</li>
                      <li>ক্রোমিয়াম (২৪): [Ar] 3d⁵ 4s¹ (অর্ধপূর্ণ d⁵ স্থিতিশীল)।</li>
                      <li>কপার (২৯): [Ar] 3d¹⁰ 4s¹ (পূর্ণ d¹⁰ স্থিতিশীল)।</li>
                    </ul>
                  </div>

                  {/* Card 4: Isotopes */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Radiation className="h-4 w-4 text-rose-500" />
                      <span>৪. আইসোটোপ ও চিকিৎসা</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>ক্লোরিনের গড় ভর: (৩৫ × ৭৫ + ৩৭ × ২৫) / ১০০ = ৩৫.৫।</li>
                      <li>কোবাল্ট-৬০: ক্যান্সার টিউমার ধ্বংস।</li>
                      <li>আয়োডিন-১৩১: থাইরয়েড রোগ নিরাময়।</li>
                      <li>ইউরেনিয়াম-২৩৫: রূপপুর পারমাণবিক বিদ্যুৎকেন্দ্রে জ্বালানি।</li>
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
            chapterNumberBn="অধ্যায় ০৩"
            chapterNumberEn="Chapter 03"
            chapterTitleBn="পদার্থের গঠন"
            chapterTitleEn="Structure of Matter"
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
                    AI রসায়ন শিক্ষক
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    অধ্যায় ৩ বিশেষজ্ঞ
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
                  উত্তরের বিশ্লেষণ তৈরি হচ্ছে...
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
                  placeholder="বোর মডেল বা আউফবাউ নিয়ে প্রশ্ন করো..."
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
