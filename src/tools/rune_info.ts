export const runeInfoTool = {
  name: "rex25_rune_info",
  description: "BITCOIN•USD•ONE Rune info on Bitcoin mainnet. Premine + mintable cap + holders.",
  inputSchema: { type: "object", properties: {} },
};

export async function runeInfoHandler(_args: Record<string, unknown>): Promise<unknown> {
  const url = "https://open-api.unisat.io/v1/indexer/runes/BITCOIN%E2%80%A2USD%E2%80%A2ONE/info";
  const r = await fetch(url, { headers: { "User-Agent": "rex25-mcp/0.1" } });
  if (!r.ok) return { error: `HTTP ${r.status}`, url };
  const j = (await r.json()) as any;
  const d = j?.data ?? {};
  return {
    rune: d.spacedRune ?? "BITCOIN•USD•ONE",
    rune_id: d.runeid,
    rune_number: d.number,
    etched_block: d.height,
    etched_at: d.timestamp ? new Date(d.timestamp * 1000).toISOString() : null,
    symbol: d.symbol,
    divisibility: d.divisibility,
    premine: d.premine,
    per_mint: d.terms?.amount,
    mint_cap: d.terms?.cap,
    mints_done: d.mints,
    holders: d.holders,
    mintable: d.mintable,
    explorer: "https://luminex.io/rune/BITCOIN•USD•ONE",
  };
}
