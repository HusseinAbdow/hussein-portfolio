"use client";

import { projects } from "@/lib/projects";
import ProjectCard from "@/components/work/ProjectCard";
import ScrollReveal from "@/components/ScrollReveal";

const selectedSlugs = ["vanlife", "konfab", "timberfy", "sticky-wall"];

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
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {selectedProjects.map((project, index) => (
          <ScrollReveal
            key={project.slug}
            delay={80 + index * 80}
            distance={16}
            duration={450}
            className="h-full"
          >
            <ProjectCard
              project={project}
              priority={index === firstImageIndex}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
