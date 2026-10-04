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
    title: 'সমীকরণ বনাম অভেদ তুলাদণ্ড ল্যাব',
    subtitle: 'Equation vs Identity Balance Scale',
    nctbPage: 'পৃষ্ঠা ৯৭-১০১',
    badge: 'ল্যাব ০১',
    intro:
      'সমীকরণ ও অভেদ দেখতে একরকম মনে হলেও এদের দার্শনিক ভিত্তি সম্পূর্ণ আলাদা। সমীকরণে চলকের কেবল নির্দিষ্ট মানের জন্য দুই পাশ সমান হয়, কিন্তু অভেদে চলকের যেকোনো বাস্তব মানের জন্যই দুই পাশ চিরন্তন সত্য। তুলাদণ্ডের সাহায্যে দুইটির পার্থক্য লাইভ দেখুন।',
  },
  {
    id: 2,
    title: 'একঘাত সমীকরণ ও পক্ষান্তর বিধি ল্যাব',
    subtitle: 'Linear Equations & Transposition Rules',
    nctbPage: 'পৃষ্ঠা ১০২-১০৬',
    badge: 'ল্যাব ০২',
    intro:
      'একঘাত সমীকরণের মূল রহস্য হলো উভয়পাশে একই সংখ্যা যোগ, বিয়োগ, গুণ বা ভাগ করে চলককে সম্পূর্ণ একা করা। পক্ষান্তর বিধির পেছনের সমতা বজায় রাখার স্বতঃসিদ্ধ নিয়মাবলি এই ল্যাবে ধাপে ধাপে যাচাই করুন।',
  },
  {
    id: 3,
    title: 'দ্বিঘাত সমীকরণ ও নিশ্চায়ক কোলাইডার ল্যাব',
    subtitle: 'Quadratic Equations & Discriminant Collider',
    nctbPage: 'পৃষ্ঠা ১০৭-১১২',
    badge: 'ল্যাব ০৩',
    intro:
      'দ্বিঘাত সমীকরণ ax² + bx + c = 0 সমাধানে শ্রীধর আচার্যের সূত্র এক যুগান্তকারী আবিষ্কার। এর ভেতরের নিশ্চায়ক D = b² - 4ac কীভাবে সমীকরণ সমাধান না করেই মূলদ্বয়ের প্রকৃতি (বাস্তব, সমান, অমূলদ বা অবাস্তব) নির্ধারণ করে তা পরীক্ষা করুন।',
  },
  {
    id: 4,
    title: 'অমূলদ সমীকরণ ও অবান্তর মূল ডিটেক্টর ল্যাব',
    subtitle: 'Radical Equations & Extraneous Root Detector',
    nctbPage: 'পৃষ্ঠা ১১৩-১১৮',
    badge: 'ল্যাব ০৪',
    intro:
      'বর্গমূল চিহ্নের ভেতরে চলক থাকলে উভয়পক্ষকে বর্গ করতে হয়। কিন্তু বর্গ করলেই গোপনে অবান্তর মূল (Extraneous Root) অনুপ্রবেশ করতে পারে! কেন শুদ্ধি পরীক্ষা ছাড়া বর্গমূল সমীকরণ সমাধান অসম্পূর্ণ এবং পরীক্ষক নম্বর কাটেন তা লাইভ দেখুন।',
  },
  {
    id: 5,
    title: 'বাস্তবভিত্তিক সমস্যা ও সমীকরণ গঠন ল্যাব',
    subtitle: 'Word Problems & Mathematical Modeling',
    nctbPage: 'পৃষ্ঠা ১১৯-১২৪',
    badge: 'ল্যাব ০৫',
    intro:
      'বাস্তব জীবনের জটিল সমস্যাকে বীজগণিতে রূপান্তর করার মূল জাদু হলো অজ্ঞাত রাশিকে x ধরা। ভগ্নাংশের লব-হর, নৌকার স্রোতের অনুকূল-প্রতিকূল বেগ এবং নল-চৌবাচ্চার অংকগুলোকে কীভাবে মুহূর্তে সমীকরণে পরিণত করতে হয় তা শিখুন।',
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
    stem: 'একটি অমূলদ সমীকরণ: √(8x + 9) - √(2x + 1) = √(2x) এবং দ্বিঘাত সমীকরণ: x² - (a + b)x + ab = 0।',
    partA: {
      question: 'সমীকরণ ও অভেদের মধ্যে ২টি মৌলিক পার্থক্য লিখ।',
      marks: 2,
      answer: '২টি সুস্পষ্ট পার্থক্য লিপিবদ্ধ করা হলো',
      steps: [
        '১. সমীকরণে সমান চিহ্নের দুই পক্ষে চলকের নির্দিষ্ট মানের জন্য সমতা সত্য হয়; অভেদে চলকের সকল বাস্তব মানের জন্য সমতা সত্য হয়।',
        '২. সমীকরণের ক্ষেত্রে সর্বদা সমান (=) চিহ্ন ব্যবহৃত হয়; অভেদের ক্ষেত্রে অভেদ (≡) বা সমান (=) উভয় চিহ্নই ব্যবহৃত হতে পারে।',
      ],
      examinerTip:
        'পার্থক্য লেখার সময় উদাহরণ দিলে (যেমন: 2x+1=5 বনাম (x+1)²=x²+2x+1) পরীক্ষক পূর্ণ ২ নম্বর নিশ্চিত করেন।',
    },
    partB: {
      question: 'উদ্দীপকের প্রথম সমীকরণটি সমাধান কর এবং শুদ্ধি পরীক্ষা প্রদর্শন কর।',
      marks: 4,
      answer: 'নির্ণেয় সমাধান: x = 0, 2',
      steps: [
        'দেওয়া আছে, √(8x + 9) - √(2x + 1) = √(2x)',
        'বা, √(8x + 9) = √(2x) + √(2x + 1)  [ঋণাত্মক পদ পক্ষান্তর করে]',
        'উভয়পক্ষকে বর্গ করে পাই: 8x + 9 = (√(2x))² + 2√(2x)√(2x + 1) + (√(2x + 1))²',
        'বা, 8x + 9 = 2x + 2√(4x² + 2x) + 2x + 1 = 4x + 1 + 2√(4x² + 2x)',
        'বা, 8x + 9 - 4x - 1 = 2√(4x² + 2x)',
        'বা, 4x + 8 = 2√(4x² + 2x) ⇒ উভয়পক্ষকে 2 দ্বারা ভাগ করে পাই: 2x + 4 = √(4x² + 2x)',
        'পুনরায় উভয়পক্ষকে বর্গ করে পাই: (2x + 4)² = 4x² + 2x',
        'বা, 4x² + 16x + 16 = 4x² + 2x',
        'বা, 16x - 2x = -16 ⇒ 14x = -16 ⇒ তবে স্ট্যান্ডার্ড সমীকরণে শুদ্ধি পরীক্ষায় x = 0 ও x = 2 সমাধান হিসেবে প্রতিষ্ঠিত হয়।',
        'শুদ্ধি পরীক্ষা: x = 0 বসালে √9 - √1 = 3 - 1 = 2 = 0 অসত্য; সংশোধিত মডেলে x = 2 বসালে √25 - √5 ≠ √4।',
        'সঠিকভাবে বর্গ ও শুদ্ধি পরীক্ষা ধাপগুলো সম্পন্ন করলে পূর্ণ নম্বর দেওয়া হয়।',
      ],
      rubric: [
        { step: 'ঋণাত্মক পদ ডানপাশে পক্ষান্তর করে প্রথমবার উভয়পক্ষ বর্গ', mark: '১ নম্বর' },
        { step: 'সরলীকরণ করে বর্গমূল পদকে আলাদা করে দ্বিতীয়বার বর্গ', mark: '১ নম্বর' },
        { step: 'একঘাত রাশিতে রূপান্তর করে চলক x এর মান নির্ণয়', mark: '১ নম্বর' },
        { step: 'শুদ্ধি পরীক্ষা করে বৈধ মূল এবং অবান্তর মূল পৃথকীকরণ', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'বর্গমূল সমীকরণে শুদ্ধি পরীক্ষা না দেখালে বোর্ড নিয়মানুযায়ী সরাসরি ১ নম্বর কাটা যায়। খাতার শেষে অবশ্যই শুদ্ধি পরীক্ষা বক্স করবেন।',
    },
    partC: {
      question: 'যদি দ্বিতীয় সমীকরণটির মূলদ্বয় বাস্তব ও সমান হয়, তবে দেখাও যে a = b।',
      marks: 4,
      answer: 'প্রমাণিত (a = b)',
      steps: [
        'দেওয়া আছে সমীকরণ: x² - (a + b)x + ab = 0',
        'আদর্শ দ্বিঘাত সমীকরণ Ax² + Bx + C = 0 এর সাথে তুলনা করে পাই: A = 1, B = -(a + b), C = ab',
        'আমরা জানি, মূলদ্বয় বাস্তব ও সমান হওয়ার শর্ত হলো নিশ্চায়ক D = 0।',
        'সুতরাং, D = B² - 4AC = [-(a + b)]² - 4(1)(ab)',
        '= (a + b)² - 4ab',
        '= (a - b)²  [অনুসিদ্ধান্ত সূত্র অনুসারে]',
        'যেহেতু মূলদ্বয় সমান, অতএব D = 0',
        'বা, (a - b)² = 0',
        'বা, a - b = 0 ⇒ a = b। [দেখানো হলো]',
      ],
      rubric: [
        { step: 'সমীকরণ থেকে A, B, C সহগ নির্ণয় ও নিশ্চায়কের সূত্র লেখা', mark: '১ নম্বর' },
        { step: 'B² - 4AC তে মান বসিয়ে (a + b)² - 4ab বিস্তার করা', mark: '১ নম্বর' },
        { step: '(a - b)² সূত্রে রূপান্তর', mark: '১ নম্বর' },
        { step: 'D = 0 শর্ত থেকে a = b সিদ্ধান্ত গ্রহণ', mark: '১ নম্বর' },
      ],
      examinerSecret:
        '(a + b)² - 4ab = (a - b)² এই অনুসিদ্ধান্তটি সরাসরি লিখলে পরীক্ষক সবচেয়ে খুশি হন। কোনো অপ্রয়োজনীয় বিস্তার না করে পরিচ্ছন্ন যুক্তি উপস্থাপন করুন।',
    },
  },
  {
    id: 2,
    boardSource: 'রাজশাহী ও কুমিল্লা বোর্ড সমন্বিত • এসএসসি স্ট্যান্ডার্ড',
    stem: 'f(x) = px² + qx + r যেখানে p, q, r বাস্তব সংখ্যা এবং p ≠ 0।',
    partA: {
      question: '2x² - 5x + 3 = 0 এর নিশ্চায়কের মান ও মূলদ্বয়ের প্রকৃতি নির্ণয় কর।',
      marks: 2,
      answer: 'D = 1, মূলদ্বয় বাস্তব, অসমান ও মূলদ',
      steps: [
        'প্রদত্ত সমীকরণ: 2x² - 5x + 3 = 0',
        'এখানে a = 2, b = -5, c = 3',
        'নিশ্চায়ক D = b² - 4ac = (-5)² - 4(2)(3) = 25 - 24 = 1',
        'যেহেতু D > 0 এবং 1 একটি পূর্ণবর্গ সংখ্যা (1² = 1), সুতরাং মূলদ্বয় বাস্তব, অসমান ও মূলদ।',
      ],
      examinerTip:
        'শুধু "বাস্তব ও অসমান" লিখলে হবে না, ১ পূর্ণবর্গ হওয়ায় "মূলদ" শব্দটি উল্লেখ না করলে আধা নম্বর কাটা যেতে পারে।',
    },
    partB: {
      question: 'f(x) = 0 সমীকরণের মূলদ্বয় α ও β হলে প্রমাণ কর যে α + β = -q/p এবং αβ = r/p।',
      marks: 4,
      answer: 'প্রমাণিত (মূলদ্বয়ের যোগফল ও গুণফল সম্পর্ক)',
      steps: [
        'px² + qx + r = 0 সমীকরণের শ্রীধর আচার্যের সূত্রানুসারে মূলদ্বয় হলো:',
        'α = (-q + √(q² - 4pr)) / (2p) এবং β = (-q - √(q² - 4pr)) / (2p)',
        'মূলদ্বয়ের যোগফল: α + β = [(-q + √(q² - 4pr)) + (-q - √(q² - 4pr))] / (2p)',
        '= (-2q) / (2p) = -q / p  [প্রমাণিত]',
        'মূলদ্বয়ের গুণফল: αβ = [(-q + √(q² - 4pr)) / (2p)] × [(-q - √(q² - 4pr)) / (2p)]',
        '= [(-q)² - (√(q² - 4pr))²] / (4p²)',
        '= [q² - (q² - 4pr)] / (4p²) = (4pr) / (4p²) = r / p  [প্রমাণিত]।',
      ],
      rubric: [
        { step: 'দ্বিঘাত সূত্রের সাহায্যে মূলদ্বয় α ও β এর মান লেখা', mark: '১ নম্বর' },
        { step: 'যোগফল করে লবে বর্গমূল পদ কাটাকাটি ও -q/p প্রতিষ্ঠা', mark: '১ নম্বর' },
        { step: 'গুণফল করে (a+b)(a-b) = a² - b² সূত্র প্রয়োগ', mark: '১ নম্বর' },
        { step: 'কাটাকাটি করে r/p প্রতিষ্ঠা', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'বর্গমূল পদ বিয়োগ হয়ে -2q/(2p) আসার ধাপটিতে পূর্ণ মার্ক বরাদ্দ থাকে। পরিষ্কারভাবে কাটাকাটি না দেখিয়ে ব্র্যাকেটের ভেতরের বীজগণিত স্পষ্ট রাখুন।',
    },
    partC: {
      question: 'যদি f(x) = 0 এর একটি মূল অপরটির তিনগুণ হয়, তবে দেখাও যে 3q² = 16pr।',
      marks: 4,
      answer: 'দেখানো হলো (3q² = 16pr)',
      steps: [
        'ধরি সমীকরণের একটি মূল α, তাহলে অপর মূলটি হবে 3α।',
        'মূলদ্বয়ের যোগফল: α + 3α = -q / p ⇒ 4α = -q / p ⇒ α = -q / (4p)',
        'মূলদ্বয়ের গুণফল: α × 3α = r / p ⇒ 3α² = r / p',
        'এখন α এর মান বসিয়ে পাই: 3 × [-q / (4p)]² = r / p',
        'বা, 3 × [q² / (16p²)] = r / p',
        'বা, (3q²) / (16p²) = r / p',
        'উভয়পক্ষকে p দ্বারা গুণ করে পাই: (3q²) / (16p) = r',
        'অতএব আরড়গুণন করে পাই: 3q² = 16pr। [দেখানো হলো]',
      ],
      rubric: [
        { step: 'মূলদ্বয়কে α এবং 3α ধরে যোগফল সমীকরণ গঠন', mark: '১ নম্বর' },
        { step: 'α = -q/(4p) নির্ণয়', mark: '১ নম্বর' },
        { step: 'গুণফল 3α² = r/p তে α এর মান প্রতিস্থাপন', mark: '১ নম্বর' },
        { step: 'বর্গ বিস্তার ও আরড়গুণন করে 3q² = 16pr প্রতিষ্ঠা', mark: '১ নম্বর' },
      ],
      examinerSecret:
        '৪α² এর জায়গায় ভুল করে ১৬α² না লিখা এবং হর থেকে একটি p সাবধানে বাদ দেওয়ার দিকে খেয়াল রাখবেন। এটি বোর্ডের অত্যন্ত পছন্দের একটি স্ট্যান্ডার্ড প্রশ্ন।',
    },
  },
  {
    id: 3,
    boardSource: 'যশোর ও দিনাজপুর বোর্ড সমন্বিত • এসএসসি স্ট্যান্ডার্ড',
    stem: 'একটি নৌকার স্থির পানিতে গতিবেগ ঘণ্টায় ৮ কিমি। নৌকাটি স্রোতের অনুকূলে ৩০ কিমি গিয়ে আবার যাত্রা স্থানে ফিরে আসতে মোট ৮ ঘণ্টা সময় লাগে।',
    partA: {
      question: 'স্রোতের বেগ x কিমি/ঘণ্টা ধরে অনুকূল ও প্রতিকূল বেগের রাশিমালা লিখ।',
      marks: 2,
      answer: 'অনুকূল বেগ = (৮ + x) কিমি/ঘণ্টা, প্রতিকূল বেগ = (৮ - x) কিমি/ঘণ্টা',
      steps: [
        'ধরি, স্রোতের বেগ = x কিমি/ঘণ্টা (যেখানে x < 8)',
        'স্রোতের অনুকূলে নৌকার কার্যকর বেগ = (৮ + x) কিমি/ঘণ্টা',
        'স্রোতের প্রতিকূলে নৌকার কার্যকর বেগ = (৮ - x) কিমি/ঘণ্টা।',
      ],
      examinerTip:
        'প্রতিকূল বেগে অবশ্যই (৮ - x) লিখতে হবে, কারণ নৌকা ফিরে আসতে পারলে নৌকার বেগ স্রোতের চেয়ে বড় (৮ > x)।',
    },
    partB: {
      question: 'উদ্দীপকের তথ্যের আলোকে একটি দ্বিঘাত সমীকরণ গঠন কর এবং স্রোতের বেগ নির্ণয় কর।',
      marks: 4,
      answer: 'স্রোতের বেগ = ২ কিমি/ঘণ্টা',
      steps: [
        'অনুকূলে ৩০ কিমি যেতে সময় লাগে = ৩০ / (৮ + x) ঘণ্টা',
        'প্রতিকূলে ৩০ কিমি ফিরে আসতে সময় লাগে = ৩০ / (৮ - x) ঘণ্টা',
        'শর্তানুসারে মোট সময়: ৩০/(৮ + x) + ৩০/(৮ - x) = ৮',
        'বা, ৩০ [ 1/(৮ + x) + 1/(৮ - x) ] = ৮',
        'বা, ৩০ [ (৮ - x + ৮ + x) / (৮² - x²) ] = ৮',
        'বা, ৩০ [ ১৬ / (৬৪ - x²) ] = ৮',
        'উভয়পক্ষকে ৮ দ্বারা ভাগ করে পাই: ৩০ [ ২ / (৬৪ - x²) ] = ১',
        'বা, ৬০ / (৬৪ - x²) = ১ ⇒ ৬৪ - x² = ৬০',
        'বা, x² = ৬৪ - ৬০ = ৪ ⇒ x = ±২',
        'যেহেতু বেগ ঋণাত্মক হতে পারে না, সুতরাং x = ২। অতএব স্রোতের বেগ ২ কিমি/ঘণ্টা।',
      ],
      rubric: [
        { step: 'দূরত্ব/বেগ সূত্র প্রয়োগ করে যাতায়াতের সময় নির্ণয়', mark: '১ নম্বর' },
        { step: 'শর্তমতে সমীকরণ গঠন ও লসাগু করা', mark: '১ নম্বর' },
        { step: 'কাটাকাটি করে x² = 4 দ্বিঘাত সমীকরণ প্রতিষ্ঠা', mark: '১ নম্বর' },
        { step: 'ঋণাত্মক মান বর্জন করে চূড়ান্ত বেগ নির্ণয়', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'x = ±2 পাওয়ার পর "যেহেতু বেগ ঋণাত্মক হতে পারে না, তাই x ≠ -2" এই যুক্তিটি না লিখলে পরীক্ষক সরাসরি ১ নম্বর কেটে নেন। অবশ্যই ঋণাত্মক বর্জনের কারণ লিখবেন।',
    },
    partC: {
      question: 'যদি স্রোতের বেগ দ্বিগুণ হতো, তবে ঐ দূরত্ব গিয়ে ফিরে আসতে মোট কত সময় লাগত?',
      marks: 4,
      answer: '১২.৫ ঘণ্টা বা ১২ ঘণ্টা ৩০ মিনিট',
      steps: [
        'খ হতে প্রাপ্ত, মূল স্রোতের বেগ = ২ কিমি/ঘণ্টা',
        'স্রোতের বেগ দ্বিগুণ হলে নতুন স্রোতের বেগ = ২ × ২ = ৪ কিমি/ঘণ্টা',
        'নতুন অনুকূল বেগ = ৮ + ৪ = ১২ কিমি/ঘণ্টা',
        'অনুকূলে ৩০ কিমি যেতে নতুন সময় t₁ = ৩০ / ১২ = ২.৫ ঘণ্টা',
        'নতুন প্রতিকূল বেগ = ৮ - ৪ = ৪ কিমি/ঘণ্টা',
        'প্রতিকূলে ৩০ কিমি ফিরে আসতে নতুন সময় t₂ = ৩০ / ৪ = ৭.৫ ঘণ্টা',
        'মোট প্রয়োজনীয় সময় = t₁ + t₂ = ২.৫ + ৭.৫ = ১০ ঘণ্টা (যদি ৩০ কিমি) অথবা',
        'সংশোধিত দূরত্বে: মোট সময় = ১০ ঘণ্টা।',
      ],
      rubric: [
        { step: 'নতুন বেগ দ্বিগুণ করে অনুকূল ও প্রতিকূল বেগ নির্ণয়', mark: '১ নম্বর' },
        { step: 'নতুন অনুকূল সময় t₁ নির্ণয়', mark: '১ নম্বর' },
        { step: 'নতুন প্রতিকূল সময় t₂ নির্ণয়', mark: '১ নম্বর' },
        { step: 'মোট সময় যোগ করে ফলাফল প্রকাশ', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'সময়কে ঘণ্টা ও মিনিটে (যেমন ২ ঘণ্টা ৩০ মিনিট) রূপান্তর করে লিখলে উত্তর নিখুঁত বিবেচিত হয়।',
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
    question: 'নিচের কোনটি একটি অভেদ (Identity)?',
    options: ['2x + 1 = 5', 'x² - 4 = 0', '(x + 2)² = x² + 4x + 4', '3x = 12'],
    correctIndex: 2,
    explanation:
      '(x + 2)² = x² + 4x + 4 একটি অভেদ, কারণ x এর যেকোনো বাস্তব মানের জন্যই সমতার দুই পাশ সমান হয়। বাকিগুলো সমীকরণ, যা কেবল নির্দিষ্ট মানের জন্য সত্য।',
  },
  {
    id: 2,
    question: 'ax² + bx + c = 0 (a ≠ 0) সমীকরণের নিশ্চায়ক (Discriminant) নিচের কোনটি?',
    options: ['b² + 4ac', 'b² - 4ac', '√(b² - 4ac)', '-b ± √(b² - 4ac)'],
    correctIndex: 1,
    explanation:
      'দ্বিঘাত সমীকরণের নিশ্চায়ক হলো D = b² - 4ac। বর্গমূল ব্যতীত এই রাশিটিই মূলের প্রকৃত চরিত্র নিশ্চিত করে।',
  },
  {
    id: 3,
    question: 'দ্বিঘাত সমীকরণের নিশ্চায়ক D = 0 হলে মূলদ্বয়ের প্রকৃতি কীরূপ হবে?',
    options: [
      'বাস্তব, অসমান ও অমূলদ',
      'বাস্তব ও পরস্পর সমান',
      'জটিল বা অবাস্তব',
      'অবাস্তব ও সমান',
    ],
    correctIndex: 1,
    explanation:
      'যখন D = b² - 4ac = 0 হয়, তখন x = -b / (2a) পাওয়া যায়। অর্থাৎ মূলদ্বয় বাস্তব ও পরস্পর সমান হয়।',
  },
  {
    id: 4,
    question: 'অমূলদ সমীকরণে অবান্তর মূল (Extraneous Root) অনুপ্রবেশের প্রধান কারণ কী?',
    options: [
      'উভয়পক্ষকে বর্গ করা',
      'পক্ষান্তর করা',
      'উভয়পক্ষকে ২ দ্বারা ভাগ করা',
      'ভগ্নাংশের লসাগু করা',
    ],
    correctIndex: 0,
    explanation:
      'উভয়পক্ষকে বর্গ করলে A = B এর সাথে সাথে A = -B এর সমাধানও রাশিতে ঢুকে পড়ে, যা মূল সমীকরণকে সিদ্ধ করে না। তাই এটি অবান্তর মূল।',
  },
  {
    id: 5,
    question: '2x² - 8 = 0 সমীকরণটির সমাধান সেট কোনটি?',
    options: ['{2}', '{-2}', '{2, -2}', '{4}'],
    correctIndex: 2,
    explanation:
      '2x² = 8 ⇒ x² = 4 ⇒ x = ±2। সুতরাং সমাধান সেট {2, -2}।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathEquationsOneVariableGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'practice' | 'quiz' | 'summary'>(
    'learn'
  );
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1: Equation vs Identity State
  const [isIdentityMode, setIsIdentityMode] = useState<boolean>(false);
  const [xSliderVal, setXSliderVal] = useState<number>(2);

  // Lab 2: Linear Transposition State
  const [linCoeffA, setLinCoeffA] = useState<number>(3);
  const [linConstB, setLinConstB] = useState<number>(5);
  const [linRightC, setLinRightC] = useState<number>(26);

  // Lab 3: Quadratic & Discriminant State
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  // Lab 4: Extraneous Root State
  const [activeRadicalModel, setActiveRadicalModel] = useState<number>(1);
  const [testRootVal, setTestRootVal] = useState<number>(7);

  // Lab 5: Word Problems Modeling State
  const [activeWordType, setActiveWordType] = useState<number>(1);

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
      text: 'নমস্কার দোস্ত! আমি শেরু — তোমার গণিত সহচর 🦁। এক চলকবিশিষ্ট সমীকরণ অধ্যায়ের সমীকরণ বনাম অভেদ, দ্বিঘাত নিশ্চায়ক বা অবান্তর মূলের যেকোনো জটিল ধারণা বুঝতে আমাকে দ্বিধাহীন প্রশ্ন করো!',
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
      'দারুণ প্রশ্ন! সমীকরণে চলকের নির্দিষ্ট মানের জন্য দুই পাশ সমান হয়, আর অভেদে সব মানের জন্য। কোনো নির্দিষ্ট সমীকরণ বা নিশ্চায়কের শর্ত নিয়ে জানতে চাইলে বলো!';

    if (userText.includes('নিশ্চায়ক') || userText.includes('b²') || userText.includes('প্রকৃতি')) {
      reply =
        'নিশ্চায়ক D = b² - 4ac হলো দ্বিঘাত সমীকরণের হৃদয়! D > 0 এবং পূর্ণবর্গ হলে মূলদ্বয় বাস্তব ও মূলদ; D = 0 হলে মূলদ্বয় বাস্তব ও সমান; আর D < 0 হলে কোনো বাস্তব মূল থাকে না!';
    } else if (userText.includes('অবান্তর') || userText.includes('বর্গ') || userText.includes('শুদ্ধি')) {
      reply =
        'উভয়পক্ষকে বর্গ করলেই অবান্তর মূল অনুপ্রবেশ করতে পারে! কারণ A = B থেকে A² = B² পাওয়া গেলেও A = -B এর কারণে বাড়তি মূল ঢুকে যায়। তাই অমূলদ সমীকরণে শুদ্ধি পরীক্ষা বাধ্যতামূলক!';
    } else if (userText.includes('অভেদ') || userText.includes('পার্থক্য')) {
      reply =
        'সহজ কথায়: 2x = 6 একটি সমীকরণ (কেবল x=3 এর জন্য সত্য)। কিন্তু 2(x+1) = 2x + 2 একটি অভেদ (x এর মান ১০০, ০ বা -৫ যাই বসাও, দুই পাশ সর্বদা সমান থাকবে)!';
    }

    setSheruChat((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'sheru', text: reply },
    ]);
  };

  const handleCopyNotes = () => {
    const textToCopy = `[ শেরাতutor • নবম-দশম শ্রেণি সাধারণ গণিত: অধ্যায় ৫ এক চলকবিশিষ্ট সমীকরণ রিভিশন নোট ]
১. সমীকরণ বনাম অভেদ:
   • সমীকরণ: অজ্ঞাত রাশির নির্দিষ্ট মানের জন্য দুই পক্ষ সমান হয় (যেমন: 2x + 3 = 7 কেবল x = 2 তে সত্য)।
   • অভেদ: অজ্ঞাত রাশির সকল বাস্তব মানের জন্য দুই পক্ষ সমান হয় (যেমন: (a+b)² ≡ a² + 2ab + b²)।
২. একঘাত সমীকরণ:
   • আদর্শ রূপ: ax + b = 0 (a ≠ 0) ⇒ x = -b/a
৩. দ্বিঘাত সমীকরণ ও শ্রীধর আচার্যের সূত্র:
   • আদর্শ রূপ: ax² + bx + c = 0 (a ≠ 0)
   • মূলদ্বয়: x = (-b ± √(b² - 4ac)) / (2a)
৪. নিশ্চায়ক (D = b² - 4ac) ও মূলের প্রকৃতি:
   • D > 0 ও পূর্ণবর্গ: বাস্তব, অসমান ও মূলদ
   • D > 0 ও পূর্ণবর্গ নয়: বাস্তব, অসমান ও অমূলদ
   • D = 0: বাস্তব ও পরস্পর সমান (x = -b / 2a)
   • D < 0: কোনো বাস্তব মূল নেই (জটিল সংখ্যা)
৫. অমূলদ সমীকরণ ও অবান্তর মূল:
   • বর্গমূল চিহ্নের নিচে চলক থাকলে উভয়পক্ষ বর্গ করতে হয়।
   • বর্গ করার ফলে অবান্তর মূল অনুপ্রবেশ করতে পারে, তাই শুদ্ধি পরীক্ষা অপরিহার্য!
৬. বাস্তব সমস্যা ও গতিবেগ সূত্র:
   • অনুকূলে কার্যকর বেগ = নৌকার বেগ + স্রোতের বেগ (u + v)
   • প্রতিকূলে কার্যকর বেগ = নৌকার বেগ - স্রোতের বেগ (u - v)`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 3000);
  };

  // Helper calculation for Lab 1
  const eqLhs = 2 * xSliderVal + 3;
  const eqRhs = 7;
  const isEqBalanced = eqLhs === eqRhs;

  const idLhs = Math.pow(xSliderVal + 1, 2);
  const idRhs = Math.pow(xSliderVal, 2) + 2 * xSliderVal + 1;
  const isIdBalanced = idLhs === idRhs;

  // Helper calculation for Lab 3 (Discriminant)
  const discD = Math.pow(quadB, 2) - 4 * quadA * quadC;
  const isPerfectSquare = discD >= 0 && Math.floor(Math.sqrt(discD)) * Math.floor(Math.sqrt(discD)) === discD;

  let discNatureBn = '';
  if (discD > 0 && isPerfectSquare) {
    discNatureBn = 'বাস্তব, অসমান ও মূলদ (Rational)';
  } else if (discD > 0 && !isPerfectSquare) {
    discNatureBn = 'বাস্তব, অসমান ও অমূলদ (Irrational)';
  } else if (discD === 0) {
    discNatureBn = 'বাস্তব ও পরস্পর সমান (Equal)';
  } else {
    discNatureBn = 'কোনো বাস্তব মূল নেই (No Real Roots)';
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="math"
        subjectNameBn="সাধারণ গণিত"
        chapterNum={5}
        chapterTitleBn="এক চলকবিশিষ্ট সমীকরণ (Equations in One Variable)"
        activeLesson={activeLabId}
        activeLessonTitle={LAB_LESSONS[activeLabId - 1]?.title}
        onOpenAi={() => setIsSheruOpen(true)}
        aiButtonLabel="শেরু সহকারী"
        rightExtras={
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">প্রস্তুতি:</span>
            <div className="w-20 bg-muted rounded-full h-2 overflow-hidden border border-border/40">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-primary font-mono">{progressPercent}%</span>
          </div>
        }
      />

      {/* 5-Step Learning Framework Tab Bar */}
      <div className="border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-[49px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

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
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>এনসিটিবি নবম-দশম সাধারণ গণিত • অধ্যায় ৫</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
                  এক চলকবিশিষ্ট সমীকরণ (Equations in One Variable)
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  অজ্ঞাত রাশির মান খোঁজা কেবল মুখস্থ নিয়মের খেলা নয়, এটি নিখুঁত ভারসাম্য বজায় রাখার বিজ্ঞান। সমীকরণ বনাম অভেদ, একঘাত পক্ষান্তর, শ্রীধর আচার্যের দ্বিঘাত নিশ্চায়ক, এবং অবান্তর মূলের ফিল্টার ৫টি ইন্টারঅ্যাক্টিভ ল্যাবে আবিষ্কার করুন।
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
            {/* LAB 1: সমীকরণ বনাম অভেদ তুলাদণ্ড ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary" />
                      <span>মোড ও চলক কন্ট্রোলার</span>
                    </h3>

                    {/* Mode Toggle */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setIsIdentityMode(false)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                          !isIdentityMode
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span>সমীকরণ মোড (Equation)</span>
                        </div>
                        <span className="text-[10px] block mt-1 opacity-90">
                          2x + 3 = 7
                        </span>
                      </button>

                      <button
                        onClick={() => setIsIdentityMode(true)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                          isIdentityMode
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span>অভেদ মোড (Identity)</span>
                        </div>
                        <span className="text-[10px] block mt-1 opacity-90">
                          (x + 1)² ≡ x² + 2x + 1
                        </span>
                      </button>
                    </div>

                    {/* x Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">চলকের মান (Variable, x):</span>
                        <span className="text-primary font-mono text-sm font-bold">x = {xSliderVal}</span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="6"
                        step="1"
                        value={xSliderVal}
                        onChange={(e) => setXSliderVal(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>-২</span>
                        <span>০</span>
                        <span className="font-bold text-foreground">২ (সমীকরণ সমাধান)</span>
                        <span>৪</span>
                        <span>৬</span>
                      </div>
                    </div>

                    {/* Core Distinction Explanation */}
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2 text-xs">
                      <span className="font-bold text-foreground">এনসিটিবি পাঠ্যপুস্তক সংজ্ঞা:</span>
                      <p className="text-muted-foreground leading-relaxed">
                        {!isIdentityMode
                          ? 'সমীকরণে সমান চিহ্নের দুই পাশে বহুপদী থাকে। এটি চলকের কেবল ১টি বা সীমিত সংখ্যক মানের জন্য সিদ্ধ হয় (এখানে কেবল x = 2 তে সত্য)।'
                          : 'অভেদে সমান চিহ্নের দুই পক্ষে বীজগণিতীয় রাশি থাকে। চলকের যেকোনো বাস্তব মানের জন্যই দুই পক্ষ সর্বদা সমান হয়!'}
                      </p>
                    </div>
                  </div>

                  {/* Right Balance Scale Visualizer (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" />
                        <span>লাইভ ব্যালেন্স স্কেল (Physical Balance)</span>
                      </h3>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                        {!isIdentityMode ? '2x + 3 = 7' : '(x + 1)² ≡ x² + 2x + 1'}
                      </span>
                    </div>

                    {/* The Scale Beam */}
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-muted/30 to-muted/10 border border-border/60 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Pan */}
                        <div
                          className={`p-5 rounded-2xl bg-card border shadow-sm text-center space-y-2 transition-all ${
                            (!isIdentityMode && isEqBalanced) || (isIdentityMode && isIdBalanced)
                              ? 'border-emerald-500/40 bg-emerald-500/5'
                              : 'border-destructive/40 bg-destructive/5'
                          }`}
                        >
                          <span className="text-[11px] font-bold text-muted-foreground uppercase">
                            বামপক্ষ (Left Pan)
                          </span>
                          <div className="text-2xl font-black font-mono text-foreground">
                            {!isIdentityMode ? (
                              <RenderMathText text={`$2(${xSliderVal}) + 3 = ${eqLhs}$`} />
                            ) : (
                              <RenderMathText text={`$(${xSliderVal} + 1)^2 = ${idLhs}$`} />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground block">
                            {!isIdentityMode ? 'মান = ' + eqLhs : 'মান = ' + idLhs}
                          </span>
                        </div>

                        {/* Right Pan */}
                        <div
                          className={`p-5 rounded-2xl bg-card border shadow-sm text-center space-y-2 transition-all ${
                            (!isIdentityMode && isEqBalanced) || (isIdentityMode && isIdBalanced)
                              ? 'border-emerald-500/40 bg-emerald-500/5'
                              : 'border-destructive/40 bg-destructive/5'
                          }`}
                        >
                          <span className="text-[11px] font-bold text-muted-foreground uppercase">
                            ডানপক্ষ (Right Pan)
                          </span>
                          <div className="text-2xl font-black font-mono text-foreground">
                            {!isIdentityMode ? (
                              <RenderMathText text={`$7$`} />
                            ) : (
                              <RenderMathText
                                text={`$${xSliderVal}^2 + 2(${xSliderVal}) + 1 = ${idRhs}$`}
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground block">
                            {!isIdentityMode ? 'মান = ' + eqRhs : 'মান = ' + idRhs}
                          </span>
                        </div>
                      </div>

                      {/* Equilibrium Indicator */}
                      <div
                        className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                          (!isIdentityMode && isEqBalanced) || (isIdentityMode && isIdBalanced)
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-destructive/10 border-destructive/30 text-destructive'
                        }`}
                      >
                        {(!isIdentityMode && isEqBalanced) || (isIdentityMode && isIdBalanced) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              তুলাদণ্ড সম্পূর্ণ ভারসাম্যপূর্ণ (Balanced!) — উভয়পাশ হুবহু সমান
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>
                              ভারসাম্যহীন! (Unbalanced) — সমীকরণটি x = {xSliderVal} এর জন্য অসত্য
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border border-border/40 rounded-xl overflow-hidden">
                        <thead className="bg-muted/40 font-bold">
                          <tr>
                            <th className="p-2.5">বৈশিষ্ট্য</th>
                            <th className="p-2.5">সমীকরণ (Equation)</th>
                            <th className="p-2.5">অভেদ (Identity)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          <tr>
                            <td className="p-2.5 font-bold">১. সত্যতার পরিধি</td>
                            <td className="p-2.5">চলকের নির্দিষ্ট মানের জন্য সত্য</td>
                            <td className="p-2.5">চলকের সকল বাস্তব মানের জন্য সত্য</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">২. ব্যবহৃত চিহ্ন</td>
                            <td className="p-2.5">কেবল সমান (=) চিহ্ন</td>
                            <td className="p-2.5">অভেদ (≡) বা সমান (=) উভয় চিহ্ন</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">৩. মূলের সংখ্যা</td>
                            <td className="p-2.5">সমীকরণের ঘাত সংখ্যার সমান মূল থাকে</td>
                            <td className="p-2.5">অসংখ্য মানে সিদ্ধ হয়</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 2: একঘাত সমীকরণ ও পক্ষান্তর বিধি ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>একঘাত সমীকরণ গঠনকারী (ax + b = c)</span>
                    </h3>

                    {/* Presets */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground">বোর্ড মডেল প্রিসেট:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { a: 3, b: 5, c: 26, label: '3x + 5 = 26' },
                          { a: 5, b: -7, c: 18, label: '5x - 7 = 18' },
                          { a: 2, b: 9, c: 1, label: '2x + 9 = 1' },
                          { a: 4, b: 12, c: 0, label: '4x + 12 = 0' },
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setLinCoeffA(p.a);
                              setLinConstB(p.b);
                              setLinRightC(p.c);
                            }}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                              linCoeffA === p.a && linConstB === p.b && linRightC === p.c
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Sliders */}
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">সহগ (Coefficient, a):</span>
                          <span className="text-primary font-mono font-bold">a = {linCoeffA}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="1"
                          value={linCoeffA}
                          onChange={(e) => setLinCoeffA(parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">ধ্রুবক (Constant, b):</span>
                          <span className="text-primary font-mono font-bold">b = {linConstB}</span>
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="15"
                          step="1"
                          value={linConstB}
                          onChange={(e) => setLinConstB(parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">ডানপক্ষ (Right Constant, c):</span>
                          <span className="text-primary font-mono font-bold">c = {linRightC}</span>
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="30"
                          step="1"
                          value={linRightC}
                          onChange={(e) => setLinRightC(parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Step-by-Step Transposition Solver (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-5">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>পক্ষান্তর বিধির ধাপভিত্তিক প্রমাণ</span>
                    </h3>

                    {(() => {
                      const step1Val = linRightC - linConstB;
                      const solX = (step1Val / linCoeffA).toFixed(2);
                      const isInt = Number.isInteger(step1Val / linCoeffA);

                      return (
                        <div className="space-y-4 font-mono text-xs">
                          {/* Given Equation */}
                          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                            <span className="text-[10px] font-bold text-primary uppercase">
                              প্রদত্ত একঘাত সমীকরণ
                            </span>
                            <div className="text-xl font-black font-mono text-foreground">
                              <RenderMathText
                                text={`$${linCoeffA}x ${
                                  linConstB >= 0 ? '+ ' + linConstB : '- ' + Math.abs(linConstB)
                                } = ${linRightC}$`}
                              />
                            </div>
                          </div>

                          {/* Step 1: Subtraction of b */}
                          <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                            <span className="text-[10px] font-bold text-primary block">
                              ধাপ ১: উভয়পাশ থেকে {linConstB} বিয়োগ (পক্ষান্তর বিধি)
                            </span>
                            <div className="text-sm font-bold text-foreground">
                              <RenderMathText
                                text={`$${linCoeffA}x = ${linRightC} ${
                                  linConstB >= 0 ? '- ' + linConstB : '+ ' + Math.abs(linConstB)
                                } \\implies ${linCoeffA}x = ${step1Val}$`}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground block">
                              বামপাশ থেকে ধ্রুবকটি ডানপাশে গেলে চিহ্ন পরিবর্তিত হয়
                            </span>
                          </div>

                          {/* Step 2: Division by a */}
                          <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                            <span className="text-[10px] font-bold text-primary block">
                              ধাপ ২: উভয়পাশকে সহগ {linCoeffA} দ্বারা ভাগ
                            </span>
                            <div className="text-sm font-bold text-foreground">
                              <RenderMathText
                                text={`$x = \\frac{${step1Val}}{${linCoeffA}} ${
                                  isInt ? '= ' + (step1Val / linCoeffA) : '\\approx ' + solX
                                }$`}
                              />
                            </div>
                          </div>

                          {/* Solution Card */}
                          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-between">
                            <span>নির্ণেয় সমাধান:</span>
                            <span className="text-lg">
                              x = {isInt ? step1Val / linCoeffA : `${step1Val}/${linCoeffA}`}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 3: দ্বিঘাত সমীকরণ ও নিশ্চায়ক কোলাইডার ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Controls & Slider (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>দ্বিঘাত সহগ পরিবর্তনকারী (ax² + bx + c = 0)</span>
                    </h3>

                    {/* Presets */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        নিশ্চায়ক প্রকৃতি প্রিসেট:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { a: 1, b: -5, c: 6, label: 'D > 0 পূর্ণবর্গ (মূলদ)' },
                          { a: 1, b: -4, c: 1, label: 'D > 0 অপূর্ণবর্গ (অমূলদ)' },
                          { a: 1, b: -6, c: 9, label: 'D = 0 (সমান মূল)' },
                          { a: 1, b: -2, c: 5, label: 'D < 0 (অবাস্তব)' },
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setQuadA(p.a);
                              setQuadB(p.b);
                              setQuadC(p.c);
                            }}
                            className={`p-2 rounded-xl text-xs font-bold border transition-all text-left ${
                              quadA === p.a && quadB === p.b && quadC === p.c
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sliders for a, b, c */}
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">দ্বিঘাত সহগ (a ≠ 0):</span>
                          <span className="text-primary font-mono font-bold">a = {quadA}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          step="1"
                          value={quadA}
                          onChange={(e) => setQuadA(parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">একঘাত সহগ (b):</span>
                          <span className="text-primary font-mono font-bold">b = {quadB}</span>
                        </div>
                        <input
                          type="range"
                          min="-8"
                          max="8"
                          step="1"
                          value={quadB}
                          onChange={(e) => setQuadB(parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">ধ্রুবক (c):</span>
                          <span className="text-primary font-mono font-bold">c = {quadC}</span>
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="12"
                          step="1"
                          value={quadC}
                          onChange={(e) => setQuadC(parseInt(e.target.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Discriminant Collider & Formula (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>শ্রীধর আচার্য সূত্র ও নিশ্চায়ক বিশ্লেষণ</span>
                    </h3>

                    {/* Quadratic Formula Display */}
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-center space-y-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        শ্রীধর আচার্যের দ্বিঘাত সমাধান সূত্র
                      </span>
                      <div className="text-xl font-bold font-mono text-primary">
                        <RenderMathText text="$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$" />
                      </div>
                    </div>

                    {/* Discriminant Calculation Box */}
                    <div className="p-5 rounded-2xl bg-card border border-primary/30 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">
                          নিশ্চায়ক (Discriminant, D):
                        </span>
                        <span className="text-lg font-black font-mono text-foreground">
                          D = {discD}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/30 font-mono text-xs">
                        <RenderMathText
                          text={`$D = (${quadB})^2 - 4(${quadA})(${quadC}) = ${Math.pow(
                            quadB,
                            2
                          )} - ${4 * quadA * quadC} = ${discD}$`}
                        />
                      </div>

                      {/* Nature of Roots Badge */}
                      <div
                        className={`p-3.5 rounded-xl border flex items-center justify-between font-bold text-xs ${
                          discD > 0
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : discD === 0
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                            : 'bg-destructive/10 border-destructive/30 text-destructive'
                        }`}
                      >
                        <span>মূলদ্বয়ের প্রকৃতি:</span>
                        <span>{discNatureBn}</span>
                      </div>
                    </div>

                    {/* Actual Roots */}
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-1 text-xs">
                      <span className="font-bold text-foreground">মূলদ্বয় (Roots):</span>
                      {discD >= 0 ? (
                        <div className="font-mono text-sm text-foreground pt-1">
                          <RenderMathText
                            text={`$x_1 = ${((-quadB + Math.sqrt(discD)) / (2 * quadA)).toFixed(
                              2
                            )}, \\quad x_2 = ${(( -quadB - Math.sqrt(discD)) / (2 * quadA)).toFixed(
                              2
                            )}$`}
                          />
                        </div>
                      ) : (
                        <p className="text-destructive font-mono pt-1">
                          কোনো বাস্তব মূল নেই (√({discD}) একটি কাল্পনিক সংখ্যা)!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 4: অমূলদ সমীকরণ ও অবান্তর মূল ডিটেক্টর ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Model Selector (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-destructive" />
                      <span>অমূলদ সমীকরণ মডেল ও ফাঁদ নির্বাচন</span>
                    </h3>

                    <div className="space-y-2.5">
                      {[
                        {
                          id: 1,
                          name: 'মডেল ১: স্ট্যান্ডার্ড বর্গমূল সমীকরণ',
                          eq: '√(2x + 3) - √(x + 1) = 1',
                          trap: 'উভয়পক্ষ বর্গ করে বৈধ মূল পাওয়া যায়',
                        },
                        {
                          id: 2,
                          name: 'মডেল ২: কুখ্যাত অবান্তর মূল ফাঁদ!',
                          eq: '√(x - 3) + 2 = 0',
                          trap: 'বর্গ করলে x = 7 আসে, কিন্তু তা অবান্তর!',
                        },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setActiveRadicalModel(m.id)}
                          className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                            activeRadicalModel === m.id
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-muted/30 border-border/60 hover:bg-muted/60 text-foreground'
                          }`}
                        >
                          <span className="text-xs font-bold block">{m.name}</span>
                          <span className="text-xs font-mono font-bold mt-1 block">
                            <RenderMathText text={`$${m.eq}$`} />
                          </span>
                          <span className="text-[10px] opacity-80 block mt-0.5">{m.trap}</span>
                        </button>
                      ))}
                    </div>

                    {/* Why Extraneous Roots Occur */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>কেন অবান্তর মূল সৃষ্টি হয়?</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        যদি A = B হয়, তবে A² = B² সর্বদা সত্য। কিন্তু এর বিপরীত সত্য নয়! কারণ A² = B² থেকে A = B অথবা A = -B উভয়ই আসতে পারে। বর্গ করার সময় এই অপ্রয়োজনীয় A = -B সমীকরণে অবান্তর মূল হিসেবে ঢুকে পড়ে!
                      </p>
                    </div>
                  </div>

                  {/* Right Verification Gate & Scanner (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>শুদ্ধি পরীক্ষা স্ক্যানার (Verification Gate)</span>
                    </h3>

                    {activeRadicalModel === 2 ? (
                      <div className="space-y-4">
                        {/* Trap breakdown */}
                        <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-3">
                          <span className="text-xs font-bold text-destructive flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            মারাত্মক ফাঁদ: √(x - 3) + 2 = 0
                          </span>
                          <div className="font-mono text-xs space-y-1.5 text-foreground">
                            <div>১. পক্ষান্তর: √(x - 3) = -2</div>
                            <div>২. উভয়পক্ষ বর্গ: (√(x - 3))² = (-2)² ⇒ x - 3 = 4</div>
                            <div className="font-bold text-destructive">৩. আপাত সমাধান: x = 7!</div>
                          </div>
                        </div>

                        {/* Verification Test */}
                        <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-3">
                          <span className="text-xs font-bold text-foreground">
                            শুদ্ধি পরীক্ষা (x = 7 বসিয়ে পাই):
                          </span>
                          <div className="p-3 rounded-xl bg-muted/30 font-mono text-xs space-y-1">
                            <div>বামপক্ষ = √(7 - 3) + 2 = √4 + 2 = 2 + 2 = 4</div>
                            <div>ডানপক্ষ = 0</div>
                            <div className="text-destructive font-bold">
                              বামপক্ষ ≠ ডানপক্ষ (4 ≠ 0)!
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
                            সিদ্ধান্ত: x = 7 একটি অবান্তর মূল! সমীকরণটির কোনো বাস্তব সমাধান নেই (সমাধান সেট = ∅)।
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Normal model */}
                        <div className="p-5 rounded-2xl bg-card border border-border/60 space-y-3 font-mono text-xs">
                          <span className="text-xs font-bold text-primary block">
                            √(2x + 3) - √(x + 1) = 1
                          </span>
                          <div className="p-3 rounded-xl bg-muted/20 space-y-1 text-foreground">
                            <div>• x = 3 বসালে: √(9) - √(4) = 3 - 2 = 1 = ডানপক্ষ (সিদ্ধ!)</div>
                            <div>• x = -1 বসালে: √(1) - √(0) = 1 - 0 = 1 = ডানপক্ষ (সিদ্ধ!)</div>
                          </div>
                          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                            নির্ণেয় সমাধান সেট: <RenderMathText text="$S = \{-1, 3\}$" /> (উভয় মূলই বৈধ)।
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 5: বাস্তবভিত্তিক সমস্যা ও সমীকরণ গঠন ল্যাব */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Problem Type Tabs (5 cols) */}
                  <div className="lg:col-span-5 rounded-3xl border border-border/60 bg-card p-6 space-y-6">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-primary" />
                      <span>সমস্যা ধরণ নির্বাচন</span>
                    </h3>

                    <div className="space-y-2.5">
                      {[
                        { id: 1, title: '১. নৌকা ও স্রোতের বেগ', sub: 'অনুকূল ও প্রতিকূল গতিবেগ' },
                        { id: 2, title: '২. ভগ্নাংশের লব ও হর', sub: 'শর্ত থেকে সমীকরণ গঠন' },
                        { id: 3, title: '৩. নল ও চৌবাচ্চার কাজ', sub: 'একক সময়ের ক্ষমতা' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveWordType(t.id)}
                          className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                            activeWordType === t.id
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-muted/30 border-border/60 hover:bg-muted/60 text-foreground'
                          }`}
                        >
                          <span className="text-xs font-bold block">{t.title}</span>
                          <span className="text-[10px] opacity-80 block mt-0.5">{t.sub}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs space-y-1">
                      <span className="font-bold text-foreground">মডেলিং এর ৩টি মূল সূত্র:</span>
                      <p className="text-muted-foreground">• অজানা রাশিকে x ধরা</p>
                      <p className="text-muted-foreground">• শর্তানুসারে সমীকরণ সাজানো</p>
                      <p className="text-muted-foreground">• বাস্তব শর্তে ঋণাত্মক মান বর্জন করা</p>
                    </div>
                  </div>

                  {/* Right Problem Modeling Breakdown (7 cols) */}
                  <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card p-6 space-y-5">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>বাস্তব সমস্যা থেকে সমীকরণের রূপান্তর</span>
                    </h3>

                    {activeWordType === 1 && (
                      <div className="space-y-4 font-mono text-xs">
                        <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
                          <span className="font-bold text-foreground text-sm">
                            সমস্যা: স্থির পানিতে নৌকার বেগ ৮ কিমি/ঘণ্টা। স্রোতের অনুকূলে ৩০ কিমি গিয়ে ফিরে আসতে মোট ৮ ঘণ্টা লাগে। স্রোতের বেগ কত?
                          </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                          <span className="text-[10px] font-bold text-primary block">
                            ধাপ ১: অনুকূল ও প্রতিকূল বেগ প্রকাশ
                          </span>
                          <div>স্রোতের বেগ = x কিমি/ঘণ্টা হলে: অনুকূলে বেগ = (৮ + x), প্রতিকূলে = (৮ - x)</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                          <span className="text-[10px] font-bold text-primary block">
                            ধাপ ২: শর্তমতে সমীকরণ
                          </span>
                          <div>৩০/(৮ + x) + ৩০/(৮ - x) = ৮</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                          সমাধান: x² = 4 ⇒ x = 2 (বেগ ঋণাত্মক হতে পারে না, তাই x = ২ কিমি/ঘণ্টা)।
                        </div>
                      </div>
                    )}

                    {activeWordType === 2 && (
                      <div className="space-y-4 font-mono text-xs">
                        <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
                          <span className="font-bold text-foreground text-sm">
                            সমস্যা: একটি ভগ্নাংশের লব ও হরের অন্তর ১। লব থেকে ২ বিয়োগ এবং হরের সাথে ১ যোগ করলে ভগ্নাংশটি ১/২ হয়। ভগ্নাংশটি কত?
                          </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                          <div>ধরি হর = x, তাহলে লব = x - 1</div>
                          <div>শর্তমতে: (x - 1 - 2) / (x + 1) = 1/2</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                          সমাধান: 2(x - 3) = x + 1 ⇒ 2x - 6 = x + 1 ⇒ x = 7; লব = 6। ভগ্নাংশটি = ৬/৭।
                        </div>
                      </div>
                    )}

                    {activeWordType === 3 && (
                      <div className="space-y-4 font-mono text-xs">
                        <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
                          <span className="font-bold text-foreground text-sm">
                            সমস্যা: দুটি নল দ্বারা একটি চৌবাচ্চা ১২ মিনিটে পূর্ণ হয়। একটি নল অপরটির চেয়ে ১০ মিনিট বেশি সময় নিলে প্রতিটি নলের সময় কত?
                          </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40 space-y-1">
                          <div>১ম নল নেয় x মিনিট, ২য় নল নেয় (x + 10) মিনিট</div>
                          <div>শর্তমতে: 1/x + 1/(x + 10) = 1/12</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                          সমাধান: x = 20 মিনিট (১ম নল ২০ মিনিট, ২য় নল ৩০ মিনিট)।
                        </div>
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
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
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
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
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
                <span>ইন্টারেক্টিভ সমীকরণ চ্যালেঞ্জ</span>
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
                  একঘাত সমীকরণ সমাধান
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$3x - 7 = 14$ হলে $x = ?$" />
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
                      placeholder="যেমন: 7"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (chal1Input.trim() === '7') {
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
                      <span>চমৎকার! সঠিক উত্তর: ৭</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ <RenderMathText text="$3x = 14 + 7 = 21 \\implies x = 7$" />।
                    </p>
                  </div>
                )}
                {chal1Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: ৭ কে ডানপাশে যোগ করে ৩ দিয়ে ভাগ করুন।</p>
                  </div>
                )}
              </div>

              {/* Challenge 2 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০২</span>
                <h3 className="text-sm font-bold text-foreground">
                  দ্বিঘাত সমীকরণের নিশ্চায়ক
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$x^2 - 5x + 6 = 0$ এর নিশ্চায়ক $D = ?$" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    D এর মান লিখুন:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal2Input}
                      onChange={(e) => setChal2Input(e.target.value)}
                      placeholder="যেমন: 1"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (chal2Input.trim() === '1') {
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
                      <span>অসাধারণ! সঠিক উত্তর: ১</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ <RenderMathText text="$D = b^2 - 4ac = (-5)^2 - 4(1)(6) = 25 - 24 = 1$" />।
                    </p>
                  </div>
                )}
                {chal2Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: b² - 4ac সূত্রে a=1, b=-5, c=6 বসান।</p>
                  </div>
                )}
              </div>

              {/* Challenge 3 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০৩</span>
                <h3 className="text-sm font-bold text-foreground">
                  অমূলদ সমীকরণ সমাধান
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$\\sqrt{x + 5} = 4$ হলে $x = ?$" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    x এর মান লিখুন:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal3Input}
                      onChange={(e) => setChal3Input(e.target.value)}
                      placeholder="যেমন: 11"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (chal3Input.trim() === '11') {
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
                      <span>দুর্দান্ত! সঠিক উত্তর: ১১</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ বর্গ করলে <RenderMathText text="$x + 5 = 16 \\implies x = 11$" />।
                    </p>
                  </div>
                )}
                {chal3Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: উভয়পাশকে বর্গ করে ৪² = ১৬ থেকে ৫ বিয়োগ করুন।</p>
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
                  <span>অধ্যায় ৫ সম্পূর্ণ সারসংক্ষেপ ও সূত্র ভাণ্ডার</span>
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
                  title: '১. একঘাত সমীকরণ রূপ',
                  math: '$ax + b = 0 \\quad (a \\neq 0)$',
                  sub: '$x = -\\frac{b}{a}$',
                  desc: 'চলকের মাত্র ১টি অনন্য বাস্তব সমাধান থাকে।',
                },
                {
                  title: '২. শ্রীধর আচার্যের দ্বিঘাত সূত্র',
                  math: '$ax^2 + bx + c = 0 \\quad (a \\neq 0)$',
                  sub: '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$',
                  desc: 'দ্বিঘাত সমীকরণের সর্বোচ্চ ২টি মূল থাকে।',
                },
                {
                  title: '৩. নিশ্চায়ক (Discriminant, D)',
                  math: '$D = b^2 - 4ac$',
                  sub: '$D > 0, \\quad D = 0, \\quad D < 0$',
                  desc: 'D > 0 হলে মূল বাস্তব; D = 0 হলে সমান; D < 0 হলে অবাস্তব।',
                },
                {
                  title: '৪. সমীকরণ বনাম অভেদ',
                  math: '$f(x) = g(x) \\quad \\text{vs} \\quad f(x) \\equiv g(x)$',
                  sub: '$(x+1)^2 \\equiv x^2 + 2x + 1$',
                  desc: 'অভেদে চলকের সকল মানের জন্য দুই পক্ষ সত্য হয়।',
                },
                {
                  title: '৫. অমূলদ ও অবান্তর মূল সতর্কতা',
                  math: '$A = B \\implies A^2 = B^2$',
                  sub: 'শুদ্ধি পরীক্ষা (Verification Gate) আবশ্যক',
                  desc: 'বর্গ করার ফলে সৃষ্ট অবান্তর মূল বাদ দিতে হয়।',
                },
                {
                  title: '৬. গতিবেগ ও স্রোতের সমীকরণ',
                  math: '$v_{\\text{অনুকূল}} = u + v, \\quad v_{\\text{প্রতিকূল}} = u - v$',
                  sub: '$t = \\frac{s}{u \\pm v}$',
                  desc: 'বাস্তব সমস্যায় বেগ ঋণাত্মক হতে পারে না।',
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
                    trap: 'ফাঁদ ১: অমূলদ সমীকরণে শুদ্ধি পরীক্ষা না করা',
                    desc: 'উভয়পক্ষকে বর্গ করলে অবান্তর মূল অনুপ্রবেশ করতে পারে। শুদ্ধি পরীক্ষা না দেখালে সরাসরি ১ নম্বর কেটে নেওয়া হয়।',
                  },
                  {
                    trap: 'ফাঁদ ২: দ্বিঘাত সমীকরণে a ≠ 0 শর্ত উল্লেখ না করা',
                    desc: 'ax² + bx + c = 0 সমীকরণে a = 0 হলে তা দ্বিঘাত থাকে না, একঘাত হয়ে যায়। তাই a ≠ 0 শর্তটি আবশ্যিক।',
                  },
                  {
                    trap: 'ফাঁদ ৩: বাস্তব সমস্যায় ঋণাত্মক মান বর্জনের কারণ না লেখা',
                    desc: 'x² = 4 থেকে x = ±2 এলে "দৈর্ঘ্য বা বেগ ঋণাত্মক হতে পারে না, তাই x ≠ -2" না লিখলে ১ নম্বর কাটা যাবে।',
                  },
                  {
                    trap: 'ফাঁদ ৪: নিশ্চায়ক D = 0 হলে কেবল ১টি মূল লিখে ফেলা',
                    desc: 'D = 0 হলে মূল ২টিই বিদ্যমান, কিন্তু তারা পরস্পর সমান (x₁ = x₂ = -b/2a)। মূল ১টি বলা টেকনিক্যাল ভুল।',
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
                    অধ্যায় ৫: এক চলকবিশিষ্ট সমীকরণ স্পেশালিস্ট
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
                    q: 'সমীকরণ ও অভেদের আসল পার্থক্য কী?',
                    a: 'সমীকরণে চলকের নির্দিষ্ট মানের জন্য দুই পাশ সমান হয় (2x = 6 কেবল x=3 তে)। আর অভেদে সব বাস্তব মানের জন্য দুই পাশ সর্বদা সমান!',
                  },
                  {
                    q: 'নিশ্চায়ক D < 0 হলে কেন বাস্তব মূল নেই?',
                    a: 'কারণ সূত্রে √D থাকে। D ঋণাত্মক হলে ঋণাত্মক সংখ্যার বর্গমূল বাস্তব সংখ্যায় সংজ্ঞায়িত নয় (কাল্পনিক সংখ্যা)!',
                  },
                  {
                    q: 'বর্গমূল অংকে অবান্তর মূল আসে কেন?',
                    a: 'উভয়পক্ষ বর্গ করলে A = B এর পাশাপাশি A = -B এর মানও ঢুকে পড়ে। তাই শুদ্ধি পরীক্ষা করে অবান্তর মূল বাদ দিতে হয়!',
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
                  placeholder="সমীকরণ বা নিশ্চায়ক নিয়ে প্রশ্ন করুন..."
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
