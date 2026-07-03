type MarqueeProps = {
  items: string[];
};

export function Marquee({ items }: MarqueeProps) {
  const repeated = [...items, ...items];

  return (
    <div className="marquee-mask overflow-hidden rounded-full border border-white/10 bg-white/5 py-3">
      <div className="flex min-w-max animate-[marquee_20s_linear_infinite] gap-6 px-6">
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

