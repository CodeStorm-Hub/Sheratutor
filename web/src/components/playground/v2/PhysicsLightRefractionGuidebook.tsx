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
  Glasses,
  Waves,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';

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
    title: 'স্নেলের সূত্র ও প্রতিসরণাঙ্ক ল্যাব',
    subtitle: "Snell's Law, Refractive Index & Apparent Depth",
    nctbPage: '২৪১-২৪৭',
    badge: 'মৌলিক সূত্র',
    intro:
      'আলো এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে প্রবেশের সময় দিক পরিবর্তন করে। স্নেলের সূত্র n₁ sin θ₁ = n₂ sin θ₂ দ্বারা প্রতিসরণ কোণ নিয়ন্ত্রিত হয়। ঘন মাধ্যমে আলোর বেগ কমে যায়, ফলে আলোক রশ্মি অভিলম্বের দিকে বেঁকে আসে।',
  },
  {
    id: 2,
    title: 'সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন',
    subtitle: 'Critical Angle & Total Internal Reflection (TIR)',
    nctbPage: '২৪৮-২৫১',
    badge: 'বোর্ড সৃজনশীল হটস্পট',
    intro:
      'ঘন মাধ্যম থেকে হালকা মাধ্যমে আলো যাওয়ার সময় আপতন কোণ সংকট কোণের চেয়ে বড় হলে আলো প্রতিসরিত না হয়ে ১০০% প্রতিফলিত হয়ে একই মাধ্যমে ফিরে আসে। একে পূর্ণ অভ্যন্তরীণ প্রতিফলন বলে।',
  },
  {
    id: 3,
    title: 'অপটিক্যাল ফাইবার, মরীচিকা ও প্রিজম',
    subtitle: 'Optical Fiber, Mirage & Prism Dispersion',
    nctbPage: '২৫২-২৫৫',
    badge: 'বাস্তব প্রয়োগ',
    intro:
      'অপটিক্যাল ফাইবারের কোরের মধ্য দিয়ে সিগন্যাল ক্ষয়হীন পূর্ণ অভ্যন্তরীণ প্রতিফলনে শত শত কিলোমিটার যায়। মরুভূমির উত্তপ্ত বালুর স্তরে মরীচিকা তৈরি হয় এবং প্রিজমে সাদা আলো ৭টি বর্ণে বিচ্ছুরিত হয়।',
  },
  {
    id: 4,
    title: 'উত্তল ও অবতল লেন্সের রশ্মিচিত্র',
    subtitle: 'Convex & Concave Lens Ray Tracing (6 Positions)',
    nctbPage: '২৫৫-২৬৩',
    badge: 'জ্যামিতিক অপটিক্স',
    intro:
      'উত্তল লেন্স সমান্তরাল রশ্মিকে প্রধান ফোকাসে কেন্দ্রীভূত করে (অভিসারী), আর অবতল লেন্স রশ্মিকে ছড়িয়ে দেয় (অপসারী)। বস্তুর বিভিন্ন অবস্থানের জন্য বাস্তব ও অবাস্তব প্রতিবিম্বের গঠন পর্যবেক্ষণ করো।',
  },
  {
    id: 5,
    title: 'লেন্স সমীকরণ, ক্ষমতা ও দৃষ্টির ত্রুটি',
    subtitle: 'Lens Formula, Power of Lens & Eye Defect Corrections',
    nctbPage: '২৬৪-২৬৬',
    badge: 'চিকিৎসা বিজ্ঞান ও গণিত',
    intro:
      'লেন্স সমীকরণ ১/u + ১/v = ১/f এবং ক্ষমতা P = ১/f (ডায়াপ্টার)। ক্ষীণদৃষ্টির (Myopia) ক্ষেত্রে রেটিনার সামনে প্রতিবিম্ব গঠিত হওয়ায় অবতল লেন্স এবং দূরদৃষ্টির (Hypermetropia) জন্য উত্তল লেন্স ব্যবহৃত হয়।',
  },
];

export default function PhysicsLightRefractionGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'example' | 'practice' | 'quiz' | 'summary'>('learn');
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Lab 1: Snell's Law & Apparent Depth State
  const [medium1, setMedium1] = useState<'air' | 'water' | 'glass'>('air');
  const [medium2, setMedium2] = useState<'air' | 'water' | 'glass' | 'diamond'>('water');
  const [theta1Deg, setTheta1Deg] = useState<number>(45);
  const [coinApparentActive, setCoinApparentActive] = useState<boolean>(false);

  // Refractive index map
  const refractiveIndices: Record<string, { n: number; nameBn: string; speed: number }> = {
    air: { n: 1.00029, nameBn: 'বায়ু (n = 1.00)', speed: 3.0 },
    water: { n: 1.33, nameBn: 'পানি (n = 1.33)', speed: 2.26 },
    glass: { n: 1.52, nameBn: 'কাচ (n = 1.52)', speed: 1.97 },
    diamond: { n: 2.42, nameBn: 'হীরা (n = 2.42)', speed: 1.24 },
  };

  const n1 = refractiveIndices[medium1].n;
  const n2 = refractiveIndices[medium2].n;
  const sinTheta1 = Math.sin((theta1Deg * Math.PI) / 180);
  const sinTheta2 = (n1 * sinTheta1) / n2;
  const isTIRLab1 = sinTheta2 > 1.0;
  const theta2Deg = isTIRLab1 ? 0 : (Math.asin(sinTheta2) * 180) / Math.PI;

  // Lab 2: Critical Angle & Total Internal Reflection (TIR) State
  const [tirDenseMedium, setTirDenseMedium] = useState<'glass' | 'water' | 'diamond' | 'fiberCore'>('glass');
  const [tirIncidentAngle, setTirIncidentAngle] = useState<number>(45);

  const tirDensities: Record<string, { nDense: number; nRare: number; nameBn: string; rareName: string }> = {
    glass: { nDense: 1.52, nRare: 1.0, nameBn: 'সাধারণ কাচ (n = 1.52)', rareName: 'বায়ু' },
    water: { nDense: 1.33, nRare: 1.0, nameBn: 'পানি (n = 1.33)', rareName: 'বায়ু' },
    diamond: { nDense: 2.42, nRare: 1.0, nameBn: 'হীরা (n = 2.42)', rareName: 'বায়ু' },
    fiberCore: { nDense: 1.5, nRare: 1.45, nameBn: 'অপটিক্যাল ফাইবার কোর (n = 1.50)', rareName: 'ক্ল্যাডিং (n = 1.45)' },
  };

  const currentTirConfig = tirDensities[tirDenseMedium];
  const criticalAngleDeg = (Math.asin(currentTirConfig.nRare / currentTirConfig.nDense) * 180) / Math.PI;
  const isTotalInternalReflection = tirIncidentAngle > criticalAngleDeg;
  const isAtCriticalAngle = Math.abs(tirIncidentAngle - criticalAngleDeg) < 0.8;

  // Lab 3: Optical Fiber, Mirage & Prism
  const [lab3SubTab, setLab3SubTab] = useState<'fiber' | 'mirage' | 'prism'>('fiber');
  const [fiberAngle, setFiberAngle] = useState<number>(78);
  const [prismDeviationAngle, setPrismDeviationAngle] = useState<number>(48);

  // Lab 4: Lens Ray Tracing State
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [lensFocalLength, setLensFocalLength] = useState<number>(20); // cm
  const [lensObjectDistance, setLensObjectDistance] = useState<number>(35); // cm
  const [lensObjectHeight, setLensObjectHeight] = useState<number>(12); // cm

  // Compute image distance v and magnification m for thin lens
  // 1/u + 1/v = 1/f => 1/v = 1/f - 1/u => v = uf / (u - f) for convex
  // For concave: f is negative => 1/v = -1/|f| - 1/u => v = -u|f| / (u + |f|)
  const effectiveF = lensType === 'convex' ? lensFocalLength : -lensFocalLength;
  const lensImageDistance = (lensObjectDistance * effectiveF) / (lensObjectDistance - effectiveF);
  const lensMagnification = -lensImageDistance / lensObjectDistance;
  const lensImageHeight = Math.abs(lensMagnification) * lensObjectHeight;

  // Lab 5: Lens Formula, Power & Eye Defects State
  const [calcU, setCalcU] = useState<number>(25); // cm
  const [calcF, setCalcF] = useState<number>(10); // cm
  const [calcIsConvex, setCalcIsConvex] = useState<boolean>(true);
  const [eyeDefect, setEyeDefect] = useState<'normal' | 'myopia' | 'hypermetropia'>('myopia');
  const [hasCorrectionGlass, setHasCorrectionGlass] = useState<boolean>(false);

  const lab5SignedF = calcIsConvex ? calcF : -calcF;
  const lab5V = (calcU * lab5SignedF) / (calcU - lab5SignedF);
  const lab5PowerDioptre = 100 / lab5SignedF; // P = 1 / (f in meters) = 100 / f_cm

  // Step 2: CQs Data
  const [activeCQ, setActiveCQ] = useState<number>(1);
  const [showRubric, setShowRubric] = useState<boolean>(false);

  // Step 3: Practice Challenges State
  const [challenge1Input, setChallenge1Input] = useState<string>('');
  const [challenge1Result, setChallenge1Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge2Input, setChallenge2Input] = useState<string>('');
  const [challenge2Result, setChallenge2Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge3Input, setChallenge3Input] = useState<string>('');
  const [challenge3Result, setChallenge3Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Step 4: Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Socratic AI Tutor Drawer State
  const [showAiDrawer, setShowAiDrawer] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: 'নমস্কার! আমি শেরাটউটর অপটিক্স সহকারী। আলোর প্রতিসরণ, স্নেলের সূত্র, পূর্ণ অভ্যন্তরীণ প্রতিফলন, অপটিক্যাল ফাইবার, লেন্স ও চোখের চশমার ক্ষমতা নিয়ে যেকোনো প্রশ্ন করতে পারো!',
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
      let reply = 'তোমার প্রশ্নটি চমৎকার! অপটিক্সের মূল ভিত্তি হলো আলোর বেগের পরিবর্তন।';
      if (q.includes('পূর্ণ অভ্যন্তরীণ প্রতিফলন') || q.includes('সংকট')) {
        reply =
          'পূর্ণ অভ্যন্তরীণ প্রতিফলনের দুটি প্রধান শর্ত মনে রাখবে: (১) আলোকে অবশ্যই ঘন মাধ্যম থেকে হালকা মাধ্যমে যেতে হবে, এবং (২) আপতন কোণ সংকট কোণের চেয়ে বড় হতে হবে (θ > θ_c)। এ সময় কোনো প্রতিসরণ হয় না, ১০০% আলো প্রতিফলিত হয়!';
      } else if (q.includes('ফাইবার') || q.includes('কোর')) {
        reply =
          'অপটিক্যাল ফাইবারে দুটি কাচের স্তর থাকে: ভেতরে কোর (n = 1.50) এবং বাইরে ক্ল্যাডিং (n = 1.45)। আলো কোরের ভেতরে সংকট কোণের চেয়ে বেশি কোণে আপতিত হয়ে বারবার পূর্ণ অভ্যন্তরীণ প্রতিফলনের মাধ্যমে শত শত কিলোমিটার চলে যায়!';
      } else if (q.includes('পাওয়ার') || q.includes('ক্ষমতা') || q.includes('ডায়াপ্টার')) {
        reply =
          'লেন্সের ক্ষমতা P = ১/f (মিটার এককে)। উত্তল লেন্সের ফোকাস দূরত্ব পজিটিভ হওয়ায় ক্ষমতা পজিটিভ (+D) এবং এটি দূরদৃষ্টি বা Hypermetropia দূর করতে ব্যবহৃত হয়। আর অবতল লেন্সের ক্ষমতা নেগেটিভ (-D) যা ক্ষীণদৃষ্টি বা Myopia প্রতিকারে ব্যবহৃত হয়!';
      } else if (q.includes('মরীচিকা')) {
        reply =
          'মরুভূমির তপ্ত বালুর সংস্পর্শে এসে নিচের স্তরের বাতাস হালকা ও কম ঘন হয়। ওপরের ঘন স্তর থেকে নিচে আসার সময় আলো বাঁকতে বাঁকতে সংকট কোণ অতিক্রম করে এবং পূর্ণ অভ্যন্তরীণ প্রতিফলিত হয়ে চোখে পৌঁছায়। ফলে মনে হয় নিচে পানি রয়েছে!';
      }

      setAiChatMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & NAVIGATION BAR                                            */}
      {/* ------------------------------------------------------------------------- */}
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="physics"
        subjectNameBn="পদার্থবিজ্ঞান"
        chapterNum={9}
        chapterTitleBn="আলোর প্রতিসরণ (Refraction of Light)"
        activeLesson={activeLesson}
        activeLessonTitle={LESSONS[activeLesson - 1]?.title}
        onOpenAi={() => setShowAiDrawer(true)}
        aiButtonLabel="এআই টিউটর"
        centerContent={
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'learn'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>১. কনসেপ্ট</span>
            </button>
            <button
              onClick={() => setActiveTab('example')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'example'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>২. CQ</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'practice'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>৩. প্র্যাকটিস</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'quiz'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>৪. কুইজ</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
                activeTab === 'summary'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>৫. সামারি</span>
            </button>
          </div>
        }
      />

      {/* ------------------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE CONTAINER                                               */}
      {/* ------------------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 flex-1">
        {/* ======================================================================= */}
        {/* TAB 1: LEARN CONCEPT & INTERACTIVE LABS                                 */}
        {/* ======================================================================= */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Top Lesson Horizontal Pill Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {LESSONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    activeLesson === l.id
                      ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-cyan-400">ল্যাব ০{l.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      পৃ: {l.nctbPage}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{l.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{l.subtitle}</p>
                </button>
              ))}
            </div>

            {/* Current Lesson Intro Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full">
                  {LESSONS[activeLesson - 1].badge}
                </span>
                <span className="text-xs text-slate-400">NCTB Class 9-10 Physics • Chapter 9</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">
                {LESSONS[activeLesson - 1].title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                {LESSONS[activeLesson - 1].intro}
              </p>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* LAB 1: SNELL'S LAW, REFRACTIVE INDEX & APPARENT DEPTH               */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual Canvas (8 cols) */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm font-bold text-slate-200">
                        স্নেলের সূত্র ও আলোকরশ্মির বাঁকা পথ (Snell&apos;s Ray Refraction)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCoinApparentActive(!coinApparentActive)}
                        className={`text-xs px-3 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                          coinApparentActive
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>মুদ্রা ও আপাত গভীরতা সিমুলেশন</span>
                      </button>
                    </div>
                  </div>

                  {/* SVG Ray Refraction Canvas */}
                  <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 600 360" className="w-full h-full select-none">
                      {/* Background Mediums */}
                      {/* Upper Medium (Medium 1) */}
                      <rect x="0" y="0" width="600" height="180" fill="#0f172a" fillOpacity="0.8" />
                      {/* Lower Medium (Medium 2) */}
                      <rect
                        x="0"
                        y="180"
                        width="600"
                        height="180"
                        fill={medium2 === 'water' ? '#083344' : medium2 === 'glass' ? '#134e4a' : medium2 === 'diamond' ? '#1e1b4b' : '#0f172a'}
                        fillOpacity="0.75"
                      />

                      {/* Boundary Interface Line */}
                      <line x1="0" y1="180" x2="600" y2="180" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,4" />

                      {/* Medium Labels */}
                      <text x="20" y="30" fill="#94a3b8" fontSize="12" fontFamily="monospace">
                        মাধ্যম ১: {refractiveIndices[medium1].nameBn} (v₁ = {refractiveIndices[medium1].speed} × 10⁸ m/s)
                      </text>
                      <text x="20" y="210" fill="#38bdf8" fontSize="12" fontFamily="monospace">
                        মাধ্যম ২: {refractiveIndices[medium2].nameBn} (v₂ = {refractiveIndices[medium2].speed} × 10⁸ m/s)
                      </text>

                      {/* Normal Line (অভিলম্ব NN') */}
                      <line x1="300" y1="20" x2="300" y2="340" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,4" />
                      <text x="306" y="35" fill="#64748b" fontSize="11" fontFamily="monospace">
                        N (অভিলম্ব)
                      </text>
                      <text x="306" y="335" fill="#64748b" fontSize="11" fontFamily="monospace">
                        N&apos;
                      </text>

                      {/* Geometric calculations for incident and refracted rays */}
                      {/* Interface Point: (300, 180) */}
                      {(() => {
                        const cx = 300;
                        const cy = 180;
                        const rayLength = 150;
                        const rad1 = (theta1Deg * Math.PI) / 180;
                        // Incident ray comes from top-left towards (cx, cy)
                        const incX = cx - rayLength * Math.sin(rad1);
                        const incY = cy - rayLength * Math.cos(rad1);

                        // Partial reflected ray back into medium 1 towards top-right
                        const refX = cx + rayLength * Math.sin(rad1);
                        const refY = cy - rayLength * Math.cos(rad1);

                        // Refracted ray into medium 2 towards bottom-right
                        const rad2 = (theta2Deg * Math.PI) / 180;
                        const refrX = cx + rayLength * Math.sin(rad2);
                        const refrY = cy + rayLength * Math.cos(rad2);

                        return (
                          <>
                            {/* Incident Ray */}
                            <line
                              x1={incX}
                              y1={incY}
                              x2={cx}
                              y2={cy}
                              stroke="#38bdf8"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                            {/* Arrow Indicator on Incident Ray */}
                            <circle cx={(incX + cx) / 2} cy={(incY + cy) / 2} r="4" fill="#38bdf8" />

                            {/* Angle of Incidence Arc */}
                            {theta1Deg > 5 && (
                              <path
                                d={`M ${cx} ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(rad1)} ${cy - 40 * Math.cos(rad1)}`}
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="2"
                              />
                            )}
                            <text
                              x={cx - 55}
                              y={cy - 25}
                              fill="#38bdf8"
                              fontSize="12"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              θ₁ = {theta1Deg}°
                            </text>

                            {/* Refraction or TIR */}
                            {isTIRLab1 ? (
                              <>
                                {/* Total Internal Reflection Ray */}
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={refX}
                                  y2={refY}
                                  stroke="#10b981"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                />
                                <text x={cx + 40} y={cy - 50} fill="#10b981" fontSize="12" fontWeight="bold">
                                  পূর্ণ অভ্যন্তরীণ প্রতিফলন (TIR)
                                </text>
                              </>
                            ) : (
                              <>
                                {/* Partial Weak Reflected Ray */}
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={refX}
                                  y2={refY}
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                  strokeDasharray="3,3"
                                  strokeOpacity="0.4"
                                />
                                {/* Main Refracted Ray */}
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={refrX}
                                  y2={refrY}
                                  stroke="#22d3ee"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                />
                                <circle cx={(cx + refrX) / 2} cy={(cy + refrY) / 2} r="4" fill="#22d3ee" />

                                {/* Angle of Refraction Arc */}
                                {theta2Deg > 5 && (
                                  <path
                                    d={`M ${cx} ${cy + 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(rad2)} ${cy + 40 * Math.cos(rad2)}`}
                                    fill="none"
                                    stroke="#22d3ee"
                                    strokeWidth="2"
                                  />
                                )}
                                <text
                                  x={cx + 35}
                                  y={cy + 30}
                                  fill="#22d3ee"
                                  fontSize="12"
                                  fontWeight="bold"
                                  fontFamily="monospace"
                                >
                                  θ₂ = {theta2Deg.toFixed(1)}°
                                </text>
                              </>
                            )}

                            {/* Apparent Depth Coin Simulation Overlay */}
                            {coinApparentActive && (
                              <g>
                                {/* Actual Coin Position at bottom */}
                                <circle cx="480" cy="300" r="14" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                                <text x="465" y="304" fill="#78350f" fontSize="10" fontWeight="bold">
                                  ৳ ৫
                                </text>
                                <text x="502" y="304" fill="#f59e0b" fontSize="11">
                                  প্রকৃত মুদ্রা
                                </text>

                                {/* Apparent Coin Position raised up */}
                                <circle
                                  cx="480"
                                  cy={300 - (1 - 1 / (n2 / n1)) * 100}
                                  r="14"
                                  fill="#fde68a"
                                  fillOpacity="0.75"
                                  stroke="#f59e0b"
                                  strokeWidth="1.5"
                                  strokeDasharray="2,2"
                                />
                                <text
                                  x="502"
                                  y={304 - (1 - 1 / (n2 / n1)) * 100}
                                  fill="#fde68a"
                                  fontSize="11"
                                  fontWeight="bold"
                                >
                                  আপাত মুদ্রা (উঠে আসা প্রতিবিম্ব)
                                </text>

                                {/* Upward Shift Arrow */}
                                <line
                                  x1="480"
                                  y1="280"
                                  x2="480"
                                  y2={315 - (1 - 1 / (n2 / n1)) * 100}
                                  stroke="#ef4444"
                                  strokeWidth="2"
                                  markerEnd="url(#arrow)"
                                />
                              </g>
                            )}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Bottom Status Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur rounded-xl px-4 py-2 flex flex-wrap items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">আপতন কোণ:</span>
                        <span className="font-mono text-cyan-300 font-bold">{theta1Deg}°</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">প্রতিসরণ কোণ:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {isTIRLab1 ? 'TIR (প্রতিসরণ নেই)' : `${theta2Deg.toFixed(1)}°`}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-amber-400">
                        {n2 > n1
                          ? 'হালকা থেকে ঘন: আলো অভিলম্বের দিকে বাঁকে (θ₂ < θ₁)'
                          : 'ঘন থেকে হালকা: আলো অভিলম্ব থেকে দূরে সরে (θ₂ > θ₁)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Panel (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Medium Selection */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>মাধ্যম ও কোণ নিয়ন্ত্রণ</span>
                    </h3>

                    {/* Medium 1 Picker */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">প্রথম মাধ্যম (Medium 1):</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['air', 'water', 'glass'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setMedium1(m)}
                            className={`py-1.5 text-xs rounded-xl border transition ${
                              medium1 === m
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {m === 'air' ? 'বায়ু' : m === 'water' ? 'পানি' : 'কাচ'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Medium 2 Picker */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">দ্বিতীয় মাধ্যম (Medium 2):</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['water', 'glass', 'diamond', 'air'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setMedium2(m)}
                            className={`py-1.5 text-xs rounded-xl border transition ${
                              medium2 === m
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {m === 'water' ? 'পানি (১.৩৩)' : m === 'glass' ? 'কাচ (১.৫২)' : m === 'diamond' ? 'হীরা (২.৪২)' : 'বায়ু (১.০০)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Incident Angle Slider */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">আপতন কোণ (θ₁):</span>
                        <span className="font-mono text-cyan-400 font-bold">{theta1Deg}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="85"
                        step="1"
                        value={theta1Deg}
                        onChange={(e) => setTheta1Deg(Number(e.target.value))}
                        className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Mathematical Derivation Box */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      গাণিতিক বিশ্লেষণ (Snell&apos;s Calculation)
                    </span>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                      <div className="text-slate-400">
                        <RenderMathText text="$n_1 \sin \theta_1 = n_2 \sin \theta_2$" />
                      </div>
                      <div className="text-cyan-300">
                        <RenderMathText
                          text={`$\\sin \\theta_2 = \\frac{${n1.toFixed(2)}}{${n2.toFixed(2)}} \\times \\sin(${theta1Deg}^\\circ) = ${sinTheta2.toFixed(3)}$`}
                        />
                      </div>
                      <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                        {isTIRLab1 ? (
                          <span className="text-rose-400">sin θ₂ &gt; 1 হওয়ায় পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটবে!</span>
                        ) : (
                          <RenderMathText text={`$\\theta_2 = \\sin^{-1}(${sinTheta2.toFixed(3)}) = ${theta2Deg.toFixed(1)}^\\circ$`} />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      হালকা মাধ্যম থেকে ঘন মাধ্যমে গেলে আলো অভিলম্বের কাছে সরে আসে। আর পানি বা কাচের ভেতরে থাকা মুদ্রা বাইরে থেকে দেখলে উপরে উঠে এসেছে মনে হয় কারণ আলো বাঁকা হয়ে চোখে পৌঁছায়।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 2: CRITICAL ANGLE & TOTAL INTERNAL REFLECTION (TIR)             */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SVG TIR Visualizer (8 cols) */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-bold text-slate-200">
                        সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন চেম্বার
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold border ${
                          isTotalInternalReflection
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 animate-pulse'
                            : isAtCriticalAngle
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        }`}
                      >
                        {isTotalInternalReflection
                          ? '🌟 পূর্ণ অভ্যন্তরীণ প্রতিফলন (TIR Active)'
                          : isAtCriticalAngle
                          ? '⚡ সংকট কোণ (θ = θ_c, প্রতিসরণ কোণ ৯০°)'
                          : 'সাধারণ প্রতিসরণ (θ < θ_c)'}
                      </span>
                    </div>
                  </div>

                  {/* SVG Canvas for TIR */}
                  <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 600 360" className="w-full h-full select-none">
                      {/* Top Medium: Rare (Air / Cladding) */}
                      <rect x="0" y="0" width="600" height="180" fill="#0f172a" fillOpacity="0.7" />
                      {/* Bottom Medium: Dense (Glass / Water / Core) */}
                      <rect x="0" y="180" width="600" height="180" fill="#064e3b" fillOpacity="0.4" />

                      {/* Boundary Line */}
                      <line x1="0" y1="180" x2="600" y2="180" stroke="#10b981" strokeWidth="2.5" />

                      {/* Normal Line NN' */}
                      <line x1="300" y1="20" x2="300" y2="340" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,4" />

                      {/* Labels */}
                      <text x="20" y="40" fill="#94a3b8" fontSize="12" fontFamily="monospace">
                        হালকা মাধ্যম: {currentTirConfig.rareName} (n = {currentTirConfig.nRare.toFixed(2)})
                      </text>
                      <text x="20" y="210" fill="#34d399" fontSize="12" fontFamily="monospace">
                        ঘন মাধ্যম: {currentTirConfig.nameBn}
                      </text>
                      <text x="20" y="230" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                        সংকট কোণ θ_c = {criticalAngleDeg.toFixed(1)}°
                      </text>

                      {/* Tracing Ray from dense (bottom) to rare (top) */}
                      {(() => {
                        const cx = 300;
                        const cy = 180;
                        const rayLen = 145;
                        const radIn = (tirIncidentAngle * Math.PI) / 180;

                        // Source point in bottom-left dense medium
                        const srcX = cx - rayLen * Math.sin(radIn);
                        const srcY = cy + rayLen * Math.cos(radIn);

                        // If TIR: reflected ray goes to bottom-right dense medium
                        const tirX = cx + rayLen * Math.sin(radIn);
                        const tirY = cy + rayLen * Math.cos(radIn);

                        // If not TIR: calculate refracted angle into top-right rare medium
                        const sinRefr = (currentTirConfig.nDense * Math.sin(radIn)) / currentTirConfig.nRare;
                        const radRefr = sinRefr <= 1 ? Math.asin(sinRefr) : Math.PI / 2;
                        const refrX = cx + rayLen * Math.sin(radRefr);
                        const refrY = cy - rayLen * Math.cos(radRefr);

                        return (
                          <>
                            {/* Incident Ray in Dense Medium */}
                            <line
                              x1={srcX}
                              y1={srcY}
                              x2={cx}
                              y2={cy}
                              stroke="#34d399"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                            <circle cx={(srcX + cx) / 2} cy={(srcY + cy) / 2} r="4" fill="#34d399" />

                            {/* Angle of Incidence Arc */}
                            {tirIncidentAngle > 5 && (
                              <path
                                d={`M ${cx} ${cy + 40} A 40 40 0 0 1 ${cx - 40 * Math.sin(radIn)} ${cy + 40 * Math.cos(radIn)}`}
                                fill="none"
                                stroke="#34d399"
                                strokeWidth="2"
                              />
                            )}
                            <text
                              x={cx - 65}
                              y={cy + 30}
                              fill="#34d399"
                              fontSize="12"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              θ = {tirIncidentAngle}°
                            </text>

                            {/* Behavior depending on angle vs critical angle */}
                            {isTotalInternalReflection ? (
                              <>
                                {/* 100% Total Internal Reflected Ray */}
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={tirX}
                                  y2={tirY}
                                  stroke="#10b981"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                                <circle cx={(cx + tirX) / 2} cy={(cy + tirY) / 2} r="4" fill="#10b981" />
                                <text x={cx + 35} y={cy + 75} fill="#10b981" fontSize="12" fontWeight="bold">
                                  ১০০% প্রতিফলিত রশ্মি (TIR)
                                </text>
                              </>
                            ) : isAtCriticalAngle ? (
                              <>
                                {/* Ray grazing the boundary at 90 deg */}
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={cx + 170}
                                  y2={cy}
                                  stroke="#f59e0b"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                                <circle cx={cx + 90} cy={cy} r="4" fill="#f59e0b" />
                                <text x={cx + 30} y={cy - 12} fill="#f59e0b" fontSize="11" fontWeight="bold">
                                  প্রতিসরণ কোণ = ৯০° (বিভেদতল ঘেঁষে)
                                </text>
                              </>
                            ) : (
                              <>
                                {/* Normal Refracted Ray into Rare Medium */}
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={refrX}
                                  y2={refrY}
                                  stroke="#38bdf8"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />
                                {/* Weak Partial Reflection */}
                                <line
                                  x1={cx}
                                  y1={cy}
                                  x2={tirX}
                                  y2={tirY}
                                  stroke="#34d399"
                                  strokeWidth="1.5"
                                  strokeDasharray="3,3"
                                  strokeOpacity="0.4"
                                />
                                <text
                                  x={cx + 30}
                                  y={cy - 40}
                                  fill="#38bdf8"
                                  fontSize="12"
                                  fontWeight="bold"
                                  fontFamily="monospace"
                                >
                                  θ₂ = {((radRefr * 180) / Math.PI).toFixed(1)}°
                                </text>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Bottom Indicator Pill */}
                    <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur rounded-xl px-4 py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">আপতন কোণ:</span>
                        <span className="font-mono text-emerald-400 font-bold">{tirIncidentAngle}°</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">সংকট কোণ:</span>
                        <span className="font-mono text-amber-400 font-bold">{criticalAngleDeg.toFixed(1)}°</span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-300">
                        {isTotalInternalReflection
                          ? 'আপতন কোণ > সংকট কোণ ➔ পূর্ণ অভ্যন্তরীণ প্রতিফলন'
                          : 'আপতন কোণ ≤ সংকট কোণ ➔ আলো হালকা মাধ্যমে প্রতিসরিত হয়'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Control Panel (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Preset Dense Mediums */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      ঘন মাধ্যম নির্বাচন করুন
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(['glass', 'water', 'diamond', 'fiberCore'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setTirDenseMedium(m);
                            // Set initial angle near critical angle
                            const ca = (Math.asin(tirDensities[m].nRare / tirDensities[m].nDense) * 180) / Math.PI;
                            setTirIncidentAngle(Math.round(ca));
                          }}
                          className={`p-2.5 text-xs rounded-xl border text-left transition ${
                            tirDenseMedium === m
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-semibold line-clamp-1">
                            {m === 'glass' ? 'কাচ' : m === 'water' ? 'পানি' : m === 'diamond' ? 'হীরা' : 'অপটিক্যাল ফাইবার'}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            θ_c = {((Math.asin(tirDensities[m].nRare / tirDensities[m].nDense) * 180) / Math.PI).toFixed(1)}°
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Incident Angle Slider */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">আপতন কোণ (θ):</span>
                        <span className="font-mono text-emerald-400 font-bold">{tirIncidentAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="85"
                        step="1"
                        value={tirIncidentAngle}
                        onChange={(e) => setTirIncidentAngle(Number(e.target.value))}
                        className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => setTirIncidentAngle(Math.max(10, Math.round(criticalAngleDeg) - 15))}
                        className="py-1 px-1.5 text-[11px] rounded bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                      >
                        θ &lt; θ_c
                      </button>
                      <button
                        onClick={() => setTirIncidentAngle(Math.round(criticalAngleDeg))}
                        className="py-1 px-1.5 text-[11px] rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 font-bold"
                      >
                        θ = θ_c
                      </button>
                      <button
                        onClick={() => setTirIncidentAngle(Math.min(85, Math.round(criticalAngleDeg) + 15))}
                        className="py-1 px-1.5 text-[11px] rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 font-bold"
                      >
                        θ &gt; θ_c (TIR)
                      </button>
                    </div>
                  </div>

                  {/* Conditions & Board Notes */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      পূর্ণ অভ্যন্তরীণ প্রতিফলনের ২টি আবশ্যিক শর্ত
                    </span>
                    <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>শর্ত ০১:</strong> আলোকরশ্মিকে অবশ্যই <em>ঘন মাধ্যম</em> থেকে <em>হালকা মাধ্যমে</em> যেতে হবে।
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>শর্ত ০২:</strong> ঘন মাধ্যমের আপতন কোণ ক্রান্তি কোণের চেয়ে বড় হতে হবে (θ &gt; θ_c)।
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 3: OPTICAL FIBER, MIRAGE & PRISM DISPERSION                     */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 3 && (
              <div className="space-y-6">
                {/* Sub-tab switcher */}
                <div className="flex gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setLab3SubTab('fiber')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                      lab3SubTab === 'fiber'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ১. অপটিক্যাল ফাইবার কেবল (Optical Fiber)
                  </button>
                  <button
                    onClick={() => setLab3SubTab('mirage')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                      lab3SubTab === 'mirage'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ২. মরুভূমির মরীচিকা ও উত্তপ্ত রাস্তা (Mirage)
                  </button>
                  <button
                    onClick={() => setLab3SubTab('prism')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                      lab3SubTab === 'prism'
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ৩. প্রিজম ও বর্ণচ্ছত্র বিচ্ছুরণ (Prism Spectrum)
                  </button>
                </div>

                {/* Sub-Lab 1: Optical Fiber */}
                {lab3SubTab === 'fiber' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-sm font-bold text-slate-200">
                          অপটিক্যাল ফাইবারে আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন সঞ্চালন
                        </span>
                        <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                          কোর (n=1.50) | ক্ল্যাডিং (n=1.45) | θ_c = 75.2°
                        </span>
                      </div>

                      <div className="relative w-full h-[260px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                        <svg viewBox="0 0 650 240" className="w-full h-full select-none">
                          {/* Upper Cladding */}
                          <rect x="0" y="20" width="650" height="40" fill="#1e293b" fillOpacity="0.8" />
                          <text x="20" y="45" fill="#64748b" fontSize="11" fontFamily="monospace">
                            ক্ল্যাডিং (Cladding, n = 1.45)
                          </text>

                          {/* Central Core */}
                          <rect x="0" y="60" width="650" height="120" fill="#0f172a" />
                          <text x="20" y="85" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                            কোর (Core Glass, n = 1.50)
                          </text>

                          {/* Lower Cladding */}
                          <rect x="0" y="180" width="650" height="40" fill="#1e293b" fillOpacity="0.8" />
                          <text x="20" y="205" fill="#64748b" fontSize="11" fontFamily="monospace">
                            ক্ল্যাডিং (Cladding, n = 1.45)
                          </text>

                          {/* Boundary lines */}
                          <line x1="0" y1="60" x2="650" y2="60" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
                          <line x1="0" y1="180" x2="650" y2="180" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />

                          {/* Zig-Zag Light Ray bouncing via TIR */}
                          {fiberAngle >= 75 ? (
                            <path
                              d="M 10 120 L 90 60 L 210 180 L 330 60 L 450 180 L 570 60 L 640 130"
                              fill="none"
                              stroke="#00f5ff"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-pulse"
                            />
                          ) : (
                            <>
                              {/* Light leaking through cladding because angle < 75 */}
                              <path
                                d="M 10 120 L 90 60 L 130 10"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <text x="140" y="30" fill="#ef4444" fontSize="11" fontWeight="bold">
                                সিগন্যাল লিক! (θ &lt; θ_c)
                              </text>
                            </>
                          )}
                        </svg>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400">আপতন কোণ সমন্বয় (θ):</span>
                        <input
                          type="range"
                          min="60"
                          max="88"
                          value={fiberAngle}
                          onChange={(e) => setFiberAngle(Number(e.target.value))}
                          className="w-1/2 accent-cyan-400"
                        />
                        <span className="font-mono text-cyan-300 font-bold">{fiberAngle}°</span>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                        অপটিক্যাল ফাইবারের মূল নীতি
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        ১. <strong>কোর ও ক্ল্যাড:</strong> কোরের প্রতিসরণাঙ্ক (১.৫০) ক্ল্যাডের (১.৪৫) চেয়ে বেশি হওয়ায় ভেতরের আলো বাইরে বের হতে পারে না।
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        ২. <strong>ইনফ্রারেড রশ্মি:</strong> দৃশ্যমান আলো কাচে বেশি শোষিত হয় বলে লম্বা তরঙ্গদৈর্ঘ্যের ইনফ্রারেড (Infrared) রশ্মি ব্যবহার করা হয়।
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        ৩. <strong>চিকিৎসায় এন্ডোস্কোপি:</strong> মানবদেহের ভেতরের অঙ্গ দেখতে লাইট গাইড হিসেবে অপটিক্যাল ফাইবার ব্যবহার করা হয়।
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-Lab 2: Mirage */}
                {lab3SubTab === 'mirage' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                      <span className="text-sm font-bold text-slate-200 block border-b border-slate-800 pb-3">
                        মরুভূমির উত্তপ্ত বালুর স্তরে মরীচিকা সৃষ্টি (Desert Mirage Ray Diagram)
                      </span>

                      <div className="relative w-full h-[260px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                        <svg viewBox="0 0 650 240" className="w-full h-full select-none">
                          {/* Atmospheric temperature gradient */}
                          <rect x="0" y="0" width="650" height="70" fill="#0369a1" fillOpacity="0.25" />
                          <text x="20" y="30" fill="#38bdf8" fontSize="11" fontFamily="monospace">
                            উপরের স্তর: ঠান্ডা ও ঘন বায়ু (উচ্চ n)
                          </text>

                          <rect x="0" y="70" width="650" height="70" fill="#ca8a04" fillOpacity="0.2" />
                          <text x="20" y="100" fill="#facc15" fontSize="11" fontFamily="monospace">
                            মধ্যবর্তী স্তর: উষ্ণ বায়ু (মাঝারি n)
                          </text>

                          <rect x="0" y="140" width="650" height="100" fill="#ea580c" fillOpacity="0.25" />
                          <text x="20" y="170" fill="#fb923c" fontSize="11" fontFamily="monospace">
                            নিচের স্তর: তপ্ত বালুকার সংস্পর্শে অতি উত্তপ্ত হালকা বায়ু (নিম্ন n)
                          </text>

                          {/* Palm Tree on left */}
                          <g transform="translate(60, 40)">
                            <rect x="18" y="50" width="8" height="110" fill="#78350f" />
                            <circle cx="22" cy="40" r="28" fill="#15803d" />
                            <text x="-5" y="180" fill="#94a3b8" fontSize="11">
                              প্রকৃত গাছ
                            </text>
                          </g>

                          {/* Observer Eye on right */}
                          <g transform="translate(560, 60)">
                            <ellipse cx="20" cy="20" rx="18" ry="12" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                            <circle cx="20" cy="20" r="6" fill="#38bdf8" />
                            <text x="2" y="50" fill="#94a3b8" fontSize="11">
                              পর্যবেক্ষক
                            </text>
                          </g>

                          {/* Curved Ray showing TIR bending back up */}
                          <path
                            d="M 82 80 Q 280 200 560 80"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />

                          {/* Dotted line backward showing virtual image underneath */}
                          <line x1="560" y1="80" x2="300" y2="230" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />

                          {/* Inverted Tree Image at bottom */}
                          <g transform="translate(260, 190) scale(1, -0.6)">
                            <rect x="18" y="0" width="8" height="60" fill="#78350f" fillOpacity="0.4" />
                            <circle cx="22" cy="0" r="22" fill="#15803d" fillOpacity="0.4" />
                          </g>
                          <text x="220" y="235" fill="#f59e0b" fontSize="11" fontWeight="bold">
                            উল্টো প্রতিবিম্ব (পানির বিভ্রম)
                          </text>
                        </svg>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                        মরীচিকা কেন সৃষ্টি হয়?
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        মরুভূমিতে বালু উত্তপ্ত থাকার কারণে মাটির নিকটবর্তী স্তরের বাতাস হালকা হয়। দূরের গাছ থেকে আসা আলো ওপরের ঘন স্তর থেকে নিচের হালকা স্তরে আসার সময় ক্রমাগত অভিলম্ব থেকে দূরে সরে যায়।
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        একপর্যায়ে আপতন কোণ ক্রান্তি কোণের চেয়ে বড় হলে আলো পূর্ণ অভ্যন্তরীণ প্রতিফলিত হয়ে উপরের দিকে চোখের দিকে ফিরে আসে। মস্তিষ্ক ভাবে আলো সোজা নিচ থেকে আসছে, তাই গাছের নিচে উল্টো প্রতিবিম্ব দেখে পথিকের মনে হয় সেখানে জলাশয় আছে!
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-Lab 3: Prism */}
                {lab3SubTab === 'prism' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
                      <span className="text-sm font-bold text-slate-200 block border-b border-slate-800 pb-3">
                        প্রিজমে আলোর বিচ্ছুরণ ও ৭ বর্ণের বর্ণালী (Dispersion into Spectrum)
                      </span>

                      <div className="relative w-full h-[260px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                        <svg viewBox="0 0 650 240" className="w-full h-full select-none">
                          {/* Triangular Prism */}
                          <polygon points="320,30 200,210 440,210" fill="#1e293b" fillOpacity="0.7" stroke="#38bdf8" strokeWidth="2" />
                          <text x="310" y="140" fill="#94a3b8" fontSize="12" fontFamily="monospace">
                            কাচ প্রিজম
                          </text>

                          {/* White incident ray */}
                          <line x1="50" y1="140" x2="250" y2="135" stroke="#ffffff" strokeWidth="4" />
                          <text x="70" y="125" fill="#ffffff" fontSize="12" fontWeight="bold">
                            সাদা আলো
                          </text>

                          {/* 7 Spectral refracted rays emerging */}
                          {/* Red (least bent) */}
                          <line x1="250" y1="135" x2="360" y2="150" stroke="#ef4444" strokeWidth="2" />
                          <line x1="360" y1="150" x2="580" y2="130" stroke="#ef4444" strokeWidth="2.5" />
                          <text x="590" y="134" fill="#ef4444" fontSize="11" fontWeight="bold">
                            লাল (Red)
                          </text>

                          {/* Yellow */}
                          <line x1="250" y1="135" x2="365" y2="160" stroke="#eab308" strokeWidth="2" />
                          <line x1="365" y1="160" x2="580" y2="160" stroke="#eab308" strokeWidth="2.5" />
                          <text x="590" y="164" fill="#eab308" fontSize="11" fontWeight="bold">
                            হলুদ (Yellow)
                          </text>

                          {/* Green */}
                          <line x1="250" y1="135" x2="370" y2="170" stroke="#22c55e" strokeWidth="2" />
                          <line x1="370" y1="170" x2="580" y2="185" stroke="#22c55e" strokeWidth="2.5" />
                          <text x="590" y="189" fill="#22c55e" fontSize="11" fontWeight="bold">
                            সবুজ (Green)
                          </text>

                          {/* Violet (most bent) */}
                          <line x1="250" y1="135" x2="375" y2="180" stroke="#8b5cf6" strokeWidth="2" />
                          <line x1="375" y1="180" x2="580" y2="215" stroke="#8b5cf6" strokeWidth="2.5" />
                          <text x="590" y="219" fill="#8b5cf6" fontSize="11" fontWeight="bold">
                            বেগুনি (Violet)
                          </text>
                        </svg>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                        বিচ্ছুরণের বৈজ্ঞানিক কারণ
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        কাচে বিভিন্ন রঙের আলোর বেগ আলাদা। লাল আলোর তরঙ্গদৈর্ঘ্য বেশি হওয়ায় বেগ বেশি এবং প্রতিসরণাঙ্ক কম; তাই লাল আলো সবচেয়ে কম বেঁকে যায়।
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        অন্যদিকে বেগুনি আলোর তরঙ্গদৈর্ঘ্য সবচেয়ে কম হওয়ায় প্রতিসরণাঙ্ক বেশি এবং এটি সবচেয়ে বেশি বেঁকে যায়। ফলে সাদা আলো ৭টি আলাদা রঙে বিভক্ত হয়।
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 4: CONVEX & CONCAVE LENS RAY TRACING                            */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SVG Ray Tracing Canvas (8 cols) */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Glasses className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm font-bold text-slate-200">
                        {lensType === 'convex' ? 'উত্তল লেন্স (অভিসারী)' : 'অবতল লেন্স (অপসারী)'} রশ্মিচিত্র সিমুলেটর
                      </span>
                    </div>

                    {/* Lens Type Switcher */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => {
                          setLensType('convex');
                          setLensObjectDistance(35);
                        }}
                        className={`text-xs px-3 py-1 rounded-lg transition font-semibold ${
                          lensType === 'convex' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        উত্তল লেন্স (Convex)
                      </button>
                      <button
                        onClick={() => {
                          setLensType('concave');
                          setLensObjectDistance(35);
                        }}
                        className={`text-xs px-3 py-1 rounded-lg transition font-semibold ${
                          lensType === 'concave' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        অবতল লেন্স (Concave)
                      </button>
                    </div>
                  </div>

                  {/* SVG Ray Tracing Canvas */}
                  <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 600 360" className="w-full h-full select-none">
                      {/* Principal Axis (প্রধান অক্ষ) */}
                      <line x1="20" y1="180" x2="580" y2="180" stroke="#475569" strokeWidth="1.5" />

                      {/* Optical Center O at (300, 180) */}
                      {/* Lens Vertical Line / Geometry */}
                      <line x1="300" y1="40" x2="300" y2="320" stroke="#38bdf8" strokeWidth="2.5" />
                      {/* Lens Body Profile */}
                      {lensType === 'convex' ? (
                        <path
                          d="M 300 40 Q 320 180 300 320 Q 280 180 300 40"
                          fill="#38bdf8"
                          fillOpacity="0.25"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                      ) : (
                        <path
                          d="M 290 40 L 310 40 Q 295 180 310 320 L 290 320 Q 305 180 290 40"
                          fill="#38bdf8"
                          fillOpacity="0.25"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* Landmarks: F1, 2F1 on left; F2, 2F2 on right */}
                      {(() => {
                        const cx = 300;
                        const cy = 180;
                        const pxPerCm = 4.5;
                        const fPx = lensFocalLength * pxPerCm;

                        // Landmarks
                        const f1X = cx - fPx;
                        const twoF1X = cx - 2 * fPx;
                        const f2X = cx + fPx;
                        const twoF2X = cx + 2 * fPx;

                        // Object Position & Arrow
                        const objX = cx - lensObjectDistance * pxPerCm;
                        const objH = lensObjectHeight * 3.5;
                        const objTopY = cy - objH;

                        // Computed Image Position
                        const isAtInfinity = Math.abs(lensObjectDistance - lensFocalLength) < 1 && lensType === 'convex';
                        const imgX = cx + lensImageDistance * pxPerCm;
                        const imgH = lensImageHeight * 3.5;
                        const imgY = lensMagnification < 0 ? cy + imgH : cy - imgH;

                        return (
                          <>
                            {/* Landmarks Markers */}
                            <circle cx={cx} cy={cy} r="3" fill="#ffffff" />
                            <text x={cx - 10} y={cy + 18} fill="#94a3b8" fontSize="11" fontFamily="monospace">
                              O
                            </text>

                            <circle cx={f1X} cy={cy} r="3" fill="#38bdf8" />
                            <text x={f1X - 8} y={cy + 18} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                              F₁
                            </text>

                            <circle cx={twoF1X} cy={cy} r="3" fill="#38bdf8" />
                            <text x={twoF1X - 12} y={cy + 18} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                              2F₁
                            </text>

                            <circle cx={f2X} cy={cy} r="3" fill="#38bdf8" />
                            <text x={f2X - 8} y={cy + 18} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                              F₂
                            </text>

                            <circle cx={twoF2X} cy={cy} r="3" fill="#38bdf8" />
                            <text x={twoF2X - 12} y={cy + 18} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                              2F₂
                            </text>

                            {/* Object Arrow on Left */}
                            <line x1={objX} y1={cy} x2={objX} y2={objTopY} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                            <polygon
                              points={`${objX},${objTopY - 6} ${objX - 5},${objTopY + 4} ${objX + 5},${objTopY + 4}`}
                              fill="#f59e0b"
                            />
                            <text x={objX - 18} y={objTopY - 10} fill="#f59e0b" fontSize="11" fontWeight="bold">
                              লক্ষ্যবস্তু (u)
                            </text>

                            {/* Ray 1: Parallel to Axis -> Refracts through Focus */}
                            <line x1={objX} y1={objTopY} x2={cx} y2={objTopY} stroke="#10b981" strokeWidth="2" />
                            {lensType === 'convex' ? (
                              <line
                                x1={cx}
                                y1={objTopY}
                                x2={imgX || 580}
                                y2={imgY || 300}
                                stroke="#10b981"
                                strokeWidth="2"
                              />
                            ) : (
                              <>
                                <line x1={cx} y1={objTopY} x2={560} y2={cy - 140} stroke="#10b981" strokeWidth="2" />
                                <line x1={f1X} y1={cy} x2={cx} y2={objTopY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                              </>
                            )}

                            {/* Ray 2: Passing straight through Optical Center O */}
                            <line
                              x1={objX}
                              y1={objTopY}
                              x2={imgX || 580}
                              y2={imgY || 320}
                              stroke="#6366f1"
                              strokeWidth="2"
                            />

                            {/* If Virtual Image (v < 0), backward dotted extension */}
                            {lensImageDistance < 0 && (
                              <line
                                x1={cx}
                                y1={objTopY}
                                x2={imgX}
                                y2={imgY}
                                stroke="#10b981"
                                strokeWidth="1.5"
                                strokeDasharray="3,3"
                              />
                            )}

                            {/* Image Arrow */}
                            {!isAtInfinity && (
                              <>
                                <line
                                  x1={imgX}
                                  y1={cy}
                                  x2={imgX}
                                  y2={imgY}
                                  stroke={lensImageDistance > 0 ? '#22d3ee' : '#ec4899'}
                                  strokeWidth="3.5"
                                  strokeDasharray={lensImageDistance < 0 ? '4,3' : undefined}
                                  strokeLinecap="round"
                                />
                                <text
                                  x={imgX - 15}
                                  y={imgY + (lensMagnification < 0 ? 16 : -8)}
                                  fill={lensImageDistance > 0 ? '#22d3ee' : '#ec4899'}
                                  fontSize="11"
                                  fontWeight="bold"
                                >
                                  প্রতিবিম্ব (v)
                                </text>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Bottom Status Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur rounded-xl px-4 py-2 flex flex-wrap items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">প্রতিবিম্ব দূরত্ব (v):</span>
                        <span className="font-mono text-cyan-300 font-bold">
                          {Math.abs(lensObjectDistance - lensFocalLength) < 1 && lensType === 'convex'
                            ? 'অসীম (Infinity)'
                            : `${lensImageDistance.toFixed(1)} cm`}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">বিবর্ধন (|m|):</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {Math.abs(lensMagnification).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-amber-400">
                        {lensImageDistance > 0
                          ? 'বাস্তব ও উল্টো (Real & Inverted)'
                          : 'অবাস্তব ও সোজা (Virtual & Upright)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Position Presets for Convex Lens */}
                  {lensType === 'convex' && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        উত্তল লেন্সের ৬টি ক্লাসিক অবস্থান প্রিসেট
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => setLensObjectDistance(50)}
                          className={`p-2 rounded-xl border text-left transition ${
                            lensObjectDistance > 2 * lensFocalLength
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          u &gt; 2f (খর্বিত সদ উল্টো)
                        </button>
                        <button
                          onClick={() => setLensObjectDistance(40)}
                          className={`p-2 rounded-xl border text-left transition ${
                            lensObjectDistance === 2 * lensFocalLength
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          u = 2f (সমান সদ উল্টো, |m|=১)
                        </button>
                        <button
                          onClick={() => setLensObjectDistance(30)}
                          className={`p-2 rounded-xl border text-left transition ${
                            lensObjectDistance > lensFocalLength && lensObjectDistance < 2 * lensFocalLength
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          f &lt; u &lt; 2f (বিবর্ধিত সদ)
                        </button>
                        <button
                          onClick={() => setLensObjectDistance(12)}
                          className={`p-2 rounded-xl border text-left transition ${
                            lensObjectDistance < lensFocalLength
                              ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          u &lt; f (ম্যাগনিফায়ার অবাস্তব)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sliders */}
                  <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">বস্তুর দূরত্ব (u):</span>
                        <span className="font-mono text-cyan-400 font-bold">{lensObjectDistance} cm</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="70"
                        value={lensObjectDistance}
                        onChange={(e) => setLensObjectDistance(Number(e.target.value))}
                        className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">ফোকাস দূরত্ব (|f|):</span>
                        <span className="font-mono text-cyan-400 font-bold">{lensFocalLength} cm</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="35"
                        value={lensFocalLength}
                        onChange={(e) => setLensFocalLength(Number(e.target.value))}
                        className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* LAB 5: LENS FORMULA, POWER & EYE DEFECTS                            */}
            {/* ------------------------------------------------------------------- */}
            {activeLesson === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Eye Defect Visualizer (8 cols) */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm font-bold text-slate-200">
                        চোখের গঠন ও দৃষ্টিত্রুটি সংশোধন ল্যাব (Eye Defects & Spectacles)
                      </span>
                    </div>

                    <button
                      onClick={() => setHasCorrectionGlass(!hasCorrectionGlass)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                        hasCorrectionGlass
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Glasses className="w-3.5 h-3.5" />
                      <span>{hasCorrectionGlass ? 'চশমা সরানো হোক' : 'সংশোধনকারী চশমা পরাও'}</span>
                    </button>
                  </div>

                  {/* SVG Eye Diagram */}
                  <div className="relative w-full h-[320px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 600 300" className="w-full h-full select-none">
                      {/* Eyeball Oval */}
                      <ellipse cx="380" cy="150" rx="140" ry="110" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                      {/* Retina Layer on back wall */}
                      <path
                        d="M 460 70 A 140 110 0 0 1 460 230"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x="475" y="155" fill="#f59e0b" fontSize="12" fontWeight="bold">
                        রেটিনা (Retina)
                      </text>

                      {/* Natural Eye Lens at (280, 150) */}
                      <ellipse cx="280" cy="150" rx="14" ry="45" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" />
                      <text x="260" y="215" fill="#94a3b8" fontSize="11">
                        চোখের লেন্স
                      </text>

                      {/* External Spectacle Lens if added */}
                      {hasCorrectionGlass && eyeDefect !== 'normal' && (
                        <g transform="translate(180, 150)">
                          {eyeDefect === 'myopia' ? (
                            /* Concave Corrective Lens */
                            <path
                              d="M -8 -45 L 8 -45 Q -2 0 8 45 L -8 45 Q 2 0 -8 -45"
                              fill="#a855f7"
                              fillOpacity="0.3"
                              stroke="#a855f7"
                              strokeWidth="2"
                            />
                          ) : (
                            /* Convex Corrective Lens */
                            <path
                              d="M 0 -45 Q 12 0 0 45 Q -12 0 0 -45"
                              fill="#10b981"
                              fillOpacity="0.3"
                              stroke="#10b981"
                              strokeWidth="2"
                            />
                          )}
                          <text x="-40" y="65" fill={eyeDefect === 'myopia' ? '#a855f7' : '#10b981'} fontSize="11" fontWeight="bold">
                            {eyeDefect === 'myopia' ? 'অবতল লেন্স (-D)' : 'উত্তল লেন্স (+D)'}
                          </text>
                        </g>
                      )}

                      {/* Light rays entering and focusing */}
                      {(() => {
                        let focusX = 460; // Exact on retina
                        if (eyeDefect === 'myopia' && !hasCorrectionGlass) {
                          focusX = 390; // In front of retina
                        } else if (eyeDefect === 'hypermetropia' && !hasCorrectionGlass) {
                          focusX = 525; // Behind retina
                        }

                        return (
                          <>
                            {/* Parallel incident rays from distant object */}
                            <line x1="50" y1="125" x2="280" y2="125" stroke="#38bdf8" strokeWidth="2.5" />
                            <line x1="50" y1="175" x2="280" y2="175" stroke="#38bdf8" strokeWidth="2.5" />

                            {/* Refracted rays converging to focusX */}
                            <line x1="280" y1="125" x2={focusX} y2="150" stroke="#38bdf8" strokeWidth="2.5" />
                            <line x1="280" y1="175" x2={focusX} y2="150" stroke="#38bdf8" strokeWidth="2.5" />

                            {/* Focus point circle */}
                            <circle cx={focusX} cy="150" r="5" fill="#ef4444" className="animate-ping" />
                            <circle cx={focusX} cy="150" r="4" fill="#ef4444" />
                            <text x={focusX - 20} y="135" fill="#ef4444" fontSize="11" fontWeight="bold">
                              ফোকাস বিন্দু
                            </text>
                          </>
                        );
                      })()}
                    </svg>

                    {/* Bottom Status Banner */}
                    <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur rounded-xl px-4 py-2 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold">
                        অবস্থা:{' '}
                        {eyeDefect === 'normal'
                          ? 'স্বাভাবিক দৃষ্টি (প্রতিবিম্ব ঠিক রেটিনায়)'
                          : eyeDefect === 'myopia'
                          ? hasCorrectionGlass
                            ? 'ক্ষীণদৃষ্টি সংশোধন সম্পন্ন (অবতল লেন্স আলো ছড়িয়ে রেটিনায় ফেলছে)'
                            : 'ক্ষীণদৃষ্টি (Myopia) - ফোকাস রেটিনার সামনে! দূরের লেখা অস্পষ্ট।'
                          : hasCorrectionGlass
                          ? 'দূরদৃষ্টি সংশোধন সম্পন্ন (উত্তল লেন্স আলো কেন্দ্রীভূত করে রেটিনায় ফেলছে)'
                          : 'দূরদৃষ্টি (Hypermetropia) - ফোকাস রেটিনার পেছনে! কাছের লেখা অস্পষ্ট।'}
                      </span>
                    </div>
                  </div>

                  {/* Defect Selector Pills */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setEyeDefect('normal');
                        setHasCorrectionGlass(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition ${
                        eyeDefect === 'normal'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs">স্বাভাবিক চোখ</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">রেটিনায় স্পষ্ট ফোকাস</div>
                    </button>
                    <button
                      onClick={() => setEyeDefect('myopia')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        eyeDefect === 'myopia'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs">ক্ষীণদৃষ্টি (Myopia)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">প্রতিকার: অবতল লেন্স (-D)</div>
                    </button>
                    <button
                      onClick={() => setEyeDefect('hypermetropia')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        eyeDefect === 'hypermetropia'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs">দূরদৃষ্টি (Hypermetropia)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">প্রতিকার: উত্তল লেন্স (+D)</div>
                    </button>
                  </div>
                </div>

                {/* Formula & Power Calculator (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      লেন্স সমীকরণ ও ক্ষমতা ক্যালকুলেটর
                    </span>

                    {/* Lens Type */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setCalcIsConvex(true)}
                        className={`p-2 rounded-xl border text-center transition font-semibold ${
                          calcIsConvex ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        উত্তল লেন্স (+P)
                      </button>
                      <button
                        onClick={() => setCalcIsConvex(false)}
                        className={`p-2 rounded-xl border text-center transition font-semibold ${
                          !calcIsConvex ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        অবতল লেন্স (-P)
                      </button>
                    </div>

                    {/* Focal Length Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">ফোকাস দূরত্ব (|f|):</span>
                        <span className="font-mono text-cyan-400 font-bold">{calcF} cm ({(calcF / 100).toFixed(2)} m)</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={calcF}
                        onChange={(e) => setCalcF(Number(e.target.value))}
                        className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Live Power Output */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="text-xs text-slate-400 font-mono">
                        <RenderMathText text="$P = \frac{1}{f\text{ (m)}} = \frac{100}{f\text{ (cm)}}$" />
                      </div>
                      <div className="text-base font-bold font-mono text-emerald-400">
                        P = {lab5PowerDioptre > 0 ? `+${lab5PowerDioptre.toFixed(2)}` : lab5PowerDioptre.toFixed(2)} D
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lab5PowerDioptre > 0
                          ? 'ধনাত্মক ক্ষমতা ➔ দূরদৃষ্টির চশমা'
                          : 'ঋণাত্মক ক্ষমতা ➔ ক্ষীণদৃষ্টির চশমা'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: SEE EXAMPLE (4 WORKED BOARD CQS WITH RUBRICS)                    */}
        {/* ======================================================================= */}
        {activeTab === 'example' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্নব্যাংক
                </span>
                <h2 className="text-xl font-bold text-slate-100">
                  অধ্যায় ০৯: আলোর প্রতিসরণ — সৃজনশীল সমাধান ও পরীক্ষকের গোপন রুব্রিক
                </h2>
              </div>
              <button
                onClick={() => setShowRubric(!showRubric)}
                className="px-4 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold rounded-xl hover:bg-amber-500/30 transition text-xs flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{showRubric ? 'রুব্রিক বন্ধ করুন' : 'পরীক্ষকের গোপন কথা (Marking Rubric)'}</span>
              </button>
            </div>

            {/* CQ Tab Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 1, title: 'পাঠ্যবই সৃজনশীল ১', subtitle: 'শিউলীর চশমার ক্ষমতা (-2D) ও প্রতিবিম্ব', tag: 'NCTB p.269' },
                { id: 2, title: 'পাঠ্যবই অনুশীলনী ১', subtitle: 'ক্রান্তি কোণ পরিবর্তন ও তরলের প্রতিসরণাঙ্ক', tag: 'NCTB p.267' },
                { id: 3, title: 'ঢাকা বোর্ড সৃজনশীল', subtitle: 'কাচ-পানি বিভেদতল ও সংকট কোণ ৬০°', tag: 'Dhaka Board' },
                { id: 4, title: 'রাজশাহী বোর্ড সৃজনশীল', subtitle: 'উত্তল লেন্সের বিবর্ধক কাচ প্রয়োগ', tag: 'Rajshahi Board' },
              ].map((cq) => (
                <button
                  key={cq.id}
                  onClick={() => setActiveCQ(cq.id)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    activeCQ === cq.id
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-200">{cq.title}</span>
                    <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
                      {cq.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{cq.subtitle}</p>
                </button>
              ))}
            </div>

            {/* CQ 1 Content */}
            {activeCQ === 1 && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                      উদ্দীপক (Stimulus - NCTB Page 269):
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      দশম শ্রেণির ছাত্রী শিউলী শ্রেণিকক্ষে ব্ল্যাকবোর্ডের লেখা ভালোভাবে দেখতে পায় না। ফলে ডাক্তারের শরণাপন্ন হলে ডাক্তার তাকে -২D ক্ষমতাসম্পন্ন লেন্স চশমা হিসেবে ব্যবহারের পরামর্শ দিলেন। শিউলীর বড়ভাই টগর তাকে সেই চশমাটির লেন্স থেকে ১ m দূরে অবস্থিত একটি বস্তুর ক্ষেত্রে রশ্মিচিত্র অঙ্কন করে দেখালো প্রতিবিম্ব কোথায় তৈরি হবে।
                    </p>
                  </div>

                  {/* Subquestion (c) */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-cyan-300">
                        (গ) শিউলির চশমার ফোকাস দূরত্ব নির্ণয় করো। [মান: ৩]
                      </span>
                      <span className="text-[11px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                        প্রয়োগমূলক
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                      <p className="text-slate-400 font-sans">
                        আমরা জানি লেন্সের ক্ষমতা P এবং ফোকাস দূরত্ব f (মিটার এককে) এর সম্পর্ক:
                      </p>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$P = \frac{1}{f} \implies f = \frac{1}{P}$" />
                      </div>
                      <p className="text-slate-400 font-sans">উদ্দীপক মতে, চশমার ক্ষমতা P = -2 D। অতএব:</p>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$f = \frac{1}{-2\text{ D}} = -0.5\text{ m} = -50\text{ cm}$" />
                      </div>
                      <p className="text-slate-300 font-sans">
                        অতএব, শিউলির চশমার ফোকাস দূরত্ব <strong>৫০ cm</strong> (ঋণাত্মক চিহ্ন নির্দেশ করে লেন্সটি অবতল)।
                      </p>
                    </div>
                  </div>

                  {/* Subquestion (d) */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-cyan-300">
                        (ঘ) উদ্দীপকে টগরের অঙ্কিত রশ্মিচিত্রটি এঁকে প্রতিবিম্বের অবস্থান ও প্রকৃতি বিশ্লেষণ করো। [মান: ৪]
                      </span>
                      <span className="text-[11px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800">
                        উচ্চতর দক্ষতা
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                      <p className="text-slate-400 font-sans">
                        দেওয়া আছে, বস্তুর দূরত্ব u = 1 m এবং ফোকাস দূরত্ব f = -0.5 m। লেন্স সমীকরণ অনুযায়ী:
                      </p>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$\frac{1}{u} + \frac{1}{v} = \frac{1}{f} \implies \frac{1}{v} = \frac{1}{f} - \frac{1}{u} = \frac{1}{-0.5} - \frac{1}{1} = -2 - 1 = -3\text{ m}^{-1}$" />
                      </div>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$v = -\frac{1}{3}\text{ m} \approx -0.333\text{ m} = -33.33\text{ cm}$" />
                      </div>
                      <p className="text-slate-300 font-sans">
                        রৈখিক বিবর্ধন: <RenderMathText text="$m = -\frac{v}{u} = -\frac{-0.333}{1} = +0.333$" />
                      </p>
                      <p className="text-slate-300 font-sans">
                        <strong>বিশ্লেষণ:</strong> প্রতিবিম্বটি লেন্সের সামনে বস্তুর দিকেই ৩৩.৩৩ cm দূরে গঠিত হবে। v-এর মান ঋণাত্মক এবং m ধনাত্মক হওয়ায় প্রতিবিম্বটি হবে <strong>অবাস্তব, সোজা ও খর্বিত</strong> (এক-তৃতীয়াংশ আকারের)।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 2 Content */}
            {activeCQ === 2 && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                      উদ্দীপক (Textbook Exercise Page 267):
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      একটি কাঁচের মাধ্যমে আলোক রশ্মি প্রবেশ করিয়ে বায়ুর সাপেক্ষে পূর্ণ অভ্যন্তরীণ প্রতিফলনের ক্রান্তি কোণ পাওয়া গেল ৬৫°। ঠিক যে বিন্দুতে আলোক রশ্মিটি আপতিত হয়েছে সেখানে এক বিন্দু তরল রাখার কারণে ক্রান্তি কোণ বৃদ্ধি পেয়ে ৭৫° হলো।
                    </p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-300 block border-b border-slate-800 pb-2">
                      গাণিতিক সমাধান: তরলের প্রতিসরণাঙ্ক (Refractive index of liquid) নির্ণয়
                    </span>
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                      <p className="text-slate-400 font-sans">
                        বায়ুর সাপেক্ষে কাঁচের ক্রান্তি কোণ <RenderMathText text="$\theta_{c1} = 65^\circ$" /> এবং বায়ুর প্রতিসরণাঙ্ক <RenderMathText text="$n_{\text{air}} = 1.0$" />।
                      </p>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$\sin \theta_{c1} = \frac{n_{\text{air}}}{n_{\text{glass}}} \implies n_{\text{glass}} = \frac{1}{\sin 65^\circ} = \frac{1}{0.9063} \approx 1.103$" />
                      </div>
                      <p className="text-slate-400 font-sans">
                        তরল ফোঁটা রাখার পর কাচ ও তরলের বিভেদতলে নতুন ক্রান্তি কোণ <RenderMathText text="$\theta_{c2} = 75^\circ$" />:
                      </p>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$\sin \theta_{c2} = \frac{n_{\text{liquid}}}{n_{\text{glass}}} \implies n_{\text{liquid}} = n_{\text{glass}} \times \sin 75^\circ$" />
                      </div>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$n_{\text{liquid}} = 1.103 \times 0.9659 \approx 1.066$" />
                      </div>
                      <p className="text-slate-300 font-sans">
                        অতএব, তরলটির প্রতিসরণাঙ্ক <strong>১.০৬৬</strong>।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 3 Content */}
            {activeCQ === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                      উদ্দীপক (Dhaka Board):
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      পানিতে আলোর বেগ ২.২৬ × ১০⁸ m/s এবং সাধারণ কাচে আলোর বেগ ২.০ × ১০⁸ m/s। শূন্য মাধ্যমে আলোর বেগ ৩.০ × ১০⁸ m/s। আলোকরশ্মি কাচ থেকে পানিতে ৬০° কোণে আপতিত হলো।
                    </p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-300 block border-b border-slate-800 pb-2">
                      (গ) কাচ ও পানির পরম প্রতিসরণাঙ্ক নির্ণয় করো।
                    </span>
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$n_{\text{water}} = \frac{c}{v_{\text{water}}} = \frac{3 \times 10^8}{2.26 \times 10^8} = 1.33, \quad n_{\text{glass}} = \frac{c}{v_{\text{glass}}} = \frac{3 \times 10^8}{2.0 \times 10^8} = 1.50$" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-300 block border-b border-slate-800 pb-2">
                      (ঘ) আলো কাচ থেকে পানিতে ৬০° কোণে আপতিত হলে পূর্ণ অভ্যন্তরীণ প্রতিফলন ঘটবে কি?
                    </span>
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                      <p className="text-slate-400 font-sans">কাচ-পানি বিভেদতলে ক্রান্তি কোণ θ_c:</p>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$\sin \theta_c = \frac{n_{\text{water}}}{n_{\text{glass}}} = \frac{1.33}{1.50} = 0.8867 \implies \theta_c = \sin^{-1}(0.8867) \approx 62.46^\circ$" />
                      </div>
                      <p className="text-slate-300 font-sans">
                        উদ্দীপকে আপতন কোণ θ = ৬০°। যেহেতু আপতন কোণ (৬০°) ক্রান্তি কোণের (৬২.৪৬°) চেয়ে <strong>ছোট</strong> (θ &lt; θ_c), তাই আলোকরশ্মির পূর্ণ অভ্যন্তরীণ প্রতিফলন <strong>ঘটবে না</strong>; আলো পানিতে প্রতিসরিত হবে।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 4 Content */}
            {activeCQ === 4 && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                      উদ্দীপক (Rajshahi Board):
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      একটি উত্তল লেন্সের ফোকাস দূরত্ব ১৫ cm। লেন্স থেকে ১০ cm দূরে একটি ২ cm দীর্ঘ লক্ষ্যবস্তু প্রধান অক্ষের ওপর খাড়াভাবে স্থাপন করা হলো।
                    </p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-cyan-300 block border-b border-slate-800 pb-2">
                      (গ) গঠিত প্রতিবিম্বের অবস্থান ও আকার নির্ণয় করো।
                    </span>
                    <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-mono">
                      <p className="text-slate-400 font-sans">দেওয়া আছে f = +15 cm, u = +10 cm, L = 2 cm।</p>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$\frac{1}{v} = \frac{1}{f} - \frac{1}{u} = \frac{1}{15} - \frac{1}{10} = \frac{2 - 3}{30} = -\frac{1}{30} \implies v = -30\text{ cm}$" />
                      </div>
                      <div className="bg-slate-900 p-3 rounded text-emerald-400">
                        <RenderMathText text="$m = -\frac{v}{u} = -\frac{-30}{10} = +3 \implies L' = |m| \times L = 3 \times 2 = 6\text{ cm}$" />
                      </div>
                      <p className="text-slate-300 font-sans">
                        প্রতিবিম্ব লেন্সের সামনে ৩০ cm দূরে গঠিত হবে এবং এর দৈর্ঘ্য হবে ৬ cm।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Examiner Rubric Drawer */}
            {showRubric && (
              <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-slate-100">
                      পরীক্ষকের গোপন কথা: পূর্ণ নম্বর পাওয়ার বোর্ড চেকলিস্ট (Examiner Rubric)
                    </h3>
                  </div>
                  <button onClick={() => setShowRubric(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-cyan-300 block">১. লেন্সের ক্ষমতার একক ও মিটার রূপান্তর</span>
                    <p className="text-slate-400 leading-relaxed">
                      P = ১/f সূত্রে f-কে অবশ্যই মিটারে নিতে হবে। ৫০ cm লিখলে ০.৫ m না বানিয়ে ১/৫০ বসালে পুরো অঙ্ক কাটা যাবে!
                    </p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-cyan-300 block">২. সংকট কোণের দিক নির্দেশনা</span>
                    <p className="text-slate-400 leading-relaxed">
                      সংকট কোণ বের করার সময় sin θ_c = n_হালকা / n_ঘন হবে। কখনোই লবে বড় সংখ্যা বসানো যাবে না, কারণ sin θ কখনো ১ এর বেশি হতে পারে না।
                    </p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-cyan-300 block">৩. রশ্মিচিত্রে তীরচিহ্ন বাধ্যতামূলক</span>
                    <p className="text-slate-400 leading-relaxed">
                      লেন্স বা প্রিজমের রশ্মিচিত্রে আলো যেদিকে যাচ্ছে সেদিকে তীরচিহ্ন না দিলে চিত্র আঁকা সত্ত্বেও বোর্ডে ০ নম্বর দেওয়া হয়।
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: TRY YOURSELF (3 INTERACTIVE CHALLENGES)                           */}
        {/* ======================================================================= */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                হ্যান্ডস-অন প্র্যাকটিস চ্যালেঞ্জ
              </span>
              <h2 className="text-xl font-bold text-slate-100 mb-1">
                নিজে চেষ্টা করো: বোর্ড স্ট্যান্ডার্ড গাণিতিক সমস্যা
              </h2>
              <p className="text-xs text-slate-400">
                সঠিক সংখ্যা ইনপুট দিয়ে নিজের অপটিক্যাল ধারণা ও সমীকরণের দক্ষতা যাচাই করো।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">চ্যালেঞ্জ ০১ • প্রতিসরণাঙ্ক</span>
                  <h3 className="text-sm font-bold text-slate-200">
                    পানিতে আলোর বেগ ২.২৬ × ১০⁸ m/s হলে পানির প্রতিসরণাঙ্ক n কত?
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    শূন্য মাধ্যমে আলোর বেগ ৩.০ × ১০⁸ m/s ধরে হিসাব করো (দুই দশমিক স্থান পর্যন্ত)।
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="যেমন: 1.33"
                      value={challenge1Input}
                      onChange={(e) => setChallenge1Input(e.target.value)}
                      className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs w-full text-slate-100 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(challenge1Input);
                        if (Math.abs(val - 1.33) < 0.02) {
                          setChallenge1Result('correct');
                        } else {
                          setChallenge1Result('wrong');
                        }
                      }}
                      className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400"
                    >
                      যাচাই
                    </button>
                  </div>
                  {challenge1Result === 'correct' && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>চমৎকার! n = c / v = 3 / 2.26 ≈ 1.33।</span>
                    </div>
                  )}
                  {challenge1Result === 'wrong' && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>ভুল হয়েছে। n = c/v সূত্রটি প্রয়োগ করো (উ: 1.33)।</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">চ্যালেঞ্জ ০২ • সংকট কোণ</span>
                  <h3 className="text-sm font-bold text-slate-200">
                    অপটিক্যাল ফাইবারে কোরের n = ১.৫০ এবং ক্ল্যাডের n = ১.৪৫ হলে সংকট কোণ θ_c কত ডিগ্রি?
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    sin θ_c = ১.৪৫ / ১.৫০ সূত্র ব্যবহার করো (পূর্ণ সংখ্যায় যেমন: 75)।
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="যেমন: 75"
                      value={challenge2Input}
                      onChange={(e) => setChallenge2Input(e.target.value)}
                      className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs w-full text-slate-100 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(challenge2Input);
                        if (Math.abs(val - 75) <= 1 || Math.abs(val - 75.2) <= 0.5) {
                          setChallenge2Result('correct');
                        } else {
                          setChallenge2Result('wrong');
                        }
                      }}
                      className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400"
                    >
                      যাচাই
                    </button>
                  </div>
                  {challenge2Result === 'correct' && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>সঠিক! θ_c = sin⁻¹(1.45/1.50) ≈ 75.2°।</span>
                    </div>
                  )}
                  {challenge2Result === 'wrong' && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>ভুল হয়েছে। sin⁻¹(1.45/1.50) হিসাব করো (উ: 75°)।</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 3 */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">চ্যালেঞ্জ ০৩ • লেন্সের ক্ষমতা</span>
                  <h3 className="text-sm font-bold text-slate-200">
                    চশমার উত্তল লেন্সের ফোকাস দূরত্ব +৫০ cm হলে লেন্সটির ক্ষমতা কত ডায়াপটার?
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    f = +50 cm = +0.5 m ধরে P = 1/f সূত্রে বসাও (যেমন: 2 বা +2)।
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="যেমন: 2"
                      value={challenge3Input}
                      onChange={(e) => setChallenge3Input(e.target.value)}
                      className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs w-full text-slate-100 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(challenge3Input);
                        if (Math.abs(val - 2) < 0.1) {
                          setChallenge3Result('correct');
                        } else {
                          setChallenge3Result('wrong');
                        }
                      }}
                      className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400"
                    >
                      যাচাই
                    </button>
                  </div>
                  {challenge3Result === 'correct' && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>একদম নির্ভুল! P = 1 / 0.5 = +2 D।</span>
                    </div>
                  )}
                  {challenge3Result === 'wrong' && (
                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>ভুল হয়েছে। 50 cm কে মিটারে নিয়ে P = 1/0.5 করো (উ: 2 D)।</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: CHECK UNDERSTANDING (5 BOARD-STANDARD MCQS)                       */}
        {/* ======================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                  স্বয়ংক্রিয় মূল্যায়ন
                </span>
                <h2 className="text-xl font-bold text-slate-100">
                  অধ্যায় ০৯: আলোর প্রতিসরণ — MCQ টেস্ট
                </h2>
              </div>
              <button
                onClick={() => {
                  setQuizSubmitted(true);
                }}
                className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition text-xs"
              >
                স্কোর দেখুন
              </button>
            </div>

            {/* MCQ List */}
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  question: 'ঘন মাধ্যম থেকে হালকা মাধ্যমে আলো প্রবেশের সময় আপতন কোণ সংকট কোণের সমান হলে প্রতিসরণ কোণ কত হয়?',
                  options: ['০°', '৪৫°', '৯০°', '১৮০°'],
                  correct: 2,
                  explanation: 'সংকট কোণে আলো আপতিত হলে প্রতিসরিত রশ্মি বিভেদতল ঘেঁষে চলে যায়, অর্থাৎ প্রতিসরণ কোণ ঠিক ৯০° হয়।',
                },
                {
                  id: 2,
                  question: 'অপটিক্যাল ফাইবার কেবলে আলোর কোন ভৌত ঘটনাটি ঘটে?',
                  options: ['বিক্ষিপ্ত প্রতিফলন', 'নিয়মিত প্রতিসরণ', 'পূর্ণ অভ্যন্তরীণ প্রতিফলন', 'আলোর ব্যতিচার'],
                  correct: 2,
                  explanation: 'অপটিক্যাল ফাইবারে কোরের প্রতিসরণাঙ্ক ক্ল্যাডিংয়ের চেয়ে বেশি হওয়ায় আলো বারবার পূর্ণ অভ্যন্তরীণ প্রতিফলনের মাধ্যমে এগিয়ে যায়।',
                },
                {
                  id: 3,
                  question: 'উত্তল লেন্সের ফোকাস দূরত্বের দ্বিগুণ দূরত্বে (u = 2f) বস্তু রাখলে প্রতিবিম্বের রৈখিক বিবর্ধন কত হয়?',
                  options: ['|m| < 1', '|m| = 1', '|m| > 1', '|m| = 0'],
                  correct: 1,
                  explanation: 'u = 2f অবস্থানে রাখলে প্রতিবিম্বও 2f অবস্থানে গঠিত হয় এবং এর আকার বস্তুর হুবহু সমান হয় (|m| = 1)।',
                },
                {
                  id: 4,
                  question: 'একটি লেন্সের ক্ষমতা -২.৫ D হলে এর ফোকাস দূরত্ব কত?',
                  options: ['-০.৪ m', '+০.৪ m', '-২.৫ m', '-৪০ m'],
                  correct: 0,
                  explanation: 'f = ১ / P = ১ / (-২.৫) = -০.৪ m = -৪০ cm।',
                },
                {
                  id: 5,
                  question: 'দূরদৃষ্টি বা দীর্ঘদৃষ্টি (Hypermetropia) ত্রুটি সংশোধন করতে কোন লেন্সের চশমা প্রয়োজন?',
                  options: ['অবতল লেন্স', 'উত্তল লেন্স', 'সিলিন্ড্রিক্যাল লেন্স', 'দ্বি-অবতল লেন্স'],
                  correct: 1,
                  explanation: 'দূরদৃষ্টিতে আলো রেটিনার পেছনে ফোকাস হয়। অতিরিক্ত অভিসারী ক্ষমতা যোগ করতে উত্তল লেন্স (+D) ব্যবহৃত হয়।',
                },
              ].map((q) => {
                const isSelected = quizAnswers[q.id] !== undefined;
                const isCorrect = quizAnswers[q.id] === q.correct;

                return (
                  <div key={q.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                        ০{q.id}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-200">{q.question}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isThisChosen = quizAnswers[q.id] === optIdx;
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800';

                        if (quizSubmitted) {
                          if (optIdx === q.correct) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          } else if (isThisChosen) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        } else if (isThisChosen) {
                          btnStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                              }
                            }}
                            className={`p-3 rounded-2xl border text-left text-xs transition ${btnStyle}`}
                          >
                            <span className="font-mono mr-2 text-slate-500">
                              {optIdx === 0 ? '(ক)' : optIdx === 1 ? '(খ)' : optIdx === 2 ? '(গ)' : '(ঘ)'}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                        <span className="font-bold text-amber-400">ব্যাখ্যা:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 5: SUMMARY & CHEAT SHEET                                            */}
        {/* ======================================================================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                  অধ্যায় সারসংক্ষেপ ও সূত্র ভাণ্ডার
                </span>
                <h2 className="text-xl font-bold text-slate-100">
                  অধ্যায় ০৯: আলোর প্রতিসরণ — একনজরে রিভিশন
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  পরীক্ষার আগের রাতের জন্য দ্রুত রিভিশন নোট ও শীর্ষ ফাঁদসমূহ।
                </p>
              </div>

              <button
                onClick={handleCopyNote}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition flex items-center gap-2"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'কপি হয়েছে!' : 'নোট কপি করুন'}</span>
              </button>
            </div>

            {/* Formula Bank */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                ১. মূল গাণিতিক সমীকরণসমূহ (Formula Bank)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">প্রতিসরণাঙ্ক ও স্নেলের সূত্র:</span>
                  <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                    <RenderMathText text="$n = \frac{c}{v}, \quad n_1 \sin \theta_1 = n_2 \sin \theta_2$" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    বায়ুর প্রতিসরণাঙ্ক ১.০০, পানির ১.৩৩, কাচের ১.৫২, হীরার ২.৪২।
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন:</span>
                  <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                    <RenderMathText text="$\sin \theta_c = \frac{n_1}{n_2} \implies \theta_c = \sin^{-1}\left(\frac{n_{\text{হালকা}}}{n_{\text{ঘন}}}\right)$" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    কাচ-বায়ুর সংকট কোণ ৪১.৮°, পানি-বায়ুর ৪৮.৮°, অপটিক্যাল ফাইবারের ৭৫.২°।
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">লেন্স সমীকরণ ও রৈখিক বিবর্ধন:</span>
                  <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                    <RenderMathText text="$\frac{1}{u} + \frac{1}{v} = \frac{1}{f}, \quad m = -\frac{v}{u} = \frac{L'}{L}$" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <RenderMathText text="উত্তল লেন্সে $f > 0$, অবতল লেন্সে $f < 0$। বাস্তব প্রতিবিম্বে $v > 0$, অবাস্তবে $v < 0$।" />
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">লেন্সের ক্ষমতা (Power of Lens):</span>
                  <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                    <RenderMathText text="$P = \frac{1}{f\text{ (m)}} = \frac{100}{f\text{ (cm)}}\text{ D}$" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    উত্তলে ক্ষমতা ধনাত্মক (+D), অবতলে ক্ষমতা ঋণাত্মক (-D)।
                  </p>
                </div>
              </div>
            </div>

            {/* Examiner Traps */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>২. বোর্ড পরীক্ষার শীর্ষ ৪টি মারাত্মক ফাঁদ (Examiner Traps)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-semibold text-rose-300">ফাঁদ ০১: লেন্সের ক্ষমতার সূত্রে f মিটারে না নেওয়া!</span>
                  <p className="text-slate-400">
                    <RenderMathText text="যদি উদ্দীপকে ফোকাস দূরত্ব $f = 25\text{ cm}$ দেওয়া থাকে, সূত্রে অবশ্যই $f = 0.25\text{ m}$ রূপান্তর করে $P = 1/0.25 = +4\text{ D}$ করতে হবে।" />
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-semibold text-rose-300">ফাঁদ ০২: অবতল লেন্সের f ও P-তে ঋণাত্মক চিহ্ন বাদ দেওয়া!</span>
                  <p className="text-slate-400">
                    অবতল লেন্স অপসারী হওয়ায় এর ফোকাস দূরত্ব ও ক্ষমতা উভয়ই ঋণাত্মক (-)। সূত্রে মাইনাস না দিলে গাণিতিক সমাধান ভুল হয়ে যাবে।
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-semibold text-rose-300">ফাঁদ ০৩: সংকট কোণের সূত্রে লব ও হর উল্টো করে ফেলা!</span>
                  <p className="text-slate-400">
                    <RenderMathText text="$\sin \theta_c = n_1 / n_2$ যেখানে $n_1 < n_2$। লবে সর্বদা হালকা মাধ্যমের প্রতিসরণাঙ্ক থাকবে। লবে বড় সংখ্যা বসালে ক্যালকুলেটরে Math Error আসবে!" />
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-semibold text-rose-300">ফাঁদ ০৪: ক্ষীণদৃষ্টি ও দূরদৃষ্টির চশমার লেন্স গুলিয়ে ফেলা!</span>
                  <p className="text-slate-400">
                    ক্ষীণদৃষ্টিতে (Myopia) আলো রেটিনার সামনে ফোকাস হয় ➔ আলো ছড়ানোর জন্য <strong>অবতল লেন্স (-D)</strong> দরকার। দূরদৃষ্টিতে (Hypermetropia) আলো রেটিনার পেছনে পড়ে ➔ আলো ঘনীভূত করার জন্য <strong>উত্তল লেন্স (+D)</strong> দরকার।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------------- */}
      {/* 3. SOCRATIC AI PHYSICS TUTOR DRAWER                                       */}
      {/* ------------------------------------------------------------------------- */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200">সক্রেটিক এআই পদার্থবিজ্ঞান টিউটর</h3>
            </div>
            <button onClick={() => setShowAiDrawer(false)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
            {aiChatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl ${
                  msg.role === 'ai'
                    ? 'bg-slate-950 border border-slate-800 text-slate-300'
                    : 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-100 ml-6'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Prompts & Input */}
          <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/80">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 block">দ্রুত প্রশ্ন প্রম্পটস:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'পূর্ণ অভ্যন্তরীণ প্রতিফলনের দুটি শর্ত কী?',
                  'অপটিক্যাল ফাইবার কীভাবে কাজ করে?',
                  'চশমার পাওয়ার প্লাস বা মাইনাস হওয়ার অর্থ কী?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendAi(prompt)}
                    className="text-[11px] px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 text-left transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="প্রতিসরণ ও লেন্স নিয়ে প্রশ্ন করো..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAi();
                }}
                className="bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-200 w-full focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleSendAi()}
                className="p-2 bg-cyan-500 text-slate-950 rounded-xl hover:bg-cyan-400 transition"
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
