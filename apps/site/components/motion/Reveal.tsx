"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import SplitType from "split-type";
import { ensureGsap } from "@/lib/gsap";

type RevealMode = "lines" | "words" | "chars";

type RevealProps = {
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
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
  const elementRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const setElementRef = (node: HTMLElement | null) => {
    elementRef.current = node;
  };

  useEffect(() => {
    if (!elementRef.current || reduceMotion) {
      return;
    }

    const element = elementRef.current;
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

  switch (as) {
    case "h1":
      return <h1 className={className} ref={setElementRef}>{children}</h1>;
    case "h2":
      return <h2 className={className} ref={setElementRef}>{children}</h2>;
    case "h3":
      return <h3 className={className} ref={setElementRef}>{children}</h3>;
    case "p":
      return <p className={className} ref={setElementRef}>{children}</p>;
    case "span":
      return <span className={className} ref={setElementRef}>{children}</span>;
    case "div":
    default:
      return <div className={className} ref={setElementRef}>{children}</div>;
  }
}
