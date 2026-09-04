"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

// Reticle geometry: tight resting square, expanded "target lock" square on hover.
const RETICLE_REST_SIZE = 26;
const RETICLE_HOVER_SIZE = 44;
const BRACKET_ARM = 10;
const BRACKET_STROKE = 2;
const LABEL_GAP = 8;

type Accent = "ux" | "dev";

interface HoverInfo {
  label: string;
  accent: Accent;
}

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], .cursor-pointer, [data-cursor-label]';

function resolveHover(target: EventTarget | null): HoverInfo | null {
  if (!(target instanceof Element)) return null;
  const interactive = target.closest(INTERACTIVE_SELECTOR);
  if (!interactive) return null;

  const accentAttr = interactive
    .closest("[data-cursor-accent]")
    ?.getAttribute("data-cursor-accent");
  const accent: Accent = accentAttr === "dev" ? "dev" : "ux";

  // Explicit per-site override wins, then tag/role heuristics.
  const explicit = interactive.getAttribute("data-cursor-label");
  if (explicit) return { label: `> ${explicit.toUpperCase()}`, accent };

  const role = interactive.getAttribute("role");
  if (interactive.tagName === "BUTTON" || role === "button") {
    return { label: "> BUTTON", accent };
  }
  if (interactive.tagName === "A") {
    return { label: "> LINK", accent };
  }
  return { label: "> CLICK", accent };
}

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest("input, textarea, select, [contenteditable]");
}

export default function CustomCursor() {
  // Renders nothing on the server and until a fine pointer is confirmed,
  // so touch devices never get listeners or cursor-hiding CSS.
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false); // mouse has moved & is inside the viewport
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [overField, setOverField] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Pointer qualification + native-cursor hiding.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      // Raw tracking: motion values only, zero React re-renders.
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      setOverField((prev) => {
        const next = isFormField(e.target);
        return prev === next ? prev : next;
      });
      setHover((prev) => {
        const next = resolveHover(e.target);
        return prev?.label === next?.label && prev?.accent === next?.accent
          ? prev
          : next;
      });
    };

    const onOut = (e: MouseEvent) => {
      // Moving between children of the same interactive element keeps the label.
      if (
        e.relatedTarget instanceof Element &&
        e.relatedTarget.closest(INTERACTIVE_SELECTOR)
      ) {
        return;
      }
      setHover(null);
    };

    const onLeaveViewport = () => setVisible(false);
    const onEnterViewport = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);
    document.addEventListener("mouseleave", onLeaveViewport);
    document.addEventListener("mouseenter", onEnterViewport);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
      document.removeEventListener("mouseleave", onLeaveViewport);
      document.removeEventListener("mouseenter", onEnterViewport);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const shown = visible && !overField;
  const accentColor =
    hover?.accent === "dev" ? "var(--accent-dev)" : "var(--accent-ux)";
  const bracketColor = hover ? accentColor : "var(--ink)";
  const size = hover ? RETICLE_HOVER_SIZE : RETICLE_REST_SIZE;
  const half = size / 2;
  const labelTop = half + LABEL_GAP;

  // Two short perpendicular lines meeting at one corner of the targeting box.
  const corners: Array<{
    key: string;
    className: string;
    borders: React.CSSProperties;
  }> = [
    {
      key: "tl",
      className: "left-0 top-0",
      borders: {
        borderLeftWidth: BRACKET_STROKE,
        borderTopWidth: BRACKET_STROKE,
      },
    },
    {
      key: "tr",
      className: "right-0 top-0",
      borders: {
        borderRightWidth: BRACKET_STROKE,
        borderTopWidth: BRACKET_STROKE,
      },
    },
    {
      key: "bl",
      className: "left-0 bottom-0",
      borders: {
        borderLeftWidth: BRACKET_STROKE,
        borderBottomWidth: BRACKET_STROKE,
      },
    },
    {
      key: "br",
      className: "right-0 bottom-0",
      borders: {
        borderRightWidth: BRACKET_STROKE,
        borderBottomWidth: BRACKET_STROKE,
      },
    },
  ];

  return (
    <>
      {/* Targeting reticle — glued to the pointer via raw motion values (no lag) */}
      <motion.div
        aria-hidden
        data-testid="custom-cursor-reticle"
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x, y }}
      >
        <motion.div
          className="relative"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            width: size,
            height: size,
            opacity: shown ? 0.8 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {corners.map(({ key, className, borders }) => (
            <motion.span
              key={key}
              className={`absolute ${className}`}
              style={{ width: BRACKET_ARM, height: BRACKET_ARM, ...borders }}
              animate={{ borderColor: bracketColor }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          ))}
        </motion.div>

        {/* Contextual label — sits just below the expanded reticle box */}
        <motion.div
          data-testid="custom-cursor-label"
          className="absolute left-0 whitespace-nowrap font-mono text-[11px] leading-none text-muted"
          style={{ x: "-50%", top: labelTop }}
          animate={{
            opacity: shown && hover ? 0.9 : 0,
            y: hover ? 2 : -2,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {hover ? hover.label : ""}
        </motion.div>
      </motion.div>
    </>
  );
}
