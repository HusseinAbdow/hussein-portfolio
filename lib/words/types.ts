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

// Snapshot of the signed-in visitor's own active (pending/approved)
// submission, resolved server-side by (provider, provider_id) — used to
// prefill the edit flow. Rejected rows are excluded (they allow re-creating).
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

// Legacy rows predate the provider column; the schema default ("github")
// keeps them identifiable, and anything unexpected is treated as github.
function normalizeProvider(provider: string): ProviderName {
  return (PROVIDER_VALUES as readonly string[]).includes(provider)
    ? (provider as ProviderName)
    : "github";
}

// Stable identity key used for display and uniqueness; legacy GitHub rows
// may not have provider_id populated yet, so fall back to github_user_id.
function identityKey(row: WordsSubmissionRow): string {
  return row.provider_id ?? (row.github_user_id != null ? String(row.github_user_id) : "");
}

function baseWordFields(row: WordsSubmissionRow) {
  return {
    id: row.id,
    provider: normalizeProvider(row.provider),
    providerId: identityKey(row),
    // GitHub handle is the username; LinkedIn rows use the curated
    // display_handle when set (never an identity value, display only).
    handle: row.github_username ?? row.display_handle,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    profileUrl: row.profile_url,
    message: row.message,
    relationships: row.relationships ?? [],
    // New multi-project array; fall back to the legacy single-value column
    // for any row that predates the backfill.
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
