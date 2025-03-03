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
  filenames: string[]
): Promise<Image> {
  try {
    let dataURL = "";
    // Final settings for capturing images.
    let htmlToImageOptions: modernScreenshot.Options = {
      // Ensure quality is a number
      quality: imageOptions.quality,
      // Ensure scale is a number
      scale: imageOptions.scale,
      // Ignores elements with data-ignore-capture attribute
      filter: filter,
    };

    // If element has no background and is a JPG, default to white background
    const styles = getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const backgroundImage = styles.backgroundImage;
    let cleanUpBackground = false;
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

    if (cleanUpBackground) {
      element.style.backgroundColor = "";
      element.style.backgroundImage = "";
    }

    return {
      dataURL,
      fileName: handleFileNames(imageOptions, filenames),
    };
  } catch (error) {
    console.error("ImageExporter: Error in captureImage", error);
    return { dataURL: "", fileName: "" };
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
