# Rex-25 MCP

> Earn Bitcoin. Run trillion-param agents. Locally.

[![npm](https://img.shields.io/npm/v/rex25-mcp?color=f7931a)](https://www.npmjs.com/package/rex25-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Glama Rating](https://img.shields.io/badge/Glama-pending-yellow)](https://glama.ai)
[![Bitcoin Native](https://img.shields.io/badge/Bitcoin-native-f7931a?logo=bitcoin)](https://bitcoin.org)
[![MCP Compatible](https://img.shields.io/badge/MCP-compatible-blue)](https://modelcontextprotocol.io)
[![Node 18+](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![CI](https://github.com/ElromEvedElElyon/Rex-25-MCP/actions/workflows/ci.yml/badge.svg)](https://github.com/ElromEvedElElyon/Rex-25-MCP/actions)

Rex-25 is a Bitcoin-native, decentralized AI runtime that ships as a Model Context Protocol (MCP) server. It exposes 12 production tools through a single `npx` command and connects any MCP host (Claude Desktop, Cursor, Cline, Continue, ChatGPT desktop, etc.) to a constellation of local and remote inference nodes — without sending your data to any vendor's servers and without VC-funded middlemen.

---

## Quick Start

```bash
npx rex25-mcp
```

That's it. No accounts, no API keys, no telemetry. The server starts on stdio, advertises 12 tools to the MCP host, and is ready to use.

To install permanently:

```bash
npm install -g rex25-mcp
rex25-mcp --version
```

---

## What is Rex-25?

Rex-25 is the public SDK for the Rex constellation — a decentralized network of AI nodes designed around three principles:

1. **Bitcoin-native settlement.** Every billable query settles on Lightning. There are no subscriptions, no credit cards, no middlemen.
2. **Local-first inference.** Your prompts and your model weights stay on your machine. Outbound traffic is opt-in, per tool.
3. **Trillion-parameter constellations.** A single Rex node holds a fragment of a global brain. As more nodes come online, the effective parameter count grows linearly without a central operator.

This MCP package is the thin client layer. It lets any MCP-compatible host call into the Rex network, query frontier LLMs in parallel, search the open web, and read on-chain data — all through one binary.

---

## 12 Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | `rex25_chat` | LLM query, racing 10 frontier vendors first-response-wins. |
| 2 | `rex25_distill` | Multi-LLM consensus, distillation-ready signal. |
| 3 | `rex25_grokipedia_search` | Search xAI's Grokipedia (235 sitemaps). |
| 4 | `rex25_wikipedia_search` | Search Wikipedia REST API. |
| 5 | `rex25_common_crawl` | 2.5B pages/month web index lookup. |
| 6 | `rex25_classify_file` | Magic-byte file type detection. |
| 7 | `rex25_to_markdown` | HTML or arbitrary document to clean Markdown. |
| 8 | `rex25_forecast` | Linear time-series projection. |
| 9 | `rex25_btc_price` | BTC live price (CoinGecko). |
| 10 | `rex25_stbtcx_info` | STBTCx Solana token (Pump.fun). |
| 11 | `rex25_rune_info` | BITCOIN-USD-ONE Bitcoin Rune. |
| 12 | `rex25_node_status` | Local rex25-node health and queue depth. |

Each tool is a strict JSON-Schema MCP tool. Schemas live in `src/tools/*.schema.json` and are auto-discovered.

---

## Use with Claude Desktop

Edit `~/.config/Claude/claude_desktop_config.json` (macOS/Linux) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "rex25": {
      "command": "npx",
      "args": ["-y", "rex25-mcp"]
    }
  }
}
```

Restart Claude Desktop. The 12 Rex-25 tools will appear in the tool palette.

## Use with Cursor

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "rex25": {
      "command": "npx",
      "args": ["-y", "rex25-mcp"]
    }
  }
}
```

## Use with Cline

In VS Code, open Cline settings and add:

```json
{
  "rex25": {
    "command": "npx",
    "args": ["-y", "rex25-mcp"],
    "transport": "stdio"
  }
}
```

## Use with Continue.dev

In `~/.continue/config.json`:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      { "transport": { "type": "stdio", "command": "npx", "args": ["-y", "rex25-mcp"] } }
    ]
  }
}
```

---

## 5 Use Cases

### 1. The Lawyer
A solo practitioner needs to draft a contract clause and cross-check it against three jurisdictions. With Rex-25, she fires `rex25_distill` with the clause and a prompt; six frontier models respond in parallel and Rex-25 returns the consensus and the disagreements. No client data ever touches a third-party SaaS dashboard.

### 2. The Developer
A backend engineer is debugging an obscure error message. `rex25_chat` races 10 vendors first-response-wins; the fastest correct answer arrives in ~700ms. He pays per query in satoshis instead of $20/month for a subscription he barely uses.

### 3. The Bitcoin Miner
An ASIC operator wants to redirect idle hashrate into AI compute settlement. He runs a Rex-25 node, accepts inbound queries from the constellation, and earns sats every time his node wins a race. Hardware that already exists earns a second revenue stream.

### 4. The Researcher
A PhD student studying language drift uses `rex25_common_crawl` to pull 50,000 archived pages, `rex25_to_markdown` to normalize them, and `rex25_distill` to extract structured citations. The whole pipeline runs locally in an evening — no $4,000 vendor invoice.

### 5. The AI Agent Operator
A team running an autonomous agent fleet pipes every external query through Rex-25. The agent gets 12 tools for free, a Bitcoin-denominated budget, and a sovereign audit log. When their agent goes rogue at 3am, the failure mode is "out of sats", not "$50,000 OpenAI bill".

---

## Why Rex-25 Exists

The current AI stack has three structural problems:

1. **Centralized rent extraction.** Three vendors collect the lion's share of every dollar spent on inference. They are also the only parties who see every prompt.
2. **Subscription lock-in.** Flat-fee monthly billing punishes light users and subsidizes scrapers. Per-query micropayments are fairer and only Bitcoin Lightning can settle them at the right price point.
3. **No exit.** If a vendor terminates your account or changes their terms, your agent stack stops. There is no portable runtime.

Rex-25 is the Bitcoin-native answer to all three. Lightning settlement removes the rent. Local-first inference removes the surveillance. The MCP standard removes the lock-in. And the constellation architecture means no single party — including the author — can shut it down.

---

## Vision

The trillion-parameter agent in your desk. Each Rex-25 node hosts a fragment of a global brain. Together, the constellation grows without ceiling — 1 node to 200 nodes (10 trillion params) to 200,000 nodes (1 quadrillion+). Bitcoin Lightning settles every query. STBTCx mines rewards. No central server. No KYC. No VC.

The aesthetic of the project — gold accent `#D4922B` over deep black — is deliberate. Gold is the historical settlement layer; Bitcoin is its digital successor; Rex-25 is the compute layer that finally pays in it.

---

## Larger Vision (private repos)

This SDK exposes only the public surface. The core engine — the mixed-precision quantizer, the kernel layer, the sovereign Constitution governance module, the RL distillation pipeline, and the constellation routing fabric — lives in private repositories. Strategic partners interested in early access, OEM licensing, or co-development should contact the author directly.

---

## Architecture (public surface)

```
+----------------------+
|   MCP Host           |   Claude Desktop, Cursor, Cline, ChatGPT, ...
|   (stdio transport)  |
+----------+-----------+
           |
           v
+----------------------+
|   rex25-mcp (this)   |   12 tools, JSON-Schema validated
+----------+-----------+
           |
   +-------+--------+
   |                |
   v                v
+-------+      +----------------+
| local |      | Rex constellation (opt-in) |
| node  |      | Lightning settlement       |
+-------+      +----------------+
```

The local node is optional. Tools that do not require it (Wikipedia, Common Crawl, BTC price, etc.) work out of the box with no setup.

---

## Configuration

All configuration is via environment variables. Nothing is required for the default install.

| Variable | Default | Description |
|----------|---------|-------------|
| `REX25_NODE_URL` | `http://127.0.0.1:7825` | Local Rex-25 node endpoint. |
| `REX25_LIGHTNING_NODE` | unset | Lightning node URI for settlement. |
| `REX25_BUDGET_SATS` | `0` | Per-session budget cap in satoshis. |
| `REX25_LOG_LEVEL` | `info` | `error` \| `warn` \| `info` \| `debug` \| `trace` |
| `REX25_TIMEOUT_MS` | `30000` | Per-tool timeout. |
| `REX25_OFFLINE` | `false` | If `true`, only local tools are available. |

---

## Privacy

- No telemetry. The binary makes no outbound calls unless a tool is invoked.
- No prompt logging. Tool inputs are never persisted by this client.
- Tool outputs are streamed back to the MCP host and immediately discarded from this process.
- See [SECURITY.md](./SECURITY.md) for disclosure policy.

---

## Compatibility

| Host | Tested | Notes |
|------|--------|-------|
| Claude Desktop | yes | All 12 tools |
| Cursor | yes | All 12 tools |
| Cline (VS Code) | yes | All 12 tools |
| Continue.dev | yes | Behind `experimental` flag |
| ChatGPT Desktop | partial | stdio MCP, schemas honored |
| Zed | partial | basic stdio works |
| Generic MCP host | yes | Standard 2025-06-18 spec |

---

## Roadmap

- v0.1.0 — Initial public release. 12 tools, stdio transport, MIT.
- v0.2.0 — HTTP/SSE transport. Multi-tenant node mode.
- v0.3.0 — Constitution-aware routing (sovereign rules per node).
- v0.4.0 — Native Lightning channel management built in.
- v1.0.0 — Stable schema lock, semver guarantees.

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md). All contributors agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT. Fork freely, use commercially, attribution appreciated. See [LICENSE](./LICENSE).

---

## Author

**Elrom** — inteligenciaartificial.now@gmail.com
GitHub: [@ElromEvedElElyon](https://github.com/ElromEvedElElyon)

If Rex-25 saves you time or money, tip in sats:

- Bitcoin (Taproot): `bc1pecl2zqn8xy8qxe3vrz6eeyjz3ese3khprugz4f9l2q240p3w5fcq2ysahk`
- Solana: `CM42ofAFowySg72GjDuCchEkwwbwnhdSRYgztRCAAEzR`

Partnership inquiries, OEM licensing, or constellation operator onboarding: same email.
