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
  Percent,
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
    title: 'অনুপাত ও সমানুপাত মৌলিক ধর্ম ল্যাব',
    subtitle: 'Ratio, Proportion & Cross-Multiplication Rules',
    nctbPage: 'অনুশীলনী ১১.১ • পৃষ্ঠা ২১৩',
    badge: 'মৌলিক ভিত্তি',
    intro:
      'একই জাতীয় দুটি রাশির তুলনাকে অনুপাত বলে। চারটি রাশির প্রথম ও দ্বিতীয়টির অনুপাত এবং তৃতীয় ও চতুর্থটির অনুপাত সমান হলে তাকে সমানুপাত বলে। আড়গুণন, একান্তরকরণ ও ব্যস্তকরণের নিয়ম সরাসরি পরীক্ষা করুন।',
  },
  {
    id: 2,
    title: 'যোজন ও বিয়োজন সিমুলেটর ল্যাব',
    subtitle: 'Componendo & Dividendo Master Balancer',
    nctbPage: 'অনুশীলনী ১১.১ • পৃষ্ঠা ২১৫',
    badge: 'বোর্ড স্পেশাল',
    intro:
      'বীজগণিতের সবচেয়ে ক্ষমতাধর রূপান্তর কৌশল হলো যোজন-বিয়োজন (Componendo-Dividendo)। অনুপাতের উভয়পক্ষে লব ও হরের যোগ-বিয়োগ করে কীভাবে সমীকরণ মুহূর্তেই সরল করা যায় তা দেখুন।',
  },
  {
    id: 3,
    title: 'ক্রমিক সমানুপাতি ও k-পদ্ধতি ল্যাব',
    subtitle: 'Continued Proportion & k-Method Proof Lab',
    nctbPage: 'অনুশীলনী ১১.১ • পৃষ্ঠা ২১৭',
    badge: '৪ নম্বরের প্রমাণ',
    intro:
      'a, b, c ক্রমিক সমানুপাতী হলে b² = ac হয়, যেখানে b হলো মধ্য সমানুপাতী। NCTB বোর্ড পরীক্ষায় ৪ নম্বরের প্রমাণে k-পদ্ধতির জাদুকরী প্রয়োগ (b = ck, a = ck²) ধাপে ধাপে যাচাই করুন।',
  },
  {
    id: 4,
    title: 'ধারাবাহিক অনুপাত ও বাস্তব বণ্টন ল্যাব',
    subtitle: 'Compound Ratio "দ" Method & Money Distribution',
    nctbPage: 'অনুশীলনী ১১.১ • পৃষ্ঠা ২১৯',
    badge: 'বাস্তব প্রয়োগ',
    intro:
      'দুটি আলাদা অনুপাত a:b এবং b:c থেকে বিখ্যাত "দ" নিয়মে ধারাবাহিক অনুপাত a:b:c তৈরি করুন এবং মোট টাকা বা পরিসীমা নির্দিষ্ট অনুপাতে কীভাবে বণ্টিত হয় তা সিমুলেট করুন।',
  },
  {
    id: 5,
    title: 'জটিল সমীকরণ সমাধান ল্যাব',
    subtitle: 'Radical Algebraic Equation Solver via Componendo-Dividendo',
    nctbPage: 'অনুশীলনী ১১.২ • পৃষ্ঠা ২২৫',
    badge: 'সৃজনশীল ‘গ’ মাস্টার',
    intro:
      'বোর্ড পরীক্ষায় ঘন ঘন আসা মূলীয় (Radical) সমীকরণে দুইবার যোজন-বিয়োজন ও বর্গ করে কীভাবে নিমেষে অজানা চলক x-এর মান নির্ণয় করা যায় তার সরাসরি সমাধান ল্যাব।',
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

const BOARD_CQS: CQQuestion[] = [
  {
    id: 1,
    boardSource: 'ঢাকা বোর্ড ২০২৪ / রাজশাহী বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'উদ্দীপক: x, y, z ক্রমিক সমানুপাতী এবং p : q = 3 : 4, q : r = 5 : 6। অপর একটি বীজগাণিতিক সম্পর্ক: (a³ + b³) / (a - b + c) = a(a + b)।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'p : q = ৩ : ৪ এবং q : r = ৫ : ৬ হলে p : q : r এর ধারাবাহিক অনুপাত নির্ণয় কর।',
        solution: [
          '১ম অনুপাত: p : q = ৩ : ৪ = (৩ × ৫) : (৪ × ৫) = ১৫ : ২০',
          '২য় অনুপাত: q : r = ৫ : ৬ = (৫ × ৪) : (৬ × ৪) = ২০ : ২৪',
          'অতএব, নির্ণেয় ধারাবাহিক অনুপাত p : q : r = ১৫ : ২০ : ২৪।',
          'অথবা "দ" নিয়মে: p = ৩ × ৫ = ১৫, q = ৪ × ৫ = ২০, r = ৪ × ৬ = ২৪।',
        ],
        examinerSecret:
          'উভয় অনুপাতে সাধারণ রাশি q এর মান সমান করতে হয় (লসাগু ২০)। সরাসরি দ-গুণন দেখালেও পূর্ণ ২ নম্বর পাওয়া যায়।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'দেওয়া আছে x, y, z ক্রমিক সমানুপাতী। প্রমাণ কর যে, (x² + y²) / (y² + z²) = x / z।',
        solution: [
          'যেহেতু x, y, z ক্রমিক সমানুপাতী, সেহেতু x/y = y/z = k ধরি (যেখানে k একটি আনুপাতিক ধ্রুবক, k ≠ 0)।',
          'সুতরাং, y = zk এবং x = yk = (zk)k = zk²।',
          'বামপক্ষ = (x² + y²) / (y² + z²)',
          '= {(zk²)² + (zk)²} / {(zk)² + z²}',
          '= (z²k⁴ + z²k²) / (z²k² + z²)',
          '= {z²k²(k² + 1)} / {z²(k² + 1)}',
          '= k²',
          'ডানপক্ষ = x / z = (zk²) / z = k²',
          'অতএব, বামপক্ষ = ডানপক্ষ (প্রমাণিত)।',
        ],
        examinerSecret:
          'k-পদ্ধতিতে মান বসিয়ে কমন নেওয়ার পর লব ও হরের (k² + 1) কাটাকাটি স্পষ্টভাবে দেখাতে হবে। ধাপ বাদ দিলে ১ নম্বর কাটা যায়।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'উদ্দীপকের দ্বিতীয় সম্পর্ক থেকে প্রমাণ কর যে, a, b, c ক্রমিক সমানুপাতী।',
        solution: [
          'দেওয়া আছে, (a³ + b³) / (a - b + c) = a(a + b)',
          'বা, {(a + b)(a² - ab + b²)} / (a - b + c) = a(a + b)  [যেহেতু a + b ≠ 0]',
          'উভয়পক্ষকে (a + b) দ্বারা ভাগ করে পাই:',
          '(a² - ab + b²) / (a - b + c) = a',
          'আড়গুণন (বজ্রগুণন) করে পাই:',
          'a² - ab + b² = a(a - b + c)',
          'বা, a² - ab + b² = a² - ab + ac',
          'উভয়পক্ষ থেকে a² - ab বিয়োগ করে পাই:',
          'b² = ac',
          'বা, b/a = c/b বা, a/b = b/c',
          'অর্থাৎ a : b = b : c। অতএব, a, b, c ক্রমিক সমানুপাতী (প্রমাণিত)।',
        ],
        examinerSecret:
          'উভয়পক্ষ থেকে (a + b) ভাগ করার সময় পাশে সাইডনোটে (a + b ≠ 0) না লিখলে খাতা পরীক্ষক ১ নম্বর কর্তন করতে পারেন।',
      },
    ],
  },
  {
    id: 2,
    boardSource: 'কুমিল্লা বোর্ড ২০২৪ / চট্টগ্রাম বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'উদ্দীপক: p = {∛(m + 1) + ∛(m - 1)} / {∛(m + 1) - ∛(m - 1)} এবং (a + b - c)/(a + b) = (b + c - a)/(b + c) = (c + a - b)/(c + a)।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'একান্তরকরণ ও ব্যস্তকরণ বলতে কী বোঝায়? একটি করে উদাহরণ দাও।',
        solution: [
          'একান্তরকরণ (Alternendo): a : b = c : d হলে a : c = b : d হওয়াকে একান্তরকরণ বলে। যেমন: ২ : ৪ = ৩ : ৬ হলে ২ : ৩ = ৪ : ৬।',
          'ব্যস্তকরণ (Invertendo): a : b = c : d হলে b : a = d : c হওয়াকে ব্যস্তকরণ বলে। যেমন: ২ : ৩ = ৪ : ৬ হলে ৩ : ২ = ৬ : ৪।',
        ],
        examinerSecret: 'শুধু সংজ্ঞা নয়, সাংকেতিক রূপ a:c = b:d এবং b:a = d:c উল্লেখ করা বাধ্যতামূলক।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'প্রথম সম্পর্কটি ব্যবহার করে প্রমাণ কর যে, p³ - 3mp² + 3p - m = 0।',
        solution: [
          'দেওয়া আছে, p = {∛(m + 1) + ∛(m - 1)} / {∛(m + 1) - ∛(m - 1)}',
          'যোজন-বিয়োজন করে পাই:',
          '(p + 1) / (p - 1) = [{∛(m + 1) + ∛(m - 1)} + {∛(m + 1) - ∛(m - 1)}] / [{∛(m + 1) + ∛(m - 1)} - {∛(m + 1) - ∛(m - 1)}]',
          'বা, (p + 1) / (p - 1) = {2∛(m + 1)} / {2∛(m - 1)} = ∛(m + 1) / ∛(m - 1)',
          'উভয়পক্ষকে ঘন (Cube) করে পাই:',
          '(p + 1)³ / (p - 1)³ = (m + 1) / (m - 1)',
          'বা, (p³ + 3p² + 3p + 1) / (p³ - 3p² + 3p - 1) = (m + 1) / (m - 1)',
          'পুনরায় যোজন-বিয়োজন করে পাই:',
          '{(p³ + 3p² + 3p + 1) + (p³ - 3p² + 3p - 1)} / {(p³ + 3p² + 3p + 1) - (p³ - 3p² + 3p - 1)} = {(m + 1) + (m - 1)} / {(m + 1) - (m - 1)}',
          'বা, (2p³ + 6p) / (6p² + 2) = (2m) / 2 = m',
          'বা, {2(p³ + 3p)} / {2(3p² + 1)} = m',
          'বা, p³ + 3p = m(3p² + 1) = 3mp² + m',
          'বা, p³ - 3mp² + 3p - m = 0 (প্রমাণিত)।',
        ],
        examinerSecret:
          'এই সমস্যায় দুইবার যোজন-বিয়োজন এবং মাঝে ঘন করতে হয়। এটি অত্যন্ত গুরুত্বপূর্ণ একটি ৪ নম্বরের বোর্ড প্রশ্ন।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'দ্বিতীয় সম্পর্কটি থেকে প্রমাণ কর যে, a = b = c (যেখানে a + b + c ≠ 0)।',
        solution: [
          'দেওয়া আছে, (a + b - c)/(a + b) = (b + c - a)/(b + c) = (c + a - b)/(c + a)',
          'প্রত্যেক অনুপাত থেকে ১ বিয়োগ করে পাই:',
          '(a + b - c)/(a + b) - 1 = (b + c - a)/(b + c) - 1 = (c + a - b)/(c + a) - 1',
          'বা, (a + b - c - a - b)/(a + b) = (b + c - a - b - c)/(b + c) = (c + a - b - c - a)/(c + a)',
          'বা, -c / (a + b) = -a / (b + c) = -b / (c + a)',
          'উভয়পক্ষকে (-১) দ্বারা গুণ করে পাই:',
          'c / (a + b) = a / (b + c) = b / (c + a)',
          'ব্যস্তকরণ করে পাই:',
          '(a + b) / c = (b + c) / a = (c + a) / b',
          'প্রত্যেকের সাথে ১ যোগ করে (যোজন) পাই:',
          '(a + b + c) / c = (a + b + c) / a = (a + b + c) / b',
          'যেহেতু a + b + c ≠ 0, সেহেতু উভয়পক্ষকে (a + b + c) দ্বারা ভাগ করে পাই:',
          '1/c = 1/a = 1/b ⇒ a = b = c (প্রমাণিত)।',
        ],
        examinerSecret:
          '১ বিয়োগ করে এবং পরে ১ যোগ করে রূপান্তরের কৌশলটি সবচেয়ে সংক্ষিপ্ত ও নির্ভুল। সম-অনুপাত যোগফল সূত্রেও প্রমাণ গ্রহণযোগ্য।',
      },
    ],
  },
  {
    id: 3,
    boardSource: 'দিনাজপুর বোর্ড ২০২৩ / যশোর বোর্ড ২০২৪ • সৃজনশীল প্রশ্ন',
    stem: 'উদ্দীপক: একটি ত্রিভুজের পরিসীমা ৩৬ সেমি এবং বাহুগুলোর অনুপাত ৩ : ৪ : ৫। অপর একটি সমস্যায়: {√(1 + x) + √(1 - x)} / {√(1 + x) - √(1 - x)} = 3।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'মধ্য সমানুপাতী কাকে বলে? ৪ ও ১৬ এর মধ্য সমানুপাতী কত?',
        solution: [
          'সংজ্ঞা: a, b, c ক্রমিক সমানুপাতী হলে b² = ac হয়, এখানে b-কে a ও c এর মধ্য সমানুপাতী (Geometric Mean) বলে।',
          '৪ ও ১৬ এর মধ্য সমানুপাতী b = √(৪ × ১৬) = √৬৪ = ৮।',
        ],
        examinerSecret: 'শুধু উত্তর ৮ লিখলে ১ নম্বর, সূত্র b = √(ac) সহ দেখালে পূর্ণ ২ নম্বর।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'ত্রিভুজটির বাহুগুলোর দৈর্ঘ্য নির্ণয় কর এবং দেখাও যে এটি একটি সমকোণী ত্রিভুজ।',
        solution: [
          'ধরি, ত্রিভুজটির বাহু তিনটি যথাক্রমে ৩k, ৪k এবং ৫k সেমি (যেখানে k > 0 আনুপাতিক ধ্রুবক)।',
          'শর্তমতে, পরিসীমা = ৩k + ৪k + ৫k = ৩৬',
          'বা, ১২k = ৩৬ ⇒ k = ৩ সেমি।',
          'অতএব, বাহু তিনটির দৈর্ঘ্য:',
          'প্রথম বাহু a = ৩ × ৩ = ৯ সেমি',
          'দ্বিতীয় বাহু b = ৪ × ৩ = ১২ সেমি',
          'তৃতীয় বাহু c = ৫ × ৩ = ১৫ সেমি।',
          'এখন, ক্ষুদ্রতর বাহুদ্বয়ের বর্গের সমষ্টি = a² + b² = ৯² + ১২² = ৮১ + ১৪৪ = ২২৫',
          'এবং বৃহত্তম বাহুর বর্গ = c² = ১৫² = ২২৫',
          'যেহেতু a² + b² = c², তাই পিথাগোরাসের বিপরীত উপপাদ্য অনুযায়ী ত্রিভুজটি সমকোণী (দেখানো হলো)।',
        ],
        examinerSecret:
          'বাহুগুলো বের করার পর পিথাগোরাসের সূত্রের সাহায্যে সমকোণী প্রমাণ না দেখালে ২ নম্বর কাটা যাবে।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'উদ্দীপকের সমীকরণটি সমাধান করে x এর মান নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, {√(1 + x) + √(1 - x)} / {√(1 + x) - √(1 - x)} = 3',
          'যোজন-বিয়োজন করে পাই:',
          '[{√(1 + x) + √(1 - x)} + {√(1 + x) - √(1 - x)}] / [{√(1 + x) + √(1 - x)} - {√(1 + x) - √(1 - x)}] = (3 + 1) / (3 - 1)',
          'বা, {2√(1 + x)} / {2√(1 - x)} = 4 / 2 = 2',
          'বা, √(1 + x) / √(1 - x) = 2',
          'উভয়পক্ষকে বর্গ করে পাই:',
          '(1 + x) / (1 - x) = 2² = 4',
          'পুনরায় যোজন-বিয়োজন করে পাই:',
          '{(1 + x) + (1 - x)} / {(1 + x) - (1 - x)} = (4 + 1) / (4 - 1)',
          'বা, 2 / 2x = 5 / 3',
          'বা, 1 / x = 5 / 3',
          'বা, x = 3 / 5 = 0.6',
          'অতএব, নির্ণেয় সমাধান x = 3/5 (বা ০.৬)।',
        ],
        examinerSecret:
          'বর্গ করার পর আড়গুণন করলেও উত্তর মেলে, তবে দ্বিতীয়বার যোজন-বিয়োজন করলে হিসাব সবচেয়ে দ্রুত ও নিরাপদ হয়।',
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
    question: 'a, b, c ক্রমিক সমানুপাতী হলে নিচের কোনটি সঠিক?',
    options: ['A. a² = bc', 'B. b² = ac', 'C. c² = ab', 'D. ab = bc'],
    correctAnswerIndex: 1,
    explanation:
      'a, b, c ক্রমিক সমানুপাতী হলে a : b = b : c হয়, অর্থাৎ a/b = b/c ⇒ b² = ac। এখানে b-কে মধ্য সমানুপাতী বলা হয়।',
  },
  {
    id: 2,
    question: 'a : b = c : d হলে একান্তরকরণ (Alternendo) রূপ নিচের কোনটি?',
    options: ['A. b : a = d : c', 'B. a : c = b : d', 'C. (a + b)/b = (c + d)/d', 'D. (a - b)/(a + b) = (c - d)/(c + d)'],
    correctAnswerIndex: 1,
    explanation:
      'একান্তরকরণে প্রথম অনুপাতের উত্তররাশি এবং দ্বিতীয় অনুপাতের পূর্বরাশি স্থান বিনিময় করে: a/b = c/d ⇒ a/c = b/d।',
  },
  {
    id: 3,
    question: 'p : q = ৫ : ৭ এবং q : r = ৭ : ৯ হলে p : q : r এর মান কত?',
    options: ['A. ৫ : ৭ : ৯', 'B. ৩৫ : ৪৯ : ৬৩', 'C. ৭ : ৫ : ৯', 'D. ৯ : ৭ : ৫'],
    correctAnswerIndex: 0,
    explanation:
      'যেহেতু উভয় অনুপাতেই সাধারণ রাশি q এর মান ৭ সমান, তাই সরাসরি ধারাবাহিক অনুপাত p : q : r = ৫ : ৭ : ৯।',
  },
  {
    id: 4,
    question: 'তিনটি সংখ্যার অনুপাত ২ : ৩ : ৫ এবং তাদের সমষ্টি ১০০ হলে বৃহত্তম সংখ্যাটি কত?',
    options: ['A. ২০', 'B. ৩০', 'C. ৫০', 'D. ৬০'],
    correctAnswerIndex: 2,
    explanation:
      'অনুপাতের রাশিগুলোর যোগফল = ২ + ৩ + ৫ = ১০। বৃহত্তম সংখ্যাটি = ১০০ এর (৫ / ১০) অংশ = ৫০।',
  },
  {
    id: 5,
    question: '{√(a + x) + √(a - x)} / {√(a + x) - √(a - x)} = p সমীকরণে ১ম বার যোজন-বিয়োজন করলে বামপক্ষে কী থাকে?',
    options: ['A. x / a', 'B. √(a + x) / √(a - x)', 'C. (a + x) / (a - x)', 'D. a / x'],
    correctAnswerIndex: 1,
    explanation:
      'লব ও হরের যোগফল = 2√(a + x) এবং বিয়োগফল = 2√(a - x)। ২ দিয়ে ভাগ করলে থাকে √(a + x) / √(a - x)।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathAlgebraicRatioProportionGuidebook() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1 state (Basic Ratio & Proportion)
  const [lab1A, setLab1A] = useState<number>(3);
  const [lab1B, setLab1B] = useState<number>(6);
  const [lab1C, setLab1C] = useState<number>(4);
  const [lab1TransformMode, setLab1TransformMode] = useState<'standard' | 'cross' | 'alternendo' | 'invertendo'>('standard');

  // Lab 2 state (Componendo & Dividendo)
  const [lab2Numerator, setLab2Numerator] = useState<number>(5);
  const [lab2Denominator, setLab2Denominator] = useState<number>(3);
  const [lab2Op, setLab2Op] = useState<'comp-div' | 'comp' | 'div' | 'div-comp'>('comp-div');

  // Lab 3 state (Continued Proportion & k-Method)
  const [lab3A, setLab3A] = useState<number>(4);
  const [lab3C, setLab3C] = useState<number>(16);
  const [lab3IdentityKey, setLab3IdentityKey] = useState<'id1' | 'id2'>('id1');

  // Lab 4 state (Compound Ratio & Real-world Distribution)
  const [lab4A, setLab4A] = useState<number>(2);
  const [lab4B, setLab4B] = useState<number>(3);
  const [lab4B2, setLab4B2] = useState<number>(4);
  const [lab4C, setLab4C] = useState<number>(5);
  const [lab4TotalSum, setLab4TotalSum] = useState<number>(1400);

  // Lab 5 state (Radical Equation Solver)
  const [lab5A, setLab5A] = useState<number>(1);
  const [lab5P, setLab5P] = useState<number>(3);

  // Step 2 CQs state
  const [expandedCQ, setExpandedCQ] = useState<number | null>(1);

  // Step 3 Interactive Challenges state
  const [userAns1, setUserAns1] = useState<string>('');
  const [isAns1Correct, setIsAns1Correct] = useState<boolean | null>(null);

  const [userAns2, setUserAns2] = useState<string>('');
  const [isAns2Correct, setIsAns2Correct] = useState<boolean | null>(null);

  const [userAns3, setUserAns3] = useState<string>('');
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
      text: 'স্বাগতম! আমি শেরু — তোমার গণিত অনুপাত ও সমানুপাত গাইড। যোজন-বিয়োজন, k-পদ্ধতি, ধারাবাহিক অনুপাত বা জটিল মূলীয় সমীকরণ নিয়ে যেকোনো প্রশ্ন থাকলে নির্ভয়ে জিজ্ঞেস করো!',
      time: 'এখনই',
    },
  ]);
  const [aiInputText, setAiInputText] = useState<string>('');
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  // Calculations for Lab 1
  const lab1D = lab1A !== 0 ? (lab1B * lab1C) / lab1A : 0;
  const lab1LeftRatio = lab1B !== 0 ? (lab1A / lab1B).toFixed(3) : 'Undefined';
  const lab1RightRatio = lab1D !== 0 ? (lab1C / lab1D).toFixed(3) : 'Undefined';

  // Calculations for Lab 3
  const lab3B = Math.sqrt(lab3A * lab3C);
  const lab3K = lab3C !== 0 ? (lab3B / lab3C).toFixed(3) : '0';

  // Calculations for Lab 4
  const compoundA = lab4A * lab4B2;
  const compoundB = lab4B * lab4B2;
  const compoundC = lab4B * lab4C;
  const compoundSum = compoundA + compoundB + compoundC;
  const shareA = compoundSum > 0 ? ((lab4TotalSum * compoundA) / compoundSum).toFixed(1) : '0';
  const shareB = compoundSum > 0 ? ((lab4TotalSum * compoundB) / compoundSum).toFixed(1) : '0';
  const shareC = compoundSum > 0 ? ((lab4TotalSum * compoundC) / compoundSum).toFixed(1) : '0';

  // Calculations for Lab 5
  // Formula: x = 2 * a * p / (p^2 + 1)
  const lab5X = (2 * lab5A * lab5P) / (lab5P * lab5P + 1);

  // Handle Challenges
  const handleCheckChallenge1 = () => {
    // a:b = 2:3 and b:c = 4:5 -> a:b:c = 8:12:15. If a=8, b=12.
    const trimmed = userAns1.trim();
    setIsAns1Correct(trimmed === '12' || trimmed === '১২');
  };

  const handleCheckChallenge2 = () => {
    // geometric mean of 4 and 16 is sqrt(64) = 8
    const trimmed = userAns2.trim();
    setIsAns2Correct(trimmed === '8' || trimmed === '৮');
  };

  const handleCheckChallenge3 = () => {
    // for p=2, a=1: x = 2*1*2 / (4+1) = 4/5 = 0.8
    const trimmed = userAns3.trim();
    setIsAns3Correct(trimmed === '0.8' || trimmed === '০.৮' || trimmed === '4/5' || trimmed === '৪/৫');
  };

  const handleSelectMCQ = (questionId: number, optionIdx: number) => {
    if (showMCQResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    CHAPTER_MCQS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) score++;
    });
    return score;
  };

  const handleSendAiPrompt = (queryText?: string) => {
    const textToSend = queryText || aiInputText;
    if (!textToSend.trim()) return;

    const newMessages = [
      ...aiChatMessages,
      { sender: 'user' as const, text: textToSend, time: 'এইমাত্র' },
    ];
    setAiChatMessages(newMessages);
    if (!queryText) setAiInputText('');

    setTimeout(() => {
      let reply = 'দারুণ প্রশ্ন! অনুপাত ও সমানুপাতে যোজন-বিয়োজন ও k-পদ্ধতি প্রয়োগ করলে যেকোনো জটিল সমীকরণ সহজেই সরল রূপ নেয়।';
      if (textToSend.includes('যোজন-বিয়োজন') || textToSend.includes('componendo')) {
        reply =
          'যোজন-বিয়োজনের মূল কৌশল: a/b = c/d হলে (a+b)/(a-b) = (c+d)/(c-d)। মূলীয় (√ চিহ্নযুক্ত) রাশিতে যোজন-বিয়োজন করলে এক পদে কাটাকাটি হয়ে মাত্র একটি পদ অবশিষ্ট থাকে!';
      } else if (textToSend.includes('k-পদ্ধতি') || textToSend.includes('ক্রমিক')) {
        reply =
          'k-পদ্ধতির সোনালী নিয়ম: a/b = b/c = k ধরলে b = ck এবং a = ck² হয়। যেকোনো প্রমাণের রাশিতে a ও b এর স্থানে ck² ও ck বসালে c এবং k কমন গিয়ে প্রমাণ মিলে যায়!';
      } else if (textToSend.includes('দ-নিয়ম') || textToSend.includes('ধারাবাহিক')) {
        reply =
          'দ-নিয়মের জাদু: a:b এবং b\':c\' থাকলে প্রথম পদের গুণফল ab\', মধ্য পদের গুণফল bb\', এবং শেষ পদের গুণফল bc\' হয়। অর্থাৎ বাংলা বর্ণ "দ" এর গতিপথ অনুসরণ করলেই ধারাবাহিক অনুপাত তৈরি হয়!';
      }

      setAiChatMessages((prev) => [
        ...prev,
        { sender: 'sheru', text: reply, time: 'এইমাত্র' },
      ]);
    }, 600);
  };

  const handleCopyCheatSheet = () => {
    const text = `NCTB নবম-দশম সাধারণ গণিত • অধ্যায় ১১: বীজগাণিতিক অনুপাত ও সমানুপাত
১. সমানুপাতের রূপান্তরসমূহ:
   • একান্তরকরণ: a:b = c:d ⇒ a:c = b:d
   • ব্যস্তকরণ: a:b = c:d ⇒ b:a = d:c
   • যোজন: (a+b)/b = (c+d)/d
   • বিয়োজন: (a-b)/b = (c-d)/d
   • যোজন-বিয়োজন: (a+b)/(a-b) = (c+d)/(c-d)
২. ক্রমিক সমানুপাত ও k-পদ্ধতি:
   • a, b, c ক্রমিক সমানুপাতী হলে b² = ac (b হলো মধ্য সমানুপাতী)
   • a/b = b/c = k হলে b = ck এবং a = ck²
৩. ধারাবাহিক অনুপাত (দ-নিয়ম):
   • a:b এবং b':c' ⇒ a*b' : b*b' : b*c'
৪. মূলীয় সমীকরণে যোজন-বিয়োজন সূত্র:
   • {√(a+x) + √(a-x)} / {√(a+x) - √(a-x)} = p ⇒ x = (2*a*p) / (p² + 1)`;
    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* -------------------------------------------------------------------- */}
      {/* HEADER SECTION */}
      {/* -------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/playground/v2"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              title="লাইব্রেরিতে ফিরে যান"
            >
              <RotateCcw className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Scale className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    সাধারণ গণিত • অধ্যায় ১১
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    NCTB নবম-দশম
                  </span>
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  বীজগাণিতিক অনুপাত ও সমানুপাত{' '}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400 hidden md:inline">
                    — যোজন-বিয়োজন, k-পদ্ধতি, দ-নিয়ম ও সমীকরণ ল্যাব
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* 5-Step Learning Framework Navigation */}
          <nav className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700/60 overflow-x-auto">
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
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* MAIN CONTAINER */}
      {/* -------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ================================================================== */}
        {/* STEP 1: INTERACTIVE CONCEPT LABS (৫টি ল্যাব) */}
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
                  <span className="w-5 h-5 rounded-full bg-white/20 dark:bg-slate-700 flex items-center justify-center text-xs">
                    {lab.id}
                  </span>
                  <span>{lab.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Lab Header Card */}
            {(() => {
              const currentLab = LAB_LESSONS.find((l) => l.id === activeLabId) || LAB_LESSONS[0];
              return (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        {currentLab.badge}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {currentLab.nctbPage}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {currentLab.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      {currentLab.subtitle}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
                      {currentLab.intro}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* -------------------------------------------------------------- */}
            {/* LAB 1: অনুপাত ও সমানুপাত মৌলিক ধর্ম ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls & Parameters (5 Cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    সমানুপাতের রাশি ইনপুট (a, b, c)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>১ম রাশি a:</span>
                        <span className="font-mono text-primary font-bold">{lab1A}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={lab1A}
                        onChange={(e) => setLab1A(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>২য় রাশি b:</span>
                        <span className="font-mono text-primary font-bold">{lab1B}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={lab1B}
                        onChange={(e) => setLab1B(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>৩য় রাশি c:</span>
                        <span className="font-mono text-primary font-bold">{lab1C}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={lab1C}
                        onChange={(e) => setLab1C(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      রূপান্তর মোড নির্বাচন করুন:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setLab1TransformMode('standard')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab1TransformMode === 'standard'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        মূল সমানুপাত (a : b = c : d)
                      </button>
                      <button
                        onClick={() => setLab1TransformMode('cross')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab1TransformMode === 'cross'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        আড়গুণন (ad = bc)
                      </button>
                      <button
                        onClick={() => setLab1TransformMode('alternendo')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab1TransformMode === 'alternendo'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        একান্তরকরণ (a : c = b : d)
                      </button>
                      <button
                        onClick={() => setLab1TransformMode('invertendo')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab1TransformMode === 'invertendo'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        ব্যস্তকরণ (b : a = d : c)
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                    <p className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      চতুর্থ সমানুপাতী নির্ণয়ের সূত্র:
                    </p>
                    <p className="mt-1 font-mono">
                      ad = bc ⇒ d = (b × c) / a = ({lab1B} × {lab1C}) / {lab1A} = {lab1D.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Right Interactive Balance & Ratio Visualizer (7 Cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Scale className="w-4 h-4 text-primary" />
                      সমানুপাতিক পাল্লা ও মান সমতা ব্যালেন্সার
                    </h3>

                    {/* Scale Balance Visual Card */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="flex items-center justify-around gap-4 mb-4">
                        {/* Left Pan */}
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-primary/30 shadow-xs w-40">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">বামপক্ষ অনুপাত</p>
                          <div className="text-2xl font-bold text-primary mt-1">
                            {lab1TransformMode === 'invertendo' ? `${lab1B} / ${lab1A}` : `${lab1A} / ${lab1B}`}
                          </div>
                          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
                            মান ≈{' '}
                            {lab1TransformMode === 'invertendo'
                              ? (lab1B / lab1A).toFixed(3)
                              : (lab1A / lab1B).toFixed(3)}
                          </p>
                        </div>

                        {/* Equals sign */}
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          =
                        </div>

                        {/* Right Pan */}
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-xs w-40">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">ডানপক্ষ অনুপাত</p>
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {lab1TransformMode === 'invertendo'
                              ? `${lab1D.toFixed(1)} / ${lab1C}`
                              : `${lab1C} / ${lab1D.toFixed(1)}`}
                          </div>
                          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-1">
                            মান ≈{' '}
                            {lab1TransformMode === 'invertendo'
                              ? (lab1D / lab1C).toFixed(3)
                              : (lab1C / lab1D).toFixed(3)}
                          </p>
                        </div>
                      </div>

                      {/* Mode description text */}
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        {lab1TransformMode === 'standard' && (
                          <p>
                            <span className="font-bold text-primary">মূল সমানুপাত:</span> {lab1A} : {lab1B} = {lab1C} : {lab1D.toFixed(1)}। প্রথম দুটি রাশির ভাগফল ({lab1LeftRatio}) শেষ দুটি রাশির ভাগফলের ({lab1RightRatio}) সমান।
                          </p>
                        )}
                        {lab1TransformMode === 'cross' && (
                          <p>
                            <span className="font-bold text-primary">আড়গুণন (Cross-Multiplication):</span> ১ম × ৪র্থ = {lab1A} × {lab1D.toFixed(1)} = {(lab1A * lab1D).toFixed(1)} এবং ২য় × ৩য় = {lab1B} × {lab1C} = {(lab1B * lab1C).toFixed(1)}। উভয় গুণফল হুবহু সমান!
                          </p>
                        )}
                        {lab1TransformMode === 'alternendo' && (
                          <p>
                            <span className="font-bold text-primary">একান্তরকরণ (Alternendo):</span> a : c = b : d ⇒ {lab1A} : {lab1C} = {lab1B} : {lab1D.toFixed(1)}। উত্তর ও পূর্ব রাশি স্থান বিনিময় করেছে, কিন্তু অনুপাতের সমতা অক্ষুণ্ণ রয়েছে।
                          </p>
                        )}
                        {lab1TransformMode === 'invertendo' && (
                          <p>
                            <span className="font-bold text-primary">ব্যস্তকরণ (Invertendo):</span> b : a = d : c ⇒ {lab1B} : {lab1A} = {lab1D.toFixed(1)} : {lab1C}। লব ও হর উল্টে গেছে, যার ফলে উভয়পক্ষের ভাগফল একই থাকছে।
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NCTB Board Exam Rule */}
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-primary">বোর্ড খাতার টেকনিক:</span> সৃজনশীল প্রশ্নের ‘ক’ তে প্রায়ই ৩টি রাশি দিয়ে চতুর্থ সমানুপাতী বের করতে বলা হয়। মনে রাখবেন: ১ম × ৪র্থ = ২য় × ৩য় সূত্র লিখে মান বসানো বাধ্যতামূলক।
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 2: যোজন ও বিয়োজন সিমুলেটর ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controller (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Divide className="w-4 h-4 text-primary" />
                    ভগ্নাংশ ইনপুট ও রূপান্তর অপারেশন
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>লব a (Numerator):</span>
                        <span className="font-mono text-primary font-bold">{lab2Numerator}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="15"
                        step="1"
                        value={lab2Numerator}
                        onChange={(e) => setLab2Numerator(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>হর b (Denominator):</span>
                        <span className="font-mono text-primary font-bold">{lab2Denominator}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={lab2Denominator}
                        onChange={(e) => setLab2Denominator(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      অপারেশন নির্বাচন করুন:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setLab2Op('comp-div')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab2Op === 'comp-div'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        যোজন-বিয়োজন (a+b)/(a-b)
                      </button>
                      <button
                        onClick={() => setLab2Op('comp')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab2Op === 'comp'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        শুধুমাত্র যোজন (a+b)/b
                      </button>
                      <button
                        onClick={() => setLab2Op('div')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab2Op === 'div'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        শুধুমাত্র বিয়োজন (a-b)/b
                      </button>
                      <button
                        onClick={() => setLab2Op('div-comp')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab2Op === 'div-comp'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        বিয়োজন-যোজন (a-b)/(a+b)
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-800 dark:text-purple-300">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
                      সমীকরণের সমান অনুপাত:
                    </p>
                    <p className="mt-1">
                      যদি a/b = c/d হয়, তবে যোজন-বিয়োজন করলে উভয়পক্ষেই একই প্রক্রিয়া প্রয়োগ করতে হবে: (a+b)/(a-b) = (c+d)/(c-d)।
                    </p>
                  </div>
                </div>

                {/* Right Interactive Transformation Visualizer (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-primary" />
                      ধাপে ধাপে রূপান্তর ও বীজগাণিতিক প্রমাণ
                    </h3>

                    {/* Step-by-Step Flow Card */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                      {/* Step 1: Initial Fraction */}
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ধাপ ১: মূল অনুপাত</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                            a / b = {lab2Numerator} / {lab2Denominator}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                            ≈ {(lab2Numerator / lab2Denominator).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Transformation Arrow */}
                      <div className="flex justify-center text-primary">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                      </div>

                      {/* Step 2: Transformed Fraction */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">ধাপ ২: নির্বাচিত রূপান্তর প্রয়োগ</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                            {lab2Op === 'comp-div' && 'যোজন-বিয়োজন'}
                            {lab2Op === 'comp' && 'যোজন'}
                            {lab2Op === 'div' && 'বিয়োজন'}
                            {lab2Op === 'div-comp' && 'বিয়োজন-যোজন'}
                          </span>
                        </div>

                        {/* Visual equation */}
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center font-mono">
                          {lab2Op === 'comp-div' && (
                            <div className="text-base text-slate-900 dark:text-white">
                              (a + b) / (a - b) = ({lab2Numerator} + {lab2Denominator}) / ({lab2Numerator} - {lab2Denominator}) ={' '}
                              <span className="text-primary font-bold">
                                {lab2Numerator + lab2Denominator} / {lab2Numerator - lab2Denominator}
                              </span>{' '}
                              {lab2Numerator !== lab2Denominator && (
                                <span className="text-xs text-slate-500">
                                  ≈ {((lab2Numerator + lab2Denominator) / (lab2Numerator - lab2Denominator)).toFixed(2)}
                                </span>
                              )}
                            </div>
                          )}
                          {lab2Op === 'comp' && (
                            <div className="text-base text-slate-900 dark:text-white">
                              (a + b) / b = ({lab2Numerator} + {lab2Denominator}) / {lab2Denominator} ={' '}
                              <span className="text-primary font-bold">
                                {lab2Numerator + lab2Denominator} / {lab2Denominator}
                              </span>
                            </div>
                          )}
                          {lab2Op === 'div' && (
                            <div className="text-base text-slate-900 dark:text-white">
                              (a - b) / b = ({lab2Numerator} - {lab2Denominator}) / {lab2Denominator} ={' '}
                              <span className="text-primary font-bold">
                                {lab2Numerator - lab2Denominator} / {lab2Denominator}
                              </span>
                            </div>
                          )}
                          {lab2Op === 'div-comp' && (
                            <div className="text-base text-slate-900 dark:text-white">
                              (a - b) / (a + b) = ({lab2Numerator} - {lab2Denominator}) / ({lab2Numerator} + {lab2Denominator}) ={' '}
                              <span className="text-primary font-bold">
                                {lab2Numerator - lab2Denominator} / {lab2Numerator + lab2Denominator}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Examiner Secret Tip */}
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">পরীক্ষকের সতর্কতা:</span> যোজন-বিয়োজন করার সময় হর (Denominator) যেন শূন্য না হয় (a ≠ b)। এবং সমীকরণের উভয়পক্ষে একইসাথে যোজন-বিয়োজন না করলে পুরো ৪ নম্বরই কাটা যায়!
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 3: ক্রমিক সমানুপাতি ও k-পদ্ধতি ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controller (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    ক্রমিক সমানুপাত ইনপুট (a, c)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>১ম রাশি a:</span>
                        <span className="font-mono text-primary font-bold">{lab3A}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={lab3A}
                        onChange={(e) => setLab3A(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>৩য় রাশি c:</span>
                        <span className="font-mono text-primary font-bold">{lab3C}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        step="1"
                        value={lab3C}
                        onChange={(e) => setLab3C(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      মধ্য সমানুপাতী b ও অনুপাত ধ্রুবক k:
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">b = √(a × c):</span>
                      <span className="text-base font-mono font-bold text-primary">
                        √({lab3A} × {lab3C}) = {lab3B.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">k = b / c = a / b:</span>
                      <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {lab3K}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      বোর্ড প্রমাণ রাশি যাচাই:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setLab3IdentityKey('id1')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab3IdentityKey === 'id1'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        (a + b)/(b + c) = a/b
                      </button>
                      <button
                        onClick={() => setLab3IdentityKey('id2')}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          lab3IdentityKey === 'id2'
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        (a² + b²)/(b² + c²) = a/c
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Geometric & k-Method Proof Visualizer (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-primary" />
                      জ্যামিতিক ক্ষেত্রফল সমতা ও k-পদ্ধতি প্রমাণ বিশ্লেষণ
                    </h3>

                    {/* Geometric Visual (b^2 = ac) */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-primary/20 shadow-xs">
                        <span className="text-xs text-slate-500">বর্গক্ষেত্রের ক্ষেত্রফল b²</span>
                        <div className="text-lg font-bold text-primary font-mono mt-1">
                          ({lab3B.toFixed(2)})² = {(lab3B * lab3B).toFixed(1)}
                        </div>
                      </div>

                      <span className="text-xl font-bold text-slate-400">=</span>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/20 shadow-xs">
                        <span className="text-xs text-slate-500">আয়তক্ষেত্রের ক্ষেত্রফল a × c</span>
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                          {lab3A} × {lab3C} = {lab3A * lab3C}
                        </div>
                      </div>
                    </div>

                    {/* k-Method Proof Steps */}
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                      <p className="text-xs font-bold text-primary">k-পদ্ধতির ধাপভিত্তিক বীজগাণিতিক সরলীকরণ:</p>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 space-y-1.5">
                        <p>১. ধরি, a/b = b/c = k ⇒ b = ck এবং a = bk = (ck)k = ck²</p>
                        {lab3IdentityKey === 'id1' && (
                          <>
                            <p>২. বামপক্ষ = (a + b) / (b + c) = (ck² + ck) / (ck + c)</p>
                            <p>৩. = {'{ck(k + 1)}'} / {'{c(k + 1)}'} = k</p>
                            <p>৪. ডানপক্ষ = a / b = (ck²) / (ck) = k</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ∴ বামপক্ষ = ডানপক্ষ = k (প্রমাণিত!)
                            </p>
                          </>
                        )}
                        {lab3IdentityKey === 'id2' && (
                          <>
                            <p>২. বামপক্ষ = (a² + b²) / (b² + c²) = {'{(ck²)² + (ck)²}'} / {'{(ck)² + c²}'}</p>
                            <p>৩. = (c²k⁴ + c²k²) / (c²k² + c²) = {'{c²k²(k² + 1)}'} / {'{c²(k² + 1)}'} = k²</p>
                            <p>৪. ডানপক্ষ = a / c = (ck²) / c = k²</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ∴ বামপক্ষ = ডানপক্ষ = k² (প্রমাণিত!)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">বোর্ড ট্রিক:</span> k-পদ্ধতির সাহায্যে প্রমাণে সর্বদা ডানতম রাশি (এখানে c) অপরিবর্তিত রেখে অন্য রাশিগুলোকে c ও k এর ঘাতে প্রকাশ করতে হয়।
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 4: ধারাবাহিক অনুপাত ও বাস্তব বণ্টন ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary" />
                    পৃথক দুটি অনুপাত ইনপুট
                  </h3>

                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-primary">১ম অনুপাত (a : b)</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500">a এর মান:</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={lab4A}
                            onChange={(e) => setLab4A(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">b এর মান:</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={lab4B}
                            onChange={(e) => setLab4B(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ২য় অনুপাত (b : c)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500">b এর মান (২য়):</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={lab4B2}
                            onChange={(e) => setLab4B2(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">c এর মান:</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={lab4C}
                            onChange={(e) => setLab4C(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>বণ্টনযোগ্য মোট রাশি (টাকা / পরিসীমা):</span>
                        <span className="font-mono text-primary font-bold">{lab4TotalSum}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="50"
                        value={lab4TotalSum}
                        onChange={(e) => setLab4TotalSum(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Continued Ratio & Distribution Bar (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Percent className="w-4 h-4 text-primary" />
                      "দ" নিয়মে ধারাবাহিক অনুপাত ও আনুপাতিক বণ্টন
                    </h3>

                    {/* The "দ" multiplier visual diagram */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        দ-গুণন ম্যাট্রিক্স:
                      </p>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-around font-mono text-sm">
                        <div className="text-center">
                          <p className="text-xs text-slate-400">১ম পদ a</p>
                          <p className="font-bold text-primary">{lab4A} × {lab4B2} = {compoundA}</p>
                        </div>
                        <span className="text-slate-300 font-bold">:</span>
                        <div className="text-center">
                          <p className="text-xs text-slate-400">সাধারণ পদ b</p>
                          <p className="font-bold text-purple-600">{lab4B} × {lab4B2} = {compoundB}</p>
                        </div>
                        <span className="text-slate-300 font-bold">:</span>
                        <div className="text-center">
                          <p className="text-xs text-slate-400">শেষ পদ c</p>
                          <p className="font-bold text-emerald-600">{lab4B} × {lab4C} = {compoundC}</p>
                        </div>
                      </div>

                      <div className="text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                        ধারাবাহিক অনুপাত a : b : c = {compoundA} : {compoundB} : {compoundC} (মোট অনুপাতফল = {compoundSum})
                      </div>
                    </div>

                    {/* Proportional Split Bar */}
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                      <p className="text-xs font-bold text-primary">বাস্তব বণ্টনের ফলাফল (মোট {lab4TotalSum} এককের মধ্যে):</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-primary/30">
                          <span className="text-slate-500">১ম অংশ (a):</span>
                          <p className="text-sm font-bold text-primary font-mono mt-0.5">{shareA}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-500/30">
                          <span className="text-slate-500">২য় অংশ (b):</span>
                          <p className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono mt-0.5">{shareB}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/30">
                          <span className="text-slate-500">৩য় অংশ (c):</span>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{shareC}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">বাস্তব প্রয়োগ:</span> অংশীদারি কারবারের মূলধন বণ্টন, ত্রিভুজের পরিসীমা থেকে বাহুদ্বয় নির্ণয় এবং এসিড-পানির মিশ্রণের সমস্যায় এই নিয়মটি ব্যবহৃত হয়।
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 5: জটিল সমীকরণ সমাধান ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    সমীকরণ প্যারামিটার নির্বাচন
                  </h3>

                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-slate-800 dark:text-slate-200 font-mono text-center">
                    {`{√(a + x) + √(a - x)} / {√(a + x) - √(a - x)} = p`}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>ধ্রুবক a এর মান:</span>
                        <span className="font-mono text-primary font-bold">{lab5A}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={lab5A}
                        onChange={(e) => setLab5A(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>ডানপক্ষের মান p:</span>
                        <span className="font-mono text-primary font-bold">{lab5P}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        step="1"
                        value={lab5P}
                        onChange={(e) => setLab5P(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      নির্ণেয় সমাধান x এর সরাসরি মান:
                    </p>
                    <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                      x = (2 × a × p) / (p² + 1)
                    </div>
                    <p className="text-xs font-mono text-emerald-800 dark:text-emerald-300">
                      = (2 × {lab5A} × {lab5P}) / ({lab5P}² + 1) = {2 * lab5A * lab5P} / {lab5P * lab5P + 1} ≈{' '}
                      <span className="font-bold underline">{lab5X.toFixed(3)}</span>
                    </p>
                  </div>
                </div>

                {/* Right Step-by-Step Rigorous Math Derivation (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      বোর্ড পরীক্ষার পূর্ণাঙ্গ সমাধান প্রবাহ (৪/৪ নম্বর গ্যারান্টি)
                    </h3>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 space-y-2.5">
                      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-primary font-bold">ধাপ ১: ১ম বার যোজন-বিয়োজন করে পাই —</span>
                        <p className="mt-1">
                          2√({lab5A} + x) / 2√({lab5A} - x) = ({lab5P} + 1) / ({lab5P} - 1)
                        </p>
                        <p className="text-slate-500">
                          ⇒ √({lab5A} + x) / √({lab5A} - x) = {lab5P + 1} / {lab5P - 1}
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-primary font-bold">ধাপ ২: উভয়পক্ষকে বর্গ (Square) করে পাই —</span>
                        <p className="mt-1">
                          ({lab5A} + x) / ({lab5A} - x) = ({lab5P + 1})² / ({lab5P - 1})²
                        </p>
                        <p className="text-slate-500">
                          = {(lab5P + 1) ** 2} / {(lab5P - 1) ** 2}
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-primary font-bold">ধাপ ৩: পুনরায় যোজন-বিয়োজন করে পাই —</span>
                        <p className="mt-1">
                          {`{(${lab5A} + x) + (${lab5A} - x)} / {(${lab5A} + x) - (${lab5A} - x)}`} = {`{${(lab5P + 1) ** 2} + ${(lab5P - 1) ** 2}} / {${(lab5P + 1) ** 2} - ${(lab5P - 1) ** 2}}`}
                        </p>
                        <p className="text-slate-500">
                          ⇒ (2 × {lab5A}) / 2x = {2 * (lab5P * lab5P + 1)} / {4 * lab5P} = ({lab5P * lab5P + 1}) / (2 × {lab5P})
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
                        <span className="font-bold">ধাপ ৪: ব্যস্তকরণ করে চূড়ান্ত মান —</span>
                        <p className="mt-1 font-bold">
                          x / {lab5A} = (2 × {lab5P}) / ({lab5P}² + 1) ⇒ x = (2 × {lab5A} × {lab5P}) / ({lab5P * lab5P + 1}) = {lab5X.toFixed(3)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-primary">সরাসরি শর্টকাট ট্রিক:</span> MCQ তে যদি এই আকৃতির সমীকরণ আসে, তবে কোনো গণনা ছাড়াই সরাসরি x = 2ap / (p² + 1) সূত্রে মান বসালে ৩ সেকেন্ডে সঠিক উত্তর বের করা যায়!
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 2: SEE EXAMPLE (বোর্ড সৃজনশীল প্রশ্নসমূহ) */}
        {/* ================================================================== */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  এনসিটিবি বোর্ড সৃজনশীল প্রশ্ন ও আদর্শ সমাধান
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  বিগত বছরের এসএসসি পরীক্ষায় আসা সর্বাধিক গুরুত্বপূর্ণ ৩টি সৃজনশীল প্রশ্ন, পূর্ণাঙ্গ নম্বর বণ্টন ও পরীক্ষকের সিক্রেট নোট।
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {BOARD_CQS.map((cq) => (
                <div
                  key={cq.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
                >
                  {/* CQ Card Header */}
                  <button
                    onClick={() => setExpandedCQ(expandedCQ === cq.id ? null : cq.id)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        {cq.boardSource}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">
                        {cq.stem}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${
                        expandedCQ === cq.id ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {/* CQ Content */}
                  {expandedCQ === cq.id && (
                    <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-5">
                      {cq.subQuestions.map((sub, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary text-white">
                              {sub.part} ({sub.marks} নম্বর)
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              পূর্ণ নম্বর: {sub.marks}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {sub.question}
                          </p>

                          <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
                            {sub.solution.map((line, lIdx) => (
                              <p key={lIdx}>{line}</p>
                            ))}
                          </div>

                          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                            <span className="font-semibold text-amber-700 dark:text-amber-400">পরীক্ষকের সিক্রেট নোট:</span> {sub.examinerSecret}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
                    চ্যালেঞ্জ ০১: ধারাবাহিক অনুপাত
                  </span>
                  {isAns1Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  a : b = ২ : ৩ এবং b : c = ৪ : ৫ হলে ধারাবাহিক অনুপাতে a : b : c তৈরি করলে b এর মান কত হবে (যখন a = ৮)?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns1}
                    onChange={(e) => {
                      setUserAns1(e.target.value);
                      setIsAns1Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 12)"
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
                    চ্যালেঞ্জ ০২: মধ্য সমানুপাতী
                  </span>
                  {isAns2Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  ৪ এবং ১৬ এর মধ্য সমানুপাতী (Geometric Mean) কত?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns2}
                    onChange={(e) => {
                      setUserAns2(e.target.value);
                      setIsAns2Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 8)"
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
                    চ্যালেঞ্জ ০৩: সমীকরণ সমাধান
                  </span>
                  {isAns3Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {`{√(1 + x) + √(1 - x)} / {√(1 + x) - √(1 - x)} = 2 হলে x এর মান কত? (দশমিকে বা ভগ্নাংশে লিখুন, যেমন: 0.8)`}
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns3}
                    onChange={(e) => {
                      setUserAns3(e.target.value);
                      setIsAns3Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 0.8 বা 4/5)"
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
        {/* STEP 4: CHECK UNDERSTANDING (এমসিকিউ কুইজ) */}
        {/* ================================================================== */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  অধ্যায় ১১ কুইজ ও আত্মযাচাই
                </h2>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  এনসিটিবি স্ট্যান্ডার্ড ৫টি এমসিকিউ প্রশ্ন। অপশন নির্বাচন করে ফলাফল ও বিস্তারিত ব্যাখ্যা দেখুন।
                </p>
              </div>

              {showMCQResults && (
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 font-bold text-amber-600 dark:text-amber-400 text-sm">
                  স্কোর: {calculateScore()} / ৫
                </div>
              )}
            </div>

            <div className="space-y-4">
              {CHAPTER_MCQS.map((q, qIdx) => {
                const isSelected = selectedAnswers[q.id] !== undefined;
                const isCorrect = selectedAnswers[q.id] === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {qIdx + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {q.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isThisChosen = selectedAnswers[q.id] === optIdx;
                        let btnStyle =
                          'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';

                        if (showMCQResults) {
                          if (optIdx === q.correctAnswerIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold';
                          } else if (isThisChosen) {
                            btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300';
                          }
                        } else if (isThisChosen) {
                          btnStyle = 'border-primary bg-primary/10 text-primary font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectMCQ(q.id, optIdx)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {showMCQResults && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-white">ব্যাখ্যা:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              {!showMCQResults ? (
                <button
                  onClick={() => setShowMCQResults(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
                >
                  উত্তর জমা দিন ও স্কোর দেখুন
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setShowMCQResults(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  পুনরায় চেষ্টা করুন
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 5: SUMMARY & CHEAT SHEET (সারসংক্ষেপ) */}
        {/* ================================================================== */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  অধ্যায় ১১: বীজগাণিতিক অনুপাত ও সমানুপাত রিভিশন চিট-শীট
                </h2>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                  পরীক্ষার আগের রাতের জন্য এনসিটিবি সিলেবাসের সমস্ত মৌলিক সূত্র ও রূপান্তর নিয়মের সারসংক্ষেপ।
                </p>
              </div>
            </div>

            {/* 4 Summary Formula Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  সমানুপাতের ৫টি রূপান্তর
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • একান্তরকরণ: a:b = c:d ⇒ a:c = b:d<br />
                  • ব্যস্তকরণ: a:b = c:d ⇒ b:a = d:c<br />
                  • যোজন: (a+b)/b = (c+d)/d<br />
                  • বিয়োজন: (a-b)/b = (c-d)/d<br />
                  • যোজন-বিয়োজন: (a+b)/(a-b) = (c+d)/(c-d)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                  ক্রমিক সমানুপাত ও k-পদ্ধতি
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • a, b, c ক্রমিক সমানুপাতী ⇔ b² = ac<br />
                  • b হলো মধ্য সমানুপাতী: b = √(ac)<br />
                  • k-পদ্ধতি: a/b = b/c = k ⇒ b = ck এবং a = ck²<br />
                  • সম-অনুপাত: a₁/b₁ = a₂/b₂ = (a₁+a₂)/(b₁+b₂)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                  ধারাবাহিক অনুপাত 'দ' নিয়ম
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • a:b এবং b':c' দেওয়া থাকলে:<br />
                  • a:b:c = (a × b') : (b × b') : (b × c')<br />
                  • অংশীদারিত্ব বণ্টন: মোট × (নিজ অনুপাত / অনুপাতের সমষ্টি)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold">
                  মূলীয় সমীকরণে যোজন-বিয়োজন
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • সমীকরণ: {`{√(a+x) + √(a-x)} / {√(a+x) - √(a-x)} = p`}<br />
                  • ১ বার যোজন-বিয়োজন ⇒ উভয়পাশে বর্গ<br />
                  • পুনরায় ২য় বার যোজন-বিয়োজন ⇒ x = (2ap) / (p² + 1)
                </p>
              </div>
            </div>

            {/* 1-Click Copyable Cheat Sheet Block */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    এক নজরে রিভিশন নোটস (কপি করুন)
                  </span>
                </div>
                <button
                  onClick={handleCopyCheatSheet}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                >
                  {copiedCheatSheet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCheatSheet ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
{`১. অনুপাত ও সমানুপাত:
   • চারটি রাশির ১ম ও ২য়টির অনুপাত = ৩য় ও ৪র্থটির অনুপাত হলে তারা সমানুপাতী।
   • ad = bc (১ম × ৪র্থ = ২য় × ৩য়)
২. সমানুপাতের রূপান্তর:
   • একান্তরকরণ: a:b = c:d ⇒ a:c = b:d
   • ব্যস্তকরণ: a:b = c:d ⇒ b:a = d:c
   • যোজন-বিয়োজন: a/b = c/d ⇒ (a+b)/(a-b) = (c+d)/(c-d)
৩. ক্রমিক সমানুপাত ও k-পদ্ধতি:
   • a, b, c ক্রমিক সমানুপাতী হলে b² = ac
   • a/b = b/c = k হলে b = ck, a = ck²
৪. ধারাবাহিক অনুপাত (দ-নিয়ম):
   • a:b এবং b':c' হলে a:b:c = ab' : bb' : bc'
৫. মূলীয় সমীকরণে শর্টকাট:
   • {√(a+x) + √(a-x)} / {√(a+x) - √(a-x)} = p হলে x = (2ap) / (p² + 1)`}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* SHERU AI SOCRATIC TUTOR FLOATING TRIGGER & DRAWER */}
      {/* -------------------------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          <span>শেরু AI টিউটর</span>
        </button>
      </div>

      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                  শেরু
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    শেরু AI অনুপাত ও সমানুপাত গাইড
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    সক্রিয় • বীজগাণিতিক রূপান্তর বিশেষজ্ঞ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px]">
              <button
                onClick={() => handleSendAiPrompt('যোজন-বিয়োজন কীভাবে কাজ করে?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 hover:border-primary"
              >
                যোজন-বিয়োজন নিয়ম?
              </button>
              <button
                onClick={() => handleSendAiPrompt('k-পদ্ধতির প্রমাণ কীভাবে করতে হয়?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 hover:border-primary"
              >
                k-পদ্ধতির প্রমাণ?
              </button>
              <button
                onClick={() => handleSendAiPrompt('ধারাবাহিক অনুপাত ও দ-নিয়ম কী?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 hover:border-primary"
              >
                দ-নিয়ম কী?
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="block text-[10px] opacity-70 mt-1 text-right">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiPrompt()}
                placeholder="অনুপাত ও সমানুপাত সম্পর্কিত প্রশ্ন লিখুন..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => handleSendAiPrompt()}
                className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
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
