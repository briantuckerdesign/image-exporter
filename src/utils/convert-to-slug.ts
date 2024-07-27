/**
 * Converts a given string to a URL-friendly slug.
 *
 * @param input - The string to be converted to a slug.
 * @returns The input string transformed into a slug format.
 */
export function convertToSlug(input: string) {
  if (!input) {
    return null;
  }
  input = input.toLowerCase();
  input = input.replace(/[^a-z0-9_@ -]/g, "");
  input = input.replace(/\s+/g, "-");
  return input;
}
