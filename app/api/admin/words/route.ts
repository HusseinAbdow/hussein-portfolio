import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getSessionIdentity } from "@/lib/words/identity";
import { isAdminIdentity } from "@/lib/words/admin";
import { toAdminWord } from "@/lib/words/types";
import { parseAdminDisplayHandle, parseAdminDisplayName, parseAdminProfileUrl } from "@/lib/words/validation";
import type { WordsStatus } from "@/lib/words/types";

export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function requireAdminSession() {
  const supabase = createSupabaseServerClient();
  const session = await getSessionIdentity(supabase);

  if (!session) {
    return {
      guard: NextResponse.json(
        { error: "Sign in to continue." },
        { status: 401 }
      ),
    };
  }

  if (!isAdminIdentity(session.identity)) {
    return {
      guard: NextResponse.json(
        { error: "You do not have access to moderation." },
        { status: 403 }
      ),
    };
  }

  return { session };
}

export async function GET() {
  try {
    const { guard } = await requireAdminSession();
    if (guard) return guard;

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("words_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin words fetch error:", error);
      return NextResponse.json(
        { error: "Failed to load submissions." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      submissions: (data ?? []).map(toAdminWord),
    });
  } catch (err) {
    console.error("Admin words route error:", err);
    return NextResponse.json(
      { error: "Failed to load submissions." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { guard } = await requireAdminSession();
    if (guard) return guard;

    const body = await request.json().catch(() => null);
    const id = typeof body?.id === "string" ? body.id : null;
    const action = body?.action;

    if (!id || !UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Invalid submission reference." },
        { status: 400 }
      );
    }

    if (action === "edit" || action === "update" || action === "details") {
      const displayNameRaw = body?.displayName ?? body?.display_name;
      const displayHandleRaw = body?.displayHandle ?? body?.display_handle;
      const profileUrlRaw = body?.profileUrl ?? body?.profile_url;

      const parsedName = parseAdminDisplayName(displayNameRaw);
      const parsedHandle = parseAdminDisplayHandle(displayHandleRaw);
      const parsedUrl = parseAdminProfileUrl(profileUrlRaw);

      if (!parsedName.present && !parsedHandle.present && !parsedUrl.present) {
        return NextResponse.json(
          { error: "Nothing to update." },
          { status: 400 }
        );
      }
      if (parsedName.present && parsedName.error) {
        return NextResponse.json({ error: parsedName.error }, { status: 400 });
      }
      if (parsedHandle.present && parsedHandle.error) {
        return NextResponse.json({ error: parsedHandle.error }, { status: 400 });
      }
      if (parsedUrl.present && parsedUrl.error) {
        return NextResponse.json({ error: parsedUrl.error }, { status: 400 });
      }

      const admin = createSupabaseAdminClient();
      const { data: existing, error: fetchError } = await admin
        .from("words_submissions")
        .select("id, provider")
        .eq("id", id)
        .maybeSingle();

      if (fetchError) {
        console.error("Admin words fetch error:", fetchError);
        return NextResponse.json(
          { error: "Failed to update the submission." },
          { status: 500 }
        );
      }
      if (!existing) {
        return NextResponse.json(
          { error: "Submission not found." },
          { status: 404 }
        );
      }

      if (
        parsedHandle.present &&
        parsedHandle.value !== null &&
        existing.provider === "github"
      ) {
        return NextResponse.json(
          { error: "Handle editing applies to LinkedIn entries only." },
          { status: 400 }
        );
      }

      const updates: Record<string, string | null> = {};
      if (parsedName.present) updates.display_name = parsedName.value;
      if (parsedHandle.present) updates.display_handle = parsedHandle.value;
      if (parsedUrl.present) updates.profile_url = parsedUrl.value;

      const { data, error } = await admin
        .from("words_submissions")
        .update(updates)
        .eq("id", id)
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Admin words details update error:", error);
        return NextResponse.json(
          { error: "Failed to update the submission." },
          { status: 500 }
        );
      }
      if (!data) {
        return NextResponse.json(
          { error: "Submission not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ submission: toAdminWord(data) });
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Unknown moderation action." },
        { status: 400 }
      );
    }

    const status: WordsStatus = action === "approve" ? "approved" : "rejected";
    const admin = createSupabaseAdminClient();

    // Only pending rows can change status.
    const { data, error } = await admin
      .from("words_submissions")
      .update({ status })
      .eq("id", id)
      .eq("status", "pending")
      .select("id, status")
      .maybeSingle();

    if (error) {
      console.error("Admin words update error:", error);
      return NextResponse.json(
        { error: "Failed to update the submission." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "This submission was already reviewed." },
        { status: 409 }
      );
    }

    return NextResponse.json({ id: data.id, status: data.status });
  } catch (err) {
    console.error("Admin words PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update the submission." },
      { status: 500 }
    );
  }
}
