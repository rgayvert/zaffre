import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "./",
  plugins: [
    tsconfigPaths(), 
    visualizer()
  ],
  build: {
    rollupOptions: { 
      input: "src/hello.ts", 
      treeshake: "smallest"
    },
  },
});
