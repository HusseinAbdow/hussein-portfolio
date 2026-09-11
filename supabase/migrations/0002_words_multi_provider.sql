-- 0002: Support a second authentication provider (LinkedIn OIDC) for
-- "A Few Words" submissions, while keeping every existing GitHub row and
-- behavior intact. This migration is additive and backward-compatible.
--
-- Provider values are fixed and shared with application logic
-- (lib/words/identity.ts): 'github' | 'linkedin_oidc'.
--
-- Safety notes:
-- * No table is dropped or recreated; no existing column is removed.
-- * Existing data (message, relationships, project, status, timestamps,
--   GitHub identity fields) is untouched.
-- * Existing GitHub rows keep github_user_id / github_username populated
--   and gain provider = 'github', so they remain identifiable as GitHub
--   submissions.
-- * Writes still go through the server (service-role client) only; no
--   INSERT/UPDATE/DELETE RLS policies are added.
-- * Public read policy (approved only) is unchanged.

begin;

-- 1) Provider column + generic provider-specific identity ID.
alter table public.words_submissions
  add column provider text not null default 'github'
    check (provider in ('github', 'linkedin_oidc')),
  add column provider_id text;

-- 2) GitHub-specific identity columns become nullable so LinkedIn rows
--    (which have no numeric user ID and no username) can be stored.
alter table public.words_submissions
  alter column github_user_id drop not null,
  alter column github_username drop not null;

-- 3) Backfill: mirror each existing GitHub row's numeric ID into the
--    generic provider_id column, so identity keys are uniform going
--    forward. LinkedIn rows will use the stable OIDC 'sub' claim here.
update public.words_submissions
set provider_id = github_user_id::text
where provider_id is null;

-- 4) Provider-aware uniqueness: at most one active (pending/approved)
--    submission per (provider, stable provider identity). GitHub and
--    LinkedIn ID spaces are independent and must never collide.
--    Identity is provider + provider_id (OIDC sub / GitHub user id),
--    never an email address.
drop index public.words_submissions_one_active_per_user;
create unique index words_submissions_one_active_per_user
  on public.words_submissions (provider, coalesce(provider_id, github_user_id::text))
  where status <> 'rejected';

-- 5) Provider-aware owner read policy, keyed uniformly on the shared text
--    provider_id representation for both providers:
--      github         → the authenticated GitHub numeric ID as text
--      linkedin_oidc  → the authenticated LinkedIn OIDC sub
--    No bigint casts are needed: provider_id is backfilled from
--    github_user_id::text for existing GitHub rows and every new GitHub
--    insert stores the provider ID as text. Public approved-only read and
--    the absence of write policies are unchanged.
drop policy "words_owner_read_own" on public.words_submissions;
create policy "words_owner_read_own"
  on public.words_submissions
  for select
  to authenticated
  using (
    (
      provider = 'github'
      and (auth.jwt() -> 'user_metadata' ->> 'provider_id') = provider_id
    )
    or
    (
      provider = 'linkedin_oidc'
      and auth.jwt() -> 'user_metadata' ->> 'sub' = provider_id
    )
  );

commit;
