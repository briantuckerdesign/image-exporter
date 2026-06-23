# image-exporter

[![npm version](https://img.shields.io/npm/v/image-exporter.svg)](https://www.npmjs.com/package/image-exporter)
[![license](https://img.shields.io/npm/l/image-exporter.svg)](https://github.com/briantuckerdesign/image-exporter/blob/main/LICENSE.md)

A client-side JavaScript tool that downloads DOM elements as images. It can be imported using your favorite package manager or attached directly to the window.

## Installation

```bash
npm i image-exporter
```

```typescript
import { capture } from "image-exporter";
```

## Examples

### Package

```typescript
import { capture } from "image-exporter";

const artboards = document.querySelectorAll(".artboard");

// Returns Image[] with { dataURL, fileName } for each image
const images = await capture(artboards, {
  format: "png",
  downloadImages: false,
});
```

### Browser

```html
<!-- Self-hosted -->
<script src="your-path/index.browser.js" type="text/javascript"></script>

<!-- Or via CDN -->
<script src="https://unpkg.com/image-exporter" type="text/javascript"></script>

<div class="artboard">I will be downloaded.</div>

<script>
  const capture = window.imageExporter;
  const artboards = document.querySelectorAll(".artboard");

  // capture() is async and returns a Promise
  capture(artboards).then((images) => {
    console.log("Captured:", images);
  });
</script>
```

## API

### `capture(elements, config?)`

Captures images from HTML elements.

**Parameters:**

- `elements` - `HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>` - Element(s) to capture
- `config` - `Partial<Config>` - Optional configuration object

**Returns:** `Promise<Image[] | null>` - Array of captured images, or `null` on error

```typescript
interface Image {
  dataURL: string;
  fileName: string;
}
```

### `downloadImages(images, config?)`

Downloads previously captured images. Useful when `downloadImages: false` is set during capture.

```typescript
import { capture, downloadImages } from "image-exporter";

const images = await capture(elements, { downloadImages: false });
// ... do something with images ...
await downloadImages(images);
```

In the browser, this is available as `window.imageExporterDownload`.

## Config

Config options are passed to the `capture` function. Image options (label, format, scale, quality, includeScaleInLabel) can also be set at the config level as defaults.

```typescript
interface Config {
  /** Download images as files upon capture. Default: true */
  downloadImages: boolean;
  /** Default label for images. Does not include file extension or scale. Default: "image" */
  defaultImageLabel: string;
  /** Label for zip file. Does not include file extension or scale. Default: "images" */
  zipLabel: string;
  /** Base URL for CORS proxy used when fetching external images. Default: "" */
  corsProxyBaseUrl: string;
  /** Enable window logging for use by external scripts. Default: true */
  enableWindowLogging: boolean;
  /** Logging level for debugging. Default: "none" */
  loggingLevel: "none" | "info" | "error" | "verbose";

  // Default image options (can be overridden per-element)
  /** Default: "image" */
  label: string;
  /** Default: "jpg" */
  format: "jpg" | "png" | "svg" | "webp";
  /** Default: 1 */
  scale: number | number[];
  /** Default: 1 */
  quality: number;
  /** Default: false */
  includeScaleInLabel: boolean;
}
```

### CORS Proxy

If your capture elements have externally hosted images or CSS inside them, you will likely hit a [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) error.

To bypass this, you can provide a CORS proxy base URL. URLs will be encoded and appended without a `?` to your base URL. Include your own trailing slash.

I recommend [cors-proxy-worker](https://github.com/briantuckerdesign/cors-proxy-worker) for production and [local-cors-proxy-encoded](https://github.com/briantuckerdesign/local-cors-proxy-encoded) for development.

Example: `https://example-cors-proxy.com/` -> `https://example-cors-proxy.com/https%3A%2F%2FmyEncodedUrl.com`

## Image Options

Image options can be set per-element using data attributes, or as defaults in the config.

```typescript
interface ImageOptions {
  /** Label for image. Does not include file extension or scale. */
  label: string;
  /** File format. */
  format: "jpg" | "png" | "svg" | "webp";
  /** Scale of image. Can be a number or an array of numbers. */
  scale: number | number[];
  /** Quality of image. 0.0 to 1.0, only applies to jpg. */
  quality: number;
  /** Include scale in label. Automatically true if scale is an array. */
  includeScaleInLabel: boolean;
}
```

### Data Attributes

Set image options on elements using these data attributes:

- `data-label`
- `data-format`
- `data-scale`
- `data-quality`
- `data-include-scale-in-label`

#### Example

```html
<div
  data-label="My custom label"
  data-format="jpg"
  data-scale="1,2"
  data-quality="0.8"
  data-include-scale-in-label="true"
>
  I will be downloaded at @1x and @2x with a custom label, quality of 0.8, as a JPG, with
  scale in the filename.
</div>
```

```html
<div class="artboard" data-scale="1,2">I will be downloaded at @1x and @2x.</div>
<div class="artboard" data-format="jpg" data-quality="0.8">
  I will be a compressed JPG.
</div>
```

## Built Using

- [`modern-screenshot`](https://github.com/qq15725/modern-screenshot)
- [`jszip`](https://github.com/Stuk/jszip)

Bundled with Bun and written in TypeScript.

## License

Apache-2.0 License - see [LICENSE.md](LICENSE.md) for details.
