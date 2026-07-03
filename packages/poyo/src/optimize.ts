import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";
import draco3d from "draco3dgltf";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, draco, prune } from "@gltf-transform/functions";
import type { AssetPrompt } from "./client";

export type OptimizedAsset = {
  path: string;
  kind: AssetPrompt["kind"];
  width?: number;
  height?: number;
};

async function run(command: string, args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });
  });
}

async function optimizeImage(inputPath: string, outputDir: string, outputName: string) {
  const sizes = [640, 1280, 1600];
  const outputs: OptimizedAsset[] = [];

  for (const width of sizes) {
    const avifPath = path.join(outputDir, `${outputName}-${width}.avif`);
    const webpPath = path.join(outputDir, `${outputName}-${width}.webp`);

    await sharp(inputPath).resize({ width, withoutEnlargement: true }).avif({ quality: 58 }).toFile(avifPath);
    await sharp(inputPath).resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile(webpPath);

    outputs.push({ kind: "image", path: avifPath, width });
    outputs.push({ kind: "image", path: webpPath, width });
  }

  return outputs;
}

async function optimizeVideo(inputPath: string, outputDir: string, outputName: string) {
  const mp4Path = path.join(outputDir, `${outputName}.mp4`);
  const webmPath = path.join(outputDir, `${outputName}.webm`);
  const posterPath = path.join(outputDir, `${outputName}-poster.jpg`);

  await run("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-vf",
    "scale=1920:-2",
    "-an",
    "-c:v",
    "libx265",
    "-crf",
    "28",
    mp4Path
  ]);

  await run("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-vf",
    "scale=1920:-2",
    "-an",
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    "0",
    "-crf",
    "35",
    webmPath
  ]);

  await run("ffmpeg", ["-y", "-i", inputPath, "-frames:v", "1", posterPath]);

  return [
    { kind: "video" as const, path: mp4Path },
    { kind: "video" as const, path: webmPath },
    { kind: "image" as const, path: posterPath }
  ];
}

async function optimizeModel(inputPath: string, outputDir: string, outputName: string) {
  const outputPath = path.join(outputDir, `${outputName}.glb`);
  const encoder = await draco3d.createEncoderModule();
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.encoder": encoder
    });

  const document = await io.read(inputPath);
  await document.transform(dedup(), prune(), draco());
  await io.write(outputPath, document);

  return [{ kind: "3d" as const, path: outputPath }];
}

export async function optimizeAsset(
  prompt: AssetPrompt,
  inputPath: string,
  outputDir: string
) {
  await mkdir(outputDir, { recursive: true });

  if (prompt.kind === "image") {
    return optimizeImage(inputPath, outputDir, prompt.outputName);
  }

  if (prompt.kind === "video") {
    return optimizeVideo(inputPath, outputDir, prompt.outputName);
  }

  if (path.extname(inputPath) !== ".glb") {
    const copied = path.join(outputDir, `${prompt.outputName}${path.extname(inputPath)}`);
    await cp(inputPath, copied);
    return [{ kind: "3d" as const, path: copied }];
  }
  return optimizeModel(inputPath, outputDir, prompt.outputName);
}
}
