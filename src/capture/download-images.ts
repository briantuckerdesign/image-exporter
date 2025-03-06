import { Config, Image, Label } from "../types";
import download from "downloadjs";
import JSZip from "jszip";
import { defaultConfig } from "../config";

/**
 * downloadImages
 *
 * If one image is provided, it will be downloaded as a file.
 *
 * If multiple images are provided, they will be zipped and downloaded as a file.
 */
export async function downloadImages(
  images: Image[],
  userConfig: Config = defaultConfig
) {
  const config = userConfig ? { ...defaultConfig, ...userConfig } : defaultConfig;

  // Ensure unique filenames before downloading
  const uniqueImages = ensureUniqueFileNames(images);

  if (uniqueImages.length === 1) {
    const image = uniqueImages[0];
    await download(image.dataURL, image.fileName);
  } else if (uniqueImages.length > 1) {
    const imagesBlob = await zipUpImages(uniqueImages);
    if (imagesBlob) await download(imagesBlob, parseLabel(config));
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
    // Loop through each image tuple and add to the zip
    images.forEach((image) => {
      // Extract the content from the data URL
      const content = image.dataURL.split(",")[1]; // Assumes base64 encoding
      zip.file(image.fileName, content, { base64: true });
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
 * before the file extension.
 */
function ensureUniqueFileNames(images: Image[]): Image[] {
  const fileNameMap = new Map<string, number>();

  return images.map((image) => {
    const { fileName } = image;

    // Split the filename into base and extension
    const lastDotIndex = fileName.lastIndexOf(".");
    const baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";

    // Check if this base filename has been seen before
    if (!fileNameMap.has(fileName)) {
      fileNameMap.set(fileName, 1);
      return image;
    }

    // If it's a duplicate, increment the counter and create a new filename
    const count = fileNameMap.get(fileName)! + 1;
    fileNameMap.set(fileName, count);

    // Create new filename with -2, -3, etc. before the extension
    const newFileName = `${baseName}-${count}${extension}`;

    // Return a new image object with the updated filename
    return {
      ...image,
      fileName: newFileName,
    };
  });
}
