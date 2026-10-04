'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  Award,
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
  GitBranch,
  Scale,
  TrendingUp,
  CheckSquare,
  Eye,
  RotateCcw,
  Maximize2,
  Minimize2,
  Layers,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Divide,
  Grid,
  Hash,
  Binary,
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

const LAB_LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'সমান্তর ধারা ও n-তম পদ সিমুলেটর ল্যাব',
    subtitle: 'Arithmetic Progression (AP) & n-th Term Generator',
    nctbPage: 'অনুশীলনী ১৩.১ • পৃষ্ঠা ২৫৫',
    badge: 'মৌলিক সূত্র',
    intro:
      'যে ধারার যেকোনো পদ ও তার পূর্ববর্তী পদের পার্থক্য সব সময় সমান থাকে, তাকে সমান্তর ধারা বলে। প্রথম পদ a এবং সাধারণ অন্তর d হলে n-তম পদ = a + (n - 1)d সূত্রের ভিজ্যুয়াল ল্যাব।',
  },
  {
    id: 2,
    title: 'সমান্তর ধারার সমষ্টি ও গাউস পেয়ারিং ল্যাব',
    subtitle: 'AP Summation Formula Sₙ & Gauss Pair Visualizer',
    nctbPage: 'অনুশীলনী ১৩.১ • পৃষ্ঠা ২৫৯',
    badge: 'বোর্ড CQ মাস্ট',
    intro:
      'সমান্তর ধারার প্রথম n পদের সমষ্টি Sₙ = (n/2)[2a + (n - 1)d]। গণিতবিদ কার্ল ফ্রিডরিখ গাউসের জোড় বাঁধার কৌশল (প্রথম পদ + শেষ পদ = সমান যোগফল) প্রত্যক্ষ করুন।',
  },
  {
    id: 3,
    title: 'বিশেষ ৩টি স্বাভাবিক ধারা ল্যাব (∑n, ∑n², ∑n³)',
    subtitle: 'Sum of Natural Numbers, Squares & Cubes',
    nctbPage: 'অনুশীলনী ১৩.১ • পৃষ্ঠা ২৬২',
    badge: 'বোর্ড স্পেশাল',
    intro:
      'প্রথম n সংখ্যক স্বাভাবিক সংখ্যার সমষ্টি ∑n = n(n+1)/2, বর্গের সমষ্টি ∑n² = n(n+1)(2n+1)/6 এবং ঘনের সমষ্টি ∑n³ = [n(n+1)/2]² = (∑n)² এর চমৎকার জ্যামিতিক ও বীজগাণিতিক প্রমাণ।',
  },
  {
    id: 4,
    title: 'গুণোত্তর ধারা ও সাধারণ অনুপাত ল্যাব',
    subtitle: 'Geometric Progression (GP) & Exponential Growth',
    nctbPage: 'অনুশীলনী ১৩.২ • পৃষ্ঠা ২৬৬',
    badge: 'জ্যামিতিক বৃদ্ধি',
    intro:
      'যে ধারার যেকোনো পদকে তার পূর্ববর্তী পদ দিয়ে ভাগ করলে ভাগফল সর্বদা সমান থাকে, তাকে গুণোত্তর ধারা বলে। প্রথম পদ a এবং সাধারণ অনুপাত r হলে n-তম পদ = a · rⁿ⁻¹।',
  },
  {
    id: 5,
    title: 'গুণোত্তর ধারার সমষ্টি ও লগারিদমিক ধারা ল্যাব',
    subtitle: 'GP Summation (r > 1 vs r < 1) & Logarithmic Series',
    nctbPage: 'অনুশীলনী ১৩.২ • পৃষ্ঠা ২৭১',
    badge: 'উন্নত সমাধান',
    intro:
      'গুণোত্তর ধারার সমষ্টির দুটি রূপ: r > 1 হলে Sₙ = a(rⁿ - 1)/(r - 1) এবং r < 1 হলে Sₙ = a(1 - rⁿ)/(1 - r)। সাথে লগারিদমিক ধারা log 2 + log 4 + log 8 + ... কে সমান্তর ধারায় রূপান্তরের কৌশল।',
  },
];

interface CQSubQuestion {
  part: 'ক' | 'খ' | 'গ';
  marks: number;
  question: string;
  solution: string[];
  examinerSecret: string;
}

interface CQQuestion {
  id: number;
  boardSource: string;
  stem: string;
  subQuestions: CQSubQuestion[];
}

const CHAPTER_CQS: CQQuestion[] = [
  {
    id: 1,
    boardSource: 'ঢাকা বোর্ড ২০২৪ / রাজশাহী বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'একটি সমান্তর ধারার ১ম পদ a এবং সাধারণ অন্তর d। ধারাটির ১২-তম পদ ৭৭ এবং প্রথম ২৩টি পদের সমষ্টি নির্ণয় করতে হবে। অপর একটি ধারা: ৭ + ১২ + ১৭ + ...',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: '৭ + ১২ + ১৭ + ... ধারাটির কোন পদ ১৪২?',
        solution: [
          'প্রদত্ত ধারা: ৭ + ১২ + ১৭ + ...',
          'এখানে, ১ম পদ a = ৭, সাধারণ অন্তর d = ১২ - ৭ = ৫।',
          'মনে করি, n-তম পদ = ১৪২',
          'আমরা জানি, n-তম পদ = a + (n - 1)d',
          '⇒ ৭ + (n - 1) × ৫ = ১৪২',
          '⇒ ৫(n - 1) = ১৪২ - ৭ = ১৩৫',
          '⇒ n - 1 = ১৩৫ / ৫ = ২৭',
          '⇒ n = ২৮',
          'অতএব, ধারাটির ২৮-তম পদ হলো ১৪২।',
        ],
        examinerSecret:
          'a এবং d এর মান স্পষ্ট উল্লেখ করে n-তম পদের সূত্রে নির্ভুল পক্ষান্তর করলে পূর্ণ ২ নম্বর নিশ্চিত।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'ধারাটির ১২-তম পদ ৭৭ হলে প্রথম ২৩টি পদের সমষ্টি নির্ণয় কর।',
        solution: [
          'মনে করি সমান্তর ধারাটির প্রথম পদ a এবং সাধারণ অন্তর d।',
          'শর্তমতে, ১২-তম পদ = a + (১২ - ১)d = ৭৭',
          '⇒ a + ১১d = ৭৭  --- (১)',
          'আমরা জানি, প্রথম n পদের সমষ্টি Sₙ = (n/2)[2a + (n - 1)d]',
          'অতএব প্রথম ২৩টি পদের সমষ্টি S₂₃ = (২৩/২)[২a + (২৩ - ১)d]',
          '= (২৩/২)[২a + ২২d]',
          '= (২৩/২) × ২[a + ১১d]',
          '= ২৩ × [a + ১১d]',
          '= ২৩ × ৭৭  [ (১) নং সমীকরণ হতে মান বসিয়ে ]',
          '= ১৭৭১',
          'অতএব, প্রথম ২৩টি পদের সমষ্টি ১৭৭১।',
        ],
        examinerSecret:
          'এটি বোর্ডের সর্বাধিক জনপ্রিয় প্রশ্ন! ২ কমন নিয়ে a + 11d তৈরি করার ধাপটি দেখালে পরীক্ষক দ্রুত ৪/৪ প্রদান করেন। a ও d এর আলাদা মান বের করার প্রয়োজন নেই।',
      },
      {
        part: 'গ',
        marks: 4,
        question: '৭ + ১২ + ১৭ + ... ধারাটির প্রথম কতটি পদের সমষ্টি ১০৯০ হবে?',
        solution: [
          'ধারাটির ১ম পদ a = ৭, সাধারণ অন্তর d = ৫।',
          'মনে করি প্রথম n সংখ্যক পদের সমষ্টি ১০৯০।',
          'আমরা জানি, Sₙ = (n/2)[২a + (n - 1)d]',
          '⇒ (n/2)[২ × ৭ + (n - 1) × ৫] = ১০৯০',
          '⇒ n[১৪ + ৫n - ৫] = ২১৮০',
          '⇒ n[৫n + ৯] = ২১৮০',
          '⇒ ৫n² + ৯n - ২১৮০ = ০',
          'মিডল-টার্ম উৎপাদক করে পাই: ৫ × ২১৮০ = ১০৯০০ = ১০০ × ১০৯',
          '⇒ ৫n² + ১০৯n - ১০০n - ২১৮০ = ০',
          '⇒ n(৫n + ১০৯) - ২০(৫n + ১০৯) = ০',
          '⇒ (৫n + ১০৯)(n - ২০) = ০',
          'যেহেতু পদের সংখ্যা n ঋণাত্মক বা ভগ্নাংশ হতে পারে না, সুতরাং ৫n + ১০৯ ≠ ০',
          '⇒ n - ২০ = ০ ⇒ n = ২০',
          'অতএব, প্রথম ২০টি পদের সমষ্টি ১০৯০।',
        ],
        examinerSecret:
          'দ্বিঘাত সমীকরণে n এর গ্রহণযোগ্যতা যুক্তি (n ∈ ℕ, n ঋণাত্মক হতে পারে না) উল্লেখ না করলে ১ নম্বর কর্তন করা হয়।',
      },
    ],
  },
  {
    id: 2,
    boardSource: 'চট্টগ্রাম বোর্ড ২০২৪ / দিনাজপুর বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'একটি গুণোত্তর ধারার ৫ম পদ ২√৩ / ৯ এবং ১০ম পদ ৮√২ / ৮১। অপর একটি ধারা: ১/√২, -১, √২, ...',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: '১/√২, -১, √২, ... ধারাটির সাধারণ অনুপাত এবং ৪র্থ পদ নির্ণয় কর।',
        solution: [
          'প্রদত্ত ধারা: ১/√২, -১, √২, ...',
          '১ম পদ a = ১/√২',
          'সাধারণ অনুপাত r = ২য় পদ / ১ম পদ = (-১) / (১/√২) = -√২',
          '৪র্থ পদ = ar⁴⁻¹ = ar³ = (১/√২) × (-√২)³',
          '= (১/√২) × (-২√২) = -২',
          'অতএব, সাধারণ অনুপাত -√২ এবং ৪র্থ পদ -২।',
        ],
        examinerSecret:
          'ঋণাত্মক চিহ্নের ঘাত (-√২)³ = -২√২ সাবধানে লিখুন। চিহ্নের ভুলের জন্য অনেক শিক্ষার্থী ০ পায়।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'উদ্দীপকের ১ম গুণোত্তর ধারাটি নির্ণয় কর।',
        solution: [
          'মনে করি ধারাটির প্রথম পদ a এবং সাধারণ অনুপাত r।',
          '৫ম পদ = ar⁴ = ২√৩ / ৯  --- (১)',
          '১০ম পদ = ar⁹ = ৮√২ / ৮১  --- (২)',
          '(২) নং কে (১) নং দ্বারা ভাগ করে পাই:',
          'ar⁹ / ar⁴ = (৮√২ / ৮১) ÷ (২√৩ / ৯)',
          '⇒ r⁵ = (৮√২ / ৮১) × (৯ / ২√৩)',
          '⇒ r⁵ = ৪√২ / ৯√৩ = (√২)⁵ / (√৩)⁵ = (√২ / √৩)⁵',
          '⇒ r = √২ / √৩',
          'r এর মান (১) নং এ বসিয়ে পাই:',
          'a × (√২ / √৩)⁴ = ২√৩ / ৯',
          '⇒ a × (৪ / ৯) = ২√৩ / ৯',
          '⇒ a = (২√৩ / ৯) × (৯ / ৪) = √৩ / ২',
          'অতএব ধারাটির ২য় পদ ar = (√৩ / ২) × (√২ / √৩) = √২ / ২ = ১ / √২',
          'ধারাটি হলো: √৩/২ + ১/√২ + ...',
        ],
        examinerSecret:
          'r⁵ এর ঘাত সমন্বয়ে (√২/৩)⁵ সঠিকভাবে রূপান্তর করাই প্রধান চ্যালেঞ্জ। উভয় পাশের ঘাত সমীকৃত করে r নির্ণয় করুন।',
      },
      {
        part: 'গ',
        marks: 4,
        question: '১ + ২ + ৪ + ৮ + ... ধারাটির প্রথম কতটি পদের সমষ্টি ১০২৩?',
        solution: [
          'ধারাটির ১ম পদ a = ১, সাধারণ অনুপাত r = ২/১ = ২ > ১।',
          'মনে করি n সংখ্যক পদের সমষ্টি ১০২৩।',
          'আমরা জানি, r > ১ হলে সমষ্টি Sₙ = a(rⁿ - ১) / (r - ১)',
          '⇒ ১(২ⁿ - ১) / (২ - ১) = ১০২৩',
          '⇒ ২ⁿ - ১ = ১০২৩',
          '⇒ ২ⁿ = ১০২৪ = ২¹⁰',
          'উভয় পক্ষ হতে ভিত্তি ২ বর্জন করে পাই: n = ১০',
          'অতএব, প্রথম ১০টি পদের সমষ্টি ১০২৩।',
        ],
        examinerSecret:
          '২¹⁰ = ১০২৪ ঘাত মুখস্থ থাকা বা ক্যালকুলেটরে সঠিক প্রমাণ দেখানো ৪/৪ নম্বর এনে দেবে।',
      },
    ],
  },
  {
    id: 3,
    boardSource: 'কুমিল্লা বোর্ড ২০২৩ / যশোর বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'স্বাভাবিক সংখ্যার তিনটি মৌলিক ধারা: ∑n, ∑n² এবং ∑n³। log 3 + log 9 + log 27 + ... একটি লগারিদমিক ধারা।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'log 3 + log 9 + log 27 + ... ধারাটির সাধারণ অন্তর কত?',
        solution: [
          'ধারাটিকে সাজিয়ে পাই:',
          'log 3 + log 3² + log 3³ + ...',
          '= log 3 + 2 log 3 + 3 log 3 + ...',
          'এখানে ১ম পদ = log 3',
          'সাধারণ অন্তর d = ২য় পদ - ১ম পদ = 2 log 3 - log 3 = log 3।',
          'অতএব, ধারাটির সাধারণ অন্তর log 3।',
        ],
        examinerSecret:
          'লগারিদমের ঘাতের নিয়ম log Mᵏ = k log M স্পষ্ট করে লিখলে ২/২ নিশ্চিত।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'প্রথম n সংখ্যক স্বাভাবিক সংখ্যার ঘনের সমষ্টি ৪৪১ হলে n এর মান এবং ∑n নির্ণয় কর।',
        solution: [
          'আমরা জানি, প্রথম n সংখ্যক স্বাভাবিক সংখ্যার ঘনের সমষ্টি:',
          '∑n³ = [n(n + 1) / 2]² = ৪৪১',
          'উভয় পাশে বর্গমূল করে পাই:',
          'n(n + 1) / 2 = √৪৪১ = ২১  (যেহেতু পদ সমষ্টি ঋণাত্মক হতে পারে না)',
          'আমরা জানি প্রথম n স্বাভাবিক সংখ্যার সমষ্টি ∑n = n(n + 1) / 2 = ২১।',
          'এখন n এর মান নির্ণয় করি:',
          'n(n + 1) = ২১ × ২ = ৪২',
          '⇒ n² + n - ৪২ = ০',
          '⇒ n² + ৭n - ৬n - ৪২ = ০',
          '⇒ n(n + ৭) - ৬(n + ৭) = ০',
          '⇒ (n + ৭)(n - ৬) = ০',
          'যেহেতু n ঋণাত্মক হতে পারে না, n + ৭ ≠ ০।',
          '⇒ n = ৬।',
          'অতএব, n = ৬ এবং ∑n = ২১।',
        ],
        examinerSecret:
          '∑n³ = (∑n)² সরাসরি ব্যবহার করে √৪৪১ = ২১ লিখলে পূর্ণ নম্বর পাবেন। আলাদা করে দীর্ঘ ক্যালকুলেশনের দরকার নেই।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'প্রমাণ কর যে, ∑n³ = [n(n + 1) / 2]²',
        solution: [
          'আমরা জানি বীজগাণিতিক অভেদ: (r + 1)² - (r - 1)² = 4r',
          'উভয় পক্ষকে r² দ্বারা গুণ করে পাই: (r + 1)² r² - (r - 1)² r² = 4r³',
          'বা, r³ = (1/4) [ {r(r + 1)}² - {(r - 1)r}² ]',
          'r = 1, 2, 3, ..., n বসিয়ে যোগ করে পাই:',
          '1³ = (1/4) [ {1 × 2}² - {0 × 1}² ]',
          '2³ = (1/4) [ {2 × 3}² - {1 × 2}² ]',
          '3³ = (1/4) [ {3 × 4}² - {2 × 3}² ]',
          '...',
          'n³ = (1/4) [ {n(n + 1)}² - {(n - 1)n}² ]',
          'যোগ করলে মধ্যবর্তী পদসমূহ পরস্পর কেটে যায় (Telescoping sum):',
          '1³ + 2³ + 3³ + ... + n³ = (1/4) [ {n(n + 1)}² - 0 ]',
          '= [ n(n + 1) / 2 ]²',
          'অতএব, ∑n³ = [ n(n + 1) / 2 ]² (প্রমাণিত)।',
        ],
        examinerSecret:
          'টেলিস্কোপিক ক্যান্সেলেশন সুন্দরভাবে কলাম আকারে দেখালে পরীক্ষক ইমপ্রেসড হয়ে সম্পূর্ণ ৪ নম্বর দেন।',
      },
    ],
  },
];

interface MCQItem {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const CHAPTER_MCQS: MCQItem[] = [
  {
    id: 1,
    question: 'একটি সমান্তর ধারার প্রথম পদ a এবং সাধারণ অন্তর d হলে এর n-তম পদ কোনটি?',
    options: ['A. a + (n - 1)d', 'B. a + nd', 'C. a + (n + 1)d', 'D. (n/2)[2a + (n - 1)d]'],
    correctAnswerIndex: 0,
    explanation:
      'সমান্তর ধারার n-তম পদ = a + (n - 1)d। আর সমষ্টির সূত্র হলো (n/2)[2a + (n - 1)d]।',
  },
  {
    id: 2,
    question: '১ + ৩ + ৫ + ... + (২n - ১) ধারাটির প্রথম n পদের সমষ্টি কত?',
    options: ['A. n(n + 1) / 2', 'B. n²', 'C. n(n - 1)', 'D. 2n²'],
    correctAnswerIndex: 1,
    explanation:
      'প্রথম n সংখ্যক বিজোড় স্বাভাবিক সংখ্যার সমষ্টি সর্বদা n²। যেমন: ১ম ২টি পদের সমষ্টি ১+৩ = ৪ = ২²; ১ম ৩টি ১+৩+৫ = ৯ = ৩²।',
  },
  {
    id: 3,
    question: 'একটি গুণোত্তর ধারার প্রথম পদ a = ৩ এবং সাধারণ অনুপাত r = ২ হলে এর ৫ম পদ কত?',
    options: ['A. ২৪', 'B. ৩২', 'C. ৪৮', 'D. ৯৬'],
    correctAnswerIndex: 2,
    explanation:
      'গুণোত্তর ধারার n-তম পদ = arⁿ⁻¹। সুতরাং ৫ম পদ = ৩ × ২⁵⁻¹ = ৩ × ২⁴ = ৩ × ১৬ = ৪৮।',
  },
  {
    id: 4,
    question: 'প্রথম n সংখ্যক স্বাভাবিক সংখ্যার সমষ্টি ∑n = ১৫ হলে ঘনের সমষ্টি ∑n³ কত?',
    options: ['A. ২২৫', 'B. ৪৫০', 'C. ৮১', 'D. ৩৩০০'],
    correctAnswerIndex: 0,
    explanation:
      'এনসিটিবি সম্পর্ক: ∑n³ = (∑n)²। অতএব ∑n = ১৫ হলে ∑n³ = ১৫² = ২২৫।',
  },
  {
    id: 5,
    question: 'log 2 + log 4 + log 8 + ... ধারাটির সাধারণ অন্তর কত?',
    options: ['A. log 4', 'B. log 2', 'C. 2', 'D. 1'],
    correctAnswerIndex: 1,
    explanation:
      'log 2 + 2 log 2 + 3 log 2 + ... এর যেকোনো পদ ও পূর্ববর্তী পদের বিয়োগফল (2 log 2 - log 2) = log 2।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathFiniteSeriesGuidebook() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1 state (AP & n-th Term)
  const [lab1A, setLab1A] = useState<number>(3);
  const [lab1D, setLab1D] = useState<number>(4);
  const [lab1N, setLab1N] = useState<number>(8);

  // Lab 2 state (AP Summation & Gauss Pairing)
  const [lab2A, setLab2A] = useState<number>(2);
  const [lab2D, setLab2D] = useState<number>(3);
  const [lab2N, setLab2N] = useState<number>(6);

  // Lab 3 state (Special Series: sum n, sum n^2, sum n^3)
  const [lab3SeriesType, setLab3SeriesType] = useState<'linear' | 'square' | 'cube'>('linear');
  const [lab3N, setLab3N] = useState<number>(6);

  // Lab 4 state (GP & Exponential Growth)
  const [lab4A, setLab4A] = useState<number>(2);
  const [lab4R, setLab4R] = useState<number>(2);
  const [lab4N, setLab4N] = useState<number>(6);

  // Lab 5 state (GP Summation & Log Series)
  const [lab5Mode, setLab5Mode] = useState<'gpSum' | 'logSeries'>('gpSum');
  const [lab5A, setLab5A] = useState<number>(1);
  const [lab5R, setLab5R] = useState<number>(2);
  const [lab5N, setLab5N] = useState<number>(5);
  const [lab5LogBase, setLab5LogBase] = useState<number>(2);

  // Step 2 CQs state
  const [selectedCQId, setSelectedCQId] = useState<number>(1);

  // Step 3 Interactive Challenges state
  const [userAns1, setUserAns1] = useState<string>('');
  const [userAns2, setUserAns2] = useState<string>('');
  const [userAns3, setUserAns3] = useState<string>('');
  const [isAns1Correct, setIsAns1Correct] = useState<boolean | null>(null);
  const [isAns2Correct, setIsAns2Correct] = useState<boolean | null>(null);
  const [isAns3Correct, setIsAns3Correct] = useState<boolean | null>(null);

  // Step 4 MCQs state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showMCQResults, setShowMCQResults] = useState<boolean>(false);

  // Sheru AI Tutor state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<
    Array<{ sender: 'user' | 'sheru'; text: string; time: string }>
  >([
    {
      sender: 'sheru',
      text: 'স্বাগতম! আমি শেরু — তোমার সসীম ধারা (Finite Series) গাইড। সমান্তর ধারা, গুণোত্তর ধারা, গাউসের সমষ্টি বা ঘনের সমষ্টি নিয়ে যেকোনো প্রশ্ন থাকলে নির্দ্বিধায় বলো!',
      time: 'এখনই',
    },
  ]);
  const [aiInputText, setAiInputText] = useState<string>('');

  // Summary state
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  // Calculations for Lab 1
  const lab1NthTerm = lab1A + (lab1N - 1) * lab1D;
  const lab1Terms = Array.from({ length: Math.min(lab1N, 8) }, (_, i) => lab1A + i * lab1D);

  // Calculations for Lab 2
  const lab2LastTerm = lab2A + (lab2N - 1) * lab2D;
  const lab2Sum = (lab2N / 2) * (2 * lab2A + (lab2N - 1) * lab2D);
  const lab2Terms = Array.from({ length: lab2N }, (_, i) => lab2A + i * lab2D);

  // Calculations for Lab 3
  const lab3SumLinear = (lab3N * (lab3N + 1)) / 2;
  const lab3SumSquare = (lab3N * (lab3N + 1) * (2 * lab3N + 1)) / 6;
  const lab3SumCube = Math.pow((lab3N * (lab3N + 1)) / 2, 2);

  // Calculations for Lab 4
  const lab4NthTerm = lab4A * Math.pow(lab4R, lab4N - 1);
  const lab4Terms = Array.from({ length: Math.min(lab4N, 7) }, (_, i) => lab4A * Math.pow(lab4R, i));

  // Calculations for Lab 5
  let lab5GpSum = 0;
  if (lab5R === 1) {
    lab5GpSum = lab5A * lab5N;
  } else if (lab5R > 1) {
    lab5GpSum = (lab5A * (Math.pow(lab5R, lab5N) - 1)) / (lab5R - 1);
  } else {
    lab5GpSum = (lab5A * (1 - Math.pow(lab5R, lab5N))) / (1 - lab5R);
  }

  // Handlers for Step 3 Challenges
  const handleCheckChallenge1 = () => {
    // 5 + 8 + 11 + ... (a=5, d=3) -> 12th term = 5 + 11*3 = 38
    const val = userAns1.trim();
    if (val === '38' || val === '৩৮') {
      setIsAns1Correct(true);
    } else {
      setIsAns1Correct(false);
    }
  };

  const handleCheckChallenge2 = () => {
    // 2 + 4 + 8 + ... (a=2, r=2) -> sum of first 6 terms = 2*(2^6 - 1)/(2 - 1) = 2*63 = 126
    const val = userAns2.trim();
    if (val === '126' || val === '১২৬') {
      setIsAns2Correct(true);
    } else {
      setIsAns2Correct(false);
    }
  };

  const handleCheckChallenge3 = () => {
    // First 10 natural numbers sum = 10*11/2 = 55
    const val = userAns3.trim();
    if (val === '55' || val === '৫৫') {
      setIsAns3Correct(true);
    } else {
      setIsAns3Correct(false);
    }
  };

  // Handlers for Step 4 MCQs
  const handleSelectMCQ = (questionId: number, optionIdx: number) => {
    if (showMCQResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateMCQScore = () => {
    let score = 0;
    CHAPTER_MCQS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  // AI Drawer send message
  const handleSendAiMessage = (customText?: string) => {
    const textToSend = customText || aiInputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: 'এখনই',
    };
    setAiChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setAiInputText('');

    setTimeout(() => {
      let reply =
        'চমৎকার প্রশ্ন! সসীম ধারায় মনে রাখবে: সমান্তর ধারায় সাধারণ অন্তর বিয়োগ করে পাই (u₂ - u₁), আর গুণোত্তর ধারায় ভাগ করে অনুপাত পাই (u₂ / u₁)।';
      if (textToSend.includes('গাউস') || textToSend.includes('জোড়') || textToSend.includes('সমষ্টি')) {
        reply =
          'গাউসের জাদুকরী ট্রিক: ১ থেকে ১০০ যোগ করার সময় প্রথম পদ ও শেষ পদের জোড় ১ + ১০০ = ১০১, ২ + ৯৯ = ১০১... এভাবে ৫০টি জোড় তৈরি হয়। মোট সমষ্টি = ৫০ × ১০১ = ৫০৫০!';
      } else if (textToSend.includes('ঘন') || textToSend.includes('বর্গ') || textToSend.includes('স্বাভাবিক')) {
        reply =
          'এনসিটিবি গোল্ডেন রুল: স্বাভাবিক সংখ্যার ঘনের সমষ্টি ∑n³ হলো স্বাভাবিক সংখ্যার সমষ্টি ∑n এর পূর্ণ বর্গ, অর্থাৎ ∑n³ = (∑n)²। যেমন ∑n = ১৫ হলে ∑n³ = ১৫² = ২২৫!';
      } else if (textToSend.includes('লগ') || textToSend.includes('লগারিদম')) {
        reply =
          'লগারিদমিক ধারায় log 2 + log 4 + log 8 + ... কে log 2 + 2 log 2 + 3 log 2 + ... লেখা যায়। এখান থেকে log 2 কমন নিলে সাধারণ স্বাভাবিক ধারা (1 + 2 + 3 + ... + n) তৈরি হয়!';
      }
      setAiChatMessages((prev) => [
        ...prev,
        {
          sender: 'sheru',
          text: reply,
          time: 'এখনই',
        },
      ]);
    }, 600);
  };

  const handleCopyCheatSheet = () => {
    const text = `NCTB নবম-দশম সাধারণ গণিত • অধ্যায় ১৩: সসীম ধারা (Finite Series)
১. সমান্তর ধারা (Arithmetic Progression - AP):
   • n-তম পদ = a + (n - 1)d
   • প্রথম n পদের সমষ্টি Sₙ = (n/2)[2a + (n - 1)d] = (n/2)(প্রথম পদ + শেষ পদ)
২. বিশেষ ৩টি ধারার সমষ্টি:
   • প্রথম n স্বাভাবিক সংখ্যার সমষ্টি ∑n = n(n + 1) / 2
   • স্বাভাবিক সংখ্যার বর্গের সমষ্টি ∑n² = n(n + 1)(2n + 1) / 6
   • স্বাভাবিক সংখ্যার ঘনের সমষ্টি ∑n³ = [n(n + 1) / 2]² = (∑n)²
৩. গুণোত্তর ধারা (Geometric Progression - GP):
   • n-তম পদ = a · rⁿ⁻¹
   • যখন r > 1: Sₙ = a(rⁿ - 1) / (r - 1)
   • যখন r < 1: Sₙ = a(1 - rⁿ) / (1 - r)
৪. লগারিদমিক ধারা সমান্তর রূপান্তর:
   • log a + log a² + log a³ + ... = log a · (1 + 2 + 3 + ... + n) = log a · [n(n + 1) / 2]`;

    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2500);
  };

  const currentLab = LAB_LESSONS.find((l) => l.id === activeLabId) || LAB_LESSONS[0];
  const currentCQ = CHAPTER_CQS.find((c) => c.id === selectedCQId) || CHAPTER_CQS[0];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="math"
        subjectNameBn="সাধারণ গণিত"
        chapterNum={13}
        chapterTitleBn="সসীম ধারা (Finite Series)"
        activeLesson={activeLabId}
        activeLessonTitle={currentLab.title}
        onOpenAi={() => setIsAiDrawerOpen(true)}
        aiButtonLabel="শেরু এআই টিউটর"
      />

      {/* 5-Step Learning Framework Navigation Sub-Bar */}
      <div className="border-b border-border bg-card/90 backdrop-blur-md sticky top-[49px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-medium overflow-x-auto w-fit">
            <button
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 1
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>১. কনসেপ্ট ল্যাব</span>
            </button>
            <button
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 2
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>২. বোর্ড CQ</span>
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 3
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>৩. নিজে করো</span>
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 4
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>৪. যাচাই</span>
            </button>
            <button
              onClick={() => setActiveStep(5)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 5
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>৫. সারসংক্ষেপ</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* ================================================================== */}
        {/* STEP 1: LEARN CONCEPT (৫টি ইন্টারেক্টিভ ল্যাব) */}
        {/* ================================================================== */}
        {activeStep === 1 && (
          <div className="space-y-6">
            {/* Lab Sub-Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              {LAB_LESSONS.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setActiveLabId(lab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeLabId === lab.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">
                    {lab.id}
                  </span>
                  <span>{lab.title}</span>
                </button>
              ))}
            </div>

            {/* Current Lab Intro Header */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {currentLab.badge}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {currentLab.nctbPage}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">{currentLab.subtitle}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
                {currentLab.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentLab.intro}
              </p>
            </div>

            {/* ---------------- LAB 1: AP & N-TH TERM ---------------- */}
            {activeLabId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Sliders className="w-4 h-4 text-primary" />
                      সমান্তর ধারার প্যারামিটার
                    </h3>
                  </div>

                  {/* 3 Quick Presets */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setLab1A(3);
                        setLab1D(4);
                        setLab1N(8);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      d = ৪ (বৃদ্ধি)
                    </button>
                    <button
                      onClick={() => {
                        setLab1A(29);
                        setLab1D(-4);
                        setLab1N(8);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      d = -৪ (হ্রাসমান)
                    </button>
                    <button
                      onClick={() => {
                        setLab1A(2);
                        setLab1D(2);
                        setLab1N(10);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      জোড় সংখ্যা
                    </button>
                  </div>

                  {/* Slider a (1st term) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        ১ম পদ (a):
                      </span>
                      <span className="font-bold text-primary">{lab1A}</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="30"
                      value={lab1A}
                      onChange={(e) => setLab1A(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider d (Common diff) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        সাধারণ অন্তর (d):
                      </span>
                      <span className="font-bold text-primary">{lab1D}</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="15"
                      value={lab1D}
                      onChange={(e) => setLab1D(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider n (Term index) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        পদের ক্রম (n):
                      </span>
                      <span className="font-bold text-primary">{lab1N}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={lab1N}
                      onChange={(e) => setLab1N(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Formula Preview Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-500">সূত্র: uₙ = a + (n - 1)d</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      u_{lab1N} = {lab1A} + ({lab1N} - 1) × ({lab1D}) = {lab1NthTerm}
                    </div>
                  </div>
                </div>

                {/* Visualizer Panel */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      ধারার পদসমূহের ক্রম ও বৃদ্ধি গ্রাফ
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      {lab1N}-তম পদ = {lab1NthTerm}
                    </span>
                  </div>

                  {/* First terms sequence ribbon */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 font-medium">ধারার প্রাথমিক পদসমূহ:</div>
                    <div className="flex flex-wrap gap-2">
                      {lab1Terms.map((term, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-2 rounded-xl text-center border transition-all ${
                            idx + 1 === lab1N
                              ? 'bg-primary text-white border-primary shadow-sm scale-105 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs'
                          }`}
                        >
                          <div className="text-[10px] opacity-75">{idx + 1}-তম পদ</div>
                          <div className="text-sm font-mono">{term}</div>
                        </div>
                      ))}
                      {lab1N > 8 && (
                        <div className="px-3 py-2 rounded-xl flex items-center justify-center text-slate-400 font-mono text-xs">
                          ... + {lab1NthTerm}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visual Bar representation */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      পদসমূহের উচ্চতা তুলনা (Growth Ladder):
                    </div>
                    <div className="h-32 flex items-end gap-2 pt-4 px-2 overflow-x-auto">
                      {lab1Terms.map((term, idx) => {
                        const maxVal = Math.max(...lab1Terms, Math.abs(lab1NthTerm), 1);
                        const heightPct = Math.min(Math.max((Math.abs(term) / maxVal) * 90, 10), 100);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 min-w-[28px]">
                            <span className="text-[10px] font-mono text-slate-500">{term}</span>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-t-md transition-all ${
                                idx + 1 === lab1N
                                  ? 'bg-primary'
                                  : term >= 0
                                  ? 'bg-emerald-500/80 dark:bg-emerald-600/80'
                                  : 'bg-rose-500/80'
                              }`}
                            />
                            <span className="text-[9px] text-slate-400">u_{idx + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">বোর্ড টিপ:</span> সাধারণ অন্তর d সর্বদা (যেকোনো পদ - পূর্ববর্তী পদ)। পদ হ্রাস পেলে d এর মান ঋণাত্মক হবে।
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 2: AP SUM & GAUSS PAIRING ---------------- */}
            {activeLabId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Scale className="w-4 h-4 text-primary" />
                      সমষ্টি ও গাউস পেয়ারিং প্যারামিটার
                    </h3>
                  </div>

                  {/* Slider a */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">১ম পদ (a):</span>
                      <span className="font-bold text-primary">{lab2A}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={lab2A}
                      onChange={(e) => setLab2A(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider d */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">সাধারণ অন্তর (d):</span>
                      <span className="font-bold text-primary">{lab2D}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={lab2D}
                      onChange={(e) => setLab2D(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider n (Even for clean pairing) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">পদ সংখ্যা (n):</span>
                      <span className="font-bold text-primary">{lab2N}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="2"
                      value={lab2N}
                      onChange={(e) => setLab2N(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Sum Formulas Comparison */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">২টি অভিন্ন সমষ্টি সূত্র:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      ১. Sₙ = (n/2)[2a + (n-1)d] = ({lab2N}/2)[2×{lab2A} + ({lab2N}-1)×{lab2D}] = {lab2Sum}
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ২. Sₙ = (n/2)(১ম পদ + শেষ পদ) = ({lab2N}/2)({lab2A} + {lab2LastTerm}) = {lab2Sum}
                    </div>
                  </div>
                </div>

                {/* Gauss Pairing Visualizer */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      গাউসের জোড় বাঁধা কৌশল (Gauss Pair Theorem)
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      মোট সমষ্টি = {lab2Sum}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    সমান্তর ধারার প্রথম পদ ও শেষ পদ যোগ করলে যে মান পাওয়া যায়, দ্বিতীয় পদ ও শেষ পদের আগের পদ যোগ করলেও ঠিক একই মান পাওয়া যায়:
                  </p>

                  {/* Pairs Cards */}
                  <div className="space-y-2.5">
                    {Array.from({ length: lab2N / 2 }).map((_, i) => {
                      const leftIdx = i;
                      const rightIdx = lab2N - 1 - i;
                      const leftVal = lab2Terms[leftIdx];
                      const rightVal = lab2Terms[rightIdx];
                      const pairSum = leftVal + rightVal;
                      return (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                              {i + 1}
                            </span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                              u_{leftIdx + 1} ({leftVal}) + u_{rightIdx + 1} ({rightVal})
                            </span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            = {pairSum}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 font-mono">
                    মোট জোড়ের সংখ্যা = {lab2N}/2 = {lab2N / 2} টি।
                    <br />
                    মোট সমষ্টি = {lab2N / 2} × ({lab2A + lab2LastTerm}) = {lab2Sum}।
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 3: SPECIAL SERIES ---------------- */}
            {activeLabId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Binary className="w-4 h-4 text-purple-500" />
                      বিশেষ ধারার প্রকার নির্বাচন
                    </h3>
                  </div>

                  {/* Toggle 3 Types */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setLab3SeriesType('linear')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                        lab3SeriesType === 'linear'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold">১. স্বাভাবিক সংখ্যার সমষ্টি (∑n)</div>
                      <div className="text-[11px] opacity-75 font-mono">১ + ২ + ৩ + ... + n = n(n+1)/2</div>
                    </button>

                    <button
                      onClick={() => setLab3SeriesType('square')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                        lab3SeriesType === 'square'
                          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-100 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold">২. স্বাভাবিক সংখ্যার বর্গের সমষ্টি (∑n²)</div>
                      <div className="text-[11px] opacity-75 font-mono">১² + ২² + ৩² + ... + n² = n(n+1)(2n+1)/6</div>
                    </button>

                    <button
                      onClick={() => setLab3SeriesType('cube')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                        lab3SeriesType === 'cube'
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-100 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold">৩. স্বাভাবিক সংখ্যার ঘনের সমষ্টি (∑n³)</div>
                      <div className="text-[11px] opacity-75 font-mono">১³ + ২³ + ৩³ + ... + n³ = [n(n+1)/2]²</div>
                    </button>
                  </div>

                  {/* Slider n */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">স্বাভাবিক পদ সংখ্যা (n):</span>
                      <span className="font-bold text-primary">{lab3N}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={lab3N}
                      onChange={(e) => setLab3N(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                {/* Calculation & Identity Proof */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Calculator className="w-4 h-4 text-primary" />
                      ধাপভিত্তিক মান ও সোনালী সম্পর্ক (∑n³ = (∑n)²)
                    </h3>
                  </div>

                  {/* Results Comparison Grid */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                      <div className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">∑n (সমষ্টি)</div>
                      <div className="text-lg font-mono font-bold text-blue-900 dark:text-blue-100 mt-1">
                        {lab3SumLinear}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
                      <div className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">∑n² (বর্গ সমষ্টি)</div>
                      <div className="text-lg font-mono font-bold text-purple-900 dark:text-purple-100 mt-1">
                        {lab3SumSquare}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                      <div className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">∑n³ (ঘন সমষ্টি)</div>
                      <div className="text-lg font-mono font-bold text-amber-900 dark:text-amber-100 mt-1">
                        {lab3SumCube}
                      </div>
                    </div>
                  </div>

                  {/* Golden Identity Card */}
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      এনসিটিবি গোল্ডেন উপপাদ্য প্রমাণ:
                    </div>
                    <div className="text-xs text-emerald-900 dark:text-emerald-100 font-mono leading-relaxed">
                      ∑n³ = ({lab3SumLinear})² = {Math.pow(lab3SumLinear, 2)}
                      <br />
                      সরাসরি গণনায় ∑n³ = {lab3SumCube}
                      <br />
                      সুতরাং, ∑n³ = (∑n)² সর্বদাই সত্য!
                    </div>
                  </div>

                  {/* Active Formula Breakdown */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-xs">
                    <div className="text-slate-500 font-semibold">নির্বাচিত ধারার বিস্তারিত ক্যালকুলেশন:</div>
                    {lab3SeriesType === 'linear' && (
                      <div className="text-slate-800 dark:text-slate-200">
                        {Array.from({ length: lab3N }, (_, i) => i + 1).join(' + ')}
                        <br />= [{lab3N} × ({lab3N} + 1)] / 2 = ({lab3N} × {lab3N + 1}) / 2 = {lab3SumLinear}
                      </div>
                    )}
                    {lab3SeriesType === 'square' && (
                      <div className="text-slate-800 dark:text-slate-200">
                        {Array.from({ length: lab3N }, (_, i) => `${i + 1}²`).join(' + ')}
                        <br />= [{lab3N} × ({lab3N} + 1) × (2×{lab3N} + 1)] / 6 = ({lab3N} × {lab3N + 1} × {2 * lab3N + 1}) / 6 = {lab3SumSquare}
                      </div>
                    )}
                    {lab3SeriesType === 'cube' && (
                      <div className="text-slate-800 dark:text-slate-200">
                        {Array.from({ length: lab3N }, (_, i) => `${i + 1}³`).join(' + ')}
                        <br />= [ {lab3N}({lab3N} + 1) / 2 ]² = [{lab3SumLinear}]² = {lab3SumCube}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 4: GEOMETRIC PROGRESSION ---------------- */}
            {activeLabId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      গুণোত্তর ধারার প্যারামিটার
                    </h3>
                  </div>

                  {/* 3 Quick Presets */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setLab4A(2);
                        setLab4R(2);
                        setLab4N(6);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      r = ২ (দ্বিগুণ)
                    </button>
                    <button
                      onClick={() => {
                        setLab4A(64);
                        setLab4R(0.5);
                        setLab4N(6);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      r = ০.৫ (অর্ধেক)
                    </button>
                    <button
                      onClick={() => {
                        setLab4A(3);
                        setLab4R(-2);
                        setLab4N(6);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      r = -২ (চিহ্ন বদল)
                    </button>
                  </div>

                  {/* Slider a */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">১ম পদ (a):</span>
                      <span className="font-bold text-primary">{lab4A}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={lab4A}
                      onChange={(e) => setLab4A(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider r */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">সাধারণ অনুপাত (r):</span>
                      <span className="font-bold text-primary">{lab4R}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="4"
                      step="0.5"
                      value={lab4R}
                      onChange={(e) => setLab4R(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider n */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">পদের ক্রম (n):</span>
                      <span className="font-bold text-primary">{lab4N}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={lab4N}
                      onChange={(e) => setLab4N(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Formula Preview Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-500">সূত্র: uₙ = a · rⁿ⁻¹</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      u_{lab4N} = {lab4A} × ({lab4R})^{lab4N - 1} = {lab4NthTerm}
                    </div>
                  </div>
                </div>

                {/* Exponential Sequence Display */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      গুণোত্তর বৃদ্ধি ও অনুক্রম ধারা
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      {lab4N}-তম পদ = {lab4NthTerm}
                    </span>
                  </div>

                  {/* Terms cards */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 font-medium">ক্রমিক পদসমূহ (a, ar, ar², ...):</div>
                    <div className="flex flex-wrap gap-2">
                      {lab4Terms.map((term, idx) => (
                        <div
                          key={idx}
                          className={`px-3 py-2 rounded-xl text-center border transition-all ${
                            idx + 1 === lab4N
                              ? 'bg-primary text-white border-primary shadow-sm scale-105 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs'
                          }`}
                        >
                          <div className="text-[10px] opacity-75">{idx + 1}-তম পদ</div>
                          <div className="text-sm font-mono">{term}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Bar representation */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      এক্সপোনেনশিয়াল বৃদ্ধি প্রদর্শন (Exponential Scale):
                    </div>
                    <div className="h-32 flex items-end gap-2 pt-4 px-2 overflow-x-auto">
                      {lab4Terms.map((term, idx) => {
                        const maxVal = Math.max(...lab4Terms.map(Math.abs), 1);
                        const heightPct = Math.min(Math.max((Math.abs(term) / maxVal) * 90, 10), 100);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 min-w-[28px]">
                            <span className="text-[10px] font-mono text-slate-500">{term}</span>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-t-md transition-all ${
                                idx + 1 === lab4N
                                  ? 'bg-primary'
                                  : term >= 0
                                  ? 'bg-blue-500/80 dark:bg-blue-600/80'
                                  : 'bg-rose-500/80'
                              }`}
                            />
                            <span className="text-[9px] text-slate-400">ar^{idx}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">বোর্ড টিপ:</span> সাধারণ অনুপাত r = ২য় পদ / ১ম পদ। অনুপাত ঋণাত্মক হলে পদের চিহ্ন পর্যায়ক্রমে (+), (-), (+), (-) পরিবর্তিত হয়।
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 5: GP SUM & LOGARITHMIC SERIES ---------------- */}
            {activeLabId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Layers className="w-4 h-4 text-primary" />
                      সমষ্টি মোড নির্বাচন
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setLab5Mode('gpSum')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        lab5Mode === 'gpSum'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      গুণোত্তর ধারা সমষ্টি
                    </button>
                    <button
                      onClick={() => setLab5Mode('logSeries')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        lab5Mode === 'logSeries'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      লগারিদমিক ধারা
                    </button>
                  </div>

                  {lab5Mode === 'gpSum' ? (
                    <div className="space-y-4">
                      {/* Slider a */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-300">১ম পদ (a):</span>
                          <span className="font-bold text-primary">{lab5A}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={lab5A}
                          onChange={(e) => setLab5A(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>

                      {/* Slider r */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-300">সাধারণ অনুপাত (r):</span>
                          <span className="font-bold text-primary">{lab5R}</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.5"
                          value={lab5R}
                          onChange={(e) => setLab5R(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>

                      {/* Slider n */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-300">পদ সংখ্যা (n):</span>
                          <span className="font-bold text-primary">{lab5N}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={lab5N}
                          onChange={(e) => setLab5N(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-300">লগের ভিত্তি সংখ্যা:</span>
                          <span className="font-bold text-primary">{lab5LogBase}</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="5"
                          value={lab5LogBase}
                          onChange={(e) => setLab5LogBase(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 dark:text-slate-300">পদের সংখ্যা (n):</span>
                          <span className="font-bold text-primary">{lab5N}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={lab5N}
                          onChange={(e) => setLab5N(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculation breakdown */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  {lab5Mode === 'gpSum' ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <Calculator className="w-4 h-4 text-primary" />
                          গুণোত্তর ধারার সমষ্টি সূত্র নির্বাচন
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                          {lab5R > 1 ? 'r > ১ কেস' : lab5R < 1 ? 'r < ১ কেস' : 'r = ১ কেস'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
                        {lab5R > 1 ? (
                          <>
                            <div className="text-blue-600 dark:text-blue-400 font-semibold">
                              যেহেতু r = {lab5R} &gt; ১, সুতরাং সূত্র:
                            </div>
                            <div className="text-slate-800 dark:text-slate-200">
                              Sₙ = a(rⁿ - 1) / (r - 1)
                              <br />= {lab5A} × ({lab5R}^{lab5N} - 1) / ({lab5R} - 1)
                              <br />= {lab5A} × ({Math.pow(lab5R, lab5N)} - 1) / {lab5R - 1}
                              <br />= <span className="text-primary font-bold text-sm">{lab5GpSum}</span>
                            </div>
                          </>
                        ) : lab5R < 1 ? (
                          <>
                            <div className="text-purple-600 dark:text-purple-400 font-semibold">
                              যেহেতু r = {lab5R} &lt; ১, সুতরাং সূত্র:
                            </div>
                            <div className="text-slate-800 dark:text-slate-200">
                              Sₙ = a(1 - rⁿ) / (1 - r)
                              <br />= {lab5A} × (1 - {lab5R}^{lab5N}) / (1 - {lab5R})
                              <br />= <span className="text-primary font-bold text-sm">{lab5GpSum}</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-slate-800 dark:text-slate-200">
                            যেহেতু r = ১, সুতরাং Sₙ = n × a = {lab5N} × {lab5A} = {lab5GpSum}
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                        <span className="font-semibold text-amber-700 dark:text-amber-400">পরীক্ষকের পছন্দের ফাঁদ:</span> r এর মান ১ এর চেয়ে বড় নাকি ছোট তার ওপর নির্ভর করে ভগ্নাংশের লব ও হরের পদের ক্রম নির্ধারিত হয়।
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          লগারিদমিক ধারার সমান্তর রূপান্তর
                        </h3>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-xs">
                        <div className="text-slate-500 font-semibold">ধারা রূপান্তর ধাপসমূহ:</div>
                        <div className="text-slate-800 dark:text-slate-200 leading-relaxed">
                          log {lab5LogBase} + log {Math.pow(lab5LogBase, 2)} + log {Math.pow(lab5LogBase, 3)} + ... + log {Math.pow(lab5LogBase, lab5N)}
                          <br />
                          = log {lab5LogBase} + 2 log {lab5LogBase} + 3 log {lab5LogBase} + ... + {lab5N} log {lab5LogBase}
                          <br />
                          = log {lab5LogBase} × [ 1 + 2 + 3 + ... + {lab5N} ]
                          <br />
                          = log {lab5LogBase} × [ {lab5N}({lab5N} + 1) / 2 ]
                          <br />
                          = <span className="text-primary font-bold">{((lab5N * (lab5N + 1)) / 2)} log {lab5LogBase}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">মাস্টার টেকনিক:</span> লগারিদমিক ধারা মূলত একটি সমান্তর ধারা যার প্রথম পদ log a এবং সাধারণ অন্তরও log a!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 2: SEE EXAMPLE (বোর্ড সৃজনশীল প্রশ্ন ও সমাধান) */}
        {/* ================================================================== */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  এনসিটিবি বোর্ড সৃজনশীল প্রশ্ন ও আদর্শ সমাধান
                </h2>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                  বিগত বছরের এসএসসি পরীক্ষায় আসা সর্বাধিক গুরুত্বপূর্ণ ৩টি সৃজনশীল প্রশ্ন, পূর্ণাঙ্গ নম্বর বণ্টন ও পরীক্ষকের সিক্রেট নোট।
                </p>
              </div>
            </div>

            {/* CQ Selector Tabs */}
            <div className="flex gap-2">
              {CHAPTER_CQS.map((cq) => (
                <button
                  key={cq.id}
                  onClick={() => setSelectedCQId(cq.id)}
                  className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                    selectedCQId === cq.id
                      ? 'bg-white dark:bg-slate-900 border-primary shadow-sm text-primary font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs text-slate-500">CQ ০{cq.id}</div>
                  <div className="text-xs sm:text-sm truncate">{cq.boardSource}</div>
                </button>
              ))}
            </div>

            {/* Active CQ Full Content */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {currentCQ.boardSource}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-3">
                  উদ্দীপক: {currentCQ.stem}
                </p>
              </div>

              {/* ক, খ, গ Sub-questions */}
              <div className="space-y-6">
                {currentCQ.subQuestions.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {sub.part} ({sub.marks} নম্বর)
                      </span>
                      <span className="text-xs text-slate-400">পূর্ণ নম্বর: {sub.marks}</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {sub.question}
                    </p>

                    <div className="space-y-1 bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
                      {sub.solution.map((line, lIdx) => (
                        <div key={lIdx} className="leading-relaxed">
                          {line}
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">পরীক্ষকের সিক্রেট নোট:</span> {sub.examinerSecret}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 3: TRY YOURSELF (ইন্টারেক্টিভ গণিত চ্যালেঞ্জ) */}
        {/* ================================================================== */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ইন্টারেক্টিভ গণিত চ্যালেঞ্জ (Try Yourself)
                </h2>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  খাতা-কলমে হিসাব করে সঠিক উত্তর টাইপ করুন এবং তাৎক্ষণিক সবুজ টিক অর্জন করুন।
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Challenge 1 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                    চ্যালেঞ্জ ০১: সমান্তর ধারার পদ নির্ণয়
                  </span>
                  {isAns1Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  ৫ + ৮ + ১১ + ১৪ + ... সমান্তর ধারাটির ১২-তম পদ কত?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns1}
                    onChange={(e) => {
                      setUserAns1(e.target.value);
                      setIsAns1Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 38)"
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleCheckChallenge1}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    যাচাই
                  </button>
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                    চ্যালেঞ্জ ০২: গুণোত্তর ধারার সমষ্টি
                  </span>
                  {isAns2Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  ২ + ৪ + ৮ + ১৬ + ... গুণোত্তর ধারাটির প্রথম ৬টি পদের সমষ্টি কত?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns2}
                    onChange={(e) => {
                      setUserAns2(e.target.value);
                      setIsAns2Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 126)"
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleCheckChallenge2}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    যাচাই
                  </button>
                </div>
              </div>

              {/* Challenge 3 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold">
                    চ্যালেঞ্জ ০৩: স্বাভাবিক সংখ্যার সমষ্টি
                  </span>
                  {isAns3Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  প্রথম ১০টি স্বাভাবিক সংখ্যার সমষ্টি (১ + ২ + ৩ + ... + ১০) কত?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns3}
                    onChange={(e) => {
                      setUserAns3(e.target.value);
                      setIsAns3Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 55)"
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleCheckChallenge3}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    যাচাই
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 4: CHECK UNDERSTANDING (৫টি এনসিটিবি এমসিকিউ) */}
        {/* ================================================================== */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  অধ্যায় ১৩ কুইজ ও আত্মযাচাই
                </h2>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  এনসিটিবি স্ট্যান্ডার্ড ৫টি এমসিকিউ প্রশ্ন। অপশন নির্বাচন করে ফলাফল ও বিস্তারিত ব্যাখ্যা দেখুন।
                </p>
              </div>

              {showMCQResults && (
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-500">অর্জিত স্কোর</div>
                  <div className="text-xl font-bold text-primary font-mono">
                    {calculateMCQScore()} / {CHAPTER_MCQS.length}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {CHAPTER_MCQS.map((q, qIdx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCorrect = selectedAnswers[q.id] === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                        {qIdx + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle =
                          'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                        if (selectedAnswers[q.id] === optIdx) {
                          btnStyle = 'border-primary bg-primary/10 text-primary font-bold';
                        }

                        if (showMCQResults) {
                          if (optIdx === q.correctAnswerIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                          } else if (selectedAnswers[q.id] === optIdx) {
                            btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={showMCQResults}
                            onClick={() => handleSelectMCQ(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {showMCQResults && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 mt-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">ব্যাখ্যা:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {!showMCQResults ? (
                <button
                  onClick={() => setShowMCQResults(true)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  উত্তর যাচাই করুন
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMCQResults(false);
                    setSelectedAnswers({});
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 transition-colors"
                >
                  পুনরায় চেষ্টা করুন
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 5: SUMMARY (রিভিশন চিট-শীট ও এক ক্লিকে নোট) */}
        {/* ================================================================== */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  অধ্যায় ১৩: সসীম ধারা রিভিশন চিট-শীট
                </h2>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                  পরীক্ষার আগের রাতের জন্য এনসিটিবি সিলেবাসের সমস্ত মৌলিক সূত্র, বিশেষ ধারা ও লগারিদমিক রূপান্তরের সারসংক্ষেপ।
                </p>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  সমান্তর ধারা (AP)
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• n-তম পদ = a + (n - 1)d</li>
                  <li>• ১ম n পদের সমষ্টি Sₙ = (n/2)[2a + (n - 1)d]</li>
                  <li>• বিকল্প রূপ Sₙ = (n/2)(১ম পদ + শেষ পদ)</li>
                  <li>• জোড় বাঁধার কৌশল = (n/2) × (u₁ + uₙ)</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  বিশেষ ৩টি স্বাভাবিক সমষ্টি
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• ∑n = n(n + 1) / 2</li>
                  <li>• ∑n² = n(n + 1)(2n + 1) / 6</li>
                  <li>• ∑n³ = [n(n + 1) / 2]²</li>
                  <li>• গোল্ডেন সমতা: ∑n³ = (∑n)²</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                  গুণোত্তর ধারা (GP)
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• n-তম পদ = a · rⁿ⁻¹</li>
                  <li>• r &gt; 1 হলে Sₙ = a(rⁿ - 1) / (r - 1)</li>
                  <li>• r &lt; 1 হলে Sₙ = a(1 - rⁿ) / (1 - r)</li>
                  <li>• r = 1 হলে Sₙ = n · a</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  লগারিদমিক ও বিজোড় ধারা
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• log a + log a² + ... = log a · [n(n+1)/2]</li>
                  <li>• সাধারণ অন্তর d = log a</li>
                  <li>• ১ম n বিজোড় সংখ্যার সমষ্টি = n²</li>
                  <li>• ১ম n জোড় সংখ্যার সমষ্টি = n(n + 1)</li>
                </ul>
              </div>
            </div>

            {/* 1-Click Copyable Cheat Sheet */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Copy className="w-4 h-4 text-primary" />
                  এক নজরে রিভিশন নোটস (কপি করুন)
                </h3>
                <button
                  onClick={handleCopyCheatSheet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                >
                  {copiedCheatSheet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCheatSheet ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
{`১. সমান্তর ধারা (AP):
   • n-তম পদ = a + (n - 1)d
   • ১ম n পদের সমষ্টি Sₙ = (n/2)[2a + (n - 1)d] = (n/2)(প্রথম পদ + শেষ পদ)
২. বিশেষ ৩টি সমষ্টি:
   • ∑n = n(n + 1) / 2
   • ∑n² = n(n + 1)(2n + 1) / 6
   • ∑n³ = [n(n + 1) / 2]² = (∑n)²
৩. গুণোত্তর ধারা (GP):
   • n-তম পদ = a · rⁿ⁻¹
   • r > 1 হলে Sₙ = a(rⁿ - 1)/(r - 1)
   • r < 1 হলে Sₙ = a(1 - rⁿ)/(1 - r)
৪. লগারিদমিক ধারা সমান্তর রূপান্তর:
   • log a + log a² + log a³ + ... = log a · [n(n + 1) / 2]`}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Sheru AI Socratic Tutor Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm font-semibold"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>শেরু AI ধারা টিউটর</span>
        </button>
      </div>

      {/* Socratic AI Tutor Slide-out Drawer */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  শেরু
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    শেরু AI সসীম ধারা গাইড
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>সক্রিয় • সমান্তর ও গুণোত্তর ধারা বিশেষজ্ঞ</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => handleSendAiMessage('গাউসের ট্রিক কী?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors text-[11px]"
              >
                গাউসের ট্রিক কী?
              </button>
              <button
                onClick={() => handleSendAiMessage('ঘনের সমষ্টির গোল্ডেন রুল?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors text-[11px]"
              >
                ঘনের সমষ্টির গোল্ডেন রুল?
              </button>
              <button
                onClick={() => handleSendAiMessage('লগ ধারা কীভাবে সমাধান করব?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors text-[11px]"
              >
                লগ ধারা নিয়ম?
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {aiChatMessages.map((msg, mIdx) => (
                <div
                  key={mIdx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Input Area */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendAiMessage();
                }}
                placeholder="সসীম ধারা সম্পর্কিত প্রশ্ন লিখুন..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => handleSendAiMessage()}
                className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shrink-0"
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
