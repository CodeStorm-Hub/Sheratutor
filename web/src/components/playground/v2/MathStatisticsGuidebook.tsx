'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
  X,
  Send,
  Sliders,
  XCircle,
  Activity,
  Calculator,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  BarChart3,
  TrendingUp,
  Eye,
  CheckSquare,
  Award,
  RotateCcw,
  Maximize2,
  Minimize2,
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
    title: 'সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয় সিমুলেটর',
    subtitle: 'Measures of Central Tendency: Assumed Mean & Step-Deviation Method (17.1)',
    nctbPage: 'অনুশীলনী ১৭ • পৃষ্ঠা ৩২৬–৩৩০',
    badge: 'অনুশীলনী ১৭.১',
    intro:
      'উপাত্তের কেন্দ্রীয় মানের দিকে পুঞ্জীভূত হওয়ার প্রবণতাকে কেন্দ্রীয় প্রবণতা বলে। বড় উপাত্তের ক্ষেত্রে সরাসরি গড়ের চেয়ে সংক্ষিপ্ত পদ্ধতি (Step-deviation method) দ্রুত ও নির্ভুল।',
  },
  {
    id: 2,
    title: 'মধ্যক নির্ণয় ও ক্রমযোজিত গণসংখ্যা ল্যাব',
    subtitle: 'Median of Grouped Data & Cumulative Frequency Table (17.2)',
    nctbPage: 'অনুশীলনী ১৭ • পৃষ্ঠা ৩৩১–৩৩৪',
    badge: 'অনুশীলনী ১৭.২',
    intro:
      'উপাত্তকে মানের ক্রমানুসারে সাজালে যে মান উপাত্তকে সমান দুই ভাগে বিভক্ত করে, তাই মধ্যক। শ্রেণিকৃত উপাত্তের ক্ষেত্রে ক্রমযোজিত গণসংখ্যা সারণি থেকে মধ্যক শ্রেণি চিহ্নিত করে সূত্র প্রয়োগ করতে হয়।',
  },
  {
    id: 3,
    title: 'প্রচুরক নির্ণয় সিমুলেটর',
    subtitle: 'Mode of Grouped Data & Boundary Case Handling (17.3)',
    nctbPage: 'অনুশীলনী ১৭ • পৃষ্ঠা ৩৩৫–৩৩৭',
    badge: 'অনুশীলনী ১৭.৩',
    intro:
      'যে সংখ্যা উপাত্তে সর্বাধিকবার থাকে, তাই প্রচুরক। শ্রেণিকৃত উপাত্তে সর্বাধিক গণসংখ্যাযুক্ত শ্রেণিকে প্রচুরক শ্রেণি বলে। প্রথম বা শেষ শ্রেণি প্রচুরক শ্রেণি হলে পূর্ববর্তী বা পরবর্তী গণসংখ্যা শূন্য (০) ধরতে হয়।',
  },
  {
    id: 4,
    title: 'অজিভ রেখা (Ogive Curve) ও মধ্যক সন্ধানী',
    subtitle: 'Cumulative Frequency Curve & Graphical Median Projection (17.4)',
    nctbPage: 'অনুশীলনী ১৭ • পৃষ্ঠা ৩৩৮–৩৪২',
    badge: 'অনুশীলনী ১৭.৪',
    intro:
      'X-অক্ষ বরাবর শ্রেণির উচ্চসীমা এবং Y-অক্ষ বরাবর ক্রমযোজিত গণসংখ্যা বসিয়ে যে অবিচ্ছিন্ন ঊর্ধ্বমুখী বক্ররেখা পাওয়া যায়, তাকে অজিভ রেখা বলে। Y-অক্ষে N/2 বিন্দু থেকে অজিভ রেখায় ছেদ টেনে সহজেই লেখচিত্র থেকে মধ্যক নির্ণয় করা যায়।',
  },
  {
    id: 5,
    title: 'আয়তলেখ ও গণসংখ্যা বহুভুজ ল্যাব',
    subtitle: 'Histogram, Continuous Class Boundaries & Frequency Polygon (17.5)',
    nctbPage: 'অনুশীলনী ১৭ • পৃষ্ঠা ৩৪৩–৩৪৬',
    badge: 'অনুশীলনী ১৭.৫',
    intro:
      'অবিচ্ছিন্ন শ্রেণিসীমার ভিত্তিতে নির্মিত স্তম্ভচিত্র হলো আয়তলেখ। আয়তলেখের স্তম্ভগুলোর শীর্ষের মধ্যবিন্দুগুলোকে রেখা দ্বারা যুক্ত করে গণসংখ্যা বহুভুজ তৈরি করা হয়। সর্বোচ্চ স্তম্ভের কোনাকুনি রেখা টেনে আয়তলেখ থেকেও প্রচুরক নির্ধারণ সম্ভব।',
  },
];

interface DataRow {
  range: string;
  low: number;
  high: number;
  mid: number;
  f: number;
}

const DEFAULT_DATA: DataRow[] = [
  { range: '৩১–৪০', low: 31, high: 40, mid: 35.5, f: 4 },
  { range: '৪১–৫০', low: 41, high: 50, mid: 45.5, f: 8 },
  { range: '৫১–৬০', low: 51, high: 60, mid: 55.5, f: 10 },
  { range: '৬১–৭০', low: 61, high: 70, mid: 65.5, f: 16 },
  { range: '৭১–৮০', low: 71, high: 80, mid: 75.5, f: 7 },
  { range: '৮১–৯০', low: 81, high: 90, mid: 85.5, f: 5 },
];

// Presets
const PRESETS = [
  {
    name: '৫০ শিক্ষার্থীর গণিত নম্বর (নমুনা)',
    rows: [
      { range: '৩১–৪০', low: 31, high: 40, mid: 35.5, f: 4 },
      { range: '৪১–৫০', low: 41, high: 50, mid: 45.5, f: 8 },
      { range: '৫১–৬০', low: 51, high: 60, mid: 55.5, f: 10 },
      { range: '৬১–৭০', low: 61, high: 70, mid: 65.5, f: 16 },
      { range: '৭১–৮০', low: 71, high: 80, mid: 75.5, f: 7 },
      { range: '৮১–৯০', low: 81, high: 90, mid: 85.5, f: 5 },
    ],
  },
  {
    name: '৬০ শ্রমিকের দৈনিক মজুরি (টাকা × ১০)',
    rows: [
      { range: '২০–২৯', low: 20, high: 29, mid: 24.5, f: 6 },
      { range: '৩০–৩৯', low: 30, high: 39, mid: 34.5, f: 12 },
      { range: '৪০–৪৯', low: 40, high: 49, mid: 44.5, f: 20 },
      { range: '৫০–৫৯', low: 50, high: 59, mid: 54.5, f: 14 },
      { range: '৬০–৬৯', low: 60, high: 69, mid: 64.5, f: 8 },
    ],
  },
  {
    name: '৪০ জনের ওজন (কেজি)',
    rows: [
      { range: '৪৫–৪৯', low: 45, high: 49, mid: 47.0, f: 5 },
      { range: '৫০–৫৪', low: 50, high: 54, mid: 52.0, f: 9 },
      { range: '৫৫–৫৯', low: 55, high: 59, mid: 57.0, f: 15 },
      { range: '৬০–৬৪', low: 60, high: 64, mid: 62.0, f: 8 },
      { range: '৬৫–৬৯', low: 65, high: 69, mid: 67.0, f: 3 },
    ],
  },
];

export default function MathStatisticsGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'example' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLab, setActiveLab] = useState<number>(1);

  // Lab 1: Mean State
  const [dataRows, setDataRows] = useState<DataRow[]>(DEFAULT_DATA);
  const [assumedIdx, setAssumedIdx] = useState<number>(3); // row 3 is 61-70 (a=65.5)

  // Lab 4: Ogive State
  const [showOgiveMedianProjection, setShowOgiveMedianProjection] = useState<boolean>(true);

  // Lab 5: Histogram State
  const [showHistogramBars, setShowHistogramBars] = useState<boolean>(true);
  const [showPolygonLine, setShowPolygonLine] = useState<boolean>(true);
  const [showModalCrossInHistogram, setShowModalCrossInHistogram] = useState<boolean>(true);

  // Interactive Challenges State
  const [ch1Input, setCh1Input] = useState<string>('');
  const [ch1Result, setCh1Result] = useState<boolean | null>(null);

  const [ch2Input, setCh2Input] = useState<string>('');
  const [ch2Result, setCh2Result] = useState<boolean | null>(null);

  const [ch3Input, setCh3Input] = useState<string>('');
  const [ch3Result, setCh3Result] = useState<boolean | null>(null);

  // MCQs State
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([-1, -1, -1, -1, -1]);
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  // Sheru AI Tutor State
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiInput, setAiInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'sheru'; text: string }>>([
    {
      sender: 'sheru',
      text: 'সালাম! আমি শেরু — তোমার গণিত সহচর। পরিসংখ্যানের সংক্ষিপ্ত গড়, মধ্যক, প্রচুরক, অজিভ রেখা বা আয়তলেখ নিয়ে কোনো জিজ্ঞাসা থাকলে আমাকে বলো!',
    },
  ]);

  // Copy Cheat Sheet State
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations for current dataset
  const totalN = dataRows.reduce((acc, r) => acc + r.f, 0);
  const classIntervalH = dataRows.length > 0 ? dataRows[0].high - dataRows[0].low + 1 : 10;
  const assumedMeanA = dataRows[assumedIdx]?.mid ?? 65.5;

  // Deviation & fi*ui
  const tableDataWithDeviations = dataRows.map((r, idx) => {
    const u = Math.round((r.mid - assumedMeanA) / classIntervalH);
    const fu = r.f * u;
    const fx = r.f * r.mid;
    return { ...r, u, fu, fx };
  });

  const sumFu = tableDataWithDeviations.reduce((acc, r) => acc + r.fu, 0);
  const sumFx = tableDataWithDeviations.reduce((acc, r) => acc + r.fx, 0);
  const calculatedMean = totalN > 0 ? assumedMeanA + (sumFu / totalN) * classIntervalH : 0;
  const directMean = totalN > 0 ? sumFx / totalN : 0;

  // Cumulative Frequency (Fc) for Median
  let runningFc = 0;
  const tableWithFc = tableDataWithDeviations.map((r) => {
    runningFc += r.f;
    return { ...r, cumulativeF: runningFc };
  });

  const halfN = totalN / 2;
  // Median class is first class where cumulativeF >= halfN
  let medianClassIdx = tableWithFc.findIndex((r) => r.cumulativeF >= halfN);
  if (medianClassIdx === -1 && tableWithFc.length > 0) medianClassIdx = tableWithFc.length - 1;

  const medianClass = tableWithFc[medianClassIdx] ?? tableWithFc[0];
  const L_med = medianClass ? medianClass.low : 0;
  const Fc_med = medianClassIdx > 0 ? tableWithFc[medianClassIdx - 1].cumulativeF : 0;
  const fm_med = medianClass ? medianClass.f : 1;
  const calculatedMedian =
    fm_med > 0 ? L_med + ((halfN - Fc_med) * classIntervalH) / fm_med : 0;

  // Modal Class for Mode
  let maxFreq = -1;
  let modalClassIdx = 0;
  dataRows.forEach((r, idx) => {
    if (r.f > maxFreq) {
      maxFreq = r.f;
      modalClassIdx = idx;
    }
  });

  const modalClass = dataRows[modalClassIdx];
  const L_mode = modalClass ? modalClass.low : 0;
  const prevFreq = modalClassIdx > 0 ? dataRows[modalClassIdx - 1].f : 0;
  const nextFreq = modalClassIdx < dataRows.length - 1 ? dataRows[modalClassIdx + 1].f : 0;
  const f1 = modalClass ? modalClass.f - prevFreq : 0;
  const f2 = modalClass ? modalClass.f - nextFreq : 0;
  const calculatedMode =
    f1 + f2 > 0 ? L_mode + (f1 / (f1 + f2)) * classIntervalH : L_mode;

  // Frequency updater helper
  const handleFreqChange = (idx: number, newF: number) => {
    const updated = [...dataRows];
    updated[idx] = { ...updated[idx], f: Math.max(1, newF) };
    setDataRows(updated);
  };

  // AI Prompt Send
  const handleSendPrompt = (promptText?: string) => {
    const query = promptText || aiInput;
    if (!query.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: query }];
    setChatMessages(newMsgs);
    if (!promptText) setAiInput('');

    let reply = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('সংক্ষিপ্ত') || qLower.includes('গড়') || qLower.includes('বিচ্যুতি')) {
      reply =
        'সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয়ের সূত্র হলো:\n$$\\bar{x} = a + \\frac{\\sum f_i u_i}{N} \\times h$$\nএখানে:\n• $a$ = অনুমিত গড় (যে শ্রেণির গণসংখ্যা বেশি, তার মধ্যবিন্দুকে $a$ ধরা সুবিধাজনক)\n• $u_i = \\frac{x_i - a}{h}$ = বিচ্যুতি সংখ্যা\n• $N = \\sum f_i$ = মোট গণসংখ্যা\n• $h$ = শ্রেণি ব্যাপ্তি\nঅনুমিত শ্রেণির বিচ্যুতি $u_i = 0$ হয়। এর উপরেরগুলো ঋণাত্মক ($-1, -2, -3$) এবং নিচেরগুলো ধনাত্মক ($1, 2, 3$) ক্রমানুসারে বসে!';
    } else if (qLower.includes('মধ্যক') || qLower.includes('fc') || qLower.includes('fm')) {
      reply =
        'শ্রেণিকৃত উপাত্তের মধ্যক নির্ণয়ের সূত্র:\n$$\\text{Median} = L + \\left(\\frac{N}{2} - F_c\\right) \\times \\frac{h}{f_m}$$\nসতর্কতা পয়েন্ট:\n১. $N/2$-তম মান ক্রমযোজিত গণসংখ্যার কোন ঘরে পড়ে, সেটি খুঁজে মধ্যক শ্রেণি নির্ধারণ করবে।\n২. $L$ = মধ্যক শ্রেণির নিম্নসীমা।\n৩. $F_c$ হলো মধ্যক শ্রেণির ঠিক **পূর্ববর্তী** শ্রেণির ক্রমযোজিত গণসংখ্যা (শিক্ষার্থীরা প্রায়ই ভুল করে মধ্যক শ্রেণিরটা বসিয়ে দেয়!)।\n৪. $f_m$ হলো মধ্যক শ্রেণির নিজস্ব সাধারণ গণসংখ্যা।';
    } else if (qLower.includes('প্রচুরক') || qLower.includes('f1') || qLower.includes('f2')) {
      reply =
        'প্রচুরক নির্ণয়ের সূত্র:\n$$\\text{Mode} = L + \\frac{f_1}{f_1 + f_2} \\times h$$\nএখানে:\n• $L$ = প্রচুরক শ্রেণির নিম্নসীমা (সর্বোচ্চ গণসংখ্যার শ্রেণি)\n• $f_1 = f_m - f_{m-1}$ (প্রচুরক শ্রেণির গণসংখ্যা - পূর্বের শ্রেণির গণসংখ্যা)\n• $f_2 = f_m - f_{m+1}$ (প্রচুরক শ্রেণির গণসংখ্যা - পরের শ্রেণির গণসংখ্যা)\n⚠️ মারাত্মক বোর্ড ট্র্যাপ: প্রথম শ্রেণি প্রচুরক হলে $f_{m-1} = 0$, ফলে $f_1 = f_m - 0 = f_m$। একইভাবে শেষ শ্রেণি প্রচুরক হলে $f_2 = f_m - 0 = f_m$ হবে!';
    } else if (qLower.includes('অজিভ') || qLower.includes('ogive')) {
      reply =
        'অজিভ রেখা (Ogive Curve) সংক্রান্ত ৩টি বোর্ড গোল্ডেন রুল:\n১. $X$-অক্ষে বসবে **শ্রেণির উচ্চসীমা** (কখনো নিম্নসীমা বা মধ্যবিন্দু নয়!)।\n২. $Y$-অক্ষে বসবে **ক্রমযোজিত গণসংখ্যা ($F_c$)**।\n৩. এটি সর্বদা একটি ক্রমবর্দ্ধমান ঊর্ধ্বমুখী বক্ররেখা।\n৪. $Y$-অক্ষে $N/2$ বিন্দু থেকে সমান্তরাল রেখা টেনে অজিভ রেখা যেখানে ছেদ করে, সেখান থেকে $X$-অক্ষে লম্ব টানলে সেই ছেদবিন্দুর মানই হলো **লেখচিত্র থেকে মধ্যক**!';
    } else if (qLower.includes('আয়তলেখ') || qLower.includes('বহুভুজ') || qLower.includes('histogram')) {
      reply =
        'আয়তলেখ ও গণসংখ্যা বহুভুজের মূল নিয়ম:\n১. আয়তলেখ অঙ্কনে অবশ্যই **অবিচ্ছিন্ন শ্রেণিসীমা (Continuous limits)** ব্যবহার করতে হবে (যেমন: $৩১-৪০$ থাকলে $৩০.৫-৪০.৫$)।\n২. $X$-অক্ষে অবিচ্ছিন্ন শ্রেণিসীমা এবং $Y$-অক্ষে গণসংখ্যা স্থাপন করে আয়তাকার স্তম্ভ আঁকা হয়।\n৩. বহুভুজ আঁকতে $X$-অক্ষে **শ্রেণি মধ্যবিন্দু** এবং $Y$-অক্ষে গণসংখ্যা বসিয়ে সরলরেখা দ্বারা যুক্ত করতে হয়, এবং প্রথম ও শেষ শ্রেণির আগের ও পরের মধ্যবিন্দুতে $Y=0$-তে ভূমি স্পর্শ করাতে হয়।';
    } else {
      reply =
        'অসাধারণ প্রশ্ন! পরিসংখ্যানের যেকোনো সারণি, গড়, মধ্যক, প্রচুরক, কিংবা অজিভ রেখা ও আয়তলেখের অঙ্কনপ্রণালী বিষয়ে স্পেসিফিক কোনো টার্ম জানতে চাইলে বলো!';
    }

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { sender: 'sheru', text: reply }]);
    }, 400);
  };

  // Copy summary cheat sheet
  const handleCopyCheatSheet = () => {
    const text = `=== এসএসসি সাধারণ গণিত: অধ্যায় ১৭ (পরিসংখ্যান) মাস্টার চিটশিট ===
১. সংক্ষিপ্ত পদ্ধতিতে গড়:
   x̄ = a + (∑fi·ui / N) × h
   যেখানে a = অনুমিত গড়, ui = (xi - a)/h, N = ∑fi, h = শ্রেণিব্যাপ্তি।

২. মধ্যক (Grouped Data):
   Median = L + (N/2 - Fc) × (h / fm)
   যেখানে L = মধ্যক শ্রেণির নিম্নসীমা, N/2 = মোট গণসংখ্যার অর্ধেক,
   Fc = পূর্ববর্তী শ্রেণির ক্রমযোজিত গণসংখ্যা, fm = মধ্যক শ্রেণির গণসংখ্যা।

৩. প্রচুরক (Grouped Data):
   Mode = L + [f1 / (f1 + f2)] × h
   যেখানে f1 = fm - fm-1, f2 = fm - fm+1, L = প্রচুরক শ্রেণির নিম্নসীমা।
   ট্র্যাপ: প্রথম শ্রেণি প্রচুরক হলে fm-1 = 0; শেষ শ্রেণি প্রচুরক হলে fm+1 = 0।

৪. অজিভ রেখা (Ogive Curve):
   X-অক্ষে শ্রেণির উচ্চসীমা এবং Y-অক্ষে ক্রমযোজিত গণসংখ্যা (Fc)।
   Y = N/2 বিন্দু থেকে অজিভে প্রজেকশন টানলে মধ্যক পাওয়া যায়।

৫. আয়তলেখ ও বহুভুজ:
   আয়তলেখে অবিচ্ছিন্ন শ্রেণিসীমা ব্যবহার বাধ্যতামূলক (০.৫ বিয়োজন/সংযোজন)।
   বহুভুজে X-অক্ষে শ্রেণি মধ্যবিন্দু ও Y-অক্ষে গণসংখ্যা বসে।`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20">
      {/* -------------------------------------------------------------------------
          HEADER & CHAPTER META
      ------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/playground/v2"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="লাইব্রেরি ভিউতে ফিরে যান"
            >
              <RotateCcw className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                অধ্যায় ১৭
              </span>
              <div className="hidden sm:block">
                <span className="text-xs text-slate-400">সাধারণ গণিত • NCTB নবম-দশম</span>
              </div>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              পরিসংখ্যান
              <span className="text-xs font-normal text-slate-400 hidden md:inline">
                (Statistics: Mean, Median, Mode, Ogive & Histogram)
              </span>
            </h1>
          </div>

          {/* 5-Step Learning Framework Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'learn'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">১.</span> কনসেপ্ট ল্যাব
            </button>
            <button
              onClick={() => setActiveTab('example')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'example'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">২.</span> উদাহরণ দেখুন
            </button>
            <button
              onClick={() => setActiveTab('try')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'try'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">৩.</span> নিজে চেষ্টা করুন
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">৪.</span> অনুধাবন যাচাই
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">৫.</span> সারসংক্ষেপ
            </button>
            <button
              onClick={() => setIsAiOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs sm:text-sm font-semibold shadow hover:opacity-95 transition flex items-center gap-1.5 ml-1"
              title="শেরু এআই টিউটর খুলুন"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">শেরু এআই টিউটর</span>
            </button>
          </nav>
        </div>
      </header>

      {/* -------------------------------------------------------------------------
          MAIN CONTENT CONTAINER
      ------------------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* =======================================================================
            TAB 1: CONCEPT LABS (৫টি ইন্টারঅ্যাক্টিভ ল্যাব)
        ======================================================================= */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Lab Switcher Horizontal Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {LAB_LESSONS.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setActiveLab(lab.id)}
                  className={`px-4 py-2.5 rounded-xl text-left font-medium transition whitespace-nowrap shrink-0 border ${
                    activeLab === lab.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                  }`}
                >
                  <div className="text-[10px] tracking-wider uppercase opacity-80">{lab.badge}</div>
                  <div className="text-xs sm:text-sm font-bold">{lab.title}</div>
                </button>
              ))}
            </div>

            {/* Current Lab Header Card */}
            {(() => {
              const currentLab = LAB_LESSONS.find((l) => l.id === activeLab)!;
              return (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                        {currentLab.badge}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{currentLab.nctbPage}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">ইন্টারেক্টিভ সিমুলেটর</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
                    {currentLab.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mb-2">{currentLab.subtitle}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentLab.intro}
                  </p>
                </div>
              );
            })()}

            {/* -------------------------------------------------------------------
                LAB 1: SHORT-CUT METHOD FOR MEAN (সংক্ষিপ্ত পদ্ধতিতে গড়)
            ------------------------------------------------------------------- */}
            {activeLab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Interactive Frequency Table & Controls */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-amber-500" />
                          উপাত্ত সারণি ও বিচ্যুতি বিন্যাস
                        </h3>
                        <p className="text-xs text-slate-500">
                          যেকোনো শ্রেণির অনুমিত গড় ($a$) ক্লিক করে পরিবর্তন করুন অথবা স্লাইডার দিয়ে গণসংখ্যা বদলান।
                        </p>
                      </div>

                      {/* Dataset Presets */}
                      <div className="flex items-center gap-1">
                        {PRESETS.map((p, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setDataRows(p.rows);
                              setAssumedIdx(Math.floor(p.rows.length / 2));
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-700 dark:text-slate-300 transition"
                          >
                            নমুনা {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                            <th className="py-2.5 px-3 font-semibold">শ্রেণিব্যাপ্তি</th>
                            <th className="py-2.5 px-3 font-semibold text-center">
                              মধ্যবিন্দু (xᵢ)
                            </th>
                            <th className="py-2.5 px-3 font-semibold text-center">গণসংখ্যা (fᵢ)</th>
                            <th className="py-2.5 px-3 font-semibold text-center">
                              বিচ্যুতি (uᵢ)
                            </th>
                            <th className="py-2.5 px-3 font-semibold text-right">fᵢuᵢ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {tableDataWithDeviations.map((row, idx) => {
                            const isAssumed = idx === assumedIdx;
                            return (
                              <tr
                                key={idx}
                                className={`transition ${
                                  isAssumed
                                    ? 'bg-amber-500/10 dark:bg-amber-500/20 font-semibold'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <td className="py-3 px-3 flex items-center gap-2">
                                  <button
                                    onClick={() => setAssumedIdx(idx)}
                                    className={`px-2 py-0.5 rounded text-xs transition ${
                                      isAssumed
                                        ? 'bg-amber-600 text-white font-bold'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-white'
                                    }`}
                                    title="এটিকে অনুমিত গড় (a) নির্বাচন করুন"
                                  >
                                    {isAssumed ? 'a চিহ্নিত' : 'a ধরুন'}
                                  </button>
                                  <span>{row.range}</span>
                                </td>
                                <td className="py-3 px-3 text-center font-mono">
                                  {row.mid.toFixed(1)}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <input
                                      type="range"
                                      min={1}
                                      max={30}
                                      value={row.f}
                                      onChange={(e) => handleFreqChange(idx, parseInt(e.target.value))}
                                      className="w-16 accent-amber-600 hidden sm:block"
                                    />
                                    <span className="font-bold text-slate-900 dark:text-white w-6">
                                      {row.f}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center font-mono font-bold">
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      row.u === 0
                                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-extrabold'
                                        : row.u < 0
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                  >
                                    {row.u > 0 ? `+${row.u}` : row.u}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold">
                                  <span
                                    className={
                                      row.fu === 0
                                        ? 'text-slate-400'
                                        : row.fu < 0
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                    }
                                  >
                                    {row.fu > 0 ? `+${row.fu}` : row.fu}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700">
                            <td className="py-2.5 px-3" colSpan={2}>
                              মোট যোগফল
                            </td>
                            <td className="py-2.5 px-3 text-center text-amber-600 dark:text-amber-400 font-mono">
                              N = {totalN}
                            </td>
                            <td className="py-2.5 px-3 text-center text-xs text-slate-400">
                              h = {classIntervalH}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                              ∑fᵢuᵢ = {sumFu}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <strong>পরীক্ষকের গোল্ডেন টিপ:</strong> অনুমিত গড় ($a$) যে শ্রেণিতে ধরা হয়, সেই শ্রেণির
                        বিচ্যুতি <RenderMathText text="u_i = \\frac{x_i - a}{h} = 0" /> হবেই। উপরের শ্রেণিতে $-1, -2$ এবং নিচের শ্রেণিতে $+1, +2$
                        বসিয়ে সময় বাঁচানো যায়!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Step-by-Step Derivation & Verification */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm border border-slate-800 space-y-4">
                    <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                      <span>সংক্ষিপ্ত গড় গণনা বোর্ড</span>
                      <Calculator className="w-4 h-4" />
                    </h3>

                    {/* Extracted Parameters */}
                    <div className="space-y-2 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">অনুমিত গড় (a):</span>
                        <span className="text-amber-400 font-bold">{assumedMeanA.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">মোট গণসংখ্যা (N):</span>
                        <span className="text-white font-bold">{totalN}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">শ্রেণি ব্যাপ্তি (h):</span>
                        <span className="text-white font-bold">{classIntervalH}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">বিচ্যুতি গুণফল (∑fᵢuᵢ):</span>
                        <span className="text-emerald-400 font-bold">{sumFu}</span>
                      </div>
                    </div>

                    {/* Step by step formula */}
                    <div className="space-y-2 text-xs">
                      <div className="text-slate-400">গাণিতিক সূত্র:</div>
                      <div className="p-2.5 bg-slate-800/80 rounded-lg text-amber-300 text-center font-mono">
                        <RenderMathText text="\\bar{x} = a + \\frac{\\sum f_i u_i}{N} \\times h" />
                      </div>

                      <div className="text-slate-400 mt-2">মান বসিয়ে ধাপসমূহ:</div>
                      <div className="p-3 bg-slate-950/80 rounded-lg font-mono text-slate-300 space-y-1 text-[11px]">
                        <div>= {assumedMeanA.toFixed(1)} + ({sumFu} / {totalN}) × {classIntervalH}</div>
                        <div>= {assumedMeanA.toFixed(1)} + {((sumFu / totalN) * classIntervalH).toFixed(3)}</div>
                        <div className="text-emerald-400 font-bold text-sm pt-1 border-t border-slate-800 flex justify-between">
                          <span>নির্ণেয় গড় (x̄):</span>
                          <span>{calculatedMean.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Mean Verification */}
                    <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        সরাসরি গড় দ্বারা যাচাই:
                      </div>
                      <div className="text-slate-300 font-mono text-[11px]">
                        ∑fᵢxᵢ / N = {sumFx.toFixed(1)} / {totalN} ={' '}
                        <strong className="text-emerald-300">{directMean.toFixed(2)}</strong>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        উভয় পদ্ধতিতে উত্তর হুবহু এক ({calculatedMean.toFixed(2)})!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                LAB 2: MEDIAN LAB (মধ্যক নির্ণয় ও ক্রমযোজিত সারণি)
            ------------------------------------------------------------------- */}
            {activeLab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Cumulative Frequency Table & Median Class Highlight */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Activity className="w-4 h-4 text-sky-500" />
                          ক্রমযোজিত গণসংখ্যা সারণি ও মধ্যক শ্রেণি
                        </h3>
                        <p className="text-xs text-slate-500">
                          N/2 = {halfN} তম পদ যে শ্রেণিতে অন্তর্ভুক্ত, সেটিই মধ্যক শ্রেণি (হাইলাইট করা হয়েছে)।
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-xs rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-bold">
                        N = {totalN}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                            <th className="py-2.5 px-3 font-semibold">শ্রেণিব্যাপ্তি</th>
                            <th className="py-2.5 px-3 font-semibold text-center">গণসংখ্যা (fᵢ)</th>
                            <th className="py-2.5 px-3 font-semibold text-right">
                              ক্রমযোজিত গণসংখ্যা (F_c)
                            </th>
                            <th className="py-2.5 px-3 font-semibold text-center">অবস্থান</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {tableWithFc.map((row, idx) => {
                            const isMedianClass = idx === medianClassIdx;
                            const isPreMedianClass = idx === medianClassIdx - 1;
                            return (
                              <tr
                                key={idx}
                                className={`transition ${
                                  isMedianClass
                                    ? 'bg-sky-500/15 dark:bg-sky-500/25 font-bold border-l-4 border-sky-600'
                                    : isPreMedianClass
                                    ? 'bg-amber-500/5 dark:bg-amber-500/10'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <span>{row.range}</span>
                                    {isMedianClass && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-600 text-white uppercase tracking-wider font-extrabold">
                                        মধ্যক শ্রেণি
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center font-mono">
                                  <span
                                    className={
                                      isMedianClass
                                        ? 'text-sky-600 dark:text-sky-400 font-extrabold text-base'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }
                                  >
                                    {row.f}
                                  </span>
                                  {isMedianClass && (
                                    <span className="text-[10px] text-sky-500 block font-normal">
                                      (fₘ = {row.f})
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-right font-mono font-bold">
                                  <span
                                    className={
                                      isPreMedianClass
                                        ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                                        : 'text-slate-900 dark:text-white'
                                    }
                                  >
                                    {row.cumulativeF}
                                  </span>
                                  {isPreMedianClass && (
                                    <span className="text-[10px] text-amber-500 block font-normal">
                                      (Fc = {row.cumulativeF})
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-center text-xs text-slate-400">
                                  {idx === 0
                                    ? `১ – ${row.cumulativeF}`
                                    : `${tableWithFc[idx - 1].cumulativeF + 1} – ${row.cumulativeF}`}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-900/40 text-xs text-sky-800 dark:text-sky-300">
                      <strong>শ্রেণি নির্বাচনের কৌশল:</strong> মোট গণসংখ্যা N = {totalN}। সুতরাং N/2 = {halfN}।
                      যেহেতু {tableWithFc[medianClassIdx - 1]?.cumulativeF ?? 0} এর পর থেকে {medianClass?.cumulativeF} পর্যন্ত মান{' '}
                      <strong>{medianClass?.range}</strong> শ্রেণিতে রয়েছে, তাই এটিই মধ্যক শ্রেণি।
                    </div>
                  </div>
                </div>

                {/* Right Column: Median Calculation & Parameter Breakdown */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm border border-slate-800 space-y-4">
                    <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                      <span>মধ্যক নির্ণয় সমীকরণ</span>
                      <Calculator className="w-4 h-4" />
                    </h3>

                    {/* Formula Card */}
                    <div className="p-3 bg-slate-800/90 rounded-xl text-center text-sky-300 font-mono text-sm">
                      <RenderMathText text="\\text{Median} = L + \\left(\\frac{N}{2} - F_c\\right) \\times \\frac{h}{f_m}" />
                    </div>

                    {/* Parameter Explanation List */}
                    <div className="space-y-2 text-xs font-mono bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">L (মধ্যক শ্রেণির নিম্নসীমা):</span>
                        <span className="text-sky-400 font-bold text-sm">{L_med}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">N/2 (মোট গণসংখ্যার অর্ধাংশ):</span>
                        <span className="text-white font-bold">{halfN}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">F_c (পূর্ববর্তী ক্রমযোজিত গণসংখ্যা):</span>
                        <span className="text-amber-400 font-bold">{Fc_med}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">f_m (মধ্যক শ্রেণির গণসংখ্যা):</span>
                        <span className="text-sky-300 font-bold">{fm_med}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">h (শ্রেণি ব্যাপ্তি):</span>
                        <span className="text-white font-bold">{classIntervalH}</span>
                      </div>
                    </div>

                    {/* Step-by-Step Substitution */}
                    <div className="space-y-1.5 p-3 bg-slate-950/80 rounded-xl font-mono text-xs text-slate-300">
                      <div className="text-slate-400 text-[11px]">ধাপে ধাপে সমাধান:</div>
                      <div>= {L_med} + ({halfN} - {Fc_med}) × ({classIntervalH} / {fm_med})</div>
                      <div>= {L_med} + {(halfN - Fc_med).toFixed(1)} × {(classIntervalH / fm_med).toFixed(3)}</div>
                      <div>= {L_med} + {(((halfN - Fc_med) * classIntervalH) / fm_med).toFixed(2)}</div>
                      <div className="pt-2 border-t border-slate-800 text-emerald-400 font-bold text-base flex justify-between">
                        <span>নির্ণেয় মধ্যক:</span>
                        <span>{calculatedMedian.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Warning about Fc */}
                    <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      <div>
                        <strong>সতর্কতা:</strong> অনেক শিক্ষার্থী F_c-এর জায়গায় মধ্যক শ্রেণির ক্রমযোজিত গণসংখ্যা বসিয়ে ফেলে।
                        মনে রাখবে, F_c হলো মধ্যক শ্রেণির ঠিক <u>আগের</u> শ্রেণির ক্রমযোজিত গণসংখ্যা!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                LAB 3: MODE LAB (প্রচুরক নির্ণয় সিমুলেটর)
            ------------------------------------------------------------------- */}
            {activeLab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Frequency Distribution with Modal Class Identification */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-orange-500" />
                          সর্বোচ্চ গণসংখ্যা ও প্রচুরক শ্রেণি
                        </h3>
                        <p className="text-xs text-slate-500">
                          সর্বাধিক গণসংখ্যা ({maxFreq}) বিদ্যমান থাকায়{' '}
                          <strong className="text-orange-600 dark:text-orange-400">{modalClass?.range}</strong> প্রচুরক
                          শ্রেণি।
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-bold">
                        fₘₐₓ = {maxFreq}
                      </span>
                    </div>

                    {/* Interactive Frequency Visualizer */}
                    <div className="space-y-3">
                      {dataRows.map((row, idx) => {
                        const isModal = idx === modalClassIdx;
                        const isPreModal = idx === modalClassIdx - 1;
                        const isPostModal = idx === modalClassIdx + 1;
                        const barWidth = `${Math.min(100, (row.f / 30) * 100)}%`;

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border transition ${
                              isModal
                                ? 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/60 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                              <span className="flex items-center gap-2">
                                <strong>{row.range}</strong>
                                {isModal && (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-orange-600 text-white font-bold">
                                    প্রচুরক শ্রেণি (fₘ = {row.f})
                                  </span>
                                )}
                                {isPreModal && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    (পূর্ববর্তী fₘ₋₁ = {row.f})
                                  </span>
                                )}
                                {isPostModal && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    (পরবর্তী fₘ₊₁ = {row.f})
                                  </span>
                                )}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                  গণসংখ্যা: {row.f}
                                </span>
                              </div>
                            </div>

                            {/* Bar & Slider */}
                            <div className="flex items-center gap-3">
                              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full flex-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isModal
                                      ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                                      : 'bg-slate-400 dark:bg-slate-500'
                                  }`}
                                  style={{ width: barWidth }}
                                />
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={30}
                                value={row.f}
                                onChange={(e) => handleFreqChange(idx, parseInt(e.target.value))}
                                className="w-24 accent-orange-600"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Edge case test buttons */}
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl space-y-2">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        বোর্ড ট্র্যাপ টেস্ট (প্রান্তিক শ্রেণি প্রচুরক হলে):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            const updated = [...dataRows];
                            updated[0].f = 25; // make first class modal
                            setDataRows(updated);
                          }}
                          className="px-3 py-1 text-xs rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 hover:bg-orange-200 transition font-medium"
                        >
                          ১ম শ্রেণি প্রচুরক বানাও (fₘ₋₁ = 0)
                        </button>
                        <button
                          onClick={() => {
                            const updated = [...dataRows];
                            updated[updated.length - 1].f = 25; // make last class modal
                            setDataRows(updated);
                          }}
                          className="px-3 py-1 text-xs rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 hover:bg-orange-200 transition font-medium"
                        >
                          শেষ শ্রেণি প্রচুরক বানাও (fₘ₊₁ = 0)
                        </button>
                        <button
                          onClick={() => setDataRows(DEFAULT_DATA)}
                          className="px-3 py-1 text-xs rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
                        >
                          রিসেট ডিফল্ট
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Mode Formula & Derivation */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm border border-slate-800 space-y-4">
                    <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center justify-between">
                      <span>প্রচুরক নির্ণয় ক্যালকুলেটর</span>
                      <Calculator className="w-4 h-4" />
                    </h3>

                    {/* Formula */}
                    <div className="p-3 bg-slate-800/90 rounded-xl text-center text-orange-300 font-mono text-sm">
                      <RenderMathText text="\\text{Mode} = L + \\frac{f_1}{f_1 + f_2} \\times h" />
                    </div>

                    {/* Parameter Values */}
                    <div className="space-y-2 text-xs font-mono bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">L (প্রচুরক শ্রেণির নিম্নসীমা):</span>
                        <span className="text-orange-400 font-bold text-sm">{L_mode}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">f₁ = fₘ - fₘ₋₁ :</span>
                        <span className="text-emerald-400 font-bold">
                          {modalClass.f} - {prevFreq} = {f1}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">f₂ = fₘ - fₘ₊₁ :</span>
                        <span className="text-emerald-400 font-bold">
                          {modalClass.f} - {nextFreq} = {f2}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">h (শ্রেণি ব্যাপ্তি):</span>
                        <span className="text-white font-bold">{classIntervalH}</span>
                      </div>
                    </div>

                    {/* Step-by-Step Substitution */}
                    <div className="space-y-1.5 p-3 bg-slate-950/80 rounded-xl font-mono text-xs text-slate-300">
                      <div className="text-slate-400 text-[11px]">ধাপে ধাপে সমাধান:</div>
                      <div>= {L_mode} + [{f1} / ({f1} + {f2})] × {classIntervalH}</div>
                      <div>= {L_mode} + [{f1} / {f1 + f2}] × {classIntervalH}</div>
                      <div>
                        = {L_mode} +{' '}
                        {f1 + f2 > 0 ? ((f1 / (f1 + f2)) * classIntervalH).toFixed(3) : '0'}
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-orange-400 font-bold text-base flex justify-between">
                        <span>নির্ণেয় প্রচুরক:</span>
                        <span>{calculatedMode.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Trap Note */}
                    <div className="p-3 bg-orange-950/30 border border-orange-800/40 rounded-xl text-xs text-orange-300">
                      <strong>বিশেষ নিয়ম:</strong> ১ম শ্রেণি প্রচুরক হলে পূর্ববর্তী শ্রেণির গণসংখ্যা না থাকায় <RenderMathText text="f_1 = f_m - 0 = f_m" />।
                      একইভাবে শেষ শ্রেণি প্রচুরক হলে পরবর্তী শ্রেণির গণসংখ্যা ০ ধরা হয় (<RenderMathText text="f_2 = f_m - 0 = f_m" />)!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                LAB 4: OGIVE CURVE & GRAPHICAL MEDIAN (অজিভ রেখা)
            ------------------------------------------------------------------- */}
            {activeLab === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Interactive SVG Ogive Curve */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-indigo-500" />
                          অজিভ রেখা (Ogive Curve) ও মধ্যক প্রজেকশন
                        </h3>
                        <p className="text-xs text-slate-500">
                          X-অক্ষে শ্রেণির উচ্চসীমা এবং Y-অক্ষে ক্রমযোজিত গণসংখ্যা ($F_c$) স্থাপন করা হয়েছে।
                        </p>
                      </div>

                      <button
                        onClick={() => setShowOgiveMedianProjection(!showOgiveMedianProjection)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                          showOgiveMedianProjection
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        মধ্যক প্রজেকশন রেখা {showOgiveMedianProjection ? 'চালু' : 'বন্ধ'}
                      </button>
                    </div>

                    {/* SVG Canvas for Ogive */}
                    <div className="w-full bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800">
                      <svg
                        viewBox="0 0 540 320"
                        className="w-full h-auto min-w-[480px] select-none font-mono"
                      >
                        {/* Grid lines */}
                        <defs>
                          <pattern
                            id="ogiveGrid"
                            width="40"
                            height="30"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 40 0 L 0 0 0 30"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect x="60" y="20" width="440" height="240" fill="url(#ogiveGrid)" />

                        {/* Axes */}
                        <line x1="60" y1="260" x2="510" y2="260" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="60" y1="20" x2="60" y2="260" stroke="#94a3b8" strokeWidth="2" />

                        {/* Broken Axis Indicator at origin */}
                        <path
                          d="M 68 256 L 72 264 M 74 256 L 78 264"
                          stroke="#f59e0b"
                          strokeWidth="2"
                        />
                        <text x="68" y="278" fill="#f59e0b" fontSize="9">
                          ভাঙা দাগ
                        </text>

                        {/* Y-Axis Labels (Fc: 0 to 50) */}
                        {[0, 10, 20, 30, 40, 50].map((val) => {
                          const yPos = 260 - (val / 50) * 220;
                          return (
                            <g key={val}>
                              <line
                                x1="55"
                                y1={yPos}
                                x2="60"
                                y2={yPos}
                                stroke="#94a3b8"
                                strokeWidth="1"
                              />
                              <text
                                x="50"
                                y={yPos + 4}
                                fill="#94a3b8"
                                fontSize="10"
                                textAnchor="end"
                              >
                                {val}
                              </text>
                            </g>
                          );
                        })}
                        <text
                          x="25"
                          y="140"
                          fill="#38bdf8"
                          fontSize="11"
                          fontWeight="bold"
                          transform="rotate(-90 25 140)"
                          textAnchor="middle"
                        >
                          ক্রমযোজিত গণসংখ্যা (Fc) →
                        </text>

                        {/* X-Axis Points and Labels (Upper Limits: 30, 40, 50, 60, 70, 80, 90) */}
                        {(() => {
                          // Coordinates generator
                          // x goes from 30 to 90 -> width 420 px (from x=80 to x=500)
                          const minX = 30;
                          const maxX = 90;
                          const getSvgX = (val: number) => 80 + ((val - minX) / (maxX - minX)) * 410;
                          const getSvgY = (fcVal: number) => 260 - (fcVal / 50) * 220;

                          // Points for ogive curve: start at (30, 0)
                          const points = [{ x: 30, fc: 0 }];
                          tableWithFc.forEach((r) => {
                            points.push({ x: r.high, fc: r.cumulativeF });
                          });

                          const pathD = points
                            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getSvgX(p.x)} ${getSvgY(p.fc)}`)
                            .join(' ');

                          // Median Coordinates
                          const medianSvgY = getSvgY(halfN);
                          const medianSvgX = getSvgX(calculatedMedian);

                          return (
                            <>
                              {/* X Axis ticks */}
                              {points.map((p) => {
                                const px = getSvgX(p.x);
                                return (
                                  <g key={p.x}>
                                    <line
                                      x1={px}
                                      y1="260"
                                      x2={px}
                                      y2="265"
                                      stroke="#94a3b8"
                                      strokeWidth="1"
                                    />
                                    <text
                                      x={px}
                                      y="278"
                                      fill="#94a3b8"
                                      fontSize="10"
                                      textAnchor="middle"
                                    >
                                      {p.x}
                                    </text>
                                  </g>
                                );
                              })}
                              <text
                                x="290"
                                y="300"
                                fill="#a855f7"
                                fontSize="11"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                শ্রেণির উচ্চসীমা →
                              </text>

                              {/* Ogive Path */}
                              <path
                                d={pathD}
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Points dots */}
                              {points.map((p) => (
                                <g key={p.x}>
                                  <circle
                                    cx={getSvgX(p.x)}
                                    cy={getSvgY(p.fc)}
                                    r="5"
                                    fill="#818cf8"
                                    stroke="#1e1b4b"
                                    strokeWidth="2"
                                  />
                                  <text
                                    x={getSvgX(p.x) - 4}
                                    y={getSvgY(p.fc) - 8}
                                    fill="#c7d2fe"
                                    fontSize="9"
                                    fontWeight="bold"
                                  >
                                    ({p.x}, {p.fc})
                                  </text>
                                </g>
                              ))}

                              {/* Median Projection Lines */}
                              {showOgiveMedianProjection && (
                                <g>
                                  {/* Horizontal dashed line from (60, medianSvgY) to curve */}
                                  <line
                                    x1="60"
                                    y1={medianSvgY}
                                    x2={medianSvgX}
                                    y2={medianSvgY}
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    strokeDasharray="4 3"
                                  />
                                  {/* Vertical dashed line from curve down to x-axis */}
                                  <line
                                    x1={medianSvgX}
                                    y1={medianSvgY}
                                    x2={medianSvgX}
                                    y2="260"
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    strokeDasharray="4 3"
                                  />
                                  {/* Intersection circle */}
                                  <circle
                                    cx={medianSvgX}
                                    cy={medianSvgY}
                                    r="6"
                                    fill="#f43f5e"
                                    stroke="#fff"
                                    strokeWidth="2"
                                  />
                                  {/* Median Callout text on X-axis */}
                                  <rect
                                    x={medianSvgX - 35}
                                    y="238"
                                    width="70"
                                    height="20"
                                    rx="4"
                                    fill="#f43f5e"
                                  />
                                  <text
                                    x={medianSvgX}
                                    y="252"
                                    fill="#fff"
                                    fontSize="10"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                  >
                                    মধ্যক ≈ {calculatedMedian.toFixed(1)}
                                  </text>

                                  {/* N/2 Callout on Y-axis */}
                                  <rect
                                    x="10"
                                    y={medianSvgY - 9}
                                    width="48"
                                    height="18"
                                    rx="3"
                                    fill="#f43f5e"
                                  />
                                  <text
                                    x="34"
                                    y={medianSvgY + 4}
                                    fill="#fff"
                                    fontSize="9"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                  >
                                    N/2={halfN}
                                  </text>
                                </g>
                              )}
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300">
                      <strong>অজিভ রেখা থেকে মধ্যক পাওয়ার নিয়ম:</strong> Y-অক্ষে N/2 = {halfN} বিন্দু চিহ্নিত করি।
                      সেখান থেকে X-অক্ষের সমান্তরাল রেখা টেনে অজিভ রেখার সাথে ছেদবিন্দু নির্ধারণ করি। উক্ত ছেদবিন্দু
                      হতে X-অক্ষে লম্ব টানলে পাদবিন্দুর মানই হলো মধ্যক (প্রায় {calculatedMedian.toFixed(1)})!
                    </div>
                  </div>
                </div>

                {/* Right Column: Ogive Data Coordinates & Board Rules */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm border border-slate-800 space-y-4">
                    <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                      <span>অজিভ স্থানাঙ্ক সারণি</span>
                      <Grid className="w-4 h-4" />
                    </h3>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="grid grid-cols-3 text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
                        <span>শ্রেণি উচ্চসীমা (X)</span>
                        <span className="text-center">Fc (Y)</span>
                        <span className="text-right">বিন্দু (X, Y)</span>
                      </div>
                      <div className="grid grid-cols-3 text-slate-500 py-1 border-b border-slate-800/40">
                        <span>৩০ (সূচনা)</span>
                        <span className="text-center">০</span>
                        <span className="text-right text-indigo-300">(৩০, ০)</span>
                      </div>
                      {tableWithFc.map((r, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-3 py-1 border-b border-slate-800/40 text-slate-300"
                        >
                          <span>{r.high}</span>
                          <span className="text-center font-bold text-sky-400">{r.cumulativeF}</span>
                          <span className="text-right text-indigo-400 font-bold">
                            ({r.high}, {r.cumulativeF})
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        বোর্ড পরীক্ষার ৪টি অঙ্কন নিয়ম:
                      </h4>
                      <ul className="space-y-1.5 text-[11px] list-disc list-inside text-slate-400">
                        <li>
                          <strong className="text-slate-200">ভাঙা দাগ (Broken line):</strong> মূলবিন্দু $(0, 0)$ থেকে প্রথম
                          উচ্চসীমার পূর্বের মান বোঝাতে $X$-অক্ষে ভাঙা দাগ দিতে হবে।
                        </li>
                        <li>
                          <strong className="text-slate-200">অক্ষ নির্ধারণ:</strong> $X$-অক্ষে শ্রেণির উচ্চসীমা ও $Y$-অক্ষে
                          ক্রমযোজিত গণসংখ্যা স্থাপন বাধ্যতামূলক।
                        </li>
                        <li>
                          <strong className="text-slate-200">স্কেল উল্লেখ:</strong> গ্রাফ পেপারের প্রতি ক্ষুদ্রতম বর্গের মান
                          বিবরণে অবশ্যই লিখতে হবে (যেমন: প্রতি ঘর = ২ একক)।
                        </li>
                        <li>
                          <strong className="text-slate-200">বক্ররেখা:</strong> বিন্দুগুলো ফ্রি-হ্যান্ড মসৃণ বক্ররেখা দ্বারা
                          যুক্ত করা উত্তম।
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------------
                LAB 5: HISTOGRAM & FREQUENCY POLYGON (আয়তলেখ ও গণসংখ্যা বহুভুজ)
            ------------------------------------------------------------------- */}
            {activeLab === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Interactive Histogram & Polygon Canvas */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-emerald-500" />
                          আয়তলেখ ও গণসংখ্যা বহুভুজ সিমুলেটর
                        </h3>
                        <p className="text-xs text-slate-500">
                          অবিচ্ছিন্ন শ্রেণিসীমার ভিত্তিতে আয়তলেখ ও শ্রেণি মধ্যবিন্দুর ভিত্তিতে গণসংখ্যা বহুভুজ।
                        </p>
                      </div>

                      {/* Display Toggles */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => setShowHistogramBars(!showHistogramBars)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            showHistogramBars
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          স্তম্ভ (Histogram)
                        </button>
                        <button
                          onClick={() => setShowPolygonLine(!showPolygonLine)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            showPolygonLine
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          বহুভুজ (Polygon)
                        </button>
                        <button
                          onClick={() => setShowModalCrossInHistogram(!showModalCrossInHistogram)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            showModalCrossInHistogram
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          প্রচুরক ক্রস-রেখা
                        </button>
                      </div>
                    </div>

                    {/* SVG Canvas for Histogram & Polygon */}
                    <div className="w-full bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800">
                      <svg
                        viewBox="0 0 540 320"
                        className="w-full h-auto min-w-[480px] select-none font-mono"
                      >
                        {/* Axes */}
                        <line x1="50" y1="260" x2="520" y2="260" stroke="#94a3b8" strokeWidth="2" />
                        <line x1="50" y1="20" x2="50" y2="260" stroke="#94a3b8" strokeWidth="2" />

                        {/* Broken Axis Indicator at origin */}
                        <path
                          d="M 56 256 L 60 264 M 62 256 L 66 264"
                          stroke="#f59e0b"
                          strokeWidth="2"
                        />

                        {/* Y-Axis Ticks (Frequency: 0, 5, 10, 15, 20) */}
                        {[0, 5, 10, 15, 20].map((val) => {
                          const yPos = 260 - (val / 20) * 220;
                          return (
                            <g key={val}>
                              <line
                                x1="45"
                                y1={yPos}
                                x2="50"
                                y2={yPos}
                                stroke="#94a3b8"
                                strokeWidth="1"
                              />
                              <text
                                x="40"
                                y={yPos + 4}
                                fill="#94a3b8"
                                fontSize="10"
                                textAnchor="end"
                              >
                                {val}
                              </text>
                            </g>
                          );
                        })}
                        <text
                          x="20"
                          y="140"
                          fill="#34d399"
                          fontSize="11"
                          fontWeight="bold"
                          transform="rotate(-90 20 140)"
                          textAnchor="middle"
                        >
                          গণসংখ্যা (fi) →
                        </text>

                        {/* X-Axis Setup for Continuous boundaries */}
                        {(() => {
                          // We have continuous boundaries: 30.5, 40.5, 50.5, 60.5, 70.5, 80.5, 90.5
                          const startX = 70;
                          const barWidth = 60; // 6 classes * 60 = 360 px
                          const getBarX = (idx: number) => startX + idx * barWidth;
                          const getY = (f: number) => 260 - (f / 20) * 220;

                          // Modal cross lines points
                          const modalBarX = getBarX(modalClassIdx);
                          const modalBarY = getY(modalClass.f);
                          const prevBarY = modalClassIdx > 0 ? getY(dataRows[modalClassIdx - 1].f) : 260;
                          const nextBarY =
                            modalClassIdx < dataRows.length - 1
                              ? getY(dataRows[modalClassIdx + 1].f)
                              : 260;

                          // Graphical Mode X position
                          const modeXInSvg =
                            modalBarX + (f1 / (f1 + f2 > 0 ? f1 + f2 : 1)) * barWidth;

                          // Polygon points: include (start - midpoint, 0) and (end + midpoint, 0)
                          const polyPoints: Array<{ x: number; y: number; label?: string }> = [];
                          polyPoints.push({ x: startX - barWidth / 2, y: 260 });
                          dataRows.forEach((r, idx) => {
                            polyPoints.push({
                              x: getBarX(idx) + barWidth / 2,
                              y: getY(r.f),
                              label: `${r.f}`,
                            });
                          });
                          polyPoints.push({
                            x: getBarX(dataRows.length - 1) + barWidth * 1.5,
                            y: 260,
                          });

                          const polyD = polyPoints
                            .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                            .join(' ');

                          return (
                            <>
                              {/* Histogram Bars */}
                              {showHistogramBars &&
                                dataRows.map((r, idx) => {
                                  const bx = getBarX(idx);
                                  const by = getY(r.f);
                                  const bh = 260 - by;
                                  const isModal = idx === modalClassIdx;

                                  return (
                                    <g key={idx}>
                                      <rect
                                        x={bx}
                                        y={by}
                                        width={barWidth}
                                        height={bh}
                                        fill={isModal ? 'rgba(249, 115, 22, 0.45)' : 'rgba(16, 185, 129, 0.35)'}
                                        stroke={isModal ? '#f97316' : '#10b981'}
                                        strokeWidth="1.5"
                                      />
                                      <text
                                        x={bx + barWidth / 2}
                                        y={by - 6}
                                        fill={isModal ? '#fb923c' : '#6ee7b7'}
                                        fontSize="10"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                      >
                                        {r.f}
                                      </text>
                                    </g>
                                  );
                                })}

                              {/* Continuous Boundary X-Ticks */}
                              {[30.5, 40.5, 50.5, 60.5, 70.5, 80.5, 90.5].map((val, idx) => {
                                const px = startX + idx * barWidth;
                                return (
                                  <g key={val}>
                                    <line
                                      x1={px}
                                      y1="260"
                                      x2={px}
                                      y2="266"
                                      stroke="#94a3b8"
                                      strokeWidth="1"
                                    />
                                    <text
                                      x={px}
                                      y="280"
                                      fill="#94a3b8"
                                      fontSize="9"
                                      textAnchor="middle"
                                    >
                                      {val}
                                    </text>
                                  </g>
                                );
                              })}
                              <text
                                x="260"
                                y="302"
                                fill="#94a3b8"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                অবিচ্ছিন্ন শ্রেণিসীমা →
                              </text>

                              {/* Modal Class Cross Lines on Histogram */}
                              {showModalCrossInHistogram && showHistogramBars && (
                                <g>
                                  {/* Line 1: top-left corner of modal bar to top-right corner of prev bar */}
                                  <line
                                    x1={modalBarX}
                                    y1={modalBarY}
                                    x2={modalBarX}
                                    y2={prevBarY}
                                    stroke="#f43f5e"
                                    strokeWidth="1.5"
                                    strokeDasharray="3 3"
                                  />
                                  <line
                                    x1={modalBarX}
                                    y1={modalBarY}
                                    x2={modalBarX + barWidth}
                                    y2={nextBarY}
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                  />
                                  {/* Line 2: top-right corner of modal bar to top-left corner of next bar */}
                                  <line
                                    x1={modalBarX + barWidth}
                                    y1={modalBarY}
                                    x2={modalBarX}
                                    y2={prevBarY}
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                  />
                                  {/* Vertical Drop line from intersection to X-axis */}
                                  <line
                                    x1={modeXInSvg}
                                    y1={modalBarY + ((nextBarY - modalBarY) * f1) / (f1 + f2 || 1)}
                                    x2={modeXInSvg}
                                    y2="260"
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    strokeDasharray="4 2"
                                  />
                                  <circle
                                    cx={modeXInSvg}
                                    cy="260"
                                    r="4"
                                    fill="#f43f5e"
                                  />
                                  <text
                                    x={modeXInSvg}
                                    y="250"
                                    fill="#fb7185"
                                    fontSize="9"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                  >
                                    প্রচুরক ≈ {calculatedMode.toFixed(1)}
                                  </text>
                                </g>
                              )}

                              {/* Frequency Polygon Line */}
                              {showPolygonLine && (
                                <g>
                                  <path
                                    d={polyD}
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                  />
                                  {polyPoints.map((p, i) => (
                                    <circle
                                      key={i}
                                      cx={p.x}
                                      cy={p.y}
                                      r={p.label ? '4.5' : '3'}
                                      fill="#f59e0b"
                                      stroke="#451a03"
                                      strokeWidth="1.5"
                                    />
                                  ))}
                                </g>
                              )}
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>আয়তলেখ থেকে প্রচুরক নির্ণয়ের পদ্ধতি:</strong> সর্বোচ্চ স্তম্ভের শীর্ষের ডান কোণটি পূর্বের
                      স্তম্ভের শীর্ষের সাথে এবং বাম কোণটি পরের স্তম্ভের শীর্ষের সাথে কোণাকুণি যুক্ত করলে যে ছেদবিন্দু
                      পাওয়া যায়, সেখান থেকে X-অক্ষে লম্ব টানলে প্রচুরক ({calculatedMode.toFixed(1)}) পাওয়া যায়!
                    </div>
                  </div>
                </div>

                {/* Right Column: Continuous Class Boundaries & Polygon Rules */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm border border-slate-800 space-y-4">
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                      <span>অবিচ্ছিন্ন রূপান্তর সারণি</span>
                      <Layers className="w-4 h-4" />
                    </h3>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="grid grid-cols-3 text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
                        <span>শ্রেণি</span>
                        <span className="text-center">অবিচ্ছিন্ন সীমা</span>
                        <span className="text-right">মধ্যবিন্দু</span>
                      </div>
                      {dataRows.map((r, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-3 py-1 border-b border-slate-800/40 text-slate-300"
                        >
                          <span>{r.range}</span>
                          <span className="text-center font-bold text-emerald-400">
                            {r.low - 0.5}–{r.high + 0.5}
                          </span>
                          <span className="text-right text-amber-400">{r.mid.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                      <h4 className="font-bold text-amber-400">কেন ০.৫ বিয়োগ ও যোগ করা হয়?</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        ৩১–৪০ এবং ৪১–৫০ শ্রেণির মাঝে ৪০ থেকে ৪১-এর ১ এককের শূন্যস্থান (gap) থাকে। আয়তলেখের
                        স্তম্ভগুলোকে পরস্পর গায়ে গায়ে লাগাতে নিম্নসীমা থেকে ০.৫ বিয়োগ এবং উচ্চসীমার সাথে ০.৫ যোগ
                        করে অবিচ্ছিন্ন শ্রেণিসীমা (৩০.৫–৪০.৫) তৈরি করা হয়।
                      </p>
                    </div>

                    <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                      <strong>বহুভুজ অঙ্কন টিপ:</strong> বহুভুজের দুই প্রান্ত অবশ্যই প্রথম শ্রেণির পূর্বের মধ্যবিন্দু
                      (২৫.৫) এবং শেষ শ্রেণির পরের মধ্যবিন্দু (৯৫.৫)-এ ভূমির (Y=0) সাথে যুক্ত করতে হবে!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================================
            TAB 2: SEE EXAMPLES (৩টি সম্পূর্ণ সমাধানকৃত সৃজনশীল বোর্ড প্রশ্ন)
        ======================================================================= */}
        {activeTab === 'example' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
                বোর্ড পরীক্ষার পূর্ণাঙ্গ সৃজনশীল প্রশ্ন (CQ) ও সমাধান
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                এসএসসি ঢাকা, চট্টগ্রাম ও রাজশাহী শিক্ষা বোর্ডের সাম্প্রতিক সৃজনশীল প্রশ্ন, নম্বর বণ্টন রুব্রিক ও
                পরীক্ষকদের গোপন মূল্যায়ন নির্দেশিকা।
              </p>
            </div>

            {/* CQ 1: Dhaka Board 2024 / Cumilla 2023 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    সৃজনশীল প্রশ্ন ০১ • ঢাকা বোর্ড ২০২৪ / কুমিল্লা ২০২৩
                  </span>
                  <span className="text-xs text-slate-500">পূর্ণমান: ১০</span>
                </div>
                <span className="text-xs font-mono text-slate-400">সংক্ষিপ্ত গড় ও বহুভুজ</span>
              </div>

              {/* Stem (উদ্দীপক) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-sm">
                <strong className="text-slate-900 dark:text-white block mb-2">উদ্দীপক:</strong>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  দশম শ্রেণির ৫০ জন শিক্ষার্থীর গণিতে প্রাপ্ত নম্বরের গণসংখ্যা নিবেশন সারণি নিচে দেওয়া হলো:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full max-w-lg text-xs sm:text-sm border-collapse border border-slate-300 dark:border-slate-700">
                    <tbody>
                      <tr className="bg-slate-200 dark:bg-slate-700 font-semibold text-center">
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">শ্রেণি ব্যাপ্তি</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৩১–৪০</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৪১–৫০</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৫১–৬০</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৬১–৭০</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৭১–৮০</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৮১–৯০</td>
                      </tr>
                      <tr className="text-center font-mono">
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700 font-sans font-medium">গণসংখ্যা</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৪</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৮</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">১০</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700 font-bold text-amber-600">২০</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">১২</td>
                        <td className="p-1.5 border border-slate-300 dark:border-slate-700">৬</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Questions & Solutions */}
              <div className="space-y-4 pt-2">
                {/* Part A */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                    <span>(ক) মধ্যক শ্রেণি চিহ্নিত করে তার মধ্যবিন্দু নির্ণয় কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">২ নম্বর</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono pt-1">
                    <p>মোট গণসংখ্যা N = ৬০ (এখানে ৪+৮+১০+২০+১২+৬ = ৬০)।</p>
                    <p>N/2 = ৬০/২ = ৩০। ৩০-তম পদের অবস্থান ক্রমযোজিত গণসংখ্যা অনুসারে (৪+৮+১০ = ২২ এর পর) ৬১–৭০ শ্রেণিতে।</p>
                    <p className="text-amber-600 dark:text-amber-400 font-bold">
                      ∴ মধ্যক শ্রেণি হলো: ৬১–৭০।
                    </p>
                    <p>
                      মধ্যবিন্দু = (৬১ + ৭০) / ২ = ১৩১ / ২ = <strong className="text-emerald-600">৬৫.৫</strong>।
                    </p>
                  </div>
                </div>

                {/* Part B */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                    <span>(খ) সংক্ষিপ্ত পদ্ধতিতে শিক্ষার্থীদের প্রাপ্ত নম্বরের গড় নির্ণয় কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">৪ নম্বর</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 pt-1">
                    <p>অনুমিত গড় $a = 65.5$, শ্রেণি ব্যাপ্তি $h = 10$ ধরে সারণি তৈরি করি:</p>
                    <div className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] space-y-0.5">
                      <div>• ৩১–৪০: x₁=৩৫.৫, f₁=৪, u₁=-৩, f₁u₁ = -১২</div>
                      <div>• ৪১–৫০: x₂=৪৫.৫, f₂=৮, u₂=-২, f₂u₂ = -১৬</div>
                      <div>• ৫১–৬০: x₃=৫৫.৫, f₃=১০, u₃=-১, f₃u₃ = -১০</div>
                      <div>• ৬১–৭০ (a): x₄=৬৫.৫, f₄=২০, u₄=০, f₄u₄ = ০</div>
                      <div>• ৭১–৮০: x₅=৭৫.৫, f₅=১২, u₅=১, f₅u₅ = ১২</div>
                      <div>• ৮১–৯০: x₆=৮৫.৫, f₆=৬, u₆=২, f₆u₆ = ১২</div>
                      <div className="pt-1 border-t border-slate-700 text-emerald-400 font-bold">
                        মোট: N = ৬০, ∑fᵢuᵢ = (-৩৮) + (২৪) = -১৪
                      </div>
                    </div>
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900 font-mono text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                      <span>গড়:</span>
                      <RenderMathText text="\\bar{x} = a + \\frac{\\sum f_i u_i}{N} \\times h = 65.5 + \\frac{-14}{60} \\times 10 = 65.5 - 2.33 = 63.17" />
                    </div>
                  </div>
                </div>

                {/* Part C */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                    <span>(গ) বিবরণসহ প্রদত্ত উপাত্তের গণসংখ্যা বহুভুজ অঙ্কন কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">৪ নম্বর</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pt-1">
                    <p>
                      <strong>অঙ্কনের বিবরণ:</strong> ছক কাগজের X-অক্ষ বরাবর প্রতি ক্ষুদ্রতম ঘরকে ২ একক ধরে শ্রেণির মধ্যবিন্দু
                      (৩৫.৫, ৪৫.৫, ৫৫.৫, ৬৫.৫, ৭৫.৫, ৮৫.৫) এবং Y-অক্ষ বরাবর প্রতি ক্ষুদ্রতম ঘরকে ১ একক ধরে গণসংখ্যা স্থাপন করি।
                    </p>
                    <p>
                      মূলবিন্দু থেকে ২৫.৫ পর্যন্ত পূর্ববর্তী ঘরগুলো বোঝাতে X-অক্ষে ভাঙা দাগ ব্যবহার করি। বিন্দুগুলো
                      (৩৫.৫, ৪), (৪৫.৫, ৮), (৫৫.৫, ১০), (৬৫.৫, ২০), (৭৫.৫, ১২), (৮৫.৫, ৬) স্থাপন করে সরলরেখা দ্বারা যুক্ত করি।
                    </p>
                    <p>
                      বহুভুজটি পূর্ণাঙ্গ করতে প্রথম শ্রেণির পূর্বের মধ্যবিন্দু (২৫.৫, ০) এবং শেষ শ্রেণির পরের মধ্যবিন্দু
                      (৯৫.৫, ০)-এর সাথে X-অক্ষে যুক্ত করি।
                    </p>
                  </div>
                </div>
              </div>

              {/* Examiner Secrets */}
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
                <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  পরীক্ষকের মূল্যায়ন নির্দেশিকা (Marking Rubric):
                </div>
                <p>
                  ক-এ মধ্যক শ্রেণি নির্ধারণে ১, মধ্যবিন্দুতে ১। খ-এ সারণি তৈরিতে ২ এবং সূত্রে সঠিক মান বসিয়ে ফলে ২ নম্বর।
                  গ-এ গ্রাফে স্কেল বিবরণে ১, সঠিক বিন্দু স্থাপনে ২ এবং বহুভুজের প্রান্ত ভূমিতে স্পর্শ করানোর জন্য ১ নম্বর।
                </p>
              </div>
            </div>

            {/* CQ 2: Chattogram Board 2024 / Jashore 2023 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    সৃজনশীল প্রশ্ন ০২ • চট্টগ্রাম বোর্ড ২০২৪ / যশোর ২০২৩
                  </span>
                  <span className="text-xs text-slate-500">পূর্ণমান: ১০</span>
                </div>
                <span className="text-xs font-mono text-slate-400">মধ্যক, প্রচুরক ও অজিভ রেখা</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-sm">
                <strong className="text-slate-900 dark:text-white block mb-2">উদ্দীপক:</strong>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  ৫০ জন মানুষের বয়সের গণসংখ্যা সারণি: ২৫–৩৪ (৫ জন), ৩৫–৪৪ (৮ জন), ৪৫–৫৪ (১৫ জন), ৫৫–৬৪ (১২ জন), ৬৫–৭৪ (৭ জন), ৭৫–৮৪ (৩ জন)।
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-1">
                    <span>(ক) ক্রমযোজিত গণসংখ্যা সারণি তৈরি কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">২ নম্বর</span>
                  </div>
                  <p className="font-mono text-slate-700 dark:text-slate-300">
                    ২৫–৩৪: ৫; ৩৫–৪৪: ১৩; ৪৫–৫৪: ২৮; ৫৫–৬৪: ৪০; ৬৫–৭৪: ৪৭; ৭৫–৮৪: ৫০ (মোট N = ৫০)।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-1">
                    <span>(খ) উপাত্তের প্রচুরক নির্ণয় কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">৪ নম্বর</span>
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300 space-y-1">
                    <p>সর্বোচ্চ গণসংখ্যা ১৫ রয়েছে ৪৫–৫৪ শ্রেণিতে। ∴ প্রচুরক শ্রেণি ৪৫–৫৪।</p>
                    <p>L = ৪৫, f₁ = ১৫ - ৮ = ৭, f₂ = ১৫ - ১২ = ৩, h = ১০।</p>
                    <p className="p-2 bg-slate-900 text-orange-300 rounded font-bold">
                      Mode = L + [f₁ / (f₁ + f₂)] × h = ৪৫ + [৭ / (৭ + ৩)] × ১০ = ৪৫ + (৭/১০) × ১০ = ৪৫ + ৭ = ৫২।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-1">
                    <span>(গ) উপাত্তের অজিভ রেখা অঙ্কন কর এবং তা থেকে মধ্যক নির্দেশ কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">৪ নম্বর</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    X-অক্ষে উচ্চসীমা (৩৪, ৪৪, ৫৪, ৬৪, ৭৪, ৮৪) ও Y-অক্ষে ক্রমযোজিত গণসংখ্যা স্থাপন করে (৩৪, ৫), (৪৪, ১৩),
                    (৫৪, ২৮), (৬৪, ৪০), (৭৪, ৪৭), (৮৪, ৫০) বিন্দুগুলো যুক্ত করে অজিভ আঁকি। Y-অক্ষে N/2 = ২৫ থেকে X-অক্ষের সমান্তরাল
                    রেখা অজিভে টেনে X-অক্ষে লম্ব টানলে মধ্যক প্রায় ৫২ পাওয়া যায়।
                  </p>
                </div>
              </div>
            </div>

            {/* CQ 3: Rajshahi Board 2024 / Dinajpur 2023 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    সৃজনশীল প্রশ্ন ০৩ • রাজশাহী বোর্ড ২০২৪ / দিনাজপুর ২০২৩
                  </span>
                  <span className="text-xs text-slate-500">পূর্ণমান: ১০</span>
                </div>
                <span className="text-xs font-mono text-slate-400">মধ্যক ও আয়তলেখ</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-sm">
                <strong className="text-slate-900 dark:text-white block mb-2">উদ্দীপক:</strong>
                <p className="text-slate-700 dark:text-slate-300">
                  ৬০ জন শ্রমিকের দৈনিক আয়ের গণসংখ্যা সারণি: ২০১–২৫০ (৬), ২৫১–৩০০ (১২), ৩০১–৩৫০ (১৮), ৩৫১–৪০০ (১৪), ৪০১–৪৫০ (১০)।
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-1">
                    <span>(ক) অবিচ্ছিন্ন শ্রেণিসীমা সারণি তৈরি কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">২ নম্বর</span>
                  </div>
                  <p className="font-mono text-slate-700 dark:text-slate-300">
                    ২০০.৫–২৫০.৫, ২৫০.৫–৩০০.৫, ৩০০.৫–৩৫০.৫, ৩৫০.৫–৪০০.৫, ৪০০.৫–৪৫০.৫।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-1">
                    <span>(খ) সারণি থেকে মধ্যক নির্ণয় কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">৪ নম্বর</span>
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300 space-y-1">
                    <p>N = ৬০, N/2 = ৩০। মধ্যক শ্রেণি ৩০১–৩৫০।</p>
                    <p>L = ৩০১, Fc = ১৮ (৬+১২), fm = ১৮, h = ৫০।</p>
                    <p className="p-2 bg-slate-900 text-sky-300 rounded font-bold">
                      Median = ৩০১ + (৩০ - ১৮) × (৫০ / ১৮) = ৩০১ + ১২ × ২.৭৭৮ = ৩০১ + ৩৩.৩৩ = ৩৩৪.৩৩।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-1">
                    <span>(গ) উপাত্তের আয়তলেখ অঙ্কন কর।</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">৪ নম্বর</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    ছক কাগজের X-অক্ষে অবিচ্ছিন্ন শ্রেণিসীমা (২০০.৫, ২৫০.৫, ৩০০.৫, ৩৫০.৫, ৪০০.৫, ৪৫০.৫) এবং Y-অক্ষে গণসংখ্যা
                    স্থাপন করে আয়তাকার স্তম্ভ অঙ্কন করি। মূলবিন্দু থেকে ২০০.৫ পর্যন্ত ভাঙা দাগ ব্যবহার করি।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 3: TRY YOURSELF (৩টি ইন্টারঅ্যাক্টিভ চ্যালেঞ্জ)
        ======================================================================= */}
        {activeTab === 'try' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
                নিজে চেষ্টা করুন: গাণিতিক চ্যালেঞ্জ
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                বোর্ড পরীক্ষায় আসা গাণিতিক উপাত্ত সমাধান করে সঠিক মান ইনপুট দিন এবং তাৎক্ষণিক নির্ভুলতা যাচাই করুন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1: Short-cut Mean */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  চ্যালেঞ্জ ১: সংক্ষিপ্ত পদ্ধতিতে গড়
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  একটি উপাত্তে অনুমিত গড় <RenderMathText text="a = 55.5" />, বিচ্যুতি ও গণসংখ্যার গুণফল সমষ্টি{' '}
                  <RenderMathText text="\\sum f_i u_i = 10" />, মোট গণসংখ্যা <RenderMathText text="N = 50" /> এবং শ্রেণি ব্যাপ্তি{' '}
                  <RenderMathText text="h = 10" /> হলে নির্ণেয় গড় কত?
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 font-mono">
                  সূত্র: <RenderMathText text="\\bar{x} = a + \\frac{\\sum f_i u_i}{N} \\times h" />
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="মান লিখুন (যেমন: 57.5)"
                      value={ch1Input}
                      onChange={(e) => {
                        setCh1Input(e.target.value);
                        setCh1Result(null);
                      }}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch1Input);
                        setCh1Result(Math.abs(val - 57.5) < 0.05);
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch1Result === true && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>অভিনন্দন! সঠিক উত্তর:</strong>{' '}
                      <RenderMathText text="\\bar{x} = 55.5 + \\frac{10}{50} \\times 10 = 55.5 + 2 = 57.5" />
                    </div>
                  )}
                  {ch1Result === false && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300">
                      আবার চেষ্টা করুন! মনে রাখবেন: (১০ / ৫০) × ১০ = ২। সুতরাং ৫৫.৫ + ২ = ৫৭.৫।
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 2: Median */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300">
                  চ্যালেঞ্জ ২: মধ্যক নির্ণয়
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  একটি উপাত্তের মধ্যক শ্রেণির ক্ষেত্রে <RenderMathText text="L = 60" />, <RenderMathText text="N = 80" />,{' '}
                  <RenderMathText text="F_c = 28" />, মধ্যক শ্রেণির গণসংখ্যা <RenderMathText text="f_m = 24" /> এবং{' '}
                  <RenderMathText text="h = 10" /> হলে মধ্যক কত?
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 font-mono">
                  সূত্র: <RenderMathText text="\\text{Median} = L + \\left(\\frac{N}{2} - F_c\\right)\\frac{h}{f_m}" />
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="মান লিখুন (যেমন: 65)"
                      value={ch2Input}
                      onChange={(e) => {
                        setCh2Input(e.target.value);
                        setCh2Result(null);
                      }}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch2Input);
                        setCh2Result(Math.abs(val - 65) < 0.05);
                      }}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch2Result === true && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>অভিনন্দন! সঠিক উত্তর:</strong>{' '}
                      <RenderMathText text="\\text{Median} = 60 + (40 - 28) \\times \\frac{10}{24} = 60 + 12 \\times \\frac{10}{24} = 60 + 5 = 65" />
                    </div>
                  )}
                  {ch2Result === false && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300">
                      আবার হিসাব করুন! N/2 = ৪০, ৪০ - ২৮ = ১২, এবং ১২ × (১০/২৪) = ৫। ৬০ + ৫ = ৬৫!
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 3: Mode */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
                  চ্যালেঞ্জ ৩: প্রচুরক নির্ণয়
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  একটি প্রচুরক শ্রেণির নিম্নসীমা <RenderMathText text="L = 50" />, গণসংখ্যার পার্থক্যদ্বয়{' '}
                  <RenderMathText text="f_1 = 6" />, <RenderMathText text="f_2 = 4" /> এবং শ্রেণি ব্যাপ্তি{' '}
                  <RenderMathText text="h = 10" /> হলে প্রচুরক কত?
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-500 font-mono">
                  সূত্র: <RenderMathText text="\\text{Mode} = L + \\frac{f_1}{f_1 + f_2} \\times h" />
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="মান লিখুন (যেমন: 56)"
                      value={ch3Input}
                      onChange={(e) => {
                        setCh3Input(e.target.value);
                        setCh3Result(null);
                      }}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch3Input);
                        setCh3Result(Math.abs(val - 56) < 0.05);
                      }}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch3Result === true && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>অভিনন্দন! সঠিক উত্তর:</strong>{' '}
                      <RenderMathText text="\\text{Mode} = 50 + \\frac{6}{6 + 4} \\times 10 = 50 + \\frac{6}{10} \\times 10 = 50 + 6 = 56" />
                    </div>
                  )}
                  {ch3Result === false && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300">
                      আবার চেষ্টা করুন! ৬ / (৬+৪) = ৬/১০। (৬/১০) × ১০ = ৬। ৫০ + ৬ = ৫৬!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 4: CHECK UNDERSTANDING (৫টি বোর্ড মানের MCQ)
        ======================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
                অনুধাবন যাচাই: বোর্ড বহুনির্বাচনী (MCQ)
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                এসএসসি পরীক্ষার প্রশ্ন কাঠামো অনুসারে ৫টি গুরুত্বপূর্ণ কনসেপচুয়াল প্রশ্নের সঠিক উত্তর নির্বাচন করুন।
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  q: 'কেন্দ্রীয় প্রবণতার পরিমাপ কয়টি?',
                  options: ['২টি', '৩টি', '৪টি', '৫টি'],
                  correct: 1,
                  explain: 'কেন্দ্রীয় প্রবণতার পরিমাপ ৩টি: গাণিতিক গড় (Mean), মধ্যক (Median) ও প্রচুরক (Mode)।',
                },
                {
                  id: 2,
                  q: 'প্রচুরক নির্ণয়ের সূত্রে f₁ বলতে কোনটি বোঝায়?',
                  options: [
                    'প্রচুরক শ্রেণির গণসংখ্যা ও পূর্ববর্তী শ্রেণির গণসংখ্যার পার্থক্য',
                    'প্রচুরক শ্রেণির গণসংখ্যা ও পরবর্তী শ্রেণির গণসংখ্যার পার্থক্য',
                    'মোট গণসংখ্যার অর্ধাংশ',
                    'পূর্ববর্তী শ্রেণির ক্রমযোজিত গণসংখ্যা',
                  ],
                  correct: 0,
                  explain: 'f₁ = fₘ - fₘ₋₁ (প্রচুরক শ্রেণির গণসংখ্যা থেকে তার পূর্ববর্তী শ্রেণির গণসংখ্যার বিয়োগফল)।',
                },
                {
                  id: 3,
                  q: 'অজিভ রেখা (Ogive Curve) অঙ্কনের সময় X-অক্ষ বরাবর কোনটি স্থাপন করা হয়?',
                  options: ['শ্রেণির মধ্যবিন্দু', 'শ্রেণির অবিচ্ছিন্ন নিম্নসীমা', 'শ্রেণির উচ্চসীমা', 'ক্রমযোজিত গণসংখ্যা'],
                  correct: 2,
                  explain: 'অজিভ রেখা অঙ্কনে X-অক্ষ বরাবর শ্রেণির উচ্চসীমা এবং Y-অক্ষ বরাবর ক্রমযোজিত গণসংখ্যা বসে।',
                },
                {
                  id: 4,
                  q: '৩১–৪০ শ্রেণির অবিচ্ছিন্ন প্রকৃত শ্রেণিসীমা কোনটি?',
                  options: ['৩০.০ – ৪০.০', '৩০.৫ – ৪০.৫', '৩১.৫ – ৩৯.৫', '৩২.০ – ৪১.০'],
                  correct: 1,
                  explain: 'নিম্নসীমা থেকে ০.৫ বিয়োগ এবং উচ্চসীমার সাথে ০.৫ যোগ করলে অবিচ্ছিন্ন সীমা ৩০.৫ – ৪০.৫ হয়।',
                },
                {
                  id: 5,
                  q: 'সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয়ে বিচ্যুতি সংখ্যা uᵢ-এর সূত্র কোনটি?',
                  options: [
                    'uᵢ = (xᵢ - a) × h',
                    'uᵢ = (xᵢ - a) / h',
                    'uᵢ = (xᵢ + a) / h',
                    'uᵢ = (a - xᵢ) / h',
                  ],
                  correct: 1,
                  explain: 'বিচ্যুতি সংখ্যা uᵢ = (xᵢ - a) / h, যেখানে a হলো অনুমিত গড় এবং h হলো শ্রেণি ব্যাপ্তি।',
                },
              ].map((item, qIdx) => {
                const userSelected = selectedAnswers[qIdx];
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-xs mt-0.5 font-mono">
                        প্রশ্ন {item.id}
                      </span>
                      <span>{item.q}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {item.options.map((opt, optIdx) => {
                        let btnStyle =
                          'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400';

                        if (userSelected === optIdx) {
                          btnStyle = 'bg-amber-600 text-white border-amber-600 font-bold';
                        }

                        if (submittedQuiz) {
                          if (optIdx === item.correct) {
                            btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                          } else if (userSelected === optIdx && userSelected !== item.correct) {
                            btnStyle = 'bg-rose-600 text-white border-rose-600 line-through';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submittedQuiz}
                            onClick={() => {
                              const updated = [...selectedAnswers];
                              updated[qIdx] = optIdx;
                              setSelectedAnswers(updated);
                            }}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            <span className="w-5 h-5 rounded-full border border-current/30 flex items-center justify-center text-[10px]">
                              {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {submittedQuiz && (
                      <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                        <strong>ব্যাখ্যা:</strong> {item.explain}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end gap-3 pt-2">
                {!submittedQuiz ? (
                  <button
                    onClick={() => setSubmittedQuiz(true)}
                    disabled={selectedAnswers.includes(-1)}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm transition shadow-sm"
                  >
                    উত্তর যাচাই করুন
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSubmittedQuiz(false);
                      setSelectedAnswers([-1, -1, -1, -1, -1]);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition shadow-sm"
                  >
                    পুনরায় কুইজ দিন
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            TAB 5: SUMMARY (চিটশিট ও ফর্মুলা ব্যাংক)
        ======================================================================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
                  পরিসংখ্যান মাস্টার ফর্মুলা চিটশিট
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  এসএসসি পরীক্ষার পূর্বমুহূর্তে একনজরে রিভিশনের জন্য সকল সূত্র ও পরীক্ষকের ট্র্যাপ নোট।
                </p>
              </div>

              <button
                onClick={handleCopyCheatSheet}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'কপি হয়েছে!' : 'ক্লিপবোর্ডে কপি করুন'}
              </button>
            </div>

            {/* Formula Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formula Card 1: Short-cut Mean */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    ১. সংক্ষিপ্ত পদ্ধতিতে গড়
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-mono">
                    17.1
                  </span>
                </div>
                <div className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono text-center text-sm">
                  <RenderMathText text="\\bar{x} = a + \\frac{\\sum f_i u_i}{N} \\times h" />
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>$a$ = অনুমিত গড় (যে শ্রেণিতে গণসংখ্যা বেশি, তার মধ্যবিন্দু)</li>
                  <li className="flex items-center gap-1">
                    <RenderMathText text="u_i = \\frac{x_i - a}{h}" /> = বিচ্যুতি সংখ্যা
                  </li>
                  <li className="flex items-center gap-1">
                    <RenderMathText text="N = \\sum f_i" /> = মোট গণসংখ্যা, $h$ = শ্রেণি ব্যাপ্তি
                  </li>
                </ul>
              </div>

              {/* Formula Card 2: Median */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-500" />
                    ২. শ্রেণিকৃত উপাত্তের মধ্যক
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-mono">
                    17.2
                  </span>
                </div>
                <div className="p-3 bg-slate-900 text-sky-300 rounded-xl font-mono text-center text-sm">
                  <RenderMathText text="\\text{Median} = L + \\left(\\frac{N}{2} - F_c\\right) \\times \\frac{h}{f_m}" />
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>L = মধ্যক শ্রেণির নিম্নসীমা (N/2-তম মান যে শ্রেণিতে থাকে)</li>
                  <li>F_c = মধ্যক শ্রেণির পূর্ববর্তী শ্রেণির ক্রমযোজিত গণসংখ্যা</li>
                  <li>f_m = মধ্যক শ্রেণির গণসংখ্যা, h = শ্রেণি ব্যাপ্তি</li>
                </ul>
              </div>

              {/* Formula Card 3: Mode */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-orange-500" />
                    ৩. প্রচুরক নির্ণয়
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-mono">
                    17.3
                  </span>
                </div>
                <div className="p-3 bg-slate-900 text-orange-300 rounded-xl font-mono text-center text-sm">
                  <RenderMathText text="\\text{Mode} = L + \\frac{f_1}{f_1 + f_2} \\times h" />
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>L = প্রচুরক শ্রেণির নিম্নসীমা (সর্বোচ্চ গণসংখ্যার শ্রেণি)</li>
                  <li className="flex items-center gap-1">
                    <RenderMathText text="f_1 = f_m - f_{m-1}" /> (প্রচুরক শ্রেণি - পূর্ববর্তী শ্রেণি গণসংখ্যা)
                  </li>
                  <li className="flex items-center gap-1">
                    <RenderMathText text="f_2 = f_m - f_{m+1}" /> (প্রচুরক শ্রেণি - পরবর্তী শ্রেণি গণসংখ্যা)
                  </li>
                  <li className="flex items-center gap-1 flex-wrap">
                    ১ম শ্রেণি প্রচুরক হলে <RenderMathText text="f_{m-1}=0" />; শেষ শ্রেণি প্রচুরক হলে <RenderMathText text="f_{m+1}=0" />
                  </li>
                </ul>
              </div>

              {/* Formula Card 4: Graphs (Ogive & Histogram) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ৪. লেখচিত্র ও গ্রাফের নিয়মাবলি
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-mono">
                    17.4-5
                  </span>
                </div>
                <div className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-center text-xs space-y-1">
                  <div>অজিভ রেখা: X = শ্রেণি উচ্চসীমা, Y = ক্রমযোজিত গণসংখ্যা</div>
                  <div>আয়তলেখ: X = অবিচ্ছিন্ন শ্রেণিসীমা, Y = গণসংখ্যা</div>
                  <div>বহুভুজ: X = শ্রেণি মধ্যবিন্দু, Y = গণসংখ্যা</div>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>মূলবিন্দু থেকে প্রথম মানের দূরত্ব বোঝাতে X-অক্ষে ভাঙা দাগ আবশ্যক</li>
                  <li>অজিভ রেখায় Y = N/2 থেকে প্রজেকশন টানলে মধ্যক পাওয়া যায়</li>
                  <li>আয়তলেখের সর্বোচ্চ স্তম্ভে কোনাকুনি রেখা টেনে প্রচুরক নির্ধারণ সম্ভব</li>
                </ul>
              </div>
            </div>

            {/* Examiner Traps Sentinel */}
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                বোর্ড পরীক্ষায় ৪টি মারাত্মক ভুল (Examiner Traps):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-rose-900 dark:text-rose-200">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-rose-900/40">
                  <strong>১. Fc নির্বাচনে ভুল:</strong> মধ্যক সূত্রে F_c হলো মধ্যক শ্রেণির <u>পূর্ববর্তী</u> শ্রেণির
                  ক্রমযোজিত গণসংখ্যা। মধ্যক শ্রেণির ক্রমযোজিত গণসংখ্যা বসিয়ে দিলে অঙ্ক ভুল হবে!
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-rose-900/40">
                  <strong>২. প্রচুরকে শূন্য না ধরা:</strong> ১ম শ্রেণি বা শেষ শ্রেণি প্রচুরক শ্রেণি হলে যথাক্রমে
                  পূর্বের বা পরের গণসংখ্যা ০ ধরে f₁ = fₘ বা f₂ = fₘ লিখতে হবে।
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-rose-900/40">
                  <strong>৩. অবিচ্ছিন্ন সীমা না করা:</strong> বিচ্ছিন্ন শ্রেণি ব্যবধান থাকলে আয়তলেখে সরাসরি শ্রেণির
                  মান বসালে শূন্য পাওয়া যাবে; অবশ্যই ০.৫ যোগ-বিয়োগ করে অবিচ্ছিন্ন করতে হবে।
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-rose-900/40">
                  <strong>৪. বহুভুজের দুই প্রান্ত খোলা রাখা:</strong> বহুভুজ অঙ্কন শেষে প্রথম শ্রেণির পূর্বের মধ্যবিন্দু
                  এবং শেষ শ্রেণির পরের মধ্যবিন্দুতে ভূমির সাথে না জুড়লে নম্বর কাটা যায়।
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------------------
          SHERU AI TUTOR (শেরু এআই টিউটর) SLIDE-OVER DRAWER
      ------------------------------------------------------------------------- */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">শেরু এআই টিউটর</h3>
                  <p className="text-[10px] text-slate-400">পরিসংখ্যান সকরেটিক সহচর</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-amber-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <RenderMathText text={msg.text} />
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Chips */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex flex-wrap gap-1.5">
              {[
                'সংক্ষিপ্ত পদ্ধতিতে গড়ের সূত্র বুঝাও',
                'অজিভ রেখা থেকে মধ্যক বের করব কীভাবে?',
                '১ম শ্রেণি প্রচুরক হলে কী করব?',
                'আয়তলেখে অবিচ্ছিন্ন সীমার নিয়ম কী?',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(chip)}
                  className="px-2.5 py-1 text-[11px] rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="পরিসংখ্যান নিয়ে কোনো প্রশ্ন করুন..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendPrompt();
                }}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => handleSendPrompt()}
                className="p-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition"
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

export { MathStatisticsGuidebook };
