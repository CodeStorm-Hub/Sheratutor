'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
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
  Square,
  Compass,
  Award,
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
    title: 'একই ভূমি ও সমান্তরাল যুগলে সামান্তরিক ল্যাব',
    subtitle: 'Parallelograms on Same Base & Parallel Lines (Theorem 35)',
    nctbPage: 'অনুশীলনী ১৫ • পৃষ্ঠা ২৯৫',
    badge: 'উপপাদ্য ৩৫',
    intro:
      'একই ভূমি এবং একই সমান্তরাল যুগলের মধ্যে অবস্থিত সকল সামান্তরিকের ক্ষেত্রফল সমান (ক্ষেত্রফল = ভূমি × উচ্চতা)। সামান্তরিকের তীর্যক হেলানো কোণ পরিবর্তিত হলেও ক্ষেত্রফল ধ্রুব থাকে!',
  },
  {
    id: 2,
    title: 'ত্রিভুজ ক্ষেত্রফল বনাম সামান্তরিকের অর্ধেক ল্যাব',
    subtitle: 'Triangles on Same Base & Half-Parallelogram Area (Theorem 36)',
    nctbPage: 'অনুশীলনী ১৫ • পৃষ্ঠা ২৯৭',
    badge: 'উপপাদ্য ৩৬',
    intro:
      'একই ভূমি ও সমান্তরাল যুগলে অবস্থিত ত্রিভুজের ক্ষেত্রফল সামান্তরিক ক্ষেত্রের ক্ষেত্রফলের অর্ধেক (Δ = ½ × ভূমি × উচ্চতা)। শীর্ষবিন্দুকে সমান্তরাল রেখা বরাবর সরালেও ক্ষেত্রফল অপরিবর্তিত থাকে!',
  },
  {
    id: 3,
    title: 'মধ্যমা দ্বারা ত্রিভুজ ক্ষেত্রফল সমদ্বিখণ্ডন ল্যাব',
    subtitle: 'Median Bisects Triangle Area Equally',
    nctbPage: 'অনুশীলনী ১৫ • পৃষ্ঠা ২৯৯',
    badge: 'অনুসিদ্ধান্ত',
    intro:
      'ত্রিভুজের যেকোনো মধ্যমা ত্রিভুজক্ষেত্রকে সমান ক্ষেত্রফলবিশিষ্ট দুটি ত্রিভুজে বিভক্ত করে। শীর্ষবিন্দু একই হওয়ায় উভয় ত্রিভুজের উচ্চতা সমান এবং ভূমির দৈর্ঘ্য সমান (BD = DC)।',
  },
  {
    id: 4,
    title: 'পিথাগোরাস উপপাদ্য ও গারফিল্ড ট্রাপিজিয়াম ব্যবচ্ছেদ ল্যাব',
    subtitle: "Pythagoras Theorem & Garfield's Trapezoid Dissection (Theorem 39)",
    nctbPage: 'অনুশীলনী ১৫ • পৃষ্ঠা ৩০৩',
    badge: 'উপপাদ্য ৩৯',
    intro:
      'সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফলের সমষ্টির সমান (c² = a² + b²)। জেমস এ. গারফিল্ডের ট্রাপিজিয়াম ব্যবচ্ছেদে এর দৃশ্যমান প্রমাণ দেখুন।',
  },
  {
    id: 5,
    title: 'ক্ষেত্রফল সংরক্ষণ সম্পাদ্য ল্যাব (ত্রিভুজ থেকে সামান্তরিক)',
    subtitle: 'Area-Conserving Construction: Triangle to Parallelogram (Construction 13)',
    nctbPage: 'অনুশীলনী ১৫ • পৃষ্ঠা ৩০৮',
    badge: 'সম্পাদ্য ১৩',
    intro:
      'একটি নির্দিষ্ট ত্রিভুজের সমান ক্ষেত্রফলবিশিষ্ট সামান্তরিক বা আয়তক্ষেত্র অঙ্কন করুন যার একটি কোণ নির্দিষ্ট কোণের সমান। ক্ষেত্রফল সংরক্ষিত রেখে জ্যামিতিক রূপান্তরের ধাপসমূহ প্রত্যক্ষ করুন।',
  },
];

interface CQPart {
  part: 'ক' | 'খ' | 'গ';
  marks: number;
  question: string;
  solution: string[];
  examinerSecret: string;
}

interface BoardCQ {
  id: number;
  boardYear: string;
  stimulus: string;
  parts: CQPart[];
}

const CHAPTER_CQS: BoardCQ[] = [
  {
    id: 1,
    boardYear: 'ঢাকা বোর্ড ২০২৪ / কুমিল্লা বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stimulus:
      'উদ্দীপক: ΔABC এর BC বাহুর সমান্তরাল সরলরেখা DE, যা AB ও AC বাহুকে যথাক্রমে D ও E বিন্দুতে ছেদ করে। AD হলো ΔABC এর একটি মধ্যমা।',
    parts: [
      {
        part: 'ক',
        marks: 2,
        question: 'একটি ত্রিভুজের ভূমি ১২ সেমি এবং উচ্চতা ৭ সেমি হলে এর ক্ষেত্রফল কত বর্গ সেমি?',
        solution: [
          'আমরা জানি, ত্রিভুজের ক্ষেত্রফল = ½ × ভূমি × উচ্চতা।',
          'দেওয়া আছে, ভূমি b = ১২ সেমি এবং উচ্চতা h = ৭ সেমি।',
          'অতএব, ক্ষেত্রফল = ½ × ১২ × ৭ = ৬ × ৭ = ৪২ বর্গ সেমি।',
        ],
        examinerSecret: 'ক্ষেত্রফলের সূত্র ও একক (বর্গ সেমি) যথাযথ লিখলে পূর্ণ ২/২ নম্বর নিশ্চিত।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, ত্রিভুজের যেকোনো মধ্যমা ত্রিভুজক্ষেত্রকে সমান ক্ষেত্রফলবিশিষ্ট দুটি ত্রিভুজে বিভক্ত করে।',
        solution: [
          'বিশেষ নির্বচন: মনে করি, ΔABC এর AD একটি মধ্যমা। প্রমাণ করতে হবে যে, ΔABD এর ক্ষেত্রফল = ΔACD এর ক্ষেত্রফল।',
          'অঙ্কন: A বিন্দু থেকে BC বাহুর ওপর AM লম্ব টানি।',
          'প্রমাণ:',
          'ধাপ ১: AM হলো ΔABD এবং ΔACD উভয় ত্রিভুজেরই সাধারণ লম্ব উচ্চতা (h)।',
          'ধাপ ২: ΔABD এর ক্ষেত্রফল = ½ × ভূমি BD × উচ্চতা AM।',
          'ধাপ ৩: ΔACD এর ক্ষেত্রফল = ½ × ভূমি CD × উচ্চতা AM।',
          'ধাপ ৪: যেহেতু AD মধ্যমা, সুতরাং BD = CD।',
          'অতএব, ½ × BD × AM = ½ × CD × AM।',
          'সুতরাং, ΔABD এর ক্ষেত্রফল = ΔACD এর ক্ষেত্রফল = ½ (ΔABC এর ক্ষেত্রফল)। (প্রমাণিত)',
        ],
        examinerSecret: 'উভয় ত্রিভুজের একই লম্ব উচ্চতা AM স্পষ্টভাবে উল্লেখ করলে ৪/৪ পাওয়া যায়।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'প্রমাণ কর যে, একই ভূমি ও সমান্তরাল যুগলের মধ্যে অবস্থিত সামান্তরিকের ক্ষেত্রফল ত্রিভুজের ক্ষেত্রফলের দ্বিগুণ।',
        solution: [
          'বিশেষ নির্বচন: মনে করি, সামান্তরিক ABCD এবং ত্রিভুজ EBC একই ভূমি BC এবং একই সমান্তরাল যুগল BC ও AD এর মধ্যে অবস্থিত। প্রমাণ করতে হবে যে, সামান্তরিক ABCD এর ক্ষেত্রফল = ২ × (ΔEBC এর ক্ষেত্রফল)।',
          'অঙ্কন: AC কর্ণ যোগ করি।',
          'প্রমাণ:',
          'ধাপ ১: সামান্তরিক ABCD এর AC কর্ণ সামান্তরিকটিকে দুটি সর্বসম ত্রিভুজ ΔABC ও ΔADC তে বিভক্ত করে।',
          'অতএব, সামান্তরিক ABCD এর ক্ষেত্রফল = ২ × (ΔABC এর ক্ষেত্রফল)।',
          'ধাপ ২: কিন্তু ΔABC এবং ΔEBC উভয়ই একই ভূমি BC এবং একই সমান্তরাল যুগল BC ও AD এর মধ্যে অবস্থিত।',
          'উপপাদ্য ৩৬ অনুসারে, একই ভূমি ও সমান্তরাল যুগলের ত্রিভুজদ্বয়ের ক্ষেত্রফল সমান, অর্থাৎ ΔABC এর ক্ষেত্রফল = ΔEBC এর ক্ষেত্রফল।',
          'ধাপ ৩: সুতরাং, সামান্তরিক ABCD এর ক্ষেত্রফল = ২ × (ΔEBC এর ক্ষেত্রফল)। (প্রমাণিত)',
        ],
        examinerSecret: 'কর্ণ দ্বারা সামান্তরিককে দুটি সর্বসম ত্রিভুজে ভাগ করার ধাপটি নির্ভুল রাখা জরুরি।',
      },
    ],
  },
  {
    id: 2,
    boardYear: 'রাজশাহী বোর্ড ২০২৪ / চট্টগ্রাম বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stimulus:
      'উদ্দীপক: একটি সমকোণী ত্রিভুজ ΔABC এর সমকোণ সংলগ্ন বাহুদ্বয় a ও b এবং অতিভুজ c। সমকোণী ত্রিভুজটির সাহায্য নিয়ে একটি ট্রাপিজিয়াম গঠন করা হলো।',
    parts: [
      {
        part: 'ক',
        marks: 2,
        question: 'একটি সমকোণী ত্রিভুজের বাহুদ্বয় ৩ সেমি ও ৪ সেমি হলে এর অতিভুজের দৈর্ঘ্য কত?',
        solution: [
          'পিথাগোরাসের উপপাদ্য অনুসারে, c² = a² + b²',
          'বা, c² = ৩² + ৪² = ৯ + ১৬ = ২৫',
          'বা, c = √২৫ = ৫ সেমি।',
          'অতএব, অতিভুজের দৈর্ঘ্য ৫ সেমি।',
        ],
        examinerSecret: 'অতিভুজের একক ও ধনাত্মক বর্গমূল ৫ সেমি লিখলে ২/২ নিশ্চিত।',
      },
      {
        part: 'খ',
        marks: 4,
        question: "বীজগাণিতিক ও ট্রাপিজিয়াম ব্যবচ্ছেদ পদ্ধতিতে পিথাগোরাসের উপপাদ্যটি (c² = a² + b²) প্রমাণ কর।",
        solution: [
          'বিশেষ নির্বচন: সমকোণী ত্রিভুজের সূক্ষ্মকোণ সংলগ্ন বাহুদ্বয় a, b এবং অতিভুজ c। প্রমাণ করতে হবে যে, c² = a² + b²।',
          'অঙ্কন: তিনটি সমকোণী ত্রিভুজকে এমনভাবে পাশাপাশি স্থাপন করি যাতে তাদের সমন্বয়ে একটি সমকোণী ট্রাপিজিয়াম গঠিত হয় যার সমান্তরাল বাহুদ্বয় a ও b এবং উচ্চতা (a + b)।',
          'ট্রাপিজিয়ামের অভ্যন্তরে একটি সমদ্বিবাহু সমকোণী ত্রিভুজ গঠিত হয় যার বাহুদ্বয় c এবং অন্তর্ভুক্ত কোণ ৯০°।',
          'প্রমাণ:',
          'ধাপ ১: ট্রাপিজিয়ামের ক্ষেত্রফল = ½ × (সমান্তরাল বাহুদ্বয়ের যোগফল) × উচ্চতা = ½ (a + b)(a + b) = ½ (a + b)²।',
          'ধাপ ২: ট্রাপিজিয়ামের ক্ষেত্রফল ৩টি ত্রিভুজের সমষ্টির সমান:',
          '= ২ × (½ a·b) + ½ c·c = ab + ½ c²।',
          'ধাপ ৩: ক্ষেত্রফল সমতাকরণ:',
          '½ (a + b)² = ab + ½ c²',
          'বা, ½ (a² + 2ab + b²) = ab + ½ c²',
          'উভয়পক্ষকে ২ দ্বারা গুণ করে:',
          'a² + 2ab + b² = 2ab + c²',
          'উভয়পক্ষ থেকে 2ab বিয়োগ করে পাই:',
          'c² = a² + b²। (প্রমাণিত)',
        ],
        examinerSecret:
          'গারফিল্ডের ট্রাপিজিয়াম ক্ষেত্রফল সমীকরণ ½(a+b)² = ab + ½c² লিখলে পূর্ণ নম্বর নিশ্চিত।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'প্রমাণ কর যে, কোনো ত্রিভুজের একটি বাহুর ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের সমষ্টির সমান হলে শেষোক্ত বাহুদ্বয়ের অন্তর্ভুক্ত কোণটি সমকোণ হবে (পিথাগোরাসের বিপরীত উপপাদ্য)।',
        solution: [
          'বিশেষ নির্বচন: মনে করি ΔABC এ AC² = AB² + BC²। প্রমাণ করতে হবে যে, ∠B = ১ সমকোণ।',
          'অঙ্কন: এমন একটি ত্রিভুজ ΔDEF আঁকি যেন ∠E = ৯০°, DE = AB এবং EF = BC হয়।',
          'প্রমাণ:',
          'ধাপ ১: যেহেতু ΔDEF একটি সমকোণী ত্রিভুজ এবং ∠E = ৯০°, পিথাগোরাসের উপপাদ্য অনুসারে:',
          'DF² = DE² + EF² = AB² + BC² (অঙ্কনানুসারে)।',
          'ধাপ ২: কিন্তু উদ্দীপকে দেওয়া আছে AC² = AB² + BC²।',
          'অতএব, DF² = AC² বা DF = AC।',
          'ধাপ ৩: এখন ΔABC এবং ΔDEF এ:',
          'AB = DE, BC = EF এবং AC = DF।',
          'সুতরাং বাহু-বাহু-বাহু (SSS) উপপাদ্য অনুসারে ΔABC ≅ ΔDEF।',
          'অতএব, ∠B = ∠E। কিন্তু অঙ্কনানুসারে ∠E = ১ সমকোণ।',
          'সুতরাং ∠B = ১ সমকোণ। (প্রমাণিত)',
        ],
        examinerSecret: 'ΔDEF অঙ্কন করে সর্বসমতা প্রমাণের মাধ্যমে কোণটির সমকোণতা দেখানো আবশ্যক।',
      },
    ],
  },
  {
    id: 3,
    boardYear: 'দিনাজপুর বোর্ড ২০২৩ / যশোর বোর্ড ২০২৩ • সৃজনশীল প্রশ্ন',
    stimulus:
      'উদ্দীপক: একটি ত্রিভুজ ΔABC এর ভূমি BC = ৬ সেমি, উচ্চতা h = ৪ সেমি এবং একটি নির্দিষ্ট কোণ ∠x = ৬০°।',
    parts: [
      {
        part: 'ক',
        marks: 2,
        question: 'উদ্দীপকের ত্রিভুজটির ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, ত্রিভুজের ভূমি b = ৬ সেমি এবং উচ্চতা h = ৪ সেমি।',
          'আমরা জানি, ত্রিভুজের ক্ষেত্রফল = ½ × ভূমি × উচ্চতা = ½ × ৬ × ৪ = ১২ বর্গ সেমি।',
        ],
        examinerSecret: 'সহজ গণনা, ১২ বর্গ সেমি লিখলে ২/২ নম্বর।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'উদ্দীপকের ত্রিভুজ ΔABC এর সমান ক্ষেত্রফলবিশিষ্ট একটি সামান্তরিক আঁক যার একটি কোণ ∠x এর সমান (সম্পাদ্য ১৩)।',
        solution: [
          'অঙ্কনের বিবরণ:',
          'ধাপ ১: ত্রিভুজ ABC এর BC বাহুকে D বিন্দুতে সমদ্বিখণ্ডিত করি।',
          'ধাপ ২: A বিন্দু দিয়ে BC বাহুর সমান্তরাল রেখা AM আঁকি।',
          'ধাপ ৩: D বিন্দুতে ∠CDE = ∠x = ৬০° কোণ আঁকি যেন DE রেখাটি AM সমান্তরাল রেখাকে E বিন্দুতে ছেদ করে।',
          'ধাপ ৪: C বিন্দুতে DE এর সমান্তরাল রেখা CF আঁকি যা AM কে F বিন্দুতে ছেদ করে।',
          'ধাপ ৫: CDEF-ই উদ্দিষ্ট সামান্তরিক যার ক্ষেত্রফল = ΔABC এর ক্ষেত্রফল এবং একটি কোণ ∠CDE = ৬০°।',
          'প্রমাণ: সামান্তরিক CDEF এর ভূমি CD = ½ BC এবং উচ্চতা ত্রিভুজ ABC এর উচ্চতার সমান। অতএব ক্ষেত্রফল = CD × h = ½ BC × h = ΔABC এর ক্ষেত্রফল।',
        ],
        examinerSecret: 'ভূমি সমদ্বিখণ্ডন ও সমান্তরাল রেখা অঙ্কনের চিহ্ন স্পষ্টভাবে থাকতে হবে।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'দেখাও যে, কোনো সামান্তরিকের কর্ণদ্বয় পরস্পরকে সমদ্বিখণ্ডিত করলে উৎপন্ন চারটি ত্রিভুজের ক্ষেত্রফল সমান হয়।',
        solution: [
          'মনে করি ABCD একটি সামান্তরিক যার AC ও BD কর্ণদ্বয় পরস্পরকে O বিন্দুতে ছেদ করেছে।',
          'প্রমাণ:',
          'ধাপ ১: আমরা জানি সামান্তরিকের কর্ণদ্বয় পরস্পরকে সমদ্বিখণ্ডিত করে। সুতরাং OA = OC এবং OB = OD।',
          'ধাপ ২: ΔABC এ BO হলো AC বাহুর মধ্যমা। মধ্যমা ত্রিভুজকে সমান ক্ষেত্রফলে ভাগ করে:',
          'অতএব, Area(ΔAOB) = Area(ΔBOC)।',
          'ধাপ ৩: আবার ΔBCD এ CO হলো BD বাহুর মধ্যমা:',
          'অতএব, Area(ΔBOC) = Area(ΔCOD)।',
          'ধাপ ৪: অনুরূপভাবে ΔACD এ DO হলো AC বাহুর মধ্যমা:',
          'অতএব, Area(ΔCOD) = Area(ΔAOD)।',
          'সুতরাং, Area(ΔAOB) = Area(ΔBOC) = Area(ΔCOD) = Area(ΔAOD) = ¼ (সামান্তরিক ABCD এর ক্ষেত্রফল)। (প্রমাণিত)',
        ],
        examinerSecret: 'মধ্যমা ধর্ম ব্যবহার করে ধারাবাহিকভাবে চারটি ত্রিভুজের ক্ষেত্রফল সমান দেখানো শ্রেষ্ঠ পদ্ধতি।',
      },
    ],
  },
];

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const CHAPTER_MCQS: MCQ[] = [
  {
    id: 1,
    question: 'একই ভূমি ও সমান্তরাল যুগলে অবস্থিত ত্রিভুজের ক্ষেত্রফল সামান্তরিক ক্ষেত্রের ক্ষেত্রফলের কত অংশ?',
    options: ['A. দ্বিগুণ', 'B. সমান', 'C. অর্ধেক', 'D. এক-তৃতীয়াংশ'],
    correctAnswerIndex: 2,
    explanation:
      'উপপাদ্য ৩৬ অনুসারে, একই ভূমি ও সমান্তরাল যুগলে অবস্থিত ত্রিভুজের ক্ষেত্রফল সামান্তরিক ক্ষেত্রের ক্ষেত্রফলের অর্ধেক (Δ = ½ × সামান্তরিক)।',
  },
  {
    id: 2,
    question: 'একটি সমকোণী ত্রিভুজের সমকোণ সংলগ্ন বাহুদ্বয় ৫ সেমি ও ১২ সেমি হলে অতিভুজের দৈর্ঘ্য কত?',
    options: ['A. ১৩ সেমি', 'B. ১৪ সেমি', 'C. ১৫ সেমি', 'D. ১৭ সেমি'],
    correctAnswerIndex: 0,
    explanation:
      'পিথাগোরাসের উপপাদ্য অনুসারে, c = √(a² + b²) = √(৫² + ১২²) = √(২৫ + ১৪৪) = √১৬৯ = ১৩ সেমি।',
  },
  {
    id: 3,
    question: 'একটি ত্রিভুজের ক্ষেত্রফল ৩৬ বর্গ সেমি এবং ভূমি ১২ সেমি হলে উচ্চতা কত?',
    options: ['A. ৩ সেমি', 'B. ৬ সেমি', 'C. ৯ সেমি', 'D. ১২ সেমি'],
    correctAnswerIndex: 1,
    explanation:
      'ত্রিভুজের ক্ষেত্রফল = ½ × b × h ⟹ ৩৬ = ½ × ১২ × h ⟹ ৩৬ = ৬h ⟹ h = ৬ সেমি।',
  },
  {
    id: 4,
    question: 'ত্রিভুজের যেকোনো মধ্যমা ত্রিভুজক্ষেত্রকে কী করে?',
    options: ['A. সমান ক্ষেত্রফলে সমদ্বিখণ্ডিত করে', 'B. অসমান অংশে বিভক্ত করে', 'C. পরিসীমা দ্বিগুণ করে', 'D. সমকোণে ভাগ করে'],
    correctAnswerIndex: 0,
    explanation:
      'শীর্ষবিন্দু একই হওয়ায় উভয় ত্রিভুজের উচ্চতা অভিন্ন এবং মধ্যমা ভূমিকে সমান দুই ভাগে ভাগ করে, ফলে উভয় ত্রিভুজের ক্ষেত্রফল সমান হয়।',
  },
  {
    id: 5,
    question: 'পিথাগোরাসের উপপাদ্যের মূল সমীকরণ নিচের কোনটি?',
    options: ['A. a² - b² = c²', 'B. a² + b² = c²', 'C. a + b = c', 'D. a × b = c²'],
    correctAnswerIndex: 1,
    explanation:
      'উপপাদ্য ৩৯ অনুসারে, সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফলের সমষ্টির সমান (c² = a² + b²)।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathAreaTheoremsGuidebook() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLabId, setActiveLabId] = useState<number>(1);

  // Lab 1: Parallelograms on same base & parallel lines
  const [lab1Base, setLab1Base] = useState<number>(8);
  const [lab1Height, setLab1Height] = useState<number>(5);
  const [lab1Tilt, setLab1Tilt] = useState<number>(30); // tilt angle in degrees

  // Lab 2: Triangle vs Parallelogram
  const [lab2Base, setLab2Base] = useState<number>(8);
  const [lab2Height, setLab2Height] = useState<number>(6);
  const [lab2VertexX, setLab2VertexX] = useState<number>(4); // drag apex along parallel line

  // Lab 3: Median Area Bisection
  const [lab3ApexX, setLab3ApexX] = useState<number>(4);
  const [lab3Base, setLab3Base] = useState<number>(8);
  const [lab3Height, setLab3Height] = useState<number>(6);

  // Lab 4: Pythagoras & Garfield's Trapezoid
  const [lab4A, setLab4A] = useState<number>(6);
  const [lab4B, setLab4B] = useState<number>(8);

  // Lab 5: Construction 13 (Triangle to Parallelogram)
  const [lab5Step, setLab5Step] = useState<number>(3); // 1 to 4 steps
  const [lab5Angle, setLab5Angle] = useState<number>(60);

  // Step 2: CQ State
  const [selectedCQId, setSelectedCQId] = useState<number>(1);

  // Step 3: Interactive Challenges State
  const [challenge1Input, setChallenge1Input] = useState<string>('');
  const [challenge1Status, setChallenge1Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge2Input, setChallenge2Input] = useState<string>('');
  const [challenge2Status, setChallenge2Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge3Input, setChallenge3Input] = useState<string>('');
  const [challenge3Status, setChallenge3Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Step 4: MCQ State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showMCQResults, setShowMCQResults] = useState<boolean>(false);

  // Step 5: Summary & Copy
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  // Sheru AI Tutor Drawer
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'স্বাগতম! আমি শেরু — ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য (অধ্যায় ১৫) টিউটর। সামান্তরিক বা ত্রিভুজের ক্ষেত্রফল সমতা, পিথাগোরাসের গারফিল্ড ট্রাপিজিয়াম প্রমাণ কিংবা সম্পাদ্য ১৩ নিয়ে যেকোনো প্রশ্ন করো!',
    },
  ]);
  const [aiUserInput, setAiUserInput] = useState<string>('');

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleCheckChallenge1 = () => {
    // Triangle base=12, height=8 => Area = 0.5 * 12 * 8 = 48
    if (challenge1Input.trim() === '48') {
      setChallenge1Status('correct');
    } else {
      setChallenge1Status('wrong');
    }
  };

  const handleCheckChallenge2 = () => {
    // Right triangle a=9, b=12 => c = sqrt(81+144) = 15
    if (challenge2Input.trim() === '15') {
      setChallenge2Status('correct');
    } else {
      setChallenge2Status('wrong');
    }
  };

  const handleCheckChallenge3 = () => {
    // Right triangle a=6, c=10 => b = sqrt(100-36) = 8
    if (challenge3Input.trim() === '8') {
      setChallenge3Status('correct');
    } else {
      setChallenge3Status('wrong');
    }
  };

  const handleSelectMCQ = (questionId: number, optionIndex: number) => {
    if (showMCQResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
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

  const handleSendAiMessage = () => {
    if (!aiUserInput.trim()) return;
    const newMsg = { sender: 'user' as const, text: aiUserInput };
    setAiChatMessages((prev) => [...prev, newMsg]);
    setAiUserInput('');

    setTimeout(() => {
      let reply = 'দারুণ প্রশ্ন! উপপাদ্য ৩৫ অনুযায়ী একই ভূমি ও সমান্তরাল যুগলে অবস্থিত সকল সামান্তরিকের ক্ষেত্রফল সমান (b × h)।';
      const lower = newMsg.text.toLowerCase();
      if (lower.includes('পিথাগোরাস') || lower.includes('গারফিল্ড') || lower.includes('c^2')) {
        reply = 'গারফিল্ডের ট্রাপিজিয়াম প্রমাণে ট্রাপিজিয়ামের মোট ক্ষেত্রফল ½(a+b)² সমান ৩টি সমকোণী ত্রিভুজের ক্ষেত্রফল (2 × ½ab + ½c²)। উভয়পাশে 2 গুণ করে 2ab বাদ দিলে সরাসরি c² = a² + b² পাওয়া যায়!';
      } else if (lower.includes('মধ্যমা') || lower.includes('সমদ্বিখণ্ড')) {
        reply = 'ত্রিভুজের মধ্যমা ভূমিকে সমান দুই ভাগে ভাগ করে (BD = CD)। যেহেতু উভয় ত্রিভুজের শীর্ষবিন্দু A একই, তাদের উচ্চতাও সমান। ফলে Area(ΔABD) = ½ · BD · h = ½ · CD · h = Area(ΔACD)!';
      } else if (lower.includes('সম্পাদ্য') || lower.includes('১৩')) {
        reply = 'সম্পাদ্য ১৩ এর গোপন কৌশল হলো: ত্রিভুজের ভূমিকে অর্ধেক করে সামান্তরিকের ভূমি নেওয়া (b/2)। উচ্চতা একই রাখায় সামান্তরিকের ক্ষেত্রফল (b/2) × h = ½ b h = ত্রিভুজের ক্ষেত্রফল হয়ে যায়!';
      }
      setAiChatMessages((prev) => [...prev, { sender: 'ai' as const, text: reply }]);
    }, 600);
  };

  const handleCopyCheatSheet = () => {
    const text = `এনসিটিবি সাধারণ গণিত • অধ্যায় ১৫: ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য
১. উপপাদ্য ৩৫: একই ভূমি ও সমান্তরাল যুগলের সামান্তরিকসমূহের ক্ষেত্রফল সমান (ক্ষেত্রফল = ভূমি × উচ্চতা)।
২. উপপাদ্য ৩৬: একই ভূমি ও সমান্তরাল যুগলে অবস্থিত ত্রিভুজ ক্ষেত্রের ক্ষেত্রফল সামান্তরিকের ক্ষেত্রফলের অর্ধেক (Δ = ½ × সামান্তরিক)।
৩. শীর্ষবিন্দু সরণ নীতি: সমান্তরাল রেখা বরাবর ত্রিভুজের শীর্ষবিন্দু সরালে ভূমির দৈর্ঘ্য ও উচ্চতা স্থির থাকায় ক্ষেত্রফল ধ্রুব থাকে।
৪. মধ্যমা উপপাদ্য: ত্রিভুজের যেকোনো মধ্যমা ত্রিভুজক্ষেত্রকে সমান ক্ষেত্রফলবিশিষ্ট দুটি ত্রিভুজে বিভক্ত করে।
৫. পিথাগোরাসের উপপাদ্য (উপপাদ্য ৩৯): সমকোণী ত্রিভুজে c² = a² + b²।
৬. গারফিল্ডের ট্রাপিজিয়াম ক্ষেত্রফল সমতা: ½(a + b)² = ab + ½c² ⟹ c² = a² + b²।
৭. সম্পাদ্য ১৩: ত্রিভুজের ক্ষেত্রফলের সমান সামান্তরিক আঁকতে ভূমির অর্ধেক (b/2) নিয়ে একই উচ্চতায় সামান্তরিক আঁকা হয়।`;

    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2500);
  };

  const currentLab = LAB_LESSONS.find((l) => l.id === activeLabId) || LAB_LESSONS[0];
  const currentCQ = CHAPTER_CQS.find((c) => c.id === selectedCQId) || CHAPTER_CQS[0];

  // Calculations for Lab 4 Pythagoras
  const lab4C = Math.sqrt(lab4A * lab4A + lab4B * lab4B);
  const lab4TrapArea = 0.5 * (lab4A + lab4B) * (lab4A + lab4B);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Subject Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/playground/v2"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="লাইব্রেরি ভিউতে ফিরে যান"
            >
              <RotateCcw className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                ১৫
              </span>
              <span>সাধারণ গণিত • অধ্যায় ১৫</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="hidden sm:inline">NCTB নবম-দশম</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য
            </h1>
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
        {/* STEP 1: CONCEPT LABS */}
        {/* ================================================================== */}
        {activeStep === 1 && (
          <div className="space-y-6">
            {/* Lab Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {LAB_LESSONS.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setActiveLabId(lab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
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

            {/* Lab Intro Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {currentLab.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{currentLab.nctbPage}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{currentLab.subtitle}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {currentLab.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentLab.intro}
              </p>
            </div>

            {/* ---------------- LAB 1: PARALLELOGRAMS ON SAME BASE (THEOREM 35) ---------------- */}
            {activeLabId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Controls */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Sliders className="w-4 h-4 text-primary" />
                      সামান্তরিক প্যারামিটার (ভূমি ও সমান্তরাল যুগল)
                    </h3>
                  </div>

                  {/* Presets */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setLab1Base(8);
                        setLab1Height(5);
                        setLab1Tilt(30);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-center hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      আদর্শ রূপ
                    </button>
                    <button
                      onClick={() => {
                        setLab1Base(6);
                        setLab1Height(6);
                        setLab1Tilt(45);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-center hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      অধিক হেলানো
                    </button>
                    <button
                      onClick={() => {
                        setLab1Base(10);
                        setLab1Height(4);
                        setLab1Tilt(15);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-center hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      লম্বা ভূমি
                    </button>
                  </div>

                  {/* Slider Base */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">ভূমি (Base b):</span>
                      <span className="font-bold text-primary">{lab1Base} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      value={lab1Base}
                      onChange={(e) => setLab1Base(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider Height */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">লম্ব উচ্চতা (Height h):</span>
                      <span className="font-bold text-primary">{lab1Height} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="7"
                      value={lab1Height}
                      onChange={(e) => setLab1Height(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider Tilt Angle */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">তীর্যক সরণ (Shift/Tilt):</span>
                      <span className="font-bold text-primary">{lab1Tilt}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={lab1Tilt}
                      onChange={(e) => setLab1Tilt(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Area Metric Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">উপপাদ্য ৩৫ ক্ষেত্রফল হিসাব:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      আয়তক্ষেত্র ABCD ক্ষেত্রফল = {lab1Base} × {lab1Height} = {lab1Base * lab1Height} বর্গ সেমি
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      হেলানো সামান্তরিক EBCF ক্ষেত্রফল = {lab1Base} × {lab1Height} = {lab1Base * lab1Height} বর্গ সেমি
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      উপসংহার: হেলানো কোণ {lab1Tilt}° হলেও উভয় সামান্তরিকের ক্ষেত্রফল হুবহু সমান!
                    </div>
                  </div>
                </div>

                {/* SVG Visual Canvas */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      একই ভূমি BC ও সমান্তরাল যুগলে সামান্তরিক সমতা
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      ক্ষেত্রফল সাম্য: {lab1Base * lab1Height} = {lab1Base * lab1Height}
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <svg viewBox="0 0 420 220" className="w-full h-full">
                      {/* Parallel Guide Lines */}
                      <line x1="20" y1="40" x2="400" y2="40" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="20" y1="180" x2="400" y2="180" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                      <text x="390" y="35" fill="#94a3b8" fontSize="10" fontFamily="monospace">L₁</text>
                      <text x="390" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">L₂</text>

                      {/* Common Base BC */}
                      {(() => {
                        const bx = 100;
                        const bw = lab1Base * 22;
                        const h = lab1Height * 22;
                        const tiltOffset = (lab1Tilt / 50) * 80;

                        return (
                          <>
                            {/* Parallelogram 1 (Rectangular / Upright): ABCD */}
                            <polygon
                              points={`${bx},180 ${bx + bw},180 ${bx + bw},${180 - h} ${bx},${180 - h}`}
                              fill="rgba(59, 130, 246, 0.15)"
                              stroke="#60a5fa"
                              strokeWidth="2"
                            />

                            {/* Parallelogram 2 (Sheared/Tilted): EBCF */}
                            <polygon
                              points={`${bx},180 ${bx + bw},180 ${bx + bw + tiltOffset},${180 - h} ${bx + tiltOffset},${180 - h}`}
                              fill="rgba(16, 185, 129, 0.2)"
                              stroke="#34d399"
                              strokeWidth="2.5"
                              strokeDasharray="4 2"
                            />

                            {/* Base BC Line */}
                            <line x1={bx} y1="180" x2={bx + bw} y2="180" stroke="#f43f5e" strokeWidth="3" />

                            {/* Height indicator line */}
                            <line
                              x1={bx - 20}
                              y1="180"
                              x2={bx - 20}
                              y2={180 - h}
                              stroke="#fbbf24"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                            />
                            <text
                              x={bx - 35}
                              y={180 - h / 2}
                              fill="#fbbf24"
                              fontSize="11"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              h={lab1Height}
                            </text>

                            {/* Vertex Labels */}
                            <text x={bx} y="200" fill="#fff" fontSize="12" fontWeight="bold">B</text>
                            <text x={bx + bw} y="200" fill="#fff" fontSize="12" fontWeight="bold">C</text>
                            <text x={bx} y={170 - h} fill="#60a5fa" fontSize="11" fontWeight="bold">A</text>
                            <text x={bx + bw} y={170 - h} fill="#60a5fa" fontSize="11" fontWeight="bold">D</text>
                            <text x={bx + tiltOffset} y={170 - h} fill="#34d399" fontSize="11" fontWeight="bold">E</text>
                            <text x={bx + bw + tiltOffset} y={170 - h} fill="#34d399" fontSize="11" fontWeight="bold">F</text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">উপপাদ্য ৩৫ এর সারমর্ম:</span> সামান্তরিককে যত বেশিই ডান বা বামে হেলানো হোক না কেন, তাদের সাধারণ ভূমি BC এবং সমান্তরাল রেখাদ্বয়ের লম্ব দূরত্ব h অপরিবর্তিত থাকলে ক্ষেত্রফল সর্বদা সমান থাকবে (Area = b × h)!
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 2: TRIANGLE VS PARALLELOGRAM (THEOREM 36) ---------------- */}
            {activeLabId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Triangle className="w-4 h-4 text-primary" />
                      শীর্ষবিন্দু সরণ ও ত্রিভুজ ক্ষেত্রফল (উপপাদ্য ৩৬)
                    </h3>
                  </div>

                  {/* Slider Apex X Position */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">শীর্ষবিন্দু A এর অনুভূমিক অবস্থান:</span>
                      <span className="font-bold text-primary">{lab2VertexX} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      step="0.5"
                      value={lab2VertexX}
                      onChange={(e) => setLab2VertexX(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider Base */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">ভূমি (BC):</span>
                      <span className="font-bold text-primary">{lab2Base} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="10"
                      value={lab2Base}
                      onChange={(e) => setLab2Base(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider Height */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">লম্ব উচ্চতা (h):</span>
                      <span className="font-bold text-primary">{lab2Height} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="7"
                      value={lab2Height}
                      onChange={(e) => setLab2Height(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Comparison Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">উপপাদ্য ৩৬ ক্ষেত্রফল সম্পর্ক:</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      সামান্তরিক ক্ষেত্রফল = {lab2Base} × {lab2Height} = {lab2Base * lab2Height} বর্গ সেমি
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold">
                      ত্রিভুজ ΔABC ক্ষেত্রফল = ½ × {lab2Base} × {lab2Height} = {0.5 * lab2Base * lab2Height} বর্গ সেমি
                    </div>
                    <div className="text-purple-600 dark:text-purple-400">
                      অনুপাত: ΔABC / সামান্তরিক = {0.5 * lab2Base * lab2Height} / {lab2Base * lab2Height} = ১/২ (অর্ধেক)
                    </div>
                  </div>
                </div>

                {/* Visualizer Canvas */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      সমান্তরাল রেখায় শীর্ষবিন্দু সরণ ও স্থির ক্ষেত্রফল
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                      ত্রিভুজ ক্ষেত্রফল = {0.5 * lab2Base * lab2Height} বর্গ সেমি (স্থির!)
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <svg viewBox="0 0 420 220" className="w-full h-full">
                      {/* Parallel Rails */}
                      <line x1="20" y1="40" x2="400" y2="40" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="20" y1="180" x2="400" y2="180" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />

                      {(() => {
                        const bx = 110;
                        const bw = lab2Base * 22;
                        const h = lab2Height * 20;
                        const apexX = bx + lab2VertexX * 22;

                        return (
                          <>
                            {/* Parallelogram background outline */}
                            <polygon
                              points={`${bx},180 ${bx + bw},180 ${bx + bw + 40},${180 - h} ${bx + 40},${180 - h}`}
                              fill="rgba(148, 163, 184, 0.08)"
                              stroke="#64748b"
                              strokeWidth="1.5"
                            />

                            {/* Triangle ABC with moving Apex A */}
                            <polygon
                              points={`${bx},180 ${bx + bw},180 ${apexX},${180 - h}`}
                              fill="rgba(59, 130, 246, 0.25)"
                              stroke="#60a5fa"
                              strokeWidth="2.5"
                            />

                            {/* Apex Pin Dot */}
                            <circle cx={apexX} cy={180 - h} r="6" fill="#f43f5e" />
                            <text x={apexX} y={165 - h} fill="#f43f5e" fontSize="13" fontWeight="bold" textAnchor="middle">
                              A
                            </text>

                            {/* Base points */}
                            <text x={bx} y="200" fill="#fff" fontSize="12" fontWeight="bold">B</text>
                            <text x={bx + bw} y="200" fill="#fff" fontSize="12" fontWeight="bold">C</text>

                            {/* Altitude h line */}
                            <line x1={apexX} y1={180 - h} x2={apexX} y2="180" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                            <circle cx={apexX} cy="180" r="3" fill="#fbbf24" />
                            <text x={apexX + 8} y={180 - h / 2} fill="#fbbf24" fontSize="10" fontFamily="monospace">
                              h = {lab2Height}
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">গুরুত্বপূর্ণ উপলব্ধি:</span> শীর্ষবিন্দু A কে সমান্তরাল রেললাইন বরাবর ডানে বা বামে যেখানেই নেওয়া হোক, ভূমি BC এবং লম্ব দূরত্ব h সবসময় একই থাকে! ফলে ত্রিভুজের আকার পরিবর্তিত হলেও ক্ষেত্রফল সর্বদা {0.5 * lab2Base * lab2Height} বর্গ সেমি থাকে।
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 3: MEDIAN BISECTION ---------------- */}
            {activeLabId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <GitBranch className="w-4 h-4 text-primary" />
                      মধ্যমা ও ক্ষেত্রফল সমদ্বিখণ্ডন প্যারামিটার
                    </h3>
                  </div>

                  {/* Slider Apex Position */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">শীর্ষবিন্দু A এর অবস্থান:</span>
                      <span className="font-bold text-primary">{lab3ApexX} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      step="0.5"
                      value={lab3ApexX}
                      onChange={(e) => setLab3ApexX(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider Base */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">ভূমি BC:</span>
                      <span className="font-bold text-primary">{lab3Base} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="10"
                      value={lab3Base}
                      onChange={(e) => setLab3Base(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Math Breakdown */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">মধ্যমা AD এর ক্ষেত্রফল বিশ্লেষণ:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      ΔABD ক্ষেত্রফল = ½ × BD × h = ½ × {lab3Base / 2} × {lab3Height} = {0.25 * lab3Base * lab3Height} বর্গ সেমি
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ΔACD ক্ষেত্রফল = ½ × CD × h = ½ × {lab3Base / 2} × {lab3Height} = {0.25 * lab3Base * lab3Height} বর্গ সেমি
                    </div>
                    <div className="text-primary font-bold">
                      উভয় অংশের ক্ষেত্রফল সমান: {0.25 * lab3Base * lab3Height} = {0.25 * lab3Base * lab3Height} বর্গ সেমি
                    </div>
                  </div>
                </div>

                {/* Visualizer Canvas */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      মধ্যমা AD দ্বারা দ্বিখণ্ডিত ত্রিভুজদ্বয়
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      Area(ΔABD) = Area(ΔACD)
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <svg viewBox="0 0 400 220" className="w-full h-full">
                      {(() => {
                        const bx = 80;
                        const bw = lab3Base * 25;
                        const h = lab3Height * 20;
                        const apexX = bx + lab3ApexX * 25;
                        const midX = bx + bw / 2;

                        return (
                          <>
                            {/* Left Triangle: ABD */}
                            <polygon
                              points={`${bx},180 ${midX},180 ${apexX},${180 - h}`}
                              fill="rgba(59, 130, 246, 0.25)"
                              stroke="#60a5fa"
                              strokeWidth="2.5"
                            />
                            {/* Right Triangle: ACD */}
                            <polygon
                              points={`${midX},180 ${bx + bw},180 ${apexX},${180 - h}`}
                              fill="rgba(16, 185, 129, 0.25)"
                              stroke="#34d399"
                              strokeWidth="2.5"
                            />

                            {/* Median AD Line */}
                            <line
                              x1={apexX}
                              y1={180 - h}
                              x2={midX}
                              y2="180"
                              stroke="#ec4899"
                              strokeWidth="3"
                              strokeDasharray="4 2"
                            />

                            {/* Median Midpoint D */}
                            <circle cx={midX} cy="180" r="5" fill="#ec4899" />
                            <text x={midX} y="200" fill="#ec4899" fontSize="12" fontWeight="bold" textAnchor="middle">
                              D (মধ্যবিন্দু)
                            </text>

                            {/* Base points */}
                            <text x={bx - 10} y="195" fill="#fff" fontSize="12" fontWeight="bold">B</text>
                            <text x={bx + bw + 5} y="195" fill="#fff" fontSize="12" fontWeight="bold">C</text>
                            <text x={apexX} y={165 - h} fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
                              A
                            </text>

                            {/* Area text inside sub-triangles */}
                            <text x={(bx + midX + apexX) / 3} y={(180 + 180 + 180 - h) / 3} fill="#93c5fd" fontSize="11" textAnchor="middle">
                              {0.25 * lab3Base * lab3Height} ব.সে.
                            </text>
                            <text x={(midX + bx + bw + apexX) / 3} y={(180 + 180 + 180 - h) / 3} fill="#6ee7b7" fontSize="11" textAnchor="middle">
                              {0.25 * lab3Base * lab3Height} ব.সে.
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200">
                    <span className="font-semibold text-purple-700 dark:text-purple-300">জ্যামিতিক সত্য:</span> ত্রিভুজটি বিষমবাহু হলেও মধ্যমা সর্বদা ত্রিভুজটিকে সমান ক্ষেত্রফলের দুটি ভাগে বিভক্ত করে, কারণ শীর্ষবিন্দু থেকে অঙ্কিত লম্ব উচ্চতা উভয় ত্রিভুজের জন্যই অভিন্ন!
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 4: PYTHAGORAS & GARFIELD'S TRAPEZOID ---------------- */}
            {activeLabId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Calculator className="w-4 h-4 text-primary" />
                      সমকোণী ত্রিভুজ ও গারফিল্ড ট্রাপিজিয়াম প্যারামিটার
                    </h3>
                  </div>

                  {/* Slider a */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">বাহু a (উচ্চতা):</span>
                      <span className="font-bold text-primary">{lab4A} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="8"
                      value={lab4A}
                      onChange={(e) => setLab4A(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Slider b */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">বাহু b (ভূমি):</span>
                      <span className="font-bold text-primary">{lab4B} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="10"
                      value={lab4B}
                      onChange={(e) => setLab4B(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Dissection Proof Formula Box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="text-slate-500 font-semibold">গারফিল্ড ট্রাপিজিয়াম প্রমাণ:</div>
                    <div className="text-blue-600 dark:text-blue-400">
                      a² = {lab4A * lab4A}, b² = {lab4B * lab4B}
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      c = √(a² + b²) = √({lab4A * lab4A + lab4B * lab4B}) = {lab4C.toFixed(2)} সেমি
                    </div>
                    <div className="text-purple-600 dark:text-purple-400">
                      ট্রাপিজিয়াম ক্ষেত্রফল = ½(a+b)² = ½({lab4A + lab4B})² = {lab4TrapArea.toFixed(1)}
                    </div>
                    <div className="text-primary font-bold">
                      c² = {lab4C * lab4C} = a² + b² = {lab4A * lab4A + lab4B * lab4B} (১০০% প্রমাণিত)
                    </div>
                  </div>
                </div>

                {/* Visualizer Canvas */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Square className="w-4 h-4 text-emerald-500" />
                      গারফিল্ডের ট্রাপিজিয়াম ব্যবচ্ছেদ ডায়াগ্রাম
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      c² = a² + b² = {lab4A * lab4A + lab4B * lab4B}
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <svg viewBox="0 0 360 220" className="w-full h-full">
                      {/* Trapezoid Coordinates */}
                      {/* Bottom-left: (50, 190), Bottom-right: (270, 190) */}
                      {/* Triangle 1: (50, 190) to (50, 80) [height a] to (200, 190) [base b] */}
                      <polygon points="60,190 60,100 170,190" fill="rgba(59, 130, 246, 0.25)" stroke="#60a5fa" strokeWidth="2" />
                      <text x="50" y="145" fill="#60a5fa" fontSize="11" fontWeight="bold">a={lab4A}</text>
                      <text x="110" y="205" fill="#60a5fa" fontSize="11" fontWeight="bold">b={lab4B}</text>

                      {/* Triangle 2 (Rotated on top): (170, 190) to (270, 190) to (270, 40) */}
                      <polygon points="170,190 270,190 270,80" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" />
                      <text x="220" y="205" fill="#34d399" fontSize="11" fontWeight="bold">a={lab4A}</text>
                      <text x="280" y="140" fill="#34d399" fontSize="11" fontWeight="bold">b={lab4B}</text>

                      {/* Middle Right-angled Isosceles Triangle: (60, 100), (170, 190), (270, 80) */}
                      <polygon points="60,100 170,190 270,80 60,100" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="2.5" />
                      <text x="165" y="130" fill="#f472b6" fontSize="13" fontWeight="bold" textAnchor="middle">
                        c² = {lab4A * lab4A + lab4B * lab4B}
                      </text>

                      {/* Trapezoid closing top line */}
                      <line x1="60" y1="100" x2="270" y2="80" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">ঐতিহাসিক নোট:</span> ১৮৭৬ সালে মার্কিন যুক্তরাষ্ট্রের ২০তম প্রেসিডেন্ট জেমস এ. গারফিল্ড পিথাগোরাসের উপপাদ্যের এই চমৎকার ট্রাপিজিয়াম প্রমাণটি উদ্ভাবন করেন, যা এনসিটিবি সিলেবাসের অন্যতম প্রিয় সৃজনশীল প্রশ্ন!
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- LAB 5: CONSTRUCTION 13 (TRIANGLE TO PARALLELOGRAM) ---------------- */}
            {activeLabId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Compass className="w-4 h-4 text-primary" />
                      সম্পাদ্য ১৩: অঙ্কনের ধারাবাহিক ধাপসমূহ
                    </h3>
                  </div>

                  {/* Step Selector Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <button
                        key={step}
                        onClick={() => setLab5Step(step)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          lab5Step === step
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        ধাপ {step}
                      </button>
                    ))}
                  </div>

                  {/* Step Explanation Text */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    {lab5Step === 1 && (
                      <div>
                        <div className="font-bold text-primary mb-1">ধাপ ১: মূল ত্রিভুজ ও ভূমি সমদ্বিখণ্ডন</div>
                        <p className="text-slate-600 dark:text-slate-400">
                          প্রদত্ত ত্রিভুজ ΔABC এর ভূমি BC কে D বিন্দুতে সমান দুই ভাগে বিভক্ত করি (BD = DC = ½ BC)।
                        </p>
                      </div>
                    )}
                    {lab5Step === 2 && (
                      <div>
                        <div className="font-bold text-primary mb-1">ধাপ ২: সমান্তরাল রেখা অঙ্কন</div>
                        <p className="text-slate-600 dark:text-slate-400">
                          শীর্ষবিন্দু A দিয়ে ভূমি BC এর সমান্তরাল করে একটি সরলরেখা AM আঁকি।
                        </p>
                      </div>
                    )}
                    {lab5Step === 3 && (
                      <div>
                        <div className="font-bold text-primary mb-1">ধাপ ৩: নির্দিষ্ট কোণ ∠x অঙ্কন</div>
                        <p className="text-slate-600 dark:text-slate-400">
                          D বিন্দুতে নির্দিষ্ট কোণ ∠x = ৬০° এর সমান করে ∠CDE কোণ আঁকি, যেখানে DE রেখাটি সমান্তরাল AM কে E বিন্দুতে ছেদ করে।
                        </p>
                      </div>
                    )}
                    {lab5Step === 4 && (
                      <div>
                        <div className="font-bold text-primary mb-1">ধাপ ৪: সামান্তরিক সম্পূর্ণকরণ</div>
                        <p className="text-slate-600 dark:text-slate-400">
                          C বিন্দু দিয়ে DE এর সমান্তরাল CF রেখা আঁকি যা AM কে F বিন্দুতে ছেদ করে। ফলে গঠিত CDEF-ই উদ্দিষ্ট সামান্তরিক!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Area Preservation Metric */}
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-1 text-xs font-mono">
                    <div className="text-emerald-700 dark:text-emerald-400 font-bold">ক্ষেত্রফল সংরক্ষণ প্রমাণ:</div>
                    <div>ΔABC ক্ষেত্রফল = ½ × BC × h</div>
                    <div>সামান্তরিক CDEF ক্ষেত্রফল = CD × h = (½ BC) × h</div>
                    <div className="text-primary font-bold">উভয় ক্ষেত্রফল হুবহু সমান!</div>
                  </div>
                </div>

                {/* Visualizer Canvas */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      জ্যামিতিক অঙ্কন অ্যানিমেশন ভিউ
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      Area(ΔABC) = Area(CDEF)
                    </span>
                  </div>

                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <svg viewBox="0 0 400 220" className="w-full h-full">
                      {/* Triangle ABC */}
                      <polygon points="100,180 300,180 180,50" fill="rgba(59, 130, 246, 0.15)" stroke="#60a5fa" strokeWidth="2" />
                      <text x="180" y="40" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
                      <text x="90" y="195" fill="#fff" fontSize="12" fontWeight="bold">B</text>
                      <text x="305" y="195" fill="#fff" fontSize="12" fontWeight="bold">C</text>

                      {/* Step 1: Midpoint D */}
                      {lab5Step >= 1 && (
                        <>
                          <circle cx="200" cy="180" r="5" fill="#ec4899" />
                          <text x="200" y="200" fill="#ec4899" fontSize="12" fontWeight="bold" textAnchor="middle">D</text>
                        </>
                      )}

                      {/* Step 2: Parallel line AM through A */}
                      {lab5Step >= 2 && (
                        <>
                          <line x1="50" y1="50" x2="350" y2="50" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
                          <text x="355" y="55" fill="#fbbf24" fontSize="11" fontFamily="monospace">M</text>
                        </>
                      )}

                      {/* Step 3: Line DE at angle 60° */}
                      {lab5Step >= 3 && (
                        <>
                          <line x1="200" y1="180" x2="250" y2="50" stroke="#34d399" strokeWidth="2.5" />
                          <circle cx="250" cy="50" r="4" fill="#34d399" />
                          <text x="250" y="40" fill="#34d399" fontSize="12" fontWeight="bold">E</text>
                        </>
                      )}

                      {/* Step 4: Parallelogram CDEF Completed */}
                      {lab5Step >= 4 && (
                        <>
                          <polygon
                            points="200,180 300,180 350,50 250,50"
                            fill="rgba(16, 185, 129, 0.25)"
                            stroke="#34d399"
                            strokeWidth="2.5"
                          />
                          <circle cx="350" cy="50" r="4" fill="#34d399" />
                          <text x="355" y="40" fill="#34d399" fontSize="12" fontWeight="bold">F</text>
                        </>
                      )}
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">পরীক্ষার অঙ্কন টিপস:</span> কম্পাস দিয়ে BC এর সমদ্বিখণ্ডক লম্ব বৃত্তচাপ স্পষ্ট রাখতে হবে এবং A বিন্দুতে একান্তর কোণ সমান করে সমান্তরাল রেখা আঁকতে হবে।
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 2: SEE EXAMPLE (বোর্ড সৃজনশীল প্রশ্ন) */}
        {/* ================================================================== */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  এনসিটিবি বোর্ড সৃজনশীল প্রশ্ন ও আদর্শ সমাধান
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  বিগত বছরের এসএসসি পরীক্ষায় আসা সর্বাধিক গুরুত্বপূর্ণ ৩টি সৃজনশীল প্রশ্ন, পূর্ণাঙ্গ নম্বর বণ্টন ও পরীক্ষকের সিক্রেট নোট।
                </p>
              </div>
            </div>

            {/* CQ Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CHAPTER_CQS.map((cq) => (
                <button
                  key={cq.id}
                  onClick={() => setSelectedCQId(cq.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedCQId === cq.id
                      ? 'bg-white dark:bg-slate-900 border-primary shadow-md shadow-primary/10 ring-1 ring-primary'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="text-[11px] font-bold text-primary">CQ ০{cq.id}</span>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {cq.boardYear}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected CQ Content */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {currentCQ.boardYear}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {currentCQ.stimulus}
                </p>
              </div>

              {/* CQ Parts */}
              <div className="space-y-6">
                {currentCQ.parts.map((p) => (
                  <div
                    key={p.part}
                    className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {p.part}
                        </span>
                        <span>{p.question}</span>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        পূর্ণ নম্বর: {p.marks}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      {p.solution.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">পরীক্ষকের সিক্রেট নোট:</span> {p.examinerSecret}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 3: TRY YOURSELF (বাস্তব সমস্যা সমাধান ও চ্যালেঞ্জ) */}
        {/* ================================================================== */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
              <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ইন্টারেক্টিভ গণিত চ্যালেঞ্জ (Try Yourself)
              </h2>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                খাতা-কলমে হিসাব করে সঠিক উত্তর টাইপ করুন এবং তাৎক্ষণিক সবুজ টিক অর্জন করুন।
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Challenge 1 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                    চ্যালেঞ্জ ০১: ত্রিভুজ ক্ষেত্রফল নির্ণয়
                  </span>
                  {challenge1Status === 'correct' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                  {challenge1Status === 'wrong' && (
                    <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> ভুল হয়েছে, আবার চেষ্টা করুন!
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  একটি ত্রিভুজের ভূমি ১২ সেমি এবং উচ্চতা ৮ সেমি হলে এর ক্ষেত্রফল কত বর্গ সেমি?
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={challenge1Input}
                    onChange={(e) => setChallenge1Input(e.target.value)}
                    placeholder="উত্তরের মান লিখুন..."
                    className="max-w-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-primary"
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
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    চ্যালেঞ্জ ০২: সমকোণী ত্রিভুজের অতিভুজ
                  </span>
                  {challenge2Status === 'correct' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                  {challenge2Status === 'wrong' && (
                    <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> ভুল হয়েছে, আবার চেষ্টা করুন!
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  একটি সমকোণী ত্রিভুজের সমকোণ সংলগ্ন বাহুদ্বয় ৯ সেমি ও ১২ সেমি হলে অতিভুজের দৈর্ঘ্য কত সেমি?
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={challenge2Input}
                    onChange={(e) => setChallenge2Input(e.target.value)}
                    placeholder="উত্তরের মান লিখুন..."
                    className="max-w-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-primary"
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
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                    চ্যালেঞ্জ ০৩: সমকোণী ত্রিভুজের অপর বাহু
                  </span>
                  {challenge3Status === 'correct' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> সঠিক হয়েছে!
                    </span>
                  )}
                  {challenge3Status === 'wrong' && (
                    <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> ভুল হয়েছে, আবার চেষ্টা করুন!
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  একটি সমকোণী ত্রিভুজের অতিভুজ ১০ সেমি এবং এক বাহু ৬ সেমি হলে অপর বাহুর দৈর্ঘ্য কত সেমি?
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={challenge3Input}
                    onChange={(e) => setChallenge3Input(e.target.value)}
                    placeholder="উত্তরের মান লিখুন..."
                    className="max-w-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-primary"
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
                  অধ্যায় ১৫ কুইজ ও আত্মযাচাই
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
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  পুনরায় চেষ্টা করুন
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* STEP 5: SUMMARY & CHEAT SHEET */}
        {/* ================================================================== */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
              <h2 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                অধ্যায় ১৫: ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য রিভিশন চিট-শীট
              </h2>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                পরীক্ষার আগের রাতের জন্য এনসিটিবি সিলেবাসের সমস্ত মৌলিক উপপাদ্য, ক্ষেত্রফল সূত্র ও সম্পাদ্যের সারসংক্ষেপ।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  সামান্তরিক ক্ষেত্রফল (উপপাদ্য ৩৫)
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>একই ভূমি ও সমান্তরাল যুগলে অবস্থিত সকল সামান্তরিকের ক্ষেত্রফল সমান।</li>
                  <li>ক্ষেত্রফল = ভূমি × লম্ব উচ্চতা (Area = b × h)।</li>
                  <li>তীর্যক সরণ হলেও লম্ব দূরত্ব অপরিবর্তিত থাকলে ক্ষেত্রফল স্থির থাকে।</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  ত্রিভুজ ক্ষেত্রফল (উপপাদ্য ৩৬)
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>একই ভূমি ও সমান্তরাল যুগলে ত্রিভুজ ক্ষেত্রফল = ½ × সামান্তরিকের ক্ষেত্রফল।</li>
                  <li>শীর্ষবিন্দু সমান্তরাল রেখায় যেখানেই যাক, ত্রিভুজের ক্ষেত্রফল অপরিবর্তিত থাকে।</li>
                  <li>ত্রিভুজের মধ্যমা ত্রিভুজক্ষেত্রকে সমান ক্ষেত্রফলবিশিষ্ট দুই ভাগে ভাগ করে।</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  পিথাগোরাসের উপপাদ্য (উপপাদ্য ৩৯)
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>সমকোণী ত্রিভুজে: অতিভুজ² = ভূমি² + লম্ব² (c² = a² + b²)।</li>
                  <li>গারফিল্ডের ট্রাপিজিয়াম প্রমাণ: ½(a+b)² = ab + ½c²।</li>
                  <li>বিপরীত উপপাদ্য: c² = a² + b² হলে অন্তর্ভুক্ত কোণ সমকোণ (৯০°)।</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  ক্ষেত্রফল সংরক্ষণ সম্পাদ্য (সম্পাদ্য ১৩)
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>ত্রিভুজের সমান ক্ষেত্রফলবিশিষ্ট সামান্তরিক আঁকতে ভূমির অর্ধেক (b/2) নেওয়া হয়।</li>
                  <li>উচ্চতা অভিন্ন থাকায় Area = (b/2) × h = ½ bh সংরক্ষিত থাকে।</li>
                  <li>নির্দিষ্ট কোণ ∠x শীর্ষবিন্দু D-তে স্থাপন করতে হয়।</li>
                </ul>
              </div>
            </div>

            {/* Quick Copy Box */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Copy className="w-4 h-4 text-primary" />
                  এক নজরে রিভিশন নোটস কপি করুন
                </h3>
                <button
                  onClick={handleCopyCheatSheet}
                  className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCheatSheet ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>চিটশিট কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`১. উপপাদ্য ৩৫: একই ভূমি ও সমান্তরাল যুগলের সামান্তরিকসমূহের ক্ষেত্রফল সমান (ক্ষেত্রফল = ভূমি × উচ্চতা)।
২. উপপাদ্য ৩৬: একই ভূমি ও সমান্তরাল যুগলে অবস্থিত ত্রিভুজ ক্ষেত্রের ক্ষেত্রফল সামান্তরিকের ক্ষেত্রফলের অর্ধেক (Δ = ½ × সামান্তরিক)।
৩. শীর্ষবিন্দু সরণ নীতি: সমান্তরাল রেখা বরাবর ত্রিভুজের শীর্ষবিন্দু সরালে ভূমির দৈর্ঘ্য ও উচ্চতা স্থির থাকায় ক্ষেত্রফল ধ্রুব থাকে।
৪. মধ্যমা উপপাদ্য: ত্রিভুজের যেকোনো মধ্যমা ত্রিভুজক্ষেত্রকে সমান ক্ষেত্রফলবিশিষ্ট দুটি ত্রিভুজে বিভক্ত করে।
৫. পিথাগোরাসের উপপাদ্য (উপপাদ্য ৩৯): সমকোণী ত্রিভুজে c² = a² + b²।
৬. গারফিল্ডের ট্রাপিজিয়াম ক্ষেত্রফল সমতা: ½(a + b)² = ab + ½c² ⟹ c² = a² + b²।
৭. সম্পাদ্য ১৩: ত্রিভুজের ক্ষেত্রফলের সমান সামান্তরিক আঁকতে ভূমির অর্ধেক (b/2) নিয়ে একই উচ্চতায় সামান্তরিক আঁকা হয়।`}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Floating Sheru AI Tutor Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-xs shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>শেরু AI ক্ষেত্রফল টিউটর</span>
        </button>
      </div>

      {/* Sheru AI Companion Drawer */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  শেরু
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">শেরু AI ক্ষেত্রফল ও সম্পাদ্য গাইড</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>সক্রিয় • জ্যামিতিক উপপাদ্য বিশেষজ্ঞ</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
              <button
                onClick={() => {
                  setAiUserInput('উপপাদ্য ৩৫ এর প্রমাণ সহজ ভাষায় বলো');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
              >
                উপপাদ্য ৩৫ কী?
              </button>
              <button
                onClick={() => {
                  setAiUserInput('গারফিল্ডের ট্রাপিজিয়াম প্রমাণটি সংক্ষেপে বুঝাও');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
              >
                গারফিল্ড পিথাগোরাস প্রমাণ?
              </button>
              <button
                onClick={() => {
                  setAiUserInput('সম্পাদ্য ১৩ তে ভূমি কেন অর্ধেক করা হয়?');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
              >
                সম্পাদ্য ১৩ তে ভূমি b/2 কেন?
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {aiChatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.sender === 'user' ? 'আপনি' : 'এখনই'}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={aiUserInput}
                  onChange={(e) => setAiUserInput(e.target.value)}
                  placeholder="ক্ষেত্রফল ও সম্পাদ্য সম্পর্কিত প্রশ্ন লিখুন..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-primary"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
