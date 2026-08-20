"use client";

import { useActionState, useState } from "react";
import { generatePaper, type GeneratePaperState } from "@/app/actions/generate-paper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Chapter = { id: string; subject_id: string; chapter_no: number; title_en: string };
type Subject = { id: string; name_en: string };

const initialState: GeneratePaperState = { status: "idle" };

export function GeneratePaperForm({ subjects, chapters }: { subjects: Subject[]; chapters: Chapter[] }) {
  const [state, formAction, pending] = useActionState(generatePaper, initialState);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");

  const subjectChapters = chapters.filter((c) => c.subject_id === subjectId).sort((a, b) => a.chapter_no - b.chapter_no);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="subjectId">Subject</Label>
        <Select name="subjectId" value={subjectId} onValueChange={setSubjectId} required>
          <SelectTrigger id="subjectId" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Chapters</Label>
        {subjectChapters.length === 0 ? (
          <p className="text-sm text-muted-foreground">No chapters available for this subject yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto rounded-lg border border-border p-3">
            {subjectChapters.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <Checkbox id={`chapter-${c.id}`} name="chapterIds" value={c.id} />
                <Label htmlFor={`chapter-${c.id}`} className="font-normal text-xs leading-snug">
                  {c.chapter_no}. {c.title_en}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="paperType">Paper type</Label>
          <Select name="paperType" defaultValue="CQ" required>
            <SelectTrigger id="paperType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CQ">Creative Questions</SelectItem>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="MIXED">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select name="difficulty" defaultValue="BOARD_STANDARD" required>
            <SelectTrigger id="difficulty" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
              <SelectItem value="BOARD_STANDARD">Board Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="totalMarks">Total marks</Label>
        <Input id="totalMarks" name="totalMarks" type="number" defaultValue={25} min={5} max={100} required />
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Generating… this can take a minute" : "Generate paper"}
      </Button>
    </form>
  );
}
