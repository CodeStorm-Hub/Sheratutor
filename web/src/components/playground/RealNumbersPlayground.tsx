'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Play,
  Flame,
  Star,
  Layers,
  ChevronRight,
  BookOpen,
  Sliders,
  Check,
  Award,
  Gamepad2,
  GraduationCap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { SheruCompanion } from './SheruCompanion';
import { RealNumbersBoardGuide } from './RealNumbersBoardGuide';

type QuestId = 'classification' | 'recurring' | 'sqrt2' | 'sieve' | 'boss';

interface ClassificationItem {
  id: string;
  display: string;
  mathValue: string;
  primaryCategory: 'N' | 'Z' | 'Q' | 'Q_prime';
  explanationBn: string;
  explanationEn: string;
}

const CLASSIFICATION_ITEMS: ClassificationItem[] = [
  {
    id: 'c1',
    display: '৭',
    mathValue: '$7$',
    primaryCategory: 'N',
    explanationBn: '৭ একটি গণনাযোগ্য ধনাত্মক সংখ্যা, তাই এটি স্বাভাবিক সংখ্যা (ℕ), পূর্ণসংখ্যা (ℤ) এবং মূলদ সংখ্যা (ℚ)!',
    explanationEn: '7 is a positive counting number, so it is Natural (ℕ), Integer (ℤ), and Rational (ℚ)!',
  },
  {
    id: 'c2',
    display: '-৪',
    mathValue: '$-4$',
    primaryCategory: 'Z',
    explanationBn: '-৪ একটি ঋণাত্মক অখণ্ড সংখ্যা, তাই এটি পূর্ণসংখ্যা (ℤ) ও মূলদ সংখ্যা (ℚ), তবে স্বাভাবিক সংখ্যা নয়।',
    explanationEn: '-4 is a negative whole number, so it is an Integer (ℤ) and Rational (ℚ), but not Natural.',
  },
  {
    id: 'c3',
    display: '০',
    mathValue: '$0$',
    primaryCategory: 'Z',
    explanationBn: '০ একটি অঋণাত্মক পূর্ণসংখ্যা (ℤ) এবং মূলদ সংখ্যা (০/১), তবে স্বাভাবিক সংখ্যা নয়।',
    explanationEn: '0 is a non-negative Integer (ℤ) and Rational (0/1), but not a Natural number.',
  },
  {
    id: 'c4',
    display: '৩/৫',
    mathValue: '$\\frac{3}{5}$',
    primaryCategory: 'Q',
    explanationBn: '৩/৫ দুটি পূর্ণসংখ্যার ভগ্নাংশ (p/q), তাই এটি মূলদ সংখ্যা (ℚ)।',
    explanationEn: '3/5 is a ratio of two integers (p/q), so it is Rational (ℚ).',
  },
  {
    id: 'c5',
    display: '√২',
    mathValue: '$\\sqrt{2}$',
    primaryCategory: 'Q_prime',
    explanationBn: '√২ এর মান ১.৪১৪২১৩... যা অসীম অনাবৃত দশমিক। একে ভগ্নাংশে লেখা যায় না, তাই এটি অমূলদ সংখ্যা (ℚ′)!',
    explanationEn: '√2 is 1.414213... which is non-repeating and non-terminating. It cannot be expressed as p/q, hence Irrational (ℚ′)!',
  },
  {
    id: 'c6',
    display: '০.৩̇',
    mathValue: '$0.\\dot{3}$',
    primaryCategory: 'Q',
    explanationBn: '০.৩৩৩... একটি পৌনঃপুনিক দশমিক ভগ্নাংশ, যাকে ১/৩ আকারে লেখা যায়। সুতরাং এটি মূলদ সংখ্যা (ℚ)!',
    explanationEn: '0.333... is a recurring decimal equal to 1/3, making it Rational (ℚ)!',
  },
  {
    id: 'c7',
    display: 'π (পাই)',
    mathValue: '$\\pi$',
    primaryCategory: 'Q_prime',
    explanationBn: 'π এর মান ৩.১৪১৫৯২৬... যা অসীম এবং কোনো নির্দিষ্ট পর্যায়ক্রমে আবৃত্ত হয় না। তাই এটি অমূলদ সংখ্যা (ℚ′)!',
    explanationEn: 'π = 3.1415926... never repeats or terminates. It is Irrational (ℚ′)!',
  },
  {
    id: 'c8',
    display: '√২৫',
    mathValue: '$\\sqrt{25}$',
    primaryCategory: 'N',
    explanationBn: '√২৫ = ৫! এটি একটি পূর্ণবর্গ সংখ্যার মূল, তাই এটি স্বাভাবিক সংখ্যা (ℕ) এবং মূলদ সংখ্যা!',
    explanationEn: '√25 = 5! A square root of a perfect square is a Natural number (ℕ) and Rational!',
  },
  {
    id: 'c9',
    display: '-২.৭৫',
    mathValue: '$-2.75$',
    primaryCategory: 'Q',
    explanationBn: '-২.৭৫ একটি সসীম দশমিক ভগ্নাংশ (= -১১/৪), তাই এটি মূলদ সংখ্যা (ℚ)।',
    explanationEn: '-2.75 is a terminating decimal (= -11/4), so it is Rational (ℚ).',
  },
  {
    id: 'c10',
    display: '√৭',
    mathValue: '$\\sqrt{7}$',
    primaryCategory: 'Q_prime',
    explanationBn: '৭ কোনো পূর্ণবর্গ সংখ্যা নয়, তাই এর বর্গমূল একটি অমূলদ সংখ্যা (ℚ′)।',
    explanationEn: '7 is not a perfect square, so its square root is Irrational (ℚ′).',
  },
];

interface BossQuestion {
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIdx: number;
  explanationBn: string;
  explanationEn: string;
}

const BOSS_QUESTIONS: BossQuestion[] = [
  {
    questionBn: '√১৬ সংখ্যাটি কোন ধরনের সংখ্যা?',
    questionEn: 'What type of number is √16?',
    optionsBn: ['অমূলদ সংখ্যা', 'মূলদ ও স্বাভাবিক সংখ্যা', 'অবাস্তব সংখ্যা', 'ভগ্নাংশ সংখ্যা'],
    optionsEn: ['Irrational number', 'Rational & Natural number', 'Imaginary number', 'Fraction only'],
    correctIdx: 1,
    explanationBn: 'কারণ √১৬ = ৪, যা একটি পূর্ণসংখ্যা ও স্বাভাবিক সংখ্যা!',
    explanationEn: 'Because √16 = 4, which is an integer and natural number!',
  },
  {
    questionBn: '০.৬̇ এর সাধারণ ভগ্নাংশ মান কত?',
    questionEn: 'What is the fractional value of 0.6̇?',
    optionsBn: ['৬/১০', '২/৩', '৩/৫', '৬/১০০'],
    optionsEn: ['6/10', '2/3', '3/5', '6/100'],
    correctIdx: 1,
    explanationBn: '০.৬̇ = ৬/৯ = ২/৩!',
    explanationEn: '0.6̇ = 6/9 = 2/3!',
  },
  {
    questionBn: 'নিচের কোনটি একমাত্র জোড় মৌলিক সংখ্যা?',
    questionEn: 'Which is the ONLY even prime number?',
    optionsBn: ['০', '১', '২', '৪'],
    optionsEn: ['0', '1', '2', '4'],
    correctIdx: 2,
    explanationBn: '২ ছাড়া অন্য সব জোড় সংখ্যা ২ দ্বারা বিভাজ্য, তাই ২-ই একমাত্র জোড় মৌলিক সংখ্যা!',
    explanationEn: 'All other even numbers are divisible by 2, making 2 the only even prime!',
  },
  {
    questionBn: 'দুটি পরস্পর সহমৌলিক সংখ্যার গ.সা.গু কত?',
    questionEn: 'What is the HCF/GCD of two coprime numbers?',
    optionsBn: ['০', '১', 'সংখ্যা দুটির গুণফল', 'যেকোনো সংখ্যা'],
    optionsEn: ['0', '1', 'Their product', 'Any number'],
    correctIdx: 1,
    explanationBn: 'সহমৌলিক সংখ্যার ১ ছাড়া অন্য কোনো সাধারণ উৎপাদক থাকে না, তাই গ.সা.গু সর্বদা ১।',
    explanationEn: 'Coprime numbers have no common factor other than 1, so GCD is always 1.',
  },
  {
    questionBn: '০.২৩̇ এর সাধারণ ভগ্নাংশ কোনটি?',
    questionEn: 'What is the fraction for 0.23̇?',
    optionsBn: ['২৩/৯৯', '২১/৯০', '২৩/১০০', '২১/৯৯'],
    optionsEn: ['23/99', '21/90', '23/100', '21/99'],
    correctIdx: 1,
    explanationBn: '(২৩ - ২) / ৯০ = ২১/৯০ = ৭/৩০!',
    explanationEn: '(23 - 2) / 90 = 21/90 = 7/30!',
  },
];

export function RealNumbersPlayground() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [viewMode, setViewMode] = useState<'sandbox' | 'board_guide'>('sandbox');
  const [activeQuest, setActiveQuest] = useState<QuestId>('classification');
  const [starsEarned, setStarsEarned] = useState<Record<QuestId, boolean>>({
    classification: false,
    recurring: false,
    sqrt2: false,
    sieve: false,
    boss: false,
  });

  // Quest 1: Classification state
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [classificationResults, setClassificationResults] = useState<Record<string, boolean>>({});
  const [classificationFeedback, setClassificationFeedback] = useState<string | null>(null);

  // Quest 2: Recurring decimal state
  const [recurringPreset, setRecurringPreset] = useState<'0.3' | '0.45' | '0.245' | '1.23'>('0.245');
  const [recurringStep, setRecurringStep] = useState(1);

  // Quest 3: Sqrt(2) state
  const [compassAngle, setCompassAngle] = useState(90); // 90 to 0 degrees
  const [proofStep, setProofStep] = useState(1);

  // Quest 4: Sieve state
  const [eliminatedNumbers, setEliminatedNumbers] = useState<Set<number>>(new Set());
  const [sieveStep, setSieveStep] = useState(0);

  // Quest 5: Boss rush state
  const [bossActive, setBossActive] = useState(false);
  const [bossScore, setBossScore] = useState(0);
  const [bossStreak, setBossStreak] = useState(0);
  const [bossTimeLeft, setBossTimeLeft] = useState(60);
  const [bossCurrentQ, setBossCurrentQ] = useState(0);
  const [bossSelectedOption, setBossSelectedOption] = useState<number | null>(null);
  const [bossIsAnswered, setBossIsAnswered] = useState(false);
  const [bossGameOver, setBossGameOver] = useState(false);

  // Boss timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bossActive && bossTimeLeft > 0 && !bossGameOver) {
      timer = setInterval(() => {
        setBossTimeLeft((t) => {
          if (t <= 1) {
            setBossGameOver(true);
            setBossActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [bossActive, bossTimeLeft, bossGameOver]);

  // Handle classification answer
  const handleClassify = (chosenCategory: 'N' | 'Z' | 'Q' | 'Q_prime') => {
    const currentItem = CLASSIFICATION_ITEMS[selectedItemIndex];
    const isCorrect = currentItem.primaryCategory === chosenCategory;

    setClassificationResults((prev) => ({ ...prev, [currentItem.id]: isCorrect }));
    setClassificationFeedback(
      isCorrect
        ? `✅ সঠিক উত্তর! ${isBn ? currentItem.explanationBn : currentItem.explanationEn}`
        : `❌ একটু ভুল হয়েছে! ${isBn ? currentItem.explanationBn : currentItem.explanationEn}`
    );

    if (isCorrect) {
      setStarsEarned((prev) => ({ ...prev, classification: true }));
    }
  };

  // Next item in classification
  const handleNextClassification = () => {
    if (selectedItemIndex < CLASSIFICATION_ITEMS.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1);
      setClassificationFeedback(null);
    }
  };

  // Handle Sieve steps
  const handleSieveStep = (step: number) => {
    const nextSet = new Set(eliminatedNumbers);
    if (step === 1) {
      // 1 is not prime
      nextSet.add(1);
    } else if (step === 2) {
      // multiples of 2 > 2
      for (let i = 4; i <= 50; i += 2) nextSet.add(i);
    } else if (step === 3) {
      // multiples of 3 > 3
      for (let i = 6; i <= 50; i += 3) nextSet.add(i);
    } else if (step === 4) {
      // multiples of 5 > 5
      for (let i = 10; i <= 50; i += 5) nextSet.add(i);
    } else if (step === 5) {
      // multiples of 7 > 7
      for (let i = 14; i <= 50; i += 7) nextSet.add(i);
    }
    setEliminatedNumbers(nextSet);
    setSieveStep(step);
    if (step >= 5) {
      setStarsEarned((prev) => ({ ...prev, sieve: true }));
    }
  };

  // Handle Boss Rush answer
  const handleBossAnswer = (optIdx: number) => {
    if (bossIsAnswered) return;
    setBossSelectedOption(optIdx);
    setBossIsAnswered(true);

    const q = BOSS_QUESTIONS[bossCurrentQ];
    const isCorrect = optIdx === q.correctIdx;

    if (isCorrect) {
      const addedPoints = 100 * (bossStreak + 1);
      setBossScore((s) => s + addedPoints);
      setBossStreak((st) => st + 1);
    } else {
      setBossStreak(0);
    }

    setTimeout(() => {
      if (bossCurrentQ < BOSS_QUESTIONS.length - 1) {
        setBossCurrentQ(bossCurrentQ + 1);
        setBossSelectedOption(null);
        setBossIsAnswered(false);
      } else {
        setBossGameOver(true);
        setBossActive(false);
        setStarsEarned((prev) => ({ ...prev, boss: true }));
      }
    }, 1400);
  };

  const startBossRush = () => {
    setBossActive(true);
    setBossGameOver(false);
    setBossScore(0);
    setBossStreak(0);
    setBossTimeLeft(60);
    setBossCurrentQ(0);
    setBossSelectedOption(null);
    setBossIsAnswered(false);
  };

  const currentQuestData = {
    classification: isBn ? 'সংখ্যার শ্রেণিবিন্যাস ল্যাব' : 'Number Classification Lab',
    recurring: isBn ? 'পৌনঃপুনিকের এক্স-রে মেশিন' : 'Recurring Decimal Decoder',
    sqrt2: isBn ? 'সংখ্যারেখায় √২ এর জ্যামিতিক কাঁটা' : 'Geometric √2 Compass',
    sieve: isBn ? 'মৌলিক সংখ্যা শিকারী (Sieve of Eratosthenes)' : 'Prime Number Sieve',
    boss: isBn ? '৬০ সেকেন্ডের নাম্বার ডিটেকটিভ বস ফাইট' : '60s Number Detective Boss Rush',
  }[activeQuest];

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6 lg:p-8 space-y-6">
      {/* Top Breadcrumb & Chapter Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
            <Link href="/dashboard/playground" className="hover:text-primary transition-colors">
              {isBn ? 'খেলার মাঠ' : 'Playground'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{isBn ? 'সাধারণ গণিত' : 'General Math'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-primary font-bold">{isBn ? 'অধ্যায় ১' : 'Chapter 1'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <span>{isBn ? 'অধ্যায় ১: বাস্তব সংখ্যা (Real Numbers)' : 'Chapter 1: Real Numbers'}</span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
              {isBn ? 'লাইভ স্যান্ডবক্স' : 'Interactive Sandbox'}
            </span>
          </h1>
        </div>

        {/* Quest Stars Meter */}
        <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2">
          <div className="flex items-center gap-1">
            {Object.entries(starsEarned).map(([questKey, isDone]) => (
              <Star
                key={questKey}
                className={`h-5 w-5 transition-all ${
                  isDone ? 'fill-amber-400 text-amber-500 scale-110' : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-bold text-foreground">
            {Object.values(starsEarned).filter(Boolean).length}/5 {isBn ? 'স্টার অর্জিত' : 'Stars'}
          </div>
        </div>
      </div>

      {/* Top View Mode Switcher: Sandbox vs Board Master Guide */}
      <div className="flex items-center gap-2 rounded-2xl border border-primary/25 bg-muted/40 p-1.5 max-w-xl">
        <button
          onClick={() => setViewMode('sandbox')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-extrabold transition-all ${
            viewMode === 'sandbox'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Gamepad2 className="h-4 w-4" />
          <span>{isBn ? 'ইন্টারেক্টিভ ল্যাব (Playground)' : 'Interactive Playground'}</span>
        </button>

        <button
          onClick={() => setViewMode('board_guide')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-extrabold transition-all relative ${
            viewMode === 'board_guide'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>{isBn ? 'বোর্ড মাস্টার ও সমাধান গাইড' : 'Board Master & Solver Guide'}</span>
          <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-black text-black">
            NEW
          </span>
        </button>
      </div>

      {viewMode === 'board_guide' ? (
        <RealNumbersBoardGuide />
      ) : (
        <>
          {/* Quest Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveQuest('classification')}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeQuest === 'classification'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{isBn ? '১. সংখ্যার পরিবার' : '1. Number Family'}</span>
          {starsEarned.classification && <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />}
        </button>

        <button
          onClick={() => setActiveQuest('recurring')}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeQuest === 'recurring'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>{isBn ? '২. পৌনঃপুনিকের এক্স-রে' : '2. Recurring Decoder'}</span>
          {starsEarned.recurring && <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />}
        </button>

        <button
          onClick={() => setActiveQuest('sqrt2')}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeQuest === 'sqrt2'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>{isBn ? '৩. √২ এর জ্যামিতিক কাঁটা' : '3. Geometric √2 Compass'}</span>
          {starsEarned.sqrt2 && <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />}
        </button>

        <button
          onClick={() => setActiveQuest('sieve')}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeQuest === 'sieve'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
              : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>{isBn ? '৪. মৌলিক সংখ্যা শিকারী' : '4. Prime Sieve'}</span>
          {starsEarned.sieve && <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />}
        </button>

        <button
          onClick={() => setActiveQuest('boss')}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeQuest === 'boss'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-card border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Flame className="h-4 w-4 text-amber-400" />
          <span>{isBn ? '৫. ৬০ সে. বস ফাইট' : '5. 60s Boss Rush'}</span>
          {starsEarned.boss && <Trophy className="h-3.5 w-3.5 text-amber-300" />}
        </button>
      </div>

      {/* Main Quest Area */}
      <div className="grid grid-cols-1 gap-6">
        {/* ========================================================================= */}
        {/* QUEST 1: NUMBER CLASSIFICATION LAB */}
        {/* ========================================================================= */}
        {activeQuest === 'classification' && (
          <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {isBn ? 'অভিযান ১: বাস্তব সংখ্যার শ্রেণিবিন্যাস ল্যাব' : 'Quest 1: Real Number Classification Lab'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBn
                    ? 'সংখ্যাটি লক্ষ্য করো এবং এটি কোন প্রাথমিক পরিবারে (স্বাভাবিক, পূর্ণসংখ্যা, মূলদ, বা অমূলদ) পড়ে তা বেছে নাও।'
                    : 'Observe the number and classify it into its most specific primary set.'}
                </p>
              </div>
              <div className="text-xs font-semibold text-primary">
                {selectedItemIndex + 1} / {CLASSIFICATION_ITEMS.length}
              </div>
            </div>

            {/* Target Number Showcase Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-primary/30 bg-gradient-to-b from-primary/10 to-background p-8 text-center shadow-inner">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {isBn ? 'পরীক্ষার সংখ্যা' : 'Target Number'}
              </div>
              <div className="text-5xl sm:text-6xl font-black text-foreground drop-shadow-sm my-2">
                <RenderMathText text={CLASSIFICATION_ITEMS[selectedItemIndex].mathValue} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isBn ? 'নিচের চারটি পরিবারের মধ্যে সঠিক পরিবারে ক্লিক করো:' : 'Click the correct set below:'}
              </p>
            </div>

            {/* 4 Interactive Category Buckets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleClassify('N')}
                className="group relative flex flex-col items-start rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-4 text-left hover:border-blue-500 hover:bg-blue-500/10 transition-all active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    ℕ (Natural)
                  </span>
                  <Sparkles className="h-4 w-4 text-blue-400 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-base font-bold text-foreground">
                  {isBn ? 'স্বাভাবিক সংখ্যা' : 'Natural Number'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {isBn ? '১, ২, ৩, ৪, ৫...' : '1, 2, 3, 4, 5...'}
                </div>
              </button>

              <button
                onClick={() => handleClassify('Z')}
                className="group relative flex flex-col items-start rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4 text-left hover:border-emerald-500 hover:bg-emerald-500/10 transition-all active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    ℤ (Integer)
                  </span>
                  <Layers className="h-4 w-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-base font-bold text-foreground">
                  {isBn ? 'পূর্ণসংখ্যা' : 'Integer'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {isBn ? '...-২, -১, ০, ১, ২...' : '...-2, -1, 0, 1, 2...'}
                </div>
              </button>

              <button
                onClick={() => handleClassify('Q')}
                className="group relative flex flex-col items-start rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-4 text-left hover:border-amber-500 hover:bg-amber-500/10 transition-all active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    ℚ (Rational)
                  </span>
                  <Compass className="h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-base font-bold text-foreground">
                  {isBn ? 'মূলদ সংখ্যা' : 'Rational Number'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {isBn ? 'p/q ভগ্নাংশ ও পৌনঃপুনিক' : 'Fractions (p/q) & Decimals'}
                </div>
              </button>

              <button
                onClick={() => handleClassify('Q_prime')}
                className="group relative flex flex-col items-start rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-4 text-left hover:border-rose-500 hover:bg-rose-500/10 transition-all active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                    ℚ′ (Irrational)
                  </span>
                  <Zap className="h-4 w-4 text-rose-400 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-base font-bold text-foreground">
                  {isBn ? 'অমূলদ সংখ্যা' : 'Irrational Number'}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {isBn ? '√২, √৩, π (অনাবৃত অসীম)' : '√2, √3, π (Non-repeating)'}
                </div>
              </button>
            </div>

            {/* Feedback Alert & Next Button */}
            {classificationFeedback && (
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                <div className="text-sm font-medium text-foreground">
                  <RenderMathText text={classificationFeedback} />
                </div>
                {selectedItemIndex < CLASSIFICATION_ITEMS.length - 1 && (
                  <button
                    onClick={handleNextClassification}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                  >
                    <span>{isBn ? 'পরবর্তী সংখ্যা' : 'Next Number'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* QUEST 2: RECURRING DECIMAL 9s & 0s DECODER */}
        {/* ========================================================================= */}
        {activeQuest === 'recurring' && (
          <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-border/40 pb-4">
              <h3 className="text-xl font-bold text-foreground">
                {isBn ? 'অভিযান ২: পৌনঃপুনিকের এক্স-রে মেশিন (৯ ও ০ এর রহস্য)' : 'Quest 2: Recurring Decimal 9s & 0s Decoder'}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? 'কেন পৌনঃপুনিক ভাঙালে হর-এ ৯ ও ০ আসে? স্টেপ-বাই-স্টেপ বীজগাণিতিক বিয়োগ করে অসীম দশমিকের বিলুপ্তি দেখো!'
                  : 'Discover algebraically why recurring decimals produce 9s and 0s in the denominator!'}
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground mr-1">
                {isBn ? 'উদাহরণ বাছাই করো:' : 'Choose Example:'}
              </span>
              <button
                onClick={() => {
                  setRecurringPreset('0.245');
                  setRecurringStep(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  recurringPreset === '0.245' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                ০.২৪̇৫̇ ($0.2\\dot{4}\\dot{5}$)
              </button>
              <button
                onClick={() => {
                  setRecurringPreset('0.3');
                  setRecurringStep(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  recurringPreset === '0.3' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                ০.৩̇ ($0.\\dot{3}$)
              </button>
              <button
                onClick={() => {
                  setRecurringPreset('0.45');
                  setRecurringStep(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  recurringPreset === '0.45' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                ০.৪̇৫̇ ($0.\\dot{4}\\dot{5}$)
              </button>
              <button
                onClick={() => {
                  setRecurringPreset('1.23');
                  setRecurringStep(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  recurringPreset === '1.23' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                }`}
              >
                ১.২ov ৩̇ ($1.2\\dot{3}$)
              </button>
            </div>

            {/* Step Simulator Frame */}
            <div className="rounded-2xl border-2 border-primary/20 bg-muted/20 p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-primary">
                <span>{isBn ? `ধাপ ${recurringStep} / ৫` : `Step ${recurringStep} of 5`}</span>
                <span className="text-muted-foreground font-normal">
                  {isBn ? 'স্লাইডার বা বোতাম দিয়ে পরবর্তী ধাপে যাও' : 'Click Next to step through'}
                </span>
              </div>

              {/* Step content based on preset and step */}
              {recurringPreset === '0.245' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
                    <div className="text-sm font-semibold text-foreground">
                      {recurringStep === 1 && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            {isBn ? '১. ধরি সংখ্যাটি x:' : '1. Let the number be x:'}
                          </p>
                          <div className="text-lg font-mono font-bold text-primary">
                            $x = 0.2454545...$ (সমীকরণ ১)
                          </div>
                        </div>
                      )}

                      {recurringStep === 2 && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            {isBn
                              ? '২. পৌনঃপুনিক অংশের শেষ পর্যন্ত দশমিক সরাতে ১০০০ (১০³) দিয়ে গুণ করি:'
                              : '2. Multiply by 1000 to move past the repeating block:'}
                          </p>
                          <div className="text-lg font-mono font-bold text-emerald-500">
                            $1000x = 245.454545...$ (সমীকরণ ২)
                          </div>
                        </div>
                      )}

                      {recurringStep === 3 && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            {isBn
                              ? '৩. অনাবৃত অংশের শেষ পর্যন্ত দশমিক সরাতে ১০ (১০¹) দিয়ে গুণ করি:'
                              : '3. Multiply by 10 to move past the non-repeating part:'}
                          </p>
                          <div className="text-lg font-mono font-bold text-amber-500">
                            $10x = 2.454545...$ (সমীকরণ ৩)
                          </div>
                        </div>
                      )}

                      {recurringStep === 4 && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            {isBn
                              ? '৪. সমীকরণ (২) থেকে (৩) বিয়োগ করি! লক্ষ করো, পেছনের অসীম .৪৫৪৫... অংশ কেটে শূন্য হয়ে যাবে!'
                              : '4. Subtract equation 3 from 2! The infinite .4545... tail cancels out to ZERO!'}
                          </p>
                          <div className="text-base sm:text-lg font-mono font-bold text-rose-500 space-y-1">
                            <div>$(1000 - 10)x = 245.4545... - 2.4545...$</div>
                            <div className="text-xl text-primary font-black">$990x = 245 - 2 = 243$</div>
                          </div>
                        </div>
                      )}

                      {recurringStep === 5 && (
                        <div className="space-y-3">
                          <p className="text-muted-foreground text-xs mb-1">
                            {isBn ? '৫. উভয়পক্ষকে ৯৯০ দিয়ে ভাগ করে সাধারণ ভগ্নাংশ পাই:' : '5. Divide by 990 to obtain the fraction:'}
                          </p>
                          <div className="text-2xl font-mono font-black text-emerald-500">
                            $x = \frac{243}{990} = \frac{27}{110}$
                          </div>
                          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-foreground leading-relaxed">
                            💡{' '}
                            <strong>
                              {isBn ? 'এনসিটিবি (NCTB) শর্টকাট সূত্র প্রমাণিত হলো:' : 'NCTB Formula Verified:'}
                            </strong>
                            <br />
                            হর-এ <span className="text-primary font-bold">দুটি ৯</span> এসেছে কারণ পৌনঃপুনিক অঙ্ক ২টি
                            ($4, 5$), এবং <span className="text-amber-500 font-bold">একটি ০</span> এসেছে কারণ অনাবৃত
                            অঙ্ক ১টি ($2$)।
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step Stepper buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      disabled={recurringStep <= 1}
                      onClick={() => setRecurringStep(recurringStep - 1)}
                      className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted disabled:opacity-30"
                    >
                      {isBn ? 'পূর্ববর্তী ধাপ' : 'Previous Step'}
                    </button>

                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setRecurringStep(s);
                            if (s === 5) setStarsEarned((prev) => ({ ...prev, recurring: true }));
                          }}
                          className={`h-7 w-7 rounded-full text-xs font-bold transition-all ${
                            recurringStep === s
                              ? 'bg-primary text-primary-foreground scale-110 shadow'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={recurringStep >= 5}
                      onClick={() => {
                        const next = recurringStep + 1;
                        setRecurringStep(next);
                        if (next === 5) setStarsEarned((prev) => ({ ...prev, recurring: true }));
                      }}
                      className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-30 shadow"
                    >
                      {isBn ? 'পরবর্তী ধাপ ▶' : 'Next Step ▶'}
                    </button>
                  </div>
                </div>
              )}

              {recurringPreset !== '0.245' && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <p>
                    {isBn
                      ? 'এই উদাহরণটির ক্ষেত্রেও একই নিয়ম প্রযোজ্য। উপরে ধাপ ১-৫ বাটনে ক্লিক করে ধারাবাহিক বীজগাণিতিক সমাধান দেখে নাও!'
                      : 'Same logic applies. Step through 1-5 above to see algebraic cancellation!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* QUEST 3: GEOMETRIC SQRT(2) COMPASS & PROOF */}
        {/* ========================================================================= */}
        {activeQuest === 'sqrt2' && (
          <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-border/40 pb-4">
              <h3 className="text-xl font-bold text-foreground">
                {isBn ? 'অভিযান ৩: সংখ্যারেখায় √২ এর জ্যামিতিক কাঁটা' : 'Quest 3: The Geometric √2 Compass on Number Line'}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? 'পিথাগোরাসের ত্রিভুজ এঁকে ভার্চুয়াল কম্পাস ঘুরিয়ে সংখ্যারেখায় √২ (১.৪১৪...) এর সঠিক অবস্থান বের করো!'
                  : 'Use a right-angled triangle with base 1 & height 1, swing the virtual compass down to pinpoint √2!'}
              </p>
            </div>

            {/* Interactive Canvas / SVG Area */}
            <div className="relative rounded-2xl border-2 border-primary/20 bg-muted/10 p-6 flex flex-col items-center">
              <svg viewBox="0 0 500 240" className="w-full max-w-lg h-auto overflow-visible select-none">
                {/* Number Line */}
                <line x1="40" y1="200" x2="460" y2="200" stroke="currentColor" strokeWidth="2.5" className="text-foreground/40" />

                {/* Arrowheads on Number Line */}
                <polygon points="460,196 468,200 460,204" className="fill-foreground/40" />

                {/* Tick 0 */}
                <line x1="80" y1="192" x2="80" y2="208" stroke="currentColor" strokeWidth="2" className="text-foreground" />
                <text x="80" y="225" textAnchor="middle" className="text-xs font-bold fill-foreground">0</text>

                {/* Tick 1 */}
                <line x1="200" y1="192" x2="200" y2="208" stroke="currentColor" strokeWidth="2" className="text-foreground" />
                <text x="200" y="225" textAnchor="middle" className="text-xs font-bold fill-foreground">1</text>

                {/* Triangle Base: (80, 200) to (200, 200) = length 120 (1 unit) */}
                <line x1="80" y1="200" x2="200" y2="200" stroke="#3b82f6" strokeWidth="4" />
                <text x="140" y="190" textAnchor="middle" className="text-[11px] font-bold fill-blue-500">ভূমি = ১</text>

                {/* Triangle Height: (200, 200) to (200, 80) = length 120 (1 unit) */}
                <line x1="200" y1="200" x2="200" y2="80" stroke="#10b981" strokeWidth="4" />
                <text x="225" y="145" textAnchor="middle" className="text-[11px] font-bold fill-emerald-500">লম্ব = ১</text>

                {/* Right Angle Symbol at (200, 200) */}
                <path d="M 188,200 L 188,188 L 200,188" fill="none" stroke="#10b981" strokeWidth="2" />

                {/* Triangle Hypotenuse: (80, 200) to (200, 80) */}
                <line x1="80" y1="200" x2="200" y2="80" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 2" />
                <text x="130" y="125" textAnchor="middle" className="text-xs font-black fill-amber-500">
                  অতিভুজ = √২
                </text>

                {/* Compass Arc from (200, 80) downwards toward (80 + 120*1.414 = 249.7, 200) */}
                {/* Radius = 120 * sqrt(2) = 169.7 */}
                {/* Angle sweeps from 45 deg (hypotenuse) to 0 deg */}
                <path
                  d={`M 200,80 A 169.7 169.7 0 0 1 ${
                    80 + 169.7 * Math.cos(((90 - compassAngle) * Math.PI) / 180)
                  } ${200 - 169.7 * Math.sin(((90 - compassAngle) * Math.PI) / 180)}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />

                {/* Compass Needle (Arm) from (80, 200) */}
                <line
                  x1="80"
                  y1="200"
                  x2={80 + 169.7 * Math.cos(((90 - compassAngle) * Math.PI) / 180)}
                  y2={200 - 169.7 * Math.sin(((90 - compassAngle) * Math.PI) / 180)}
                  stroke="#ef4444"
                  strokeWidth="3"
                />

                {/* Compass Needle Head (Draggable Tip) */}
                <circle
                  cx={80 + 169.7 * Math.cos(((90 - compassAngle) * Math.PI) / 180)}
                  cy={200 - 169.7 * Math.sin(((90 - compassAngle) * Math.PI) / 180)}
                  r="7"
                  className="fill-rose-500 animate-pulse"
                />

                {/* Tick 2 on Number line */}
                <line x1="320" y1="192" x2="320" y2="208" stroke="currentColor" strokeWidth="2" className="text-foreground" />
                <text x="320" y="225" textAnchor="middle" className="text-xs font-bold fill-foreground">2</text>

                {/* Target √2 point at ~249.7 */}
                {compassAngle <= 5 && (
                  <g className="animate-bounce">
                    <line x1="249.7" y1="185" x2="249.7" y2="215" stroke="#ef4444" strokeWidth="3" />
                    <text x="249.7" y="235" textAnchor="middle" className="text-xs font-extrabold fill-rose-500">
                      √২ ≈ ১.৪১৪
                    </text>
                  </g>
                )}
              </svg>

              {/* Slider for Compass */}
              <div className="w-full max-w-md mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>{isBn ? 'কম্পাস ঘোরানোর স্লাইডার:' : 'Swing Compass:'}</span>
                  <span className="text-rose-500">{90 - compassAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={90 - compassAngle}
                  onChange={(e) => {
                    const newAngle = 90 - Number(e.target.value);
                    setCompassAngle(newAngle);
                    if (newAngle <= 5) {
                      setStarsEarned((prev) => ({ ...prev, sqrt2: true }));
                    }
                  }}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{isBn ? 'ত্রিভুজের শীর্ষ' : 'Top of Triangle'}</span>
                  <span>{isBn ? 'সংখ্যারেখা স্পর্শ (√২)' : 'Touches Line (√2)'}</span>
                </div>
              </div>
            </div>

            {/* Proof by Contradiction Explanation Card */}
            <div className="rounded-2xl border border-primary/20 bg-muted/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{isBn ? 'বোর্ড পরীক্ষায় আসার মতো প্রমাণ: √২ একটি অমূলদ সংখ্যা' : 'NCTB Board Proof: √2 is Irrational'}</span>
                </h4>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() => setProofStep(step)}
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        proofStep === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                {proofStep === 1 && (
                  <div>
                    <strong>ধাপ ১:</strong>{' '}
                    <RenderMathText text="ধরি, $\sqrt{2}$ একটি মূলদ সংখ্যা। তাহলে এমন দুটি পরস্পর সহমৌলিক স্বাভাবিক সংখ্যা $p, q$ ($q > 1$) থাকবে যেন, $\sqrt{2} = \frac{p}{q}$ হয়।" />
                  </div>
                )}
                {proofStep === 2 && (
                  <div>
                    <strong>ধাপ ২:</strong>{' '}
                    <RenderMathText text="উভয়পক্ষ বর্গ করে পাই: $2 = \frac{p^2}{q^2}$। উভয়পক্ষকে $q$ দ্বারা গুণ করে পাই: $2q = \frac{p^2}{q}$।" />
                  </div>
                )}
                {proofStep === 3 && (
                  <div className="space-y-1">
                    <strong>ধাপ ৩:</strong>{' '}
                    <RenderMathText text="এখানে $2q$ স্পষ্টতই একটি পূর্ণসংখ্যা। কিন্তু $\frac{p^2}{q}$ পূর্ণসংখ্যা নয়, কারণ $p$ ও $q$ পরস্পর সহমৌলিক! পূর্ণসংখ্যা ও ভগ্নাংশ কখনো সমান হতে পারে না ($2q \neq \frac{p^2}{q}$)।" />
                    <div className="mt-2 text-emerald-500 font-bold">
                      <RenderMathText text="অতএব, $\sqrt{2}$ মূলদ সংখ্যা হতে পারে না— $\sqrt{2}$ একটি অমূলদ সংখ্যা!" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* QUEST 4: SIEVE OF ERATOSTHENES (PRIME HUNTER) */}
        {/* ========================================================================= */}
        {activeQuest === 'sieve' && (
          <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-border/40 pb-4">
              <h3 className="text-xl font-bold text-foreground">
                {isBn ? 'অভিযান ৪: ইরাতোস্থেনিসের ছাঁকনি (মৌলিক সংখ্যা শিকারী)' : 'Quest 4: Sieve of Eratosthenes (Prime Hunter)'}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? '১ থেকে ৫০ পর্যন্ত সংখ্যার মধ্যে থেকে যৌগিক সংখ্যাগুলো একে একে ব্লাস্ট করে আসল মৌলিক সংখ্যাগুলো খুঁজে বের করো!'
                  : 'Filter out composite multiples step-by-step to reveal the glowing prime numbers!'}
              </p>
            </div>

            {/* Sieve Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSieveStep(1)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  sieveStep >= 1 ? 'bg-zinc-700 text-zinc-300' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isBn ? 'ধাপ ১: ১ বাদ দাও (১ মৌলিক নয়)' : 'Step 1: Strike 1'}
              </button>
              <button
                disabled={sieveStep < 1}
                onClick={() => handleSieveStep(2)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  sieveStep >= 2 ? 'bg-zinc-700 text-zinc-300' : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40'
                }`}
              >
                {isBn ? 'ধাপ ২: ২ এর গুণিতকগুলো সরাও' : 'Step 2: Strike Multiples of 2'}
              </button>
              <button
                disabled={sieveStep < 2}
                onClick={() => handleSieveStep(3)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  sieveStep >= 3 ? 'bg-zinc-700 text-zinc-300' : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40'
                }`}
              >
                {isBn ? 'ধাপ ৩: ৩ এর গুণিতকগুলো সরাও' : 'Step 3: Strike Multiples of 3'}
              </button>
              <button
                disabled={sieveStep < 3}
                onClick={() => handleSieveStep(4)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  sieveStep >= 4 ? 'bg-zinc-700 text-zinc-300' : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40'
                }`}
              >
                {isBn ? 'ধাপ ৪: ৫ এর গুণিতকগুলো সরাও' : 'Step 4: Strike Multiples of 5'}
              </button>
              <button
                disabled={sieveStep < 4}
                onClick={() => handleSieveStep(5)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  sieveStep >= 5 ? 'bg-emerald-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40'
                }`}
              >
                {isBn ? 'ধাপ ৫: ৭ এর গুণিতকগুলো সরাও' : 'Step 5: Strike Multiples of 7'}
              </button>
              <button
                onClick={() => {
                  setEliminatedNumbers(new Set());
                  setSieveStep(0);
                }}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Number Grid 1 to 50 */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 rounded-2xl border border-primary/20 bg-muted/10">
              {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => {
                const isEliminated = eliminatedNumbers.has(num);
                const isPrime =
                  sieveStep >= 5 &&
                  !isEliminated &&
                  [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47].includes(num);

                return (
                  <div
                    key={num}
                    className={`flex h-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                      isEliminated
                        ? 'bg-muted/40 text-muted-foreground/30 line-through scale-90'
                        : isPrime
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 scale-105'
                        : 'bg-card text-foreground border border-border/60 hover:border-primary/50'
                    }`}
                  >
                    {num}
                  </div>
                );
              })}
            </div>

            {sieveStep >= 5 && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs sm:text-sm text-foreground flex items-center justify-between">
                <div>
                  🎉 <strong>{isBn ? 'অভিনন্দন! মোট ১৫টি মৌলিক সংখ্যা পাওয়া গেল:' : 'Congratulations! Found 15 Primes:'}</strong>
                  <div className="font-mono font-bold text-amber-500 mt-1">
                    ২, ৩, ৫, ৭, ১১, ১৩, ১৭, ১৯, ২৩, ২৯, ৩১, ৩৭, ৪১, ৪৩, ৪৭
                  </div>
                </div>
                <div className="rounded-full bg-emerald-500 p-2 text-white shadow">
                  <Check className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* QUEST 5: 60-SECOND NUMBER DETECTIVE BOSS RUSH */}
        {/* ========================================================================= */}
        {activeQuest === 'boss' && (
          <div className="rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
                  <span>{isBn ? 'অভিযান ৫: ৬০ সেকেন্ডের বাস্তব সংখ্যা বস ফাইট' : 'Quest 5: 60-Second Real Number Boss Rush'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBn
                    ? 'বোর্ড স্ট্যান্ডার্ড ট্রিক প্রশ্নগুলোর দ্রুত সঠিক উত্তর দিয়ে হাই-স্কোর গড়ো!'
                    : 'Rapid-fire board questions to test your real numbers mastery under pressure!'}
                </p>
              </div>

              {bossActive && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-black text-rose-500">
                    <span>⏱ {bossTimeLeft}s</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-black text-amber-500">
                    <span>🔥 {bossStreak}x Streak</span>
                  </div>
                  <div className="text-sm font-extrabold text-foreground">
                    {bossScore} pts
                  </div>
                </div>
              )}
            </div>

            {/* If Boss Game Not Started */}
            {!bossActive && !bossGameOver && (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-5 rounded-2xl border-2 border-dashed border-amber-500/30 bg-amber-500/5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-xl shadow-amber-500/25">
                  <Trophy className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-foreground">
                    {isBn ? 'তুমি কি বাস্তব সংখ্যার ডিটেকটিভ হতে প্রস্তুত?' : 'Ready to Become a Real Number Detective?'}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md">
                    {isBn
                      ? '৬০ সেকেন্ডে বোর্ড স্ট্যান্ডার্ড প্রশ্নগুলোর উত্তর দিতে হবে। একটানা সঠিক উত্তরে মাল্টিপ্লায়ার বাড়বে!'
                      : 'Answer NCTB board questions within 60 seconds. Consecutive correct answers increase your score multiplier!'}
                  </p>
                </div>
                <button
                  onClick={startBossRush}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-primary to-cta px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:scale-105 transition-all"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>{isBn ? 'যুদ্ধ শুরু করো' : 'Start Boss Rush'}</span>
                </button>
              </div>
            )}

            {/* Boss Rush Active Game Question */}
            {bossActive && !bossGameOver && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-background p-6 space-y-2 text-center">
                  <span className="text-xs font-bold text-primary">
                    {isBn ? `প্রশ্ন ${bossCurrentQ + 1} / ${BOSS_QUESTIONS.length}` : `Question ${bossCurrentQ + 1} of ${BOSS_QUESTIONS.length}`}
                  </span>
                  <h4 className="text-xl font-bold text-foreground">
                    {isBn ? BOSS_QUESTIONS[bossCurrentQ].questionBn : BOSS_QUESTIONS[bossCurrentQ].questionEn}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(isBn ? BOSS_QUESTIONS[bossCurrentQ].optionsBn : BOSS_QUESTIONS[bossCurrentQ].optionsEn).map(
                    (opt, optIdx) => {
                      const isSelected = bossSelectedOption === optIdx;
                      const isCorrect = optIdx === BOSS_QUESTIONS[bossCurrentQ].correctIdx;

                      let btnStyle = 'border-border/60 bg-card hover:border-primary/50 text-foreground';
                      if (bossIsAnswered) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-400';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={bossIsAnswered}
                          onClick={() => handleBossAnswer(optIdx)}
                          className={`rounded-2xl border-2 p-4 text-left text-sm font-medium transition-all ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                              {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>

                {bossIsAnswered && (
                  <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground text-center animate-in fade-in">
                    💡 {isBn ? BOSS_QUESTIONS[bossCurrentQ].explanationBn : BOSS_QUESTIONS[bossCurrentQ].explanationEn}
                  </div>
                )}
              </div>
            )}

            {/* Game Over Screen */}
            {bossGameOver && (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-5 rounded-2xl border border-primary/30 bg-card">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 shadow">
                  <Award className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-foreground">
                    {isBn ? 'অভিনন্দন! যুদ্ধ সমাপ্ত!' : 'Challenge Completed!'}
                  </h4>
                  <p className="text-sm font-bold text-amber-500">
                    {isBn ? `তোমার মোট স্কোর: ${bossScore} পয়েন্ট` : `Final Score: ${bossScore} points`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isBn
                      ? 'তুমি "বাস্তব সংখ্যা বিশারদ (Master of Real Numbers)" ব্যাজ অর্জন করেছো!'
                      : 'You unlocked the "Master of Real Numbers" badge!'}
                  </p>
                </div>
                <button
                  onClick={startBossRush}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
                >
                  {isBn ? 'পুনরায় খেলুন' : 'Play Again'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </>
    )}

      {/* Embedded Socratic AI Companion "Sheru" */}
      <SheruCompanion currentQuestTitle={currentQuestData} />
    </div>
  );
}
