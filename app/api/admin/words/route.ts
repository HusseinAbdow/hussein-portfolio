import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getSessionIdentity } from "@/lib/words/identity";
import { isAdminIdentity } from "@/lib/words/admin";
import { toAdminWord } from "@/lib/words/types";
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

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Unknown moderation action." },
        { status: 400 }
      );
    }

    const status: WordsStatus = action === "approve" ? "approved" : "rejected";
    const admin = createSupabaseAdminClient();

    // Restricted to pending rows so already-reviewed submissions can't be
    // flipped again by a replayed request.
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
