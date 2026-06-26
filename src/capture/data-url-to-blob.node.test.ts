import { test, expect } from "bun:test";
import { dataUrlToBlob } from "./data-url-to-blob";

test("decodes a base64 data URL into a typed Blob", async () => {
  const blob = dataUrlToBlob("data:image/png;base64,aGVsbG8="); // "hello"
  expect(blob.type).toBe("image/png");
  expect(await blob.text()).toBe("hello");
});

test("decodes a URL-encoded (non-base64) data URL", async () => {
  const blob = dataUrlToBlob("data:image/svg+xml,%3Csvg%3E%3C%2Fsvg%3E");
  expect(blob.type).toBe("image/svg+xml");
  expect(await blob.text()).toBe("<svg></svg>");
});
