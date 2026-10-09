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

// Self-reported LinkedIn link. Not identity; validated format only.
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
        // Case-study slug or "gh:<name>" from the manual list.
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

export const ADMIN_DISPLAY_NAME_MAX_LENGTH = 80;
export const ADMIN_HANDLE_MIN_LENGTH = 2;
export const ADMIN_HANDLE_MAX_LENGTH = 40;

function sanitizeAdminDisplayNameValue(raw: string): string {
  return raw
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Admin display name: empty clears to null.
export function parseAdminDisplayName(raw: unknown): { present: false } | { present: true; value: string | null; error?: string } {
  if (raw === undefined) return { present: false };
  if (raw === null) return { present: true, value: null };
  if (typeof raw !== "string") return { present: true, value: null, error: "Invalid display name." };
  const cleaned = sanitizeAdminDisplayNameValue(raw);
  if (cleaned.length === 0) return { present: true, value: null };
  if (cleaned.length > ADMIN_DISPLAY_NAME_MAX_LENGTH) {
    return { present: true, value: null, error: "Display name is too long (max 80 characters)." };
  }
  return { present: true, value: cleaned };
}

// Admin handle: empty clears to null.
export function parseAdminDisplayHandle(raw: unknown): { present: false } | { present: true; value: string | null; error?: string } {
  if (raw === undefined) return { present: false };
  if (raw === null) return { present: true, value: null };
  if (typeof raw !== "string") return { present: true, value: null, error: "Invalid handle." };
  const cleaned = raw.trim().replace(/^@+/, "");
  if (cleaned.length === 0) return { present: true, value: null };
  if (
    cleaned.length < ADMIN_HANDLE_MIN_LENGTH ||
    cleaned.length > ADMIN_HANDLE_MAX_LENGTH ||
    !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(cleaned) ||
    /[_-]$/.test(cleaned)
  ) {
    return { present: true, value: null, error: "Handle must be 2-40 characters (letters, numbers, _ or -, no trailing _/-)." };
  }
  return { present: true, value: cleaned };
}

function normalizeGithubProfileUrl(raw: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") return null;
  const match = parsed.pathname.match(/^\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)\/?$/);
  if (!match) return null;
  return `https://github.com/${match[1]}`;
}

// Admin profile link: empty clears to null.
export function parseAdminProfileUrl(raw: unknown): { present: false } | { present: true; value: string | null; error?: string } {
  if (raw === undefined) return { present: false };
  if (raw === null) return { present: true, value: null };
  if (typeof raw !== "string") return { present: true, value: null, error: "Invalid profile link." };
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { present: true, value: null };
  if (trimmed.length > LINKEDIN_URL_MAX_LENGTH) {
    return { present: true, value: null, error: "Profile link is too long." };
  }
  const linkedin = normalizeLinkedinProfileUrl(trimmed);
  if (linkedin) return { present: true, value: linkedin };
  const github = normalizeGithubProfileUrl(trimmed);
  if (github) return { present: true, value: github };
  return { present: true, value: null, error: "Use a linkedin.com/in/... or github.com/... link." };
}

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
