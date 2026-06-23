import { test, expect, mock } from "bun:test";

/**
 * Bug #6: the CORS proxy mutates the live DOM (rewrites img.src, swaps <link>
 * stylesheets for inline <style>). cleanUp() must run even if capture throws
 * afterwards, otherwise the user's page is left broken. cleanUp therefore
 * belongs in a finally block, not the success path.
 *
 * We mock the proxy so `run` throws; cleanUp should still be called.
 */
const cleanUp = mock(async () => {});
mock.module("../cors-proxy", () => ({
  corsProxy: {
    run: async () => {
      throw new Error("proxy boom");
    },
    cleanUp,
  },
}));

const { capture } = await import("./index");

test("corsProxy.cleanUp runs even when capture throws", async () => {
  cleanUp.mockClear();
  const el = document.createElement("div");

  const result = await capture(el, {
    corsProxyBaseUrl: "https://proxy.example/",
    enableWindowLogging: false,
  });

  expect(result).toBeNull(); // run() threw -> top-level catch returns null
  expect(cleanUp).toHaveBeenCalled(); // cleanup still happened via finally
});
