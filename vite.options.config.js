import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    open: "index.options.html",
    host: "0.0.0.0",
    port: 61222,
  },
  css: {
    exclude: ["/app.css$/"],
  },
  build: {
    outDir: "dist-options",
    lib: {
      // entry: path.resolve(__dirname, "src/PlayerList.svelte"),
      entry: "src/ListOnOptions.svelte",
      name: "ListOnOptions",
      formats: ["umd"],
      fileName: "svelte-options",
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "svelte-options.css";
          return assetInfo.name;
        },
      },
    },
  },
});
