"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/projects";

interface ProjectDetailPageClientProps {
  project: Project;
  nextProject: Project;
}

function getCategoryLabel(category: Project["category"]): string {
  if (category === "ui-ux") return "UI/UX Work";
  if (category === "mobile") return "Mobile Work";
  return "Website Work";
}

function getAccentText(category: Project["category"]): string {
  if (category === "ui-ux") return "text-accentUx";
  if (category === "mobile") return "text-accentDev";
  return "text-muted";
}

function getTagTint(category: Project["category"]): string {
  if (category === "ui-ux") return "border-accentUx/40 text-accentUx";
  if (category === "mobile") return "border-accentDev/40 text-accentDev";
  return "border-border text-muted";
}

type GalleryItem = Project["gallery"][number];

export default function ProjectDetailPageClient({
  project,
  nextProject,
}: ProjectDetailPageClientProps) {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxItem(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-bg text-ink px-6 md:px-16 py-10 md:py-14"
    >
      <div className="max-w-[1200px] mx-auto">
        <nav className="mb-8">
          <Link
            href={`/work/${project.category}`}
            className={`font-body text-[12px] uppercase tracking-[0.12em] ${getAccentText(project.category)} hover:opacity-70 transition-opacity`}
          >
            &larr; Back to {getCategoryLabel(project.category)}
          </Link>
        </nav>

        <header className="mb-8 md:mb-10">
          <h1 className="font-display text-[clamp(36px,6vw,72px)] leading-[0.95] uppercase mb-4">
            {project.title}
          </h1>
          <p className="font-body text-[14px] text-muted mb-5">{project.year}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`font-body text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border ${getTagTint(project.category)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="relative w-full h-[60vh] md:h-[65vh] rounded-2xl overflow-hidden border border-border mb-10 md:mb-12 bg-surface">
          {project.coverType === "video" ? (
            <video
              src={project.coverSrc}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverSrc}
              alt={`${project.title} hero`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        <section className="max-w-[65ch] mb-12 md:mb-16">
          <p className="font-body text-[15px] md:text-[16px] leading-relaxed text-ink/90">
            {project.description}
          </p>
        </section>

        <section className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {project.gallery.map((item) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLightboxItem(item)}
                className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-border bg-surface cursor-pointer focus:outline-none focus-visible:border-ink transition-shadow group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.caption ?? project.title}
                    className="h-full w-full object-cover"
                  />
                )}
                {item.caption ? (
                  <span className="absolute bottom-0 left-0 right-0 px-3 py-2 font-body text-[11px] uppercase tracking-[0.08em] text-muted bg-gradient-to-t from-bg/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity text-left">
                    {item.caption}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <Link href={`/work/${nextProject.category}/${nextProject.slug}`} className="block group">
            <motion.article
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="rounded-2xl border border-border bg-surface/60 overflow-hidden p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-shadow"
            >
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-muted mb-2">
                Next Project
              </p>
              <h2 className="font-display text-[clamp(24px,3vw,40px)] leading-tight uppercase mb-2 group-hover:text-white transition-colors">
                {nextProject.title}
              </h2>
              <p className="font-body text-[14px] text-muted leading-relaxed">
                {nextProject.summary}
              </p>
            </motion.article>
          </Link>
        </section>
      </div>

      <AnimatePresence>
        {lightboxItem ? (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 bg-black/85 cursor-pointer"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative max-w-[1100px] w-full max-h-full cursor-default"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close"
                className="absolute -top-10 right-0 font-body text-[13px] uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors"
              >
                X Close
              </button>
              <div className="rounded-2xl overflow-hidden border border-border bg-surface">
                {lightboxItem.type === "video" ? (
                  <video
                    src={lightboxItem.src}
                    className="w-full max-h-[80vh] object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lightboxItem.src}
                    alt={lightboxItem.caption ?? project.title}
                    className="w-full max-h-[80vh] object-contain"
                  />
                )}
              </div>
              {lightboxItem.caption ? (
                <p className="mt-3 text-center font-body text-[12px] uppercase tracking-[0.1em] text-muted">
                  {lightboxItem.caption}
                </p>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
