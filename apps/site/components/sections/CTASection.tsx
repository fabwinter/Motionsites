import siteConfig from "@site-config";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";

export function CTASection() {
  return (
    <section id="cta" className="section py-24">
      <div className="panel-card rounded-[2.5rem] px-8 py-12 md:px-14 md:py-16">
        <Reveal as="div" className="eyebrow">
          {siteConfig.sections.cta.eyebrow}
        </Reveal>
        <Reveal as="h2" className="display-title mt-4 max-w-4xl text-5xl md:text-7xl">
          {siteConfig.sections.cta.heading}
        </Reveal>
        <p className="copy-muted mt-6 max-w-2xl text-base leading-8">
          {siteConfig.sections.cta.body}
        </p>
        <div className="mt-10">
          <MagneticButton href={siteConfig.site.ctaHref}>{siteConfig.sections.cta.buttonLabel}</MagneticButton>
        </div>
      </div>
    </section>
  );
}

