---
"image-exporter": minor
---

Support cancellation via `config.signal` (an `AbortSignal`). When the signal fires mid-capture, the loop stops and the images captured so far are returned (download is skipped).
