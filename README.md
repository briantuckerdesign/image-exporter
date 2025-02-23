# image-exporter [v1.0.0]

image-exporter is a client-side javascript tool that downloads DOM elements as images. It can be imported using your favorite package manager or used directly the window.

## Examples:

### Package

```Typescript
import  { capture }  from  "image-exporter";

const  artboards  =  document.querySelectorAll(".artboard");

// Returned as [dataUrl, filename] rather than downloaded
const images = capture(artboards, {
	format: 'png',
	downloadImages: false
})
```

### Browser

```HTML
<script src="your-path/image-exporter.umd.js" type="text/javascript"></script>

<div class="artboard">I will be downloaded.</div>

<script>
	const  capture  =  window.imageExporter;
	const  artboards  =  document.querySelectorAll(".artboard");
	capture(artboards)
</script>

```

## Installation

`npm i image-exporter` or whatever package manager you're using.

```Typescript
import  { capture }  from  "image-exporter";
```

## Config

```Typescript
{
	/** Download images as files upon capture. */
	downloadImages:  boolean;
	/** Default label for images. Does not include file extension or scale. */
	defaultImageLabel:  string;
	/** Label for zip file. Does not include file extension or scale. */
	zipLabel:  Label;
	/** Base URL for CORS proxy used when fetching external images. */
	corsProxyBaseUrl:  string;
	/** Enable window logging for use by external scripts */
	enableWindowLogging:  boolean;
	/** Enable verbose logging for debugging. */
	loggingLevel:  "none"  |  "info"  |  "error"  |  "verbose";
}
```

### CORS proxy

If your capture elements have externally hosted images or CSS inside them, you will likely hit a [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) error.

To bypass this, you can provide a CORS proxy base URL. URLs will be encoded and appended without a `?` to your base URL. Include your own trailing slash.

I recommend [cors-proxy-worker](https://github.com/briantuckerdesign/cors-proxy-worker) for production and [local-cors-proxy-encoded](https://github.com/briantuckerdesign/local-cors-proxy-encoded) for development.

Example: `https://example-cors-proxy.com/` -> `https://example-cors-proxy.com/https%3A%2F%2FmyEncodedUrl.com`

## Image options

Image options can also be set at the `config` level and will serve as the default if no values are provided for that specific capture element.

```Typescript
{
	/** Label for image. Does not include file extension or scale. */
	label:  string;
	/** File format, jpg, png, or svg. */
	format:  "jpg"  |  "png"  |  "svg";
	/** Scale of image. Can be a number or a comma-separated list of numbers. */
	scale:  number  |  number[];
	/** Quality of image. 0.0 to 1.0, only applies to jpg.*/
	quality:  number;
	/** Include scale in label. True or false. Automatically true if scale is an array. */
	includeScaleInLabel:  boolean;
}
```

### Setting image options

Image options are set on the element itself using data attributes.

The attributes are:

```
data-label
data-format
data-scale
data-quality
data-include-scale-in-label
```

#### Example

```HTML
<div
    data-label="My custom label"
    data-format="jpg"
    data-scale="1,2"
    data-quality="0.8"
    data-include-scale-in-label="true">
    I will be downloaded at @1x and @2x with a custom label, quality of 0.8, a JPG, and include scale in label.
</div>
```

### Setting config options

Config options are set in the `config` object passed to the `capture` function.

#### Example

```HTML
<div class="artboard" data-scale="1,2">I will be downloaded at @1x and @2x.</div>
<div class="artboard" data-format="jpg" data-quality="0.8">I will be a compressed JPG.</div>
```

## Built using

- [`html-to-image`](https://github.com/bubkoo/html-to-image)

- [`jszip`](https://github.com/Stuk/jszip)

- [`downloadjs`](https://github.com/rndme/download)

Bundled in Vite and written in Typescript.
