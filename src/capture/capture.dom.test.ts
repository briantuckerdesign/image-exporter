import { test, expect, mock } from "bun:test";

/**
 * Loop-level tests for capture(). happy-dom has no layout, so the real
 * removeHiddenElements would strip every element; we mock it (and
 * captureElement) so the capture loop actually runs.
 */
mock.module("./remove-hidden-elements", () => ({
  removeHiddenElements: (els: ArrayLike<HTMLElement>) => Array.from(els),
}));
mock.module("./capture-element", () => ({
  captureElement: async () => ({
    dataURL: "data:image/png;base64,AAA",
    fileName: "x.png",
  }),
}));

const { capture } = await import("./index");

const baseConfig = { downloadImages: false, enableWindowLogging: false } as const;

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
