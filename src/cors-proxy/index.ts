import { isValidUrl } from "../utils";
import { proxyCSS } from "./proxy-css";
import { proxyImages } from "./proxy-images";
import { Options } from "../types/options";

/**
 * runCorsProxy - Initializes a CORS proxy by processing image and CSS resources on a web page.
 * Logs the total number of calls made to the proxy server.
 */

export async function runCorsProxy(options: Options): Promise<void> {
  try {
    if (!options.corsProxyBaseUrl || !isValidUrl(options.corsProxyBaseUrl)) return;

    await proxyCSS(options);
    await proxyImages(options);

    return;
  } catch (e) {
    console.error("ImageExporter: Error in runCorsProxy", e);
  }
}
