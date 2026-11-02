import { defineConfig } from "vite";
import { resolve } from "path";
//import dts from "vite-plugin-dts";
import dts from "unplugin-dts/vite";
import path from "path";

export default defineConfig({
  base: "./",
  env: false,
  plugins: [
    // dts({
    //   insertTypesEntry: true,
    //   bundleTypes: true,
    // }),
    dts({
      entryRoot: resolve(__dirname, "../../packages/zaffre"),
      insertTypesEntry: true,
      //rollupTypes: true,
      //include: ['./src/**/*.ts'],
      exclude: ['**/node_modules/**', 'test/**'],
      bundleTypes: true,
      tsconfigPath: "./tsconfig.json",
      beforeWriteFile: (filePath, content) => {
        // Remove Intl section
        const idx = content.indexOf("declare namespace Intl");
        const cleanedContent = idx === -1 ? content : content.substring(0, idx - 1);
        return { filePath, content: cleanedContent };
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "zaffre",
      fileName: "zaffre",
    },
    minify: false,
    rollupOptions: {
      //external: [path.resolve(__dirname, "../../packages/zaffre/test/core/*")],
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      ":foundation": path.resolve(__dirname, "../../packages/zaffre/src/foundation"),
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
