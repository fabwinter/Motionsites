import siteConfig from "@site-config";
import { Hero3D } from "@/components/canvas/Hero3D";
import { ShaderBackground } from "@/components/canvas/ShaderBackground";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Marquee } from "@/components/motion/Marquee";
import { Parallax } from "@/components/motion/Parallax";
import { PinSection } from "@/components/motion/PinSection";
import { Reveal } from "@/components/motion/Reveal";
import { VideoLoop } from "@/components/motion/VideoLoop";

export default function ComponentsDemoPage() {
  return (
    <main className="site-shell py-20">
      <section className="section relative overflow-hidden rounded-[2rem] border border-white/10 p-8">
        <ShaderBackground />
        <p className="eyebrow relative z-10">/dev/components</p>
        <Reveal as="h1" className="display-title relative z-10 mt-4 text-5xl md:text-7xl">
          Motion component demo route
        </Reveal>
      </section>

      <section className="section mt-14 grid gap-6 lg:grid-cols-2">
        <Hero3D poster={siteConfig.assets.heroPoster} />
        <div className="grid gap-6">
          <VideoLoop
            poster={siteConfig.assets.heroPoster}
            className="panel-card min-h-[220px] rounded-[2rem]"
          />
          <div className="panel-card rounded-[2rem] p-8">
            <Reveal as="h2" className="display-title text-4xl">
              Reveal, marquee, parallax, and magnetic controls.
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton href="/">Back home</MagneticButton>
              <MagneticButton href="#pin">Jump to pin</MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <section className="section mt-14">
        <Marquee items={siteConfig.marquee} />
      </section>

      <section className="section mt-14 grid gap-6 md:grid-cols-3">
        {siteConfig.services.map((service) => (
          <Parallax key={service.title} className="panel-card rounded-[2rem] p-7">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl">
              {service.title}
            </h2>
            <p className="copy-muted mt-3 text-base leading-7">{service.description}</p>
          </Parallax>
        ))}
      </section>

      <section id="pin" className="mt-16">
        <PinSection className="section">
          <div className="grid gap-6 lg:grid-cols-3">
            {siteConfig.process.map((item) => (
              <div key={item.step} className="panel-card rounded-[2rem] p-8">
                <div className="eyebrow">{item.step}</div>
                <p className="copy-muted mt-4 text-base leading-7">{item.detail}</p>
              </div>
            ))}
          </div>
        </PinSection>
      </section>
    </main>
  );
}

