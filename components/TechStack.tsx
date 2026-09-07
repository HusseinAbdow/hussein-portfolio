"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import {
  SiFlutter,
  SiDart,
  SiOpenjdk,
  SiSpringboot,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiPhp,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiFigma,
  SiGit,
  SiGithub,
  SiAndroidstudio,
} from "react-icons/si";
import type { IconType } from "react-icons";
import {
  Smartphone,
  Server,
  Database,
  Globe,
  CodeXml,
  Palette,
  Wrench,
  Network,
  PenTool,
  Frame,
  SquareCode,
  type LucideIcon,
} from "lucide-react";

type TechIcon = IconType | LucideIcon;

interface Tech {
  label: string;
  icon: TechIcon;
}

interface Category {
  label: string;
  icon: LucideIcon;
  items: Tech[];
}

const categories: Category[] = [
  {
    label: "Mobile Development",
    icon: Smartphone,
    items: [
      { label: "Flutter", icon: SiFlutter },
      { label: "Dart", icon: SiDart },
    ],
  },
  {
    label: "Backend & APIs",
    icon: Server,
    items: [
      { label: "Node.js", icon: SiNodedotjs },
      { label: "Express", icon: SiExpress },
      { label: "NestJS", icon: SiNestjs },
      { label: "Spring Boot", icon: SiSpringboot },
      { label: "REST APIs", icon: Network },
    ],
  },
  {
    label: "Web Development",
    icon: Globe,
    items: [
      { label: "JavaScript", icon: SiJavascript },
      { label: "TypeScript", icon: SiTypescript },
      { label: "PHP", icon: SiPhp },
      { label: "HTML", icon: SiHtml5 },
      { label: "CSS", icon: SiCss },
    ],
  },
  {
    label: "Data & Services",
    icon: Database,
    items: [
      { label: "PostgreSQL", icon: SiPostgresql },
      { label: "MySQL", icon: SiMysql },
      { label: "Firebase", icon: SiFirebase },
      { label: "Firestore", icon: SiFirebase },
    ],
  },
  {
    label: "Programming",
    icon: CodeXml,
    items: [
      { label: "Java", icon: SiOpenjdk },
      { label: "Python", icon: SiPython },
    ],
  },
  {
    label: "Design & UX",
    icon: Palette,
    items: [
      { label: "Figma", icon: SiFigma },
      { label: "UI/UX Design", icon: PenTool },
      { label: "Wireframing", icon: Frame },
    ],
  },
  {
    label: "Development Tools",
    icon: Wrench,
    items: [
      { label: "Git", icon: SiGit },
      { label: "GitHub", icon: SiGithub },
      { label: "VS Code", icon: SquareCode },
      { label: "Android Studio", icon: SiAndroidstudio },
    ],
  },
];

const pillClasses =
  "inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-accentUx/60 bg-accentUx/5 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.08em] text-accentUx transition-colors duration-200 hover:border-accentUx hover:bg-accentUx/15";

export default function TechStack() {
  return (
    <section className="bg-bg px-6 py-12 md:px-16 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-10 md:mb-14">
          <ScrollReveal delay={80} distance={12} duration={400}>
            <p className="mb-3 font-body text-[12px] tracking-[0.12em] uppercase text-muted">
              Toolkit
            </p>
          </ScrollReveal>
          <ScrollReveal delay={160} distance={12} duration={400}>
            <h2 className="max-w-[760px] font-display text-[clamp(36px,6vw,72px)] leading-[0.95]">
              What I build with.
            </h2>
          </ScrollReveal>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {categories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <ScrollReveal
                key={category.label}
                delay={240 + categoryIndex * 80}
                distance={16}
                duration={450}
              >
                <div className="rounded-2xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-accentUx/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <ScrollReveal delay={50} distance={12} duration={400}>
                    <h3 className="mb-5 flex items-center gap-3">
                      <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-accentUx/10 text-accentUx">
                        <CategoryIcon size={18} aria-hidden />
                      </span>
                      <span className="font-display font-bold text-ink">
                        {category.label}
                      </span>
                    </h3>
                  </ScrollReveal>
                  <ScrollReveal
                    delay={90}
                    distance={12}
                    duration={400}
                    className="flex flex-wrap gap-2.5"
                  >
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.span
                          key={`${category.label}-${item.label}`}
                          whileHover={{ scale: 1.04 }}
                          className={pillClasses}
                        >
                          <Icon size={15} aria-hidden />
                          {item.label}
                        </motion.span>
                      );
                    })}
                  </ScrollReveal>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
