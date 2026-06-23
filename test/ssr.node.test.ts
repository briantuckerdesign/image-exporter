import { test, expect } from "bun:test";

/**
 * Bug #1: importing the package must not crash in a no-DOM environment
 * (Node / SSR frameworks like Next, Nuxt, SvelteKit). The logger wrote to
 * `window` at module top-level with no guard, throwing `window is not defined`
 * on import.
 *
 * This test runs WITHOUT happy-dom (test:node), so `window` is genuinely
 * undefined — the only environment that reproduces the bug.
 */
test("package imports without a DOM (SSR-safe)", async () => {
  expect(typeof window).toBe("undefined"); // sanity: truly no DOM here

  const mod = await import("../src/index");

  expect(typeof mod.capture).toBe("function");
  expect(typeof mod.downloadImages).toBe("function");
});
