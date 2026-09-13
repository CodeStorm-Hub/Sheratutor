import type { SupabaseClient } from "@supabase/supabase-js";

/** Bucket for student answer-script page photos (private). */
export const SUBMISSION_PAGES_BUCKET = "submission-pages";

/** Signed URL lifetime for OCR/grading (1 hour). */
export const GRADING_SIGNED_URL_TTL_SEC = 60 * 60;

/** Signed URL lifetime for dashboard display (2 hours). */
export const DISPLAY_SIGNED_URL_TTL_SEC = 60 * 60 * 2;

/**
 * Storage object path owned by `userId`, e.g. `{uid}/{folder}/1.jpg`.
 * Rejects absolute URLs, traversal, and paths that escape the user folder.
 */
export function isOwnedSubmissionPagePath(userId: string, path: string): boolean {
  if (!userId || !path) return false;
  if (path.includes("://") || path.includes("..") || path.startsWith("/")) return false;
  const normalized = path.replace(/^\/+/, "");
  const prefix = `${userId}/`;
  if (!normalized.startsWith(prefix)) return false;
  const rest = normalized.slice(prefix.length);
  // Expect `{folder}/{page}.jpg|webp|png` — at least one nested segment.
  return rest.length > 0 && !rest.includes("..") && rest.includes("/");
}

/**
 * True when `value` looks like a legacy http(s) URL stored before path-based uploads.
 */
export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * Resolve a stored page reference (storage path or legacy public URL) to a
 * fetchable URL. Paths are signed; legacy http URLs are returned as-is.
 */
export async function resolveSubmissionPageUrl(
  supabase: SupabaseClient,
  stored: string,
  expiresIn = DISPLAY_SIGNED_URL_TTL_SEC
): Promise<string> {
  if (!stored) return stored;
  if (isHttpUrl(stored)) return stored;

  const { data, error } = await supabase.storage
    .from(SUBMISSION_PAGES_BUCKET)
    .createSignedUrl(stored, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "failed to sign submission page URL");
  }
  return data.signedUrl;
}

export async function resolveSubmissionPageUrls(
  supabase: SupabaseClient,
  storedUrls: string[],
  expiresIn = DISPLAY_SIGNED_URL_TTL_SEC
): Promise<string[]> {
  return Promise.all(storedUrls.map((u) => resolveSubmissionPageUrl(supabase, u, expiresIn)));
}
