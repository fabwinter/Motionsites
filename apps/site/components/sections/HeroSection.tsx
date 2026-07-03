import siteConfig from "@site-config";
import { Hero3D } from "@/components/canvas/Hero3D";
import { ShaderBackground } from "@/components/canvas/ShaderBackground";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";

export function HeroSection() {
  return (
    <section className="site-shell noise isolate pt-[72px]">
      <ShaderBackground className="grid-overlay opacity-70" />
      <div className="section grid min-h-screen items-center gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <p className="eyebrow">{siteConfig.sections.hero.eyebrow}</p>
          <Reveal
            as="h1"
            className="display-title mt-6 max-w-3xl text-[clamp(3.5rem,9vw,7.5rem)]"
          >
            {siteConfig.site.headline}
          </Reveal>
          <Reveal
            as="p"
            mode="words"
            className="copy-muted mt-6 max-w-xl text-lg leading-8"
          >
            {siteConfig.site.subheadline}
          </Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href={siteConfig.site.ctaHref}>
              {siteConfig.site.ctaLabel}
            </MagneticButton>
            <div className="rounded-full border border-white/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.24em] text-white/55">
              {siteConfig.sections.hero.badge}
            </div>
          </div>
        </div>
        <Hero3D poster={siteConfig.assets.heroPoster} />
      </div>
    </section>
  );
}

