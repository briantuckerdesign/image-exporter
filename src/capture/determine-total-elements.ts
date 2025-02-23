/**
 * determineTotalElements
 *
 * Just used for progress logging to show progress of all element captures.
 *
 * This emcompasses multi-scale captures unlike elements.length.
 */
export async function determineTotalElements(
  elements: HTMLElement[] | NodeListOf<HTMLElement>
): Promise<number> {
  try {
    let totalElements = 0;

    for (const element of elements) {
      const scaleAsString = element.dataset.scale;
      if (!scaleAsString) continue;

      if (scaleAsString.includes(",")) {
        const scales = scaleAsString
          .trim()
          .split(",")
          .map((scale) => parseFloat(scale));

        if (scales.some((scale) => isNaN(scale))) continue;
        totalElements += scales.length;
      } else {
        const scaleAsNumber = parseFloat(scaleAsString.trim());
        if (isNaN(scaleAsNumber)) {
          continue;
        } else {
          totalElements++;
        }
      }
    }

    return totalElements;
  } catch (error) {
    return 1;
  }
}
