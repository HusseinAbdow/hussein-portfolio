"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { BadgeCheck, CheckCircle2, Loader2, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import {
  MAX_PROJECTS,
  MAX_RELATIONSHIPS,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  RELATIONSHIP_VALUES,
  sanitizeMessage,
  wordsSubmissionSchema,
} from "@/lib/words/validation";
import type { SelectableProject } from "@/lib/words/manualProjects";
import type { ProviderIdentityPublic } from "@/lib/words/types";
import type { WordsCtaSession } from "@/components/words/wordsSession";

const chipBaseClasses =
  "rounded-full border px-3.5 py-2 font-body text-[12px] font-medium tracking-[0.04em] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const chipOffClasses =
  "border-border text-muted hover:border-accentUx/60 hover:text-ink focus-visible:outline-accentUx";

const chipOnClasses =
  "border-accentUx bg-accentUx/15 text-ink focus-visible:outline-accentUx";

const projectChipOffClasses =
  "border-border text-muted hover:border-accentDev/60 hover:text-ink focus-visible:outline-accentDev";

const projectChipOnClasses =
  "border-accentDev bg-accentDev/10 text-ink focus-visible:outline-accentDev";

const providerLabels: Record<ProviderIdentityPublic["provider"], string> = {
  github: "GitHub",
  linkedin_oidc: "LinkedIn",
};

function IdentityBadge({ identity }: { identity: ProviderIdentityPublic }) {
  const name = identity.displayName || (identity.handle ? `@${identity.handle}` : null);
  const isGithub = identity.provider === "github";
  return (
    <div className="rounded-xl border border-border bg-bg/60 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
        Posting as
      </p>
      <div className="mt-3 flex items-center gap-3">
        {identity.avatarUrl ? (
          <Image
            src={identity.avatarUrl}
            alt=""
            width={38}
            height={38}
            className="h-[38px] w-[38px] rounded-full border border-border object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border font-display text-[13px] font-semibold uppercase text-muted"
          >
            {(name ?? identity.provider).charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-display text-[14px] font-semibold leading-tight text-ink">
            {name ?? providerLabels[identity.provider]}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-muted">
            {isGithub && identity.handle ? `@${identity.handle}` : providerLabels[identity.provider]}
            <BadgeCheck size={11} className="text-accentDev" aria-hidden />
          </p>
        </div>
      </div>
      <p className="mt-3 font-body text-[12px] leading-snug text-muted">
        {isGithub
          ? "This is the GitHub account that will appear with your words."
          : "This is the LinkedIn identity that will appear with your words."}
      </p>
    </div>
  );
}

export default function WordsModal({
  open,
  onClose,
  session,
  onRetrySession,
  signInError,
  selectableProjects,
}: {
  open: boolean;
  onClose: () => void;
  session: WordsCtaSession;
  onRetrySession: () => void;
  signInError: boolean;
  selectableProjects: SelectableProject[];
}) {
  const [relationships, setRelationships] = useState<string[]>([]);
  const [projectSlugs, setProjectSlugs] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [doneMode, setDoneMode] = useState<"created" | "updated" | null>(null);
  // Guards one-time prefill per authenticated session; cleared on close so
  // the next open picks up refreshed existing-submission data.
  const prefilledRef = useRef(false);

  const includesCollaborator = relationships.includes("Collaborator");

  const editing =
    session.status === "authenticated" && session.existingSubmission !== null;
  const done = doneMode !== null;

  // Prefill the form with the visitor's current entry when they already have
  // one — the edit flow starts from their existing content.
  useEffect(() => {
    if (
      session.status === "authenticated" &&
      session.existingSubmission &&
      !prefilledRef.current
    ) {
      setRelationships(session.existingSubmission.relationships);
      setProjectSlugs(session.existingSubmission.projectSlugs);
      setMessage(session.existingSubmission.message);
      prefilledRef.current = true;
    }
  }, [session]);

  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  const blockedReason = useMemo(() => {
    if (relationships.length === 0) return "Select at least one relationship.";
    if (message.trim().length > 0 && sanitizedMessage.length < MESSAGE_MIN_LENGTH) {
      return `Your message needs at least ${MESSAGE_MIN_LENGTH} characters.`;
    }
    if (message.trim().length === 0 || sanitizedMessage.length < MESSAGE_MIN_LENGTH) {
      return `Write at least ${MESSAGE_MIN_LENGTH} characters.`;
    }
    if (projectSlugs.length > 0 && !includesCollaborator) {
      return "A project can only be linked to the Collaborator relationship.";
    }
    return null;
  }, [includesCollaborator, message, projectSlugs, relationships, sanitizedMessage]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  function toggleRelationship(value: string) {
    setError(null);
    setRelationships((current) => {
      if (current.includes(value)) {
        if (value === "Collaborator") setProjectSlugs([]);
        return current.filter((item) => item !== value);
      }
      if (current.length >= MAX_RELATIONSHIPS) {
        setError("You can select up to two relationships.");
        return current;
      }
      return [...current, value];
    });
  }

  function toggleProject(slug: string) {
    setError(null);
    setProjectSlugs((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length >= MAX_PROJECTS) {
        setError(`You can link up to ${MAX_PROJECTS} projects.`);
        return current;
      }
      return [...current, slug];
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || done) return;

    const isLinkedin = session.status === "authenticated" && session.identity.provider === "linkedin_oidc";
    const wasEditing = editing;

    const payload = {
      message: sanitizedMessage,
      relationships,
      projectSlugs,
      linkedinProfileUrl: isLinkedin ? linkedinUrl.trim() || null : null,
    };

    const parsed = wordsSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid submission.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // Editing goes through PATCH; first-time submissions use POST.
      const res = await fetch("/api/words", {
        method: wasEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        setDoneMode(wasEditing ? "updated" : "created");
        // Refresh the session so the next open prefills the updated entry.
        onRetrySession();
      } else {
        setError(
          typeof data?.error === "string"
            ? data.error
            : wasEditing
              ? "Failed to update. Please try again."
              : "Failed to submit. Please try again."
        );
      }
    } catch {
      setError(
        wasEditing
          ? "Failed to update. Please try again."
          : "Failed to submit. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (done) {
      setDoneMode(null);
      setRelationships([]);
      setProjectSlugs([]);
      setMessage("");
      setLinkedinUrl("");
    }
    // Allow re-prefill on the next open with refreshed session data.
    prefilledRef.current = false;
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-bg/80 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share a few words"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-6 shadow-[0_-8px_60px_rgba(0,0,0,0.5)] sm:max-w-lg sm:rounded-2xl sm:p-8 md:p-9"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
              A Few Words
            </p>
            <h3 className="mt-1.5 font-display text-[22px] font-semibold leading-tight text-ink">
              {done ? "Words received." : editing ? "Update your entry." : "Share a few words."}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="rounded p-1.5 text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {session.status === "loading" || session.status === "idle" ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted">
            <Loader2 size={18} className="animate-spin" aria-hidden />
            <span className="font-body text-[13px]">Checking your session&hellip;</span>
          </div>
        ) : session.status === "error" ? (
          <div className="py-10 text-center">
            <p className="font-body text-[14px] text-muted">
              Couldn&rsquo;t verify your session.
            </p>
            <button
              type="button"
              onClick={onRetrySession}
              className="mt-4 rounded-full border border-border px-4 py-2 font-body text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-accentUx/60"
            >
              Try again
            </button>
          </div>
        ) : session.status === "anonymous" ? (
          <div>
            {signInError && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 font-body text-[13px] text-red-300"
              >
                Sign-in didn&rsquo;t complete. Please try again.
              </p>
            )}
            <p className="font-body text-[14px] leading-relaxed text-muted">
              Sign in so your words carry a real identity — your avatar and
              name come straight from your account.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`/api/auth/github?next=${encodeURIComponent("/?words=open")}`}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-accentUx/60 bg-accentUx/10 px-5 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:bg-accentUx hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4"
              >
                <SiGithub size={17} aria-hidden />
                Continue with GitHub
              </a>
              <a
                href={`/api/auth/linkedin?next=${encodeURIComponent("/?words=open")}`}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-accentDev/60 bg-accentDev/10 px-5 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:bg-accentDev hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4"
              >
                <FaLinkedin size={17} aria-hidden />
                Continue with LinkedIn
              </a>
            </div>
          </div>
        ) : done ? (
          <div className="py-8 text-center">
            <CheckCircle2 size={40} strokeWidth={1.4} className="mx-auto text-emerald-400" aria-hidden />
            <p className="mt-5 font-display text-[18px] font-semibold text-ink">
              {doneMode === "updated"
                ? "Your entry has been updated."
                : "Thanks — your words have been submitted."}
            </p>
            <p className="mx-auto mt-2.5 max-w-[360px] font-body text-[13px] leading-relaxed text-muted">
              {doneMode === "updated"
                ? "It's pending review again — it won't appear on the wall until it's re-approved, even if it was live before."
                : "They're in review now and will appear on the wall once they're approved — not before."}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-full border border-border px-5 py-2.5 font-body text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-accentUx/60"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 font-body text-[13px] text-red-300"
              >
                {error}
              </p>
            )}

            <fieldset>
              <legend className="flex items-baseline justify-between gap-3 w-full">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
                  01 &middot; Relationship
                </span>
                <span className="font-mono text-[10px] text-muted/60">
                  {relationships.length}/{MAX_RELATIONSHIPS}
                </span>
              </legend>
              <p className="mt-2 font-body text-[14px] text-ink">
                How do you know Hussein?
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {RELATIONSHIP_VALUES.map((value) => {
                  const selected = relationships.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleRelationship(value)}
                      className={`${chipBaseClasses} ${
                        selected ? chipOnClasses : chipOffClasses
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {includesCollaborator && (
              <fieldset>
                <legend className="flex items-baseline justify-between gap-3 w-full">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
                    02 &middot; Projects
                  </span>
                  <span className="font-mono text-[10px] text-muted/60">
                    {projectSlugs.length}/{MAX_PROJECTS}
                  </span>
                </legend>
                <p className="mt-2 font-body text-[14px] text-ink">
                  Worked together on a project?
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectableProjects.map((project) => {
                    const selected = projectSlugs.includes(project.identifier);
                    return (
                      <button
                        key={project.identifier}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleProject(project.identifier)}
                        className={`${chipBaseClasses} ${
                          selected ? projectChipOnClasses : projectChipOffClasses
                        }`}
                      >
                        {project.title}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 font-body text-[12px] text-muted/80">
                  Optional — link up to {MAX_PROJECTS} projects, or none at
                  all.
                </p>
              </fieldset>
            )}

            <fieldset>
              <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/80">
                {includesCollaborator ? "03" : "02"} &middot; Message
              </legend>
              <label
                htmlFor="words-message"
                className="mt-2 block font-body text-[14px] text-ink"
              >
                Your words
              </label>
              <textarea
                id="words-message"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setError(null);
                }}
                rows={5}
                maxLength={MESSAGE_MAX_LENGTH}
                placeholder="A sentence or two — how we met, what it was like&hellip;"
                className="mt-3 w-full resize-none rounded-xl border border-border bg-bg/60 px-4 py-3 font-body text-[14px] leading-relaxed text-ink placeholder:text-muted/50 focus:border-accentUx/60 focus:outline-none"
              />
              <p
                className={`mt-2 text-right font-mono text-[10px] tracking-[0.08em] ${
                  message.length > 0 && sanitizedMessage.length < MESSAGE_MIN_LENGTH
                    ? "text-amber-300/80"
                    : "text-muted/70"
                }`}
              >
                {message.length}/{MESSAGE_MAX_LENGTH}
              </p>
            </fieldset>

            {session.identity.provider === "linkedin_oidc" && (
              <fieldset>
                <label
                  htmlFor="words-linkedin-url"
                  className="block font-body text-[14px] text-ink"
                >
                  Your LinkedIn profile URL (optional)
                </label>
                <input
                  id="words-linkedin-url"
                  type="url"
                  value={linkedinUrl}
                  onChange={(event) => {
                    setLinkedinUrl(event.target.value);
                    setError(null);
                  }}
                  maxLength={300}
                  placeholder="https://linkedin.com/in/yourname"
                  className="mt-3 w-full rounded-xl border border-border bg-bg/60 px-4 py-3 font-body text-[14px] leading-relaxed text-ink placeholder:text-muted/50 focus:border-accentUx/60 focus:outline-none"
                />
                <p className="mt-2 font-body text-[12px] text-muted/80">
                  Optional — links your name on the wall to your LinkedIn
                  profile if you provide it.
                </p>
              </fieldset>
            )}

            <IdentityBadge identity={session.identity} />

            <button
              type="submit"
              disabled={Boolean(blockedReason) || submitting}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-accentUx/60 bg-accentUx/10 px-5 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:bg-accentUx hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accentUx/10 disabled:hover:text-ink"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  {editing ? "Saving&hellip;" : "Submitting&hellip;"}
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Submit your words"
              )}
            </button>
            {blockedReason && !submitting && (
              <p className="-mt-4 text-center font-body text-[12px] text-muted/80">
                {blockedReason}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
