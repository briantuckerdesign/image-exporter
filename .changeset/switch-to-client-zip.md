---
"image-exporter": patch
---

Replace `jszip` with `client-zip` for multi-image ZIP downloads. Newer Bun builds resolved jszip to its prebuilt UMD browser file, which broke when re-bundled by downstream packages; client-zip is a small ESM-native package with no such wrapper. Images in a ZIP are still stored uncompressed, as before. URL-encoded (non-base64) data URLs, such as SVG captures, are now decoded correctly instead of being treated as base64.
