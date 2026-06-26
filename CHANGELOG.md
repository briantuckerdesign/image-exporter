# image-exporter

## 1.3.0

### Minor Changes

- [#15](https://github.com/briantuckerdesign/image-exporter/pull/15) [`f9c56c2`](https://github.com/briantuckerdesign/image-exporter/commit/f9c56c23b92d73c12419acd29d67dbf31d8efd55) Thanks [@briantuckerdesign](https://github.com/briantuckerdesign)! - Support cancellation via `config.signal` (an `AbortSignal`). When the signal fires mid-capture, the loop stops and the images captured so far are returned (download is skipped).

- [#15](https://github.com/briantuckerdesign/image-exporter/pull/15) [`e216fe9`](https://github.com/briantuckerdesign/image-exporter/commit/e216fe9ace3d6b3e62a3169776bc6beac97228c3) Thanks [@briantuckerdesign](https://github.com/briantuckerdesign)! - Add `config.output` (`"dataurl"` | `"blob"` | `"both"`, default `"dataurl"`) to control what the returned `Image` carries. `"blob"` returns a `Blob` instead of a base64 data URL (lighter on memory); downloading and zipping work in every mode.

- [#15](https://github.com/briantuckerdesign/image-exporter/pull/15) [`f78e504`](https://github.com/briantuckerdesign/image-exporter/commit/f78e5045648ed2a7eb893ab081baa6671401d7ed) Thanks [@briantuckerdesign](https://github.com/briantuckerdesign)! - Add `copyImageToClipboard(image)` to copy a single captured image to the system clipboard (also exposed as `window.imageExporterCopyToClipboard`). Use `format: "png"` for best browser compatibility.

- [#15](https://github.com/briantuckerdesign/image-exporter/pull/15) [`63398c0`](https://github.com/briantuckerdesign/image-exporter/commit/63398c0af3bc514e5ea7f90783cc9d316069c5f4) Thanks [@briantuckerdesign](https://github.com/briantuckerdesign)! - Add an `onProgress(completed, total)` config callback, called after each capture. A package-friendly alternative to polling `window.imageExporterProgress`.

- [#15](https://github.com/briantuckerdesign/image-exporter/pull/15) [`02cba37`](https://github.com/briantuckerdesign/image-exporter/commit/02cba37e0707a19c226cdeb7cfcf12f0440b6557) Thanks [@briantuckerdesign](https://github.com/briantuckerdesign)! - Add `config.screenshotOptions` to pass extra options through to modern-screenshot (fonts, width/height, pixelRatio, backgroundColor, etc.). `scale`/`quality` stay managed by the per-image options, and a user `filter` is combined with the built-in `data-ignore-capture` filter.

- [#15](https://github.com/briantuckerdesign/image-exporter/pull/15) [`16048f8`](https://github.com/briantuckerdesign/image-exporter/commit/16048f89c7500aedd4869e1803fe5b14d6bbaee5) Thanks [@briantuckerdesign](https://github.com/briantuckerdesign)! - Reliability fixes and SSR support:

  - **SSR-safe import:** the package no longer throws `window is not defined` when imported in Node / SSR frameworks (Next, Nuxt, SvelteKit).
  - **Capture failures no longer produce corrupt files:** a failed element is now skipped and logged instead of emitting an empty image into the output; the temporary background style is always restored.
  - **Accurate progress:** the progress total now counts every capture, including multi-scale captures.
  - **Consistent filenames:** capture-time and download-time deduplication now share one implementation.
  - **Correctness:** invalid-format error message now lists `webp`; license corrected to Apache-2.0.
