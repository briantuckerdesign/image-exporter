---
"image-exporter": minor
---

Add `config.output` (`"dataurl"` | `"blob"` | `"both"`, default `"dataurl"`) to control what the returned `Image` carries. `"blob"` returns a `Blob` instead of a base64 data URL (lighter on memory); downloading and zipping work in every mode.
