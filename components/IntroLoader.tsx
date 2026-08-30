"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function IntroLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is requested, slide out after 500ms, otherwise wait for text/progress animations (~2.4s)
    const displayDuration = shouldReduceMotion ? 500 : 2500;

    let completionTimer: number | undefined;
    const timer = setTimeout(() => {
      setIsVisible(false);
      completionTimer = window.setTimeout(() => {
        window.dispatchEvent(new Event("portfolio:intro-complete"));
      }, 600);
    }, displayDuration);

    return () => {
      clearTimeout(timer);
      if (completionTimer) window.clearTimeout(completionTimer);
    };
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.62, 0.05, 0.01, 0.99] }} // Custom smooth easeInOut panel slide
          className="fixed inset-0 text-ink z-50 flex flex-col items-center justify-center px-6 overflow-hidden select-none"
          style={{ backgroundColor: "#090909" }}
        >
          {shouldReduceMotion ? (
            <div className="font-display font-semibold text-lg text-ink/50 tracking-wider">
              HUSSEIN ABDOW
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-8 text-center max-w-[600px]">
              {/* Step 1: Small Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col space-y-1 font-body text-[13px] font-medium tracking-[0.1em] text-ink/60 uppercase"
              >
                <span>HUSSEIN ABDOW</span>
                <span className="text-ink/40">PORTFOLIO / 2026</span>
              </motion.div>

              {/* Step 2: Main Statement */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                className="font-display font-semibold text-[clamp(20px,4vw,32px)] leading-snug text-ink"
              >
                I build what people use — and design how it feels.
              </motion.h2>

              {/* Step 3: Progress Bar */}
              <div className="relative pt-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  className="relative w-[160px] h-[1px] bg-ink/20 overflow-hidden"
                >
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "0%" }}
                    transition={{
                      delay: 1.6,
                      duration: 0.8,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-ink"
                  />
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
