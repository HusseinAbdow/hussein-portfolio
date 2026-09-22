import { z } from "zod";
import { collaborativeProjects } from "@/lib/projects";
import { manualProjectsByIdentifier } from "@/lib/words/manualProjects";

export const RELATIONSHIP_VALUES = [
  "Collaborator",
  "Classmate",
  "Coworker",
  "Client",
  "Advisor",
  "Other",
] as const;

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 300;
export const MAX_RELATIONSHIPS = 2;
export const MAX_PROJECTS = 3;
export const LINKEDIN_URL_MAX_LENGTH = 300;

const collaborativeSlugs = new Set(collaborativeProjects.map((p) => p.slug));

// Self-reported LinkedIn profile link. This is NOT an identity claim — it
// never influences provider_id, name, or avatar, which stay server-derived
// from the Supabase session. Returns a normalized profile URL, or null if
// the input is not a plausible linkedin.com/in/... URL.
function normalizeLinkedinProfileUrl(raw: string): string | null {
  if (raw.length > LINKEDIN_URL_MAX_LENGTH) return null;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (parsed.hostname !== "linkedin.com" && parsed.hostname !== "www.linkedin.com") {
    return null;
  }
  if (!/^\/in\/[A-Za-z0-9][A-Za-z0-9_-]{1,98}\/?$/.test(parsed.pathname)) return null;

  return `https://${parsed.hostname}${parsed.pathname}`;
}

export const wordsSubmissionSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(MESSAGE_MIN_LENGTH, "Message is too short.")
      .max(MESSAGE_MAX_LENGTH, `Message must be at most ${MESSAGE_MAX_LENGTH} characters.`),
    relationships: z
      .array(z.enum(RELATIONSHIP_VALUES))
      .min(1, "Select at least one relationship.")
      .max(MAX_RELATIONSHIPS, "Select at most two relationships."),
    projectSlugs: z
      .array(z.string().trim())
      .max(MAX_PROJECTS, `Select at most ${MAX_PROJECTS} projects.`)
      .nullable()
      .optional(),
    linkedinProfileUrl: z.string().trim().max(LINKEDIN_URL_MAX_LENGTH).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (new Set(data.relationships).size !== data.relationships.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["relationships"],
        message: "Relationship selections must be unique.",
      });
    }

    if (data.linkedinProfileUrl && !normalizeLinkedinProfileUrl(data.linkedinProfileUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["linkedinProfileUrl"],
        message: "Please provide a valid LinkedIn profile URL (linkedin.com/in/…).",
      });
    }

    const includesCollaborator = data.relationships.includes("Collaborator");

    if (data.projectSlugs && data.projectSlugs.length > 0) {
      if (!includesCollaborator) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["projectSlugs"],
          message: "A project can only be associated with the Collaborator relationship.",
        });
      }

      if (new Set(data.projectSlugs).size !== data.projectSlugs.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["projectSlugs"],
          message: "Project selections must be unique.",
        });
      }

      for (const slug of data.projectSlugs) {
        // Valid identifiers: collaborative case-study slugs (lib/projects.ts)
        // or "gh:<name>" identifiers from the static manual list
        // (lib/words/manualProjects.ts) — a plain static set, no fetch.
        if (slug.startsWith("gh:")) {
          if (!manualProjectsByIdentifier.has(slug)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["projectSlugs"],
              message: "Unknown project.",
            });
          }
        } else if (!collaborativeSlugs.has(slug)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["projectSlugs"],
            message: "Unknown project.",
          });
        }
      }
    }
  });

export type WordsSubmissionInput = z.infer<typeof wordsSubmissionSchema>;

export function sanitizeMessage(raw: string): string {
  return raw
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSubmission(raw: unknown) {
  const parsed = wordsSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }

  const message = sanitizeMessage(parsed.data.message);
  if (message.length < MESSAGE_MIN_LENGTH) {
    return { success: false as const, error: "Message is too short." };
  }

  const includesCollaborator = parsed.data.relationships.includes("Collaborator");
  const projectSlugs = includesCollaborator
    ? Array.from(new Set(parsed.data.projectSlugs ?? []))
    : [];

  const linkedinProfileUrl = parsed.data.linkedinProfileUrl
    ? normalizeLinkedinProfileUrl(parsed.data.linkedinProfileUrl)
    : null;

  return {
    success: true as const,
    data: {
      message,
      relationships: Array.from(new Set(parsed.data.relationships)),
      projectSlugs,
      linkedinProfileUrl,
    },
  };
}
