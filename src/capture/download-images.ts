import { Config, Image, Label } from "../types";
import JSZip from "jszip";
import { defaultConfig } from "../config";
import { makeUnique } from "./make-unique";

/**
 * downloadImages
 *
 * If one image is provided, it will be downloaded as a file.
 *
 * If multiple images are provided, they will be zipped and downloaded as a file.
 */
export async function downloadImages(
  images: Image[],
  userConfig: Config = defaultConfig,
) {
  const config = userConfig ? { ...defaultConfig, ...userConfig } : defaultConfig;

  // Ensure unique filenames before downloading
  const uniqueImages = ensureUniqueFileNames(images);

  if (uniqueImages.length === 1) {
    const image = uniqueImages[0];
    // Prefer the Blob when present (e.g. output: "blob" clears the dataURL).
    triggerDownload(image.blob ?? image.dataURL, image.fileName);
  } else if (uniqueImages.length > 1) {
    const imagesBlob = await zipUpImages(uniqueImages);
    if (imagesBlob) triggerDownload(imagesBlob, parseLabel(config));
  }
}

function triggerDownload(data: string | Blob, fileName: string): void {
  const url = typeof data === "string" ? data : URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof data !== "string") {
    setTimeout(() => URL.revokeObjectURL(url), 250);
  }
}

/**
 * zipUpImages
 *
 * Zips up the images and returns the zip file as a Blob.
 */
async function zipUpImages(images: Image[]): Promise<Blob | undefined> {
  const zip = new JSZip();

  try {
    // Loop through each image and add to the zip, preferring the Blob if present.
    images.forEach((image) => {
      if (image.blob) {
        zip.file(image.fileName, image.blob);
      } else {
        const content = image.dataURL.split(",")[1]; // assumes base64 encoding
        zip.file(image.fileName, content, { base64: true });
      }
    });
  } catch (error) {
    console.error("Image Exporter - Error adding images to ZIP:", error);
    return;
  }

  try {
    // Generate the ZIP file
    const imagesBlob = await zip.generateAsync({ type: "blob" });
    return imagesBlob;
  } catch (error) {
    console.error("Image Exporter - Error generating ZIP:", error);
    return;
  }
}

/**
 * parseLabel
 *
 * Parses the zip label from the config and returns a valid label.
 */
function parseLabel(config: Config): Label {
  try {
    // Replace spaces with dashes
    let label = config.zipLabel;
    label = label.replace(/\s+/g, "-");
    // Allowed characters: a-z, A-Z, 0-9, -, _
    return label.replace(/[^a-zA-Z0-9-_]/g, "");
  } catch (error) {
    console.error(error);
    return "images";
  }
}

/**
 * ensureUniqueFileNames
 *
 * Ensures all image filenames are unique by adding -2, -3, etc. to duplicates
 * before the file extension. Uses the shared `makeUnique` helper so this public
 * entry point dedups identically to capture-time naming.
 */
export function ensureUniqueFileNames(images: Image[]): Image[] {
  const seen = new Set<string>();

  return images.map((image) => {
    const fileName = makeUnique(image.fileName, seen);
    return fileName === image.fileName ? image : { ...image, fileName };
  });
}
