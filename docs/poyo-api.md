# PoYo.ai API Reference (operational summary)

Source: real PoYo.ai API docs supplied by the client (image/video/3D/music model
references + task-management reference). This file is the condensed contract
`packages/poyo/src/client.ts` is built against — see the client for the actual
implementation.

## Auth

Every request needs a bearer token:

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

Base URL: `https://api.poyo.ai` (set via `POYO_API_BASE_URL`).
Get a key at `https://poyo.ai/dashboard/api-key`.

## Submit a task

`POST /api/generate/submit`

```json
{
  "model": "nano-banana-pro",
  "input": {
    "prompt": "...",
    "size": "16:9",
    "resolution": "2K"
  }
}
```

`input` is model-specific — see the model tables below. `callback_url` is
optional (webhook on completion); this pipeline polls instead since it has no
public endpoint to receive callbacks.

Response:

```json
{ "code": 200, "data": { "task_id": "task-unified-...", "status": "not_started", "created_time": "..." } }
```

## Poll status

`GET /api/generate/status/{task_id}`

```json
{
  "code": 200,
  "data": {
    "task_id": "...",
    "status": "finished",
    "credits_amount": 2,
    "files": [{ "file_url": "...", "file_type": "image", "format": "png" }],
    "created_time": "...",
    "progress": 100,
    "error_message": null
  }
}
```

Status values: `not_started` → `running` (progress 0–99) → `finished` (100,
`files` populated) or `failed` (`error_message` set). Credits are only
deducted on `finished`. 3D tasks use the same endpoint; the `files` array
carries `label: "model_glb"` for the primary downloadable mesh, plus
`thumbnail` / `pbr_model` / alternate-format entries.

## Rate limits & retention

- 20 new submissions per 10 seconds, 100+ concurrent tasks, per-account. `429`
  on excess — the client backs off and retries on poll.
- Generated files: **downloadable for 24 hours** (3D docs) / **retained 3
  days** (video docs) before deletion. Download immediately after `finished`.
- HTTP codes: 200 ok, 400 bad params, 401 bad key, 402 insufficient balance,
  429 rate limited, 500 server error.

## Models used by this pipeline

| Script | Model | Notes |
|---|---|---|
| `generate-image.ts` | `nano-banana-pro` (default) | `input: {prompt, size, resolution, output_format?, enable_web_search?}` |
| `generate-video.ts` | `seedance-1.0-pro` (default) | `input: {prompt, resolution, duration, image_urls?}` |
| `generate-3d.ts` | `tripo3d-p1-text-to-3d` (default) | `input: {prompt, texture, face_limit, model_seed?}` |

Swap `model` per prompt file to use any other model documented in the
client's source docs (Kling, Hailuo, Sora 2, VEO 3.1, Flux 2, Seedream,
Meshy 6, Tripo3D H3.1, etc.) — the request/response envelope is identical
across all of them.

## Cost estimates

`estimateUsd` in each `docs/asset-prompts/*.json` file is a rough planning
number for the local budget guard (`POYO_MAX_BUDGET_USD`) — PoYo bills in
credits, and the USD/credit rate depends on your plan (see
`https://poyo.ai/pricing`). Actual cost charged is logged from
`credits_amount` in the manifest (`packages/poyo/src/client.ts` →
`registerManifest`) after each run.
