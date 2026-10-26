import { test, expect } from "bun:test";
import { zipUpImages } from "./download-images";
import type { Image } from "../types";

/** Entries from the zip's central directory, with their stored contents. */
function readEntries(bytes: Uint8Array): { name: string; text: string }[] {
  const view = new DataView(bytes.buffer);
  const decode = (from: number, length: number) =>
    new TextDecoder().decode(bytes.subarray(from, from + length));
  const entries: { name: string; text: string }[] = [];
  for (let i = 0; i < bytes.length - 46; i++) {
    if (view.getUint32(i, true) !== 0x02014b50) continue;
    const size = view.getUint32(i + 20, true);
    const nameLength = view.getUint16(i + 28, true);
    const offset = view.getUint32(i + 42, true);
    // Stored (uncompressed) data follows the local header + its name and extra.
    const dataStart =
      offset + 30 + view.getUint16(offset + 26, true) + view.getUint16(offset + 28, true);
    entries.push({ name: decode(i + 46, nameLength), text: decode(dataStart, size) });
  }
  return entries;
}

const image = (fileName: string, rest: Partial<Image>) =>
  ({ fileName, dataURL: "", ...rest }) as Image;

test("zips Blob, base64 and URL-encoded images with their file names", async () => {
  const zip = await zipUpImages([
    image("a.png", { blob: new Blob(["blob-bytes"], { type: "image/png" }) }),
    image("b.jpg", { dataURL: "data:image/jpeg;base64,YmFzZTY0LWJ5dGVz" }), // "base64-bytes"
    image("c.svg", { dataURL: "data:image/svg+xml;charset=utf-8,%3Csvg%3E%3C%2Fsvg%3E" }),
  ]);

  expect(zip?.type).toBe("application/zip");
  expect(readEntries(new Uint8Array(await zip!.arrayBuffer()))).toEqual([
    { name: "a.png", text: "blob-bytes" },
    { name: "b.jpg", text: "base64-bytes" },
    { name: "c.svg", text: "<svg></svg>" },
  ]);
});
