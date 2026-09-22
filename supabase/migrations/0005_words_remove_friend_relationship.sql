-- Remove "Friend" from the allowed relationship values on the words wall.
-- Verified: no existing rows use it, so the tighter constraint applies
-- cleanly. Application-level validation (lib/words/validation.ts) is the
-- primary enforcement; this keeps the database contract in sync.

alter table public.words_submissions
  drop constraint words_submissions_relationships_check;

alter table public.words_submissions
  add constraint words_submissions_relationships_check
  check (
    relationships <@ array['Collaborator', 'Classmate', 'Coworker', 'Client', 'Advisor', 'Other']::text[]
    and cardinality(relationships) between 1 and 2
    and cardinality(array(select distinct unnest(relationships))) = cardinality(relationships)
  );
