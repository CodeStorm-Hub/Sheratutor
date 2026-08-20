import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes under /api that don't require a logged-in student: the internal
// worker route is protected by its own shared-secret check instead, and the
// OAuth callback runs before a session cookie exists.
const PUBLIC_API_PREFIXES = ["/api/internal/"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // Required: touching auth.getUser() is what actually refreshes the session cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Centralized, additive route protection — a second layer on top of (not a
  // replacement for) each page/route's own auth.getUser() check, since
  // removing those checks entirely would need a full RLS policy audit first
  // to be safe (see redesign plan §4 risks).
  if (!user) {
    if (pathname.startsWith("/dashboard")) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (pathname.startsWith("/api/") && !PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  return supabaseResponse;
}
