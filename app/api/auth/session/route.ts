import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getSessionIdentity } from "@/lib/words/identity";
import type { WordsExistingSubmission } from "@/lib/words/types";

export const dynamic = "force-dynamic";

// Looks up the caller's own active (pending/approved) submission by the same
// (provider, provider_id) pair the one-active-submission constraint uses.
// Rejected rows are excluded — the visitor can create a fresh submission.
async function getExistingSubmission(
  provider: string,
  providerId: string
): Promise<WordsExistingSubmission | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("words_submissions")
    .select("id, status, message, relationships, project_slugs")
    .eq("provider", provider)
    .eq("provider_id", providerId)
    .neq("status", "rejected")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data || (data.status !== "pending" && data.status !== "approved")) {
    return null;
  }

  return {
    id: data.id,
    status: data.status,
    message: data.message,
    relationships: data.relationships ?? [],
    projectSlugs: data.project_slugs ?? [],
  };
}

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const session = await getSessionIdentity(supabase);

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    const { identity } = session;
    const existingSubmission = await getExistingSubmission(
      identity.provider,
      identity.providerId
    );

    return NextResponse.json({
      authenticated: true,
      identity: {
        provider: identity.provider,
        providerId: identity.providerId,
        handle: identity.handle,
        displayName: identity.displayName,
        avatarUrl: identity.avatarUrl,
        profileUrl: identity.profileUrl,
      },
      existingSubmission,
    });
  } catch (err) {
    console.error("Session route error:", err);
    return NextResponse.json(
      { error: "Failed to resolve session." },
      { status: 500 }
    );
  }
}
