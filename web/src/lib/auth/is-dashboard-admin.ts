import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const EMAIL_ALLOWLIST = [
  "syed.salman.reza.181@gmail.com",
  ...(process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : []),
];

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
