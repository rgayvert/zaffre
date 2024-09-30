import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

// TODO: static source files are not being copied in dev mode, so for now we manually copy these files

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
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toString())
  }
  // resolve: {
  //   alias: {
  //     ":foundation": path.resolve(__dirname, "../../packages/zaffre/src/core/Foundation"),
  //     ":attributes": path.resolve(__dirname, "../../packages/zaffre/src/core/Attributes"),
  //     ":effect": path.resolve(__dirname, "../../packages/zaffre/src/core/Effects"),
  //     ":events": path.resolve(__dirname, "../../packages/zaffre/src/core/Events"),
  //     ":view": path.resolve(__dirname, "../../packages/zaffre/src/core/View"),
  //     ":coretheme": path.resolve(__dirname, "../../packages/zaffre/src/core/CoreTheme"),
  //   },
  // },
});
