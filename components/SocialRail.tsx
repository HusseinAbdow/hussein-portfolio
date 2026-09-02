"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { socialLinks } from "@/lib/socialLinks";

const INTRO_COMPLETE_EVENT = "portfolio:intro-complete";

export default function SocialRail() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(pathname !== "/");
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setIsReady(true);
      return;
    }

    const handleIntroComplete = () => setIsReady(true);
    window.addEventListener(INTRO_COMPLETE_EVENT, handleIntroComplete);
    return () => window.removeEventListener(INTRO_COMPLETE_EVENT, handleIntroComplete);
  }, [pathname]);

  return (
    <motion.nav
      aria-label="Social links"
      initial={{ x: -20, opacity: 0 }}
      animate={isReady ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
      className="fixed left-4 top-[calc(50%-12px)] z-30 hidden -translate-y-1/2 flex-col items-center gap-4 2xl:flex 2xl:left-6"
    >
      {socialLinks.map(({ href, label, icon: Icon, external }, index) => {
        const isHovered = hovered === index;
        // Deterministic pseudo-random duration in [2.5, 3.5)s so SSR and client match
        const bobDuration = 2.5 + ((index * 0.37 + 0.13) % 1);
        return (
          <div key={label} className="flex flex-col items-center gap-3">
            <motion.a
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              animate={
                shouldReduceMotion || isHovered
                  ? { y: 0, scale: isHovered ? 1.18 : 1 }
                  : { y: [0, -6, 0], scale: 1 }
              }
              transition={
                isHovered
                  ? { duration: 0.2, ease: "easeOut" }
                  : {
                      duration: bobDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.4,
                    }
              }
              className={`transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded ${
                index % 2 === 0
                  ? "hover:text-accentUx focus-visible:outline-accentUx"
                  : "hover:text-accentDev focus-visible:outline-accentDev"
              }`}
            >
              <Icon size={21} />
            </motion.a>
            {index < socialLinks.length - 1 && <span aria-hidden className="h-8 w-px bg-border" />}
          </div>
        );
      })}
    </motion.nav>
  );
}
