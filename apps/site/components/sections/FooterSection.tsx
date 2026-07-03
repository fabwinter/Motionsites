import siteConfig from "@site-config";

export function FooterSection() {
  return (
    <footer className="section flex flex-col gap-6 border-t border-white/8 py-10 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="font-[family-name:var(--font-space-grotesk)] text-lg text-white/90">
          {siteConfig.site.name}
        </div>
        <div className="mt-1 max-w-md">{siteConfig.site.description}</div>
      </div>
      <div className="font-mono uppercase tracking-[0.24em]">
        Built for Vercel · Reduced-motion safe · iPad-aware
      </div>
    </footer>
  );
}

