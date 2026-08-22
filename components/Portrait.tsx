"use client";

import Image from "next/image";
import leftPortrait from "../images/left.avif";
import rightPortrait from "../images/right.avif";

interface PortraitProps {
  blend: number;
}

export default function Portrait({ blend }: PortraitProps) {
  const leftBoundary = Number((100 - blend).toFixed(2));
  const leftClip = `polygon(0 0, ${leftBoundary}% 0, ${leftBoundary}% 100%, 0 100%)`;
  const rightClip = `polygon(${leftBoundary}% 0, 100% 0, 100% 100%, ${leftBoundary}% 100%)`;

  return (
    <div
      className="relative bg-transparent w-[min(78vw,60vh)] aspect-square h-auto md:w-auto md:aspect-[5/6] md:h-[45vh] lg:h-[92vh] lg:mt-[10vh] xl:h-[100vh] xl:mt-[8vh]"
      style={{
        boxShadow:
          "0 40px 90px -32px rgba(2, 6, 23, 0.85), 0 18px 44px -22px rgba(30, 41, 59, 0.55)",
      }}
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
    </div>
  );
}
