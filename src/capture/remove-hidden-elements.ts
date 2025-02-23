export function removeHiddenElements(
  elements: HTMLElement[] | NodeListOf<HTMLElement>
): HTMLElement[] {
  elements = Array.from(elements);
  return elements.filter((element) => isVisible(element));
}

function isVisible(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element);

  return (
    element.offsetParent !== null &&
    element.style.display !== "none" &&
    computedStyle.visibility === "visible" &&
    computedStyle.opacity !== "0" &&
    computedStyle.width !== "0" &&
    computedStyle.height !== "0"
  );
}
