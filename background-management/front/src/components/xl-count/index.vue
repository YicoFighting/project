<template>
  <span class="number">
    {{ state.displayValue }}
  </span>
</template>

<script setup>
import {
  requestAnimationFrame,
  cancelAnimationFrame,
} from "@/utils/animationFrame";

import { reactive, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  // 开始
  start: {
    type: Number,
    required: false,
    default: 0,
  },
  // 结束
  end: {
    type: Number,
    required: false,
    default: 2023,
  },
  // 持续时间
  duration: {
    type: Number,
    required: false,
    default: 5000,
  },
  // 自动播放
  autoPlay: {
    type: Boolean,
    required: false,
    default: true,
  },
  // 小数点保留几位
  decimals: {
    type: Number,
    required: false,
    default: 0,
    validator(value) {
      return value >= 0;
    },
  },
  // 小数点
  decimal: {
    type: String,
    required: false,
    default: ".",
  },
  // 分隔符
  separator: {
    type: String,
    required: false,
    default: ",",
  },
  // 前缀
  prefix: {
    type: String,
    required: false,
    default: "",
  },
  // 后缀
  suffix: {
    type: String,
    required: false,
    default: "",
  },
  // 使用速度曲线
  useEasing: {
    type: Boolean,
    required: false,
    default: true,
  },
  // 速度曲线函数
  easingFn: {
    type: Function,
    // 已用时间 开始数字 差值 持续时间
    default(t, b, c, d) {
      return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
    },
  },
});

const emits = defineEmits(["onMountedcallback", "callback"]);

// 判断是否为数字
const isNumber = (val) => {
  return !isNaN(parseFloat(val));
};

// 格式化数据，返回想要展示的数据格式
const formatNumber = (val) => {
  val = (val * 1).toFixed(props.decimals || 0);

  val += "";
  const x = val.split(".");
  let x1 = x[0];

  const x2 = x.length > 1 ? props.decimal + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  // 用正则匹配每三位加个分隔符
  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + props.separator + "$2");
    }
  }
  return props.prefix + x1 + x2 + props.suffix;
};

const state = reactive({
  // 开始数字
  localStart: props.start,
  // 展示值
  displayValue: formatNumber(props.start),
  // 当前展示值
  printVal: null,
  // 停止
  paused: false,
  // 运行时间
  localDuration: props.duration,
  // 开始时间
  startTime: null,

  timestamp: null,
  remaining: null,
  rAF: null,
});

// 定义一个计算属性，当开始数字大于结束数字时返回true
const stopCount = computed(() => {
  return props.start > props.end;
});

// 初始化滚动
const startCount = () => {
  state.localStart = props.start;
  state.startTime = null;
  state.localDuration = props.duration;
  state.paused = false;
  state.rAF = requestAnimationFrame(count);
};

// 暂停计数
const pause = () => {
  cancelAnimationFrame(state.rAF);
};

// 恢复计数
const resume = () => {
  state.startTime = null;
  // 将剩余时间赋值给持续时间
  state.localDuration = +state.remaining;
  // 将当前展示数字赋值给开始数字
  state.localStart = +state.printVal;
  requestAnimationFrame(count);
};

// 切换停止或恢复计数
const pauseResume = () => {
  if (state.paused) {
    resume();
    state.paused = false;
  } else {
    pause();
    state.paused = true;
  }
};

// 重置
const reset = () => {
  // 开始时间置为空
  state.startTime = null;
  // 取消动画
  cancelAnimationFrame(state.rAF);
  // 重置为开始数字
  state.displayValue = formatNumber(props.start);
};

// 滚动的具体逻辑
const count = (timestamp) => {
  if (!state.startTime) state.startTime = timestamp;
  state.timestamp = timestamp;

  // 进度(已使用时间)
  const progress = timestamp - state.startTime;
  // 剩下的时间
  state.remaining = state.localDuration - progress;
  // 是否使用速度变化曲线
  if (props.useEasing) {
    // 开始数字 > 结束数字
    if (stopCount.value) {
      // 开始数字 - 超出的数字(运动的)
      state.printVal =
        state.localStart -
        props.easingFn(
          progress,
          0,
          state.localStart - props.end,
          state.localDuration
        );
    } else {
      // 当前值
      state.printVal = props.easingFn(
        progress,
        state.localStart,
        props.end - state.localStart,
        state.localDuration
      );
    }
  } else {
    if (stopCount.value) {
      state.printVal =
        state.localStart -
        (state.localStart - props.end) * (progress / state.localDuration);
    } else {
      state.printVal =
        state.localStart +
        (props.end - state.localStart) * (progress / state.localDuration);
    }
  }

  // 开始数字 > 结束数字 数字在减小
  if (stopCount.value) {
    state.printVal = state.printVal < props.end ? props.end : state.printVal;
  } else {
    state.printVal = state.printVal > props.end ? props.end : state.printVal;
  }
  // 展示的数字
  state.displayValue = formatNumber(state.printVal);
  // 时间还未到
  if (progress < state.localDuration) {
    state.rAF = requestAnimationFrame(count);
  } else {
    // 时间到了
    emits("callback");
  }
};

// 监听开始
watch(
  () => props.start,
  () => {
    if (props.autoPlay) {
      startCount();
    }
  }
);

// 监听结束
watch(
  () => props.end,
  () => {
    if (props.autoPlay) {
      startCount();
    }
  }
);

// 挂载完就执行运动函数
onMounted(() => {
  if (props.autoPlay) {
    startCount();
  }
  emits("onMountedcallback");
});

// 组件销毁时取消动画
onUnmounted(() => {
  cancelAnimationFrame(state.rAF);
});

defineExpose({
  startCount,
});
</script>
