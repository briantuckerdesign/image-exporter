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
    // Left to measure, modern-screenshot floors getBoundingClientRect() into the
    // canvas size. At a non-integer devicePixelRatio a 970px element measures
    // 969.997, so the image comes out a pixel short. Snap that noise ourselves;
    // a user-provided width/height still wins, and 0 lets modern-screenshot measure.
    const rect = element.getBoundingClientRect();
    const htmlToImageOptions: modernScreenshot.Options = {
      width: snapToInteger(rect.width),
      height: snapToInteger(rect.height),
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

// modern-screenshot also forces width/height onto the cloned root, so only snap
// sub-pixel measurement noise. A genuinely fractional size (a shrink-to-fit
// 200.4px button) stays as measured; rounding it down would rewrap its text.
const snapToInteger = (n: number) => {
  const rounded = Math.round(n);
  return Math.abs(n - rounded) < 0.01 ? rounded : n;
};

const filter = (node: Node) => {
  // Check if the node is an HTMLElement
  if (node instanceof HTMLElement) {
    return !node.hasAttribute("data-ignore-capture");
  }
  // If not an HTMLElement, return true to include the node
  return true;
};
