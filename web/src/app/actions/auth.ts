"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { credentials as CredentialsSchema } from "@/lib/validation";

export type AuthState = { status: "idle" | "error"; message?: string };

export async function signUpWithEmail(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = CredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your details." };
  }
  const fullName = String(formData.get("fullName") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: fullName } },
  });

  if (error) return { status: "error", message: error.message };
  redirect("/onboarding");
}

export async function signInWithEmail(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = CredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { status: "error", message: error.message };
  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error || !data.url) redirect("/login?error=oauth");
  // Supabase returns an absolute external OAuth URL, which typedRoutes can't model.
  redirect(data.url as Route);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
