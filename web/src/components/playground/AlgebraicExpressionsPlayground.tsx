'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
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
  Square,
  TrendingUp,
  Split,
  Binary,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { SheruCompanion } from './SheruCompanion';
import { AlgebraicExpressionsBoardGuide } from './AlgebraicExpressionsBoardGuide';

type QuestId = 'geometric_tiles' | 'power_ladder' | 'middle_term' | 'remainder_machine' | 'boss';

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
    questionBn: 'a + b = 3 এবং ab = 2 হলে a³ + b³ এর মান কত?',
    questionEn: 'If a + b = 3 and ab = 2, what is the value of a³ + b³?',
    optionsBn: ['৯', '১৮', '২৭', '৩৬'],
    optionsEn: ['9', '18', '27', '36'],
    correctIdx: 0,
    explanationBn: 'a³ + b³ = (a + b)³ - 3ab(a + b) = 3³ - 3(2)(3) = 27 - 18 = 9!',
    explanationEn: 'a³ + b³ = (a + b)³ - 3ab(a + b) = 3³ - 3(2)(3) = 27 - 18 = 9!',
  },
  {
    questionBn: 'x - 1/x = 4 হলে x² + 1/x² এর মান কোনটি?',
    questionEn: 'If x - 1/x = 4, what is the value of x² + 1/x²?',
    optionsBn: ['১৪', '১৬', '১৮', '২০'],
    optionsEn: ['14', '16', '18', '20'],
    correctIdx: 2,
    explanationBn: 'x² + 1/x² = (x - 1/x)² + 2 = 4² + 2 = 16 + 2 = 18!',
    explanationEn: 'x² + 1/x² = (x - 1/x)² + 2 = 4² + 2 = 16 + 2 = 18!',
  },
  {
    questionBn: 'a² - b² = 8 এবং a - b = 2 হলে a + b এর মান কত?',
    questionEn: 'If a² - b² = 8 and a - b = 2, what is a + b?',
    optionsBn: ['২', '৪', '৬', '৮'],
    optionsEn: ['2', '4', '6', '8'],
    correctIdx: 1,
    explanationBn: 'a² - b² = (a + b)(a - b) => 8 = (a + b) * 2 => a + b = 4!',
    explanationEn: 'a² - b² = (a + b)(a - b) => 8 = (a + b) * 2 => a + b = 4!',
  },
  {
    questionBn: 'x⁴ + x² + 1 এর উৎপাদকে বিশ্লেষিত রূপ কোনটি?',
    questionEn: 'What is the factored form of x⁴ + x² + 1?',
    optionsBn: ['(x² + x + 1)(x² - x + 1)', '(x² + 1)²', '(x² + x - 1)(x² - x - 1)', '(x + 1)⁴'],
    optionsEn: ['(x² + x + 1)(x² - x + 1)', '(x² + 1)²', '(x² + x - 1)(x² - x - 1)', '(x + 1)⁴'],
    correctIdx: 0,
    explanationBn: 'x⁴ + x² + 1 = (x² + 1)² - x² = (x² + 1 + x)(x² + 1 - x) = (x² + x + 1)(x² - x + 1)!',
    explanationEn: 'x⁴ + x² + 1 = (x² + 1)² - x² = (x² + x + 1)(x² - x + 1)!',
  },
  {
    questionBn: 'x + 1/x = √3 হলে x³ + 1/x³ এর মান কত?',
    questionEn: 'If x + 1/x = √3, what is the value of x³ + 1/x³?',
    optionsBn: ['৩√৩', '০', '৬√৩', '১'],
    optionsEn: ['3√3', '0', '6√3', '1'],
    correctIdx: 1,
    explanationBn: 'x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x) = (√3)³ - 3(√3) = 3√3 - 3√3 = 0! (বোর্ড ফেভারিট!)',
    explanationEn: 'x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x) = (√3)³ - 3√3 = 0!',
  },
  {
    questionBn: 'f(x) = x³ - 4x + 3 হলে f(1) এর মান কত?',
    questionEn: 'If f(x) = x³ - 4x + 3, what is f(1)?',
    optionsBn: ['০', '২', '৪', '৬'],
    optionsEn: ['0', '2', '4', '6'],
    correctIdx: 0,
    explanationBn: 'f(1) = 1³ - 4(1) + 3 = 1 - 4 + 3 = 0! সুতরাং (x - 1) একটি সাধারণ উৎপাদক।',
    explanationEn: 'f(1) = 1³ - 4(1) + 3 = 0! So (x - 1) is a factor by remainder theorem.',
  },
];

const CHAPTER_3_PRESETS = [
  'x + 1/x থেকে x^5 + 1/x^5 কীভাবে বের করব?',
  'a^2 - b^2 আর (a - b)^2 এর পার্থক্য কী?',
  'ভাগশেষ উপপাদ্য কীভাবে কাজ করে?',
  'উৎপাদকে বিশ্লেষণের সহজ ট্রিক কী?',
  'm^3 + 2p^3 = 3mn প্রমাণে কোন সূত্র ব্যবহার করব?',
];

export function AlgebraicExpressionsPlayground() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [viewMode, setViewMode] = useState<'sandbox' | 'board_guide'>('sandbox');
  const [activeQuest, setActiveQuest] = useState<QuestId>('geometric_tiles');
  const [starsEarned, setStarsEarned] = useState<Record<QuestId, boolean>>({
    geometric_tiles: false,
    power_ladder: false,
    middle_term: false,
    remainder_machine: false,
    boss: false,
  });

  // ===================== Quest 1: Geometric Tiles State =====================
  const [tileA, setTileA] = useState<number>(4);
  const [tileB, setTileB] = useState<number>(2);
  const [tileFormula, setTileFormula] = useState<'sum' | 'diff' | 'trinomial'>('sum');

  const handleTileChange = (a: number, b: number) => {
    setTileA(a);
    setTileB(b);
    setStarsEarned((prev) => ({ ...prev, geometric_tiles: true }));
  };

  // ===================== Quest 2: Power Ladder State =====================
  type LadderPreset = '3' | 'sqrt5' | '4';
  const [ladderPreset, setLadderPreset] = useState<LadderPreset>('3');
  const [currentRung, setCurrentRung] = useState<number>(1); // 1 to 5

  const getLadderValues = () => {
    if (ladderPreset === '3') {
      const k = 3;
      const k2 = k * k - 2; // 7
      const k3 = k * k * k - 3 * k; // 18
      const k4 = k2 * k2 - 2; // 47
      const k5 = k2 * k3 - k; // 7*18 - 3 = 126 - 3 = 123
      return { k: '3', k2: '7', k3: '18', k4: '47', k5: '123' };
    }
    if (ladderPreset === 'sqrt5') {
      return { k: '√5', k2: '3', k3: '2√5', k4: '7', k5: '5√5' };
    }
    // '4'
    const k = 4;
    const k2 = k * k - 2; // 14
    const k3 = k * k * k - 3 * k; // 52
    const k4 = k2 * k2 - 2; // 194
    const k5 = k2 * k3 - k; // 14*52 - 4 = 724
    return { k: '4', k2: '14', k3: '52', k4: '194', k5: '724' };
  };

  const ladderVals = getLadderValues();

  const handleClimbLadder = (rung: number) => {
    setCurrentRung(rung);
    if (rung === 5) {
      setStarsEarned((prev) => ({ ...prev, power_ladder: true }));
    }
  };

  // ===================== Quest 3: Middle Term Factoring State =====================
  interface QuadraticProblem {
    id: number;
    expr: string;
    b: number;
    c: number;
    correctP: number;
    correctQ: number;
  }

  const QUAD_PROBLEMS: QuadraticProblem[] = [
    { id: 1, expr: 'x² + 5x + 6', b: 5, c: 6, correctP: 2, correctQ: 3 },
    { id: 2, expr: 'x² - 7x + 12', b: -7, c: 12, correctP: -3, correctQ: -4 },
    { id: 3, expr: 'x² + x - 20', b: 1, c: -20, correctP: 5, correctQ: -4 },
    { id: 4, expr: 'x² - 2x - 15', b: -2, c: -15, correctP: 3, correctQ: -5 },
  ];

  const [activeQuadIdx, setActiveQuadIdx] = useState<number>(0);
  const [userP, setUserP] = useState<number>(1);
  const [userQ, setUserQ] = useState<number>(6);
  const [isFactoredCorrect, setIsFactoredCorrect] = useState<boolean>(false);

  const currentQuad = QUAD_PROBLEMS[activeQuadIdx];

  const checkFactorization = (p: number, q: number) => {
    setUserP(p);
    setUserQ(q);
    const sumMatches = p + q === currentQuad.b;
    const prodMatches = p * q === currentQuad.c;
    const correct = sumMatches && prodMatches;
    setIsFactoredCorrect(correct);
    if (correct) {
      setStarsEarned((prev) => ({ ...prev, middle_term: true }));
    }
  };

  // ===================== Quest 4: Remainder Theorem State =====================
  const [testRoot, setTestRoot] = useState<number>(1);
  const [vanished, setVanished] = useState<boolean>(false);

  // Polynomial: f(x) = x^3 - x - 6
  const evalCubic = (x: number) => x * x * x - x - 6;

  const handleTestRoot = (x: number) => {
    setTestRoot(x);
    const result = evalCubic(x);
    if (result === 0) {
      setVanished(true);
      setStarsEarned((prev) => ({ ...prev, remainder_machine: true }));
    } else {
      setVanished(false);
    }
  };

  // ===================== Quest 5: Boss Rush State =====================
  const [bossActive, setBossActive] = useState(false);
  const [bossScore, setBossScore] = useState(0);
  const [bossStreak, setBossStreak] = useState(0);
  const [bossTimeLeft, setBossTimeLeft] = useState(60);
  const [bossCurrentQ, setBossCurrentQ] = useState(0);
  const [bossSelectedOption, setBossSelectedOption] = useState<number | null>(null);
  const [bossIsAnswered, setBossIsAnswered] = useState(false);
  const [bossGameOver, setBossGameOver] = useState(false);

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
    }, 1200);
  };

  const startBossRush = () => {
    setBossActive(true);
    setBossScore(0);
    setBossStreak(0);
    setBossTimeLeft(60);
    setBossGameOver(false);
    setBossCurrentQ(0);
    setBossSelectedOption(null);
    setBossIsAnswered(false);
  };

  const currentQuestData = {
    geometric_tiles: isBn ? 'জ্যামিতিক টাইল কাটার ও ক্ষেত্রফল ল্যাব' : 'Geometric Tile Slicer & Expander',
    power_ladder: isBn ? 'x + 1/x সিমেট্রিক্যাল পাওয়ার মই' : 'Symmetrical x + 1/x Power Ladder',
    middle_term: isBn ? 'মিডল-টার্ম উৎপাদক স্প্লিটার' : 'Middle-Term Factor Splitter',
    remainder_machine: isBn ? 'ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথড' : 'Remainder Theorem Machine',
    boss: isBn ? '৬০ সেকেন্ডের বীজগণিত বস ফাইট' : '60s Algebra Formula Boss Rush',
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
            <span className="text-primary font-bold">{isBn ? 'অধ্যায় ৩' : 'Chapter 3'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <span>{isBn ? 'অধ্যায় ৩: বীজগাণিতিক রাশি (Algebraic Expressions)' : 'Chapter 3: Algebraic Expressions'}</span>
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

      {/* Conditional View: Board Guide vs Sandbox */}
      {viewMode === 'board_guide' ? (
        <AlgebraicExpressionsBoardGuide />
      ) : (
        <>
          {/* Quest Selector Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[
              {
                id: 'geometric_tiles' as QuestId,
                titleBn: '১. জ্যামিতিক টাইলস',
                titleEn: '1. Geometric Tiles',
                descBn: '(a+b)² সূত্রের জ্যামিতিক ক্ষেত্রফল',
                descEn: '(a+b)² Visual Area Proof',
                icon: Square,
              },
              {
                id: 'power_ladder' as QuestId,
                titleBn: '২. x+1/x পাওয়ার মই',
                titleEn: '2. Power Ladder',
                descBn: 'x² থেকে x⁵ এ পৌঁছার সিঁড়ি',
                descEn: 'Ascend from x² to x⁵',
                icon: TrendingUp,
              },
              {
                id: 'middle_term' as QuestId,
                titleBn: '৩. মিডল-টার্ম স্প্লিটার',
                titleEn: '3. Factor Splitter',
                descBn: 'p×q=c এবং p+q=b পাজল',
                descEn: 'p×q=c & p+q=b Puzzle',
                icon: Split,
              },
              {
                id: 'remainder_machine' as QuestId,
                titleBn: '৪. ভ্যানিশিং মেথড',
                titleEn: '4. Vanishing Root',
                descBn: 'ভাগশেষ উপপাদ্য ও রুট ফাইন্ডার',
                descEn: 'Remainder Theorem Zeroes',
                icon: Binary,
              },
              {
                id: 'boss' as QuestId,
                titleBn: '৫. বস ফাইট (৬০ সে)',
                titleEn: '5. Boss Rush (60s)',
                descBn: 'বীজগণিত বোর্ড এমসিকিউ চ্যালেঞ্জ',
                descEn: 'Speed Algebra MCQ Battle',
                icon: Flame,
              },
            ].map((quest) => {
              const Icon = quest.icon;
              const isActive = activeQuest === quest.id;
              const isCompleted = starsEarned[quest.id];

              return (
                <button
                  key={quest.id}
                  onClick={() => setActiveQuest(quest.id)}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                      : 'border-border/60 bg-card hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {isCompleted && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-foreground truncate">
                    {isBn ? quest.titleBn : quest.titleEn}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {isBn ? quest.descBn : quest.descEn}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Quest Arena */}
          <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8 shadow-sm">
            {/* ========================================================= */}
            {/* QUEST 1: GEOMETRIC TILE SLICER                            */}
            {/* ========================================================= */}
            {activeQuest === 'geometric_tiles' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
                        Quest 1
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'জ্যামিতিক টাইল কাটার ও ক্ষেত্রফল ল্যাব' : 'Geometric Tile Slicer & Area Proof'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'স্লাইডার দিয়ে a ও b এর মাপ পরিবর্তন করে দেখো কীভাবে একটি (a+b) বাহুবিশিষ্ট বর্গ ৪টি অংশে বিভক্ত হয়ে (a+b)² = a² + 2ab + b² প্রমাণ করে।'
                        : 'Adjust sliders for a and b to visually explore how a square of side (a+b) physically partitions into a² + 2ab + b².'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">
                      {isBn ? 'সূত্র নির্বাচন:' : 'Formula:'}
                    </span>
                    <button
                      onClick={() => setTileFormula('sum')}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        tileFormula === 'sum'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      (a + b)²
                    </button>
                  </div>
                </div>

                {/* Main Interactive Tile Canvas + Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left SVG Geometric Square Canvas */}
                  <div className="lg:col-span-7 bg-muted/20 rounded-2xl border border-border/60 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="relative">
                      {/* SVG Canvas for Square Tiling */}
                      {/* Scale: base size 40px per unit */}
                      {(() => {
                        const scale = 36;
                        const wA = tileA * scale;
                        const wB = tileB * scale;
                        const totalW = wA + wB;

                        return (
                          <svg
                            width={totalW}
                            height={totalW}
                            className="rounded-xl border border-border shadow-lg drop-shadow-sm select-none"
                          >
                            {/* Tile 1: a^2 (Top-Left) */}
                            <rect
                              x="0"
                              y="0"
                              width={wA}
                              height={wA}
                              className="fill-indigo-500/40 stroke-indigo-500 stroke-2 transition-all duration-300"
                            />
                            <text
                              x={wA / 2}
                              y={wA / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="font-mono text-xs sm:text-sm font-black fill-white"
                            >
                              a² = {tileA * tileA}
                            </text>

                            {/* Tile 2: ab (Top-Right) */}
                            <rect
                              x={wA}
                              y="0"
                              width={wB}
                              height={wA}
                              className="fill-amber-500/40 stroke-amber-500 stroke-2 transition-all duration-300"
                            />
                            <text
                              x={wA + wB / 2}
                              y={wA / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="font-mono text-xs sm:text-sm font-bold fill-white"
                            >
                              ab = {tileA * tileB}
                            </text>

                            {/* Tile 3: ab (Bottom-Left) */}
                            <rect
                              x="0"
                              y={wA}
                              width={wA}
                              height={wB}
                              className="fill-amber-500/40 stroke-amber-500 stroke-2 transition-all duration-300"
                            />
                            <text
                              x={wA / 2}
                              y={wA + wB / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="font-mono text-xs sm:text-sm font-bold fill-white"
                            >
                              ab = {tileA * tileB}
                            </text>

                            {/* Tile 4: b^2 (Bottom-Right) */}
                            <rect
                              x={wA}
                              y={wA}
                              width={wB}
                              height={wB}
                              className="fill-emerald-500/40 stroke-emerald-500 stroke-2 transition-all duration-300"
                            />
                            <text
                              x={wA + wB / 2}
                              y={wA + wB / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="font-mono text-xs sm:text-sm font-black fill-white"
                            >
                              b² = {tileB * tileB}
                            </text>
                          </svg>
                        );
                      })()}
                    </div>

                    <div className="mt-4 text-xs font-mono text-muted-foreground text-center">
                      {isBn
                        ? `মোট দৈর্ঘ্য = (${tileA} + ${tileB}) = ${tileA + tileB} একক`
                        : `Total Side = (${tileA} + ${tileB}) = ${tileA + tileB} units`}
                    </div>
                  </div>

                  {/* Right Controls & Mathematical Proof Box */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Slider Controls */}
                    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-foreground">
                          <span>{isBn ? 'মান a:' : 'Value a:'}</span>
                          <span className="font-mono text-primary text-sm">{tileA}</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="6"
                          value={tileA}
                          onChange={(e) => handleTileChange(Number(e.target.value), tileB)}
                          className="w-full accent-primary cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-foreground">
                          <span>{isBn ? 'মান b:' : 'Value b:'}</span>
                          <span className="font-mono text-emerald-500 text-sm">{tileB}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={tileB}
                          onChange={(e) => handleTileChange(tileA, Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Math Equation Verifier */}
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3 text-xs">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>{isBn ? 'বীজগাণিতিক ক্ষেত্রফল সমীকরণ' : 'Algebraic Area Equation'}</span>
                      </div>

                      <div className="space-y-2 font-mono text-foreground">
                        <div className="text-muted-foreground">
                          (a + b)² = ({tileA} + {tileB})² = {(tileA + tileB) ** 2}
                        </div>
                        <div className="text-muted-foreground">
                          a² + 2ab + b² = {tileA * tileA} + 2({tileA * tileB}) + {tileB * tileB}
                        </div>
                        <div className="pt-2 border-t border-border/60 text-emerald-500 font-bold text-sm">
                          {(tileA + tileB) ** 2} = {tileA * tileA + 2 * tileA * tileB + tileB * tileB} (সত্যান্বিত!)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 2: Symmetrical x + 1/x Power Ladder                 */}
            {/* ========================================================= */}
            {activeQuest === 'power_ladder' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500">
                        Quest 2
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'x + 1/x সিমেট্রিক্যাল পাওয়ার মই' : 'Symmetrical x + 1/x Power Ladder'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'সিঁড়ির ধাপে ধাপে ক্লিক করে দেখো কীভাবে x + 1/x এর মান থেকে ক্রমান্বয়ে x², x³, x⁴ এবং x⁵ এর মানে উত্তীর্ণ হওয়া যায়।'
                        : 'Ascend the algebraic power ladder step-by-step to compute higher powers up to x⁵.'}
                    </p>
                  </div>

                  {/* Seed Presets */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">
                      {isBn ? 'বীজ মান:' : 'Seed:'}
                    </span>
                    {(['3', 'sqrt5', '4'] as LadderPreset[]).map((val) => (
                      <button
                        key={val}
                        onClick={() => {
                          setLadderPreset(val);
                          setCurrentRung(1);
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          ladderPreset === val
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {val === 'sqrt5' ? '√5' : val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ladder Visualizer */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    { rung: 1, title: 'Rung 1: x + 1/x', formula: `k = ${ladderVals.k}`, result: ladderVals.k, note: 'প্রদত্ত বীজ মান' },
                    { rung: 2, title: 'Rung 2: x² + 1/x²', formula: `k² - 2`, result: ladderVals.k2, note: 'বর্গ অনুসিদ্ধান্ত' },
                    { rung: 3, title: 'Rung 3: x³ + 1/x³', formula: `k³ - 3k`, result: ladderVals.k3, note: 'ঘন অনুসিদ্ধান্ত' },
                    { rung: 4, title: 'Rung 4: x⁴ + 1/x⁴', formula: `(Rung 2)² - 2`, result: ladderVals.k4, note: 'দ্বিগুণ বর্গ' },
                    { rung: 5, title: 'Rung 5: x⁵ + 1/x⁵', formula: `Rung 2 × Rung 3 - k`, result: ladderVals.k5, note: 'বোর্ড টার্গেট!' },
                  ].map((step) => {
                    const isUnlocked = currentRung >= step.rung;
                    const isCurrent = currentRung === step.rung;

                    return (
                      <button
                        key={step.rung}
                        onClick={() => handleClimbLadder(step.rung)}
                        className={`rounded-2xl border p-4 text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                          isCurrent
                            ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30'
                            : isUnlocked
                            ? 'border-emerald-500/40 bg-card text-foreground'
                            : 'border-border/50 bg-muted/20 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-muted-foreground">ধাপ {step.rung}</span>
                            {isUnlocked && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          </div>
                          <div className="font-bold text-xs text-foreground">{step.title}</div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-1">{step.formula}</div>
                        </div>

                        <div className="mt-3">
                          <div className="text-xl font-mono font-black text-primary">{step.result}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{step.note}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card for Rung 5 */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-primary">
                      {isBn ? 'বোর্ডের রহস্য: x⁵ এর গুণফলে কেন x + 1/x বিয়োগ করতে হয়?' : 'Why subtract (x + 1/x) in x⁵?'}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      (x² + 1/x²)(x³ + 1/x³) = x⁵ + x²(1/x³) + (1/x²)x³ + 1/x⁵ = x⁵ + 1/x⁵ + (x + 1/x)
                    </div>
                  </div>
                  <div className="text-xs text-emerald-500 font-bold shrink-0">
                    {isBn ? 'অতএব, x⁵ + 1/x⁵ = গুণফল - (x + 1/x)' : 'Hence x⁵ + 1/x⁵ = Product - (x + 1/x)'}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 3: MIDDLE TERM FACTOR SPLITTER                      */}
            {/* ========================================================= */}
            {activeQuest === 'middle_term' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500">
                        Quest 3
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'মিডল-টার্ম উৎপাদক স্প্লিটার (Middle-Term Lab)' : 'Middle-Term Factor Splitter'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'p এবং q এমন দুটি সংখ্যা বের করো যেন p × q = c এবং p + q = b হয়।'
                        : 'Find factors p and q such that p × q = c and p + q = b.'}
                    </p>
                  </div>

                  {/* Problem Switcher */}
                  <div className="flex items-center gap-1.5">
                    {QUAD_PROBLEMS.map((prob, idx) => (
                      <button
                        key={prob.id}
                        onClick={() => {
                          setActiveQuadIdx(idx);
                          setUserP(1);
                          setUserQ(prob.c);
                          setIsFactoredCorrect(false);
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          activeQuadIdx === idx
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        পাজল {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expression Display */}
                <div className="text-center py-4 bg-muted/20 rounded-2xl border border-border/50 space-y-2">
                  <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                    {isBn ? 'উৎপাদকে বিশ্লেষণ করো:' : 'Factorize:'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-primary">
                    {currentQuad.expr}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    b = {currentQuad.b}, c = {currentQuad.c}
                  </div>
                </div>

                {/* Interactive Factor Sliders / Pickers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Selector p */}
                  <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>{isBn ? 'প্রথম উৎপাদক পদ p:' : 'Factor p:'}</span>
                      <span className="font-mono text-lg text-primary">{userP}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => checkFactorization(num, userQ)}
                          className={`h-9 w-9 rounded-xl font-mono font-bold text-xs transition-all ${
                            userP === num
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selector q */}
                  <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>{isBn ? 'দ্বিতীয় উৎপাদক পদ q:' : 'Factor q:'}</span>
                      <span className="font-mono text-lg text-emerald-500">{userQ}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => checkFactorization(userP, num)}
                          className={`h-9 w-9 rounded-xl font-mono font-bold text-xs transition-all ${
                            userQ === num
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Conditions Feedback */}
                <div className="rounded-2xl border border-border/80 bg-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    userP * userQ === currentQuad.c
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                      : 'border-border bg-muted/30 text-muted-foreground'
                  }`}>
                    <div>
                      <div className="text-[11px] font-bold uppercase">শর্ত ১: গুণফল p × q = c</div>
                      <div className="text-sm font-mono font-black mt-0.5">
                        {userP} × {userQ} = {userP * userQ} {userP * userQ === currentQuad.c ? '(সঠিক!)' : `(হতে হবে ${currentQuad.c})`}
                      </div>
                    </div>
                    {userP * userQ === currentQuad.c && <Check className="h-5 w-5" />}
                  </div>

                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    userP + userQ === currentQuad.b
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                      : 'border-border bg-muted/30 text-muted-foreground'
                  }`}>
                    <div>
                      <div className="text-[11px] font-bold uppercase">শর্ত ২: যোগফল p + q = b</div>
                      <div className="text-sm font-mono font-black mt-0.5">
                        {userP} + ({userQ}) = {userP + userQ} {userP + userQ === currentQuad.b ? '(সঠিক!)' : `(হতে হবে ${currentQuad.b})`}
                      </div>
                    </div>
                    {userP + userQ === currentQuad.b && <Check className="h-5 w-5" />}
                  </div>
                </div>

                {/* Success Announcement */}
                {isFactoredCorrect && (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center space-y-2 animate-in zoom-in-95">
                    <div className="text-xs font-bold uppercase text-emerald-500 tracking-wider">
                      {isBn ? 'অভিনন্দন! উৎপাদক সঠিক হয়েছে!' : 'Factorization Complete!'}
                    </div>
                    <div className="text-2xl font-mono font-black text-emerald-400">
                      {currentQuad.expr} = (x {userP >= 0 ? `+ ${userP}` : `- ${Math.abs(userP)}`})(x {userQ >= 0 ? `+ ${userQ}` : `- ${Math.abs(userQ)}`})
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 4: REMAINDER THEOREM MACHINE                        */}
            {/* ========================================================= */}
            {activeQuest === 'remainder_machine' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500">
                        Quest 4
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথড ল্যাব' : 'Remainder Theorem & Vanishing Root'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'x এর এমন একটি মান ডায়াল করো যেন f(x) = 0 হয়ে যায় (ভ্যানিশ করে)। তাহলেই সাধারণ উৎপাদক পাওয়া যাবে।'
                        : 'Dial values for x to discover when f(x) vanishes to 0, revealing the polynomial factor.'}
                    </p>
                  </div>
                </div>

                {/* Polynomial Machine Card */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    বহুপদী রাশি
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-primary">
                    f(x) = x³ - x - 6
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="text-xs font-bold text-muted-foreground mr-2">x এর মান পরীক্ষা করো:</span>
                    {[-3, -2, -1, 1, 2, 3].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleTestRoot(val)}
                        className={`h-10 w-10 rounded-xl font-mono font-black text-sm transition-all ${
                          testRoot === val
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30'
                            : 'bg-muted/80 text-foreground hover:bg-muted'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Evaluation Display */}
                <div className={`rounded-2xl border p-6 text-center space-y-3 transition-all ${
                  vanished
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-border/60 bg-muted/20'
                }`}>
                  <div className="text-xs font-bold uppercase text-muted-foreground">
                    মান বসিয়ে গণনা:
                  </div>
                  <div className="font-mono text-lg sm:text-xl font-bold text-foreground">
                    f({testRoot}) = ({testRoot})³ - ({testRoot}) - 6 = {testRoot ** 3} - {testRoot} - 6 ={' '}
                    <span className={vanished ? 'text-emerald-500 font-black text-2xl' : 'text-rose-500 font-bold'}>
                      {evalCubic(testRoot)}
                    </span>
                  </div>

                  {vanished ? (
                    <div className="space-y-2 pt-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-500">
                        <Check className="h-4 w-4" />
                        <span>ভ্যানিশ হয়েছে! f(2) = 0</span>
                      </div>
                      <div className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                        যেহেতু <RenderMathText text="$f(2) = 0$" />, সুতরাং ভাগশেষ উপপাদ্য অনুযায়ী{' '}
                        <strong className="text-foreground">(x - 2)</strong> রাশিটি <RenderMathText text="$f(x)$" /> এর একটি সাধারণ উৎপাদক!
                      </div>
                      <div className="p-3 bg-card rounded-xl border border-border/50 font-mono text-xs text-primary max-w-md mx-auto">
                        x³ - x - 6 = (x - 2)(x² + 2x + 3)
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      {isBn
                        ? `f(${testRoot}) ≠ 0, তাই (x ${testRoot > 0 ? `- ${testRoot}` : `+ ${Math.abs(testRoot)}`}) উৎপাদক নয়। অন্য মান পরখ করো!`
                        : `f(${testRoot}) ≠ 0, not a root. Try another value!`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 5: 60-SECOND ALGEBRA FORMULA BOSS RUSH              */}
            {/* ========================================================= */}
            {activeQuest === 'boss' && (
              <div className="space-y-6">
                {!bossActive && !bossGameOver && (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-5 rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-card">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                      <Flame className="h-8 w-8" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-2xl font-black text-foreground">
                        {isBn ? '৬০ সেকেন্ডের বীজগণিত বস ফাইট!' : '60-Second Algebra Formula Boss Rush!'}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {isBn
                          ? 'এসএসসি বোর্ড পরীক্ষায় আসা ৬টি দ্রুত সমাধানযোগ্য এমসিকিউ ও জ্ঞানমূলক প্রশ্ন। সঠিক উত্তরে স্ট্রিক পয়েন্ট বোনাস পাবে!'
                          : '6 authentic SSC board algebra questions. Answer quickly to build streak multipliers before time expires!'}
                      </p>
                    </div>
                    <button
                      onClick={startBossRush}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                    >
                      <Play className="h-4 w-4" />
                      <span>{isBn ? 'বস ফাইট শুরু করুন' : 'Start Boss Battle'}</span>
                    </button>
                  </div>
                )}

                {bossActive && !bossGameOver && (
                  <div className="space-y-6">
                    {/* Boss HUD (Timer, Score, Streak) */}
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 font-black">
                          {bossTimeLeft}s
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase text-muted-foreground">
                            {isBn ? 'সময় বাকি' : 'Time Left'}
                          </div>
                          <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-amber-500 transition-all duration-1000"
                              style={{ width: `${(bossTimeLeft / 60) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-[11px] font-bold uppercase text-muted-foreground">
                            {isBn ? 'স্ট্রিক' : 'Streak'}
                          </div>
                          <div className="text-sm font-black text-amber-500">
                            {bossStreak}x
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] font-bold uppercase text-muted-foreground">
                            {isBn ? 'স্কোর' : 'Score'}
                          </div>
                          <div className="text-lg font-black text-primary">
                            {bossScore}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-6">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>প্রশ্ন {bossCurrentQ + 1} / {BOSS_QUESTIONS.length}</span>
                        <span>{isBn ? 'বীজগণিত অধ্যায় ৩' : 'Algebra Chapter 3'}</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-foreground">
                        {isBn
                          ? BOSS_QUESTIONS[bossCurrentQ].questionBn
                          : BOSS_QUESTIONS[bossCurrentQ].questionEn}
                      </h4>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(isBn
                          ? BOSS_QUESTIONS[bossCurrentQ].optionsBn
                          : BOSS_QUESTIONS[bossCurrentQ].optionsEn
                        ).map((opt, optIdx) => {
                          const isSelected = bossSelectedOption === optIdx;
                          const isCorrect = optIdx === BOSS_QUESTIONS[bossCurrentQ].correctIdx;

                          let btnStyle = 'border-border/70 bg-card hover:border-primary/40 text-foreground';
                          if (bossIsAnswered) {
                            if (isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-500 font-bold';
                            } else if (isSelected) {
                              btnStyle = 'border-red-500 bg-red-500/20 text-red-500 font-bold';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleBossAnswer(optIdx)}
                              disabled={bossIsAnswered}
                              className={`rounded-xl border p-4 text-left text-sm transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Instant Explanation Feedback */}
                      {bossIsAnswered && (
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1">
                          <div className="font-bold text-primary">
                            {isBn ? 'বোর্ড ব্যাখ্যা:' : 'Board Explanation:'}
                          </div>
                          <div className="text-muted-foreground">
                            {isBn
                              ? BOSS_QUESTIONS[bossCurrentQ].explanationBn
                              : BOSS_QUESTIONS[bossCurrentQ].explanationEn}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {bossGameOver && (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-5 rounded-2xl border border-primary/30 bg-card">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 shadow">
                      <Award className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-foreground">
                        {isBn ? 'অভিনন্দন! চ্যালেঞ্জ সমাপ্ত!' : 'Challenge Completed!'}
                      </h4>
                      <p className="text-sm font-bold text-amber-500">
                        {isBn ? `তোমার মোট স্কোর: ${bossScore} পয়েন্ট` : `Final Score: ${bossScore} points`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isBn
                          ? 'তুমি "বীজগণিত অধিনায়ক (Master of Algebra)" ব্যাজ অর্জন করেছো!'
                          : 'You unlocked the "Master of Algebra" badge!'}
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
      <SheruCompanion
        currentQuestTitle={currentQuestData}
        chapterName="Chapter 3: Algebraic Expressions (বীজগাণিতিক রাশি)"
        greetingBn="আরে দোস্ত! আমি তোমার গণিত খেলার সাথী **শেরু**। অধ্যায় ৩: বীজগাণিতিক রাশি নিয়ে কোনো দ্বিধা থাকলে আমাকে যেকোনো প্রশ্ন করো!"
        greetingEn="Hey! I am **Sheru**, your math buddy. Stuck on Algebraic Expressions? Ask me anything!"
        presetQuestions={CHAPTER_3_PRESETS}
      />
    </div>
  );
}
