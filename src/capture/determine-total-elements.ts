import { Config } from "../types";

/**
 * determineTotalElements
 *
 * Computes how many captures will occur across all elements, so progress
 * logging reflects multi-scale captures (not just elements.length).
 *
 * Each element produces at least one capture. A `data-scale` comma-list
 * produces one capture per scale. An element with no (or an invalid)
 * `data-scale` falls back to `config.scale`, mirroring `getImageOptions`.
 */
export async function determineTotalElements(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  config: Config,
): Promise<number> {
  try {
    let totalElements = 0;
    for (const element of Array.from(elements)) {
      totalElements += countScalesForElement(element, config);
    }
    return totalElements;
  } catch {
    return 1;
  }
}

/** Number of captures a single element will produce. */
function countScalesForElement(element: HTMLElement, config: Config): number {
  const scaleAsString = element.dataset.scale;

  // No override: use the configured default scale.
  if (!scaleAsString) return countConfigScale(config);

  if (scaleAsString.includes(",")) {
    const scales = scaleAsString
      .trim()
      .split(",")
      .map((scale) => parseFloat(scale));
    // Invalid list -> getImageOptions falls back to config.scale.
    if (scales.some((scale) => isNaN(scale))) return countConfigScale(config);
    return scales.length;
  }

  const scaleAsNumber = parseFloat(scaleAsString.trim());
  // Invalid single value -> getImageOptions falls back to config.scale.
  if (isNaN(scaleAsNumber)) return countConfigScale(config);
  return 1;
}

/** Captures implied by the config's default scale (array => one per scale). */
function countConfigScale(config: Config): number {
  return Array.isArray(config.scale) ? config.scale.length : 1;
}
