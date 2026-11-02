import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "./",
  plugins: [
    visualizer(),
  ],
  build: {
    rollupOptions: {
      input: "src/hello.ts",
      treeshake: "smallest",
    },
  },
  resolve: {
   tsconfigPaths: true,
  },
});
