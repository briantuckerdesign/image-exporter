import { test, expect } from "bun:test";
import { makeUnique } from "./make-unique";

/**
 * Bug #8: a single shared dedup helper, used by both the capture-time
 * filename builder and the public downloadImages entry point.
 */
test("returns the name unchanged when unseen", () => {
  const seen = new Set<string>();
  expect(makeUnique("a.png", seen)).toBe("a.png");
});

test("appends -2, -3 for successive duplicates", () => {
  const seen = new Set<string>();
  expect(makeUnique("a.png", seen)).toBe("a.png");
  expect(makeUnique("a.png", seen)).toBe("a-2.png");
  expect(makeUnique("a.png", seen)).toBe("a-3.png");
});

test("continues numbering when the base already ends in -n", () => {
  const seen = new Set<string>(["a-2.png"]);
  // "a-2.png" is taken -> next should be a-3.png, not a-2-2.png
  expect(makeUnique("a-2.png", seen)).toBe("a-3.png");
});

test("skips already-taken numbered names", () => {
  const seen = new Set<string>(["a.png", "a-2.png", "a-3.png"]);
  expect(makeUnique("a.png", seen)).toBe("a-4.png");
});

test("handles names without an extension", () => {
  const seen = new Set<string>(["report"]);
  expect(makeUnique("report", seen)).toBe("report-2");
});
