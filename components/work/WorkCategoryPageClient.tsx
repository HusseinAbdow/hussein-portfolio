"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project, ProjectCategory } from "@/lib/projects";

type WorkFilter = "all" | ProjectCategory;

interface WorkCategoryPageClientProps {
  activeCategory: WorkFilter;
  projects: Project[];
}

const filters: Array<{ key: WorkFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "ui-ux", label: "UI-UX" },
  { key: "mobile", label: "Mobile" },
  { key: "website", label: "Websites" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function getCategoryLabel(category: WorkFilter): string {
  if (category === "all") return "All Work";
  if (category === "ui-ux") return "UI/UX Work";
  if (category === "mobile") return "Mobile Work";
  return "Website Work";
}

function getCategoryAccent(category: WorkFilter): string {
  if (category === "ui-ux") return "text-accentUx";
  if (category === "mobile") return "text-accentDev";
  return "text-ink";
}

function getTagTint(category: ProjectCategory): string {
  if (category === "ui-ux") return "border-accentUx/40 text-accentUx";
  if (category === "mobile") return "border-accentDev/40 text-accentDev";
  return "border-border text-muted";
}

export default function WorkCategoryPageClient({
  activeCategory,
  projects,
}: WorkCategoryPageClientProps) {
  return (
    <main className="min-h-screen bg-bg text-ink px-6 md:px-16 py-10 md:py-14">
      <header className="max-w-[1200px] mx-auto mb-8 md:mb-10">
        <p
          className={`font-body text-[12px] tracking-[0.12em] uppercase mb-3 ${getCategoryAccent(activeCategory)}`}
        >
          {getCategoryLabel(activeCategory)}
        </p>
        <h1 className="font-display text-[clamp(36px,6vw,72px)] leading-[0.95] uppercase">
          {activeCategory === "all"
            ? "My Work"
            : getCategoryLabel(activeCategory)}
        </h1>
      </header>

      <nav className="max-w-[1200px] mx-auto mb-8 md:mb-10 flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = filter.key === activeCategory;
          return (
            <Link
              key={filter.key}
              href={`/work/${filter.key}`}
              className={`font-body text-[12px] uppercase tracking-[0.1em] rounded-full px-4 py-2 border transition-colors ${
                isActive
                  ? "border-ink text-ink bg-surface"
                  : "border-border text-muted hover:text-ink hover:border-ink/60"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        {projects.map((project) => (
          <motion.div key={project.slug} variants={cardVariants}>
            <Link
              href={`/work/${project.category}/${project.slug}`}
              className="block group"
            >
              <motion.article
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="rounded-2xl border border-border bg-surface/60 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)] group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-shadow"
              >
                <div className="relative aspect-[16/10] bg-surface">
                  {project.coverType === "video" ? (
                    <video
                      src={project.coverSrc}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={project.coverSrc}
                      alt={`${project.title} cover`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-5 md:p-6">
                  <h2 className="font-display text-[clamp(22px,2.6vw,32px)] leading-tight mb-2 uppercase">
                    {project.title}
                  </h2>
                  <p className="font-body text-[14px] text-muted leading-relaxed mb-4">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={`${project.slug}-${tag}`}
                        className={`font-body text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border ${getTagTint(project.category)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            </Link>
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
}
