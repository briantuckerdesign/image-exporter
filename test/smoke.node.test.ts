import { test, expect } from "bun:test";

/**
 * Smoke test for the no-DOM (Node / SSR) test environment.
 *
 * Proves that the `test:node` script runs WITHOUT happy-dom: there is no
 * global `window`. This is the environment used to verify the package is safe
 * to import in SSR / server contexts (Phase 2, bug #1).
 */
test("no-DOM environment: window is undefined", () => {
  expect(typeof window).toBe("undefined");
});
