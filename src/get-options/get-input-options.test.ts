import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer from "puppeteer";
import path from "path";
import * as types from "../types";
import { defaultOptions } from "../default-options";

describe("get-input-options", () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Setup for puppeteer with Vitest
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname, "get-input-options.test.html")}`);
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

      return (window as any).getInputOptionsDebug;
    });

    // Assertions can then be made based on the result object
    expect(result.image.scale.value).toBe(5);
    expect(result.image.quality.value).toBe(0.75);
    expect(result.image.format.value).toBe("jpg");
    expect(result.image.dateInLabel.value).toBe(true);
    expect(result.image.scaleInLabel.value).toBe(true);
    expect(result.zip.label.value).toBe("ie");
    expect(result.zip.dateInLabel.value).toBe(true);
    expect(result.zip.scaleInLabel.value).toBe(true);
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
              inputSelector: "test-scale-input",
            },
            quality: {
              inputSelector: "test-quality-input",
            },
            format: {
              inputSelector: "test-format-input",
            },
            dateInLabel: {
              inputSelector: "test-img-label-date-input",
            },
            scaleInLabel: {
              inputSelector: "test-img-label-scale-input",
            },
          },
          zip: {
            label: {
              inputSelector: "test-zip-label-input",
            },
            dateInLabel: {
              inputSelector: "test-zip-label-date-input",
            },
            scaleInLabel: {
              inputSelector: "test-zip-label-scale-input",
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

      return (window as any).getInputOptionsDebug;
    });

    // Assertions can then be made based on the result object
    expect(result.image.scale.value).toBe(5);
    expect(result.image.quality.value).toBe(0.75);
    expect(result.image.format.value).toBe("jpg");
    expect(result.image.dateInLabel.value).toBe(true);
    expect(result.image.scaleInLabel.value).toBe(true);
    expect(result.zip.label.value).toBe("ie");
    expect(result.zip.dateInLabel.value).toBe(true);
    expect(result.zip.scaleInLabel.value).toBe(true);
  });
});
