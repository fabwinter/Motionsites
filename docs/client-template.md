# Client Reskin Guide

How to go from zero to a live flagship site in one day using this system.

---

## What changes per client

Everything client-specific lives in exactly two places:

| What | Where |
|---|---|
| Name, headline, copy, CTAs | `site.config.ts` → `site.*` and `sections.*` |
| Colors, fonts, spacing | `site.config.ts` → `tokens.*` |
| Service and process cards | `site.config.ts` → `services[]`, `process[]` |
| Marquee items | `site.config.ts` → `marquee[]` |
| Showcase cards | `site.config.ts` → `showcase[]` |
| Hero loop, poster, OG image | `site.config.ts` → `assets.*` + files in `apps/site/public/assets/` |
| Asset prompts | `docs/asset-prompts/*.json` |

Components, motion primitives, and the build pipeline are **not touched**.

---

## Step-by-step

### 1. Fork / duplicate the workspace
Copy the monorepo and rename `apps/site` is not required — just update `site.config.ts`.

### 2. Update `site.config.ts`

Fill in every field. Key areas:

```ts
site: {
  name: "Acme Studio",            // brand wordmark + meta title
  title: "Immersive brand films",
  description: "...",
  headline: "Your one-liner here.",
  subheadline: "Supporting sentence.",
  ctaLabel: "Start a project",
  ctaHref: "#contact"
},
sections: {
  hero:     { eyebrow: "...", badge: "..." },
  services: { eyebrow: "...", heading: "...", body: "..." },
  work:     { eyebrow: "...", heading: "..." },
  process:  { eyebrow: "...", heading: "..." },
  cta:      { eyebrow: "...", heading: "...", body: "...", buttonLabel: "..." },
  footer:   { tagline: "..." }
},
tokens: {
  colors: {
    night: "#0a0a0a",   // swap the 6 palette tokens
    cyan:  "#c8f0e8",
    ...
  }
}
```

### 3. Update CSS custom properties

`apps/site/app/globals.css` maps `tokens.colors` to CSS variables. Update the `:root` block to match the new palette. The variable names (`--background`, `--cyan`, `--coral`, …) are used throughout — no class names change.

### 4. Update asset prompts

Edit the JSON files in `docs/asset-prompts/` to match the new brand aesthetic.
Run generation once credentials are in `.env`:

```bash
pnpm generate:video docs/asset-prompts/hero-video.json
pnpm generate:image docs/asset-prompts/hero-still.json
```

Place the optimized outputs in `apps/site/public/assets/` and update the `assets.*` paths in `site.config.ts`.

### 5. Update the OG image SVG

Replace `apps/site/public/assets/og-image.svg` with a 1200×630 version reflecting the new brand. Keep the same path — `site.config.ts` references it.

### 6. Run QA

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Then test on:
- Desktop Chrome / Firefox (scroll choreography)
- iPhone Safari (reduced-motion, touch fallback)
- iPad Safari (WebGL poster fallback if needed)

---

## What never changes

- All components in `components/canvas`, `components/motion`, `components/sections`
- The Lenis + GSAP + ScrollTrigger wiring
- The PoYo pipeline in `packages/poyo`
- The `MotionSiteConfig` TypeScript type (extend it, don't break it)

---

## Adding a new section

1. Create `components/sections/MySection.tsx` using `Reveal`, `panel-card`, and `.section` layout classes.
2. Add any new copy keys to `MotionSiteConfig.sections` in `site.config.ts`.
3. Import the section in `app/page.tsx`.

Keep motion to a single animated moment per section — `Reveal` on headings is usually enough.
