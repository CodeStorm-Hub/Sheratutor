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
  Gauge,
  CircleDot,
  Scale,
  Send,
  ChevronDown,
  Droplets,
  Sun,
  BatteryCharging,
  Compass,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';

type TabStep = 1 | 2 | 3 | 4 | 5;

interface LessonMeta {
  id: number;
  no: string;
  titleBn: string;
  titleEn: string;
  nctbRef: string;
  subtopics: string[];
}

const LESSONS_DATA: Record<number, LessonMeta> = {
  1: {
    id: 1,
    no: '০১',
    titleBn: 'কাজ ও বলের মধ্যবর্তী কোণ',
    titleEn: 'Work & Angle θ Analysis',
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৪: পৃষ্ঠা ১০০-১০৩',
    subtopics: ['কাজের সংজ্ঞা ও শর্ত (W = Fs)', 'ধনাত্মক ও ঋণাত্মক কাজ', 'কাজহীন বল (Zero Work Force)'],
  },
  2: {
    id: 2,
    no: '০২',
    titleBn: 'গতিশক্তি ও কাজ-শক্তি উপপাদ্য',
    titleEn: 'Kinetic Energy & Work-Energy Theorem',
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৪: পৃষ্ঠা ১০৩-১০৬',
    subtopics: ['গতিশক্তির প্রতিপাদন (Ek = ½mv²)', 'ভরবেগ ও গতিশক্তির সম্পর্ক', 'কাজ-শক্তি উপপাদ্য (W = ΔEk)'],
  },
  3: {
    id: 3,
    no: '০৩',
    titleBn: 'বিভবশক্তি ও স্প্রিং-এর শক্তি',
    titleEn: 'Potential Energy & Compressed Spring',
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৪: পৃষ্ঠা ১০৬-১০৮',
    subtopics: ['অভিকর্ষজ বিভবশক্তি (Ep = mgh)', 'স্প্রিং বল ও বিভবশক্তি (Ep = ½kx²)', 'সংকোচন-প্রসারণ ল্যাব'],
  },
  4: {
    id: 4,
    no: '০৪',
    titleBn: 'যান্ত্রিক শক্তির সংরক্ষণশীলতা',
    titleEn: 'Conservation of Mechanical Energy',
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৪: পৃষ্ঠা ১০৮-১১২',
    subtopics: ['মুক্ত পতনে যান্ত্রিক শক্তির ধ্রুবতা', 'A, B ও C বিন্দুতে প্রমাণ', 'Ek = nEp শর্তের উচ্চতা নির্ণয়'],
  },
  5: {
    id: 5,
    no: '০৫',
    titleBn: 'ক্ষমতা ও মোটরের কর্মদক্ষতা (%)',
    titleEn: 'Power & Motor Efficiency (η)',
    nctbRef: 'পদার্থবিজ্ঞান অধ্যায় ৪: পৃষ্ঠা ১২০-১২৩',
    subtopics: ['ক্ষমতার একক ওয়াট ও হর্সপাওয়ার', 'কার্যকর ক্ষমতা বনাম অপচয়', 'পানির পাম্পের কর্মদক্ষতা হিসাব'],
  },
};

export default function PhysicsWorkEnergyGuidebook() {
  const [activeStep, setActiveStep] = useState<TabStep>(1);
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Lesson 1: Work & Angle θ State
  const [appliedForceF, setAppliedForceF] = useState<number>(50); // N
  const [displacementS, setDisplacementS] = useState<number>(10); // m
  const [angleTheta, setAngleTheta] = useState<number>(0); // degrees (0 to 180)

  // Lesson 2: Kinetic Energy State
  const [objectMassM, setObjectMassM] = useState<number>(10); // kg
  const [objectVelocityV, setObjectVelocityV] = useState<number>(12); // m/s
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [ballPosition, setBallPosition] = useState<number>(0);

  // Lesson 3: Spring Potential Energy State
  const [springConstantK, setSpringConstantK] = useState<number>(800); // N/m
  const [springCompressionX, setSpringCompressionX] = useState<number>(0.2); // m (20 cm)

  // Lesson 4: Mechanical Energy Conservation State
  const [fallHeightH, setFallHeightH] = useState<number>(60); // m total height
  const [fallMassM, setFallMassM] = useState<number>(5); // kg
  const [currentHeightRatio, setCurrentHeightRatio] = useState<number>(1); // 1 = top, 0.5 = mid, 0 = ground
  const [isDropping, setIsDropping] = useState<boolean>(false);

  // Lesson 5: Motor Efficiency State
  const [motorPowerKw, setMotorPowerKw] = useState<number>(2.5); // kW
  const [waterVolumeL, setWaterVolumeL] = useState<number>(2000); // Liters = kg
  const [pumpHeightH, setPumpHeightH] = useState<number>(18); // meters
  const [pumpTimeMin, setPumpTimeMin] = useState<number>(3); // minutes
  const [isPumpRunning, setIsPumpRunning] = useState<boolean>(false);
  const [waterTankFill, setWaterTankFill] = useState<number>(30); // %

  // Step 2: See Example State
  const [selectedExampleId, setSelectedExampleId] = useState<number>(1);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // Step 3: Try Yourself State
  const [practiceInput1, setPracticeInput1] = useState<string>('');
  const [practiceFeedback1, setPracticeFeedback1] = useState<{ status: 'idle' | 'correct' | 'wrong'; msg: string }>({
    status: 'idle',
    msg: '',
  });

  const [practiceInput2, setPracticeInput2] = useState<string>('');
  const [practiceFeedback2, setPracticeFeedback2] = useState<{ status: 'idle' | 'correct' | 'wrong'; msg: string }>({
    status: 'idle',
    msg: '',
  });

  const [practiceInput3, setPracticeInput3] = useState<string>('');
  const [practiceFeedback3, setPracticeFeedback3] = useState<{ status: 'idle' | 'correct' | 'wrong'; msg: string }>({
    status: 'idle',
    msg: '',
  });

  // Step 4: Check Understanding State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Step 5: Summary Note Copy State
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Modals & AI Tutor Drawer
  const [activeModal, setActiveModal] = useState<'syllabus' | 'board_questions' | null>(null);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [tutorMessages, setTutorMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([
    {
      sender: 'tutor',
      text: 'স্বাগতম কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy) ভার্চুয়াল ল্যাবে! কাজ, গতিশক্তি, অভিকর্ষজ বিভবশক্তি, শক্তির নিত্যতা কিংবা মোটরের কর্মদক্ষতা (%) সংক্রান্ত যেকোনো প্রশ্ন করো। আমি ধাপে ধাপে বুঝিয়ে দেবো!',
    },
  ]);
  const [userChatInput, setUserChatInput] = useState<string>('');

  // Lesson 2 rolling animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRolling) {
      interval = setInterval(() => {
        setBallPosition((prev) => {
          if (prev >= 85) {
            setIsRolling(false);
            return 85;
          }
          return prev + 5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRolling]);

  // Lesson 4 free-fall animation effect
  useEffect(() => {
    let animId: NodeJS.Timeout;
    if (isDropping) {
      animId = setInterval(() => {
        setCurrentHeightRatio((prev) => {
          if (prev <= 0.05) {
            setIsDropping(false);
            return 0;
          }
          return prev - 0.05;
        });
      }, 60);
    }
    return () => clearInterval(animId);
  }, [isDropping]);

  // Lesson 5 pump animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPumpRunning) {
      interval = setInterval(() => {
        setWaterTankFill((prev) => {
          if (prev >= 95) {
            setIsPumpRunning(false);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPumpRunning]);

  const markLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
    if (lessonId < 5) {
      setActiveLesson(lessonId + 1);
    }
  };

  const currentLessonMeta = LESSONS_DATA[activeLesson] || LESSONS_DATA[1];

  // Helper calculations for Lesson 1 (Work)
  const angleRad = (angleTheta * Math.PI) / 180;
  const cosTheta = Math.cos(angleRad);
  const calculatedWorkJ = appliedForceF * displacementS * cosTheta;

  // Helper calculations for Lesson 2 (Kinetic Energy & Momentum)
  const calculatedEk = 0.5 * objectMassM * objectVelocityV * objectVelocityV;
  const calculatedMomentum = objectMassM * objectVelocityV;

  // Helper calculations for Lesson 3 (Spring Potential Energy)
  const springPotentialEnergy = 0.5 * springConstantK * springCompressionX * springCompressionX;

  // Helper calculations for Lesson 4 (Mechanical Energy Conservation)
  const currentHeightM = fallHeightH * currentHeightRatio;
  const fallenDistanceX = fallHeightH - currentHeightM;
  const currentEp = fallMassM * 9.8 * currentHeightM;
  const currentEk = fallMassM * 9.8 * fallenDistanceX;
  const currentTotalE = currentEp + currentEk;

  // Helper calculations for Lesson 5 (Motor Efficiency)
  const pumpWorkJ = waterVolumeL * 9.8 * pumpHeightH;
  const pumpTimeSec = pumpTimeMin * 60;
  const effectivePowerW = pumpWorkJ / pumpTimeSec;
  const inputPowerW = motorPowerKw * 1000;
  const calculatedEfficiency = (effectivePowerW / inputPowerW) * 100;
  const wastedPowerW = inputPowerW - effectivePowerW;

  const handleSendTutorMessage = (presetText?: string) => {
    const textToSend = presetText || userChatInput.trim();
    if (!textToSend) return;

    setTutorMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    if (!presetText) setUserChatInput('');

    setTimeout(() => {
      let reply = '';
      if (textToSend.includes('কাজের শর্ত') || textToSend.includes('কাজহীন বল')) {
        reply = 'পদার্থবিজ্ঞানে কাজ সম্পন্ন হতে বল (F) এবং বলের দিকে সরণের উপাংশ (s cos θ) দুটোই থাকতে হবে। যখন বল ও সরণের মধ্যবর্তী কোণ θ = ৯০° হয় (যেমন মাথায় বোঝা নিয়ে অনুভূমিক রাস্তায় হাঁটা), তখন cos 90° = 0 হওয়ায় কোনো কাজ সম্পন্ন হয় না (W = 0)। একে কাজহীন বল বলে।';
      } else if (textToSend.includes('ভরবেগ দ্বিগুণ') || textToSend.includes('Ek = p²/2m')) {
        reply = 'গতিশক্তি এবং ভরবেগের সম্পর্ক হলো Ek = p² / 2m। তাই যদি ভরবেগ (p) দ্বিগুণ করা হয়, তবে গতিশক্তি (Ek) ২² = ৪ গুণ বৃদ্ধি পাবে! এটি বোর্ডের সবচেয়ে জনপ্রিয় বহুনির্বাচনী প্রশ্ন।';
      } else if (textToSend.includes('শক্তির নিত্যতা') || textToSend.includes('Ek = 2Ep')) {
        reply = 'যেকোনো মুক্ত পতনে শীর্ষবিন্দুতে কেবল বিভবশক্তি (mgH) এবং ভূমিতে আঘাতের মুহূর্তে কেবল গতিশক্তি (mgH) থাকে। মাঝের যেকোনো বিন্দুতে Ep = mg(H-x) এবং Ek = mgx। যে উচ্চতায় Ek = 2Ep হবে, সেখানে mgx = 2mg(H-x) => x = (2/3)H, অর্থাৎ ভূমি থেকে উচ্চতা হবে h = (1/3)H।';
      } else if (textToSend.includes('কর্মদক্ষতা') || textToSend.includes('পানির পাম্প')) {
        reply = 'কর্মদক্ষতা (η) হলো প্রদত্ত মোট ক্ষমতার কত শতাংশ কার্যকর কাজে রূপান্তরিত হয়। সূত্র: η = (কার্যকর ক্ষমতা / প্রদত্ত ক্ষমতা) × ১০০% = (mgh / t) / Pin × ১০০%। অপচয়কৃত ক্ষমতা = Pin - Pout।';
      } else {
        reply = `চমৎকার প্রশ্ন! '${textToSend}' সম্পর্কে মনে রাখবে: কাজ ও শক্তি স্কেলার রাশি, উভয়ের মাত্রা [ML²T⁻²] এবং এসআই একক জুল (J)। কোনো নির্দিষ্ট সমীকরণ বা অংকের গাণিতিক সমাধানে সাহায্য লাগলে জানাও!`;
      }
      setTutorMessages((prev) => [...prev, { sender: 'tutor', text: reply }]);
    }, 600);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* 1. TOP HEADER / TITLE BAR */}
      <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/playground/v2"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2.5 rounded-xl hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>লাইব্রেরিতে ফিরুন</span>
          </Link>
          <div className="h-4 w-px bg-border/80 hidden sm:block" />
          <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>পদার্থবিজ্ঞান</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-semibold">অধ্যায় ৪: কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary font-bold">Lesson {activeLesson}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAiTutorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI শিক্ষক</span>
          </button>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Version 2.0 • Virtual Guidebook</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: HIDEABLE SIDEBAR + CENTER CONTENT + AI TUTOR DRAWER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* HIDEABLE LEFT SIDEBAR */}
        {isSidebarOpen && (
          <aside className="w-80 border-r border-border bg-card/40 flex flex-col shrink-0 overflow-y-auto">
            {/* Subject & Class Indicator */}
            <div className="p-4 border-b border-border/60">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>শ্রেণি ও বিষয়</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Class 9–10 (SSC)</h3>
                  <p className="text-xs text-muted-foreground">পদার্থবিজ্ঞান (Physics)</p>
                </div>
              </div>
            </div>

            {/* Chapter Header Card */}
            <div className="p-4 border-b border-border/60 bg-muted/20">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-muted-foreground font-bold">CHAPTER 4</span>
                <span className="font-bold text-primary font-mono">
                  {Math.round((completedLessons.length / 5) * 100)}%
                </span>
              </div>
              <h2 className="text-base font-extrabold text-foreground">
                কাজ, ক্ষমতা ও শক্তি (Work, Power & Energy)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Work, Kinetic-Potential Energy & Motor Efficiency
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${(completedLessons.length / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-1.5">
                <span>{completedLessons.length} / ৫টি পাঠ সম্পন্ন</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">১০ নম্বর নিশ্চিত</span>
              </div>
            </div>

            {/* Lessons List Navigation */}
            <div className="flex-1 p-3 space-y-1.5">
              {[1, 2, 3, 4, 5].map((lessonId) => {
                const meta = LESSONS_DATA[lessonId];
                const isActive = activeLesson === lessonId;
                const isCompleted = completedLessons.includes(lessonId);

                return (
                  <button
                    key={lessonId}
                    data-lesson-id={lessonId}
                    onClick={() => {
                      setActiveLesson(lessonId);
                      setActiveStep(1);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-start gap-3 ${
                      isActive
                        ? 'bg-primary/10 border-primary/40 shadow-xs'
                        : 'hover:bg-muted/50 border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-primary text-white'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {meta.no}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                          {meta.titleBn}
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {meta.titleEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chapter Resources Links */}
            <div className="p-3 border-t border-border/60 text-xs">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 px-1">
                অধ্যায় রিসোর্স (RESOURCES)
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveModal('syllabus')}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>এনসিটিবি পাঠ্যবই (পৃষ্ঠা ৯৮-১২৬)</span>
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
                    ★ বোর্ড নিশ্চিত সৃজনশীল
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

          {/* THE 5 LEARNING STEPS TABS HEADER */}
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
                    className={`flex items-center gap-2 pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                      isCurrent
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full text-[11px] font-mono flex items-center justify-center ${
                        isCurrent
                          ? 'bg-primary text-white font-bold'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {tab.step}
                    </span>
                    <span>{tab.labelEn}</span>
                    {isCurrent && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: LEARN CONCEPT (5 Rich Interactive Physics Labs) */}
          {activeStep === 1 && (
            <div className="space-y-6">
              {/* LESSON 1: WORK & ANGLE θ ANALYSIS */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  {/* Interactive Work & Vector Angle Lab */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. কাজ ও বলের মধ্যবর্তী কোণ সিমুলেটর (Work & Vector Angle Lab)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          বল (F), সরণ (s) এবং মধ্যবর্তী কোণ (θ) পরিবর্তন করে কৃতকাজ ও কাজের প্রকৃতি যাচাই করুন (NCTB পৃষ্ঠা ১০০-১০২)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            angleTheta < 90
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : angleTheta === 90
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {angleTheta < 90
                            ? 'ধনাত্মক কাজ (Positive Work)'
                            : angleTheta === 90
                            ? 'কাজহীন বল (Zero Work)'
                            : 'ঋণাত্মক কাজ (Negative Work)'}
                        </span>
                      </div>
                    </div>

                    {/* Vector Display Canvas */}
                    <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 text-white space-y-4">
                      <div className="h-44 flex flex-col justify-center items-center relative overflow-hidden border-b border-dashed border-slate-800">
                        {/* Object Block */}
                        <div className="relative flex items-center justify-center">
                          <div className="w-24 h-16 rounded-2xl bg-sky-600 text-white font-bold flex flex-col items-center justify-center shadow-lg border border-sky-400">
                            <span className="text-xs font-mono">বস্তু (m)</span>
                            <span className="text-[10px] text-sky-200">সরণ s = {displacementS}m ➔</span>
                          </div>

                          {/* Applied Force Vector Arrow with Angle θ */}
                          <div
                            className="absolute origin-left h-1 bg-amber-400 transition-all duration-300"
                            style={{
                              width: `${appliedForceF * 1.5}px`,
                              transform: `rotate(-${angleTheta}deg)`,
                              left: '100%',
                              top: '50%',
                            }}
                          >
                            <span className="absolute -right-3 -top-2.5 text-amber-400 text-xs">➤</span>
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-amber-300 font-mono whitespace-nowrap">
                              F = {appliedForceF} N (θ = {angleTheta}°)
                            </span>
                          </div>
                        </div>

                        {/* Angle Arc Indicator */}
                        <div className="mt-4 text-xs font-mono text-slate-300 flex items-center gap-4">
                          <span>cos({angleTheta}°) = {cosTheta.toFixed(2)}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">
                            W = F × s × cos(θ) = {appliedForceF} × {displacementS} × {cosTheta.toFixed(2)} = {calculatedWorkJ.toFixed(1)} J
                          </span>
                        </div>
                      </div>

                      {/* Sliders for Force, Displacement, and Angle */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">প্রযুক্ত বল (F):</span>
                          <span className="block font-mono font-bold text-amber-400 text-xs">{appliedForceF} N</span>
                          <input
                            type="range"
                            min="10"
                            max="150"
                            value={appliedForceF}
                            onChange={(e) => setAppliedForceF(Number(e.target.value))}
                            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">সরণ (s):</span>
                          <span className="block font-mono font-bold text-sky-400 text-xs">{displacementS} m</span>
                          <input
                            type="range"
                            min="2"
                            max="50"
                            value={displacementS}
                            onChange={(e) => setDisplacementS(Number(e.target.value))}
                            className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">মধ্যবর্তী কোণ (θ):</span>
                          <span className="block font-mono font-bold text-emerald-400 text-xs">{angleTheta}°</span>
                          <input
                            type="range"
                            min="0"
                            max="180"
                            value={angleTheta}
                            onChange={(e) => setAngleTheta(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Conceptual Insight Callout */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      <span className="font-bold">★ বোর্ড পরীক্ষার অতি গুরুত্বপূর্ণ নোট (NCTB কনসেপ্ট):</span>
                      <p>
                        ১. যখন θ = 0°, cos 0° = 1, তখন সর্বোচ্চ কাজ W = Fs (বলের অনুকূলে কাজ)।<br />
                        ২. যখন θ = 90°, cos 90° = 0, তখন বল প্রযুক্ত হলেও কোনো কাজ হয় না (কাজহীন বল—যেমন গ্রহের চারদিকে উপগ্রহের ঘূর্ণন বা মাথায় বোঝা নিয়ে হাঁটা)।<br />
                        ৩. যখন θ = 180°, cos 180° = -1, তখন W = -Fs (বলের বিরুদ্ধে বা ঘর্ষণ বলের কাজ)।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 2: KINETIC ENERGY & MOMENTUM LAB */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  {/* Kinetic Energy Interactive Simulator */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. গতিশক্তি ও ভরবেগ সম্পর্ক ল্যাব (Ek = ½mv² = p²/2m)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ভর (m) এবং বেগ (v) পরিবর্তন করে গতিশক্তি ও ভরবেগের সম্পর্ক পর্যবেক্ষণ করুন (NCTB পৃষ্ঠা ১০৩-১০৬)
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setBallPosition(0);
                          setIsRolling(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>গতিশক্তি চালনা করুন</span>
                      </button>
                    </div>

                    {/* Animation Track */}
                    <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 text-white space-y-4">
                      <div className="h-28 flex items-center relative overflow-hidden border-b border-dashed border-slate-700">
                        {/* Rolling Ball */}
                        <div
                          className="absolute flex items-center gap-2 transition-all duration-75"
                          style={{ left: `${ballPosition}%` }}
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-bold text-xs shadow-lg shadow-amber-500/50">
                            ⚽ {objectMassM}kg
                          </div>
                          <span className="text-[10px] text-amber-300 font-mono whitespace-nowrap">
                            v = {objectVelocityV} m/s
                          </span>
                        </div>
                      </div>

                      {/* Formula Calculation Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">ভর (m):</span>
                          <span className="text-sky-400 font-bold text-sm">{objectMassM} kg</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">বেগ (v):</span>
                          <span className="text-emerald-400 font-bold text-sm">{objectVelocityV} m/s</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">ভরবেগ (p = mv):</span>
                          <span className="text-amber-400 font-bold text-sm">{calculatedMomentum.toFixed(1)} kg·m/s</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">গতিশক্তি (Ek = ½mv²):</span>
                          <span className="text-rose-400 font-bold text-sm">{calculatedEk.toFixed(1)} J</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">বস্তুর ভর (m):</span>
                          <span className="block font-mono font-bold text-sky-400 text-xs">{objectMassM} kg</span>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            value={objectMassM}
                            onChange={(e) => setObjectMassM(Number(e.target.value))}
                            className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">বস্তুর বেগ (v):</span>
                          <span className="block font-mono font-bold text-emerald-400 text-xs">{objectVelocityV} m/s</span>
                          <input
                            type="range"
                            min="2"
                            max="40"
                            value={objectVelocityV}
                            onChange={(e) => setObjectVelocityV(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 3: SPRING POTENTIAL ENERGY & COMPRESSION */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  {/* Spring Compression Simulator */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. স্প্রিং-এর বিভবশক্তি ল্যাব (Spring Elastic Potential Energy)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          স্প্রিং ধ্রুবক (k) ও সংকোচন (x) পরিবর্তন করে সঞ্চিত বিভবশক্তি Ep = ½kx² নির্ণয় (NCTB পৃষ্ঠা ১০৬-১০৮)
                        </p>
                      </div>

                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                        Ep = {springPotentialEnergy.toFixed(2)} J
                      </div>
                    </div>

                    {/* Spring SVG Visualizer */}
                    <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 text-white space-y-4">
                      <div className="h-40 flex items-center justify-center relative overflow-hidden border-b border-dashed border-slate-800">
                        {/* Rigid Wall */}
                        <div className="absolute left-6 h-28 w-4 bg-slate-700 rounded-xs border-r-2 border-slate-500" />

                        {/* Coiled Spring */}
                        <div
                          className="h-12 border-y-2 border-amber-400 bg-amber-500/20 rounded-lg flex items-center justify-center transition-all duration-300 relative"
                          style={{
                            width: `${Math.max(60, 220 - springCompressionX * 250)}px`,
                            marginLeft: '2rem',
                          }}
                        >
                          <span className="text-[11px] font-mono text-amber-300">
                            ∿∿∿ স্প্রিং (k = {springConstantK} N/m) ∿∿∿
                          </span>
                        </div>

                        {/* Pushing Hand / Block */}
                        <div className="w-16 h-16 rounded-xl bg-sky-600 flex flex-col items-center justify-center font-bold text-xs shadow-md border border-sky-400">
                          <span>📦 ব্লক</span>
                          <span className="text-[9px] text-sky-200">x = {(springCompressionX * 100).toFixed(0)}cm</span>
                        </div>
                      </div>

                      {/* Sliders */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">স্প্রিং ধ্রুবক (k):</span>
                          <span className="block font-mono font-bold text-amber-400 text-xs">{springConstantK} N/m</span>
                          <input
                            type="range"
                            min="100"
                            max="2000"
                            step="50"
                            value={springConstantK}
                            onChange={(e) => setSpringConstantK(Number(e.target.value))}
                            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">সংকোচন (x):</span>
                          <span className="block font-mono font-bold text-sky-400 text-xs">{(springCompressionX * 100).toFixed(0)} cm ({springCompressionX} m)</span>
                          <input
                            type="range"
                            min="0.05"
                            max="0.5"
                            step="0.01"
                            value={springCompressionX}
                            onChange={(e) => setSpringCompressionX(Number(e.target.value))}
                            className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 4: CONSERVATION OF MECHANICAL ENERGY */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  {/* Energy Conservation Free-fall Tower */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. যান্ত্রিক শক্তির সংরক্ষণশীলতা ল্যাব (Conservation of Mechanical Energy)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          উচ্চতা থেকে পড়ন্ত বস্তুর Ep ও Ek রূপান্তর এবং মোট শক্তির ধ্রুবতা (NCTB পৃষ্ঠা ১০৮-১১২)
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentHeightRatio(1);
                          setIsDropping(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition-all shadow-sm"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>পতন সিমুলেশন চালান</span>
                      </button>
                    </div>

                    {/* Tower & Energy Bars Visualizer */}
                    <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 text-white space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Drop Tower */}
                        <div className="h-60 rounded-xl bg-slate-900 border border-slate-800 relative flex items-center justify-center p-4">
                          {/* Height ruler */}
                          <div className="absolute left-4 top-4 bottom-4 w-1 bg-slate-700 flex flex-col justify-between">
                            <span className="text-[10px] text-slate-400 font-mono -ml-2">H={fallHeightH}m (A)</span>
                            <span className="text-[10px] text-slate-400 font-mono -ml-2">h={(currentHeightM).toFixed(1)}m (B)</span>
                            <span className="text-[10px] text-slate-400 font-mono -ml-2">0m (C)</span>
                          </div>

                          {/* Falling Object */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50 flex items-center justify-center font-bold text-xs transition-all duration-75"
                            style={{
                              bottom: `${currentHeightRatio * 75 + 5}%`,
                            }}
                          >
                            🏀
                          </div>

                          <span className="absolute bottom-2 text-xs text-slate-400 font-mono">
                            ভূমি (Ground Level)
                          </span>
                        </div>

                        {/* Real-time Dynamic Energy Split Bar Charts */}
                        <div className="space-y-4 font-mono text-xs">
                          <div>
                            <div className="flex justify-between text-slate-300 mb-1">
                              <span>বিভবশক্তি Ep = mgh:</span>
                              <span className="text-emerald-400 font-bold">{currentEp.toFixed(1)} J</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-100"
                                style={{ width: `${(currentEp / currentTotalE) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-300 mb-1">
                              <span>গতিশক্তি Ek = mgx:</span>
                              <span className="text-amber-400 font-bold">{currentEk.toFixed(1)} J</span>
                            </div>
                            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-amber-500 transition-all duration-100"
                                style={{ width: `${(currentEk / currentTotalE) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex justify-between items-center text-sm">
                            <span className="font-sans font-bold text-slate-200">মোট যান্ত্রিক শক্তি (Ep + Ek):</span>
                            <span className="text-sky-400 font-bold font-mono">{currentTotalE.toFixed(1)} J (ধ্রুবক)</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-sans">
                            💡 Ek = 2Ep শর্তটি ঘটবে ভূমি থেকে h = ⅓H = {(fallHeightH / 3).toFixed(1)}m উচ্চতায়!
                          </div>
                        </div>
                      </div>

                      {/* Height & Mass Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">পতনের মোট উচ্চতা (H):</span>
                          <span className="block font-mono font-bold text-sky-400 text-xs">{fallHeightH} m</span>
                          <input
                            type="range"
                            min="20"
                            max="120"
                            step="5"
                            value={fallHeightH}
                            onChange={(e) => setFallHeightH(Number(e.target.value))}
                            className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">বস্তুর ভর (m):</span>
                          <span className="block font-mono font-bold text-emerald-400 text-xs">{fallMassM} kg</span>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={fallMassM}
                            onChange={(e) => setFallMassM(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 5: POWER & MOTOR EFFICIENCY */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  {/* Motor Efficiency Simulator */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. পানির পাম্প মোটর ও কর্মদক্ষতা (%) ল্যাব (Motor Efficiency Lab)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          মোটরের প্রদত্ত ক্ষমতা (Pin), পানি তোলার কাজ (mgh) এবং কর্মদক্ষতা (η) পরিমাপ (NCTB পৃষ্ঠা ১২০-১২৩)
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setWaterTankFill(20);
                          setIsPumpRunning(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-sky-700 transition-all shadow-sm"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>পাম্প চালু করুন</span>
                      </button>
                    </div>

                    {/* Water Tank Simulation View */}
                    <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800 text-white space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Rooftop Tank Visual */}
                        <div className="h-56 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
                          {/* Tank container */}
                          <div className="w-36 h-36 rounded-2xl border-2 border-sky-400/80 mx-auto relative overflow-hidden bg-slate-800 flex items-end">
                            <div
                              className="w-full bg-sky-500/80 transition-all duration-200"
                              style={{ height: `${waterTankFill}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white shadow-xs">
                              {waterVolumeL} L ({waterTankFill}%)
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs text-slate-300 font-mono">
                            <span>উচ্চতা h = {pumpHeightH}m</span>
                            <span>সময় t = {pumpTimeMin} মিনিট</span>
                          </div>
                        </div>

                        {/* Power & Efficiency Metric Cards */}
                        <div className="space-y-3 font-mono text-xs">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                            <span className="text-slate-400 font-sans">প্রদত্ত মোট ক্ষমতা (Pin):</span>
                            <span className="text-amber-400 font-bold">{inputPowerW} W ({(inputPowerW / 746).toFixed(2)} HP)</span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                            <span className="text-slate-400 font-sans">কার্যকর ক্ষমতা (Pout = mgh/t):</span>
                            <span className="text-emerald-400 font-bold">{effectivePowerW.toFixed(1)} W</span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                            <span className="text-slate-400 font-sans">অপচয়কৃত ক্ষমতা (Ploss):</span>
                            <span className="text-rose-400 font-bold">{wastedPowerW.toFixed(1)} W</span>
                          </div>

                          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex justify-between items-center text-sm">
                            <span className="font-sans font-bold text-emerald-300">মোটরের কর্মদক্ষতা (η):</span>
                            <span className="text-emerald-400 font-black text-lg">{calculatedEfficiency.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Sliders */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">মোটর ক্ষমতা (kW):</span>
                          <span className="block font-mono font-bold text-amber-400 text-xs">{motorPowerKw} kW</span>
                          <input
                            type="range"
                            min="0.5"
                            max="5.0"
                            step="0.5"
                            value={motorPowerKw}
                            onChange={(e) => setMotorPowerKw(Number(e.target.value))}
                            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">পানির পরিমাণ (L):</span>
                          <span className="block font-mono font-bold text-sky-400 text-xs">{waterVolumeL} L</span>
                          <input
                            type="range"
                            min="500"
                            max="5000"
                            step="500"
                            value={waterVolumeL}
                            onChange={(e) => setWaterVolumeL(Number(e.target.value))}
                            className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">উচ্চতা (m):</span>
                          <span className="block font-mono font-bold text-emerald-400 text-xs">{pumpHeightH} m</span>
                          <input
                            type="range"
                            min="5"
                            max="35"
                            value={pumpHeightH}
                            onChange={(e) => setPumpHeightH(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <span className="text-slate-300 text-xs font-semibold">সময় (মিনিট):</span>
                          <span className="block font-mono font-bold text-rose-400 text-xs">{pumpTimeMin} min</span>
                          <input
                            type="range"
                            min="1"
                            max="15"
                            value={pumpTimeMin}
                            onChange={(e) => setPumpTimeMin(Number(e.target.value))}
                            className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  disabled={activeLesson === 1}
                  onClick={() => setActiveLesson((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold disabled:opacity-40"
                >
                  পূর্ববর্তী পাঠ
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markLessonComplete(activeLesson)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>পাঠ সম্পন্ন চিহ্নিত করো</span>
                  </button>

                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>উদাহরণ দেখুন (Step 2)</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SEE EXAMPLE (4 Worked Board Creative Questions with Rubric) */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      ২. উদাহরণ দেখি • বোর্ড স্ট্যান্ডার্ড ধাপে ধাপে সমাধান
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      এসএসসি পরীক্ষার পূর্ণমানের সৃজনশীল প্রশ্ন ও পরীক্ষকের মার্কিং রুব্রিক
                    </p>
                  </div>

                  {/* Example Selector Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: 1, label: 'টেক্সটবুক CQ ১: বালক ও যুবকের দৌড়' },
                      { id: 2, label: 'টেক্সটবুক CQ ২: ১ kW বনাম ২ kW পাম্প' },
                      { id: 3, label: 'ঢাকা বোর্ড: ৬০m উচ্চতায় শক্তির নিত্যতা' },
                      { id: 4, label: 'রাজশাহী বোর্ড: ব্রেকিং ও ঘর্ষণ কাজ' },
                    ].map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => setSelectedExampleId(ex.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          selectedExampleId === ex.id
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EXAMPLE 1 CONTENT: Textbook CQ 1 */}
                {selectedExampleId === 1 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold block mb-1">সৃজনশীল প্রশ্ন (পাঠ্যবই নমুনা সৃজনশীল ১ - পৃষ্ঠা ১২৫):</span>
                      ৪০ কেজি ভরের একজন বালক এবং ৬০ কেজি ভরের একজন যুবক নিচতলা থেকে একসাথে দৌড় শুরু করে একই সময়ে ছাদে পৌঁছাল। তারা উভয়েই ৩০ মিটার/মিনিট সমবেগে দৌড়েছিল।
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                        <span className="font-bold text-primary">(গ) যুবকের গতিশক্তি নির্ণয় করো। [৩ নম্বর]</span>
                        <div className="text-muted-foreground space-y-1">
                          <p><RenderMathText text="এখানে, যুবকের ভর $m = 60\text{ kg}$" /></p>
                          <p><RenderMathText text="বেগ $v = 30\text{ m/min} = \frac{30}{60}\text{ m/s} = 0.5\text{ m/s}$" /></p>
                          <p><RenderMathText text="আমরা জানি, গতিশক্তি $E_k = \frac{1}{2}mv^2 = \frac{1}{2} \times 60 \times (0.5)^2 = 30 \times 0.25 = 7.5\text{ J}$।" /></p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">উত্তর: যুবকের গতিশক্তি ৭.৫ জুল।</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                        <span className="font-bold text-primary">(ঘ) দুজনের ক্ষমতা সমান হবে কি না গাণিতিক যুক্তি সহকারে ব্যাখ্যা করো। [৪ নম্বর]</span>
                        <div className="text-muted-foreground space-y-1">
                          <p><RenderMathText text="ধরি, নিচতলা থেকে ছাদের উল্লম্ব উচ্চতা $h$ এবং সময় $t$।" /></p>
                          <p><RenderMathText text="বালকের ক্ষেত্রে কৃতকাজ $W_1 = m_1gh = 40 \times 9.8 \times h = 392h\text{ J}$" /></p>
                          <p><RenderMathText text="বালকের ক্ষমতা $P_1 = \frac{W_1}{t} = \frac{392h}{t}\text{ W}$" /></p>
                          <p><RenderMathText text="যুবকের ক্ষেত্রে কৃতকাজ $W_2 = m_2gh = 60 \times 9.8 \times h = 588h\text{ J}$" /></p>
                          <p><RenderMathText text="যুবকের ক্ষমতা $P_2 = \frac{W_2}{t} = \frac{588h}{t}\text{ W}$" /></p>
                          <p><RenderMathText text="যেহেতু $m_2 > m_1$ এবং উভয়েই একই সময়ে ছাদে পৌঁছায় ($t$ সমান), সেহেতু $P_2 > P_1$।" /></p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">সিদ্ধান্ত: বালক ও যুবকের ক্ষমতা সমান হবে না; যুবকের ক্ষমতা বালকের চেয়ে বেশি হবে।</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* EXAMPLE 2 CONTENT: Textbook CQ 2 */}
                {selectedExampleId === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold block mb-1">সৃজনশীল প্রশ্ন (পাঠ্যবই নমুনা সৃজনশীল ২ - পৃষ্ঠা ১২৬):</span>
                      ১ কিলোওয়াটের একটি মোটর ১০ মিনিটে ২০০০ লিটার পানি দোতলার ছাদে তুলতে পারে। অপরদিকে ২ কিলোওয়াটের অপর একটি মোটর ১৫ মিনিটে ৩০০০ লিটার পানি চারতলার ছাদে তুলতে পারে। প্রতি তলার উচ্চতা ১০ মিটার।
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                        <span className="font-bold text-primary">(গ) দোতলার ট্যাংকে তোলা পানির বিভবশক্তি নির্ণয় করো। [৩ নম্বর]</span>
                        <div className="text-muted-foreground space-y-1">
                          <p><RenderMathText text="পানির ভর $m_1 = 2000\text{ L} = 2000\text{ kg}$" /></p>
                          <p><RenderMathText text="দোতলার উচ্চতা $h_1 = 2 \times 10\text{ m} = 20\text{ m}$" /></p>
                          <p><RenderMathText text="আমরা জানি, বিভবশক্তি $E_p = m_1gh_1 = 2000 \times 9.8 \times 20 = 392,000\text{ J} = 392\text{ kJ}$।" /></p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">উত্তর: পানির বিভবশক্তি ৩৯২ কিলোজুল।</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                        <span className="font-bold text-primary">(ঘ) ব্যবহারের ক্ষেত্রে কোন মোটরটি অধিক সাশ্রয়ী হবে? গাণিতিক যুক্তি দাও। [৪ নম্বর]</span>
                        <div className="text-muted-foreground space-y-1">
                          <p><RenderMathText text="১ম মোটরের ক্ষেত্রে: প্রদত্ত শক্তি $E_{\text{in1}} = P_1 \times t_1 = 1000\text{ W} \times (10 \times 60)\text{ s} = 600,000\text{ J}$" /></p>
                          <p><RenderMathText text="১ম মোটরের কর্মদক্ষতা $\eta_1 = \frac{392000}{600000} \times 100\% = 65.33\%$" /></p>
                          <p><RenderMathText text="২য় মোটরের ক্ষেত্রে: চারতলার উচ্চতা $h_2 = 4 \times 10 = 40\text{ m}$, পানি $m_2 = 3000\text{ kg}$" /></p>
                          <p><RenderMathText text="কার্যকর শক্তি $W_2 = 3000 \times 9.8 \times 40 = 1,176,000\text{ J}$" /></p>
                          <p><RenderMathText text="প্রদত্ত শক্তি $E_{\text{in2}} = 2000\text{ W} \times (15 \times 60)\text{ s} = 1,800,000\text{ J}$" /></p>
                          <p><RenderMathText text="২য় মোটরের কর্মদক্ষতা $\eta_2 = \frac{1176000}{1800000} \times 100\% = 65.33\%$" /></p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">সিদ্ধান্ত: উভয় মোটরেরই কর্মদক্ষতা সমান (৬৫.৩৩%), তাই জ্বালানি/বিদ্যুৎ সাশ্রয়ের দিক থেকে উভয় মোটর সমমানের।</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* EXAMPLE 3 CONTENT: Dhaka Board Energy Conservation */}
                {selectedExampleId === 3 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold block mb-1">সৃজনশীল প্রশ্ন (ঢাকা বোর্ড ক্লাসিক):</span>
                      ৫ কেজি ভরের একটি বস্তুকে ৬০ মিটার উঁচু স্থান থেকে মুক্তভাবে ছেড়ে দেওয়া হলো।
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                        <span className="font-bold text-primary">(গ) ভূমি থেকে কত উচ্চতায় গতিশক্তি বিভবশক্তির দ্বিগুণ হবে? [৩ নম্বর]</span>
                        <div className="text-muted-foreground space-y-1">
                          <p><RenderMathText text="ধরি, ভূমি থেকে $h$ উচ্চতায় গতিশক্তি বিভবশক্তির দ্বিগুণ হবে ($E_k = 2E_p$)।" /></p>
                          <p><RenderMathText text="পতনের দূরত্ব $x = H - h = 60 - h$।" /></p>
                          <p><RenderMathText text="শর্তমতে, $mg(60 - h) = 2 \times mgh \implies 60 - h = 2h \implies 3h = 60 \implies h = 20\text{ m}$।" /></p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">উত্তর: ভূমি থেকে ২০ মিটার উচ্চতায় গতিশক্তি বিভবশক্তির দ্বিগুণ হবে।</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* EXAMPLE 4 CONTENT: Rajshahi Board Braking & Friction */}
                {selectedExampleId === 4 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-bold block mb-1">সৃজনশীল প্রশ্ন (রাজশাহী বোর্ড ক্লাসিক):</span>
                      ৮০০ কেজি ভরের একটি গাড়ি ২০ মি/সে বেগে চলার সময় চালক ব্রেক চেপে ৪০ মিটার দূরে থামিয়ে দিলেন।
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1">
                        <span className="font-bold text-primary">(গ) ব্রেকিং বলের মান এবং কৃতকাজ কত? [৩ নম্বর]</span>
                        <div className="text-muted-foreground space-y-1">
                          <p><RenderMathText text="আমরা জানি, কাজ-শক্তি উপপাদ্য অনুসারে কৃতকাজ $W = \Delta E_k = 0 - \frac{1}{2}mv^2 = -\frac{1}{2} \times 800 \times (20)^2 = -160,000\text{ J} = -160\text{ kJ}$।" /></p>
                          <p><RenderMathText text="আবার $W = -F \times s \implies F = \frac{160000}{40} = 4000\text{ N}$।" /></p>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">উত্তর: ব্রেকিং বল ৪০০০ নিউটন এবং কৃতকাজ -১৬০ কিলোজুল (ঋণাত্মক কাজ)।</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Examiner Rubric Drawer */}
                <div className="border border-border/80 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setIsRubricOpen(!isRubricOpen)}
                    className="w-full p-3.5 bg-muted/40 hover:bg-muted/60 flex items-center justify-between text-xs font-bold transition-colors"
                  >
                    <span className="flex items-center gap-2 text-primary">
                      <Award className="h-4 w-4" />
                      <span>পরীক্ষকের গোপন কথা (Examiner Marking Rubric & Deduction Guide)</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isRubricOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isRubricOpen && (
                    <div className="p-4 bg-card text-xs space-y-2 border-t border-border/60">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">নম্বর কাটার প্রধান ফাঁদ:</strong><br />
                        ১. <strong>মিনিট থেকে সেকেন্ড রূপান্তর:</strong> মোটরের অঙ্কে সময় ১০ মিনিট বা ১৫ মিনিট দেওয়া থাকলে তাকে অবশ্যই ৬০ দিয়ে গুণ করে সেকেন্ডে নিতে হবে। মিনিট রেখেই হিসাব করলে পুরো ৩ নম্বর কাটা যায়!<br />
                        ২. <strong>লিটার থেকে কেজি রূপান্তর:</strong> <RenderMathText text="পানির ঘনত্ব $\rho = 1000\text{ kg/m}^3$ হওয়ায় ১ লিটার বিশুদ্ধ পানির ভর ১ কেজি ($m = 2000\text{ kg}$)।" /><br />
                        ৩. <strong>উচ্চতার হিসাব ($h$ বনাম $H-h$):</strong> <RenderMathText text="বিভবশক্তি গণনায় সর্বদা ভূমি থেকে উচ্চতা ($h$) এবং গতিশক্তিতে উপর থেকে পতনের দূরত্ব ($x = H-h$) ধরতে হয়। শিক্ষার্থীরা প্রায়ই এই দুটি গুলিয়ে ফেলে!" />
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                >
                  ধারণায় ফিরুন (Step 1)
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>নিজে করো (Step 3)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRY YOURSELF (3 Interactive Calculation Challenges) */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    ৩. নিজে করো • ইন্টারঅ্যাক্টিভ ল্যাব (Interactive Practice Lab)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ৩টি হ্যান্ডস-অন চ্যালেঞ্জ সমাধান করে বোর্ড পরীক্ষার জন্য নিজেকে প্রস্তুত করো
                  </p>
                </div>

                {/* Challenge 1: Work against gravity W = mgh */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary font-mono">চ্যালেঞ্জ ০১: অভিকর্ষের বিরুদ্ধে কৃতকাজ</span>
                    <span className="text-muted-foreground font-mono">m = 50 kg, h = 20 m</span>
                  </div>
                  <p className="text-foreground">
                    <RenderMathText text="৫০ কেজি ভরের একজন ব্যক্তি ২০ মিটার উঁচু ছাদে উঠলে তার দ্বারা অভিকর্ষ বলের বিরুদ্ধে কৃতকাজ কত জুল ($g = 9.8\text{ ms}^{-2}$)?" />
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="কাজের মান লিখুন (যেমন: 9800)..."
                      value={practiceInput1}
                      onChange={(e) => setPracticeInput1(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono text-xs w-64"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(practiceInput1.trim());
                        if (Math.abs(val - 9800) < 5) {
                          setPracticeFeedback1({ status: 'correct', msg: 'চমৎকার! সঠিক হয়েছে (W = mgh = 50 × 9.8 × 20 = 9800 J)।' });
                        } else {
                          setPracticeFeedback1({ status: 'wrong', msg: 'ভুল হয়েছে। সূত্র: W = mgh ব্যবহার করো।' });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>
                  {practiceFeedback1.status !== 'idle' && (
                    <div
                      className={`p-2.5 rounded-xl font-semibold ${
                        practiceFeedback1.status === 'correct'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {practiceFeedback1.msg}
                    </div>
                  )}
                </div>

                {/* Challenge 2: Motor Efficiency % */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary font-mono">চ্যালেঞ্জ ০২: মোটরের কর্মদক্ষতা (%)</span>
                    <span className="text-muted-foreground font-mono">Pin = 2000 W, Pout = 1500 W</span>
                  </div>
                  <p className="text-foreground">
                    একটি মোটরের ক্ষমতা ২০০০ ওয়াট। এটি প্রতি সেকেন্ডে ১৫০০ জুল কার্যকর কাজ করতে পারলে মোটরের কর্মদক্ষতা (%) কত?
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="কর্মদক্ষতা লিখুন (যেমন: 75)..."
                      value={practiceInput2}
                      onChange={(e) => setPracticeInput2(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono text-xs w-64"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(practiceInput2.trim());
                        if (Math.abs(val - 75) < 1) {
                          setPracticeFeedback2({ status: 'correct', msg: 'সঠিক উত্তর! η = (1500 / 2000) × 100% = 75%।' });
                        } else {
                          setPracticeFeedback2({ status: 'wrong', msg: 'ভুল হয়েছে। সূত্র: η = (Pout / Pin) × 100% ব্যবহার করো।' });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>
                  {practiceFeedback2.status !== 'idle' && (
                    <div
                      className={`p-2.5 rounded-xl font-semibold ${
                        practiceFeedback2.status === 'correct'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {practiceFeedback2.msg}
                    </div>
                  )}
                </div>

                {/* Challenge 3: Height where Ek = Ep */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary font-mono">চ্যালেঞ্জ ০৩: Ek = Ep শর্তের উচ্চতা</span>
                    <span className="text-muted-foreground font-mono">H = 80 m</span>
                  </div>
                  <p className="text-foreground">
                    ৮০ মিটার উঁচু স্থান থেকে একটি বস্তুকে মুক্তভাবে পড়তে দিলে ভূমি থেকে কত মিটার উচ্চতায় বিভবশক্তি ও গতিশক্তি সমান হবে?
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="উচ্চতা লিখুন (যেমন: 40)..."
                      value={practiceInput3}
                      onChange={(e) => setPracticeInput3(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono text-xs w-64"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(practiceInput3.trim());
                        if (Math.abs(val - 40) < 1) {
                          setPracticeFeedback3({ status: 'correct', msg: 'অসাধারণ! Ek = Ep হয় মধ্যবিন্দুতে, অর্থাৎ h = H / 2 = 80 / 2 = 40 m উচ্চতায়।' });
                        } else {
                          setPracticeFeedback3({ status: 'wrong', msg: 'ভুল হয়েছে। Ek = Ep হলে h = H / 2 হবে।' });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>
                  {practiceFeedback3.status !== 'idle' && (
                    <div
                      className={`p-2.5 rounded-xl font-semibold ${
                        practiceFeedback3.status === 'correct'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {practiceFeedback3.msg}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                >
                  উদাহরণে ফিরুন (Step 2)
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>মূল্যায়ন (Step 4)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CHECK UNDERSTANDING (5 Authentic Board MCQs with KaTeX) */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    ৪. মূল্যায়ন • কাজ, ক্ষমতা ও শক্তি বোর্ড কুইজ (Check Understanding)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    এনসিটিবি পাঠ্যবই ও বিগত ৫ বছরের ঢাকা, চট্টগ্রাম ও রাজশাহী বোর্ডের শীর্ষ ৫টি প্রশ্ন
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      q: 'কাজের এসআই (SI) একক কোনটি?',
                      tag: 'পাঠ্যবই নমুনা প্রশ্ন ১',
                      opts: ['Joule (জুল)', 'Newton (নিউটন)', 'Watt (ওয়াট)', 'Kelvin (কেলভিন)'],
                      ans: 0,
                      exp: 'কাজের এসআই একক জুল (Joule)। ১ নিউটন বল প্রয়োগে বস্তুর ১ মিটার সরণ ঘটলে কৃতকাজ ১ জুল।',
                    },
                    {
                      id: 2,
                      q: 'কোন উচ্চতায় ৫ কেজি ভরের বস্তুর বিভবশক্তি সর্বোচ্চ হবে?',
                      tag: 'পাঠ্যবই নমুনা প্রশ্ন ২',
                      opts: ['$20\\text{ cm}$', '$30\\text{ cm}$', '$40\\text{ cm}$', '$50\\text{ cm}$'],
                      ans: 3,
                      exp: 'বিভবশক্তি $E_p = mgh$ সরাসরি উচ্চতার ($h$) সমানুপাতিক। তাই সর্বোচ্চ উচ্চতা $50\\text{ cm}$-এ বিভবশক্তি সর্বাধিক।',
                    },
                    {
                      id: 3,
                      q: 'কোনো বস্তুর ভরবেগ দ্বিগুণ করা হলে তার গতিশক্তি কতগুণ হবে?',
                      tag: 'বোর্ড পরীক্ষা ক্লাসিক',
                      opts: ['২ গুণ', '৪ গুণ', '৮ গুণ', 'অপরিবর্তিত থাকবে'],
                      ans: 1,
                      exp: 'গতিশক্তি ও ভরবেগের সম্পর্ক $E_k = \\frac{p^2}{2m}$। ভরবেগ দ্বিগুণ করলে গতিশক্তি $2^2 = 4$ গুণ বৃদ্ধি পাবে।',
                    },
                    {
                      id: 4,
                      q: '১ অশ্বক্ষমতা (1 Horsepower) সমান কত ওয়াট?',
                      tag: 'বোর্ড পরীক্ষা ক্লাসিক',
                      opts: ['$550\\text{ W}$', '$746\\text{ W}$', '$1000\\text{ W}$', '$764\\text{ W}$'],
                      ans: 1,
                      exp: '$1\\text{ HP} = 746\\text{ W}$। এটি ব্রিটিশ পদ্ধতিতে ক্ষমতার ঐতিহ্যবাহী একক।',
                    },
                    {
                      id: 5,
                      q: 'কোনো স্প্রিংকে প্রসারিত বা সংকুচিত করলে তাতে কোন শক্তি জমা হয়?',
                      tag: 'পাঠ্যবই নমুনা প্রশ্ন ৬',
                      opts: ['গতিশক্তি', 'বিভবশক্তি', 'তাপশক্তি', 'রাসায়নিক শক্তি'],
                      ans: 1,
                      exp: 'স্প্রিং সংকুচিত বা প্রসারিত করলে বলের বিরুদ্ধে কৃতকাজ স্থিতিস্থাপক বিভবশক্তি ($E_p = \\frac{1}{2}kx^2$) হিসেবে জমা থাকে।',
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
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                >
                  নিজে করো (Step 3)
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>সারসংক্ষেপ (Step 5)</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUMMARY (Dynamic Cheat-Sheet & Formulas) */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      ৫. সারসংক্ষেপ • পদার্থবিজ্ঞান অধ্যায় ৪ রিভিশন চিট-শিট
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      বোর্ড পরীক্ষার আগের রাতের জন্য সূত্র, সংরক্ষণশীলতা ও সতর্কতার হ্যান্ডনোট
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCopiedNote(true);
                      navigator.clipboard?.writeText(
                        'কাজ: W = Fs cos θ | গতিশক্তি: Ek = ½mv² = p²/2m | বিভবশক্তি: Ep = mgh | স্প্রিং: Ep = ½kx² | ক্ষমতা: P = W/t = Fv | কর্মদক্ষতা: η = (Pout/Pin) × 100% | 1 HP = 746 W'
                      );
                      setTimeout(() => setCopiedNote(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    {copiedNote ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedNote ? 'কপি হয়েছে! ✓' : 'নোট কপি করুন'}</span>
                  </button>
                </div>

                {/* Master Formula Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                    <span className="text-xs font-bold text-primary">১. কাজ (Work):</span>
                    <p className="font-mono text-sm text-foreground font-bold">
                      <RenderMathText text="$W = Fs \cos\theta$" />
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      একক: জুল (J), মাত্রা: $[ML^2T^{-2}]$। $\theta = 90^\circ$ হলে কাজ শূন্য (কাজহীন বল)।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                    <span className="text-xs font-bold text-primary">২. গতিশক্তি ও ভরবেগ:</span>
                    <p className="font-mono text-sm text-foreground font-bold">
                      <RenderMathText text="$E_k = \frac{1}{2}mv^2 = \frac{p^2}{2m}$" />
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      কাজ-শক্তি উপপাদ্য: $W = \Delta E_k$। ভরবেগ দ্বিগুণ হলে গতিশক্তি ৪ গুণ হয়।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                    <span className="text-xs font-bold text-primary">৩. অভিকর্ষজ ও স্প্রিং বিভবশক্তি:</span>
                    <p className="font-mono text-sm text-foreground font-bold">
                      <RenderMathText text="$E_p = mgh, \quad E_p = \frac{1}{2}kx^2$" />
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      স্প্রিং সংকোচন $x$ হলে সঞ্চিত শক্তি। মুক্ত পতনে মোট শক্তি $E = E_p + E_k = mgh$ সর্বদা ধ্রুবক।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                    <span className="text-xs font-bold text-primary">৪. ক্ষমতা (Power):</span>
                    <p className="font-mono text-sm text-foreground font-bold">
                      <RenderMathText text="$P = \frac{W}{t} = \frac{Fs}{t} = Fv$" />
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      <RenderMathText text="একক: ওয়াট (W), মাত্রা: $[ML^2T^{-3}]$। $1\text{ kW} = 1000\text{ W}$, $1\text{ HP} = 746\text{ W}$।" />
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                    <span className="text-xs font-bold text-primary">৫. মোটরের কর্মদক্ষতা (Efficiency):</span>
                    <p className="font-mono text-sm text-foreground font-bold">
                      <RenderMathText text="$\eta = \frac{P_{\text{out}}}{P_{\text{in}}} \times 100\% = \frac{mgh / t}{P_{\text{in}}} \times 100\%$" />
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      <RenderMathText text="অপচয়কৃত ক্ষমতা $P_{\text{loss}} = P_{\text{in}} - P_{\text{out}}$।" />
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                    <span className="text-xs font-bold text-primary">৬. শক্তি সংরক্ষণ ও উচ্চতা শর্ত:</span>
                    <p className="font-mono text-sm text-foreground font-bold">
                      <RenderMathText text="$E_k = nE_p \implies h = \frac{H}{n + 1}$" />
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      <RenderMathText text="$E_k = 2E_p$ হলে $h = \frac{1}{3}H$ এবং $E_k = E_p$ হলে $h = \frac{1}{2}H$।" />
                    </p>
                  </div>
                </div>

                {/* Top 4 Board Traps Callout */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                  <span className="font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="h-4 w-4" />
                    <span>বোর্ড পরীক্ষার শীর্ষ ৪টি মারাত্মক ভুল (Examiner Pitfalls):</span>
                  </span>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>মিনিট থেকে সেকেন্ডে না নেওয়া:</strong> <RenderMathText text="মোটরের অঙ্কে সময়কে অবশ্যই সেকেন্ডে নিতে হবে ($t = \text{min} \times 60$)।" /></li>
                    <li><strong>১ HP = ৭৪৬ W ভুল লেখা:</strong> মোটরের ক্ষমতা হর্সপাওয়া থাকলে ৭৪৬ দিয়ে গুণ করে ওয়াটে নিতে ভুলবেন না।</li>
                    <li><strong>উচ্চতা বনাম পতনের দূরত্বের গোলমাল:</strong> <RenderMathText text="$E_p$ তে উচ্চতা $h$ (ভূমি থেকে), আর $E_k$ তে $x = H - h$ (উপর থেকে পতনের দূরত্ব)।" /></li>
                    <li><strong>কাজের সংজ্ঞায় সরণের দিক উপেক্ষা:</strong> বল ও সরণ লম্ব হলে কাজ শূন্য; ঘর্ষণের ক্ষেত্রে কাজ ঋণাত্মক।</li>
                  </ul>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                >
                  মূল্যায়নে ফিরুন (Step 4)
                </button>
                <Link
                  href="/dashboard/playground/v2"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>অধ্যায় ৪ সম্পন্ন • লাইব্রেরিতে ফিরুন</span>
                  <CheckCircle2 className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </main>

        {/* 3. SOCRATIC AI PHYSICS TUTOR DRAWER */}
        {isAiTutorOpen && (
          <aside className="w-80 sm:w-96 border-l border-border bg-card/95 backdrop-blur-md flex flex-col shrink-0 z-30 shadow-xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">AI ফিজিক্স শিক্ষক</h3>
                  <p className="text-[11px] text-muted-foreground">সক্রেটিক মেথড • সহায়ক টিউটর</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiTutorOpen(false)}
                className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {tutorMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-muted/60 text-foreground border border-border/80 rounded-bl-xs'
                    }`}
                  >
                    <RenderMathText text={msg.text} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-border/60 bg-muted/20 flex flex-wrap gap-1.5">
              {[
                'কাজের শর্ত ও কাজহীন বল কী?',
                'ভরবেগ দ্বিগুণ হলে গতিশক্তি কত গুণ বাড়ে?',
                'কোন উচ্চতায় Ek = 2Ep হবে?',
                'পানির পাম্পের কর্মদক্ষতা (%) সূত্র কী?',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendTutorMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-card hover:bg-muted border border-border/70 text-[10px] text-muted-foreground hover:text-foreground transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-border flex items-center gap-2">
              <input
                type="text"
                placeholder="প্রশ্ন লিখুন (যেমন: Ek = ½mv² প্রতিপাদন)..."
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs"
              />
              <button
                onClick={() => handleSendTutorMessage()}
                className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
