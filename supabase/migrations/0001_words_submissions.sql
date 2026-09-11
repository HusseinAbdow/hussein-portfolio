-- "A Few Words" (people wall) — submissions left by GitHub-authenticated visitors.
-- Identity fields are a snapshot of the GitHub profile at submission time,
-- derived server-side from the Supabase session (never client-supplied).

create type public.words_status as enum ('pending', 'approved', 'rejected');

create table public.words_submissions (
  id uuid primary key default gen_random_uuid(),
  github_user_id bigint not null,
  github_username text not null,
  display_name text,
  avatar_url text,
  profile_url text,
  message text not null
    check (char_length(message) between 10 and 300),
  relationships text[] not null
    check (
      relationships <@ array['Collaborator', 'Friend', 'Classmate', 'Coworker', 'Client', 'Advisor', 'Other']::text[]
      and cardinality(relationships) between 1 and 2
      and (cardinality(relationships) = 1 or relationships[1] <> relationships[2])
    ),
  project_slug text
    check (
      -- Project association is optional; if present, it requires the
      -- Collaborator relationship. Validity of the slug itself is enforced
      -- server-side against lib/projects.ts (collaborative projects only).
      (project_slug is null) or ('Collaborator' = any(relationships))
    ),
  status public.words_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint project_slug_not_empty check (project_slug is null or project_slug <> '')
);

-- At most one active (pending/approved) submission per GitHub identity.
create unique index words_submissions_one_active_per_user
  on public.words_submissions (github_user_id)
  where status <> 'rejected';

create index words_submissions_public_idx
  on public.words_submissions (created_at desc)
  where status = 'approved';

create or replace function public.words_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger words_submissions_updated_at
  before update on public.words_submissions
  for each row execute function public.words_set_updated_at();

alter table public.words_submissions enable row level security;

-- Public: only approved submissions are ever readable.
create policy "words_public_read_approved"
  on public.words_submissions
  for select
  to anon, authenticated
  using (status = 'approved');

-- Authenticated user may read their own submissions (any status),
-- matched by the GitHub provider_id claim in the JWT.
create policy "words_owner_read_own"
  on public.words_submissions
  for select
  to authenticated
  using (
    (auth.jwt() -> 'user_metadata' ->> 'provider_id')::bigint = github_user_id
  );

-- No INSERT / UPDATE / DELETE policies: all writes go through the server
-- (service-role client) after server-side validation and identity derivation.
