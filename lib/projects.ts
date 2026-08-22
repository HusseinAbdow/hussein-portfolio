export type ProjectCategory = "ui-ux" | "mobile" | "website";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  summary: string;
  description: string;
  tags: string[];
  coverType: "image" | "video";
  coverSrc: string;
  gallery: { type: "image" | "video"; src: string; caption?: string }[];
}

export const projects: Project[] = [
  {
    slug: "aurora-banking-dashboard",
    title: "Aurora Banking Dashboard (Placeholder)",
    category: "ui-ux",
    year: 2026,
    summary:
      "Placeholder fintech dashboard concept focused on account clarity and fast decision flows.",
    description:
      "This placeholder UI/UX case study explores a modern banking dashboard for personal and small-business users. The concept emphasizes readable data density, fast navigation between accounts, and consistent interaction patterns for high-frequency actions. The current assets and copy are mock content to evaluate layout rhythm before final project materials are added.",
    tags: ["UI Audit", "Design System", "Accessibility", "Prototype"],
    coverType: "image",
    coverSrc: "/placeholder-project-1.jpg",
    gallery: [
      {
        type: "image",
        src: "/placeholder-project-1.jpg",
        caption: "Dashboard overview wireframe placeholder",
      },
      {
        type: "image",
        src: "/placeholder-project-2.jpg",
        caption: "Component library and token placeholder",
      },
      {
        type: "video",
        src: "/placeholder-project-1.mp4",
        caption: "Interaction walkthrough placeholder",
      },
    ],
  },
  {
    slug: "northstar-travel-booking-flow",
    title: "Northstar Travel Booking Flow (Placeholder)",
    category: "ui-ux",
    year: 2025,
    summary:
      "Placeholder end-to-end booking flow aimed at reducing drop-off during checkout.",
    description:
      "This placeholder project maps a multi-step travel booking journey from search to payment confirmation. The design direction prioritizes confidence cues, progressive disclosure for complex options, and mobile-first ergonomics. All visuals are temporary placeholders intended for spacing and interaction validation.",
    tags: ["Journey Mapping", "Mobile UX", "Checkout", "Usability"],
    coverType: "image",
    coverSrc: "/placeholder-project-3.jpg",
    gallery: [
      {
        type: "image",
        src: "/placeholder-project-3.jpg",
        caption: "Search and filter stage placeholder",
      },
      {
        type: "image",
        src: "/placeholder-project-4.jpg",
        caption: "Review and checkout stage placeholder",
      },
    ],
  },
  {
    slug: "pulse-habit-mobile-app",
    title: "Pulse Habit Mobile App (Placeholder)",
    category: "mobile",
    year: 2026,
    summary:
      "Placeholder cross-platform habit app concept with lightweight analytics and streak motivation.",
    description:
      "This placeholder mobile case study presents a productivity app concept built around short daily loops, meaningful reminders, and visual progress snapshots. The technical direction includes an API-backed sync model and reusable UI modules for rapid iteration. Content, media, and metrics are intentionally mock values until final assets are introduced.",
    tags: ["React Native", "API Integration", "State Flows", "Motion"],
    coverType: "video",
    coverSrc: "/placeholder-project-2.mp4",
    gallery: [
      {
        type: "video",
        src: "/placeholder-project-2.mp4",
        caption: "Onboarding sequence placeholder",
      },
      {
        type: "image",
        src: "/placeholder-project-5.jpg",
        caption: "Progress dashboard placeholder",
      },
      {
        type: "image",
        src: "/placeholder-project-6.jpg",
        caption: "Reminder and settings placeholder",
      },
    ],
  },
  {
    slug: "solstice-agency-website",
    title: "Solstice Agency Website (Placeholder)",
    category: "website",
    year: 2024,
    summary:
      "Placeholder marketing site concept balancing storytelling sections with conversion-focused CTAs.",
    description:
      "This placeholder website project explores a narrative-led agency homepage with modular service sections, case highlights, and prominent conversion touchpoints. The objective is to test content hierarchy, pacing, and visual transitions before replacing placeholders with real brand assets and production copy.",
    tags: ["Next.js", "Content Strategy", "Performance", "SEO"],
    coverType: "image",
    coverSrc: "/placeholder-project-7.jpg",
    gallery: [
      {
        type: "image",
        src: "/placeholder-project-7.jpg",
        caption: "Homepage hero placeholder",
      },
      {
        type: "image",
        src: "/placeholder-project-8.jpg",
        caption: "Services section placeholder",
      },
      {
        type: "video",
        src: "/placeholder-project-3.mp4",
        caption: "Scroll interaction placeholder",
      },
    ],
  },
];
