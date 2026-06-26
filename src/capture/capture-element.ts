import { Image, ParsedImageOptions } from "../types";
import { handleFileNames } from "./handle-filenames";
import * as modernScreenshot from "modern-screenshot";

/**
 * captureElement
 *
 * Captures an image from an HTML element and returns it.
 */
export async function captureElement(
  element: HTMLElement,
  imageOptions: ParsedImageOptions,
  seen: Set<string>,
  screenshotOptions?: Partial<modernScreenshot.Options>,
): Promise<Image> {
  // If element has no background and is a JPG, default to white background.
  // Tracked outside the try so it can be restored in finally even on failure.
  let cleanUpBackground = false;
  try {
    let dataURL = "";
    // Final settings for capturing images. User-provided screenshotOptions are
    // applied first; our managed values (scale/quality/filter) take precedence.
    const userFilter = screenshotOptions?.filter;
    const htmlToImageOptions: modernScreenshot.Options = {
      ...screenshotOptions,
      // Ensure quality is a number
      quality: imageOptions.quality,
      // Ensure scale is a number
      scale: imageOptions.scale,
      // Ignore data-ignore-capture elements, AND honour any user filter.
      filter: (node) => filter(node) && (userFilter ? userFilter(node) : true),
    };

    const styles = getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const backgroundImage = styles.backgroundImage;
    if (
      backgroundColor === "rgba(0, 0, 0, 0)" &&
      backgroundImage === "none" &&
      imageOptions.format === "jpg"
    ) {
      element.style.backgroundColor = "#FFFFFF";
      cleanUpBackground = true;
    }

    // Captures image based on format
    switch (imageOptions.format) {
      case "jpg":
        dataURL = await modernScreenshot.domToJpeg(element, htmlToImageOptions);
        break;
      case "png":
        dataURL = await modernScreenshot.domToPng(element, htmlToImageOptions);
        break;
      case "svg":
        dataURL = await modernScreenshot.domToSvg(element, htmlToImageOptions);
        break;
      case "webp":
        dataURL = await modernScreenshot.domToWebp(element, htmlToImageOptions);
        break;
    }

    return {
      dataURL,
      fileName: handleFileNames(imageOptions, seen),
    };
  } catch (error) {
    // Do NOT swallow into an empty image — that produces a corrupt download.
    // Rethrow with context so the caller can skip + log this element.
    throw new Error(
      `ImageExporter: failed to capture element as ${imageOptions.format}`,
      { cause: error },
    );
  } finally {
    if (cleanUpBackground) {
      element.style.backgroundColor = "";
      element.style.backgroundImage = "";
    }
  }
}

const filter = (node: Node) => {
  // Check if the node is an HTMLElement
  if (node instanceof HTMLElement) {
    return !node.hasAttribute("data-ignore-capture");
  }
  // If not an HTMLElement, return true to include the node
  return true;
};
