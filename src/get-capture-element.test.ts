import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer from "puppeteer";
import path from "path";
import * as types from "./types";
import { defaultOptions } from "./default-options";

describe("get-capture-element", () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Setup for puppeteer with Vitest
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname, "get-capture-element.test.html")}`);
  });

  afterAll(async () => {
    // Teardown for puppeteer with Vitest
    await browser.close();
  });

  it("encapsulate multi-scale", async () => {
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
  });
});
