export const commonCrawlTool = {
  name: "rex25_common_crawl",
  description: "Query Common Crawl CDX index for URLs matching a pattern. 2.5B pages/month, CC0.",
  inputSchema: {
    type: "object",
    properties: {
      url_pattern: { type: "string", description: "e.g. 'bitcoin.org/*'" },
      crawl_id: { type: "string", default: "CC-MAIN-2025-51" },
      limit: { type: "number", default: 20 },
    },
    required: ["url_pattern"],
  },
};

export async function commonCrawlHandler(args: Record<string, unknown>): Promise<unknown> {
  const pattern = String(args.url_pattern ?? "");
  const crawlId = String(args.crawl_id ?? "CC-MAIN-2025-51");
  const limit = Number(args.limit ?? 20);
  if (!pattern) return { error: "url_pattern required" };
  const u = `https://index.commoncrawl.org/${crawlId}-index?url=${encodeURIComponent(pattern)}&output=json&limit=${limit}`;
  const r = await fetch(u, { headers: { "User-Agent": "rex25-mcp/0.1" } });
  if (!r.ok) return { error: `HTTP ${r.status}` };
  const text = await r.text();
  const records = text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return { count: records.length, records: records.slice(0, limit) };
}
