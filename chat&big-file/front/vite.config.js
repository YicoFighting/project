import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: "less" })],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "body-background": "#03262C",
          "component-background": "#03262C",
          "menu-inline-submenu-bg": "#03262C",
          "menu-item-active-bg": "#03262C",
          "menu-highlight-color": "#fff",
          "text-color": "#fff",
          "table-header-bg": "rgba(45, 220, 255, 0.07)",
          "table-header-color": "#fff",
          "table-border-color": "#385055",
          "table-row-hover-bg": "rgba(45, 220, 255, 0.14)",
          "btn-primary-bg":
            "linear-gradient(180deg, rgba(34, 233, 255, 0.75) 0%, #006974 100%)",
          "btn-border-width": 0,
          "border-radius-base": 0,
          "card-head-color": "rgba(230, 230, 230, 0.2)",
          "label-color": "#fff",
          "select-item-active-bg": "rgba(45, 220, 255, 0.14)",
          "select-item-selected-bg": "rgba(45, 220, 255, 0.14)",
          "select-item-selected-color": "#2ddcff",
          "input-border-color": "#29414d",
          "input-hover-border-color": "#29414d",
        },
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/dev": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev/, ""),
      },
      "/wss": {
        target: "ws://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev/, ""),
      },
    },
  },
});
