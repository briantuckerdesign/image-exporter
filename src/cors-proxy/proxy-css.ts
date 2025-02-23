import { log } from "../logger";
import { Config } from "../types";
import { isValidUrl } from "./is-valid-url";

/**
 * proxyCSS
 *
 * Proxies all linked CSS files and the absolute URLs inside them, including fonts and images.
 * Upon completion of capture, the links will be restored and the style elements removed.
 */
export async function proxyCSS(config: Config) {
  const stylesheetElements = document.querySelectorAll('link[rel="stylesheet"]');
  log.verbose("stylesheet elements to proxy", stylesheetElements.length);

  for (let stylesheetElement of stylesheetElements) {
    const stylesheetURL = stylesheetElement.getAttribute("href");

    // Exclude data URLs, invalid URLs, and already proxied URLs
    if (!stylesheetURL) continue;
    if (stylesheetURL.startsWith("data:")) continue;
    if (stylesheetURL.startsWith(config.corsProxyBaseUrl)) continue;
    if (!isValidUrl(stylesheetURL)) continue;

    stylesheetElement.setAttribute("crossorigin", "anonymous");
    const proxiedURL = config.corsProxyBaseUrl + encodeURIComponent(stylesheetURL);

    try {
      // Fetch the CSS content
      const response = await fetch(proxiedURL);
      let cssContent = await response.text();

      // Proxy absolute URLs (http/https) within the CSS content
      cssContent = cssContent.replace(
        /url\(['"]?(https?:\/\/[^'")\s]+)['"]?\)/g,
        (match, url) => {
          // Skip if already proxied
          if (url.startsWith(config.corsProxyBaseUrl)) return match;
          // Otherwise return proxied URL
          return `url("${config.corsProxyBaseUrl}${encodeURIComponent(url)}")`;
        }
      );

      // Insert the parsed CSS content into a <style> element
      const styleElement = document.createElement("style");
      styleElement.textContent = cssContent;
      styleElement.setAttribute(
        "original-link-element",
        encodeURIComponent(stylesheetElement.outerHTML)
      );

      // Insert the <style> element directly after the original <link> element to easy restoration
      stylesheetElement.insertAdjacentElement("afterend", styleElement);
      stylesheetElement.remove();
      log.verbose("Proxied: ", stylesheetURL);
    } catch (error) {
      console.error("Error fetching CSS:", error);
    }
  }
}
