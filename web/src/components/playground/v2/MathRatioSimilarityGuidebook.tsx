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
  Shapes,
  Triangle,
  RotateCw,
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
    title: 'থেলিসের উপপাদ্য ও সমান্তরাল রেখা বিভাজন ল্যাব',
    subtitle: "Thales's Theorem 28 & Line Segment Proportionality",
    nctbPage: 'অনুশীলনী ১৪.১ • পৃষ্ঠা ২৭৫',
    badge: 'উপপাদ্য ২৮',
    intro:
      'ত্রিভুজের যেকোনো এক বাহুর সমান্তরাল সরলরেখা অন্য দুই বাহুকে বা তাদের বর্ধিতাংশকে সমান অনুপাতে বিভক্ত করে (AD/DB = AE/EC)। রেখা DE কে স্থানান্তর করে অনুপাতের ধ্রুব সত্য প্রত্যক্ষ করুন।',
  },
  {
    id: 2,
    title: 'কোণের অন্তঃসমদ্বিখণ্ডক ও অনুপাত বিভাজক ল্যাব',
    subtitle: 'Angle Bisector Theorem 30 & Opposite Side Ratio',
    nctbPage: 'অনুশীলনী ১৪.১ • পৃষ্ঠা ২৭৯',
    badge: 'উপপাদ্য ৩০',
    intro:
      'ত্রিভুজের যেকোনো কোণের অন্তঃসমদ্বিখণ্ডক বিপরীত বাহুকে সংলগ্ন বাহুদ্বয়ের অনুপাতে অন্তঃবিভক্ত করে (BD/DC = AB/AC)। বাহুর দৈর্ঘ্য পরিবর্তন করে স্পর্শক বিন্দুর অবস্থান পর্যবেক্ষণ করুন।',
  },
  {
    id: 3,
    title: 'সদৃশকোণী ত্রিভুজ ও অনুরূপ বাহুর সমানুপাত ল্যাব',
    subtitle: 'Equiangular Similar Triangles & Side Ratio Scaler',
    nctbPage: 'অনুশীলনী ১৪.২ • পৃষ্ঠা ২৮৪',
    badge: 'উপপাদ্য ৩২',
    intro:
      'দুটি ত্রিভুজ সদৃশকোণী (Equiangular) হলে তাদের অনুরূপ বাহুগুলো সমানুপাতিক হয় (AB/DE = BC/EF = AC/DF = k)। স্কেল ফ্যাক্টর পরিবর্তনের সাথে অনুরূপ বাহুর সামঞ্জস্য লক্ষ্য করুন।',
  },
  {
    id: 4,
    title: 'সদৃশ ত্রিভুজ ক্ষেত্রফল বনাম বাহুর বর্গ ল্যাব',
    subtitle: 'Area of Similar Triangles Ratio Theorem 33',
    nctbPage: 'অনুশীলনী ১৪.২ • পৃষ্ঠা ২৮৮',
    badge: 'বোর্ড CQ স্টার',
    intro:
      'দুটি সদৃশ ত্রিভুজের ক্ষেত্রফলের অনুপাত তাদের যেকোনো দুই অনুরূপ বাহুর বর্গের অনুপাতের সমান: Δ₁/Δ₂ = (a₁/a₂)²। বাহুর অনুপাত ২ হলে ক্ষেত্রফল ৪ গুণ এবং বাহুর অনুপাত ৩ হলে ক্ষেত্রফল ৯ গুণ হয়!',
  },
  {
    id: 5,
    title: 'রৈখিক ও ঘূর্ণন প্রতিসমতা ল্যাব',
    subtitle: 'Line of Symmetry & Rotational Symmetry Orders',
    nctbPage: 'অনুশীলনী ১৪.৩ • পৃষ্ঠা ২৯৪',
    badge: 'প্রতিসমতা মাস্টার',
    intro:
      'সমবাহু ত্রিভুজ, বর্গক্ষেত্র, আয়তক্ষেত্র ও বৃত্তের প্রতিসাম্য রেখা এবং ঘূর্ণন কোণ ও ঘূর্ণন প্রতিসমতার মাত্রা (Order of Symmetry) নির্ণয়ের ইন্টারেক্টিভ সিমুলেটর।',
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
    boardSource: 'ঢাকা বোর্ড ২০২৪ / চট্টগ্রাম বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'ΔABC এ DE ∥ BC, যেখানে D ও E যথাক্রমে AB ও AC বাহুর ওপর অবস্থিত। AD = ৬ সেমি, DB = ৩ সেমি এবং AE = ৮ সেমি।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'EC এর দৈর্ঘ্য নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, ΔABC এ DE ∥ BC।',
          'থেলিসের উপপাদ্য (উপপাদ্য ২৮) অনুসারে:',
          'AD / DB = AE / EC',
          'বা, ৬ / ৩ = ৮ / EC',
          'বা, ২ = ৮ / EC',
          'বা, EC = ৮ / ২ = ৪ সেমি।',
          'অতএব, EC এর দৈর্ঘ্য ৪ সেমি।',
        ],
        examinerSecret:
          'উপপাদ্য ২৮ এর সূত্রের নাম ও সমীকরণ উল্লেখ করে মান বসালে ২/২ নম্বর নিশ্চিত।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, AD / DB = AE / EC।',
        solution: [
          'বিশেষ নির্বচন: মনে করি, ΔABC এর BC বাহুর সমান্তরাল সরলরেখা DE, AB ও AC বাহুকে যথাক্রমে D ও E বিন্দুতে ছেদ করেছে। প্রমাণ করতে হবে যে, AD/DB = AE/EC।',
          'অঙ্কন: B, E এবং C, D যোগ করি। E বিন্দু থেকে AB এর ওপর EM ⊥ AB এবং D বিন্দু থেকে AC এর ওপর DN ⊥ AC লম্ব টানি।',
          'প্রমাণ:',
          'ধাপ ১: ΔADE / ΔBDE = (½ × AD × EM) / (½ × DB × EM) = AD / DB  --- (১)',
          'ধাপ ২: ΔADE / ΔCDE = (½ × AE × DN) / (½ × EC × DN) = AE / EC  --- (২)',
          'ধাপ ৩: যেহেতু ΔBDE এবং ΔCDE একই ভূমি DE এর ওপর এবং একই সমান্তরাল যুগল DE ও BC এর মধ্যে অবস্থিত,',
          'সুতরাং ক্ষেত্রফল ΔBDE = ক্ষেত্রফল ΔCDE  --- (৩)',
          'অতএব (১), (২) ও (৩) হতে পাই:',
          'AD / DB = AE / EC (প্রমাণিত)।',
        ],
        examinerSecret:
          'একই ভূমির ওপর অবস্থিত দুটি ত্রিভুজের ক্ষেত্রফল সমান হওয়ার যুক্তিটি (ধাপ ৩) লিখলে পূর্ণ ৪ নম্বর পাওয়া যায়।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'যদি ΔADE এর ক্ষেত্রফল ৩৬ বর্গ সেমি হয়, তবে চতুর্ভুজ BDEC এর ক্ষেত্রফল কত?',
        solution: [
          'এখানে AB = AD + DB = ৬ + ৩ = ৯ সেমি।',
          'যেহেতু DE ∥ BC, সুতরাং ∠ADE = ∠ABC এবং ∠AED = ∠ACB (অনুরূপ কোণ)।',
          'এবং ∠A সাধারণ কোণ। অতএব ΔADE এবং ΔABC পরস্পর সদৃশকোণী ও সদৃশ।',
          'উপপাদ্য ৩৩ অনুসারে: দুটি সদৃশ ত্রিভুজের ক্ষেত্রফলের অনুপাত অনুরূপ বাহুর বর্গের সমানুপাতিক:',
          'ΔADE / ΔABC = (AD / AB)² = (৬ / ৯)² = (২ / ৩)² = ৪ / ৯',
          'বা, ৩৬ / ΔABC = ৪ / ৯',
          'বা, ΔABC = (৩৬ × ৯) / ৪ = ৮১ বর্গ সেমি।',
          'অতএব চতুর্ভুজ BDEC এর ক্ষেত্রফল = ΔABC - ΔADE = ৮১ - ৩৬ = ৪৫ বর্গ সেমি।',
        ],
        examinerSecret:
          'ΔADE এর ক্ষেত্রফল হতে সম্পূর্ণ ΔABC এর ক্ষেত্রফল বিয়োগ করে চতুর্ভুজ BDEC বের করার কৌশল ৪/৪ নম্বর এনে দেয়।',
      },
    ],
  },
  {
    id: 2,
    boardSource: 'রাজশাহী বোর্ড ২০২৪ / কুমিল্লা বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'দুটি ত্রিভুজ ΔABC এবং ΔDEF সদৃশ। এদের অনুরূপ বাহু যথাক্রমে AB ও DE। অপর একটি ত্রিভুজ ΔPQR এর ∠P এর অন্তঃসমদ্বিখণ্ডক PS, QR কে S বিন্দুতে ছেদ করে।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'যদি AB : DE = ৩ : ৫ হয়, তবে ΔABC ও ΔDEF এর ক্ষেত্রফলের অনুপাত কত?',
        solution: [
          'আমরা জানি, দুটি সদৃশ ত্রিভুজের ক্ষেত্রফলের অনুপাত তাদের অনুরূপ বাহুর বর্গের অনুপাতের সমান (উপপাদ্য ৩৩)।',
          'ΔABC / ΔDEF = (AB / DE)² = (৩ / ৫)² = ৯ / ২৫।',
          'অতএব, ক্ষেত্রফলের অনুপাত ৯ : ২৫।',
        ],
        examinerSecret:
          'বর্গের অনুপাত সরাসরি (৩/৫)² = ৯/২৫ লিখলে পূর্ণ ২ নম্বর পাবেন।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, দুটি সদৃশ ত্রিভুজের ক্ষেত্রফলের অনুপাত অনুরূপ বাহুর বর্গের সমানুপাতিক।',
        solution: [
          'মনে করি ΔABC এবং ΔDEF দুটি সদৃশ ত্রিভুজ এবং এদের অনুরূপ বাহু যথাক্রমে BC ও EF। প্রমাণ করতে হবে: ΔABC / ΔDEF = BC² / EF²।',
          'অঙ্কন: A বিন্দু হতে BC এর ওপর AM ⊥ BC এবং D বিন্দু হতে EF এর ওপর DN ⊥ EF লম্ব টানি।',
          'প্রমাণ:',
          'ধাপ ১: ΔABC / ΔDEF = (½ × BC × AM) / (½ × EF × DN) = (BC / EF) × (AM / DN)  --- (১)',
          'ধাপ ২: সমকোণী ΔABM এবং ΔDEN এ, ∠B = ∠E (সদৃশতা অনুসারে) এবং ∠AMB = ∠DNE = ৯০°।',
          'সুতরাং ΔABM ও ΔDEN সদৃশকোণী। অতএব AM / DN = AB / DE = BC / EF  --- (২)',
          'ধাপ ৩: (২) নং এর মান (১) নং সমীকরণে বসিয়ে পাই:',
          'ΔABC / ΔDEF = (BC / EF) × (BC / EF) = BC² / EF²',
          'অনুরূপভাবে প্রমাণ করা যায়, ΔABC / ΔDEF = AB² / DE² = AC² / DF² (প্রমাণিত)।',
        ],
        examinerSecret:
          'উচ্চতা লম্ব AM ও DN অঙ্কন করে উচ্চতাদ্বয়ের অনুপাত যে বাহুদ্বয়ের অনুপাতের সমান (AM/DN = BC/EF) তা দেখানোই মূল ভিত্তি।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'ΔPQR এ PQ = ১০ সেমি, PR = ৬ সেমি এবং QR = ৮ সেমি হলে QS ও SR এর দৈর্ঘ্য কত?',
        solution: [
          'দেওয়া আছে, PS হলো ∠P এর অন্তঃসমদ্বিখণ্ডক যা QR কে S বিন্দুতে ছেদ করে।',
          'উপপাদ্য ৩০ অনুসারে: ত্রিভুজের যেকোনো কোণের অন্তঃসমদ্বিখণ্ডক বিপরীত বাহুকে সংলগ্ন বাহুদ্বয়ের অনুপাতে বিভক্ত করে।',
          'সুতরাং QS / SR = PQ / PR = ১০ / ৬ = ৫ / ৩।',
          'অনুপাতের রাশিদ্বয়ের যোগফল = ৫ + ৩ = ৮।',
          'যেহেতু সম্পূর্ণ QR = ৮ সেমি,',
          'অতএব QS = (৫ / ৮) × ৮ = ৫ সেমি।',
          'এবং SR = (৩ / ৮) × ৮ = ৩ সেমি।',
        ],
        examinerSecret:
          'উপপাদ্য ৩০ উল্লেখ করে আনুপাতিক ভাগে QS = ৫ সেমি এবং SR = ৩ সেমি বের করলে ৪/৪ নম্বর নিশ্চিত।',
      },
    ],
  },
  {
    id: 3,
    boardSource: 'দিনাজপুর বোর্ড ২০২৩ / যশোর বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stem: 'জ্যামিতিক প্রতিসমতা আলোচনায় সমবাহু ত্রিভুজ, বর্গক্ষেত্র এবং সুষম পঞ্চভুজ ৩টি অত্যন্ত গুরুত্বপূর্ণ প্রতিসম বহুভুজ।',
    subQuestions: [
      {
        part: 'ক',
        marks: 2,
        question: 'একটি সুষম পঞ্চভুজের ঘূর্ণন প্রতিসমতার কোণ ও মাত্রা কত?',
        solution: [
          'একটি সুষম পঞ্চভুজের বাহুর সংখ্যা n = ৫।',
          'ঘূর্ণন প্রতিসমতার মাত্রা = ৫।',
          'ঘূর্ণন কোণ = ৩৬০° / n = ৩৬০° / ৫ = ৭২°।',
          'অতএব ঘূর্ণন প্রতিসমতার কোণ ৭২° এবং মাত্রা ৫।',
        ],
        examinerSecret:
          '৩৬০° / ৫ = ৭২° ভাগফল নির্ভুল থাকলে ২/২ নিশ্চিত।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'চিত্রসহ দেখাও যে, সমবাহু ত্রিভুজের ৩টি প্রতিসাম্য রেখা এবং ঘূর্ণন প্রতিসমতার মাত্রা ৩।',
        solution: [
          '১. রৈখিক প্রতিসমতা (Lines of Symmetry):',
          'সমবাহু ত্রিভুজের ৩টি শীর্ষবিন্দু হতে বিপরীত বাহুর মধ্যবিন্দুর ওপর অঙ্কিত ৩টি মধ্যমা হলো এর প্রতিসাম্য রেখা।',
          'যেকোনো একটি মধ্যমা বরাবর ত্রিভুজটিকে ভাঁজ করলে উভয় অংশ হুবহু মিলে যায়। অতএব প্রতিসাম্য রেখার সংখ্যা ৩।',
          '২. ঘূর্ণন প্রতিসমতা (Rotational Symmetry):',
          'সমবাহু ত্রিভুজের পরিকেন্দ্রকে কেন্দ্র করে ঘোরালে:',
          '১২০° কোণে ঘুরালে এটি মূল ত্রিভুজের সাথে মিলে যায় (১ম অবস্থান)।',
          '২৪০° কোণে ঘুরালে দ্বিতীয়বার মূল আকৃতির সাথে মিলে যায় (২য় অবস্থান)।',
          '৩৬০° কোণে ঘুরালে তৃতীয়বার আদি অবস্থায় ফিরে আসে (৩য় অবস্থান)।',
          'যেহেতু ৩৬০° এর মধ্যে ৩ বার একই আকৃতি লাভ করে, সুতরাং এর ঘূর্ণন প্রতিসমতার মাত্রা ৩ এবং ঘূর্ণন কোণ ১২০°।',
        ],
        examinerSecret:
          '১২০°, ২৪০° এবং ৩৬০° তিনটি পর্যায় স্পষ্ট লিখলে ৪/৪ নম্বর নিশ্চিত।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'প্রমাণ কর যে, ট্রাপিজিয়ামের সমান্তরাল বাহুদ্বয়ের সমান্তরাল সরলরেখা এর তির্যক বাহুদ্বয়কে সমান অনুপাতে বিভক্ত করে।',
        solution: [
          'মনে করি ABCD একটি ট্রাপিজিয়াম যার AB ∥ CD। EF হলো সমান্তরাল রেখা (AB ∥ EF ∥ CD) যা তির্যক বাহু AD ও BC কে যথাক্রমে E ও F বিন্দুতে ছেদ করে।',
          'প্রমাণ করতে হবে: AE / ED = BF / FC।',
          'অঙ্কন: কর্ণ AC অঙ্কন করি যা EF কে G বিন্দুতে ছেদ করে।',
          'প্রমাণ:',
          'ΔADC এ EG ∥ CD। অতএব থেলিসের উপপাদ্য (উপপাদ্য ২৮) অনুসারে:',
          'AE / ED = AG / GC  --- (১)',
          'আবার ΔCAB এ GF ∥ AB। থেলিসের উপপাদ্য অনুসারে:',
          'AG / GC = BF / FC  --- (২)',
          '(১) ও (২) সমীকরণ তুলনা করে পাই:',
          'AE / ED = BF / FC (প্রমাণিত)।',
        ],
        examinerSecret:
          'কর্ণ AC টেনে ট্রাপিজিয়ামকে দুটি ত্রিভুজে বিভক্ত করে থেলিসের উপপাদ্য দুইবার প্রয়োগ করাই প্রধান কৌশল।',
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
    question: 'থেলিসের উপপাদ্য ২৮ অনুসারে ত্রিভুজের কোনো এক বাহুর সমান্তরাল সরলরেখা অপর দুই বাহুকে কীভাবে বিভক্ত করে?',
    options: ['A. সমান অনুপাতে', 'B. অসমান অনুপাতে', 'C. সমদ্বিখণ্ডিত করে', 'D. লম্বভাবে'],
    correctAnswerIndex: 0,
    explanation:
      'উপপাদ্য ২৮: ত্রিভুজের যেকোনো এক বাহুর সমান্তরাল সরলরেখা অপর দুই বাহুকে বা তাদের বর্ধিতাংশকে সমান অনুপাতে (AD/DB = AE/EC) বিভক্ত করে।',
  },
  {
    id: 2,
    question: 'দুটি সদৃশ ত্রিভুজের অনুরূপ বাহুর অনুপাত ৩ : ৪ হলে তাদের ক্ষেত্রফলের অনুপাত কত?',
    options: ['A. ৩ : ৪', 'B. ৯ : ১৬', 'C. ৬ : ৮', 'D. ২৭ : ৬৪'],
    correctAnswerIndex: 1,
    explanation:
      'উপপাদ্য ৩৩ অনুসারে: দুটি সদৃশ ত্রিভুজের ক্ষেত্রফলের অনুপাত অনুরূপ বাহুর বর্গের সমানুপাতিক। অতএব অনুপাত = ৩² : ৪² = ৯ : ১৬।',
  },
  {
    id: 3,
    question: 'ΔABC এ ∠A এর অন্তঃসমদ্বিখণ্ডক AD, BC বাহুকে D বিন্দুতে ছেদ করে। AB : AC = ৫ : ৩ এবং BC = ৮ সেমি হলে BD কত?',
    options: ['A. ৩ সেমি', 'B. ৪ সেমি', 'C. ৫ সেমি', 'D. ৬ সেমি'],
    correctAnswerIndex: 2,
    explanation:
      'উপপাদ্য ৩০ অনুসারে: BD/DC = AB/AC = ৫/৩। সম্পূর্ণ BC = ৮ হলে BD = (৫/৮) × ৮ = ৫ সেমি।',
  },
  {
    id: 4,
    question: 'একটি সুষম ষড়ভুজের ঘূর্ণন প্রতিসমতার মাত্রা কত?',
    options: ['A. ৩', 'B. ৪', 'C. ৬', 'D. ১২'],
    correctAnswerIndex: 2,
    explanation:
      'একটি সুষম বহুভুজের বাহুর সংখ্যা n হলে তার ঘূর্ণন প্রতিসমতার মাত্রাও n হয়। সুতরাং সুষম ষড়ভুজের মাত্রা ৬ এবং ঘূর্ণন কোণ ৩৬০°/৬ = ৬০°।',
  },
  {
    id: 5,
    question: 'একটি বৃত্তের প্রতিসাম্য রেখা (Lines of Symmetry) কয়টি?',
    options: ['A. ১টি', 'B. ২টি', 'C. ৪টি', 'D. অসংখ্য'],
    correctAnswerIndex: 3,
    explanation:
      'বৃত্তের কেন্দ্রগামী যেকোনো সরলরেখা (ব্যাস) বৃত্তটির একটি প্রতিসাম্য রেখা। বৃত্তের অসংখ্য ব্যাস থাকায় এর প্রতিসাম্য রেখার সংখ্যাও অসংখ্য।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathRatioSimilarityGuidebook() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1: Thales's Theorem State (AD/DB = AE/EC)
  const [lab1AD, setLab1AD] = useState<number>(6);
  const [lab1DB, setLab1DB] = useState<number>(3);
  const [lab1AE, setLab1AE] = useState<number>(8);

  // Lab 2: Angle Bisector State (BD/DC = AB/AC)
  const [lab2AB, setLab2AB] = useState<number>(10);
  const [lab2AC, setLab2AC] = useState<number>(6);
  const [lab2BC, setLab2BC] = useState<number>(8);

  // Lab 3: Equiangular Scaler State
  const [lab3ScaleFactor, setLab3ScaleFactor] = useState<number>(1.5);

  // Lab 4: Area Ratio Theorem 33
  const [lab4Scale, setLab4Scale] = useState<number>(2);

  // Lab 5: Symmetry State
  const [lab5Shape, setLab5Shape] = useState<'triangle' | 'square' | 'rectangle' | 'circle'>('triangle');
  const [lab5RotationDeg, setLab5RotationDeg] = useState<number>(0);
  const [lab5ShowSymmetryLines, setLab5ShowSymmetryLines] = useState<boolean>(true);

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

  // Summary state
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  // Sheru AI Tutor state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<
    Array<{ sender: 'user' | 'sheru'; text: string; time: string }>
  >([
    {
      sender: 'sheru',
      text: 'স্বাগতম! আমি শেরু — তোমার অনুপাত, সদৃশতা ও প্রতিসমতা (Ratio, Similarity & Symmetry) গাইড। থেলিসের উপপাদ্য, সদৃশ ত্রিভুজের ক্ষেত্রফল সূত্র বা ঘূর্ণন প্রতিসমতা নিয়ে যেকোনো প্রশ্ন নির্দ্বিধায় জিজ্ঞেস করো!',
      time: 'এখনই',
    },
  ]);
  const [aiInputText, setAiInputText] = useState<string>('');

  // Computations for Lab 1: Thales
  const lab1EC = lab1AD !== 0 ? ((lab1AE * lab1DB) / lab1AD).toFixed(2) : '0';
  const lab1RatioLeft = lab1DB !== 0 ? (lab1AD / lab1DB).toFixed(2) : '0';
  const lab1RatioRight = Number(lab1EC) !== 0 ? (lab1AE / Number(lab1EC)).toFixed(2) : '0';

  // Computations for Lab 2: Angle Bisector
  const lab2RatioSide = (lab2AB / lab2AC).toFixed(2);
  const lab2BD = ((lab2AB / (lab2AB + lab2AC)) * lab2BC).toFixed(2);
  const lab2DC = ((lab2AC / (lab2AB + lab2AC)) * lab2BC).toFixed(2);
  const lab2RatioBase = Number(lab2DC) !== 0 ? (Number(lab2BD) / Number(lab2DC)).toFixed(2) : '0';

  // Computations for Lab 4: Area Ratio
  const lab4AreaRatio = Math.pow(lab4Scale, 2);

  // Challenge checks
  const handleCheckChallenge1 = () => {
    // AD=4, DB=6, AE=5 -> EC = 6*5/4 = 7.5
    const val = userAns1.trim();
    if (val === '7.5' || val === '৭.৫' || val === '15/2') {
      setIsAns1Correct(true);
    } else {
      setIsAns1Correct(false);
    }
  };

  const handleCheckChallenge2 = () => {
    // Side ratio 2:3, larger area 18 -> smaller area = 18 * (2/3)^2 = 18 * 4/9 = 8
    const val = userAns2.trim();
    if (val === '8' || val === '৮') {
      setIsAns2Correct(true);
    } else {
      setIsAns2Correct(false);
    }
  };

  const handleCheckChallenge3 = () => {
    // Square has 4 lines of symmetry
    const val = userAns3.trim();
    if (val === '4' || val === '৪') {
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
        'চমৎকার প্রশ্ন! জ্যামিতিক সদৃশতার মূল ভিত্তি হলো কোণগুলো সমান থাকা (সদৃশকোণী) এবং অনুরূপ বাহুগুলো সমানুপাতিক হওয়া।';
      if (textToSend.includes('থেলিস') || textToSend.includes('২৮')) {
        reply =
          'থেলিসের উপপাদ্য ২৮ বলে: যেকোনো ত্রিভুজে এক বাহুর সমান্তরাল রেখা DE ∥ BC আঁকলে তা অপর দুই বাহুকে সমান অনুপাতে বিভক্ত করে (AD/DB = AE/EC)।';
      } else if (textToSend.includes('ক্ষেত্রফল') || textToSend.includes('৩৩')) {
        reply =
          'উপপাদ্য ৩৩ এর সোনালী নিয়ম: সদৃশ ত্রিভুজের ক্ষেত্রফলের অনুপাত তাদের অনুরূপ বাহুর বর্গের সমানুপাতিক (Δ₁/Δ₂ = k²)। তাই বাহু দ্বিগুণ হলে ক্ষেত্রফল ৪ গুণ হয়!';
      } else if (textToSend.includes('প্রতিসমতা') || textToSend.includes('ঘূর্ণন')) {
        reply =
          'ঘূর্ণন প্রতিসমতার কোণ বের করার সূত্র: ৩৬০° / n (যেখানে n হলো ঘূর্ণন মাত্রা)। যেমন সমবাহু ত্রিভুজে ৩৬০°/৩ = ১২০°, আর বর্গক্ষেত্রে ৩৬০°/৪ = ৯০°!';
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
    const text = `NCTB নবম-দশম সাধারণ গণিত • অধ্যায় ১৪: অনুপাত, সদৃশতা ও প্রতিসমতা
১. থেলিসের উপপাদ্য (উপপাদ্য ২৮):
   • ΔABC এ DE ∥ BC হলে: AD / DB = AE / EC
   • অনুসিদ্ধান্ত: AB / AD = AC / AE এবং AB / DB = AC / EC
২. কোণের অন্তঃসমদ্বিখণ্ডক উপপাদ্য (উপপাদ্য ৩০):
   • ∠A এর অন্তঃসমদ্বিখণ্ডক AD, BC কে D তে ছেদ করলে: BD / DC = AB / AC
৩. সদৃশ ত্রিভুজের ক্ষেত্রফল অনুপাত (উপপাদ্য ৩৩):
   • ΔABC ও ΔDEF সদৃশ হলে: ΔABC / ΔDEF = AB² / DE² = BC² / EF² = AC² / DF²
   • অনুরূপ বাহুর অনুপাত k হলে ক্ষেত্রফলের অনুপাত = k²
৪. জ্যামিতিক প্রতিসমতা সারণি:
   • সমবাহু ত্রিভুজ: প্রতিসাম্য রেখা ৩টি, ঘূর্ণন কোণ ১২০°, মাত্রা ৩
   • বর্গক্ষেত্র: প্রতিসাম্য রেখা ৪টি, ঘূর্ণন কোণ ৯০°, মাত্রা ৪
   • আয়তক্ষেত্র: প্রতিসাম্য রেখা ২টি, ঘূর্ণন কোণ ১৮০°, মাত্রা ২
   • সুষম পঞ্চভুজ: প্রতিসাম্য রেখা ৫টি, ঘূর্ণন কোণ ৭২°, মাত্রা ৫
   • বৃত্ত: প্রতিসাম্য রেখা অসংখ্য, ঘূর্ণন কোণ যেকোনো, মাত্রা অসীম`;

    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2500);
  };

  const currentLab = LAB_LESSONS.find((l) => l.id === activeLabId) || LAB_LESSONS[0];
  const currentCQ = CHAPTER_CQS.find((c) => c.id === selectedCQId) || CHAPTER_CQS[0];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Subject Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard/playground/v2"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="গাইডবুক লাইব্রেরিতে ফিরুন"
            >
              <RotateCcw className="w-4 h-4" />
            </Link>

            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Shapes className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-primary">সাধারণ গণিত • অধ্যায় ১৪</span>
                <span>•</span>
                <span>NCTB নবম-দশম</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold truncate text-slate-900 dark:text-white">
                অনুপাত, সদৃশতা ও প্রতিসমতা — <span className="font-normal text-slate-600 dark:text-slate-400">থেলিসের উপপাদ্য, সদৃশ ক্ষেত্রফল ও ঘূর্ণন প্রতিসমতা ল্যাব</span>
              </h1>
            </div>
          </div>

          {/* 5-Step Progress Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-medium">
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
              <span>২. উদাহরণ দেখুন</span>
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
              <span>৩. নিজে চেষ্টা করুন</span>
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
              <span>৪. অনুধাবন যাচাই</span>
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

            {/* ---------------- LAB 1: THALES'S THEOREM ---------------- */}
            {activeLabId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Sliders className="w-4 h-4 text-primary" />
                      থেলিসের উপপাদ্য প্যারামিটার (DE ∥ BC)
                    </h3>
                  </div>

                  {/* 3 Quick Presets */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setLab1AD(6);
                        setLab1DB(3);
                        setLab1AE(8);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      বোর্ড মডেল (৬ : ৩)
                    </button>
                    <button
                      onClick={() => {
                        setLab1AD(4);
                        setLab1DB(4);
                        setLab1AE(5);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      মধ্যবিন্দু (১ : ১)
                    </button>
                    <button
                      onClick={() => {
                        setLab1AD(8);
                        setLab1DB(4);
                        setLab1AE(10);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:border-primary text-center font-medium transition-all"
                    >
                      দ্বিগুণ অনুপাত (২ : ১)
                    </button>
                  </div>

                  {/* Slider AD */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">AD দৈর্ঘ্য:</span>
                      <span className="font-bold text-primary">{lab1AD} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      value={lab1AD}
                      onChange={(e) => setLab1AD(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider DB */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">DB দৈর্ঘ্য:</span>
                      <span className="font-bold text-primary">{lab1DB} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={lab1DB}
                      onChange={(e) => setLab1DB(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider AE */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">AE দৈর্ঘ্য:</span>
                      <span className="font-bold text-primary">{lab1AE} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      value={lab1AE}
                      onChange={(e) => setLab1AE(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Calculated EC and Equality proof */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">উপপাদ্য ২৮ সমানুপাত যাচাই:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      বাম অনুপাত: AD / DB = {lab1AD} / {lab1DB} = {lab1RatioLeft}
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ডান অনুপাত: AE / EC = {lab1AE} / {lab1EC} = {lab1RatioRight}
                    </div>
                    <div className="text-primary font-bold">
                      স্বয়ংক্রিয়ভাবে EC = ({lab1AE} × {lab1DB}) / {lab1AD} = {lab1EC} সেমি
                    </div>
                  </div>
                </div>

                {/* Visual SVG Triangle Canvas */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Triangle className="w-4 h-4 text-emerald-500" />
                      জ্যামিতিক ত্রিভুজ ও সমান্তরাল রেখা (DE ∥ BC)
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      অনুপাত সাম্য: {lab1RatioLeft} = {lab1RatioRight}
                    </span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                      {/* Triangle ABC */}
                      {/* Vertex A at (200, 30), B at (60, 210), C at (340, 210) */}
                      <polygon
                        points="200,30 60,210 340,210"
                        fill="rgba(59, 130, 246, 0.08)"
                        stroke="#60a5fa"
                        strokeWidth="2.5"
                      />

                      {/* Position of D and E based on AD/(AD+DB) */}
                      {(() => {
                        const t = lab1AD / (lab1AD + lab1DB);
                        const clampedT = Math.min(Math.max(t, 0.2), 0.8);
                        const dx = 200 + (60 - 200) * clampedT;
                        const dy = 30 + (210 - 30) * clampedT;
                        const ex = 200 + (340 - 200) * clampedT;
                        const ey = 30 + (210 - 30) * clampedT;

                        return (
                          <>
                            {/* Parallel line DE */}
                            <line
                              x1={dx}
                              y1={dy}
                              x2={ex}
                              y2={ey}
                              stroke="#f59e0b"
                              strokeWidth="3"
                              strokeDasharray="4 2"
                            />

                            {/* Node D */}
                            <circle cx={dx} cy={dy} r="5" fill="#f59e0b" />
                            <text
                              x={dx - 18}
                              y={dy + 4}
                              fill="#f59e0b"
                              fontSize="12"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              D
                            </text>

                            {/* Node E */}
                            <circle cx={ex} cy={ey} r="5" fill="#f59e0b" />
                            <text
                              x={ex + 10}
                              y={ey + 4}
                              fill="#f59e0b"
                              fontSize="12"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              E
                            </text>

                            {/* Label parallel arrow */}
                            <text
                              x="200"
                              y={dy - 8}
                              fill="#fbbf24"
                              fontSize="11"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              DE ∥ BC
                            </text>
                          </>
                        );
                      })()}

                      {/* Vertices Labels */}
                      <text x="200" y="22" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
                        A
                      </text>
                      <text x="50" y="225" fill="#fff" fontSize="13" fontWeight="bold">
                        B
                      </text>
                      <text x="345" y="225" fill="#fff" fontSize="13" fontWeight="bold">
                        C
                      </text>
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">উপপাদ্য ২৮ এর অনুসিদ্ধান্ত:</span> AD/AB = AE/AC এবং DB/AB = EC/AC। অর্থাৎ খণ্ডিতাংশের অনুপাত এবং পূর্ণ বাহুর অনুপাত সমানুপাতিক থাকে।
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 2: ANGLE BISECTOR THEOREM ---------------- */}
            {activeLabId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Scale className="w-4 h-4 text-primary" />
                      কোণের সমদ্বিখণ্ডক প্যারামিটার (উপপাদ্য ৩০)
                    </h3>
                  </div>

                  {/* Slider AB */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">বাহু AB:</span>
                      <span className="font-bold text-primary">{lab2AB} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="15"
                      value={lab2AB}
                      onChange={(e) => setLab2AB(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider AC */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">বাহু AC:</span>
                      <span className="font-bold text-primary">{lab2AC} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="15"
                      value={lab2AC}
                      onChange={(e) => setLab2AC(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider BC */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">ভূমি BC:</span>
                      <span className="font-bold text-primary">{lab2BC} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="18"
                      value={lab2BC}
                      onChange={(e) => setLab2BC(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Ratio check */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">উপপাদ্য ৩০ সমতা বিশ্লেষণ:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      বাহুর অনুপাত: AB / AC = {lab2AB} / {lab2AC} = {lab2RatioSide}
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ভূমির বিভাজন: BD / DC = {lab2BD} / {lab2DC} = {lab2RatioBase}
                    </div>
                    <div className="text-primary font-bold">
                      BD = {lab2BD} সেমি, DC = {lab2DC} সেমি
                    </div>
                  </div>
                </div>

                {/* Visual Diagram */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      অন্তঃসমদ্বিখণ্ডক রেখা AD বিভাজন প্রদর্শন
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      BD : DC = AB : AC
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                      {/* Triangle ABC */}
                      <polygon
                        points="180,30 50,210 350,210"
                        fill="rgba(16, 185, 129, 0.08)"
                        stroke="#34d399"
                        strokeWidth="2.5"
                      />

                      {/* Bisector point D on BC */}
                      {(() => {
                        const ratio = lab2AB / (lab2AB + lab2AC);
                        const dx = 50 + (350 - 50) * ratio;
                        const dy = 210;

                        return (
                          <>
                            {/* Bisector ray AD */}
                            <line
                              x1="180"
                              y1="30"
                              x2={dx}
                              y2={dy}
                              stroke="#ec4899"
                              strokeWidth="2.5"
                              strokeDasharray="4 2"
                            />
                            <circle cx={dx} cy={dy} r="5" fill="#ec4899" />
                            <text
                              x={dx}
                              y={dy + 20}
                              fill="#ec4899"
                              fontSize="12"
                              fontWeight="bold"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              D
                            </text>

                            {/* Angle bisector marks at A */}
                            <path
                              d="M 165,55 A 25 25 0 0 0 178,56"
                              fill="none"
                              stroke="#ec4899"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M 182,56 A 25 25 0 0 0 195,55"
                              fill="none"
                              stroke="#ec4899"
                              strokeWidth="1.5"
                            />
                          </>
                        );
                      })()}

                      {/* Labels */}
                      <text x="180" y="20" fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
                        A
                      </text>
                      <text x="40" y="225" fill="#fff" fontSize="13" fontWeight="bold">
                        B
                      </text>
                      <text x="355" y="225" fill="#fff" fontSize="13" fontWeight="bold">
                        C
                      </text>
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">মূল সত্য:</span> ত্রিভুজের কোনো কোণের অন্তঃসমদ্বিখণ্ডক বিপরীত বাহুকে সমান দুই ভাগে বিভক্ত করে না (যদি না ত্রিভুজটি সমদ্বিবাহু হয়); বরং এটি বিপরীত বাহুকে সংলগ্ন বাহুদ্বয়ের অনুপাতে ভাগ করে!
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 3: SIMILAR TRIANGLES EQUIANGULAR ---------------- */}
            {activeLabId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Shapes className="w-4 h-4 text-primary" />
                      স্কেল ফ্যাক্টর প্যারামিটার (Scale Factor k)
                    </h3>
                  </div>

                  {/* Slider Scale Factor k */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">অনুপাত স্কেল k:</span>
                      <span className="font-bold text-primary">{lab3ScaleFactor}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="2.0"
                      step="0.1"
                      value={lab3ScaleFactor}
                      onChange={(e) => setLab3ScaleFactor(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Base Triangle Dimensions */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">ΔABC বনাম ΔDEF বাহু তুলনা:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      ΔABC বাহুত্রয়: AB = ৪, BC = ৬, AC = ৫
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ΔDEF বাহুত্রয়: DE = {(4 * lab3ScaleFactor).toFixed(1)}, EF = {(6 * lab3ScaleFactor).toFixed(1)}, DF = {(5 * lab3ScaleFactor).toFixed(1)}
                    </div>
                    <div className="text-primary font-bold">
                      অনুরূপ বাহুর অনুপাত = DE/AB = EF/BC = DF/AC = {lab3ScaleFactor}
                    </div>
                  </div>
                </div>

                {/* Visualizer Canvas */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Triangle className="w-4 h-4 text-emerald-500" />
                      সদৃশকোণী ত্রিভুজদ্বয় (ΔABC ~ ΔDEF)
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      কোণ অভিন্ন: ∠A=∠D, ∠B=∠E, ∠C=∠F
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-around p-4">
                    {/* Triangle 1: ABC */}
                    <svg viewBox="0 0 160 180" className="w-36 h-40">
                      <polygon
                        points="80,20 20,150 140,150"
                        fill="rgba(59, 130, 246, 0.15)"
                        stroke="#60a5fa"
                        strokeWidth="2.5"
                      />
                      <text x="80" y="15" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                        A
                      </text>
                      <text x="12" y="165" fill="#fff" fontSize="12" fontWeight="bold">
                        B
                      </text>
                      <text x="142" y="165" fill="#fff" fontSize="12" fontWeight="bold">
                        C
                      </text>
                      <text x="80" y="100" fill="#93c5fd" fontSize="11" textAnchor="middle">
                        ΔABC
                      </text>
                    </svg>

                    <span className="text-xl font-bold text-slate-500 font-mono">~</span>

                    {/* Triangle 2: DEF scaled */}
                    <div
                      style={{ transform: `scale(${Math.min(lab3ScaleFactor * 0.75, 1.3)})` }}
                      className="transition-transform duration-300 origin-center"
                    >
                      <svg viewBox="0 0 160 180" className="w-36 h-40">
                        <polygon
                          points="80,20 20,150 140,150"
                          fill="rgba(16, 185, 129, 0.15)"
                          stroke="#34d399"
                          strokeWidth="2.5"
                        />
                        <text x="80" y="15" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">
                          D
                        </text>
                        <text x="12" y="165" fill="#fff" fontSize="12" fontWeight="bold">
                          E
                        </text>
                        <text x="142" y="165" fill="#fff" fontSize="12" fontWeight="bold">
                          F
                        </text>
                        <text x="80" y="100" fill="#6ee7b7" fontSize="11" textAnchor="middle">
                          ΔDEF ({lab3ScaleFactor}x)
                        </text>
                      </svg>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">উপপাদ্য ৩২:</span> দুটি ত্রিভুজ সদৃশকোণী হলে তাদের আকার (Size) ছোট-বড় হতে পারে, কিন্তু আকৃতি (Shape) হুবহু একই থাকে এবং অনুরূপ বাহুর অনুপাত ধ্রুবক থাকে।
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 4: AREA RATIO THEOREM 33 ---------------- */}
            {activeLabId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Calculator className="w-4 h-4 text-primary" />
                      ক্ষেত্রফল বনাম বাহুর বর্গ অনুপাত
                    </h3>
                  </div>

                  {/* Slider Scale Ratio */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">অনুরূপ বাহুর অনুপাত (k):</span>
                      <span className="font-bold text-primary">{lab4Scale} গুণ</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="3.5"
                      step="0.5"
                      value={lab4Scale}
                      onChange={(e) => setLab4Scale(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Formula Breakdown Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">উপপাদ্য ৩৩ উপপাদ্য প্রয়োগ:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      বাহুর অনুপাত: a₁ / a₂ = {lab4Scale}
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ক্ষেত্রফলের অনুপাত: Δ₁ / Δ₂ = ({lab4Scale})² = {lab4AreaRatio} গুণ!
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      যদি ছোট ত্রিভুজের ক্ষেত্রফল ১০ বর্গ সেমি হয়, তবে বড়টির ক্ষেত্রফল = ১০ × {lab4AreaRatio} = {10 * lab4AreaRatio} বর্গ সেমি।
                    </div>
                  </div>
                </div>

                {/* Visual Square Grid Proof */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Grid className="w-4 h-4 text-amber-500" />
                      ক্ষেত্রফলের বর্গীয় বৃদ্ধি (Tile Visualizer)
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      ক্ষেত্রফল বৃদ্ধি = {lab4AreaRatio}x
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    বাহু {lab4Scale} গুণ বৃদ্ধি পেলে কেন ক্ষেত্রফল {lab4AreaRatio} গুণ হয়? কারণ ত্রিভুজের ক্ষেত্রফল = ½ × ভূমি × উচ্চতা। ভূমি {lab4Scale} গুণ এবং উচ্চতাও {lab4Scale} গুণ বাড়ে, ফলে মোট ক্ষেত্রফল {lab4Scale} × {lab4Scale} = {lab4AreaRatio} গুণ বৃদ্ধি পায়!
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-center">
                      <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">ছোট ত্রিভুজ (১x)</div>
                      <div className="w-16 h-16 mx-auto my-3 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center font-mono font-bold text-blue-600 dark:text-blue-300">
                        ১ একক
                      </div>
                      <div className="text-xs font-mono">ক্ষেত্রফল = ১</div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-center">
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">বড় ত্রিভুজ ({lab4Scale}x)</div>
                      <div className="w-24 h-24 mx-auto my-2 bg-emerald-500/20 border-2 border-emerald-500 rounded-lg flex items-center justify-center font-mono font-bold text-emerald-600 dark:text-emerald-300">
                        {lab4AreaRatio} একক
                      </div>
                      <div className="text-xs font-mono">ক্ষেত্রফল = {lab4AreaRatio} একক</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">বোর্ড এমসিকিউ মাস্টার টিপ:</span> পরীক্ষায় যদি ক্ষেত্রফলের অনুপাত ১৬ : ২৫ দেওয়া থাকে, তবে অনুরূপ বাহুর অনুপাত হবে √১৬ : √২৫ = ৪ : ৫!
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 5: SYMMETRY ---------------- */}
            {activeLabId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <RotateCw className="w-4 h-4 text-primary" />
                      জ্যামিতিক আকৃতি ও ঘূর্ণন কোণ
                    </h3>
                  </div>

                  {/* 4 Shapes Selectors */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setLab5Shape('triangle');
                        setLab5RotationDeg(0);
                      }}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        lab5Shape === 'triangle'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      সমবাহু ত্রিভুজ
                    </button>
                    <button
                      onClick={() => {
                        setLab5Shape('square');
                        setLab5RotationDeg(0);
                      }}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        lab5Shape === 'square'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      বর্গক্ষেত্র
                    </button>
                    <button
                      onClick={() => {
                        setLab5Shape('rectangle');
                        setLab5RotationDeg(0);
                      }}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        lab5Shape === 'rectangle'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      আয়তক্ষেত্র
                    </button>
                    <button
                      onClick={() => {
                        setLab5Shape('circle');
                        setLab5RotationDeg(0);
                      }}
                      className={`p-2.5 rounded-xl border font-medium text-center transition-all ${
                        lab5Shape === 'circle'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      বৃত্ত
                    </button>
                  </div>

                  {/* Rotation Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">ঘূর্ণন কোণ (Rotation Angle):</span>
                      <span className="font-bold text-primary">{lab5RotationDeg}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={lab5RotationDeg}
                      onChange={(e) => setLab5RotationDeg(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Toggle Symmetry lines */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      প্রতিসাম্য রেখা প্রদর্শন:
                    </span>
                    <button
                      onClick={() => setLab5ShowSymmetryLines(!lab5ShowSymmetryLines)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        lab5ShowSymmetryLines
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {lab5ShowSymmetryLines ? 'চালু' : 'বন্ধ'}
                    </button>
                  </div>

                  {/* Symmetry Summary for Selected Shape */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">নির্বাচিত আকৃতির প্রতিসমতা তথ্য:</div>
                    {lab5Shape === 'triangle' && (
                      <div className="text-slate-800 dark:text-slate-200">
                        • প্রতিসাম্য রেখা: ৩টি (৩টি মধ্যমা)
                        <br />• ঘূর্ণন কোণ: ৩৬০° / ৩ = ১২০°
                        <br />• ঘূর্ণন প্রতিসমতার মাত্রা: ৩
                      </div>
                    )}
                    {lab5Shape === 'square' && (
                      <div className="text-slate-800 dark:text-slate-200">
                        • প্রতিসাম্য রেখা: ৪টি (২টি অক্ষ + ২টি কর্ণ)
                        <br />• ঘূর্ণন কোণ: ৩৬০° / ৪ = ৯০°
                        <br />• ঘূর্ণন প্রতিসমতার মাত্রা: ৪
                      </div>
                    )}
                    {lab5Shape === 'rectangle' && (
                      <div className="text-slate-800 dark:text-slate-200">
                        • প্রতিসাম্য রেখা: ২টি (বিপরীত বাহুর মধ্যবিন্দুগামী)
                        <br />• ঘূর্ণন কোণ: ৩৬০° / ২ = ১৮০°
                        <br />• ঘূর্ণন প্রতিসমতার মাত্রা: ২
                      </div>
                    )}
                    {lab5Shape === 'circle' && (
                      <div className="text-slate-800 dark:text-slate-200">
                        • প্রতিসাম্য রেখা: অসংখ্য (প্রতিটি ব্যাস)
                        <br />• ঘূর্ণন কোণ: যেকোনো সূক্ষ্ম কোণ
                        <br />• ঘূর্ণন প্রতিসমতার মাত্রা: অসীম
                      </div>
                    )}
                  </div>
                </div>

                {/* Rotating Shape Display */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Shapes className="w-4 h-4 text-purple-500" />
                      ঘূর্ণন ও রৈখিক প্রতিসমতা ভিজ্যুয়ালাইজার
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                      ঘূর্ণন: {lab5RotationDeg}°
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <div
                      style={{ transform: `rotate(${lab5RotationDeg}deg)` }}
                      className="transition-transform duration-200 flex items-center justify-center"
                    >
                      {lab5Shape === 'triangle' && (
                        <div className="w-36 h-36 relative flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <polygon
                              points="50,15 15,80 85,80"
                              fill="rgba(168, 85, 247, 0.2)"
                              stroke="#c084fc"
                              strokeWidth="3"
                            />
                            {lab5ShowSymmetryLines && (
                              <>
                                <line x1="50" y1="15" x2="50" y2="80" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="15" y1="80" x2="67.5" y2="47.5" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="85" y1="80" x2="32.5" y2="47.5" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                              </>
                            )}
                          </svg>
                        </div>
                      )}

                      {lab5Shape === 'square' && (
                        <div className="w-32 h-32 relative flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect
                              x="15"
                              y="15"
                              width="70"
                              height="70"
                              fill="rgba(59, 130, 246, 0.2)"
                              stroke="#60a5fa"
                              strokeWidth="3"
                            />
                            {lab5ShowSymmetryLines && (
                              <>
                                <line x1="50" y1="0" x2="50" y2="100" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="15" y1="15" x2="85" y2="85" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="15" y1="85" x2="85" y2="15" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                              </>
                            )}
                          </svg>
                        </div>
                      )}

                      {lab5Shape === 'rectangle' && (
                        <div className="w-40 h-28 relative flex items-center justify-center">
                          <svg viewBox="0 0 120 80" className="w-full h-full">
                            <rect
                              x="10"
                              y="15"
                              width="100"
                              height="50"
                              fill="rgba(16, 185, 129, 0.2)"
                              stroke="#34d399"
                              strokeWidth="3"
                            />
                            {lab5ShowSymmetryLines && (
                              <>
                                <line x1="60" y1="0" x2="60" y2="80" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="0" y1="40" x2="120" y2="40" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                              </>
                            )}
                          </svg>
                        </div>
                      )}

                      {lab5Shape === 'circle' && (
                        <div className="w-32 h-32 relative flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="rgba(245, 158, 11, 0.2)"
                              stroke="#fbbf24"
                              strokeWidth="3"
                            />
                            {lab5ShowSymmetryLines && (
                              <>
                                <line x1="50" y1="0" x2="50" y2="100" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="15" y1="15" x2="85" y2="85" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                                <line x1="15" y1="85" x2="85" y2="15" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                              </>
                            )}
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">গুরুত্বপূর্ণ নোট:</span> আয়তক্ষেত্রের কর্ণদ্বয় এর প্রতিসাম্য রেখা নয়, কারণ কর্ণ বরাবর ভাঁজ করলে দুই অংশ হুবহু সমাপতিত হয় না। কেবল বিপরীত বাহুর মধ্যবিন্দুগামী রেখা দুটিই এর প্রতিসাম্য রেখা!
                  </div>
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
                    চ্যালেঞ্জ ০১: থেলিসের উপপাদ্য বাহু নির্ণয়
                  </span>
                  {isAns1Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  ΔABC এ DE ∥ BC। AD = ৪ সেমি, DB = ৬ সেমি এবং AE = ৫ সেমি হলে EC এর দৈর্ঘ্য কত সেমি?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns1}
                    onChange={(e) => {
                      setUserAns1(e.target.value);
                      setIsAns1Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 7.5)"
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
                    চ্যালেঞ্জ ০২: সদৃশ ত্রিভুজের ক্ষেত্রফল
                  </span>
                  {isAns2Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  দুটি সদৃশ ত্রিভুজের অনুরূপ বাহুর অনুপাত ২ : ৩। বৃহত্তর ত্রিভুজের ক্ষেত্রফল ১৮ বর্গ সেমি হলে ক্ষুদ্রতর ত্রিভুজের ক্ষেত্রফল কত বর্গ সেমি?
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
                    চ্যালেঞ্জ ০৩: বর্গক্ষেত্রের প্রতিসাম্য রেখা
                  </span>
                  {isAns3Correct === true && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  একটি বর্গক্ষেত্রের প্রতিসাম্য রেখা (Lines of Symmetry) কয়টি?
                </p>

                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={userAns3}
                    onChange={(e) => {
                      setUserAns3(e.target.value);
                      setIsAns3Correct(null);
                    }}
                    placeholder="উত্তর লিখুন (যেমন: 4)"
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
                  অধ্যায় ১৪ কুইজ ও আত্মযাচাই
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
                  অধ্যায় ১৪: অনুপাত, সদৃশতা ও প্রতিসমতা রিভিশন চিট-শীট
                </h2>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                  পরীক্ষার আগের রাতের জন্য এনসিটিবি সিলেবাসের সমস্ত মৌলিক উপপাদ্য, সদৃশতার শর্ত ও প্রতিসমতার সারসংক্ষেপ।
                </p>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  থেলিসের উপপাদ্য (উপপাদ্য ২৮)
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• DE ∥ BC হলে: AD / DB = AE / EC</li>
                  <li>• বিপরীত উপপাদ্য ২৯: অনুপাত সমান হলে রেখা সমান্তরাল</li>
                  <li>• অনুসিদ্ধান্ত ১: AB / AD = AC / AE</li>
                  <li>• অনুসিদ্ধান্ত ২: AB / DB = AC / EC</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  কোণের সমদ্বিখণ্ডক (উপপাদ্য ৩০)
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• ∠A এর অন্তঃসমদ্বিখণ্ডক AD হলে: BD / DC = AB / AC</li>
                  <li>• বিপরীত বাহুর খণ্ডিতাংশ সংলগ্ন বাহুর সমানুপাতিক</li>
                  <li>• বহিঃসমদ্বিখণ্ডক উপপাদ্য ৩১: বাহুর বহির্বিভাজন</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                  সদৃশ ত্রিভুজ ও ক্ষেত্রফল (উপপাদ্য ৩৩)
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• সদৃশতার শর্তাবলি: AAA, SAS, SSS, RHS</li>
                  <li>• সদৃশ ত্রিভুজের অনুরূপ বাহুর অনুপাত ধ্রুবক (k)</li>
                  <li>• ক্ষেত্রফল অনুপাত = অনুরূপ বাহুর বর্গ (k²)</li>
                  <li>• Δ₁ / Δ₂ = (a₁ / a₂)²</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  প্রতিসমতা ও ঘূর্ণন মাত্রা
                </span>
                <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 font-mono">
                  <li>• সমবাহু ত্রিভুজ: রেখা ৩, কোণ ১২০°, মাত্রা ৩</li>
                  <li>• বর্গক্ষেত্র: রেখা ৪, কোণ ৯০°, মাত্রা ৪</li>
                  <li>• আয়তক্ষেত্র: রেখা ২, কোণ ১৮০°, মাত্রা ২</li>
                  <li>• সুষম বহুভুজ (n-বাহু): মাত্রা n, কোণ ৩৬০°/n</li>
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
{`১. থেলিসের উপপাদ্য (উপপাদ্য ২৮):
   • ΔABC এ DE ∥ BC হলে: AD / DB = AE / EC
   • অনুসিদ্ধান্ত: AB / AD = AC / AE এবং AB / DB = AC / EC
২. কোণের অন্তঃসমদ্বিখণ্ডক উপপাদ্য (উপপাদ্য ৩০):
   • ∠A এর অন্তঃসমদ্বিখণ্ডক AD হলে: BD / DC = AB / AC
৩. সদৃশ ত্রিভুজের ক্ষেত্রফল অনুপাত (উপপাদ্য ৩৩):
   • ΔABC ও ΔDEF সদৃশ হলে: ΔABC / ΔDEF = (AB / DE)² = (BC / EF)² = (AC / DF)²
   • অনুরূপ বাহুর অনুপাত k হলে ক্ষেত্রফলের অনুপাত = k²
৪. জ্যামিতিক প্রতিসমতা সারণি:
   • সমবাহু ত্রিভুজ: প্রতিসাম্য রেখা ৩টি, ঘূর্ণন কোণ ১২০°, মাত্রা ৩
   • বর্গক্ষেত্র: প্রতিসাম্য রেখা ৪টি, ঘূর্ণন কোণ ৯০°, মাত্রা ৪
   • আয়তক্ষেত্র: প্রতিসাম্য রেখা ২টি, ঘূর্ণন কোণ ১৮০°, মাত্রা ২
   • সুষম পঞ্চভুজ: প্রতিসাম্য রেখা ৫টি, ঘূর্ণন কোণ ৭২°, মাত্রা ৫
   • বৃত্ত: প্রতিসাম্য রেখা অসংখ্য, ঘূর্ণন কোণ যেকোনো, মাত্রা অসীম`}
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
          <span>শেরু AI সদৃশতা টিউটর</span>
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
                    শেরু AI সদৃশতা ও প্রতিসমতা গাইড
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>সক্রিয় • জ্যামিতিক উপপাদ্য বিশেষজ্ঞ</span>
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
                onClick={() => handleSendAiMessage('থেলিসের উপপাদ্য কী?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors text-[11px]"
              >
                থেলিসের উপপাদ্য কী?
              </button>
              <button
                onClick={() => handleSendAiMessage('ক্ষেত্রফল ও বাহুর বর্গ নিয়ম?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors text-[11px]"
              >
                ক্ষেত্রফল অনুপাত নিয়ম?
              </button>
              <button
                onClick={() => handleSendAiMessage('ঘূর্ণন প্রতিসমতার কোণ কীভাবে বের করব?')}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors text-[11px]"
              >
                ঘূর্ণন কোণ সূত্র?
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
                placeholder="সদৃশতা ও প্রতিসমতা সম্পর্কিত প্রশ্ন লিখুন..."
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
