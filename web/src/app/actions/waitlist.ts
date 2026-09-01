"use server";

import { z } from "zod";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bdPhone, examType, targetExamYear } from "@/lib/validation";
import { sendWaitlistVerification } from "@/lib/email/send-waitlist-verification";

const WaitlistInputSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: bdPhone.optional().or(z.literal("")),
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
  // Honeypot anti-spam check: invisible to human users
  const honeypot = formData.get("website");
  if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
    return {
      status: "success",
      message: "Please check your inbox to confirm your waitlist spot.",
    };
  }

  const signupRole = formData.get("signupRole") === "guardian" ? "guardian" : "student";
  // A parent/guardian signup is always on behalf of a student we treat as a minor.
  const isMinor = signupRole === "guardian" || formData.get("isMinor") === "on";
  const guardianConsentAcknowledged = formData.get("guardianConsentAcknowledged") === "on";

  const parsed = WaitlistInputSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
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
  // we collect contact data at all (docs/review §2.1).
  if (parsed.data.isMinor && !parsed.data.guardianConsentAcknowledged) {
    return {
      status: "error",
      message: "Please have a parent/guardian acknowledge the consent notice to continue.",
    };
  }

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("waitlist_signups")
    .insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      exam_type: parsed.data.examType,
      target_exam_year: parsed.data.targetExamYear,
      signup_role: parsed.data.signupRole,
      is_minor: parsed.data.isMinor,
      guardian_consent_acknowledged: parsed.data.guardianConsentAcknowledged,
    })
    .select("verify_token")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "This email address is already on the waitlist." };
    }
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Send double opt-in verification email asynchronously in the background
  if (inserted?.verify_token) {
    const token = inserted.verify_token;
    after(async () => {
      try {
        await sendWaitlistVerification({
          to: parsed.data.email,
          fullName: parsed.data.fullName,
          verifyToken: token,
          examType: parsed.data.examType,
          targetExamYear: parsed.data.targetExamYear,
        });
      } catch (err) {
        console.error("[WaitlistEmailSendFailed]", err);
      }
    });
  }

  return {
    status: "success",
    message: "You're on the list! Please check your email inbox to confirm your spot.",
  };
}
