import { Config, ImageOptions } from "./types";

export const defaultImageOptions: ImageOptions = {
  label: "image",
  format: "jpg",
  scale: 1,
  quality: 1,
  includeScaleInLabel: false,
};

export const defaultConfig: Config = {
  ...defaultImageOptions,
  downloadImages: true,
  defaultImageLabel: "image",
  zipLabel: "images",
  corsProxyBaseUrl: "",
  enableWindowLogging: true,
  loggingLevel: "none",
};
