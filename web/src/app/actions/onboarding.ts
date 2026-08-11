"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const OnboardingSchema = z.object({
  dateOfBirth: z.string().date(),
  educationBoard: z.enum([
    "DHAKA", "RAJSHAHI", "COMILLA", "BARISAL", "SYLHET",
    "CHITTAGONG", "JESSORE", "DINAJPUR", "MYMENSINGH", "MADRASAH", "TECHNICAL",
  ]),
  examType: z.enum(["SSC", "HSC"]),
  academicGroup: z.enum(["SCIENCE", "HUMANITIES", "BUSINESS_STUDIES"]),
  targetExamYear: z.coerce.number().int().min(2026).max(2030),
  guardianPhone: z.string().optional(),
  guardianConsentGiven: z.boolean(),
});

export type OnboardingState = { status: "idle" | "error"; message?: string };

function isMinor(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return dob > cutoff;
}

export async function completeOnboarding(_prev: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const raw = {
    dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
    educationBoard: String(formData.get("educationBoard") ?? ""),
    examType: String(formData.get("examType") ?? ""),
    academicGroup: String(formData.get("academicGroup") ?? ""),
    targetExamYear: String(formData.get("targetExamYear") ?? ""),
    guardianPhone: String(formData.get("guardianPhone") ?? ""),
    guardianConsentGiven: formData.get("guardianConsentGiven") === "on",
  };

  const parsed = OnboardingSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your answers." };
  }

  const minor = isMinor(parsed.data.dateOfBirth);

  // PDPA 2026 hard gate (docs/review §2.1): a minor's profile cannot be
  // created — not "created and then flagged" — without acknowledged
  // guardian consent and a guardian contact on file.
  if (minor && (!parsed.data.guardianConsentGiven || !parsed.data.guardianPhone)) {
    return {
      status: "error",
      message:
        "Since you're under 18, we need a parent or guardian's phone number and their " +
        "confirmation before we can create your account.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("student_profiles").upsert(
    {
      user_id: user!.id,
      education_board: parsed.data.educationBoard,
      exam_type: parsed.data.examType,
      academic_group: parsed.data.academicGroup,
      target_exam_year: parsed.data.targetExamYear,
      date_of_birth: parsed.data.dateOfBirth,
      guardian_phone: minor ? parsed.data.guardianPhone : null,
      // NOTE: this is acknowledgement-based consent, sufficient for the pilot.
      // Before scaling past the pilot, replace with real guardian-side SMS-OTP
      // verification (send a code to guardian_phone, confirm it server-side)
      // rather than trusting a checkbox the student themselves can tick.
      guardian_consent_at: minor ? new Date().toISOString() : null,
      guardian_consent_method: minor ? "CHECKBOX_ACK_PILOT" : null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect("/dashboard");
}
