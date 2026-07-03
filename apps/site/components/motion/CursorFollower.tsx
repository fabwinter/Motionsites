"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function CursorFollower() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !ref.current || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const element = ref.current;

    const move = (event: MouseEvent) => {
      element.animate(
        {
          transform: `translate3d(${event.clientX - 12}px, ${event.clientY - 12}px, 0)`
        },
        {
          duration: 180,
          fill: "forwards"
        }
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduceMotion]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden size-6 rounded-full border border-cyan-300/30 bg-cyan-200/10 backdrop-blur md:block"
    />
  );
}

