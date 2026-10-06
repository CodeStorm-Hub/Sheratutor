'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface StepNavFooterProps {
  currentStep: number;
  totalSteps?: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpToStep: (step: number) => void;
  isCompleted?: boolean;
}

const STEP_NAMES = [
  { bn: 'কনসেপ্ট ট্রি', en: 'Concepts' },
  { bn: 'স্যান্ডবক্স', en: 'Sandbox' },
  { bn: 'সূত্র ডিকোডার', en: 'Formula' },
  { bn: 'বোর্ড ট্র্যাপ', en: 'Traps' },
  { bn: 'কুইজ', en: 'Quiz' },
];

export function StepNavFooter({
  currentStep,
  totalSteps = 5,
  onPrev,
  onNext,
  onJumpToStep,
  isCompleted = false,
}: StepNavFooterProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="sticky bottom-0 z-20 mt-10 border-t border-border/80 bg-background/90 backdrop-blur-md px-4 py-3.5 sm:px-6 flex items-center justify-between gap-3 shadow-sm rounded-xl">
      {/* Prev button */}
      <div>
        {currentStep > 1 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            className="gap-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-surface-2"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">
              {isBn ? 'পূর্ববর্তী ধাপ' : 'Previous Step'}
            </span>
            <span className="sm:hidden">
              {isBn ? 'পূর্ববর্তী' : 'Prev'}
            </span>
          </Button>
        ) : (
          <div className="w-20 sm:w-28" />
        )}
      </div>

      {/* Step Pills indicator */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isPast = stepNum < currentStep;

          return (
            <button
              key={stepNum}
              onClick={() => onJumpToStep(stepNum)}
              title={isBn ? STEP_NAMES[idx].bn : STEP_NAMES[idx].en}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105'
                  : isPast
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {isPast ? (
                <CheckCircle2 className="size-3 text-emerald-500" />
              ) : (
                <span className="font-mono text-[11px]">
                  {isBn ? toBengaliNumber(stepNum) : stepNum}
                </span>
              )}
              <span className="hidden md:inline text-[11px]">
                {isBn ? STEP_NAMES[idx].bn : STEP_NAMES[idx].en}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next / Finish button */}
      <div>
        {currentStep < totalSteps ? (
          <Button
            variant="default"
            size="sm"
            onClick={onNext}
            className="gap-2 rounded-xl text-xs sm:text-sm font-medium shadow-sm shadow-primary/20"
          >
            <span className="hidden sm:inline">
              {isBn ? 'পরবর্তী ধাপ' : 'Next Step'}
            </span>
            <span className="sm:hidden">
              {isBn ? 'পরবর্তী' : 'Next'}
            </span>
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            variant={isCompleted ? 'outline' : 'default'}
            size="sm"
            onClick={onNext}
            className="gap-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
          >
            <CheckCircle2 className="size-4" />
            <span>{isBn ? 'অধ্যায় সম্পূর্ণ' : 'Finish Chapter'}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
