"use client";

import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import { useReducedMotion } from "framer-motion";
import { ensureGsap } from "@/lib/gsap";

type ParallaxProps = PropsWithChildren<{
  speed?: number;
  className?: string;
}>;

export function Parallax({ children, speed = 10, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduceMotion) {
      return;
    }

    const { gsap } = ensureGsap();
    const animation = gsap.fromTo(
      ref.current,
      { yPercent: speed },
      {
        yPercent: speed * -1,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reduceMotion, speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
