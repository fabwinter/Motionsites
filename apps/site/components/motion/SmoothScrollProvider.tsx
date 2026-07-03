"use client";

import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";
import { lenisOptions } from "@/lib/lenis";

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const { ScrollTrigger } = ensureGsap();
    const lenis = new Lenis(lenisOptions);

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    lenis.on("scroll", () => ScrollTrigger.update());
    frame = window.requestAnimationFrame(raf);
    ScrollTrigger.refresh();

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return children;
}
