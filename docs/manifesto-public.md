# Rex-25 Manifesto (public edition)

> *The trillion-parameter agent in your desk.*

## What this is

Rex-25 is an open Model Context Protocol (MCP) server you install on your own
machine in one line. It plugs into Claude Desktop, Cursor, Cline and any other
MCP host, and gives those clients tools to:

- query a local language model with sub-second latency,
- search the open web (Grokipedia, Wikipedia, market data),
- price and pay micropayments over Bitcoin Lightning,
- coordinate with other Rex-25 nodes on a peer mesh ("the constellation").

The codebase is open. The protocol is open. The economics are open. **Your
data and your sats stay on your hardware unless you explicitly route them
elsewhere.**

## Why this exists

Three observations:

1. The state-of-the-art in language models is moving toward heterogeneous,
   sharded inference — no single device runs the biggest models, but many
   devices coordinating do.
2. The economically rational way to coordinate strangers' compute is
   per-query micropayment, and the only network on earth that settles
   sub-cent payments globally in seconds is Bitcoin Lightning.
3. The current AI distribution model — "log into our cloud, give us your
   credit card, trust our SOC-2 attestation" — is the opposite of what
   sovereignty-minded users, professionals under NDA, and regulated industries
   actually need.

Rex-25 is the experiment of doing it the other way: **install locally, pay
per query, contribute spare cycles, own your inference**.

## Vision: the trillion-parameter agent in your desk

A single laptop today can run a 14-billion-parameter model at usable speed.
A small office cluster can run a 70-billion-parameter model. The largest
open models — 400B, 600B, 1T+ — do not fit any single consumer device.

The constellation is the answer: thousands of nodes, each holding a fragment
of the weights, exchanging activations over a peer protocol, billed by the
sat. The user-facing experience is identical to a local model: open chat,
ask question, get answer in under five seconds. Underneath, the inference
spans devices.

You are not "using a cloud". You are participating in a swarm where every
participant is also a customer.

## Roadmap — 4 phases

### Phase 1 — HIBERNATION  *(current)*

- Free trial: queries cost zero sats.
- Local model: small efficient model (1-7B class) runs on the user's CPU/GPU.
- Cloud fallback for queries the local model cannot serve.
- Goal: prove the install experience is one-line and the MCP integration
  works in real client UIs.
- **Exit criteria:** 1,000 unique installers, sub-1% one-line install
  failure rate.

### Phase 2 — TRIAL

- Lightning Wallet pairing via NWC (Nostr Wallet Connect).
- 1 sat per query, hard cap configurable per session.
- Receipts and audit trail visible in the PWA.
- **Exit criteria:** 100 wallets paired, payment success rate >99%.

### Phase 3 — ACTIVE

- Heavy-fragment node mode: machines with adequate VRAM host model shards
  and earn sats from queries routed to them.
- LoRA training contribution: spare cycles can opt in to community
  fine-tuning runs, with credit attribution.
- **Exit criteria:** 50 fragment-hosting nodes online with positive
  net-sat balance.

### Phase 4 — SCALING

- Sharded inference across the constellation: a single user query can fan
  out across 5–50 nodes, recombine, return in <5s.
- Billion-parameter inference becomes the floor; trillion-parameter
  inference becomes possible from a phone via thin-client routing.
- **Exit criteria:** sharded inference of a 70B+ model at <5s p95 latency
  with 100+ active nodes.

## What we will not do

- We will not gate features behind subscriptions or accounts. Pay per query
  with sats, period.
- We will not collect your queries. The MCP server runs on your machine; we
  literally cannot see what you ask it.
- We will not promise inference performance we have not benchmarked on real
  hardware that you can also buy.
- We will not ship "agent swarm" claims that are not backed by verifiable
  protocol traffic between actual nodes.

## How to participate

- **Use it.** `curl -fsSL https://sintex.ai/rex25/install.sh | sh`
- **Read the code.** github.com/ElromEvedElElyon/Rex-25-MCP
- **Run a fragment node** when Phase 3 opens.
- **Report bugs and broken claims.** Honesty is load-bearing.

---

*Rex-25 is the 25th iteration in the Rex family of inference engines. Earlier
iterations are open source and benchmarked; their results inform what we
will and will not promise here.*

*sintex.ai/rex25*
