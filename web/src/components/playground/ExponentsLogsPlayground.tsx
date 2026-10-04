'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Play,
  Flame,
  Star,
  Layers,
  ChevronRight,
  BookOpen,
  Sliders,
  Check,
  Award,
  Gamepad2,
  GraduationCap,
  Rocket,
  Activity,
  Scale,
  Binary,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { SheruCompanion } from './SheruCompanion';
import { ExponentsLogsBoardGuide } from './ExponentsLogsBoardGuide';

type QuestId = 'paper_fold' | 'richter_sound' | 'power_balancer' | 'scientific_notation' | 'boss';

interface BossQuestion {
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIdx: number;
  explanationBn: string;
  explanationEn: string;
}

const BOSS_QUESTIONS: BossQuestion[] = [
  {
    questionBn: 'a ≠ 0 হলে, a⁰ এর মান কত?',
    questionEn: 'If a ≠ 0, what is the value of a⁰?',
    optionsBn: ['০', '১', 'a', 'অসংজ্ঞায়িত'],
    optionsEn: ['0', '1', 'a', 'Undefined'],
    correctIdx: 1,
    explanationBn: 'সূচকের সূত্রানুসারে a⁰ = a^(n-n) = aⁿ / aⁿ = ১ (যেখানে a ≠ 0)।',
    explanationEn: 'By laws of exponents, a⁰ = a^(n-n) = aⁿ / aⁿ = 1 (where a ≠ 0).',
  },
  {
    questionBn: '2^(-3) এর মান কোনটি?',
    questionEn: 'What is the value of 2^(-3)?',
    optionsBn: ['-6', '-8', '1/6', '1/8'],
    optionsEn: ['-6', '-8', '1/6', '1/8'],
    correctIdx: 3,
    explanationBn: 'ঋণাত্মক ঘাতের নিয়ম: a^(-n) = 1/aⁿ। সুতরাং 2^(-3) = 1/2³ = 1/8!',
    explanationEn: 'Negative exponent rule: a^(-n) = 1/aⁿ. Therefore 2^(-3) = 1/2³ = 1/8!',
  },
  {
    questionBn: 'log₂ 64 এর মান কত?',
    questionEn: 'What is the value of log₂ 64?',
    optionsBn: ['৪', '৫', '৬', '৮'],
    optionsEn: ['4', '5', '6', '8'],
    correctIdx: 2,
    explanationBn: 'যেহেতু 2⁶ = 64, তাই log₂ 64 = log₂ 2⁶ = 6 log₂ 2 = 6!',
    explanationEn: 'Since 2⁶ = 64, log₂ 64 = log₂ 2⁶ = 6 log₂ 2 = 6!',
  },
  {
    questionBn: '4^(x+1) = 32 হলে x এর মান কত?',
    questionEn: 'If 4^(x+1) = 32, what is the value of x?',
    optionsBn: ['১', '১.৫', '২', '২.৫'],
    optionsEn: ['1', '1.5', '2', '2.5'],
    correctIdx: 1,
    explanationBn: 'উভয়পক্ষকে ২ এর ভিত্তিতে রূপান্তর করো: 2^(2x+2) = 2⁵ => 2x + 2 = 5 => 2x = 3 => x = 1.5!',
    explanationEn: 'Convert to base 2: 2^(2x+2) = 2⁵ => 2x + 2 = 5 => 2x = 3 => x = 1.5!',
  },
  {
    questionBn: '0.0035 সংখ্যাটির সাধারণ লগের পূর্ণক কত?',
    questionEn: 'What is the characteristic of log₁₀(0.0035)?',
    optionsBn: ['-2', '-3 বা ৩̄', '-4', '3'],
    optionsEn: ['-2', '-3 or 3̄', '-4', '3'],
    correctIdx: 1,
    explanationBn: 'দশমিকের পর প্রথম অশূন্য অঙ্ক ৩ এর পূর্বে ২টি শূন্য আছে, সুতরাং পূর্ণক -(2 + 1) = -3 (বা ৩̄)।',
    explanationEn: 'There are 2 zeros immediately following the decimal point, so characteristic is -(2+1) = -3 (or 3̄).',
  },
  {
    questionBn: 'logₐ 1 এর মান সর্বদা কত?',
    questionEn: 'What is always the value of logₐ 1 (a > 0, a ≠ 1)?',
    optionsBn: ['০', '১', 'a', 'অসীম'],
    optionsEn: ['0', '1', 'a', 'Infinity'],
    correctIdx: 0,
    explanationBn: 'যেহেতু a⁰ = 1, লগের সংজ্ঞানুসারে logₐ 1 = 0!',
    explanationEn: 'Since a⁰ = 1, by definition of logarithm, logₐ 1 = 0!',
  },
  {
    questionBn: 'log(a / b) এর সঠিক সূত্র কোনটি?',
    questionEn: 'Which is the correct formula for log(a / b)?',
    optionsBn: ['log a / log b', 'log a - log b', 'log a + log b', 'b log a'],
    optionsEn: ['log a / log b', 'log a - log b', 'log a + log b', 'b log a'],
    correctIdx: 1,
    explanationBn: 'লগের ভাগফলের সূত্র: log(a/b) = log a - log b!',
    explanationEn: 'Quotient law of logarithm: log(a/b) = log a - log b!',
  },
  {
    questionBn: '(√3)⁶ এর মান কত?',
    questionEn: 'What is the value of (√3)⁶?',
    optionsBn: ['৯', '১৮', '২৭', '৮১'],
    optionsEn: ['9', '18', '27', '81'],
    correctIdx: 2,
    explanationBn: '(√3)⁶ = (3^(1/2))⁶ = 3^(6/2) = 3³ = 27!',
    explanationEn: '(√3)⁶ = (3^(1/2))⁶ = 3^(6/2) = 3³ = 27!',
  },
  {
    questionBn: 'log√₅ 25 এর মান কত?',
    questionEn: 'What is the value of log√₅ 25?',
    optionsBn: ['২', '৪', '৫', '১০'],
    optionsEn: ['2', '4', '5', '10'],
    correctIdx: 1,
    explanationBn: '25 = 5² = ( (√5)² )² = (√5)⁴। সুতরাং log√₅ (√5)⁴ = 4!',
    explanationEn: '25 = 5² = ( (√5)² )² = (√5)⁴. Hence log√₅ (√5)⁴ = 4!',
  },
  {
    questionBn: 'যদি pᵃ = q, qᵇ = r এবং rᶜ = p হয়, তবে abc এর মান কত?',
    questionEn: 'If pᵃ = q, qᵇ = r, and rᶜ = p, what is abc?',
    optionsBn: ['০', '১', 'pqr', '-1'],
    optionsEn: ['0', '1', 'pqr', '-1'],
    correctIdx: 1,
    explanationBn: 'rᶜ = p => (qᵇ)ᶜ = p => ((pᵃ)ᵇ)ᶜ = p => p^(abc) = p¹ => abc = 1!',
    explanationEn: 'rᶜ = p => (qᵇ)ᶜ = p => ((pᵃ)ᵇ)ᶜ = p => p^(abc) = p¹ => abc = 1!',
  },
];

export function ExponentsLogsPlayground() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'playground' | 'board_master'>('playground');
  const [activeQuest, setActiveQuest] = useState<QuestId>('paper_fold');
  const [completedQuests, setCompletedQuests] = useState<Record<QuestId, boolean>>({
    paper_fold: false,
    richter_sound: false,
    power_balancer: false,
    scientific_notation: false,
    boss: false,
  });

  // Quest 1: Paper Fold to the Moon state
  const [foldCount, setFoldCount] = useState<number>(0);
  const [paperGoalReached, setPaperGoalReached] = useState<boolean>(false);

  // Quest 2: Richter & Sound Log Compressor state
  const [logScaleMode, setLogScaleMode] = useState<'richter' | 'sound'>('richter');
  const [richterMag, setRichterMag] = useState<number>(4.0);
  const [soundDb, setSoundDb] = useState<number>(60);
  const [compressorQuizAnswer, setCompressorQuizAnswer] = useState<number | null>(null);

  // Quest 3: Base-Exponent Power Balancer state
  const [balancerLevel, setBalancerLevel] = useState<number>(0);
  const [balancerInput, setBalancerInput] = useState<string>('');
  const [balancerFeedback, setBalancerFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [balancerSolved, setBalancerSolved] = useState<number>(0);

  // Quest 4: Scientific Notation & Characteristic / Mantissa Lab state
  const [sciNumber, setSciNumber] = useState<string>('45600');
  const [trapQuizChoice, setTrapQuizChoice] = useState<number | null>(null);

  // Quest 5: Boss Rush state
  const [bossActive, setBossActive] = useState<boolean>(false);
  const [bossQuestionIdx, setBossQuestionIdx] = useState<number>(0);
  const [bossScore, setBossScore] = useState<number>(0);
  const [bossTimeLeft, setBossTimeLeft] = useState<number>(60);
  const [bossSelectedOption, setBossSelectedOption] = useState<number | null>(null);
  const [bossAnswerStatus, setBossAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [bossFinished, setBossFinished] = useState<boolean>(false);

  // Boss Rush Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bossActive && bossTimeLeft > 0 && !bossFinished) {
      timer = setTimeout(() => setBossTimeLeft((t) => t - 1), 1000);
    } else if (bossActive && bossTimeLeft === 0 && !bossFinished) {
      setBossFinished(true);
      if (bossScore >= 6) {
        setCompletedQuests((prev) => ({ ...prev, boss: true }));
      }
    }
    return () => clearTimeout(timer);
  }, [bossActive, bossTimeLeft, bossFinished, bossScore]);

  // Paper fold thickness math (in meters)
  // 1 fold = 0.1mm * 2^n = 10^-4 * 2^n meters
  const paperThicknessMeters = 0.0001 * Math.pow(2, foldCount);

  const getPaperMilestone = (n: number) => {
    if (n === 0) return { titleBn: 'কাগজের শিট (০.১ মিমি)', titleEn: 'Single Paper Sheet (0.1 mm)', icon: '📄', color: 'text-muted-foreground' };
    if (n < 7) return { titleBn: 'ক্রেডিট কার্ড / কাগজের বান্ডিল', titleEn: 'Credit card / paper bundle', icon: '💳', color: 'text-sky-500' };
    if (n < 14) return { titleBn: 'স্কুল নোটবুক / বইয়ের বান্ডিল', titleEn: 'School Notebook / Books', icon: '📚', color: 'text-blue-500' };
    if (n < 17) return { titleBn: 'মানব দেহের উচ্চতা (~১.৬৪ মি)', titleEn: 'Human Height (~1.64 m)', icon: '🧍', color: 'text-emerald-500' };
    if (n < 20) return { titleBn: '৪-তলা আবাসিক ভবন (~১৩ মি)', titleEn: '4-Story Building (~13 m)', icon: '🏢', color: 'text-teal-500' };
    if (n < 23) return { titleBn: 'ফুটবল স্টেডিয়ামের দৈর্ঘ্য (~১০৫ মি)', titleEn: 'Football Stadium Length (~105 m)', icon: '🏟️', color: 'text-amber-500' };
    if (n < 27) return { titleBn: 'বুর্জ খলিফা আকাশচুম্বী (~৮২৮ মি)', titleEn: 'Burj Khalifa (~828 m)', icon: '🏙️', color: 'text-orange-500' };
    if (n < 30) return { titleBn: 'মাউন্ট এভারেস্ট শীর্ষ (~৮,৮৪৮ মি)', titleEn: 'Mount Everest Peak (~8,848 m)', icon: '🏔️', color: 'text-red-500' };
    if (n < 42) return { titleBn: 'মহাকাশ ও কারমান রেখা অতিক্রম (>১০০ কিমি)', titleEn: 'Outer Space & Karman Line (>100 km)', icon: '🛰️', color: 'text-purple-500' };
    return { titleBn: 'চাঁদে অবতরণ! (~৩,৮৪,৪০০ কিমি অতিক্রান্ত)', titleEn: 'Landed on the Moon! (~384,400 km)', icon: '🌕', color: 'text-yellow-400 font-extrabold' };
  };

  const currentMilestone = getPaperMilestone(foldCount);

  // Format paper thickness nicely
  const formatThickness = (meters: number) => {
    if (meters < 0.001) return `${(meters * 1000).toFixed(2)} mm`;
    if (meters < 1) return `${(meters * 100).toFixed(2)} cm`;
    if (meters < 1000) return `${meters.toFixed(2)} m`;
    if (meters < 1000000) return `${(meters / 1000).toFixed(2)} km`;
    return `${(meters / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })} km`;
  };

  // Balancer puzzle definitions
  const BALANCER_PUZZLES = [
    {
      eqBn: '2^(x+2) = 32',
      eqLatex: '2^{x+2} = 32',
      hintBn: '৩২ কে ২ এর ঘাতে প্রকাশ করো: 32 = 2⁵। ভিত্তি একই হলে x + 2 = 5!',
      hintEn: 'Express 32 as power of 2: 32 = 2⁵. Then x + 2 = 5!',
      step2Latex: '2^{x+2} = 2^5 \\implies x+2 = 5',
      correctX: 3,
    },
    {
      eqBn: '3^(2x-1) = 27',
      eqLatex: '3^{2x-1} = 27',
      hintBn: '২৭ = 3³। সুতরাং 2x - 1 = 3 => 2x = 4 => x = 2!',
      hintEn: '27 = 3³. So 2x - 1 = 3 => 2x = 4 => x = 2!',
      step2Latex: '3^{2x-1} = 3^3 \\implies 2x-1 = 3',
      correctX: 2,
    },
    {
      eqBn: '4^(x+1) = 64',
      eqLatex: '4^{x+1} = 64',
      hintBn: '৬৪ = 4³। সুতরাং x + 1 = 3 => x = 2!',
      hintEn: '64 = 4³. Hence x + 1 = 3 => x = 2!',
      step2Latex: '4^{x+1} = 4^3 \\implies x+1 = 3',
      correctX: 2,
    },
    {
      eqBn: '5^(2x+3) = 1/125',
      eqLatex: '5^{2x+3} = \\frac{1}{125}',
      hintBn: '১/১২৫ = 1/5³ = 5⁻³। সুতরাং 2x + 3 = -3 => 2x = -6 => x = -3!',
      hintEn: '1/125 = 1/5³ = 5⁻³. So 2x + 3 = -3 => 2x = -6 => x = -3!',
      step2Latex: '5^{2x+3} = 5^{-3} \\implies 2x+3 = -3',
      correctX: -3,
    },
  ];

  const handleCheckBalancer = () => {
    const puzzle = BALANCER_PUZZLES[balancerLevel];
    const userVal = parseFloat(balancerInput.trim());
    if (userVal === puzzle.correctX) {
      setBalancerFeedback('correct');
      const nextSolved = balancerSolved + 1;
      setBalancerSolved(nextSolved);
      if (nextSolved >= 3) {
        setCompletedQuests((prev) => ({ ...prev, power_balancer: true }));
      }
    } else {
      setBalancerFeedback('wrong');
    }
  };

  // Scientific Notation helper
  const computeScientific = (rawInput: string) => {
    const num = parseFloat(rawInput);
    if (isNaN(num) || num <= 0) {
      return {
        valid: false,
        sciStr: 'Invalid (>0 required)',
        characteristic: 0,
        mantissa: 0,
        a: 0,
        n: 0,
      };
    }
    const log10Val = Math.log10(num);
    const n = Math.floor(log10Val);
    const a = num / Math.pow(10, n);
    const mantissa = log10Val - n;

    return {
      valid: true,
      sciStr: `${a.toFixed(3)} \\times 10^{${n}}`,
      characteristic: n,
      mantissa: mantissa.toFixed(4),
      a: a.toFixed(3),
      n,
    };
  };

  const sciData = computeScientific(sciNumber);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Header */}
      <div className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/playground"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title={isBn ? 'খেলার মাঠ তালিকায় ফিরে যাও' : 'Back to Playground Hub'}
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {isBn ? 'এনসিটিবি গণিত অধ্যায় ৪' : 'NCTB Math Chapter 4'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {isBn ? 'এসএসসি বোর্ড স্পেশাল' : 'SSC Board Special'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  <span>{isBn ? 'সূচক ও লগারিদম' : 'Exponents & Logarithms'}</span>
                  <span className="text-muted-foreground text-sm sm:text-base font-medium">
                    (Exponents & Logarithms)
                  </span>
                </h1>
              </div>
            </div>

            {/* Mode Toggle: Playground vs Board Master */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-muted/60 p-1.5 rounded-2xl border border-border">
              <button
                onClick={() => setActiveTab('playground')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'playground'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Gamepad2 className="h-4 w-4" />
                <span>{isBn ? 'ইন্টারেক্টিভ খেলার মাঠ' : 'Interactive Playground'}</span>
              </button>
              <button
                onClick={() => setActiveTab('board_master')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'board_master'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>{isBn ? 'বোর্ড মাস্টার গাইড' : 'Board Master Guide'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'board_master' ? (
          <ExponentsLogsBoardGuide />
        ) : (
          <div className="space-y-8">
            {/* Quest Selector Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Quest 1 */}
              <button
                onClick={() => setActiveQuest('paper_fold')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                  activeQuest === 'paper_fold'
                    ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                    : 'border-border/70 bg-card hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary text-xs font-bold">
                    ১
                  </span>
                  {completedQuests.paper_fold ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Rocket className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {isBn ? 'কাগজ ভাঁজে চাঁদে' : 'Paper Fold to Moon'}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  <RenderMathText text="$2^n$ সূচক রকেট" />
                </span>
              </button>

              {/* Quest 2 */}
              <button
                onClick={() => setActiveQuest('richter_sound')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                  activeQuest === 'richter_sound'
                    ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                    : 'border-border/70 bg-card hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary text-xs font-bold">
                    ২
                  </span>
                  {completedQuests.richter_sound ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {isBn ? 'রিখটার ও শব্দ কম্প্রেসর' : 'Richter & Sound Log'}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  <RenderMathText text="$\log_{10}$ স্কেলিং রহস্য" />
                </span>
              </button>

              {/* Quest 3 */}
              <button
                onClick={() => setActiveQuest('power_balancer')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                  activeQuest === 'power_balancer'
                    ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                    : 'border-border/70 bg-card hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary text-xs font-bold">
                    ৩
                  </span>
                  {completedQuests.power_balancer ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Scale className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {isBn ? 'সমীকরণ তুলাদণ্ড' : 'Power Balancer'}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  <RenderMathText text="$a^x = a^y \implies x = y$" />
                </span>
              </button>

              {/* Quest 4 */}
              <button
                onClick={() => setActiveQuest('scientific_notation')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                  activeQuest === 'scientific_notation'
                    ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                    : 'border-border/70 bg-card hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary text-xs font-bold">
                    ৪
                  </span>
                  {completedQuests.scientific_notation ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Binary className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {isBn ? 'পূর্ণক ও অংশক ল্যাব' : 'Characteristic/Mantissa'}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  <RenderMathText text="$a \times 10^n$ ডিকোডার" />
                </span>
              </button>

              {/* Quest 5 */}
              <button
                onClick={() => setActiveQuest('boss')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all col-span-2 sm:col-span-1 ${
                  activeQuest === 'boss'
                    ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/20'
                    : 'border-border/70 bg-card hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500 text-xs font-bold">
                    ৫
                  </span>
                  {completedQuests.boss ? (
                    <Trophy className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
                  )}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {isBn ? '৬০ সে. বস রাশ' : '60s Boss Rush'}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  ১০টি বোর্ড MCQ কুইজ
                </span>
              </button>
            </div>

            {/* QUEST 1: PAPER FOLD TO THE MOON */}
            {activeQuest === 'paper_fold' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                        <Rocket className="h-3.5 w-3.5" />
                        <span>অভিযান ১: সূচকীয় বৃদ্ধির মহাজাগতিক শক্তি</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-foreground">
                        {isBn ? 'কাগজ ভাঁজ করে চাঁদে পৌঁছানোর সিমুলেটর' : 'Paper Fold to the Moon Simulator'}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {isBn
                          ? 'একটি সাধারণ A4 কাগজের পুরুত্ব মাত্র ০.১ মিলিমিটার। কিন্তু প্রতি ভাঁজে পুরুত্ব দ্বিগুণ (২ⁿ) হতে থাকলে কয় ভাঁজে চাঁদে পৌঁছানো সম্ভব?'
                          : 'A single A4 paper is only 0.1 mm thick. But with each fold doubling thickness (2ⁿ), how many folds reach the Moon?'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setFoldCount(0);
                          setPaperGoalReached(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-muted/50 hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>{isBn ? 'রিসেট' : 'Reset'}</span>
                      </button>
                      <button
                        onClick={() => {
                          const next = Math.min(45, foldCount + 1);
                          setFoldCount(next);
                          if (next >= 42) {
                            setPaperGoalReached(true);
                            setCompletedQuests((prev) => ({ ...prev, paper_fold: true }));
                          }
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-105"
                      >
                        <span>{isBn ? 'কাগজ ভাঁজ করো (+১)' : 'Fold Paper (+1)'}</span>
                        <Rocket className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Fold Slider & Real-time Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                      <span className="text-muted-foreground">ভাঁজ সংখ্যা (Number of Folds):</span>
                      <span className="text-primary font-mono text-base">{foldCount} বার ভাঁজ</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={45}
                      value={foldCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setFoldCount(val);
                        if (val >= 42) {
                          setPaperGoalReached(true);
                          setCompletedQuests((prev) => ({ ...prev, paper_fold: true }));
                        }
                      }}
                      className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>০ ভাঁজ (কাগজ)</span>
                      <span>১৪ (মানুষ)</span>
                      <span>২৭ (এভারেস্ট)</span>
                      <span>৩০ (মহাকাশ)</span>
                      <span className="text-amber-500 font-bold">৪২ (চাঁদ!)</span>
                      <span>৪৫</span>
                    </div>
                  </div>

                  {/* Visualizer Stage */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Dynamic Metrics Box */}
                    <div className="space-y-4 md:col-span-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                          <span className="text-xs text-muted-foreground block mb-1">মোট স্তরের সংখ্যা (Layers)</span>
                          <span className="font-mono text-lg sm:text-xl font-black text-primary">
                            <RenderMathText text={`$2^{${foldCount}}$`} />
                          </span>
                          <span className="text-[11px] text-muted-foreground block mt-1 font-mono">
                            = {Math.pow(2, foldCount).toLocaleString('en-US')} স্তর
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                          <span className="text-xs text-muted-foreground block mb-1">বর্তমান পুরুত্ব (Thickness)</span>
                          <span className="font-mono text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                            {formatThickness(paperThicknessMeters)}
                          </span>
                          <span className="text-[11px] text-muted-foreground block mt-1 font-mono">
                            <RenderMathText text={`$0.1 \\times 2^{${foldCount}} \\text{ mm}$`} />
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 col-span-2 sm:col-span-1">
                          <span className="text-xs text-muted-foreground block mb-1">তুলনামূলক স্কেল</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl">{currentMilestone.icon}</span>
                            <span className={`text-xs font-bold leading-tight ${currentMilestone.color}`}>
                              {isBn ? currentMilestone.titleBn : currentMilestone.titleEn}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mathematical Explanation Card */}
                      <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-2 text-xs sm:text-sm">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>সূচকীয় বৃদ্ধির গোপন রহস্য (Exponential Power):</span>
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          প্রথম দিকে সংখ্যাগুলো ছোট মনে হলেও সূচকের ধর্ম হলো এটি বহুগুণে বাড়ে। মাত্র ৪২ বার ভাঁজ করলে কাগজের পুরুত্ব হয়{' '}
                          <strong>৪,৩৯,৮০৪ কিমি</strong>, যেখানে পৃথিবী থেকে চাঁদের দূরত্ব মাত্র <strong>৩,৮৪,৪০০ কিমি</strong>! অর্থাৎ ৪২তম ভাঁজেই তোমার কাগজ চাঁদকে ছাড়িয়ে যাবে!
                        </p>
                      </div>

                      {/* Everest Challenge Widget */}
                      <div className="p-4 rounded-2xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-foreground">
                            🎯 মিনি চ্যালেঞ্জ: মাউন্ট এভারেস্টে পৌঁছাতে ন্যূনতম কয়টি ভাঁজ প্রয়োজন?
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            মাউন্ট এভারেস্টের উচ্চতা ৮,৮৪৮ মিটার।
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setFoldCount(27)}
                            className="px-3.5 py-1.5 rounded-xl border border-primary/40 bg-primary/10 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                          >
                            ২৭ ভাঁজ পরখ করো (১৩,৪২১ মি)
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Graphic Orbit Graphic */}
                    <div className="rounded-2xl border border-border bg-gradient-to-b from-indigo-950/20 via-background to-muted/20 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
                      <div className="relative z-10 space-y-3">
                        <div className="text-5xl animate-bounce duration-1000">{currentMilestone.icon}</div>
                        <h4 className="text-sm font-bold text-foreground">
                          {foldCount >= 42 ? '🌕 মিশন সফল: চাঁদে পৌঁছানো হয়েছে!' : '🚀 চাঁদের পথে যাত্রা চলমান'}
                        </h4>
                        <div className="w-full bg-muted/80 rounded-full h-3 max-w-[200px] mx-auto overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-300 rounded-full"
                            style={{ width: `${Math.min(100, (foldCount / 42) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {Math.min(100, Math.round((foldCount / 42) * 100))}% পথ সম্পন্ন
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QUEST 2: RICHTER & SOUND LOG COMPRESSOR */}
            {activeQuest === 'richter_sound' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                        <Activity className="h-3.5 w-3.5" />
                        <span>অভিযান ২: লগারিদম দিয়ে প্রকৃতিকে সংকোচন</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-foreground">
                        {isBn ? 'ভূমিকম্পের রিখটার স্কেল ও শব্দ ডেসিবল সিমুলেটর' : 'Earthquake Richter & Sound Decibel Simulator'}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {isBn
                          ? 'প্রকৃতির তীব্রতা কোটি গুণ পরিবর্তিত হয়। তাই সাধারণ স্কেলে না দেখিয়ে লগারিদমের মাধ্যমে (M = log₁₀ I) বাস্তব মান সংকুচিত করে মাপা হয়।'
                          : 'Physical intensity varies over billions of times. Logarithms compress this huge range into manageable linear numbers.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border border-border">
                      <button
                        onClick={() => setLogScaleMode('richter')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          logScaleMode === 'richter' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Activity className="h-3.5 w-3.5" />
                        <span>{isBn ? 'রিখটার স্কেল' : 'Richter Scale'}</span>
                      </button>
                      <button
                        onClick={() => setLogScaleMode('sound')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          logScaleMode === 'sound' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{isBn ? 'শব্দের ডেসিবল (dB)' : 'Sound (dB)'}</span>
                      </button>
                    </div>
                  </div>

                  {logScaleMode === 'richter' ? (
                    /* Richter Sandbox */
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                          <span className="text-muted-foreground">ভূমিকম্পের মাত্রা (Richter Magnitude):</span>
                          <span className="text-primary font-mono text-lg">{richterMag.toFixed(1)} মাত্রার কম্পন</span>
                        </div>
                        <input
                          type="range"
                          min={1.0}
                          max={9.5}
                          step={0.1}
                          value={richterMag}
                          onChange={(e) => setRichterMag(parseFloat(e.target.value))}
                          className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                          <span>১.০ (অনুভূতিহীন)</span>
                          <span>৩.০ (হালকা দোলনা)</span>
                          <span>৫.০ (দেয়ালে ফাটল)</span>
                          <span>৭.০ (মারাত্মক ধ্বংস)</span>
                          <span className="text-red-500 font-bold">৯.০+ (মহাপ্রলয়)</span>
                        </div>
                      </div>

                      {/* Richter Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                          <span className="text-xs text-muted-foreground block">মাটি কাঁপার বিস্তার (Amplitude)</span>
                          <span className="font-mono text-xl font-black text-primary">
                            <RenderMathText text={`$10^{${richterMag.toFixed(1)}} \\times$`} />
                          </span>
                          <span className="text-[11px] text-muted-foreground block font-mono">
                            = {Math.round(Math.pow(10, richterMag)).toLocaleString('en-US')} গুণ তরঙ্গ
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                          <span className="text-xs text-muted-foreground block">নির্গমিত শক্তি (Energy Released)</span>
                          <span className="font-mono text-xl font-black text-amber-500">
                            <RenderMathText text={`$31.6^{${richterMag.toFixed(1)}} \\times$`} />
                          </span>
                          <span className="text-[11px] text-muted-foreground block font-mono">
                            প্রতি ১ মাত্রায় ৩২ গুণ শক্তি বৃদ্ধি!
                          </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                          <span className="text-xs text-muted-foreground block">ঐতিহাসিক তুলনা</span>
                          <span className="font-bold text-xs sm:text-sm text-foreground block">
                            {richterMag < 3
                              ? 'সাধারণ ভূমিকম্প সংবেদক ব্যতীত বোঝা যায় না।'
                              : richterMag < 5
                              ? 'ঘরবাড়ি সামান্য কেঁপে ওঠে, ঝুলন্ত পাখা নড়ে।'
                              : richterMag < 7
                              ? 'পুরাতন ভবনে ফাটল ও আসবাবপত্র পড়ে যায়।'
                              : richterMag < 8
                              ? '২০২৩ তুরস্কের ভূমিকম্প (৭.৮) — ভয়াবহ বিপর্যয়!'
                              : '২০১১ জাপানের তোহোকু সুনামির ভূমিকম্প (৯.১)!'}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Seismograph Canvas Simulation */}
                      <div className="p-4 rounded-2xl border border-border bg-slate-950 text-emerald-400 font-mono text-xs overflow-hidden relative min-h-[140px] flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[11px] text-emerald-500/80">
                          <span>SEISMOGRAM LIVE FEED (CH-04 LOG-DETECTOR)</span>
                          <span>MAGNITUDE: {richterMag.toFixed(1)}</span>
                        </div>
                        {/* CSS animated seismic wave representation */}
                        <div className="py-6 flex items-center justify-center gap-1 overflow-hidden">
                          {Array.from({ length: 32 }).map((_, i) => {
                            const waveHeight = Math.min(
                              70,
                              Math.max(4, Math.sin(i * 0.8) * Math.pow(1.5, Math.min(6, richterMag)) * 4)
                            );
                            return (
                              <div
                                key={i}
                                className="w-1.5 bg-emerald-400 rounded-full transition-all duration-150"
                                style={{ height: `${waveHeight}px` }}
                              />
                            );
                          })}
                        </div>
                        <div className="text-[10px] text-muted-foreground text-center">
                          লগের জাদু: মাত্রা মাত্র ১ বাড়লে মাটির ঝাঁকুনি বৃদ্ধি পায় হুবহু ১০ গুণ (<RenderMathText text="$10^1$" />)!
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Sound Decibels Sandbox */
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                          <span className="text-muted-foreground">শব্দের তীব্রতা লেভেল (Sound Level in dB):</span>
                          <span className="text-primary font-mono text-lg">{soundDb} dB</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={150}
                          step={5}
                          value={soundDb}
                          onChange={(e) => setSoundDb(parseInt(e.target.value))}
                          className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                          <span>২০ dB (ফিসফিসানি)</span>
                          <span>৬০ dB (স্বাভাবিক কথা)</span>
                          <span>৮৫ dB (ট্রাফিক জ্যাম)</span>
                          <span>১১০ dB (রক কনসার্ট)</span>
                          <span className="text-red-500 font-bold">১৪০ dB (জেট বিমান)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                          <span className="text-xs text-muted-foreground block">শব্দ তীব্রতার সূত্র</span>
                          <div className="font-mono text-sm text-primary">
                            <RenderMathText text="$\beta = 10 \log_{10} \left(\frac{I}{I_0}\right) \text{ dB}$" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            যেখানে <RenderMathText text="$I_0 = 10^{-12} \text{ W/m}^2$" /> হলো মানুষের শ্রাব্যতার নিম্নতম সীমা।
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                          <span className="text-xs text-muted-foreground block">শ্রবণশক্তি ঝুঁকি নির্দেশক</span>
                          <p className="font-bold text-xs sm:text-sm text-foreground">
                            {soundDb < 40
                              ? '🟢 অত্যন্ত শান্ত ও নিরাপদ পরিবেশ (লাইব্রেরি বা নির্জন ঘর)।'
                              : soundDb < 75
                              ? '🟡 স্বাভাবিক দৈনন্দিন শব্দ, কানের কোনো ক্ষতি হয় না।'
                              : soundDb < 95
                              ? '🟠 দীর্ঘক্ষণ শুনলে শ্রবণশক্তির ক্ষতি হতে পারে (হেডফোনের সর্বোচ্চ সাউন্ড)।'
                              : '🔴 মারাত্মক বিপজ্জনক! কানের পর্দা ফেটে যাওয়ার ঝুঁকি থাকে।'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logarithm Concept Quiz */}
                  <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                      লগারিদম পরীক্ষা প্রশ্ন (Interactive Quiz):
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      রিখটার স্কেলে ৪ মাত্রার চেয়ে ৭ মাত্রার ভূমিকম্পের তীব্রতা কতগুণ বেশি?
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {[
                        { label: '৩ গুণ', val: 3 },
                        { label: '৩০ গুণ', val: 30 },
                        { label: '১,০০০ গুণ', val: 1000 },
                        { label: '১০,০০০ গুণ', val: 10000 },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() => {
                            setCompressorQuizAnswer(opt.val);
                            if (opt.val === 1000) {
                              setCompletedQuests((prev) => ({ ...prev, richter_sound: true }));
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            compressorQuizAnswer === opt.val
                              ? opt.val === 1000
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-destructive text-destructive-foreground border-destructive'
                              : 'bg-card border-border hover:bg-muted text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {compressorQuizAnswer !== null && (
                      <div className="text-xs font-medium pt-1">
                        {compressorQuizAnswer === 1000 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              দারুণ! মাত্রা পার্থক্য ৭ - ৪ = ৩। সুতরাং তীব্রতা <RenderMathText text="$10^3 = 1000$" /> গুণ বেশি!
                            </span>
                          </span>
                        ) : (
                          <span className="text-destructive font-bold flex items-center gap-1.5">
                            <XCircle className="h-4 w-4" />
                            <span>ভুল হয়েছে! লগের নিয়মে পার্থক্যের ঘাত হয়: <RenderMathText text="$10^{7-4} = 10^3 = 1000$" /> গুণ!</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* QUEST 3: BASE-EXPONENT POWER BALANCER */}
            {activeQuest === 'power_balancer' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                        <Scale className="h-3.5 w-3.5" />
                        <span>অভিযান ৩: সূচকীয় সমীকরণ ও তুলাদণ্ডের ভারসাম্য</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-foreground">
                        {isBn ? 'ভিত্তি ও ঘাত ব্যালেন্সিং ল্যাব' : 'Base-Exponent Power Balancer'}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {isBn
                          ? 'মৌলিক সূত্র: aˣ = aʸ হলে x = y (শর্ত: a > 0, a ≠ 1)। উভয়পক্ষের ভিত্তি এক বানিয়ে তুলাদণ্ড ভারসাম্যপূর্ণ করো!'
                          : 'Core axiom: If aˣ = aʸ then x = y (where a > 0, a ≠ 1). Balance the beam by matching prime bases.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-muted-foreground">সমাধান সম্পন্ন:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono">
                        {balancerSolved} / {BALANCER_PUZZLES.length}
                      </span>
                    </div>
                  </div>

                  {/* Level Selector Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {BALANCER_PUZZLES.map((pz, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setBalancerLevel(idx);
                          setBalancerInput('');
                          setBalancerFeedback('idle');
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          balancerLevel === idx
                            ? 'bg-primary text-primary-foreground shadow'
                            : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        লেভেল {idx + 1}: {pz.eqBn}
                      </button>
                    ))}
                  </div>

                  {/* Balance Scale Graphical Representation */}
                  <div className="rounded-2xl border border-border bg-gradient-to-b from-muted/30 to-card p-6 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
                    {/* Scale Beam */}
                    <div className="w-full max-w-md relative flex flex-col items-center">
                      {/* Fulcrum Pivot */}
                      <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-primary mb-0 z-10" />

                      {/* Lever Arm */}
                      <div
                        className={`w-full h-3 bg-foreground/80 rounded-full transition-all duration-500 relative flex justify-between items-center px-4 ${
                          balancerFeedback === 'correct'
                            ? 'rotate-0'
                            : balancerFeedback === 'wrong'
                            ? 'rotate-6'
                            : '-rotate-3'
                        }`}
                      >
                        {/* Left Pan */}
                        <div className="absolute -left-2 top-3 flex flex-col items-center">
                          <div className="w-0.5 h-12 bg-border" />
                          <div className="p-3 rounded-2xl bg-card border-2 border-primary/40 shadow-lg text-center min-w-[120px]">
                            <span className="text-[10px] text-muted-foreground block">বামপক্ষ</span>
                            <div className="font-bold text-sm text-primary font-mono mt-0.5">
                              <RenderMathText text={`$${BALANCER_PUZZLES[balancerLevel].eqLatex.split('=')[0]}$`} />
                            </div>
                          </div>
                        </div>

                        {/* Right Pan */}
                        <div className="absolute -right-2 top-3 flex flex-col items-center">
                          <div className="w-0.5 h-12 bg-border" />
                          <div className="p-3 rounded-2xl bg-card border-2 border-emerald-500/40 shadow-lg text-center min-w-[120px]">
                            <span className="text-[10px] text-muted-foreground block">ডানপক্ষ</span>
                            <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                              <RenderMathText text={`$${BALANCER_PUZZLES[balancerLevel].eqLatex.split('=')[1]}$`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-20 text-center">
                      <span className="text-xs text-muted-foreground block">
                        {balancerFeedback === 'correct'
                          ? '🎉 তুলাদণ্ড ভারসাম্যপূর্ণ! সমীকরণ সম্পূর্ণ সিদ্ধ হয়েছে।'
                          : 'তুলাদণ্ড হেলে আছে। x এর সঠিক মান নির্ণয় করে ভারসাম্য আনো!'}
                      </span>
                    </div>
                  </div>

                  {/* Input & Step-by-Step Helper */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
                      <h4 className="font-bold text-sm text-foreground">
                        x এর মান ইনপুট করো:
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="any"
                          value={balancerInput}
                          onChange={(e) => setBalancerInput(e.target.value)}
                          placeholder="x = ?"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={handleCheckBalancer}
                          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow"
                        >
                          পরখ করো
                        </button>
                      </div>

                      {balancerFeedback === 'correct' && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>চমৎকার! x = {BALANCER_PUZZLES[balancerLevel].correctX} সঠিক উত্তর!</span>
                        </div>
                      )}

                      {balancerFeedback === 'wrong' && (
                        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive font-bold flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          <span>ভুল উত্তর! ইঙ্গিত দেখে পুনরায় চেষ্টা করো।</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-2 text-xs sm:text-sm">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>ধাপে ধাপে সমাধান গাইড (Hint):</span>
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {BALANCER_PUZZLES[balancerLevel].hintBn}
                      </p>
                      <div className="p-3 rounded-xl bg-card border border-border font-mono text-xs text-primary mt-2">
                        <RenderMathText text={`$${BALANCER_PUZZLES[balancerLevel].step2Latex}$`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QUEST 4: SCIENTIFIC NOTATION & CHARACTERISTIC / MANTISSA */}
            {activeQuest === 'scientific_notation' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
                        <Binary className="h-3.5 w-3.5" />
                        <span>অভিযান ৪: সংখ্যার বৈজ্ঞানিক রূপ ও লগের অংশ</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-foreground">
                        {isBn ? 'পূর্ণক ও অংশক ডিকোডার ল্যাব' : 'Characteristic & Mantissa Decoder'}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {isBn
                          ? 'যেকোনো ধনাত্মক বাস্তব সংখ্যাকে a × 10ⁿ আকারে রূপান্তর করো। সরাসরি দেখে নাও লগের পূর্ণক ও ধনাত্মক অংশকের নিখুঁত হিসাব।'
                          : 'Convert any positive real number to standard form a × 10ⁿ and decode its log characteristic and mantissa.'}
                      </p>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {['45600', '0.00345', '602000', '0.000078', '9.81'].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setSciNumber(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                            sciNumber === preset
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Bar */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">
                      যেকোনো ধনাত্মক সংখ্যা টাইপ করো (Type any positive number):
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={sciNumber}
                      onChange={(e) => setSciNumber(e.target.value)}
                      className="w-full max-w-md px-4 py-2.5 rounded-xl border border-border bg-background text-base font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Output Display Cards */}
                  {sciData.valid ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Scientific Form */}
                      <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                          বৈজ্ঞানিক রূপ (Scientific Form)
                        </span>
                        <div className="text-lg sm:text-xl font-black text-primary font-mono">
                          <RenderMathText text={`$${sciData.sciStr}$`} />
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          যেখানে <RenderMathText text={`$1 \\le ${sciData.a} < 10$`} /> এবং <RenderMathText text={`$n = ${sciData.n}$`} />।
                        </p>
                      </div>

                      {/* Characteristic */}
                      <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                          লগের পূর্ণক (Characteristic)
                        </span>
                        <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          {sciData.characteristic < 0 ? (
                            <RenderMathText text={`$\\overline{${Math.abs(sciData.characteristic)}} \\text{ বা } ${sciData.characteristic}$`} />
                          ) : (
                            sciData.characteristic
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {sciData.characteristic < 0
                            ? `দশমিকের পর ${Math.abs(sciData.characteristic) - 1}টি শূন্য থাকায় পূর্ণক -${Math.abs(sciData.characteristic)}।`
                            : `দশমিকের পূর্বে ${sciData.characteristic + 1}টি অঙ্ক থাকায় পূর্ণক ${sciData.characteristic}।`}
                        </p>
                      </div>

                      {/* Mantissa */}
                      <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                          লগের অংশক (Mantissa)
                        </span>
                        <div className="text-lg sm:text-xl font-black text-amber-500 font-mono">
                          {sciData.mantissa}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          <RenderMathText text={`$\\log_{10}(${sciData.a}) = ${sciData.mantissa}$`} /> (সর্বদা অঋণাত্মক)।
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs font-bold">
                      লগারিদমের জন্য সংখ্যাটি অবশ্যই শূন্য অপেক্ষা বড় (ধনাত্মক) হতে হবে!
                    </div>
                  )}

                  {/* Examiner Negative Log Trap Quiz */}
                  <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-black">!</span>
                      <span>এসএসসি বোর্ড ফাঁদ কুইজ: ঋণাত্মক লগের অংশক নির্ণয়</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      যদি একটি সংখ্যার সাধারণ লগারিদমের মান <RenderMathText text="$-2.3845$" /> হয়, তবে সংখ্যাটির <strong>পূর্ণক ও অংশক</strong> যথাক্রমে কোনটি?
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {[
                        { id: 1, textBn: 'পূর্ণক -২ এবং অংশক -০.৩৮৪৫', isCorrect: false },
                        { id: 2, textBn: 'পূর্ণক -২ এবং অংশক ০.৩৮৪৫', isCorrect: false },
                        { id: 3, textBn: 'পূর্ণক ৩̄ (-৩) এবং অংশক ০.৬১৫৫', isCorrect: true },
                        { id: 4, textBn: 'পূর্ণক ২̄ (-২) এবং অংশক ০.৬১৫৫', isCorrect: false },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setTrapQuizChoice(opt.id);
                            if (opt.isCorrect) {
                              setCompletedQuests((prev) => ({ ...prev, scientific_notation: true }));
                            }
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                            trapQuizChoice === opt.id
                              ? opt.isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-destructive text-destructive-foreground border-destructive'
                              : 'bg-card border-border hover:bg-muted text-foreground'
                          }`}
                        >
                          {opt.textBn}
                        </button>
                      ))}
                    </div>

                    {trapQuizChoice !== null && (
                      <div className="text-xs font-medium pt-2">
                        {trapQuizChoice === 3 ? (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-1">
                            <span className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>একদম সঠিক! অসাধারণ সমাধান!</span>
                            </span>
                            <p>
                              কারণ: <RenderMathText text="$-2.3845 = -2 - 0.3845 = (-2 - 1) + (1 - 0.3845) = -3 + 0.6155 = \bar{3}.6155$" />। অংশক সর্বদা ধনাত্মক হতে হয়!
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive space-y-1">
                            <span className="font-bold flex items-center gap-1.5">
                              <XCircle className="h-4 w-4" />
                              <span>ভুল ফাঁদে পা দিয়েছ!</span>
                            </span>
                            <p>
                              অংশক কখনো ঋণাত্মক হতে পারে না। তাই -১ বিয়োগ করে +১ যোগ করতে হয়: <RenderMathText text="$-2 - 1 = -3$" /> (পূর্ণক <RenderMathText text="$\\bar{3}$" />) এবং <RenderMathText text="$1 - 0.3845 = 0.6155$" /> (অংশক)।
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* QUEST 5: 60-SECOND BOSS RUSH */}
            {activeQuest === 'boss' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  {!bossActive && !bossFinished && (
                    <div className="text-center py-10 space-y-4 max-w-xl mx-auto">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-500 text-3xl">
                        <Flame className="h-8 w-8 animate-pulse" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                        {isBn ? '৬০-সেকেন্ড সূচক ও লগ বস রাশ!' : '60-Second Exponents & Logs Boss Rush'}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {isBn
                          ? 'এসএসসি বোর্ড পরীক্ষার ১০টি বাছাইকৃত এমসিকিউ প্রশ্নের উত্তর দাও। সময় মাত্র ৬০ সেকেন্ড! অন্তত ৬টি সঠিক উত্তর দিলে বস ব্যাজ আনলক হবে।'
                          : 'Answer 10 curated SSC board MCQ questions in 60 seconds. Score 6+ to defeat the Boss!'}
                      </p>
                      <button
                        onClick={() => {
                          setBossActive(true);
                          setBossTimeLeft(60);
                          setBossScore(0);
                          setBossQuestionIdx(0);
                          setBossFinished(false);
                          setBossSelectedOption(null);
                          setBossAnswerStatus(null);
                        }}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm shadow-lg hover:bg-amber-400 transition-all hover:scale-105"
                      >
                        <Play className="h-5 w-5 fill-current" />
                        <span>{isBn ? 'চ্যালেঞ্জ শুরু করো!' : 'Start Challenge!'}</span>
                      </button>
                    </div>
                  )}

                  {bossActive && !bossFinished && (
                    <div className="space-y-6">
                      {/* Timer & Score Bar */}
                      <div className="flex items-center justify-between border-b border-border/60 pb-4">
                        <div className="flex items-center gap-2">
                          <Flame className="h-5 w-5 text-amber-500" />
                          <span className="font-bold text-xs sm:text-sm">
                            প্রশ্ন {bossQuestionIdx + 1} / {BOSS_QUESTIONS.length}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-amber-500">
                            <span>স্কোর:</span>
                            <span className="text-base">{bossScore}</span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-sm font-black ${
                              bossTimeLeft <= 10
                                ? 'bg-destructive/20 text-destructive animate-pulse'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <span>⏱️ {bossTimeLeft}s</span>
                          </div>
                        </div>
                      </div>

                      {/* Boss Question Card */}
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                          {isBn
                            ? BOSS_QUESTIONS[bossQuestionIdx].questionBn
                            : BOSS_QUESTIONS[bossQuestionIdx].questionEn}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {(isBn
                            ? BOSS_QUESTIONS[bossQuestionIdx].optionsBn
                            : BOSS_QUESTIONS[bossQuestionIdx].optionsEn
                          ).map((opt, oIdx) => {
                            const isCurrentSelected = bossSelectedOption === oIdx;
                            const isCorrect = oIdx === BOSS_QUESTIONS[bossQuestionIdx].correctIdx;

                            let btnStyle = 'bg-card border-border hover:bg-muted text-foreground';
                            if (bossSelectedOption !== null) {
                              if (isCorrect) {
                                btnStyle = 'bg-emerald-500 text-white border-emerald-600';
                              } else if (isCurrentSelected) {
                                btnStyle = 'bg-destructive text-destructive-foreground border-destructive';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={bossSelectedOption !== null}
                                onClick={() => {
                                  setBossSelectedOption(oIdx);
                                  if (oIdx === BOSS_QUESTIONS[bossQuestionIdx].correctIdx) {
                                    setBossScore((s) => s + 1);
                                    setBossAnswerStatus('correct');
                                  } else {
                                    setBossAnswerStatus('incorrect');
                                  }

                                  setTimeout(() => {
                                    if (bossQuestionIdx + 1 < BOSS_QUESTIONS.length) {
                                      setBossQuestionIdx((i) => i + 1);
                                      setBossSelectedOption(null);
                                      setBossAnswerStatus(null);
                                    } else {
                                      setBossFinished(true);
                                      setBossActive(false);
                                      if (bossScore + (oIdx === BOSS_QUESTIONS[bossQuestionIdx].correctIdx ? 1 : 0) >= 6) {
                                        setCompletedQuests((prev) => ({ ...prev, boss: true }));
                                      }
                                    }
                                  }, 1200);
                                }}
                                className={`p-4 rounded-xl border text-left font-bold text-xs sm:text-sm transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {bossAnswerStatus && (
                          <div className="text-xs pt-1 text-muted-foreground animate-in fade-in">
                            💡{' '}
                            {isBn
                              ? BOSS_QUESTIONS[bossQuestionIdx].explanationBn
                              : BOSS_QUESTIONS[bossQuestionIdx].explanationEn}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {bossFinished && (
                    <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-500 text-3xl">
                        {bossScore >= 6 ? '🏆' : '💀'}
                      </div>
                      <h3 className="text-2xl font-black text-foreground">
                        {bossScore >= 6
                          ? isBn
                            ? 'অভিনন্দন! তুমি বসকে পরাজিত করেছ!'
                            : 'Victory! You Defeated the Boss!'
                          : isBn
                          ? 'সময় শেষ! পুনরায় চেষ্টা করো'
                          : 'Game Over! Try Again'}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        চূড়ান্ত স্কোর: {bossScore} / {BOSS_QUESTIONS.length}
                      </p>

                      <button
                        onClick={() => {
                          setBossActive(true);
                          setBossTimeLeft(60);
                          setBossScore(0);
                          setBossQuestionIdx(0);
                          setBossFinished(false);
                          setBossSelectedOption(null);
                          setBossAnswerStatus(null);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>{isBn ? 'আবার খেলো' : 'Play Again'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Sheru Socratic Companion */}
      <SheruCompanion
        chapterName="সূচক ও লগারিদম (Exponents & Logarithms)"
        currentQuestTitle={
          activeTab === 'board_master'
            ? 'বোর্ড মাস্টার গাইড'
            : activeQuest === 'paper_fold'
            ? 'কাগজ ভাঁজে চাঁদে'
            : activeQuest === 'richter_sound'
            ? 'রিখটার ও শব্দ কম্প্রেসর'
            : activeQuest === 'power_balancer'
            ? 'সমীকরণ তুলাদণ্ড'
            : activeQuest === 'scientific_notation'
            ? 'পূর্ণক ও অংশক ল্যাব'
            : '৬০ সে. বস রাশ'
        }
        greetingBn="আরে দোস্ত! আমি শেরু। সূচক ও লগারিদমের কোনো সূত্র বা ট্র্যাপ বুঝতে সমস্যা হলে আমাকে বলো, আমি বুঝিয়ে দিচ্ছি!"
        greetingEn="Hey there! I am Sheru. Confused about any exponents laws or log bases? Ask me anything!"
        presetQuestions={[
          'a⁰ = ১ কেন হয়?',
          'লগ এর মধ্যে ঋণাত্মক সংখ্যা বসানো যায় না কেন?',
          'কাগজ ভাঁজ করে সত্যি কি চাঁদে যাওয়া সম্ভব?',
          'রিখটার স্কেলে ১ বাড়লে ভূমিকম্প কতগুণ বাড়ে?',
          'পূর্ণক ও অংশক কীভাবে সহজে মনে রাখব?',
        ]}
      />
    </div>
  );
}
