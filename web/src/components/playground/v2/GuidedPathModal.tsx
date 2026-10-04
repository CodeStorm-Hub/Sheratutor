'use client';

import React, { useEffect } from 'react';
import {
  X,
  Compass,
  BookOpen,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GuidedPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStage: (stage: 'orient' | 'understand' | 'practice' | 'check') => void;
}

export function GuidedPathModal({ isOpen, onClose, onSelectStage }: GuidedPathModalProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stages = [
    {
      id: 'orient' as const,
      num: '১',
      titleBn: 'শুরু করো (Orient)',
      titleEn: 'Start & Orient',
      descBn: 'অধ্যায়ের মূল উদ্দেশ্য ও বোর্ড পরীক্ষার মান বণ্টন জেনে নাও।',
      descEn: 'Understand what you will learn and its SSC board exam weight.',
      icon: Compass,
      targetId: 'guidebook-cover',
      color: 'text-primary bg-primary/10 border-primary/30',
    },
    {
      id: 'understand' as const,
      num: '২',
      titleBn: 'বুঝে নাও (Understand)',
      titleEn: 'Understand Concepts',
      descBn: 'সংখ্যার মহাবিশ্ব ট্রি ও √২ এর অমূলদ প্রমাণের গোয়েন্দা কাহিনী।',
      descEn: 'Explore the number classification map and √2 proof detective.',
      icon: BookOpen,
      targetId: 'lesson-01',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
    },
    {
      id: 'practice' as const,
      num: '৩',
      titleBn: 'নিজে করো (Practice)',
      titleEn: 'Hands-on Practice',
      descBn: 'আবৃত্ত দশমিক লাইভ ক্যালকুলেটর ও রেড লাইন পদ্ধতি পরীক্ষা করো।',
      descEn: 'Use the 9-0 rule calculator and visual red-line alignment.',
      icon: Sliders,
      targetId: 'lesson-03',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'check' as const,
      num: '৪',
      titleBn: 'যাচাই করো (Self-Check)',
      titleEn: 'Board Self-Check',
      descBn: 'বোর্ড পরীক্ষার বিগত বছরের দুটি আসল প্রশ্ন দিয়ে নিজেকে যাচাই করো।',
      descEn: 'Test your understanding with 2 authentic SSC board retrieval questions.',
      icon: CheckCircle2,
      targetId: 'lesson-05',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {isBn ? 'গাইডেড শিখন পথ (Learning Path)' : 'Guided Learning Path'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBn ? 'তোমার পছন্দমতো ধাপে ঝাঁপ দাও' : 'Choose a stage to begin studying'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 4 Stages List */}
        <div className="space-y-3">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  onSelectStage(stage.id);
                  onClose();
                  const el = document.getElementById(stage.targetId);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    el.classList.add('ring-2', 'ring-primary', 'transition-all');
                    setTimeout(() => el.classList.remove('ring-2', 'ring-primary'), 2000);
                  }
                }}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-border/70 hover:border-primary/50 bg-muted/30 hover:bg-muted/60 text-left transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${stage.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>{isBn ? stage.titleBn : stage.titleEn}</span>
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {isBn ? stage.descBn : stage.descEn}
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="pt-2 text-center">
          <span className="text-[11px] text-muted-foreground">
            {isBn
              ? '💡 টিপস: তুমি যেকোনো সময় অধ্যায়ের বাম পাশের সূচিপত্র থেকেও পাঠ নির্বাচন করতে পারবে।'
              : '💡 Tip: You can also use the left chapter rail table of contents anytime.'}
          </span>
        </div>
      </div>
    </div>
  );
}
