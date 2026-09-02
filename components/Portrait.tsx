"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import leftPortrait from "../images/left.webp";
import rightPortrait from "../images/right.webp";

interface PortraitProps {
  blend: number;
  /** Optional layer rendered on top of the portrait (used by the one-time intro sequence). */
  overlay?: ReactNode;
  /** While true, the split portrait's own images are faded out (intro sequence handoff). */
  mediaHidden?: boolean;
}

export default function Portrait({ blend, overlay, mediaHidden }: PortraitProps) {
  const leftBoundary = Number((100 - blend).toFixed(2));
  const leftClip = `polygon(0 0, ${leftBoundary}% 0, ${leftBoundary}% 100%, 0 100%)`;
  const rightClip = `polygon(${leftBoundary}% 0, 100% 0, 100% 100%, ${leftBoundary}% 100%)`;

  return (
    <div
      className="relative bg-transparent w-full min-w-0 aspect-square h-auto md:w-auto md:aspect-[5/6] md:h-[45vh] lg:h-[48vh] xl:h-[76vh] 2xl:h-[88vh] 2xl:mt-[5vh]"
      style={{
        filter:
          "drop-shadow(0 25px 50px rgba(2, 6, 23, 0.6)) drop-shadow(0 12px 28px rgba(30, 41, 59, 0.4))",
      }}
    >
      <motion.div
        data-testid="portrait-media"
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: mediaHidden ? 0 : 1 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        <Image
          src={leftPortrait}
          alt="Hussein Abdow, UI/UX developer portrait"
          fill
          priority
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 40vh, 70vh"
          className="absolute inset-0 object-cover"
          style={{
            clipPath: leftClip,
            objectPosition: "50% 12%",
          }}
        />

        <Image
          src={rightPortrait}
          alt="Hussein Abdow, mobile developer portrait"
          fill
          priority
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 40vh, 70vh"
          className="absolute inset-0 object-cover"
          style={{
            clipPath: rightClip,
            objectPosition: "50% 12%",
          }}
        />
      </motion.div>

      {overlay}
    </div>
  );
}
