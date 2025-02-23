import { proxyCSS } from "./proxy-css";
import { proxyImages } from "./proxy-images";
import { Config } from "../types";
import { isValidUrl } from "./is-valid-url";
import { log } from "../logger";

/**
 * runCorsProxy
 *
 * Proxies all images inside capture elements, as well as all linked CSS files and the absolute URLs inside them.
 * Upon completion of capture, these will be reverted to their original state.
 */
export async function runCorsProxy(
  config: Config,
  elements: HTMLElement[] | NodeListOf<HTMLElement>
): Promise<void> {
  try {
    log.verbose("running CORS proxy");
    if (!config.corsProxyBaseUrl || !isValidUrl(config.corsProxyBaseUrl)) return;

    await proxyCSS(config);
    await proxyImages(config, elements);
  } catch (e) {
    console.error("ImageExporter: Error in runCorsProxy", e);
  }
}
