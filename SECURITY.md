# Security Policy — Rex-25-MCP

## Supported versions

| Version | Supported |
|---|---|
| 0.1.x | ✅ |

## Reporting a vulnerability

Email `inteligenciaartificial.now@gmail.com` with the subject line
`[rex25-mcp] security: <short title>`. Include:

- affected version (`npm ls rex25-mcp`)
- reproducer (minimal config or request)
- impact assessment (user data? server RCE? DoS?)

We aim to triage within 72 h and patch critical issues in the next
release. Please give us 30 days before public disclosure.

## Credentials — what this package will never do

`rex25-mcp` is the public SDK. It **does not** ship, request, or persist
any credentials. Specifically:

- No hardcoded API keys anywhere in `src/` or `dist/` — verified by
  `scripts/install_pre_commit.sh` in every commit.
- Tools that need external APIs (`rex25_chat`, `rex25_distill`) read
  keys at call time from the caller's environment: `CEREBRAS_API_KEY`,
  `OPENROUTER_API_KEY`, `GEMINI_API_KEY`. They are passed to the
  upstream vendor over TLS only; never logged, never cached.
- `rex25_btc_price`, `rex25_wikipedia_search`, `rex25_grokipedia_search`,
  `rex25_rune_info`, `rex25_stbtcx_info`, `rex25_common_crawl` hit
  **public** endpoints and use no authentication.
- No telemetry. No analytics. No home-phone.

If you discover any of the above is not true, please file a security
report immediately — it is a defect.

## Running offline

Set `REX25_OFFLINE=1` to disable every tool that would make an outbound
request. Only `rex25_classify_file`, `rex25_to_markdown`, `rex25_forecast`,
and `rex25_node_status` remain active — all local-only.
