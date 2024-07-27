import * as types from "../types";
import { pushToWindow } from "../utils/push-to-window";
import { optionSafetyCheck } from "./get-wrapper-options";

// Helper function to handle common logic
async function handleOptions(optionsType: any, key: string) {
  const selector = optionsType[key].inputSelector;

  const inputElement = document.querySelector(`[${selector}]`) as HTMLInputElement;
  if (!inputElement) return;

  if (inputElement.getAttribute("type") === "checkbox") {
    optionsType[key].value = inputElement.checked;
    return;
  }

  if (inputElement.value) {
    const safeValue = optionSafetyCheck(key, inputElement.value);
    if (safeValue === null) return;

    optionsType[key].value = safeValue;
  }
}

export function getInputOptions(options: types.Options): types.Options {
  try {
    // Use the helper function for both 'image' and 'zip' options
    Promise.all(
      Object.keys(options.image).map((key) => handleOptions(options.image, key))
    );
    Promise.all(Object.keys(options.zip).map((key) => handleOptions(options.zip, key)));

    if (options.debug) pushToWindow("getInputOptionsDebug", options);

    return options;
  } catch (e) {
    console.error("ImageExporter: Error in getUserOptions", e);
    return options;
  }
}
