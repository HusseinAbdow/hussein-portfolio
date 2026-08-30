"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Block =
  | { kind: "quote"; text: string }
  | { kind: "body"; text: string }
  | { kind: "emphasis"; text: string }
  | { kind: "closing"; text: string };

const blocks: Block[] = [
  {
    kind: "quote",
    text: "I'm Hussein, and I've got my eyes set on one particular space: social networks.",
  },
  {
    kind: "body",
    text: "It's a long-term ambition, and definitely one that requires me to think beyond just writing code.",
  },
  {
    kind: "body",
    text: "But here's the interesting part.",
  },
  {
    kind: "body",
    text: "Because that's what I'm building towards, I've had to specialize in a lot more than just one part of development. I can build backends that are built to handle complex products and real users. I can build mobile and web experiences where the UI and UX actually matter. I understand the product side, the data behind it, and how all these pieces need to work together.",
  },
  {
    kind: "emphasis",
    text: "And that's what makes me different.",
  },
  {
    kind: "body",
    text: "I'm not learning all these things because I want to collect technologies or job titles. I'm learning them because I want to understand the entire product I'm trying to build.",
  },
  {
    kind: "closing",
    text: "So yeah, my direction is social networks, but the skills I've developed chasing that goal are the ones that make me useful when I build anything else too.",
  },
];

const blockClasses: Record<Block["kind"], string> = {
  quote:
    "font-display font-bold text-[clamp(32px,5vw,56px)] leading-[1.08] tracking-[-0.02em] text-ink max-w-[640px] md:max-w-[min(640px,50vw)]",
  body: "font-body text-[clamp(20px,2.2vw,28px)] leading-[1.45] text-ink/85 max-w-[60ch] md:max-w-[min(60ch,50vw)]",
  emphasis:
    "font-display font-semibold text-[clamp(28px,4vw,44px)] leading-[1.15] tracking-[-0.02em] text-ink max-w-[560px] md:max-w-[min(560px,50vw)]",
  closing:
    "font-display font-bold text-[clamp(32px,5vw,56px)] leading-[1.08] tracking-[-0.02em] text-ink max-w-[640px] md:max-w-[min(640px,50vw)]",
};

export default function About() {
  return (
    <main className="relative">
      {/* Sticky full-bleed portrait (pinned on desktop, static banner on mobile) */}
      <div className="relative h-[55vh] w-full md:sticky md:top-0 md:z-0 md:h-screen">
        <Image
          src="/about.png"
          alt="Hussein Abdow"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        {/* Left-side legibility gradient (desktop) */}
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,14,26,0.92) 0%, rgba(10,14,26,0.8) 28%, rgba(10,14,26,0.45) 52%, rgba(10,14,26,0.12) 66%, transparent 72%)",
          }}
        />
        {/* Top/bottom edge blend into navbar and footer (desktop) */}
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,14,26,0.7) 0%, transparent 14%, transparent 86%, rgba(10,14,26,0.7) 100%)",
          }}
        />
        {/* Bottom gradient so the banner blends into the page bg (mobile) */}
        <div
          aria-hidden
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(10,14,26,0.75) 82%, #0a0e1a 100%)",
          }}
        />
      </div>

      {/* Text blocks scroll over the pinned image (desktop) / below banner (mobile) */}
      <div className="relative z-10 pb-10 md:-mt-[100vh] md:pb-[25vh]">
        {blocks.map((block, i) => (
          <div
            key={i}
            className="flex min-h-0 items-center px-6 py-10 sm:px-10 md:min-h-[78vh] md:py-0 md:pl-[14vw] md:pr-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={blockClasses[block.kind]}
            >
              {block.text}
            </motion.div>
          </div>
        ))}
      </div>
    </main>
  );
}
