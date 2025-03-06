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
