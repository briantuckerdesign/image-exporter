import { $ } from "bun";

const entrypoint = "./src/index.ts";
const outdir = "./dist";

console.log("🏗️  Building image-exporter...\n");

// Clean dist folder
await $`rm -rf ${outdir}`;

// Build ESM (for modern bundlers/Node)
const esmResult = await Bun.build({
  entrypoints: [entrypoint],
  outdir,
  format: "esm",
  target: "browser",
  minify: false,
  sourcemap: "external",
  naming: "[dir]/index.[ext]",
});

if (!esmResult.success) {
  console.error("❌ ESM build failed:", esmResult.logs);
  process.exit(1);
}
console.log("✅ ESM build: dist/index.js");

// Build CJS (for CommonJS/older Node)
const cjsResult = await Bun.build({
  entrypoints: [entrypoint],
  outdir,
  format: "cjs",
  target: "browser",
  minify: false,
  sourcemap: "external",
  naming: "[dir]/index.[ext]",
});

if (!cjsResult.success) {
  console.error("❌ CJS build failed:", cjsResult.logs);
  process.exit(1);
}

// Rename .js to .cjs for CommonJS
await $`mv ${outdir}/index.js ${outdir}/index.cjs`;
await $`mv ${outdir}/index.js.map ${outdir}/index.cjs.map 2>/dev/null || true`;
console.log("✅ CJS build: dist/index.cjs");

// Rebuild ESM since we renamed it
const esmResult2 = await Bun.build({
  entrypoints: [entrypoint],
  outdir,
  format: "esm",
  target: "browser",
  minify: false,
  sourcemap: "external",
  naming: "[dir]/index.[ext]",
});

if (!esmResult2.success) {
  console.error("❌ ESM rebuild failed:", esmResult2.logs);
  process.exit(1);
}

// Build browser IIFE (for direct script tag usage)
const browserResult = await Bun.build({
  entrypoints: [entrypoint],
  outdir,
  format: "iife",
  target: "browser",
  minify: true,
  sourcemap: "external",
  naming: "[dir]/index.browser.[ext]",
});

if (!browserResult.success) {
  console.error("❌ Browser build failed:", browserResult.logs);
  process.exit(1);
}
console.log("✅ Browser build: dist/index.browser.js (minified IIFE)");

// Generate TypeScript declarations
console.log("\n📝 Generating TypeScript declarations...");
const tscResult = await $`bunx tsc --emitDeclarationOnly --declaration --outDir ${outdir}`.quiet();
if (tscResult.exitCode !== 0) {
  console.error("❌ TypeScript declarations failed");
  console.error(tscResult.stderr.toString());
  process.exit(1);
}
console.log("✅ TypeScript declarations: dist/index.d.ts");

console.log("\n🎉 Build complete!");
