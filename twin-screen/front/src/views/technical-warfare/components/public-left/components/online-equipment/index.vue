<template>
  <xl-modal-prevention
    :width="421"
    :height="320"
    :title-c="'数据共享概况'"
    :title-e="'Overview of data sharing'"
  >
    <template #main>
      <!-- 内容盒子 -->
      <div class="echarts-item">
        <!-- 图表本体 -->
        <div ref="sharingRef" class="echarts-left"></div>
        <!-- 跑马灯 两个小蓝条 -->
        <div class="marquee"></div>
        <!-- 白色边线 闪动 -->
        <div class="White-border"></div>
        <!-- 标题 -->
        <div class="textle-echarts">
          <span>{{ info.seriesName }}</span>
          <span>
            <xl-count-to
              :start="0"
              :end="info.percentage || 0"
              :auto-play="true"
              :duration="2000"
            />%
          </span>
        </div>
        <!-- 点击控制图表显示数据操作图层 -->
        <div class="echarts-button">
          <div
            v-for="(element, etIndex) in info.seriesData"
            :key="element"
            :class="`echarts-but${etIndex + 1}`"
            @click="echartsClick(etIndex)"
          >
            <span :class="[twoBtns[etIndex] ? '' : 'text-gray']">
              {{ element.name }}
            </span>
            <span :class="[twoBtns[etIndex] ? '' : 'text-gray']">
              <xl-count-to
                :start="0"
                :end="element.value || 0"
                :auto-play="true"
                :duration="2000"
              />
              <i>个</i>
            </span>
          </div>
        </div>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { XlModalPrevention, XlCountTo } from "@/components";
import { onMounted, ref } from "vue";
import { useECharts } from "@/hooks";
import echarts from "@/plugins/echarts";

const { setOptions } = useECharts("sharingRef");

let option = null;

const info = {
  seriesName: "活跃单位",
  percentage: 92,
  seriesData: [
    {
      name: "月活跃单位数",
      value: 92,
    },
    {
      name: "接入单位总数",
      value: 100,
    },
  ],
};

// 得到图表配置
const getChartOption = (info) => {
  return {
    tooltip: {
      show: true,
      backgroundColor: "rgba(255,255,255,.05)", //设置背景图片 rgba格式
      borderWidth: "1", //边框宽度设置1
      borderColor: "rgba(255,255,255,0.25)", //设置边框颜色
      extraCssText: "backdrop-filter: blur(5px);",
      textStyle: {
        color: "#ffffff", //设置文字颜色
      },
    },
    series: {
      name: info.seriesName,
      type: "pie", // 将 type 属性设置为 pie
      radius: ["75%", "85%"],
      center: ["26%", "49.3%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        show: false,
      },
      data: info.seriesData.map((element, index) => ({
        name: element.name,
        value: element.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: ["#D1FD78", "RGBA(45, 78, 136, 1)"][index] },
            {
              offset: 1,
              color: ["RGBA(209, 253, 120, 0.1)", "RGBA(45, 78, 136, 1)"][
                index
              ],
            },
          ]),
        },
      })),
    },
  };
};

// 初始化图表
const initChart = async () => {
  option = getChartOption(info);
  await setOptions(option);
};

// 两个按钮
const twoBtns = ref([true, true]);

// 点击按钮
const echartsClick = (index) => {
  let value = option.series.data[index].value;
  if (value == 0) {
    option.series.data[index].value = info.seriesData[index].value;
    twoBtns.value[index] = true;
  } else {
    option.series.data[index].value = 0;
    twoBtns.value[index] = false;
  }
  setOptions(option);
};

onMounted(() => {
  initChart();
});
</script>

<style lang="scss" scoped>
.echarts-item {
  position: relative;
  width: 100%;
  height: 100%;
  .echarts-left {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 258px;
    height: 134px;
    background: url("@/assets/icons/other/data-echarts-overview.svg");
    background-size: 100% 100%;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
  .marquee {
    position: absolute;
    top: 24.8%;
    left: 19%;
    width: 133px;
    height: 133px;
    border: 2px solid transparent;
    border-radius: 50%;
    border-left: 2px solid #5796fd;
    border-right: 2px solid #5796fd;
    animation: turn 8s linear infinite;
  }
  .White-border {
    position: absolute;
    top: 50%;
    left: 17%;
    width: 154px;
    height: 154px;
    border: 0.5px solid #3c475c;
    border-radius: 50%;
    background: url("@/assets/icons/other/data-flash.svg");
    background-size: 100% 100%;
    transform: translateY(-50%);

    animation-name: flash;
    /*动画名称*/
    animation-duration: 0.5s;
    /*设置秒数*/
    animation-timing-function: linear;
    /*速度曲线*/
    animation-iteration-count: infinite;
    /*播放次数*/
    animation-direction: alternate;
    /*逆向播放*/
    animation-play-state: running;
    /*正在运行*/
  }

  /* 标题 */
  .textle-echarts {
    position: absolute;
    top: 50%;
    left: 25%;
    transform: translateY(-50%);

    width: 90px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-radius: 30%;
    z-index: 999;
    span {
      &:nth-child(1) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &:nth-child(2) {
        font-size: 27px;
        font-family: DS-Digital-Bold;
        font-weight: 600;
        background: linear-gradient(180deg, #eefdd7 50%, #d0fd77 50%);
        -webkit-background-clip: text;
        -moz-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }
  }
  .echarts-button {
    position: absolute;
    top: 20%;
    right: 0;
    width: 140px;
    height: 150px;

    padding-left: 20px;
    padding-right: 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 999;
    .echarts-but1 {
      width: 100%;
      height: 40%;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      span {
        &:nth-child(1) {
          color: #b6b9c1;
          font-size: 14px;
          white-space: nowrap;
        }
        &:nth-child(2) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 23px;
          font-family: DS-Digital-Bold;
          font-weight: normal;
          color: #d2ff77;
          text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);

          i {
            color: #b7bac2;
            font-size: 14px;
            margin-left: 4px;
          }
        }
      }
    }
    .echarts-but2 {
      width: 100%;
      height: 40%;
      display: flex;
      flex-direction: column;
      cursor: pointer;

      span {
        &:nth-child(1) {
          color: #b6b9c1;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:nth-child(2) {
          font-size: 23px;
          font-family: DS-Digital-Bold;
          font-weight: normal;
          color: #5797ff;
          text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          i {
            color: #b7bac2;
            font-size: 14px;
            margin-left: 4px;
          }
        }
      }
    }
  }
}
/* 旋转跑马灯 */
@keyframes turn {
  100% {
    transform: rotateZ(-1turn);
  }
}

/* 闪光黄色线条 */
@keyframes flash {
  0% {
    opacity: 0.3;
  }

  100% {
    opacity: 1;
  }
}

.text-gray {
  color: #5b5b5b !important;

  i {
    color: #5b5b5b !important;
  }
}
</style>
