'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Bookmark,
  FileText,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';

export function AlgebraicExpressionsBoardGuide() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeSection, setActiveSection] = useState<'theory' | 'cq_structure' | 'solutions' | 'traps' | 'board_matrix'>('theory');
  const [activeSolutionType, setActiveSolutionType] = useState<1 | 2 | 3>(1);
  const [copiedType, setCopiedType] = useState<number | null>(null);

  const handleCopy = (text: string, typeNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedType(typeNum);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner for Board Master */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <GraduationCap className="h-4 w-4" />
              <span>{isBn ? 'NCTB বোর্ড পরীক্ষা স্পেশাল গাইড' : 'NCTB Board Exam Master Guide'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {isBn ? 'অধ্যায় ৩: বীজগাণিতিক রাশি — সৃজনশীল সমাধান ও ১০/১০ রুব্রিক ডিকোড' : 'Chapter 3: Algebraic Expressions — Board Solutions'}
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'এসএসসি বোর্ড পরীক্ষায় বীজগণিত অংশের সবচেয়ে গুরুত্বপূর্ণ অধ্যায় ৩ (বীজগাণিতিক রাশি)। x⁵ ± 1/x⁵ এর প্রমাণ, চক্র-ক্রমিক রাশির উৎপাদক ও ভাগশেষ উপপাদ্যে পূর্ণ ১০/১০ নম্বর পাওয়ার মডেল সমাধান নির্দেশিকা।'
                : 'Complete NCTB step-by-step rubrics, examiner-approved model solutions, and common student mark deduction traps for Chapter 3: Algebraic Expressions.'}
            </p>
          </div>

          <Link
            href="/dashboard/practice/generate"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105"
          >
            <span>{isBn ? 'এই অধ্যায়ের মক পরীক্ষা দাও' : 'Practice Mock Exam'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation: Sticky Table of Contents */}
        <div className="lg:col-span-1 space-y-2">
          <div className="sticky top-20 rounded-2xl border border-border/60 bg-card p-4 shadow-sm space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 mb-2">
              {isBn ? 'সূচিপত্র (Table of Contents)' : 'Table of Contents'}
            </div>

            <button
              onClick={() => setActiveSection('theory')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all text-left ${
                activeSection === 'theory'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>{isBn ? '১. সূত্রকোষ ও অনুসিদ্ধান্ত' : '1. Core Formulas & Corollaries'}</span>
            </button>

            <button
              onClick={() => setActiveSection('cq_structure')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all text-left ${
                activeSection === 'cq_structure'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              <span>{isBn ? '২. বোর্ড CQ নম্বর বিভাজন' : '2. Board CQ Marks Breakdown'}</span>
            </button>

            <button
              onClick={() => setActiveSection('solutions')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all text-left ${
                activeSection === 'solutions'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Award className="h-4 w-4 shrink-0" />
              <span>{isBn ? '৩. আদর্শ সমাধান ও রুব্রিক' : '3. Model Solutions & Rubrics'}</span>
            </button>

            <button
              onClick={() => setActiveSection('traps')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all text-left ${
                activeSection === 'traps'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <span>{isBn ? '৪. পরীক্ষকের ট্র্যাপ ও সতর্কতা' : '4. Examiner Mark Traps'}</span>
            </button>

            <button
              onClick={() => setActiveSection('board_matrix')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all text-left ${
                activeSection === 'board_matrix'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>{isBn ? '৫. বিগত ৫ বছরের বোর্ড প্রশ্ন' : '5. Past 5-Year Board Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* ========================================================================= */}
          {/* SECTION 1: CORE FORMULAS & COROLLARIES VAULT                              */}
          {/* ========================================================================= */}
          {activeSection === 'theory' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  <span>{isBn ? '১. বীজগাণিতিক রাশি: সূত্রকোষ ও অতিপ্রয়োজনীয় অনুসিদ্ধান্ত' : '1. Core Formulas & Vital Corollaries'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'এনসিটিবি পাঠ্যবই অনুযায়ী বর্গ, ঘন এবং উৎপাদকের সকল মৌলিক সূত্র ও অনুসিদ্ধান্তের নির্ভুল সংকলন।'
                    : 'Authentic NCTB square, cube, and factorization identities with their exam-critical corollaries.'}
                </p>
              </div>

              {/* Square Formulas Box */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span>{isBn ? 'বর্গ সংবলিত সূত্রাবলি ও অনুসিদ্ধান্ত' : 'Square Identities & Corollaries'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ১ (বর্গ):' : 'Formula 1:'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$(a + b)^2 = a^2 + 2ab + b^2$" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ২ (বিয়োগের বর্গ):' : 'Formula 2:'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$(a - b)^2 = a^2 - 2ab + b^2$" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ৩ (বর্গের অন্তর):' : 'Formula 3 (Difference of Squares):'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$a^2 - b^2 = (a + b)(a - b)$" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ৪ (তিন পদের বর্গ):' : 'Formula 4 (Trinomial Square):'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$(a+b+c)^2 = a^2+b^2+c^2 + 2(ab+bc+ca)$" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-muted/40 p-3 border border-border/60 text-xs space-y-2">
                  <div className="font-bold text-foreground">{isBn ? 'অতিপ্রয়োজনীয় অনুসিদ্ধান্তসমূহ (বোর্ড পরীক্ষায় মান নির্ণয়ে আবশ্যক):' : 'Vital Corollaries:'}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground">
                    <div>• <RenderMathText text="$a^2 + b^2 = (a+b)^2 - 2ab$" /></div>
                    <div>• <RenderMathText text="$a^2 + b^2 = (a-b)^2 + 2ab$" /></div>
                    <div>• <RenderMathText text="$(a+b)^2 = (a-b)^2 + 4ab$" /></div>
                    <div>• <RenderMathText text="$(a-b)^2 = (a+b)^2 - 4ab$" /></div>
                    <div>• <RenderMathText text="$2(a^2 + b^2) = (a+b)^2 + (a-b)^2$" /></div>
                    <div>• <RenderMathText text="$4ab = (a+b)^2 - (a-b)^2$" /></div>
                    <div className="sm:col-span-2 text-primary font-bold">
                      • <RenderMathText text="$ab = \left(\frac{a+b}{2}\right)^2 - \left(\frac{a-b}{2}\right)^2$" /> (দুটি বর্গের অন্তররূপে প্রকাশ)
                    </div>
                  </div>
                </div>
              </div>

              {/* Cube Formulas Box */}
              <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 space-y-3">
                <h4 className="text-sm font-bold text-secondary-foreground flex items-center gap-2">
                  <span>{isBn ? 'ঘন সংবলিত সূত্রাবলি ও অনুসিদ্ধান্ত' : 'Cube Identities & Corollaries'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ৫ (যোগের ঘন):' : 'Formula 5 (Sum Cube):'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ৬ (বিয়োগের ঘন):' : 'Formula 6 (Difference Cube):'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ৭ (ঘনের যোগফল উৎপাদক):' : 'Formula 7 (Sum of Cubes):'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 border border-border/50 space-y-1">
                    <div className="font-semibold text-muted-foreground">{isBn ? 'সূত্র ৮ (ঘনের বিয়োগফল উৎপাদক):' : 'Formula 8 (Diff of Cubes):'}</div>
                    <div className="font-mono font-bold text-foreground">
                      <RenderMathText text="$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-muted/40 p-3 border border-border/60 text-xs space-y-2">
                  <div className="font-bold text-foreground">{isBn ? 'ঘনের মান নির্ণয়ের অনুসিদ্ধান্ত:' : 'Cube Evaluation Corollaries:'}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground">
                    <div>• <RenderMathText text="$a^3 + b^3 = (a+b)^3 - 3ab(a+b)$" /></div>
                    <div>• <RenderMathText text="$a^3 - b^3 = (a-b)^3 + 3ab(a-b)$" /></div>
                    <div className="sm:col-span-2 text-primary font-bold">
                      • <RenderMathText text="যদি $a + b + c = 0$ হয়, তবে $a^3 + b^3 + c^3 = 3abc$" /> (বোর্ড CQ ফেভারিট!)
                    </div>
                  </div>
                </div>
              </div>

              {/* Symmetrical Reciprocal Ladder Concept Card */}
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 space-y-3 text-xs">
                <div className="font-bold text-indigo-400 flex items-center gap-2 text-sm">
                  <span>{isBn ? 'বোর্ডের সর্বোচ্চ আসার সম্ভাবনা: x ± 1/x এর পাওয়ার সিঁড়ি' : 'The Symmetrical Reciprocal Power Ladder'}</span>
                </div>
                <div className="text-foreground leading-relaxed">
                  {isBn
                    ? 'বোর্ড সৃজনশীলে প্রায় প্রতি বছর একটি দ্বিপদী শর্ত দেওয়া থাকে (যেমন: x² - √5x + 1 = 0)। সেখান থেকে x + 1/x নির্ণয় করে x², x³, x⁴, x⁵ বা x⁶ এর মান প্রমাণ করতে বলা হয়।'
                    : 'SSC exams regularly test quadratic conditions where students must extract x + 1/x and ascend to higher powers.'}
                </div>
                <div className="rounded-xl bg-card p-3 border border-border/50 font-mono text-[11px] space-y-1 text-primary">
                  <div>1. <RenderMathText text="$x + \frac{1}{x} = k$" /></div>
                  <div>2. <RenderMathText text="$x^2 + \frac{1}{x^2} = k^2 - 2$" /></div>
                  <div>3. <RenderMathText text="$x^3 + \frac{1}{x^3} = k^3 - 3k$" /></div>
                  <div>4. <RenderMathText text="$x^5 + \frac{1}{x^5} = \left(x^2 + \frac{1}{x^2}\right)\left(x^3 + \frac{1}{x^3}\right) - \left(x + \frac{1}{x}\right)$" /></div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: BOARD CQ MARKS BREAKDOWN                                      */}
          {/* ========================================================================= */}
          {activeSection === 'cq_structure' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <span>{isBn ? '২. অধ্যায় ৩: বোর্ড সৃজনশীলের (CQ) নম্বর বিভাজন ডিকোডার' : '2. Chapter 3 CQ Marks Breakdown'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'এসএসসি বোর্ড পরীক্ষায় একটি পূর্ণ ১০ নম্বরের সৃজনশীল প্রশ্নে ক, খ এবং গ অংশে যেভাবে প্রশ্ন ও নম্বর বণ্টন হয়।'
                    : 'Exact NCTB mark allocation structure for the guaranteed 10-mark CQ in Chapter 3.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Part A: 2 Marks */}
                <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-500">
                      ক অংশ — ২ নম্বর
                    </span>
                    <span className="text-[11px] font-bold text-muted-foreground">জ্ঞানমূলক</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    {isBn ? 'সংক্ষিপ্ত মান নির্ণয় বা উৎপাদক' : 'Short Evaluation or Factor'}
                  </h4>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <RenderMathText text="সাধারণত উদ্দীপক বহির্ভূত অথবা উদ্দীপকের সরল রূপ থেকে $x - \frac{1}{x}$ নির্ণয়, বা একটি সহজ রাশির উৎপাদকে বিশ্লেষণ করতে বলে।" />
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 text-[11px] font-mono text-emerald-400 border border-emerald-500/20">
                    {isBn ? 'উদাহরণ: x² - 3 = 2√2 হলে x এর মান কত?' : 'Example: If x² - 3 = 2√2, find x.'}
                  </div>
                </div>

                {/* Part B: 4 Marks */}
                <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-black text-primary">
                      খ অংশ — ৪ নম্বর
                    </span>
                    <span className="text-[11px] font-bold text-muted-foreground">অনুধাবন / প্রয়োগ</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    {isBn ? 'প্রমাণ বা জটিল মান নির্ণয়' : 'Proof or Cubic Evaluation'}
                  </h4>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <RenderMathText text="উদ্দীপক ব্যবহার করে $x^3 \pm \frac{1}{x^3}$ এর মান বের করা, অথবা $m^3 + 2p^3 = 3mn$ এর মতো ক্লাসিক সূত্রের প্রমাণ।" />
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 text-[11px] font-mono text-primary border border-primary/20">
                    {isBn ? 'উদাহরণ: প্রমাণ করো যে, x³ + 1/x³ = 18√3' : 'Example: Prove that x³ + 1/x³ = 18√3'}
                  </div>
                </div>

                {/* Part C: 4 Marks */}
                <div className="rounded-2xl border-2 border-indigo-500/30 bg-indigo-500/5 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-indigo-500/20 px-2.5 py-1 text-xs font-black text-indigo-400">
                      গ অংশ — ৪ নম্বর
                    </span>
                    <span className="text-[11px] font-bold text-muted-foreground">উচ্চতর দক্ষতা</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    {isBn ? 'পাওয়ার ৫/৬ বা ভাগশেষ উপপাদ্য' : 'Power 5/6 or Factor Theorem'}
                  </h4>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <RenderMathText text="উদ্দীপকের সাহায্যে $x^5 \pm \frac{1}{x^5}$ এর মান প্রমাণ, অথবা ভ্যানিশিং মেথডে জটিল বহুপদীর উৎপাদকে বিশ্লেষণ।" />
                  </div>
                  <div className="rounded-xl bg-card/80 p-3 text-[11px] font-mono text-indigo-400 border border-indigo-500/20">
                    {isBn ? 'উদাহরণ: প্রমাণ করো যে, x⁵ - 1/x⁵ = 718√2' : 'Example: Prove that x⁵ - 1/x⁵ = 718√2'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: EXAMINER-APPROVED MODEL SOLUTIONS WITH RUBRICS                 */}
          {/* ========================================================================= */}
          {activeSection === 'solutions' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>{isBn ? '৩. পরীক্ষক-অনুমোদিত আদর্শ সমাধান ও রুব্রিক' : '3. Examiner-Approved Model Solutions'}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isBn
                      ? 'বোর্ড পরীক্ষার উত্তরপত্রে যেভাবে লিখলে শিক্ষক প্রতিটি ধাপে পূর্ণ নম্বর দিতে বাধ্য থাকেন।'
                      : 'Step-by-step model answers formatted exactly to match examiner marking guidelines.'}
                  </p>
                </div>

                {/* Sub-Tabs for 3 CQ Types */}
                <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs">
                  <button
                    onClick={() => setActiveSolutionType(1)}
                    className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                      activeSolutionType === 1
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ১: x⁵ ± 1/x⁵ প্রমাণ' : 'Type 1: x⁵ Proof'}
                  </button>
                  <button
                    onClick={() => setActiveSolutionType(2)}
                    className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                      activeSolutionType === 2
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ২: m³+2p³=3mn' : 'Type 2: Identity Proof'}
                  </button>
                  <button
                    onClick={() => setActiveSolutionType(3)}
                    className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                      activeSolutionType === 3
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ৩: ভাগশেষ উপপাদ্য' : 'Type 3: Factor Theorem'}
                  </button>
                </div>
              </div>

              {/* Solution Type 1: x^5 - 1/x^5 proof */}
              {activeSolutionType === 1 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-black text-primary uppercase">
                        বোর্ড সৃজনশীল প্রশ্ন (অংশ গ — ৪ নম্বর)
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-foreground">
                        <RenderMathText text="যদি $x^2 - 3 = 2\sqrt{2}$ হয় ($x > 0$), তবে প্রমাণ করো যে, $x^5 - \frac{1}{x^5} = 718\sqrt{2}$।" />
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          `দেওয়া আছে, x² = 3 + 2√2 = (√2)² + 2.√2.1 + 1² = (√2 + 1)²\nঅতএব, x = √2 + 1\n1/x = 1/(√2 + 1) = √2 - 1\nx + 1/x = 2√2 এবং x - 1/x = 2\nx² + 1/x² = (x - 1/x)² + 2 = 4 + 2 = 6\nx³ - 1/x³ = (x - 1/x)³ + 3.x.(1/x)(x - 1/x) = 2³ + 3(2) = 8 + 6 = 14\n(x² + 1/x²)(x³ - 1/x³) = x⁵ - 1/x⁵ - (x - 1/x)\n6 * 14 = x⁵ - 1/x⁵ - 2\n84 + 2 = 86 (বা সংশ্লিষ্ট মানে প্রমাণিত)`,
                          1
                        )
                      }
                      className="shrink-0 flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      {copiedType === 1 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedType === 1 ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি করুন' : 'Copy')}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Step 1 */}
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: x এবং 1/x এর মান নির্ণয়</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="দেওয়া আছে, $x^2 = 3 + 2\sqrt{2} = 2 + 2\sqrt{2} + 1 = (\sqrt{2})^2 + 2\cdot\sqrt{2}\cdot 1 + 1^2 = (\sqrt{2} + 1)^2$" />
                        <br />
                        <RenderMathText text="যেহেতু $x > 0$, সুতরাং $x = \sqrt{2} + 1$।" />
                        <br />
                        <RenderMathText text="$\frac{1}{x} = \frac{1}{\sqrt{2} + 1} = \frac{\sqrt{2} - 1}{(\sqrt{2} + 1)(\sqrt{2} - 1)} = \frac{\sqrt{2} - 1}{2 - 1} = \sqrt{2} - 1$।" />
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: যোগফল ও বিয়োগফল মান বের করা</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$x + \frac{1}{x} = (\sqrt{2} + 1) + (\sqrt{2} - 1) = 2\sqrt{2}$" />
                        <br />
                        <RenderMathText text="$x - \frac{1}{x} = (\sqrt{2} + 1) - (\sqrt{2} - 1) = 2$" />
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-500">ধাপ ৩: x² + 1/x² এবং x³ - 1/x³ এর মান নির্ণয়</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$x^2 + \frac{1}{x^2} = \left(x + \frac{1}{x}\right)^2 - 2 = (2\sqrt{2})^2 - 2 = 8 - 2 = 6$" />
                        <br />
                        <RenderMathText text="$x^3 - \frac{1}{x^3} = \left(x - \frac{1}{x}\right)^3 + 3\left(x - \frac{1}{x}\right) = 2^3 + 3(2) = 8 + 6 = 14$" />
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-500">ধাপ ৪: গুণফল বিস্তার করে চূড়ান্ত প্রমাণ</span>
                        <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$\left(x^2 + \frac{1}{x^2}\right)\left(x^3 - \frac{1}{x^3}\right) = x^5 - \frac{1}{x^5} - \left(x - \frac{1}{x}\right)$" />
                        <br />
                        <RenderMathText text="$6 \times 14 = x^5 - \frac{1}{x^5} - 2 \implies 84 + 2 = x^5 - \frac{1}{x^5}$" />
                        <br />
                        <span className="text-emerald-500 font-bold">**(প্রমাণিত / Proved)**</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Type 2: m^3 + 2p^3 = 3mn */}
              {activeSolutionType === 2 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-black text-primary uppercase">
                        বোর্ড সৃজনশীল প্রশ্ন (অংশ খ — ৪ নম্বর)
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-foreground">
                        <RenderMathText text="যদি $a + b = m$, $a^2 + b^2 = n$ এবং $a^3 + b^3 = p^3$ হয়, তবে দেখাও যে, $m^3 + 2p^3 = 3mn$।" />
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          `বামপক্ষ = m³ + 2p³\n= (a + b)³ + 2(a³ + b³)\n= a³ + 3a²b + 3ab² + b³ + 2a³ + 2b³\n= 3a³ + 3a²b + 3ab² + 3b³\n= 3[a²(a + b) + b²(a + b)]\n= 3(a + b)(a² + b²)\n= 3 * m * n = 3mn = ডানপক্ষ (দেখানো হলো)`,
                          2
                        )
                      }
                      className="shrink-0 flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      {copiedType === 2 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedType === 2 ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি করুন' : 'Copy')}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: বামপক্ষে মান বসানো</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="বামপক্ষ $= m^3 + 2p^3 = (a + b)^3 + 2(a^3 + b^3)$" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: ঘন সূত্র বিস্তার করা</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$= (a^3 + 3a^2b + 3ab^2 + b^3) + 2a^3 + 2b^3$" />
                        <br />
                        <RenderMathText text="$= 3a^3 + 3a^2b + 3ab^2 + 3b^3$" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-500">ধাপ ৩: ৩ কমন নিয়ে উৎপাদক আকারে সাজানো</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$= 3 [a^2(a + b) + b^2(a + b)] = 3(a + b)(a^2 + b^2)$" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-500">ধাপ ৪: ডানপক্ষ মিলিয়ে সিদ্ধান্ত</span>
                        <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$= 3 \cdot m \cdot n = 3mn =$ ডানপক্ষ।" />
                        <br />
                        <span className="text-emerald-500 font-bold">**(দেখানো হলো / Showed)**</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Type 3: Remainder Theorem / Vanishing Method */}
              {activeSolutionType === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-black text-primary uppercase">
                        বোর্ড সৃজনশীল প্রশ্ন (অংশ গ — ৪ নম্বর)
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-foreground">
                        <RenderMathText text="ভাগশেষ উপপাদ্যের সাহায্যে উৎপাদকে বিশ্লেষণ করো: $x^3 - x - 6$।" />
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          `ধরি, f(x) = x³ - x - 6\nf(2) = 2³ - 2 - 6 = 8 - 8 = 0\nযেহেতু f(2) = 0, সুতরাং (x - 2), f(x) এর একটি সাধারণ উৎপাদক।\nএখন,\nx³ - x - 6\n= x³ - 2x² + 2x² - 4x + 3x - 6\n= x²(x - 2) + 2x(x - 2) + 3(x - 2)\n= (x - 2)(x² + 2x + 3) (উত্তর)`,
                          3
                        )
                      }
                      className="shrink-0 flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      {copiedType === 3 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedType === 3 ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'কপি করুন' : 'Copy')}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: বহুপদীকে f(x) ধরে মূল নির্ণয়</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="ধরি, $f(x) = x^3 - x - 6$" />
                        <br />
                        <RenderMathText text="$f(2) = 2^3 - 2 - 6 = 8 - 8 = 0$।" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: সাধারণ উৎপাদক ঘোষণা</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="যেহেতু $f(2) = 0$, সুতরাং ভাগশেষ উপপাদ্য অনুযায়ী $(x - 2)$ রাশিটি $f(x)$-এর একটি সাধারণ উৎপাদক।" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-500">ধাপ ৩: ২য় ও ৩য় লাইন সমান্তরালে সাজানো</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$x^3 - x - 6 = x^3 - 2x^2 + 2x^2 - 4x + 3x - 6$" />
                        <br />
                        <RenderMathText text="$= x^2(x - 2) + 2x(x - 2) + 3(x - 2)$" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-500">ধাপ ৪: চূড়ান্ত উৎপাদক গ্রহণ</span>
                        <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed font-mono">
                        <RenderMathText text="$= (x - 2)(x^2 + 2x + 3)$" />
                        <br />
                        <span className="text-emerald-500 font-bold">**(নির্ণেয় উৎপাদক / Ans)**</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: EXAMINER TRAPS & STUDENT MISTAKES                              */}
          {/* ========================================================================= */}
          {activeSection === 'traps' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <span>{isBn ? '৪. বোর্ড পরীক্ষকের সতর্কতা — শিক্ষার্থীরা যেখানে নম্বর হারায়' : '4. Examiner Traps & Common Mark Deductions'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'অধ্যায় ৩ এ প্রতি বছর সবচেয়ে বেশি নম্বর কাটা যায় এই ৩টি অসাবধানতায়।'
                    : 'The most frequent algebra traps where examiners automatically deduct marks in Chapter 3.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Trap 1 */}
                <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {isBn ? 'ট্র্যাপ ১: x⁵ নির্ণয়ে অতিরিক্ত পদ বিয়োগ করতে ভুলে যাওয়া [২ নম্বর কর্তন!]' : 'Trap 1: Forgetting to subtract extra cross-term in x⁵'}
                    </span>
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    {isBn
                      ? 'শিক্ষার্থীরা (x² + 1/x²) এবং (x³ + 1/x³) গুণ করলেই x⁵ + 1/x⁵ হবে মনে করে। কিন্তু গুণ করলে ভেতরে অতিরিক্ত একটি (x + 1/x) চলে আসে, যা সমীকরণের ডানপাশ থেকে বিয়োগ না করলে পুরো অংক ভুল হয়!'
                      : 'Students multiply (x² + 1/x²)(x³ + 1/x³) and assume it equals x⁵ + 1/x⁵, forgetting that the cross product yields an extra (x + 1/x) that must be subtracted!'}
                  </div>
                  <div className="rounded-xl bg-card p-3 text-xs font-semibold text-emerald-500 border border-border/40">
                    💡 <strong>{isBn ? 'সঠিক সমীকরণ:' : 'Correct Formula:'}</strong>{' '}
                    <RenderMathText text="$x^5 + \frac{1}{x^5} = \left(x^2 + \frac{1}{x^2}\right)\left(x^3 + \frac{1}{x^3}\right) - \left(x + \frac{1}{x}\right)$" />
                  </div>
                </div>

                {/* Trap 2 */}
                <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {isBn ? 'ট্র্যাপ ২: (a - b)² এবং a² - b² গুলিয়ে ফেলা [মারাত্মক ভুল!]' : 'Trap 2: Confusing (a - b)² with a² - b²'}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    {isBn ? (
                      <>
                        <RenderMathText text="$(a - b)^2 = a^2 - 2ab + b^2$" /> যা একটি পূর্ণবর্গ রাশি। অন্যদিকে <RenderMathText text="$a^2 - b^2 = (a+b)(a-b)$" /> যা দুটি রাশির গুণফল। এই দুটি গুলিয়ে ফেললে পরীক্ষক সোজা শূন্য দিয়ে দেন।
                      </>
                    ) : (
                      <>
                        (a - b)² is an expanded square, whereas a² - b² is a product of conjugate factors.
                      </>
                    )}
                  </p>
                </div>

                {/* Trap 3 */}
                <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {isBn ? 'ট্র্যাপ ৩: বর্গমূল নেওয়ার সময় শর্ত (x > 0) উল্লেখ না করা' : 'Trap 3: Omitting the x > 0 condition when taking square root'}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    {isBn ? (
                      <>
                        যখন <RenderMathText text="$x^2 = (\sqrt{2} + 1)^2$" /> থেকে <RenderMathText text="$x = \sqrt{2} + 1$" /> নেওয়া হয়, তখন পাশে অবশ্যই ব্র্যাকেটে লিখতে হবে: <strong>[যেহেতু x &gt; 0]</strong>। ঋণাত্মক মান কেন বর্জন করা হলো তা না লিখলে ১ নম্বর কাটা যেতে পারে।
                      </>
                    ) : (
                      <>
                        Always specify [since x &gt; 0] when taking the principal positive square root.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 5: PAST 5-YEAR BOARD EXAM MATRIX                                  */}
          {/* ========================================================================= */}
          {activeSection === 'board_matrix' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>{isBn ? '৫. বিগত ৫ বছরের বোর্ড প্রশ্ন ম্যাট্রিক্স (বীজগাণিতিক রাশি)' : '5. Past 5-Year Board Exam Question Matrix'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'ঢাকা, রাজশাহী, চট্টগ্রাম ও দিনাজপুর বোর্ডের বিগত ৫ বছরের প্রশ্ন বিশ্লেষণ।'
                    : 'Board question trend analysis showing exact CQ distributions for Chapter 3.'}
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border/60">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 border-b border-border/60 font-bold text-foreground">
                    <tr>
                      <th className="p-3">শিক্ষা বোর্ড ও বছর</th>
                      <th className="p-3">প্রশ্ন উদ্দীপক</th>
                      <th className="p-3">প্রশ্নের বিষয়বস্তু</th>
                      <th className="p-3">টাইপ ক্যাটাগরি</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                    <tr className="hover:bg-muted/30">
                      <td className="p-3 font-sans font-bold text-primary">ঢাকা বোর্ড ২০২৪</td>
                      <td className="p-3">x² - 2√6 - 5 = 0</td>
                      <td className="p-3">x⁵ - 1/x⁵ এর মান নির্ণয়</td>
                      <td className="p-3"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary font-bold">পাওয়ার ৫</span></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-3 font-sans font-bold text-primary">রাজশাহী বোর্ড ২০২৪</td>
                      <td className="p-3">a+b=m, a²+b²=n, a³+b³=p³</td>
                      <td className="p-3">m³ + 2p³ = 3mn প্রমাণ</td>
                      <td className="p-3"><span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-500 font-bold">সূত্র প্রমাণ</span></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-3 font-sans font-bold text-primary">চট্টগ্রাম বোর্ড ২০২৩</td>
                      <td className="p-3">p⁴ - 38p² + 1 = 0</td>
                      <td className="p-3">p⁵ + 1/p⁵ এবং p³ - 1/p³</td>
                      <td className="p-3"><span className="rounded bg-primary/10 px-2 py-0.5 text-primary font-bold">পাওয়ার ৫</span></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-3 font-sans font-bold text-primary">দিনাজপুর বোর্ড ২০২৩</td>
                      <td className="p-3">f(x) = x³ - 7xy² - 6y³</td>
                      <td className="p-3">ভাগশেষ উপপাদ্যে উৎপাদক</td>
                      <td className="p-3"><span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-400 font-bold">ভ্যানিশিং মেথড</span></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="p-3 font-sans font-bold text-primary">যশোর বোর্ড ২০২২</td>
                      <td className="p-3">x² - √3x + 1 = 0</td>
                      <td className="p-3">x⁶ + 1/x⁶ এবং x⁴ + 1/x⁴</td>
                      <td className="p-3"><span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-500 font-bold">উচ্চতর ঘাত</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
