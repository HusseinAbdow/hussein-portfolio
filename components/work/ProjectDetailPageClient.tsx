"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/projects";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

interface ProjectDetailPageClientProps {
  project: Project;
  nextProject: Project;
}

function getCategoryLabel(category: Project["category"]): string {
  if (category === "ui-ux") return "UI/UX Work";
  if (category === "mobile") return "Mobile Work";
  return "Website Work";
}

function getAccentText(category: Project["category"]): string {
  if (category === "ui-ux") return "text-accentUx";
  if (category === "mobile") return "text-accentDev";
  return "text-muted";
}

function getTagTint(category: Project["category"]): string {
  if (category === "ui-ux") return "border-accentUx/40 text-accentUx";
  if (category === "mobile") return "border-accentDev/40 text-accentDev";
  return "border-border text-muted";
}

type GalleryItem = Project["gallery"][number];

function getImageDimensions(src: string) {
  if (src.includes("timberfy") || src.includes("timberland-shoe-app")) {
    return { width: 720, height: 1280 };
  }
  if (src.includes("konfab/all-screens")) return { width: 1600, height: 1294 };
  if (src.includes("smart-road-safety/all-screens")) return { width: 2560, height: 957 };
  if (src.includes("konfab") || src.includes("smart-road-safety")) {
    return { width: 578, height: 1050 };
  }
  if (src.includes("vanlife")) return { width: 1919, height: 881 };
  return { width: 1920, height: 1077 };
}

const revealEase = [0.22, 1, 0.36, 1] as const;

function GalleryItem({
  item,
  alt,
  onOpen,
  index,
  isMobile = false,
  isUiUx = false,
  isOverview = false,
  columns = 1,
}: {
  item: GalleryItem;
  alt: string;
  onOpen: () => void;
  index: number;
  isMobile?: boolean;
  isUiUx?: boolean;
  isOverview?: boolean;
  columns?: number;
}) {
  const rotate = index % 2 === 0 ? -2 : 2;
  const label = String(index + 1).padStart(2, "0");
  const imageDimensions = getImageDimensions(item.src);

  if (isOverview) {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.4 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0 }}
        variants={{ hidden: {}, show: {} }}
        className="mb-8 md:mb-10 w-full"
      >
        <motion.header
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: revealEase },
            },
          }}
          className="mx-auto mb-4 md:mb-5 w-fit max-w-full text-center"
        >
          <p className="font-body text-[12px] uppercase tracking-[0.12em] text-muted mb-1">
            {label}
          </p>
          {item.caption ? (
            <h2 className="font-display text-[20px] md:text-[24px] font-semibold text-ink">
              {item.caption}
            </h2>
          ) : null}
        </motion.header>
        <motion.button
          type="button"
          onClick={onOpen}
          variants={{
            hidden: { opacity: 0, y: 60, scale: 0.9, rotate },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              transition: { duration: 0.6, ease: revealEase },
            },
          }}
          className="mx-auto block w-full aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface cursor-pointer focus:outline-none focus-visible:border-ink shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
        >
          {item.type === "video" ? (
            <video
              src={item.src}
              className="block h-full w-full object-contain"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={item.src}
              alt={alt}
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="block w-full max-h-[60vh] object-contain"
            />
          )}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0 }}
      variants={{ hidden: {}, show: {} }}
      className={isMobile || isUiUx ? "mb-0 max-w-[280px]" : "mb-10 md:mb-16"}
    >
      <motion.header
        variants={{
          hidden: { opacity: 0, y: 40 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: revealEase },
          },
        }}
        className={`mx-auto ${isMobile ? "mb-3" : "mb-4 md:mb-5"} w-fit max-w-full text-center`}
      >
        <p className="font-body text-[12px] uppercase tracking-[0.12em] text-muted mb-1">
          {label}
        </p>
        {item.caption ? (
          <h2 className={`font-display ${isMobile ? "text-[16px] md:text-[18px]" : "text-[20px] md:text-[24px]"} font-semibold text-ink`}>
            {item.caption}
          </h2>
        ) : null}
      </motion.header>
      <motion.button
        type="button"
        onClick={onOpen}
        variants={{
          hidden: { opacity: 0, y: 60, scale: 0.9, rotate },
          show: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: {
              duration: 0.6,
              ease: revealEase,
              delay: isMobile ? (index % columns) * 0.1 : 0,
            },
          },
        }}
         className={isMobile
           ? "mx-auto block w-full aspect-[9/16] max-w-[280px] overflow-hidden rounded-xl border border-border bg-surface cursor-pointer focus:outline-none focus-visible:border-ink"
           : isUiUx
             ? "mx-auto block w-full aspect-[9/16] max-w-full overflow-hidden rounded-xl border border-border bg-surface cursor-pointer focus:outline-none focus-visible:border-ink"
           : "mx-auto block w-full aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface cursor-pointer focus:outline-none focus-visible:border-ink shadow-[0_18px_50px_rgba(0,0,0,0.35)]"}
      >
        {item.type === "video" ? (
          <video
            src={item.src}
            className="block h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={item.src}
            alt={alt}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className={isMobile ? "block h-full w-full object-cover" : "block h-full w-auto object-contain"}
          />
        )}
      </motion.button>
    </motion.div>
  );
}

export default function ProjectDetailPageClient({
  project,
  nextProject,
}: ProjectDetailPageClientProps) {
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxItem(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const mobileColumns =
    project.gallery.length >= 4 ? 4 : project.gallery.length >= 3 ? 3 : 2;

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-bg text-ink px-6 md:px-16 py-10 md:py-14"
    >
      <div className="max-w-[1200px] mx-auto">
        <nav className="mb-8">
          <Link
            href={project.category === "mobile" ? "/work/mobile" : "/work/web-uiux"}
            className={`font-body text-[12px] uppercase tracking-[0.12em] ${getAccentText(project.category)} hover:opacity-70 transition-opacity`}
          >
            &larr; Back to {getCategoryLabel(project.category)}
          </Link>
        </nav>

        <header className="mb-8 md:mb-10">
          <h1 className="font-display text-[clamp(36px,6vw,72px)] leading-[0.95] uppercase mb-4">
            {project.title}
          </h1>
          <p className="font-body text-[14px] text-muted mb-5">{project.year}</p>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {(project.techStack ?? project.tags).map((tag) => (
              <span
                key={tag}
                className={`font-body text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border ${getTagTint(project.category)}`}
              >
                {tag}
              </span>
            ))}
          </div>
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-[12px] font-medium tracking-[0.1em] uppercase text-ink border border-accentDev/60 rounded-full px-4 py-2 transition-colors hover:bg-accentDev hover:text-bg"
            >
              <GithubIcon size={14} />
              <span>View on GitHub</span>
            </a>
          ) : project.figmaUrl ? (
            <a
              href={project.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-[12px] font-medium tracking-[0.1em] uppercase text-ink border border-accentUx/60 rounded-full px-4 py-2 transition-colors hover:bg-accentUx hover:text-bg"
            >
              <ExternalLink size={14} />
              <span>View in Figma</span>
            </a>
          ) : null}
        </header>

          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border mb-10 md:mb-12 bg-surface">
            {project.coverType === "video" ? (
              <video
                src={project.coverSrc}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={project.coverSrc}
                alt={`${project.title} hero`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            )}
        </div>

        <section className="max-w-[65ch] mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: revealEase }}
            className="font-body text-[15px] md:text-[16px] leading-relaxed text-ink/90"
          >
            {project.description}
          </motion.p>
        </section>

        <section className="mb-14 md:mb-20">
          {project.category === "ui-ux" ? (
            <>
              {project.gallery.length > 0 && (
                <GalleryItem
                  key={project.gallery[0].src}
                  item={project.gallery[0]}
                  alt={project.gallery[0].caption ?? project.title}
                  onOpen={() => setLightboxItem(project.gallery[0])}
                  index={0}
                  isUiUx
                  isOverview
                  columns={mobileColumns}
                />
              )}
              {project.gallery.length > 1 && (
                <div className="flex flex-wrap items-start justify-center gap-8 md:gap-10">
                  {project.gallery.slice(1).map((item, index) => (
                    <GalleryItem
                      key={item.src}
                      item={item}
                      alt={item.caption ?? project.title}
                      onOpen={() => setLightboxItem(item)}
                      index={index + 1}
                      isUiUx
                      columns={mobileColumns}
                    />
                  ))}
                </div>
              )}
            </>
          ) : project.category === "mobile" ? (
            <div className="flex flex-wrap items-start justify-center gap-8 md:gap-10">
              {project.gallery.map((item, index) => (
                <GalleryItem
                  key={item.src}
                  item={item}
                  alt={item.caption ?? project.title}
                  onOpen={() => setLightboxItem(item)}
                  index={index}
                  isMobile
                  columns={mobileColumns}
                />
              ))}
            </div>
          ) : (
            project.gallery.map((item, index) => (
              <GalleryItem
                key={item.src}
                item={item}
                alt={item.caption ?? project.title}
                onOpen={() => setLightboxItem(item)}
                index={index}
                columns={mobileColumns}
              />
            ))
          )}
        </section>

        <section className="mb-4">
          <Link href={`/work/${nextProject.category}/${nextProject.slug}`} className="block group">
            <motion.article
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: revealEase }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-border bg-surface/60 overflow-hidden p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-shadow"
            >
              <p className="font-body text-[12px] uppercase tracking-[0.12em] text-muted mb-2">
                Next Project
              </p>
              <h2 className="font-display text-[clamp(24px,3vw,40px)] leading-tight uppercase mb-2 group-hover:text-white transition-colors">
                {nextProject.title}
              </h2>
              <p className="font-body text-[14px] text-muted leading-relaxed">
                {nextProject.summary}
              </p>
            </motion.article>
          </Link>
        </section>
      </div>

      <AnimatePresence>
        {lightboxItem ? (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 bg-black/85 cursor-pointer"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative max-w-[1100px] w-full max-h-full cursor-default"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close"
                className="absolute -top-10 right-0 font-body text-[13px] uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors"
              >
                X Close
              </button>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-surface">
                {lightboxItem.type === "video" ? (
                  <video
                    src={lightboxItem.src}
                    className="h-full w-full object-contain"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls
                  />
                ) : (
                  <Image
                    src={lightboxItem.src}
                    alt={lightboxItem.caption ?? project.title}
                    width={getImageDimensions(lightboxItem.src).width}
                    height={getImageDimensions(lightboxItem.src).height}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              {lightboxItem.caption ? (
                <p className="mt-3 text-center font-body text-[12px] uppercase tracking-[0.1em] text-muted">
                  {lightboxItem.caption}
                </p>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
