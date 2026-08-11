import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Service-role client — bypasses RLS entirely. Server-only: never import this
 * from a Client Component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 * Used by Genkit flows (grading pipeline, ingestion) which legitimately need
 * cross-tenant access (e.g. writing grading_results for any institution).
 */
export function getServiceRoleClient() {
  if (typeof window !== "undefined") {
    throw new Error("getServiceRoleClient() must never be called from the browser.");
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
