'use client';

import React, { useState } from 'react';
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
  Eye,
  Sun,
  Maximize2,
  Compass,
  Sliders,
  Search,
  MessageSquare,
  ShieldCheck,
  XCircle,
  Zap,
  BatteryCharging,
  Flame,
  Activity,
  Atom,
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

const LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'ঘর্ষণে স্থির বিদ্যুৎ ও ইলেকট্রন স্থানান্তর ল্যাব',
    subtitle: 'Triboelectric Charging, Electron Transfer & Paper Scraps',
    nctbPage: '২৭২-২৭৪',
    badge: 'মৌলিক ভিত্তি',
    intro:
      'পরমাণুর কেন্দ্রে ধনাত্মক প্রোটন এবং বাইরে ঘূর্ণায়মান ঋণাত্মক ইলেকট্রন থাকে। দুটি ভিন্ন পদার্থের ঘর্ষণে যে পদার্থের ইলেকট্রন আসক্তি বেশি সে ইলেকট্রন গ্রহণ করে ঋণাত্মক (-) এবং অন্যটি ইলেকট্রন হারিয়ে ধনাত্মক (+) আধানে আহিত হয়।',
  },
  {
    id: 2,
    title: 'স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র ও আবেশ ল্যাব',
    subtitle: 'Gold Leaf Electroscope & Charging by Induction',
    nctbPage: '২৭৫-২৭৯',
    badge: 'যন্ত্র ও কৌশল',
    intro:
      'কোনো বস্তুতে আধানের অস্তিত্ব ও প্রকৃতি নির্ণয়ের সূক্ষ্ম যন্ত্র হলো স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র। স্পর্শ না করেই আবেশ প্রক্রিয়ায় (Induction) কীভাবে একটি অনাহিত পরিবাহীকে স্থায়ীভাবে আহিত করা যায় তা এখানে সিমুলেট করো।',
  },
  {
    id: 3,
    title: 'কুলম্বের বল ও দূরত্বের প্রভাব ল্যাব',
    subtitle: "Coulomb's Law, Force Vectors & Inverse Square Law",
    nctbPage: '২৮০-২৮২',
    badge: 'বোর্ড গাণিতিক হটস্পট',
    intro:
      'দুটি বিন্দু আধানের মধ্যকার আকর্ষণ বা বিকর্ষণ বল আধানদ্বয়ের পরিমাণের গুণফলের সমানুপাতিক এবং দূরত্বের বর্গের ব্যস্তানুপাতিক: F = k (q₁q₂ / r²)। বলের দিক সর্বদা আধানদ্বয়ের সংযোগকারী সরলরেখা বরাবর ক্রিয়া করে।',
  },
  {
    id: 4,
    title: 'তড়িৎ ক্ষেত্র, প্রাবল্য ও বলরেখা সিমুলেটর',
    subtitle: 'Electric Field Intensity (E = k q/r²), Field Lines & Null Point',
    nctbPage: '২৮৩-২৮৬',
    badge: 'ভেক্টর ক্ষেত্র',
    intro:
      'কোনো আহিত বস্তুর চারপাশের যে অঞ্চলজুড়ে তার তড়িৎ প্রভাব বজায় থাকে তাকে তড়িৎ ক্ষেত্র বলে। একক ধনাত্মক আধান স্থাপন করলে তা যে বল অনুভব করে তাই তড়িৎ তীব্রতা বা প্রাবল্য E = F/q। বলরেখাগুলো কখনো পরস্পরকে ছেদ করে না।',
  },
  {
    id: 5,
    title: 'তড়িৎ বিভব, ধারক (Capacitor) ও বজ্রপাত ল্যাব',
    subtitle: 'Electric Potential (V = k q/r), Capacitors (C = Q/V) & Lightning Rod',
    nctbPage: '২৮৭-২৯৩',
    badge: 'শক্তি ও বাস্তব নিরাপত্তা',
    intro:
      'অসীম দূরত্ব থেকে একক ধনাত্মক আধানকে তড়িৎ ক্ষেত্রের কোনো বিন্দুতে আনতে কৃতকাজই তড়িৎ বিভব V = W/q। ধারক তড়িৎ ক্ষেত্রে শক্তি জমা রাখে (U = ½ CV²)। ভবনে বজ্রনিরোধক তামার রড তীক্ষ্ণমুখ ক্ষরণ ও আর্থিংয়ের মাধ্যমে বজ্রপাত থেকে সুরক্ষা দেয়।',
  },
];

export default function PhysicsStaticElectricityGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'example' | 'practice' | 'quiz' | 'summary'>('learn');
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // LAB 1 STATE: Triboelectric Friction & Electron Transfer
  // -------------------------------------------------------------------------
  const [triboPair, setTriboPair] = useState<'glass_silk' | 'comb_wool' | 'balloon_wool'>('comb_wool');
  const [rubCount, setRubCount] = useState<number>(4);
  const [isMonsoonHumid, setIsMonsoonHumid] = useState<boolean>(false);
  const [showPaperTest, setShowPaperTest] = useState<boolean>(false);

  // Microscopic calculations
  const effectiveRubs = isMonsoonHumid ? Math.floor(rubCount * 0.3) : rubCount;
  const electronsTransferred = effectiveRubs * 2.5; // in arbitrary billions (x 10^10)
  const netMicroCoulombs = (effectiveRubs * 0.8).toFixed(2); // arbitrary microcoulombs

  // -------------------------------------------------------------------------
  // LAB 2 STATE: Gold Leaf Electroscope & Induction
  // -------------------------------------------------------------------------
  const [electroscopeState, setElectroscopeState] = useState<'neutral' | 'positive' | 'negative'>('neutral');
  const [bringingRod, setBringingRod] = useState<'none' | 'positive' | 'negative'>('positive');
  const [rodDistanceCm, setRodDistanceCm] = useState<number>(6); // 1 to 15 cm
  const [isGrounded, setIsGrounded] = useState<boolean>(false);
  const [inductionStep, setInductionStep] = useState<number>(1);

  // Calculate leaf divergence angle based on states
  let leafAngle = 0;
  if (electroscopeState === 'positive') leafAngle += 35;
  if (electroscopeState === 'negative') leafAngle += 35;

  if (bringingRod === 'positive') {
    if (electroscopeState === 'neutral') {
      leafAngle = Math.max(0, 45 - rodDistanceCm * 2.6);
    } else if (electroscopeState === 'positive') {
      leafAngle = Math.min(65, 35 + (15 - rodDistanceCm) * 2.0); // divergence increases
    } else if (electroscopeState === 'negative') {
      leafAngle = Math.max(5, 35 - (15 - rodDistanceCm) * 2.0); // divergence decreases
    }
  } else if (bringingRod === 'negative') {
    if (electroscopeState === 'neutral') {
      leafAngle = Math.max(0, 45 - rodDistanceCm * 2.6);
    } else if (electroscopeState === 'negative') {
      leafAngle = Math.min(65, 35 + (15 - rodDistanceCm) * 2.0); // divergence increases
    } else if (electroscopeState === 'positive') {
      leafAngle = Math.max(5, 35 - (15 - rodDistanceCm) * 2.0); // divergence decreases
    }
  }

  if (isGrounded) {
    leafAngle = 0; // Earth grounds free charge from leaves!
  }

  // -------------------------------------------------------------------------
  // LAB 3 STATE: Coulomb's Law & Inverse Square Law
  // -------------------------------------------------------------------------
  const [q1MicroC, setQ1MicroC] = useState<number>(5); // microCoulombs or Coulombs
  const [q2MicroC, setQ2MicroC] = useState<number>(-4);
  const [distRMetres, setDistRMetres] = useState<number>(0.5); // 0.1 to 2.0 metres
  const [mediumK, setMediumK] = useState<'vacuum' | 'water' | 'glass'>('vacuum');

  const kConstant =
    mediumK === 'vacuum' ? 9e9 : mediumK === 'water' ? 9e9 / 80 : 9e9 / 5; // 9 x 10^9

  // Force magnitude: F = k * |q1 * q2| / r^2
  // We compute with microCoulombs (10^-6 C) for realistic desktop numbers
  const q1C = q1MicroC * 1e-6;
  const q2C = q2MicroC * 1e-6;
  const forceSigned = (kConstant * (q1C * q2C)) / (distRMetres * distRMetres);
  const forceMag = Math.abs(forceSigned);
  const isAttractive = forceSigned < 0;

  // -------------------------------------------------------------------------
  // LAB 4 STATE: Electric Field Intensity & Null Point
  // -------------------------------------------------------------------------
  const [fieldPreset, setFieldPreset] = useState<'single_pos' | 'single_neg' | 'dipole' | 'like_pos' | 'textbook_cq'>('dipole');
  const [probeX, setProbeX] = useState<number>(0.35); // probe position along 1-metre axis (0 to 1)

  // Charges for field preset: located at x = 0.2 and x = 0.8
  let chargeLeft = 5;
  let chargeRight = -5;
  if (fieldPreset === 'single_pos') {
    chargeLeft = 5;
    chargeRight = 0;
  } else if (fieldPreset === 'single_neg') {
    chargeLeft = -5;
    chargeRight = 0;
  } else if (fieldPreset === 'dipole') {
    chargeLeft = 5;
    chargeRight = -5;
  } else if (fieldPreset === 'like_pos') {
    chargeLeft = 5;
    chargeRight = 3;
  } else if (fieldPreset === 'textbook_cq') {
    chargeLeft = 4;
    chargeRight = -1;
  }

  // Calculate E at probeX
  const posLeft = 0.2;
  const posRight = 0.8;
  const rL = Math.max(0.02, Math.abs(probeX - posLeft));
  const rR = Math.max(0.02, Math.abs(probeX - posRight));

  const eLeftMag = (9e9 * Math.abs(chargeLeft) * 1e-6) / (rL * rL);
  const eLeftDir = (probeX > posLeft ? 1 : -1) * (chargeLeft >= 0 ? 1 : -1);
  const eLeftSigned = eLeftMag * eLeftDir;

  let eRightSigned = 0;
  if (chargeRight !== 0) {
    const eRightMag = (9e9 * Math.abs(chargeRight) * 1e-6) / (rR * rR);
    const eRightDir = (probeX > posRight ? 1 : -1) * (chargeRight >= 0 ? 1 : -1);
    eRightSigned = eRightMag * eRightDir;
  }

  const eNetSigned = eLeftSigned + eRightSigned;

  // -------------------------------------------------------------------------
  // LAB 5 STATE: Electric Potential, Capacitor & Lightning Rod
  // -------------------------------------------------------------------------
  const [lab5Mode, setLab5Mode] = useState<'potential' | 'capacitor' | 'lightning'>('capacitor');

  // Potential sub-mode
  const [potSphereA, setPotSphereA] = useState<{ v: number; q: number }>({ v: 24, q: 6 });
  const [potSphereB, setPotSphereB] = useState<{ v: number; q: number }>({ v: 10, q: 9 });
  const [isWireConnected, setIsWireConnected] = useState<boolean>(false);

  // Capacitor sub-mode
  const [capAreaCm2, setCapAreaCm2] = useState<number>(50); // cm^2
  const [capDistMm, setCapDistMm] = useState<number>(2); // mm
  const [capVoltage, setCapVoltage] = useState<number>(12); // V
  const [capDielectric, setCapDielectric] = useState<number>(1); // 1 = air, 6 = mica

  // C = epsilon * A / d => epsilon_0 = 8.854 x 10^-12
  const capAreaM2 = capAreaCm2 * 1e-4;
  const capDistM = capDistMm * 1e-3;
  const capacitanceF = (8.854e-12 * capDielectric * capAreaM2) / capDistM;
  const capacitancePF = capacitanceF * 1e12; // in picoFarads
  const capChargePC = capacitancePF * capVoltage; // in picoCoulombs
  const capEnergyPJ = 0.5 * capacitancePF * capVoltage * capVoltage; // in picoJoules

  // Lightning sub-mode
  const [hasLightningRod, setHasLightningRod] = useState<boolean>(true);
  const [cloudChargePercent, setCloudChargePercent] = useState<number>(85);
  const [lightningDischarged, setLightningDischarged] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // STEP 2: Creative Questions (CQs) State
  // -------------------------------------------------------------------------
  const [activeCQ, setActiveCQ] = useState<number>(1);
  const [showRubric, setShowRubric] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // STEP 3: Try Yourself Practice State
  // -------------------------------------------------------------------------
  const [ch1Input, setCh1Input] = useState<string>('');
  const [ch1Result, setCh1Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch2Input, setCh2Input] = useState<string>('');
  const [ch2Result, setCh2Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch3Input, setCh3Input] = useState<string>('');
  const [ch3Result, setCh3Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // -------------------------------------------------------------------------
  // STEP 4: Check Understanding MCQs State
  // -------------------------------------------------------------------------
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // SOCRATIC AI TUTOR DRAWER STATE
  // -------------------------------------------------------------------------
  const [showAiDrawer, setShowAiDrawer] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: 'স্বাগতম! আমি শেরাটউটর স্থির তড়িৎ ভার্চুয়াল শিক্ষক। কুলম্বের সূত্র, তড়িৎ আবেশ, স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র, প্রাবল্য বনাম বিভব এবং ধারক ও বজ্রপাত সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারো!',
    },
  ]);
  const [userQuery, setUserQuery] = useState<string>('');

  const handleCopyNote = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendAi = (promptText?: string) => {
    const q = promptText || userQuery;
    if (!q.trim()) return;

    setAiChatMessages((prev) => [...prev, { role: 'user', text: q }]);
    setUserQuery('');

    setTimeout(() => {
      let reply = 'তোমার প্রশ্নটি স্থির তড়িৎ অধ্যায়ের খুবই গুরুত্বপূর্ণ বিষয়!';
      if (q.includes('কুলম্ব') || q.includes('বল') || q.includes('দূরত্ব')) {
        reply =
          'কুলম্বের সূত্রে মনে রাখবে F = k (q₁q₂ / r²)। দূরত্ব r দ্বিগুণ করলে বল ৪ গুণ কমে যায়, আর অর্ধেক করলে ৪ গুণ বেড়ে যায়। দুটি সমধর্মী চার্জে বল পজিটিভ (বিকর্ষণ) এবং বিপরীত চার্জে নেগেটিভ (আকর্ষণ) হয়। শূন্য মাধ্যমে k = ৯ × ১০⁹ N m²/C²।';
      } else if (q.includes('প্রাবল্য') || q.includes('বিভব') || q.includes('পার্থক্য')) {
        reply =
          'তড়িৎ তীব্রতা বা প্রাবল্য E হলো ভেক্টর রাশি (একক N/C বা V/m), তাই এতে দিকের হিসাব করতে হয়। আর তড়িৎ বিভব V হলো স্কেলার রাশি (একক Volt বা J/C), তাই এতে চার্জের প্রকৃত চিহ্নসহ সাধারণ বীজগাণিতিক যোগ করতে হয়!';
      } else if (q.includes('স্বর্ণপাত') || q.includes('তড়িৎবীক্ষণ') || q.includes('আবেশ')) {
        reply =
          'স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্রে আগে থেকে জানা চার্জ থাকলে: সমধর্মী চার্জের বস্তু কাছে আনলে পাতার ফাঁক বৃদ্ধি পায়, আর বিপরীতধর্মী বা অনাহিত বস্তু কাছে আনলে পাতার ফাঁক হ্রাস পায়। আবেশে স্পর্শ ছাড়া শুধু কাছে এনে বিপরীত চার্জ সঞ্চয় করা হয়।';
      } else if (q.includes('বজ্রপাত') || q.includes('গাড়ি') || q.includes('শিকল')) {
        reply =
          'বজ্রপাতের সময় গাড়ির ধাতব কাঠামো একটি ফ্যারাডে খাঁচা (Faraday cage) হিসেবে কাজ করে, তাই চার্জ কেবল বাইরে দিয়ে মাটিতে চলে যায়—ভেতরে থাকা ব্যক্তি নিরাপদ থাকে! আর তেলের ট্রাকে ঘর্ষণে চার্জ জমে বিস্ফোরণ ঠেকাতে ঝুলন্ত শিকল দিয়ে গ্রাউন্ডিং করা হয়।';
      }

      setAiChatMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & NAVIGATION BAR                                            */}
      {/* ------------------------------------------------------------------------- */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb & Title */}
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/playground/v2"
              className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
            >
              পদার্থবিজ্ঞান
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
              অধ্যায় ১০
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h1 className="text-sm font-bold tracking-tight text-slate-100">
                স্থির তড়িৎ (Static Electricity)
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowAiDrawer(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-medium transition shadow-sm shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>সক্রেটিক এআই শিক্ষক</span>
            </button>
            <button
              onClick={() => {
                setRubCount(4);
                setElectroscopeState('neutral');
                setBringingRod('positive');
                setQ1MicroC(5);
                setQ2MicroC(-4);
                setDistRMetres(0.5);
              }}
              title="রিসেট প্যারামিটার"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5-Step Tab Switcher */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center overflow-x-auto space-x-1 border-t border-slate-800/60 pt-2.5 scrollbar-none">
          {[
            { key: 'learn', label: '১. ধারণা ও সিমুলেটর', icon: Atom },
            { key: 'example', label: '২. বোর্ড সৃজনশীল ও রুব্রিক', icon: BookOpen },
            { key: 'practice', label: '৩. নিজে করো চ্যালেঞ্জ', icon: Sliders },
            { key: 'quiz', label: '৪. জ্ঞান যাচাই বহুনির্বাচনি', icon: Award },
            { key: 'summary', label: '৫. সূত্র ব্যাংক ও ট্র্যাপ', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ------------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ------------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {/* ======================================================================= */}
        {/* TAB 1: LEARN CONCEPT & INTERACTIVE LABS                                 */}
        {/* ======================================================================= */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Lesson Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {LESSONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    activeLesson === l.id
                      ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono text-amber-400">পাঠ ০{l.id}</span>
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px]">{l.badge}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">{l.title}</h3>
                </button>
              ))}
            </div>

            {/* Active Lesson Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                    পাঠ ০{activeLesson}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    এনসিটিবি পৃষ্ঠা {LESSONS[activeLesson - 1].nctbPage}
                  </span>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700/60">
                  {LESSONS[activeLesson - 1].subtitle}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mb-1">
                {LESSONS[activeLesson - 1].title}
              </h2>
              <p className="text-xs leading-relaxed text-slate-300">
                {LESSONS[activeLesson - 1].intro}
              </p>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* LAB 1: TRIBOELECTRIC FRICTION & ELECTRON TRANSFER                   */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visualizer Stage */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-xs font-mono text-amber-400 flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Atom className="w-3.5 h-3.5" />
                    <span>ইলেকট্রন স্থানান্তর ও আধান বিস্তার সিমুলেশন</span>
                  </div>

                  {/* SVG Canvas */}
                  <svg viewBox="0 0 700 360" className="w-full max-w-xl h-auto drop-shadow-md">
                    <defs>
                      <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="silkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#be123c" stopOpacity="0.5" />
                      </linearGradient>
                      <linearGradient id="combGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
                      </linearGradient>
                      <linearGradient id="woolGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>

                    {/* Atmospheric Humidity Indicator */}
                    <rect x="20" y="20" width="660" height="320" rx="16" fill="#030712" stroke="#1e293b" />
                    {isMonsoonHumid && (
                      <g opacity="0.35">
                        <text x="350" y="50" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace">
                          [আর্দ্র বাতাস: জলীয়বাষ্প চার্জ শোষণ করে নিষ্কাশন করছে]
                        </text>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <circle
                            key={i}
                            cx={100 + i * 45}
                            cy={80 + (i % 3) * 30}
                            r="4"
                            fill="#38bdf8"
                            opacity="0.6"
                          />
                        ))}
                      </g>
                    )}

                    {/* Object A (Left) */}
                    <g transform="translate(140, 100)">
                      {triboPair === 'glass_silk' ? (
                        <>
                          {/* Glass Rod */}
                          <rect x="0" y="20" width="140" height="34" rx="17" fill="url(#glassGrad)" stroke="#38bdf8" strokeWidth="2" />
                          <text x="70" y="42" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                            কাচ দণ্ড (Glass)
                          </text>
                          <text x="70" y="75" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                            {effectiveRubs > 0 ? `+${(effectiveRubs * 0.8).toFixed(1)} μC (ধনাত্মক)` : 'অনাহিত (নিরপেক্ষ)'}
                          </text>
                        </>
                      ) : triboPair === 'comb_wool' ? (
                        <>
                          {/* Plastic Comb */}
                          <rect x="0" y="15" width="140" height="35" rx="8" fill="url(#combGrad)" stroke="#f59e0b" strokeWidth="2" />
                          {/* Teeth */}
                          {Array.from({ length: 9 }).map((_, i) => (
                            <line key={i} x1={15 + i * 13} y1="50" x2={15 + i * 13} y2="70" stroke="#f59e0b" strokeWidth="3" />
                          ))}
                          <text x="70" y="37" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                            প্লাস্টিক চিরুনি
                          </text>
                          <text x="70" y="95" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">
                            {effectiveRubs > 0 ? `-${(effectiveRubs * 0.8).toFixed(1)} μC (ঋণাত্মক)` : 'অনাহিত (নিরপেক্ষ)'}
                          </text>
                        </>
                      ) : (
                        <>
                          {/* Rubber Balloon */}
                          <ellipse cx="70" cy="40" rx="55" ry="40" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
                          <polygon points="65,80 75,80 70,88" fill="#ec4899" />
                          <text x="70" y="44" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                            বেলুন (Balloon)
                          </text>
                          <text x="70" y="110" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">
                            {effectiveRubs > 0 ? `-${(effectiveRubs * 0.8).toFixed(1)} μC (ঋণাত্মক)` : 'অনাহিত (নিরপেক্ষ)'}
                          </text>
                        </>
                      )}

                      {/* Positive or Negative badges floating on Object A */}
                      {Array.from({ length: Math.min(6, effectiveRubs) }).map((_, i) => (
                        <circle
                          key={i}
                          cx={20 + i * 20}
                          cy={triboPair === 'glass_silk' ? 37 : 32}
                          r="7"
                          fill={triboPair === 'glass_silk' ? '#0284c7' : '#b91c1c'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      ))}
                      {Array.from({ length: Math.min(6, effectiveRubs) }).map((_, i) => (
                        <text
                          key={i}
                          x={20 + i * 20}
                          y={triboPair === 'glass_silk' ? 41 : 36}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {triboPair === 'glass_silk' ? '+' : '−'}
                        </text>
                      ))}
                    </g>

                    {/* Rubbing Interface Arrow & Particles */}
                    <g transform="translate(320, 110)">
                      <circle cx="30" cy="30" r="24" fill="#1e293b" stroke="#334155" strokeDasharray="3,3" />
                      <text x="30" y="34" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                        ঘর্ষণ
                      </text>

                      {/* Flying Electrons Stream */}
                      {effectiveRubs > 0 && (
                        <g>
                          <path
                            d={
                              triboPair === 'glass_silk'
                                ? 'M -20,20 Q 30,-10 80,20'
                                : 'M 80,20 Q 30,70 -20,20'
                            }
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="2.5"
                            strokeDasharray="4,4"
                          />
                          <circle
                            cx={triboPair === 'glass_silk' ? 40 : 20}
                            cy={triboPair === 'glass_silk' ? 6 : 48}
                            r="5"
                            fill="#fbbf24"
                          />
                          <text
                            x={triboPair === 'glass_silk' ? 40 : 20}
                            y={triboPair === 'glass_silk' ? 9 : 51}
                            textAnchor="middle"
                            fill="#000000"
                            fontSize="8"
                            fontWeight="bold"
                          >
                            e⁻
                          </text>
                        </g>
                      )}
                    </g>

                    {/* Object B (Right) */}
                    <g transform="translate(420, 100)">
                      {triboPair === 'glass_silk' ? (
                        <>
                          {/* Silk Cloth */}
                          <rect x="0" y="10" width="130" height="50" rx="8" fill="url(#silkGrad)" stroke="#f43f5e" strokeWidth="2" />
                          <text x="65" y="40" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                            রেশম কাপড় (Silk)
                          </text>
                          <text x="65" y="80" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">
                            {effectiveRubs > 0 ? `-${(effectiveRubs * 0.8).toFixed(1)} μC (ঋণাত্মক)` : 'অনাহিত (নিরপেক্ষ)'}
                          </text>
                        </>
                      ) : (
                        <>
                          {/* Flannel / Wool Cloth */}
                          <rect x="0" y="10" width="130" height="50" rx="8" fill="url(#woolGrad)" stroke="#c084fc" strokeWidth="2" />
                          <text x="65" y="40" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                            পশমি কাপড় / ফ্লানেল
                          </text>
                          <text x="65" y="80" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                            {effectiveRubs > 0 ? `+${(effectiveRubs * 0.8).toFixed(1)} μC (ধনাত্মক)` : 'অনাহিত (নিরপেক্ষ)'}
                          </text>
                        </>
                      )}

                      {/* Charge badges floating on Object B */}
                      {Array.from({ length: Math.min(6, effectiveRubs) }).map((_, i) => (
                        <circle
                          key={i}
                          cx={18 + i * 19}
                          cy="35"
                          r="7"
                          fill={triboPair === 'glass_silk' ? '#b91c1c' : '#0284c7'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      ))}
                      {Array.from({ length: Math.min(6, effectiveRubs) }).map((_, i) => (
                        <text
                          key={i}
                          x={18 + i * 19}
                          y="39"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {triboPair === 'glass_silk' ? '−' : '+'}
                        </text>
                      ))}
                    </g>

                    {/* Paper Scraps Attraction Animation Area */}
                    <g transform="translate(100, 230)">
                      <rect x="0" y="0" width="500" height="90" rx="10" fill="#090d16" stroke="#1e293b" />
                      <text x="250" y="24" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                        কাগজের টুকরা আকর্ষণ পরীক্ষা (Electrostatic Attraction of Neutral Paper)
                      </text>

                      {/* Neutral table floor */}
                      <line x1="50" y1="75" x2="450" y2="75" stroke="#334155" strokeWidth="2" />

                      {/* Paper Pieces */}
                      {Array.from({ length: 8 }).map((_, idx) => {
                        const isAttracted = showPaperTest && effectiveRubs > 1;
                        const paperX = 140 + idx * 28;
                        const paperY = isAttracted ? 48 - (idx % 3) * 6 : 69;
                        const rot = isAttracted ? (idx % 2 === 0 ? 30 : -25) : 0;
                        return (
                          <g key={idx} transform={`translate(${paperX}, ${paperY}) rotate(${rot})`}>
                            <rect x="-6" y="-4" width="12" height="8" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
                            {isAttracted && (
                              <line x1="0" y1="-8" x2="0" y2="-1" stroke="#fbbf24" strokeWidth="1" strokeDasharray="1,1" />
                            )}
                          </g>
                        );
                      })}

                      {showPaperTest && effectiveRubs <= 1 && (
                        <text x="250" y="60" textAnchor="middle" fill="#f87171" fontSize="11">
                          আধান খুব কম! কাগজের টুকরা আকর্ষণ করতে ঘর্ষণ বাড়াও।
                        </text>
                      )}
                      {showPaperTest && effectiveRubs > 1 && (
                        <text x="250" y="44" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">
                          আবেশের কারণে অনাহিত কাগজে বিপরীত আধান সৃষ্টি হয়ে লাফিয়ে চিরুনিতে আটকাচ্ছে!
                        </text>
                      )}
                    </g>
                  </svg>

                  {/* Summary Bar */}
                  <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">কার্যকর ঘর্ষণ</span>
                      <span className="text-sm font-bold font-mono text-amber-400">{effectiveRubs} বার</span>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">স্থানান্তরিত ইলেকট্রন</span>
                      <span className="text-sm font-bold font-mono text-cyan-400">
                        ~{electronsTransferred} × ১০¹⁰
                      </span>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">বাতাসের আর্দ্রতা</span>
                      <span className={`text-sm font-bold font-mono ${isMonsoonHumid ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isMonsoonHumid ? '৯৫% (আর্দ্র বর্ষা)' : '২০% (শুষ্ক শীত)'}
                      </span>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">সঞ্চিত চার্জ (Q)</span>
                      <span className="text-sm font-bold font-mono text-amber-400">
                        ±{netMicroCoulombs} μC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-5">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>ঘর্ষণ ল্যাব কন্ট্রোল</span>
                    </h3>

                    {/* Material Pair Select */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                        ঘর্ষণের বস্তু নির্বাচন (Triboelectric Pair):
                      </label>
                      <div className="space-y-1.5">
                        {[
                          { key: 'comb_wool', label: 'প্লাস্টিক চিরুনি + পশম (চিরুনি ঋণাত্মক)', desc: 'চিরুনির ইলেকট্রন আসক্তি বেশি' },
                          { key: 'glass_silk', label: 'কাচ দণ্ড + রেশম (কাচ ধনাত্মক)', desc: 'কাচ ইলেকট্রন হারায়' },
                          { key: 'balloon_wool', label: 'বেলুন + পশমি কাপড় (বেলুন ঋণাত্মক)', desc: 'রাবার ইলেকট্রন টেনে নেয়' },
                        ].map((item) => (
                          <button
                            key={item.key}
                            onClick={() => setTriboPair(item.key as any)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                              triboPair === item.key
                                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                                : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div>{item.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rub Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>ঘর্ষণ সংখ্যা (Rubbing Cycles):</span>
                        <span className="font-mono font-bold text-amber-400">{rubCount} বার</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={rubCount}
                        onChange={(e) => setRubCount(parseInt(e.target.value))}
                        className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Humidity Switch */}
                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-200 font-medium block">আবহাওয়ার আর্দ্রতা</span>
                          <span className="text-[10px] text-slate-400">বর্ষাকালে স্থির বিদ্যুৎ স্থায়ী হয় না কেন?</span>
                        </div>
                        <button
                          onClick={() => setIsMonsoonHumid(!isMonsoonHumid)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                            isMonsoonHumid
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {isMonsoonHumid ? '🌧️ বর্ষাকাল' : '☀️ শুষ্ক শীতকাল'}
                        </button>
                      </div>
                    </div>

                    {/* Paper Attraction Button */}
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setShowPaperTest(!showPaperTest)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center space-x-2 border border-slate-700 transition"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{showPaperTest ? 'কাগজের পরীক্ষা বন্ধ করো' : 'কাগজের টুকরা কাছে এনে পরীক্ষা করো'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Textbook Note Card */}
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                      <BookOpen className="w-4 h-4" />
                      <span>পাঠ্যবইয়ের গোপন তত্ত্ব (পৃষ্ঠা ২৭৪)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      কাগজ নিজে অনাহিত হলেও যখন ঋণাত্মক চিরুনি কাছে আনা হয়, তখন চিরুনির বিকর্ষণে কাগজের ওপরের পৃষ্ঠের ইলেকট্রন দূরে সরে যায় এবং ওপরের পৃষ্ঠে ধনাত্মক আধানের আবেশ ঘটে। ফলে অনাহিত কাগজটি চিরুনির দিকে তীব্রভাবে আকৃষ্ট হয়!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 2: GOLD LEAF ELECTROSCOPE & CHARGING BY INDUCTION               */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visualizer Stage */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-xs font-mono text-amber-400 flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র (Gold Leaf Electroscope)</span>
                  </div>

                  {/* SVG Canvas */}
                  <svg viewBox="0 0 650 380" className="w-full max-w-lg h-auto drop-shadow-md">
                    {/* Glass Jar Outer Body */}
                    <path
                      d="M 230 140 L 230 310 Q 230 330 250 330 L 400 330 Q 420 330 420 310 L 420 140 Z"
                      fill="#0f172a"
                      stroke="#475569"
                      strokeWidth="2.5"
                      opacity="0.85"
                    />

                    {/* Rubber / Ebonite Cork Stopper */}
                    <rect x="290" y="115" width="70" height="28" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
                    <text x="325" y="133" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      কুপরিবাহী ছিপি
                    </text>

                    {/* Metal Disc / Cap at Top */}
                    <ellipse cx="325" cy="70" rx="60" ry="16" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
                    <text x="325" y="74" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                      ধাতব চাকতি (Disc)
                    </text>

                    {/* Charges on the Disc */}
                    {bringingRod === 'positive' && (
                      <g>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <text key={i} x={285 + i * 20} y={64} fill="#ef4444" fontSize="12" fontWeight="bold">
                            −
                          </text>
                        ))}
                      </g>
                    )}
                    {bringingRod === 'negative' && (
                      <g>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <text key={i} x={285 + i * 20} y={64} fill="#38bdf8" fontSize="12" fontWeight="bold">
                            +
                          </text>
                        ))}
                      </g>
                    )}

                    {/* Brass Conducting Rod */}
                    <rect x="322" y="86" width="6" height="150" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />

                    {/* Gold Leaf Hinges and Divergence Leaves */}
                    <g transform="translate(325, 236)">
                      {/* Left Leaf */}
                      <g transform={`rotate(-${leafAngle})`}>
                        <path d="M 0 0 L -8 60 L 0 55 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                        {leafAngle > 5 && (
                          <text x="-12" y="40" fill="#ffffff" fontSize="10" fontWeight="bold">
                            {bringingRod === 'positive' || electroscopeState === 'positive' ? '+' : '−'}
                          </text>
                        )}
                      </g>
                      {/* Right Leaf */}
                      <g transform={`rotate(${leafAngle})`}>
                        <path d="M 0 0 L 8 60 L 0 55 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                        {leafAngle > 5 && (
                          <text x="8" y="40" fill="#ffffff" fontSize="10" fontWeight="bold">
                            {bringingRod === 'positive' || electroscopeState === 'positive' ? '+' : '−'}
                          </text>
                        )}
                      </g>
                      {/* Pivot Pin */}
                      <circle cx="0" cy="0" r="3" fill="#ffffff" />
                    </g>

                    {/* Grounding Wire / Touch if active */}
                    {isGrounded && (
                      <g>
                        <path d="M 385 70 Q 460 70 480 160 L 480 280" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="3,3" />
                        <text x="490" y="200" fill="#22c55e" fontSize="10" fontWeight="bold">
                          ভূ-সংযোগ (Earth Ground)
                        </text>
                        {/* Ground symbol */}
                        <line x1="470" y1="280" x2="490" y2="280" stroke="#22c55e" strokeWidth="3" />
                        <line x1="474" y1="285" x2="486" y2="285" stroke="#22c55e" strokeWidth="2" />
                        <line x1="478" y1="290" x2="482" y2="290" stroke="#22c55e" strokeWidth="1" />
                      </g>
                    )}

                    {/* External Rod being brought near */}
                    {bringingRod !== 'none' && (
                      <g transform={`translate(${160 - rodDistanceCm * 6}, 50)`}>
                        <rect
                          x="0"
                          y="0"
                          width="110"
                          height="24"
                          rx="6"
                          fill={bringingRod === 'positive' ? '#ef4444' : '#3b82f6'}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <text x="55" y="16" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                          {bringingRod === 'positive' ? '+ আধানের দণ্ড' : '− আধানের দণ্ড'}
                        </text>
                        {/* Dotted Induction Lines to Disc */}
                        <path
                          d="M 110 12 L 170 20"
                          stroke={bringingRod === 'positive' ? '#ef4444' : '#3b82f6'}
                          strokeWidth="1.5"
                          strokeDasharray="2,2"
                        />
                      </g>
                    )}

                    {/* Foil linings on inside jar walls */}
                    <rect x="232" y="240" width="4" height="60" fill="#94a3b8" />
                    <rect x="414" y="240" width="4" height="60" fill="#94a3b8" />
                  </svg>

                  {/* Real-time Status Card */}
                  <div className="w-full mt-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">স্বর্ণপাতের ফাঁক কোণ: </span>
                      <span className="font-mono font-bold text-amber-400">{leafAngle.toFixed(1)}°</span>
                    </div>
                    <div>
                      <span className="text-slate-400">যন্ত্রের মূল অবস্থা: </span>
                      <span className="font-semibold text-slate-200">
                        {electroscopeState === 'neutral'
                          ? 'অনাহিত (Neutral)'
                          : electroscopeState === 'positive'
                          ? 'ধনাত্মক আহিত (+)'
                          : 'ঋণাত্মক আহিত (−)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">পাতার আচরণ: </span>
                      <span className="font-bold text-emerald-400">
                        {leafAngle === 0
                          ? 'পাতা দুটি পরস্পরের সাথে লেগে আছে'
                          : leafAngle > 40
                          ? 'তীব্র বিকর্ষণে বহু দূরে ফাঁক হয়েছে'
                          : 'স্বল্প ফাঁক তৈরি হয়েছে'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Control Panel & Induction Wizard */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Controls */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>তড়িৎবীক্ষণ যন্ত্র নিয়ন্ত্রণ</span>
                    </h3>

                    {/* Bringing Rod Type */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                        বাহ্যিক আহিত দণ্ড কাছে আনা:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        {[
                          { key: 'none', label: 'দণ্ড নেই' },
                          { key: 'positive', label: '+ কাচ দণ্ড' },
                          { key: 'negative', label: '− চিরুনি' },
                        ].map((item) => (
                          <button
                            key={item.key}
                            onClick={() => setBringingRod(item.key as any)}
                            className={`p-2 rounded-xl border text-center transition ${
                              bringingRod === item.key
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rod Distance Slider */}
                    {bringingRod !== 'none' && (
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>দণ্ডের দূরত্ব (Distance):</span>
                          <span className="font-mono font-bold text-cyan-400">{rodDistanceCm} cm</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="15"
                          step="1"
                          value={rodDistanceCm}
                          onChange={(e) => setRodDistanceCm(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Grounding Button */}
                    <div>
                      <button
                        onClick={() => setIsGrounded(!isGrounded)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-2 transition ${
                          isGrounded
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isGrounded ? 'আর্থিং বিচ্ছিন্ন করো (হাত সরাও)' : 'আর্থিং করো (চাকতিতে হাত দিয়ে স্পর্শ)'}</span>
                      </button>
                    </div>

                    {/* Base State */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">
                        যন্ত্রটির প্রাথমিক আধান অবস্থা:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        {[
                          { key: 'neutral', label: 'অনাহিত' },
                          { key: 'positive', label: '+ আহিত' },
                          { key: 'negative', label: '− আহিত' },
                        ].map((st) => (
                          <button
                            key={st.key}
                            onClick={() => {
                              setElectroscopeState(st.key as any);
                              setIsGrounded(false);
                            }}
                            className={`p-1.5 rounded-lg border text-center transition ${
                              electroscopeState === st.key
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                                : 'bg-slate-800/30 border-slate-800 text-slate-400'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4-Step Induction Guide */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-amber-400 font-bold">
                      <span className="flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>আবেশে স্থায়ী আহিতকরণের ৪ ধাপ</span>
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-300">
                      <div
                        onClick={() => {
                          setElectroscopeState('neutral');
                          setBringingRod('positive');
                          setRodDistanceCm(3);
                          setIsGrounded(false);
                        }}
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer border border-slate-700/60 transition"
                      >
                        <span className="font-bold text-amber-400">ধাপ ১:</span> + দণ্ড চাকতির কাছে আনো (চাকতিতে মুক্ত − চার্জ ও পাতায় + চার্জ জমা হয়ে পাতা ফাঁক হয়)।
                      </div>
                      <div
                        onClick={() => {
                          setIsGrounded(true);
                        }}
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer border border-slate-700/60 transition"
                      >
                        <span className="font-bold text-amber-400">ধাপ ২:</span> চাকতিতে হাত দিয়ে আর্থিং করো (মাটি থেকে ইলেকট্রন এসে পাতার চার্জ নিরপেক্ষ করে, পাতা বন্ধ হয়)।
                      </div>
                      <div
                        onClick={() => {
                          setIsGrounded(false);
                        }}
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer border border-slate-700/60 transition"
                      >
                        <span className="font-bold text-amber-400">ধাপ ৩:</span> হাত সরিয়ে আর্থিং বিচ্ছিন্ন করো (দণ্ডটি তখনও কাছেই থাকবে)।
                      </div>
                      <div
                        onClick={() => {
                          setBringingRod('none');
                          setElectroscopeState('negative');
                        }}
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer border border-slate-700/60 transition"
                      >
                        <span className="font-bold text-amber-400">ধাপ ৪:</span> + দণ্ডটি দূরে সরিয়ে নাও (আবদ্ধ − চার্জ সমগ্র যন্ত্রে ছড়িয়ে স্থায়ীভাবে ঋণাত্মক হয়ে পাতা পুনরায় ফাঁক হয়!)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 3: COULOMB'S FORCE & INVERSE SQUARE LAW COLLIDER                */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visualizer Stage */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-xs font-mono text-amber-400 flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Activity className="w-3.5 h-3.5" />
                    <span>কুলম্বের সূত্র বল ভেক্টর ও দূরত্বের প্রভাব</span>
                  </div>

                  {/* SVG Canvas */}
                  <svg viewBox="0 0 650 340" className="w-full max-w-lg h-auto drop-shadow-md">
                    {/* Linear Optical Track */}
                    <rect x="50" y="195" width="550" height="12" rx="4" fill="#1e293b" stroke="#334155" />
                    {/* Tick Marks on Track */}
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line
                        key={i}
                        x1={75 + i * 50}
                        y1="195"
                        x2={75 + i * 50}
                        y2="207"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Charge Sphere 1 Position (Left) */}
                    <g transform={`translate(${180 - distRMetres * 50}, 150)`}>
                      {/* Sphere Body */}
                      <circle
                        cx="0"
                        cy="0"
                        r={16 + Math.min(14, Math.abs(q1MicroC) * 1.4)}
                        fill={q1MicroC >= 0 ? '#38bdf8' : '#ef4444'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="drop-shadow-lg"
                      />
                      <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                        {q1MicroC >= 0 ? `+${q1MicroC}` : `${q1MicroC}`}
                      </text>
                      <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                        q₁ আধান
                      </text>

                      {/* Force Vector F_12 Arrow */}
                      {forceMag > 0.001 && (
                        <g>
                          <line
                            x1="0"
                            y1="0"
                            x2={isAttractive ? 45 + Math.min(60, forceMag * 4) : -(45 + Math.min(60, forceMag * 4))}
                            y2="0"
                            stroke={isAttractive ? '#10b981' : '#f59e0b'}
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <polygon
                            points={
                              isAttractive
                                ? `${45 + Math.min(60, forceMag * 4) + 8},0 ${45 + Math.min(60, forceMag * 4)},-6 ${45 + Math.min(60, forceMag * 4)},6`
                                : `${-(45 + Math.min(60, forceMag * 4) + 8)},0 ${-(45 + Math.min(60, forceMag * 4))},-6 ${-(45 + Math.min(60, forceMag * 4))},6`
                            }
                            fill={isAttractive ? '#10b981' : '#f59e0b'}
                          />
                          <text
                            x={isAttractive ? 30 : -30}
                            y="-12"
                            textAnchor="middle"
                            fill={isAttractive ? '#10b981' : '#f59e0b'}
                            fontSize="11"
                            fontWeight="bold"
                          >
                            F₁₂
                          </text>
                        </g>
                      )}
                    </g>

                    {/* Charge Sphere 2 Position (Right) */}
                    <g transform={`translate(${470 + distRMetres * 50}, 150)`}>
                      {/* Sphere Body */}
                      <circle
                        cx="0"
                        cy="0"
                        r={16 + Math.min(14, Math.abs(q2MicroC) * 1.4)}
                        fill={q2MicroC >= 0 ? '#38bdf8' : '#ef4444'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="drop-shadow-lg"
                      />
                      <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                        {q2MicroC >= 0 ? `+${q2MicroC}` : `${q2MicroC}`}
                      </text>
                      <text x="0" y="-28" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                        q₂ আধান
                      </text>

                      {/* Force Vector F_21 Arrow */}
                      {forceMag > 0.001 && (
                        <g>
                          <line
                            x1="0"
                            y1="0"
                            x2={isAttractive ? -(45 + Math.min(60, forceMag * 4)) : 45 + Math.min(60, forceMag * 4)}
                            y2="0"
                            stroke={isAttractive ? '#10b981' : '#f59e0b'}
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <polygon
                            points={
                              isAttractive
                                ? `${-(45 + Math.min(60, forceMag * 4) + 8)},0 ${-(45 + Math.min(60, forceMag * 4))},-6 ${-(45 + Math.min(60, forceMag * 4))},6`
                                : `${45 + Math.min(60, forceMag * 4) + 8},0 ${45 + Math.min(60, forceMag * 4)},-6 ${45 + Math.min(60, forceMag * 4)},6`
                            }
                            fill={isAttractive ? '#10b981' : '#f59e0b'}
                          />
                          <text
                            x={isAttractive ? -30 : 30}
                            y="-12"
                            textAnchor="middle"
                            fill={isAttractive ? '#10b981' : '#f59e0b'}
                            fontSize="11"
                            fontWeight="bold"
                          >
                            F₂₁
                          </text>
                        </g>
                      )}
                    </g>

                    {/* Distance Dimension Line between spheres */}
                    <g transform="translate(0, 240)">
                      <line
                        x1={180 - distRMetres * 50}
                        y1="0"
                        x2={470 + distRMetres * 50}
                        y2="0"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={180 - distRMetres * 50}
                        y1="-8"
                        x2={180 - distRMetres * 50}
                        y2="8"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={470 + distRMetres * 50}
                        y1="-8"
                        x2={470 + distRMetres * 50}
                        y2="8"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                      />
                      <text
                        x={(180 - distRMetres * 50 + (470 + distRMetres * 50)) / 2}
                        y="-8"
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="12"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        r = {distRMetres.toFixed(2)} m ({(distRMetres * 100).toFixed(0)} cm)
                      </text>
                    </g>

                    {/* Force Nature Banner */}
                    <g transform="translate(325, 60)">
                      <rect
                        x="-120"
                        y="-15"
                        width="240"
                        height="30"
                        rx="15"
                        fill={isAttractive ? '#064e3b' : '#78350f'}
                        stroke={isAttractive ? '#10b981' : '#f59e0b'}
                        strokeWidth="1.5"
                      />
                      <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                        {isAttractive ? 'আকর্ষণ বল (Attraction) [F < 0]' : 'বিকর্ষণ বল (Repulsion) [F > 0]'}
                      </text>
                    </g>
                  </svg>

                  {/* Mathematical Live Breakdown */}
                  <div className="w-full mt-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">কুলম্ব বলের মান:</span>
                        <span className="text-base font-bold font-mono text-amber-400">
                          {forceMag >= 1000 ? forceMag.toExponential(3) : forceMag.toFixed(3)} N
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block mb-0.5">ব্যস্তানুপাতিক বর্গ প্রভাব (১/r²):</span>
                        <span className="text-xs font-mono text-cyan-300">
                          দূরত্ব দ্বিগুণ করলে বল ৪ গুণ কমে, অর্ধেক করলে ৪ গুণ বাড়ে!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>কুলম্ব প্যারামিটার</span>
                    </h3>

                    {/* Charge 1 Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>আধান q₁:</span>
                        <span className="font-mono font-bold text-sky-400">
                          {q1MicroC > 0 ? `+${q1MicroC}` : q1MicroC} μC
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="1"
                        value={q1MicroC}
                        onChange={(e) => setQ1MicroC(parseInt(e.target.value))}
                        className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Charge 2 Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>আধান q₂:</span>
                        <span className="font-mono font-bold text-rose-400">
                          {q2MicroC > 0 ? `+${q2MicroC}` : q2MicroC} μC
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="1"
                        value={q2MicroC}
                        onChange={(e) => setQ2MicroC(parseInt(e.target.value))}
                        className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Distance Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>দূরত্ব r:</span>
                        <span className="font-mono font-bold text-amber-400">{distRMetres.toFixed(2)} m</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.05"
                        value={distRMetres}
                        onChange={(e) => setDistRMetres(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Medium Selector */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">
                        মাধ্যম নির্বাচন (Medium Permittivity):
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        {[
                          { key: 'vacuum', label: 'বায়ু / শূন্য', kDesc: 'k = 9×10⁹' },
                          { key: 'glass', label: 'কাচ (κ = 5)', kDesc: 'বল ৫ গুণ কম' },
                          { key: 'water', label: 'পানি (κ = 80)', kDesc: 'বল ৮০ গুণ কম' },
                        ].map((m) => (
                          <button
                            key={m.key}
                            onClick={() => setMediumK(m.key as any)}
                            className={`p-1.5 rounded-xl border text-center transition ${
                              mediumK === m.key
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="text-[11px] font-bold">{m.label}</div>
                            <div className="text-[9px] text-slate-500">{m.kDesc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preset Buttons for Quick Board Scenarios */}
                    <div className="pt-2 border-t border-slate-800">
                      <label className="text-xs text-slate-400 block mb-1.5">বোর্ড পরীক্ষার দ্রুত দৃশ্যকল্প:</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => {
                            setQ1MicroC(5);
                            setQ2MicroC(3);
                            setDistRMetres(1.0);
                            setMediumK('vacuum');
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-left border border-slate-700"
                        >
                          <span className="font-bold block text-amber-400">+5 C & +3 C (বই পৃষ্ঠা ২৮১)</span>
                          <span className="text-[10px] text-slate-400">সমধর্মী বিকর্ষণ</span>
                        </button>
                        <button
                          onClick={() => {
                            setQ1MicroC(4);
                            setQ2MicroC(-1);
                            setDistRMetres(1.0);
                            setMediumK('vacuum');
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-left border border-slate-700"
                        >
                          <span className="font-bold block text-cyan-400">+4 C & -1 C (বই পৃষ্ঠা ২৯৫)</span>
                          <span className="text-[10px] text-slate-400">বিপরীতধর্মী আকর্ষণ</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Formula Card */}
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                      <BookOpen className="w-4 h-4" />
                      <span>নিউটন বনাম কুলম্ব সমধর্মিতা</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      মহাকর্ষ বল যেমন ভরের গুণফলের সমানুপাতিক, তড়িৎ বলও তেমনি আধানের গুণফলের সমানুপাতিক। তবে মহাকর্ষ বল কেবল আকর্ষণধর্মী, অন্যদিকে কুলম্ব বল আকর্ষণ ও বিকর্ষণ উভয়ধর্মী হতে পারে!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 4: ELECTRIC FIELD & LINE OF FORCE SIMULATOR                     */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visualizer Stage */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-xs font-mono text-amber-400 flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Compass className="w-3.5 h-3.5" />
                    <span>তড়িৎ প্রাবল্য ভেক্টর ও নিরপেক্ষ বিন্দু (Null Point)</span>
                  </div>

                  {/* SVG Canvas */}
                  <svg viewBox="0 0 650 360" className="w-full max-w-lg h-auto drop-shadow-md">
                    {/* Background Field Lines Representation */}
                    <g opacity="0.4">
                      {fieldPreset === 'dipole' && (
                        <>
                          {/* Curved Dipole Lines */}
                          <path d="M 130 180 C 130 80, 520 80, 520 180" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d="M 130 180 C 130 40, 520 40, 520 180" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d="M 130 180 C 130 280, 520 280, 520 180" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d="M 130 180 C 130 320, 520 320, 520 180" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                        </>
                      )}
                      {fieldPreset === 'like_pos' && (
                        <>
                          {/* Repulsive lines diverging outward leaving middle empty */}
                          <path d="M 130 180 C 130 100, 280 100, 310 30" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d="M 520 180 C 520 100, 370 100, 340 30" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d="M 130 180 C 130 260, 280 260, 310 330" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d="M 520 180 C 520 260, 370 260, 340 330" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" />
                        </>
                      )}
                    </g>

                    {/* Central Axis connecting charges */}
                    <line x1="50" y1="180" x2="600" y2="180" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />

                    {/* Left Charge */}
                    <g transform="translate(130, 180)">
                      <circle
                        cx="0"
                        cy="0"
                        r="22"
                        fill={chargeLeft >= 0 ? '#38bdf8' : '#ef4444'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                        {chargeLeft >= 0 ? `+${chargeLeft}` : chargeLeft} C
                      </text>
                      <text x="0" y="-30" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                        Q₁ (x = 0.0 m)
                      </text>
                    </g>

                    {/* Right Charge (if present) */}
                    {chargeRight !== 0 && (
                      <g transform="translate(520, 180)">
                        <circle
                          cx="0"
                          cy="0"
                          r="22"
                          fill={chargeRight >= 0 ? '#38bdf8' : '#ef4444'}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        />
                        <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                          {chargeRight >= 0 ? `+${chargeRight}` : chargeRight} C
                        </text>
                        <text x="0" y="-30" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                          Q₂ (x = 1.0 m)
                        </text>
                      </g>
                    )}

                    {/* Test Probe Position (x = probeX along track from 130 to 520) */}
                    {(() => {
                      const probePixelX = 130 + probeX * 390;
                      return (
                        <g transform={`translate(${probePixelX}, 180)`}>
                          {/* Test Charge q0 = +1 C */}
                          <circle cx="0" cy="0" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                          <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                            +1
                          </text>
                          <text x="0" y="-18" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">
                            পরখ আধান (q₀)
                          </text>

                          {/* Resultant E Vector Arrow */}
                          {Math.abs(eNetSigned) > 100 && (
                            <g>
                              <line
                                x1="0"
                                y1="0"
                                x2={eNetSigned > 0 ? 50 : -50}
                                y2="0"
                                stroke="#f59e0b"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                              />
                              <polygon
                                points={
                                  eNetSigned > 0
                                    ? '56,0 48,-5 48,5'
                                    : '-56,0 -48,-5 -48,5'
                                }
                                fill="#f59e0b"
                              />
                              <text
                                x={eNetSigned > 0 ? 30 : -30}
                                y="-8"
                                textAnchor="middle"
                                fill="#f59e0b"
                                fontSize="11"
                                fontWeight="bold"
                              >
                                E_{'net'}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Live Probe Readout */}
                  <div className="w-full mt-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">পরখ আধানের অবস্থান (x):</span>
                      <span className="font-mono font-bold text-amber-400">{probeX.toFixed(2)} m</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">লব্ধি তড়িৎ তীব্রতা (E_net):</span>
                      <span className="font-mono font-bold text-cyan-400">
                        {Math.abs(eNetSigned).toExponential(2)} N/C
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">প্রাবল্যের দিক:</span>
                      <span className="font-bold text-emerald-400">
                        {eNetSigned > 0 ? 'ডান দিকে (→)' : 'বাম দিকে (←)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>ক্ষেত্র ও বলরেখা কনফিগারেশন</span>
                    </h3>

                    {/* Presets */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                        বলরেখা দৃশ্যকল্প নির্বাচন:
                      </label>
                      <div className="space-y-1.5 text-xs">
                        {[
                          { key: 'dipole', label: 'তড়িৎ দ্বিমেরু (+5 C এবং -5 C)', desc: 'ধনাত্মক থেকে ঋণাত্মকে বলরেখা বাঁকে' },
                          { key: 'like_pos', label: 'দুটি সমধর্মী আধান (+5 C এবং +3 C)', desc: 'মাঝামাঝি নিরপেক্ষ বিন্দু E = 0' },
                          { key: 'textbook_cq', label: 'পাঠ্যবই প্রশ্ন (+4 C এবং -1 C)', desc: 'ছোট চার্জের বাইরে নিরপেক্ষ বিন্দু' },
                          { key: 'single_pos', label: 'একক ধনাত্মক আধান (+5 C)', desc: 'অপসারী বলরেখা (চারদিকে ছড়ানো)' },
                          { key: 'single_neg', label: 'একক ঋণাত্মক আধান (-5 C)', desc: 'অভিসারী বলরেখা (ভেতরে প্রবেশ)' },
                        ].map((p) => (
                          <button
                            key={p.key}
                            onClick={() => setFieldPreset(p.key as any)}
                            className={`w-full text-left p-2 rounded-xl border transition ${
                              fieldPreset === p.key
                                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold'
                                : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div>{p.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{p.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Probe Position Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>পরখ আধান x স্লাইড করো:</span>
                        <span className="font-mono font-bold text-emerald-400">{probeX.toFixed(2)} m</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.95"
                        step="0.01"
                        value={probeX}
                        onChange={(e) => setProbeX(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Textbook Null Point Answer for like_pos */}
                    {fieldPreset === 'like_pos' && (
                      <div className="p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-amber-400 block">নিরপেক্ষ বিন্দু (পৃষ্ঠা ২৮১):</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          +5 C থেকে <span className="font-mono text-cyan-300 font-bold">x = 0.565 m</span> দূরত্বে দুটি চার্জের বিপরীতমুখী বল সমান হয়, অর্থাৎ লব্ধি বল বা প্রাবল্য শূন্য!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Line of Force Law Card */}
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                      <BookOpen className="w-4 h-4" />
                      <span>বলরেখা কখনো পরস্পরকে ছেদ করে না কেন?</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      বলরেখার কোনো বিন্দুতে অঙ্কিত স্পর্শক ওই বিন্দুতে তড়িৎ ক্ষেত্রের দিক নির্দেশ করে। যদি দুটি বলরেখা পরস্পরকে ছেদ করত, তবে তাদের ছেদবিন্দুতে দুটি ভিন্ন স্পর্শক হতো—অর্থাৎ একই বিন্দুতে তড়িৎ ক্ষেত্রের দুটি ভিন্ন দিক থাকত, যা বাস্তবে অসম্ভব!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 5: ELECTRIC POTENTIAL, CAPACITOR & LIGHTNING ROD                */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 5 && (
              <div className="space-y-6">
                {/* Sub-mode selector */}
                <div className="flex space-x-2 border-b border-slate-800 pb-3">
                  {[
                    { key: 'capacitor', label: 'সমান্তরাল পাত ধারক ল্যাব (Capacitor)', icon: BatteryCharging },
                    { key: 'potential', label: 'তড়িৎ বিভব ও আধান প্রবাহ (Potential)', icon: Activity },
                    { key: 'lightning', label: 'বজ্রপাত ও বজ্রনিরোধক দণ্ড (Lightning Safety)', icon: Flame },
                  ].map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <button
                        key={sub.key}
                        onClick={() => setLab5Mode(sub.key as any)}
                        className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                          lab5Mode === sub.key
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-mode: Capacitor */}
                {lab5Mode === 'capacitor' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Visualizer Stage */}
                    <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
                      <div className="absolute top-4 left-4 text-xs font-mono text-amber-400 flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                        <BatteryCharging className="w-3.5 h-3.5" />
                        <span>সমান্তরাল পাত ধারক ও শক্তি সঞ্চয় ল্যাব (C = Q/V)</span>
                      </div>

                      {/* SVG Parallel Plate Capacitor */}
                      <svg viewBox="0 0 650 320" className="w-full max-w-lg h-auto drop-shadow-md">
                        {/* Battery Connections */}
                        <path d="M 180 80 L 180 30 L 325 30 L 325 50" fill="none" stroke="#64748b" strokeWidth="2.5" />
                        <path d="M 470 80 L 470 30 L 325 30" fill="none" stroke="#64748b" strokeWidth="2.5" />

                        {/* Battery Symbol */}
                        <g transform="translate(325, 30)">
                          <line x1="-12" y1="-10" x2="-12" y2="10" stroke="#f59e0b" strokeWidth="3" />
                          <line x1="12" y1="-18" x2="12" y2="18" stroke="#f59e0b" strokeWidth="4" />
                          <text x="0" y="-22" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
                            {capVoltage} V
                          </text>
                        </g>

                        {/* Positive Plate (Left) */}
                        <g transform={`translate(${280 - capDistMm * 8}, 80)`}>
                          <rect x="-10" y="0" width="20" height="180" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                          {Array.from({ length: 7 }).map((_, i) => (
                            <text key={i} x="0" y={25 + i * 24} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                              +
                            </text>
                          ))}
                          <text x="0" y="205" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                            +Q পাত
                          </text>
                        </g>

                        {/* Dielectric Medium between plates */}
                        <rect
                          x={290 - capDistMm * 8}
                          y="85"
                          width={capDistMm * 16}
                          height="170"
                          fill={capDielectric === 1 ? '#0f172a' : '#d97706'}
                          opacity={capDielectric === 1 ? 0.3 : 0.4}
                          stroke="#475569"
                          strokeDasharray="2,2"
                        />
                        {capDielectric > 1 && (
                          <text
                            x={300}
                            y={175}
                            textAnchor="middle"
                            fill="#fbbf24"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            মাইকা ডাইইলেকট্রিক (κ = 6)
                          </text>
                        )}

                        {/* Electric Field Arrows between plates */}
                        {Array.from({ length: 5 }).map((_, i) => (
                          <g key={i}>
                            <line
                              x1={290 - capDistMm * 8}
                              y1={105 + i * 32}
                              x2={310 + capDistMm * 8}
                              y2={105 + i * 32}
                              stroke="#fbbf24"
                              strokeWidth="1.5"
                              strokeDasharray="3,3"
                            />
                            <polygon
                              points={`${310 + capDistMm * 8},${105 + i * 32} ${305 + capDistMm * 8},${102 + i * 32} ${305 + capDistMm * 8},${108 + i * 32}`}
                              fill="#fbbf24"
                            />
                          </g>
                        ))}

                        {/* Negative Plate (Right) */}
                        <g transform={`translate(${320 + capDistMm * 8}, 80)`}>
                          <rect x="-10" y="0" width="20" height="180" rx="4" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
                          {Array.from({ length: 7 }).map((_, i) => (
                            <text key={i} x="0" y={25 + i * 24} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                              −
                            </text>
                          ))}
                          <text x="0" y="205" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">
                            −Q পাত
                          </text>
                        </g>
                      </svg>

                      {/* Calculations Panel */}
                      <div className="w-full mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
                        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                          <span className="text-slate-400 block mb-0.5">ধারকত্ব (Capacitance C):</span>
                          <span className="text-base font-bold font-mono text-cyan-400">
                            {capacitancePF.toFixed(2)} pF
                          </span>
                        </div>
                        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                          <span className="text-slate-400 block mb-0.5">সঞ্চিত আধান (Q = CV):</span>
                          <span className="text-base font-bold font-mono text-amber-400">
                            {capChargePC.toFixed(2)} pC
                          </span>
                        </div>
                        <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                          <span className="text-slate-400 block mb-0.5">সঞ্চিত শক্তি (U = ½ CV²):</span>
                          <span className="text-base font-bold font-mono text-emerald-400">
                            {capEnergyPJ.toFixed(2)} pJ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Control Panel */}
                    <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>ধারক জ্যামিতি ও ভোল্টেজ</span>
                      </h3>

                      {/* Area */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>পাতের ক্ষেত্রফল (Area A):</span>
                          <span className="font-mono font-bold text-amber-400">{capAreaCm2} cm²</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={capAreaCm2}
                          onChange={(e) => setCapAreaCm2(parseInt(e.target.value))}
                          className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Distance */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>পাতের দূরত্ব (Distance d):</span>
                          <span className="font-mono font-bold text-cyan-400">{capDistMm} mm</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="1"
                          value={capDistMm}
                          onChange={(e) => setCapDistMm(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Voltage */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>ব্যাটারি বিভব (Voltage V):</span>
                          <span className="font-mono font-bold text-emerald-400">{capVoltage} V</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="48"
                          step="1"
                          value={capVoltage}
                          onChange={(e) => setCapVoltage(parseInt(e.target.value))}
                          className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Dielectric */}
                      <div>
                        <label className="text-xs text-slate-300 block mb-1 font-medium">ডাইইলেকট্রিক মাধ্যম:</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            onClick={() => setCapDielectric(1)}
                            className={`p-2 rounded-xl border text-center transition ${
                              capDielectric === 1
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-slate-800/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            বায়ু (κ = 1)
                          </button>
                          <button
                            onClick={() => setCapDielectric(6)}
                            className={`p-2 rounded-xl border text-center transition ${
                              capDielectric === 6
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-slate-800/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            মাইকা / কাচ (κ = 6)
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                        <span className="font-bold text-amber-400 block mb-0.5">বোর্ড ট্র্যাপ:</span>
                        দূরত্ব d কমালে ধারকত্ব বৃদ্ধি পায়, কিন্তু ভোল্টেজ স্থির থাকলে সঞ্চিত শক্তি বাড়ে! আবার ব্যাটারি খুলে নিয়ে দূরত্ব বাড়ালে ধারকত্ব কমে কিন্তু বিভব বৃদ্ধি পায়।
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-mode: Potential & Charge Flow */}
                {lab5Mode === 'potential' && (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="max-w-2xl mx-auto text-center space-y-1">
                      <h3 className="text-sm font-bold text-slate-200">
                        তড়িৎ বিভব ও আধান প্রবাহের দিক (পাঠ্যবই পৃষ্ঠা ২৯৬, MCQ ৪)
                      </h3>
                      <p className="text-xs text-slate-400">
                        দুটি গোলককে তার দ্বারা যুক্ত করলে কোন গোলক থেকে কোন গোলকে আধান যাবে? আধানের পরিমাণ নয়, বরং বিভব পার্থক্যই আধান প্রবাহের দিক ঠিক করে!
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-12 py-4">
                      {/* Sphere A */}
                      <div className="text-center space-y-2">
                        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex flex-col items-center justify-center border-4 border-amber-300 shadow-xl shadow-amber-500/10">
                          <span className="text-xs font-bold text-slate-950">গোলক A</span>
                          <span className="text-lg font-black text-slate-950 font-mono">
                            {isWireConnected ? '17.0 V' : `${potSphereA.v} V`}
                          </span>
                          <span className="text-[10px] text-slate-900 font-bold">{potSphereA.q} C চার্জ</span>
                        </div>
                        <span className="text-xs text-amber-400 font-semibold block">উচ্চ বিভব (High Potential)</span>
                      </div>

                      {/* Connecting Wire Animation */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-32 h-2 bg-slate-800 relative rounded-full overflow-hidden border border-slate-700">
                          {isWireConnected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-cyan-400 animate-pulse" />
                          )}
                        </div>
                        <button
                          onClick={() => setIsWireConnected(!isWireConnected)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                            isWireConnected
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {isWireConnected ? 'সংযোগ বিচ্ছিন্ন করো' : 'পরিবাহী তার দিয়ে যুক্ত করো'}
                        </button>
                        {isWireConnected && (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            + চার্জ: A → B এবং ইলেকট্রন: B → A
                          </span>
                        )}
                      </div>

                      {/* Sphere B */}
                      <div className="text-center space-y-2">
                        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-sky-600 to-blue-800 flex flex-col items-center justify-center border-4 border-sky-400 shadow-xl shadow-blue-500/10">
                          <span className="text-xs font-bold text-white">গোলক B</span>
                          <span className="text-lg font-black text-white font-mono">
                            {isWireConnected ? '17.0 V' : `${potSphereB.v} V`}
                          </span>
                          <span className="text-[10px] text-slate-200 font-bold">{potSphereB.q} C চার্জ</span>
                        </div>
                        <span className="text-xs text-sky-400 font-semibold block">নিম্ন বিভব (Low Potential)</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 max-w-2xl mx-auto text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-amber-400 block mb-1">পরীক্ষকের ব্যাখ্যা:</span>
                      যদিও B গোলকে চার্জের পরিমাণ বেশি (9 C &gt; 6 C), তবুও A গোলকের বিভব বেশি (24 V &gt; 10 V)। তাই ধনাত্মক আধান সর্বদা উচ্চ বিভব A থেকে নিম্ন বিভব B-তে প্রবাহিত হবে, যতক্ষণ না উভয়ের বিভব সমান হয়!
                    </div>
                  </div>
                )}

                {/* Sub-mode: Lightning & Safety */}
                {lab5Mode === 'lightning' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
                      <div className="absolute top-4 left-4 text-xs font-mono text-amber-400 flex items-center space-x-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Flame className="w-3.5 h-3.5" />
                        <span>বজ্রপাত ও বজ্রনিরোধক দণ্ডের কার্যপদ্ধতি (Lightning Rod)</span>
                      </div>

                      {/* SVG Canvas for Lightning */}
                      <svg viewBox="0 0 650 360" className="w-full max-w-lg h-auto drop-shadow-md">
                        {/* Storm Cloud at Top */}
                        <g transform="translate(180, 20)">
                          <path
                            d="M 40 40 Q 60 10 100 20 Q 140 -5 180 15 Q 220 5 250 35 Q 280 50 260 80 Q 240 105 180 95 Q 120 105 70 95 Q 30 85 40 40 Z"
                            fill="#334155"
                            stroke="#64748b"
                            strokeWidth="2"
                          />
                          {/* Negative charges accumulated in cloud */}
                          {Array.from({ length: 8 }).map((_, i) => (
                            <text
                              key={i}
                              x={70 + i * 22}
                              y="65"
                              fill="#ef4444"
                              fontSize="14"
                              fontWeight="bold"
                            >
                              −
                            </text>
                          ))}
                        </g>

                        {/* Building Base */}
                        <g transform="translate(260, 180)">
                          <rect x="0" y="0" width="130" height="150" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                          {/* Windows */}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <rect
                              key={i}
                              x={15 + (i % 2) * 60}
                              y={20 + Math.floor(i / 2) * 40}
                              width="35"
                              height="25"
                              fill="#f8fafc"
                              opacity="0.3"
                            />
                          ))}

                          {/* Lightning Rod (Pointed Conductor) */}
                          {hasLightningRod && (
                            <g>
                              {/* Copper Rod on Roof */}
                              <line x1="65" y1="0" x2="65" y2="-45" stroke="#f59e0b" strokeWidth="3.5" />
                              {/* Sharp Pointed Spikes */}
                              <polygon points="65,-55 60,-45 70,-45" fill="#f59e0b" />
                              <line x1="60" y1="-45" x2="52" y2="-52" stroke="#f59e0b" strokeWidth="2" />
                              <line x1="70" y1="-45" x2="78" y2="-52" stroke="#f59e0b" strokeWidth="2" />
                              {/* Positive induced charges on spikes */}
                              <text x="65" y="-30" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">
                                +++
                              </text>
                              {/* Grounding Wire running down into earth */}
                              <path d="M 65 0 L 132 0 L 132 150 L 132 180" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                            </g>
                          )}
                        </g>

                        {/* Ground Earth */}
                        <rect x="40" y="330" width="570" height="20" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                        <text x="325" y="345" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">
                          মাটি (ভূ-সংযুক্ত ইলেকট্রন সঞ্চয়াগার)
                        </text>

                        {/* Lightning Discharge Strike */}
                        {lightningDischarged && (
                          <g>
                            {hasLightningRod ? (
                              <path
                                d="M 280 90 L 300 115 L 325 135"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="4"
                                className="animate-pulse"
                              />
                            ) : (
                              <path
                                d="M 280 90 L 310 130 L 290 150 L 320 180"
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="6"
                                className="animate-pulse"
                              />
                            )}
                          </g>
                        )}
                      </svg>

                      {/* Feedback Banner */}
                      <div className="w-full mt-3 p-3 rounded-xl border text-xs text-center font-medium">
                        {hasLightningRod ? (
                          <span className="text-emerald-400">
                            🛡️ বজ্রনিরোধক দণ্ড তীক্ষ্ণমুখের ক্রিয়ায় (Action of Points) বায়ুকে আয়নিত করে শান্তভাবে মেঘের আধান প্রশমিত করে এবং বাকি বিপুল আধান তামার তার দিয়ে নিরাপদে মাটিতে পাঠিয়ে ভবনকে রক্ষা করে!
                          </span>
                        ) : (
                          <span className="text-rose-400">
                            ⚠️ সতর্কবাণী: বজ্রনিরোধক না থাকায় ভবনের ছাদ সরাসরি বজ্রপাতের উচ্চ বিভবে দগ্ধ হয়ে মারাত্মক ক্ষয়ক্ষতি ও অগ্নিকাণ্ডের শিকার হতে পারে!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>বজ্রপাত নিয়ন্ত্রণ</span>
                      </h3>

                      <div>
                        <label className="text-xs text-slate-300 block mb-1 font-medium">বজ্রনিরোধক সংযুক্তকরণ:</label>
                        <button
                          onClick={() => setHasLightningRod(!hasLightningRod)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                            hasLightningRod
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          }`}
                        >
                          {hasLightningRod ? '✓ ভবনে বজ্রনিরোধক রড লাগানো আছে' : '✕ কোনো বজ্রনিরোধক নেই (বিপজ্জনক)'}
                        </button>
                      </div>

                      <div>
                        <button
                          onClick={() => {
                            setLightningDischarged(true);
                            setTimeout(() => setLightningDischarged(false), 2200);
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition"
                        >
                          <Zap className="w-4 h-4" />
                          <span>মেঘ থেকে বজ্রপাত ঘটাও!</span>
                        </button>
                      </div>

                      <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-amber-400 block">গাড়ির ভেতর বজ্রপাত নিরাপত্তা:</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          বজ্রপাতের সময় খোলা মাঠের চেয়ে গাড়ির ভেতরে থাকা বেশি নিরাপদ। ধাতব গাড়ি একটি ফ্যারাডে খাঁচা সৃষ্টি করে, যার অভ্যন্তরে তড়িৎ ক্ষেত্র শূন্য (E = 0) থাকে।
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: SEE EXAMPLE (4 WORKED BOARD CQS + EXAMINER SECRET RUBRICS)       */}
        {/* ======================================================================= */}
        {activeTab === 'example' && (
          <div className="space-y-6">
            {/* CQ Switcher Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 1, title: 'পাঠ্যবই পৃষ্ঠা ২৮১: কুলম্বের বল ও নিরপেক্ষ বিন্দু' },
                { id: 2, title: 'পাঠ্যবই পৃষ্ঠা ২৯৭ সৃজনশীল ১: চিরুনি ও স্বর্ণপাত' },
                { id: 3, title: 'ঢাকা বোর্ড: মধ্যবিন্দুতে প্রাবল্য বনাম বিভব' },
                { id: 4, title: 'চট্টগ্রাম ও রাজশাহী বোর্ড: ধারকের শক্তি ও তেলের ট্রাক' },
              ].map((cq) => (
                <button
                  key={cq.id}
                  onClick={() => setActiveCQ(cq.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    activeCQ === cq.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  সৃজনশীল ০{cq.id}: {cq.title}
                </button>
              ))}
            </div>

            {/* CQ 1 */}
            {activeCQ === 1 && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1">
                    <span>পাঠ্যবই পৃষ্ঠা ২৮১ ও বোর্ড স্ট্যান্ডার্ড</span>
                    <span>•</span>
                    <span>কুলম্বের সূত্র ও নিরপেক্ষ বিন্দু</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    উদ্দীপক: দুটি বিন্দু আধান +5 C এবং +3 C শূন্য মাধ্যমে পরস্পর থেকে 1 m দূরত্বে রাখা আছে।
                  </h3>
                </div>

                {/* Subquestion C */}
                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (গ) উদ্দীপকের আধান দুটির মধ্যকার পারস্পরিক তড়িৎ বলের মান ও প্রকৃতি নির্ণয় করো। [৩ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      <strong>আমরা জানি, কুলম্বের সূত্রানুসারে:</strong>
                    </p>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300">
                      <RenderMathText text="$F = k \frac{q_1 q_2}{r^2}$" />
                    </div>
                    <p>এখানে,</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>q₁ = +5 C</li>
                      <li>q₂ = +3 C</li>
                      <li>দূরত্ব, r = 1 m</li>
                      <li>কুলম্ব ধ্রুবক, k = 9 × 10⁹ N m²/C²</li>
                    </ul>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-400">
                      <RenderMathText text="$F = \frac{9 \times 10^9 \times 5 \times 3}{1^2} = 1.35 \times 10^{11}\text{ N}$" />
                    </div>
                    <p className="text-amber-300 font-medium">
                      উভয় আধানই ধনাত্মক হওয়ায় বলের প্রকৃতি হবে <strong>বিকর্ষণধর্মী</strong>।
                    </p>
                  </div>
                </div>

                {/* Subquestion D */}
                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (ঘ) আধান দুটির সংযোগকারী রেখার কোন বিন্দুতে তৃতীয় একটি আধান +q স্থাপন করলে এটি কোনো লব্ধি বল অনুভব করবে না? গাণিতিক বিশ্লেষণ করো। [৪ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      ধরি, তৃতীয় আধান +q কে +5 C আধান থেকে x দূরত্বে সংযোগকারী রেখার মাঝে রাখা হলো। ফলে +3 C আধান থেকে তার দূরত্ব হবে (1 - x) m।
                    </p>
                    <p>
                      +q কোনো বল অনুভব করবে না যদি +5 C কর্তৃক প্রযুক্ত বিকর্ষণ বল এবং +3 C কর্তৃক প্রযুক্ত বিকর্ষণ বল পরস্পর সমান ও বিপরীতমুখী হয়:
                    </p>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300">
                      <RenderMathText text="$k \frac{5 \cdot q}{x^2} = k \frac{3 \cdot q}{(1 - x)^2}$" />
                    </div>
                    <p>উভয়পক্ষ থেকে k · q বাদ দিয়ে পাই:</p>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300">
                      <RenderMathText text="$5(1 - x)^2 = 3x^2 \implies 2x^2 - 10x + 5 = 0$" />
                    </div>
                    <p>দ্বিঘাত সমীকরণ সমাধান করে:</p>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-400">
                      <RenderMathText text="$x = \frac{10 \pm \sqrt{100 - 4 \cdot 2 \cdot 5}}{4} = \frac{10 \pm \sqrt{60}}{4} \implies x \approx 0.565\text{ m}$" />
                    </div>
                    <p className="text-slate-300">
                      যেহেতু বিন্দুটি দুই আধানের মাঝে অবস্থিত, তাই 0 &lt; x &lt; 1 প্রযোজ্য।
                      <br />
                      অতএব, +5 C আধান থেকে <strong>0.565 মিটার</strong> দূরত্বে আধানটি স্থাপন করলে তা কোনো লব্ধি বল অনুভব করবে না।
                    </p>
                  </div>
                </div>

                {/* Secret Examiner Rubric Toggle */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowRubric(!showRubric)}
                    className="flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{showRubric ? 'পরীক্ষকের গোপন মূল্যায়ন রুব্রিক লুকান' : 'পরীক্ষকের গোপন মূল্যায়ন রুব্রিক ও ট্র্যাপ দেখুন'}</span>
                  </button>

                  {showRubric && (
                    <div className="mt-3 p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2 text-xs text-amber-200">
                      <h4 className="font-bold flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>পরীক্ষকের গোপন খাতা মূল্যায়ন নির্দেশনা:</span>
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                        <li>
                          <strong>(গ) অংশে একক ও প্রকৃতি:</strong> শুধু সংখ্যা লিখলে ১ নম্বর কাটা যাবে। উত্তরের সাথে একক <RenderMathText text="\text{N}" /> এবং প্রকৃতি যে &quot;বিকর্ষণ&quot; তা স্পষ্ট উল্লেখ করতে হবে।
                        </li>
                        <li>
                          <strong>(ঘ) অংশে দ্বিঘাতের দ্বিতীয় মূল:</strong> সমীকরণের অপর সমাধান <RenderMathText text="x = 4.435\text{ m}" /> কেন অগ্রাহ্য করা হলো তা না লিখলে সর্বোচ্চ ৩ দেওয়া হতে পারে। কারণ দুই আধানের মাঝে বলদ্বয় বিপরীতমুখী হয়, কিন্তু বাইরে তারা একই দিকে কাজ করে।
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CQ 2 */}
            {activeCQ === 2 && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1">
                    <span>পাঠ্যবই পৃষ্ঠা ২৯৭ সৃজনশীল ১</span>
                    <span>•</span>
                    <span>চিরুনি, পরমাণুর গঠন ও তড়িৎবীক্ষণ যন্ত্র</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    উদ্দীপক: রিমা শুকনো চুল আঁচড়ানোর পর দেখতে পেল তার প্লাস্টিক চিরুনি ছোট ছোট কাগজের টুকরাকে আকর্ষণ করছে। সীমা বলল চিরুনিটি ধনাত্মক আহিত, কিন্তু রিমা বলল ঋণাত্মক আহিত। শিক্ষক তাদেরকে গবেষণাগারের স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র দিয়ে পরীক্ষা করতে বললেন।
                  </h3>
                </div>

                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (গ) উদ্দীপকের চিরুনিটি আহিত হওয়ার কারণ পরমাণুর গঠনের ভিত্তিতে ব্যাখ্যা করো। [৩ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      স্বাভাবিক অবস্থায় পরমাণুর নিউক্লিয়াসে যতটি ধনাত্মক প্রোটন থাকে, বাইরে ঠিক ততটি ঋণাত্মক ইলেকট্রন থাকায় বস্তুটি চার্জ নিরপেক্ষ থাকে।
                    </p>
                    <p>
                      কিন্তু শুকনো চুল ও প্লাস্টিক চিরুনির মধ্যে ঘর্ষণের সময় দুটি পদার্থের ইলেকট্রন আসক্তির পার্থক্যের কারণে এক বস্তু থেকে অন্য বস্তুতে ইলেকট্রন স্থানান্তরিত হয়। প্লাস্টিকের ইলেকট্রন আসক্তি মানুষের চুলের চেয়ে বেশি হওয়ায় ঘর্ষণের ফলে চুল থেকে কিছু ইলেকট্রন চিরুনিতে চলে আসে।
                    </p>
                    <p className="text-emerald-400 font-semibold">
                      ফলে চিরুনিতে স্বাভাবিকের চেয়ে বেশি ইলেকট্রন জমা হয়ে এটি ঋণাত্মক আধানে আহিত হয়। সুতরাং রিমার বক্তব্যটি সঠিক ছিল।
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (ঘ) স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্রের সাহায্যে কীভাবে চিরুনিটির আধানের প্রকৃতি নির্ণয় করা যাবে? বিশ্লেষণ করো। [৪ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                      <li>
                        <strong>যন্ত্রটিকে জ্ঞাত আধানে আহিতকরণ:</strong> প্রথমে একটি রেশম দিয়ে ঘষা কাচ দণ্ড (যা নিশ্চিতভাবে ধনাত্মক আহিত) তড়িৎবীক্ষণ যন্ত্রের চাকতিতে স্পর্শ করিয়ে যন্ত্রটিকে স্থায়ীভাবে ধনাত্মক আধানে আহিত করা হলো। ফলে এর স্বর্ণপাত দুটি বিকর্ষণে ফাঁক হয়ে থাকবে।
                      </li>
                      <li>
                        <strong>পরীক্ষণীয় চিরুনি কাছে আনা:</strong> এবার চুল দিয়ে ঘষা চিরুনিটিকে তড়িৎবীক্ষণ যন্ত্রের চাকতির কাছে স্পর্শ না করে আনা হলো।
                      </li>
                      <li>
                        <strong>পর্যবেক্ষণ ও সিদ্ধান্ত:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400">
                          <li>যদি চিরুনিটি ধনাত্মক হতো, তবে চাকতির মুক্ত ইলেকট্রন আরও ওপরে আকর্ষিত হতো এবং পাতায় ধনাত্মক চার্জের ঘনত্ব বেড়ে পাতার ফাঁক আরও বৃদ্ধি পেত।</li>
                          <li>কিন্তু বাস্তবে দেখা যাবে পাতার ফাঁক হ্রাস পাচ্ছে। কারণ চিরুনির ঋণাত্মক আধান চাকতির ইলেকট্রনগুলোকে নিচের স্বর্ণপাতে ঠেলে দেয়, ফলে পাতার ধনাত্মক চার্জ আংশিক প্রশমিত হয়ে বিকর্ষণ কমে যায় ও পাতা দুটি কাছাকাছি চলে আসে।</li>
                        </ul>
                      </li>
                    </ol>
                    <p className="text-amber-300 font-semibold">
                      অতএব, পাতার ফাঁক হ্রাস পাওয়ার ঘটনাটি চূড়ান্তভাবে প্রমাণ করে যে চিরুনিটি ঋণাত্মক আধানে আহিত ছিল।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 3 */}
            {activeCQ === 3 && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1">
                    <span>ঢাকা বোর্ড স্ট্যান্ডার্ড</span>
                    <span>•</span>
                    <span>তড়িৎ প্রাবল্য বনাম তড়িৎ বিভব</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    উদ্দীপক: বায়ুতে দুটি বিন্দু A ও B তে যথাক্রমে +20 μC এবং -20 μC আধান 50 cm ব্যবধানে রাখা আছে। AB এর মধ্যবিন্দু O।
                  </h3>
                </div>

                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (গ) উদ্দীপকের মধ্যবিন্দু O-তে তড়িৎ বিভবের মান নির্ণয় করো। [৩ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      যেহেতু তড়িৎ বিভব স্কেলার রাশি, তাই মধ্যবিন্দুতে মোট বিভব হবে আধান দুটির জন্য পৃথক বিভবের বীজগাণিতিক যোগফল:
                    </p>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300">
                      <RenderMathText text="$V = V_A + V_B = k \frac{q_A}{r} + k \frac{q_B}{r}$" />
                    </div>
                    <p>এখানে,</p>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-400">
                      <li>q_A = +20 × 10⁻⁶ C</li>
                      <li>q_B = -20 × 10⁻⁶ C</li>
                      <li>দূরত্ব, r = 50 cm / 2 = 25 cm = 0.25 m</li>
                    </ul>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-400">
                      <RenderMathText text="$V = \frac{9 \times 10^9}{0.25} [20 \times 10^{-6} + (-20 \times 10^{-6})] = 0\text{ Volt}$" />
                    </div>
                    <p className="text-emerald-400 font-semibold">
                      অতএব, মধ্যবিন্দু O-তে তড়িৎ বিভবের মান শূন্য (0 V)।
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (ঘ) &quot;কোনো বিন্দুতে তড়িৎ বিভব শূন্য হলে সেখানে তড়িৎ প্রাবল্যও কি শূন্য হবে?&quot; মধ্যবিন্দু O-এর সাপেক্ষে গাণিতিক বিশ্লেষণ করো। [৪ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      না, কোনো বিন্দুতে তড়িৎ বিভব শূন্য হলেও সেখানে তড়িৎ প্রাবল্য শূন্য নাও হতে পারে।
                    </p>
                    <p>
                      কারণ তড়িৎ তীব্রতা বা প্রাবল্য হলো একটি ভেক্টর রাশি। মধ্যবিন্দু O-তে একক ধনাত্মক আধান স্থাপন করলে:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      <li>A বিন্দুর ধনাত্মক আধান এটিকে ডান দিকে (A থেকে B বরাবর) বিকর্ষণ করবে।</li>
                      <li>B বিন্দুর ঋণাত্মক আধান এটিকে একই দিকে (B এর দিকে) আকর্ষণ করবে।</li>
                    </ul>
                    <p>যেহেতু উভয় ভেক্টর একই দিকে (A থেকে B বরাবর) কাজ করে, তাই লব্ধি প্রাবল্য হবে তাদের যোগফল:</p>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300">
                      <RenderMathText text="$E_A = k \frac{|q_A|}{r^2} = \frac{9 \times 10^9 \times 20 \times 10^{-6}}{(0.25)^2} = 2.88 \times 10^6\text{ N/C}$" />
                      <br />
                      <RenderMathText text="$E_B = k \frac{|q_B|}{r^2} = \frac{9 \times 10^9 \times 20 \times 10^{-6}}{(0.25)^2} = 2.88 \times 10^6\text{ N/C}$" />
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-400">
                      <RenderMathText text="$E_{\text{net}} = E_A + E_B = 5.76 \times 10^6\text{ N/C} \ne 0$" />
                    </div>
                    <p className="text-amber-300 font-semibold">
                      সুতরাং, মধ্যবিন্দু O-তে বিভব শূন্য হলেও তড়িৎ প্রাবল্য শূন্য নয়, বরং এর মান <span className="font-mono text-cyan-300">5.76 × 10⁶ N/C</span> এবং দিক A থেকে B এর দিকে।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 4 */}
            {activeCQ === 4 && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono mb-1">
                    <span>চট্টগ্রাম ও রাজশাহী বোর্ড স্ট্যান্ডার্ড</span>
                    <span>•</span>
                    <span>ধারকের শক্তি ও জ্বালানি ট্রাকের আর্থিং নিরাপত্তা</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    উদ্দীপক: একটি সমান্তরাল পাত ধারকের ধারকত্ব 50 μF এবং এতে 220 V বিভব প্রয়োগ করা হলো। অপরদিকে রাস্তায় চলাচলকারী একটি জ্বালানি তেলবাহী ট্রাকের নিচে ধাতব শিকল ঝুলিয়ে মাটির সাথে ঘষে চলতে দেখা গেল।
                  </h3>
                </div>

                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (গ) উদ্দীপকের ধারকটিতে সঞ্চিত তড়িৎ শক্তির পরিমাণ হিসাব করো। [৩ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>আমরা জানি, ধারকে সঞ্চিত শক্তির সমীকরণ:</p>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-cyan-300">
                      <RenderMathText text="$U = \frac{1}{2} C V^2$" />
                    </div>
                    <p>এখানে,</p>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-400">
                      <li>ধারকত্ব, C = 50 μF = 50 × 10⁻⁶ F</li>
                      <li>বিভব, V = 220 Volt</li>
                    </ul>
                    <div className="p-3 bg-slate-900 rounded-lg font-mono text-emerald-400">
                      <RenderMathText text="$U = \frac{1}{2} \times (50 \times 10^{-6}) \times (220)^2 = 1.21\text{ Joule}$" />
                    </div>
                    <p className="text-emerald-400 font-semibold">
                      অতএব, ধারকটিতে সঞ্চিত শক্তির পরিমাণ 1.21 জুল।
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 block">
                    (ঘ) জ্বালানি ট্রাকে শিকল ঝুলিয়ে রাখার বৈজ্ঞানিক কারণ এবং এটি না করলে কী বিপর্যয় ঘটতে পারে ব্যাখ্যা করো। [৪ নম্বর]
                  </span>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      <strong>বৈজ্ঞানিক কারণ (স্থির তড়িৎ ক্ষরণ):</strong>
                      <br />
                      জ্বালানি তেলবাহী ট্রাক দ্রুতগতিতে চলার সময় বাতাসের সাথে ট্রাকের ধাতব বডির ঘর্ষণে এবং ট্যাংকের ভেতরের তেলের চলনের ফলে ঘর্ষণজনিত স্থির বিদ্যুৎ তৈরি হয়। ট্রাকের রাবারের টায়ার বিদ্যুৎ কুপরিবাহী হওয়ায় এই বিপুল আধান সরাসরি মাটিতে যেতে পারে না এবং ট্রাকের বডিতে জমা থাকে।
                    </p>
                    <p>
                      <strong>ধাতব শিকলের ভূমিকা:</strong>
                      <br />
                      ট্রাকের পেছনে ঝুলন্ত ধাতব শিকল মাটির সাথে সর্বদা স্পর্শে থাকে। এটি একটি পরিবাহী ভূ-সংযোগ (Earthing) হিসেবে কাজ করে এবং উৎপাদিত আধানকে তাৎক্ষণিকভাবে মাটিতে নিষ্কাশন করে বডিকে চার্জমুক্ত রাখে।
                    </p>
                    <p className="text-rose-300">
                      <strong>শিকল না থাকলে বিপর্যয়:</strong>
                      <br />
                      শিকল না থাকলে বডিতে উচ্চ বিভব সৃষ্টি হবে। তেল ভরার সময় বা বাতাসের সংস্পর্শে হঠাৎ বৈদ্যুতিক স্ফুলিঙ্গ (Spark) সৃষ্টি হতে পারে, যা মুহূর্তের মধ্যে দাহ্য তেলে আগুন ধরিয়ে পুরো ট্রাকে ভয়াবহ বিস্ফোরণ ঘটাতে পারে।
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: TRY YOURSELF (3 INTERACTIVE CHALLENGES)                          */}
        {/* ======================================================================= */}
        {activeTab === 'practice' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-slate-100">
                নিজে করো গাণিতিক চ্যালেঞ্জ (Interactive Practice)
              </h2>
              <p className="text-xs text-slate-400">
                বোর্ড স্ট্যান্ডার্ড গাণিতিক সমস্যাগুলোর সঠিক উত্তর ইনপুট দিয়ে সাথে সাথে যাচাই করো।
              </p>
            </div>

            {/* Challenge 1 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  চ্যালেঞ্জ ০১
                </span>
                <span className="text-xs text-slate-400">কুলম্বের বলের মান</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                বায়ু মাধ্যমে q₁ = +2 C এবং q₂ = -4 C মানের দুটি আধান পরস্পর থেকে 2 m দূরে স্থাপন করা হলো। আধানদ্বয়ের মধ্যকার কুলম্বের বলের মান কত? (× 10¹⁰ N এককে সংখ্যাটি লেখো, যেমন: 1.8)
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="উদা: 1.8"
                  value={ch1Input}
                  onChange={(e) => {
                    setCh1Input(e.target.value);
                    setCh1Result('idle');
                  }}
                  className="bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500 w-40"
                />
                <button
                  onClick={() => {
                    const val = parseFloat(ch1Input.trim());
                    if (Math.abs(Math.abs(val) - 1.8) < 0.1) {
                      setCh1Result('correct');
                    } else {
                      setCh1Result('wrong');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                >
                  উত্তর যাচাই
                </button>
              </div>
              {ch1Result === 'correct' && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  ✓ চমৎকার! সঠিক উত্তর: <RenderMathText text="$F = \frac{9 \times 10^9 \times 2 \times 4}{2^2} = 1.8 \times 10^{10}\text{ N}$" /> (আকর্ষণধর্মী)।
                </div>
              )}
              {ch1Result === 'wrong' && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  ✕ ভুল হয়েছে! ইঙ্গিত: F = k |q₁q₂| / r² সূত্রে k = 9 × 10⁹ এবং r² = 4 বসাও। উত্তর হবে 1.8।
                </div>
              )}
            </div>

            {/* Challenge 2 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  চ্যালেঞ্জ ০২
                </span>
                <span className="text-xs text-slate-400">তড়িৎ প্রাবল্য গণনা</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                বায়ু মাধ্যমে Q = 8 μC = 8 × 10⁻⁶ C বিন্দু আধান থেকে 2 m দূরে কোনো বিন্দুতে তড়িৎ তীব্রতা বা প্রাবল্যের মান কত N/C হবে?
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="উদা: 18000"
                  value={ch2Input}
                  onChange={(e) => {
                    setCh2Input(e.target.value);
                    setCh2Result('idle');
                  }}
                  className="bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 w-40"
                />
                <button
                  onClick={() => {
                    const val = parseFloat(ch2Input.trim());
                    if (Math.abs(val - 18000) < 100) {
                      setCh2Result('correct');
                    } else {
                      setCh2Result('wrong');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
                >
                  উত্তর যাচাই
                </button>
              </div>
              {ch2Result === 'correct' && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  ✓ নির্ভুল! <RenderMathText text="$E = \frac{9 \times 10^9 \times 8 \times 10^{-6}}{2^2} = \frac{72000}{4} = 18000\text{ N/C}$" />।
                </div>
              )}
              {ch2Result === 'wrong' && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  ✕ সঠিক নয়। মনে রাখবে E = k Q / r², যেখানে r = 2 হলে r² = 4। আবার চেষ্টা করো!
                </div>
              )}
            </div>

            {/* Challenge 3 */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  চ্যালেঞ্জ ০৩
                </span>
                <span className="text-xs text-slate-400">ধারকে সঞ্চিত শক্তি</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                একটি 40 μF ধারকের দুই প্রান্তে 100 V বিভব পার্থক্য প্রয়োগ করা হলে এর ভেতরে সঞ্চিত শক্তির পরিমাণ কত জুল (Joule) হবে?
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="উদা: 0.2"
                  value={ch3Input}
                  onChange={(e) => {
                    setCh3Input(e.target.value);
                    setCh3Result('idle');
                  }}
                  className="bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500 w-40"
                />
                <button
                  onClick={() => {
                    const val = parseFloat(ch3Input.trim());
                    if (Math.abs(val - 0.2) < 0.02) {
                      setCh3Result('correct');
                    } else {
                      setCh3Result('wrong');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
                >
                  উত্তর যাচাই
                </button>
              </div>
              {ch3Result === 'correct' && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  ✓ দুর্দান্ত! <RenderMathText text="$U = \frac{1}{2} C V^2 = \frac{1}{2} \times 40 \times 10^{-6} \times 10000 = 0.2\text{ J}$" />।
                </div>
              )}
              {ch3Result === 'wrong' && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  ✕ হয়নি। সূত্র: U = ½ CV²। V² = 100² = 10000 এবং C = 40 × 10⁻⁶ F বসাও। উত্তর 0.2।
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: CHECK UNDERSTANDING (5 BOARD STANDARD MCQS)                      */}
        {/* ======================================================================= */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-slate-100">
                জ্ঞান যাচাই বহুনির্বাচনি (Board Standard MCQs)
              </h2>
              <p className="text-xs text-slate-400">
                পাঠ্যবই ও বিগত বোর্ড পরীক্ষার ৫টি গুরুত্বপূর্ণ বহুনির্বাচনি প্রশ্ন সমাধান করো।
              </p>
            </div>

            {/* Questions List */}
            {[
              {
                id: 1,
                q: 'কোনো বস্তুতে আধানের অস্তিত্ব ও প্রকৃতি নির্ণয়ের যন্ত্র হলো—',
                options: ['অ্যামিটার', 'ভোল্টমিটার', 'অণুবীক্ষণ যন্ত্র', 'তড়িৎবীক্ষণ যন্ত্র'],
                correct: 3,
                explanation: 'তড়িৎবীক্ষণ যন্ত্র (Electroscope) দিয়ে কোনো বস্তুতে আধানের উপস্থিতি এবং আধানটি ধনাত্মক নাকি ঋণাত্মক তা নিশ্চিতভাবে নির্ণয় করা যায়।',
              },
              {
                id: 2,
                q: 'দুটি আধানের মধ্যকার তড়িৎ বল নিচের কোনটির ওপর নির্ভর করে না?',
                options: [
                  'আধান দুটির মধ্যবর্তী দূরত্বের ওপর',
                  'আধান দুটি যে মাধ্যমে অবস্থিত তার প্রকৃতির ওপর',
                  'আধান দুটির পরিমাণের গুণফলের ওপর',
                  'আধান দুটির ভরের ওপর',
                ],
                correct: 3,
                explanation: 'কুলম্বের সূত্রানুসারে বল কেবল আধানের মান, দূরত্ব এবং মাধ্যমের ভেদনযোগ্যতার ওপর নির্ভর করে; ভরের ওপর নয়।',
              },
              {
                id: 3,
                q: 'তড়িৎ তীব্রতার এসআই (SI) একক কোনটি?',
                options: ['N', 'N m', 'N m⁻¹', 'N C⁻¹'],
                correct: 3,
                explanation: 'তড়িৎ প্রাবল্য E = F/q। বলের একক N এবং আধানের একক C হওয়ায় একক হবে N/C বা N C⁻¹ (অথবা V/m)।',
              },
              {
                id: 4,
                q: 'A গোলকের বিভব 5 V (চার্জ 6 C) এবং B গোলকের বিভব 3 V (চার্জ 9 C)। পরিবাহী তার দিয়ে যুক্ত করলে আধান প্রবাহের দিক হবে—',
                options: [
                  'A গোলক থেকে B গোলকে ধনাত্মক আধান যাবে',
                  'B গোলক থেকে A গোলকে ধনাত্মক আধান যাবে',
                  'উভয় গোলকের আধান স্থির থাকবে কারণ মোট আধান সমান নয়',
                  'কোনো আধান প্রবাহিত হবে না',
                ],
                correct: 0,
                explanation: 'আধানের পরিমাণ যাই হোক না কেন, ধনাত্মক আধান সর্বদা উচ্চ বিভব (5 V) থেকে নিম্ন বিভবে (3 V) প্রবাহিত হয়। অর্থাৎ A থেকে B-তে যাবে।',
              },
              {
                id: 5,
                q: 'ভোল্ট (Volt) নিচের কোন রাশির একক?',
                options: ['তড়িৎ ক্ষেত্র', 'তড়িৎ বিভব', 'তড়িৎ আধান', 'তড়িৎ প্রবাহ'],
                correct: 1,
                explanation: 'তড়িৎ বিভব V = W/q। কাজকে আধান দিয়ে ভাগ করলে জুল/কুলম্ব (J/C) পাওয়া যায়, যার ব্যবহারিক নাম ভোল্ট (Volt)।',
              },
            ].map((mcq, idx) => {
              const selectedOpt = quizAnswers[mcq.id];
              const isAnswered = selectedOpt !== undefined;
              return (
                <div key={mcq.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-slate-100 leading-relaxed">
                      {idx + 1}. {mcq.q}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {mcq.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800';

                      if (quizSubmitted) {
                        if (optIdx === mcq.correct) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [mcq.id]: optIdx })}
                          className={`p-3 rounded-xl border text-left transition ${btnStyle}`}
                        >
                          <span className="font-mono mr-2">({String.fromCharCode(65 + optIdx)})</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-300">
                      <span className="font-bold text-amber-400 block mb-0.5">ব্যাখ্যা:</span>
                      {mcq.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quiz Submit Button & Score */}
            <div className="pt-2 text-center">
              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < 5}
                  className={`px-8 py-3 rounded-xl text-xs font-bold transition shadow-lg ${
                    Object.keys(quizAnswers).length >= 5
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {Object.keys(quizAnswers).length >= 5
                    ? 'সবগুলো উত্তর জমা দিন'
                    : `বাকি আছে ${5 - Object.keys(quizAnswers).length} টি প্রশ্নের উত্তর`}
                </button>
              ) : (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl max-w-md mx-auto space-y-2">
                  <span className="text-xs text-slate-400 block">তোমার মোট স্কোর:</span>
                  <div className="text-2xl font-black font-mono text-amber-400">
                    {[1, 2, 3, 4, 5].filter((id) => quizAnswers[id] === [3, 3, 3, 0, 1][id - 1]).length} / ৫
                  </div>
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 underline mt-2"
                  >
                    পুনরায় কুইজ দিন
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: SUMMARY (FORMULA BANK & 4 EXAMINER TRAPS)                        */}
        {/* ======================================================================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-100">
                  অধ্যায় ১০: স্থির তড়িৎ — চূড়ান্ত রিভিশন শিট
                </h2>
                <p className="text-xs text-slate-400">
                  বোর্ড পরীক্ষার জন্য জরুরি সকল সূত্র, এসআই একক ও পরীক্ষকের ৪টি গোপন ফাঁদ।
                </p>
              </div>
              <button
                onClick={handleCopyNote}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'কপি সম্পন্ন!' : 'নোট কপি করুন'}</span>
              </button>
            </div>

            {/* Formula Bank */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'কুলম্বের সূত্র (Coulomb Force)',
                  formula: '$F = k \\frac{q_1 q_2}{r^2}$',
                  desc: 'k = 9 × 10⁹ N m²/C² (বায়ু মাধ্যমে)। আকর্ষণ (F < 0) ও বিকর্ষণ (F > 0)।',
                },
                {
                  title: 'তড়িৎ তীব্রতা বা প্রাবল্য (Field Intensity)',
                  formula: '$E = \\frac{F}{q} = k \\frac{Q}{r^2}$',
                  desc: 'ভেক্টর রাশি। একক: N/C বা V/m। একক ধনাত্মক আধানের উপর প্রযুক্ত বল।',
                },
                {
                  title: 'তড়িৎ বিভব (Electric Potential)',
                  formula: '$V = \\frac{W}{q} = k \\frac{Q}{r}$',
                  desc: 'স্কেলার রাশি। একক: Volt (J/C)। দূরত্ব r এর প্রথম ঘাতের ব্যস্তানুপাতিক।',
                },
                {
                  title: 'কৃতকাজ ও বিভব পার্থক্য (Work Done)',
                  formula: '$W = q(V_A - V_B)$',
                  desc: 'q আধানকে বিভব পার্থক্যের মধ্য দিয়ে স্থানান্তরে কৃতকাজ (Joule)।',
                },
                {
                  title: 'ধারকত্ব সমীকরণ (Capacitance)',
                  formula: '$C = \\frac{Q}{V} = \\frac{\\varepsilon A}{d}$',
                  desc: 'একক: ফ্যারাড (F)। পাতের ক্ষেত্রফল A বাড়ালে বা দূরত্ব d কমালে C বাড়ে।',
                },
                {
                  title: 'ধারকে সঞ্চিত শক্তি (Stored Energy)',
                  formula: '$U = \\frac{1}{2} C V^2 = \\frac{1}{2} \\frac{Q^2}{C}$',
                  desc: 'তড়িৎ ক্ষেত্রে সঞ্চিত স্থৈতিক শক্তি (Joule)।',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-bold text-amber-400">{item.title}</span>
                  <div className="p-3 bg-slate-950 rounded-xl font-mono text-cyan-300 text-sm">
                    <RenderMathText text={item.formula} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* 4 Examiner Traps */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>বোর্ড পরীক্ষকের ৪টি মারাত্মক ফাঁদ (Examiner Traps)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950/70 border border-rose-900/30 rounded-xl space-y-1.5">
                  <span className="font-bold text-rose-300 block">১. প্রাবল্য ভেক্টর কিন্তু বিভব স্কেলার:</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    তড়িৎ তীব্রতা E বের করার সময় সূত্রে চার্জের ধনাত্মক/ঋণাত্মক চিহ্ন না বসিয়ে চিত্র দেখে দিক নির্ধারণ করতে হয়। কিন্তু তড়িৎ বিভব V স্কেলার হওয়ায় চার্জের মূল চিহ্নসহ (+ বা -) সাধারণ যোগ করতে হয়।
                  </p>
                </div>

                <div className="p-4 bg-slate-950/70 border border-rose-900/30 rounded-xl space-y-1.5">
                  <span className="font-bold text-rose-300 block">২. দূরত্বের বর্গ (r²) বনাম সাধারণ দূরত্বের ভুল:</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    শিক্ষার্থীরা তাড়াহুড়ায় বিভবের সূত্রেও দূরত্বের বর্গ দিয়ে ফেলে! মনে রাখবে বল F ও প্রাবল্য E তে <span className="font-mono text-cyan-300 font-bold">r²</span> কিন্তু বিভব V তে শুধু <span className="font-mono text-cyan-300 font-bold">r</span>।
                  </p>
                </div>

                <div className="p-4 bg-slate-950/70 border border-rose-900/30 rounded-xl space-y-1.5">
                  <span className="font-bold text-rose-300 block">৩. মাইক্রোকুলম্ব (μC) একক রূপান্তরের ভুল:</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    উদ্দীপকে প্রায়ই <span className="font-mono text-cyan-300 font-bold">μC</span> দেওয়া থাকে। গাণিতিক সমাধানে অবশ্যই একে <span className="font-mono text-cyan-300 font-bold">10⁻⁶ C</span> এ এবং সেন্টিমিটারকে মিটারে পরিবর্তন করে নিতে হবে।
                  </p>
                </div>

                <div className="p-4 bg-slate-950/70 border border-rose-900/30 rounded-xl space-y-1.5">
                  <span className="font-bold text-rose-300 block">৪. আধানের পরিমাণ বনাম বিভব পার্থক্য:</span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    আধানের পরিমাণ বেশি থাকলেই সেখান থেকে চার্জ প্রবাহিত হয় না। ধনাত্মক আধান সর্বদা উচ্চ বিভব থেকে নিম্ন বিভবে যায়, আর ইলেকট্রন যায় নিম্ন বিভব থেকে উচ্চ বিভবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------------- */}
      {/* SOCRATIC AI TUTOR DRAWER                                                  */}
      {/* ------------------------------------------------------------------------- */}
      {showAiDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">স্থির তড়িৎ এআই শিক্ষক</h3>
                  <p className="text-[10px] text-slate-400">সক্রেটিক মেথডে পদার্থবিজ্ঞান সাহায্য</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex flex-wrap gap-1.5">
              {[
                'কুলম্বের বলের দিক কীভাবে সহজে বুঝব?',
                'প্রাবল্য ও বিভবের পার্থক্য কী?',
                'স্বর্ণপাত তড়িৎবীক্ষণ পাতার ফাঁক কেন বাড়ে?',
                'গাড়ির ভেতর বজ্রপাত নিরাপদ কেন?',
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAi(p)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium'
                        : 'bg-slate-800 border border-slate-700/80 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-2">
              <input
                type="text"
                placeholder="স্থির তড়িৎ সম্পর্কিত প্রশ্ন লিখুন..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                className="flex-1 bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleSendAi()}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
