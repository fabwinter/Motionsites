"use client";

import Link from "next/link";
import { useRef } from "react";
import type { MouseEvent, PropsWithChildren } from "react";

type MagneticButtonProps = PropsWithChildren<{
  href: string;
  className?: string;
}>;

export function MagneticButton({
  href,
  children,
  className = ""
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;

    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform = "translate3d(0, 0, 0)";
    }
  };

  return (
    <Link
      href={href}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium transition-transform duration-300 ${className}`}
    >
      {children}
    </Link>
  );
}
