import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Memoized wrapper around supabase.auth.getUser() to prevent redundant
 * roundtrips during a single React render pass.
 * Call this in Layouts and Pages instead of doing it manually.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
});
