'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
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
  Scale,
  Ruler,
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
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// 7 SI Fundamental Quantities
interface FundamentalQuantity {
  id: string;
  nameBn: string;
  nameEn: string;
  unitBn: string;
  unitEn: string;
  symbol: string;
  dimension: string;
  description: string;
}

const FUNDAMENTAL_QUANTITIES: FundamentalQuantity[] = [
  {
    id: 'length',
    nameBn: 'দৈর্ঘ্য',
    nameEn: 'Length',
    unitBn: 'মিটার',
    unitEn: 'meter',
    symbol: 'm',
    dimension: '[L]',
    description: 'শূন্য মাধ্যমে আলো ১/২৯৯,৭৯২,৪৫৮ সেকেন্ডে যে দূরত্ব অতিক্রম করে।',
  },
  {
    id: 'mass',
    nameBn: 'ভর',
    nameEn: 'Mass',
    unitBn: 'কিলোগ্রাম',
    unitEn: 'kilogram',
    symbol: 'kg',
    dimension: '[M]',
    description: 'প্ল্যাঙ্ক ধ্রুবক h এর নির্ধারিত মান থেকে সংজ্ঞায়িত পদার্থের মৌলিক সত্ত্বা।',
  },
  {
    id: 'time',
    nameBn: 'সময়',
    nameEn: 'Time',
    unitBn: 'সেকেন্ড',
    unitEn: 'second',
    symbol: 's',
    dimension: '[T]',
    description: 'সিজিয়াম-১৩৩ পরমাণুর ৯,১৯২,৬৩১,৭৭০ টি স্পন্দনের সময়কাল।',
  },
  {
    id: 'temperature',
    nameBn: 'তাপমাত্রা',
    nameEn: 'Temperature',
    unitBn: 'কেলভিন',
    unitEn: 'kelvin',
    symbol: 'K',
    dimension: '[θ]',
    description: 'বোল্টজম্যান ধ্রুবক k এর সাপেক্ষে সংজ্ঞায়িত পরম তাপমাত্রা স্কেল।',
  },
  {
    id: 'current',
    nameBn: 'তড়িৎপ্রবাহ',
    nameEn: 'Electric Current',
    unitBn: 'অ্যাম্পিয়ার',
    unitEn: 'ampere',
    symbol: 'A',
    dimension: '[I]',
    description: 'মৌলিক আধান e এর মাধ্যমে সংজ্ঞায়িত প্রতি সেকেন্ডে চার্জের প্রবাহ।',
  },
  {
    id: 'light',
    nameBn: 'দীপন তীব্রতা',
    nameEn: 'Luminous Intensity',
    unitBn: 'ক্যান্ডেলা',
    unitEn: 'candela',
    symbol: 'cd',
    dimension: '[J]',
    description: '৫৪০ × ১০¹² হার্জ কম্পাঙ্কের একবর্ণী আলোর নির্গমন ক্ষমতার তীব্রতা।',
  },
  {
    id: 'amount',
    nameBn: 'পদার্থের পরিমাণ',
    nameEn: 'Amount of Substance',
    unitBn: 'মোল',
    unitEn: 'mole',
    symbol: 'mol',
    dimension: '[N]',
    description: 'অ্যাভোগাড্রো সংখ্যা (৬.০২২ × ১০²³) পরিমাণ মৌলিক কণার সমাহার।',
  },
];

// Derived Quantities for Interactive Constructor
interface DerivedQuantity {
  id: string;
  nameBn: string;
  formulaBn: string;
  unit: string;
  dimension: string;
  baseDeps: string[];
}

const DERIVED_QUANTITIES: DerivedQuantity[] = [
  {
    id: 'velocity',
    nameBn: 'বেগ (Velocity)',
    formulaBn: 'দূরত্ব / সময়',
    unit: 'm/s (or m·s⁻¹)',
    dimension: '[LT⁻¹]',
    baseDeps: ['length', 'time'],
  },
  {
    id: 'acceleration',
    nameBn: 'ত্বরণ (Acceleration)',
    formulaBn: 'বেগের পরিবর্তন / সময়',
    unit: 'm/s² (or m·s⁻²)',
    dimension: '[LT⁻²]',
    baseDeps: ['length', 'time'],
  },
  {
    id: 'force',
    nameBn: 'বল (Force)',
    formulaBn: 'ভর × ত্বরণ',
    unit: 'N (kg·m/s²)',
    dimension: '[MLT⁻²]',
    baseDeps: ['mass', 'length', 'time'],
  },
  {
    id: 'work',
    nameBn: 'কাজ ও শক্তি (Work & Energy)',
    formulaBn: 'বল × সরণ',
    unit: 'J (kg·m²/s² বা N·m)',
    dimension: '[ML²T⁻²]',
    baseDeps: ['mass', 'length', 'time'],
  },
  {
    id: 'power',
    nameBn: 'ক্ষমতা (Power)',
    formulaBn: 'কাজ / সময়',
    unit: 'W (J/s বা kg·m²/s³)',
    dimension: '[ML²T⁻³]',
    baseDeps: ['mass', 'length', 'time'],
  },
  {
    id: 'pressure',
    nameBn: 'চাপ (Pressure)',
    formulaBn: 'বল / ক্ষেত্রফল',
    unit: 'Pa (N/m² বা kg·m⁻¹·s⁻²)',
    dimension: '[ML⁻¹T⁻²]',
    baseDeps: ['mass', 'length', 'time'],
  },
];

// Step 4 Board MCQs (Class 9-10 Physics Chapter 1)
const PHYSICS_BOARD_MCQS = [
  {
    id: 1,
    board: 'ঢাকা বোর্ড ২০২৪',
    question: 'নিচের কোনটি আন্তর্জাতিক পদ্ধতির (SI) মৌলিক রাশি?',
    options: [
      { id: 1, text: 'বল (Force)', isCorrect: false },
      { id: 2, text: 'তড়িৎপ্রবাহ (Electric Current)', isCorrect: true },
      { id: 3, text: 'চাপ (Pressure)', isCorrect: false },
      { id: 4, text: 'কাজ (Work)', isCorrect: false },
    ],
    explanation: 'এসআই পদ্ধতিতে ৭টি মৌলিক রাশি হলো: দৈর্ঘ্য, ভর, সময়, তাপমাত্রা, তড়িৎপ্রবাহ, দীপন তীব্রতা ও পদার্থের পরিমাণ। বল, চাপ ও কাজ হলো লব্ধ রাশি।',
  },
  {
    id: 2,
    board: 'রাজশাহী বোর্ড ২০২৩',
    question: 'একটি স্লাইড ক্যালিপার্সের প্রধান স্কেলের ১৯ ভাগ ভার্নিয়ার স্কেলের ২০ ভাগের সমান। প্রধান স্কেলের ১ ক্ষুদ্রতম ভাগের মান ১ মিমি হলে ভার্নিয়ার ধ্রুবক (VC) কত?',
    options: [
      { id: 1, text: '0.1 mm', isCorrect: false },
      { id: 2, text: '0.05 mm', isCorrect: true },
      { id: 3, text: '0.01 mm', isCorrect: false },
      { id: 4, text: '0.02 mm', isCorrect: false },
    ],
    explanation: 'ভার্নিয়ার ধ্রুবক $VC = \\frac{s}{n} = \\frac{1\\text{ mm}}{20} = 0.05\\text{ mm} = 0.005\\text{ cm}$।',
  },
  {
    id: 3,
    board: 'চট্টগ্রাম বোর্ড ২০২৩',
    question: 'কাজের (Work) মাত্রা সমীকরণ কোনটি?',
    options: [
      { id: 1, text: '[MLT⁻¹]', isCorrect: false },
      { id: 2, text: '[MLT⁻²]', isCorrect: false },
      { id: 3, text: '[ML²T⁻²]', isCorrect: true },
      { id: 4, text: '[ML²T⁻³]', isCorrect: false },
    ],
    explanation: 'কাজ = বল × সরণ = $[MLT^{-2}] \\times [L] = [ML^2T^{-2}]$। $[MLT^{-2}]$ হলো বলের মাত্রা এবং $[ML^2T^{-3}]$ হলো ক্ষমতার মাত্রা।',
  },
  {
    id: 4,
    board: 'দিনাজপুর বোর্ড ২০২২',
    question: 'স্ক্রু গজের বৃত্তাকার স্কেলের ০ (শূন্য) দাগ যদি রৈখিক স্কেলের রেফারেন্স দাগের নিচে অবস্থান করে, তবে যান্ত্রিক ত্রুটি কেমন হবে?',
    options: [
      { id: 1, text: 'ধনাত্মক (+ve)', isCorrect: true },
      { id: 2, text: 'ঋণাত্মক (-ve)', isCorrect: false },
      { id: 3, text: 'কোনো ত্রুটি নেই', isCorrect: false },
      { id: 4, text: 'অনন্ত ত্রুটি', isCorrect: false },
    ],
    explanation: 'শূন্য দাগ রেফারেন্স রেখার নিচে থাকলে অতিরিক্ত পাঠ দেখায়, একে ধনাত্মক ত্রুটি (+ve error) বলে। পাঠ সংশোধনে এই ত্রুটি মূল পাঠ থেকে বিয়োগ করতে হয়।',
  },
  {
    id: 5,
    board: 'কুমিল্লা বোর্ড ২০২১',
    question: 'একটি ঘনকের এক বাহুর পরিমাপে ৪% ত্রুটি হলে, এর আয়তন পরিমাপে শতকরা কত ত্রুটি হবে?',
    options: [
      { id: 1, text: '৪%', isCorrect: false },
      { id: 2, text: '৮%', isCorrect: false },
      { id: 3, text: '১২% (প্রায় ১২.৪৯%)', isCorrect: true },
      { id: 4, text: '১৬%', isCorrect: false },
    ],
    explanation: 'ঘনকের আয়তন $V = a^3$। সূচকের নিয়মে শতকরা ত্রুটি $\\frac{\\Delta V}{V} \\approx 3 \\times \\frac{\\Delta a}{a} = 3 \\times 4\\% = 12\\%$ (বা সঠিক বিস্তার $(1.04)^3 - 1 = 12.49\\%$)।',
  },
];

export function PhysicsMeasurementGuidebook() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Navigation State
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);

  // Vernier Simulator Interactive State (Lesson 2 & Step 3)
  const [vernierPositionMm, setVernierPositionMm] = useState<number>(14.6); // 14.6 mm = 1.46 cm
  const [vernierZeroError, setVernierZeroError] = useState<number>(0.0); // in mm
  const [measuredObject, setMeasuredObject] = useState<'cylinder' | 'sphere' | 'wire' | 'custom'>('cylinder');

  // Screw Gauge Simulator Interactive State (Lesson 3 & Step 3)
  const [screwGaugeLinearMm, setScrewGaugeLinearMm] = useState<number>(3.0); // 3 mm
  const [screwGaugeCircularDiv, setScrewGaugeCircularDiv] = useState<number>(45); // 45 divisions
  const [screwGaugePitch] = useState<number>(1.0); // 1 mm pitch
  const [screwGaugeTotalDivs] = useState<number>(100); // 100 circular divisions
  const [screwZeroError, setScrewZeroError] = useState<number>(0.0); // in mm

  // Dimensional Homogeneity State (Lesson 4)
  const [selectedEquation, setSelectedEquation] = useState<string>('motion_1');

  // Cube & Sphere Percentage Error Simulator (Lesson 5)
  const [sideErrorPercent, setSideErrorPercent] = useState<number>(5); // 5%

  // Step 2 Example Tab State
  const [selectedExampleTab, setSelectedExampleTab] = useState<number>(1);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // Step 3 Practice Lab State
  // Task 1: Vernier Detective
  const [vernierGuessM, setVernierGuessM] = useState<string>('');
  const [vernierGuessV, setVernierGuessV] = useState<string>('');
  const [vernierGuessFeedback, setVernierGuessFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Task 2: Dimension Matcher
  const [selectedDimQuantity, setSelectedDimQuantity] = useState<string>('force');
  const [userDimAnswer, setUserDimAnswer] = useState<string>('');
  const [dimFeedback, setDimFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Task 3: Error Calculator
  const [radiusErrorInput, setRadiusErrorInput] = useState<string>('3');
  const [volumeErrorGuess, setVolumeErrorGuess] = useState<string>('');
  const [errorFeedback, setErrorFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Step 4 Board Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Step 5 Summary State
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [isChapterFinished, setIsChapterFinished] = useState<boolean>(false);

  // AI Tutor State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: 'স্বাগতম পদার্থবিজ্ঞানের পরিমাপ ল্যাবে! ভার্নিয়ার ক্যালিউপার্স, স্ক্রু গজ, মাত্রা সমীকরণ বা ত্রুটি বিশ্লেষণ নিয়ে যেকোনো প্রশ্ন করো। আমি ধাপে ধাপে বুঝিয়ে দেবো!',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Load progress from backend
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch('/api/playground/progress?chapter=1&subject=physics');
        if (res.ok) {
          const data = await res.json();
          if (data.progress?.completedLessons) {
            setCompletedLessons(data.progress.completedLessons);
          }
        }
      } catch (err) {
        console.error('Failed to load physics progress:', err);
      }
    }
    loadProgress();
  }, []);

  // Save progress
  const saveProgressToBackend = async (newCompleted: number[]) => {
    try {
      await fetch('/api/playground/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: 1,
          subject: 'physics',
          completedLessons: newCompleted,
          currentLesson: activeLesson,
        }),
      });
    } catch (err) {
      console.error('Failed to save physics progress:', err);
    }
  };

  // Vernier calculations
  const vernierMainScaleMm = Math.floor(vernierPositionMm);
  const vernierFractionMm = vernierPositionMm - vernierMainScaleMm;
  const vernierCoincidence = Math.round(vernierFractionMm * 10); // 0.1 mm per division
  const vernierConstantMm = 0.1; // 1 mm / 10 = 0.1 mm = 0.01 cm
  const vernierTotalMeasuredMm = Number((vernierMainScaleMm + vernierCoincidence * vernierConstantMm).toFixed(2));
  const vernierCorrectedMm = Number((vernierTotalMeasuredMm - vernierZeroError).toFixed(2));

  // Screw gauge calculations
  const screwLeastCountMm = screwGaugePitch / screwGaugeTotalDivs; // 1 / 100 = 0.01 mm
  const screwTotalMeasuredMm = Number((screwGaugeLinearMm + screwGaugeCircularDiv * screwLeastCountMm).toFixed(2));
  const screwCorrectedMm = Number((screwTotalMeasuredMm - screwZeroError).toFixed(2));
  const wireDiameterMm = screwCorrectedMm;
  const wireCrossSectionAreaMm2 = Number(((Math.PI * Math.pow(wireDiameterMm, 2)) / 4).toFixed(4));

  // Cube error calculations
  const approxAreaError = sideErrorPercent * 2;
  const exactAreaError = Number(((Math.pow(1 + sideErrorPercent / 100, 2) - 1) * 100).toFixed(2));
  const approxVolumeError = sideErrorPercent * 3;
  const exactVolumeError = Number(((Math.pow(1 + sideErrorPercent / 100, 3) - 1) * 100).toFixed(2));

  // AI Chat handler
  const handleSendAiMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userQuery = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userQuery,
          subject: 'physics',
          chapter: '1 - ভৌত রাশি ও পরিমাপ',
          context: `বর্তমান পাঠ: ${activeLesson}, ধাপ: ${activeStep}, ভার্নিয়ার পাঠ: ${vernierCorrectedMm} mm, স্ক্রু গজ পাঠ: ${screwCorrectedMm} mm`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: data.response || data.message || 'উত্তর তৈরি করতে পেরেছি!',
          },
        ]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      // High-quality contextual fallback
      setTimeout(() => {
        let fallback = 'ভার্নিয়ার ধ্রুবক $VC = s/n$ দিয়ে নির্ণয় করতে হয়। প্রধান স্কেলের ক্ষুদ্রতম ১ ভাগের মানকে ভার্নিয়ার স্কেলের মোট ভাগ সংখ্যা দিয়ে ভাগ করলেই $VC$ পাওয়া যায়।';
        if (userQuery.includes('ত্রুটি') || userQuery.includes('error')) {
          fallback = 'যান্ত্রিক ত্রুটি সবসময় মূল পাঠ থেকে বিয়োগ করতে হয়! সূত্র: $L = M + (V \\times VC) - (\\pm e)$। যদি ধনাত্মক ত্রুটি হয় তবে বিয়োগ হবে, আর ঋণাত্মক হলে মাইনাসে মাইনাসে যোগ হবে।';
        } else if (userQuery.includes('মাত্রা') || userQuery.includes('dimension')) {
          fallback = 'বলের মাত্রা $[F] = [MLT^{-2}]$ এবং কাজের মাত্রা $[W] = [ML^2T^{-2}]$। উভয় পাশের মাত্রা সমান হলে সমীকরণটি মাত্রাগতভাবে সঠিক (Homogeneous)।';
        } else if (userQuery.includes('ঘনক') || userQuery.includes('cube') || userQuery.includes('শতকরা')) {
          fallback = 'ঘনকের আয়তন $V = a^3$ হওয়ায় ঘাত ৩ সামনে চলে আসে। তাই বাহুর পরিমাপে $x\\%$ ত্রুটি থাকলে আয়তনে প্রায় $3x\\%$ ত্রুটি হবে!';
        }
        setChatMessages((prev) => [...prev, { role: 'ai', text: fallback }]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Step 3 Task 1 Verification
  const handleVerifyVernierTask = () => {
    const m = parseFloat(vernierGuessM);
    const v = parseInt(vernierGuessV);
    if (m === 2.3 && v === 4) {
      setVernierGuessFeedback({
        isCorrect: true,
        text: 'একদম সঠিক! প্রধান স্কেল পাঠ M = 2.3 cm এবং সমাপতন দাগ V = 4। সুতরাং মোট পাঠ = 2.3 + (4 × 0.01) = 2.34 cm।',
      });
    } else {
      setVernierGuessFeedback({
        isCorrect: false,
        text: 'হয়নি! ভার্নিয়ারের ০ দাগটি প্রধান স্কেলের ২.৩ সেমির পরে আছে (M = 2.3 cm), এবং ৪ নম্বর দাগটি প্রধান স্কেলের সাথে পুরোপুরি মিলে গেছে (V = 4)।',
      });
    }
  };

  // Step 3 Task 2 Verification
  const handleVerifyDimTask = () => {
    const correctDims: Record<string, string> = {
      force: '[MLT⁻²]',
      work: '[ML²T⁻²]',
      power: '[ML²T⁻³]',
      acceleration: '[LT⁻²]',
    };
    if (userDimAnswer.trim() === correctDims[selectedDimQuantity]) {
      setDimFeedback({
        isCorrect: true,
        text: `অসাধারণ! ${selectedDimQuantity === 'force' ? 'বল' : selectedDimQuantity === 'work' ? 'কাজ' : selectedDimQuantity === 'power' ? 'ক্ষমতা' : 'ত্বরণ'} এর সঠিক মাত্রা হলো ${userDimAnswer}।`,
      });
    } else {
      setDimFeedback({
        isCorrect: false,
        text: `হয়নি! সঠিক মাত্রা হলো ${correctDims[selectedDimQuantity]}। মৌলিক রাশির ঘাতের সমন্বয় লক্ষ্য করো।`,
      });
    }
  };

  // Step 3 Task 3 Verification
  const handleVerifyErrorTask = () => {
    const rErr = parseFloat(radiusErrorInput) || 3;
    const guess = parseFloat(volumeErrorGuess);
    const approx = rErr * 3;
    if (Math.abs(guess - approx) <= 0.5) {
      setErrorFeedback({
        isCorrect: true,
        text: `দুর্দান্ত! গোলকের আয়তন V = (4/3)πr³ হওয়ায় ঘাত ৩ গুণ হয়ে ত্রুটি প্রায় ৩ × ${rErr}% = ${approx}% (প্রকৃত বিস্তার: ${((Math.pow(1 + rErr / 100, 3) - 1) * 100).toFixed(2)}%)।`,
      });
    } else {
      setErrorFeedback({
        isCorrect: false,
        text: `হয়নি! সূত্র প্রয়োগ করো: আয়তনে ব্যাসার্ধের ঘাত ৩। তাই শতকরা ত্রুটি ≈ ৩ × ব্যাসার্ধের ত্রুটি (${rErr}%) = ${approx}%।`,
      });
    }
  };

  // Step 4 Board Quiz Handlers
  const handleSelectQuiz = (qId: number, optId: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    PHYSICS_BOARD_MCQS.forEach((q) => {
      const selected = quizAnswers[q.id];
      const opt = q.options.find((o) => o.id === selected);
      if (opt?.isCorrect) score += 1;
    });
    return score;
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    if (!completedLessons.includes(5)) {
      const updated = [...completedLessons, 5];
      setCompletedLessons(updated);
      await saveProgressToBackend(updated);
    }
  };

  // Step 5 Copy Study Notes
  const handleCopySummary = () => {
    const notes = `SSC পদার্থবিজ্ঞান অধ্যায় ১: ভৌত রাশি ও পরিমাপ (রিভিশন হ্যান্ডনোট)
--------------------------------------------------
১. মৌলিক রাশি (৭টি):
   - দৈর্ঘ্য (m), ভর (kg), সময় (s), তাপমাত্রা (K), তড়িৎপ্রবাহ (A), দীপন তীব্রতা (cd), পদার্থের পরিমাণ (mol)।

২. ভার্নিয়ার ক্যালিউপার্স সূত্র:
   - ভার্নিয়ার ধ্রুবক: VC = s / n (e.g. 1 mm / 10 = 0.1 mm = 0.01 cm)
   - মোট পাঠ: L = M + (V × VC) - (±e)
   - ধনাত্মক ত্রুটি (+ve) বিয়োগ হয়, ঋণাত্মক ত্রুটি (-ve) যোগ হয়।

৩. স্ক্রু গজ সূত্র:
   - পিচ (Pitch) = ১ ঘূর্ণনে রৈখিক স্কেলের সরণ
   - লঘিষ্ঠ গণন: LC = Pitch / n (e.g. 1 mm / 100 = 0.01 mm = 0.001 cm)
   - ব্যাস: D = L + (C × LC) - (±e)
   - তারের প্রস্থচ্ছেদের ক্ষেত্রফল: A = πD² / 4

৪. গুরুত্বপূর্ণ মাত্রা সমীকরণ:
   - বেগ [v] = [LT⁻¹]
   - ত্বরণ [a] = [LT⁻²]
   - বল [F] = [MLT⁻²]
   - কাজ [W] = [ML²T⁻²]
   - ক্ষমতা [P] = [ML²T⁻³]
   - চাপ [P] = [ML⁻¹T⁻²]

৫. পরিমাপে শতকরা ত্রুটির বোর্ড ট্র্যাপ:
   - ঘনকের বাহুর ত্রুটি x% হলে:
     * ক্ষেত্রফলের ত্রুটি ≈ 2x%
     * আয়তনের ত্রুটি ≈ 3x%
--------------------------------------------------
শেরাটুটোর ভার্চুয়াল গাইডবুক (SheraTutor.com)`;

    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Lesson Metadata
  const LESSONS_META: Record<number, {
    no: string;
    titleBn: string;
    titleEn: string;
    overviewBn: string;
    studyTip: string;
  }> = {
    1: {
      no: '০১',
      titleBn: 'পরিমাপ ও ৭টি মৌলিক রাশি',
      titleEn: 'Measurement & 7 Fundamental SI Units',
      overviewBn: 'এসআই পদ্ধতির ৭টি মৌলিক রাশি, একক ও প্রতীক চেনা এবং কীভাবে মৌলিক রাশিগুলো মিলে বেগ, বল ও কাজের মতো লব্ধ রাশি তৈরি করে।',
      studyTip: 'বোর্ড পরীক্ষায় মৌলিক রাশির এসআই একক ও সংজ্ঞায়িত ধ্রুবক প্রায়ই বহুনির্বাচনীতে আসে!',
    },
    2: {
      no: '০২',
      titleBn: 'ভার্নিয়ার ক্যালিউপার্স সিমুলেটর',
      titleEn: 'Vernier Calipers Interactive Simulator',
      overviewBn: 'প্রধান স্কেল (M), ভার্নিয়ার সমপাতন (V), ভার্নিয়ার ধ্রুবক (VC) এবং ধনাত্মক ও ঋণাত্মক যান্ত্রিক ত্রুটি সংশোধনের লাইভ ইন্টারঅ্যাকশন।',
      studyTip: 'VC এর সাথে একক (cm বা mm) না লিখলে এবং ধনাত্মক ত্রুটি বিয়োগের বদলে যোগ করলে ১ নম্বর কাটা যায়!',
    },
    3: {
      no: '০৩',
      titleBn: 'স্ক্রু গজ ও সূক্ষ্ম পরিমাপ ল্যাব',
      titleEn: 'Screw Gauge & Micrometer Lab',
      overviewBn: 'পিচ ও লঘিষ্ঠ গণন (LC) নির্ণয়, রৈখিক ও বৃত্তাকার স্কেল পাঠ থেকে তারের ব্যাস ও প্রস্থচ্ছেদের ক্ষেত্রফল বের করার সম্পূর্ণ পদ্ধতি।',
      studyTip: 'তারের ক্ষেত্রফল নির্ণয়ে ব্যাসার্ধের বদলে সরাসরি A = πD²/4 ব্যবহার করলে দশমিকের আসন্নমান ভুল হয় না!',
    },
    4: {
      no: '০৪',
      titleBn: 'মাত্রা বিশ্লেষণ ও সমীকরণ গোয়েন্দা',
      titleEn: 'Dimensional Analysis & Homogeneity',
      overviewBn: 'বেগ, ত্বরণ, বল, কাজ ও ক্ষমতার মাত্রা সমীকরণ গঠন এবং s = ut + ½at² সমীকরণের উভয়পাশের মাত্রাগত সমতা (Homogeneity) পরীক্ষা।',
      studyTip: 'যেকোনো সঠিক সমীকরণের প্রতিটি পদের মাত্রা অভিন্ন হতে হবে; ধ্রুবকের (যেমন ½) কোনো মাত্রা নেই!',
    },
    5: {
      no: '০৫',
      titleBn: 'ত্রুটির বিস্তার ও ঘনক/গোলক ল্যাব',
      titleEn: 'Error Analysis & Cube Volume Trap',
      overviewBn: 'পরম ও আপেক্ষিক ত্রুটি থেকে শতকরা ত্রুটি নির্ণয় এবং এসএসসি বোর্ডের সবচেয়ে বহুল আলোচিত ঘনক ও গোলকের আয়তনে ত্রুটির বিস্তার।',
      studyTip: 'বাহুর ত্রুটি ৫% হলে আয়তনে ত্রুটি ৩ × ৫% = ১৫%; বোর্ড পরীক্ষায় এই গুণিতক নিয়মই বহুনির্বাচনীর মূল শর্টকাট!',
    },
  };

  const currentLessonMeta = LESSONS_META[activeLesson] || LESSONS_META[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-[#FF6B57]/20">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="physics"
        subjectNameBn="পদার্থবিজ্ঞান"
        chapterNum={1}
        chapterTitleBn="ভৌত রাশি ও পরিমাপ (Physical Quantities & Measurement)"
        activeLesson={activeLesson}
        activeLessonTitle={LESSONS_META[activeLesson]?.titleBn}
        isSidebarOpen={isLeftSidebarOpen}
        onToggleSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onOpenAi={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto p-3 sm:p-4 lg:p-6 gap-5 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT SIDEBAR (Hideable Chapter Rail & Resources) */}
        {/* ========================================================= */}
        {isLeftSidebarOpen && (
          <aside className="w-64 sm:w-72 shrink-0 space-y-4 animate-in fade-in duration-200">
            {/* Subject Selector Pill Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">শ্রেণি ও বিষয়</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <Gauge className="h-4 w-4 text-[#FF6B57]" />
                <div>
                  <div className="text-foreground">Class 9–10 (SSC)</div>
                  <div className="text-[10px] text-muted-foreground font-normal">পদার্থবিজ্ঞান (Physics)</div>
                </div>
              </div>
            </div>

            {/* Chapter Progress & Lessons Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-[#FF6B57] uppercase tracking-wide">CHAPTER 1</span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-base font-black text-foreground font-heading">
                  ভৌত রাশি ও পরিমাপ
                </h2>
                <div className="text-[11px] text-muted-foreground">Physical Quantities & Measurement</div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B57] to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                <span>{completedLessons.length} / ৫টি পাঠ সম্পন্ন</span>
                <span className="font-bold text-foreground">১০ নম্বর নিশ্চিত</span>
              </div>

              {/* 5 Lessons List */}
              <div className="space-y-1.5 pt-1">
                {[
                  { id: 1, no: '০১', titleBn: 'পরিমাপ ও মৌলিক রাশি', titleEn: '7 Fundamental SI Units' },
                  { id: 2, no: '০২', titleBn: 'ভার্নিয়ার ক্যালিউপার্স', titleEn: 'Vernier Calipers Lab' },
                  { id: 3, no: '০৩', titleBn: 'স্ক্রু গজ ও সূক্ষ্ম পরিমাপ', titleEn: 'Screw Gauge Lab' },
                  { id: 4, no: '০৪', titleBn: 'মাত্রা সমীকরণ গোয়েন্দা', titleEn: 'Dimensional Analysis' },
                  { id: 5, no: '০৫', titleBn: 'ত্রুটির বিস্তার ও ঘনক ল্যাব', titleEn: 'Error Propagation Lab' },
                ].map((item) => {
                  const isActive = activeLesson === item.id;
                  const isDone = completedLessons.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveLesson(item.id);
                        if (item.id === 1) setActiveStep('concept');
                        else if (item.id === 2) { setActiveStep('concept'); }
                        else if (item.id === 3) { setActiveStep('concept'); }
                        else if (item.id === 4) { setActiveStep('concept'); }
                        else if (item.id === 5) { setActiveStep('check'); }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'bg-[#FFF1EE] dark:bg-[#FF6B57]/15 border border-[#FF6B57]/30 text-foreground shadow-xs'
                          : 'bg-card hover:bg-muted/50 border border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
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
                          <div className={`text-xs font-black ${isActive ? 'text-[#FF6B57]' : 'text-foreground'}`}>
                            {item.titleBn}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{item.titleEn}</div>
                        </div>
                      </div>

                      {isActive ? (
                        <div className="h-6 w-6 rounded-full bg-[#FF6B57] text-white flex items-center justify-center shrink-0">
                          <Play className="h-3 w-3 fill-white ml-0.5" />
                        </div>
                      ) : isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
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
                  <span className="text-emerald-500">📋</span>
                  <span>Board Questions (Past 10 yrs)</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER WORKSPACE (Interactive Stage & 5 Steps)  */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Top Lesson Header Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-xs">
            <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 via-amber-500/5 to-transparent pointer-events-none" />

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
                <span>পদার্থবিজ্ঞান অধ্যায় ১: ৫টি সম্পূর্ণ ধাপ</span>
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
              {/* LESSON 1: 7 SI FUNDAMENTAL UNITS & DERIVED CONSTRUCTOR */}
              {activeLesson === 1 && (
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                        ১. ধারণা · ৭টি মৌলিক রাশি ও এসআই একক মানচিত্র
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        যেসব রাশি স্বাধীন ও নিরপেক্ষ এবং যাদের ওপর অন্য রাশি নির্ভর করে
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      SI Base Units (7)
                    </span>
                  </div>

                  {/* 7 Fundamental SI Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {FUNDAMENTAL_QUANTITIES.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-muted/20 border border-border/80 hover:border-primary/50 transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-foreground">{q.nameBn}</span>
                          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                            {q.dimension}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-lg font-black text-[#FF6B57]">{q.symbol}</span>
                          <span className="text-xs text-muted-foreground font-medium">({q.unitBn} / {q.unitEn})</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {q.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Derived Unit Constructor */}
                  <div className="rounded-2xl border border-border/80 bg-muted/30 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>লব্ধ রাশি গঠন ল্যাব (Derived Quantities Explorer)</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">মৌলিক রাশি থেকে লব্ধ রাশি</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {DERIVED_QUANTITIES.map((d) => (
                        <div key={d.id} className="p-3.5 rounded-xl bg-card border border-border space-y-2">
                          <div className="font-bold text-xs text-foreground">{d.nameBn}</div>
                          <div className="text-[11px] text-muted-foreground">
                            সূত্র: <span className="font-semibold text-foreground">{d.formulaBn}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-border/60 text-xs">
                            <span className="font-mono font-bold text-[#FF6B57]">{d.unit}</span>
                            <span className="font-mono font-bold text-primary">{d.dimension}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 2: VERNIER CALIPERS INTERACTIVE SIMULATOR */}
              {activeLesson === 2 && (
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                        ২. ধারণা · ভার্নিয়ার ক্যালিউপার্স লাইভ সিমুলেটর (Vernier Calipers)
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        স্লাইডার টেনে চোয়াল সরান ও রিয়েল টাইমে ভার্নিয়ার পাঠ ও সমপাতন পর্যবেক্ষণ করুন
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        VC = 0.1 mm (0.01 cm)
                      </span>
                    </div>
                  </div>

                  {/* Vernier Calipers Visual Canvas (Realistic SVG) */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-5 overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>প্রধান স্কেল (Main Scale in cm/mm)</span>
                      <span className="font-mono text-amber-400">ভার্নিয়ার চোয়াল পাঠ: {vernierCorrectedMm} mm</span>
                    </div>

                    {/* SVG Caliper Display */}
                    <div className="w-full overflow-x-auto py-2">
                      <svg viewBox="0 0 600 140" className="w-full min-w-[550px] select-none">
                        {/* Main Beam */}
                        <rect x="20" y="20" width="560" height="40" fill="#334155" stroke="#475569" strokeWidth="2" rx="4" />
                        {/* Fixed Jaw (Left) */}
                        <path d="M 20 20 L 20 120 L 50 120 L 50 60 L 60 60 L 60 20 Z" fill="#475569" />

                        {/* Main Scale Ticks (0 to 5 cm with mm marks) */}
                        {Array.from({ length: 51 }).map((_, i) => {
                          const x = 70 + i * 9.5;
                          const isCm = i % 10 === 0;
                          const isHalf = i % 5 === 0 && !isCm;
                          return (
                            <g key={i}>
                              <line
                                x1={x}
                                y1="60"
                                x2={x}
                                y2={isCm ? '35' : isHalf ? '45' : '50'}
                                stroke="#cbd5e1"
                                strokeWidth={isCm ? '1.5' : '0.8'}
                              />
                              {isCm && (
                                <text x={x} y="30" fill="#f8fafc" fontSize="9" textAnchor="middle" fontFamily="monospace">
                                  {i / 10}
                                </text>
                              )}
                            </g>
                          );
                        })}

                        {/* Sliding Vernier Jaws & Scale */}
                        {/* Sliding Position X */}
                        {(() => {
                          const slideX = 70 + vernierPositionMm * 9.5;
                          return (
                            <g transform={`translate(${slideX - 70}, 0)`}>
                              {/* Sliding Jaw */}
                              <path d="M 70 20 L 70 120 L 40 120 L 40 60 L 70 60 Z" fill="#64748b" opacity="0.9" />
                              {/* Vernier Plate */}
                              <rect x="70" y="55" width="105" height="35" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
                              {/* Vernier Scale Ticks (10 divisions spanning 9 main divisions = 0.9 * 9.5) */}
                              {Array.from({ length: 11 }).map((_, vi) => {
                                const vx = 70 + vi * (9 * 9.5 / 10);
                                const isCoinciding = vi === vernierCoincidence;
                                return (
                                  <g key={vi}>
                                    <line
                                      x1={vx}
                                      y1="55"
                                      x2={vx}
                                      y2="72"
                                      stroke={isCoinciding ? '#f43f5e' : '#38bdf8'}
                                      strokeWidth={isCoinciding ? '2.5' : '1'}
                                    />
                                    <text
                                      x={vx}
                                      y="83"
                                      fill={isCoinciding ? '#f43f5e' : '#94a3b8'}
                                      fontSize="8"
                                      textAnchor="middle"
                                      fontFamily="monospace"
                                      fontWeight={isCoinciding ? 'bold' : 'normal'}
                                    >
                                      {vi}
                                    </text>
                                  </g>
                                );
                              })}
                              {/* Coincidence Pointer */}
                              <circle cx={70 + vernierCoincidence * (9 * 9.5 / 10)} cy="50" r="3" fill="#f43f5e" />
                            </g>
                          );
                        })()}

                        {/* Clamped Object (Between jaws) */}
                        <rect
                          x="50"
                          y="65"
                          width={Math.max(5, vernierPositionMm * 9.5)}
                          height="45"
                          fill="#f59e0b"
                          rx="4"
                          opacity="0.8"
                        />
                        <text
                          x={50 + (vernierPositionMm * 9.5) / 2}
                          y="92"
                          fill="#1e293b"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          বস্তু
                        </text>
                      </svg>
                    </div>

                    {/* Interactive Slider & Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">ভার্নিয়ার অবস্থান নিয়ন্ত্রণ (Move Caliper):</span>
                          <span className="font-mono text-amber-400 font-bold">{vernierPositionMm.toFixed(1)} mm ({ (vernierPositionMm / 10).toFixed(2) } cm)</span>
                        </div>
                        <input
                          type="range"
                          min="2.0"
                          max="35.0"
                          step="0.1"
                          value={vernierPositionMm}
                          onChange={(e) => setVernierPositionMm(parseFloat(e.target.value))}
                          className="w-full accent-[#FF6B57] h-2 bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">যান্ত্রিক ত্রুটি নির্বাচন (Zero Error e):</span>
                          <span className="font-mono text-rose-400 font-bold">
                            {vernierZeroError > 0 ? `+${vernierZeroError} mm` : `${vernierZeroError} mm`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {[
                            { label: 'ত্রুটিহীন (0 mm)', val: 0.0 },
                            { label: 'ধনাত্মক (+0.2 mm)', val: 0.2 },
                            { label: 'ঋণাত্মক (-0.2 mm)', val: -0.2 },
                          ].map((errOption) => (
                            <button
                              key={errOption.label}
                              onClick={() => setVernierZeroError(errOption.val)}
                              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                                vernierZeroError === errOption.val
                                  ? 'bg-[#FF6B57] text-white border-[#FF6B57]'
                                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                              }`}
                            >
                              {errOption.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Math Formula Readout Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Ruler className="h-4 w-4" />
                        <span>লাইভ গাণিতিক হিসাব (Live Calculation Breakdown):</span>
                      </div>
                      <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">
                        L = M + (V × VC) - (±e)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <div className="text-muted-foreground text-[10px]">প্রধান স্কেল পাঠ (M):</div>
                        <div className="font-mono text-sm font-black text-foreground">{vernierMainScaleMm} mm ({ (vernierMainScaleMm / 10).toFixed(2) } cm)</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <div className="text-muted-foreground text-[10px]">ভার্নিয়ার সমপাতন (V):</div>
                        <div className="font-mono text-sm font-black text-rose-500">{vernierCoincidence} নম্বর দাগ</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <div className="text-muted-foreground text-[10px]">ভার্নিয়ার ধ্রুবক (VC):</div>
                        <div className="font-mono text-sm font-black text-foreground">0.1 mm (0.01 cm)</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/80">
                        <div className="text-muted-foreground text-[10px]">সংশোধিত দৈর্ঘ্য (L):</div>
                        <div className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                          {vernierCorrectedMm} mm ({ (vernierCorrectedMm / 10).toFixed(2) } cm)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 3: SCREW GAUGE & MICROMETER LAB */}
              {activeLesson === 3 && (
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                        ৩. ধারণা · স্ক্রু গজ ও লঘিষ্ঠ গণন ল্যাব (Screw Gauge Lab)
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        রৈখিক স্কেল পাঠ (L) ও বৃত্তাকার স্কেল পাঠ (C) থেকে তারের ব্যাস ও ক্ষেত্রফল নির্ণয়
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      LC = Pitch / n = 0.01 mm
                    </span>
                  </div>

                  {/* Interactive Screw Gauge Visualizer */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>স্ক্রু গজ পাঠ (Screw Gauge Reading)</span>
                      <span className="font-mono text-amber-400 font-bold">তারের ব্যাস D = {screwCorrectedMm} mm</span>
                    </div>

                    {/* SVG Graphic */}
                    <div className="w-full overflow-x-auto py-2">
                      <svg viewBox="0 0 600 130" className="w-full min-w-[500px] select-none">
                        {/* U-shaped Frame */}
                        <path d="M 50 30 C 10 30, 10 100, 50 100 L 150 100 C 180 100, 180 30, 150 30 Z" fill="#1e293b" stroke="#475569" strokeWidth="4" />
                        {/* Anvil (Left Stud) */}
                        <rect x="140" y="55" width="20" height="20" fill="#94a3b8" />
                        {/* Spindle (Right Moving Stud) */}
                        <rect x={160 + screwCorrectedMm * 10} y="55" width="30" height="20" fill="#cbd5e1" />
                        {/* Measured Wire in Gap */}
                        <rect x="160" y="50" width={Math.max(2, screwCorrectedMm * 10)} height="30" fill="#f59e0b" rx="2" />

                        {/* Main Sleeve (Linear Scale) */}
                        <rect x="220" y="50" width="130" height="30" fill="#334155" stroke="#64748b" />
                        {/* Baseline */}
                        <line x1="220" y1="65" x2="350" y2="65" stroke="#f8fafc" strokeWidth="1.5" />
                        {/* Linear Scale Ticks */}
                        {Array.from({ length: 11 }).map((_, li) => {
                          const lx = 230 + li * 10;
                          return (
                            <g key={li}>
                              <line x1={lx} y1="65" x2={lx} y2="55" stroke="#e2e8f0" strokeWidth="1" />
                              <text x={lx} y="52" fill="#cbd5e1" fontSize="7" textAnchor="middle" fontFamily="monospace">
                                {li}
                              </text>
                            </g>
                          );
                        })}

                        {/* Rotating Thimble (Circular Scale) */}
                        <path
                          d={`M ${230 + screwGaugeLinearMm * 10} 40 L ${310 + screwGaugeLinearMm * 10} 40 L ${330 + screwGaugeLinearMm * 10} 90 L ${230 + screwGaugeLinearMm * 10} 90 Z`}
                          fill="#475569"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                        {/* Circular Marks */}
                        <line
                          x1={230 + screwGaugeLinearMm * 10}
                          y1="65"
                          x2={250 + screwGaugeLinearMm * 10}
                          y2="65"
                          stroke="#f43f5e"
                          strokeWidth="2"
                        />
                        <text
                          x={260 + screwGaugeLinearMm * 10}
                          y="68"
                          fill="#f43f5e"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {screwGaugeCircularDiv}
                        </text>
                      </svg>
                    </div>

                    {/* Interactive Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">রৈখিক স্কেল পাঠ L (Linear Scale):</span>
                          <span className="font-mono text-amber-400 font-bold">{screwGaugeLinearMm} mm</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="8"
                          step="1"
                          value={screwGaugeLinearMm}
                          onChange={(e) => setScrewGaugeLinearMm(parseInt(e.target.value))}
                          className="w-full accent-[#FF6B57] h-2 bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300">বৃত্তাকার স্কেল পাঠ C (Circular Scale):</span>
                          <span className="font-mono text-rose-400 font-bold">{screwGaugeCircularDiv} ভাগ</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="99"
                          step="1"
                          value={screwGaugeCircularDiv}
                          onChange={(e) => setScrewGaugeCircularDiv(parseInt(e.target.value))}
                          className="w-full accent-[#FF6B57] h-2 bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wire Diameter & Area Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span>তারের ব্যাস নির্ণয় (Diameter D):</span>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">D = L + (C × LC) - (±e)</div>
                      <div className="font-mono text-base font-black text-[#FF6B57]">
                        = {screwGaugeLinearMm} + ({screwGaugeCircularDiv} × 0.01) = {screwCorrectedMm} mm
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Gauge className="h-4 w-4 text-emerald-500" />
                        <span>প্রস্থচ্ছেদের ক্ষেত্রফল (Area A):</span>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">A = (π × D²) / 4</div>
                      <div className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                        = {wireCrossSectionAreaMm2} mm²
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 4: DIMENSIONAL ANALYSIS & HOMOGENEITY */}
              {activeLesson === 4 && (
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                        ৪. ধারণা · মাত্রা বিশ্লেষণ ও সমীকরণের শুদ্ধতা যাচাই
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        যেকোনো সঠিক সমীকরণের বামপক্ষ ও ডানপক্ষের মাত্রা সমান হতে হবে (Principle of Homogeneity)
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      [LHS] = [RHS]
                    </span>
                  </div>

                  {/* Interactive Equation Selector */}
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-foreground">সমীকরণ নির্বাচন করে শুদ্ধতা পরীক্ষা করো:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'motion_1', eq: 's = ut + ½at²', label: 'গতির ২য় সমীকরণ (সঠিক)', valid: true },
                        { id: 'motion_2', eq: 'v² = u² + 2as', label: 'গতির ৩য় সমীকরণ (সঠিক)', valid: true },
                        { id: 'motion_wrong', eq: 's = vt²', label: 'ভুল সমীকরণ (অশুদ্ধ)', valid: false },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedEquation(item.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            selectedEquation === item.id
                              ? 'bg-primary/10 border-primary text-foreground shadow-xs'
                              : 'bg-card border-border hover:bg-muted/50 text-muted-foreground'
                          }`}
                        >
                          <div className="font-mono font-black text-sm text-foreground">{item.eq}</div>
                          <div className="text-xs font-semibold mt-1 flex items-center gap-1.5">
                            {item.valid ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                            )}
                            <span>{item.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Step-by-step Dimensional Proof Box */}
                    <div className="p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
                      {selectedEquation === 'motion_1' && (
                        <div className="space-y-3 text-xs sm:text-sm">
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                            <span>$s = ut + \\frac{1}{2}at^2$ সমীকরণের মাত্রাগত বিশ্লেষণ:</span>
                          </div>
                          <div className="p-3 rounded-xl bg-card border border-border space-y-1 font-mono text-xs">
                            <div>• বামপক্ষের মাত্রা: $[s] = [L]$</div>
                            <div>• ১ম পদের মাত্রা: $[ut] = [LT^{-1}] \\times [T] = [L]$</div>
                            <div>• ২য় পদের মাত্রা: $[\frac{1}{2}at^2] = [LT^{-2}] \\times [T^2] = [L]$ (ধ্রুবক $\frac{1}{2}$ মাত্রাহীন)</div>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                            ✓ প্রতিটি পদের মাত্রা সমান $[L]$। সুতরাং সমীকরণটি মাত্রাগতভাবে সম্পূর্ণ শুদ্ধ!
                          </div>
                        </div>
                      )}

                      {selectedEquation === 'motion_2' && (
                        <div className="space-y-3 text-xs sm:text-sm">
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                            <span>$v^2 = u^2 + 2as$ সমীকরণের মাত্রাগত বিশ্লেষণ:</span>
                          </div>
                          <div className="p-3 rounded-xl bg-card border border-border space-y-1 font-mono text-xs">
                            <div>• বামপক্ষের মাত্রা: $[v^2] = [LT^{-1}]^2 = [L^2T^{-2}]$</div>
                            <div>• ১ম পদের মাত্রা: $[u^2] = [LT^{-1}]^2 = [L^2T^{-2}]$</div>
                            <div>• ২য় পদের মাত্রা: $[2as] = [LT^{-2}] \\times [L] = [L^2T^{-2}]$ (ধ্রুবক ২ মাত্রাহীন)</div>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                            ✓ সমীকরণের উভয়পক্ষের প্রতিটি পদের মাত্রা $[L^2T^{-2}]$। সুতরাং এটি মাত্রাগতভাবে সত্য।
                          </div>
                        </div>
                      )}

                      {selectedEquation === 'motion_wrong' && (
                        <div className="space-y-3 text-xs sm:text-sm">
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                            <span>$s = vt^2$ সমীকরণের ভুল বিশ্লেষণ:</span>
                          </div>
                          <div className="p-3 rounded-xl bg-card border border-border space-y-1 font-mono text-xs">
                            <div>• বামপক্ষের মাত্রা: $[s] = [L]$</div>
                            <div>• ডানপক্ষের মাত্রা: $[vt^2] = [LT^{-1}] \\times [T^2] = [LT]$</div>
                          </div>
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 font-bold text-xs">
                            ✕ অমিল! $[L] \\neq [LT]$। মাত্রা ভিন্ন হওয়ায় সমীকরণটি ভৌতিকভাবে সম্পূর্ণ ভুল!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 5: ERROR ANALYSIS & CUBE/SPHERE TRAP */}
              {activeLesson === 5 && (
                <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                        ৫. ধারণা · শতকরা ত্রুটি ও ঘনকের আয়তন ল্যাব (Error Propagation)
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        এসএসসি বোর্ডের সবচেয়ে কুখ্যাত প্রশ্ন: এক বাহুর পরিমাপের ত্রুটি কীভাবে আয়তনে ৩ গুণ প্রসারিত হয়!
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      ΔV / V ≈ 3 × (Δa / a)
                    </span>
                  </div>

                  {/* 3D-feel SVG Cube Visualizer with Error Envelope */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">ঘনকের ত্রুটি বিস্তার মডেল (Cube Error Envelope)</span>
                      <span className="font-mono text-[#FF6B57] font-bold">বাহুর ত্রুটি: ±{sideErrorPercent}%</span>
                    </div>

                    <div className="w-full flex justify-center py-4">
                      <svg viewBox="0 0 240 180" className="w-48 h-36 select-none">
                        {/* Outer Max Error Envelope */}
                        <path
                          d="M 50 140 L 130 140 L 180 90 L 100 90 Z"
                          fill="rgba(244, 63, 94, 0.15)"
                          stroke="#f43f5e"
                          strokeDasharray="3 3"
                        />
                        <path
                          d="M 50 60 L 130 60 L 130 140 L 50 140 Z"
                          fill="rgba(244, 63, 94, 0.1)"
                          stroke="#f43f5e"
                          strokeDasharray="3 3"
                        />
                        <path
                          d="M 50 60 L 100 10 L 180 10 L 130 60 Z"
                          fill="rgba(244, 63, 94, 0.2)"
                          stroke="#f43f5e"
                          strokeDasharray="3 3"
                        />

                        {/* Nominal Cube Base */}
                        <path d="M 60 130 L 120 130 L 160 90 L 100 90 Z" fill="#38bdf8" opacity="0.7" />
                        <path d="M 60 70 L 120 70 L 120 130 L 60 130 Z" fill="#0ea5e9" opacity="0.8" />
                        <path d="M 60 70 L 100 30 L 160 30 L 120 70 Z" fill="#7dd3fc" opacity="0.9" />
                      </svg>
                    </div>

                    {/* Error Slider */}
                    <div className="space-y-2 max-w-md mx-auto">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">বাহুর শতকরা ত্রুটি (Side Length Error):</span>
                        <span className="font-mono text-amber-400 font-bold">±{sideErrorPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={sideErrorPercent}
                        onChange={(e) => setSideErrorPercent(parseInt(e.target.value))}
                        className="w-full accent-[#FF6B57] h-2 bg-slate-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Comparison Cards: Area vs Volume Error */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="text-xs font-bold text-foreground flex items-center justify-between">
                        <span>১. পৃষ্ঠের ক্ষেত্রফলে শতকরা ত্রুটি (Area Error):</span>
                        <span className="font-mono text-primary font-black">A = 6a²</span>
                      </div>
                      <div className="text-xs text-muted-foreground">সূচকের নিয়ম: ঘাত ২ গুণ হয়।</div>
                      <div className="font-mono text-base font-black text-primary">
                        প্রায় {approxAreaError}% (প্রকৃত: {exactAreaError}%)
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="text-xs font-bold text-foreground flex items-center justify-between">
                        <span>২. আয়তনে শতকরা ত্রুটি (Volume Error):</span>
                        <span className="font-mono text-[#FF6B57] font-black">V = a³</span>
                      </div>
                      <div className="text-xs text-muted-foreground">বোর্ড ট্র্যাপ: ঘাত ৩ গুণ হয়।</div>
                      <div className="font-mono text-base font-black text-[#FF6B57]">
                        প্রায় {approxVolumeError}% (প্রকৃত: {exactVolumeError}%)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Universal Bottom Navigation Footer */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                <button
                  disabled={activeLesson === 1}
                  onClick={() => {
                    setActiveLesson((prev) => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground font-bold text-xs sm:text-sm shadow-2xs transition-all disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>পূর্ববর্তী পাঠ</span>
                </button>
                <button
                  onClick={() => {
                    setActiveStep('example');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
                >
                  <span>পরবর্তী ধাপ: See Example (উদাহরণ দেখি)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: SEE EXAMPLE (বোর্ড স্ট্যান্ডার্ড সমাধান ও রুব্রিক) */}
          {/* ========================================================= */}
          {activeStep === 'example' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                      ২. উদাহরণ দেখি · বোর্ড স্ট্যান্ডার্ড ধাপে ধাপে সমাধান
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      এসএসসি পরীক্ষার পূর্ণাঙ্গ সৃজনশীল প্রশ্ন ও পরীক্ষকের মার্কিং রুব্রিক
                    </p>
                  </div>

                  {/* 4 Example Tabs */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 overflow-x-auto">
                    {[
                      { id: 1, label: '১. ভার্নিয়ার পাঠ' },
                      { id: 2, label: '২. স্ক্রু গজ ক্ষেত্রফল' },
                      { id: 3, label: '৩. মাত্রা সমীকরণ' },
                      { id: 4, label: '৪. শতকরা ত্রুটি ট্র্যাপ' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedExampleTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          selectedExampleTab === tab.id
                            ? 'bg-[#FF6B57] text-white shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Example 1: Vernier Calipers */}
                {selectedExampleTab === 1 && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200">
                      <span className="font-bold">সৃজনশীল প্রশ্ন (গ বিভাগ):</span> একটি স্লাইড ক্যালিপার্স দিয়ে বেলনাকার দণ্ডের দৈর্ঘ্য মাপতে গিয়ে প্রধান স্কেল পাঠ পাওয়া গেল 4.2 cm, ভার্নিয়ার সমপাতন 7। যন্ত্রটির ভার্নিয়ার ধ্রুবক 0.01 cm এবং ধনাত্মক যান্ত্রিক ত্রুটি +0.02 cm। দণ্ডটির সঠিক দৈর্ঘ্য নির্ণয় করো।
                    </div>

                    <div className="space-y-3">
                      <div className="font-bold text-sm text-foreground">ধাপে ধাপে বোর্ড স্ট্যান্ডার্ড সমাধান:</div>
                      <div className="space-y-2.5 font-mono text-xs sm:text-sm">
                        <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                          <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">১</span>
                          <div>
                            <div className="text-muted-foreground text-xs font-sans">প্রদত্ত মানসমূহ:</div>
                            <div className="text-foreground">
                              <RenderMathText text="প্রধান স্কেল পাঠ $M = 4.2\\text{ cm}$, ভার্নিয়ার সমপাতন $V = 7$, ভার্নিয়ার ধ্রুবক $VC = 0.01\\text{ cm}$, যান্ত্রিক ত্রুটি $e = +0.02\\text{ cm}$" />
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                          <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">২</span>
                          <div>
                            <div className="text-muted-foreground text-xs font-sans">পরিমাপকৃত মোট পাঠ (Observed Reading):</div>
                            <div className="text-foreground">
                              <RenderMathText text="$L' = M + (V \\times VC) = 4.2 + (7 \\times 0.01) = 4.2 + 0.07 = 4.27\\text{ cm}$" />
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-card border border-border flex items-start gap-3">
                          <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center shrink-0">৩</span>
                          <div>
                            <div className="text-muted-foreground text-xs font-sans">প্রকৃত পাঠ (Corrected Reading with Zero Error):</div>
                            <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                              <RenderMathText text="$L = L' - (\\pm e) = 4.27 - (+0.02) = 4.25\\text{ cm}$ (বা $42.5\\text{ mm}$)" />
                            </div>
                          </div>
                        </div>
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
                          <span>পরীক্ষকের গোপন কথা: "কেন নম্বর কাটা যায়?" (Board Marking Rubric)</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isRubricOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isRubricOpen && (
                        <div className="p-4 pt-0 space-y-2.5 text-xs text-muted-foreground border-t border-border/60">
                          <div className="p-2.5 rounded-xl bg-card border border-border">
                            <span className="font-bold text-foreground">১ নম্বর ফাঁদ:</span> VC এর মান লেখার সময় একক (cm বা mm) বাদ দিলে সরাসরি ১ নম্বর কেটে নেওয়া হয়।
                          </div>
                          <div className="p-2.5 rounded-xl bg-card border border-border">
                            <span className="font-bold text-foreground">ত্রুটির চিহ্নে ভুল:</span> ধনাত্মক ত্রুটি হলে বিয়োগ করতে হবে। ছাত্র-ছাত্রীরা প্রায়ই ভুল করে যোগ করে ফেলে ($4.27 + 0.02 = 4.29$), যার ফলে পুরো ৩ বা ৪ নম্বর শূন্য হয়ে যায়!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Example 2: Screw Gauge Area */}
                {selectedExampleTab === 2 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <span className="font-bold">সৃজনশীল প্রশ্ন:</span> একটি স্ক্রু গজের পিচ 1 mm এবং বৃত্তাকার স্কেলের ভাগ সংখ্যা 100। একটি তার মেপে রৈখিক স্কেল পাঠ পাওয়া গেল 3 mm এবং বৃত্তাকার স্কেলের সমপাতন 45। তারটির প্রস্থচ্ছেদের ক্ষেত্রফল কত?
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="১. লঘিষ্ঠ গণন $LC = \\frac{\\text{Pitch}}{n} = \\frac{1\\text{ mm}}{100} = 0.01\\text{ mm}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="২. তারের ব্যাস $D = L + (C \\times LC) = 3 + (45 \\times 0.01) = 3.45\\text{ mm}$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="৩. প্রস্থচ্ছেদের ক্ষেত্রফল $A = \\frac{\\pi D^2}{4} = \\frac{3.1416 \\times (3.45)^2}{4} \\approx 9.348\\text{ mm}^2$" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Example 3: Dimensional Analysis */}
                {selectedExampleTab === 3 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <span className="font-bold">সৃজনশীল প্রশ্ন (খ বিভাগ):</span> দেখাও যে, কাজ এবং গতিশক্তির মাত্রা সমীকরণ একই।
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• কাজের মাত্রা: $\\text{কাজ} = \\text{বল} \\times \\text{সরণ} \\implies [W] = [MLT^{-2}] \\times [L] = [ML^2T^{-2}]$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• গতিশক্তির মাত্রা: $E_k = \\frac{1}{2}mv^2 \\implies [E_k] = [M] \\times [LT^{-1}]^2 = [ML^2T^{-2}]$ (ধ্রুবক $\\frac{1}{2}$ মাত্রাহীন)" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        ✓ যেহেতু $[W] = [E_k] = [ML^2T^{-2}]$, তাই কাজ ও শক্তির মাত্রা সম্পূর্ণ অভিন্ন। (প্রমাণিত)
                      </div>
                    </div>
                  </div>
                )}

                {/* Example 4: Percentage Error Trap */}
                {selectedExampleTab === 4 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-900 dark:text-amber-200">
                      <span className="font-bold">সৃজনশীল প্রশ্ন (ঘ বিভাগ):</span> একটি গোলকের ব্যাসার্ধ পরিমাপে 2% আপেক্ষিক ত্রুটি রয়েছে। এর আয়তন নির্ণয়ে শতকরা ত্রুটি কত হবে?
                    </div>

                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• গোলকের আয়তন $V = \\frac{4}{3}\\pi r^3$" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border">
                        <RenderMathText text="• আপেক্ষিক ত্রুটির বিস্তার নিয়ম: $\\frac{\\Delta V}{V} = 3 \\times \\frac{\\Delta r}{r}$ (ঘাত ৩ গুণ হয়)" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                        <RenderMathText text="• শতকরা ত্রুটি $= 3 \\times 2\\% = 6\\%$ (বোর্ড পরীক্ষার সম্পূর্ণ গ্রহণযোগ্য সঠিক উত্তর)।" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Universal Bottom Navigation Footer */}
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
                  <span>পরবর্তী ধাপ: Try Yourself (অনুশীলন ল্যাব)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: TRY YOURSELF (ইন্টারেক্টিভ প্র্যাকটিস ল্যাব)       */}
          {/* ========================================================= */}
          {activeStep === 'try' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                    ৩. নিজে করো · ইন্টারেক্টিভ ল্যাব (Interactive Practice Lab)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    ৩টি হ্যান্ডস-অন চ্যালেঞ্জ সমাধান করে বোর্ড পরীক্ষার জন্য নিজেকে প্রস্তুত করো
                  </p>
                </div>

                {/* Challenge 1: Vernier Reading Detective */}
                <div className="p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-card border text-primary">
                      চ্যালেঞ্জ ০১: ভার্নিয়ার গোয়েন্দা
                    </span>
                    <span className="text-xs text-muted-foreground">VC = 0.01 cm</span>
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-foreground">
                    একটি দণ্ড মাপতে গিয়ে দেখা গেল ভার্নিয়ারের শূন্য দাগটি প্রধান স্কেলের <span className="text-[#FF6B57] font-bold">2.3 cm</span> এর পরে এবং ভার্নিয়ারের <span className="text-[#FF6B57] font-bold">4 নম্বর দাগটি</span> প্রধান স্কেলের সাথে পুরোপুরি মিলে গেছে। পাঠগুলো ইনপুট করো:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground">প্রধান স্কেল পাঠ M (in cm):</label>
                      <input
                        type="text"
                        value={vernierGuessM}
                        onChange={(e) => setVernierGuessM(e.target.value)}
                        placeholder="যেমন: 2.3"
                        className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B57]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground">ভার্নিয়ার সমপাতন V (ভাগ সংখ্যা):</label>
                      <input
                        type="text"
                        value={vernierGuessV}
                        onChange={(e) => setVernierGuessV(e.target.value)}
                        placeholder="যেমন: 4"
                        className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B57]"
                      />
                    </div>
                  </div>

                  {vernierGuessFeedback && (
                    <div className={`p-3 rounded-xl text-xs font-semibold border ${
                      vernierGuessFeedback.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
                    }`}>
                      {vernierGuessFeedback.text}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyVernierTask}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
                  >
                    যাচাই করো
                  </button>
                </div>

                {/* Challenge 2: Dimension Matcher */}
                <div className="p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-card border text-emerald-600">
                      চ্যালেঞ্জ ০২: মাত্রার সঠিক রূপ
                    </span>
                    <span className="text-xs text-muted-foreground">Dimensional Matching</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-foreground">রাশি নির্বাচন করো:</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'force', label: 'বল (Force)' },
                        { id: 'work', label: 'কাজ (Work)' },
                        { id: 'power', label: 'ক্ষমতা (Power)' },
                        { id: 'acceleration', label: 'ত্বরণ (Acceleration)' },
                      ].map((q) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            setSelectedDimQuantity(q.id);
                            setUserDimAnswer('');
                            setDimFeedback(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            selectedDimQuantity === q.id
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-card text-muted-foreground border-border hover:bg-muted'
                          }`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-foreground">এর সঠিক মাত্রা সমীকরণ নির্বাচন করো:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['[MLT⁻²]', '[ML²T⁻²]', '[ML²T⁻³]', '[LT⁻²]'].map((dim) => (
                        <button
                          key={dim}
                          onClick={() => setUserDimAnswer(dim)}
                          className={`p-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                            userDimAnswer === dim
                              ? 'bg-[#FF6B57] text-white border-[#FF6B57]'
                              : 'bg-card text-muted-foreground border-border hover:bg-muted'
                          }`}
                        >
                          {dim}
                        </button>
                      ))}
                    </div>
                  </div>

                  {dimFeedback && (
                    <div className={`p-3 rounded-xl text-xs font-semibold border ${
                      dimFeedback.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
                    }`}>
                      {dimFeedback.text}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyDimTask}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
                  >
                    মাত্রা যাচাই করো
                  </button>
                </div>

                {/* Challenge 3: Error Calculator */}
                <div className="p-5 rounded-2xl bg-muted/20 border border-border/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-md bg-card border text-amber-600">
                      চ্যালেঞ্জ ০৩: আয়তনে শতকরা ত্রুটির হিসেব
                    </span>
                    <span className="text-xs text-muted-foreground">Volume Error Trap</span>
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-foreground">
                    একটি গোলকের ব্যাসার্ধ পরিমাপে <span className="text-[#FF6B57] font-bold">{radiusErrorInput}%</span> ত্রুটি থাকলে, এর আয়তনে শতকরা কত ত্রুটি হবে?
                  </div>

                  <div className="flex items-center gap-3 max-w-xs">
                    <input
                      type="text"
                      value={volumeErrorGuess}
                      onChange={(e) => setVolumeErrorGuess(e.target.value)}
                      placeholder="শতকরা মান (যেমন: 9)"
                      className="w-full px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B57]"
                    />
                    <span className="font-bold text-xs">%</span>
                  </div>

                  {errorFeedback && (
                    <div className={`p-3 rounded-xl text-xs font-semibold border ${
                      errorFeedback.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
                    }`}>
                      {errorFeedback.text}
                    </div>
                  )}

                  <button
                    onClick={handleVerifyErrorTask}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs"
                  >
                    ত্রুটি যাচাই করো
                  </button>
                </div>
              </div>

              {/* Universal Bottom Navigation Footer */}
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
                  <span>পরবর্তী ধাপ: Check Understanding (বোর্ড কুইজ)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: CHECK UNDERSTANDING (৫টি বোর্ড বহুনির্বাচনী কুইজ) */}
          {/* ========================================================= */}
          {activeStep === 'check' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                        ৪. মূল্যায়ন · পদার্থবিজ্ঞান বোর্ড কুইজ (Check Understanding)
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        বিগত ৫ বছরের ঢাকা, রাজশাহী, চট্টগ্রাম ও কুমিল্লা বোর্ডের শীর্ষ ৫টি প্রশ্ন
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
                  {PHYSICS_BOARD_MCQS.map((q, qIndex) => {
                    const selectedOptId = quizAnswers[q.id];
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
                                onClick={() => handleSelectQuiz(q.id, opt.id)}
                                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all ${
                                  isSelected
                                    ? opt.isCorrect
                                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                      : 'bg-rose-500 text-white border-rose-500 shadow-sm'
                                    : isAnswered && opt.isCorrect
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                                    : 'bg-card border-border hover:bg-muted text-foreground'
                                }`}
                              >
                                <RenderMathText text={opt.text} />
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {isAnswered && (
                          <div className={`p-3.5 rounded-xl text-xs sm:text-sm border leading-relaxed ${
                            isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200'
                          }`}>
                            <span className="font-bold">{isCorrect ? '✓ সঠিক! ' : '✕ ভুল! '}</span>
                            <RenderMathText text={q.explanation} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-muted-foreground transition-all"
                  >
                    রিসেট
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>অগ্রগতি সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* Universal Bottom Navigation Footer */}
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
          {/* STEP 5: SUMMARY (অধ্যায় ১ পদার্থবিজ্ঞান রিভিশন চিট-শিট) */}
          {/* ========================================================= */}
          {activeStep === 'summary' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="rounded-3xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-foreground font-heading">
                        ৫. সারসংক্ষেপ · পদার্থবিজ্ঞান অধ্যায় ১ রিভিশন চিট-শিট
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        বোর্ড পরীক্ষার আগের রাতের জন্য সূত্র, মাত্রা ও সতর্কতার হ্যান্ডনোট
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

                {/* Section 1: 7 SI Units Matrix */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>📏</span>
                    <span>৭টি মৌলিক রাশি ও এসআই প্রতীক তালিকা</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs text-center font-semibold">
                    {[
                      { name: 'দৈর্ঘ্য', sym: 'm', dim: '[L]' },
                      { name: 'ভর', sym: 'kg', dim: '[M]' },
                      { name: 'সময়', sym: 's', dim: '[T]' },
                      { name: 'তাপমাত্রা', sym: 'K', dim: '[θ]' },
                      { name: 'তড়িৎপ্রবাহ', sym: 'A', dim: '[I]' },
                      { name: 'দীপন তীব্রতা', sym: 'cd', dim: '[J]' },
                      { name: 'পদার্থের পরিমাণ', sym: 'mol', dim: '[N]' },
                    ].map((item) => (
                      <div key={item.name} className="p-3 rounded-xl bg-muted/20 border border-border space-y-1">
                        <div className="text-muted-foreground text-[10px]">{item.name}</div>
                        <div className="font-mono text-base font-black text-[#FF6B57]">{item.sym}</div>
                        <div className="font-mono text-[11px] text-primary">{item.dim}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Instrument Formulas */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>⚙️</span>
                    <span>পরিমাপ যন্ত্রের প্রধান সূত্রাবলী (Master Formulae)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="font-bold text-primary">১. স্লাইড ক্যালিপার্স (Vernier Calipers):</div>
                      <div className="font-mono text-xs space-y-1 text-muted-foreground">
                        <div><RenderMathText text="• ভার্নিয়ার ধ্রুবক: $VC = \\frac{s}{n}$ (সাধারণত 0.1 mm বা 0.01 cm)" /></div>
                        <div><RenderMathText text="• মোট দৈর্ঘ্য: $L = M + (V \\times VC) - (\\pm e)$" /></div>
                        <div>• ধনাত্মক ত্রুটি (+e) বিয়োগ হবে, ঋণাত্মক (-e) যোগ হবে।</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                      <div className="font-bold text-[#FF6B57]">২. স্ক্রু গজ (Screw Gauge):</div>
                      <div className="font-mono text-xs space-y-1 text-muted-foreground">
                        <div><RenderMathText text="• লঘিষ্ঠ গণন: $LC = \\frac{\\text{Pitch}}{n}$ (সাধারণত 0.01 mm)" /></div>
                        <div><RenderMathText text="• তারের ব্যাস: $D = L + (C \\times LC) - (\\pm e)$" /></div>
                        <div><RenderMathText text="• প্রস্থচ্ছেদের ক্ষেত্রফল: $A = \\frac{\\pi D^2}{4}$" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Top 5 Board Traps */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <span>⚠️</span>
                    <span>পদার্থবিজ্ঞান অধ্যায় ১ এর শীর্ষ ৫টি বোর্ড ফাঁদ (Board Traps)</span>
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm text-foreground">
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ১:</span>
                      <span>ভার্নিয়ার ধ্রুবক $VC$ লেখার সময় একক (cm বা mm) বাদ দিলে ১ নম্বর সরাসরি কাটা যায়।</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5">
                      <span className="font-black text-rose-500 shrink-0">ফাঁদ ২:</span>
                      <span>ধনাত্মক যান্ত্রিক ত্রুটি থাকলে তা মূল পাঠ থেকে বিয়োগ করতে হয়; যোগ করলে উত্তর শূন্য হয়।</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                      <span className="font-black text-amber-600 shrink-0">ফাঁদ ৩:</span>
                      <span>ঘনকের বাহু পরিমাপে x% ত্রুটি হলে ক্ষেত্রফলে ত্রুটি প্রায় 2x% এবং আয়তনে প্রায় 3x%।</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2.5">
                      <span className="font-black text-sky-600 shrink-0">ফাঁদ ৪:</span>
                      <span>বল $[MLT^{-2}]$ এবং কাজ $[ML^2T^{-2}]$ এর মাত্রায় $L$ এর ঘাত খুব সতর্কভাবে লিখতে হবে।</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                      <span className="font-black text-emerald-600 shrink-0">ফাঁদ ৫:</span>
                      <span>আলোর দীপন তীব্রতার একক ক্যান্ডেলা (cd), কেলভিন (K) বা অ্যাম্পিয়ার (A) নয়।</span>
                    </div>
                  </div>
                </div>

                {/* Chapter Completion Button */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground font-semibold">
                    অধ্যায় ১ (ভৌত রাশি ও পরিমাপ) সম্পূর্ণ রিভিশন সম্পন্ন হয়েছে?
                  </div>
                  <button
                    onClick={async () => {
                      setIsChapterFinished(true);
                      const allDone = [1, 2, 3, 4, 5];
                      setCompletedLessons(allDone);
                      await saveProgressToBackend(allDone);
                    }}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 ${
                      isChapterFinished
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FF6B57] hover:bg-[#e05340] text-white'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isChapterFinished ? 'অভিনন্দন! অধ্যায় ১ সম্পূর্ণ সম্পন্ন' : 'অধ্যায় সম্পন্ন হিসেবে চিহ্নিত করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Universal Bottom Navigation Footer */}
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
                <Link
                  href="/dashboard/playground/v2"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-primary/90 transition-all"
                >
                  <span>গাইডবুক লাইব্রেরিতে ফিরুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT SIDEBAR (AI Tutor & Quick Tools)          */}
        {/* ========================================================= */}
        {isRightSidebarOpen && (
          <aside className="w-72 sm:w-80 shrink-0 space-y-4 animate-in fade-in duration-200">
            {/* AI Tutor Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">AI শিক্ষক</h3>
                    <p className="text-[10px] text-muted-foreground">পদার্থবিজ্ঞান সহায়ক</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  অনলাইন
                </span>
              </div>

              {/* Chat Messages */}
              <div className="h-60 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-2xl leading-relaxed ${
                      msg.role === 'ai'
                        ? 'bg-muted/40 border border-border/60 text-foreground mr-4'
                        : 'bg-[#FF6B57] text-white ml-4'
                    }`}
                  >
                    <RenderMathText text={msg.text} />
                  </div>
                ))}
                {isAiLoading && (
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-muted-foreground text-xs animate-pulse">
                    উত্তর প্রস্তুত করা হচ্ছে...
                  </div>
                )}
              </div>

              {/* Quick Prompt Pills */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">দ্রুত প্রশ্ন করুন:</div>
                {[
                  'ভার্নিয়ার ধ্রুবক (VC) কীভাবে বের করে?',
                  'স্ক্রু গজের শূন্য ত্রুটি কীভাবে সংশোধন করব?',
                  'কাজের মাত্রা সমীকরণ কীভাবে বের করে?',
                  'ঘনকের বাহুর ত্রুটি ৫% হলে আয়তনে কেন ১৫%?',
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setChatInput(prompt);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-muted/30 hover:bg-muted/70 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all line-clamp-1 border border-border/40"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-border/60">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  placeholder="তোমার প্রশ্ন লেখো..."
                  className="flex-1 bg-muted/30 border border-border/60 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FF6B57]"
                />
                <button
                  onClick={handleSendAiMessage}
                  disabled={!chatInput.trim() || isAiLoading}
                  className="h-8 w-8 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0"
                  aria-label="Send query"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Tools Grid */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>কুইক টুলস (Quick Tools)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setActiveModal('notes')}
                  className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 text-center space-y-1 transition-all"
                >
                  <span className="text-base">📄</span>
                  <div className="text-foreground">সংক্ষেপ নোট</div>
                  <div className="text-[10px] text-muted-foreground">মূল পয়েন্টস</div>
                </button>
                <button
                  onClick={() => setActiveModal('formulas')}
                  className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 text-center space-y-1 transition-all"
                >
                  <span className="text-base">🗂️</span>
                  <div className="text-foreground">ফর্মুলা শিট</div>
                  <div className="text-[10px] text-muted-foreground">সকল সূত্র</div>
                </button>
                <button
                  onClick={() => setActiveModal('board_questions')}
                  className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 text-center space-y-1 transition-all"
                >
                  <span className="text-base">📋</span>
                  <div className="text-foreground">বোর্ড প্রশ্ন</div>
                  <div className="text-[10px] text-muted-foreground">বিগত বছর</div>
                </button>
                <button
                  onClick={() => setActiveModal('mindmap')}
                  className="p-3 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/60 text-center space-y-1 transition-all"
                >
                  <span className="text-base">🧭</span>
                  <div className="text-foreground">মাইন্ড ম্যাপ</div>
                  <div className="text-[10px] text-muted-foreground">সারসংক্ষেপ</div>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Resource Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <span>{activeModal === 'nctb_book' ? '📕 NCTB পদার্থবিজ্ঞান বই' : activeModal === 'notes' ? '📄 সংক্ষেপ নোট' : activeModal === 'formulas' ? '🗂️ ফর্মুলা শিট' : activeModal === 'board_questions' ? '📋 বিগত বছরের বোর্ড প্রশ্ন' : '🧭 মাইন্ড ম্যাপ'}</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/20 border border-border text-xs leading-relaxed space-y-2 text-foreground">
              {activeModal === 'nctb_book' && (
                <div>
                  এনসিটিবি নবম-দশম শ্রেণির পদার্থবিজ্ঞান অধ্যায় ১: "ভৌত রাশি ও পরিমাপ" (পৃষ্ঠা ১-২৫)। বইয়ের প্রতিটি পরীক্ষণ ও একক এই ভার্চুয়াল গাইডবুকে সরাসরি সিমুলেটরের মাধ্যমে ইন্টারঅ্যাক্টিভ করা হয়েছে।
                </div>
              )}
              {activeModal === 'notes' && (
                <div className="space-y-1.5 font-sans">
                  <div>• মৌলিক রাশি ৭টি: দৈর্ঘ্য, ভর, সময়, তাপমাত্রা, তড়িৎপ্রবাহ, দীপন তীব্রতা ও পদার্থের পরিমাণ।</div>
                  <div><RenderMathText text="• ভার্নিয়ার ধ্রুবক: $VC = s/n$ (প্রধান স্কেলের ১ ভাগ / ভার্নিয়ার স্কেলের মোট ভাগ)।" /></div>
                  <div><RenderMathText text="• স্ক্রু গজের লঘিষ্ঠ গণন: $LC = \\text{Pitch}/n$।" /></div>
                  <div><RenderMathText text="• বলের মাত্রা $[MLT^{-2}]$, কাজের মাত্রা $[ML^2T^{-2}]$, ক্ষমতার মাত্রা $[ML^2T^{-3}]$।" /></div>
                </div>
              )}
              {activeModal === 'formulas' && (
                <div className="space-y-1.5 font-mono text-xs">
                  <div>1. VC = s / n</div>
                  <div>2. L = M + (V × VC) - (±e)</div>
                  <div>3. LC = Pitch / n</div>
                  <div>4. D = L + (C × LC) - (±e)</div>
                  <div>5. A = πD² / 4</div>
                  <div>6. % Error in V ≈ 3 × (% Error in a)</div>
                </div>
              )}
              {activeModal === 'board_questions' && (
                <div className="space-y-1.5">
                  <div>• ঢাকা বোর্ড ২০২৪: মৌলিক রাশি শনাক্তকরণ (তড়িৎপ্রবাহ)।</div>
                  <div>• রাজশাহী বোর্ড ২০২৩: ভার্নিয়ার স্কেল পাঠ ও যান্ত্রিক ত্রুটির গাণিতিক সমস্যা।</div>
                  <div>• চট্টগ্রাম বোর্ড ২০২৩: কাজের মাত্রা প্রতিপাদন ও সমীকরণ শুদ্ধতা যাচাই।</div>
                  <div>• কুমিল্লা বোর্ড ২০২১: গোলকের ব্যাসার্ধ পরিমাপে ২% ত্রুটিতে আয়তনের ত্রুটি গণনা।</div>
                </div>
              )}
              {activeModal === 'mindmap' && (
                <div>
                  ভৌত রাশি ও পরিমাপ $\to$ [মৌলিক ও লব্ধ রাশি] $\to$ [যন্ত্রপাতি: ভার্নিয়ার ও স্ক্রু গজ] $\to$ [মাত্রা সমীকরণ] $\to$ [ত্রুটি বিস্তার ও সংশোধন]।
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-[#FF6B57] text-white font-bold text-xs shadow-xs"
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
