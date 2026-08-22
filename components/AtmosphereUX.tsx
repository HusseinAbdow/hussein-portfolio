"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AtmosphereProps {
  intensity: number;
}

export default function AtmosphereUX({ intensity }: AtmosphereProps) {
  const shouldReduceMotion = useReducedMotion();

  const opacity = 0.55 + intensity * 0.45;
  const scale = shouldReduceMotion ? 1 : 0.95 + intensity * 0.05;

  return (
    <motion.div
      style={{ opacity, scale }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 100, damping: 20 }
      }
      className="w-[300px] h-[400px] pointer-events-none select-none text-accentUx"
    >
      <svg
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* UI Card Outline */}
        <rect
          x="40"
          y="60"
          width="130"
          height="70"
          rx="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-60"
        />
        <text
          x="55"
          y="85"
          fill="currentColor"
          className="font-body text-[10px] tracking-wider font-medium opacity-80"
        >
          CARD HEADER
        </text>
        <line
          x1="55"
          y1="100"
          x2="145"
          y2="100"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-40"
        />

        {/* Small Button Outline */}
        <rect
          x="150"
          y="180"
          width="100"
          height="36"
          rx="18"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-80"
        />
        <text
          x="200"
          y="202"
          fill="currentColor"
          textAnchor="middle"
          className="font-body text-[10px] tracking-widest font-bold opacity-90"
        >
          SUBMIT
        </text>

        {/* Grid Pattern Fragment */}
        <g className="opacity-30">
          <line
            x1="20"
            y1="260"
            x2="100"
            y2="260"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="280"
            x2="100"
            y2="280"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="300"
            x2="100"
            y2="300"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="240"
            x2="40"
            y2="320"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="240"
            x2="60"
            y2="320"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="80"
            y1="240"
            x2="80"
            y2="320"
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>

        {/* Cursor/Crosshair */}
        <g className="opacity-70">
          <circle cx="110" cy="198" r="4" fill="currentColor" />
          <path
            d="M110 185 V211 M97 198 H123"
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>

        {/* Dimension Line */}
        <g className="opacity-60">
          <line
            x1="210"
            y1="80"
            x2="210"
            y2="150"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="205"
            y1="80"
            x2="215"
            y2="80"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="205"
            y1="150"
            x2="215"
            y2="150"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="220"
            y="105"
            width="30"
            height="20"
            rx="4"
            fill="var(--bg)"
            stroke="currentColor"
            strokeWidth="1"
          />
          <text
            x="235"
            y="119"
            fill="currentColor"
            textAnchor="middle"
            className="font-body text-[9px] font-semibold"
          >
            120
          </text>
        </g>
      </svg>
    </motion.div>
  );
}
