<template>
  <div class="wrap">
    <div class="top">
      <div class="error">
        <xl-echarts title="数据对账异常统计" :options="options"></xl-echarts>
      </div>

      <div class="pie">
        <xl-echarts
          title="数据类型占比"
          :options="pieOptions"
          :callback="callback"
        ></xl-echarts>
      </div>
    </div>

    <div class="line">
      <xl-echarts title="数据对账趋势分析" :options="lineOptions"></xl-echarts>
    </div>

    <div class="map">
      <gz-map></gz-map>
    </div>
  </div>
</template>

<script setup>
import { XlEcharts } from "@/components";
import { GzMap } from "./components";

const options = {
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    formatter: "{b}<br />{a0}: {c0}<br />{a1}: {c1}",
    axisPointer: {
      type: "shadow",
    },
    backgroundColor: "rgba(255,255,255,.05)",
    borderWidth: "1",
    borderColor: "rgba(255,255,255,0.25)",
    extraCssText: "backdrop-filter: blur(5px);",
    textStyle: {
      color: "#293054",
      fontStyle: "normal",
      fontFamily: "微软雅黑",
      fontSize: 12,
    },
  },
  grid: {
    left: "2%",
    right: "2%",
    bottom: "2%",
    top: "14%",
    containLabel: true,
  },
  legend: {
    right: 10,
    top: 0,
    itemGap: 16,
    itemWidth: 10,
    itemHeight: 10,
    data: [
      {
        name: "入库数据量",
      },
      {
        name: "接入数据量",
      },
    ],
    textStyle: {
      color: "#293054",
      fontStyle: "normal",
      fontFamily: "微软雅黑",
      fontSize: 12,
    },
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: [
        "依图人脸采集",
        "丰图档案信息",
        "赋能中心警务",
        "三所车辆解析",
        "三所车辆解析",
        "科达一机一档",
      ],
      axisLabel: {
        interval: 0,
        margin: 15,

        color: "#293054",
        fontStyle: "normal",
        fontFamily: "微软雅黑",
        fontSize: 12,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(67,88,151,0.22)",
        },
      },
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      splitNumber: 5,
      axisLabel: {
        color: "#293054",
        fontStyle: "normal",
        fontFamily: "微软雅黑",
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(67, 88, 151, 0.22)",
          type: "dashed",
        },
      },
    },
  ],
  series: [
    {
      name: "入库数据量",
      type: "bar",
      data: [49, 73, 92, 56, 77, 56, 42, 36, 60, 64],
      barWidth: 10,
      barGap: 0,
      label: {
        itemStyle: {
          show: true,
          position: "top",
          textStyle: {
            color: "#fff",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12,
          },
        },
      },
      itemStyle: {
        color: "#143BFF",
        borderRadius: [5, 5, 0, 0], //（顺时针左上，右上，右下，左下）
      },
    },
    {
      name: "接入数据量",
      type: "bar",
      data: [29, 50, 44, 27, 57, 46, 12, 27, 48, 60],
      barWidth: 10,
      barGap: 0.2,
      label: {
        itemStyle: {
          show: true,
          position: "top",
          textStyle: {
            color: "#fff",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12,
          },
        },
      },
      itemStyle: {
        color: "#00D7FF",
        borderRadius: [5, 5, 0, 0], //（顺时针左上，右上，右下，左下）
      },
    },
  ],
};

const lineOptions = {
  backgroundColor: "transparent",
  legend: {
    show: true,
    icon: "rect",
    right: 10,
    top: 0,
    itemWidth: 7,
    itemHeight: 7,
    itemGap: 25,
    textStyle: {
      fontSize: 12,
      color: "#293054",
    },
  },
  grid: {
    left: "2%",
    right: "2%",
    bottom: "2%",
    top: "14%",
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "line",
      lineStyle: {
        color: "#293054",
        opacity: 0.25,
      },
    },
    backgroundColor: "rgba(255,255,255,.05)",
    borderWidth: "1",
    borderColor: "rgba(255,255,255,0.25)",
    extraCssText: "backdrop-filter: blur(5px);",
    textStyle: {
      color: "#293054",
      fontStyle: "normal",
      fontFamily: "微软雅黑",
      fontSize: 12,
    },
  },
  xAxis: [
    {
      type: "category",
      data: [
        "8月21日",
        "8月22日",
        "8月23日",
        "8月24日",
        "8月25日",
        "8月26日",
        "8月27日",
        "8月28日",
      ],
      axisLine: {
        lineStyle: {
          color: "rgba(67,88,151,0.22)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        margin: 15,

        color: "#293054",
        fontStyle: "normal",
        fontFamily: "微软雅黑",
        fontSize: 12,
      },
      boundaryGap: true,
    },
  ],
  yAxis: [
    {
      type: "value",
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: "#293054",
        fontStyle: "normal",
        fontFamily: "微软雅黑",
        fontSize: 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(67,88,151,0.22)",
          type: "dashed",
        },
      },
    },
  ],
  series: [
    {
      name: "数据对账准确率",
      type: "line",
      data: [13, 10, 3, 20, 65, 30, 20, 7],
      symbolSize: 2,
      symbol: "circle",
      smooth: true,
      lineStyle: {
        width: 1,
        color: "#143BFF",
      },
      itemStyle: {
        color: "rgba(20,59,255,1)",
        borderColor: "#143BFF",
      },
      areaStyle: {
        color: {
          colorStops: [
            {
              offset: 0,
              color: "rgba(20,59,255,1)",
            },
            {
              offset: 1,
              color: "rgba(20,59,255, .01)",
            },
          ],
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          type: "linear",
          global: false,
        },
      },
      emphasis: {
        itemStyle: {
          borderColor: "#143BFF",
          borderWidth: 2.5,
        },
      },
    },
    {
      name: "数据对账错误率",
      type: "line",
      data: [5, 12, 11, 4, 25, 90, 15, 2],
      symbolSize: 2,
      symbol: "circle",
      smooth: true,
      lineStyle: {
        width: 1,
        color: "#00D7FF",
      },
      itemStyle: {
        color: "#00D7FF",
        borderColor: "#00D7FF",
      },
      areaStyle: {
        color: {
          colorStops: [
            {
              offset: 0,
              color: "rgba(0,215,255, 1)",
            },
            {
              offset: 1,
              color: "rgba(0,215,255, .01)",
            },
          ],
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          type: "linear",
          global: false,
        },
      },
      emphasis: {
        itemStyle: {
          borderColor: "#00D7FF",
          borderWidth: 2.5,
        },
      },
    },
  ],
};

const pieOptions = {
  grid: {
    left: "2%",
    right: "2%",
    bottom: "2%",
    top: "14%",
    containLabel: true,
  },
  legend: {
    orient: "vertical",
    top: "middle",
    right: 20,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: "#8893AA",
      fontSize: 14,
    },
  },
  series: [
    {
      type: "pie",
      center: ["30%", "50%"],
      radius: ["65%", "75%"],
      color: ["#143BFF", "#01D315", "#00D7FF", "#FFAD09"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderColor: "#fff",
        borderWidth: 3,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          formatter: ["{a|{d}%}", "{b|{b}}"].join("\n"),
          rich: {
            a: {
              color: "#1D3973",
              fontSize: 30,
              height: 30,
              lineHeight: 30,
            },
            b: {
              color: "#8893AA",
              fontSize: 14,
              height: 16,
              lineHeight: 16,
            },
          },
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "视图数据" },
        { value: 735, name: "物联数据" },
        { value: 580, name: "非感知类结构化数据" },
        { value: 484, name: "其他数据" },
      ],
    },
  ],
};

const callback = (instance) => {
  instance.dispatchAction({
    type: "highlight",
    seriesIndex: 0,
    dataIndex: 0,
  });

  instance.on("mouseover", { seriesType: "pie" }, function (params) {
    // name 为 'my_el' 的元素被 'mouseup' 时，此方法被回调。
    const { seriesIndex, dataIndex } = params;
    instance.dispatchAction({
      type: "downplay",
    });

    instance.dispatchAction({
      type: "highlight",
      seriesIndex,
      dataIndex,
    });
  });

  instance.on("mouseout", function (params) {
    instance.dispatchAction({
      type: "downplay",
    });
  });

  instance.getZr().on("click", function (event) {
    // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
    if (!event.target) {
      // 点击在了空白处，做些什么。
      instance.dispatchAction({
        type: "downplay",
      });

      instance.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0,
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  .map {
    width: 100%;
    height: 812px;
    margin-bottom: 20px;
  }
  .top {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
  }
  .error {
    flex: 1 0 0;
    height: 360px;
    margin-right: 20px;
  }

  .pie {
    width: 600px;
    height: 360px;
  }

  .line {
    width: 100%;
    height: 400px;
    margin-bottom: 20px;
  }
}
</style>
