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

export function SetsFunctionsBoardGuide() {
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
              {isBn ? 'অধ্যায় ২: সেট ও ফাংশন — সমস্যা সমাধান ও রুব্রিক ডিকোড' : 'Chapter 2: Sets & Functions — Board Problem Solutions'}
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'এসএসসি বোর্ড পরীক্ষায় বীজগণিত অংশের সেট ও ফাংশন থেকে আসা সৃজনশীলে (CQ) কীভাবে লিখলে শিক্ষক পূর্ণ ১০/১০ নম্বর দেবেন—তার ধাপে ধাপে রুব্রিক ও সমাধান নির্দেশিকা।'
                : 'Complete NCTB step-by-step rubrics, examiner-approved model solutions, and common student mark deduction traps for Chapter 2: Sets & Functions.'}
            </p>
          </div>

          <Link
            href="/dashboard/practice/generate"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105"
          >
            <span>{isBn ? 'এই অধ্যায়ের মক পরীক্ষা দাও' : 'Practice Mock Exam'}</span>
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
              <span>{isBn ? '১. NCTB মূল তত্ত্ব ও সংজ্ঞা' : '1. Core Theory & Definitions'}</span>
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
              <span>{isBn ? '৩. রুব্রিক ভিত্তিক আদর্শ সমাধান' : '3. Step-by-Step Model Solutions'}</span>
            </button>

            <button
              onClick={() => setActiveSection('traps')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all text-left ${
                activeSection === 'traps'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{isBn ? '৪. পরীক্ষকের সতর্কতা ও ভুল' : '4. Examiner Traps & Pitfalls'}</span>
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
              <span>{isBn ? '৫. বিগত বছরের বোর্ড প্রশ্ন' : '5. Past 5-Year Board Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Right Content Pane */}
        <div className="lg:col-span-3 space-y-6">
          {/* ========================================================================= */}
          {/* SECTION 1: CORE THEORY & DEFINITIONS */}
          {/* ========================================================================= */}
          {activeSection === 'theory' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>{isBn ? '১. NCTB সিলেবাসের সারসংক্ষেপ ও মূল সংজ্ঞাকোষ' : '1. NCTB Core Theory & Formal Definitions'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'বোর্ড পরীক্ষার সৃজনশীলে (ক) নম্বরের সংজ্ঞা ও নৈর্ব্যক্তিক (MCQ) এর জন্য আবশ্যকীয় মূল ধারণা।'
                    : 'Formal definitions required for Knowledge (Part ক) questions formatted verbatim as evaluated by board examiners.'}
                </p>
              </div>

              {/* Set Definitions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
                  <div className="text-blue-400 font-bold text-sm">
                    সেট (Set) ও প্রকাশের পদ্ধতি
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    বাস্তব বা চিন্তা জগতের সু-সংজ্ঞায়িত বস্তুর সমাবেশ বা সংগ্রহকে <strong>সেট</strong> বলে।
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div>• <strong>তালিকা পদ্ধতি (Roster Method):</strong> উপাদানগুলো কমা দিয়ে লিখে দ্বিতীয় বন্ধনীতে আবদ্ধ করা হয়: <RenderMathText text="$A = \{2, 4, 6\}$" />।</div>
                    <div>• <strong>সেট গঠন পদ্ধতি (Set Builder):</strong> উপাদান নির্ধারণে সাধারণ ধর্ম উল্লেখ থাকে: <RenderMathText text="$A = \{x \in \mathbb{N} : x \text{ জোড় সংখ্যা এবং } x \le 6\}$" />।</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                  <div className="text-emerald-400 font-bold text-sm">
                    <RenderMathText text="শক্তি সেট (Power Set, $P(A)$)" />
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    কোনো সেটের সকল উপসেট দ্বারা গঠিত সেটকে ঐ সেটের <strong>শক্তি সেট</strong> বলা হয়।
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div>• <RenderMathText text="যদি $A = \{a, b\}$ হয়, তবে এর উপসেট: $\{a\}, \{b\}, \{a, b\}, \emptyset$।" /></div>
                    <div>• <RenderMathText text="শক্তি সেট $P(A) = \{\{a\}, \{b\}, \{a, b\}, \emptyset\}$।" /></div>
                    <div>• <strong>সোনালী সূত্র:</strong> <RenderMathText text="কোনো সেটের উপাদান সংখ্যা $n$ হলে, তার উপসেট বা শক্তি সেটের উপাদান সংখ্যা সর্বদা $2^n$।" /></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                  <div className="text-amber-400 font-bold text-sm">
                    অন্বয় (Relation), ডোমেন ও রেঞ্জ
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="যদি $A$ ও $B$ দুটি সেট হয়, তবে তাদের কার্তেসীয় গুণজ $A \times B$ এর যেকোনো অশূন্য উপসেট $R$ কে $A$ সেট হতে $B$ সেটের একটি **অন্বয়** বা সম্পর্ক বলা হয়।" />
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div>• <strong>{isBn ? 'ডোমেন' : 'Domain'} (<RenderMathText text="$\text{Dom } R$" />):</strong> {isBn ? 'অন্বয় R এর ক্রোমজোড়গুলোর প্রথম উপাদানসমূহের সেট।' : 'Set of first coordinates in relation R.'}</div>
                    <div>• <strong>{isBn ? 'রেঞ্জ' : 'Range'} (<RenderMathText text="$\text{Range } R$" />):</strong> {isBn ? 'অন্বয় R এর ক্রোমজোড়গুলোর দ্বিতীয় উপাদানসমূহের সেট।' : 'Set of second coordinates in relation R.'}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2">
                  <div className="text-rose-400 font-bold text-sm">
                    {isBn ? 'ফাংশন (Function) ও এক-এক ফাংশন' : 'Functions & One-to-One'}
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="যদি দুটি চলক $x$ ও $y$ এমনভাবে সম্পর্কিত হয় যেন $x$-এর প্রতিটি মানের জন্য $y$-এর কেবল একটি মান পাওয়া যায়, তবে $y$-কে $x$-এর ফাংশন বলা হয় ($y = f(x)$)।" />
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div>• <strong>এক-এক ফাংশন (One-to-One):</strong> ডোমেনের ভিন্ন ভিন্ন সদস্যের ছবি (Image) যদি সর্বদা ভিন্ন হয়, তাকে এক-এক ফাংশন বলে।</div>
                    <div>• শর্ত: <RenderMathText text="$f(x_1) = f(x_2) \implies x_1 = x_2$।" /></div>
                  </div>
                </div>
              </div>

              {/* Set Operations Formula Vault */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  <span>{isBn ? 'সেটের অপারেশন ও দ্য মরগ্যানের সূত্রকোষ' : 'Set Operations & De Morgan Laws'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="rounded-xl border border-primary/20 bg-card p-3 font-mono text-center">
                    <RenderMathText text="$$(A \cup B)' = A' \cap B'$$" />
                    <span className="text-[11px] text-muted-foreground">দ্য মরগ্যানের ১ম সূত্র</span>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-card p-3 font-mono text-center">
                    <RenderMathText text="$$(A \cap B)' = A' \cup B'$$" />
                    <span className="text-[11px] text-muted-foreground">দ্য মরগ্যানের ২য় সূত্র</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: CQ MARKS BREAKDOWN */}
          {/* ========================================================================= */}
          {activeSection === 'cq_structure' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <span>{isBn ? '২. অধ্যায় ২ এর বোর্ড সৃজনশীল প্রশ্নের (CQ) ২ + ৪ + ৪ নম্বর বিভাজন' : '2. Board CQ 2 + 4 + 4 Step Marking Framework'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'পরীক্ষক যেভাবে প্রতিটি ধাপে নম্বর বণ্টন করেন তা জেনে খাতায় নিখুঁত উপস্থাপনা নিশ্চিত করো।'
                    : 'Official breakdown of marks distribution across Knowledge, Application, and Higher Ability questions.'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Part Ka */}
                <div className="rounded-2xl border-l-4 border-l-blue-500 border border-border/60 bg-muted/10 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-black">ক</span>
                      <span>প্রশ্ন (ক) : জ্ঞানমূলক (Knowledge Level)</span>
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-extrabold text-blue-400">
                      ২ নম্বর
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <RenderMathText text="<strong>বোর্ড প্রশ্নে যা আসে:</strong> সেট গঠন পদ্ধতি থেকে তালিকা পদ্ধতিতে রূপান্তর (যেমন: $A = \{x \in \mathbb{N} : x^2 > 15 \text{ এবং } x^3 < 225\}$), অথবা শক্তি সেটের উপাদান সংখ্যা।" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-card p-2.5 rounded-xl border border-border/40">
                    <div>• শর্তের সাপেক্ষে মান নির্ণয়: ১ নম্বর</div>
                    <div>• দ্বিতীয় বন্ধনীতে সঠিক সেট: ১ নম্বর</div>
                  </div>
                </div>

                {/* Part Kha */}
                <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-border/60 bg-muted/10 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">খ</span>
                      <span>প্রশ্ন (খ) : প্রয়োগমূলক (Application Level)</span>
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-extrabold text-emerald-400">
                      ৪ নম্বর
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <RenderMathText text="<strong>বোর্ড প্রশ্নে যা আসে:</strong> 'দেখাও যে, $P(A)$ এর উপাদান সংখ্যা $2^n$ কে সমর্থন করে' (বোর্ডের সবচেয়ে বেশিবার আসা প্রশ্ন!) অথবা সেটের সংযোগ ও ছেদের সমীকরণ যাচাই।" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-card p-2.5 rounded-xl border border-border/40">
                    <div>• উপসেট গঠন: ১ নম্বর</div>
                    <div>• শক্তি সেট P(A): ১ নম্বর</div>
                    <div>• 2^n রূপান্তর: ১ নম্বর</div>
                    <div>• সিদ্ধান্ত ও ফিনিশিং: ১ নম্বর</div>
                  </div>
                </div>

                {/* Part Ga */}
                <div className="rounded-2xl border-l-4 border-l-amber-500 border border-border/60 bg-muted/10 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-black">গ</span>
                      <span>প্রশ্ন (গ) : উচ্চতর দক্ষতা (Higher Ability Level)</span>
                    </span>
                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-extrabold text-amber-400">
                      ৪ নম্বর
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <RenderMathText text="<strong>বোর্ড প্রশ্নে যা আসে:</strong> অন্বয় $R$-কে তালিকা পদ্ধতিতে প্রকাশ করে $\text{Dom } R$ ও $\text{Range } R$ নির্ণয় করো, অথবা ভেনচিত্রের সাহায্যে দ্য মরগ্যানের সূত্র প্রমাণ।" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-card p-2.5 rounded-xl border border-border/40">
                    <div>• শর্তের ছক তৈরি: ১ নম্বর</div>
                    <div>• সেটের সদস্য যাচাই: ১ নম্বর</div>
                    <div>• তালিকা রূপ: ১ নম্বর</div>
                    <div>• ডোমেন ও রেঞ্জ: ১ নম্বর</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: STEP-BY-STEP MODEL SOLUTIONS WITH RUBRICS */}
          {/* ========================================================================= */}
          {activeSection === 'solutions' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>{isBn ? '৩. বোর্ড পরীক্ষক অনুমোদিত আদর্শ সমাধান (Model Solutions)' : '3. Examiner-Approved Model Solutions'}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isBn ? 'অধ্যায় ২ এর শীর্ষ ৩টি বোর্ড প্রশ্ন এবং এদের আদর্শ রুব্রিক খাতা উপস্থাপন।' : 'Top 3 recurring board question templates with step-by-step rubrics.'}
                  </p>
                </div>

                {/* Sub-selector for Solution Types */}
                <div className="flex gap-1.5 bg-muted/40 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveSolutionType(1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeSolutionType === 1 ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ১: 2^n প্রমাণ' : 'Type 1: 2^n Proof'}
                  </button>
                  <button
                    onClick={() => setActiveSolutionType(2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeSolutionType === 2 ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ২: তালিকা পদ্ধতি' : 'Type 2: Roster Method'}
                  </button>
                  <button
                    onClick={() => setActiveSolutionType(3)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeSolutionType === 3 ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ৩: ডোমেন ও রেঞ্জ' : 'Type 3: Domain & Range'}
                  </button>
                </div>
              </div>

              {/* Solution Type 1: 2^n Power Set Proof */}
              {activeSolutionType === 1 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {isBn ? 'বোর্ড পরীক্ষার প্রশ্ন (খ — ৪ নম্বর)' : 'Board CQ Question (Part খ — 4 Marks)'}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        <RenderMathText text="যদি $A = \{a, b, c\}$ হয়, তবে দেখাও যে, $P(A)$-এর উপাদান সংখ্যা $2^n$-কে সমর্থন করে, যেখানে $n$ হলো $A$-এর উপাদান সংখ্যা।" />
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          `দেওয়া আছে, A = {a, b, c}\nA এর উপাদান সংখ্যা n = 3\n\nA এর উপসেটসমূহ:\n১টি করে উপাদান নিয়ে: {a}, {b}, {c}\n২টি করে উপাদান নিয়ে: {a, b}, {b, c}, {c, a}\n৩টি করে উপাদান নিয়ে: {a, b, c}\nকোনো উপাদান না নিয়ে: ∅\n\nসুতরাং, P(A) = {{a}, {b}, {c}, {a, b}, {b, c}, {c, a}, {a, b, c}, ∅}\n\nP(A) এর উপাদান সংখ্যা = 8 = 2^3 = 2^n (যেহেতু n = 3)\n\nঅতএব, P(A) এর উপাদান সংখ্যা 2^n কে সমর্থন করে। (দেখানো হলো)`,
                          1
                        )
                      }
                      className="flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      {copiedType === 1 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedType === 1 ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি উত্তর' : 'Copy Text')}</span>
                    </button>
                  </div>

                  {/* Step by Step Breakdown */}
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: প্রদত্ত সেট ও উপসেটসমূহ নির্ণয়</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="দেওয়া আছে, $A = \{a, b, c\}$। এখানে $A$-এর উপাদান সংখ্যা $n = 3$।" />
                        <br />
                        $A$-এর উপসেটসমূহ:
                        <div className="my-1 pl-3 font-mono text-xs space-y-0.5 text-muted-foreground">
                          <div>• ১টি করে উপাদান নিয়ে: <RenderMathText text="$\{a\}, \{b\}, \{c\}$" /></div>
                          <div>• ২টি করে উপাদান নিয়ে: <RenderMathText text="$\{a, b\}, \{b, c\}, \{c, a\}$" /></div>
                          <div>• ৩টি করে উপাদান নিয়ে: <RenderMathText text="$\{a, b, c\}$" /></div>
                          <div>• কোনো উপাদান না নিয়ে: <RenderMathText text="$\emptyset$" /></div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: শক্তি সেট $P(A)$ গঠন</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        সুতরাং, $A$-এর শক্তি সেট:
                        <div className="my-1.5 text-center font-bold text-primary font-mono text-xs sm:text-sm">
                          <RenderMathText text="$$P(A) = \{\{a\}, \{b\}, \{c\}, \{a, b\}, \{b, c\}, \{c, a\}, \{a, b, c\}, \emptyset\}$$" />
                        </div>
                        <span className="text-xs text-amber-500 font-bold">
                          *(সতর্কতা: পুরো শক্তি সেটের বাইরে দ্বিতীয় বন্ধনী দেওয়া বাধ্যতামূলক!)*
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-500">ধাপ ৩: উপাদান সংখ্যা গণনা ও $2^n$ এ রূপান্তর</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        এখানে, $P(A)$-এর উপাদান সংখ্যা $= 8$
                        <br />
                        <RenderMathText text="$$= 2^3 = 2^n \quad [\text{যেহেতু } n = 3]$$" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-500">ধাপ ৪: সিদ্ধান্ত ও উপসংহার</span>
                        <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        অতএব, $A$-এর উপাদান সংখ্যা $n$ হলে, $P(A)$-এর উপাদান সংখ্যা $2^n$-কে সমর্থন করে।
                        <br />
                        <span className="text-emerald-500 font-bold">**(দেখানো হলো / প্রমাণিত)**</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Type 2: Set Builder to Roster */}
              {activeSolutionType === 2 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {isBn ? 'বোর্ড পরীক্ষার প্রশ্ন (ক — ২ নম্বর)' : 'Board CQ Question (Part ক — 2 Marks)'}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        <RenderMathText text="$A = \{x \in \mathbb{N} : x^2 > 15 \text{ এবং } x^3 < 225\}$ কে তালিকা পদ্ধতিতে প্রকাশ করো।" />
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: স্বাভাবিক সংখ্যাগুলো দ্বারা শর্ত পরীক্ষা</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed space-y-1">
                        <RenderMathText text="স্বাভাবিক সংখ্যাসমূহ $\mathbb{N} = \{1, 2, 3, 4, 5, 6, ...\}$।" />
                        <div className="pl-2 font-mono text-xs text-muted-foreground space-y-0.5">
                          <div>• <RenderMathText text="$x = 1$ হলে, $x^2 = 1 \ngtr 15$" /></div>
                          <div>• <RenderMathText text="$x = 3$ হলে, $x^2 = 9 \ngtr 15$" /></div>
                          <div>• <RenderMathText text="$x = 4$ হলে, $x^2 = 16 > 15$ এবং $x^3 = 64 < 225$ (উভয় শর্ত সত্য)" /></div>
                          <div>• <RenderMathText text="$x = 5$ হলে, $x^2 = 25 > 15$ এবং $x^3 = 125 < 225$ (উভয় শর্ত সত্য)" /></div>
                          <div>• <RenderMathText text="$x = 6$ হলে, $x^2 = 36 > 15$ এবং $x^3 = 216 < 225$ (উভয় শর্ত সত্য)" /></div>
                          <div>• <RenderMathText text="$x = 7$ হলে, $x^3 = 343 \nless 225$ (মিথ্যা)" /></div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: তালিকা পদ্ধতিতে সঠিক সেট উপস্থাপন</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        সুতরাং, গ্রহণযোগ্য মানসমূহ: $4, 5, 6$।
                        <div className="text-emerald-500 font-bold text-sm mt-1">
                          উত্তর: <RenderMathText text="$A = \{4, 5, 6\}$" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Type 3: Relation Domain & Range */}
              {activeSolutionType === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {isBn ? 'বোর্ড পরীক্ষার প্রশ্ন (গ — ৪ নম্বর)' : 'Board CQ Question (Part গ — 4 Marks)'}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        <RenderMathText text="যদি $C = \{-2, -1, 0, 1, 2\}$ এবং $R = \{(x, y) : x \in C, y \in C \text{ এবং } y = x + 1\}$ হয়, তবে $R$-কে তালিকা পদ্ধতিতে প্রকাশ করো এবং $\text{Dom } R$ ও $\text{Range } R$ নির্ণয় করো।" />
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: অন্বয়ের শর্ত ও ছক তৈরি</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="প্রদত্ত অন্বয় $R = \{(x, y) : x \in C, y \in C \text{ এবং } y = x + 1\}$।" />
                        <br />
                        প্রত্যেক $x \in C$ এর জন্য $y = x + 1$ এর মান নির্ণয় করে ছক তৈরি করি:
                        <div className="my-2 overflow-x-auto">
                          <table className="border-collapse border border-border text-xs text-center font-mono">
                            <tbody>
                              <tr>
                                <td className="border border-border p-1.5 font-bold bg-muted/40">x</td>
                                <td className="border border-border p-1.5">-2</td>
                                <td className="border border-border p-1.5">-1</td>
                                <td className="border border-border p-1.5">0</td>
                                <td className="border border-border p-1.5">1</td>
                                <td className="border border-border p-1.5">2</td>
                              </tr>
                              <tr>
                                <td className="border border-border p-1.5 font-bold bg-muted/40">y = x + 1</td>
                                <td className="border border-border p-1.5">-1</td>
                                <td className="border border-border p-1.5">0</td>
                                <td className="border border-border p-1.5">1</td>
                                <td className="border border-border p-1.5">2</td>
                                <td className="border border-border p-1.5 text-rose-500 font-bold">3</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: সদস্য শর্ত যাচাই ও বর্জন</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        যেহেতু <RenderMathText text="$3 \notin C$" />, তাই <RenderMathText text="$(2, 3) \notin R$" />।
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-500">ধাপ ৩: $R$-কে তালিকা পদ্ধতিতে প্রকাশ</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <div className="font-bold text-primary font-mono text-sm">
                          <RenderMathText text="$$R = \{(-2, -1), (-1, 0), (0, 1), (1, 2)\}$$" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-500">ধাপ ৪: ডোমেন ও রেঞ্জ নির্ণয়</span>
                        <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed space-y-1">
                        <div>
                          <RenderMathText text="$\text{Dom } R = \{-2, -1, 0, 1\}$" />
                        </div>
                        <div>
                          <RenderMathText text="$\text{Range } R = \{-1, 0, 1, 2\}$" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: EXAMINER TRAPS & STUDENT MISTAKES */}
          {/* ========================================================================= */}
          {activeSection === 'traps' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <span>{isBn ? '৪. বোর্ড পরীক্ষকের সতর্কতা — শিক্ষার্থীরা যেখানে নম্বর হারায়' : '4. Examiner Traps & Common Mark Deductions'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'অধ্যায় ২ এর এই ৩টি সাধারণ ভুল এড়িয়ে চললে বোর্ড পরীক্ষায় সহজেই পূর্ণ নম্বর নিশ্চিত করা সম্ভব।'
                    : 'The most frequent omissions and errors where examiners automatically deduct marks in Chapter 2.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {isBn ? 'ট্র্যাপ ১: শক্তি সেট ' : 'Trap 1: Power set '}
                      <RenderMathText text="$P(A)$" />
                      {isBn ? ' এর বাইরে দ্বিতীয় বন্ধনী না দেওয়া [১ নম্বর কর্তন!]' : ' missing outer curly brackets!'}
                    </span>
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    {isBn
                      ? 'উপসেটগুলো লিখেই শিক্ষার্থীরা শক্তি সেট শেষ করে ফেলে। কিন্তু শক্তি সেট নিজে একটি সেট, তাই পুরো উপসেটগুলোর দুই পাশে বাইরের দ্বিতীয় বন্ধনী দেওয়া বাধ্যতামূলক!'
                      : 'Students often write individual subsets and forget the outer enclosing curly braces. P(A) is a set of sets, so outer braces are mandatory!'}
                  </div>
                  <div className="rounded-xl bg-card p-3 text-xs font-semibold text-emerald-500 border border-border/40">
                    💡 <strong>{isBn ? 'সঠিক রূপ:' : 'Correct Form:'}</strong>{' '}
                    <RenderMathText text="$P(A) = \{\{a\}, \{b\}, \{a, b\}, \emptyset\}$" />
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {isBn ? 'ট্র্যাপ ২: ফাঁকা সেট লেখার সময় ' : 'Trap 2: Writing empty set as '}
                      <RenderMathText text="$\{\emptyset\}$" />
                      {isBn ? ' লেখা [গুরুতর ভুল!]' : ' [Serious mistake!]'}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    {isBn ? (
                      <>
                        ফাঁকা সেটকে হয় কেবল <RenderMathText text="$\emptyset$" /> লিখতে হবে, অথবা শুধু ফাঁকা দ্বিতীয় বন্ধনী <RenderMathText text="$\{\}$" /> লিখতে হবে। কখনো <RenderMathText text="$\{\emptyset\}$" /> লেখা যাবে না, কারণ তা একটি এক-উপাদানবিশিষ্ট সেট হয়ে যায়!
                      </>
                    ) : (
                      <>
                        Empty set must be written as <RenderMathText text="$\emptyset$" /> or <RenderMathText text="$\{\}$" />. Never write <RenderMathText text="$\{\emptyset\}$" />, as that becomes a singleton set!
                      </>
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {isBn ? 'ট্র্যাপ ৩: ডোমেন ও রেঞ্জ লেখার সময় সেট বন্ধনী না দেওয়া' : 'Trap 3: Omitting set brackets in Domain & Range'}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    {isBn ? (
                      <>
                        ডোমেন ও রেঞ্জ হলো ক্রোমজোড়ের উপাদানগুলোর <strong>সেট</strong>। তাই উত্তরে কেবল সংখ্যাগুলো লিখে দিলে শিক্ষক নম্বর কেটে দেন। ডোমেন ও রেঞ্জের মান অবশ্যই দ্বিতীয় বন্ধনী <RenderMathText text="$\{\dots\}$" /> দিয়ে আবদ্ধ করতে হবে।
                      </>
                    ) : (
                      <>
                        Domain and Range are sets of elements. Omitting curly brackets <RenderMathText text="$\{\dots\}$" /> will lead to mark deductions by examiners.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 5: PAST 5-YEAR BOARD EXAM MATRIX */}
          {/* ========================================================================= */}
          {activeSection === 'board_matrix' && (
            <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>{isBn ? '৫. বিগত ৫ বছরের বোর্ড প্রশ্ন ম্যাট্রিক্স (সেট ও ফাংশন)' : '5. Past 5-Year Board Exam Question Matrix'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'ঢাকা, রাজশাহী, চট্টগ্রাম ও দিনাজপুর বোর্ডের বিগত ৫ বছরের প্রশ্ন বিশ্লেষণ।'
                    : 'Board question trend analysis showing exact CQ distributions for Chapter 2.'}
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border/60">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 border-b border-border/60 font-bold text-foreground">
                    <tr>
                      <th className="p-3">শিক্ষা বোর্ড ও বছর</th>
                      <th className="p-3">প্রশ্ন নম্বর</th>
                      <th className="p-3">প্রশ্নের বিষয়বস্তু</th>
                      <th className="p-3">টাইপ ক্যাটাগরি</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">ঢাকা বোর্ড ২০২৪</td>
                      <td className="p-3 font-mono text-primary">CQ ২ (খ)</td>
                      <td className="p-3"><RenderMathText text="দেখাও যে, $P(B)$ এর উপাদান সংখ্যা $2^n$ কে সমর্থন করে।" /></td>
                      <td className="p-3"><span className="rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-500">টাইপ ১ (2^n প্রমাণ)</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">রাজশাহী বোর্ড ২০২৩</td>
                      <td className="p-3 font-mono text-primary">CQ ২ (গ)</td>
                      <td className="p-3"><RenderMathText text="$S = \{(x, y) : x \in A, y \in A \text{ এবং } y - 2x = 0\}$ অন্বয়ের ডোমেন ও রেঞ্জ নির্ণয় করো।" /></td>
                      <td className="p-3"><span className="rounded bg-amber-500/10 px-2 py-0.5 font-bold text-amber-500">টাইপ ৩ (ডোমেন ও রেঞ্জ)</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">দিনাজপুর বোর্ড ২০২৩</td>
                      <td className="p-3 font-mono text-primary">CQ ২ (ক)</td>
                      <td className="p-3"><RenderMathText text="$M = \{x \in \mathbb{N} : x^2 > 15 \text{ এবং } x^3 < 225\}$ কে তালিকা পদ্ধতিতে প্রকাশ করো।" /></td>
                      <td className="p-3"><span className="rounded bg-blue-500/10 px-2 py-0.5 font-bold text-blue-500">টাইপ ২ (তালিকা পদ্ধতি)</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">চট্টগ্রাম বোর্ড ২০২২</td>
                      <td className="p-3 font-mono text-primary">CQ ২ (খ)</td>
                      <td className="p-3"><RenderMathText text="ভেনচিত্রের সাহায্যে দ্য মরগ্যানের সূত্র $(A \cup B)' = A' \cap B'$ প্রমাণ করো।" /></td>
                      <td className="p-3"><span className="rounded bg-rose-500/10 px-2 py-0.5 font-bold text-rose-500">ভেনচিত্র ও দ্য মরগ্যান</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">কুমিল্লা বোর্ড ২০২০</td>
                      <td className="p-3 font-mono text-primary">CQ ২ (খ)</td>
                      <td className="p-3"><RenderMathText text="প্রমাণ করো যে, $P(A \cap B) = P(A) \cap P(B)$।" /></td>
                      <td className="p-3"><span className="rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-500">শক্তি সেটের উপপাদ্য</span></td>
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
