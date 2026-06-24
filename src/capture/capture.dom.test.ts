import { test, expect, mock, beforeEach } from "bun:test";
import { ParsedImageOptions } from "../types";

/**
 * Tests for captureElement and the capture() loop.
 *
 * NOTE: Bun's mock.module is global and persists across test files, so all
 * tests that touch these modules live in ONE file with a single, consistent
 * mock set — otherwise a mock from one file leaks into another.
 *
 * - modern-screenshot is mocked (deterministic output, controllable failure,
 *   captured options). captureElement runs for real against it.
 * - removeHiddenElements is mocked to a pass-through, because happy-dom has no
 *   layout and the real visibility check would strip every element.
 */
let shouldThrow = false;
let lastOptions: Record<string, unknown> | undefined;

mock.module("modern-screenshot", () => {
  const render = (mime: string) => async (_el: HTMLElement, opts: typeof lastOptions) => {
    if (shouldThrow) throw new Error("render failed");
    lastOptions = opts;
    return `data:${mime};base64,AAA`;
  };
  return {
    domToJpeg: render("image/jpeg"),
    domToPng: render("image/png"),
    domToSvg: render("image/svg+xml"),
    domToWebp: render("image/webp"),
  };
});
mock.module("./remove-hidden-elements", () => ({
  removeHiddenElements: (els: ArrayLike<HTMLElement>) => Array.from(els),
}));

const { capture } = await import("./index");
const { captureElement } = await import("./capture-element");

beforeEach(() => {
  shouldThrow = false;
  lastOptions = undefined;
});

/* -------------------------------------------------------------------------- */
/*                               captureElement                               */
/* -------------------------------------------------------------------------- */

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
  const el = document.createElement("div");
  const img = await captureElement(el, opts("png"), new Set());
  expect(img.dataURL).toBe("data:image/png;base64,AAA");
  expect(img.fileName).toBe("a.png");
});

test("passes screenshotOptions through but keeps scale/quality managed", async () => {
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

/* -------------------------------------------------------------------------- */
/*                               capture() loop                               */
/* -------------------------------------------------------------------------- */

// format "png" so the mocked domToPng path returns a predictable data URL.
const baseConfig = {
  downloadImages: false,
  enableWindowLogging: false,
  format: "png",
} as const;

test("onProgress fires once per capture with (completed, total)", async () => {
  const calls: Array<[number, number]> = [];
  const els = [document.createElement("div"), document.createElement("div")];

  await capture(els, {
    ...baseConfig,
    onProgress: (completed, total) => calls.push([completed, total]),
  });

  expect(calls).toEqual([
    [1, 2],
    [2, 2],
  ]);
});

test("a pre-aborted signal captures nothing", async () => {
  const controller = new AbortController();
  controller.abort();
  const els = [document.createElement("div"), document.createElement("div")];

  const result = await capture(els, { ...baseConfig, signal: controller.signal });

  expect(result).toEqual([]);
});

test("aborting mid-run returns the images captured so far", async () => {
  const controller = new AbortController();
  const els = [
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("div"),
  ];

  const result = await capture(els, {
    ...baseConfig,
    signal: controller.signal,
    onProgress: (completed) => {
      if (completed === 1) controller.abort(); // cancel after the first capture
    },
  });

  expect(result?.length).toBe(1);
});

test("output defaults to dataurl (no blob)", async () => {
  const [img] = (await capture(document.createElement("div"), baseConfig)) ?? [];
  expect(img.dataURL).toBe("data:image/png;base64,AAA");
  expect(img.blob).toBeUndefined();
});

test('output "both" populates dataURL and blob', async () => {
  const [img] =
    (await capture(document.createElement("div"), { ...baseConfig, output: "both" })) ??
    [];
  expect(img.dataURL).toBe("data:image/png;base64,AAA");
  expect(img.blob).toBeInstanceOf(Blob);
});

test('output "blob" drops the dataURL and keeps only the blob', async () => {
  const [img] =
    (await capture(document.createElement("div"), { ...baseConfig, output: "blob" })) ??
    [];
  expect(img.dataURL).toBe("");
  expect(img.blob).toBeInstanceOf(Blob);
});

test("onProgress counts multi-scale captures", async () => {
  const calls: Array<[number, number]> = [];
  const el = document.createElement("div");
  el.dataset.scale = "1,2,3"; // 3 captures from one element

  await capture(el, {
    ...baseConfig,
    onProgress: (completed, total) => calls.push([completed, total]),
  });

  expect(calls).toEqual([
    [1, 3],
    [2, 3],
    [3, 3],
  ]);
});
