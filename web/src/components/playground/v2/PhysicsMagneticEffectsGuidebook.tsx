'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChevronRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  X,
  Send,
  Eye,
  Sliders,
  Search,
  MessageSquare,
  ShieldCheck,
  XCircle,
  Zap,
  Activity,
  Atom,
  AlertTriangle,
  Info,
  Power,
  Gauge,
  Compass,
  Magnet,
  RefreshCw,
  Play,
  Pause,
  Repeat,
  Radio,
  Share2,
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
    title: 'ওয়েরস্টেডের পরীক্ষা ও ডান হাতের বুড়ো আঙুল নিয়ম',
    subtitle: "Oersted's Discovery & Right-Hand Thumb Rule",
    nctbPage: 'পৃষ্ঠা ৩৩২',
    badge: 'ল্যাব ০১',
    intro:
      '১৮২০ সালে হ্যান্স ক্রিশ্চিয়ান ওয়েরস্টেড আবিষ্কার করেন যে পরিবাহী তারের ভেতর দিয়ে বিদ্যুৎ প্রবাহিত হলে তার চারপাশে বৃত্তাকার চৌম্বক ক্ষেত্র সৃষ্টি হয়। ডান হাতের বুড়ো আঙুল দিয়ে প্রবাহ এবং আঙুলের ভাঁজ দিয়ে চৌম্বক বলরেখার দিক নির্ণয় করা যায়।',
  },
  {
    id: 2,
    title: 'সলিনয়েড ও তাড়িতচুম্বক ডোমেইন ল্যাব',
    subtitle: 'Solenoid, Electromagnet & Magnetic Domains',
    nctbPage: 'পৃষ্ঠা ৩৩-৩৩৫',
    badge: 'ল্যাব ০২',
    intro:
      'অনেকগুলো প্যাঁচ দেওয়া কুণ্ডলী বা সলিনয়েড একটি শক্তিশালী দণ্ড চুম্বকের মতো আচরণ করে। এর ভেতরে নরম লোহার মজ্জা (Soft Iron Core) প্রবেশ করালে এলোমেলো চৌম্বক ডোমেইনগুলো সারিবদ্ধ হয়ে শক্তিশালী তাড়িতচুম্বকে পরিণত হয়।',
  },
  {
    id: 3,
    title: 'ডিসি মোটর ও ফ্লেমিং-এর বাম হস্ত নিয়ম',
    subtitle: "DC Motor & Fleming's Left-Hand Rule",
    nctbPage: 'পৃষ্ঠা ৩৩৬-৩৩৮',
    badge: 'ল্যাব ০৩',
    intro:
      'চৌম্বক ক্ষেত্রে স্থাপিত তড়িৎবাহী তারের ওপর চৌম্বক বল (F = BIL) প্রযুক্ত হয়। ফ্লেমিং-এর বাম হস্ত নিয়ম এবং অর্ধ-বলয় কমিউটেটরের (Split-Ring Commutator) সাহায্যে তড়িৎ শক্তিকে অবিচ্ছিন্ন ঘূর্ণন যান্ত্রিক শক্তিতে রূপান্তর করা হয়।',
  },
  {
    id: 4,
    title: 'তাড়িতচৌম্বক আবেশ, লেঞ্জের নিয়ম ও এসি জেনারেটর',
    subtitle: "Electromagnetic Induction, Lenz's Law & AC Generator",
    nctbPage: 'পৃষ্ঠা ৩৩৮-৩৪০',
    badge: 'ল্যাব ০৪',
    intro:
      'চৌম্বক ক্ষেত্রের পরিবর্তনের ফলে পরিবাহী কুণ্ডলীতে তড়িচ্চালক শক্তি ও প্রবাহের সৃষ্টি হওয়াকে তাড়িতচৌম্বক আবেশ বলে। লেঞ্জের নিয়ম অনুযায়ী আবিষ্ট প্রবাহের দিক এমন হয় যেন এটি তার সৃষ্টির মূল কারণকে বাধা দেয়।',
  },
  {
    id: 5,
    title: 'ট্রান্সফরমার সিমুলেটর ও পাওয়ার গ্রিড ল্যাব',
    subtitle: 'Step-Up / Step-Down Transformer & Grid Transmission',
    nctbPage: 'পৃষ্ঠা ৩৪০-৩৪২',
    badge: 'ল্যাব ০৫',
    intro:
      'পারস্পরিক আবেশের মাধ্যমে এসি ভোল্টেজকে রূপান্তর করার যন্ত্র হলো ট্রান্সফরমার। ডিসি ভোল্টেজে ট্রান্সফরমার কাজ করে না। উচ্চ ভোল্টেজে (স্টেপ-আপ) বিদ্যুৎ সঞ্চালন করলে লাইনে I²R অপচয় বিপুল পরিমাণে হ্রাস পায়।',
  },
];

interface CQItem {
  id: number;
  title: string;
  source: string;
  stimulus: string;
  qG: string;
  ansG: string;
  qGh: string;
  ansGh: string;
  examinerSecrets: string;
}

const WORKED_CQS: CQItem[] = [
  {
    id: 1,
    title: 'ট্রান্সফরমার রূপান্তর ও মারাত্মক ডিসি (DC) ফাঁদ',
    source: 'পাঠ্যবই পৃষ্ঠা ৩৪১-৩৪২ ও ঢাকা বোর্ড',
    stimulus:
      'একটি আদর্শ ট্রান্সফরমারের মুখ্য কুণ্ডলীর পাকসংখ্যা 100 এবং গৌণ কুণ্ডলীর পাকসংখ্যা 1000। এর মুখ্য কুণ্ডলীতে 12V AC বিভব প্রয়োগ করায় 1A বিদ্যুৎ প্রবাহিত হয়। অন্য একটি পরীক্ষায় এসি উৎসের বদলে একই মানের 12V DC ব্যাটারি সংযোগ দেওয়া হলো।',
    qG: 'গৌণ কুণ্ডলীতে উৎপন্ন বিভব পার্থক্য ও সর্বোচ্চ তড়িৎ প্রবাহমাত্রা নির্ণয় করো।',
    ansG:
      'আমরা জানি, ট্রান্সফরমারের রূপান্তর অনুপাত:\n$$\\frac{V_s}{V_p} = \\frac{n_s}{n_p}$$\n$$\\implies V_s = \\left(\\frac{n_s}{n_p}\\right) V_p = \\left(\\frac{1000}{100}\\right) \\times 12\\text{ V} = 120\\text{ V AC}$$\n\nক্ষমতার সংরক্ষণশীলতা নীতি অনুসারে ($P_p = P_s$):\n$$V_p I_p = V_s I_s$$\n$$\\implies I_s = \\left(\\frac{V_p}{V_s}\\right) I_p = \\left(\\frac{12}{120}\\right) \\times 1\\text{ A} = 0.1\\text{ A}$$\nঅতএব, গৌণ কুণ্ডলীর বিভব 120V AC এবং প্রবাহমাত্রা 0.1A।',
    qGh: 'মুখ্য কুণ্ডলীতে 12V DC ব্যাটারি যুক্ত করলে গৌণ কুণ্ডলীতে কী পরিমাণ ভোল্টেজ আবিষ্ট হবে? কারণ ব্যাখ্যা করো।',
    ansGh:
      'উপাত্ত অনুসারে, 12V DC ব্যাটারি যুক্ত করলে গৌণ কুণ্ডলীতে আবিষ্ট ভোল্টেজ হবে শূন্য ($V_s = 0\\text{ V}$)।\n\nবৈজ্ঞানিক কারণ:\n১. তাড়িতচৌম্বক আবেশের মূল শর্ত হলো চৌম্বক ফ্লাক্সের ক্রমাগত পরিবর্তন ($\\frac{d\\Phi}{dt} \\neq 0$)।\n২. ডিসি (DC - Direct Current) এর মান ও দিক সময়ের সাথে স্থির থাকে। ফলে কোরে উৎপন্ন চৌম্বক ক্ষেত্র স্থির থাকে, কোনো ফ্লাক্স পরিবর্তন ঘটে না ($\\frac{d\\Phi}{dt} = 0$)।\n৩. ফ্যারাডের আবেশ সূত্রানুসারে $\\mathcal{E} = -n_s \\frac{d\\Phi}{dt} = 0\\text{ V}$।\nঅতএব, ট্রান্সফরমার ডিসি ভোল্টেজে কাজ করে না।',
    examinerSecrets:
      'বোর্ড পরীক্ষার শীর্ষ ফাঁদ! শিক্ষার্থীরা উদ্দীপকে 12V দেখেই সূত্রের মধ্যে 12 বসিয়ে 120V বের করে ফেলে। যদি উৎসে "DC" বা "ব্যাটারি" লেখা থাকে, তবে এক লাইনে লিখতে হবে: $V_s = 0\\text{ V}$ কারণ ডিসিতে ফ্লাক্স পরিবর্তন শূন্য। ভুল সূত্র প্রয়োগ করলে সরাসরি শূন্য দেওয়া হয়।',
  },
  {
    id: 2,
    title: 'ডিসি মোটরের কার্যপ্রণালি ও কমিউটেটরের গুরুত্ব',
    source: 'পাঠ্যবই চিত্র ১২.১১ ও রাজশাহী বোর্ড',
    stimulus:
      'একটি ডিসি মোটরের চৌম্বক ক্ষেত্রে একটি আয়তাকার কুণ্ডলী ABCD স্থাপিত। কুণ্ডলীর সাথে দুটি অর্ধ-বৃত্তাকার তামার পাত (কমিউটেটর) এবং দুটি কার্বন ব্রাশ দিয়ে ডিসি ব্যাটারি যুক্ত করা হয়েছে।',
    qG: 'ফ্লেমিং-এর বাম হস্ত নিয়মের সাহায্যে কুণ্ডলীর ঘূর্ণনের দিক ব্যাখ্যা করো।',
    ansG:
      'ফ্লেমিং-এর বাম হস্ত নিয়ম:\nবাম হাতের বৃদ্ধাঙ্গুলি, তর্জনী ও মধ্যমাকে পরস্পরের সমকোণে প্রসারিত করলে—\n- তর্জনী চৌম্বক ক্ষেত্রের দিক ($N \\rightarrow S$)\n- মধ্যমা তড়িৎ প্রবাহের দিক ($I$)\n- বৃদ্ধাঙ্গুলি পরিবাহীর গতির দিক বা বল ($F$) নির্দেশ করে।\n\nকুণ্ডলীর বাহুদ্বয়ের ওপর ক্রিয়া:\n১. $AB$ বাহুতে প্রবাহ ভেতরের দিকে গেলে ফ্লেমিং-এর নিয়মানুসারে এটি ওপরের দিকে বল অনুভব করে।\n২. বিপরীত $CD$ বাহুতে প্রবাহ বাইরের দিকে আসায় এটি নিচের দিকে বল অনুভব করে।\n৩. এই দুই সমান ও বিপরীতমুখী বল একটি ঘূর্ণন যুগল বা টর্ক (Torque) সৃষ্টি করে, ফলে কুণ্ডলীটি ঘড়ির কাঁটার দিকে ঘোরে।',
    qGh: 'যদি মোটরে কমিউটেটরের পরিবর্তে সাধারণ অবিচ্ছিন্ন স্লিপ-রিং ব্যবহার করা হতো, তবে মোটরের ঘূর্ণনে কী প্রভাব পড়ত?',
    ansGh:
      'কমিউটেটরের বদলে অবিচ্ছিন্ন স্লিপ-রিং ব্যবহার করলে মোটর অবিচ্ছিন্নভাবে ঘুরতে পারত না; এটি অর্ধ-ঘূর্ণন পর থেমে যেত বা দুলতে থাকত।\n\nবিশ্লেষণ:\n১. কমিউটেটর প্রতি অর্ধ-ঘূর্ণনে ($180^\\circ$) কুণ্ডলীর বাহুদ্বয়ে বিদ্যুৎ প্রবাহের দিক স্বয়ংক্রিয়ভাবে উল্টে দেয়। ফলে টর্কের দিক সবসময় একদিকে বজায় থাকে।\n২. অবিচ্ছিন্ন বলয় থাকলে অর্ধ-ঘূর্ণনের পর $AB$ বাহু অপর পাশে গেলেও কারেন্টের দিক উল্টাত না। ফলে বলের দিক উল্টে গিয়ে গতির বিপরীত দিকে টর্ক প্রযুক্ত হতো।\n৩. কুণ্ডলীটি উল্টো দিকে ফিরে এসে উল্লম্ব সাম্যাবস্থায় আটকে যেত।\nসুতরাং, একমুখী অবিচ্ছিন্ন ঘূর্ণনের জন্য কমিউটেটর অপরিহার্য।',
    examinerSecrets:
      'কমিউটেটরের উত্তর লেখার সময় "প্রতি অর্ধ-ঘূর্ণনে তড়িৎ প্রবাহের দিক পরিবর্তন" এবং "টর্কের দিক একমুখী রাখা" শব্দদ্বয় উল্লেখ না করলে পূর্ণ ৩/৪ নম্বর পাওয়া যায় না। অনেকেই ঘূর্ণন জড়তার কথা ভুলিয়ে ফেলে।',
  },
  {
    id: 3,
    title: 'জাতীয় পাওয়ার গ্রিডে স্টেপ-আপ ট্রান্সফরমার ও ক্ষমতা সাশ্রয়',
    source: 'পাঠ্যবই পৃষ্ঠা ৩৪১ ও চট্টগ্রাম বোর্ড সৃজনশীল',
    stimulus:
      'একটি বিদ্যুৎ উৎপাদন কেন্দ্রে 200 kW ক্ষমতা 220 V বিভবে উৎপন্ন হয়। এই বিদ্যুৎ 10 Ω রোধের সঞ্চালন লাইনের মাধ্যমে 40 km দূরের শহরে পাঠাতে হবে। প্রধান প্রকৌশলী লাইন দেওয়ার আগে একটি স্টেপ-আপ ট্রান্সফরমার ব্যবহার করে ভোল্টেজকে 132 kV তে উন্নীত করলেন।',
    qG: '132 kV তে রূপান্তরের পর সঞ্চালন লাইনে তড়িৎ প্রবাহের মান কত হবে?',
    ansG:
      'দেওয়া আছে:\nমোট ক্ষমতা, $P = 200\\text{ kW} = 200,000\\text{ W}$\nসঞ্চালন লাইনের ভোল্টেজ, $V = 132\\text{ kV} = 132,000\\text{ V}$\n\nআমরা জানি, $P = VI$\n$$\\implies I = \\frac{P}{V} = \\frac{200,000\\text{ W}}{132,000\\text{ V}} \\approx 1.515\\text{ A}$$\nঅতএব, 132 kV তে রূপান্তরের পর লাইনের তড়িৎ প্রবাহ হবে মাত্র 1.515 A।',
    qGh: 'প্রকৌশলীর এই সিদ্ধান্তের যৌক্তিকতা গাণিতিক অপচয় বিশ্লেষণের মাধ্যমে প্রমাণ করো।',
    ansGh:
      '১. যদি রূপান্তর না করে সরাসরি 220 V এ বিদ্যুৎ পাঠানো হতো:\nতড়িৎ প্রবাহ, $I_1 = \\frac{P}{V_1} = \\frac{200,000}{220} \\approx 909.09\\text{ A}$\nলাইনে তাপীয় অপচয় (Joule Loss):\n$$P_{\\text{loss}, 1} = I_1^2 R = (909.09)^2 \\times 10 = 8,264,462\\text{ W} \\approx 8264.5\\text{ kW}$$\nএখানে অপচয় (8264.5 kW) মোট উৎপাদনের (200 kW) চেয়ে বহুগুণ বেশি, অর্থাৎ বিদ্যুৎ শহরে পৌঁছানোর আগেই সম্পূর্ণ ধ্বংস হয়ে যেত!\n\n২. 132 kV তে স্টেপ-আপ করার পর:\nতড়িৎ প্রবাহ, $I_2 \\approx 1.515\\text{ A}$\nলাইনে তাপীয় অপচয়:\n$$P_{\\text{loss}, 2} = I_2^2 R = (1.515)^2 \\times 10 \\approx 22.95\\text{ W} = 0.023\\text{ kW}$$\n\nসাশ্রয়ের অনুপাত:\nঅপচয় কমে প্রায় 99.99% দূর হয়ে গেছে।\nসিদ্ধান্ত: উচ্চ ভোল্টেজে রূপান্তর করায় কারেন্ট কমে গিয়ে $I^2R$ তাপীয় অপচয় শূন্যের কাছাকাছি নেমে আসে, তাই প্রকৌশলীর সিদ্ধান্ত সম্পূর্ণ বিজ্ঞানসম্মত ও অপরিহার্য।',
    examinerSecrets:
      'তাপীয় অপচয়ের জন্য $P = I^2 R$ সূত্র ব্যবহার করতে হবে, ভুলেও $P = V^2 / R$ এ সঞ্চালন লাইনের মোট ভোল্টেজ বসাবেন না! কারণ লাইনের দুই প্রান্তের বিভব পতন সম্পূর্ণ সরবরাহ ভোল্টেজ নয়, বিভব পতন হলো $V_{\\text{drop}} = IR$।',
  },
];

interface MCQItem {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const MCQS: MCQItem[] = [
  {
    id: 1,
    question:
      'কোনো চোঙের ওপর অন্তরিত পরিবাহী তার পেঁচিয়ে সলিনয়েড তৈরি করে তাতে বিদ্যুৎ প্রবাহিত করলে উৎপন্ন চৌম্বক ক্ষেত্র কেমন হবে? (NCTB পাঠ্যবই MCQ ১)',
    options: [
      'কম ঘনীভূত ও দুর্বল হবে',
      'ঘনীভূত ও শক্তিশালী হবে',
      'চৌম্বক ক্ষেত্র পুরোপুরি ধ্বংস হবে',
      'কম ঘনীভূত কিন্তু শক্তিশালী হবে',
    ],
    correct: 1,
    explanation:
      'সলিনয়েডের প্রতিটি প্যাঁচের বিদ্যুৎপ্রবাহ সম্মিলিতভাবে একটি শক্তিশালী সমান্তরাল চৌম্বক ক্ষেত্র তৈরি করে। প্যাঁচের সংখ্যা বৃদ্ধি পাওয়ায় ভেতরের বলরেখাগুলো অত্যন্ত ঘনীভূত ও শক্তিশালী হয়।',
  },
  {
    id: 2,
    question: 'নিচের কোন যন্ত্রটিতে তাড়িতচৌম্বক আবেশের মূলনীতি সরাসরি ব্যবহৃত হয়? (NCTB পাঠ্যবই MCQ ২)',
    options: ['ডিসি মোটর', 'বৈদ্যুতিক হিটার', 'ট্রান্সফরমার', 'অ্যামপ্লিফায়ার'],
    correct: 2,
    explanation:
      'ট্রান্সফরমার একটি স্থির তড়িৎ যন্ত্র যা তাড়িতচৌম্বক আবেশের (পারস্পরিক আবেশ) নীতিতে এক কুণ্ডলী থেকে অন্য কুণ্ডলীতে কোনো সরাসরি বৈদ্যুতিক সংযোগ ছাড়াই এসি ভোল্টেজ রূপান্তর করে। মোটর কাজ করে চৌম্বক বলের নীতিতে।',
  },
  {
    id: 3,
    question:
      'একটি ট্রান্সফরমারের মুখ্য কুণ্ডলীতে 12V DC ব্যাটারি সংযোগ দেওয়া হলো। এর সেকেন্ডারি কুণ্ডলীতে কত ভোল্ট পাওয়া যাবে? (পাঠ্যবই পৃষ্ঠা ৩৪১)',
    options: ['120 V DC', '12 V AC', '0 V', '1.2 V'],
    correct: 2,
    explanation:
      'ট্রান্সফরমার ডিসি ভোল্টেজে কাজ করে না। কারণ ডিসি প্রবাহে চৌম্বক ফ্লাক্সের কোনো পরিবর্তন হয় না (dΦ/dt = 0)। ফলে সেকেন্ডারি কুণ্ডলীতে কোনো ভোল্টেজ আবিষ্ট হতে পারে না (Vs = 0 V)।',
  },
  {
    id: 4,
    question: 'ডিসি মোটরে অর্ধ-বলয় কমিউটেটরের মূল ভূমিকা কোনটি?',
    options: [
      'মোটরের রোধ বৃদ্ধি করা',
      'প্রতি অর্ধ-ঘূর্ণনে কারেন্টের দিক পরিবর্তন করে একমুখী ঘূর্ণন টর্ক বজায় রাখা',
      'এসি বিদ্যুৎকে পুরোপুরি ব্যাটারিতে রিচার্জ করা',
      'আর্মেচারের ওজন কমানো',
    ],
    correct: 1,
    explanation:
      'কমিউটেটর প্রতি ১৮০° ঘূর্ণনে কুণ্ডলীর বাহুদ্বয়ে বিদ্যুৎ প্রবাহের অভিমুখ উল্টে দেয়, যার ফলে উৎপন্ন টর্কের দিক অপরিবর্তিত থাকে এবং মোটর একটানা একমুখী ঘূর্ণন বজায় রাখে।',
  },
  {
    id: 5,
    question: 'জাতীয় গ্রিডে বিদ্যুৎ সঞ্চালনে স্টেপ-আপ ট্রান্সফরমার ব্যবহার করার প্রধান কারণ কী?',
    options: [
      'বিদ্যুতের বেগ বৃদ্ধির জন্য',
      'প্রবাহমাত্রা (I) কমিয়ে লাইনে I²R তাপীয় অপচয় বিপুল পরিমাণ হ্রাস করা',
      'বিদ্যুতের ফ্রিকোয়েন্সি ৫০ Hz থেকে ৬০ Hz এ তোলা',
      'সঞ্চালন তারের ওজন হ্রাস করা',
    ],
    correct: 1,
    explanation:
      'সঞ্চালন তারে তাপীয় শক্তির অপচয় P = I²R। ভোল্টেজ অনেক গুণ বাড়িয়ে দিলে তড়িৎ প্রবাহ I একই অনুপাতে কমে যায়। ফলে I² এর বর্গের কারণে লাইনে বিদ্যুৎ অপচয় নাটকীয়ভাবে কমে যায়।',
  },
];

interface ChallengeItem {
  id: number;
  title: string;
  problem: string;
  unit: string;
  targetAnswer: number;
  tolerance: number;
  hint: string;
}

const CHALLENGES: ChallengeItem[] = [
  {
    id: 1,
    title: 'ট্রান্সফরমার সেকেন্ডারি ভোল্টেজ নির্ণয়',
    problem:
      'একটি ট্রান্সফরমারের মুখ্য কুণ্ডলীর পাকসংখ্যা 50 এবং গৌণ কুণ্ডলীর পাকসংখ্যা 500। মুখ্য কুণ্ডলীতে 20 V AC প্রয়োগ করা হলে গৌণ কুণ্ডলীতে কত ভোল্ট (V) পাওয়া যাবে?',
    unit: 'V',
    targetAnswer: 200,
    tolerance: 0.5,
    hint: 'সূত্র: V_s = (n_s / n_p) * V_p = (500 / 50) * 20 V',
  },
  {
    id: 2,
    title: 'ক্ষমতার নিত্যতায় গৌণ কুণ্ডলীর প্রবাহ',
    problem:
      'একটি স্টেপ-ডাউন ট্রান্সফরমারে মুখ্য ভোল্টেজ 220 V এবং গৌণ ভোল্টেজ 11 V। মুখ্য কুণ্ডলীর কারেন্ট 0.5 A হলে গৌণ কুণ্ডলীর কারেন্ট কত অ্যাম্পিয়ার (A)?',
    unit: 'A',
    targetAnswer: 10,
    tolerance: 0.1,
    hint: 'সূত্র: I_s = (V_p / V_s) * I_p = (220 / 11) * 0.5 A',
  },
  {
    id: 3,
    title: 'সলিনয়েডের প্রতি একক দৈর্ঘ্যে পাকসংখ্যা',
    problem:
      'একটি 0.2 m লম্বা সলিনয়েডে মোট 100 টি পাক রয়েছে। সলিনয়েডের প্রতি মিটার দৈর্ঘ্যে পাকসংখ্যা (n = N / L) কত?',
    unit: 'turns/m',
    targetAnswer: 500,
    tolerance: 1,
    hint: 'সূত্র: n = N / L = 100 / 0.2',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export default function PhysicsMagneticEffectsGuidebook() {
  // Navigation State
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLab, setActiveLab] = useState<number>(1);

  // Socratic Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiChatQuery, setAiChatQuery] = useState<string>('');
  const [aiChatResponses, setAiChatResponses] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([]);

  // -------------------------------------------------------------------------
  // LAB 1 STATE: Oersted Experiment & Right-Hand Thumb Rule
  // -------------------------------------------------------------------------
  const [oerstedCurrent, setOerstedCurrent] = useState<number>(5); // -10 to +10 A
  const [compassPlacement, setCompassPlacement] = useState<'above' | 'below'>('above');
  const [wireDistance, setWireDistance] = useState<number>(3); // 1 to 10 cm

  // Physics calculation for Lab 1
  // B = (mu0 * I) / (2 * pi * r)
  // mu0 = 4*pi*1e-7 T*m/A => B = (2e-7 * I) / (r in meters)
  const rMeter = wireDistance / 100;
  const bFieldMicroTesla = Math.abs(oerstedCurrent) > 0 ? ((2e-7 * Math.abs(oerstedCurrent)) / rMeter) * 1e6 : 0;
  const earthFieldMicroTesla = 40; // ~40 uT typical horizontal field

  // Deflection angle: theta = arctan(B_wire / B_earth)
  // Direction depends on current direction (+: Upward/North, -: Downward/South) and placement (above vs below)
  // For current flowing North (+):
  //   Above wire: B points West. Compass needle deflects West.
  //   Below wire: B points East. Compass needle deflects East.
  // For current flowing South (-):
  //   Above wire: B points East. Compass needle deflects East.
  //   Below wire: B points West. Compass needle deflects West.
  let deflectionDirection: 'East' | 'West' | 'Zero' = 'Zero';
  if (oerstedCurrent > 0) {
    deflectionDirection = compassPlacement === 'above' ? 'West' : 'East';
  } else if (oerstedCurrent < 0) {
    deflectionDirection = compassPlacement === 'above' ? 'East' : 'West';
  }
  const deflectionDeg = Math.round((Math.atan(bFieldMicroTesla / earthFieldMicroTesla) * 180) / Math.PI);
  const signedDeflectionDeg = deflectionDirection === 'West' ? -deflectionDeg : deflectionDirection === 'East' ? deflectionDeg : 0;

  // -------------------------------------------------------------------------
  // LAB 2 STATE: Solenoid & Electromagnet
  // -------------------------------------------------------------------------
  const [solenoidTurns, setSolenoidTurns] = useState<number>(25); // 5 to 50 turns
  const [solenoidCurrent, setSolenoidCurrent] = useState<number>(4); // 0 to 10 A
  const [coreMaterial, setCoreMaterial] = useState<'air' | 'soft_iron' | 'steel'>('soft_iron');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);

  // Relative permeability
  const relPermeability =
    coreMaterial === 'soft_iron' ? 1200 : coreMaterial === 'steel' ? 150 : 1;
  const solenoidLength = 0.15; // 15 cm
  const activeSolenoidCurrent = isPowerOn ? solenoidCurrent : 0;
  // B = mu_r * mu_0 * (N/L) * I
  const bSolenoidTesla =
    (relPermeability * 4 * Math.PI * 1e-7 * (solenoidTurns / solenoidLength) * activeSolenoidCurrent);
  // Lifting force in nails: capacity scales with B^2 * area
  const baseNails = Math.round(
    isPowerOn
      ? (activeSolenoidCurrent * solenoidTurns * (relPermeability / 100)) / 12
      : coreMaterial === 'steel'
      ? 5 // steel retains remnant magnetism
      : 0 // soft iron drops immediately
  );
  const nailCount = Math.min(60, Math.max(0, baseNails));

  // -------------------------------------------------------------------------
  // LAB 3 STATE: DC Motor & Fleming's Left-Hand Rule
  // -------------------------------------------------------------------------
  const [motorB, setMotorB] = useState<number>(0.8); // 0.1 to 2.0 T
  const [motorCurrent, setMotorCurrent] = useState<number>(4); // 0.5 to 10 A
  const [motorTurns, setMotorTurns] = useState<number>(30); // 10 to 100
  const [hasCommutator, setHasCommutator] = useState<boolean>(true);
  const [batteryReversed, setBatteryReversed] = useState<boolean>(false);
  const [motorAngle, setMotorAngle] = useState<number>(0);
  const [isMotorRunning, setIsMotorRunning] = useState<boolean>(true);

  // Animation loop for motor
  useEffect(() => {
    if (!isMotorRunning) return;
    const interval = setInterval(() => {
      setMotorAngle((prev) => {
        if (!hasCommutator) {
          // Without commutator, motor oscillates around 90 deg and dampens
          // Target 90 deg (dead center)
          const diff = 90 - (prev % 360);
          if (Math.abs(diff) < 2) return 90;
          return prev + (diff > 0 ? 3 : -3);
        }
        const speed = (motorB * motorCurrent * motorTurns) / 8;
        const delta = batteryReversed ? -speed : speed;
        return (prev + delta + 360) % 360;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isMotorRunning, hasCommutator, motorB, motorCurrent, motorTurns, batteryReversed]);

  // Max Force on coil edge: F = N * B * I * L (L = 0.1 m)
  const motorForcePerSide = Math.round(motorTurns * motorB * motorCurrent * 0.1 * 10) / 10;
  // Torque: tau = N * B * I * A * sin(theta)
  const radAngle = (motorAngle * Math.PI) / 180;
  const currentTorque = Math.abs(
    Math.round(motorTurns * motorB * motorCurrent * 0.01 * Math.abs(Math.sin(radAngle)) * 100) / 100
  );

  // -------------------------------------------------------------------------
  // LAB 4 STATE: Electromagnetic Induction & AC Generator
  // -------------------------------------------------------------------------
  const [inductionSubMode, setInductionSubMode] = useState<'faraday' | 'generator'>('faraday');
  // Faraday Sub-Mode
  const [magnetPoleFacing, setMagnetPoleFacing] = useState<'N' | 'S'>('N');
  const [magnetPosition, setMagnetPosition] = useState<number>(20); // 0: fully inside, 100: far away
  const [magnetVelocity, setMagnetVelocity] = useState<number>(0); // -10 (pushing in) to +10 (pulling out)
  const [faradayTurns, setFaradayTurns] = useState<number>(200);

  // Generator Sub-Mode
  const [genRpm, setGenRpm] = useState<number>(30); // 1 to 60 RPM
  const [genOutputType, setGenOutputType] = useState<'ac' | 'dc'>('ac');
  const [genAngle, setGenAngle] = useState<number>(0);

  // Generator animation
  useEffect(() => {
    if (inductionSubMode !== 'generator') return;
    const interval = setInterval(() => {
      setGenAngle((prev) => (prev + (genRpm / 10)) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [inductionSubMode, genRpm]);

  // Induced EMF in Faraday: E = -N * (dPhi / dt)
  // Proportional to -N * velocity
  const inducedEmfFaraday =
    magnetVelocity !== 0
      ? Math.round(
          (faradayTurns / 100) *
            magnetVelocity *
            (magnetPoleFacing === 'N' ? -1 : 1) *
            10
        ) / 10
      : 0;

  // -------------------------------------------------------------------------
  // LAB 5 STATE: Transformer & Power Grid Loss
  // -------------------------------------------------------------------------
  const [transformerSubMode, setTransformerSubMode] = useState<'core_calc' | 'grid_loss'>('core_calc');
  // Core Calc Mode
  const [primaryTurns, setPrimaryTurns] = useState<number>(100);
  const [secondaryTurns, setSecondaryTurns] = useState<number>(500);
  const [primaryVoltage, setPrimaryVoltage] = useState<number>(24);
  const [primaryCurrent, setPrimaryCurrent] = useState<number>(2.0);
  const [sourceType, setSourceType] = useState<'ac' | 'dc'>('ac');

  // Grid Loss Mode
  const [plantPowerKw, setPlantPowerKw] = useState<number>(100); // 100 kW = 100,000 W
  const [gridVoltage, setGridVoltage] = useState<number>(132000); // 220, 11000, 33000, 132000 V
  const [gridResistance, setGridResistance] = useState<number>(5); // 5 Ohm

  // Calculations for Lab 5A
  const isDc = sourceType === 'dc';
  const secondaryVoltage = isDc ? 0 : Math.round(((secondaryTurns / primaryTurns) * primaryVoltage) * 10) / 10;
  const secondaryCurrent = isDc ? 0 : Math.round(((primaryTurns / secondaryTurns) * primaryCurrent) * 100) / 100;
  const isStepUp = secondaryTurns > primaryTurns;

  // Calculations for Lab 5B
  const plantPowerWatts = plantPowerKw * 1000;
  const lineCurrent = Math.round((plantPowerWatts / gridVoltage) * 100) / 100;
  const lineHeatLossWatts = Math.round(lineCurrent * lineCurrent * gridResistance * 10) / 10;
  const lineLossPercentage = Math.min(
    100,
    Math.round((lineHeatLossWatts / plantPowerWatts) * 10000) / 100
  );
  const powerDeliveredWatts = Math.max(0, plantPowerWatts - lineHeatLossWatts);

  // -------------------------------------------------------------------------
  // WORKED CQS STATE (Step 2)
  // -------------------------------------------------------------------------
  const [selectedCqId, setSelectedCqId] = useState<number>(1);
  const [revealedRubrics, setRevealedRubrics] = useState<Record<number, boolean>>({});

  const toggleRubric = (id: number) => {
    setRevealedRubrics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // -------------------------------------------------------------------------
  // CHALLENGES STATE (Step 3)
  // -------------------------------------------------------------------------
  const [challengeInputs, setChallengeInputs] = useState<Record<number, string>>({});
  const [challengeFeedbacks, setChallengeFeedbacks] = useState<
    Record<number, { checked: boolean; isCorrect: boolean; message: string }>
  >({});

  const handleVerifyChallenge = (challenge: ChallengeItem) => {
    const val = parseFloat(challengeInputs[challenge.id] || '');
    if (isNaN(val)) {
      setChallengeFeedbacks((prev) => ({
        ...prev,
        [challenge.id]: {
          checked: true,
          isCorrect: false,
          message: 'দয়া করে একটি সঠিক সংখ্যা লিখুন।',
        },
      }));
      return;
    }
    const isCorrect = Math.abs(val - challenge.targetAnswer) <= challenge.tolerance;
    setChallengeFeedbacks((prev) => ({
      ...prev,
      [challenge.id]: {
        checked: true,
        isCorrect,
        message: isCorrect
          ? `চমৎকার! সঠিক উত্তর: ${challenge.targetAnswer} ${challenge.unit}`
          : `পুনরায় চেষ্টা করো। ইঙ্গিত: ${challenge.hint}`,
      },
    }));
  };

  // -------------------------------------------------------------------------
  // MCQS STATE (Step 4)
  // -------------------------------------------------------------------------
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [checkedMcq, setCheckedMcq] = useState<boolean>(false);

  const calculateMcqScore = () => {
    let score = 0;
    MCQS.forEach((mcq) => {
      if (selectedAnswers[mcq.id] === mcq.correct) score++;
    });
    return score;
  };

  // -------------------------------------------------------------------------
  // CHEAT SHEET COPY (Step 5)
  // -------------------------------------------------------------------------
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  const handleCopyCheatSheet = () => {
    const text = `NCTB Class 9-10 Physics Chapter 12: বিদ্যুতের চৌম্বক ক্রিয়া
১. ট্রান্সফরমার রূপান্তর অনুপাত: V_p / V_s = n_p / n_s = I_s / I_p
২. ট্রান্সফরমারের ক্ষমতার নিত্যতা: P_p = P_s => V_p * I_p = V_s * I_s
৩. সঞ্চালন লাইনে জুল তাপীয় অপচয়: P_loss = I^2 * R
৪. চৌম্বক ক্ষেত্রে তারের ওপর বল: F = B * I * L * sin(theta)
৫. সলিনয়েডের চৌম্বক ক্ষেত্র: B = mu_r * mu_0 * n * I (যেখানে n = N / L)
৬. ফ্যারাডের আবেশ সূত্র: E = -N * (dPhi / dt)
৭. মারাত্মক পরীক্ষক ফাঁদ: ট্রান্সফরমার ডিসি (DC) ভোল্টেজে কাজ করে না (V_s = 0 V)!`;
    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2500);
  };

  // -------------------------------------------------------------------------
  // SOCRATIC AI TUTOR HELPER
  // -------------------------------------------------------------------------
  const handleAskPreset = (question: string, answer: string) => {
    setAiChatResponses((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text: answer },
    ]);
  };

  const handleSendCustomAi = () => {
    if (!aiChatQuery.trim()) return;
    const query = aiChatQuery;
    setAiChatQuery('');

    // Pre-canned responses based on keywords
    let ans =
      'দারুণ প্রশ্ন! চুম্বকত্ব এবং তড়িৎ হলো একই ইলেক্ট্রোম্যাগনেটিক শক্তির দুটি রূপ। তড়িৎ প্রবাহ চুম্বক তৈরি করে, আবার পরিবর্তনশীল চৌম্বক ক্ষেত্র ভোল্টেজ আবিষ্ট করে।';
    if (query.includes('ডিসি') || query.includes('DC') || query.includes('ব্যাটারি')) {
      ans =
        'ট্রান্সফরমারের প্রাইমারিতে ডিসি (DC) দিলে সেকেন্ডারিতে কোনো ভোল্টেজ উৎপন্ন হয় না (V_s = 0 V)। কারণ ডিসি প্রবাহে চৌম্বক ফ্লাক্স স্থির থাকে, কোনো পরিবর্তন (dΦ/dt = 0) হয় না। ফ্যারাডের সূত্র অনুযায়ী ফ্লাক্স পরিবর্তন ছাড়া আবেশ অসম্ভব!';
    } else if (query.includes('কমিউটেটর') || query.includes('মোটর')) {
      ans =
        'ডিসি মোটরে অর্ধ-বলয় কমিউটেটর প্রতি ১৮০° ঘূর্ণনে আর্মেচার কুণ্ডলীতে বিদ্যুৎ প্রবাহের দিক উল্টে দেয়। ফলে টর্কের দিক সবসময় একদিকে বজায় থাকে এবং মোটর অবিচ্ছিন্নভাবে একদিকে ঘোরে। কমিউটেটর না থাকলে মোটর উল্টো দিকে ফিরে এসে সাম্যাবস্থায় আটকে যেত।';
    } else if (query.includes('সঞ্চালন') || query.includes('অপচয়') || query.includes('গ্রিড')) {
      ans =
        'বিদ্যুৎ সঞ্চালনে তারের তাপীয় অপচয় P_loss = I²R। ভোল্টেজকে স্টেপ-আপ করে ১৩২ kV বানালে কারেন্ট I বহুগুণ কমে যায়। ফলে I² এর কারণে লাইনে বিদ্যুৎ অপচয় ৯৯.৯% হ্রাস পায়!';
    } else if (query.includes('লেঞ্জ') || query.includes('Lenz')) {
      ans =
        'লেঞ্জের নিয়ম মূলত শক্তির সংরক্ষণশীলতা নীতি! যখন একটি উত্তর মেরু কুণ্ডলীর দিকে নেওয়া হয়, কুণ্ডলীটি নিজে একটি উত্তর মেরু সৃষ্টি করে তাকে বিকর্ষণ করে। ফলে ওই বিকর্ষণের বিরুদ্ধে যান্ত্রিক কাজ করে চুম্বকটিকে সরাতে হয়, যা তড়িৎ শক্তিতে রূপান্তরিত হয়।';
    }

    setAiChatResponses((prev) => [
      ...prev,
      { role: 'user', text: query },
      { role: 'assistant', text: ans },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* ------------------------------------------------------------------- */}
      {/* HEADER & CHAPTER BREADCRUMB */}
      {/* ------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/playground/v2"
              className="flex items-center space-x-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <Compass className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-wider font-semibold">লাইব্রেরি</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                অধ্যায় ১২
              </span>
              <h1 className="text-sm font-semibold text-slate-200 hidden sm:inline-block">
                বিদ্যুতের চৌম্বক ক্রিয়া
              </h1>
            </div>
          </div>

          {/* Socratic AI Drawer Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all shadow-sm shadow-emerald-950"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>শেরু এআই গাইড</span>
            </button>
            <Link
              href="/dashboard/playground/v2/physics/11"
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              পূর্ববর্তী: অধ্যায় ১১
            </Link>
          </div>
        </div>

        {/* 5-Step Learning Navigation Tabs */}
        <div className="border-t border-slate-900 bg-slate-950/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4">
            {[
              { id: 1, label: '১. মূল ধারণা ও ল্যাব', sub: '৫টি ইন্টারেক্টিভ সিমুলেটর' },
              { id: 2, label: '২. সৃজনশীল উদাহরণ', sub: 'বোর্ড প্রশ্ন ও পরীক্ষকের কথা' },
              { id: 3, label: '৩. নিজে করো চ্যালেঞ্জ', sub: 'হ্যান্ডস-অন গাণিতিক ধাঁধা' },
              { id: 4, label: '৪. যাচাই ও কুইজ', sub: 'এনসিটিবি বোর্ড স্ট্যান্ডার্ড MCQ' },
              { id: 5, label: '৫. সূত্র ও চিট-শিট', sub: 'রিভিশন নোটস ও পরীক্ষক ফাঁদ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStep(tab.id)}
                className={`py-3 px-3 sm:px-4 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                  activeStep === tab.id
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
                <div className="text-[10px] text-slate-500 hidden md:block">{tab.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================================================================= */}
        {/* STEP 1: LEARN CONCEPT & 5 SPECIALIZED LABS */}
        {/* ================================================================= */}
        {activeStep === 1 && (
          <div className="space-y-8">
            {/* Lab Sub-Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {LAB_LESSONS.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setActiveLab(lab.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    activeLab === lab.id
                      ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-md shadow-emerald-950'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {lab.badge}
                    </span>
                    <span className="text-[10px] text-slate-500">{lab.nctbPage}</span>
                  </div>
                  <div className="text-xs font-semibold line-clamp-2">{lab.title}</div>
                </button>
              ))}
            </div>

            {/* Selected Lab Intro Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    {LAB_LESSONS[activeLab - 1].badge}
                  </span>
                  <h2 className="text-xl font-bold text-slate-100 mt-0.5">
                    {LAB_LESSONS[activeLab - 1].title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {LAB_LESSONS[activeLab - 1].intro}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400 shrink-0">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>এনসিটিবি পাঠ্যবই {LAB_LESSONS[activeLab - 1].nctbPage}</span>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* LAB 1: OERSTED EXPERIMENT & RIGHT-HAND THUMB RULE */}
              {/* ------------------------------------------------------------- */}
              {activeLab === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Controls */}
                  <div className="lg:col-span-5 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>পরীক্ষার প্যারামিটার নিয়ন্ত্রণ</span>
                    </h3>

                    {/* Current Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">তড়িৎ প্রবাহ (I):</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {oerstedCurrent > 0 ? `+${oerstedCurrent} A (উত্তরমুখী)` : oerstedCurrent < 0 ? `${oerstedCurrent} A (দক্ষিণমুখী)` : '0 A (বিদ্যুৎহীন)'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="1"
                        value={oerstedCurrent}
                        onChange={(e) => setOerstedCurrent(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>-10 A (দক্ষিণ)</span>
                        <span>0 A (বন্ধ)</span>
                        <span>+10 A (উত্তর)</span>
                      </div>
                    </div>

                    {/* Compass Placement Toggle */}
                    <div>
                      <label className="text-xs text-slate-400 block mb-1.5">
                        কম্পাস সূচের অবস্থান (Placement):
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setCompassPlacement('above')}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            compassPlacement === 'above'
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                              : 'border-slate-800 bg-slate-900 text-slate-400'
                          }`}
                        >
                          তারের উপরে (Above Wire)
                        </button>
                        <button
                          onClick={() => setCompassPlacement('below')}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            compassPlacement === 'below'
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                              : 'border-slate-800 bg-slate-900 text-slate-400'
                          }`}
                        >
                          তারের নিচে (Below Wire)
                        </button>
                      </div>
                    </div>

                    {/* Distance Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">তার থেকে দূরত্ব (r):</span>
                        <span className="font-mono font-bold text-sky-400">{wireDistance} cm</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={wireDistance}
                        onChange={(e) => setWireDistance(parseFloat(e.target.value))}
                        className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Real-time Math Output Card */}
                    <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">তারের চৌম্বক ক্ষেত্র (B):</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {bFieldMicroTesla.toFixed(1)} μT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">পৃথিবীর অনুভূমিক ক্ষেত্র (B_E):</span>
                        <span className="font-mono text-slate-300">40.0 μT</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                        <span className="text-slate-300">কাঁটার মোট বিক্ষেপ (Deflection):</span>
                        <span
                          className={`font-mono ${
                            signedDeflectionDeg !== 0 ? 'text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          {signedDeflectionDeg !== 0
                            ? `${Math.abs(signedDeflectionDeg)}° ${deflectionDirection === 'East' ? 'পূর্ব দিকে' : 'পশ্চিম দিকে'}`
                            : '০° (উত্তর বরাবর স্থির)'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Direction Reversal */}
                    <button
                      onClick={() => setOerstedCurrent((prev) => -prev)}
                      className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                      <span>প্রবাহের দিক উল্টাও (Reverse Polarity)</span>
                    </button>
                  </div>

                  {/* Right Live SVG & Compass Visualization */}
                  <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">
                        ওয়েরস্টেডের সেটআপ ও কম্পাস বিক্ষেপ (চিত্র ১২.০২)
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">
                        ডান হাতের বৃদ্ধাঙ্গুলি নীতি
                      </span>
                    </div>

                    {/* SVG Canvas */}
                    <div className="w-full h-72 sm:h-80 relative flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
                      <svg viewBox="0 0 500 320" className="w-full h-full">
                        {/* Background Grid */}
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                          </pattern>
                          <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                          >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                          </marker>
                          <marker
                            id="fieldArrow"
                            viewBox="0 0 10 10"
                            refX="5"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                          >
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                          </marker>
                        </defs>
                        <rect width="500" height="320" fill="url(#grid)" />

                        {/* Cardboard Base */}
                        <polygon
                          points="120,60 380,60 340,260 80,260"
                          fill="#1e293b"
                          fillOpacity="0.4"
                          stroke="#334155"
                          strokeWidth="1.5"
                        />

                        {/* Concentric Magnetic Field Lines around wire */}
                        {oerstedCurrent !== 0 && (
                          <g stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" fill="none">
                            <ellipse cx="230" cy="160" rx="45" ry="25" />
                            <ellipse cx="230" cy="160" rx="80" ry="45" />
                            <ellipse cx="230" cy="160" rx="115" ry="65" />
                            {/* Direction Arrows on Field Lines */}
                            <path
                              d={
                                oerstedCurrent > 0
                                  ? 'M 230,115 A 80,45 0 0,1 310,160'
                                  : 'M 310,160 A 80,45 0 0,1 230,205'
                              }
                              stroke="#38bdf8"
                              strokeWidth="2"
                              markerEnd="url(#fieldArrow)"
                            />
                          </g>
                        )}

                        {/* Vertical Copper Wire piercing cardboard */}
                        <line
                          x1="230"
                          y1="20"
                          x2="230"
                          y2="300"
                          stroke="#b45309"
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                        <line
                          x1="230"
                          y1="20"
                          x2="230"
                          y2="300"
                          stroke="#f59e0b"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />

                        {/* Current Flow Arrow */}
                        {oerstedCurrent !== 0 && (
                          <g>
                            <line
                              x1="230"
                              y1={oerstedCurrent > 0 ? '280' : '40'}
                              x2="230"
                              y2={oerstedCurrent > 0 ? '50' : '270'}
                              stroke="#10b981"
                              strokeWidth="3"
                              markerEnd="url(#arrow)"
                            />
                            <text
                              x="245"
                              y={oerstedCurrent > 0 ? '70' : '260'}
                              fill="#10b981"
                              fontSize="12"
                              fontWeight="bold"
                            >
                              I ({oerstedCurrent > 0 ? 'উত্তর/উপরে' : 'দক্ষিণ/নিচে'})
                            </text>
                          </g>
                        )}

                        {/* Interactive Magnetic Compass */}
                        {/* Center coordinates depend on placement: above (y: 110) vs below (y: 210) */}
                        <g
                          transform={`translate(${compassPlacement === 'above' ? 230 : 230}, ${
                            compassPlacement === 'above' ? 110 : 210
                          })`}
                        >
                          {/* Compass outer casing */}
                          <circle r="36" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                          <circle r="32" fill="#1e293b" stroke="#334155" strokeWidth="1" />

                          {/* Dial Markings */}
                          <text x="0" y="-22" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">
                            N
                          </text>
                          <text x="0" y="27" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">
                            S
                          </text>
                          <text x="24" y="3" textAnchor="middle" fill="#64748b" fontSize="8">
                            E
                          </text>
                          <text x="-24" y="3" textAnchor="middle" fill="#64748b" fontSize="8">
                            W
                          </text>

                          {/* Rotating Compass Needle */}
                          <g transform={`rotate(${signedDeflectionDeg})`}>
                            {/* North Pointer (Red) */}
                            <polygon points="0,-28 6,0 -6,0" fill="#ef4444" />
                            {/* South Pointer (Blue) */}
                            <polygon points="0,28 6,0 -6,0" fill="#3b82f6" />
                            {/* Pivot Pin */}
                            <circle r="3.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
                          </g>
                        </g>

                        {/* Geographic Orientation Legend */}
                        <g transform="translate(430, 45)">
                          <circle r="18" fill="#1e293b" stroke="#334155" />
                          <line x1="0" y1="12" x2="0" y2="-12" stroke="#ef4444" strokeWidth="2" />
                          <text x="0" y="-14" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">
                            উ (N)
                          </text>
                          <text x="0" y="22" textAnchor="middle" fill="#64748b" fontSize="8">
                            দ (S)
                          </text>
                          <text x="18" y="3" textAnchor="middle" fill="#64748b" fontSize="8">
                            পূ
                          </text>
                          <text x="-18" y="3" textAnchor="middle" fill="#64748b" fontSize="8">
                            প
                          </text>
                        </g>
                      </svg>
                    </div>

                    {/* Explanatory Caption */}
                    <div className="mt-4 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 w-full space-y-1">
                      <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                        <Info className="w-4 h-4" />
                        <span>ডান হাতের নিয়মের ফলাফল:</span>
                      </div>
                      <p className="leading-relaxed">
                        তারের ওপর বুড়ো আঙুল তড়িৎ প্রবাহের দিকে ধরলে অন্য আঙুলগুলো বৃত্তাকার চৌম্বক ক্ষেত্রের দিক দেখায়।
                        {oerstedCurrent > 0
                          ? ' তারের ওপরের অংশে ক্ষেত্রটি পশ্চিম দিকে এবং নিচের অংশে পূর্ব দিকে। ফলে তারের উপরে কম্পাস রাখলে এটি পশ্চিমমুখী এবং নিচে রাখলে পূর্বমুখী বিক্ষেপ দেয়।'
                          : oerstedCurrent < 0
                          ? ' প্রবাহ উল্টে যাওয়ায় চৌম্বক ক্ষেত্রের দিক উল্টে গেছে।'
                          : ' তড়িৎ প্রবাহ বন্ধ থাকায় কম্পাস পৃথিবীর নিজস্ব চৌম্বক ক্ষেত্রে উত্তর-দক্ষিণ বরাবর সোজা আছে।'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 2: SOLENOID & ELECTROMAGNET DOMAINS */}
              {/* ------------------------------------------------------------- */}
              {activeLab === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Controls */}
                  <div className="lg:col-span-5 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>সলিনয়েড ও মজ্জা কনফিগারেশন</span>
                    </h3>

                    {/* Turns Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">পাকসংখ্যা (N):</span>
                        <span className="font-mono font-bold text-emerald-400">{solenoidTurns} turns</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={solenoidTurns}
                        onChange={(e) => setSolenoidTurns(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Current Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">তড়িৎ প্রবাহ (I):</span>
                        <span className="font-mono font-bold text-amber-400">{solenoidCurrent} A</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={solenoidCurrent}
                        onChange={(e) => setSolenoidCurrent(parseInt(e.target.value))}
                        className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Core Material Selector */}
                    <div>
                      <label className="text-xs text-slate-400 block mb-1.5">
                        কোর বা মজ্জা উপাদান (Core Material):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'air', label: 'বাতাস (Air)', sub: 'μ_r = 1' },
                          { id: 'soft_iron', label: 'নরম লোহা', sub: 'μ_r = 1200' },
                          { id: 'steel', label: 'ইস্পাত (Steel)', sub: 'μ_r = 150' },
                        ].map((mat) => (
                          <button
                            key={mat.id}
                            onClick={() => setCoreMaterial(mat.id as any)}
                            className={`p-2 rounded-lg border text-left transition-all ${
                              coreMaterial === mat.id
                                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                                : 'border-slate-800 bg-slate-900 text-slate-400'
                            }`}
                          >
                            <div className="text-xs font-semibold">{mat.label}</div>
                            <div className="text-[10px] text-slate-500">{mat.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Power Switch Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">বিদ্যুৎ সংযোগ (Power Switch)</div>
                        <div className="text-[10px] text-slate-500">
                          {isPowerOn ? 'কারেন্ট প্রবাহিত হচ্ছে' : 'সংযোগ বিচ্ছিন্ন (OFF)'}
                        </div>
                      </div>
                      <button
                        onClick={() => setIsPowerOn(!isPowerOn)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isPowerOn
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isPowerOn ? 'বিদ্যুৎ কাটো (CUT)' : 'সংযোগ দাও (ON)'}
                      </button>
                    </div>

                    {/* Calculated Magnetic Power */}
                    <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">চৌম্বক ক্ষেত্র (B):</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {bSolenoidTesla.toFixed(3)} Tesla
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">লোহার পেরেক আকর্ষণ ক্ষমতা:</span>
                        <span className="font-mono text-amber-400 font-bold">{nailCount} টি পেরেক</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1.5">
                        <span className="text-slate-400">চুম্বকত্ব প্রকৃতি:</span>
                        <span className="text-slate-300 font-medium">
                          {coreMaterial === 'soft_iron'
                            ? isPowerOn
                              ? 'শক্তিশালী অস্থায়ী তাড়িতচুম্বক'
                              : 'বিদ্যুৎ কাটার সাথে সাথে শূন্য'
                            : coreMaterial === 'steel'
                            ? isPowerOn
                              ? 'স্থায়ী চুম্বকে পরিণত হচ্ছে'
                              : 'অবশিষ্ট চুম্বকত্ব বিদ্যমান'
                            : 'দুর্বল বায়বীয় সলিনয়েড'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Solenoid & Domain Visualizer */}
                  <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">
                        তাড়িতচুম্বক ও ডোমেইন সারিবদ্ধকরণ (চিত্র ১২.০৭)
                      </span>
                      <span className="text-amber-400 font-mono text-[11px]">
                        B ∝ N × I × μ_r
                      </span>
                    </div>

                    {/* SVG Solenoid Visualizer */}
                    <div className="w-full h-72 sm:h-80 relative flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
                      <svg viewBox="0 0 500 320" className="w-full h-full">
                        {/* Iron Core Bar */}
                        <rect
                          x="90"
                          y="130"
                          width="320"
                          height="60"
                          rx="8"
                          fill={
                            coreMaterial === 'soft_iron'
                              ? '#475569'
                              : coreMaterial === 'steel'
                              ? '#334155'
                              : 'transparent'
                          }
                          stroke="#64748b"
                          strokeWidth="2"
                        />

                        {/* Magnetic Domains Grid inside Core */}
                        {coreMaterial !== 'air' && (
                          <g opacity={isPowerOn ? 1 : 0.4}>
                            {Array.from({ length: 12 }).map((_, i) => {
                              const x = 110 + (i % 6) * 48;
                              const y = 145 + Math.floor(i / 6) * 28;
                              // Aligned arrows when power on, randomized when power off (unless steel)
                              const angle = isPowerOn
                                ? 0 // completely aligned pointing Right (North)
                                : coreMaterial === 'steel'
                                ? 15 // some remnant alignment
                                : (i * 73) % 360; // completely random for soft iron
                              return (
                                <g key={i} transform={`translate(${x}, ${y}) rotate(${angle})`}>
                                  <line
                                    x1="-12"
                                    y1="0"
                                    x2="12"
                                    y2="0"
                                    stroke={isPowerOn ? '#38bdf8' : '#94a3b8'}
                                    strokeWidth="2"
                                  />
                                  <polygon
                                    points="12,0 7,-4 7,4"
                                    fill={isPowerOn ? '#38bdf8' : '#94a3b8'}
                                  />
                                </g>
                              );
                            })}
                          </g>
                        )}

                        {/* Solenoid Wire Loops Wrapping Core */}
                        {Array.from({ length: Math.min(20, solenoidTurns) }).map((_, idx) => {
                          const x = 100 + idx * (300 / Math.min(20, solenoidTurns));
                          return (
                            <g key={idx}>
                              {/* Front loop arc */}
                              <path
                                d={`M ${x},120 C ${x + 10},120 ${x + 10},200 ${x},200`}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="4"
                                strokeLinecap="round"
                              />
                            </g>
                          );
                        })}

                        {/* External Magnetic Field Lines (Looped) */}
                        {isPowerOn && activeSolenoidCurrent > 0 && (
                          <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 3" fill="none">
                            <path d="M 410,140 C 470,80 30,80 90,140" />
                            <path d="M 410,180 C 470,240 30,240 90,180" />
                            <path d="M 410,160 C 490,40 10,40 90,160" />
                            <path d="M 410,160 C 490,280 10,280 90,160" />
                          </g>
                        )}

                        {/* North & South Poles Badges */}
                        {isPowerOn && activeSolenoidCurrent > 0 && (
                          <g>
                            <rect x="55" y="140" width="30" height="40" rx="4" fill="#3b82f6" />
                            <text x="70" y="165" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                              S
                            </text>

                            <rect x="415" y="140" width="30" height="40" rx="4" fill="#ef4444" />
                            <text x="430" y="165" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                              N
                            </text>
                          </g>
                        )}

                        {/* Attracted Nails hanging below */}
                        {nailCount > 0 && (
                          <g transform="translate(415, 195)">
                            {Array.from({ length: Math.min(15, nailCount) }).map((_, ni) => (
                              <line
                                key={ni}
                                x1={ni * 2 - 10}
                                y1="0"
                                x2={ni * 2 - 10 + (ni % 3) * 2}
                                y2="35"
                                stroke="#94a3b8"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                            ))}
                            <text x="0" y="50" fill="#f59e0b" fontSize="11" fontWeight="bold">
                              {nailCount} টি পেরেক আকৃষ্ট
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* Explanatory Caption */}
                    <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-slate-300 w-full space-y-1">
                      <div className="font-semibold text-amber-400 flex items-center space-x-1.5">
                        <Info className="w-4 h-4" />
                        <span>নরম লোহা বনাম ইস্পাতের পার্থক্য:</span>
                      </div>
                      <p className="leading-relaxed">
                        নরম লোহার ভেতরে ডোমেইনগুলো বিদ্যুৎ প্রবাহের সাথে সাথে অত্যন্ত দ্রুত সারিবদ্ধ হয়ে শতগুণ শক্তিশালী ক্ষেত্র তৈরি করে। কিন্তু সুইচ বন্ধ করার সাথে সাথে তাপশক্তির কারণে ডোমেইনগুলো আবার এলোমেলো হয়ে যায় (অস্থায়ী চুম্বক)। ইস্পাত ডোমেইন আটকে রাখে বলে এটি দিয়ে স্থায়ী চুম্বক তৈরি করা হয়।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 3: DC MOTOR & FLEMING'S LEFT-HAND RULE */}
              {/* ------------------------------------------------------------- */}
              {activeLab === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Controls */}
                  <div className="lg:col-span-5 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>মোটর প্যারামিটার ও কন্ট্রোল</span>
                    </h3>

                    {/* Magnetic Field Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">চৌম্বক ক্ষেত্র (B):</span>
                        <span className="font-mono font-bold text-sky-400">{motorB.toFixed(1)} T</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={motorB}
                        onChange={(e) => setMotorB(parseFloat(e.target.value))}
                        className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Armature Current Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">আর্মেচার প্রবাহ (I):</span>
                        <span className="font-mono font-bold text-emerald-400">{motorCurrent} A</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={motorCurrent}
                        onChange={(e) => setMotorCurrent(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Commutator Switch */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">অর্ধ-বলয় কমিউটেটর (Split Ring)</div>
                        <div className="text-[10px] text-slate-500">
                          {hasCommutator ? 'স্বাভাবিক কার্যক্ষম মোটর' : 'কমিউটেটর বিহীন ত্রুটিপূর্ণ সেটআপ'}
                        </div>
                      </div>
                      <button
                        onClick={() => setHasCommutator(!hasCommutator)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          hasCommutator
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {hasCommutator ? 'কমিউটেটর সক্রিয়' : 'স্লিপ রিং (ত্রুটি)'}
                      </button>
                    </div>

                    {/* Play / Pause & Reverse Polarity */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setIsMotorRunning(!isMotorRunning)}
                        className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        {isMotorRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{isMotorRunning ? 'থামাও (Pause)' : 'চালু করো (Run)'}</span>
                      </button>
                      <button
                        onClick={() => setBatteryReversed(!batteryReversed)}
                        className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <Repeat className="w-3.5 h-3.5 text-amber-400" />
                        <span>ঘূর্ণন দিক পরিবর্তন</span>
                      </button>
                    </div>

                    {/* Output Dynamics */}
                    <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">বাহুর ওপর চৌম্বক বল (F = BIL):</span>
                        <span className="font-mono text-emerald-400 font-bold">{motorForcePerSide} N</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">বর্তমান ঘূর্ণন টর্ক (Torque):</span>
                        <span className="font-mono text-amber-400 font-bold">{currentTorque} N·m</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1.5">
                        <span className="text-slate-400">মোটরের অবস্থা:</span>
                        <span className="text-slate-200 font-medium">
                          {hasCommutator
                            ? isMotorRunning
                              ? 'অবিচ্ছিন্ন ৩৬০° একমুখী ঘূর্ণন'
                              : 'স্থির'
                            : 'কমিউটেটর ছাড়া ৯০° কোণে আটকে গেছে'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Live Motor Simulation */}
                  <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">
                        ডিসি মোটরের আর্মেচার ঘূর্ণন (চিত্র ১২.১১)
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">
                        কৌণিক অবস্থান: {Math.round(motorAngle % 360)}°
                      </span>
                    </div>

                    {/* SVG Motor Canvas */}
                    <div className="w-full h-72 sm:h-80 relative flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
                      <svg viewBox="0 0 500 320" className="w-full h-full">
                        {/* Permanent Magnets Pole Shoes */}
                        {/* Left Pole Shoe (North - Red) */}
                        <path d="M 30,70 L 120,70 L 120,250 L 30,250 Z" fill="#b91c1c" />
                        <text x="75" y="165" fill="#ffffff" fontWeight="bold" fontSize="24" textAnchor="middle">
                          N
                        </text>

                        {/* Right Pole Shoe (South - Blue) */}
                        <path d="M 380,70 L 470,70 L 470,250 L 380,250 Z" fill="#1d4ed8" />
                        <text x="425" y="165" fill="#ffffff" fontWeight="bold" fontSize="24" textAnchor="middle">
                          S
                        </text>

                        {/* Magnetic Field Lines (N to S) */}
                        <g stroke="#0284c7" strokeWidth="1" strokeDasharray="4 4" opacity="0.6">
                          <line x1="120" y1="100" x2="380" y2="100" />
                          <line x1="120" y1="130" x2="380" y2="130" />
                          <line x1="120" y1="160" x2="380" y2="160" />
                          <line x1="120" y1="190" x2="380" y2="190" />
                          <line x1="120" y1="220" x2="380" y2="220" />
                        </g>

                        {/* Rotating Armature Coil (Center 250, 160) */}
                        <g transform={`translate(250, 160) rotate(${motorAngle})`}>
                          {/* Armature core plate */}
                          <rect x="-80" y="-12" width="160" height="24" rx="4" fill="#334155" stroke="#475569" />

                          {/* Copper Coil Wrapping */}
                          <line x1="-80" y1="-8" x2="80" y2="-8" stroke="#f59e0b" strokeWidth="4" />
                          <line x1="-80" y1="8" x2="80" y2="8" stroke="#f59e0b" strokeWidth="4" />

                          {/* Force Arrows on Armature Edges */}
                          <g transform="translate(-75, 0)">
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2={batteryReversed ? '35' : '-35'}
                              stroke="#10b981"
                              strokeWidth="3"
                              markerEnd="url(#arrow)"
                            />
                            <text
                              x="-15"
                              y={batteryReversed ? '42' : '-40'}
                              fill="#10b981"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              F_AB
                            </text>
                          </g>

                          <g transform="translate(75, 0)">
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2={batteryReversed ? '-35' : '35'}
                              stroke="#10b981"
                              strokeWidth="3"
                              markerEnd="url(#arrow)"
                            />
                            <text
                              x="10"
                              y={batteryReversed ? '-40' : '42'}
                              fill="#10b981"
                              fontSize="10"
                              fontWeight="bold"
                            >
                              F_CD
                            </text>
                          </g>
                        </g>

                        {/* Center Commutator & Brushes Assembly */}
                        <g transform="translate(250, 160)">
                          {/* Central Shaft */}
                          <circle r="14" fill="#64748b" stroke="#334155" strokeWidth="2" />

                          {/* Commutator Split-Rings */}
                          {hasCommutator ? (
                            <g transform={`rotate(${motorAngle})`}>
                              <path
                                d="M -12,-8 A 12,12 0 0,1 12,-8"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="4"
                              />
                              <path
                                d="M 12,8 A 12,12 0 0,1 -12,8"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="4"
                              />
                            </g>
                          ) : (
                            <circle r="12" fill="none" stroke="#f59e0b" strokeWidth="4" />
                          )}

                          {/* Carbon Brushes Touching Commutator */}
                          <rect x="-24" y="-5" width="8" height="10" fill="#1e293b" stroke="#94a3b8" />
                          <rect x="16" y="-5" width="8" height="10" fill="#1e293b" stroke="#94a3b8" />
                        </g>

                        {/* Power Source Connection wires at bottom */}
                        <path d="M 226,160 L 226,280 L 240,280" stroke="#ef4444" strokeWidth="2" fill="none" />
                        <path d="M 274,160 L 274,280 L 260,280" stroke="#3b82f6" strokeWidth="2" fill="none" />
                        <text x="250" y="295" fill="#94a3b8" fontSize="10" textAnchor="middle">
                          ডিসি ব্যাটারি উৎস
                        </text>
                      </svg>
                    </div>

                    {/* Fleming's Left Hand Rule Guide Banner */}
                    <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center text-xs">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-emerald-400 font-bold block">১. বৃদ্ধাঙ্গুলি (Thumb)</span>
                        <span className="text-[11px] text-slate-400">বলের দিক (Motion / Force)</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-sky-400 font-bold block">২. তর্জনী (Forefinger)</span>
                        <span className="text-[11px] text-slate-400">চৌম্বক ক্ষেত্র (Field N→S)</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-amber-400 font-bold block">৩. মধ্যমা (Middle finger)</span>
                        <span className="text-[11px] text-slate-400">তড়িৎ প্রবাহ (Current)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 4: ELECTROMAGNETIC INDUCTION & GENERATOR */}
              {/* ------------------------------------------------------------- */}
              {activeLab === 4 && (
                <div className="space-y-6">
                  {/* Sub-mode Switcher */}
                  <div className="flex border-b border-slate-800 pb-3 space-x-3">
                    <button
                      onClick={() => setInductionSubMode('faraday')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        inductionSubMode === 'faraday'
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      মোড ক: ফ্যারাডের দণ্ড চুম্বক ও কুণ্ডলী আবেশ ল্যাব
                    </button>
                    <button
                      onClick={() => setInductionSubMode('generator')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        inductionSubMode === 'generator'
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      মোড খ: এসি / ডিসি জেনারেটর সিমুলেটর
                    </button>
                  </div>

                  {/* Sub-Mode A: Faraday Coil & Magnet */}
                  {inductionSubMode === 'faraday' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Controls */}
                      <div className="lg:col-span-5 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                          <Sliders className="w-4 h-4 text-emerald-400" />
                          <span>আবেশ নিয়ন্ত্রণ প্যানেল</span>
                        </h3>

                        {/* Magnet Pole Selector */}
                        <div>
                          <label className="text-xs text-slate-400 block mb-1.5">
                            কুণ্ডলীর দিকে মুখ করা মেরু (Facing Pole):
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setMagnetPoleFacing('N')}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                magnetPoleFacing === 'N'
                                  ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                                  : 'border-slate-800 bg-slate-900 text-slate-400'
                              }`}
                            >
                              উত্তর মেরু (North Pole)
                            </button>
                            <button
                              onClick={() => setMagnetPoleFacing('S')}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                magnetPoleFacing === 'S'
                                  ? 'border-sky-500 bg-sky-950/40 text-sky-300'
                                  : 'border-slate-800 bg-slate-900 text-slate-400'
                              }`}
                            >
                              দক্ষিণ মেরু (South Pole)
                            </button>
                          </div>
                        </div>

                        {/* Push In / Pull Out Dynamic Buttons */}
                        <div>
                          <label className="text-xs text-slate-400 block mb-1.5">
                            চুম্বক নাড়াচাড়া (Magnet Action):
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onMouseDown={() => {
                                setMagnetVelocity(-6);
                                setMagnetPosition(10);
                              }}
                              onMouseUp={() => setMagnetVelocity(0)}
                              className="py-2.5 px-2 bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-lg transition-colors text-center active:scale-95"
                            >
                              ভেতরে ঢোকাও (In)
                            </button>
                            <button
                              onClick={() => setMagnetVelocity(0)}
                              className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors text-center"
                            >
                              স্থির (Stop)
                            </button>
                            <button
                              onMouseDown={() => {
                                setMagnetVelocity(6);
                                setMagnetPosition(70);
                              }}
                              onMouseUp={() => setMagnetVelocity(0)}
                              className="py-2.5 px-2 bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-lg transition-colors text-center active:scale-95"
                            >
                              টেনে বের করো (Out)
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            বোতাম চেপে ধরলে গ্যালভানোমিটারের কাঁটা তাৎক্ষণিক বিক্ষেপ দেখাবে।
                          </span>
                        </div>

                        {/* Coil Turns Slider */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">কুণ্ডলীর পাকসংখ্যা (N):</span>
                            <span className="font-mono font-bold text-emerald-400">{faradayTurns} turns</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="500"
                            step="50"
                            value={faradayTurns}
                            onChange={(e) => setFaradayTurns(parseInt(e.target.value))}
                            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Live Output Card */}
                        <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">আবিষ্ট তড়িচ্চালক শক্তি (EMF):</span>
                            <span
                              className={`font-mono font-bold ${
                                inducedEmfFaraday !== 0 ? 'text-amber-400' : 'text-slate-400'
                              }`}
                            >
                              {inducedEmfFaraday !== 0 ? `${inducedEmfFaraday} V` : '০ V (স্থির অবস্থায় আবেশ শূন্য)'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">লেঞ্জের নিয়ম অনুসারে বাধা:</span>
                            <span className="text-emerald-400 font-semibold">
                              {magnetVelocity < 0
                                ? `কুণ্ডলীর মুখে ${magnetPoleFacing} মেরু সৃষ্টি হয়ে বিকর্ষণ করছে`
                                : magnetVelocity > 0
                                ? `কুণ্ডলীর মুখে বিপরীত মেরু সৃষ্টি হয়ে আকর্ষণ করছে`
                                : 'চৌম্বক ফ্লাক্স পরিবর্তন হচ্ছে না'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Live SVG */}
                      <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
                        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-slate-300">
                            সলিনয়েডে চুম্বক প্রবেশ ও গ্যালভানোমিটার (চিত্র ১২.১২)
                          </span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            E = -N (dΦ / dt)
                          </span>
                        </div>

                        <div className="w-full h-72 sm:h-80 relative flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
                          <svg viewBox="0 0 500 320" className="w-full h-full">
                            {/* Bar Magnet (Position controlled) */}
                            <g
                              transform={`translate(${
                                40 + (magnetPosition * 1.5)
                              }, 130)`}
                              className="transition-transform duration-200"
                            >
                              {/* Magnet Body */}
                              <rect
                                x="0"
                                y="0"
                                width="60"
                                height="40"
                                fill={magnetPoleFacing === 'N' ? '#3b82f6' : '#ef4444'}
                                rx="3"
                              />
                              <text x="30" y="25" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                                {magnetPoleFacing === 'N' ? 'S' : 'N'}
                              </text>

                              <rect
                                x="60"
                                y="0"
                                width="60"
                                height="40"
                                fill={magnetPoleFacing === 'N' ? '#ef4444' : '#3b82f6'}
                                rx="3"
                              />
                              <text x="90" y="25" fill="#ffffff" fontWeight="bold" fontSize="16" textAnchor="middle">
                                {magnetPoleFacing === 'N' ? 'N' : 'S'}
                              </text>

                              {/* Velocity arrow */}
                              {magnetVelocity !== 0 && (
                                <g transform="translate(60, -15)">
                                  <line
                                    x1="0"
                                    y1="0"
                                    x2={magnetVelocity < 0 ? '-30' : '30'}
                                    y2="0"
                                    stroke="#10b981"
                                    strokeWidth="3"
                                    markerEnd="url(#arrow)"
                                  />
                                  <text
                                    x="0"
                                    y="-6"
                                    fill="#10b981"
                                    fontSize="10"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                  >
                                    v
                                  </text>
                                </g>
                              )}
                            </g>

                            {/* Solenoid Coil on Right */}
                            <g transform="translate(250, 110)">
                              {/* Hollow Core */}
                              <rect x="0" y="20" width="160" height="40" fill="#1e293b" rx="4" />

                              {/* Solenoid loops */}
                              {Array.from({ length: 8 }).map((_, li) => (
                                <path
                                  key={li}
                                  d={`M ${li * 20 + 10},10 C ${li * 20 + 25},10 ${li * 20 + 25},70 ${li * 20 + 10},70`}
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="4"
                                />
                              ))}

                              {/* Lenz Induced Pole Indicator on coil entrance */}
                              {inducedEmfFaraday !== 0 && (
                                <g transform="translate(-15, 40)">
                                  <circle
                                    r="16"
                                    fill={
                                      magnetVelocity < 0
                                        ? magnetPoleFacing === 'N'
                                          ? '#ef4444'
                                          : '#3b82f6'
                                        : magnetPoleFacing === 'N'
                                        ? '#3b82f6'
                                        : '#ef4444'
                                    }
                                  />
                                  <text
                                    x="0"
                                    y="5"
                                    fill="#ffffff"
                                    fontWeight="bold"
                                    fontSize="12"
                                    textAnchor="middle"
                                  >
                                    {magnetVelocity < 0
                                      ? magnetPoleFacing
                                      : magnetPoleFacing === 'N'
                                      ? 'S'
                                      : 'N'}
                                  </text>
                                </g>
                              )}
                            </g>

                            {/* Connecting Wires to Center-Zero Galvanometer */}
                            <path d="M 260,180 L 260,250 L 310,250" stroke="#94a3b8" strokeWidth="2" fill="none" />
                            <path d="M 400,180 L 400,250 L 350,250" stroke="#94a3b8" strokeWidth="2" fill="none" />

                            {/* Galvanometer Dial */}
                            <g transform="translate(330, 250)">
                              <circle r="32" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                              <text x="0" y="-18" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">
                                0 (Galvanometer)
                              </text>
                              {/* Scale markings */}
                              <line x1="-15" y1="-10" x2="-20" y2="-15" stroke="#64748b" strokeWidth="1.5" />
                              <line x1="0" y1="-10" x2="0" y2="-16" stroke="#10b981" strokeWidth="2" />
                              <line x1="15" y1="-10" x2="20" y2="-15" stroke="#64748b" strokeWidth="1.5" />

                              {/* Deflecting Needle */}
                              <g
                                transform={`rotate(${
                                  inducedEmfFaraday !== 0
                                    ? inducedEmfFaraday > 0
                                      ? 35
                                      : -35
                                    : 0
                                })`}
                                className="transition-transform duration-200"
                              >
                                <line x1="0" y1="0" x2="0" y2="-26" stroke="#ef4444" strokeWidth="2" />
                                <circle r="3" fill="#ffffff" />
                              </g>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-Mode B: AC / DC Generator */}
                  {inductionSubMode === 'generator' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      <div className="lg:col-span-5 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-bold text-slate-200">জেনারেটর কনফিগারেশন</h3>

                        {/* Output Type: AC vs DC */}
                        <div>
                          <label className="text-xs text-slate-400 block mb-1.5">
                            আউটপুট বিদ্যুৎ রূপ (Output Type):
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setGenOutputType('ac')}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                genOutputType === 'ac'
                                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                                  : 'border-slate-800 bg-slate-900 text-slate-400'
                              }`}
                            >
                              এসি (AC - স্লিপ রিং)
                            </button>
                            <button
                              onClick={() => setGenOutputType('dc')}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                genOutputType === 'dc'
                                  ? 'border-amber-500 bg-amber-950/40 text-amber-300'
                                  : 'border-slate-800 bg-slate-900 text-slate-400'
                              }`}
                            >
                              ডিসি (DC - স্প্লিট রিং)
                            </button>
                          </div>
                        </div>

                        {/* RPM Speed Slider */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">আর্মেচার ঘূর্ণন গতি:</span>
                            <span className="font-mono font-bold text-emerald-400">{genRpm} RPM</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            step="5"
                            value={genRpm}
                            onChange={(e) => setGenRpm(parseInt(e.target.value))}
                            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                          <div className="font-semibold text-slate-200">মোটর বনাম জেনারেটর পার্থক্য:</div>
                          <p className="text-slate-400 leading-relaxed text-[11px]">
                            মোটর তড়িৎ শক্তিকে যান্ত্রিক শক্তিতে রূপান্তর করে (ফ্লেমিং-এর বাম হস্ত নিয়ম)।
                            জেনারেটর যান্ত্রিক শক্তি দিয়ে তারের লুপ ঘুরিয়ে তড়িৎ শক্তি উৎপাদন করে (ফ্লেমিং-এর ডান হস্ত নিয়ম)।
                          </p>
                        </div>
                      </div>

                      {/* Right Waveform Canvas */}
                      <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
                        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-slate-300">
                            জেনারেটর আউটপুট ভোল্টেজ তরঙ্গরূপ (Waveform)
                          </span>
                          <span className="text-amber-400 font-mono text-[11px]">
                            {genOutputType === 'ac' ? 'সাইন ওয়েভ (AC)' : 'স্পন্দিত একমুখী (Pulsating DC)'}
                          </span>
                        </div>

                        {/* Waveform SVG */}
                        <div className="w-full h-72 sm:h-80 relative flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
                          <svg viewBox="0 0 500 240" className="w-full h-full">
                            {/* Oscilloscope Grid */}
                            <line x1="50" y1="120" x2="450" y2="120" stroke="#475569" strokeWidth="1.5" />
                            <line x1="50" y1="20" x2="50" y2="220" stroke="#475569" strokeWidth="1.5" />
                            <text x="45" y="30" fill="#94a3b8" fontSize="10" textAnchor="end">
                              +V
                            </text>
                            <text x="45" y="125" fill="#94a3b8" fontSize="10" textAnchor="end">
                              0
                            </text>
                            <text x="45" y="215" fill="#94a3b8" fontSize="10" textAnchor="end">
                              -V
                            </text>

                            {/* Sine wave or rectified DC wave */}
                            <path
                              d={
                                genOutputType === 'ac'
                                  ? 'M 50,120 Q 100,30 150,120 T 250,120 T 350,120 T 450,120'
                                  : 'M 50,120 Q 100,30 150,120 Q 200,30 250,120 Q 300,30 350,120 Q 400,30 450,120'
                              }
                              fill="none"
                              stroke={genOutputType === 'ac' ? '#38bdf8' : '#f59e0b'}
                              strokeWidth="3"
                            />

                            {/* Rotating Pointer Position indicator */}
                            <circle
                              cx={50 + ((genAngle / 360) * 400)}
                              cy={
                                genOutputType === 'ac'
                                  ? 120 - 75 * Math.sin((genAngle * Math.PI) / 180)
                                  : 120 - 75 * Math.abs(Math.sin((genAngle * Math.PI) / 180))
                              }
                              r="6"
                              fill="#10b981"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* LAB 5: TRANSFORMER & POWER GRID TRANSMISSION */}
              {/* ------------------------------------------------------------- */}
              {activeLab === 5 && (
                <div className="space-y-6">
                  {/* Mode switcher */}
                  <div className="flex border-b border-slate-800 pb-3 space-x-3">
                    <button
                      onClick={() => setTransformerSubMode('core_calc')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        transformerSubMode === 'core_calc'
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      মোড ক: ডুয়েল কয়েল কোর ট্রান্সফরমার ও ডিসি ফাঁদ
                    </button>
                    <button
                      onClick={() => setTransformerSubMode('grid_loss')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        transformerSubMode === 'grid_loss'
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      মোড খ: জাতীয় গ্রিডে উচ্চ ভোল্টেজ সাশ্রয় সিমুলেটর
                    </button>
                  </div>

                  {/* Mode A: Core Calc */}
                  {transformerSubMode === 'core_calc' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Controls */}
                      <div className="lg:col-span-5 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                          <Sliders className="w-4 h-4 text-emerald-400" />
                          <span>ট্রান্সফরমার কুণ্ডলী ও পাওয়ার প্যারামিটার</span>
                        </h3>

                        {/* Power Source Selector: AC vs DC */}
                        <div>
                          <label className="text-xs text-slate-400 block mb-1.5">
                            উৎসের ধরন (Power Source):
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setSourceType('ac')}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                sourceType === 'ac'
                                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                                  : 'border-slate-800 bg-slate-900 text-slate-400'
                              }`}
                            >
                              এসি (AC - পরিবর্তী)
                            </button>
                            <button
                              onClick={() => setSourceType('dc')}
                              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                                sourceType === 'dc'
                                  ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                                  : 'border-slate-800 bg-slate-900 text-slate-400'
                              }`}
                            >
                              ডিসি (DC - ব্যাটারি ফাঁদ!)
                            </button>
                          </div>
                        </div>

                        {/* Primary Turns (n_p) */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">মুখ্য কুণ্ডলীর পাকসংখ্যা (n_p):</span>
                            <span className="font-mono font-bold text-sky-400">{primaryTurns}</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="500"
                            step="25"
                            value={primaryTurns}
                            onChange={(e) => setPrimaryTurns(parseInt(e.target.value))}
                            className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Secondary Turns (n_s) */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">গৌণ কুণ্ডলীর পাকসংখ্যা (n_s):</span>
                            <span className="font-mono font-bold text-emerald-400">{secondaryTurns}</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={secondaryTurns}
                            onChange={(e) => setSecondaryTurns(parseInt(e.target.value))}
                            className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Primary Voltage (V_p) */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">মুখ্য ভোল্টেজ (V_p):</span>
                            <span className="font-mono font-bold text-amber-400">{primaryVoltage} V</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="240"
                            step="5"
                            value={primaryVoltage}
                            onChange={(e) => setPrimaryVoltage(parseInt(e.target.value))}
                            className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* DC Warning Box if DC is selected */}
                        {isDc && (
                          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 space-y-1">
                            <div className="font-bold flex items-center space-x-1.5 text-rose-400">
                              <AlertCircle className="w-4 h-4" />
                              <span>পাঠ্যবই সতর্কবার্তা (পৃষ্ঠা ৩৪১):</span>
                            </div>
                            <p className="leading-relaxed">
                              ট্রান্সফরমার ডিসি ভোল্টেজে কাজ করে না! ডিসিতে চৌম্বক ফ্লাক্স পরিবর্তন শূন্য (dΦ/dt = 0), ফলে গৌণ কুণ্ডলীতে কোনো ভোল্টেজ আবিষ্ট হতে পারে না (V_s = 0 V)।
                            </p>
                          </div>
                        )}

                        {/* Math Output Card */}
                        <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">গৌণ ভোল্টেজ (V_s):</span>
                            <span className="font-mono font-bold text-emerald-400">
                              {secondaryVoltage} V {sourceType === 'ac' ? 'AC' : 'DC'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">গৌণ প্রবাহ (I_s):</span>
                            <span className="font-mono font-bold text-sky-400">{secondaryCurrent} A</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                            <span className="text-slate-300">ট্রান্সফরমার প্রকার:</span>
                            <span className="text-amber-400">
                              {isStepUp ? 'স্টেপ-আপ (ভোল্টেজ বৃদ্ধিকারী)' : 'স্টেপ-ডাউন (ভোল্টেজ হ্রাসকারী)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Transformer Core SVG */}
                      <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
                        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-slate-300">
                            আয়তাকার লোহার মজ্জা ট্রান্সফরমার (চিত্র ১২.১৩)
                          </span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            V_s / V_p = n_s / n_p
                          </span>
                        </div>

                        <div className="w-full h-72 sm:h-80 relative flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
                          <svg viewBox="0 0 500 300" className="w-full h-full">
                            {/* Laminated Soft Iron Rectangular Core */}
                            {/* Outer Rectangle */}
                            <rect
                              x="120"
                              y="50"
                              width="260"
                              height="200"
                              rx="8"
                              fill="#334155"
                              stroke="#64748b"
                              strokeWidth="3"
                            />
                            {/* Inner Hollow Window */}
                            <rect
                              x="180"
                              y="90"
                              width="140"
                              height="120"
                              rx="4"
                              fill="#0f172a"
                              stroke="#64748b"
                              strokeWidth="2"
                            />

                            {/* Magnetic Flux Path inside core */}
                            {!isDc && (
                              <rect
                                x="150"
                                y="70"
                                width="200"
                                height="160"
                                rx="6"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="2"
                                strokeDasharray="6 4"
                                opacity="0.8"
                              />
                            )}

                            {/* Primary Coil on Left Arm */}
                            {Array.from({ length: Math.min(10, Math.round(primaryTurns / 30)) }).map((_, pi) => (
                              <rect
                                key={pi}
                                x="105"
                                y={80 + pi * 14}
                                width="30"
                                height="8"
                                rx="2"
                                fill="#f59e0b"
                              />
                            ))}

                            {/* Secondary Coil on Right Arm */}
                            {Array.from({ length: Math.min(14, Math.round(secondaryTurns / 40)) }).map((_, si) => (
                              <rect
                                key={si}
                                x="365"
                                y={70 + si * 11}
                                width="30"
                                height="6"
                                rx="2"
                                fill="#10b981"
                              />
                            ))}

                            {/* Primary Input Terminals */}
                            <text x="75" y="140" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="end">
                              V_p = {primaryVoltage}V
                            </text>
                            <text x="75" y="158" fill="#94a3b8" fontSize="10" textAnchor="end">
                              ({primaryTurns} পাক)
                            </text>

                            {/* Secondary Output Terminals */}
                            <text x="425" y="140" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="start">
                              V_s = {secondaryVoltage}V
                            </text>
                            <text x="425" y="158" fill="#94a3b8" fontSize="10" textAnchor="start">
                              ({secondaryTurns} পাক)
                            </text>

                            {/* Core label */}
                            <text x="250" y="155" fill="#64748b" fontSize="11" textAnchor="middle">
                              নরম লোহার কোর
                            </text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode B: Grid Loss */}
                  {transformerSubMode === 'grid_loss' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Controls */}
                      <div className="lg:col-span-5 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-bold text-slate-200">জাতীয় গ্রিড সঞ্চালন সিমুলেটর</h3>

                        {/* Power Plant Capacity */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">বিদ্যুৎ কেন্দ্রের উৎপাদন ক্ষমতা (P):</span>
                            <span className="font-mono font-bold text-amber-400">{plantPowerKw} kW</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            = {plantPowerWatts.toLocaleString()} Watts
                          </span>
                        </div>

                        {/* Step-up Transmission Voltage Selection */}
                        <div>
                          <label className="text-xs text-slate-400 block mb-1.5">
                            সঞ্চালন লাইনের ভোল্টেজ (Grid Voltage):
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { v: 220, label: '২২০ V (সরাসরি)', note: 'স্টেপ-আপ ছাড়া' },
                              { v: 11000, label: '১১ kV', note: 'স্থানীয় সাবস্টেশন' },
                              { v: 33000, label: '৩৩ kV', note: 'আন্তঃজেলা লাইন' },
                              { v: 132000, label: '১৩২ kV', note: 'জাতীয় গ্রিড (PGCB)' },
                            ].map((item) => (
                              <button
                                key={item.v}
                                onClick={() => setGridVoltage(item.v)}
                                className={`p-2 rounded-lg border text-left transition-all ${
                                  gridVoltage === item.v
                                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                                    : 'border-slate-800 bg-slate-900 text-slate-400'
                                }`}
                              >
                                <div className="text-xs font-bold">{item.label}</div>
                                <div className="text-[10px] text-slate-500">{item.note}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Transmission Output */}
                        <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">লাইনের কারেন্ট (I = P/V):</span>
                            <span className="font-mono text-sky-400 font-bold">{lineCurrent} A</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">তারে তাপীয় অপচয় (P_loss = I²R):</span>
                            <span
                              className={`font-mono font-bold ${
                                lineLossPercentage > 50 ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {lineHeatLossWatts.toLocaleString()} W ({lineLossPercentage}%)
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                            <span className="text-slate-300">শহরে পৌঁছানো ক্ষমতা:</span>
                            <span className="text-emerald-400">
                              {(powerDeliveredWatts / 1000).toFixed(1)} kW
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Grid Loss Comparison Bar */}
                      <div className="lg:col-span-7 bg-slate-950/70 p-5 rounded-xl border border-slate-800 flex flex-col items-center">
                        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-slate-300">
                            বিদ্যুৎ সঞ্চালন সাশ্রয় বিশ্লেষণ
                          </span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            সাশ্রয়: {(100 - lineLossPercentage).toFixed(2)}%
                          </span>
                        </div>

                        <div className="w-full p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                          {/* 220V Disaster Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">২২০ V সরাসরি সঞ্চালন (১০০% লাইন বিপর্যয়):</span>
                              <span className="text-rose-400 font-bold font-mono">১,০৩৩ kW অপচয়!</span>
                            </div>
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500 w-full" />
                            </div>
                            <span className="text-[10px] text-slate-500 mt-0.5 block">
                              উৎপাদিত ১০০ kW এর সবটুকুই তারে তাপ হয়ে পুড়ে নষ্ট হয়ে যায়।
                            </span>
                          </div>

                          {/* 132kV Optimal Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">১৩২ kV স্টেপ-আপ গ্রিড সঞ্চালন:</span>
                              <span className="text-emerald-400 font-bold font-mono">মাত্র ২.৮৭ W অপচয়!</span>
                            </div>
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[0.05%]" />
                            </div>
                            <span className="text-[10px] text-slate-500 mt-0.5 block">
                              ৯৯.৯৯% বিদ্যুৎ অক্ষত অবস্থায় দূরবর্তী শহরে পৌঁছায়।
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 w-full space-y-1">
                          <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                            <Info className="w-4 h-4" />
                            <span>কেন স্টেপ-আপ ট্রান্সফরমার অপরিহার্য?</span>
                          </div>
                          <p className="leading-relaxed">
                            বিদ্যুৎ সঞ্চালনে ভোল্টেজ দ্বিগুণ করলে প্রবাহ অর্ধেক হয়, ফলে I²R নীতি অনুযায়ী তাপীয় অপচয় এক-চতুর্থাংশ হয়ে যায়। আর ভোল্টেজ ৬০০ গুণ বৃদ্ধি (২২০V থেকে ১৩২kV) করলে লাইনে তাপীয় অপচয় ৩,৬০,০০০ গুণ হ্রাস পায়!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: WORKED CQS WITH EXAMINER SECRET RUBRICS */}
        {/* ================================================================= */}
        {activeStep === 2 && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন (Worked CQs with Secret Rubrics)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  পাঠ্যবই ও ঢাকা-চট্টগ্রাম বোর্ডের হুবহু সৃজনশীল এবং পরীক্ষক যেভাবে খাতা মূল্যায়ন করেন।
                </p>
              </div>
            </div>

            {/* CQ Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {WORKED_CQS.map((cq) => (
                <button
                  key={cq.id}
                  onClick={() => setSelectedCqId(cq.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCqId === cq.id
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300 shadow-md shadow-emerald-950'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-400 block mb-1">
                    সৃজনশীল ০{cq.id}
                  </span>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">{cq.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{cq.source}</div>
                </button>
              ))}
            </div>

            {/* Selected CQ Detail Box */}
            {(() => {
              const currentCq = WORKED_CQS.find((c) => c.id === selectedCqId) || WORKED_CQS[0];
              const isRubricOpen = revealedRubrics[currentCq.id];

              return (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
                  {/* Stimulus */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-xs font-bold text-emerald-400 block mb-1.5 uppercase tracking-wide">
                      উদ্দীপক:
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed">{currentCq.stimulus}</p>
                  </div>

                  {/* Question (g) */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-800 text-slate-300 shrink-0">
                        (গ) ৩ নম্বর
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100">{currentCq.qG}</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed font-sans">
                      <RenderMathText text={currentCq.ansG} />
                    </div>
                  </div>

                  {/* Question (gh) */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-800 text-slate-300 shrink-0">
                        (ঘ) ৪ নম্বর
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100">{currentCq.qGh}</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed font-sans">
                      <RenderMathText text={currentCq.ansGh} />
                    </div>
                  </div>

                  {/* Examiner Secret Rubric Drawer */}
                  <div className="border-t border-slate-800 pt-4">
                    <button
                      onClick={() => toggleRubric(currentCq.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>পরীক্ষকের গোপন কথা (Examiner Secret Marking Rubric)</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isRubricOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isRubricOpen && (
                      <div className="mt-3 p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-slate-200 leading-relaxed space-y-1">
                        <span className="font-bold text-amber-400 block mb-1">
                          খাতা দেখার গোপন গাইডলাইন:
                        </span>
                        <RenderMathText text={currentCq.examinerSecrets} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: TRY YOURSELF CHALLENGES */}
        {/* ================================================================= */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>নিজে করো চ্যালেঞ্জ (Interactive Numeric Challenges)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                বোর্ড স্ট্যান্ডার্ড গাণিতিক সমস্যা সমাধান করো এবং তাত্ক্ষণিক নির্ভুলতা যাচাই করো।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CHALLENGES.map((challenge) => {
                const feedback = challengeFeedbacks[challenge.id];

                return (
                  <div
                    key={challenge.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30">
                          চ্যালেঞ্জ ০{challenge.id}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 mb-2">{challenge.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{challenge.problem}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="তোমার উত্তর..."
                          value={challengeInputs[challenge.id] || ''}
                          onChange={(e) =>
                            setChallengeInputs({ ...challengeInputs, [challenge.id]: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-xs font-bold text-slate-400 px-2 shrink-0">
                          {challenge.unit}
                        </span>
                      </div>

                      <button
                        onClick={() => handleVerifyChallenge(challenge)}
                        className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                      >
                        যাচাই
                      </button>

                      {feedback && feedback.checked && (
                        <div
                          className={`p-2.5 rounded-lg text-xs leading-snug flex items-start space-x-2 ${
                            feedback.isCorrect
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {feedback.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                          )}
                          <span>{feedback.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: CHECK UNDERSTANDING MCQS */}
        {/* ================================================================= */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>যাচাই ও কুইজ (Check Understanding MCQs)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  এনসিটিবি মূল পাঠ্যবই ও বিগত বছরের বোর্ড প্রশ্ন নিয়ে রচিত ৫টি আদর্শ বহুনির্বাচনি প্রশ্ন।
                </p>
              </div>
              {checkedMcq && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  স্কোর: {calculateMcqScore()} / {MCQS.length}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {MCQS.map((mcq, idx) => (
                <div key={mcq.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-start space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-200">{mcq.question}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {mcq.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[mcq.id] === oIdx;
                      const isCorrect = mcq.correct === oIdx;

                      let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                      if (checkedMcq) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-300 line-through';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-300';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={checkedMcq}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [mcq.id]: oIdx })}
                          className={`p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                        >
                          <span className="font-mono mr-2 text-slate-500">
                            {['(ক)', '(খ)', '(গ)', '(ঘ)'][oIdx]}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {checkedMcq && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-emerald-400 block mb-1">ব্যাখ্যা:</span>
                      <RenderMathText text={mcq.explanation} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCheckedMcq(!checkedMcq)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                {checkedMcq ? 'পুনরায় পরীক্ষা দাও' : 'উত্তর ও ব্যাখ্যা যাচাই করো'}
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 5: SUMMARY CHEAT SHEET */}
        {/* ================================================================= */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>সারসংক্ষেপ ও সূত্র ভাণ্ডার (Cheat Sheet & Revision Notes)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  অধ্যায় ১২ এর সমস্ত প্রয়োজনীয় সূত্র, একক ও ৪টি মারাত্মক পরীক্ষক ফাঁদ।
                </p>
              </div>
              <button
                onClick={handleCopyCheatSheet}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                {copiedCheatSheet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCheatSheet ? 'কপি হয়েছে!' : 'নোট কপি করুন'}</span>
              </button>
            </div>

            {/* Formula Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'ট্রান্সফরমার সমীকরণ',
                  formula: '$\\frac{V_p}{V_s} = \\frac{n_p}{n_s} = \\frac{I_s}{I_p}$',
                  desc: 'ভোল্টেজ পাকসংখ্যার সমানুপাতিক এবং তড়িৎ প্রবাহের ব্যস্তানুপাতিক।',
                },
                {
                  title: 'ক্ষমতার নিত্যতা',
                  formula: '$P_p = P_s \\implies V_p I_p = V_s I_s$',
                  desc: 'আদর্শ ট্রান্সফরমারে মুখ্য ও গৌণ কুণ্ডলীর বৈদ্যুতিক ক্ষমতা সমান থাকে।',
                },
                {
                  title: 'সঞ্চালন লাইনে তাপীয় অপচয়',
                  formula: '$P_{\\text{loss}} = I^2 R$',
                  desc: 'উচ্চ ভোল্টেজে বিদ্যুৎ পাঠালে প্রবাহ I হ্রাস পাওয়ায় অপচয় কমে যায়।',
                },
                {
                  title: 'চৌম্বক বল (লরেন্টজ বল)',
                  formula: '$F = B I L \\sin\\theta$',
                  desc: 'চৌম্বক ক্ষেত্রে স্থাপিত তড়িৎবাহী তারের ওপর প্রযুক্ত বল।',
                },
                {
                  title: 'সলিনয়েডের চৌম্বক ক্ষেত্র',
                  formula: '$B = \\mu_r \\mu_0 n I = \\mu_r \\mu_0 \\frac{N}{L} I$',
                  desc: 'নরম লোহার মজ্জা বসালে চৌম্বক প্রাবল্য শতগুণ বেড়ে যায়।',
                },
                {
                  title: 'ফ্যারাডের তাড়িতচৌম্বক আবেশ',
                  formula: '$\\mathcal{E} = -N \\frac{d\\Phi}{dt}$',
                  desc: 'মাইনাস চিহ্নটি লেঞ্জের নিয়ম (বাধা প্রদানকারী প্রকৃতি) নির্দেশ করে।',
                },
              ].map((card, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                    {card.title}
                  </span>
                  <div className="text-sm font-mono font-bold text-slate-100 py-1">
                    <RenderMathText text={card.formula} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* 4 Fatal Examiner Traps */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>বোর্ড পরীক্ষার ৪টি মারাত্মক ফাঁদ (Examiner Traps)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-rose-400">১. ট্রান্সফরমারের ডিসি (DC) সংযোগ ফাঁদ</div>
                  <div className="text-slate-400 leading-relaxed">
                    <RenderMathText text="উদ্দীপকে ব্যাটারি বা ডিসি দেওয়া থাকলে কখনোই রূপান্তর সূত্র বসিয়ে ভোল্টেজ বের করবে না। ডিসিতে ফ্লাক্স পরিবর্তন শূন্য বলে সরাসরি গৌণ ভোল্টেজ শূন্য ($V_s = 0\text{ V}$)।" />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">২. প্রবাহ বনাম ভোল্টেজের ব্যস্ত অনুপাত</div>
                  <div className="text-slate-400 leading-relaxed">
                    <RenderMathText text="স্টেপ-আপে ভোল্টেজ বাড়লে কারেন্ট কিন্তু কমে যায়! অর্থাৎ $\frac{V_p}{V_s} = \frac{I_s}{I_p}$। তাড়াহুড়োয় অনেকেই $\frac{I_p}{I_s}$ লিখে ভুল করে।" />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-400">৩. ফ্লেমিং-এর বাম হস্ত বনাম ডান হস্ত গুলিয়ে ফেলা</div>
                  <p className="text-slate-400 leading-relaxed">
                    মোটরের ক্ষেত্রে প্রযুক্ত বল বের করতে ফ্লেমিং-এর <b>বাম হস্ত</b> নিয়ম এবং জেনারেটরে আবিষ্ট প্রবাহের দিক জানতে ফ্লেমিং-এর <b>ডান হস্ত</b> নিয়ম প্রযোজ্য।
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">৪. চৌম্বক বলরেখা সর্বদা আবদ্ধ লুপ</div>
                  <p className="text-slate-400 leading-relaxed">
                    বৈদ্যুতিক বলরেখার শুরু (+) ও শেষ (-) থাকে, কিন্তু চৌম্বক বলরেখার কোনো শুরু বা শেষ নেই—এটি উত্তর থেকে দক্ষিণে গিয়ে চুম্বকের ভেতর দিয়ে আবার উত্তরে ফিরে অবিচ্ছিন্ন আবদ্ধ লুপ গঠন করে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* SOCRATIC AI TUTOR DRAWER (SHERU COMPANION) */}
      {/* ------------------------------------------------------------------- */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 flex flex-col h-full shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  শেরু
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">শেরু এআই ফিজিক্স টিউটর</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>অধ্যায় ১২ নিয়ে প্রস্তুত</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Context Prompt Chips */}
            <div className="p-3 border-b border-slate-900 bg-slate-950/40 overflow-x-auto flex space-x-2">
              {[
                {
                  q: 'ট্রান্সফরমার ডিসিতে কাজ করে না কেন?',
                  a: 'ট্রান্সফরমার পারস্পরিক তাড়িতচৌম্বক আবেশের মূলনীতিতে কাজ করে। ডিসিতে প্রবাহ স্থির থাকায় চৌম্বক ফ্লাক্সের কোনো পরিবর্তন হয় না (dΦ/dt = 0)। ফ্লাক্স পরিবর্তন না হলে সেকেন্ডারিতে কোনো ভোল্টেজ আবিষ্ট হওয়া অসম্ভব!',
                },
                {
                  q: 'মোটরে কমিউটেটর না থাকলে কী হতো?',
                  a: 'কমিউটেটর প্রতি ১৮০° ঘূর্ণনে আর্মেচারে তড়িৎ প্রবাহের দিক উল্টে দেয় যাতে টর্কের দিক সবসময় একদিকে থাকে। এটি না থাকলে মোটর অর্ধ-পাক ঘুরে উল্লম্ব সাম্যাবস্থায় এসে থেমে যেত!',
                },
                {
                  q: 'উচ্চ ভোল্টেজে বিদ্যুৎ সঞ্চালন করলে কেন অপচয় কমে?',
                  a: 'সঞ্চালন তারে তাপীয় অপচয় P = I²R। ভোল্টেজকে স্টেপ-আপ করে ১৩২ kV এ বাড়ালে কারেন্ট I নাটকীয়ভাবে কমে যায়। ফলে I² এর বর্গের কারণে লাইনে বিদ্যুৎ অপচয় ৯৯.৯% হ্রাস পায়!',
                },
                {
                  q: 'লেঞ্জের নিয়ম কীভাবে শক্তির নিত্যতা মানে?',
                  a: 'চুম্বককে কুণ্ডলীর কাছে নিলে বিকর্ষণ বল তৈরি হয়। ওই বিকর্ষণের বিরুদ্ধে হাত দিয়ে যান্ত্রিক কাজ করে চুম্বকটিকে সরাতে হয়। এই কৃত যান্ত্রিক কাজই তারে তড়িৎ শক্তিতে রূপ নেয়।',
                },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskPreset(chip.q, chip.a)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap transition-colors"
                >
                  {chip.q}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-1">আরে দোস্ত! আমি শেরু 🐾</span>
                বিদ্যুতের চৌম্বক ক্রিয়া অধ্যায়ে ওয়েরস্টেডের পরীক্ষা, ডিসি মোটর, তাড়িতচৌম্বক আবেশ বা ট্রান্সফরমার নিয়ে কোনো প্রশ্ন থাকলে আমাকে নির্দ্বিধায় জিজ্ঞাসা করো!
              </div>

              {aiChatResponses.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-500/30 ml-6'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 mr-6'
                  }`}
                >
                  <span className="font-bold block mb-0.5 text-[10px] text-slate-400">
                    {msg.role === 'user' ? 'তুমি:' : 'শেরু:'}
                  </span>
                  <RenderMathText text={msg.text} />
                </div>
              ))}
            </div>

            {/* Query Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center space-x-2">
              <input
                type="text"
                placeholder="চৌম্বক ক্রিয়া নিয়ে শেরুকে জিজ্ঞাসা করো..."
                value={aiChatQuery}
                onChange={(e) => setAiChatQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustomAi()}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendCustomAi}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors"
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
