import { test, expect } from "bun:test";
import { handleFileNames } from "./handle-filenames";
import { ensureUniqueFileNames } from "./download-images";
import { ImageOptions } from "../types";

/**
 * Bug #8: capture-time naming (handleFileNames) and the public downloadImages
 * dedup (ensureUniqueFileNames) must produce identical results for the same
 * set of colliding names, since both now use the shared makeUnique helper.
 */
const opts: ImageOptions = {
  label: "a",
  format: "png",
  scale: 1,
  quality: 1,
  includeScaleInLabel: false,
};

test("both dedup paths agree on three colliding names", () => {
  const seen = new Set<string>();
  const viaCapture = [
    handleFileNames(opts, seen),
    handleFileNames(opts, seen),
    handleFileNames(opts, seen),
  ];

  const viaDownload = ensureUniqueFileNames([
    { dataURL: "", fileName: "a.png" },
    { dataURL: "", fileName: "a.png" },
    { dataURL: "", fileName: "a.png" },
  ]).map((img) => img.fileName);

  expect(viaCapture).toEqual(["a.png", "a-2.png", "a-3.png"]);
  expect(viaDownload).toEqual(viaCapture);
});
