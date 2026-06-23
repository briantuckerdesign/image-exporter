import { test, expect } from "bun:test";

/**
 * Smoke test for the DOM test environment.
 *
 * Proves that the happy-dom preload is active: `document` exists and we can
 * create and query real elements. Real unit tests for capture logic build on
 * this same environment.
 */
test("happy-dom is registered: document is available", () => {
  expect(typeof window).toBe("object");
  expect(typeof document).toBe("object");

  const el = document.createElement("div");
  el.className = "artboard";
  el.textContent = "hello";
  document.body.appendChild(el);

  expect(document.querySelector(".artboard")?.textContent).toBe("hello");

  el.remove();
});
