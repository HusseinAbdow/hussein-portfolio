"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AtmosphereProps {
  intensity: number;
}

export default function AtmosphereDev({ intensity }: AtmosphereProps) {
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
      className="w-[300px] h-[400px] pointer-events-none select-none text-accentDev"
    >
      <svg
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Phone Outline */}
        <rect
          x="120"
          y="70"
          width="120"
          height="240"
          rx="18"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-70"
        />
        {/* Notch */}
        <rect
          x="160"
          y="76"
          width="40"
          height="8"
          rx="4"
          fill="currentColor"
          className="opacity-40"
        />
        {/* Phone home indicator */}
        <line
          x1="160"
          y1="300"
          x2="200"
          y2="300"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-40"
        />

        {/* Database Node */}
        <g className="opacity-80">
          <circle
            cx="60"
            cy="80"
            r="18"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <text
            x="60"
            y="84"
            fill="currentColor"
            textAnchor="middle"
            className="font-display text-[9px] font-bold tracking-wider"
          >
            DB
          </text>
          {/* Connection from DB to Phone */}
          <path
            d="M78 80 Q105 80 120 95"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </g>

        {/* Monospace API endpoint labels & lines */}
        <g className="font-mono text-[10px] font-medium">
          {/* Endpoint 1 */}
          <g className="opacity-80">
            <text x="25" y="150" fill="currentColor">
              GET /users
            </text>
            <path
              d="M85 147 H120"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="85" cy="147" r="2" fill="currentColor" />
          </g>

          {/* Endpoint 2 */}
          <g className="opacity-60">
            <text x="20" y="210" fill="currentColor">
              POST /contact
            </text>
            <path
              d="M100 207 Q110 207 120 180"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="100" cy="207" r="2" fill="currentColor" />
          </g>

          {/* Endpoint 3 */}
          <g className="opacity-40">
            <text x="30" y="270" fill="currentColor">
              200 OK
            </text>
            <path
              d="M70 267 Q95 267 120 250"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="70" cy="267" r="2" fill="currentColor" />
          </g>
        </g>

        {/* Server Nodes */}
        <g className="opacity-40">
          <rect
            x="200"
            y="330"
            width="60"
            height="16"
            rx="4"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="210" cy="338" r="2" fill="currentColor" />
          <circle cx="218" cy="338" r="2" fill="currentColor" />
          <line
            x1="180"
            y1="310"
            x2="200"
            y2="338"
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>
      </svg>
    </motion.div>
  );
}
