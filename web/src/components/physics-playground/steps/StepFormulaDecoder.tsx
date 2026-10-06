'use client';

import React from 'react';
import {
  Sigma,
  FileCheck2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calculator,
} from 'lucide-react';
import { Step3FormulaDecoderData } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface StepFormulaDecoderProps {
  data: Step3FormulaDecoderData;
}

export function StepFormulaDecoder({ data }: StepFormulaDecoderProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
          <Sigma className="size-3.5" />
          <span>{isBn ? 'ধাপ ৩: সূত্র ও প্যাটার্ন ডিকোডার' : 'Step 3: Formula & Pattern Decoder'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {isBn ? 'সূত্রের প্রতিপাদন, চলকের পরিচয় ও গাণিতিক সমাধান' : 'Mathematical Derivations & Variable Analysis'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {isBn
            ? 'মুখস্থ না করে সূত্রের পেছনের যৌক্তিক বিন্যাস বোঝো। প্রতিটি চিহ্নের এসআই (SI) একক ও বোর্ড সৃজনশীলের মান বণ্টনসহ।'
            : 'Understand the physical origin behind the equations, variable definitions with SI units, and step-by-step board exam problem breakdowns.'}
        </p>
      </div>

      {/* Hero Core Formula Card */}
      <Card className="border-border/80 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {isBn ? 'মূল সমীকরণ (Core Formula)' : 'Core Governing Equation'}
            </span>
            <Badge variant="secondary" className="font-mono text-xs">
              NCTB SSC Standard
            </Badge>
          </div>

          <div className="py-4 text-center text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-foreground overflow-x-auto scrollbar-none">
            <RenderMathText text={`$$${data.coreFormulaLatex}$$`} inline={false} />
          </div>
        </div>
      </Card>

      {/* Variable Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Calculator className="size-4 text-primary" />
            <span>{isBn ? 'চলক ও এসআই (SI) এককের তালিকা' : 'Variable Breakdown & SI Units'}</span>
          </h3>
          <span className="text-xs text-muted-foreground">
            {isBn ? 'একক না লিখলে বোর্ডে নম্বর কাটা যায়' : 'Units carry essential board marks'}
          </span>
        </div>

        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-2 text-muted-foreground font-semibold border-b border-border/80 text-[11px] sm:text-xs">
                <tr>
                  <th className="py-3 px-4 w-24">{isBn ? 'প্রতীক' : 'Symbol'}</th>
                  <th className="py-3 px-4">{isBn ? 'রাশির নাম (বাংলা)' : 'Variable Name (Bangla)'}</th>
                  <th className="py-3 px-4">{isBn ? 'ইংরেজি নাম' : 'English Name'}</th>
                  <th className="py-3 px-4 w-32">{isBn ? 'এসআই (SI) একক' : 'SI Unit'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.variableDefinitions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-1/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <RenderMathText text={`$${item.symbol}$`} inline />
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {item.nameBn}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {item.nameEn}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      <RenderMathText text={`$${item.siUnit}$`} inline />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Step-by-Step Derivation */}
      {data.derivationSteps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <span>{isBn ? 'ধাপে ধাপে সূত্রের প্রতিপাদন' : 'Step-by-Step Derivation Logic'}</span>
          </h3>

          <div className="space-y-3">
            {data.derivationSteps.map((step) => (
              <Card
                key={step.stepNumber}
                className="p-5 border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {isBn ? toBengaliNumber(step.stepNumber) : step.stepNumber}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      {isBn ? step.labelBn : step.labelEn}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                    {isBn ? step.explanationBn : step.explanationEn}
                  </p>
                </div>

                <div className="w-full md:w-auto md:min-w-[200px] text-right font-mono text-sm sm:text-base font-bold bg-surface-2/80 px-4 py-2.5 rounded-xl border border-border/60">
                  <RenderMathText text={`$${step.latexExpression}$`} inline />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Practical Calculation Example (CQ Model) */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
          <FileCheck2 className="size-4 text-blue-500" />
          <span>{isBn ? 'বোর্ড সৃজনশীল (CQ) প্রয়োগমূলক সমাধান' : 'Standard Board CQ Calculation Problem'}</span>
        </h3>

        <Card className="border-border/80 bg-card p-6 space-y-5">
          {/* Problem Statement */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs">
              <HelpCircle className="size-3.5" />
              <span>{isBn ? 'সমস্যা বিবৃতি (উদ্দীপক ও প্রশ্ন)' : 'Problem Statement (Stimulus & Question)'}</span>
            </div>
            <div className="text-xs sm:text-sm text-foreground leading-relaxed">
              <RenderMathText
                text={isBn ? data.practicalCalculationExample.problemBn : data.practicalCalculationExample.problemEn}
              />
            </div>
          </div>

          {/* Solution Steps */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {isBn ? 'সঠিক সমাধান প্রণালী (ধাপে ধাপে)' : 'Step-by-Step Board Solution'}
            </span>
            <div className="space-y-2">
              {(isBn
                ? data.practicalCalculationExample.solutionStepsBn
                : data.practicalCalculationExample.solutionStepsEn
              ).map((solStep, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-1/50 border border-border/50 text-xs sm:text-sm leading-relaxed"
                >
                  <ArrowRight className="size-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <RenderMathText text={solStep} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Answer Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{isBn ? 'চূড়ান্ত উত্তর (এককসহ):' : 'Final Answer (with unit):'}</span>
            </div>
            <div className="font-mono text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              <RenderMathText text={`$${data.practicalCalculationExample.finalAnswerWithUnit}$`} inline />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
