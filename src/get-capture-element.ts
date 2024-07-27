import * as types from "./types";
import { isVisible } from "./utils/is-visible";
import { pushToWindow } from "./utils/push-to-window";

// Finds all elements to be captured and returns them in an array
export function getCaptureElements(options: types.Options): HTMLElement[] {
  try {
    if (!document.querySelector(options.selectors.capture)) {
      console.error("ImageExporter: No capture items found in the wrapper.");
      return [];
    }

    // If CSV values found in scale attribute, encapsulate elements until all scales are accounted for
    findMultiScaleElements(options);

    // Find all elements to be captured (which includes the multi-scale elements)
    const elements = Array.from(
      document.querySelectorAll(
        `${options.selectors.wrapper} ${options.selectors.capture}`
      ) as NodeListOf<HTMLElement>
    );

    // Filter out elements that are not visible
    const visibleElements = elements.filter((element) => isVisible(element));

    return visibleElements;
  } catch (e) {
    console.error("ImageExporter: Error in getCaptureElements", e);
    return [];
  }
}

// If CSV values found in ${prefix}-scale, encapsulate elements until all scales are accounted for
export function findMultiScaleElements(options: types.Options) {
  try {
    const elements = Array.from(
      document.querySelectorAll(
        `${options.selectors.wrapper} ${options.selectors.capture}`
      ) as NodeListOf<HTMLElement>
    );
    if (elements) {
      const elementsWithScaleAttribute = elements.filter((element) =>
        element.hasAttribute(options.image.scale.attributeSelector)
      );

      // Check attribute value. It will be a string.
      // If string successfully converts to a number, do nothing.
      // If string is comma-separated, convert to array of numbers.
      elementsWithScaleAttribute.forEach((element) => {
        const scaleValue: any = element.getAttribute(
          options.image.scale.attributeSelector
        );

        if (scaleValue.includes(",")) {
          console.log("Multi-scale element found:", scaleValue);
          // If scaleValue is an array...
          const scaleArray: Array<Number> = scaleValue.split(",").map(Number);

          encapsulateMultiScaleElements(options, element, scaleArray, scaleValue);
          if (options.debug)
            pushToWindow("findMultiScaleElementsTest", element.outerHTML);
        }
      });
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error("ImageExporter: Error in findMultiScaleElements", e);
    return;
  }
}

function encapsulateMultiScaleElements(
  options: types.Options,
  element: Element,
  scaleArray: Array<Number>,
  scaleValue: string
) {
  try {
    // Set scale attribute
    element.setAttribute(options.image.scale.attributeSelector, scaleArray[0].toString());
    // Force include scale img attribute
    element.setAttribute(options.image.scaleInLabel.attributeSelector, "true");
    element.setAttribute("ie-clone-source", scaleValue);

    // iterate through array and wrap the element in a new element for each scale
    for (let i = 1; i < scaleArray.length; i++) {
      const newElement = cloneElementAttributes(options, element);
      // Set scale attribute
      newElement.setAttribute(
        options.image.scale.attributeSelector,
        scaleArray[i].toString()
      );
      // Force include scale img attribute
      newElement.setAttribute(options.image.scaleInLabel.attributeSelector, "true");
      // Insert element before the original element, then move the original element inside the new element, deleting the original element
      if (element.parentNode) {
        element.parentNode.insertBefore(newElement, element);
        newElement.appendChild(element);
        console.log("Encapsulated element", element, "with scale", scaleArray[i]);
      }
    }
  } catch (e) {
    console.error("ImageExporter: Error in encapsulateMultiScaleElements", e);
    return;
  }
}

// only clones attributes that are in the options.image[key].attributeSelector
function cloneElementAttributes(
  options: types.Options,
  originalElement: Element
): Element {
  try {
    // Create a new div element
    const clonedElement = document.createElement("div");

    const arrayOfPossibleAttributes = Object.keys(options.image).map(
      (key) => options.image[key].attributeSelector
    );

    // Adds capture attribute to cloned element
    const { prefix, value } = parseStringAttribute(options.selectors.capture);
    clonedElement.setAttribute(prefix, value);
    clonedElement.setAttribute("ie-clone", "true");
    setExplicitDimensions(originalElement, clonedElement);

    // Iterate over all attributes of the original element
    Array.from(originalElement.attributes).forEach((attr: any) => {
      // Check if the attribute name exists in types.Attributes
      if (attr.name in arrayOfPossibleAttributes) {
        // Copy the attribute to the cloned element
        clonedElement.setAttribute(attr.name, attr.value);
      }
    });

    return clonedElement;
  } catch (e) {
    console.error("ImageExporter: Error in cloneElementAttributes", e);
    return originalElement;
  }
}

function parseStringAttribute(attributeValue: string) {
  if (!attributeValue.includes("=")) {
    throw new Error("Invalid attribute format. Expected format: [prefix=value]");
  }

  const attributeArray = attributeValue.split("=");
  if (attributeArray.length !== 2) {
    throw new Error("Invalid attribute format. Expected format: [prefix=value]");
  }

  const prefix = attributeArray[0].trim().replace(/^\[|\]$/g, "");
  const value = attributeArray[1]
    .trim()
    .replace(/^\[|\]$/g, "")
    .replace(/^'|'$/g, "");

  if (!prefix || !value) {
    throw new Error("Invalid attribute format. Prefix or value is missing.");
  }

  return { prefix, value };
}

function setExplicitDimensions(originalElement: any, clonedElement: any) {
  const originalElementStyle = window.getComputedStyle(originalElement);
  const originalElementWidth = originalElementStyle.getPropertyValue("width");
  const originalElementHeight = originalElementStyle.getPropertyValue("height");

  clonedElement.style.width = originalElementWidth;
  clonedElement.style.height = originalElementHeight;
}
