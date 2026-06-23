/**
 * happy-dom preload for browser-style tests.
 *
 * Registers a lightweight DOM (window, document, etc.) onto globalThis so that
 * code depending on the browser environment can run under `bun test`.
 *
 * Only loaded by the `test:dom` script via `--preload`. The `test:node` script
 * deliberately does NOT load this, giving us a true no-DOM environment for
 * testing SSR / server-side safety.
 */
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
