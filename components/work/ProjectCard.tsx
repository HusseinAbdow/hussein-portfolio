"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

export default function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <div className="h-full">
      <Link
        href={`/work/${project.category}/${project.slug}`}
        className="block group h-full"
      >
        <motion.article
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="h-full rounded-2xl border border-border bg-surface/60 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)] group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-shadow"
        >
          {/* Fixed 16/10 cover box — media object-covers it, never dictates its shape */}
          <div className="relative aspect-[16/10] bg-surface">
            {project.coverType === "video" ? (
              <video
                src={project.coverSrc}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={project.coverSrc}
                alt={`${project.title} cover`}
                fill
                priority={priority}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
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
                  className="font-body text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border-[1.5px] border-accentUx/60 bg-accentUx/5 text-accentUx"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      </Link>
    </div>
  );
}
