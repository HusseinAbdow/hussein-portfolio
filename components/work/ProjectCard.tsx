"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project, ProjectCategory } from "@/lib/projects";

export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function getTagTint(category: ProjectCategory): string {
  if (category === "ui-ux") return "border-accentUx/40 text-accentUx";
  if (category === "mobile") return "border-accentDev/40 text-accentDev";
  return "border-border text-muted";
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/work/${project.category}/${project.slug}`} className="block group">
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
              <img src={project.coverSrc} alt={`${project.title} cover`} className="h-full w-full object-cover" />
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
  );
}
