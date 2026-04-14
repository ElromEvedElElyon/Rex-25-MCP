import { httpGetJson } from "../lib/http.js";

export const wikipediaTool = {
  name: "rex25_wikipedia_search",
  description: "Search Wikipedia REST API and return top extract.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      lang: { type: "string", default: "en", description: "wiki language code" },
    },
    required: ["query"],
  },
};

export async function wikipediaHandler(args: Record<string, unknown>): Promise<unknown> {
  const query = String(args.query ?? "");
  const lang = String(args.lang ?? "en");
  if (!query) return { error: "query required" };
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, "_"))}`;
  const r = (await httpGetJson(url, { "User-Agent": "rex25-mcp/0.1" })) as any;
  if (r._http_error) return { error: `HTTP ${r._http_error}`, url };
  return {
    title: r.title,
    extract: r.extract,
    url: r.content_urls?.desktop?.page,
    thumbnail: r.thumbnail?.source,
  };
}
