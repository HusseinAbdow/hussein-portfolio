"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Check, Loader2, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { projects } from "@/lib/projects";
import type { AdminWordSubmission, WordsStatus } from "@/lib/words/types";

const projectTitles = new Map(projects.map((p) => [p.slug, p.title]));

type LoadState = "loading" | "ready" | "unauthenticated" | "forbidden" | "error";

const relationshipBadgeClasses =
  "inline-flex items-center rounded-sm border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted";

const projectBadgeClasses =
  "inline-flex items-center rounded-sm border border-accentDev/50 bg-accentDev/5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accentDev";

const statusChipClasses: Record<WordsStatus, string> = {
  pending: "border-amber-300/50 text-amber-200",
  approved: "border-emerald-400/50 text-emerald-300",
  rejected: "border-border text-muted/70",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Avatar({ submission, size }: { submission: AdminWordSubmission; size: number }) {
  if (submission.avatarUrl) {
    return (
      <Image
        src={submission.avatarUrl}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full border border-border object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full border border-border bg-bg font-display font-semibold uppercase text-muted"
      style={{ width: size, height: size, fontSize: size / 2.8 }}
    >
      {(submission.displayName || submission.handle || providerLabels[submission.provider]).charAt(0)}
    </span>
  );
}

const providerLabels: Record<AdminWordSubmission["provider"], string> = {
  github: "GitHub",
  linkedin_oidc: "LinkedIn",
};

function WordIdentity({ submission }: { submission: AdminWordSubmission }) {
  const name =
    submission.displayName ||
    (submission.handle ? `@${submission.handle}` : providerLabels[submission.provider]);
  const handleLabel = submission.handle ? `@${submission.handle}` : null;
  return (
    <div className="flex items-center gap-3.5">
      <Avatar submission={submission} size={44} />
      <div className="min-w-0">
        <p className="truncate font-display text-[16px] font-semibold leading-tight text-ink">
          {name}
        </p>
        <p className="mt-1 flex items-center gap-2 font-mono text-[11px] leading-none text-muted">
          {handleLabel && (
            <>
              {submission.profileUrl ? (
                <Link
                  href={submission.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate transition-colors hover:text-ink"
                >
                  {handleLabel}
                </Link>
              ) : (
                <span className="truncate">{handleLabel}</span>
              )}
            </>
          )}
          <span className="inline-flex shrink-0 items-center gap-1 text-muted/80">
            <BadgeCheck size={12} strokeWidth={1.8} className="text-accentDev" aria-hidden />
            {providerLabels[submission.provider]}
          </span>
        </p>
        {submission.profileUrl && (
          <p className="mt-1 truncate font-mono text-[10px] text-muted/60">
            {submission.profileUrl}
          </p>
        )}
      </div>
    </div>
  );
}

function DetailsEditor({
  submission,
  onUpdated,
}: {
  submission: AdminWordSubmission;
  onUpdated: (next: AdminWordSubmission) => void;
}) {
  const isLinkedin = submission.provider === "linkedin_oidc";
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(submission.displayName ?? "");
  const [displayHandle, setDisplayHandle] = useState(submission.handle ?? "");
  const [profileUrl, setProfileUrl] = useState(submission.profileUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setDisplayName(submission.displayName ?? "");
      setDisplayHandle(submission.handle ?? "");
      setProfileUrl(submission.profileUrl ?? "");
      setError(null);
      setSaved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, submission.id]);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/words", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: submission.id,
          action: "edit",
          displayName: displayName.trim() === "" ? null : displayName,
          displayHandle: isLinkedin
            ? displayHandle.trim() === ""
              ? null
              : displayHandle
            : undefined,
          profileUrl: profileUrl.trim() === "" ? null : profileUrl,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.submission) {
        onUpdated(data.submission as AdminWordSubmission);
        setSaved(true);
      } else {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Update failed. Please try again."
        );
      }
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-border px-3.5 py-1.5 font-body text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-accentDev/60 hover:text-ink"
      >
        Edit name / link
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg/50 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Display name
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={80}
            placeholder={submission.displayName ?? "Display name"}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-body text-[13px] text-ink placeholder:text-muted/50 focus:border-accentDev/60 focus:outline-none"
          />
        </label>
        {isLinkedin && (
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Handle (without @)
            </span>
            <input
              type="text"
              value={displayHandle}
              onChange={(e) => setDisplayHandle(e.target.value)}
              maxLength={40}
              placeholder={submission.handle ?? "handle"}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-body text-[13px] text-ink placeholder:text-muted/50 focus:border-accentDev/60 focus:outline-none"
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Profile link
          </span>
          <input
            type="url"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            maxLength={300}
            placeholder="https://linkedin.com/in/…"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 font-body text-[13px] text-ink placeholder:text-muted/50 focus:border-accentDev/60 focus:outline-none"
          />
        </label>
      </div>
      <p className="mt-2 font-body text-[12px] text-muted/80">
        Empty handle falls back to the link slug. Empty link removes the link. Empty name clears the override.
      </p>
      {error && (
        <p role="alert" className="mt-2 font-body text-[12px] text-red-300">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="mt-2 font-body text-[12px] text-emerald-300">
          Saved.
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="inline-flex items-center gap-1.5 rounded-full border border-accentDev/60 px-4 py-1.5 font-body text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-accentDev/10 disabled:opacity-40"
        >
          {saving && <Loader2 size={12} className="animate-spin" aria-hidden />}
          Save
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            setOpen(false);
            setError(null);
            setSaved(false);
          }}
          className="rounded-full px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:text-ink disabled:opacity-40"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function WordsAdmin() {
  const [submissions, setSubmissions] = useState<AdminWordSubmission[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/words");
      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        setState("unauthenticated");
        return;
      }
      if (res.status === 403) {
        setState("forbidden");
        return;
      }
      if (!res.ok) {
        setState("error");
        return;
      }
      setSubmissions(data?.submissions ?? []);
      setState("ready");
    } catch {
      setState("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function moderate(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/words", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.id && data?.status) {
        setSubmissions((current) =>
          current.map((item) =>
            item.id === data.id ? { ...item, status: data.status } : item
          )
        );
      } else {
        setActionError(
          typeof data?.error === "string"
            ? data.error
            : "Action failed. Please try again."
        );
      }
    } catch {
      setActionError("Action failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = useMemo(
    () => submissions.filter((item) => item.status === "pending"),
    [submissions]
  );
  const approved = useMemo(
    () => submissions.filter((item) => item.status === "approved"),
    [submissions]
  );
  const rejected = useMemo(
    () => submissions.filter((item) => item.status === "rejected"),
    [submissions]
  );

  function handleDetailsUpdated(next: AdminWordSubmission) {
    setSubmissions((current) =>
      current.map((item) => (item.id === next.id ? next : item))
    );
  }

  return (
    <main className="px-6 pb-24 pt-12 md:px-16 md:pt-16">
      <div className="mx-auto max-w-[880px]">
        <header className="mb-10 md:mb-14">
          <p className="mb-3 font-body text-[12px] tracking-[0.12em] uppercase text-muted">
            Moderation
          </p>
          <h1 className="font-display text-[clamp(30px,4.5vw,52px)] leading-[1.02]">
            A few words, awaiting review.
          </h1>
          <p className="mt-3 max-w-[560px] font-body text-[13px] leading-relaxed text-muted">
            Approved submissions go live on the wall immediately. Rejected ones
            stay private.
          </p>
        </header>

        {state === "loading" && (
          <div className="flex items-center gap-2 py-16 text-muted">
            <Loader2 size={18} className="animate-spin" aria-hidden />
            <span className="font-body text-[13px]">Loading submissions&hellip;</span>
          </div>
        )}

        {state === "unauthenticated" && (
          <div className="border border-border bg-surface p-8">
            <p className="font-display text-[18px] text-ink">
              Session expired or missing.
            </p>
            <p className="mt-2 font-body text-[13px] text-muted">
              Sign in again with the admin GitHub account to continue.
            </p>
            <a
              href={`/api/auth/github?next=${encodeURIComponent("/admin/words")}`}
              className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-accentUx/60 px-4 py-2.5 font-body text-[12px] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:bg-accentUx hover:text-bg"
            >
              <SiGithub size={15} aria-hidden />
              Continue with GitHub
            </a>
          </div>
        )}

        {state === "forbidden" && (
          <div className="border border-border bg-surface p-8">
            <p className="font-display text-[18px] text-ink">
              This account can&rsquo;t access moderation.
            </p>
            <p className="mt-2 font-body text-[13px] text-muted">
              This page is limited to a single GitHub account.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="border border-border bg-surface p-8">
            <p className="font-display text-[18px] text-ink">
              Couldn&rsquo;t load submissions.
            </p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-4 rounded-full border border-border px-4 py-2 font-body text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:border-accentUx/60"
            >
              Try again
            </button>
          </div>
        )}

        {state === "ready" && (
          <div className="flex flex-col gap-12">
            {actionError && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 font-body text-[13px] text-red-300"
              >
                {actionError}
              </p>
            )}

            <section>
              <h2 className="mb-5 flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Pending
                <span className="text-muted/50">
                  {refreshing ? "·" : pending.length}
                </span>
              </h2>

              {pending.length === 0 ? (
                <p className="border border-border bg-surface p-6 font-body text-[13px] text-muted">
                  Nothing waiting. The queue is clear.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {pending.map((submission) => (
                    <article
                      key={submission.id}
                      className="flex flex-col gap-5 border border-border bg-surface p-6 md:p-7"
                    >
                      <WordIdentity submission={submission} />

                      <div className="flex flex-wrap items-center gap-2">
                        {submission.relationships.map((relationship) => (
                          <span
                            key={relationship}
                            className={relationshipBadgeClasses}
                          >
                            {relationship}
                          </span>
                        ))}
                        {submission.projectSlugs.map((slug) => (
                          <span
                            key={slug}
                            className={projectBadgeClasses}
                          >
                            Worked together on &rarr;{" "}
                            {projectTitles.get(slug) ?? slug.replace(/^gh:/, "")}
                          </span>
                        ))}
                      </div>

                      <blockquote className="border-l border-border pl-4 font-body text-[15px] leading-relaxed text-ink/90">
                        {submission.message}
                      </blockquote>

                      <DetailsEditor submission={submission} onUpdated={handleDetailsUpdated} />

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/60">
                          {formatDate(submission.createdAt)} &middot;{" "}
                          {formatTime(submission.createdAt)}
                        </p>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            disabled={busyId === submission.id}
                            onClick={() => moderate(submission.id, "approve")}
                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 px-4 py-2 font-body text-[12px] font-medium uppercase tracking-[0.08em] text-emerald-300 transition-colors hover:bg-emerald-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2 disabled:opacity-40"
                          >
                            {busyId === submission.id ? (
                              <Loader2 size={13} className="animate-spin" aria-hidden />
                            ) : (
                              <Check size={13} strokeWidth={2.2} aria-hidden />
                            )}
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busyId === submission.id}
                            onClick={() => moderate(submission.id, "reject")}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-body text-[12px] font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:border-red-400/50 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2 disabled:opacity-40"
                          >
                            {busyId === submission.id ? (
                              <Loader2 size={13} className="animate-spin" aria-hidden />
                            ) : (
                              <X size={13} strokeWidth={2.2} aria-hidden />
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {(approved.length > 0 || rejected.length > 0) && (
              <section>
                <h2 className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Reviewed
                </h2>
                <div className="flex flex-col divide-y divide-border border border-border bg-surface">
                  {[...approved, ...rejected].map((submission) => (
                    <div
                      key={submission.id}
                      className="flex flex-col gap-4 p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar submission={submission} size={32} />
                        <div className="min-w-0">
                          <p className="truncate font-body text-[13px] font-medium text-ink">
                            {submission.displayName ||
                              (submission.handle
                                ? `@${submission.handle}`
                                : providerLabels[submission.provider])}
                            {submission.handle && (
                              <span className="ml-2 font-mono text-[10px] font-normal text-muted/70">
                                @{submission.handle}
                              </span>
                            )}
                          </p>
                          <p className="truncate font-body text-[12px] text-muted/80">
                            {submission.relationships.join(" · ")}
                            {submission.projectSlugs.length > 0
                              ? ` · ${submission.projectSlugs
                                  .map(
                                    (slug) =>
                                      projectTitles.get(slug) ??
                                      slug.replace(/^gh:/, "")
                                  )
                                  .join(" · ")}`
                              : ""}
                          </p>
                          {submission.profileUrl && (
                            <p className="truncate font-mono text-[10px] text-muted/60">
                              {submission.profileUrl}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end md:gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${statusChipClasses[submission.status]}`}
                        >
                          {submission.status}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted/50">
                          {formatDate(submission.updatedAt)}
                        </span>
                      </div>
                      </div>
                      <DetailsEditor submission={submission} onUpdated={handleDetailsUpdated} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
