import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Break-glass operator email, used ONLY when ADMIN_EMAILS is not configured.
 * Prefer setting ADMIN_EMAILS (comma-separated) in the deployment environment so
 * admin access can be rotated without a code change.
 */
const BREAK_GLASS_EMAIL = "syed.salman.reza.181@gmail.com";

function resolveEmailAllowlist(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [];
  if (fromEnv.length > 0) return fromEnv;
  // eslint-disable-next-line no-console
  console.warn(
    "[admin] ADMIN_EMAILS is not set — falling back to the break-glass operator email. " +
      "Set ADMIN_EMAILS in the environment to manage admin access without code changes."
  );
  return [BREAK_GLASS_EMAIL];
}

const EMAIL_ALLOWLIST = resolveEmailAllowlist();

const ADMIN_ROLES = new Set(["INST_ADMIN", "GOVT_ADMIN"]);

/**
 * Admin access: DB role (INST_ADMIN / GOVT_ADMIN) preferred; email allowlist
 * remains as a break-glass for operators without elevated profiles.
 */
export async function isDashboardAdmin(user: User): Promise<boolean> {
  if (user.email && EMAIL_ALLOWLIST.includes(user.email.toLowerCase())) {
    return true;
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return Boolean(profile?.role && ADMIN_ROLES.has(profile.role));
}
