'use client';

import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Lightbulb,
  Award,
  Flame,
} from 'lucide-react';
import { Step4BoardTrapsData } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface StepBoardTrapsProps {
  data: Step4BoardTrapsData;
}

export function StepBoardTraps({ data }: StepBoardTrapsProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <ShieldAlert className="size-3.5" />
          <span>{isBn ? 'ধাপ ৪: রেড লাইন বোর্ড ট্র্যাপ' : 'Step 4: "Red Line" Board Traps'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {isBn ? 'যেসব অসতর্ক ভুলে বোর্ড পরীক্ষক নম্বর কাটেন' : 'Examiner Deduction Traps & Score Recovery'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {isBn
            ? 'অধিকাংশ শিক্ষার্থী বিষয় জেনেও ১-৩ নম্বর হারায় ছোটখাটো ভুলের কারণে। নিচে বোর্ড পরীক্ষকদের আসল খাতা মূল্যায়নের অভিজ্ঞতা থেকে সংগৃহীত মারাত্মক ফাঁদগুলো তুলে ধরা হলো।'
            : 'Most students lose 1-3 critical marks not due to lack of study, but subtle traps. Here is the examiner playbook to avoid standard deductions.'}
        </p>
      </div>

      {/* Traps List */}
      <div className="space-y-6">
        {data.traps.map((trap, idx) => (
          <Card
            key={trap.id || idx}
            className="overflow-hidden border-border/80 bg-card shadow-sm hover:border-rose-500/30 transition-all"
          >
            {/* Top Trap Header Strip */}
            <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-sm font-bold flex items-center justify-center shrink-0">
                  {isBn ? toBengaliNumber(idx + 1) : idx + 1}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    {isBn ? trap.titleBn : trap.titleEn}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {trap.frequentlyTestedIn}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge
                  variant="destructive"
                  className="gap-1.5 text-xs font-semibold py-1 px-2.5 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Flame className="size-3" />
                  <span>
                    {isBn
                      ? `-${toBengaliNumber(trap.lostMarks)} নম্বর কর্তন ঝুঁকি`
                      : `-${trap.lostMarks} Marks Risk`}
                  </span>
                </Badge>
              </div>
            </div>

            {/* Trap Comparison Grid */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* The Common Mistake */}
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <XCircle className="size-4 shrink-0" />
                    <span>{isBn ? 'সচরাচর ভুল (শিক্ষার্থীরা যা করে)' : 'Common Mistake (Deduction)'}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                    <RenderMathText
                      text={isBn ? trap.commonMistakeBn : trap.commonMistakeEn}
                    />
                  </div>
                </div>

                {/* The Correct Approach */}
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{isBn ? 'সঠিক পদ্ধতি (বোর্ড রুব্রিক মানদণ্ড)' : 'Correct Approach (Board Standard)'}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                    <RenderMathText
                      text={isBn ? trap.correctApproachBn : trap.correctApproachEn}
                    />
                  </div>
                </div>
              </div>

              {/* Examiner Secret Tip */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <Lightbulb className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {isBn ? 'বোর্ড পরীক্ষকের অভ্যন্তরীণ পরামর্শ' : 'Examiner Insider Secret'}
                  </h5>
                  <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    <RenderMathText
                      text={isBn ? trap.examinerSecretTipBn : trap.examinerSecretTipEn}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
