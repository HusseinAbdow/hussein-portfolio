// Resolves the public origin of an incoming request for OAuth redirects and
// absolute links.
//
// `request.url` alone is not trustworthy behind a reverse proxy: when the
// Next.js server is reached through one (Vercel's edge, nginx, any
// self-hosting setup), the internal Host can surface as localhost — baking
// e.g. "http://localhost:3000/api/auth/callback" into the Supabase OAuth
// redirect for real visitors. Standard proxies provide the actual public
// host and scheme in x-forwarded-host / x-forwarded-proto; prefer those and
// only fall back to request.url when they are absent (direct local dev).
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0].trim();
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto = forwardedProto?.split(",")[0].trim() || "https";
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}
