import { isValidUrl } from "../utils";
import * as types from "../types";
/**
 * proxyCSS - Processes CSS stylesheets linked in the document to use the CORS proxy.
 * Each valid and non-data URL stylesheet's href attribute is updated with the proxy URL.
 *
 * @param {Object} options - Configuration settings, including the CORS proxy base URL.
 *   Expected properties:
 *     - corsProxyBaseURL: String - The base URL of the CORS proxy server.
 * @param {number} proxyPings - Initial count of proxy server pings.
 * @returns {Promise<number>} - Returns the updated count of proxy server pings after processing stylesheets.
 */

export async function proxyCSS(options: types.Options) {
  try {
    const css = document.querySelectorAll('link[rel="stylesheet"]');

    for (let stylesheetElement of css) {
      let stylesheetURL = stylesheetElement.getAttribute("href");

      // Check if the URL is valid and not a base64 encoded string
      if (
        stylesheetURL &&
        !stylesheetURL.startsWith("data:") &&
        isValidUrl(stylesheetURL) &&
        !stylesheetURL.startsWith(options.corsProxyBaseUrl)
      ) {
        const url = options.corsProxyBaseUrl + encodeURIComponent(stylesheetURL);

        try {
          // Fetch the CSS content
          const response = await fetch(url);
          const css = await response.text();

          // Create a <style> element and set its content
          const styleEl = document.createElement("style");
          styleEl.textContent = css;

          // Append the <style> element to the document's <head>
          document.head.appendChild(styleEl);

          // Remove the original <link> element
          stylesheetElement.remove();
        } catch (error) {
          console.error("Error fetching CSS:", error);
        }
      }
    }
  } catch (e) {
    console.error("ImageExporter: Error in proxyCSS", e);
  }
}
