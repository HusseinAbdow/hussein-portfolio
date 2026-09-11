import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Code2 } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { projects } from "@/lib/projects";
import { manualProjectsByIdentifier } from "@/lib/words/manualProjects";
import type { PublicWordSubmission } from "@/lib/words/types";
import OwnCardMenu from "@/components/words/OwnCardMenu";

const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

// Relationship badges keep the sky-blue (accentDev) pill style.
const relationshipPillClasses =
  "inline-flex items-center rounded-full border-[1.5px] border-accentDev/60 bg-accentDev/5 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.08em] text-accentDev";

// Small uppercase metadata label, consistent with the footer text treatment.
const sectionLabelClasses =
  "font-mono text-[10px] uppercase tracking-[0.14em] text-muted/70";

// Square provider icon badge: LinkedIn = blue square with the white "in"
// mark; GitHub = neutral dark square with the white octocat mark.
function ProviderIconBadge({
  provider,
  size,
}: {
  provider: PublicWordSubmission["provider"];
  size: number;
}) {
  const isGithub = provider === "github";
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-md border border-white/10"
      style={{
        width: size,
        height: size,
        backgroundColor: isGithub ? "#24292F" : "#0A66C2",
      }}
    >
      {isGithub ? (
        <SiGithub size={size * 0.68} className="text-white" />
      ) : (
        <FaLinkedin size={size * 0.62} className="text-white" />
      )}
    </span>
  );
}

// Provider icon colors: the badge backgrounds carry the brand identity; the
// glyphs inside are white. LinkedIn's blue and GitHub's neutral dark both
// read clearly against the card surface at these sizes.
const GITHUB_USER = "HusseinAbdow";

const providerLabels: Record<PublicWordSubmission["provider"], string> = {
  github: "GitHub",
  linkedin_oidc: "LinkedIn",
};

// Pure display transform of the self-reported LinkedIn profile_url: extracts
// the vanity slug from linkedin.com/in/<slug>. It is never stored, never used
// as an identity value, and does not affect any verified styling — the
// badge reflects the OAuth sign-in, not this URL.
function linkedinVanitySlug(profileUrl: string | null): string | null {
  if (!profileUrl) return null;
  try {
    const url = new URL(profileUrl);
    if (url.hostname !== "linkedin.com" && url.hostname !== "www.linkedin.com") {
      return null;
    }
    const match = url.pathname.match(/^\/in\/([A-Za-z0-9][A-Za-z0-9_-]{1,98})\/?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export default function WordCard({
  submission,
}: {
  submission: PublicWordSubmission;
}) {
  const name =
    submission.displayName ||
    (submission.handle ? `@${submission.handle}` : providerLabels[submission.provider]);
  const date = new Date(submission.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  // Project badges: case-study slugs link to the case-study page; "gh:<name>"
  // identifiers link to their URL from the static manual list (repo owners
  // may differ, e.g. CRC Simulator lives under Bash77).
  const projectBadges = submission.projectSlugs.map((identifier) => {
    const caseStudy = projectBySlug.get(identifier);
    if (caseStudy) {
      return {
        key: identifier,
        label: caseStudy.title,
        href: `/work/${caseStudy.category}/${caseStudy.slug}`,
        isRepo: false,
      };
    }
    const manualProject = manualProjectsByIdentifier.get(identifier);
    return {
      key: identifier,
      label: manualProject?.name ?? identifier.replace(/^gh:/, ""),
      href: manualProject?.url ?? `https://github.com/${GITHUB_USER}/${identifier.replace(/^gh:/, "")}`,
      isRepo: true,
    };
  });

  // LinkedIn links are self-reported and optional: only wrap the avatar and
  // name in a link when the visitor actually provided one.
  const linkedinProfileUrl =
    submission.provider === "linkedin_oidc" && submission.profileUrl
      ? submission.profileUrl
      : null;
  const linkedinHandle = linkedinVanitySlug(submission.profileUrl);
  const isGithub = submission.provider === "github";

  const nameClasses =
    "font-display text-[17px] font-bold leading-tight tracking-[-0.01em] text-ink";

  return (
    <article className="relative flex h-full flex-col gap-5 rounded-2xl border border-border bg-surface p-6 text-left transition-[border-color,box-shadow] duration-300 hover:border-accentUx/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] md:p-7">
      {/* Owner-only kebab menu (client-resolved; invisible to others) */}
      <OwnCardMenu submissionId={submission.id} />

      {/* Header: avatar top-left, name + verified badge + provider row right */}
      <header className="flex items-start gap-4">
        {submission.avatarUrl ? (
          linkedinProfileUrl ? (
            <Link
              href={linkedinProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4"
            >
              <Image
                src={submission.avatarUrl}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
              />
            </Link>
          ) : (
            <Image
              src={submission.avatarUrl}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
            />
          )
        ) : (
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-bg font-display text-xl font-semibold uppercase text-muted"
          >
            {name.charAt(0)}
          </span>
        )}

        <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
          {/* Name row: name in --ink + filled circular verified badge */}
          <span className="flex min-w-0 items-center gap-1.5">
            {linkedinProfileUrl ? (
              <Link
                href={linkedinProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${nameClasses} truncate transition-colors hover:text-accentUx focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4`}
              >
                {name}
              </Link>
            ) : (
              <span className={`${nameClasses} truncate`}>{name}</span>
            )}
            <span
              role="img"
              aria-label="Verified sign-in"
              className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accentDev"
            >
              <BadgeCheck size={13} strokeWidth={2.4} className="text-white" />
            </span>
          </span>

          {/* Provider row: square icon badge + @handle */}
          <span className="flex min-w-0 items-center gap-2">
            <ProviderIconBadge provider={submission.provider} size={20} />
            {isGithub ? (
              submission.handle && submission.profileUrl ? (
                <Link
                  href={submission.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-body text-[12px] text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-2"
                >
                  @{submission.handle}
                </Link>
              ) : (
                <span className="truncate font-body text-[12px] text-muted">
                  @{submission.handle ?? providerLabels.github}
                </span>
              )
            ) : linkedinHandle ? (
              linkedinProfileUrl ? (
                <Link
                  href={linkedinProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-body text-[12px] text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-2"
                >
                  @{linkedinHandle}
                </Link>
              ) : (
                <span className="truncate font-body text-[12px] text-muted">
                  @{linkedinHandle}
                </span>
              )
            ) : (
              <span className="truncate font-body text-[12px] text-muted">
                {providerLabels.linkedin_oidc}
              </span>
            )}
          </span>
        </div>
      </header>

      {/* ROLE section */}
      <section className="flex flex-col items-start gap-2.5">
        <p className={sectionLabelClasses}>Role</p>
        <div className="flex flex-wrap items-center gap-2">
          {submission.relationships.map((relationship) => (
            <span key={relationship} className={relationshipPillClasses}>
              {relationship}
            </span>
          ))}
        </div>
      </section>

      {/* PROJECTS section — one full-width clickable row per project */}
      {projectBadges.length > 0 && (
        <section className="flex flex-col items-start gap-2.5">
          <p className={sectionLabelClasses}>Projects</p>
          <div className="flex w-full flex-col gap-2">
            {projectBadges.map((badge) => (
              <Link
                key={badge.key}
                href={badge.href}
                {...(badge.isRepo
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex w-full items-center gap-3 rounded-lg border border-border bg-bg/50 px-4 py-2.5 transition-colors duration-200 hover:border-accentUx/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-2"
              >
                <Code2
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden
                  className="shrink-0 text-accentUx"
                />
                <span className="min-w-0 flex-1 truncate font-body text-[13px] font-medium text-ink">
                  {badge.label}
                </span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={2}
                  aria-hidden
                  className="shrink-0 text-accentUx transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quote section: opening glyph top-left, closing glyph bottom-right */}
      <blockquote className="relative flex flex-1 flex-col">
        <span
          aria-hidden
          className="self-start font-display text-[40px] font-semibold leading-[0.55] text-accentUx/50"
        >
          &ldquo;
        </span>
        <p className="mt-1 font-body text-[16px] leading-relaxed text-ink">
          {submission.message}
        </p>
        <span
          aria-hidden
          className="self-end font-display text-[40px] font-semibold leading-[0.55] text-accentUx/50"
        >
          &rdquo;
        </span>
      </blockquote>

      {/* Footer: divider line + provider icon badge + muted meta row */}
      <footer className="mt-auto flex flex-col gap-3 pt-1">
        <div aria-hidden className="h-px w-full bg-border" />
        <div className="flex items-center gap-2">
          <ProviderIconBadge provider={submission.provider} size={16} />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/70">
            Posted via {providerLabels[submission.provider]}
          </span>
          <span aria-hidden className="font-mono text-[10px] text-muted/70">
            &middot;
          </span>
          <time
            dateTime={submission.createdAt}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/70"
          >
            {date}
          </time>
        </div>
      </footer>
    </article>
  );
}
