import { test, expect, mock } from "bun:test";
import { ParsedImageOptions } from "../types";

/**
 * Bug #7: when the renderer fails, captureElement must NOT silently return an
 * empty image ({ dataURL: "", fileName: "" }) — that empty entry would get
 * zipped/downloaded as a corrupt file. It should throw so the caller can
 * handle (skip + log) it.
 */

// modern-screenshot is mocked so we control success/failure deterministically.
let shouldThrow = false;
mock.module("modern-screenshot", () => ({
  domToJpeg: async () => {
    if (shouldThrow) throw new Error("render failed");
    return "data:image/jpeg;base64,AAA";
  },
  domToPng: async () => "data:image/png;base64,AAA",
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
