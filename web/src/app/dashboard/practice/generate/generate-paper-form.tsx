"use client";

import { useActionState, useState } from "react";
import { generatePaper, type GeneratePaperState } from "@/app/actions/generate-paper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { CheckSquare, Loader2, Sparkles, Square } from "lucide-react";

type Chapter = { id: string; subject_id: string; chapter_no: number; title_en: string; title_bn?: string | null };
type Subject = { id: string; name_en: string; name_bn?: string | null };

const initialState: GeneratePaperState = { status: "idle" };

export function GeneratePaperForm({ subjects, chapters }: { subjects: Subject[]; chapters: Chapter[] }) {
  const { language } = useLanguage();
  const [state, formAction, pending] = useActionState(generatePaper, initialState);
  const defaultSubjectId = subjects.find((s) => chapters.some((c) => c.subject_id === s.id))?.id ?? subjects[0]?.id ?? "";
  const [subjectId, setSubjectId] = useState(defaultSubjectId);
  const [paperType, setPaperType] = useState<string>("CQ");
  const [difficulty, setDifficulty] = useState<string>("BOARD_STANDARD");

  const subjectChapters = chapters.filter((c) => c.subject_id === subjectId).sort((a, b) => a.chapter_no - b.chapter_no);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());

  const handleToggleChapter = (chapterId: string) => {
    setSelectedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedChapters(new Set(subjectChapters.map((c) => c.id)));
  };

  const handleDeselectAll = () => {
    setSelectedChapters(new Set());
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="subjectId" value={subjectId} />
      <input type="hidden" name="paperType" value={paperType} />
      <input type="hidden" name="difficulty" value={difficulty} />
      <input type="hidden" name="chapterIds" value={Array.from(selectedChapters).join(",")} />

      <div className="space-y-2">
        <Label htmlFor="subjectId" className="text-sm font-semibold">
          {language === 'bn' ? 'বিষয় নির্বাচন করো' : 'Select Subject'}
        </Label>
        <Select value={subjectId} onValueChange={(val) => {
          setSubjectId(val);
          setSelectedChapters(new Set());
        }} required>
          <SelectTrigger id="subjectId" className="w-full h-11 bg-muted/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {language === 'bn' ? (s.name_bn || s.name_en) : s.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">
            {language === 'bn' ? 'অধ্যায়সমূহ নির্বাচন করো' : 'Select Chapters'}
          </Label>
          {subjectChapters.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <CheckSquare size={13} /> {language === 'bn' ? 'সবগুলো' : 'Select all'}
              </button>
              <span className="text-muted-foreground text-xs">·</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="text-xs text-muted-foreground hover:underline flex items-center gap-1 font-medium"
              >
                <Square size={13} /> {language === 'bn' ? 'মুছে ফেলো' : 'Clear'}
              </button>
            </div>
          )}
        </div>

        {subjectChapters.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 rounded-lg border border-dashed text-center">
            {language === 'bn' ? 'এই বিষয়ের জন্য এখনও কোনো অধ্যায় নেই।' : 'No chapters available for this subject yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto rounded-xl border border-border p-3.5 bg-muted/10">
            {subjectChapters.map((c) => {
              const isChecked = selectedChapters.has(c.id);
              return (
                <label 
                  key={c.id} 
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer border transition-colors [content-visibility:auto] [contain-intrinsic-size:auto_40px] ${isChecked ? 'bg-primary/10 border-primary/40' : 'bg-card border-border/60 hover:bg-muted/30'}`}
                >
                  <input
                    type="checkbox"
                    name="chapterIds"
                    value={c.id}
                    checked={isChecked}
                    onChange={() => handleToggleChapter(c.id)}
                    className="sr-only"
                  />
                  <Checkbox 
                    id={`chapter-${c.id}`} 
                    checked={isChecked}
                    onCheckedChange={() => handleToggleChapter(c.id)}
                    className="mt-0.5" 
                  />
                  <span className="font-medium text-xs leading-snug cursor-pointer flex-1 select-none flex items-center">
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-muted text-foreground mr-2 shrink-0">
                      {c.chapter_no.toString().padStart(2, '0')}
                    </span>
                    <span>{language === 'bn' ? (c.title_bn || c.title_en) : c.title_en}</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paperType" className="text-sm font-semibold">
            {language === 'bn' ? 'প্রশ্নের ধরন' : 'Question Type'}
          </Label>
          <Select value={paperType} onValueChange={setPaperType} required>
            <SelectTrigger id="paperType" className="w-full h-11 bg-muted/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CQ">{language === 'bn' ? 'সৃজনশীল প্রশ্ন (CQ)' : 'Creative Questions (CQ)'}</SelectItem>
              <SelectItem value="MCQ">{language === 'bn' ? 'বহুনির্বাচনী প্রশ্ন (MCQ)' : 'Multiple Choice (MCQ)'}</SelectItem>
              <SelectItem value="MIXED">{language === 'bn' ? 'মিশ্র (CQ + MCQ)' : 'Mixed (CQ + MCQ)'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-sm font-semibold">
            {language === 'bn' ? 'কঠিনতার স্তর' : 'Difficulty Level'}
          </Label>
          <Select value={difficulty} onValueChange={setDifficulty} required>
            <SelectTrigger id="difficulty" className="w-full h-11 bg-muted/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">{language === 'bn' ? 'সহজ (Easy)' : 'Easy'}</SelectItem>
              <SelectItem value="MEDIUM">{language === 'bn' ? 'মাঝারি (Medium)' : 'Medium'}</SelectItem>
              <SelectItem value="HARD">{language === 'bn' ? 'কঠিন (Hard)' : 'Hard'}</SelectItem>
              <SelectItem value="BOARD_STANDARD">{language === 'bn' ? 'বোর্ড মান (Board Standard)' : 'Board Standard'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="totalMarks" className="text-sm font-semibold">
            {language === 'bn' ? 'মোট নম্বর' : 'Total Marks'}
          </Label>
          <span className="text-xs text-muted-foreground">
            {language === 'bn' ? 'বোর্ড মান: ২৫-১০০ নম্বর' : 'Standard: 25–100 marks'}
          </span>
        </div>
        <Input 
          id="totalMarks" 
          name="totalMarks" 
          type="number" 
          inputMode="numeric" 
          defaultValue={25} 
          min={5} 
          max={100} 
          className="h-11 bg-muted/20"
          required 
        />
      </div>

      {state.status === "error" && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
          {state.message}
        </div>
      )}

      <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            {language === 'bn' ? 'তৈরি হচ্ছে… এক মিনিট সময় লাগতে পারে' : 'Generating paper… please wait'}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'প্রশ্নপত্র তৈরি করো' : 'Generate Practice Paper'}
          </>
        )}
      </Button>
    </form>
  );
}
