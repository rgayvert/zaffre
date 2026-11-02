import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: "src/todo.ts",
      treeshake: "smallest",
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
