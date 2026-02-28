import { drawNeonFlow, type DrawContext } from "./neonFlow";

export const effectDrawers: Record<string, (ctx: DrawContext) => void> = {
  "neon-flow": drawNeonFlow,
};
