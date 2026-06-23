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
  userConfig: Partial<Config> = defaultConfig
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
        originalLength - elements.length
      );
    log.verbose("Element to capture", elements.length);

    /* ------------------------------- CORS proxy ------------------------------- */
    if (userConfig.corsProxyBaseUrl) await corsProxy.run(config, elements);

    /* --------------------------------- Capture -------------------------------- */
    let images: Image[] = [];
    const seen = new Set<string>();
    let imageNumber = 1;

    for (const element of elements) {
      const imageOptions = await getImageOptions(element, config);
      log.verbose("Image options", imageOptions);

      if (imageOptions.scale instanceof Array) {
        /* --------------------------- Multi-scale capture -------------------------- */
        log.verbose("Multi-scale capture");

        imageOptions.includeScaleInLabel = true;

        for (const scale of imageOptions.scale) {
          log.progress(imageNumber++, totalElements);
          const image = await captureElement(
            element,
            { ...imageOptions, scale: scale } as ParsedImageOptions,
            seen
          );

          images.push(image);
        }
      } else if (typeof imageOptions.scale === "number") {
        log.progress(imageNumber++, totalElements);
        /* -------------------------- Single scale capture -------------------------- */
        log.verbose("Single-scale capture");

        const image = await captureElement(
          element,
          imageOptions as ParsedImageOptions,
          seen
        );

        images.push(image);
      }
    }

    /* -------------------------------- Download -------------------------------- */
    if (config.downloadImages) await downloadImages(images, config);

    /* --------------------------- Clean up CORS proxy -------------------------- */
    if (userConfig.corsProxyBaseUrl) await corsProxy.cleanUp();

    /** Return images optionally */
    return images;
  } catch (error) {
    log.error(error);
    return null;
  } finally {
    log.group.close();
  }
}
