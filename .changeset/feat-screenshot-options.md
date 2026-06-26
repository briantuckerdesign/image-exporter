---
"image-exporter": minor
---

Add `config.screenshotOptions` to pass extra options through to modern-screenshot (fonts, width/height, pixelRatio, backgroundColor, etc.). `scale`/`quality` stay managed by the per-image options, and a user `filter` is combined with the built-in `data-ignore-capture` filter.
