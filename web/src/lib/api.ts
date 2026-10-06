import { NextResponse } from "next/server";

/**
 * Consistent JSON error envelope for route handlers: `{ error, ...extra }`.
 * `extra` carries endpoint-specific fields (e.g. a user-facing `message` on
 * a rate-limit response).
 *
 * Security: 5xx responses NEVER carry raw error text to the client — database
 * and driver messages disclose table/column/constraint names. Pass the raw
 * error via `internal` for server-side logging; the client receives a generic
 * message instead.
 */
export function apiError(
  status: number,
  error: string,
  extra?: Record<string, unknown> & { internal?: unknown },
) {
  const { internal, ...safeExtra } = extra ?? {};
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(`[api] ${status} ${error}`, internal ?? "");
    return NextResponse.json(
      { error: "Something went wrong. Please try again.", ...safeExtra },
      { status },
    );
  }
  return NextResponse.json({ error, ...safeExtra }, { status });
}
