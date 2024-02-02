<template>
  <xl-modal-prevention
    :width="507"
    :height="320"
    :title-c="'门禁流量统计'"
    :title-e="'Access control traffic statistics'"
    @mouseover="stopInterval"
    @mouseleave="startInterval"
  >
    <template #main>
      <div class="box">
        <div id="charts" ref="flowRef"></div>
        <div class="change-box">
          <div class="date-change">
            <div
              :class="[dateNum === 7 ? 'active' : '']"
              @click="dateSelect(7)"
            >
              近7天
            </div>
            <div
              :class="[dateNum === 30 ? 'active' : '']"
              @click="dateSelect(30)"
            >
              近30天
            </div>
          </div>
          <div class="type-change">
            <div
              :class="[typeNum === 3 ? 'active' : '']"
              @click="typeSelect(3)"
            >
              车流
            </div>
            <div
              :class="[typeNum === 1 ? 'active' : '']"
              @click="typeSelect(1)"
            >
              人流
            </div>
            <div
              :class="[typeNum === 2 ? 'active' : '']"
              @click="typeSelect(2)"
            >
              访客
            </div>
          </div>
        </div>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { XlModalPrevention } from "@/components";
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useECharts } from "@/hooks";

// 时间切换
const dateNum = ref(30);
// 类型切换
const typeNum = ref(3);
// 轮询id
const intervalId = ref();

const { setOptions } = useECharts("flowRef");

// 日期选择
const dateSelect = (val) => {
  dateNum.value = val;
};

// 切换(车流|人流|访客)
const typeSelect = (val) => {
  typeNum.value = val;
};

//按钮循环高亮并切换数据
const startInterval = () => {
  intervalId.value = setInterval(() => {
    if (typeNum.value === 3) {
      typeNum.value = 1;
    } else if (typeNum.value === 1) {
      typeNum.value = 2;
    } else {
      typeNum.value = 3;
      dateNum.value = dateNum.value == 7 ? 30 : 7;
    }
  }, 10000);
};

//划入清除高亮
const stopInterval = () => {
  clearInterval(intervalId.value);
};

// 获取近一个月(每一天)
const lastMonthDay = (day) => {
  // 获取当前时间
  const now = new Date();

  // 获取一个月前的时间
  const oneMonthAgo = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);

  // 生成近一个月每天的时间
  const dates = [];
  for (let i = oneMonthAgo; i <= now; i.setDate(i.getDate() + 1)) {
    const date = new Date(i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    dates.push(formattedDate);
  }

  return dates;
};

//获取流量数据
const flowList = reactive({
  intoArr: [],
  outArr: [],
  dateArr: [],
});

const getEchartsOptions = (flowList) => {
  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,.05)", //设置背景图片 rgba格式
      borderWidth: "1", //边框宽度设置1
      borderColor: "rgba(255,255,255,0.25)", //设置边框颜色
      extraCssText: "backdrop-filter: blur(5px);",
      textStyle: {
        color: "#ffffff", //设置文字颜色
      },
    },
    legend: {
      icon: "rect",
      itemWidth: 17,
      itemHeight: 3,
      padding: 20,
      x: "left",
      y: "top",
      data: ["进", "出"],
      textStyle: {
        color: "#FFFFFF",
      },
    },
    grid: {
      left: "3%",
      right: "3%",
      top: "35%",
      bottom: "7%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        fontSize: "14px",
        color: "#FFFFFF",
        fontWeigt: 400,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#ffffff7f",
        },
      },
      data: flowList.dateArr,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: "14px",
        color: "#FFFFFF",
        fontWeigt: 400,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#ffffff7f",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#ffffff19",
        },
        width: "2px",
      },
    },
    series: [
      {
        name: "进",
        data: flowList.intoArr,
        type: "line",
        symbol: "none",
      },
      {
        name: "出",
        data: flowList.outArr,
        type: "line",
        symbol: "none",
      },
    ],
  };
};

// 获取对应的数据
const getList = async () => {
  flowList.intoArr = [];
  flowList.outArr = [];
  flowList.dateArr = [];
  const days = await lastMonthDay(dateNum.value);
  days.forEach((day) => {
    flowList.dateArr.push(day);
    flowList.outArr.push(Math.ceil(Math.random() * 100));
    flowList.intoArr.push(Math.ceil(Math.random() * 100));
  });
  const option = getEchartsOptions(flowList);
  setOptions(option);
};

//监听按钮切换
watch(
  () => dateNum.value,
  () => getList()
);
watch(
  () => typeNum.value,
  () => getList()
);

onMounted(() => {
  getList();
  startInterval();
});

onBeforeUnmount(() => {
  stopInterval();
});
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  position: relative;
  #charts {
    width: 100%;
    height: 100%;
  }
  .change-box {
    position: absolute;
    top: 15px;
    right: 19px;
    color: #ffffff7f;
    font: {
      size: 14px;
      family: PingFangSC-Regular, PingFang SC;
      weight: 400;
    }
    display: flex;
    .date-change {
      border: 1px solid #5797ff;
      display: flex;
      > div {
        width: 71px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        cursor: pointer;
        box-sizing: border-box;
      }
      :nth-child(1) {
        border-right: 1px solid #5797ff;
      }
    }
    .type-change {
      border: 1px solid #5797ff;
      display: flex;
      margin-left: 18px;
      > div {
        width: 57px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        cursor: pointer;
        border-right: 1px solid #5797ff;
        box-sizing: border-box;
      }
      :nth-last-child(1) {
        border-right: none;
      }
    }
    .active {
      background: rgba(0, 32, 74, 0.38);
      box-shadow: inset 0px 0px 9px 0px #5797ff;
      border: 1px solid #5797ff;
      color: #ffffff;
      font: {
        family: PingFangSC-Medium, PingFang SC;
        weight: 500;
      }
    }
  }
}
</style>
