import { test, expect, mock } from "bun:test";
import { ParsedImageOptions } from "../types";

/**
 * Bug #7: when the renderer fails, captureElement must NOT silently return an
 * empty image ({ dataURL: "", fileName: "" }) — that empty entry would get
 * zipped/downloaded as a corrupt file. It should throw so the caller can
 * handle (skip + log) it.
 */

// modern-screenshot is mocked so we control success/failure deterministically
// and can inspect the options it receives.
let shouldThrow = false;
let lastOptions: Record<string, unknown> | undefined;
mock.module("modern-screenshot", () => ({
  domToJpeg: async () => {
    if (shouldThrow) throw new Error("render failed");
    return "data:image/jpeg;base64,AAA";
  },
  domToPng: async (_el: HTMLElement, options: Record<string, unknown>) => {
    lastOptions = options;
    return "data:image/png;base64,AAA";
  },
  domToSvg: async () => "data:image/svg+xml,AAA",
  domToWebp: async () => "data:image/webp;base64,AAA",
}));

const { captureElement } = await import("./capture-element");

const opts = (format: string): ParsedImageOptions =>
  ({
    label: "a",
    format,
    scale: 1,
    quality: 1,
    includeScaleInLabel: false,
  }) as ParsedImageOptions;

test("throws when the renderer fails instead of returning an empty image", async () => {
  shouldThrow = true;
  const el = document.createElement("div");
  await expect(captureElement(el, opts("jpg"), new Set())).rejects.toThrow();
});

test("returns a valid Image on success", async () => {
  shouldThrow = false;
  const el = document.createElement("div");
  const img = await captureElement(el, opts("png"), new Set());
  expect(img.dataURL).toBe("data:image/png;base64,AAA");
  expect(img.fileName).toBe("a.png");
});

test("passes screenshotOptions through but keeps scale/quality managed", async () => {
  shouldThrow = false;
  const el = document.createElement("div");
  await captureElement(el, opts("png"), new Set(), {
    width: 100,
    scale: 5, // should be overridden by the managed scale (1)
    quality: 0.1, // should be overridden by the managed quality (1)
  });

  expect(lastOptions?.width).toBe(100); // pass-through
  expect(lastOptions?.scale).toBe(1); // managed value wins
  expect(lastOptions?.quality).toBe(1); // managed value wins
});

test("combines a user filter with the data-ignore-capture filter", async () => {
  shouldThrow = false;
  const el = document.createElement("div");
  await captureElement(el, opts("png"), new Set(), {
    filter: (node: Node) =>
      !(node instanceof HTMLElement && node.classList.contains("skip")),
  });

  const composed = lastOptions?.filter as (n: Node) => boolean;
  const ignored = document.createElement("div");
  ignored.setAttribute("data-ignore-capture", "");
  const skipped = document.createElement("div");
  skipped.className = "skip";
  const kept = document.createElement("div");

  expect(composed(ignored)).toBe(false); // built-in filter
  expect(composed(skipped)).toBe(false); // user filter
  expect(composed(kept)).toBe(true); // passes both
});
