import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";
import { getSessionIdentity } from "@/lib/words/identity";
import { isAdminIdentity } from "@/lib/words/admin";
import WordsAdmin from "@/components/words/WordsAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Words — Moderation | Hussein Abdow",
  robots: { index: false, follow: false },
};

export default async function AdminWordsPage() {
  try {
    const supabase = createSupabaseServerClient();
    const session = await getSessionIdentity(supabase);

    // Server-side authorization: only the configured admin GitHub ID passes.
    // Everything else — including signed-in non-admins — gets a 404 so the
    // route's existence isn't revealed.
    if (!session || !isAdminIdentity(session.identity)) {
      notFound();
    }

    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("words_submissions")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Admin words page data check failed:", error);
      notFound();
    }

    return <WordsAdmin />;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Missing environment variable")) {
      console.error(err.message);
    }
    notFound();
  }
}
