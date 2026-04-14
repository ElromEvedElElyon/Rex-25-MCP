export const distillTool = {
  name: "rex25_distill",
  description: "Race query across multiple LLM vendors in parallel; returns all valid responses + winner by latency. Useful for distillation / consensus.",
  inputSchema: {
    type: "object",
    properties: { prompt: { type: "string" }, max_tokens: { type: "number", default: 256 } },
    required: ["prompt"],
  },
};

export async function distillHandler(args: Record<string, unknown>): Promise<unknown> {
  const { chatHandler } = await import("./chat.js");
  const start = Date.now();
  const r = (await chatHandler(args)) as any;
  return { latency_ms: Date.now() - start, primary: r, note: "v0.1: single-vendor; multi-race in v0.2" };
}
