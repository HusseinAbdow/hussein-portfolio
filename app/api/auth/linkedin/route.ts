import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sanitizeNextPath } from "@/lib/words/identity";

export const dynamic = "force-dynamic";

// Shares the same Supabase callback route as GitHub OAuth — the callback is
// provider-agnostic (exchangeCodeForSession works for either provider).
const AUTH_NEXT_COOKIE = "words_auth_next";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const { searchParams } = new URL(request.url);
  const nextPath = sanitizeNextPath(searchParams.get("next"));

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    });

    if (error || !data.url) {
      return NextResponse.redirect(
        `${origin}${nextPath ?? "/"}?auth_error=oauth_start_failed`
      );
    }

    const response = NextResponse.redirect(data.url);
    if (nextPath) {
      response.cookies.set(AUTH_NEXT_COOKIE, nextPath, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 600,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  } catch (err) {
    console.error("LinkedIn sign-in error:", err);
    return NextResponse.redirect(
      `${origin}${nextPath ?? "/"}?auth_error=not_configured`
    );
  }
}
