"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateQuestionPaperFlow } from "@/ai/flows/generate-question-paper";

const GeneratePaperSchema = z.object({
  subjectId: z.string().min(1),
  chapterIds: z.array(z.string()).min(1, "Pick at least one chapter."),
  paperType: z.enum(["MCQ", "CQ", "MIXED"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "BOARD_STANDARD"]),
  totalMarks: z.coerce.number().int().min(5).max(100),
});

export type GeneratePaperState = { status: "idle" | "error"; message?: string };

export async function generatePaper(_prev: GeneratePaperState, formData: FormData): Promise<GeneratePaperState> {
  const raw = {
    subjectId: String(formData.get("subjectId") ?? ""),
    chapterIds: formData.getAll("chapterIds").map(String),
    paperType: String(formData.get("paperType") ?? ""),
    difficulty: String(formData.get("difficulty") ?? ""),
    totalMarks: String(formData.get("totalMarks") ?? ""),
  };

  const parsed = GeneratePaperSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your answers." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subject } = await supabase
    .from("subjects")
    .select("name_en")
    .eq("id", parsed.data.subjectId)
    .maybeSingle();
  if (!subject) return { status: "error", message: "Subject not found." };

  let generated;
  try {
    generated = await generateQuestionPaperFlow({
      chapterIds: parsed.data.chapterIds,
      paperType: parsed.data.paperType,
      difficulty: parsed.data.difficulty,
      totalMarks: parsed.data.totalMarks,
      languagePreference: "bn",
    });
  } catch (err) {
    return { status: "error", message: err instanceof Error ? err.message : "Generation failed." };
  }

  if (generated.questions.length === 0) {
    return { status: "error", message: "Couldn't generate any questions — try different chapters." };
  }

  const title = `${subject.name_en} Practice — ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  const { data: paper, error: paperErr } = await supabase
    .from("question_papers")
    .insert({
      created_by_user_id: user.id,
      subject_id: parsed.data.subjectId,
      title,
      paper_type: parsed.data.paperType,
      difficulty: parsed.data.difficulty,
      total_marks: parsed.data.totalMarks,
      is_public_template: false,
    })
    .select("id")
    .single();
  if (paperErr || !paper) return { status: "error", message: paperErr?.message ?? "Failed to save paper." };

  for (let i = 0; i < generated.questions.length; i++) {
    const q = generated.questions[i];

    const { data: rubric, error: rubricErr } = await supabase
      .from("rubrics")
      .insert({
        chapter_id: q.chapter_id,
        title: `${title} — Q${i + 1}`,
        criteria_json: q.rubric_criteria,
        is_active: true,
        created_by: user.id,
      })
      .select("id")
      .single();
    if (rubricErr || !rubric) return { status: "error", message: rubricErr?.message ?? "Failed to save rubric." };

    const { error: questionErr } = await supabase.from("questions").insert({
      question_paper_id: paper.id,
      chapter_id: q.chapter_id,
      rubric_id: rubric.id,
      question_number: i + 1,
      question_text_bn: q.question_text_bn,
      question_text_en: q.question_text_en,
      max_marks: q.max_marks,
    });
    if (questionErr) return { status: "error", message: questionErr.message };
  }

  redirect(`/dashboard/upload?paperId=${paper.id}`);
}
