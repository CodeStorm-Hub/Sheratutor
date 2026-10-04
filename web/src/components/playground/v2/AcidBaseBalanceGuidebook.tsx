'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  PanelLeftClose, PanelLeftOpen, HelpCircle, Lightbulb,
  FlaskConical,
  Droplets,
  Flame,
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
  Layers,
  Activity,
  Thermometer,
  TestTube,
  TestTubes,
  Scale,
  Waves,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';
import { RenderMathText } from '@/components/render-math-text';

type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Preset Solutions for pH Simulator
interface PHSolutionPreset {
  id: string;
  nameBn: string;
  nameEn: string;
  ph: number;
  typeBn: 'তীব্র এসিড' | 'মৃদু এসিড' | 'নিরপেক্ষ' | 'মৃদু ক্ষার' | 'তীব্র ক্ষার';
  typeEn: 'Strong Acid' | 'Weak Acid' | 'Neutral' | 'Weak Alkali' | 'Strong Alkali';
  descBn: string;
  descEn: string;
}

const PH_PRESETS: PHSolutionPreset[] = [
  {
    id: 'hcl',
    nameBn: '১M হাইড্রোক্লোরিক এসিড (HCl)',
    nameEn: '1M Hydrochloric Acid (HCl)',
    ph: 0.0,
    typeBn: 'তীব্র এসিড',
    typeEn: 'Strong Acid',
    descBn: 'পাকস্থলীর গ্যাস্ট্রিক জুস ও অম্লীয় পরিষ্কারক, পানিতে সম্পূর্ণ বিয়োজিত হয়।',
    descEn: 'Found in gastric digestive juice; dissociates completely in water.',
  },
  {
    id: 'lemon',
    nameBn: 'লেবুর রস (সাইট্রিক এসিড)',
    nameEn: 'Lemon Juice (Citric Acid)',
    ph: 2.3,
    typeBn: 'মৃদু এসিড',
    typeEn: 'Weak Acid',
    descBn: 'সাইট্রিক এসিডযুক্ত প্রাকৃতিক ফল রস, টক স্বাদযুক্ত ও মৃদু অম্লীয়।',
    descEn: 'Natural fruit acid containing citric acid; sharply sour.',
  },
  {
    id: 'vinegar',
    nameBn: 'ভিনেগার (৪-১০% অ্যাসিটিক এসিড)',
    nameEn: 'Vinegar (4-10% Acetic Acid)',
    ph: 2.9,
    typeBn: 'মৃদু এসিড',
    typeEn: 'Weak Acid',
    descBn: 'খাদ্য সংরক্ষক ভিনেগার বা সিরকা, আংশিক বিয়োজিত মৃদু জৈব এসিড।',
    descEn: 'Food preservative containing ethanoic acid; partially ionizes.',
  },
  {
    id: 'rain',
    nameBn: 'এসিড বৃষ্টি (Acid Rain)',
    nameEn: 'Acid Rain',
    ph: 4.2,
    typeBn: 'মৃদু এসিড',
    typeEn: 'Weak Acid',
    descBn: 'SO₂ ও NO₂ গ্যাস বৃষ্টির পানিতে দ্রবীভূত হয়ে তৈরি হয়; pH < ৫.৬।',
    descEn: 'Formed when industrial SO₂ and NO₂ dissolve in raindrops; pH < 5.6.',
  },
  {
    id: 'coffee',
    nameBn: 'কালো কফি (Black Coffee)',
    nameEn: 'Black Coffee',
    ph: 5.0,
    typeBn: 'মৃদু এসিড',
    typeEn: 'Weak Acid',
    descBn: 'মৃদু অম্লীয় পানীয়, ক্লোরোজেনিক এসিড সমৃদ্ধ।',
    descEn: 'Mildly acidic beverage containing chlorogenic acids.',
  },
  {
    id: 'pure_water',
    nameBn: 'বিশুদ্ধ পানি (২৫°C প্রমাণ অবস্থা)',
    nameEn: 'Pure Distilled Water (25°C)',
    ph: 7.0,
    typeBn: 'নিরপেক্ষ',
    typeEn: 'Neutral',
    descBn: 'সম্পূর্ণ নিরপেক্ষ দ্রবণ, যেখানে [H⁺] = [OH⁻] = ১০⁻⁷ M।',
    descEn: 'Perfect neutral reference where [H⁺] = [OH⁻] = 10⁻⁷ mol/L.',
  },
  {
    id: 'blood',
    nameBn: 'মানব রক্ত (Human Blood)',
    nameEn: 'Human Blood',
    ph: 7.4,
    typeBn: 'মৃদু ক্ষার',
    typeEn: 'Weak Alkali',
    descBn: 'রক্তের স্বাভাবিক pH পরিসীমা ৭.৩৫ - ৭.৪৫; বাফার সিস্টেম দ্বারা নিয়ন্ত্রিত।',
    descEn: 'Strict physiological buffer range (7.35–7.45); critical for human life.',
  },
  {
    id: 'baking_soda',
    nameBn: 'বেকিং সোডা (NaHCO₃)',
    nameEn: 'Baking Soda (Sodium Bicarbonate)',
    ph: 8.4,
    typeBn: 'মৃদু ক্ষার',
    typeEn: 'Weak Alkali',
    descBn: 'মৃদু ক্ষারীয় লবণ দ্রবণ, অম্লনাশক ও বেকিং তৈরিতে ব্যবহৃত হয়।',
    descEn: 'Mild basic salt solution; used in baking and antacid formulations.',
  },
  {
    id: 'magnesia',
    nameBn: 'মিল্ক অব ম্যাগনেসিয়া (Mg(OH)₂)',
    nameEn: 'Milk of Magnesia (Mg(OH)₂ suspension)',
    ph: 10.5,
    typeBn: 'মৃদু ক্ষার',
    typeEn: 'Weak Alkali',
    descBn: 'অ্যান্টাসিড হিসেবে ব্যবহৃত হয় পাকস্থলীর অতিরিক্ত অম্লতা প্রশমনে।',
    descEn: 'Medical antacid that neutralizes excessive stomach acidity.',
  },
  {
    id: 'naoh',
    nameBn: '১M সোডিয়াম হাইড্রোক্সাইড (NaOH)',
    nameEn: '1M Sodium Hydroxide (Caustic Soda)',
    ph: 14.0,
    typeBn: 'তীব্র ক্ষার',
    typeEn: 'Strong Alkali',
    descBn: 'সাবান শিল্পের মূল কাঁচামাল ও ক্ষয়কারী তীব্র ক্ষার; সম্পূর্ণ বিয়োজিত।',
    descEn: 'Caustic lye used in soapmaking; 100% dissociated strong alkali.',
  },
];

// Helper to determine indicator color based on pH
function getUniversalIndicatorColor(ph: number): { hex: string; nameBn: string; nameEn: string } {
  if (ph < 1.0) return { hex: '#dc2626', nameBn: 'গাঢ় লাল (Deep Red)', nameEn: 'Deep Red' };
  if (ph < 3.0) return { hex: '#ef4444', nameBn: 'লাল (Red)', nameEn: 'Red' };
  if (ph < 5.0) return { hex: '#f97316', nameBn: 'কমলা (Orange)', nameEn: 'Orange' };
  if (ph < 6.5) return { hex: '#eab308', nameBn: 'হলুদ (Yellow)', nameEn: 'Yellow' };
  if (ph <= 7.5) return { hex: '#22c55e', nameBn: 'সবুজ - নিরপেক্ষ (Green - Neutral)', nameEn: 'Green - Neutral' };
  if (ph < 9.0) return { hex: '#06b6d4', nameBn: 'হালকা নীল (Cyan/Light Blue)', nameEn: 'Light Blue' };
  if (ph < 11.5) return { hex: '#3b82f6', nameBn: 'গাঢ় নীল (Deep Blue)', nameEn: 'Deep Blue' };
  if (ph < 13.0) return { hex: '#6366f1', nameBn: 'নীলচে বেগুনি (Indigo)', nameEn: 'Indigo' };
  return { hex: '#7c3aed', nameBn: 'গাঢ় বেগুনি (Deep Violet)', nameEn: 'Deep Violet' };
}

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
    questionBn: 'নিচের কোন জলীয় দ্রবণের pH মান ৭ অপেক্ষা কম হবে?',
    questionEn: 'Which of the following aqueous solutions has a pH less than 7?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২৩, চট্টগ্রাম বোর্ড ২০২১',
    boardInfoEn: 'Dhaka Board 2023, Chattogram Board 2021',
    options: [
      { key: 'A', textBn: 'চুনের পানি Ca(OH)₂', textEn: 'Limewater Ca(OH)₂' },
      { key: 'B', textBn: 'খাবার সোডা দ্রবণ NaHCO₃', textEn: 'Baking soda NaHCO₃' },
      { key: 'C', textBn: 'লেবুর রস (Citric acid)', textEn: 'Lemon juice (Citric acid)' },
      { key: 'D', textBn: 'রক্তের প্লাজমা', textEn: 'Blood plasma' },
    ],
    correctKey: 'C',
    explanationBn:
      'লেবুর রসে সাইট্রিক এসিড থাকে, যা জলীয় দ্রবণে H⁺ আয়ন দান করায় এর pH সাধারণত ২.২ থেকে ২.৪ হয় (অর্থাৎ ৭ এর কম)। অন্যদিকে চুনের পানি, খাবার সোডা ও রক্তের pH যথাক্রমে ১২+, ৮.৪ ও ৭.৪ হওয়ায় তারা ক্ষারীয় প্রকৃতির।',
    explanationEn:
      'Lemon juice contains citric acid which releases H⁺ ions, yielding a pH around 2.2–2.4 (< 7). Limewater, baking soda, and blood have pH > 7.',
  },
  {
    id: 2,
    questionBn: 'একটি দ্রবণের হাইড্রোজেন আয়নের ঘনমাত্রা [H⁺] = ১০⁻³ mol/L হলে দ্রবণটির pOH কত?',
    questionEn: 'If the hydrogen ion concentration of a solution is [H⁺] = 10⁻³ mol/L, what is its pOH?',
    boardInfoBn: 'রাজশাহী বোর্ড ২০২২, যশোর বোর্ড ২০২০',
    boardInfoEn: 'Rajshahi Board 2022, Jashore Board 2020',
    options: [
      { key: 'A', textBn: '৩', textEn: '3' },
      { key: 'B', textBn: '৭', textEn: '7' },
      { key: 'C', textBn: '১১', textEn: '11' },
      { key: 'D', textBn: '১৪', textEn: '14' },
    ],
    correctKey: 'C',
    explanationBn:
      'আমরা জানি, pH = -log[H⁺] = -log(১০⁻³) = ৩। আবার, কক্ষ তাপমাত্রায় pH + pOH = ১৪। অতএব, pOH = ১৪ - ৩ = ১১।',
    explanationEn:
      'pH = -log[H⁺] = -log(10⁻³) = 3. Since pH + pOH = 14, pOH = 14 - 3 = 11.',
  },
  {
    id: 3,
    questionBn: 'কোন গ্যাসটি স্বচ্ছ চুনের পানিকে ঘোলা করে এবং অতিরিক্ত চালনা করলে পুনরায় বর্ণহীন হয়ে যায়?',
    questionEn: 'Which gas turns clear limewater milky, and makes it clear again when passed in excess?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২৩, কুমিল্লা বোর্ড ২০২২ (পাঠ্যবই পৃষ্ঠা ২৩২)',
    boardInfoEn: 'Dinajpur Board 2023, Cumilla Board 2022 (Textbook p. 232)',
    options: [
      { key: 'A', textBn: 'SO₂ গ্যাস', textEn: 'SO₂ gas' },
      { key: 'B', textBn: 'CO₂ গ্যাস', textEn: 'CO₂ gas' },
      { key: 'C', textBn: 'NO₂ গ্যাস', textEn: 'NO₂ gas' },
      { key: 'D', textBn: 'H₂ গ্যাস', textEn: 'H₂ gas' },
    ],
    correctKey: 'B',
    explanationBn:
      'CO₂ গ্যাস স্বচ্ছ চুনের পানিতে চালনা করলে অদ্রবণীয় ক্যালসিয়াম কার্বনেট (CaCO₃) উৎপন্ন হয়ে দ্রবণ ঘোলাটে হয়: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O। অতিরিক্ত CO₂ চালনা করলে দ্রবণীয় ক্যালসিয়াম বাইকার্বনেট গঠিত হওয়ায় দ্রবণ আবার বর্ণহীন হয়ে যায়: CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂ (aq)।',
    explanationEn:
      'CO₂ reacts with Ca(OH)₂ to form insoluble white CaCO₃ precipitate. Excess CO₂ forms soluble calcium hydrogen carbonate Ca(HCO₃)₂.',
  },
  {
    id: 4,
    questionBn: 'পানির অস্থায়ী খরতা দূর করার সবচেয়ে সহজ ভৌত পদ্ধতি কোনটি?',
    questionEn: 'What is the simplest physical method to remove temporary water hardness?',
    boardInfoBn: 'বরিশাল বোর্ড ২০২২, ঢাকা বোর্ড ২০২১',
    boardInfoEn: 'Barishal Board 2022, Dhaka Board 2021',
    options: [
      { key: 'A', textBn: 'ক্লোরিনেশন', textEn: 'Chlorination' },
      { key: 'B', textBn: 'উত্তপ্তকরণ বা ফোটানো (Boiling)', textEn: 'Boiling / Heating' },
      { key: 'C', textBn: 'ফিটকিরি যোগ করা', textEn: 'Adding alum' },
      { key: 'D', textBn: 'অতিবেগুনি রশ্মি প্রয়োগ', textEn: 'UV irradiation' },
    ],
    correctKey: 'B',
    explanationBn:
      'পানির অস্থায়ী খরতা সৃষ্টি হয় ক্যালসিয়াম ও ম্যাগনেসিয়ামের বাইকার্বনেট [Ca(HCO₃)₂, Mg(HCO₃)₂] লবণের কারণে। পানিকে ফোটালে এই বাইকার্বনেটগুলো ভেঙে অদ্রবণীয় কার্বনেট অধঃক্ষেপ (CaCO₃↓) হিসেবে জমা পড়ে এবং পানি মৃদু হয়ে যায়।',
    explanationEn:
      'Temporary hardness is caused by dissolved bicarbonates of Ca and Mg. Heating decomposes them into insoluble precipitates: Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂↑.',
  },
  {
    id: 5,
    questionBn: 'নিচের কোনটি ক্ষারক (Base) কিন্তু ক্ষার (Alkali) নয়?',
    questionEn: 'Which of the following is a base but NOT an alkali?',
    boardInfoBn: 'ময়মনসিংহ বোর্ড ২০২৩, রাজশাহী বোর্ড ২০২১',
    boardInfoEn: 'Mymensingh Board 2023, Rajshahi Board 2021',
    options: [
      { key: 'A', textBn: 'NaOH', textEn: 'NaOH' },
      { key: 'B', textBn: 'KOH', textEn: 'KOH' },
      { key: 'C', textBn: 'Fe(OH)₃', textEn: 'Fe(OH)₃' },
      { key: 'D', textBn: 'Ca(OH)₂', textEn: 'Ca(OH)₂' },
    ],
    correctKey: 'C',
    explanationBn:
      'ক্ষারক হতে হলে ধাতব অক্সাইড বা হাইড্রোক্সাইড হতে হয় যা এসিডের সাথে বিক্রিয়া করে লবণ ও পানি তৈরি করে। কিন্তু ক্ষার হতে হলে তাকে অবশ্যই পানিতে দ্রবণীয় হতে হবে। Fe(OH)₃ পানিতে অদ্রবণীয় হওয়ায় এটি ক্ষারক হলেও ক্ষার নয়। "সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয়।"',
    explanationEn:
      'Alkalis must be water-soluble metal hydroxides that release OH⁻. Iron(III) hydroxide Fe(OH)₃ is insoluble in water; hence it is a base, but not an alkali.',
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

export const CHAPTER_9_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "এসিড ও ক্ষারকের রাসায়নিক ধর্ম ও আচরণ",
    titleEn: "Chemical Properties of Acids & Alkalis",
    overviewBn: "জলীয় দ্রবণে H⁺ আয়ন দান (এসিড), OH⁻ আয়ন দান (ক্ষারক), নীল/লাল লিটমাস এবং ক্ষয়কারী বৈশিষ্ট্য।",
    overviewEn: "Aqueous H+ ionization (acids), OH- donation (bases), litmus tests, and corrosive safety protocols.",
    studyTipBn: "এসিড নীল লিটমাসকে লাল করে, ক্ষার লাল লিটমাসকে নীল করে!",
    studyTipEn: "Acids turn blue litmus red; alkalis turn red litmus blue!",
    badgeText: "এসিড ও ক্ষারকের ধর্ম",
  },
  2: {
    no: "০২",
    titleBn: "সার্বজনীন নির্দেশক ও পিএইচ (pH) স্কেল ল্যাব",
    titleEn: "Universal Indicators & Master pH Scale Lab",
    overviewBn: "pH = -log[H⁺], ০ থেকে ১৪ স্কেল, অ্যাসিডিক (pH < ৭), নিরপেক্ষ (pH = ৭) এবং ক্ষারীয় (pH > ৭) দ্রবণ।",
    overviewEn: "Master pH range 0–14, colorimetric indicators, universal indicator paper, and solution classification.",
    studyTipBn: "বিশুদ্ধ পানির pH মান ৭; মানুষের রক্তের স্বাভাবিক pH হলো ৭.৪ (সামান্য ক্ষারীয়)!",
    studyTipEn: "Pure water has pH 7.0; normal human arterial blood is tightly maintained at pH 7.4!",
    badgeText: "পিএইচ (pH) ০–১৪ স্কেল",
  },
  3: {
    no: "০৩",
    titleBn: "ক্ষারক বনাম ক্ষার ও গ্যাস নির্গমন পরীক্ষা",
    titleEn: "Bases vs Alkalis & Gas Evolution Lab",
    overviewBn: "সব ক্ষারই ক্ষারক কিন্তু সব ক্ষারক ক্ষার নয়; এসিডের সাথে ধাতু (H₂ গ্যাস) ও কার্বনেট (CO₂ গ্যাস) বিক্রিয়া।",
    overviewEn: "All alkalis are bases, but not all bases are alkalis; metal and carbonate gas evolution tests.",
    studyTipBn: "Fe(OH)₃ একটি ক্ষারক কিন্তু পানিতে অদ্রবণীয় বলে ক্ষার নয়; NaOH ক্ষারক ও ক্ষার উভয়ই!",
    studyTipEn: "Fe(OH)₃ is a base but insoluble in water, hence not an alkali; NaOH is both a base and an alkali!",
    badgeText: "ক্ষারক বনাম ক্ষার",
  },
  4: {
    no: "০৪",
    titleBn: "মানবদেহ ও কৃষিতে pH এবং এসিড বৃষ্টি",
    titleEn: "Biological & Agricultural pH & Acid Rain",
    overviewBn: "পাকস্থলীতে হজমে pH (১-২), ত্বকের pH (৫.৫), মাটির অম্লত্ব নিয়ন্ত্রণ এবং SO₂ ও NO₂ গ্যাস থেকে এসিড বৃষ্টি।",
    overviewEn: "Gastric acid digestion pH, skin acid mantle, soil agricultural balancing, and atmospheric acid rain.",
    studyTipBn: "মাটির pH অতিরিক্ত কমে এসিডিক হলে চুন (CaO বা CaCO₃) যোগ করে প্রশমিত করা হয়!",
    studyTipEn: "Overly acidic farm soil is neutralized by adding agricultural quicklime or limestone (CaCO₃)!",
    badgeText: "বাস্তব জীবনে pH ও এসিড বৃষ্টি",
  },
  5: {
    no: "০৫",
    titleBn: "মৃদু পানি বনাম খর পানি ও বিশুদ্ধকরণ ল্যাব",
    titleEn: "Soft Water vs Hard Water & Softening Lab",
    overviewBn: "অস্থায়ী খরতা (বাইকার্বনেট লবণ - ফুটিয়ে দূরীকরণ) বনাম স্থায়ী খরতা (ক্লোরাইড ও সালফেট - কাপড় কাঁচা সোডা)।",
    overviewEn: "Temporary hardness boiling precipitation vs permanent hardness removal via washing soda Na2CO3.",
    studyTipBn: "অস্থায়ী খর পানি ফুটালে অদ্রবণীয় CaCO₃ অধঃক্ষিপ্ত হয় এবং পানি মৃদু হয়ে যায়!",
    studyTipEn: "Boiling temporary hard water decomposes soluble Ca(HCO3)2 into insoluble CaCO3 precipitate!",
    badgeText: "খর পানি ও মৃদু পানি ল্যাব",
  },
};

export function AcidBaseBalanceGuidebook() {
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
        ? 'স্বাগতম এসিড-ক্ষার সমতা ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Acid-Base Balance Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_9_LESSONS[activeLesson] || CHAPTER_9_LESSONS[1];
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
          chapter: '9 - এসিড-ক্ষার সমতা (Acid-Base Balance)',
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
          { role: 'ai', text: isBn ? 'এসিড নীল লিটমাসকে লাল করে এবং ক্ষারক লাল লিটমাসকে নীল করে। pH হলো হাইড্রোজেন আয়নের ঘনমাত্রার ঋণাত্মক লগারিদম।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ৯: এসিড-ক্ষার সমতা (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. পিএইচ (pH) স্কেল:\n   - pH < ৭: অম্লীয় (এসিড)\n   - pH = ৭: নিরপেক্ষ (বিশুদ্ধ পানি)\n   - pH > ৭: ক্ষারীয়\n   - মানুষের রক্ত: pH ৭.৪; ত্বক: pH ৫.৫; পাকস্থলী: pH ১-২।\n২. ক্ষারক ও ক্ষার:\n   - পানিতে দ্রবণীয় ক্ষারকই ক্ষার (NaOH, KOH)।\n   - অদ্রবণীয় ক্ষারক ক্ষার নয় (Fe(OH)₃, Cu(OH)₂)।\n৩. পানির খরতা:\n   - অস্থায়ী খরতা: Ca(HCO₃)₂ ও Mg(HCO₃)₂ (ফুটানোর মাধ্যমে দূরযোগ্য)।\n   - স্থায়ী খরতা: CaCl₂, MgSO₄ (Na₂CO₃ কাপড় কাঁচা সোডা যোগে দূরযোগ্য)।`
      : `SSC Chemistry Chapter 9: Acid-Base Balance Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1: Master pH Slider & Presets
  const [currentPh, setCurrentPh] = useState<number>(7.0);
  const [activePresetId, setActivePresetId] = useState<string>('pure_water');

  // Simulator 2: Gas Reaction Chamber
  const [chamberMode, setChamberMode] = useState<'metal' | 'carbonate' | 'neutralization'>('metal');
  const [metalReacting, setMetalReacting] = useState<boolean>(false);
  const [splintTested, setSplintTested] = useState<boolean>(false);
  const [carbonateReacting, setCarbonateReacting] = useState<boolean>(false);
  const [limewaterState, setLimewaterState] = useState<'clear' | 'milky' | 'excess_clear'>('clear');
  const [titrationProgress, setTitrationProgress] = useState<number>(0);

  // Simulator 3: Water Hardness Lab
  const [selectedWaterType, setSelectedWaterType] = useState<'soft' | 'temp_hard' | 'perm_hard'>('soft');
  const [soapAdded, setSoapAdded] = useState<boolean>(false);
  const [isBoiled, setIsBoiled] = useState<boolean>(false);
  const [sodaAdded, setSodaAdded] = useState<boolean>(false);

  // Simulator 4: Alkali vs Base Explorer
  const [selectedCompound, setSelectedCompound] = useState<string>('naoh');

  // Board MCQ State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: number]: string }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [id: number]: boolean }>({});

  // Board CQ Accordion State
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

  // Math calculated values for pH
  const hConcentration = Math.pow(10, -currentPh);
  const poh = Math.max(0, 14 - currentPh);
  const ohConcentration = Math.pow(10, -poh);
  const indicatorColor = getUniversalIndicatorColor(currentPh);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-emerald-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={9}
        chapterTitleBn="এসিড-ক্ষার সমতা"
        chapterTitleEn="Acid-Base Balance"
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
                    CHAPTER 09
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'এসিড-ক্ষার সমতা' : 'Acid-Base Balance'}
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
                  const meta = CHAPTER_9_LESSONS[lNum];
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
                  ? 'এনসিটিবি রসায়ন অধ্যায় 9 (পৃষ্ঠা ২০৮ - ২৩৩) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 9 (Printed pp. ২০৮ - ২৩৩) aligned with NCTB syllabus.'}
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
                  <Droplets className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 09 • পাঠ ${currentLessonMeta.no}` : `Chapter 09 • Lesson ${activeLesson}`}
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

          {currentStep === 'concept' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Badge & Title */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                {isBn ? 'অধ্যায় ০৯: তাত্ত্বিক ভিত্তি' : 'Chapter 09: Theoretical Foundation'}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {isBn ? 'এসিড-ক্ষার সমতা ও পানির রসায়ন' : 'Acid-Base Balance & Water Chemistry'}
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'এনসিটিবি পাঠ্যক্রমের আলোকে এসিড ও ক্ষারকের রাসায়নিক ধর্ম, pH স্কেল, এসিড বৃষ্টি, প্রশমন বিক্রিয়া এবং পানির খরতা দূরীকরণ।'
                  : 'Chemical properties of acids and bases, pH scale mathematics, acid rain formation, neutralization reactions, and water hardness removal based on NCTB syllabus.'}
              </p>
            </div>

            {/* Concept Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Concept 1: এসিডের ধারণা ও বিক্রিয়া */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '১. এসিড ও এর রাসায়নিক বৈশিষ্ট্য' : '1. Acids & Chemical Properties'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'পানিতে H⁺ আয়ন দান ও ক্ষয়কারী ধর্ম' : 'H⁺ release in water & corrosive nature'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'এসিড হলো এমন যৌগ যা জলীয় দ্রবণে হাইড্রোজেন আয়ন (H⁺) বা প্রোটন দান করে। এসিড স্বাদে টক, নীল লিটমাসকে লাল করে এবং জলীয় দ্রবণে বিদ্যুৎ পরিবহন করে।'
                    : 'Acids are chemical compounds that release hydrogen ions (H⁺) or protons in aqueous solutions. They taste sour, turn blue litmus red, and conduct electricity in solution.'}
                </p>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="text-cyan-600 dark:text-cyan-400 font-semibold">
                    {isBn ? 'মূল বিক্রিয়াসমূহ:' : 'Key Reactions:'}
                  </div>
                  <div>• HCl(aq) → H⁺(aq) + Cl⁻(aq)</div>
                  <div>• H₂SO₄(aq) → 2H⁺(aq) + SO₄²⁻(aq)</div>
                  <div>• Mg + 2HCl → MgCl₂ + H₂↑ (সক্রিয় ধাতু + এসিড)</div>
                  <div>• CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O (কার্বনেট + এসিড)</div>
                </div>
              </div>

              {/* Concept 2: ক্ষারক ও ক্ষার */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '২. ক্ষারক বনাম ক্ষার (Bases vs Alkalis)' : '2. Bases vs Alkalis'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? '"সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয়"' : '"All alkalis are bases, but not all bases are alkalis"'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'ধাতু বা ধাতুর মতো ক্রিয়াশীল যৌগমূলকের অক্সাইড ও হাইড্রোক্সাইড যা এসিডের সাথে বিক্রিয়া করে লবণ ও পানি তৈরি করে, তাদের ক্ষারক বলে। ক্ষারকের মধ্যে যারা পানিতে সম্পূর্ণ দ্রবণীয় এবং OH⁻ আয়ন দেয়, তারাই কেবল ক্ষার (Alkali)।'
                    : 'Metal oxides and hydroxides that react with acids to produce salt and water are bases. Alkalis are bases that dissolve in water to release hydroxide ions (OH⁻).'}
                </p>
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs space-y-1">
                  <div className="font-semibold text-blue-700 dark:text-blue-300">
                    {isBn ? 'বোর্ড ক্লাসিক প্রমাণ:' : 'Board Classic Deduction:'}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    • <strong>NaOH, KOH:</strong> পানিতে দ্রবণীয় → ক্ষারক এবং ক্ষার উভয়ই।
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    • <strong>Fe(OH)₃, CuO:</strong> পানিতে অদ্রবণীয় → ক্ষারক, কিন্তু ক্ষার নয়।
                  </div>
                </div>
              </div>

              {/* Concept 3: pH স্কেল ও গাণিতিক সূত্র */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৩. pH স্কেল ও জলীয় দ্রবণের প্রকৃতি' : '3. pH Scale & Mathematical Definition'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'ডেনিশ বিজ্ঞানী সোরেণসেন (১৯০৯)' : 'Danish Chemist S.P.L. Sørensen (1909)'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'কোনো দ্রবণের হাইড্রোজেন আয়নের মোলার ঘনমাত্রার ঋণাত্মক লগারিদমকে দ্রবণটির pH বলে। ২৫°C তাপমাত্রায় বিশুদ্ধ পানির ক্ষেত্রে pH = ৭ (নিরপেক্ষ)।'
                    : 'The negative logarithm of the hydrogen ion molar concentration is defined as pH. At 25°C in pure water, pH = 7 (Neutral).'}
                </p>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span>pH সূত্র:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      <RenderMathText text="\text{pH} = -\log_{10}[\text{H}^+]" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>pOH সূত্র:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      <RenderMathText text="\text{pOH} = -\log_{10}[\text{OH}^-]" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-300 dark:border-slate-700 pt-1">
                    <span>পানি সমীকরণ (২৫°C):</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      <RenderMathText text="\text{pH} + \text{pOH} = 14" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Concept 4: এসিড বৃষ্টি ও পানির খরতা */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Waves className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৪. এসিড বৃষ্টি ও পানির খরতা' : '4. Acid Rain & Water Hardness'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'পরিবেশগত রসায়ন ও পানি বিশুদ্ধতা' : 'Environmental Chemistry & Water Purity'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'বায়ুমণ্ডলের SO₂ ও NO₂ গ্যাস বৃষ্টির পানিতে দ্রবীভূত হয়ে এসিড বৃষ্টি সৃষ্টি করে (pH < ৫.৬)। পানিতে Ca²⁺, Mg²⁺ ও Fe²⁺ এর দ্রবীভূত লবণের কারণে সাবানের ফেনা না হয়ে তলানি পড়ে—এটাই পানির খরতা।'
                    : 'Industrial SO₂ and NO₂ dissolve in raindrops causing acid rain (pH < 5.6). Dissolved Ca²⁺, Mg²⁺, and Fe²⁺ salts precipitate soap as curdy scum, causing water hardness.'}
                </p>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs space-y-1">
                  <div className="font-semibold text-amber-800 dark:text-amber-300">
                    {isBn ? 'খরতার প্রকারভেদ ও প্রতিকার:' : 'Types & Remedies:'}
                  </div>
                  <div>
                    • <strong>অস্থায়ী খরতা:</strong> Ca(HCO₃)₂ দ্রবীভূত → পানি ফুটালে CaCO₃↓ অধঃক্ষেপ পড়ে দূর হয়।
                  </div>
                  <div>
                    • <strong>স্থায়ী খরতা:</strong> CaCl₂, CaSO₄, MgCl₂ দ্রবীভূত → কাপড় কাঁচা সোডা (Na₂CO₃) যোগে দূর হয়।
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Overview Table: Common Solutions pH */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                {isBn ? 'বোর্ড পরীক্ষায় আসা গুরুত্বপূর্ণ পদার্থের pH মান' : 'Essential NCTB Reference Values of pH'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 rounded-l-lg">{isBn ? 'পদার্থের নাম' : 'Substance'}</th>
                      <th className="px-4 py-2.5">{isBn ? 'প্রকৃতি' : 'Nature'}</th>
                      <th className="px-4 py-2.5">{isBn ? 'সাধারণ pH সীমা' : 'pH Range'}</th>
                      <th className="px-4 py-2.5 rounded-r-lg">{isBn ? 'গুরুত্ব / উৎস' : 'Significance'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="px-4 py-2 font-medium">পাকস্থলীর রস (Gastric Juice)</td>
                      <td className="px-4 py-2 text-rose-600 font-semibold">তীব্র অম্লীয়</td>
                      <td className="px-4 py-2 font-mono">1.0 - 2.0</td>
                      <td className="px-4 py-2 text-slate-500">খাদ্য পরিপাক ও জীবাণু ধ্বংস (HCl)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">লেবুর রস (Lemon Juice)</td>
                      <td className="px-4 py-2 text-rose-500 font-semibold">অম্লীয়</td>
                      <td className="px-4 py-2 font-mono">2.2 - 2.4</td>
                      <td className="px-4 py-2 text-slate-500">সাইট্রিক এসিড সমৃদ্ধ প্রাকৃতিক ফল</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">ভিনেগার (Vinegar)</td>
                      <td className="px-4 py-2 text-amber-600 font-semibold">অম্লীয়</td>
                      <td className="px-4 py-2 font-mono">2.4 - 3.4</td>
                      <td className="px-4 py-2 text-slate-500">আচার ও খাদ্য সংরক্ষক (CH₃COOH)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">বিশুদ্ধ পানি (Pure Water)</td>
                      <td className="px-4 py-2 text-emerald-600 font-semibold">নিরপেক্ষ</td>
                      <td className="px-4 py-2 font-mono">7.0</td>
                      <td className="px-4 py-2 text-slate-500">২৫°C তাপমাত্রায় [H⁺] = [OH⁻] = ১০⁻⁷ M</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">মানুষের রক্ত (Human Blood)</td>
                      <td className="px-4 py-2 text-blue-600 font-semibold">মৃদু ক্ষারীয়</td>
                      <td className="px-4 py-2 font-mono">7.35 - 7.45</td>
                      <td className="px-4 py-2 text-slate-500">জীবন রক্ষাকারী সংকীর্ণ বাফার পরিসীমা</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">মিল্ক অব ম্যাগনেসিয়া (Antacid)</td>
                      <td className="px-4 py-2 text-purple-600 font-semibold">ক্ষারীয়</td>
                      <td className="px-4 py-2 font-mono">10.5</td>
                      <td className="px-4 py-2 text-slate-500">পাকস্থলীর অম্লতা প্রশমনে Mg(OH)₂ সাসপেনশন</td>
                    </tr>
                  </tbody>
                </table>
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
                {isBn ? 'বোর্ড স্ট্যান্ডার্ড উদাহরণ ও গাণিতিক সমাধান' : 'Standard Board Worked Examples'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'ধাপ-ভিত্তিক গাণিতিক ও সমীকরণ সমাধান' : 'Step-by-Step Mathematical & Equation Solutions'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'ঢাকা, রাজশাহী, চট্টগ্রাম ও দিনাজপুর বোর্ডে বিগত বছরগুলোতে আসা সবচেয়ে গুরুত্বপূর্ণ ৫টি সমাধান।'
                  : '5 authentic solved examples covering pH calculation, pOH, limewater reaction, and water hardness decomposition.'}
              </p>
            </div>

            <div className="space-y-6">
              {/* Example 1: H2SO4 দ্রবণের pH ও pOH */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০১
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn
                        ? '০.০০৫ M সালফিউরিক এসিড (H₂SO₄) দ্রবণের pH ও pOH গণনা'
                        : 'Calculation of pH & pOH for 0.005 M H₂SO₄ Solution'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'ঢাকা বোর্ড ২০২২, রাজশাহী ২০২১' : 'Dhaka Board 2022'}
                  </span>
                </div>

                <div className="text-sm space-y-3">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>{isBn ? 'প্রশ্ন:' : 'Question:'}</strong> ০.০০৫ M{' '}
                    <RenderMathText text="\text{H}_2\text{SO}_4" /> দ্রবণের pH এবং pOH নির্ণয় করো।
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm font-sans">
                    <div className="font-semibold text-cyan-600 dark:text-cyan-400">
                      {isBn ? 'ধাপ ১: জলীয় দ্রবণে বিয়োজন সমীকরণ ও [H⁺] নির্ণয়' : 'Step 1: Dissociation & [H⁺] determination'}
                    </div>
                    <p>
                      সালফিউরিক এসিড একটি তীব্র দ্বিক্ষারকীয় এসিড। জলীয় দ্রবণে এটি নিম্নরূপে সম্পূর্ণ বিয়োজিত হয়:
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{H}_2\text{SO}_4(\text{aq}) \rightarrow 2\text{H}^+(\text{aq}) + \text{SO}_4^{2-}(\text{aq})" />
                    </div>
                    <p>
                      এখানে ১ মোল <RenderMathText text="\text{H}_2\text{SO}_4" /> থেকে ২ মোল{' '}
                      <RenderMathText text="\text{H}^+" /> উৎপন্ন হয়।
                    </p>
                    <p className="font-mono">
                      অতএব, <RenderMathText text="[\text{H}^+] = 2 \times 0.005 \text{ M} = 0.01 \text{ M} = 10^{-2} \text{ M}" />
                    </p>

                    <div className="font-semibold text-cyan-600 dark:text-cyan-400 pt-2">
                      {isBn ? 'ধাপ ২: pH নির্ণয়' : 'Step 2: Calculate pH'}
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{pH} = -\log_{10}[\text{H}^+] = -\log_{10}(10^{-2}) = 2.0" />
                    </div>

                    <div className="font-semibold text-cyan-600 dark:text-cyan-400 pt-2">
                      {isBn ? 'ধাপ ৩: pOH নির্ণয়' : 'Step 3: Calculate pOH'}
                    </div>
                    <p>আমরা জানি, ২৫°C তাপমাত্রায়: <RenderMathText text="\text{pH} + \text{pOH} = 14" /></p>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{pOH} = 14 - \text{pH} = 14 - 2.0 = 12.0" />
                    </div>

                    <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isBn ? 'উত্তর: দ্রবণটির pH = ২.০ এবং pOH = ১২.০ (প্রকৃতি: তীব্র এসিডীয়)।' : 'Answer: pH = 2.0, pOH = 12.0 (Strongly acidic).'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Example 2: pH থেকে [H+] ও [OH-] নির্ণয় */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০২
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'pH = ৩.৫ হলে দ্রবণের হাইড্রোজেন আয়নের ঘনমাত্রা নির্ণয়' : 'Determine [H⁺] when pH = 3.5'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'দিনাজপুর বোর্ড ২০২২, চট্টগ্রাম ২০২০' : 'Dinajpur Board 2022'}
                  </span>
                </div>

                <div className="text-sm space-y-3">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>{isBn ? 'প্রশ্ন:' : 'Question:'}</strong> একটি কোমল পানীয়ের pH মান ৩.৫০ হলে এতে উপস্থিত{' '}
                    <RenderMathText text="\text{H}^+" /> আয়নের মোলার ঘনমাত্রা কত?
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                    <p>আমরা জানি, <RenderMathText text="\text{pH} = -\log_{10}[\text{H}^+]" /></p>
                    <p>বা, <RenderMathText text="\log_{10}[\text{H}^+] = -\text{pH} = -3.50" /></p>
                    <p>বা, <RenderMathText text="[\text{H}^+] = 10^{-\text{pH}} = 10^{-3.50} = 3.16 \times 10^{-4} \text{ mol/L}" /></p>
                    <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isBn
                        ? 'উত্তর: কোমল পানীয়টিতে হাইড্রোজেন আয়নের ঘনমাত্রা ৩.১৬ × ১০⁻⁴ mol/L বা M।'
                        : 'Answer: Concentration of H⁺ = 3.16 × 10⁻⁴ mol/L (M).'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Example 3: চুনাপাথর ও এসিড বিক্রিয়ায় গ্যাস শনাক্তকরণ */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৩
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn
                        ? 'কার্বনেটের সাথে এসিডের বিক্রিয়া ও চুনের পানির ঘোলাত্ব সমীকরণ'
                        : 'Carbonate Acid Reaction & Limewater Cloudiness Proof'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'যশোর বোর্ড ২০২৩, কুমিল্লা ২০২১' : 'Jashore Board 2023'}
                  </span>
                </div>

                <div className="text-sm space-y-3">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>{isBn ? 'প্রশ্ন:' : 'Question:'}</strong> চুনাপাথরে লঘু হাইড্রোক্লোরিক এসিড যোগ করলে যে গ্যাস নির্গত হয় তা স্বচ্ছ চুনের পানিতে চালনা করলে এবং পরবর্তীতে অতিরিক্ত চালনা করলে কী ঘটে? সংশ্লিষ্ট সমীকরণসহ ব্যাখ্যা করো।
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs md:text-sm">
                    <div>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {isBn ? 'বিক্রিয়া ১: গ্যাস উৎপাদন' : 'Reaction 1: Gas Generation'}
                      </span>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono my-1">
                        <RenderMathText text="\text{CaCO}_3(\text{s}) + 2\text{HCl}(\text{aq}) \rightarrow \text{CaCl}_2(\text{aq}) + \text{H}_2\text{O}(\text{l}) + \text{CO}_2(\text{g})\uparrow" />
                      </div>
                      <p>এখানে নির্গত গ্যাসটি হলো বর্ণহীন কার্বন ডাই-অক্সাইড (<RenderMathText text="\text{CO}_2" />)।</p>
                    </div>

                    <div>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {isBn ? 'বিক্রিয়া ২: স্বচ্ছ চুনের পানি ঘোলা হওয়া' : 'Reaction 2: Cloudiness Formation'}
                      </span>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono my-1">
                        <RenderMathText text="\text{Ca(OH)}_2(\text{aq}) + \text{CO}_2(\text{g}) \rightarrow \text{CaCO}_3(\text{s})\downarrow \text{ (সাদা অধঃক্ষেপ)} + \text{H}_2\text{O}(\text{l})" />
                      </div>
                      <p>অদ্রবণীয় ক্যালসিয়াম কার্বনেট উৎপন্ন হওয়ায় স্বচ্ছ চুনের পানি দুধের মতো ঘোলাটে হয়ে যায়।</p>
                    </div>

                    <div>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {isBn ? 'বিক্রিয়া ৩: অতিরিক্ত গ্যাসে পুনরায় বর্ণহীন হওয়া' : 'Reaction 3: Disappearance of Cloudiness'}
                      </span>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono my-1">
                        <RenderMathText text="\text{CaCO}_3(\text{s}) + \text{H}_2\text{O}(\text{l}) + \text{CO}_2(\text{g}) \rightarrow \text{Ca(HCO}_3)_2(\text{aq}) \text{ (পানিতে দ্রবণীয়)}" />
                      </div>
                      <p>পানিতে সম্পূর্ণ দ্রবণীয় ক্যালসিয়াম বাইকার্বনেট গঠিত হওয়ায় দ্রবণের ঘোলাত্ব দূর হয়ে পুনরায় কাচের মতো স্বচ্ছ হয়ে যায়।</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example 4: পানির অস্থায়ী ও স্থায়ী খরতা দূরীকরণ */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৪
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn
                        ? 'পানির অস্থায়ী ও স্থায়ী খরতা দূরীকরণের রাসায়নিক সমীকরণ'
                        : 'Reactions for Softening Temporary & Permanent Hard Water'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'বরিশাল বোর্ড ২০২৩, সিলেট ২০২০' : 'Barishal Board 2023'}
                  </span>
                </div>

                <div className="text-sm space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                    <p className="font-semibold text-cyan-600 dark:text-cyan-400">
                      (ক) অস্থায়ী খরতা দূরীকরণ (উত্তাপ পদ্ধতি):
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{Ca(HCO}_3)_2(\text{aq}) \xrightarrow{\Delta} \text{CaCO}_3(\text{s})\downarrow + \text{H}_2\text{O}(\text{l}) + \text{CO}_2(\text{g})\uparrow" />
                    </div>

                    <p className="font-semibold text-cyan-600 dark:text-cyan-400 pt-2">
                      (খ) স্থায়ী খরতা দূরীকরণ (সোডা পদ্ধতি):
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{CaCl}_2(\text{aq}) + \text{Na}_2\text{CO}_3(\text{aq}) \rightarrow \text{CaCO}_3(\text{s})\downarrow + 2\text{NaCl}(\text{aq})" />
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{MgSO}_4(\text{aq}) + \text{Na}_2\text{CO}_3(\text{aq}) \rightarrow \text{MgCO}_3(\text{s})\downarrow + \text{Na}_2\text{SO}_4(\text{aq})" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      অদ্রবণীয় কার্বনেট লবণ ফিল্টার বা ছেঁকে সরিয়ে নিলে পানি মৃদু হয়ে যায় এবং সাবানের সাথে সহজে ফেনা তৈরি করে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Example 5: এসিড বৃষ্টি ও মাটির অম্লত্ব নিরসন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৫
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'এসিড বৃষ্টি সৃষ্টি ও মাটিতে চুন প্রয়োগের প্রশমন বিক্রিয়া' : 'Acid Rain Generation & Soil Liming Chemistry'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'ময়মনসিংহ বোর্ড ২০২২, ঢাকা ২০২০' : 'Mymensingh Board 2022'}
                  </span>
                </div>

                <div className="text-sm space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                    <p className="font-semibold text-cyan-600 dark:text-cyan-400">
                      সালফিউরিক এসিড বৃষ্টি সৃষ্টির ধাপসমূহ:
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="2\text{SO}_2(\text{g}) + \text{O}_2(\text{g}) \rightarrow 2\text{SO}_3(\text{g})" />
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{SO}_3(\text{g}) + \text{H}_2\text{O}(\text{l}) \rightarrow \text{H}_2\text{SO}_4(\text{aq})" />
                    </div>

                    <p className="font-semibold text-cyan-600 dark:text-cyan-400 pt-2">
                      জমির অম্লত্ব দূরীকরণে চুন (CaO বা Ca(OH)₂) প্রয়োগের প্রশমন সমীকরণ:
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono">
                      <RenderMathText text="\text{CaO}(\text{s}) + \text{H}_2\text{SO}_4(\text{aq}) \rightarrow \text{CaSO}_4(\text{aq}) + \text{H}_2\text{O}(\text{l})" />
                    </div>
                  </div>
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
                {isBn ? 'হাতে-কলমে রসায়ন ল্যাব' : 'Hands-On Interactive Labs'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? '৪টি ভার্চুয়াল সিমুলেশন ও পরীক্ষণ চেম্বার' : '4 Virtual Simulation & Experiment Chambers'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'pH বর্ণালি ও ইউনিভার্সাল ইন্ডিকেটর, গ্যাস নিঃসরণ ও চুনের পানির টেস্ট, পানির খরতা দূরীকরণ এবং ক্ষার বনাম ক্ষারক ভেন ক্লাসিফায়ার।'
                  : 'pH multi-indicator spectrum, gas evolution chamber, water softening lab, and alkali vs base Venn diagram explorer.'}
              </p>
            </div>

            {/* =========================================================================
                SIMULATOR 1: MASTER pH & INDICATOR SPECTRUM
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-600 text-white font-bold text-xs">ল্যাব ০১</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'মাস্টার pH স্কেল ও ৪-নির্দেশক বর্ণালি ল্যাব' : 'Master pH Scale & 4-Indicator Spectrum Lab'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'pH স্লাইডার পরিবর্তন করুন অথবা প্রিসেট নির্বাচন করে [H⁺], [OH⁻] ও বিভিন্ন নির্দেশকের বর্ণ পরিবর্তন পর্যবেক্ষণ করুন।'
                      : 'Slide the pH control or pick presets to observe real-time [H⁺], [OH⁻], and indicator color transformations.'}
                  </p>
                </div>

                {/* Reset button */}
                <button
                  onClick={() => {
                    setCurrentPh(7.0);
                    setActivePresetId('pure_water');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট (৭.০)' : 'Reset (7.0)'}
                </button>
              </div>

              {/* Solution Preset Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'বাস্তব জীবনের দ্রবণ নির্বাচন করুন:' : 'Select Real-World Solution Preset:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {PH_PRESETS.map((p) => {
                    const isSelected = activePresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePresetId(p.id);
                          setCurrentPh(p.ph);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500'
                        }`}
                      >
                        {isBn ? p.nameBn : p.nameEn} (pH {p.ph.toFixed(1)})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Interactive pH Slider */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {isBn ? 'pH নিয়ন্ত্রণ স্লাইডার:' : 'Continuous pH Slider:'}
                  </span>
                  <span
                    className="px-3.5 py-1 rounded-full text-base font-extrabold text-white shadow-sm"
                    style={{ backgroundColor: indicatorColor.hex }}
                  >
                    pH = {currentPh.toFixed(1)}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.1"
                  value={currentPh}
                  onChange={(e) => {
                    setCurrentPh(parseFloat(e.target.value));
                    setActivePresetId('custom');
                  }}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-cyan-600 bg-gradient-to-r from-red-600 via-yellow-400 via-green-500 via-blue-500 to-purple-700"
                />

                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span className="text-red-500">০ (তীব্র এসিড)</span>
                  <span className="text-yellow-500">৪ (মৃদু এসিড)</span>
                  <span className="text-emerald-500">৭ (নিরপেক্ষ পানি)</span>
                  <span className="text-blue-500">১০ (মৃদু ক্ষার)</span>
                  <span className="text-purple-600">১৪ (তীব্র ক্ষার)</span>
                </div>
              </div>

              {/* Real-time Math & Concentrations Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-semibold">pH মান</span>
                  <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{currentPh.toFixed(1)}</div>
                  <span className="text-[11px] text-slate-400">
                    {currentPh < 7 ? 'অম্লীয় (Acidic)' : currentPh === 7 ? 'নিরপেক্ষ (Neutral)' : 'ক্ষারীয় (Basic)'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-semibold">pOH মান</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{poh.toFixed(1)}</div>
                  <span className="text-[11px] text-slate-400">14 - pH = {poh.toFixed(1)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-semibold">[H⁺] মোলার ঘনমাত্রা</span>
                  <div className="text-lg md:text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                    {hConcentration < 0.0001
                      ? hConcentration.toExponential(2)
                      : hConcentration.toFixed(4)}{' '}
                    <span className="text-xs">M</span>
                  </div>
                  <span className="text-[11px] text-slate-400">10⁻ᵖᴴ mol/L</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-semibold">[OH⁻] মোলার ঘনমাত্রা</span>
                  <div className="text-lg md:text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                    {ohConcentration < 0.0001
                      ? ohConcentration.toExponential(2)
                      : ohConcentration.toFixed(4)}{' '}
                    <span className="text-xs">M</span>
                  </div>
                  <span className="text-[11px] text-slate-400">10⁻ᵖᴼᴴ mol/L</span>
                </div>
              </div>

              {/* 4 Multi-Indicator Test Strips */}
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-cyan-600" />
                  {isBn ? 'এই pH এ ৪টি নির্দেশকের বর্ণ পরিবর্তন পর্যবেক্ষণ:' : '4 Indicator Color Transitions at this pH:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Indicator 1: Universal Indicator */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">ইউনিভার্সাল নির্দেশক</span>
                      <span className="text-[10px] text-slate-400">Universal Ind.</span>
                    </div>
                    <div
                      className="h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-inner transition-colors duration-300"
                      style={{ backgroundColor: indicatorColor.hex }}
                    >
                      {indicatorColor.nameBn.split(' ')[0]}
                    </div>
                    <p className="text-[11px] text-slate-500">{indicatorColor.nameBn}</p>
                  </div>

                  {/* Indicator 2: Litmus Paper */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">লিটমাস পেপার</span>
                      <span className="text-[10px] text-slate-400">Litmus Paper</span>
                    </div>
                    <div
                      className={`h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-inner transition-colors duration-300 ${
                        currentPh < 7 ? 'bg-red-500' : currentPh > 7 ? 'bg-blue-600' : 'bg-purple-500'
                      }`}
                    >
                      {currentPh < 7 ? 'লাল বর্ণ (Red)' : currentPh > 7 ? 'নীল বর্ণ (Blue)' : 'বেগুনি (Purple/No change)'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {currentPh < 7
                        ? 'নীল লিটমাস লাল হয়'
                        : currentPh > 7
                        ? 'লাল লিটমাস নীল হয়'
                        : 'বর্ণ অপরিবর্তিত থাকে'}
                    </p>
                  </div>

                  {/* Indicator 3: Phenolphthalein */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">ফেনফথ্যালিন</span>
                      <span className="text-[10px] text-slate-400">Phenolphthalein</span>
                    </div>
                    <div
                      className={`h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner transition-colors duration-300 ${
                        currentPh >= 8.2 ? 'bg-pink-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {currentPh >= 8.2 ? 'গোলাপি / পিঙ্ক' : 'বর্ণহীন (Colorless)'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {currentPh >= 8.2 ? 'pH ≥ ৮.২ হলে তীব্র গোলাপি' : 'pH < ৮.২ এ সম্পূর্ণ বর্ণহীন'}
                    </p>
                  </div>

                  {/* Indicator 4: Methyl Orange */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">মিথাইল অরেঞ্জ</span>
                      <span className="text-[10px] text-slate-400">Methyl Orange</span>
                    </div>
                    <div
                      className={`h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-inner transition-colors duration-300 ${
                        currentPh < 3.1 ? 'bg-red-600' : currentPh <= 4.4 ? 'bg-orange-500' : 'bg-yellow-400 text-slate-900'
                      }`}
                    >
                      {currentPh < 3.1 ? 'লাল (Red)' : currentPh <= 4.4 ? 'কমলা (Orange)' : 'হলুদ (Yellow)'}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {currentPh < 3.1 ? 'তীব্র অম্লে লাল' : currentPh > 4.4 ? 'মৃদু অম্ল বা ক্ষারে হলুদ' : 'রূপান্তর পরিসীমা'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 2: GAS EVOLUTION & NEUTRALIZATION CHAMBER
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">ল্যাব ০২</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'গ্যাস নিঃসরণ ও প্রশমন বিক্রিয়া চেম্বার' : 'Gas Evolution & Neutralization Chamber'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'এসিডের সাথে সক্রিয় ধাতু ও কার্বনেটের বিক্রিয়া এবং চুনের পানির ঘোলাত্ব টেস্ট করুন।'
                      : 'Simulate reactions of acids with active metals and carbonates with limewater cloudiness test.'}
                  </p>
                </div>

                {/* Sub-mode selector tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setChamberMode('metal');
                      setMetalReacting(false);
                      setSplintTested(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      chamberMode === 'metal'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isBn ? 'ধাতু + এসিড (H₂)' : 'Metal + Acid (H₂)'}
                  </button>
                  <button
                    onClick={() => {
                      setChamberMode('carbonate');
                      setCarbonateReacting(false);
                      setLimewaterState('clear');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      chamberMode === 'carbonate'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isBn ? 'কার্বনেট + এসিড (CO₂)' : 'Carbonate (CO₂)'}
                  </button>
                  <button
                    onClick={() => {
                      setChamberMode('neutralization');
                      setTitrationProgress(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      chamberMode === 'neutralization'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isBn ? 'প্রশমন তাপ থার্মোমিটার' : 'Neutralization Heat'}
                  </button>
                </div>
              </div>

              {/* Mode A: Active Metal + Acid (H2 gas) */}
              {chamberMode === 'metal' && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-6">
                  <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                    {/* Visual Test Tube with Mg Ribbon */}
                    <div className="w-44 h-64 relative bg-slate-200/80 dark:bg-slate-900 rounded-b-full border-4 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-3 overflow-hidden shadow-inner">
                      {/* Acid Liquid Fill */}
                      <div
                        className={`w-full transition-all duration-500 rounded-b-full flex items-center justify-center relative ${
                          metalReacting ? 'h-36 bg-cyan-400/30' : 'h-32 bg-cyan-500/20'
                        }`}
                      >
                        {/* Mg Ribbon */}
                        <div
                          className={`w-4 h-12 bg-slate-400 border border-slate-500 rounded transition-all duration-1000 ${
                            metalReacting ? 'opacity-40 scale-75' : 'opacity-100'
                          }`}
                        />

                        {/* Animated Rising H2 Bubbles */}
                        {metalReacting && (
                          <div className="absolute inset-0 flex flex-col items-center justify-around pointer-events-none animate-pulse">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300/80 -translate-y-4" />
                            <span className="w-3.5 h-3.5 rounded-full bg-cyan-200/90 -translate-y-8" />
                            <span className="w-2 h-2 rounded-full bg-cyan-100/90 -translate-y-12" />
                          </div>
                        )}
                      </div>

                      {/* Gas collection area at mouth */}
                      <div className="absolute top-3 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {metalReacting ? 'H₂ গ্যাস নির্গমন হচ্ছে' : 'লঘু HCl দ্রবণ'}
                      </div>
                    </div>

                    {/* Controls & Reaction Explanation */}
                    <div className="space-y-4 max-w-md">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
                        <div className="text-slate-500 font-semibold mb-1">সংশ্লিষ্ট সমীকরণ:</div>
                        <RenderMathText text="\text{Mg}(\text{s}) + 2\text{HCl}(\text{aq}) \rightarrow \text{MgCl}_2(\text{aq}) + \text{H}_2(\text{g})\uparrow" />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            setMetalReacting(true);
                            setSplintTested(false);
                          }}
                          disabled={metalReacting}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <Play className="w-3.5 h-3.5" />
                          {isBn ? 'ম্যাগনেসিয়াম ফিতা (Mg) ফেলুন' : 'Drop Magnesium Ribbon'}
                        </button>

                        <button
                          onClick={() => setSplintTested(true)}
                          disabled={!metalReacting}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          {isBn ? 'জ্বলন্ত পাটকাঠি মুখে আনুন' : 'Test with Glowing Splint'}
                        </button>
                      </div>

                      {/* Splint test outcome */}
                      {splintTested && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 space-y-1 animate-fadeIn">
                          <div className="font-bold flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            {isBn ? 'পপ (Pop) শব্দসহ নীল শিখায় জ্বলল!' : 'Ignited with a distinct "Pop" sound!'}
                          </div>
                          <p>
                            হাইড্রোজেন গ্যাস নিজেই দাহ্য হওয়ায় এটি জ্বলন্ত শিখার সংস্পর্শে এসে মৃদু বিস্ফোরণসহ (Pop
                            sound) নীল শিখায় জ্বলে ওঠে:{' '}
                            <RenderMathText text="2\text{H}_2 + \text{O}_2 \rightarrow 2\text{H}_2\text{O}" />
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode B: Metal Carbonate + Acid (Limewater Test) */}
              {chamberMode === 'carbonate' && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Visual 2 Beakers with delivery tube */}
                    <div className="flex items-center justify-around p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                      {/* Flask 1: CaCO3 + HCl */}
                      <div className="text-center space-y-2">
                        <span className="text-[11px] font-bold text-slate-500">বিক্রিয়া ফ্লাস্ক</span>
                        <div className="w-28 h-36 relative bg-slate-100 dark:bg-slate-800 rounded-b-2xl border-2 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-2 overflow-hidden shadow-inner">
                          <div
                            className={`w-full transition-all duration-500 rounded-b-xl flex flex-col items-center justify-end ${
                              carbonateReacting ? 'h-24 bg-cyan-500/20' : 'h-20 bg-cyan-500/10'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-slate-500">CaCO₃ গুঁড়া</span>
                          </div>
                          {carbonateReacting && (
                            <span className="absolute top-2 text-[9px] font-bold text-cyan-600 animate-bounce">
                              CO₂ গ্যাস ↑
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">CaCO₃ + 2HCl</span>
                      </div>

                      {/* Gas Delivery Tube */}
                      <div className="text-slate-400 font-mono text-xs text-center">
                        <div>══════►</div>
                        <span className="text-[10px]">গ্যাস নির্গমন নল</span>
                      </div>

                      {/* Flask 2: Limewater Ca(OH)2 */}
                      <div className="text-center space-y-2">
                        <span className="text-[11px] font-bold text-slate-500">চুনের পানি Ca(OH)₂</span>
                        <div className="w-28 h-36 relative bg-slate-100 dark:bg-slate-800 rounded-b-2xl border-2 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-2 overflow-hidden shadow-inner">
                          <div
                            className={`w-full h-24 transition-all duration-700 rounded-b-xl flex items-center justify-center ${
                              limewaterState === 'clear'
                                ? 'bg-cyan-100/30'
                                : limewaterState === 'milky'
                                ? 'bg-slate-200 dark:bg-slate-300/80 shadow-md'
                                : 'bg-cyan-100/40'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-900">
                              {limewaterState === 'clear'
                                ? 'স্বচ্ছ চুনের পানি'
                                : limewaterState === 'milky'
                                ? 'দুধের মতো ঘোলাটে!'
                                : 'পুনরায় বর্ণহীন'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {limewaterState === 'milky' ? 'CaCO₃ অদ্রবণীয়' : limewaterState === 'excess_clear' ? 'Ca(HCO₃)₂ দ্রবণীয়' : 'Ca(OH)₂'}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step Interactive Buttons */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setCarbonateReacting(true);
                            setLimewaterState('milky');
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                        >
                          <Play className="w-3.5 h-3.5" />
                          {isBn ? 'ধাপ ১: CaCO₃ তে এসিড যোগ করো (CO₂ চালনা)' : 'Step 1: Add Acid & Pass CO₂ into Limewater'}
                        </button>

                        <button
                          onClick={() => {
                            if (limewaterState === 'milky') {
                              setLimewaterState('excess_clear');
                            }
                          }}
                          disabled={limewaterState !== 'milky'}
                          className="w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                        >
                          <Droplets className="w-3.5 h-3.5" />
                          {isBn ? 'ধাপ ২: অতিরিক্ত CO₂ গ্যাস চালনা করো' : 'Step 2: Pass Excess CO₂ Gas'}
                        </button>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                        <div className="font-semibold text-cyan-600 dark:text-cyan-400">
                          {isBn ? 'পর্যবেক্ষণ ও কারণ:' : 'Observation:'}
                        </div>
                        {limewaterState === 'clear' && (
                          <p className="text-slate-500">
                            স্বচ্ছ চুনের পানিতে এখনো গ্যাস চালনা করা হয়নি।
                          </p>
                        )}
                        {limewaterState === 'milky' && (
                          <p className="text-slate-700 dark:text-slate-300">
                            চুনের পানিতে CO₂ চালনায় অদ্রবণীয় ক্যালসিয়াম কার্বনেট তৈরি হয়:{' '}
                            <RenderMathText text="\text{Ca(OH)}_2 + \text{CO}_2 \rightarrow \text{CaCO}_3\downarrow + \text{H}_2\text{O}" />
                          </p>
                        )}
                        {limewaterState === 'excess_clear' && (
                          <p className="text-purple-700 dark:text-purple-300">
                            অতিরিক্ত CO₂ গ্যাস চালনায় পানিতে দ্রবণীয় ক্যালসিয়াম বাইকার্বনেট তৈরি হয়ে ঘোলাত্ব দূর হয়:{' '}
                            <RenderMathText text="\text{CaCO}_3 + \text{H}_2\text{O} + \text{CO}_2 \rightarrow \text{Ca(HCO}_3)_2\text{(aq)}" />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode C: Strong Acid + Strong Base Neutralization Heat */}
              {chamberMode === 'neutralization' && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Visual Titration Beaker & Thermometer */}
                    <div className="flex items-center justify-around p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="text-center space-y-2">
                        <div className="w-32 h-44 relative bg-slate-100 dark:bg-slate-800 rounded-b-3xl border-2 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-2 overflow-hidden shadow-inner">
                          <div
                            className="w-full transition-all duration-500 rounded-b-2xl bg-cyan-600/30 flex items-center justify-center"
                            style={{ height: `${30 + titrationProgress * 0.7}%` }}
                          >
                            <span className="text-[10px] font-mono text-cyan-800 dark:text-cyan-200">
                              {titrationProgress === 100 ? 'NaCl + H₂O' : 'HCl + NaOH দ্রবণ'}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">প্রশমন ফ্লাস্ক</span>
                      </div>

                      {/* Thermometer Readout */}
                      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-center space-y-2">
                        <Thermometer className="w-8 h-8 text-rose-500 mx-auto" />
                        <span className="text-xs font-bold text-slate-500">ডিজিটাল তাপমাত্রা</span>
                        <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
                          {(25.0 + (titrationProgress / 100) * 6.8).toFixed(1)}°C
                        </div>
                        <span className="text-[10px] text-slate-400">তাপ বৃদ্ধি: ΔT = +{( (titrationProgress / 100) * 6.8 ).toFixed(1)}°C</span>
                      </div>
                    </div>

                    {/* Titration Slider & Board Theory */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span>NaOH দ্রবণ যোগ করার পরিমাণ:</span>
                          <span className="text-cyan-600">{titrationProgress}% প্রশমিত</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={titrationProgress}
                          onChange={(e) => setTitrationProgress(parseInt(e.target.value))}
                          className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-cyan-600 bg-slate-200 dark:bg-slate-700"
                        />
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 font-mono">
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                          প্রশমন তাপ ধ্রুবক (Constant Enthalpy):
                        </div>
                        <div>HCl + NaOH → NaCl + H₂O; ΔH = -৫৭.৩৪ kJ/mol</div>
                        <p className="font-sans text-slate-500 text-[11px] leading-relaxed">
                          যেকোনো তীব্র এসিড ও তীব্র ক্ষারের বিক্রিয়ায় মূলত H⁺(aq) + OH⁻(aq) → H₂O(l) বিক্রিয়া ঘটে। তাই এদের প্রশমন তাপের মান সর্বদা ধ্রুবক (-৫৭.৩৪ kJ/mol) থাকে।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =========================================================================
                SIMULATOR 3: WATER HARDNESS & SOFTENING LAB
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">ল্যাব ০৩</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'পানির খরতা ও ফেনা পরীক্ষা ল্যাব' : 'Water Hardness & Softening Lab'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'মৃদু পানি, অস্থায়ী খর পানি ও স্থায়ী খর পানিতে সাবান যোগ করুন এবং উত্তপ্তকরণ বা সোডা যোগ করে খরতা দূর করুন।'
                      : 'Add soap to soft, temporary hard, and permanent hard water, and observe lathering after boiling or adding washing soda.'}
                  </p>
                </div>

                {/* Reset button */}
                <button
                  onClick={() => {
                    setSoapAdded(false);
                    setIsBoiled(false);
                    setSodaAdded(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'পরীক্ষা রিসেট' : 'Reset Lab'}
                </button>
              </div>

              {/* Water Sample Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedWaterType('soft');
                    setSoapAdded(false);
                    setIsBoiled(false);
                    setSodaAdded(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedWaterType === 'soft'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">নমুনা ক</div>
                  <div className="text-sm font-bold">মৃদু পানি (Soft / Rain Water)</div>
                  <div className="text-[11px] text-slate-400">কোনো ক্ষরকারী লবণ দ্রবীভূত নেই</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedWaterType('temp_hard');
                    setSoapAdded(false);
                    setIsBoiled(false);
                    setSodaAdded(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedWaterType === 'temp_hard'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">নমুনা খ</div>
                  <div className="text-sm font-bold">অস্থায়ী খর পানি (Temp Hard)</div>
                  <div className="text-[11px] text-slate-400">Ca(HCO₃)₂ ও Mg(HCO₃)₂ দ্রবীভূত</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedWaterType('perm_hard');
                    setSoapAdded(false);
                    setIsBoiled(false);
                    setSodaAdded(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedWaterType === 'perm_hard'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">নমুনা গ</div>
                  <div className="text-sm font-bold">স্থায়ী খর পানি (Perm Hard)</div>
                  <div className="text-[11px] text-slate-400">CaCl₂, CaSO₄, MgSO₄ দ্রবীভূত</div>
                </button>
              </div>

              {/* Visual Beaker with Lather vs Scum */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Visual Beaker */}
                <div className="w-48 h-64 relative bg-slate-200/80 dark:bg-slate-900 rounded-b-3xl border-4 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-3 overflow-hidden shadow-inner">
                  {/* Boiling bubbles if active */}
                  {isBoiled && (
                    <div className="absolute inset-0 flex justify-around items-end pb-12 pointer-events-none animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-cyan-200 -translate-y-8" />
                      <span className="w-3 h-3 rounded-full bg-cyan-300 -translate-y-16" />
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-100 -translate-y-24" />
                    </div>
                  )}

                  {/* Water liquid */}
                  <div className="w-full h-36 bg-blue-400/30 rounded-b-2xl relative flex flex-col justify-between items-center p-2">
                    {/* Top Surface: Foam Lather or Scum */}
                    {soapAdded && (
                      <div
                        className={`w-full py-2 rounded-xl text-center font-bold text-xs shadow-sm transition-all duration-500 ${
                          selectedWaterType === 'soft' ||
                          (selectedWaterType === 'temp_hard' && isBoiled) ||
                          (selectedWaterType === 'perm_hard' && sodaAdded)
                            ? 'bg-white text-blue-600 animate-pulse border border-blue-200'
                            : 'bg-amber-200/90 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {selectedWaterType === 'soft' ||
                        (selectedWaterType === 'temp_hard' && isBoiled) ||
                        (selectedWaterType === 'perm_hard' && sodaAdded)
                          ? 'প্রচুর সাবানের ফেনা (Rich Lather!)'
                          : 'অদ্রবণীয় গাদ / তলানি (Scum precipitate)'}
                      </div>
                    )}

                    {/* Bottom Precipitate if boiled/soda added */}
                    {((selectedWaterType === 'temp_hard' && isBoiled) ||
                      (selectedWaterType === 'perm_hard' && sodaAdded)) && (
                      <div className="w-4/5 py-1 bg-slate-300 dark:bg-slate-700 text-[10px] font-mono text-center rounded text-slate-700 dark:text-slate-200 border border-slate-400">
                        CaCO₃ অদ্রবণীয় অধঃক্ষেপ
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 absolute top-3">টেস্ট বিকার</span>
                </div>

                {/* Interactive Action Controls */}
                <div className="space-y-4 max-w-sm">
                  <div className="space-y-2">
                    <button
                      onClick={() => setSoapAdded(true)}
                      className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Droplets className="w-4 h-4" />
                      {isBn ? '১. সাবানের দ্রবণ যোগ করে ঝাঁকাও' : '1. Add Soap Solution & Shake'}
                    </button>

                    <button
                      onClick={() => setIsBoiled(true)}
                      className="w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Flame className="w-4 h-4" />
                      {isBn ? '২. পানিকে ফুটাও (উত্তপ্তকরণ)' : '2. Boil the Water Sample'}
                    </button>

                    <button
                      onClick={() => setSodaAdded(true)}
                      className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isBn ? '৩. কাপড় কাঁচা সোডা (Na₂CO₃) যোগ করো' : '3. Add Washing Soda (Na₂CO₃)'}
                    </button>
                  </div>

                  {/* Outcome verdict */}
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">পরীক্ষার সিদ্ধান্ত:</span>
                    {selectedWaterType === 'soft' && (
                      <p className="text-slate-600 dark:text-slate-300">
                        মৃদু পানিতে কোনো ক্যালসিয়াম বা ম্যাগনেসিয়াম লবণ না থাকায় শুরু থেকেই সাবানের সাথে প্রচুর ফেনা দেয়।
                      </p>
                    )}
                    {selectedWaterType === 'temp_hard' && (
                      <p className="text-slate-600 dark:text-slate-300">
                        {isBoiled
                          ? 'পানি ফোটানোর ফলে Ca(HCO₃)₂ ভেঙে CaCO₃ অধঃক্ষেপ হিসেবে নিচে জমা হয়েছে। পানি মৃদু হওয়ায় এখন প্রচুর ফেনা উৎপন্ন হচ্ছে!'
                          : 'অস্থায়ী খর পানিতে সাবানের স্টিয়ারেট আয়ন Ca²⁺ এর সাথে বিক্রিয়া করে অদ্রবণীয় ক্যালসিয়াম স্টিয়ারেট (গাদ) তৈরি করায় সহজে ফেনা হয় না।'}
                      </p>
                    )}
                    {selectedWaterType === 'perm_hard' && (
                      <p className="text-slate-600 dark:text-slate-300">
                        {sodaAdded
                          ? 'সোডা যোগ করায় ক্লোরাইড ও সালফেট আয়নের বিপরীতে Ca²⁺ ও Mg²⁺ অদ্রবণীয় কার্বনেট হিসেবে তলানি পড়ে দূর হয়েছে। ফলে এখন ফেনা হচ্ছে!'
                          : isBoiled
                          ? 'স্থায়ী খর পানিকে কেবল ফুটিয়ে খরতা দূর করা যায় না! কারণ CaCl₂ বা CaSO₄ উত্তাপে বিয়োজিত হয় না। সোডা যোগ করতে হবে।'
                          : 'স্থায়ী খর পানিতে সাবান যোগ করলে গাদ সৃষ্টি হয় এবং সাবানের অপচয় হয়।'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 4: "ALL ALKALIS ARE BASES, BUT NOT ALL BASES ARE ALKALIS" VENN
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">ল্যাব ০৪</span>
                  <h3 className="text-xl font-bold">
                    {isBn
                      ? '"সকল ক্ষারই ক্ষারক, কিন্তু সকল ক্ষারক ক্ষার নয়" ক্লাসিফায়ার'
                      : '"All Alkalis are Bases, but Not All Bases are Alkalis" Classifier'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'যৌগ নির্বাচন করে এর পানিতে দ্রবণীয়তা, OH⁻ নিঃসরণ এবং ক্ষারক বনাম ক্ষার শ্রেণিবিভাগ যাচাই করুন।'
                    : 'Tap compounds to examine water solubility, hydroxide release, and Venn classification.'}
                </p>
              </div>

              {/* Compound Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'naoh', name: 'NaOH', titleBn: 'সোডিয়াম হাইড্রোক্সাইড' },
                  { id: 'koh', name: 'KOH', titleBn: 'পটাশিয়াম হাইড্রোক্সাইড' },
                  { id: 'caoh2', name: 'Ca(OH)₂', titleBn: 'ক্যালসিয়াম হাইড্রোক্সাইড' },
                  { id: 'nh4oh', name: 'NH₄OH', titleBn: 'অ্যামোনিয়াম হাইড্রোক্সাইড' },
                  { id: 'feoh3', name: 'Fe(OH)₃', titleBn: 'আয়রন(III) হাইড্রোক্সাইড' },
                  { id: 'cuo', name: 'CuO', titleBn: 'কপার অক্সাইড' },
                  { id: 'aloh3', name: 'Al(OH)₃', titleBn: 'অ্যালুমিনিয়াম হাইড্রোক্সাইড' },
                  { id: 'zno', name: 'ZnO', titleBn: 'জিংক অক্সাইড' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCompound(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedCompound === item.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500'
                    }`}
                  >
                    {item.name} ({item.titleBn})
                  </button>
                ))}
              </div>

              {/* Venn Compound Insight Card */}
              <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-4">
                {selectedCompound === 'naoh' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
                        ক্ষারক এবং ক্ষার উভয়ই (Both Base & Alkali)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      সোডিয়াম হাইড্রোক্সাইড (NaOH) - কস্টিক সোডা
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      • <strong>ক্ষারক কেন?</strong> এটি এসিডের সাথে বিক্রিয়া করে লবণ ও পানি উৎপন্ন করে: NaOH + HCl → NaCl + H₂O।<br />
                      • <strong>ক্ষার কেন?</strong> এটি পানিতে সম্পূর্ণ দ্রবণীয় এবং প্রচুর হাইড্রোক্সাইড আয়ন (OH⁻) দান করে: NaOH(s) → Na⁺(aq) + OH⁻(aq)।
                    </p>
                  </div>
                )}

                {selectedCompound === 'koh' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
                        ক্ষারক এবং ক্ষার উভয়ই (Both Base & Alkali)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      পটাশিয়াম হাইড্রোক্সাইড (KOH) - কস্টিক পটাশ
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      পানিতে সম্পূর্ণ দ্রবণীয় তীব্র ক্ষার। নরম সাবান তৈরিতে কাঁচামাল হিসেবে ব্যবহৃত হয়।
                    </p>
                  </div>
                )}

                {selectedCompound === 'caoh2' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
                        ক্ষারক এবং ক্ষার উভয়ই (Both Base & Alkali)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      ক্যালসিয়াম হাইড্রোক্সাইড [Ca(OH)₂] - স্লেকড চুন / চুনের পানি
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      পানিতে স্বল্প দ্রবণীয় হলেও দ্রবীভূত অংশ সম্পূর্ণ বিয়োজিত হয়ে OH⁻ দেয়। তাই এটি ক্ষারক ও ক্ষার উভয়ই।
                    </p>
                  </div>
                )}

                {selectedCompound === 'nh4oh' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
                        ক্ষারক এবং মৃদু ক্ষার (Weak Alkali & Base)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      অ্যামোনিয়াম হাইড্রোক্সাইড (NH₄OH) - অ্যামোনিয়ার জলীয় দ্রবণ
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      অ্যামোনিয়া গ্যাস পানিতে দ্রবীভূত হয়ে আংশিক বিয়োজিত হয়। মৃদু ক্ষার হিসেবে গ্লাস ক্লিনার উৎপাদনে ব্যবহৃত হয়।
                    </p>
                  </div>
                )}

                {selectedCompound === 'feoh3' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold text-xs border border-rose-500/20">
                        শুধুমাত্র ক্ষারক, ক্ষার নয় (Base Only, NOT an Alkali)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      আয়রন(III) হাইড্রোক্সাইড [Fe(OH)₃]
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      • <strong>ক্ষারক কেন?</strong> এটি এসিডের সাথে বিক্রিয়া করে আয়রন লবণ ও পানি তৈরি করে: Fe(OH)₃ + 3HCl → FeCl₃ + 3H₂O।<br />
                      • <strong>ক্ষার নয় কেন?</strong> এটি পানিতে অদ্রবণীয় এবং জলীয় দ্রবণে কোনো OH⁻ আয়ন মুক্ত করতে পারে না। লালচে বাদামি রঙের অধঃক্ষেপ হিসেবে থাকে।
                    </p>
                  </div>
                )}

                {selectedCompound === 'cuo' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold text-xs border border-rose-500/20">
                        শুধুমাত্র ক্ষারক, ক্ষার নয় (Base Only, NOT an Alkali)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      কপার অক্সাইড (CuO) - কালো ধাতব অক্সাইড
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      ধাতব অক্সাইড হওয়ায় এসিডের সাথে বিক্রিয়া করে কপার সালফেট লবণ ও পানি তৈরি করে (CuO + H₂SO₄ → CuSO₄ + H₂O)। কিন্তু পানিতে সম্পূর্ণ অদ্রবণীয় হওয়ায় এটি ক্ষার নয়।
                    </p>
                  </div>
                )}

                {selectedCompound === 'aloh3' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold text-xs border border-rose-500/20">
                        শুধুমাত্র ক্ষারক, ক্ষার নয় (Base Only, Insoluble)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      অ্যালুমিনিয়াম হাইড্রোক্সাইড [Al(OH)₃]
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      অ্যান্টাসিড সাসপেনশনে ব্যবহৃত হয়। পানিতে অদ্রবণীয় সাদা জেলির মতো তলানি সৃষ্টি করে।
                    </p>
                  </div>
                )}

                {selectedCompound === 'zno' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 font-bold text-xs border border-rose-500/20">
                        উভধর্মী ক্ষারক, ক্ষার নয় (Amphoteric Base)
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-purple-900 dark:text-purple-300">
                      জিংক অক্সাইড (ZnO) - ফিলোসফার্স উল
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
                      এসিড ও ক্ষার উভয়ের সাথেই বিক্রিয়া করে, তবে পানিতে অদ্রবণীয় বিধায় ক্ষার নয়।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: CHECK (বোর্ড নৈর্ব্যক্তিক ও সৃজনশীল মূল্যায়ন)
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
                  ? 'ঢাকা, রাজশাহী, দিনাজপুর ও চট্টগ্রাম বোর্ডের বিগত প্রশ্নাবলী এবং এনসিটিবি পাঠ্যবইয়ের মূল সৃজনশীল মডেল উত্তর।'
                  : 'Practice standard board questions with instant validation and official marking rubrics.'}
              </p>
            </div>

            {/* Part 1: 5 Authentic Board MCQs */}
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

                      {/* Explanation feedback */}
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

            {/* Part 2: 1 Complete Board Creative Question (CQ) */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">সৃজনশীল প্রশ্ন</span>
                  <h3 className="text-xl font-bold mt-1">
                    {isBn
                      ? 'টেক্সটাইল মিলের বর্জ্য ও এসিড বৃষ্টি সম্পর্কিত সৃজনশীল প্রশ্ন'
                      : 'Creative Question: Textile Waste & Acid Rain'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isBn ? 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ২৩২, ঢাকা বোর্ড ২০২২ ও কুমিল্লা বোর্ড ২০২৩' : 'Textbook Page 232 Model CQ'}
                  </span>
                </div>
                <span className="text-sm font-black text-purple-600 dark:text-purple-400">১০ নম্বর (১+২+৩+৪)</span>
              </div>

              {/* Stem (উদ্দীপক) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  উদ্দীপক (Stem):
                </span>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  একটি এলাকায় অবস্থিত টেক্সটাইল মিল ও ডায়িং শিল্পকারখানা তাদের সালফিউরিক এসিড (H₂SO₄) ও রঙযুক্ত অপরিশোধিত তরল বর্জ্য সরাসরি নিকটবর্তী খালে ফেলছে। ফলে খালের জলজ উদ্ভিদ ও মাছ মারা যাচ্ছে এবং খালের পানির pH মান কমে ৩.২ এ নেমে এসেছে। এছাড়া শিল্প এলাকার ইটভাটা ও বয়লার থেকে প্রচুর SO₂ এবং NO₂ গ্যাস বাতাসে নির্গত হচ্ছে।
                </p>
              </div>

              {/* CQ Subquestions Accordion */}
              <div className="space-y-4">
                {/* Question (ক) */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('ka')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (ক) তেঁতুলে কোন জৈব এসিড থাকে? <span className="text-xs text-slate-400 ml-2">[১ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ka ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ka && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>তেঁতুলে টারটারিক এসিড (Tartaric Acid) থাকে।</p>
                    </div>
                  )}
                </div>

                {/* Question (খ) */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('kha')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (খ) চুনের পানির pH মান ৭ থেকে বেশি হয় কেন? ব্যাখ্যা করো। <span className="text-xs text-slate-400 ml-2">[২ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.kha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.kha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        চুনের পানি হলো ক্যালসিয়াম হাইড্রোক্সাইড [Ca(OH)₂] এর পাতলা জলীয় দ্রবণ। Ca(OH)₂ একটি ক্ষার হওয়ায় এটি পানিতে বিয়োজিত হয়ে হাইড্রোক্সাইড আয়ন (OH⁻) মুক্ত করে:
                      </p>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-center text-xs">
                        Ca(OH)₂(aq) → Ca²⁺(aq) + 2OH⁻(aq)
                      </div>
                      <p>
                        দ্রবণে OH⁻ আয়নের সংখ্যা বেড়ে যাওয়ায় পানির স্বতঃবিয়োজন সাম্যাবস্থা অনুযায়ী H⁺ আয়নের সংখ্যা হ্রাস পায় ([H⁺] &lt; ১০⁻⁷ M)। যেহেতু pH = -log[H⁺], তাই [H⁺] হ্রাস পেলে pH বৃদ্ধি পায়। ফলে চুনের পানির pH মান ৭ অপেক্ষা বেশি (প্রায় ১২-১৩) হয়ে ক্ষারীয় বৈশিষ্ট্য প্রদর্শন করে।
                      </p>
                    </div>
                  )}
                </div>

                {/* Question (গ) */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('ga')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (গ) উদ্দীপকের খালের পানিতে মাছ বেঁচে থাকার অনুপযোগী হওয়ার কারণ ব্যাখ্যা করো এবং প্রতিকারে রাসায়নিক পরামর্শ দাও। <span className="text-xs text-slate-400 ml-2">[৩ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ga ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ga && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        সাধারণত জলজ জীব ও মাছের বেঁচে থাকার জন্য পানির আদর্শ pH পরিসীমা হলো ৬.৫ থেকে ৮.৫। পানির pH মান ৪.৫ এর নিচে নামলে মাছের ডিম নষ্ট হয় এবং জলজ বাস্তুতন্ত্রের জৈবিক ক্রিয়া ধ্বংস হয়ে মাছ মারা যায়। উদ্দীপকের খালের পানিতে অপরিশোধিত সালফিউরিক এসিড মেশায় এর pH ৩.২ এ নেমে এসেছে, যা চরম অম্লীয় ও বিষাক্ত।
                      </p>
                      <p className="font-semibold text-cyan-600 dark:text-cyan-400">প্রতিকারে পরামর্শ:</p>
                      <p>
                        ১. <strong>ইটিপি (ETP) স্থাপন:</strong> কারখানায় ইটিপি প্লান্ট স্থাপন করে বর্জ্য নিঃসরণের আগেই প্রশমিত করতে হবে।<br />
                        ২. <strong>চুন বা চুনাপাথর প্রয়োগ:</strong> জরুরি প্রতিকার হিসেবে খালে কলিচুন [Ca(OH)₂] বা চুন (CaO) প্রয়োগ করতে হবে। এর ফলে অম্ল-ক্ষারক প্রশমন বিক্রিয়ার মাধ্যমে এসিড প্রশমিত হয়ে পানি স্বাভাবিক অবস্থায় ফিরে আসবে:
                      </p>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-center text-xs">
                        Ca(OH)₂(s) + H₂SO₄(aq) → CaSO₄(s) + 2H₂O(l)
                      </div>
                    </div>
                  )}
                </div>

                {/* Question (ঘ) */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('gha')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (ঘ) উদ্দীপকে উল্লেখিত শিল্প এলাকার আশপাশে এসিড বৃষ্টির সম্ভাবনা সমীকরণসহ বিশ্লেষণ করো। <span className="text-xs text-slate-400 ml-2">[৪ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.gha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.gha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        উদ্দীপকে উল্লেখিত শিল্প এলাকার ইটভাটা ও বয়লারে সালফার ও নাইট্রোজেনযুক্ত জ্বালানি পোড়ানোর ফলে প্রচুর পরিমাণে SO₂ এবং NO₂ গ্যাস বাতাসে মিশছে। বাতাসের অক্সিজেনের উপস্থিতিতে এই গ্যাসগুলো বিক্রিয়া করে সালফিউরিক এসিড ও নাইট্রিক এসিড তৈরি করে যা মেঘের বৃষ্টির পানিতে দ্রবীভূত হয়ে এসিড বৃষ্টির সৃষ্টি করবে।
                      </p>
                      <p className="font-semibold text-cyan-600 dark:text-cyan-400">সংশ্লিষ্ট রাসায়নিক বিক্রিয়াসমূহ:</p>
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs space-y-1">
                        <div>(১) 2SO₂(g) + O₂(g) → 2SO₃(g)</div>
                        <div>(২) SO₃(g) + H₂O(l) → H₂SO₄(aq) (সালফিউরিক এসিড)</div>
                        <div>(৩) 4NO₂(g) + 2H₂O(l) + O₂(g) → 4HNO₃(aq) (নাইট্রিক এসিড)</div>
                      </div>
                      <p>
                        এসিড বৃষ্টির পানি যখন মাটিতে পড়ে, তখন এর pH ৪ এর নিচে নেমে যায়। এটি মাটির উর্বরতা নষ্ট করে, দালানকোঠার মার্বেল পাথর (CaCO₃) ক্ষয় করে এবং বৃক্ষরাজির সালোকসংশ্লেষণ বন্ধ করে দেয়। সুতরাং উক্ত শিল্প এলাকায় এসিড বৃষ্টির তীব্র সম্ভাবনা রয়েছে।
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
                {isBn ? 'অধ্যায় ০৯ সারসংক্ষেপ' : 'Chapter 09 Revision Summary'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'পরীক্ষার আগের রাতের রিভিশন চিটশিট' : 'Exam Revision & Formula Cheat Sheet'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'সবগুলো গাণিতিক সূত্র, গুরুত্বপূর্ণ বিক্রিয়া এবং প্রাকৃতিক এসিডের চার্ট এক নজরে।'
                  : 'All mathematical formulas, essential neutralization equations, and natural acids matrix at a glance.'}
              </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
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
                  <Sliders className="w-4 h-4" />
                  <span>pH গণনার সব সূত্র</span>
                </div>
                <div className="text-xs space-y-2 font-mono">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    • pH = -log₁₀[H⁺]
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    • pOH = -log₁₀[OH⁻]
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    • pH + pOH = 14 (২৫°C)
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    • [H⁺] = 10⁻ᵖᴴ mol/L
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                  <FlaskConical className="w-4 h-4" />
                  <span>বিভিন্ন খাদ্যে উপস্থিত এসিড</span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div>• <strong>লেবু, কমলা:</strong> সাইট্রিক এসিড</div>
                  <div>• <strong>তেঁতুল:</strong> টারটারিক এসিড</div>
                  <div>• <strong>টমেটো:</strong> অক্সালিক এসিড</div>
                  <div>• <strong>আপেল, আনারস:</strong> ম্যালিক এসিড</div>
                  <div>• <strong>দুধ, দই:</strong> ল্যাকটিক এসিড</div>
                  <div>• <strong>ভিনেগার (সিরকা):</strong> অ্যাসিটিক এসিড (৪-১০%)</div>
                  <div>• <strong>পিপড়ার কামড়:</strong> মিথানয়িক (ফরমিক) এসিড</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <Waves className="w-4 h-4" />
                  <span>পানির খরতা সারসংক্ষেপ</span>
                </div>
                <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <p>
                    <strong>অস্থায়ী খরতা:</strong> Ca(HCO₃)₂, Mg(HCO₃)₂ দ্রবীভূত থাকলে। দূর করার উপায়: পানি ফোটানো (উত্তপ্তকরণ)।
                  </p>
                  <p>
                    <strong>স্থায়ী খরতা:</strong> CaCl₂, CaSO₄, MgCl₂, MgSO₄ দ্রবীভূত থাকলে। দূর করার উপায়: সোডা পদ্ধতি (Na₂CO₃ যোগ)।
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black">
                  {isBn ? 'অভিনন্দন! অধ্যায় ০৯ সম্পূর্ণ প্রস্তুত!' : 'Congratulations! Chapter 09 Completed!'}
                </h3>
                <p className="text-sm text-cyan-100 max-w-lg">
                  {isBn
                    ? 'আপনি এসিড-ক্ষার সমতা, pH স্কেল, এসিড বৃষ্টি ও পানির খরতার প্রতিটি খুঁটিনাটি ইন্টারঅ্যাক্টিভভাবে আয়ত্ত করেছেন।'
                    : 'You have mastered acid-base properties, the pH scale, neutralization mechanics, and water hardness removal.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/playground/v2/chemistry/8"
                  className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {isBn ? 'পূর্ববর্তী অধ্যায় (০৮)' : 'Previous Chapter (08)'}
                </Link>
                <Link
                  href={"/dashboard/playground/v2/chemistry/10" as any}
                  className="px-5 py-2.5 rounded-xl bg-white text-cyan-900 hover:bg-cyan-50 text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  {isBn ? 'পরবর্তী অধ্যায়: ১০ (খনিজ সম্পদ: ধাতু-অধাতু)' : 'Next: Chapter 10 (Metals & Non-metals)'}
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
        chapterNumberBn="অধ্যায় 09"
        chapterNumberEn="Chapter 09"
        chapterTitleBn="এসিড-ক্ষার সমতা"
        chapterTitleEn="Acid-Base Balance"
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
                {isBn ? 'অধ্যায় 9 বিশেষজ্ঞ' : 'Chapter 9 Specialist'}
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
              placeholder={isBn ? 'এসিড-ক্ষার সমতা নিয়ে প্রশ্ন করো...' : 'Ask about Acid-Base Balance...'}
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
