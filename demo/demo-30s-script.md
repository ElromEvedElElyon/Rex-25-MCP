# Rex-25 — 30 second demo video script

**Total runtime:** 30 seconds
**Format:** 1080×1920 vertical (mobile-first), 60fps
**Voiceover:** none (text overlays only — silent demo plays in feeds)
**Background music:** subtle synth pad, low volume, fade out at 28s
**Color grade:** deep black #0A0A0B, gold accents #D4922B

---

## Beat sheet

### 0:00 – 0:03  HOOK
- **Visual:** empty terminal, blinking cursor on black background.
- **Overlay (top, fades in 0:01):** "The trillion-parameter agent."
- **Overlay (bottom, fades in 0:02):** "Installs in one line."
- **Sound:** soft typing tick on cursor blink.

### 0:03 – 0:10  INSTALL
- **Visual:** type into terminal at 60wpm:
  ```
  curl -fsSL https://sintex.ai/rex25/install.sh | sh
  ```
- **At 0:07** hit Enter. Lines scroll:
  ```
  ==> Rex-25 MCP installer
  [ok] Node v22.4.1 detected
  [ok] Package cached
  [ok] Injected rex25 into claude_desktop_config.json
  ==> Done.
  ```
- **Overlay (right side):** "macOS · Linux · Windows · Android"

### 0:10 – 0:20  CLAUDE DESKTOP DEMO
- **Visual:** cut to Claude Desktop window. User types:
  > "Use rex25 to get the current Bitcoin price and search Grokipedia for 'BitNet b1.58'."
- **At 0:14** Claude shows tool calls in inline UI:
  - `rex25_quote(asset="BTC")` → returns `$72,418.20`
  - `rex25_search(query="BitNet b1.58")` → returns 3 result snippets
- **Overlay (bottom):** "MCP-native. Works in Claude, Cursor, Cline."

### 0:20 – 0:25  RESULT
- **Visual:** Claude's reply formatted:
  > Bitcoin is trading at **$72,418.20**. BitNet b1.58 is a 1.58-bit
  > quantization scheme using ternary weights {-1, 0, +1}, achieving
  > near-FP16 accuracy on language tasks.
- **Overlay (top right):** "1 sat per query · pay-per-call"

### 0:25 – 0:30  CALL TO ACTION
- **Visual:** fade terminal + Claude. Black background.
- **Center text (large, gold):**
  ```
  REX-25
  ```
- **Below (white, smaller):**
  ```
  sintex.ai/rex25
  ```
- **At 0:29** small text appears: "Open source · Lightning-billed · Local-first"
- **0:30** end frame holds for 0.5s before loop.

---

## Honesty rules (do not break)

- All terminal output shown is real (recorded from a working install).
- BTC price and Grokipedia results come from actual `rex25_quote` and
  `rex25_search` MCP tool calls. No mockups, no green-screen lies.
- The "Lightning-billed" claim is shown — billing UI must be implemented in
  the demoed build before this video ships publicly.
- No fictional features (no "agent swarm", no "trillion-param running locally
  right now"). The trillion-param tagline is aspirational ROADMAP only and is
  not implied to be the current state.

## Capture commands

```
# macOS screen record
screencapture -v -V 30 -G demo.mov

# Asciinema (terminal portion)
asciinema rec --idle-time-limit 0.3 --cols 100 --rows 24 install.cast

# Convert to mp4 vertical 1080x1920
ffmpeg -i raw.mov -vf "scale=1080:-1,crop=1080:1920" -r 60 -c:v libx264 -crf 18 demo-30s.mp4
```
