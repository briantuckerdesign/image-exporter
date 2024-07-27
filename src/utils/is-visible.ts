/**
 * Determines if a given element is currently visible on the page.
 *
 * @param element - The DOM element to check for visibility.
 * @returns True if the element is visible, false otherwise.
 */
export function isVisible(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (element.offsetParent === null) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}
