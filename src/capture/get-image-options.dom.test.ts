import { test, expect, spyOn } from "bun:test";
import { getImageOptions } from "./get-image-options";
import { defaultConfig } from "../config";

/**
 * Bug #9: when an invalid format is provided, the error message must list ALL
 * accepted formats. webp is supported but was missing from the message.
 */
test("invalid format error message lists webp as an accepted value", async () => {
  const el = document.createElement("div");
  el.dataset.format = "gif"; // not supported -> triggers the error path

  const spy = spyOn(console, "error").mockImplementation(() => {});
  await getImageOptions(el, defaultConfig);
  const logged = spy.mock.calls
    .map((args) => args.map((a) => String(a)).join(" "))
    .join("\n");
  spy.mockRestore();

  expect(logged).toContain("webp");
});

test("invalid format falls back to the config default", async () => {
  const el = document.createElement("div");
  el.dataset.format = "gif";

  const spy = spyOn(console, "error").mockImplementation(() => {});
  const options = await getImageOptions(el, defaultConfig);
  spy.mockRestore();

  expect(options.format).toBe(defaultConfig.format);
});
