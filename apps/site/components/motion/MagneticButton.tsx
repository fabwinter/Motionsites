"use client";

import Link from "next/link";
import { useRef } from "react";
import type { MouseEvent, PropsWithChildren } from "react";

type MagneticLinkProps = PropsWithChildren<{
  href: string;
  onClick?: never;
  type?: never;
  className?: string;
}>;

type MagneticButtonProps = PropsWithChildren<{
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}>;

type MagneticProps = MagneticLinkProps | MagneticButtonProps;

const BASE_CLASS =
  "inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium transition-transform duration-300";

export function MagneticButton({
  href,
  children,
  className = "",
  onClick,
  type = "button"
}: MagneticProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const handleMove = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
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

  const combinedClass = `${BASE_CLASS} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={combinedClass}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={combinedClass}
    >
      {children}
    </button>
  );
}
