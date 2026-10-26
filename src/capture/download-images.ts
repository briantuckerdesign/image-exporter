import { Config, Image, Label } from "../types";
import { downloadZip } from "client-zip";
import { defaultConfig } from "../config";
import { dataUrlToBlob } from "./data-url-to-blob";
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
export async function zipUpImages(images: Image[]): Promise<Blob | undefined> {
  let files: { name: string; input: Blob }[];

  try {
    // Prefer the Blob if present. dataUrlToBlob decodes with atob rather than
    // fetch(dataURL), which a host page CSP can block, and also handles
    // URL-encoded (non-base64) SVG data URLs.
    files = images.map((image) => ({
      name: image.fileName,
      input: image.blob ?? dataUrlToBlob(image.dataURL),
    }));
  } catch (error) {
    console.error("Image Exporter - Error adding images to ZIP:", error);
    return;
  }

  try {
    // Generate the ZIP file. Not every runtime types a Response's Blob from its
    // Content-Type header, so set it explicitly.
    const zip = await downloadZip(files).blob();
    return new Blob([zip], { type: "application/zip" });
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
