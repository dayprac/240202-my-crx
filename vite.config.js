import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: "0.0.0.0",
    port: 8114,
  },
  css: {
    exclude: ["/app.css$/"],
  },
  build: {
    lib: {
      // entry: path.resolve(__dirname, "src/PlayerList.svelte"),
      entry: "src/PlayerList.svelte",
      name: "PlayerList",
      formats: ["umd"],
      fileName: "player-list",
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "player-list.css";
          return assetInfo.name;
        },
      },
    },
  },
});
