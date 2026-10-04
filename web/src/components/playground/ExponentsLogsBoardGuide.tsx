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

export function ExponentsLogsBoardGuide() {
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
              {isBn ? 'অধ্যায় ৪: সূচক ও লগারিদম — সৃজনশীল সমাধান ও ১০/১০ রুব্রিক ডিকোড' : 'Chapter 4: Exponents & Logarithms — Board Solutions'}
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'এসএসসি বোর্ড পরীক্ষায় বীজগণিত ‘ক’ বিভাগে সূচক ও লগারিদম থেকে প্রায় প্রতি বছর একটি পূর্ণ সৃজনশীল (১০ নম্বর) প্রশ্ন থাকে। চক্র-ক্রমিক সূচক প্রমাণ, সরলীকরণ ও ভিত্তি রূপান্তরের শতভাগ নির্ভুল সমাধান সহায়িকা।'
                : 'Complete NCTB step-by-step rubrics, examiner-approved model solutions, and common student mark deduction traps for Chapter 4: Exponents & Logarithms.'}
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

      {/* 5-Pillar Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60 scrollbar-none">
        <button
          onClick={() => setActiveSection('theory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSection === 'theory'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{isBn ? '১. সূত্র ও মৌলিক শর্তাবলী' : '1. Theory & Formulas'}</span>
        </button>

        <button
          onClick={() => setActiveSection('cq_structure')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSection === 'cq_structure'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>{isBn ? '২. সিকিউ প্রশ্ন কাঠামো (২+৪+৪)' : '2. CQ Breakdown (2+4+4)'}</span>
        </button>

        <button
          onClick={() => setActiveSection('solutions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSection === 'solutions'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{isBn ? '৩. বোর্ড মডেল সমাধান ও নম্বর রুব্রিক' : '3. Model Board Solutions'}</span>
        </button>

        <button
          onClick={() => setActiveSection('traps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSection === 'traps'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>{isBn ? '৪. যেসব ভুলে নম্বর কাটা যায়' : '4. Examiner Traps'}</span>
        </button>

        <button
          onClick={() => setActiveSection('board_matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSection === 'board_matrix'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>{isBn ? '৫. বিগত ৫ বছরের বোর্ড ম্যাট্রিক্স' : '5. 5-Year Board Matrix'}</span>
        </button>
      </div>

      {/* Pillar 1: Theory & Formulas */}
      {activeSection === 'theory' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exponents Laws */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Bookmark className="h-5 w-5" />
                <h3>{isBn ? 'সূচকের মৌলিক সূত্রাবলী (Laws of Exponents)' : 'Laws of Exponents'}</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {isBn
                  ? 'যেখানে a, b বাস্তব সংখ্যা এবং m, n মূলদ বা স্বাভাবিক সংখ্যা:'
                  : 'Where a, b are real numbers and m, n are rational exponents:'}
              </p>
              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">১. গুণের সূত্র:</span>
                  <RenderMathText text="$a^m \cdot a^n = a^{m+n}$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">২. ভাগের সূত্র:</span>
                  <RenderMathText text="$\frac{a^m}{a^n} = a^{m-n} \text{ (যখন } m \ge n \text{ এবং } a \neq 0 \text{)}$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৩. ঘাতের ঘাত:</span>
                  <RenderMathText text="$(a^m)^n = a^{mn}$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৪. গুণফলের ঘাত:</span>
                  <RenderMathText text="$(ab)^n = a^n b^n$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৫. ভাগফলের ঘাত:</span>
                  <RenderMathText text="$\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n} \text{ (যেখানে } b \neq 0 \text{)}$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৬. শূন্য ও ঋণাত্মক সূচক:</span>
                  <RenderMathText text="$a^0 = 1 \text{ (শর্ত: } a \neq 0 \text{)}, \quad a^{-n} = \frac{1}{a^n} \text{ (শর্ত: } a \neq 0 \text{)}$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৭. মূলীয় রূপ (Radical):</span>
                  <RenderMathText text="$\sqrt[n]{a} = a^{1/n}, \quad \sqrt[n]{a^m} = a^{m/n} \text{ (যেখানে } a > 0, n \in \mathbb{N}, n > 1\text{)}$" />
                </div>
              </div>
            </div>

            {/* Logarithm Laws */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Bookmark className="h-5 w-5" />
                <h3>{isBn ? 'লগারিদমের মৌলিক সূত্রাবলী (Laws of Logarithms)' : 'Laws of Logarithms'}</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {isBn
                  ? 'শর্ত: ভিত্তি a > 0, a ≠ 1 এবং আর্গুমেন্ট M, N > 0:'
                  : 'Conditions: Base a > 0, a ≠ 1 and Arguments M, N > 0:'}
              </p>
              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">১. সংজ্ঞা:</span>
                  <RenderMathText text="$a^x = N \iff x = \log_a N$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">২. অভেদ মান:</span>
                  <RenderMathText text="$\log_a 1 = 0 \quad \text{এবং} \quad \log_a a = 1$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৩. গুণফলের লগ:</span>
                  <RenderMathText text="$\log_a (MN) = \log_a M + \log_a N$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৪. ভাগফলের লগ:</span>
                  <RenderMathText text="$\log_a \left(\frac{M}{N}\right) = \log_a M - \log_a N$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৫. ঘাতের লগ:</span>
                  <RenderMathText text="$\log_a (M^k) = k \log_a M$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৬. ভিত্তি পরিবর্তন:</span>
                  <RenderMathText text="$\log_a M = \log_b M \cdot \log_a b = \frac{\log_b M}{\log_b a}$" />
                </div>
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50">
                  <span className="font-bold text-primary mr-2">৭. বিপরীত ভিত্তি:</span>
                  <RenderMathText text="$\log_a b = \frac{1}{\log_b a} \implies \log_a b \cdot \log_b a = 1$" />
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Notation & Characteristic / Mantissa Box */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-black">!</span>
              <span>{isBn ? 'বৈজ্ঞানিক রূপ, পূর্ণক ও অংশকের নিয়ম (Characteristic & Mantissa Rules)' : 'Scientific Notation & Log Parts'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
                <span className="font-bold text-primary">বৈজ্ঞানিক রূপ (Standard Form):</span>
                <p className="text-muted-foreground">
                  যেকোনো সংখ্যাকে <RenderMathText text="$N = a \times 10^n$" /> আকারে লেখা, যেখানে <RenderMathText text="$1 \le a < 10$" /> এবং <RenderMathText text="$n \in \mathbb{Z}$" />।
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
                <span className="font-bold text-primary">পূর্ণক (Characteristic):</span>
                <p className="text-muted-foreground">
                  দশমিকের বামে <RenderMathText text="$k$" /> টি অঙ্ক থাকলে পূর্ণক <RenderMathText text="$k - 1$" />। আর <RenderMathText text="$0 < N < 1$" /> এর দশমিকের পর <RenderMathText text="$k$" /> টি শূন্য থাকলে পূর্ণক <RenderMathText text="$-(k + 1) = \bar{k+1}$" />।
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
                <span className="font-bold text-primary">অংশক (Mantissa):</span>
                <p className="text-muted-foreground">
                  লগের দশমিক ভগ্নাংশ অংশ। অংশক সর্বদা <strong>অঋণাত্মক ধনাত্মক মান</strong> (<RenderMathText text="$0 \le m < 1$" />) হতে হবে। ঋণাত্মক লগ হলে ১ ধার করে রূপান্তর করতে হয়।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pillar 2: CQ Structure */}
      {activeSection === 'cq_structure' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? 'এসএসসি পরীক্ষায় অধ্যায় ৪ এর সৃজনশীল প্রশ্ন বিন্যাস (Marks: ২ + ৪ + ৪ = ১০)' : 'SSC Chapter 4 CQ Distribution'}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'এসএসসি বোর্ড পরীক্ষায় বীজগণিত বিভাগের ৩টি প্রশ্নের মধ্যে অন্তত ১টি প্রশ্ন সরাসরি সূচক ও লগারিদম থেকে আসে। নিচে ৩টি অংশের প্রশ্ন ধরন ও নম্বর বণ্টনের ছক দেওয়া হলো:'
                : 'In SSC Board Exams, Chapter 4 CQ carries 10 full marks divided into Parts ক, খ, and গ.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Part Ka */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                    {isBn ? 'ক অংশ — ২ নম্বর' : 'Part ক — 2 Marks'}
                  </span>
                  <span className="text-xs text-muted-foreground">জ্ঞান ও অনুধাবন</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  {isBn ? 'সহজ রূপান্তর ও সরল' : 'Direct Simplification & Log Values'}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>সাধারণ বা বৈজ্ঞানিক সংখ্যার পূর্ণক ও অংশক নির্ণয়</li>
                  <li>সরল সূচকীয় সমীকরণ সমাধান যেমন: <RenderMathText text="$4^{x+1} = 32$" /></li>
                  <li>লগের মান বের করা যেমন: <RenderMathText text="$\log_{\sqrt{3}} 81$" /></li>
                  <li>শর্ত ব্যাখ্যা: <RenderMathText text="$a^0 = 1$" /> এর শর্ত কী ও কেন?</li>
                </ul>
              </div>

              {/* Part Kha */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {isBn ? 'খ অংশ — ৪ নম্বর' : 'Part খ — 4 Marks'}
                  </span>
                  <span className="text-xs text-muted-foreground">প্রয়োগমূলক</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  {isBn ? 'সূচকের ভগ্নাংশ সরল ও চক্র-ক্রমিক প্রমাণ' : 'Cyclic Exponents & Rational Power Simplification'}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>সূচকের ঐতিহ্যবাহী ভগ্নাংশ সরল: <RenderMathText text="$\frac{2^{n+4} - 4 \cdot 2^{n+1}}{2^{n+2} \div 2}$" /></li>
                  <li>চক্রীয় সম্পর্ক থেকে প্রমাণ: <RenderMathText text="$p^a = q, q^b = r, r^c = p \implies abc = 1$" /></li>
                  <li>ঘাতের চক্রীয় গুণফল সরল: <RenderMathText text="$\left(\frac{x^p}{x^q}\right)^{p+q-r} \cdots = 1$" /></li>
                </ul>
              </div>

              {/* Part Ga */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-lg bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                    {isBn ? 'গ অংশ — ৪ নম্বর' : 'Part গ — 4 Marks'}
                  </span>
                  <span className="text-xs text-muted-foreground">উচ্চতর দক্ষতা</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  {isBn ? 'লগারিদমের জটিল অভেদ ও ভিত্তি পরিবর্তন' : 'Advanced Log Identities & Base Change'}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>অনুপাত সমীকরণ থেকে প্রমাণ: <RenderMathText text="$\frac{\log_k a}{y-z} = \frac{\log_k b}{z-x} = \frac{\log_k c}{x-y}$" /></li>
                  <li>প্রমাণ করো যে: <RenderMathText text="$a^{y+z} b^{z+x} c^{x+y} = 1$" /></li>
                  <li>জটিল লগের মান নির্ণয় ও বহু-রাশির ভগ্নাংশ রূপান্তর</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pillar 3: Model Board Solutions */}
      {activeSection === 'solutions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Solution Selector Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSolutionType(1)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSolutionType === 1
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card border border-border/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              {isBn ? 'মডেল ১ (খ অংশ): pᵃ = q, qᵇ = r, rᶜ = p প্রমাণ' : 'Model 1 (Part খ): pᵃ = q, qᵇ = r, rᶜ = p'}
            </button>
            <button
              onClick={() => setActiveSolutionType(2)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSolutionType === 2
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card border border-border/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              {isBn ? 'মডেল ২ (খ অংশ): 2ⁿ⁺⁴ সূচকীয় ভগ্নাংশ সরলীকরণ' : 'Model 2 (Part খ): 2^(n+4) Simplification'}
            </button>
            <button
              onClick={() => setActiveSolutionType(3)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSolutionType === 3
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card border border-border/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              {isBn ? 'মডেল ৩ (গ অংশ): logₖ a / (y-z) জটিল অনুপাত প্রমাণ' : 'Model 3 (Part গ): log a / (y-z) Identity'}
            </button>
          </div>

          {/* Model Solution 1 */}
          {activeSolutionType === 1 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <span className="inline-block rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 text-xs mb-1">
                    {isBn ? 'ঢাকা বোর্ড ২০২০, রাজশাহী ২০২২, চট্টগ্রাম ২০২৩' : 'Dhaka 2020, Rajshahi 2022, Ctg 2023'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {isBn ? 'প্রশ্ন (খ অংশ — ৪ নম্বর):' : 'Question (Part খ — 4 Marks):'}
                  </h3>
                  <div className="text-sm font-medium text-primary mt-1">
                    <RenderMathText text="যদি $p^a = q, q^b = r$ এবং $r^c = p$ হয়, তবে দেখাও যে, $abc = 1$।" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `দেওয়া আছে:\np^a = q ... (i)\nq^b = r ... (ii)\nr^c = p ... (iii)\n\n(iii) নং সমীকরণ হতে পাই:\nr^c = p\nবা, (q^b)^c = p  [যেহেতু (ii) হতে, r = q^b]\nবা, q^(bc) = p   [যেহেতু (a^m)^n = a^(mn)]\nবা, (p^a)^(bc) = p  [যেহেতু (i) হতে, q = p^a]\nবা, p^(abc) = p^1\nবা, abc = 1  [যেহেতু a^x = a^y এবং a ≠ 0, 1 হলে x = y]\nঅতএব, abc = 1 (দেখানো হলো)।`,
                      1
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  {copiedType === 1 ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedType === 1 ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : isBn ? 'উত্তর কপি করো' : 'Copy Solution'}</span>
                </button>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'পরীক্ষকের ধাপে ধাপে নম্বর বণ্টন ও মডেল উত্তর:' : 'Step-by-Step Marking Rubric & Model Answer:'}
                </h4>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ১: প্রদত্ত তথ্যসমূহ চিহ্নিতকরণ ও ৩য় সমীকরণ নির্ধারণ</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>দেওয়া আছে,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$p^a = q \quad \dots (i)$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$q^b = r \quad \dots (ii)$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$r^c = p \quad \dots (iii)$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ২: প্রথম প্রতিস্থাপন (r এর মান বসানো)</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>(iii) নং সমীকরণ হতে পাই,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$r^c = p$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\implies (q^b)^c = p \quad [\because (ii) \text{ হতে, } r = q^b]$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\implies q^{bc} = p \quad [\because (a^m)^n = a^{mn}]$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ৩: দ্বিতীয় প্রতিস্থাপন (q এর মান বসানো)</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>এখন, (i) নং সমীকরণ হতে <RenderMathText text="$q = p^a$" /> এর মান বসিয়ে পাই,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$(p^a)^{bc} = p$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\implies p^{abc} = p^1 \quad [\because (a^m)^n = a^{mn}]$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ৪: সূচকের সমতা বিধি প্রয়োগ ও সমাপনী সিদ্ধান্ত</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>যেহেতু উভয়পক্ষের ভিত্তি একই এবং <RenderMathText text="$p > 0, p \neq 1$" />,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$p^{abc} = p^1 \implies abc = 1 \quad [\because a^x = a^y \implies x = y]$" />
                      </p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                        <RenderMathText text="$\therefore abc = 1$ (দেখানো হলো / Showed)" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Model Solution 2 */}
          {activeSolutionType === 2 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <span className="inline-block rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 text-xs mb-1">
                    {isBn ? 'যশোর ২০২১, দিনাজপুর ২০২৩, ময়মনসিংহ ২০২৪' : 'Jashore 2021, Dinajpur 2023, Mymensingh 2024'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {isBn ? 'প্রশ্ন (খ অংশ — ৪ নম্বর):' : 'Question (Part খ — 4 Marks):'}
                  </h3>
                  <div className="text-sm font-medium text-primary mt-1">
                    <RenderMathText text="সরল করো: $\frac{2^{n+4} - 4 \cdot 2^{n+1}}{2^{n+2} \div 2}$" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `প্রদত্ত রাশি = [2^(n+4) - 4 · 2^(n+1)] / [2^(n+2) ÷ 2]\n\nলব অংশে:\n2^(n+4) = 2^n · 2^4 = 16 · 2^n\n4 · 2^(n+1) = 2^2 · 2^n · 2^1 = 2^n · 2^3 = 8 · 2^n\n\nহর অংশে:\n2^(n+2) ÷ 2 = 2^(n+2 - 1) = 2^(n+1) = 2^n · 2^1 = 2 · 2^n\n\nসুতরাং,\n= [16 · 2^n - 8 · 2^n] / [2 · 2^n]\n= [2^n · (16 - 8)] / [2^n · 2]\n= 8 / 2\n= 4 (Ans).`,
                      2
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  {copiedType === 2 ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedType === 2 ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : isBn ? 'উত্তর কপি করো' : 'Copy Solution'}</span>
                </button>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'পরীক্ষকের ধাপে ধাপে নম্বর বণ্টন ও মডেল উত্তর:' : 'Step-by-Step Marking Rubric & Model Answer:'}
                </h4>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ১: লবের পদগুলোকে ২ এর ঘাতে ভাঙানো</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>
                        <RenderMathText text="$\text{লব} = 2^{n+4} - 4 \cdot 2^{n+1}$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$= 2^n \cdot 2^4 - 2^2 \cdot 2^{n+1}$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$= 16 \cdot 2^n - 2^{n+1+2} = 16 \cdot 2^n - 2^{n+3} = 16 \cdot 2^n - 8 \cdot 2^n$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ২: হরের ভাগের সূচকীয় সরলীকরণ</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>
                        <RenderMathText text="$\text{হর} = 2^{n+2} \div 2 = \frac{2^{n+2}}{2^1}$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$= 2^{(n+2) - 1} = 2^{n+1} = 2^n \cdot 2^1 = 2 \cdot 2^n$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ৩: লব ও হর হতে 2ⁿ কমন নেওয়া</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>সম্পূর্ণ ভগ্নাংশটি সাজিয়ে পাই,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$= \frac{16 \cdot 2^n - 8 \cdot 2^n}{2 \cdot 2^n} = \frac{2^n (16 - 8)}{2^n \cdot 2}$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ৪: 2ⁿ বর্জন ও চূড়ান্ত উত্তর নির্ধারণ</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p className="font-mono pl-4">
                        <RenderMathText text="$= \frac{16 - 8}{2} = \frac{8}{2} = 4$" />
                      </p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                        <RenderMathText text="$\text{উত্তর: } 4$" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Model Solution 3 */}
          {activeSolutionType === 3 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <span className="inline-block rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 text-xs mb-1">
                    {isBn ? 'কুমিল্লা ২০২০, সিলেট ২০২২, বরিশাল ২০২৩' : 'Cumilla 2020, Sylhet 2022, Barishal 2023'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {isBn ? 'প্রশ্ন (গ অংশ — ৪ নম্বর):' : 'Question (Part গ — 4 Marks):'}
                  </h3>
                  <div className="text-sm font-medium text-primary mt-1">
                    <RenderMathText text="যদি $\frac{\log_k a}{y-z} = \frac{\log_k b}{z-x} = \frac{\log_k c}{x-y}$ হয়, তবে প্রমাণ করো যে, $a^{y+z} \cdot b^{z+x} \cdot c^{x+y} = 1$।" />
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `ধরি, [log_k a] / (y - z) = [log_k b] / (z - x) = [log_k c] / (x - y) = m\n\nতাহলে:\nlog_k a = m(y - z)\nউভয়পক্ষকে (y + z) দ্বারা গুণ করে পাই:\n(y + z) log_k a = m(y - z)(y + z)\nবা, log_k a^(y + z) = m(y^2 - z^2) ... (i)\n\nঅনুরূপভাবে:\nlog_k b^(z + x) = m(z^2 - x^2) ... (ii)\nlog_k c^(x + y) = m(x^2 - y^2) ... (iii)\n\n(i) + (ii) + (iii) যোগ করে পাই:\nlog_k a^(y+z) + log_k b^(z+x) + log_k c^(x+y) = m[(y^2 - z^2) + (z^2 - x^2) + (x^2 - y^2)]\nবা, log_k [a^(y+z) · b^(z+x) · c^(x+y)] = m · 0 = 0\nবা, a^(y+z) · b^(z+x) · c^(x+y) = k^0  [লগের সংজ্ঞা অনুসারে]\nবা, a^(y+z) · b^(z+x) · c^(x+y) = 1 [যেহেতু k^0 = 1]\n\nঅতএব, a^(y+z) · b^(z+x) · c^(x+y) = 1 (প্রমাণিত)।`,
                      3
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  {copiedType === 3 ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedType === 3 ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : isBn ? 'উত্তর কপি করো' : 'Copy Solution'}</span>
                </button>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'পরীক্ষকের ধাপে ধাপে নম্বর বণ্টন ও মডেল উত্তর:' : 'Step-by-Step Marking Rubric & Model Answer:'}
                </h4>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ১: অনুপাত ধ্রুবক m ধরে পৃথক সম্পর্ক নির্ণয়</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>
                        <RenderMathText text="ধরি, $\frac{\log_k a}{y-z} = \frac{\log_k b}{z-x} = \frac{\log_k c}{x-y} = m$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\implies \log_k a = m(y-z), \quad \log_k b = m(z-x), \quad \log_k c = m(x-y)$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ২: ঘাত সমীকরণে রূপান্তর ও গুণ</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>প্রথম সম্পর্কের উভয়পক্ষকে <RenderMathText text="$(y+z)$" /> দ্বারা গুণ করে পাই,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$(y+z) \log_k a = m(y-z)(y+z)$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\implies \log_k a^{y+z} = m(y^2 - z^2) \quad \dots (i)$" />
                      </p>
                      <p>অনুরূপভাবে,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\log_k b^{z+x} = m(z^2 - x^2) \quad \dots (ii)$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\log_k c^{x+y} = m(x^2 - y^2) \quad \dots (iii)$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ৩: সমীকরণত্রয় যোগ ও লগের গুণের সূত্র প্রয়োগ</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>(i), (ii) ও (iii) নং সমীকরণ যোগ করে পাই,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\log_k a^{y+z} + \log_k b^{z+x} + \log_k c^{x+y} = m[(y^2 - z^2) + (z^2 - x^2) + (x^2 - y^2)]$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\implies \log_k [a^{y+z} \cdot b^{z+x} \cdot c^{x+y}] = m \cdot 0 = 0$" />
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary">ধাপ ৪: সূচকীয় রূপান্তর ও চূড়ান্ত সিদ্ধান্ত</span>
                      <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">[প্রাপ্ত নম্বর: ১]</span>
                    </div>
                    <div className="text-xs sm:text-sm text-foreground space-y-1">
                      <p>লগারিদমের মৌলিক সংজ্ঞা অনুসারে,</p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\log_k [a^{y+z} \cdot b^{z+x} \cdot c^{x+y}] = 0 \implies a^{y+z} \cdot b^{z+x} \cdot c^{x+y} = k^0$" />
                      </p>
                      <p className="font-mono pl-4">
                        <RenderMathText text="$\implies a^{y+z} \cdot b^{z+x} \cdot c^{x+y} = 1 \quad [\because k^0 = 1]$" />
                      </p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                        <RenderMathText text="$\therefore a^{y+z} \cdot b^{z+x} \cdot c^{x+y} = 1$ (প্রমাণিত / Proved)" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pillar 4: Examiner Traps */}
      {activeSection === 'traps' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>{isBn ? 'এসএসসি পরীক্ষকের গোপন সতর্কতা: যেসব মারাত্মক ভুলে নম্বর কাটা যায়' : 'Examiner Traps & Common Mistakes'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'অধ্যায় ৪ এর সূচক ও লগারিদমে ছাত্র-ছাত্রীরা খুব সাধারণ কিন্তু মারাত্মক কিছু ভুল করে থাকে। নিচের ৫টি ফাঁদ থেকে নিজেকে সতর্ক রাখলে তোমার ১০ এ ১০ পাওয়া নিশ্চিত:'
                : 'Avoid these top 5 fatal mistakes in SSC Board exams to secure full 10/10 marks.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Trap 1 */}
              <div className="p-4 rounded-xl bg-card border border-destructive/30 space-y-2">
                <span className="inline-block px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-bold">
                  ফাঁদ ১: <RenderMathText text="$a^0 = 1$" /> এর শর্ত না লেখা
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  পরীক্ষায় <RenderMathText text="$a^0 = 1$" /> প্রমাণ বা ব্যবহার করার সময় পাশে <RenderMathText text="$(a \neq 0)$" /> সাইডনোট না দিলে ১ নম্বর কেটে রাখা হয়! কারণ <RenderMathText text="$0^0$" /> একটি অনির্ণেয় (indeterminate) রাশি।
                </p>
              </div>

              {/* Trap 2 */}
              <div className="p-4 rounded-xl bg-card border border-destructive/30 space-y-2">
                <span className="inline-block px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-bold">
                  ফাঁদ ২: <RenderMathText text="$\log(a+b) \neq \log a + \log b$" /> ভুল ধারণা
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  অনেক শিক্ষার্থী বীজগণিতের বণ্টনের মতো <RenderMathText text="$\log(a+b)$" /> কে <RenderMathText text="$\log a + \log b$" /> লিখে ফেলে! মনে রাখবে: <RenderMathText text="$\log(ab) = \log a + \log b$" />, কিন্তু <RenderMathText text="$\log(a+b)$" /> কে কোনো সূত্রে ভাঙানো যায় না।
                </p>
              </div>

              {/* Trap 3 */}
              <div className="p-4 rounded-xl bg-card border border-destructive/30 space-y-2">
                <span className="inline-block px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-bold">
                  ফাঁদ ৩: ঋণাত্মক লগের পূর্ণক ও অংশক রূপান্তর ভুল
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  যদি ক্যালকুলেটরে <RenderMathText text="$\log x = -3.45$" /> আসে, অনেকে লিখে দেয় পূর্ণক <RenderMathText text="$-3$" /> এবং অংশক <RenderMathText text="$-0.45$" />। এটা সম্পূর্ণ ভুল! অংশক কখনো ঋণাত্মক হতে পারে না। সঠিক উত্তর: পূর্ণক <RenderMathText text="$-4 = \bar{4}$" /> এবং অংশক <RenderMathText text="$1 - 0.45 = 0.55$" />।
                </p>
              </div>

              {/* Trap 4 */}
              <div className="p-4 rounded-xl bg-card border border-destructive/30 space-y-2">
                <span className="inline-block px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-bold">
                  ফাঁদ ৪: <RenderMathText text="$2^{n+2} \div 2$" /> সরলীকরণে ব্র্যাকেট বিভ্রান্তি
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  হরের ক্ষেত্রে <RenderMathText text="$2^{n+2} \div 2 = 2^{(n+2) - 1} = 2^{n+1}$" /> হয়। কিন্তু অনেকে ভুল করে <RenderMathText text="$2^{(n+2)/2} = 2^{n/2 + 1}$" /> লিখে পুরো অঙ্ক শূন্য পায়।
                </p>
              </div>

              {/* Trap 5 */}
              <div className="p-4 rounded-xl bg-card border border-destructive/30 space-y-2 md:col-span-2">
                <span className="inline-block px-2 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-bold">
                  ফাঁদ ৫: লগের ভিত্তির অস্তিত্বের শর্ত বাদ দেওয়া
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <RenderMathText text="$\log_a N$" /> সংজ্ঞায়িত হওয়ার জন্য দুটি অত্যাবশ্যকীয় শর্ত রয়েছে: <RenderMathText text="$a > 0, a \neq 1$" /> এবং <RenderMathText text="$N > 0$" />। ঋণাত্মক সংখ্যা বা শূন্যের কোনো বাস্তব লগারিদম নেই। ভিত্তি কখনো ১ হতে পারে না কারণ <RenderMathText text="$1^x = 1$" /> (কোনো অনন্য সমাধান নেই)।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pillar 5: 5-Year Board Matrix */}
      {activeSection === 'board_matrix' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? 'বিগত ৫ বছরের বোর্ড পরীক্ষার প্রশ্ন বিশ্লেষণ (২০১৯–২০২৪)' : '5-Year SSC Board Question Trends'}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'বাংলাদেশের ৯টি সাধারণ শিক্ষা বোর্ডের বিগত বছরগুলোর প্রশ্নপত্র বিশ্লেষণ করে দেখা গেছে যে নিচে উল্লেখিত ৪টি টাইপের প্রশ্নই বারবার ঘুরিয়ে-ফিরিয়ে আসছে:'
                : 'Historical trend analysis across all 9 General Education Boards in Bangladesh.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="p-3 font-bold">{isBn ? 'প্রশ্ন প্যাটার্ন / টাইপ' : 'CQ Pattern'}</th>
                    <th className="p-3 font-bold">{isBn ? 'সম্পর্কিত অধ্যায় অনুচ্ছেদ' : 'NCTB Section'}</th>
                    <th className="p-3 font-bold">{isBn ? 'বোর্ড আসার পুনরাবৃত্তি হার' : 'Board Recurrence'}</th>
                    <th className="p-3 font-bold">{isBn ? 'আদর্শ বোর্ড উদাহরণ' : 'Notable Boards'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">
                      <RenderMathText text="$p^a = q, q^b = r, r^c = p \implies abc = 1$ বা সমমানের প্রমাণ" />
                    </td>
                    <td className="p-3 text-muted-foreground">অনুশীলনী ৪.১ (প্রশ্ন ১৮, ১৯)</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        ৯৫% (অতি গুরুত্বপূর্ণ)
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">ঢাকা ২০, রাজশাহী ২২, চট্টগ্রাম ২৩, দিনাজপুর ২৪</td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">
                      <RenderMathText text="$\frac{2^{n+4} - 4 \cdot 2^{n+1}}{2^{n+2} \div 2}$ বা ৩ এর ঘাতে ভগ্নাংশ সরল" />
                    </td>
                    <td className="p-3 text-muted-foreground">অনুশীলনী ৪.১ (প্রশ্ন ৭, ৮)</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        ৯০% (নিয়মিত খ অংশ)
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">যশোর ২১, কুমিল্লা ২২, ময়মনসিংহ ২৪</td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">
                      <RenderMathText text="$\frac{\log_k a}{y-z} = \dots \implies a^{y+z} b^{z+x} c^{x+y} = 1$" />
                    </td>
                    <td className="p-3 text-muted-foreground">অনুশীলনী ৪.২ (প্রশ্ন ৫ গ)</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                        ৮৫% (গ অংশে প্রায় প্রতিবার)
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">ঢাকা ২১, বরিশাল ২২, সিলেট ২৩, রাজশাহী ২৪</td>
                  </tr>
                  <tr className="hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">
                      দশমিক সংখ্যার পূর্ণক ও অংশক নির্ণয় বা বৈজ্ঞানিক রূপ
                    </td>
                    <td className="p-3 text-muted-foreground">অনুশীলনী ৪.৩</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                        ৭৫% (ক অংশ বা MCQ)
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">সকল বোর্ড ক অংশে ও MCQ পরীক্ষায়</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
