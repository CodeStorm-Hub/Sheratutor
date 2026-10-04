'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Play,
  CheckCircle2,
  Circle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  FileText,
  Bookmark,
  Share2,
  Send,
  Bot,
  Lightbulb,
  Check,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink,
  X,
  FileDown,
  Calendar,
  Award,
  Video,
  Loader2,
  Trophy,
  CheckCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Network,
  Info,
  Copy,
  AlertTriangle,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';

type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

interface NumberChip {
  id: string;
  val: string;
  mathVal: string;
  isRational: boolean;
}

const INITIAL_CHIPS: NumberChip[] = [
  { id: '1', val: '-5', mathVal: '-5', isRational: true },
  { id: '2', val: '√2', mathVal: '√2', isRational: false },
  { id: '3', val: '3/4', mathVal: '3/4', isRational: true },
  { id: '4', val: '0', mathVal: '0', isRational: true },
  { id: '5', val: '2.5', mathVal: '2.5', isRational: true },
  { id: '6', val: 'π', mathVal: 'π', isRational: false },
  { id: '7', val: '7', mathVal: '7', isRational: true },
  { id: '8', val: '0.333...', mathVal: '0.333...', isRational: true },
  { id: '9', val: '-1', mathVal: '-1', isRational: true },
];

export const CHAPTER_1_LESSONS = [
  { id: 1, no: '০১', titleBn: 'সংখ্যার মহাবিশ্ব', titleEn: 'Real & other number types' },
  { id: 2, no: '০২', titleBn: 'প্রমাণের গোয়েন্দা', titleEn: '√2 is irrational' },
  { id: 3, no: '০৩', titleBn: 'আবৃত্ত দশমিক কোড', titleEn: 'Recurring decimal to fraction' },
  { id: 4, no: '০৪', titleBn: 'রেড লাইন পদ্ধতি', titleEn: 'Addition of recurring decimals' },
  { id: 5, no: '০৫', titleBn: 'ঝটপট বোর্ড কুইজ', titleEn: 'Board-style questions' },
];

export interface DetectiveChallenge {
  id: number;
  label: string;
  math: string;
  correctSets: ('N' | 'Z' | 'Q' | 'Q_prime')[];
  explanation: string;
}

export const DETECTIVE_CHALLENGES: DetectiveChallenge[] = [
  {
    id: 1,
    label: '0 (শূন্য)',
    math: '$0$',
    correctSets: ['Z', 'Q'],
    explanation: '$0 = \\frac{0}{1}$ হওয়ায় এটি মূলদ সংখ্যা (ℚ) এবং শূন্য একটি অখণ্ড সংখ্যা বিধায় পূর্ণসংখ্যা (ℤ)। কিন্তু স্বাভাবিক সংখ্যা ১ থেকে শুরু হয় বিধায় ০ স্বাভাবিক সংখ্যা নয়!',
  },
  {
    id: 2,
    label: '-3/5 (ঋণাত্মক ভগ্নাংশ)',
    math: '$-\\frac{3}{5}$',
    correctSets: ['Q'],
    explanation: '$-\\frac{3}{5}$ স্পষ্টতই দুটি পূর্ণসংখ্যার অনুপাত ($p/q, q \\neq 0$), তাই এটি মূলদ সংখ্যা (ℚ)। এটি অখণ্ড সংখ্যা নয়, তাই পূর্ণসংখ্যা বা স্বাভাবিক সংখ্যা নয়।',
  },
  {
    id: 3,
    label: '√5 (বর্গমূল ৫)',
    math: '$\\sqrt{5}$',
    correctSets: ['Q_prime'],
    explanation: '৫ কোনো পূর্ণবর্গ সংখ্যা নয়। তাই এর বর্গমূল একটি অসীম অনাবৃত দশমিক (২.২৩৬০৬৭৯...), যা ভগ্নাংশে প্রকাশ অসম্ভব এবং নিশ্চিতভাবেই অমূলদ সংখ্যা (ℚ\')!',
  },
  {
    id: 4,
    label: '0.3̇7̇ (আবৃত্ত দশমিক)',
    math: '$0.\\dot{3}\\dot{7}$',
    correctSets: ['Q'],
    explanation: 'আবৃত্ত দশমিক ভগ্নাংশকে ৯-০ নিয়মে $37/99$ সাধারণ ভগ্নাংশে প্রকাশ করা যায়। তাই সকল পৌনঃপুনিক দশমিক সর্বদা মূলদ সংখ্যা (ℚ)।',
  },
  {
    id: 5,
    label: '√16 (বর্গমূল ১৬)',
    math: '$\\sqrt{16}$',
    correctSets: ['N', 'Z', 'Q'],
    explanation: '⚠️ বোর্ড পরীক্ষার ট্র্যাপ: $\\sqrt{16} = 4$! এটি একটি ধনাত্মক অখণ্ড সংখ্যা, তাই এটি স্বাভাবিক সংখ্যা (ℕ), পূর্ণসংখ্যা (ℤ) এবং মূলদ সংখ্যা (ℚ)!',
  },
];

export const PROOF_PUZZLE_CARDS = [
  {
    id: 0,
    title: 'ধাপ ১: বিপরীত অনুমান',
    text: 'মনে করি $\\sqrt{3}$ একটি মূলদ সংখ্যা। তাহলে $\\sqrt{3} = \\frac{p}{q}$ লেখা যায়, যেখানে $p, q$ স্বাভাবিক সংখ্যা ও পরস্পর সহমৌলিক এবং $q > 1$।',
    phase: 'অনুমান',
  },
  {
    id: 1,
    title: 'ধাপ ২: উভয়পক্ষকে বর্গ ও রূপান্তর',
    text: 'উভয়পক্ষকে বর্গ করে $q$ দ্বারা গুণ করে পাই: $3 = \\frac{p^2}{q^2} \\implies 3q = \\frac{p^2}{q}$।',
    phase: 'বীজগণিত',
  },
  {
    id: 2,
    title: 'ধাপ ৩: চরম অসঙ্গতি (Contradiction)',
    text: 'এখানে $3q$ স্পষ্টতই পূর্ণসংখ্যা, কিন্তু $p, q$ সহমৌলিক ও $q > 1$ হওয়ায় $\\frac{p^2}{q}$ ভগ্নাংশ। পূর্ণসংখ্যা কখনো ভগ্নাংশের সমান হতে পারে না ($3q \\neq \\frac{p^2}{q}$)।',
    phase: 'অসঙ্গতি',
  },
  {
    id: 3,
    title: 'ধাপ ৪: চূড়ান্ত সিদ্ধান্ত ও সমাপ্তি',
    text: 'অতএব আমাদের প্রাথমিক অনুমানটি ভুল। $\\sqrt{3}$ মূলদ হতে পারে না, সুতরাং $\\sqrt{3}$ একটি অমূলদ সংখ্যা। (প্রমাণিত)',
    phase: 'সিদ্ধান্ত',
  },
];

export const BOARD_MCQ_QUESTIONS = [
  {
    id: 1,
    board: 'ঢাকা বোর্ড',
    question: 'নিচের কোনটি অমূলদ সংখ্যা?',
    options: [
      { id: 1, label: '$0.\\dot{3}$', isCorrect: false },
      { id: 2, label: '$\\sqrt{9}$', isCorrect: false },
      { id: 3, label: '$\\sqrt{8}$', isCorrect: true },
      { id: 4, label: '$2.5$', isCorrect: false },
    ],
    rationale: '$\\sqrt{8} = 2\\sqrt{2}$। পূর্ণবর্গ নয় এমন যেকোনো স্বাভাবিক সংখ্যার বর্গমূল অমূলদ সংখ্যা। অপরপক্ষে $0.\\dot{3} = 1/3, \\sqrt{9} = 3, 2.5 = 5/2$ প্রত্যেকে মূলদ।',
  },
  {
    id: 2,
    board: 'রাজশাহী বোর্ড',
    question: '০ (Zero) কোন ধরনের সংখ্যা?',
    options: [
      { id: 1, label: 'স্বাভাবিক সংখ্যা', isCorrect: false },
      { id: 2, label: 'মূলদ ও পূর্ণসংখ্যা', isCorrect: true },
      { id: 3, label: 'অমূলদ সংখ্যা', isCorrect: false },
      { id: 4, label: 'কাল্পনিক সংখ্যা', isCorrect: false },
    ],
    rationale: '$0 = \\frac{0}{1}$ হওয়ায় এটি মূলদ এবং অখণ্ড বিধায় পূর্ণসংখ্যা। তবে স্বাভাবিক সংখ্যা ১ থেকে শুরু হওয়ায় ০ কিন্তু স্বাভাবিক সংখ্যা নয়!',
  },
  {
    id: 3,
    board: 'চট্টগ্রাম বোর্ড',
    question: '$0.\\dot{3}\\dot{7}$ কে সাধারণ ভগ্নাংশে প্রকাশ করলে কত হবে?',
    options: [
      { id: 1, label: '$\\frac{37}{100}$', isCorrect: false },
      { id: 2, label: '$\\frac{37}{99}$', isCorrect: true },
      { id: 3, label: '$\\frac{37}{90}$', isCorrect: false },
      { id: 4, label: '$\\frac{34}{90}$', isCorrect: false },
    ],
    rationale: '৯-০ সূত্রানুযায়ী লব $= 37 - 0 = 37$ এবং হর $= 99$ (যেহেতু ২টি আবৃত্ত অঙ্ক ও কোনো অনাবৃত অঙ্ক নেই)। সুতরাং সঠিক উত্তর $\\frac{37}{99}$।',
  },
  {
    id: 4,
    board: 'যশোর বোর্ড',
    question: '$\\sqrt{2} = \\frac{p}{q}$ ধরে অমূলদ সংখ্যা প্রমাণের আবশ্যকীয় শর্ত কোনটি?',
    options: [
      { id: 1, label: '$p$ ও $q$ উভয়ই জোড় সংখ্যা', isCorrect: false },
      { id: 2, label: '$p, q$ স্বাভাবিক সংখ্যা ও পরস্পর সহমৌলিক এবং $q > 1$', isCorrect: true },
      { id: 3, label: '$p > q$ হতে হবে', isCorrect: false },
      { id: 4, label: '$q = 1$ হতে হবে', isCorrect: false },
    ],
    rationale: 'বোর্ড পরীক্ষায় এই শর্তটি না লিখলে সরাসরি ১ নম্বর কর্তন করা হয়! কারণ $q > 1$ এবং সহমৌলিক না হলে $\\frac{p^2}{q}$ ভগ্নাংশ হওয়া নিশ্চিত করা যায় না।',
  },
  {
    id: 5,
    board: 'কুমিল্লা ও ঢাকা বোর্ড',
    question: 'নিচের তথ্যগুলো বিবেচনা করো:\ni. সকল স্বাভাবিক সংখ্যা পূর্ণসংখ্যা\nii. সকল পূর্ণসংখ্যা মূলদ সংখ্যা\niii. $\\sqrt{5}$ একটি মূলদ সংখ্যা\n\nনিচের কোনটি সঠিক?',
    options: [
      { id: 1, label: 'i ও ii', isCorrect: true },
      { id: 2, label: 'i ও iii', isCorrect: false },
      { id: 3, label: 'ii ও iii', isCorrect: false },
      { id: 4, label: 'i, ii ও iii', isCorrect: false },
    ],
    rationale: 'সেটের ধারাবাহিকতা $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q}$ হওয়ায় i ও ii সঠিক। কিন্তু $\\sqrt{5}$ একটি অমূলদ সংখ্যা হওয়ায় iii ভুল। তাই সঠিক উত্তর ক (i ও ii)।',
  },
];

export function RealNumbersGuidebook() {
  // Navigation & Visibility State
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(true);

  // Dropdown States
  const [selectedClass, setSelectedClass] = useState<string>('Class 9–10 (SSC)');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState<boolean>(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState<boolean>(false);

  // Step 1 State: Nested Euler/Venn Diagram & Sorting
  const [activeVennRegion, setActiveVennRegion] = useState<'R' | 'Q' | 'Z' | 'N' | 'Q_prime'>('R');
  const [visualMode, setVisualMode] = useState<'nested' | 'tree'>('nested');
  const [chips, setChips] = useState<NumberChip[]>(INITIAL_CHIPS);
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [rationalBucket, setRationalBucket] = useState<NumberChip[]>([]);
  const [irrationalBucket, setIrrationalBucket] = useState<NumberChip[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sortingFeedback, setSortingFeedback] = useState<string | null>(null);

  // Step 2 State: Worked Board Examples
  const [selectedExampleTab, setSelectedExampleTab] = useState<number>(1);
  const [exampleStep, setExampleStep] = useState<number>(1);
  const [proofFrame, setProofFrame] = useState<number>(1);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // Step 3 State: Try Yourself (Interactive Practice Lab)
  // Task 1: Detective
  const [detectiveIndex, setDetectiveIndex] = useState<number>(0);
  const [detectiveSelectedSets, setDetectiveSelectedSets] = useState<string[]>([]);
  const [detectiveFeedback, setDetectiveFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Task 2: 9-0 Fraction Challenge & Calculator
  const [fracNumInput, setFracNumInput] = useState<string>('');
  const [fracDenInput, setFracDenInput] = useState<string>('');
  const [fracFeedback, setFracFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [calcWhole, setCalcWhole] = useState<string>('0');
  const [calcNonRec, setCalcNonRec] = useState<string>('2');
  const [calcRec, setCalcRec] = useState<string>('45');

  // Task 3: Proof Puzzle
  const [proofPuzzleOrder, setProofPuzzleOrder] = useState<number[]>([2, 0, 3, 1]);
  const [proofPuzzleFeedback, setProofPuzzleFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Step 4 State: Board Quiz (Check Understanding)
  const [boardQuizAnswers, setBoardQuizAnswers] = useState<Record<number, number>>({});
  const [boardQuizSubmitted, setBoardQuizSubmitted] = useState<boolean>(false);

  // Step 5 State: Summary & Actions
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [isChapterFinished, setIsChapterFinished] = useState<boolean>(false);

  // AI Tutor State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: 'এই অধ্যায় সম্পর্কে যেকোনো প্রশ্ন করো। আমি সহজ বাংলায় বোঝার চেষ্টা করবো!',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  // Fetch initial progress from backend
  useEffect(() => {
    async function loadBackendProgress() {
      try {
        const res = await fetch('/api/playground/progress?chapter=1');
        if (res.ok) {
          const data = await res.json();
          if (data?.progress?.completedLessons) {
            setCompletedLessons(data.progress.completedLessons);
          }
        }
      } catch (err) {
        console.warn('Could not load backend progress:', err);
      }
    }
    loadBackendProgress();
  }, []);

  // Save progress to backend when completing lesson
  const markLessonComplete = async (lessonNo: number) => {
    const updated = Array.from(new Set([...completedLessons, lessonNo]));
    setCompletedLessons(updated);

    try {
      await fetch('/api/playground/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: 1,
          completedLessons: updated,
          currentLesson: activeLesson,
        }),
      });
    } catch (err) {
      console.warn('Could not save progress to backend:', err);
    }
  };

  // AI Chat Handler with Backend
  const handleAskAI = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg = { role: 'user' as const, text: promptText };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/playground/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          chapter: 1,
          lesson: activeLesson,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // Offline fallback response
      let fallback = 'বাস্তব সংখ্যার ধারণা বেশ সহজ! কোনো সংখ্যাকে দুই পূর্ণসংখ্যার ভাগফল (p/q, q ≠ 0) আকারে লেখা গেলে তা মূলদ। আর যা এভাবে লেখা যায় না (যেমন: √২, π), তা অমূলদ সংখ্যা।';
      if (promptText.includes('√২') || promptText.includes('অমূলদ')) {
        fallback = '√২ অমূলদ কারণ এটিকে p/q ভগ্নাংশ আকারে প্রকাশ করলে ২q = p²/q পাই, যেখানে বামপাশ পূর্ণসংখ্যা কিন্তু ডানপাশ ভগ্নাংশ—যা পরস্পর অসম্ভব!';
      }
      setChatMessages((prev) => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;
    const txt = chatInput;
    setChatInput('');
    handleAskAI(txt);
  };

  // Lesson 1 Chip Drop Handler
  const handleDropIntoBucket = (target: 'rational' | 'irrational') => {
    if (!selectedChipId) {
      setSortingFeedback('প্রথমে ওপরের একটি সংখ্যার কার্ড সিলেক্ট করো, তারপর এখানে ক্লিক করো!');
      return;
    }

    const chip = chips.find((c) => c.id === selectedChipId);
    if (!chip) return;

    const isCorrect = (target === 'rational') === chip.isRational;
    if (isCorrect) {
      setSortingFeedback(`সঠিক হয়েছে! ${chip.val} হলো ${target === 'rational' ? 'মূলদ' : 'অমূলদ'} সংখ্যা।`);
    } else {
      setSortingFeedback(`ভুল হয়েছে! ${chip.val} কিন্তু ${target === 'rational' ? 'মূলদ নয়, অমূলদ' : 'অমূলদ নয়, মূলদ'} সংখ্যা।`);
    }

    setChips((prev) => prev.filter((c) => c.id !== chip.id));
    setSelectedChipId(null);
    if (target === 'rational') {
      setRationalBucket((prev) => [...prev, chip]);
    } else {
      setIrrationalBucket((prev) => [...prev, chip]);
    }

    if (chips.length <= 1) {
      markLessonComplete(1);
    }
  };

  const handleResetSorting = () => {
    setChips(INITIAL_CHIPS);
    setRationalBucket([]);
    setIrrationalBucket([]);
    setSelectedChipId(null);
    setSortingFeedback(null);
    setShowHint(false);
  };

  // Step 3: Interactive Practice Lab Handlers
  const handleVerifyDetective = () => {
    const current = DETECTIVE_CHALLENGES[detectiveIndex];
    if (detectiveSelectedSets.length === 0) {
      setDetectiveFeedback({
        isCorrect: false,
        text: 'অনুগ্রহ করে অন্তত একটি সেট (যেমন ℕ, ℤ, ℚ, ℚ\') সিলেক্ট করো!',
      });
      return;
    }
    const isExactMatch =
      detectiveSelectedSets.length === current.correctSets.length &&
      detectiveSelectedSets.every((s) => current.correctSets.includes(s as any));

    setDetectiveFeedback({
      isCorrect: isExactMatch,
      text: isExactMatch
        ? `দারুণ! সঠিক উত্তর হয়েছে। ${current.explanation}`
        : `হয়নি বা অপূর্ণ! ${current.explanation}`,
    });
  };

  const handleNextDetective = () => {
    setDetectiveSelectedSets([]);
    setDetectiveFeedback(null);
    setDetectiveIndex((prev) => (prev + 1) % DETECTIVE_CHALLENGES.length);
  };

  const handleVerifyFractionChallenge = () => {
    const num = parseInt(fracNumInput.trim()) || 0;
    const den = parseInt(fracDenInput.trim()) || 0;
    if (num === 43 && den === 90) {
      setFracFeedback({
        isCorrect: true,
        text: 'একদম সঠিক! লব = ৪৭ - ৪ = ৪৩ এবং হর = ৯০। সুতরাং ভগ্নাংশটি ৪৩/৯০।',
      });
    } else {
      setFracFeedback({
        isCorrect: false,
        text: 'হয়নি! সূত্র প্রয়োগ করো: লব = সম্পূর্ণ সংখ্যা (৪৭) − অনাবৃত অঙ্ক (৪) = ৪৩, এবং হর = একটি পৌনঃপুনিকের জন্য ৯ ও একটি অনাবৃতের জন্য ০ = ৯০।',
      });
    }
  };

  const handleMoveProofStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= proofPuzzleOrder.length) return;
    const newOrder = [...proofPuzzleOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setProofPuzzleOrder(newOrder);
    setProofPuzzleFeedback(null);
  };

  const handleVerifyProofPuzzle = () => {
    const isCorrect = proofPuzzleOrder.every((val, idx) => val === idx);
    setProofPuzzleFeedback(
      isCorrect
        ? {
            isCorrect: true,
            text: 'অসাধারণ! তুমি বিপরীত যুক্তি পদ্ধতির ৪টি ধাপ নিখুঁত ক্রমানুসারে সাজিয়ে ফেলেছো! (১: অনুমান → ২: বর্গ → ৩: অসঙ্গতি → ৪: সিদ্ধান্ত)',
          }
        : {
            isCorrect: false,
            text: 'ক্রমটি এখনো সঠিক হয়নি! প্রথমে বিপরীত অনুমান করো, তারপর উভয়পক্ষকে বর্গ করো, এরপর অসঙ্গতি (Contradiction) দেখাও এবং শেষে চূড়ান্ত সিদ্ধান্ত নাও।',
          }
    );
  };

  // Step 4: Board Quiz Handlers
  const handleSelectBoardQuiz = (questionId: number, optionId: number) => {
    setBoardQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    BOARD_MCQ_QUESTIONS.forEach((q) => {
      const selected = boardQuizAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect)?.id;
      if (selected === correctOpt) score++;
    });
    return score;
  };

  const handleSubmitBoardQuiz = async () => {
    setBoardQuizSubmitted(true);
    const score = calculateQuizScore();
    if (score >= 3) {
      markLessonComplete(5);
    }
  };

  // Step 5: Summary Copy Handler
  const handleCopySummary = () => {
    const summaryText = `[এনসিটিবি নবম-দশম সাধারণ গণিত: অধ্যায় ১ - বাস্তব সংখ্যা চিট-শিট]
১. বাস্তব সংখ্যা ℝ = মূলদ ℚ ∪ অমূলদ ℚ'
২. মূলদ সংখ্যা ℚ: p/q আকারে প্রকাশযোগ্য (q ≠ 0)। সসীম ও পৌনঃপুনিক দশমিক মূলদ।
৩. অমূলদ সংখ্যা ℚ': ভগ্নাংশে প্রকাশ অসম্ভব। পূর্ণবর্গ নয় এমন সংখ্যার বর্গমূল (√২, √৩, √৫) অমূলদ।
৪. ৯-০ নিয়ম: লব = সম্পূর্ণ সংখ্যা − অনাবৃত অংশ, হর = ৯...০...
৫. সদৃশ পৌনঃপুনিক যোগ: রেড লাইন বাফার জোনে অতিরিক্ত ২টি অঙ্ক ধরে ক্যারি যোগ করতে হবে।
৬. গোল্ডেন ট্র্যাপ: ০ মূলদ সংখ্যা, কিন্তু ০ স্বাভাবিক সংখ্যা নয়! π অমূলদ সংখ্যা!`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
    }
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 3000);
  };

  // Step Switcher Helper
  const goToNextStep = () => {
    if (activeStep === 'concept') setActiveStep('example');
    else if (activeStep === 'example') setActiveStep('try');
    else if (activeStep === 'try') setActiveStep('check');
    else if (activeStep === 'check') setActiveStep('summary');
    else if (activeStep === 'summary') {
      setIsChapterFinished(true);
      markLessonComplete(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevStep = () => {
    if (activeStep === 'example') setActiveStep('concept');
    else if (activeStep === 'try') setActiveStep('example');
    else if (activeStep === 'check') setActiveStep('try');
    else if (activeStep === 'summary') setActiveStep('check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lesson 3: 9-0 Calculator computation
  const computeRecurring = () => {
    const whole = parseInt(calcWhole) || 0;
    const nonRec = calcNonRec.trim();
    const rec = calcRec.trim();

    if (!rec) return { valid: false, fraction: '0/1', subStr: '0' };

    const fullDecStr = nonRec + rec;
    const fullNum = parseInt(fullDecStr) || 0;
    const nonRecNum = parseInt(nonRec) || 0;

    const numerator = fullNum - nonRecNum;
    const denominatorStr = '9'.repeat(rec.length) + '0'.repeat(nonRec.length);
    const denominator = parseInt(denominatorStr) || 1;

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const common = gcd(numerator, denominator);
    const simpNum = numerator / common;
    const simpDen = denominator / common;

    return {
      valid: true,
      rawDec: `${whole}.${nonRec ? nonRec : ''}${rec}...`,
      fullNum,
      nonRecNum,
      numerator,
      denominator,
      simplified: `${simpNum}/${simpDen}`,
    };
  };

  const calcResult = computeRecurring();

  // Lesson Metadata
  const LESSONS_META: Record<number, {
    no: string;
    titleBn: string;
    titleEn: string;
    overviewBn: string;
    studyTip: string;
  }> = {
    1: {
      no: '01',
      titleBn: 'সংখ্যার মহাবিশ্ব',
      titleEn: 'The Universe of Numbers',
      overviewBn: 'এই পাঠে তুমি জানবে— প্রাকৃতিক সংখ্যা, পূর্ণসংখ্যা, ভগ্নাংশসংখ্যা, মৌলিক সংখ্যা, বাস্তব সংখ্যা, মূলসংখ্যা, অমূলদসংখ্যা কী এবং এগুলো কিভাবে সম্পর্কিত।',
      studyTip: 'সংখ্যার রেখায় যেকোনো বাস্তব সংখ্যার অবস্থান চিহ্নিত করা যায় — এটিই বাস্তব সংখ্যার বিশেষত্ব!',
    },
    2: {
      no: '02',
      titleBn: 'প্রমাণের গোয়েন্দা',
      titleEn: 'Proof Detective: √2 is Irrational',
      overviewBn: 'এসএসসি পরীক্ষার সবচেয়ে নিশ্চিত ৪ নম্বরের প্রমাণ: কীভাবে বিপরীত যুক্তি (Contradiction) দিয়ে প্রমাণ করতে হয় যে √২ বা √৩ একটি অমূলদ সংখ্যা।',
      studyTip: 'বোর্ড পরীক্ষায় q > 1 এবং p, q সহমৌলিক শর্তটি না লিখলে ১ নম্বর কাটা যায়!',
    },
    3: {
      no: '03',
      titleBn: 'আবৃত্ত দশমিক কোড',
      titleEn: 'Recurring Decimal Code & 9–0 Calculator',
      overviewBn: 'কেন পৌনঃপুনিক দশমিক ভগ্নাংশে রূপান্তর করতে হর-এ ৯ ও ০ আসে? ক্যালকুলেটর ছাড়া মাত্র ৫ সেকেন্ডে উত্তর বের করার গোপন ট্রিক।',
      studyTip: 'যতটি সংখ্যার মাথায় পৌনঃপুনিক বিন্দু থাকে ততটি ৯, এবং অনাবৃত ঘরের জন্য ততটি ০ বসে!',
    },
    4: {
      no: '04',
      titleBn: 'রেড লাইন পদ্ধতি',
      titleEn: 'Addition of Recurring Decimals',
      overviewBn: 'পৌনঃপুনিক যোগে ছাত্র-ছাত্রীরা যে মারাত্মক ভুল করে— বাফার জোনের ক্যারি (Carry) বাদ দেওয়া। এনসিটিবি বইয়ের ঐতিহ্যবাহী রেড লাইন পদ্ধতির রহস্য।',
      studyTip: 'রেড লাইনের ডানে অন্তত ২টি অতিরিক্ত বাফার অঙ্ক যোগ করতে ভুলবে না যাতে পেছনের হাতের সংখ্যা সামনে আসতে পারে!',
    },
    5: {
      no: '05',
      titleBn: 'ঝটপট বোর্ড কুইজ',
      titleEn: 'Board-style Retrieval Quiz',
      overviewBn: 'বিগত ৫ বছরের ঢাকা, চট্টগ্রাম ও রাজশাহী বোর্ডের বাস্তব সংখ্যা অধ্যায়ের ক ও খ বিভাগের শীর্ষ প্রশ্নসমূহ নিজে পরীক্ষা করে দেখো।',
      studyTip: '০ একটি মূলদ সংখ্যা কারণ ০ = ০/১, তবে ০ কখনো প্রাকৃতিক সংখ্যা নয়!',
    },
  };

  const currentLessonMeta = LESSONS_META[activeLesson] || LESSONS_META[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

  // Venn Region Data
  const VENN_DETAILS: Record<string, {
    title: string;
    symbol: string;
    scope: string;
    desc: string;
    example: string;
    boardTip: string;
  }> = {
    R: {
      title: 'বাস্তব সংখ্যা (Real Numbers)',
      symbol: 'ℝ',
      scope: 'সকল মূলদ ও অমূলদ সংখ্যা',
      desc: 'যে সকল সংখ্যা সংখ্যার রেখায় একটি নির্দিষ্ট বিন্দু চিহ্নিত করতে পারে, তাদেরকে বাস্তব সংখ্যা বলে। এর মধ্যে মূলদ ও অমূলদ উভয় সেট সম্পূর্ণ অন্তর্ভুক্ত।',
      example: 'উদাহরণ: -৩, -১/২, ০, ২, √২, π, ০.৩৩৩...',
      boardTip: 'সংখ্যার রেখায় অবস্থিত প্রতিটি বিন্দুর জন্য একটি ও কেবল একটি বাস্তব সংখ্যা থাকে। বাস্তব সংখ্যার বাইরে রয়েছে কাল্পনিক সংখ্যা (যেমন √-১)।',
    },
    Q: {
      title: 'মূলদ সংখ্যা (Rational Numbers)',
      symbol: 'ℚ',
      scope: 'p/q আকারে প্রকাশযোগ্য (q ≠ 0)',
      desc: 'যে সকল সংখ্যাকে দুটি পূর্ণসংখ্যার ভাগফল (p/q, যেখানে p ও q পূর্ণসংখ্যা এবং q ≠ 0) আকারে প্রকাশ করা যায়। এদের দশমিক রূপ সর্বদা সসীম অথবা আবৃত্ত (পৌনঃপুনিক) হয়।',
      example: 'উদাহরণ: ১/২, -৩, ০.৭৫, ২, ০.৩৩৩... (= ১/৩), ২.৪৫̇',
      boardTip: 'যেকোনো সসীম দশমিক (যেমন ২.৫ = ৫/২) এবং আবৃত্ত পৌনঃপুনিক দশমিক (০.৩̇ = ১/৩) নিশ্চিতভাবেই মূলদ সংখ্যা!',
    },
    Z: {
      title: 'পূর্ণসংখ্যা (Integers)',
      symbol: 'ℤ',
      scope: 'শূন্যসহ সকল ধনাত্মক ও ঋণাত্মক অখণ্ড সংখ্যা',
      desc: 'শূন্যসহ সকল ধনাত্মক ও ঋণাত্মক অখণ্ড মানকে পূর্ণসংখ্যা বলে। এদের কোনো ভগ্নাংশ বা দশমিক অংশ থাকে না।',
      example: 'উদাহরণ: ..., -৩, -২, -১, ০, ১, ২, ৩, ...',
      boardTip: '০ একটি পূর্ণসংখ্যা, কারণ ০ কোনো ভগ্নাংশ নয় এবং ০ = ০/১ আকারে মূলদ আকারেও লেখা যায়।',
    },
    N: {
      title: 'প্রাকৃতিক বা স্বাভাবিক সংখ্যা (Natural Numbers)',
      symbol: 'ℕ',
      scope: '১ থেকে শুরু গণনাকারী ধনাত্মক অখণ্ড সংখ্যা',
      desc: '১, ২, ৩, ৪, ৫... ইত্যাদি ধনাত্মক অখণ্ড সংখ্যাকে স্বাভাবিক সংখ্যা বা গণনা সংখ্যা বলে।',
      example: 'উদাহরণ: ১, ২, ৩, ৪, ৫, ১০, ১০০...',
      boardTip: '⚠️ বোর্ড পরীক্ষার কমন ট্র্যাপ: ০ কিন্তু প্রাকৃতিক সংখ্যা নয়! প্রাকৃতিক সংখ্যা সর্বদা ১ থেকে শুরু হয়।',
    },
    Q_prime: {
      title: 'অমূলদ সংখ্যা (Irrational Numbers)',
      symbol: 'ℚ\'',
      scope: 'ভগ্নাংশে রূপান্তর অসম্ভব ও অসীম অনাবৃত',
      desc: 'যেসব সংখ্যাকে p/q ভগ্নাংশ আকারে প্রকাশ করা অসম্ভব। এদের দশমিক রূপ অসীম পর্যন্ত চলে এবং কখনোই পৌনঃপুনিক হয় না।',
      example: 'উদাহরণ: √২, π (৩.১৪১৫৯...), √৩, √৫, √৮',
      boardTip: 'পূর্ণবর্গ নয় এমন যেকোনো স্বাভাবিক সংখ্যার বর্গমূল (যেমন √২, √৩, √৮) নিশ্চিতভাবেই অমূলদ সংখ্যা!',
    },
  };

  return (
    <div className="min-h-screen bg-[#F3F5F9] dark:bg-[#0D0F16] text-foreground font-sans transition-colors pb-12">
      {/* Top Header Bar with Version Toggle, Sidebar Toggle & Breadcrumbs */}
      <div className="border-b border-border/60 bg-card/90 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5 sticky top-0 z-30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle Left Lesson Sidebar Button */}
          <button
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
              isLeftSidebarOpen
                ? 'bg-card border-border/80 hover:bg-muted text-foreground'
                : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
            }`}
            title={isLeftSidebarOpen ? 'পাঠ তালিকা লুকান' : 'পাঠ তালিকা দেখুন'}
          >
            {isLeftSidebarOpen ? (
              <>
                <PanelLeftClose className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">পাঠ তালিকা লুকান</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="h-4 w-4 text-primary" />
                <span>পাঠ তালিকা দেখুন</span>
              </>
            )}
          </button>

          <Link
            href="/dashboard/playground"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">খেলার মাঠে ফিরুন</span>
          </Link>
          <span className="text-border hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span className="hidden md:inline">{selectedSubject}</span>
            <ChevronRight className="h-3 w-3 hidden md:inline" />
            <span className="hidden md:inline">Chapter 1</span>
            <ChevronRight className="h-3 w-3 hidden md:inline" />
            <span className="text-[#FF6B57] font-bold">Lesson {activeLesson}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle AI Sidebar Button */}
          <button
            onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
              isAiSidebarOpen
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20'
                : 'bg-card border-border/80 text-muted-foreground hover:text-foreground'
            }`}
            title={isAiSidebarOpen ? 'AI শিক্ষক লুকান' : 'AI শিক্ষক দেখুন'}
          >
            <Bot className="h-4 w-4" />
            <span className="hidden md:inline">AI শিক্ষক</span>
          </button>

          <span className="hidden lg:inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            Version 2.0 • Virtual Guidebook
          </span>
          <Link
            href="/dashboard/playground/math/1"
            className="text-xs font-bold text-muted-foreground hover:text-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border/50 transition-colors"
          >
            🎮 v1 (Quest Arena)
          </Link>
        </div>
      </div>

      {/* Main Responsive Workspace Grid */}
      <div className="mx-auto max-w-[1720px] px-3 sm:px-6 lg:px-8 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ========================================================= */}
          {/* LEFT COLUMN: NAVIGATION & CHAPTER RESOURCES (Cols 1-3) */}
          {/* ========================================================= */}
          {isLeftSidebarOpen && (
            <div className="lg:col-span-3 space-y-4 animate-in fade-in duration-200">
            
            {/* Top Dropdowns with Clickable Selectors */}
            <div className="space-y-2 relative">
              <div className="relative">
                <button
                  onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-2xl bg-card border border-border/70 text-xs font-bold text-foreground shadow-xs hover:border-primary/40 transition-all"
                >
                  <span>{selectedClass}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {isClassDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-card border border-border rounded-xl shadow-lg z-20 space-y-1 text-xs font-semibold">
                    {['Class 9–10 (SSC)', 'Class 8 (JSC)', 'Class 11–12 (HSC)'].map((cls) => (
                      <button
                        key={cls}
                        onClick={() => {
                          setSelectedClass(cls);
                          setIsClassDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-2xl bg-card border border-border/70 text-xs font-bold text-foreground shadow-xs hover:border-primary/40 transition-all"
                >
                  <span>{selectedSubject}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {isSubjectDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-card border border-border rounded-xl shadow-lg z-20 space-y-1 text-xs font-semibold">
                    {['Mathematics', 'Higher Mathematics', 'Physics', 'Chemistry'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubject(sub);
                          setIsSubjectDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Back to All Chapters */}
            <Link
              href="/dashboard/playground"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Chapters</span>
            </Link>

            {/* Chapter 1 Info Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-2xl bg-[#FF6B57]/15 text-[#FF6B57] flex items-center justify-center font-black text-lg">
                  !
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Chapter 1
                  </div>
                  <h2 className="text-xl font-black text-foreground font-heading mt-0.5">
                    বাস্তব সংখ্যা
                  </h2>
                  <div className="text-xs text-muted-foreground font-medium">Real Numbers</div>
                </div>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>{completedLessons.length} / 5 lessons completed</span>
                  <span className="text-[#FF6B57]">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#FF6B57] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Lesson Nav List (5 Lessons) */}
              <div className="space-y-2 pt-1">
                {CHAPTER_1_LESSONS.map((item) => {
                  const isActive = activeLesson === item.id;
                  const isDone = completedLessons.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveLesson(item.id);
                        if (item.id === 1) setActiveStep('concept');
                        else if (item.id === 2) { setActiveStep('example'); setSelectedExampleTab(2); }
                        else if (item.id === 3) { setActiveStep('try'); }
                        else if (item.id === 4) { setActiveStep('example'); setSelectedExampleTab(4); }
                        else if (item.id === 5) { setActiveStep('check'); }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'bg-[#FFF1EE] dark:bg-[#FF6B57]/15 border border-[#FF6B57]/30 text-foreground shadow-xs'
                          : 'bg-card hover:bg-muted/50 border border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg ${
                            isActive
                              ? 'bg-[#FF6B57] text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.no}
                        </span>
                        <div>
                          <div
                            className={`text-xs font-black ${
                              isActive ? 'text-[#FF6B57]' : 'text-foreground'
                            }`}
                          >
                            {item.titleBn}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{item.titleEn}</div>
                        </div>
                      </div>

                      {isActive ? (
                        <div className="h-6 w-6 rounded-full bg-[#FF6B57] text-white flex items-center justify-center">
                          <Play className="h-3 w-3 fill-white ml-0.5" />
                        </div>
                      ) : isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/30" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chapter Resources Card */}
            <div className="rounded-3xl border border-amber-200/60 dark:border-amber-900/30 bg-[#FFFDF7] dark:bg-[#181820] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-700 dark:text-amber-400">
                <Bookmark className="h-4 w-4" />
                <span>Chapter resources</span>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-foreground">
                <button
                  onClick={() => setActiveModal('nctb_book')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-colors text-left"
                >
                  <span className="text-rose-500">📕</span>
                  <span>NCTB Book (PDF)</span>
                </button>
                <button
                  onClick={() => setActiveModal('notes')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-colors text-left"
                >
                  <span className="text-sky-500">📄</span>
                  <span>Summary Notes</span>
                </button>
                <button
                  onClick={() => setActiveModal('formulas')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-colors text-left"
                >
                  <span className="text-purple-500">🗂️</span>
                  <span>Formula Sheet</span>
                </button>
                <button
                  onClick={() => setActiveModal('board_questions')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-colors text-left"
                >
                  <span className="text-emerald-500">📗</span>
                  <span>Board Questions (Past 10 yrs)</span>
                </button>
                <button
                  onClick={() => setActiveModal('mindmap')}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-colors text-left"
                >
                  <span className="text-amber-500">📙</span>
                  <span>Mind Map (PDF)</span>
                </button>
              </div>
            </div>
          </div>
          )}

          {/* ========================================================= */}
          {/* MIDDLE COLUMN: MAIN LEARNING WORKSPACE */}
          {/* ========================================================= */}
          <div
            className={`${
              !isLeftSidebarOpen && !isAiSidebarOpen
                ? 'lg:col-span-12'
                : !isLeftSidebarOpen
                ? 'lg:col-span-9'
                : !isAiSidebarOpen
                ? 'lg:col-span-9'
                : 'lg:col-span-6'
            } space-y-6 transition-all duration-300 min-w-0`}
          >
            {/* If Left Sidebar is hidden: show a handy horizontal lesson switcher bar */}
            {!isLeftSidebarOpen && (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-card border border-border/80 overflow-x-auto shadow-2xs animate-in fade-in">
                <span className="font-bold text-xs text-muted-foreground px-2 flex items-center gap-1.5 flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>পাঠ:</span>
                </span>
                <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-0.5">
                  {CHAPTER_1_LESSONS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setActiveLesson(l.id);
                        if (l.id === 1) setActiveStep('concept');
                        else if (l.id === 2) { setActiveStep('example'); setSelectedExampleTab(2); }
                        else if (l.id === 3) { setActiveStep('try'); }
                        else if (l.id === 4) { setActiveStep('example'); setSelectedExampleTab(4); }
                        else if (l.id === 5) { setActiveStep('check'); }
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        activeLesson === l.id
                          ? 'bg-[#FF6B57] text-white shadow-xs'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="font-mono">{l.no}</span>
                      <span>{l.titleBn}</span>
                      {completedLessons.includes(l.id) && (
                        <CheckCircle2 className={`h-3.5 w-3.5 ${activeLesson === l.id ? 'text-white' : 'text-emerald-500'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sleek, Compact Lesson Header & Quick Navigation Bar */}
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-xs">
              <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 via-sky-500/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                {/* Left: Lesson Badges & Title */}
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
                        ★ বোর্ডে আসে
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                      {currentLessonMeta.overviewBn}
                    </p>
                  </div>
                </div>

                {/* Right: Course Progress Pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/60 flex-shrink-0 text-xs font-bold text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>অধ্যায় ১: ৫টি সম্পূর্ণ ধাপ</span>
                </div>
              </div>
            </div>

            {/* 5-Step Learning Navigation Tabs (Exact UI from media_1790987461165.png) */}
            <div className="border-b border-border/70 px-1 pt-1 pb-0 overflow-x-auto no-scrollbar">
              <div className="flex items-center justify-between w-full min-w-[500px] sm:min-w-0">
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
                      {/* Active Bottom Indicator Underline */}
                      {isActive && (
                        <span className="absolute -bottom-px left-0 right-0 h-[2.5px] bg-[#FF5B46] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC LESSON CONTENT ROUTER */}

            {/* ========================================================= */}
            {/* STEP 1: LEARN CONCEPT (ধারণা · বাস্তব সংখ্যার শ্রেণিবিন্যাস) */}
            {/* ========================================================= */}
            {activeStep === 'concept' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Block 1: ধারণা (High-Clarity Visual Diagram & Sorting) */}
                <div id="block-concept" className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  {/* Concept Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                          ১. ধারণা · বাস্তব সংখ্যার শ্রেণিবিন্যাস ও মহাবিশ্ব
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          নিচের ডায়াগ্রামে ক্লিক করে প্রতিটি সেটের সম্পর্ক ও বৈশিষ্ট্য লক্ষ্য করো
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      {/* Visual Mode Selector */}
                      <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/70">
                        <button
                          onClick={() => setVisualMode('nested')}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            visualMode === 'nested'
                              ? 'bg-card text-foreground shadow-2xs'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Layers className="h-3.5 w-3.5 text-indigo-500" />
                          <span>মানচিত্র (Euler Map)</span>
                        </button>
                        <button
                          onClick={() => setVisualMode('tree')}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            visualMode === 'tree'
                              ? 'bg-card text-foreground shadow-2xs'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Network className="h-3.5 w-3.5 text-emerald-500" />
                          <span>শ্রেণিবিন্যাস বৃক্ষ (Tree)</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setIsVideoOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs"
                      >
                        <Play className="h-3 w-3 fill-white" />
                        <span>ভিডিও (3m)</span>
                      </button>
                    </div>
                  </div>

                  {/* VISUAL DIAGRAM AREA: High Clarity & Human Readable */}
                  {visualMode === 'nested' ? (
                    /* VIEW 1: High-Clarity Structured Layered Set Map */
                    <div className="space-y-4">
                      {/* Outer Container: Real Numbers (R) */}
                      <div
                        data-set-region="R"
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveVennRegion('R')}
                        className={`p-4 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                          activeVennRegion === 'R'
                            ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/10 dark:bg-purple-950/30'
                            : 'border-purple-300 dark:border-purple-800/60 bg-purple-500/5 dark:bg-purple-950/20 hover:border-purple-400'
                        }`}
                      >
                        {/* Real Numbers Header */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-serif font-black text-2xl sm:text-3xl text-purple-600 dark:text-purple-400">
                              ℝ
                            </span>
                            <div>
                              <div className="font-black text-base sm:text-lg text-foreground flex items-center gap-2">
                                <span>বাস্তব সংখ্যা (Real Numbers)</span>
                                {activeVennRegion === 'R' && (
                                  <span className="text-[11px] font-bold text-purple-600 bg-purple-500/15 px-2 py-0.5 rounded-full">
                                    নির্বাচিত সেট
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                সংখ্যার রেখায় অবস্থিত সকল মূলদ ও অমূলদ সংখ্যার সামগ্রিক সেট
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-500/15 px-3 py-1 rounded-xl hidden sm:inline-block">
                            ℝ = ℚ ∪ ℚ&apos;
                          </span>
                        </div>

                        {/* Split into Rational (Q) on Left & Irrational (Q') on Right */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                          {/* LEFT: Rational Numbers (Q) - spans 8 cols */}
                          <div
                            data-set-region="Q"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVennRegion('Q');
                            }}
                            className={`lg:col-span-8 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                              activeVennRegion === 'Q'
                                ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50 dark:bg-sky-950/40 shadow-xs'
                                : 'border-sky-300 dark:border-sky-800/60 bg-sky-50/80 dark:bg-sky-950/25 hover:border-sky-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-black text-xl sm:text-2xl text-sky-600 dark:text-sky-400">
                                  ℚ
                                </span>
                                <div>
                                  <div className="font-bold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                                    <span>মূলদ সংখ্যা (Rational Numbers)</span>
                                    {activeVennRegion === 'Q' && (
                                      <span className="text-[10px] font-bold text-sky-600 bg-sky-500/15 px-1.5 py-0.5 rounded-full">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    দুটি পূর্ণসংখ্যার ভগ্নাংশ আকারে প্রকাশযোগ্য
                                  </div>
                                </div>
                              </div>
                              <span className="whitespace-nowrap font-mono text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-500/15 px-2.5 py-1 rounded-lg flex-shrink-0">
                                p/q (q ≠ 0)
                              </span>
                            </div>

                            {/* Rational Examples Bar */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                              <span className="text-xs font-bold text-muted-foreground mr-1">মূলদ নমুনা:</span>
                              {['১/২', '-৩/৪', '০.৭৫', '২', '০.৩৩৩... (= ১/৩)'].map((ex) => (
                                <span
                                  key={ex}
                                  className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold border border-sky-400/20"
                                >
                                  {ex}
                                </span>
                              ))}
                            </div>

                            {/* Nested Inside Q: Integers (Z) */}
                            <div
                              data-set-region="Z"
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVennRegion('Z');
                              }}
                              className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                activeVennRegion === 'Z'
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
                                  : 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/25 hover:border-emerald-400'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-400">
                                    ℤ
                                  </span>
                                  <div>
                                    <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                                      <span>পূর্ণসংখ্যা (Integers)</span>
                                      {activeVennRegion === 'Z' && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.5 rounded-full">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                      শূন্যসহ সকল ধনাত্মক ও ঋণাত্মক অখণ্ড সংখ্যা
                                    </div>
                                  </div>
                                </div>
                                <span className="whitespace-nowrap font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md flex-shrink-0">
                                  ..., -২, -১, ০, ১, ২, ...
                                </span>
                              </div>

                              {/* Nested Inside Z: Natural Numbers (N) */}
                              <div
                                data-set-region="N"
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVennRegion('N');
                                }}
                                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                  activeVennRegion === 'N'
                                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-100/90 dark:bg-amber-950/60 shadow-xs'
                                    : 'border-amber-300 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/40 hover:border-amber-400'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-serif font-black text-base sm:text-lg text-amber-700 dark:text-amber-400">
                                      ℕ
                                    </span>
                                    <span className="font-bold text-xs sm:text-sm text-foreground">
                                      স্বাভাবিক বা প্রাকৃতিক সংখ্যা (Natural Numbers)
                                    </span>
                                    {activeVennRegion === 'N' && (
                                      <span className="text-[10px] font-bold text-amber-700 bg-amber-500/20 px-1.5 py-0.5 rounded-full">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <span className="whitespace-nowrap font-mono text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md flex-shrink-0">
                                    ১, ২, ৩, ৪, ৫, ...
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-amber-900/90 dark:text-amber-200/90 pt-0.5">
                                  <span>গণনাকারী ধনাত্মক সংখ্যা (সর্বদা ১ থেকে শুরু)</span>
                                  <span className="font-bold text-rose-600 dark:text-rose-400">
                                    ⚠️ ০ স্বাভাবিক সংখ্যা নয়!
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT: Irrational Numbers (Q') - spans 4 cols */}
                          <div
                            data-set-region="Q_prime"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVennRegion('Q_prime');
                            }}
                            className={`lg:col-span-4 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                              activeVennRegion === 'Q_prime'
                                ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50 dark:bg-rose-950/40 shadow-xs'
                                : 'border-rose-300 dark:border-rose-800/60 bg-rose-50/80 dark:bg-rose-950/25 hover:border-rose-400'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif font-black text-xl sm:text-2xl text-rose-600 dark:text-rose-400">
                                    ℚ&apos;
                                  </span>
                                  <div>
                                    <div className="font-bold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                                      <span>অমূলদ সংখ্যা</span>
                                      {activeVennRegion === 'Q_prime' && (
                                        <span className="text-[10px] font-bold text-rose-600 bg-rose-500/15 px-1.5 py-0.5 rounded-full">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                      ভগ্নাংশ অসম্ভব ও অসীম অনাবৃত
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground leading-relaxed">
                                যেসব সংখ্যাকে দুটি পূর্ণসংখ্যার অনুপাতে প্রকাশ করা যায় না। এদের দশমিক রূপ অসীম এবং অনাবৃত (কখনোই পৌনঃপুনিক হয় না)।
                              </p>

                              <div className="space-y-1.5 pt-1">
                                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
                                  বাস্তব অমূলদ সংখ্যাসমূহ:
                                </span>
                                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs font-bold">
                                  <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-400/20 text-center">
                                    √২ ≈ ১.৪১৪...
                                  </span>
                                  <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-400/20 text-center">
                                    π ≈ ৩.১৪১৫...
                                  </span>
                                  <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-400/20 text-center">
                                    √৩ ≈ ১.৭৩২...
                                  </span>
                                  <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-400/20 text-center">
                                    √৫ ≈ ২.২৩৬...
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-400/30 text-[11px] text-rose-800 dark:text-rose-300 font-semibold leading-snug">
                              📌 <strong>বোর্ড ট্রিক:</strong> পূর্ণবর্গ নয় এমন যেকোনো স্বাভাবিক সংখ্যার বর্গমূল অমূলদ সংখ্যা।
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* VIEW 2: Taxonomy Tree Diagram (শাখাচিত্র) */
                    <div className="p-5 sm:p-6 rounded-3xl border border-border/80 bg-muted/20 space-y-4">
                      <div className="text-center font-bold text-sm sm:text-base text-foreground flex items-center justify-center gap-2">
                        <Network className="h-5 w-5 text-emerald-500" />
                        <span>বাস্তব সংখ্যার শ্রেণিবিন্যাস বৃক্ষ (Classification Tree)</span>
                      </div>

                      {/* Tree Root */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => setActiveVennRegion('R')}
                          className={`px-6 py-2.5 rounded-2xl border-2 font-bold transition-all text-sm sm:text-base shadow-xs ${
                            activeVennRegion === 'R'
                              ? 'bg-purple-600 text-white border-purple-600 scale-105'
                              : 'bg-card text-foreground border-purple-400/60 hover:border-purple-500'
                          }`}
                        >
                          বাস্তব সংখ্যা (ℝ - Real Numbers)
                        </button>
                        <div className="h-5 w-0.5 bg-border my-1" />
                      </div>

                      {/* Level 1: Rational vs Irrational */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Branch 1: Rational (Q) */}
                        <div className="p-4 rounded-2xl border border-sky-400/50 bg-card space-y-3">
                          <button
                            data-set-region="Q"
                            onClick={() => setActiveVennRegion('Q')}
                            className={`w-full py-2.5 px-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-between gap-2 ${
                              activeVennRegion === 'Q'
                                ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                                : 'bg-sky-50 dark:bg-sky-950/40 text-foreground border-sky-400/60'
                            }`}
                          >
                            <span className="truncate">১. মূলদ সংখ্যা (ℚ)</span>
                            <span className="font-mono text-xs whitespace-nowrap px-2 py-0.5 rounded-md bg-sky-600/20 text-sky-800 dark:text-sky-200 flex-shrink-0">
                              p/q, q ≠ 0
                            </span>
                          </button>

                          <div className="space-y-2.5 pl-2 border-l-2 border-sky-300 dark:border-sky-800">
                            {/* Sub 1: Integers */}
                            <div className="p-2.5 rounded-xl bg-muted/40 space-y-2">
                              <button
                                data-set-region="Z"
                                onClick={() => setActiveVennRegion('Z')}
                                className={`w-full text-left font-bold text-xs sm:text-sm px-2 py-1 rounded-lg transition-all ${
                                  activeVennRegion === 'Z'
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-foreground hover:bg-muted'
                                }`}
                              >
                                ক) পূর্ণসংখ্যা (ℤ): ..., -২, -১, ০, ১, ২, ...
                              </button>
                              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium pt-1">
                                <span className="p-1 rounded bg-card border border-border text-center text-muted-foreground">
                                  ঋণাত্মক (-১, -২...)
                                </span>
                                <span className="p-1 rounded bg-card border border-border text-center font-bold text-emerald-600">
                                  শূন্য (০)
                                </span>
                                <button
                                  data-set-region="N"
                                  onClick={() => setActiveVennRegion('N')}
                                  className={`p-1 rounded border text-center font-bold transition-all ${
                                    activeVennRegion === 'N'
                                      ? 'bg-amber-500 text-white border-amber-500'
                                      : 'bg-card border-border text-amber-700 hover:bg-amber-50'
                                  }`}
                                >
                                  স্বাভাবিক (ℕ)
                                </button>
                              </div>
                            </div>

                            {/* Sub 2: Fractions */}
                            <div className="p-2.5 rounded-xl bg-muted/40 text-xs space-y-1">
                              <div className="font-bold text-foreground">খ) ভগ্নাংশ সংখ্যা:</div>
                              <div className="text-muted-foreground leading-relaxed pl-1 text-[11px]">
                                • <strong>সাধারণ ভগ্নাংশ:</strong> প্রকৃত (১/২), অপ্রকৃত (৫/৩), মিশ্র (১ ১/২)<br />
                                • <strong>দশমিক ভগ্নাংশ:</strong> সসীম (০.২৫) ও আবৃত্ত/পৌনঃপুনিক (০.৩৩৩...)
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Branch 2: Irrational (Q') */}
                        <div className="p-4 rounded-2xl border border-rose-400/50 bg-card space-y-3 flex flex-col justify-between">
                          <button
                            data-set-region="Q_prime"
                            onClick={() => setActiveVennRegion('Q_prime')}
                            className={`w-full py-2.5 px-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-between gap-2 ${
                              activeVennRegion === 'Q_prime'
                                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-foreground border-rose-400/60'
                            }`}
                          >
                            <span className="truncate">২. অমূলদ সংখ্যা (ℚ&apos;)</span>
                            <span className="font-mono text-xs whitespace-nowrap px-2 py-0.5 rounded-md bg-rose-600/20 text-rose-800 dark:text-rose-200 flex-shrink-0">
                              ভগ্নাংশ অসম্ভব
                            </span>
                          </button>

                          <div className="space-y-2.5 pl-2 border-l-2 border-rose-300 dark:border-rose-800 flex-1">
                            <div className="p-2.5 rounded-xl bg-muted/40 text-xs space-y-1.5">
                              <div className="font-bold text-foreground">অসীম অনাবৃত দশমিক:</div>
                              <p className="text-muted-foreground text-[11px] leading-relaxed">
                                কোনো সংখ্যাকে পূর্ণসংখ্যার অনুপাতে লেখা না গেলে তা অমূলদ। যেমন:
                              </p>
                              <div className="flex flex-wrap gap-1 font-mono text-xs font-bold pt-1">
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700">√২</span>
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700">√৩</span>
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700">π</span>
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700">e</span>
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700">√৫</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/20 text-[11px] text-amber-900 dark:text-amber-200">
                            💡 যেকোনো অসীম অনাবৃত দশমিক সংখ্যাই অমূলদ সংখ্যা।
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE SET DETAIL INSPECTOR */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {VENN_DETAILS[activeVennRegion].symbol}
                        </span>
                        <h4 className="font-bold text-base text-foreground">
                          {VENN_DETAILS[activeVennRegion].title}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                        পরিসীমা: {VENN_DETAILS[activeVennRegion].scope}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {VENN_DETAILS[activeVennRegion].desc}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="text-xs sm:text-sm text-primary font-bold font-mono">
                        {VENN_DETAILS[activeVennRegion].example}
                      </div>

                      <div className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-800 dark:text-amber-300 font-medium">
                        💡 <strong>বোর্ড ট্রিক:</strong> {VENN_DETAILS[activeVennRegion].boardTip}
                      </div>
                    </div>
                  </div>

                  {/* CHOLO KORI: INTERACTIVE SORTING ACTIVITY */}
                  <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎮</span>
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-foreground">
                            চলো করি (Interactive Sorting Challenge)
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            সংখ্যাটি ক্লিক করে নির্বাচন করো, তারপর সঠিক বাক্সে ড্রপ করো
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        >
                          <Lightbulb className="h-3.5 w-3.5" />
                          <span>সাহায্য (Hint)</span>
                        </button>
                        <button
                          onClick={handleResetSorting}
                          className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground bg-card px-3 py-1.5 rounded-xl border border-border transition-colors shadow-2xs"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>রিসেট</span>
                        </button>
                      </div>
                    </div>

                    {showHint && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in leading-relaxed">
                        💡 <strong>টিপ:</strong> যা ভগ্নাংশ ($p/q$) আকারে লেখা যায় তা মূলদ। যেমন: $0 = 0/1$, তাই $0$ মূলদ! আর $\sqrt{2}, \pi$ হলো অমূলদ।
                      </div>
                    )}

                    {sortingFeedback && (
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary animate-in fade-in">
                        {sortingFeedback}
                      </div>
                    )}

                    {/* Chips Pool */}
                    <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-card border border-border/60 justify-center">
                      {chips.length === 0 ? (
                        <div className="py-2 text-center text-sm font-bold text-emerald-600 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>অভিনন্দন! সকল সংখ্যা সঠিক বাক্সে সাজানো সম্পন্ন হয়েছে।</span>
                        </div>
                      ) : (
                        chips.map((chip) => {
                          const isSelected = selectedChipId === chip.id;
                          return (
                            <button
                              key={chip.id}
                              onClick={() => setSelectedChipId(isSelected ? null : chip.id)}
                              className={`px-4 py-2 rounded-xl border-2 text-sm sm:text-base font-bold font-mono transition-all flex items-center justify-center ${
                                isSelected
                                  ? 'bg-[#FF6B57] text-white border-[#FF6B57] shadow-md scale-105'
                                  : 'bg-muted/40 hover:bg-muted text-foreground border-border/80'
                              }`}
                            >
                              {chip.val}
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div className="text-xs text-center text-muted-foreground font-medium">
                      {selectedChipId
                        ? '👉 এখন নিচে যে ঘরে ফেলতে চাও, সেই বাক্সে ক্লিক করো:'
                        : '👆 প্রথমে ওপরের যেকোনো সংখ্যায় ক্লিক করে সিলেক্ট করো'}
                    </div>

                    {/* Buckets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <button
                        onClick={() => handleDropIntoBucket('rational')}
                        className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/15 min-h-[120px] text-left transition-all hover:bg-emerald-50/50 hover:border-emerald-500"
                      >
                        <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="font-serif text-base">ℚ</span>
                            <span>মূলদ সংখ্যার বাক্স</span>
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/15">
                            {rationalBucket.length}টি সংখ্যা
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-xs font-mono mt-3">
                          {rationalBucket.length === 0 ? (
                            <span className="text-muted-foreground/60 italic text-xs">এখানে ক্লিক করে মূলদ সংখ্যা ফেলো</span>
                          ) : (
                            rationalBucket.map((c) => (
                              <span
                                key={c.id}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-400/30"
                              >
                                {c.val}
                              </span>
                            ))
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => handleDropIntoBucket('irrational')}
                        className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-rose-400 bg-rose-50/30 dark:bg-rose-950/15 min-h-[120px] text-left transition-all hover:bg-rose-50/50 hover:border-rose-500"
                      >
                        <div className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="font-serif text-base">ℚ&apos;</span>
                            <span>অমূলদ সংখ্যার বাক্স</span>
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/15">
                            {irrationalBucket.length}টি সংখ্যা
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-xs font-mono mt-3">
                          {irrationalBucket.length === 0 ? (
                            <span className="text-muted-foreground/60 italic text-xs">এখানে ক্লিক করে অমূলদ সংখ্যা ফেলো</span>
                          ) : (
                            irrationalBucket.map((c) => (
                              <span
                                key={c.id}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-400/30"
                              >
                                {c.val}
                              </span>
                            ))
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Universal Bottom Navigation Footer for Step 1 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <div className="text-xs text-muted-foreground font-semibold">
                    ধাপ ১ এর ৫ · মূল ধারণা শেষ করে উদাহরণ দেখুন
                  </div>
                  <button
                    onClick={() => {
                      setActiveStep('example');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                  >
                    <span>পরবর্তী ধাপ: See Example (উদাহরণ)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 2: SEE EXAMPLE (বোর্ড স্ট্যান্ডার্ড ৪টি সমাধান ও রুব্রিক) */}
            {/* ========================================================= */}
            {activeStep === 'example' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                          ২. উদাহরণ দেখি · বোর্ড স্ট্যান্ডার্ড ধাপে ধাপে সমাধান
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          এনসিটিবি নবম-দশম সাধারণ গণিত বোর্ডের ৪টি মৌলিক সমস্যার সমাধান ও পরীক্ষকের মার্কিং রুব্রিক
                        </p>
                      </div>
                    </div>

                    {/* 4 Example Tabs Switcher */}
                    <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/70 overflow-x-auto">
                      {[
                        { id: 1, label: '১. শ্রেণিবিন্যাস' },
                        { id: 2, label: '২. √২ অমূলদ প্রমাণ' },
                        { id: 3, label: '৩. ৯–০ নিয়ম' },
                        { id: 4, label: '৪. রেড লাইন যোগ' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedExampleTab(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                            selectedExampleTab === tab.id
                              ? 'bg-card text-foreground shadow-2xs'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUB-EXAMPLE 1: শ্রেণিবিন্যাস */}
                  {selectedExampleTab === 1 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm sm:text-base text-foreground">
                          বোর্ড মডেল উদাহরণ ০১: বিভিন্ন প্রকার বাস্তব সংখ্যার গাণিতিক শ্রেণিবিন্যাস
                        </div>
                        <span className="rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 border border-indigo-500/20">
                          ধাপ {exampleStep} / ৪
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        <div className="md:col-span-4 space-y-2">
                          {[
                            { step: 1, label: 'a) 0 এর শ্রেণি নির্ণয়' },
                            { step: 2, label: 'b) -7 এর শ্রেণি নির্ণয়' },
                            { step: 3, label: 'c) 5/3 ও d) √3 বিশ্লেষণ' },
                            { step: 4, label: 'চূড়ান্ত ফলাফল ও সারসংক্ষেপ' },
                          ].map((s) => (
                            <button
                              key={s.step}
                              onClick={() => setExampleStep(s.step)}
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs sm:text-sm font-bold transition-all ${
                                exampleStep === s.step
                                  ? 'bg-[#FF6B57]/15 text-[#FF6B57] border border-[#FF6B57]/30 shadow-xs'
                                  : 'bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground'
                              }`}
                            >
                              <span
                                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${
                                  exampleStep === s.step ? 'bg-[#FF6B57] text-white' : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {s.step}
                              </span>
                              <span className="leading-snug">{s.label}</span>
                            </button>
                          ))}
                        </div>

                        <div className="md:col-span-8 p-5 sm:p-6 rounded-2xl bg-muted/20 border border-border/70 space-y-4">
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono font-bold text-foreground bg-card p-3 rounded-xl border border-border/60">
                            <span className="px-2 py-0.5 bg-muted/40 rounded-md">a) 0</span>
                            <span className="px-2 py-0.5 bg-muted/40 rounded-md">b) -7</span>
                            <span className="px-2 py-0.5 bg-muted/40 rounded-md">c) 5/3</span>
                            <span className="px-2 py-0.5 bg-muted/40 rounded-md">d) √3</span>
                          </div>

                          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border text-xs sm:text-sm space-y-3 leading-relaxed">
                            {exampleStep === 1 && (
                              <div className="space-y-2 animate-in fade-in">
                                <div className="font-bold text-[#FF6B57] text-sm sm:text-base">a) 0 এর পুঙ্খানুপুঙ্খ বিশ্লেষণ:</div>
                                <p className="text-foreground/90">
                                  0 একটি <strong>পূর্ণসংখ্যা (ℤ)</strong> এবং একই সাথে একটি <strong>মূলদ সংখ্যা (ℚ)</strong>।
                                </p>
                                <p className="text-muted-foreground">
                                  কারণ, <RenderMathText text="$0 = \frac{0}{1}$" />, যেখানে লব ও হর উভয়ই পূর্ণসংখ্যা এবং হর শূন্য নয়। তবে মনে রাখবে, স্বাভাবিক সংখ্যা ১ থেকে শুরু হওয়ায় ০ কখনোই স্বাভাবিক সংখ্যা (ℕ) নয়!
                                </p>
                              </div>
                            )}
                            {exampleStep === 2 && (
                              <div className="space-y-2 animate-in fade-in">
                                <div className="font-bold text-[#FF6B57] text-sm sm:text-base">b) -7 এর পুঙ্খানুপুঙ্খ বিশ্লেষণ:</div>
                                <p className="text-foreground/90">
                                  -7 একটি ঋণাত্মক অখণ্ড সংখ্যা, তাই এটি পূর্ণসংখ্যা (ℤ)।
                                </p>
                                <p className="text-muted-foreground">
                                  যেহেতু <RenderMathText text="$-7 = \frac{-7}{1}$" />, তাই এটি নিশ্চিতভাবেই মূলদ সংখ্যা (ℚ) এবং বাস্তব সংখ্যা (ℝ)।
                                </p>
                              </div>
                            )}
                            {exampleStep === 3 && (
                              <div className="space-y-2 animate-in fade-in">
                                <div className="font-bold text-[#FF6B57] text-sm sm:text-base">c) 5/3 ও d) √3 এর গাণিতিক তুলনা:</div>
                                <p className="text-foreground/90">
                                  • <strong>5/3:</strong> সাধারণ ভগ্নাংশ (<RenderMathText text="$\frac{p}{q}$" /> আকার) যা আবৃত্ত দশমিক দেয় (1.666...)। তাই এটি <strong>মূলদ সংখ্যা (ℚ)</strong>।
                                </p>
                                <p className="text-foreground/90">
                                  • <strong>√3:</strong> ৩ কোনো পূর্ণবর্গ সংখ্যা নয়, তাই এর বর্গমূল একটি অসীম অনাবৃত দশমিক (১.৭৩২০৫০৮...)। সুতরাং এটি নিশ্চিতভাবেই <strong>অমূলদ সংখ্যা (ℚ')</strong>!
                                </p>
                              </div>
                            )}
                            {exampleStep === 4 && (
                              <div className="space-y-2 animate-in fade-in">
                                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">বোর্ড পরীক্ষার জন্য মূল শিক্ষা:</div>
                                <p className="text-foreground/90">
                                  সংখ্যার রেখায় মূলদ ও অমূলদ উভয় প্রকার সংখ্যাই একটি নির্দিষ্ট বিন্দু চিহ্নিত করতে পারে। তাই ০, -৭, ৫/৩ ও √৩ প্রত্যেকেই <strong>বাস্তব সংখ্যা (ℝ)</strong> এর সদস্য।
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => setExampleStep((prev) => Math.max(1, prev - 1))}
                              disabled={exampleStep === 1}
                              className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground disabled:opacity-40 hover:bg-card"
                            >
                              ← পূর্ববর্তী অংশ
                            </button>
                            <button
                              onClick={() => setExampleStep((prev) => Math.min(4, prev + 1))}
                              disabled={exampleStep === 4}
                              className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40"
                            >
                              পরবর্তী অংশ →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-EXAMPLE 2: প্রমাণের গোয়েন্দা (√২ অমূলদ প্রমাণ) */}
                  {selectedExampleTab === 2 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-foreground">
                            বোর্ড মডেল উদাহরণ ০২: বিপরীত যুক্তি পদ্ধতিতে প্রমাণ করো যে, √২ একটি অমূলদ সংখ্যা
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            এসএসসি বোর্ড পরীক্ষায় ক অথবা খ বিভাগে নিশ্চিত ৪ নম্বরের সৃজনশীল প্রশ্ন
                          </p>
                        </div>
                        <span className="rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 border border-indigo-500/20 shrink-0">
                          তদন্ত সূত্র {proofFrame} / ৪
                        </span>
                      </div>

                      {/* 4-Frame Narrative Flow */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
                        {proofFrame === 1 && (
                          <div className="space-y-3 animate-in fade-in">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">ধাপ ০১</span>
                              <h5 className="font-bold text-sm sm:text-base text-foreground">
                                🕵️‍♂️ সূত্র ১: বিপরীত অনুমান (Assumption of Rationality)
                              </h5>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              <RenderMathText text="মনে করি, $\sqrt{2}$ একটি মূলদ সংখ্যা। তাহলে এমন দুটি পরস্পর সহমৌলিক স্বাভাবিক সংখ্যা $p$ ও $q$ ($q > 1$) থাকবে যেন:" />
                            </p>
                            <div className="p-4 bg-card border border-border/80 rounded-xl font-mono text-center text-lg sm:text-xl font-bold text-primary shadow-xs">
                              <RenderMathText text="$\sqrt{2} = \frac{p}{q}$" />
                            </div>
                          </div>
                        )}

                        {proofFrame === 2 && (
                          <div className="space-y-3 animate-in fade-in">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">ধাপ ০২</span>
                              <h5 className="font-bold text-sm sm:text-base text-foreground">
                                📐 সূত্র ২: উভয়পক্ষকে বর্গ ও রূপান্তর
                              </h5>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              <RenderMathText text="উভয়পক্ষকে বর্গ করে $q$ দ্বারা গুণ করলে আমরা নিচের আকারটি পাই:" />
                            </p>
                            <div className="p-4 bg-card border border-border/80 rounded-xl font-mono text-center text-base sm:text-xl font-bold text-primary shadow-xs">
                              <RenderMathText text="$2 = \frac{p^2}{q^2} \implies 2q = \frac{p^2}{q}$" />
                            </div>
                          </div>
                        )}

                        {proofFrame === 3 && (
                          <div className="space-y-3 animate-in fade-in">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 font-mono text-xs font-bold">ধাপ ০৩</span>
                              <h5 className="font-bold text-sm sm:text-base text-rose-600 dark:text-rose-400">
                                🚨 সূত্র ৩: চরম অমিল ধরা পড়ল! (The Crimson Contradiction)
                              </h5>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              <RenderMathText text="এখানে $2q$ স্পষ্টতই একটি পূর্ণসংখ্যা। কিন্তু $p, q$ সহমৌলিক এবং $q > 1$ হওয়ায় $\frac{p^2}{q}$ একটি ভগ্নাংশ!" />
                            </p>
                            <div className="p-4 bg-rose-500/10 border-2 border-rose-500/30 text-rose-600 dark:text-rose-300 font-mono text-center text-lg sm:text-xl font-bold rounded-xl space-y-1">
                              <RenderMathText text="$2q \neq \frac{p^2}{q}$" />
                              <div className="text-xs font-sans font-medium text-rose-700 dark:text-rose-300">
                                (একটি পূর্ণসংখ্যা কখনো কোনো ভগ্নাংশের সমান হতে পারে না!)
                              </div>
                            </div>
                          </div>
                        )}

                        {proofFrame === 4 && (
                          <div className="space-y-3 animate-in fade-in">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-mono text-xs font-bold">ধাপ ০৪</span>
                              <h5 className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                                ⚖️ সূত্র ৪: চূড়ান্ত রায় (The Conclusion)
                              </h5>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              যেহেতু সমীকরণটি অসঙ্গতিপূর্ণ ও গাণিতিকভাবে অসম্ভব, তাই আমাদের প্রাথমিক অনুমানটি সম্পূর্ণ ভুল ছিল।
                            </p>
                            <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-center text-base sm:text-lg font-bold rounded-xl shadow-xs">
                              <RenderMathText text="$\therefore \sqrt{2} \text{ একটি অমূলদ সংখ্যা। (প্রমাণিত)}$" />
                            </div>
                          </div>
                        )}

                        {/* Navigation inside Proof */}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => setProofFrame((prev) => Math.max(1, prev - 1))}
                            disabled={proofFrame === 1}
                            className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-bold text-muted-foreground disabled:opacity-40 hover:bg-card"
                          >
                            ← পূর্ববর্তী সূত্র
                          </button>
                          <button
                            onClick={() => setProofFrame((prev) => Math.min(4, prev + 1))}
                            disabled={proofFrame === 4}
                            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40"
                          >
                            পরবর্তী সূত্র →
                          </button>
                        </div>

                        {/* Rubric Drawer */}
                        <div className="pt-3 border-t border-border/70">
                          <button
                            onClick={() => setIsRubricOpen(!isRubricOpen)}
                            className="flex items-center justify-between w-full text-xs font-bold text-primary hover:underline"
                          >
                            <span className="flex items-center gap-2">
                              <HelpCircle className="h-4 w-4" />
                              <span>পরীক্ষকের গোপন কথা: "কেন এই ধাপ?" (Board Marking Rubric)</span>
                            </span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isRubricOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isRubricOpen && (
                            <div className="p-4 mt-2 rounded-xl bg-card border border-border text-xs text-foreground/90 space-y-2 animate-in fade-in leading-relaxed">
                              <div><strong>ধাপ ১ (১ নম্বর):</strong> <RenderMathText text="$p, q$" /> সহমৌলিক এবং <RenderMathText text="$q > 1$" /> শর্তটি না লিখলে সরাসরি ১ নম্বর কাটা যাবে।</div>
                              <div><strong>ধাপ ২ (১ নম্বর):</strong> উভয়পক্ষকে বর্গ করে <RenderMathText text="$2q = \frac{p^2}{q}$" /> রূপান্তরের যথার্থ ক্যালকুলেশন।</div>
                              <div><strong>ধাপ ৩ (১ নম্বর):</strong> পূর্ণসংখ্যা ও ভগ্নাংশের গাণিতিক অসঙ্গতির সুস্পষ্ট যুক্তি প্রদর্শন।</div>
                              <div><strong>ধাপ ৪ (১ নম্বর):</strong> সঠিক সিদ্ধান্তসূচক বাক্য ("অতএব √২ অমূলদ সংখ্যা")।</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-EXAMPLE 3: ৯-০ নিয়ম */}
                  {selectedExampleTab === 3 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm sm:text-base text-foreground">
                          বোর্ড মডেল উদাহরণ ০৩: ৯–০ নিয়ম প্রয়োগে আবৃত্ত দশমিক ভগ্নাংশকে সাধারণ ভগ্নাংশে রূপান্তর
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          এনসিটিবি সাধারণ গণিত অধ্যায় ১ এর উদাহরণ ৫ ও ৬ ভিত্তিক
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs sm:text-sm text-foreground/90 space-y-1.5 leading-relaxed">
                        <div className="font-bold text-amber-700 dark:text-amber-400">এনসিটিবি রূপান্তর সূত্র:</div>
                        <div className="p-2.5 bg-card rounded-lg border font-mono text-center font-bold text-primary">
                          <RenderMathText text="$\text{সাধারণ ভগ্নাংশ} = \frac{\text{সম্পূর্ণ সংখ্যা} - \text{অনাবৃত অংশের সংখ্যা}}{\text{পৌনঃপুনিকের সমসংখ্যক ৯ এবং দশমিকের পরের অনাবৃতের সমসংখ্যক ০}}$" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2.5 shadow-xs">
                          <span className="text-xs font-bold text-primary">সমস্যা ১: <RenderMathText text="$0.2\dot{4}\dot{5}$" /> কে রূপান্তর করো</span>
                          <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                            <div>• দশমিক বাদে সম্পূর্ণ সংখ্যা = ২৪৫</div>
                            <div>• অনাবৃত অংশ = ২</div>
                            <div>• পৌনঃপুনিক অঙ্ক = ২টি (৪ ও ৫), তাই হর-এ ৯৯</div>
                            <div>• অনাবৃত অঙ্ক = ১টি (২), তাই ডানে একটি ০, হর = ৯৯০</div>
                          </div>
                          <div className="p-3 bg-muted/40 rounded-xl font-mono text-xs font-bold text-foreground text-center">
                            = (২৪৫ - ২) / ৯৯০ = ২৪৩ / ৯৯০ = <strong>২৭ / ১১০</strong>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2.5 shadow-xs">
                          <span className="text-xs font-bold text-primary">সমস্যা ২: <RenderMathText text="$1.\dot{2}\dot{7}$" /> কে রূপান্তর করো</span>
                          <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                            <div>• দশমিক বাদে সম্পূর্ণ সংখ্যা = ১২৭</div>
                            <div>• অনাবৃত অংশ = ১</div>
                            <div>• পৌনঃপুনিক অঙ্ক = ২টি (২ ও ৭), তাই হর-এ ৯৯</div>
                            <div>• দশমিকের পরে অনাবৃত অঙ্ক = ০টি, তাই কোনো ০ বসবে না!</div>
                          </div>
                          <div className="p-3 bg-muted/40 rounded-xl font-mono text-xs font-bold text-foreground text-center">
                            = (১২৭ - ১) / ৯৯ = ১২৬ / ৯৯ = <strong>১৪ / ১১</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-EXAMPLE 4: রেড লাইন পদ্ধতি */}
                  {selectedExampleTab === 4 && (
                    <div className="space-y-5 animate-in fade-in">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm sm:text-base text-foreground">
                          বোর্ড মডেল উদাহরণ ০৪: সদৃশ আবৃত্ত দশমিকের যোগ ও রেড লাইন বাফার জোন
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          সমস্যা: <RenderMathText text="$0.\dot{3} + 0.2\dot{4}\dot{5}$" /> এর যোগফল নির্ণয় করো
                        </p>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm space-y-3 shadow-lg border border-slate-800">
                        <div className="flex justify-between text-xs text-slate-400 font-sans font-bold pb-2 border-b border-slate-800">
                          <span>প্রধান দশমিক স্থানসমূহ</span>
                          <span className="text-rose-400 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                            রেড লাইন বাফার জোন (ক্যারি ক্যাচার)
                          </span>
                        </div>

                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center text-slate-200">
                            <span><RenderMathText text="$0.\dot{3} \implies 0.3333$" /></span>
                            <span className="border-l-2 border-rose-500 pl-3 text-rose-400 font-bold">৩ ৩ ...</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-200">
                            <span><RenderMathText text="$0.2\dot{4}\dot{5} \implies 0.2454$" /></span>
                            <span className="border-l-2 border-rose-500 pl-3 text-rose-400 font-bold">৫ ৪ ...</span>
                          </div>
                          <div className="border-t-2 border-slate-700 pt-2 flex justify-between items-center font-bold text-emerald-400 text-sm sm:text-base">
                            <span>যোগফল = ০ . ৫ ৭ ৮ ৭</span>
                            <span className="border-l-2 border-rose-500 pl-3 text-emerald-400 font-mono text-xs">৮ ৭ (হাতে ক্যারি ১ ছিল)</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                        💡 <strong>কেন রেড লাইন বাফার জরুরি?</strong> বাফার জোনে ৩ + ৫ = ৮ হলেও এর পেছনের ৩ + ৪ = ৭ থেকে কোনো ক্যারি না এলেও, অন্য অংকে যদি যোগফল ১০ বা তার বেশি হয়, তবে পেছনের ১ হাতের সংখ্যা সামনে যোগ না হলে উত্তর ভুল হয়ে যাবে!
                      </div>
                    </div>
                  )}
                </div>

                {/* Universal Bottom Navigation Footer for Step 2 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => {
                      setActiveStep('concept');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground font-bold text-xs sm:text-sm shadow-2xs transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>পূর্ববর্তী ধাপ: Learn Concept</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep('try');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                  >
                    <span>পরবর্তী ধাপ: Try Yourself (অনুশীলন)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 3: TRY YOURSELF (ইন্টারেক্টিভ ল্যাব: ৩টি টাস্ক) */}
            {/* ========================================================= */}
            {activeStep === 'try' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                          ৩. নিজে করো · ইন্টারেক্টিভ ল্যাব (Interactive Practice Lab)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          এনসিটিবি সাধারণ গণিত বোর্ড স্ট্যান্ডার্ড ৩টি হ্যান্ডস-অন চ্যালেঞ্জ নিজে সমাধান করে ধারণা মজবুত করো
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TASK 1: সংখ্যার গোয়েন্দা (Real-Time Number Detective) */}
                  <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🕵️‍♂️</span>
                        <h4 className="font-bold text-sm sm:text-base text-foreground">
                          টাস্ক ০১: সংখ্যার গোয়েন্দা (Number Detective)
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-muted-foreground bg-card px-2.5 py-1 rounded-lg border">
                        সংখ্যা {detectiveIndex + 1} / {DETECTIVE_CHALLENGES.length}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground">
                      নিচের সংখ্যাটি কোন কোন সেটের অন্তর্ভুক্ত? সংশ্লিষ্ট সকল সেটের টিকবক্স সিলেক্ট করে "যাচাই করো" বাটনে ক্লিক করো:
                    </p>

                    {/* Number Badge */}
                    <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs">
                      <div className="text-xs font-semibold text-muted-foreground">প্রদত্ত সংখ্যা:</div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-primary mt-1">
                        <RenderMathText text={DETECTIVE_CHALLENGES[detectiveIndex].math} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {DETECTIVE_CHALLENGES[detectiveIndex].label}
                      </div>
                    </div>

                    {/* Set Checkboxes */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'N', label: 'স্বাভাবিক (ℕ)', color: 'border-amber-400 text-amber-700 dark:text-amber-300' },
                        { id: 'Z', label: 'পূর্ণসংখ্যা (ℤ)', color: 'border-emerald-400 text-emerald-700 dark:text-emerald-300' },
                        { id: 'Q', label: 'মূলদ সংখ্যা (ℚ)', color: 'border-sky-400 text-sky-700 dark:text-sky-300' },
                        { id: 'Q_prime', label: 'অমূলদ সংখ্যা (ℚ\')', color: 'border-rose-400 text-rose-700 dark:text-rose-300' },
                      ].map((setOption) => {
                        const isChecked = detectiveSelectedSets.includes(setOption.id);
                        return (
                          <button
                            key={setOption.id}
                            type="button"
                            onClick={() => {
                              setDetectiveSelectedSets((prev) =>
                                isChecked ? prev.filter((s) => s !== setOption.id) : [...prev, setOption.id]
                              );
                              setDetectiveFeedback(null);
                            }}
                            className={`p-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                              isChecked
                                ? 'bg-primary/10 border-primary text-primary shadow-xs'
                                : 'bg-card border-border hover:bg-muted text-muted-foreground'
                            }`}
                          >
                            <span>{setOption.label}</span>
                            <span className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] ${
                              isChecked ? 'bg-primary text-white border-primary' : 'border-muted-foreground/40'
                            }`}>
                              {isChecked ? '✓' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback message */}
                    {detectiveFeedback && (
                      <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                        detectiveFeedback.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                      }`}>
                        <RenderMathText text={detectiveFeedback.text} />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleVerifyDetective}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-xs hover:bg-primary/90 transition-all"
                      >
                        যাচাই করো
                      </button>
                      <button
                        onClick={handleNextDetective}
                        className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs sm:text-sm font-bold text-foreground transition-all flex items-center gap-1.5"
                      >
                        <span>পরবর্তী সংখ্যা</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* TASK 2: আবৃত্ত দশমিক ভগ্নাংশ চ্যালেঞ্জ ও লাইভ স্যান্ডবক্স */}
                  <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧮</span>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">
                        টাস্ক ০২: ৯–০ নিয়ম চ্যালেঞ্জ ও লাইভ ক্যালকুলেটর
                      </h4>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs sm:text-sm space-y-1 text-foreground/90">
                      <div className="font-bold text-amber-700 dark:text-amber-400">
                        চ্যালেঞ্জ: <RenderMathText text="$0.4\\dot{7}$ কে সাধারণ ভগ্নাংশে প্রকাশ করো:" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        লব = সম্পূর্ণ সংখ্যা − অনাবৃত অঙ্ক এবং হর = পৌনঃপুনিকের জন্য ৯ ও অনাবৃতের জন্য ০
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground block">
                          লব (Numerator) লিখুন:
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: 43"
                          value={fracNumInput}
                          onChange={(e) => setFracNumInput(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-border bg-card font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground block">
                          হর (Denominator) লিখুন:
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: 90"
                          value={fracDenInput}
                          onChange={(e) => setFracDenInput(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-border bg-card font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>

                    {fracFeedback && (
                      <div className={`p-3 rounded-xl text-xs sm:text-sm border leading-relaxed ${
                        fracFeedback.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                      }`}>
                        <RenderMathText text={fracFeedback.text} />
                      </div>
                    )}

                    <div className="flex justify-start">
                      <button
                        onClick={handleVerifyFractionChallenge}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-xs hover:bg-primary/90 transition-all"
                      >
                        চ্যালেঞ্জ যাচাই করো
                      </button>
                    </div>

                    {/* Live Sandbox inputs */}
                    <div className="pt-4 border-t border-border/70 space-y-3">
                      <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        <span>লাইভ স্যান্ডবক্স: যেকোনো আবৃত্ত দশমিক লিখে যাচাই করো</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground block">পূর্ণ অংশ</label>
                          <input
                            type="text"
                            value={calcWhole}
                            onChange={(e) => setCalcWhole(e.target.value)}
                            className="w-full p-2 rounded-lg border border-border bg-card font-mono text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground block">অনাবৃত অঙ্ক (০ হবে)</label>
                          <input
                            type="text"
                            value={calcNonRec}
                            onChange={(e) => setCalcNonRec(e.target.value)}
                            className="w-full p-2 rounded-lg border border-border bg-card font-mono text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-amber-600 block">আবৃত্ত অঙ্ক (৯ হবে)</label>
                          <input
                            type="text"
                            value={calcRec}
                            onChange={(e) => setCalcRec(e.target.value)}
                            className="w-full p-2 rounded-lg border border-amber-400/50 bg-amber-500/10 font-mono text-xs font-bold text-amber-600"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-card rounded-xl border border-border text-center font-mono text-xs sm:text-sm font-bold text-primary">
                        {calcResult.rawDec} = <span className="underline">({calcResult.fullNum} - {calcResult.nonRecNum})</span> / {calcResult.denominator} = <span className="text-emerald-600">{calcResult.simplified}</span>
                      </div>
                    </div>
                  </div>

                  {/* TASK 3: প্রমাণের ক্রম সাজাও (Proof Puzzle) */}
                  <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧩</span>
                      <h4 className="font-bold text-sm sm:text-base text-foreground">
                        টাস্ক ০৩: প্রমাণের ক্রম সাজাও (Proof Sequence Puzzle)
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      "√৩ একটি অমূলদ সংখ্যা" প্রমাণ করার ধাপগুলো এলোমেলো হয়ে গেছে। [↑] ও [↓] বাটনে ক্লিক করে সঠিক যুক্তির ক্রমানুসারে সাজাও:
                    </p>

                    <div className="space-y-2.5">
                      {proofPuzzleOrder.map((stepId, index) => {
                        const card = PROOF_PUZZLE_CARDS[stepId];
                        return (
                          <div
                            key={card.id}
                            className="p-3.5 sm:p-4 rounded-xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="h-7 w-7 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                                <RenderMathText text={card.text} />
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleMoveProofStep(index, 'up')}
                                disabled={index === 0}
                                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30"
                                title="উপরে নিন"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleMoveProofStep(index, 'down')}
                                disabled={index === proofPuzzleOrder.length - 1}
                                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30"
                                title="নিচে নিন"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {proofPuzzleFeedback && (
                      <div className={`p-3.5 rounded-xl text-xs sm:text-sm border leading-relaxed ${
                        proofPuzzleFeedback.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                      }`}>
                        {proofPuzzleFeedback.text}
                      </div>
                    )}

                    <div className="flex justify-start">
                      <button
                        onClick={handleVerifyProofPuzzle}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-xs hover:bg-primary/90 transition-all"
                      >
                        ক্রম যাচাই করো
                      </button>
                    </div>
                  </div>
                </div>

                {/* Universal Bottom Navigation Footer for Step 3 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => {
                      setActiveStep('example');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground font-bold text-xs sm:text-sm shadow-2xs transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>পূর্ববর্তী ধাপ: See Example</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep('check');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                  >
                    <span>পরবর্তী ধাপ: Check Understanding (মূল্যায়ন)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 4: CHECK UNDERSTANDING (৫টি বোর্ড প্রশ্ন ও মূল্যায়ন) */}
            {/* ========================================================= */}
            {activeStep === 'check' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                          ৪. মূল্যায়ন · ঝটপট বোর্ড কুইজ (Check Understanding)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          বিগত ৫ বছরের ঢাকা, চট্টগ্রাম, রাজশাহী ও যশোর বোর্ডের ৫টি শীর্ষ প্রশ্ন
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 border border-amber-500/20">
                        স্কোর: {calculateQuizScore()} / ৫
                      </span>
                    </div>
                  </div>

                  {/* 5 Board Questions */}
                  <div className="space-y-5">
                    {BOARD_MCQ_QUESTIONS.map((q, qIndex) => {
                      const selectedOptId = boardQuizAnswers[q.id];
                      const isAnswered = selectedOptId !== undefined;
                      const chosenOpt = q.options.find((o) => o.id === selectedOptId);
                      const isCorrect = chosenOpt?.isCorrect ?? false;

                      return (
                        <div key={q.id} className="p-5 sm:p-6 rounded-2xl bg-muted/20 border border-border/70 space-y-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-card border text-muted-foreground">
                              {q.board}
                            </span>
                            <span className="text-xs text-muted-foreground font-semibold">প্রশ্ন {qIndex + 1} / ৫</span>
                          </div>

                          <div className="text-sm sm:text-base font-bold text-foreground">
                            <RenderMathText text={q.question} />
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {q.options.map((opt) => {
                              const isSelected = selectedOptId === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleSelectBoardQuiz(q.id, opt.id)}
                                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center min-h-[48px] ${
                                    isSelected
                                      ? opt.isCorrect
                                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                                        : 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                      : isAnswered && opt.isCorrect
                                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                      : 'bg-card border-border hover:bg-muted text-foreground'
                                  }`}
                                >
                                  <RenderMathText text={opt.label} />
                                </button>
                              );
                            })}
                          </div>

                          {/* Rationale feedback */}
                          {isAnswered && (
                            <div className={`p-3.5 rounded-xl text-xs sm:text-sm border leading-relaxed ${
                              isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                            }`}>
                              <span className="font-bold mr-1.5">{isCorrect ? '✅ সঠিক!' : '❌ ভুল!'}</span>
                              <RenderMathText text={q.rationale} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Quiz Submit & Save */}
                  <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        তোমার ফলাফল: {calculateQuizScore()} / ৫ ({Math.round((calculateQuizScore() / 5) * 100)}%)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {calculateQuizScore() >= 4
                          ? 'দারুণ প্রস্তুতি! বাস্তব সংখ্যার উপর তোমার দখল চমৎকার। 🎉'
                          : 'আরেকবার রিভিশন দিয়ে চেষ্টা করে পুরো ৫-এ-৫ অর্জন করো!'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setBoardQuizAnswers({});
                          setBoardQuizSubmitted(false);
                        }}
                        className="px-4 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-muted-foreground transition-all"
                      >
                        রিসেট
                      </button>
                      <button
                        onClick={handleSubmitBoardQuiz}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>অগ্রগতি সংরক্ষণ করুন</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Universal Bottom Navigation Footer for Step 4 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => {
                      setActiveStep('try');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground font-bold text-xs sm:text-sm shadow-2xs transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>পূর্ববর্তী ধাপ: Try Yourself</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep('summary');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                  >
                    <span>পরবর্তী ধাপ: Summary (সারসংক্ষেপ)</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 5: SUMMARY (সারসংক্ষেপ ও অধ্যায় ১ রিভিশন চিট-শিট) */}
            {/* ========================================================= */}
            {activeStep === 'summary' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                          ৫. সারসংক্ষেপ · অধ্যায় ১ রিভিশন চিট-শিট (Chapter 1 Summary)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          বোর্ড পরীক্ষার আগের রাতের জন্য সম্পূর্ণ কনসেপ্ট, ফর্মুলা ও সতর্কতার হ্যান্ডনোট
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCopySummary}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-border/80 hover:bg-muted text-xs font-bold text-foreground shadow-2xs transition-all"
                    >
                      <Copy className="h-3.5 w-3.5 text-primary" />
                      <span>{copyToast ? 'কপি হয়েছে! ✓' : 'স্টাডি নোট কপি করুন'}</span>
                    </button>
                  </div>

                  {/* Section 1: Set Hierarchy Matrix */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                      <span>📐</span>
                      <span>বাস্তব সংখ্যার সেট হায়ারার্কি ও প্রতীক সংক্ষেপ</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-muted/20 border border-purple-400/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-purple-600">ℝ</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-700">বাস্তব সংখ্যা</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          সংখ্যার রেখার সকল বিন্দু। ℝ = ℚ ∪ ℚ' (সকল মূলদ ও অমূলদ এর সংযোগ)।
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-muted/20 border border-sky-400/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-sky-600">ℚ</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-700">মূলদ সংখ্যা</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          p/q আকার (q ≠ 0)। সসীম দশমিক ও পৌনঃপুনিক দশমিক নিশ্চিত মূলদ।
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-muted/20 border border-emerald-400/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-emerald-600">ℤ</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700">পূর্ণসংখ্যা</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          শূন্যসহ সকল ধনাত্মক ও ঋণাত্মক অখণ্ড সংখ্যা: {"{..., -২, -১, ০, ১, ২...}"}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-muted/20 border border-amber-400/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-amber-600">ℕ</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700">স্বাভাবিক সংখ্যা</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          গণনাকারী ধনাত্মক অখণ্ড সংখ্যা: {"{১, ২, ৩...}"}। ০ স্বাভাবিক সংখ্যা নয়!
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-muted/20 border border-rose-400/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-base font-black text-rose-600">ℚ&apos;</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-700">অমূলদ সংখ্যা</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          অসীম অনাবৃত দশমিক। পূর্ণবর্গ নয় এমন সংখ্যার বর্গমূল (√২, √৩, √৫, π)।
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5 text-center flex flex-col justify-center">
                        <div className="text-xs font-bold text-muted-foreground">সেট সম্পর্ক সূত্র:</div>
                        <div className="font-mono font-bold text-sm text-primary">
                          ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: 3 Golden Formulae */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                      <span>🌟</span>
                      <span>এনসিটিবি ৩টি গোল্ডেন নিয়ম (Golden Formulae)</span>
                    </h4>

                    <div className="space-y-2.5 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1">
                        <div className="font-bold text-primary">১. মূলদ ও অমূলদ সংখ্যা চেনার নিয়ম:</div>
                        <p className="text-muted-foreground leading-relaxed">
                          যদি কোনো সংখ্যাকে দুটি পূর্ণসংখ্যার ভগ্নাংশ (<RenderMathText text="$\\frac{p}{q}, q \\neq 0$" />) আকারে প্রকাশ করা যায় তবে তা মূলদ। পূর্ণবর্গ নয় এমন সংখ্যার বর্গমূল সর্বদা অমূলদ।
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1">
                        <div className="font-bold text-amber-600 dark:text-amber-400">২. পৌনঃপুনিক দশমিক থেকে সাধারণ ভগ্নাংশ (৯-০ নিয়ম):</div>
                        <p className="text-muted-foreground leading-relaxed">
                          <RenderMathText text="$\\text{সাধারণ ভগ্নাংশ} = \\frac{\\text{সম্পূর্ণ সংখ্যা} - \\text{অনাবৃত অংশের সংখ্যা}}{\\text{পৌনঃপুনিকের সমসংখ্যক ৯ এবং অনাবৃতের সমসংখ্যক ০}}$" />
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">৩. সদৃশ আবৃত্ত দশমিক যোগ ও বাফার নিয়ম:</div>
                        <p className="text-muted-foreground leading-relaxed">
                          যোগ করার সময় রেড লাইনের ডানে অন্তত ২টি অতিরিক্ত অঙ্ক (বাফার জোন) রাখতে হবে যাতে পেছনের ক্যারি সামনে যুক্ত হতে পারে।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Top 5 Board Traps */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm sm:text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>বোর্ড পরীক্ষার শীর্ষ ৫টি মারাত্মক ভুল ও সতর্কতা</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-foreground/90">
                        <span className="font-bold text-rose-600">১. ০ স্বাভাবিক সংখ্যা নয়:</span> ০ একটি পূর্ণসংখ্যা ও মূলদ সংখ্যা, কিন্তু প্রাকৃতিক বা স্বাভাবিক সংখ্যা সর্বদা ১ থেকে শুরু হয়।
                      </div>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-foreground/90">
                        <span className="font-bold text-rose-600">২. √২ প্রমাণে q &gt; 1 শর্ত:</span> এই শর্ত না লিখলে শিক্ষক সরাসরি ১ নম্বর কেটে নেন।
                      </div>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-foreground/90">
                        <span className="font-bold text-rose-600">৩. π একটি অমূলদ সংখ্যা:</span> ২২/৭ হলো π এর আসন্ন মান, প্রকৃত π অসীম অনাবৃত হওয়ায় নিশ্চিত অমূলদ।
                      </div>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-foreground/90">
                        <span className="font-bold text-rose-600">৪. √১৬ অমূলদ নয়:</span> ১৬ পূর্ণবর্গ হওয়ায় √১৬ = ৪, যা স্বাভাবিক, পূর্ণসংখ্যা ও মূলদ!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Universal Bottom Navigation Footer for Step 5 */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => {
                      setActiveStep('check');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground font-bold text-xs sm:text-sm shadow-2xs transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>পূর্ববর্তী ধাপ: Check Understanding</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsChapterFinished(true);
                      markLessonComplete(1);
                      markLessonComplete(2);
                      markLessonComplete(3);
                      markLessonComplete(4);
                      markLessonComplete(5);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isChapterFinished ? 'অধ্যায় ১ সম্পূর্ণ হয়েছে! ✓' : 'অধ্যায় ১ সম্পূর্ণ হিসেবে চিহ্নিত করুন 🎉'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: AI TUTOR, QUICK TOOLS, PROGRESS (Cols 10-12) */}
          {/* ========================================================= */}
          {isAiSidebarOpen && (
            <div className="lg:col-span-3 space-y-4 animate-in fade-in duration-200">
              
              {/* Card 1: AI শিক্ষক (AI Companion / Tutor) */}
              <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground">AI শিক্ষক</h3>
                    <div className="text-xs text-muted-foreground font-medium">তোমার ব্যক্তিগত সহায়ক</div>
                  </div>
                </div>

                {/* Chat Speech Area */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'ai'
                          ? 'bg-muted/40 text-foreground border border-border/50'
                          : 'bg-[#FF6B57] text-white ml-4 font-medium'
                      }`}
                    >
                      <RenderMathText text={msg.text} />
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-muted/30 text-xs sm:text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin text-[#FF6B57]" />
                      <span>AI শিক্ষক উত্তর তৈরি করছেন...</span>
                    </div>
                  )}
                </div>

                {/* Quick Prompt Chips */}
                <div className="space-y-1.5 pt-1">
                  {[
                    'মূলদ ও অমূলদ সংখ্যার পার্থক্য কী?',
                    '√২ কেন অমূলদ?',
                    '০ কি প্রাকৃতিক সংখ্যা?',
                    'সংখ্যার রেখায় -৩/২ কোথায় থাকবে?',
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskAI(prompt)}
                      disabled={isAiLoading}
                      className="w-full text-left p-2.5 rounded-xl bg-card hover:bg-muted/60 border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <span className="text-[#FF6B57]">💬</span>
                      <span className="truncate">{prompt}</span>
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendChat} className="relative pt-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="তোমার প্রশ্ন লেখো..."
                    disabled={isAiLoading}
                    className="w-full pl-4 pr-11 py-3 rounded-2xl bg-muted/40 border border-border/70 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isAiLoading}
                    className="absolute right-1.5 top-2.5 h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Card 2: Quick Tools (2x2 Grid) */}
              <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-foreground">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>কুইক টুলস (Quick Tools)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-left">
                  <button
                    onClick={() => setActiveModal('notes')}
                    className="p-3.5 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 transition-colors space-y-1"
                  >
                    <div className="text-lg text-sky-500">📄</div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">সংক্ষেপ নোট</div>
                    <div className="text-[11px] text-muted-foreground">এই পাঠের মূল পয়েন্ট</div>
                  </button>

                  <button
                    onClick={() => setActiveModal('mindmap')}
                    className="p-3.5 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 transition-colors space-y-1"
                  >
                    <div className="text-lg text-purple-500">🧭</div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">মাইন্ড ম্যাপ</div>
                    <div className="text-[11px] text-muted-foreground">পুরো চ্যাপ্টারের চিত্র</div>
                  </button>

                  <button
                    onClick={() => setActiveModal('formulas')}
                    className="p-3.5 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 transition-colors space-y-1"
                  >
                    <div className="text-lg text-rose-500">📑</div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">ফর্মুলা শিট</div>
                    <div className="text-[11px] text-muted-foreground">গুরুত্বপূর্ণ সূত্র</div>
                  </button>

                  <button
                    onClick={() => setActiveModal('board_questions')}
                    className="p-3.5 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 transition-colors space-y-1"
                  >
                    <div className="text-lg text-emerald-500">📋</div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">বোর্ড প্রশ্ন</div>
                    <div className="text-[11px] text-muted-foreground">পূর্ববর্তী বছরের</div>
                  </button>
                </div>
              </div>

              {/* Card 3: You're Making Progress! */}
              <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        className="stroke-muted stroke-[3]"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        className="stroke-emerald-500 stroke-[3] transition-all duration-700"
                        strokeDasharray="88"
                        strokeDashoffset={88 - (88 * progressPercent) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-foreground">{progressPercent}%</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-foreground">অগ্রগতি ট্র্যাকার</h4>
                    <div className="text-xs text-muted-foreground">৫টির মধ্যে {completedLessons.length}টি পাঠ সম্পন্ন</div>
                  </div>
                </div>

                {/* Progress Checklist */}
                <div className="space-y-2 pt-1 text-xs sm:text-sm">
                  {[
                    { id: 1, title: 'সংখ্যার মহাবিশ্ব' },
                    { id: 2, title: 'প্রমাণের গোয়েন্দা' },
                    { id: 3, title: 'আবৃত্ত দশমিক কোড' },
                    { id: 4, title: 'রেড লাইন পদ্ধতি' },
                    { id: 5, title: 'ঝটপট বোর্ড কুইজ' },
                  ].map((item) => {
                    const isDone = completedLessons.includes(item.id);
                    const isCurrent = activeLesson === item.id;

                    return (
                      <div key={item.id} className="flex items-center gap-2.5">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0" />
                        ) : isCurrent ? (
                          <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#FF6B57] text-white flex items-center justify-center shrink-0">
                            <Play className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-white ml-0.2" />
                          </div>
                        ) : (
                          <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/30 shrink-0" />
                        )}
                        <span className={isCurrent ? 'font-bold text-[#FF6B57]' : isDone ? 'text-foreground' : 'text-muted-foreground'}>
                          {item.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: Study Tip */}
              <div className="rounded-3xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-800 dark:text-amber-300">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  <span>পড়ার বিশেষ টিপস (Study Tip)</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-medium">
                  {currentLessonMeta.studyTip}
                </p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Video Lesson Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-rose-500" />
                <h3 className="font-bold text-base text-foreground">
                  {currentLessonMeta.titleBn} — ৩ মিনিটের ধারণাগত ভিডিও
                </h3>
              </div>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="p-1 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center p-6 text-slate-300 space-y-3">
              <div className="h-14 w-14 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center animate-pulse">
                <Play className="h-7 w-7 fill-rose-500 ml-1" />
              </div>
              <div className="text-sm font-bold text-white">এনসিটিবি সাধারণ গণিত: অধ্যায় ১ লাইভ সিমুলেশন</div>
              <p className="text-xs text-slate-400 max-w-md">
                বাস্তব সংখ্যা, মূলদ-অমূলদ সংখ্যার বিভাজন এবং ইউক্লিডিয় প্রক্রিয়ার জীবন্ত রূপ।
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
              >
                বুঝেছি, অনুশীলন চালিয়ে যাই
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tools Details Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground">
                {activeModal === 'nctb_book' && '📕 NCTB নবম-দশম শ্রেণির সাধারণ গণিত পাঠ্যবই'}
                {activeModal === 'notes' && '📄 অধ্যায় ১: বাস্তব সংখ্যা সংক্ষেপ নোট'}
                {activeModal === 'formulas' && '🗂️ অধ্যায় ১: ফর্মুলা শিট'}
                {activeModal === 'board_questions' && '📗 বিগত ১০ বছরের বোর্ড প্রশ্ন ও সমাধান'}
                {activeModal === 'mindmap' && '📙 বাস্তব সংখ্যা কনসেপ্ট মাইন্ড ম্যাপ'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto space-y-3 text-xs leading-relaxed text-muted-foreground pr-1">
              {activeModal === 'notes' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-muted/40 font-bold text-foreground">
                    মূল পয়েন্টসমূহ:
                  </div>
                  <ul className="list-disc list-inside space-y-1.5">
                    <li>স্বাভাবিক সংখ্যা: ১, ২, ৩... (শূন্য স্বাভাবিক সংখ্যা নয়)।</li>
                    <li>পূর্ণসংখ্যা: শূন্যসহ সকল ধনাত্মক ও ঋণাত্মক অখণ্ড সংখ্যা।</li>
                    <li>মূলদ সংখ্যা: যাদের p/q আকারে লেখা যায় (q ≠ 0)। এদের দশমিক রূপ সসীম বা আবৃত্ত।</li>
                    <li>অমূলদ সংখ্যা: যাদের p/q আকারে লেখা যায় না। যেমন: √২, √৩, π।</li>
                    <li>বাস্তব সংখ্যা: মূলদ ও অমূলদ সংখ্যার সেটকে একত্রে বাস্তব সংখ্যা বলে।</li>
                  </ul>
                </div>
              )}

              {activeModal === 'formulas' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-muted/40 font-bold text-foreground">
                    আবৃত্ত দশমিক থেকে সাধারণ ভগ্নাংশ রূপান্তরের সূত্র:
                  </div>
                  <div className="p-3 rounded-xl bg-card border font-mono text-center text-sm font-bold text-primary">
                    লব = সম্পূর্ণ সংখ্যা − অনাবৃত অংশ<br />
                    হর = যতটি পৌনঃপুনিক ততটি ৯ এবং যতটি অনাবৃত ততটি ০
                  </div>
                </div>
              )}

              {activeModal === 'board_questions' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-muted/40 font-bold text-foreground">
                    ঢাকা বোর্ড ও রাজশাহী বোর্ডের শীর্ষ প্রশ্ন:
                  </div>
                  <div className="p-3 rounded-xl bg-card border space-y-1">
                    <span className="font-bold text-foreground">প্রশ্ন: প্রমাণ করো যে, √২ একটি অমূলদ সংখ্যা। [৪ নম্বর]</span>
                    <p className="text-muted-foreground">বোর্ডে প্রতি বছর ক বা খ অংশে এই প্রমাণটি আসে।</p>
                  </div>
                </div>
              )}

              {(activeModal === 'nctb_book' || activeModal === 'mindmap') && (
                <div className="p-6 rounded-2xl bg-muted/30 text-center space-y-3">
                  <FileDown className="h-10 w-10 text-primary mx-auto" />
                  <div className="text-sm font-bold text-foreground">ডাউনলোড প্রস্তুত</div>
                  <p className="text-xs text-muted-foreground">
                    এনসিটিবি অনুমোদিত অফিসিয়াল রিসোর্স ফাইল ডাউনলোড করুন।
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
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
