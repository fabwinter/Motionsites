import { runGeneration } from "./client";

const promptPath =
  process.argv[2] ?? process.env.POYO_PROMPT ?? "docs/asset-prompts/hero-still.json";

void runGeneration(promptPath, "image");

