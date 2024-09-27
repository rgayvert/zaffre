import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  plugins: [tsconfigPaths()],
  build: {
    rollupOptions: {
      input: "src/todo.ts",
      treeshake: "smallest",
    },
  },
});
