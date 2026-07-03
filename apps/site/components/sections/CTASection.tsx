import siteConfig from "@site-config";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";

export function CTASection() {
  return (
    <section id="cta" className="section py-24">
      <div className="panel-card rounded-[2.5rem] px-8 py-12 md:px-14 md:py-16">
        <Reveal as="div" className="eyebrow">
          Client-ready template
        </Reveal>
        <Reveal as="h2" className="display-title mt-4 max-w-4xl text-5xl md:text-7xl">
          A premium website becomes a config, prompt batch, and polish pass.
        </Reveal>
        <p className="copy-muted mt-6 max-w-2xl text-base leading-8">
          Start with a brief, lock the signature moment, generate the assets, and deliver a motion-rich site without reinventing the production stack.
        </p>
        <div className="mt-10">
          <MagneticButton href={siteConfig.site.ctaHref}>Request the stack</MagneticButton>
        </div>
      </div>
    </section>
  );
}

