import { captureElement } from "./capture-element";
import { downloadImages } from "./download-images";
import { corsProxy } from "../cors-proxy";
import { Config, Image, ParsedImageOptions } from "../types";
import { getImageOptions } from "./get-image-options";
import { defaultConfig } from "../config";
import { removeHiddenElements } from "./remove-hidden-elements";
import { log } from "../logger";
import { determineTotalElements } from "./determine-total-elements";

export let windowLogging = true;
export let loggingLevel = "none";

/**
 * capture
 *
 * Captures images from HTML elements and returns them or downloads them.
 */
export async function capture(
  elements: HTMLElement[] | NodeListOf<HTMLElement> | HTMLElement,
  userConfig: Partial<Config> = defaultConfig,
): Promise<Image[] | null> {
  log.group.open("image-exporter");
  try {
    /* --------------------------------- Config --------------------------------- */
    const config = { ...defaultConfig, ...userConfig };
    windowLogging = config.enableWindowLogging;
    loggingLevel = config.loggingLevel;
    log.verbose("config", config);

    /** If the user provided a single element, convert it to an array */
    if (elements instanceof HTMLElement) elements = [elements];
    const originalLength = elements.length;
    elements = removeHiddenElements(elements);

    const totalElements = await determineTotalElements(elements, config);

    if (originalLength !== elements.length)
      log.verbose(
        "Skipping capture of hidden elements: ",
        originalLength - elements.length,
      );
    log.verbose("Element to capture", elements.length);

    /* ------------------------------- CORS proxy ------------------------------- */
    if (userConfig.corsProxyBaseUrl) await corsProxy.run(config, elements);

    /* --------------------------------- Capture -------------------------------- */
    const images: Image[] = [];
    const seen = new Set<string>();
    let imageNumber = 1;

    /**
     * Captures one element+scale, pushing the result on success. On failure it
     * logs and skips so one bad element can't abort the batch or emit a corrupt
     * (empty) image into the results.
     */
    const tryCapture = async (
      element: HTMLElement,
      options: ParsedImageOptions,
    ): Promise<void> => {
      log.progress(imageNumber++, totalElements);
      try {
        images.push(await captureElement(element, options, seen));
      } catch (error) {
        log.error(error);
      }
    };

    for (const element of elements) {
      const imageOptions = await getImageOptions(element, config);
      log.verbose("Image options", imageOptions);

      if (imageOptions.scale instanceof Array) {
        /* --------------------------- Multi-scale capture -------------------------- */
        log.verbose("Multi-scale capture");

        imageOptions.includeScaleInLabel = true;

        for (const scale of imageOptions.scale) {
          await tryCapture(element, {
            ...imageOptions,
            scale,
          } as ParsedImageOptions);
        }
      } else if (typeof imageOptions.scale === "number") {
        /* -------------------------- Single scale capture -------------------------- */
        log.verbose("Single-scale capture");

        await tryCapture(element, imageOptions as ParsedImageOptions);
      }
    }

    /* -------------------------------- Download -------------------------------- */
    if (config.downloadImages) await downloadImages(images, config);

    /** Return images optionally */
    return images;
  } catch (error) {
    log.error(error);
    return null;
  } finally {
    /* --------------------------- Clean up CORS proxy -------------------------- */
    // In finally so the live DOM is always restored, even if capture threw
    // after the proxy mutated it.
    if (userConfig.corsProxyBaseUrl) await corsProxy.cleanUp();
    log.group.close();
  }
}
