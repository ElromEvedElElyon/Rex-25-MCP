# Icon placeholders

Replace these with real PNGs before shipping:

- `192.png` — 192x192, app icon
- `512.png` — 512x512, splash + high-res
- `maskable-512.png` — 512x512 with 80% safe zone (Android adaptive)

Brand: Rex-25 dragon mark, gold `#D4922B` on deep-black `#0A0A0B`.

Generate via Figma / Canva / `convert` (ImageMagick):

```sh
convert -size 512x512 xc:'#0A0A0B' -fill '#D4922B' \
  -gravity center -pointsize 280 -font Arial-Bold \
  -annotate 0 'R' 512.png
```
