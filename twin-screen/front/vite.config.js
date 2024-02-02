import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgIconPlugin from "./src/plugins/svg-icons";
import autoImportPlugin from "./src/plugins/auto-import";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  return {
    plugins: [vue(), svgIconPlugin(isBuild), ...autoImportPlugin()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@images": fileURLToPath(
          new URL("./src/assets/images", import.meta.url)
        ),
      },
      extensions: [".js", ".json", ".scss", ".vue"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/assets/styles/var.scss';`,
          javascriptEnabled: true,
        },
      },
    },
    server: {
      proxy: {
        "/ws": {
          // target: "http://172.16.1.139:8088/", // 苏州湾(大)
          target: "http://172.16.1.138:8088/", // 苏州湾(小)
          ws: true, // 开启websocket代理
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/ws/, ""),
        },
        "/websocket": {
          target: "ws://127.0.0.1:8080/", // 苏州湾
          ws: true, // 开启websocket代理
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/ws/, ""),
        },
      },
    },
  };
});
