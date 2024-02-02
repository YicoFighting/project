import { getStyle } from "element-plus/es/utils/dom/index";
import { ElTooltip } from "element-plus";
import "element-plus/theme-chalk/el-tooltip.css";
import TooltipTitle from "@/components/v-title";
import { createApp, h, nextTick } from "vue";

const tooltip = {
  props: ["text", "disabled", "width"],
  render(ctx) {
    return h(TooltipTitle, {
      text: ctx.text,
      disabled: ctx.disabled,
      width: ctx.width,
    });
  },
};

// 创建选区
const createRange = (element) => {
  const range = document.createRange();
  range.setStart(element, 0);
  range.setEnd(element, element.childNodes.length);
  const rangeWidth = Math.round(range.getBoundingClientRect().width);
  const padding =
    (parseInt(getStyle(element, "paddingLeft"), 10) || 0) +
    (parseInt(getStyle(element, "paddingRight"), 10) || 0);
  return {
    rangeWidth,
    padding,
  };
};

// 创建tooltip
const createTooltip = (element, text, rangeWidth, padding) => {
  if (
    rangeWidth + padding > element.offsetWidth ||
    element.scrollWidth > element.offsetWidth
  ) {
    const _app = createApp(tooltip, {
      text,
      disabled: false,
      width: element.getBoundingClientRect().width,
    });
    element._app = _app;
    _app.use(ElTooltip);
    _app.mount(element);
  }
};

// 绑定
const bindEl = (el, binding) => {
  el.style.cssText =
    "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
  el.classList.add("zy-tooltip");
  // 没有内容时,尝试读取innerText
  if (!binding.value) return;
  // 计算长度
  const { rangeWidth, padding } = createRange(el);
  // 是否需要绑定tooltip
  createTooltip(el, binding.value, rangeWidth, padding);
};

// 更新
const updatedEl = (el, binding) => {
  const tooltipInstance = el?._app; // 获取 tooltip 组件的实例对象
  if (tooltipInstance) {
    tooltipInstance._instance.props.text = binding.value; // 更新 text 属性的值
    nextTick(() => {
      const { rangeWidth, padding } = createRange(el);

      if (
        rangeWidth + padding > el.offsetWidth ||
        el.scrollWidth > el.offsetWidth
      ) {
        tooltipInstance._instance.props.disabled = false;
      } else {
        tooltipInstance._instance.props.disabled = true;
      }
    });
  } else {
    bindEl(el, binding);
  }
};

export default {
  mounted: bindEl,
  updated: updatedEl,
};
