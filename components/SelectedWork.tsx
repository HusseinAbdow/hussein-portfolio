"use client";

import { projects } from "@/lib/projects";
import ProjectCard from "@/components/work/ProjectCard";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";

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
      <div className="mx-auto mt-10 flex max-w-[1200px] justify-center md:mt-14">
        <Link
          href="/work/all"
          className="group inline-flex items-center gap-2 font-body text-[12px] font-medium tracking-[0.1em] uppercase text-ink border border-accentDev/60 rounded-full px-5 py-2.5 transition-colors hover:bg-accentDev hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4"
        >
          <span>VIEW ALL WORK</span>
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
