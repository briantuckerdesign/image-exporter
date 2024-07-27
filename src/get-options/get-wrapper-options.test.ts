import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer from "puppeteer";
import path from "path";
import * as types from "../types";
import { defaultOptions } from "../default-options";

describe("get-wrapper-options", () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Setup for puppeteer with Vitest
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname, "get-wrapper-options.test.html")}`);
  });

  afterAll(async () => {
    // Teardown for puppeteer with Vitest
    await browser.close();
  });

  it("standard attributes", async () => {
    const result = await page.evaluate(() => {
      const js = `const options = { downloadImages: false, debug: true };
        const imageExporter = new ImageExporter(options);
        const images = imageExporter.captureAll();`;
      //insert at the end of the body
      const script = document.createElement("script");
      script.text = js;
      document.body.appendChild(script);

      return (window as any).getWrapperOptionsDebug;
    });

    // Assertions can then be made based on the result object
    expect(result.image.scale.value).toBe(2);
    expect(result.image.quality.value).toBe(0.55);
    expect(result.image.format.value).toBe("png");
    expect(result.image.dateInLabel.value).toBe(false);
    expect(result.image.scaleInLabel.value).toBe(false);
    expect(result.zip.label.value).toBe("yay");
    expect(result.zip.dateInLabel.value).toBe(false);
    expect(result.zip.scaleInLabel.value).toBe(false);
  });

  it("custom attributes", async () => {
    await page.reload();
    const result = await page.evaluate(() => {
      const js = `const options = {
        downloadImages: false,
        selectors: {
          wrapper: "[test='wrapper']",
          capture: "[test='capture']",
          trigger: "[test='trigger']",
          slug: "[test='slug']",
          ignore: "[test='ignore']",
        },
        image: {
          scale: {
            attributeSelector: "test-scale",
          },
          quality: {
            attributeSelector: "test-quality",
          },
          format: {
            attributeSelector: "test-format",
          },
          dateInLabel: {
            attributeSelector: "test-img-label-date",
          },
          scaleInLabel: {
            attributeSelector: "test-img-label-scale",
          },
        },
        zip: {
          label: {
            attributeSelector: "test-zip-label",
          },
          dateInLabel: {
            attributeSelector: "test-zip-label-date",
          },
          scaleInLabel: {
            attributeSelector: "test-zip-label-scale",
          },
        },
        debug: true,
      };
        const imageExporter = new ImageExporter(options);
        const images = imageExporter.captureAll();`;
      //insert at the end of the body
      const script = document.createElement("script");
      script.text = js;
      document.body.appendChild(script);

      return (window as any).getWrapperOptionsDebug;
    });

    // Assertions can then be made based on the result object
    expect(result.image.scale.value).toBe(3);
    expect(result.image.quality.value).toBe(0.65);
    expect(result.image.format.value).toBe("png");
    expect(result.image.dateInLabel.value).toBe(false);
    expect(result.image.scaleInLabel.value).toBe(false);
    expect(result.zip.label.value).toBe("test");
    expect(result.zip.dateInLabel.value).toBe(false);
    expect(result.zip.scaleInLabel.value).toBe(false);
  });
});
