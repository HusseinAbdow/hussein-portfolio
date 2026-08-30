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
      {socialLinks.map(({ href, label, icon: Icon, external }, index) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <a
            href={href}
            aria-label={label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-muted transition-all hover:scale-110 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
          >
            <Icon size={21} />
          </a>
          {index < socialLinks.length - 1 && <span aria-hidden className="h-8 w-px bg-border" />}
        </div>
      ))}
    </motion.nav>
  );
}
