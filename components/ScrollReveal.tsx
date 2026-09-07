"use client";

import type { CSSProperties, ReactNode } from "react";
import { SCROLL_REVEAL_EASE, useScrollReveal } from "@/lib/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  /** Stagger delay in ms (applied as transition-delay). */
  delay?: number;
  /** Slide-up distance in px while hidden. */
  distance?: number;
  /** Animation duration in ms. */
  duration?: number;
  /** CSS easing for the transition. */
  ease?: string;
}

export default function ScrollReveal({
  children,
  className = "",
  once = false,
  threshold,
  rootMargin,
  delay = 0,
  distance = 24,
  duration = 500,
  ease = SCROLL_REVEAL_EASE,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
    once,
  });

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "none" : `translateY(${distance}px)`,
    transition: `opacity ${duration}ms ${ease} ${delay}ms, transform ${duration}ms ${ease} ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
