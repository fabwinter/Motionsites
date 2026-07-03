import { runGeneration } from "./client";

const promptPath =
  process.argv[2] ?? process.env.POYO_PROMPT ?? "docs/asset-prompts/hero-3d.json";

void runGeneration(promptPath, "3d");
