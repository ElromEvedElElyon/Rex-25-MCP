# Rex-25 MCP on iOS / iPadOS

iOS does not allow installing native MCP servers directly (no shell, no Node.js
out of the box). You have two paths: **PWA-only** (recommended for most users)
or **shell app** (for power users).

---

## Path A — PWA only (recommended, 30 seconds)

1. Open **Safari** on your iPhone or iPad.
2. Visit https://sintex.ai/rex25
3. Tap the **Share** button → **Add to Home Screen**.
4. Launch "Rex-25" from your home screen. It runs offline after first load.

The PWA talks to a remote Rex-25 endpoint by default; no local server needed.
Your queries are billed in sats (HIBERNATION phase: free).

---

## Path B — Local Node.js via shell app (power users)

iOS supports a few sandboxed shell apps capable of running Node.js. Pick one:

| App           | Cost | Node.js | npm | Notes                                  |
|---------------|------|---------|-----|----------------------------------------|
| **a-Shell**   | Free | yes     | yes | Recommended. WASM-based, sandbox-safe. |
| **iSH**       | Free | partial | partial | Alpine emulation; slower; flaky npm.   |
| **Pythonista**| Paid | no      | no  | Python only — won't work for Rex-25.   |
| **Pyto**      | Paid | no      | no  | Python only — won't work for Rex-25.   |

### Steps with a-Shell

1. Install **a-Shell** from the App Store.
2. Open a-Shell and run:
   ```
   npm install rex25-mcp
   ```
3. Launch the server:
   ```
   npx rex25-mcp
   ```
4. The MCP server listens locally on port 9023. The PWA at
   https://sintex.ai/rex25 will detect a local instance automatically and
   route queries to it (you save sats by running locally).

> **Note:** iOS suspends background processes aggressively. The local server
> stops when a-Shell is backgrounded. For 24/7 thin-client behavior, prefer
> the PWA path.

---

## Lightning wallet pairing

Both paths support pairing a Lightning wallet via NWC (Nostr Wallet Connect).
Open the PWA → Settings → Pair wallet → scan QR. No funds leave your wallet
without explicit per-query approval (default cap: 21 sats / query).

---

## Troubleshooting

- **PWA install option missing:** must use Safari (not Chrome on iOS).
- **a-Shell `npm` errors:** run `lg npm` once to link the npm package.
- **Server port already in use:** another Rex-25 is running; close a-Shell tab.

Docs: https://sintex.ai/rex25/docs
