---
"image-exporter": minor
---

Reliability fixes and SSR support:

- **SSR-safe import:** the package no longer throws `window is not defined` when imported in Node / SSR frameworks (Next, Nuxt, SvelteKit).
- **Capture failures no longer produce corrupt files:** a failed element is now skipped and logged instead of emitting an empty image into the output; the temporary background style is always restored.
- **Accurate progress:** the progress total now counts every capture, including multi-scale captures.
- **Consistent filenames:** capture-time and download-time deduplication now share one implementation.
- **Correctness:** invalid-format error message now lists `webp`; license corrected to Apache-2.0.
