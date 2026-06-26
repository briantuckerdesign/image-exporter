import { Image } from "../types";
import { dataUrlToBlob } from "./data-url-to-blob";

/**
 * copyImageToClipboard
 *
 * Copies a single captured image to the system clipboard. Must be called from a
 * user gesture (click/keypress) due to browser security. The clipboard holds
 * one image at a time, so pass the specific image you want to copy.
 *
 * Note: browsers most reliably support `image/png` on the clipboard — capture
 * with `format: "png"` for best compatibility.
 */
export async function copyImageToClipboard(image: Image): Promise<void> {
  const blob = image.blob ?? dataUrlToBlob(image.dataURL);
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}
