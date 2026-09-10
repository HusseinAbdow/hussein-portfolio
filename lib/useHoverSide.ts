"use client";

import { useEffect, useState, useRef } from "react";

export function useHoverSide(): number {
  const [blend, setBlend] = useState(50);
  const targetRef = useRef(50);
  const currentRef = useRef(50);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // SSR check
    if (typeof window === "undefined") return;

    const isStatic = () =>
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;

    // Touch-only devices with no fine cursor (coarse pointer) or mobile-width
    // viewports keep a fixed 50/50 split with no hover blend
    if (isStatic()) {
      setBlend(50);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isStatic()) {
        targetRef.current = 50;
        return;
      }
      const width = window.innerWidth;
      const xPercent = (e.clientX / width) * 100;
      targetRef.current = Math.min(Math.max(xPercent, 0), 100);
    };

    const handleMouseLeave = () => {
      targetRef.current = 50;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const update = () => {
      const lerpFactor = 0.08;
      const diff = targetRef.current - currentRef.current;
      
      // Update value with lerp
      currentRef.current += diff * lerpFactor;

      // Snap to target if extremely close to prevent micro-renders
      if (Math.abs(currentRef.current - targetRef.current) < 0.01) {
        currentRef.current = targetRef.current;
      }

      setBlend(currentRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return blend;
}
