# PoYo API Notes

Drop the canonical PoYo.ai API reference here when available.

The current implementation assumes:

- `POYO_API_KEY` authenticates every request.
- `POYO_API_BASE_URL` points to the API root.
- Generation is a submit → poll → download workflow.
- Prompt files in `docs/asset-prompts` provide the request payload and cost estimate.

Update `packages/poyo/src/client.ts` if the live API shape differs.

