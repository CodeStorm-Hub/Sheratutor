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
  Ship,
  Compass,
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
    title: 'সহসমীকরণের প্রকৃতি ও শর্তাবলি ল্যাব',
    subtitle: 'System Consistency, Dependency & Number of Solutions',
    nctbPage: 'অনুশীলনী ১২.১ • পৃষ্ঠা ২৩১',
    badge: 'বোর্ড এমসিকিউ মাস্ট',
    intro:
      'সহসমীকরণ জোট a₁x + b₁y = c₁ এবং a₂x + b₂y = c₂ এর সহগসমূহের অনুপাত (a₁/a₂, b₁/b₂, c₁/c₂) যাচাই করে সমীকরণ জোটটি সমঞ্জস, নির্ভরশীল এবং কয়টি সমাধান বিদ্যমান তা মুহূর্তেই নির্ণয় করুন।',
  },
  {
    id: 2,
    title: 'প্রতিস্থাপন ও অপনয়ন ডুয়েল ল্যাব',
    subtitle: 'Substitution vs Elimination Step-by-Step Solver',
    nctbPage: 'অনুশীলনী ১২.২ • পৃষ্ঠা ২৩৫',
    badge: 'মৌলিক সমাধান',
    intro:
      'সহসমীকরণ সমাধানের দুটি শাস্ত্রীয় পদ্ধতি: প্রতিস্থাপন (একটি চলক অন্য চলকের মাধ্যমে প্রকাশ) এবং অপনয়ন (সহগ সমান করে যোগ/বিয়োগ)। দুটি পদ্ধতির অ্যানিমেটেড ধাপভিত্তিক সমাধান প্রত্যক্ষ করুন।',
  },
  {
    id: 3,
    title: 'আড়গুণন বা বজ্রগুণন ম্যাট্রিক্স ল্যাব',
    subtitle: 'Cross-Multiplication Method & Determinant Matrix',
    nctbPage: 'অনুশীলনী ১২.৩ • পৃষ্ঠা ২৪১',
    badge: 'দ্রুততম পদ্ধতি',
    intro:
      'আড়গুণন পদ্ধতিতে চলকদ্বয়ের সহগ ও ধ্রুবক পদ সাজিয়ে ডায়াগনাল ক্রস গুণনের সাহায্যে সরাসরি x / (b₁c₂ - b₂c₁) = y / (c₁a₂ - c₂a₁) = 1 / (a₁b₂ - a₂b₁) সূত্রের সাহায্যে সমাধান বের করুন।',
  },
  {
    id: 4,
    title: 'লেখচিত্র ও ছেদবিন্দু সিমুলেটর ল্যাব',
    subtitle: 'Interactive Coordinate Graph & Intersection Point P(x, y)',
    nctbPage: 'অনুশীলনী ১২.৪ • পৃষ্ঠা ২৪৭',
    badge: '৪ নম্বরের গ্রাফ',
    intro:
      'প্রতিটি সরলরেখার জন্য ৩টি করে স্থানাঙ্ক বিন্দু নির্ণয় করে কার্তেসীয় সমতলে রেখা দুটি অঙ্কন করুন। রেখাদ্বয়ের ছেদবিন্দুই হলো সমীকরণ জোটের অভিন্ন সমাধান।',
  },
  {
    id: 5,
    title: 'বাস্তব সমস্যা: নৌকা ও স্রোতের বেগ ল্যাব',
    subtitle: 'Word Problem Modeling: Boat & Stream Velocity',
    nctbPage: 'অনুশীলনী ১২.৪ • পৃষ্ঠা ২৫২',
    badge: 'সৃজনশীল স্পেশাল',
    intro:
      'বাস্তব জীবনের সর্বাধিক জনপ্রিয় সমস্যা: নদীতে নৌকার গতিবেগ (u) ও স্রোতের বেগ (v)। অনুকূলে বেগ (u + v) এবং প্রতিকূলে বেগ (u - v) দিয়ে সমীকরণ গঠন ও সমাধানের সিমুলেশন।',
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
    stem: 'উদ্দীপক: দুটি সরল সমীকরণ যথাক্রমে 2x + 3y = 7 এবং 3x - 2y = 4।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'সমীকরণ জোটের সহগসমূহের অনুপাত তুলনা করে দেখাও যে সমীকরণ জোটটি সমঞ্জস ও এর অনন্য সমাধান আছে।',
        solution: [
          'প্রদত্ত সমীকরণদ্বয়: 2x + 3y = 7 এবং 3x - 2y = 4',
          'এখানে, x এর সহগদ্বয়ের অনুপাত a₁/a₂ = 2/3',
          'y এর সহগদ্বয়ের অনুপাত b₁/b₂ = 3/(-2) = -3/2',
          'যেহেতু a₁/a₂ ≠ b₁/b₂ (কারণ 2/3 ≠ -3/2)',
          'সুতরাং, NCTB শর্তানুসারে সমীকরণ জোটটি সমঞ্জস (Consistent), পরস্পর অনির্ভরশীল এবং এর একটিমাত্র (অনন্য) সমাধান বিদ্যমান (দেখানো হলো)।',
        ],
        examinerSecret:
          'অনুপাতদ্বয়ের অসমতা স্পষ্ট করে লিখলে ২/২ নম্বর নিশ্চিত। শুধু "একটি সমাধান আছে" লিখলে ১ নম্বর কাটা যাবে।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'আড়গুণন (বজ্রগুণন) পদ্ধতিতে সমীকরণ জোটটি সমাধান করে (x, y) নির্ণয় কর।',
        solution: [
          'সমীকরণদ্বয়কে আদর্শ রূপে সাজিয়ে পাই:',
          '2x + 3y - 7 = 0  --- (১)',
          '3x - 2y - 4 = 0  --- (২)',
          'আড়গুণন সূত্র প্রয়োগ করে পাই:',
          'x / {3 × (-4) - (-2) × (-7)} = y / {(-7) × 3 - (-4) × 2} = 1 / {2 × (-2) - 3 × 3}',
          'বা, x / {-12 - 14} = y / {-21 + 8} = 1 / {-4 - 9}',
          'বা, x / (-26) = y / (-13) = 1 / (-13)',
          'এখন, x / (-26) = 1 / (-13) ⇒ x = (-26) / (-13) = 2',
          'এবং y / (-13) = 1 / (-13) ⇒ y = (-13) / (-13) = 1',
          'অতএব, নির্ণেয় সমাধান (x, y) = (2, 1)।',
        ],
        examinerSecret:
          'সমীকরণকে আদর্শ রূপ (ডানপাশে শূন্য) এ না নিয়ে আড়গুণন করলে চিহ্নের (+/-) মারাত্মক ভুল হয়। ধ্রুবক পদ বামে নেওয়া বাধ্যতামূলক।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'লেখচিত্রের সাহায্যে সমীকরণ জোটটির সমাধান নির্ণয় কর।',
        solution: [
          '১ম সমীকরণ থেকে: 2x + 3y = 7 ⇒ y = (7 - 2x) / 3',
          'x এর কয়েকটি মানের জন্য y এর সংশ্লিষ্ট মান নির্ণয়ের ছক: (-1, 3), (2, 1), (5, -1)',
          '২য় সমীকরণ থেকে: 3x - 2y = 4 ⇒ y = (3x - 4) / 2',
          'x এর কয়েকটি মানের জন্য y এর সংশ্লিষ্ট মান নির্ণয়ের ছক: (0, -2), (2, 1), (4, 4)',
          'ছক কাগজে ক্ষুদ্রতম বর্গের প্রতি বাহুকে একক ধরে উভয় রেখার বিন্দুগুলো স্থাপন করে যুক্ত করি।',
          'রেখাদ্বয় পরস্পরকে P(2, 1) বিন্দুতে ছেদ করে।',
          'অতএব, নির্ণেয় সমাধান (x, y) = (2, 1)।',
        ],
        examinerSecret:
          'প্রত্যেক সমীকরণের জন্য ন্যূনতম ৩টি করে পূর্ণসংখ্যার বিন্দু বের করতে হবে এবং স্কেল বর্ণনা (যেমন: প্রতি ১ ঘর = ১ একক) খাতার বর্ণনায় লেখা বাধ্যতামূলক।',
      },
    ],
  },
  {
    id: 2,
    boardSource: 'চট্টগ্রাম বোর্ড ২০২৪ / কুমিল্লা বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'উদ্দীপক: x/a + y/b = 2 এবং ax - by = a² - b²।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂ হলে সমীকরণ জোটের সমাধানযোগ্যতা ও জ্যামিতিক বৈশিষ্ট্য লিখ।',
        solution: [
          'শর্তমতে a₁/a₂ = b₁/b₂ ≠ c₁/c₂ হলে:',
          '১. সমীকরণ জোটটি অসমঞ্জস (Inconsistent) এবং পরস্পর অনির্ভরশীল।',
          '২. সমীকরণ জোটের কোনো বাস্তব সমাধান নেই।',
          '৩. জ্যামিতিকভাবে রেখাদ্বয় পরস্পর সমান্তরাল (Parallel Lines), এরা কখনো একে অপরকে ছেদ করে না।',
        ],
        examinerSecret:
          'সমান্তরাল রেখার জ্যামিতিক ব্যাখ্যা উল্লেখ করলে পরীক্ষক খুশি হয়ে পূর্ণ ২ নম্বর দেন।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'প্রতিস্থাপন পদ্ধতিতে সমীকরণ জোটটি সমাধান কর।',
        solution: [
          'প্রদত্ত সমীকরণ ১: x/a + y/b = 2 ⇒ bx + ay = 2ab ⇒ y = (2ab - bx) / a  --- (৩)',
          'সমীকরণ ২: ax - by = a² - b²',
          'সমীকরণ ২ এ y এর মান বসিয়ে পাই:',
          'ax - b{(2ab - bx) / a} = a² - b²',
          'বা, a²x - 2ab² + b²x = a(a² - b²)',
          'বা, (a² + b²)x - 2ab² = a³ - ab²',
          'বা, (a² + b²)x = a³ - ab² + 2ab² = a³ + ab² = a(a² + b²)',
          'বা, x = {a(a² + b²)} / (a² + b²) = a  [যেহেতু a² + b² ≠ 0]',
          'এখন, x = a এর মান সমীকরণ (৩) এ বসিয়ে পাই:',
          'y = (2ab - ba) / a = ab / a = b।',
          'অতএব, নির্ণেয় সমাধান (x, y) = (a, b)।',
        ],
        examinerSecret:
          'লব ও হরের (a² + b²) কাটাকাটি করার সময় সাইডনোটে a² + b² ≠ 0 উল্লেখ করা মেধার পরিচায়ক।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'অপনয়ন পদ্ধতিতে সমীকরণ জোটটি সমাধান করে দেখাও যে উভয় পদ্ধতিতে প্রাপ্ত সমাধান একই।',
        solution: [
          'সমীকরণ ১: bx + ay = 2ab  --- (১)',
          'সমীকরণ ২: ax - by = a² - b²  --- (২)',
          'y এর সহগ সমান করার জন্য (১) নং সমীকরণকে b দ্বারা এবং (২) নং সমীকরণকে a দ্বারা গুণ করে যোগ করি:',
          '(১) × b ⇒ b²x + aby = 2ab²',
          '(২) × a ⇒ a²x - aby = a³ - ab²',
          'যোগ করে পাই:',
          '(a² + b²)x = a³ + ab² = a(a² + b²)',
          'বা, x = a।',
          'x এর মান (১) নং সমীকরণে বসিয়ে পাই:',
          'b(a) + ay = 2ab ⇒ ay = 2ab - ab = ab ⇒ y = b।',
          'অতএব, অপনয়ন পদ্ধতিতে প্রাপ্ত সমাধান (x, y) = (a, b), যা প্রতিস্থাপন পদ্ধতির সমাধানের সাথে হুবহু মিলে যায় (দেখানো হলো)।',
        ],
        examinerSecret:
          'উভয় পদ্ধতির উত্তরের সমতা দেখানোর কথা প্রশ্নে থাকলে শেষে সিদ্ধান্ত বাক্য লেখা আবশ্যক।',
      },
    ],
  },
  {
    id: 3,
    boardSource: 'দিনাজপুর বোর্ড ২০২৩ / যশোর বোর্ড ২০২৪ • সৃজনশীল প্রশ্ন',
    stem: 'উদ্দীপক: একটি নৌকা দাঁড় বেয়ে স্রোতের অনুকূলে ৩ ঘণ্টায় ৩৬ কিমি যায় এবং স্রোতের প্রতিকূলে ওই পথ যেতে ৬ ঘণ্টা সময় নেয়। অপর একটি ভগ্নাংশের লবের সাথে ১ যোগ করলে মান ৪/৫ হয় এবং হর থেকে ৫ বিয়োগ করলে মান ১/২ হয়।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'নৌকার গতিবেগ u এবং স্রোতের বেগ v হলে উদ্দীপক থেকে দুটি সহসমীকরণ গঠন কর।',
        solution: [
          'ধরি, স্থির পানিতে নৌকার বেগ = u কিমি/ঘণ্টা এবং স্রোতের বেগ = v কিমি/ঘণ্টা (u > v)।',
          'স্রোতের অনুকূলে কার্যকর বেগ = (u + v) = ৩৬ / ৩ = ১২ কিমি/ঘণ্টা ⇒ u + v = 12  --- (১)',
          'স্রোতের প্রতিকূলে কার্যকর বেগ = (u - v) = ৩৬ / ৬ = ৬ কিমি/ঘণ্টা ⇒ u - v = 6  --- (২)',
        ],
        examinerSecret:
          'দূরত্বকে সময় দিয়ে ভাগ করে সরাসরি গতিবেগে রূপান্তর দেখাতে হবে। u > v শর্ত উল্লেখ করা বাঞ্ছনীয়।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'স্থির পানিতে নৌকার বেগ এবং স্রোতের বেগ নির্ণয় কর।',
        solution: [
          'উদ্দীপকের সমীকরণদ্বয়:',
          'u + v = 12  --- (১)',
          'u - v = 6   --- (২)',
          '(১) ও (২) নং সমীকরণ যোগ করে পাই:',
          '2u = 18 ⇒ u = 18 / 2 = 9 কিমি/ঘণ্টা।',
          '(১) নং থেকে (২) নং সমীকরণ বিয়োগ করে পাই:',
          '2v = 6 ⇒ v = 6 / 2 = 3 কিমি/ঘণ্টা।',
          'অতএব, স্থির পানিতে নৌকার বেগ ৯ কিমি/ঘণ্টা এবং স্রোতের বেগ ৩ কিমি/ঘণ্টা।',
        ],
        examinerSecret:
          'একক (কিমি/ঘণ্টা) না লিখলে ১ নম্বর কাটা যাবে। যোগ-বিয়োগ পদ্ধতি সবচেয়ে দ্রুততম।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'উদ্দীপকের দ্বিতীয় অংশ থেকে মূল ভগ্নাংশটি নির্ণয় কর।',
        solution: [
          'ধরি, ভগ্নাংশটির লব = x এবং হর = y (y ≠ 0)। সুতরাং মূল ভগ্নাংশটি = x/y।',
          '১ম শর্তমতে: (x + 1) / y = 4/5 ⇒ 5(x + 1) = 4y ⇒ 5x - 4y = -5  --- (১)',
          '২য় শর্তমতে: x / (y - 5) = 1/2 ⇒ 2x = y - 5 ⇒ 2x - y = -5  --- (২)',
          '(২) নং সমীকরণকে ৪ দ্বারা গুণ করে (১) নং থেকে বিয়োগ করি:',
          '(১) ⇒ 5x - 4y = -5',
          '(২) × ৪ ⇒ 8x - 4y = -20',
          'বিয়োগ করে: -3x = 15 ⇒ x = -15 / -3 = 5।',
          'x এর মান (২) নং সমীকরণে বসিয়ে পাই:',
          '2(5) - y = -5 ⇒ 10 - y = -5 ⇒ y = 15।',
          'অতএব, নির্ণেয় মূল ভগ্নাংশটি x/y = 5/15 = 1/3 (বা ৫/১৫)।',
        ],
        examinerSecret:
          'শুধু x ও y এর মান বের করে রেখে দিলে ১ নম্বর কাটা যাবে। শেষে "মূল ভগ্নাংশ = ৫/১৫ বা ১/৩" লিখতে হবে।',
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
    question: 'a₁x + b₁y = c₁ এবং a₂x + b₂y = c₂ সমীকরণ জোটে a₁/a₂ ≠ b₁/b₂ হলে সমীকরণ জোটটির সমাধান সংখ্যা কত?',
    options: ['A. একটিমাত্র অনন্য সমাধান', 'B. অসংখ্য সমাধান', 'C. কোনো সমাধান নেই', 'D. দুটি সমাধান'],
    correctAnswerIndex: 0,
    explanation:
      'a₁/a₂ ≠ b₁/b₂ হলে সমীকরণ জোটটি সমঞ্জস (Consistent), পরস্পর অনির্ভরশীল এবং এর কেবল একটিমাত্র সমাধান থাকে। জ্যামিতিকভাবে রেখাদ্বয় পরস্পরকে একটি বিন্দুতে ছেদ করে।',
  },
  {
    id: 2,
    question: 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂ হলে সমীকরণ জোটটির বৈশিষ্ট্য কোনটি?',
    options: [
      'A. সমঞ্জস ও একটি সমাধান',
      'B. সমঞ্জস ও অসংখ্য সমাধান',
      'C. অসমঞ্জস ও কোনো সমাধান নেই',
      'D. নির্ভরশীল ও একটি সমাধান',
    ],
    correctAnswerIndex: 2,
    explanation:
      'a₁/a₂ = b₁/b₂ ≠ c₁/c₂ হলে সমীকরণ জোটটি অসমঞ্জস (Inconsistent) এবং কোনো সমাধান থাকে না। রেখাদ্বয় পরস্পর সমান্তরাল হওয়ায় কখনো মিলিত হয় না।',
  },
  {
    id: 3,
    question: 'x + y = 6 এবং x - y = 2 হলে (x, y) এর মান কোনটি?',
    options: ['A. (3, 3)', 'B. (4, 2)', 'C. (5, 1)', 'D. (2, 4)'],
    correctAnswerIndex: 1,
    explanation:
      'যোগ করলে: 2x = 8 ⇒ x = 4। বিয়োগ করলে: 2y = 4 ⇒ y = 2। অতএব (x, y) = (4, 2)।',
  },
  {
    id: 4,
    question: 'আড়গুণন পদ্ধতিতে a₁x + b₁y + c₁ = 0 এবং a₂x + b₂y + c₂ = 0 এর ক্ষেত্রে x এর হর কোনটি?',
    options: ['A. a₁b₂ - a₂b₁', 'B. b₁c₂ - b₂c₁', 'C. c₁a₂ - c₂a₁', 'D. a₁c₂ - a₂c₁'],
    correctAnswerIndex: 1,
    explanation:
      'আড়গুণন সূত্রে: x / (b₁c₂ - b₂c₁) = y / (c₁a₂ - c₂a₁) = 1 / (a₁b₂ - a₂b₁)। অতএব x এর হর হলো (b₁c₂ - b₂c₁)।',
  },
  {
    id: 5,
    question: 'স্থির পানিতে নৌকার বেগ ৮ কিমি/ঘণ্টা এবং স্রোতের বেগ ২ কিমি/ঘণ্টা হলে স্রোতের অনুকূলে ৩ ঘণ্টায় নৌকাটি কত দূর যাবে?',
    options: ['A. ১৮ কিমি', 'B. ২৪ কিমি', 'C. ৩০ কিমি', 'D. ৩৬ কিমি'],
    correctAnswerIndex: 2,
    explanation:
      'অনুকূলে বেগ = (৮ + ২) = ১০ কিমি/ঘণ্টা। ৩ ঘণ্টায় অতিক্রান্ত দূরত্ব = ১০ × ৩ = ৩০ কিমি।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathSimultaneousEquationsGuidebook() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1 state (Consistency & Conditions)
  const [lab1A1, setLab1A1] = useState<number>(2);
  const [lab1B1, setLab1B1] = useState<number>(3);
  const [lab1C1, setLab1C1] = useState<number>(7);
  const [lab1A2, setLab1A2] = useState<number>(4);
  const [lab1B2, setLab1B2] = useState<number>(6);
  const [lab1C2, setLab1C2] = useState<number>(14);

  // Lab 2 state (Substitution vs Elimination)
  const [lab2Method, setLab2Method] = useState<'substitution' | 'elimination'>('substitution');
  const [lab2XCoeff1, setLab2XCoeff1] = useState<number>(2);
  const [lab2YCoeff1, setLab2YCoeff1] = useState<number>(3);
  const [lab2Const1, setLab2Const1] = useState<number>(7);
  const [lab2XCoeff2, setLab2XCoeff2] = useState<number>(3);
  const [lab2YCoeff2, setLab2YCoeff2] = useState<number>(-2);
  const [lab2Const2, setLab2Const2] = useState<number>(4);

  // Lab 3 state (Cross Multiplication Matrix)
  const [lab3A1, setLab3A1] = useState<number>(2);
  const [lab3B1, setLab3B1] = useState<number>(3);
  const [lab3C1, setLab3C1] = useState<number>(-7);
  const [lab3A2, setLab3A2] = useState<number>(3);
  const [lab3B2, setLab3B2] = useState<number>(-2);
  const [lab3C2, setLab3C2] = useState<number>(-4);

  // Lab 4 state (Coordinate Graph & Intersection)
  const [lab4XVal, setLab4XVal] = useState<number>(2);

  // Lab 5 state (Boat & Stream Word Problem)
  const [lab5BoatSpeed, setLab5BoatSpeed] = useState<number>(10);
  const [lab5StreamSpeed, setLab5StreamSpeed] = useState<number>(2);
  const [lab5TimeHours, setLab5TimeHours] = useState<number>(3);

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
      text: 'স্বাগতম! আমি শেরু — তোমার দুই চলকবিশিষ্ট সরল সহসমীকরণ গাইড। প্রতিস্থাপন, অপনয়ন, আড়গুণন, লেখচিত্র বা নৌকা-স্রোতের বেগ সমস্যা নিয়ে যেকোনো প্রশ্ন থাকলে নির্ভয়ে জিজ্ঞেস করো!',
      time: 'এখনই',
    },
  ]);
  const [aiInputText, setAiInputText] = useState<string>('');
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  // Calculations for Lab 1
  const ratioA = lab1A2 !== 0 ? (lab1A1 / lab1A2).toFixed(2) : 'Undefined';
  const ratioB = lab1B2 !== 0 ? (lab1B1 / lab1B2).toFixed(2) : 'Undefined';
  const ratioC = lab1C2 !== 0 ? (lab1C1 / lab1C2).toFixed(2) : 'Undefined';

  let lab1Case: 'unique' | 'infinite' | 'none' = 'unique';
  const isAEqualB = lab1A1 * lab1B2 === lab1A2 * lab1B1;
  const isBEqualC = lab1B1 * lab1C2 === lab1B2 * lab1C1;

  if (isAEqualB && isBEqualC) {
    lab1Case = 'infinite';
  } else if (isAEqualB && !isBEqualC) {
    lab1Case = 'none';
  } else {
    lab1Case = 'unique';
  }

  // Preset setter for Lab 1
  const setLab1Preset = (type: 'unique' | 'infinite' | 'none') => {
    if (type === 'unique') {
      setLab1A1(2); setLab1B1(3); setLab1C1(7);
      setLab1A2(3); setLab1B2(-2); setLab1C2(4);
    } else if (type === 'infinite') {
      setLab1A1(2); setLab1B1(3); setLab1C1(6);
      setLab1A2(4); setLab1B2(6); setLab1C2(12);
    } else {
      setLab1A1(2); setLab1B1(4); setLab1C1(5);
      setLab1A2(2); setLab1B2(4); setLab1C2(9);
    }
  };

  // Calculations for Lab 2 & 3 Solver:
  // a1 x + b1 y = c1
  // a2 x + b2 y = c2
  const detD = lab2XCoeff1 * lab2YCoeff2 - lab2XCoeff2 * lab2YCoeff1;
  const detDx = lab2Const1 * lab2YCoeff2 - lab2Const2 * lab2YCoeff1;
  const detDy = lab2XCoeff1 * lab2Const2 - lab2XCoeff2 * lab2Const1;
  const solX = detD !== 0 ? (detDx / detD).toFixed(2) : 'N/A';
  const solY = detD !== 0 ? (detDy / detD).toFixed(2) : 'N/A';

  // Calculations for Lab 3:
  // a1 x + b1 y + c1 = 0
  // a2 x + b2 y + c2 = 0
  const crossTermX = lab3B1 * lab3C2 - lab3B2 * lab3C1;
  const crossTermY = lab3C1 * lab3A2 - lab3C2 * lab3A1;
  const crossTerm1 = lab3A1 * lab3B2 - lab3A2 * lab3B1;
  const crossX = crossTerm1 !== 0 ? (crossTermX / crossTerm1).toFixed(2) : 'N/A';
  const crossY = crossTerm1 !== 0 ? (crossTermY / crossTerm1).toFixed(2) : 'N/A';

  // Calculations for Lab 5:
  const downstreamSpeed = lab5BoatSpeed + lab5StreamSpeed;
  const upstreamSpeed = Math.max(0, lab5BoatSpeed - lab5StreamSpeed);
  const downstreamDist = downstreamSpeed * lab5TimeHours;
  const upstreamDist = upstreamSpeed * lab5TimeHours;

  // Handle Challenges
  const handleCheckChallenge1 = () => {
    // x + y = 10, x - y = 4 -> x = 7
    const trimmed = userAns1.trim();
    setIsAns1Correct(trimmed === '7' || trimmed === '৭');
  };

  const handleCheckChallenge2 = () => {
    // 2x + y = 8, x - y = 1 -> 3x = 9 => x = 3, y = 2
    const trimmed = userAns2.trim();
    setIsAns2Correct(trimmed === '2' || trimmed === '২');
  };

  const handleCheckChallenge3 = () => {
    // u = 10, v = 2 -> downstream = 12 km/h * 3h = 36 km
    const trimmed = userAns3.trim();
    setIsAns3Correct(trimmed === '36' || trimmed === '৩৬');
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
      let reply =
        'চমৎকার প্রশ্ন! দুই চলকবিশিষ্ট সরল সহসমীকরণে প্রতিস্থাপন, অপনয়ন ও আড়গুণন পদ্ধতির মধ্যে সবচেয়ে দ্রুততম হলো আড়গুণন পদ্ধতি।';
      if (textToSend.includes('শর্ত') || textToSend.includes('প্রকৃতি') || textToSend.includes('কয়টি সমাধান')) {
        reply =
          'সহসমীকরণের ৩টি গোল্ডেন শর্ত:\n১. a₁/a₂ ≠ b₁/b₂ হলে সমঞ্জস, অনির্ভরশীল এবং একটিমাত্র অনন্য সমাধান।\n২. a₁/a₂ = b₁/b₂ = c₁/c₂ হলে সমঞ্জস, নির্ভরশীল এবং অসংখ্য সমাধান।\n৩. a₁/a₂ = b₁/b₂ ≠ c₁/c₂ হলে অসমঞ্জস এবং কোনো সমাধান নেই (সমান্তরাল রেখা)।';
      } else if (textToSend.includes('আড়গুণন') || textToSend.includes('বজ্রগুণন')) {
        reply =
          'আড়গুণন করার আগে নিশ্চিত করুন ধ্রুবক পদ বামপাশে এনে সমীকরণের ডানপাশ শূন্য করা হয়েছে (a₁x + b₁y + c₁ = 0)। এরপর ডায়াগনাল সূত্রে: x/(b₁c₂ - b₂c₁) = y/(c₁a₂ - c₂a₁) = 1/(a₁b₂ - a₂b₁)।';
      } else if (textToSend.includes('নৌকা') || textToSend.includes('স্রোত')) {
        reply =
          'নৌকা ও স্রোতের সহজ সূত্র: অনুকূলে বেগ = নৌকার বেগ + স্রোতের বেগ (u + v)। প্রতিকূলে বেগ = নৌকার বেগ - স্রোতের বেগ (u - v)। সমীকরণ দুটি যোগ করলেই সরাসরি নৌকার বেগ u = (অনুকূল + প্রতিকূল)/২ পাওয়া যায়!';
      }

      setAiChatMessages((prev) => [
        ...prev,
        { sender: 'sheru', text: reply, time: 'এইমাত্র' },
      ]);
    }, 600);
  };

  const handleCopyCheatSheet = () => {
    const text = `NCTB নবম-দশম সাধারণ গণিত • অধ্যায় ১২: দুই চলকবিশিষ্ট সরল সহসমীকরণ
১. সমীকরণ জোটের ৩টি মৌলিক শর্তাবলি:
   • a₁/a₂ ≠ b₁/b₂ ⇒ সমঞ্জস, অনির্ভরশীল, ১টি অনন্য সমাধান
   • a₁/a₂ = b₁/b₂ = c₁/c₂ ⇒ সমঞ্জস, নির্ভরশীল, অসংখ্য সমাধান
   • a₁/a₂ = b₁/b₂ ≠ c₁/c₂ ⇒ অসমঞ্জস, অনির্ভরশীল, কোনো সমাধান নেই (সমান্তরাল রেখা)
২. আড়গুণন (বজ্রগুণন) সূত্র:
   • a₁x + b₁y + c₁ = 0 এবং a₂x + b₂y + c₂ = 0
   • x / (b₁c₂ - b₂c₁) = y / (c₁a₂ - c₂a₁) = 1 / (a₁b₂ - a₂b₁)
৩. নৌকা ও স্রোতের গতিবেগ সূত্র:
   • অনুকূলে বেগ = u + v = দূরত্ব / সময়₁
   • প্রতিকূলে বেগ = u - v = দূরত্ব / সময়₂
   • স্থির পানিতে নৌকার বেগ u = (অনুকূল বেগ + প্রতিকূল বেগ) / ২
   • স্রোতের বেগ v = (অনুকূল বেগ - প্রতিকূল বেগ) / ২`;
    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* -------------------------------------------------------------------- */}
      {/* HEADER SECTION (Top Navigation & Breadcrumb) */}
      {/* -------------------------------------------------------------------- */}
      <GuidebookHeaderNav
        subjectKey="math"
        subjectNameBn="সাধারণ গণিত"
        chapterNum={12}
        chapterTitleBn="দুই চলকবিশিষ্ট সরল সহসমীকরণ (Simultaneous Linear Equations)"
        activeLesson={activeLabId}
        activeLessonTitle={LAB_LESSONS.find((l) => l.id === activeLabId)?.title}
        onOpenAi={() => setIsAiDrawerOpen(true)}
        aiButtonLabel="শেরু এআই টিউটর"
      />

      {/* 5-Step Learning Framework Navigation Sub-Bar */}
      <div className="border-b border-border bg-card/90 backdrop-blur-md sticky top-[49px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700/60 overflow-x-auto w-fit">
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
            {/* LAB 1: সহসমীকরণের প্রকৃতি ও শর্তাবলি ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls & Preset Buttons (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-primary" />
                      সহসমীকরণের সহগ ইনপুট
                    </h3>
                  </div>

                  {/* 3 Quick NCTB Presets */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => setLab1Preset('unique')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        lab1Case === 'unique'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      একটি সমাধান
                    </button>
                    <button
                      onClick={() => setLab1Preset('infinite')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        lab1Case === 'infinite'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      অসংখ্য সমাধান
                    </button>
                    <button
                      onClick={() => setLab1Preset('none')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        lab1Case === 'none'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      সমাধান নেই
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Equation 1 inputs */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-primary">১ম সমীকরণ: a₁x + b₁y = c₁</span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500">a₁:</label>
                          <input
                            type="number"
                            value={lab1A1}
                            onChange={(e) => setLab1A1(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">b₁:</label>
                          <input
                            type="number"
                            value={lab1B1}
                            onChange={(e) => setLab1B1(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">c₁:</label>
                          <input
                            type="number"
                            value={lab1C1}
                            onChange={(e) => setLab1C1(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Equation 2 inputs */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ২য় সমীকরণ: a₂x + b₂y = c₂
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500">a₂:</label>
                          <input
                            type="number"
                            value={lab1A2}
                            onChange={(e) => setLab1A2(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">b₂:</label>
                          <input
                            type="number"
                            value={lab1B2}
                            onChange={(e) => setLab1B2(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">c₂:</label>
                          <input
                            type="number"
                            value={lab1C2}
                            onChange={(e) => setLab1C2(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ratio comparison card */}
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono text-slate-800 dark:text-slate-200 space-y-1">
                    <p className="font-bold text-primary">সহগ অনুপাত তুলনা:</p>
                    <p>• a₁/a₂ = {lab1A1}/{lab1A2} ≈ {ratioA}</p>
                    <p>• b₁/b₂ = {lab1B1}/{lab1B2} ≈ {ratioB}</p>
                    <p>• c₁/c₂ = {lab1C1}/{lab1C2} ≈ {ratioC}</p>
                  </div>
                </div>

                {/* Right Consistency & Behavior Visualizer (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      সমীকরণ জোটের প্রকৃতি ও ফলাফল বিশ্লেষণ
                    </h3>

                    {/* Result Status Card */}
                    <div
                      className={`p-5 rounded-2xl border ${
                        lab1Case === 'unique'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                          : lab1Case === 'infinite'
                          ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                          : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                            lab1Case === 'unique'
                              ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                              : lab1Case === 'infinite'
                              ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                          }`}
                        >
                          {lab1Case === 'unique' && 'কেস ১: একটিমাত্র অনন্য সমাধান'}
                          {lab1Case === 'infinite' && 'কেস ২: অসংখ্য সমাধান'}
                          {lab1Case === 'none' && 'কেস ৩: কোনো সমাধান নেই'}
                        </span>

                        <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                          {lab1Case === 'unique' && 'a₁/a₂ ≠ b₁/b₂'}
                          {lab1Case === 'infinite' && 'a₁/a₂ = b₁/b₂ = c₁/c₂'}
                          {lab1Case === 'none' && 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-slate-800 dark:text-slate-200">
                        {lab1Case === 'unique' && (
                          <>
                            <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">
                              ✓ সমঞ্জস (Consistent) ও পরস্পর অনির্ভরশীল (Independent)
                            </p>
                            <p>
                              যেহেতু x ও y এর সহগ অনুপাত অসমান ({ratioA} ≠ {ratioB}), সেহেতু লেখচিত্রে রেখা দুটি পরস্পরকে ঠিক একটি বিন্দুতে ছেদ করবে। সমীকরণ জোটের একটিমাত্র বাস্তব সমাধান বিদ্যমান।
                            </p>
                          </>
                        )}
                        {lab1Case === 'infinite' && (
                          <>
                            <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                              ✓ সমঞ্জস (Consistent) ও পরস্পর নির্ভরশীল (Dependent)
                            </p>
                            <p>
                              যেহেতু সব অনুপাত হুবহু সমান ({ratioA} = {ratioB} = {ratioC}), সেহেতু দুটি সমীকরণ মূলত একই সরলরেখাকে নির্দেশ করে। এরা পরস্পরের উপর সমাপতিত (Coincident) হয়ে অসংখ্য সাধারণ বিন্দু তৈরি করে।
                            </p>
                          </>
                        )}
                        {lab1Case === 'none' && (
                          <>
                            <p className="font-semibold text-rose-700 dark:text-rose-300 text-sm">
                              ✕ অসমঞ্জস (Inconsistent) ও পরস্পর অনির্ভরশীল
                            </p>
                            <p>
                              সহগ অনুপাত সমান কিন্তু ধ্রুবক অনুপাত ভিন্ন ({ratioA} = {ratioB} ≠ {ratioC})। এর ফলে লেখচিত্রে রেখা দুটি পরস্পর সমান্তরাল (Parallel) থাকে এবং কোনো সাধারণ ছেদবিন্দু নেই। অর্থাৎ কোনো সমাধান বিদ্যমান নেই।
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">বোর্ড এমসিকিউ মাস্টার টিপ:</span> এসএসসি পরীক্ষায় প্রতি বছর এই ৩টি শর্ত থেকে অন্তত ১টি এমসিকিউ আসে। মনে রাখবেন: সমান্তরাল রেখা মানে কোনো সমাধান নেই (অসমঞ্জস)!
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 2: প্রতিস্থাপন ও অপনয়ন ডুয়েল ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controller (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Divide className="w-4 h-4 text-primary" />
                      পদ্ধতি নির্বাচন ও সমীকরণ ইনপুট
                    </h3>
                  </div>

                  {/* Method toggle */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setLab2Method('substitution')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        lab2Method === 'substitution'
                          ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      প্রতিস্থাপন পদ্ধতি
                    </button>
                    <button
                      onClick={() => setLab2Method('elimination')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        lab2Method === 'elimination'
                          ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      অপনয়ন পদ্ধতি
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="text-xs font-semibold text-primary">১ম সমীকরণ: {lab2XCoeff1}x + {lab2YCoeff1}y = {lab2Const1}</p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        ২য় সমীকরণ: {lab2XCoeff2}x + ({lab2YCoeff2}y) = {lab2Const2}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        সরাসরি সমাধান বিন্দু (x, y):
                      </p>
                      <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">
                        (x, y) = ({solX}, {solY})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Step-by-Step Derivation Flow (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-primary" />
                      ধাপে ধাপে সমাধান প্রক্রিয়া ({lab2Method === 'substitution' ? 'প্রতিস্থাপন' : 'অপনয়ন'})
                    </h3>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 space-y-2.5">
                      {lab2Method === 'substitution' ? (
                        <>
                          <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-primary font-bold">ধাপ ১: ১নং সমীকরণ থেকে y কে x এর মাধ্যমে প্রকাশ —</span>
                            <p className="mt-1">
                              {lab2XCoeff1}x + {lab2YCoeff1}y = {lab2Const1} ⇒ {lab2YCoeff1}y = {lab2Const1} - {lab2XCoeff1}x
                            </p>
                            <p className="text-slate-500">
                              ⇒ y = ({lab2Const1} - {lab2XCoeff1}x) / {lab2YCoeff1}  --- (৩)
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-primary font-bold">ধাপ ২: ২নং সমীকরণে y এর মান প্রতিস্থাপন —</span>
                            <p className="mt-1">
                              {lab2XCoeff2}x + {lab2YCoeff2}[({lab2Const1} - {lab2XCoeff1}x) / {lab2YCoeff1}] = {lab2Const2}
                            </p>
                            <p className="text-slate-500">
                              এক চলকে সরল করে পাই: x = {solX}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
                            <span className="font-bold">ধাপ ৩: (৩) নং সমীকরণে x এর মান বসিয়ে y নির্ণয় —</span>
                            <p className="mt-1 font-bold">
                              y = ({lab2Const1} - {lab2XCoeff1} × {solX}) / {lab2YCoeff1} = {solY}
                            </p>
                            <p className="mt-0.5">∴ নির্ণেয় সমাধান (x, y) = ({solX}, {solY})</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-primary font-bold">ধাপ ১: y এর সহগ সমতাকরণ —</span>
                            <p className="mt-1">
                              (১) নং সমীকরণকে {Math.abs(lab2YCoeff2)} দ্বারা গুণ: {lab2XCoeff1 * Math.abs(lab2YCoeff2)}x + {lab2YCoeff1 * Math.abs(lab2YCoeff2)}y = {lab2Const1 * Math.abs(lab2YCoeff2)}
                            </p>
                            <p className="text-slate-500">
                              (২) নং সমীকরণকে {Math.abs(lab2YCoeff1)} দ্বারা গুণ: {lab2XCoeff2 * Math.abs(lab2YCoeff1)}x - {Math.abs(lab2YCoeff2) * Math.abs(lab2YCoeff1)}y = {lab2Const2 * Math.abs(lab2YCoeff1)}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-primary font-bold">ধাপ ২: সমীকরণদ্বয় যোগ করে y অপনয়ন —</span>
                            <p className="mt-1">
                              ({lab2XCoeff1 * Math.abs(lab2YCoeff2) + lab2XCoeff2 * Math.abs(lab2YCoeff1)})x = {lab2Const1 * Math.abs(lab2YCoeff2) + lab2Const2 * Math.abs(lab2YCoeff1)}
                            </p>
                            <p className="text-slate-500">
                              ⇒ x = {solX}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
                            <span className="font-bold">ধাপ ৩: x এর মান বসিয়ে y নির্ণয় —</span>
                            <p className="mt-1 font-bold">
                              {lab2XCoeff1}({solX}) + {lab2YCoeff1}y = {lab2Const1} ⇒ y = {solY}
                            </p>
                            <p className="mt-0.5">∴ নির্ণেয় সমাধান (x, y) = ({solX}, {solY})</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-primary">পরীক্ষকের পছন্দের পদ্ধতি:</span> সহগ যদি ভগ্নাংশ হয় তবে অপনয়ন পদ্ধতি দ্রুততম; আর একটি চলকের সহগ ১ হলে প্রতিস্থাপন পদ্ধতি সবচেয়ে পরিচ্ছন্ন।
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 3: আড়গুণন বা বজ্রগুণন ম্যাট্রিক্স ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controller (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Grid className="w-4 h-4 text-primary" />
                    আড়গুণন সমীকরণ ইনপুট (a₁x + b₁y + c₁ = 0)
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-primary">১ম সমীকরণ সহগ:</span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500">a₁:</label>
                          <input
                            type="number"
                            value={lab3A1}
                            onChange={(e) => setLab3A1(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">b₁:</label>
                          <input
                            type="number"
                            value={lab3B1}
                            onChange={(e) => setLab3B1(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">c₁:</label>
                          <input
                            type="number"
                            value={lab3C1}
                            onChange={(e) => setLab3C1(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">২য় সমীকরণ সহগ:</span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500">a₂:</label>
                          <input
                            type="number"
                            value={lab3A2}
                            onChange={(e) => setLab3A2(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">b₂:</label>
                          <input
                            type="number"
                            value={lab3B2}
                            onChange={(e) => setLab3B2(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500">c₂:</label>
                          <input
                            type="number"
                            value={lab3C2}
                            onChange={(e) => setLab3C2(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">সতর্কতা:</span> সমীকরণের ধ্রুবক পদকে সর্বদা বামপাশে এনে ডানপাশ = 0 রাখতে হবে! যেমন: 2x + 3y = 7 হলে c₁ = -7 লিখতে হবে।
                  </div>
                </div>

                {/* Right Matrix & Solution Display (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Scale className="w-4 h-4 text-primary" />
                      আড়গুণন ম্যাট্রিক্স ও সমাধান
                    </h3>

                    {/* Matrix visual */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-center">
                      <div className="grid grid-cols-4 gap-2 text-xs border-b border-slate-200 dark:border-slate-800 pb-2 font-bold text-primary">
                        <span>b₁ ({lab3B1})</span>
                        <span>c₁ ({lab3C1})</span>
                        <span>a₁ ({lab3A1})</span>
                        <span>b₁ ({lab3B1})</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <span>b₂ ({lab3B2})</span>
                        <span>c₂ ({lab3C2})</span>
                        <span>a₂ ({lab3A2})</span>
                        <span>b₂ ({lab3B2})</span>
                      </div>
                    </div>

                    {/* Step formulas */}
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs font-mono text-slate-800 dark:text-slate-200">
                      <p className="font-bold text-primary">সূত্র প্রয়োগ:</p>
                      <p>
                        x / ({lab3B1} × {lab3C2} - {lab3B2} × {lab3C1}) = y / ({lab3C1} × {lab3A2} - {lab3C2} × {lab3A1}) = 1 / ({lab3A1} × {lab3B2} - {lab3A2} × {lab3B1})
                      </p>
                      <p className="text-slate-500">
                        ⇒ x / ({crossTermX}) = y / ({crossTermY}) = 1 / ({crossTerm1})
                      </p>
                      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        <span>x = {crossTermX} / {crossTerm1} = {crossX}</span>
                        <span>y = {crossTermY} / {crossTerm1} = {crossY}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">বোর্ড নিয়ম:</span> আড়গুণনে x এর ক্ষেত্রে b ও c এর সহগ, y এর ক্ষেত্রে c ও a এর সহগ এবং ধ্রুবক ১ এর ক্ষেত্রে a ও b এর সহগ নিতে হয়।
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 4: লেখচিত্র ও ছেদবিন্দু সিমুলেটর ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Coordinate Table (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Grid className="w-4 h-4 text-primary" />
                    লেখচিত্রের বিন্দু সারণি (Coordinate Table)
                  </h3>

                  <div className="space-y-4">
                    {/* Line 1 points */}
                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        রেখা ১: 2x + 3y = 7 ⇒ y = (7 - 2x) / 3
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border">
                          <span>x = -1</span>
                          <p className="font-bold text-primary">y = 3</p>
                        </div>
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border">
                          <span>x = 2</span>
                          <p className="font-bold text-primary">y = 1</p>
                        </div>
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border">
                          <span>x = 5</span>
                          <p className="font-bold text-primary">y = -1</p>
                        </div>
                      </div>
                    </div>

                    {/* Line 2 points */}
                    <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        রেখা ২: 3x - 2y = 4 ⇒ y = (3x - 4) / 2
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border">
                          <span>x = 0</span>
                          <p className="font-bold text-emerald-600">y = -2</p>
                        </div>
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border">
                          <span>x = 2</span>
                          <p className="font-bold text-emerald-600">y = 1</p>
                        </div>
                        <div className="p-1.5 rounded bg-white dark:bg-slate-900 border">
                          <span>x = 4</span>
                          <p className="font-bold text-emerald-600">y = 4</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-slate-800 dark:text-slate-200">
                    <p className="font-bold text-primary">ছেদবিন্দুর স্থানাঙ্ক:</p>
                    <p className="mt-1 text-sm font-mono font-bold">P(x, y) = (2, 1)</p>
                    <p className="text-slate-500 mt-0.5">রেখাদ্বয়ের সাধারণ ছেদবিন্দুই হলো নির্ণেয় সমাধান।</p>
                  </div>
                </div>

                {/* Right Interactive SVG Coordinate Plane (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Compass className="w-4 h-4 text-primary" />
                      কার্তেসীয় সমতল ও ছেদবিন্দু P(2, 1)
                    </h3>

                    {/* SVG Graph Plane */}
                    <div className="relative w-full aspect-16/10 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                      <svg viewBox="-8 -6 16 12" className="w-full h-full select-none">
                        {/* Grid lines */}
                        {[-6, -4, -2, 2, 4, 6].map((i) => (
                          <g key={i}>
                            <line x1={i} y1="-6" x2={i} y2="6" stroke="#334155" strokeWidth="0.05" />
                            <line x1="-8" y1={i} x2="8" y2={i} stroke="#334155" strokeWidth="0.05" />
                          </g>
                        ))}

                        {/* Axes */}
                        <line x1="-8" y1="0" x2="8" y2="0" stroke="#94a3b8" strokeWidth="0.12" />
                        <line x1="0" y1="-6" x2="0" y2="6" stroke="#94a3b8" strokeWidth="0.12" />

                        {/* Line 1 (Blue): 2x + 3y = 7 => y = (7 - 2x)/3 */}
                        {/* x=-6 => y=6.33, x=7 => y=-2.33 */}
                        <line x1="-6" y1="6.33" x2="7" y2="-2.33" stroke="#3b82f6" strokeWidth="0.18" />

                        {/* Line 2 (Emerald): 3x - 2y = 4 => y = (3x - 4)/2 */}
                        {/* x=-2 => y=-5, x=5 => y=5.5 */}
                        <line x1="-2" y1="-5" x2="5" y2="5.5" stroke="#10b981" strokeWidth="0.18" />

                        {/* Intersection Point P(2, 1) */}
                        <circle cx="2" cy="1" r="0.3" fill="#f43f5e" />
                        <circle cx="2" cy="1" r="0.6" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                        <text x="2.5" y="1.5" fill="#f43f5e" fontSize="0.7" fontWeight="bold">
                          P(2, 1)
                        </text>

                        {/* Line labels */}
                        <text x="-5" y="4.5" fill="#3b82f6" fontSize="0.5">
                          2x + 3y = 7
                        </text>
                        <text x="3" y="4" fill="#10b981" fontSize="0.5">
                          3x - 2y = 4
                        </text>
                      </svg>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">লেখচিত্রের ৩টি নিয়ম:</span> ১. ছক কাগজের ক্ষুদ্রতম বর্গের বাহুর একক নির্ধারণ, ২. ন্যূনতম ৩টি পূর্ণসংখ্যার বিন্দু নির্বাচন, ৩. ছেদবিন্দুর স্থানাঙ্ক লিখে উত্তর নিশ্চিতকরণ।
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* LAB 5: বাস্তব সমস্যা: নৌকা ও স্রোতের বেগ ল্যাব */}
            {/* -------------------------------------------------------------- */}
            {activeLabId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls (5 cols) */}
                <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Ship className="w-4 h-4 text-primary" />
                    নৌকা ও স্রোতের প্যারামিটার
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>স্থির পানিতে নৌকার বেগ u (কিমি/ঘণ্টা):</span>
                        <span className="font-mono text-primary font-bold">{lab5BoatSpeed}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        step="1"
                        value={lab5BoatSpeed}
                        onChange={(e) => setLab5BoatSpeed(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>স্রোতের বেগ v (কিমি/ঘণ্টা):</span>
                        <span className="font-mono text-primary font-bold">{lab5StreamSpeed}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={lab5StreamSpeed}
                        onChange={(e) => setLab5StreamSpeed(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>সময় t (ঘণ্টা):</span>
                        <span className="font-mono text-primary font-bold">{lab5TimeHours}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={lab5TimeHours}
                        onChange={(e) => setLab5TimeHours(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">অনুকূলে কার্যকর বেগ (u + v):</span>
                      <span className="font-mono font-bold text-emerald-600">{downstreamSpeed} কিমি/ঘণ্টা</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">প্রতিকূলে কার্যকর বেগ (u - v):</span>
                      <span className="font-mono font-bold text-rose-600">{upstreamSpeed} কিমি/ঘণ্টা</span>
                    </div>
                  </div>
                </div>

                {/* Right Physics & Simultaneous Equations Display (7 cols) */}
                <div className="lg:col-span-7 space-y-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      সমীকরণ গঠন ও অতিক্রান্ত দূরত্বের তুলনা
                    </h3>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-emerald-600">স্রোতের অনুকূলে {lab5TimeHours} ঘণ্টায় দূরত্ব:</span>
                          <p className="text-sm font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                            d₁ = (u + v) × t = ({lab5BoatSpeed} + {lab5StreamSpeed}) × {lab5TimeHours}
                          </p>
                        </div>
                        <span className="text-xl font-bold font-mono text-emerald-600">{downstreamDist} কিমি</span>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-rose-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-rose-600">স্রোতের প্রতিকূলে {lab5TimeHours} ঘণ্টায় দূরত্ব:</span>
                          <p className="text-sm font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                            d₂ = (u - v) × t = ({lab5BoatSpeed} - {lab5StreamSpeed}) × {lab5TimeHours}
                          </p>
                        </div>
                        <span className="text-xl font-bold font-mono text-rose-600">{upstreamDist} কিমি</span>
                      </div>
                    </div>

                    {/* Algebraic derivation card */}
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5 text-xs font-mono text-slate-800 dark:text-slate-200">
                      <p className="font-bold text-primary">সহসমীকরণ থেকে সরাসরি মান নির্ণয়:</p>
                      <p>u + v = {downstreamSpeed} এবং u - v = {upstreamSpeed}</p>
                      <p>যোগ করে: 2u = {downstreamSpeed + upstreamSpeed} ⇒ u = {lab5BoatSpeed} কিমি/ঘণ্টা (নৌকার বেগ)</p>
                      <p>বিয়োগ করে: 2v = {downstreamSpeed - upstreamSpeed} ⇒ v = {lab5StreamSpeed} কিমি/ঘণ্টা (স্রোতের বেগ)</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">শর্টকাট কৌশল:</span> যেকোনো পরীক্ষায় অনুকূল বেগ ও প্রতিকূল বেগ দেওয়া থাকলে তাদের যোগফলের অর্ধেকই হলো নৌকার বেগ এবং বিয়োগফলের অর্ধেকই হলো স্রোতের বেগ!
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
                    চ্যালেঞ্জ ০১: সরল সহসমীকরণ সমাধান
                  </span>
                  {isAns1Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  x + y = 10 এবং x - y = 4 হলে x এর মান কত?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns1}
                    onChange={(e) => {
                      setUserAns1(e.target.value);
                      setIsAns1Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 7)"
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
                    চ্যালেঞ্জ ০২: অপনয়ন সমাধান
                  </span>
                  {isAns2Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  2x + y = 8 এবং x - y = 1 হলে y এর মান কত?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns2}
                    onChange={(e) => {
                      setUserAns2(e.target.value);
                      setIsAns2Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 2)"
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
                    চ্যালেঞ্জ ০৩: নৌকা ও স্রোতের দূরত্ব
                  </span>
                  {isAns3Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  স্থির পানিতে নৌকার বেগ ১০ কিমি/ঘণ্টা এবং স্রোতের বেগ ২ কিমি/ঘণ্টা হলে স্রোতের অনুকূলে ৩ ঘণ্টায় নৌকাটি কত কিমি যাবে?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns3}
                    onChange={(e) => {
                      setUserAns3(e.target.value);
                      setIsAns3Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 36)"
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
                  অধ্যায় ১২ কুইজ ও আত্মযাচাই
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
                  অধ্যায় ১২: দুই চলকবিশিষ্ট সরল সহসমীকরণ রিভিশন চিট-শীট
                </h2>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                  পরীক্ষার আগের রাতের জন্য এনসিটিবি সিলেবাসের সমস্ত মৌলিক সূত্র, শর্ত সারণি ও সমাধান নিয়মের সারসংক্ষেপ।
                </p>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  সহসমীকরণের ৩টি গোল্ডেন শর্ত
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • a₁/a₂ ≠ b₁/b₂ ⇒ সমঞ্জস, অনির্ভরশীল, ১টি সমাধান<br />
                  • a₁/a₂ = b₁/b₂ = c₁/c₂ ⇒ সমঞ্জস, নির্ভরশীল, অসংখ্য সমাধান<br />
                  • a₁/a₂ = b₁/b₂ ≠ c₁/c₂ ⇒ অসমঞ্জস, সমাধান নেই (সমান্তরাল)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                  আড়গুণন (বজ্রগুণন) সূত্র
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • রূপ: a₁x + b₁y + c₁ = 0 এবং a₂x + b₂y + c₂ = 0<br />
                  • x / (b₁c₂ - b₂c₁) = y / (c₁a₂ - c₂a₁) = 1 / (a₁b₂ - a₂b₁)<br />
                  • x = (b₁c₂ - b₂c₁) / (a₁b₂ - a₂b₁)<br />
                  • y = (c₁a₂ - c₂a₁) / (a₁b₂ - a₂b₁)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                  প্রতিস্থাপন ও অপনয়ন কৌশল
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • প্রতিস্থাপন: একটি চলক অন্যটির মাধ্যমে প্রকাশ করে স্থানান্তর<br />
                  • অপনয়ন: চলকের সহগ সমতাকরণ করে যোগ বা বিয়োগ<br />
                  • লেখচিত্র: ৩টি করে পূর্ণসংখ্যার বিন্দু ও সাধারণ ছেদবিন্দু P(x, y)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold">
                  নৌকা ও স্রোতের বেগ সমস্যা
                </span>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  • অনুকূলে কার্যকর বেগ = u + v (যোগ)<br />
                  • প্রতিকূলে কার্যকর বেগ = u - v (বিয়োগ)<br />
                  • স্থির পানিতে নৌকার বেগ u = (অনুকূল + প্রতিকূল) / ২<br />
                  • স্রোতের বেগ v = (অনুকূল - প্রতিকূল) / ২
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
{`১. সমীকরণ জোটের ৩টি শর্ত:
   • a₁/a₂ ≠ b₁/b₂ ⇒ সমঞ্জস, অনির্ভরশীল, ১টি অনন্য সমাধান
   • a₁/a₂ = b₁/b₂ = c₁/c₂ ⇒ সমঞ্জস, নির্ভরশীল, অসংখ্য সমাধান
   • a₁/a₂ = b₁/b₂ ≠ c₁/c₂ ⇒ অসমঞ্জস, কোনো সমাধান নেই (সমান্তরাল)
২. আড়গুণন সূত্র:
   • a₁x + b₁y + c₁ = 0 এবং a₂x + b₂y + c₂ = 0
   • x/(b₁c₂ - b₂c₁) = y/(c₁a₂ - c₂a₁) = 1/(a₁b₂ - a₂b₁)
৩. নৌকা ও স্রোতের গতিবেগ:
   • অনুকূলে বেগ = u + v, প্রতিকূলে বেগ = u - v
   • নৌকার বেগ u = (অনুকূল + প্রতিকূল) / ২
   • স্রোতের বেগ v = (অনুকূল - প্রতিকূল) / ২`}
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
                    শেরু AI সরল সহসমীকরণ গাইড
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    সক্রিয় • সহসমীকরণ ও লেখচিত্র বিশেষজ্ঞ
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
                onClick={() => handleSendAiPrompt('সহসমীকরণের ৩টি শর্ত কী কী?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 hover:border-primary"
              >
                ৩টি শর্ত কী?
              </button>
              <button
                onClick={() => handleSendAiPrompt('আড়গুণন কীভাবে করতে হয়?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 hover:border-primary"
              >
                আড়গুণন নিয়ম?
              </button>
              <button
                onClick={() => handleSendAiPrompt('নৌকা ও স্রোতের বেগ কীভাবে বের করে?')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shrink-0 hover:border-primary"
              >
                নৌকা-স্রোতের বেগ?
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
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
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
                placeholder="সহসমীকরণ সম্পর্কিত প্রশ্ন লিখুন..."
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
