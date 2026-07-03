import siteConfig from "@site-config";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";

export function ServicesSection() {
  return (
    <section className="section py-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal as="div" className="eyebrow">
            Motion library
          </Reveal>
          <Reveal as="h2" className="display-title mt-4 text-5xl md:text-6xl">
            Core pieces built once and reused everywhere.
          </Reveal>
        </div>
        <div className="max-w-md text-base leading-7 text-white/65">
          Each component accepts design tokens and gracefully falls back when motion or GPU budgets are tight.
        </div>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {siteConfig.services.map((service) => (
          <article key={service.title} className="panel-card rounded-[2rem] p-7">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl">
              {service.title}
            </h3>
            <p className="copy-muted mt-4 text-base leading-7">{service.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-12">
        <Marquee items={siteConfig.marquee} />
      </div>
    </section>
  );
}

