"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const CYCLE_DAYS = 14;
const MAX_CHAPTERS = 8;

type ScheduleDay = {
  day: number;
  chapters: { chapterId: string; title: string; subject: string; weaknessScore: number }[];
};

/**
 * Deterministic, not AI-generated: this is a scheduling problem over
 * already-computed weakness_logs.weakness_score, not a text-generation
 * problem, so no LLM call is needed. Weaker chapters get more review slots
 * across a 14-day cycle, spread out rather than clustered.
 */
export async function generateStudyPlan(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) return;

  type WeaknessRow = {
    chapter_id: string;
    weakness_score: number;
    chapters: { title_en: string; subjects: { name_en: string } | null } | null;
  };

  const { data: weaknessesRaw } = await supabase
    .from("weakness_logs")
    .select("chapter_id, weakness_score, chapters(title_en, subjects(name_en))")
    .eq("student_id", profile.id)
    .order("weakness_score", { ascending: false })
    .limit(MAX_CHAPTERS);
  const weaknesses = (weaknessesRaw ?? []) as unknown as WeaknessRow[];

  let chapters = weaknesses.map((w) => ({
    chapterId: w.chapter_id,
    title: w.chapters?.title_en ?? "Chapter",
    subject: w.chapters?.subjects?.name_en ?? "Subject",
    weaknessScore: Number(w.weakness_score ?? 0.5),
  }));

  // No graded history yet — fall back to a generic starter plan over the
  // first few chapters instead of an empty schedule.
  if (chapters.length === 0) {
    type ChapterRow = { id: string; chapter_no: number; title_en: string; subjects: { name_en: string } | null };
    const { data: fallbackRaw } = await supabase
      .from("chapters")
      .select("id, chapter_no, title_en, subjects(name_en)")
      .order("chapter_no")
      .limit(MAX_CHAPTERS);
    const fallback = (fallbackRaw ?? []) as unknown as ChapterRow[];
    chapters = fallback.map((c) => ({
      chapterId: c.id,
      title: c.title_en,
      subject: c.subjects?.name_en ?? "Subject",
      weaknessScore: 0.5,
    }));
  }

  const days: ScheduleDay[] = Array.from({ length: CYCLE_DAYS }, (_, i) => ({ day: i + 1, chapters: [] }));

  for (const chapter of chapters) {
    const frequency = Math.max(1, Math.min(4, Math.round(chapter.weaknessScore * 4)));
    for (let k = 0; k < frequency; k++) {
      const dayIndex = Math.floor((k * CYCLE_DAYS) / frequency);
      days[dayIndex].chapters.push(chapter);
    }
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + CYCLE_DAYS - 1);

  const { error: deactivateError } = await supabase
    .from("study_plans")
    .update({ is_active: false })
    .eq("student_id", profile.id)
    .eq("is_active", true);
  if (deactivateError) console.error("generateStudyPlan: deactivate failed:", deactivateError.message);

  const { error: insertError } = await supabase.from("study_plans").insert({
    student_id: profile.id,
    start_date: startDate.toISOString().slice(0, 10),
    end_date: endDate.toISOString().slice(0, 10),
    daily_schedule_json: { cycleDays: CYCLE_DAYS, days },
    is_active: true,
  });
  if (insertError) console.error("generateStudyPlan: insert failed:", insertError.message);

  revalidatePath("/dashboard/study-plan");
}
