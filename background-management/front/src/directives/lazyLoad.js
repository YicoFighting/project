import defaultSrc from "@images/LazyLoad/default.png";

// 初始化
const init = (el, val, def) => {
  el.setAttribute("data-src", val);
  el.setAttribute("src", def);
};

let io = null;
// 利用IntersectionObserver监听el
const observe = (el) => {
  if (!io) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const realSrc = entry.target.dataset.src;
          if (realSrc) {
            entry.target.src = realSrc;
            el.removeAttribute("data-src");
            io.unobserve(entry.target);
          }
        }
      });
    });
  }
  io.observe(el);
};

const LazyLoad = {
  created(el, binding) {
    init(el, binding.value, defaultSrc);
  },
  mounted(el) {
    observe(el);
  },
};

export default LazyLoad;
