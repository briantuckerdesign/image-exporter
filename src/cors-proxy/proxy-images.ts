import { blobToDataURL, isValidUrl } from "../utils";
import * as types from "../types";
/**
 * proxyImages - Processes images within a specified wrapper element to use the CORS proxy.
 * Groups images by their source, fetches and replaces the src with a data URL for duplicates,
 * and prefixes the proxy URL for unique images.
 *
 * @param {Object} options - Configuration settings, including the selector for the wrapper and CORS proxy base URL.
 *   Expected properties:
 *     - wrapperSelector: String - The CSS selector for the wrapper element containing images.
 *     - corsProxyBaseURL: String - The base URL of the CORS proxy server.
 * @returns {Promise<number>} - Returns the number of times the proxy server was pinged.
 */
export async function proxyImages(options: types.Options) {
  try {
    // find all link tags in head and add crossorigin="anonymous"
    const links = document.querySelectorAll("link");
    links.forEach((link) => {
      link.setAttribute("crossorigin", "anonymous");
    });

    const wrapper = document.querySelector(options.selectors.wrapper);
    if (!wrapper) {
      console.error("ImageExporter: Wrapper element not found.");
      return;
    }
    const images = Array.from(wrapper.querySelectorAll("img")) as HTMLImageElement[];

    const srcMap = new Map<string, HTMLImageElement[]>();

    // Group images by src
    images.forEach((img) => {
      const srcs = srcMap.get(img.src) || [];
      srcs.push(img);
      srcMap.set(img.src, srcs);
    });

    for (const [src, duplicates] of srcMap) {
      if (
        !isValidUrl(src) ||
        (options.corsProxyBaseUrl && src.startsWith(options.corsProxyBaseUrl))
      ) {
        continue;
      }
      if (duplicates.length > 1) {
        // Fetch and replace src for duplicate images
        try {
          const response = await fetch(
            options.corsProxyBaseUrl + encodeURIComponent(src)
          );

          const blob = await response.blob();
          const dataURL = await blobToDataURL(blob);
          duplicates.forEach((dupImg) => {
            if (dupImg.src === src) {
              dupImg.src = dataURL;
            }
          });
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      } else {
        // Prefix src for unique images
        images.forEach((img) => {
          if (img.src === src) {
            img.src = options.corsProxyBaseUrl + encodeURIComponent(src);
          }
        });
      }
    }
  } catch (e) {
    console.error("ImageExporter: Error in proxyImages", e);
    return;
  }
}

/**
 * blobToDataURL - Converts a Blob object to a data URL.
 *
 * @param {Blob} blob - The Blob object to be converted.
 * @returns {Promise<string>} - Returns a Promise that resolves to a data URL string.
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
