"use client";

import Link from "next/link";
import Portrait from "./Portrait";
import { useHoverSide } from "@/lib/useHoverSide";

export default function Hero() {
  const blend = useHoverSide();

  return (
    <section className="w-full px-6 py-6 md:py-8">
      {/* Desktop: Left text | Center portrait | Right text */}
      <div className="relative hidden md:grid grid-cols-[minmax(220px,1fr)_auto_minmax(220px,1fr)] gap-8 lg:gap-10 items-center justify-items-center max-w-[1700px] mx-auto">
        {/* Left Text */}
        <Link
          href="/work/ui-ux"
          className="text-right pr-4 transition-colors hover:text-accentUx focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentUx focus-visible:outline-offset-4 rounded"
        >
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-[-0.02em] text-ink uppercase">
            <div>UI/UX</div>
            <div>Developer</div>
          </h2>
        </Link>

        {/* Center Portrait */}
        <div className="relative z-10 [&>div]:!h-[58vh] [&>div]:!w-auto lg:[&>div]:!h-[83vh]">
          <Portrait blend={blend} />
        </div>

        {/* Right Text */}
        <Link
          href="/work/mobile"
          className="text-left pl-4 transition-colors hover:text-accentDev focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4 rounded"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-[0.85] tracking-[-0.02em] text-ink uppercase">
            <div>Mobile</div>
            <div>APP Dev</div>
          </h2>
        </Link>

        <Link
          href="/work/all"
          className="absolute right-0 top-1/2 -translate-y-1/2 font-body text-[12px] font-medium tracking-[0.1em] uppercase text-ink border border-accentDev/60 rounded-full px-4 py-2 transition-colors hover:bg-accentDev hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentDev focus-visible:outline-offset-4"
        >
          MY WORK
        </Link>
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
        <div className="relative z-10 [&>div]:!h-[62vh] [&>div]:!w-auto">
          <Portrait blend={blend} />
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
            <div>APP Dev</div>
          </h2>
        </Link>
      </div>
    </section>
  );
}
