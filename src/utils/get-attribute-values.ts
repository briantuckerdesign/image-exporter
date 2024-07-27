import * as types from "../types";

/**
 * Option determination order:
 * 1. User input
 * 2. Item attribute
 * 3. Wrapper attribute
 * 4. Default
 *
 * Meaning wrapper overwrites default, item overwrites wrapper, and user input overwrites all.
 */

/**
 * Checks if the user provided a value via attribute on an input element.
 * If the user provided a value, it returns the value. Otherwise, it returns null.
 */
export function getUserInputValue(imageSetting: types.Setting): string | null {
  try {
    const inputElement = document.querySelector(
      imageSetting.attributeSelector
    ) as HTMLInputElement | null;

    if (inputElement) {
      return inputElement.value;
    } else return null;
  } catch (e) {
    console.error("ImageExporter: Error in getUserInputValue", e);
    return null;
  }
}

/**
 * Checks if the user provided a value via attribute on the wrapper element.
 * If the user provided a value, it returns the value. Otherwise, it returns null.
 */
export function getWrapperValue(
  options: types.Options,
  attribute: string,
  wrapperSelector: string
): string | null {
  try {
    console.log("📣 - wrapperSelector:", wrapperSelector);
    const wrapperElement = document.querySelector(wrapperSelector);
    console.log(wrapperElement ? wrapperElement.getAttribute(attribute) : null);
    return wrapperElement ? wrapperElement.getAttribute(attribute) : null;
  } catch (e) {
    console.error("ImageExporter: Error in getWrapperValue", e);
    return null;
  }
}

/**
 * Checks if the user provided a value via attribute on an item element.
 * If the user provided a value, it returns the value. Otherwise, it returns null.
 */
export function getItemValue(options: types.Options, attribute, element): string | null {
  try {
    const itemValue = element.querySelector(attribute);
    if (itemValue) {
      return itemValue;
    } else {
      return null;
    }
  } catch (e) {
    console.error("ImageExporter: Error in getItemValue", e);
    return null;
  }
}
