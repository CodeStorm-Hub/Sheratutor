'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Star,
  Play,
  Flame,
  CheckCircle2,
  Layers,
  Compass,
  ArrowRight,
  BookOpen,
  Atom,
  FlaskConical,
  Calculator,
  Lock,
  Clock,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChapterCardData {
  chapterNo: number;
  titleBn: string;
  titleEn: string;
  category: 'algebra' | 'geometry' | 'trig' | 'mensuration' | 'stat';
  conceptSubtitleBn: string;
  conceptSubtitleEn: string;
  interactiveFeatureBn: string;
  interactiveFeatureEn: string;
  isPlayable: boolean;
  stars: number;
  totalQuests: number;
}

const GENERAL_MATH_CHAPTERS: ChapterCardData[] = [
  {
    chapterNo: 1,
    titleBn: 'বাস্তব সংখ্যা',
    titleEn: 'Real Numbers',
    category: 'algebra',
    conceptSubtitleBn: 'মূলদ, অমূলদ, পৌনঃপুনিক ও সংখ্যারেখা',
    conceptSubtitleEn: 'Rational, Irrational & Decimal Cycles',
    interactiveFeatureBn: 'পৌনঃপুনিকের এক্স-রে মেশিন, √২ জ্যামিতিক কাঁটা ও প্রাইম হান্টার',
    interactiveFeatureEn: 'Recurring Decimal Decoder, √2 Compass & Prime Sieve',
    isPlayable: true,
    stars: 3,
    totalQuests: 5,
  },
  {
    chapterNo: 2,
    titleBn: 'সেট ও ফাংশন',
    titleEn: 'Sets & Functions',
    category: 'algebra',
    conceptSubtitleBn: 'ভেনচিত্র, সংযোগ, ছেদ ও ফাংশনের রূপ',
    conceptSubtitleEn: 'Venn Island, Unions & One-to-One Machines',
    interactiveFeatureBn: 'ইন্টারেক্টিভ ভেনচিত্র দ্বীপ ও ফাংশন কনভেয়র বেল্ট',
    interactiveFeatureEn: 'Interactive Venn Island & Conveyor Belt',
    isPlayable: true,
    stars: 3,
    totalQuests: 5,
  },
  {
    chapterNo: 3,
    titleBn: 'বীজগাণিতিক রাশি',
    titleEn: 'Algebraic Expressions',
    category: 'algebra',
    conceptSubtitleBn: '(a+b)² সূত্রের জ্যামিতিক প্রমাণ, x+1/x পাওয়ার মই ও উৎপাদক',
    conceptSubtitleEn: 'Geometric Tile Proofs, x+1/x Power Ladder & Factoring',
    interactiveFeatureBn: 'জ্যামিতিক টাইল কাটার, x+1/x পাওয়ার মই ও ভ্যানিশিং মেথড',
    interactiveFeatureEn: 'Geometric Tile Slicer, x+1/x Power Ladder & Factor Splitter',
    isPlayable: true,
    stars: 3,
    totalQuests: 5,
  },
  {
    chapterNo: 4,
    titleBn: 'সূচক ও লগারিদম',
    titleEn: 'Exponents & Logarithms',
    category: 'algebra',
    conceptSubtitleBn: 'সূচকের মহাজাগতিক শক্তি ও লগের স্কেল সংকোচন',
    conceptSubtitleEn: 'Powers of 2 & Logarithmic Compression',
    interactiveFeatureBn: 'কাগজ ভাঁজ করে চাঁদে যাওয়ার সিমুলেটর, রিখটার স্কেল ও সমীকরণ তুলাদণ্ড',
    interactiveFeatureEn: 'Paper Fold to Moon, Richter Scale & Power Balancer',
    isPlayable: true,
    stars: 3,
    totalQuests: 5,
  },
  {
    chapterNo: 8,
    titleBn: 'বৃত্ত',
    titleEn: 'Circle Theorems',
    category: 'geometry',
    conceptSubtitleBn: 'উপপাদ্য ২০: কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ',
    conceptSubtitleEn: 'Central vs Inscribed Angles & Tangents',
    interactiveFeatureBn: 'লাইভ সার্কেল স্যান্ডবক্স ও কোণ পরিমাপক যন্ত্র',
    interactiveFeatureEn: 'Live Circle Sandbox & Theorem 20 Inspector',
    isPlayable: false,
    stars: 0,
    totalQuests: 4,
  },
  {
    chapterNo: 9,
    titleBn: 'ত্রিকোণমিতিক অনুপাত',
    titleEn: 'Trigonometric Ratios',
    category: 'trig',
    conceptSubtitleBn: 'sin, cos, tan এর ভিজ্যুয়াল একক বৃত্ত',
    conceptSubtitleEn: 'Unit Circle, Slope Stretcher & Triangle Ratios',
    interactiveFeatureBn: 'ঘূর্ণায়মান একক বৃত্ত ও পিথাগোরাসের জীবন্ত সমীকরণ',
    interactiveFeatureEn: 'Interactive Unit Circle & Slope Stretcher',
    isPlayable: false,
    stars: 0,
    totalQuests: 4,
  },
  {
    chapterNo: 10,
    titleBn: 'দূরত্ব ও উচ্চতা',
    titleEn: 'Distance & Elevation',
    category: 'trig',
    conceptSubtitleBn: 'উন্নতি ও অবনতি কোণ দিয়ে উচ্চতা মাপা',
    conceptSubtitleEn: 'Angles of Elevation & Depression',
    interactiveFeatureBn: 'পদ্মা সেতু ও স্মৃতিসৌধের ভার্চুয়াল লেজার সার্ভেয়ার',
    interactiveFeatureEn: 'Padma Bridge & Monument Laser Surveyor',
    isPlayable: false,
    stars: 0,
    totalQuests: 3,
  },
  {
    chapterNo: 13,
    titleBn: 'সসীম ধারা',
    titleEn: 'Finite Series',
    category: 'algebra',
    conceptSubtitleBn: 'সমান্তর ও গুণোত্তর ধারার সমষ্টির রহস্য',
    conceptSubtitleEn: 'Arithmetic & Geometric Sequences',
    interactiveFeatureBn: 'গাউসের সিঁড়ি নির্মাণ ও সূত্র আবিষ্কার',
    interactiveFeatureEn: "Gauss's Staircase Builder & Visual Sum",
    isPlayable: false,
    stars: 0,
    totalQuests: 3,
  },
  {
    chapterNo: 16,
    titleBn: 'পরিমিতি',
    titleEn: 'Mensuration',
    category: 'mensuration',
    conceptSubtitleBn: 'বেলন, কোণক ও গোলকের ত্রিমাত্রিক রহস্য',
    conceptSubtitleEn: '3D Cylinder, Cone & Surface Unfolding',
    interactiveFeatureBn: '3D সিলিন্ডার আনফোল্ডার ও ক্ষেত্রফল বিশ্লেষণ',
    interactiveFeatureEn: '3D Solid Peeler & Surface Area Unfolder',
    isPlayable: false,
    stars: 0,
    totalQuests: 4,
  },
  {
    chapterNo: 17,
    titleBn: 'পরিসংখ্যান',
    titleEn: 'Statistics',
    category: 'stat',
    conceptSubtitleBn: 'গড়, মধ্যক, প্রচুরক ও অজিব রেখা',
    conceptSubtitleEn: 'Mean, Median, Mode & Ogive Curves',
    interactiveFeatureBn: 'অডিও ইকুয়ালাইজার স্টাইল গণসংখ্যা স্লাইডার',
    interactiveFeatureEn: 'Live Frequency Equalizer & Dynamic Ogive Graph',
    isPlayable: false,
    stars: 0,
    totalQuests: 3,
  },
];

import { PLAYGROUND_CONFIG } from '@/lib/playground-config';
import { GuidebookLibraryView } from '@/components/playground/v2/GuidebookLibraryView';

export default function PlaygroundHubPage() {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [selectedSubject, setSelectedSubject] = useState<'MATH' | 'HMATH' | 'PHY' | 'CHEM'>('MATH');
  const [activeVersionTab, setActiveVersionTab] = useState<'v1' | 'v2'>(
    PLAYGROUND_CONFIG.mode === 'v2-only' ? 'v2' : 'v1'
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Version Switcher Tabs (when mode is 'dual') */}
        {PLAYGROUND_CONFIG.mode === 'dual' && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-primary/20 bg-card/60 p-2.5 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 px-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isBn ? 'সংস্করণ নির্বাচন:' : 'Choose Version:'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveVersionTab('v1')}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-extrabold transition-all ${
                  activeVersionTab === 'v1'
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Gamepad2 className="h-4 w-4" />
                <span>{isBn ? 'সংস্করণ ১: কোয়েস্ট অ্যারেনা' : 'Version 1: Quest Arena'}</span>
              </button>

              <button
                onClick={() => setActiveVersionTab('v2')}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-extrabold transition-all relative ${
                  activeVersionTab === 'v2'
                    ? 'bg-[#FF6B57] text-white shadow-md shadow-[#FF6B57]/25'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>{isBn ? 'সংস্করণ ২: ভার্চুয়াল গাইডবুক' : 'Version 2: Virtual Guidebook'}</span>
                <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-black text-black">
                  NEW
                </span>
              </button>
            </div>
          </div>
        )}

        {activeVersionTab === 'v2' ? (
          <GuidebookLibraryView />
        ) : (
          <div className="space-y-8">
            {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 sm:p-10 shadow-xl">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-cta/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Gamepad2 className="h-4 w-4 animate-bounce" />
                <span>{isBn ? 'ইন্টারেক্টিভ শিখন খেলার মাঠ' : 'Interactive Study Playground'}</span>
                <span className="rounded bg-primary px-1.5 py-0.2 text-[10px] text-primary-foreground font-bold">NEW</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                {isBn ? 'গণিত হোক খেলা, ' : 'Learn Without Memorizing, '}
                <span className="bg-gradient-to-r from-primary via-cta to-amber-500 bg-clip-text text-transparent">
                  {isBn ? 'মুখস্থ নয় বোঝা!' : 'Play with Real Math!'}
                </span>
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি (NCTB) পাঠ্যবইয়ের কঠিন উপপাদ্য ও সূত্রগুলো এখন সরাসরি হাত দিয়ে ছুঁয়ে দেখার সুযোগ। স্লাইডার টেনে, পয়েন্ট ঘুরিয়ে এবং চ্যালেঞ্জ জিতে গণিতের আসল জাদু আবিষ্কার করো।'
                  : 'Experience NCTB curriculum concepts through interactive simulations, sliders, and rapid formula challenges. No boring memorization—just intuitive discovery.'}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex flex-row md:flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Star className="h-5 w-5 fill-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{isBn ? 'অর্জিত স্টার' : 'Stars Earned'}</div>
                  <div className="text-lg font-bold text-foreground">3 / 48 ⭐</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Flame className="h-5 w-5 fill-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{isBn ? 'আজকের স্ট্রাইক' : 'Daily Streak'}</div>
                  <div className="text-lg font-bold text-foreground">{isBn ? '১ম দিন 🔥' : 'Day 1 🔥'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-4">
          <button
            onClick={() => setSelectedSubject('MATH')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              selectedSubject === 'MATH'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>{isBn ? 'সাধারণ গণিত (Class 9-10)' : 'General Math (9-10)'}</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
              {isBn ? 'চালু' : 'Active'}
            </span>
          </button>

          <button
            onClick={() => setSelectedSubject('HMATH')}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-muted/40 text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-all"
          >
            <Layers className="h-4 w-4" />
            <span>{isBn ? 'উচ্চতর গণিত' : 'Higher Math'}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {isBn ? 'শীঘ্রই' : 'Soon'}
            </span>
          </button>

          <button
            onClick={() => setSelectedSubject('PHY')}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-muted/40 text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-all"
          >
            <Atom className="h-4 w-4" />
            <span>{isBn ? 'পদার্থবিজ্ঞান' : 'Physics'}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {isBn ? 'শীঘ্রই' : 'Soon'}
            </span>
          </button>

          <button
            onClick={() => setSelectedSubject('CHEM')}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-muted/40 text-muted-foreground/70 hover:bg-muted hover:text-foreground transition-all"
          >
            <FlaskConical className="h-4 w-4" />
            <span>{isBn ? 'রসায়ন' : 'Chemistry'}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {isBn ? 'শীঘ্রই' : 'Soon'}
            </span>
          </button>
        </div>

        {/* Featured Chapter 1 Callout Banner */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-r from-primary/15 via-background to-amber-500/10 p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                  {isBn ? 'অধ্যায় ১ • ফিচার্ড' : 'Chapter 1 • Featured'}
                </span>
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isBn ? '১০০% প্লে-রেডি' : 'Playable Now'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {isBn ? 'বাস্তব সংখ্যা (Real Numbers) খেলার মাঠ' : 'Real Numbers Interactive Playground'}
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground">
                {isBn
                  ? 'সংখ্যার শ্রেণিবিন্যাস ড্র্যাগ অ্যান্ড ড্রপ ল্যাব, পৌনঃপুনিকের ৯ ও ০ আসার আসল এক্স-রে রহস্য, সংখ্যারেখায় √২ এর জ্যামিতিক কাঁটা এবং ৬০ সেকেন্ডের নাম্বার ডিটেকটিভ বস ফাইট!'
                  : 'Explore number classification tree, discover why recurring decimals create 9s and 0s, swing the geometric √2 compass on the number line, and play the 60s Boss Rush!'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <Link
                href="/dashboard/playground/math/1"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-cta px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-primary/50"
              >
                <Play className="h-5 w-5 fill-primary-foreground" />
                <span>{isBn ? 'এখনই খেলা শুরু করো' : 'Start Playing Now'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/playground/v2/math/1"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-background/80 hover:bg-primary/5 px-4 py-3.5 text-sm font-bold text-foreground transition-all shadow-xs"
              >
                <BookOpen className="h-4 w-4 text-[#FF6B57]" />
                <span>{isBn ? '📖 গাইডবুক (V2)' : '📖 Guidebook (V2)'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{isBn ? 'সাধারণ গণিত অধ্যায়সমূহ (NCTB Class 9-10)' : 'General Math Chapters'}</span>
            </h3>
            <span className="text-xs text-muted-foreground">
              {isBn ? 'মোট ১৭টি অধ্যায়' : '17 Total Chapters'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GENERAL_MATH_CHAPTERS.map((ch) => (
              <div
                key={ch.chapterNo}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  ch.isPlayable
                    ? 'border-primary/50 bg-card/90 shadow-md hover:border-primary hover:shadow-xl hover:-translate-y-0.5'
                    : 'border-border/40 bg-card/40 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
                      {isBn
                        ? ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][ch.chapterNo] || ch.chapterNo
                        : ch.chapterNo}
                    </span>
                    {ch.isPlayable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                        <Sparkles className="h-3 w-3" />
                        {isBn ? 'খেলুন' : 'Playable'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        {isBn ? 'নির্মাণাধীন' : 'In Dev'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-foreground">
                    {isBn ? ch.titleBn : ch.titleEn}
                  </h4>
                  <p className="text-xs font-medium text-primary/80 mt-0.5 mb-2">
                    {isBn ? ch.conceptSubtitleBn : ch.conceptSubtitleEn}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {isBn ? ch.interactiveFeatureBn : ch.interactiveFeatureEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <Star className={`h-3.5 w-3.5 ${ch.stars > 0 ? 'fill-amber-500' : 'text-muted-foreground/40'}`} />
                    <span>{ch.stars > 0 ? `${ch.stars}/3` : '0/3'}</span>
                  </div>

                  {ch.isPlayable ? (
                    <Link
                      href={`/dashboard/playground/math/${ch.chapterNo}` as any}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                    >
                      <span>{isBn ? 'প্রবেশ করুন' : 'Launch'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic">
                      {isBn ? 'শীঘ্রই আসছে' : 'Coming next'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
      </div>
    </div>
  );
}
