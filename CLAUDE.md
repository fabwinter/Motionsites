# Motion Sites Operating Guide

## Stack rules

- Build all pages in `apps/site` with Next.js 15 App Router.
- Keep motion components prop-driven and reusable across clients.
- Dynamically import all WebGL/R3F scenes with `ssr: false`.
- Treat `site.config.ts` and `docs/design-brief.md` as the creative source of truth.
- Respect `prefers-reduced-motion` globally and provide poster/static fallbacks for heavy scenes.

## Performance guardrails

- Keep mobile textures at or below 1024px.
- Prefer procedural heroes over generated GLBs when the visual goal can be met in code.
- Lazy-load videos and pause them when off-screen.
- Pair Lenis with ScrollTrigger through a single provider.

## File conventions

- `components/canvas` for R3F or shader surfaces.
- `components/motion` for reusable interaction wrappers.
- `components/sections` for page composition.
- `packages/poyo` owns generation, polling, optimization, and manifest updates.

