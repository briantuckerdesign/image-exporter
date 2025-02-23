import { log } from "../logger";
/**
 * cleanUpCorsProxy
 *
 * Restores the CSS and images to their original state.
 */
export async function cleanUpCorsProxy() {
  await restoreCSS();
  await restoreImages();
}

async function restoreCSS() {
  const styleElements = document.querySelectorAll("style[original-link-element]");

  for (let styleElement of styleElements) {
    const originalLinkElementHTML = decodeURIComponent(
      styleElement.getAttribute("original-link-element")!
    );

    // Create a temporary container to parse the HTML string
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = originalLinkElementHTML;

    // Insert the parsed HTML before the style element
    styleElement.parentNode!.insertBefore(tempContainer.firstChild!, styleElement);

    styleElement.remove();
    log.verbose("Restored: ", originalLinkElementHTML);
  }
}

async function restoreImages() {
  const imageElements = document.querySelectorAll(
    "img[original-src]"
  ) as NodeListOf<HTMLImageElement>;

  for (let imageElement of imageElements) {
    const originalSrc = imageElement.getAttribute("original-src")!;
    imageElement.src = originalSrc;
    imageElement.removeAttribute("original-src");
    log.verbose("Restored: ", originalSrc);
  }
}
