/**
 * 使用v-ellipsis:省略号
 */
const ellipsis = {
  /** 在元素被插入到 DOM 前调用 */
  mounted(el, binding) {
    /** 原始高度 */
    const origin = el.clientHeight;
    el.style['display'] = '-webkit-box';
    el.style['-webkit-box-orient'] = 'vertical';
    el.style['overflow'] = 'hidden';
    el.style['-webkit-line-clamp'] = binding.value || 1;
    /** 出现省略号后,修改后的高度小于原始高度 */
    if (el.clientHeight < origin) {
      el.title = el.innerHTML;
    }
  },
};

/** 复制 */
const copy = {
  beforeMount(el, binding) {
    el.targetContent = binding.value;
    el.addEventListener('click', () => {
      if (!el.targetContent) return console.warn('没有需要复制的目标内容');
      // 复制成功的回调函数
      const callback = binding.arg;
      // 创建textarea标签
      const textarea = document.createElement('textarea');
      // 设置相关属性
      textarea.readOnly = 'readonly';
      textarea.style.position = 'fixed';
      textarea.style.top = '-99999px';
      // 把目标内容赋值给它的value属性
      textarea.value = el.targetContent;
      // 插入到页面
      document.body.appendChild(textarea);
      // 调用onselect()方法
      textarea.select();
      // 把目标内容复制进剪贴板, 该API会返回一个Boolean
      const res = document.execCommand('Copy');
      // 复制成功,并且有回调函数时执行回调函数
      res && callback && callback();
      // 移除textarea标签
      document.body.removeChild(textarea);
    });
  },
  updated(el, binding) {
    // 实时更新最新的目标内容
    el.targetContent = binding.value;
  },
  unmounted(el) {
    el.removeEventListener('click', () => {});
  },
};

/** 判断图片是否存在 */
const imageIsExist = (url) => {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = url;
    // 加载成功
    img.onload = () => {
      if (img.complete) {
        resolve(true);
        img = null;
      }
    };
    // 加载失败
    img.onerror = () => {
      resolve(false);
      img = null;
    };
  });
};

/** 图片是否存在 */
const real_img = {
  async beforeMount(el, binding) {
    // 拿到图片的url
    const imgURL = binding.value;
    if (imgURL) {
      const exist = await imageIsExist(imgURL);
      // 图片存在时,设置src属性
      exist && el.setAttribute('src', imgURL);
    }
  },
};

/** 懒加载 */
const lazy_img = {
  beforeMount(el, binding) {
    el.$data_src = binding.value;
  },
  mounted(el) {
    IntersectionObserver ? ioEvent(el) : scrollEvent(el);
  },
  updated(el, binding) {
    el.$data_src = binding.value;
  },
  unmounted(el) {
    IntersectionObserver && el.$io.disconnect();
  },
};

/** 监听是否可见 */
const ioEvent = (el) => {
  const io = new IntersectionObserver((entries) => {
    /** 图片真实src */
    const realSrc = el.$data_src;
    // 如果 intersectionRatio 为 0 , 则目标在视野外
    entries[0].isIntersecting && realSrc && (el.src = realSrc);
  });
  //绑定函数
  el.$io = io;
  //开始监听el
  io.observe(el);
};

/** IntersectionObserver的兼容函数 */
const scrollEvent = (el) => {
  /** 节流 */
  const handler = throttler(loadImg, 250);
  /** 立即执行一次 */
  loadImg(el);
  /** 监听滚动 */
  window.addEventListener('scroll', () => {
    handler(el);
  });
};

/** 加载图片 */
const loadImg = (el) => {
  /** 获取可视区域高度 */
  const clientHeight = getClientHeight();
  /** 盒子上沿距离可视区域的高度,盒子下沿距离可是区域的高度 */
  const { top, bottom } = el.getBoundingClientRect();
  /** 真实图片地址 */
  const realSrc = el.$data_src;
  /** 设置图片地址 */
  top < clientHeight && bottom > 0 && realSrc && (el.src = realSrc);
};

/** 获取可视区域高度 */
const getClientHeight = () => {
  const dClientHeight = document.documentElement.clientHeight;
  const bodyClientHeight = document.body.clientHeight;
  let clientHeight = 0;
  if (bodyClientHeight && dClientHeight) {
    clientHeight =
      bodyClientHeight < dClientHeight ? bodyClientHeight : dClientHeight;
  } else {
    clientHeight =
      bodyClientHeight > dClientHeight ? bodyClientHeight : dClientHeight;
  }
  return clientHeight;
};

/**
 * 节流函数
 * @param {*} fun 函数
 * @param {*} delay 间隔时间
 * @returns 可执行函数(节流)
 */
const throttler = (fun, delay) => {
  let last, deferTimer;
  return function (args) {
    let that = this;
    let _args = arguments;
    let now = +new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fun.apply(that, _args);
      }, delay);
    } else {
      last = now;
      fun.apply(that, _args);
    }
  };
};

/** 点击位置是否在盒子内 */
const click_outside = {
  beforeMount(el, binding) {
    document.addEventListener(
      'click',
      (e) => {
        /** 返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点。binding.value:回调函数 */
        el.contains(e.target) && binding.value();
      },
      false
    );
  },
  unmounted() {
    document.removeEventListener('click', () => {});
  },
};

export default {
  install(app) {
    app.directive('ellipsis', ellipsis);
    app.directive('copy', copy);
    app.directive('real-img', real_img);
    app.directive('lazy-img', lazy_img);
    app.directive('click-outside', click_outside);
  },
};
