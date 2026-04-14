export const btcPriceTool = {
  name: "rex25_btc_price",
  description: "Live Bitcoin price (USD) from CoinGecko. No API key.",
  inputSchema: { type: "object", properties: {} },
};

export async function btcPriceHandler(_args: Record<string, unknown>): Promise<unknown> {
  const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true", {
    headers: { "User-Agent": "rex25-mcp/0.1" },
  });
  if (!r.ok) return { error: `HTTP ${r.status}` };
  const j = (await r.json()) as any;
  return {
    btc_usd: j?.bitcoin?.usd,
    change_24h_pct: j?.bitcoin?.usd_24h_change,
    source: "coingecko",
    fetched_at: new Date().toISOString(),
  };
}
