import typescript from "@rollup/plugin-typescript";
import path from "path";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { visualizer } from "rollup-plugin-visualizer";
import progress from "vite-plugin-progress";
import colors from "picocolors";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // https://github.com/jeddygong/vite-plugin-progress
    progress({
      format: `Building ${colors.green("[:bar]")} :percent :eta`,
      total: 100,
      width: 60,
      // complete: "=",
      // incomplete: "",
    }),
  ],
  output: {
    exports: "named",
  },
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    port: 3123,
  },
  // https://vitejs.dev/guide/build.html#library-mode
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      fileName: "main",
      name: "dateSearch",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: [],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: true,
          declaration: true,
          outDir: "dist",
          exclude: ["**/**.test.**", "**/**.mock.**"],
        }),
        visualizer({
          title: "visualizer - vite-vanilla-ts-module",
          template: "network",
        }),
      ],
    },
  },
});
