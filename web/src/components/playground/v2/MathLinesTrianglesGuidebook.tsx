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
    title: 'রেখা, কোণ ও সন্নিহিত/বিপ্রতীপ কোণ ল্যাব',
    subtitle: 'Lines, Angles & Linear Pair / Vertically Opposite',
    nctbPage: 'পৃষ্ঠা ১২৫-১২৯',
    badge: 'ল্যাব ০১',
    intro:
      'একটি সরলরেখার ওপর কোনো রশ্মি মিলিত হলে উৎপন্ন সন্নিহিত কোণদ্বয়ের সমষ্টি দুই সমকোণ বা ১৮০° (উপপাদ্য ১৫)। আবার দুটি রেখা পরস্পর ছেদ করলে উৎপন্ন বিপ্রতীপ কোণদ্বয় সর্বদা সমান হয়। স্লাইডার ঘুরিয়ে কোণের পরিবর্তন লাইভ দেখুন।',
  },
  {
    id: 2,
    title: 'সমান্তরাল রেখা ও ছেদক কোণ ল্যাব',
    subtitle: 'Parallel Lines & Transversal Angles',
    nctbPage: 'পৃষ্ঠা ১৩০-১৩৪',
    badge: 'ল্যাব ০২',
    intro:
      'দুটি সমান্তরাল রেখাকে একটি ছেদক ছেদ করলে একান্তর কোণ (Z-প্যাটার্ন) সমান, অনুরূপ কোণ (F-প্যাটার্ন) সমান এবং একই পাশের অন্তঃস্থ কোণদ্বয়ের সমষ্টি দুই সমকোণ বা ১৮০° হয়। জ্যামিতিক সম্পর্কের ৩টি প্যাটার্ন ইন্টারেক্টিভভাবে এক্সপ্লোর করুন।',
  },
  {
    id: 3,
    title: 'ত্রিভুজের কোণ সমষ্টি ১৮০° ও বহিঃস্থ কোণ ল্যাব',
    subtitle: 'Triangle Angle Sum 180° & Exterior Angle Theorem',
    nctbPage: 'পৃষ্ঠা ১৩৫-১৩৯',
    badge: 'ল্যাব ০৩',
    intro:
      'যেকোনো ত্রিভুজের তিন কোণের সমষ্টি দুই সমকোণ বা ১৮০° (উপপাদ্য ১৬)। শীর্ষবিন্দু দিয়ে ভূমির সমান্তরাল রেখা এঁকে একান্তর কোণের মাধ্যমে এটি প্রমাণ করা যায়। এছাড়া ত্রিভুজের কোনো বাহুকে বর্ধিত করলে বহিঃস্থ কোণ = বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টি (উপপাদ্য ১৭)।',
  },
  {
    id: 4,
    title: 'ত্রিভুজের সর্বসমতার ৪টি শর্ত ল্যাব',
    subtitle: 'Triangle Congruence Criteria (SAS, SSS, ASA, RHS)',
    nctbPage: 'পৃষ্ঠা ১৪০-১৪৬',
    badge: 'ল্যাব ০৪',
    intro:
      'দুটি ত্রিভুজ সর্বসম হওয়ার সুনির্দিষ্ট ৪টি শর্ত রয়েছে: বাহু-কোণ-বাহু (SAS), বাহু-বাহু-বাহু (SSS), কোণ-বাহু-কোণ (ASA) এবং সমকোণী ত্রিভুজের অতিভুজ-বাহু (RHS)। কোণ-কোণ-কোণ (AAA) বা বাহু-বাহু-কোণ (SSA) কেন সর্বসমতা দেয় না তা লাইভ যাচাই করুন।',
  },
  {
    id: 5,
    title: 'পিথাগোরাস ও বাহুর অসমতা কোলাইডার ল্যাব',
    subtitle: 'Pythagorean Theorem & Triangle Inequality Collider',
    nctbPage: 'পৃষ্ঠা ১৪৭-১৫২',
    badge: 'ল্যাব ০৫',
    intro:
      'ত্রিভুজ আঁকার পূর্বশর্ত হলো যেকোনো দুই বাহুর সমষ্টি ৩য় বাহু অপেক্ষা বৃহত্তর হতে হবে (a + b > c)। সমকোণী ত্রিভুজে অতিভুজ² = লম্ব² + ভূমি² (পিথাগোরাস)। c² এর সাথে a² + b² তুলনা করে সূক্ষ্মকোণী, সমকোণী নাকি স্থূলকোণী ত্রিভুজ গঠিত হবে তা নির্ণয় করুন।',
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
    stem: '△ABC-এর BC বাহুকে D পর্যন্ত বর্ধিত করা হলো। ∠B = 60° এবং ∠C = 40°। শীর্ষবিন্দু A দিয়ে BC-এর সমান্তরাল রেখা AE টানা হলো।',
    partA: {
      question: 'সন্নিহিত কোণ ও সরলকোণ কাকে বলে?',
      marks: 2,
      answer: 'সন্নিহিত কোণ ও সরলকোণের সংজ্ঞা ও চিত্র',
      steps: [
        'যদি দুটি কোণের একই শীর্ষবিন্দু হয় এবং তাদের একটি সাধারণ বাহু থাকে এবং কোণদ্বয় সাধারণ বাহুর বিপরীত পাশে অবস্থান করে, তবে কোণদ্বয়কে পরস্পর সন্নিহিত কোণ বলে।',
        'দুটি পরস্পর বিপরীত রশ্মি তাদের সাধারণ প্রান্তবিন্দুতে যে কোণ উৎপন্ন করে, তাকে সরলকোণ বলে। ১ সরলকোণ = ১৮০° বা ২ সমকোণ।',
      ],
      examinerTip:
        '"সাধারণ শীর্ষবিন্দু ও সাধারণ বাহুর বিপরীত পাশে অবস্থিত" এই দুটি শর্ত সংজ্ঞায় উল্লেখ করলে পূর্ণ ২ নম্বর নিশ্চিত হয়।',
    },
    partB: {
      question: 'বহিঃস্থ ∠ACD এবং অন্তঃস্থ ∠A এর মান নির্ণয় কর।',
      marks: 4,
      answer: '∠A = 80°, বহিঃস্থ ∠ACD = 140°',
      steps: [
        'আমরা জানি, ত্রিভুজের তিন কোণের সমষ্টি ১৮০°।',
        'অতএব, △ABC-তে: ∠A + ∠B + ∠C = 180°',
        'বা, ∠A + 60° + 40° = 180°',
        'বা, ∠A + 100° = 180° ⇒ ∠A = 180° - 100° = 80°',
        'আবার, উপপাদ্য ১৭ অনুসারে: ত্রিভুজের কোনো বাহুকে বর্ধিত করলে যে বহিঃস্থ কোণ উৎপন্ন হয়, তা বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টির সমান।',
        'অতএব, বহিঃস্থ ∠ACD = ∠A + ∠B',
        '= 80° + 60° = 140°',
        '[অথবা, সরলকোণ দিয়ে: ∠ACD = 180° - ∠ACB = 180° - 40° = 140°]',
      ],
      rubric: [
        { step: 'ত্রিভুজের তিন কোণের সমষ্টি ১৮০° সূত্র প্রয়োগ', mark: '১ নম্বর' },
        { step: '∠A এর মান ৮০° সঠিকভাবে নির্ণয়', mark: '১ নম্বর' },
        { step: 'বহিঃস্থ কোণ উপপাদ্যের বিবৃতি বা সরলকোণ যুক্তি', mark: '১ নম্বর' },
        { step: '∠ACD = ১৪০° চূড়ান্ত মান প্রতিষ্ঠা', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'উপপাদ্য ১৭-এর উদ্ধৃতি ("বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টির সমান") সাইডনোট হিসেবে দিলে পরীক্ষক অত্যন্ত সন্তুষ্ট হন এবং পূর্ণ ৪ নম্বর প্রদান করেন।',
    },
    partC: {
      question: 'প্রমাণ কর যে, ত্রিভুজের তিন কোণের সমষ্টি দুই সমকোণ (∠A + ∠B + ∠C = 180°)।',
      marks: 4,
      answer: 'প্রমাণিত (উপপাদ্য ১৬)',
      steps: [
        'বিশেষ নির্বচন: মনে করি, △ABC একটি ত্রিভুজ। প্রমাণ করতে হবে যে, ∠A + ∠B + ∠C = ২ সমকোণ।',
        'অঙ্কন: BC বাহুকে D পর্যন্ত বর্ধিত করি এবং C বিন্দু দিয়ে BA এর সমান্তরাল করে CE রেখাংশ আঁকি।',
        'প্রমাণ ধাপ ১: BA ∥ CE এবং AC তাদের ছেদক। সুতরাং একান্তর কোণ ∠BAC = ∠ACE ... (i)',
        'প্রমাণ ধাপ ২: BA ∥ CE এবং BCD তাদের ছেদক। সুতরাং অনুরূপ কোণ ∠ABC = ∠ECD ... (ii)',
        'প্রমাণ ধাপ ৩: সমীকরণ (i) ও (ii) যোগ করে পাই: ∠BAC + ∠ABC = ∠ACE + ∠ECD = ∠ACD',
        'প্রমাণ ধাপ ৪: উভয়পক্ষে ∠ACB যোগ করে পাই: ∠BAC + ∠ABC + ∠ACB = ∠ACD + ∠ACB',
        'যেহেতু BCD একটি সরলরেখা, অতএব ∠ACD + ∠ACB = ১ সরলকোণ = ২ সমকোণ = ১৮০°।',
        'অতএব, ∠A + ∠B + ∠C = ২ সমকোণ। [প্রমাণিত]',
      ],
      rubric: [
        { step: 'চিত্র ও বিশেষ নির্বচন নির্ভুলভাবে লেখা', mark: '১ নম্বর' },
        { step: 'অঙ্কন (BA ∥ CE আঁকা) স্পষ্ট উল্লেখ করা', mark: '১ নম্বর' },
        { step: 'একান্তর কোণ ও অনুরূপ কোণ দ্বারা কোণ সমীকরণ গঠন', mark: '১ নম্বর' },
        { step: 'সরলকোণ যুক্তিতে ১৮০° প্রমাণ সম্পন্ন করা', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'অঙ্কনে সমান্তরাল রেখা CE স্পষ্ট চিহ্নিত না করলে জ্যামিতির এই মৌলিক উপপাদ্যে সরাসরি ১ নম্বর কাটা যায়। পেনসিল দিয়ে পরিচ্ছন্ন চিত্র আঁকুন।',
    },
  },
  {
    id: 2,
    boardSource: 'রাজশাহী ও কুমিল্লা বোর্ড সমন্বিত • এসএসসি স্ট্যান্ডার্ড',
    stem: 'দুটি সমান্তরাল সরলরেখা AB ও CD-কে একটি ছেদক EF যথাক্রমে P ও Q বিন্দুতে ছেদ করেছে। অপর একটি ত্রিভুজ △XYZ-এ XY = XZ এবং ∠Y = 50°।',
    partA: {
      question: 'একান্তর কোণ ও অনুরূপ কোণের মূল জ্যামিতিক বৈশিষ্ট্য লিখ।',
      marks: 2,
      answer: 'একান্তর ও অনুরূপ কোণের বৈশিষ্ট্য',
      steps: [
        'একান্তর কোণ: ছেদকের বিপরীত পাশে এবং সমান্তরাল রেখাদ্বয়ের ভেতরের দিকে উৎপন্ন হয় (Z-আকৃতি), এবং সমান্তরাল রেখার ক্ষেত্রে এরা পরস্পর সমান।',
        'অনুরূপ কোণ: ছেদকের একই পাশে এবং সমান্তরাল রেখাদ্বয়ের একই দিকে (উপরে বা নিচে) উৎপন্ন হয় (F-আকৃতি), এবং সমান্তরাল রেখার ক্ষেত্রে এরা পরস্পর সমান।',
      ],
      examinerTip:
        'ছেদকের বিপরীত পাশ (একান্তর) এবং একই পাশ (অনুরূপ) এই মূল পার্থক্যটি তুলে ধরুন।',
    },
    partB: {
      question: 'যদি ছেদকের একপাশের অন্তঃস্থ কোণ ∠APQ = 110° হয়, তবে বাকি ৭টি কোণের মান নির্ণয় কর।',
      marks: 4,
      answer: '৮টি কোণের মান: চারটি 110° এবং চারটি 70°',
      steps: [
        'দেওয়া আছে, ∠APQ = 110°',
        '১. সন্নিহিত কোণ: ∠BPQ = 180° - 110° = 70°',
        '২. বিপ্রতীপ কোণ: ∠E(উপরের বিপরীত) = ∠APQ = 110° এবং ∠E(অপর বিপরীত) = 70°',
        '৩. একান্তর কোণ: AB ∥ CD এবং PQ ছেদক। সুতরাং একান্তর ∠PQD = ∠APQ = 110°',
        '৪. অনুরূপ কোণ: ∠PQC = ∠APQ এর একান্তর বা ∠BPQ এর অনুরূপ = 70°',
        '৫. নিচের বাকি কোণদ্বয়: বিপ্রতীপ হিসেবে 110° এবং 70°।',
        'ফলাফল: ৮টি কোণের মধ্যে চারটি কোণের মান 110° এবং চারটি কোণের মান 70°।',
      ],
      rubric: [
        { step: 'সন্নিহিত কোণ থেকে ৭০° নির্ণয়', mark: '১ নম্বর' },
        { step: 'বিপ্রতীপ কোণ সূত্র প্রয়োগ করে কোণ নির্ণয়', mark: '১ নম্বর' },
        { step: 'একান্তর ও অনুরূপ কোণ যুক্তিতে Q বিন্দুর কোণগুলো নির্ণয়', mark: '১ নম্বর' },
        { step: '৮টি কোণের সমন্বিত চার্ট উপস্থাপন', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'সবগুলো কোণ নির্ণয়ের পর স্পষ্ট করে লিখবেন: স্থূলকোণ ৪টিই ১১০° এবং সূক্ষ্মকোণ ৪টিই ৭০°। এটি পরীক্ষকের খাতা দেখা সহজ করে।',
    },
    partC: {
      question: '△XYZ ত্রিভুজটিতে ∠X এর মান কত? ত্রিভুজটির সর্বসমতা প্রমাণের শর্ত আলোচনা কর।',
      marks: 4,
      answer: '∠X = 80°, সর্বসমতার শর্তাবলি',
      steps: [
        'দেওয়া আছে, △XYZ-এ XY = XZ (সমদ্বিবাহু ত্রিভুজ)।',
        'আমরা জানি, ত্রিভুজের সমান সমান বাহুর বিপরীত কোণদ্বয় পরস্পর সমান।',
        'অতএব, ∠Z = ∠Y = 50°',
        'ত্রিভুজের তিন কোণের সমষ্টি ১৮০° হওয়ায়:',
        '∠X + ∠Y + ∠Z = 180° ⇒ ∠X + 50° + 50° = 180°',
        'বা, ∠X + 100° = 180° ⇒ ∠X = 80°।',
        'যদি অন্য একটি ত্রিভুজ △PQR এর সাথে সর্বসম করতে হয়, তবে SAS শর্তে: XY = PQ, XZ = PR এবং অন্তর্ভুক্ত ∠X = ∠P হতে হবে।',
      ],
      rubric: [
        { step: 'সমদ্বিবাহু ত্রিভুজের বিপরীত কোণ সমান যুক্তি প্রয়োগ', mark: '১ নম্বর' },
        { step: '∠Z = ৫০° নির্ধারণ', mark: '১ নম্বর' },
        { step: 'কোণ সমষ্টি সূত্র দিয়ে ∠X = ৮০° নির্ণয়', mark: '১ নম্বর' },
        { step: 'সর্বসমতার অন্তর্ভুক্ত কোণ (SAS) ব্যাখ্যা', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'সমদ্বিবাহু ত্রিভুজের উপপাদ্যটি উল্লেখ করতে ভুলবেন না: "কোনো ত্রিভুজের দুটি বাহু সমান হলে এদের বিপরীত কোণ দুটিও সমান।"',
    },
  },
  {
    id: 3,
    boardSource: 'যশোর ও দিনাজপুর বোর্ড সমন্বিত • এসএসসি স্ট্যান্ডার্ড',
    stem: 'একটি সমকোণী ত্রিভুজের সমকোণ সংলগ্ন বাহুদ্বয় যথাক্রমে 6 সেমি এবং 8 সেমি। অপর একটি ত্রিভুজের বাহুত্রয় যথাক্রমে 4 সেমি, 5 সেমি এবং 10 সেমি।',
    partA: {
      question: 'ত্রিভুজ গঠনের মৌলিক শর্ত কী? দ্বিতীয় ত্রিভুজটি কি গঠিত হবে?',
      marks: 2,
      answer: 'না, দ্বিতীয় ত্রিভুজটি গঠিত হবে না (৪ + ৫ = ৯ < ১০)',
      steps: [
        'ত্রিভুজ গঠনের মৌলিক শর্ত: ত্রিভুজের যেকোনো দুই বাহুর সমষ্টি তার তৃতীয় বাহু অপেক্ষা বৃহত্তর হতে হবে (a + b > c)।',
        'দ্বিতীয় ক্ষেত্রে: বাহুত্রয় 4 সেমি, 5 সেমি ও 10 সেমি।',
        'এখানে ক্ষুদ্রতম দুই বাহুর যোগফল = 4 + 5 = 9 সেমি, যা তৃতীয় বাহু 10 সেমি অপেক্ষা ছোট (9 < 10)।',
        'অতএব, এই বাহুগুলো দিয়ে কোনো ত্রিভুজ গঠন সম্ভব নয়।',
      ],
      examinerTip:
        'শুধু "গঠিত হবে না" লিখলে ১ নম্বর পাবেন। "৪ + ৫ = ৯ < ১০" অসমতা লিখে যুক্তি দেখালে তবেই পূর্ণ ২ নম্বর পাবেন।',
    },
    partB: {
      question: 'প্রথম সমকোণী ত্রিভুজটির অতিভুজের দৈর্ঘ্য এবং ক্ষেত্রফল নির্ণয় কর।',
      marks: 4,
      answer: 'অতিভুজ = 10 সেমি, ক্ষেত্রফল = 24 বর্গ সেমি',
      steps: [
        'ধরি, লম্ব a = 6 সেমি এবং ভূমি b = 8 সেমি।',
        'পিথাগোরাসের উপপাদ্য অনুসারে:',
        'অতিভুজ² = লম্ব² + ভূমি²',
        'বা, c² = 6² + 8² = 36 + 64 = 100',
        'অতএব, অতিভুজ c = √100 = 10 সেমি।',
        'সমকোণী ত্রিভুজের ক্ষেত্রফল = ১/২ × ভূমি × লম্ব',
        '= ১/২ × 8 × 6 = 24 বর্গ সেমি।',
      ],
      rubric: [
        { step: 'পিথাগোরাসের উপপাদ্যের সূত্র লেখা', mark: '১ নম্বর' },
        { step: 'বর্গের সমষ্টি ৩৬ + ৬৪ = ১০০ নির্ণয়', mark: '১ নম্বর' },
        { step: 'অতিভুজ = ১০ সেমি প্রতিষ্ঠা', mark: '১ নম্বর' },
        { step: 'ক্ষেত্রফল ২৪ বর্গ সেমি এককে নির্ণয়', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'ক্ষেত্রফলের এককে "বর্গ সেমি" লিখতে ভুলে গেলে সরাসরি আধা নম্বর কাটা যায়। এককের ব্যাপারে সতর্ক থাকুন।',
    },
    partC: {
      question: 'প্রমাণ কর যে, ত্রিভুজের যেকোনো দুই বাহুর সমষ্টি তার তৃতীয় বাহু অপেক্ষা বৃহত্তর।',
      marks: 4,
      answer: 'প্রমাণিত (উপপাদ্য)',
      steps: [
        'বিশেষ নির্বচন: মনে করি, △ABC একটি ত্রিভুজ। এর বৃহত্তম বাহু BC। প্রমাণ করতে হবে যে, AB + AC > BC।',
        'অঙ্কন: BA বাহুকে D পর্যন্ত এমনভাবে বর্ধিত করি যেন AD = AC হয়। C, D যোগ করি।',
        'প্রমাণ ধাপ ১: △ACD-এ AD = AC হওয়ায় ∠ACD = ∠ADC ... (i)',
        'প্রমাণ ধাপ ২: চিত্রে ∠BCD = ∠BCA + ∠ACD > ∠ACD = ∠ADC',
        'বা, ∠BCD > ∠BDC [যেহেতু ∠ADC এবং ∠BDC একই কোণ]।',
        'প্রমাণ ধাপ ৩: △BCD-এ বৃহত্তম কোণের বিপরীত বাহু বৃহত্তর।',
        'যেহেতু ∠BCD > ∠BDC, অতএব BD > BC।',
        'বা, BA + AD > BC',
        'যেহেতু AD = AC (অঙ্কনানুসারে), অতএব AB + AC > BC। [প্রমাণিত]',
      ],
      rubric: [
        { step: 'বিশেষ নির্বচন ও স্পষ্ট জ্যামিতিক চিত্র', mark: '১ নম্বর' },
        { step: 'অঙ্কন: BA কে বর্ধিত করে AD = AC আঁকা', mark: '১ নম্বর' },
        { step: '∠BCD > ∠BDC কোণ অসমতা প্রতিষ্ঠা', mark: '১ নম্বর' },
        { step: 'BD > BC থেকে AB + AC > BC প্রমাণ সম্পন্ন', mark: '১ নম্বর' },
      ],
      examinerSecret:
        'এই উপপাদ্যটি এসএসসিতে প্রায় প্রতি বছর কোনো না কোনো বোর্ডে আসে। বর্ধিতাংশ AD = AC অঙ্কনটি স্পষ্টভাবে চিহ্নিত রাখবেন।',
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
    question: 'একটি ত্রিভুজের তিন কোণের অনুপাত ১ : ২ : ৩ হলে বৃহত্তম কোণটির মান কত?',
    options: ['30°', '60°', '90°', '120°'],
    correctIndex: 2,
    explanation:
      'কোণত্রয় x, 2x, 3x হলে: x + 2x + 3x = 180° ⇒ 6x = 180° ⇒ x = 30°। অতএব বৃহত্তম কোণ 3x = 3 × 30° = 90°।',
  },
  {
    id: 2,
    question: 'নিচের কোন বাহুত্রয় দ্বারা একটি ত্রিভুজ গঠন সম্ভব?',
    options: ['2 সেমি, 3 সেমি, 5 সেমি', '3 সেমি, 4 সেমি, 5 সেমি', '1 সেমি, 2 সেমি, 4 সেমি', '4 সেমি, 5 সেমি, 10 সেমি'],
    correctIndex: 1,
    explanation:
      'ত্রিভুজ গঠনের শর্ত হলো ক্ষুদ্রতম দুই বাহুর সমষ্টি তৃতীয় বাহু অপেক্ষা বৃহত্তর হতে হবে। এখানে 3 + 4 = 7 > 5, সুতরাং এটি দিয়ে ত্রিভুজ গঠন সম্ভব। বাকিগুলোতে সমষ্টি সমান বা ছোট।',
  },
  {
    id: 3,
    question: 'নিচের কোনটি দুটি ত্রিভুজের সর্বসমতার (Congruence) শর্ত নয়?',
    options: ['বাহু-কোণ-বাহু (SAS)', 'কোণ-বাহু-কোণ (ASA)', 'কোণ-কোণ-কোণ (AAA)', 'বাহু-বাহু-বাহু (SSS)'],
    correctIndex: 2,
    explanation:
      'কোণ-কোণ-কোণ (AAA) কেবল দুটি ত্রিভুজকে সদৃশ (Similar) করে, সর্বসম করে না; কারণ আকার বড়-ছোট হতে পারে। বাকি তিনটি সর্বসমতার অনুমোদিত শর্ত।',
  },
  {
    id: 4,
    question: 'দুটি সমান্তরাল সরলরেখাকে একটি ছেদক ছেদ করলে একান্তর কোণদ্বয় কেমন হয়?',
    options: ['পরস্পর সমান', 'পরস্পর সম্পূরক', 'পরস্পর পূরক', 'দ্বিগুণ'],
    correctIndex: 0,
    explanation:
      'সমান্তরাল রেখার ক্ষেত্রে একান্তর কোণদ্বয় (Z-আকৃতি) সর্বদা পরস্পর সমান হয়।',
  },
  {
    id: 5,
    question: 'একটি সমকোণী ত্রিভুজের একটি সূক্ষ্মকোণ 35° হলে অপর সূক্ষ্মকোণটি কত?',
    options: ['45°', '55°', '65°', '145°'],
    correctIndex: 1,
    explanation:
      'সমকোণী ত্রিভুজের একটি কোণ 90° হওয়ায় বাকি দুটি সূক্ষ্মকোণের সমষ্টি 90° (পূরক)। অতএব অপর সূক্ষ্মকোণ = 90° - 35° = 55°।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathLinesTrianglesGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'practice' | 'quiz' | 'summary'>(
    'learn'
  );
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1: Adjacent & Vertically Opposite Angles State
  const [linearPairAngle, setLinearPairAngle] = useState<number>(65);

  // Lab 2: Parallel Lines & Transversal State
  const [transversalAngle, setTransversalAngle] = useState<number>(60);
  const [highlightTransType, setHighlightTransType] = useState<'alternate' | 'corresponding' | 'interior'>('alternate');

  // Lab 3: Triangle Angle Sum State
  const [triangleAngleA, setTriangleAngleA] = useState<number>(70);
  const [triangleAngleB, setTriangleAngleB] = useState<number>(50);

  // Lab 4: Congruence Criteria State
  const [congruenceType, setCongruenceType] = useState<'SAS' | 'SSS' | 'ASA' | 'RHS'>('SAS');

  // Lab 5: Pythagoras & Triangle Inequality State
  const [sideA, setSideA] = useState<number>(3);
  const [sideB, setSideB] = useState<number>(4);
  const [sideC, setSideC] = useState<number>(5);

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
      text: 'নমস্কার দোস্ত! আমি শেরু — তোমার জ্যামিতি সহচর 🦁। রেখা, সমান্তরাল ছেদক, ত্রিভুজের ১৮০° উপপাদ্য বা সর্বসমতার যেকোনো কঠিন প্রমাণ নিয়ে আমাকে প্রশ্ন করতে পারো!',
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

  // Sheru Quick Prompt Click
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
      'দারুণ প্রশ্ন! জ্যামিতির মূল রহস্য হলো যুক্তি ও চিত্র। যেকোনো উপপাদ্য, সর্বসমতার শর্ত বা সমান্তরাল রেখার ধর্ম নিয়ে সুনির্দিষ্ট প্রশ্ন থাকলে বলো!';

    if (userText.includes('১৮০') || userText.includes('সমষ্টি') || userText.includes('উপপাদ্য ১৬')) {
      reply =
        'ত্রিভুজের তিন কোণের সমষ্টি ১৮০° প্রমাণ করতে শীর্ষবিন্দু দিয়ে ভূমির সমান্তরাল রেখা আঁকতে হয়। তখন একান্তর কোণ ও সন্নিহিত কোণ মিলে একটি সরলকোণ (১৮০°) গঠন করে!';
    } else if (userText.includes('সর্বসম') || userText.includes('AAA') || userText.includes('শর্ত')) {
      reply =
        'সর্বসমতার ৪টি শর্ত: SAS, SSS, ASA এবং সমকোণীতে RHS। কিন্তু AAA কখনো সর্বসম করে না, শুধু সদৃশ করে! কারণ কোণ এক রেখে বাহু যেকোনো অনুপাতে বড় করা যায়!';
    } else if (userText.includes('পিথাগোরাস') || userText.includes('অসমতা') || userText.includes('ত্রিভুজ গঠন')) {
      reply =
        'মনে রাখবে: ত্রিভুজ গঠনের জন্য যেকোনো দুই বাহুর সমষ্টি ৩য় বাহু থেকে বড় হতে হবে (a + b > c)। আর সমকোণী হলে অতিভুজ² = লম্ব² + ভূমি²!';
    }

    setSheruChat((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'sheru', text: reply },
    ]);
  };

  const handleCopyNotes = () => {
    const textToCopy = `[ শেরাতutor • নবম-দশম শ্রেণি সাধারণ গণিত: অধ্যায় ৬ রেখা, কোণ ও ত্রিভুজ রিভিশন নোট ]
১. সন্নিহিত ও বিপ্রতীপ কোণ (উপপাদ্য ১৫):
   • সরলরেখার ওপর কোনো রশ্মি মিলিত হলে সন্নিহিত কোণদ্বয়ের সমষ্টি ১৮০° (২ সমকোণ)।
   • দুটি রেখা পরস্পর ছেদ করলে উৎপন্ন বিপ্রতীপ কোণদ্বয় সর্বদা পরস্পর সমান।
২. সমান্তরাল রেখা ও ছেদক:
   • একান্তর কোণদ্বয় পরস্পর সমান (Z-আকৃতি)।
   • অনুরূপ কোণদ্বয় পরস্পর সমান (F-আকৃতি)।
   • ছেদকের একই পাশের অন্তঃস্থ কোণদ্বয়ের সমষ্টি ১৮০° (C/U-আকৃতি)।
৩. ত্রিভুজের কোণ সমষ্টি (উপপাদ্য ১৬ ও ১৭):
   • যেকোনো ত্রিভুজের তিন কোণের সমষ্টি ১৮০° বা ২ সমকোণ (∠A + ∠B + ∠C = 180°)।
   • ত্রিভুজের বাহু বর্ধিত করলে উৎপন্ন বহিঃস্থ কোণ = বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টি।
৪. ত্রিভুজের সর্বসমতার ৪টি শর্ত:
   • বাহু-কোণ-বাহু (SAS)
   • বাহু-বাহু-বাহু (SSS)
   • কোণ-বাহু-কোণ (ASA)
   • সমকোণী ত্রিভুজের অতিভুজ-বাহু (RHS)
   [সতর্কতা: AAA বা SSA সর্বসমতার শর্ত নয়!]
৫. পিথাগোরাসের উপপাদ্য ও ত্রিভুজ অসমতা:
   • ত্রিভুজ গঠনের শর্ত: ক্ষুদ্রতম দুই বাহুর সমষ্টি ৩য় বাহু অপেক্ষা বৃহত্তর (a + b > c)।
   • সমকোণী ত্রিভুজ: c² = a² + b² (পিথাগোরাস)।
   • c² < a² + b² হলে সূক্ষ্মকোণী, c² > a² + b² হলে স্থূলকোণী।`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 3000);
  };

  // Helper calculations for Lab 1
  const suppAngle = 180 - linearPairAngle;

  // Helper calculations for Lab 3
  const triangleAngleC = Math.max(1, 180 - triangleAngleA - triangleAngleB);
  const exteriorAngleC = triangleAngleA + triangleAngleB;

  // Helper calculations for Lab 5
  const isTriangleValid =
    sideA + sideB > sideC && sideB + sideC > sideA && sideC + sideA > sideB;
  const pythLhs = sideA * sideA + sideB * sideB;
  const pythRhs = sideC * sideC;

  let triangleNatureBn = '';
  if (!isTriangleValid) {
    triangleNatureBn = 'ত্রিভুজ গঠিত হবে না (বাহুর অসমতা ভঙ্গ!)';
  } else if (pythRhs === pythLhs) {
    triangleNatureBn = 'সমকোণী ত্রিভুজ (Right-Angled, c² = a² + b²)';
  } else if (pythRhs < pythLhs) {
    triangleNatureBn = 'সূক্ষ্মকোণী ত্রিভুজ (Acute-Angled, c² < a² + b²)';
  } else {
    triangleNatureBn = 'স্থূলকোণী ত্রিভুজ (Obtuse-Angled, c² > a² + b²)';
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/20">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="math"
        subjectNameBn="সাধারণ গণিত"
        chapterNum={6}
        chapterTitleBn="রেখা, কোণ ও ত্রিভুজ (Lines, Angles & Triangles)"
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Step Navigation Bar */}
        <nav className="flex items-center justify-center gap-1.5 sm:gap-3 p-1.5 rounded-2xl bg-muted/30 border border-border/50 max-w-4xl mx-auto overflow-x-auto">
          {[
            { id: 'learn', num: '১', label: 'ধারণা শিখুন', done: completedSteps.learn },
            { id: 'examples', num: '২', label: 'উদাহরণ দেখুন', done: completedSteps.examples },
            { id: 'practice', num: '৩', label: 'নিজে চেষ্টা করুন', done: completedSteps.practice },
            { id: 'quiz', num: '৪', label: 'যাচাই করুন', done: completedSteps.quiz },
            { id: 'summary', num: '৫', label: 'সারসংক্ষেপ', done: completedSteps.summary },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  markStepDone(tab.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{tab.num}.</span>
                <span>{tab.label}</span>
                {tab.done && !isActive && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ================================================================= */}
        {/* STEP 1: LEARN CONCEPT (5 INTERACTIVE LABS) */}
        {/* ================================================================= */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            {/* Chapter Hero Card */}
            <div className="p-8 rounded-3xl bg-card border border-border/60 relative overflow-hidden space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <Triangle className="h-3.5 w-3.5" />
                <span>এনসিটিবি নবম-দশম সাধারণ গণিত • অধ্যায় ৬</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                রেখা, কোণ ও ত্রিভুজ (Lines, Angles & Triangles)
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
                জ্যামিতি কেবল মুখস্থ প্রতিজ্ঞা নয়, এটি স্পষ্ট দৃষ্টি ও নিখুঁত যুক্তির বিজ্ঞান।
                সমান্তরাল রেখার একান্তর-অনুরূপ কোণ, ত্রিভুজের তিন কোণের সমষ্টি ১৮০° উপপাদ্য,
                সর্বসমতার ৪টি শর্ত এবং পিথাগোরাসের অসমতা ৫টি ইন্টারঅ্যাক্টিভ ল্যাবে আবিষ্কার করুন।
              </p>

              {/* Lab Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
                {LAB_LESSONS.map((lab) => {
                  const isCur = activeLabId === lab.id;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => setActiveLabId(lab.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all space-y-1.5 ${
                        isCur
                          ? 'bg-primary/10 border-primary text-primary shadow-sm'
                          : 'bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase">{lab.badge}</span>
                        {isCur && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      <div className="font-bold text-xs line-clamp-1 text-foreground">
                        {lab.title.split(' ')[0]} {lab.title.split(' ')[1]}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">{lab.nctbPage}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Lab Header Intro */}
            <div className="p-6 rounded-2xl bg-card/60 border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  <span>
                    {LAB_LESSONS[activeLabId - 1].badge} • {LAB_LESSONS[activeLabId - 1].nctbPage}
                  </span>
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {LAB_LESSONS[activeLabId - 1].subtitle}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {LAB_LESSONS[activeLabId - 1].title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {LAB_LESSONS[activeLabId - 1].intro}
              </p>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* LAB 1: LINES, ANGLES & ADJACENT/VERTICALLY OPPOSITE ANGLES */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-5">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>রশ্মির কোণ পরিবর্তন স্লাইডার (Ray Rotator)</span>
                    </h3>

                    {/* Angle Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">সন্নিহিত কোণ ∠AOC:</span>
                        <span className="font-mono text-sm font-bold text-primary">
                          {linearPairAngle}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="160"
                        step="5"
                        value={linearPairAngle}
                        onChange={(e) => setLinearPairAngle(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>২০° (সূক্ষ্মকোণ)</span>
                        <span>৯০° (সমকোণ)</span>
                        <span>১৬০° (স্থূলকোণ)</span>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        স্ট্যান্ডার্ড কোণ প্রিসেট:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { deg: 45, label: '৪৫°' },
                          { deg: 60, label: '৬০°' },
                          { deg: 90, label: '৯০°' },
                          { deg: 120, label: '১২০°' },
                        ].map((p) => (
                          <button
                            key={p.deg}
                            onClick={() => setLinearPairAngle(p.deg)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                              linearPairAngle === p.deg
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted/30 border-border/40 hover:bg-muted/50'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Theorem 15 Formula Card */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2 text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        উপপাদ্য ১৫ (সরলকোণ ও সন্নিহিত কোণ):
                      </span>
                      <div className="p-2.5 rounded-xl bg-background font-mono text-center font-bold text-foreground">
                        ∠AOC + ∠BOC = {linearPairAngle}° + {suppAngle}° = 180°
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        একটি সরলরেখার এক বিন্দুতে অপর একটি রশ্মি মিলিত হলে উৎপন্ন সন্নিহিত কোণদ্বয়ের সমষ্টি সর্বদা ১৮০° বা ২ সমকোণ।
                      </p>
                    </div>
                  </div>

                  {/* Vertically Opposite Angles Card */}
                  <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Compass className="h-4 w-4 text-primary" />
                      <span>বিপ্রতীপ কোণ (Vertically Opposite Angles)</span>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      দুটি সরলরেখা AB ও CD পরস্পর O বিন্দুতে ছেদ করলে উৎপন্ন চার জোড়া কোণের বিপরীত কোণগুলো সমান:
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold text-center">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                        ∠AOC = ∠BOD = {linearPairAngle}°
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                        ∠BOC = ∠AOD = {suppAngle}°
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Interactive SVG Canvas */}
                <div className="lg:col-span-7 p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>লাইভ জ্যামিতিক চিত্র (Interactive Ray Diagram)</span>
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      সমষ্টি = ১৮০° (ধ্রুবক)
                    </span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="w-full h-80 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center p-4 relative overflow-hidden">
                    <svg
                      viewBox="0 0 500 300"
                      className="w-full h-full max-h-72 select-none"
                    >
                      {/* Grid background lines */}
                      <line x1="50" y1="200" x2="450" y2="200" stroke="currentColor" strokeWidth="3" className="text-foreground" />
                      {/* Vertex O */}
                      <circle cx="250" cy="200" r="5" className="fill-primary" />
                      <text x="245" y="225" className="text-xs font-bold fill-foreground">O</text>

                      {/* Line Endpoints */}
                      <text x="35" y="205" className="text-xs font-bold fill-foreground font-mono">A</text>
                      <text x="455" y="205" className="text-xs font-bold fill-foreground font-mono">B</text>

                      {/* Dynamic Ray OC */}
                      {(() => {
                        const rad = (linearPairAngle * Math.PI) / 180;
                        const rayLen = 140;
                        const rayX = 250 - rayLen * Math.cos(rad);
                        const rayY = 200 - rayLen * Math.sin(rad);

                        // Ray OD (vertically opposite)
                        const oppX = 250 + rayLen * Math.cos(rad);
                        const oppY = 200 + rayLen * Math.sin(rad);

                        return (
                          <>
                            {/* Main Ray OC */}
                            <line
                              x1="250"
                              y1="200"
                              x2={rayX}
                              y2={rayY}
                              stroke="#FF6B57"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                            <circle cx={rayX} cy={rayY} r="4" fill="#FF6B57" />
                            <text x={rayX - 15} y={rayY - 10} className="text-xs font-bold fill-primary font-mono">C</text>

                            {/* Opposing ray OD (dashed for vertically opposite) */}
                            <line
                              x1="250"
                              y1="200"
                              x2={oppX}
                              y2={oppY}
                              stroke="#F59E0B"
                              strokeWidth="2.5"
                              strokeDasharray="5,5"
                              strokeLinecap="round"
                            />
                            <circle cx={oppX} cy={oppY} r="4" fill="#F59E0B" />
                            <text x={oppX + 10} y={oppY + 15} className="text-xs font-bold fill-amber-500 font-mono">D</text>

                            {/* Angle Arc 1 (AOC) */}
                            <path
                              d={`M ${250 - 40} 200 A 40 40 0 0 0 ${250 - 40 * Math.cos(rad)} ${200 - 40 * Math.sin(rad)}`}
                              fill="none"
                              stroke="#FF6B57"
                              strokeWidth="2.5"
                            />
                            <text
                              x={250 - 65 * Math.cos(rad / 2)}
                              y={200 - 55 * Math.sin(rad / 2)}
                              className="text-xs font-bold fill-primary font-mono"
                            >
                              {linearPairAngle}°
                            </text>

                            {/* Angle Arc 2 (BOC) */}
                            <path
                              d={`M ${250 + 45} 200 A 45 45 0 0 1 ${250 - 45 * Math.cos(rad)} ${200 - 45 * Math.sin(rad)}`}
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="2.5"
                            />
                            <text
                              x={250 + 60 * Math.cos((Math.PI - rad) / 2)}
                              y={200 - 60 * Math.sin((Math.PI - rad) / 2)}
                              className="text-xs font-bold fill-emerald-600 dark:fill-emerald-400 font-mono"
                            >
                              {suppAngle}°
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Real-time Equation Feedback */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="px-2 py-1 rounded-lg bg-primary/20 text-primary font-bold">
                        ∠AOC = {linearPairAngle}°
                      </span>
                      <span>+</span>
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                        ∠BOC = {suppAngle}°
                      </span>
                      <span>=</span>
                      <span className="px-2.5 py-1 rounded-lg bg-foreground text-background font-bold">
                        180°
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      {linearPairAngle === 90 ? 'উভয় কোণই সমকোণ (Perpendicular)' : 'একটি সূক্ষ্মকোণ ও একটি স্থূলকোণ'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 2: PARALLEL LINES & TRANSVERSAL ANGLES */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls & Explanation */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-5">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>ছেদকের কোণ স্লাইডার (Transversal Angle)</span>
                    </h3>

                    {/* Transversal Angle Slider */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">ছেদক কোণ θ:</span>
                        <span className="font-mono text-sm font-bold text-primary">
                          {transversalAngle}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="150"
                        step="5"
                        value={transversalAngle}
                        onChange={(e) => setTransversalAngle(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>৩০°</span>
                        <span>৯০° (লম্ব ছেদক)</span>
                        <span>১৫০°</span>
                      </div>
                    </div>

                    {/* Relationship Highlight Toggles */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        কোণ সম্পর্ক হাইলাইট নির্বাচন করুন:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setHighlightTransType('alternate')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            highlightTransType === 'alternate'
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-muted/30 border-border/40 hover:bg-muted/50'
                          }`}
                        >
                          একান্তর কোণ (Z)
                        </button>
                        <button
                          onClick={() => setHighlightTransType('corresponding')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            highlightTransType === 'corresponding'
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-muted/30 border-border/40 hover:bg-muted/50'
                          }`}
                        >
                          অনুরূপ কোণ (F)
                        </button>
                        <button
                          onClick={() => setHighlightTransType('interior')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            highlightTransType === 'interior'
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-muted/30 border-border/40 hover:bg-muted/50'
                          }`}
                        >
                          অন্তঃস্থ কোণ (C)
                        </button>
                      </div>
                    </div>

                    {/* Active Relation Explanation */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2 text-xs">
                      {highlightTransType === 'alternate' && (
                        <>
                          <span className="font-bold text-primary flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            একান্তর কোণ (Alternate Angles - Z Shape):
                          </span>
                          <p className="text-[11px] text-foreground leading-relaxed">
                            ছেদকের বিপরীত পাশে এবং সমান্তরাল রেখাদ্বয়ের অভ্যন্তরে উৎপন্ন হয়।
                            <br />
                            <strong>∠3 = ∠5 = {transversalAngle}°</strong> এবং{' '}
                            <strong>∠4 = ∠6 = {180 - transversalAngle}°</strong>।
                          </p>
                        </>
                      )}
                      {highlightTransType === 'corresponding' && (
                        <>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            অনুরূপ কোণ (Corresponding Angles - F Shape):
                          </span>
                          <p className="text-[11px] text-foreground leading-relaxed">
                            ছেদকের একই পাশে এবং সমান্তরাল রেখাদ্বয়ের একই অবস্থানে (উপরে বা নিচে) থাকে।
                            <br />
                            <strong>∠1 = ∠5 = {transversalAngle}°</strong> এবং{' '}
                            <strong>∠2 = ∠6 = {180 - transversalAngle}°</strong>।
                          </p>
                        </>
                      )}
                      {highlightTransType === 'interior' && (
                        <>
                          <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            ছেদকের একই পাশের অন্তঃস্থ কোণ (Consecutive Interior):
                          </span>
                          <p className="text-[11px] text-foreground leading-relaxed">
                            ছেদকের একই পাশের দুই ভেতরের কোণের সমষ্টি সর্বদা ১৮০° বা ২ সমকোণ।
                            <br />
                            <strong>
                              ∠4 + ∠5 = {180 - transversalAngle}° + {transversalAngle}° = 180°
                            </strong>
                            ।
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Interactive SVG Canvas */}
                <div className="lg:col-span-7 p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>সমান্তরাল রেখা ও ছেদক ডায়াগ্রাম (AB ∥ CD & EF)</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      AB ∥ CD
                    </span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="w-full h-80 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center p-4 relative overflow-hidden">
                    <svg
                      viewBox="0 0 500 300"
                      className="w-full h-full max-h-72 select-none"
                    >
                      {/* Parallel Line 1: AB (y = 90) */}
                      <line x1="40" y1="90" x2="460" y2="90" stroke="currentColor" strokeWidth="3" className="text-foreground" />
                      <text x="25" y="95" className="text-xs font-bold fill-foreground font-mono">A</text>
                      <text x="470" y="95" className="text-xs font-bold fill-foreground font-mono">B</text>

                      {/* Parallel Line 2: CD (y = 210) */}
                      <line x1="40" y1="210" x2="460" y2="210" stroke="currentColor" strokeWidth="3" className="text-foreground" />
                      <text x="25" y="215" className="text-xs font-bold fill-foreground font-mono">C</text>
                      <text x="470" y="215" className="text-xs font-bold fill-foreground font-mono">D</text>

                      {/* Transversal Line EF */}
                      {(() => {
                        const rad = (transversalAngle * Math.PI) / 180;
                        const p1x = 220;
                        const p1y = 90;
                        const p2x = 280;
                        const p2y = 210;

                        // Calculate line extension
                        const dx = (p2x - p1x);
                        const dy = (p2y - p1y);
                        const ext1X = p1x - dx * 0.4;
                        const ext1Y = p1y - dy * 0.4;
                        const ext2X = p2x + dx * 0.4;
                        const ext2Y = p2y + dy * 0.4;

                        return (
                          <>
                            {/* Transversal EF */}
                            <line
                              x1={ext1X}
                              y1={ext1Y}
                              x2={ext2X}
                              y2={ext2Y}
                              stroke="#FF6B57"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <text x={ext1X - 10} y={ext1Y - 10} className="text-xs font-bold fill-primary font-mono">E</text>
                            <text x={ext2X + 10} y={ext2Y + 15} className="text-xs font-bold fill-primary font-mono">F</text>

                            {/* Intersection points P and Q */}
                            <circle cx={p1x} cy={p1y} r="4" className="fill-primary" />
                            <text x={p1x - 18} y={p1y - 8} className="text-xs font-bold fill-foreground font-mono">P</text>

                            <circle cx={p2x} cy={p2y} r="4" className="fill-primary" />
                            <text x={p2x + 10} y={p2y + 18} className="text-xs font-bold fill-foreground font-mono">Q</text>

                            {/* Angle 1 highlight (P upper right) */}
                            <circle
                              cx={p1x + 20}
                              cy={p1y - 20}
                              r="12"
                              className={
                                highlightTransType === 'corresponding'
                                  ? 'fill-emerald-500/40 stroke-emerald-500 stroke-2'
                                  : 'fill-muted/20'
                              }
                            />
                            <text x={p1x + 15} y={p1y - 15} className="text-[10px] font-bold fill-foreground">1</text>

                            {/* Angle 3 highlight (P lower right - alternate) */}
                            <circle
                              cx={p1x + 22}
                              cy={p1y + 20}
                              r="12"
                              className={
                                highlightTransType === 'alternate'
                                  ? 'fill-primary/40 stroke-primary stroke-2'
                                  : 'fill-muted/20'
                              }
                            />
                            <text x={p1x + 18} y={p1y + 24} className="text-[10px] font-bold fill-foreground">3</text>

                            {/* Angle 4 highlight (P lower left - interior) */}
                            <circle
                              cx={p1x - 22}
                              cy={p1y + 20}
                              r="12"
                              className={
                                highlightTransType === 'interior'
                                  ? 'fill-amber-500/40 stroke-amber-500 stroke-2'
                                  : 'fill-muted/20'
                              }
                            />
                            <text x={p1x - 26} y={p1y + 24} className="text-[10px] font-bold fill-foreground">4</text>

                            {/* Angle 5 highlight (Q upper left - alternate & corresponding & interior) */}
                            <circle
                              cx={p2x - 22}
                              cy={p2y - 20}
                              r="12"
                              className={
                                highlightTransType === 'alternate'
                                  ? 'fill-primary/40 stroke-primary stroke-2'
                                  : highlightTransType === 'corresponding'
                                  ? 'fill-emerald-500/40 stroke-emerald-500 stroke-2'
                                  : 'fill-amber-500/40 stroke-amber-500 stroke-2'
                              }
                            />
                            <text x={p2x - 26} y={p2y - 16} className="text-[10px] font-bold fill-foreground">5</text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Angle Summary Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono font-bold text-center">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      ∠3 (একান্তর) = {transversalAngle}°
                    </div>
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      ∠5 (একান্তর) = {transversalAngle}°
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      ∠1 (অনুরূপ) = {transversalAngle}°
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                      ∠4 (অন্তঃস্থ) = {180 - transversalAngle}°
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 3: TRIANGLE ANGLE SUM 180° & EXTERIOR ANGLE THEOREM */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sliders & Theorems */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-5">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>ত্রিভুজের কোণ স্লাইডার (Triangle Angles)</span>
                    </h3>

                    {/* Angle A Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">কোণ ∠A:</span>
                        <span className="font-mono text-sm font-bold text-primary">
                          {triangleAngleA}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        step="5"
                        value={triangleAngleA}
                        onChange={(e) => {
                          const newA = Number(e.target.value);
                          if (newA + triangleAngleB < 175) {
                            setTriangleAngleA(newA);
                          }
                        }}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Angle B Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">কোণ ∠B:</span>
                        <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {triangleAngleB}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        step="5"
                        value={triangleAngleB}
                        onChange={(e) => {
                          const newB = Number(e.target.value);
                          if (triangleAngleA + newB < 175) {
                            setTriangleAngleB(newB);
                          }
                        }}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    {/* Calculated Angle C */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-muted-foreground">স্বয়ংক্রিয়ভাবে ৩য় কোণ ∠C:</span>
                        <span className="font-mono text-sm text-foreground">
                          {triangleAngleC}°
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-background font-mono text-xs text-center font-bold text-foreground">
                        ∠A + ∠B + ∠C = {triangleAngleA}° + {triangleAngleB}° + {triangleAngleC}° = 180°
                      </div>
                    </div>

                    {/* Theorem 17 Exterior Angle Card */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        উপপাদ্য ১৭ (বহিঃস্থ কোণ উপপাদ্য):
                      </span>
                      <div className="p-2.5 rounded-xl bg-background font-mono text-center font-bold text-foreground">
                        বহিঃস্থ ∠ACD = ∠A + ∠B = {triangleAngleA}° + {triangleAngleB}° = {exteriorAngleC}°
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        BC বাহুকে D পর্যন্ত বর্ধিত করলে উৎপন্ন বহিঃস্থ কোণটি এর বিপরীত দুই অন্তঃস্থ কোণ ∠A এবং ∠B এর যোগফলের হুবহু সমান।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Triangle Diagram */}
                <div className="lg:col-span-7 p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>লাইভ ত্রিভুজ ও বর্ধিত বহিঃস্থ কোণ (△ABC & Extended CD)</span>
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      উপপাদ্য ১৬ ও ১৭
                    </span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="w-full h-80 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center p-4 relative overflow-hidden">
                    <svg
                      viewBox="0 0 500 300"
                      className="w-full h-full max-h-72 select-none"
                    >
                      {/* Triangle Vertices */}
                      {(() => {
                        const bX = 100;
                        const bY = 220;
                        const cX = 330;
                        const cY = 220;
                        const dX = 460;
                        const dY = 220;

                        // Calculate A vertex position from angles
                        const bRad = (triangleAngleB * Math.PI) / 180;
                        const cRad = (triangleAngleC * Math.PI) / 180;
                        const baseLen = cX - bX; // 230
                        const sideC = (baseLen * Math.sin(cRad)) / Math.sin(((triangleAngleA) * Math.PI) / 180);

                        const aX = Math.round(bX + sideC * Math.cos(bRad));
                        const aY = Math.max(50, Math.round(bY - sideC * Math.sin(bRad)));

                        return (
                          <>
                            {/* Base extension line to D */}
                            <line x1={cX} y1={cY} x2={dX} y2={dY} stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="5,5" />
                            <text x={dX + 5} y={dY + 5} className="text-xs font-bold fill-amber-500 font-mono">D</text>

                            {/* Triangle Sides */}
                            <polygon
                              points={`${aX},${aY} ${bX},${bY} ${cX},${cY}`}
                              fill="rgba(255, 107, 87, 0.08)"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="text-foreground"
                            />

                            {/* Vertices Labels */}
                            <text x={aX - 5} y={aY - 12} className="text-xs font-bold fill-primary font-mono">A ({triangleAngleA}°)</text>
                            <text x={bX - 25} y={bY + 5} className="text-xs font-bold fill-emerald-600 font-mono">B ({triangleAngleB}°)</text>
                            <text x={cX - 15} y={bY + 20} className="text-xs font-bold fill-foreground font-mono">C ({triangleAngleC}°)</text>

                            {/* Vertex Points */}
                            <circle cx={aX} cy={aY} r="4" className="fill-primary" />
                            <circle cx={bX} cy={bY} r="4" className="fill-emerald-600" />
                            <circle cx={cX} cy={cY} r="4" className="fill-foreground" />

                            {/* Exterior Angle Arc at C */}
                            <circle
                              cx={cX + 30}
                              cy={cY - 15}
                              r="15"
                              className="fill-amber-500/20 stroke-amber-500 stroke-2"
                            />
                            <text x={cX + 22} y={cY - 28} className="text-xs font-bold fill-amber-500 font-mono">
                              {exteriorAngleC}°
                            </text>
                            <text x={cX + 18} y={cY - 42} className="text-[10px] font-bold fill-amber-500">
                              বহিঃস্থ ∠ACD
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-semibold">উপপাদ্য ১৬ সারাংশ:</span>
                      <p className="font-bold text-foreground">
                        ∠A + ∠B + ∠C = ১৮০° (যেকোনো ত্রিভুজের তিন কোণ সর্বদা ১ সরলকোণ)
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-semibold">উপপাদ্য ১৭ সারাংশ:</span>
                      <p className="font-bold text-amber-600 dark:text-amber-400">
                        বহিঃস্থ কোণ = বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টি ({triangleAngleA}° + {triangleAngleB}° = {exteriorAngleC}°)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 4: TRIANGLE CONGRUENCE CRITERIA (SAS, SSS, ASA, RHS) */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Selector & Rules */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-5">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-primary" />
                      <span>সর্বসমতার ৪টি শর্ত নির্বাচন করুন (Criteria Selector)</span>
                    </h3>

                    {/* Criteria Selector Tabs */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'SAS', titleBn: 'বাহু-কোণ-বাহু (SAS)', desc: '২ বাহু ও অন্তর্ভুক্ত কোণ' },
                        { id: 'SSS', titleBn: 'বাহু-বাহু-বাহু (SSS)', desc: 'তিন বাহু সমান' },
                        { id: 'ASA', titleBn: 'কোণ-বাহু-কোণ (ASA)', desc: '২ কোণ ও সংলগ্ন বাহু' },
                        { id: 'RHS', titleBn: 'অতিভুজ-বাহু (RHS)', desc: 'সমকোণী ত্রিভুজে' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCongruenceType(item.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            congruenceType === item.id
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-muted/20 border-border/40 hover:bg-muted/40 text-foreground'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.titleBn}</div>
                          <div className={`text-[10px] ${congruenceType === item.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {item.desc}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Detailed Criteria Description */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2 text-xs">
                      {congruenceType === 'SAS' && (
                        <>
                          <span className="font-bold text-primary block">
                            ১. বাহু-কোণ-বাহু উপপাদ্য (SAS - Side-Angle-Side):
                          </span>
                          <p className="text-[11px] text-foreground leading-relaxed">
                            যদি একটি ত্রিভুজের দুই বাহু এবং তাদের <strong>অন্তর্ভুক্ত কোণ</strong> অপর একটি ত্রিভুজের অনুরূপ দুই বাহু এবং তাদের অন্তর্ভুক্ত কোণের সমান হয়, তবে ত্রিভুজ দুটি সর্বসম হয়।
                          </p>
                        </>
                      )}
                      {congruenceType === 'SSS' && (
                        <>
                          <span className="font-bold text-primary block">
                            ২. বাহু-বাহু-বাহু উপপাদ্য (SSS - Side-Side-Side):
                          </span>
                          <p className="text-[11px] text-foreground leading-relaxed">
                            যদি একটি ত্রিভুজের তিন বাহু অপর একটি ত্রিভুজের অনুরূপ তিন বাহুর সমান হয়, তবে ত্রিভুজ দুটি সর্বসম হয়।
                          </p>
                        </>
                      )}
                      {congruenceType === 'ASA' && (
                        <>
                          <span className="font-bold text-primary block">
                            ৩. কোণ-বাহু-কোণ উপপাদ্য (ASA - Angle-Side-Angle):
                          </span>
                          <p className="text-[11px] text-foreground leading-relaxed">
                            যদি একটি ত্রিভুজের দুই কোণ এবং এদের <strong>সংলগ্ন বাহু</strong> অপর একটি ত্রিভুজের অনুরূপ দুই কোণ এবং সংলগ্ন বাহুর সমান হয়, তবে ত্রিভুজ দুটি সর্বসম হয়।
                          </p>
                        </>
                      )}
                      {congruenceType === 'RHS' && (
                        <>
                          <span className="font-bold text-primary block">
                            ৪. সমকোণী ত্রিভুজের অতিভুজ-বাহু উপপাদ্য (RHS):
                          </span>
                          <p className="text-[11px] text-foreground leading-relaxed">
                            যদি দুটি সমকোণী ত্রিভুজের <strong>অতিভুজদ্বয় পরস্পর সমান</strong> হয় এবং একটির যেকোনো এক বাহু অপরটির এক বাহুর সমান হয়, তবে ত্রিভুজ দুটি সর্বসম হয়।
                          </p>
                        </>
                      )}
                    </div>

                    {/* Examiner Trap Alert */}
                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="h-4 w-4" />
                        <span>মারাত্মক ফাঁদ: AAA এবং SSA সর্বসমতা নয়!</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        • <strong>AAA (কোণ-কোণ-কোণ):</strong> ত্রিভুজকে কেবল <em>সদৃশ</em> করে, সর্বসম করে না (আকার যেকোনো গুণ বড় হতে পারে)।
                        <br />
                        • <strong>SSA (বাহু-বাহু-কোণ):</strong> অন্তর্ভুক্ত কোণ না হলে দুটি ভিন্ন রূপের ত্রিভুজ তৈরি হতে পারে।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Visual Comparison */}
                <div className="lg:col-span-7 p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>সর্বসম ত্রিভুজ জোড়া (△ABC ≅ △DEF)</span>
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      △ABC ≅ △DEF
                    </span>
                  </div>

                  {/* SVG Double Triangle Canvas */}
                  <div className="w-full h-80 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center p-4 relative overflow-hidden">
                    <svg
                      viewBox="0 0 500 280"
                      className="w-full h-full max-h-72 select-none"
                    >
                      {/* Triangle 1: ABC */}
                      <g transform="translate(40, 20)">
                        <polygon
                          points="100,30 20,200 180,200"
                          fill="rgba(255, 107, 87, 0.12)"
                          stroke="#FF6B57"
                          strokeWidth="3"
                        />
                        <text x="95" y="20" className="text-xs font-bold fill-primary font-mono">A</text>
                        <text x="5" y="210" className="text-xs font-bold fill-primary font-mono">B</text>
                        <text x="185" y="210" className="text-xs font-bold fill-primary font-mono">C</text>

                        {/* SAS Match Highlights on Triangle 1 */}
                        {congruenceType === 'SAS' && (
                          <>
                            {/* Side AB tick */}
                            <line x1="55" y1="110" x2="65" y2="120" stroke="#FF6B57" strokeWidth="2.5" />
                            {/* Side AC tick */}
                            <line x1="135" y1="110" x2="145" y2="120" stroke="#FF6B57" strokeWidth="2.5" />
                            {/* Included Angle A arc */}
                            <circle cx="100" cy="50" r="10" className="fill-amber-500/30 stroke-amber-500 stroke-2" />
                          </>
                        )}

                        {/* SSS Match Highlights */}
                        {congruenceType === 'SSS' && (
                          <>
                            <line x1="55" y1="110" x2="65" y2="120" stroke="#FF6B57" strokeWidth="2.5" />
                            <line x1="135" y1="110" x2="145" y2="120" stroke="#FF6B57" strokeWidth="2.5" />
                            <line x1="95" y1="195" x2="105" y2="205" stroke="#FF6B57" strokeWidth="2.5" />
                          </>
                        )}

                        {/* RHS Highlights */}
                        {congruenceType === 'RHS' && (
                          <>
                            <rect x="20" y="180" width="16" height="16" className="fill-none stroke-foreground stroke-2" />
                            <line x1="135" y1="110" x2="145" y2="120" stroke="#10B981" strokeWidth="3" />
                            <text x="145" y="105" className="text-[10px] font-bold fill-emerald-600">অতিভুজ</text>
                          </>
                        )}
                        <text x="80" y="240" className="text-xs font-bold fill-foreground text-center">△ABC</text>
                      </g>

                      {/* Congruence Symbol in Middle */}
                      <text x="240" y="140" className="text-2xl font-extrabold fill-primary text-center">≅</text>

                      {/* Triangle 2: DEF */}
                      <g transform="translate(280, 20)">
                        <polygon
                          points="100,30 20,200 180,200"
                          fill="rgba(16, 185, 129, 0.12)"
                          stroke="#10B981"
                          strokeWidth="3"
                        />
                        <text x="95" y="20" className="text-xs font-bold fill-emerald-600 font-mono">D</text>
                        <text x="5" y="210" className="text-xs font-bold fill-emerald-600 font-mono">E</text>
                        <text x="185" y="210" className="text-xs font-bold fill-emerald-600 font-mono">F</text>

                        {/* SAS Match Highlights on Triangle 2 */}
                        {congruenceType === 'SAS' && (
                          <>
                            <line x1="55" y1="110" x2="65" y2="120" stroke="#10B981" strokeWidth="2.5" />
                            <line x1="135" y1="110" x2="145" y2="120" stroke="#10B981" strokeWidth="2.5" />
                            <circle cx="100" cy="50" r="10" className="fill-amber-500/30 stroke-amber-500 stroke-2" />
                          </>
                        )}

                        {/* SSS Match Highlights */}
                        {congruenceType === 'SSS' && (
                          <>
                            <line x1="55" y1="110" x2="65" y2="120" stroke="#10B981" strokeWidth="2.5" />
                            <line x1="135" y1="110" x2="145" y2="120" stroke="#10B981" strokeWidth="2.5" />
                            <line x1="95" y1="195" x2="105" y2="205" stroke="#10B981" strokeWidth="2.5" />
                          </>
                        )}

                        {/* RHS Highlights */}
                        {congruenceType === 'RHS' && (
                          <>
                            <rect x="20" y="180" width="16" height="16" className="fill-none stroke-foreground stroke-2" />
                            <line x1="135" y1="110" x2="145" y2="120" stroke="#10B981" strokeWidth="3" />
                            <text x="145" y="105" className="text-[10px] font-bold fill-emerald-600">অতিভুজ</text>
                          </>
                        )}
                        <text x="80" y="240" className="text-xs font-bold fill-foreground text-center">△DEF</text>
                      </g>
                    </svg>
                  </div>

                  {/* Congruence Verdict Box */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      সিদ্ধান্ত: {congruenceType} শর্তে △ABC এবং △DEF সম্পূর্ণরূপে সর্বসম!
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      অনুরূপ বাহু ও কোণগুলো পরস্পর সমান
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* LAB 5: PYTHAGORAS & TRIANGLE INEQUALITY COLLIDER */}
            {/* ------------------------------------------------------------- */}
            {activeLabId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-5">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>৩ বাহুর দৈর্ঘ্য নিয়ন্ত্রক (Side Adjusters)</span>
                    </h3>

                    {/* Side A */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">বাহু a (লম্ব):</span>
                        <span className="font-mono text-sm font-bold text-primary">{sideA}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        step="1"
                        value={sideA}
                        onChange={(e) => setSideA(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Side B */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">বাহু b (ভূমি):</span>
                        <span className="font-mono text-sm font-bold text-emerald-600">{sideB}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        step="1"
                        value={sideB}
                        onChange={(e) => setSideB(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    {/* Side C */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-muted-foreground">বাহু c (অতিভুজ/বৃহত্তম):</span>
                        <span className="font-mono text-sm font-bold text-amber-500">{sideC}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={sideC}
                        onChange={(e) => setSideC(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Pythagorean Triples Presets */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground font-semibold">
                        পিথাগোরাস ত্রয়ী প্রিসেট (Pythagorean Triples):
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { a: 3, b: 4, c: 5, label: '৩, ৪, ৫' },
                          { a: 5, b: 12, c: 13, label: '৫, ১২, ১৩' },
                          { a: 8, b: 15, c: 17, label: '৮, ১৫, ১৭' },
                        ].map((t) => (
                          <button
                            key={t.label}
                            onClick={() => {
                              setSideA(t.a);
                              setSideB(t.b);
                              setSideC(t.c);
                            }}
                            className="p-2 rounded-xl text-xs font-bold border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Triangle Inequality Rule Card */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2 text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ত্রিভুজ গঠনের শর্ত (Triangle Inequality):
                      </span>
                      <div className="font-mono text-[11px] space-y-1">
                        <div className={sideA + sideB > sideC ? 'text-emerald-600' : 'text-destructive font-bold'}>
                          • a + b &gt; c ⇒ {sideA} + {sideB} = {sideA + sideB} {sideA + sideB > sideC ? '>' : '≤'} {sideC}
                        </div>
                        <div className={sideB + sideC > sideA ? 'text-emerald-600' : 'text-destructive font-bold'}>
                          • b + c &gt; a ⇒ {sideB} + {sideC} = {sideB + sideC} {sideB + sideC > sideA ? '>' : '≤'} {sideA}
                        </div>
                        <div className={sideC + sideA > sideB ? 'text-emerald-600' : 'text-destructive font-bold'}>
                          • c + a &gt; b ⇒ {sideC} + {sideA} = {sideC + sideA} {sideC + sideA > sideB ? '>' : '≤'} {sideB}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Visual Analysis & Classification */}
                <div className="lg:col-span-7 p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5" />
                      <span>পিথাগোরাস ও কোণ শ্রেণিবিভাগ (Pythagoras Collider)</span>
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      isTriangleValid
                        ? pythRhs === pythLhs
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                      {triangleNatureBn}
                    </span>
                  </div>

                  {/* Calculations Box */}
                  <div className="p-6 rounded-2xl bg-muted/20 border border-border/40 space-y-4 font-mono text-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-card border border-border/50">
                        <span className="text-xs text-muted-foreground block mb-1">
                          লম্ব² + ভূমি² (a² + b²)
                        </span>
                        <span className="text-xl font-extrabold text-primary">
                          {sideA}² + {sideB}² = {pythLhs}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-card border border-border/50">
                        <span className="text-xs text-muted-foreground block mb-1">
                          বৃহত্তম বাহু² (c²)
                        </span>
                        <span className="text-xl font-extrabold text-amber-500">
                          {sideC}² = {pythRhs}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border/40 text-xs font-bold text-foreground">
                      {pythRhs === pythLhs && (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          c² = a² + b² ({pythRhs} = {pythLhs}) ⇒ এটি একটি খাঁটি সমকোণী ত্রিভুজ!
                        </span>
                      )}
                      {pythRhs < pythLhs && isTriangleValid && (
                        <span className="text-primary">
                          c² &lt; a² + b² ({pythRhs} &lt; {pythLhs}) ⇒ এটি একটি সূক্ষ্মকোণী ত্রিভুজ (Acute)!
                        </span>
                      )}
                      {pythRhs > pythLhs && isTriangleValid && (
                        <span className="text-amber-600 dark:text-amber-400">
                          c² &gt; a² + b² ({pythRhs} &gt; {pythLhs}) ⇒ এটি একটি স্থূলকোণী ত্রিভুজ (Obtuse)!
                        </span>
                      )}
                      {!isTriangleValid && (
                        <span className="text-destructive">
                          সতর্কতা: ক্ষুদ্রতম দুই বাহুর যোগফল {sideA + sideB} &le; {sideC} হওয়ায় রেখাংশগুলো মিলিত হয়ে ত্রিভুজ তৈরি করতে পারবে না!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3 Triangle Nature Rules */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-card border border-border/50 space-y-1">
                      <span className="font-bold text-primary block">১. সূক্ষ্মকোণী ত্রিভুজ</span>
                      <p className="text-[11px] text-muted-foreground">
                        c² &lt; a² + b² (বৃহত্তম বাহুর বর্গ অপর দুই বাহুর বর্গের সমষ্টি অপেক্ষা ছোট)।
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-card border border-border/50 space-y-1">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block">২. সমকোণী ত্রিভুজ</span>
                      <p className="text-[11px] text-muted-foreground">
                        c² = a² + b² (পিথাগোরাসের বিখ্যাত উপপাদ্য অনুযায়ী অতিভুজ গঠিত হয়)।
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-card border border-border/50 space-y-1">
                      <span className="font-bold text-amber-600 dark:text-amber-400 block">৩. স্থূলকোণী ত্রিভুজ</span>
                      <p className="text-[11px] text-muted-foreground">
                        c² &gt; a² + b² (বৃহত্তম বাহুর বর্গ অপর দুই বাহুর বর্গের সমষ্টি অপেক্ষা বড়)।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: SEE EXAMPLE (3 BOARD WORKED CQS & RUBRICS) */}
        {/* ================================================================= */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border/60 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <BookOpen className="h-3.5 w-3.5" />
                <span>বোর্ড স্ট্যান্ডার্ড ৩টি সম্পূর্ণ সৃজনশীল সমাধান</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                এসএসসি বোর্ড মডেল সৃজনশীল (Creative Questions)
              </h1>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                পরীক্ষক কীভাবে নম্বর বণ্টন করেন (Rubrics) এবং খাতার কোথায় নম্বর কাটেন (Examiner Secrets) তা সহ ক (২), খ (৪), গ (৪) এর
                নিখুঁত সমাধান নিচে বিস্তারিত দেখুন।
              </p>

              {/* CQ Tabs */}
              <div className="flex flex-wrap gap-2 pt-2">
                {BOARD_CQS.map((cq) => (
                  <button
                    key={cq.id}
                    onClick={() => setActiveCQ(cq.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      activeCQ === cq.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-muted/20 border-border/50 hover:bg-muted/40 text-foreground'
                    }`}
                  >
                    সৃজনশীল ০{cq.id}: {cq.boardSource.split('•')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Active CQ Display */}
            {(() => {
              const curCQ = BOARD_CQS.find((c) => c.id === activeCQ) || BOARD_CQS[0];
              return (
                <div className="p-8 rounded-3xl bg-card border border-border/60 space-y-6">
                  {/* Stem */}
                  <div className="p-5 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                    <span className="text-xs font-bold text-primary block">
                      উদ্দীপক (STEM) • {curCQ.boardSource}
                    </span>
                    <p className="text-sm font-semibold text-foreground leading-relaxed font-mono">
                      {curCQ.stem}
                    </p>
                  </div>

                  {/* Part A Accordion */}
                  <div className="border border-border/60 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => togglePart(`${curCQ.id}-A`)}
                      className="w-full p-4 bg-muted/10 hover:bg-muted/20 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          ক ({curCQ.partA.marks} নম্বর)
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground">
                          {curCQ.partA.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedParts[`${curCQ.id}-A`] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedParts[`${curCQ.id}-A`] && (
                      <div className="p-5 bg-background border-t border-border/50 space-y-4">
                        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-foreground">
                          {curCQ.partA.steps.map((st, i) => (
                            <p key={i}>{st}</p>
                          ))}
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                          পরীক্ষকের টিপ: {curCQ.partA.examinerTip}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part B Accordion */}
                  <div className="border border-border/60 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => togglePart(`${curCQ.id}-B`)}
                      className="w-full p-4 bg-muted/10 hover:bg-muted/20 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          খ ({curCQ.partB.marks} নম্বর)
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground">
                          {curCQ.partB.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedParts[`${curCQ.id}-B`] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedParts[`${curCQ.id}-B`] && (
                      <div className="p-5 bg-background border-t border-border/50 space-y-4">
                        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-foreground font-mono">
                          {curCQ.partB.steps.map((st, i) => (
                            <p key={i}>{st}</p>
                          ))}
                        </div>

                        {/* Rubrics */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-xs font-bold text-muted-foreground">
                            নম্বর বণ্টন রুব্রিক্স (Mark Allocation):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {curCQ.partB.rubric.map((r, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-xl bg-muted/20 border border-border/40 flex justify-between items-center"
                              >
                                <span className="text-muted-foreground">{r.step}</span>
                                <span className="font-bold text-primary font-mono">{r.mark}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                          খাতার গোপন রহস্য (Examiner Secret): {curCQ.partB.examinerSecret}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part C Accordion */}
                  <div className="border border-border/60 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => togglePart(`${curCQ.id}-C`)}
                      className="w-full p-4 bg-muted/10 hover:bg-muted/20 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          গ ({curCQ.partC.marks} নম্বর)
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground">
                          {curCQ.partC.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expandedParts[`${curCQ.id}-C`] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedParts[`${curCQ.id}-C`] && (
                      <div className="p-5 bg-background border-t border-border/50 space-y-4">
                        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-foreground font-mono">
                          {curCQ.partC.steps.map((st, i) => (
                            <p key={i}>{st}</p>
                          ))}
                        </div>

                        {/* Rubrics */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-xs font-bold text-muted-foreground">
                            নম্বর বণ্টন রুব্রিক্স (Mark Allocation):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {curCQ.partC.rubric.map((r, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-xl bg-muted/20 border border-border/40 flex justify-between items-center"
                              >
                                <span className="text-muted-foreground">{r.step}</span>
                                <span className="font-bold text-primary font-mono">{r.mark}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                          খাতার গোপন রহস্য (Examiner Secret): {curCQ.partC.examinerSecret}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: TRY YOURSELF (3 INTERACTIVE CHALLENGES) */}
        {/* ================================================================= */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border/60 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <Sliders className="h-3.5 w-3.5" />
                <span>ইন্টারেক্টিভ জ্যামিতি চ্যালেঞ্জ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                নিজে চেষ্টা করুন (Interactive Practice)
              </h1>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                খাতা-কলমে হিসাব করে উত্তর ইনপুট বক্সে লিখুন এবং যাচাই বাটনে ক্লিক করুন। সাথে সাথেই সমাধান ও ব্যাখ্যা পেয়ে যাবেন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০১</span>
                <h3 className="text-sm font-bold text-foreground">
                  ত্রিভুজের ৩য় কোণ নির্ণয়
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  ত্রিভুজের দুই কোণ 55° ও 65° হলে ৩য় কোণ = ?
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    কোণের মান লিখুন (ডিগ্রি):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal1Input}
                      onChange={(e) => setChal1Input(e.target.value)}
                      placeholder="যেমন: 60"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (chal1Input.trim() === '60') {
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
                      <span>চমৎকার! সঠিক উত্তর: ৬০°</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ ১৮০° - (৫৫° + ৬৫°) = ১৮০° - ১২০° = ৬০°।
                    </p>
                  </div>
                )}
                {chal1Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: ত্রিভুজের তিন কোণের সমষ্টি ১৮০° থেকে ৫৫ ও ৬৫ বিয়োগ করুন।</p>
                  </div>
                )}
              </div>

              {/* Challenge 2 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০২</span>
                <h3 className="text-sm font-bold text-foreground">
                  পিথাগোরাস ও অতিভুজ নির্ণয়
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  লম্ব 6 সেমি ও ভূমি 8 সেমি হলে অতিভুজ = ?
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    অতিভুজের মান লিখুন (সেমি):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal2Input}
                      onChange={(e) => setChal2Input(e.target.value)}
                      placeholder="যেমন: 10"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (chal2Input.trim() === '10') {
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
                      <span>অসাধারণ! সঠিক উত্তর: ১০ সেমি</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ √(6² + 8²) = √(36 + 64) = √100 = 10 সেমি।
                    </p>
                  </div>
                )}
                {chal2Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: c² = a² + b² সূত্রে a=6, b=8 বসান।</p>
                  </div>
                )}
              </div>

              {/* Challenge 3 */}
              <div className="p-6 rounded-3xl border border-border/60 bg-card space-y-4">
                <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০৩</span>
                <h3 className="text-sm font-bold text-foreground">
                  বহিঃস্থ কোণ উপপাদ্য
                </h3>
                <div className="p-4 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  বহিঃস্থ কোণ 110° এবং বিপরীত অন্তঃস্থ কোণ 45° হলে অপরটি = ?
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-semibold">
                    কোণের মান লিখুন (ডিগ্রি):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chal3Input}
                      onChange={(e) => setChal3Input(e.target.value)}
                      placeholder="যেমন: 65"
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 font-mono text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        if (chal3Input.trim() === '65') {
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
                      <span>দুর্দান্ত! সঠিক উত্তর: ৬৫°</span>
                    </div>
                    <p className="text-[11px]">
                      কারণ বহিঃস্থ কোণ = বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টি ⇒ ১১০° - ৪৫° = ৬৫°।
                    </p>
                  </div>
                )}
                {chal3Status === 'wrong' && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>ভুল হয়েছে! আবার চেষ্টা করুন</span>
                    </div>
                    <p className="text-[11px]">হিন্ট: ১১০° থেকে ৪৫° বিয়োগ করুন।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: CHECK UNDERSTANDING (5 BOARD MCQS) */}
        {/* ================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border/60 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>বোর্ড স্ট্যান্ডার্ড ৫টি বহুনির্বাচনি প্রশ্ন (MCQ)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                যাচাই করুন (Self Assessment)
              </h1>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                সঠিক বিকল্পটি নির্বাচন করুন। সাবমিট করার পর আপনার স্কোর এবং প্রতিটি প্রশ্নের বিস্তারিত ব্যাখ্যা দেখতে পাবেন।
              </p>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {BOARD_MCQS.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl border border-border/60 bg-card space-y-4"
                >
                  <h3 className="text-sm font-bold text-foreground">
                    {qIdx + 1}. {q.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold'
                              : 'border-border/50 bg-muted/10 hover:bg-muted/30 text-foreground'
                          } ${
                            quizSubmitted && isCorrect
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                              : ''
                          } ${
                            quizSubmitted && isSelected && !isCorrect
                              ? 'border-destructive bg-destructive/10 text-destructive'
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {['A)', 'B)', 'C)', 'D)'][optIdx]}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          )}
                          {quizSubmitted && isSelected && !isCorrect && (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 text-xs leading-relaxed text-foreground space-y-1">
                      <span className="font-bold text-primary block">ব্যাখ্যা:</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Bar */}
            <div className="p-6 rounded-3xl bg-card border border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">
                {Object.keys(quizAnswers).length} / {BOARD_MCQS.length} টি প্রশ্নের উত্তর দেওয়া হয়েছে
              </span>
              <button
                disabled={quizSubmitted || Object.keys(quizAnswers).length < BOARD_MCQS.length}
                onClick={() => setQuizSubmitted(true)}
                className={`px-6 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                  quizSubmitted || Object.keys(quizAnswers).length < BOARD_MCQS.length
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20'
                }`}
              >
                {quizSubmitted ? 'ফলাফল প্রদর্শিত হয়েছে' : 'উত্তর জমা দিন (Submit Quiz)'}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 5: SUMMARY & FORMULA BANK */}
        {/* ================================================================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-card border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  <Award className="h-3.5 w-3.5" />
                  <span>অধ্যায় ৬ সম্পূর্ণ সারসংক্ষেপ ও সূত্র ভাণ্ডার</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  রিভিশন চিট-শীট ও পরীক্ষক ফাঁদ
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  পরীক্ষার ঠিক আগের রাতে দ্রুত রিভিশন দেওয়ার জন্য ৬টি অপরিহার্য উপপাদ্য কার্ড এবং ৪টি মারাত্মক ভুলের তালিকা।
                </p>
              </div>

              <button
                onClick={handleCopyNotes}
                className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20 shrink-0"
              >
                {copiedNote ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedNote ? 'কপি সম্পন্ন!' : '১-ক্লিকে রিভিশন নোট কপি'}</span>
              </button>
            </div>

            {/* 6 Core Theorem Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-3">
                <span className="text-xs font-bold text-primary">১. উপপাদ্য ১৫ (সন্নিহিত ও সরলকোণ)</span>
                <div className="p-3.5 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$\\angle AOC + \\angle BOC = 180^\\circ$" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  সরলরেখার এক বিন্দুতে অপর রশ্মি মিলিত হলে উৎপন্ন সন্নিহিত কোণদ্বয়ের সমষ্টি সর্বদা ২ সমকোণ।
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-3">
                <span className="text-xs font-bold text-primary">২. সমান্তরাল রেখা ও ছেদক কোণ</span>
                <div className="p-3.5 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$\\text{একান্তর}=\\text{সমান}, \\quad \\text{অন্তঃস্থ}=180^\\circ$" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AB ∥ CD হলে একান্তর কোণ সমান (Z), অনুরূপ কোণ সমান (F) এবং ছেদকের একই পাশের অন্তঃস্থ সমষ্টি ১৮০°।
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-3">
                <span className="text-xs font-bold text-primary">৩. উপপাদ্য ১৬ (কোণ সমষ্টি ১৮০°)</span>
                <div className="p-3.5 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$\\angle A + \\angle B + \\angle C = 180^\\circ$" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  যেকোনো ত্রিভুজের তিন কোণের সমষ্টি সর্বদা ২ সমকোণ বা ১৮০°।
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-3">
                <span className="text-xs font-bold text-primary">৪. উপপাদ্য ১৭ (বহিঃস্থ কোণ)</span>
                <div className="p-3.5 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$\\angle ACD = \\angle A + \\angle B$" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ত্রিভুজের যেকোনো বাহু বর্ধিত করলে বহিঃস্থ কোণ = বিপরীত অন্তঃস্থ কোণদ্বয়ের সমষ্টি।
                </p>
              </div>

              {/* Card 5 */}
              <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-3">
                <span className="text-xs font-bold text-primary">৫. সর্বসমতার ৪টি শর্ত</span>
                <div className="p-3.5 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  SAS, SSS, ASA, RHS
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  AAA কেবল সদৃশ করে, সর্বসম করে না। SSA কোনো সর্বসমতার অনুমোদিত শর্ত নয়।
                </p>
              </div>

              {/* Card 6 */}
              <div className="p-6 rounded-3xl bg-card border border-border/60 space-y-3">
                <span className="text-xs font-bold text-primary">৬. পিথাগোরাস ও ত্রিভুজ অসমতা</span>
                <div className="p-3.5 rounded-2xl bg-muted/30 font-mono text-center text-sm font-bold text-foreground">
                  <RenderMathText text="$c^2 = a^2 + b^2, \\quad a + b > c$" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  সমকোণী ত্রিভুজে অতিভুজ² = লম্ব² + ভূমি²। ত্রিভুজ গঠনের মৌলিক শর্ত: যে কোনো দুই বাহুর সমষ্টি ৩য় অপেক্ষা বৃহত্তর।
                </p>
              </div>
            </div>

            {/* Examiner Traps Section */}
            <div className="p-8 rounded-3xl bg-card border border-border/60 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <span>বোর্ড পরীক্ষায় নম্বর কাটার ৪টি মারাত্মক ফাঁদ (Examiner Traps)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
                  <span className="text-xs font-bold text-destructive block">
                    ফাঁদ ১: অন্তর্ভুক্ত কোণ না লিখে SAS শর্ত দাবি করা
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    দুটি বাহু সমান হলেও এদের মধ্যকার কোণটি অন্তর্ভুক্ত (Included angle) না হলে ত্রিভুজ কখনোই সর্বসম প্রমাণিত হবে না।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
                  <span className="text-xs font-bold text-destructive block">
                    ফাঁদ ২: AAA-কে সর্বসমতার শর্ত হিসেবে ব্যবহার করা
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    তিনটি কোণ সমান হলে ত্রিভুজদ্বয় কেবল সদৃশ (Similar) হয়, কিন্তু সর্বসম (Congruent) হয় না। আকার ছোট-বড় হতে পারে!
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
                  <span className="text-xs font-bold text-destructive block">
                    ফাঁদ ৩: উপপাদ্য প্রমাণে অঙ্কন স্পষ্টভাবে না লেখা
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    ত্রিভুজের তিন কোণের সমষ্টি প্রমাণে শীর্ষবিন্দু দিয়ে ভূমির সমান্তরাল রেখা (BA ∥ CE) অঙ্কন না লিখলে সরাসরি ১ নম্বর কাটা যায়।
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
                  <span className="text-xs font-bold text-destructive block">
                    ফাঁদ ৪: ত্রিভুজ গঠনের শর্ত পরীক্ষা না করে ক্ষেত্রফল বের করা
                  </span>
                  <p className="text-xs text-foreground leading-relaxed">
                    বাহুদ্বয়ের যোগফল ৩য় বাহুর চেয়ে বড় না হলে (যেমন 2, 3, 5 সেমি) ত্রিভুজ গঠিতই হবে না! সরাসরি উত্তর হবে "ত্রিভুজ গঠন অসম্ভব"।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Sheru Socratic Assistant Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSheruOpen(true)}
          className="px-4 py-3 rounded-full bg-primary text-primary-foreground font-extrabold text-xs shadow-xl shadow-primary/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>শেরু এআই সহকারী</span>
        </button>
      </div>

      {/* Sheru Socratic Assistant Drawer */}
      {isSheruOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-card border-l border-border/80 shadow-2xl flex flex-col justify-between p-6 overflow-hidden">
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm">
                    🦁
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">শেরু সক্রেটিক সহচর</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      অধ্যায় ৬: রেখা, কোণ ও ত্রিভুজ স্পেশালিস্ট
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSheruOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground">ঝটপট প্রশ্ন করুন:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      q: 'ত্রিভুজের কোণ সমষ্টি কেন ১৮০° হয়?',
                      a: 'অসাধারণ প্রশ্ন! শীর্ষবিন্দু দিয়ে ভূমির সমান্তরাল রেখা আঁকলে একান্তর কোণ ও সন্নিহিত কোণ মিলে একটি ১৮০° সরলকোণ গঠন করে!',
                    },
                    {
                      q: 'AAA কেন সর্বসমতার শর্ত নয়?',
                      a: 'কারণ তিনটি কোণ সমান হলেও ত্রিভুজটি একটি ফটোকপির মতো যেকোনো গুণ বড় বা ছোট হতে পারে! অর্থাৎ এরা কেবল সদৃশ (Similar), সর্বসম নয়!',
                    },
                    {
                      q: 'পিথাগোরাস দিয়ে কীভাবে ত্রিভুজ চেনা যায়?',
                      a: 'c² = a² + b² হলে সমকোণী, c² < a² + b² হলে সূক্ষ্মকোণী, এবং c² > a² + b² হলে স্থূলকোণী ত্রিভুজ হয়!',
                    },
                  ].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSheruPrompt(p.q, p.a)}
                      className="px-2.5 py-1 rounded-xl bg-muted/40 hover:bg-muted/60 text-[11px] text-foreground font-medium transition-colors border border-border/40 text-left"
                    >
                      {p.q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
              {sheruChat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground font-medium rounded-br-xs'
                        : 'bg-muted/30 border border-border/40 text-foreground rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex gap-2 pt-2 border-t border-border/60">
              <input
                type="text"
                value={sheruInput}
                onChange={(e) => setSheruInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSheruSend()}
                placeholder="জ্যামিতিক উপপাদ্য নিয়ে প্রশ্ন করুন..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSheruSend}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
