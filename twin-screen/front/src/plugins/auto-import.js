import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default () => {
  return [
    AutoImport({
      // 自动导入
      //   imports: ["vue", "vue-router", "pinia"],
      //   dts: false,
      //   eslintrc: {
      //     enabled: false,
      //     filepath: "./.eslintrc-auto-import.json",
      //     globalsPropValue: true,
      //   },

      // Element组件按需导入
      resolvers: [ElementPlusResolver()],
    }),
    // Element组件按需导入
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ];
};
