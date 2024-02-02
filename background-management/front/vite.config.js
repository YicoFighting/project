import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import createPostcssPlugins from "./vite/postcss";
import viteCompression from "vite-plugin-compression";
import vueSetupExtend from "vite-plugin-vue-setup-extend";

export default defineConfig({
  plugins: [vue(), viteCompression(), vueSetupExtend()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@images": path.resolve(__dirname, "src/assets/images"),
    },
    extensions: [".js", ".jsx", ".json", ".vue"],
  },
  css: {
    postcss: {
      plugins: createPostcssPlugins(),
    },
  },
  server: {
    port: 80,
    host: true,
    open: true,
    proxy: {
      "/dev": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev/, ""),
      },
      "/wss": {
        target: "ws://localhost:8081",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev/, ""),
      },
    },
  },
});
