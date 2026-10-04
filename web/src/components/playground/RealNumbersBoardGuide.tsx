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

export function RealNumbersBoardGuide() {
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
              {isBn ? 'অধ্যায় ১: বাস্তব সংখ্যা — সমস্যা সমাধান ও রুব্রিক ডিকোড' : 'Chapter 1: Real Numbers — Board Problem Solutions'}
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'বোর্ড পরীক্ষায় সৃজনশীলে (CQ) কীভাবে লিখলে শিক্ষক পূর্ণ নম্বর (১০/১০) দেবেন, কোন ধাপে কত নম্বর বরাদ্দ, আর কোন ভুলগুলোতে নম্বর কাটা যায়—তার সম্পূর্ণ নির্দেশিকা।'
                : 'A comprehensive guide on NCTB step-by-step rubrics, examiner-approved model solutions, and common student mark deduction traps for SSC Board Exams.'}
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
                    ? 'বোর্ড পরীক্ষার সৃজনশীল প্রশ্নের (ক) নম্বরের জন্য এই সংজ্ঞাগুলো হুবহু এনসিটিবি পাঠ্যবই অনুযায়ী মুখস্থ রাখা আবশ্যক।'
                    : 'Formal definitions required for Knowledge (Part ক) questions formatted verbatim as evaluated by board examiners.'}
                </p>
              </div>

              {/* Classification Tree Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <RenderMathText text="স্বাভাবিক সংখ্যা (Natural Numbers, $\mathbb{N}$)" />
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="গণনাকারী ধনাত্মক অখণ্ড সংখ্যাসমূহকে স্বাভাবিক সংখ্যা বলে। যেমন: $1, 2, 3, 4, 5...$।" />
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div>• <strong>মৌলিক সংখ্যা:</strong> ১ থেকে বড় যে সকল সংখ্যার ১ এবং ওই সংখ্যা ছাড়া অন্য কোনো গুণনীয়ক নেই (যেমন: ২, ৩, ৫, ৭, ১১...)।</div>
                    <div>• <strong>যৌগিক সংখ্যা:</strong> ১ থেকে বড় যে সকল সংখ্যার ১ ও ওই সংখ্যা ছাড়া অন্য গুণনীয়ক আছে (যেমন: ৪, ৬, ৮, ৯...)।</div>
                    <div>• <strong>সতর্কতা:</strong> <span className="text-amber-500 font-bold">১ মৌলিক সংখ্যাও নয়, যৌগিক সংখ্যাও নয়!</span></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <span>সহমৌলিক সংখ্যা (Coprime Numbers)</span>
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="দুটি স্বাভাবিক সংখ্যার সাধারণ গুণনীয়ক (বা গরিষ্ঠ সাধারণ গুণনীয়ক — গ.সা.গু) কেবল $1$ হলে, সংখ্যা দুটিকে পরস্পর সহমৌলিক বলে।" />
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground">
                    <RenderMathText text="উদাহরণ: $4$ এবং $9$ পরস্পর সহমৌলিক, কারণ $4$ এর গুণনীয়ক ($1, 2, 4$) এবং $9$ এর গুণনীয়ক ($1, 3, 9$)-এর মধ্যে কেবল $1$ সাধারণ।" />
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <RenderMathText text="মূলদ সংখ্যা (Rational Numbers, $\mathbb{Q}$)" />
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="$p$ ও $q$ পূর্ণসংখ্যা এবং $q \neq 0$ হলে, $\frac{p}{q}$ আকারের সংখ্যাকে মূলদ সংখ্যা বলে।" />
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div>• সকল পূর্ণসংখ্যা এবং ভগ্নাংশ সংখ্যাই মূলদ সংখ্যা।</div>
                    <div>• <RenderMathText text="সসীম দশমিক ($0.25 = \frac{1}{4}$) এবং সকল পৌনঃপুনিক দশমিক ($0.\dot{3} = \frac{1}{3}$) মূলদ সংখ্যা।" /></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <RenderMathText text="অমূলদ সংখ্যা (Irrational Numbers, $\mathbb{Q}'$)" />
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="যে সংখ্যাকে দুইটি পূর্ণসংখ্যার অনুপাতে ($\frac{p}{q}$ আকারে, যেখানে $q \neq 0$) প্রকাশ করা যায় না, তাকে অমূলদ সংখ্যা বলে।" />
                  </div>
                  <div className="rounded-lg bg-background/60 p-2.5 text-[11px] text-muted-foreground space-y-1">
                    <div>• অমূলদ সংখ্যার দশমিক ভগ্নাংশ সর্বদা <strong>অসীম অনাবৃত দশমিক</strong>।</div>
                    <div>• <RenderMathText text="পূর্ণবর্গ নয় এমন যেকোনো স্বাভাবিক সংখ্যার বর্গমূল একটি অমূলদ সংখ্যা ($\sqrt{2}, \sqrt{3}, \sqrt{5}, \sqrt{7}$)।" /></div>
                  </div>
                </div>
              </div>

              {/* Core Real Number Formula Vault */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  <span>{isBn ? 'এনসিটিবি পৌনঃপুনিক ভগ্নাংশের সাধারণ সূত্র' : 'NCTB Recurring Decimal Formula'}</span>
                </h4>
                <div className="rounded-xl border border-primary/20 bg-card p-4 text-xs sm:text-sm text-foreground overflow-x-auto text-center font-bold">
                  <RenderMathText text="$$\text{সাধারণ ভগ্নাংশ} = \frac{\text{প্রদত্ত সংখ্যার সম্পূর্ণ অঙ্ক} - \text{অনাবৃত অংশের অঙ্ক}}{\text{যতটি পৌনঃপুনিক অঙ্ক ততটি ৯ এবং যতটি অনাবৃত দশমিক অঙ্ক ততটি ০}}$$" />
                </div>
                <div className="text-[11px] text-muted-foreground">
                  <RenderMathText text="উদাহরণ: $0.2\dot{4}\dot{5}$ এর ক্ষেত্রে লব $= 245 - 2 = 243$ এবং হর $= 990$। অতএব, ভগ্নাংশ $= \frac{243}{990} = \frac{27}{110}$।" />
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
                  <span>{isBn ? '২. বোর্ড সৃজনশীল প্রশ্নের (CQ) ২ + ৪ + ৪ নম্বর বিভাজন ডিকোডার' : '2. Board CQ 2 + 4 + 4 Step Marking Framework'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'বোর্ড প্রধান পরীক্ষকের অফিসিয়াল রুব্রিক অনুযায়ী কীভাবে নম্বর বণ্টন করা হয় তা জেনে নাও।'
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
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>পরীক্ষক কী খোঁজেন:</strong> স্পষ্ট সংজ্ঞা বা সর্বোচ্চ ২ ধাপের সহজ সমাধান (যেমন: একটি ছোট পৌনঃপুনিককে ভগ্নাংশে রূপান্তর, অথবা সহমৌলিকের শর্ত)।
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-card p-2.5 rounded-xl border border-border/40">
                    <div>• সূত্র / প্রথম ধাপ: ১ নম্বর</div>
                    <div>• সঠিক চূড়ান্ত ফলাফল: ১ নম্বর</div>
                  </div>
                </div>

                {/* Part Kha */}
                <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-border/60 bg-muted/10 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">খ</span>
                      <span>প্রশ্ন (খ) : অনুধাবন ও প্রয়োগমূলক (Application Level)</span>
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-extrabold text-emerald-400">
                      ৪ নম্বর
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>পরীক্ষক কী খোঁজেন:</strong> উদ্দীপকের তথ্যের আলোকে সমস্যা সমাধান অথবা প্রমাণ। ৪টি ধাপে ১+১+১+১ করে নম্বর বণ্টন থাকে।
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-card p-2.5 rounded-xl border border-border/40">
                    <div>• ধাপ ১ (মান/সীমা): ১ নম্বর</div>
                    <div>• ধাপ ২ (সূত্র/অনুমোদন): ১ নম্বর</div>
                    <div>• ধাপ ৩ (রূপান্তর/গণনা): ১ নম্বর</div>
                    <div>• ধাপ ৪ (চূড়ান্ত উত্তর): ১ নম্বর</div>
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
                    <RenderMathText text="<strong>পরীক্ষক কী খোঁজেন:</strong> একাধিক যৌক্তিক ধাপের জটিল প্রমাণ (যেমন: $\sqrt{5}$ অমূলদ প্রমাণ) অথবা দুটি বাস্তব সংখ্যার ব্যবধিতে একাধিক মূলদ ও অমূলদ সংখ্যা গঠন ও অনাবৃত বৈশিষ্ট্যের যৌক্তিক প্রমাণ।" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono bg-card p-2.5 rounded-xl border border-border/40">
                    <div>• যুক্তি ১ (অনুমান): ১ নম্বর</div>
                    <div>• রূপান্তর (বর্গ): ১ নম্বর</div>
                    <div>• বৈসাদৃশ্য ব্যাখ্যা: ১ নম্বর</div>
                    <div>• সিদ্ধান্ত ও সমাপ্তি: ১ নম্বর</div>
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
                    {isBn ? 'বোর্ড পরীক্ষায় আসা শীর্ষ ৩টি প্রশ্ন এবং এদের নিখুঁত খাতার উপস্থাপন।' : 'Top 3 recurring board question templates with step-by-step rubrics.'}
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
                    {isBn ? 'টাইপ ১: অমূলদ প্রমাণ' : 'Type 1: Irrational Proof'}
                  </button>
                  <button
                    onClick={() => setActiveSolutionType(2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeSolutionType === 2 ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ২: পৌনঃপুনিক' : 'Type 2: Recurring'}
                  </button>
                  <button
                    onClick={() => setActiveSolutionType(3)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeSolutionType === 3 ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isBn ? 'টাইপ ৩: মধ্যবর্তী সংখ্যা' : 'Type 3: Intervals'}
                  </button>
                </div>
              </div>

              {/* Solution Type 1: Proof of Irrationality */}
              {activeSolutionType === 1 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {isBn ? 'বোর্ড পরীক্ষার প্রশ্ন (৪ নম্বর)' : 'Board CQ Question (4 Marks)'}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        <RenderMathText text="প্রমাণ করো যে, $\sqrt{5}$ একটি অমূলদ সংখ্যা।" />
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          `প্রমাণ: এখানে, 2^2 = 4 < 5 < 9 = 3^2\nসুতরাং, 2 < √5 < 3। অতএব, √5 কোনো পূর্ণসংখ্যা নয়।\n\nধরি, √5 একটি মূলদ সংখ্যা। তাহলে এমন দুটি স্বাভাবিক সংখ্যা p ও q থাকবে যেন, √5 = p/q (যেখানে p ও q পরস্পর সহমৌলিক স্বাভাবিক সংখ্যা এবং q > 1)।\n\nউভয়পক্ষ বর্গ করে: 5 = p^2/q^2 => 5q = p^2/q।\n\nএখানে, 5q একটি পূর্ণসংখ্যা, কিন্তু p^2/q পূর্ণসংখ্যা নয় (কারণ p, q সহমৌলিক)।\nসুতরাং, 5q ≠ p^2/q। অতএব, √5 একটি অমূলদ সংখ্যা। (প্রমাণিত)`,
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
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: পূর্ণসংখ্যা না হওয়ার সীমানা নির্ধারণ</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="এখানে, $2^2 = 4 < 5 < 9 = 3^2$।" />
                        <br />
                        <RenderMathText text="$\therefore 2 < \sqrt{5} < 3$।" />
                        <br />
                        <RenderMathText text="সুতরাং, $\sqrt{5}$ এর মান $2$ অপেক্ষা বড় এবং $3$ অপেক্ষা ছোট। অতএব, $\sqrt{5}$ কোনো পূর্ণসংখ্যা হতে পারে না।" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: মূলদ সংখ্যার বিপরীত অনুমান ও সহমৌলিক শর্ত</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="যদি $\sqrt{5}$ পূর্ণসংখ্যা না হয়, তবে এটি হয় মূলদ সংখ্যা অথবা অমূলদ সংখ্যা হবে।" />
                        <br />
                        <RenderMathText text="ধরি, $\sqrt{5}$ একটি মূলদ সংখ্যা। তাহলে এমন দুটি স্বাভাবিক সংখ্যা $p$ ও $q$ থাকবে, যেন:" />
                        <div className="my-1.5 text-center font-bold text-primary">
                          <RenderMathText text="$\sqrt{5} = \frac{p}{q}$" />
                        </div>
                        <span className="text-xs text-amber-500 font-bold">
                          <RenderMathText text="*(যেখানে $p$ ও $q$ পরস্পর সহমৌলিক স্বাভাবিক সংখ্যা এবং $q > 1$)*" />
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-500">ধাপ ৩: উভয়পক্ষ বর্গ ও বীজগণিতীয় রূপান্তর</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        উভয়পক্ষকে বর্গ করে পাই:
                        <br />
                        <RenderMathText text="$(\sqrt{5})^2 = \left(\frac{p}{q}\right)^2 \implies 5 = \frac{p^2}{q^2}$" />
                        <br />
                        উভয়পক্ষকে $q$ দ্বারা গুণ করে পাই:
                        <br />
                        <span className="font-bold text-primary"><RenderMathText text="$5q = \frac{p^2}{q}$" /></span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-500">ধাপ ৪: পূর্ণসংখ্যা ও ভগ্নাংশের অসঙ্গতি এবং সমাপ্তি</span>
                        <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="এখানে, যেহেতু $q$ একটি স্বাভাবিক সংখ্যা ($q > 1$), তাই $5q$ স্পষ্টতই একটি **পূর্ণসংখ্যা**।" />
                        <br />
                        <RenderMathText text="কিন্তু $p$ ও $q$ পরস্পর সহমৌলিক স্বাভাবিক সংখ্যা এবং $q > 1$ হওয়ায়, $\frac{p^2}{q}$ পূর্ণসংখ্যা নয়, এটি একটি **ভগ্নাংশ**।" />
                        <br />
                        যেহেতু পূর্ণসংখ্যা কখনো ভগ্নাংশের সমান হতে পারে না:
                        <div className="my-1 text-center font-bold text-rose-500">
                          <RenderMathText text="$5q \neq \frac{p^2}{q}$" />
                        </div>
                        <RenderMathText text="সুতরাং, $\sqrt{5}$ কে $\frac{p}{q}$ আকারে প্রকাশ করা সম্ভব নয়।" />
                        <br />
                        <RenderMathText text="$\therefore \sqrt{5}$ মূলদ সংখ্যা হতে পারে না।" />
                        <br />
                        <span className="text-emerald-500 font-bold"><RenderMathText text="অতএব, $\sqrt{5}$ একটি অমূলদ সংখ্যা। (প্রমাণিত)" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Type 2: Recurring Decimals */}
              {activeSolutionType === 2 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {isBn ? 'বোর্ড পরীক্ষার প্রশ্ন (ক — ২ নম্বর)' : 'Board CQ Question (Part ক — 2 Marks)'}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        <RenderMathText text="$0.2\dot{4}\dot{5}$ কে সাধারণ ভগ্নাংশে প্রকাশ করো।" />
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: সূত্র প্রয়োগ</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="$$0.2\dot{4}\dot{5} = \frac{245 - 2}{990}$$" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: বিয়োগ ও লঘিষ্ঠ রূপ</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="$$= \frac{243}{990} = \frac{27}{110}$$" />
                        <div className="text-emerald-500 font-bold text-sm">
                          উত্তর: <RenderMathText text="$\frac{27}{110}$" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Type 3: Intervals */}
              {activeSolutionType === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {isBn ? 'বোর্ড পরীক্ষার প্রশ্ন (খ — ৪ নম্বর)' : 'Board CQ Question (Part খ — 4 Marks)'}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        <RenderMathText text="$\sqrt{3}$ এবং $4$ এর মধ্যবর্তী একটি মূলদ ও একটি অমূলদ সংখ্যা নির্ণয় করো।" />
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-500">ধাপ ১: আসন্ন মান নির্ণয়</span>
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">১ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="এখানে, $\sqrt{3} \approx 1.7320508...$ এবং অপর সংখ্যাটি $4$।" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-500">ধাপ ২: মূলদ সংখ্যা গঠন ও যাচাই</span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">১.৫ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="ধরি, একটি সংখ্যা $x = 2.5 = \frac{25}{10} = \frac{5}{2}$।" />
                        <br />
                        <RenderMathText text="স্পষ্টতই, $1.732... < 2.5 < 4$ অর্থাৎ $\sqrt{3} < x < 4$।" />
                        <br />
                        <RenderMathText text="যেহেতু $x = \frac{5}{2}$ দুটি পূর্ণসংখ্যার ভগ্নাংশ, সুতরাং $x$ একটি **মূলদ সংখ্যা**।" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-500">ধাপ ৩: অমূলদ সংখ্যা গঠন ও অনাবৃত যুক্তি</span>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">১.৫ নম্বর</span>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                        <RenderMathText text="ধরি, অপর একটি সংখ্যা $y = 2.01001000100001...$।" />
                        <br />
                        <RenderMathText text="স্পষ্টতই, $\sqrt{3} < y < 4$।" />
                        <br />
                        <RenderMathText text="যেহেতু $y$ এর দশমিক অংশ অসীম এবং পৌনঃপুনিক নয় (অনাবৃত অসীম দশমিক), সুতরাং $y$ কে $\frac{p}{q}$ ভগ্নাংশ আকারে লেখা যায় না।" />
                        <br />
                        <RenderMathText text="অতএব, $y$ একটি **অমূলদ সংখ্যা**।" />
                        <br />
                        <span className="text-emerald-500 font-bold"><RenderMathText text="উত্তর: মূলদ সংখ্যা $= 2.5$, অমূলদ সংখ্যা $= 2.010010001...$" /></span>
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
                    ? 'এই ৩টি মারাত্মক ভুল কখনোই করবে না। উত্তর জানা সত্ত্বেও এই কারণে শিক্ষার্থীরা এ+ মিস করে।'
                    : 'The most frequent omissions and errors where examiners automatically deduct 1 to 2 marks.'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <RenderMathText text="ট্র্যাপ ১: সহমৌলিক ($p, q$) ও $q > 1$ শর্তটি না লেখা [১ থেকে ২ নম্বর কর্তন!]" />
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="অমূলদ প্রমাণে ($\sqrt{2} = \frac{p}{q}$) লেখার পর ব্র্যাকেটে যদি **'p ও q পরস্পর সহমৌলিক স্বাভাবিক সংখ্যা এবং q > 1'** না লেখো, তবে শিক্ষক পুরো উত্তরের অর্ধেক নম্বর কেটে দেবেন। কারণ $p, q$ সহমৌলিক না হলে $\frac{p^2}{q}$ পূর্ণসংখ্যা হয়ে যেতে পারে!" />
                  </div>
                  <div className="rounded-xl bg-card p-3 text-xs font-semibold text-emerald-500 border border-border/40">
                    <RenderMathText text="💡 **বাঁচার উপায়:** অনুমানের লাইনে অবশ্যই লিখবে: *(যেখানে p ও q পরস্পর সহমৌলিক স্বাভাবিক সংখ্যা এবং q > 1)*।" />
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>ট্র্যাপ ২: পৌনঃপুনিকের যোগে হাতের ১ (Carry Bit) যোগ করতে ভুলে যাওয়া</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    আবৃত্ত দশমিক যোগ করার সময় ডানদিকের অতিরিক্ত অঙ্কের যোগফল ১০ বা তার বেশি হলে হাতের ১ টি প্রথম আবৃত অঙ্কের সাথে যোগ করতে হয়। বহু শিক্ষার্থী এই ১ যোগ না করায় উত্তরে ০.০০১ এর অমিল হয় এবং পুরো ধাপের ২ নম্বর চলে যায়।
                  </p>
                  <div className="rounded-xl bg-card p-3 text-xs font-semibold text-emerald-500 border border-border/40">
                    💡 <strong>বাঁচার উপায়:</strong> সদৃশ করার পর ডানপাশে সর্বদা আবৃত্ত অংশের অতিরিক্ত অন্তত ২টি অঙ্ক বসিয়ে রাফ যোগ করে ক্যারি দেখে নেবে।
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>ট্র্যাপ ৩: সাধারণ ভগ্নাংশকে লঘিষ্ঠ আকারে প্রকাশ না করা</span>
                  </div>
                  <div className="text-xs text-foreground leading-relaxed">
                    <RenderMathText text="$0.2\dot{4}\dot{5}$ এর ক্ষেত্রে $\frac{243}{990}$ পর্যন্ত বের করে রেখে দিলে শিক্ষক ০.৫ থেকে ১ নম্বর কাটবেন। এনসিটিবি রুব্রিক অনুযায়ী ভগ্নাংশকে অবশ্যই পরস্পর সহমৌলিক লব ও হর (লঘিষ্ঠ আকার: $\frac{27}{110}$) পর্যন্ত কাটাকাটি করতে হবে।" />
                  </div>
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
                  <span>{isBn ? '৫. বিগত ৫ বছরের বোর্ড প্রশ্ন ম্যাট্রিক্স (২০২০–২০২৪)' : '5. Past 5-Year Board Exam Question Matrix'}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'ঢাকা, রাজশাহী, চট্টগ্রাম ও যশোর বোর্ডের বিগত ৫ বছরের প্রশ্ন বিশ্লেষণ থেকে নিশ্চিত হওয়া যায় এই ৩টি প্যাটার্নই বারবার আসে।'
                    : 'Board question trend analysis showing exact CQ distributions.'}
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
                      <td className="p-3 font-mono text-primary">CQ ১ (খ)</td>
                      <td className="p-3"><RenderMathText text="প্রমাণ করো যে, $\sqrt{7}$ একটি অমূলদ সংখ্যা।" /></td>
                      <td className="p-3"><span className="rounded bg-rose-500/10 px-2 py-0.5 font-bold text-rose-500">টাইপ ১ (অমূলদ প্রমাণ)</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">রাজশাহী বোর্ড ২০২৩</td>
                      <td className="p-3 font-mono text-primary">CQ ১ (ক)</td>
                      <td className="p-3"><RenderMathText text="$0.3\dot{7}\dot{8}$ কে সাধারণ ভগ্নাংশে রূপান্তর করো।" /></td>
                      <td className="p-3"><span className="rounded bg-blue-500/10 px-2 py-0.5 font-bold text-blue-500">টাইপ ২ (পৌনঃপুনিক)</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">চট্টগ্রাম বোর্ড ২০২৩</td>
                      <td className="p-3 font-mono text-primary">CQ ১ (গ)</td>
                      <td className="p-3"><RenderMathText text="$\sqrt{5}$ এবং $4$ এর মধ্যবর্তী দুটি অমূলদ সংখ্যা নির্ণয় করো।" /></td>
                      <td className="p-3"><span className="rounded bg-amber-500/10 px-2 py-0.5 font-bold text-amber-500">টাইপ ৩ (মধ্যবর্তী সংখ্যা)</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">যশোর বোর্ড ২০২২</td>
                      <td className="p-3 font-mono text-primary">CQ ১ (খ)</td>
                      <td className="p-3">প্রমাণ করো যে, যেকোনো চারটি ক্রমিক স্বাভাবিক সংখ্যার গুণফলের সাথে ১ যোগ করলে যোগফল পূর্ণবর্গ সংখ্যা।</td>
                      <td className="p-3"><span className="rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-500">ক্রমিক সংখ্যার উপপাদ্য</span></td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">কুমিল্লা বোর্ড ২০২০</td>
                      <td className="p-3 font-mono text-primary">CQ ১ (গ)</td>
                      <td className="p-3"><RenderMathText text="$2.3\dot{5}$ এবং $1.\dot{2}\dot{4}$ এর সদৃশ রূপান্তর ও যোগফল নির্ণয় করো।" /></td>
                      <td className="p-3"><span className="rounded bg-blue-500/10 px-2 py-0.5 font-bold text-blue-500">টাইপ ২ (পৌনঃপুনিক যোগ)</span></td>
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
