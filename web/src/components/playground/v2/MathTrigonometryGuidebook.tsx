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
  Triangle,
  Compass,
  Maximize2,
  Minimize2,
  Layers,
  Circle,
  ArrowRight,
  ShieldCheck,
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
    title: 'সমকোণী ত্রিভুজ ও ৬টি মৌলিক ত্রিকোণমিতিক অনুপাত ল্যাব',
    subtitle: 'Right Triangle & 6 Fundamental Trig Ratios (sin, cos, tan, csc, sec, cot)',
    nctbPage: 'পৃষ্ঠা ১৭৫-১৮০',
    badge: 'ল্যাব ০১',
    intro:
      'সমকোণী ত্রিভুজের নির্দিষ্ট সূক্ষ্মকোণ θ-এর সাপেক্ষে বিপরীত বাহু (লম্ব), সন্নিহিত বাহু (ভূমি) এবং অতিভুজের অনুপাত থেকেই সৃষ্টি হয়েছে ত্রিকোণমিতির ৬টি মৌলিক স্তম্ভ: sin θ, cos θ, tan θ এবং এদের গুণাত্মক বিপরীত csc θ, sec θ, cot θ।',
  },
  {
    id: 2,
    title: 'মৌলিক ৩টি ত্রিকোণমিতিক অভেদাবলি ল্যাব',
    subtitle: '3 Fundamental Identities (sin²θ + cos²θ = 1, sec²θ - tan²θ = 1, csc²θ - cot²θ = 1)',
    nctbPage: 'পৃষ্ঠা ১৮১-১৮৫',
    badge: 'ল্যাব ০২',
    intro:
      'পিথাগোরাসের উপপাদ্য (লম্ব² + ভূমি² = অতিভুজ²) থেকেই ত্রিকোণমিতির তিনটি অমর অভেদাবলির উৎপত্তি। এই অভেদাবলিগুলো ব্যবহার করে যেকোনো একটি অনুপাত জানা থাকলে বাকি ৫টি অনুপাত চোখের পলকে নির্ণয় করা যায়।',
  },
  {
    id: 3,
    title: 'আদর্শ কোণসমূহের মান ছক ও হাতের তালু কৌশল ল্যাব',
    subtitle: 'Standard Trig Values Table & Left Hand Rule (0°, 30°, 45°, 60°, 90°)',
    nctbPage: 'পৃষ্ঠা ১৮৬-১৯১',
    badge: 'ল্যাব ০৩',
    intro:
      '০°, ৩০°, ৪৫°, ৬০° এবং ৯০° কোণের অনুপাত মুখস্থ করার দিন শেষ! সমবাহু ও সমদ্বিবাহু ত্রিভুজের জ্যামিতিক প্রমাণ এবং বাম হাতের আঙুল গণনার সহজ শর্টকাট কৌশলে মানগুলো স্থায়ীভাবে মনে রাখুন।',
  },
  {
    id: 4,
    title: 'ত্রিকোণমিতিক সমীকরণ সমাধান ও শর্ত ল্যাব',
    subtitle: 'Trigonometric Equations & Angle Constraints (0° < θ < 90°)',
    nctbPage: 'পৃষ্ঠা ১৯২-১৯৬',
    badge: 'ল্যাব ০৪',
    intro:
      'বোর্ড পরীক্ষায় ত্রিকোণমিতিক সমীকরণ সমাধানে দ্বিঘাত সমীকরণের উৎপাদক বিশ্লেষণ এবং সূক্ষ্মকোণের শর্ত (০° < θ < ৯০°) যাচাই করা অত্যন্ত গুরুত্বপূর্ণ। sin θ ≤ ১ শর্ত না মানলে মূল অগ্রহণযোগ্য হয়।',
  },
  {
    id: 5,
    title: 'পরিপূরক কোণ ও অনুপাতের রূপান্তর ল্যাব',
    subtitle: 'Complementary Angles & Ratio Conversions (sin(90° - θ) = cos θ)',
    nctbPage: 'পৃষ্ঠা ১৯৭-২০২',
    badge: 'ল্যাব ০৫',
    intro:
      'সমকোণী ত্রিভুজের অপর দুটি কোণ সর্বদা পরস্পর পরিপূরক (যোগফল ৯০°)। কোণ পরিবর্তন করলে লম্ব ও ভূমি নিজেদের মধ্যে স্থান বিনিময় করে, ফলে sin(90° - θ) রূপান্তরিত হয় cos θ-তে এবং tan(90° - θ) হয় cot θ।',
  },
];

interface CQQuestion {
  id: number;
  boardSource: string;
  stem: string;
  parts: {
    label: string;
    marks: number;
    question: string;
    solution: string[];
    rubric: string;
  }[];
  examinerSecret: string;
}

const WORKED_CQS: CQQuestion[] = [
  {
    id: 1,
    boardSource: 'ঢাকা বোর্ড — ত্রিকোণমিতিক রাশি ও অভেদাবলি',
    stem: 'A = sin θ + cos θ এবং B = sin θ - cos θ দুটি ত্রিকোণমিতিক রাশি। সমকোণী ত্রিভুজ △PQR-এ ∠Q = 90° এবং tan P = 4/3।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'tan P = 4/3 হলে sin P ও cos P এর মান নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, tan P = লম্ব / ভূমি = 4/3।',
          'ধরি, লম্ব QR = 4k এবং ভূমি PQ = 3k।',
          'পিথাগোরাসের উপপাদ্য অনুসারে, অতিভুজ PR = √(PQ² + QR²) = √((3k)² + (4k)²) = √(9k² + 16k²) = √(25k²) = 5k।',
          'অতএব, sin P = লম্ব / অতিভুজ = 4k / 5k = 4/5।',
          'এবং cos P = ভূমি / অতিভুজ = 3k / 5k = 3/5।',
        ],
        rubric: 'অতিভুজ নির্ণয়ে ১ নম্বর, sin P ও cos P মানে ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, tan θ / (1 - cot θ) + cot θ / (1 - tan θ) = sec θ csc θ + 1।',
        solution: [
          'বামপক্ষ = tan θ / (1 - cot θ) + cot θ / (1 - tan θ)',
          'সবগুলোকে sin θ ও cos θ-তে রূপান্তর করি:',
          '= (sin θ/cos θ) / (1 - cos θ/sin θ) + (cos θ/sin θ) / (1 - sin θ/cos θ)',
          '= (sin θ/cos θ) / ((sin θ - cos θ)/sin θ) + (cos θ/sin θ) / ((cos θ - sin θ)/cos θ)',
          '= sin²θ / [cos θ(sin θ - cos θ)] - cos²θ / [sin θ(sin θ - cos θ)]',
          '= (sin³θ - cos³θ) / [sin θ cos θ(sin θ - cos θ)]',
          'বীজগাণিতিক সূত্রে a³ - b³ = (a - b)(a² + ab + b²):',
          '= [(sin θ - cos θ)(sin²θ + sin θ cos θ + cos²θ)] / [sin θ cos θ(sin θ - cos θ)]',
          '= (1 + sin θ cos θ) / (sin θ cos θ)  [যেহেতু sin²θ + cos²θ = 1]',
          '= 1/(sin θ cos θ) + 1 = sec θ csc θ + 1 = ডানপক্ষ। (প্রমাণিত)',
        ],
        rubric: 'sin/cos রূপান্তরে ১ নম্বর, ভগ্নাংশের বিয়োগে ১ নম্বর, a³ - b³ সূত্রে ১ নম্বর, চূড়ান্ত সরলীকরণে ১ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'যদি A = √2 হয়, তবে θ এর মান নির্ণয় কর, যেখানে 0° < θ < 90°।',
        solution: [
          'দেওয়া আছে, A = sin θ + cos θ = √2।',
          'উভয়পক্ষকে বর্গ করে পাই: (sin θ + cos θ)² = (√2)²',
          '⇒ sin²θ + 2 sin θ cos θ + cos²θ = 2',
          '⇒ (sin²θ + cos²θ) + 2 sin θ cos θ = 2',
          '⇒ 1 + 2 sin θ cos θ = 2 ⇒ 2 sin θ cos θ = 1 ⇒ 2 sin θ cos θ = sin²θ + cos²θ',
          '⇒ sin²θ - 2 sin θ cos θ + cos²θ = 0 ⇒ (sin θ - cos θ)² = 0',
          '⇒ sin θ - cos θ = 0 ⇒ sin θ = cos θ ⇒ sin θ / cos θ = 1 ⇒ tan θ = 1',
          'যেহেতু tan 45° = 1 এবং 0° < θ < 90°, সুতরাং θ = 45°। (উত্তর)',
        ],
        rubric: 'বর্গ করায় ১ নম্বর, sin θ = cos θ প্রতিপাদনে ২ নম্বর, θ = 45° উত্তরে ১ নম্বর।',
      },
    ],
    examinerSecret:
      'খ অংশের প্রশ্নে মাইনাস চিহ্ন কমন নেওয়ার ধাপটি (cos θ - sin θ কে -(sin θ - cos θ) লেখা) সবচেয়ে বেশি ভুল হয়। এই ধাপে সতর্কতা বজায় রাখলে ৪-এ ৪ পাওয়া নিশ্চিত।',
  },
  {
    id: 2,
    boardSource: 'রাজশাহী বোর্ড — জ্যামিতিক প্রমাণ ও সমীকরণ সমাধান',
    stem: 'সমকোণী ত্রিভুজ △ABC-তে ∠B = 90° এবং ∠A = θ। দেওয়া আছে 2 cos²θ + 3 sin θ - 3 = 0।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'sec θ = 2 হলে θ এবং tan θ এর মান কত?',
        solution: [
          'দেওয়া আছে, sec θ = 2 ⇒ cos θ = 1/2।',
          'আমরা জানি, cos 60° = 1/2, সুতরাং θ = 60°।',
          'অতএব, tan θ = tan 60° = √3।',
        ],
        rubric: 'θ = 60° নির্ণয়ে ১ নম্বর, tan 60° = √3 উত্তরে ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'জ্যামিতিক পদ্ধতিতে প্রমাণ কর যে, sin²θ + cos²θ = 1।',
        solution: [
          'চিত্র ও বর্ণনা: মনে করি ∠XOY = θ একটি সূক্ষ্মকোণ। OY বাহুর ওপর যেকোনো বিন্দু P নিই এবং P থেকে OX-এর ওপর PM লম্ব টানি। তাহলে △POM একটি সমকোণী ত্রিভুজ যার ∠PMO = 90°।',
          'ত্রিভুজটিতে লম্ব = PM, ভূমি = OM এবং অতিভুজ = OP।',
          'পিথাগোরাসের উপপাদ্য অনুসারে: PM² + OM² = OP²',
          'উভয়পক্ষকে OP² দ্বারা ভাগ করে পাই:',
          '(PM/OP)² + (OM/OP)² = (OP/OP)²',
          'কিন্তু সংজ্ঞা অনুযায়ী, sin θ = PM/OP এবং cos θ = OM/OP।',
          'সুতরাং, (sin θ)² + (cos θ)² = 1 ⇒ sin²θ + cos²θ = 1। (প্রমাণিত)',
        ],
        rubric: 'চিত্র ও বিশেষ নির্বচনে ১ নম্বর, পিথাগোরাসের সূত্রে ১ নম্বর, OP² দ্বারা ভাগে ১ নম্বর, সমাপ্তিতে ১ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'প্রদত্ত সমীকরণটি সমাধান কর: 2 cos²θ + 3 sin θ - 3 = 0, যেখানে θ সূক্ষ্মকোণ।',
        solution: [
          'প্রদত্ত সমীকরণ: 2 cos²θ + 3 sin θ - 3 = 0',
          'cos²θ = 1 - sin²θ বসিয়ে পাই:',
          '2(1 - sin²θ) + 3 sin θ - 3 = 0',
          '⇒ 2 - 2 sin²θ + 3 sin θ - 3 = 0 ⇒ -2 sin²θ + 3 sin θ - 1 = 0',
          'উভয়পক্ষকে (-1) দ্বারা গুণ করে: 2 sin²θ - 3 sin θ + 1 = 0',
          'মধ্যপদ বিভক্তিকরণ (Middle term): 2 sin²θ - 2 sin θ - sin θ + 1 = 0',
          '⇒ 2 sin θ(sin θ - 1) - 1(sin θ - 1) = 0 ⇒ (2 sin θ - 1)(sin θ - 1) = 0',
          'হয়, 2 sin θ - 1 = 0 ⇒ sin θ = 1/2 ⇒ sin θ = sin 30° ⇒ θ = 30°।',
          'অথবা, sin θ - 1 = 0 ⇒ sin θ = 1 ⇒ sin θ = sin 90° ⇒ θ = 90°।',
          'কিন্তু শর্তানুসারে θ সূক্ষ্মকোণ (0° < θ < 90°), তাই θ = 90° গ্রহণযোগ্য নয়।',
          'অতএব, নির্ণেয় সমাধান: θ = 30°। (উত্তর)',
        ],
        rubric: 'দ্বিঘাত আকারে রূপান্তরে ১ নম্বর, উৎপাদকে বিশ্লেষণে ১ নম্বর, দুটি মূল নির্ণয়ে ১ নম্বর, শর্ত যাচাইয়ে ১ নম্বর।',
      },
    ],
    examinerSecret:
      'গ অংশে θ = 90° বর্জন করার কারণ (যেহেতু সূক্ষ্মকোণ চেয়েছে, ৯০° সমকোণ) না লিখলে ১ নম্বর কেটে নেওয়া হয়। শর্তটি হাইলাইট করে লিখতে হবে।',
  },
  {
    id: 3,
    boardSource: 'যশোর বোর্ড — চিরন্তন ক্লাসিক p² - q² = 4√(pq)',
    stem: 'p = tan θ + sin θ এবং q = tan θ - sin θ দুটি ত্রিকোণমিতিক রাশি।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'cos θ = 1/2 হলে sin θ এবং tan θ এর মান কত?',
        solution: [
          'cos θ = 1/2 ⇒ θ = 60°।',
          'sin θ = sin 60° = √3/2।',
          'tan θ = tan 60° = √3।',
        ],
        rubric: 'কোণ নির্ণয়ে ১ নম্বর, উভয় মানে ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, p² - q² = 4√(pq)।',
        solution: [
          'বামপক্ষ = p² - q²',
          '= (tan θ + sin θ)² - (tan θ - sin θ)²',
          'বীজগাণিতিক সূত্র (a + b)² - (a - b)² = 4ab প্রয়োগ করে:',
          '= 4 tan θ sin θ',
          'ডানপক্ষ = 4√(pq) = 4√[(tan θ + sin θ)(tan θ - sin θ)]',
          '= 4√(tan²θ - sin²θ)  [যেহেতু (a+b)(a-b) = a² - b²]',
          '= 4√(sin²θ / cos²θ - sin²θ) = 4√[sin²θ (1/cos²θ - 1)]',
          '= 4√[sin²θ (sec²θ - 1)]',
          '= 4√(sin²θ tan²θ)  [যেহেতু sec²θ - 1 = tan²θ]',
          '= 4 sin θ tan θ = 4 tan θ sin θ।',
          'অতএব, বামপক্ষ = ডানপক্ষ (প্রমাণিত)।',
        ],
        rubric: 'বামপক্ষ 4 tan θ sin θ আনতে ১ নম্বর, ডানপক্ষে গুণফল ১ নম্বর, sec²θ - 1 প্রতিস্থাপনে ১ নম্বর, প্রমাণে ১ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'যদি p/q = (2 + √3)/(2 - √3) হয়, তবে যোজন-বিয়োজন করে θ এর মান নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, p / q = (tan θ + sin θ) / (tan θ - sin θ) = (2 + √3) / (2 - √3)',
          'যোজন-বিয়োজন করে পাই:',
          '[(tan θ + sin θ) + (tan θ - sin θ)] / [(tan θ + sin θ) - (tan θ - sin θ)] = [(2 + √3) + (2 - √3)] / [(2 + √3) - (2 - √3)]',
          '⇒ (2 tan θ) / (2 sin θ) = 4 / (2√3)',
          '⇒ tan θ / sin θ = 2 / √3',
          '⇒ (sin θ / cos θ) / sin θ = 2 / √3 ⇒ 1 / cos θ = 2 / √3',
          '⇒ cos θ = √3 / 2',
          'যেহেতু cos 30° = √3 / 2, সুতরাং θ = 30°। (উত্তর)',
        ],
        rubric: 'যোজন-বিয়োজনে ১ নম্বর, সরলীকরণে ১ নম্বর, cos θ মানে ১ নম্বর, কোণ নির্ণয়ে ১ নম্বর।',
      },
    ],
    examinerSecret:
      'p² - q² = 4√(pq) বোর্ড পরীক্ষার সবচেয়ে জনপ্রিয় প্রশ্ন। ডানপক্ষ থেকে বর্গমূলের ভেতর sin²θ কমন নিয়ে sec²θ - 1 = tan²θ লেখাটিই প্রমাণের আসল মাস্টার-স্ট্রোক।',
  },
];

interface MCQItem {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_MCQS: MCQItem[] = [
  {
    id: 1,
    question: 'tan θ = 3/4 হলে sin θ এর মান কত?',
    options: ['3/5', '4/5', '5/3', '5/4'],
    correctAnswer: 0,
    explanation:
      'tan θ = লম্ব/ভূমি = 3/4। পিথাগোরাস অনুসারে অতিভুজ = √(3² + 4²) = 5। অতএব sin θ = লম্ব/অতিভুজ = 3/5।',
  },
  {
    id: 2,
    question: 'নিচের কোনটি সঠিক অভেদাবলি?',
    options: [
      'sin²θ - cos²θ = 1',
      'sec²θ - tan²θ = 1',
      'csc²θ + cot²θ = 1',
      'tan²θ - sec²θ = 1',
    ],
    correctAnswer: 1,
    explanation:
      'মৌলিক অভেদাবলি: sec²θ - tan²θ = 1 (কারণ 1 + tan²θ = sec²θ)। অপর দুটি হলো sin²θ + cos²θ = 1 এবং csc²θ - cot²θ = 1।',
  },
  {
    id: 3,
    question: 'sin 60° এবং cos 30° এর মান যথাক্রমে কত?',
    options: ['1/2, √3/2', '√3/2, √3/2', '1/√2, 1/√2', '√3/2, 1/2'],
    correctAnswer: 1,
    explanation:
      'পরিপূরক কোণের ধর্ম অনুসারে sin 60° = cos(90° - 60°) = cos 30° = √3/2। উভয়ের মানই √3/2।',
  },
  {
    id: 4,
    question: 'নিচের কোনটির মান অসংজ্ঞায়িত (Undefined)?',
    options: ['tan 0°', 'cos 90°', 'tan 90°', 'sin 90°'],
    correctAnswer: 2,
    explanation:
      'tan 90° = sin 90° / cos 90° = 1 / 0। গণিতে শূন্য দ্বারা ভাগ অসংজ্ঞায়িত, তাই tan 90° অসংজ্ঞায়িত।',
  },
  {
    id: 5,
    question: '2 sin θ cos θ = sin θ সমীকরণে 0° < θ < 90° হলে θ এর মান কত?',
    options: ['30°', '45°', '60°', '90°'],
    correctAnswer: 2,
    explanation:
      '2 sin θ cos θ - sin θ = 0 ⇒ sin θ(2 cos θ - 1) = 0। যেহেতু সূক্ষ্মকোণে sin θ ≠ 0, সুতরাং 2 cos θ - 1 = 0 ⇒ cos θ = 1/2 ⇒ θ = 60°।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathTrigonometryGuidebook() {
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLab, setActiveLab] = useState<number>(1);

  // Lab 1: Right Triangle & 6 Ratios
  const [angleTheta, setAngleTheta] = useState<number>(36.87); // approx 3-4-5 triangle
  const rad = (angleTheta * Math.PI) / 180;
  const hyp = 10;
  const opp = hyp * Math.sin(rad);
  const adj = hyp * Math.cos(rad);
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.tan(rad);
  const cscVal = 1 / sinVal;
  const secVal = 1 / cosVal;
  const cotVal = 1 / tanVal;

  // Lab 2: 3 Identities State
  const [identityIndex, setIdentityIndex] = useState<number>(1); // 1: sin²+cos²=1, 2: sec²-tan²=1, 3: csc²-cot²=1

  // Lab 3: Trig Values & Hand Trick
  const [selectedHandAngle, setSelectedHandAngle] = useState<number>(30); // 0, 30, 45, 60, 90

  // Lab 4: Trig Equations
  const [equationPreset, setEquationPreset] = useState<'acute' | 'nonNegative'>('acute');

  // Lab 5: Complementary Angles
  const [compAngleA, setCompAngleA] = useState<number>(35);
  const compAngleC = 90 - compAngleA;

  // Step 2 CQ Accordions
  const [openCqIndex, setOpenCqIndex] = useState<number | null>(0);

  // Step 3 Challenges State
  const [ch1Input, setCh1Input] = useState<string>('');
  const [ch1Status, setCh1Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch2Input, setCh2Input] = useState<string>('');
  const [ch2Status, setCh2Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch3Input, setCh3Input] = useState<string>('');
  const [ch3Status, setCh3Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Step 4 Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  // Sheru AI Tutor Drawer State
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'sheru'; text: string }>>([
    {
      sender: 'sheru',
      text: 'স্বাগতম! আমি শেরু — তোমার গণিত ত্রিকোণমিতি গাইড। অধ্যায় ৯ ত্রিকোণমিতিক অনুপাত, ৩টি মৌলিক অভেদাবলি, মান ছক, p² - q² = 4√(pq) প্রমাণ বা সমীকরণ সমাধানে কোনো প্রশ্ন থাকলে আমাকে নির্ভয়ে বলো!',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Validations
  const validateCh1 = () => {
    // Challenge 1: tan = 3/4 => sin = 3/5 = 0.6
    const val = ch1Input.trim();
    if (val === '0.6' || val === '3/5') {
      setCh1Status('correct');
    } else {
      setCh1Status('wrong');
    }
  };

  const validateCh2 = () => {
    // Challenge 2: sin² 30° + cos² 30° = 1
    const val = parseFloat(ch2Input.trim());
    if (val === 1) {
      setCh2Status('correct');
    } else {
      setCh2Status('wrong');
    }
  };

  const validateCh3 = () => {
    // Challenge 3: (1 - tan² 45°) / (1 + tan² 45°) = 0
    const val = parseFloat(ch3Input.trim());
    if (val === 0) {
      setCh3Status('correct');
    } else {
      setCh3Status('wrong');
    }
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_MCQS.forEach((mcq) => {
      if (selectedAnswers[mcq.id] === mcq.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      let reply = 'দারুণ প্রশ্ন! ';
      if (userText.includes('অভেদাবলি') || userText.includes('sin²') || userText.includes('cos²')) {
        reply +=
          'ত্রিকোণমিতির প্রধান ৩টি অভেদাবলি হলো: ১. sin²θ + cos²θ = 1, ২. sec²θ - tan²θ = 1, এবং ৩. csc²θ - cot²θ = 1। এগুলো সবই পিথাগোরাসের লম্ব² + ভূমি² = অতিভুজ² সূত্র থেকে বাহু দিয়ে ভাগ করে পাওয়া যায়!';
      } else if (userText.includes('p²') || userText.includes('4√') || userText.includes('pq')) {
        reply +=
          'p² - q² = 4√(pq) প্রমাণের আসল কৌশল হলো: বামপক্ষে 4 tan θ sin θ নিয়ে আসা, আর ডানপক্ষে রুটের ভেতর sin²θ কমন নিয়ে sec²θ - 1 = tan²θ বসিয়ে বর্গমূল মুক্ত করা!';
      } else if (userText.includes('মান ছক') || userText.includes('হাতের তালু') || userText.includes('হাত')) {
        reply +=
          'হাতের তালুর নিয়মে: sin θ = √(নিচের আঙুল)/2 এবং cos θ = √(উপরের আঙুল)/2। যেমন ৩০° এর নিচে ১টি আঙুল, তাই sin 30° = √1/2 = 1/2!';
      } else if (userText.includes('সমীকরণ') || userText.includes('সূক্ষ্মকোণ') || userText.includes('শর্ত')) {
        reply +=
          'ত্রিকোণমিতিক সমীকরণে যদি শর্ত থাকে 0° < θ < 90°, তাহলে θ = 0° বা θ = 90° বর্জন করতে হবে! কারণ সূক্ষ্মকোণ সর্বদা ০° এর বেশি এবং ৯০° এর কম হয়।';
      } else {
        reply +=
          'সমকোণী ত্রিভুজে কোণ θ-এর বিপরীত বাহুই হলো লম্ব, সন্নিহিত বাহু ভূমি এবং সমকোণের বিপরীত বাহু অতিভুজ। এই ৩টি বাহুর অনুপাত মুখস্থ রাখলে ত্রিকোণমিতি পানি হয়ে যাবে!';
      }
      setChatMessages((prev) => [...prev, { sender: 'sheru', text: reply }]);
    }, 600);
  };

  // Lab 1 SVG geometry
  const svgWidth = 280;
  const svgHeight = 220;
  const scale = 16;
  const ptB = { x: 50, y: 180 }; // Right angle vertex
  const ptA = { x: 50 + adj * scale, y: 180 }; // Base vertex (angle theta)
  const ptC = { x: 50, y: 180 - opp * scale }; // Top vertex

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* --------------------------------------------------------------------- */}
      {/* HEADER SECTION (Top Navigation & Breadcrumb)                          */}
      {/* --------------------------------------------------------------------- */}
      <GuidebookHeaderNav
        subjectKey="math"
        subjectNameBn="সাধারণ গণিত"
        chapterNum={9}
        chapterTitleBn="ত্রিকোণমিতিক অনুপাত (Trigonometric Ratios)"
        activeLesson={activeLab}
        activeLessonTitle={LAB_LESSONS[activeLab - 1]?.title}
        onOpenAi={() => setIsTutorOpen(true)}
        aiButtonLabel="শেরু এআই টিউটর"
      />

      {/* Navigation Tabs (5 Steps) Sub-Bar */}
      <div className="border-b border-border bg-card/90 backdrop-blur-md sticky top-[49px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-1.5 p-1 bg-muted/70 rounded-2xl border border-border overflow-x-auto w-fit">
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'learn'
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>১. কনসেপ্ট ল্যাব</span>
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'examples'
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              <span>২. বোর্ড CQ</span>
            </button>
            <button
              onClick={() => setActiveTab('try')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'try'
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
              <span>৩. নিজে করো</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>৪. যাচাই</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'summary'
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span>৫. সারসংক্ষেপ</span>
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: LEARN CONCEPT (5 INTERACTIVE LABS)                             */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'learn' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Sub-navigation for 5 Labs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {LAB_LESSONS.map((lab) => (
              <button
                key={lab.id}
                onClick={() => setActiveLab(lab.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  activeLab === lab.id
                    ? 'border-[#FF6B57] bg-primary/5 shadow-xs ring-1 ring-[#FF6B57]/30'
                    : 'border-border/70 bg-card hover:border-border'
                }`}
              >
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black mb-1.5 ${
                      activeLab === lab.id ? 'bg-[#FF6B57] text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {lab.badge}
                  </span>
                  <div className="text-xs font-bold text-foreground line-clamp-2">{lab.title}</div>
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 font-mono">{lab.nctbPage}</div>
              </button>
            ))}
          </div>

          {/* Intro Card */}
          <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-primary">
                {LAB_LESSONS[activeLab - 1].subtitle}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                {LAB_LESSONS[activeLab - 1].intro}
              </p>
            </div>
          </div>

          {/* LAB 1: RIGHT TRIANGLE & 6 TRIG RATIOS */}
          {activeLab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive Triangle Canvas */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Triangle className="h-4 w-4 text-primary" />
                    <span>সমকোণী ত্রিভুজ সিমুলেটর ও কোণ θ</span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">
                    অতিভুজ c = {hyp.toFixed(1)}
                  </span>
                </div>

                <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center bg-muted/20 rounded-2xl border border-border/50">
                  <svg viewBox="0 0 280 220" className="w-full h-full">
                    {/* Triangle Polygon */}
                    <polygon
                      points={`${ptB.x},${ptB.y} ${ptA.x},${ptA.y} ${ptC.x},${ptC.y}`}
                      className="fill-primary/5 stroke-foreground stroke-[2.5]"
                    />

                    {/* Right Angle Marker at B */}
                    <path
                      d={`M ${ptB.x} ${ptB.y - 12} L ${ptB.x + 12} ${ptB.y - 12} L ${ptB.x + 12} ${ptB.y}`}
                      fill="none"
                      className="stroke-muted-foreground stroke-[1.5]"
                    />

                    {/* Vertices */}
                    <circle cx={ptA.x} cy={ptA.y} r="4" className="fill-blue-600" />
                    <text x={ptA.x + 6} y={ptA.y + 14} className="text-[12px] font-bold fill-blue-600">
                      A (θ)
                    </text>

                    <circle cx={ptB.x} cy={ptB.y} r="3.5" className="fill-foreground" />
                    <text x={ptB.x - 16} y={ptB.y + 14} className="text-[11px] font-bold fill-foreground">
                      B (90°)
                    </text>

                    <circle cx={ptC.x} cy={ptC.y} r="4" className="fill-purple-600" />
                    <text x={ptC.x - 16} y={ptC.y - 6} className="text-[12px] font-bold fill-purple-600">
                      C
                    </text>

                    {/* Side Labels */}
                    <text
                      x={ptB.x - 22}
                      y={(ptB.y + ptC.y) / 2}
                      className="text-[11px] font-bold fill-rose-600"
                    >
                      লম্ব {opp.toFixed(1)}
                    </text>
                    <text
                      x={(ptB.x + ptA.x) / 2}
                      y={ptB.y + 18}
                      className="text-[11px] font-bold fill-emerald-600 text-center"
                    >
                      ভূমি {adj.toFixed(1)}
                    </text>
                    <text
                      x={(ptA.x + ptC.x) / 2 + 10}
                      y={(ptA.y + ptC.y) / 2 - 8}
                      className="text-[11px] font-bold fill-primary"
                    >
                      অতিভুজ {hyp.toFixed(1)}
                    </text>

                    {/* Angle θ Arc */}
                    <path
                      d={`M ${ptA.x - 20} ${ptA.y} A 20 20 0 0 1 ${ptA.x - 20 * Math.cos(rad)} ${ptA.y - 20 * Math.sin(rad)}`}
                      fill="none"
                      className="stroke-blue-600 stroke-[2]"
                    />
                  </svg>
                </div>

                {/* Live 6 Ratio Cards Grid */}
                <div className="grid grid-cols-3 gap-2 w-full mt-4">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-center">
                    <div className="text-[10px] text-primary font-bold">sin θ (লম্ব/অতিভুজ)</div>
                    <div className="text-sm font-black text-primary">{sinVal.toFixed(3)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <div className="text-[10px] text-blue-600 font-bold">cos θ (ভূমি/অতিভুজ)</div>
                    <div className="text-sm font-black text-blue-700 dark:text-blue-400">{cosVal.toFixed(3)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <div className="text-[10px] text-emerald-600 font-bold">tan θ (লম্ব/ভূমি)</div>
                    <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">{tanVal.toFixed(3)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                    <div className="text-[10px] text-purple-600 font-bold">csc θ (1/sin)</div>
                    <div className="text-sm font-black text-purple-700 dark:text-purple-400">{cscVal.toFixed(3)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <div className="text-[10px] text-amber-600 font-bold">sec θ (1/cos)</div>
                    <div className="text-sm font-black text-amber-700 dark:text-amber-400">{secVal.toFixed(3)}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center">
                    <div className="text-[10px] text-teal-600 font-bold">cot θ (1/tan)</div>
                    <div className="text-sm font-black text-teal-700 dark:text-teal-400">{cotVal.toFixed(3)}</div>
                  </div>
                </div>
              </div>

              {/* Controls and Mnemonics */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <span>সূক্ষ্মকোণ θ স্লাইডার</span>
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-muted-foreground">কোণ θ এর মান:</span>
                      <span className="font-bold text-primary">{angleTheta.toFixed(1)}°</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      step="1"
                      value={angleTheta}
                      onChange={(e) => setAngleTheta(parseFloat(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>15°</span>
                      <span>36.9° (3-4-5)</span>
                      <span>75°</span>
                    </div>
                  </div>

                  {/* Standard Presets */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => setAngleTheta(30)}
                      className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all ${
                        angleTheta === 30 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      30°
                    </button>
                    <button
                      onClick={() => setAngleTheta(45)}
                      className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all ${
                        angleTheta === 45 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      45°
                    </button>
                    <button
                      onClick={() => setAngleTheta(60)}
                      className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all ${
                        angleTheta === 60 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      60°
                    </button>
                  </div>
                </div>

                {/* Bengali Mnemonic Vault */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>অনুপাত মনে রাখার ৩টি বাংলা ছন্দ</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-foreground">
                      <strong className="text-primary">সাগরে লবণ অনেক:</strong> sin θ = লম্ব / অতিভুজ
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-foreground">
                      <strong className="text-blue-600">কবরে ভূত অনেক:</strong> cos θ = ভূমি / অতিভুজ
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-foreground">
                      <strong className="text-emerald-600">ট্যারা লম্বা ভূত:</strong> tan θ = লম্ব / ভূমি
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 2: 3 FUNDAMENTAL IDENTITIES */}
          {activeLab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Identity Interactive Balancer */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-primary" />
                    <span>পিথাগোরাস ও ত্রিকোণমিতিক অভেদাবলি</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    সমষ্টি সর্বদা = ১
                  </span>
                </div>

                {/* Identity Equation Display Box */}
                <div className="p-6 rounded-3xl bg-muted/30 border border-border w-full text-center space-y-3">
                  {identityIndex === 1 && (
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary">
                        অভেদাবলি ০১: সাইন ও কোসাইন
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-primary">
                        <RenderMathText text="$\sin^2 \theta + \cos^2 \theta = 1$" />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ({sinVal.toFixed(3)})² + ({cosVal.toFixed(3)})² = {(sinVal * sinVal).toFixed(3)} + {(cosVal * cosVal).toFixed(3)} = 1.000
                      </div>
                    </div>
                  )}

                  {identityIndex === 2 && (
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600">
                        অভেদাবলি ০২: সেক ও ট্যানজেন্ট
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-blue-600">
                        <RenderMathText text="$\sec^2 \theta - \tan^2 \theta = 1$" />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ({secVal.toFixed(3)})² - ({tanVal.toFixed(3)})² = {(secVal * secVal).toFixed(3)} - {(tanVal * tanVal).toFixed(3)} = 1.000
                      </div>
                    </div>
                  )}

                  {identityIndex === 3 && (
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-600">
                        অভেদাবলি ০৩: কোসেক ও কোট্যানজেন্ট
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-purple-600">
                        <RenderMathText text="$\csc^2 \theta - \cot^2 \theta = 1$" />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ({cscVal.toFixed(3)})² - ({cotVal.toFixed(3)})² = {(cscVal * cscVal).toFixed(3)} - {(cotVal * cotVal).toFixed(3)} = 1.000
                      </div>
                    </div>
                  )}
                </div>

                {/* Angle slider in Lab 2 */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">কোণ θ পরিবর্তন করুন:</span>
                    <span className="font-bold text-primary">{angleTheta.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="75"
                    step="1"
                    value={angleTheta}
                    onChange={(e) => setAngleTheta(parseFloat(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Identity Selectors & Derived Forms */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium block">
                    অভেদাবলি নির্বাচন করুন:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setIdentityIndex(1)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        identityIndex === 1
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      sin² + cos²
                    </button>
                    <button
                      onClick={() => setIdentityIndex(2)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        identityIndex === 2
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      sec² - tan²
                    </button>
                    <button
                      onClick={() => setIdentityIndex(3)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        identityIndex === 3
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      csc² - cot²
                    </button>
                  </div>

                  {/* Derived Equivalents */}
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                    <div className="font-bold text-foreground">অনুরূপ রূপান্তরসমূহ (Derived Forms):</div>
                    {identityIndex === 1 && (
                      <div className="space-y-1 text-muted-foreground">
                        <div>• <RenderMathText text="$\sin^2 \theta = 1 - \cos^2 \theta$" /></div>
                        <div>• <RenderMathText text="$\cos^2 \theta = 1 - \sin^2 \theta$" /></div>
                        <div>• <RenderMathText text="$\sin \theta = \sqrt{1 - \cos^2 \theta}$" /></div>
                      </div>
                    )}
                    {identityIndex === 2 && (
                      <div className="space-y-1 text-muted-foreground">
                        <div>• <RenderMathText text="$\sec^2 \theta = 1 + \tan^2 \theta$" /></div>
                        <div>• <RenderMathText text="$\tan^2 \theta = \sec^2 \theta - 1$" /></div>
                        <div>• <RenderMathText text="$(\sec \theta + \tan \theta)(\sec \theta - \tan \theta) = 1$" /></div>
                      </div>
                    )}
                    {identityIndex === 3 && (
                      <div className="space-y-1 text-muted-foreground">
                        <div>• <RenderMathText text="$\csc^2 \theta = 1 + \cot^2 \theta$" /></div>
                        <div>• <RenderMathText text="$\cot^2 \theta = \csc^2 \theta - 1$" /></div>
                        <div>• <RenderMathText text="$(\csc \theta + \cot \theta)(\csc \theta - \cot \theta) = 1$" /></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proof Intuition */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>পিথাগোরাস থেকে সরাসরি প্রমাণ</span>
                  </div>
                  <p className="leading-relaxed">
                    সমকোণী ত্রিভুজে <RenderMathText text="$a^2 + b^2 = c^2$" />। উভয়পক্ষকে অতিভুজ <RenderMathText text="$c^2$" /> দিয়ে ভাগ করলে পাই: <RenderMathText text="$(a/c)^2 + (b/c)^2 = 1 \implies \sin^2 \theta + \cos^2 \theta = 1$" />।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAB 3: STANDARD TRIG VALUES & HAND TRICK */}
          {activeLab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Values Table & Hand Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span>এনসিটিবি আদর্শ কোণসমূহের মান ছক</span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">০° থেকে ৯০°</span>
                </div>

                {/* Angle Selector Chips */}
                <div className="flex gap-2">
                  {[0, 30, 45, 60, 90].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setSelectedHandAngle(deg)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedHandAngle === deg
                          ? 'bg-[#FF6B57] text-white shadow-xs'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>

                {/* Hand Trick Interactive Visual Card */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                  <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>বাম হাতের তালু কৌশল ({selectedHandAngle}° কোণ)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                    <div className="p-2 bg-card rounded-xl border border-border">
                      <div className="text-[10px] text-muted-foreground">sin {selectedHandAngle}°</div>
                      <div className="font-bold text-primary">
                        {selectedHandAngle === 0 && '0'}
                        {selectedHandAngle === 30 && '1/2'}
                        {selectedHandAngle === 45 && '1/√2'}
                        {selectedHandAngle === 60 && '√3/2'}
                        {selectedHandAngle === 90 && '1'}
                      </div>
                    </div>
                    <div className="p-2 bg-card rounded-xl border border-border">
                      <div className="text-[10px] text-muted-foreground">cos {selectedHandAngle}°</div>
                      <div className="font-bold text-blue-600">
                        {selectedHandAngle === 0 && '1'}
                        {selectedHandAngle === 30 && '√3/2'}
                        {selectedHandAngle === 45 && '1/√2'}
                        {selectedHandAngle === 60 && '1/2'}
                        {selectedHandAngle === 90 && '0'}
                      </div>
                    </div>
                    <div className="p-2 bg-card rounded-xl border border-border">
                      <div className="text-[10px] text-muted-foreground">tan {selectedHandAngle}°</div>
                      <div className="font-bold text-emerald-600">
                        {selectedHandAngle === 0 && '0'}
                        {selectedHandAngle === 30 && '1/√3'}
                        {selectedHandAngle === 45 && '1'}
                        {selectedHandAngle === 60 && '√3'}
                        {selectedHandAngle === 90 && 'অসংজ্ঞায়িত'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Table */}
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-[11px] text-center border-collapse">
                    <thead className="bg-muted/70 text-foreground font-bold">
                      <tr>
                        <th className="p-2 border-b border-border">অনুপাত</th>
                        <th className="p-2 border-b border-border">০°</th>
                        <th className="p-2 border-b border-border">৩০°</th>
                        <th className="p-2 border-b border-border">৪৫°</th>
                        <th className="p-2 border-b border-border">৬০°</th>
                        <th className="p-2 border-b border-border">৯০°</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-muted-foreground font-mono">
                      <tr>
                        <td className="p-2 font-bold text-primary font-sans">sin θ</td>
                        <td className="p-2">0</td>
                        <td className="p-2">1/2</td>
                        <td className="p-2">1/√2</td>
                        <td className="p-2">√3/2</td>
                        <td className="p-2">1</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-600 font-sans">cos θ</td>
                        <td className="p-2">1</td>
                        <td className="p-2">√3/2</td>
                        <td className="p-2">1/√2</td>
                        <td className="p-2">1/2</td>
                        <td className="p-2">0</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-emerald-600 font-sans">tan θ</td>
                        <td className="p-2">0</td>
                        <td className="p-2">1/√3</td>
                        <td className="p-2">1</td>
                        <td className="p-2">√3</td>
                        <td className="p-2 text-red-500 font-bold font-sans">অসংজ্ঞায়িত</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-purple-600 font-sans">cot θ</td>
                        <td className="p-2 text-red-500 font-bold font-sans">অসংজ্ঞায়িত</td>
                        <td className="p-2">√3</td>
                        <td className="p-2">1</td>
                        <td className="p-2">1/√3</td>
                        <td className="p-2">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hand Rule Explanation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>বাম হাতের ৫ আঙুল ফর্মুলা</span>
                  </h3>
                  <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-2 text-xs text-muted-foreground leading-relaxed">
                    <div>
                      <strong className="text-foreground">• সাইন (sin θ):</strong>{' '}
                      <RenderMathText text="$\sin \theta = \frac{\sqrt{\text{নিচের আঙুলের সংখ্যা}}}{2}$" />
                    </div>
                    <div>
                      <strong className="text-foreground">• কোসাইন (cos θ):</strong>{' '}
                      <RenderMathText text="$\cos \theta = \frac{\sqrt{\text{উপরের আঙুলের সংখ্যা}}}{2}$" />
                    </div>
                    <div>
                      <strong className="text-foreground">• ট্যান (tan θ):</strong>{' '}
                      <RenderMathText text="$\tan \theta = \sqrt{\frac{\text{নিচের আঙুল}}{\text{উপরের আঙুল}}}$" />
                    </div>
                  </div>
                </div>

                {/* Undefined Values Alert */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-rose-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>কেন কিছু মান অসংজ্ঞায়িত?</span>
                  </div>
                  <p className="leading-relaxed">
                    tan 90° = sin 90° / cos 90° = 1 / 0। গণিতে শূন্য (0) দ্বারা কোনো সংখ্যাকে ভাগ করা যায় না, তাই tan 90°, csc 0°, sec 90° এবং cot 0° এর মান সর্বদা অসংজ্ঞায়িত (Undefined)।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAB 4: TRIG EQUATIONS & CONSTRAINTS */}
          {activeLab === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Solver Steps */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>বোর্ড মডেল সমীকরণ সমাধান</span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">
                    2 cos²θ + 3 sin θ - 3 = 0
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
                    <div className="font-bold text-foreground">ধাপ ১: একই অনুপাতে রূপান্তর (cos²θ = 1 - sin²θ)</div>
                    <div className="font-mono text-primary">
                      2(1 - sin²θ) + 3 sin θ - 3 = 0 ⇒ 2 sin²θ - 3 sin θ + 1 = 0
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
                    <div className="font-bold text-foreground">ধাপ ২: মধ্যপদ বিভাজন (Middle-term factorization)</div>
                    <div className="font-mono text-blue-600">
                      (2 sin θ - 1)(sin θ - 1) = 0
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
                    <div className="font-bold text-foreground">ধাপ ৩: মূলদ্বয় নির্ণয়</div>
                    <div className="font-mono text-foreground">
                      মূল ১: sin θ = 1/2 ⇒ θ = 30°<br />
                      মূল ২: sin θ = 1 ⇒ θ = 90°
                    </div>
                  </div>
                </div>

                {/* Filter Outcome */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">
                    শর্ত ফিল্টারিং ফলাফল ({equationPreset === 'acute' ? 'সূক্ষ্মকোণ 0° < θ < 90°' : 'অঋণাত্মক 0° ≤ θ ≤ 90°'}):
                  </div>
                  <div className="mt-1 font-mono text-sm font-black text-emerald-700 dark:text-emerald-400">
                    {equationPreset === 'acute' ? 'নির্ণেয় সমাধান: θ = 30° (90° বর্জনীয়)' : 'নির্ণেয় সমাধান: θ = 30°, 90°'}
                  </div>
                </div>
              </div>

              {/* Controls and Constraints */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium block">
                    কোণের শর্ত নির্বাচন করুন:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEquationPreset('acute')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        equationPreset === 'acute'
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      সূক্ষ্মকোণ (0° &lt; θ &lt; 90°)
                    </button>
                    <button
                      onClick={() => setEquationPreset('nonNegative')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        equationPreset === 'nonNegative'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      ০° ≤ θ ≤ ৯০°
                    </button>
                  </div>
                </div>

                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>পরীক্ষকের সতর্কবাণী</span>
                  </div>
                  <p className="leading-relaxed">
                    যদি sin θ বা cos θ এর মান ১ এর চেয়ে বড় আসে (যেমন sin θ = 2), তবে অবশ্যই লিখতে হবে: "যেহেতু -1 ≤ sin θ ≤ 1, তাই মানটি গ্রহণযোগ্য নয়।"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAB 5: COMPLEMENTARY ANGLES & CONVERSIONS */}
          {activeLab === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Perspective Swap Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Triangle className="h-4 w-4 text-primary" />
                    <span>পরিপূরক কোণ ল্যাব: sin(90° - θ) = cos θ</span>
                  </div>
                  <span className="text-xs font-mono text-purple-600 font-bold">
                    A + C = 90°
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-muted/20 border border-border w-full text-center space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                      <div className="text-xs font-bold text-primary">কোণ A সাপেক্ষে ({compAngleA}°)</div>
                      <div className="text-sm font-mono mt-1">
                        sin {compAngleA}° = {Math.sin((compAngleA * Math.PI) / 180).toFixed(3)}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <div className="text-xs font-bold text-blue-600">কোণ C সাপেক্ষে ({compAngleC}°)</div>
                      <div className="text-sm font-mono mt-1">
                        cos {compAngleC}° = {Math.cos((compAngleC * Math.PI) / 180).toFixed(3)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    sin {compAngleA}° = cos {compAngleC}° (দুটোই সমান!)
                  </div>
                </div>

                {/* Slider for Angle A */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">কোণ A পরিবর্তন করুন:</span>
                    <span className="font-bold text-primary">{compAngleA}° (C = {compAngleC}°)</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={compAngleA}
                    onChange={(e) => setCompAngleA(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Complementary Identities List */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>পরিপূরক কোণের ৬টি রূপান্তর</span>
                  </h3>
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs font-mono text-muted-foreground">
                    <div>• sin(90° - θ) = cos θ</div>
                    <div>• cos(90° - θ) = sin θ</div>
                    <div>• tan(90° - θ) = cot θ</div>
                    <div>• cot(90° - θ) = tan θ</div>
                    <div>• sec(90° - θ) = csc θ</div>
                    <div>• csc(90° - θ) = sec θ</div>
                  </div>
                </div>

                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground">কেন এমন হয়?</div>
                  <p className="leading-relaxed">
                    কোণ A-এর জন্য যে বাহুটি লম্ব (বিপরীত বাহু), কোণ C-এর জন্য সেই বাহুটিই সন্নিহিত বাহু (ভূমি)। বাহুর এই অদলবদলের কারণেই sin ও cos পরস্পরের সমান হয়!
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: SEE EXAMPLE (WORKED BOARD CQS WITH MARK RUBRICS)               */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'examples' && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-blue-800 dark:text-blue-300">
                শীর্ষ বোর্ড সৃজনশীল প্রশ্ন (Worked Board CQs)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                ঢাকা, রাজশাহী ও যশোর বোর্ডের সর্বাধিক কমন ৩টি ত্রিকোণমিতিক সৃজনশীল প্রশ্ন। প্রতিটি প্রশ্নের ক, খ ও গ অংশের পূর্ণ সমাধান এবং পরীক্ষকের গোপন মার্কিং রুব্রিক্স দেওয়া হলো।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {WORKED_CQS.map((cq, index) => {
              const isOpen = openCqIndex === index;
              return (
                <div
                  key={cq.id}
                  className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs"
                >
                  {/* CQ Header */}
                  <button
                    onClick={() => setOpenCqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between hover:bg-muted/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        {cq.boardSource}
                      </span>
                      <div className="text-sm font-bold text-foreground mt-1">{cq.stem}</div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* CQ Body */}
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-border space-y-6 bg-muted/10">
                      {cq.parts.map((part) => (
                        <div key={part.label} className="p-4 rounded-2xl bg-card border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
                                {part.label}
                              </span>
                              <span className="text-xs font-bold text-foreground">
                                {part.question}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono font-bold text-muted-foreground">
                              [{part.marks} নম্বর]
                            </span>
                          </div>

                          {/* Solution Steps */}
                          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-1.5 text-xs text-foreground/90 leading-relaxed font-sans">
                            {part.solution.map((line, lIdx) => (
                              <div key={lIdx}>{line}</div>
                            ))}
                          </div>

                          {/* Mark Rubric */}
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 shrink-0" />
                            <span>মার্ক বণ্টন: {part.rubric}</span>
                          </div>
                        </div>
                      ))}

                      {/* Examiner Secret Alert */}
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>পরীক্ষকের গোপন সতর্কতা:</strong> {cq.examinerSecret}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: TRY YOURSELF (3 INTERACTIVE CHALLENGES)                         */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'try' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <CheckSquare className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                ইন্টারেক্টিভ গণিত চ্যালেঞ্জ (Try Yourself)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                ত্রিকোণমিতিক অনুপাত ও অভেদাবলির বাস্তব সমস্যা সমাধান করুন। সঠিক উত্তর ইনপুট দিয়ে তাৎক্ষণিক গ্রিন টিক অর্জন করুন।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* CHALLENGE 1 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                  চ্যালেঞ্জ ০১: অনুপাত ও পিথাগোরাস
                </span>
                {ch1Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                যদি <RenderMathText text="$\tan \theta = \frac{3}{4}$" /> হয়, তবে <RenderMathText text="$\sin \theta$" /> এর মান কত? (দশমিক মান যেমন 0.6 অথবা ভগ্নাংশ 3/5 লিখুন)
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="যেমন: 0.6 অথবা 3/5"
                  value={ch1Input}
                  onChange={(e) => setCh1Input(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={validateCh1}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B57] text-white hover:bg-[#e05340] transition-colors"
                >
                  যাচাই
                </button>
              </div>

              {ch1Status === 'wrong' && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। লম্ব = ৩, ভূমি = ৪ হলে অতিভুজ = ৫, সুতরাং sin θ = ৩/৫ = ০.৬।
                </div>
              )}
            </div>

            {/* CHALLENGE 2 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  চ্যালেঞ্জ ০২: মৌলিক অভেদাবলি মান
                </span>
                {ch2Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                <RenderMathText text="$\sin^2 30^\circ + \cos^2 30^\circ$" /> এর সাংখ্যিক মান কত?
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="মান লিখুন (যেমন: 1)"
                  value={ch2Input}
                  onChange={(e) => setCh2Input(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  onClick={validateCh2}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  যাচাই
                </button>
              </div>

              {ch2Status === 'wrong' && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। মনে রাখবেন: যেকোনো কোণ θ-এর জন্য sin²θ + cos²θ = ১।
                </div>
              )}
            </div>

            {/* CHALLENGE 3 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  চ্যালেঞ্জ ০৩: মান ছক ক্যালকুলেশন
                </span>
                {ch3Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                <RenderMathText text="$\frac{1 - \tan^2 45^\circ}{1 + \tan^2 45^\circ}$" /> এর মান কত?
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="মান লিখুন (যেমন: 0)"
                  value={ch3Input}
                  onChange={(e) => setCh3Input(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
                <button
                  onClick={validateCh3}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  যাচাই
                </button>
              </div>

              {ch3Status === 'wrong' && (
                <div className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। tan 45° = 1, সুতরাং (1 - 1²) / (1 + 1²) = 0 / 2 = 0।
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: CHECK UNDERSTANDING (5 MCQS WITH 100% COMPLETION)               */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'quiz' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <Award className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                ত্রিকোণমিতি অধ্যায় কুইজ ও আত্মযাচাই
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                এনসিটিবি সিলেবাসের ৫টি স্ট্যান্ডার্ড বহুনির্বাচনী প্রশ্ন। অপশন নির্বাচন করে ফলাফল ও বিস্তারিত ব্যাখ্যা দেখুন।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {QUIZ_MCQS.map((mcq, qIdx) => (
              <div
                key={mcq.id}
                data-quiz-question={mcq.id}
                className="p-5 rounded-3xl bg-card border border-border space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                    {qIdx + 1}
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-foreground">
                    {mcq.question}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {mcq.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[mcq.id] === optIdx;
                    const isCorrect = optIdx === mcq.correctAnswer;
                    let btnStyle = 'border-border bg-card hover:bg-muted/50';

                    if (isQuizSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 line-through';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-[#FF6B57] bg-primary/10 text-primary font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          if (!isQuizSubmitted) {
                            setSelectedAnswers((prev) => ({ ...prev, [mcq.id]: optIdx }));
                          }
                        }}
                        className={`p-3 rounded-2xl text-left border text-xs transition-all ${btnStyle}`}
                      >
                        <span className="font-mono text-muted-foreground mr-1.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {isQuizSubmitted && (
                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground mt-2">
                    <strong className="text-foreground">ব্যাখ্যা: </strong>
                    {mcq.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit / Reset Actions */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
            <div>
              {isQuizSubmitted ? (
                <div className="text-sm font-bold text-foreground">
                  আপনার স্কোর:{' '}
                  <span className="text-primary font-black">
                    {calculateScore()} / {QUIZ_MCQS.length}
                  </span>{' '}
                  ({Math.round((calculateScore() / QUIZ_MCQS.length) * 100)}%)
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  উত্তর দেওয়া হয়েছে: {Object.keys(selectedAnswers).length} / {QUIZ_MCQS.length}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {isQuizSubmitted ? (
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setIsQuizSubmitted(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>পুনরায় চেষ্টা করুন</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsQuizSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#FF6B57] text-white hover:bg-[#e05340] disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>কুইজ সাবমিট করুন</span>
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: SUMMARY & REVISION CHEAT SHEET                                 */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'summary' && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-purple-800 dark:text-purple-300">
                অধ্যায় ৯: ত্রিকোণমিতিক অনুপাত রিভিশন চিট-শীট
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                পরীক্ষার আগের রাতের জন্য এনসিটিবি ত্রিকোণমিতি অধ্যায়ের সমস্ত মৌলিক সূত্র, অভেদাবলি ও মানসমূহের চূড়ান্ত সারসংক্ষেপ।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-primary/10 text-primary">
                মৌলিক ৬টি অনুপাত
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\sin \theta = \frac{\text{লম্ব}}{\text{অতিভুজ}}, \cos \theta = \frac{\text{ভূমি}}{\text{অতিভুজ}}, \tan \theta = \frac{\text{লম্ব}}{\text{ভূমি}}$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                বিপরীত অনুপাত: <RenderMathText text="$\csc \theta = \frac{1}{\sin \theta}, \sec \theta = \frac{1}{\cos \theta}, \cot \theta = \frac{1}{\tan \theta}$" />। এছাড়া <RenderMathText text="$\tan \theta = \frac{\sin \theta}{\cos \theta}, \cot \theta = \frac{\cos \theta}{\sin \theta}$" />।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/10 text-blue-600">
                ৩টি মৌলিক অভেদাবলি
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\sin^2 \theta + \cos^2 \theta = 1, \sec^2 \theta - \tan^2 \theta = 1, \csc^2 \theta - \cot^2 \theta = 1$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                রূপান্তর: <RenderMathText text="$\sec^2 \theta = 1 + \tan^2 \theta$" /> এবং <RenderMathText text="$\csc^2 \theta = 1 + \cot^2 \theta$" />।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-600">
                আদর্শ কোণের মান
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\sin 30^\circ = \cos 60^\circ = \frac{1}{2}, \sin 45^\circ = \cos 45^\circ = \frac{1}{\sqrt{2}}$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <RenderMathText text="$\sin 60^\circ = \cos 30^\circ = \frac{\sqrt{3}}{2}, \tan 45^\circ = 1, \tan 30^\circ = \frac{1}{\sqrt{3}}, \tan 60^\circ = \sqrt{3}$" />।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/10 text-purple-600">
                পরিপূরক কোণ
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\sin(90^\circ - \theta) = \cos \theta, \cos(90^\circ - \theta) = \sin \theta, \tan(90^\circ - \theta) = \cot \theta$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                সমকোণী ত্রিভুজের অপর দুই সূক্ষ্মকোণ পরস্পর পরিপূরক হওয়ায় লম্ব ও ভূমি স্থান অদলবদল করে।
              </p>
            </div>
          </div>

          {/* Copyable Study Notes Box */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Copy className="h-4 w-4 text-primary" />
                <span>এক নজরে ত্রিকোণমিতি অধ্যায়ের রিভিশন নোটস (কপি করুন)</span>
              </span>
              <button
                onClick={() => {
                  const text = `ত্রিকোণমিতিক অনুপাত অধ্যায় ৯ এনসিটিবি রিভিশন নোটস:
১. sin θ = লম্ব/অতিভুজ, cos θ = ভূমি/অতিভুজ, tan θ = লম্ব/ভূমি
২. csc θ = ১/sin θ, sec θ = ১/cos θ, cot θ = ১/tan θ
৩. tan θ = sin θ/cos θ, cot θ = cos θ/sin θ
৪. sin²θ + cos²θ = ১ ⇒ sin²θ = ১ - cos²θ, cos²θ = ১ - sin²θ
৫. sec²θ - tan²θ = ১ ⇒ sec²θ = ১ + tan²θ, tan²θ = sec²θ - ১
৬. csc²θ - cot²θ = ১ ⇒ csc²θ = ১ + cot²θ, cot²θ = csc²θ - ১
৭. sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, sin 90° = 1
৮. tan 30° = 1/√3, tan 45° = 1, tan 60° = √3, tan 90° = অসংজ্ঞায়িত
৯. সমীকরণে 0° < θ < 90° শর্ত থাকলে 0° ও 90° বর্জন করতে হবে।`;
                  navigator.clipboard.writeText(text);
                  alert('নোট কপি হয়েছে!');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>কপি করুন</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-muted/50 border border-border text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
{`১. মৌলিক ৩টি অভেদাবলি:
   • sin²θ + cos²θ = 1
   • sec²θ - tan²θ = 1
   • csc²θ - cot²θ = 1
২. বিপরীত সম্পর্ক: csc θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ
৩. মান ছক (০°, ৩০°, ৪৫°, ৬০°, ৯০°):
   • sin: 0, 1/2, 1/√2, √3/2, 1
   • cos: 1, √3/2, 1/√2, 1/2, 0
   • tan: 0, 1/√3, 1, √3, অসংজ্ঞায়িত
৪. পরিপূরক কোণ: sin(90° - θ) = cos θ, tan(90° - θ) = cot θ
৫. ক্লাসিক CQ প্রমাণ: p² - q² = 4√(pq), যেখানে p = tan θ + sin θ, q = tan θ - sin θ`}
            </pre>
          </div>
        </main>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* FLOATING SHERU AI SOCRATIC COMPANION DRAWER BUTTON                     */}
      {/* --------------------------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsTutorOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#FF6B57] text-white font-bold shadow-lg hover:bg-[#e05340] hover:scale-105 active:scale-95 transition-all text-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>শেরু AI টিউটর</span>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SHERU AI TUTOR DRAWER MODAL                                           */}
      {/* --------------------------------------------------------------------- */}
      {isTutorOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/40 backdrop-blur-xs">
          <div className="w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[520px] max-h-[90vh] overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
                  শেরু
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">শেরু AI ত্রিকোণমিতি গাইড</h3>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>সক্রিয় • অনুপাত ও CQ বিশেষজ্ঞ</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsTutorOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#FF6B57] text-white rounded-tr-none'
                        : 'bg-muted border border-border text-foreground rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Chips */}
            <div className="px-3 py-1.5 bg-muted/20 border-t border-border flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => setInputMessage('sin²θ + cos²θ = 1 এর প্রমাণ কিভাবে করব?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                sin²+cos² প্রমাণ?
              </button>
              <button
                onClick={() => setInputMessage('p² - q² = 4√(pq) প্রমাণ করার কৌশল কি?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                p²-q²=4√(pq)?
              </button>
              <button
                onClick={() => setInputMessage('হাতের তালু দিয়ে ত্রিকোণমিতিক মান কিভাবে মনে রাখব?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                হাতের তালুর কৌশল?
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-border flex items-center gap-2 bg-card">
              <input
                type="text"
                placeholder="ত্রিকোণমিতি সম্পর্কিত যে কোনো প্রশ্ন লিখুন..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 rounded-xl bg-muted/60 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-[#FF6B57] text-white hover:bg-[#e05340] transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
