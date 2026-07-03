import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimizeAsset, type OptimizedAsset } from "./optimize";

export type AssetPrompt = {
  kind: "image" | "video" | "3d";
  outputName: string;
  model: string;
  estimateUsd: number;
  /** Passed verbatim as the PoYo `input` object — shape depends on `model`, see docs/poyo-api.md */
  input: Record<string, unknown>;
};

type PoyoEnvelope<T> = {
  code: number;
  data?: T;
  error?: { message: string; type: string };
};

type PoyoSubmitData = {
  task_id: string;
  status: string;
  created_time: string;
};

type PoyoStatusFile = {
  file_url: string;
  file_type: string;
  label?: string | null;
  format?: string | null;
  content_type?: string | null;
  file_name?: string | null;
  file_size?: number | null;
};

type PoyoStatusData = {
  task_id: string;
  status: string;
  credits_amount?: number;
  files: PoyoStatusFile[];
  created_time: string;
  progress: number;
  error_message?: string | null;
};

type AssetManifestEntry = {
  kind: AssetPrompt["kind"];
  outputName: string;
  prompt: string;
  model: string;
  estimateUsd: number;
  creditsCharged?: number;
  createdAt: string;
  source: string;
  outputs: string[];
};

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const assetsDir = path.join(repoRoot, "apps/site/public/assets");
const manifestPath = path.join(assetsDir, "asset-manifest.json");

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
    Authorization: `Bearer ${apiKey}`,
    ...extraHeaders
  };
}

async function submitTask(prompt: AssetPrompt) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/generate/submit`, {
    method: "POST",
    headers: poyoHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      model: prompt.model,
      input: prompt.input
    })
  });

  const payload = (await response.json()) as PoyoEnvelope<PoyoSubmitData>;

  if (!response.ok || payload.code !== 200 || !payload.data?.task_id) {
    const message = payload.error?.message ?? `${response.status} ${response.statusText}`;
    throw new Error(`Failed to submit PoYo task: ${message}`);
  }

  return payload.data.task_id;
}

async function pollTask(taskId: string) {
  const baseUrl = getBaseUrl();
  const pollInterval = Number(process.env.POYO_POLL_INTERVAL_MS ?? "3000");
  const timeoutMs = Number(process.env.POYO_TIMEOUT_MS ?? "600000");
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const response = await fetch(`${baseUrl}/api/generate/status/${taskId}`, {
      headers: poyoHeaders()
    });

    if (response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      continue;
    }

    const payload = (await response.json()) as PoyoEnvelope<PoyoStatusData>;

    if (!response.ok || payload.code !== 200 || !payload.data) {
      const message = payload.error?.message ?? `${response.status} ${response.statusText}`;
      throw new Error(`Failed to poll PoYo task ${taskId}: ${message}`);
    }

    const { status, progress } = payload.data;
    console.log(`  status=${status} progress=${progress ?? 0}%`);

    if (status === "finished") {
      return payload.data;
    }

    if (status === "failed") {
      throw new Error(`PoYo task ${taskId} failed: ${payload.data.error_message ?? "unknown error"}`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Timed out waiting for PoYo task ${taskId}.`);
}

function pickFile(files: PoyoStatusFile[], kind: AssetPrompt["kind"]) {
  if (kind === "3d") {
    return files.find((file) => file.label === "model_glb") ?? files.find((file) => file.file_type === "3d");
  }

  return files.find((file) => file.file_type === kind);
}

async function downloadToTmp(file: PoyoStatusFile, outputName: string) {
  const response = await fetch(file.file_url);

  if (!response.ok) {
    throw new Error(`Failed to download generated asset: ${response.status} ${response.statusText}`);
  }

  const tempDir = path.join(os.tmpdir(), "motionsites-poyo");
  await mkdir(tempDir, { recursive: true });

  const extension = file.format
    ? `.${file.format}`
    : path.extname(new URL(file.file_url).pathname) || ".bin";
  const filePath = path.join(tempDir, `${outputName}${extension}`);
  const arrayBuffer = await response.arrayBuffer();

  await writeFile(filePath, Buffer.from(arrayBuffer));
  return filePath;
}

async function registerManifest(
  prompt: AssetPrompt,
  source: string,
  outputs: OptimizedAsset[],
  completed: PoyoStatusData
) {
  const existing = JSON.parse(await readFile(manifestPath, "utf8")) as AssetManifestEntry[];
  const nextEntry: AssetManifestEntry = {
    kind: prompt.kind,
    outputName: prompt.outputName,
    prompt: typeof prompt.input.prompt === "string" ? prompt.input.prompt : "",
    model: prompt.model,
    estimateUsd: prompt.estimateUsd,
    creditsCharged: completed.credits_amount,
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

  const taskId = await submitTask(prompt);
  console.log(`Submitted task ${taskId} (model=${prompt.model})`);

  const completed = await pollTask(taskId);
  const file = pickFile(completed.files, prompt.kind);

  if (!file) {
    throw new Error(`PoYo task ${taskId} completed without a "${prompt.kind}" file in the response.`);
  }

  const tempFile = await downloadToTmp(file, prompt.outputName);
  const optimized = await optimizeAsset(prompt, tempFile, assetsDir);
  const sourceFile = await copySourceIntoAssets(tempFile, prompt);

  await registerManifest(prompt, sourceFile, optimized, completed);

  const size = await stat(sourceFile);
  console.log(
    JSON.stringify(
      {
        outputName: prompt.outputName,
        source: path.relative(repoRoot, sourceFile),
        bytes: size.size,
        creditsCharged: completed.credits_amount,
        outputs: optimized.map((item) => path.relative(repoRoot, item.path))
      },
      null,
      2
    )
  );
}
