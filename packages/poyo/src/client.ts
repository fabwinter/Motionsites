import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimizeAsset, type OptimizedAsset } from "./optimize";

export type AssetPrompt = {
  kind: "image" | "video" | "3d";
  outputName: string;
  model: string;
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  estimateUsd: number;
  endpoint?: string;
  params?: Record<string, unknown>;
};

type PoyoTaskResponse = {
  id: string;
  status?: string;
  result?: {
    url?: string;
    urls?: string[];
    files?: { url: string }[];
  };
};

type AssetManifestEntry = {
  kind: AssetPrompt["kind"];
  outputName: string;
  prompt: string;
  model: string;
  seed?: number;
  estimateUsd: number;
  createdAt: string;
  source: string;
  outputs: string[];
};

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const assetsDir = path.join(repoRoot, "apps/site/public/assets");
const manifestPath = path.join(assetsDir, "asset-manifest.json");
const authHeaderName = "Authorization";

function resolvePromptPath(promptPath: string) {
  return path.isAbsolute(promptPath) ? promptPath : path.join(repoRoot, promptPath);
}

function getBaseUrl() {
  const baseUrl = process.env.POYO_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("POYO_API_BASE_URL is required.");
  }

  if (!process.env.POYO_API_KEY) {
    throw new Error("POYO_API_KEY is required.");
  }

  return baseUrl.replace(/\/$/, "");
}

export async function loadPrompt(promptPath: string) {
  const filePath = resolvePromptPath(promptPath);
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents) as AssetPrompt;
}

export function assertBudget(prompt: AssetPrompt) {
  const cap = process.env.POYO_MAX_BUDGET_USD;

  if (cap && prompt.estimateUsd > Number(cap)) {
    throw new Error(
      `Estimated cost $${prompt.estimateUsd.toFixed(2)} exceeds POYO_MAX_BUDGET_USD=$${cap}.`
    );
  }
}

function poyoHeaders(extraHeaders?: Record<string, string>) {
  const apiKey = process.env.POYO_API_KEY ?? "";

  return {
    [authHeaderName]: ["Bearer", apiKey].join(" "),
    ...extraHeaders
  };
}

async function submitTask(prompt: AssetPrompt) {
  const baseUrl = getBaseUrl();
  const endpoint = prompt.endpoint ?? `/v1/generate/${prompt.kind}`;
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: poyoHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      model: prompt.model,
      prompt: prompt.prompt,
      negativePrompt: prompt.negativePrompt,
      seed: prompt.seed,
      ...prompt.params
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to submit PoYo task: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as PoyoTaskResponse;
}

async function pollTask(taskId: string) {
  const baseUrl = getBaseUrl();
  const pollInterval = Number(process.env.POYO_POLL_INTERVAL_MS ?? "2500");
  const timeoutMs = Number(process.env.POYO_TIMEOUT_MS ?? "180000");
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const response = await fetch(`${baseUrl}/v1/tasks/${taskId}`, {
      headers: poyoHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to poll PoYo task ${taskId}: ${response.status}`);
    }

    const payload = (await response.json()) as PoyoTaskResponse;
    const status = payload.status?.toLowerCase();

    if (status === "completed" || status === "succeeded" || status === "success") {
      return payload;
    }

    if (status === "failed" || status === "error" || status === "canceled") {
      throw new Error(`PoYo task ${taskId} ended with status "${payload.status}".`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Timed out waiting for PoYo task ${taskId}.`);
}

function extractDownloadUrl(payload: PoyoTaskResponse) {
  return (
    payload.result?.url ??
    payload.result?.urls?.[0] ??
    payload.result?.files?.[0]?.url
  );
}

async function downloadToTmp(url: string, outputName: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download generated asset: ${response.status} ${response.statusText}`);
  }

  const tempDir = await mkdir(path.join(os.tmpdir(), "motionsites-poyo"), { recursive: true }).then(
    () => path.join(os.tmpdir(), "motionsites-poyo")
  );

  const urlPath = new URL(url).pathname;
  const extension = path.extname(urlPath) || ".bin";
  const filePath = path.join(tempDir, `${outputName}${extension}`);
  const arrayBuffer = await response.arrayBuffer();

  await writeFile(filePath, Buffer.from(arrayBuffer));
  return filePath;
}

async function registerManifest(prompt: AssetPrompt, source: string, outputs: OptimizedAsset[]) {
  const existing = JSON.parse(await readFile(manifestPath, "utf8")) as AssetManifestEntry[];
  const nextEntry: AssetManifestEntry = {
    kind: prompt.kind,
    outputName: prompt.outputName,
    prompt: prompt.prompt,
    model: prompt.model,
    seed: prompt.seed,
    estimateUsd: prompt.estimateUsd,
    createdAt: new Date().toISOString(),
    source: path.relative(repoRoot, source),
    outputs: outputs.map((item) => path.relative(path.join(repoRoot, "apps/site/public"), item.path))
  };

  const filtered = existing.filter((entry) => entry.outputName !== prompt.outputName);
  filtered.push(nextEntry);
  await writeFile(manifestPath, `${JSON.stringify(filtered, null, 2)}\n`);
}

async function copySourceIntoAssets(sourcePath: string, prompt: AssetPrompt) {
  const extension = path.extname(sourcePath);
  const targetPath = path.join(assetsDir, `${prompt.outputName}-source${extension}`);
  await copyFile(sourcePath, targetPath);
  await rm(sourcePath);
  return targetPath;
}

export async function runGeneration(promptPath: string, expectedKind: AssetPrompt["kind"]) {
  const prompt = await loadPrompt(promptPath);

  if (prompt.kind !== expectedKind) {
    throw new Error(`Prompt kind "${prompt.kind}" does not match script kind "${expectedKind}".`);
  }

  assertBudget(prompt);
  await mkdir(assetsDir, { recursive: true });

  console.log(`Estimated cost: $${prompt.estimateUsd.toFixed(2)}`);

  const submitted = await submitTask(prompt);
  const completed = await pollTask(submitted.id);
  const downloadUrl = extractDownloadUrl(completed);

  if (!downloadUrl) {
    throw new Error("PoYo task completed without a downloadable asset URL.");
  }

  const tempFile = await downloadToTmp(downloadUrl, prompt.outputName);
  const optimized = await optimizeAsset(prompt, tempFile, assetsDir);
  const sourceFile = await copySourceIntoAssets(tempFile, prompt);

  await registerManifest(prompt, sourceFile, optimized);

  const size = await stat(sourceFile);
  console.log(
    JSON.stringify(
      {
        outputName: prompt.outputName,
        source: path.relative(repoRoot, sourceFile),
        bytes: size.size,
        outputs: optimized.map((item) => path.relative(repoRoot, item.path))
      },
      null,
      2
    )
  );
}
