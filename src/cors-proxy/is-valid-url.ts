/**
 * isValidUrl
 *
 * Checks if a string is a valid external URL.
 */
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);

    if (url.protocol === "data:") {
      return false;
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}
