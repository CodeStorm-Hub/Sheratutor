"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import 'katex/dist/katex.min.css';
import rehypeKatex from "rehype-katex";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrinterIcon, ArrowLeft, Upload, Clock, Award, BarChart2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SubQuestion {
  part: string;
  text_bn: string;
  text_en: string;
  marks: number;
}

interface Question {
  id: string;
  question_number: number;
  question_type: "CQ" | "MCQ";
  max_marks: number;
  stimulus_bn: string | null;
  stimulus_en: string | null;
  sub_questions_json: any | null;
  mcq_options_json: any | null;
  mcq_correct_option: string | null;
  question_text_bn: string | null;
  question_text_en?: string | null;
}

interface Paper {
  id: string;
  title: string;
  paper_type: string;
  difficulty: string;
  total_marks: number;
  subject: { name_en: string; name_bn: string } | null;
}

function RenderMathText({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ ...props }) => <span className="leading-relaxed inline" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function QuestionPaperViewerClient({
  paper,
  questions,
}: {
  paper: Paper;
  questions: Question[];
}) {
  const { language } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const difficultyLabel = {
    EASY: language === 'bn' ? 'সহজ' : 'Easy',
    MEDIUM: language === 'bn' ? 'মাঝারি' : 'Medium',
    HARD: language === 'bn' ? 'কঠিন' : 'Hard',
    BOARD_STANDARD: language === 'bn' ? 'বোর্ড মান' : 'Board Standard',
  }[paper.difficulty] || paper.difficulty;

  const paperTypeLabel = {
    CQ: language === 'bn' ? 'সৃজনশীল প্রশ্ন' : 'Creative Question (CQ)',
    MCQ: language === 'bn' ? 'বহুনির্বাচনী' : 'Multiple Choice (MCQ)',
    MIXED: language === 'bn' ? 'মিশ্র (CQ + MCQ)' : 'Mixed Test',
  }[paper.paper_type] || paper.paper_type;

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
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{paper.title}</h1>
            <p className="text-xs text-muted-foreground">
              {language === 'bn' ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) মান' : 'National Curriculum & Textbook Board (NCTB) Standard'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 shrink-0">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <PrinterIcon className="h-4 w-4" /> {language === 'bn' ? 'প্রিন্ট করো' : 'Print Paper'}
          </Button>
          <Link href={`/dashboard/upload?paperId=${paper.id}`}>
            <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="h-4 w-4" /> {language === 'bn' ? 'উত্তরপত্র জমা দাও' : 'Upload Answers'}
            </Button>
          </Link>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none shadow-sm border border-border/80">
        <CardHeader className="text-center border-b pb-6 print:border-black bg-muted/10 print:bg-transparent">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1 font-mono">
            {language === 'bn' ? 'এসএসসি মক পরীক্ষা ২০২৬' : 'SSC MOCK EXAMINATION 2026'}
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-heading">
            {language === 'bn' ? (paper.subject?.name_bn || paper.subject?.name_en || 'পদার্থবিজ্ঞান') : (paper.subject?.name_en || 'Physics')} — {paperTypeLabel}
          </CardTitle>
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-3 text-xs text-muted-foreground mt-4 pt-3 border-t border-border/40 print:text-black">
            <span className="flex items-center gap-1">
              <BarChart2 size={14} className="text-primary" />
              <b>{language === 'bn' ? 'কঠিনতা:' : 'Difficulty:'}</b> {difficultyLabel}
            </span>
            <span className="flex items-center gap-1">
              <Award size={14} className="text-primary" />
              <b>{language === 'bn' ? 'পূর্ণমান:' : 'Full Marks:'}</b> {paper.total_marks}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-primary" />
              <b>{language === 'bn' ? 'সময়:' : 'Time:'}</b> {Math.round(paper.total_marks * 1.5)} {language === 'bn' ? 'মিনিট' : 'Minutes'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {questions.map((q) => {
            const subQuestions = typeof q.sub_questions_json === "string" 
              ? JSON.parse(q.sub_questions_json) 
              : q.sub_questions_json;
              
            const mcqOptions = typeof q.mcq_options_json === "string" 
              ? JSON.parse(q.mcq_options_json) 
              : q.mcq_options_json;

            const qText = language === 'bn' ? (q.stimulus_bn || q.question_text_bn) : (q.stimulus_en || q.stimulus_bn || q.question_text_bn);

            return (
              <div key={q.id} className="space-y-4 break-inside-avoid pb-6 border-b border-border/40 last:border-0 last:pb-0">
                <div className="flex font-medium text-sm sm:text-base items-start gap-2">
                  <span className="w-8 shrink-0 font-bold text-primary font-mono">{q.question_number}.</span>
                  <div className="flex-1 text-foreground leading-relaxed whitespace-pre-wrap">
                    <RenderMathText text={qText || ""} />
                  </div>
                  {q.question_type === "MCQ" && (
                    <span className="text-right w-12 text-xs font-semibold text-muted-foreground shrink-0 font-mono">
                      [{q.max_marks}]
                    </span>
                  )}
                </div>

                {q.question_type === "CQ" && subQuestions && (
                  <div className="pl-4 sm:pl-8 space-y-2.5 mt-2">
                    {subQuestions.map((sq: SubQuestion) => {
                      const sqText = language === 'bn' ? sq.text_bn : (sq.text_en || sq.text_bn);
                      return (
                        <div key={sq.part} className="flex items-start text-xs sm:text-sm text-foreground/90 gap-2 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                          <span className="w-7 shrink-0 font-bold text-heading">({sq.part})</span>
                          <div className="flex-1 leading-relaxed">
                            <RenderMathText text={sqText || ""} />
                          </div>
                          <span className="text-right w-8 shrink-0 font-mono font-bold text-muted-foreground">
                            {sq.marks}
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
