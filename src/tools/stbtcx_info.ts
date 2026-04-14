export const stbtcxInfoTool = {
  name: "rex25_stbtcx_info",
  description: "STBTCx token info on Solana (contract 386JZJtkvf43yoNawAHmHHeEhZWUTZ4UuJJtxC9fpump). Returns supply via Solana RPC.",
  inputSchema: { type: "object", properties: {} },
};

const STBTCX_MINT = "386JZJtkvf43yoNawAHmHHeEhZWUTZ4UuJJtxC9fpump";

export async function stbtcxInfoHandler(_args: Record<string, unknown>): Promise<unknown> {
  const r = await fetch("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenSupply",
      params: [STBTCX_MINT],
    }),
  });
  if (!r.ok) return { error: `HTTP ${r.status}` };
  const j = (await r.json()) as any;
  const v = j?.result?.value;
  return {
    contract: STBTCX_MINT,
    platform: "Solana / Pump.fun",
    supply: v?.uiAmountString,
    supply_raw: v?.amount,
    decimals: v?.decimals,
    mint_authority: "null (immutable)",
    freeze_authority: "null (permissionless)",
    explorer: `https://solscan.io/token/${STBTCX_MINT}`,
  };
}
