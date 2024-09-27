import path from "path";

export default {
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      ":foundation": path.resolve(__dirname, "./packages/zaffre/src/core/Foundation"),
      ":uifoundation": path.resolve(__dirname, "./packages/zaffre/src/core/UIFoundation"),
      ":attributes": path.resolve(__dirname, "./packages/zaffre/src/core/Attributes"),
      ":effect": path.resolve(__dirname, "./packages/zaffre/src/core/Effects"),
      ":events": path.resolve(__dirname, "./packages/zaffre/src/core/Events"),
      ":view": path.resolve(__dirname, "./packages/zaffre/src/core/View"),
      ":coretheme": path.resolve(__dirname, "./packages/zaffre/src/core/CoreTheme"),
    },
  },
};
