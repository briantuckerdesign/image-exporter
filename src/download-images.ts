import * as types from "./types";
import download from "downloadjs";
import JSZip from "jszip";
import { parseZipLabel } from "./utils";

/**
 * Downloads images based on the provided array of images and options.
 * If there is only one image, it is downloaded individually.
 * If there are multiple images, they are zipped and downloaded as a single file.
 *
 * @param images - An array of images to be downloaded. Each image should be represented as a tuple with the data URL and the file name.
 * @param options - Additional options for downloading the images.
 * @returns A promise that resolves when all the images are downloaded.
 */
export async function downloadImages(images: types.Image[], options: types.Options) {
  if (images.length === 1) {
    const [dataURL, fileName] = images[0];

    await download(dataURL, fileName);
  } else if (images.length > 1) {
    const zipName = parseZipLabel(options);
    const zipBlob = await zipUpImages(images);

    await download(zipBlob, zipName);
  }
}

/**
 * Zips up the given images into a single ZIP file.
 *
 * @param images - An array of image tuples, where each tuple contains the data URL and the filename.
 * @returns A Promise that resolves to the generated ZIP file as a Blob.
 * @throws If there is an error creating the ZIP file.
 */
async function zipUpImages(images: types.Image[]) {
  const zip = new JSZip();
  // Loop through each image tuple and add to the zip
  images.forEach(([dataURL, filename]) => {
    // Extract the content from the data URL
    const content = dataURL.split(",")[1]; // Assumes base64 encoding
    zip.file(filename, content, { base64: true });
  });

  try {
    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return zipBlob;
  } catch (error) {
    console.error("Error creating ZIP:", error);
    throw error;
  }
}
