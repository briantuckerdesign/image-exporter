import { ImageOptions, Label } from "../types";

/**
 * Handles the generation of unique filenames based on a proposed filename and an array of existing filenames.
 *
 * If the proposed filename is unique, it is added to the filenames array and returned as-is.
 * If the proposed filename is not unique, the function will check if it already ends with a "-n" pattern.
 * If it does, the function will increment the number until a unique filename is found.
 * If it doesn't, the function will start with "-2" and increment the number until a unique filename is found.
 */
export function handleFileNames(imageOptions: ImageOptions, filenames: string[]): Label {
  // Finish alterting filenames before checking for uniqueness
  let proposedFilename = imageOptions.label;
  // Add scale to filename if includeScaleInLabel is true
  if (imageOptions.includeScaleInLabel) proposedFilename += `_@${imageOptions.scale}x`;
  // Add format to filename last
  proposedFilename += `.${imageOptions.format}`;

  // If filename is unique, add it to array and return as-is
  if (!filenames.includes(proposedFilename)) {
    filenames.push(proposedFilename);
    return proposedFilename;
  }

  // Check if filename already ends with -n pattern
  const numberPattern = /-(\d+)$/;
  const match = proposedFilename.match(numberPattern);

  if (match) {
    // File ends with -n, increment the number until we find a unique name
    const baseFilename = proposedFilename.replace(numberPattern, "");
    let counter = parseInt(match[1], 10);

    while (filenames.includes(`${baseFilename}-${counter}`)) {
      counter++;
    }

    const newFilename = `${baseFilename}-${counter}`;
    filenames.push(newFilename);
    return newFilename;
  } else {
    // File doesn't end with -n, start with -1 and increment if needed
    let counter = 2;
    while (filenames.includes(`${proposedFilename}-${counter}`)) {
      counter++;
    }

    const newFilename = `${proposedFilename}-${counter}`;
    filenames.push(newFilename);
    return newFilename;
  }
}
