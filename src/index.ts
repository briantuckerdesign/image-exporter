/* -------------------------------------------------------------------------- */
/*                               Image Exporter                               */
/*                                                                            */
/*                            by briantuckerdesign                            */
/* -------------------------------------------------------------------------- */
import { capture } from "./capture";
import { downloadImages } from "./capture/download-images";

declare global {
  interface Window {
    imageExporter: typeof capture;
    imageExporterDownload: typeof downloadImages;
  }
}

/** Exports for use in browser */
if (typeof window !== "undefined") {
  window.imageExporter = capture;
  window.imageExporterDownload = downloadImages;
}

/** Exports for use as an imported package */
export { capture, downloadImages };

/** Type exports */
export type {
  ImageOptions,
  Config,
  ParsedImageOptions,
  Image,
  Label,
  Format,
  Scale,
  Quality,
  IncludeScaleInLabel,
  LoggingLevel,
} from "./types";
