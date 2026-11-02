import { defineConfig } from "vite";

export default defineConfig({
  base: "/todo/",
  build: {
    // rollupOptions: {
    //   input: "src/todo.ts",
    //   treeshake: "smallest"
    // },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
