"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import ProjectCard from "@/components/work/ProjectCard";

type WorkFilter = "all" | "web-uiux" | "mobile";

interface WorkCategoryPageClientProps {
  activeCategory: WorkFilter;
  projects: Project[];
}

const filters: Array<{ key: WorkFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "web-uiux", label: "Web & UI/UX" },
  { key: "mobile", label: "Mobile" },
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

function getCategoryLabel(category: WorkFilter): string {
  if (category === "all") return "All Work";
  if (category === "web-uiux") return "Web & UI/UX Work";
  if (category === "mobile") return "Mobile Work";
  return "Website Work";
}

function getCategoryAccent(category: WorkFilter): string {
  if (category === "web-uiux") return "text-accentUx";
  if (category === "mobile") return "text-accentDev";
  return "text-ink";
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

      {projects.length === 0 ? (
        <section className="max-w-[1200px] mx-auto flex min-h-[32vh] items-center justify-center py-16 text-center">
          <p className="font-display text-[clamp(24px,4vw,40px)] text-muted">
            More work coming soon.
          </p>
        </section>
      ) : (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </motion.section>
      )}
    </main>
  );
}
