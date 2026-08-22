import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectDetailPageClient from "@/components/work/ProjectDetailPageClient";
import { projects } from "@/lib/projects";

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

export function generateStaticParams() {
  return projects.map((project) => ({
    category: project.category,
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project || project.category !== params.category) {
    return {};
  }

  return {
    title: `${project.title} | Hussein Abdow`,
    description: project.summary,
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project || project.category !== params.category) {
    notFound();
  }

  const categoryProjects = projects.filter(
    (p) => p.category === project.category,
  );
  const currentIndex = categoryProjects.findIndex(
    (p) => p.slug === project.slug,
  );
  const nextProject =
    categoryProjects[(currentIndex + 1) % categoryProjects.length];

  return (
    <ProjectDetailPageClient project={project} nextProject={nextProject} />
  );
}
