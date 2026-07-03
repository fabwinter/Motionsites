"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import siteConfig from "@site-config";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ensureGsap } from "@/lib/gsap";

export function NavBar() {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !ref.current) {
      return;
    }

    const SCROLL_THRESHOLD = 80;
    const element = ref.current;
    const { gsap } = ensureGsap();
    let lastScroll = 0;

    const onScroll = () => {
      const current = window.scrollY;

      if (current < SCROLL_THRESHOLD) {
        gsap.to(element, { y: 0, duration: 0.3, ease: "power2.out" });
      } else if (current > lastScroll) {
        gsap.to(element, { y: "-120%", duration: 0.3, ease: "power2.in" });
      } else {
        gsap.to(element, { y: 0, duration: 0.3, ease: "power2.out" });
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);

  return (
    <header
      ref={ref}
      className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(5, 8, 22, 0.72)",
        borderBottom: "1px solid rgba(159, 176, 255, 0.08)",
        backdropFilter: "blur(20px)"
      }}
    >
      <Link
        href="/"
        className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold tracking-tight text-white/90 transition-opacity hover:opacity-75"
      >
        {siteConfig.site.name}
      </Link>
      <nav className="flex items-center gap-3">
        <MagneticButton href={siteConfig.site.ctaHref}>
          {siteConfig.site.ctaLabel}
        </MagneticButton>
      </nav>
    </header>
  );
}
