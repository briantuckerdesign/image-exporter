import * as types from "../types";
import { pushToWindow } from "../utils/push-to-window";

/**
 * Retrieves and updates the options based on the attributes of the wrapper element.
 *
 * This function queries the DOM for the wrapper element specified in the options.
 * If the wrapper element is found, it iterates over the image settings and updates
 * them with the values provided in the wrapper element's attributes.
 *
 * @param {types.Options} options - The initial settings object, which may contain default settings.
 * @returns {types.Options} The updated settings object with values from the wrapper element.
 */
export function getWrapperOptions(options: types.Options): types.Options {
  try {
    const wrapper = document.querySelector(options.selectors.wrapper) as HTMLElement;

    if (!wrapper) {
      new Error("Wrapper element not found");
      return options;
    }

    // For each image setting, see if value is provided in the wrapper element
    // If so, update that setting with the new value
    Object.keys(options.image).forEach((key) => {
      const attrValue = wrapper.getAttribute(options.image[key].attributeSelector);
      if (attrValue !== null) {
        const safeValue = optionSafetyCheck(key, attrValue);
        if (safeValue === null) return;
        options.image[key].value = safeValue;
      }
    });

    Object.keys(options.zip).forEach((key) => {
      const attrValue = wrapper.getAttribute(options.zip[key].attributeSelector);
      if (attrValue !== null) {
        const safeValue = optionSafetyCheck(key, attrValue);
        if (safeValue === null) return;
        options.zip[key].value = safeValue;
      }
    });

    if (options.debug) pushToWindow("getWrapperOptionsDebug", options);

    return options;
  } catch (e) {
    console.error("ImageExporter: Error in getWrapperOptions", e);
    return options;
  }
}

/**
 * Validates and converts the provided value based on the key.
 */
export function optionSafetyCheck(key: string, value: any): any {
  // Handle checkbox inputs
  if (value === "on") return true;
  if (value === "off") return false;

  // Handle number inputs
  if (key === "scale" || key === "quality") {
    if (typeof value === "number") return value;
    value = value.trim();
    value = parseFloat(value);
    if (isNaN(value)) return null;

    return value;
  }
  // Handle boolean inputs
  if (key === "dateInLabel" || key === "scaleInLabel") {
    if (typeof value === "boolean") return value;
    value = value.trim();

    return value === "true";
  }
  // Handle image format
  if (key === "format") {
    value = value.trim();
    if (value === "jpg" || value === "png") return value;

    return null;
  }
  return value;
}
