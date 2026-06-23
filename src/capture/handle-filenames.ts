import { ImageOptions, Label } from "../types";
import { makeUnique } from "./make-unique";

/**
 * handleFileNames
 *
 * Builds the filename for an image from its options (label + optional scale +
 * format extension), then ensures it is unique against `seen` via the shared
 * `makeUnique` helper.
 */
export function handleFileNames(imageOptions: ImageOptions, seen: Set<string>): Label {
  let proposedFilename = imageOptions.label;
  // Add scale to filename if includeScaleInLabel is true
  if (imageOptions.includeScaleInLabel) proposedFilename += `_@${imageOptions.scale}x`;
  // Add format extension last
  proposedFilename += `.${imageOptions.format}`;

  return makeUnique(proposedFilename, seen);
}
