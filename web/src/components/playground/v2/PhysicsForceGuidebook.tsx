'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Play,
  Pause,
  ShieldAlert,
  Layers,
  Activity,
  Award,
  Zap,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  Sliders,
  Flame,
  MoveRight,
  Shield,
  Crosshair,
  Gauge,
  CircleDot,
  Scale,
  Send,
  ChevronDown,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';

type TabStep = 1 | 2 | 3 | 4 | 5;

interface LessonMeta {
  id: number;
  no: string;
  titleBn: string;
  titleEn: string;
  nctbRef: string;
  subtopics: string[];
}

const LESSONS_META: Record<number, LessonMeta> = {
  1: {
    id: 1,
    no: '০১',
    titleBn: 'জড়তা, বল ও নিউটনের ১ম সূত্র',
    titleEn: "Inertia, Force & Newton's 1st Law",
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৩: পৃষ্ঠা ৬৬-৭৩',
    subtopics: ['স্থিতি জড়তা ও গতি জড়তা', 'নিউটনের প্রথম সূত্র', '৪টি মৌলিক বলের তুলনামূলক তীব্রতা', 'সাম্য ও অসাম্য বল'],
  },
  2: {
    id: 2,
    no: '০২',
    titleBn: 'ভরবেগ ও নিউটনের ২য় সূত্র (F = ma)',
    titleEn: "Momentum & Newton's 2nd Law (F = ma)",
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৩: পৃষ্ঠা ৭৪-৭৯',
    subtopics: ['ভরবেগ (p = mv) ও এর একক-মাত্রা', 'ভরবেগের পরিবর্তনের হার ও বল', 'F = ma প্রতিপাদন', 'ঘর্ষণযুক্ত মেঝেতে কার্যকর ত্বরণ'],
  },
  3: {
    id: 3,
    no: '০৩',
    titleBn: 'নিউটনের ৩য় সূত্র ও বন্দুকের পশ্চাৎবেগ',
    titleEn: "Newton's 3rd Law & Gun Recoil",
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৩: পৃষ্ঠা ৮০-৮৪',
    subtopics: ['ক্রিয়া ও প্রতিক্রিয়া বল (F₁ = -F₂)', 'মাটিতে হাঁটা ও রকেট উৎক্ষেপণ', 'বন্দুক ও গুলির পশ্চাৎবেগ (V = -mv/M)'],
  },
  4: {
    id: 4,
    no: '০৪',
    titleBn: 'ভরবেগের সংরক্ষণ সূত্র ও সংঘর্ষ ল্যাব',
    titleEn: 'Conservation of Momentum & Collision Lab',
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৩: পৃষ্ঠা ৮৫-৮৯',
    subtopics: ['ভরবেগের সংরক্ষণ সূত্র', 'বস্তুদ্বয়ের সংঘর্ষ ও মিলিত বেগ', 'নিরাপদ ভ্রমণ ও সিটবেল্ট/এয়ারব্যাগের ভূমিকা'],
  },
  5: {
    id: 5,
    no: '০৫',
    titleBn: 'ঘর্ষণ ও ৪ প্রকার ঘর্ষণ ল্যাব',
    titleEn: 'Friction Types & Friction Lab',
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৩: পৃষ্ঠা ৯০-৯৫',
    subtopics: ['স্থিতি, পিছলানো, আবর্ত ও প্রবাহী ঘর্ষণ', 'ঘর্ষণ বল ও তলভেদে পার্থক্য', 'ঘর্ষণ কমানো/বাড়ানো এবং "প্রয়োজনীয় উপদ্রব"'],
  },
};

export default function PhysicsForceGuidebook() {
  const [activeStep, setActiveStep] = useState<TabStep>(1);
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Lesson 1 State: Bus Inertia Simulator
  const [busState, setBusState] = useState<'idle' | 'accel' | 'brake'>('idle');
  const [passengerAngle, setPassengerAngle] = useState<number>(0);

  // Lesson 2 State: F = ma Accelerator
  const [appliedForceF, setAppliedForceF] = useState<number>(40);
  const [objectMassM, setObjectMassM] = useState<number>(5);
  const [surfaceFrictionFk, setSurfaceFrictionFk] = useState<number>(10);
  const [isAccelerating, setIsAccelerating] = useState<boolean>(false);
  const [carAnimPos, setCarAnimPos] = useState<number>(10);

  // Lesson 3 State: Gun Recoil Simulator
  const [bulletMassG, setBulletMassG] = useState<number>(20); // 20g = 0.02kg
  const [bulletSpeedV, setBulletSpeedV] = useState<number>(400); // 400 m/s
  const [gunMassKg, setGunMassKg] = useState<number>(4); // 4 kg
  const [hasFired, setHasFired] = useState<boolean>(false);

  // Lesson 4 State: 2-Body Collision Lab
  const [car1Mass, setCar1Mass] = useState<number>(1000); // 1000 kg
  const [car1Speed, setCar1Speed] = useState<number>(10); // 10 m/s
  const [car2Mass, setCar2Mass] = useState<number>(2000); // 2000 kg
  const [car2Speed, setCar2Speed] = useState<number>(-5); // -5 m/s (opposite)
  const [isColliding, setIsColliding] = useState<boolean>(false);
  const [collisionDone, setCollisionDone] = useState<boolean>(false);

  // Lesson 5 State: 4 Friction Types Switcher
  const [frictionType, setFrictionType] = useState<'static' | 'sliding' | 'rolling' | 'fluid'>('static');

  // Step 2: See Example Tab Selection
  const [selectedExampleTab, setSelectedExampleTab] = useState<number>(1);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // Step 3: Try Yourself Challenge Inputs
  const [challenge1Input, setChallenge1Input] = useState<string>('');
  const [challenge1Feedback, setChallenge1Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const [recoilInput, setRecoilInput] = useState<string>('');
  const [recoilFeedback, setRecoilFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const [collisionInput, setCollisionInput] = useState<string>('');
  const [collisionFeedback, setCollisionFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Step 4: Check Understanding MCQs
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showMCQResults, setShowMCQResults] = useState<boolean>(false);

  // Step 5: Summary Cheat-Sheet Copy state
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Quick Action Modal
  const [activeModal, setActiveModal] = useState<'nctb_book' | 'notes' | 'board_questions' | null>(null);

  // AI Tutor Quick Question state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Handle Bus Inertia State
  useEffect(() => {
    if (busState === 'accel') {
      setPassengerAngle(-25); // Lean backward
    } else if (busState === 'brake') {
      setPassengerAngle(28); // Lean forward
    } else {
      setPassengerAngle(0);
    }
  }, [busState]);

  // Car Animation for F = ma
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAccelerating) {
      interval = setInterval(() => {
        setCarAnimPos((prev) => {
          if (prev >= 85) {
            setIsAccelerating(false);
            return 85;
          }
          return prev + 2.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAccelerating]);

  // Calculate Net Force & Acceleration for Lesson 2
  const netForce = Math.max(0, appliedForceF - surfaceFrictionFk);
  const calcAccel = Number((netForce / objectMassM).toFixed(2));
  const calcMomentum = Number((objectMassM * (calcAccel * 3)).toFixed(1)); // after 3s

  // Gun recoil calculation: V = - (m * v) / M
  const bulletMassKg = bulletMassG / 1000;
  const recoilVelocity = Number((-(bulletMassKg * bulletSpeedV) / gunMassKg).toFixed(2));

  // Combined velocity in collision: V = (m1*u1 + m2*u2) / (m1 + m2)
  const combinedVelocity = Number(
    ((car1Mass * car1Speed + car2Mass * car2Speed) / (car1Mass + car2Mass)).toFixed(2)
  );

  const currentLessonMeta = LESSONS_META[activeLesson] || LESSONS_META[1];

  // AI Tutor Quick Questions
  const handleAskAi = (presetPrompt?: string) => {
    const q = presetPrompt || aiQuestion;
    if (!q.trim()) return;
    setIsAiLoading(true);
    setAiQuestion(q);

    setTimeout(() => {
      if (q.includes('নিউটনের ১ম সূত্র') || q.includes('জড়তা')) {
        setAiResponse(
          'নিউটনের প্রথম সূত্র জড়তার ধারণা এবং বলের সংজ্ঞা দেয়। বাহ্যিক বল না দিলে স্থির বস্তু স্থির থাকবে (স্থিতি জড়তা) এবং গতিশীল বস্তু সমবেগে চলতে থাকবে (গতি জড়তা)। বাসে ব্রেক করলে গতি জড়তার কারণে আমরা সামনের দিকে ঝুঁকে পড়ি।'
        );
      } else if (q.includes('F = ma') || q.includes('২য় সূত্র')) {
        setAiResponse(
          'নিউটনের ২য় সূত্রানুসারে, বল প্রযুক্ত হলে বস্তুতে ত্বরণ সৃষ্টি হয়: F = ma। যদি মেঝেতে ঘর্ষণ বল (fk) থাকে, তবে কার্যকর বল F_net = F - fk = ma হবে। এখান থেকে a = (F - fk)/m বের করা যায়।'
        );
      } else if (q.includes('বন্দুকের পশ্চাৎবেগ') || q.includes('৩য় সূত্র')) {
        setAiResponse(
          'নিউটনের ৩য় সূত্র (F₁ = -F₂) ও ভরবেগের সংরক্ষণ সূত্র থেকে বন্দুকের পশ্চাৎবেগ পাওয়া যায়: V = -(m * v) / M। বন্দুকের ভর (M) গুলির ভর (m) অপেক্ষা অনেক বেশি হওয়ায় পশ্চাৎবেগ তুলনামূলকভাবে বেশ কম হয়।'
        );
      } else if (q.includes('সংঘর্ষ') || q.includes('মিলিত বেগ')) {
        setAiResponse(
          'সংঘর্ষের ক্ষেত্রে মোট আদি ভরবেগ = মোট শেষ ভরবেগ (m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂)। দুটি বস্তু সংঘর্ষের পর একসাথে আটকে গেলে মিলিত বেগ V = (m₁u₁ + m₂u₂) / (m₁ + m₂)। বিপরীত দিক থেকে আসলে একটির বেগকে ঋণাত্মক ধরতে হবে!'
        );
      } else {
        setAiResponse(
          `অধ্যায় ৩ (বল) সংক্রান্ত সুন্দর প্রশ্ন! ভরবেগ p = mv এবং বল F = ma। সংঘর্ষের ক্ষেত্রে ভরবেগ সর্বদা সংরক্ষিত থাকে। কোনো নির্দিষ্ট গাণিতিক সমস্যায় সাহায্য লাগলে প্রশ্নটি পূর্ণাঙ্গ লিখে বলো!`
        );
      }
      setIsAiLoading(false);
    }, 600);
  };

  const handleCopySummaryNotes = () => {
    const notes = `
[Sheratutor পদার্থবিজ্ঞান অধ্যায় ৩: বল (Force) রিভিশন নোটস]
১. নিউটনের সূত্রাবলী:
   • ১ম সূত্র: বল প্রয়োগ না করলে স্থির বস্তু স্থির, গতিশীল বস্তু সমবেগে চলবে। (জড়তা ও বলের গুণগত সংজ্ঞা)
   • ২য় সূত্র: ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক: F = ma = (mv - mu)/t
   • ৩য় সূত্র: প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে: F₁ = -F₂

২. ভরবেগ ও সংরক্ষণ সূত্র:
   • ভরবেগ p = mv [একক: kg m/s, মাত্রা: MLT⁻¹]
   • সংরক্ষণ সূত্র: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂
   • সংঘর্ষের পর মিলিত বেগ: V = (m₁u₁ + m₂u₂) / (m₁ + m₂)
   • বন্দুকের পশ্চাৎবেগ: V = -(m * v) / M

৩. ৪টি মৌলিক বলের তীব্রতা:
   • মহাকর্ষ বল (১) < দুর্বল নিউক্লীয় বল (১০²⁵) < তড়িৎ-চৌম্বক বল (১০³⁶) < সবল নিউক্লীয় বল (১০³⁸)

৪. ঘর্ষণ বল (Friction):
   • স্থিতি ঘর্ষণ, পিছলানো ঘর্ষণ, আবর্ত ঘর্ষণ (সবচেয়ে কম বাধা), প্রবাহী ঘর্ষণ।
   • কার্যকর ত্বরণ: a = (F - f_k) / m
`.trim();

    navigator.clipboard.writeText(notes);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="physics"
        subjectNameBn="পদার্থবিজ্ঞান"
        chapterNum={3}
        chapterTitleBn="বল (Force)"
        activeLesson={activeLesson}
        activeLessonTitle={LESSONS_META[activeLesson]?.titleBn}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenAi={() => handleAskAi('নিউটনের ৩টি সূত্র সংক্ষেপে বুঝিয়ে দাও')}
      />

      {/* Main Layout Grid */}
      <div className="flex-1 flex w-full max-w-[1700px] mx-auto overflow-hidden">
        {/* COLLAPSIBLE LEFT SIDEBAR: 5 Structured Lessons */}
        {isSidebarOpen && (
          <aside className="w-72 sm:w-80 border-r border-border/80 bg-card/60 backdrop-blur-xs flex flex-col shrink-0 overflow-y-auto">
            {/* Subject & Class Info */}
            <div className="p-4 border-b border-border/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">শ্রেণি ও বিষয়</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground leading-tight">Class 9–10 (SSC)</h4>
                  <p className="text-xs text-muted-foreground">পদার্থবিজ্ঞান (Physics)</p>
                </div>
              </div>
            </div>

            {/* Chapter Progress Card */}
            <div className="p-4 border-b border-border/70 space-y-2.5 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Chapter 3
                </span>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {Math.round((completedLessons.length / 5) * 100)}%
                </span>
              </div>
              <div>
                <h3 className="font-black text-base text-foreground">বল (Force)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Dynamics, Momentum & Friction</p>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${(completedLessons.length / 5) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>{completedLessons.length} / ৫টি পাঠ সম্পন্ন</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">১০ নম্বর নিশ্চিত</span>
              </div>
            </div>

            {/* Lesson Navigation Rail */}
            <div className="p-3 space-y-1.5 flex-1">
              {[
                { id: 1, no: '০১', titleBn: 'জড়তা, বল ও নিউটনের ১ম সূত্র', titleEn: "Inertia & Newton's 1st Law" },
                { id: 2, no: '০২', titleBn: 'ভরবেগ ও ২য় সূত্র (F = ma)', titleEn: "Momentum & F = ma" },
                { id: 3, no: '০৩', titleBn: '৩য় সূত্র ও বন্দুকের পশ্চাৎবেগ', titleEn: "Action-Reaction & Gun Recoil" },
                { id: 4, no: '০৪', titleBn: 'ভরবেগের সংরক্ষণ ও সংঘর্ষ ল্যাব', titleEn: 'Collision & Momentum' },
                { id: 5, no: '০৫', titleBn: 'ঘর্ষণ ও ৪ প্রকার ঘর্ষণ ল্যাব', titleEn: 'Friction Types & Lab' },
              ].map((item) => {
                const isActive = activeLesson === item.id;
                const isDone = completedLessons.includes(item.id);

                return (
                  <button
                    key={item.id}
                    data-lesson-id={item.id}
                    onClick={() => {
                      setActiveLesson(item.id);
                      if (!completedLessons.includes(item.id)) {
                        setCompletedLessons((prev) => [...prev, item.id]);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-primary/10 border border-primary/30 text-primary shadow-xs'
                        : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isActive ? 'text-primary font-black' : 'text-muted-foreground'
                        }`}
                      >
                        {item.no}
                      </span>
                      <div>
                        <div className="text-xs font-bold leading-tight group-hover:text-foreground">
                          {item.titleBn}
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                          {item.titleEn}
                        </div>
                      </div>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-muted-foreground/40 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Study Aids in Sidebar Footer */}
            <div className="p-3 border-t border-border/80 space-y-2 bg-muted/10 text-xs">
              <span className="font-bold text-[11px] text-muted-foreground uppercase tracking-wider">
                অধ্যায় রিসোর্স (Resources)
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveModal('nctb_book')}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>এনসিটিবি পাঠ্যবই (পৃষ্ঠা ৬৬-৯৫)</span>
                </button>
                <button
                  onClick={() => setActiveModal('notes')}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span>নিউটনের ৩টি সূত্র ও সূত্রাবলী</span>
                </button>
                <button
                  onClick={() => setActiveModal('board_questions')}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>বিগত ৫ বছরের বোর্ড প্রশ্ন সম্ভার</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* CENTER CONTENT: The 5-Step Learning Framework */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TOP LESSON BANNER */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary text-white font-black flex items-center justify-center text-lg shadow-sm shrink-0">
                {currentLessonMeta.no}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground">
                  {currentLessonMeta.titleBn}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  ({currentLessonMeta.titleEn})
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20">
                    ★ বোর্ড নিশ্চিত প্রশ্ন
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentLessonMeta.subtopics.slice(0, 2).join(' • ')}...
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-xl bg-card border border-border text-xs text-muted-foreground font-mono">
                {currentLessonMeta.nctbRef}
              </span>
            </div>
          </div>

          {/* THE 5 LEARNING STEPS TABS HEADER (Strictly adhering to platform standard) */}
          <div className="border-b border-border/80">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-px scrollbar-none">
              {[
                { step: 1, labelBn: 'ধারণা শিখুন', labelEn: 'Learn Concept' },
                { step: 2, labelBn: 'উদাহরণ দেখি', labelEn: 'See Example' },
                { step: 3, labelBn: 'নিজে করো', labelEn: 'Try Yourself' },
                { step: 4, labelBn: 'মূল্যায়ন', labelEn: 'Check Understanding' },
                { step: 5, labelBn: 'সারসংক্ষেপ', labelEn: 'Summary' },
              ].map((tab) => {
                const isCurrent = activeStep === tab.step;
                return (
                  <button
                    key={tab.step}
                    onClick={() => setActiveStep(tab.step as TabStep)}
                    className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative shrink-0 ${
                      isCurrent
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isCurrent
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {tab.step}
                    </span>
                    <span>{tab.labelEn}</span>
                    {isCurrent && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: LEARN CONCEPT (5 Lessons) */}
          {activeStep === 1 && (
            <div className="space-y-6">
              {/* LESSON 1: INERTIA, FORCE & NEWTON'S 1ST LAW */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  {/* Bus Inertia Simulator */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. বাসের গতি ও স্থিতি জড়তা ল্যাব (Bus Inertia Simulator)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          বাস হঠাৎ চলতে শুরু করলে বা হঠাৎ ব্রেক কষলে যাত্রীর শরীরের কী ঘটে দেখুন (NCTB পৃষ্ঠা ৬৮)
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setBusState('accel')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            busState === 'accel'
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          হঠাৎ চলা শুরু (Acceleration)
                        </button>
                        <button
                          onClick={() => setBusState('brake')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            busState === 'brake'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          হঠাৎ ব্রেক কষা (Brake)
                        </button>
                        <button
                          onClick={() => setBusState('idle')}
                          className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-xs font-bold"
                        >
                          স্বাভাবিক
                        </button>
                      </div>
                    </div>

                    {/* Simulation Canvas */}
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden">
                      <div className="h-44 flex items-center justify-center relative">
                        {/* Bus Frame */}
                        <div
                          className={`w-72 sm:w-96 h-28 rounded-2xl bg-indigo-900/90 border-2 border-indigo-400 p-3 flex flex-col justify-between transition-transform duration-500 ${
                            busState === 'accel'
                              ? 'translate-x-12'
                              : busState === 'brake'
                              ? '-translate-x-12'
                              : 'translate-x-0'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] text-indigo-200 font-mono">
                            <span>🚌 যাত্রীবাহী বাস</span>
                            <span>{busState === 'accel' ? 'ত্বরণ ⏩' : busState === 'brake' ? 'মন্দন 🛑' : 'স্থির'}</span>
                          </div>

                          {/* Inside Passenger */}
                          <div className="flex items-center justify-around">
                            <div className="flex flex-col items-center">
                              {/* Passenger stick figure with tilt */}
                              <div
                                className="transition-transform duration-300 origin-bottom"
                                style={{ transform: `rotate(${passengerAngle}deg)` }}
                              >
                                <div className="h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] shadow-md">
                                  👤
                                </div>
                                <div className="w-1.5 h-8 bg-amber-300 mx-auto rounded-full" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-300 mt-1">যাত্রী</span>
                            </div>

                            {/* Driver */}
                            <div className="flex flex-col items-center opacity-80">
                              <div className="h-5 w-5 rounded-full bg-sky-400 flex items-center justify-center text-[9px]">
                                🧢
                              </div>
                              <div className="w-1.5 h-7 bg-sky-300 mx-auto rounded-full" />
                              <span className="text-[10px] text-slate-400 mt-1">চালক</span>
                            </div>
                          </div>

                          {/* Bus Wheels */}
                          <div className="flex justify-between px-6">
                            <div className="h-4 w-4 rounded-full bg-slate-700 border-2 border-slate-400" />
                            <div className="h-4 w-4 rounded-full bg-slate-700 border-2 border-slate-400" />
                          </div>
                        </div>
                      </div>

                      {/* Scientific Explanation */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200">
                        {busState === 'accel' && (
                          <div>
                            <span className="font-bold text-primary">স্থিতি জড়তা (Inertia of Rest):</span> বাস হঠাৎ চলতে শুরু করলে শরীরের নিচের অংশ বাসের সাথে গতিশীল হয়, কিন্তু উপরের অংশ জড়তার কারণে স্থির থাকতে চায়। ফলে যাত্রী পেছনের দিকে হেলে পড়েন!
                          </div>
                        )}
                        {busState === 'brake' && (
                          <div>
                            <span className="font-bold text-rose-400">গতি জড়তা (Inertia of Motion):</span> চলন্ত বাস হঠাৎ ব্রেক করলে শরীরের নিচের অংশ বাসের সাথে স্থির হয়ে যায়, কিন্তু উপরের অংশ গতি জড়তার জন্য আগের বেগেই চলতে চায়। ফলে যাত্রী সামনের দিকে ঝুঁকে পড়েন!
                          </div>
                        )}
                        {busState === 'idle' && (
                          <div className="text-slate-400">
                            বোতাম চেপে দেখুন কীভাবে বাস চলার শুরুতে বা থামার সময় জড়তা কাজ করে। ভরই হলো জড়তার পরিমাপ।
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4 Fundamental Forces Matrix */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-foreground">
                        ২. প্রকৃতির ৪টি মৌলিক বল (4 Fundamental Forces of Nature)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        মহাবিশ্বের সকল বল মূলত এই ৪টি মৌলিক বলের বহিঃপ্রকাশ (NCTB পৃষ্ঠা ৭০-৭২)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {/* Force 1 */}
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-600 dark:text-amber-400">১. মহাকর্ষ বল</span>
                          <span className="font-mono font-bold text-muted-foreground">তীব্রতা: 1</span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          ভরযুক্ত যেকোনো দুটি বস্তুর মধ্যকার আকর্ষণ বল। এটি সবচেয়ে দুর্বল বল কিন্তু এর পাল্লা অসীম (Infinite)।
                        </p>
                        <div className="text-xs font-semibold text-foreground">উদাহরণ: গ্রহ-নক্ষত্রের ঘূর্ণন, ওজন।</div>
                      </div>

                      {/* Force 2 */}
                      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-600 dark:text-sky-400">২. দুর্বল নিউক্লীয় বল</span>
                          <span className="font-mono font-bold text-muted-foreground">১০²⁵</span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          তেজস্ক্রিয় বিটা (<RenderMathText text="$\beta$" />) ক্ষয়ের জন্য দায়ী। এর পাল্লা অত্যন্ত ক্ষুদ্র (<RenderMathText text="$10^{-18}\text{ m}$" />)।
                        </p>
                        <div className="text-xs font-semibold text-foreground">উদাহরণ: তেজস্ক্রিয় পরমাণু ভাঙন।</div>
                      </div>

                      {/* Force 3 */}
                      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">৩. তড়িৎ-চৌম্বক বল</span>
                          <span className="font-mono font-bold text-muted-foreground">১০³⁶</span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          আধানযুক্ত (Charge) বস্তুর মধ্যকার আকর্ষণ বা বিকর্ষণ বল। মহাকর্ষের চেয়ে <RenderMathText text="$10^{36}$" /> গুণ শক্তিশালী, পাল্লা অসীম।
                        </p>
                        <div className="text-xs font-semibold text-foreground">উদাহরণ: ঘর্ষণ, প্রসারণ, চৌম্বকত্ব।</div>
                      </div>

                      {/* Force 4 */}
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-600 dark:text-rose-400">৪. সবল নিউক্লীয় বল</span>
                          <span className="font-mono font-bold text-muted-foreground">১০³⁸ (শীর্ষ)</span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          প্রকৃতির সবচেয়ে শক্তিশালী বল। নিউক্লিয়াসের ভেতর প্রোটন ও নিউট্রনকে একত্রে বেঁধে রাখে (<RenderMathText text="$10^{-15}\text{ m}$" />)।
                        </p>
                        <div className="text-xs font-semibold text-foreground">উদাহরণ: পারমাণবিক শক্তি, নিউক্লিয়াস।</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 2: MOMENTUM & NEWTON'S 2ND LAW (F = ma) */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  {/* Interactive F = ma Accelerator Lab */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. নিউটনের ২য় সূত্র ও ত্বরণ ল্যাব (Newton's 2nd Law: F = ma)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          প্রযুক্ত বল (<RenderMathText text="$F$" />), বস্তুর ভর (<RenderMathText text="$m$" />) ও ঘর্ষণ বল (<RenderMathText text="$f_k$" />) পরিবর্তন করে কার্যকর ত্বরণ পরীক্ষা করো
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCarAnimPos(10);
                          setIsAccelerating(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>সিমুলেশন চালান</span>
                      </button>
                    </div>

                    {/* Visual Friction Track Canvas */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      {/* Moving Object Track */}
                      <div className="h-32 relative flex items-center overflow-hidden border-b-2 border-dashed border-slate-700">
                        {/* Moving Block / Cart */}
                        <div
                          className="absolute bottom-2 flex flex-col items-center transition-all duration-75"
                          style={{ left: `${carAnimPos}%` }}
                        >
                          {/* Force Arrow Overlay */}
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mb-1">
                            <span>F = {appliedForceF} N</span>
                            <MoveRight className="h-4 w-4" />
                          </div>

                          {/* Block representation */}
                          <div className="w-16 h-12 rounded-xl bg-primary text-white font-bold flex flex-col items-center justify-center text-xs shadow-lg border border-primary/40">
                            <span>{objectMassM} kg</span>
                            <span className="text-[9px] opacity-80">ব্লক</span>
                          </div>

                          {/* Friction Force Arrow pointing opposite */}
                          {surfaceFrictionFk > 0 && (
                            <div className="text-[9px] font-semibold text-rose-400 mt-1">
                              ← fk = {surfaceFrictionFk} N
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Live Sliders for F, m, fk */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Force Slider */}
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">প্রযুক্ত বল (F):</span>
                            <span className="font-mono font-bold text-emerald-400">{appliedForceF} N</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={appliedForceF}
                            onChange={(e) => setAppliedForceF(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Mass Slider */}
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">বস্তুর ভর (m):</span>
                            <span className="font-mono font-bold text-primary">{objectMassM} kg</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={objectMassM}
                            onChange={(e) => setObjectMassM(Number(e.target.value))}
                            className="w-full accent-primary h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Friction Slider */}
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">মেঝের ঘর্ষণ (fk):</span>
                            <span className="font-mono font-bold text-rose-400">{surfaceFrictionFk} N</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            step="5"
                            value={surfaceFrictionFk}
                            onChange={(e) => setSurfaceFrictionFk(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Calculated Quantities Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                        <div className="font-bold text-muted-foreground text-xs">কার্যকর লব্ধি বল (Net Force):</div>
                        <div className="font-mono text-base font-bold text-emerald-600">
                          <RenderMathText text={`$F_{\\text{net}} = F - f_k = ${appliedForceF} - ${surfaceFrictionFk} = ${netForce}\\text{ N}$`} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">ঘর্ষণ কাটিয়ে যে বল ত্বরণ সৃষ্টি করে।</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                        <div className="font-bold text-muted-foreground text-xs">অর্জিত ত্বরণ (Acceleration):</div>
                        <div className="font-mono text-base font-bold text-primary">
                          <RenderMathText text={`$a = \\frac{F_{\\text{net}}}{m} = \\frac{${netForce}}{${objectMassM}} = ${calcAccel}\\text{ ms}^{-2}$`} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">ভর বাড়লে ত্বরণ কমে, বল বাড়লে বাড়ে।</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1">
                        <div className="font-bold text-muted-foreground text-xs">ভরবেগ (Momentum p = mv):</div>
                        <div className="font-mono text-base font-bold text-indigo-600">
                          <RenderMathText text={`$p = ${calcMomentum}\\text{ kg ms}^{-1}$`} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">৩ সেকেন্ড পর অর্জিত মোট ভরবেগ।</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 3: NEWTON'S 3RD LAW & GUN RECOIL */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  {/* Gun Recoil Interactive Simulation */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. বন্দুক ও গুলির পশ্চাৎবেগ ল্যাব (Gun Recoil Simulator)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          গুলি সামনের দিকে ছুঁড়লে বন্দুক কেন পেছনের দিকে ধাক্কা দেয়? (NCTB পৃষ্ঠা ৮২-৮৪)
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setHasFired(true);
                          setTimeout(() => setHasFired(false), 1200);
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-rose-700 transition-all shadow-sm"
                      >
                        <Crosshair className="h-3.5 w-3.5" />
                        <span>গুলি ছুঁড়ুন (Fire!)</span>
                      </button>
                    </div>

                    {/* Gun & Bullet Track Canvas */}
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="h-32 flex items-center justify-between relative overflow-hidden">
                        {/* Rifle */}
                        <div
                          className={`flex items-center gap-2 transition-transform duration-300 ${
                            hasFired ? '-translate-x-10' : 'translate-x-0'
                          }`}
                        >
                          <div className="px-5 py-3 rounded-2xl bg-slate-700 border-2 border-slate-500 text-white font-bold text-xs shadow-md">
                            🔫 বন্দুক ({gunMassKg} kg)
                          </div>
                          {hasFired && (
                            <div className="text-[10px] text-rose-400 font-bold animate-pulse">
                              ← পশ্চাৎবেগ V = {recoilVelocity} m/s
                            </div>
                          )}
                        </div>

                        {/* Bullet */}
                        <div
                          className={`flex items-center gap-1 transition-all duration-700 ${
                            hasFired ? 'translate-x-48 opacity-100' : 'translate-x-0 opacity-0'
                          }`}
                        >
                          <div className="h-3 w-5 rounded-r-full bg-amber-400 shadow-lg" />
                          <span className="text-[10px] text-amber-300 font-bold">
                            গুলি (v = +{bulletSpeedV} m/s) ➔
                          </span>
                        </div>
                      </div>

                      {/* Sliders for Bullet Mass, Bullet Speed, Gun Mass */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">গুলির ভর (m):</span>
                            <span className="font-mono font-bold text-amber-400">{bulletMassG} g</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={bulletMassG}
                            onChange={(e) => setBulletMassG(Number(e.target.value))}
                            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">গুলির বেগ (v):</span>
                            <span className="font-mono font-bold text-emerald-400">{bulletSpeedV} m/s</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="800"
                            step="50"
                            value={bulletSpeedV}
                            onChange={(e) => setBulletSpeedV(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">বন্দুকের ভর (M):</span>
                            <span className="font-mono font-bold text-primary">{gunMassKg} kg</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={gunMassKg}
                            onChange={(e) => setGunMassKg(Number(e.target.value))}
                            className="w-full accent-primary h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Derivation Card */}
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs sm:text-sm">
                      <div className="font-bold text-foreground">গাণিতিক প্রতিপাদন (ভরবেগের সংরক্ষণ সূত্র):</div>
                      <div className="p-3 rounded-xl bg-muted/40 font-mono space-y-1 text-muted-foreground">
                        <div>
                          <RenderMathText text="গুলি ছোঁড়ার পূর্বে আদি ভরবেগ $= 0$" />
                        </div>
                        <div>
                          <RenderMathText text="$0 = MV + mv \implies MV = -mv \implies V = -\frac{mv}{M}$" />
                        </div>
                        <div className="text-foreground font-bold pt-1">
                          <RenderMathText
                            text={`$V = -\\frac{(${bulletMassKg}\\text{ kg} \\times ${bulletSpeedV}\\text{ m/s})}{${gunMassKg}\\text{ kg}} = ${recoilVelocity}\\text{ m/s}$`}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        মাইনাস চিহ্ন নির্দেশ করে বন্দুকটি গুলির গতির বিপরীত দিকে (পেছনে) প্রতিক্ষিপ্ত হবে।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 4: CONSERVATION OF MOMENTUM & COLLISION LAB */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  {/* 2-Car Collision Track */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. দ্বিমুখী সংঘর্ষ ও মিলিত বেগ ল্যাব (Collision & Combined Velocity)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          দুটি যান পরস্পর বিপরীত দিক থেকে এসে সংঘর্ষে লিপ্ত হলে মিলিত বেগের পরিবর্তন (NCTB পৃষ্ঠা ৮৫-৮৯)
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsColliding(true);
                          setCollisionDone(false);
                          setTimeout(() => {
                            setIsColliding(false);
                            setCollisionDone(true);
                          }, 1000);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-amber-700 transition-all shadow-sm"
                      >
                        <Flame className="h-3.5 w-3.5" />
                        <span>সংঘর্ষ ঘটান</span>
                      </button>
                    </div>

                    {/* Collision Track Canvas */}
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="h-32 flex items-center justify-center relative overflow-hidden border-b border-dashed border-slate-700">
                        {/* Vehicle 1 (Car) */}
                        <div
                          className={`absolute flex flex-col items-center gap-1 transition-all duration-700 ${
                            isColliding || collisionDone ? 'left-[26%]' : 'left-8'
                          }`}
                        >
                          <div className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md">
                            🚗 গাড়ি ({car1Mass} kg)
                          </div>
                          <span className="text-[10px] text-sky-300 font-mono whitespace-nowrap">
                            u₁ = +{car1Speed} m/s ➔
                          </span>
                        </div>

                        {/* Central Crash / Result Badge */}
                        <div className="z-20 flex flex-col items-center justify-center min-w-[140px]">
                          {isColliding ? (
                            <span className="text-3xl animate-bounce">💥</span>
                          ) : collisionDone ? (
                            <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95">
                              <span className="text-2xl">💥</span>
                              <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-xs whitespace-nowrap shadow-lg">
                                মিলিত বেগ V = {((car1Mass * car1Speed + car2Mass * car2Speed) / (car1Mass + car2Mass)).toFixed(2)} m/s
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-mono">ট্র্যাক সংঘর্ষ অঞ্চল</span>
                          )}
                        </div>

                        {/* Vehicle 2 (Truck) */}
                        <div
                          className={`absolute flex flex-col items-center gap-1 transition-all duration-700 ${
                            isColliding || collisionDone ? 'right-[26%]' : 'right-8'
                          }`}
                        >
                          <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md">
                            🚛 ট্রাক ({car2Mass} kg)
                          </div>
                          <span className="text-[10px] text-rose-300 font-mono whitespace-nowrap">
                            ⬅ u₂ = {car2Speed} m/s
                          </span>
                        </div>
                      </div>

                      {/* Sliders for Car & Truck */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">গাড়ির ভর (m₁):</span>
                          <span className="block font-mono font-bold text-sky-400 text-xs">{car1Mass} kg</span>
                          <input
                            type="range"
                            min="500"
                            max="2000"
                            step="100"
                            value={car1Mass}
                            onChange={(e) => setCar1Mass(Number(e.target.value))}
                            className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">গাড়ির বেগ (u₁):</span>
                          <span className="block font-mono font-bold text-sky-400 text-xs">+{car1Speed} m/s</span>
                          <input
                            type="range"
                            min="2"
                            max="25"
                            value={car1Speed}
                            onChange={(e) => setCar1Speed(Number(e.target.value))}
                            className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">ট্রাকের ভর (m₂):</span>
                          <span className="block font-mono font-bold text-rose-400 text-xs">{car2Mass} kg</span>
                          <input
                            type="range"
                            min="1000"
                            max="6000"
                            step="500"
                            value={car2Mass}
                            onChange={(e) => setCar2Mass(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">ট্রাকের বেগ (u₂):</span>
                          <span className="block font-mono font-bold text-rose-400 text-xs">{car2Speed} m/s</span>
                          <input
                            type="range"
                            min="-20"
                            max="-1"
                            value={car2Speed}
                            onChange={(e) => setCar2Speed(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Combined Velocity Result Box */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                      <div>
                        <div className="font-bold text-foreground">সংঘর্ষের পর মিলিত বেগ (Combined Velocity V):</div>
                        <div className="font-mono text-primary font-bold text-base mt-1">
                          <RenderMathText
                            text={`$V = \\frac{m_1u_1 + m_2u_2}{m_1 + m_2} = \\frac{(${car1Mass} \\times ${car1Speed}) + (${car2Mass} \\times (${car2Speed}))}{${car1Mass} + ${car2Mass}} = ${combinedVelocity}\\text{ m/s}$`}
                          />
                        </div>
                      </div>

                      <div className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-muted-foreground">
                        {combinedVelocity < 0 ? (
                          <span className="text-rose-500 font-bold">⬅ ট্রাকের গতির দিকে চলবে</span>
                        ) : (
                          <span className="text-sky-500 font-bold">গাড়ির গতির দিকে চলবে ➔</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 5: FRICTION TYPES & FRICTION LAB */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  {/* 4 Friction Types Classifier */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-foreground">
                        ১. ঘর্ষণের ৪টি রূপভেদ (4 Types of Friction)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        বস্তুর গতির ধরণের উপর নির্ভর করে ঘর্ষণ চার রকম হতে পারে (NCTB পৃষ্ঠা ৯০-৯২)
                      </p>
                    </div>

                    {/* Selector Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'static', label: '১. স্থিতি ঘর্ষণ', sub: 'Static Friction' },
                        { id: 'sliding', label: '২. পিছলানো ঘর্ষণ', sub: 'Sliding Friction' },
                        { id: 'rolling', label: '৩. আবর্ত ঘর্ষণ', sub: 'Rolling Friction' },
                        { id: 'fluid', label: '৪. প্রবাহী ঘর্ষণ', sub: 'Fluid Friction' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFrictionType(item.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            frictionType === item.id
                              ? 'bg-primary/10 border-primary text-primary shadow-xs'
                              : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{item.sub}</div>
                        </button>
                      ))}
                    </div>

                    {/* Interactive Explanation Card */}
                    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-3">
                      {frictionType === 'static' && (
                        <div className="space-y-2 text-xs sm:text-sm">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <span>🛑</span>
                            <span>স্থিতি ঘর্ষণ (Static Friction):</span>
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            একটি স্থির বস্তুকে অপর একটি তলের ওপর দিয়ে গতিশীল করার চেষ্টা করার সময় যে ঘর্ষণ বল কাজ করে। এই ঘর্ষণ বলের কারণেই মানুষ মেঝের ওপর পা পিছলে না পড়ে নিরাপদে হাঁটতে পারে।
                          </p>
                          <div className="p-3 rounded-xl bg-card border border-border text-foreground font-medium text-xs">
                            💡 বাস্তব উদাহরণ: মেঝেতে ভারী আলমারি ধাক্কা দিলে যতক্ষণ না নড়ে, ততক্ষণ স্থিতি ঘর্ষণ কাজ করে।
                          </div>
                        </div>
                      )}

                      {frictionType === 'sliding' && (
                        <div className="space-y-2 text-xs sm:text-sm">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <span>🎿</span>
                            <span>পিছলানো ঘর্ষণ (Sliding Friction):</span>
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            যখন একটি বস্তু অপর একটি তলের ওপর দিয়ে পিছলে বা ঘষে চলতে থাকে, তখন গতির বিপরীতে যে ঘর্ষণ বল তৈরি হয় তাকে পিছলানো ঘর্ষণ বলে।
                          </p>
                          <div className="p-3 rounded-xl bg-card border border-border text-foreground font-medium text-xs">
                            💡 বাস্তব উদাহরণ: সাইকেলের ব্রেক চাপলে ব্রেক সু চাকার রিমকে চেপে ধরে পিছলানো ঘর্ষণের মাধ্যমে চাকার গতি থামিয়ে দেয়।
                          </div>
                        </div>
                      )}

                      {frictionType === 'rolling' && (
                        <div className="space-y-2 text-xs sm:text-sm">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <span>🛞</span>
                            <span>আবর্ত ঘর্ষণ (Rolling Friction):</span>
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            যখন কোনো বস্তু অপর একটি তলের ওপর দিয়ে গড়িয়ে (Roll) চলে, তখন যে ঘর্ষণ বল উৎপন্ন হয়। চার প্রকার ঘর্ষণের মধ্যে আবর্ত ঘর্ষণের মান সবচেয়ে কম।
                          </p>
                          <div className="p-3 rounded-xl bg-card border border-border text-foreground font-medium text-xs">
                            💡 বাস্তব উদাহরণ: ভারী সুটকেসে চাকা লাগানো থাকলে খুব সহজে টানা যায়; মেশিনে বল-বিয়ারিং ব্যবহার করা হয়।
                          </div>
                        </div>
                      )}

                      {frictionType === 'fluid' && (
                        <div className="space-y-2 text-xs sm:text-sm">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <span>🪂</span>
                            <span>প্রবাহী ঘর্ষণ (Fluid Friction):</span>
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            কোনো বস্তু যখন গ্যাসীয় বা তরল পদার্থের (যেমন বাতাস বা পানি) মধ্য দিয়ে গতিশীল হয়, তখন তরল বা গ্যাস যে বাধা প্রদান করে।
                          </p>
                          <div className="p-3 rounded-xl bg-card border border-border text-foreground font-medium text-xs">
                            💡 বাস্তব উদাহরণ: প্যারাস্যুট দিয়ে মাটিতে নিরাপদে অবতরণ করা, মাছের পানির ভেতর মসৃণ চলাচল।
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  disabled={activeLesson <= 1}
                  onClick={() => setActiveLesson((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  পূর্ববর্তী পাঠ
                </button>

                <div className="text-xs text-muted-foreground font-medium">
                  পাঠ {activeLesson} / ৫
                </div>

                <button
                  onClick={() => {
                    if (activeLesson < 5) {
                      setActiveLesson((prev) => prev + 1);
                      if (!completedLessons.includes(activeLesson + 1)) {
                        setCompletedLessons((prev) => [...prev, activeLesson + 1]);
                      }
                    } else {
                      setActiveStep(2);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>{activeLesson < 5 ? 'পরবর্তী পাঠে যান' : 'ধাপ ২: উদাহরণ দেখুন'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SEE EXAMPLE (Board Standard Solutions & Examiner Marking Rubric) */}
          {activeStep === 2 && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      ২. উদাহরণ দেখি • বোর্ড স্ট্যান্ডার্ড ধাপে ধাপে সমাধান
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      এসএসসি পরীক্ষার পূর্ণমানের সৃজনশীল প্রশ্ন ও পরীক্ষকের মার্কিং রুব্রিক
                    </p>
                  </div>

                  {/* Example Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 1, label: '১. ফারুকের বাক্স টানা (বই)' },
                      { id: 2, label: '২. গাড়ি ও ট্রাকের সংঘর্ষ (বই)' },
                      { id: 3, label: '৩. বন্দুকের পশ্চাৎবেগ (ঢাকা)' },
                      { id: 4, label: '৪. ভরবেগ সংরক্ষণ (রাজশাহী)' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedExampleTab(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          selectedExampleTab === tab.id
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Example 1: Faruque pulls 4 kg box (Textbook CQ 1) */}
                {selectedExampleTab === 1 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (পাঠ্যবই নমুনা সৃজনশীল ১):</div>
                      <RenderMathText text="ফারুক ৪ কেজি ভরের একটি বাক্স মেঝের ওপর একটি ধ্রুব বলে টানছে। মেঝে ও বাক্সের মধ্যকার ঘর্ষণ বল $1.5\text{ N}$। টানার সময় বাক্সটি $0.8\text{ ms}^{-2}$ সুষম ত্বরণে চলে। এরপর একই বলে ঘর্ষণহীন মেঝেতে টানা হলো। ঘর্ষণযুক্ত ও ঘর্ষণহীন মেঝেতে ত্বরণের কী পরিবর্তন ঘটবে? গাণিতিকভাবে ব্যাখ্যা করো।" />
                    </div>

                    <div className="space-y-2">
                      <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                        <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">১</span>
                        <div>
                          <div className="text-muted-foreground text-xs">প্রথম ক্ষেত্রে কার্যকর লব্ধি বল:</div>
                          <div className="text-foreground font-mono">
                            <RenderMathText text="$F_{\text{net}} = ma = 4\text{ kg} \times 0.8\text{ ms}^{-2} = 3.2\text{ N}$" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                        <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">২</span>
                        <div>
                          <div className="text-muted-foreground text-xs">ফারুকের প্রযুক্ত আসল বল ($F$):</div>
                          <div className="text-foreground font-mono">
                            <RenderMathText text="$F_{\text{net}} = F - f_k \implies F = F_{\text{net}} + f_k = 3.2 + 1.5 = 4.7\text{ N}$" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                        <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0">৩</span>
                        <div>
                          <div className="text-muted-foreground text-xs">ঘর্ষণহীন মেঝেতে ত্বরণ ($a'$):</div>
                          <div className="text-foreground font-mono">
                            <RenderMathText text="$f_k = 0 \implies a' = \frac{F}{m} = \frac{4.7}{4} = 1.175\text{ ms}^{-2}$" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        <RenderMathText text="✓ ত্বরণের পরিবর্তন $\Delta a = a' - a = 1.175 - 0.8 = 0.375\text{ ms}^{-2}$ বৃদ্ধি পাবে!" />
                      </div>
                    </div>

                    {/* Expandable Examiner Marking Rubric Drawer */}
                    <div className="border border-border/80 rounded-2xl overflow-hidden bg-muted/20">
                      <button
                        onClick={() => setIsRubricOpen(!isRubricOpen)}
                        className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-foreground hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-rose-500">
                          <HelpCircle className="h-4 w-4" />
                          <span>পরীক্ষকের গোপন কথা: &quot;কেন নম্বর কাটা যায়?&quot; (Board Marking Rubric)</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isRubricOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isRubricOpen && (
                        <div className="p-4 pt-0 space-y-2.5 text-xs text-muted-foreground border-t border-border/60">
                          <div className="p-2.5 rounded-xl bg-card border border-border">
                            <span className="font-bold text-foreground">১ নম্বর ফাঁদ (ঘর্ষণ বল বিয়োগ/যোগ):</span> অনেকেই সরাসরি <RenderMathText text="$F = 3.2\text{ N}$" /> ধরে ঘর্ষণহীন মেঝের ত্বরণ বের করে ফেলে। ঘর্ষণ থাকলে প্রযুক্ত বল <RenderMathText text="$F = ma + f_k = 4.7\text{ N}$" /> হয়, তা স্পষ্ট না লিখলে গ-বিভাগে ২ নম্বর কাটা যায়!
                          </div>
                          <div className="p-2.5 rounded-xl bg-card border border-border">
                            <span className="font-bold text-foreground">পার্থক্য না দেখানো:</span> শুধু নতুন ত্বরণ বের করে রেখে দিলে ঘ-বিভাগে পূর্ণ নম্বর মিলবে না; ত্বরণ কতটা বৃদ্ধি পেল (<RenderMathText text="$\Delta a = 0.375\text{ ms}^{-2}$" />) তা উল্লেখ বাধ্যতামূলক!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Example 2: Car and Truck Collision (Textbook CQ 2) */}
                {selectedExampleTab === 2 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (পাঠ্যবই নমুনা সৃজনশীল ২):</div>
                      <RenderMathText text="একটি ১০০০ কেজি ভরের প্রাইভেট কার স্থির অবস্থান থেকে $1000\text{ N}$ বলে ৩ সেকেন্ড চলল। মেঝের ঘর্ষণ বল ছিল $200\text{ N}$। ৫ সেকেন্ড পর এটি বিপরীত দিক থেকে আসা ৬০০০ কেজি ভরের সমবেগে চলা ($6\text{ m/s}$) একটি ট্রাকের সাথে মুখোমুখি সংঘর্ষে লিপ্ত হলো। সংঘর্ষের পর গাড়ি দুটির মিলিত বেগ কত হবে?" />
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="১. গাড়ির ত্বরণ: $a = \frac{F - f_k}{m} = \frac{1000 - 200}{1000} = \frac{800}{1000} = 0.8\text{ ms}^{-2}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="২. ৩ সেকেন্ড পর গাড়ির বেগ: $v = u + at = 0 + (0.8 \times 3) = 2.4\text{ ms}^{-1}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="৩. সংঘর্ষের পূর্বে গাড়ির বেগ $u_1 = +2.4\text{ m/s}$, বিপরীতমুখী ট্রাকের বেগ $u_2 = -6\text{ m/s}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="৪. মিলিত বেগ: $V = \frac{m_1u_1 + m_2u_2}{m_1 + m_2} = \frac{1000(2.4) + 6000(-6)}{1000 + 6000} = \frac{2400 - 36000}{7000} = -4.8\text{ ms}^{-1}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        <RenderMathText text="✓ গাড়ি দুটি একত্রে ৪.৮ m/s বেগে ট্রাকের গতির দিকে (পেছনে) পিছিয়ে যাবে এবং প্রাইভেট কারটি মারাত্মকভাবে ক্ষতিগ্রস্ত হবে!" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Example 3: Gun Recoil (Dhaka Board) */}
                {selectedExampleTab === 3 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (ঢাকা বোর্ড):</div>
                      <RenderMathText text="একজন শিকারি ৫ কেজি ভরের একটি বন্দুক দিয়ে ১০ গ্রাম ভরের একটি গুলি $300\text{ m/s}$ বেগে ছুঁড়লেন। বন্দুকের পশ্চাৎবেগ নির্ণয় করো।" />
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="১. একক রূপান্তর: গুলির ভর $m = 10\text{ g} = 0.01\text{ kg}$, বন্দুকের ভর $M = 5\text{ kg}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="২. সংরক্ষণ সূত্র মতে, $MV + mv = 0 \implies V = -\frac{mv}{M}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="৩. পশ্চাৎবেগ: $V = -\frac{0.01 \times 300}{5} = -\frac{3}{5} = -0.6\text{ ms}^{-1}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        <RenderMathText text="✓ বন্দুকটির পশ্চাৎবেগ $0.6\text{ m/s}$ (মাইনাস চিহ্ন পেছনের দিক নির্দেশ করে)।" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Example 4: Momentum Conservation (Rajshahi Board) */}
                {selectedExampleTab === 4 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (রাজশাহী বোর্ড):</div>
                      <RenderMathText text="৪০ কেজি ভরের একটি বালক ৭ কেজি ভরের একটি স্থির নৌকার ওপর থেকে $2\text{ m/s}$ বেগে তীরে লাফ দিল। নৌকাটি কত বেগে পেছনের দিকে সরে যাবে?" />
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• বালকের ভর $m_1 = 40\text{ kg}$, বেগ $v_1 = 2\text{ m/s}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• নৌকার ভর $m_2 = 70\text{ kg}$, নৌকার বেগ $v_2 = ?$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• শর্তমতে, $m_1v_1 + m_2v_2 = 0 \implies v_2 = -\frac{m_1v_1}{m_2} = -\frac{40 \times 2}{70} = -1.14\text{ m/s}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        <RenderMathText text="✓ নৌকাটি ১.১৪ m/s বেগে পেছনের দিকে সরে যাবে!" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  পূর্ববর্তী ধাপ (Learn Concept)
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>ধাপ ৩: নিজে করো (Try Yourself)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRY YOURSELF (Interactive Practice Lab) */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    ৩. নিজে করো • ইন্টারঅ্যাক্টিভ ল্যাব (Interactive Practice Lab)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ৩টি হ্যান্ডস-অন চ্যালেঞ্জ সমাধান করে বোর্ড পরীক্ষার জন্য নিজেকে প্রস্তুত করো
                  </p>
                </div>

                {/* Challenge 1: F = ma solver */}
                <div className="p-4.5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">চ্যালেঞ্জ ০১: বল ও ত্বরণ গণক</span>
                    <span className="text-xs font-mono text-muted-foreground">F = 60 N, m = 6 kg, fk = 12 N</span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <RenderMathText text="৬ কেজি ভরের একটি বস্তুর ওপর ৬০ নিউটন বল প্রয়োগ করা হলো। মেঝের ঘর্ষণ বল ১২ নিউটন হলে বস্তুটির ত্বরণ কত $\text{ms}^{-2}$ হবে?" />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="ত্বরণ লিখুন (যেমন: 8)..."
                      value={challenge1Input}
                      onChange={(e) => setChallenge1Input(e.target.value)}
                      className="p-2.5 rounded-xl bg-card border border-border text-xs font-mono focus:border-primary outline-hidden w-48"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(challenge1Input);
                        if (Math.abs(val - 8) < 0.1) {
                          setChallenge1Feedback({
                            isCorrect: true,
                            text: 'চমৎকার! F_net = 60 - 12 = 48 N। ত্বরণ a = 48 / 6 = 8 ms⁻²। সম্পূর্ণ সঠিক!',
                          });
                        } else {
                          setChallenge1Feedback({
                            isCorrect: false,
                            text: 'ভুল হয়েছে। সূত্র: a = (F - fk) / m ব্যবহার করো।',
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>

                  {challenge1Feedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        challenge1Feedback.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {challenge1Feedback.text}
                    </div>
                  )}
                </div>

                {/* Challenge 2: Gun recoil */}
                <div className="p-4.5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">চ্যালেঞ্জ ০২: বন্দুকের পশ্চাৎবেগ নির্ণয়</span>
                    <span className="text-xs font-mono text-muted-foreground">M = 3 kg, m = 15 g, v = 400 m/s</span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <RenderMathText text="৩ কেজি ভরের বন্দুক থেকে ১৫ গ্রাম ভরের গুলি $400\text{ m/s}$ বেগে নির্গত হলে বন্দুকের পশ্চাৎবেগের মান কত $\text{m/s}$ হবে?" />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="বেগের মান (যেমন: 2)..."
                      value={recoilInput}
                      onChange={(e) => setRecoilInput(e.target.value)}
                      className="p-2.5 rounded-xl bg-card border border-border text-xs font-mono focus:border-primary outline-hidden w-48"
                    />
                    <button
                      onClick={() => {
                        const val = Math.abs(parseFloat(recoilInput));
                        if (Math.abs(val - 2) < 0.1) {
                          setRecoilFeedback({
                            isCorrect: true,
                            text: 'অসাধারণ! m = 0.015 kg। V = (0.015 × 400) / 3 = 6 / 3 = 2 m/s! সঠিক উত্তর।',
                          });
                        } else {
                          setRecoilFeedback({
                            isCorrect: false,
                            text: 'ভুল হয়েছে। ১৫ গ্রামকে কেজিতে রূপান্তর করো (০.০১৫ কেজি) এবং V = mv / M ব্যবহার করো।',
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>

                  {recoilFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        recoilFeedback.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {recoilFeedback.text}
                    </div>
                  )}
                </div>

                {/* Challenge 3: Inelastic Collision */}
                <div className="p-4.5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">চ্যালেঞ্জ ০৩: মিলিত বেগ গোয়েন্দা</span>
                    <span className="text-xs font-mono text-muted-foreground">m1 = 1000 kg (10 m/s), m2 = 500 kg (স্থির)</span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <RenderMathText text="১০০০ কেজি ভরের একটি চলন্ত গাড়ি ($10\text{ m/s}$) একটি স্থির ৫০০ কেজি ভরের গাড়ির সাথে সংঘর্ষের পর আটকে গেলে মিলিত বেগ কত $\text{m/s}$ হবে?" />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="মিলিত বেগ (যেমন: 6.67)..."
                      value={collisionInput}
                      onChange={(e) => setCollisionInput(e.target.value)}
                      className="p-2.5 rounded-xl bg-card border border-border text-xs font-mono focus:border-primary outline-hidden w-48"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(collisionInput);
                        if (Math.abs(val - 6.67) < 0.1 || Math.abs(val - 6.66) < 0.1) {
                          setCollisionFeedback({
                            isCorrect: true,
                            text: 'চমৎকার! V = (1000 × 10 + 0) / (1000 + 500) = 10000 / 1500 = 6.67 m/s। একদম নিখুঁত!',
                          });
                        } else {
                          setCollisionFeedback({
                            isCorrect: false,
                            text: 'আবার চেষ্টা করো! সূত্র: V = (m1u1 + m2u2) / (m1 + m2) ব্যবহার করো।',
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>

                  {collisionFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        collisionFeedback.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {collisionFeedback.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  পূর্ববর্তী ধাপ (See Example)
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>ধাপ ৪: মূল্যায়ন (Check Understanding)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CHECK UNDERSTANDING (Authentic Board MCQs) */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    ৪. মূল্যায়ন • পদার্থবিজ্ঞান বল বোর্ড কুইজ (Check Understanding)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    এনসিটিবি পাঠ্যবই ও বিগত ৫ বছরের ঢাকা, চট্টগ্রাম ও রাজশাহী বোর্ডের শীর্ষ ৫টি প্রশ্ন
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      q: 'বলের মাত্রা সমীকরণ কোনটি?',
                      tag: 'পাঠ্যবই নমুনা প্রশ্ন ২',
                      opts: ['$[MLT^{-2}]$', '$[MLT^{-1}]$', '$[ML^{-2}T^{-2}]$', '$[M^{-1}LT^{-2}]$'],
                      ans: 0,
                      exp: 'বল $F = ma$। ভরের মাত্রা $[M]$ এবং ত্বরণের মাত্রা $[LT^{-2}]$। সুতরাং বলের মাত্রা $[F] = [MLT^{-2}]$।',
                    },
                    {
                      id: 2,
                      q: 'ভরবেগের এসআই (SI) একক কোনটি?',
                      tag: 'পাঠ্যবই নমুনা প্রশ্ন ৩',
                      opts: ['$\\text{kg}\\cdot\\text{m}$', '$\\text{kg}\\cdot\\text{ms}^{-1}$', '$\\text{kg}\\cdot\\text{m}^2\\text{s}^{-1}$', '$\\text{kg}\\cdot\\text{ms}^{-2}$'],
                      ans: 1,
                      exp: 'ভরবেগ $p = mv$। ভরের একক $\\text{kg}$ এবং বেগের একক $\\text{ms}^{-1}$। তাই ভরবেগের একক $\\text{kg}\\cdot\\text{ms}^{-1}$।',
                    },
                    {
                      id: 3,
                      q: '৫ কেজি ভরের কোনো বস্তুর ওপর ৫০ নিউটন বল প্রয়োগ করলে ত্বরণ কত হবে?',
                      tag: 'পাঠ্যবই নমুনা প্রশ্ন ৪',
                      opts: ['$12\\text{ ms}^{-2}$', '$8\\text{ ms}^{-2}$', '$10\\text{ ms}^{-2}$', '$250\\text{ ms}^{-2}$'],
                      ans: 2,
                      exp: '$F = ma$ সূত্রানুসারে, $a = \\frac{F}{m} = \\frac{50}{5} = 10\\text{ ms}^{-2}$।',
                    },
                    {
                      id: 4,
                      q: 'কোন বলের কারণে নিউক্লিয়াসে প্রোটন ও নিউট্রন একসাথে আবদ্ধ থাকে?',
                      tag: 'বোর্ড পরীক্ষা ক্লাসিক',
                      opts: ['মহাকর্ষ বল', 'তড়িৎ-চৌম্বক বল', 'দুর্বল নিউক্লীয় বল', 'সবল নিউক্লীয় বল'],
                      ans: 3,
                      exp: 'সবল নিউক্লীয় বল (Strong Nuclear Force) প্রকৃতির সবচেয়ে শক্তিশালী বল যা প্রোটন ও নিউট্রনকে নিউক্লিয়াসের ভেতর দৃঢ়ভাবে ধরে রাখে।',
                    },
                    {
                      id: 5,
                      q: 'চার প্রকার ঘর্ষণের মধ্যে কোনটির বাধার মান সবচেয়ে কম?',
                      tag: 'বোর্ড পরীক্ষা ক্লাসিক',
                      opts: ['স্থিতি ঘর্ষণ', 'পিছলানো ঘর্ষণ', 'আবর্ত ঘর্ষণ', 'প্রবাহী ঘর্ষণ'],
                      ans: 2,
                      exp: 'আবর্ত ঘর্ষণে (Rolling Friction) তলদ্বয়ের মধ্যে শুধুমাত্র স্পর্শকীয় ঘূর্ণন ঘটে, তাই এর বাধার মান সবচেয়ে কম। এজন্যই চাকায় বল-বিয়ারিং ব্যবহার করা হয়।',
                    },
                  ].map((mcq, idx) => {
                    const userSelected = selectedAnswers[mcq.id];
                    const isAnswered = userSelected !== undefined;
                    const isCorrect = userSelected === mcq.ans;

                    return (
                      <div key={mcq.id} className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-primary font-bold">{mcq.tag}</span>
                          <span className="text-muted-foreground font-mono">প্রশ্ন {idx + 1} / ৫</span>
                        </div>

                        <h4 className="font-bold text-sm text-foreground">{mcq.q}</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {mcq.opts.map((opt, optIdx) => {
                            const isThisOptionSelected = userSelected === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [mcq.id]: optIdx }))
                                }
                                className={`p-3 rounded-xl border text-left font-mono transition-all ${
                                  isThisOptionSelected
                                    ? optIdx === mcq.ans
                                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                      : 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                                    : 'bg-card border-border hover:bg-muted text-foreground'
                                }`}
                              >
                                <RenderMathText text={opt} />
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div
                            className={`p-3 rounded-xl text-xs ${
                              isCorrect
                                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                            }`}
                          >
                            <span className="font-bold">{isCorrect ? '✓ সঠিক উত্তর!' : '✗ ভুল উত্তর!'}</span>{' '}
                            <RenderMathText text={mcq.exp} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  পূর্ববর্তী ধাপ (Try Yourself)
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>ধাপ ৫: সারসংক্ষেপ (Summary)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUMMARY (Cheat-Sheet & Board Traps) */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-foreground">
                        ৫. সারসংক্ষেপ • পদার্থবিজ্ঞান অধ্যায় ৩ রিভিশন চিট-শিট
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        বোর্ড পরীক্ষার আগের রাতের জন্য সূত্র, সংঘর্ষ ও সতর্কতার হ্যান্ডনোট
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopySummaryNotes}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20 transition-all"
                  >
                    {copiedNote ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedNote ? 'কপি হয়েছে! ✓' : 'নোট কপি করুন'}</span>
                  </button>
                </div>

                {/* Section 1: Master Formulas of Force */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>⚡</span>
                    <span>বল ও ভরবেগের মৌলিক সূত্রাবলী (Master Formulae of Dynamics)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-primary">১. নিউটনের ২য় সূত্র:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$F = ma = \frac{mv - mu}{t}$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="বল $=$ ভর $\times$ ত্বরণ। একক: $\text{N}$।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-emerald-600">২. কার্যকর বল ও ঘর্ষণ:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$F_{\text{net}} = F - f_k = ma$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="ঘর্ষণ থাকলে কার্যকর ত্বরণ $a = \frac{F - f_k}{m}$।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-amber-600">৩. ভরবেগের সংরক্ষণ সূত্র:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="সংঘর্ষের পূর্বের ভরবেগ $=$ পরের ভরবেগ।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-indigo-600">৪. মিলিত বেগ (Combined Velocity):</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$V = \frac{m_1u_1 + m_2u_2}{m_1 + m_2}$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="সংঘর্ষের পর বস্তুদ্বয় একসাথে আটকে গেলে।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-rose-500">৫. বন্দুকের পশ্চাৎবেগ (Recoil):</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$V = -\frac{mv}{M}$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="মাইনাস চিহ্ন পেছনের দিক নির্দেশ করে।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-sky-500">৬. ঘর্ষণ বল (Friction):</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$f_s = \mu_s R, f_k = \mu_k mg$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="অভিলম্ব প্রতিক্রিয়া $R = mg$।" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Top Board Traps */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>⚠️</span>
                    <span>পদার্থবিজ্ঞান অধ্যায় ৩ এর শীর্ষ ৪টি বোর্ড ফাঁদ (Board Traps)</span>
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm text-foreground">
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ১:</span>
                      <div>
                        <RenderMathText text="সংঘর্ষে বিপরীত দিকের বেগ: বিপরীত দিক থেকে আসা গাড়ির বেগের আগে অবশ্যই মাইনাস চিহ্ন ($-u_2$) বসাতে হবে। মাইনাস না বসালে পুরো অংক ভুল হবে!" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ২:</span>
                      <div>
                        <RenderMathText text="গ্রাম থেকে কেজিতে রূপান্তর: গুলির ভর সাধারণত গ্রামে ($10\text{ g}$) দেওয়া থাকে। একে $1000$ দিয়ে ভাগ করে $0.01\text{ kg}$ না বানালে পশ্চাৎবেগের মান ১০০০ গুণ বড় হয়ে যাবে!" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ৩:</span>
                      <div>
                        <RenderMathText text="ঘর্ষণ বলের বিভ্রান্তি: প্রশ্নে প্রযুক্ত বল $F$ এবং ঘর্ষণ বল $f_k$ দেওয়া থাকলে ত্বরণ হবে $a = \frac{F - f_k}{m}$, কিন্তু অনেকেই ভুল করে সরাসরি $F = ma$ বসিয়ে ফেলে।" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ৪:</span>
                      <div>
                        <RenderMathText text="ক্রিয়া ও প্রতিক্রিয়া বলের ভুল ধারণা: ক্রিয়া ও প্রতিক্রিয়া বল দুটি ভিন্ন বস্তুর ওপর কাজ করে। একই বস্তুর ওপর কাজ করে না বলেই তারা কখনো পরস্পরকে নিষ্ক্রিয় বা কাটাকাটি করে দেয় না।" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Completion Action Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-amber-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-black text-base sm:text-lg text-foreground">
                      🎉 অভিনন্দন! বল অধ্যায়টির সম্পূর্ণ প্রস্তুতি সম্পন্ন হয়েছে।
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      এখন তুমি এসএসসি বোর্ড পরীক্ষায় বল ও ভরবেগের যেকোনো সৃজনশীল ও বহুনির্বাচনী সমাধান করতে প্রস্তুত।
                    </p>
                  </div>
                  <Link
                    href="/dashboard/playground/v2"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-sm shrink-0"
                  >
                    পরবর্তী অধ্যায়ে যান (অধ্যায় ৪: কাজ, শক্তি ও ক্ষমতা) ➔
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT DRAWER: Dedicated Socratic AI Physics Tutor */}
        <aside className="w-80 border-l border-border/80 bg-card/60 backdrop-blur-xs hidden xl:flex flex-col shrink-0 p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground">AI শিক্ষক</h4>
                <p className="text-[10px] text-muted-foreground">পদার্থবিজ্ঞান সহায়ক</p>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            <div className="p-3 rounded-2xl bg-muted/30 border border-border leading-relaxed text-muted-foreground">
              স্বাগতম পদার্থবিজ্ঞান বল (Force) ল্যাবে! নিউটনের সূত্রাবলি, ভরবেগ, বন্দুকের পশ্চাৎবেগ বা ঘর্ষণ বল নিয়ে যেকোনো প্রশ্ন করো। আমি ধাপে ধাপে বুঝিয়ে দেবো!
            </div>

            {aiResponse && (
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-foreground space-y-1">
                <div className="font-bold text-primary flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="h-3 w-3" />
                  <span>AI শিক্ষকের ব্যাখ্যা:</span>
                </div>
                <div className="text-xs leading-relaxed">{aiResponse}</div>
              </div>
            )}

            {isAiLoading && (
              <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center gap-2 text-muted-foreground text-xs">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>পদার্থবিজ্ঞানের যুক্তি সাজাচ্ছি...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5 pt-2 border-t border-border/70">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">দ্রুত প্রশ্ন করুন:</span>
            {[
              'নিউটনের ১ম সূত্র ও জড়তা কী?',
              'F = ma ও কার্যকর বল কীভাবে বের করে?',
              'বন্দুকের পশ্চাৎবেগ কীভাবে হিসেব করে?',
              'সংঘর্ষে মিলিত বেগের নিয়ম কী?',
            ].map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleAskAi(preset)}
                className="w-full text-left p-2 rounded-xl bg-card border border-border hover:bg-muted/80 text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 truncate"
              >
                <span>💬</span>
                <span className="truncate">{preset}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl p-1.5 focus-within:border-primary">
              <input
                type="text"
                placeholder="তোমার প্রশ্ন লেখো..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                className="flex-1 bg-transparent border-none text-xs px-2 outline-hidden text-foreground"
              />
              <button
                onClick={() => handleAskAi()}
                disabled={isAiLoading || !aiQuestion.trim()}
                className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* QUICK RESOURCE MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>
                  {activeModal === 'nctb_book' && 'এনসিটিবি পাঠ্যবই রেফারেন্স'}
                  {activeModal === 'notes' && 'অধ্যায় ৩ রিভিশন হ্যান্ডনোট'}
                  {activeModal === 'board_questions' && 'বিগত ৫ বছরের বোর্ড প্রশ্ন'}
                </span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="h-8 w-8 rounded-full bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-border text-xs leading-relaxed space-y-2 text-foreground">
              {activeModal === 'nctb_book' && (
                <div>
                  এনসিটিবি নবম-দশম শ্রেণির পদার্থবিজ্ঞান অধ্যায় ৩: "বল" (পৃষ্ঠা ৬৬-৯৫)। জড়তা, নিউটনের ৩টি সূত্র, ভরবেগ সংরক্ষণ, সংঘর্ষ ও ঘর্ষণের পূর্ণাঙ্গ পাঠ্যক্রম এই ভার্চুয়াল গাইডবুকে সম্পূর্ণ ইন্টারঅ্যাক্টিভ করা হয়েছে।
                </div>
              )}
              {activeModal === 'notes' && (
                <div className="space-y-1.5 font-sans">
                  <div>• <RenderMathText text="নিউটনের ১ম সূত্র: বাহ্যিক বল না দিলে বস্তু জড়তা বজায় রাখে।" /></div>
                  <div>• <RenderMathText text="নিউটনের ২য় সূত্র: $F = ma = \frac{mv - mu}{t}$" /></div>
                  <div>• <RenderMathText text="নিউটনের ৩য় সূত্র: ক্রিয়া ও প্রতিক্রিয়া বল সমান ও বিপরীত ($F_1 = -F_2$)।" /></div>
                  <div>• <RenderMathText text="ভরবেগের সংরক্ষণ: $m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2$" /></div>
                  <div>• <RenderMathText text="বন্দুকের পশ্চাৎবেগ: $V = -\frac{mv}{M}$" /></div>
                </div>
              )}
              {activeModal === 'board_questions' && (
                <div className="space-y-1.5">
                  <div>• ঢাকা বোর্ড ২০২৪: বন্দুক ও গুলির পশ্চাৎবেগ নির্ণয়।</div>
                  <div>• রাজশাহী বোর্ড ২০২৩: দুটি গাড়ির মুখোমুখি সংঘর্ষ ও মিলিত বেগ।</div>
                  <div>• চট্টগ্রাম বোর্ড ২০২৩: ঘর্ষণযুক্ত মেঝেতে বাক্স টানার ত্বরণ পরিবর্তন।</div>
                  <div>• যশোর বোর্ড ২০২২: নৌকা থেকে বালকের লাফ দেওয়ার পর নৌকার বেগ।</div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
