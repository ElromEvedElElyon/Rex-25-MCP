import { httpGet } from "../lib/http.js";

export const grokipediaTool = {
  name: "rex25_grokipedia_search",
  description: "Fetch a Grokipedia (xAI's open knowledge base) page by slug. Returns title + extracted text. Public pages only.",
  inputSchema: {
    type: "object",
    properties: { slug: { type: "string", description: "e.g. 'Bitcoin', 'Lightning_Network'" } },
    required: ["slug"],
  },
};

export async function grokipediaHandler(args: Record<string, unknown>): Promise<unknown> {
  const slug = String(args.slug ?? "").replace(/ /g, "_");
  if (!slug) return { error: "slug required" };
  const url = `https://grokipedia.com/page/${encodeURIComponent(slug)}`;
  const r = await httpGet(url, { "User-Agent": "rex25-mcp/0.1" });
  if (r.status !== 200) return { error: `HTTP ${r.status}`, url };
  const titleMatch = r.text.match(/<title>([^<]+)<\/title>/i);
  let body = r.text
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    url,
    title: titleMatch ? titleMatch[1] : "",
    text_preview: body.slice(0, 2000),
    full_size_bytes: r.text.length,
  };
}
