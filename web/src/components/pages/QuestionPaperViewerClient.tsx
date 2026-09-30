"use client";

import { useState } from "react";
import Link from "next/link";
import { RenderMathText } from "@/components/render-math-text";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrinterIcon, ArrowLeft, Upload, Clock, Award, BarChart2, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface SubQuestion {
  part: string;
  text_bn: string;
  text_en: string;
  marks: number;
}

export interface Question {
  id: string;
  question_number: number;
  question_type: "CQ" | "MCQ";
  max_marks: number;
  stimulus_bn: string | null;
  stimulus_en: string | null;
  sub_questions_json: unknown | null;
  mcq_options_json: unknown | null;
  mcq_correct_option: string | null;
  question_text_bn: string | null;
  question_text_en?: string | null;
}

export interface Paper {
  id: string;
  title: string;
  paper_type: string;
  difficulty: string;
  total_marks: number;
  subject: { name_en: string; name_bn: string; code?: string } | null;
}

const toBanglaDigits = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export default function QuestionPaperViewerClient({
  paper,
  questions,
}: {
  paper: Paper;
  questions: Question[];
}) {
  const { language } = useLanguage();
  
  // NCTB standard papers default to Bangla ('bn') unless subject is English
  const isEnglishSubject = paper.subject?.code === 'SSC-ENG' || /english/i.test(paper.subject?.name_en || '');
  const [paperVersion, setPaperVersion] = useState<'bn' | 'en'>(isEnglishSubject ? 'en' : 'bn');

  const isBn = paperVersion === 'bn';

  const handlePrint = () => {
    window.print();
  };

  const difficultyLabel = isBn
    ? ({
        EASY: 'সহজ',
        MEDIUM: 'মাঝারি',
        HARD: 'কঠিন',
        BOARD_STANDARD: 'বোর্ড মান',
      }[paper.difficulty] || 'বোর্ড মান')
    : ({
        EASY: 'Easy',
        MEDIUM: 'Medium',
        HARD: 'Hard',
        BOARD_STANDARD: 'Board Standard',
      }[paper.difficulty] || paper.difficulty);

  const paperTypeLabel = isBn
    ? ({
        CQ: 'সৃজনশীল প্রশ্ন (CQ)',
        MCQ: 'বহুনির্বাচনী প্রশ্ন (MCQ)',
        MIXED: 'মিশ্র পরীক্ষা (CQ + MCQ)',
      }[paper.paper_type] || 'সৃজনশীল প্রশ্ন (CQ)')
    : ({
        CQ: 'Creative Question (CQ)',
        MCQ: 'Multiple Choice (MCQ)',
        MIXED: 'Mixed Test (CQ + MCQ)',
      }[paper.paper_type] || paper.paper_type);

  const subjectDisplayName = isBn
    ? (paper.subject?.name_bn || paper.subject?.name_en || 'উচ্চতর গণিত')
    : (paper.subject?.name_en || 'Higher Mathematics');

  return (
    <div className="max-w-4xl mx-auto space-y-6 print:max-w-full print:m-0 print:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/practice"
            className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label={language === 'bn' ? 'অনুশীলনে ফিরে যাও' : 'Back to Practice'}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {isBn && paper.subject?.name_bn
                ? `${paper.subject.name_bn} মক অনুশীলন — ২০২৬`
                : paper.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত প্রশ্নপদ্ধতি'
                : 'National Curriculum & Textbook Board (NCTB) Standard'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Version Switcher: Bangla (NCTB) vs English Version */}
          {!isEnglishSubject && (
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/70">
              <button
                type="button"
                onClick={() => setPaperVersion('bn')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer",
                  isBn ? "bg-primary text-primary-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                )}
              >
                বাংলা সংস্করণ (NCTB)
              </button>
              <button
                type="button"
                onClick={() => setPaperVersion('en')}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer",
                  !isBn ? "bg-primary text-primary-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                )}
              >
                English Version
              </button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 cursor-pointer">
            <PrinterIcon className="h-4 w-4" /> {language === 'bn' ? 'প্রিন্ট করো' : 'Print Paper'}
          </Button>
          <Link href={`/dashboard/upload?paperId=${paper.id}`}>
            <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
              <Upload className="h-4 w-4" /> {language === 'bn' ? 'উত্তরপত্র জমা দাও' : 'Upload Answers'}
            </Button>
          </Link>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none shadow-sm border border-border/80">
        <CardHeader className="text-center border-b pb-6 print:border-black bg-muted/10 print:bg-transparent">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1 font-mono">
            {isBn ? 'এসএসসি মক পরীক্ষা ২০২৬' : 'SSC MOCK EXAMINATION 2026'}
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-heading">
            {subjectDisplayName} — {paperTypeLabel}
          </CardTitle>
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-3 text-xs text-muted-foreground mt-4 pt-3 border-t border-border/40 print:text-black">
            <span className="flex items-center gap-1">
              <BarChart2 size={14} className="text-primary" />
              <b>{isBn ? 'কঠিনতা:' : 'Difficulty:'}</b> {difficultyLabel}
            </span>
            <span className="flex items-center gap-1">
              <Award size={14} className="text-primary" />
              <b>{isBn ? 'পূর্ণমান:' : 'Full Marks:'}</b> {isBn ? toBanglaDigits(paper.total_marks) : paper.total_marks}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-primary" />
              <b>{isBn ? 'সময়:' : 'Time:'}</b> {isBn ? toBanglaDigits(Math.round(paper.total_marks * 1.5)) : Math.round(paper.total_marks * 1.5)} {isBn ? 'মিনিট' : 'Minutes'}
            </span>
          </div>
          {isBn && (
            <p className="text-3xs text-muted-foreground/90 mt-2.5 font-normal italic print:text-black">
              [বিশেষ নির্দেশাবলি: প্রতিটি প্রশ্নের মান ডানপাশে উল্লেখ করা হয়েছে। ক, খ, গ (ও ঘ) অংশের উত্তর ক্রমানুসারে লেখো।]
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {questions.map((q) => {
            const subQuestions = typeof q.sub_questions_json === "string" 
              ? JSON.parse(q.sub_questions_json) 
              : q.sub_questions_json;
              
            const mcqOptions = typeof q.mcq_options_json === "string" 
              ? JSON.parse(q.mcq_options_json) 
              : q.mcq_options_json;

            // Prioritize Bangla stimulus when in Bangla mode
            const qText = isBn
              ? (q.stimulus_bn || q.question_text_bn || q.stimulus_en || q.question_text_en)
              : (q.stimulus_en || q.stimulus_bn || q.question_text_bn);

            const qNum = isBn ? `${toBanglaDigits(q.question_number)}.` : `${q.question_number}.`;

            return (
              <div key={q.id} className="space-y-4 break-inside-avoid pb-6 border-b border-border/40 last:border-0 last:pb-0">
                <div className="flex font-medium text-sm sm:text-base items-start gap-2">
                  <span className="w-8 shrink-0 font-bold text-primary font-mono">{qNum}</span>
                  <div className="flex-1 text-foreground leading-relaxed whitespace-pre-wrap">
                    <RenderMathText text={qText || ""} />
                  </div>
                  {q.question_type === "MCQ" && (
                    <span className="text-right w-12 text-xs font-semibold text-muted-foreground shrink-0 font-mono">
                      [{isBn ? toBanglaDigits(q.max_marks) : q.max_marks}]
                    </span>
                  )}
                </div>

                {q.question_type === "CQ" && subQuestions && (
                  <div className="pl-4 sm:pl-8 space-y-2.5 mt-2">
                    {subQuestions.map((sq: SubQuestion) => {
                      const sqText = isBn ? (sq.text_bn || sq.text_en) : (sq.text_en || sq.text_bn);
                      const partLabel = isBn
                        ? (sq.part === 'a' ? 'ক' : sq.part === 'b' ? 'খ' : sq.part === 'c' ? 'গ' : sq.part === 'd' ? 'ঘ' : sq.part)
                        : sq.part;

                      const domainLabel = isBn
                        ? (partLabel === 'ক' ? 'জ্ঞানমূলক' :
                           partLabel === 'খ' ? 'অনুধাবনমূলক' :
                           partLabel === 'গ' ? 'প্রয়োগমূলক' : 'উচ্চতর দক্ষতা')
                        : (sq.part === 'ক' || sq.part === 'a' ? 'Knowledge' :
                           sq.part === 'খ' || sq.part === 'b' ? 'Comprehension' :
                           sq.part === 'গ' || sq.part === 'c' ? 'Application' : 'Higher Ability');

                      return (
                        <div key={sq.part} className="flex items-start text-xs sm:text-sm text-foreground/90 gap-2 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                          <span className="w-7 shrink-0 font-bold text-heading">({partLabel})</span>
                          <div className="flex-1 leading-relaxed">
                            <RenderMathText text={sqText || ""} />
                            <div className="mt-1">
                              <span className="text-3xs font-medium uppercase tracking-wider text-muted-foreground/80 bg-muted px-2 py-0.5 rounded-md">
                                {domainLabel}
                              </span>
                            </div>
                          </div>
                          <span className="text-right w-14 shrink-0 font-mono font-bold text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                            {isBn ? `${toBanglaDigits(sq.marks)} নম্বর` : `${sq.marks} m`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.question_type === "MCQ" && mcqOptions && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 sm:pl-8 mt-2">
                    {mcqOptions.map((opt: string, idx: number) => {
                      const prefix = ["ক", "খ", "গ", "ঘ"][idx] || idx + 1;
                      return (
                        <div key={idx} className="flex items-start text-xs sm:text-sm p-2 rounded-md bg-muted/20 border border-border/40 gap-2">
                          <span className="w-6 shrink-0 font-semibold text-primary font-mono">({prefix})</span>
                          <span className="flex-1">
                            <RenderMathText text={opt} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
