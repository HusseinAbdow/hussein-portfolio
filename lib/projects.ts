export type ProjectCategory = "ui-ux" | "mobile" | "website";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  summary: string;
  description: string;
  tagline?: string;
  builtItems?: string[];
  challenge?: string;
  tags: string[];
  repoUrl?: string;
  figmaUrl?: string;
  techStack?: string[];
  coverType: "image" | "video";
  coverSrc: string;
  gallery: { type: "image" | "video"; src: string; caption?: string }[];
  collaborative?: boolean;
}

export const projects: Project[] = [
  {
    slug: "timberfy",
    title: "Timberfy",
    category: "mobile",
    year: 2026,
    summary:
      "A Flutter shopping app for browsing and buying Timberland-style footwear, backed by a local PostgreSQL database.",
    description:
      "Timberfy is a Flutter e-commerce app inspired by Timberland-style footwear. Users can browse shoes by gender and category, view detailed product pages with multiple images, like favorites, and manage a shopping cart — all built on a clean, reusable component architecture with a local PostgreSQL database for persistence.",
    tagline:
      "A Flutter shopping app for browsing and buying Timberland-style footwear.",
    builtItems: [
      "Built product browsing by gender and category, with detailed multi-image product pages",
      "Implemented cart and favorites backed by a local PostgreSQL database",
      "Structured the app with reusable, scalable Flutter components",
    ],
    challenge:
      "The main challenge was keeping cart and favorites state in sync across screens without prop-drilling — I used a shared state layer so the UI stayed consistent as users navigated the app.",
    tags: ["Flutter", "PostgreSQL", "Mobile UI"],
    techStack: ["Flutter", "PostgreSQL", "Mobile UI"],
    repoUrl: "https://github.com/HusseinAbdow/timberfy",
    collaborative: true,
    coverType: "video",
    coverSrc: "/work/timberfy/timberfy-preview.mp4",
    gallery: [
      { type: "image", src: "/work/timberfy/homepage.jpg", caption: "Homepage" },
      { type: "image", src: "/work/timberfy/shoe-details.jpg", caption: "Shoe Details" },
      { type: "image", src: "/work/timberfy/cart.jpg", caption: "Cart" },
      { type: "image", src: "/work/timberfy/profile.jpg", caption: "Profile" },
    ],
  },
  {
    slug: "vanlife",
    title: "VanLife",
    category: "website",
    year: 2025,
    summary:
      "A car leasing platform for browsing available vehicles, managing active leases, and reviewing customer feedback.",
    description:
      "VanLife is a full-stack car leasing website built with PHP, HTML, and CSS. It lets users browse available vehicles with detailed specs, view and manage active leases, and read customer reviews — combining a clean, browsable catalog experience with practical account/lease management.",
    tagline:
      "A full-stack car leasing platform for browsing vehicles and managing leases.",
    builtItems: [
      "Built the vehicle catalog with detailed specs and availability",
      "Implemented active lease tracking and a customer review system",
      "Combined PHP backend logic with a clean, browsable front-end",
    ],
    challenge:
      "The main challenge was keeping lease data consistent — availability, active leases, and reviews all needed to stay in sync as users interacted with the same vehicle from different pages.",
    tags: ["PHP", "HTML", "CSS"],
    techStack: ["PHP", "HTML", "CSS"],
    repoUrl: "https://github.com/HusseinAbdow/vanlife",
    coverType: "video",
    coverSrc: "/work/vanlife/landing-page-video.mp4",
    gallery: [
      {
        type: "image",
        src: "/work/vanlife/landing-page.png",
        caption: "Landing page",
      },
      {
        type: "image",
        src: "/work/vanlife/available-cars.png",
        caption: "Available cars",
      },
      {
        type: "image",
        src: "/work/vanlife/car-info.png",
        caption: "Car details",
      },
      {
        type: "image",
        src: "/work/vanlife/car-info-2.png",
        caption: "Car details — specs",
      },
      {
        type: "image",
        src: "/work/vanlife/active-leases.png",
        caption: "Active leases",
      },
      {
        type: "image",
        src: "/work/vanlife/customer-review.png",
        caption: "Customer reviews",
      },
    ],
  },
  {
    slug: "timberland-shoe-app",
    title: "Timberland Shoe App",
    category: "mobile",
    year: 2025,
    summary:
      "An earlier, simpler Flutter e-commerce UI for browsing Timberland boots and managing a cart.",
    description:
      "Timberland Shoe App is a Flutter e-commerce UI for browsing Timberland boots and managing a shopping cart, built with a clean Provider-based state architecture. It was the first version of this concept, later expanded into the more complete Timberfy. The app uses ChangeNotifier/Consumer for reactive cart state and google_nav_bar for animated Shop and Cart navigation.",
    tagline:
      "An earlier, simpler Flutter e-commerce UI for browsing Timberland boots and managing a cart.",
    builtItems: [
      "Built product browsing and a shopping cart with Provider-based state management",
      "Practiced clean navigation between product and cart screens",
      "Laid the groundwork that Timberfy later expanded on",
    ],
    challenge:
      "This was my first attempt at managing shared app state in Flutter — working with Provider here is what led me to build Timberfy's more complete architecture afterward.",
    tags: ["Flutter", "Provider", "Mobile UI"],
    techStack: ["Flutter", "Provider", "Mobile UI"],
    repoUrl: "https://github.com/HusseinAbdow/timberland-shoe-shop",
    coverType: "video",
    coverSrc: "/work/timberland-shoe-app/timberland-app-preview.mp4",
    gallery: [
      { type: "image", src: "/work/timberland-shoe-app/homepage.png", caption: "Homepage" },
      { type: "image", src: "/work/timberland-shoe-app/cart.png", caption: "Cart" },
    ],
  },
  {
    slug: "sticky-wall",
    title: "Sticky Wall",
    category: "website",
    year: 2026,
    summary:
      "A lightweight sticky-note style task board where users create, complete, and organize their day at a glance.",
    description:
      "Sticky Wall is a full-stack task management app built with Node.js, Express, and Firebase Firestore. Each user gets a personal, sticky-note styled dashboard for creating tasks, marking them complete, and keeping pending and finished work clearly separated — a simple, visual take on the classic to-do list.",
    tagline:
      "A sticky-note styled task board for creating, completing, and organizing tasks.",
    builtItems: [
      "Built a Node.js and Express backend with Firebase Firestore for real-time data",
      "Implemented per-user task boards with pending/completed separation",
      "Designed the sticky-note visual metaphor for the dashboard",
    ],
    challenge:
      "The main challenge was keeping each user's task board isolated and fast — I structured Firestore queries per-user so reads stay quick as a board grows.",
    tags: ["Node.js", "Express", "Firebase Firestore"],
    techStack: ["Node.js", "Express", "Firebase Firestore"],
    repoUrl: "https://github.com/HusseinAbdow/sticky-wall",
    collaborative: true,
    coverType: "video",
    coverSrc: "/work/sticky-wall/sticky-note-preview.mp4",
    gallery: [
      { type: "image", src: "/work/sticky-wall/login_page.png", caption: "Login" },
      { type: "image", src: "/work/sticky-wall/dashboard.png", caption: "Dashboard" },
      { type: "image", src: "/work/sticky-wall/completed.png", caption: "Completed Tasks" },
      { type: "image", src: "/work/sticky-wall/pending.png", caption: "Pending Tasks" },
    ],
  },
  {
    slug: "konfab",
    title: "Konfab — University Community App",
    category: "ui-ux",
    year: 2026,
    summary:
      "An early-stage community platform concept helping university students organize discussions by interest instead of scattered group chats.",
    description:
      "Konfab is an in-progress concept for a community-based academic discussion platform. Students can create and join communities around specific interests — a course, a subject, a hobby — instead of relying on scattered, disorganized group chats for academic communication. The project is in early design stages, with full development planned over the following months.",
    tagline:
      "An early-stage concept for a community-based academic discussion platform.",
    builtItems: [
      "Designed the core information architecture: communities, posts, comments, and messaging",
      "Mapped user flows for creating and joining interest-based communities",
      "Iterated every screen in Figma from wireframe to polished UI",
    ],
    challenge:
      "The main design challenge was replacing scattered group chats with a structure students would actually adopt — organizing communities by interest rather than by class or course code.",
    tags: ["Figma", "UI Design", "Community Platform"],
    figmaUrl:
      "https://www.figma.com/design/McO1lCKaMKdoXFj1R8frxX/Konfab-University-Community-App?node-id=0-1&p=f&t=BR0TQD3atsDoOSeg-0",
    coverType: "image",
    coverSrc: "/work/konfab/all-screens.jpeg",
    gallery: [
      { type: "image", src: "/work/konfab/konfab-homepage.png", caption: "Homepage" },
      { type: "image", src: "/work/konfab/topluluk-sayfa.png", caption: "Community Page" },
      { type: "image", src: "/work/konfab/yorumlar.png", caption: "Comments" },
      { type: "image", src: "/work/konfab/topluluklarim.png", caption: "My Communities" },
      { type: "image", src: "/work/konfab/profil.png", caption: "Profile" },
      { type: "image", src: "/work/konfab/kesfet.png", caption: "Discover" },
      { type: "image", src: "/work/konfab/mesajlar.png", caption: "Messages" },
      { type: "image", src: "/work/konfab/bildirimler.png", caption: "Notifications" },
      { type: "image", src: "/work/konfab/olustur.png", caption: "Create Community" },
    ],
  },
  {
    slug: "todo-app",
    title: "To-Do App",
    category: "mobile",
    year: 2025,
    summary:
      "A cross-platform to-do app with full CRUD task management, backed by a real PostgreSQL database.",
    description:
      "A To-Do List application built with Flutter and PostgreSQL, demonstrating full CRUD task management with a focus on simplicity, productivity, and a modern UI.",
    tagline: "A cross-platform to-do app with full CRUD task management.",
    builtItems: [
      "Built full create, read, update, and delete task flows backed by PostgreSQL",
      "Focused the UI on simplicity and fast interaction",
      "Practiced clean Flutter architecture end-to-end",
    ],
    challenge:
      "The main challenge was keeping the UI simple while still supporting full CRUD without extra screens slowing down quick task entry.",
    tags: ["Flutter", "PostgreSQL", "CRUD"],
    techStack: ["Flutter", "PostgreSQL", "CRUD"],
    repoUrl: "https://github.com/HusseinAbdow/to-do-app",
    coverType: "video",
    coverSrc: "/work/todo-app/todo-app-preview.mp4",
    gallery: [
      { type: "image", src: "/work/todo-app/list.png", caption: "Task List" },
      { type: "image", src: "/work/todo-app/add_task.png", caption: "Add Task" },
      { type: "image", src: "/work/todo-app/delete_task.png", caption: "Delete Task" },
    ],
  },
  {
    slug: "smart-road-safety",
    title: "Smart Road Safety — Teknofest 5G & AI Competition",
    category: "ui-ux",
    year: 2026,
    summary:
      "A road surveillance app designed for the Teknofest 5G and AI competition.",
    description:
      "This is a lo-fi UI/UX concept designed for Teknofest, a competition combining 5G networks, Network APIs, and AI for real-world applications. The brief asked teams to use network resources dynamically and deliver value through AI-based real-time analysis — this concept applies that to road safety, with a camera-based monitoring interface, incident history, and analysis views.",
    tagline:
      "A road surveillance app, built for the Teknofest 5G and AI competition.",
    builtItems: [
      "Designed the core monitoring flow: live camera view, detection results, and alerts",
      "Mapped history and analysis views for reviewing past incidents",
      "Built the concept around real-time AI detection results",
    ],
    challenge:
      "The main design challenge was presenting dense AI detection data — vehicle, driver, phone-use, smoking detection — without overwhelming the primary live-monitoring view.",
    tags: ["Figma", "UI Design", "Teknofest"],
    figmaUrl:
      "https://www.figma.com/design/RMjJZqt0EzlF5udkxiQlNA/Road-survalience-with-AI?node-id=0-1&p=f",
    coverType: "image",
    coverSrc: "/work/smart-road-safety/all-screens.jpeg",
    gallery: [
      { type: "image", src: "/work/smart-road-safety/login.png", caption: "Login" },
      { type: "image", src: "/work/smart-road-safety/homepage.png", caption: "Homepage" },
      { type: "image", src: "/work/smart-road-safety/full-camera-view.png", caption: "Full Camera View" },
      { type: "image", src: "/work/smart-road-safety/history.png", caption: "History" },
      { type: "image", src: "/work/smart-road-safety/analysis.png", caption: "Analysis" },
    ],
    collaborative: true,
  },
];

export const collaborativeProjects = projects.filter(
  (project) => project.collaborative
);
