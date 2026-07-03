import siteConfig from "@site-config";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";

export function WorkSection() {
  return (
    <section className="section py-24">
      <Reveal as="div" className="eyebrow">
        Reusable product
      </Reveal>
      <Reveal as="h2" className="display-title mt-4 max-w-3xl text-5xl md:text-7xl">
        Build the system once. Re-skin it per client.
      </Reveal>
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {siteConfig.showcase.map((item) => (
          <Parallax
            key={item.title}
            className="panel-card rounded-[2rem] p-8 transition-transform hover:-translate-y-1"
          >
            <p className="eyebrow">{item.eyebrow}</p>
            <h3 className="mt-5 font-[family-name:var(--font-space-grotesk)] text-3xl leading-tight">
              {item.title}
            </h3>
            <p className="copy-muted mt-4 max-w-lg text-base leading-7">{item.blurb}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {item.metrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.5rem] border border-white/8 bg-black/10 p-4">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-lg text-white/90">{metric.value}</p>
                </div>
              ))}
            </div>
          </Parallax>
        ))}
      </div>
    </section>
  );
}

