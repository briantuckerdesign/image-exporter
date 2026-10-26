---
"image-exporter": patch
---

Round the measured element size before capture. At a non-integer `devicePixelRatio` (Windows display scaling, browser zoom) a 970px element measures 969.997px and modern-screenshot floored it, producing images one pixel short in each dimension. A `width`/`height` passed via `screenshotOptions` still takes precedence.
