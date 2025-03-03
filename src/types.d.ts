export interface ImageOptions {
  /** Label for image. Does not include file extension or scale. */
  label: Label;
  /** File format, jpg, png, or svg. */
  format: Format;
  /** Scale of image. Can be a number or a comma-separated list of numbers. */
  scale: Scale;
  /** Quality of image. 0.0 to 1.0, only applies to jpg.*/
  quality: Quality;
  /** Include scale in label. True or false. Automatically true if scale is an array. */
  includeScaleInLabel: IncludeScaleInLabel;
}

export interface Config extends ImageOptions {
  /** Download images as files upon capture. */
  downloadImages: boolean;
  /** Default label for images. Does not include file extension or scale. */
  defaultImageLabel: string;
  /** Label for zip file. Does not include file extension or scale. */
  zipLabel: Label;
  /** Base URL for CORS proxy used when fetching external images.
   *
   * URLs will be encoded and appended without a `?`. Include your own trailing slash.
   *
   * I recommend [cors-proxy-worker](https://github.com/briantuckerdesign/cors-proxy-worker) for production and [local-cors-proxy-encoded](https://github.com/briantuckerdesign/local-cors-proxy-encoded) for development.
   *
   * Example: `https://cors-proxy.com/` -> `https://cors-proxy.com/https%3A%2F%2FmyEncodedUrl.com`
   */
  corsProxyBaseUrl: string;
  /** Enable window logging for use by external scripts. */
  enableWindowLogging: boolean;
  /** Enable verbose logging for debugging. */
  loggingLevel: "none" | "info" | "error" | "verbose";
}

export interface ParsedImageOptions extends ImageOptions {
  /** After parsing, this will always be a number rather than possibly an array. */
  scale: number;
}

export interface Image {
  dataURL: string;
  fileName: string;
}

export type Label = string;
export type Format = "jpg" | "png" | "svg";
export type Scale = number | number[];
export type Quality = number;
export type IncludeScaleInLabel = boolean;
