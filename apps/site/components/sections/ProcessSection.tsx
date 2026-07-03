import siteConfig from "@site-config";
import { PinSection } from "@/components/motion/PinSection";
import { Reveal } from "@/components/motion/Reveal";

export function ProcessSection() {
  return (
    <section className="py-24">
      <div className="section">
        <Reveal as="div" className="eyebrow">
          Scroll sequence
        </Reveal>
        <Reveal as="h2" className="display-title mt-4 max-w-3xl text-5xl md:text-7xl">
          Keep the whole page quiet except for one orchestrated moment.
        </Reveal>
      </div>
      <PinSection className="section mt-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {siteConfig.process.map((item, index) => (
            <article key={item.step} className="panel-card rounded-[2rem] p-8">
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
      </PinSection>
    </section>
  );
}

