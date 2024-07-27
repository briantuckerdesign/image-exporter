import * as types from "../types";

// Return a function that checks if a node does not match the ignore selector
export function ignoreFilter(options: types.Options) {
  return (node: HTMLElement) => {
    if (!(node instanceof HTMLElement)) {
      throw new Error("The provided node is not an HTMLElement");
    }
    return !node.matches(options.selectors.ignore);
  };
}
