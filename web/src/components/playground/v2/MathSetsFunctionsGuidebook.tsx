'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChevronRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  X,
  Send,
  Sliders,
  MessageSquare,
  ShieldCheck,
  XCircle,
  Zap,
  Activity,
  Calculator,
  AlertTriangle,
  Info,
  Binary,
  GitBranch,
  Filter,
  CheckSquare,
  ArrowUpRight,
  Grid,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';

// ---------------------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// ---------------------------------------------------------------------------

interface LessonInfo {
  id: number;
  title: string;
  subtitle: string;
  nctbPage: string;
  badge: string;
  intro: string;
}

const LAB_LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'সেট প্রকাশের পদ্ধতি ও প্রকারভেদ ল্যাব',
    subtitle: 'Set Builder vs Roster Notation & Set Types',
    nctbPage: 'পৃষ্ঠা ২৩-২৫',
    badge: 'ল্যাব ০১',
    intro:
      'সেট হলো বাস্তব বা চিন্তাজগতের সুসংজ্ঞায়িত বস্তুর সমাবেশ। সেট প্রকাশের প্রধান দুটি পদ্ধতি: তালিকা পদ্ধতি (Roster Method) ও সেট গঠন পদ্ধতি (Set-builder Method)। উপাদান সংখ্যার ওপর ভিত্তি করে সেট সসীম, অসীম অথবা ফাঁকা সেট হতে পারে।',
  },
  {
    id: 2,
    title: 'ভেনচিত্র ও সেট অপারেশন ল্যাব',
    subtitle: 'Venn Diagram, Union, Intersection & De Morgan Laws',
    nctbPage: 'পৃষ্ঠা ২৬-২৯',
    badge: 'ল্যাব ০২',
    intro:
      'জন ভেন প্রথম চিত্রের মাধ্যমে সেট প্রকাশ করেন। সার্বিক সেট U-এর অধীনে সংযোগ সেট (A ∪ B), ছেদ সেট (A ∩ B), অন্তর সেট (A \\ B) এবং পূরক সেট (A\') বোঝা যায়। দ্য মরগ্যানের সূত্রাবলী প্রমাণে ভেনচিত্র অনন্য হাতিয়ার।',
  },
  {
    id: 3,
    title: 'শক্তি সেট ও উপসেট সিমুলেটর',
    subtitle: 'Power Set P(A), Subsets & 2ⁿ Verification',
    nctbPage: 'পৃষ্ঠা ৩০-৩২',
    badge: 'ল্যাব ০৩',
    intro:
      'কোনো সেটের সকল উপসেট নিয়ে গঠিত সেটকে তার শক্তি সেট P(A) বলে। কোনো সেটের উপাদান সংখ্যা n হলে তার উপসেট সংখ্যা সর্বদা 2ⁿ এবং প্রকৃত উপসেট সংখ্যা 2ⁿ - 1। ফাঁকা সেটের উপসেট কেবল সে নিজেই।',
  },
  {
    id: 4,
    title: 'কার্তেসীয় গুণজ ও অন্বয় ল্যাব',
    subtitle: 'Cartesian Product A × B & Binary Relations',
    nctbPage: 'পৃষ্ঠা ৩৩-৩৫',
    badge: 'ল্যাব ০৪',
    intro:
      'দুটি সেটের উপাদানগুলোর সকল সম্ভাব্য ক্রমজোড় (x, y) নিয়ে গঠিত সেটকে কার্তেসীয় গুণজ A × B বলা হয়। A × B-এর যেকোনো অশূন্য উপসেট হলো A থেকে B সেটের একটি অন্বয় (Relation)। অন্বয়ের প্রথম উপাদানগুলোর সেট ডোমেন এবং দ্বিতীয় উপাদানগুলোর সেট রেঞ্জ।',
  },
  {
    id: 5,
    title: 'ফাংশন, ডোমেন ও রেঞ্জ মেশিন',
    subtitle: 'Function Definition, Machine & Domain-Range',
    nctbPage: 'পৃষ্ঠা ৩৬-৩৯',
    badge: 'ল্যাব ০৫',
    intro:
      'যদি ডোমেনের প্রতিটি সদস্যের জন্য রেঞ্জে কেবল একটিই প্রতিচ্ছবি (Image) থাকে, তবে সেই অন্বয়টিকে ফাংশন বলা হয়। ফাংশন ইনপুট-আউটপুট মেশিনে কীভাবে বীজগণিতীয় মান পরিবর্তিত হয় এবং এক-এক ফাংশন কীভাবে যাচাই করতে হয় তা জানুন।',
  },
];

export function MathSetsFunctionsGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'example' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLessonId, setActiveLessonId] = useState<number>(1);

  // -------------------------------------------------------------------------
  // LAB 1 STATE: SET BUILDER VS ROSTER
  // -------------------------------------------------------------------------
  const [lab1Preset, setLab1Preset] = useState<'even' | 'square' | 'prime' | 'factors24' | 'multiples5'>('even');
  const [lab1MaxN, setLab1MaxN] = useState<number>(10);

  const getLab1Elements = () => {
    const res: number[] = [];
    if (lab1Preset === 'even') {
      for (let i = 2; i <= lab1MaxN; i += 2) res.push(i);
    } else if (lab1Preset === 'square') {
      for (let i = 1; i * i <= lab1MaxN; i++) res.push(i * i);
    } else if (lab1Preset === 'prime') {
      const isPrime = (num: number) => {
        if (num < 2) return false;
        for (let k = 2; k * k <= num; k++) if (num % k === 0) return false;
        return true;
      };
      for (let i = 2; i <= lab1MaxN; i++) if (isPrime(i)) res.push(i);
    } else if (lab1Preset === 'factors24') {
      for (let i = 1; i <= 24; i++) {
        if (24 % i === 0 && i <= lab1MaxN) res.push(i);
      }
    } else if (lab1Preset === 'multiples5') {
      for (let i = 5; i <= lab1MaxN; i += 5) res.push(i);
    }
    return res;
  };

  const lab1Elements = getLab1Elements();

  // -------------------------------------------------------------------------
  // LAB 2 STATE: VENN DIAGRAM & SET OPERATIONS
  // -------------------------------------------------------------------------
  const [activeSetOp, setActiveSetOp] = useState<
    'union' | 'intersection' | 'diffAB' | 'diffBA' | 'compA' | 'compB' | 'demorgan1' | 'demorgan2' | 'disjoint'
  >('union');
  const [isDisjointMode, setIsDisjointMode] = useState<boolean>(false);

  const universalElements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const setA_default = isDisjointMode ? [1, 2, 3] : [1, 2, 3, 4, 5];
  const setB_default = isDisjointMode ? [6, 7, 8] : [4, 5, 6, 7, 8];

  const getSetOperationResult = () => {
    const A = setA_default;
    const B = setB_default;
    const U = universalElements;

    switch (activeSetOp) {
      case 'union':
        return Array.from(new Set([...A, ...B])).sort((a, b) => a - b);
      case 'intersection':
        return A.filter((x) => B.includes(x)).sort((a, b) => a - b);
      case 'diffAB':
        return A.filter((x) => !B.includes(x)).sort((a, b) => a - b);
      case 'diffBA':
        return B.filter((x) => !A.includes(x)).sort((a, b) => a - b);
      case 'compA':
        return U.filter((x) => !A.includes(x)).sort((a, b) => a - b);
      case 'compB':
        return U.filter((x) => !B.includes(x)).sort((a, b) => a - b);
      case 'demorgan1': {
        const uAB = Array.from(new Set([...A, ...B]));
        return U.filter((x) => !uAB.includes(x)).sort((a, b) => a - b);
      }
      case 'demorgan2': {
        const iAB = A.filter((x) => B.includes(x));
        return U.filter((x) => !iAB.includes(x)).sort((a, b) => a - b);
      }
      case 'disjoint':
        return A.filter((x) => B.includes(x));
      default:
        return [];
    }
  };

  const setOpResult = getSetOperationResult();

  // -------------------------------------------------------------------------
  // LAB 3 STATE: POWER SET SIMULATOR (P(A) & 2^n)
  // -------------------------------------------------------------------------
  const [lab3PresetSize, setLab3PresetSize] = useState<number>(3); // 0, 1, 2, 3, 4
  const lab3FullAlphabet = ['a', 'b', 'c', 'd'];
  const currentBaseElements = lab3FullAlphabet.slice(0, lab3PresetSize);

  const generateSubsets = (arr: string[]) => {
    let result: string[][] = [[]];
    for (const elem of arr) {
      const next: string[][] = [];
      for (const cur of result) {
        next.push(cur);
        next.push([...cur, elem]);
      }
      result = next;
    }
    // Sort by length
    return result.sort((a, b) => a.length - b.length);
  };

  const currentSubsets = generateSubsets(currentBaseElements);
  const totalSubsetsCount = Math.pow(2, lab3PresetSize);
  const properSubsetsCount = Math.max(0, totalSubsetsCount - 1);

  // -------------------------------------------------------------------------
  // LAB 4 STATE: CARTESIAN PRODUCT & RELATIONS
  // -------------------------------------------------------------------------
  const lab4SetA = [1, 2, 3];
  const lab4SetB = [2, 3, 4];
  const [lab4RelationFilter, setLab4RelationFilter] = useState<'all' | 'y_eq_x_plus_1' | 'x_lt_y' | 'y_eq_2x' | 'x_ge_y'>('y_eq_x_plus_1');

  const allCartesianPairs = lab4SetA.flatMap((x) => lab4SetB.map((y) => ({ x, y })));

  const filteredRelationPairs = allCartesianPairs.filter(({ x, y }) => {
    if (lab4RelationFilter === 'all') return true;
    if (lab4RelationFilter === 'y_eq_x_plus_1') return y === x + 1;
    if (lab4RelationFilter === 'x_lt_y') return x < y;
    if (lab4RelationFilter === 'y_eq_2x') return y === 2 * x;
    if (lab4RelationFilter === 'x_ge_y') return x >= y;
    return true;
  });

  const relationDomain = Array.from(new Set(filteredRelationPairs.map((p) => p.x))).sort((a, b) => a - b);
  const relationRange = Array.from(new Set(filteredRelationPairs.map((p) => p.y))).sort((a, b) => a - b);

  // -------------------------------------------------------------------------
  // LAB 5 STATE: FUNCTION MACHINE & ONE-TO-ONE
  // -------------------------------------------------------------------------
  const [funcChoice, setFuncChoice] = useState<'linear' | 'quadratic' | 'rational'>('quadratic');
  const [funcInputX, setFuncInputX] = useState<number>(2);

  const calculateFunctionOutput = (x: number) => {
    if (funcChoice === 'linear') {
      return { val: 2 * x + 1, formulaText: `2(${x}) + 1 = ${2 * x + 1}` };
    }
    if (funcChoice === 'quadratic') {
      const val = x * x - 4 * x + 3;
      return { val, formulaText: `(${x})² - 4(${x}) + 3 = ${x * x} - ${4 * x} + 3 = ${val}` };
    }
    // rational: (2x + 1)/(2x - 1)
    if (2 * x - 1 === 0) {
      return { val: NaN, formulaText: 'অসংজ্ঞায়িত (Denominator is 0!)' };
    }
    const num = 2 * x + 1;
    const den = 2 * x - 1;
    const val = num / den;
    return { val: Number(val.toFixed(2)), formulaText: `[2(${x}) + 1] / [2(${x}) - 1] = ${num} / ${den} = ${Number(val.toFixed(2))}` };
  };

  const funcOutput = calculateFunctionOutput(funcInputX);

  // -------------------------------------------------------------------------
  // STEP 2: SEE EXAMPLE (WORKED CQs & EXAMINER SECRETS)
  // -------------------------------------------------------------------------
  const [activeCqId, setActiveCqId] = useState<number>(1);
  const [expandedRubric, setExpandedRubric] = useState<boolean>(false);
  const [copiedCq, setCopiedCq] = useState<number | null>(null);

  const handleCopyCq = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCq(id);
    setTimeout(() => setCopiedCq(null), 2000);
  };

  // -------------------------------------------------------------------------
  // STEP 3: TRY YOURSELF CHALLENGES
  // -------------------------------------------------------------------------
  const [ch1Answer, setCh1Answer] = useState<string>('');
  const [ch1Result, setCh1Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch2Answer, setCh2Answer] = useState<string>('');
  const [ch2Result, setCh2Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch3Answer, setCh3Answer] = useState<string>('');
  const [ch3Result, setCh3Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // -------------------------------------------------------------------------
  // STEP 4: CHECK UNDERSTANDING (MCQs)
  // -------------------------------------------------------------------------
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const QUIZ_QUESTIONS = [
    {
      id: 1,
      q: 'A ∩ B = ∅ হলে A ও B পরস্পর কী ধরনের সেট?',
      options: ['পূরক সেট (Complement Sets)', 'নিশ্ছেদ সেট (Disjoint Sets)', 'সার্বিক সেট (Universal Sets)', 'শক্তি সেট (Power Sets)'],
      correct: 1,
      explanation: 'দুটি সেটের সাধারণ উপাদান না থাকলে (ছেদ সেট ফাঁকা সেট হলে) তারা পরস্পর নিশ্ছেদ সেট (Disjoint Sets)।',
    },
    {
      id: 2,
      q: 'A = {1, 2, 3} হলে P(A) এর প্রকৃত উপসেট (Proper Subsets) সংখ্যা কত?',
      options: ['৬', '৭', '৮', '৯'],
      correct: 1,
      explanation: 'উপাদান সংখ্যা n = 3 হলে মোট উপসেট 2³ = 8 টি। মূল সেটটি বাদ দিলে প্রকৃত উপসেট সংখ্যা = 2³ - 1 = 7 টি!',
    },
    {
      id: 3,
      q: '(x - 1, 3) = (2, y + 1) হলে (x, y) এর মান কোনটি?',
      options: ['(3, 2)', '(1, 4)', '(3, 4)', '(2, 3)'],
      correct: 0,
      explanation: 'ক্রমজোড়ের সংজ্ঞানুসারে: x - 1 = 2 ⇒ x = 3; এবং y + 1 = 3 ⇒ y = 2। সুতরাং (x, y) = (3, 2)।',
    },
    {
      id: 4,
      q: 'f(x) = (2x + 1)/(2x - 1) হলে f(1/x) এর সরলীকৃত মান কোনটি?',
      options: ['(2 + x)/(2 - x)', '(2 - x)/(2 + x)', '(x + 2)/(x - 2)', '১'],
      correct: 0,
      explanation: 'f(1/x) = [2(1/x) + 1] / [2(1/x) - 1] = [(2 + x)/x] / [(2 - x)/x] = (2 + x)/(2 - x)।',
    },
    {
      id: 5,
      q: 'নিচের কোন অন্বয়টি ফাংশন নির্দেশ করে না?',
      options: ['{(1, 2), (2, 3), (3, 4)}', '{(1, 2), (2, 2), (3, 2)}', '{(1, 2), (1, 3), (2, 4)}', '{(0, 0), (1, 1), (2, 2)}'],
      correct: 2,
      explanation: '{(1, 2), (1, 3), (2, 4)} অন্বয়ে একই প্রথম উপাদান 1 এর জন্য দুটি ভিন্ন দ্বিতীয় উপাদান 2 ও 3 রয়েছে। তাই এটি ফাংশন নয়!',
    },
  ];

  // -------------------------------------------------------------------------
  // STEP 5: CHEAT SHEET COPY
  // -------------------------------------------------------------------------
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // AI TUTOR DRAWER STATE
  // -------------------------------------------------------------------------
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiChatResponses, setAiChatResponses] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [aiChatQuery, setAiChatQuery] = useState<string>('');

  const handleAskPreset = (question: string, answer: string) => {
    setAiChatResponses((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text: answer },
    ]);
  };

  const handleSendCustomAi = () => {
    if (!aiChatQuery.trim()) return;
    const query = aiChatQuery;
    setAiChatQuery('');

    let reply = `সেট ও ফাংশন সংক্রান্ত তোমার প্রশ্নটি দারুণ! "${query}" বিষয়ে মনে রাখবে: এনসিটিবি পাঠ্যপুস্তক অনুযায়ী সেট গঠন পদ্ধতিতে চলকের শর্ত এবং সার্বিক সেটের আওতা সুনির্দিষ্ট থাকে। কোনো সেটের উপাদান সংখ্যা n হলে উপসেট 2ⁿ এবং প্রকৃত উপসেট 2ⁿ - 1। ফাংশন হতে হলে প্রতিটি ডোমেন উপাদানের একক প্রতিচ্ছবি থাকতে হবে।`;
    if (query.includes('মরগান') || query.includes('De Morgan')) {
      reply = 'দ্য মরগ্যানের ১ম সূত্র: (A ∪ B)\' = A\' ∩ B\' এবং ২য় সূত্র: (A ∩ B)\' = A\' ∪ B\'। ভেনচিত্রে উভয় পাশের ছায়াঘেরা অঞ্চল সমতুল্য দেখিয়ে এটি খুব সহজে প্রমাণ করা যায়!';
    } else if (query.includes('ফাঁকা') || query.includes('empty')) {
      reply = 'ফাঁকা সেটকে ∅ বা {} দ্বারা প্রকাশ করা হয়। কখনো {∅} লেখা যাবে না, কারণ {∅} হলো ১টি উপাদান বিশিষ্ট সেট যার উপাদান ∅!';
    } else if (query.includes('ফাংশন') || query.includes('function')) {
      reply = 'একটি অন্বয় তখনই ফাংশন যখন তার কোনো দুটি ভিন্ন ক্রোমজোড়ের প্রথম উপাদান একই হয় না। অর্থাৎ প্রতিটি ইনপুটের জন্য অনন্য একটি আউটপুট থাকে!';
    }

    setAiChatResponses((prev) => [
      ...prev,
      { role: 'user', text: query },
      { role: 'assistant', text: reply },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#FF6B57]/30 selection:text-white">
      {/* --------------------------------------------------------------------- */}
      {/* HEADER & TOP BAR */}
      {/* --------------------------------------------------------------------- */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/playground/v2?subject=math"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
            >
              <RotateCcw className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-[#FF6B57]">
                <span>সাধারণ গণিত</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
                <span>অধ্যায় ০২</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>সেট ও ফাংশন</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#FF6B57]/10 text-[#FF6B57] border border-[#FF6B57]/20">
                  NCTB ৯ম-১০ম
                </span>
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FF6B57]/10 hover:bg-[#FF6B57]/20 border border-[#FF6B57]/30 text-[#FF6B57] text-xs font-medium transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">শেরু এআই টিউটর</span>
            </button>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* 5-STEP NAVIGATION BAR */}
      {/* --------------------------------------------------------------------- */}
      <nav className="border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'learn', no: '১', label: 'ধারণা শিখুন', icon: BookOpen },
              { id: 'example', no: '২', label: 'উদাহরণ দেখুন (CQ)', icon: Award },
              { id: 'try', no: '৩', label: 'নিজে চেষ্টা করুন', icon: Sliders },
              { id: 'quiz', no: '৪', label: 'জ্ঞান যাচাই (MCQ)', icon: HelpCircle },
              { id: 'summary', no: '৫', label: 'সারাংশ ও সূত্র', icon: CheckSquare },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id as any)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#FF6B57] text-white shadow-lg shadow-[#FF6B57]/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.no}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN BODY AREA */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* =================================================================== */}
        {/* TAB 1: LEARN CONCEPT (5 INTERACTIVE SUB-LABS)                       */}
        {/* =================================================================== */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Sub-lab selector strip */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
              {LAB_LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                    activeLessonId === lesson.id
                      ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57]'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{lesson.badge}</span>
                  <span>{lesson.title}</span>
                </button>
              ))}
            </div>

            {/* Lesson Intro Card */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-[#FF6B57]/10 text-[#FF6B57] font-mono text-[10px]">
                    {LAB_LESSONS[activeLessonId - 1].badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    এনসিটিবি {LAB_LESSONS[activeLessonId - 1].nctbPage}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-100">{LAB_LESSONS[activeLessonId - 1].title}</h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {LAB_LESSONS[activeLessonId - 1].intro}
                </p>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* LAB 1: SET NOTATIONS & TYPES                                    */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#FF6B57]" />
                      <span>সেট গঠন শর্ত ফিল্টার ও রূপান্তরক</span>
                    </h3>

                    {/* Presets */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 block">শর্ত নির্বাচন করুন:</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: 'even', label: 'জোড় স্বাভাবিক সংখ্যা' },
                          { id: 'square', label: 'পূর্ণবর্গ সংখ্যা (x² ≤ N)' },
                          { id: 'prime', label: 'মৌলিক সংখ্যা (Prime)' },
                          { id: 'factors24', label: '২৪-এর গুণনীয়ক' },
                          { id: 'multiples5', label: '৫-এর গুণিতক' },
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setLab1Preset(p.id as any)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              lab1Preset === p.id
                                ? 'bg-[#FF6B57]/10 border-[#FF6B57] text-[#FF6B57] font-medium'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Slider for N */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>সর্বোচ্চ সীমা (N):</span>
                        <span className="font-mono text-[#FF6B57] font-bold">{lab1MaxN}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="35"
                        value={lab1MaxN}
                        onChange={(e) => setLab1MaxN(Number(e.target.value))}
                        className="w-full accent-[#FF6B57] bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Set Builder Representation */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        সেট গঠন পদ্ধতি (Set-Builder Notation):
                      </span>
                      <div className="text-sm font-mono text-emerald-400">
                        {lab1Preset === 'even' && (
                          <RenderMathText text={`$A = \\{x \\in \\mathbb{N} : x \\text{ জোড় সংখ্যা এবং } x \\le ${lab1MaxN}\\}$`} />
                        )}
                        {lab1Preset === 'square' && (
                          <RenderMathText text={`$A = \\{x \\in \\mathbb{N} : x^2 \\le ${lab1MaxN}\\}$`} />
                        )}
                        {lab1Preset === 'prime' && (
                          <RenderMathText text={`$A = \\{x \\in \\mathbb{N} : x \\text{ মৌলিক সংখ্যা এবং } x \\le ${lab1MaxN}\\}$`} />
                        )}
                        {lab1Preset === 'factors24' && (
                          <RenderMathText text={`$A = \\{x \\in \\mathbb{N} : x, 24\\text{-এর গুণনীয়ক এবং } x \\le ${lab1MaxN}\\}$`} />
                        )}
                        {lab1Preset === 'multiples5' && (
                          <RenderMathText text={`$A = \\{x \\in \\mathbb{N} : x, 5\\text{-এর গুণিতক এবং } x \\le ${lab1MaxN}\\}$`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Generated Roster Elements & Types */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Grid className="w-4 h-4 text-cyan-400" />
                        <span>তালিকা পদ্ধতি (Roster Method) রূপান্তর</span>
                      </h3>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-mono">
                        উপাদান সংখ্যা n(A) = {lab1Elements.length}
                      </span>
                    </div>

                    {/* Display Elements */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-2">
                        উদ্ভুত তালিকা সেট:
                      </span>
                      {lab1Elements.length === 0 ? (
                        <div className="text-sm font-mono text-amber-400 flex items-center gap-2">
                          <span>A = ∅</span>
                          <span className="text-xs text-slate-400">(ফাঁকা সেট — কোনো উপাদান নেই)</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {lab1Elements.map((val) => (
                            <span
                              key={val}
                              className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-700/50 text-cyan-200 text-sm font-mono font-bold"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 text-xs font-mono text-slate-400">
                        গাণিতিক রূপ:{' '}
                        <span className="text-slate-200">
                          {`A = { ${lab1Elements.join(', ') || '∅'} }`}
                        </span>
                      </div>
                    </div>

                    {/* Set Types Quick Reference */}
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                        <span className="font-bold text-emerald-400 block">সসীম সেট (Finite)</span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          যার উপাদান সংখ্যা গণনা করে নির্ধারণ করা যায়। যেমন: A = {`{1, 2, 3}`}।
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                        <span className="font-bold text-indigo-400 block">অসীম সেট (Infinite)</span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          যার উপাদান সংখ্যা গণনা করে শেষ করা যায় না। যেমন: ℕ = {`{1, 2, 3, ...}`}।
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                        <span className="font-bold text-amber-400 block">ফাঁকা সেট (Empty Set)</span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          যে সেটের কোনো উপাদান নেই। প্রকাশ: ∅ বা {`{}`} (কখনো {`{∅}`} নয়!)
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1">
                        <span className="font-bold text-pink-400 block">সার্বিক সেট (Universal)</span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          আলোচনাধীন সকল সেট যদি একটি নির্দিষ্ট সেটের উপসেট হয়, তাকে সার্বিক সেট U বলে।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 2: VENN DIAGRAM & SET OPERATIONS                            */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        সেট অপারেশন কন্ট্রোল
                      </span>
                      <button
                        onClick={() => setIsDisjointMode(!isDisjointMode)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                          isDisjointMode
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isDisjointMode ? 'নিশ্ছেদ মোড: চালু' : 'নিশ্ছেদ মোড: বন্ধ'}
                      </button>
                    </h3>

                    {/* Given sets overview */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                      <div className="text-slate-400">
                        সার্বিক সেট <span className="text-slate-200">U = {`{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}`}</span>
                      </div>
                      <div className="text-emerald-400">
                        সেট A = {`{${setA_default.join(', ')}}`}
                      </div>
                      <div className="text-sky-400">
                        সেট B = {`{${setB_default.join(', ')}}`}
                      </div>
                    </div>

                    {/* Operation buttons */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[11px] text-slate-400 block mb-1">অপারেশন বেছে নিন:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'union', label: 'A ∪ B (সংযোগ)', desc: 'উভয় সেটের সব উপাদান' },
                          { id: 'intersection', label: 'A ∩ B (ছেদ)', desc: 'সাধারণ উপাদান' },
                          { id: 'diffAB', label: 'A \\ B (অন্তর A - B)', desc: 'A তে আছে কিন্তু B তে নেই' },
                          { id: 'diffBA', label: 'B \\ A (অন্তর B - A)', desc: 'B তে আছে কিন্তু A তে নেই' },
                          { id: 'compA', label: "A' (পূরক U \\ A)", desc: 'U তে আছে কিন্তু A তে নেই' },
                          { id: 'compB', label: "B' (পূরক U \\ B)", desc: 'U তে আছে কিন্তু B তে নেই' },
                          { id: 'demorgan1', label: "(A ∪ B)' = A' ∩ B'", desc: 'দ্য মরগানের ১ম সূত্র' },
                          { id: 'demorgan2', label: "(A ∩ B)' = A' ∪ B'", desc: 'দ্য মরগানের ২য় সূত্র' },
                        ].map((op) => (
                          <button
                            key={op.id}
                            onClick={() => setActiveSetOp(op.id as any)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              activeSetOp === op.id
                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="block">{op.label}</span>
                            <span className="text-[10px] text-slate-500 block font-normal">{op.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: SVG Venn Diagram & Live Operation Output */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">লাইভ ভেনচিত্র সিমুলেশন</h3>
                      <span className="text-xs font-mono text-emerald-400">
                        ফলাফল উপাদান সংখ্যা = {setOpResult.length}
                      </span>
                    </div>

                    {/* SVG Diagram */}
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-center">
                      <svg viewBox="0 0 500 280" className="w-full max-w-lg h-auto select-none font-mono">
                        {/* Universal Set Rectangle */}
                        <rect
                          x="20"
                          y="20"
                          width="460"
                          height="240"
                          rx="16"
                          className={`stroke-2 transition-colors duration-300 ${
                            activeSetOp === 'compA' ||
                            activeSetOp === 'compB' ||
                            activeSetOp === 'demorgan1' ||
                            activeSetOp === 'demorgan2'
                              ? 'fill-slate-800/70 stroke-slate-600'
                              : 'fill-slate-900/40 stroke-slate-700'
                          }`}
                        />
                        <text x="36" y="44" className="fill-slate-400 text-xs font-bold font-mono">
                          U (সার্বিক সেট)
                        </text>

                        {/* Venn Circles: Connected or Disjoint */}
                        {isDisjointMode ? (
                          <>
                            {/* Circle A (Disjoint) */}
                            <circle
                              cx="150"
                              cy="140"
                              r="80"
                              className={`stroke-2 transition-all duration-300 ${
                                activeSetOp === 'union' || activeSetOp === 'diffAB'
                                  ? 'fill-emerald-500/25 stroke-emerald-400'
                                  : 'fill-slate-900/60 stroke-slate-700'
                              }`}
                            />
                            <text x="100" y="80" className="fill-emerald-400 font-bold text-xs">
                              A
                            </text>
                            <text x="140" y="145" className="fill-emerald-200 text-xs">
                              1, 2, 3
                            </text>

                            {/* Circle B (Disjoint) */}
                            <circle
                              cx="350"
                              cy="140"
                              r="80"
                              className={`stroke-2 transition-all duration-300 ${
                                activeSetOp === 'union' || activeSetOp === 'diffBA'
                                  ? 'fill-sky-500/25 stroke-sky-400'
                                  : 'fill-slate-900/60 stroke-slate-700'
                              }`}
                            />
                            <text x="380" y="80" className="fill-sky-400 font-bold text-xs">
                              B
                            </text>
                            <text x="340" y="145" className="fill-sky-200 text-xs">
                              6, 7, 8
                            </text>

                            {/* Outside elements */}
                            <text x="50" y="230" className="fill-slate-500 text-xs">
                              4, 5, 9, 10
                            </text>
                          </>
                        ) : (
                          <>
                            {/* Circle A Overlapping */}
                            <circle
                              cx="200"
                              cy="140"
                              r="90"
                              className={`stroke-2 transition-all duration-300 ${
                                activeSetOp === 'union' ||
                                activeSetOp === 'diffAB' ||
                                (activeSetOp === 'demorgan2' && true)
                                  ? 'fill-emerald-500/20 stroke-emerald-400'
                                  : 'fill-slate-900/40 stroke-slate-700'
                              }`}
                            />
                            <text x="135" y="75" className="fill-emerald-400 font-bold text-xs">
                              A
                            </text>

                            {/* Circle B Overlapping */}
                            <circle
                              cx="300"
                              cy="140"
                              r="90"
                              className={`stroke-2 transition-all duration-300 ${
                                activeSetOp === 'union' ||
                                activeSetOp === 'diffBA' ||
                                (activeSetOp === 'demorgan2' && true)
                                  ? 'fill-sky-500/20 stroke-sky-400'
                                  : 'fill-slate-900/40 stroke-slate-700'
                              }`}
                            />
                            <text x="350" y="75" className="fill-sky-400 font-bold text-xs">
                              B
                            </text>

                            {/* Elements: A only */}
                            <text x="150" y="145" className="fill-emerald-200 text-xs font-mono font-bold">
                              1, 2, 3
                            </text>

                            {/* Elements: Intersection (A ∩ B) */}
                            <rect
                              x="225"
                              y="110"
                              width="50"
                              height="60"
                              rx="8"
                              className={`transition-colors ${
                                activeSetOp === 'intersection' || activeSetOp === 'union'
                                  ? 'fill-amber-500/30 stroke stroke-amber-400'
                                  : 'fill-transparent'
                              }`}
                            />
                            <text x="238" y="145" className="fill-amber-300 text-xs font-mono font-bold">
                              4, 5
                            </text>

                            {/* Elements: B only */}
                            <text x="325" y="145" className="fill-sky-200 text-xs font-mono font-bold">
                              6, 7, 8
                            </text>

                            {/* Outside elements: (A ∪ B)' */}
                            <text x="50" y="240" className="fill-slate-500 text-xs font-mono">
                              9, 10
                            </text>
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Result Output Card */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">অপারেশনের ফলাফল:</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {`{ ${setOpResult.join(', ') || '∅'} }`}
                        </span>
                      </div>

                      {activeSetOp === 'demorgan1' && (
                        <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed">
                          <strong className="text-amber-400">দ্য মরগ্যানের ১ম সূত্র প্রমাণ:</strong>
                          <div className="font-mono text-[11px] mt-1 space-y-0.5 text-slate-300">
                            <div>• বামপক্ষ: (A ∪ B)' = U \ (A ∪ B) = {`{9, 10}`}</div>
                            <div>• ডানপক্ষ: A' ∩ B' = {`{6, 7, 8, 9, 10}`} ∩ {`{1, 2, 3, 9, 10}`} = {`{9, 10}`}</div>
                            <div className="text-emerald-400 font-bold">⇒ (A ∪ B)' = A' ∩ B' (প্রমাণিত!)</div>
                          </div>
                        </div>
                      )}

                      {activeSetOp === 'demorgan2' && (
                        <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed">
                          <strong className="text-amber-400">দ্য মরগ্যানের ২য় সূত্র প্রমাণ:</strong>
                          <div className="font-mono text-[11px] mt-1 space-y-0.5 text-slate-300">
                            <div>• বামপক্ষ: (A ∩ B)' = U \ {`{4, 5}`} = {`{1, 2, 3, 6, 7, 8, 9, 10}`}</div>
                            <div>• ডানপক্ষ: A' ∪ B' = {`{6, 7, 8, 9, 10}`} ∪ {`{1, 2, 3, 9, 10}`} = {`{1, 2, 3, 6, 7, 8, 9, 10}`}</div>
                            <div className="text-emerald-400 font-bold">⇒ (A ∩ B)' = A' ∪ B' (প্রমাণিত!)</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 3: POWER SET & 2^n SUBSETS SIMULATOR                        */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Binary className="w-4 h-4 text-[#FF6B57]" />
                      শক্তি সেট কনফিগারেটর
                    </h3>

                    {/* Presets for set size */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 block">
                        মূল সেট A-এর উপাদান সংখ্যা (n):
                      </label>
                      <div className="grid grid-cols-5 gap-2 text-xs font-mono">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            onClick={() => setLab3PresetSize(n)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              lab3PresetSize === n
                                ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57] font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            n = {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Base set A preview */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs text-slate-400">
                        মূল সেট <span className="font-bold text-slate-200">A</span>:
                      </div>
                      <div className="text-base font-mono text-[#FF6B57] font-bold">
                        {lab3PresetSize === 0 ? 'A = ∅ (বা {})' : `A = { ${currentBaseElements.join(', ')} }`}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        উপাদান সংখ্যা n = {lab3PresetSize}
                      </div>
                    </div>

                    {/* Mathematical Proof Box */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <span className="font-bold text-emerald-400 block">উপপাদ্য যাচাই (2ⁿ Law):</span>
                      <div className="space-y-1 font-mono text-slate-300">
                        <div>
                          • মোট উপসেট সংখ্যা = 2ⁿ = 2^{lab3PresetSize} ={' '}
                          <span className="text-emerald-400 font-bold">{totalSubsetsCount}</span> টি
                        </div>
                        <div>
                          • প্রকৃত উপসেট সংখ্যা = 2ⁿ - 1 = {totalSubsetsCount} - 1 ={' '}
                          <span className="text-amber-400 font-bold">{properSubsetsCount}</span> টি
                        </div>
                      </div>
                    </div>

                    {/* Examiner Warning Alert */}
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5 text-xs text-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="block text-amber-300">পরীক্ষকের ট্র্যাপ অ্যালার্ট:</strong>
                        ∅ সেটের শক্তি সেট <RenderMathText text="$P(\\emptyset) = \\{\\emptyset\\}$" />। এর উপাদান সংখ্যা{' '}
                        <RenderMathText text="$2^0 = 1$" /> টি! ফাঁকা সেট নিজেই নিজের একমাত্র উপসেট।
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Subsets List & Power Set String */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">
                        শক্তি সেট P(A)-এর সকল উপসেট ({totalSubsetsCount} টি)
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        n = {lab3PresetSize}
                      </span>
                    </div>

                    {/* Subsets Grid */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 max-h-80 overflow-y-auto">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {currentSubsets.map((sub, idx) => {
                          const isImproper = sub.length === lab3PresetSize && lab3PresetSize > 0;
                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border font-mono text-xs flex flex-col justify-between ${
                                isImproper
                                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
                              }`}
                            >
                              <span className="font-bold">
                                {sub.length === 0 ? '∅' : `{ ${sub.join(', ')} }`}
                              </span>
                              <span className="text-[10px] text-slate-500 mt-1">
                                {sub.length === 0
                                  ? 'ফাঁকা উপসেট'
                                  : isImproper
                                  ? 'অপ্রকৃত উপসেট (মূল সেট)'
                                  : 'প্রকৃত উপসেট'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Power set formal notation */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        P(A) এর আনুষ্ঠানিক সেট রূপ:
                      </span>
                      <div className="text-xs font-mono text-emerald-400 break-words leading-relaxed">
                        P(A) = {'{ '}
                        {currentSubsets
                          .map((s) => (s.length === 0 ? '∅' : `{${s.join(', ')}}`))
                          .join(', ')}
                        {' }'}
                      </div>
                      <span className="text-[11px] text-slate-400 block pt-1">
                        ⚠️ লক্ষ্য করো: পুরো শক্তি সেটের উপাদানগুলোকে আবদ্ধ করতে বাইরে দ্বিতীয় বন্ধনী {`{ }`} দেওয়া
                        বাধ্যতামূলক!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 4: CARTESIAN PRODUCT & RELATIONS                            */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      কার্তেসীয় গুণজ ও অন্বয় ফিল্টার
                    </h3>

                    {/* Given sets info */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                      <div>A = {`{1, 2, 3}`} (ডোমেন সেট)</div>
                      <div>B = {`{2, 3, 4}`} (কো-ডোমেন সেট)</div>
                      <div className="text-slate-400">
                        A × B মোট ক্রমজোড় = 3 × 3 = <span className="text-cyan-400 font-bold">9</span> টি
                      </div>
                    </div>

                    {/* Relation condition options */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 block">অন্বয়ের শর্ত (Relation Condition):</label>
                      <div className="space-y-2 text-xs">
                        {[
                          { id: 'y_eq_x_plus_1', label: 'R₁: y = x + 1', desc: 'দ্বিতীয় পদ প্রথম পদ থেকে ১ বেশি' },
                          { id: 'x_lt_y', label: 'R₂: x < y', desc: 'প্রথম পদ দ্বিতীয় পদের চেয়ে ছোট' },
                          { id: 'y_eq_2x', label: 'R₃: y = 2x', desc: 'দ্বিতীয় পদ প্রথম পদের দ্বিগুণ' },
                          { id: 'x_ge_y', label: 'R₄: x ≥ y', desc: 'প্রথম পদ দ্বিতীয় পদের সমান বা বড়' },
                          { id: 'all', label: 'সম্পূর্ণ A × B (সকল ক্রমজোড়)', desc: 'কোনো শর্ত ছাড়া কার্তেসীয় গুণজ' },
                        ].map((rel) => (
                          <button
                            key={rel.id}
                            onClick={() => setLab4RelationFilter(rel.id as any)}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                              lab4RelationFilter === rel.id
                                ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="block font-mono">{rel.label}</span>
                            <span className="text-[10px] text-slate-500 block font-normal">{rel.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Relation Pairs, Domain, Range, and Bipartite Mapping */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">অন্বয় ফলাফল ও দ্বিপাক্ষিক ম্যাপিং</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-mono">
                        ক্রমজোড় সংখ্যা = {filteredRelationPairs.length}
                      </span>
                    </div>

                    {/* Filtered Ordered Pairs */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        অন্বয় R তালিকা পদ্ধতি:
                      </span>
                      <div className="text-sm font-mono text-cyan-300 font-bold">
                        R = {'{ '}
                        {filteredRelationPairs.map((p) => `(${p.x}, ${p.y})`).join(', ') || '∅'}
                        {' }'}
                      </div>
                    </div>

                    {/* Domain & Range cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          ডোমেন (Dom R):
                        </span>
                        <div className="text-sm font-mono text-emerald-400 font-bold">
                          {`{ ${relationDomain.join(', ') || '∅'} }`}
                        </div>
                        <span className="text-[10px] text-slate-500 block">ক্রমজোড়গুলোর ১ম উপাদান</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          রেঞ্জ (Range R):
                        </span>
                        <div className="text-sm font-mono text-pink-400 font-bold">
                          {`{ ${relationRange.join(', ') || '∅'} }`}
                        </div>
                        <span className="text-[10px] text-slate-500 block">ক্রমজোড়গুলোর ২য় উপাদান</span>
                      </div>
                    </div>

                    {/* Bipartite Arrow Diagram SVG */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-2">
                        তীরচিহ্ন ম্যাপিং চিত্র (Arrow Diagram):
                      </span>
                      <svg viewBox="0 0 400 160" className="w-full h-auto select-none font-mono">
                        {/* Domain A Ellipse */}
                        <ellipse cx="80" cy="80" rx="40" ry="65" className="fill-slate-900/60 stroke-2 stroke-emerald-500/50" />
                        <text x="75" y="25" className="fill-emerald-400 font-bold text-xs">
                          A
                        </text>
                        {lab4SetA.map((x, idx) => (
                          <text key={x} x="75" y={55 + idx * 30} className="fill-slate-200 text-xs font-bold">
                            {x}
                          </text>
                        ))}

                        {/* Co-Domain B Ellipse */}
                        <ellipse cx="320" cy="80" rx="40" ry="65" className="fill-slate-900/60 stroke-2 stroke-sky-500/50" />
                        <text x="315" y="25" className="fill-sky-400 font-bold text-xs">
                          B
                        </text>
                        {lab4SetB.map((y, idx) => (
                          <text key={y} x="315" y={55 + idx * 30} className="fill-slate-200 text-xs font-bold">
                            {y}
                          </text>
                        ))}

                        {/* Arrows for filtered pairs */}
                        {filteredRelationPairs.map((p, idx) => {
                          const xIdx = lab4SetA.indexOf(p.x);
                          const yIdx = lab4SetB.indexOf(p.y);
                          const startY = 52 + xIdx * 30;
                          const endY = 52 + yIdx * 30;
                          return (
                            <g key={idx}>
                              <line
                                x1="95"
                                y1={startY}
                                x2="300"
                                y2={endY}
                                className="stroke-cyan-400 stroke-2"
                                strokeDasharray="3 3"
                              />
                              <circle cx="300" cy={endY} r="3" className="fill-cyan-400" />
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 5: FUNCTION, DOMAIN & RANGE MACHINE                         */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-pink-400" />
                      ফাংশন নির্বাচন ও ইনপুট কন্ট্রোল
                    </h3>

                    {/* Formula selector */}
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 block">ফাংশন সূত্র নির্ধারণ করুন:</label>
                      <div className="space-y-2 text-xs">
                        {[
                          { id: 'linear', label: 'f(x) = 2x + 1', desc: 'সরলরৈখিক ফাংশন (Linear)' },
                          { id: 'quadratic', label: 'f(x) = x² - 4x + 3', desc: 'দ্বিঘাত ফাংশন (Quadratic)' },
                          { id: 'rational', label: 'f(x) = (2x + 1)/(2x - 1)', desc: 'বোর্ড স্ট্যান্ডার্ড ভগ্নাংশ' },
                        ].map((fn) => (
                          <button
                            key={fn.id}
                            onClick={() => setFuncChoice(fn.id as any)}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                              funcChoice === fn.id
                                ? 'bg-pink-950/40 border-pink-500 text-pink-200 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="block font-mono">{fn.label}</span>
                            <span className="text-[10px] text-slate-500 block font-normal">{fn.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input x slider */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>ইনপুট চলক (x):</span>
                        <span className="font-mono text-pink-400 font-bold">{funcInputX}</span>
                      </div>
                      <input
                        type="range"
                        min="-3"
                        max="5"
                        step="1"
                        value={funcInputX}
                        onChange={(e) => setFuncInputX(Number(e.target.value))}
                        className="w-full accent-pink-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>-3</span>
                        <span>0</span>
                        <span>5</span>
                      </div>
                    </div>

                    {/* Quick values buttons */}
                    <div className="flex gap-2">
                      {[-2, -1, 0, 1, 2, 3].map((val) => (
                        <button
                          key={val}
                          onClick={() => setFuncInputX(val)}
                          className={`flex-1 py-1 rounded-lg border text-xs font-mono transition-colors ${
                            funcInputX === val
                              ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Function Machine Animation & Vertical Line Concept */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200">লাইভ ফাংশন ইনপুট-আউটপুট মেশিন</h3>

                    {/* Machine Box Visualization */}
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
                      {/* Input funnel */}
                      <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className="text-slate-400">ইনপুট:</span>
                        <span className="px-3 py-1 rounded-lg bg-pink-950/60 border border-pink-700 text-pink-300 font-bold">
                          x = {funcInputX}
                        </span>
                      </div>

                      <div className="w-0.5 h-6 bg-pink-500" />

                      {/* Processing Machine Box */}
                      <div className="w-full max-w-sm p-4 rounded-2xl bg-gradient-to-r from-pink-950/30 via-slate-900 to-purple-950/30 border border-pink-500/40 text-center space-y-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-pink-400 block font-bold">
                          FUNCTION PROCESSOR ENGINE
                        </span>
                        <div className="text-sm font-mono text-slate-200">
                          {funcChoice === 'linear' && 'f(x) = 2x + 1'}
                          {funcChoice === 'quadratic' && 'f(x) = x² - 4x + 3'}
                          {funcChoice === 'rational' && 'f(x) = (2x + 1)/(2x - 1)'}
                        </div>
                        <div className="text-xs font-mono text-pink-300 bg-slate-950/80 p-2 rounded-xl border border-pink-900/50">
                          {funcOutput.formulaText}
                        </div>
                      </div>

                      <div className="w-0.5 h-6 bg-emerald-500" />

                      {/* Output result */}
                      <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className="text-slate-400">আউটপুট:</span>
                        <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700 text-emerald-300 font-bold">
                          f({funcInputX}) = {Number.isNaN(funcOutput.val) ? 'Undefined' : funcOutput.val}
                        </span>
                      </div>
                    </div>

                    {/* Function vs Relation Cardinal Rule */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        অন্বয় কখন ফাংশন হয়? (The Mother-Child Analogy)
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        ডোমেনের প্রতিটি সদস্যকে যদি 'সন্তান' এবং রেঞ্জের সদস্যকে 'মা' হিসেবে কল্পনা করি: একাধিক সন্তানের এক মা
                        হতে পারে (যেমন: f(-1) = 8 এবং f(5) = 8), কিন্তু এক সন্তানের দুই মা থাকা বাস্তবসম্মত নয়! তাই
                        একই প্রথম উপাদানের একাধিক দ্বিতীয় উপাদান থাকলে তা কখনো ফাংশন হতে পারে না।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: SEE EXAMPLE (WORKED CQs & EXAMINER SECRETS)                  */}
        {/* =================================================================== */}
        {activeTab === 'example' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FF6B57]" />
                  বোর্ড সৃজনশীল প্রশ্ন (CQ) ও পরীক্ষকের সিক্রেট রুব্রিক
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  বোর্ড পরীক্ষায় ২ + ৪ + ৪ নম্বর বিভাজনের আদর্শ খাতা উপস্থাপন এবং শিক্ষক যেভাবে নম্বর কাটেন।
                </p>
              </div>

              {/* CQ Switcher */}
              <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 1, title: 'CQ ১: দ্য মরগ্যান ও 2ⁿ' },
                  { id: 2, title: 'CQ ২: অন্বয় ও ডোমেন-রেঞ্জ' },
                  { id: 3, title: 'CQ ৩: f(1/x) ভগ্নাংশ' },
                ].map((cq) => (
                  <button
                    key={cq.id}
                    onClick={() => setActiveCqId(cq.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCqId === cq.id
                        ? 'bg-[#FF6B57] text-white font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cq.title}
                  </button>
                ))}
              </div>
            </div>

            {/* CQ 1 Content */}
            {activeCqId === 1 && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B57]/10 text-[#FF6B57] border border-[#FF6B57]/20 uppercase">
                        ঢাকা ও রাজশাহী বোর্ড স্ট্যান্ডার্ড
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100 mt-1">
                        উদ্দীপক: U = {'{1, 2, 3, 4, 5, 6, 7}'}, A = {'{x ∈ ℕ : x মৌলিক এবং x ≤ 7}'}, B = {'{x ∈ ℕ : x বিজোড় এবং x ≤ 7}'}, C = {'{2, 3, 5}'}
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        handleCopyCq(
                          `ক. A = {2, 3, 5, 7}, B = {1, 3, 5, 7}\nখ. (A ∪ B)' = A' ∩ B' দ্য মরগ্যানের সূত্র প্রমাণিত\nগ. C = {2, 3, 5}, P(C) উপাদান সংখ্যা 8 = 2^3 = 2^n সমর্থন করে।`,
                          1
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      {copiedCq === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCq === 1 ? 'কপি হয়েছে!' : 'উত্তর কপি'}</span>
                    </button>
                  </div>

                  {/* Questions (ক, খ, গ) */}
                  <div className="space-y-3 pt-2">
                    {/* Part Ka */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-sky-400">প্রশ্ন (ক) : জ্ঞানমূলক [২ নম্বর]</span>
                        <span className="text-slate-500 font-mono">মান: ২</span>
                      </div>
                      <p className="text-xs text-slate-300">A ও B সেটকে তালিকা পদ্ধতিতে প্রকাশ করো।</p>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                        <div>A = {'{x ∈ ℕ : x মৌলিক এবং x ≤ 7}'} ⇒ <span className="text-emerald-400">A = {'{2, 3, 5, 7}'}</span> (১ মৌলিক নয়!)</div>
                        <div>B = {'{x ∈ ℕ : x বিজোড় এবং x ≤ 7}'} ⇒ <span className="text-emerald-400">B = {'{1, 3, 5, 7}'}</span></div>
                      </div>
                    </div>

                    {/* Part Kha */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-400">প্রশ্ন (খ) : প্রয়োগমূলক [৪ নম্বর]</span>
                        <span className="text-slate-500 font-mono">মান: ৪</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        দেখাও যে, (A ∪ B)' = A' ∩ B' (দ্য মরগ্যানের ১ম সূত্র)।
                      </p>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                        <div>A ∪ B = {'{2, 3, 5, 7}'} ∪ {'{1, 3, 5, 7}'} = {'{1, 2, 3, 5, 7}'}</div>
                        <div>বামপক্ষ = (A ∪ B)' = U \ (A ∪ B) = {'{1, 2, 3, 4, 5, 6, 7}'} \ {'{1, 2, 3, 5, 7}'} = <span className="text-amber-400 font-bold">{'{4, 6}'}</span></div>
                        <div className="pt-1">A' = U \ A = {'{1, 4, 6}'}</div>
                        <div>B' = U \ B = {'{2, 4, 6}'}</div>
                        <div>ডানপক্ষ = A' ∩ B' = {'{1, 4, 6}'} ∩ {'{2, 4, 6}'} = <span className="text-amber-400 font-bold">{'{4, 6}'}</span></div>
                        <div className="text-emerald-400 font-bold pt-1">∴ (A ∪ B)' = A' ∩ B' (দেখানো হলো)</div>
                      </div>
                    </div>

                    {/* Part Ga */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-purple-400">প্রশ্ন (গ) : উচ্চতর দক্ষতামূলক [৪ নম্বর]</span>
                        <span className="text-slate-500 font-mono">মান: ৪</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        দেখাও যে, P(C)-এর উপাদান সংখ্যা 2ⁿ-কে সমর্থন করে, যেখানে n হলো C-এর উপাদান সংখ্যা।
                      </p>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                        <div>C = {'{2, 3, 5}'}, উপাদান সংখ্যা n = 3</div>
                        <div className="text-slate-400">C এর উপসেটসমূহ:</div>
                        <div>• ১টি করে নিয়ে: {'{2}'}, {'{3}'}, {'{5}'}</div>
                        <div>• ২টি করে নিয়ে: {'{2, 3}'}, {'{3, 5}'}, {'{2, 5}'}</div>
                        <div>• ৩টি করে নিয়ে: {'{2, 3, 5}'}</div>
                        <div>• কোনো উপাদান না নিয়ে: ∅</div>
                        <div className="text-cyan-400">∴ P(C) = {'{{2}, {3}, {5}, {2, 3}, {3, 5}, {2, 5}, {2, 3, 5}, ∅}'}</div>
                        <div>P(C)-এর উপাদান সংখ্যা = 8 = 2³ = 2ⁿ (যেহেতু n = 3)</div>
                        <div className="text-emerald-400 font-bold">∴ P(C)-এর উপাদান সংখ্যা 2ⁿ-কে সমর্থন করে। (প্রমাণিত)</div>
                      </div>
                    </div>
                  </div>

                  {/* Examiner Secret Rubric dropdown */}
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedRubric(!expandedRubric)}
                      className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-medium flex items-center justify-between text-slate-300 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-amber-400 font-bold">
                        <ShieldAlert className="w-4 h-4" />
                        পরীক্ষকের সিক্রেট খাতা মূল্যায়ন রুব্রিক (Examiner Marking Guide)
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedRubric ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedRubric && (
                      <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-amber-500/20 text-xs space-y-2 text-slate-300 leading-relaxed">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>১ নম্বর প্রাপ্তির শর্ত:</strong> P(C) শক্তি সেটের বাইরে দ্বিতীয় বন্ধনী {`{ }`}
                            না দিলে সরাসরি ১ নম্বর কাটা যাবে।
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>ফাঁকা সেট ট্র্যাপ:</strong> ∅ লেখার সময় বন্ধনী {`{∅}`} দিলে তা ১টি উপাদান বিশিষ্ট সেট
                            হয়ে যাবে এবং নম্বর কাটা পড়বে।
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>মৌলিক সংখ্যা ১ ট্র্যাপ:</strong> প্রশ্নে 'মৌলিক সংখ্যা' বলা সত্ত্বেও অনেকে ১ অন্তর্ভুক্ত
                            করে ভুল করে। মনে রাখবে ক্ষুদ্রতম মৌলিক সংখ্যা হলো ২!
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CQ 2 Content */}
            {activeCqId === 2 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B57]/10 text-[#FF6B57] border border-[#FF6B57]/20 uppercase">
                      চট্টগ্রাম ও দিনাজপুর বোর্ড
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 mt-1">
                      উদ্দীপক: A = {'{1, 2, 3, 4}'}, B = {'{2, 4, 6}'} এবং অন্বয় R = {'{(x, y) : x ∈ A, y ∈ B এবং y = 2x}'}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-sky-400">ক. A × B নির্ণয় করো। (২ নম্বর)</span>
                    <p className="font-mono text-slate-300">
                      A × B = {'{(1, 2), (1, 4), (1, 6), (2, 2), (2, 4), (2, 6), (3, 2), (3, 4), (3, 6), (4, 2), (4, 4), (4, 6)}'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-emerald-400">
                      খ. R অন্বয়টিকে তালিকা পদ্ধতিতে প্রকাশ করে Dom R ও Range R নির্ণয় করো। (৪ নম্বর)
                    </span>
                    <div className="font-mono text-slate-300 space-y-1">
                      <div>এখানে শর্ত y = 2x:</div>
                      <div>x = 1 হলে y = 2 ∈ B ⇒ (1, 2) ∈ R</div>
                      <div>x = 2 হলে y = 4 ∈ B ⇒ (2, 4) ∈ R</div>
                      <div>x = 3 হলে y = 6 ∈ B ⇒ (3, 6) ∈ R</div>
                      <div>x = 4 হলে y = 8 ∉ B ⇒ (4, 8) ∉ R</div>
                      <div className="text-cyan-400 font-bold">∴ R = {'{(1, 2), (2, 4), (3, 6)}'}</div>
                      <div>Dom R = {'{1, 2, 3}'}</div>
                      <div>Range R = {'{2, 4, 6}'}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-purple-400">
                      গ. R অন্বয়টি কি একটি ফাংশন? যুক্তিসহ প্রমাণ করো। (৪ নম্বর)
                    </span>
                    <div className="text-slate-300 space-y-1">
                      <p>R অন্বয়ের ক্রমজোড়গুলো হলো (1, 2), (2, 4), (3, 6)।</p>
                      <p>
                        এখানে লক্ষ করি, অন্বয়টির অন্তর্ভুক্ত কোনো দুটি ভিন্ন ক্রমজোড়ের প্রথম উপাদান একই নয়। অর্থাৎ Dom R এর
                        প্রতিটি ভিন্ন উপাদানের জন্য কেবল একটিই প্রতিচ্ছবি (Image) বিদ্যমান।
                      </p>
                      <p className="text-emerald-400 font-bold">অতএব, R অন্বয়টি একটি ফাংশন। (উত্তর)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 3 Content */}
            {activeCqId === 3 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B57]/10 text-[#FF6B57] border border-[#FF6B57]/20 uppercase">
                      কুমিল্লা ও সিলেট বোর্ড
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 mt-1">
                      উদ্দীপক: f(x) = (2x + 1)/(2x - 1) এবং g(y) = y³ + ky² - 4y - 8
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-sky-400">ক. f(0) ও f(2) এর মান নির্ণয় করো। (২ নম্বর)</span>
                    <div className="font-mono text-slate-300">
                      <div>f(0) = (2·0 + 1)/(2·0 - 1) = 1/(-1) = -1</div>
                      <div>f(2) = (2·2 + 1)/(2·2 - 1) = 5/3</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-emerald-400">
                      খ. [f(1/x) + 1] / [f(1/x) - 1] এর মান নির্ণয় করো। (৪ নম্বর)
                    </span>
                    <div className="font-mono text-slate-300 space-y-1">
                      <div>f(1/x) = [2(1/x) + 1] / [2(1/x) - 1] = [(2 + x)/x] / [(2 - x)/x] = (2 + x)/(2 - x)</div>
                      <div>লব = f(1/x) + 1 = (2 + x)/(2 - x) + 1 = (2 + x + 2 - x)/(2 - x) = 4/(2 - x)</div>
                      <div>হর = f(1/x) - 1 = (2 + x)/(2 - x) - 1 = (2 + x - 2 + x)/(2 - x) = 2x/(2 - x)</div>
                      <div className="text-cyan-400 font-bold">
                        ∴ [f(1/x) + 1] / [f(1/x) - 1] = [4/(2 - x)] / [2x/(2 - x)] = 4 / (2x) = 2/x
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-purple-400">
                      গ. k এর কোন মানের জন্য g(-2) = 0 হবে? (৪ নম্বর)
                    </span>
                    <div className="font-mono text-slate-300 space-y-1">
                      <div>g(-2) = (-2)³ + k(-2)² - 4(-2) - 8</div>
                      <div>= -8 + 4k + 8 - 8 = 4k - 8</div>
                      <div>প্রশ্নমতে, g(-2) = 0 ⇒ 4k - 8 = 0 ⇒ 4k = 8 ⇒ k = 2</div>
                      <div className="text-emerald-400 font-bold">∴ k = 2 এর জন্য g(-2) = 0 হবে। (উত্তর)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: TRY YOURSELF (3 INTERACTIVE CHALLENGES)                      */}
        {/* =================================================================== */}
        {activeTab === 'try' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#FF6B57]" />
                নিজে চেষ্টা করুন: ৩টি বোর্ড চ্যালেঞ্জ
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                বোর্ড পরীক্ষার অনুরূপ ৩টি গাণিতিক চ্যালেঞ্জ সমাধান করে নিজের প্রস্তুতি যাচাই করো।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1 */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    চ্যালেঞ্জ ০১
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">প্রকৃত উপসেট সংখ্যা</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    যদি <RenderMathText text="$A = \{1, 2, 3, 4\}$" /> হয়, তবে <RenderMathText text="$P(A)$" /> এর{' '}
                    <strong>প্রকৃত উপসেট (Proper Subsets)</strong> সংখ্যা কত?
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="সংখ্যা লিখুন (যেমন: 15)"
                      value={ch1Answer}
                      onChange={(e) => {
                        setCh1Answer(e.target.value);
                        setCh1Result('idle');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-[#FF6B57]"
                    />
                    <button
                      onClick={() => {
                        if (ch1Answer.trim() === '15') setCh1Result('correct');
                        else setCh1Result('wrong');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white text-xs font-bold transition-colors"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch1Result === 'correct' && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>সঠিক! n = 4 হলে উপসেট 2⁴ = 16, প্রকৃত উপসেট 16 - 1 = 15 টি।</span>
                    </div>
                  )}
                  {ch1Result === 'wrong' && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>ভুল উত্তর! মনে রেখো, প্রকৃত উপসেটের ক্ষেত্রে মূল সেটটি বাদ দিতে হয় (2ⁿ - 1)।</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    চ্যালেঞ্জ ০২
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">কার্তেসীয় গুণজ উপাদান</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    যদি <RenderMathText text="$A = \{1, 2\}$" /> এবং <RenderMathText text="$B = \{2, 3, 4\}$" /> হয়, তবে{' '}
                    <RenderMathText text="$n(A \times B)$" /> এর মান কত?
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="মান লিখুন (যেমন: 6)"
                      value={ch2Answer}
                      onChange={(e) => {
                        setCh2Answer(e.target.value);
                        setCh2Result('idle');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={() => {
                        if (ch2Answer.trim() === '6') setCh2Result('correct');
                        else setCh2Result('wrong');
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch2Result === 'correct' && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>চমৎকার! n(A × B) = n(A) × n(B) = 2 × 3 = 6 টি।</span>
                    </div>
                  )}
                  {ch2Result === 'wrong' && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>ভুল উত্তর! সূত্র: n(A × B) = n(A) × n(B)। পুনরায় চেষ্টা করো।</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 3 */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    চ্যালেঞ্জ ০৩
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">ফাংশন আউটপুট নির্ণয়</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    যদি <RenderMathText text="$f(x) = x^2 - 2x + 1$" /> হয়, তবে <RenderMathText text="$f(3)$" /> এর মান কত?
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="মান লিখুন (যেমন: 4)"
                      value={ch3Answer}
                      onChange={(e) => {
                        setCh3Answer(e.target.value);
                        setCh3Result('idle');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => {
                        if (ch3Answer.trim() === '4') setCh3Result('correct');
                        else setCh3Result('wrong');
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch3Result === 'correct' && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>একদম সঠিক! f(3) = 3² - 2(3) + 1 = 9 - 6 + 1 = 4!</span>
                    </div>
                  )}
                  {ch3Result === 'wrong' && (
                    <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>ভুল উত্তর! x এর জায়গায় 3 বসিয়ে হিসাব করো: 3² - 6 + 1 = ?</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: CHECK UNDERSTANDING (MCQs)                                   */}
        {/* =================================================================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#FF6B57]" />
                  জ্ঞান যাচাই: ৫টি বোর্ড স্ট্যান্ডার্ড MCQ
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  প্রতিটি প্রশ্নের সঠিক উত্তর নির্বাচন করে তাৎক্ষণিক ব্যাখ্যা দেখুন।
                </p>
              </div>

              {submittedQuiz && (
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-400">স্কোর:</span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    {Object.entries(quizAnswers).filter(([qId, ans]) => QUIZ_QUESTIONS[Number(qId) - 1].correct === ans).length} / 5
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q) => {
                const isAnswered = quizAnswers[q.id] !== undefined;
                const isCorrect = isAnswered && quizAnswers[q.id] === q.correct;
                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-bold text-slate-100">
                        {q.id}. {q.q}
                      </h3>
                      {submittedQuiz && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                            isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'সঠিক (+১)' : 'ভুল (০)'}
                        </span>
                      )}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[q.id] === oIdx;
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (submittedQuiz) {
                          if (oIdx === q.correct) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isSelected) {
                            btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-[#FF6B57]/20 border-[#FF6B57] text-[#FF6B57] font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={submittedQuiz}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: oIdx })}
                            className={`p-3 rounded-xl border text-left transition-colors flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {submittedQuiz && oIdx === q.correct && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {submittedQuiz && isSelected && oIdx !== q.correct && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {submittedQuiz && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-amber-400">ব্যাখ্যা:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit / Reset Quiz button */}
            <div className="flex justify-end pt-2">
              {!submittedQuiz ? (
                <button
                  onClick={() => setSubmittedQuiz(true)}
                  disabled={Object.keys(quizAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  উত্তর জমা দিন ও মূল্যায়ন দেখুন
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSubmittedQuiz(false);
                    setQuizAnswers({});
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  পুনরায় চেষ্টা করুন
                </button>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: SUMMARY & CHEAT SHEET                                        */}
        {/* =================================================================== */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#FF6B57]" />
                  অধ্যায় ০২: সারাংশ, সূত্রকোষ ও পরীক্ষকের ট্র্যাপ
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  দ্রুত রিভিশন ও বোর্ড পরীক্ষার পূর্বের চেকলিস্ট। ১-ক্লিকে কপি করে নোটবুকে সংরক্ষণ করুন।
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `সেট ও ফাংশন সূত্রকোষ:\n১. উপসেট সংখ্যা = 2ⁿ\n২. প্রকৃত উপসেট সংখ্যা = 2ⁿ - 1\n৩. কার্তেসীয় গুণজ = n(A × B) = n(A) × n(B)\n৪. দ্য মরগ্যানের ১ম সূত্র: (A ∪ B)' = A' ∩ B'\n৫. দ্য মরগ্যানের ২য় সূত্র: (A ∩ B)' = A' ∪ B'\n৬. নিশ্ছেদ সেট: A ∩ B = ∅\n৭. অন্বয়: R ⊆ (A × B)\n৮. ফাংশন শর্ত: ডোমেনের প্রতিটি উপাদানের অনন্য প্রতিচ্ছবি থাকবে।`
                  );
                  setCopiedCheatSheet(true);
                  setTimeout(() => setCopiedCheatSheet(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#FF6B57]/15 hover:bg-[#FF6B57]/25 border border-[#FF6B57]/30 text-[#FF6B57] text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copiedCheatSheet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCheatSheet ? 'নোটবুক কপি হয়েছে!' : 'সম্পূর্ণ সূত্রকোষ কপি'}</span>
              </button>
            </div>

            {/* 6 Essential Formula Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'উপসেট ও শক্তি সেট উপপাদ্য',
                  formula: 'n(P(A)) = 2^n',
                  desc: 'উপাদান সংখ্যা n হলে মোট উপসেট 2ⁿ টি এবং প্রকৃত উপসেট (2ⁿ - 1) টি।',
                  badge: 'বোর্ড টপ',
                },
                {
                  title: 'দ্য মরগ্যানের ১ম সূত্র',
                  formula: "(A \\cup B)' = A' \\cap B'",
                  desc: 'সংযোগ সেটের পূরক সেট তাদের পৃথক পূরক সেটের ছেদ সেটের সমান।',
                  badge: 'প্রমাণ CQ',
                },
                {
                  title: 'দ্য মরগ্যানের ২য় সূত্র',
                  formula: "(A \\cap B)' = A' \\cup B'",
                  desc: 'ছেদ সেটের পূরক সেট তাদের পৃথক পূরক সেটের সংযোগ সেটের সমান।',
                  badge: 'প্রমাণ CQ',
                },
                {
                  title: 'কার্তেসীয় গুণজ আকার',
                  formula: 'n(A \\times B) = n(A) \\cdot n(B)',
                  desc: 'সকল ক্রমজোড় (x, y) নিয়ে গঠিত সেট, যেখানে x ∈ A এবং y ∈ B।',
                  badge: 'MCQ ফেভারিট',
                },
                {
                  title: 'নিশ্ছেদ সেট (Disjoint Sets)',
                  formula: 'A \\cap B = \\emptyset',
                  desc: 'উভয় সেটের মধ্যে কোনো সাধারণ উপাদান না থাকলে তারা নিশ্ছেদ সেট।',
                  badge: 'সংজ্ঞা ক',
                },
                {
                  title: 'এক-এক ফাংশন শর্ত',
                  formula: 'f(x_1) = f(x_2) \\implies x_1 = x_2',
                  desc: 'ডোমেনের ভিন্ন ভিন্ন সদস্যের ইমেজ সর্বদা ভিন্ন হতে হবে।',
                  badge: 'উচ্চতর গণিত লিঙ্ক',
                },
              ].map((card, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{card.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B57]/10 text-[#FF6B57] border border-[#FF6B57]/20">
                      {card.badge}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-sm font-mono text-emerald-400 font-bold">
                    <RenderMathText text={`$$${card.formula}$$`} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* 4 Examiner Traps to Avoid */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/30 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                পরীক্ষক যেখানে ০.৫ থেকে ১ নম্বর কেটে নেন (Common Traps)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-400 block">১. ∅ বনাম {`{∅}`} ভুল ধারণা</span>
                  <p className="text-[11px] text-slate-400">
                    ফাঁকা সেটের প্রতীকে কখনো দ্বিতীয় বন্ধনী দেবে না। ∅ নিজে একটি সেট, কিন্তু {`{∅}`} হলো একটি উপাদানবিশিষ্ট
                    সেট!
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-400 block">২. ১-কে মৌলিক সংখ্যা ধরা</span>
                  <p className="text-[11px] text-slate-400">
                    ১ মৌলিক সংখ্যা নয়! ২ হলো ক্ষুদ্রতম এবং একমাত্র জোড় মৌলিক সংখ্যা।
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-400 block">৩. P(A) শক্তি সেটের বাইরের ব্র্যাকেট</span>
                  <p className="text-[11px] text-slate-400">
                    P(A) সেটের সকল উপাদানকে অন্তর্ভুক্ত করে বাইরে দ্বিতীয় বন্ধনী {`{ }`} না দিলে পূর্ণ নম্বর কাটা যায়।
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-400 block">৪. ক্রমজোড়ের স্থান পরিবর্তন</span>
                  <p className="text-[11px] text-slate-400">
                    (x, y) ≠ (y, x) যদি না x = y হয়। অন্বয়ে ডোমেন উপাদান সর্বদা ১ম পদ এবং রেঞ্জ উপাদান সর্বদা ২য় পদ।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* SHERU AI SOCRATIC TUTOR DRAWER                                        */}
      {/* --------------------------------------------------------------------- */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 flex flex-col h-full shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B57]/20 border border-[#FF6B57]/30 flex items-center justify-center text-[#FF6B57]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">শেরু এআই গণিত টিউটর</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    সেট ও ফাংশন স্পেশালিস্ট
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/30 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {[
                {
                  q: 'দ্য মরগানের সূত্রের সহজ ব্যাখ্যা কী?',
                  a: 'দ্য মরগ্যানের ১ম সূত্র: (A ∪ B)\' = A\' ∩ B\'। এর অর্থ, A অথবা B-এর কোনোটিতেই নেই—এমন উপাদানগুলো হলো যারা A-তেও নেই এবং B-তেও নেই। ভেনচিত্রে উভয় পাশের ছায়াঘেরা অঞ্চল সমতুল্য দেখিয়ে এটি খুব সহজে প্রমাণ করা যায়!',
                },
                {
                  q: 'ফাঁকা সেট ∅ এবং {∅} এর পার্থক্য কী?',
                  a: 'ফাঁকা সেট ∅ (বা {}) এর উপাদান সংখ্যা শূন্য (n = 0)। কিন্তু {∅} হলো ১টি উপাদান বিশিষ্ট সেট, যার একমাত্র উপাদান হলো ফাঁকা সেট ∅! বোর্ড পরীক্ষায় এটি অত্যন্ত পরিচিত একটি ট্র্যাপ।',
                },
                {
                  q: 'অন্বয় আর ফাংশনের মূল পার্থক্য কী?',
                  a: 'কার্তেসীয় গুণজের যেকোনো উপসেট অন্বয় (Relation)। কিন্তু সেই অন্বয়টি কেবল তখনই ফাংশন হবে যখন প্রতিটি x ইনপুটের জন্য অনন্য একটি y আউটপুট থাকবে। অর্থাৎ এক সন্তানের একাধিক জন্মদাত্রী মা হতে পারবে না!',
                },
                {
                  q: 'P(A) এর উপাদান সংখ্যা 2ⁿ উপপাদ্য কীভাবে লিখবো?',
                  a: 'ধাপ ১: উপাদান সংখ্যা n লিখবে। ধাপ ২: ০টি, ১টি, ২টি... করে উপাদান নিয়ে উপসেট তালিকা করবে। ধাপ ৩: P(A) শক্তি সেটের বাইরে দ্বিতীয় বন্ধনী দেবে। ধাপ ৪: মোট উপাদান = 2ⁿ দেখিয়ে প্রমাণিত লিখবে।',
                },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskPreset(chip.q, chip.a)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap transition-colors"
                >
                  {chip.q}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                <span className="font-bold text-[#FF6B57] block mb-1">নমস্কার দোস্ত! আমি শেরু 🐾</span>
                সেট ও ফাংশন অধ্যায়ে ভেনচিত্র, শক্তি সেট P(A), দ্য মরগ্যানের সূত্র, অন্বয় বা ডোমেন-রেঞ্জ নিয়ে যেকোনো প্রশ্ন
                থাকলে আমাকে জিজ্ঞাসা করো!
              </div>

              {aiChatResponses.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#FF6B57]/15 text-[#FF6B57] border border-[#FF6B57]/30 ml-6'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 mr-6'
                  }`}
                >
                  <span className="font-bold block mb-0.5 text-[10px] text-slate-400">
                    {msg.role === 'user' ? 'তুমি:' : 'শেরু:'}
                  </span>
                  <RenderMathText text={msg.text} />
                </div>
              ))}
            </div>

            {/* Query Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center space-x-2">
              <input
                type="text"
                placeholder="সেট ও ফাংশন নিয়ে শেরুকে জিজ্ঞাসা করো..."
                value={aiChatQuery}
                onChange={(e) => setAiChatQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustomAi()}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-[#FF6B57]"
              />
              <button
                onClick={handleSendCustomAi}
                className="p-2 rounded-lg bg-[#FF6B57] hover:bg-[#e05340] text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
