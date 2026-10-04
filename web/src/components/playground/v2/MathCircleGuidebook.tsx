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
    title: 'বৃত্তের কেন্দ্র ও জ্যা সংক্রান্ত উপপাদ্য ল্যাব',
    subtitle: 'Center & Chords Theorems Lab (Theorems 17, 18, 19)',
    nctbPage: 'পৃষ্ঠা ১৫০-১৫৩',
    badge: 'ল্যাব ০১',
    intro:
      'বৃত্তের কেন্দ্র ও ব্যাস ভিন্ন কোনো জ্যা-এর মধ্যবিন্দুর সংযোজক রেখাংশ ঐ জ্যা-এর ওপর লম্ব (উপপাদ্য ১৭)। এছাড়া বৃত্তের সকল সমান জ্যা কেন্দ্র থেকে সমদূরবর্তী (উপপাদ্য ১৮) এবং কেন্দ্র থেকে সমদূরবর্তী সকল জ্যা পরস্পর সমান (উপপাদ্য ১৯)।',
  },
  {
    id: 2,
    title: 'কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ ল্যাব',
    subtitle: 'Central vs Inscribed Angle Lab (Theorem 20 & Corollaries)',
    nctbPage: 'পৃষ্ঠা ১৫৪-১৫৮',
    badge: 'ল্যাব ০২',
    intro:
      'বোর্ড পরীক্ষার সর্বাধিক গুরুত্বপূর্ণ উপপাদ্য: একই বৃত্তচাপের ওপর দণ্ডায়মান কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ (উপপাদ্য ২০)। এর দুটি চমৎকার অনুসিদ্ধান্ত: একই চাপের বৃত্তস্থ কোণগুলো সমান এবং অর্ধবৃত্তস্থ কোণ সর্বদা এক সমকোণ (৯০°)।',
  },
  {
    id: 3,
    title: 'বৃত্তস্থ চতুর্ভুজ ও বিপরীত কোণ উপপাদ্য ল্যাব',
    subtitle: 'Cyclic Quadrilateral & Supplementary Angles (Theorems 23 & 24)',
    nctbPage: 'পৃষ্ঠা ১৫৯-১৬৩',
    badge: 'ল্যাব ০৩',
    intro:
      'বৃত্তে অন্তর্লিখিত চতুর্ভুজের যেকোনো দুটি বিপরীত কোণের সমষ্টি দুই সমকোণ বা ১৮০° (উপপাদ্য ২৩)। আবার বৃত্তস্থ চতুর্ভুজের এক বাহুকে বর্ধিত করলে উৎপন্ন বহিঃস্থ কোণ বিপরীত অন্তঃস্থ কোণের সমান হয়।',
  },
  {
    id: 4,
    title: 'বৃত্তের স্পর্শক ও বহিঃস্থ বিন্দুর স্পর্শক ল্যাব',
    subtitle: 'Tangents & External Point Secants (Theorems 25, 26, 27)',
    nctbPage: 'পৃষ্ঠা ১৬৪-১৬৮',
    badge: 'ল্যাব ০৪',
    intro:
      'বৃত্তের স্পর্শক স্পর্শবিন্দুগামী ব্যাসার্ধের ওপর লম্ব (উপপাদ্য ২৫)। বৃত্তের বহিঃস্থ কোনো বিন্দু থেকে দুটি স্পর্শক টানলে ঐ বিন্দু থেকে স্পর্শবিন্দুদ্বয়ের দূরত্ব সমান (PA = PB, উপপাদ্য ২৬)। স্পর্শক দুটি কেন্দ্র থেকে দূরত্বের সাথে সমকোণী ত্রিভুজ গঠন করে।',
  },
  {
    id: 5,
    title: 'পরিবৃত্ত, অন্তর্বৃত্ত ও বহির্বৃত্ত অঙ্কন সিমুলেটর',
    subtitle: 'Circumcircle, Incircle & Excircle Simulator (Constructions 8, 9, 10)',
    nctbPage: 'পৃষ্ঠা ১৬৯-১৭৪',
    badge: 'ল্যাব ০৫',
    intro:
      'ত্রিভুজের বাহুগুলোর লম্বসমদ্বিখণ্ডকের ছেদবিন্দু পরিকেন্দ্র O নিয়ে পরিবৃত্ত (সম্পাদ্য ৮), কোণগুলোর সমদ্বিখণ্ডকের ছেদবিন্দু অন্তঃকেন্দ্র I নিয়ে অন্তর্বৃত্ত (সম্পাদ্য ৯), এবং বর্ধিত কোণের সমদ্বিখণ্ডক নিয়ে বহির্বৃত্ত (সম্পাদ্য ১০) নিখুঁতভাবে অঙ্কন করা যায়।',
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
    boardSource: 'ঢাকা বোর্ড — বৃত্ত ও জ্যা সংক্রান্ত উপপাদ্য',
    stem: 'O কেন্দ্রবিশিষ্ট একটি বৃত্তের ব্যাসার্ধ r = 5 cm। বৃত্তটিতে AB ও CD দুটি সমান্তরাল জ্যা যাদের দৈর্ঘ্য যথাক্রমে 8 cm ও 6 cm। কেন্দ্র O থেকে AB ও CD এর ওপর লম্ব যথাক্রমে OE ও OF।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'বৃত্তটির পরিধি ও ক্ষেত্রফল নির্ণয় কর।',
        solution: [
          'দেওয়া আছে, বৃত্তের ব্যাসার্ধ r = 5 cm।',
          'পরিধি C = 2πr = 2 × 3.1416 × 5 = 31.416 cm।',
          'ক্ষেত্রফল A = πr² = 3.1416 × 5² = 3.1416 × 25 = 78.54 cm²।',
        ],
        rubric: 'পরিধির সূত্রের জন্য ১ নম্বর, ক্ষেত্রফল গণনার জন্য ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, বৃত্তের কেন্দ্র থেকে জ্যা দুটির লম্ব দূরত্ব যথাক্রমে 3 cm ও 4 cm।',
        solution: [
          'উপপাদ্য ১৭ অনুসারে, বৃত্তের কেন্দ্র থেকে জ্যা-এর ওপর অঙ্কিত লম্ব ঐ জ্যা-কে সমদ্বিখণ্ডিত করে।',
          'অতএব, AE = EB = AB/2 = 8/2 = 4 cm।',
          'সমকোণী ত্রিভুজ △OAE-তে পিথাগোরাসের উপপাদ্য অনুসারে:',
          'OA² = OE² + AE² ⇒ 5² = OE² + 4² ⇒ OE² = 25 - 16 = 9 ⇒ OE = 3 cm।',
          'অনুরূপভাবে, CF = FD = CD/2 = 6/2 = 3 cm।',
          'সমকোণী ত্রিভুজ △OCF-তে: OF² = OC² - CF² = 5² - 3² = 25 - 9 = 16 ⇒ OF = 4 cm। (প্রমাণিত)',
        ],
        rubric: 'উপপাদ্য ১৭ বিবরণের জন্য ১ নম্বর, AE ও CF নির্ণয়ে ১ নম্বর, OE ও OF পিথাগোরাস গণনায় ২ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'যদি জ্যা দুটি পরস্পর সমান হয় (AB = CD), তবে প্রমাণ কর যে OE = OF (উপপাদ্য ১৮)।',
        solution: [
          'বিশেষ নির্বচন: মনে করি O বৃত্তের কেন্দ্র এবং AB ও CD দুটি সমান জ্যা। OE ⊥ AB এবং OF ⊥ CD। প্রমাণ করতে হবে OE = OF।',
          'অঙ্কন: O, A এবং O, C যোগ করি।',
          'প্রমাণ: যেহেতু OE ⊥ AB এবং OF ⊥ CD, সুতরাং AE = 1/2 AB এবং CF = 1/2 CD।',
          'কিন্তু দেওয়া আছে AB = CD, সুতরাং 1/2 AB = 1/2 CD ⇒ AE = CF।',
          'এখন সমকোণী ত্রিভুজ △OAE এবং △OCF-এ: অতিভুজ OA = অতিভুজ OC (একই বৃত্তের ব্যাসার্ধ) এবং বাহু AE = CF।',
          'অতএব, △OAE ≅ △OCF (সমকোণী ত্রিভুজের অতিভুজ-বাহু সর্বসমতা)।',
          'সুতরাং, OE = OF। (প্রমাণিত)',
        ],
        rubric: 'চিত্র ও বিশেষ নির্বচনে ১ নম্বর, AE = CF প্রতিপাদনে ১ নম্বর, সর্বসমতা ও উপসংহারে ২ নম্বর।',
      },
    ],
    examinerSecret:
      'বোর্ড পরীক্ষক দেখেন ছাত্র সমকোণী ত্রিভুজের সর্বসমতা শর্তে অতিভুজ-বাহু উপপাদ্য উল্লেখ করেছে কিনা। বৃত্তের ব্যাসার্ধ সমান হওয়ার যুক্তি পরিষ্কারভাবে লিখতে হবে।',
  },
  {
    id: 2,
    boardSource: 'রাজশাহী বোর্ড — উপপাদ্য ২০ ও বৃত্তস্থ চতুর্ভুজ',
    stem: 'O কেন্দ্রবিশিষ্ট বৃত্তে একই বৃত্তচাপ BC-এর ওপর দণ্ডায়মান কেন্দ্রস্থ কোণ ∠BOC এবং বৃত্তস্থ কোণ ∠BAC। অপর একটি বিন্দু D বৃত্তের ওপর অবস্থিত এবং ABCD একটি বৃত্তস্থ চতুর্ভুজ।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'অর্ধবৃত্তস্থ কোণ কত ডিগ্রি? চিত্রসহ এর অনুসিদ্ধান্তটি লেখ।',
        solution: [
          'অর্ধবৃত্তস্থ কোণ সর্বদা এক সমকোণ বা ৯০°।',
          'ব্যাখ্যা: যদি BC বৃত্তের একটি ব্যাস হয়, তবে কেন্দ্রস্থ কোণ ∠BOC = ১৮০° (সরলকোণ)।',
          'উপপাদ্য ২০ অনুযায়ী, বৃত্তস্থ কোণ ∠BAC = 1/2 ∠BOC = 1/2 × 180° = 90°।',
        ],
        rubric: 'সঠিক মান ৯০° এর জন্য ১ নম্বর, চিত্র ও সংক্ষিপ্ত ব্যাখ্যার জন্য ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, ∠BOC = 2∠BAC (উপপাদ্য ২০)।',
        solution: [
          'বিশেষ নির্বচন: O কেন্দ্রবিশিষ্ট বৃত্তে চাপ BC-এর ওপর দণ্ডায়মান কেন্দ্রস্থ কোণ ∠BOC এবং বৃত্তস্থ কোণ ∠BAC। প্রমাণ করতে হবে ∠BOC = 2∠BAC।',
          'অঙ্কন: মনে করি AC রেখাংশ কেন্দ্রগামী নয়। A বিন্দু দিয়ে কেন্দ্রগামী রেখাংশ AD আঁকি।',
          'প্রমাণ: △OAB-এ OA = OB (একই বৃত্তের ব্যাসার্ধ)। সুতরাং ∠OAB = ∠OBA।',
          '△OAB এর বহিঃস্থ কোণ ∠BOD = ∠OAB + ∠OBA = 2∠OAB ... (১)।',
          'অনুরূপভাবে △OAC থেকে পাই, বহিঃস্থ কোণ ∠COD = 2∠OAC ... (২)।',
          'সমীকরণ (১) ও (২) যোগ করে: ∠BOD + ∠COD = 2(∠OAB + ∠OAC) ⇒ ∠BOC = 2∠BAC। (প্রমাণিত)',
        ],
        rubric: 'চিত্র ও অঙ্কনে ১ নম্বর, বহিঃস্থ কোণ ধর্মে ১ নম্বর, সমীকরণ যোগ ও প্রমাণের সমাপ্তিতে ২ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'প্রমাণ কর যে, বৃত্তস্থ চতুর্ভুজ ABCD-তে ∠BAD + ∠BCD = 180° (উপপাদ্য ২৩)।',
        solution: [
          'বিশেষ নির্বচন: ABCD চতুর্ভুজটি O কেন্দ্রবিশিষ্ট বৃত্তে অন্তর্লিখিত। প্রমাণ করতে হবে ∠BAD + ∠BCD = ১৮০°।',
          'অঙ্কন: O, B এবং O, D যোগ করি।',
          'প্রমাণ: একই চাপ BCD-এর ওপর দণ্ডায়মান কেন্দ্রস্থ কোণ ∠BOD = 2∠BAD ... (১)।',
          'আবার একই চাপ BAD-এর ওপর দণ্ডায়মান প্রবৃদ্ধ কেন্দ্রস্থ কোণ প্রবৃদ্ধ ∠BOD = 2∠BCD ... (২)।',
          'কিন্তু কোণ ∠BOD + প্রবৃদ্ধ ∠BOD = ৪ সমকোণ বা ৩৬০°।',
          'অতএব, 2∠BAD + 2∠BCD = 360° ⇒ 2(∠BAD + ∠BCD) = 360° ⇒ ∠BAD + ∠BCD = 180°। (প্রমাণিত)',
        ],
        rubric: 'কেন্দ্রস্থ ও প্রবৃদ্ধ কোণ চিহ্নিতকরণে ১ নম্বর, ৪ সমকোণের সমীকরণে ১ নম্বর, উভয় পক্ষে ২ দ্বারা ভাগে ২ নম্বর।',
      },
    ],
    examinerSecret:
      'উপপাদ্য ২৩-এ "প্রবৃদ্ধ কোণ" কথাটি না লিখলে ২ নম্বর কাটা যায়! কেন্দ্রের একপাশে সাধারণ কোণ এবং অপরপাশে ৩৬০° পূরক কোণটি হলো প্রবৃদ্ধ কোণ।',
  },
  {
    id: 3,
    boardSource: 'চট্টগ্রাম বোর্ড — স্পর্শক ও পরিবৃত্ত অঙ্কন',
    stem: 'O কেন্দ্রবিশিষ্ট একটি বৃত্তের বহিঃস্থ বিন্দু P থেকে বৃত্তে PA ও PB দুটি স্পর্শক টানা হলো। অপর একটি সমবাহু ত্রিভুজ XYZ যার বাহুর দৈর্ঘ্য 6 cm।',
    parts: [
      {
        label: 'ক',
        marks: 2,
        question: 'বৃত্তের ব্যাসার্ধ 5 cm এবং OP = 13 cm হলে স্পর্শক PA-এর দৈর্ঘ্য কত?',
        solution: [
          'উপপাদ্য ২৫ অনুসারে স্পর্শক স্পর্শবিন্দুগামী ব্যাসার্ধের ওপর লম্ব। অতএব OA ⊥ PA।',
          '△OAP সমকোণী ত্রিভুজ, যার অতিভুজ OP = 13 cm এবং লম্ব OA = 5 cm।',
          'পিথাগোরাসের উপপাদ্য অনুসারে: PA² = OP² - OA² = 13² - 5² = 169 - 25 = 144।',
          'সুতরাং PA = √144 = 12 cm।',
        ],
        rubric: 'লক্ষণীয় সমকোণ নির্দেশনায় ১ নম্বর, সঠিক দৈর্ঘ্য ১২ cm গণনায় ১ নম্বর।',
      },
      {
        label: 'খ',
        marks: 4,
        question: 'প্রমাণ কর যে, PA = PB (উপপাদ্য ২৬)।',
        solution: [
          'বিশেষ নির্বচন: O কেন্দ্রবিশিষ্ট বৃত্তের বহিঃস্থ বিন্দু P থেকে PA ও PB দুটি স্পর্শক। প্রমাণ করতে হবে PA = PB।',
          'অঙ্কন: O, A; O, B এবং O, P যোগ করি।',
          'প্রমাণ: যেহেতু PA স্পর্শক এবং OA স্পর্শবিন্দুগামী ব্যাসার্ধ, সুতরাং OA ⊥ PA। অর্থাৎ ∠OAP = 90°।',
          'অনুরূপভাবে ∠OBP = 90°।',
          'এখন সমকোণী ত্রিভুজ △OAP এবং সমকোণী ত্রিভুজ △OBP-এ:',
          'অতিভুজ OP সাধারণ বাহু এবং ব্যাসার্ধ OA = OB।',
          'অতএব △OAP ≅ △OBP (সমকোণী ত্রিভুজের অতিভুজ-বাহু সর্বসমতা)।',
          'সুতরাং PA = PB। (প্রমাণিত)',
        ],
        rubric: 'চিত্র ও সমকোণ যুক্তিতে ১ নম্বর, সমকোণী সর্বসমতায় ২ নম্বর, PA = PB সিদ্ধান্তে ১ নম্বর।',
      },
      {
        label: 'গ',
        marks: 4,
        question: 'XYZ সমবাহু ত্রিভুজটির পরিবৃত্ত অঙ্কন কর এবং অঙ্কনের বিবরণ দাও।',
        solution: [
          'অঙ্কনের বিবরণ (সম্পাদ্য ৮):',
          '১. প্রথমে 6 cm বাহুবিশিষ্ট সমবাহু ত্রিভুজ △XYZ অঙ্কন করি।',
          '২. XY বাহুর লম্বসমদ্বিখণ্ডক রেখা EF এবং YZ বাহুর লম্বসমদ্বিখণ্ডক রেখা GH অঙ্কন করি।',
          '৩. মনে করি EF এবং GH রেখাদ্বয় পরস্পরকে O বিন্দুতে ছেদ করে। O-ই হলো পরিবৃত্তের কেন্দ্র বা পরিকেন্দ্র।',
          '৪. O, X যোগ করি। O-কে কেন্দ্র করে OX-এর সমান ব্যাসার্ধ নিয়ে একটি বৃত্ত আঁকি।',
          '৫. এই বৃত্তটিই X, Y ও Z বিন্দুগামী উদ্দিষ্ট পরিবৃত্ত।',
        ],
        rubric: 'সমবাহু ত্রিভুজ অঙ্কনে ১ নম্বর, দুটি বাহুর লম্বসমদ্বিখণ্ডক ছেদে ১ নম্বর, পরিবৃত্ত বৃত্তচাপে ২ নম্বর।',
      },
    ],
    examinerSecret:
      'পরিবৃত্ত অঙ্কনে যে কোনো দুটি বাহুর লম্বসমদ্বিখণ্ডক আঁকলেই পরিকেন্দ্র পাওয়া যায়। তিনটি বাহুর লম্বসমদ্বিখণ্ডক আঁকার প্রয়োজন নেই।',
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
    question: 'অর্ধবৃত্তস্থ কোণের মান কত ডিগ্রি?',
    options: ['৪৫°', '৬০°', '৯০°', '১৮০°'],
    correctAnswer: 2,
    explanation:
      'উপপাদ্য ২০ এর অনুসিদ্ধান্ত অনুসারে অর্ধবৃত্তস্থ কোণ সর্বদা এক সমকোণ বা ৯০°। কেন্দ্রস্থ সরলকোণ ১৮০° এর অর্ধেক হলো ৯০°।',
  },
  {
    id: 2,
    question: 'বৃত্তের কেন্দ্র ও ব্যাস ভিন্ন কোনো জ্যা-এর মধ্যবিন্দুর সংযোজক রেখাংশ ঐ জ্যা-এর ওপর—',
    options: ['সমান্তরাল', 'লম্ব', 'স্পর্শক', 'কর্ণ'],
    correctAnswer: 1,
    explanation:
      'উপপাদ্য ১৭: বৃত্তের কেন্দ্র ও ব্যাস ভিন্ন কোনো জ্যা-এর মধ্যবিন্দুর সংযোজক রেখাংশ ঐ জ্যা-এর ওপর লম্ব (OD ⊥ AB)।',
  },
  {
    id: 3,
    question: 'বৃত্তের কেন্দ্র থেকে দুটি সমান জ্যা-এর দূরত্ব সর্বদা কেমন হয়?',
    options: ['অসমান', 'সমদূরবর্তী', 'দ্বিগুণ দূরবর্তী', 'শূন্য'],
    correctAnswer: 1,
    explanation:
      'উপপাদ্য ১৮: বৃত্তের সকল সমান জ্যা কেন্দ্র থেকে সমদূরবর্তী (AB = CD হলে OE = OF)।',
  },
  {
    id: 4,
    question: 'বৃত্তস্থ চতুর্ভুজ ABCD-তে ∠B = 100° হলে বিপরীত কোণ ∠D-এর মান কত?',
    options: ['৮০°', '৯০°', '১০০°', '২০০°'],
    correctAnswer: 0,
    explanation:
      'উপপাদ্য ২৩ অনুসারে বৃত্তস্থ চতুর্ভুজের বিপরীত কোণদ্বয়ের সমষ্টি ১৮০°। সুতরাং ∠D = 180° - 100° = 80°।',
  },
  {
    id: 5,
    question: 'দুটি বৃত্ত পরস্পরকে বহিঃস্পর্শ করলে তাদের কেন্দ্রদ্বয়ের মধ্যবর্তী দূরত্ব কত?',
    options: ['R - r', 'R × r', 'R + r', '(R + r) / 2'],
    correctAnswer: 2,
    explanation:
      'উপপাদ্য ২৭: দুটি বৃত্ত পরস্পরকে বহিঃস্পর্শ করলে তাদের কেন্দ্রদ্বয় ও স্পর্শবিন্দু সমরেখ হয় এবং দূরত্ব কেন্দ্রদ্বয়ের ব্যাসার্ধের যোগফল (R + r)।',
  },
];

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

export function MathCircleGuidebook() {
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLab, setActiveLab] = useState<number>(1);

  // Lab 1 State: Chord and Center
  const [chordLength, setChordLength] = useState<number>(8); // cm
  const radius = 5; // cm (fixed for reference radius)
  const halfChord = chordLength / 2;
  const perpDist = Math.sqrt(Math.max(0, radius * radius - halfChord * halfChord));
  const [showTwinChord, setShowTwinChord] = useState<boolean>(true);

  // Lab 2 State: Central vs Inscribed Angle
  const [centralAngle, setCentralAngle] = useState<number>(90); // degrees
  const inscribedAngle = centralAngle / 2;
  const [showTwinInscribed, setShowTwinInscribed] = useState<boolean>(false);
  const [isSemiCircle, setIsSemiCircle] = useState<boolean>(false);

  // Lab 3 State: Cyclic Quadrilateral
  const [angleA, setAngleA] = useState<number>(85); // degrees
  const angleC = 180 - angleA;
  const [angleB, setAngleB] = useState<number>(95);
  const angleD = 180 - angleB;
  const [showExtAngle, setShowExtAngle] = useState<boolean>(false);

  // Lab 4 State: Tangents
  const [tangentRadius, setTangentRadius] = useState<number>(4); // cm
  const [pointDistOP, setPointDistOP] = useState<number>(7); // cm
  const tangentLength = Math.sqrt(Math.max(0, pointDistOP * pointDistOP - tangentRadius * tangentRadius));
  const [tangentMode, setTangentMode] = useState<'externalPoint' | 'touchingCircles'>('externalPoint');
  const [touchType, setTouchType] = useState<'external' | 'internal'>('external');
  const rSmall = 2.5;

  // Lab 5 State: Triangle Circles (Circumcircle vs Incircle)
  const [circleType, setCircleType] = useState<'circum' | 'incircle' | 'excircle'>('circum');
  const [constructionStep, setConstructionStep] = useState<number>(3); // 1..3

  // Step 2 CQ Accordions
  const [openCqIndex, setOpenCqIndex] = useState<number | null>(0);

  // Step 3 Interactive Challenges State
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
      text: 'নমস্কার! আমি শেরু — তোমার গণিত জ্যামিতি গাইড। অধ্যায় ৮ বৃত্তের উপপাদ্য ১৭ থেকে ২৭, কেন্দ্রস্থ ও বৃত্তস্থ কোণ, বৃত্তস্থ চতুর্ভুজ বা সম্পাদ্যের যে কোনো প্রমাণে কোনো খটকা থাকলে আমাকে নির্ভয়ে জিজ্ঞেস করো!',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Handle Challenge Validations
  const validateCh1 = () => {
    // Challenge: Central angle is 110 deg. Inscribed angle = 55 deg.
    const val = parseFloat(ch1Input.trim());
    if (val === 55) {
      setCh1Status('correct');
    } else {
      setCh1Status('wrong');
    }
  };

  const validateCh2 = () => {
    // Challenge: r = 6, d = 10. Tangent length = sqrt(100 - 36) = 8 cm.
    const val = parseFloat(ch2Input.trim());
    if (val === 8) {
      setCh2Status('correct');
    } else {
      setCh2Status('wrong');
    }
  };

  const validateCh3 = () => {
    // Challenge: Cyclic quadrilateral angle A = 75 deg. Opposite angle C = 180 - 75 = 105 deg.
    const val = parseFloat(ch3Input.trim());
    if (val === 105) {
      setCh3Status('correct');
    } else {
      setCh3Status('wrong');
    }
  };

  // Quiz calculations
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
      let reply = 'চমৎকার প্রশ্ন! ';
      if (userText.includes('উপপাদ্য ২০') || userText.includes('দ্বিগুণ') || userText.includes('কেন্দ্রস্থ')) {
        reply +=
          'উপপাদ্য ২০-এর মূল কথা হলো: একই চাপের ওপর কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের ঠিক দ্বিগুণ (∠BOC = 2∠BAC)। প্রমাণের চাবিকাঠি হলো কেন্দ্রগামী ব্যাস AD অঙ্কন করে ত্রিভুজের বহিঃস্থ কোণ ধর্ম প্রয়োগ করা!';
      } else if (userText.includes('চতুর্ভুজ') || userText.includes('২৩') || userText.includes('বিপরীত কোণ')) {
        reply +=
          'উপপাদ্য ২৩ অনুসারে বৃত্তস্থ চতুর্ভুজের বিপরীত কোণদ্বয়ের যোগফল সর্বদা ১৮০°। প্রমাণের সময় মনে রাখবে— কেন্দ্রের উভয় পাশের কোণ মিলিয়ে ৩৬০° (সাধারণ কোণ + প্রবৃদ্ধ কোণ) হয়!';
      } else if (userText.includes('স্পর্শক') || userText.includes('২৬') || userText.includes('PA')) {
        reply +=
          'উপপাদ্য ২৬ অনুযায়ী বহিঃস্থ বিন্দু থেকে টানা দুটি স্পর্শক সমান (PA = PB)। কারণ স্পর্শবিন্দুগামী ব্যাসার্ধ লম্ব হওয়ায় গঠিত ত্রিভুজদ্বয় সমকোণী অতিভুজ-বাহু শর্তে সর্বসম!';
      } else if (userText.includes('পরিবৃত্ত') || userText.includes('অন্তর্বৃত্ত') || userText.includes('সম্পাদ্য')) {
        reply +=
          'মনে রাখবে— পরিবৃত্ত আঁকতে বাহুর লম্বসমদ্বিখণ্ডক ছেদ করে পরিকেন্দ্র O বের করতে হয়, আর অন্তর্বৃত্ত আঁকতে কোণের সমদ্বিখণ্ডক ছেদ করে অন্তঃকেন্দ্র I বের করতে হয়!';
      } else {
        reply +=
          'বৃত্ত অধ্যায়ে প্রতিটি প্রমাণের ছবি স্পষ্ট করে আঁকা এবং পিথাগোরাস বা সর্বসমতার শর্ত উল্লেখ করা ফুল মার্কস পাওয়ার প্রধান কৌশল!';
      }
      setChatMessages((prev) => [...prev, { sender: 'sheru', text: reply }]);
    }, 600);
  };

  // Lab 1 SVG coordinates
  // Circle center (150, 150), radius R = 100 px (scale: 20px = 1cm)
  const cx1 = 150;
  const cy1 = 150;
  const r1 = 100;
  // halfChord in px = halfChord * 20
  const dPx = (perpDist / radius) * r1;
  const hPx = (halfChord / radius) * r1;
  const ax1 = cx1 - hPx;
  const ay1 = cy1 - dPx;
  const bx1 = cx1 + hPx;
  const by1 = cy1 - dPx;

  // Lab 2 SVG coordinates
  const cx2 = 150;
  const cy2 = 150;
  const r2 = 100;
  const effCentralAngle = isSemiCircle ? 180 : centralAngle;
  const halfCA = (effCentralAngle / 2) * (Math.PI / 180);
  // Bottom arc B and C
  const bx2 = cx2 - r2 * Math.sin(halfCA);
  const by2 = cy2 + r2 * Math.cos(halfCA);
  const cx_pt2 = cx2 + r2 * Math.sin(halfCA);
  const cy_pt2 = cy2 + r2 * Math.cos(halfCA);
  // Top inscribed point A
  const ax2 = cx2;
  const ay2 = cy2 - r2;
  const ax2_twin = cx2 + 40;
  const ay2_twin = cy2 - Math.sqrt(Math.max(0, r2 * r2 - 40 * 40));

  // Lab 3 SVG coordinates for Cyclic Quadrilateral
  const cx3 = 150;
  const cy3 = 150;
  const r3 = 100;
  // 4 vertices on circle
  const ptA = { x: cx3 - 30, y: cy3 - 95 };
  const ptB = { x: cx3 + 80, y: cy3 - 60 };
  const ptC = { x: cx3 + 70, y: cy3 + 70 };
  const ptD = { x: cx3 - 85, y: cy3 + 50 };
  const ptExt = { x: ptC.x + (ptC.x - ptD.x) * 0.5, y: ptC.y + (ptC.y - ptD.y) * 0.5 };

  // Lab 4 SVG coordinates for Tangents
  const cx4 = 120;
  const cy4 = 150;
  const r4 = 60; // radius
  const px4 = cx4 + 130; // Point P distance
  const py4 = cy4;
  // Tangent points A and B
  const dO_P = px4 - cx4; // 130
  const angleAlpha = Math.acos(r4 / dO_P);
  const tax4 = cx4 + r4 * Math.cos(angleAlpha);
  const tay4 = cy4 - r4 * Math.sin(angleAlpha);
  const tbx4 = cx4 + r4 * Math.cos(angleAlpha);
  const tby4 = cy4 + r4 * Math.sin(angleAlpha);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* --------------------------------------------------------------------- */}
      {/* HEADER SECTION (Top Navigation & Breadcrumb)                          */}
      {/* --------------------------------------------------------------------- */}
      <GuidebookHeaderNav
        subjectKey="math"
        subjectNameBn="সাধারণ গণিত"
        chapterNum={8}
        chapterTitleBn="বৃত্ত (Circle)"
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

          {/* LAB 1: CENTER & CHORDS (THEOREMS 17, 18, 19) */}
          {activeLab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive SVG Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Circle className="h-4 w-4 text-primary" />
                    <span>উপপাদ্য ১৭ ও ১৮ সিমুলেটর (পিথাগোরাস ও জ্যা)</span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">
                    ব্যাসার্ধ R = 5 cm
                  </span>
                </div>

                <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center bg-muted/20 rounded-2xl border border-border/50">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    {/* Circle */}
                    <circle
                      cx={cx1}
                      cy={cy1}
                      r={r1}
                      className="fill-primary/5 stroke-primary stroke-[2.5]"
                    />
                    {/* Center Point O */}
                    <circle cx={cx1} cy={cy1} r="4" className="fill-foreground" />
                    <text x={cx1 + 8} y={cy1 - 6} className="text-[12px] font-bold fill-foreground">
                      O
                    </text>

                    {/* Chord AB */}
                    <line
                      x1={ax1}
                      y1={ay1}
                      x2={bx1}
                      y2={by1}
                      className="stroke-blue-600 stroke-[3]"
                    />
                    <circle cx={ax1} cy={ay1} r="4" className="fill-blue-600" />
                    <text x={ax1 - 18} y={ay1 - 5} className="text-[12px] font-bold fill-blue-600">
                      A
                    </text>
                    <circle cx={bx1} cy={by1} r="4" className="fill-blue-600" />
                    <text x={bx1 + 8} y={by1 - 5} className="text-[12px] font-bold fill-blue-600">
                      B
                    </text>

                    {/* Perpendicular OD to AB */}
                    <line
                      x1={cx1}
                      y1={cy1}
                      x2={cx1}
                      y2={ay1}
                      strokeDasharray="4 4"
                      className="stroke-amber-600 stroke-[2]"
                    />
                    <circle cx={cx1} cy={ay1} r="3.5" className="fill-amber-600" />
                    <text x={cx1 + 6} y={ay1 + 16} className="text-[11px] font-bold fill-amber-600">
                      D (মধ্যবিন্দু)
                    </text>

                    {/* Right Angle Marker at D */}
                    <path
                      d={`M ${cx1 - 8} ${ay1} L ${cx1 - 8} ${ay1 + 8} L ${cx1} ${ay1 + 8}`}
                      fill="none"
                      className="stroke-amber-600 stroke-[1.5]"
                    />

                    {/* Radius OA and OB (Hypotenuse) */}
                    <line
                      x1={cx1}
                      y1={cy1}
                      x2={ax1}
                      y2={ay1}
                      className="stroke-primary/70 stroke-[1.5]"
                    />
                    <line
                      x1={cx1}
                      y1={cy1}
                      x2={bx1}
                      y2={by1}
                      className="stroke-primary/70 stroke-[1.5]"
                    />

                    {/* Twin Chord CD if enabled */}
                    {showTwinChord && (
                      <g>
                        <line
                          x1={cx1 - hPx}
                          y1={cy1 + dPx}
                          x2={cx1 + hPx}
                          y2={cy1 + dPx}
                          className="stroke-emerald-600 stroke-[3]"
                        />
                        <circle cx={cx1 - hPx} cy={cy1 + dPx} r="4" className="fill-emerald-600" />
                        <text x={cx1 - hPx - 18} y={cy1 + dPx + 5} className="text-[12px] font-bold fill-emerald-600">
                          C
                        </text>
                        <circle cx={cx1 + hPx} cy={cy1 + dPx} r="4" className="fill-emerald-600" />
                        <text x={cx1 + hPx + 8} y={cy1 + dPx + 5} className="text-[12px] font-bold fill-emerald-600">
                          D
                        </text>
                        {/* OF perpendicular */}
                        <line
                          x1={cx1}
                          y1={cy1}
                          x2={cx1}
                          y2={cy1 + dPx}
                          strokeDasharray="4 4"
                          className="stroke-emerald-600 stroke-[2]"
                        />
                        <text x={cx1 + 6} y={cy1 + dPx - 8} className="text-[11px] font-bold fill-emerald-600">
                          F
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Live Calculated Stats */}
                <div className="grid grid-cols-3 gap-2 w-full mt-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <div className="text-[10px] text-blue-600 font-bold">জ্যা-এর দৈর্ঘ্য (AB)</div>
                    <div className="text-sm font-black text-blue-700 dark:text-blue-400">
                      {chordLength} cm
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <div className="text-[10px] text-amber-600 font-bold">লম্ব দূরত্ব (OD)</div>
                    <div className="text-sm font-black text-amber-700 dark:text-amber-400">
                      {perpDist.toFixed(2)} cm
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-center">
                    <div className="text-[10px] text-primary font-bold">অর্ধেক জ্যা (AD)</div>
                    <div className="text-sm font-black text-primary">
                      {halfChord} cm
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls and Mathematical Insights */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <span>জ্যা ও দূরত্বের অনুপাত কন্ট্রোল</span>
                    </h3>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-muted-foreground">জ্যা AB এর দৈর্ঘ্য:</span>
                      <span className="font-bold text-primary">{chordLength} cm</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="9.6"
                      step="0.2"
                      value={chordLength}
                      onChange={(e) => setChordLength(parseFloat(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>2 cm</span>
                      <span>8 cm (স্ট্যান্ডার্ড)</span>
                      <span>9.6 cm</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      সমান জ্যা CD ও লম্ব দূরত্ব OF প্রদর্শন:
                    </span>
                    <button
                      onClick={() => setShowTwinChord(!showTwinChord)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        showTwinChord
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {showTwinChord ? 'চালু' : 'বন্ধ'}
                    </button>
                  </div>
                </div>

                {/* Theorem Insight Cards */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>উপপাদ্য ১৭, ১৮ ও ১৯ এর সারকথা</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-2 text-xs leading-relaxed text-muted-foreground">
                    <div>
                      <strong className="text-foreground">উপপাদ্য ১৭:</strong> বৃত্তের কেন্দ্র ও জ্যা-এর মধ্যবিন্দুর সংযোজক রেখাংশ লম্ব (
                      <RenderMathText text="$OD \perp AB$" />)। কারণ △OAD ও △OBD সর্বসম (SSS সর্বসমতা: OA=OB=R, AD=DB, OD সাধারণ)।
                    </div>
                    <div>
                      <strong className="text-foreground">পিথাগোরাস সূত্র:</strong> সমকোণী △OAD-তে <RenderMathText text="$OA^2 = OD^2 + AD^2 \implies R^2 = d^2 + (AB/2)^2$" />।
                    </div>
                    <div>
                      <strong className="text-foreground">উপপাদ্য ১৮ ও ১৯:</strong> যদি <RenderMathText text="$AB = CD$" /> হয়, তবে <RenderMathText text="$OE = OF$" /> (সমান জ্যা কেন্দ্র থেকে সমদূরবর্তী)। বিপরীতভাবে, কেন্দ্র থেকে সমদূরবর্তী হলে জ্যা-দ্বয় সমান।
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 2: CENTRAL VS INSCRIBED ANGLE (THEOREM 20 & COROLLARIES) */}
          {activeLab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive SVG Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Circle className="h-4 w-4 text-primary" />
                    <span>উপপাদ্য ২০: কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    ∠BOC = 2∠BAC
                  </span>
                </div>

                <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center bg-muted/20 rounded-2xl border border-border/50">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    {/* Circle */}
                    <circle
                      cx={cx2}
                      cy={cy2}
                      r={r2}
                      className="fill-primary/5 stroke-primary stroke-[2.5]"
                    />
                    {/* Arc BC highlighted */}
                    <path
                      d={`M ${bx2} ${by2} A ${r2} ${r2} 0 0 0 ${cx_pt2} ${cy_pt2}`}
                      fill="none"
                      className="stroke-amber-500 stroke-[5]"
                    />

                    {/* Center Point O */}
                    <circle cx={cx2} cy={cy2} r="4" className="fill-foreground" />
                    <text x={cx2 + 8} y={cy2 + 15} className="text-[12px] font-bold fill-foreground">
                      O
                    </text>

                    {/* Arc points B and C */}
                    <circle cx={bx2} cy={by2} r="4" className="fill-amber-600" />
                    <text x={bx2 - 16} y={by2 + 16} className="text-[12px] font-bold fill-amber-600">
                      B
                    </text>
                    <circle cx={cx_pt2} cy={cy_pt2} r="4" className="fill-amber-600" />
                    <text x={cx_pt2 + 8} y={cy_pt2 + 16} className="text-[12px] font-bold fill-amber-600">
                      C
                    </text>

                    {/* Central Rays OB and OC */}
                    <line x1={cx2} y1={cy2} x2={bx2} y2={by2} className="stroke-primary stroke-[2]" />
                    <line x1={cx2} y1={cy2} x2={cx_pt2} y2={cy_pt2} className="stroke-primary stroke-[2]" />

                    {/* Inscribed Point A on top */}
                    <circle cx={ax2} cy={ay2} r="4.5" className="fill-blue-600" />
                    <text x={ax2 - 6} y={ay2 - 8} className="text-[13px] font-black fill-blue-600">
                      A
                    </text>

                    {/* Inscribed Rays AB and AC */}
                    <line x1={ax2} y1={ay2} x2={bx2} y2={by2} className="stroke-blue-600 stroke-[2.5]" />
                    <line x1={ax2} y1={ay2} x2={cx_pt2} y2={cy_pt2} className="stroke-blue-600 stroke-[2.5]" />

                    {/* Center Diameter AD for Proof illustration */}
                    <line
                      x1={ax2}
                      y1={ay2}
                      x2={cx2}
                      y2={cy2 + r2}
                      strokeDasharray="3 3"
                      className="stroke-muted-foreground/60 stroke-[1.5]"
                    />
                    <text x={cx2 + 6} y={cy2 + r2 - 4} className="text-[10px] fill-muted-foreground">
                      D
                    </text>

                    {/* Second Inscribed Point (Corollary 1) */}
                    {showTwinInscribed && (
                      <g>
                        <circle cx={ax2_twin} cy={ay2_twin} r="4" className="fill-purple-600" />
                        <text x={ax2_twin + 6} y={ay2_twin - 4} className="text-[12px] font-bold fill-purple-600">
                          A₂
                        </text>
                        <line x1={ax2_twin} y1={ay2_twin} x2={bx2} y2={by2} className="stroke-purple-600 stroke-[1.8]" />
                        <line x1={ax2_twin} y1={ay2_twin} x2={cx_pt2} y2={cy_pt2} className="stroke-purple-600 stroke-[1.8]" />
                      </g>
                    )}
                  </svg>
                </div>

                {/* Live Angle Display Badges */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                    <div className="text-[11px] text-primary font-bold">কেন্দ্রস্থ কোণ (∠BOC)</div>
                    <div className="text-base font-black text-primary">
                      {effCentralAngle}°
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <div className="text-[11px] text-blue-600 font-bold">বৃত্তস্থ কোণ (∠BAC)</div>
                    <div className="text-base font-black text-blue-700 dark:text-blue-400">
                      {inscribedAngle}°
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls and Proof Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <span>বৃত্তচাপ ও কোণ কন্ট্রোলার</span>
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-muted-foreground">কেন্দ্রস্থ কোণ ∠BOC:</span>
                      <span className="font-bold text-primary">{effCentralAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="160"
                      step="5"
                      disabled={isSemiCircle}
                      value={centralAngle}
                      onChange={(e) => setCentralAngle(parseInt(e.target.value))}
                      className="w-full accent-primary cursor-pointer disabled:opacity-40"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>40°</span>
                      <span>90°</span>
                      <span>160°</span>
                    </div>
                  </div>

                  {/* Corollaries Toggles */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        অনুসিদ্ধান্ত ২ (অর্ধবৃত্তস্থ কোণ = ৯০°):
                      </span>
                      <button
                        onClick={() => setIsSemiCircle(!isSemiCircle)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isSemiCircle
                            ? 'bg-amber-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isSemiCircle ? 'সক্রিয় (১৮০°/৯০°)' : 'বন্ধ'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        অনুসিদ্ধান্ত ১ (একই চাপের বৃত্তস্থ কোণসমূহ সমান):
                      </span>
                      <button
                        onClick={() => setShowTwinInscribed(!showTwinInscribed)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          showTwinInscribed
                            ? 'bg-purple-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {showTwinInscribed ? 'A₂ প্রদর্শিত' : 'লুকানো'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mathematical Proof Steps Card */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2.5">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>প্রমাণের মূল যুক্তি (৩ ধাপে মনে রাখুন)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-2 text-xs leading-relaxed text-muted-foreground">
                    <div>
                      <strong className="text-foreground">১. সমদ্বিবাহু ত্রিভুজ:</strong> △OAB-তে OA = OB (একই ব্যাসার্ধ), তাই ∠OAB = ∠OBA।
                    </div>
                    <div>
                      <strong className="text-foreground">২. ত্রিভুজের বহিঃস্থ কোণ:</strong> বহিঃস্থ কোণ অন্তঃস্থ বিপরীত কোণদ্বয়ের সমষ্টির সমান। সুতরাং ∠BOD = ∠OAB + ∠OBA = 2∠OAB।
                    </div>
                    <div>
                      <strong className="text-foreground">৩. যোগফল:</strong> অনুরূপভাবে ∠COD = 2∠OAC। দুটি সমীকরণ যোগ করলে পাই <RenderMathText text="$\angle BOC = 2\angle BAC$" />!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 3: CYCLIC QUADRILATERAL (THEOREMS 23 & 24) */}
          {activeLab === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive SVG Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Circle className="h-4 w-4 text-primary" />
                    <span>উপপাদ্য ২৩: বৃত্তস্থ চতুর্ভুজের বিপরীত কোণদ্বয় সম্পূরক</span>
                  </div>
                  <span className="text-xs font-mono text-purple-600 font-bold">
                    ∠A + ∠C = 180°
                  </span>
                </div>

                <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center bg-muted/20 rounded-2xl border border-border/50">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    {/* Circle */}
                    <circle
                      cx={cx3}
                      cy={cy3}
                      r={r3}
                      className="fill-primary/5 stroke-primary stroke-[2.5]"
                    />
                    {/* Center Point O */}
                    <circle cx={cx3} cy={cy3} r="3.5" className="fill-foreground" />
                    <text x={cx3 + 6} y={cy3 - 4} className="text-[11px] font-bold fill-foreground">
                      O
                    </text>

                    {/* Cyclic Quadrilateral ABCD */}
                    <polygon
                      points={`${ptA.x},${ptA.y} ${ptB.x},${ptB.y} ${ptC.x},${ptC.y} ${ptD.x},${ptD.y}`}
                      className="fill-purple-500/10 stroke-purple-600 stroke-[2.5]"
                    />

                    {/* Vertex Points & Labels */}
                    <circle cx={ptA.x} cy={ptA.y} r="4" className="fill-purple-600" />
                    <text x={ptA.x - 8} y={ptA.y - 8} className="text-[12px] font-bold fill-purple-600">
                      A ({angleA}°)
                    </text>

                    <circle cx={ptB.x} cy={ptB.y} r="4" className="fill-blue-600" />
                    <text x={ptB.x + 8} y={ptB.y - 4} className="text-[12px] font-bold fill-blue-600">
                      B ({angleB}°)
                    </text>

                    <circle cx={ptC.x} cy={ptC.y} r="4" className="fill-purple-600" />
                    <text x={ptC.x + 8} y={ptC.y + 16} className="text-[12px] font-bold fill-purple-600">
                      C ({angleC}°)
                    </text>

                    <circle cx={ptD.x} cy={ptD.y} r="4" className="fill-blue-600" />
                    <text x={ptD.x - 18} y={ptD.y + 14} className="text-[12px] font-bold fill-blue-600">
                      D ({angleD}°)
                    </text>

                    {/* Extended ray for exterior angle */}
                    {showExtAngle && (
                      <g>
                        <line
                          x1={ptD.x}
                          y1={ptD.y}
                          x2={ptExt.x}
                          y2={ptExt.y}
                          strokeDasharray="4 4"
                          className="stroke-amber-600 stroke-[2]"
                        />
                        <circle cx={ptExt.x} cy={ptExt.y} r="3" className="fill-amber-600" />
                        <text x={ptExt.x + 6} y={ptExt.y + 12} className="text-[11px] font-bold fill-amber-600">
                          E (বহিঃস্থ = {angleA}°)
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Supplementary Angle Validation Badges */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                    <div className="text-[11px] text-purple-600 font-bold">∠A + ∠C যোগফল</div>
                    <div className="text-base font-black text-purple-700 dark:text-purple-400">
                      {angleA}° + {angleC}° = 180°
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <div className="text-[11px] text-blue-600 font-bold">∠B + ∠D যোগফল</div>
                    <div className="text-base font-black text-blue-700 dark:text-blue-400">
                      {angleB}° + {angleD}° = 180°
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls and Quadrilateral Properties */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <span>কোণ স্লাইডার ও বহিঃস্থ কোণ</span>
                  </h3>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-muted-foreground">শীর্ষ কোণ ∠A:</span>
                      <span className="font-bold text-purple-600">{angleA}° (বিপরীত C = {angleC}°)</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="130"
                      step="5"
                      value={angleA}
                      onChange={(e) => setAngleA(parseInt(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
                      <span>50°</span>
                      <span>85°</span>
                      <span>130°</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-muted-foreground">শীর্ষ কোণ ∠B:</span>
                      <span className="font-bold text-blue-600">{angleB}° (বিপরীত D = {angleD}°)</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="130"
                      step="5"
                      value={angleB}
                      onChange={(e) => setAngleB(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      বহিঃস্থ কোণ প্রদর্শন (∠BCE = ∠BAD):
                    </span>
                    <button
                      onClick={() => setShowExtAngle(!showExtAngle)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        showExtAngle
                          ? 'bg-amber-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {showExtAngle ? 'চালু' : 'বন্ধ'}
                    </button>
                  </div>
                </div>

                {/* Theorem Insight */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2.5">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>উপপাদ্য ২৩ ও ২৪ এর মূল ধারণা</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-2 text-xs leading-relaxed text-muted-foreground">
                    <div>
                      <strong className="text-foreground">উপপাদ্য ২৩:</strong> বৃত্তে অন্তর্লিখিত চতুর্ভুজের বিপরীত কোণদ্বয়ের সমষ্টি দুই সমকোণ বা ১৮০°। প্রমাণের চাবিকাঠি: কেন্দ্রস্থ সাধারণ কোণ ও অপর পাশের প্রবৃদ্ধ কোণের সমষ্টি ৩৬০°।
                    </div>
                    <div>
                      <strong className="text-foreground">উপপাদ্য ২৪ (বিপরীত):</strong> যদি কোনো চতুর্ভুজের দুটি বিপরীত কোণের সমষ্টি ১৮০° হয়, তবে তার শীর্ষবিন্দু ৪টি সমবৃত্ত (Concyclic) হবে।
                    </div>
                    <div>
                      <strong className="text-foreground">বহিঃস্থ কোণ ধর্ম:</strong> এক বাহু বর্ধিত করলে উৎপন্ন বহিঃস্থ কোণ বিপরীত অন্তঃস্থ কোণের সমান (উভয়েই ১৮০° সম্পূরক)।
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 4: TANGENTS & EXTERNAL SECANTS (THEOREMS 25, 26, 27) */}
          {activeLab === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive SVG Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Circle className="h-4 w-4 text-primary" />
                    <span>
                      {tangentMode === 'externalPoint'
                        ? 'উপপাদ্য ২৫ ও ২৬: বহিঃস্থ বিন্দু থেকে স্পর্শক যুগল (PA = PB)'
                        : 'উপপাদ্য ২৭: দুটি বৃত্তের পরস্পর স্পর্শ ল্যাব'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    {tangentMode === 'externalPoint' ? 'PA = PB' : 'কেন্দ্রদ্বয়ের দূরত্ব d'}
                  </span>
                </div>

                <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center bg-muted/20 rounded-2xl border border-border/50">
                  <svg viewBox="0 0 320 300" className="w-full h-full">
                    {tangentMode === 'externalPoint' ? (
                      <g>
                        {/* Circle */}
                        <circle
                          cx={cx4}
                          cy={cy4}
                          r={r4}
                          className="fill-primary/5 stroke-primary stroke-[2.5]"
                        />
                        {/* Center Point O */}
                        <circle cx={cx4} cy={cy4} r="4" className="fill-foreground" />
                        <text x={cx4 - 15} y={cy4 - 6} className="text-[12px] font-bold fill-foreground">
                          O
                        </text>

                        {/* External Point P */}
                        <circle cx={px4} cy={py4} r="5" className="fill-amber-600" />
                        <text x={px4 + 8} y={py4 + 4} className="text-[13px] font-black fill-amber-600">
                          P
                        </text>

                        {/* Line OP */}
                        <line
                          x1={cx4}
                          y1={cy4}
                          x2={px4}
                          y2={py4}
                          strokeDasharray="4 4"
                          className="stroke-muted-foreground stroke-[1.5]"
                        />

                        {/* Tangent Line PA and PB */}
                        <line x1={px4} y1={py4} x2={tax4} y2={tay4} className="stroke-blue-600 stroke-[3]" />
                        <line x1={px4} y1={py4} x2={tbx4} y2={tby4} className="stroke-blue-600 stroke-[3]" />

                        {/* Tangent Points A and B */}
                        <circle cx={tax4} cy={tay4} r="4" className="fill-blue-600" />
                        <text x={tax4 - 8} y={tay4 - 10} className="text-[12px] font-bold fill-blue-600">
                          A
                        </text>

                        <circle cx={tbx4} cy={tby4} r="4" className="fill-blue-600" />
                        <text x={tbx4 - 8} y={tby4 + 18} className="text-[12px] font-bold fill-blue-600">
                          B
                        </text>

                        {/* Radii OA and OB (Perpendiculars) */}
                        <line x1={cx4} y1={cy4} x2={tax4} y2={tay4} className="stroke-primary stroke-[2]" />
                        <line x1={cx4} y1={cy4} x2={tbx4} y2={tby4} className="stroke-primary stroke-[2]" />

                        {/* Right angle markers */}
                        <circle cx={tax4} cy={tay4} r="1.5" className="fill-primary" />
                        <circle cx={tbx4} cy={tby4} r="1.5" className="fill-primary" />
                      </g>
                    ) : (
                      <g>
                        {/* Touching Circles Mode */}
                        {touchType === 'external' ? (
                          <g>
                            {/* Circle 1 */}
                            <circle cx="100" cy="150" r="50" className="fill-primary/5 stroke-primary stroke-[2.5]" />
                            <circle cx="100" cy="150" r="3.5" className="fill-foreground" />
                            <text x="90" y="145" className="text-[11px] font-bold fill-foreground">O₁ (R=5)</text>

                            {/* Circle 2 */}
                            <circle cx="190" cy="150" r="40" className="fill-blue-500/5 stroke-blue-600 stroke-[2.5]" />
                            <circle cx="190" cy="150" r="3.5" className="fill-foreground" />
                            <text x="180" y="145" className="text-[11px] font-bold fill-foreground">O₂ (r=4)</text>

                            {/* Touch point T */}
                            <circle cx="150" cy="150" r="4.5" className="fill-emerald-600" />
                            <text x="145" y="138" className="text-[12px] font-bold fill-emerald-600">T</text>
                            {/* Common Tangent Line */}
                            <line x1="150" y1="70" x2="150" y2="230" strokeDasharray="3 3" className="stroke-emerald-600 stroke-[2]" />
                            <line x1="100" y1="150" x2="190" y2="150" className="stroke-foreground stroke-[1.5]" />
                          </g>
                        ) : (
                          <g>
                            {/* Internal touch */}
                            <circle cx="130" cy="150" r="70" className="fill-primary/5 stroke-primary stroke-[2.5]" />
                            <circle cx="130" cy="150" r="3.5" className="fill-foreground" />
                            <text x="120" y="145" className="text-[11px] font-bold fill-foreground">O₁ (R=7)</text>

                            <circle cx="160" cy="150" r="40" className="fill-blue-500/5 stroke-blue-600 stroke-[2.5]" />
                            <circle cx="160" cy="150" r="3.5" className="fill-foreground" />
                            <text x="155" y="145" className="text-[11px] font-bold fill-foreground">O₂ (r=4)</text>

                            {/* Touch point T */}
                            <circle cx="200" cy="150" r="4.5" className="fill-emerald-600" />
                            <text x="195" y="138" className="text-[12px] font-bold fill-emerald-600">T</text>
                            <line x1="200" y1="70" x2="200" y2="230" strokeDasharray="3 3" className="stroke-emerald-600 stroke-[2]" />
                          </g>
                        )}
                      </g>
                    )}
                  </svg>
                </div>

                {/* Calculation Cards */}
                {tangentMode === 'externalPoint' ? (
                  <div className="grid grid-cols-3 gap-2 w-full mt-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-center">
                      <div className="text-[10px] text-primary font-bold">ব্যাসার্ধ (r)</div>
                      <div className="text-sm font-black text-primary">{tangentRadius} cm</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                      <div className="text-[10px] text-amber-600 font-bold">দূরত্ব (OP)</div>
                      <div className="text-sm font-black text-amber-700 dark:text-amber-400">{pointDistOP} cm</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <div className="text-[10px] text-blue-600 font-bold">স্পর্শক (PA = PB)</div>
                      <div className="text-sm font-black text-blue-700 dark:text-blue-400">
                        {tangentLength.toFixed(2)} cm
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center w-full mt-4">
                    <div className="text-xs text-emerald-600 font-bold">
                      {touchType === 'external' ? 'বহিঃস্পর্শ কেন্দ্রদ্বয়ের দূরত্ব d = R + r' : 'অন্তঃস্পর্শ কেন্দ্রদ্বয়ের দূরত্ব d = R - r'}
                    </div>
                    <div className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {touchType === 'external' ? '5 + 4 = 9 cm' : '7 - 4 = 3 cm'}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls and Explanations */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTangentMode('externalPoint')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        tangentMode === 'externalPoint'
                          ? 'bg-[#FF6B57] text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      বহিঃস্থ স্পর্শক (উপপাদ্য ২৫-২৬)
                    </button>
                    <button
                      onClick={() => setTangentMode('touchingCircles')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        tangentMode === 'touchingCircles'
                          ? 'bg-[#FF6B57] text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      স্পর্শক বৃত্তদ্বয় (উপপাদ্য ২৭)
                    </button>
                  </div>

                  {tangentMode === 'externalPoint' ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-muted-foreground">বিন্দু P-এর দূরত্ব OP:</span>
                          <span className="font-bold text-amber-600">{pointDistOP} cm</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="10"
                          step="0.5"
                          value={pointDistOP}
                          onChange={(e) => setPointDistOP(parseFloat(e.target.value))}
                          className="w-full accent-amber-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-muted-foreground">বৃত্তের ব্যাসার্ধ r:</span>
                          <span className="font-bold text-primary">{tangentRadius} cm</span>
                        </div>
                        <input
                          type="range"
                          min="2.5"
                          max="4.5"
                          step="0.5"
                          value={tangentRadius}
                          onChange={(e) => setTangentRadius(parseFloat(e.target.value))}
                          className="w-full accent-primary cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <span className="text-xs text-muted-foreground font-medium block">
                        স্পর্শের ধরণ নির্বাচন করুন:
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTouchType('external')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            touchType === 'external'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          বহিঃস্পর্শ (d = R + r)
                        </button>
                        <button
                          onClick={() => setTouchType('internal')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            touchType === 'internal'
                              ? 'bg-blue-600 text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          অন্তঃস্পর্শ (d = R - r)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Proof Notes */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2.5">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>উপপাদ্য ২৫ ও ২৬-এর প্রমাণ কৌশল</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-2 text-xs leading-relaxed text-muted-foreground">
                    <div>
                      <strong className="text-foreground">উপপাদ্য ২৫:</strong> স্পর্শক স্পর্শবিন্দুগামী ব্যাসার্ধের ওপর লম্ব (<RenderMathText text="$OA \perp PA$" />)। ফলে △OAP সর্বদা একটি সমকোণী ত্রিভুজ।
                    </div>
                    <div>
                      <strong className="text-foreground">উপপাদ্য ২৬ (সর্বসমতা):</strong> সমকোণী ত্রিভুজ △OAP ও △OBP-এ অতিভুজ OP সাধারণ এবং OA = OB = r। অতএব △OAP ≅ △OBP, যার ফলে <RenderMathText text="$PA = PB$" />।
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 5: CIRCUMCIRCLE, INCIRCLE & EXCIRCLE (CONSTRUCTIONS 8, 9, 10) */}
          {activeLab === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive SVG Simulator */}
              <div className="lg:col-span-7 bg-card rounded-3xl border border-border p-6 flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-primary" />
                    <span>
                      {circleType === 'circum'
                        ? 'সম্পাদ্য ৮: ত্রিভুজের পরিবৃত্ত অঙ্কন (Circumcircle)'
                        : circleType === 'incircle'
                        ? 'সম্পাদ্য ৯: ত্রিভুজের অন্তর্বৃত্ত অঙ্কন (Incircle)'
                        : 'সম্পাদ্য ১০: ত্রিভুজের বহির্বৃত্ত অঙ্কন (Excircle)'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-primary font-bold">
                    ধাপ {constructionStep} / ৩
                  </span>
                </div>

                <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center bg-muted/20 rounded-2xl border border-border/50">
                  <svg viewBox="0 0 320 300" className="w-full h-full">
                    {/* Base Triangle ABC */}
                    {/* A(160, 70), B(80, 210), C(240, 210) */}
                    <polygon
                      points="160,70 80,210 240,210"
                      className="fill-primary/5 stroke-foreground stroke-[2.5]"
                    />
                    <text x="155" y="60" className="text-[12px] font-bold fill-foreground">A</text>
                    <text x="65" y="222" className="text-[12px] font-bold fill-foreground">B</text>
                    <text x="245" y="222" className="text-[12px] font-bold fill-foreground">C</text>

                    {/* CIRCUMCIRCLE MODE */}
                    {circleType === 'circum' && (
                      <g>
                        {/* Step 1: Perpendicular bisectors */}
                        {constructionStep >= 1 && (
                          <g>
                            {/* Bisector of BC: x = 160 */}
                            <line x1="160" y1="120" x2="160" y2="240" strokeDasharray="3 3" className="stroke-blue-500 stroke-[1.5]" />
                            {/* Bisector of AB */}
                            <line x1="90" y1="110" x2="190" y2="170" strokeDasharray="3 3" className="stroke-blue-500 stroke-[1.5]" />
                            {/* Compass Arcs */}
                            <path d="M 150 200 A 15 15 0 0 1 170 200" fill="none" className="stroke-blue-400 stroke-[1]" />
                            <path d="M 150 220 A 15 15 0 0 1 170 220" fill="none" className="stroke-blue-400 stroke-[1]" />
                          </g>
                        )}
                        {/* Step 2: Circumcenter O */}
                        {constructionStep >= 2 && (
                          <g>
                            <circle cx="160" cy="152" r="4.5" className="fill-[#FF6B57]" />
                            <text x="168" y="156" className="text-[12px] font-black fill-primary">O (পরিকেন্দ্র)</text>
                            {/* Radius OA */}
                            <line x1="160" y1="152" x2="160" y2="70" strokeDasharray="2 2" className="stroke-primary stroke-[1.5]" />
                          </g>
                        )}
                        {/* Step 3: Complete Circumcircle */}
                        {constructionStep >= 3 && (
                          <circle
                            cx="160"
                            cy="152"
                            r="82"
                            className="fill-none stroke-primary stroke-[2.5]"
                          />
                        )}
                      </g>
                    )}

                    {/* INCIRCLE MODE */}
                    {circleType === 'incircle' && (
                      <g>
                        {/* Step 1: Angle bisectors of B and C */}
                        {constructionStep >= 1 && (
                          <g>
                            <line x1="80" y1="210" x2="190" y2="135" strokeDasharray="3 3" className="stroke-emerald-500 stroke-[1.5]" />
                            <line x1="240" y1="210" x2="130" y2="135" strokeDasharray="3 3" className="stroke-emerald-500 stroke-[1.5]" />
                            {/* Angle arcs */}
                            <path d="M 95 197 A 20 20 0 0 0 100 210" fill="none" className="stroke-emerald-400 stroke-[1.5]" />
                            <path d="M 220 210 A 20 20 0 0 0 225 197" fill="none" className="stroke-emerald-400 stroke-[1.5]" />
                          </g>
                        )}
                        {/* Step 2: Incenter I and Perpendicular ID */}
                        {constructionStep >= 2 && (
                          <g>
                            <circle cx="160" cy="165" r="4.5" className="fill-emerald-600" />
                            <text x="168" y="165" className="text-[12px] font-black fill-emerald-600">I (অন্তঃকেন্দ্র)</text>
                            {/* Perpendicular ID to BC */}
                            <line x1="160" y1="165" x2="160" y2="210" strokeDasharray="2 2" className="stroke-emerald-600 stroke-[1.5]" />
                            <circle cx="160" cy="210" r="3" className="fill-emerald-600" />
                            <text x="164" y="222" className="text-[10px] font-bold fill-emerald-600">D</text>
                          </g>
                        )}
                        {/* Step 3: Complete Incircle */}
                        {constructionStep >= 3 && (
                          <circle
                            cx="160"
                            cy="165"
                            r="45"
                            className="fill-emerald-500/10 stroke-emerald-600 stroke-[2.5]"
                          />
                        )}
                      </g>
                    )}

                    {/* EXCIRCLE MODE */}
                    {circleType === 'excircle' && (
                      <g>
                        {/* Extended rays of AB and AC */}
                        <line x1="80" y1="210" x2="50" y2="260" strokeDasharray="3 3" className="stroke-muted-foreground stroke-[1]" />
                        <line x1="240" y1="210" x2="270" y2="260" strokeDasharray="3 3" className="stroke-muted-foreground stroke-[1]" />
                        {/* Step 1 & 2: Excenter E */}
                        {constructionStep >= 1 && (
                          <g>
                            <line x1="80" y1="210" x2="160" y2="270" strokeDasharray="3 3" className="stroke-amber-500 stroke-[1.5]" />
                            <line x1="240" y1="210" x2="160" y2="270" strokeDasharray="3 3" className="stroke-amber-500 stroke-[1.5]" />
                          </g>
                        )}
                        {constructionStep >= 2 && (
                          <g>
                            <circle cx="160" cy="270" r="4.5" className="fill-amber-600" />
                            <text x="168" y="275" className="text-[12px] font-black fill-amber-600">E (বহিকেন্দ্র)</text>
                          </g>
                        )}
                        {constructionStep >= 3 && (
                          <circle
                            cx="160"
                            cy="270"
                            r="60"
                            className="fill-amber-500/10 stroke-amber-600 stroke-[2.5]"
                          />
                        )}
                      </g>
                    )}
                  </svg>
                </div>

                {/* Step indicator buttons */}
                <div className="flex items-center gap-2 mt-4">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() => setConstructionStep(step)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        constructionStep === step
                          ? 'bg-foreground text-background shadow-xs'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      ধাপ {step}: {step === 1 ? 'সমদ্বিখণ্ডক' : step === 2 ? 'কেন্দ্র ও ব্যাসার্ধ' : 'সম্পূর্ণ বৃত্ত'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls & Steps Explanation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
                  <span className="text-xs text-muted-foreground font-medium block">
                    অঙ্কন টাইপ পরিবর্তন করুন:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setCircleType('circum');
                        setConstructionStep(3);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        circleType === 'circum'
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      পরিবৃত্ত (সম্পাদ্য ৮)
                    </button>
                    <button
                      onClick={() => {
                        setCircleType('incircle');
                        setConstructionStep(3);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        circleType === 'incircle'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      অন্তর্বৃত্ত (সম্পাদ্য ৯)
                    </button>
                    <button
                      onClick={() => {
                        setCircleType('excircle');
                        setConstructionStep(3);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        circleType === 'excircle'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      বহির্বৃত্ত (সম্পাদ্য ১০)
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                    <div className="font-bold text-foreground">
                      {circleType === 'circum'
                        ? 'পরিকেন্দ্র O নির্ণয় কৌশল:'
                        : circleType === 'incircle'
                        ? 'অন্তঃকেন্দ্র I নির্ণয় কৌশল:'
                        : 'বহিকেন্দ্র E নির্ণয় কৌশল:'}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {circleType === 'circum'
                        ? 'যে কোনো দুটি বাহুর (যেমন AB ও BC) লম্বসমদ্বিখণ্ডক আঁকলেই তাদের ছেদবিন্দু পরিকেন্দ্র O পাওয়া যায়। OX = R ব্যাসার্ধ নিয়ে বৃত্ত আঁকা হয়।'
                        : circleType === 'incircle'
                        ? 'যে কোনো দুটি কোণের (যেমন ∠B ও ∠C) সমদ্বিখণ্ডক আঁকলেই তাদের ছেদবিন্দু অন্তঃকেন্দ্র I পাওয়া যায়। I থেকে BC-এর ওপর লম্ব ID = r অন্তর্ব্যাসার্ধ।'
                        : 'ত্রিভুজের বর্ধিত দুই বাহুর বহিঃস্থ কোণদ্বয়ের সমদ্বিখণ্ডকের ছেদবিন্দু বহিকেন্দ্র E। এটি ত্রিভুজের বাইরে একটি বাহুকে ও অপর দুই বাহুর বর্ধিতাংশকে স্পর্শ করে।'}
                    </p>
                  </div>
                </div>

                {/* Practical Exam Tips */}
                <div className="bg-card rounded-3xl border border-border p-5 space-y-2.5">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>ব্যবহারিক পরীক্ষায় ফুল মার্কস পাওয়ার টিপস</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-1.5 text-xs text-muted-foreground">
                    <div>• পেন্সিল কম্পাস দিয়ে অঙ্কনের বৃত্তচাপের দাগগুলো কখনো মুছবে না।</div>
                    <div>• অন্তর্বৃত্তের ক্ষেত্রে কেন্দ্র I থেকে বাহুর ওপর লম্ব অঙ্কন বাধ্যতামূলক।</div>
                    <div>• পরিবৃত্তের কেন্দ্র O ত্রিভুজের অভ্যন্তরে (সূক্ষ্মকোণী), অতিভুজের ওপর (সমকোণী), বা ত্রিভুজের বাইরে (স্থূলকোণী) হতে পারে।</div>
                  </div>
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
                ঢাকা, রাজশাহী ও চট্টগ্রাম বোর্ডের সর্বাধিক কমন ৩টি বৃত্ত সৃজনশীল প্রশ্ন। প্রতিটি প্রশ্নের ক, খ ও গ অংশের পূর্ণ সমাধান এবং পরীক্ষকের গোপন মার্কিং রুব্রিক্স দেওয়া হলো।
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
                বৃত্তের উপপাদ্য ও স্পর্শকের বাস্তব সমস্যা সমাধান করুন। সঠিক উত্তর ইনপুট দিয়ে তাৎক্ষণিক গ্রিন টিক অর্জন করুন।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* CHALLENGE 1 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                  চ্যালেঞ্জ ০১: উপপাদ্য ২০ কোণ নির্ণয়
                </span>
                {ch1Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                একটি বৃত্তে একই বৃত্তচাপ BC-এর ওপর দণ্ডায়মান কেন্দ্রস্থ কোণ <RenderMathText text="$\angle BOC = 110^\circ$" />। ঐ বৃত্তচাপের ওপর দণ্ডায়মান বৃত্তস্থ কোণ <RenderMathText text="$\angle BAC$" /> এর মান কত ডিগ্রি?
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="ডিগ্রিতে মান লিখুন (যেমন: 55)"
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
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। মনে রাখবেন: বৃত্তস্থ কোণ কেন্দ্রস্থ কোণের অর্ধেক (<RenderMathText text="$\angle BAC = \frac{1}{2} \angle BOC$" />)।
                </div>
              )}
            </div>

            {/* CHALLENGE 2 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  চ্যালেঞ্জ ০২: স্পর্শক দৈর্ঘ্য গণনা (উপপাদ্য ২৫ ও পিথাগোরাস)
                </span>
                {ch2Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                একটি বৃত্তের ব্যাসার্ধ <RenderMathText text="$r = 6\text{ cm}$" />। বৃত্তের কেন্দ্র O থেকে বহিঃস্থ বিন্দু P-এর দূরত্ব <RenderMathText text="$OP = 10\text{ cm}$" />। বিন্দু P থেকে বৃত্তের স্পর্শবিন্দু A-এর দূরত্ব (স্পর্শক PA-এর দৈর্ঘ্য) কত সেন্টিমিটার?
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="সেন্টিমিটারে মান লিখুন (যেমন: 8)"
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
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। পিথাগোরাস সূত্রে: <RenderMathText text="$PA = \sqrt{OP^2 - OA^2} = \sqrt{10^2 - 6^2}$" />।
                </div>
              )}
            </div>

            {/* CHALLENGE 3 */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  চ্যালেঞ্জ ০৩: বৃত্তস্থ চতুর্ভুজের বিপরীত কোণ (উপপাদ্য ২৩)
                </span>
                {ch3Status === 'correct' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> সঠিক হয়েছে!
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                একটি বৃত্তে অন্তর্লিখিত চতুর্ভুজ ABCD-তে <RenderMathText text="$\angle A = 75^\circ$" />। এর ঠিক বিপরীত কোণ <RenderMathText text="$\angle C$" /> এর মান কত ডিগ্রি?
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="ডিগ্রিতে মান লিখুন (যেমন: 105)"
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
                  <XCircle className="h-4 w-4" /> উত্তর মেলেনি। বৃত্তস্থ চতুর্ভুজের বিপরীত কোণদ্বয়ের যোগফল ১৮০° (<RenderMathText text="$\angle C = 180^\circ - 75^\circ$" />)।
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
                বৃত্ত অধ্যায় কুইজ ও আত্মযাচাই
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
                অধ্যায় ৮: বৃত্ত দ্রুত রিভিশন চিট-শীট (Formula & Theorem Notes)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                পরীক্ষার আগের রাতের জন্য এনসিটিবি বৃত্ত অধ্যায়ের সমস্ত মৌলিক উপপাদ্য, অনুসিদ্ধান্ত ও সূত্রসমূহের চূড়ান্ত সারসংক্ষেপ।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-primary/10 text-primary">
                উপপাদ্য ১৭ ও জ্যা লম্ব
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$OD \perp AB \implies AD = DB = \frac{1}{2}AB$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                বৃত্তের কেন্দ্র ও ব্যাস ভিন্ন কোনো জ্যা-এর মধ্যবিন্দুর সংযোজক রেখাংশ ঐ জ্যা-এর ওপর লম্ব। পিথাগোরাস প্রয়োগে কেন্দ্র থেকে দূরত্ব <RenderMathText text="$d = \sqrt{R^2 - (L/2)^2}$" />।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-500/10 text-blue-600">
                উপপাদ্য ২০ ও অনুসিদ্ধান্ত
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\angle BOC = 2\angle BAC$" /> (বৃত্তস্থ কোণ = <RenderMathText text="$\frac{1}{2}$" /> কেন্দ্রস্থ কোণ)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                একই বৃত্তচাপের ওপর কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ। অনুসিদ্ধান্ত: একই চাপের বৃত্তস্থ কোণগুলো পরস্পর সমান এবং অর্ধবৃত্তস্থ কোণ এক সমকোণ (৯০°)।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/10 text-purple-600">
                উপপাদ্য ২৩ ও বৃত্তস্থ চতুর্ভুজ
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$\angle A + \angle C = 180^\circ$" /> এবং <RenderMathText text="$\angle B + \angle D = 180^\circ$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                বৃত্তে অন্তর্লিখিত চতুর্ভুজের বিপরীত কোণদ্বয় সম্পূরক। এক বাহু বর্ধিত করলে উৎপন্ন বহিঃস্থ কোণ বিপরীত অন্তঃস্থ কোণের সমান।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/10 text-amber-600">
                উপপাদ্য ২৫ ও ২৬ (স্পর্শক)
              </span>
              <div className="text-xs font-bold text-foreground">
                <RenderMathText text="$OA \perp PA$" /> এবং <RenderMathText text="$PA = PB = \sqrt{OP^2 - R^2}$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                স্পর্শক স্পর্শবিন্দুগামী ব্যাসার্ধের ওপর লম্ব। বহিঃস্থ বিন্দু থেকে বৃত্তে টানা দুটি স্পর্শকের দৈর্ঘ্য পরস্পর সমান।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/10 text-emerald-600">
                উপপাদ্য ২৭ (স্পর্শক বৃত্তদ্বয়)
              </span>
              <div className="text-xs font-bold text-foreground">
                বহিঃস্পর্শে <RenderMathText text="$d = R + r$" />, অন্তঃস্পর্শে <RenderMathText text="$d = R - r$" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                দুটি বৃত্ত পরস্পর স্পর্শ করলে তাদের কেন্দ্রদ্বয় ও স্পর্শবিন্দু সমরেখ হয়। বহিঃস্পর্শে কেন্দ্রদ্বয়ের দূরত্ব ব্যাসার্ধের যোগফল এবং অন্তঃস্পর্শে বিয়োগফল।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/10 text-rose-600">
                সম্পাদ্য ৮, ৯ ও ১০ (ত্রিভুজের বৃত্ত)
              </span>
              <div className="text-xs font-bold text-foreground">
                পরিকেন্দ্র O (বাহুর লম্বসমদ্বিখণ্ডক) • অন্তঃকেন্দ্র I (কোণ সমদ্বিখণ্ডক)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                পরিবৃত্ত অঙ্কনে বাহুর লম্বসমদ্বিখণ্ডক এবং অন্তর্বৃত্তে কোণের সমদ্বিখণ্ডকের ছেদবিন্দু নির্ণয় আবশ্যক।
              </p>
            </div>
          </div>

          {/* Copyable Study Notes Box */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Copy className="h-4 w-4 text-primary" />
                <span>এক নজরে বৃত্ত অধ্যায়ের রিভিশন নোটস (কপি করুন)</span>
              </span>
              <button
                onClick={() => {
                  const text = `বৃত্ত অধ্যায় ৮ এনসিটিবি রিভিশন নোটস:
১. কেন্দ্র থেকে জ্যা-এর ওপর অঙ্কিত লম্ব জ্যা-কে সমদ্বিখণ্ডিত করে (উপপাদ্য ১৭)।
২. একই চাপের ওপর কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ (∠BOC = 2∠BAC, উপপাদ্য ২০)।
৩. অর্ধবৃত্তস্থ কোণ এক সমকোণ বা ৯০°।
৪. বৃত্তস্থ চতুর্ভুজের বিপরীত কোণদ্বয়ের সমষ্টি ১৮০° (উপপাদ্য ২৩)।
৫. বহিঃস্থ বিন্দু থেকে অঙ্কিত দুটি স্পর্শক সমান (PA = PB, উপপাদ্য ২৬)।
৬. স্পর্শক স্পর্শবিন্দুগামী ব্যাসার্ধের ওপর লম্ব (উপপাদ্য ২৫)।
৭. ত্রিভুজের পরিবৃত্তের কেন্দ্র হলো বাহুর লম্বসমদ্বিখণ্ডকের ছেদবিন্দু।
৮. অন্তর্বৃত্তের কেন্দ্র হলো কোণের সমদ্বিখণ্ডকের ছেদবিন্দু।`;
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
{`১. উপপাদ্য ১৭: কেন্দ্র ও জ্যা মধ্যবিন্দুর সংযোগ রেখাংশ লম্ব (OD ⊥ AB)
২. উপপাদ্য ১৮ ও ১৯: সমান জ্যা কেন্দ্র থেকে সমদূরবর্তী (AB = CD ⇔ OE = OF)
৩. উপপাদ্য ২০: কেন্দ্রস্থ কোণ = ২ × বৃত্তস্থ কোণ (∠BOC = 2∠BAC)
৪. অনুসিদ্ধান্ত: অর্ধবৃত্তস্থ কোণ = ৯০°
৫. উপপাদ্য ২৩: বৃত্তস্থ চতুর্ভুজের বিপরীত কোণ সমষ্টি ১৮০° (∠A + ∠C = 180°)
৬. উপপাদ্য ২৫: স্পর্শক স্পর্শবিন্দুগামী ব্যাসার্ধের ওপর লম্ব (OA ⊥ PA)
৭. উপপাদ্য ২৬: বহিঃস্থ বিন্দু থেকে স্পর্শকদ্বয় সমান (PA = PB)
৮. উপপাদ্য ২৭: বহিঃস্পর্শে দূরত্ব d = R + r, অন্তঃস্পর্শে d = R - r`}
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
                  <h3 className="text-xs font-bold text-foreground">শেরু AI জ্যামিতি গাইড</h3>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>সক্রিয় • উপপাদ্য ও CQ বিশেষজ্ঞ</span>
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
                onClick={() => setInputMessage('উপপাদ্য ২০ এর প্রমাণ কিভাবে লিখব?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                উপপাদ্য ২০ প্রমাণ?
              </button>
              <button
                onClick={() => setInputMessage('বৃত্তস্থ চতুর্ভুজে প্রবৃদ্ধ কোণ কেন লাগে?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                প্রবৃদ্ধ কোণ কেন?
              </button>
              <button
                onClick={() => setInputMessage('স্পর্শক PA = PB কিভাবে প্রমাণ করব?')}
                className="px-2.5 py-1 rounded-full bg-muted border border-border/80 hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
              >
                স্পর্শক PA=PB?
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-border flex items-center gap-2 bg-card">
              <input
                type="text"
                placeholder="বৃত্ত সম্পর্কিত যে কোনো প্রশ্ন লিখুন..."
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
