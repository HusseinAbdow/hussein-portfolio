import type { ProviderName } from "@/lib/words/identity";

export type WordsStatus = "pending" | "approved" | "rejected";
export type { ProviderName };

export interface ProviderIdentityPublic {
  provider: ProviderName;
  providerId: string;
  handle: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
}

export interface PublicWordSubmission {
  id: string;
  provider: ProviderName;
  handle: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  message: string;
  relationships: string[];
  projectSlugs: string[];
  createdAt: string;
}

export interface AdminWordSubmission extends PublicWordSubmission {
  status: WordsStatus;
  updatedAt: string;
}

// Visitor's own active submission, used to prefill the edit form.
export interface WordsExistingSubmission {
  id: string;
  status: "pending" | "approved";
  message: string;
  relationships: string[];
  projectSlugs: string[];
}

interface WordsSubmissionRow {
  id: string;
  provider: string;
  provider_id: string | null;
  github_user_id: string | number | null;
  github_username: string | null;
  display_handle: string | null;
  display_name: string | null;
  avatar_url: string | null;
  profile_url: string | null;
  message: string;
  relationships: string[] | null;
  project_slugs: string[] | null;
  project_slug: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const PROVIDER_VALUES: readonly ProviderName[] = ["github", "linkedin_oidc"];

// Old rows may lack provider/provider_id; default to github.
function normalizeProvider(provider: string): ProviderName {
  return (PROVIDER_VALUES as readonly string[]).includes(provider)
    ? (provider as ProviderName)
    : "github";
}

// Display key with fallback for old GitHub rows.
function identityKey(row: WordsSubmissionRow): string {
  return row.provider_id ?? (row.github_user_id != null ? String(row.github_user_id) : "");
}

function baseWordFields(row: WordsSubmissionRow) {
  return {
    id: row.id,
    provider: normalizeProvider(row.provider),
    providerId: identityKey(row),
    // GitHub username, else LinkedIn display_handle override.
    handle: row.github_username ?? row.display_handle,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    profileUrl: row.profile_url,
    message: row.message,
    relationships: row.relationships ?? [],
    // Prefer project_slugs, fall back to project_slug.
    projectSlugs:
      row.project_slugs ?? (row.project_slug ? [row.project_slug] : []),
    createdAt: row.created_at,
  };
}

export function toAdminWord(row: WordsSubmissionRow): AdminWordSubmission {
  return {
    ...baseWordFields(row),
    status: (["pending", "approved", "rejected"] as const).includes(
      row.status as WordsStatus
    )
      ? (row.status as WordsStatus)
      : "pending",
    updatedAt: row.updated_at,
  };
}

export function toPublicWord(row: WordsSubmissionRow): PublicWordSubmission {
  return baseWordFields(row);
}
