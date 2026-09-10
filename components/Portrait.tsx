"use client";

import Image from "next/image";
import leftPortrait from "../images/left.webp";
import rightPortrait from "../images/right.webp";
import mobilePortrait from "../images/mobile-potrait.png";

interface PortraitProps {
  blend: number;
}

export default function Portrait({ blend }: PortraitProps) {
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
      <div className="absolute inset-0 md:hidden">
        <Image
          src={mobilePortrait}
          alt="Hussein Abdow, UI/UX and mobile developer portrait"
          fill
          priority
          sizes="(max-width: 767px) 60vw"
          className="absolute inset-0 object-contain"
        />
      </div>

      <div className="absolute inset-0 hidden md:block" style={{ clipPath: leftClip }}>
        <Image
          src={leftPortrait}
          alt="Hussein Abdow, UI/UX developer portrait"
          fill
          priority
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 40vh, 70vh"
          className="absolute inset-0 object-cover"
          style={{
            objectPosition: "50% 12%",
          }}
        />
      </div>

      <div className="absolute inset-0 hidden md:block" style={{ clipPath: rightClip }}>
        <Image
          src={rightPortrait}
          alt="Hussein Abdow, mobile developer portrait"
          fill
          priority
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 40vh, 70vh"
          className="absolute inset-0 object-cover md:!-top-[5px] md:!h-[calc(100%+5px)]"
          style={{
            objectPosition: "50% 22%",
          }}
        />
      </div>
    </div>
  );
}
