import { ImageExporter } from "./image-exporter";

// Pushes imageExporter to window object so it can be called in Webflow
if (typeof window !== "undefined") {
  (window as any).ImageExporter = ImageExporter;
}

export { ImageExporter };
