import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getSessionIdentity } from "@/lib/words/identity";
import { normalizeSubmission } from "@/lib/words/validation";
import { getRequestOrigin } from "@/lib/requestOrigin";
import { projects } from "@/lib/projects";
import { manualProjectsByIdentifier } from "@/lib/words/manualProjects";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sender for submission notifications.
const NOTIFICATION_FROM = "Hussein Abdow <notifications@husseinabdow.me>";
const NOTIFICATION_TO = "hussabdow@gmail.com";

function projectLabelFor(slug: string): string {
  return (
    projects.find((p) => p.slug === slug)?.title ??
    manualProjectsByIdentifier.get(slug)?.name ??
    slug.replace(/^gh:/, "")
  );
}

// Map constraint errors to client messages.
function checkConstraintMessage(message: string): string | null {
  if (message.includes("words_submissions_relationships_check")) {
    return "Please select between one and two valid relationships.";
  }
  if (message.includes("project_slugs_valid")) {
    return "There was a problem with the selected projects. Please review your selections and try again.";
  }
  if (message.includes("words_submissions_message_check")) {
    return "Your message must be between 10 and 300 characters.";
  }
  return null;
}

// Email the admin on create/update. Failures are logged only.
async function sendSubmissionNotification(options: {
  origin: string;
  kind: "created" | "updated";
  submitterName: string;
  provider: string;
  relationships: string[];
  projectSlugs: string[];
  message: string;
}): Promise<void> {
  try {
    const preview =
      options.message.length > 140
        ? `${options.message.slice(0, 140)}…`
        : options.message;
    const projectLines = options.projectSlugs
      .map((slug) => `  - ${projectLabelFor(slug)}`)
      .join("\n");

    const subject =
      options.kind === "updated"
        ? "Updated 'A Few Words' submission pending review"
        : "New 'A Few Words' submission pending review";
    const introLine =
      options.kind === "updated"
        ? `An "A Few Words" entry was edited and needs re-approval.`
        : `A new "A Few Words" submission is pending review.`;

    const { error } = await resend.emails.send({
      from: NOTIFICATION_FROM,
      to: NOTIFICATION_TO,
      subject,
      text: [
        introLine,
        "",
        `From: ${options.submitterName} (${options.provider})`,
        `Role(s): ${options.relationships.join(", ")}`,
        projectLines ? `Project(s):\n${projectLines}` : "Project(s): none",
        "",
        "Message preview:",
        `"""\n${preview}\n"""`,
        "",
        `Review it here: ${options.origin}/admin/words`,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend notification error:", error);
    }
  } catch (err) {
    console.error("Resend notification failure:", err);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const session = await getSessionIdentity(supabase);

    if (!session) {
      return NextResponse.json(
        { error: "Sign in to share a few words." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = normalizeSubmission(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { identity } = session;
    const admin = createSupabaseAdminClient();

    const { error } = await admin
      .from("words_submissions")
      .insert({
        provider: identity.provider,
        provider_id: identity.providerId,
        // GitHub columns: set for GitHub, null for LinkedIn.
        github_user_id: identity.provider === "github" ? identity.providerId : null,
        github_username: identity.provider === "github" ? identity.handle : null,
        display_name: identity.displayName,
        avatar_url: identity.avatarUrl,
        // GitHub URL is server-derived; LinkedIn URL is user-supplied.
        profile_url:
          identity.provider === "github"
            ? identity.profileUrl
            : parsed.data.linkedinProfileUrl ?? null,
        message: parsed.data.message,
        relationships: parsed.data.relationships,
        // NULL when no projects selected.
        project_slugs:
          parsed.data.projectSlugs.length > 0 ? parsed.data.projectSlugs : null,
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You already have an active submission — edit it instead of creating a new one." },
          { status: 409 }
        );
      }
      if (error.code === "23514") {
        return NextResponse.json(
          { error: checkConstraintMessage(error.message ?? "") ?? "Submission failed validation. Please review your message and selections." },
          { status: 400 }
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit. Please try again." },
        { status: 500 }
      );
    }

    // Notify on creation; edits notify in PATCH.
    await sendSubmissionNotification({
      origin: getRequestOrigin(request),
      kind: "created",
      submitterName:
        identity.displayName ??
        (identity.handle ? `@${identity.handle}` : identity.provider),
      provider: identity.provider,
      relationships: parsed.data.relationships,
      projectSlugs: parsed.data.projectSlugs,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true, status: "pending" });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Missing environment variable")) {
      console.error(err.message);
      return NextResponse.json(
        { error: "Server is not configured. Please try again later." },
        { status: 500 }
      );
    }
    console.error("Words submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}

// Edit own submission. Edits reset status to pending.
export async function PATCH(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const session = await getSessionIdentity(supabase);

    if (!session) {
      return NextResponse.json(
        { error: "Sign in to edit your entry." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = normalizeSubmission(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { identity } = session;
    const admin = createSupabaseAdminClient();

    // Edit target is the caller's own active row.
    const { data: existing } = await admin
      .from("words_submissions")
      .select("id")
      .eq("provider", identity.provider)
      .eq("provider_id", identity.providerId)
      .neq("status", "rejected")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { error: "You don't have an entry to edit yet." },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {
      message: parsed.data.message,
      relationships: parsed.data.relationships,
      project_slugs:
        parsed.data.projectSlugs.length > 0 ? parsed.data.projectSlugs : null,
      status: "pending",
    };
    // LinkedIn link is editable; GitHub URL stays server-derived.
    if (identity.provider === "linkedin_oidc") {
      updates.profile_url = parsed.data.linkedinProfileUrl ?? null;
    }

    const { error } = await admin
      .from("words_submissions")
      .update(updates)
      .eq("id", existing.id);

    if (error) {
      if (error.code === "23514") {
        return NextResponse.json(
          { error: checkConstraintMessage(error.message ?? "") ?? "Update failed validation. Please review your message and selections." },
          { status: 400 }
        );
      }
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update. Please try again." },
        { status: 500 }
      );
    }

    // Notify on edit as well.
    await sendSubmissionNotification({
      origin: getRequestOrigin(request),
      kind: "updated",
      submitterName:
        identity.displayName ??
        (identity.handle ? `@${identity.handle}` : identity.provider),
      provider: identity.provider,
      relationships: parsed.data.relationships,
      projectSlugs: parsed.data.projectSlugs,
      message: parsed.data.message,
    });

    // updated_at is set by trigger.
    return NextResponse.json({ success: true, status: "pending" });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Missing environment variable")) {
      console.error(err.message);
      return NextResponse.json(
        { error: "Server is not configured. Please try again later." },
        { status: 500 }
      );
    }
    console.error("Words edit error:", err);
    return NextResponse.json(
      { error: "Failed to update. Please try again." },
      { status: 500 }
    );
  }
}
