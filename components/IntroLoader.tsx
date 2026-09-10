"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const INTRO_PLAYED_KEY = "introPlayed";
const INTRO_COMPLETE_EVENT = "portfolio:intro-complete";

const QUOTE = "The world is full of things nobody has built yet. I find that difficult to ignore.";

// Deterministic pseudo-random in [0, 1) per index so SSR and client match
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const r1 = rand(i * 4 + 1);
  const r2 = rand(i * 4 + 2);
  const r3 = rand(i * 4 + 3);
  const r4 = rand(i * 4 + 4);
  const opacity = 0.1 + r3 * 0.16;
  return {
    left: 6 + r1 * 88,
    top: 8 + r2 * 84,
    size: 3 + r3 * 4,
    color:
      i % 2 === 0
        ? `rgba(167, 139, 250, ${opacity.toFixed(3)})`
        : `rgba(56, 189, 248, ${opacity.toFixed(3)})`,
    duration: 5 + r4 * 4,
    dx: (r1 - 0.5) * 64,
    dy: (r2 - 0.5) * 52,
    delay: r4 * 2,
  };
});

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function IntroLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    // One-time-per-session: if the intro already played, skip instantly (before first paint).
    if (window.sessionStorage.getItem(INTRO_PLAYED_KEY)) {
      setSkipAnimation(true);
      setIsVisible(false);
      window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
      return;
    }

    // Keep the whole intro (including exit) within ~4.4s.
    const displayDuration = shouldReduceMotion ? 3000 : 4000;

    let completionTimer: number | undefined;
    const timer = setTimeout(() => {
      window.sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
      setIsVisible(false);
      completionTimer = window.setTimeout(() => {
        window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
      }, 400);
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
          transition={{
            duration: skipAnimation ? 0 : shouldReduceMotion ? 0.6 : 0.35,
            ease: [0.62, 0.05, 0.01, 0.99],
          }}
          className="fixed inset-0 text-ink z-50 flex flex-col items-center justify-center px-6 overflow-hidden select-none"
          style={{ backgroundColor: "#090909" }}
        >
          {/* Radial glow behind the quote for depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(167, 139, 250, 0.10), rgba(56, 189, 248, 0.07) 45%, transparent 70%)",
            }}
          />

          {/* Ambient drifting particles */}
          {!shouldReduceMotion &&
            PARTICLES.map((particle, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="pointer-events-none absolute rounded-full"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                }}
                animate={{
                  x: [0, particle.dx, 0],
                  y: [0, particle.dy, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: particle.delay,
                }}
              />
            ))}

          {shouldReduceMotion ? (
            <div className="relative flex flex-col items-center space-y-6 text-center max-w-[640px]">
              <div className="font-display font-semibold text-[clamp(20px,4.2vw,38px)] leading-snug text-ink">
                {QUOTE}
              </div>
              <div className="font-display italic text-[16px] text-ink/70">
                &mdash; Hussein
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center space-y-8 text-center max-w-[680px]">
              {/* Step 1: Small Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col space-y-1 font-body text-[13px] font-medium tracking-[0.1em] text-ink/60 uppercase"
              >
                <span>HUSSEIN ABDOW</span>
                <span className="text-ink/40">PORTFOLIO / 2026</span>
              </motion.div>

              {/* Step 2: Quote, revealed word by word */}
              <h2 className="font-display font-semibold text-[clamp(22px,4.2vw,38px)] leading-snug text-ink">
                {QUOTE.split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    className="inline-block will-change-transform"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.06,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                  >
                    {word}
                    {i < QUOTE.split(" ").length - 1 ? "\u00A0" : ""}
                  </motion.span>
                ))}
              </h2>

              {/* Step 3: Personal signature, fading in after the quote */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.4, ease: "easeOut" }}
                className="font-display italic text-[clamp(14px,1.8vw,18px)] text-ink/70"
              >
                &mdash; Hussein
              </motion.div>

              {/* Step 4: Progress line */}
              <div className="relative pt-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 0.2 }}
                  className="relative w-[160px] h-[1px] bg-ink/20 overflow-hidden"
                >
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "0%" }}
                    transition={{
                      delay: 2.55,
                      duration: 1.2,
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
