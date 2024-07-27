export interface Options {
  corsProxyBaseUrl: string;
  downloadImages: boolean;
  selectors: Selectors;
  image: ImageOptions;
  zip: ZipOptions;
  debug: boolean;
}

export interface Selectors {
  wrapper: string;
  capture: string;
  trigger: string;
  slug: string;
  ignore: string;
}

export interface ImageOptions {
  scale: NumberSetting;
  quality: NumberSetting;
  format: ImageSetting;
  dateInLabel: BooleanSetting;
  scaleInLabel: BooleanSetting;
}

export interface ZipOptions {
  label: {
    value: string;
    attributeSelector: string;
    inputSelector: string;
  };
  dateInLabel: {
    value: boolean;
    attributeSelector: string;
    inputSelector: string;
  };
  scaleInLabel: {
    value: boolean;
    attributeSelector: string;
    inputSelector: string;
  };
}

export interface ItemOptions extends Options {
  // Options +
  id: number;
  userSlug: string;
  slug: string;
  fileName: string;
}

export interface Setting {
  attributeSelector: string;
  inputSelector: string;
  value: string | number | boolean | "jpg" | "png";
}

export interface StringSetting extends Setting {
  value: string;
}
export interface NumberSetting extends Setting {
  value: number;
}
export interface BooleanSetting extends Setting {
  value: boolean;
}
export interface ImageSetting extends Setting {
  value: "jpg" | "png";
}
