import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sanitizeNextPath } from "@/lib/words/identity";
import { getRequestOrigin } from "@/lib/requestOrigin";

export const dynamic = "force-dynamic";

const AUTH_NEXT_COOKIE = "words_auth_next";

export async function GET(request: Request) {
  const origin = getRequestOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieNext = sanitizeNextPath(cookies().get(AUTH_NEXT_COOKIE)?.value);
  const nextPath = cookieNext ?? sanitizeNextPath(searchParams.get("next"));

  try {
    const supabase = createSupabaseServerClient();

    if (!code) {
      return NextResponse.redirect(
        `${origin}${nextPath ?? "/"}?auth_error=missing_code`
      );
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Supabase OAuth exchange error:", error);
      return NextResponse.redirect(
        `${origin}${nextPath ?? "/"}?auth_error=exchange_failed`
      );
    }

    const response = NextResponse.redirect(`${origin}${nextPath ?? "/"}`);
    response.cookies.delete(AUTH_NEXT_COOKIE);
    return response;
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      `${origin}${nextPath ?? "/"}?auth_error=callback_failed`
    );
  }
}
