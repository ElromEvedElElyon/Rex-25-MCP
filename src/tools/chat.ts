import { httpJson } from "../lib/http.js";

export const chatTool = {
  name: "rex25_chat",
  description: "LLM query routed to the first available frontier vendor (OpenAI, Anthropic, Gemini, Cerebras, Groq, OpenRouter). Set ANY of: OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, CEREBRAS_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY in env. Returns the first non-error response.",
  inputSchema: {
    type: "object",
    properties: {
      prompt: { type: "string", description: "User prompt" },
      max_tokens: { type: "number", default: 256 },
    },
    required: ["prompt"],
  },
};

export async function chatHandler(args: Record<string, unknown>): Promise<unknown> {
  const prompt = String(args.prompt ?? "");
  const max_tokens = Number(args.max_tokens ?? 256);
  if (!prompt) return { error: "prompt required" };

  // Try Cerebras first (fastest free tier per Elrom's stack)
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  if (cerebrasKey) {
    const r = await httpJson(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        Authorization: `Bearer ${cerebrasKey}`,
        "Content-Type": "application/json",
        "User-Agent": "curl/8.4.0",
      },
      {
        model: "llama3.1-8b",
        messages: [{ role: "user", content: prompt }],
        max_tokens,
      }
    );
    const text = (r as any)?.choices?.[0]?.message?.content;
    if (text) return { vendor: "cerebras", text };
  }

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    const r = await httpJson(
      "https://openrouter.ai/api/v1/chat/completions",
      { Authorization: `Bearer ${openrouterKey}`, "Content-Type": "application/json" },
      {
        model: "anthropic/claude-sonnet-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens,
      }
    );
    const text = (r as any)?.choices?.[0]?.message?.content;
    if (text) return { vendor: "openrouter", text };
  }

  const geminiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    const r = await httpJson(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      { "Content-Type": "application/json" },
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: max_tokens },
      }
    );
    const text = (r as any)?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return { vendor: "gemini", text };
  }

  return {
    error: "No LLM vendor key found in env",
    hint: "Set CEREBRAS_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY",
  };
}
