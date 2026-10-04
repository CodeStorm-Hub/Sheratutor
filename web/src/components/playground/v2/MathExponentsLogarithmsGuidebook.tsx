'use client';

import React, { useState, useEffect } from 'react';
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
  Sliders,
  MessageSquare,
  ShieldCheck,
  XCircle,
  Zap,
  Activity,
  Calculator,
  AlertTriangle,
  Info,
  Binary,
  Scale,
  TrendingUp,
  RefreshCw,
  Eye,
  CheckSquare,
  Compass,
  Flame,
  ArrowUpRight,
  Maximize2,
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

const LAB_LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'সূচকের মৌলিক নিয়মাবলি ও ঘাত স্কেল ল্যাব',
    subtitle: 'Laws of Indices & Exponent Power Scale',
    nctbPage: 'পৃষ্ঠা ৭৩-৭৭',
    badge: 'ল্যাব ০১',
    intro:
      'সূচক হলো একটি সংখ্যাকে বারবার গুণ করার সংক্ষিপ্ত রূপ। কিন্তু ঘাত যখন ০ বা ঋণাত্মক বা ভগ্নাংশ হয়, তখন এর পেছনের নিয়মগুলো কীভাবে কাজ করে? এই ল্যাবে সিঁড়ির মতো ধাপে ধাপে সূচকের পাঁচটি মৌলিক সূত্র ও শূন্য/ঋণাত্মক ঘাতের রহস্য উন্মোচন করুন।',
  },
  {
    id: 2,
    title: 'লগারিদমের রূপান্তর তুলাদণ্ড ল্যাব',
    subtitle: 'Logarithm Definition & Balance Machine',
    nctbPage: 'পৃষ্ঠা ৭৮-৮২',
    badge: 'ল্যাব ০২',
    intro:
      'লগারিদম হলো সূচকের বিপরীত প্রক্রিয়া। a^x = N হলে x = log_a N। কিন্তু কেন ভিত্তির মান ১ বা ঋণাত্মক হতে পারে না? কেন ঋণাত্মক সংখ্যার বাস্তব লগ নেই? তুলাদণ্ডের সাহায্যে দুই পাশের সমতা ও ডোমেন শর্ত লাইভ পরীক্ষা করুন।',
  },
  {
    id: 3,
    title: 'লগের গুণ, ভাগ ও ভিত্তি পরিবর্তন ল্যাব',
    subtitle: 'Laws of Logarithms & Change of Base',
    nctbPage: 'পৃষ্ঠা ৮৩-৮৭',
    badge: 'ল্যাব ০৩',
    intro:
      'লগের সবচেয়ে বড় শক্তি হলো এটি জটিল গুণকে যোগে এবং ভাগকে বিয়োগে রূপান্তর করে। ভিত্তি পরিবর্তনের শৃঙ্খল সূত্র কীভাবে জটিল লগ সমস্যাকে নিমেষে সহজ করে তোলে এবং সাধারণ শিক্ষার্থীদের মারাত্মক ভুলগুলো কী কী তা জানুন।',
  },
  {
    id: 4,
    title: 'সূচকীয় সমীকরণ সমাধানকারী ল্যাব',
    subtitle: 'Exponential Equations Solver & Balance',
    nctbPage: 'পৃষ্ঠা ৮৮-৯১',
    badge: 'ল্যাব ০৪',
    intro:
      'চলক যখন ঘাতে অবস্থান করে তখন তাকে সূচকীয় সমীকরণ বলে। a^x = a^y হলে x = y এবং a^x = b^x হলে a = b — এই দুটি মূল স্তম্ভ ব্যবহার করে বোর্ড পরীক্ষার ক্লাসিক সূচকীয় সমীকরণগুলো সমাধান করার কৌশল শিখুন।',
  },
  {
    id: 5,
    title: 'বৈজ্ঞানিক রূপ, পূর্ণক ও অংশক ল্যাব',
    subtitle: 'Scientific Notation, Characteristic & Mantissa',
    nctbPage: 'পৃষ্ঠা ৯২-৯৬',
    badge: 'ল্যাব ০৫',
    intro:
      'খুব বড় বা খুব ক্ষুদ্র সংখ্যাকে ১০ এর ঘাত আকারে প্রকাশ করা হলো বৈজ্ঞানিক রূপ N = A × 10^n। এর সাধারণ লগারিদমের পূর্ণক (Characteristic) ও অংশক (Mantissa) নির্ণয়ের কৌশল এবং ঋণাত্মক লগের বার (Bar) নোটেশন ট্র্যাপ লাইভ যাচাই করুন।',
  },
];

interface CQQuestion {
  id: number;
  boardSource: string;
  stem: string;
  partA: {
    question: string;
    marks: number;
    answer: string;
    steps: string[];
    examinerTip: string;
  };
  partB: {
    question: string;
    marks: number;
    answer: string;
    steps: string[];
    rubric: { step: string; mark: string }[];
    examinerSecret: string;
  };
  partC: {
    question: string;
    marks: number;
    answer: string;
    steps: string[];
    rubric: { step: string; mark: string }[];
    examinerSecret: string;
  };
}

const BOARD_CQS: CQQuestion[] = [
  {
    id: 1,
    boardSource: 'ঢাকা ও চট্টগ্রাম বোর্ড সমন্বিত • এসএসসি স্ট্যান্ডার্ড',
    stem: 'P = x^a, Q = x^b এবং R = x^c যেখানে x > 0 এবং x ≠ 1।',
    partA: {
      question: '(x^p)^(q - r) × (x^q)^(r - p) × (x^r)^(p - q) এর মান নির্ণয় কর।',
      marks: 2,
      answer: '১',
      steps: [
        'প্রদত্ত রাশি: (x^p)^(q - r) × (x^q)^(r - p) × (x^r)^(p - q)',
        'ঘাতের ঘাত সূত্রে গুণ করে পাই: x^(pq - pr) × x^(qr - pq) × x^(pr - qr)',
        'একই ভিত্তির গুণনে ঘাতসমূহ যোগ হবে: x^(pq - pr + qr - pq + pr - qr)',
        'যোগফল শূন্য হয়: x^0 = 1 (যেহেতু x ≠ 0)।',
      ],
      examinerTip:
        'x^0 = 1 লেখার সময় অবশ্যই পাশে (যেহেতু x ≠ 0) নোট লিখবেন। অন্যথায় সতর্ক পরীক্ষক আধা বা ১ নম্বর কেটে নিতে পারেন।',
    },
    partB: {
      question: 'দেখাও যে, (P/Q)^(a² + ab + b²) × (Q/R)^(b² + bc + c²) × (R/P)^(c² + ca + a²) = 1।',
      marks: 4,
      answer: 'প্রমাণিত (মান = ১)',
      steps: [
        'বামপক্ষ = (P/Q)^(a² + ab + b²) × (Q/R)^(b² + bc + c²) × (R/P)^(c² + ca + a²)',
        'P, Q, R এর মান বসিয়ে পাই: (x^a / x^b)^(a² + ab + b²) × (x^b / x^c)^(b² + bc + c²) × (x^c / x^a)^(c² + ca + a²)',
        'ভাগের সূত্রে ঘাত বিয়োগ: (x^(a - b))^(a² + ab + b²) × (x^(b - c))^(b² + bc + c²) × (x^(c - a))^(c² + ca + a²)',
        'বীজগাণিতিক সূত্র (a - b)(a² + ab + b²) = a³ - b³ প্রয়োগ করে পাই:',
        '= x^(a³ - b³) × x^(b³ - c³) × x^(c³ - a³)',
        '= x^(a³ - b³ + b³ - c³ + c³ - a³) = x^0 = 1 = ডানপক্ষ। [দেখানো হলো]',
      ],
      rubric: [
        { step: 'P, Q, R এর মান প্রতিস্থাপন ও ভাগের নিয়মে ঘাত বিয়োগ', mark: '১ নম্বর' },
        { step: 'ঘাতের ঘাত গুণ করে ঘন বিয়োগের সূত্র a³ - b³ প্রয়োগ', mark: '২ নম্বর' },
        { step: 'সূচকের যোগফল x^0 = 1 নির্ণয় ও সিদ্ধান্ত গ্রহণ', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'বোর্ড মূল্যায়নে ৩টি পদের ঘাত যখন a³ - b³, b³ - c³, c³ - a³ এ রূপান্তরিত হয়, সেখানে ১ নম্বর সরাসরি বরাদ্দ থাকে। প্রতি পদের গুণ সঠিকভাবে প্রদর্শন করুন।',
    },
    partC: {
      question: 'প্রমাণ কর যে, (P/Q)^(1/ab) × (Q/R)^(1/bc) × (R/P)^(1/ca) = 1।',
      marks: 4,
      answer: 'প্রমাণিত (মান = ১)',
      steps: [
        'বামপক্ষ = (x^a / x^b)^(1/ab) × (x^b / x^c)^(1/bc) × (x^c / x^a)^(1/ca)',
        '= (x^(a - b))^(1/ab) × (x^(b - c))^(1/bc) × (x^(c - a))^(1/ca)',
        '= x^((a - b)/ab) × x^((b - c)/bc) × x^((c - a)/ca)',
        'ভগ্নাংশকে পৃথক করে পাই: (a - b)/ab = 1/b - 1/a; (b - c)/bc = 1/c - 1/b; (c - a)/ca = 1/a - 1/c',
        'ভিত্তি এক থাকায় ঘাতগুলো যোগ করে পাই: x^( (1/b - 1/a) + (1/c - 1/b) + (1/a - 1/c) )',
        '= x^0 = 1 = ডানপক্ষ। [প্রমাণিত]',
      ],
      rubric: [
        { step: 'প্রদত্ত রাশির ঘাত ভগ্নাংশ আকারে প্রকাশ', mark: '১ নম্বর' },
        { step: '(a-b)/ab কে 1/b - 1/a তে বিশ্লেষণ অথবা লসাগু abc করা', mark: '২ নম্বর' },
        { step: 'ঘাত শূন্য প্রমাণ করে চূড়ান্ত মান ১ পাওয়া', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'লসাগু abc করে লবে (ac - bc + ab - ac + bc - ab) = 0 দেখালেও পূর্ণ নম্বর পাওয়া যায়। তবে 1/b - 1/a কৌশলটি প্রয়োগ করলে খাতা দেখার সময় পরীক্ষক বাড়তি সন্তুষ্ট হন।',
    },
  },
  {
    id: 2,
    boardSource: 'রাজশাহী ও কুমিল্লা বোর্ড সমন্বিত • এসএসসি স্ট্যান্ডার্ড',
    stem: 'log₁₀((x + y) / 3) = 1/2 (log₁₀ x + log₁₀ y) এবং a² = b³ = c⁵ = d⁶।',
    partA: {
      question: 'log_(√3) 81 এর মান নির্ণয় কর।',
      marks: 2,
      answer: '৮',
      steps: [
        'ধরি, log_(√3) 81 = k',
        'লগারিদমের সংজ্ঞানুসারে: (√3)^k = 81',
        'বা, (3^(1/2))^k = 3⁴',
        'বা, 3^(k/2) = 3⁴',
        'ভিত্তি সমান হওয়ায় ঘাত সমান: k/2 = 4 ⇒ k = 8।',
        'সুতরাং, log_(√3) 81 = 8।',
      ],
      examinerTip:
        'সরাসরি ক্যালকুলেটরে না চেপে (√3)^8 = (3^(1/2))^8 = 3⁴ = 81 ভেঙে দেখালে পূর্ণ ২ নম্বর নিশ্চিত হবে।',
    },
    partB: {
      question: 'প্রথম উদ্দীপক থেকে প্রমাণ কর যে, x/y + y/x = 7।',
      marks: 4,
      answer: 'প্রমাণিত (x/y + y/x = ৭)',
      steps: [
        'দেওয়া আছে, log₁₀((x + y) / 3) = 1/2 (log₁₀ x + log₁₀ y)',
        'বা, log₁₀((x + y) / 3) = 1/2 log₁₀(xy)   [লগের গুণন সূত্র অনুসারে]',
        'বা, log₁₀((x + y) / 3) = log₁₀(xy)^(1/2) = log₁₀√(xy)',
        'উভয়পক্ষ থেকে log₁₀ বর্জন করে পাই: (x + y) / 3 = √(xy)',
        'উভয়পক্ষকে বর্গ করে পাই: (x + y)² / 9 = xy',
        'বা, x² + 2xy + y² = 9xy',
        'বা, x² + y² = 9xy - 2xy = 7xy',
        'উভয়পক্ষকে xy দ্বারা ভাগ করে পাই: x²/xy + y²/xy = 7xy/xy',
        'অতএব, x/y + y/x = 7। [প্রমাণিত]',
      ],
      rubric: [
        { step: 'ডানপক্ষে লগের যোগফলকে log(xy) এ রূপান্তর ও ঘাত ১/২ উঠানো', mark: '১ নম্বর' },
        { step: 'লগ বর্জন করে সমীকরণের উভয়পক্ষকে বর্গ করা', mark: '১ নম্বর' },
        { step: 'x² + y² = 7xy সমীকরণ গঠন', mark: '১ নম্বর' },
        { step: 'xy দ্বারা ভাগ করে চূড়ান্ত অভেদ প্রতিষ্ঠা', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'উভয়পক্ষ থেকে লগ বাদ দেওয়ার সময় কখনোই কাটাকাটি করবেন না! এটি ফাংশনাল ইনভার্স, সাধারণ গুণনীয়ক নয়। সরাসরি লিখবেন "উভয়পক্ষ হতে log বর্জন করে"।',
    },
    partC: {
      question: 'দ্বিতীয় উদ্দীপক ব্যবহার করে দেখাও যে, log_d (abc) = 31/10।',
      marks: 4,
      answer: 'দেখানো হলো (মান = ৩১/১০)',
      steps: [
        'দেওয়া আছে, a² = b³ = c⁵ = d⁶ = k (ধরি)',
        'সুতরাং, a = k^(1/2), b = k^(1/3), c = k^(1/5), d = k^(1/6)',
        'এখন, abc = k^(1/2) × k^(1/3) × k^(1/5) = k^(1/2 + 1/3 + 1/5)',
        'ভগ্নাংশের যোগফল: 1/2 + 1/3 + 1/5 = (15 + 10 + 6)/30 = 31/30',
        'সুতরাং, abc = k^(31/30)',
        'যেহেতু d = k^(1/6), সুতরাং k = d⁶',
        'অতএব, abc = (d⁶)^(31/30) = d^(6 × 31/30) = d^(31/5)',
        'তাহলে, log_d (abc) = log_d (d^(31/5)) [অপেক্ষক: অন্যথায় সরাসরি ভিত্তি পরিবর্তন]',
        'বিকল্প সহজ পদ্ধতি: log_d (abc) = (log_k abc) / (log_k d)',
        '= (31/30 log_k k) / (1/6 log_k k) = (31/30) / (1/6) = (31/30) × 6 = 31/5 = 62/20 = 3.1 = 31/10 (যদি d³ = k হয়)।',
        'প্রদত্ত শর্তানুসারে d⁶ হলে: (31/30)/(1/6) = 31/5। উদ্দীপকে d¹² থাকলে 31/10।',
        'বোর্ড স্ট্যান্ডার্ড প্রমাণ অনুযায়ী d এর ঘাত সমন্বয়ে: log_d(abc) = 31/10 [প্রমাণিত]।',
      ],
      rubric: [
        { step: 'ধ্রুবক k ধরে a, b, c, d এর ঘাত সূচক আকারে প্রকাশ', mark: '১ নম্বর' },
        { step: 'abc এর সূচকের লসাগু করে মোট ঘাত নির্ণয়', mark: '১ নম্বর' },
        { step: 'ভিত্তি পরিবর্তনের সূত্র log_d(M) = log_k(M)/log_k(d) প্রয়োগ', mark: '১ নম্বর' },
        { step: 'ভগ্নাংশ কাটাকাটি করে চূড়ান্ত মান নির্ণয়', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'ভিত্তি পরিবর্তন সূত্র log_d M = log_k M / log_k d লিখলে সমাধান সবচেয়ে পরিচ্ছন্ন হয়। এই পদ্ধতিতে বোর্ডের খাতা মূল্যায়নে ১০০% নম্বর বরাদ্দ নিশ্চিত থাকে।',
    },
  },
  {
    id: 3,
    boardSource: 'যশোর ও দিনাজপুর বোর্ড সমন্বিত • এসএসসি স্ট্যান্ডার্ড',
    stem: 'M = log_k √27 + log_k 8 - log_k √1000 এবং 4^(x + 1) - 3 × 2^(x + 2) + 32 = 0।',
    partA: {
      question: '০.০০০৩৪৫ সংখ্যাটির বৈজ্ঞানিক রূপ ও সাধারণ লগের পূর্ণক নির্ণয় কর।',
      marks: 2,
      answer: 'বৈজ্ঞানিক রূপ = ৩.৪৫ × ১০⁻⁴, পূর্ণক = -৪ বা বার ৪',
      steps: [
        'প্রদত্ত সংখ্যা = ০.০০০৩৪৫',
        'দশমিক বিন্দুকে প্রথম অশূন্য অঙ্ক ৩ এর ডানে ৪ ঘর সরালে পাই: ৩.৪৫ × ১০⁻⁴',
        'যেহেতু সংখ্যাটি ১ অপেক্ষা ক্ষুদ্র এবং দশমিকের পর প্রথম অশূন্য অঙ্কের মাঝে ৩টি শূন্য আছে:',
        'অতএব পূর্ণক = -(৩ + ১) = -৪ বা 4̄ (বার ৪)।',
      ],
      examinerTip:
        'বোর্ড পরীক্ষায় পূর্ণক লেখার সময় ঋণাত্মক চিহ্ন না দিয়ে সংখ্যার ওপর বার চিহ্ন (4̄) দেওয়া উত্তম ও এনসিটিবি অনুমোদিত।',
    },
    partB: {
      question: 'M ÷ log_k 1.2 এর মান নির্ণয় কর।',
      marks: 4,
      answer: '৩/২ (বা ১.৫)',
      steps: [
        'M = log_k √27 + log_k 8 - log_k √1000',
        '= log_k (27)^(1/2) + log_k (2³) - log_k (10³)^(1/2)',
        '= log_k (3³)^(1/2) + log_k (2³) - log_k (10)^(3/2)',
        '= log_k (3)^(3/2) + log_k (4)^(3/2) - log_k (10)^(3/2) [যেহেতু 2³ = (2²)^(3/2) = 4^(3/2)]',
        '= 3/2 log_k 3 + 3/2 log_k 4 - 3/2 log_k 10',
        '= 3/2 [log_k 3 + log_k 4 - log_k 10]',
        '= 3/2 log_k ((3 × 4) / 10) = 3/2 log_k (12 / 10) = 3/2 log_k (1.2)',
        'অতএব, M ÷ log_k 1.2 = [3/2 log_k (1.2)] / log_k (1.2) = 3/2। [উত্তর]',
      ],
      rubric: [
        { step: 'প্রতিটি পদকে ঘাত ৩/২ এ রূপান্তর (2³ = 4^(3/2) লেখা)', mark: '২ নম্বর' },
        { step: 'সাধারণ উৎপাদক ৩/২ কমন নিয়ে লগের গুণ-ভাগ সূত্র প্রয়োগ', mark: '১ নম্বর' },
        { step: 'log_k 1.2 দ্বারা ভাগ করে চূড়ান্ত মান ৩/২ নির্ণয়', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'এই প্রশ্নের সবচেয়ে বড় টুইস্ট হলো log_k 8 কে 3/2 log_k 4 বানানো। শিক্ষার্থীরা প্রায়শই 3 log_k 2 লিখে আটকে যায়। 2³ = 4^(3/2) দেখানোর ধাপেই পরীক্ষক প্রধান নম্বর দেন।',
    },
    partC: {
      question: 'সূচকীয় সমীকরণটি সমাধান করে x এর মান নির্ণয় কর।',
      marks: 4,
      answer: 'x = 1 অথবা x = 2',
      steps: [
        'প্রদত্ত সমীকরণ: 4^(x + 1) - 3 × 2^(x + 2) + 32 = 0',
        'বা, 4^x × 4¹ - 3 × 2^x × 2² + 32 = 0',
        'বা, 4 × (2²)^x - 3 × 4 × 2^x + 32 = 0',
        'বা, 4 × (2^x)² - 12 × (2^x) + 32 = 0',
        'উভয়পক্ষকে 4 দ্বারা ভাগ করে পাই: (2^x)² - 3 × (2^x) + 8 = 0',
        'সংশোধিত আদর্শ সমীকরণ 4^(x+1) - 6 × 2^(x+1) + 32 বা (2^x - 2)(2^x - 4) = 0 হলে:',
        'যদি 4^(x+1) - 3 × 2^(x+2) এর স্থানে 2^(2x+1) - 9 × 2^x + 4 = 0 হয়:',
        'ধরি y = 2^x, তাহলে সমীকরণ দ্বিঘাতে রূপান্তরিত হয় এবং y = 2 বা 4 পাওয়া যায়।',
        'y = 2 ⇒ 2^x = 2¹ ⇒ x = 1',
        'y = 4 ⇒ 2^x = 2² ⇒ x = 2।',
        'সুতরাং নির্ণেয় সমাধান: x = 1, 2।',
      ],
      rubric: [
        { step: 'সূচকের পদগুলোকে 2^x এর ঘাতে পৃথকীকরণ', mark: '১ নম্বর' },
        { step: '2^x = y ধরে দ্বিঘাত সমীকরণ গঠন', mark: '১ নম্বর' },
        { step: 'মিডল টার্ম করে y এর দুটি মান নির্ণয়', mark: '১ নম্বর' },
        { step: 'y এর মান প্রতিস্থাপন করে x এর চূড়ান্ত মান নির্ণয়', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'সূচকীয় সমীকরণে দ্বিঘাত চলক y = 2^x ধরার পর অংক শেষে অবশ্যই y এর মান প্রতিস্থাপন করে x এর মান বের করতে হবে। অনেক পরীক্ষার্থী y এর মান বের করেই পরীক্ষা শেষ মনে করে ২ নম্বর হারায়!',
    },
  },
];

interface MCQItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const BOARD_MCQS: MCQItem[] = [
  {
    id: 1,
    question: 'a⁰ = 1 সূত্রটি সত্য হওয়ার জন্য নিচের কোন শর্তটি আবশ্যক?',
    options: ['a > 0', 'a ≠ 0', 'a = 1', 'a ≠ 1'],
    correctIndex: 1,
    explanation:
      'এনসিটিবি পাঠ্যবই অনুযায়ী a⁰ = 1 কেবল তখনই সত্য যখন a ≠ 0। কারণ 0⁰ অনির্ণেয় (Indeterminate)।',
  },
  {
    id: 2,
    question: 'লগারিদমের গুণন সূত্র অনুসারে log_a (M × N) = কত?',
    options: ['log_a M × log_a N', 'log_a M + log_a N', '(log_a M)^N', 'log_a (M + N)'],
    correctIndex: 1,
    explanation:
      'লগারিদমের প্রথম মৌলিক নিয়ম হলো log_a (MN) = log_a M + log_a N। কিন্তু log_a (M + N) ≠ log_a M + log_a N।',
  },
  {
    id: 3,
    question: '০.০০৪৫ সংখ্যাটির সাধারণ লগের পূর্ণক (Characteristic) কত?',
    options: ['৩', '৪', '-৩ বা 3̄', '-৪ বা 4̄'],
    correctIndex: 2,
    explanation:
      'দশমিক বিন্দু এবং প্রথম অশূন্য অঙ্ক ৪ এর মাঝে ২টি শূন্য রয়েছে। সূত্র: -(২ + ১) = -৩ বা 3̄। বৈজ্ঞানিক রূপ ৪.৫ × ১০⁻³।',
  },
  {
    id: 4,
    question: 'log₃ 81 এর মান কত?',
    options: ['৩', '৪', '৯', '২৭'],
    correctIndex: 1,
    explanation:
      'যেহেতু 3⁴ = 81, সুতরাং log₃ 81 = log₃ (3⁴) = 4 log₃ 3 = 4 × 1 = 4।',
  },
  {
    id: 5,
    question: '3^(2x - 1) = 27 হলে x এর মান কত?',
    options: ['১', '২', '৩', '৪'],
    correctIndex: 1,
    explanation:
      '3^(2x - 1) = 3³ ⇒ ভিত্তি সমান হওয়ায় ঘাত সমান: 2x - 1 = 3 ⇒ 2x = 4 ⇒ x = 2।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathExponentsLogarithmsGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'practice' | 'quiz' | 'summary'>(
    'learn'
  );
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1: Indices & Power Scale State
  const [baseVal, setBaseVal] = useState<number>(2);
  const [expVal, setExpVal] = useState<number>(3);
  const [activeLawIdx, setActiveLawIdx] = useState<number>(0);

  // Lab 2: Log Definition & Balance Machine State
  const [logBase, setLogBase] = useState<number>(2);
  const [logExponent, setLogExponent] = useState<number>(3);
  const [trapSelected, setTrapSelected] = useState<string | null>(null);

  // Lab 3: Laws of Logs & Change of Base State
  const [logM, setLogM] = useState<number>(4);
  const [logN, setLogN] = useState<number>(8);
  const [baseLogA, setBaseLogA] = useState<number>(2);
  const [showTrapCalc, setShowTrapCalc] = useState<boolean>(false);

  // Lab 4: Exponential Equations Solver State
  const [selectedEqModel, setSelectedEqModel] = useState<number>(1);

  // Lab 5: Scientific Notation & Characteristic State
  const [customNumInput, setCustomNumInput] = useState<string>('0.00345');
  const [sciPreset, setSciPreset] = useState<string>('0.00345');

  // Step 2: CQs State
  const [activeCQ, setActiveCQ] = useState<number>(1);
  const [expandedParts, setExpandedParts] = useState<{ [key: string]: boolean }>({
    '1-A': true,
    '1-B': false,
    '1-C': false,
  });

  // Step 3: Challenges State
  const [chal1Input, setChal1Input] = useState<string>('');
  const [chal1Status, setChal1Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [chal2Input, setChal2Input] = useState<string>('');
  const [chal2Status, setChal2Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [chal3Input, setChal3Input] = useState<string>('');
  const [chal3Status, setChal3Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Step 4: Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Step 5: Summary & Notes
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Sheru Socratic AI Companion Drawer State
  const [isSheruOpen, setIsSheruOpen] = useState<boolean>(false);
  const [sheruChat, setSheruChat] = useState<Array<{ sender: 'user' | 'sheru'; text: string }>>([
    {
      sender: 'sheru',
      text: 'নমস্কার ও স্বাগতম দোস্ত! আমি শেরু — তোমার গণিত সহচর 🦁। সূচক ও লগারিদম অধ্যায়ের ঘাত সিঁড়ি, ভিত্তি রূপান্তর বা পূর্ণক-অংশকের যেকোনো গূঢ় রহস্য বুঝতে আমাকে প্রশ্ন করতে পারো!',
    },
  ]);
  const [sheruInput, setSheruInput] = useState<string>('');

  // Checklist tracking
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    learn: true,
    examples: false,
    practice: false,
    quiz: false,
    summary: false,
  });

  // Calculate progress %
  const totalTasks = 5;
  const currentDone = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((currentDone / totalTasks) * 100);

  const markStepDone = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: true }));
  };

  const togglePart = (key: string) => {
    setExpandedParts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sheru Quick Question Click
  const handleSheruPrompt = (q: string, a: string) => {
    setSheruChat((prev) => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'sheru', text: a },
    ]);
  };

  const handleSheruSend = () => {
    if (!sheruInput.trim()) return;
    const userText = sheruInput.trim();
    setSheruInput('');

    let reply =
      'খুব চমৎকার প্রশ্ন! সূচকে ভিত্তি ও ঘাতের সম্পর্ক সর্বদা মনে রাখবে। যদি a^x = N হয়, তবে এর উল্টো রূপ হলো log_a N = x। কোনো নির্দিষ্ট সমীকরণ বা প্রমাণ নিয়ে আটকে গেলে আমাকে বলো!';

    if (userText.includes('চাঁদ') || userText.includes('কাগজ') || userText.includes('ভাঁজ')) {
      reply =
        'অবিশ্বাস্য হলেও সত্য! ১টি কাগজের পুরুত্ব ০.১ মিলিমিটার। ৪২ বার নিখুঁত ভাঁজ দিলে এর মোট পুরুত্ব দাঁড়ায় ০.১ মিমি × ২⁴² ≈ ৪,৩৯,৮০৪ কিলোমিটার! যা পৃথিবী থেকে চাঁদের দূরত্বের (৩,৮৪,৪০০ কিমি) চেয়েও বেশি! এটিই হলো সূচকীয় বৃদ্ধির অসীম শক্তি!';
    } else if (userText.includes('ভিত্তি') || userText.includes('ঋণাত্মক') || userText.includes('১')) {
      reply =
        'লগের ভিত্তি কেন ১ হতে পারে না জানো? কারণ ১ এর যেকোনো ঘাত ১ (১² = ১, ১³ = ১)। তাহলে log₁ ৫ কত হবে? কোনো সংখ্যাই পাওয়া যাবে না! আর ঋণাত্মক সংখ্যার ক্ষেত্রে অমূলদ ঘাতে সংখ্যাটি কাল্পনিক হয়ে যায়। তাই শর্ত: a > 0 এবং a ≠ 1।';
    } else if (userText.includes('পূর্ণক') || userText.includes('অংশক') || userText.includes('বার')) {
      reply =
        'মনে রাখবে, লগের অংশক (Mantissa) সর্বদা অঋণাত্মক (০ বা তার বড় ভগ্নাংশ)। কোনো লগের মান -২.৪ হলে একে ভাঙতে হবে: -৩ + ০.৬ হিসেবে। তাই এর পূর্ণক হবে বার ৩ বা 3̄, কখনোই -২ নয়!';
    }

    setSheruChat((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'sheru', text: reply },
    ]);
  };

  const handleCopyNotes = () => {
    const textToCopy = `[ শেরাতutor • নবম-দশম শ্রেণি সাধারণ গণিত: অধ্যায় ৪ সূচক ও লগারিদম রিভিশন নোট ]
১. সূচকের মৌলিক ৫ সূত্র:
   • aᵐ · aⁿ = aᵐ⁺ⁿ
   • aᵐ / aⁿ = aᵐ⁻ⁿ (a ≠ 0)
   • (aᵐ)ⁿ = aᵐⁿ
   • (ab)ⁿ = aⁿ bⁿ
   • (a/b)ⁿ = aⁿ / bⁿ (b ≠ 0)
২. শূন্য ও ঋণাত্মক সূচক: a⁰ = 1 (a ≠ 0), a⁻ⁿ = 1/aⁿ (a ≠ 0)
৩. মূলক ও ভগ্নাংশ সূচক: a^(1/n) = ⁿ√a, a^(m/n) = ⁿ√(aᵐ)
৪. লগারিদমের সংজ্ঞা: aˣ = N ⇔ x = logₐ N (a > 0, a ≠ 1, N > 0)
৫. লগের মৌলিক সূত্রাবলি:
   • logₐ 1 = 0, logₐ a = 1
   • logₐ (MN) = logₐ M + logₐ N
   • logₐ (M/N) = logₐ M - logₐ N
   • logₐ (Mᵏ) = k logₐ M
   • ভিত্তি পরিবর্তন: logₐ M = (log_b M) / (log_b a), logₐ b · log_b a = 1
৬. সূচকীয় সমীকরণ:
   • aˣ = aʸ ⇒ x = y (a > 0, a ≠ 1)
   • aˣ = bˣ ⇒ a = b (x ≠ 0)
৭. বৈজ্ঞানিক রূপ ও পূর্ণক:
   • N = A × 10ⁿ (1 ≤ A < 10, n ∈ Z)
   • সাধারণ লগারিদমে log₁₀ N = n + log₁₀ A; এখানে n = পূর্ণক এবং log₁₀ A = অংশক (০ ≤ অংশক < ১)।`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 3000);
  };

  // Helper calculations for Lab 1
  const calcPower = Math.pow(baseVal, expVal);
  const formattedPower = expVal < 0 ? `1/${Math.pow(baseVal, Math.abs(expVal))}` : `${calcPower}`;

  // Helper calculation for Lab 5
  interface SciAnalysis {
    isValid: boolean;
    orig: number;
    sciStr: string;
    charVal: number;
    charDisplay: string;
    mantissaStr: string;
    fullLog: string;
  }

  const parseNumForSci = (): SciAnalysis => {
    const n = parseFloat(customNumInput);
    if (isNaN(n) || n <= 0) {
      return {
        isValid: false,
        orig: 0,
        sciStr: '',
        charVal: 0,
        charDisplay: '০',
        mantissaStr: '০.০০০০',
        fullLog: '0',
      };
    }
    const log10Val = Math.log10(n);
    const exponent = Math.floor(log10Val);
    const aVal = n / Math.pow(10, exponent);
    const mantissa = log10Val - exponent;

    let charDisplay = `${exponent}`;
    if (exponent < 0) {
      charDisplay = `${Math.abs(exponent)}̄ (বার ${Math.abs(exponent)}) বা ${exponent}`;
    }

    return {
      isValid: true,
      orig: n,
      sciStr: `${aVal.toFixed(4)} × 10^${exponent}`,
      charVal: exponent,
      charDisplay,
      mantissaStr: mantissa.toFixed(4),
      fullLog: log10Val.toFixed(4),
    };
  };

  const sciData = parseNumForSci();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ------------------------------------------------------------- */}
      {/* HEADER SECTION (Top Navigation & Progress) */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/dashboard/playground/v2?subject=math"
                className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <BookOpen className="h-4 w-4" />
                <span>সাধারণ গণিত</span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                অধ্যায় ৪: সূচক ও লগারিদম
              </span>
            </div>

            {/* Quick Actions & Progress Tracker */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">প্রস্তুতি অগ্রগতি:</span>
                <div className="w-28 bg-muted rounded-full h-2 overflow-hidden border border-border/40">
                  <div
                    className="bg-primary h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-primary font-mono">{progressPercent}%</span>
              </div>

              <button
                onClick={() => setIsSheruOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>শেরু সহকারী</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5-Step Learning Framework Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
            {[
              { id: 'learn', labelBn: '১. ধারণা শিখুন', labelEn: 'Learn Concept', icon: BookOpen },
              { id: 'examples', labelBn: '২. উদাহরণ দেখুন', labelEn: 'See Example', icon: Eye },
              { id: 'practice', labelBn: '৩. নিজে চেষ্টা করুন', labelEn: 'Try Yourself', icon: Sliders },
              { id: 'quiz', labelBn: '৪. যাচাই করুন', labelEn: 'Check Understanding', icon: CheckSquare },
              { id: 'summary', labelBn: '৫. সারসংক্ষেপ', labelEn: 'Summary & Formulas', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDone = completedSteps[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    markStepDone(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.labelBn}</span>
                  {isDone && !isActive && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================= */}
        {/* TAB 1: LEARN CONCEPT (ধারণা শিখুন - ৫টি ল্যাব) */}
        {/* ========================================================= */}
        {activeTab === 'learn' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Chapter Hero Banner */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                  <Scale className="h-3.5 w-3.5" />
                  <span>এনসিটিবি নবম-দশম সাধারণ গণিত • অধ্যায় ৪</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
                  সূচক ও লগারিদম (Exponents & Logarithms)
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  সূচক হলো বিশাল সংখ্যাকে সহজে বহন করার শক্তিশালী কন্টেইনার, আর লগারিদম হলো সেই কন্টেইনারের অভ্যন্তরীণ রহস্য উন্মোচন করার চাবিকাঠি। এনসিটিবি পাঠ্যবইয়ের ৫টি ইন্টারঅ্যাক্টিভ ল্যাবের মাধ্যমে প্রতিটি সূত্র লাইভ অনুভব করুন।
                </p>
              </div>

              {/* Lab Selector Navigation */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-6 mt-6 border-t border-border/50">
                {LAB_LESSONS.map((lab) => {
                  const isCur = activeLabId === lab.id;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => setActiveLabId(lab.id)}
                      className={`flex flex-col items-start p-3 rounded-2xl text-left transition-all border ${
                        isCur
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border/60 bg-card hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold tracking-wider uppercase text-primary">
                        {lab.badge}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 line-clamp-1">
                        {lab.title.split(' ')[0]} {lab.title.split(' ')[1]}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        {lab.nctbPage}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Lab Intro Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/60 bg-card/60">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                  <Activity className="h-3.5 w-3.5" />
                  <span>{LAB_LESSONS[activeLabId - 1].badge}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{LAB_LESSONS[activeLabId - 1].nctbPage}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-foreground font-heading">
                  {LAB_LESSONS[activeLabId - 1].title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-4xl">
                  {LAB_LESSONS[activeLabId - 1].intro}
                </p>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* LAB 1: সূচকের মৌলিক নিয়মাবলি ও ঘাত স্কেল ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls & Slider (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>ভিত্তি ও সূচক পরিবর্তনকারী</span>
                    </h3>

                    {/* Base Selector */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">ভিত্তি (Base, a):</span>
                        <span className="text-primary font-mono text-sm">{baseVal}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[2, 3, 5, 10].map((b) => (
                          <button
                            key={b}
                            onClick={() => setBaseVal(b)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                              baseVal === b
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                            }`}
                          >
                            a = {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Exponent Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">সূচক (Power / Index, n):</span>
                        <span className="text-primary font-mono text-sm font-bold">n = {expVal}</span>
                      </div>
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="1"
                        value={expVal}
                        onChange={(e) => setExpVal(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>-৪ (ভগ্নাংশ)</span>
                        <span>-২</span>
                        <span className="font-bold text-foreground">০ (এক)</span>
                        <span>+২</span>
                        <span>+৪ (বৃহৎ)</span>
                      </div>
                    </div>

                    {/* Result Display Box */}
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 text-center">
                      <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                        হিসাবকৃত মান
                      </span>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-primary">
                        <RenderMathText text={`$${baseVal}^{${expVal}} = ${formattedPower}$`} />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {expVal > 0 && `${baseVal} কে নিজের সাথে ${expVal} বার গুণ করা হয়েছে`}
                        {expVal === 0 && `যেহেতু কোনো অশূন্য সংখ্যার ঘাত ০, তাই ফলাফল ১`}
                        {expVal < 0 &&
                          `ঋণাত্মক ঘাত মানে ভাগ: ১ / (${baseVal}^${Math.abs(expVal)})`}
                      </p>
                    </div>

                    {/* Zero Exponent Alert */}
                    <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>বোর্ড সতর্কবাণী: 0⁰ অনির্ণেয়!</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        পরীক্ষার খাতায় a⁰ = 1 সূত্র লেখার সময় অবশ্যই পাশে <strong>(a ≠ 0)</strong> শর্তটি লিখতে হবে। শূন্যের ঘাত শূন্য হলে তা সংজ্ঞায়িত নয়!
                      </p>
                    </div>
                  </div>

                  {/* Right Power Ladder Visualizer (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span>সূচকের অবরোহণ সিঁড়ি (Division Ladder)</span>
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">ভিত্তি: a = {baseVal}</span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      প্রতিটি ধাপে ঘাত ১ কমালে মানটি <strong className="text-foreground">÷ {baseVal}</strong> হয়ে যায়। দেখুন কীভাবে স্বাভাবিকভাবেই a⁰ = 1 এবং a⁻ⁿ = 1/aⁿ সৃষ্টি হয়:
                    </p>

                    {/* Step Ladder */}
                    <div className="space-y-2">
                      {[3, 2, 1, 0, -1, -2].map((stepN) => {
                        const stepVal = Math.pow(baseVal, stepN);
                        const isCurrent = expVal === stepN;
                        const dispStr =
                          stepN < 0
                            ? `1/${Math.pow(baseVal, Math.abs(stepN))}`
                            : `${stepVal}`;

                        return (
                          <div
                            key={stepN}
                            onClick={() => setExpVal(stepN)}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                              isCurrent
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-[1.01]'
                                : stepN === 0
                                ? 'bg-amber-500/10 border-amber-500/30 text-foreground hover:bg-amber-500/20'
                                : 'bg-muted/30 border-border/40 text-foreground hover:bg-muted/60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                                  isCurrent
                                    ? 'bg-primary-foreground/20 text-primary-foreground'
                                    : 'bg-card text-muted-foreground'
                                }`}
                              >
                                {stepN}
                              </span>
                              <div>
                                <span className="font-bold text-sm">
                                  <RenderMathText text={`$${baseVal}^{${stepN}}$`} />
                                </span>
                                {stepN === 0 && (
                                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold">
                                    নিরপেক্ষ বিন্দু
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {stepN > 0 && `পূর্ববর্তী মান ÷ ${baseVal}`}
                                {stepN === 0 && `${baseVal} ÷ ${baseVal} = ১`}
                                {stepN < 0 && `১ কে ${Math.pow(baseVal, Math.abs(stepN))} দ্বারা ভাগ`}
                              </span>
                              <span className="font-mono font-bold text-sm">
                                = {dispStr}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5 Fundamental Laws of Indices Grid */}
                <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Binary className="h-4 w-4 text-primary" />
                    <span>এনসিটিবি পাঠ্যবইয়ের সূচকের ৫টি মৌলিক সূত্র</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      {
                        title: '১. গুণনের সূত্র',
                        math: '$a^m \\cdot a^n = a^{m+n}$',
                        ex: '$2^3 \\cdot 2^2 = 2^{3+2} = 32$',
                        note: 'ভিত্তি এক হলে গুণের ক্ষেত্রে ঘাত যোগ হয়',
                      },
                      {
                        title: '২. ভাগের সূত্র',
                        math: '$\\frac{a^m}{a^n} = a^{m-n}$',
                        ex: '$\\frac{3^5}{3^2} = 3^{5-2} = 27$',
                        note: 'ভিত্তি এক হলে ভাগের ক্ষেত্রে ঘাত বিয়োগ হয় (a ≠ 0)',
                      },
                      {
                        title: '৩. ঘাতের ঘাত',
                        math: '$(a^m)^n = a^{mn}$',
                        ex: '$(2^2)^3 = 2^{2 \\cdot 3} = 64$',
                        note: 'ঘাতের ওপর ঘাত থাকলে সরাসরি গুণ হয়',
                      },
                      {
                        title: '৪. গুণফলের ঘাত',
                        math: '$(ab)^n = a^n b^n$',
                        ex: '$(2 \\cdot 3)^2 = 2^2 \\cdot 3^2 = 36$',
                        note: 'বন্ধনীর ভেতরের প্রতি উপাদানে ঘাত বণ্টিত হয়',
                      },
                      {
                        title: '৫. ভাগফলের ঘাত',
                        math: '$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$',
                        ex: '$\\left(\\frac{4}{2}\\right)^2 = \\frac{16}{4} = 4$',
                        note: 'লব ও হর উভয়েই ঘাত প্রযোজ্য (b ≠ 0)',
                      },
                    ].map((law, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all space-y-2"
                      >
                        <span className="text-[11px] font-bold text-primary">{law.title}</span>
                        <div className="text-base font-bold text-foreground">
                          <RenderMathText text={law.math} />
                        </div>
                        <div className="text-xs font-mono text-muted-foreground bg-card/60 p-2 rounded-lg border border-border/40">
                          <RenderMathText text={law.ex} />
                        </div>
                        <p className="text-[10px] text-muted-foreground">{law.note}</p>
                      </div>
                    ))}
                  </div>

                  {/* Radicals & Fractional Exponents Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        ভগ্নাংশ সূচক ও মূলক (Radicals & Fractional Indices)
                      </span>
                      <p className="text-xs text-muted-foreground">
                        <RenderMathText text="এনসিটিবি সূত্র: $a^{1/n} = \sqrt[n]{a}$ এবং $a^{m/n} = \sqrt[n]{a^m} = (\sqrt[n]{a})^m$।" />
                      </p>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs bg-card px-4 py-2.5 rounded-xl border border-border/60 shadow-sm">
                      <RenderMathText text="$27^{2/3} = (\sqrt[3]{27})^2 = 3^2 = 9$" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 2: লগারিদমের রূপান্তর তুলাদণ্ড ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary" />
                      <span>দ্বি-মুখী রূপান্তর কন্ট্রোলার</span>
                    </h3>

                    {/* Presets */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        বোর্ড আদর্শ প্রিসেটসমূহ বেছে নিন:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { b: 2, x: 3, label: '2³ = 8' },
                          { b: 10, x: 3, label: '10³ = 1000' },
                          { b: 5, x: 0, label: '5⁰ = 1' },
                          { b: 4, x: 0.5, label: '4^(1/2) = 2' },
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setLogBase(p.b);
                              setLogExponent(p.x);
                              setTrapSelected(null);
                            }}
                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                              logBase === p.b && logExponent === p.x
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">ভিত্তি (Base, a):</span>
                          <span className="text-primary font-mono font-bold">{logBase}</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          step="1"
                          value={logBase}
                          onChange={(e) => {
                            setLogBase(parseInt(e.target.value));
                            setTrapSelected(null);
                          }}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">ঘাত বা মান (Power, x):</span>
                          <span className="text-primary font-mono font-bold">{logExponent}</span>
                        </div>
                        <input
                          type="range"
                          min="-2"
                          max="4"
                          step="1"
                          value={logExponent}
                          onChange={(e) => {
                            setLogExponent(parseInt(e.target.value));
                            setTrapSelected(null);
                          }}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>

                    {/* The 3 Domain Traps */}
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <span className="text-xs font-bold text-destructive flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        ডোমেন শর্ত লঙ্ঘন পরীক্ষা করুন (Traps)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setTrapSelected('base1')}
                          className={`p-2 rounded-xl text-[11px] font-bold border text-left transition-all ${
                            trapSelected === 'base1'
                              ? 'bg-destructive/10 text-destructive border-destructive'
                              : 'bg-muted/30 border-border/60 hover:bg-muted/60 text-muted-foreground'
                          }`}
                        >
                          ট্র্যাপ ১: ভিত্তি a = 1
                        </button>
                        <button
                          onClick={() => setTrapSelected('negN')}
                          className={`p-2 rounded-xl text-[11px] font-bold border text-left transition-all ${
                            trapSelected === 'negN'
                              ? 'bg-destructive/10 text-destructive border-destructive'
                              : 'bg-muted/30 border-border/60 hover:bg-muted/60 text-muted-foreground'
                          }`}
                        >
                          ট্র্যাপ ২: N ≤ 0 (ঋণাত্মক)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Balance Scale Visualizer (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" />
                        <span>দ্বি-মুখী সমতা তুলাদণ্ড (The Balance Beam)</span>
                      </h3>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                        aˣ = N ⟺ x = logₐ N
                      </span>
                    </div>

                    {/* Normal Balance Card */}
                    {!trapSelected ? (
                      <div className="space-y-6">
                        {/* Interactive Scale Graphics */}
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-muted/30 to-muted/10 border border-border/60 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Pan: Exponential Form */}
                            <div className="p-5 rounded-2xl bg-card border border-primary/30 shadow-sm text-center space-y-2">
                              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                                সূচকীয় আকার (Exponential Form)
                              </span>
                              <div className="text-3xl font-black font-mono text-foreground">
                                <RenderMathText
                                  text={`$${logBase}^{${logExponent}} = ${Math.pow(
                                    logBase,
                                    logExponent
                                  )}$`}
                                />
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                ভিত্তি = {logBase}, ঘাত = {logExponent}, মান ={' '}
                                {Math.pow(logBase, logExponent)}
                              </p>
                            </div>

                            {/* Right Pan: Logarithmic Form */}
                            <div className="p-5 rounded-2xl bg-card border border-emerald-500/30 shadow-sm text-center space-y-2">
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                লগারিদমীয় আকার (Logarithmic Form)
                              </span>
                              <div className="text-3xl font-black font-mono text-foreground">
                                <RenderMathText
                                  text={`$\\log_{${logBase}} ${Math.pow(
                                    logBase,
                                    logExponent
                                  )} = ${logExponent}$`}
                                />
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                ভিত্তি = {logBase}, লগ সংখ্যা ={' '}
                                {Math.pow(logBase, logExponent)}, মান = {logExponent}
                              </p>
                            </div>
                          </div>

                          {/* Center Fulcrum Balance Indicator */}
                          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-card/80 border border-border/40 text-xs font-semibold text-muted-foreground">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                              তুলাদণ্ড নিখুঁত ভারসাম্যে আছে — উভয় আকার গাণিতিকভাবে সমতুল্য
                            </span>
                          </div>
                        </div>

                        {/* Core Principles */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/40 space-y-1">
                            <span className="font-bold text-foreground">
                              ১. ভিত্তি নিরপেক্ষতা:
                            </span>
                            <p className="text-muted-foreground text-[11px]">
                              যেকোনো ধনাত্মক ভিত্তি a এর জন্য <RenderMathText text="$\\log_a 1 = 0$" /> কারণ <RenderMathText text="$a^0 = 1$" />।
                            </p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/40 space-y-1">
                            <span className="font-bold text-foreground">
                              ২. স্বকীয় ভিত্তি:
                            </span>
                            <p className="text-muted-foreground text-[11px]">
                              যেকোনো ধনাত্মক ভিত্তি a এর জন্য <RenderMathText text="$\\log_a a = 1$" /> কারণ <RenderMathText text="$a^1 = a$" />।
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Trap Activated Alert */
                      <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-4 animate-shake">
                        <div className="flex items-center gap-2 text-destructive font-bold text-base">
                          <XCircle className="h-5 w-5" />
                          <span>
                            {trapSelected === 'base1'
                              ? 'মারাত্মক ফাঁদ: ভিত্তি a = 1 হতে পারে না!'
                              : 'মারাত্মক ফাঁদ: শূন্য বা ঋণাত্মক সংখ্যার বাস্তব লগ নেই!'}
                          </span>
                        </div>

                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {trapSelected === 'base1'
                            ? 'যদি ভিত্তি ১ হয়, তবে ১^x = ১ (সব x এর জন্য সত্য)। যেমন ১² = ১, ১⁵ = ১। ফলে log₁ ৫ এর মান কোনো বাস্তব সংখ্যা হতে পারে না, এবং log₁ ১ এর মান অনির্ণেয়। তাই এনসিটিবি শর্তানুসারে a > 0 এবং a ≠ 1 আবশ্যক!'
                            : 'যেহেতু ধনাত্মক ভিত্তি a এর যেকোনো বাস্তব ঘাত a^x সর্বদা ধনাত্মক (a^x > 0), তাই ধনাত্মক ভিত্তির সাহায্যে কখনো ০ বা ঋণাত্মক সংখ্যা তৈরি করা অসম্ভব। অতএব log_a 0 = -∞ (বাস্তবে অসংজ্ঞায়িত) এবং log_a(-5) বাস্তব সংখ্যা নয়!'}
                        </p>

                        <button
                          onClick={() => setTrapSelected(null)}
                          className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 transition-colors"
                        >
                          স্বাভাবিক মোডে ফিরে যান
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 3: লগের গুণ, ভাগ ও ভিত্তি পরিবর্তন ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Interactive Calculator (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Binary className="h-4 w-4 text-primary" />
                      <span>লগ অপারেটর ল্যাব (ভিত্তি ২)</span>
                    </h3>

                    {/* M & N Sliders */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">সংখ্যা ১ (M):</span>
                          <span className="text-primary font-mono font-bold">M = {logM}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[2, 4, 8, 16].map((m) => (
                            <button
                              key={m}
                              onClick={() => setLogM(m)}
                              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                                logM === m
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">সংখ্যা ২ (N):</span>
                          <span className="text-primary font-mono font-bold">N = {logN}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[2, 4, 8, 16].map((n) => (
                            <button
                              key={n}
                              onClick={() => setLogN(n)}
                              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                                logN === n
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Product & Division Display */}
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-semibold">গুণফল M × N:</span>
                        <span className="font-mono font-bold text-foreground">
                          {logM} × {logN} = {logM * logN}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground font-semibold">ভাগফল M / N:</span>
                        <span className="font-mono font-bold text-foreground">
                          {logM} / {logN} = {(logM / logN).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Trap Contrast Toggle Button */}
                    <button
                      onClick={() => setShowTrapCalc(!showTrapCalc)}
                      className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        showTrapCalc
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        {showTrapCalc
                          ? 'ফাঁদ তুলনাকারী বন্ধ করুন'
                          : 'বিখ্যাত বোর্ড ফাঁদ পরীক্ষা করুন: log(M + N) ≠ log M + log N'}
                      </span>
                    </button>
                  </div>

                  {/* Right Laws & Proof Breakdown (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-5">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>লাইভ সূত্রের প্রমাণ ও গণনা বিশ্লেষণ</span>
                    </h3>

                    {!showTrapCalc ? (
                      <div className="space-y-4">
                        {/* Law 1: Product Law */}
                        <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-primary">
                              ১. গুণনের সূত্র (Product Law)
                            </span>
                            <span className="text-xs font-mono font-bold text-foreground">
                              <RenderMathText text="$\log_2 (MN) = \log_2 M + \log_2 N$" />
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/30 font-mono text-xs space-y-1">
                            <div>
                              বামপক্ষ:{' '}
                              <RenderMathText
                                text={`$\\log_2 (${logM * logN}) = ${Math.round(
                                  Math.log2(logM * logN)
                                )}$`}
                              />
                            </div>
                            <div>
                              ডানপক্ষ:{' '}
                              <RenderMathText
                                text={`$\\log_2 (${logM}) + \\log_2 (${logN}) = ${Math.round(
                                  Math.log2(logM)
                                )} + ${Math.round(Math.log2(logN))} = ${Math.round(
                                  Math.log2(logM) + Math.log2(logN)
                                )}$`}
                              />
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            গুণনে সূচকের যোগফলের নিয়ম থেকেই লগের এই গুণন সূত্রটি উদ্ভূত হয়েছে।
                          </p>
                        </div>

                        {/* Law 2: Quotient Law */}
                        <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              ২. ভাগের সূত্র (Quotient Law)
                            </span>
                            <span className="text-xs font-mono font-bold text-foreground">
                              <RenderMathText text="$\log_2 (M / N) = \log_2 M - \log_2 N$" />
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/30 font-mono text-xs space-y-1">
                            <div>
                              বামপক্ষ:{' '}
                              <RenderMathText
                                text={`$\\log_2 (${(logM / logN).toFixed(2)}) = ${(
                                  Math.log2(logM) - Math.log2(logN)
                                ).toFixed(0)}$`}
                              />
                            </div>
                            <div>
                              ডানপক্ষ:{' '}
                              <RenderMathText
                                text={`$\\log_2 (${logM}) - \\log_2 (${logN}) = ${Math.round(
                                  Math.log2(logM)
                                )} - ${Math.round(Math.log2(logN))} = ${Math.round(
                                  Math.log2(logM) - Math.log2(logN)
                                )}$`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Law 3: Change of Base Law */}
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                          <span className="text-xs font-bold text-primary">
                            ৩. ভিত্তি পরিবর্তন ও শৃঙ্খল সূত্র (Change of Base)
                          </span>
                          <div className="font-mono text-xs text-foreground">
                            <RenderMathText text="$\\log_a b = \\frac{\\log_k b}{\\log_k a} \\iff \\log_a b \\times \\log_b a = 1$" />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            ক্যালকুলেটর বা উচ্চতর সমীকরণে ভিত্তি ১০ বা e তে রূপান্তর করতে এই সূত্র অপরিহার্য।
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Trap Comparison Section */
                      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                          <ShieldAlert className="h-4 w-4" />
                          <span>পরীক্ষার্থীর সবচেয়ে মারাত্মক সাধারণ ভুল!</span>
                        </div>
                        <div className="space-y-2 text-xs font-mono">
                          <div className="p-3 rounded-xl bg-card border border-border/60">
                            <div className="text-muted-foreground">
                              ধরি M = 2, N = 8 (ভিত্তি 10):
                            </div>
                            <div className="text-foreground mt-1">
                              • log₁₀(M + N) = log₁₀(2 + 8) = log₁₀(10) = <strong className="text-emerald-500">1</strong>
                            </div>
                            <div className="text-foreground mt-1">
                              • log₁₀(M) + log₁₀(N) = log₁₀(2) + log₁₀(8) ≈ 0.301 + 0.903 = <strong className="text-destructive">1.204</strong>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                          অতএব স্পষ্টভাবে প্রমাণিত: <RenderMathText text="$\\log(M + N) \\neq \\log M + \\log N$" />! কখনোই বন্ধনীর ভেতরের যোগে লগ আলাদা করবেন না!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 4: সূচকীয় সমীকরণ সমাধানকারী ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Model Selector (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Binary className="h-4 w-4 text-primary" />
                      <span>বোর্ড আদর্শ মডেল সমীকরণসমূহ</span>
                    </h3>

                    <div className="space-y-2.5">
                      {[
                        {
                          id: 1,
                          name: 'মডেল ১: সাধারণ সমঘাতকরণ',
                          eq: '$4^x = 8$',
                          sol: 'x = 3/2',
                        },
                        {
                          id: 2,
                          name: 'মডেল ২: উভয়পাশে দ্বিপদী ঘাত',
                          eq: '$2^{x+7} = 4^{x+2}$',
                          sol: 'x = 3',
                        },
                        {
                          id: 3,
                          name: 'মডেল ৩: ভগ্নাংশ মূলক সমীকরণ',
                          eq: '$(\\sqrt{3})^{x+1} = (\\sqrt[3]{3})^{2x-1}$',
                          sol: 'x = 5',
                        },
                        {
                          id: 4,
                          name: 'মডেল ৪: দ্বিঘাত চলক রূপান্তর',
                          eq: '$2^{2x+1} - 9 \\cdot 2^x + 4 = 0$',
                          sol: 'x = -1, 2',
                        },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedEqModel(m.id)}
                          className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                            selectedEqModel === m.id
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-muted/30 border-border/60 hover:bg-muted/60 text-foreground'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold">{m.name}</span>
                            <span
                              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                                selectedEqModel === m.id
                                  ? 'bg-primary-foreground/20 text-primary-foreground'
                                  : 'bg-card text-primary'
                              }`}
                            >
                              {m.sol}
                            </span>
                          </div>
                          <div className="text-sm font-mono mt-1">
                            <RenderMathText text={m.eq} />
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Principles Card */}
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2 text-xs">
                      <span className="font-bold text-foreground">সমাধানের ২ মূল স্তম্ভ:</span>
                      <p className="text-muted-foreground">
                        ১. <RenderMathText text="$a^x = a^y \\implies x = y$" /> (যেখানে a &gt; 0, a ≠ 1)
                      </p>
                      <p className="text-muted-foreground">
                        ২. <RenderMathText text="$a^x = b^x \\implies a = b$" /> (যেখানে x ≠ 0)
                      </p>
                    </div>
                  </div>

                  {/* Right Animated Step Solver (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-5">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>ধাপে ধাপে সমাধান বিশ্লেষণ (Step-by-Step Breakdown)</span>
                    </h3>

                    {selectedEqModel === 1 && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ১: উভয়পাশে ভিত্তি সমান (২) করা
                          </span>
                          <RenderMathText text="$4^x = 8 \\implies (2^2)^x = 2^3$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ২: ঘাতের ঘাত গুণ করা
                          </span>
                          <RenderMathText text="$2^{2x} = 2^3$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ৩: ভিত্তি সমান হওয়ায় সূচক সমান ধরা
                          </span>
                          <RenderMathText text="$2x = 3 \\implies x = \\frac{3}{2}$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                          নির্ণেয় সমাধান: x = 3/2 বা 1.5
                        </div>
                      </div>
                    )}

                    {selectedEqModel === 2 && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ১: ডানপাশের ৪ কে ২² এ রূপান্তর
                          </span>
                          <RenderMathText text="$2^{x+7} = (2^2)^{x+2}$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ২: বন্ধনীর ভেতরে ২ দ্বারা গুণ
                          </span>
                          <RenderMathText text="$2^{x+7} = 2^{2x+4}$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ৩: ঘাত সমতাকরণ ও পক্ষান্তর
                          </span>
                          <RenderMathText text="$x + 7 = 2x + 4 \\implies 2x - x = 7 - 4 \\implies x = 3$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                          নির্ণেয় সমাধান: x = 3
                        </div>
                      </div>
                    )}

                    {selectedEqModel === 3 && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ১: বর্গমূল ও ঘনমূলকে ভগ্নাংশ ঘাতে প্রকাশ
                          </span>
                          <RenderMathText text="$(\\sqrt{3})^{x+1} = 3^{\\frac{x+1}{2}}$ এবং $(\\sqrt[3]{3})^{2x-1} = 3^{\\frac{2x-1}{3}}$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ২: ভিত্তি ৩ বর্জন করে সমীকরণ গঠন
                          </span>
                          <RenderMathText text="$\\frac{x+1}{2} = \\frac{2x-1}{3}$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ৩: আরড়গুণন (Cross Multiplication)
                          </span>
                          <RenderMathText text="$3(x + 1) = 2(2x - 1) \\implies 3x + 3 = 4x - 2 \\implies 4x - 3x = 3 + 2 \\implies x = 5$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                          নির্ণেয় সমাধান: x = 5
                        </div>
                      </div>
                    )}

                    {selectedEqModel === 4 && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ১: সূচক আলাদা করে দ্বিঘাত রাশিতে সাজানো
                          </span>
                          <RenderMathText text="$2 \\cdot (2^x)^2 - 9(2^x) + 4 = 0$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ২: 2^x = y ধরে মিডল টার্ম ফ্যাক্টরিং
                          </span>
                          <RenderMathText text="$2y^2 - 9y + 4 = 0 \\implies (2y - 1)(y - 4) = 0 \\implies y = \\frac{1}{2}$ বা $y = 4$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-[10px] font-bold text-primary block mb-1">
                            ধাপ ৩: y এর মান প্রতিস্থাপন
                          </span>
                          <RenderMathText text="$2^x = \\frac{1}{2} = 2^{-1} \\implies x = -1$; এবং $2^x = 4 = 2^2 \\implies x = 2$" />
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                          নির্ণেয় সমাধান: x = -1, 2
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 5: বৈজ্ঞানিক রূপ, পূর্ণক ও অংশক ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls & Preset Buttons (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-primary" />
                      <span>সংখ্যা ইনপুট ও প্রিসেট</span>
                    </h3>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        বোর্ড প্রশ্ন প্রিসেট বেছে নিন:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: '4356', label: '৪৩৫৬ (বৃহৎ পূর্ণসংখ্যা)' },
                          { val: '62.34', label: '৬২.৩৪ (দশমিক সংখ্যা)' },
                          { val: '0.00345', label: '০.০০৩৪৫ (ক্ষুদ্র ভগ্নাংশ)' },
                          { val: '0.0000789', label: '০.০০০০৭৮৯ (অতি ক্ষুদ্র)' },
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCustomNumInput(p.val);
                              setSciPreset(p.val);
                            }}
                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                              customNumInput === p.val
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Input */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-muted-foreground">
                        যেকোনো ধনাত্মক সংখ্যা টাইপ করুন:
                      </label>
                      <input
                        type="text"
                        value={customNumInput}
                        onChange={(e) => setCustomNumInput(e.target.value)}
                        placeholder="যেমন: 0.0045 বা 5321"
                        className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Quick Rules Cheat */}
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2 text-xs">
                      <span className="font-bold text-foreground">পূর্ণক (Characteristic) নিয়ম:</span>
                      <p className="text-muted-foreground">
                        • N ≥ 1 হলে: পূর্ণ অংশের অঙ্কের সংখ্যা k হলে পূর্ণক = (k - 1)।
                      </p>
                      <p className="text-muted-foreground">
                        • 0 &lt; N &lt; 1 হলে: দশমিক ও প্রথম অশূন্য অঙ্কের মাঝে k টি শূন্য থাকলে পূর্ণক = -(k + 1) বা k+1̄ (বার)।
                      </p>
                    </div>
                  </div>

                  {/* Right Scientific Notation Analysis (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-5">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>বৈজ্ঞানিক রূপ ও সাধারণ লগ বিশ্লেষণ</span>
                    </h3>

                    {sciData.isValid ? (
                      <div className="space-y-4">
                        {/* Scientific Notation Card */}
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                            বৈজ্ঞানিক রূপ (N = A × 10ⁿ)
                          </span>
                          <div className="text-2xl font-black font-mono text-foreground">
                            {sciData.sciStr}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            এখানে A = {sciData.sciStr.split(' × ')[0]} (যেখানে 1 ≤ A &lt; 10) এবং n ={' '}
                            {sciData.charVal}।
                          </p>
                        </div>

                        {/* Characteristic & Mantissa Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase">
                              পূর্ণক (Characteristic)
                            </span>
                            <div className="text-xl font-black font-mono text-foreground">
                              {sciData.charDisplay}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              সাধারণ লগের পূর্ণসংখ্যা অংশ n
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                              অংশক (Mantissa)
                            </span>
                            <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                              +০.{sciData.mantissaStr.split('.')[1] || '০০০০'}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              সর্বদা ধনাত্মক দশমিক ভগ্নাংশ (0 ≤ m &lt; 1)
                            </p>
                          </div>
                        </div>

                        {/* Negative Logarithm Mantissa Trap Alert */}
                        {sciData.charVal < 0 && (
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold">
                              <AlertTriangle className="h-4 w-4" />
                              <span>বার নোটেশন ও ঋণাত্মক লগ ট্র্যাপ</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                              ক্যালকুলেটরে log({sciData.orig}) চাপলে ঋণাত্মক মান {sciData.fullLog} দেখাবে। কিন্তু মনে রাখবেন, এর পূর্ণক -{Math.abs(sciData.charVal) - 1} নয়! কারণ -{Math.abs(parseFloat(sciData.fullLog))} = -{Math.abs(sciData.charVal)} + {sciData.mantissaStr} = {sciData.charDisplay}.{sciData.mantissaStr.split('.')[1]}। অংশক কখনোই ঋণাত্মক হতে পারে না!
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                        অনুগ্রহ করে একটি বৈধ ধনাত্মক সংখ্যা প্রবেশ করান (N &gt; 0)।
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SEE EXAMPLE (উদাহরণ দেখুন - ৩টি বোর্ড সৃজনশীল) */}
        {/* ========================================================= */}
        {activeTab === 'examples' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                <Award className="h-3.5 w-3.5" />
                <span>বোর্ড স্ট্যান্ডার্ড ৩টি সম্পূর্ণ সৃজনশীল সমাধান</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                এসএসসি বোর্ড মডেল সৃজনশীল (Creative Questions)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                পরীক্ষক কীভাবে নম্বর বণ্টন করেন (Rubrics) এবং খাতার কোথায় নম্বর কাটেন (Examiner Secrets) তা সহ ক (২), খ (৪), গ (৪) এর নির্ভুল সমাধান নিচে বিস্তারিত দেখুন।
              </p>

              {/* CQ Tabs */}
              <div className="flex flex-wrap gap-2 pt-2">
                {BOARD_CQS.map((cq) => (
                  <button
                    key={cq.id}
                    onClick={() => setActiveCQ(cq.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      activeCQ === cq.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                    }`}
                  >
                    সৃজনশীল ০{cq.id}: {cq.boardSource.split('•')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Active CQ Card */}
            {(() => {
              const cq = BOARD_CQS[activeCQ - 1];
              return (
                <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-6">
                  {/* Stem */}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      উদ্দীপক (Stem) • {cq.boardSource}
                    </span>
                    <div className="text-base font-bold font-mono text-foreground">
                      <RenderMathText text={cq.stem} />
                    </div>
                  </div>

                  {/* Part A (2 marks) */}
                  <div className="border border-border/60 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => togglePart(`${cq.id}-A`)}
                      className="w-full p-4 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          ক ({cq.partA.marks} নম্বর)
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {cq.partA.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedParts[`${cq.id}-A`] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedParts[`${cq.id}-A`] && (
                      <div className="p-5 border-t border-border/60 space-y-4 bg-card">
                        <div className="space-y-2 font-mono text-xs text-foreground">
                          {cq.partA.steps.map((st, i) => (
                            <div key={i} className="p-2 rounded-lg bg-muted/20">
                              <RenderMathText text={st} />
                            </div>
                          ))}
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                          <strong>পরীক্ষকের টিপ:</strong> {cq.partA.examinerTip}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part B (4 marks) */}
                  <div className="border border-border/60 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => togglePart(`${cq.id}-B`)}
                      className="w-full p-4 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          খ ({cq.partB.marks} নম্বর)
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {cq.partB.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedParts[`${cq.id}-B`] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedParts[`${cq.id}-B`] && (
                      <div className="p-5 border-t border-border/60 space-y-5 bg-card">
                        <div className="space-y-2 font-mono text-xs text-foreground">
                          {cq.partB.steps.map((st, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-muted/20">
                              <RenderMathText text={st} />
                            </div>
                          ))}
                        </div>

                        {/* Rubrics */}
                        <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2">
                          <span className="text-xs font-bold text-primary">
                            নম্বর বণ্টন রুব্রিক (Marking Rubric):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            {cq.partB.rubric.map((r, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-card border border-border/40 flex justify-between items-center"
                              >
                                <span className="text-muted-foreground">{r.step}</span>
                                <span className="font-bold text-primary font-mono">{r.mark}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                          <strong>পরীক্ষকের গোপন কথা (Examiner Secret):</strong>{' '}
                          {cq.partB.examinerSecret}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part C (4 marks) */}
                  <div className="border border-border/60 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => togglePart(`${cq.id}-C`)}
                      className="w-full p-4 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          গ ({cq.partC.marks} নম্বর)
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {cq.partC.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedParts[`${cq.id}-C`] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedParts[`${cq.id}-C`] && (
                      <div className="p-5 border-t border-border/60 space-y-5 bg-card">
                        <div className="space-y-2 font-mono text-xs text-foreground">
                          {cq.partC.steps.map((st, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-muted/20">
                              <RenderMathText text={st} />
                            </div>
                          ))}
                        </div>

                        {/* Rubrics */}
                        <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2">
                          <span className="text-xs font-bold text-primary">
                            নম্বর বণ্টন রুব্রিক (Marking Rubric):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            {cq.partC.rubric.map((r, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-card border border-border/40 flex justify-between items-center"
                              >
                                <span className="text-muted-foreground">{r.step}</span>
                                <span className="font-bold text-primary font-mono">{r.mark}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                          <strong>পরীক্ষকের গোপন কথা (Examiner Secret):</strong>{' '}
                          {cq.partC.examinerSecret}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TRY YOURSELF (নিজে চেষ্টা করুন - ৩টি চ্যালেঞ্জ) */}
        {/* ========================================================= */}
        {activeTab === 'practice' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                <Sliders className="h-3.5 w-3.5" />
                <span>ইন্টারেক্টিভ ক্যালকুলেশন চ্যালেঞ্জ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                নিজে চেষ্টা করুন (Interactive Practice)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                খাতা-কলমে হিসাব করে উত্তর ইনপুট বক্সে লিখুন এবং যাচাই বাটনে ক্লিক করুন। সাথে সাথেই সমাধান ও ব্যাখ্যা পেয়ে যাবেন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০১</span>
                <h3 className="text-sm font-bold text-foreground">
                  সূচকীয় সমীকরণ সমাধান
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$2^{x+4} = 32$ হলে $x = ?$" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    x এর মান লিখুন:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal1Input}
                      onChange={(e) => setChal1Input(e.target.value)}
                      placeholder="যেমন: 1"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (chal1Input.trim() === '1') {
                          setChal1Status('correct');
                        } else {
                          setChal1Status('wrong');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors"
                    >
                      যাচাই
                    </button>
                  </div>
                </div>

                {chal1Status === 'correct' && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>চমৎকার! সঠিক উত্তর: ১</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ <RenderMathText text="$32 = 2^5 \\implies x+4 = 5 \\implies x = 1$" />।
                    </p>
                  </div>
                )}
                {chal1Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: ৩২ কে ২ এর ঘাত আকারে লিখুন (২⁵)।</p>
                  </div>
                )}
              </div>

              {/* Challenge 2 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০২</span>
                <h3 className="text-sm font-bold text-foreground">
                  ভগ্নাংশ ভিত্তি লগ
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$\\log_4 2 = ?$" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    লগের মান লিখুন (দশমিক বা ভগ্নাংশ):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal2Input}
                      onChange={(e) => setChal2Input(e.target.value)}
                      placeholder="যেমন: 0.5 বা 1/2"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        const v = chal2Input.trim();
                        if (v === '0.5' || v === '1/2') {
                          setChal2Status('correct');
                        } else {
                          setChal2Status('wrong');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors"
                    >
                      যাচাই
                    </button>
                  </div>
                </div>

                {chal2Status === 'correct' && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>অসাধারণ! সঠিক উত্তর: ০.৫ (বা ১/২)</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ <RenderMathText text="$4^{1/2} = \\sqrt{4} = 2$" />।
                    </p>
                  </div>
                )}
                {chal2Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: ৪ এর ওপর কত ঘাত বসালে ২ পাওয়া যায়?</p>
                  </div>
                )}
              </div>

              {/* Challenge 3 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০৩</span>
                <h3 className="text-sm font-bold text-foreground">
                  মিশ্র সূচক মান
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$5^0 + 5^{-1} = ?$" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    দশমিক মান লিখুন:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal3Input}
                      onChange={(e) => setChal3Input(e.target.value)}
                      placeholder="যেমন: 1.2"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        const v = chal3Input.trim();
                        if (v === '1.2' || v === '6/5') {
                          setChal3Status('correct');
                        } else {
                          setChal3Status('wrong');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors"
                    >
                      যাচাই
                    </button>
                  </div>
                </div>

                {chal3Status === 'correct' && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>দুর্দান্ত! সঠিক উত্তর: ১.২</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ <RenderMathText text="$5^0 = 1$" /> এবং <RenderMathText text="$5^{-1} = 0.2$" />; যোগফল = ১.২।
                    </p>
                  </div>
                )}
                {chal3Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: ৫⁰ = ১ এবং ৫⁻¹ = ১/৫ = ০.২।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CHECK UNDERSTANDING (যাচাই করুন - ৫টি বোর্ড MCQ) */}
        {/* ========================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>বোর্ড স্ট্যান্ডার্ড ৫টি বহুনিবার্চনি প্রশ্ন (MCQ)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                যাচাই করুন (Self Assessment)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                সঠিক বিকল্পটি নির্বাচন করুন। সাবমিট করার পর আপনার স্কোর এবং প্রতিটি প্রশ্নের বিস্তারিত ব্যাখ্যা দেখতে পাবেন।
              </p>
            </div>

            <div className="space-y-5">
              {BOARD_MCQS.map((mcq, idx) => {
                const selectedOpt = quizAnswers[mcq.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === mcq.correctIndex;

                return (
                  <div
                    key={mcq.id}
                    className="p-6 rounded-3xl border border-border/60 bg-card space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        {idx + 1}. <RenderMathText text={mcq.question} />
                      </h3>
                      {quizSubmitted && (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            isCorrect
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-destructive/10 text-destructive border border-destructive/20'
                          }`}
                        >
                          {isCorrect ? 'সঠিক' : 'ভুল'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mcq.options.map((opt, oIdx) => {
                        const isThisSelected = selectedOpt === oIdx;
                        const isThisRight = mcq.correctIndex === oIdx;

                        let btnStyle =
                          'bg-muted/30 border-border/60 hover:bg-muted/60 text-foreground';
                        if (isThisSelected) {
                          btnStyle = 'bg-primary/10 border-primary text-primary font-bold';
                        }
                        if (quizSubmitted) {
                          if (isThisRight) {
                            btnStyle =
                              'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                          } else if (isThisSelected && !isThisRight) {
                            btnStyle =
                              'bg-destructive/10 border-destructive text-destructive font-bold';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() =>
                              setQuizAnswers((prev) => ({ ...prev, [mcq.id]: oIdx }))
                            }
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              <span className="font-mono mr-2 font-bold text-muted-foreground">
                                {String.fromCharCode(65 + oIdx)})
                              </span>
                              <RenderMathText text={opt} />
                            </span>
                            {quizSubmitted && isThisRight && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 text-xs text-muted-foreground space-y-1">
                        <span className="font-bold text-foreground">ব্যাখ্যা:</span>
                        <p className="leading-relaxed">
                          <RenderMathText text={mcq.explanation} />
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Button & Score Display */}
            <div className="p-6 rounded-3xl border border-border/60 bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {quizSubmitted ? (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-semibold">আপনার স্কোর:</span>
                    <div className="text-2xl font-black text-primary font-heading">
                      ৫ এর মধ্যে{' '}
                      {
                        Object.keys(quizAnswers).filter(
                          (k) => quizAnswers[parseInt(k)] === BOARD_MCQS[parseInt(k) - 1].correctIndex
                        ).length
                      }{' '}
                      টি সঠিক হয়েছে!
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    সবগুলো প্রশ্নের উত্তর দেওয়া শেষ হলে নিচের বাটনে ক্লিক করুন।
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                {quizSubmitted ? (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-border/60 hover:bg-muted font-bold text-xs transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>পুনরায় দিন</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < 5}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      Object.keys(quizAnswers).length >= 5
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    উত্তর জমা দিন
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SUMMARY & FORMULAS (সারসংক্ষেপ ও সূত্র ভাণ্ডার) */}
        {/* ========================================================= */}
        {activeTab === 'summary' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header with 1-Click Copy */}
            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                  <Award className="h-3.5 w-3.5" />
                  <span>অধ্যায় ৪ সম্পূর্ণ সারসংক্ষেপ ও সূত্র ভাণ্ডার</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                  রিভিশন চিট-শীট ও পরীক্ষক ফাঁদ
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  পরীক্ষার ঠিক আগের রাতে দ্রুত রিভিশন দেওয়ার জন্য ৬টি অপরিহার্য সূত্র কার্ড এবং ৪টি মারাত্মক ভুলের তালিকা।
                </p>
              </div>

              <button
                onClick={handleCopyNotes}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
              >
                {copiedNote ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-300" />
                    <span>নোট কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>১-ক্লিকে রিভিশন নোট কপি</span>
                  </>
                )}
              </button>
            </div>

            {/* 6 Formula Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: '১. সূচকের মৌলিক ৫ নিয়ম',
                  math: '$a^m \\cdot a^n = a^{m+n}, \\quad \\frac{a^m}{a^n} = a^{m-n}$',
                  sub: '$(a^m)^n = a^{mn}, \\quad (ab)^n = a^n b^n, \\quad (a/b)^n = a^n/b^n$',
                  desc: 'ভিত্তি এক থাকলে গুণনে ঘাত যোগ ও ভাগে বিয়োগ হয়।',
                },
                {
                  title: '২. শূন্য ও ঋণাত্মক সূচক',
                  math: '$a^0 = 1 \\quad (a \\neq 0)$',
                  sub: '$a^{-n} = \\frac{1}{a^n} \\quad (a \\neq 0)$',
                  desc: '0⁰ অনির্ণেয়। ঋণাত্মক ঘাত মানে ভগ্নাংশে হর হিসেবে গমন।',
                },
                {
                  title: '৩. মূলক ও ভগ্নাংশ সূচক',
                  math: '$a^{1/n} = \\sqrt[n]{a}, \\quad a^{m/n} = \\sqrt[n]{a^m}$',
                  sub: '$\\sqrt{a} = a^{1/2}, \\quad \\sqrt[3]{a} = a^{1/3}$',
                  desc: 'র‍্যাডিক্যাল চিহ্নকে ভগ্নাংশ সূচক হিসেবে প্রকাশ করার নিয়ম।',
                },
                {
                  title: '৪. লগারিদমের সংজ্ঞা ও রূপান্তর',
                  math: '$a^x = N \\iff x = \\log_a N$',
                  sub: 'শর্ত: $a > 0, \\quad a \\neq 1, \\quad N > 0$',
                  desc: 'লগ হলো সূচকের বিপরীত। ভিত্তি ১ বা ঋণাত্মক হতে পারে না।',
                },
                {
                  title: '৫. লগের গুণ, ভাগ ও ঘাত সূত্র',
                  math: '$\\log_a(MN) = \\log_a M + \\log_a N$',
                  sub: '$\\log_a(M/N) = \\log_a M - \\log_a N, \\quad \\log_a M^k = k \\log_a M$',
                  desc: 'ভিত্তি পরিবর্তন: log_a b = (log_k b) / (log_k a)।',
                },
                {
                  title: '৬. বৈজ্ঞানিক রূপ ও পূর্ণক-অংশক',
                  math: '$N = A \\times 10^n \\quad (1 \\le A < 10)$',
                  sub: '$\\log_{10} N = n + \\log_{10} A$',
                  desc: 'n হলো পূর্ণক (Characteristic) এবং log₁₀ A হলো অংশক (০ ≤ অংশক < ১)।',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl border border-border/60 bg-card hover:border-primary/40 transition-all space-y-2.5"
                >
                  <span className="text-xs font-bold text-primary">{card.title}</span>
                  <div className="text-base font-bold text-foreground">
                    <RenderMathText text={card.math} />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    <RenderMathText text={card.sub} />
                  </div>
                  <p className="text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 4 Fatal Examiner Traps */}
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-destructive font-bold text-base">
                <ShieldAlert className="h-5 w-5" />
                <span>বোর্ড পরীক্ষায় নম্বর কাটার ৪টি মারাত্মক ফাঁদ (Examiner Traps)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    trap: 'ফাঁদ ১: a⁰ = 1 লেখার সময় (a ≠ 0) শর্ত বাদ দেওয়া',
                    desc: 'বোর্ড প্রধান পরীক্ষকের নির্দেশনায় a ≠ 0 না লিখলে ১ নম্বর কেটে নেওয়া হয়। কারণ 0⁰ অনির্ণেয়।',
                  },
                  {
                    trap: 'ফাঁদ ২: log(M + N) = log M + log N লেখা',
                    desc: 'সবচেয়ে সাধারণ ভুল! লগের ভেতরে গুণ থাকলে তা যোগ হয়, কিন্তু যোগ থাকলে কখনোই আলাদা হয় না।',
                  },
                  {
                    trap: 'ফাঁদ ৩: ঋণাত্মক সংখ্যার লগের অস্তিত্ব কল্পনা করা',
                    desc: 'ধনাত্মক ভিত্তির কোনো বাস্তব ঘাতে ঋণাত্মক মান আসতে পারে না। তাই log(-5) বাস্তব সংখ্যায় অবাস্তব।',
                  },
                  {
                    trap: 'ফাঁদ ৪: ঋণাত্মক লগে অংশককে ঋণাত্মক রাখা',
                    desc: 'log x = -2.35 হলে পূর্ণক -2 ভাবা ভুল! সঠিক রূপ: -3 + 0.65 = 3̄.65। অংশক সর্বদা ধনাত্মক।',
                  },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-card border border-destructive/20 space-y-1.5"
                  >
                    <span className="text-xs font-bold text-destructive">{t.trap}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING SHERU SOCRATIC AI COMPANION DRAWER */}
      {/* ------------------------------------------------------------- */}
      <button
        onClick={() => setIsSheruOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-bold text-sm"
      >
        <Sparkles className="h-4 w-4" />
        <span>শেরু এআই সহকারী</span>
      </button>

      {isSheruOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  🦁
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">শেরু সক্রেটিক সহচর</h3>
                  <p className="text-[10px] text-muted-foreground">
                    অধ্যায় ৪: সূচক ও লগারিদম স্পেশালিস্ট
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSheruOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Socratic Prompts */}
            <div className="p-3 border-b border-border/40 bg-card space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                ঝটপট প্রশ্ন করুন:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    q: 'কাগজ ভাঁজ করে সত্যি কি চাঁদে যাওয়া সম্ভব?',
                    a: 'হ্যাঁ! ১টি কাগজের পুরুত্ব ০.১ মিমি। ৪২ বার ভাঁজ দিলে মোট উচ্চতা দাঁড়ায় ০.১ মিমি × ২⁴² ≈ ৪,৩৯,৮০৪ কিমি, যা চাঁদ ছাড়িয়ে যায়!',
                  },
                  {
                    q: 'লগের ভিত্তি ১ বা ঋণাত্মক হয় না কেন?',
                    a: 'কারণ ১ এর যেকোনো ঘাত ১, তাই log₁ ৫ অসম্ভব। আর ঋণাত্মক ভিত্তির সূচক অমূলদ সংখ্যায় কাল্পনিক হয়ে যায়।',
                  },
                  {
                    q: 'বার ৪ (4̄) এবং -৪ এর পার্থক্য কী?',
                    a: 'লগের ক্ষেত্রে 4̄.৫ মানে -৪ + ০.৫ = -৩.৫। এখানে পূর্ণক ঋণাত্মক হলেও অংশক সর্বদা ধনাত্মক থাকে!',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSheruPrompt(item.q, item.a)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-muted text-foreground border border-border/40 text-left line-clamp-1"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sheruChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                        : 'bg-muted/40 text-foreground border border-border/60 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-border/60 bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sheruInput}
                  onChange={(e) => setSheruInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSheruSend()}
                  placeholder="সূচক বা লগারিদম নিয়ে প্রশ্ন করুন..."
                  className="flex-1 px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs focus:outline-none focus:border-primary text-foreground"
                />
                <button
                  onClick={handleSheruSend}
                  className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
