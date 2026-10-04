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
  HelpCircle,
  Mountain,
  Navigation,
  Wind,
  Waves,
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
    title: 'উন্নতি কোণ ও অবনতি কোণ ল্যাব',
    subtitle: 'Angle of Elevation & Angle of Depression Simulator',
    nctbPage: 'পৃষ্ঠা ২০৩-২০৬',
    badge: 'ল্যাব ০১',
    intro:
      'ভূতলের সমান্তরাল ভূরেখার ওপরের কোনো বিন্দু পর্যবেক্ষকের চোখে যে কোণ উৎপন্ন করে তা হলো উন্নতি কোণ (Angle of Elevation)। ভূরেখার নিচের কোনো বিন্দুর জন্য উৎপন্ন কোণ হলো অবনতি কোণ (Angle of Depression)। একান্তর কোণের নীতি অনুসারে শীর্ষের অবনতি কোণ সর্বদা ভূমির উন্নতি কোণের সমান।',
  },
  {
    id: 2,
    title: 'টাওয়ারের উচ্চতা ও ৩০°-৪৫°-৬০° জ্যামিতিক চিত্র ল্যাব',
    subtitle: 'Tower Height & Angle Drawing Rules (30°, 45°, 60°)',
    nctbPage: 'পৃষ্ঠা ২০৭-২১০',
    badge: 'ল্যাব ০২',
    intro:
      'এনসিটিবি খাতা মূল্যায়নে চিত্রে কোণের আনুপাতিক যথার্থতা বাধ্যতামূলক! ৩০° কোণে ভূমি > লম্ব, ৪৫° কোণে ভূমি = লম্ব, এবং ৬০° কোণে লম্ব > ভূমি আঁকতে হবে। পাদদেশ থেকে দূরত্ব d জানা থাকলে h = d tan θ সূত্রে উচ্চতা নির্ণয় করা যায়।',
  },
  {
    id: 3,
    title: 'নদীর বিস্তার নির্ণয় ও দুই বিন্দুর পর্যবেক্ষণ ল্যাব',
    subtitle: 'River Width & Two-Point Observation (Moving Backward d meters)',
    nctbPage: 'পৃষ্ঠা ২১১-২১৫',
    badge: 'ল্যাব ০৩',
    intro:
      'নদী পার না হয়ে এক তীরে দাঁড়িয়ে অপর তীরের টাওয়ারের উন্নতি কোণ পরিমাপ করা হয়। এরপর d মিটার পিছিয়ে গেলে উন্নতি কোণ হ্রাস পায়। এই দুই পর্যবেক্ষণ কোণ ও দূরত্বের সমীকরণ সমাধান করে নদীর বিস্তার (x) ও টাওয়ারের উচ্চতা (h) নির্ভুলভাবে বের করা যায়।',
  },
  {
    id: 4,
    title: 'ঝড়ে গাছ বা খুঁটি ভাঙার সমস্যা ল্যাব',
    subtitle: 'Broken Tree / Pole Simulator (h = H sin θ / (1 + sin θ))',
    nctbPage: 'পৃষ্ঠা ২১৬-২২০',
    badge: 'ল্যাব ০৪',
    intro:
      'বোর্ড পরীক্ষার সবচেয়ে জনপ্রিয় ৪ নম্বরের সৃজনশীল প্রশ্ন! সম্পূর্ণ গাছ H এমন উচ্চতায় (h) ভাঙল যে অবিচ্ছিন্ন ভাঙা অংশ (H - h) ভূমির সাথে θ কোণ তৈরি করে। sin θ = লম্ব/অতিভুজ = h / (H - h) সমীকরণ থেকেই কত উচ্চতায় ভেঙেছিল তা চোখের পলকে নির্ণয় করা যায়।',
  },
  {
    id: 5,
    title: 'বেলুন ও বিপরীত পাশের দুই বস্তু ল্যাব',
    subtitle: 'Dual Object Depression / Balloon Altitude Simulator',
    nctbPage: 'পৃষ্ঠা ২২১-২২৫',
    badge: 'ল্যাব ০৫',
    intro:
      'উড়ন্ত বেলুন বা টাওয়ারের শীর্ষ থেকে বিপরীত পাশের দুটি গাড়ি বা কিলোমিটার পোস্টের অবনতি কোণ পরিমাপ করে বস্তুদ্বয়ের মধ্যবর্তী মোট দূরত্ব D = h(cot α + cot β) নির্ণয় করা যায়। একান্তর কোণ ব্যবহার করে শীর্ষের কোণকে ভূমিতলে স্থানান্তর করাই এই ল্যাবের মূল চাবিকাঠি।',
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
    boardSource: 'ঢাকা বোর্ড — ঝড়ে গাছ ভাঙার সৃজনশীল সমস্যা',
    stem: '৪৮ মিটার দীর্ঘ একটি গাছ ঝড়ে এমনভাবে ভাঙল যে তার অবিচ্ছিন্ন ভাঙা অংশ দণ্ডায়মান অংশের সাথে ৩০° কোণ করে এবং গোড়া থেকে নির্দিষ্ট দূরত্বে মাটি স্পর্শ করল।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'উদ্দীপকের তথ্যের আলোকে সংক্ষিপ্ত বিবরণসহ আনুপাতিক চিত্র আঁক।',
        solution: [
          'ধরি, সম্পূর্ণ গাছের উচ্চতা AB = 48 মিটার।',
          'গাছটি C বিন্দুতে h উচ্চতায় ভেঙে গিয়ে শীর্ষ A বিন্দু ভূমির D বিন্দু স্পর্শ করল।',
          'সুতরাং দণ্ডায়মান অংশ BC = h মিটার এবং ভাঙা অংশ CD = (48 - h) মিটার।',
          'দণ্ডায়মান অংশের সাথে কোণ ∠BCD = 30°।',
          'যেহেতু ∠B = 90°, সুতরাং ভূমির সাথে উন্নতি কোণ ∠BDC = 90° - 30° = 60°।',
        ],
        rubric: 'সঠিক চিত্র অঙ্কনে ১ নম্বর, সংক্ষিপ্ত বিবরণে ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'গাছটি কত উচ্চতায় ভেঙেছিল তা নির্ণয় কর।',
        solution: [
          'সমকোণী ত্রিভুজ △BCD-এ ∠B = 90° এবং ∠BCD = 30°।',
          'কোণ ∠BCD-এর সাপেক্ষে সন্নিহিত বাহু BC = h এবং অতিভুজ CD = 48 - h।',
          'cos 30° = সন্নিহিত বাহু / অতিভুজ = BC / CD',
          '⇒ √3 / 2 = h / (48 - h)',
          'বজ্রগুণন করে পাই: 2h = √3(48 - h) = 48√3 - √3 h',
          '⇒ 2h + √3 h = 48√3',
          '⇒ h(2 + √3) = 48√3',
          '⇒ h = (48 × 1.73205) / (2 + 1.73205) = 83.138 / 3.73205 ≈ 22.28 মিটার।',
          'অতএব, গাছটি মাটি থেকে প্রায় ২২.২৮ মিটার উচ্চতায় ভেঙেছিল।',
        ],
        rubric: 'ত্রিকোণমিতিক অনুপাত চিহ্নিতকরণে ১ নম্বর, সমীকরণ গঠনে ১ নম্বর, পক্ষান্তরে ১ নম্বর, সঠিক উত্তরে ১ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'গাছটির শীর্ষ গোড়া থেকে কত দূরত্বে মাটি স্পর্শ করেছিল নির্ণয় কর।',
        solution: [
          'সমকোণী ত্রিভুজ △BCD-এ গোড়া থেকে স্পর্শ বিন্দুর দূরত্ব হলো BD।',
          'tan 30° = বিপরীত বাহু / সন্নিহিত বাহু = BD / BC',
          '⇒ 1 / √3 = BD / h',
          '⇒ BD = h / √3 = 22.28 / 1.73205 ≈ 12.86 মিটার।',
          '(অথবা পিথাগোরাসের সূত্রে: BD = √(CD² - BC²) = √((48 - 22.28)² - (22.28)²) = √(25.72² - 22.28²) = √(661.52 - 496.40) = √165.12 ≈ 12.85 মিটার)।',
          'অতএব, শীর্ষ গোড়া থেকে ১২.৮৬ মিটার দূরে মাটি স্পর্শ করেছিল।',
        ],
        rubric: 'অনুপাত প্রয়োগে ১ নম্বর, সমীকরণ সমাধানে ২ নম্বর, এককসহ উত্তরে ১ নম্বর।',
      },
    ],
    examinerSecret:
      'শিক্ষার্থীরা প্রায়ই ভুল করে উদ্দীপকের কোণটিকে ভূমির কোণ ধরে হিসাব করে। প্রশ্নে সুস্পষ্ট বলা আছে "দণ্ডায়মান অংশের সাথে ৩০° কোণ", তাই শীর্ষকোণ ∠BCD = ৩০° ধরতে হবে!',
  },
  {
    id: 2,
    boardSource: 'রাজশাহী বোর্ড — নদীর বিস্তার ও দুই বিন্দুর পর্যবেক্ষণ',
    stem: 'নদীর এক তীরে দাঁড়িয়ে এক ব্যক্তি দেখল যে অপর তীরে অবস্থিত একটি মিনারের শীর্ষের উন্নতি কোণ ৬০°। ঐ বিন্দু থেকে ৬০ মিটার পিছিয়ে গেলে মিনারের উন্নতি কোণ ৩০° হয়।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'উন্নতি কোণ ও অবনতি কোণের পার্থক্য সংজ্ঞা আকারে লেখ।',
        solution: [
          'উন্নতি কোণ: ভূরেখার সমান্তরাল রেখার ওপরের কোনো বিন্দু দর্শকের চোখে যে কোণ উৎপন্ন করে তাকে উন্নতি কোণ বলে।',
          'অবনতি কোণ: ভূরেখার সমান্তরাল রেখার নিচের কোনো বিন্দু দর্শকের চোখে যে কোণ উৎপন্ন করে তাকে অবনতি কোণ বলে।',
          'উভয় কোণই সর্বদা ভূরেখা বা অনুভূমিক রেখার সাপেক্ষে পরিমাপ করা হয়।',
        ],
        rubric: 'উন্নতি কোণের সংজ্ঞায় ১ নম্বর, অবনতি কোণের সংজ্ঞায় ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'নদীর বিস্তার নির্ণয় কর।',
        solution: [
          'ধরি, মিনারের উচ্চতা PQ = h মিটার এবং নদীর বিস্তার QR = x মিটার।',
          'R বিন্দুতে উন্নতি কোণ ∠PRQ = 60°।',
          'R থেকে 60 মিটার পিছিয়ে S বিন্দুতে উন্নতি কোণ ∠PSQ = 30°। সুতরাং QS = (x + 60) মিটার।',
          'সমকোণী △PQR-এ: tan 60° = PQ / QR ⇒ √3 = h / x ⇒ h = x√3  ... (১)',
          'সমকোণী △PQS-এ: tan 30° = PQ / QS ⇒ 1/√3 = h / (x + 60)',
          'সমীকরণ (১) থেকে h = x√3 বসিয়ে পাই:',
          '1/√3 = (x√3) / (x + 60) ⇒ x + 60 = 3x',
          '⇒ 2x = 60 ⇒ x = 30 মিটার।',
          'অতএব, নদীর বিস্তার ৩০ মিটার।',
        ],
        rubric: 'প্রথম সমীকরণে ১ নম্বর, দ্বিতীয় সমীকরণে ১ নম্বর, x এর মানে ২ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'মিনারটির উচ্চতা নির্ণয় কর।',
        solution: [
          'সমীকরণ (১) থেকে পাই: h = x√3',
          'x = 30 মিটার বসিয়ে পাই:',
          'h = 30 × √3 = 30 × 1.73205 = 51.9615 মিটার।',
          'অতএব, মিনারটির উচ্চতা প্রায় ৫১.৯৬ মিটার।',
        ],
        rubric: 'সূত্র প্রয়োগে ১ নম্বর, ক্যালকুলেশনে ২ নম্বর, সঠিক একক ও আসন্ন মানে ১ নম্বর।',
      },
    ],
    examinerSecret:
      'উভয় ত্রিভুজে সাধারণ বাহু হলো উচ্চতা h। তাই প্রথমে h কে x এর মাধ্যমে প্রকাশ করে দ্বিতীয় সমীকরণে প্রতিস্থাপন করলে এক লাইনে নদীর বিস্তার x বের হয়ে আসে।',
  },
  {
    id: 3,
    boardSource: 'চট্টগ্রাম বোর্ড — টাওয়ারের শীর্ষ থেকে বিপরীত পাশের দুই গাড়ি',
    stem: '১৫০ মিটার উঁচু একটি পাহাড়ের চূড়া থেকে একই সরলরেখায় অবস্থিত দুটি গাড়ির অবনতি কোণ যথাক্রমে ৪৫° ও ৩০°।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'যদি গাড়ি দুটি পাহাড়ের একই পাশে থাকে, তবে কোন গাড়ির কোণটি বড় হবে এবং কেন?',
        solution: [
          'পাহাড়ের কাছের গাড়ির অবনতি কোণটি বড় (৪৫°) হবে।',
          'কারণ দর্শকের অবস্থান থেকে কোনো বস্তু যত নিকটে থাকে, দৃষ্টিরেখাকে ভূরেখা থেকে তত বেশি নিচে বাঁকাতে হয়, ফলে কোণ বৃদ্ধি পায়।',
        ],
        rubric: 'সঠিক গাড়ি শনাক্তকরণে ১ নম্বর, যৌক্তিক কারণ দর্শানোয় ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'গাড়ি দুটি পাহাড়ের বিপরীত পাশে অবস্থিত হলে তাদের মধ্যবর্তী দূরত্ব নির্ণয় কর।',
        solution: [
          'ধরি, পাহাড়ের উচ্চতা AB = 150 মিটার। শীর্ষ A থেকে অনুভূমিক রেখা XY টানি।',
          'এক পাশের গাড়ি C-এর অবনতি কোণ ∠XAC = 45° ⇒ একান্তর উন্নতি কোণ ∠ACB = 45°।',
          'বিপরীত পাশের গাড়ি D-এর অবনতি কোণ ∠YAD = 30° ⇒ একান্তর উন্নতি কোণ ∠ADB = 30°।',
          '△ABC-এ: tan 45° = AB / BC ⇒ 1 = 150 / BC ⇒ BC = 150 মিটার।',
          '△ABD-এ: tan 30° = AB / BD ⇒ 1/√3 = 150 / BD ⇒ BD = 150√3 ≈ 259.81 মিটার।',
          'গাড়ি দুটির মধ্যবর্তী দূরত্ব CD = BC + BD = 150 + 259.81 = 409.81 মিটার।',
        ],
        rubric: 'একান্তর কোণ ব্যাখায় ১ নম্বর, BC নির্ণয়ে ১ নম্বর, BD নির্ণয়ে ১ নম্বর, মোট দূরত্বে ১ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'যদি গাড়ি দুটি পাহাড়ের একই পাশে থাকত, তবে তাদের মধ্যবর্তী দূরত্ব কত হতো?',
        solution: [
          'একই পাশে থাকলে কাছের গাড়ি C এবং দূরের গাড়ি D।',
          'পাহাড়ের পাদদেশ থেকে C এর দূরত্ব BC = 150 মিটার।',
          'পাহাড়ের পাদদেশ থেকে D এর দূরত্ব BD = 150√3 ≈ 259.81 মিটার।',
          'গাড়ি দুটির পারস্পরিক দূরত্ব CD = BD - BC = 259.81 - 150 = 109.81 মিটার।',
          'অতএব, গাড়ি দুটি একই পাশে থাকলে মধ্যবর্তী দূরত্ব হতো প্রায় ১০৯.৮১ মিটার।',
        ],
        rubric: 'একই পাশের চিত্র ধারণায় ১ নম্বর, দূরত্বের বিয়োগফলে ২ নম্বর, সঠিক উত্তরে ১ নম্বর।',
      },
    ],
    examinerSecret:
      'বিপরীত পাশে থাকলে দূরত্বদ্বয় যোগ (BC + BD) হয়, আর একই পাশে থাকলে দূরত্বদ্বয় বিয়োগ (BD - BC) হয় — এই পার্থক্যটি বোর্ড পরীক্ষায় প্রায়ই আসে!',
  },
];

interface QuizMCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_MCQS: QuizMCQ[] = [
  {
    id: 1,
    question: 'ভূরেখার সমান্তরাল রেখার নিচের কোনো বিন্দুর জন্য উৎপন্ন কোণকে কী বলে?',
    options: ['উন্নতি কোণ', 'অবনতি কোণ', 'বিপ্রতীপ কোণ', 'পূরক কোণ'],
    correctAnswer: 1,
    explanation:
      'অনুভূমিক রেখার নিচে অবস্থিত কোনো বিন্দুর দৃষ্টিরেখা ভূরেখার সাথে যে কোণ উৎপন্ন করে তাকে অবনতি কোণ (Angle of Depression) বলে।',
  },
  {
    id: 2,
    question: 'এনসিটিবি নির্দেশিকা অনুসারে, ৩০° কোণ অঙ্কনের ক্ষেত্রে নিচের কোনটি সঠিক?',
    options: ['ভূমি < লম্ব', 'ভূমি = লম্ব', 'ভূমি > লম্ব', 'অতিভুজ < লম্ব'],
    correctAnswer: 2,
    explanation:
      'যেহেতু tan 30° = 1/√3 ≈ 0.577 < 1, তাই লম্ব / ভূমি < 1 ⇒ ভূমি > লম্ব। ৩০° কোণে চিত্র আঁকার সময় ভূমি সর্বদা লম্বের চেয়ে বড় হতে হবে।',
  },
  {
    id: 3,
    question: 'একটি মিনারের উচ্চতা ২০ মিটার এবং সূর্যের উন্নতি কোণ ৪৫° হলে মিনারের ছায়ার দৈর্ঘ্য কত?',
    options: ['১০ মিটার', '২০ মিটার', '২০√৩ মিটার', '২০/√৩ মিটার'],
    correctAnswer: 1,
    explanation:
      'tan 45° = উচ্চতা / ছায়ার দৈর্ঘ্য ⇒ 1 = 20 / ছায়ার দৈর্ঘ্য ⇒ ছায়ার দৈর্ঘ্য = 20 মিটার। ৪৫° কোণে উচ্চতা ও ছায়ার দৈর্ঘ্য সর্বদা সমান হয়।',
  },
  {
    id: 4,
    question: 'একটি খুঁটির উচ্চতা h এবং ছায়ার দৈর্ঘ্য √৩h হলে সূর্যের উন্নতি কোণ কত?',
    options: ['৩০°', '৪৫°', '৬০°', '৯০°'],
    correctAnswer: 0,
    explanation:
      'tan θ = লম্ব / ভূমি = h / (√3 h) = 1/√3। আমরা জানি tan 30° = 1/√3, সুতরাং সূর্যের উন্নতি কোণ θ = 30°।',
  },
  {
    id: 5,
    question:
      'নদীর তীরে ৬০° কোণে দাঁড়িয়ে থাকা ব্যক্তি ৩০ মিটার পিছিয়ে গেলে উন্নতি কোণ ৩০° হয়। নদীর বিস্তার কত?',
    options: ['১৫ মিটার', '৩০ মিটার', '৪৫ মিটার', '৬০ মিটার'],
    correctAnswer: 0,
    explanation:
      '৬০° থেকে ৩০° পিছিয়ে গেলে শর্টকাট সূত্র: নদীর বিস্তার x = d / 2 = 30 / 2 = 15 মিটার। কারণ x = (d tan 30°) / (tan 60° - tan 30°) = (30 × 1/√3) / (√3 - 1/√3) = 30 / (3 - 1) = 15 মিটার।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathDistanceElevationGuidebook() {
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLab, setActiveLab] = useState<number>(1);

  // Lab 1: Elevation vs Depression
  const [lab1Angle, setLab1Angle] = useState<number>(35);
  const [lab1Mode, setLab1Mode] = useState<'elevation' | 'depression'>('elevation');

  // Lab 2: Tower Height & 30-45-60 Geometry Rules
  const [lab2Dist, setLab2Dist] = useState<number>(30); // 10 to 60 meters
  const [lab2Angle, setLab2Angle] = useState<30 | 45 | 60>(30);
  const lab2Rad = (lab2Angle * Math.PI) / 180;
  const lab2Height = lab2Dist * Math.tan(lab2Rad);
  const lab2Hyp = Math.sqrt(lab2Dist * lab2Dist + lab2Height * lab2Height);

  // Lab 3: River Width & Two Observation Points
  const [lab3BackDist, setLab3BackDist] = useState<number>(40); // 20 to 80 meters
  const [lab3Angles, setLab3Angles] = useState<{ theta1: number; theta2: number }>({ theta1: 60, theta2: 30 });
  const rad1 = (lab3Angles.theta1 * Math.PI) / 180;
  const rad2 = (lab3Angles.theta2 * Math.PI) / 180;
  const tan1 = Math.tan(rad1);
  const tan2 = Math.tan(rad2);
  // x = d*tan2 / (tan1 - tan2)
  const lab3Width = (lab3BackDist * tan2) / (tan1 - tan2);
  const lab3Height = lab3Width * tan1;

  // Lab 4: Broken Tree Simulator
  const [treeTotalH, setTreeTotalH] = useState<number>(48); // total height H
  const [treeAngle, setTreeAngle] = useState<30 | 45 | 60>(30);
  const treeRad = (treeAngle * Math.PI) / 180;
  const sinTree = Math.sin(treeRad);
  // h = H * sin / (1 + sin)
  const brokenTrunkH = (treeTotalH * sinTree) / (1 + sinTree);
  const brokenBranchL = treeTotalH - brokenTrunkH;
  const touchDist = brokenBranchL * Math.cos(treeRad);

  // Lab 5: Dual Vehicle / Balloon Simulator
  const [balloonH, setBalloonH] = useState<number>(120); // meters
  const [balloonAngle1, setBalloonAngle1] = useState<number>(45);
  const [balloonAngle2, setBalloonAngle2] = useState<number>(30);
  const radB1 = (balloonAngle1 * Math.PI) / 180;
  const radB2 = (balloonAngle2 * Math.PI) / 180;
  const distSide1 = balloonH / Math.tan(radB1);
  const distSide2 = balloonH / Math.tan(radB2);
  const totalOppositeDist = distSide1 + distSide2;
  const totalSameSideDist = Math.abs(distSide2 - distSide1);

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
      text: 'স্বাগতম! আমি শেরু — তোমার গণিত দূরত্ব ও উচ্চতা গাইড। উন্নতি কোণ, অবনতি কোণ, নদীর বিস্তার নির্ণয়, ৩০°-৪৫°-৬০° জ্যামিতিক চিত্র বা ঝড়ে গাছ ভাঙার অঙ্ক নিয়ে যে কোনো প্রশ্ন থাকলে নির্ভয়ে জিজ্ঞেস করো!',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Validations
  const validateCh1 = () => {
    // Challenge 1: Tower dist = 20m, angle = 30° => h = 20 * tan 30° = 20 / √3 ≈ 11.55 or 11.54
    const val = parseFloat(ch1Input.trim());
    if (Math.abs(val - 11.55) < 0.2 || ch1Input.trim() === '20/√3' || ch1Input.trim() === '11.54') {
      setCh1Status('correct');
    } else {
      setCh1Status('wrong');
    }
  };

  const validateCh2 = () => {
    // Challenge 2: Total H = 48m, theta = 30° => trunk h = 48 * 0.5 / (1 + 0.5) = 24 / 1.5 = 16m
    const val = parseFloat(ch2Input.trim());
    if (val === 16) {
      setCh2Status('correct');
    } else {
      setCh2Status('wrong');
    }
  };

  const validateCh3 = () => {
    // Challenge 3: Tower h = 30m, angle = 45° => river width = 30m
    const val = parseFloat(ch3Input.trim());
    if (val === 30) {
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
      if (userText.includes('গাছ ভাঙা') || userText.includes('গাছ') || userText.includes('খুঁটি')) {
        reply +=
          'ঝড়ে গাছ ভাঙার অঙ্কে মূল সূত্র হলো: sin θ = লম্ব / অতিভুজ = h / (H - h)। যেখানে H হলো সম্পূর্ণ উচ্চতা এবং h হলো কত উচ্চতায় ভেঙেছিল। বজ্রগুণন করলে h = H sin θ / (1 + sin θ) দিয়ে এক লাইনেই উত্তর পাওয়া যায়!';
      } else if (userText.includes('উন্নতি') || userText.includes('অবনতি')) {
        reply +=
          'উন্নতি কোণ হলো ভূরেখা থেকে উপরের বস্তুর কোণ, আর অবনতি কোণ হলো ভূরেখা থেকে নিচের বস্তুর কোণ। জ্যামিতিকভাবে ভূরেখা দুটি সমান্তরাল হওয়ায় শীর্ষের অবনতি কোণ সর্বদা ভূমির উন্নতি কোণের সমান (একান্তর কোণ)!';
      } else if (userText.includes('নদী') || userText.includes('নদীর বিস্তার') || userText.includes('পিছিয়ে')) {
        reply +=
          'নদীর বিস্তার নির্ণয়ে শীর্ষ উচ্চতা h অপরিবর্তিত থাকে। tan θ₁ = h/x এবং tan θ₂ = h/(x + d)। এই দুই সমীকরণ থেকে x = (d tan θ₂) / (tan θ₁ - tan θ₂) সূত্রে নদীর বিস্তার বের হয়। যদি কোণ ৬০° ও ৩০° হয়, তবে নদীর বিস্তার সর্বদা পিছিয়ে যাওয়া দূরত্বের অর্ধেক (x = d/2)!';
      } else if (userText.includes('চিত্র') || userText.includes('কোণ') || userText.includes('নিয়ম')) {
        reply +=
          'বোর্ড পরীক্ষার খাতায় চিত্র আঁকার ৩টি সোনালী নিয়ম মনে রাখবে: ৩০° কোণে ভূমি লম্বের চেয়ে বড় হবে, ৪৫° কোণে ভূমি ও লম্ব সমান হবে, আর ৬০° কোণে লম্ব ভূমির চেয়ে বড় হবে। এই অনুপাত ঠিক না থাকলে পরীক্ষক নম্বর কেটে দিতে পারেন!';
      } else {
        reply +=
          'দূরত্ব ও উচ্চতার সমস্যায় সমকোণী ত্রিভুজ শনাক্ত করাই মূল কাজ। লম্ব ও ভূমির সম্পর্ক থাকলে tan θ এবং লম্ব ও অতিভুজের সম্পর্ক থাকলে sin θ ব্যবহার করবে!';
      }
      setChatMessages((prev) => [...prev, { sender: 'sheru', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* --------------------------------------------------------------------- */}
      {/* HEADER / HERO SECTION                                                 */}
      {/* --------------------------------------------------------------------- */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/playground/v2"
              className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="প্লেগ্রাউন্ড লাইব্রেরিতে ফিরুন"
            >
              <Mountain className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B57]/10 text-primary border border-[#FF6B57]/20">
                  সাধারণ গণিত • অধ্যায় ১০
                </span>
                <span className="text-xs text-muted-foreground font-mono">NCTB নবম-দশম</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2 mt-0.5">
                <span>দূরত্ব ও উচ্চতা</span>
                <span className="text-sm font-normal text-muted-foreground hidden sm:inline">
                  — উন্নতি ও অবনতি কোণ, টাওয়ার, নদীর বিস্তার ও গাছ ভাঙার ল্যাব
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs (5 Steps) */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/70 rounded-2xl border border-border overflow-x-auto">
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
      </header>

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
                    ? 'bg-primary/5 border-[#FF6B57] text-foreground shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                      activeLab === lab.id ? 'bg-[#FF6B57] text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {lab.badge}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{lab.nctbPage}</span>
                </div>
                <div className="text-xs font-bold line-clamp-2 mt-1">{lab.title}</div>
              </button>
            ))}
          </div>

          {/* Active Lab Intro Banner */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <h2 className="text-xs sm:text-sm font-bold text-foreground">
                {LAB_LESSONS[activeLab - 1].subtitle}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {LAB_LESSONS[activeLab - 1].intro}
              </p>
            </div>
          </div>

          {/* LAB 1: ELEVATION VS DEPRESSION */}
          {activeLab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dynamic Ray-Tracing Canvas */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span>উন্নতি ও অবনতি কোণ দৃষ্টিরেখা সিমুলেটর</span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">
                    কোণ θ = {lab1Angle}°
                  </span>
                </div>

                <div className="relative w-full max-w-[340px] aspect-4/3 flex items-center justify-center bg-muted/20 rounded-2xl border border-border/60 overflow-hidden">
                  <svg viewBox="0 0 320 220" className="w-full h-full">
                    {/* Sky Background */}
                    <rect x="0" y="0" width="320" height="220" fill="transparent" />

                    {/* Ground line */}
                    <line x1="20" y1="180" x2="300" y2="180" stroke="#94a3b8" strokeWidth="2" />
                    <text x="290" y="195" fontSize="10" fill="#94a3b8" textAnchor="end">ভূরেখা (ভূমি)</text>

                    {/* Observer Point O */}
                    <circle cx="60" cy="180" r="5" fill="#FF6B57" />
                    <text x="50" y="200" fontSize="11" fontWeight="bold" fill="#FF6B57">O (দর্শক)</text>

                    {/* Horizontal Reference Line from eye level */}
                    <line x1="60" y1="180" x2="260" y2="180" stroke="#FF6B57" strokeDasharray="4 4" strokeWidth="1.5" />

                    {lab1Mode === 'elevation' ? (
                      <>
                        {/* Target Point P (High) */}
                        {(() => {
                          const rad = (lab1Angle * Math.PI) / 180;
                          const len = 170;
                          const px = 60 + len * Math.cos(rad);
                          const py = 180 - len * Math.sin(rad);
                          return (
                            <>
                              {/* Sight Ray */}
                              <line x1="60" y1="180" x2={px} y2={py} stroke="#3b82f6" strokeWidth="2.5" />
                              <circle cx={px} cy={py} r="5" fill="#3b82f6" />
                              <text x={px + 8} y={py + 5} fontSize="11" fontWeight="bold" fill="#3b82f6">P (উচ্চ বিন্দু)</text>

                              {/* Perpendicular down */}
                              <line x1={px} y1={py} x2={px} y2="180" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                              <text x={px + 6} y={(py + 180) / 2} fontSize="10" fill="#10b981">লম্ব h</text>

                              {/* Angle arc */}
                              <path
                                d={`M 100 180 A 40 40 0 0 0 ${60 + 40 * Math.cos(rad)} ${180 - 40 * Math.sin(rad)}`}
                                fill="none"
                                stroke="#FF6B57"
                                strokeWidth="2"
                              />
                              <text x="110" y="172" fontSize="11" fontWeight="bold" fill="#FF6B57">
                                {lab1Angle}°
                              </text>
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <>
                        {/* Depression Scenario: Observer at top of tower at (60, 60), looking down to Q on ground */}
                        {(() => {
                          const rad = (lab1Angle * Math.PI) / 180;
                          const eyeX = 60;
                          const eyeY = 60;
                          const dist = (180 - eyeY) / Math.tan(rad);
                          const targetX = Math.min(280, eyeX + dist);

                          return (
                            <>
                              {/* Tower */}
                              <rect x="50" y="60" width="20" height="120" fill="#cbd5e1" opacity="0.6" />
                              <line x1="60" y1="60" x2="60" y2="180" stroke="#64748b" strokeWidth="2" />
                              <text x="35" y="125" fontSize="10" fill="#64748b">টাওয়ার</text>

                              {/* Observer at top */}
                              <circle cx={eyeX} cy={eyeY} r="5" fill="#FF6B57" />
                              <text x="35" y="55" fontSize="11" fontWeight="bold" fill="#FF6B57">শীর্ষ (O)</text>

                              {/* Horizontal sight line at top */}
                              <line x1={eyeX} y1={eyeY} x2={eyeX + 160} y2={eyeY} stroke="#FF6B57" strokeDasharray="4 4" strokeWidth="1.5" />
                              <text x={eyeX + 165} y={eyeY + 4} fontSize="9" fill="#FF6B57">দৃষ্টিরেখা</text>

                              {/* Sight Ray to Q */}
                              <line x1={eyeX} y1={eyeY} x2={targetX} y2="180" stroke="#ef4444" strokeWidth="2.5" />
                              <circle cx={targetX} cy="180" r="5" fill="#ef4444" />
                              <text x={targetX - 5} y="198" fontSize="11" fontWeight="bold" fill="#ef4444">Q (ভূমি বস্তু)</text>

                              {/* Alternate angle at ground */}
                              <path
                                d={`M ${targetX - 35} 180 A 35 35 0 0 1 ${targetX - 35 * Math.cos(rad)} ${180 - 35 * Math.sin(rad)}`}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                              />
                              <text x={targetX - 55} y="172" fontSize="10" fontWeight="bold" fill="#10b981">
                                {lab1Angle}° (একান্তর)
                              </text>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </svg>
                </div>

                {/* Angle Slider */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">কোণ পরিবর্তন করুন:</span>
                    <span className="font-bold text-primary">{lab1Angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    step="5"
                    value={lab1Angle}
                    onChange={(e) => setLab1Angle(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Mode Toggles & Conceptual Rules */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium block">
                    সিমুলেশন মোড নির্বাচন করুন:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLab1Mode('elevation')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        lab1Mode === 'elevation'
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      উন্নতি কোণ (Elevation)
                    </button>
                    <button
                      onClick={() => setLab1Mode('depression')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        lab1Mode === 'depression'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      অবনতি কোণ (Depression)
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                    <div className="font-bold text-foreground">
                      {lab1Mode === 'elevation' ? 'উন্নতি কোণের নীতি:' : 'অবনতি কোণের নীতি:'}
                    </div>
                    {lab1Mode === 'elevation' ? (
                      <p className="text-muted-foreground leading-relaxed">
                        দর্শক ভূমিতে দাঁড়িয়ে উপরের দিকে তাকালে ভূরেখা ও দৃষ্টিরেখার অন্তর্বর্তী কোণটি উন্নতি কোণ। উচ্চতা বাড়লে বা কাছে এলে কোণ বৃদ্ধি পায়।
                      </p>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        শীর্ষে অবস্থানরত দর্শকের অনুভূমিক দৃষ্টিরেখা ও নিচের বস্তুর দৃষ্টিরেখার মধ্যবর্তী কোণ হলো অবনতি কোণ। জ্যামিতিক একান্তর কোণের নিয়মে এটি সর্বদা ভূমির উন্নতি কোণের সমান হয়!
                      </p>
                    )}
                  </div>
                </div>

                {/* Alternate Angle Core Rule */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>একান্তর কোণ উপপাদ্য (Z-pattern)</span>
                  </div>
                  <p className="leading-relaxed">
                    শীর্ষের অনুভূমিক রেখা এবং ভূমিতল পরস্পর সমান্তরাল। দৃষ্টিরেখা তাদের ছেদক হওয়ায়:
                    <strong className="text-foreground block mt-1">
                      শীর্ষে অবনতি কোণ = ভূমিতে উন্নতি কোণ
                    </strong>
                    অবনতি কোণের যেকোনো সমস্যাকে ভূমির সমকোণী ত্রিভুজে এনে সহজেই সমাধান করা যায়।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAB 2: TOWER HEIGHT & 30-45-60 GEOMETRY RULES */}
          {activeLab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Geometric Visualizer */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Mountain className="h-4 w-4 text-primary" />
                    <span>টাওয়ারের উচ্চতা পরিমাপক সিমুলেটর</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    h = {lab2Height.toFixed(2)} মিটার
                  </span>
                </div>

                {/* SVG of Right Triangle */}
                <div className="relative w-full max-w-[340px] aspect-4/3 flex items-center justify-center bg-muted/20 rounded-2xl border border-border/60 overflow-hidden">
                  <svg viewBox="0 0 320 220" className="w-full h-full">
                    {/* Ground line */}
                    <line x1="20" y1="180" x2="300" y2="180" stroke="#94a3b8" strokeWidth="2" />

                    {(() => {
                      const baseScale = 2.8;
                      const bx = 240; // Tower base
                      const by = 180;
                      const ax = bx - lab2Dist * baseScale; // Observer
                      const ay = 180;
                      const py = by - Math.min(130, lab2Height * baseScale); // Tower top

                      return (
                        <>
                          {/* Tower (Perpendicular) */}
                          <line x1={bx} y1={by} x2={bx} y2={py} stroke="#FF6B57" strokeWidth="4" />
                          <circle cx={bx} cy={py} r="4" fill="#FF6B57" />
                          <text x={bx + 8} y={(by + py) / 2} fontSize="11" fontWeight="bold" fill="#FF6B57">
                            h = {lab2Height.toFixed(1)}m
                          </text>

                          {/* Base (Distance) */}
                          <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#3b82f6" strokeWidth="3" />
                          <text x={(ax + bx) / 2} y="198" fontSize="11" fontWeight="bold" fill="#3b82f6" textAnchor="middle">
                            d = {lab2Dist}m
                          </text>

                          {/* Hypotenuse (Sight Line) */}
                          <line x1={ax} y1={ay} x2={bx} y2={py} stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />

                          {/* Right angle marker at B */}
                          <path d={`M ${bx - 12} 180 L ${bx - 12} 168 L ${bx} 168`} fill="none" stroke="#64748b" strokeWidth="1.5" />

                          {/* Angle theta marker at A */}
                          <circle cx={ax} cy={ay} r="4" fill="#3b82f6" />
                          <text x={ax - 5} y="198" fontSize="10" fill="#3b82f6">A</text>
                          <text x={ax + 20} y="174" fontSize="11" fontWeight="bold" fill="#FF6B57">
                            {lab2Angle}°
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Slider for Distance */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">পাদদেশ থেকে দূরত্ব (d):</span>
                    <span className="font-bold text-primary">{lab2Dist} মিটার</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="5"
                    value={lab2Dist}
                    onChange={(e) => setLab2Dist(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Angle Selector & NCTB Geometry Mandates */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium block">
                    উন্নতি কোণ নির্বাচন করুন:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 45, 60].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setLab2Angle(deg as 30 | 45 | 60)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          lab2Angle === deg
                            ? 'bg-[#FF6B57] text-white shadow-xs'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {deg}° কোণ
                      </button>
                    ))}
                  </div>

                  {/* Calculations card */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">উচ্চতা h = d tan {lab2Angle}°:</span>
                      <span className="font-bold text-primary">{lab2Height.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">দৃষ্টিরেখা (অতিভুজ):</span>
                      <span className="font-bold text-emerald-600">{lab2Hyp.toFixed(2)} m</span>
                    </div>
                  </div>
                </div>

                {/* NCTB Drawing Rules Card */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-3 text-xs">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>এনসিটিবি চিত্র অঙ্কনের ৩টি আবশ্যিক নিয়ম</span>
                  </div>
                  <div className="space-y-2 text-muted-foreground leading-relaxed">
                    <div className={`p-2 rounded-xl border ${lab2Angle === 30 ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold' : 'border-border'}`}>
                      • ৩০° কোণ: <strong>ভূমি &gt; লম্ব</strong> (কারণ tan 30° = 1/√3 &lt; 1)
                    </div>
                    <div className={`p-2 rounded-xl border ${lab2Angle === 45 ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold' : 'border-border'}`}>
                      • ৪৫° কোণ: <strong>ভূমি = লম্ব</strong> (কারণ tan 45° = 1)
                    </div>
                    <div className={`p-2 rounded-xl border ${lab2Angle === 60 ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold' : 'border-border'}`}>
                      • ৬০° কোণ: <strong>লম্ব &gt; ভূমি</strong> (কারণ tan 60° = √3 &gt; 1)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 3: RIVER WIDTH & TWO OBSERVATION POINTS */}
          {activeLab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dynamic River Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Waves className="h-4 w-4 text-blue-500" />
                    <span>নদীর বিস্তার ও দুই বিন্দুর দ্বৈত কোণ ল্যাব</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    বিস্তার x = {lab3Width.toFixed(1)}m
                  </span>
                </div>

                <div className="relative w-full max-w-[340px] aspect-4/3 flex items-center justify-center bg-muted/20 rounded-2xl border border-border/60 overflow-hidden">
                  <svg viewBox="0 0 340 220" className="w-full h-full">
                    {/* Water section representing river width x */}
                    <rect x="170" y="165" width="90" height="25" fill="#38bdf8" opacity="0.3" rx="4" />
                    <text x="215" y="180" fontSize="10" fill="#0284c7" textAnchor="middle">নদী (x)</text>

                    {/* Ground line */}
                    <line x1="20" y1="180" x2="320" y2="180" stroke="#94a3b8" strokeWidth="2" />

                    {/* Tower at right river bank */}
                    <line x1="260" y1="180" x2="260" y2="60" stroke="#FF6B57" strokeWidth="4" />
                    <circle cx="260" cy="60" r="4" fill="#FF6B57" />
                    <text x="265" y="115" fontSize="10" fontWeight="bold" fill="#FF6B57">h = {lab3Height.toFixed(1)}m</text>

                    {/* Point A (near river bank) */}
                    <line x1="170" y1="180" x2="260" y2="60" stroke="#10b981" strokeWidth="2" />
                    <circle cx="170" cy="180" r="4" fill="#10b981" />
                    <text x="170" y="196" fontSize="10" fontWeight="bold" fill="#10b981" textAnchor="middle">A ({lab3Angles.theta1}°)</text>

                    {/* Point B (backward by d) */}
                    <line x1="80" y1="180" x2="260" y2="60" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="80" cy="180" r="4" fill="#6366f1" />
                    <text x="80" y="196" fontSize="10" fontWeight="bold" fill="#6366f1" textAnchor="middle">B ({lab3Angles.theta2}°)</text>

                    {/* Distance d label between B and A */}
                    <path d="M 80 165 L 170 165" stroke="#6366f1" strokeWidth="1.5" />
                    <text x="125" y="160" fontSize="10" fontWeight="bold" fill="#6366f1" textAnchor="middle">
                      d = {lab3BackDist}m
                    </text>
                  </svg>
                </div>

                {/* Slider for Backward Distance d */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">পিছিয়ে যাওয়া দূরত্ব (d):</span>
                    <span className="font-bold text-primary">{lab3BackDist} মিটার</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="10"
                    value={lab3BackDist}
                    onChange={(e) => setLab3BackDist(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Angle Pair Presets & Mathematical Formulation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium block">
                    কোণদ্বয় নির্বাচন করুন (θ₁ → θ₂):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLab3Angles({ theta1: 60, theta2: 30 })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        lab3Angles.theta1 === 60 && lab3Angles.theta2 === 30
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      ৬০° → ৩০° (বোর্ড ক্লাসিক)
                    </button>
                    <button
                      onClick={() => setLab3Angles({ theta1: 60, theta2: 45 })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        lab3Angles.theta1 === 60 && lab3Angles.theta2 === 45
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      ৬০° → ৪৫°
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">নদীর বিস্তার (x):</span>
                      <span className="font-bold text-emerald-600">{lab3Width.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">টাওয়ারের উচ্চতা (h):</span>
                      <span className="font-bold text-primary">{lab3Height.toFixed(2)} m</span>
                    </div>
                  </div>
                </div>

                {/* Shortcut Secret for 60 -> 30 */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                    <Sparkles className="h-4 w-4" />
                    <span>৬০° → ৩০° জাদুকরী শর্টকাট কৌশল</span>
                  </div>
                  <p className="leading-relaxed">
                    যখন কোণ ৬০° থেকে কমে ৩০° হয়, তখন নদীর বিস্তার সর্বদা পিছিয়ে যাওয়া দূরত্বের ঠিক অর্ধেক হয়:
                    <strong className="text-foreground block mt-1">
                      x = d / 2 = {lab3BackDist} / 2 = {(lab3BackDist / 2).toFixed(1)} মিটার!
                    </strong>
                    এটি এমসিকিউ এবং সিকিউ সমাধান পরীক্ষার জন্য সবচেয়ে কার্যকর বোর্ড হ্যাক।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAB 4: BROKEN TREE / POLE SIMULATOR */}
          {activeLab === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dynamic Broken Tree SVG */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Wind className="h-4 w-4 text-emerald-500" />
                    <span>ঝড়ে গাছ ভাঙার বাস্তব সিমুলেটর</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    ভাঙার উচ্চতা h = {brokenTrunkH.toFixed(2)}m
                  </span>
                </div>

                <div className="relative w-full max-w-[340px] aspect-4/3 flex items-center justify-center bg-muted/20 rounded-2xl border border-border/60 overflow-hidden">
                  <svg viewBox="0 0 320 220" className="w-full h-full">
                    {/* Ground line */}
                    <line x1="20" y1="180" x2="300" y2="180" stroke="#94a3b8" strokeWidth="2" />

                    {(() => {
                      const scale = 2.4;
                      const bx = 220; // Base of tree
                      const by = 180;
                      const cy = by - brokenTrunkH * scale; // Break point C
                      const dx = bx - touchDist * scale; // Ground touch point D
                      const dy = 180;

                      return (
                        <>
                          {/* Standing Trunk (BC = h) */}
                          <line x1={bx} y1={by} x2={bx} y2={cy} stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
                          <circle cx={bx} cy={cy} r="4" fill="#15803d" />
                          <text x={bx + 8} y={(by + cy) / 2} fontSize="11" fontWeight="bold" fill="#15803d">
                            h = {brokenTrunkH.toFixed(1)}m
                          </text>

                          {/* Broken Slanted Branch (CD = H - h) */}
                          <line x1={bx} y1={cy} x2={dx} y2={dy} stroke="#84cc16" strokeWidth="5" strokeLinecap="round" />
                          <circle cx={dx} cy={dy} r="4" fill="#84cc16" />
                          <text x={(bx + dx) / 2 - 20} y={(cy + dy) / 2 - 5} fontSize="10" fontWeight="bold" fill="#65a30d">
                            {brokenBranchL.toFixed(1)}m
                          </text>

                          {/* Ground touch distance (BD = d) */}
                          <line x1={dx} y1={dy} x2={bx} y2={by} stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
                          <text x={(bx + dx) / 2} y="198" fontSize="10" fontWeight="bold" fill="#3b82f6" textAnchor="middle">
                            d = {touchDist.toFixed(1)}m
                          </text>

                          {/* Angle theta arc at D */}
                          <text x={dx + 25} y="174" fontSize="11" fontWeight="bold" fill="#FF6B57">
                            {treeAngle}°
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Slider for Total Height H */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">সম্পূর্ণ গাছের উচ্চতা (H):</span>
                    <span className="font-bold text-primary">{treeTotalH} মিটার</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="72"
                    step="6"
                    value={treeTotalH}
                    onChange={(e) => setTreeTotalH(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Angle Controls & Mathematical Formulation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium block">
                    ভূমির সাথে কোণ (θ) নির্বাচন করুন:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 45, 60].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setTreeAngle(deg as 30 | 45 | 60)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          treeAngle === deg
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {deg}° কোণ
                      </button>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">দণ্ডায়মান অংশ (h):</span>
                      <span className="font-bold text-emerald-600">{brokenTrunkH.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ভাঙা অংশ (H - h):</span>
                      <span className="font-bold text-primary">{brokenBranchL.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">গোড়া থেকে দূরত্ব (d):</span>
                      <span className="font-bold text-blue-600">{touchDist.toFixed(2)} m</span>
                    </div>
                  </div>
                </div>

                {/* Theoretical Derivation */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>সাইনের অনুপাত থেকে সরাসরি সূত্র</span>
                  </div>
                  <p className="leading-relaxed">
                    সমকোণী ত্রিভুজে <RenderMathText text="$\sin \theta = \frac{\text{দণ্ডায়মান অংশ}}{\text{ভাঙা অংশ}} = \frac{h}{H - h}$" />।
                    <br />
                    বজ্রগুণন করলে পাই: <RenderMathText text="$h = \frac{H \sin \theta}{1 + \sin \theta}$" />।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAB 5: DUAL VEHICLE / BALLOON SIMULATOR */}
          {activeLab === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Dual Ray SVG */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span>উড়ন্ত বেলুন / টাওয়ার থেকে দুই বস্তুর অবনতি কোণ</span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">
                    উচ্চতা h = {balloonH}m
                  </span>
                </div>

                <div className="relative w-full max-w-[340px] aspect-4/3 flex items-center justify-center bg-muted/20 rounded-2xl border border-border/60 overflow-hidden">
                  <svg viewBox="0 0 340 220" className="w-full h-full">
                    {/* Ground line */}
                    <line x1="10" y1="180" x2="330" y2="180" stroke="#94a3b8" strokeWidth="2" />

                    {/* Balloon at center top */}
                    <circle cx="170" cy="50" r="14" fill="#FF6B57" opacity="0.9" />
                    <line x1="170" y1="50" x2="170" y2="180" stroke="#FF6B57" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="175" y="115" fontSize="10" fill="#FF6B57">{balloonH}m</text>

                    {/* Horizontal sight line at balloon level */}
                    <line x1="60" y1="50" x2="280" y2="50" stroke="#64748b" strokeDasharray="4 4" strokeWidth="1.5" />

                    {/* Left vehicle C */}
                    <line x1="170" y1="50" x2="60" y2="180" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="60" cy="180" r="4" fill="#3b82f6" />
                    <text x="60" y="196" fontSize="10" fontWeight="bold" fill="#3b82f6" textAnchor="middle">গাড়ি ১ ({balloonAngle1}°)</text>

                    {/* Right vehicle D */}
                    <line x1="170" y1="50" x2="290" y2="180" stroke="#10b981" strokeWidth="2" />
                    <circle cx="290" cy="180" r="4" fill="#10b981" />
                    <text x="290" y="196" fontSize="10" fontWeight="bold" fill="#10b981" textAnchor="middle">গাড়ি ২ ({balloonAngle2}°)</text>

                    {/* Total distance label */}
                    <path d="M 60 165 L 290 165" stroke="#8b5cf6" strokeWidth="1.5" />
                    <text x="175" y="160" fontSize="10" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">
                      দূরত্ব = {totalOppositeDist.toFixed(1)}m
                    </text>
                  </svg>
                </div>

                {/* Slider for Altitude h */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">বেলুনের উচ্চতা (h):</span>
                    <span className="font-bold text-primary">{balloonH} মিটার</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    step="20"
                    value={balloonH}
                    onChange={(e) => setBalloonH(parseInt(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>

              {/* Case 1 vs Case 2 Comparison Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-3">
                  <span className="text-xs text-muted-foreground font-medium block">
                    দুই বস্তুর আপেক্ষিক অবস্থান তুলনা:
                  </span>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <span className="text-muted-foreground font-sans">বিপরীত পাশে দূরত্ব:</span>
                      <span className="font-bold text-primary">{totalOppositeDist.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground font-sans">একই পাশে দূরত্ব:</span>
                      <span className="font-bold text-blue-600">{totalSameSideDist.toFixed(2)} m</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-3xl border border-border p-5 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>বোর্ড সতর্কবাণী: একই পাশ বনাম বিপরীত পাশ</span>
                  </div>
                  <p className="leading-relaxed">
                    উদ্দীপকে "বিপরীত পাশে" বলা থাকলে দুটি দূরত্ব যোগ হবে (<RenderMathText text="$D = d_1 + d_2$" />), আর "একই পাশে" বলা থাকলে বড় দূরত্ব থেকে ছোট দূরত্ব বিয়োগ হবে (<RenderMathText text="$D = |d_2 - d_1|$" />)!
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
                ঢাকা, রাজশাহী ও চট্টগ্রাম বোর্ডের সর্বাধিক কমন ৩টি দূরত্ব ও উচ্চতা সৃজনশীল প্রশ্ন। প্রতিটি প্রশ্নের ক, খ ও গ অংশের পূর্ণ সমাধান এবং পরীক্ষকের গোপন মার্কিং রুব্রিক্স দেওয়া হলো।
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
                দূরত্ব ও উচ্চতার বাস্তব সমস্যা সমাধান করুন। সঠিক উত্তর ইনপুট দিয়ে তাৎক্ষণিক গ্রিন টিক অর্জন করুন।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* CHALLENGE 1 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                  চ্যালেঞ্জ ০১: মিনারের উচ্চতা
                </span>
                {ch1Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                একটি মিনারের পাদদেশ থেকে ২০ মিটার দূরে ভূমিতলের কোনো বিন্দুতে চূড়ার উন্নতি কোণ ৩০° হলে মিনারের উচ্চতা কত মিটার? (আসন্ন মান ১১.৫৫ লিখুন)
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="যেমন: 11.55"
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
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। h = 20 × tan 30° = 20 / √3 ≈ 11.55 মিটার।
                </div>
              )}
            </div>

            {/* CHALLENGE 2 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  চ্যালেঞ্জ ০২: ঝড়ে গাছ ভাঙার সমস্যা
                </span>
                {ch2Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                ৪৮ মিটার লম্বা একটি গাছ ভেঙে ভূমির সাথে ৩০° কোণ উৎপন্ন করলে গাছটি মাটি থেকে কত উচ্চতায় ভেঙেছিল?
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="মিটার মান লিখুন (যেমন: 16)"
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
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। sin 30° = h / (48 - h) ⇒ 0.5 = h / (48 - h) ⇒ 1.5h = 24 ⇒ h = 16 মিটার।
                </div>
              )}
            </div>

            {/* CHALLENGE 3 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  চ্যালেঞ্জ ০৩: নদীর বিস্তার ও ৪৫° কোণ
                </span>
                {ch3Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                নদীর তীরে দাঁড়িয়ে থাকা ৩০ মিটার উঁচু একটি টাওয়ারের শীর্ষের উন্নতি কোণ ৪৫° হলে নদীর বিস্তার কত মিটার?
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="মিটার মান লিখুন (যেমন: 30)"
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
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। tan 45° = 1 = 30 / x ⇒ x = 30 মিটার।
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
                দূরত্ব ও উচ্চতা অধ্যায় কুইজ ও আত্মযাচাই
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
                অধ্যায় ১০: দূরত্ব ও উচ্চতা রিভিশন চিট-শীট
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                পরীক্ষার আগের রাতের জন্য এনসিটিবি দূরত্ব ও উচ্চতা অধ্যায়ের সমস্ত মৌলিক সূত্র ও নিয়মাবলীর চূড়ান্ত সারসংক্ষেপ।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-primary/10 text-primary">
                উন্নতি ও অবনতি কোণ
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\text{শীর্ষের অবনতি কোণ} = \text{ভূমির উন্নতি কোণ (একান্তর কোণ)}$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ভূরেখা ও শীর্ষের দৃষ্টিরেখা সমান্তরাল হওয়ায় অবনতি কোণকে ভূমির কোণে স্থানান্তর করে সমকোণী ত্রিভুজে হিসাব করতে হয়।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/10 text-blue-600">
                এনসিটিবি চিত্র অঙ্কন নিয়ম
              </span>
              <div className="text-xs font-bold text-foreground">
                ৩০°: ভূমি &gt; লম্ব | ৪৫°: ভূমি = লম্ব | ৬০°: লম্ব &gt; ভূমি
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                বোর্ড পরীক্ষায় চিত্র না আঁকলে বা ভুল অনুপাতে আঁকলে ৩ থেকে ৪ নম্বর কাটা যায়।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-600">
                ঝড়ে গাছ ভাঙার সূত্র
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\sin \theta = \frac{h}{H - h} \implies h = \frac{H \sin \theta}{1 + \sin \theta}$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                H = সম্পূর্ণ উচ্চতা, h = দণ্ডায়মান অংশ, H - h = ভাঙা অংশ (অতিভুজ)।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/10 text-purple-600">
                নদীর বিস্তার ও দুই কোণ
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$x = \frac{d \tan \theta_2}{\tan \theta_1 - \tan \theta_2} \quad (\theta_1 = 60^\circ, \theta_2 = 30^\circ \implies x = \frac{d}{2})$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                d মিটার পিছিয়ে গেলে নদীর বিস্তার x এবং উচ্চতা h = x tan θ₁।
              </p>
            </div>
          </div>

          {/* Copyable Study Notes Box */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Copy className="h-4 w-4 text-primary" />
                <span>এক নজরে দূরত্ব ও উচ্চতা অধ্যায়ের রিভিশন নোটস (কপি করুন)</span>
              </span>
              <button
                onClick={() => {
                  const text = `দূরত্ব ও উচ্চতা অধ্যায় ১০ এনসিটিবি রিভিশন নোটস:
১. ভূতলের সমান্তরাল রেখা = অনুভূমিক রেখা/ভূরেখা।
২. ভূরেখার ওপরের বিন্দুর জন্য উন্নতি কোণ, নিচের বিন্দুর জন্য অবনতি কোণ।
৩. শীর্ষের অবনতি কোণ = ভূমির উন্নতি কোণ (একান্তর কোণ)।
৪. চিত্র অঙ্কন নিয়ম:
   • ৩০° কোণে: ভূমি > লম্ব
   • ৪৫° কোণে: ভূমি = লম্ব
   • ৬০° কোণে: লম্ব > ভূমি
৫. সাধারণ সূত্র: h = d tan θ
৬. গাছ ভাঙার সমস্যা: sin θ = h / (H - h) ⇒ h = (H sin θ) / (1 + sin θ)
৭. নদীর বিস্তার (d মিটার পিছিয়ে গেলে):
   x = (d tan θ₂) / (tan θ₁ - tan θ₂)
   যদি θ₁ = ৬০° এবং θ₂ = ৩০° হয়, তবে বিস্তার x = d / ২।
৮. বিপরীত পাশের দুই বস্তু: দূরত্ব = h cot α + h cot β
৯. একই পাশের দুই বস্তু: দূরত্ব = h |cot α - cot β|`;
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
{`১. উন্নতি কোণ ও অবনতি কোণ:
   • অনুভূমিক রেখার উপরের বিন্দু = উন্নতি কোণ
   • অনুভূমিক রেখার নিচের বিন্দু = অবনতি কোণ (ভূমির উন্নতি কোণের সমান)
২. চিত্র অঙ্কন আবশ্যিক শর্ত:
   • θ = ৩০° হলে ভূমি > লম্ব
   • θ = ৪৫° হলে ভূমি = লম্ব
   • θ = ৬০° হলে লম্ব > ভূমি
৩. ঝড়ে গাছ ভাঙার সমীকরণ:
   • sin θ = h / (H - h) ⇒ h = (H sin θ) / (1 + sin θ)
৪. নদীর বিস্তার সমীকরণ:
   • x = (d tan θ₂) / (tan θ₁ - tan θ₂)
   • ৬০° → ৩০° হলে x = d / ২ (সর্বদা অর্ধেক)`}
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
                  <h3 className="text-xs font-bold text-foreground">শেরু AI দূরত্ব ও উচ্চতা গাইড</h3>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>সক্রিয় • ত্রিকোণমিতিক জ্যামিতি বিশেষজ্ঞ</span>
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
                onClick={() => setInputMessage('গাছ ভাঙার সমস্যা কীভাবে সমাধান করব?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                গাছ ভাঙার সমস্যা?
              </button>
              <button
                onClick={() => setInputMessage('নদীর বিস্তার নির্ণয়ের শর্টকাট কী?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                নদীর বিস্তার শর্টকাট?
              </button>
              <button
                onClick={() => setInputMessage('৩০° ও ৬০° কোণের চিত্র আঁকার নিয়ম কী?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                চিত্র আঁকার নিয়ম?
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-border flex items-center gap-2 bg-card">
              <input
                type="text"
                placeholder="দূরত্ব ও উচ্চতা সম্পর্কিত প্রশ্ন লিখুন..."
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
