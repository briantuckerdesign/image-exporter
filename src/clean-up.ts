import * as types from "./types";

/**
 * This function cleans up after the `findMultiScaleElements` feature.
 * It removes cloned elements and sets the `ie-scale` attribute back to the csv value.
 *
 * Eventually this may become a subfunction, with this function having more tasks.
 *
 * @param options
 * @param captureElements
 */
export function cleanUp(options: types.Options, captureElements: Element[]) {
  // Find 'ie-clone-source', if exists...
  const sourceElements = document.querySelectorAll("[ie-clone-source]");
  if (sourceElements) {
    console.log("ping");
    sourceElements.forEach((sourceElement) => {
      // Set attribute options.attributes.scale.attributeSelector to the value of 'ie-clone-source'
      const attributeValue = sourceElement.getAttribute("ie-clone-source");
      sourceElement.removeAttribute("ie-clone-source");
      if (attributeValue) {
        console.log("pong");
        sourceElement.setAttribute(options.image.scale.attributeSelector, attributeValue);
      }

      // Climb DOM to find last parent with 'ie-clone' attribute
      let parentElement = sourceElement.parentElement;
      let lastCloneParent: any = null;
      while (parentElement) {
        if (parentElement.hasAttribute("ie-clone")) {
          lastCloneParent = parentElement;
        }
        parentElement = parentElement.parentElement;
      }

      if (lastCloneParent) {
        // Move sourceElement to next sibling of the last parent with 'ie-clone' attribute
        const nextSibling = lastCloneParent.nextElementSibling;
        if (nextSibling) {
          nextSibling.parentNode.insertBefore(sourceElement, nextSibling);
        } else {
          lastCloneParent.parentNode.appendChild(sourceElement);
        }

        // Remove the last parent with 'ie-clone' attribute
        lastCloneParent.remove();
      }
    });
  }
}
