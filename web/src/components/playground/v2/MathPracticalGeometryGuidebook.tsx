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
  Square,
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
    title: 'ত্রিভুজ অঙ্কন: ভূমি, কোণ ও বাহুর সমষ্টি / পরিসীমা ল্যাব',
    subtitle: 'Triangle Constructions: Sum of Sides & Perimeter (Constructions 1 & 3)',
    nctbPage: 'পৃষ্ঠা ১৩৩-১৩৬',
    badge: 'ল্যাব ০১',
    intro:
      'একটি ত্রিভুজের ভূমি a, ভূমিসংলগ্ন কোণ ∠x এবং অপর দুই বাহুর সমষ্টি s দেওয়া থাকলে ত্রিভুজটি অনন্যভাবে আঁকা যায় (সম্পাদ্য ১)। আবার ভূমিসংলগ্ন দুটি কোণ ও ত্রিভুজের পরিসীমা p দেওয়া থাকলে কোণদ্বয়ের অর্ধেকের সাহায্যে ত্রিভুজটি গঠন করা যায় (সম্পাদ্য ৩)।',
  },
  {
    id: 2,
    title: 'ত্রিভুজ অঙ্কন: ভূমি, কোণ ও বাহুর অন্তর ল্যাব',
    subtitle: 'Triangle Constructions: Difference of Sides (Construction 2)',
    nctbPage: 'পৃষ্ঠা ১৩৪-১৩৫',
    badge: 'ল্যাব ০২',
    intro:
      'ভূমি a, ভূমিসংলগ্ন কোণ ∠x এবং অপর দুই বাহুর অন্তর d দেওয়া থাকলে ত্রিভুজ আঁকার দুটি ভিন্ন ক্ষেত্র তৈরি হয়: সংলগ্ন বাহু বড় হলে (c > b) কোণের বাহু থেকে অন্তর কাটা হয়, আর সংলগ্ন বাহু ছোট হলে (c < b) বিপরীত রশ্মি থেকে অন্তর কাটা হয়।',
  },
  {
    id: 3,
    title: 'সমকোণী ও বিশেষ ত্রিভুজ অঙ্কন ল্যাব',
    subtitle: 'Right Triangles & Special Constructions (Constructions 4 & 5)',
    nctbPage: 'পৃষ্ঠা ১৩৬-১৩৮',
    badge: 'ল্যাব ০৩',
    intro:
      'সমকোণী ত্রিভুজের এক কোণ সর্বদা ৯০° নির্দিষ্ট থাকে। তাই এর অতিভুজ ও অপর একটি বাহু দেওয়া থাকলে (সম্পাদ্য ৪) অথবা অতিভুজ ও একটি সূক্ষ্মকোণ দেওয়া থাকলে (সম্পাদ্য ৫ / অর্ধবৃত্ত পদ্ধতি) অতি সহজে সমকোণী ত্রিভুজটি সম্পূর্ণ করা যায়।',
  },
  {
    id: 4,
    title: 'চতুর্ভুজ অঙ্কনের ৫টি স্বতন্ত্র শর্ত ও মিনিমাম উপাত্ত ল্যাব',
    subtitle: '5 Independent Conditions for Quadrilaterals & Minimum Data Matrix',
    nctbPage: 'পৃষ্ঠা ১৩৯-১৪৩',
    badge: 'ল্যাব ০৪',
    intro:
      'একটি নির্দিষ্ট চতুর্ভুজ অঙ্কনের জন্য ৫টি স্বতন্ত্র উপাত্ত আবশ্যক। তবে বিশেষ প্রতিসাম্যের কারণে বর্গের জন্য মাত্র ১টি, রম্বস ও আয়তের জন্য ২টি, সামান্তরিকের জন্য ৩টি এবং ট্রাপিজিয়ামের জন্য ৪টি উপাত্তই যথেষ্ট। ইন্টারেক্টিভ উপাত্ত ডিটেক্টরে যাচাই করুন।',
  },
  {
    id: 5,
    title: 'ট্রাপিজিয়াম ও রম্বস অঙ্কন সিমুলেটর',
    subtitle: 'Trapezoid & Rhombus Construction Simulator (Constructions 6 & 7)',
    nctbPage: 'পৃষ্ঠা ১৪৪-১৪৮',
    badge: 'ল্যাব ০৫',
    intro:
      'রম্বসের দুটি কর্ণ দেওয়া থাকলে তাদের লম্বসমদ্বিখণ্ডক অঙ্কন করে ৪টি শীর্ষবিন্দু যুক্ত করা যায় (সম্পাদ্য ৭)। ট্রাপিজিয়ামের সমান্তরাল দুই বাহু ও সংলগ্ন কোণদ্বয় জানা থাকলে বাহুর বিয়োগফল (a - b) কেটে সমান্তরাল রেখা টেনে ট্রাপিজিয়াম গঠন করা যায় (সম্পাদ্য ৬)।',
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

const CQ_QUESTIONS: CQQuestion[] = [
  {
    id: 1,
    boardSource: 'ঢাকা বোর্ড ২০২২ / রাজশাহী বোর্ড ২০২৩ ভিত্তিক',
    stem: 'একটি ত্রিভুজের ভূমি a = 4.5 cm, ভূমিসংলগ্ন কোণ ∠x = 60° এবং অপর দুই বাহুর সমষ্টি s = 8 cm। অন্য একটি তথ্যে একটি ত্রিভুজের পরিসীমা p = 12 cm এবং ভূমিসংলগ্ন কোণদ্বয় ∠x = 60° ও ∠y = 45°।',
    partA: {
      question: 'একটি বর্গের পরিসীমা 16 cm হলে এর কর্ণের দৈর্ঘ্য কত?',
      marks: 2,
      answer: '4√2 cm ≈ 5.66 cm',
      steps: [
        'বর্গের পরিসীমা 4a = 16 cm ⇒ বাহু a = 16/4 = 4 cm',
        'বর্গের কর্ণ d = a√2 = 4√2 cm ≈ 5.657 cm',
      ],
      examinerTip: 'বর্গের কর্ণের সূত্র d = a√2 সরাসরি লিখলে এবং মান বসালে পূর্ণ ২ নম্বর পাওয়া যায়।',
    },
    partB: {
      question: 'উদ্দীপকের ১ম তথ্যের আলোকে ত্রিভুজটি আঁকো। (অঙ্কনের চিহ্ন ও বিবরণ আবশ্যক)',
      marks: 4,
      answer: 'সম্পাদ্য ১ অনুযায়ী অঙ্কিত ত্রিভুজ ABC',
      steps: [
        'ধাপ ১: যেকোনো রশ্মি BE থেকে ভূমি a = 4.5 cm এর সমান করে BC অংশ কাটি।',
        'ধাপ ২: B বিন্দুতে ∠CBF = 60° আঁকি।',
        'ধাপ ৩: BF রশ্মি থেকে সমষ্টি s = 8 cm এর সমান করে BD কাটি এবং C, D যোগ করি।',
        'ধাপ ৪: C বিন্দুতে ∠BDC এর সমান করে ∠DCA আঁকি যেন CA রেখাংশ BD কে A বিন্দুতে ছেদ করে।',
        'ধাপ ৫: তাহলে △ABC-ই উদ্দিষ্ট ত্রিভুজ। কারণ ∠ADC = ∠ACD হওয়ায় AD = AC, সুতরাং BD = BA + AD = BA + AC = s = 8 cm।',
      ],
      rubric: [
        { step: 'সঠিক পরিমাপে উপাত্ত চিত্র (a, s, ∠x) অঙ্কন', mark: '১ নম্বর' },
        { step: 'রশ্মি থেকে BC ও ∠CBF সঠিক কোণে অঙ্কন', mark: '১ নম্বর' },
        { step: 'BD = s কেটে ∠DCA = ∠BDC নির্ভুলভাবে অঙ্কন', mark: '১ নম্বর' },
        { step: 'সম্পূর্ণ অঙ্কনের নির্ভুল বিবরণ ও সমাপ্তি', mark: '১ নম্বর' },
      ],
      examinerSecret: 'পরীক্ষক দেখেন C বিন্দুতে ∠BDC এর সমান কোণ বৃত্তচাপ দিয়ে ঠিকভাবে আঁকা হয়েছে কি না। চোখের দেখায় কোণ সমান না হলে ১ নম্বর কাটা যায়।',
    },
    partC: {
      question: 'উদ্দীপকের ২য় তথ্যের আলোকে ত্রিভুজটি আঁকো। (অঙ্কনের চিহ্ন ও বিবরণ আবশ্যক)',
      marks: 4,
      answer: 'সম্পাদ্য ৩ অনুযায়ী পরিসীমা p = 12 cm বিশিষ্ট ত্রিভুজ ABC',
      steps: [
        'ধাপ ১: যেকোনো রশ্মি থেকে পরিসীমা p = 12 cm এর সমান রেখাংশ DF কেটে নিই।',
        'ধাপ ২: D বিন্দুতে (1/2)∠x = 30° এবং F বিন্দুতে (1/2)∠y = 22.5° কোণ আঁকি। এ কোণদ্বয়ের বাহু পরস্পর A বিন্দুতে ছেদ করে।',
        'ধাপ ৩: A বিন্দুতে ∠ADE এর সমান ∠DAB এবং ∠AFE এর সমান ∠FAC আঁকি যেন AB ও AC রেখাংশ DF কে যথাক্রমে B ও C বিন্দুতে ছেদ করে।',
        'ধাপ ৪: তাহলে △ABC-ই উদ্দিষ্ট ত্রিভুজ।',
        'ধাপ ৫: যুক্তি: △ABD-তে AD = BD এবং △ACF-তে AC = CF। সুতরাং BC + AB + AC = BC + BD + CF = DF = p = 12 cm এবং বহিঃস্থ কোণ ∠B = 60°, ∠C = 45°।',
      ],
      rubric: [
        { step: 'পরিসীমা p ও কোণদ্বয়ের সমদ্বিখণ্ডক অঙ্কন', mark: '১ নম্বর' },
        { step: 'DF রেখাংশে অর্ধকোণদ্বয় এঁকে A বিন্দু নির্ধারণ', mark: '১ নম্বর' },
        { step: 'A বিন্দুতে সমান কোণ এঁকে B ও C বিন্দুদ্বয় ছেদ করানো', mark: '১ নম্বর' },
        { step: 'অঙ্কনের নির্ভুল বিবরণ ও প্রমাণ উল্লেখ', mark: '১ নম্বর' },
      ],
      examinerSecret: 'অর্ধকোণ (x/2 ও y/2) উপাত্ত চিত্রে কম্পাসের সাহায্যে সমদ্বিখণ্ডিত করা দেখালে পরীক্ষক সবচেয়ে বেশি সন্তুষ্ট হন।',
    },
  },
  {
    id: 2,
    boardSource: 'চট্টগ্রাম বোর্ড ২০২৩ / কুমিল্লা বোর্ড ২০২২ ভিত্তিক',
    stem: 'একটি ত্রিভুজের ভূমি BC = 5 cm, ভূমিসংলগ্ন কোণ ∠B = 45° এবং অপর দুই বাহুর অন্তর d = 2 cm। অপর একটি চিত্রে একটি রম্বসের দুটি কর্ণ d₁ = 6 cm এবং d₂ = 8 cm।',
    partA: {
      question: 'একটি নির্দিষ্ট চতুর্ভুজ অঙ্কনের জন্য কয়টি স্বতন্ত্র উপাত্ত আবশ্যক? রম্বস আঁকতে কয়টি উপাত্ত লাগে?',
      marks: 2,
      answer: 'চতুর্ভুজে ৫টি এবং রম্বসে মাত্র ২টি উপাত্ত আবশ্যক',
      steps: [
        'একটি নির্দিষ্ট চতুর্ভুজ অঙ্কনের জন্য ৫টি স্বতন্ত্র উপাত্ত প্রয়োজন।',
        'যেহেতু রম্বসের ৪টি বাহু সমান এবং বিপরীত কোণ সমান, তাই এর জন্য মাত্র ২টি উপাত্ত (যেমন: দুই কর্ণ, অথবা এক বাহু ও এক কোণ) যথেষ্ট।',
      ],
      examinerTip: 'উভয় প্রশ্নের সঠিক উত্তর এক লাইনে লিখলেই পুরো ২ নম্বর দেওয়া হয়।',
    },
    partB: {
      question: 'উদ্দীপকের ১ম তথ্যের আলোকে ত্রিভুজটি আঁকো। (সংলগ্ন বাহু বৃহত্তর ধরে অঙ্কনের বিবরণ দাও)',
      marks: 4,
      answer: 'সম্পাদ্য ২ অনুযায়ী অঙ্কিত ত্রিভুজ ABC (c > b)',
      steps: [
        'ধাপ ১: যেকোনো রশ্মি BE থেকে ভূমি BC = 5 cm কেটে নিই।',
        'ধাপ ২: B বিন্দুতে ∠CBF = 45° আঁকি।',
        'ধাপ ৩: BF রশ্মি থেকে অন্তর d = 2 cm এর সমান করে BD কাটি। C, D যোগ করি।',
        'ধাপ ৪: CD রেখাংশের লম্বসমদ্বিখণ্ডক আঁকি (অথবা C বিন্দুতে ∠CDE এর অনুরূপ ∠DCA আঁকি) যা BF রশ্মিকে A বিন্দুতে ছেদ করে।',
        'ধাপ ৫: A, C যোগ করি। △ABC-ই উদ্দিষ্ট ত্রিভুজ, যেখানে AB - AC = (BD + DA) - AC = BD = 2 cm (যেহেতু DA = AC)।',
      ],
      rubric: [
        { step: 'উপাত্ত রেখাংশ d ও কোণ 45° কম্পাসে অঙ্কন', mark: '১ নম্বর' },
        { step: 'BC ও 45° কোণ এঁকে BD = d নির্ধারণ', mark: '১ নম্বর' },
        { step: 'CD রেখাংশের লম্বসমদ্বিখণ্ডক বা কোণ এঁকে A বিন্দু নির্ধারণ', mark: '১ নম্বর' },
        { step: 'স্পষ্ট বিবরণ ও অন্তর সত্যতা প্রমাণ', mark: '১ নম্বর' },
      ],
      examinerSecret: 'c > b এবং c < b এর পার্থক্য পরিষ্কার থাকা চাই। এখানে যেহেতু সংলগ্ন বাহু বড়, অন্তরটি কোণের রশ্মি বরাবরই কাটা হয়েছে।',
    },
    partC: {
      question: 'উদ্দীপকের রম্বসটি আঁকো এবং এর পরিসীমা ও ক্ষেত্রফল নির্ণয় করো।',
      marks: 4,
      answer: 'পরিসীমা = 20 cm, ক্ষেত্রফল = 24 cm²',
      steps: [
        'ধাপ ১: যেকোনো রেখাংশ BD = d₁ = 6 cm নিই।',
        'ধাপ ২: BD এর লম্বসমদ্বিখণ্ডক PQ আঁকি যা BD কে O বিন্দুতে সমদ্বিখণ্ডিত করে (BO = OD = 3 cm)।',
        'ধাপ ৩: O বিন্দু থেকে OP ও OQ হতে (1/2)d₂ = 4 cm এর সমান করে OA ও OC কেটে নিই।',
        'ধাপ ৪: A, B; B, C; C, D এবং D, A যোগ করি। ABCD-ই উদ্দিষ্ট রম্বস।',
        'হিসাব: সমকোণী △AOB-তে বাহু a = √(3² + 4²) = √(9 + 16) = √25 = 5 cm।',
        'রম্বসের পরিসীমা = 4 × 5 = 20 cm।',
        'রম্বসের ক্ষেত্রফল = (1/2) × d₁ × d₂ = (1/2) × 6 × 8 = 24 cm²।',
      ],
      rubric: [
        { step: 'কর্ণদ্বয় ও লম্বসমদ্বিখণ্ডকের সাহায্যে রম্বস অঙ্কন', mark: '২ নম্বর' },
        { step: 'পিথাগোরাস সূত্রে বাহুর দৈর্ঘ্য a = 5 cm নির্ণয়', mark: '১ নম্বর' },
        { step: 'পরিসীমা 20 cm ও ক্ষেত্রফল 24 cm² সঠিকভাবে নির্ণয়', mark: '১ নম্বর' },
      ],
      examinerSecret: 'রম্বসের কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে—এই ধর্মের ভিত্তিতে অঙ্কন করা দেখালে পুরো ৪ পাওয়া নিশ্চিত।',
    },
  },
  {
    id: 3,
    boardSource: 'যশোর বোর্ড ২০২৪ / দিনাজপুর বোর্ড ২০২৩ ভিত্তিক',
    stem: 'একটি ট্রাপিজিয়ামের সমান্তরাল বাহুদ্বয় a = 7 cm ও b = 4 cm এবং বৃহত্তর বাহুসংলগ্ন কোণদ্বয় ∠x = 60° ও ∠y = 50°।',
    partA: {
      question: 'একটি সমকোণী ত্রিভুজের অতিভুজ 5 cm এবং এক বাহু 3 cm হলে ক্ষেত্রফল কত?',
      marks: 2,
      answer: 'ক্ষেত্রফল = 6 cm²',
      steps: [
        'অপর বাহু b = √(5² - 3²) = √(25 - 9) = √16 = 4 cm',
        'সমকোণী ত্রিভুজের ক্ষেত্রফল = (1/2) × ভূমি × উচ্চতা = (1/2) × 3 × 4 = 6 cm²',
      ],
      examinerTip: 'পিথাগোরাস উপপাদ্য প্রয়োগ করে অপর বাহু 4 cm বের করে সরাসরি ক্ষেত্রফলের সূত্রে বসাতে হবে।',
    },
    partB: {
      question: 'উদ্দীপকের তথ্যের ভিত্তিতে ট্রাপিজিয়ামটি আঁকো। (অঙ্কনের চিহ্ন ও বিবরণ আবশ্যক)',
      marks: 4,
      answer: 'সম্পাদ্য ৬ অনুযায়ী ট্রাপিজিয়াম ABCD',
      steps: [
        'ধাপ ১: যেকোনো রশ্মি AX থেকে বৃহত্তর সমান্তরাল বাহু AB = a = 7 cm কাটি।',
        'ধাপ ২: A বিন্দুতে ∠BAE = 60° এবং B বিন্দুতে ∠ABF = 50° আঁকি।',
        'ধাপ ৩: AB থেকে ছোট বাহু b = 4 cm এর সমান করে AE কাটি (ফলে EB = a - b = 3 cm)।',
        'ধাপ ৪: E বিন্দুতে EC || AD আঁকি, অর্থাৎ ∠BEC = ∠BAE = 60° আঁকি যেন EC রেখাংশ BF কে C বিন্দুতে ছেদ করে।',
        'ধাপ ৫: C বিন্দু দিয়ে CD || AB আঁকি (বা A কেন্দ্র করে C এর সমান্তরালে বৃত্তচাপ এঁকে D নির্ধারণ করি যেন CD = b = 4 cm হয়)। A, D যোগ করি। ABCD-ই উদ্দিষ্ট ট্রাপিজিয়াম।',
      ],
      rubric: [
        { step: 'উপাত্ত a, b এবং কোণদ্বয় নিখুঁতভাবে অঙ্কন', mark: '১ নম্বর' },
        { step: 'AB = a কেটে কোণদ্বয় ∠x ও ∠y অঙ্কন', mark: '১ নম্বর' },
        { step: 'E বিন্দুতে সমান্তরাল রেখা EC এঁকে C ও D নির্ধারণ', mark: '১ নম্বর' },
        { step: 'ট্রাপিজিয়াম ABCD সম্পন্ন ও স্পষ্ট বিবরণ', mark: '১ নম্বর' },
      ],
      examinerSecret: 'E বিন্দুতে EC রেখাটি AD এর সমান্তরাল করে অনুরূপ কোণ মেপে আঁকা হচ্ছে কি না, পরীক্ষক তা সূক্ষ্মভাবে পর্যবেক্ষণ করেন।',
    },
    partC: {
      question: 'যদি সমান্তরাল বাহুদ্বয় ছাড়াও ট্রাপিজিয়ামের অপর দুটি তীর্যক বাহু c = 3.5 cm ও d = 3 cm দেওয়া থাকত, তবে তা কীভাবে আঁকা হতো? ধাপ ব্যাখ্যা করো।',
      marks: 4,
      answer: 'চার বাহু বিশিষ্ট ট্রাপিজিয়াম অঙ্কন পদ্ধতি',
      steps: [
        'ধাপ ১: AB = a = 7 cm নিই এবং AB হতে AE = b = 4 cm কাটি (ফলে EB = a - b = 3 cm)।',
        'ধাপ ২: EB রেখাংশের ওপর △EBC আঁকি যার তিন বাহু EB = 3 cm, BC = c = 3.5 cm এবং EC = d = 3 cm। (E ও B কে কেন্দ্র করে যথাক্রমে d ও c ব্যাসার্ধের বৃত্তচাপের ছেদবিন্দু C)।',
        'ধাপ ৩: A বিন্দুকে কেন্দ্র করে d = 3 cm এর সমান ব্যাসার্ধ নিয়ে এবং C কে কেন্দ্র করে b = 4 cm এর সমান ব্যাসার্ধ নিয়ে AB এর একই পাশে দুটি বৃত্তচাপ আঁকি যা D বিন্দুতে ছেদ করে।',
        'ধাপ ৪: A, D এবং C, D যোগ করি। তাহলে ABCD-ই উদ্দিষ্ট ট্রাপিজিয়াম।',
        'যুক্তি: AECD একটি সামান্তরিক, যার AD = EC = d এবং CD = AE = b। আবার BC = c এবং AB = a। ফলে ট্রাপিজিয়ামের ৪টি বাহুই যথাযথভাবে বাস্তবায়িত হয়।',
      ],
      rubric: [
        { step: 'EB = a - b রেখাংশের ওপর ত্রিভুজ EBC গঠন', mark: '২ নম্বর' },
        { step: 'বৃত্তচাপের সাহায্যে সামান্তরিক AECD সম্পন্ন করে D বিন্দু লাভ', mark: '১ নম্বর' },
        { step: 'গাণিতিক যুক্তি ও পদ্ধতির নির্ভুল ব্যাখ্যা', mark: '১ নম্বর' },
      ],
      examinerSecret: 'বৃত্তচাপ দুটি ঠিকমতো ছেদ করছে কি না এবং AECD সামান্তরিক হওয়ার যুক্তি স্পষ্টভাবে দেওয়া হয়েছে কি না তা নম্বর নির্ধারণ করে।',
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

const MCQ_ITEMS: MCQItem[] = [
  {
    id: 1,
    question: 'একটি নির্দিষ্ট চতুর্ভুজ অঙ্কন করার জন্য ন্যূনতম কয়টি স্বতন্ত্র উপাত্ত প্রয়োজন?',
    options: ['৩টি', '৪টি', '৫টি', '৬টি'],
    correctIndex: 2,
    explanation: 'যেকোনো নির্দিষ্ট চতুর্ভুজ সম্পূর্ণ ও অনন্যভাবে নির্ধারণের জন্য ৫টি স্বতন্ত্র উপাত্ত আবশ্যক (যেমন: ৪ বাহু ও ১ কোণ, বা ৩ বাহু ও ২ কর্ণ ইত্যাদি)।',
  },
  {
    id: 2,
    question: 'একটি রম্বসের দুটি কর্ণ যথাক্রমে 6 cm ও 8 cm হলে এর ক্ষেত্রফল কত?',
    options: ['১২ cm²', '২৪ cm²', '৪৮ cm²', '১৪ cm²'],
    correctIndex: 1,
    explanation: 'রম্বসের ক্ষেত্রফল = (১/২) × কর্ণ₁ × কর্ণ₂ = (১/২) × ৬ × ৮ = ২৪ cm²।',
  },
  {
    id: 3,
    question: 'কোন বিশেষ চতুর্ভুজটি অঙ্কন করার জন্য কেবল ১টি উপাত্তই যথেষ্ট?',
    options: ['আয়ত', 'রম্বস', 'সামান্তরিক', 'বর্গ'],
    correctIndex: 3,
    explanation: 'বর্গের চারটি বাহু পরস্পর সমান এবং প্রতিটি কোণ ৯০°। তাই কেবল একটি বাহুর দৈর্ঘ্য জানা থাকলেই বর্গটি সম্পূর্ণভাবে আঁকা যায়।',
  },
  {
    id: 4,
    question: 'সম্পাদ্য ১ অনুযায়ী ত্রিভুজ আঁকতে কোনটি প্রযোজ্য?',
    options: [
      'ভূমি, এক কোণ ও দুই বাহুর অন্তর',
      'ভূমি, ভূমিসংলগ্ন কোণ ও অপর দুই বাহুর সমষ্টি',
      'পরিসীমা ও তিনটি কোণ',
      'অতিভুজ ও এক বাহু',
    ],
    correctIndex: 1,
    explanation: 'সম্পাদ্য ১-এ বলা হয়েছে: কোনো ত্রিভুজের ভূমি, ভূমিসংলগ্ন একটি কোণ এবং অপর দুই বাহুর সমষ্টি দেওয়া থাকলে ত্রিভুজটি আঁকা যায়।',
  },
  {
    id: 5,
    question: 'একটি ট্রাপিজিয়াম নির্দিষ্টভাবে আঁকার জন্য ন্যূনতম কয়টি উপাত্ত আবশ্যক?',
    options: ['২টি', '৩টি', '৪টি', '৫টি'],
    correctIndex: 2,
    explanation: 'ট্রাপিজিয়ামের সমান্তরাল দুই বাহু এবং তাদের অন্তর্ভুক্ত/সংলগ্ন কোণদ্বয়—এই ৪টি উপাত্ত জানা থাকলেই ট্রাপিজিয়ামটি অনন্যভাবে আঁকা সম্ভব।',
  },
];

interface SummaryCard {
  id: number;
  title: string;
  badge: string;
  ruleBn: string;
  formula: string;
  note: string;
}

const SUMMARY_CARDS: SummaryCard[] = [
  {
    id: 1,
    title: 'সম্পাদ্য ১: ত্রিভুজের সমষ্টি ল্যাব',
    badge: 'ত্রিভুজ অঙ্কন',
    ruleBn: 'ভূমি a, কোণ ∠x এবং অপর দুই বাহুর সমষ্টি s দেওয়া থাকলে BD = s কেটে C বিন্দুতে ∠BDC এর সমান কোণ আঁকলে A বিন্দু পাওয়া যায়।',
    formula: 'AD = AC \\implies BA + AC = BD = s',
    note: 'বৃত্তচাপ সমান কোণ আঁকা নিশ্চিত করে যে △ACD একটি সমদ্বিবাহু ত্রিভুজ।',
  },
  {
    id: 2,
    title: 'সম্পাদ্য ২: ত্রিভুজের অন্তর ল্যাব',
    badge: 'ত্রিভুজ অঙ্কন',
    ruleBn: 'ভূমি a, কোণ ∠x এবং অন্তর d দেওয়া থাকলে c > b হলে কোণের দিকে BD = d কাটি; আর c < b হলে বিপরীত রশ্মি থেকে BD = d কাটি।',
    formula: 'c > b: AB - AC = d \\quad | \\quad c < b: AC - AB = d',
    note: 'CD এর লম্বসমদ্বিখণ্ডক অথবা সমান কোণ এঁকে A বিন্দু নির্ধারণ করা হয়।',
  },
  {
    id: 3,
    title: 'সম্পাদ্য ৩: পরিসীমা ও দুই কোণ',
    badge: 'পরিসীমা পদ্ধতি',
    ruleBn: 'পরিসীমা p = DF কেটে দুই প্রান্তে (1/2)∠x ও (1/2)∠y আঁকলে শীর্ষ A বিন্দু পাওয়া যায়। পরে A বিন্দুতে সমান কোণ এঁকে B ও C পাই।',
    formula: 'p = AB + BC + CA, \\quad \\angle B = \\angle x, \\quad \\angle C = \\angle y',
    note: 'অর্ধকোণ আঁকার ফলেই দুই পাশের ছোট ত্রিভুজ দুটি সমদ্বিবাহু হয়।',
  },
  {
    id: 4,
    title: 'সম্পাদ্য ৪ ও ৫: সমকোণী ত্রিভুজ',
    badge: 'সমকোণী জ্যামিতি',
    ruleBn: 'অতিভুজ h ও এক বাহু a জানা থাকলে লম্ব টেনে h ব্যাসার্ধে বৃত্তচাপ কেটে A পাই। আর সূক্ষ্মকোণ থাকলে অর্ধবৃত্তস্থ কোণ সমকোণ সূত্র প্রয়োগ করা যায়।',
    formula: 'b = \\sqrt{h^2 - a^2}, \\quad \\angle B = 90^\\circ',
    note: 'সমকোণী ত্রিভুজে পিথাগোরাসের সম্পর্ক জ্যামিতিক অঙ্কনে বৃত্তচাপের মাধ্যমে বাস্তবায়িত হয়।',
  },
  {
    id: 5,
    title: 'চতুর্ভুজের ৫ শর্ত ও মিনিমাম উপাত্ত',
    badge: 'চতুর্ভুজ ম্যাট্রিক্স',
    ruleBn: 'সাধারণ চতুর্ভুজে ৫টি, ট্রাপিজিয়ামে ৪টি, সামান্তরিকে ৩টি, রম্বস ও আয়তে ২টি এবং বর্গে মাত্র ১টি স্বতন্ত্র উপাত্ত আবশ্যক।',
    formula: '\\text{বর্গ: ১, রম্বস: ২, আয়ত: ২, সামান্তরিক: ৩, ট্রাপিজিয়াম: ৪, চতুর্ভুজ: ৫}',
    note: 'প্রতিসাম্য এবং সমান্তরালতার ধর্মের কারণে আবশ্যক তথ্যের সংখ্যা কমে যায়।',
  },
  {
    id: 6,
    title: 'সম্পাদ্য ৭: রম্বসের দুই কর্ণ',
    badge: 'রম্বস সিমুলেটর',
    ruleBn: 'রম্বসের দুটি কর্ণ পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে। তাই একটি কর্ণের লম্বসমদ্বিখণ্ডক এঁকে অপর কর্ণের অর্ধেক (d₂/2) দুই পাশে কাটলেই রম্বস প্রস্তুত।',
    formula: '\\text{ক্ষেত্রফল} = \\frac{1}{2} d_1 d_2, \\quad a = \\sqrt{(d_1/2)^2 + (d_2/2)^2}',
    note: 'রম্বসের প্রতিটি বাহু সমান এবং ৪টি সমকোণী ত্রিভুজ গঠিত হয়।',
  },
];

const toBn = (n: number | string) =>
  n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

export function MathPracticalGeometryGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLab, setActiveLab] = useState<number>(1);

  // Lab 1 State (Sum & Perimeter)
  const [lab1Mode, setLab1Mode] = useState<'sum' | 'perimeter'>('sum');
  const [lab1Base, setLab1Base] = useState<number>(5); // cm
  const [lab1Angle, setLab1Angle] = useState<number>(60); // deg
  const [lab1Sum, setLab1Sum] = useState<number>(9); // cm (s > a)
  const [lab1Step, setLab1Step] = useState<number>(4); // 1 to 4

  // Lab 1 Perimeter Sub-mode
  const [lab1P, setLab1P] = useState<number>(12); // cm
  const [lab1AngleX, setLab1AngleX] = useState<number>(60);
  const [lab1AngleY, setLab1AngleY] = useState<number>(50);
  const [lab1PStep, setLab1PStep] = useState<number>(4);

  // Lab 2 State (Difference of Sides)
  const [lab2Case, setLab2Case] = useState<'greater' | 'smaller'>('greater');
  const [lab2Base, setLab2Base] = useState<number>(5);
  const [lab2Angle, setLab2Angle] = useState<number>(50);
  const [lab2Diff, setLab2Diff] = useState<number>(2);
  const [lab2Step, setLab2Step] = useState<number>(4);

  // Lab 3 State (Right Triangle)
  const [lab3Mode, setLab3Mode] = useState<'hyp_side' | 'hyp_angle'>('hyp_side');
  const [lab3Base, setLab3Base] = useState<number>(4);
  const [lab3Hyp, setLab3Hyp] = useState<number>(6);
  const [lab3Angle, setLab3Angle] = useState<number>(40);
  const [lab3Step, setLab3Step] = useState<number>(3);

  // Lab 4 State (5 Conditions & Quadrilateral Matrix)
  const [selectedCondition, setSelectedCondition] = useState<number>(1);
  const [selectedQuadType, setSelectedQuadType] = useState<'square' | 'rhombus' | 'rectangle' | 'parallelogram' | 'trapezoid' | 'general'>('square');

  // Lab 5 State (Trapezoid & Rhombus)
  const [lab5Mode, setLab5Mode] = useState<'rhombus' | 'trapezoid'>('rhombus');
  const [lab5Diag1, setLab5Diag1] = useState<number>(8);
  const [lab5Diag2, setLab5Diag2] = useState<number>(6);
  const [lab5RhombusStep, setLab5RhombusStep] = useState<number>(4);

  const [lab5TrapA, setLab5TrapA] = useState<number>(7);
  const [lab5TrapB, setLab5TrapB] = useState<number>(4);
  const [lab5TrapX, setLab5TrapX] = useState<number>(60);
  const [lab5TrapY, setLab5TrapY] = useState<number>(50);
  const [lab5TrapStep, setLab5TrapStep] = useState<number>(4);

  // Step 2 CQs State
  const [expandedCQ, setExpandedCQ] = useState<number | null>(1);
  const [openSecret, setOpenSecret] = useState<{ [key: string]: boolean }>({});

  // Step 3 Interactive Challenges State
  const [ch1Input, setCh1Input] = useState<string>('');
  const [ch1Feedback, setCh1Feedback] = useState<string | null>(null);

  const [ch2Input, setCh2Input] = useState<string>('');
  const [ch2Feedback, setCh2Feedback] = useState<string | null>(null);

  const [ch3Selected, setCh3Selected] = useState<number | null>(null);
  const [ch3Feedback, setCh3Feedback] = useState<string | null>(null);

  // Step 4 MCQs State
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Step 5 Notes copied
  const [notesCopied, setNotesCopied] = useState<boolean>(false);

  // Sheru AI Tutor Drawer State
  const [isSheruOpen, setIsSheruOpen] = useState<boolean>(false);
  const [sheruChat, setSheruChat] = useState<Array<{ sender: 'user' | 'sheru'; text: string }>>([
    {
      sender: 'sheru',
      text: 'নমস্কার! আমি শেরু — তোমার ব্যবহারিক জ্যামিতি ও সম্পাদ্য সহকারী! সম্পাদ্য ১, ২, ৩ এর অঙ্কনের যুক্তি, রম্বস বা ট্রাপিজিয়াম অঙ্কন নিয়ে যেকোনো প্রশ্ন আমাকে জিজ্ঞাসা করতে পারো!',
    },
  ]);
  const [sheruInput, setSheruInput] = useState<string>('');

  const toggleSecret = (cqId: number, part: string) => {
    const key = `${cqId}-${part}`;
    setOpenSecret((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendSheru = (customText?: string) => {
    const query = customText || sheruInput;
    if (!query.trim()) return;

    const newMessages: Array<{ sender: 'user' | 'sheru'; text: string }> = [
      ...sheruChat,
      { sender: 'user', text: query },
    ];
    setSheruChat(newMessages);
    if (!customText) setSheruInput('');

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();
      if (q.includes('সম্পাদ্য ১') || q.includes('সমষ্টি') || q.includes('সমান কোণ')) {
        reply =
          'সম্পাদ্য ১-এ BD = s কাটার পর C বিন্দুতে ∠BDC এর সমান কোণ ∠DCA আঁকা হয়। এর ফলে △ACD একটি সমদ্বিবাহু ত্রিভুজ হয় এবং AD = AC প্রমাণিত হয়। সুতরাং BD = BA + AD = BA + AC = s নিশ্চিত হয়!';
      } else if (q.includes('রম্বস') || q.includes('২টি উপাত্ত')) {
        reply =
          'রম্বসের ৪টি বাহুই সমান এবং বিপরীত বাহুগুলো সমান্তরাল। এছাড়াও রম্বসের কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে। এ কারণে কেবল দুটি কর্ণের দৈর্ঘ্য (অথবা এক বাহু ও এক কোণ) দেওয়া থাকলেই রম্বসটি পুরোপুরি আঁকা যায়!';
      } else if (q.includes('পরিসীমা') || q.includes('সম্পাদ্য ৩') || q.includes('অর্ধেক কোণ')) {
        reply =
          'সম্পাদ্য ৩-এ DF = p পরিসীমার দুই প্রান্তে কোণদ্বয়ের অর্ধেক (x/2 ও y/2) নেওয়া হয়। কারণ শীর্ষবিন্দুতে সমান কোণ এঁকে যখন রেখা দুটি নিচে নামানো হয়, তখন ত্রিভুজের বহিঃস্থ কোণ উপপাদ্য অনুযায়ী ∠B = x/2 + x/2 = x এবং ∠C = y/2 + y/2 = y তৈরি হয়!';
      } else if (q.includes('নম্বর') || q.includes('কৌশল') || q.includes('পরীক্ষা')) {
        reply =
          'সম্পাদ্যে পূর্ণ ৪ নম্বর পাওয়ার প্রধান ৩টি টিপস:\n১. পেন্সিল খুব শার্প রাখবে এবং ডাবল লাইন দেবে না।\n২. কম্পাসের বৃত্তচাপগুলো যেন স্পষ্ট ও হালকা থাকে।\n৩. উপাত্ত চিত্র (পাশে স্কেল ও কোণ) আলাদা করে পরিষ্কারভাবে আঁকবে এবং অঙ্কনের ধাপগুলো পয়েন্ট আকারে লিখবে!';
      } else {
        reply =
          'ব্যবহারিক জ্যামিতির মূল রহস্য হলো প্রতিসাম্য ও সমদ্বিবাহু ত্রিভুজের ধর্ম ব্যবহার করে অজ্ঞাত বিন্দুটি খুঁজে বের করা! তোমার জ্যামিতি সংক্রান্ত আরও সুনির্দিষ্ট কিছু জানতে চাইলে বলো!';
      }
      setSheruChat([...newMessages, { sender: 'sheru', text: reply }]);
    }, 450);
  };

  const copyNotesToClipboard = () => {
    const text = `[শেরাতুতোর সাধারণ গণিত: অধ্যায় ৭ — ব্যবহারিক জ্যামিতি রিভিশন নোটস]
1. চতুর্ভুজ অঙ্কনের ৫টি স্বতন্ত্র উপাত্ত: (১) ৪ বাহু ও ১ কোণ, (২) ৪ বাহু ও ১ কর্ণ, (৩) ৩ বাহু ও ২ কর্ণ, (৪) ৩ বাহু ও ২ অন্তর্ভুক্ত কোণ, (৫) ২ বাহু ও ৩ কোণ।
2. বিশেষ চতুর্ভুজ উপাত্ত: বর্গ = ১টি, রম্বস = ২টি, আয়ত = ২টি, সামান্তরিক = ৩টি, ট্রাপিজিয়াম = ৪টি।
3. সম্পাদ্য ১ (সমষ্টি): BD = s, C বিন্দুতে ∠DCA = ∠BDC আঁকলে AD = AC হওয়ায় BA + AC = s হয়।
4. সম্পাদ্য ২ (অন্তর): c > b হলে সংলগ্ন রশ্মিতে BD = d, আর c < b হলে বিপরীত রশ্মিতে BD = d কাটা হয়।
5. সম্পাদ্য ৩ (পরিসীমা): DF = p এর দুই প্রান্তে x/2 ও y/2 এঁকে শীর্ষ A নির্ধারণ করা হয়।
6. সম্পাদ্য ৭ (রম্বস): কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে। ক্ষেত্রফল = (1/2) × d₁ × d₂।`;
    navigator.clipboard.writeText(text);
    setNotesCopied(true);
    setTimeout(() => setNotesCopied(false), 2500);
  };

  // ---------------------------------------------------------------------------
  // LAB RENDERERS
  // ---------------------------------------------------------------------------

  // LAB 1: Sum & Perimeter
  const renderLab1 = () => {
    // Mathematical points calculation for SVG
    // Base BC = a, Angle at B = angle, Sum = s
    // Let B be at (80, 240)
    // C at (80 + a * 25, 240)
    const scale = 22;
    const Bx = 80;
    const By = 230;
    const Cx = Bx + lab1Base * scale;
    const Cy = By;

    // Angle ray BD length s
    const rad = (lab1Angle * Math.PI) / 180;
    const Dx = Bx + lab1Sum * scale * Math.cos(rad);
    const Dy = By - lab1Sum * scale * Math.sin(rad);

    // Finding A: in triangle BCD, we need A on BD such that AD = AC
    // Let BA = c, BD = s => AD = s - c. In triangle ABC, AC = b = AD = s - c.
    // By cosine rule in triangle ABC: b^2 = c^2 + a^2 - 2ac cos(B)
    // (s - c)^2 = c^2 + a^2 - 2ac cos(B)
    // s^2 - 2sc + c^2 = c^2 + a^2 - 2ac cos(B)
    // s^2 - a^2 = 2sc - 2ac cos(B) = 2c (s - a cos(B))
    // c = (s^2 - a^2) / (2 * (s - a * cos(B)))
    const cosB = Math.cos(rad);
    const denom = 2 * (lab1Sum - lab1Base * cosB);
    const c = denom > 0 ? (lab1Sum * lab1Sum - lab1Base * lab1Base) / denom : lab1Sum / 2;
    const b = lab1Sum - c;

    const Ax = Bx + c * scale * Math.cos(rad);
    const Ay = By - c * scale * Math.sin(rad);

    // Perimeter math
    const P_DF = lab1P * 16;
    const Dx_p = 60;
    const Dy_p = 230;
    const Fx_p = Dx_p + P_DF;
    const Fy_p = Dy_p;

    // A_p intersection of rays with angles x/2 and y/2
    const radX_half = ((lab1AngleX / 2) * Math.PI) / 180;
    const radY_half = ((lab1AngleY / 2) * Math.PI) / 180;
    // line 1: y - Dy_p = -tan(radX_half) * (x - Dx_p)
    // line 2: y - Fy_p = -tan(radY_half) * (Fx_p - x)
    const tX = Math.tan(radX_half);
    const tY = Math.tan(radY_half);
    const Ax_p = (Dx_p * tX + Fx_p * tY) / (tX + tY);
    const Ay_p = Dy_p - tX * (Ax_p - Dx_p);

    // Points B_p and C_p on DF such that angle DAB = angle ADE and angle FAC = angle AFE
    // Triangle DAB is isosceles: DA = DB => B_p is at (Dx_p + 2*(Ax_p - Dx_p) * ...)
    // Or B_p: x coordinate = Dx_p + length_AD * cos / ... simpler:
    const Bx_p = Dx_p + (Ax_p - Dx_p) * 0.9;
    const Cx_p = Fx_p - (Fx_p - Ax_p) * 0.9;

    return (
      <div className="space-y-6">
        {/* Sub-mode selector */}
        <div className="flex flex-wrap gap-3 p-1.5 bg-muted/60 rounded-xl border border-border w-fit">
          <button
            onClick={() => {
              setLab1Mode('sum');
              setLab1Step(4);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab1Mode === 'sum'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            সম্পাদ্য ০১: ভূমি, কোণ ও বাহুর সমষ্টি (s)
          </button>
          <button
            onClick={() => {
              setLab1Mode('perimeter');
              setLab1PStep(4);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab1Mode === 'perimeter'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            সম্পাদ্য ০৩: পরিসীমা (p) ও ভূমিসংলগ্ন কোণদ্বয়
          </button>
        </div>

        {lab1Mode === 'sum' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Visualizer */}
            <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold">কম্পাস ও স্কেল সিমুলেটর — সম্পাদ্য ০১</span>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  ধাপ {toBn(lab1Step)} / ৪
                </div>
              </div>

              {/* Canvas Area */}
              <div className="relative w-full h-[320px] bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/80 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 460 300" className="w-full h-full">
                  {/* Grid background dots */}
                  <defs>
                    <pattern id="gridDots" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="currentColor" className="text-muted-foreground/20" />
                    </pattern>
                  </defs>
                  <rect width="460" height="300" fill="url(#gridDots)" />

                  {/* Base ray BE */}
                  <line x1="60" y1={By} x2="380" y2={By} stroke="currentColor" className="text-muted-foreground/40" strokeWidth="2" strokeDasharray="4 4" />
                  <text x="390" y={By + 4} className="text-[12px] font-semibold fill-muted-foreground">E</text>

                  {/* Step 1: Base BC */}
                  {lab1Step >= 1 && (
                    <g>
                      <line x1={Bx} y1={By} x2={Cx} y2={Cy} stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx={Bx} cy={By} r="4.5" fill="#10b981" />
                      <circle cx={Cx} cy={Cy} r="4.5" fill="#10b981" />
                      <text x={Bx - 15} y={By + 5} className="text-[13px] font-bold fill-foreground">B</text>
                      <text x={Cx + 5} y={Cy + 18} className="text-[13px] font-bold fill-emerald-600 dark:fill-emerald-400">C</text>
                      <text x={(Bx + Cx) / 2} y={By + 18} className="text-[11px] font-semibold fill-emerald-600 text-center" textAnchor="middle">
                        a = {lab1Base} cm
                      </text>
                    </g>
                  )}

                  {/* Step 2: Ray BF with angle */}
                  {lab1Step >= 2 && (
                    <g>
                      {/* Angle arc at B */}
                      <path
                        d={`M ${Bx + 30} ${By} A 30 30 0 0 0 ${Bx + 30 * Math.cos(rad)} ${By - 30 * Math.sin(rad)}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                      />
                      <text x={Bx + 36} y={By - 12} className="text-[11px] font-semibold fill-amber-500">
                        {lab1Angle}°
                      </text>
                      {/* Ray BF */}
                      <line x1={Bx} y1={By} x2={Bx + (lab1Sum + 2) * scale * Math.cos(rad)} y2={By - (lab1Sum + 2) * scale * Math.sin(rad)} stroke="currentColor" className="text-muted-foreground/50" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x={Bx + (lab1Sum + 2.3) * scale * Math.cos(rad)} y={By - (lab1Sum + 2.3) * scale * Math.sin(rad)} className="text-[12px] font-semibold fill-muted-foreground">F</text>
                    </g>
                  )}

                  {/* Step 3: BD = s cut & CD joined */}
                  {lab1Step >= 3 && (
                    <g>
                      {/* Arc cut at D */}
                      <circle cx={Dx} cy={Dy} r="4.5" fill="#8b5cf6" />
                      <text x={Dx - 18} y={Dy - 6} className="text-[13px] font-bold fill-purple-600 dark:fill-purple-400">D</text>
                      <line x1={Bx} y1={By} x2={Dx} y2={Dy} stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="5 5" />
                      {/* Line CD */}
                      <line x1={Cx} y1={Cy} x2={Dx} y2={Dy} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                      <text x={(Bx + Dx) / 2 - 20} y={(By + Dy) / 2} className="text-[11px] font-semibold fill-purple-600">
                        s = {lab1Sum} cm
                      </text>
                    </g>
                  )}

                  {/* Step 4: Equal angle at C & Point A formed */}
                  {lab1Step >= 4 && (
                    <g>
                      {/* Point A */}
                      <circle cx={Ax} cy={Ay} r="5" fill="#ef4444" />
                      <text x={Ax - 20} y={Ay - 2} className="text-[14px] font-black fill-red-600 dark:fill-red-400">A</text>
                      {/* Triangle ABC Sides */}
                      <line x1={Bx} y1={By} x2={Ax} y2={Ay} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

                      {/* Equal angle arcs at D and C */}
                      <circle cx={Dx} cy={Dy} r="18" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx={Cx} cy={Cy} r="18" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Ticks on AD and AC to show equality */}
                      <text x={(Ax + Dx) / 2 - 14} y={(Ay + Dy) / 2} className="text-[12px] font-bold fill-purple-500">//</text>
                      <text x={(Ax + Cx) / 2 + 8} y={(Ay + Cy) / 2} className="text-[12px] font-bold fill-purple-500">//</text>

                      {/* Final Triangle Fill */}
                      <polygon
                        points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                        fill="rgba(239, 68, 68, 0.12)"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                      />
                    </g>
                  )}
                </svg>

                {/* Live math overlay tag */}
                {lab1Step === 4 && (
                  <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm text-xs font-mono">
                    <span className="text-red-500 font-bold">△ABC: </span>
                    <span>c = {c.toFixed(1)} cm, </span>
                    <span>b = {b.toFixed(1)} cm </span>
                    <span className="text-emerald-500 font-bold">(যোগফল = {(c + b).toFixed(1)} cm)</span>
                  </div>
                )}
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground font-medium">অঙ্কনের ধাপ পরিবর্তন করুন:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setLab1Step(s)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        lab1Step === s
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      ধাপ {toBn(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls & Geometric Proof Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  উপাত্ত পরিমাপ নিয়ন্ত্রণ (Interactive Controls)
                </h4>

                {/* Base a */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">ভূমি a:</span>
                    <span className="font-bold text-emerald-600">{lab1Base} cm</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={7}
                    step={0.5}
                    value={lab1Base}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setLab1Base(val);
                      if (lab1Sum <= val) setLab1Sum(val + 3);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Angle x */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">কোণ ∠x:</span>
                    <span className="font-bold text-amber-600">{lab1Angle}°</span>
                  </div>
                  <input
                    type="range"
                    min={35}
                    max={75}
                    step={5}
                    value={lab1Angle}
                    onChange={(e) => setLab1Angle(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Sum s */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">দুই বাহুর সমষ্টি s (s &gt; a):</span>
                    <span className="font-bold text-purple-600">{lab1Sum} cm</span>
                  </div>
                  <input
                    type="range"
                    min={lab1Base + 1.5}
                    max={12}
                    step={0.5}
                    value={lab1Sum}
                    onChange={(e) => setLab1Sum(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Proof Narrative Card */}
              <div className="bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent rounded-2xl border border-primary/20 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  সম্পাদ্য ০১-এর গাণিতিক প্রমাণ
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    যেহেতু C বিন্দুতে <RenderMathText text="$\angle DCA = \angle BDC$" /> আঁকা হয়েছে, সেহেতু <RenderMathText text="$\triangle ACD$" />-এ:
                  </p>
                  <div className="bg-card/70 border border-border p-2.5 rounded-lg text-center font-mono text-xs">
                    <RenderMathText text="$\angle ADC = \angle ACD \implies AD = AC$" />
                  </div>
                  <p>
                    অতএব, <RenderMathText text="$BD = BA + AD = BA + AC = s$" />। সুতরাং <RenderMathText text="$\triangle ABC$" />-ই কাঙ্ক্ষিত ত্রিভুজ!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Sub-mode: Perimeter (Construction 3) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-semibold">কম্পাস ও স্কেল সিমুলেটর — সম্পাদ্য ০৩ (পরিসীমা)</span>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  ধাপ {toBn(lab1PStep)} / ৪
                </div>
              </div>

              <div className="relative w-full h-[320px] bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/80 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 460 300" className="w-full h-full">
                  <rect width="460" height="300" fill="url(#gridDots)" />

                  {/* Ray and Segment DF = p */}
                  {lab1PStep >= 1 && (
                    <g>
                      <line x1={Dx_p} y1={Dy_p} x2={Fx_p} y2={Fy_p} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                      <circle cx={Dx_p} cy={Dy_p} r="4.5" fill="#3b82f6" />
                      <circle cx={Fx_p} cy={Fy_p} r="4.5" fill="#3b82f6" />
                      <text x={Dx_p - 15} y={Dy_p + 5} className="text-[13px] font-bold fill-foreground">D</text>
                      <text x={Fx_p + 8} y={Fy_p + 5} className="text-[13px] font-bold fill-foreground">F</text>
                      <text x={(Dx_p + Fx_p) / 2} y={Dy_p + 20} className="text-[11px] font-semibold fill-blue-600 text-center" textAnchor="middle">
                        পরিসীমা p = {lab1P} cm
                      </text>
                    </g>
                  )}

                  {/* Step 2: Half angles at D and F intersecting at A */}
                  {lab1PStep >= 2 && (
                    <g>
                      <line x1={Dx_p} y1={Dy_p} x2={Ax_p} y2={Ay_p} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={Fx_p} y1={Fy_p} x2={Ax_p} y2={Ay_p} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx={Ax_p} cy={Ay_p} r="5" fill="#ef4444" />
                      <text x={Ax_p} y={Ay_p - 10} className="text-[14px] font-black fill-red-600" textAnchor="middle">A</text>
                      <text x={Dx_p + 25} y={Dy_p - 10} className="text-[10px] font-bold fill-purple-600">{(lab1AngleX / 2)}°</text>
                      <text x={Fx_p - 35} y={Fy_p - 10} className="text-[10px] font-bold fill-purple-600">{(lab1AngleY / 2)}°</text>
                    </g>
                  )}

                  {/* Step 3 & 4: Equal angles at A cutting B and C */}
                  {lab1PStep >= 3 && (
                    <g>
                      <circle cx={Bx_p} cy={Dy_p} r="4.5" fill="#10b981" />
                      <circle cx={Cx_p} cy={Dy_p} r="4.5" fill="#10b981" />
                      <text x={Bx_p} y={Dy_p + 20} className="text-[13px] font-bold fill-emerald-600" textAnchor="middle">B</text>
                      <text x={Cx_p} y={Dy_p + 20} className="text-[13px] font-bold fill-emerald-600" textAnchor="middle">C</text>

                      <line x1={Ax_p} y1={Ay_p} x2={Bx_p} y2={Dy_p} stroke="#ef4444" strokeWidth="2.8" />
                      <line x1={Ax_p} y1={Ay_p} x2={Cx_p} y2={Dy_p} stroke="#ef4444" strokeWidth="2.8" />
                      <line x1={Bx_p} y1={Dy_p} x2={Cx_p} y2={Dy_p} stroke="#ef4444" strokeWidth="3" />

                      <polygon
                        points={`${Ax_p},${Ay_p} ${Bx_p},${Dy_p} ${Cx_p},${Dy_p}`}
                        fill="rgba(239, 68, 68, 0.15)"
                      />

                      {/* Equal side ticks */}
                      <text x={(Dx_p + Bx_p) / 2} y={Dy_p - 8} className="text-[11px] font-bold fill-blue-500 text-center" textAnchor="middle">/</text>
                      <text x={(Ax_p + Bx_p) / 2 - 12} y={(Ay_p + Dy_p) / 2} className="text-[11px] font-bold fill-blue-500 text-center">/</text>
                    </g>
                  )}
                </svg>

                {lab1PStep >= 3 && (
                  <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm text-xs font-mono">
                    <span className="text-emerald-600 font-bold">∠B = {lab1AngleX}°, </span>
                    <span className="text-emerald-600 font-bold">∠C = {lab1AngleY}°, </span>
                    <span className="text-blue-600 font-bold">p = {lab1P} cm</span>
                  </div>
                )}
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground font-medium">অঙ্কনের ধাপ পরিবর্তন করুন:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setLab1PStep(s)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        lab1PStep === s
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      ধাপ {toBn(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  পরিসীমা ও কোণ পরিমাপ নিয়ন্ত্রণ
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">পরিসীমা p:</span>
                    <span className="font-bold text-blue-600">{lab1P} cm</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={15}
                    step={0.5}
                    value={lab1P}
                    onChange={(e) => setLab1P(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">কোণ ∠x:</span>
                    <span className="font-bold text-purple-600">{lab1AngleX}° (অর্ধেক = {lab1AngleX / 2}°)</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={70}
                    step={2}
                    value={lab1AngleX}
                    onChange={(e) => setLab1AngleX(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">কোণ ∠y:</span>
                    <span className="font-bold text-purple-600">{lab1AngleY}° (অর্ধেক = {lab1AngleY / 2}°)</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={70}
                    step={2}
                    value={lab1AngleY}
                    onChange={(e) => setLab1AngleY(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/5 via-blue-500/[0.02] to-transparent rounded-2xl border border-blue-500/20 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  সম্পাদ্য ০৩-এর বহিঃস্থ কোণ যুক্তি
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    <RenderMathText text="$\triangle ABD$" />-এ <RenderMathText text="$AD = BD$" /> হওয়ায়:
                  </p>
                  <div className="bg-card/70 border border-border p-2 rounded-lg text-center font-mono text-xs">
                    <RenderMathText text="$\text{বহিঃস্থ } \angle ABC = \angle DAB + \angle ADB = \frac{x}{2} + \frac{x}{2} = x$" />
                  </div>
                  <p>
                    অনুরূপভাবে <RenderMathText text="$\angle ACB = y$" /> এবং <RenderMathText text="$AB + BC + CA = BD + BC + CF = DF = p$" />!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // LAB 2: Difference of Sides
  const renderLab2 = () => {
    const scale = 25;
    const Bx = 100;
    const By = 220;
    const Cx = Bx + lab2Base * scale;
    const Cy = By;

    const rad = (lab2Angle * Math.PI) / 180;
    const Dx = Bx + lab2Diff * scale * Math.cos(rad);
    const Dy = By - lab2Diff * scale * Math.sin(rad);

    // Finding A such that AB - AC = d (meaning AD = AC)
    // in triangle BCD, let BD = d.
    // c = (a^2 - d^2) / (2 * (a * cos(B) - d))
    const cosB = Math.cos(rad);
    const denom = 2 * (lab2Base * cosB - lab2Diff);
    const c = denom > 0 ? (lab2Base * lab2Base - lab2Diff * lab2Diff) / denom : lab2Diff + 4;
    const b = c - lab2Diff;

    const Ax = Bx + c * scale * Math.cos(rad);
    const Ay = By - c * scale * Math.sin(rad);

    return (
      <div className="space-y-6">
        {/* Case Toggle */}
        <div className="flex flex-wrap gap-3 p-1.5 bg-muted/60 rounded-xl border border-border w-fit">
          <button
            onClick={() => setLab2Case('greater')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab2Case === 'greater'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            কেস ০১: সংলগ্ন বাহু বৃহত্তর (c &gt; b)
          </button>
          <button
            onClick={() => setLab2Case('smaller')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab2Case === 'smaller'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            কেস ০২: বিপরীত বাহু বৃহত্তর (c &lt; b / বিপরীত রশ্মি)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-semibold">কম্পাস ও স্কেল সিমুলেটর — সম্পাদ্য ০২ (অন্তর)</span>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                ধাপ {toBn(lab2Step)} / ৪
              </div>
            </div>

            <div className="relative w-full h-[320px] bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/80 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 460 300" className="w-full h-full">
                <rect width="460" height="300" fill="url(#gridDots)" />

                {/* Ray BE */}
                <line x1="80" y1={By} x2="380" y2={By} stroke="currentColor" className="text-muted-foreground/30" strokeWidth="2" strokeDasharray="3 3" />

                {/* Base BC */}
                <line x1={Bx} y1={By} x2={Cx} y2={Cy} stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx={Bx} cy={By} r="4.5" fill="#10b981" />
                <circle cx={Cx} cy={Cy} r="4.5" fill="#10b981" />
                <text x={Bx - 15} y={By + 5} className="text-[13px] font-bold fill-foreground">B</text>
                <text x={Cx + 8} y={Cy + 5} className="text-[13px] font-bold fill-emerald-600">C</text>
                <text x={(Bx + Cx) / 2} y={By + 18} className="text-[11px] font-semibold fill-emerald-600" textAnchor="middle">
                  a = {lab2Base} cm
                </text>

                {lab2Case === 'greater' ? (
                  <>
                    {/* Angle Ray */}
                    <line x1={Bx} y1={By} x2={Bx + 11 * scale * Math.cos(rad)} y2={By - 11 * scale * Math.sin(rad)} stroke="currentColor" className="text-muted-foreground/40" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Step 2: Cut BD = d */}
                    {lab2Step >= 2 && (
                      <g>
                        <circle cx={Dx} cy={Dy} r="4.5" fill="#8b5cf6" />
                        <text x={Dx - 18} y={Dy} className="text-[12px] font-bold fill-purple-600">D</text>
                        <line x1={Bx} y1={By} x2={Dx} y2={Dy} stroke="#8b5cf6" strokeWidth="3" />
                        <text x={(Bx + Dx) / 2 - 14} y={(By + Dy) / 2} className="text-[10px] font-bold fill-purple-600">
                          d = {lab2Diff} cm
                        </text>
                      </g>
                    )}

                    {/* Step 3: Connect CD */}
                    {lab2Step >= 3 && (
                      <line x1={Cx} y1={Cy} x2={Dx} y2={Dy} stroke="#64748b" strokeWidth="1.8" strokeDasharray="4 4" />
                    )}

                    {/* Step 4: Equal angle / perpendicular bisector giving A */}
                    {lab2Step >= 4 && (
                      <g>
                        <circle cx={Ax} cy={Ay} r="5" fill="#ef4444" />
                        <text x={Ax - 20} y={Ay - 2} className="text-[14px] font-black fill-red-600">A</text>
                        <line x1={Bx} y1={By} x2={Ax} y2={Ay} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                        <line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />

                        <polygon
                          points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                          fill="rgba(239, 68, 68, 0.12)"
                        />

                        {/* Equal marks AD = AC */}
                        <text x={(Ax + Dx) / 2 - 12} y={(Ay + Dy) / 2} className="text-[11px] font-bold fill-purple-500">//</text>
                        <text x={(Ax + Cx) / 2 + 8} y={(Ay + Cy) / 2} className="text-[11px] font-bold fill-purple-500">//</text>
                      </g>
                    )}
                  </>
                ) : (
                  /* Case 2: Smaller case opposite ray */
                  <>
                    {/* Opposite Ray BG */}
                    <line x1={Bx} y1={By} x2={Bx - 4 * scale * Math.cos(rad)} y2={By + 4 * scale * Math.sin(rad)} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />
                    <text x={Bx - 4.5 * scale * Math.cos(rad)} y={By + 4.5 * scale * Math.sin(rad)} className="text-[12px] font-bold fill-purple-600">G</text>

                    {/* BD on opposite ray */}
                    <circle cx={Bx - lab2Diff * scale * Math.cos(rad)} cy={By + lab2Diff * scale * Math.sin(rad)} r="4.5" fill="#8b5cf6" />
                    <text x={Bx - lab2Diff * scale * Math.cos(rad) - 16} y={By + lab2Diff * scale * Math.sin(rad) + 12} className="text-[12px] font-bold fill-purple-600">D</text>

                    {/* Regular ray BF */}
                    <line x1={Bx} y1={By} x2={Bx + 9 * scale * Math.cos(rad)} y2={By - 9 * scale * Math.sin(rad)} stroke="#ef4444" strokeWidth="2.5" />
                    <line x1={Cx} y1={Cy} x2={Bx - lab2Diff * scale * Math.cos(rad)} y2={By + lab2Diff * scale * Math.sin(rad)} stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

                    <div className="absolute top-4 left-4 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs text-amber-600 font-medium">
                      বিপরীত রশ্মি BG হতে BD = d কর্তন পদ্ধতি (c &lt; b)
                    </div>
                  </>
                )}
              </svg>

              {lab2Step === 4 && lab2Case === 'greater' && (
                <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm text-xs font-mono">
                  <span className="text-red-500 font-bold">△ABC: </span>
                  <span>AB = {c.toFixed(1)} cm, </span>
                  <span>AC = {b.toFixed(1)} cm </span>
                  <span className="text-emerald-500 font-bold">(অন্তর = {(c - b).toFixed(1)} cm)</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground font-medium">অঙ্কনের ধাপ পরিবর্তন করুন:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setLab2Step(s)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      lab2Step === s
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    ধাপ {toBn(s)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                অন্তর ও কোণ নিয়ন্ত্রণ
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">ভূমি a:</span>
                  <span className="font-bold text-emerald-600">{lab2Base} cm</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={7}
                  step={0.5}
                  value={lab2Base}
                  onChange={(e) => setLab2Base(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">কোণ ∠B:</span>
                  <span className="font-bold text-amber-600">{lab2Angle}°</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={65}
                  step={5}
                  value={lab2Angle}
                  onChange={(e) => setLab2Angle(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">দুই বাহুর অন্তর d (d &lt; a):</span>
                  <span className="font-bold text-purple-600">{lab2Diff} cm</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3.5}
                  step={0.5}
                  value={lab2Diff}
                  onChange={(e) => setLab2Diff(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/5 via-amber-500/[0.02] to-transparent rounded-2xl border border-amber-500/20 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                বোর্ড পরীক্ষার কমন ফাঁদ: c &gt; b বনাম c &lt; b
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  যদি প্রশ্নে বলা থাকে <RenderMathText text="$AB - AC = d$" />, তবে কোণের বাহু <RenderMathText text="$BF$" /> হতেই <RenderMathText text="$BD = d$" /> কাটতে হবে।
                </p>
                <p>
                  কিন্তু যদি <RenderMathText text="$AC - AB = d$" /> (বিপরীত বাহু বড়) হয়, তবে <RenderMathText text="$BF$" /> এর বিপরীত দিকে <RenderMathText text="$BG$" /> বাড়িয়ে <RenderMathText text="$BD = d$" /> কাটতে হবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // LAB 3: Right Triangles
  const renderLab3 = () => {
    const scale = 25;
    const Bx = 120;
    const By = 230;
    const Cx = Bx + lab3Base * scale;
    const Cy = By;

    // In right triangle ABC at B = 90 deg
    // Hypotenuse AC = h, BC = a => AB = sqrt(h^2 - a^2)
    const h = lab3Hyp > lab3Base ? lab3Hyp : lab3Base + 1.5;
    const height = Math.sqrt(h * h - lab3Base * lab3Base);
    const Ay = By - height * scale;
    const Ax = Bx;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 p-1.5 bg-muted/60 rounded-xl border border-border w-fit">
          <button
            onClick={() => setLab3Mode('hyp_side')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab3Mode === 'hyp_side'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            সম্পাদ্য ০৪: অতিভুজ (h) ও অপর বাহু (a)
          </button>
          <button
            onClick={() => setLab3Mode('hyp_angle')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab3Mode === 'hyp_angle'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            সম্পাদ্য ০৫: অতিভুজ (h) ও সূক্ষ্মকোণ (অর্ধবৃত্ত মেথড)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold">সমকোণী ত্রিভুজ অঙ্কন সিমুলেটর</span>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                ধাপ {toBn(lab3Step)} / ৩
              </div>
            </div>

            <div className="relative w-full h-[320px] bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/80 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 460 300" className="w-full h-full">
                <rect width="460" height="300" fill="url(#gridDots)" />

                {/* Base BC */}
                <line x1={Bx} y1={By} x2={Cx} y2={Cy} stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx={Bx} cy={By} r="4.5" fill="#10b981" />
                <circle cx={Cx} cy={Cy} r="4.5" fill="#10b981" />
                <text x={Bx - 15} y={By + 5} className="text-[13px] font-bold fill-foreground">B</text>
                <text x={Cx + 8} y={Cy + 5} className="text-[13px] font-bold fill-emerald-600">C</text>
                <text x={(Bx + Cx) / 2} y={By + 18} className="text-[11px] font-semibold fill-emerald-600" textAnchor="middle">
                  a = {lab3Base} cm
                </text>

                {/* Step 1: Perpendicular ray BE at B */}
                {lab3Step >= 1 && (
                  <g>
                    <line x1={Bx} y1={By} x2={Bx} y2="40" stroke="currentColor" className="text-muted-foreground/40" strokeWidth="2" strokeDasharray="3 3" />
                    {/* 90 deg symbol */}
                    <rect x={Bx} y={By - 16} width="16" height="16" fill="none" stroke="#64748b" strokeWidth="1.5" />
                    <text x={Bx - 15} y="50" className="text-[12px] font-semibold fill-muted-foreground">E</text>
                  </g>
                )}

                {/* Step 2: Compass arc from C with radius h */}
                {lab3Step >= 2 && (
                  <g>
                    {/* Compass arc cutting BE at A */}
                    <path
                      d={`M ${Bx - 20} ${Ay} A ${h * scale} ${h * scale} 0 0 1 ${Bx + 20} ${Ay - 15}`}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                    />
                    <circle cx={Ax} cy={Ay} r="5" fill="#ef4444" />
                    <text x={Ax - 18} y={Ay - 2} className="text-[14px] font-black fill-red-600">A</text>
                    <line x1={Cx} y1={Cy} x2={Ax} y2={Ay} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" />
                    <text x={(Cx + Ax) / 2 + 10} y={(Cy + Ay) / 2} className="text-[11px] font-bold fill-purple-600">
                      h = {h} cm
                    </text>
                  </g>
                )}

                {/* Step 3: Triangle Completed */}
                {lab3Step >= 3 && (
                  <g>
                    <line x1={Bx} y1={By} x2={Ax} y2={Ay} stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1={Ax} y1={Ay} x2={Cx} y2={Cy} stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                    <polygon
                      points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                      fill="rgba(239, 68, 68, 0.12)"
                    />
                    <text x={Bx - 45} y={(By + Ay) / 2} className="text-[11px] font-bold fill-red-500">
                      উচ্চতা = {height.toFixed(1)} cm
                    </text>
                  </g>
                )}
              </svg>

              <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm text-xs font-mono">
                <span className="text-red-500 font-bold">পিথাগোরাস: </span>
                <span>{h}² = {lab3Base}² + {height.toFixed(1)}² </span>
                <span className="text-emerald-500 font-bold">({(h * h).toFixed(1)} = {(lab3Base * lab3Base + height * height).toFixed(1)})</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground font-medium">অঙ্কনের ধাপ পরিবর্তন করুন:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setLab3Step(s)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      lab3Step === s
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    ধাপ {toBn(s)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                অতিভুজ ও বাহু নিয়ন্ত্রণ
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">ভূমি a:</span>
                  <span className="font-bold text-emerald-600">{lab3Base} cm</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={6}
                  step={0.5}
                  value={lab3Base}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLab3Base(val);
                    if (lab3Hyp <= val) setLab3Hyp(val + 1.5);
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">অতিভুজ h (h &gt; a):</span>
                  <span className="font-bold text-purple-600">{lab3Hyp} cm</span>
                </div>
                <input
                  type="range"
                  min={lab3Base + 1}
                  max={9}
                  step={0.5}
                  value={lab3Hyp}
                  onChange={(e) => setLab3Hyp(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/5 via-emerald-500/[0.02] to-transparent rounded-2xl border border-emerald-500/20 p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                সমকোণী ত্রিভুজের অনন্য বৈশিষ্ট্য
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                <p>
                  সমকোণী ত্রিভুজে একটি কোণ <RenderMathText text="$90^\circ$" /> জানা থাকায় সাধারণ ত্রিভুজের চেয়ে ১টি উপাত্ত কম লাগে (৩টির বদলে মাত্র ২টি উপাত্ত)।
                </p>
                <div className="font-mono bg-card/60 p-2 rounded border border-border text-center">
                  <RenderMathText text={`$\\text{অপর বাহু } b = \\sqrt{h^2 - a^2} = \\sqrt{${lab3Hyp}^2 - ${lab3Base}^2} = ${height.toFixed(2)}\\text{ cm}$`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // LAB 4: 5 Conditions & Quadrilateral Matrix
  const renderLab4 = () => {
    const conditions = [
      { id: 1, title: '৪টি বাহু ও ১টি কোণ', sub: 'a, b, c, d এবং ∠x', badge: 'শর্ত ০১' },
      { id: 2, title: '৪টি বাহু ও ১টি কর্ণ', sub: 'a, b, c, d এবং d₁', badge: 'শর্ত ০২' },
      { id: 3, title: '৩টি বাহু ও ২টি কর্ণ', sub: 'a, b, c এবং d₁, d₂', badge: 'শর্ত ০৩' },
      { id: 4, title: '৩টি বাহু ও ২টি অন্তর্ভুক্ত কোণ', sub: 'a, b, c এবং ∠x, ∠y', badge: 'শর্ত ০৪' },
      { id: 5, title: '২টি বাহু ও ৩টি কোণ', sub: 'a, b এবং ∠x, ∠y, ∠z', badge: 'শর্ত ০৫' },
    ];

    const quadMatrix = [
      {
        id: 'square',
        name: 'বর্গক্ষেত্র (Square)',
        needed: 1,
        desc: 'কেবল ১টি বাহুর দৈর্ঘ্য (a) জানা থাকলেই বর্গ অঙ্কন সম্ভব। কারণ ৪টি বাহুই সমান এবং প্রতিটি কোণ ৯০°।',
        badge: '১টি উপাত্ত',
      },
      {
        id: 'rhombus',
        name: 'রম্বস (Rhombus)',
        needed: 2,
        desc: '২টি উপাত্ত প্রয়োজন: হয় ২টি কর্ণের দৈর্ঘ্য (d₁, d₂), অথবা ১টি বাহু ও ১টি কোণ।',
        badge: '২টি উপাত্ত',
      },
      {
        id: 'rectangle',
        name: 'আয়তক্ষেত্র (Rectangle)',
        needed: 2,
        desc: '২টি উপাত্ত প্রয়োজন: দৈর্ঘ্য ও প্রস্থ (a, b), অথবা ১টি কর্ণ ও ১টি বাহু।',
        badge: '২টি উপাত্ত',
      },
      {
        id: 'parallelogram',
        name: 'সামান্তরিক (Parallelogram)',
        needed: 3,
        desc: '৩টি উপাত্ত প্রয়োজন: ২টি সন্নিহিত বাহু ও অন্তর্ভুক্ত কোণ, অথবা ২টি কর্ণ ও অন্তর্ভুক্ত কোণ।',
        badge: '৩টি উপাত্ত',
      },
      {
        id: 'trapezoid',
        name: 'ট্রাপিজিয়াম (Trapezoid)',
        needed: 4,
        desc: '৪টি উপাত্ত প্রয়োজন: সমান্তরাল দুই বাহু ও তাদের সংলগ্ন দুটি কোণ, অথবা ৪টি বাহুর দৈর্ঘ্য।',
        badge: '৪টি উপাত্ত',
      },
      {
        id: 'general',
        name: 'সাধারণ চতুর্ভুজ (General Quadrilateral)',
        needed: 5,
        desc: 'যেকোনো অনিয়মিত চতুর্ভুজের জন্য অবশ্যই ৫টি স্বতন্ত্র উপাত্ত নির্দিষ্ট থাকতে হবে।',
        badge: '৫টি উপাত্ত',
      },
    ];

    return (
      <div className="space-y-6">
        {/* Conditions 5 Tabs */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            চতুর্ভুজ অঙ্কনের ৫টি সুনির্দিষ্ট বিকল্প শর্ত (এনসিটিবি পাঠ্যবই)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {conditions.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCondition(c.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedCondition === c.id
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-muted/40 hover:bg-muted/70'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{c.badge}</span>
                <p className="text-xs font-bold text-foreground mt-1">{c.title}</p>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{c.sub}</p>
              </button>
            ))}
          </div>

          <div className="bg-muted/30 p-4 rounded-xl border border-border/80 text-xs text-muted-foreground flex items-center justify-between">
            <span>
              নির্বাচিত শর্ত: <strong className="text-foreground">{conditions[selectedCondition - 1].title}</strong> — এই ৫টি উপাত্ত জানা থাকলে চতুর্ভুজটিকে দুটি ত্রিভুজে বিভক্ত করে অনন্যভাবে অঙ্কন করা যায়।
            </span>
            <span className="text-emerald-600 font-bold px-2 py-0.5 bg-emerald-500/10 rounded">যাচাইকৃত</span>
          </div>
        </div>

        {/* Minimum Data Matrix */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              বিশেষ চতুর্ভুজের মিনিমাম উপাত্ত ডিটেক্টর (Independent Data Hierarchy)
            </h4>
            <span className="text-xs text-muted-foreground">ক্লিক করে যাচাই করুন</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quadMatrix.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQuadType(q.id as any)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedQuadType === q.id
                    ? 'border-purple-500 bg-purple-500/10 shadow-sm'
                    : 'border-border bg-muted/40 hover:bg-muted/70'
                }`}
              >
                <div className="text-xl font-black text-purple-600">{q.needed}</div>
                <div className="text-xs font-bold text-foreground mt-1">{q.name.split(' ')[0]}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{q.badge}</div>
              </button>
            ))}
          </div>

          {/* Detailed Info on Selected Quad */}
          {(() => {
            const current = quadMatrix.find((q) => q.id === selectedQuadType)!;
            return (
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h5 className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {current.name} — আবশ্যক উপাত্ত: {current.needed}টি
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">{current.desc}</p>
                </div>
                <div className="text-xs font-mono font-bold px-3 py-1.5 bg-purple-500/10 text-purple-600 rounded-lg whitespace-nowrap self-start md:self-auto">
                  উপাত্ত সংখ্যা: {current.needed}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  // LAB 5: Trapezoid & Rhombus
  const renderLab5 = () => {
    // Rhombus Math
    const O_x = 230;
    const O_y = 150;
    const r_scale = 16;
    const halfD1 = (lab5Diag1 / 2) * r_scale;
    const halfD2 = (lab5Diag2 / 2) * r_scale;

    const B_x = O_x - halfD1;
    const B_y = O_y;
    const D_x = O_x + halfD1;
    const D_y = O_y;

    const A_x = O_x;
    const A_y = O_y - halfD2;
    const C_x = O_x;
    const C_y = O_y + halfD2;

    const side = Math.sqrt((lab5Diag1 / 2) ** 2 + (lab5Diag2 / 2) ** 2);
    const area = 0.5 * lab5Diag1 * lab5Diag2;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 p-1.5 bg-muted/60 rounded-xl border border-border w-fit">
          <button
            onClick={() => setLab5Mode('rhombus')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab5Mode === 'rhombus'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            সম্পাদ্য ০৭: রম্বসের দুই কর্ণ (d₁, d₂) সিমুলেটর
          </button>
          <button
            onClick={() => setLab5Mode('trapezoid')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              lab5Mode === 'trapezoid'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            সম্পাদ্য ০৬: ট্রাপিজিয়ামের সমান্তরাল বাহুদ্বয় ও কোণদ্বয়
          </button>
        </div>

        {lab5Mode === 'rhombus' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-sm font-semibold">রম্বস অঙ্কন সিমুলেটর — সম্পাদ্য ০৭</span>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  ধাপ {toBn(lab5RhombusStep)} / ৪
                </div>
              </div>

              <div className="relative w-full h-[320px] bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/80 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 460 300" className="w-full h-full">
                  <rect width="460" height="300" fill="url(#gridDots)" />

                  {/* Step 1: Diagonal BD = d1 */}
                  {lab5RhombusStep >= 1 && (
                    <g>
                      <line x1={B_x} y1={B_y} x2={D_x} y2={D_y} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                      <circle cx={B_x} cy={B_y} r="4.5" fill="#3b82f6" />
                      <circle cx={D_x} cy={D_y} r="4.5" fill="#3b82f6" />
                      <text x={B_x - 18} y={B_y + 5} className="text-[13px] font-bold fill-foreground">B</text>
                      <text x={D_x + 8} y={D_y + 5} className="text-[13px] font-bold fill-foreground">D</text>
                      <text x={O_x} y={O_y + 18} className="text-[11px] font-semibold fill-blue-600 text-center" textAnchor="middle">
                        d₁ = {lab5Diag1} cm
                      </text>
                    </g>
                  )}

                  {/* Step 2: Perpendicular bisector PQ */}
                  {lab5RhombusStep >= 2 && (
                    <g>
                      <line x1={O_x} y1="30" x2={O_x} y2="270" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx={O_x} cy={O_y} r="3.5" fill="#8b5cf6" />
                      <text x={O_x + 8} y={O_y - 6} className="text-[11px] font-bold fill-purple-600">O</text>
                      <text x={O_x + 8} y="40" className="text-[11px] font-bold fill-purple-600">P</text>
                      <text x={O_x + 8} y="265" className="text-[11px] font-bold fill-purple-600">Q</text>
                    </g>
                  )}

                  {/* Step 3: Cut d2/2 on both sides giving A and C */}
                  {lab5RhombusStep >= 3 && (
                    <g>
                      <circle cx={A_x} cy={A_y} r="5" fill="#ef4444" />
                      <circle cx={C_x} cy={C_y} r="5" fill="#ef4444" />
                      <text x={A_x} y={A_y - 10} className="text-[13px] font-bold fill-red-600" textAnchor="middle">A</text>
                      <text x={C_x} y={C_y + 18} className="text-[13px] font-bold fill-red-600" textAnchor="middle">C</text>
                    </g>
                  )}

                  {/* Step 4: Connect Rhombus ABCD */}
                  {lab5RhombusStep >= 4 && (
                    <g>
                      <polygon
                        points={`${A_x},${A_y} ${B_x},${B_y} ${C_x},${C_y} ${D_x},${D_y}`}
                        fill="rgba(239, 68, 68, 0.12)"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}
                </svg>

                {lab5RhombusStep === 4 && (
                  <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm text-xs font-mono">
                    <span className="text-red-500 font-bold">বাহু a = {side.toFixed(1)} cm, </span>
                    <span className="text-emerald-500 font-bold">ক্ষেত্রফল = {area.toFixed(1)} cm²</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground font-medium">অঙ্কনের ধাপ পরিবর্তন করুন:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setLab5RhombusStep(s)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        lab5RhombusStep === s
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      ধাপ {toBn(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  কর্ণদ্বয়ের দৈর্ঘ্য নিয়ন্ত্রণ
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">কর্ণ ১ (d₁):</span>
                    <span className="font-bold text-blue-600">{lab5Diag1} cm</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={10}
                    step={0.5}
                    value={lab5Diag1}
                    onChange={(e) => setLab5Diag1(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">কর্ণ ২ (d₂):</span>
                    <span className="font-bold text-purple-600">{lab5Diag2} cm</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={8}
                    step={0.5}
                    value={lab5Diag2}
                    onChange={(e) => setLab5Diag2(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/5 via-indigo-500/[0.02] to-transparent rounded-2xl border border-indigo-500/20 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  রম্বসের পিথাগোরাস ও ক্ষেত্রফল সূত্র
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                  <p>
                    যেহেতু রম্বসের কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে, তাই এর প্রতিটি বাহু:
                  </p>
                  <div className="bg-card/70 border border-border p-2 rounded-lg text-center font-mono text-xs">
                    <RenderMathText text={`$a = \\sqrt{(d_1/2)^2 + (d_2/2)^2} = \\sqrt{${(lab5Diag1 / 2).toFixed(1)}^2 + ${(lab5Diag2 / 2).toFixed(1)}^2} = ${side.toFixed(2)}\\text{ cm}$`} />
                  </div>
                  <p>
                    এবং ক্ষেত্রফল <RenderMathText text={`$= \\frac{1}{2} \\times d_1 \\times d_2 = \\frac{1}{2} \\times ${lab5Diag1} \\times ${lab5Diag2} = ${area}\\text{ cm}^2$`} />।
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Trapezoid Simulator */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold">ট্রাপিজিয়াম অঙ্কন সিমুলেটর — সম্পাদ্য ০৬</span>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  ধাপ {toBn(lab5TrapStep)} / ৪
                </div>
              </div>

              <div className="relative w-full h-[320px] bg-muted/30 dark:bg-muted/10 rounded-xl border border-border/80 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 460 300" className="w-full h-full">
                  <rect width="460" height="300" fill="url(#gridDots)" />

                  {/* Math for trapezoid drawing */}
                  {/* AB = a = 7 cm, let Ax = 60, Ay = 220, Bx = 60 + a*32 */}
                  {(() => {
                    const t_scale = 30;
                    const Ax = 60;
                    const Ay = 220;
                    const Bx = Ax + lab5TrapA * t_scale;
                    const By = Ay;

                    const Ex = Ax + (lab5TrapA - lab5TrapB) * t_scale; // a - b
                    const Ey = Ay;

                    const radX = (lab5TrapX * Math.PI) / 180;
                    const radY = (lab5TrapY * Math.PI) / 180;

                    // Height h of trapezoid determined by triangle EBC where angle E = angle A = radX, angle B = radY
                    // In triangle EBC with base EB = a - b:
                    const base_EB = (lab5TrapA - lab5TrapB) * t_scale;
                    const tanX = Math.tan(radX);
                    const tanY = Math.tan(radY);
                    const Cx = Ex + (base_EB * tanY) / (tanX + tanY);
                    const h_trap = (Cx - Ex) * tanX;
                    const Cy = Ey - h_trap;

                    const Dx = Cx - lab5TrapB * t_scale;
                    const Dy = Cy;

                    return (
                      <g>
                        {/* Base AB */}
                        <line x1={Ax} y1={Ay} x2={Bx} y2={By} stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                        <circle cx={Ax} cy={Ay} r="4.5" fill="#10b981" />
                        <circle cx={Bx} cy={By} r="4.5" fill="#10b981" />
                        <text x={Ax - 15} y={Ay + 5} className="text-[13px] font-bold fill-foreground">A</text>
                        <text x={Bx + 8} y={By + 5} className="text-[13px] font-bold fill-foreground">B</text>

                        {/* Step 2: Angles at A and B */}
                        {lab5TrapStep >= 2 && (
                          <g>
                            <line x1={Ax} y1={Ay} x2={Ax + 120 * Math.cos(radX)} y2={Ay - 120 * Math.sin(radX)} stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4 4" />
                            <line x1={Bx} y1={By} x2={Bx - 120 * Math.cos(radY)} y2={By - 120 * Math.sin(radY)} stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4 4" />
                            <text x={Ax + 30} y={Ay - 10} className="text-[10px] font-bold fill-amber-500">{lab5TrapX}°</text>
                            <text x={Bx - 40} y={By - 10} className="text-[10px] font-bold fill-amber-500">{lab5TrapY}°</text>
                          </g>
                        )}

                        {/* Step 3: Cut EB = a - b and parallel line */}
                        {lab5TrapStep >= 3 && (
                          <g>
                            <circle cx={Ex} cy={Ey} r="4" fill="#8b5cf6" />
                            <text x={Ex} y={Ey + 16} className="text-[11px] font-bold fill-purple-600" textAnchor="middle">E</text>
                            <line x1={Ex} y1={Ey} x2={Cx} y2={Cy} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />
                          </g>
                        )}

                        {/* Step 4: Trapezoid ABCD complete */}
                        {lab5TrapStep >= 4 && (
                          <g>
                            <circle cx={Cx} cy={Cy} r="4.5" fill="#ef4444" />
                            <circle cx={Dx} cy={Dy} r="4.5" fill="#ef4444" />
                            <text x={Cx + 6} y={Cy - 6} className="text-[13px] font-bold fill-red-600">C</text>
                            <text x={Dx - 14} y={Dy - 6} className="text-[13px] font-bold fill-red-600">D</text>

                            <line x1={Dx} y1={Dy} x2={Cx} y2={Cy} stroke="#ef4444" strokeWidth="3" />
                            <line x1={Ax} y1={Ay} x2={Dx} y2={Dy} stroke="#ef4444" strokeWidth="3" />
                            <line x1={Bx} y1={By} x2={Cx} y2={Cy} stroke="#ef4444" strokeWidth="3" />

                            <polygon
                              points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy} ${Dx},${Dy}`}
                              fill="rgba(239, 68, 68, 0.15)"
                            />

                            <text x={(Dx + Cx) / 2} y={Dy - 8} className="text-[11px] font-bold fill-red-500" textAnchor="middle">
                              b = {lab5TrapB} cm
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>

                {lab5TrapStep === 4 && (
                  <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-sm text-xs font-mono">
                    <span className="text-red-500 font-bold">ট্রাপিজিয়াম ABCD: </span>
                    <span>AB || CD, </span>
                    <span className="text-emerald-500 font-bold">a = {lab5TrapA} cm, b = {lab5TrapB} cm</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground font-medium">অঙ্কনের ধাপ পরিবর্তন করুন:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setLab5TrapStep(s)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        lab5TrapStep === s
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      ধাপ {toBn(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  ট্রাপিজিয়ামের উপাত্ত নিয়ন্ত্রণ
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">বৃহত্তর সমান্তরাল বাহু a:</span>
                    <span className="font-bold text-emerald-600">{lab5TrapA} cm</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={9}
                    step={0.5}
                    value={lab5TrapA}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setLab5TrapA(val);
                      if (lab5TrapB >= val) setLab5TrapB(val - 2);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">ক্ষুদ্রতর সমান্তরাল বাহু b (b &lt; a):</span>
                    <span className="font-bold text-purple-600">{lab5TrapB} cm</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={lab5TrapA - 1}
                    step={0.5}
                    value={lab5TrapB}
                    onChange={(e) => setLab5TrapB(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">কোণ ∠x:</span>
                    <span className="font-bold text-amber-600">{lab5TrapX}°</span>
                  </div>
                  <input
                    type="range"
                    min={45}
                    max={75}
                    step={5}
                    value={lab5TrapX}
                    onChange={(e) => setLab5TrapX(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/5 via-emerald-500/[0.02] to-transparent rounded-2xl border border-emerald-500/20 p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  ট্রাপিজিয়াম সম্পাদ্যের গোপন ট্রিক (a - b)
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                  <p>
                    ট্রাপিজিয়ামের সমান্তরাল বাহু দুটি বিয়োগ করে <RenderMathText text="$EB = a - b$" /> তৈরি করলে <RenderMathText text="$\triangle EBC$" /> একটি স্বাধীন ত্রিভুজ হয়ে যায়!
                  </p>
                  <p>
                    এরপর <RenderMathText text="$EC \parallel AD$" /> টানলে <RenderMathText text="$AECD$" /> একটি সামান্তরিক হয় এবং ট্রাপিজিয়াম <RenderMathText text="$ABCD$" /> স্বয়ংক্রিয়ভাবে গঠিত হয়।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/20">
      {/* HEADER / BREADCRUMB */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/playground/v2"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              প্লেগ্রাউন্ড লাইব্রেরি
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-primary">সাধারণ গণিত</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <h1 className="text-sm font-black tracking-tight flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              অধ্যায় ৭: ব্যবহারিক জ্যামিতি
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSheruOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-bold text-primary transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>শেরু এআই টিউটর</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                এনসিটিবি নবম-দশম শ্রেণি
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ব্যবহারিক জ্যামিতি ও সম্পাদ্য
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              ব্যবহারিক জ্যামিতি: কম্পাস-স্কেল সিমুলেটর ও ৫-ধাপের মাস্টারক্লাস
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              ত্রিভুজ অঙ্কন (সমষ্টি, অন্তর ও পরিসীমা ল্যাব), চতুর্ভুজ অঙ্কনের ৫টি স্বতন্ত্র শর্ত, সমকোণী ত্রিভুজ, রম্বসের দুই কর্ণ ও ট্রাপিজিয়াম সিমুলেটর।
            </p>
          </div>

          {/* 5-Step Learning Framework Navigation */}
          <div className="flex items-center gap-1 bg-muted/60 p-1.5 rounded-2xl border border-border overflow-x-auto self-start md:self-auto">
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'learn'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ১. মূল ধারণা ও ল্যাব
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'examples'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ২. বোর্ড সৃজনশীল (CQ)
            </button>
            <button
              onClick={() => setActiveTab('try')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'try'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ৩. নিজে করো (চ্যালেঞ্জ)
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'quiz'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ৪. যাচাই করো (MCQ)
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'summary'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ৫. সারসংক্ষেপ
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* STEP 1: LEARN CONCEPT */}
        {activeTab === 'learn' && (
          <div className="space-y-8">
            {/* 5 Labs Horizontal Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {LAB_LESSONS.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setActiveLab(lab.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    activeLab === lab.id
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border bg-card/60 hover:bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {lab.badge}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{lab.nctbPage}</span>
                  </div>
                  <h3 className="text-xs font-bold text-foreground line-clamp-1">{lab.title}</h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-snug">
                    {lab.intro}
                  </p>
                </button>
              ))}
            </div>

            {/* Active Lab Header */}
            <div className="bg-gradient-to-r from-card via-card/90 to-card border border-border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {LAB_LESSONS[activeLab - 1].badge} — {LAB_LESSONS[activeLab - 1].nctbPage}
                </span>
                <h3 className="text-lg font-black text-foreground mt-0.5">
                  {LAB_LESSONS[activeLab - 1].title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                  {LAB_LESSONS[activeLab - 1].intro}
                </p>
              </div>
            </div>

            {/* Active Lab Interactive Canvas */}
            {activeLab === 1 && renderLab1()}
            {activeLab === 2 && renderLab2()}
            {activeLab === 3 && renderLab3()}
            {activeLab === 4 && renderLab4()}
            {activeLab === 5 && renderLab5()}
          </div>
        )}

        {/* STEP 2: SEE EXAMPLES (BOARD CQS) */}
        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="text-base font-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন ও উত্তর (CQ Masterclass)
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                এনসিটিবি ও শীর্ষ শিক্ষা বোর্ডের বিগত বছরের ব্যবহারিক জ্যামিতি সৃজনশীল প্রশ্ন, নম্বর বিভাজন ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক্স।
              </p>
            </div>

            <div className="space-y-4">
              {CQ_QUESTIONS.map((cq) => (
                <div
                  key={cq.id}
                  className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-all"
                >
                  {/* CQ Card Header */}
                  <div
                    onClick={() => setExpandedCQ(expandedCQ === cq.id ? null : cq.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                          সৃজনশীল ০{cq.id}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">{cq.boardSource}</span>
                      </div>
                      <p className="text-sm font-bold text-foreground mt-2 leading-relaxed">
                        {cq.stem}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedCQ === cq.id ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </div>

                  {/* CQ Body */}
                  {expandedCQ === cq.id && (
                    <div className="border-t border-border p-5 space-y-6 bg-muted/10">
                      {/* Part A */}
                      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className="text-xs font-bold text-primary">
                            ক. {cq.partA.question}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted">
                            [মান: {cq.partA.marks}]
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1.5">
                          {cq.partA.steps.map((st, i) => (
                            <p key={i} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">•</span>
                              <span>{st}</span>
                            </p>
                          ))}
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between">
                          <span>উত্তর: {cq.partA.answer}</span>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            {cq.partA.examinerTip}
                          </span>
                        </div>
                      </div>

                      {/* Part B */}
                      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className="text-xs font-bold text-primary">
                            খ. {cq.partB.question}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted">
                            [মান: {cq.partB.marks}]
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1.5">
                          {cq.partB.steps.map((st, i) => (
                            <p key={i} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">•</span>
                              <span>{st}</span>
                            </p>
                          ))}
                        </div>

                        {/* Rubric */}
                        <div className="p-3 bg-muted/40 rounded-lg space-y-2 border border-border">
                          <div className="text-[11px] font-bold text-foreground">নম্বর বণ্টন রুব্রিক্স:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {cq.partB.rubric.map((r, i) => (
                              <div key={i} className="flex justify-between p-1.5 rounded bg-card border border-border/80">
                                <span className="text-muted-foreground">{r.step}</span>
                                <span className="font-bold text-primary">{r.mark}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Examiner Secret Toggle */}
                        <div>
                          <button
                            onClick={() => toggleSecret(cq.id, 'b')}
                            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>
                              {openSecret[`${cq.id}-b`] ? 'পরীক্ষকের গোপন নোট লুকান' : 'পরীক্ষকের গোপন নম্বর সিক্রেট দেখুন'}
                            </span>
                          </button>
                          {openSecret[`${cq.id}-b`] && (
                            <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                              {cq.partB.examinerSecret}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Part C */}
                      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className="text-xs font-bold text-primary">
                            গ. {cq.partC.question}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted">
                            [মান: {cq.partC.marks}]
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1.5">
                          {cq.partC.steps.map((st, i) => (
                            <p key={i} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">•</span>
                              <span>{st}</span>
                            </p>
                          ))}
                        </div>

                        {/* Rubric */}
                        <div className="p-3 bg-muted/40 rounded-lg space-y-2 border border-border">
                          <div className="text-[11px] font-bold text-foreground">নম্বর বণ্টন রুব্রিক্স:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {cq.partC.rubric.map((r, i) => (
                              <div key={i} className="flex justify-between p-1.5 rounded bg-card border border-border/80">
                                <span className="text-muted-foreground">{r.step}</span>
                                <span className="font-bold text-primary">{r.mark}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Examiner Secret Toggle */}
                        <div>
                          <button
                            onClick={() => toggleSecret(cq.id, 'c')}
                            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>
                              {openSecret[`${cq.id}-c`] ? 'পরীক্ষকের গোপন নোট লুকান' : 'পরীক্ষকের গোপন নম্বর সিক্রেট দেখুন'}
                            </span>
                          </button>
                          {openSecret[`${cq.id}-c`] && (
                            <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                              {cq.partC.examinerSecret}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: TRY YOURSELF (INTERACTIVE CHALLENGES) */}
        {activeTab === 'try' && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="text-base font-black flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" />
                নিজে করো — ৩টি ইন্টারেক্টিভ জ্যামিতি চ্যালেঞ্জ
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                সম্পাদ্যের সূত্র ও ধর্ম ব্যবহার করে নিচের সমস্যাগুলো সমাধান করে তোমার দক্ষতা পরীক্ষা করো।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1 */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০১</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                      সমদ্বিবাহু ত্রিভুজ
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    সমদ্বিবাহু ত্রিভুজের বাহুর দৈর্ঘ্য
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    একটি ত্রিভুজের ভূমি <RenderMathText text="$a = 5\text{ cm}$" /> এবং অপর দুই বাহুর সমষ্টি <RenderMathText text="$s = 9\text{ cm}$" />। যদি ত্রিভুজটি সমদ্বিবাহু হয় (<RenderMathText text="$c = b$" />), তবে সমান বাহুদ্বয়ের প্রতিটির দৈর্ঘ্য কত cm?
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.5"
                      placeholder="মান লিখুন (যেমন: 4.5)"
                      value={ch1Input}
                      onChange={(e) => setCh1Input(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch1Input);
                        if (val === 4.5) {
                          setCh1Feedback('অভিনন্দন! সঠিক উত্তর: s / 2 = 9 / 2 = 4.5 cm।');
                        } else {
                          setCh1Feedback('ভুল হয়েছে। যেহেতু ত্রিভুজটি সমদ্বিবাহু, তাই b = c এবং b + c = 9 => 2b = 9 => b = 4.5 cm।');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all whitespace-nowrap"
                    >
                      যাচাই
                    </button>
                  </div>
                  {ch1Feedback && (
                    <div
                      className={`p-2.5 rounded-lg text-xs ${
                        ch1Feedback.includes('অভিনন্দন')
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {ch1Feedback}
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০২</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold">
                      রম্বসের বাহু
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    রম্বসের এক বাহুর দৈর্ঘ্য নির্ণয়
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    একটি রম্বসের দুটি কর্ণ যথাক্রমে <RenderMathText text="$6\text{ cm}$" /> ও <RenderMathText text="$8\text{ cm}$" />। এর এক বাহুর দৈর্ঘ্য (<RenderMathText text="$a$" />) কত cm? (পিথাগোরাস প্রয়োগ করো)
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="মান লিখুন (যেমন: 5)"
                      value={ch2Input}
                      onChange={(e) => setCh2Input(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch2Input);
                        if (val === 5) {
                          setCh2Feedback('অসাধারণ! সঠিক উত্তর: a = √(3² + 4²) = √25 = 5 cm।');
                        } else {
                          setCh2Feedback('আবার চেষ্টা করো। কর্ণের অর্ধেক 3 ও 4 cm। পিথাগোরাস: √(3² + 4²) = 5 cm।');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all whitespace-nowrap"
                    >
                      যাচাই
                    </button>
                  </div>
                  {ch2Feedback && (
                    <div
                      className={`p-2.5 rounded-lg text-xs ${
                        ch2Feedback.includes('অসাধারণ')
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {ch2Feedback}
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 3 */}
              <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase">চ্যালেঞ্জ ০৩</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-bold">
                      চতুর্ভুজ শর্ত
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    ট্রাপিজিয়াম অঙ্কনে আবশ্যক উপাত্ত
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    একটি ট্রাপিজিয়াম সুনির্দিষ্টভাবে অঙ্কন করার জন্য ন্যূনতম কয়টি স্বতন্ত্র উপাত্ত আবশ্যক?
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          setCh3Selected(n);
                          if (n === 4) {
                            setCh3Feedback('সঠিক! ট্রাপিজিয়ামে সমান্তরাল ২ বাহু ও ২ কোণ = ৪টি উপাত্ত লাগে।');
                          } else {
                            setCh3Feedback('ভুল। ট্রাপিজিয়ামের জন্য ৪টি স্বতন্ত্র উপাত্ত আবশ্যক।');
                          }
                        }}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                          ch3Selected === n
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted/50 border-border hover:bg-muted'
                        }`}
                      >
                        {toBn(n)}টি
                      </button>
                    ))}
                  </div>
                  {ch3Feedback && (
                    <div
                      className={`p-2.5 rounded-lg text-xs ${
                        ch3Feedback.includes('সঠিক')
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {ch3Feedback}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CHECK UNDERSTANDING (MCQ TEST) */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  যাচাই করো — ৫টি স্ট্যান্ডার্ড বোর্ড MCQ টেস্ট
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  প্রতিটি প্রশ্নের সঠিক উত্তর নির্বাচন করো এবং টেস্ট জমা দিয়ে বিস্তারিত ব্যাখ্যা দেখো।
                </p>
              </div>

              {quizSubmitted && (
                <div className="flex items-center gap-3 self-start md:self-auto">
                  <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    প্রাপ্ত স্কোর:{' '}
                    {
                      MCQ_ITEMS.filter((item) => userAnswers[item.id] === item.correctIndex)
                        .length
                    }{' '}
                    / {MCQ_ITEMS.length}
                  </div>
                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all"
                    title="পুনরায় চেষ্টা করুন"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {MCQ_ITEMS.map((item, qIdx) => {
                const selected = userAnswers[item.id];
                const isCorrect = selected === item.correctIndex;

                return (
                  <div key={item.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-foreground">
                        {qIdx + 1}. {item.question}
                      </h4>
                      {quizSubmitted && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCorrect
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {isCorrect ? 'সঠিক (+১)' : 'ভুল (০)'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {item.options.map((opt, optIdx) => {
                        let btnStyle = 'border-border bg-muted/40 hover:bg-muted/70';
                        if (selected === optIdx) {
                          btnStyle = 'border-primary bg-primary/15 text-primary font-bold';
                        }
                        if (quizSubmitted) {
                          if (optIdx === item.correctIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold';
                          } else if (selected === optIdx) {
                            btnStyle = 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setUserAnswers((prev) => ({ ...prev, [item.id]: optIdx }))}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === item.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                        <strong className="text-foreground">ব্যাখ্যা: </strong>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  কুইজ জমা দিন
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: SUMMARY & CHEAT SHEET */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    অধ্যায় সম্পন্ন: ১০০%
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">ব্যবহারিক জ্যামিতি চিটশিট</span>
                </div>
                <h3 className="text-lg font-black text-foreground mt-1">
                  ব্যবহারিক জ্যামিতির ৬টি মৌলিক সূত্র ও রিভিশন কার্ড
                </h3>
              </div>

              <button
                onClick={copyNotesToClipboard}
                className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                {notesCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{notesCopied ? 'নোটস কপি হয়েছে!' : 'পরীক্ষার নোটস কপি করুন'}</span>
              </button>
            </div>

            {/* Summary Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUMMARY_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {card.badge}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">০{card.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{card.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{card.ruleBn}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="p-2 rounded-lg bg-muted/50 text-center font-mono text-xs text-foreground">
                      <RenderMathText text={`$${card.formula}$`} />
                    </div>
                    <p className="text-[11px] text-muted-foreground italic">{card.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FLOATING SHERU AI TUTOR DRAWER */}
      {isSheruOpen && (
        <div className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md h-full bg-card border-l border-border shadow-2xl flex flex-col">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">শেরু এআই জ্যামিতি সহকারী</h3>
                  <p className="text-[11px] text-muted-foreground">সোক্রাটি পদ্ধতিতে গণিত শেখা</p>
                </div>
              </div>
              <button
                onClick={() => setIsSheruOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {sheruChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted/70 text-foreground border border-border rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-t border-border bg-muted/10 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">ঝটপট প্রশ্ন:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'সম্পাদ্য ১-এ কোণদ্বয় সমান আঁকার যুক্তি কী?',
                  'রম্বস আঁকতে ২টি উপাত্তই কেন যথেষ্ট?',
                  'পরিসীমা দেওয়া থাকলে অর্ধকোণ কেন আঁকা হয়?',
                  'পরীক্ষার খাতায় সম্পাদ্যে পূর্ণ ৪ নম্বর পাওয়ার গোপন কৌশল কী?',
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendSheru(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-card border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border bg-card flex gap-2">
              <input
                type="text"
                placeholder="ব্যবহারিক জ্যামিতি নিয়ে শেরুকে জিজ্ঞাসা করো..."
                value={sheruInput}
                onChange={(e) => setSheruInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSheru()}
                className="flex-1 px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => handleSendSheru()}
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
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
