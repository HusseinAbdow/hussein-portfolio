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

      {/* Left text | Center portrait | Right text at every viewport width */}
      <div className="relative grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-1.5 sm:gap-3 lg:gap-8 xl:gap-10 items-center justify-items-center max-w-[1700px] mx-auto">
        {/* Left Text */}
        <Link
          href="/work/web-uiux"
          className="min-w-0 max-w-full text-right pr-0.5 sm:pr-1 lg:pr-2 xl:pr-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          <h2
            className="font-display text-[clamp(0.875rem,4vw,4.5rem)] sm:text-[clamp(1.125rem,4vw,4.5rem)] font-black leading-[0.85] tracking-[-0.04em] lg:tracking-[-0.02em] uppercase will-change-transform"
            style={{
              opacity: uxOpacity,
              color: uxColor,
              transform: `scale(${uxScale})`,
              transformOrigin: "right center",
              transition: "opacity 150ms linear, color 150ms linear",
            }}
          >
            <div>
              WEB &amp; <span className="whitespace-nowrap">UI/&nbsp;UX</span>
            </div>
            <div>DEVELOPER</div>
          </h2>
          <p
            className="mt-5 max-w-[300px] font-body text-[clamp(14px,1.6vw,17px)] leading-relaxed text-muted max-md:hidden"
            style={{ opacity: uxOpacity, transition: "opacity 150ms linear" }}
          >
            I care about how a product feels — then I build the experience behind it.
          </p>
        </Link>

        {/* Center Portrait */}
        <div className="relative z-10 min-w-0 w-full">
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
        <div className="min-w-0 flex flex-col items-start pl-0.5 sm:pl-1 lg:pl-2 xl:pl-4">
          <Link
            href="/work/mobile"
            className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4 rounded"
          >
            <h2
              className="font-display text-[clamp(0.875rem,4vw,4.5rem)] sm:text-[clamp(1.125rem,4vw,4.5rem)] font-black leading-[0.85] tracking-[-0.04em] lg:tracking-[-0.02em] uppercase will-change-transform"
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
            <p
              className="mt-5 max-w-[300px] font-body text-[clamp(14px,1.6vw,17px)] leading-relaxed text-muted max-md:hidden"
              style={{ opacity: devOpacity, transition: "opacity 150ms linear" }}
            >
              Building mobile products with real architecture, real data, and the user experience in mind.
            </p>
          </Link>
          <Link
            href="/work/all"
            className="group mt-7 hidden sm:inline-flex items-center gap-2 font-body text-[12px] font-medium tracking-[0.1em] uppercase text-ink border border-accentDev/60 rounded-full px-4 py-2 transition-colors hover:bg-accentDev hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4"
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

    </section>
  );
}
