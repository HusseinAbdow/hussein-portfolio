"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import Portrait from "./Portrait";
import leftPortrait from "../images/left.webp";
import rightPortrait from "../images/right.webp";

const INTRO_COMPLETE_EVENT = "portfolio:intro-complete";
const INTRO_PLAYED_KEY = "introPlayed";
const PORTRAIT_INTRO_PLAYED_KEY = "portraitIntroPlayed";

// Same sizes string as the resting portrait so the sliding images resolve to
// identical (already-cached) optimized variants.
const PORTRAIT_SIZES = "(max-width: 768px) 80vw, (max-width: 1280px) 40vh, 70vh";

// Beat 2: fast, confident easeInOut sweep from off-screen right to a left overshoot.
const SLIDE_DURATION = 1.2;
const SLIDE_EASE = [0.65, 0, 0.35, 1] as const;
const START_OFFSET = 1.1; // start x, as a fraction of the portrait width (fully off to the right)
const OVERSHOOT = 0.26; // overshoot past center, as a fraction of the portrait width (left)
const HANDOFF_FRACTION = 0.3; // begin the final crossfade in the last 30% of the return journey
const CROSSFADE_DURATION = 0.45; // handoff crossfade between sliding image and real portrait
const IMAGE_SWAP_FADE = "opacity 130ms linear"; // quick snap-crossfade at the center crossover

type Phase = "waiting" | "sliding" | "returning" | "done";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function markPlayed() {
  try {
    window.sessionStorage.setItem(PORTRAIT_INTRO_PLAYED_KEY, "1");
  } catch {
    // sessionStorage unavailable — sequence will just replay next visit
  }
}

export default function PortraitIntroSequence({ blend }: { blend: number }) {
  const shouldReduceMotion = useReducedMotion();

  // "undetermined" renders the plain portrait so SSR/hydration output matches the server;
  // the layout effect below re-renders before first paint if the sequence will play.
  const [mode, setMode] = useState<"undetermined" | "static" | "sequence">("undetermined");
  const [phase, setPhase] = useState<Phase>("waiting");
  const [showUxImage, setShowUxImage] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [travel, setTravel] = useState(0); // portrait box width in px

  const x = useMotionValue(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("waiting");
  const travelRef = useRef(0);
  const beatRef = useRef({ swapped: false, handedOff: false });

  phaseRef.current = phase;
  travelRef.current = travel;

  // Decide once, before first paint, whether this visit gets the sequence.
  useIsomorphicLayoutEffect(() => {
    let played = false;
    try {
      played =
        !!window.sessionStorage.getItem(PORTRAIT_INTRO_PLAYED_KEY) ||
        !!window.sessionStorage.getItem(INTRO_PLAYED_KEY);
    } catch {
      played = false;
    }
    if (shouldReduceMotion || played) {
      markPlayed();
      setMode("static");
      return;
    }
    // First homepage load of the session: the intro is about to play, so hold the
    // portrait invisible and start the sequence when the intro signals completion.
    setMode("sequence");
  }, [shouldReduceMotion]);

  // Start the sequence right as the IntroLoader finishes sliding away.
  useEffect(() => {
    if (mode !== "sequence") return;

    const start = () => {
      const width = overlayRef.current?.offsetWidth ?? 0;
      if (!width) {
        setMode("static");
        return;
      }
      beatRef.current = { swapped: false, handedOff: false };
      setTravel(width);
      x.set(width * START_OFFSET);
      setPhase("sliding");
    };

    // Safety net: if the intro-completion event never arrives, fall back to static.
    const fallback = window.setTimeout(() => {
      if (phaseRef.current === "waiting") setMode("static");
    }, 5000);

    window.addEventListener(INTRO_COMPLETE_EVENT, start);
    return () => {
      window.removeEventListener(INTRO_COMPLETE_EVENT, start);
      window.clearTimeout(fallback);
    };
  }, [mode, x]);

  // Beat 2 → 3: slide in from the right, overshooting past center to the left.
  useEffect(() => {
    if (phase !== "sliding" || !travel) return;
    const controls = animate(x, -travel * OVERSHOOT, {
      duration: SLIDE_DURATION,
      ease: SLIDE_EASE,
      onComplete: () => setPhase("returning"),
    });
    return () => controls.stop();
  }, [phase, travel, x]);

  // Beat 4: spring back from the overshoot toward center.
  useEffect(() => {
    if (phase !== "returning") return;
    const controls = animate(x, 0, {
      type: "spring",
      stiffness: 24,
      damping: 6.8,
      mass: 1,
      onComplete: () => {
        markPlayed();
        setPhase("done");
      },
    });
    return () => controls.stop();
  }, [phase, x]);

  // Beat 3 (center crossover image swap) and beat 5 (final crossfade handoff).
  useAnimationFrame(() => {
    const currentPhase = phaseRef.current;
    if (currentPhase !== "sliding" && currentPhase !== "returning") return;
    const width = travelRef.current;
    if (!width) return;
    const currentX = x.get();

    if (currentPhase === "sliding" && !beatRef.current.swapped && currentX <= 0) {
      beatRef.current.swapped = true;
      setShowUxImage(true);
    }

    if (
      currentPhase === "returning" &&
      !beatRef.current.handedOff &&
      currentX >= -width * OVERSHOOT * HANDOFF_FRACTION
    ) {
      beatRef.current.handedOff = true;
      setHandoff(true);
    }
  });

  if (mode !== "sequence") {
    return <Portrait blend={blend} />;
  }

  const slider = (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      data-testid="portrait-intro-overlay"
    >
      <motion.div
        data-testid="portrait-intro-slider"
        className="absolute inset-0 will-change-transform"
        style={{ x }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "waiting" ? 0 : handoff ? 0 : 1 }}
        transition={{ duration: phase === "waiting" ? 0 : CROSSFADE_DURATION, ease: "easeInOut" }}
      >
        {/* Dev/hoodie photo — the starting image */}
        <Image
          src={rightPortrait}
          alt=""
          fill
          sizes={PORTRAIT_SIZES}
          className="object-cover"
          style={{
            objectPosition: "50% 12%",
            opacity: showUxImage ? 0 : 1,
            transition: IMAGE_SWAP_FADE,
          }}
        />
        {/* Colorful UX photo — swapped in at the center crossover */}
        <Image
          src={leftPortrait}
          alt=""
          fill
          sizes={PORTRAIT_SIZES}
          className="object-cover"
          style={{
            objectPosition: "50% 12%",
            opacity: showUxImage ? 1 : 0,
            transition: IMAGE_SWAP_FADE,
          }}
        />
      </motion.div>
    </div>
  );

  // The real portrait's media layer sits underneath at opacity 0 (via mediaHidden)
  // and fades in exactly while the sliding overlay fades out, so the handoff is
  // seamless. The overlay must live OUTSIDE the faded media layer, which is why
  // the base fade is applied to Portrait's media layer, not a wrapper element.
  return (
    <Portrait blend={blend} mediaHidden={!handoff} overlay={slider} />
  );
}
