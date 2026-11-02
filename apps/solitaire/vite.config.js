import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {},
  },
  resolve: {
    tsconfigPaths: true,
  },
});
