"use client";

import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";
import { lenisOptions } from "@/lib/lenis";

// Navbar height in px — must stay in sync with scroll-padding-top in globals.css.
const NAV_OFFSET = -80;

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const { ScrollTrigger } = ensureGsap();
    const lenis = new Lenis(lenisOptions);

    let frame = 0;
    let refreshed = false;

    const raf = (time: number) => {
      lenis.raf(time);
      // Defer the first ScrollTrigger refresh until after Lenis has ticked
      // once so that all useEffect-registered scroll triggers have fired and
      // the hero Reveal animations start from the correct scroll position.
      if (!refreshed) {
        ScrollTrigger.refresh();
        refreshed = true;
      }
      frame = window.requestAnimationFrame(raf);
    };

    lenis.on("scroll", () => ScrollTrigger.update());
    frame = window.requestAnimationFrame(raf);

    // Intercept anchor-link clicks and hand them off to Lenis so that smooth
    // scrolling is preserved and the fixed NavBar offset is applied.
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: NAV_OFFSET });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [reduceMotion]);

  return children;
}
