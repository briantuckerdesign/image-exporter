/**
 * makeUnique
 *
 * Returns a filename guaranteed not to collide with any name in `seen`, and
 * records the result in `seen`. Duplicates get a `-2`, `-3`, ... suffix before
 * the extension. If the proposed name already ends with `-n`, numbering
 * continues from there (e.g. `a-2.png` -> `a-3.png`) rather than nesting
 * (`a-2-2.png`).
 *
 * Shared by `handleFileNames` (capture time) and `downloadImages` (public
 * entry point) so both paths dedup identically.
 */
export function makeUnique(fileName: string, seen: Set<string>): string {
  if (!seen.has(fileName)) {
    seen.add(fileName);
    return fileName;
  }

  const lastDot = fileName.lastIndexOf(".");
  const base = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;
  const extension = lastDot !== -1 ? fileName.slice(lastDot) : "";

  // If the base already ends with -n, continue numbering from n + 1.
  const match = base.match(/-(\d+)$/);
  let stem = base;
  let counter = 2;
  if (match) {
    stem = base.slice(0, -match[0].length);
    counter = parseInt(match[1], 10) + 1;
  }

  let candidate = `${stem}-${counter}${extension}`;
  while (seen.has(candidate)) {
    counter++;
    candidate = `${stem}-${counter}${extension}`;
  }

  seen.add(candidate);
  return candidate;
}
