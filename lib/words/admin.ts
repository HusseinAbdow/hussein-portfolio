// GitHub-only admin check.
export function isAdminIdentity(
  identity: { provider: string; providerId: string } | null
): boolean {
  const adminGithubUserId = process.env.ADMIN_GITHUB_USER_ID;
  return (
    Boolean(adminGithubUserId) &&
    identity?.provider === "github" &&
    identity.providerId === adminGithubUserId
  );
}
