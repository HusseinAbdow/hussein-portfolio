"use client";

import Image from "next/image";
import leftPortrait from "../images/left.avif";
import rightPortrait from "../images/right.avif";

interface PortraitProps {
  blend: number;
}

export default function Portrait({ blend }: PortraitProps) {
  const leftBoundary = Math.min(Math.max(blend, 5), 95);
  const leftClip = `polygon(0 0, ${leftBoundary}% 0, ${leftBoundary}% 100%, 0 100%)`;
  const rightClip = `polygon(${leftBoundary}% 0, 100% 0, 100% 100%, ${leftBoundary}% 100%)`;

  return (
    <div className="relative w-64 sm:w-72 md:w-auto md:h-[58vh] lg:h-[72vh] aspect-[3/4] overflow-hidden">
      <Image
        src={leftPortrait}
        alt="Hussein Abdow, UI/UX developer portrait"
        fill
        priority
        sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
        className="absolute inset-0 object-cover"
        style={{
          clipPath: leftClip,
          objectPosition: "50% 18%",
        }}
      />

      <Image
        src={rightPortrait}
        alt="Hussein Abdow, mobile developer portrait"
        fill
        priority
        sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
        className="absolute inset-0 object-cover"
        style={{
          clipPath: rightClip,
          objectPosition: "50% 18%",
        }}
      />
    </div>
  );
}
