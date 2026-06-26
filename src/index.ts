/* -------------------------------------------------------------------------- */
/*                               Image Exporter                               */
/*                                                                            */
/*                            by briantuckerdesign                            */
/* -------------------------------------------------------------------------- */
import { capture } from "./capture";
import { downloadImages } from "./capture/download-images";
import { copyImageToClipboard } from "./capture/copy-to-clipboard";

declare global {
  interface Window {
    imageExporter: typeof capture;
    imageExporterDownload: typeof downloadImages;
    imageExporterCopyToClipboard: typeof copyImageToClipboard;
  }
}

/** Exports for use in browser */
if (typeof window !== "undefined") {
  window.imageExporter = capture;
  window.imageExporterDownload = downloadImages;
  window.imageExporterCopyToClipboard = copyImageToClipboard;
}

/** Exports for use as an imported package */
export { capture, downloadImages, copyImageToClipboard };

/** Type exports */
export type {
  ImageOptions,
  Config,
  ParsedImageOptions,
  Image,
  Output,
  Label,
  Format,
  Scale,
  Quality,
  IncludeScaleInLabel,
  LoggingLevel,
} from "./types";
