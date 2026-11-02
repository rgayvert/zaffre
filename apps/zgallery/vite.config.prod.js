import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// TODO: static source files are not being copied in dev mode, so for now we manually copy these files

export default defineConfig({
  base: "/zgallery/",
  plugins: [
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
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(new Date().toString()),
  },
  resolve: {
    tsconfigPaths: true,
  },
});
