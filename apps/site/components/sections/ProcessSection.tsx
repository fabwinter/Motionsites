"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import siteConfig from "@site-config";
import { Reveal } from "@/components/motion/Reveal";
import { ensureGsap } from "@/lib/gsap";

export function ProcessSection() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !pinRef.current) {
      return;
    }

    const CARD_SCROLL_DISTANCE = 320;
    const STAGGER_OFFSET = 0.38; // seconds between each card reveal in the scrubbed timeline
    const { gsap, ScrollTrigger } = ensureGsap();
    const cards = cardsRef.current.filter((c): c is HTMLElement => c !== null);

    gsap.set(cards, { opacity: 0, x: 56 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        start: "top top",
        end: `+=${cards.length * CARD_SCROLL_DISTANCE}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    cards.forEach((card, i) => {
      tl.to(card, { opacity: 1, x: 0, ease: "power2.out", duration: 0.4 }, i * STAGGER_OFFSET);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.refresh();
    };
  }, [reduceMotion]);

  return (
    <section>
      <div
        ref={pinRef}
        className="relative flex min-h-screen flex-col justify-center"
      >
        <div className="section py-24">
          <Reveal as="div" className="eyebrow">
            {siteConfig.sections.process.eyebrow}
          </Reveal>
          <Reveal as="h2" className="display-title mt-4 max-w-3xl text-5xl md:text-7xl">
            {siteConfig.sections.process.heading}
          </Reveal>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {siteConfig.process.map((item, index) => (
              <article
                key={item.step}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="panel-card rounded-[2rem] p-8"
              >
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                  0{index + 1}
                </div>
                <h3 className="mt-8 font-[family-name:var(--font-space-grotesk)] text-3xl">
                  {item.step}
                </h3>
                <p className="copy-muted mt-4 text-base leading-7">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

