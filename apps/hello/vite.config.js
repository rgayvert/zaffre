import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [
    //(),
  ],
  build: {
    rollupOptions: {
      input: "src/hello.ts",
      treeshake: true,
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
