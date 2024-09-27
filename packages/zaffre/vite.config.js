import { defineConfig } from "vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [
    tsconfigPaths(),
    dts({
      entryRoot: resolve(__dirname, "../../packages/zaffre"),
      insertTypesEntry: true,
      rollupTypes: true
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "zaffre",
      fileName: "zaffre",
    },
    rollupOptions: {
      //external: [path.resolve(__dirname, "../../packages/zaffre/test/core/*")], 
    },
  },
  resolve: {
    alias: {
      ":foundation": path.resolve(__dirname, "../../packages/zaffre/src/core/Foundation"),
      ":uifoundation": path.resolve(__dirname, "../../packages/zaffre/src/core/UIFoundation"),
      ":attributes": path.resolve(__dirname, "../../packages/zaffre/src/core/Attributes"),
      ":effect": path.resolve(__dirname, "../../packages/zaffre/src/core/Effects"),
      ":events": path.resolve(__dirname, "../../packages/zaffre/src/core/Events"),
      ":view": path.resolve(__dirname, "../../packages/zaffre/src/core/View"),
      ":coretheme": path.resolve(__dirname, "../../packages/zaffre/src/core/CoreTheme"),
      ":corehtml": path.resolve(__dirname, "../../packages/zaffre/src/core/CoreHTML"),
      ":app": path.resolve(__dirname, "../../packages/zaffre/src/core/App"),
      ":theme": path.resolve(__dirname, "../../packages/zaffre/src/core/Theme"),
      ":svg": path.resolve(__dirname, "../../packages/zaffre/src/core/SVG"),
      ":html": path.resolve(__dirname, "../../packages/zaffre/src/components/HTML"),
      ":layout": path.resolve(__dirname, "../../packages/zaffre/src/components/Layout"),
      ":content": path.resolve(__dirname, "../../packages/zaffre/src/components/Content"),
      ":core": path.resolve(__dirname, "../../packages/zaffre/src/core"),
    },
  },


});
