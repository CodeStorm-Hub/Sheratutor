'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  AlertCircle,
  Copy,
  Sparkles,
  Send,
  Sliders,
  ChevronDown,
  ChevronRight,
  Gauge,
  Activity,
  Compass,
  Eye,
  Info,
  HelpCircle,
  Trophy,
  Bookmark,
  Lightbulb,
  Check,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUp,
  ArrowDown,
  Layers,
  Wind,
  Zap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// 5 Motion Types Definition
interface MotionTypeItem {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  exampleBn: string;
  iconText: string;
}

const MOTION_TYPES: MotionTypeItem[] = [
  {
    id: 'linear',
    nameBn: '১. সরল রৈখিক গতি',
    nameEn: 'Linear Motion',
    descBn: 'কোনো বস্তু যদি একটি সোজা সরলরেখা বরাবর গতিশীল হয়, তবে তার গতিকে সরল রৈখিক গতি বলে।',
    exampleBn: 'সোজা রাস্তায় কোনো গাড়ির গতি, সোজা রেললাইনে ট্রেনের এগিয়ে চলা।',
    iconText: '➡️',
  },
  {
    id: 'rotational',
    nameBn: '২. ঘূর্ণন গতি',
    nameEn: 'Rotational Motion',
    descBn: 'কোনো নির্দিষ্ট বিন্দু বা অক্ষকে কেন্দ্র করে নির্দিষ্ট দূরত্ব বজায় রেখে বস্তুর ঘুরে আসাকে ঘূর্ণন গতি বলে।',
    exampleBn: 'বৈদ্যুতিক পাখার ঘূর্ণন, সাইকেলের চাকা, পৃথিবীর নিজ অক্ষের চারপাশের ঘূর্ণন।',
    iconText: '🔄',
  },
  {
    id: 'translatory',
    nameBn: '৩. চলন গতি',
    nameEn: 'Translatory Motion',
    descBn: 'বস্তুর সকল কণা একই সময়ে একই দিকে সমান দূরত্ব অতিক্রম করলে সেই গতিকে চলন গতি বলে।',
    exampleBn: 'বাক্সকে মেঝেতে টেনে সরানো, কোনো বস্তুকে না ঘুরিয়ে সোজা এক স্থান থেকে অন্য স্থানে নেওয়া।',
    iconText: '📦',
  },
  {
    id: 'periodic',
    nameBn: '৪. পর্যায়বৃত্ত গতি',
    nameEn: 'Periodic Motion',
    descBn: 'গতিশীল বস্তু একটি নির্দিষ্ট বিন্দুকে নির্দিষ্ট সময় পরপর একই দিক থেকে বারবার অতিক্রম করলে তা পর্যায়বৃত্ত গতি।',
    exampleBn: 'ঘড়ির কাঁটার গতি, সূর্যের চারদিকে পৃথিবীর বার্ষিক গতি।',
    iconText: '⏰',
  },
  {
    id: 'oscillatory',
    nameBn: '৫. স্পন্দন বা সরল ছন্দিত গতি',
    nameEn: 'Oscillatory / SHM',
    descBn: 'পর্যায়কালের অর্ধেক সময় একটি নির্দিষ্ট দিকে এবং বাকি অর্ধেক সময় বিপরীত দিকে গতিশীল থাকলে তা স্পন্দন গতি।',
    exampleBn: 'সরল দোলকের দোলন, গিটারের তারের কম্পন, সুরশলাকার দোলন।',
    iconText: '〰️',
  },
];

export function PhysicsMotionGuidebook() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Navigation State
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);

  // Lesson 1: Motion Types State
  const [selectedMotionType, setSelectedMotionType] = useState<string>('linear');
  const [referenceObserver, setReferenceObserver] = useState<'train' | 'platform'>('platform');

  // Lesson 2: Vector vs Scalar State
  const [pathProgress, setPathProgress] = useState<number>(65); // 0 to 100%
  const [isWhirling, setIsWhirling] = useState<boolean>(true);

  // Lesson 3: 4 Equations Interactive Car Simulator State
  const [initialVelU, setInitialVelU] = useState<number>(5); // m/s
  const [accelA, setAccelA] = useState<number>(2); // m/s²
  const [simTimeT, setSimTimeT] = useState<number>(4); // s
  const [isCarRunning, setIsCarRunning] = useState<boolean>(false);
  const [carAnimTime, setCarAnimTime] = useState<number>(0);

  // Lesson 4: Galileo Free Fall Simulation State
  const [chamberVacuum, setChamberVacuum] = useState<boolean>(false);
  const [dropAnimationTrigger, setDropAnimationTrigger] = useState<number>(0);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [projectileU, setProjectileU] = useState<number>(29.4); // m/s (Rajshahi Board default)

  // Lesson 5: Graph Inspector State
  const [activeGraphPhase, setActiveGraphPhase] = useState<'accel' | 'constant' | 'decel'>('constant');

  // Step 2 Example State
  const [selectedExampleTab, setSelectedExampleTab] = useState<number>(1);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // Step 3 Practice Labs State
  const [calcInputV, setCalcInputV] = useState<string>('');
  const [calcInputS, setCalcInputS] = useState<string>('');
  const [calcFeedback, setCalcFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const [graphAreaInput, setGraphAreaInput] = useState<string>('');
  const [graphAreaFeedback, setGraphAreaFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const [brakeObsInput, setBrakeObsInput] = useState<string>('');
  const [brakeFeedback, setBrakeFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Step 4 MCQ Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Step 5 Copy Toast State
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // AI Tutor Quick Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([
    {
      sender: 'tutor',
      text: 'স্বাগতম পদার্থবিজ্ঞান গতি (Motion) ল্যাবে! গতির সমীকরণ ($v = u + at, s = ut + \\frac{1}{2}at^2$), মুক্তভাবে পড়ন্ত বস্তু বা $v-t$ গ্রাফ নিয়ে যেকোনো প্রশ্ন করো। আমি ধাপে ধাপে বুঝিয়ে দেবো!',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Modals for Chapter Resources
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Car Simulator Animation Loop
  useEffect(() => {
    let animFrame: number;
    if (isCarRunning) {
      const startTime = performance.now();
      const duration = simTimeT * 1000;

      const loop = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < duration) {
          setCarAnimTime(elapsed / 1000);
          animFrame = requestAnimationFrame(loop);
        } else {
          setCarAnimTime(simTimeT);
          setIsCarRunning(false);
        }
      };
      animFrame = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isCarRunning, simTimeT]);

  // Free Fall Drop Animation
  useEffect(() => {
    if (dropAnimationTrigger > 0) {
      setIsDropping(true);
      const timer = setTimeout(() => {
        setIsDropping(false);
      }, chamberVacuum ? 1200 : 2500);
      return () => clearTimeout(timer);
    }
  }, [dropAnimationTrigger, chamberVacuum]);

  // Lessons Metadata
  const LESSONS_META: Record<
    number,
    { no: string; titleBn: string; titleEn: string; overviewBn: string; studyTip: string }
  > = {
    1: {
      no: '০১',
      titleBn: 'স্থিতি, গতি ও ৫ প্রকারের গতির ম্যাপিং',
      titleEn: 'Rest, Reference Frames & 5 Motion Types',
      overviewBn:
        'প্রসঙ্গ কাঠামো এবং মহাবিশ্বের সব গতিই আপেক্ষিক। রৈখিক, ঘূর্ণন, চলন, পর্যায়বৃত্ত ও স্পন্দন গতির বাস্তব অ্যানিমেশন।',
      studyTip:
        'ঘড়ির কাঁটার গতি পর্যায়বৃত্ত হলেও তার কাঁটার অগ্রভাগের গতি একই সাথে ঘূর্ণন গতি। কোনো গতিই পরম নয়, সবই আপেক্ষিক!',
    },
    2: {
      no: '০২',
      titleBn: 'দূরত্ব বনাম সরণ এবং দ্রুতি বনাম বেগ',
      titleEn: 'Distance vs Displacement & Velocity Vector',
      overviewBn:
        'স্কেলার ও ভেক্টর রাশির পার্থক্য। বক্রপথে দ্রুতি স্থির থাকলেও দিক পরিবর্তনের কারণে কেন বেগ পরিবর্তিত হয় এবং ত্বরণ ঘটে।',
      studyTip:
        'বৃত্তাকার পথে সমদ্রুতিতে ঘুরলেও প্রতি সেকেন্ডে স্পর্শক বরাবর দিক পরিবর্তিত হওয়ায় কেন্দ্রমুখী ত্বরণ সৃষ্টি হয়!',
    },
    3: {
      no: '০৩',
      titleBn: 'গতির ৪টি মৌলিক সমীকরণ ও কার ল্যাব',
      titleEn: '4 Equations of Motion & Interactive Car Lab',
      overviewBn:
        'v = u + at, s = (u+v)/2 * t, s = ut + 1/2at², v² = u² + 2as এর প্রমাণ ও রিয়েল-টাইম ফিজিক্স ইঞ্জিন সিমুলেশন।',
      studyTip:
        'গাড়ি স্থির অবস্থান থেকে যাত্রা শুরু করলে u = 0, আর ব্রেক করে থামলে শেষ বেগ v = 0। মন্দন হলে a এর মান ঋণাত্মক!',
    },
    4: {
      no: '০৪',
      titleBn: 'গ্যালিলিওর পরন্ত বস্তু ও নিক্ষিপ্ত বস্তু ল্যাব',
      titleEn: 'Galileo Free Fall & Vertical Projectile Lab',
      overviewBn:
        'বাতাস বনাম বায়ুশূন্য ভ্যাকুয়ামে হালকা ও ভারী বস্তুর পতন। খাড়া নিক্ষিপ্ত বস্তুর সর্বোচ্চ উচ্চতা ও উড্ডয়নকাল।',
      studyTip:
        'বায়ুশূন্য স্থানে এক খণ্ড ভারী পাথর ও একটি পাখির পালক একই সাথে ফেললে দুটিই ঠিক একই মুহূর্তে মাটিতে স্পর্শ করবে!',
    },
    5: {
      no: '০৫',
      titleBn: 'গ্রাফ গোয়েন্দা: s-t ও v-t লেখচিত্রের ক্ষেত্রফল ও ঢাল',
      titleEn: 'Motion Graphs: s-t & v-t Slope & Area Analysis',
      overviewBn:
        'v-t গ্রাফের নিচের ক্ষেত্রফল কীভাবে ক্যালকুলাস ছাড়াই মোট অতিক্রান্ত দূরত্ব (s) দেয় এবং ঢাল কীভাবে ত্বরণ প্রকাশ করে।',
      studyTip:
        'v-t লেখচিত্রের ত্রিভুজ ও আয়তক্ষেত্রের ক্ষেত্রফলের যোগফলই হলো সরাসরি s = ut + 1/2at² সূত্রের জ্যামিতিক প্রমাণ!',
    },
  };

  const currentLessonMeta = LESSONS_META[activeLesson] || LESSONS_META[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

  // Calculated Values for Equations of Motion
  const finalVelV = Number((initialVelU + accelA * simTimeT).toFixed(2));
  const avgVel = Number(((initialVelU + finalVelV) / 2).toFixed(2));
  const distS = Number((initialVelU * simTimeT + 0.5 * accelA * Math.pow(simTimeT, 2)).toFixed(2));

  // Car Animation Instant Position
  const currentT = isCarRunning ? carAnimTime : simTimeT;
  const animDist = Math.max(0, initialVelU * currentT + 0.5 * accelA * Math.pow(currentT, 2));
  const maxPossibleDist = 30 * 10 + 0.5 * 5 * 100; // max scale
  const carPercent = Math.min(92, Math.max(2, (animDist / Math.max(1, distS * 1.2 || 100)) * 85));

  // Vertical Projectile Calculations
  const gConst = 9.8;
  const maxHeightH = Number(((Math.pow(projectileU, 2)) / (2 * gConst)).toFixed(2));
  const totalFlightTimeT = Number(((2 * projectileU) / gConst).toFixed(2));
  const timeToPeak = Number((projectileU / gConst).toFixed(2));

  // MCQs Data
  const MCQS = [
    {
      id: 1,
      board: 'পাঠ্যবই নমুনা প্রশ্ন ১',
      question: 'ত্বরণের এসআই (SI) একক কোনটি?',
      options: ['ms⁻¹', 'ms⁻²', 'Ns', 'kg s⁻²'],
      correct: 1,
      explanation: 'ত্বরণ হলো সময়ের সাথে বেগের পরিবর্তনের হার: $a = \\frac{v - u}{t}$, যার একক $\\text{ms}^{-2}$।',
    },
    {
      id: 2,
      board: 'পাঠ্যবই নমুনা প্রশ্ন ২',
      question: 'ঘড়ির কাঁটার গতি নিচের কোন ধরনের গতি?',
      options: ['সরল রৈখিক গতি', 'উপবৃত্তাকার গতি', 'পর্যায়বৃত্ত গতি', 'স্পন্দন গতি'],
      correct: 2,
      explanation:
        'ঘড়ির কাঁটা একটি নির্দিষ্ট সময় পরপর একই দিক থেকে পুনরাবৃত্ত হয়, তাই এটি সুষম পর্যায়বৃত্ত গতি (Periodic Motion)।',
    },
    {
      id: 3,
      board: 'পাঠ্যবই নমুনা প্রশ্ন ৩',
      question:
        'স্থির অবস্থান থেকে বিনা বাধায় মুক্তভাবে পড়ন্ত বস্তুর নির্দিষ্ট সময়ে অতিক্রান্ত দূরত্ব সময়ের কিসের সমানুপাতিক?',
      options: ['সময়ের সমানুপাতিক', 'সময়ের বর্গের সমানুপাতিক', 'সময়ের ব্যস্তানুপাতিক', 'সময়ের বর্গমূলের সমানুপাতিক'],
      correct: 1,
      explanation:
        'গ্যালিলিওর ৩য় সূত্রানুসারে, স্থির অবস্থান থেকে মুক্তভাবে পড়ন্ত বস্তুর ক্ষেত্রে $h \\propto t^2$, অর্থাৎ দূরত্বের মান সময়ের বর্গের সমানুপাতিক।',
    },
    {
      id: 4,
      board: 'ঢাকা বোর্ড ২০২৪',
      question: 'একটি গাড়ি স্থির অবস্থান থেকে $2\\text{ m/s}^2$ সুষম ত্বরণে চললে ৫ম সেকেন্ডে (in 5th second) অতিক্রান্ত দূরত্ব কত?',
      options: ['২৫ মিটার', '৫০ মিটার', '৯ মিটার', '১৬ মিটার'],
      correct: 2,
      explanation:
        'নির্দিষ্ট $t$-তম সেকেন্ডে অতিক্রান্ত দূরত্ব $s_{t\\text{th}} = u + \\frac{1}{2}a(2t - 1) = 0 + \\frac{1}{2}(2)(2 \\times 5 - 1) = 9\\text{ m}$।',
    },
    {
      id: 5,
      board: 'চট্টগ্রাম বোর্ড ২০২৩',
      question: 'বেগ-সময় ($v-t$) লেখচিত্রের যেকোনো বিন্দুর স্পর্শকের ঢাল কী নির্দেশ করে?',
      options: ['অতিক্রান্ত দূরত্ব', 'গড় দ্রুতি', 'ত্বরণ', 'ভরবেগ'],
      correct: 2,
      explanation:
        'বেগ-সময় লেখচিত্রের ঢাল $\\text{Slope} = \\frac{\\Delta v}{\\Delta t}$ সরাসরি বস্তুর ত্বরণ (Acceleration) নির্দেশ করে। আর লেখের নিচের ক্ষেত্রফল নির্দেশ করে অতিক্রান্ত দূরত্ব।',
    },
  ];

  // Study note copy action
  const handleCopyStudyNotes = () => {
    const text = `পদার্থবিজ্ঞান অধ্যায় ২: গতি (Motion) রিভিশন চিট-শিট
১. গতির মৌলিক সমীকরণসমূহ:
• v = u + at
• s = ((u + v) / 2) * t
• s = ut + (1/2) * a * t²
• v² = u² + 2as
• sth = u + (1/2) * a * (2t - 1)

২. পরন্ত ও নিক্ষিপ্ত বস্তুর সূত্রাবলী (g = 9.8 m/s²):
• v = u - gt (খাড়া উপরে নিক্ষেপ)
• h = ut - (1/2) * gt²
• v² = u² - 2gh
• সর্বোচ্চ উচ্চতা H = u² / (2g)
• উড্ডয়নকাল T = 2u / g

৩. গ্রাফের স্বর্ণসূত্র:
• s-t লেখচিত্রের ঢাল = বেগ (v)
• v-t লেখচিত্রের ঢাল = ত্বরণ (a)
• v-t লেখচিত্রের নিচের ক্ষেত্রফল = অতিক্রান্ত দূরত্ব (s)`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // AI Chat submission handler
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = '';
      const lower = userMsg.toLowerCase();
      if (lower.includes('সমীকরণ') || lower.includes('equation') || lower.includes('s =')) {
        reply =
          'গতির ৪টি সমীকরণ মনে রাখার সবচেয়ে সহজ কৌশল:\n১. দূরত্ব নেই: $v = u + at$\n২. ত্বরণ নেই: $s = \\frac{u+v}{2}t$\n৩. শেষ বেগ নেই: $s = ut + \\frac{1}{2}at^2$\n৪. সময় নেই: $v^2 = u^2 + 2as$। প্রশ্নে কোন মানটি দেওয়া নেই তা দেখলেই বুঝতে পারবে কোন সূত্রটি ব্যবহার করতে হবে!';
      } else if (lower.includes('পরন্ত') || lower.includes('fall') || lower.includes('গ্যালিলিও')) {
        reply =
          'গ্যালিলিওর পরন্ত বস্তুর ৩টি শর্ত:\n১. বস্তু স্থির অবস্থান থেকে পড়বে ($u=0$)\n২. একই উচ্চতা হতে হবে\n৩. কোনো বায়ুর বাধা থাকা চলবে না।\nবায়ুশূন্য অবস্থায় পালক ও লোহার বল একই সাথে ভূমিতে পৌঁছায় কারণ অভিকর্ষজ ত্বরণ $g$ বস্তুর ভরের ওপর নির্ভর করে না!';
      } else if (lower.includes('গ্রাফ') || lower.includes('ঢাল') || lower.includes('ক্ষেত্রফল')) {
        reply =
          'গ্রাফের ২টি জাদুকরী নিয়ম:\n১. $s-t$ গ্রাফের ঢাল = বেগ ($v$)\n২. $v-t$ গ্রাফের ঢাল = ত্বরণ ($a$), আর $v-t$ গ্রাফের নিচের ক্ষেত্রফল = মোট অতিক্রান্ত দূরত্ব ($s$)!';
      } else {
        reply =
          'গতি অধ্যায়ে ত্বরণ $a = \\frac{v - u}{t}$, গাড়ি ব্রেক করলে মন্দন হয়। কোনো গাণিতিক মান বুঝতে সমস্যা হলে আমাকে বলো, আমি মান বসিয়ে ধাপে ধাপে বের করে দেবো!';
      }
      setChatMessages((prev) => [...prev, { sender: 'tutor', text: reply }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Switcher Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-card border border-border hover:bg-muted text-muted-foreground flex items-center gap-1.5 transition-colors"
            title={isSidebarOpen ? 'পাঠ তালিকা লুকান' : 'পাঠ তালিকা দেখুন'}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span className="hidden sm:inline">পাঠ তালিকা লুকান</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="h-4 w-4" />
                <span className="hidden sm:inline">পাঠ তালিকা খুলুন</span>
              </>
            )}
          </button>

          <Link
            href="/dashboard/playground/v2"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>লাইব্রেরিতে ফিরুন</span>
          </Link>

          <span className="text-muted-foreground">/</span>
          <span className="font-semibold text-foreground">পদার্থবিজ্ঞান</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-bold text-primary">অধ্যায় ২: গতি (Motion)</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs text-muted-foreground">Lesson {activeLesson}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('notes')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20 transition-all text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI শিক্ষক</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Version 2.0 • Virtual Guidebook</span>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Lesson Navigation Sidebar */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4 animate-in slide-in-from-left duration-200">
            {/* Subject Info Card */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  শ্রেণি ও বিষয়
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-sm">Class 9–10 (SSC)</h3>
                  <p className="text-xs text-muted-foreground">পদার্থবিজ্ঞান (Physics)</p>
                </div>
              </div>
            </div>

            {/* Chapter Header & Lesson Selector */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black text-primary uppercase tracking-wider">
                    CHAPTER 2
                  </span>
                  <h2 className="text-base font-black text-foreground font-heading">
                    গতি (Motion)
                  </h2>
                  <p className="text-[11px] text-muted-foreground">Kinematics & Motion Graphs</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-primary">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B57] to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>{completedLessons.length} / ৫টি পাঠ সম্পন্ন</span>
                <span className="text-emerald-600 font-bold">১০ নম্বর নিশ্চিত</span>
              </div>

              {/* 5 Lessons List */}
              <div className="space-y-1.5 pt-2">
                {[
                  { id: 1, no: '০১', titleBn: 'স্থিতি, গতি ও ৫ প্রকার গতি', titleEn: '5 Motion Types & Reference' },
                  { id: 2, no: '০২', titleBn: 'দূরত্ব বনাম সরণ ও বেগ', titleEn: 'Distance vs Displacement' },
                  { id: 3, no: '০৩', titleBn: 'গতির ৪টি সমীকরণ ও কার ল্যাব', titleEn: '4 Equations of Motion' },
                  { id: 4, no: '০৪', titleBn: 'গ্যালিলিওর পরন্ত বস্তু ল্যাব', titleEn: 'Galileo Free Fall Lab' },
                  { id: 5, no: '০৫', titleBn: 'গ্রাফ গোয়েন্দা: s-t ও v-t', titleEn: 'Motion Graph Area & Slope' },
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
                          ? 'bg-[#FF6B57]/10 border border-[#FF6B57]/30 text-primary shadow-xs'
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
                          <div
                            className={`text-xs font-extrabold ${
                              isActive ? 'text-foreground' : 'group-hover:text-foreground'
                            }`}
                          >
                            {item.titleBn}
                          </div>
                          <div className="text-[10px] text-muted-foreground line-clamp-1">
                            {item.titleEn}
                          </div>
                        </div>
                      </div>

                      {isActive ? (
                        <Play className="h-3.5 w-3.5 text-primary fill-primary flex-shrink-0" />
                      ) : isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Chapter Resources Links */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2 text-xs">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-primary" />
                <span>অধ্যায় রিসোর্স (Resources)</span>
              </span>
              <div className="space-y-1 pt-1">
                <button
                  onClick={() => setActiveModal('nctb_book')}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>এনসিটিবি পাঠ্যবই (পৃষ্ঠা ৩৫–৬৫)</span>
                </button>
                <button
                  onClick={() => setActiveModal('notes')}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  <span>গতির ৫টি স্বর্ণসূত্র সামারি</span>
                </button>
                <button
                  onClick={() => setActiveModal('board_questions')}
                  className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>বিগত ৫ বছরের বোর্ড প্রশ্ন সম্ভার</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Center Guidebook Canvas */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Top Lesson Header Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-xs">
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 via-amber-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#FF6B57]/10 text-[#FF6B57] font-black text-sm flex items-center justify-center flex-shrink-0 border border-[#FF6B57]/20">
                  {currentLessonMeta.no}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-black text-foreground font-heading whitespace-nowrap">
                      {currentLessonMeta.titleBn}
                    </h1>
                    <span className="text-xs text-muted-foreground font-semibold hidden sm:inline">
                      ({currentLessonMeta.titleEn})
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
                      ★ বোর্ডে নিশ্চিত প্রশ্ন
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                    {currentLessonMeta.overviewBn}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/60 flex-shrink-0 text-xs font-bold text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>পদার্থবিজ্ঞান অধ্যায় ২: ৫টি সম্পূর্ণ ধাপ</span>
              </div>
            </div>
          </div>

          {/* 5-Step Learning Navigation Tabs (Strictly Matching media_1790987461165.png) */}
          <div className="border-b border-border/70 px-1 pt-1 pb-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-start sm:justify-between w-full min-w-max sm:min-w-0">
              {[
                { id: 'concept', no: 1, label: 'Learn Concept' },
                { id: 'example', no: 2, label: 'See Example' },
                { id: 'try', no: 3, label: 'Try Yourself' },
                { id: 'check', no: 4, label: 'Check Understanding' },
                { id: 'summary', no: 5, label: 'Summary' },
              ].map((tab) => {
                const isActive = activeStep === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-step-tab={tab.id}
                    onClick={() => {
                      setActiveStep(tab.id as LearningStep);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group relative pb-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] md:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'text-[#FF5B46]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive ? (
                      <span className="h-5 w-5 sm:h-5.5 sm:w-5.5 rounded-full bg-[#FF5B46] text-white flex items-center justify-center text-[11px] sm:text-xs font-black shadow-xs shrink-0">
                        {tab.no}
                      </span>
                    ) : (
                      <span className="font-mono text-xs sm:text-[13px] md:text-sm text-slate-500 dark:text-slate-400 font-semibold group-hover:text-slate-800 dark:group-hover:text-slate-200 shrink-0">
                        {tab.no}
                      </span>
                    )}
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-px left-0 right-0 h-[2.5px] bg-[#FF5B46] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC LESSON & STEP ROUTER */}

          {/* ========================================================= */}
          {/* STEP 1: LEARN CONCEPT (ইন্টারেক্টিভ ভিজ্যুয়াল সিমুলেটর) */}
          {/* ========================================================= */}
          {activeStep === 'concept' && (
            <div className="space-y-6 animate-in fade-in">
              {/* LESSON 1: 5 TYPES OF MOTION & REFERENCE FRAME */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  {/* Motion Types Selector Grid */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. গতির ৫টি প্রধান শ্রেণিবিভাগ (5 Types of Motion)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          এনসিটিবি পাঠ্যবইয়ের ৩৬–৩৮ পৃষ্ঠা অনুযায়ী বিভিন্ন প্রকার গতির বাস্তব অ্যানিমেশন ও উদাহরণ
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                        ৫ প্রকার গতি
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {MOTION_TYPES.map((item) => {
                        const isSelected = selectedMotionType === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedMotionType(item.id)}
                            className={`p-3 rounded-2xl border text-left transition-all space-y-1.5 ${
                              isSelected
                                ? 'bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary'
                                : 'bg-muted/40 border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <div className="text-xl">{item.iconText}</div>
                            <div className="text-xs font-extrabold leading-tight">{item.nameBn}</div>
                            <div className="text-[10px] opacity-80">{item.nameEn}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Motion Type Detailed Visual Display */}
                    {(() => {
                      const activeItem =
                        MOTION_TYPES.find((m) => m.id === selectedMotionType) || MOTION_TYPES[0];
                      return (
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 flex flex-col md:flex-row items-center gap-6">
                          {/* Left Animation Preview Box */}
                          <div className="w-full md:w-56 h-36 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                            {activeItem.id === 'linear' && (
                              <div className="w-full flex items-center justify-start space-x-2 animate-pulse">
                                <div className="text-3xl animate-bounce">🚗</div>
                                <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
                                <span className="text-[10px] font-mono text-emerald-400">সরলরৈখিক পথ</span>
                              </div>
                            )}

                            {activeItem.id === 'rotational' && (
                              <div className="flex flex-col items-center justify-center">
                                <div className="h-14 w-14 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center animate-spin">
                                  <div className="h-3 w-3 rounded-full bg-cyan-400" />
                                </div>
                                <span className="text-[10px] font-mono text-cyan-300 mt-2">নির্দিষ্ট অক্ষ</span>
                              </div>
                            )}

                            {activeItem.id === 'translatory' && (
                              <div className="flex flex-col items-center gap-1.5">
                                <div className="h-10 w-24 rounded-lg bg-indigo-500/40 border border-indigo-400 flex items-center justify-center text-xs font-bold text-white">
                                  📦 চলন বস্তু
                                </div>
                                <span className="text-[10px] font-mono text-indigo-300">সব বিন্দু সমান্তরাল</span>
                              </div>
                            )}

                            {activeItem.id === 'periodic' && (
                              <div className="flex flex-col items-center justify-center">
                                <div className="h-14 w-14 rounded-full border-2 border-amber-400/60 flex items-center justify-center relative">
                                  <div className="absolute top-1 text-[10px]">12</div>
                                  <div className="h-5 w-0.5 bg-amber-400 origin-bottom animate-spin" />
                                </div>
                                <span className="text-[10px] font-mono text-amber-300 mt-1">নির্দিষ্ট পর্যায়কাল</span>
                              </div>
                            )}

                            {activeItem.id === 'oscillatory' && (
                              <div className="flex flex-col items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-rose-500" />
                                <div className="h-8 w-0.5 bg-slate-400 origin-top animate-bounce" />
                                <div className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                                  ●
                                </div>
                                <span className="text-[10px] font-mono text-rose-300 mt-1">ডানে-বামে স্পন্দন</span>
                              </div>
                            )}
                          </div>

                          {/* Right Content Description */}
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{activeItem.iconText}</span>
                              <h4 className="text-sm sm:text-base font-black text-foreground">
                                {activeItem.nameBn}
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {activeItem.descBn}
                            </p>
                            <div className="p-2.5 rounded-xl bg-card border border-border text-xs flex items-center gap-2">
                              <span className="font-bold text-primary shrink-0">বাস্তব উদাহরণ:</span>
                              <span className="text-foreground">{activeItem.exampleBn}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Reference Frame & Relativity Visualizer */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ২. প্রসঙ্গ কাঠামো ও আপেক্ষিকতা (Reference Frame: All Motion is Relative)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          "মহাবিশ্বের কোনো গতিই পরম নয়, সকল গতিই আপেক্ষিক"— পর্যবেক্ষক পরিবর্তন করে পরীক্ষা করো
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
                        বোর্ড অনুধাবন প্রশ্ন
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
                      {/* Observer Switcher Buttons */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-300">পর্যবেক্ষকের অবস্থান:</span>
                        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl">
                          <button
                            onClick={() => setReferenceObserver('platform')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              referenceObserver === 'platform'
                                ? 'bg-primary text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            🚉 স্টেশনের দর্শক (Platform)
                          </button>
                          <button
                            onClick={() => setReferenceObserver('train')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              referenceObserver === 'train'
                                ? 'bg-primary text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            🚆 ট্রেনের ভেতরের সহযাত্রী (Train)
                          </button>
                        </div>
                      </div>

                      {/* Visual Simulation Track */}
                      <div className="h-28 rounded-xl bg-slate-950 border border-slate-800 p-4 relative flex items-center justify-between overflow-hidden">
                        {/* Train Track */}
                        <div className="absolute left-0 right-0 bottom-6 h-1 bg-slate-700 border-b border-dashed border-slate-500" />

                        {/* Train Box */}
                        <div
                          className={`relative z-10 px-4 py-2 rounded-xl bg-indigo-600/90 border border-indigo-400 flex items-center gap-3 text-xs font-bold shadow-lg transition-transform duration-700 ${
                            referenceObserver === 'platform' ? 'translate-x-32 sm:translate-x-64' : 'translate-x-12'
                          }`}
                        >
                          <span>🚆 এক্সপ্রেস ট্রেন (v = 80 km/h)</span>
                          <span className="h-6 w-6 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center text-[10px]">
                            👤
                          </span>
                        </div>

                        {/* Platform Observer */}
                        <div className="absolute left-6 bottom-2 text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <span>🧍 স্টেশনের দর্শক</span>
                        </div>
                      </div>

                      {/* Explanation Result */}
                      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs sm:text-sm leading-relaxed">
                        {referenceObserver === 'platform' ? (
                          <div className="space-y-1">
                            <span className="font-bold text-amber-400">স্টেশনের দর্শকের দৃষ্টিতে:</span>
                            <p className="text-slate-200">
                              ট্রেন এবং ট্রেনের ভেতরের যাত্রী উভয়ই ৮০ কিমি/ঘণ্টা বেগে গতিশীল। কারণ দর্শকের সাপেক্ষে দূরত্বের পরিবর্তন ঘটছে।
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="font-bold text-emerald-400">সহযাত্রীর দৃষ্টিতে:</span>
                            <p className="text-slate-200">
                              পাশের আসনে বসা যাত্রী সম্পূর্ণ স্থির! কারণ ট্রেনের সাপেক্ষে তাদের মধ্যবর্তী দূরত্বের কোনো পরিবর্তন হচ্ছে না। অথচ বাইরে তাকালে গাছপালা পেছনের দিকে ছুটে যাচ্ছে মনে হয়!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 2: DISTANCE VS DISPLACEMENT & SPEED VS VELOCITY */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  {/* Curving Path Distance vs Displacement Lab */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. দূরত্ব বনাম সরণ (Distance vs Displacement Canvas)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          স্লাইডার টেনে সাইকেল চালিয়ে দেখো কীভাবে দূরত্ব ও সরণ ভিন্ন মান প্রকাশ করে (NCTB চিত্র ২.০৪)
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
                        স্কেলার বনাম ভেক্টর
                      </span>
                    </div>

                    {/* SVG Curved Path Canvas */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="relative h-56 sm:h-64 w-full rounded-xl bg-slate-950 border border-slate-800/80 p-2 overflow-hidden flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 500 200">
                          {/* Grid Lines */}
                          <defs>
                            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                            </pattern>
                          </defs>
                          <rect width="500" height="200" fill="url(#grid)" />

                          {/* Curved Road Path */}
                          <path
                            d="M 60 150 Q 150 20 250 140 T 440 60"
                            fill="none"
                            stroke="#475569"
                            strokeWidth="12"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 60 150 Q 150 20 250 140 T 440 60"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="3"
                            strokeDasharray="6 6"
                          />

                          {/* Displacement Straight Vector Arrow */}
                          <line
                            x1="60"
                            y1="150"
                            x2="440"
                            y2="60"
                            stroke="#f43f5e"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                          />

                          {/* Start Point A */}
                          <circle cx="60" cy="150" r="8" fill="#10b981" />
                          <text x="52" y="180" fill="#10b981" fontSize="12" fontWeight="bold">
                            বিন্দু A (0 km)
                          </text>

                          {/* End Point B */}
                          <circle cx="440" cy="60" r="8" fill="#f43f5e" />
                          <text x="410" y="45" fill="#f43f5e" fontSize="12" fontWeight="bold">
                            বিন্দু B (গন্তব্য)
                          </text>

                          {/* Dynamic Cyclist Marker along Path */}
                          {(() => {
                            const t = pathProgress / 100;
                            // Approximate Bezier position
                            const curX = 60 + 380 * t;
                            const curY = 150 - 90 * Math.sin(t * Math.PI) - 90 * t;
                            return (
                              <g transform={`translate(${curX}, ${curY})`}>
                                <circle r="12" fill="#f59e0b" />
                                <text x="-6" y="4" fontSize="10">
                                  🚴
                                </text>
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Slider Control */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                          <span>সাইকেলের গতিপথ নিয়ন্ত্রণ (Path Progress):</span>
                          <span className="font-mono text-amber-400 font-bold">{pathProgress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={pathProgress}
                          onChange={(e) => setPathProgress(Number(e.target.value))}
                          className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Live Calculated Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <div className="text-slate-400 font-medium">অতিক্রান্ত দূরত্ব (Distance - স্কেলার):</div>
                          <div className="text-xl font-mono font-black text-sky-400">
                            {((pathProgress / 100) * 4.2).toFixed(2)} km
                          </div>
                          <p className="text-[11px] text-slate-300">
                            বক্রপথের সম্পূর্ণ দৈর্ঘ্য। দিক বিবেচনা করা হয় না।
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                          <div className="text-slate-400 font-medium">সরণ (Displacement - ভেক্টর):</div>
                          <div className="text-xl font-mono font-black text-rose-400">
                            {((pathProgress / 100) * 3.1).toFixed(2)} km (৩৪° উত্তর-পূর্ব)
                          </div>
                          <p className="text-[11px] text-slate-300">
                            আদি বিন্দু A থেকে সরাসরি শেষ বিন্দুর সরলরৈখিক ন্যূনতম দূরত্ব।
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Whirling Stone Tangent Vector Demo */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ২. সুষম দ্রুতি বনাম পরিবর্তনশীল বেগ (Whirling Stone Lab)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          সুতায় বাঁধা পাথরের বৃত্তাকার ঘূর্ণন— দ্রুতি স্থির থাকলেও কেন বেগ পরিবর্তিত হয়? (NCTB চিত্র ২.০৫)
                        </p>
                      </div>
                      <button
                        onClick={() => setIsWhirling(!isWhirling)}
                        className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20 transition-all flex items-center gap-1.5"
                      >
                        {isWhirling ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span>{isWhirling ? 'ঘূর্ণন থামান' : 'ঘূর্ণন শুরু করুন'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative h-44 w-44 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center shrink-0">
                        <div className="h-2 w-2 rounded-full bg-foreground" />
                        {/* Orbiting Stone */}
                        <div
                          className={`absolute inset-0 flex items-start justify-center ${
                            isWhirling ? 'animate-spin' : ''
                          }`}
                          style={{ animationDuration: '3s' }}
                        >
                          <div className="relative -top-2.5 flex flex-col items-center">
                            <span className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                              🪨
                            </span>
                            {/* Tangent arrow */}
                            <span className="text-xs text-primary font-bold mt-0.5">➡️ v</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm text-foreground">
                        <div className="font-bold text-primary">বোর্ড পরীক্ষার অতি গুরুত্বপূর্ণ অনুধাবন:</div>
                        <p className="text-muted-foreground leading-relaxed">
                          পাথরটির <strong>দ্রুতি (Speed)</strong> স্থির (যেমন ১০ m/s), কিন্তু বৃত্তের প্রতিটি বিন্দুতে এর গতির দিক প্রতিনিয়ত স্পর্শক (tangent) বরাবর পরিবর্তিত হচ্ছে।
                        </p>
                        <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                          <div>✓ বেগ = মান + দিক। দিক পরিবর্তন হওয়ায় <strong>বেগ পরিবর্তিত হচ্ছে</strong>।</div>
                          <div>✓ বেগ পরিবর্তনের কারণে কেন্দ্রে একটি <strong>কেন্দ্রমুখী ত্বরণ (Centripetal Acceleration)</strong> ক্রিয়াশীল।</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 3: 4 EQUATIONS OF MOTION & INTERACTIVE CAR LAB */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  {/* Interactive Car Runner Sandbox */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          গতির ৪টি সমীকরণ ও কার সিমুলেটর (Interactive Car Simulator)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          আদি বেগ (u), ত্বরণ (a) ও সময় (t) পরিবর্তন করে লাইভ গাড়ি চালিয়ে দূরত্ব ও শেষ বেগ গণনা করো
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCarAnimTime(0);
                            setIsCarRunning(true);
                          }}
                          disabled={isCarRunning}
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          <Play className="h-3.5 w-3.5 fill-white" />
                          <span>সিমুলেশন চালান</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsCarRunning(false);
                            setCarAnimTime(0);
                          }}
                          className="p-2 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all"
                          title="রিসেট"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Physics Track Canvas */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
                      {/* Track Visual */}
                      <div className="relative h-24 rounded-xl bg-slate-950 border border-slate-800 p-2 overflow-hidden flex items-end">
                        {/* Distance Rulers */}
                        <div className="absolute top-2 left-4 right-4 flex justify-between text-[10px] font-mono text-slate-500">
                          <span>0 m</span>
                          <span>{((distS * 0.25) || 25).toFixed(0)} m</span>
                          <span>{((distS * 0.5) || 50).toFixed(0)} m</span>
                          <span>{((distS * 0.75) || 75).toFixed(0)} m</span>
                          <span>{(distS || 100).toFixed(0)} m</span>
                        </div>

                        {/* Road Stripes */}
                        <div className="w-full h-8 border-t border-b border-slate-700 bg-slate-900/60 relative flex items-center">
                          <div className="w-full h-0.5 border-b border-dashed border-amber-400/50" />
                          {/* Animated Car */}
                          <div
                            className="absolute transition-all duration-75 flex flex-col items-center"
                            style={{ left: `${carPercent}%` }}
                          >
                            <span className="text-2xl drop-shadow-md">🏎️</span>
                            <span className="text-[9px] font-mono text-amber-300 font-bold bg-slate-900/90 px-1 rounded">
                              {((initialVelU + accelA * currentT)).toFixed(1)} m/s
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Control Sliders Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {/* Initial Velocity u */}
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300">আদি বেগ (u):</span>
                            <span className="font-mono font-bold text-emerald-400">{initialVelU} m/s</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="25"
                            value={initialVelU}
                            onChange={(e) => setInitialVelU(Number(e.target.value))}
                            className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Acceleration a */}
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300">ত্বরণ (a):</span>
                            <span className="font-mono font-bold text-[#FF6B57]">
                              {accelA > 0 ? `+${accelA}` : accelA} m/s²
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-4"
                            max="5"
                            value={accelA}
                            onChange={(e) => setAccelA(Number(e.target.value))}
                            className="w-full accent-[#FF6B57] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Time t */}
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300">সময় (t):</span>
                            <span className="font-mono font-bold text-amber-400">{simTimeT} s</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={simTimeT}
                            onChange={(e) => setSimTimeT(Number(e.target.value))}
                            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Real-time Math Solutions for all 4 equations */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                        <span>📐</span>
                        <span>৪টি সমীকরণের লাইভ মান নির্ণয় (Calculated Quantities):</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        {/* Eq 1 */}
                        <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-primary">
                            <span>১. শেষ বেগ সমীকরণ:</span>
                            <span className="font-mono"><RenderMathText text="$v = u + at$" /></span>
                          </div>
                          <div className="text-foreground font-mono">
                            <RenderMathText
                              text={`$v = ${initialVelU} + (${accelA} \\times ${simTimeT}) = ${finalVelV}\\text{ m/s}$`}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">সময় শেষে গাড়ির অর্জিত চূড়ান্ত বেগ।</p>
                        </div>

                        {/* Eq 2 */}
                        <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                            <span>২. গড় বেগ পদ্ধতি:</span>
                            <span className="font-mono"><RenderMathText text="$s = \frac{u+v}{2}t$" /></span>
                          </div>
                          <div className="text-foreground font-mono">
                            <RenderMathText
                              text={`$s = \\frac{${initialVelU} + ${finalVelV}}{2} \\times ${simTimeT} = ${distS}\\text{ m}$`}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">ত্বরণ অজানা থাকলেও অতিক্রান্ত দূরত্ব বের করা যায়।</p>
                        </div>

                        {/* Eq 3 */}
                        <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                            <span>৩. দূরত্বের স্বর্ণসূত্র:</span>
                            <span className="font-mono"><RenderMathText text="$s = ut + \frac{1}{2}at^2$" /></span>
                          </div>
                          <div className="text-foreground font-mono">
                            <RenderMathText
                              text={`$s = (${initialVelU} \\times ${simTimeT}) + \\frac{1}{2}(${accelA})(${simTimeT})^2 = ${distS}\\text{ m}$`}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">বোর্ড পরীক্ষায় সবচেয়ে বেশি ব্যবহৃত সূত্র।</p>
                        </div>

                        {/* Eq 4 */}
                        <div className="p-3.5 rounded-2xl bg-card border border-border space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-indigo-600">
                            <span>৪. সময়হীন সমীকরণ:</span>
                            <span className="font-mono"><RenderMathText text="$v^2 = u^2 + 2as$" /></span>
                          </div>
                          <div className="text-foreground font-mono">
                            <RenderMathText
                              text={`$v = \\sqrt{${initialVelU}^2 + 2(${accelA})(${distS})} = ${finalVelV}\\text{ m/s}$`}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">সময় ($t$) বাদ দিয়ে বেগ ও দূরত্বের সংযোগ।</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 4: GALILEO FREE FALL & VERTICAL LAUNCH */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  {/* Vacuum Chamber Free Fall Experiment */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ১. গ্যালিলিওর পরন্ত বস্তু ল্যাব (Galileo Free Fall Chamber)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          বাতাস বনাম বায়ুশূন্য চেম্বারে ভারি বল ও পালক ফেলে গ্যালিলিওর সূত্র পরীক্ষা করো
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Vacuum Toggle */}
                        <button
                          onClick={() => setChamberVacuum(!chamberVacuum)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                            chamberVacuum
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : 'bg-muted border-border text-muted-foreground'
                          }`}
                        >
                          <Wind className="h-3.5 w-3.5" />
                          <span>{chamberVacuum ? 'বায়ুশূন্য চেম্বার (Vacuum ON)' : 'বায়ুপূর্ণ অবস্থা (Air ON)'}</span>
                        </button>

                        {/* Drop trigger */}
                        <button
                          onClick={() => setDropAnimationTrigger((prev) => prev + 1)}
                          disabled={isDropping}
                          className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                          <span>একসাথে ফেলুন</span>
                        </button>
                      </div>
                    </div>

                    {/* Chamber Visualizer */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center gap-6">
                      {/* Chamber SVG/Box */}
                      <div className="w-full md:w-72 h-64 rounded-2xl bg-slate-950 border-2 border-slate-700 relative p-4 flex justify-around items-start overflow-hidden">
                        {/* Air particles simulation if not vacuum */}
                        {!chamberVacuum && (
                          <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-wrap gap-4 p-4 text-xs">
                            💨 💨 💨 💨 💨 💨 💨 💨
                          </div>
                        )}

                        {/* Object 1: Heavy Bowling Ball */}
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-mono mb-2">ভারী বল (1 kg)</span>
                          <div
                            className={`h-9 w-9 rounded-full bg-slate-200 border-2 border-slate-400 text-slate-900 flex items-center justify-center text-xs font-black shadow-lg transition-transform ${
                              isDropping
                                ? 'translate-y-44 duration-1000 ease-in'
                                : 'translate-y-0 duration-300'
                            }`}
                          >
                            ●
                          </div>
                        </div>

                        {/* Chamber Midline Divider */}
                        <div className="h-full w-px bg-slate-800 border-dashed" />

                        {/* Object 2: Light Feather */}
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-mono mb-2">হালকা পালক (5 g)</span>
                          <div
                            className={`text-2xl transition-transform ${
                              isDropping
                                ? chamberVacuum
                                  ? 'translate-y-44 duration-1000 ease-in'
                                  : 'translate-y-44 duration-2500 ease-linear animate-pulse'
                                : 'translate-y-0 duration-300'
                            }`}
                          >
                            🪶
                          </div>
                        </div>

                        {/* Ground base */}
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-emerald-600/40 border-t border-emerald-500" />
                      </div>

                      {/* Explanation Callout */}
                      <div className="space-y-3 flex-1 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 leading-relaxed">
                          <span className="font-bold text-amber-400">গ্যালিলিওর ১ম সূত্র:</span> স্থির অবস্থান থেকে ও একই উচ্চতা হতে বিনা বাধায় মুক্তভাবে পড়ন্ত সকল বস্তু সমান সময়ে সমান পথ অতিক্রম করে।
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 leading-relaxed">
                          <span className="font-bold text-emerald-400">পরীক্ষার পর্যবেক্ষণ:</span>{' '}
                          {chamberVacuum ? (
                            <span>
                              বায়ুশূন্য ভ্যাকুয়ামে বাতাসের কোনো প্লাবতা বা ড্র্যাগ ফোর্স নেই। তাই ভারী বল ও পালক দুটিই অবিকল <strong>একই সাথে ১ সেকেন্ডে মাটিতে পৌঁছায়</strong> ($h = \\frac{1}{2}gt^2$)!
                            </span>
                          ) : (
                            <span>
                              বায়ুপূর্ণ অবস্থায় বায়ুর বাধার কারণে হালকা পালকটি বাতাসে ভেসে ধীরে ধীরে পড়ে, অথচ ভারী বলটি দ্রুত নেমে যায়।
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Projectile Launch Lab */}
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          ২. খাড়া উপরের দিকে নিক্ষিপ্ত বস্তু (Vertical Projectile Lab)
                        </h3>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          <RenderMathText text="ক্রিকেট বল খাড়া নিক্ষেপ করলে সর্বোচ্চ উচ্চতা ($H = \\frac{u^2}{2g}$) ও উড্ডয়নকাল ($T = \\frac{2u}{g}$)" />
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                        রাজশাহী ও কুমিল্লা বোর্ড
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-4">
                      {/* Throw Speed Slider */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                          <span>নিক্ষেপ বেগ (Initial Velocity $u$):</span>
                          <span className="font-mono text-primary font-bold">{projectileU} m/s</span>
                        </div>
                        <input
                          type="range"
                          min="9.8"
                          max="49.0"
                          step="4.9"
                          value={projectileU}
                          onChange={(e) => setProjectileU(Number(e.target.value))}
                          className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Calculated Projectile Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                          <div className="text-muted-foreground font-semibold">সর্বোচ্চ উচ্চতা ($H$):</div>
                          <div className="text-lg font-mono font-black text-primary">
                            {maxHeightH} m
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            <RenderMathText text="$H = \\frac{u^2}{2g}$" />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                          <div className="text-muted-foreground font-semibold">সর্বোচ্চ চূড়ায় ওঠার সময় ($t$):</div>
                          <div className="text-lg font-mono font-black text-amber-600">
                            {timeToPeak} s
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            <RenderMathText text="$t = \\frac{u}{g}$" />
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                          <div className="text-muted-foreground font-semibold">মোট উড্ডয়নকাল ($T$):</div>
                          <div className="text-lg font-mono font-black text-emerald-600">
                            {totalFlightTimeT} s
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            <RenderMathText text="$T = \\frac{2u}{g}$" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 5: GRAPH INSPECTOR (s-t & v-t AREA & SLOPE) */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                          <span>বেগ-সময়</span>
                          <span className="font-mono text-primary font-bold">
                            <RenderMathText text="($v-t$)" />
                          </span>
                          <span>লেখচিত্রের ক্ষেত্রফল ও ঢাল বিশ্লেষণ</span>
                        </h3>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          <RenderMathText text="গ্রাফের নিচের ক্ষেত্রফল কীভাবে ক্যালকুলাস ছাড়াই মোট দূরত্ব ($s = ut + \frac{1}{2}at^2$) দেয়" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveGraphPhase('accel')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeGraphPhase === 'accel'
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          ধাপ ১: ত্বরণ
                        </button>
                        <button
                          onClick={() => setActiveGraphPhase('constant')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeGraphPhase === 'constant'
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          ধাপ ২: সমবেগ
                        </button>
                        <button
                          onClick={() => setActiveGraphPhase('decel')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            activeGraphPhase === 'decel'
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          ধাপ ৩: মন্দন
                        </button>
                      </div>
                    </div>

                    {/* SVG Graph Canvas */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="relative h-60 w-full rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 500 200">
                          {/* Axes */}
                          <line x1="50" y1="170" x2="470" y2="170" stroke="#94a3b8" strokeWidth="2" />
                          <line x1="50" y1="170" x2="50" y2="20" stroke="#94a3b8" strokeWidth="2" />

                          {/* Axis Labels */}
                          <text x="460" y="190" fill="#94a3b8" fontSize="11" fontWeight="bold">
                            সময় t (s)
                          </text>
                          <text x="10" y="25" fill="#94a3b8" fontSize="11" fontWeight="bold">
                            বেগ v (m/s)
                          </text>

                          {/* Ticks on X-axis */}
                          <text x="45" y="185" fill="#64748b" fontSize="10">0</text>
                          <text x="150" y="185" fill="#64748b" fontSize="10">4 s</text>
                          <text x="310" y="185" fill="#64748b" fontSize="10">10 s</text>
                          <text x="430" y="185" fill="#64748b" fontSize="10">14 s</text>

                          {/* Ticks on Y-axis */}
                          <text x="25" y="75" fill="#64748b" fontSize="10">12</text>

                          {/* Shaded Areas */}
                          {/* Phase 1: Triangle (0 to 4s) */}
                          <polygon
                            points="50,170 160,70 160,170"
                            fill={activeGraphPhase === 'accel' ? '#f43f5e' : '#f43f5e40'}
                            stroke="#f43f5e"
                            strokeWidth="1.5"
                          />

                          {/* Phase 2: Rectangle (4 to 10s) */}
                          <polygon
                            points="160,70 320,70 320,170 160,170"
                            fill={activeGraphPhase === 'constant' ? '#38bdf8' : '#38bdf840'}
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                          />

                          {/* Phase 3: Deceleration Triangle (10 to 14s) */}
                          <polygon
                            points="320,70 430,170 320,170"
                            fill={activeGraphPhase === 'decel' ? '#10b981' : '#10b98140'}
                            stroke="#10b981"
                            strokeWidth="1.5"
                          />

                          {/* Graph Line */}
                          <polyline
                            points="50,170 160,70 320,70 430,170"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="3.5"
                          />
                        </svg>
                      </div>

                      {/* Phase Detailed Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                        <div
                          className={`p-3.5 rounded-xl border transition-all ${
                            activeGraphPhase === 'accel'
                              ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-bold text-rose-400">ধাপ ১: সুষম ত্বরণ (0 - 4 s)</div>
                          <div><RenderMathText text="ঢাল (ত্বরণ) $= \frac{12 - 0}{4} = 3\text{ m/s}^2$" /></div>
                          <div><RenderMathText text="ক্ষেত্রফল $s_1 = \frac{1}{2} \times 4 \times 12 = 24\text{ m}$" /></div>
                        </div>

                        <div
                          className={`p-3.5 rounded-xl border transition-all ${
                            activeGraphPhase === 'constant'
                              ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-bold text-sky-400">ধাপ ২: সমবেগ (4 - 10 s)</div>
                          <div><RenderMathText text="ঢাল (ত্বরণ) $= 0\text{ m/s}^2$ (অনুভূমিক রেখা)" /></div>
                          <div><RenderMathText text="ক্ষেত্রফল $s_2 = 6 \times 12 = 72\text{ m}$" /></div>
                        </div>

                        <div
                          className={`p-3.5 rounded-xl border transition-all ${
                            activeGraphPhase === 'decel'
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-bold text-emerald-400">ধাপ ৩: সুষম মন্দন (10 - 14 s)</div>
                          <div><RenderMathText text="ঢাল (মন্দন) $= \frac{0 - 12}{4} = -3\text{ m/s}^2$" /></div>
                          <div><RenderMathText text="ক্ষেত্রফল $s_3 = \frac{1}{2} \times 4 \times 12 = 24\text{ m}$" /></div>
                        </div>
                      </div>

                      {/* Total Distance Summary */}
                      <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-300 font-medium">
                          গাড়ির মোট অতিক্রান্ত দূরত্ব (Total Area under curve):
                        </span>
                        <span className="font-mono font-bold text-amber-400 text-base">
                          s = 24 + 72 + 24 = 120 মিটার
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  disabled={activeLesson <= 1}
                  onClick={() => setActiveLesson((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>আগের পাঠ</span>
                </button>

                <button
                  onClick={() => {
                    if (activeLesson < 5) {
                      setActiveLesson((prev) => prev + 1);
                      if (!completedLessons.includes(activeLesson + 1)) {
                        setCompletedLessons((prev) => [...prev, activeLesson + 1]);
                      }
                    } else {
                      setActiveStep('example');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <span>{activeLesson < 5 ? 'পরবর্তী পাঠে যান' : 'ধাপ ২: উদাহরণ দেখুন'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: SEE EXAMPLE (বোর্ড স্ট্যান্ডার্ড ধাপে ধাপে সমাধান) */}
          {/* ========================================================= */}
          {activeStep === 'example' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      ২. উদাহরণ দেখি • বোর্ড স্ট্যান্ডার্ড ধাপে ধাপে সমাধান
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      এসএসসি পরীক্ষার পূর্ণমানের সৃজনশীল প্রশ্ন ও পরীক্ষকের মার্কিং রুব্রিক
                    </p>
                  </div>

                  {/* Example Tab Selector */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[
                      { id: 1, label: '১. বাস ও গরু সমস্যা (বই)' },
                      { id: 2, label: '২. ক্রিকেট বলের নিক্ষিপ্ত গতি' },
                      { id: 3, label: '৩. v-t গ্রাফ থেকে দূরত্ব' },
                      { id: 4, label: '৪. বাঘ ও হরিণ চেজ' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedExampleTab(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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

                {/* Example 1: Bus and Cow Collision Avoidance (Textbook CQ 2) */}
                {selectedExampleTab === 1 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (পাঠ্যবই নমুনা সৃজনশীল ২):</div>
                      <RenderMathText text="একটি বাস স্থির অবস্থান থেকে $0.05\text{ m/s}^2$ সুষম ত্বরণে বাসস্ট্যান্ডের দিকে চলছে। বাসস্ট্যান্ড থেকে ৩০০ মিটার আগে চালক রাস্তায় একটি গরু দেখতে পেয়ে ব্রেক কষলেন। বাসটি থামতে ২৮ সেকেন্ড সময় নিল। যাত্রা শুরুর মোট দূরত্ব ৪.৩ কিমি। গরুটি কি রক্ষা পেয়েছিল? গাণিতিক যুক্তিসহ মতামত দাও।" />
                    </div>

                    <div className="space-y-2">
                      <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                        <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">১</span>
                        <div>
                          <div className="text-muted-foreground text-xs">ব্রেক করার পূর্ব পর্যন্ত অতিক্রান্ত দূরত্ব:</div>
                          <div className="text-foreground font-mono">
                            <RenderMathText text="মোট দূরত্ব $= 4.3\text{ km} = 4300\text{ m}$। ব্রেক করার পূর্বের দূরত্ব $s_1 = 4300 - 300 = 4000\text{ m}$।" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                        <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">২</span>
                        <div>
                          <div className="text-muted-foreground text-xs">
                            <RenderMathText text="ব্রেক চাপার মুহূর্তে বাসের বেগ ($v_1$):" />
                          </div>
                          <div className="text-foreground font-mono">
                            <RenderMathText text="$v_1^2 = u^2 + 2as_1 = 0 + 2(0.05)(4000) = 400 \implies v_1 = 20\text{ m/s}$।" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                        <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0">৩</span>
                        <div>
                          <div className="text-muted-foreground text-xs">
                            <RenderMathText text="ব্রেক করার পর ২৮ সেকেন্ডে থামার দূরত্ব ($s_2$):" />
                          </div>
                          <div className="text-foreground font-mono">
                            <RenderMathText text="$s_2 = \frac{u' + v'}{2}t_2 = \frac{20 + 0}{2} \times 28 = 10 \times 28 = 280\text{ m}$।" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        <RenderMathText text="✓ যেহেতু ব্রেক করার পর বাসটি ২৮০ মিটার গিয়ে থেমে যায় এবং গরুটি ৩০০ মিটার দূরে ছিল ($280\text{ m} < 300\text{ m}$), তাই বাসটি গরুর ২০ মিটার পূর্বেই নিরাপদে থেমে যাবে এবং গরুটি রক্ষা পাবে!" />
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
                            <span className="font-bold text-foreground">১ নম্বর ফাঁদ (কিলোমিটার থেকে মিটার):</span> ৪.৩ কিমিকে ৪৩০০ মিটার না বানিয়ে সরাসরি ৪.৩ লিখলে পুরো সমীকরণটি ভুল হয়ে যাবে।
                          </div>
                          <div className="p-2.5 rounded-xl bg-card border border-border">
                            <span className="font-bold text-foreground">সিদ্ধান্তে যুক্তি না দেওয়া:</span>{' '}
                            <RenderMathText text="শুধু &quot;গরুটি বাঁচবে&quot; লিখলে ঘ-বিভাগে মাত্র ১ নম্বর পাবে। $280\text{ m} < 300\text{ m}$ এর তুলনামূলক যুক্তি স্পষ্ট প্রদর্শন করা বাধ্যতামূলক!" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Example 2: Cricket Ball Vertical Launch */}
                {selectedExampleTab === 2 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (রাজশাহী বোর্ড):</div>
                      <RenderMathText text="একটি ক্রিকেট বলকে $29.4\text{ m/s}$ বেগে খাড়া উপরের দিকে নিক্ষেপ করা হলো। বলটির সর্বোচ্চ উচ্চতা এবং মোট উড্ডয়নকাল নির্ণয় করো।" />
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="১. সর্বোচ্চ উচ্চতায় শেষ বেগ $v = 0\\text{ m/s}$। অভিকর্ষজ ত্বরণ $g = 9.8\\text{ m/s}^2$।" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="২. সর্বোচ্চ উচ্চতা: $H = \\frac{u^2}{2g} = \\frac{(29.4)^2}{2 \\times 9.8} = \\frac{864.36}{19.6} = 44.1\\text{ m}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="৩. মোট উড্ডয়নকাল: $T = \\frac{2u}{g} = \\frac{2 \\times 29.4}{9.8} = 6\\text{ সেকেন্ড}$" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Example 3: v-t Graph Distance Calculation */}
                {selectedExampleTab === 3 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (চট্টগ্রাম বোর্ড):</div>
                      <RenderMathText text="একটি গাড়ির বেগ-সময় গ্রাফে দেখা গেল, গাড়িটি প্রথমে ৫ সেকেন্ডে সুষম ত্বরণে $20\text{ m/s}$ বেগ অর্জন করে, পরবর্তী ১০ সেকেন্ড সমবেগে চলে এবং শেষ ৫ সেকেন্ডে ব্রেক করে থেমে যায়। মোট অতিক্রান্ত দূরত্ব কত?" />
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="১. প্রথম ধাপ (ত্বরণ): $s_1 = \frac{1}{2} \times 5 \times 20 = 50\text{ m}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="২. দ্বিতীয় ধাপ (সমবেগ): $s_2 = 10 \times 20 = 200\text{ m}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="৩. তৃতীয় ধাপ (মন্দন): $s_3 = \frac{1}{2} \times 5 \times 20 = 50\text{ m}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        <RenderMathText text="✓ মোট অতিক্রান্ত দূরত্ব $s = 50 + 200 + 50 = 300\text{ মিটার}$।" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Example 4: Tiger & Deer Chase */}
                {selectedExampleTab === 4 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <div className="font-bold mb-1">সৃজনশীল প্রশ্ন (বরিশাল বোর্ড ক্লাসিক):</div>
                      <RenderMathText text="একটি বাঘ স্থির অবস্থান থেকে $3\text{ m/s}^2$ সুষম ত্বরণে এবং একটি হরিণ $15\text{ m/s}$ সমবেগে একই দিকে দৌড়াচ্ছে। বাঘটি কত সময় পর হরিণটিকে ধরতে পারবে?" />
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• বাঘের অতিক্রান্ত দূরত্ব: $s_1 = ut + \frac{1}{2}at^2 = 0 + \frac{1}{2}(3)t^2 = 1.5t^2$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• হরিণের অতিক্রান্ত দূরত্ব: $s_2 = vt = 15t$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• শর্তমতে, $1.5t^2 = 15t \implies 1.5t = 15 \implies t = 10\text{ সেকেন্ড}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        ✓ বাঘটি যাত্রা শুরুর ঠিক ১০ সেকেন্ড পর হরিণটিকে ধরে ফেলবে!
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep('concept')}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>ধাপ ১: কনসেপ্টে ফিরুন</span>
                </button>

                <button
                  onClick={() => {
                    setActiveStep('try');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <span>ধাপ ৩: নিজে অনুশীলন করুন</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: TRY YOURSELF (ইন্টারেক্টিভ প্র্যাকটিস ল্যাব) */}
          {/* ========================================================= */}
          {activeStep === 'try' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    ৩. নিজে করো • ইন্টারেক্টিভ ল্যাব (Interactive Practice Lab)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ৩টি হ্যান্ডস-অন চ্যালেঞ্জ সমাধান করে বোর্ড পরীক্ষার জন্য নিজেকে প্রস্তুত করো
                  </p>
                </div>

                {/* Challenge 1: Motion Equation Solver */}
                <div className="p-4.5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">চ্যালেঞ্জ ০১: গতির সমীকরণ গোয়েন্দা</span>
                    <span className="text-xs font-mono text-muted-foreground">u = 10 m/s, a = 3 m/s², t = 5 s</span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <RenderMathText text="একটি গাড়ি $10\text{ m/s}$ আদি বেগে $3\text{ m/s}^2$ সুষম ত্বরণে ৫ সেকেন্ড চলল। এর শেষ বেগ ($v$) ও অতিক্রান্ত দূরত্ব ($s$) কত?" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">শেষ বেগ v (m/s):</label>
                      <input
                        type="text"
                        placeholder="যেমন: 25"
                        value={calcInputV}
                        onChange={(e) => setCalcInputV(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-card border border-border text-xs font-mono focus:border-primary outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">অতিক্রান্ত দূরত্ব s (m):</label>
                      <input
                        type="text"
                        placeholder="যেমন: 87.5"
                        value={calcInputS}
                        onChange={(e) => setCalcInputS(e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-card border border-border text-xs font-mono focus:border-primary outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const vCorrect = Math.abs(parseFloat(calcInputV) - 25) < 0.1;
                      const sCorrect = Math.abs(parseFloat(calcInputS) - 87.5) < 0.1;
                      if (vCorrect && sCorrect) {
                        setCalcFeedback({
                          isCorrect: true,
                          text: 'চমৎকার! v = 10 + (3 × 5) = 25 m/s এবং s = (10 × 5) + 0.5(3)(25) = 87.5 m। সম্পূর্ণ সঠিক!',
                        });
                      } else {
                        setCalcFeedback({
                          isCorrect: false,
                          text: 'আবার চেষ্টা করো! সূত্র: v = u + at এবং s = ut + 1/2at² ব্যবহার করো।',
                        });
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                  >
                    যাচাই করো
                  </button>

                  {calcFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        calcFeedback.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {calcFeedback.text}
                    </div>
                  )}
                </div>

                {/* Challenge 2: Graph Area */}
                <div className="p-4.5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">চ্যালেঞ্জ ০২: v-t গ্রাফের ক্ষেত্রফল গণক</span>
                    <span className="text-xs font-mono text-muted-foreground">Area = Distance</span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <RenderMathText text="একটি গাড়ি ০ থেকে ৬ সেকেন্ডে সুষম ত্বরণে $18\text{ m/s}$ বেগ পায়। এই ত্রিভুজাকার অংশের অতিক্রান্ত দূরত্ব কত মিটার?" />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="মিটার লিখুন..."
                      value={graphAreaInput}
                      onChange={(e) => setGraphAreaInput(e.target.value)}
                      className="p-2.5 rounded-xl bg-card border border-border text-xs font-mono focus:border-primary outline-hidden w-48"
                    />
                    <button
                      onClick={() => {
                        if (parseFloat(graphAreaInput) === 54) {
                          setGraphAreaFeedback({
                            isCorrect: true,
                            text: 'অসাধারণ! ত্রিভুজের ক্ষেত্রফল = ১/২ × ভূমি (৬) × উচ্চতা (১৮) = ৫৪ মিটার!',
                          });
                        } else {
                          setGraphAreaFeedback({
                            isCorrect: false,
                            text: 'ভুল হয়েছে। ত্রিভুজের ক্ষেত্রফল = ১/২ × ভূমি × উচ্চতা ব্যবহার করো।',
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>

                  {graphAreaFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        graphAreaFeedback.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {graphAreaFeedback.text}
                    </div>
                  )}
                </div>

                {/* Challenge 3: Safe Braking Distance */}
                <div className="p-4.5 rounded-2xl bg-muted/30 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">চ্যালেঞ্জ ০৩: দুর্ঘটনা পরিহার ও ব্রেকিং দূরত্ব</span>
                    <span className="text-xs font-mono text-muted-foreground">u = 20 m/s, a = -4 m/s²</span>
                  </div>

                  <div className="text-xs sm:text-sm text-foreground">
                    <RenderMathText text="একটি গাড়ি $20\text{ m/s}$ বেগে চলার সময় চালক ব্রেক চেপে $-4\text{ m/s}^2$ মন্দন সৃষ্টি করলেন। গাড়িটি কত মিটার দূরত্বে গিয়ে পুরোপুরি থামবে?" />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="দূরত্ব (m)..."
                      value={brakeObsInput}
                      onChange={(e) => setBrakeObsInput(e.target.value)}
                      className="p-2.5 rounded-xl bg-card border border-border text-xs font-mono focus:border-primary outline-hidden w-48"
                    />
                    <button
                      onClick={() => {
                        if (parseFloat(brakeObsInput) === 50) {
                          setBrakeFeedback({
                            isCorrect: true,
                            text: 'সঠিক উত্তর! v² = u² + 2as => 0 = 400 + 2(-4)s => 8s = 400 => s = 50 মিটার।',
                          });
                        } else {
                          setBrakeFeedback({
                            isCorrect: false,
                            text: 'পুনরায় চেষ্টা করো! সূত্র: v² = u² + 2as (যেখানে v = 0)।',
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all"
                    >
                      যাচাই করো
                    </button>
                  </div>

                  {brakeFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        brakeFeedback.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {brakeFeedback.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep('example')}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>ধাপ ২: উদাহরণে ফিরুন</span>
                </button>

                <button
                  onClick={() => {
                    setActiveStep('check');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <span>ধাপ ৪: বোর্ড কুইজ দিন</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: CHECK UNDERSTANDING (বোর্ড কুইজ) */}
          {/* ========================================================= */}
          {activeStep === 'check' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      ৪. মূল্যায়ন • পদার্থবিজ্ঞান গতি বোর্ড কুইজ (Check Understanding)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      এনসিটিবি পাঠ্যবই ও বিগত ৫ বছরের ঢাকা, চট্টগ্রাম ও রাজশাহী বোর্ডের শীর্ষ ৫টি প্রশ্ন
                    </p>
                  </div>
                  {quizSubmitted && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono font-black text-xs border border-emerald-500/20">
                      স্কোর: {Object.entries(quizAnswers).filter(([id, ans]) => MCQS.find((q) => q.id === Number(id))?.correct === ans).length} / ৫
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {MCQS.map((q, qIndex) => {
                    const isAnswered = quizAnswers[q.id] !== undefined;
                    const userAnswer = quizAnswers[q.id];
                    const isCorrect = userAnswer === q.correct;

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-muted/20 border border-border/80 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                          <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-primary">
                            {q.board}
                          </span>
                          <span>প্রশ্ন {qIndex + 1} / ৫</span>
                        </div>

                        <div className="text-sm font-bold text-foreground">
                          <RenderMathText text={q.question} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIndex) => {
                            const isSelected = userAnswer === optIndex;
                            let btnStyle = 'bg-card border-border hover:bg-muted text-foreground';

                            if (quizSubmitted) {
                              if (optIndex === q.correct) {
                                btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                              } else if (isSelected) {
                                btnStyle = 'bg-rose-500 text-white border-rose-600';
                              }
                            } else if (isSelected) {
                              btnStyle = 'bg-primary text-white border-primary font-bold';
                            }

                            return (
                              <button
                                key={optIndex}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    setQuizAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                                  }
                                }}
                                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${btnStyle}`}
                              >
                                <RenderMathText text={opt} />
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div
                            className={`p-3 rounded-xl text-xs leading-relaxed ${
                              isCorrect
                                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                            }`}
                          >
                            <span className="font-bold">{isCorrect ? '✓ সঠিক!' : '✗ ভুল হয়েছে!'}</span>{' '}
                            <RenderMathText text={q.explanation} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(quizAnswers).length < 5}
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                      উত্তর জমা দিন
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all"
                    >
                      আবার কুইজ দিন
                    </button>
                  )}
                </div>
              </div>

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  onClick={() => setActiveStep('try')}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>ধাপ ৩: ল্যাবে ফিরুন</span>
                </button>

                <button
                  onClick={() => {
                    setActiveStep('summary');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2"
                >
                  <span>ধাপ ৫: রিভিশন চিট-শিট</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: SUMMARY (রিভিশন চিট-শিট) */}
          {/* ========================================================= */}
          {activeStep === 'summary' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-foreground font-heading">
                        ৫. সারসংক্ষেপ • পদার্থবিজ্ঞান অধ্যায় ২ রিভিশন চিট-শিট
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        বোর্ড পরীক্ষার আগের রাতের জন্য সূত্র, গ্রাফ ও সতর্কতার হ্যান্ডনোট
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyStudyNotes}
                    className="px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-center"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopied ? 'কপি হয়েছে! ✓' : 'স্টাডি নোট কপি করুন'}</span>
                  </button>
                </div>

                {/* Section 1: 5 Master Formulas of Motion */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>⚡</span>
                    <span>গতির ৫টি স্বর্ণসূত্র (Master Formulae of Kinematics)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-primary">১. শেষ বেগ:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$v = u + at$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="দূরত্ব ($s$) অনুপস্থিত থাকলে।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-emerald-600">২. গড় বেগের দূরত্ব:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$s = \frac{u + v}{2}t$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="ত্বরণ ($a$) অনুপস্থিত থাকলে।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-amber-600">৩. অতিক্রান্ত দূরত্ব:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$s = ut + \frac{1}{2}at^2$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="শেষ বেগ ($v$) অনুপস্থিত থাকলে।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1">
                      <div className="font-bold text-indigo-600">৪. সময়হীন সমীকরণ:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$v^2 = u^2 + 2as$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <RenderMathText text="সময় ($t$) অনুপস্থিত থাকলে।" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1 sm:col-span-2 lg:col-span-2">
                      <div className="font-bold text-rose-500">৫. নির্দিষ্ট t-তম সেকেন্ডে দূরত্ব:</div>
                      <div className="font-mono text-xs">
                        <RenderMathText text="$s_{t\\text{th}} = u + \\frac{1}{2}a(2t - 1)$" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        উদাহরণ: ৫ম সেকেন্ড বা ১০ম সেকেন্ডে অতিক্রান্ত দূরত্বের বিশেষ বোর্ড সূত্র।
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Freely Falling Bodies & Galileo Laws */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>🪂</span>
                    <RenderMathText text="পড়ন্ত ও নিক্ষিপ্ত বস্তুর সূত্রাবলী ($g = 9.8\text{ ms}^{-2}$)" />
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="font-bold text-emerald-600">মুক্তভাবে নিচে পড়ন্ত বস্তু:</div>
                      <div className="font-mono text-xs space-y-1 text-muted-foreground">
                        <div><RenderMathText text="• $v = u + gt$" /></div>
                        <div><RenderMathText text="• $h = ut + \\frac{1}{2}gt^2$" /></div>
                        <div><RenderMathText text="• $v^2 = u^2 + 2gh$" /></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="font-bold text-[#FF6B57]">খাড়া উপরের দিকে নিক্ষিপ্ত বস্তু:</div>
                      <div className="font-mono text-xs space-y-1 text-muted-foreground">
                        <div><RenderMathText text="• $v = u - gt$" /></div>
                        <div><RenderMathText text="• সর্বোচ্চ উচ্চতা: $H = \\frac{u^2}{2g}$" /></div>
                        <div><RenderMathText text="• মোট উড্ডয়নকাল: $T = \\frac{2u}{g}$" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Top 5 Board Traps */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>⚠️</span>
                    <span>পদার্থবিজ্ঞান অধ্যায় ২ এর শীর্ষ ৫টি বোর্ড ফাঁদ (Board Traps)</span>
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm text-foreground">
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ১:</span>
                      <div>
                        <RenderMathText text="একক রূপান্তর: গাড়ির বেগ $\text{km/h}$ দেওয়া থাকলে সরাসরি সূত্রে বসালে চলবে না। তাকে অবশ্যই $\frac{5}{18}$ গুণ করে বা $3.6$ দিয়ে ভাগ করে $\text{m/s}$-এ রূপান্তর করতে হবে।" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ২:</span>
                      <div>
                        <RenderMathText text='মন্দন (Retardation): প্রশ্নে "মন্দন $2\text{ ms}^{-2}$" বললে সূত্রে $a = -2$ বসবে। ছাত্র-ছাত্রীরা প্রায়ই ভুল করে সূত্রে মাইনাসের পর আবার $-(-2)$ লিখে ধনাত্মক বানিয়ে ফেলে।' />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ৩:</span>
                      <div>
                        <RenderMathText text="খাড়া নিক্ষিপ্ত বস্তু: সর্বোচ্চ উচ্চতায় বেগ শূন্য ($v=0$) হয় কিন্তু ত্বরণ কখনো শূন্য হয় না! সেখানেও নিম্নমুখী অভিকর্ষজ ত্বরণ $g = 9.8\text{ ms}^{-2}$ ক্রিয়াশীল থাকে।" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ৪:</span>
                      <div>
                        <RenderMathText text="$s-t$ বনাম $v-t$ গ্রাফের পার্থক্য: $s-t$ গ্রাফের ঢাল বেগ দেয়, কিন্তু $v-t$ গ্রাফের ঢাল ত্বরণ দেয় এবং ক্ষেত্রফল দূরত্ব দেয়। এই দুটি গ্রাফের বৈশিষ্ট্য গুলিয়ে ফেলা পরীক্ষার সাধারণ ভুল।" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Completion Action Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-amber-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-black text-base sm:text-lg text-foreground">
                    🎉 অভিনন্দন! গতি অধ্যায়টির প্রস্তুতি সম্পন্ন হয়েছে।
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    এখন তুমি এসএসসি বোর্ড পরীক্ষায় গতি অধ্যায়ের যেকোনো সৃজনশীল ও বহুনির্বাচনী সমাধান করতে প্রস্তুত।
                  </p>
                </div>

                <Link
                  href="/dashboard/playground/v2"
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all shrink-0 flex items-center gap-2"
                >
                  <span>পরবর্তী অধ্যায়ে যান</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </main>

        {/* Right AI Tutor Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-foreground">AI শিক্ষক</h3>
                  <p className="text-[10px] text-muted-foreground">পদার্থবিজ্ঞান সহায়ক</p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Chat Messages Log */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto no-scrollbar pr-1 text-xs">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white ml-6 rounded-tr-xs'
                      : 'bg-muted/50 border border-border/80 text-foreground mr-4 rounded-tl-xs'
                  }`}
                >
                  <RenderMathText text={msg.text} />
                </div>
              ))}
            </div>

            {/* Quick Questions Pills */}
            <div className="space-y-1 pt-1">
              <div className="text-[11px] font-bold text-muted-foreground">দ্রুত প্রশ্ন করুন:</div>
              <div className="space-y-1">
                {[
                  'গতির ৪টি সমীকরণ মনে রাখার কৌশল কী?',
                  'বায়ুশূন্য স্থানে পালক ও বল একসাথে কেন পড়ে?',
                  'v-t গ্রাফের নিচের ক্ষেত্রফল কীভাবে দূরত্ব দেয়?',
                  'খাড়া উপরে নিক্ষেপ করলে সর্বোচ্চ উচ্চতার সূত্র কী?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatInput(q);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-muted/40 hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="তোমার প্রশ্ন লেখো..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2.5 rounded-xl bg-muted/40 border border-border text-xs focus:border-primary outline-hidden"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Resource Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-extrabold text-sm sm:text-base text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>
                  {activeModal === 'nctb_book' && 'এনসিটিবি পদার্থবিজ্ঞান পাঠ্যবই (অধ্যায় ২)'}
                  {activeModal === 'notes' && 'গতির ৫টি স্বর্ণসূত্র সামারি নোট'}
                  {activeModal === 'board_questions' && 'বিগত ৫ বছরের বোর্ড প্রশ্ন সম্ভার'}
                </span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-border text-xs leading-relaxed space-y-2 text-foreground">
              {activeModal === 'nctb_book' && (
                <div>
                  এনসিটিবি নবম-দশম শ্রেণির পদার্থবিজ্ঞান অধ্যায় ২: "গতি" (পৃষ্ঠা ৩৫-৬৫)। রৈখিক গতি, গতির সমীকরণসমূহ, গ্যালিলিওর পরন্ত বস্তুর সূত্র ও লেখচিত্র বিশ্লেষণ এই ভার্চুয়াল গাইডবুকে সম্পূর্ণ ইন্টারঅ্যাক্টিভ করা হয়েছে।
                </div>
              )}
              {activeModal === 'notes' && (
                <div className="space-y-1.5 font-sans">
                  <div>• <RenderMathText text="রৈখিক গতির সমীকরণ: $v = u + at, s = ut + \frac{1}{2}at^2, v^2 = u^2 + 2as$" /></div>
                  <div>• <RenderMathText text="মুক্তভাবে পড়ন্ত বস্তুর ত্বরণ $g = 9.8\text{ ms}^{-2}$" /></div>
                  <div>• <RenderMathText text="খাড়া নিক্ষিপ্ত বস্তুর সর্বোচ্চ উচ্চতা $H = \frac{u^2}{2g}$" /></div>
                  <div>• <RenderMathText text="$v-t$ গ্রাফের ঢাল = ত্বরণ, আর ক্ষেত্রফল = অতিক্রান্ত দূরত্ব।" /></div>
                </div>
              )}
              {activeModal === 'board_questions' && (
                <div className="space-y-1.5">
                  <div>• ঢাকা বোর্ড ২০২৪: ৫ম সেকেন্ডে অতিক্রান্ত দূরত্বের গাণিতিক সমস্যা।</div>
                  <div>• রাজশাহী বোর্ড ২০২৩: খাড়া নিক্ষিপ্ত ক্রিকেট বলের সর্বোচ্চ উচ্চতা ও উড্ডয়নকাল।</div>
                  <div>• চট্টগ্রাম বোর্ড ২০২৩: ৩টি ধাপের বেগ-সময় লেখচিত্র থেকে মোট দূরত্ব নির্ণয়।</div>
                  <div>• বরিশাল বোর্ড ২০২১: স্থির বাঘ ও সমবেগে চলমান হরিণের শিকারের দৌড়।</div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
