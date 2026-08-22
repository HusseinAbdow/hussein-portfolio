import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WorkCategoryPageClient from "@/components/work/WorkCategoryPageClient";
import { projects } from "@/lib/projects";

type WorkFilter = "all" | "ui-ux" | "mobile" | "website";

const validFilters: WorkFilter[] = ["all", "ui-ux", "mobile", "website"];

interface PageProps {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return validFilters.map((category) => ({ category }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const { category } = params;
  const label =
    category === "all"
      ? "My Work"
      : category === "ui-ux"
        ? "UI/UX Work"
        : category === "mobile"
          ? "Mobile Work"
          : "Website Work";

  return {
    title: `${label} | Hussein Abdow`,
  };
}

export default function WorkCategoryPage({ params }: PageProps) {
  const { category } = params;

  if (!validFilters.includes(category as WorkFilter)) {
    notFound();
  }

  const activeCategory = category as WorkFilter;
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <WorkCategoryPageClient
      activeCategory={activeCategory}
      projects={filteredProjects}
    />
  );
}
