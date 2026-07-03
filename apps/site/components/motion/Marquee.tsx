"use client";

import { useState } from "react";

type MarqueeProps = {
  items: string[];
  /** Duration of one full scroll cycle in seconds. Default: 20. */
  duration?: number;
};

export function Marquee({ items, duration = 20 }: MarqueeProps) {
  const repeated = [...items, ...items];
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="marquee-mask overflow-hidden rounded-full border border-white/10 bg-white/5 py-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex min-w-max gap-6 px-6"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running"
        }}
      >
        {repeated.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="font-mono text-xs uppercase tracking-[0.3em] text-white/65"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

