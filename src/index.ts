/* -------------------------------------------------------------------------- */
/*                               Image Exporter                               */
/*                                                                            */
/*                            by briantuckerdesign                            */
/* -------------------------------------------------------------------------- */
import { capture } from "./capture";

/** Exports for use in browser */
if (typeof window !== "undefined") {
  (window as any).imageExporter = capture;
}

/** Exports for use as an imported package */
export { capture };
