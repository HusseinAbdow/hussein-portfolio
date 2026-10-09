import type { SupabaseClient, User } from "@supabase/supabase-js";

// Provider values match supabase/migrations/0002.
export type ProviderName = "github" | "linkedin_oidc";

export interface ProviderIdentity {
  provider: ProviderName;
  // GitHub numeric id or LinkedIn OIDC sub. Never email.
  providerId: string;
  // GitHub username. Null for LinkedIn (no handle from OIDC).
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

  const providerId = meta?.sub ?? meta?.provider_id;
  if (!providerId) return null;

  return {
    provider: "linkedin_oidc",
    providerId,
    handle: null,
    displayName: meta?.name ?? meta?.full_name ?? null,
    avatarUrl: meta?.picture ?? meta?.avatar_url ?? null,
    profileUrl: null,
  };
}

export function deriveProviderIdentity(user: User): ProviderIdentity | null {
  return deriveGithubIdentity(user) ?? deriveLinkedinOidcIdentity(user);
}

// Allows only in-app paths as OAuth redirect targets.
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
