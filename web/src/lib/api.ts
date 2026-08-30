import { NextResponse } from "next/server";

/**
 * Consistent JSON error envelope for route handlers: `{ error, ...extra }`.
 * `extra` carries endpoint-specific fields (e.g. a user-facing `message` on
 * a rate-limit response).
 */
export function apiError(
  status: number,
  error: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error, ...extra }, { status });
}
