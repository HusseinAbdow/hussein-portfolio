"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const LABEL_THROTTLE_MS = 90; // coordinate readout refresh cadence (rAF-driven)
const DOT_SIZE = 6;

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
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const lastLabelUpdate = useRef(0);

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

    // Throttled coordinate readout: rAF loop that only commits state every ~90ms.
    let raf = 0;
    const loop = (t: number) => {
      if (t - lastLabelUpdate.current >= LABEL_THROTTLE_MS) {
        lastLabelUpdate.current = t;
        const nx = Math.round(x.get());
        const ny = Math.round(y.get());
        setCoords((prev) =>
          prev.x === nx && prev.y === ny ? prev : { x: nx, y: ny }
        );
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);
    document.addEventListener("mouseleave", onLeaveViewport);
    document.addEventListener("mouseenter", onEnterViewport);

    return () => {
      cancelAnimationFrame(raf);
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
  const half = DOT_SIZE / 2;

  return (
    <>
      {/* Cursor dot — glued to the pointer tip via raw motion values (no lag) */}
      <motion.div
        aria-hidden
        data-testid="custom-cursor-dot"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full"
        style={{
          x,
          y,
          width: DOT_SIZE,
          height: DOT_SIZE,
          marginLeft: -half,
          marginTop: -half,
        }}
        animate={{
          opacity: shown ? 1 : 0,
          scale: hover ? 1.8 : 1,
          backgroundColor: hover ? accentColor : "var(--ink)",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Monospace coordinate readout / contextual hover label */}
      <motion.div
        aria-hidden
        data-testid="custom-cursor-label"
        className="pointer-events-none fixed left-0 top-0 z-[100] whitespace-nowrap font-mono text-[11px] leading-none text-muted"
        style={{ x, y, marginLeft: 16, marginTop: 16 }}
        animate={{ opacity: shown ? 0.7 : 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {hover ? hover.label : `X:${coords.x} Y:${coords.y}`}
      </motion.div>
    </>
  );
}
