import * as htmlToImage from "html-to-image";
import { Image, ParsedImageOptions } from "../types";
import { handleFileNames } from "./handle-filenames";
import { Options } from "html-to-image/lib/types";
import { get } from "http";

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
    let htmlToImageOptions: Options = {
      // Ensure quality is a number
      quality: imageOptions.quality,
      // Ensure scale is a number
      pixelRatio: imageOptions.scale,
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
        dataURL = await htmlToImage.toJpeg(element, htmlToImageOptions);
        break;
      case "png":
        dataURL = await htmlToImage.toPng(element, htmlToImageOptions);
        break;
      case "svg":
        dataURL = await htmlToImage.toSvg(element, htmlToImageOptions);
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
