"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { bdPhone, examType, targetExamYear } from "@/lib/validation";

const WaitlistInputSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: bdPhone,
  email: z.string().email().optional().or(z.literal("")),
  examType,
  targetExamYear,
  signupRole: z.enum(["student", "guardian"]).default("student"),
  isMinor: z.boolean(),
  guardianConsentAcknowledged: z.boolean(),
});

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const signupRole = formData.get("signupRole") === "guardian" ? "guardian" : "student";
  // A parent/guardian signup is always on behalf of a student we treat as a minor.
  const isMinor = signupRole === "guardian" || formData.get("isMinor") === "on";
  const guardianConsentAcknowledged = formData.get("guardianConsentAcknowledged") === "on";

  const parsed = WaitlistInputSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email") || "",
    examType: formData.get("examType"),
    targetExamYear: formData.get("targetExamYear"),
    signupRole,
    isMinor,
    guardianConsentAcknowledged,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  // PDPA 2026: under-18 signups require acknowledged guardian consent before
  // we collect contact data at all (docs/review §2.1). Enforced again here,
  // not just client-side, and again by the DB check constraint on the table.
  if (parsed.data.isMinor && !parsed.data.guardianConsentAcknowledged) {
    return {
      status: "error",
      message: "Please have a parent/guardian acknowledge the consent notice to continue.",
    };
  }

  // Public unauthenticated insert — RLS's waitlist_signups_insert_public
  // policy already permits this for `anon`, so this never needs the
  // service-role key (which bypasses RLS entirely and shouldn't be reached
  // for from a form a stranger on the internet can submit).
  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_signups").insert({
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    exam_type: parsed.data.examType,
    target_exam_year: parsed.data.targetExamYear,
    signup_role: parsed.data.signupRole,
    is_minor: parsed.data.isMinor,
    guardian_consent_acknowledged: parsed.data.guardianConsentAcknowledged,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "This phone number is already on the waitlist." };
    }
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "You're on the list! We'll text you when SheraTutor is ready." };
}
