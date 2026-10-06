'use client';

import React, { useState, useMemo } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Atom,
  BatteryCharging,
  Compass,
  Droplets,
  Flame,
  Gauge,
  Glasses,
  Hammer,
  HeartPulse,
  Search,
  Sparkles,
  Sun,
  Waves,
  Zap,
  Clock,
  BookOpen,
  Filter,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { PHYSICS_CHAPTERS_REGISTRY } from '@/lib/physics-playground/registry';
import { PhysicsChapterMetadata, PhysicsDivision } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function toBengaliNumber(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

const ICON_MAP: Record<string, LucideIcon> = {
  Gauge,
  Activity,
  Hammer,
  Zap,
  Droplets,
  Flame,
  Waves,
  Sun,
  Glasses,
  Atom,
  BatteryCharging,
  Compass,
  Sparkles,
  HeartPulse,
};

const DIVISION_COLORS: Record<PhysicsDivision, { badge: string; border: string; glow: string; text: string }> = {
  mechanics: {
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    border: 'hover:border-blue-500/40',
    glow: 'group-hover:from-blue-500/5',
    text: 'text-blue-500',
  },
  matter_thermal: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    border: 'hover:border-amber-500/40',
    glow: 'group-hover:from-amber-500/5',
    text: 'text-amber-500',
  },
  waves_optics: {
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50',
    border: 'hover:border-cyan-500/40',
    glow: 'group-hover:from-cyan-500/5',
    text: 'text-cyan-500',
  },
  electricity_magnetism: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    border: 'hover:border-emerald-500/40',
    glow: 'group-hover:from-emerald-500/5',
    text: 'text-emerald-500',
  },
  modern_biomedical: {
    badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900/50',
    border: 'hover:border-violet-500/40',
    glow: 'group-hover:from-violet-500/5',
    text: 'text-violet-500',
  },
};

export function PhysicsCatalogView() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<PhysicsDivision | 'all'>('all');

  const divisions = useMemo<{ id: PhysicsDivision | 'all'; titleBn: string; titleEn: string }[]>(() => [
    { id: 'all', titleBn: 'সকল অধ্যায়', titleEn: 'All Chapters' },
    { id: 'mechanics', titleBn: 'পরিমাপ ও মেকানিক্স (অধ্যায় ১-৫)', titleEn: 'Mechanics (Ch 1-5)' },
    { id: 'matter_thermal', titleBn: 'পদার্থ ও তাপ (অধ্যায় ৬-৭)', titleEn: 'Matter & Thermal (Ch 6-7)' },
    { id: 'waves_optics', titleBn: 'তরঙ্গ ও আলো (অধ্যায় ৮-৯)', titleEn: 'Waves & Optics (Ch 8-9)' },
    { id: 'electricity_magnetism', titleBn: 'বিদ্যুৎ ও চুম্বক (অধ্যায় ১০-১২)', titleEn: 'Electricity (Ch 10-12)' },
    { id: 'modern_biomedical', titleBn: 'আধুনিক পদার্থবিজ্ঞান (অধ্যায় ১৩-১৪)', titleEn: 'Modern Physics (Ch 13-14)' },
  ], []);

  const filteredChapters = useMemo(() => {
    return PHYSICS_CHAPTERS_REGISTRY.filter((chapter) => {
      const matchesDivision = selectedDivision === 'all' || chapter.division === selectedDivision;
      if (!matchesDivision) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const numMatch = String(chapter.chapterNo).includes(q) || toBengaliNumber(chapter.chapterNo).includes(q);
      const titleMatch =
        chapter.titleBn.toLowerCase().includes(q) ||
        chapter.titleEn.toLowerCase().includes(q) ||
        chapter.overviewBn.toLowerCase().includes(q) ||
        chapter.overviewEn.toLowerCase().includes(q);
      const topicMatch =
        chapter.keyTopicsBn.some((t) => t.toLowerCase().includes(q)) ||
        chapter.keyTopicsEn.some((t) => t.toLowerCase().includes(q));

      return numMatch || titleMatch || topicMatch;
    });
  }, [searchQuery, selectedDivision]);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="absolute -top-12 -right-12 size-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 size-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <Atom className="size-3.5 animate-spin-slow" />
              <span>{isBn ? 'NCTB পদার্থবিজ্ঞান · ৯ম-১০ম ও এসএসসি' : 'NCTB Physics · Class 9-10 & SSC'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              {isBn ? 'ইন্টারেক্টিভ পদার্থবিজ্ঞান ল্যাব' : 'Interactive Physics Laboratory'}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isBn
                ? 'বইয়ের রসকষহীন সূত্র মুখস্থ না করে সিমুলেটর দিয়ে হাতে-কলমে দেখো। কনসেপ্ট ট্রি, ফর্মুলা ডিকোডার ও বোর্ড এক্সামিনার ট্র্যাপসহ সম্পূর্ণ ১৪টি অধ্যায়।'
                : 'Move beyond dry formula memorization with hands-on visual sandboxes, concept hierarchies, formula decoders, and board examiner trap masteries.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                {isBn ? '১৪টি পূর্ণাঙ্গ অধ্যায়' : '14 Complete Chapters'}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs">
                <Sparkles className="size-3.5 text-amber-500" />
                {isBn ? 'সৃজনশীল (CQ) ও MCQ উপযোগী' : 'CQ & MCQ Board-Ready'}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs">
                <BookOpen className="size-3.5 text-blue-500" />
                {isBn ? '১০০% পাঠ্যবই কারিকুলাম' : '100% NCTB Curriculum'}
              </Badge>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-xl bg-background/60 border border-border/80 backdrop-blur-sm shadow-inner min-w-[200px] text-center">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 text-primary ring-4 ring-primary/5">
              <Atom className="size-8" />
            </div>
            <div className="text-2xl font-bold font-mono">
              {isBn ? '১৪ / ১৪' : '14 / 14'}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {isBn ? 'পাঠ্যবইয়ের অধ্যায়' : 'Textbook Chapters'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'অধ্যায়ের নাম, সূত্র বা বিষয় দিয়ে খুঁজুন...' : 'Search by chapter, formula or topic...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-muted"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1.5 self-end sm:self-center">
            <Filter className="size-3.5" />
            <span>
              {isBn
                ? `প্রদর্শিত: ${toBengaliNumber(filteredChapters.length)} টি অধ্যায়`
                : `Showing: ${filteredChapters.length} chapters`}
            </span>
          </div>
        </div>

        {/* Division Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {divisions.map((div) => {
            const isSelected = selectedDivision === div.id;
            return (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                    : 'bg-card/70 hover:bg-surface-2 text-muted-foreground hover:text-foreground border-border/80'
                }`}
              >
                {isBn ? div.titleBn : div.titleEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/30">
          <Atom className="size-10 mx-auto text-muted-foreground/60" />
          <h3 className="text-base font-semibold">
            {isBn ? 'কোনো অধ্যায় খুঁজে পাওয়া যায়নি' : 'No chapters found'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {isBn
              ? 'আপনার অনুসন্ধান শব্দ পরিবর্তন করুন অথবা ফিল্টার রিসেট করুন।'
              : 'Try searching with different terms or reset your division filter.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedDivision('all');
            }}
          >
            {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChapters.map((chapter) => {
            const Icon = ICON_MAP[chapter.iconName] || Atom;
            const styling = DIVISION_COLORS[chapter.division] || DIVISION_COLORS.mechanics;
            const isAvailable = chapter.status === 'available';

            return (
              <Card
                key={chapter.id}
                className={`group relative overflow-hidden flex flex-col justify-between border-border/80 bg-card hover:shadow-lg transition-all duration-300 ${styling.border}`}
              >
                {/* Background soft glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${styling.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />

                <div className="p-5 sm:p-6 space-y-4 relative z-10">
                  {/* Top Header: Chapter number + Division */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                        {isBn ? `অধ্যায় ${toBengaliNumber(chapter.chapterNo)}` : `CH ${String(chapter.chapterNo).padStart(2, '0')}`}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${styling.badge}`}>
                        {isBn ? chapter.divisionTitleBn : chapter.divisionTitleEn}
                      </span>
                    </div>

                    <div className="size-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:text-primary transition-all">
                      <Icon className="size-4.5" />
                    </div>
                  </div>

                  {/* Chapter Titles */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {isBn ? chapter.titleBn : chapter.titleEn}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground/80">
                      {isBn ? chapter.titleEn : chapter.titleBn}
                    </p>
                  </div>

                  {/* Overview */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {isBn ? chapter.overviewBn : chapter.overviewEn}
                  </p>

                  {/* Key Topic Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(isBn ? chapter.keyTopicsBn : chapter.keyTopicsEn).slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-surface-2 text-foreground/80 border border-border/60"
                      >
                        {topic}
                      </span>
                    ))}
                    {(isBn ? chapter.keyTopicsBn : chapter.keyTopicsEn).length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                        +{isBn ? toBengaliNumber((chapter.keyTopicsBn.length - 3)) : chapter.keyTopicsEn.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer / Meta & Action */}
                <div className="p-5 sm:p-6 pt-0 relative z-10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <span>{isBn ? `${toBengaliNumber(chapter.estimatedMinutes)} মিনিট` : `${chapter.estimatedMinutes} mins`}</span>
                    </div>
                    <div className="font-medium text-[11px] text-foreground/90 truncate max-w-[170px]" title={chapter.boardMarksAllocation}>
                      {chapter.boardMarksAllocation}
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/playground/physics/${chapter.chapterNo}` as Route}
                    className="block"
                  >
                    <Button
                      variant={isAvailable ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-between rounded-xl group/btn font-medium transition-all"
                    >
                      <span>
                        {isAvailable
                          ? isBn
                            ? 'ল্যাব ওপেন করুন'
                            : 'Enter Laboratory'
                          : isBn
                          ? 'শীঘ্রই আসছে'
                          : 'Coming Soon'}
                      </span>
                      <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
