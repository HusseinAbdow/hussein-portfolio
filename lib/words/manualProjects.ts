import { collaborativeProjects } from "@/lib/projects";

export interface ManualProject {
  name: string;
  identifier: string;
  url: string;
}

// Static external repos for the project picker (no API fetch).
export const manualProjects: ManualProject[] = [
  {
    name: "Akıllı Rota Bulucu",
    identifier: "gh:akilli-rota-bulucu",
    url: "https://github.com/HusseinAbdow/akilli-rota-bulucu",
  },
  {
    name: "CRC Simulator",
    identifier: "gh:CRC-simulator",
    url: "https://github.com/Bash77/CRC-simulator",
  },
  {
    name: "Data Structures",
    identifier: "gh:data-structures",
    url: "https://github.com/HusseinAbdow/data-structures",
  },
];

export const manualProjectsByIdentifier = new Map(
  manualProjects.map((project) => [project.identifier, project])
);

export interface SelectableProject {
  identifier: string;
  title: string;
  url: string | null;
  isCaseStudy: boolean;
}

// Case studies first, then manual repos.
export function getSelectableProjects(): SelectableProject[] {
  const caseStudies: SelectableProject[] = collaborativeProjects.map(
    (project) => ({
      identifier: project.slug,
      title: project.title,
      url: project.repoUrl ?? null,
      isCaseStudy: true,
    })
  );

  const manual: SelectableProject[] = manualProjects.map((project) => ({
    identifier: project.identifier,
    title: project.name,
    url: project.url,
    isCaseStudy: false,
  }));

  return [...caseStudies, ...manual];
}
