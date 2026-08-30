"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { educationBoard, examType, academicGroup, targetExamYear } from "@/lib/validation";

const ProfileSchema = z.object({
  educationBoard,
  examType,
  academicGroup,
  targetExamYear,
  trainingDataOptIn: z.boolean(),
});

export type ProfileState = { status: "idle" | "success" | "error"; message?: string };

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const raw = {
    educationBoard: String(formData.get("educationBoard") ?? ""),
    examType: String(formData.get("examType") ?? ""),
    academicGroup: String(formData.get("academicGroup") ?? ""),
    targetExamYear: String(formData.get("targetExamYear") ?? ""),
    trainingDataOptIn: formData.get("trainingDataOptIn") === "on",
  };

  const parsed = ProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your answers." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Not signed in." };

  const { data: existing } = await supabase
    .from("student_profiles")
    .select("training_data_opt_in, training_data_opt_in_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const optInChanged = existing?.training_data_opt_in !== parsed.data.trainingDataOptIn;

  const { error } = await supabase
    .from("student_profiles")
    .update({
      education_board: parsed.data.educationBoard,
      exam_type: parsed.data.examType,
      academic_group: parsed.data.academicGroup,
      target_exam_year: parsed.data.targetExamYear,
      training_data_opt_in: parsed.data.trainingDataOptIn,
      training_data_opt_in_at: optInChanged ? new Date().toISOString() : existing?.training_data_opt_in_at,
    })
    .eq("user_id", user.id);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { status: "success", message: "Profile updated." };
}
