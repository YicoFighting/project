import {
  onMounted,
  onUnmounted,
  unref,
  getCurrentInstance,
  nextTick,
} from "vue";
import echarts from "@/plugins/echarts";

const useECharts = (element, theme = "light", renderer = "canvas") => {
  // echats实例
  let echartsInstance = null;

  const { proxy } = getCurrentInstance();

  // 初始化 echats实例
  const initCharts = () => {
    return new Promise((resolve) => {
      nextTick(() => {
        const el = proxy.$refs?.[element];

        if (!el) return;
        echartsInstance = echarts.init(el, theme, { renderer });

        resolve();
      });
    });
  };

  // 配置
  const setOptions = (option) => {
    return new Promise(async (resolve) => {
      await showLoading();
      if (!echartsInstance) await initCharts();

      if (!echartsInstance) return;

      echartsInstance.setOption(option);

      await hideLoading();

      resolve(echartsInstance);
    });
  };

  // 获取 echats实例
  const getInstance = async () => {
    if (!echartsInstance) await initCharts();
    return echartsInstance;
  };

  // 更新大小
  const onResize = () => {
    echartsInstance && echartsInstance?.resize();
  };

  // 显示加载状态
  const showLoading = async () => {
    if (!echartsInstance) await initCharts();
    echartsInstance?.showLoading();
  };

  // 隐藏加载状态
  const hideLoading = async () => {
    if (!echartsInstance) await initCharts();
    echartsInstance?.hideLoading();
  };

  // 生命钩子——组件挂载完成
  onMounted(() => {
    window.addEventListener("resize", onResize);
  });

  // 生命钩子——页面销毁
  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
  });

  return { setOptions, getInstance };
};

export { useECharts };
