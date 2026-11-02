import { defineConfig } from "vite";

export default defineConfig({
  server: {
    https: true
  },
  build: {
    manifest: true,
    outDir: "out",
    rollupOptions: { 
      input: "src/server.ts", 
    },
  },
  optimizeDeps: { 
    exclude: ["fsevents"],
  },

});
