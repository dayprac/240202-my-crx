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
    },
    // rollupOptions: {
    //   // make sure to externalize deps that shouldn't be bundled
    //   // into your library
    //   external: ["svelte"],
    // },
  },
});
