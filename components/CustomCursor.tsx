"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

const INTERACTIVE_SELECTOR =
  'a, button:not(:disabled), [role="button"], input, textarea, select, .cursor-pointer';

const SIZE_NORMAL = 40;
const SIZE_HOVER = 50;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = useReducedMotion();
  const reduced = Boolean(reducedMotion);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip touch-only devices with no fine cursor (coarse pointer)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setHovering(Boolean(target?.closest?.(INTERACTIVE_SELECTOR)));
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = hovering ? SIZE_HOVER : SIZE_NORMAL;
  const half = size / 2;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x: reduced ? x : springX, y: reduced ? y : springY }}
    >
      <motion.div
        className="rounded-full border border-ink"
        initial={{ opacity: 0 }}
        animate={{
          width: size,
          height: size,
          marginLeft: -half,
          marginTop: -half,
          opacity: visible ? (hovering ? 0.8 : 0.6) : 0,
          backgroundColor: hovering
            ? "rgba(245, 247, 250, 0.08)"
            : "rgba(245, 247, 250, 0)",
        }}
        transition={
          reduced
            ? { duration: 0.1 }
            : { type: "spring", stiffness: 300, damping: 24 }
        }
      />
    </motion.div>
  );
}
