// Helper function to check if a URL is valid and not a data URL
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);

    // Check if the URL is a data URL
    if (url.protocol === "data:") {
      return false;
    }

    // Optionally, check for HTTP and HTTPS protocols specifically
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}
