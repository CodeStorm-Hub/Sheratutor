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
  Cog,
  RefreshCw,
  Binary,
  GitBranch,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { SheruCompanion } from './SheruCompanion';
import { SetsFunctionsBoardGuide } from './SetsFunctionsBoardGuide';

type QuestId = 'venn' | 'power_set' | 'demorgan' | 'function_machine' | 'boss';

interface BossQuestion {
  questionBn: string;
  questionEn: string;
  mathPrompt?: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIdx: number;
  explanationBn: string;
  explanationEn: string;
}

const BOSS_QUESTIONS: BossQuestion[] = [
  {
    questionBn: 'A = {1, 2, 3} হলে P(A) এর প্রকৃত উপসেট সংখ্যা কত?',
    questionEn: 'If A = {1, 2, 3}, what is the number of PROPER subsets of P(A)?',
    optionsBn: ['৬', '৭', '৮', '৯'],
    optionsEn: ['6', '7', '8', '9'],
    correctIdx: 1,
    explanationBn: 'উপাদান সংখ্যা n = 3 হলে মোট উপসেট 2³ = 8 টি। প্রকৃত উপসেটের ক্ষেত্রে মূল সেটটি বাদ যায়, তাই 2³ - 1 = 7 টি!',
    explanationEn: 'For n = 3, total subsets = 2³ = 8. Excluding the set itself gives 2³ - 1 = 7 proper subsets!',
  },
  {
    questionBn: 'f(x) = x² - 4x + 3 হলে f(-1) এর মান কত?',
    questionEn: 'If f(x) = x² - 4x + 3, what is the value of f(-1)?',
    optionsBn: ['০', '৬', '৮', '-২'],
    optionsEn: ['0', '6', '8', '-2'],
    correctIdx: 2,
    explanationBn: 'f(-1) = (-1)² - 4(-1) + 3 = 1 + 4 + 3 = 8!',
    explanationEn: 'f(-1) = (-1)² - 4(-1) + 3 = 1 + 4 + 3 = 8!',
  },
  {
    questionBn: 'A = {x ∈ ℕ : x² < 17} সেটটিকে তালিকা পদ্ধতিতে প্রকাশ করলে কোনটি সঠিক?',
    questionEn: 'Expressing A = {x ∈ ℕ : x² < 17} in Tabular/Roster form yields:',
    optionsBn: ['{1, 2, 3}', '{1, 2, 3, 4}', '{0, 1, 2, 3, 4}', '{-4, -3, -2, -1, 0, 1, 2, 3, 4}'],
    optionsEn: ['{1, 2, 3}', '{1, 2, 3, 4}', '{0, 1, 2, 3, 4}', '{-4, -3, -2, -1, 0, 1, 2, 3, 4}'],
    correctIdx: 1,
    explanationBn: 'স্বাভাবিক সংখ্যা ℕ = {1, 2, 3, 4, ...}। 1²=1, 2²=4, 3²=9, 4²=16 (< 17), কিন্তু 5²=25 (> 17)। সুতরাং A = {1, 2, 3, 4}!',
    explanationEn: 'Natural numbers start from 1. 1²=1, 2²=4, 3²=9, 4²=16 (< 17), while 5²=25 (> 17). Thus A = {1, 2, 3, 4}!',
  },
  {
    questionBn: 'A ∩ B = ∅ হলে A ও B পরস্পর কী সেট?',
    questionEn: 'If A ∩ B = ∅, what are sets A and B called with respect to each other?',
    optionsBn: ['পূরক সেট (Complement Sets)', 'নিশ্ছেদ সেট (Disjoint Sets)', 'সার্বিক সেট (Universal Sets)', 'শক্তি সেট (Power Sets)'],
    optionsEn: ['Complement Sets', 'Disjoint Sets', 'Universal Sets', 'Power Sets'],
    correctIdx: 1,
    explanationBn: 'দুটি সেটের সাধারণ উপাদান না থাকলে (ছেদ সেট ফাঁকা হলে) তারা পরস্পর নিশ্ছেদ সেট (Disjoint Sets)!',
    explanationEn: 'When two sets share no common elements (intersection is empty), they are Disjoint Sets!',
  },
  {
    questionBn: 'f(x) = (2x + 1)/(2x - 1) হলে f(1/x) এর মান কত?',
    questionEn: 'If f(x) = (2x + 1)/(2x - 1), what is f(1/x)?',
    optionsBn: ['(2 + x)/(2 - x)', '(2 - x)/(2 + x)', '(x + 2)/(x - 2)', '১'],
    optionsEn: ['(2 + x)/(2 - x)', '(2 - x)/(2 + x)', '(x + 2)/(x - 2)', '1'],
    correctIdx: 0,
    explanationBn: 'f(1/x) = [2(1/x) + 1] / [2(1/x) - 1] = [(2 + x)/x] / [(2 - x)/x] = (2 + x)/(2 - x)!',
    explanationEn: 'f(1/x) = [2(1/x) + 1] / [2(1/x) - 1] = [(2 + x)/x] / [(2 - x)/x] = (2 + x)/(2 - x)!',
  },
  {
    questionBn: '(x - 1, 3) = (2, y + 1) হলে (x, y) এর মান কোনটি?',
    questionEn: 'If (x - 1, 3) = (2, y + 1), what is the ordered pair (x, y)?',
    optionsBn: ['(3, 2)', '(1, 4)', '(3, 4)', '(2, 3)'],
    optionsEn: ['(3, 2)', '(1, 4)', '(3, 4)', '(2, 3)'],
    correctIdx: 0,
    explanationBn: 'ক্রমজোড়ের শর্তানুসারে: x - 1 = 2 => x = 3; এবং y + 1 = 3 => y = 2। সুতরাং (x, y) = (3, 2)!',
    explanationEn: 'By ordered pair equality: x - 1 = 2 => x = 3; and y + 1 = 3 => y = 2. So (x, y) = (3, 2)!',
  },
];

const CHAPTER_2_PRESETS = [
  'সেট ও উপসেটের মধ্যে পার্থক্য কী?',
  'P(A) তে উপাদান সংখ্যা 2^n কেন হয়?',
  'দ্য মরগ্যানের সূত্র কীভাবে প্রমাণ করব?',
  'অন্বয় আর ফাংশন এর পার্থক্য কী?',
  'ডোমেন ও রেঞ্জ সহজে কীভাবে বের করব?',
];

export function SetsFunctionsPlayground() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [viewMode, setViewMode] = useState<'sandbox' | 'board_guide'>('sandbox');
  const [activeQuest, setActiveQuest] = useState<QuestId>('venn');
  const [starsEarned, setStarsEarned] = useState<Record<QuestId, boolean>>({
    venn: false,
    power_set: false,
    demorgan: false,
    function_machine: false,
    boss: false,
  });

  // ===================== Quest 1: Venn Sandbox State =====================
  type VennOp = 'union' | 'intersection' | 'diff_A_B' | 'diff_B_A' | 'comp_union' | 'comp_intersection' | 'sym_diff' | 'disjoint';
  const [vennOp, setVennOp] = useState<VennOp>('intersection');
  const [testedVennOps, setTestedVennOps] = useState<Set<string>>(new Set(['intersection']));

  // Sets data for Venn
  const universalSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const defaultA = [1, 2, 3, 4, 6];
  const defaultB = [3, 4, 5, 6, 7];

  const handleSelectVennOp = (op: VennOp) => {
    setVennOp(op);
    const updated = new Set(testedVennOps);
    updated.add(op);
    setTestedVennOps(updated);
    if (updated.size >= 4) {
      setStarsEarned((prev) => ({ ...prev, venn: true }));
    }
  };

  // Determine active regions based on operation
  const isLeftOnlyActive = ['union', 'diff_A_B', 'sym_diff'].includes(vennOp);
  const isMiddleActive = ['union', 'intersection'].includes(vennOp);
  const isRightOnlyActive = ['union', 'diff_B_A', 'sym_diff'].includes(vennOp);
  const isOutsideActive = ['comp_union', 'comp_intersection'].includes(vennOp);

  // Computed results for Venn
  const getVennResultElements = () => {
    if (vennOp === 'union') return [1, 2, 3, 4, 5, 6, 7];
    if (vennOp === 'intersection') return [3, 4, 6];
    if (vennOp === 'diff_A_B') return [1, 2];
    if (vennOp === 'diff_B_A') return [5, 7];
    if (vennOp === 'comp_union') return [8, 9, 10];
    if (vennOp === 'comp_intersection') return [1, 2, 5, 7, 8, 9, 10];
    if (vennOp === 'sym_diff') return [1, 2, 5, 7];
    if (vennOp === 'disjoint') return [];
    return [];
  };

  // ===================== Quest 2: Power Set State =====================
  const [powerSetN, setPowerSetN] = useState<number>(3);
  const fullElements = ['a', 'b', 'c', 'd'];
  const currentElements = fullElements.slice(0, powerSetN);

  // Generate subsets
  const generateSubsets = (arr: string[]): string[][] => {
    let result: string[][] = [[]];
    for (const elem of arr) {
      const more = result.map((sub) => [...sub, elem]);
      result = [...result, ...more];
    }
    return result;
  };

  const allSubsets = generateSubsets(currentElements);
  const [selectedSubsetFilter, setSelectedSubsetFilter] = useState<'all' | number>('all');

  const filteredSubsets = selectedSubsetFilter === 'all'
    ? allSubsets
    : allSubsets.filter((s) => s.length === selectedSubsetFilter);

  const handlePowerSetChange = (n: number) => {
    setPowerSetN(n);
    setSelectedSubsetFilter('all');
    setStarsEarned((prev) => ({ ...prev, power_set: true }));
  };

  // ===================== Quest 3: De Morgan State =====================
  const [deMorganRule, setDeMorganRule] = useState<1 | 2>(1);
  const [deMorganStep, setDeMorganStep] = useState<number>(2); // 1 = inner, 2 = complement verified
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(true);

  const handleVerifyDeMorgan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);
      setStarsEarned((prev) => ({ ...prev, demorgan: true }));
    }, 700);
  };

  // ===================== Quest 4: Function Machine State =====================
  type FuncType = 'linear' | 'quadratic' | 'rational';
  const [funcType, setFuncType] = useState<FuncType>('linear');
  const [machineInput, setMachineInput] = useState<number>(2);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [machineOutput, setMachineOutput] = useState<number | string | null>(5);
  const [processedLog, setProcessedLog] = useState<{ x: number; y: number | string; func: FuncType }[]>([
    { x: 1, y: 3, func: 'linear' },
    { x: 2, y: 5, func: 'linear' },
  ]);
  const [machineError, setMachineError] = useState<string | null>(null);

  const calculateOutput = (x: number, fn: FuncType): { val: number | string; err: string | null } => {
    if (fn === 'linear') {
      // f(x) = 2x + 1
      return { val: 2 * x + 1, err: null };
    }
    if (fn === 'quadratic') {
      // f(x) = x^2 - 3
      return { val: x * x - 3, err: null };
    }
    if (fn === 'rational') {
      // f(x) = (x + 1) / (x - 2)
      if (x === 2) {
        return {
          val: 'অসংজ্ঞায়িত (Undefined)',
          err: isBn
            ? 'সতর্কতা! x = 2 বসালে হর 0 হয়ে যায়! তাই x = 2 ডোমেনের বাইরে (x ≠ 2)!'
            : 'Division by zero! Denominator becomes 0 when x = 2. So x = 2 is excluded from Domain!',
        };
      }
      const raw = (x + 1) / (x - 2);
      return { val: Number.isInteger(raw) ? raw : raw.toFixed(2), err: null };
    }
    return { val: 0, err: null };
  };

  const handleFeedMachine = () => {
    setIsProcessing(true);
    setMachineError(null);

    setTimeout(() => {
      const res = calculateOutput(machineInput, funcType);
      setIsProcessing(false);
      setMachineOutput(res.val);
      setMachineError(res.err);

      setProcessedLog((prev) => [
        { x: machineInput, y: res.val, func: funcType },
        ...prev.slice(0, 5),
      ]);

      setStarsEarned((prev) => ({ ...prev, function_machine: true }));
    }, 500);
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
    venn: isBn ? 'ভেনচিত্র দ্বীপ ও সেট অপারেশন ল্যাব' : 'Venn Island & Set Operations Lab',
    power_set: isBn ? 'শক্তি সেট ও উপসেট শাখা (2^n ফর্মুলা)' : 'Power Set & 2^n Tree Generator',
    demorgan: isBn ? 'দ্য মরগ্যানের সূত্র আয়না (De Morgan Dual Mirror)' : "De Morgan's Laws Dual Mirror",
    function_machine: isBn ? 'ফাংশন মেশিন ও ডোমেন-রেঞ্জ কনভেয়ার' : 'Function Machine & Domain Conveyor',
    boss: isBn ? '৬০ সেকেন্ডের সেট ও ফাংশন বস ফাইট' : '60s Sets & Functions Boss Rush',
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
            <span className="text-primary font-bold">{isBn ? 'অধ্যায় ২' : 'Chapter 2'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <span>{isBn ? 'অধ্যায় ২: সেট ও ফাংশন (Sets & Functions)' : 'Chapter 2: Sets & Functions'}</span>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-500 border border-indigo-500/20">
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
        <SetsFunctionsBoardGuide />
      ) : (
        <>
          {/* Quest Selector Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[
              {
                id: 'venn' as QuestId,
                titleBn: '১. ভেনচিত্র দ্বীপ',
                titleEn: '1. Venn Island',
                descBn: 'ইউনিয়ন, ইন্টারসেকশন ও অন্তর',
                descEn: 'Union, Intersect & Diff',
                icon: Layers,
              },
              {
                id: 'power_set' as QuestId,
                titleBn: '২. শক্তি সেট (2ⁿ শাখা)',
                titleEn: '2. Power Set (2ⁿ)',
                descBn: 'উপসেট জেনারেটর ও প্রমাণ',
                descEn: 'Subsets & Combinations',
                icon: GitBranch,
              },
              {
                id: 'demorgan' as QuestId,
                titleBn: '৩. দ্য মরগ্যান আয়না',
                titleEn: '3. De Morgan Mirror',
                descBn: 'ডুয়াল ক্যানভাস সমতুল্যতা',
                descEn: 'Dual Canvas Equivalence',
                icon: Binary,
              },
              {
                id: 'function_machine' as QuestId,
                titleBn: '৪. ফাংশন মেশিন',
                titleEn: '4. Function Machine',
                descBn: 'ডোমেন, রেঞ্জ ও কনভেয়ার',
                descEn: 'Domain, Range & Chute',
                icon: Cog,
              },
              {
                id: 'boss' as QuestId,
                titleBn: '৫. বস ফাইট (৬০ সে)',
                titleEn: '5. Boss Rush (60s)',
                descBn: 'দ্রুত বোর্ড এমসিকিউ চ্যালেঞ্জ',
                descEn: 'Speed Board MCQ Battle',
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
            {/* QUEST 1: VENN ISLAND SANDBOX                              */}
            {/* ========================================================= */}
            {activeQuest === 'venn' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500">
                        Quest 1
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'ভেনচিত্র দ্বীপ (Venn Island Operations Lab)' : 'Venn Island Operations Lab'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'নিচের অপারেশনগুলোতে ক্লিক করে ভেনচিত্রে সেটের অংশগুলো আলোকিত করো এবং ফলাফল পর্যবেক্ষণ করো।'
                        : 'Select boolean set operations to highlight Venn regions dynamically and inspect formula equality.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-xl border border-border/50 text-xs">
                    <span className="text-muted-foreground font-semibold px-2">
                      {isBn ? 'অন্বেষণ:' : 'Explored:'}
                    </span>
                    <span className="font-black text-primary">{testedVennOps.size}/4</span>
                    {starsEarned.venn && (
                      <span className="text-emerald-500 font-bold ml-1">✓ Star Earned</span>
                    )}
                  </div>
                </div>

                {/* Operations Selector Chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'union' as VennOp, labelBn: 'A ∪ B (সংযোগ)', labelEn: 'A ∪ B (Union)' },
                    { id: 'intersection' as VennOp, labelBn: 'A ∩ B (ছেদ)', labelEn: 'A ∩ B (Intersection)' },
                    { id: 'diff_A_B' as VennOp, labelBn: 'A \\ B (A বাদ B)', labelEn: 'A \\ B (Diff A - B)' },
                    { id: 'diff_B_A' as VennOp, labelBn: 'B \\ A (B বাদ A)', labelEn: 'B \\ A (Diff B - A)' },
                    { id: 'comp_union' as VennOp, labelBn: '(A ∪ B)′ (পূরক)', labelEn: '(A ∪ B)′ (Complement)' },
                    { id: 'comp_intersection' as VennOp, labelBn: '(A ∩ B)′', labelEn: '(A ∩ B)′' },
                    { id: 'sym_diff' as VennOp, labelBn: 'A Δ B (প্রতিসম অন্তর)', labelEn: 'A Δ B (Sym Diff)' },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => handleSelectVennOp(op.id)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                        vennOp === op.id
                          ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                          : 'bg-muted/70 text-foreground hover:bg-muted border border-border/50'
                      }`}
                    >
                      {isBn ? op.labelBn : op.labelEn}
                    </button>
                  ))}
                </div>

                {/* Venn Diagram Canvas + Math Data Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left SVG Interactive Canvas */}
                  <div className="lg:col-span-7 bg-muted/20 rounded-2xl border border-border/60 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <svg
                      viewBox="0 0 500 320"
                      className="w-full max-w-[460px] h-auto drop-shadow-sm select-none"
                    >
                      <defs>
                        {/* Glow Filter */}
                        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="6" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Universal Set Rectangle */}
                      <rect
                        x="10"
                        y="10"
                        width="480"
                        height="300"
                        rx="16"
                        className={`transition-colors duration-300 ${
                          isOutsideActive
                            ? 'fill-indigo-500/25 stroke-indigo-500 stroke-2'
                            : 'fill-background/40 stroke-border stroke-1'
                        }`}
                      />
                      <text
                        x="28"
                        y="38"
                        className="text-xs font-black fill-muted-foreground select-none"
                      >
                        সার্বিক সেট U
                      </text>

                      {/* Elements outside A and B */}
                      <g className="fill-foreground font-mono text-[13px] font-bold">
                        <text x="50" y="270">8</text>
                        <text x="430" y="55">9</text>
                        <text x="435" y="270">10</text>
                      </g>

                      {/* Left Circle A Only Region (Crescent) */}
                      {/* Circle A center: 200, 160, r: 100. Circle B center: 300, 160, r: 100 */}
                      <path
                        d="M 250,73.4 A 100 100 0 1 0 250,246.6 A 100 100 0 0 1 250,73.4 Z"
                        className={`transition-all duration-300 ${
                          isLeftOnlyActive
                            ? 'fill-primary/40 stroke-primary stroke-2'
                            : 'fill-primary/5 stroke-primary/30 stroke-1'
                        }`}
                      />

                      {/* Intersection Middle Lens */}
                      <path
                        d="M 250,73.4 A 100 100 0 0 1 250,246.6 A 100 100 0 0 1 250,73.4 Z"
                        className={`transition-all duration-300 ${
                          isMiddleActive
                            ? 'fill-amber-400/50 stroke-amber-500 stroke-2'
                            : 'fill-amber-400/5 stroke-amber-400/30 stroke-1'
                        }`}
                      />

                      {/* Right Circle B Only Region (Crescent) */}
                      <path
                        d="M 250,73.4 A 100 100 0 0 0 250,246.6 A 100 100 0 1 1 250,73.4 Z"
                        className={`transition-all duration-300 ${
                          isRightOnlyActive
                            ? 'fill-emerald-500/40 stroke-emerald-500 stroke-2'
                            : 'fill-emerald-500/5 stroke-emerald-500/30 stroke-1'
                        }`}
                      />

                      {/* Circle Outlines for visual clarity */}
                      <circle
                        cx="200"
                        cy="160"
                        r="100"
                        fill="none"
                        className="stroke-primary/50 stroke-2"
                        strokeDasharray="4 2"
                      />
                      <circle
                        cx="300"
                        cy="160"
                        r="100"
                        fill="none"
                        className="stroke-emerald-500/50 stroke-2"
                        strokeDasharray="4 2"
                      />

                      {/* Circle Labels */}
                      <text
                        x="150"
                        y="85"
                        className="text-sm font-extrabold fill-primary select-none"
                      >
                        সেট A
                      </text>
                      <text
                        x="325"
                        y="85"
                        className="text-sm font-extrabold fill-emerald-500 select-none"
                      >
                        সেট B
                      </text>

                      {/* Elements inside A only */}
                      <g className="fill-foreground font-mono text-[14px] font-bold">
                        <text x="145" y="145">1</text>
                        <text x="165" y="185">2</text>
                      </g>

                      {/* Elements in Intersection A ∩ B */}
                      <g className="fill-amber-500 font-mono text-[14px] font-black">
                        <text x="245" y="130">3</text>
                        <text x="245" y="165">4</text>
                        <text x="245" y="200">6</text>
                      </g>

                      {/* Elements inside B only */}
                      <g className="fill-foreground font-mono text-[14px] font-bold">
                        <text x="325" y="145">5</text>
                        <text x="345" y="185">7</text>
                      </g>
                    </svg>

                    <div className="mt-3 text-[11px] text-muted-foreground text-center">
                      {isBn
                        ? 'আলোকিত অঞ্চল নির্দেশ করে নির্বাচিত অপারেশনের উপাদানসমূহ।'
                        : 'Shaded neon regions indicate the active elements of the chosen set operation.'}
                    </div>
                  </div>

                  {/* Right Formula & Elements Inspector */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {isBn ? 'ফলাফল উপাদান তালিকা' : 'Resulting Set Elements'}
                      </div>

                      <div className="text-xl font-mono font-black text-primary bg-primary/10 rounded-xl p-3 border border-primary/20">
                        {'{ ' + getVennResultElements().join(', ') + ' }'}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {isBn ? 'উপাদান সংখ্যা:' : 'Element Count:'}{' '}
                        <span className="font-bold text-foreground">
                          n = {getVennResultElements().length}
                        </span>
                      </div>
                    </div>

                    {/* NCTB Formula Verifier Card */}
                    <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 space-y-3 text-xs">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>{isBn ? 'NCTB সূত্র যাচাই (Formula Proof)' : 'NCTB Formula Verification'}</span>
                      </div>

                      <div className="space-y-1.5 font-mono text-muted-foreground">
                        <div>n(A) = 5, n(B) = 5</div>
                        <div>n(A ∩ B) = 3</div>
                        <div className="pt-2 border-t border-border/50 text-foreground font-bold">
                          n(A ∪ B) = n(A) + n(B) - n(A ∩ B)
                        </div>
                        <div className="text-primary font-bold">
                          7 = 5 + 5 - 3 = 7 (সত্যান্বিত!)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 2: POWER SET 2^n GENERATOR                          */}
            {/* ========================================================= */}
            {activeQuest === 'power_set' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500">
                        Quest 2
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'শক্তি সেট ও উপসেট শাখা (2ⁿ জেনারেটর)' : 'Power Set 2ⁿ Combinatorial Tree'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'উপাদান সংখ্যা (n) পরিবর্তন করে দেখাও যে P(A)-এর মোট উপসেট সংখ্যা কীভাবে সর্বদা 2ⁿ নিয়ম মেনে চলে।'
                        : 'Adjust element count (n) to visually verify how P(A) strictly satisfies the 2ⁿ rule.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">
                      {isBn ? 'উপাদান সংখ্যা n:' : 'Elements n:'}
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => handlePowerSetChange(num)}
                          className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                            powerSetN === num
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Stats Display */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1">
                    <div className="text-[11px] font-bold uppercase text-muted-foreground">
                      {isBn ? 'মূল সেট A' : 'Base Set A'}
                    </div>
                    <div className="text-lg font-mono font-black text-foreground">
                      {'{ ' + currentElements.join(', ') + ' }'}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1">
                    <div className="text-[11px] font-bold uppercase text-muted-foreground">
                      {isBn ? 'উপাদান সংখ্যা n' : 'Elements (n)'}
                    </div>
                    <div className="text-lg font-mono font-black text-primary">
                      n = {powerSetN}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1">
                    <div className="text-[11px] font-bold uppercase text-muted-foreground">
                      {isBn ? 'শক্তি সেট P(A) এর আকার' : 'Subsets Count'}
                    </div>
                    <div className="text-lg font-mono font-black text-emerald-500">
                      2^{powerSetN} = {Math.pow(2, powerSetN)} টি
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-1">
                    <div className="text-[11px] font-bold uppercase text-muted-foreground">
                      {isBn ? 'প্রকৃত উপসেট' : 'Proper Subsets'}
                    </div>
                    <div className="text-lg font-mono font-black text-amber-500">
                      2^{powerSetN} - 1 = {Math.pow(2, powerSetN) - 1} টি
                    </div>
                  </div>
                </div>

                {/* Subsets By Cardinality Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="font-bold text-muted-foreground whitespace-nowrap">
                    {isBn ? 'উপাদান সংখ্যা অনুযায়ী ফিল্টার:' : 'Filter by size:'}
                  </span>
                  <button
                    onClick={() => setSelectedSubsetFilter('all')}
                    className={`rounded-lg px-2.5 py-1 font-bold ${
                      selectedSubsetFilter === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isBn ? 'সবগুলো' : 'All'} ({allSubsets.length})
                  </button>
                  {Array.from({ length: powerSetN + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSubsetFilter(idx)}
                      className={`rounded-lg px-2.5 py-1 font-bold ${
                        selectedSubsetFilter === idx
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {idx} {isBn ? 'উপাদান' : 'elem'} ({allSubsets.filter((s) => s.length === idx).length})
                    </button>
                  ))}
                </div>

                {/* Subsets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                  {filteredSubsets.map((sub, idx) => {
                    const isFullSet = sub.length === currentElements.length && sub.length > 0;
                    const isEmpty = sub.length === 0;

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-3 text-center transition-all flex flex-col justify-between ${
                          isEmpty
                            ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400 font-black'
                            : isFullSet
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold'
                            : 'border-border/70 bg-card text-foreground font-medium'
                        }`}
                      >
                        <div className="font-mono text-xs sm:text-sm">
                          {isEmpty ? '∅' : `{ ${sub.join(', ')} }`}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {isEmpty
                            ? (isBn ? 'খালি সেট' : 'Empty')
                            : isFullSet
                            ? (isBn ? 'মূল সেট (অপ্রকৃত)' : 'Self (Improper)')
                            : (isBn ? 'প্রকৃত উপসেট' : 'Proper')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Formula Proof Breakdown Banner */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-primary">
                      {isBn ? 'বোর্ড পরীক্ষায় ৪ নম্বরের উত্তর কৌশল:' : 'Board Exam 4-Mark Answering Formula:'}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-mono">
                      {Array.from({ length: powerSetN + 1 })
                        .map((_, i) => `${i} উপাদান বিশিষ্ট উপসেট = ${allSubsets.filter((s) => s.length === i).length} টি`)
                        .join(' + ')}
                      {' = '}
                      <span className="text-foreground font-black">{Math.pow(2, powerSetN)} = 2^{powerSetN}</span>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-500 font-bold shrink-0">
                    {isBn ? 'অতএব, P(A) এর উপাদান সংখ্যা 2ⁿ কে সমর্থন করে।' : 'Thus P(A) satisfies 2ⁿ.'}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 3: DE MORGAN DUAL CANVAS MIRROR                     */}
            {/* ========================================================= */}
            {activeQuest === 'demorgan' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500">
                        Quest 3
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'দ্য মরগ্যানের সূত্র আয়না (De Morgan Dual Mirror)' : "De Morgan's Dual Canvas Mirror"}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'বামপক্ষ (LHS) এবং ডানপক্ষ (RHS) উভয় ক্যানভাসে ভেনচিত্রের ছায়াবৃত অঞ্চল পর্যবেক্ষণ করে সমতুল্যতা যাচাই করো।'
                        : 'Observe LHS and RHS dual Venn canvases side-by-side to verify geometric equivalence.'}
                    </p>
                  </div>

                  {/* Switch Rule */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setDeMorganRule(1);
                        setVerificationSuccess(true);
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        deMorganRule === 1
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isBn ? 'সূত্র ১: (A ∪ B)′ = A′ ∩ B′' : 'Rule 1: (A ∪ B)′ = A′ ∩ B′'}
                    </button>
                    <button
                      onClick={() => {
                        setDeMorganRule(2);
                        setVerificationSuccess(true);
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        deMorganRule === 2
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isBn ? 'সূত্র ২: (A ∩ B)′ = A′ ∪ B′' : 'Rule 2: (A ∩ B)′ = A′ ∪ B′'}
                    </button>
                  </div>
                </div>

                {/* Dual Canvas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Canvas: LHS */}
                  <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        {isBn ? 'বামপক্ষ (LHS)' : 'Left Hand Side'}
                      </span>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {deMorganRule === 1 ? '(A ∪ B)′' : '(A ∩ B)′'}
                      </span>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center">
                      <svg viewBox="0 0 320 200" className="w-full max-w-[280px] h-auto">
                        {/* Universal Set */}
                        <rect
                          x="5"
                          y="5"
                          width="310"
                          height="190"
                          rx="12"
                          className={
                            deMorganRule === 1
                              ? 'fill-indigo-500/30 stroke-indigo-500 stroke-2'
                              : 'fill-indigo-500/30 stroke-indigo-500 stroke-2'
                          }
                        />
                        <text x="18" y="25" className="text-[10px] font-bold fill-muted-foreground">U</text>

                        {/* If Rule 1: (A U B)' means outside both circles is shaded, circles are unshaded */}
                        {deMorganRule === 1 ? (
                          <>
                            {/* Circle A */}
                            <circle cx="120" cy="105" r="55" fill="rgb(var(--background))" className="stroke-primary stroke-2" />
                            {/* Circle B */}
                            <circle cx="200" cy="105" r="55" fill="rgb(var(--background))" className="stroke-emerald-500 stroke-2" />
                          </>
                        ) : (
                          <>
                            {/* Rule 2: (A ∩ B)' means everything EXCEPT intersection is shaded */}
                            <circle cx="120" cy="105" r="55" className="fill-indigo-500/30 stroke-primary stroke-2" />
                            <circle cx="200" cy="105" r="55" className="fill-indigo-500/30 stroke-emerald-500 stroke-2" />
                            {/* Unshade Middle Lens */}
                            <path
                              d="M 160,60 A 55 55 0 0 1 160,150 A 55 55 0 0 1 160,60 Z"
                              fill="rgb(var(--background))"
                              className="stroke-border stroke-1"
                            />
                          </>
                        )}
                        <text x="100" y="108" className="text-xs font-bold fill-foreground">A</text>
                        <text x="210" y="108" className="text-xs font-bold fill-foreground">B</text>
                      </svg>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                      {deMorganRule === 1
                        ? (isBn ? 'A এবং B উভয়ের বাইরে থাকা অঞ্চল' : 'Region outside both A and B')
                        : (isBn ? 'ছেদ বিন্দু ছাড়া সার্বিক সেটের সকল অঞ্চল' : 'All regions except intersection lens')}
                    </div>
                  </div>

                  {/* Right Canvas: RHS */}
                  <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
                        {isBn ? 'ডানপক্ষ (RHS)' : 'Right Hand Side'}
                      </span>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {deMorganRule === 1 ? 'A′ ∩ B′' : 'A′ ∪ B′'}
                      </span>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center">
                      <svg viewBox="0 0 320 200" className="w-full max-w-[280px] h-auto">
                        <rect
                          x="5"
                          y="5"
                          width="310"
                          height="190"
                          rx="12"
                          className="fill-indigo-500/30 stroke-indigo-500 stroke-2"
                        />
                        <text x="18" y="25" className="text-[10px] font-bold fill-muted-foreground">U</text>

                        {deMorganRule === 1 ? (
                          <>
                            {/* A' ∩ B' produces exact same unshaded interior */}
                            <circle cx="120" cy="105" r="55" fill="rgb(var(--background))" className="stroke-primary stroke-2" />
                            <circle cx="200" cy="105" r="55" fill="rgb(var(--background))" className="stroke-emerald-500 stroke-2" />
                          </>
                        ) : (
                          <>
                            <circle cx="120" cy="105" r="55" className="fill-indigo-500/30 stroke-primary stroke-2" />
                            <circle cx="200" cy="105" r="55" className="fill-indigo-500/30 stroke-emerald-500 stroke-2" />
                            <path
                              d="M 160,60 A 55 55 0 0 1 160,150 A 55 55 0 0 1 160,60 Z"
                              fill="rgb(var(--background))"
                              className="stroke-border stroke-1"
                            />
                          </>
                        )}
                        <text x="100" y="108" className="text-xs font-bold fill-foreground">A</text>
                        <text x="210" y="108" className="text-xs font-bold fill-foreground">B</text>
                      </svg>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                      {deMorganRule === 1
                        ? (isBn ? 'A এর পূরক ও B এর পূরকের সাধারণ এলাকা' : 'Intersection of A complement and B complement')
                        : (isBn ? 'উভয় পূরক সেটের সম্মিলিত এলাকা' : 'Union of both individual complements')}
                    </div>
                  </div>
                </div>

                {/* Verify Scanner Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-black">
                      ≡
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {isBn ? 'জ্যামিতিক প্রমাণ সম্পন্ন!' : 'Geometric Proof Verified!'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isBn
                          ? 'উভয় ভেনচিত্রে হুবহু একই অঞ্চল আবৃত হওয়ায় প্রমাণিত: LHS = RHS'
                          : 'Both Venn canvases highlight identical topological regions: LHS = RHS'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyDeMorgan}
                    disabled={isVerifying}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isVerifying ? (isBn ? 'স্ক্যান হচ্ছে...' : 'Scanning...') : (isBn ? 'সমতুল্যতা যাচাই করুন' : 'Verify Equivalence')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 4: THE FUNCTION MACHINE                             */}
            {/* ========================================================= */}
            {activeQuest === 'function_machine' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-500">
                        Quest 4
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? 'ফাংশন মেশিন ও ডোমেন-রেঞ্জ কনভেয়ার' : 'Function Machine & Domain Conveyor'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {isBn
                        ? 'ইনপুট ডোমেন থেকে মান মেশিনে প্রবেশ করিয়ে রূপান্তর পর্যবেক্ষণ করো। সতর্ক হও শূন্য দ্বারা ভাগের ক্ষেত্রে!'
                        : 'Feed domain values into the mathematical function engine to watch dynamic transformation.'}
                    </p>
                  </div>

                  {/* Function Rule Selector */}
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'linear' as FuncType, labelBn: 'f(x) = 2x + 1', labelEn: 'f(x) = 2x + 1' },
                      { id: 'quadratic' as FuncType, labelBn: 'f(x) = x² - 3', labelEn: 'f(x) = x² - 3' },
                      { id: 'rational' as FuncType, labelBn: 'f(x) = (x+1)/(x-2)', labelEn: 'f(x) = (x+1)/(x-2)' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setFuncType(f.id);
                          setMachineError(null);
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          funcType === f.id
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isBn ? f.labelBn : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Machine Simulator Viewport */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Input Domain Selector */}
                  <div className="lg:col-span-3 rounded-2xl border border-border/80 bg-card p-5 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isBn ? 'ইনপুট নির্বাচন (ডোমেন x)' : 'Input Selection (Domain x)'}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[-2, -1, 0, 1, 2, 3].map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            setMachineInput(val);
                            setMachineError(null);
                          }}
                          className={`rounded-xl py-2.5 text-sm font-black transition-all ${
                            machineInput === val
                              ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
                              : 'bg-muted/70 text-foreground hover:bg-muted'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleFeedMachine}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
                    >
                      <Zap className="h-4 w-4" />
                      <span>{isProcessing ? (isBn ? 'প্রসেস হচ্ছে...' : 'Processing...') : (isBn ? 'মেশিনে প্রবেশ করান' : 'Feed into Machine')}</span>
                    </button>
                  </div>

                  {/* Middle: The Animated Gear Machine Box */}
                  <div className="lg:col-span-6 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 via-muted/40 to-background p-6 flex flex-col items-center justify-center relative overflow-hidden text-center space-y-4">
                    <div className="flex items-center gap-4">
                      {/* Domain Input Puck */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Domain</span>
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white font-mono font-black text-lg flex items-center justify-center shadow-lg">
                          {machineInput}
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-muted-foreground animate-pulse" />

                      {/* Gear Center Engine */}
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-primary bg-card shadow-xl">
                        <Cog
                          className={`h-12 w-12 text-primary transition-all duration-700 ${
                            isProcessing ? 'animate-spin' : ''
                          }`}
                        />
                        <span className="absolute bottom-1 font-mono text-[10px] font-bold text-muted-foreground">
                          f(x)
                        </span>
                      </div>

                      <ArrowRight className="h-5 w-5 text-muted-foreground animate-pulse" />

                      {/* Range Output Puck */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Range</span>
                        <div
                          className={`min-h-[48px] px-3 rounded-2xl font-mono font-black text-sm flex items-center justify-center shadow-lg transition-all ${
                            machineError
                              ? 'bg-red-500 text-white'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {machineOutput !== null ? machineOutput : '?'}
                        </div>
                      </div>
                    </div>

                    {/* Active Formula Expression */}
                    <div className="font-mono text-sm font-bold text-foreground bg-card/80 px-4 py-1.5 rounded-full border border-border/60">
                      {funcType === 'linear' && `f(${machineInput}) = 2(${machineInput}) + 1 = ${machineOutput}`}
                      {funcType === 'quadratic' && `f(${machineInput}) = (${machineInput})² - 3 = ${machineOutput}`}
                      {funcType === 'rational' && `f(${machineInput}) = (${machineInput} + 1) / (${machineInput} - 2)`}
                    </div>

                    {/* Zero Division Error Warning */}
                    {machineError && (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500 font-semibold flex items-center gap-2 max-w-md text-left">
                        <AlertTriangleIcon className="h-4 w-4 shrink-0" />
                        <span>{machineError}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: History Log & Mapping Table */}
                  <div className="lg:col-span-3 rounded-2xl border border-border/80 bg-card p-5 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {isBn ? 'ম্যাপিং রেকর্ড (Domain ➔ Range)' : 'Mapping Table'}
                    </div>

                    <div className="space-y-1.5 font-mono text-xs max-h-[180px] overflow-y-auto">
                      {processedLog.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/40"
                        >
                          <span className="text-muted-foreground font-semibold">x = {item.x}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-primary font-bold">y = {item.y}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* QUEST 5: 60-SECOND SETS & FUNCTIONS BOSS RUSH             */}
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
                        {isBn ? '৬০ সেকেন্ডের সেট ও ফাংশন বস ফাইট!' : '60-Second Sets Boss Rush!'}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {isBn
                          ? 'এসএসসি বোর্ড পরীক্ষায় আসা ৬টি বাছাইকৃত এমসিকিউ ও জ্ঞানমূলক প্রশ্ন। সঠিক উত্তরে স্ট্রিক পয়েন্ট বোনাস পাবে!'
                          : '6 authentic SSC board CQ & MCQ questions. Build your streak multiplier before the clock runs out!'}
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
                        <span>{isBn ? 'বীজগণিত অধ্যায় ২' : 'Algebra Chapter 2'}</span>
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
                          ? 'তুমি "সেট ও ফাংশন অধিনায়ক (Master of Sets & Functions)" ব্যাজ অর্জন করেছো!'
                          : 'You unlocked the "Master of Sets & Functions" badge!'}
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
        chapterName="Chapter 2: Sets & Functions (সেট ও ফাংশন)"
        greetingBn="আরে দোস্ত! আমি তোমার গণিত খেলার সাথী **শেরু**। অধ্যায় ২: সেট ও ফাংশন নিয়ে কোনো দ্বিধা থাকলে আমাকে যেকোনো প্রশ্ন করো!"
        greetingEn="Hey! I am **Sheru**, your math buddy. Stuck on Sets & Functions? Ask me anything!"
        presetQuestions={CHAPTER_2_PRESETS}
      />
    </div>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
