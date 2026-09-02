"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/projects";
import ProjectCard from "@/components/work/ProjectCard";

const selectedSlugs = ["vanlife", "konfab", "timberfy", "sticky-wall"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

export default function SelectedWork() {
  const selectedProjects = selectedSlugs.flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug);
    return project ? [project] : [];
  });
  const firstImageIndex = selectedProjects.findIndex(
    (project) => project.coverType !== "video"
  );

  return (
    <section className="bg-bg px-6 py-12 md:px-16 md:py-16">
      <header className="mx-auto mb-8 max-w-[1200px] md:mb-10">
        <p className="mb-3 font-body text-[12px] tracking-[0.12em] uppercase text-muted">
          Selected Work
        </p>
        <h2 className="max-w-[760px] font-display text-[clamp(36px,6vw,72px)] leading-[0.95]">
          A few projects worth sharing.
        </h2>
      </header>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        {selectedProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            priority={index === firstImageIndex}
          />
        ))}
      </motion.div>
    </section>
  );
}
