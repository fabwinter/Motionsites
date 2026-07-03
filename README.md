# Motionsites

Reusable premium motion-site system built with Next.js 15, React Three Fiber, GSAP, Lenis, and a manifest-driven PoYo.ai asset pipeline.

## Workspace commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm generate:video docs/asset-prompts/hero-video.json`

## Structure

- `apps/site` — flagship marketing site and component demos
- `packages/poyo` — PoYo.ai generation and optimization pipeline
- `docs` — design brief, prompt files, and API notes
- `site.config.ts` — per-client tokens, copy, and asset references
