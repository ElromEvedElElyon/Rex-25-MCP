# Rex-25 PWA scaffold

Static PWA for hosting at `https://sintex.ai/rex25/`.

## Deploy

Copy this folder's contents into the `sintex-now` repo at `rex25/`:

```sh
cp -r pwa/* /path/to/sintex-now/rex25/
```

(Sintex-now sits outside this repo's sandbox so we ship the assets here and
the user copies them across, or symlinks `sintex-now/rex25 -> Rex-25-MCP/pwa`.)

Then commit + push sintex-now; Netlify auto-deploys to sintex.ai/rex25.

## Files

| File                | Purpose                                     |
|---------------------|---------------------------------------------|
| `index.html`        | Landing: Hero + Install + Features + Try + Roadmap |
| `manifest.json`     | PWA manifest, gold theme, scope `/rex25/`   |
| `sw.js`             | Service worker, cache-first shell + network-first APIs |
| `app.js`            | Chat handler, SW registration, copy button  |
| `install-prompt.js` | beforeinstallprompt banner + iOS fallback   |
| `styles.css`        | Vanilla CSS, no build, gold #D4922B accent  |
| `icons/`            | Placeholder icons (replace with real PNGs)  |

## Icon placeholders

Drop real PNGs at:

- `icons/192.png` (192x192)
- `icons/512.png` (512x512)
- `icons/maskable-512.png` (512x512 with safe-zone padding)

Use the Rex-25 dragon mark in gold (#D4922B) on deep-black (#0A0A0B).

## Local test

```sh
cd pwa
python3 -m http.server 8080
# open http://localhost:8080/rex25/  (note: SW scope expects /rex25/ path)
```

For correct SW scope, mount under `/rex25/` (e.g. via a reverse proxy or
serve from a directory named `rex25/`).
