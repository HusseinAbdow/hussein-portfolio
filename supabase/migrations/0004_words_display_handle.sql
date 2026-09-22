-- Optional clean display handle for LinkedIn rows. LinkedIn OIDC does not
-- return a public username, and the self-reported profile_url slug can be
-- noisy (e.g. "fatima-gulamova-691bbb37a"). This column stores a curated,
-- human-friendly handle shown in the UI ("@fatimagulamova") while the
-- profile link keeps using the exact profile_url the user submitted.
--
-- NULL (the default) falls back to the legacy behavior: derive the handle
-- from the profile_url slug for display only.

alter table public.words_submissions
  add column display_handle text;

-- Handles are display-only: short, no whitespace or path separators.
-- NULL is allowed (fallback to profile_url slug).
alter table public.words_submissions
  add constraint words_submissions_display_handle_check
  check (display_handle is null or (
    char_length(display_handle) between 2 and 40
    and display_handle ~ '^[A-Za-z0-9][A-Za-z0-9_-]*$'
    and display_handle !~ '[_-]$'
  ));
