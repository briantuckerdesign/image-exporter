/* -------------------------------------------------------------------------- */
/*                               Image Exporter                               */
/*                                                                            */
/*                            by briantuckerdesign                            */
/* -------------------------------------------------------------------------- */
import { capture } from "./capture";
import { downloadImages } from "./capture/download-images";

/** Exports for use in browser */
if (typeof window !== "undefined") {
  (window as any).imageExporter = capture;
  (window as any).imageExporterDownload = downloadImages;
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
