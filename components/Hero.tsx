"use client";

import Link from "next/link";
import Portrait from "./Portrait";
import { useHoverSide } from "@/lib/useHoverSide";

export default function Hero() {
  const blend = useHoverSide();

  const uxT = blend / 100;
  const devT = 1 - blend / 100;

  const uxOpacity = 1 - uxT * 0.6;
  const devOpacity = 1 - devT * 0.6;

  const uxScale = 1 + devT * 0.05;
  const devScale = 1 + uxT * 0.05;

  const mixInkMuted = (t: number) => {
    const ink = [245, 247, 250];
    const muted = [148, 163, 184];
    const [r, g, b] = ink.map((v, i) => Math.round(v + (muted[i] - v) * t));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const uxColor = mixInkMuted(uxT);
  const devColor = mixInkMuted(devT);

  return (
    <section className="relative w-full px-6 py-6 md:py-8">
      {/* Edge vignette (behind content, subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(2, 6, 23, 0.4) 100%)",
        }}
      />

      {/* Desktop: Left text | Center portrait | Right text */}
      <div className="relative hidden md:grid grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)] gap-8 lg:gap-10 items-center justify-items-center max-w-[1700px] mx-auto">
        {/* Left Text */}
        <Link
          href="/work/ui-ux"
          className="text-right pr-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          <h2
            className="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-[0.85] tracking-[-0.02em] uppercase will-change-transform"
            style={{
              opacity: uxOpacity,
              color: uxColor,
              transform: `scale(${uxScale})`,
              transformOrigin: "right center",
              transition: "opacity 150ms linear, color 150ms linear",
            }}
          >
            <div>UI/UX</div>
            <div>Developer</div>
          </h2>
        </Link>

        {/* Center Portrait */}
        <div className="relative z-10">
          {/* Ambient accent glow behind portrait */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[130%] blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 32% 42%, rgba(167, 139, 250, 0.11), transparent 55%), radial-gradient(circle at 68% 58%, rgba(56, 189, 248, 0.11), transparent 55%)",
            }}
          />
          <div className="relative">
            <Portrait blend={blend} />
          </div>
        </div>

        {/* Right Text + CTA */}
        <div className="flex flex-col items-start pl-4">
          <Link
            href="/work/mobile"
            className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4 rounded"
          >
            <h2
              className="font-display text-4xl md:text-5xl xl:text-6xl font-black leading-[0.85] tracking-[-0.02em] uppercase will-change-transform"
              style={{
                opacity: devOpacity,
                color: devColor,
                transform: `scale(${devScale})`,
                transformOrigin: "left center",
                transition: "opacity 150ms linear, color 150ms linear",
              }}
            >
              <div>Mobile</div>
              <div>APP Developer</div>
            </h2>
          </Link>
          <Link
            href="/work/all"
            className="group mt-8 inline-flex items-center gap-2 font-body text-[12px] font-medium tracking-[0.1em] uppercase text-ink border border-accentDev/60 rounded-full px-4 py-2 transition-colors hover:bg-accentDev hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4"
          >
            <span>MY WORK</span>
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile: Stacked */}
      <div className="md:hidden flex flex-col items-center gap-8">
        <Link
          href="/work/ui-ux"
          className="text-center transition-colors hover:text-accentUx focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          <h2 className="font-display text-5xl font-black leading-[0.85] tracking-[-0.02em] text-ink uppercase">
            <div>UI/UX</div>
            <div>Developer</div>
          </h2>
        </Link>
        <div className="relative z-10">
          {/* Ambient accent glow behind portrait (mobile) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[130%] blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 32% 42%, rgba(167, 139, 250, 0.11), transparent 55%), radial-gradient(circle at 68% 58%, rgba(56, 189, 248, 0.11), transparent 55%)",
            }}
          />
          <div className="relative">
            <Portrait blend={blend} />
          </div>
        </div>
        <Link
          href="/work/all"
          className="font-body text-[12px] font-medium tracking-[0.1em] uppercase text-ink border border-accentDev/60 rounded-full px-4 py-2 transition-colors hover:bg-accentDev hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4"
        >
          MY WORK
        </Link>
        <Link
          href="/work/mobile"
          className="text-center transition-colors hover:text-accentDev focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4 rounded"
        >
          <h2 className="font-display text-4xl font-black leading-[0.85] tracking-[-0.02em] text-ink uppercase">
            <div>Mobile</div>
            <div>APP Developer</div>
          </h2>
        </Link>
      </div>
    </section>
  );
}
