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
  Share2,
  BatteryCharging,
  Flame,
  Activity,
  Cable,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Variable Valency Compounds
interface VariableCompound {
  formula: string;
  nameBn: string;
  nameEn: string;
  centralAtomBn: string;
  centralAtomEn: string;
  maxValency: number;
  activeValency: number;
  latentValency: number;
  explanationBn: string;
  explanationEn: string;
}

const VARIABLE_COMPOUNDS: VariableCompound[] = [
  {
    formula: 'FeCl₂',
    nameBn: 'ফেরাস ক্লোরাইড',
    nameEn: 'Ferrous Chloride',
    centralAtomBn: 'আয়রন (Fe)',
    centralAtomEn: 'Iron (Fe)',
    maxValency: 3,
    activeValency: 2,
    latentValency: 1,
    explanationBn: 'আয়রনের সর্বোচ্চ যোজনী ৩, কিন্তু এখানে ২টি Cl পরমাণুর সাথে যুক্ত হওয়ায় সক্রিয় যোজনী ২। সুপ্ত যোজনী = ৩ - ২ = ১।',
    explanationEn: 'Maximum valency is 3, active valency is 2 (bonded to 2 Cl atoms). Latent valency = 3 - 2 = 1.',
  },
  {
    formula: 'FeCl₃',
    nameBn: 'ফেরিক ক্লোরাইড',
    nameEn: 'Ferric Chloride',
    centralAtomBn: 'আয়রন (Fe)',
    centralAtomEn: 'Iron (Fe)',
    maxValency: 3,
    activeValency: 3,
    latentValency: 0,
    explanationBn: 'আয়রন এখানে সর্বোচ্চ ৩টি Cl পরমাণুর সাথে যুক্ত। সক্রিয় যোজনী ৩। সুপ্ত যোজনী = ৩ - ৩ = ০।',
    explanationEn: 'Active valency reaches its maximum of 3. Latent valency = 3 - 3 = 0.',
  },
  {
    formula: 'PCl₃',
    nameBn: 'ফসফরাস ট্রাইক্লোরাইড',
    nameEn: 'Phosphorus Trichloride',
    centralAtomBn: 'ফসফরাস (P)',
    centralAtomEn: 'Phosphorus (P)',
    maxValency: 5,
    activeValency: 3,
    latentValency: 2,
    explanationBn: 'ফসফরাসের সর্বোচ্চ যোজনী ৫, কিন্তু PCl₃ যৌগে সক্রিয় যোজনী ৩। সুপ্ত যোজনী = ৫ - ৩ = ২।',
    explanationEn: 'Phosphorus maximum valency is 5, active is 3. Latent valency = 5 - 3 = 2.',
  },
  {
    formula: 'PCl₅',
    nameBn: 'ফসফরাস পেন্টাক্লোরাইড',
    nameEn: 'Phosphorus Pentachloride',
    centralAtomBn: 'ফসফরাস (P)',
    centralAtomEn: 'Phosphorus (P)',
    maxValency: 5,
    activeValency: 5,
    latentValency: 0,
    explanationBn: 'ফসফরাস উত্তেজিত অবস্থায় ৫টি Cl এর সাথে যুক্ত হয়। সক্রিয় যোজনী ৫। সুপ্ত যোজনী = ৫ - ৫ = ০।',
    explanationEn: 'Phosphorus forms 5 covalent bonds with Cl. Active is 5. Latent valency = 5 - 5 = 0.',
  },
  {
    formula: 'SO₂',
    nameBn: 'সালফার ডাই-অক্সাইড',
    nameEn: 'Sulfur Dioxide',
    centralAtomBn: 'সালফার (S)',
    centralAtomEn: 'Sulfur (S)',
    maxValency: 6,
    activeValency: 4,
    latentValency: 2,
    explanationBn: 'সালফারের সর্বোচ্চ যোজনী ৬। ২টি অক্সিজেন পরমাণুর সাথে মোট ৪টি বন্ধন গঠন করায় সক্রিয় যোজনী ৪। সুপ্ত যোজনী = ৬ - ৪ = ২।',
    explanationEn: 'Sulfur maximum valency is 6. Bonded to 2 divalent oxygens (active = 4). Latent valency = 6 - 4 = 2.',
  },
  {
    formula: 'CO',
    nameBn: 'কার্বন মনোক্সাইড',
    nameEn: 'Carbon Monoxide',
    centralAtomBn: 'কার্বন (C)',
    centralAtomEn: 'Carbon (C)',
    maxValency: 4,
    activeValency: 2,
    latentValency: 2,
    explanationBn: 'কার্বনের সর্বোচ্চ যোজনী ৪, কিন্তু CO গ্যাসে সক্রিয় যোজনী ২। সুপ্ত যোজনী = ৪ - ২ = ২।',
    explanationEn: 'Carbon maximum valency is 4, active in CO is 2. Latent valency = 4 - 2 = 2.',
  },
];

// Molecules with Lone Pair / Bond Pair count
interface MoleculeGeometry {
  formula: string;
  nameBn: string;
  nameEn: string;
  bondTypeBn: string;
  bondTypeEn: string;
  bondPairs: number;
  lonePairs: number;
  shapeBn: string;
  shapeEn: string;
  notesBn: string;
  notesEn: string;
}

const MOLECULES: MoleculeGeometry[] = [
  {
    formula: 'CH₄',
    nameBn: 'মিথেন',
    nameEn: 'Methane',
    bondTypeBn: 'সমযোজী একক বন্ধন (৪টি)',
    bondTypeEn: '4 Covalent Single Bonds',
    bondPairs: 4,
    lonePairs: 0,
    shapeBn: 'চতুস্তলকীয় (Tetrahedral)',
    shapeEn: 'Tetrahedral (109.5°)',
    notesBn: 'কার্বনের যোজ্যতা স্তরের ৪টি ইলেকট্রন ৪টি হাইড্রোজেনের সাথে শেয়ার করে অষ্টক পূর্ণ করে। কোনো মুক্তজোড় নেই।',
    notesEn: 'Carbon shares 4 valence electrons with 4 Hydrogens. Zero lone pairs remain.',
  },
  {
    formula: 'NH₃',
    nameBn: 'অ্যামোনিয়া',
    nameEn: 'Ammonia',
    bondTypeBn: 'সমযোজী একক বন্ধন (৩টি)',
    bondTypeEn: '3 Covalent Single Bonds',
    bondPairs: 3,
    lonePairs: 1,
    shapeBn: 'ত্রিকোণাকার পিরামিডীয় (Pyramidal)',
    shapeEn: 'Trigonal Pyramidal (107°)',
    notesBn: 'নাইট্রোজেনের যোজ্যতা স্তরের ৫টি ইলেকট্রনের ৩টি বন্ধনে যুক্ত (BP=3) এবং ১ জোড়া নিঃসঙ্গ/মুক্তজোড় (LP=1) হিসেবে অবশিষ্ট থাকে।',
    notesEn: 'Nitrogen uses 3 electrons to bond with 3 Hydrogens (BP=3), leaving 1 lone pair (LP=1).',
  },
  {
    formula: 'H₂O',
    nameBn: 'পানি',
    nameEn: 'Water',
    bondTypeBn: 'সমযোজী পোলার বন্ধন (২টি)',
    bondTypeEn: '2 Polar Covalent Bonds',
    bondPairs: 2,
    lonePairs: 2,
    shapeBn: 'কৌণিক / V-আকৃতির (Bent)',
    shapeEn: 'Bent / V-shaped (104.5°)',
    notesBn: 'অক্সিজেনের ৬টি যোজ্যতা ইলেকট্রনের ২টি বন্ধনে অংশ নেয় (BP=2) এবং ৪টি ইলেকট্রন অর্থাৎ ২ জোড়া মুক্তজোড় (LP=2) হিসেবে থাকে।',
    notesEn: 'Oxygen bonds with 2 Hydrogens (BP=2), retaining 2 lone pairs (LP=2) which bend the molecule.',
  },
  {
    formula: 'HF',
    nameBn: 'হাইড্রোজেন ফ্লোরাইড',
    nameEn: 'Hydrogen Fluoride',
    bondTypeBn: 'তীব্র পোলার সমযোজী বন্ধন',
    bondTypeEn: 'Highly Polar Covalent',
    bondPairs: 1,
    lonePairs: 3,
    shapeBn: 'সরলরৈখিক (Linear)',
    shapeEn: 'Linear',
    notesBn: 'ফ্লোরিনের ৭টি বহিঃস্থ ইলেকট্রনের ১টি বন্ধনে অংশ নেয় (BP=1) এবং ৩ জোড়া মুক্তজোড় ইলেকট্রন (LP=3) অক্ষত থাকে।',
    notesEn: 'Fluorine forms 1 single bond with Hydrogen (BP=1), keeping 3 lone pairs (LP=3).',
  },
  {
    formula: 'O₂',
    nameBn: 'অক্সিজেন অণু',
    nameEn: 'Oxygen Molecule',
    bondTypeBn: 'সমযোজী দ্বিবন্ধন (O=O)',
    bondTypeEn: 'Covalent Double Bond (O=O)',
    bondPairs: 2,
    lonePairs: 4,
    shapeBn: 'সরলরৈখিক (Linear)',
    shapeEn: 'Linear',
    notesBn: 'দুটি অক্সিজেন পরমাণু প্রত্যেকে ২টি করে ইলেকট্রন শেয়ার করে মোট ২ জোড়া বন্ধন তৈরি করে (BP=2)। প্রতিটি অক্সিজেনে ২ জোড়া করে মোট ৪ জোড়া LP থাকে।',
    notesEn: 'Each Oxygen shares 2 electrons forming 2 bond pairs (O=O), with 2 lone pairs on each atom.',
  },
  {
    formula: 'N₂',
    nameBn: 'নাইট্রোজেন অণু',
    nameEn: 'Nitrogen Molecule',
    bondTypeBn: 'সমযোজী ত্রিবন্ধন (N≡N)',
    bondTypeEn: 'Covalent Triple Bond (N≡N)',
    bondPairs: 3,
    lonePairs: 2,
    shapeBn: 'সরলরৈখিক (Linear)',
    shapeEn: 'Linear',
    notesBn: 'উভয় নাইট্রোজেন ৩টি করে ইলেকট্রন শেয়ার করে ত্রিবন্ধন (৩ জোড়া BP) গঠন করে। এই ত্রিবন্ধন ভাঙতে ৯৪৫ kJ/mol শক্তি লাগে, তাই N₂ নিষ্ক্রিয় গ্যাসের মতো আচরণ করে!',
    notesEn: 'Two Nitrogens share 3 electron pairs (N≡N). High bond dissociation energy (945 kJ/mol) makes it inert.',
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
    questionBn: 'FeCl₂ যৌগে আয়রনের সুপ্ত যোজনী (Latent Valency) কত?',
    questionEn: 'What is the latent valency of Iron in FeCl₂?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২২, রাজশাহী বোর্ড ২০১৯',
    boardInfoEn: 'Dhaka Board 2022, Rajshahi Board 2019',
    options: [
      { key: 'A', textBn: '০ (শূন্য)', textEn: '0 (Zero)' },
      { key: 'B', textBn: '১', textEn: '1' },
      { key: 'C', textBn: '২', textEn: '2' },
      { key: 'D', textBn: '৩', textEn: '3' },
    ],
    correctKey: 'B',
    explanationBn:
      'আয়রনের (Fe) সর্বোচ্চ যোজনী ৩। FeCl₂ যৌগে আয়রনের সক্রিয় যোজনী ২। অতএব সুপ্ত যোজনী = সর্বোচ্চ যোজনী - সক্রিয় যোজনী = ৩ - ২ = ১।',
    explanationEn:
      'Iron’s maximum valency is 3. In FeCl₂, its active valency is 2. Latent valency = Maximum - Active = 3 - 2 = 1.',
  },
  {
    id: 2,
    questionBn: 'পানি (H₂O) অণুতে মোট কয়টি মুক্তজোড় (Lone Pair) ইলেকট্রন রয়েছে?',
    questionEn: 'How many lone pairs of electrons are in a water (H₂O) molecule?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২৩, কুমিল্লা বোর্ড ২০২১',
    boardInfoEn: 'Dinajpur Board 2023, Cumilla Board 2021',
    options: [
      { key: 'A', textBn: '১ জোড়া', textEn: '1 pair' },
      { key: 'B', textBn: '২ জোড়া', textEn: '2 pairs' },
      { key: 'C', textBn: '৩ জোড়া', textEn: '3 pairs' },
      { key: 'D', textBn: '৪ জোড়া', textEn: '4 pairs' },
    ],
    correctKey: 'B',
    explanationBn:
      'অক্সিজেনের সর্ববহিঃস্থ স্তরে ৬টি ইলেকট্রন থাকে। এর মধ্যে ২টি ইলেকট্রন দুটি হাইড্রোজেনের সাথে বন্ধনজোড় (BP=2) তৈরি করে। বাকি ৪টি ইলেকট্রন ২ জোড়া মুক্তজোড় (LP=2) হিসেবে বিদ্যমান।',
    explanationEn:
      'Oxygen has 6 valence electrons: 2 form single bonds with H (BP=2), and the remaining 4 electrons constitute 2 lone pairs (LP=2).',
  },
  {
    id: 3,
    questionBn: 'কোন যৌগটিতে অষ্টক সম্প্রসারণ (Octet Expansion) ঘটেছে?',
    questionEn: 'In which compound has octet expansion occurred?',
    boardInfoBn: 'যশোর বোর্ড ২০২০, চট্টগ্রাম বোর্ড ২০২২',
    boardInfoEn: 'Jashore Board 2020, Chattogram Board 2022',
    options: [
      { key: 'A', textBn: 'CH₄ (মিথেন)', textEn: 'CH₄ (Methane)' },
      { key: 'B', textBn: 'BF₃ (বোরন ট্রাইফ্লোরাইড)', textEn: 'BF₃ (Boron Trifluoride)' },
      { key: 'C', textBn: 'PCl₅ (ফসফরাস পেন্টাক্লোরাইড)', textEn: 'PCl₅ (Phosphorus Pentachloride)' },
      { key: 'D', textBn: 'NH₃ (অ্যামোনিয়া)', textEn: 'NH₃ (Ammonia)' },
    ],
    correctKey: 'C',
    explanationBn:
      'PCl₅ যৌগে কেন্দ্রীয় ফসফরাস পরমাণু ৫টি ক্লোরিনের সাথে ৫টি সমযোজী বন্ধন তৈরি করে। ফলে ফসফরাসের বহিঃস্থ স্তরে ৫ × ২ = ১০টি ইলেকট্রন থাকে, যা অষ্টক (৮টি) অপেক্ষা বেশি। এটি অষ্টক সম্প্রসারণের উদাহরণ।',
    explanationEn:
      'In PCl₅, the central phosphorus atom shares 5 electron pairs with 5 chlorine atoms, accommodating 10 electrons in its outer shell (octet expansion).',
  },
  {
    id: 4,
    questionBn: 'ধাতু বিদ্যুৎ সুপরিবাহী কেন? এর পেছনের মূল কারণ কী?',
    questionEn: 'Why do metals conduct electricity so efficiently?',
    boardInfoBn: 'সিলেট বোর্ড ২০২২, ময়মনসিংহ বোর্ড ২০২৩',
    boardInfoEn: 'Sylhet Board 2022, Mymensingh Board 2023',
    options: [
      { key: 'A', textBn: 'ধাতুসমূহ কঠিন ও দৃঢ় ক্রিস্টাল হওয়ায়', textEn: 'Because metals have rigid crystal structures' },
      { key: 'B', textBn: 'ধাতুতে মুক্ত সঞ্চারণশীল ইলেকট্রনের সাগর (Delocalized Electrons) থাকায়', textEn: 'Presence of a delocalized sea of mobile valence electrons' },
      { key: 'C', textBn: 'ধাতব পরমাণুগুলো পরস্পর খুব কাছাকাছি থাকে বলে', textEn: 'Because metallic atoms are packed tightly' },
      { key: 'D', textBn: 'ধাতুর গলনাঙ্ক খুব উচ্চ হওয়ায়', textEn: 'Due to very high melting points' },
    ],
    correctKey: 'B',
    explanationBn:
      'ধাতব বন্ধনে পরমাণুগুলোর বহিঃস্থ ইলেকট্রন বিচ্ছিন্ন হয়ে সমগ্র ধাতুর জালক জুড়ে অবাধে সঞ্চারণশীল (Delocalized Electron Sea) হয়। বিদ্যুৎ বিভব প্রয়োগ করলে এই মুক্ত ইলেকট্রনগুলো ঋণাত্মক প্রান্ত থেকে ধনাত্মক প্রান্তে ধাবিত হয়ে বিদ্যুৎ পরিবহন করে।',
    explanationEn:
      'Valence electrons detach to form a mobile delocalized electron cloud flowing freely through positive atomic kernels upon voltage difference.',
  },
  {
    id: 5,
    questionBn: 'কঠিন সোডিয়াম ক্লোরাইড (NaCl) বিদ্যুৎ পরিবহন করে না, কিন্তু গলিত বা জলীয় NaCl বিদ্যুৎ পরিবহন করে কেন?',
    questionEn: 'Why does solid NaCl not conduct electricity, while molten or aqueous NaCl conducts readily?',
    boardInfoBn: 'বরিশাল বোর্ড ২০১৯, ঢাকা বোর্ড ২০২৩',
    boardInfoEn: 'Barishal Board 2019, Dhaka Board 2023',
    options: [
      { key: 'A', textBn: 'কঠিন অবস্থায় আয়নগুলোর আকার ছোট থাকে', textEn: 'Ions are smaller in solid phase' },
      { key: 'B', textBn: 'কঠিন জালকে আয়নগুলো মুক্তভাবে চলাচল করতে পারে না, কিন্তু গলিত/জলীয় অবস্থায় মুক্ত আয়ন সৃষ্টি হয়', textEn: 'Ions are locked in lattice when solid; free mobile ions exist in molten/aqueous state' },
      { key: 'C', textBn: 'পানিতে ফেললে সমযোজী বন্ধন তৈরি হয়', textEn: 'Forms covalent bonds in water' },
      { key: 'D', textBn: 'কঠিন অবস্থায় ইলেকট্রন চলাচল করে', textEn: 'Electrons move in solid state' },
    ],
    correctKey: 'B',
    explanationBn:
      'কঠিন অবস্থায় Na⁺ ও Cl⁻ আয়নগুলি শক্তিশালী ত্রিমাত্রিক ক্রিস্টাল জালকে অনড় অবস্থায় আবদ্ধ থাকে। কিন্তু পানিতে দ্রবীভূত করলে পানির পোলারিটির কারণে আয়নগুলি মুক্ত (Hydrated Na⁺ ও Cl⁻) হয়ে দ্রবণে স্বাধীনভাবে চলাচল করতে পারে এবং বিদ্যুৎ পরিবহন করে।',
    explanationEn:
      'Solid NaCl locks ions immovably within a 3D crystal lattice. Water polar molecules hydrate and liberate free Na⁺ and Cl⁻ ions, enabling electrical conduction.',
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

export const CHAPTER_5_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "যোজ্যতা ইলেকট্রন, যোজনী ও সুপ্ত যোজনী",
    titleEn: "Valence Electrons, Valency & Latent Valency",
    overviewBn: "সর্ববহিঃস্থ স্তরের ইলেকট্রন, পরিবর্তনশীল যোজনী এবং সক্রিয় ও সর্বোচ্চ যোজনীর পার্থক্য থেকে সুপ্ত যোজনী নির্ণয়।",
    overviewEn: "Valence electron configurations, variable valencies, and latent valency computations.",
    studyTipBn: "SO₂ এ সালফারের সক্রিয় যোজনী ৪, সর্বোচ্চ ৬; সুতরাং সুপ্ত যোজনী = ৬ - ৪ = ২!",
    studyTipEn: "In SO₂, active valency of sulfur is 4, max is 6; hence latent valency = 6 - 4 = 2!",
    badgeText: "যোজ্যতা ও সুপ্ত যোজনী",
  },
  2: {
    no: "০২",
    titleBn: "অষ্টক ও দুইয়ের নিয়ম এবং নিষ্ক্রিয় গ্যাসের সুস্থিতি",
    titleEn: "Octet & Duplet Rules and Inert Gas Stability",
    overviewBn: "নিষ্ক্রিয় গ্যাসের অষ্টক পূর্ণতা (ns² np⁶), দ্বিত্ব নিয়ম (হিলিয়াম) এবং বন্ধন গঠনের চালিকাশক্তি।",
    overviewEn: "Noble gas ns² np⁶ duplet and octet stable structures as the driving force of chemical bonding.",
    studyTipBn: "CH₄, BF₃, PCl₅ এর ক্ষেত্রে অষ্টক নিয়ম ও অষ্টক সম্প্রসারণের ধারণা লক্ষ্য করো!",
    studyTipEn: "Observe octet completion in CH₄ and expanded or deficient shells in BF₃ and PCl₅!",
    badgeText: "অষ্টক ও দুইয়ের নিয়ম",
  },
  3: {
    no: "০৩",
    titleBn: "ক্যাটায়ন, অ্যানায়ন ও আয়নিক বন্ধন ল্যাব",
    titleEn: "Cations, Anions & Ionic Bond Lab",
    overviewBn: "ধাতু কর্তৃক ইলেকট্রন বর্জন ও অধাতুর গ্রহণ, স্থিরবৈদ্যুতিক আকর্ষণ বল এবং NaCl ও MgO ক্রিস্টাল জালক গঠন।",
    overviewEn: "Electron transfer forming cations and anions, lattice electrostatic forces, and NaCl/MgO crystals.",
    studyTipBn: "আয়নিক বন্ধন কেবল ধাতু ও অধাতুর মধ্যেই ইলেকট্রন স্থানান্তরের মাধ্যমে গঠিত হয়!",
    studyTipEn: "Ionic bonds form exclusively between metals and nonmetals through complete electron transfer!",
    badgeText: "আয়নিক বন্ধন ও জালক",
  },
  4: {
    no: "০৪",
    titleBn: "সমযোজী বন্ধন, মুক্তজোড়-বন্ধনজোড় ও পোলারিটি",
    titleEn: "Covalent Bonds, Lone Pairs & Polarity",
    overviewBn: "অধাতুসমূহের ইলেকট্রন শেয়ারিং, একক/দ্বি/ত্রিবন্ধন এবং পানির পোলারিটি ও হাইড্রোজেন বন্ধন।",
    overviewEn: "Electron pair sharing, single/double/triple covalent linkages, and water dipoles and lone pairs.",
    studyTipBn: "পানি (H₂O) তে ২ জোড়া বন্ধনজোড় এবং অক্সিজেনে ২ জোড়া মুক্তজোড় ইলেকট্রন বিদ্যমান!",
    studyTipEn: "Water (H₂O) possesses 2 bond pairs and 2 lone pairs on the central oxygen atom!",
    badgeText: "সমযোজী বন্ধন ও পোলারিটি",
  },
  5: {
    no: "০৫",
    titleBn: "ধাতব বন্ধন ও যৌগের ভৌত ধর্ম ল্যাব",
    titleEn: "Metallic Bond & Physical Properties Lab",
    overviewBn: "সঞ্চারণশীল ইলেকট্রন সাগর, গলনাঙ্ক-স্ফুটনাঙ্ক, বিদ্যুৎ পরিবাহিতা ও দ্রাব্যতা পরীক্ষা।",
    overviewEn: "Delocalized electron sea model, melting points, electrical conductivity, and aqueous solubility.",
    studyTipBn: "আয়নিক যৌগ কঠিন অবস্থায় বিদ্যুৎ অপরিবাহী, কিন্তু গলিত বা জলীয় দ্রবণে তীব্র পরিবাহী!",
    studyTipEn: "Ionic crystals insulate when solid, but conduct electricity vigorously when molten or dissolved!",
    badgeText: "তড়িৎ পরিবাহিতা ও দ্রাব্যতা",
  },
};

export function ChemicalBondsGuidebook() {
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
        ? 'স্বাগতম রাসায়নিক বন্ধন ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Chemical Bonds Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_5_LESSONS[activeLesson] || CHAPTER_5_LESSONS[1];
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
          chapter: '5 - রাসায়নিক বন্ধন (Chemical Bonds)',
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
          { role: 'ai', text: isBn ? 'রাসায়নিক বন্ধন হলো পরমাণুসমূহের সুস্থিত অষ্টক অর্জনের জন্য ইলেকট্রন আদান-প্রদান বা শেয়ারের আকর্ষণ শক্তি।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ৫: রাসায়নিক বন্ধন (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. যোজনী ও যোজ্যতা ইলেকট্রন:\n   - বহিঃস্থ স্তরের মোট ইলেকট্রন = যোজ্যতা ইলেকট্রন।\n   - যৌগ গঠনের সময় শেয়ার বা আদান-প্রদানকৃত ইলেকট্রন সংখ্যা = যোজনী।\n   - সুপ্ত যোজনী = সর্বোচ্চ যোজনী - সক্রিয় যোজনী।\n২. বন্ধনের প্রকারভেদ:\n   - আয়নিক বন্ধন: ধাতু + অধাতু (ইলেকট্রন স্থানান্তর; যেমন NaCl, CaO)।\n   - সমযোজী বন্ধন: অধাতু + অধাতু (ইলেকট্রন শেয়ারিং; যেমন CH₄, H₂O, HCl)।\n   - ধাতব বন্ধন: ধাতু + ধাতু (সঞ্চারণশীল ইলেকট্রন সাগর)।\n৩. যৌগের বৈশিষ্ট্য:\n   - আয়নিক যৌগ: উচ্চ গলনাঙ্ক-স্ফুটনাঙ্ক, পানিতে দ্রবণীয়, গলিত/দ্রবণে বিদ্যুৎ পরিবাহী।\n   - সমযোজী যৌগ: নিম্ন গলনাঙ্ক-স্ফুটনাঙ্ক, পানিতে অদ্রবণীয় (পোলার ব্যতীত), বিদ্যুৎ অপরিবাহী।`
      : `SSC Chemistry Chapter 5: Chemical Bonds Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1 State: Bond Builder
  const [bondDemo, setBondDemo] = useState<'ionic_nacl' | 'ionic_mgo' | 'cov_h2' | 'cov_o2' | 'cov_n2' | 'cov_h2o'>('ionic_nacl');
  const [isFormed, setIsFormed] = useState<boolean>(false);

  // Simulator 2 State: Molecule Lone Pair Scanner
  const [selectedMolecule, setSelectedMolecule] = useState<string>('H₂O');

  // Simulator 3 State: Latent Valency Calculator
  const [selectedCompoundFormula, setSelectedCompoundFormula] = useState<string>('FeCl₂');

  // Simulator 4 State: Electrical Conductivity Lab
  const [testedSubstance, setTestedSubstance] = useState<'solid_nacl' | 'aqueous_nacl' | 'aqueous_sugar'>('solid_nacl');
  const [circuitOn, setCircuitOn] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // CQ Rubric Accordion
  const [openRubric, setOpenRubric] = useState<string | null>('d');

  const currentMolecule =
    MOLECULES.find((m) => m.formula === selectedMolecule) || MOLECULES[0];

  const currentCompound =
    VARIABLE_COMPOUNDS.find((c) => c.formula === selectedCompoundFormula) ||
    VARIABLE_COMPOUNDS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-teal-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={5}
        chapterTitleBn="রাসায়নিক বন্ধন"
        chapterTitleEn="Chemical Bonds"
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
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-teal-600 dark:text-teal-400" />
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
                  <span className="text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                    CHAPTER 05
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'রাসায়নিক বন্ধন' : 'Chemical Bonds'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = CHAPTER_5_LESSONS[lNum];
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
                          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 shadow-xs'
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
                                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
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
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300">
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
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় 5 (পৃষ্ঠা ৮২ - ১১৩) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 5 (Printed pp. ৮২ - ১১৩) aligned with NCTB syllabus.'}
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
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-bold border border-teal-500/20">
                  <Share2 className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 05 • পাঠ ${currentLessonMeta.no}` : `Chapter 05 • Lesson ${activeLesson}`}
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
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
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
          {/* Section 5.1 & 5.2: Valence Electrons & Valency */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Atom className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৫.১ যোজ্যতা ইলেকট্রন, যোজনী ও সুপ্ত যোজনী'
                    : '5.1 Valence Electrons, Valency & Latent Valency'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'পরমাণুর সবচেয়ে বাইরের স্তরের ইলেকট্রন কীভাবে যৌগ গঠনের চাবিকাঠি হয়'
                    : 'How outermost valence electrons control chemical bonding behavior'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Valence Electrons */}
              <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-600">
                  যোজ্যতা ইলেকট্রন
                </div>
                <h3 className="text-sm font-bold text-foreground">সর্ববহিঃস্থ স্তরের মোট ইলেকট্রন</h3>
                <p className="text-xs text-muted-foreground">
                  যেকোনো মৌলের ইলেকট্রন বিন্যাসের সর্বশেষ প্রধান শক্তিস্তরে মোট যতটি ইলেকট্রন থাকে, তাকে <strong>যোজ্যতা ইলেকট্রন</strong> বলে।
                </p>
                <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono">
                  <p className="text-foreground">K (19): 2, 8, 8, 1 → যোজ্যতা e⁻ = ১</p>
                  <p className="text-foreground">O (8): 2, 6 → যোজ্যতা e⁻ = ৬</p>
                  <p className="text-foreground">Cl (17): 2, 8, 7 → যোজ্যতা e⁻ = ৭</p>
                </div>
              </div>

              {/* Valency */}
              <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-600">
                  যোজনী (Valency)
                </div>
                <h3 className="text-sm font-bold text-foreground">যুক্ত হওয়ার ক্ষমতা বা হাত</h3>
                <p className="text-xs text-muted-foreground">
                  যৌগ গঠনের সময় কোনো মৌলের একটি পরমাণু অন্য পরমাণুর সাথে যতটি ইলেকট্রন গ্রহণ, বর্জন বা শেয়ার করে তাকে <strong>যোজনী</strong> বলে।
                </p>
                <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono">
                  <p className="text-foreground">H, Na, K, Cl = ১ যোজী</p>
                  <p className="text-foreground">O, Mg, Ca = ২ যোজী</p>
                  <p className="text-foreground">N, Al = ৩ যোজী; C = ৪ যোজী</p>
                </div>
              </div>

              {/* Latent Valency */}
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-5 space-y-3">
                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-600">
                  সুপ্ত যোজনী (Latent Valency)
                </div>
                <h3 className="text-sm font-bold text-foreground">সর্বোচ্চ - সক্রিয় যোজনী</h3>
                <p className="text-xs text-muted-foreground">
                  যেসব মৌলের পরিবর্তনশীল যোজনী রয়েছে, তাদের সর্বোচ্চ যোজনী ও সক্রিয় যোজনীর বিয়োগফলকে <strong>সুপ্ত যোজনী</strong> বলে।
                </p>
                <div className="bg-background/80 p-2.5 rounded-xl text-xs font-mono border border-border/60">
                  <p className="text-teal-700 dark:text-teal-300 font-bold">সুপ্ত যোজনী = সর্বোচ্চ - সক্রিয়</p>
                  <p className="text-foreground mt-1">FeCl₂: ৩ - ২ = ১</p>
                  <p className="text-foreground">PCl₃: ৫ - ৩ = ২</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5.3 & 5.4: Octet & Duplet Rules */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৫.৪ অষ্টক নিয়ম (Octet) ও দুইয়ের নিয়ম (Duplet)'
                    : '5.4 The Octet Rule & The Duplet (Two) Rule'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'পরমাণুসমূহ কেন বন্ধন গঠন করে? নিষ্ক্রিয় গ্যাসের স্থিতিশীলতার অন্বেষণ'
                    : 'Why atoms bond: Attaining stable noble gas electronic configurations'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Octet Rule */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">অষ্টক নিয়ম (Octet Rule)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  অণু গঠনের সময় পরমাণুগুলো ইলেকট্রন আদান-প্রদান বা শেয়ারের মাধ্যমে তাদের সর্ববহিঃস্থ প্রধান শক্তিস্তরে <strong>৮টি ইলেকট্রন</strong> অর্জন করে নিকটবর্তী নিষ্ক্রিয় গ্যাসের মতো স্থিতিশীলতা লাভ করে।
                </p>
                <div className="p-3 rounded-xl bg-muted/40 font-mono text-xs text-foreground">
                  উদাহরণ: Na (2, 8, 1) একটি e⁻ ত্যাগ করে Na⁺ (2, 8) এবং Cl (2, 8, 7) একটি e⁻ গ্রহণ করে Cl⁻ (2, 8, 8) এর সুস্থিত অষ্টক গঠন করে।
                </div>
              </div>

              {/* Duplet Rule */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <h3 className="text-base font-bold text-foreground">দুইয়ের নিয়ম (Duplet / Two Rule)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  আধুনিক রসায়নবিদদের মতে, পরমাণুর বাইরের শক্তিস্তরে ইলেকট্রনগুলো জোড়ায় জোড়ায় থাকে। অণু গঠনের সময় পরমাণু বহিঃস্থ স্তরে নিকটতম নিষ্ক্রিয় গ্যাস হিলিয়ামের মতো <strong>এক জোড়া বা একাধিক জোড়া ইলেকট্রন</strong> অর্জনের চেষ্টা করে।
                </p>
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-foreground">
                  💡 <strong>অষ্টক নিয়মের সীমাবদ্ধতা:</strong> BF₃ তে বহিঃস্থ স্তরে ৬টি ইলেকট্রন (অষ্টক সংকোচন) আবার PCl₅ তে ১০টি ইলেকট্রন (অষ্টক সম্প্রসারণ) থাকে। কিন্তু দুইয়ের নিয়ম অনুযায়ী BF₃ তে ৩ জোড়া এবং PCl₅ তে ৫ জোড়া ইলেকট্রন থাকে, যা নিখুঁতভাবে খাটে!
                </div>
              </div>
            </div>
          </div>

          {/* Section 5.5: 3 Types of Chemical Bonds */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৫.৫ রাসায়নিক বন্ধনের ৩টি প্রধান রূপ'
                    : '5.5 Three Fundamental Types of Chemical Bonds'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'আয়নিক বন্ধন, সমযোজী বন্ধন ও ধাতব বন্ধনের তুলনামূলক মেকানিজম'
                    : 'Comparative mechanics of Ionic, Covalent, and Metallic bonding'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ionic Bond */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded">
                    ধাতু + অধাতু
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">ইলেকট্রন স্থানান্তর</span>
                </div>
                <h3 className="text-base font-bold text-foreground">১. আয়নিক বন্ধন (Ionic Bond)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ধাতু ইলেকট্রন ত্যাগ করে ধনাত্মক ক্যাটায়ন এবং অধাতু ইলেকট্রন গ্রহণ করে ঋণাত্মক অ্যানায়নে পরিণত হয়। এই বিপরীতধর্মী আধানগুলোর মধ্যকার <strong>স্থিরবৈদ্যুতিক আকর্ষণ বল</strong> (Electrostatic Force)-ই হলো আয়নিক বন্ধন।
                </p>
                <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono text-foreground">
                  Na⁺ + Cl⁻ → NaCl
                  <br />
                  Mg²⁺ + O²⁻ → MgO
                </div>
              </div>

              {/* Covalent Bond */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded">
                    অধাতু + অধাতু
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">ইলেকট্রন শেয়ারিং</span>
                </div>
                <h3 className="text-base font-bold text-foreground">২. সমযোজী বন্ধন (Covalent Bond)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  দুটি অধাতব পরমাণুর কাছাকাছি আসলে উভয়েরই ইলেকট্রন গ্রহণের প্রবণতা থাকে। ফলে কেউই ইলেকট্রন ত্যাগ না করে পরস্পরের এক বা একাধিক ইলেকট্রন সমভাবে শেয়ার করে এক বা একাধিক জোড় তৈরি করে।
                </p>
                <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono text-foreground">
                  H - H (একক), O = O (দ্বিবন্ধন)
                  <br />
                  N ≡ N (ত্রিবন্ধন), CH₄, H₂O
                </div>
              </div>

              {/* Metallic Bond */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                    ধাতু + ধাতু
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">ইলেকট্রন সাগর</span>
                </div>
                <h3 className="text-base font-bold text-foreground">৩. ধাতব বন্ধন (Metallic Bond)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ধাতব পরমাণুগুলো তাদের বহিঃস্থ ইলেকট্রন ত্যাগ করে পারমাণবিক শাঁস (Positive Kernels) গঠন করে। এই ইলেকট্রনগুলো সমগ্র ধাতব খণ্ড জুড়ে একটি <strong>সঞ্চারণশীল ইলেকট্রন সাগর</strong> হিসেবে মুক্তভাবে সাঁতার কাটে।
                </p>
                <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono text-foreground">
                  Fe, Cu, Al, Au খণ্ডে ধাতব বন্ধন
                  <br />
                  তড়িৎ পরিবাহিতা ও নমনীয়তার কারণ
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
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? 'বোর্ড ভিত্তিক গাণিতিক ও ধারণাগত সমস্যা সমাধান'
                    : 'Board-Standard Solved Problems & Explanations'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'বিগত এসএসসি পরীক্ষায় বারবার আসা সৃজনশীল প্রশ্নের পুঙ্খানুপুঙ্খ উত্তর'
                    : 'Frequently asked past board exam questions with authentic marking keys'}
                </p>
              </div>
            </div>

            {/* Problem 1 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600">সমস্যা ০১ (সুপ্ত যোজনী নির্ণয়)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600">
                  ৩ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                সালফার ডাই-অক্সাইড (SO₂) এবং সালফার ট্রাই-অক্সাইড (SO₃) যৌগে সালফারের সুপ্ত যোজনী নির্ণয় করো।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <p>
                  সালফার (S, ১৬) একটি পরিবর্তনশীল যোজনীর মৌল। এর সম্ভাব্য যোজনীগুলো হলো ২, ৪ ও ৬। সুতরাং সালফারের <strong>সর্বোচ্চ যোজনী = ৬</strong>।
                </p>
                <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-2 text-foreground">
                  <p>
                    ১. SO₂ যৌগে:
                    <br />
                    • সালফার ২টি দ্বিযোজী অক্সিজেন পরমাণুর সাথে যুক্ত।
                    <br />
                    • অতএব সক্রিয় যোজনী = ২ × ২ = ৪।
                    <br />
                    • সুপ্ত যোজনী = সর্বোচ্চ যোজনী - সক্রিয় যোজনী = ৬ - ৪ = <strong>২</strong>।
                  </p>
                  <div className="border-t border-border/60 my-1" />
                  <p>
                    ২. SO₃ যৌগে:
                    <br />
                    • সালফার ৩টি দ্বিযোজী অক্সিজেন পরমাণুর সাথে যুক্ত।
                    <br />
                    • অতএব সক্রিয় যোজনী = ৩ × ২ = ৬।
                    <br />
                    • সুপ্ত যোজনী = সর্বোচ্চ যোজনী - সক্রিয় যোজনী = ৬ - ৬ = <strong>০ (শূন্য)</strong>।
                  </p>
                </div>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600">সমস্যা ০২ (মুক্তজোড় বনাম বন্ধনজোড়)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600">
                  ৩ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                অ্যামোনিয়া (NH₃) অণুতে মুক্তজোড় ও বন্ধনজোড় ইলেকট্রন সংখ্যা কত? ডায়াগ্রামের আলোকে দেখাও।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <div className="bg-muted/40 p-3 rounded-xl font-mono text-foreground space-y-1">
                  <p>N (7): 1s² 2s² 2p³ → সর্ববহিঃস্থ স্তরে ৫টি ইলেকট্রন</p>
                  <p>H (1): 1s¹ → সর্ববহিঃস্থ স্তরে ১টি ইলেকট্রন</p>
                </div>
                <p>
                  নাইট্রোজেন পরমাণু তার ৩টি অযুগ্ম ইলেকট্রনকে ৩টি হাইড্রোজেন পরমাণুর ১টি করে ইলেকট্রনের সাথে শেয়ার করে ৩টি সমযোজী একক বন্ধন গঠন করে।
                </p>
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-200">
                  • <strong>বন্ধনজোড় (Bond Pair - BP):</strong> ৩ জোড়া (মোট ৬টি শেয়ারকৃত ইলেকট্রন)।
                  <br />
                  • <strong>মুক্তজোড় (Lone Pair - LP):</strong> নাইট্রোজেনের ২s অরবিটালের ১ জোড়া ইলেকট্রন বন্ধনে অংশ না নিয়ে অবিকৃত থাকে। সুতরাং মুক্তজোড় = ১ জোড়া (২টি ইলেকট্রন)।
                </div>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600">সমস্যা ০৩ (দ্রাব্যতা ও পোলারিটি)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600">
                  ৪ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                খাবার লবণ (NaCl) পানিতে দ্রবীভূত হয়, কিন্তু কেরোসিনে দ্রবীভূত হয় না কেন? ব্যাখ্যা করো।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <p>
                  সোডিয়াম ক্লোরাইড (NaCl) একটি আয়নিক যৌগ যা Na⁺ ও Cl⁻ আয়নের শক্তিশালী স্থিরবৈদ্যুতিক জালক দিয়ে তৈরি।
                </p>
                <p>
                  পানি (H₂O) একটি পোলার সমযোজী দ্রাবক। অক্সিজেনের উচ্চ তড়িৎ ঋণাত্মকতার (৩.৪৪) কারণে এতে আংশিক ঋণাত্মক প্রান্ত (δ⁻) এবং হাইড্রোজেনসমূহে আংশিক ধনাত্মক প্রান্ত (δ⁺) সৃষ্টি হয়।
                </p>
                <p>
                  যখন পানিতে NaCl যোগ করা হয়, পানির ঋণাত্মক অক্সিজেন প্রান্তগুলো Na⁺ ক্যাটায়নকে এবং ধনাত্মক হাইড্রোজেন প্রান্তগুলো Cl⁻ অ্যানায়নকে প্রবল শক্তিতে আকর্ষণ করে চারপাশ থেকে ঘিরে ফেলে (Hydration)। এই হাইড্রেশন শক্তি NaCl এর জালক শক্তিকে ভেঙে ফেলে, ফলে লবণ পানিতে দ্রবীভূত হয়।
                </p>
                <p className="font-bold text-teal-700 dark:text-teal-300">
                  অন্যদিকে কেরোসিন একটি অপোলার হাইড্রোকার্বন। এতে কোনো ধনাত্মক বা ঋণাত্মক প্রান্ত থাকে না, ফলে এটি NaCl এর শক্তিশালী জালক ভাঙতে পারে না এবং লবণ অদ্রবণীয় থেকে যায়।
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
          {/* SIMULATOR 1: Interactive Chemical Bond Builder */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-teal-500" />
                  {isBn
                    ? '১. আয়নিক ও সমযোজী বন্ধন গঠন ভিজ্যুয়ালাইজার'
                    : '1. Interactive Ionic & Covalent Bond Builder'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'ইলেকট্রন স্থানান্তর বা শেয়ারিং এর মাধ্যমে অণু গঠন প্রত্যক্ষ করো।'
                    : 'Watch electrons transfer or share to assemble ionic lattice and covalent molecules.'}
                </p>
              </div>

              {/* Select Bond Demo */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ionic_nacl', label: 'NaCl (আয়নিক)' },
                  { id: 'ionic_mgo', label: 'MgO (আয়নিক)' },
                  { id: 'cov_h2', label: 'H₂ (সমযোজী একক)' },
                  { id: 'cov_o2', label: 'O₂ (সমযোজী দ্বি)' },
                  { id: 'cov_n2', label: 'N₂ (সমযোজী ত্রি)' },
                  { id: 'cov_h2o', label: 'H₂O (পোলার সমযোজী)' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBondDemo(b.id as any);
                      setIsFormed(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      bondDemo === b.id
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bond Animation Stage */}
            <div className="relative h-64 rounded-2xl border border-border/80 bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-6">
              <div className="flex items-center justify-center gap-12 sm:gap-20 transition-all duration-700">
                {/* Left Atom */}
                <div
                  className={`flex flex-col items-center transition-all duration-700 ${
                    isFormed ? 'translate-x-4 sm:translate-x-8' : ''
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center relative transition-all ${
                      bondDemo.startsWith('ionic')
                        ? 'border-rose-400 bg-rose-500/10'
                        : 'border-cyan-400 bg-cyan-500/10'
                    }`}
                  >
                    <span className="text-lg font-black text-white">
                      {bondDemo === 'ionic_nacl'
                        ? isFormed ? 'Na⁺' : 'Na'
                        : bondDemo === 'ionic_mgo'
                        ? isFormed ? 'Mg²⁺' : 'Mg'
                        : bondDemo === 'cov_h2'
                        ? 'H'
                        : bondDemo === 'cov_o2'
                        ? 'O'
                        : bondDemo === 'cov_n2'
                        ? 'N'
                        : 'O'}
                    </span>

                    {/* Orbit electron dots */}
                    <div className="absolute -top-2 h-4 w-4 rounded-full bg-amber-400 shadow-md flex items-center justify-center text-[8px] font-bold text-black">
                      e⁻
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-mono mt-2">
                    {bondDemo === 'ionic_nacl'
                      ? isFormed ? '2, 8 (সুস্থিত ক্যাটায়ন)' : '2, 8, 1'
                      : bondDemo === 'ionic_mgo'
                      ? isFormed ? '2, 8 (ক্যাটায়ন)' : '2, 8, 2'
                      : bondDemo === 'cov_h2'
                      ? '1s¹'
                      : bondDemo === 'cov_o2'
                      ? '2, 6'
                      : bondDemo === 'cov_n2'
                      ? '2, 5'
                      : '2, 6'}
                  </span>
                </div>

                {/* Bond Indicator in Center */}
                {isFormed && (
                  <div className="z-10 animate-pulse text-center">
                    <span className="text-xl font-black text-amber-400">
                      {bondDemo.startsWith('ionic') ? '⚡ স্থিরবৈদ্যুতিক বন্ধন' : '🔗 সমযোজী শেয়ারિંગ'}
                    </span>
                  </div>
                )}

                {/* Right Atom */}
                <div
                  className={`flex flex-col items-center transition-all duration-700 ${
                    isFormed ? '-translate-x-4 sm:-translate-x-8' : ''
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center relative transition-all ${
                      bondDemo.startsWith('ionic')
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-cyan-400 bg-cyan-500/10'
                    }`}
                  >
                    <span className="text-lg font-black text-white">
                      {bondDemo === 'ionic_nacl'
                        ? isFormed ? 'Cl⁻' : 'Cl'
                        : bondDemo === 'ionic_mgo'
                        ? isFormed ? 'O²⁻' : 'O'
                        : bondDemo === 'cov_h2'
                        ? 'H'
                        : bondDemo === 'cov_o2'
                        ? 'O'
                        : bondDemo === 'cov_n2'
                        ? 'N'
                        : 'H'}
                    </span>

                    {/* Orbit electron dots */}
                    <div className="absolute -bottom-2 h-4 w-4 rounded-full bg-cyan-400 shadow-md flex items-center justify-center text-[8px] font-bold text-black">
                      e⁻
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-mono mt-2">
                    {bondDemo === 'ionic_nacl'
                      ? isFormed ? '2, 8, 8 (সুস্থিত অ্যানায়ন)' : '2, 8, 7'
                      : bondDemo === 'ionic_mgo'
                      ? isFormed ? '2, 8 (অ্যানায়ন)' : '2, 6'
                      : bondDemo === 'cov_h2'
                      ? '1s¹'
                      : bondDemo === 'cov_o2'
                      ? '2, 6'
                      : bondDemo === 'cov_n2'
                      ? '2, 5'
                      : '1s¹'}
                  </span>
                </div>
              </div>

              {/* Trigger Button */}
              <div className="absolute bottom-4">
                <button
                  onClick={() => setIsFormed(!isFormed)}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>
                    {isFormed
                      ? isBn ? 'ভেঙে আলাদা করুন (Reset Atoms)' : 'Reset Atoms'
                      : isBn ? 'বন্ধন গঠন করুন (Form Bond)' : 'Form Bond'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* SIMULATOR 2: Lone Pair vs Bond Pair Molecular Scanner */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Eye className="h-5 w-5 text-teal-500" />
                  {isBn
                    ? '২. মুক্তজোড় (LP) ও বন্ধনজোড় (BP) ইলেকট্রন স্ক্যানার'
                    : '2. Lone Pair & Bond Pair 3D Molecular Scanner'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'মিথেন, অ্যামোনিয়া, পানি ও অন্যান্য সমযোজী অণুর মুক্তজোড় ও বন্ধনজোড় গণনা করো।'
                    : 'Inspect bond pairs and unshared lone pair electron lobes in small molecules.'}
                </p>
              </div>

              {/* Molecule Select */}
              <select
                value={selectedMolecule}
                onChange={(e) => setSelectedMolecule(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              >
                {MOLECULES.map((m) => (
                  <option key={m.formula} value={m.formula}>
                    {m.formula} ({m.nameBn})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Molecule Spec Card */}
              <div className="p-5 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-teal-600">{currentMolecule.formula}</span>
                  <span className="text-xs font-bold text-foreground">
                    {isBn ? currentMolecule.nameBn : currentMolecule.nameEn}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">বন্ধনজোড় (Bond Pair - BP):</span>
                    <strong className="text-cyan-600 text-sm">{currentMolecule.bondPairs} জোড়া</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">মুক্তজোড় (Lone Pair - LP):</span>
                    <strong className="text-amber-500 text-sm">{currentMolecule.lonePairs} জোড়া</strong>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-1">
                    <span className="text-muted-foreground">আণবিক জ্যামিতি:</span>
                    <strong className="text-foreground">{currentMolecule.shapeBn}</strong>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isBn ? currentMolecule.notesBn : currentMolecule.notesEn}
                </p>
              </div>

              {/* Visual Pair Counter */}
              <div className="md:col-span-2 p-5 rounded-2xl border border-border/70 bg-muted/15 space-y-4">
                <span className="text-xs font-bold text-muted-foreground block">
                  যোজ্যতা স্তরের ইলেকট্রন জোড় বিন্যাস:
                </span>

                <div className="grid grid-cols-2 gap-4">
                  {/* Bond Pairs Box */}
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                        বন্ধনজোড় (Bond Pairs)
                      </span>
                      <span className="text-base font-black text-cyan-600">{currentMolecule.bondPairs}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Array.from({ length: currentMolecule.bondPairs }).map((_, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-mono text-xs font-bold shadow-xs"
                        >
                          BP {i + 1}: • •
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lone Pairs Box */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                        মুক্তজোড় (Lone Pairs)
                      </span>
                      <span className="text-base font-black text-amber-500">{currentMolecule.lonePairs}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentMolecule.lonePairs === 0 ? (
                        <span className="text-xs text-muted-foreground italic">কোনো মুক্তজোড় নেই</span>
                      ) : (
                        Array.from({ length: currentMolecule.lonePairs }).map((_, i) => (
                          <div
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-mono text-xs font-bold shadow-xs"
                          >
                            LP {i + 1}: :
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR 3: Variable Valency & Latent Valency Calculator */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Scale className="h-5 w-5 text-teal-500" />
                  {isBn
                    ? '৩. পরিবর্তনশীল যোজনী ও সুপ্ত যোজনী ক্যালকুলেটর'
                    : '3. Variable Valency & Latent Valency Calculator'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'যেকোনো যৌগ সিলেক্ট করো এবং সর্বোচ্চ ও সক্রিয় যোজনী থেকে সুপ্ত যোজনী নির্ণয়ের ধাপ দেখো।'
                    : 'Select a compound to calculate: Latent Valency = Maximum Valency - Active Valency.'}
                </p>
              </div>

              {/* Selector */}
              <div className="flex flex-wrap gap-1.5">
                {VARIABLE_COMPOUNDS.map((c) => (
                  <button
                    key={c.formula}
                    onClick={() => setSelectedCompoundFormula(c.formula)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedCompoundFormula === c.formula
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {c.formula}
                  </button>
                ))}
              </div>
            </div>

            {/* Latent Valency Formula Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  সর্বোচ্চ যোজনী
                </span>
                <span className="text-2xl font-black text-foreground">{currentCompound.maxValency}</span>
                <span className="text-[10px] text-muted-foreground block">
                  {isBn ? currentCompound.centralAtomBn : currentCompound.centralAtomEn}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  সক্রিয় যোজনী ({currentCompound.formula} তে)
                </span>
                <span className="text-2xl font-black text-cyan-600">{currentCompound.activeValency}</span>
                <span className="text-[10px] text-muted-foreground block">যুক্ত পরমাণুর সংখ্যা</span>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 block">
                  সুপ্ত যোজনী (Latent)
                </span>
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                  {currentCompound.latentValency}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">
                  ({currentCompound.maxValency} - {currentCompound.activeValency})
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground">
              <strong className="text-teal-600 dark:text-teal-400">ব্যাখ্যা: </strong>
              <span>{isBn ? currentCompound.explanationBn : currentCompound.explanationEn}</span>
            </div>
          </div>

          {/* SIMULATOR 4: Electrical Conductivity & Solubility Chamber */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Cable className="h-5 w-5 text-teal-500" />
                  {isBn
                    ? '৪. বিদ্যুৎ পরিবাহিতা ও দ্রাব্যতা ভার্চুয়াল ল্যাব'
                    : '4. Electrical Conductivity & Solubility Circuit Lab'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'এনসিটিবি পৃষ্ঠা ৯৯: কঠিন লবণ বনাম গলিত/জলীয় লবণের বিদ্যুৎ পরিবাহী সেল।'
                    : 'NCTB p. 99: Test electrical circuit conduction in solid vs dissolved ionic and covalent solutions.'}
                </p>
              </div>

              {/* Substance Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'solid_nacl', label: 'কঠিন NaCl লবণ' },
                  { id: 'aqueous_nacl', label: 'পানিতে দ্রবীভূত NaCl' },
                  { id: 'aqueous_sugar', label: 'পানিতে চিনি দ্রবণ' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTestedSubstance(s.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      testedSubstance === s.id
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Circuit Animation Chamber */}
              <div className="relative h-64 rounded-2xl border border-border/80 bg-slate-900 overflow-hidden flex flex-col items-center justify-between p-6">
                {/* Lightbulb in Circuit */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                      circuitOn && testedSubstance === 'aqueous_nacl'
                        ? 'bg-amber-300 border-amber-400 shadow-xl shadow-amber-400/80'
                        : 'bg-slate-700 border-slate-600'
                    }`}
                  >
                    <Lightbulb
                      className={`h-6 w-6 ${
                        circuitOn && testedSubstance === 'aqueous_nacl'
                          ? 'text-amber-900 fill-amber-300'
                          : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 mt-1">
                    {circuitOn && testedSubstance === 'aqueous_nacl'
                      ? '💡 বাল্ব উজ্জ্বলভাবে জ্বলছে!'
                      : 'বাল্ব নিভে আছে'}
                  </span>
                </div>

                {/* Beaker with Electrodes */}
                <div className="w-56 h-28 rounded-b-2xl border-2 border-slate-500 bg-slate-800/80 relative flex items-center justify-center overflow-hidden">
                  {/* Two Electrodes */}
                  <div className="absolute top-0 left-12 w-3 h-20 bg-slate-400 rounded-b" />
                  <div className="absolute top-0 right-12 w-3 h-20 bg-slate-400 rounded-b" />

                  {/* Solution */}
                  <div
                    className={`w-full h-16 absolute bottom-0 transition-colors ${
                      testedSubstance === 'solid_nacl'
                        ? 'bg-slate-200/20'
                        : testedSubstance === 'aqueous_nacl'
                        ? 'bg-cyan-500/30'
                        : 'bg-amber-500/20'
                    }`}
                  >
                    {testedSubstance === 'aqueous_nacl' && circuitOn && (
                      <div className="flex justify-around items-center h-full text-[9px] font-mono text-cyan-200">
                        <span className="animate-bounce">Na⁺ →</span>
                        <span className="animate-bounce delay-150">← Cl⁻</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-200 z-10 font-bold">
                    {testedSubstance === 'solid_nacl'
                      ? 'কঠিন NaCl ক্রিস্টাল'
                      : testedSubstance === 'aqueous_nacl'
                      ? 'লবণ পানি (Na⁺ + Cl⁻ মুক্ত আয়ন)'
                      : 'চিনির দ্রবণ (অপোলার অণু)'}
                  </span>
                </div>
              </div>

              {/* Lab Controls & Scientific Explanation */}
              <div className="space-y-4">
                <button
                  onClick={() => setCircuitOn(!circuitOn)}
                  className={`w-full py-3 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                    circuitOn
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <BatteryCharging className="h-4 w-4" />
                  <span>
                    {circuitOn ? 'সুইচ বন্ধ করুন (Switch OFF)' : 'সুইচ চালু করুন (Switch ON)'}
                  </span>
                </button>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 text-xs text-muted-foreground space-y-2">
                  <strong className="text-foreground block">বিজ্ঞান পর্যবেক্ষণ:</strong>
                  {testedSubstance === 'solid_nacl' && (
                    <p>
                      কঠিন লবণের ক্যাটায়ন (Na⁺) ও অ্যানায়ন (Cl⁻) শক্তিশালী ক্রিস্টাল জালকে দৃঢ়ভাবে আবদ্ধ থাকে। মুক্ত আয়ন না থাকায় বিদ্যুৎ পরিবাহিত হয় না।
                    </p>
                  )}
                  {testedSubstance === 'aqueous_nacl' && (
                    <p>
                      পানিতে দ্রবীভূত করলে পানির পোলারিটির কারণে আয়নগুলি মুক্ত হয় (হাইড্রেটেড Na⁺ ও Cl⁻)। তড়িৎ দ্বারে আয়নগুলোর স্থানান্তরের কারণে বিদ্যুৎ অত্যন্ত সুপরিবাহী হয়!
                    </p>
                  )}
                  {testedSubstance === 'aqueous_sugar' && (
                    <p>
                      চিনি সমযোজী যৌগ। পানিতে দ্রবীভূত হলেও কোনো মুক্ত আয়ন উৎপন্ন করে না, কেবল চিনি অণু হিসেবে থাকে। তাই বিদ্যুৎ পরিবাহিত হয় না।
                    </p>
                  )}
                </div>
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
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
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
                      ? 'বিগত বোর্ড পরীক্ষার গুরুত্বপূর্ণ প্রশ্ন ও স্বয়ংক্রিয় মূল্যায়ন'
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
                      <span className="text-xs font-mono font-bold text-teal-600">
                        প্রশ্ন ০{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600">
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
                          btnStyle = 'border-teal-500 bg-teal-500/15 text-teal-800 dark:text-teal-200 font-bold';
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
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
              >
                {isBn ? 'উত্তর যাচাই করুন (Submit & Check Answers)' : 'Submit & Check Answers'}
              </button>
            )}

            {showResults && (
              <div className="p-5 rounded-2xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-between">
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
                      ? 'অসাধারণ! রাসায়নিক বন্ধন অধ্যায়ের সমস্ত মৌলিক ধারণা তোমার সম্পূর্ণ আয়ত্তে।'
                      : 'ব্যাখ্যাগুলো ভালো করে দেখে দুর্বল অংশগুলো ঝালিয়ে নাও।'}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-teal-600 dark:text-teal-400" />
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
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
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
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
              </button>

            {/* Stimulus */}
            <div className="p-5 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-2">
              <span className="text-xs font-bold text-teal-600 block">উদ্দীপকটি লক্ষ্য করো:</span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                পরমাণু তিনটি যথাক্রমে{' '}
                <strong>
                  <RenderMathText text="A(Z=11)" />
                </strong>
                ,{' '}
                <strong>
                  <RenderMathText text="B(Z=17)" />
                </strong>
                , এবং{' '}
                <strong>
                  <RenderMathText text="C(Z=6)" />
                </strong>
                ।{' '}
                <RenderMathText text="A" /> ও <RenderMathText text="B" /> যুক্ত হয়ে একটি যৌগ <RenderMathText text="AB" /> এবং <RenderMathText text="C" /> ও <RenderMathText text="B" /> যুক্ত হয়ে একটি যৌগ <RenderMathText text="CB_4" /> গঠন করে।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/15 text-teal-600">
                      (ক) জ্ঞানমূলক [১]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">যোজ্যতা ইলেকট্রন কাকে বলে?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'a' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'a' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> কোনো মৌলের ইলেকট্রন বিন্যাসে সবচেয়ে বাইরের প্রধান শক্তিস্তরে মোট যতটি ইলেকট্রন থাকে, তাকে ঐ মৌলের যোজ্যতা ইলেকট্রন বলে।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/15 text-teal-600">
                      (খ) অনুধাবনমূলক [২]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">ধাতব বন্ধন বলতে কী বোঝায়?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'b' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'b' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1.5">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> ধাতব পরমাণুগুলো যে আকর্ষণ বলের মাধ্যমে পরস্পরের সাথে যুক্ত থাকে, তাকে ধাতব বন্ধন বলে।
                    </p>
                    <p>
                      ধাতুসমূহের পরমাণুর বহিঃস্থ স্তরের ইলেকট্রনগুলো বিচ্ছিন্ন হয়ে সমগ্র ধাতব খণ্ড জুড়ে একটি সঞ্চারণশীল ইলেকট্রন সাগর (Delocalized Electron Sea) তৈরি করে এবং পরমাণুগুলো ধনাত্মক আয়নে পরিণত হয়। এই ধনাত্মক পারমাণবিক শাঁস এবং সঞ্চারণশীল ইলেকট্রন মেঘের মধ্যকার স্থিরবৈদ্যুতিক আকর্ষণ বলই হলো ধাতব বন্ধন।
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/15 text-teal-600">
                      (গ) প্রয়োগমূলক [৩]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের AB যৌগ গঠনের মেকানিজম ডায়াগ্রামসহ ব্যাখ্যা করো।
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
                        ১. উদ্দীপকের A (Z=11) হলো সোডিয়াম (Na) এবং B (Z=17) হলো ক্লোরিন (Cl)। এদের দ্বারা গঠিত যৌগটি হলো NaCl। [১ নম্বর]
                      </p>
                      <p>
                        ২. ইলেকট্রন বিন্যাস:
                        <br />
                        Na (11): 1s² 2s² 2p⁶ 3s¹ (2, 8, 1)
                        <br />
                        Cl (17): 1s² 2s² 2p⁶ 3s² 3p⁵ (2, 8, 7) [১ নম্বর]
                      </p>
                      <p>
                        ৩. বন্ধন গঠন মেকানিজম:
                        <br />
                        সোডিয়াম পরমাণু তার ৩s এর ১টি ইলেকট্রন ত্যাগ করে সুস্থিত নিষ্ক্রিয় গ্যাস নিয়নের কাঠামো অর্জন করে ধনাত্মক সোডিয়াম ক্যাটায়ন (Na⁺) হয়: Na - e⁻ → Na⁺।
                        <br />
                        ক্লোরিন পরমাণু সেই ইলেকট্রনটি গ্রহণ করে সুস্থিত আর্গনের অষ্টক কাঠামো লাভ করে ক্লোরাইড অ্যানায়ন (Cl⁻) হয়: Cl + e⁻ → Cl⁻।
                        <br />
                        বিপরীতধর্মী Na⁺ ও Cl⁻ আয়নগুলি শক্তিশালী স্থিরবৈদ্যুতিক আকর্ষণে যুক্ত হয়ে আয়নিক বন্ধনের মাধ্যমে NaCl ক্রিস্টাল গঠন করে। [১ নম্বর]
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/15 text-teal-600">
                      (ঘ) উচ্চতর দক্ষতা [৪]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের AB এবং CB₄ যৌগ দুটির মধ্যে কোনটি পানিতে দ্রবীভূত হবে এবং বিদ্যুৎ পরিবহন করবে? বিশ্লেষণ করো।
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
                      উদ্দীপকের AB যৌগটি হলো আয়নিক সোডিয়াম ক্লোরাইড (NaCl) এবং CB₄ যৌগটি হলো সমযোজী কার্বন টেট্রাক্লোরাইড (CCl₄, যেখানে C=কার্বন, B=ক্লোরিন)।
                    </p>
                    <p>
                      <strong>১. দ্রাব্যতা বিশ্লেষণ:</strong> পানি একটি পোলার সমযোজী দ্রাবক, যার অণুতে আংশিক ধনাত্মক (δ⁺) ও আংশিক ঋণাত্মক (δ⁻) পোল থাকে। যখন NaCl পানিতে দেওয়া হয়, পানির পোলার অণুগুলো Na⁺ ও Cl⁻ আয়নকে আকর্ষণ করে হাইড্রেট করে পৃথক করে ফেলে। ফলে NaCl পানিতে সম্পূর্ণ দ্রবীভূত হয়।
                      <br />
                      অন্যদিকে CCl₄ একটি অপোলার সমযোজী যৌগ। এর অণুতে কোনো পোল বা ধনাত্মক-ঋণাত্মক আধানের সৃষ্টি হয় না। তাই এটি পানিতে অদ্রবণীয় থাকে।
                    </p>
                    <p>
                      <strong>২. বিদ্যুৎ পরিবাহিতা বিশ্লেষণ:</strong> কঠিন অবস্থায় NaCl বিদ্যুৎ অপরিবাহী হলেও, জলীয় দ্রবণে এটি মুক্ত ও গতিশীল Na⁺ এবং Cl⁻ আয়নে বিশ্লেষিত হয়। দ্রবণে বিভব প্রয়োগ করলে এই আয়নগুলি তড়িৎদ্বারের দিকে ধাবিত হয়ে বিদ্যুৎ পরিবহন করে।
                      <br />
                      অন্যদিকে সমযোজী CCl₄ দ্রবণে কোনো আয়ন সৃষ্টি করে না। মুক্ত আয়ন বা ইলেকট্রনের অনুপস্থিতির কারণে এটি বিদ্যুৎ পরিবহন করতে সম্পূর্ণ অক্ষম।
                    </p>
                    <p className="font-bold text-teal-700 dark:text-teal-300">
                      সুতরাং, বিশ্লেষণ থেকে প্রমাণিত হয় যে AB (NaCl) পানিতে দ্রবীভূত হবে এবং বিদ্যুৎ পরিবহন করবে, কিন্তু CB₄ (CCl₄) এর কোনোটিই করবে না।
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
              {isBn ? 'অধ্যায় ০৫ রিভিশন চেকলিস্ট' : 'Chapter 05 Revision Checklist'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { labelBn: 'যোজ্যতা ইলেকট্রন ও যোজনীর পার্থক্য', ok: true },
                { labelBn: 'সুপ্ত যোজনী = সর্বোচ্চ - সক্রিয় যোজনী সূত্র', ok: true },
                { labelBn: 'অষ্টক নিয়ম বনাম দুইয়ের নিয়ম ও সীমাবদ্ধতা', ok: true },
                { labelBn: 'আয়নিক বন্ধন ও ক্রিস্টাল জালক মেকানিজম', ok: true },
                { labelBn: 'সমযোজী একক, দ্বি ও ত্রিবন্ধন (H₂, O₂, N₂)', ok: true },
                { labelBn: 'মুক্তজোড় (LP) ও বন্ধনজোড় (BP) ইলেকট্রন নির্ণয়', ok: true },
                { labelBn: 'ধাতব বন্ধন ও সঞ্চারণশীল ইলেকট্রন সাগর মডেল', ok: true },
                { labelBn: 'আয়নিক বনাম সমযোজী যৌগের গলনাঙ্ক, দ্রাব্যতা ও বিদ্যুৎ পরিবাহিতা', ok: true },
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
        chapterNumberBn="অধ্যায় 05"
        chapterNumberEn="Chapter 05"
        chapterTitleBn="রাসায়নিক বন্ধন"
        chapterTitleEn="Chemical Bonds"
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
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {isBn ? 'অধ্যায় 5 বিশেষজ্ঞ' : 'Chapter 5 Specialist'}
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
                  ? 'bg-teal-600 text-white ml-6 rounded-tr-xs'
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
              placeholder={isBn ? 'রাসায়নিক বন্ধন নিয়ে প্রশ্ন করো...' : 'Ask about Chemical Bonds...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all disabled:opacity-50 shrink-0"
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
