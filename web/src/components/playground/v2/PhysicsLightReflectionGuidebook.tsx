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
  Car,
  Search,
  MessageSquare,
  ShieldCheck,
  XCircle,
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
    title: 'আলোর প্রকৃতি ও প্রতিফলনের সূত্র',
    subtitle: 'Nature of Light, Laws of Reflection & Plane Mirror',
    nctbPage: '২১০-২১৬',
    badge: 'মৌলিক সূত্র',
    intro:
      'আলো এক প্রকার তড়িৎ-চৌম্বকীয় তরঙ্গ যা শূন্য মাধ্যমে ৩×১০⁸ m/s বেগে চলে। প্রতিফলনের সূত্র অনুযায়ী আপতন কোণ ও প্রতিফলন কোণ সর্বদা সমান (∠i = ∠r)। সমতল দর্পণে বস্তুর দূরত্ব ও প্রতিবিম্বের দূরত্ব হুবহু সমান হয়।',
  },
  {
    id: 2,
    title: 'অবতল দর্পণ ও ৬-অবস্থান রে-ট্রেসিং',
    subtitle: 'Concave Mirror 6-Position Ray Tracing',
    nctbPage: '২১৭-২২৬',
    badge: 'বোর্ড সৃজনশীল হটস্পট',
    intro:
      'অবতল দর্পণ সমান্তরাল আলোকরশ্মিকে প্রধান ফোকাসে অভিসারী করে। প্রধান অক্ষের ওপর লক্ষ্যবস্তুর ৬টি ভিন্ন অবস্থানের জন্য প্রতিবিম্বের অবস্থান, আকৃতি ও প্রকৃতি নাটকীয়ভাবে পরিবর্তিত হয়।',
  },
  {
    id: 3,
    title: 'উত্তল দর্পণ ও গাড়ির রিয়ার ভিউ মিরর',
    subtitle: 'Convex Mirror & Wide Field of View',
    nctbPage: '২২৭-২৩১',
    badge: 'বাস্তব নিরাপত্তা প্রয়োগ',
    intro:
      'উত্তল দর্পণ সর্বদা লক্ষ্যবস্তুর চেয়ে ছোট, সোজা ও অবাস্তব প্রতিবিম্ব তৈরি করে। ফলে এটি পেছনের বিশাল এলাকাকে এক পলকে ড্রাইভারের চোখে দৃশ্যমান করে, যা নিরাপদ ড্রাইভিং নিশ্চিত করে।',
  },
  {
    id: 4,
    title: 'দর্পণ সমীকরণ ও রৈখিক বিবর্ধন',
    subtitle: 'Mirror Formula (1/u + 1/v = 1/f) & Magnification',
    nctbPage: '২৩১-২৩৩',
    badge: 'গাণিতিক সমাধান',
    intro:
      'গোলীয় দর্পণের সাধারণ সমীকরণ ১/u + ১/v = ১/f এবং রৈখিক বিবর্ধন m = -v/u। বাস্তব দূরত্বের জন্য ধনাত্মক এবং অবাস্তব দূরত্বের জন্য ঋণাত্মক চিহ্ন চিহ্নের সঠিক নিয়ম নির্ধারণ করে।',
  },
  {
    id: 5,
    title: 'পাহাড়ি বাঁকের আয়না ও অপটিক্যাল যন্ত্র',
    subtitle: 'Blind Curve Mirrors, Solar Cooker & Dentistry',
    nctbPage: '২৩৪-২৩৬',
    badge: 'ব্যবহারিক বিজ্ঞান',
    intro:
      'পাহাড়ি রাস্তার বিপজ্জনক সমকোণী বাঁকে ৪৫° কোণে আয়না স্থাপন, সৌরচুল্লিতে সূর্যের রশ্মি ফোকাসকরণ এবং ডেন্টিস্টদের দাঁত বড় করে দেখার জন্য অবতল আয়নার বাস্তব ব্যবহার।',
  },
];

export default function PhysicsLightReflectionGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'example' | 'practice' | 'quiz' | 'summary'>('learn');
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Lab 1: Laws of Reflection & Plane Mirror State
  const [incidentAngle, setIncidentAngle] = useState<number>(45);
  const [surfaceType, setSurfaceType] = useState<'smooth' | 'rough'>('smooth');
  const [planeObjectDistance, setPlaneObjectDistance] = useState<number>(30); // cm
  const [personHeight, setPersonHeight] = useState<number>(160); // cm

  // Lab 2: Concave Mirror Ray Tracing State
  const [focalLength, setFocalLength] = useState<number>(20); // cm
  const [objectDistance, setObjectDistance] = useState<number>(35); // cm
  const [objectHeight, setObjectHeight] = useState<number>(10); // cm

  // Lab 3: Convex Mirror State
  const [convexFocal, setConvexFocal] = useState<number>(20); // cm
  const [convexObjDist, setConvexObjDist] = useState<number>(40); // cm
  const [mirrorTypeCompare, setMirrorTypeCompare] = useState<'plane' | 'convex'>('convex');

  // Lab 4: Formula Solver State
  const [calcMirrorType, setCalcMirrorType] = useState<'concave' | 'convex'>('concave');
  const [calcF, setCalcF] = useState<number>(15);
  const [calcU, setCalcU] = useState<number>(25);

  // Lab 5: Real-world Applications
  const [selectedApp, setSelectedApp] = useState<'mountain' | 'dentist' | 'solar'>('mountain');
  const [mountainCarPos, setMountainCarPos] = useState<number>(50);

  // Step 2: CQs Accordion & Rubrics
  const [expandedCQ, setExpandedCQ] = useState<number[]>([1]);
  const [expandedRubric, setExpandedRubric] = useState<number[]>([1]);

  // Step 3: Interactive Practice Challenges
  const [ch1Input, setCh1Input] = useState<string>('');
  const [ch1Status, setCh1Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch2Input, setCh2Input] = useState<string>('');
  const [ch2Status, setCh2Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch3Input, setCh3Input] = useState<string>('');
  const [ch3Status, setCh3Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Step 4: MCQ Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // Socratic AI Tutor Drawer State
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: 'নমস্কার! আমি শেরাটউটর অপটিক্স সহকারী। আলোর প্রতিফলন, অবতল ও উত্তল দর্পণে প্রতিবিম্ব গঠন, রৈখিক বিবর্ধন কিংবা পাহাড়ি বাঁকের আয়না নিয়ে যেকোনো প্রশ্ন আমাকে নির্দ্বিধায় করতে পারো!',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES (PHYSICS ENGINES)
  // ---------------------------------------------------------------------------

  // Lab 2 Calculations: Concave Mirror
  // 1/v = 1/f - 1/u => v = (u * f) / (u - f)
  const concaveRadius = 2 * focalLength;
  let imageDist = 0;
  let magnification = 0;
  let imageType = 'বাস্তব ও উল্টো';
  let imagePositionText = '';
  let isVirtual = false;

  if (objectDistance === focalLength) {
    imageDist = Infinity;
    magnification = Infinity;
    imageType = 'অত্যন্ত বিবর্ধিত (অসীমে গঠিত)';
    imagePositionText = 'অসীমে (Infinity)';
  } else {
    imageDist = (objectDistance * focalLength) / (objectDistance - focalLength);
    magnification = -imageDist / objectDistance;
    isVirtual = imageDist < 0;

    if (isVirtual) {
      imageType = 'অবাস্তব ও সোজা';
      imagePositionText = `দর্পণের পেছনে ${Math.abs(imageDist).toFixed(1)} cm দূরে`;
    } else {
      imageType = 'বাস্তব ও উল্টো';
      imagePositionText = `দর্পণের সামনে ${imageDist.toFixed(1)} cm দূরে`;
    }
  }

  // Preset setter for Lab 2
  const applyPreset = (pos: number) => {
    switch (pos) {
      case 1: // Infinity / far away
        setObjectDistance(70);
        break;
      case 2: // Beyond C (u > 2f)
        setObjectDistance(50);
        break;
      case 3: // At C (u = 2f)
        setObjectDistance(2 * focalLength);
        break;
      case 4: // Between C and F (f < u < 2f)
        setObjectDistance(focalLength + 8);
        break;
      case 5: // At F (u = f)
        setObjectDistance(focalLength);
        break;
      case 6: // Inside F (u < f)
        setObjectDistance(Math.max(5, focalLength - 8));
        break;
    }
  };

  // Lab 3 Calculations: Convex Mirror (f is negative)
  // 1/v = 1/(-f) - 1/u => v = -(u * f) / (u + f)
  const convexImageDist = -(convexObjDist * convexFocal) / (convexObjDist + convexFocal);
  const convexMag = Math.abs(convexImageDist) / convexObjDist;

  // Lab 4 Calculations: Mirror Solver
  const solverF = calcMirrorType === 'concave' ? calcF : -calcF;
  const solverV = (calcU * solverF) / (calcU - solverF);
  const solverM = Math.abs(solverV / calcU);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const copySummaryNotes = () => {
    const notes = `[SheraTutor Physics Ch 8: Reflection of Light Revision Notes]
• প্রতিফলনের সূত্র: ∠i = ∠r (আপতন কোণ = প্রতিফলন কোণ)।
• সমতল দর্পণ: বস্তুর দূরত্ব = প্রতিবিম্বের দূরত্ব (u = v), সোজা ও অবাস্তব, বিবর্ধন m = 1।
• পূর্ণ প্রতিবিম্ব দেখতে দর্পণের ন্যূনতম উচ্চতা = ব্যক্তির উচ্চতার অর্ধেক (H/2)।
• গোলীয় দর্পণের ফোকাস দূরত্ব ও বক্রতার ব্যাসার্ধ: r = 2f বা f = r/2।
• সাধারণ দর্পণ সমীকরণ: 1/u + 1/v = 1/f।
• রৈখিক বিবর্ধন: m = -v/u = প্রতিবিম্বের উচ্চতা / বস্তুর উচ্চতা।
• অবতল দর্পণ: ফোকাসের ভেতরে বস্তু রাখলে অবাস্তব, সোজা ও বিবর্ধিত প্রতিবিম্ব (ডেন্টিস্ট মিরর)।
• উত্তল দর্পণ: সর্বদা অবাস্তব, সোজা ও খর্বিত প্রতিবিম্ব (গাড়ির রিয়ার ভিউ মিরর)।
• পাহাড়ি বাঁকের আয়না: ৪৫° কোণে স্থাপিত সমতল বা উত্তল আয়না অন্ধ বাঁক দেখতে সাহায্য করে।`;

    navigator.clipboard.writeText(notes);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleCQ = (id: number) => {
    setExpandedCQ((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleRubric = (id: number) => {
    setExpandedRubric((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const checkChallenge1 = () => {
    const val = parseFloat(ch1Input.trim());
    if (Math.abs(val - 20) < 0.1) setCh1Status('correct');
    else setCh1Status('wrong');
  };

  const checkChallenge2 = () => {
    const val = parseFloat(ch2Input.trim());
    if (Math.abs(val - 30) < 0.1) setCh2Status('correct');
    else setCh2Status('wrong');
  };

  const checkChallenge3 = () => {
    const val = parseFloat(ch3Input.trim());
    if (Math.abs(val - (-6)) < 0.2 || Math.abs(val - 6) < 0.2) setCh3Status('correct');
    else setCh3Status('wrong');
  };

  const handleSendTutor = () => {
    if (!inputQuestion.trim()) return;
    const userText = inputQuestion;
    setInputQuestion('');
    setTutorMessages((prev) => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      let reply = '';
      const q = userText.toLowerCase();
      if (q.includes('উত্তল') || q.includes('গাড়ি') || q.includes('ভিউ মিরর')) {
        reply =
          'উত্তল দর্পণ সর্বদা সোজা, অবাস্তব এবং আকারে ছোট (খর্বিত) প্রতিবিম্ব তৈরি করে। ফলে দর্পণে পেছনের একটি সুবিশাল দৃষ্টি ক্ষেত্র (Wide Field of View) দেখা যায়। সমতল দর্পণে এই সুবিধা পাওয়া যেত না!';
      } else if (q.includes('অবতল') || q.includes('ডেন্টিস্ট') || q.includes('শেভিং')) {
        reply =
          'অবতল দর্পণে লক্ষ্যবস্তুকে যদি তার প্রধান ফোকাস ও মেরুর মাঝে (u < f) রাখা হয়, তবে দর্পণের পেছনে একটি অত্যন্ত বিবর্ধিত ও সোজা প্রতিবিম্ব সৃষ্টি হয়। এই কারণে ডেন্টিস্টরা এবং শেভিং আয়নায় অবতল দর্পণ ব্যবহার করা হয়।';
      } else if (q.includes('বাঁক') || q.includes('পাহাড়')) {
        reply =
          'পাহাড়ি রাস্তায় সাধারণত ৯০° সমকোণী অন্ধ বাঁক থাকে যেখানে বিপরীত দিক থেকে আসা গাড়ি দেখা যায় না। বাঁকের মুখে ৪৫° কোণে বড় আয়না বসালে দুই পাশের চালকরা একে অপরকে দেখে নিরাপদে গাড়ি চালাতে পারেন।';
      } else if (q.includes('ফোকাস') || q.includes('ব্যাসার্ধ') || q.includes('r = 2f')) {
        reply =
          'গোলীয় দর্পণের বক্রতার ব্যাসার্ধ (r) এর ঠিক মধ্যবিন্দুতে প্রধান ফোকাস (F) অবস্থিত। অর্থাৎ r = 2f বা f = r/2। অবতল দর্পণে f ধনাত্মক এবং উত্তল দর্পণে f ঋণাত্মক ধরা হয়!';
      } else {
        reply =
          'চমৎকার প্রশ্ন! মনে রাখবে, আলোর প্রতিফলনে আপতন কোণ ও প্রতিফলন কোণ সর্বদা সমান থাকে। এছাড়া দর্পণ সমীকরণ ১/u + ১/v = ১/f দিয়ে যেকোনো প্রতিবিম্বের অবস্থান নিখুঁতভাবে বের করা সম্ভব।';
      }
      setTutorMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ------------------------------------------------------------------- */}
      {/* HEADER SECTION                                                      */}
      {/* ------------------------------------------------------------------- */}
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="physics"
        subjectNameBn="পদার্থবিজ্ঞান"
        chapterNum={8}
        chapterTitleBn="আলোর প্রতিফলন (Reflection of Light)"
        activeLesson={activeLesson}
        activeLessonTitle={LESSONS[activeLesson - 1]?.title}
        onOpenAi={() => setIsAiTutorOpen(!isAiTutorOpen)}
        aiButtonLabel="এআই টিউটর"
        centerContent={
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'learn'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>১. কনসেপ্ট</span>
            </button>
            <button
              onClick={() => setActiveTab('example')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'example'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>২. CQ</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'practice'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>৩. প্র্যাকটিস</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>৪. কুইজ</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'summary'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>৫. সামারি</span>
            </button>
          </div>
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTAINER WITH SIDEBAR & CONTENT AREA                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT LESSON NAVIGATION (Learn Mode Only) */}
        {activeTab === 'learn' && (
          <aside className="w-72 lg:w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  অধ্যায় সূচিপত্র (NCTB)
                </span>
                <span className="text-xs text-amber-400 font-mono">৫টি পূর্ণাঙ্গ পাঠ</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-2">
              {LESSONS.map((lesson) => {
                const isSelected = activeLesson === lesson.id && activeTab === 'learn';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(lesson.id);
                      setActiveTab('learn');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-md shadow-amber-950/40'
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-amber-400">পাঠ ০{['১', '২', '৩', '৪', '৫'][lesson.id - 1]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        পৃ. {lesson.nctbPage}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-200 leading-tight mb-1">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-1">{lesson.subtitle}</div>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>বোর্ড পরীক্ষায় অবতল দর্পণের রে-ট্রেসিং ও বিবর্ধন থেকে প্রতি বছর ১০ নম্বরের পূর্ণাঙ্গ CQ আসে।</span>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN INTERACTIVE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-950">
          {/* =============================================================== */}
          {/* STEP 1: LEARN CONCEPT & INTERACTIVE OPTICS LABS                  */}
          {/* =============================================================== */}
          {activeTab === 'learn' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* LESSON 1: LAWS OF REFLECTION & PLANE MIRROR */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        মৌলিক সূত্র ও জ্যামিতি
                      </span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ২১০-২১৬</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০১: আলোর প্রতিফলনের সূত্র ও সমতল দর্পণ ল্যাব (Laws of Reflection & Plane Mirror)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      আলোর প্রতিফলন মূলত দুটি সুনির্দিষ্ট নিয়ম মেনে চলে: আপতিত রশ্মি, প্রতিফলিত রশ্মি ও অভিলম্ব একই সমতলে থাকে, এবং আপতন কোণ ও প্রতিফলন কোণ পরস্পর সমান (∠i = ∠r)। সমতল দর্পণে লক্ষ্যবস্তু যত দূরে থাকে, তার অবাস্তব ও সোজা প্রতিবিম্ব দর্পণের ঠিক ততটাই পেছনে গঠিত হয়।
                    </p>
                  </div>

                  {/* LAB 1: REFLECTION ANGLE & SURFACE SIMULATOR */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Sun className="w-5 h-5 text-amber-400" />
                          <span>আপতন ও প্রতিফলন কোণ সিমুলেটর (∠i = ∠r)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          আপতন কোণ পরিবর্তন করে প্রতিফলন রশ্মি ও পৃষ্ঠতলের প্রভাব প্রত্যক্ষ করো
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setSurfaceType('smooth')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            surfaceType === 'smooth'
                              ? 'bg-amber-500 text-slate-950 font-semibold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          নিয়মিত প্রতিফলন (দর্পণ)
                        </button>
                        <button
                          onClick={() => setSurfaceType('rough')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            surfaceType === 'rough'
                              ? 'bg-amber-500 text-slate-950 font-semibold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          ব্যাপ্ত প্রতিফলন (অমসৃণ)
                        </button>
                      </div>
                    </div>

                    {/* Interactive Controls & Visual Arena */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">আপতন কোণ (∠i):</span>
                            <span className="font-mono text-amber-400 font-bold text-sm">
                              {incidentAngle}°
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="80"
                            step="1"
                            value={incidentAngle}
                            onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                            <span>০° (লম্ব আপতন)</span>
                            <span>৪৫°</span>
                            <span>৮০°</span>
                          </div>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">প্রতিফলন কোণ (∠r):</span>
                            <span className="font-mono text-emerald-400 font-bold">{incidentAngle}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">বিচ্যুতি কোণ (δ = ১৮০° - ২i):</span>
                            <span className="font-mono text-cyan-400 font-bold">{180 - 2 * incidentAngle}°</span>
                          </div>
                          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                            {incidentAngle === 0 ? (
                              <span className="text-amber-300">
                                💡 লম্বভাবে আপতিত আলোকরশ্মি ঠিক একই পথে উল্টো ফিরে আসে (∠i = ∠r = ০°)।
                              </span>
                            ) : (
                              <span>
                                ২য় সূত্র অনুযায়ী আপতন কোণ বৃদ্ধির সাথে সাথে প্রতিফলন কোণও সমানুপাতে বৃদ্ধি পায়।
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Canvas / Visual Arena for Ray Reflection */}
                      <div className="lg:col-span-2 h-64 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden p-4">
                        {/* Normal Line (অভিলম্ব) */}
                        <div className="absolute top-4 bottom-24 left-1/2 w-0.5 border-l-2 border-dashed border-slate-600 -translate-x-1/2 flex flex-col justify-start items-center">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1 rounded -translate-y-2">
                            অভিলম্ব (Normal)
                          </span>
                        </div>

                        {/* Mirror Surface */}
                        <div className="absolute bottom-20 left-6 right-6 h-3 bg-gradient-to-r from-slate-700 via-cyan-400 to-slate-700 rounded-sm shadow-lg flex items-center justify-center">
                          <div className="text-[9px] font-mono text-slate-950 font-bold">
                            {surfaceType === 'smooth' ? 'সমতল প্রতিফলক তল (Mirror)' : 'অমসৃণ পৃষ্ঠ (Rough Surface)'}
                          </div>
                        </div>

                        {/* Incident Ray SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {/* Center point is (cx, cy) */}
                          {(() => {
                            const cx = 330;
                            const cy = 176;
                            const length = 140;
                            const rad = (incidentAngle * Math.PI) / 180;
                            // Incident ray originates at left top
                            const ix = cx - length * Math.sin(rad);
                            const iy = cy - length * Math.cos(rad);
                            // Reflected ray goes to right top
                            const rx = cx + length * Math.sin(rad);
                            const ry = cy - length * Math.cos(rad);

                            return (
                              <>
                                {/* Incident Ray */}
                                <line
                                  x1={ix}
                                  y1={iy}
                                  x2={cx}
                                  y2={cy}
                                  stroke="#f59e0b"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                />
                                <circle cx={ix} cy={iy} r="4" fill="#f59e0b" />

                                {/* Incident Angle Arc */}
                                {incidentAngle > 5 && (
                                  <path
                                    d={`M ${cx} ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(rad)} ${cy - 40 * Math.cos(rad)}`}
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="1.5"
                                    strokeDasharray="2,2"
                                  />
                                )}

                                {/* Reflected Ray */}
                                {surfaceType === 'smooth' ? (
                                  <>
                                    <line
                                      x1={cx}
                                      y1={cy}
                                      x2={rx}
                                      y2={ry}
                                      stroke="#10b981"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                    />
                                    <circle cx={rx} cy={ry} r="4" fill="#10b981" />
                                    {/* Reflected Angle Arc */}
                                    {incidentAngle > 5 && (
                                      <path
                                        d={`M ${cx} ${cy - 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(rad)} ${cy - 40 * Math.cos(rad)}`}
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="1.5"
                                        strokeDasharray="2,2"
                                      />
                                    )}
                                  </>
                                ) : (
                                  /* Diffused Reflection Scattered Rays */
                                  <>
                                    <line x1={cx} y1={cy} x2={cx + 90} y2={cy - 120} stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                                    <line x1={cx} y1={cy} x2={cx + 130} y2={cy - 70} stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                                    <line x1={cx} y1={cy} x2={cx - 50} y2={cy - 130} stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </svg>

                        <div className="absolute bottom-4 left-6 text-xs font-mono text-amber-400">
                          আপতিত রশ্মি (Incident Ray)
                        </div>
                        <div className="absolute bottom-4 right-6 text-xs font-mono text-emerald-400">
                          প্রতিফলিত রশ্মি (Reflected Ray)
                        </div>
                      </div>
                    </div>

                    {/* PLANE MIRROR FULL IMAGE & HEIGHT RULE */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Eye className="w-4 h-4 text-cyan-400" />
                          <span>সমতল দর্পণে প্রতিবিম্ব ও পূর্ণ প্রতিবিম্বের নিয়ম (H/2)</span>
                        </h4>
                        <span className="text-xs font-mono text-cyan-400">
                          বস্তুর দূরত্ব (u) = প্রতিবিম্বের দূরত্ব (v)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-300">দর্পণ থেকে বস্তুর দূরত্ব (u):</span>
                              <span className="text-cyan-400 font-mono font-bold">{planeObjectDistance} cm</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="2"
                              value={planeObjectDistance}
                              onChange={(e) => setPlaneObjectDistance(parseInt(e.target.value))}
                              className="w-full accent-cyan-500 cursor-pointer"
                            />
                          </div>

                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-300">ব্যক্তির উচ্চতা (H):</span>
                              <span className="text-amber-400 font-mono font-bold">{personHeight} cm</span>
                            </div>
                            <input
                              type="range"
                              min="120"
                              max="200"
                              step="2"
                              value={personHeight}
                              onChange={(e) => setPersonHeight(parseInt(e.target.value))}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-center space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">প্রতিবিম্বের দূরত্ব (v):</span>
                            <span className="font-mono text-emerald-400 font-bold">{planeObjectDistance} cm (দর্পণের পেছনে)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">বস্তু ও প্রতিবিম্বের ব্যবধান:</span>
                            <span className="font-mono text-cyan-400 font-bold">{planeObjectDistance * 2} cm</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800 pt-2">
                            <span className="text-amber-300 font-semibold">পূর্ণ প্রতিবিম্ব দেখতে ন্যূনতম দর্পণ:</span>
                            <span className="font-mono text-amber-400 font-bold text-sm">
                              {personHeight / 2} cm (H/২)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            বোর্ড ট্রিক: নিজের পুরো শরীর দেখতে ব্যক্তির উচ্চতার ঠিক অর্ধেক দৈর্ঘ্যের আয়না প্রয়োজন, দূরত্ব কম-বেশি করলে এই প্রয়োজনীয়তার কোনো পরিবর্তন হয় না!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 2: CONCAVE MIRROR 6-POSITION RAY TRACING */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        বোর্ড সৃজনশীল প্রধান টপিক
                      </span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ২১৭-২২৬</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০২: অবতল দর্পণ ও ৬-অবস্থান রে-ট্রেসিং (Concave Mirror Ray Tracing)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      অবতল দর্পণে প্রতিফলনের পর প্রধান অক্ষের সমান্তরাল রশ্মি ফোকাস (F) দিয়ে যায় এবং বক্রতার কেন্দ্র (C) দিয়ে যাওয়া রশ্মি একই পথে উল্টো ফিরে আসে। লক্ষ্যবস্তু অসীম থেকে মেরুর দিকে এগোতে থাকলে প্রতিবিম্ব ফোকাস থেকে দূরে সরতে থাকে এবং বক্রতার কেন্দ্র ছাড়িয়ে যাওয়ার পর উল্টো থেকে সোজা (অবাস্তব) রূপ ধারণ করে।
                    </p>
                  </div>

                  {/* LAB 2: CONCAVE MIRROR SIMULATOR */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    {/* Position Presets Header */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        ৬টি আদর্শ বোর্ড অবস্থান প্রিসেটস:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        <button
                          onClick={() => applyPreset(1)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                            objectDistance >= 65
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          ১. অসীমে
                        </button>
                        <button
                          onClick={() => applyPreset(2)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                            objectDistance > 2 * focalLength && objectDistance < 65
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          ২. C এর বাইরে
                        </button>
                        <button
                          onClick={() => applyPreset(3)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                            objectDistance === 2 * focalLength
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          ৩. ঠিক C তে (u=2f)
                        </button>
                        <button
                          onClick={() => applyPreset(4)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                            objectDistance > focalLength && objectDistance < 2 * focalLength
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          ৪. C ও F মাঝে
                        </button>
                        <button
                          onClick={() => applyPreset(5)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                            objectDistance === focalLength
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          ৫. ঠিক F তে (u=f)
                        </button>
                        <button
                          onClick={() => applyPreset(6)}
                          className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                            objectDistance < focalLength
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          ৬. ফোকাসের ভেতরে
                        </button>
                      </div>
                    </div>

                    {/* Sliders Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300">ফোকাস দূরত্ব (f):</span>
                          <span className="font-mono text-amber-400 font-bold">{focalLength} cm</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="30"
                          step="1"
                          value={focalLength}
                          onChange={(e) => setFocalLength(parseInt(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>১০ cm</span>
                          <span>বক্রতার ব্যাসার্ধ r = {concaveRadius} cm</span>
                          <span>৩০ cm</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300">লক্ষ্যবস্তুর দূরত্ব (u):</span>
                          <span className="font-mono text-cyan-400 font-bold">{objectDistance} cm</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="70"
                          step="1"
                          value={objectDistance}
                          onChange={(e) => setObjectDistance(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>৫ cm (ফোকাসের ভেতরে)</span>
                          <span>{focalLength} cm (F)</span>
                          <span>{concaveRadius} cm (C)</span>
                          <span>৭০ cm</span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Ray-Tracing Canvas */}
                    <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden p-4">
                      {/* Principal Axis (প্রধান অক্ষ) */}
                      <div className="absolute left-4 right-16 top-1/2 h-0.5 bg-slate-700 -translate-y-1/2" />

                      {/* Mirror Arc (Concave Mirror at right) */}
                      <svg className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-48 pointer-events-none">
                        <path
                          d="M 10 10 A 120 120 0 0 0 10 180"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        {/* Mirror Hatch Marks */}
                        <line x1="12" y1="20" x2="22" y2="15" stroke="#64748b" strokeWidth="2" />
                        <line x1="12" y1="50" x2="22" y2="45" stroke="#64748b" strokeWidth="2" />
                        <line x1="12" y1="80" x2="22" y2="75" stroke="#64748b" strokeWidth="2" />
                        <line x1="12" y1="110" x2="22" y2="105" stroke="#64748b" strokeWidth="2" />
                        <line x1="12" y1="140" x2="22" y2="135" stroke="#64748b" strokeWidth="2" />
                        <line x1="12" y1="170" x2="22" y2="165" stroke="#64748b" strokeWidth="2" />
                      </svg>

                      {/* Landmarks on Principal Axis: Pole, F, C */}
                      {/* Mirror Pole is at right ≈ 88% */}
                      <div className="absolute right-14 top-1/2 translate-y-2 text-[10px] font-mono text-cyan-400 font-bold">
                        P (মেরু)
                      </div>

                      {/* Focus F */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ right: `${14 + focalLength * 0.9}%` }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md" />
                        <span className="text-[10px] font-mono text-amber-400 font-bold mt-1">F</span>
                      </div>

                      {/* Center of Curvature C */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ right: `${14 + concaveRadius * 0.9}%` }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-md" />
                        <span className="text-[10px] font-mono text-purple-400 font-bold mt-1">C</span>
                      </div>

                      {/* Object (Arrow) */}
                      <div
                        className="absolute bottom-1/2 flex flex-col items-center z-10 transition-all duration-200"
                        style={{ right: `${14 + objectDistance * 0.9}%` }}
                      >
                        <span className="text-[9px] font-mono text-cyan-300 font-bold mb-0.5">বস্তু</span>
                        <div className="w-1.5 h-16 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t relative">
                          <div className="absolute -top-2 -left-1 border-solid border-b-cyan-300 border-b-8 border-x-transparent border-x-4 border-t-0" />
                        </div>
                      </div>

                      {/* Image (Arrow) */}
                      {objectDistance !== focalLength && (
                        <div
                          className={`absolute flex flex-col items-center z-10 transition-all duration-200 ${
                            isVirtual ? 'bottom-1/2' : 'top-1/2'
                          }`}
                          style={{
                            right: isVirtual ? `${14 - Math.abs(imageDist) * 0.5}%` : `${14 + imageDist * 0.9}%`,
                          }}
                        >
                          {isVirtual ? (
                            <>
                              <span className="text-[9px] font-mono text-emerald-300 font-bold mb-0.5">প্রতিবিম্ব (সোজা)</span>
                              <div
                                className="w-1.5 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t relative border border-dashed border-emerald-400"
                                style={{ height: `${Math.min(100, Math.max(20, Math.abs(magnification) * 16))}px` }}
                              />
                            </>
                          ) : (
                            <>
                              <div
                                className="w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-300 rounded-b relative"
                                style={{ height: `${Math.min(100, Math.max(15, Math.abs(magnification) * 16))}px` }}
                              />
                              <span className="text-[9px] font-mono text-emerald-300 font-bold mt-0.5">প্রতিবিম্ব (উল্টো)</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Calculated Output Metrics Card */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[11px]">প্রতিবিম্বের দূরত্ব (v):</span>
                        <span className="text-emerald-400 font-bold text-sm">
                          {objectDistance === focalLength ? 'অসীম (∞)' : `${Math.abs(imageDist).toFixed(1)} cm`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">রৈখিক বিবর্ধন (|m|):</span>
                        <span className="text-amber-400 font-bold text-sm">
                          {objectDistance === focalLength ? 'অসীম' : Math.abs(magnification).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">প্রকৃতি:</span>
                        <span className="text-cyan-400 font-bold text-sm">{imageType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">অবস্থান:</span>
                        <span className="text-purple-400 font-bold text-sm truncate">{imagePositionText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 3: CONVEX MIRROR & WIDE FIELD OF VIEW */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        নিরাপত্তা ও ব্যবহারিক অ্যাপ্লিকেশন
                      </span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ২২৭-২৩১</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০৩: উত্তল দর্পণ ও গাড়ির রিয়ার ভিউ মিরর (Convex Mirror & Wide Field of View)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      উত্তল দর্পণ সর্বদা লক্ষ্যবস্তুর চেয়ে ছোট, সোজা ও অবাস্তব প্রতিবিম্ব তৈরি করে। গোলীয় তল বাইরের দিকে বাঁকা থাকায় এটি চারিদিকের আলোকরশ্মিকে অপসারী করে একটি সুবিশাল দৃষ্টি ক্ষেত্র (Field of View) উপহার দেয়। এই কারণেই গাড়ির লুকিং গ্লাসে সমতল আয়নার বদলে উত্তল আয়না ব্যবহৃত হয়।
                    </p>
                  </div>

                  {/* LAB 3: CONVEX SIMULATOR & FOV COMPARISON */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">উত্তল দর্পণের ফোকাস দূরত্ব (|f|):</span>
                            <span className="font-mono text-amber-400 font-bold">{convexFocal} cm (f = -{convexFocal} cm)</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="40"
                            step="2"
                            value={convexFocal}
                            onChange={(e) => setConvexFocal(parseInt(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer"
                          />
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">গাড়ি/বস্তুর দূরত্ব (u):</span>
                            <span className="font-mono text-cyan-400 font-bold">{convexObjDist} cm</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="80"
                            step="2"
                            value={convexObjDist}
                            onChange={(e) => setConvexObjDist(parseInt(e.target.value))}
                            className="w-full accent-cyan-500 cursor-pointer"
                          />
                        </div>

                        {/* Metrics Table */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400">প্রতিবিম্বের অবস্থান (v):</span>
                            <span className="text-emerald-400 font-bold">
                              দর্পণের পেছনে {Math.abs(convexImageDist).toFixed(1)} cm দূরে
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">বিবর্ধন (|m|):</span>
                            <span className="text-amber-400 font-bold">{convexMag.toFixed(2)} (খর্বিত)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">প্রকৃতি:</span>
                            <span className="text-cyan-400 font-bold">সর্বদা অবাস্তব ও সোজা (Virtual & Erect)</span>
                          </div>
                        </div>
                      </div>

                      {/* Field of View Visualizer */}
                      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Car className="w-4 h-4 text-amber-400" />
                            <span>দৃষ্টি ক্ষেত্র (Field of View) তুলনা</span>
                          </span>
                          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                            <button
                              onClick={() => setMirrorTypeCompare('convex')}
                              className={`px-2.5 py-1 text-[11px] rounded transition ${
                                mirrorTypeCompare === 'convex' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                              }`}
                            >
                              উত্তল দর্পণ
                            </button>
                            <button
                              onClick={() => setMirrorTypeCompare('plane')}
                              className={`px-2.5 py-1 text-[11px] rounded transition ${
                                mirrorTypeCompare === 'plane' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                              }`}
                            >
                              সমতল দর্পণ
                            </button>
                          </div>
                        </div>

                        {/* FOV Diagram */}
                        <div className="h-44 w-full bg-slate-900/60 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden p-3">
                          {/* Eye / Observer at bottom */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <Eye className="w-5 h-5 text-cyan-400" />
                            <span className="text-[9px] font-mono text-slate-400">চালক (Driver)</span>
                          </div>

                          {/* Mirror representation */}
                          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-2 bg-slate-400 rounded-full" />

                          {/* Light cone showing vision angle */}
                          {mirrorTypeCompare === 'convex' ? (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-56 h-24 border-b-2 border-dashed border-amber-400/80 bg-amber-500/10 rounded-t-full flex items-center justify-center">
                              <span className="text-xs font-bold text-amber-300 font-mono">
                                সুবিশাল দৃষ্টি ক্ষেত্র (~১২০°)
                              </span>
                            </div>
                          ) : (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 border-b-2 border-dashed border-cyan-400/80 bg-cyan-500/10 rounded-t-full flex items-center justify-center">
                              <span className="text-xs font-bold text-cyan-300 font-mono">
                                সীমিত দৃষ্টি ক্ষেত্র (~৪৫°)
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {mirrorTypeCompare === 'convex' ? (
                            <span className="text-amber-300">
                              ✅ উত্তল দর্পণে পেছনের ৩টি লেন ও একাধিক গাড়ি একসাথে দেখা যায়, যা লেন পরিবর্তনকে ঝুঁকিমুক্ত করে।
                            </span>
                          ) : (
                            <span className="text-rose-300">
                              ⚠️ সমতল দর্পণে শুধু পেছনের একটি গাড়িই পুরো দর্পণ জুড়ে দেখা যায়, ফলে ব্লাইন্ড স্পট তৈরি হয়।
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 4: MIRROR EQUATION & MAGNIFICATION SOLVER */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        গাণিতিক সমাধান ল্যাব
                      </span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ২৩১-২৩৩</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০৪: দর্পণ সমীকরণ ও রৈখিক বিবর্ধন ল্যাব (1/u + 1/v = 1/f)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      যেকোনো গোলীয় দর্পণে প্রতিবিম্বের অবস্থান নির্ধারণের সর্বজনীন সমীকরণ হলো ১/u + ১/v = ১/f। চিহ্নের নিয়ম অনুসারে: অবতল দর্পণে f ধনাত্মক এবং উত্তল দর্পণে f ঋণাত্মক। বাস্তব প্রতিবিম্বের ক্ষেত্রে v ধনাত্মক কিন্তু অবাস্তব প্রতিবিম্বের ক্ষেত্রে v ঋণাত্মক।
                    </p>
                  </div>

                  {/* LAB 4: FORMULA SOLVER */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-amber-400" />
                        <span>ইন্টারেক্টিভ সমীকরণ সমাধানকারী (Equation Solver)</span>
                      </h3>

                      <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setCalcMirrorType('concave')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            calcMirrorType === 'concave' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          অবতল দর্পণ (f &gt; ০)
                        </button>
                        <button
                          onClick={() => setCalcMirrorType('convex')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            calcMirrorType === 'convex' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                          }`}
                        >
                          উত্তল দর্পণ (f &lt; ০)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="space-y-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">ফোকাস দূরত্বের মান (|f|):</span>
                            <span className="font-mono text-amber-400 font-bold">{calcF} cm</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={calcF}
                            onChange={(e) => setCalcF(parseInt(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer"
                          />
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">লক্ষ্যবস্তুর দূরত্ব (u):</span>
                            <span className="font-mono text-cyan-400 font-bold">{calcU} cm</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="60"
                            step="1"
                            value={calcU}
                            onChange={(e) => setCalcU(parseInt(e.target.value))}
                            className="w-full accent-cyan-500 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Solver Step-by-Step Box */}
                      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs leading-relaxed">
                        <div className="font-mono text-cyan-400 border-b border-slate-800 pb-2 flex justify-between">
                          <span>সূত্র: ১/v = ১/f - ১/u</span>
                          <span className="text-slate-400">f = {solverF} cm</span>
                        </div>

                        <div className="space-y-1 font-mono text-slate-300">
                          <div>
                            ১/v = ১/({solverF}) - ১/({calcU})
                          </div>
                          <div>
                            ১/v = ({calcU} - {solverF}) / ({solverF} × {calcU})
                          </div>
                          <div className="text-emerald-400 font-bold text-sm pt-1">
                            v = {solverV.toFixed(2)} cm {solverV < 0 ? '(দর্পণের পেছনে)' : '(দর্পণের সামনে)'}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-mono">
                          <span className="text-slate-400">রৈখিক বিবর্ধন (|m| = |v/u|):</span>
                          <span className="text-amber-400 font-bold text-base">{solverM.toFixed(2)} গুণ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 5: REAL WORLD OPTICAL DEVICES & MOUNTAIN CURVE */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        দৈনন্দিন জীবন ও প্রযুক্তি
                      </span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ২৩৪-২৩৬</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০৫: পাহাড়ি বাঁকের আয়না ও অপটিক্যাল ডিভাইস (Real-world Optics)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      আলোর প্রতিফলনের ধর্ম কাজে লাগিয়ে অসংখ্য জীবনরক্ষাকারী ও বৈজ্ঞানিক যন্ত্রপাতি তৈরি করা হয়েছে—যার মধ্যে পাহাড়ি রাস্তার ব্লাইন্ড কার্ভ মিরর, ডেন্টিস্টদের অবতল আয়না, সৌরচুল্লি এবং সার্চলাইট প্রধান।
                    </p>
                  </div>

                  {/* LAB 5: APPLICATION SHOWCASE */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
                      <button
                        onClick={() => setSelectedApp('mountain')}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
                          selectedApp === 'mountain'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <Car className="w-4 h-4" />
                        <span>১. পাহাড়ি রাস্তার সমকোণী বাঁক</span>
                      </button>

                      <button
                        onClick={() => setSelectedApp('dentist')}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
                          selectedApp === 'dentist'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <Search className="w-4 h-4" />
                        <span>২. ডেন্টিস্টের অবতল আয়না</span>
                      </button>

                      <button
                        onClick={() => setSelectedApp('solar')}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
                          selectedApp === 'solar'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-850'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span>৩. সৌরচুল্লি ও সার্চলাইট</span>
                      </button>
                    </div>

                    {/* App 1: Mountain Curve */}
                    {selectedApp === 'mountain' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <div className="space-y-4">
                          <h4 className="text-base font-bold text-white">
                            পাহাড়ি রাস্তার অদৃশ্য বাঁকে ৪৫° কোণে আয়না
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            পাহাড়ি রাস্তায় সমকোণে (৯০°) বাঁক নেওয়ার সময় এক পাশের গভীর খাদ বা পাহাড়ের কারণে বিপরীত দিক থেকে কী আসছে তা দেখা যায় না। বাঁকের মাথায় ৪৫° কোণে বড় আকারের সমতল বা উত্তল আয়না বসালে রাস্তার দুই পাশের গাড়ি একে অপরকে পরিষ্কার দেখতে পায়।
                          </p>

                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-300">গাড়ি 'ক' এর অবস্থান:</span>
                              <span className="font-mono text-amber-400 font-bold">{mountainCarPos}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="90"
                              value={mountainCarPos}
                              onChange={(e) => setMountainCarPos(parseInt(e.target.value))}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Top-down 90 degree Road Canvas */}
                        <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden p-4">
                          {/* Mountain Wall (Obstacle) in top-left */}
                          <div className="absolute top-0 left-0 w-32 h-32 bg-slate-800 border-r-2 border-b-2 border-slate-700 flex items-center justify-center">
                            <span className="text-[10px] font-mono text-slate-400">উঁচু পাহাড় (দৃষ্টি প্রতিবন্ধক)</span>
                          </div>

                          {/* 45 degree Mirror at intersection */}
                          <div className="absolute top-32 left-32 w-12 h-1 bg-amber-400 rotate-45 shadow-lg shadow-amber-500/50 flex items-center justify-center">
                            <span className="text-[8px] font-mono text-slate-950 font-bold -translate-y-2.5">
                              ৪৫° আয়না
                            </span>
                          </div>

                          {/* Car 1 traveling up */}
                          <div
                            className="absolute left-36 w-6 h-8 bg-cyan-500 rounded flex items-center justify-center text-[10px] text-slate-950 font-bold transition-all"
                            style={{ bottom: `${100 - mountainCarPos}%` }}
                          >
                            🚗 ক
                          </div>

                          {/* Car 2 traveling left from right */}
                          <div className="absolute top-36 right-8 w-8 h-6 bg-rose-500 rounded flex items-center justify-center text-[10px] text-white font-bold">
                            🚙 খ
                          </div>

                          {/* Reflected sightlines */}
                          <div className="absolute top-28 right-16 text-[10px] font-mono text-emerald-400">
                            দৃষ্টিরেখা আয়নায় প্রতিফলিত হয়ে খ-কে দেখতে পাচ্ছে!
                          </div>
                        </div>
                      </div>
                    )}

                    {/* App 2: Dentist Mirror */}
                    {selectedApp === 'dentist' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                          <h4 className="text-base font-bold text-white">
                            ডেন্টিস্টের অবতল আয়না (Dentist's Concave Mirror)
                          </h4>
                          <p>
                            ডাক্তার বা ডেন্টিস্টরা দাঁতের ভেতরের ক্ষুদ্রাতিক্ষুদ্র অংশ পরীক্ষা করার জন্য ছোট একটি অবতল আয়না ব্যবহার করেন।
                          </p>
                          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300">
                            <strong>পদার্থবিজ্ঞানের নীতি:</strong> যখন দাঁতটি অবতল আয়নার ফোকাস দূরত্বের ভেতরে (u &lt; f) থাকে, তখন দর্পণের ভেতরে একটি সোজা ও অত্যন্ত বিবর্ধিত অবাস্তব প্রতিবিম্ব গঠিত হয়।
                          </div>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                          <div className="w-20 h-20 rounded-full border-4 border-cyan-400 bg-slate-900 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
                            🦷
                          </div>
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            সোজা ও বিবর্ধিত প্রতিবিম্ব (u &lt; f)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* App 3: Solar Cooker */}
                    {selectedApp === 'solar' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                          <h4 className="text-base font-bold text-white">
                            সৌরচুল্লি ও সমান্তরাল সার্চলাইট (Solar Cooker & Searchlight)
                          </h4>
                          <p>
                            অবতল দর্পণ সমান্তরাল আলোকরশ্মিকে তার প্রধান ফোকাসে কেন্দ্রীভূত করে। সৌরচুল্লিতে একটি বিশাল অবতল দর্পণ বসিয়ে তার প্রধান ফোকাসে রান্নার পাত্র রাখলে সেখানে সূর্যের সব তাপ পুঞ্জীভূত হয়ে নিমিষেই খাদ্য রান্না হয়।
                          </p>
                          <p>
                            বিপরীতভাবে, গাড়ির হেডলাইট বা সার্চলাইটের ক্ষেত্রে বাতিকে প্রধান ফোকাসে রাখলে প্রতিফলনের পর আলোকরশ্মি সমান্তরাল হয়ে বহুদূর পর্যন্ত যায়।
                          </p>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                          <Sun className="w-16 h-16 text-amber-400 animate-pulse" />
                          <span className="text-xs font-mono text-amber-300 font-bold">
                            ফোকাস বিন্দুতে তাপমাত্রা &gt; ২০০°C
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 2: SEE EXAMPLE (BOARD CQS WITH EXAMINER RUBRICS)            */}
          {/* =============================================================== */}
          {activeTab === 'example' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন ও গোপন মূল্যায়ন রুব্রিক
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">
                  বোর্ড স্ট্যান্ডার্ড ৪টি সমাধানকৃত সৃজনশীল প্রশ্ন (CQs)
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  এনসিটিবি পাঠ্যবই এবং ঢাকা ও রাজশাহী শিক্ষা বোর্ডের বিগত বছরের গাণিতিক সমস্যাগুলোর পুঙ্খানুপুঙ্খ ধাপভিত্তিক সমাধান এবং পরীক্ষকের গোপন নম্বর বণ্টন নির্দেশিকা।
                </p>
              </div>

              {/* CQ 1: Textbook CQ 3 (Page 240) - Concave Mirror & Pin Magnification */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      পাঠ্যবই সৃজনশীল ০৩ (পৃষ্ঠা ২৪০)
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      অবতল দর্পণে কাঠির বিবর্ধন ও প্রতিবিম্ব বিশ্লেষণ
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(1)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(1) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> একদল শিক্ষার্থী ব্যবহারিক ক্লাসে একটি পরীক্ষণের প্রথম পর্যায়ে একটি অবতল দর্পণের সামনে ২ cm দৈর্ঘ্যের একটি কাঠি রাখায় পর্দায় এর ৩.৫১ গুণ বড় প্রতিবিম্ব দেখতে পেল। পরীক্ষণের দ্বিতীয় পর্যায়ে পর্দায় এর ৬ গুণ বড় প্রতিবিম্ব দেখতে পেল।
                </div>

                {expandedCQ.includes(1) && (
                  <div className="space-y-4 pt-2 text-xs">
                    {/* Part G */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-amber-300">
                        (গ) পরীক্ষণের প্রথম পর্যায়ে কাঠিটির প্রতিবিম্বের দৈর্ঘ্য ও প্রকৃতি নির্ণয় করো। [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>দেওয়া আছে, লক্ষ্যবস্তুর দৈর্ঘ্য L = ২ cm এবং রৈখিক বিবর্ধন m₁ = ৩.৫১।</p>
                        <p>আমরা জানি, রৈখিক বিবর্ধন m = L′ / L, যেখানে L′ হলো প্রতিবিম্বের দৈর্ঘ্য।</p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$L' = m_1 \times L = 3.51 \times 2\text{ cm} = 7.02\text{ cm} \quad \text{(উত্তর)}$$" />
                        </div>
                        <p>
                          <strong>প্রকৃতি:</strong> যেহেতু প্রতিবিম্বটি 'পর্দায়' ধরা পড়েছে, তাই এটি নিশ্চিতভাবেই <strong>বাস্তব ও উল্টো (Real and Inverted)</strong>।
                        </p>
                      </div>
                    </div>

                    {/* Part Gh */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-amber-300">
                        (ঘ) পরীক্ষণের দ্বিতীয় পর্যায়ে বিবর্ধন ৩.৫১ থেকে ৬ করতে কী ধরনের পরিবর্তন করা হয়েছিল? গাণিতিকভাবে বিশ্লেষণ করো। [৪ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>আমরা জানি, অবতল দর্পণে বাস্তব প্রতিবিম্বের ক্ষেত্রে বিবর্ধন m = v / u।</p>
                        <p>দর্পণ সমীকরণ: ১/u + ১/v = ১/f বা উভয় পাশে u দিয়ে গুণ করলে: ১ + u/v = u/f বা ১ + ১/m = u/f।</p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$u = f \left(1 + \frac{1}{m}\right)$$" />
                        </div>
                        <p>১ম পর্যায়ে: u₁ = f (১ + ১/৩.৫১) = f (১ + ০.২৮৫) = ১.২৮৫f।</p>
                        <p>২য় পর্যায়ে: u₂ = f (১ + ১/৬) = f (১ + ০.১৬৭) = ১.১৬৭f।</p>
                        <p className="text-emerald-400 font-semibold">
                          সিদ্ধান্ত: যেহেতু u₂ &lt; u₁, তাই বিবর্ধন ৩.৫১ থেকে ৬ গুণ করতে কাঠিটিকে অবতল দর্পণের প্রধান ফোকাসের আরও কাছে সরিয়ে আনা হয়েছিল।
                        </p>
                      </div>
                    </div>

                    {/* Examiner Secret Rubric */}
                    <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4">
                      <button
                        onClick={() => toggleRubric(1)}
                        className="flex items-center justify-between w-full text-left font-medium text-amber-300"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span>পরীক্ষকের গোপন কথা (Examiner Marking Rubric)</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedRubric.includes(1) ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {expandedRubric.includes(1) && (
                        <div className="mt-3 pt-3 border-t border-amber-500/20 text-slate-300 space-y-2 leading-relaxed">
                          <p>
                            • (গ) প্রয়োগমূলক [৩ নম্বর]: বিবর্ধন সূত্র লেখার জন্য ১ নম্বর, সঠিক মান বসিয়ে দৈর্ঘ্য ৭.০২ cm বের করায় ১ নম্বর, এবং পর্দায় পড়ার কারণে 'বাস্তব ও উল্টো' প্রকৃতি লেখায় ১ নম্বর।
                          </p>
                          <p>
                            • (ঘ) উচ্চতর দক্ষতা [৪ নম্বর]: দর্পণ সমীকরণ ও বিবর্ধনের সম্পর্ক স্থাপনে ১ নম্বর, u₁ ও u₂ এর মান f-এর সাপেক্ষে গণনায় ২ নম্বর, এবং বস্তু ফোকাসের কাছে সরানোর যৌক্তিক ব্যাখ্যায় ১ নম্বর।
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 2: Dhaka Board - Concave Mirror 20cm and 10cm */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      ঢাকা বোর্ড সৃজনশীল
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      অবতল দর্পণে বাস্তব বনাম অবাস্তব প্রতিবিম্বের তুলনা
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(2)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(2) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> একটি অবতল দর্পণের বক্রতার ব্যাসার্ধ ৩০ cm। দর্পণটির সামনে প্রধান অক্ষের ওপর যথাক্রমে ২০ cm এবং ১০ cm দূরে একটি বস্তু স্থাপন করা হলো।
                </div>

                {expandedCQ.includes(2) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-amber-300">
                        (গ) বস্তুটিকে ২০ cm দূরে স্থাপন করলে প্রতিবিম্বের দূরত্ব নির্ণয় করো। [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>বক্রতার ব্যাসার্ধ r = ৩০ cm, সুতরাং ফোকাস দূরত্ব f = r/২ = ১৫ cm।</p>
                        <p>বস্তুর দূরত্ব u = ২০ cm। দর্পণ সমীকরণ ১/u + ১/v = ১/f হতে:</p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$v = \frac{uf}{u - f} = \frac{20 \times 15}{20 - 15} = \frac{300}{5} = 60\text{ cm} \quad \text{(উত্তর)}$$" />
                        </div>
                        <p>প্রতিবিম্বটি দর্পণের সামনে ৬০ cm দূরে গঠিত হবে এবং এটি বাস্তব ও উল্টো।</p>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-amber-300">
                        (ঘ) বস্তুটিকে ১০ cm দূরে স্থাপন করলে প্রতিবিম্বের প্রকৃতি পূর্বের অবস্থানের অনুরূপ হবে কি না? গাণিতিক বিশ্লেষণ দাও। [৪ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>এখানে f = ১৫ cm এবং u = ১০ cm (অর্থাৎ u &lt; f, বস্তু ফোকাস দূরত্বের ভেতরে)।</p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$v = \frac{10 \times 15}{10 - 15} = \frac{150}{-5} = -30\text{ cm}$$" />
                        </div>
                        <p>
                          যেহেতু v ঋণাত্মক (-৩০ cm), তাই প্রতিবিম্বটি দর্পণের পেছনে গঠিত হবে এবং এটি <strong>অবাস্তব ও সোজা</strong>।
                        </p>
                        <p>
                          সিদ্ধান্ত: প্রথম ক্ষেত্রে প্রতিবিম্ব ছিল বাস্তব ও উল্টো, কিন্তু দ্বিতীয় ক্ষেত্রে অবাস্তব ও সোজা। অতএব প্রতিবিম্বের প্রকৃতি পূর্বের অনুরূপ হবে না।
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 3: Rajshahi Board - Rear View Convex Mirror */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      রাজশাহী বোর্ড সৃজনশীল
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      গাড়ির লুকিং গ্লাসে উত্তল দর্পণের অপটিক্যাল পরামিতি
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(3)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(3) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> একটি প্রাইভেট কারের লুকিং গ্লাসের বক্রতার ব্যাসার্ধ ৪ m। চালক লক্ষ্য করলেন পেছনে একটি বাস দর্পণ থেকে ৬ m দূরত্বে এগিয়ে আসছে।
                </div>

                {expandedCQ.includes(3) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-amber-300">
                        (গ) দর্পণে বাসের প্রতিবিম্বটি কত দূরে গঠিত হবে নির্ণয় করো। [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>লুকিং গ্লাসটি একটি উত্তল দর্পণ। বক্রতার ব্যাসার্ধ r = -৪ m, তাই ফোকাস দূরত্ব f = -২ m।</p>
                        <p>বাসের দূরত্ব u = +৬ m। সমীকরণ ১/u + ১/v = ১/f হতে:</p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$v = \frac{uf}{u - f} = \frac{6 \times (-2)}{6 - (-2)} = \frac{-12}{8} = -1.5\text{ m} \quad \text{(উত্তর)}$$" />
                        </div>
                        <p>প্রতিবিম্বটি দর্পণের পেছনে ১.৫ m দূরে গঠিত হবে।</p>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-amber-300">
                        (ঘ) লুকিং গ্লাস হিসেবে উত্তল দর্পণের পরিবর্তে সমতল দর্পণ ব্যবহার করলে চালক কী ধরনের অসুবিধার সম্মুখীন হতেন? গাণিতিক যুক্তিসহ আলোচনা করো। [৪ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>উত্তল দর্পণে বিবর্ধন m = |v/u| = ১.৫ / ৬ = ০.২৫ (অর্থাৎ মূল বাসের আকারের ১/৪ ভাগ)।</p>
                        <p>
                          ১. উত্তল দর্পণে চিত্র ছোট হওয়ায় পেছনের বিশাল এলাকা (দৃষ্টি ক্ষেত্র) চালকের চোখে ধরা পড়ে।
                        </p>
                        <p>
                          ২. সমতল দর্পণে বিবর্ধন m = ১ হওয়ায় বাসের কেবল ক্ষুদ্র একটি অংশ পুরো আয়না ঢেকে ফেলত এবং পেছনের অন্যান্য গাড়ি অদৃশ্য থেকে যেত (ব্লাইন্ড স্পট সৃষ্টি হতো)। এতে ভয়াবহ দুর্ঘটনার ঝুঁকি বাড়ত।
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 3: INTERACTIVE PRACTICE CHALLENGES (TRY YOURSELF)           */}
          {/* =============================================================== */}
          {activeTab === 'practice' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  ইন্টারেক্টিভ গাণিতিক চ্যালেঞ্জ (INSTANT VALIDATION)
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">
                  নিজে করো: ৩টি সরাসরি হিসাব চ্যালেঞ্জ
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  বোর্ড পরীক্ষার জন্য দ্রুত ও নির্ভুল হিসাব নিশ্চিত করতে ক্যালকুলেটর হাতে নিয়ে নিচের সমস্যাগুলো সমাধান করো।
                </p>
              </div>

              {/* Challenge 1 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono text-amber-400">চ্যালেঞ্জ ০১: ফোকাস দূরত্ব ও বক্রতা</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">বোর্ড স্ট্যান্ডার্ড</span>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  একটি অবতল দর্পণের বক্রতার ব্যাসার্ধ ৪০ cm হলে এর ফোকাস দূরত্ব কত cm?
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="উদা: 20"
                    value={ch1Input}
                    onChange={(e) => setCh1Input(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white w-48 font-mono focus:border-amber-500 outline-none"
                  />
                  <button
                    onClick={checkChallenge1}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                  >
                    যাচাই করো
                  </button>
                </div>

                {ch1Status === 'correct' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>🎉 সঠিক হয়েছে! f = r / ২ = ৪০ / ২ = ২০ cm।</span>
                  </div>
                )}
                {ch1Status === 'wrong' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>সঠিক হয়নি। ক্লু: বক্রতার ব্যাসার্ধকে ২ দিয়ে ভাগ করো (f = r/২)।</span>
                  </div>
                )}
              </div>

              {/* Challenge 2 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono text-amber-400">চ্যালেঞ্জ ০২: বক্রতার কেন্দ্রে প্রতিবিম্ব</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">বোর্ড সৃজনশীল (গ)</span>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  একটি অবতল দর্পণের ফোকাস দূরত্ব ১৫ cm। দর্পণ থেকে ৩০ cm সামনে বস্তু রাখলে প্রতিবিম্বের দূরত্ব কত cm হবে?
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="উদা: 30"
                    value={ch2Input}
                    onChange={(e) => setCh2Input(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white w-48 font-mono focus:border-amber-500 outline-none"
                  />
                  <button
                    onClick={checkChallenge2}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                  >
                    যাচাই করো
                  </button>
                </div>

                {ch2Status === 'correct' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>🎉 অসাধারণ! u = ৩০ = ২f (বক্রতার কেন্দ্র), তাই প্রতিবিম্ব ঠিক বক্রতার কেন্দ্রেই (v = ৩০ cm) গঠিত হয়!</span>
                  </div>
                )}
                {ch2Status === 'wrong' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>সঠিক হয়নি। ক্লু: ১/v = ১/f - ১/u = ১/১৫ - ১/৩০ = ১/৩০।</span>
                  </div>
                )}
              </div>

              {/* Challenge 3 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono text-amber-400">চ্যালেঞ্জ ০৩: উত্তল দর্পণে প্রতিবিম্ব দূরত্ব</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">বোর্ড সৃজনশীল (ঘ)</span>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  একটি উত্তল দর্পণের ফোকাস দূরত্ব ১০ cm (|f| = ১০)। দর্পণ থেকে ১৫ cm সামনে লক্ষ্যবস্তু রাখলে প্রতিবিম্ব দূরত্ব কত cm?
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="উদা: -6 বা 6"
                    value={ch3Input}
                    onChange={(e) => setCh3Input(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white w-48 font-mono focus:border-amber-500 outline-none"
                  />
                  <button
                    onClick={checkChallenge3}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                  >
                    যাচাই করো
                  </button>
                </div>

                {ch3Status === 'correct' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>🎉 দারুণ! উত্তল দর্পণে f = -১০ cm। ১/v = -১/১০ - ১/১৫ = -৫/৩০ = -১/৬, অতএব v = -৬ cm!</span>
                  </div>
                )}
                {ch3Status === 'wrong' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>সঠিক হয়নি। ক্লু: উত্তল দর্পণে f ঋণাত্মক বসাও (f = -১০)। ১/v = -১/১০ - ১/১৫।</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 4: CHECK UNDERSTANDING (MCQ QUIZ)                           */}
          {/* =============================================================== */}
          {activeTab === 'quiz' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  অধ্যায়ভিত্তিক স্ব-মূল্যায়ন কুইজ
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">
                  বোর্ড পরীক্ষার স্ট্যান্ডার্ড ৫টি MCQ
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  সঠিক উত্তরটি নির্বাচন করে তোমার প্রস্তুতি যাচাই করো। প্রতিটি প্রশ্নের সাথে বিস্তারিত ব্যাখ্যা সংযোজিত।
                </p>
              </div>

              {/* MCQs List */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    q: '১. সমতল দর্পণে সৃষ্ট প্রতিবিম্বের বৈশিষ্ট্য কোনটি?',
                    options: [
                      'বাস্তব ও সোজা',
                      'অবাস্তব ও সোজা',
                      'বাস্তব ও উল্টো',
                      'অবাস্তব ও উল্টো',
                    ],
                    correct: 1,
                    explanation: 'সমতল দর্পণে সর্বদা অবাস্তব, সোজা ও বস্তুর সমান আকারের প্রতিবিম্ব গঠিত হয় (বিবর্ধন m = ১)।',
                  },
                  {
                    id: 2,
                    q: '২. একটি গোলীয় দর্পণের বক্রতার ব্যাসার্ধ ২৪ cm হলে এর ফোকাস দূরত্ব কত?',
                    options: ['৪৮ cm', '২৪ cm', '১২ cm', '৬ cm'],
                    correct: 2,
                    explanation: 'গোলীয় দর্পণের ফোকাস দূরত্ব ও বক্রতার ব্যাসার্ধের সম্পর্ক f = r / ২ = ২৪ / ২ = ১২ cm।',
                  },
                  {
                    id: 3,
                    q: '৩. অবতল দর্পণের ফোকাস দূরত্বের ভেতরে (u < f) লক্ষ্যবস্তু রাখলে প্রতিবিম্বের প্রকৃতি কেমন হবে?',
                    options: [
                      'বাস্তব ও উল্টো',
                      'অবাস্তব, সোজা ও বিবর্ধিত',
                      'অবাস্তব, সোজা ও খর্বিত',
                      'অসীমে বাস্তব প্রতিবিম্ব',
                    ],
                    correct: 1,
                    explanation: 'অবতল দর্পণে শুধুমাত্র ফোকাসের ভেতরে বস্তু রাখলেই দর্পণের পেছনে অবাস্তব, সোজা ও বিবর্ধিত প্রতিবিম্ব গঠিত হয় (ডেন্টিস্টের আয়না নীতি)।',
                  },
                  {
                    id: 4,
                    q: '৪. পেছনের যানবাহন স্পষ্টভাবে দেখার জন্য গাড়িতে কোন দর্পণ ব্যবহৃত হয়?',
                    options: ['উত্তল দর্পণ', 'অবতল দর্পণ', 'সমতল দর্পণ', 'অধিবৃত্তীয় দর্পণ'],
                    correct: 0,
                    explanation: 'উত্তল দর্পণ সর্বদা খর্বিত ও সোজা প্রতিবিম্ব গঠন করে সুবিশাল দৃষ্টি ক্ষেত্র উপহার দেয়, তাই এটি লুকিং গ্লাস হিসেবে ব্যবহৃত হয়।',
                  },
                  {
                    id: 5,
                    q: '৫. পাহাড়ি রাস্তার বিপজ্জনক সমকোণী বাঁকে সাধারণত কত কোণে আয়না স্থাপন করা হয়?',
                    options: ['৩০°', '৪৫°', '৬০°', '৯০°'],
                    correct: 1,
                    explanation: 'পাহাড়ি রাস্তার বাঁকগুলোতে ৪৫° কোণে আয়না স্থাপন করলে উভয় পাশের গাড়ি একে অপরকে সমকোণে দেখতে পায়।',
                  },
                ].map((mcq) => {
                  const isAnswered = selectedAnswers[mcq.id] !== undefined;
                  const isCorrect = selectedAnswers[mcq.id] === mcq.correct;

                  return (
                    <div key={mcq.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-semibold text-white">{mcq.q}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mcq.options.map((opt, idx) => {
                          const isSelected = selectedAnswers[mcq.id] === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedAnswers((prev) => ({ ...prev, [mcq.id]: idx }))}
                              className={`p-3 rounded-xl text-xs font-medium text-left border transition ${
                                isSelected
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div
                          className={`p-3 rounded-xl text-xs border ${
                            isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5 mb-1">
                            {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span>{isCorrect ? 'সঠিক উত্তর!' : 'ভুল উত্তর!'}</span>
                          </div>
                          <p>{mcq.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 5: SUMMARY CHEAT SHEET                                      */}
          {/* =============================================================== */}
          {activeTab === 'summary' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                <div>
                  <span className="text-xs font-mono text-amber-400">অধ্যায় সারসংক্ষেপ ও সূত্র ভাণ্ডার</span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    অধ্যায় ০৮: আলোর প্রতিফলন — একনজরে রিভিশন
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    পরীক্ষার আগের রাতের জন্য দ্রুত রিভিশন নোট ও শীর্ষ ফাঁদসমূহ।
                  </p>
                </div>

                <button
                  onClick={copySummaryNotes}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 border border-slate-700 transition"
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
                    <span className="text-xs font-mono text-amber-400 font-bold">প্রতিফলনের সূত্র ও ফোকাস দূরত্ব:</span>
                    <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                      <RenderMathText text="$\angle i = \angle r, \quad r = 2f \implies f = \frac{r}{2}$" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <RenderMathText text="বক্রতার ব্যাসার্ধ সর্বদা ফোকাস দূরত্বের দ্বিগুণ। সমতল দর্পণে ফোকাস দূরত্ব অসীম ($f = \infty$)।" />
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">দর্পণ সমীকরণ:</span>
                    <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                      <RenderMathText text="$\frac{1}{u} + \frac{1}{v} = \frac{1}{f} \implies v = \frac{uf}{u - f}$" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <RenderMathText text="অবতল দর্পণে $f > 0$, উত্তল দর্পণে $f < 0$। বাস্তব প্রতিবিম্বে $v > 0$, অবাস্তবে $v < 0$।" />
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">রৈখিক বিবর্ধন (Linear Magnification):</span>
                    <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                      <RenderMathText text="$m = -\frac{v}{u} = \frac{L'}{L}$" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <RenderMathText text="$|m| > 1$ হলে প্রতিবিম্ব বিবর্ধিত, $|m| < 1$ হলে খর্বিত, $|m| = 1$ হলে সমান আকারের।" />
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">সমতল দর্পণে পূর্ণ প্রতিবিম্ব:</span>
                    <div className="bg-slate-950 p-3 rounded font-mono text-emerald-400 text-sm">
                      <RenderMathText text="$\text{Mirror Height} = \frac{H}{2}, \quad u = v$" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      নিজের সম্পূর্ণ প্রতিবিম্ব দেখতে ব্যক্তির উচ্চতার ঠিক অর্ধেক আকারের আয়না প্রয়োজন।
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
                    <span className="font-semibold text-rose-300">ফাঁদ ০১: উত্তল দর্পণে f-এর আগে ঋণাত্মক (-) চিহ্ন না দেওয়া!</span>
                    <p className="text-slate-400">
                      <RenderMathText text="উত্তল দর্পণে ফোকাস বিন্দু দর্পণের পেছনে অবস্থান করায় f সর্বদা ঋণাত্মক (যেমন $f = -10\text{ cm}$)। সূত্রে মাইনাস না বসালে পুরো অঙ্ক ভুল হবে!" />
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-rose-300">ফাঁদ ০২: অবাস্তব প্রতিবিম্বের দূরত্বের মাইনাস চিহ্ন দৈর্ঘ্যে রেখে দেওয়া!</span>
                    <p className="text-slate-400">
                      <RenderMathText text="গাণিতিক ফলাফলে $v = -30\text{ cm}$ আসলে উত্তরে লিখতে হবে &quot;দর্পণের পেছনে ৩০ cm দূরে&quot;। দূরত্ব কোনো ঋণাত্মক রাশি হতে পারে না।" />
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-rose-300">ফাঁদ ০৩: বক্রতার কেন্দ্রে (u = 2f) বস্তু রাখলে বিবর্ধন ভুল লেখা!</span>
                    <p className="text-slate-400">
                      <RenderMathText text="বস্তু ঠিক বক্রতার কেন্দ্রে থাকলে প্রতিবিম্বও ঠিক বক্রতার কেন্দ্রেই গঠিত হয় এবং এর আকার বস্তুর হুবহু সমান হয় ($|m| = 1$)।" />
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-rose-300">ফাঁদ ০৪: সমতল দর্পণে পূর্ণ প্রতিবিম্ব দেখতে ব্যক্তির সমান আয়না প্রয়োজন মনে করা!</span>
                    <p className="text-slate-400">
                      সঠিক উত্তর: ব্যক্তির উচ্চতার ঠিক অর্ধেক ($H/2$)। ব্যক্তি আয়না থেকে কাছে বা দূরে সরে গেলেও এই অনুপাত অপরিবর্তিত থাকে!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SOCRATIC AI TUTOR DRAWER                                            */}
      {/* ------------------------------------------------------------------- */}
      {isAiTutorOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-white">সক্রেটিক এআই পদার্থবিজ্ঞান টিউটর</span>
            </div>
            <button
              onClick={() => setIsAiTutorOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {tutorMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-slate-950 border border-slate-800 text-slate-200'
                    : 'bg-amber-500/20 border border-amber-500/40 text-amber-100 ml-6'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Preset Prompts */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-1.5">
            <span className="text-[10px] text-slate-500 font-mono">দ্রুত প্রশ্ন প্রম্পটস:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'গাড়িতে উত্তল আয়না কেন ব্যবহার হয়?',
                'ডেন্টিস্টরা কেন অবতল আয়না ব্যবহার করেন?',
                'পাহাড়ি বাঁকের আয়না কীভাবে কাজ করে?',
              ].map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputQuestion(p);
                  }}
                  className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              placeholder="আলোর প্রতিফলন সম্পর্কে যেকোনো প্রশ্ন..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTutor()}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
            />
            <button
              onClick={handleSendTutor}
              className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
