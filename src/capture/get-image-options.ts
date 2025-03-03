import {
  Quality,
  Label,
  Config,
  Format,
  ImageOptions,
  Scale,
  IncludeScaleInLabel,
} from "../types";

/**
 * Retrieves the image options for the given element or configuration.
 *
 * Data attributes:
 * - data-label: string
 * - data-format: "jpg" | "png" | "svg"
 * - data-scale: number | number[]
 * - data-quality: number
 * - data-include-scale-in-label: boolean
 *
 * @returns {Promise<ImageOptions>} - The parsed image options.
 */
export async function getImageOptions(
  element: HTMLElement,
  config: Config
): Promise<ImageOptions> {
  return {
    label: parseLabel(),
    format: parseFormat(),
    scale: parseScale(),
    quality: parseQuality(),
    includeScaleInLabel: parseIncludeScaleInLabel(),
  };
  /**
   * # Helper functions
   *
   * Format:
   *
   * 1. Attempt to get value from dataset
   * 2. If found, process to correct data type and return it
   * 3. If not found, return value from config
   *
   * If dataset value is invalid, returns default value.
   */

  /**
   * Parses the label property from the element's dataset.
   * If the property is not present, it returns the default value from the config.
   * If the property is present, it removes any characters that are not a-z, A-Z, 0-9, -, or _ and returns the cleaned up label.
   * If an error occurs, it returns the default value from the config.
   */
  function parseLabel(): Label {
    try {
      const label = element.dataset.label || config.defaultImageLabel;

      if (label === "") return config.defaultImageLabel;

      // Check if the label ends with '@#x'
      const endsWithSpecial = /@\d+x$/.test(label);
      let cleanedLabel = label;

      // Allowed characters: a-z, A-Z, 0-9, -, _
      // Remove all other characters using regex, except '@Nx' at the end
      const regex = /[^a-zA-Z0-9-_]/g;
      if (endsWithSpecial) {
        const match = label.match(/@\d+x$/);
        if (!match) return config.defaultImageLabel;
        cleanedLabel = label.slice(0, -match[0].length).replace(regex, "") + match[0];
      } else {
        cleanedLabel = label.replace(regex, "");
      }

      return cleanedLabel;
    } catch (error) {
      console.error(error);
      return config.defaultImageLabel;
    }
  }

  /**
   * Parses the format property from the element's dataset.
   * If the property is not present, it returns the default value from the config.
   * If the property is present, it checks if it's a valid format (jpg, png, or svg) and returns it.
   * If the value is not valid, it throws an error and returns the default value from the config.
   */
  function parseFormat(): Format {
    try {
      let format = element.dataset.format || config.format;
      format = format.trim().toLowerCase();
      if (format === "jpg" || format === "png" || format === "svg" || format === "webp") {
        return format;
      } else {
        throw new Error(
          `ImageExporter: provided format is not valid.
            Provided: ${format}
            Element: ${element}
            Accepted values: jpg, png, svg, 
            Defaulting to: ${config.format}`
        );
      }
    } catch (error) {
      console.error(error);
      return config.format;
    }
  }

  /**
   * Parses the scale property from the element's dataset.
   * If the property is not present, it returns the default value from the config.
   * If the property is present, it checks if it's a valid number or a comma-separated list of numbers and returns it.
   * If the value is not valid, it throws an error and returns the default value from the config.
   */
  function parseScale(): Scale {
    try {
      const scaleAsString = element.dataset.scale;
      if (!scaleAsString) return config.scale;
      if (scaleAsString.includes(",")) {
        const scales = scaleAsString
          .trim()
          .split(",")
          .map((scale) => parseFloat(scale));
        if (scales.some((scale) => isNaN(scale))) {
          throw new Error(
            `ImageExporter: provided scale is not valid.
            Provided: ${scaleAsString}
            Element: ${element}
            Accepted values: number or csv numbers e.g. (1,2)
            Defaulting to ${config.scale}`
          );
        }
        return scales;
      } else {
        const scaleAsNumber = parseFloat(scaleAsString.trim());
        if (isNaN(scaleAsNumber)) {
          throw new Error(
            `ImageExporter: provided scale is not valid.
            Provided: ${scaleAsString}
            Element: ${element}
            Accepted values: number or csv numbers e.g. (1,2)
            Defaulting to: ${config.scale}`
          );
        }
        return scaleAsNumber;
      }
    } catch (error) {
      console.error(error);
      return config.scale;
    }
  }

  /**
   * Parses the quality property from the element's dataset.
   * If the property is not present, it returns the default value from the config.
   * If the property is present, it checks if it's a valid number and returns it.
   * If the value is not valid, it throws an error and returns the default value from the config.
   */
  function parseQuality(): Quality {
    try {
      const qualityAsString = element.dataset.quality;
      if (!qualityAsString) return config.quality;
      const qualityAsNumber = parseFloat(qualityAsString.trim());
      if (isNaN(qualityAsNumber)) {
        throw new Error(
          `ImageExporter: provided quality is not valid.
            Provided: ${qualityAsString}
            Element: ${element}
            Accepted values: number
            Defaulting to: ${config.quality}`
        );
      }
      return qualityAsNumber;
    } catch (error) {
      console.error(error);
      return config.quality;
    }
  }

  /**
   * Parses the includeScaleInLabel property from the element's dataset.
   * If the property is not present, it returns the default value from the config.
   * If the property is present, it checks if it's a valid value (true or false) and returns it.
   * If the value is not valid, it throws an error and returns the default value from the config.
   */
  function parseIncludeScaleInLabel(): IncludeScaleInLabel {
    try {
      let includeScaleInLabel = element.dataset.includeScaleInLabel;
      if (!includeScaleInLabel) return config.includeScaleInLabel;

      includeScaleInLabel = includeScaleInLabel.trim();

      if (includeScaleInLabel === "true" || includeScaleInLabel === "false") {
        return includeScaleInLabel === "true";
      } else {
        throw new Error(
          `ImageExporter: provided includeScaleInLabel is not valid.
            Provided: ${includeScaleInLabel}
            Element: ${element}
            Accepted values: true or false
            Defaulting to: ${config.includeScaleInLabel}`
        );
      }
    } catch (error) {
      console.error(error);
      return config.includeScaleInLabel;
    }
  }
}
