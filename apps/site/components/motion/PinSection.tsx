"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ensureGsap } from "@/lib/gsap";

type PinSectionProps = PropsWithChildren<{
  className?: string;
}>;

export function PinSection({ children, className }: PinSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || reduceMotion) {
      return;
    }

    const element = containerRef.current;
    const { gsap } = ensureGsap();
    const content = element.firstElementChild;

    if (!content) {
      return;
    }

    const animation = gsap.fromTo(
      content,
      { yPercent: 0 },
      {
        yPercent: -12,
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "+=80%",
          scrub: true,
          pin: true
        }
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [reduceMotion]);

  return (
    <div ref={containerRef} className={className}>
      <div>{children}</div>
    </div>
  );
}
