'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Step5BoardQuizData, BoardQuizItem } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface StepBoardQuizProps {
  data: Step5BoardQuizData;
  onQuizComplete?: (score: number, total: number) => void;
}

export function StepBoardQuiz({ data, onQuizComplete }: StepBoardQuizProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleSelectOption = (quizId: string, optionIndex: number) => {
    if (submitted[quizId]) return; // already revealed
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIndex }));
    setSubmitted((prev) => ({ ...prev, [quizId]: true }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted({});
  };

  const totalQuestions = data.quizzes.length;
  const answeredCount = Object.keys(submitted).length;
  const correctCount = data.quizzes.filter(
    (q) => selectedAnswers[q.id] === q.correctOptionIndex,
  ).length;

  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <HelpCircle className="size-3.5" />
          <span>{isBn ? 'ধাপ ৫: বোর্ড ডায়াগনস্টিক কুইজ' : 'Step 5: Rapid Board Diagnostic Quiz'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {isBn ? 'বোর্ড স্ট্যান্ডার্ড যাচাই ও তাৎক্ষণিক ফলাফল' : 'Board Standard Diagnostic Assessment'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {isBn
            ? 'বিভিন্ন শিক্ষা বোর্ডের সাম্প্রতিক সৃজনশীল ও বহুনির্বাচনি প্রশ্নের আলোকে নিজের প্রস্তুতি যাচাই করো। প্রতিটি প্রশ্নের সাথে বিস্তারিত ব্যাখ্যা সংযোজিত।'
            : 'Evaluate your mastery with authentic board exam questions. Receive instant scoring and detailed step-by-step mathematical explanations.'}
        </p>
      </div>

      {/* Score Summary Banner */}
      <Card className="border-border/80 bg-card p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Trophy className="size-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">
              {isBn ? 'বর্তমান স্কোর' : 'Current Score'}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-foreground flex items-center gap-2">
              <span>
                {isBn
                  ? `${toBengaliNumber(correctCount)} / ${toBengaliNumber(totalQuestions)}`
                  : `${correctCount} / ${totalQuestions}`}
              </span>
              {allAnswered && correctCount === totalQuestions && (
                <Badge variant="secondary" className="text-xs bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                  {isBn ? '১০০% নির্ভুল!' : '100% Perfect!'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {answeredCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 rounded-xl text-xs w-full sm:w-auto"
            >
              <RotateCcw className="size-3.5" />
              <span>{isBn ? 'পুনরায় চেষ্টা' : 'Reset Quiz'}</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Quizzes List */}
      <div className="space-y-6">
        {data.quizzes.map((quiz, qIdx) => {
          const isAnswered = Boolean(submitted[quiz.id]);
          const selectedIdx = selectedAnswers[quiz.id];
          const isCorrect = selectedIdx === quiz.correctOptionIndex;
          const options = isBn ? quiz.optionsBn : quiz.optionsEn;

          return (
            <Card
              key={quiz.id || qIdx}
              className={`p-6 border-border/80 bg-card transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/50 shadow-sm'
                    : 'border-rose-500/50 shadow-sm'
                  : 'hover:border-border'
              }`}
            >
              <div className="space-y-4">
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="size-7 rounded-lg bg-surface-2 text-foreground font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {isBn ? toBengaliNumber(qIdx + 1) : qIdx + 1}
                    </span>
                    <div className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                      <RenderMathText
                        text={isBn ? quiz.questionBn : quiz.questionEn}
                      />
                    </div>
                  </div>

                  {quiz.boardSource && (
                    <Badge variant="outline" className="text-[11px] shrink-0 font-medium">
                      {quiz.boardSource}
                    </Badge>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {options.map((optionText, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    const isTheCorrectOne = quiz.correctOptionIndex === optIdx;

                    let optionStyle =
                      'bg-surface-1/60 hover:bg-surface-2 border-border/70 text-foreground';

                    if (isAnswered) {
                      if (isTheCorrectOne) {
                        optionStyle =
                          'bg-emerald-500/15 border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-medium ring-1 ring-emerald-500/30';
                      } else if (isSelected && !isTheCorrectOne) {
                        optionStyle =
                          'bg-rose-500/15 border-rose-500/60 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500/30';
                      } else {
                        optionStyle = 'opacity-50 border-border/40';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(quiz.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2.5 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted/80 text-muted-foreground shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 truncate sm:whitespace-normal">
                            <RenderMathText text={optionText} inline />
                          </span>
                        </div>

                        {isAnswered && isTheCorrectOne && (
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isTheCorrectOne && (
                          <XCircle className="size-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Reveal */}
                {isAnswered && (
                  <div
                    className={`p-4 rounded-xl text-xs sm:text-sm space-y-1.5 border transition-all ${
                      isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-100'
                        : 'bg-muted/80 border-border text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="size-3.5 text-amber-500" />
                      <span>{isBn ? 'ব্যাখ্যা ও সমাধান' : 'Explanation & Solution'}</span>
                    </div>
                    <div className="leading-relaxed">
                      <RenderMathText
                        text={isBn ? quiz.explanationBn : quiz.explanationEn}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
