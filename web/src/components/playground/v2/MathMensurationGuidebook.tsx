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
  Layers,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Triangle,
  Square,
  Circle,
  Box,
  Eye,
  CheckSquare,
  Award,
  RotateCcw,
  Shapes,
  Maximize2,
  Minimize2,
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
    title: 'ত্রিভুজ ক্ষেত্রফল বহুমুখী ল্যাব',
    subtitle: 'Triangles Area Master Lab: Right, Equilateral, Isosceles & Heron (16.1)',
    nctbPage: 'অনুশীলনী ১৬.১ • পৃষ্ঠা ৩১০',
    badge: 'অনুশীলনী ১৬.১',
    intro:
      'সমকোণী, সমবাহু, সমদ্বিবাহু ও বিষমবাহু ত্রিভুজের ক্ষেত্রফল নির্ণয়ের বৈচিত্র্যময় সূত্রাবলি ও হেরনের সূত্র ($s = \\frac{a+b+c}{2}$ ও $\\Delta = \\sqrt{s(s-a)(s-b)(s-c)}$)। বাহুর মান পরিবর্তন করে ক্ষেত্রফল পর্যবেক্ষণ করুন।',
  },
  {
    id: 2,
    title: 'চতুর্ভুজ ও ট্রাপিজিয়াম সিমুলেটর ল্যাব',
    subtitle: 'Quadrilaterals: Parallelogram, Rhombus & Trapezoid (16.2)',
    nctbPage: 'অনুশীলনী ১৬.২ • পৃষ্ঠা ৩১৫',
    badge: 'অনুশীলনী ১৬.২',
    intro:
      'সামান্তরিক ($A = bh$ বা $ab\\sin\\theta$), রম্বস ($A = \\frac{1}{2}d_1 d_2$) এবং ট্রাপিজিয়াম ($A = \\frac{1}{2}(a+b)h$)-এর ক্ষেত্রফল ও পরিসীমা নির্ণয়। কর্ণের দৈর্ঘ্য ও সমান্তরাল বাহু পরিবর্তনের সাথে লাইভ ড্রয়িং দেখুন।',
  },
  {
    id: 3,
    title: 'সুষম বহুভুজ ক্ষেত্রফল ও অন্তঃকোণ ল্যাব',
    subtitle: 'Regular Polygons: Area & Angles Lab (16.2)',
    nctbPage: 'অনুশীলনী ১৬.২ • পৃষ্ঠা ৩১৯',
    badge: 'সুষম বহুভুজ',
    intro:
      'সুষম $n$-ভুজের প্রতিটি বাহু $a$ হলে ক্ষেত্রফল $\\frac{n a^2}{4}\\cot\\left(\\frac{180^\\circ}{n}\\right)$, কেন্দ্রস্থ উৎপন্ন কোণ $\\frac{360^\\circ}{n}$ এবং প্রতিটি অন্তঃকোণ $\\frac{(n-2)180^\\circ}{n}$। পঞ্চভুজ, ষড়ভুজ ও অষ্টভুজের লাইভ ব্যবচ্ছেদ দেখুন।',
  },
  {
    id: 4,
    title: 'বৃত্ত, বৃত্তকলা ও চাকার ঘূর্ণন ল্যাব',
    subtitle: 'Circle, Sector Area & Wheel Revolutions Lab (16.3)',
    nctbPage: 'অনুশীলনী ১৬.৩ • পৃষ্ঠা ৩২২',
    badge: 'অনুশীলনী ১৬.৩',
    intro:
      'বৃত্তের পরিধি $2\\pi r$, ক্ষেত্রফল $\\pi r^2$, বৃত্তচাপের দৈর্ঘ্য $s = \\frac{\\pi r \\theta}{180^\\circ}$, বৃত্তকলার ক্ষেত্রফল $A = \\frac{\\theta}{360^\\circ}\\pi r^2 = \\frac{1}{2}sr$ এবং বৃত্তাকার পথ ও চাকার আবর্তনের গাণিতিক সিমুলেটর।',
  },
  {
    id: 5,
    title: '৩-মাত্রিক আয়তাকার ঘনবস্তু, ঘনক ও বেলন ল্যাব',
    subtitle: '3D Solids: Rectangular Cuboid, Cube & Cylinder (16.4)',
    nctbPage: 'অনুশীলনী ১৬.৪ • পৃষ্ঠা ৩২৮',
    badge: 'অনুশীলনী ১৬.৪',
    intro:
      'আয়তাকার ঘনবস্তু ($V=abc, S=2(ab+bc+ca), d=\\sqrt{a^2+b^2+c^2}$), ঘনক ($a^3, 6a^2, \\sqrt{3}a$) এবং বেলন বা সিলিন্ডারের ($V=\\pi r^2 h, S_{\\text{curved}}=2\\pi rh, S_{\\text{total}}=2\\pi r(r+h)$) সমগ্রপৃষ্ঠ ও আয়তন এক্সপ্লোরার।',
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
    boardYear: 'ঢাকা বোর্ড ২০২৪ ও কুমিল্লা বোর্ড ২০২৩',
    stimulus:
      'একটি সমবাহু ত্রিভুজের প্রত্যেক বাহুর দৈর্ঘ্য 2 মিটার বাড়ালে এর ক্ষেত্রফল $6\\sqrt{3}$ বর্গমিটার বেড়ে যায়। অপর একটি সুষম ষড়ভুজের কেন্দ্র থেকে কৌণিক বিন্দুর দূরত্ব 6 মিটার।',
    parts: [
      {
        part: 'ক',
        marks: 2,
        question: 'একটি সমদ্বিবাহু ত্রিভুজের সমান সমান বাহুর দৈর্ঘ্য 10 সেমি এবং ক্ষেত্রফল 48 বর্গ সেমি হলে ভূমির দৈর্ঘ্য নির্ণয় কর।',
        solution: [
          'ধরি, সমান সমান বাহুর দৈর্ঘ্য $a = 10$ সেমি এবং ভূমির দৈর্ঘ্য $b$ সেমি।',
          'আমরা জানি, সমদ্বিবাহু ত্রিভুজের ক্ষেত্রফল $= \\frac{b}{4}\\sqrt{4a^2 - b^2}$',
          'প্রশ্নমতে, $\\frac{b}{4}\\sqrt{4(10)^2 - b^2} = 48$',
          'বা, $b\\sqrt{400 - b^2} = 192$',
          'উভয়পক্ষকে বর্গ করে: $b^2(400 - b^2) = 192^2 = 36864$',
          'বা, $400b^2 - b^4 = 36864 \\implies b^4 - 400b^2 + 36864 = 0$',
          'বা, $(b^2 - 256)(b^2 - 144) = 0$',
          'অতএব, $b^2 = 256 \\implies b = 16$ অথবা $b^2 = 144 \\implies b = 12$।',
          'অতএব, ভূমির দৈর্ঘ্য 12 সেমি অথবা 16 সেমি।',
        ],
        examinerSecret:
          'উভয় মান (12 সেমি এবং 16 সেমি) গ্রহণযোগ্য কারণ ত্রিভুজের অস্তিত্ব শর্ত $2a > b \\implies 20 > 16$ এবং $20 > 12$ উভয় ক্ষেত্রেই সত্য। যেকোনো একটি লিখলে ১ মার্ক কাটা যাবে।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'উদ্দীপকের সমবাহু ত্রিভুজটির বাহুর দৈর্ঘ্য ও প্রাথমিক ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'ধরি, সমবাহু ত্রিভুজের প্রতিটি বাহুর দৈর্ঘ্য $a$ মিটার।',
          'অতএব, ত্রিভুজটির ক্ষেত্রফল $= \\frac{\\sqrt{3}}{4} a^2$ বর্গমিটার।',
          'বাহুর দৈর্ঘ্য 2 মিটার বাড়ালে বাহু হয় $(a+2)$ মিটার।',
          'তখন ক্ষেত্রফল $= \\frac{\\sqrt{3}}{4} (a+2)^2$ বর্গমিটার।',
          'শর্তমতে, $\\frac{\\sqrt{3}}{4}(a+2)^2 - \\frac{\\sqrt{3}}{4}a^2 = 6\\sqrt{3}$',
          'উভয়পক্ষকে $\\frac{\\sqrt{3}}{4}$ দ্বারা ভাগ করে:',
          '$(a+2)^2 - a^2 = \\frac{6\\sqrt{3}}{\\frac{\\sqrt{3}}{4}} = 6 \\times 4 = 24$',
          'বা, $a^2 + 4a + 4 - a^2 = 24$',
          'বা, $4a + 4 = 24 \\implies 4a = 20 \\implies a = 5$ মিটার।',
          'অতএব, ত্রিভুজটির প্রাথমিক ক্ষেত্রফল $= \\frac{\\sqrt{3}}{4} (5)^2 = \\frac{25\\sqrt{3}}{4} \\approx 10.825$ বর্গমিটার।',
        ],
        examinerSecret:
          '$\\sqrt{3}$ উভয়পক্ষ থেকে সরাসরি কমন নিয়ে কাটলে হিসাব দ্রুত ও নির্ভুল হয়। দশমিকে আসন্ন মান লেখার সময় অবশ্যই "প্রায়" শব্দটি লিখতে হবে।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'উদ্দীপকের সুষম ষড়ভুজটির ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'সুষম ষড়ভুজের কেন্দ্র থেকে শীর্ষবিন্দুর দূরত্ব $R = 6$ মিটার।',
          'আমরা জানি, সুষম ষড়ভুজের কেন্দ্রে সংযুক্ত করলে এটি 6টি সর্বসম সমবাহু ত্রিভুজে বিভক্ত হয়।',
          'কারণ কেন্দ্রে প্রতিটি ত্রিভুজের শীর্ষকোণ $= \\frac{360^\\circ}{6} = 60^\\circ$।',
          'যেহেতু কেন্দ্র থেকে শীর্ষের দূরত্ব $R$, তাই প্রতিটি সমবাহু ত্রিভুজের প্রতিটি বাহুর দৈর্ঘ্য $a = R = 6$ মিটার।',
          'একটি সমবাহু ত্রিভুজের ক্ষেত্রফল $= \\frac{\\sqrt{3}}{4} a^2 = \\frac{\\sqrt{3}}{4} (6)^2 = \\frac{\\sqrt{3}}{4} \\times 36 = 9\\sqrt{3}$ বর্গমিটার।',
          'অতএব, সুষম ষড়ভুজের মোট ক্ষেত্রফল $= 6 \\times 9\\sqrt{3} = 54\\sqrt{3}$ বর্গমিটার',
          '$\\approx 54 \\times 1.73205 = 93.53$ বর্গমিটার (প্রায়)।',
        ],
        examinerSecret:
          'সুষম ষড়ভুজের প্রতিটি বাহু কেন কেন্দ্র থেকে দূরত্বের সমান ($a = R$), তা ব্যাখ্যার জন্য ১ নম্বর বরাদ্দ থাকে। বিকল্পে সাধারণ সূত্র $\\frac{n a^2}{4}\\cot(180^\\circ/n)$ ব্যবহার করলেও পূর্ণ নম্বর পাওয়া যাবে।',
      },
    ],
  },
  {
    id: 2,
    boardYear: 'চট্টগ্রাম বোর্ড ২০২৪ ও যশোর বোর্ড ২০২৩',
    stimulus:
      'একটি ট্রাপিজিয়ামের সমান্তরাল বাহুদ্বয়ের দৈর্ঘ্য যথাক্রমে 31 সেমি ও 11 সেমি এবং অপর দুটি তীর্যক বাহুর দৈর্ঘ্য যথাক্রমে 12 সেমি ও 16 সেমি। একটি বৃত্তের ব্যাসার্ধ 14 সেমি যার একটি বৃত্তচাপ কেন্দ্রে $75^\\circ$ কোণ উৎপন্ন করে।',
    parts: [
      {
        part: 'ক',
        marks: 2,
        question: 'বৃত্তচাপটির দৈর্ঘ্য নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, বৃত্তের ব্যাসার্ধ $r = 14$ সেমি এবং কেন্দ্রস্থ কোণ $\\theta = 75^\\circ$।',
          'আমরা জানি, বৃত্তচাপের দৈর্ঘ্য $s = \\frac{\\pi r \\theta}{180^\\circ}$',
          '$s = \\frac{3.1416 \\times 14 \\times 75}{180} = \\frac{3298.68}{180} \\approx 18.326$ সেমি।',
          'উত্তর: 18.33 সেমি (প্রায়)।',
        ],
        examinerSecret:
          '$\\pi = 3.1416$ বা $\\frac{22}{7}$ উল্লেখ না থাকলে ক্যালকুলেটরের $\\pi$ বা 3.1416 ব্যবহার করা স্ট্যান্ডার্ড।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'বৃত্তচাপ দ্বারা গঠিত বৃত্তকলার ক্ষেত্রফল এবং অবশিষ্টাংশের ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'বৃত্তকলার ক্ষেত্রফল $A = \\frac{\\theta}{360^\\circ} \\times \\pi r^2$',
          '$A = \\frac{75}{360} \\times 3.1416 \\times (14)^2 = \\frac{5}{24} \\times 3.1416 \\times 196$',
          '$A = \\frac{5 \\times 615.7536}{24} = 128.28$ বর্গ সেমি (প্রায়)।',
          'সম্পূর্ণ বৃত্তের ক্ষেত্রফল $= \\pi r^2 = 3.1416 \\times 196 = 615.75$ বর্গ সেমি।',
          'অতএব, অবশিষ্টাংশের ক্ষেত্রফল $= 615.75 - 128.28 = 487.47$ বর্গ সেমি (প্রায়)।',
        ],
        examinerSecret:
          'বিকল্প পদ্ধতি: অবশিষ্টাংশের কোণ $(360^\\circ - 75^\\circ = 285^\\circ)$ ধরে সরাসরি ক্ষেত্রফল বের করলেও পূর্ণ নম্বর দিতে হবে।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'উদ্দীপকের ট্রাপিজিয়ামটির ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'ধরি, ট্রাপিজিয়াম $ABCD$-এর সমান্তরাল বাহুদ্বয় $AB = 31$ সেমি ও $CD = 11$ সেমি।',
          'তীর্যক বাহুদ্বয় $AD = 12$ সেমি ও $BC = 16$ সেমি।',
          '$C$ বিন্দু দিয়ে $AD$-এর সমান্তরাল করে $CE$ রেখাংশ আঁকি যা $AB$-কে $E$ বিন্দুতে ছেদ করে।',
          'তাহলে $AECD$ একটি সামান্তরিক, যার $AE = CD = 11$ সেমি এবং $CE = AD = 12$ সেমি।',
          'এখন, $\\Delta BCE$-তে $EB = AB - AE = 31 - 11 = 20$ সেমি।',
          'ত্রিভুজের তিন বাহু: $CE = 12$ সেমি, $BC = 16$ সেমি, $EB = 20$ সেমি।',
          'যেহেতু $12^2 + 16^2 = 144 + 256 = 400 = 20^2$, তাই $\\Delta BCE$ একটি সমকোণী ত্রিভুজ যার $\\angle ECB = 90^\\circ$!',
          'বিকল্পে ত্রিভুজের ক্ষেত্রফল $= \\frac{1}{2} \\times 12 \\times 16 = 96$ বর্গ সেমি।',
          'আবার ত্রিভুজের ক্ষেত্রফল $= \\frac{1}{2} \\times EB \\times h = \\frac{1}{2} \\times 20 \\times h = 10h$',
          'অতএব, $10h = 96 \\implies h = 9.6$ সেমি (ট্রাপিজিয়ামের উচ্চতা)।',
          'ট্রাপিজিয়ামের ক্ষেত্রফল $= \\frac{1}{2}(AB + CD) \\times h = \\frac{1}{2}(31 + 11) \\times 9.6 = \\frac{1}{2} \\times 42 \\times 9.6 = 201.6$ বর্গ সেমি।',
        ],
        examinerSecret:
          'তীর্যক বাহু দিয়ে গঠিত ত্রিভুজটির ক্ষেত্রফল বের করে উচ্চতা $h$ বের করার কৌশলটি বোর্ডের সবচেয়ে গুরুত্বপূর্ণ ৪ নম্বরের অঙ্ক।',
      },
    ],
  },
  {
    id: 3,
    boardYear: 'রাজশাহী বোর্ড ২০২৪ ও দিনাজপুর বোর্ড ২০২৩',
    stimulus:
      'একটি আয়তাকার ঘনবস্তুর দৈর্ঘ্য, প্রস্থ ও উচ্চতার অনুপাত যথাক্রমে $4 : 3 : 2$ এবং এর সমগ্রপৃষ্ঠের ক্ষেত্রফল 468 বর্গমিটার। অপর একটি বেলনের ভূমির ব্যাসার্ধ 7 সেমি ও উচ্চতা 15 সেমি।',
    parts: [
      {
        part: 'ক',
        marks: 2,
        question: 'বেলনটির বক্রতলের ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, বেলনের ভূমির ব্যাসার্ধ $r = 7$ সেমি এবং উচ্চতা $h = 15$ সেমি।',
          'আমরা জানি, বেলনের বক্রপৃষ্ঠের ক্ষেত্রফল $= 2\\pi rh$',
          '$= 2 \\times \\frac{22}{7} \\times 7 \\times 15 = 2 \\times 22 \\times 15 = 660$ বর্গ সেমি।',
          'উত্তর: 660 বর্গ সেমি।',
        ],
        examinerSecret:
          'বক্রতলের সূত্রে ভূমির বৃত্তের ক্ষেত্রফল $\\pi r^2$ যোগ করা যাবে না। কেবল পার্শ্বতল বা বক্রতল চাওয়া হয়েছে।',
      },
      {
        part: 'খ',
        marks: 4,
        question: 'আয়তাকার ঘনবস্তুটির কর্ণের দৈর্ঘ্য ও আয়তন নির্ণয় কর।',
        solution: [
          'ধরি, ঘনবস্তুর দৈর্ঘ্য $a = 4x$, প্রস্থ $b = 3x$ এবং উচ্চতা $c = 2x$ মিটার।',
          'আমরা জানি, সমগ্রপৃষ্ঠের ক্ষেত্রফল $= 2(ab + bc + ca)$',
          'প্রশ্নমতে, $2(4x \\cdot 3x + 3x \\cdot 2x + 2x \\cdot 4x) = 468$',
          'বা, $2(12x^2 + 6x^2 + 8x^2) = 468$',
          'বা, $2 \\times 26x^2 = 468 \\implies 52x^2 = 468$',
          'বা, $x^2 = \\frac{468}{52} = 9 \\implies x = 3$ (যেহেতু দৈর্ঘ্য ঋণাত্মক হতে পারে না)।',
          'অতএব, দৈর্ঘ্য $a = 4 \\times 3 = 12$ মি, প্রস্থ $b = 3 \\times 3 = 9$ মি, উচ্চতা $c = 2 \\times 3 = 6$ মি।',
          '১. কর্ণের দৈর্ঘ্য $d = \\sqrt{a^2 + b^2 + c^2} = \\sqrt{12^2 + 9^2 + 6^2} = \\sqrt{144 + 81 + 36} = \\sqrt{261} \\approx 16.155$ মিটার।',
          '২. আয়তন $V = abc = 12 \\times 9 \\times 6 = 648$ ঘনমিটার।',
        ],
        examinerSecret:
          'একক লিখতে ভুল করা যাবে না: ক্ষেত্রফল বর্গমিটার, কর্ণের দৈর্ঘ্য মিটার এবং আয়তন ঘনমিটার। একক ভুলের জন্য প্রতিটিতে ০.৫ কাটা যায়।',
      },
      {
        part: 'গ',
        marks: 4,
        question: 'বেলনটির সমান আয়তনবিশিষ্ট একটি ঘনকের ধার এবং সমগ্রপৃষ্ঠের ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'বেলনের আয়তন $V_c = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times 15 = 22 \\times 7 \\times 15 = 2310$ ঘন সেমি।',
          'ধরি, সম-আয়তনবিশিষ্ট ঘনকের প্রতিটি ধারের দৈর্ঘ্য $A$ সেমি।',
          'ঘনকের আয়তন $= A^3$ ঘন সেমি।',
          'শর্তমতে, $A^3 = 2310$',
          'বা, $A = \\sqrt[3]{2310} \\approx 13.219$ সেমি।',
          'অতএব, ঘনকের প্রতিটি ধারের দৈর্ঘ্য $A \\approx 13.22$ সেমি (প্রায়)।',
          'ঘনকের সমগ্রপৃষ্ঠের ক্ষেত্রফল $= 6A^2 = 6 \\times (13.219)^2 = 6 \\times 174.742 \\approx 1048.45$ বর্গ সেমি।',
          'উত্তর: ধার 13.22 সেমি এবং সমগ্রপৃষ্ঠ 1048.45 বর্গ সেমি (প্রায়)।',
        ],
        examinerSecret:
          'ঘনকের আয়তন $A^3$ থেকে ঘনমূল বের করতে বৈজ্ঞানিক ক্যালকুলেটর ব্যবহার করতে হয়। আসন্ন মান ৪ দশমিক পর্যন্ত ধরে গুণ করলে ফলাফল নিখুঁত থাকে।',
      },
    ],
  },
];

interface MCQItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CHAPTER_MCQS: MCQItem[] = [
  {
    id: 1,
    question: 'একটি সমবাহু ত্রিভুজের ক্ষেত্রফল $16\\sqrt{3}$ বর্গ সেমি হলে এর প্রতিটি বাহুর দৈর্ঘ্য কত সেমি?',
    options: ['4 সেমি', '8 সেমি', '12 সেমি', '16 সেমি'],
    correctIndex: 1,
    explanation:
      'আমরা জানি, সমবাহু ত্রিভুজের ক্ষেত্রফল = $\\frac{\\sqrt{3}}{4} a^2$। সুতরাং $\\frac{\\sqrt{3}}{4} a^2 = 16\\sqrt{3} \\implies a^2 = 64 \\implies a = 8$ সেমি।',
  },
  {
    id: 2,
    question: 'একটি রম্বসের কর্ণদ্বয় যথাক্রমে 8 সেমি এবং 6 সেমি হলে রম্বসটির এক বাহুর দৈর্ঘ্য কত সেমি?',
    options: ['5 সেমি', '10 সেমি', '7 সেমি', '14 সেমি'],
    correctIndex: 0,
    explanation:
      'রম্বসের কর্ণদ্বয় পরস্পরকে সমকোণে সমদ্বিখণ্ডিত করে। সুতরাং গঠিত সমকোণী ত্রিভুজের বাহুদ্বয় 4 সেমি ও 3 সেমি। অতএব বাহু $a = \\sqrt{4^2 + 3^2} = \\sqrt{16+9} = 5$ সেমি।',
  },
  {
    id: 3,
    question: 'সুষম ষড়ভুজের প্রতিটি অন্তঃকোণের মান কত?',
    options: ['60°', '90°', '108°', '120°'],
    correctIndex: 3,
    explanation:
      'সুষম $n$-ভুজের প্রতিটি অন্তঃকোণ = $\\frac{(n-2) \\times 180^\\circ}{n}$। ষড়ভুজের ক্ষেত্রে $n=6$, তাই $\\frac{(6-2) \\times 180^\\circ}{6} = \\frac{4 \\times 180^\\circ}{6} = 120^\\circ$।',
  },
  {
    id: 4,
    question: 'একটি বৃত্তের ব্যাসার্ধ 7 সেমি হলে $60^\\circ$ কেন্দ্রস্থ কোণ বিশিষ্ট বৃত্তকলার ক্ষেত্রফল কত? ($\\pi = \\frac{22}{7}$)',
    options: ['25.67 বর্গ সেমি', '22 বর্গ সেমি', '26.83 বর্গ সেমি', '28.5 বর্গ সেমি'],
    correctIndex: 0,
    explanation:
      '$A = \\frac{\\theta}{360^\\circ} \\pi r^2 = \\frac{60}{360} \\times \\frac{22}{7} \\times 7^2 = \\frac{1}{6} \\times 154 = 25.67$ বর্গ সেমি।',
  },
  {
    id: 5,
    question: 'একটি ঘনকের কর্ণের দৈর্ঘ্য $4\\sqrt{3}$ সেমি হলে এর সম্পূর্ণ পৃষ্ঠের ক্ষেত্রফল কত বর্গ সেমি?',
    options: ['64', '96', '128', '144'],
    correctIndex: 1,
    explanation:
      'ঘনকের কর্ণ $d = \\sqrt{3}a = 4\\sqrt{3} \\implies a = 4$ সেমি। সম্পূর্ণ পৃষ্ঠের ক্ষেত্রফল $S = 6a^2 = 6 \\times 4^2 = 6 \\times 16 = 96$ বর্গ সেমি।',
  },
];

interface InteractiveChallenge {
  id: number;
  title: string;
  question: string;
  hint: string;
  expectedAnswer: number;
  unit: string;
  tolerance: number;
  explanation: string;
}

const CHAPTER_CHALLENGES: InteractiveChallenge[] = [
  {
    id: 1,
    title: 'চ্যালেঞ্জ ১: সমবাহু ত্রিভুজের বাহু বৃদ্ধি সমস্যা',
    question:
      'একটি সমবাহু ত্রিভুজের বাহুর দৈর্ঘ্য 2 মিটার বাড়ালে ক্ষেত্রফল $3\\sqrt{3}$ বর্গমিটার বৃদ্ধি পায়। ত্রিভুজটির আদি বাহুর দৈর্ঘ্য কত মিটার?',
    hint: 'সূত্র: $\\frac{\\sqrt{3}}{4}(a+2)^2 - \\frac{\\sqrt{3}}{4}a^2 = 3\\sqrt{3} \\implies (a+2)^2 - a^2 = 12$',
    expectedAnswer: 2,
    unit: 'মিটার',
    tolerance: 0.1,
    explanation:
      '$a^2 + 4a + 4 - a^2 = 12 \\implies 4a + 4 = 12 \\implies 4a = 8 \\implies a = 2$ মিটার।',
  },
  {
    id: 2,
    title: 'চ্যালেঞ্জ ২: রম্বসের পরিসীমা নির্ণয়',
    question:
      'একটি রম্বসের দুটি কর্ণ যথাক্রমে 16 সেমি ও 12 সেমি। রম্বসটির পরিসীমা কত সেমি?',
    hint: 'কর্ণদ্বয় সমকোণে সমদ্বিখণ্ডিত হয়: অর্ধ-কর্ণ 8 ও 6। বাহু $a = \\sqrt{8^2 + 6^2} = 10$ সেমি। পরিসীমা = $4a$।',
    expectedAnswer: 40,
    unit: 'সেমি',
    tolerance: 0.1,
    explanation:
      'বাহু $a = \\sqrt{8^2 + 6^2} = 10$ সেমি। পরিসীমা = $4 \\times 10 = 40$ সেমি।',
  },
  {
    id: 3,
    title: 'চ্যালেঞ্জ ৩: সিলিন্ডারের বক্রপৃষ্ঠের ক্ষেত্রফল',
    question:
      'একটি বেলন বা সিলিন্ডারের ভূমির ব্যাসার্ধ 7 সেমি এবং উচ্চতা 10 সেমি। এর বক্রতলের ক্ষেত্রফল কত বর্গ সেমি? ($\\pi = \\frac{22}{7}$ ধরে)',
    hint: 'সূত্র: $S_{\\text{curved}} = 2\\pi rh = 2 \\times \\frac{22}{7} \\times 7 \\times 10$',
    expectedAnswer: 440,
    unit: 'বর্গ সেমি',
    tolerance: 1,
    explanation:
      '$S = 2 \\times \\frac{22}{7} \\times 7 \\times 10 = 2 \\times 22 \\times 10 = 440$ বর্গ সেমি।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathMensurationGuidebook() {
  // Navigation
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLab, setActiveLab] = useState<number>(1);

  // Lab 1: Triangle Area States
  const [triangleType, setTriangleType] = useState<'right' | 'equilateral' | 'isosceles' | 'heron' | 'angle'>('equilateral');
  const [triA, setTriA] = useState<number>(6); // equilateral side or right base or side a
  const [triB, setTriB] = useState<number>(8); // right height or isosceles base or side b
  const [triC, setTriC] = useState<number>(7); // heron side c
  const [triTheta, setTriTheta] = useState<number>(60); // angle in deg

  // Lab 2: Quadrilateral States
  const [quadType, setQuadType] = useState<'parallelogram' | 'rhombus' | 'trapezoid'>('parallelogram');
  const [quadBase, setQuadBase] = useState<number>(12);
  const [quadHeight, setQuadHeight] = useState<number>(8);
  const [quadSideA, setQuadSideA] = useState<number>(10);
  const [quadD1, setQuadD1] = useState<number>(16);
  const [quadD2, setQuadD2] = useState<number>(12);
  const [trapA, setTrapA] = useState<number>(14);
  const [trapB, setTrapB] = useState<number>(8);
  const [trapH, setTrapH] = useState<number>(6);

  // Lab 3: Regular Polygons States
  const [polySides, setPolySides] = useState<number>(6); // 3, 4, 5, 6, 8
  const [polySideLength, setPolySideLength] = useState<number>(6);

  // Lab 4: Circle & Sector States
  const [circleRadius, setCircleRadius] = useState<number>(7);
  const [sectorTheta, setSectorTheta] = useState<number>(60);
  const [pathWidth, setPathWidth] = useState<number>(3);
  const [wheelDist, setWheelDist] = useState<number>(440);

  // Lab 5: 3D Solids States
  const [solidType, setSolidType] = useState<'cuboid' | 'cube' | 'cylinder'>('cuboid');
  const [cubLength, setCubLength] = useState<number>(8);
  const [cubWidth, setCubWidth] = useState<number>(6);
  const [cubHeight, setCubHeight] = useState<number>(4);
  const [cubeSide, setCubeSide] = useState<number>(5);
  const [cylRadius, setCylRadius] = useState<number>(7);
  const [cylHeight, setCylHeight] = useState<number>(10);

  // Interactive Challenges States
  const [challengeInputs, setChallengeInputs] = useState<{ [key: number]: string }>({});
  const [challengeResults, setChallengeResults] = useState<{ [key: number]: boolean | null }>({});

  // MCQ States
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showMCQResults, setShowMCQResults] = useState<boolean>(false);

  // Copy to clipboard
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);

  // Sheru AI Drawer
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [aiChatLog, setAiChatLog] = useState<{ sender: 'user' | 'sheru'; text: string }[]>([
    {
      sender: 'sheru',
      text: 'আসসালামু আলাইকুম! আমি শেরু — তোমার পরিমিতি (Mensuration) এআই টিউটর। ত্রিভুজ, রম্বস, ট্রাপিজিয়াম, সুষম বহুভুজ, বৃত্তকলা কিংবা ৩D সিলিন্ডার ও ঘনবস্তুর যে কোনো সমীকরণ বা সূত্রের প্রমাণ জানতে প্রশ্ন করো!',
    },
  ]);

  // Challenge Handler
  const handleCheckChallenge = (id: number) => {
    const challenge = CHAPTER_CHALLENGES.find((c) => c.id === id);
    if (!challenge) return;
    const val = parseFloat(challengeInputs[id] || '');
    if (isNaN(val)) {
      setChallengeResults((prev) => ({ ...prev, [id]: false }));
      return;
    }
    const isCorrect = Math.abs(val - challenge.expectedAnswer) <= challenge.tolerance;
    setChallengeResults((prev) => ({ ...prev, [id]: isCorrect }));
  };

  // MCQ selection
  const handleSelectMCQ = (questionId: number, optionIdx: number) => {
    if (showMCQResults) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateMCQScore = () => {
    let score = 0;
    CHAPTER_MCQS.forEach((mcq) => {
      if (userAnswers[mcq.id] === mcq.correctIndex) {
        score++;
      }
    });
    return score;
  };

  // Copy Summary
  const handleCopySummary = () => {
    const text = `NCTB Class 9-10 General Math - Chapter 16 Mensuration Formulas:
1. সমবাহু ত্রিভুজ: Area = (√3/4)a², সমদ্বিবাহু: Area = (b/4)√(4a² - b²)
2. বিষমবাহু (হেরন): s = (a+b+c)/2, Area = √[s(s-a)(s-b)(s-c)]
3. দুই বাহু ও কোণ: Area = (1/2)ab sin θ
4. সামান্তরিক: Area = bh = ab sin θ, রম্বস: Area = (1/2)d₁d₂, ট্রাপিজিয়াম: Area = (1/2)(a+b)h
5. সুষম বহুভুজ: Area = (n a²/4) cot(180°/n), অন্তঃকোণ = ((n-2)×180°)/n
6. বৃত্ত: পরিধি = 2πr, ক্ষেত্রফল = πr², চাপ s = πrθ/180°, বৃত্তকলা = (θ/360°)πr² = (1/2)sr
7. ঘনবস্তু: আয়তন = abc, সমগ্রতল = 2(ab+bc+ca), কর্ণ = √(a²+b²+c²)
8. ঘনক: V = a³, S = 6a², d = √3 a
9. সিলিন্ডার: V = πr²h, বক্রতল = 2πrh, সমগ্রতল = 2πr(r+h)`;
    navigator.clipboard.writeText(text);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2500);
  };

  // AI Ask
  const handleSendAiMessage = () => {
    if (!aiMessage.trim()) return;
    const userText = aiMessage.trim();
    setAiChatLog((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiMessage('');

    setTimeout(() => {
      let reply = 'পরিমিতির এই সমস্যাটি চমৎকার! ';
      if (userText.includes('সমবাহু') || userText.includes('equilateral')) {
        reply +=
          'সমবাহু ত্রিভুজের ক্ষেত্রফল সূত্র $\\frac{\\sqrt{3}}{4} a^2$ আসে উচ্চতা $h = a \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}a$ এবং ক্ষেত্রফল $= \\frac{1}{2} \\times a \\times h = \\frac{\\sqrt{3}}{4}a^2$ থেকে। বাহু 2 মিটার বাড়ালে $(a+2)^2 - a^2$ হিসাব করে পার্থক্য সমাধান করা যায়!';
      } else if (userText.includes('ট্রাপিজিয়াম') || userText.includes('trapezoid')) {
        reply +=
          'ট্রাপিজিয়ামের সমান্তরাল বাহুদ্বয় $a, b$ ও তীর্যক বাহুদ্বয় জানা থাকলে, তীর্যক বাহুর সমান্তরাল রেখা টেনে একটি সামান্তরিক ও একটি ত্রিভুজ গঠন করো। ত্রিভুজের তিন বাহু থেকে হেরনের সূত্রে ক্ষেত্রফল বের করে উচ্চতা $h$ বের করো, তারপর $\\frac{1}{2}(a+b)h$ প্রয়োগ করো!';
      } else if (userText.includes('বৃত্তকলা') || userText.includes('চাপ') || userText.includes('চাকা')) {
        reply +=
          'বৃত্তকলার ক্ষেত্রফল $A = \\frac{\\theta}{360^\\circ}\\pi r^2$ আসলে পুরো বৃত্তের $\\frac{\\theta}{360^\\circ}$ অংশ। আবার চাপ $s = \\frac{\\theta}{360^\\circ} \\times 2\\pi r$ হওয়ায় $A = \\frac{1}{2}sr$ লেখা যায়। চাকার ঘূর্ণন সংখ্যা $N = \\frac{D}{2\\pi r}$।';
      } else if (userText.includes('সিলিন্ডার') || userText.includes('ঘনবস্তু') || userText.includes('কর্ণ')) {
        reply +=
          'আয়তাকার ঘনবস্তুর কর্ণ $d = \\sqrt{a^2+b^2+c^2}$ আসে ত্রিমাত্রিক পিথাগোরাস উপপাদ্য থেকে: ভূমির কর্ণ $\\sqrt{a^2+b^2}$, তারপর উচ্চতা $c$ যুক্ত করলে $\\sqrt{(\\sqrt{a^2+b^2})^2 + c^2} = \\sqrt{a^2+b^2+c^2}$। সিলিন্ডারের বক্রতল $2\\pi rh$ হলো ভূমির পরিধি গুণ উচ্চতা!';
      } else {
        reply +=
          'পরিমিতির অঙ্ক সমাধান করতে সবসময় একক (মিটার, সেমি, বর্গমিটার, ঘনমিটার) খেয়াল রাখবে এবং সূত্রের উপপত্তি মনে রাখলে কখনো মুখস্থ নির্ভর হতে হবে না!';
      }
      setAiChatLog((prev) => [...prev, { sender: 'sheru', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="math"
        subjectNameBn="সাধারণ গণিত"
        chapterNum={16}
        chapterTitleBn="পরিমিতি (Mensuration)"
        activeLesson={activeLab}
        activeLessonTitle={LAB_LESSONS[activeLab - 1]?.title}
        onOpenAi={() => setIsAiDrawerOpen(true)}
        aiButtonLabel="শেরু এআই টিউটর"
      />

      {/* 5-Step Learning Framework Navigation Sub-Bar */}
      <div className="border-b border-border bg-card/90 backdrop-blur-md sticky top-[49px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-medium overflow-x-auto w-fit">
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
              <Layers className="w-3.5 h-3.5" />
              <span>৫. সারসংক্ষেপ</span>
            </button>
          </nav>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* STEP 1: LEARN CONCEPT (5 INTERACTIVE LABS) */}
        {activeStep === 1 && (
          <div className="space-y-6">
            {/* Lab Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              {LAB_LESSONS.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setActiveLab(lab.id)}
                  className={`flex flex-col items-start p-3 rounded-xl text-left transition-all ${
                    activeLab === lab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 ${
                      activeLab === lab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-primary/10 text-primary dark:bg-primary/20'
                    }`}
                  >
                    {lab.badge}
                  </span>
                  <span className="text-xs font-bold line-clamp-1">{lab.title}</span>
                </button>
              ))}
            </div>

            {/* Current Lab Header */}
            {(() => {
              const curLab = LAB_LESSONS.find((l) => l.id === activeLab) || LAB_LESSONS[0];
              return (
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {curLab.badge}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {curLab.nctbPage}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 italic">
                      ইন্টারেক্টিভ সিমুলেটর
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {curLab.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-2 font-mono">
                    {curLab.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <RenderMathText text={curLab.intro} />
                  </p>
                </div>
              );
            })()}

            {/* ============================================================= */}
            {/* LAB 1: TRIANGLE AREA MASTER LAB (16.1) */}
            {/* ============================================================= */}
            {activeLab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Controls Card */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    ত্রিভুজের ধরণ ও পরিমাপ নির্বাচন
                  </h3>

                  {/* Triangle Type Selector */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'equilateral', label: 'সমবাহু ত্রিভুজ' },
                      { id: 'right', label: 'সমকোণী ত্রিভুজ' },
                      { id: 'isosceles', label: 'সমদ্বিবাহু ত্রিভুজ' },
                      { id: 'heron', label: 'বিষমবাহু (হেরন)' },
                      { id: 'angle', label: 'দুই বাহু ও কোণ' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTriangleType(t.id as any)}
                        className={`p-2 rounded-lg text-left font-medium transition-colors border ${
                          triangleType === t.id
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {triangleType === 'equilateral' && (
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>প্রতিটি বাহু (a):</span>
                          <span className="font-bold text-primary">{triA} সেমি</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="16"
                          step="1"
                          value={triA}
                          onChange={(e) => setTriA(parseFloat(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    )}

                    {triangleType === 'right' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>ভূমি (b):</span>
                            <span className="font-bold text-primary">{triA} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="16"
                            step="1"
                            value={triA}
                            onChange={(e) => setTriA(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>উচ্চতা (h):</span>
                            <span className="font-bold text-primary">{triB} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="16"
                            step="1"
                            value={triB}
                            onChange={(e) => setTriB(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}

                    {triangleType === 'isosceles' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>সমান সমান বাহু (a):</span>
                            <span className="font-bold text-primary">{triA} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="16"
                            step="1"
                            value={triA}
                            onChange={(e) => setTriA(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>ভূমি (b):</span>
                            <span className="font-bold text-primary">{triB} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max={Math.min(20, 2 * triA - 1)}
                            step="1"
                            value={triB}
                            onChange={(e) => setTriB(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            শর্ত: $2a &gt; b$ (বর্তমানে $2 \\times {triA} = {2 * triA} &gt; {triB}$)
                          </p>
                        </div>
                      </>
                    )}

                    {triangleType === 'heron' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>বাহু a:</span>
                            <span className="font-bold text-primary">{triA} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="14"
                            value={triA}
                            onChange={(e) => setTriA(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>বাহু b:</span>
                            <span className="font-bold text-primary">{triB} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="14"
                            value={triB}
                            onChange={(e) => setTriB(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>বাহু c:</span>
                            <span className="font-bold text-primary">{triC} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="14"
                            value={triC}
                            onChange={(e) => setTriC(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}

                    {triangleType === 'angle' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>বাহু a:</span>
                            <span className="font-bold text-primary">{triA} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="16"
                            value={triA}
                            onChange={(e) => setTriA(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>বাহু b:</span>
                            <span className="font-bold text-primary">{triB} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="16"
                            value={triB}
                            onChange={(e) => setTriB(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>অন্তর্ভুক্ত কোণ (θ):</span>
                            <span className="font-bold text-primary">{triTheta}°</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="150"
                            step="5"
                            value={triTheta}
                            onChange={(e) => setTriTheta(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* SVG Visualizer & Calculation Card */}
                <div className="lg:col-span-7 space-y-4">
                  {/* SVG Drawing */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
                    <svg viewBox="0 0 360 220" className="w-full max-w-md h-52 overflow-visible">
                      <defs>
                        <linearGradient id="triGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {/* Render Triangle depending on type */}
                      {triangleType === 'equilateral' && (() => {
                        const sidePx = Math.min(220, triA * 15);
                        const hPx = (Math.sqrt(3) / 2) * sidePx;
                        const p1 = { x: 180, y: 190 - hPx };
                        const p2 = { x: 180 - sidePx / 2, y: 190 };
                        const p3 = { x: 180 + sidePx / 2, y: 190 };
                        return (
                          <g>
                            <polygon
                              points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                              fill="url(#triGrad)"
                              stroke="#4f46e5"
                              strokeWidth="2.5"
                            />
                            <line
                              x1={p1.x}
                              y1={p1.y}
                              x2={p1.x}
                              y2={190}
                              stroke="#ec4899"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                            <text x={185} y={190 - hPx / 2} fill="#ec4899" fontSize="10" fontWeight="bold">
                              h = {( (Math.sqrt(3)/2)*triA ).toFixed(2)} cm
                            </text>
                            <text x={p2.x - 12} y={195} fill="#64748b" fontSize="11" fontWeight="bold">B</text>
                            <text x={p3.x + 5} y={195} fill="#64748b" fontSize="11" fontWeight="bold">C</text>
                            <text x={p1.x} y={p1.y - 8} fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
                            <text x="180" y="210" fill="#4f46e5" fontSize="11" fontWeight="bold" textAnchor="middle">
                              a = {triA} সেমি
                            </text>
                          </g>
                        );
                      })()}

                      {triangleType === 'right' && (() => {
                        const bPx = Math.min(200, triA * 12);
                        const hPx = Math.min(140, triB * 10);
                        const pA = { x: 80, y: 190 - hPx };
                        const pB = { x: 80, y: 190 };
                        const pC = { x: 80 + bPx, y: 190 };
                        const hyp = Math.sqrt(triA * triA + triB * triB);
                        return (
                          <g>
                            <polygon
                              points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`}
                              fill="url(#triGrad)"
                              stroke="#4f46e5"
                              strokeWidth="2.5"
                            />
                            {/* Right angle marker */}
                            <path
                              d={`M ${pB.x} ${pB.y - 12} L ${pB.x + 12} ${pB.y - 12} L ${pB.x + 12} ${pB.y}`}
                              fill="none"
                              stroke="#4f46e5"
                              strokeWidth="1.5"
                            />
                            <text x={pA.x} y={pA.y - 8} fill="#64748b" fontSize="11" fontWeight="bold">A</text>
                            <text x={pB.x - 15} y={195} fill="#64748b" fontSize="11" fontWeight="bold">B</text>
                            <text x={pC.x + 5} y={195} fill="#64748b" fontSize="11" fontWeight="bold">C</text>
                            <text x={pB.x - 20} y={pB.y - hPx / 2} fill="#ec4899" fontSize="10" fontWeight="bold">
                              h = {triB} cm
                            </text>
                            <text x={pB.x + bPx / 2} y="208" fill="#4f46e5" fontSize="10" fontWeight="bold" textAnchor="middle">
                              b = {triA} cm
                            </text>
                            <text x={pB.x + bPx / 2 + 10} y={pB.y - hPx / 2} fill="#10b981" fontSize="10" fontWeight="bold">
                              অতিভুজ = {hyp.toFixed(2)} cm
                            </text>
                          </g>
                        );
                      })()}

                      {triangleType === 'isosceles' && (() => {
                        const bPx = Math.min(220, triB * 12);
                        const h = Math.sqrt(Math.max(1, 4 * triA * triA - triB * triB)) / 2;
                        const hPx = Math.min(140, h * 12);
                        const pA = { x: 180, y: 190 - hPx };
                        const pB = { x: 180 - bPx / 2, y: 190 };
                        const pC = { x: 180 + bPx / 2, y: 190 };
                        return (
                          <g>
                            <polygon
                              points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y}`}
                              fill="url(#triGrad)"
                              stroke="#4f46e5"
                              strokeWidth="2.5"
                            />
                            <line
                              x1={pA.x}
                              y1={pA.y}
                              x2={pA.x}
                              y2={190}
                              stroke="#ec4899"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                            <text x="185" y={190 - hPx / 2} fill="#ec4899" fontSize="10" fontWeight="bold">
                              h = {h.toFixed(2)} cm
                            </text>
                            <text x={pB.x - 12} y={195} fill="#64748b" fontSize="11" fontWeight="bold">B</text>
                            <text x={pC.x + 5} y={195} fill="#64748b" fontSize="11" fontWeight="bold">C</text>
                            <text x={pA.x} y={pA.y - 8} fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
                            <text x={180 - bPx / 4 - 20} y={190 - hPx / 2} fill="#4f46e5" fontSize="10" fontWeight="bold">
                              a = {triA}
                            </text>
                            <text x={180 + bPx / 4 + 5} y={190 - hPx / 2} fill="#4f46e5" fontSize="10" fontWeight="bold">
                              a = {triA}
                            </text>
                            <text x="180" y="210" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
                              ভূমি b = {triB} cm
                            </text>
                          </g>
                        );
                      })()}

                      {triangleType === 'heron' && (() => {
                        const a = triA, b = triB, c = triC;
                        const s = (a + b + c) / 2;
                        const isValid = s > a && s > b && s > c;
                        return (
                          <g>
                            <polygon
                              points="60,180 300,180 180,50"
                              fill="url(#triGrad)"
                              stroke="#4f46e5"
                              strokeWidth="2.5"
                            />
                            <text x="180" y="40" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
                            <text x="50" y="185" fill="#64748b" fontSize="11" fontWeight="bold">B</text>
                            <text x="305" y="185" fill="#64748b" fontSize="11" fontWeight="bold">C</text>
                            <text x="180" y="200" fill="#4f46e5" fontSize="10" fontWeight="bold" textAnchor="middle">
                              বাহু a = {a} cm
                            </text>
                            <text x="100" y="110" fill="#ec4899" fontSize="10" fontWeight="bold">
                              c = {c} cm
                            </text>
                            <text x="250" y="110" fill="#10b981" fontSize="10" fontWeight="bold">
                              b = {b} cm
                            </text>
                            {!isValid && (
                              <text x="180" y="120" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">
                                ত্রিভুজ গঠন সম্ভব নয় ($a+b \le c$)
                              </text>
                            )}
                          </g>
                        );
                      })()}

                      {triangleType === 'angle' && (() => {
                        const rad = (triTheta * Math.PI) / 180;
                        const bx = 220;
                        const ax = 80 + 130 * Math.cos(rad);
                        const ay = 180 - 130 * Math.sin(rad);
                        return (
                          <g>
                            <polygon
                              points={`80,180 ${80 + bx},180 ${ax},${ay}`}
                              fill="url(#triGrad)"
                              stroke="#4f46e5"
                              strokeWidth="2.5"
                            />
                            {/* Angle arc */}
                            <path
                              d={`M 110 180 A 30 30 0 0 0 ${80 + 30 * Math.cos(rad)} ${180 - 30 * Math.sin(rad)}`}
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="2"
                            />
                            <text x="115" y="172" fill="#f59e0b" fontSize="10" fontWeight="bold">
                              θ = {triTheta}°
                            </text>
                            <text x="180" y="200" fill="#4f46e5" fontSize="10" fontWeight="bold" textAnchor="middle">
                              বাহু a = {triA} cm
                            </text>
                            <text x={ax - 20} y={ay + 20} fill="#ec4899" fontSize="10" fontWeight="bold">
                              b = {triB} cm
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Formula Execution Card */}
                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-amber-400">ক্ষেত্রফল পরিমাপ ফলাফল</span>
                      <span className="font-mono text-slate-400">বর্গ সেন্টিমিটার (cm²)</span>
                    </div>

                    {triangleType === 'equilateral' && (() => {
                      const area = (Math.sqrt(3) / 4) * triA * triA;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            সূত্র: <code className="text-emerald-400">Δ = (√3/4) × a²</code>
                          </p>
                          <p className="text-slate-400">
                            গণনা: <code className="text-white">(√3/4) × ({triA})² = (1.732 / 4) × {triA * triA}</code>
                          </p>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            ক্ষেত্রফল = {area.toFixed(3)} বর্গ সেমি (প্রায়)
                          </div>
                        </div>
                      );
                    })()}

                    {triangleType === 'right' && (() => {
                      const area = 0.5 * triA * triB;
                      const hyp = Math.sqrt(triA * triA + triB * triB);
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            সূত্র: <code className="text-emerald-400">Δ = ½ × ভূমি × উচ্চতা</code>
                          </p>
                          <p className="text-slate-400">
                            গণনা: <code className="text-white">½ × {triA} × {triB}</code> | অতিভুজ = {hyp.toFixed(2)} সেমি
                          </p>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            ক্ষেত্রফল = {area.toFixed(2)} বর্গ সেমি
                          </div>
                        </div>
                      );
                    })()}

                    {triangleType === 'isosceles' && (() => {
                      const term = 4 * triA * triA - triB * triB;
                      const isValid = term > 0;
                      const area = isValid ? (triB / 4) * Math.sqrt(term) : 0;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            সূত্র: <code className="text-emerald-400">Δ = (b/4)√(4a² - b²)</code>
                          </p>
                          <p className="text-slate-400">
                            গণনা: <code className="text-white">({triB}/4)√(4×{triA}² - {triB}²) = ({triB}/4)√({term})</code>
                          </p>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            {isValid
                              ? `ক্ষেত্রফল = ${area.toFixed(3)} বর্গ সেমি (প্রায়)`
                              : 'অবৈধ ত্রিভুজ (2a > b শর্ত ভঙ্গ)'}
                          </div>
                        </div>
                      );
                    })()}

                    {triangleType === 'heron' && (() => {
                      const a = triA, b = triB, c = triC;
                      const s = (a + b + c) / 2;
                      const prod = s * (s - a) * (s - b) * (s - c);
                      const isValid = prod > 0;
                      const area = isValid ? Math.sqrt(prod) : 0;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            হেরনের সূত্র: <code className="text-emerald-400">s = (a+b+c)/2</code> ও <code className="text-emerald-400">Δ = √[s(s-a)(s-b)(s-c)]</code>
                          </p>
                          <p className="text-slate-400">
                            অর্ধ-পরিসীমা $s$: <code className="text-white">({a}+{b}+{c})/2 = {s}</code> সেমি
                          </p>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            {isValid
                              ? `ক্ষেত্রফল = ${area.toFixed(3)} বর্গ সেমি`
                              : 'ত্রিভুজের অসমতা শর্ত পূরণ হয়নি ($a+b \\le c$)'}
                          </div>
                        </div>
                      );
                    })()}

                    {triangleType === 'angle' && (() => {
                      const rad = (triTheta * Math.PI) / 180;
                      const sinVal = Math.sin(rad);
                      const area = 0.5 * triA * triB * sinVal;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            সূত্র: <code className="text-emerald-400">Δ = ½ ab sin θ</code>
                          </p>
                          <p className="text-slate-400">
                            গণনা: <code className="text-white">½ × {triA} × {triB} × sin({triTheta}°) = {0.5 * triA * triB} × {sinVal.toFixed(4)}</code>
                          </p>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            ক্ষেত্রফল = {area.toFixed(3)} বর্গ সেমি
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* LAB 2: QUADRILATERALS & TRAPEZOID SIMULATOR (16.2) */}
            {/* ============================================================= */}
            {activeLab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shapes className="w-4 h-4 text-primary" />
                    চতুর্ভুজের ধরণ নির্বাচন
                  </h3>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'parallelogram', label: 'সামান্তরিক' },
                      { id: 'rhombus', label: 'রম্বস' },
                      { id: 'trapezoid', label: 'ট্রাপিজিয়াম' },
                    ].map((q) => (
                      <button
                        key={q.id}
                        onClick={() => setQuadType(q.id as any)}
                        className={`p-2 rounded-lg text-center font-medium transition-colors border ${
                          quadType === q.id
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {quadType === 'parallelogram' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>ভূমি (b):</span>
                            <span className="font-bold text-primary">{quadBase} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="6"
                            max="20"
                            value={quadBase}
                            onChange={(e) => setQuadBase(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>উচ্চতা (h):</span>
                            <span className="font-bold text-primary">{quadHeight} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="14"
                            value={quadHeight}
                            onChange={(e) => setQuadHeight(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}

                    {quadType === 'rhombus' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>কর্ণ ১ (d₁):</span>
                            <span className="font-bold text-primary">{quadD1} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="6"
                            max="24"
                            value={quadD1}
                            onChange={(e) => setQuadD1(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>কর্ণ ২ (d₂):</span>
                            <span className="font-bold text-primary">{quadD2} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="6"
                            max="20"
                            value={quadD2}
                            onChange={(e) => setQuadD2(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}

                    {quadType === 'trapezoid' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>সমান্তরাল বাহু ১ (a):</span>
                            <span className="font-bold text-primary">{trapA} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="24"
                            value={trapA}
                            onChange={(e) => setTrapA(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>সমান্তরাল বাহু ২ (b):</span>
                            <span className="font-bold text-primary">{trapB} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="16"
                            value={trapB}
                            onChange={(e) => setTrapB(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>উচ্চতা (h):</span>
                            <span className="font-bold text-primary">{trapH} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="14"
                            value={trapH}
                            onChange={(e) => setTrapH(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
                    <svg viewBox="0 0 360 220" className="w-full max-w-md h-52 overflow-visible">
                      <defs>
                        <linearGradient id="quadGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {quadType === 'parallelogram' && (() => {
                        const bPx = Math.min(200, quadBase * 10);
                        const hPx = Math.min(120, quadHeight * 9);
                        const tilt = 35;
                        const pA = { x: 80, y: 180 };
                        const pB = { x: 80 + bPx, y: 180 };
                        const pC = { x: 80 + bPx + tilt, y: 180 - hPx };
                        const pD = { x: 80 + tilt, y: 180 - hPx };
                        return (
                          <g>
                            <polygon
                              points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y} ${pD.x},${pD.y}`}
                              fill="url(#quadGrad)"
                              stroke="#0284c7"
                              strokeWidth="2.5"
                            />
                            {/* Altitude line */}
                            <line
                              x1={pD.x}
                              y1={pD.y}
                              x2={pD.x}
                              y2={180}
                              stroke="#ef4444"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                            <text x={pD.x - 15} y={180 - hPx / 2} fill="#ef4444" fontSize="10" fontWeight="bold">
                              h = {quadHeight}
                            </text>
                            <text x={pA.x + bPx / 2} y="200" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="middle">
                              ভূমি b = {quadBase} সেমি
                            </text>
                          </g>
                        );
                      })()}

                      {quadType === 'rhombus' && (() => {
                        const d1Px = Math.min(220, quadD1 * 9);
                        const d2Px = Math.min(150, quadD2 * 8);
                        const cx = 180, cy = 110;
                        const pTop = { x: cx, y: cy - d2Px / 2 };
                        const pBottom = { x: cx, y: cy + d2Px / 2 };
                        const pLeft = { x: cx - d1Px / 2, y: cy };
                        const pRight = { x: cx + d1Px / 2, y: cy };
                        return (
                          <g>
                            <polygon
                              points={`${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`}
                              fill="url(#quadGrad)"
                              stroke="#0284c7"
                              strokeWidth="2.5"
                            />
                            {/* Diagonals */}
                            <line
                              x1={pLeft.x}
                              y1={pLeft.y}
                              x2={pRight.x}
                              y2={pRight.y}
                              stroke="#f59e0b"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                            <line
                              x1={pTop.x}
                              y1={pTop.y}
                              x2={pBottom.x}
                              y2={pBottom.y}
                              stroke="#10b981"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                            <text x={cx + 10} y={cy - 10} fill="#64748b" fontSize="9" fontWeight="bold">90°</text>
                            <text x={cx} y={pBottom.y + 20} fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                              d₁ = {quadD1} সেমি (অনুভূমিক কর্ণ)
                            </text>
                            <text x={pLeft.x - 10} y={cy} fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="end">
                              d₂ = {quadD2} সেমি
                            </text>
                          </g>
                        );
                      })()}

                      {quadType === 'trapezoid' && (() => {
                        const aPx = Math.min(220, trapA * 9);
                        const bPx = Math.min(160, trapB * 9);
                        const hPx = Math.min(110, trapH * 9);
                        const cx = 180;
                        const pA = { x: cx - aPx / 2, y: 175 };
                        const pB = { x: cx + aPx / 2, y: 175 };
                        const pC = { x: cx + bPx / 2, y: 175 - hPx };
                        const pD = { x: cx - bPx / 2, y: 175 - hPx };
                        return (
                          <g>
                            <polygon
                              points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y} ${pD.x},${pD.y}`}
                              fill="url(#quadGrad)"
                              stroke="#0284c7"
                              strokeWidth="2.5"
                            />
                            {/* Altitude */}
                            <line
                              x1={pD.x}
                              y1={pD.y}
                              x2={pD.x}
                              y2={175}
                              stroke="#ef4444"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                            <text x={pD.x - 12} y={175 - hPx / 2} fill="#ef4444" fontSize="10" fontWeight="bold">
                              h = {trapH}
                            </text>
                            <text x={cx} y={pD.y - 8} fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                              b = {trapB} সেমি
                            </text>
                            <text x={cx} y="195" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="middle">
                              a = {trapA} সেমি
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-sky-400">চতুর্ভুজ ফলাফল বিশ্লেষণ</span>
                      <span className="font-mono text-slate-400">পরিমাপ সমীকরণ</span>
                    </div>

                    {quadType === 'parallelogram' && (() => {
                      const area = quadBase * quadHeight;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            ক্ষেত্রফল সূত্র: <code className="text-emerald-400">Area = ভূমি (b) × উচ্চতা (h)</code>
                          </p>
                          <p className="text-slate-400">
                            গণনা: <code className="text-white">{quadBase} × {quadHeight}</code>
                          </p>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            ক্ষেত্রফল = {area} বর্গ সেমি
                          </div>
                        </div>
                      );
                    })()}

                    {quadType === 'rhombus' && (() => {
                      const area = 0.5 * quadD1 * quadD2;
                      const side = Math.sqrt((quadD1 / 2) ** 2 + (quadD2 / 2) ** 2);
                      const perimeter = 4 * side;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            ক্ষেত্রফল সূত্র: <code className="text-emerald-400">Area = ½ × d₁ × d₂</code>
                          </p>
                          <p className="text-slate-400">
                            বাহুর দৈর্ঘ্য: <code className="text-white">a = √[(d₁/2)² + (d₂/2)²] = √[{quadD1 / 2}² + {quadD2 / 2}²] = {side.toFixed(2)} সেমি</code>
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <div className="text-base font-bold text-emerald-400">
                              ক্ষেত্রফল = {area} বর্গ সেমি
                            </div>
                            <div className="text-sm font-semibold text-amber-300">
                              পরিসীমা = {perimeter.toFixed(2)} সেমি
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {quadType === 'trapezoid' && (() => {
                      const area = 0.5 * (trapA + trapB) * trapH;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-slate-300">
                            ক্ষেত্রফল সূত্র: <code className="text-emerald-400">Area = ½ × (a + b) × h</code>
                          </p>
                          <p className="text-slate-400">
                            গণনা: <code className="text-white">½ × ({trapA} + {trapB}) × {trapH} = ½ × {trapA + trapB} × {trapH}</code>
                          </p>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            ক্ষেত্রফল = {area} বর্গ সেমি
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* LAB 3: REGULAR POLYGONS LAB (16.2) */}
            {/* ============================================================= */}
            {activeLab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-primary" />
                    সুষম বহুভুজ কনফিগারেশন
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      বাহুর সংখ্যা ($n$):
                    </label>
                    <div className="grid grid-cols-5 gap-1 text-xs">
                      {[
                        { n: 3, label: 'ত্রিভুজ' },
                        { n: 4, label: 'বর্গ' },
                        { n: 5, label: 'পঞ্চভুজ' },
                        { n: 6, label: 'ষড়ভুজ' },
                        { n: 8, label: 'অষ্টভুজ' },
                      ].map((item) => (
                        <button
                          key={item.n}
                          onClick={() => setPolySides(item.n)}
                          className={`p-2 rounded-lg text-center font-bold transition-all border ${
                            polySides === item.n
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div>n={item.n}</div>
                          <div className="text-[10px] font-normal">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span>প্রতিটি বাহুর দৈর্ঘ্য (a):</span>
                      <span className="font-bold text-primary">{polySideLength} সেমি</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="14"
                      step="1"
                      value={polySideLength}
                      onChange={(e) => setPolySideLength(parseFloat(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      NCTB জ্যামিতিক বৈশিষ্ট্য
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      <RenderMathText text="সুষম বহুভুজের কেন্দ্রে প্রতিটি বাহু সমদ্বিবাহু ত্রিভুজ উৎপন্ন করে। শীর্ষকোণ $= \frac{360^\circ}{n}$ এবং প্রতিটি অন্তঃকোণ $= \frac{(n-2) \times 180^\circ}{n}$।" />
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
                    <svg viewBox="0 0 360 220" className="w-full max-w-md h-52 overflow-visible">
                      <defs>
                        <linearGradient id="polyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {(() => {
                        const n = polySides;
                        const R = Math.min(85, polySideLength * 8 + 20);
                        const cx = 180, cy = 110;
                        const points: { x: number; y: number }[] = [];
                        for (let i = 0; i < n; i++) {
                          const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
                          points.push({
                            x: cx + R * Math.cos(angle),
                            y: cy + R * Math.sin(angle),
                          });
                        }
                        const ptsStr = points.map((p) => `${p.x},${p.y}`).join(' ');

                        return (
                          <g>
                            <polygon
                              points={ptsStr}
                              fill="url(#polyGrad)"
                              stroke="#8b5cf6"
                              strokeWidth="2.5"
                            />
                            {/* Spokes to center */}
                            {points.map((p, idx) => (
                              <line
                                key={idx}
                                x1={cx}
                                y1={cy}
                                x2={p.x}
                                y2={p.y}
                                stroke="#c4b5fd"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                              />
                            ))}
                            {/* Center point */}
                            <circle cx={cx} cy={cy} r="3" fill="#8b5cf6" />
                            <text x={cx + 8} y={cy - 4} fill="#8b5cf6" fontSize="10" fontWeight="bold">O</text>
                            {/* Side length indicator on first segment */}
                            <text
                              x={(points[0].x + points[1].x) / 2 + 10}
                              y={(points[0].y + points[1].y) / 2}
                              fill="#ec4899"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              a = {polySideLength} cm
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-purple-400">সুষম বহুভুজের কোণ ও ক্ষেত্রফল গণনা</span>
                      <span className="font-mono text-slate-400">n = {polySides}</span>
                    </div>

                    {(() => {
                      const n = polySides;
                      const a = polySideLength;
                      const cotVal = 1 / Math.tan((Math.PI) / n);
                      const area = (n * a * a / 4) * cotVal;
                      const centralAngle = 360 / n;
                      const interiorAngle = ((n - 2) * 180) / n;
                      const apothem = (a / 2) * cotVal;
                      return (
                        <div className="space-y-2 pt-1">
                          <p className="text-slate-300">
                            ক্ষেত্রফল সূত্র: <code className="text-emerald-400">Area = (n a² / 4) cot(180° / n)</code>
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                            <div>
                              <span className="text-slate-400">কেন্দ্রস্থ কোণ:</span>{' '}
                              <strong className="text-amber-400">{centralAngle.toFixed(1)}°</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">প্রতিটি অন্তঃকোণ:</span>{' '}
                              <strong className="text-amber-400">{interiorAngle.toFixed(1)}°</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">অপোথেম (অন্তর্ব্যাসার্ধ):</span>{' '}
                              <strong className="text-white">{apothem.toFixed(2)} সেমি</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">পরিসীমা (na):</span>{' '}
                              <strong className="text-white">{n * a} সেমি</strong>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-emerald-400 pt-1">
                            ক্ষেত্রফল = {area.toFixed(3)} বর্গ সেমি (প্রায়)
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* LAB 4: CIRCLE & SECTOR LAB (16.3) */}
            {/* ============================================================= */}
            {activeLab === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Circle className="w-4 h-4 text-primary" />
                    বৃত্ত ও বৃত্তকলা প্যারামিটার
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-medium mb-1">
                        <span>ব্যাসার্ধ (r):</span>
                        <span className="font-bold text-primary">{circleRadius} সেমি</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="15"
                        step="1"
                        value={circleRadius}
                        onChange={(e) => setCircleRadius(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-medium mb-1">
                        <span>বৃত্তকলার কেন্দ্রস্থ কোণ (θ):</span>
                        <span className="font-bold text-primary">{sectorTheta}°</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="330"
                        step="15"
                        value={sectorTheta}
                        onChange={(e) => setSectorTheta(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-medium mb-1">
                        <span>বৃত্তাকার পথের বিস্তার (w):</span>
                        <span className="font-bold text-primary">{pathWidth} সেমি</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={pathWidth}
                        onChange={(e) => setPathWidth(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-medium mb-1">
                        <span>চাকার অতিক্রান্ত দূরত্ব (D):</span>
                        <span className="font-bold text-primary">{wheelDist} মিটার</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="20"
                        value={wheelDist}
                        onChange={(e) => setWheelDist(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
                    <svg viewBox="0 0 360 220" className="w-full max-w-md h-52 overflow-visible">
                      {(() => {
                        const cx = 180, cy = 110;
                        const rPx = Math.min(65, circleRadius * 5 + 15);
                        const wPx = Math.min(25, pathWidth * 3.5);
                        const outerRPx = rPx + wPx;

                        // Sector path
                        const startAngle = 0;
                        const endAngle = (sectorTheta * Math.PI) / 180;
                        const x1 = cx + rPx * Math.cos(startAngle);
                        const y1 = cy + rPx * Math.sin(startAngle);
                        const x2 = cx + rPx * Math.cos(endAngle);
                        const y2 = cy + rPx * Math.sin(endAngle);
                        const largeArc = sectorTheta > 180 ? 1 : 0;

                        return (
                          <g>
                            {/* Outer pathway ring */}
                            <circle
                              cx={cx}
                              cy={cy}
                              r={outerRPx}
                              fill="none"
                              stroke="#cbd5e1"
                              strokeWidth={wPx}
                              opacity="0.6"
                            />
                            {/* Inner Circle base */}
                            <circle
                              cx={cx}
                              cy={cy}
                              r={rPx}
                              fill="#f1f5f9"
                              stroke="#64748b"
                              strokeWidth="1.5"
                            />
                            {/* Sector Wedge */}
                            <path
                              d={`M ${cx} ${cy} L ${x1} ${y1} A ${rPx} ${rPx} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill="#3b82f6"
                              fillOpacity="0.35"
                              stroke="#2563eb"
                              strokeWidth="2"
                            />
                            {/* Arc highlight */}
                            <path
                              d={`M ${x1} ${y1} A ${rPx} ${rPx} 0 ${largeArc} 1 ${x2} ${y2}`}
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="3"
                            />
                            {/* Center Dot */}
                            <circle cx={cx} cy={cy} r="3" fill="#2563eb" />
                            {/* Radius line */}
                            <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="#2563eb" strokeWidth="2" />
                            <text x={cx + rPx / 2} y={cy - 5} fill="#2563eb" fontSize="10" fontWeight="bold">
                              r = {circleRadius}
                            </text>
                            <text x={cx} y={cy + 15} fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                              θ = {sectorTheta}°
                            </text>
                            <text x={x2 + 8} y={y2} fill="#ef4444" fontSize="10" fontWeight="bold">
                              চাপ s
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-blue-400">বৃত্ত ও বৃত্তকলা ফলাফল</span>
                      <span className="font-mono text-slate-400">π ≈ 3.1416</span>
                    </div>

                    {(() => {
                      const r = circleRadius;
                      const theta = sectorTheta;
                      const R = r + pathWidth;
                      const circumference = 2 * Math.PI * r;
                      const circleArea = Math.PI * r * r;
                      const arcLength = (Math.PI * r * theta) / 180;
                      const sectorArea = (theta / 360) * circleArea;
                      const pathArea = Math.PI * (R * R - r * r);
                      // Wheel revs: r in cm -> r in m = r/100
                      const rMeter = r / 100;
                      const wheelCircMeter = 2 * Math.PI * rMeter;
                      const revs = wheelDist / wheelCircMeter;

                      return (
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-2 gap-2 text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                            <div>
                              <span className="text-slate-400">পরিধি (2πr):</span>{' '}
                              <strong className="text-white">{circumference.toFixed(2)} সেমি</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">ক্ষেত্রফল (πr²):</span>{' '}
                              <strong className="text-white">{circleArea.toFixed(2)} cm²</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">চাপের দৈর্ঘ্য (s):</span>{' '}
                              <strong className="text-amber-400">{arcLength.toFixed(2)} সেমি</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">বৃত্তকলার ক্ষেত্রফল (A):</span>{' '}
                              <strong className="text-emerald-400">{sectorArea.toFixed(2)} cm²</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">পথের ক্ষেত্রফল:</span>{' '}
                              <strong className="text-white">{pathArea.toFixed(2)} cm²</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">চাকার ঘূর্ণন সংখ্যা (N):</span>{' '}
                              <strong className="text-sky-400">{Math.round(revs)} বার</strong>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 pt-1">
                            বৃত্তকলা সূত্র: <code>A = (θ/360°) × πr² = ½ s r</code> (উভয় সূত্রে মান হুবহু সমান!)
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* LAB 5: 3D SOLIDS LAB (16.4) */}
            {/* ============================================================= */}
            {activeLab === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Box className="w-4 h-4 text-primary" />
                    ঘনবস্তুর ধরণ নির্বাচন
                  </h3>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'cuboid', label: 'আয়তাকার ঘনবস্তু' },
                      { id: 'cube', label: 'ঘনক (Cube)' },
                      { id: 'cylinder', label: 'বেলন (সিলিন্ডার)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSolidType(s.id as any)}
                        className={`p-2 rounded-lg text-center font-medium transition-colors border ${
                          solidType === s.id
                            ? 'bg-primary/10 border-primary text-primary font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {solidType === 'cuboid' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>দৈর্ঘ্য (a):</span>
                            <span className="font-bold text-primary">{cubLength} মি</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="16"
                            value={cubLength}
                            onChange={(e) => setCubLength(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>প্রস্থ (b):</span>
                            <span className="font-bold text-primary">{cubWidth} মি</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="12"
                            value={cubWidth}
                            onChange={(e) => setCubWidth(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>উচ্চতা (c):</span>
                            <span className="font-bold text-primary">{cubHeight} মি</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="10"
                            value={cubHeight}
                            onChange={(e) => setCubHeight(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}

                    {solidType === 'cube' && (
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span>ধারের দৈর্ঘ্য (a):</span>
                          <span className="font-bold text-primary">{cubeSide} মি</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="14"
                          value={cubeSide}
                          onChange={(e) => setCubeSide(parseFloat(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    )}

                    {solidType === 'cylinder' && (
                      <>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>ভূমির ব্যাসার্ধ (r):</span>
                            <span className="font-bold text-primary">{cylRadius} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="3"
                            max="14"
                            value={cylRadius}
                            onChange={(e) => setCylRadius(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between font-medium mb-1">
                            <span>উচ্চতা (h):</span>
                            <span className="font-bold text-primary">{cylHeight} সেমি</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="20"
                            value={cylHeight}
                            onChange={(e) => setCylHeight(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center">
                    <svg viewBox="0 0 360 220" className="w-full max-w-md h-52 overflow-visible">
                      <defs>
                        <linearGradient id="faceGrad1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="faceGrad2" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>

                      {solidType === 'cuboid' && (() => {
                        const w = Math.min(140, cubLength * 9);
                        const h = Math.min(80, cubHeight * 8);
                        const d = Math.min(50, cubWidth * 5);
                        const ox = 90, oy = 150;

                        return (
                          <g>
                            {/* Back/hidden dashed diagonal */}
                            <line
                              x1={ox}
                              y1={oy}
                              x2={ox + w + d}
                              y2={oy - h - d * 0.6}
                              stroke="#ec4899"
                              strokeWidth="2"
                              strokeDasharray="4 3"
                            />
                            {/* Front face */}
                            <rect
                              x={ox}
                              y={oy - h}
                              width={w}
                              height={h}
                              fill="url(#faceGrad1)"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            {/* Top face */}
                            <polygon
                              points={`${ox},${oy - h} ${ox + d},${oy - h - d * 0.6} ${ox + w + d},${oy - h - d * 0.6} ${ox + w},${oy - h}`}
                              fill="url(#faceGrad2)"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            {/* Right side face */}
                            <polygon
                              points={`${ox + w},${oy - h} ${ox + w + d},${oy - h - d * 0.6} ${ox + w + d},${oy - d * 0.6} ${ox + w},${oy}`}
                              fill="#4f46e5"
                              fillOpacity="0.25"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            {/* Callouts */}
                            <text x={ox + w / 2} y={oy + 16} fill="#4338ca" fontSize="10" fontWeight="bold" textAnchor="middle">
                              দৈর্ঘ্য a = {cubLength}
                            </text>
                            <text x={ox - 15} y={oy - h / 2} fill="#4338ca" fontSize="10" fontWeight="bold">
                              c = {cubHeight}
                            </text>
                            <text x={ox + w + d / 2 + 5} y={oy + 10} fill="#4338ca" fontSize="10" fontWeight="bold">
                              b = {cubWidth}
                            </text>
                            <text x={ox + w / 2 + 10} y={oy - h / 2 - 10} fill="#ec4899" fontSize="10" fontWeight="bold">
                              কর্ণ d
                            </text>
                          </g>
                        );
                      })()}

                      {solidType === 'cube' && (() => {
                        const s = Math.min(100, cubeSide * 10);
                        const ox = 110, oy = 150;
                        const d = s * 0.5;

                        return (
                          <g>
                            <rect
                              x={ox}
                              y={oy - s}
                              width={s}
                              height={s}
                              fill="url(#faceGrad1)"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            <polygon
                              points={`${ox},${oy - s} ${ox + d},${oy - s - d * 0.6} ${ox + s + d},${oy - s - d * 0.6} ${ox + s},${oy - s}`}
                              fill="url(#faceGrad2)"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            <polygon
                              points={`${ox + s},${oy - s} ${ox + s + d},${oy - s - d * 0.6} ${ox + s + d},${oy - d * 0.6} ${ox + s},${oy}`}
                              fill="#4f46e5"
                              fillOpacity="0.25"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            <text x={ox + s / 2} y={oy + 16} fill="#4338ca" fontSize="11" fontWeight="bold" textAnchor="middle">
                              ধার a = {cubeSide}
                            </text>
                          </g>
                        );
                      })()}

                      {solidType === 'cylinder' && (() => {
                        const rPx = Math.min(55, cylRadius * 4.5);
                        const hPx = Math.min(110, cylHeight * 6);
                        const cx = 180, cy = 60;

                        return (
                          <g>
                            {/* Cylinder Body */}
                            <rect
                              x={cx - rPx}
                              y={cy}
                              width={rPx * 2}
                              height={hPx}
                              fill="url(#faceGrad1)"
                              stroke="none"
                            />
                            {/* Side vertical edges */}
                            <line x1={cx - rPx} y1={cy} x2={cx - rPx} y2={cy + hPx} stroke="#4338ca" strokeWidth="2" />
                            <line x1={cx + rPx} y1={cy} x2={cx + rPx} y2={cy + hPx} stroke="#4338ca" strokeWidth="2" />
                            {/* Bottom ellipse */}
                            <ellipse
                              cx={cx}
                              cy={cy + hPx}
                              rx={rPx}
                              ry={rPx * 0.35}
                              fill="#4f46e5"
                              fillOpacity="0.2"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            {/* Top ellipse */}
                            <ellipse
                              cx={cx}
                              cy={cy}
                              rx={rPx}
                              ry={rPx * 0.35}
                              fill="url(#faceGrad2)"
                              stroke="#4338ca"
                              strokeWidth="2"
                            />
                            {/* Center Radius indicator */}
                            <line x1={cx} y1={cy} x2={cx + rPx} y2={cy} stroke="#ef4444" strokeWidth="1.5" />
                            <text x={cx + rPx / 2} y={cy - 6} fill="#ef4444" fontSize="10" fontWeight="bold">
                              r = {cylRadius}
                            </text>
                            <text x={cx + rPx + 10} y={cy + hPx / 2} fill="#4338ca" fontSize="10" fontWeight="bold">
                              h = {cylHeight}
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-indigo-400">ত্রিমাত্রিক পরিমাপ ফলাফল</span>
                      <span className="font-mono text-slate-400">NCTB স্ট্যান্ডার্ড</span>
                    </div>

                    {solidType === 'cuboid' && (() => {
                      const a = cubLength, b = cubWidth, c = cubHeight;
                      const vol = a * b * c;
                      const surf = 2 * (a * b + b * c + c * a);
                      const diag = Math.sqrt(a * a + b * b + c * c);

                      return (
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-3 gap-2 text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                            <div>
                              <span className="text-slate-400">আয়তন (abc):</span>
                              <div className="text-base font-bold text-emerald-400 mt-0.5">{vol} ঘনমি</div>
                            </div>
                            <div>
                              <span className="text-slate-400">সমগ্রতল (2(ab+bc+ca)):</span>
                              <div className="text-base font-bold text-amber-400 mt-0.5">{surf} বর্গমি</div>
                            </div>
                            <div>
                              <span className="text-slate-400">কর্ণ (√(a²+b²+c²)):</span>
                              <div className="text-base font-bold text-sky-400 mt-0.5">{diag.toFixed(2)} মি</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {solidType === 'cube' && (() => {
                      const a = cubeSide;
                      const vol = a * a * a;
                      const surf = 6 * a * a;
                      const diag = Math.sqrt(3) * a;

                      return (
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-3 gap-2 text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                            <div>
                              <span className="text-slate-400">আয়তন (a³):</span>
                              <div className="text-base font-bold text-emerald-400 mt-0.5">{vol} ঘনমি</div>
                            </div>
                            <div>
                              <span className="text-slate-400">সমগ্রতল (6a²):</span>
                              <div className="text-base font-bold text-amber-400 mt-0.5">{surf} বর্গমি</div>
                            </div>
                            <div>
                              <span className="text-slate-400">কর্ণ (√3 a):</span>
                              <div className="text-base font-bold text-sky-400 mt-0.5">{diag.toFixed(2)} মি</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {solidType === 'cylinder' && (() => {
                      const r = cylRadius, h = cylHeight;
                      const vol = Math.PI * r * r * h;
                      const curvedSurf = 2 * Math.PI * r * h;
                      const totalSurf = 2 * Math.PI * r * (r + h);

                      return (
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-3 gap-2 text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                            <div>
                              <span className="text-slate-400">আয়তন (πr²h):</span>
                              <div className="text-base font-bold text-emerald-400 mt-0.5">{vol.toFixed(1)} cm³</div>
                            </div>
                            <div>
                              <span className="text-slate-400">বক্রতল (2πrh):</span>
                              <div className="text-base font-bold text-amber-400 mt-0.5">{curvedSurf.toFixed(1)} cm²</div>
                            </div>
                            <div>
                              <span className="text-slate-400">সমগ্রতল (2πr(r+h)):</span>
                              <div className="text-base font-bold text-sky-400 mt-0.5">{totalSurf.toFixed(1)} cm²</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: SEE EXAMPLES (3 WORKED BOARD CQS) */}
        {/* =================================================================== */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                বোর্ড সৃজনশীল প্রশ্ন ও সমাধান (CQ Master Library)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                এনসিটিবি ও শীর্ষ শিক্ষা বোর্ডের বিগত সালের প্রমাণমূলক সৃজনশীল প্রশ্নের পুঙ্খানুপুঙ্খ সমাধান ও পরীক্ষকের গোপন মূল্যায়ন নির্দেশিকা।
              </p>
            </div>

            <div className="space-y-6">
              {CHAPTER_CQS.map((cq) => (
                <div
                  key={cq.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
                >
                  <div className="bg-slate-100 dark:bg-slate-800/70 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      সৃজনশীল প্রশ্ন {cq.id === 1 ? '০১' : cq.id === 2 ? '০২' : '০৩'}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {cq.boardYear}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Stimulus */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                      <strong>উদ্দীপক:</strong> <RenderMathText text={cq.stimulus} />
                    </div>

                    {/* Parts */}
                    <div className="space-y-4">
                      {cq.parts.map((part) => (
                        <div
                          key={part.part}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm"
                        >
                          <div className="flex items-start justify-between gap-2 font-semibold text-slate-900 dark:text-white">
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 mt-0.5">
                                {part.part}
                              </span>
                              <span>
                                <RenderMathText text={part.question} />
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 shrink-0 font-mono">
                              [{part.marks} নম্বর]
                            </span>
                          </div>

                          {/* Solution Steps */}
                          <div className="space-y-1.5 pl-7 text-xs text-slate-700 dark:text-slate-300 font-sans">
                            {part.solution.map((step, sIdx) => (
                              <div key={sIdx} className="leading-relaxed">
                                <RenderMathText text={step} />
                              </div>
                            ))}
                          </div>

                          {/* Examiner Secret */}
                          <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <strong>পরীক্ষকের গোপন টিপস: </strong>
                              <RenderMathText text={part.examinerSecret} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: TRY YOURSELF (3 INTERACTIVE CHALLENGES) */}
        {/* =================================================================== */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                নিজে চেষ্টা করুন: গাণিতিক চ্যালেঞ্জ
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                বোর্ড পরীক্ষার সম্ভাব্য জটিল অঙ্কগুলো নিজে সমাধান করো এবং সঠিক উত্তর দিয়ে তাৎক্ষণিক মূল্যায়ন পাও।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CHAPTER_CHALLENGES.map((ch) => {
                const isTested = challengeResults[ch.id] !== undefined && challengeResults[ch.id] !== null;
                const isSuccess = challengeResults[ch.id] === true;

                return (
                  <div
                    key={ch.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 uppercase">
                        {ch.title}
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        <RenderMathText text={ch.question} />
                      </p>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                        <strong>ইঙ্গিত:</strong> <RenderMathText text={ch.hint} />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="উত্তর লিখুন..."
                          value={challengeInputs[ch.id] || ''}
                          onChange={(e) =>
                            setChallengeInputs((prev) => ({
                              ...prev,
                              [ch.id]: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-primary"
                        />
                        <span className="text-xs text-slate-500">{ch.unit}</span>
                        <button
                          onClick={() => handleCheckChallenge(ch.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          যাচাই
                        </button>
                      </div>

                      {isTested && (
                        <div
                          className={`p-2 rounded-lg text-xs flex items-start gap-1.5 ${
                            isSuccess
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div>{isSuccess ? 'অভিনন্দন! সঠিক উত্তর।' : 'আবার চেষ্টা করো! সঠিক নয়।'}</div>
                            <div className="text-[11px] opacity-90 mt-0.5">
                              <RenderMathText text={ch.explanation} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: CHECK UNDERSTANDING (5 BOARD MCQS) */}
        {/* =================================================================== */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  অনুধাবন যাচাই: বহুনির্বাচনী প্রশ্নমালা (MCQ)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  বোর্ড পরীক্ষার স্ট্যান্ডার্ড অনুসারে ৫টি ধারণাগত বহুনির্বাচনী প্রশ্নের উত্তর দিন।
                </p>
              </div>

              {showMCQResults && (
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-xl">
                  <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    প্রাপ্ত স্কোর:
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {calculateMCQScore()} / {CHAPTER_MCQS.length}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {CHAPTER_MCQS.map((mcq, idx) => {
                const userChoice = userAnswers[mcq.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === mcq.correctIndex;

                return (
                  <div
                    key={mcq.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>
                        <RenderMathText text={mcq.question} />
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {mcq.options.map((opt, oIdx) => {
                        let btnStyle =
                          'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800';

                        if (showMCQResults) {
                          if (oIdx === mcq.correctIndex) {
                            btnStyle =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                          } else if (userChoice === oIdx) {
                            btnStyle =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300';
                          }
                        } else if (userChoice === oIdx) {
                          btnStyle =
                            'bg-primary/10 border-primary text-primary font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={showMCQResults}
                            onClick={() => handleSelectMCQ(mcq.id, oIdx)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${btnStyle}`}
                          >
                            <span className="font-semibold mr-1.5">
                              {oIdx === 0 ? 'A.' : oIdx === 1 ? 'B.' : oIdx === 2 ? 'C.' : 'D.'}
                            </span>
                            <RenderMathText text={opt} />
                          </button>
                        );
                      })}
                    </div>

                    {showMCQResults && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          {isCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span>ব্যাখ্যা ও প্রমাণ:</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          <RenderMathText text={mcq.explanation} />
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              {!showMCQResults ? (
                <button
                  onClick={() => setShowMCQResults(true)}
                  disabled={Object.keys(userAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-xs"
                >
                  উত্তর যাচাই করুন
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMCQResults(false);
                    setUserAnswers({});
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  পুনরায় চেষ্টা করুন
                </button>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: SUMMARY (FORMULA CARDS & COMMON TRAPS) */}
        {/* =================================================================== */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  অধ্যায় সারসংক্ষেপ ও সূত্র ভাণ্ডার (Cheat Sheet)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ১৬তম অধ্যায়ের পরিমিতির সকল আবশ্যক সূত্র, একক রূপান্তর এবং বোর্ড পরীক্ষার সাধারণ ভুলসমূহ।
                </p>
              </div>

              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                {copiedFormula ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কপি সম্পন্ন!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>সূত্র তালিকা কপি করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Formula Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 uppercase">
                  ১৬.১ ত্রিভুজ
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">ত্রিভুজ ক্ষেত্রফল</h4>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div><RenderMathText text="সমবাহু: $\frac{\sqrt{3}}{4}a^2$" /></div>
                  <div><RenderMathText text="সমদ্বিবাহু: $\frac{b}{4}\sqrt{4a^2 - b^2}$" /></div>
                  <div><RenderMathText text="হেরন: $\sqrt{s(s-a)(s-b)(s-c)}$" /></div>
                  <div><RenderMathText text="কোণ সহ: $\frac{1}{2}ab\sin\theta$" /></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 uppercase">
                  ১৬.২ চতুর্ভুজ ও বহুভুজ
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">চতুর্ভুজ ও বহুভুজ</h4>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div><RenderMathText text="সামান্তরিক: $bh$ বা $ab\sin\theta$" /></div>
                  <div><RenderMathText text="রম্বস: $\frac{1}{2}d_1 d_2$" /></div>
                  <div><RenderMathText text="ট্রাপিজিয়াম: $\frac{1}{2}(a+b)h$" /></div>
                  <div><RenderMathText text="সুষম $n$-ভুজ: $\frac{n a^2}{4}\cot\frac{180^\circ}{n}$" /></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 uppercase">
                  ১৬.৩ বৃত্ত ও বৃত্তকলা
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">বৃত্ত ও চাকা</h4>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div><RenderMathText text="পরিধি: $2\pi r$, ক্ষেত্রফল: $\pi r^2$" /></div>
                  <div><RenderMathText text="চাপ দৈর্ঘ্য: $s = \frac{\pi r \theta}{180^\circ}$" /></div>
                  <div><RenderMathText text="বৃত্তকলা: $A = \frac{\theta}{360^\circ}\pi r^2 = \frac{1}{2}sr$" /></div>
                  <div><RenderMathText text="চাকার ঘূর্ণন: $N = \frac{D}{2\pi r}$" /></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 uppercase">
                  ১৬.৪ ঘনবস্তু
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">ত্রিমাত্রিক ঘনবস্তু</h4>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div><RenderMathText text="ঘনবস্তু আয়তন: $abc$" /></div>
                  <div><RenderMathText text="সমগ্রতল: $2(ab+bc+ca)$" /></div>
                  <div><RenderMathText text="কর্ণ: $\sqrt{a^2+b^2+c^2}$" /></div>
                  <div><RenderMathText text="সিলিন্ডার আয়তন: $\pi r^2 h$" /></div>
                </div>
              </div>
            </div>

            {/* Traps & Warnings */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                পরীক্ষার সাধারণ ভুলসমূহ (Examiner Traps)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    ১. একক রূপান্তরের ভুল
                  </div>
                  চাকার অতিক্রান্ত দূরত্ব সাধারণত কিলোমিটারে বা মিটারে থাকে এবং ব্যাসার্ধ সেমিতে থাকে। দুটিকে অবশ্যই একই এককে (মিটারে) রূপান্তর করে নিতে হবে!
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    ২. সমদ্বিবাহু ত্রিভুজের সূত্র বিভ্রান্তি
                  </div>
                  <RenderMathText text="সমান সমান বাহু $a$ এবং ভূমি $b$। সূত্রে $\frac{b}{4}\sqrt{4a^2 - b^2}$ লক্ষ্য করুন রুটের ভেতর $4a^2$, বাইরে $b/4$। $a$ এবং $b$ উল্টে গেলে ফলাফল ভুল আসবে।" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    ৩. সিলিন্ডারের বক্রতল বনাম সমগ্রতল
                  </div>
                  <RenderMathText text="প্রশ্নে যদি বক্রতলের ক্ষেত্রফল বলে তবে কেবল $2\pi rh$ বের করতে হবে। দুই প্রান্তের বৃত্ত ($\pi r^2$) যোগ করে $2\pi r(r+h)$ করলে নম্বর কাটা যাবে!" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* SHERU AI SOCRATIC TUTOR DRAWER */}
      {/* --------------------------------------------------------------------- */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    শেরু এআই টিউটর
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    পরিমিতি ও ক্ষেত্রফল সহায়ক
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {aiChatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <RenderMathText text={msg.text} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex gap-1.5 overflow-x-auto text-[11px]">
              {[
                'সমবাহু ত্রিভুজের ক্ষেত্রফল সূত্র প্রমাণ',
                'ট্রাপিজিয়ামের উচ্চতা বের করার নিয়ম',
                'বৃত্তকলার ক্ষেত্রফল কীভাবে আসে?',
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setAiMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:border-primary transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Drawer Input */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                placeholder="পরিমিতির যেকোনো প্রশ্ন জিজ্ঞাসা করুন..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSendAiMessage}
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
