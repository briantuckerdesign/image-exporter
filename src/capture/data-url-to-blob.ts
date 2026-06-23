/**
 * dataUrlToBlob
 *
 * Converts a data URL (base64 or URL-encoded, e.g. SVG) into a Blob, preserving
 * the MIME type. Lets callers work with binary Blobs instead of large base64
 * strings.
 */
export function dataUrlToBlob(dataURL: string): Blob {
  const commaIndex = dataURL.indexOf(",");
  const meta = dataURL.slice(0, commaIndex);
  const data = dataURL.slice(commaIndex + 1);

  const mimeMatch = meta.match(/^data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1] : "";

  if (meta.includes(";base64")) {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  // Non-base64 data URL (e.g. URL-encoded SVG).
  return new Blob([decodeURIComponent(data)], { type: mime });
}
