import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/zgallery/",
  plugins: [
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: "src/Demos",
          dest: "assets/source",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {},
  },
  define: {
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toString()),
    'import.meta.env.VITE_VERSION': "'Version 0.7.0'"
  }
});
