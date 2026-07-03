export type MotionSiteConfig = {
  site: {
    name: string;
    title: string;
    description: string;
    headline: string;
    subheadline: string;
    ctaLabel: string;
    ctaHref: string;
  };
  tokens: {
    colors: Record<string, string>;
    fonts: {
      display: string;
      body: string;
      utility: string;
    };
    spacing: string[];
  };
  signature: string;
  antiDefaults: string[];
  services: { title: string; description: string }[];
  process: { step: string; detail: string }[];
  marquee: string[];
  showcase: {
    eyebrow: string;
    title: string;
    blurb: string;
    metrics: { label: string; value: string }[];
  }[];
  assets: {
    heroPoster: string;
    heroLoop: string;
    ogImage: string;
    manifest: string;
  };
  /**
   * Per-section copy — swap these when reskinning for a new client.
   * Every string that appears on the page but is not shared data
   * (services[], process[], showcase[]) lives here.
   */
  sections: {
    hero: {
      eyebrow: string;
      badge: string;
    };
    services: {
      eyebrow: string;
      heading: string;
      body: string;
    };
    work: {
      eyebrow: string;
      heading: string;
    };
    process: {
      eyebrow: string;
      heading: string;
    };
    cta: {
      eyebrow: string;
      heading: string;
      body: string;
      buttonLabel: string;
    };
    footer: {
      tagline: string;
    };
  };
};

export const siteConfig: MotionSiteConfig = {
  site: {
    name: "Motionsites",
    title: "Premium 3D Animated Websites",
    description:
      "Config-driven premium motion websites with reusable R3F, GSAP, Lenis, and PoYo.ai asset workflows.",
    headline: "High-end motion websites built as a reusable system.",
    subheadline:
      "One cinematic hero, one orchestrated scroll sequence, and a reusable pipeline that swaps tokens and assets instead of rebuilding pages.",
    ctaLabel: "Launch a flagship site",
    ctaHref: "#cta"
  },
  tokens: {
    colors: {
      night: "#050816",
      mist: "#9fb0ff",
      ice: "#d7e1ff",
      cyan: "#7ee7ff",
      coral: "#ff8a7a",
      panel: "#0f1530"
    },
    fonts: {
      display: "var(--font-space-grotesk)",
      body: "var(--font-inter)",
      utility: "var(--font-jetbrains-mono)"
    },
    spacing: ["0.5rem", "0.75rem", "1rem", "1.5rem", "2rem", "3rem", "5rem"]
  },
  signature: "A glassy procedural hero object that drifts through an aurora gradient while scroll reveals the production system underneath.",
  antiDefaults: [
    "No generic particle sphere hero.",
    "No beige-serif luxury defaults.",
    "No motion stacked on every section."
  ],
  services: [
    {
      title: "Flagship storytelling",
      description: "Scroll-driven launches with a single cinematic story spine."
    },
    {
      title: "Config-first production",
      description: "Tokens, copy, and prompts live outside components so each client site is a reskin, not a rebuild."
    },
    {
      title: "Asset generation pipeline",
      description: "PoYo.ai prompts, seeds, manifests, and optimized outputs stay reproducible."
    }
  ],
  process: [
    {
      step: "Design brief",
      detail: "Ground the site in the client's materials, language, and one memorable signature moment."
    },
    {
      step: "Asset batch",
      detail: "Generate hero loops, stills, textures, and optional 3D concepts with hard budget guards."
    },
    {
      step: "Motion assembly",
      detail: "Compose sections from the shared component library and keep the choreography restrained."
    }
  ],
  marquee: ["Next.js 15", "R3F", "GSAP", "Lenis", "Framer Motion", "PoYo.ai"],
  showcase: [
    {
      eyebrow: "System",
      title: "One reusable stack, many flagship sites.",
      blurb: "Shared motion primitives and design tokens keep the premium feel while reducing delivery time for every new client.",
      metrics: [
        { label: "Delivery model", value: "Config + asset swap" },
        { label: "Fallback policy", value: "Poster-first, reduced motion safe" }
      ]
    },
    {
      eyebrow: "Pipeline",
      title: "Manifest-tracked generation",
      blurb: "Every asset stores its prompt, seed, model, and optimized outputs so creative iterations stay reproducible.",
      metrics: [
        { label: "Hero loop", value: "Video + poster + fallback" },
        { label: "3D default", value: "Procedural first" }
      ]
    }
  ],
  assets: {
    heroPoster: "/assets/hero-poster.svg",
    heroLoop: "/assets/hero-loop.mp4",
    ogImage: "/assets/og-image.svg",
    manifest: "/assets/asset-manifest.json"
  },
  sections: {
    hero: {
      eyebrow: "Premium 3D animated websites",
      badge: "Signature: one hero, one sequence, zero filler"
    },
    services: {
      eyebrow: "Motion library",
      heading: "Core pieces built once and reused everywhere.",
      body: "Each component accepts design tokens and gracefully falls back when motion or GPU budgets are tight."
    },
    work: {
      eyebrow: "Reusable product",
      heading: "Build the system once. Re-skin it per client."
    },
    process: {
      eyebrow: "Scroll sequence",
      heading: "Keep the whole page quiet except for one orchestrated moment."
    },
    cta: {
      eyebrow: "Client-ready template",
      heading: "A premium website becomes a config, prompt batch, and polish pass.",
      body: "Start with a brief, lock the signature moment, generate the assets, and deliver a motion-rich site without reinventing the production stack.",
      buttonLabel: "Request the stack"
    },
    footer: {
      tagline: "Built for Vercel · Reduced-motion safe · iPad-aware"
    }
  }
};

export default siteConfig;
