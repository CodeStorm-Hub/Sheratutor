'use client';

import React, { useState, useEffect } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Sparkles,
  BookOpen,
  Atom,
  HelpCircle,
  Menu,
  X,
  Share2,
  CheckCircle2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { PhysicsChapterFullData } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { ChapterContentsRail } from './ChapterContentsRail';
import { StepConceptTree } from './steps/StepConceptTree';
import { StepSimulationHost } from './steps/StepSimulationHost';
import { StepFormulaDecoder } from './steps/StepFormulaDecoder';
import { StepBoardTraps } from './steps/StepBoardTraps';
import { StepBoardQuiz } from './steps/StepBoardQuiz';
import { StepNavFooter } from './steps/StepNavFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toBengaliNumber } from './PhysicsCatalogView';

interface PhysicsGuidebookShellProps {
  chapterData: PhysicsChapterFullData;
}

export function PhysicsGuidebookShell({ chapterData }: PhysicsGuidebookShellProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]));
  const [mobileRailOpen, setMobileRailOpen] = useState<boolean>(false);

  // Load saved completed steps from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sheratutor_phys_ch_${chapterData.chapterNo}_progress`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompletedSteps(new Set(parsed));
        }
      }
    } catch {
      // LocalStorage unavailable
    }
  }, [chapterData.chapterNo]);

  // Save progress helper
  const markStepDone = (stepNum: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepNum);
      try {
        localStorage.setItem(
          `sheratutor_phys_ch_${chapterData.chapterNo}_progress`,
          JSON.stringify(Array.from(next)),
        );
      } catch {
        // LocalStorage unavailable
      }
      return next;
    });
  };

  const handleNextStep = () => {
    markStepDone(currentStep);
    if (currentStep < 5) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (step: number) => {
    markStepDone(currentStep);
    setCurrentStep(step);
    setMobileRailOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background">
      {/* Mobile Drawer Backdrop */}
      {mobileRailOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileRailOpen(false)}
        />
      )}

      {/* Left Chapter Contents Rail */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 lg:static lg:z-auto transition-transform duration-300 ease-in-out ${
          mobileRailOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <ChapterContentsRail
          metadata={chapterData}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onSelectStep={handleJumpToStep}
          className="h-full"
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Top Breadcrumbs & Mobile Trigger Bar */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/80">
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileRailOpen(true)}
                className="lg:hidden size-8 rounded-lg -ml-2"
              >
                <Menu className="size-4" />
              </Button>

              <Link
                href={'/dashboard/playground/physics' as Route}
                className="hover:text-foreground transition-colors font-medium"
              >
                {isBn ? 'পদার্থবিজ্ঞান ল্যাব' : 'Physics Lab'}
              </Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="font-mono text-primary font-semibold">
                {isBn ? `অধ্যায় ${toBengaliNumber(chapterData.chapterNo)}` : `CH ${chapterData.chapterNo}`}
              </span>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-foreground font-medium truncate max-w-[160px] sm:max-w-none">
                {isBn ? chapterData.titleBn : chapterData.titleEn}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/tutor?prompt=${encodeURIComponent(
                  `আমাকে পদার্থবিজ্ঞান অধ্যায় ${chapterData.chapterNo} (${chapterData.titleBn}) থেকে সৃজনশীল প্রশ্নের সমাধান বুঝিয়ে দাও।`,
                )}` as Route}
                target="_blank"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs rounded-xl h-8 hidden sm:inline-flex hover:bg-surface-2"
                >
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>{isBn ? 'এআই টিউটরকে জিজ্ঞাসা করো' : 'Ask AI Tutor'}</span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Step Content Renderer */}
          <div className="pt-2">
            {currentStep === 1 && <StepConceptTree data={chapterData.step1} />}
            {currentStep === 2 && (
              <StepSimulationHost
                data={chapterData.step2}
                chapterNo={chapterData.chapterNo}
              />
            )}
            {currentStep === 3 && (
              <StepFormulaDecoder data={chapterData.step3} />
            )}
            {currentStep === 4 && <StepBoardTraps data={chapterData.step4} />}
            {currentStep === 5 && (
              <StepBoardQuiz
                data={chapterData.step5}
                onQuizComplete={() => markStepDone(5)}
              />
            )}
          </div>
        </div>

        {/* Bottom Navigation Footer */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <StepNavFooter
            currentStep={currentStep}
            totalSteps={5}
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            onJumpToStep={handleJumpToStep}
            isCompleted={completedSteps.has(5)}
          />
        </div>
      </main>
    </div>
  );
}
