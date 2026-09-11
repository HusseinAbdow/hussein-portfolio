import type { SupabaseClient, User } from "@supabase/supabase-js";

// Exact provider values shared with the words_submissions schema
// (see supabase/migrations/0002_words_multi_provider.sql).
export type ProviderName = "github" | "linkedin_oidc";

export interface ProviderIdentity {
  provider: ProviderName;
  // Stable provider-specific ID: GitHub's numeric provider_id,
  // or LinkedIn OIDC's `sub` claim. Never an email address.
  providerId: string;
  // GitHub username/handle. LinkedIn OIDC exposes no handle,
  // so this is null there — never fabricated.
  handle: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  profileUrl: string | null;
}

function deriveGithubIdentity(user: User): ProviderIdentity | null {
  const meta = user.user_metadata as Record<string, string | undefined>;
  const provider = meta?.provider ?? user.app_metadata?.provider;

  if (provider !== "github") return null;

  const providerId = meta?.provider_id ?? meta?.sub;
  const handle = meta?.user_name ?? meta?.preferred_username;

  if (!providerId || !handle) return null;

  return {
    provider: "github",
    providerId,
    handle,
    displayName: meta?.name ?? meta?.full_name ?? null,
    avatarUrl: meta?.avatar_url ?? null,
    profileUrl: meta?.profile ?? (handle ? `https://github.com/${handle}` : null),
  };
}

function deriveLinkedinOidcIdentity(user: User): ProviderIdentity | null {
  const meta = user.user_metadata as Record<string, string | undefined>;
  const provider = meta?.provider ?? user.app_metadata?.provider;

  if (provider !== "linkedin_oidc") return null;

  // LinkedIn's stable identity key is the OIDC `sub` claim. Supabase also
  // mirrors it as provider_id for OIDC providers — prefer the sub.
  const providerId = meta?.sub ?? meta?.provider_id;

  if (!providerId) return null;

  return {
    provider: "linkedin_oidc",
    providerId,
    handle: null,
    displayName: meta?.name ?? meta?.full_name ?? null,
    avatarUrl: meta?.picture ?? meta?.avatar_url ?? null,
    // LinkedIn OIDC exposes no public profile URL — none is fabricated.
    profileUrl: null,
  };
}

export function deriveProviderIdentity(user: User): ProviderIdentity | null {
  return deriveGithubIdentity(user) ?? deriveLinkedinOidcIdentity(user);
}

// Only allows safe in-app paths (e.g. "/?words=open", "/admin/words") to be
// carried through the OAuth flow as the post-sign-in redirect target.
export function sanitizeNextPath(raw: string | null | undefined): string | null {
  if (!raw || raw.length > 64) return null;
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//") || raw.includes("://") || raw.includes("\\")) {
    return null;
  }
  return raw;
}

export async function getSessionIdentity(
  supabase: SupabaseClient
): Promise<{ user: User; identity: ProviderIdentity } | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const identity = deriveProviderIdentity(user);
  if (!identity) return null;

  return { user, identity };
}
