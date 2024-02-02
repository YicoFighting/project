import { ref } from "vue";

export default () => {
  // 定时器
  const timer = ref();
  // 标签容器
  const screenRef = ref();
  // 默认缩放值
  const scale = {
    width: 1,
    height: 1,
  };
  // 是否为生产环境
  const isProd = import.meta.env.VITE_ENV === "prod" ? true : false;
  // 设计稿尺寸（px）
  const baseWidth = 4000;
  const baseHeight = 1080;
  // 设计稿尺寸（px）需保持的比例
  const baseRatio = parseFloat((baseWidth / baseHeight).toFixed(5));

  const calcRate = () => {
    // 当前宽高比
    const currentRatio = parseFloat(
      (window.innerWidth / window.innerHeight).toFixed(5)
    );
    // 挂载的DOM对象
    if (screenRef.value) {
      // 如果是生产环境,需要平铺充满屏幕
      if (isProd) {
        scale.width = (window.innerWidth / baseWidth).toFixed(5);
        scale.height = (window.innerHeight / baseHeight).toFixed(5);
        screenRef.value.style.transform = `scale(${scale.width}, ${scale.height})`;
        // 测试环境 按4000*1080宽高比进行缩放(肯定会留白)
      } else {
        if (currentRatio > baseRatio) {
          // 4000 / 1080 = width / height
          // 表示更宽(所以是定高)  width = window.innerHeight * baseRatio 后面 / baseWidth是为了拿缩放倍数
          scale.width = ((window.innerHeight * baseRatio) / baseWidth).toFixed(
            5
          );
          // 后面 / baseHeight是为了拿缩放倍数;
          scale.height = (window.innerHeight / baseHeight).toFixed(5);
          screenRef.value.style.transform = `scale(${scale.width}, ${scale.height})`;
        } else {
          // 表示更高(所以是定宽)
          scale.height = (window.innerWidth / baseRatio / baseHeight).toFixed(
            5
          );
          scale.width = (window.innerWidth / baseWidth).toFixed(5);
          screenRef.value.style.transform = `scale(${scale.width}, ${scale.height})`;
        }
      }
    }
  };

  const resize = () => {
    clearTimeout(timer.value);
    timer.value = window.setTimeout(() => {
      calcRate();
    }, 200);
  };

  // 改变窗口大小重新绘制
  const windowDraw = () => {
    window.addEventListener("resize", resize);
  };

  // 改变窗口大小重新绘制
  const unWindowDraw = () => {
    window.removeEventListener("resize", resize);
  };

  return {
    screenRef,
    calcRate,
    windowDraw,
    unWindowDraw,
  };
};
