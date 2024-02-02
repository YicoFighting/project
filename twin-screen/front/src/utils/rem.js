// 基准
const baseSize = 16;

/** 设置rem */
const setRem = () => {
  // 当页面宽度相对 1920 宽的缩放比例，可根据自己需要修改
  const scale = document.documentElement.clientWidth / 1920;
  // 设置页面根节点字体大小：最小为12px，最大为32px
  let fontSize =
    baseSize * Math.min(scale, 2) > 12 ? baseSize * Math.min(scale, 2) : 12;

  document.documentElement.style.fontSize = fontSize + "px";
};

/**
 * 节流函数
 * @param {*} func 函数
 * @param {*} delay 延迟执行毫秒数
 * @returns
 */
const throttle = (func, delay) => {
  let timer = null;
  let startTime = Date.now();

  return function () {
    let curTime = Date.now();
    let remaining = delay - (curTime - startTime);
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(func, remaining);
    }
  };
};

// 初始化
setRem();

window.onresize = function () {
  throttle(setRem(), 1000);
};
