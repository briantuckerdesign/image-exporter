import { defineConfig } from "vite";
import strip from "@rollup/plugin-strip";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: "src/index.ts",
      name: "image-exporter",
      fileName: (format) => `image-exporter.${format}.js`,
    },
    rollupOptions: {
      input: "src/index.ts",
      plugins: [
        {
          name: "wrap-in-iife",
          generateBundle(outputOptions, bundle) {
            if (outputOptions.format === "umd") {
              Object.keys(bundle).forEach((fileName) => {
                const file = bundle[fileName];
                if (fileName.slice(-3) === ".js" && "code" in file) {
                  file.code = `(() => {\n${file.code}})()`;
                }
              });
            }
          },
        },
        strip({
          include: "**/*.(js|ts)",
          functions: ["console.log"],
          // Only apply this plugin during build, not during watch
          exclude: process.env.NODE_ENV === "development" ? "**/*" : "",
        }),
      ],
    },
  },
});
