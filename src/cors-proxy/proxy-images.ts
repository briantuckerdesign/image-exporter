import { Config } from "../types";
import { isValidUrl } from "./is-valid-url";
import { log } from "../logger";

/**
 * proxyImages
 *
 * Proxies all images inside capture elements.
 * The original src is stored for later restoration.
 */
export async function proxyImages(
  config: Config,
  elements: HTMLElement[] | NodeListOf<HTMLElement>
) {
  try {
    const elementArray = Array.from(elements);
    if (!elementArray.length) return;
    log.verbose("images to proxy", elementArray.length);

    for (const element of elementArray) {
      const images = Array.from(element.querySelectorAll("img")) as HTMLImageElement[];
      for (const img of images) {
        if (isValidUrl(img.src) && !img.src.startsWith(config.corsProxyBaseUrl)) {
          img.setAttribute("original-src", img.src);
          img.src = config.corsProxyBaseUrl + encodeURIComponent(img.src);
          log.verbose("Proxied: ", img.src);
        }
      }
    }
  } catch (e) {
    console.error("ImageExporter: Error in proxyImages", e);
    return;
  }
}
