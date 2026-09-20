"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateQuestionPaperFlow } from "@/ai/flows/generate-question-paper";
import { startOfDhakaDayUtcIso } from "@/lib/time";

const GeneratePaperSchema = z.object({
  subjectId: z.string().min(1),
  chapterIds: z.array(z.string()).min(1, "Pick at least one chapter."),
  paperType: z.enum(["MCQ", "CQ", "MIXED"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "BOARD_STANDARD"]),
  totalMarks: z.coerce.number().int().min(5).max(100),
});

export type GeneratePaperState = { status: "idle" | "error"; message?: string };

const PAPER_GEN_DAILY_LIMIT = 10;

export async function generatePaper(_prev: GeneratePaperState, formData: FormData): Promise<GeneratePaperState> {
  const chapterIds = formData
    .getAll("chapterIds")
    .flatMap((c) => String(c).split(","))
    .map((s) => s.trim())
    .filter(Boolean);

  const raw = {
    subjectId: String(formData.get("subjectId") ?? ""),
    chapterIds,
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

  const { count: todaysPapers } = await supabase
    .from("question_papers")
    .select("id", { count: "exact", head: true })
    .eq("created_by_user_id", user.id)
    .gte("created_at", startOfDhakaDayUtcIso());
  if ((todaysPapers ?? 0) >= PAPER_GEN_DAILY_LIMIT) {
    return {
      status: "error",
      message: "আজকের প্রশ্নপত্র তৈরির সীমা শেষ হয়েছে, আগামীকাল আবার চেষ্টা করো।",
    };
  }

  const { data: subject } = await supabase
    .from("subjects")
    .select("name_en, name_bn")
    .eq("id", parsed.data.subjectId)
    .maybeSingle();
  if (!subject) return { status: "error", message: "Subject not found." };

  let generated;
  try {
    generated = await generateQuestionPaperFlow({
      subjectNameEn: subject.name_en,
      subjectNameBn: subject.name_bn || (subject.name_en === "Chemistry" ? "রসায়ন" : "পদার্থবিজ্ঞান"),
      chapterIds: parsed.data.chapterIds,
      paperType: parsed.data.paperType,
      difficulty: parsed.data.difficulty,
      totalMarks: parsed.data.totalMarks,
      languagePreference: "bn",
    });
  } catch (err) {
    // Log the raw upstream error (model 4xx/5xx, JSON parse, schema) but never
    // surface it verbatim — users were seeing things like "410 status code
    // (no body)". Give a plain, actionable message instead.
    console.error("generateQuestionPaperFlow failed:", err);
    return {
      status: "error",
      message:
        "The question generator is temporarily unavailable. Please try again in a minute — if it keeps failing, pick fewer chapters or a lower mark total.",
    };
  }

  if (generated.questions.length === 0) {
    return { status: "error", message: "Couldn't generate any questions — try different chapters." };
  }

  const actualTotalMarks = generated.questions.reduce((sum, q) => sum + (q.max_marks || 0), 0);
  const title = `${subject.name_en} Practice — ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  // Use the user-requested totalMarks for the paper record — the AI may return
  // slightly fewer questions than asked but the paper is still a "100-mark paper".
  const paperTotalMarks = parsed.data.totalMarks > 0 ? parsed.data.totalMarks : actualTotalMarks;

  const { data: paper, error: paperErr } = await supabase
    .from("question_papers")
    .insert({
      created_by_user_id: user.id,
      subject_id: parsed.data.subjectId,
      title,
      paper_type: parsed.data.paperType,
      difficulty: parsed.data.difficulty,
      total_marks: paperTotalMarks,
      is_public_template: false,
    })
    .select("id")
    .single();
  if (paperErr || !paper) return { status: "error", message: paperErr?.message ?? "Failed to save paper." };

  // Bulk-insert rubrics then questions (2 round-trips, not 2·N) so the whole
  // action stays inside Vercel's 60s function limit for large MCQ papers.
  const rubricRows = generated.questions.map((q, i) => {
    let criteria_json: Array<{ step_name: string; max_step_marks: number; matching_rules: string }> = [];
    if (q.question_type === "CQ" && q.sub_questions && q.sub_questions.length > 0) {
      criteria_json = q.sub_questions.map((subq) => ({
        step_name: `Part (${subq.part})`,
        max_step_marks: subq.marks,
        matching_rules: subq.rubric_step_rules || `Accurate answer and step-by-step mathematical/scientific derivation for part (${subq.part})`,
      }));
    } else if (q.question_type === "MCQ") {
      criteria_json = [
        {
          step_name: "Correct Option",
          max_step_marks: q.max_marks || 1,
          matching_rules: `Student must select ${q.mcq_correct_option || "the correct option"}`,
        },
      ];
    }
    return { chapter_id: q.chapter_id, title: `${title} — Q${i + 1}`, criteria_json, is_active: true, created_by: user.id };
  });

  const { data: rubrics, error: rubricErr } = await supabase.from("rubrics").insert(rubricRows).select("id");
  if (rubricErr || !rubrics || rubrics.length !== generated.questions.length) {
    console.error("Failed to insert rubrics:", rubricErr);
    await supabase.from("question_papers").delete().eq("id", paper.id);
    return { status: "error", message: rubricErr?.message ?? "Failed to save rubrics." };
  }

  const questionRows = generated.questions.map((q, i) => ({
    question_paper_id: paper.id,
    chapter_id: q.chapter_id,
    rubric_id: rubrics[i].id,
    question_number: i + 1,
    max_marks: q.max_marks || (q.question_type === "CQ" ? 10 : 1),
    question_type: q.question_type,
    stimulus_bn: q.stimulus_bn || null,
    stimulus_en: q.stimulus_en || null,
    sub_questions_json: q.sub_questions ? JSON.stringify(q.sub_questions) : null,
    mcq_options_json: q.mcq_options ? JSON.stringify(q.mcq_options) : null,
    mcq_correct_option: q.mcq_correct_option || null,
    question_text_bn: q.question_type === "MCQ" ? q.mcq_question_bn || "" : q.stimulus_bn || "",
    question_text_en: q.question_type === "MCQ" ? q.mcq_question_en || "" : q.stimulus_en || "",
  }));

  const { error: questionErr } = await supabase.from("questions").insert(questionRows);
  if (questionErr) {
    console.error("Failed to insert questions:", questionErr);
    await supabase.from("question_papers").delete().eq("id", paper.id);
    return { status: "error", message: questionErr.message };
  }

  // Redirect to Question Paper Viewer
  redirect(`/dashboard/practice/${paper.id}`);
}
