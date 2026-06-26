import { test, expect } from "bun:test";
import { copyImageToClipboard } from "./copy-to-clipboard";

test("writes the image blob to the clipboard as a ClipboardItem", async () => {
  const written: unknown[][] = [];

  class FakeClipboardItem {
    constructor(public items: Record<string, Blob>) {}
  }
  (globalThis as unknown as { ClipboardItem: unknown }).ClipboardItem = FakeClipboardItem;
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      write: async (data: unknown[]) => {
        written.push(data);
      },
    },
  });

  await copyImageToClipboard({
    dataURL: "data:image/png;base64,aGVsbG8=",
    fileName: "x.png",
  });

  expect(written.length).toBe(1);
  expect(written[0][0]).toBeInstanceOf(FakeClipboardItem);
  const item = written[0][0] as FakeClipboardItem;
  expect(item.items["image/png"]).toBeInstanceOf(Blob);
});

test("uses an existing blob when present", async () => {
  let received: Record<string, Blob> | undefined;

  class FakeClipboardItem {
    constructor(public items: Record<string, Blob>) {
      received = items;
    }
  }
  (globalThis as unknown as { ClipboardItem: unknown }).ClipboardItem = FakeClipboardItem;
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { write: async () => {} },
  });

  const blob = new Blob(["x"], { type: "image/webp" });
  await copyImageToClipboard({ dataURL: "", fileName: "x.webp", blob });

  expect(received?.["image/webp"]).toBe(blob);
});
