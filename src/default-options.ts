import * as types from "./types";

export const defaultOptions: types.Options = {
  corsProxyBaseUrl: "",
  downloadImages: true,
  selectors: {
    wrapper: "[ie='wrapper']",
    capture: "[ie='capture']",
    trigger: "[ie='trigger']",
    slug: "[ie='slug']",
    ignore: "[ie='ignore']",
  },
  image: {
    scale: {
      value: 1,
      attributeSelector: "ie-scale",
      inputSelector: "ie-scale-input",
    },
    quality: {
      value: 1,
      attributeSelector: "ie-quality",
      inputSelector: "ie-quality-input",
    },
    format: {
      value: "jpg",
      attributeSelector: "ie-format",
      inputSelector: "ie-format-input",
    },
    dateInLabel: {
      value: true,
      attributeSelector: "ie-img-label-date",
      inputSelector: "ie-img-label-date-input",
    },
    scaleInLabel: {
      value: true,
      attributeSelector: "ie-img-label-scale",
      inputSelector: "ie-img-label-scale-input",
    },
  },
  zip: {
    label: {
      value: "images",
      attributeSelector: "ie-zip-label",
      inputSelector: "ie-zip-label-input",
    },
    dateInLabel: {
      value: true,
      attributeSelector: "ie-zip-label-date",
      inputSelector: "ie-zip-label-date-input",
    },
    scaleInLabel: {
      value: true,
      attributeSelector: "ie-zip-label-scale",
      inputSelector: "ie-zip-label-scale-input",
    },
  },
  debug: false,
};
