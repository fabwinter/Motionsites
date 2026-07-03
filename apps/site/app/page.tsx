import { CursorFollower } from "@/components/motion/CursorFollower";
import { CTASection } from "@/components/sections/CTASection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";

export default function Home() {
  return (
    <main className="site-shell">
      <CursorFollower />
      <HeroSection />
      <WorkSection />
      <ServicesSection />
      <ProcessSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
