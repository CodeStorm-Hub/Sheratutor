'use client';

import React, { useState } from 'react';
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
  Droplet,
  Gauge,
  Sliders,
  Scale,
  Compass,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';

interface LessonContent {
  id: number;
  title: string;
  subtitle: string;
  nctbPage: string;
  badge: string;
  intro: string;
}

const LESSONS: LessonContent[] = [
  {
    id: 1,
    title: 'চাপ ও ঘনত্ব',
    subtitle: 'Pressure, Area & Material Density',
    nctbPage: '১২৯-১৩৩',
    badge: 'বোর্ড বেসিক',
    intro: 'একক ক্ষেত্রফলে প্রযুক্ত লম্ব বলকে চাপ বলে ($P = F/A$) এবং একক আয়তনের ভরকে ঘনত্ব বলে ($\\rho = m/V$)। ক্ষেত্রফল যত কম, চাপ তত বেশি!',
  },
  {
    id: 2,
    title: 'তরলের অভ্যন্তরে চাপ',
    subtitle: 'Pressure in Liquids ($P = h\\rho g$)',
    nctbPage: '১৩৪-১৩৬',
    badge: 'বোর্ড নিশ্চিত সৃজনশীল',
    intro: 'স্থির তরলের অভ্যন্তরে যেকোনো বিন্দুতে চাপ কেবল গভীরতা ($h$), তরলের ঘনত্ব ($\\rho$) এবং অভিকর্ষীয় ত্বরণের ($g$) ওপর নির্ভর করে; পাত্রের আকার বা তরলের পরিমাণের ওপর নির্ভর করে না!',
  },
  {
    id: 3,
    title: 'আর্কিমিডিসের নীতি ও প্লবতা',
    subtitle: "Archimedes' Principle & Buoyancy",
    nctbPage: '১৩৭-১৩৯',
    badge: 'গ্যারান্টিড ৩/৪ নম্বর',
    intro: 'তরলে নিমজ্জিত বস্তু যে উর্ধ্বমুখী লব্ধি বল অনুভব করে তাকে প্লবতা ($F_B = V\\rho_{\\text{liq}}g$) বলে। অপসারিত তরলের ওজন বস্তুর আপাত ওজন হ্রাসের সমান।',
  },
  {
    id: 4,
    title: 'প্যাসকেলের সূত্র ও হাইড্রোলিক প্রেস',
    subtitle: "Pascal's Law & Hydraulic Force Multiplier",
    nctbPage: '১৪০-১৪১',
    badge: 'বল বৃদ্ধিকরণ নীতি',
    intro: 'আবদ্ধ পাত্রে তরলের যেকোনো অংশে প্রযুক্ত চাপ সমানভাবে সবদিকে সঞ্চালিত হয়। পিস্টনের ক্ষেত্রফল বাড়িয়ে বহুগুণ বেশি বল ($F_2 = F_1 \\times A_2/A_1$) পাওয়া যায়, কিন্তু কৃতকাজ বা শক্তি সর্বদা সংরক্ষিত থাকে!',
  },
  {
    id: 5,
    title: 'বায়ুর চাপ, ব্যারোমিটার ও স্থিতিস্থাপকতা',
    subtitle: "Torricelli Barometer & Hooke's Elasticity",
    nctbPage: '১৪২-১৪৯',
    badge: 'বাস্তব প্রয়োগ ও ইয়ং গুণাঙ্ক',
    intro: 'বায়ুমণ্ডলের চাপ ব্যারোমিটারে ৭৬ সেমি পারদস্তম্ভের সমান ($10^5\\text{ Pa}$)। স্থিতিস্থাপক সীমার মাঝে পীড়ন ও বিকৃতির অনুপাত একটি ধ্রুবক, যাকে ইয়ং-এর গুণাঙ্ক ($Y$) বলে।',
  },
];

export function PhysicsMatterPressureGuidebook() {
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [tutorHistory, setTutorHistory] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([]);
  const [copiedCheatSheet, setCopiedCheatSheet] = useState<boolean>(false);

  // LAB 1: Pressure & Density
  const [lab1Force, setLab1Force] = useState<number>(500); // N (e.g. 50 kg person)
  const [lab1Area, setLab1Area] = useState<number>(0.02); // m^2
  const [lab1Preset, setLab1Preset] = useState<'shoe' | 'heel' | 'elephant' | 'pin'>('shoe');
  const [lab1Mass, setLab1Mass] = useState<number>(2); // kg
  const [lab1Volume, setLab1Volume] = useState<number>(0.002); // m^3 (2 Liters)

  // LAB 2: Liquid Pressure
  const [lab2Depth, setLab2Depth] = useState<number>(3); // meters
  const [lab2Density, setLab2Density] = useState<number>(1000); // kg/m^3 (Water)
  const [lab2LiquidName, setLab2LiquidName] = useState<string>('বিশুদ্ধ পানি');

  // LAB 3: Buoyancy & Archimedes
  const [lab3ObjDensity, setLab3ObjDensity] = useState<number>(800); // kg/m^3
  const [lab3ObjVolume, setLab3ObjVolume] = useState<number>(500); // cm^3
  const [lab3LiquidDensity, setLab3LiquidDensity] = useState<number>(1000); // kg/m^3 (Water)
  const [isSubmerging, setIsSubmerging] = useState<boolean>(false);

  // LAB 4: Pascal's Hydraulic Press
  const [lab4Radius1, setLab4Radius1] = useState<number>(2); // cm
  const [lab4Radius2, setLab4Radius2] = useState<number>(10); // cm
  const [lab4Force1, setLab4Force1] = useState<number>(50); // N
  const [isPumping, setIsPumping] = useState<boolean>(false);

  // LAB 5: Young's Modulus & Elasticity
  const [lab5Material, setLab5Material] = useState<'steel' | 'copper' | 'glass' | 'bone'>('steel');
  const [lab5Length, setLab5Length] = useState<number>(2); // meters
  const [lab5DiameterMm, setLab5DiameterMm] = useState<number>(2); // mm
  const [lab5HangingMassKg, setLab5HangingMassKg] = useState<number>(20); // kg

  // Step 2 Example Selector & Rubric State
  const [activeExampleIndex, setActiveExampleIndex] = useState<number>(0);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // Step 3 Practice Inputs & Feedback
  const [practiceInput1, setPracticeInput1] = useState<string>('');
  const [practiceFeedback1, setPracticeFeedback1] = useState<{ status: 'idle' | 'correct' | 'wrong'; msg: string }>({ status: 'idle', msg: '' });

  const [practiceInput2, setPracticeInput2] = useState<string>('');
  const [practiceFeedback2, setPracticeFeedback2] = useState<{ status: 'idle' | 'correct' | 'wrong'; msg: string }>({ status: 'idle', msg: '' });

  const [practiceInput3, setPracticeInput3] = useState<string>('');
  const [practiceFeedback3, setPracticeFeedback3] = useState<{ status: 'idle' | 'correct' | 'wrong'; msg: string }>({ status: 'idle', msg: '' });

  // Step 4 MCQ State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];

  // Helper for Lab 1 Presets
  const applyLab1Preset = (preset: 'shoe' | 'heel' | 'elephant' | 'pin') => {
    setLab1Preset(preset);
    if (preset === 'shoe') {
      setLab1Force(600); // 60 kg person on flat shoes
      setLab1Area(0.03); // 300 cm^2
    } else if (preset === 'heel') {
      setLab1Force(600); // 60 kg on high heel
      setLab1Area(0.0002); // 2 cm^2
    } else if (preset === 'elephant') {
      setLab1Force(30000); // 3000 kg elephant on 4 feet
      setLab1Area(0.3); // 3000 cm^2
    } else if (preset === 'pin') {
      setLab1Force(20); // thumb pressing pin
      setLab1Area(0.000001); // 0.1 mm^2
    }
  };

  // Helper for Lab 2 Liquids
  const setLiquidType = (name: string, rho: number) => {
    setLab2LiquidName(name);
    setLab2Density(rho);
  };

  // Lab calculations
  const lab1Pressure = lab1Area > 0 ? lab1Force / lab1Area : 0;
  const lab1CalcDensity = lab1Volume > 0 ? lab1Mass / lab1Volume : 0;

  const lab2Pressure = lab2Depth * lab2Density * 9.8;

  // Lab 3 Buoyancy
  const lab3VolM3 = lab3ObjVolume * 1e-6; // cm^3 to m^3
  const lab3ObjMassKg = lab3VolM3 * lab3ObjDensity;
  const lab3ObjWeightN = lab3ObjMassKg * 9.8;
  const lab3BuoyancyMaxN = lab3VolM3 * lab3LiquidDensity * 9.8;
  const lab3FractionSubmerged = Math.min(1, Math.max(0, lab3ObjDensity / lab3LiquidDensity));
  const lab3ActualBuoyancyN = lab3ObjDensity < lab3LiquidDensity ? lab3ObjWeightN : lab3BuoyancyMaxN;
  const lab3ApparentWeightN = Math.max(0, lab3ObjWeightN - lab3ActualBuoyancyN);

  // Lab 4 Hydraulic Press
  const lab4Area1 = Math.PI * Math.pow(lab4Radius1 / 100, 2);
  const lab4Area2 = Math.PI * Math.pow(lab4Radius2 / 100, 2);
  const lab4ForceMultiplier = lab4Area1 > 0 ? lab4Area2 / lab4Area1 : 1;
  const lab4Force2 = lab4Force1 * lab4ForceMultiplier;
  const lab4Displacement1 = 10; // cm
  const lab4Displacement2 = lab4ForceMultiplier > 0 ? lab4Displacement1 / lab4ForceMultiplier : 0;

  // Lab 5 Young's Modulus
  const YOUNG_MODULUS_MAP = {
    steel: { name: 'ইস্পাত (Steel)', Y: 200e9 },
    copper: { name: 'তামা (Copper)', Y: 110e9 },
    glass: { name: 'কাচ (Glass)', Y: 65e9 },
    bone: { name: 'মানুষের হাড় (Bone)', Y: 16e9 },
  };
  const lab5YVal = YOUNG_MODULUS_MAP[lab5Material].Y;
  const lab5RadiusM = (lab5DiameterMm / 2) / 1000;
  const lab5AreaM2 = Math.PI * Math.pow(lab5RadiusM, 2);
  const lab5TensionForce = lab5HangingMassKg * 9.8;
  const lab5DeltaL = lab5AreaM2 > 0 && lab5YVal > 0 ? (lab5TensionForce * lab5Length) / (lab5AreaM2 * lab5YVal) : 0;
  const lab5DeltaLMm = lab5DeltaL * 1000;
  const lab5Stress = lab5AreaM2 > 0 ? lab5TensionForce / lab5AreaM2 : 0;
  const lab5Strain = lab5Length > 0 ? lab5DeltaL / lab5Length : 0;

  // Tutor submit handler
  const handleTutorSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tutorQuery.trim()) return;

    const q = tutorQuery.trim();
    setTutorHistory((prev) => [...prev, { sender: 'user', text: q }]);
    setTutorQuery('');

    setTimeout(() => {
      let reply = '';
      if (q.includes('আর্কিমিডিস') || q.includes('প্লবতা') || q.includes('ভাসে')) {
        reply = 'চমৎকার প্রশ্ন! আর্কিমিডিসের নীতি অনুসারে, কোনো বস্তুকে স্থির তরলে আংশিক বা সম্পূর্ণ নিমজ্জিত করলে বস্তুটির ওপর যে উর্ধ্বমুখী বল (প্লবতা $F_B = V\\rho_{\\text{liq}}g$) অনুভূত হয়, তা বস্তুর অপসারিত তরলের ওজনের সমান। যদি বস্তুর ঘনত্ব তরলের ঘনত্বের চেয়ে কম হয় ($\\rho_{\\text{obj}} < \\rho_{\\text{liq}}$), তবে বস্তু ভাসবে!';
      } else if (q.includes('প্যাসকেল') || q.includes('হাইড্রোলিক') || q.includes('বল বৃদ্ধি')) {
        reply = 'প্যাসকেলের সূত্র অনুযায়ী, আবদ্ধ তরলে বাহ্যিক চাপ সমানভাবে চারদিকে সঞ্চালিত হয়। পিস্টনের ক্ষেত্রফল যত গুণ বড় হবে, প্রযুক্ত বলও ঠিক তত গুণ বৃদ্ধি পাবে ($F_2 = F_1 \\times A_2/A_1$)। তবে মনে রাখবে—শক্তি সৃষ্টি হয় না, কারণ ছোট পিস্টন যত দূরত্ব নামে, বড় পিস্টন ক্ষেত্রফলের অনুপাতে ঠিক তত কম দূরত্ব ওঠে!';
      } else if (q.includes('হুক') || q.includes('ইয়ং') || q.includes('পীড়ন')) {
        reply = 'রবার্ট হুকের সূত্র: স্থিতিস্থাপক সীমার মধ্যে পীড়ন বিকৃতির সমানুপাতিক ($\\text{Stress} \\propto \\text{Strain}$)। আর দৈর্ঘ্য পীড়ন ও দৈর্ঘ্য বিকৃতির অনুপাতকে বলা হয় ইয়ং-এর গুণাঙ্ক ($Y = \\frac{FL}{A\\Delta L}$)। ইস্পাতের ইয়ং-এর গুণাঙ্ক সবচেয়ে বেশি ($200\\times 10^9\\text{ Pa}$), তাই এটি অত্যন্ত স্থিতিস্থাপক!';
      } else {
        reply = `তুমি পদার্থের অবস্থা ও চাপ সম্পর্কিত একটি অত্যন্ত প্রাসঙ্গিক প্রশ্ন করেছো: "${q}"। এই অধ্যায়ে তিনটি প্রধান স্তম্ভ মনে রাখবে—১. তরলের গভীরতায় চাপ $P = h\\rho g$, ২. প্লবতা $F_B = V\\rho g$, এবং ৩. হাইড্রোলিক প্রেসে $F_2/F_1 = A_2/A_1$। তোমার আর কোনো নির্দিষ্ট অঙ্কে কোনো সমস্যা থাকলে বলো, আমি ধাপে ধাপে সমাধান করে দিচ্ছি!`;
      }
      setTutorHistory((prev) => [...prev, { sender: 'tutor', text: reply }]);
    }, 600);
  };

  const copyCheatSheet = () => {
    const text = `SheraTutor SSC ফিজিক্স অধ্যায় ৫: পদার্থের অবস্থা ও চাপ
১. চাপ: P = F / A (একক: Pa বা N/m^2, মাত্রা: [ML^-1T^-2])
২. ঘনত্ব: rho = m / V (একক: kg/m^3, পানির ঘনত্ব = 1000 kg/m^3)
৩. তরলের অভ্যন্তরে চাপ: P = h * rho * g
৪. প্লবতা (উর্ধ্বমুখী বল): F_B = V * rho_liq * g (অপসারিত তরলের ওজন)
   - ভাসার শর্ত: rho_obj < rho_liq (ভাসমান অংশের অনুপাত = rho_obj / rho_liq)
   - ডুবন্ত অবস্থায় ভাসার শর্ত: rho_obj = rho_liq
   - ডোবার শর্ত: rho_obj > rho_liq
৫. প্যাসকেলের বল বৃদ্ধিকরণ নীতি: F2 / F1 = A2 / A1 = (r2 / r1)^2 = (d2 / d1)^2
   - কাজ সংরক্ষণশীলতা: W = F1 * l1 = F2 * l2
৬. ব্যারোমিটার বায়ুর চাপ: P0 = h * rho * g = 76 cm-Hg = 101,293 Pa ≈ 10^5 Pa
৭. হুকের সূত্র ও ইয়ং-এর গুণাঙ্ক:
   - পীড়ন = F / A, বিকৃতি = deltaL / L
   - Y = (F * L) / (A * deltaL) = (m * g * L) / (pi * r^2 * deltaL)`;
    navigator.clipboard.writeText(text);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="physics"
        subjectNameBn="পদার্থবিজ্ঞান"
        chapterNum={5}
        chapterTitleBn="পদার্থের অবস্থা ও চাপ (States of Matter & Pressure)"
        activeLesson={activeLessonId}
        activeLessonTitle={activeLesson.title}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenAi={() => setIsTutorOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Lesson Navigation Sidebar */}
        {isSidebarOpen && (
          <aside className="w-80 border-r border-border/70 bg-card/40 flex flex-col shrink-0">
            <div className="p-4 border-b border-border/70 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  পাঠতালিকা (5 Lessons)
                </span>
                <p className="text-xs font-bold text-foreground mt-0.5">অধ্যায় ০৫: পদার্থের অবস্থা ও চাপ</p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                title="সাইডবার লুকান"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {LESSONS.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setActiveStep(1);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-primary/10 border-primary/40 shadow-xs'
                        : 'bg-card/30 hover:bg-muted/50 border-border/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        পাঠ ০{lesson.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">পৃষ্ঠা {lesson.nctbPage}</span>
                    </div>
                    <p className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {lesson.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{lesson.subtitle}</p>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Bottom Card */}
            <div className="p-3 border-t border-border/70 bg-muted/20">
              <div className="p-3 rounded-xl bg-card border border-border/60 text-xs space-y-1">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  <span>এসএসসি বোর্ড স্ট্যান্ডার্ড</span>
                </span>
                <p className="text-[11px] text-muted-foreground">
                  হাইড্রোস্ট্যাটিক চাপ ($P=h\rho g$), আর্কিমিডিসের প্লবতা ($F_B$), ও হাইড্রোলিক প্রেসের অঙ্কে পূর্ণ ১০ নম্বর নিশ্চিত করতে প্রতিটি ধাপে অংশ নাও।
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Right Main Learning Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-background/50">
          {/* Top Banner & 5-Step Workflow Tabs */}
          <div className="border-b border-border/70 bg-card/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>পাঠতালিকা</span>
                  </button>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary font-mono">পাঠ ০{activeLesson.id}</span>
                    <span className="text-xs text-muted-foreground">• NCTB পৃষ্ঠা {activeLesson.nctbPage}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {activeLesson.badge}
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-foreground mt-0.5">{activeLesson.title}</h1>
                  <p className="text-xs text-muted-foreground">{activeLesson.subtitle}</p>
                </div>
              </div>
            </div>

            {/* 5-Step Framework Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { step: 1, label: '1 Learn Concept' },
                { step: 2, label: '2 See Example' },
                { step: 3, label: '3 Try Yourself' },
                { step: 4, label: '4 Check Understanding' },
                { step: 5, label: '5 Summary' },
              ].map(({ step, label }) => {
                const isCurrent = activeStep === step;
                return (
                  <button
                    key={step}
                    onClick={() => setActiveStep(step)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                      isCurrent
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border/70'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Container */}
          <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
            {/* STEP 1: LEARN CONCEPT (Interactive Discovery Labs) */}
            {activeStep === 1 && (
              <div className="space-y-6">
                {/* Lesson Description */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/70 text-xs text-muted-foreground">
                  <RenderMathText text={activeLesson.intro} />
                </div>

                {/* LAB 1: Pressure & Material Density */}
                {activeLessonId === 1 && (
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-primary" />
                          <span>১. চাপ ও উপাদান ঘনত্ব ল্যাব (Pressure & Density Simulator)</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          বল ($F$) ও ক্ষেত্রফল ($A$) পরিবর্তন করে চাপ ($P = F/A$) এবং ভর ও আয়তন দিয়ে ঘনত্ব ($\rho = m/V$) পর্যবেক্ষণ করো
                        </p>
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'shoe', label: 'চ্যাপ্টা জুতো (৬০ কেজি)' },
                        { id: 'heel', label: 'হাই-হিল জুতো (৬০ কেজি)' },
                        { id: 'elephant', label: 'হাতির পা (৩০০০ কেজি)' },
                        { id: 'pin', label: 'সুচ / পিন (২ কেজি বল)' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => applyLab1Preset(item.id as any)}
                          className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                            lab1Preset === item.id
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Visual Pressure Gauge & Calculations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Pressure Card */}
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-4 text-xs">
                        <span className="font-bold text-primary flex items-center justify-between">
                          <span>চাপের হিসাব ($P = F / A$)</span>
                          <span className="font-mono text-xs">{lab1Pressure.toLocaleString('en-US', { maximumFractionDigits: 1 })} Pa</span>
                        </span>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>প্রযুক্ত বল ($F$):</span>
                              <span className="font-mono font-bold text-foreground">{lab1Force} N</span>
                            </div>
                            <input
                              type="range"
                              min={10}
                              max={30000}
                              step={10}
                              value={lab1Force}
                              onChange={(e) => {
                                setLab1Force(Number(e.target.value));
                                setLab1Preset('shoe');
                              }}
                              className="w-full accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>স্পর্শ ক্ষেত্রফল ($A$):</span>
                              <RenderMathText text={`$${lab1Area.toFixed(4)}\\text{ m}^2 = ${(lab1Area * 10000).toFixed(1)}\\text{ cm}^2$`} />
                            </div>
                            <input
                              type="range"
                              min={0.0001}
                              max={0.5}
                              step={0.0001}
                              value={lab1Area}
                              onChange={(e) => {
                                setLab1Area(Number(e.target.value));
                                setLab1Preset('shoe');
                              }}
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                          <p className="font-bold text-foreground flex items-center justify-between">
                            <span>অনুভূত চাপ:</span>
                            <span className="font-mono text-primary font-bold">
                              {lab1Pressure >= 1000000
                                ? `${(lab1Pressure / 1000000).toFixed(2)} MPa`
                                : lab1Pressure >= 1000
                                ? `${(lab1Pressure / 1000).toFixed(2)} kPa`
                                : `${lab1Pressure.toFixed(1)} Pa`}
                            </span>
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {lab1Preset === 'heel'
                              ? '⚠️ হাই হিল জুতোর সূঁচালো তলার ক্ষেত্রফল অত্যন্ত কম হওয়ায় হাতির পায়ের চেয়েও বহুগুণ বেশি চাপ তৈরি হয়!'
                              : lab1Preset === 'pin'
                              ? '📌 সামান্য বল প্রয়োগেও সূচের অগ্রভাগে অতি উচ্চ চাপ তৈরি হয়, ফলে তা সহজেই চামড়া ভেদ করে!'
                              : 'তলার ক্ষেত্রফল যত বাড়বে, চাপ তত হ্রাস পাবে। তাই মরুভূমিতে উটের পায়ের তলা চওড়া হয়।'}
                          </p>
                        </div>
                      </div>

                      {/* Right: Density Card */}
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-4 text-xs">
                        <span className="font-bold text-primary flex items-center justify-between">
                          <span>ঘনত্বের হিসাব ($\rho = m / V$)</span>
                          <span className="font-mono text-xs">{lab1CalcDensity.toFixed(1)} kg/m³</span>
                        </span>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>বস্তুর ভর ($m$):</span>
                              <span className="font-mono font-bold text-foreground">{lab1Mass} kg</span>
                            </div>
                            <input
                              type="range"
                              min={0.1}
                              max={50}
                              step={0.1}
                              value={lab1Mass}
                              onChange={(e) => setLab1Mass(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>বস্তুর আয়তন ($V$):</span>
                              <RenderMathText text={`$${lab1Volume.toFixed(4)}\\text{ m}^3 = ${(lab1Volume * 1000).toFixed(1)}\\text{ L}$`} />
                            </div>
                            <input
                              type="range"
                              min={0.0002}
                              max={0.05}
                              step={0.0002}
                              value={lab1Volume}
                              onChange={(e) => setLab1Volume(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                          <p className="font-bold text-foreground flex items-center justify-between">
                            <span>তুলনা (পানির ঘনত্ব ১০০০):</span>
                            <span
                              className={`font-bold ${
                                lab1CalcDensity < 1000
                                  ? 'text-amber-500'
                                  : lab1CalcDensity === 1000
                                  ? 'text-emerald-500'
                                  : 'text-rose-500'
                              }`}
                            >
                              {lab1CalcDensity < 1000
                                ? 'পানিতে ভাসবে (Floats)'
                                : lab1CalcDensity === 1000
                                ? 'সম্পূর্ণ নিমজ্জিত ভাসবে'
                                : 'পানিতে ডুবে যাবে (Sinks)'}
                            </span>
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            <RenderMathText text="পানির ঘনত্ব $1000\text{ kg/m}^3$। বস্তুর ঘনত্ব পানির চেয়ে কম হলে তা ভেসে থাকবে।" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LAB 2: Pressure in Liquids (P = h * rho * g) */}
                {activeLessonId === 2 && (
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-primary" />
                        <span>২. তরলের অভ্যন্তরে চাপ ও গভীরতা ল্যাব (Liquid Pressure: $P = h\rho g$)</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        তরলের ঘনত্ব ($\rho$) ও গভীরতা ($h$) পরিবর্তন করে বিভিন্ন আকারের পাত্রে চাপ যাচাই করো
                      </p>
                    </div>

                    {/* Liquid Type Quick Select */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {[
                        { name: 'কেরোসিন', rho: 800 },
                        { name: 'বিশুদ্ধ পানি', rho: 1000 },
                        { name: 'সমুদ্রের লোনা পানি', rho: 1025 },
                        { name: 'পারদ (Mercury)', rho: 13600 },
                      ].map((liq) => (
                        <button
                          key={liq.name}
                          onClick={() => setLiquidType(liq.name, liq.rho)}
                          className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                            lab2Density === liq.rho
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {liq.name} ($\rho = {liq.rho}$)
                        </button>
                      ))}
                    </div>

                    {/* Interactive Fluid Depth Visualizer */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* SVG Vessel Animation */}
                      <div className="md:col-span-6 bg-muted/10 border border-border rounded-2xl p-4 flex flex-col items-center justify-center min-h-[260px]">
                        <svg className="w-64 h-56" viewBox="0 0 240 200">
                          {/* Tank Outline */}
                          <rect x="30" y="20" width="180" height="160" rx="8" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted-foreground/40" />

                          {/* Liquid level */}
                          <rect
                            x="32"
                            y={180 - (lab2Depth / 10) * 156}
                            width="176"
                            height={(lab2Depth / 10) * 156}
                            rx="4"
                            className={lab2Density > 5000 ? 'fill-slate-400/80' : 'fill-sky-500/50'}
                          />

                          {/* Depth measurement line */}
                          <line x1="220" y1="24" x2="220" y2={180 - (lab2Depth / 10) * 156} stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
                          <line x1="215" y1={180 - (lab2Depth / 10) * 156} x2="225" y2={180 - (lab2Depth / 10) * 156} stroke="#3b82f6" strokeWidth="2" />
                          <text x="210" y="105" textAnchor="end" className="text-[10px] font-mono fill-primary font-bold">
                            h = {lab2Depth.toFixed(1)}m
                          </text>

                          {/* Sensor Node at bottom */}
                          <circle cx="120" cy="170" r="8" fill="#ef4444" />
                          <text x="120" y="155" textAnchor="middle" className="text-[9px] font-bold fill-foreground">
                            চাপ সেন্সর
                          </text>
                        </svg>

                        <div className="w-full flex items-center justify-between text-xs text-muted-foreground mt-2 px-4">
                          <span>তরল: <strong className="text-foreground">{lab2LiquidName}</strong></span>
                          <span>ঘনত্ব: <strong className="text-foreground font-mono">{lab2Density} kg/m³</strong></span>
                        </div>
                      </div>

                      {/* Controls & Metrics */}
                      <div className="md:col-span-6 space-y-4 text-xs">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3">
                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>গভীরতা ($h$):</span>
                              <span className="font-mono font-bold text-foreground">{lab2Depth} মিটার</span>
                            </div>
                            <input
                              type="range"
                              min={0.5}
                              max={10}
                              step={0.5}
                              value={lab2Depth}
                              onChange={(e) => setLab2Depth(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>তরলের ঘনত্ব ($\rho$):</span>
                              <span className="font-mono font-bold text-foreground">{lab2Density} kg/m³</span>
                            </div>
                            <input
                              type="range"
                              min={600}
                              max={14000}
                              step={100}
                              value={lab2Density}
                              onChange={(e) => {
                                setLab2Density(Number(e.target.value));
                                setLab2LiquidName('কাস্টম তরল');
                              }}
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>

                        {/* Calculated Pressure Value */}
                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-2">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                            তলদেশে তরলের চাপ ($P = h \times \rho \times g$):
                          </span>
                          <div className="text-2xl font-black font-mono text-primary">
                            {lab2Pressure.toLocaleString('en-US', { maximumFractionDigits: 1 })} Pa
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            <RenderMathText text="বায়ুমণ্ডলীয় চাপ ($P_0 \approx 100,000\text{ Pa}$) বাদ দিয়ে কেবল তরলস্তম্ভের চাপ। মোট চাপ $= P_0 + h\rho g$।" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LAB 3: Archimedes' Principle & Buoyancy */}
                {activeLessonId === 3 && (
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Scale className="h-4 w-4 text-primary" />
                          <span>৩. আর্কিমিডিসের নীতি ও প্লবতা ল্যাব (Archimedes & Buoyancy Lab)</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          বস্তু তরলে নিমজ্জিত করলে অপসারিত তরলের ওজন এবং প্লবতা ($F_B = V\rho g$) পর্যবেক্ষণ করো
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSubmerging(!isSubmerging)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          isSubmerging
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {isSubmerging ? 'উপরে তুলুন' : 'পানিতে নিমজ্জিত করুন'}
                      </button>
                    </div>

                    {/* Simulation Visual Area */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-6 bg-muted/10 border border-border rounded-2xl p-4 flex flex-col items-center justify-center min-h-[260px]">
                        <svg className="w-64 h-56" viewBox="0 0 240 200">
                          {/* Beaker with water */}
                          <rect x="40" y="40" width="160" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted-foreground/50" />
                          <rect x="42" y="80" width="156" height="98" fill="#38bdf8" fillOpacity="0.4" />

                          {/* Object block */}
                          {isSubmerging ? (
                            <g
                              transform={`translate(95, ${
                                lab3ObjDensity < lab3LiquidDensity
                                  ? 80 - 40 * (1 - lab3FractionSubmerged)
                                  : 130
                              })`}
                            >
                              <rect x="0" y="0" width="50" height="40" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                              <text x="25" y="24" textAnchor="middle" className="text-[9px] font-bold fill-white">
                                {lab3ObjDensity < lab3LiquidDensity
                                  ? `${Math.round(lab3FractionSubmerged * 100)}% নিমজ্জিত`
                                  : 'ডুবে গেছে'}
                              </text>
                              {/* Buoyancy Upward Arrow */}
                              <line x1="25" y1="0" x2="25" y2="-18" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
                              {/* Weight Downward Arrow */}
                              <line x1="25" y1="40" x2="25" y2="58" stroke="#ef4444" strokeWidth="3" />
                            </g>
                          ) : (
                            <g transform="translate(95, 20)">
                              <rect x="0" y="0" width="50" height="40" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                              <text x="25" y="24" textAnchor="middle" className="text-[9px] font-bold fill-white">
                                বাতাসে ব্লক
                              </text>
                            </g>
                          )}

                          <text x="120" y="192" textAnchor="middle" className="text-[10px] font-mono fill-muted-foreground">
                            {isSubmerging
                              ? lab3ObjDensity < lab3LiquidDensity
                                ? 'অবস্থা: ভেসে আছে (Floating)'
                                : 'অবস্থা: তলদেশে ডুবে গেছে (Sunk)'
                              : 'পানিতে নিমজ্জিত করার অপেক্ষা'}
                          </text>
                        </svg>
                      </div>

                      {/* Calculations Panel */}
                      <div className="md:col-span-6 space-y-3 text-xs">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3">
                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <RenderMathText text="ব্লকের ঘনত্ব ($\rho_{\text{obj}}$):" />
                              <span className="font-mono font-bold text-foreground">{lab3ObjDensity} kg/m³</span>
                            </div>
                            <input
                              type="range"
                              min={200}
                              max={2500}
                              step={50}
                              value={lab3ObjDensity}
                              onChange={(e) => setLab3ObjDensity(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>ব্লকের আয়তন ($V$):</span>
                              <span className="font-mono font-bold text-foreground">{lab3ObjVolume} cm³</span>
                            </div>
                            <input
                              type="range"
                              min={100}
                              max={2000}
                              step={50}
                              value={lab3ObjVolume}
                              onChange={(e) => setLab3ObjVolume(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>

                        {/* Force Readouts */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-card border border-border/80">
                            <span className="text-[10px] text-muted-foreground">বাতাসে ওজন ($W = mg$):</span>
                            <p className="font-mono font-bold text-sm text-foreground mt-0.5">
                              {lab3ObjWeightN.toFixed(2)} N
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-card border border-border/80">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              <RenderMathText text="প্লবতা ($F_B = V_{\text{sub}}\rho g$):" />
                            </span>
                            <p className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                              {isSubmerging ? `${lab3ActualBuoyancyN.toFixed(2)} N` : '0.00 N'}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/30 border border-border/70 flex items-center justify-between">
                          <span className="text-muted-foreground">পানিতে আপাত ওজন ($W - F_B$):</span>
                          <span className="font-mono font-bold text-primary">
                            {isSubmerging ? `${lab3ApparentWeightN.toFixed(2)} N` : `${lab3ObjWeightN.toFixed(2)} N`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LAB 4: Pascal's Hydraulic Press */}
                {activeLessonId === 4 && (
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                          <Sliders className="h-4 w-4 text-primary" />
                          <span>৪. প্যাসকেলের হাইড্রোলিক প্রেস বল বৃদ্ধিকরণ ল্যাব (Hydraulic Multiplier Lab)</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ছোট পিস্টনে সামান্য বল প্রয়োগ করে বড় পিস্টনে ভারী গাড়ি তোলার বল বৃদ্ধিকরণ নীতি ($F_2 / F_1 = A_2 / A_1$)
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsPumping(true);
                          setTimeout(() => setIsPumping(false), 800);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold transition-all shadow-xs"
                      >
                        পাম্প হ্যান্ডেল চাপুন
                      </button>
                    </div>

                    {/* SVG Hydraulic System */}
                    <div className="bg-muted/10 border border-border rounded-2xl p-4 flex flex-col items-center justify-center">
                      <svg className="w-full max-w-lg h-48" viewBox="0 0 400 160">
                        {/* Connecting pipe */}
                        <path d="M 50 120 L 350 120 L 350 60 L 310 60 L 310 100 L 90 100 L 90 60 L 50 60 Z" fill="#38bdf8" fillOpacity="0.4" stroke="currentColor" strokeWidth="2.5" className="text-muted-foreground/60" />

                        {/* Piston 1 (Small) */}
                        <rect
                          x="52"
                          y={isPumping ? 75 : 62}
                          width="36"
                          height="14"
                          rx="2"
                          fill="#f59e0b"
                          className="transition-all duration-300"
                        />
                        <line x1="70" y1="20" x2="70" y2={isPumping ? 75 : 62} stroke="#f59e0b" strokeWidth="4" />
                        <text x="70" y="15" textAnchor="middle" className="text-[10px] font-bold fill-foreground">
                          F₁ = {lab4Force1}N
                        </text>

                        {/* Piston 2 (Large) */}
                        <rect
                          x="312"
                          y={isPumping ? 45 : 58}
                          width="36"
                          height="14"
                          rx="2"
                          fill="#10b981"
                          className="transition-all duration-300"
                        />
                        <line x1="330" y1="20" x2="330" y2={isPumping ? 45 : 58} stroke="#10b981" strokeWidth="6" />
                        {/* Car Icon on Piston 2 */}
                        <rect x="315" y={isPumping ? 22 : 35} width="30" height="15" rx="3" fill="#6366f1" />
                        <text x="330" y="15" textAnchor="middle" className="text-[10px] font-bold fill-emerald-600 dark:text-emerald-400">
                          F₂ = {Math.round(lab4Force2)}N
                        </text>
                      </svg>

                      <div className="flex items-center gap-6 text-xs text-muted-foreground mt-2">
                        <span>ছোট পিস্টন সরণ ($l_1$): <strong className="text-foreground">{lab4Displacement1} cm</strong></span>
                        <span>বড় পিস্টন সরণ ($l_2$): <strong className="text-foreground font-mono">{lab4Displacement2.toFixed(2)} cm</strong></span>
                      </div>
                    </div>

                    {/* Inputs & Outputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3">
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>ছোট পিস্টন ব্যাসার্ধ ($r_1$):</span>
                            <span className="font-mono font-bold text-foreground">{lab4Radius1} cm</span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={5}
                            step={0.5}
                            value={lab4Radius1}
                            onChange={(e) => setLab4Radius1(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>বড় পিস্টন ব্যাসার্ধ ($r_2$):</span>
                            <span className="font-mono font-bold text-foreground">{lab4Radius2} cm</span>
                          </div>
                          <input
                            type="range"
                            min={5}
                            max={30}
                            step={1}
                            value={lab4Radius2}
                            onChange={(e) => setLab4Radius2(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>প্রযুক্ত ইনপুট বল ($F_1$):</span>
                            <span className="font-mono font-bold text-foreground">{lab4Force1} N</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={200}
                            step={10}
                            value={lab4Force1}
                            onChange={(e) => setLab4Force1(Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                        </div>
                      </div>

                      {/* Force & Work Comparison */}
                      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                            বল বৃদ্ধির গুণক ($A_2 / A_1 = (r_2/r_1)^2$):
                          </span>
                          <div className="text-xl font-black font-mono text-primary">
                            {lab4ForceMultiplier.toFixed(1)} গুণ বল বৃদ্ধি!
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            ছোট পিস্টনে মাত্র {lab4Force1} N বল দিয়ে বড় পিস্টনে {Math.round(lab4Force2)} N (প্রায় {(lab4Force2 / 9.8).toFixed(1)} কেজি) ভর তোলা যাবে!
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-card border border-border/70 space-y-1">
                          <div className="flex items-center justify-between font-bold text-foreground text-xs">
                            <span>শক্তির সংরক্ষণশীলতা ($W_1 = W_2$):</span>
                            <span className="text-emerald-600 dark:text-emerald-400">প্রমাণিত ✓</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            W₁ = F₁ × l₁ = {lab4Force1} × 0.1 = {(lab4Force1 * 0.1).toFixed(2)} J
                            <br />
                            W₂ = F₂ × l₂ = {Math.round(lab4Force2)} × {(lab4Displacement2 / 100).toFixed(4)} = {(lab4Force1 * 0.1).toFixed(2)} J
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LAB 5: Hooke's Law & Young's Modulus */}
                {activeLessonId === 5 && (
                  <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        <span>৫. স্থিতিস্থাপকতা ও ইয়ং-এর গুণাঙ্ক ল্যাব (Hooke's Law & Young's Modulus)</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <RenderMathText text="তারের উপাদান, দৈর্ঘ্য ($L$) ও ব্যাস পরিবর্তন করে দৈর্ঘ্য প্রসারণ ($\Delta L = \frac{FL}{AY}$) এবং পীড়ন-বিকৃতি পর্যবেক্ষণ করো" />
                      </p>
                    </div>

                    {/* Material Selector */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(Object.keys(YOUNG_MODULUS_MAP) as Array<keyof typeof YOUNG_MODULUS_MAP>).map((mat) => (
                        <button
                          key={mat}
                          onClick={() => setLab5Material(mat)}
                          className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                            lab5Material === mat
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {YOUNG_MODULUS_MAP[mat].name}
                        </button>
                      ))}
                    </div>

                    {/* Wire Stretch Visualizer */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-5 bg-muted/10 border border-border rounded-2xl p-4 flex flex-col items-center justify-center min-h-[260px]">
                        <svg className="w-48 h-56" viewBox="0 0 160 200">
                          {/* Rigid ceiling */}
                          <line x1="20" y1="20" x2="140" y2="20" stroke="currentColor" strokeWidth="4" className="text-foreground" />

                          {/* Wire line */}
                          <line
                            x1="80"
                            y1="20"
                            x2="80"
                            y2={130 + Math.min(30, lab5DeltaLMm * 8)}
                            stroke="#3b82f6"
                            strokeWidth={Math.max(2, lab5DiameterMm)}
                          />

                          {/* Hanging weight */}
                          <rect
                            x="60"
                            y={130 + Math.min(30, lab5DeltaLMm * 8)}
                            width="40"
                            height="35"
                            rx="4"
                            fill="#f97316"
                          />
                          <text
                            x="80"
                            y={152 + Math.min(30, lab5DeltaLMm * 8)}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-white"
                          >
                            {lab5HangingMassKg} kg
                          </text>

                          {/* Expansion indicator */}
                          <text x="80" y="190" textAnchor="middle" className="text-[10px] font-mono fill-primary font-bold">
                            ΔL = {lab5DeltaLMm.toFixed(3)} mm
                          </text>
                        </svg>
                      </div>

                      {/* Controls */}
                      <div className="md:col-span-7 space-y-3 text-xs">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3">
                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>তারের আদি দৈর্ঘ্য ($L$):</span>
                              <span className="font-mono font-bold text-foreground">{lab5Length} মিটার</span>
                            </div>
                            <input
                              type="range"
                              min={0.5}
                              max={5}
                              step={0.5}
                              value={lab5Length}
                              onChange={(e) => setLab5Length(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>তারের ব্যাস ($d$):</span>
                              <span className="font-mono font-bold text-foreground">{lab5DiameterMm} মিমি</span>
                            </div>
                            <input
                              type="range"
                              min={0.5}
                              max={5}
                              step={0.5}
                              value={lab5DiameterMm}
                              onChange={(e) => setLab5DiameterMm(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-muted-foreground mb-1">
                              <span>ঝুলানো ভর ($M$):</span>
                              <span className="font-mono font-bold text-foreground">{lab5HangingMassKg} কেজি</span>
                            </div>
                            <input
                              type="range"
                              min={5}
                              max={100}
                              step={5}
                              value={lab5HangingMassKg}
                              onChange={(e) => setLab5HangingMassKg(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                          </div>
                        </div>

                        {/* Calculated Young's Modulus Outputs */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-card border border-border/80">
                            <span className="text-[10px] text-muted-foreground">
                              <RenderMathText text="পীড়ন ($\text{Stress} = F/A$):" />
                            </span>
                            <p className="font-mono font-bold text-xs text-foreground mt-0.5">
                              {(lab5Stress / 1e6).toFixed(2)} MPa
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-card border border-border/80">
                            <span className="text-[10px] text-muted-foreground">
                              <RenderMathText text="বিকৃতি ($\text{Strain} = \Delta L / L$):" />
                            </span>
                            <p className="font-mono font-bold text-xs text-primary mt-0.5">
                              {lab5Strain.toExponential(2)}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-muted-foreground">
                          <RenderMathText text={`ইয়াং-এর গুণাঙ্ক $Y = ${(lab5YVal / 1e9).toFixed(0)}\\times 10^9\\text{ Pa}$। ইস্পাতের গুণাঙ্ক অত্যন্ত বেশি হওয়ায় সমপরিমাণ ভরে এর প্রসারণ নগণ্য।`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Navigation Next Step */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <div className="text-xs text-muted-foreground">
                    ধাপ ১ সম্পন্ন করেছো? এবার বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন ও সমাধান দেখো।
                  </div>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>পরবর্তী: উদাহরণ দেখি (Step 2)</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SEE EXAMPLE (Worked CQs with Examiner Rubric Drawer) */}
            {activeStep === 2 && (
              <div className="space-y-6">
                {/* Example Selector Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 0, title: 'টেক্সটবুক CQ ১: কাঠের ব্লকের প্লবতা' },
                    { id: 1, title: 'টেক্সটবুক CQ ২: রাবার ব্যান্ড ও হুকের সূত্র' },
                    { id: 2, title: 'ঢাকা বোর্ড: হাইড্রোলিক প্রেস ও গাড়ি উত্তোলন' },
                    { id: 3, title: 'রাজশাহী বোর্ড: আর্কিমিডিসের সূত্রে সোনার মুকুট' },
                  ].map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setActiveExampleIndex(ex.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        activeExampleIndex === ex.id
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-card hover:bg-muted text-muted-foreground border-border/70'
                      }`}
                    >
                      {ex.title}
                    </button>
                  ))}
                </div>

                {/* Worked CQ Card */}
                <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
                  {activeExampleIndex === 0 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          উদ্দীপক (পাঠ্যবই নমুনা সৃজনশীল ১ - পৃষ্ঠা ১৫৮)
                        </span>
                        <p className="text-xs text-foreground leading-relaxed">
                          <RenderMathText text="একটি পাত্রে পানি রাখা আছে। পানির ঘনত্ব $1000\text{ kg/m}^3$। $0.002\text{ m}^3$ আয়তনের একটি কাঠের ব্লক পানিতে ছেড়ে দিলে দেখা গেল তার $80\%$ অংশ পানির নিচে নিমজ্জিত অবস্থায় ভাসছে।" />
                        </p>
                      </div>

                      {/* Question (c) */}
                      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary font-mono">(গ) কাঠের ব্লকটির ঘনত্ব নির্ণয় করো। [৩ নম্বর]</span>
                          <span className="text-muted-foreground font-mono">মান: ৩</span>
                        </div>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><RenderMathText text="আমরা জানি, ভাসমান বস্তুর ক্ষেত্রে নিমজ্জিত অংশের অনুপাত:" /></p>
                          <p><RenderMathText text="$\frac{V_{\text{sub}}}{V} = \frac{\rho_{\text{obj}}}{\rho_{\text{liquid}}}$" /></p>
                          <p><RenderMathText text="এখানে, $\frac{V_{\text{sub}}}{V} = 80\% = 0.8$ এবং পানির ঘনত্ব $\rho_{\text{liquid}} = 1000\text{ kg/m}^3$" /></p>
                          <p><RenderMathText text="$\implies \rho_{\text{obj}} = 0.8 \times 1000\text{ kg/m}^3 = 800\text{ kg/m}^3$।" /></p>
                          <p className="font-bold text-foreground"><RenderMathText text="উত্তর: কাঠের ব্লকটির ঘনত্ব $800\text{ kg/m}^3$।" /></p>
                        </div>
                      </div>

                      {/* Question (d) */}
                      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary font-mono">
                            (ঘ) তরলের তাপমাত্রা ক্রমাগত বৃদ্ধি করলে ব্লকটির নিমজ্জিত অংশের পরিবর্তন গাণিতিক যুক্তি সহকারে ব্যাখ্যা করো। [৪ নম্বর]
                          </span>
                          <span className="text-muted-foreground font-mono">মান: ৪</span>
                        </div>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><RenderMathText text="১. তাপমাত্রা বৃদ্ধি পেলে পানির আয়তন বৃদ্ধি পায় এবং পানির ঘনত্ব হ্রাস পায় ($\rho_{\text{liquid}} \downarrow$)।" /></p>
                          <p><RenderMathText text="২. ভাসমান শর্তানুসারে নিমজ্জিত অংশের ভগ্নাংশ $\frac{V_{\text{sub}}}{V} = \frac{\rho_{\text{obj}}}{\rho_{\text{liquid}}}$।" /></p>
                          <p><RenderMathText text="৩. যেহেতু কাঠের ব্লকের নিজস্ব ঘনত্ব $\rho_{\text{obj}}$ অপরিবর্তিত থাকে কিন্তু পানির ঘনত্ব $\rho_{\text{liquid}}$ কমে যায়, তাই ভগ্নাংশের মান বৃদ্ধি পাবে।" /></p>
                          <p className="font-bold text-foreground">
                            উত্তর: তরলের তাপমাত্রা বৃদ্ধি পেলে কাঠের ব্লকটি আগের চেয়ে বেশি পরিমাণে পানিতে নিমজ্জিত হবে।
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeExampleIndex === 1 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          উদ্দীপক (পাঠ্যবই নমুনা সৃজনশীল ২ - পৃষ্ঠা ১৫৮)
                        </span>
                        <p className="text-xs text-foreground leading-relaxed">
                          <RenderMathText text="ফাহিম ১০ সেমি দৈর্ঘ্যের একটি রাবার ব্যান্ডের এক মাথায় ভর ঝুলিয়ে দৈর্ঘ্য পর্যবেক্ষণ করল। ভর $0\text{ kg}$ তে দৈর্ঘ্য $10\text{ cm}$, $1\text{ kg}$ তে $15\text{ cm}$, এবং $3\text{ kg}$ তে $25\text{ cm}$। ভর সরিয়ে নিলে ব্যান্ডটি পূর্বের অবস্থায় ফিরে আসে।" />
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                        <span className="font-bold text-primary font-mono">
                          <RenderMathText text="(গ) $M = 2.7\text{ kg}$ ভর ঝোলালে রাবার ব্যান্ডের দৈর্ঘ্য $L_2$ কত হবে? [৩ নম্বর]" />
                        </span>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><RenderMathText text="প্রতি ১ কেজি ভরের জন্য প্রসারণ $\Delta L = \frac{15 - 10}{1} = 5\text{ cm/kg}$।" /></p>
                          <p><RenderMathText text="সুতরাং $2.7\text{ kg}$ ভরের জন্য প্রসারণ $\Delta L = 2.7 \times 5 = 13.5\text{ cm}$।" /></p>
                          <p><RenderMathText text="অতএব মোট দৈর্ঘ্য $L_2 = 10 + 13.5 = 23.5\text{ cm}$।" /></p>
                          <p className="font-bold text-foreground"><RenderMathText text="উত্তর: $L_2 = 23.5\text{ cm}$।" /></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeExampleIndex === 2 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          উদ্দীপক (ঢাকা বোর্ড - হাইড্রোলিক প্রেস)
                        </span>
                        <p className="text-xs text-foreground leading-relaxed">
                          <RenderMathText text="একটি হাইড্রোলিক প্রেসের ছোট পিস্টনের ব্যাসার্ধ $5\text{ cm}$ এবং বড় পিস্টনের ব্যাস $1\text{ m}$। ছোট পিস্টনে $250\text{ N}$ বল প্রয়োগ করা হলো। বড় পিস্টনের ওপর $2000\text{ kg}$ ভরের একটি গাড়ি রাখা আছে।" />
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                        <span className="font-bold text-primary font-mono">(গ) বড় পিস্টনে প্রযুক্ত উর্ধ্বমুখী বল নির্ণয় করো। [৩ নম্বর]</span>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><RenderMathText text="এখানে, $r_1 = 5\text{ cm} = 0.05\text{ m}$, $r_2 = \frac{1}{2}\text{ m} = 0.5\text{ m}$" /></p>
                          <p><RenderMathText text="বল বৃদ্ধির সূত্র: $\frac{F_2}{F_1} = \frac{A_2}{A_1} = \left(\frac{r_2}{r_1}\right)^2 = \left(\frac{0.5}{0.05}\right)^2 = (10)^2 = 100$" /></p>
                          <p><RenderMathText text="$F_2 = F_1 \times 100 = 250 \times 100 = 25,000\text{ N}$।" /></p>
                          <p className="font-bold text-foreground"><RenderMathText text="উত্তর: বড় পিস্টনে প্রাপ্ত বল $25,000\text{ N}$।" /></p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                        <span className="font-bold text-primary font-mono">(ঘ) উক্ত প্রযুক্ত বল দ্বারা গাড়িটিকে উপরে তোলা সম্ভব হবে কি না? [৪ নম্বর]</span>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><RenderMathText text="গাড়ির ওজন $W = mg = 2000 \times 9.8 = 19,600\text{ N}$।" /></p>
                          <p><RenderMathText text="বড় পিস্টনে প্রযুক্ত উর্ধ্বমুখী বল $F_2 = 25,000\text{ N}$।" /></p>
                          <p><RenderMathText text="যেহেতু $F_2 > W$ ($25000\text{ N} > 19600\text{ N}$), তাই গাড়িটিকে সহজেই উপরে তোলা সম্ভব হবে।" /></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeExampleIndex === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          উদ্দীপক (রাজশাহী বোর্ড - আর্কিমিডিসের মুকুট পরীক্ষা)
                        </span>
                        <p className="text-xs text-foreground leading-relaxed">
                          <RenderMathText text="বাতাসে একটি সোনার মুকুটের ওজন $9.65\text{ N}$ এবং পানিতে ওজন $9.05\text{ N}$। খাঁটি সোনার ঘনত্ব $19,300\text{ kg/m}^3$।" />
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                        <span className="font-bold text-primary font-mono">(গ) পানিতে মুকুটের হারানো ওজন থেকে এর আয়তন নির্ণয় করো। [৩ নম্বর]</span>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><RenderMathText text="হারানো ওজন / প্লবতা $F_B = 9.65 - 9.05 = 0.60\text{ N}$।" /></p>
                          <p><RenderMathText text="আমরা জানি, $F_B = V \rho_{\text{water}} g \implies V = \frac{0.60}{1000 \times 9.8} \approx 6.12 \times 10^{-5}\text{ m}^3 = 61.2\text{ cm}^3$।" /></p>
                          <p className="font-bold text-foreground"><RenderMathText text="উত্তর: মুকুটের আয়তন $61.2\text{ cm}^3$।" /></p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                        <span className="font-bold text-primary font-mono">(ঘ) মুকুটটি খাঁটি সোনার তৈরি ছিল কি না গাণিতিক বিশ্লেষণ করো। [৪ নম্বর]</span>
                        <div className="space-y-1.5 text-muted-foreground">
                          <p><RenderMathText text="মুকুটের ভর $m = \frac{W}{g} = \frac{9.65}{9.8} = 0.9847\text{ kg}$।" /></p>
                          <p><RenderMathText text="মুকুটের ঘনত্ব $\rho = \frac{m}{V} = \frac{0.9847}{6.12 \times 10^{-5}} \approx 16,089\text{ kg/m}^3$।" /></p>
                          <p><RenderMathText text="যেহেতু খাঁটি সোনার ঘনত্ব $19,300\text{ kg/m}^3$ কিন্তু মুকুটের ঘনত্ব $16,089\text{ kg/m}^3$, তাই মুকুটটি খাঁটি নয়, এতে খাদ মেশানো ছিল।" /></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Examiner Marking Rubric Drawer */}
                  <div className="border border-border/80 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setIsRubricOpen(!isRubricOpen)}
                      className="w-full p-3.5 bg-muted/30 hover:bg-muted/50 flex items-center justify-between text-xs font-bold transition-colors"
                    >
                      <span className="flex items-center gap-2 text-primary">
                        <Award className="h-4 w-4" />
                        <span>পরীক্ষকের গোপন কথা (Examiner Marking Rubric & Deduction Guide)</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isRubricOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isRubricOpen && (
                      <div className="p-4 bg-card text-xs space-y-2 border-t border-border/60">
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">নম্বর কাটার শীর্ষ ৩টি মারাত্মক ফাঁদ:</strong><br />
                          ১. <strong>পিস্টনের ব্যাস বনাম ব্যাসার্ধের ভুল:</strong> উদ্দীপকে ব্যাস ($d$) দেওয়া থাকলে ব্যাসার্ধ $r = d/2$ নিতে ভুলবেন না। ক্ষেত্রফলের সূত্রে ব্যাসার্ধের বর্গ ($A = \pi r^2$) ব্যবহৃত হয়।<br />
                          ২. <strong>প্লবতার সূত্রে ঘনত্বের ভুল:</strong> <RenderMathText text="প্লবতা $F_B = V\rho g$-তে সর্বদা তরলের ঘনত্ব ($\rho_{\text{liquid}}$) বসাতে হবে, বস্তুর ঘনত্ব নয়!" /><br />
                          ৩. <strong>ঘন সেন্টিমিটার থেকে ঘনমিটারে রূপান্তর:</strong> <RenderMathText text="$1\text{ cm}^3 = 10^{-6}\text{ m}^3$ এবং $1\text{ L} = 10^{-3}\text{ m}^3$। রূপান্তর না করলে সম্পূর্ণ অঙ্ক কাটা যাবে।" />
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                  >
                    ধারণায় ফিরুন (Step 1)
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>নিজে করো (Step 3)</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TRY YOURSELF (3 Interactive Calculation Challenges) */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      ৩. নিজে করো • ইন্টারঅ্যাক্টিভ ল্যাব (Interactive Practice Lab)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ৩টি হ্যান্ডস-অন চ্যালেঞ্জ সমাধান করে বোর্ড পরীক্ষার জন্য নিজেকে প্রস্তুত করো
                    </p>
                  </div>

                  {/* Challenge 1: Liquid Pressure P = h * rho * g */}
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary font-mono">চ্যালেঞ্জ ০১: তরলের গভীরতায় চাপ গণক</span>
                      <span className="text-muted-foreground font-mono">h = 25 m, rho = 1025 kg/m³</span>
                    </div>
                    <p className="text-foreground">
                      <RenderMathText text="একজন ডুবুরি সমুদ্রের লবণাক্ত পানিতে ২৫ মিটার গভীরে গেল। সমুদ্রের পানির ঘনত্ব $1025\text{ kg/m}^3$ এবং $g = 9.8\text{ ms}^{-2}$ হলে তরলের চাপ কত প্যাসকেল?" />
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="প্যাসকেলে মান লিখুন (যেমন: 251125)..."
                        value={practiceInput1}
                        onChange={(e) => setPracticeInput1(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono text-xs w-64"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(practiceInput1.trim());
                          if (Math.abs(val - 251125) < 20) {
                            setPracticeFeedback1({ status: 'correct', msg: 'চমৎকার! সঠিক হয়েছে (P = hρg = 25 × 1025 × 9.8 = 251,125 Pa)।' });
                          } else {
                            setPracticeFeedback1({ status: 'wrong', msg: 'ভুল হয়েছে। সূত্র: P = h × ρ × g প্রয়োগ করো।' });
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
                      >
                        যাচাই করো
                      </button>
                    </div>
                    {practiceFeedback1.status !== 'idle' && (
                      <p className={`font-bold ${practiceFeedback1.status === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {practiceFeedback1.msg}
                      </p>
                    )}
                  </div>

                  {/* Challenge 2: Hydraulic Press Output Force */}
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary font-mono">চ্যালেঞ্জ ০২: হাইড্রোলিক প্রেস বল বৃদ্ধিকরণ</span>
                      <span className="text-muted-foreground font-mono">A1 = 2 cm², A2 = 80 cm², F1 = 50 N</span>
                    </div>
                    <p className="text-foreground">
                      একটি হাইড্রোলিক প্রেসের ছোট পিস্টনের ক্ষেত্রফল ২ বর্গ সেমি এবং বড় পিস্টনের ক্ষেত্রফল ৮০ বর্গ সেমি। ছোট পিস্টনে ৫০ নিউটন বল দিলে বড় পিস্টনে কত নিউটন উর্ধ্বমুখী বল পাওয়া যাবে?
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="বল লিখুন (যেমন: 2000)..."
                        value={practiceInput2}
                        onChange={(e) => setPracticeInput2(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono text-xs w-64"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(practiceInput2.trim());
                          if (Math.abs(val - 2000) < 5) {
                            setPracticeFeedback2({ status: 'correct', msg: 'সঠিক হয়েছে! F2 = F1 × (A2/A1) = 50 × (80/2) = 2000 N।' });
                          } else {
                            setPracticeFeedback2({ status: 'wrong', msg: 'ভুল হয়েছে। সূত্র: F2 = F1 × (A2 / A1) ব্যবহার করো।' });
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
                      >
                        যাচাই করো
                      </button>
                    </div>
                    {practiceFeedback2.status !== 'idle' && (
                      <p className={`font-bold ${practiceFeedback2.status === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {practiceFeedback2.msg}
                      </p>
                    )}
                  </div>

                  {/* Challenge 3: Ice Submerged Percentage */}
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary font-mono">চ্যালেঞ্জ ০৩: বরফের নিমজ্জিত অংশের শতকরা হার</span>
                      <span className="text-muted-foreground font-mono">rho_ice = 920 kg/m³, rho_water = 1000 kg/m³</span>
                    </div>
                    <p className="text-foreground">
                      পানিতে এক খণ্ড বরফ ভাসলে তার কত শতাংশ অংশ পানির নিচে নিমজ্জিত থাকবে? (শুধু সংখ্যা লিখুন, যেমন: 92)
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="শতাংশ লিখুন (যেমন: 92)..."
                        value={practiceInput3}
                        onChange={(e) => setPracticeInput3(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono text-xs w-64"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(practiceInput3.trim());
                          if (Math.abs(val - 92) < 1) {
                            setPracticeFeedback3({ status: 'correct', msg: 'চমৎকার! সঠিক হয়েছে (নিমজ্জিত অংশ = (920 / 1000) × 100% = 92%)।' });
                          } else {
                            setPracticeFeedback3({ status: 'wrong', msg: 'ভুল হয়েছে। সূত্র: (ρ_বরফ / ρ_পানি) × ১০০% প্রয়োগ করো।' });
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
                      >
                        যাচাই করো
                      </button>
                    </div>
                    {practiceFeedback3.status !== 'idle' && (
                      <p className={`font-bold ${practiceFeedback3.status === 'correct' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {practiceFeedback3.msg}
                      </p>
                    )}
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                  >
                    উদাহরণে ফিরুন (Step 2)
                  </button>
                  <button
                    onClick={() => setActiveStep(4)}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>মূল্যায়ন করো (Step 4)</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CHECK UNDERSTANDING (5 Board MCQs) */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      ৪. মূল্যায়ন • বোর্ড স্ট্যান্ডার্ড বহুনির্বাচনি (Check Understanding)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      বোর্ড পরীক্ষায় আসা ৫টি প্রশ্ন উত্তর করে নিজের বোঝাপড়া যাচাই করো
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        q: 'বায়ুমণ্ডলের চাপ পরিমাপের যন্ত্রের নাম কী? (NCTB পৃষ্ঠা ১৫৭)',
                        opts: ['থার্মোমিটার', 'ব্যারোমিটার', 'ম্যানোমিটার', 'সিসমোমিটার'],
                        ans: 1,
                        exp: 'টরিসেলির পরীক্ষার ওপর ভিত্তি করে ব্যারোমিটারের সাহায্যে বায়ুমণ্ডলীয় চাপ পরিমাপ করা হয়।',
                      },
                      {
                        id: 2,
                        q: 'তরলের অভ্যন্তরে কোনো বিন্দুতে চাপ নিচের কোনটির ওপর নির্ভর করে না?',
                        opts: ['গভীরতার ওপর', 'তরলের ঘনত্বের ওপর', 'পাত্রের তলার ক্ষেত্রফলের ওপর', 'অভিকর্ষীয় ত্বরণের ওপর'],
                        ans: 2,
                        exp: 'তরলের চাপ P = hρg। এটি কেবল গভীরতা, ঘনত্ব ও অভিকর্ষীয় ত্বরণের ওপর নির্ভর করে; পাত্রের আকার বা ক্ষেত্রফলের ওপর নির্ভর করে না।',
                      },
                      {
                        id: 3,
                        q: 'একটি বস্তুর ওজন W এবং অপসারিত তরলের ওজন (প্লবতা) FB। বস্তুটি সম্পূর্ণ নিমজ্জিত অবস্থায় ভাসবে যদি:',
                        opts: ['W > FB', 'W = FB', 'W < FB', 'W = 0'],
                        ans: 1,
                        exp: 'যখন বস্তুর ওজন ও প্লবতা সমান হয় (W = FB) বা বস্তুর ঘনত্ব তরলের ঘনত্বের সমান হয়, তখন বস্তু সম্পূর্ণ নিমজ্জিত অবস্থায় ভাসে।',
                      },
                      {
                        id: 4,
                        q: 'একটি হাইড্রোলিক প্রেসে ছোট ও বড় পিস্টনের ব্যাসার্ধের অনুপাত ১:৪ হলে বড় পিস্টনে বল কত গুণ বৃদ্ধি পাবে?',
                        opts: ['৪ গুণ', '৮ গুণ', '১৬ গুণ', '২ গুণ'],
                        ans: 2,
                        exp: 'বল বৃদ্ধির অনুপাত F2 / F1 = (r2 / r1)^2 = (4 / 1)^2 = 16 গুণ।',
                      },
                      {
                        id: 5,
                        q: 'ইয়াং-এর গুণাঙ্কের এসআই (SI) একক কোনটি?',
                        opts: ['N/m', 'N/m²', 'Joule', 'এককহীন'],
                        ans: 1,
                        exp: 'Y = পীড়ন / বিকৃতি। বিকৃতি এককহীন হওয়ায় ইয়াং-এর গুণাঙ্কের একক পীড়নের একক অর্থাৎ N/m² বা প্যাসকেল (Pa)।',
                      },
                    ].map((mcq) => {
                      const selected = userAnswers[mcq.id];
                      const isAnswered = selected !== undefined;
                      const isCorrect = selected === mcq.ans;
                      const isRevealed = revealedExplanations[mcq.id];

                      return (
                        <div key={mcq.id} className="p-4 rounded-2xl bg-muted/20 border border-border space-y-3 text-xs">
                          <p className="font-bold text-foreground">
                            {mcq.id}. {mcq.q}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mcq.opts.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setUserAnswers((prev) => ({ ...prev, [mcq.id]: optIdx }));
                                  setRevealedExplanations((prev) => ({ ...prev, [mcq.id]: true }));
                                }}
                                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                                  selected === optIdx
                                    ? isCorrect
                                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                                      : 'bg-rose-500/10 border-rose-500 text-rose-600'
                                    : 'bg-card border-border hover:bg-muted text-muted-foreground'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          {isRevealed && (
                            <div className="p-3 rounded-xl bg-card border border-border text-[11px] text-muted-foreground">
                              <span className="font-bold text-primary">ব্যাখ্যা: </span>
                              {mcq.exp}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                  >
                    অনুশীলনে ফিরুন (Step 3)
                  </button>
                  <button
                    onClick={() => setActiveStep(5)}
                    className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>সারসংক্ষেপ (Step 5)</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SUMMARY (Formula Sheet & Top Board Pitfalls) */}
            {activeStep === 5 && (
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        ৫. সারসংক্ষেপ • পদার্থবিজ্ঞান অধ্যায় ৫ রিভিশন চিট-শিট
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        বোর্ড পরীক্ষার আগের রাতের জন্য সূত্র, সংরক্ষণশীলতা ও সতর্কতার হ্যান্ডনোট
                      </p>
                    </div>
                    <button
                      onClick={copyCheatSheet}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-bold shadow-xs transition-colors"
                    >
                      {copiedCheatSheet ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedCheatSheet ? 'কপি হয়েছে!' : 'নোট কপি করুন'}</span>
                    </button>
                  </div>

                  {/* 6 Key Formula Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                      <span className="text-xs font-bold text-primary">১. চাপ ও ঘনত্ব:</span>
                      <p className="font-mono text-sm text-foreground font-bold">
                        <RenderMathText text="$P = \frac{F}{A}, \quad \rho = \frac{m}{V}$" />
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        <RenderMathText text="চাপের একক: Pa ($1\text{ N/m}^2$), মাত্রা: $[ML^{-1}T^{-2}]$। ঘনত্ব: $\text{kg/m}^3$।" />
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                      <span className="text-xs font-bold text-primary">২. তরলের চাপ:</span>
                      <p className="font-mono text-sm text-foreground font-bold">
                        <RenderMathText text="$P = h\rho g$" />
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        তরলের চাপ কেবল গভীরতার ওপর নির্ভরশীল, পাত্রের আকারের ওপর নয়।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                      <span className="text-xs font-bold text-primary">৩. আর্কিমিডিসের প্লবতা:</span>
                      <p className="font-mono text-sm text-foreground font-bold">
                        <RenderMathText text="$F_B = V_{\text{sub}}\rho_{\text{liq}}g$" />
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        <RenderMathText text="ভাসার অনুপাত: $\frac{V_{\text{sub}}}{V} = \frac{\rho_{\text{obj}}}{\rho_{\text{liq}}}$।" />
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                      <span className="text-xs font-bold text-primary">৪. প্যাসকেলের সূত্র:</span>
                      <p className="font-mono text-sm text-foreground font-bold">
                        <RenderMathText text="$\frac{F_2}{F_1} = \frac{A_2}{A_1} = \left(\frac{r_2}{r_1}\right)^2$" />
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        কাজ সংরক্ষিত থাকে ($W_1 = W_2 \implies F_1 l_1 = F_2 l_2$)।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                      <span className="text-xs font-bold text-primary">৫. বায়ুর চাপ ও ব্যারোমিটার:</span>
                      <p className="font-mono text-sm text-foreground font-bold">
                        <RenderMathText text="$P_0 = h\rho g \approx 10^5\text{ Pa}$" />
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        <RenderMathText text="পারদস্তম্ভের উচ্চতা ৭৬ সেমি ($0.76\text{ m}$)। পানির ক্ষেত্রে উচ্চতা ১০.৩ মিটার।" />
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                      <span className="text-xs font-bold text-primary">৬. ইয়ং-এর গুণাঙ্ক:</span>
                      <p className="font-mono text-sm text-foreground font-bold">
                        <RenderMathText text="$Y = \frac{FL}{A\Delta L} = \frac{mgL}{\pi r^2 \Delta L}$" />
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        <RenderMathText text="পীড়ন $= F/A$ (Pa), বিকৃতি $= \Delta L/L$ (এককহীন)।" />
                      </p>
                    </div>
                  </div>

                  {/* Top 4 Board Traps Callout */}
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                    <span className="font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                      <ShieldAlert className="h-4 w-4" />
                      <span>বোর্ড পরীক্ষার শীর্ষ ৪টি মারাত্মক ভুল (Examiner Pitfalls):</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>ব্যাস বনাম ব্যাসার্ধের বিভ্রান্তি:</strong> <RenderMathText text="পিস্টনের ব্যাস $d$ থাকলে $r = d/2$ নিতে ভুলবেন না। ক্ষেত্রফলে $A = \pi r^2$।" /></li>
                      <li><strong>প্লবতার সূত্রে ঘনত্বের ভুল:</strong> <RenderMathText text="$F_B = V\rho g$-তে সর্বদা তরলের ঘনত্ব ($\rho_{\text{liquid}}$) বসাতে হবে।" /></li>
                      <li><strong>একক রূপান্তর ফাঁদ:</strong> <RenderMathText text="$1\text{ cm}^3 = 10^{-6}\text{ m}^3$ এবং $1\text{ L} = 10^{-3}\text{ m}^3$ রূপান্তর না করলে সম্পূর্ণ অঙ্ক কাটা যায়।" /></li>
                      <li><strong>বায়ুমণ্ডলীয় চাপ যোগ করতে ভুলে যাওয়া:</strong> <RenderMathText text="কোনো তরলের তলদেশে মোট চাপ চাইলে $P_{\text{total}} = P_0 + h\rho g$ হিসাব করতে হয়।" /></li>
                    </ul>
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
                  <button
                    onClick={() => setActiveStep(4)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold"
                  >
                    মূল্যায়নে ফিরুন (Step 4)
                  </button>
                  <Link
                    href="/dashboard/playground/v2"
                    className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>অধ্যায় ৫ সম্পন্ন • লাইব্রেরিতে ফিরুন</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Embedded Socratic AI Physics Tutor Drawer */}
        {isTutorOpen && (
          <aside className="w-96 border-l border-border/70 bg-card/90 backdrop-blur-md flex flex-col shrink-0 z-50">
            <div className="p-4 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-bold text-xs text-foreground">AI ফিজিক্স শিক্ষক</span>
              </div>
              <button
                onClick={() => setIsTutorOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-muted-foreground leading-relaxed">
                স্বাগতম! পদার্থের অবস্থা ও চাপ ল্যাবে কোনো ধারণা বুঝতে সমস্যা হলে আমাকে বলো। যেমন: আর্কিমিডিসের নীতি, প্লবতা, হাইড্রোলিক প্রেসের বল বৃদ্ধি, বা হুকের সূত্র!
              </div>

              {tutorHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    item.sender === 'user'
                      ? 'bg-primary text-white ml-6'
                      : 'bg-muted/40 border border-border text-foreground mr-4'
                  }`}
                >
                  <RenderMathText text={item.text} />
                </div>
              ))}
            </div>

            {/* Quick Questions Prompts */}
            <div className="p-3 border-t border-border/60 bg-muted/10 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">দ্রুত প্রশ্ন করুন:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  'বরফ পানিতে ভাসে কেন?',
                  'হাইড্রোলিক প্রেসে কি শক্তি তৈরি হয়?',
                  'ইয়ং-এর গুণাঙ্ক কী?',
                ].map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => {
                      setTutorQuery(promptText);
                    }}
                    className="text-[10px] px-2 py-1 rounded-lg bg-card border border-border/80 hover:bg-muted text-foreground text-left"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleTutorSubmit} className="p-3 border-t border-border/70 flex gap-2">
              <input
                type="text"
                placeholder="প্রশ্ন লিখুন..."
                value={tutorQuery}
                onChange={(e) => setTutorQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
}

export default PhysicsMatterPressureGuidebook;

