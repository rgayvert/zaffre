import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
    },
  },
  resolve: {
    tsconfigPaths: true
  }
});