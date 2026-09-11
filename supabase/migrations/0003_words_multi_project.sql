-- 0003: Allow up to 3 projects per "A Few Words" submission.
-- project_slug (single value) becomes project_slugs (array of 0-3 slugs).
--
-- Safety notes:
-- * The old project_slug column is intentionally KEPT and left unused by
--   application code — new rows leave it null — so existing data remains
--   recoverable without a rollback migration.
-- * No RLS policy changes are required: neither words_public_read_approved
--   nor words_owner_read_own references project_slug, and the new column
--   introduces no new read surface beyond what the table already exposes.
-- * Writes still go through the server (service-role client) only.

begin;

alter table public.words_submissions
  add column project_slugs text[];

-- Mirror of lib/words/validation.ts rules:
--  * null when no project is selected (optional feature)
--  * 1-3 entries when present
--  * no duplicates, no empty strings (pairwise index checks — Postgres
--    does not allow subqueries in CHECK constraints)
--  * only allowed when Collaborator is one of the selected relationships
alter table public.words_submissions
  add constraint project_slugs_valid check (
    project_slugs is null
    or (
      cardinality(project_slugs) between 1 and 3
      and (project_slugs[1] is null or project_slugs[1] <> '')
      and (project_slugs[2] is null or project_slugs[2] <> '')
      and (project_slugs[3] is null or project_slugs[3] <> '')
      and (project_slugs[2] is null or project_slugs[2] <> project_slugs[1])
      and (project_slugs[3] is null or (project_slugs[3] <> project_slugs[1] and project_slugs[3] <> project_slugs[2]))
      and 'Collaborator' = any(relationships)
    )
  );

-- Backfill: existing single-project rows carry their value into the array.
update public.words_submissions
set project_slugs = array[project_slug]
where project_slug is not null and project_slugs is null;

commit;
