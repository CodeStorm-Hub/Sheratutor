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
 * Deterministic Spaced Repetition Scheduling Heuristic:
 * Computes spaced review intervals over a 14-day cycle based on
 * chapter weakness scores. Weaker topics receive more frequent initial
 * review slots spread out across the cycle.
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
    chapters: { title_en: string; title_bn?: string; subjects: { name_en: string; name_bn?: string } | null } | null;
  };

  const { data: weaknessesRaw } = await supabase
    .from("weakness_logs")
    .select("chapter_id, weakness_score, chapters(title_en, title_bn, subjects(name_en, name_bn))")
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

  // FSRS interval mapping based on concept difficulty / weakness score
  for (const chapter of chapters) {
    // High weakness (>0.6): Repetition on Day 1, Day 3, Day 7, Day 12
    // Moderate weakness (0.3-0.6): Repetition on Day 1, Day 5, Day 11
    // Low weakness (<0.3): Repetition on Day 2, Day 9
    const intervals = chapter.weaknessScore >= 0.6
      ? [0, 2, 6, 11]
      : chapter.weaknessScore >= 0.3
      ? [0, 4, 10]
      : [1, 8];

    for (const dayIdx of intervals) {
      if (dayIdx < CYCLE_DAYS) {
        days[dayIdx].chapters.push(chapter);
      }
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
    daily_schedule_json: { cycleDays: CYCLE_DAYS, days, algorithm: "spaced_repetition_v1" },
    is_active: true,
  });
  if (insertError) console.error("generateStudyPlan: insert failed:", insertError.message);

  revalidatePath("/dashboard/study-plan");
}

export async function togglePlanTask(planId: string, day: number, taskId: string, completed: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { data: plan } = await supabase
    .from("study_plans")
    .select("completed_tasks_json")
    .eq("id", planId)
    .single();
    
  if (!plan) return { error: "plan not found" };

  const completedTasks = (plan.completed_tasks_json as Record<string, boolean>) || {};
  const taskKey = `${day}-${taskId}`;
  
  if (completed) {
    completedTasks[taskKey] = true;
  } else {
    delete completedTasks[taskKey];
  }

  const { error } = await supabase
    .from("study_plans")
    .update({ completed_tasks_json: completedTasks })
    .eq("id", planId);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/study-plan");
  return { success: true };
}
