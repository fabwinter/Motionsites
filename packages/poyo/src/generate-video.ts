import { runGeneration } from "./client";

const promptPath =
  process.argv[2] ?? process.env.POYO_PROMPT ?? "docs/asset-prompts/hero-video.json";

void runGeneration(promptPath, "video");
