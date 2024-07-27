import * as types from "../types";
import { parseImageLabel } from "../utils";

/**
 * Extracts and customizes settings for a specific element based on its attributes and additional criteria.
 *
 * This function creates a copy of the provided options object and then customizes it for an individual
 * element. It checks for specific attributes on the element (defined in the 'attributesToCheck' parameter)
 * and, if present, overwrites the corresponding properties in the options object with the attribute values.
 * Additionally, it sets a 'slug' property based on the content of a specific child element or generates a
 * unique name based on the index.
 *
 * @param {HTMLElement} element - The HTML element for which the settings are being determined.
 * @param {Object} options - The base options object that provides default settings.
 * @param {number} index - An index value, typically representing the element's position in a collection.
 * @param {Object} attributesToCheck - An object mapping option keys to attribute names to be checked on the element.
 * @returns {Object} An object containing the customized settings for the element.
 *
 */
export function getItemOptions(
  element: HTMLElement,
  options: types.Options,
  index: number
): types.ItemOptions {
  let itemOptions: types.ItemOptions = {
    ...options,
    id: index,
    userSlug: "",
    slug: "",
    fileName: "",
  };

  Object.keys(options.image).forEach((key) => {
    const attributeValue = element.getAttribute(options.image[key].attributeSelector);
    if (attributeValue !== null) {
      console.log("Capture item option:", key, "=", attributeValue);
      itemOptions.image[key].value = attributeValue;
    }
  });

  itemOptions.id = index;
  itemOptions.userSlug = element.querySelector(options.selectors.slug)?.textContent || "";
  itemOptions.slug = parseImageLabel(itemOptions);

  return itemOptions;
}
