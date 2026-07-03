"use client";

import { createElement, useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import SplitType from "split-type";
import { ensureGsap } from "@/lib/gsap";

type RevealMode = "lines" | "words" | "chars";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  mode?: RevealMode;
};

export function Reveal({
  as = "div",
  children,
  className,
  mode = "lines"
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduceMotion) {
      return;
    }

    const element = ref.current;
    const { gsap, ScrollTrigger } = ensureGsap();
    const split = new SplitType(element, { types: mode });
    const targets =
      (mode === "chars" ? split.chars : mode === "words" ? split.words : split.lines) ??
      [element];

    const animation = gsap.fromTo(
      targets,
      { opacity: 0, yPercent: 105 },
      {
        opacity: 1,
        yPercent: 0,
        stagger: 0.04,
        scrollTrigger: {
          trigger: element,
          start: "top 82%"
        }
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
      split.revert();
      ScrollTrigger.refresh();
    };
  }, [mode, reduceMotion]);

  return createElement(as, { className, ref }, children);
}
