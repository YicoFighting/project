<template>
  <xl-modal-prevention
    :width="507"
    :height="328"
    title-c="今日预警统计"
    title-e="Today's alert statistics"
  >
    <template #main>
      <div class="main">
        <div id="annulus" ref="alertRef"></div>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { XlModalPrevention } from "@/components";
import { useECharts } from "@/hooks";
import { ref, onMounted, onBeforeUnmount } from "vue";

const { setOptions } = useECharts("alertRef");

let mTime = null;

// echarts数据
const echartsData = ref([]);
// 颜色列表
const colorList = ref([
  {
    type: "linear",
    colorStops: [
      {
        offset: 0,
        color: "rgba(179, 211, 255, 0)", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(86, 148, 255, 1)", // 100% 处的颜色
      },
    ],
  },
  {
    type: "linear",
    colorStops: [
      {
        offset: 0,
        color: "rgba(87, 208, 255, 0.18)", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(87, 208, 255, 1)", // 100% 处的颜色
      },
    ],
  },
  {
    type: "linear",
    colorStops: [
      {
        offset: 0,
        color: "rgba(87, 100, 255, 0.17)", // 0% 处的颜色
      },
      {
        offset: 1,
        color: "rgba(87, 100, 255, 1)", // 100% 处的颜色
      },
    ],
  },
]);
// 获取对应配置
const getEchartsOptions = (data) => {
  return {
    backgroundColor: "rgba(34, 45, 70, 1)",
    series: [
      //外层环形图
      {
        type: "pie",
        radius: ["60%", "75%"],
        minAngle: 50,
        avoidLabelOverlap: false,
        label: {
          borderType: "solid",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.4)",
          padding: [0, 5],
          formatter: function (data) {
            return `{b|${data.name}}  {c|${data.value}}`;
          },
          position: "outer",
          rich: {
            b: {
              fontSize: 14,
              fontFamily: "SourceHanSansCN-Normal, SourceHanSansCN",
              fontWeight: 400,
              color: "#ffffff",
              opacity: 0.7,
              lineHeight: 30,
            },
            c: {
              fontSize: 18,
              fontFamily: "DS-Digital-Bold",
              fontWeight: "normal",
              color: "#5797FF",
            },
          },
        },
        itemStyle: {
          borderColor: "rgba(34, 45, 70, 1)",
          borderWidth: 10,
        },
        //图表线和文本框颜色宽度
        labelLine: {
          show: true,
          length: 20,
          length2: 40,
          lineStyle: {
            color: "#ffffff",
            opacity: 0.4,
          },
        },
        data: [],
      },
      //内层环形图
      {
        type: "pie",
        radius: ["40%", "55%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            formatter: ["{b|{b}}", "{a|{c}}"].join("\n"),
            rich: {
              a: {
                // 中间字的数值样式
                fontSize: 24,
                lineHeight: 38,
                fontFamily: "DS-Digital-Bold",
                color: "#FFFFFF",
              },
              b: {
                // 中间字的名称样式
                fontSize: "16",
                lineHeight: 16,
                color: "#FFFFFF",
              },
            },
          },
          itemStyle: {
            color: "rgba(210, 255, 119,1)",
          },
        },
        itemStyle: {
          color: "rgba(157, 161, 173, 1)",
          borderColor: "rgba(34, 45, 70, 1)",
          borderWidth: 10,
        },
        labelLine: {
          //不显示指示线
          show: false,
        },
        data: data,
      },
    ],
  };
};
// 设置数据
const setData = async () => {
  const res = {
    code: 0,
    data: [
      {
        name: "危险行为预警",
        value: 10,
        children: [
          {
            name: "追逐打闹",
            value: 4,
          },
          {
            name: "翻越围墙",
            value: 1,
          },
          {
            name: "楼梯拥堵",
            value: 5,
          },
        ],
      },
      {
        name: "设备维修预警",
        value: 12,
        children: [
          {
            name: "宿舍走廊灯",
            value: 4,
          },
          {
            name: "教室风扇",
            value: 3,
          },
          {
            name: "宿舍热水器",
            value: 5,
          },
        ],
      },
      {
        name: "其他行为预警",
        value: 20,
        children: [
          {
            name: "上课睡觉",
            value: 8,
          },
          {
            name: "午休吵闹",
            value: 2,
          },
          {
            name: "上课走神",
            value: 10,
          },
        ],
      },
    ],
  };
  echartsData.value = res.data;
  echartsData.value.forEach((item) => {
    item.children.forEach((v, i) => {
      v.itemStyle = { color: colorList.value[i] };
    });
  });
  // 获得echarts配置
  const options = await getEchartsOptions(echartsData.value);
  options.series[0].data = options.series[1].data[0].children;
  const myChart = await setOptions(options);

  let index = 0; //高亮所在下标
  let dataLength = options.series[1].data.length; // 当前饼图有多少个扇形
  myChart.dispatchAction({
    type: "highlight", //取消高亮指定的数据图形
    seriesIndex: 1, //里层的圆形
    dataIndex: index,
  });
  mTime = setInterval(() => {
    myChart.dispatchAction({
      //触发图表行为，例如图例开关legendToggleSelect, 数据区域缩放dataZoom，显示提示框showTip等等
      type: "downplay", //取消高亮指定的数据图形
      seriesIndex: 1, //里层的圆形
      dataIndex: index % dataLength,
    });

    index++;

    myChart.dispatchAction({
      type: "highlight",
      seriesIndex: 1,
      dataIndex: index % dataLength,
    });
    options.series[0].data =
      options.series[1].data[index % dataLength].children;
    myChart && myChart.setOption(options);
  }, 10000);

  //  鼠标划入
  myChart.on("mouseover", (e) => {
    // 停止定时器，清除之前的高亮
    clearInterval(mTime);
    myChart.dispatchAction({
      type: "downplay",
      seriesIndex: 1, //清一下高亮
    });
    myChart.dispatchAction({
      type: "highlight",
      seriesIndex: 1,
      dataIndex: e.dataIndex, //当前鼠标选中的高亮
    });
    options.series[0].data = options.series[1].data[e.dataIndex].children;
    myChart && myChart.setOption(options);
  });

  myChart.on("mouseout", (e) => {
    clearInterval(mTime);
    mTime = setInterval(() => {
      // 取消高亮指定的数据图形
      myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 1,
        dataIndex: e.dataIndex % dataLength, //从当前选中完的下一个开始顺序高亮
      });
      e.dataIndex++;
      // 高亮指定的数据图形
      myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 1,
        dataIndex: e.dataIndex % dataLength,
      });
      options.series[0].data =
        options.series[1].data[e.dataIndex % dataLength].children;
      myChart && myChart.setOption(s);
    }, 10000);
  });
};

onMounted(() => {
  setData();
});

onBeforeUnmount(() => {
  mTime && clearInterval(mTime);
});
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
  #annulus {
    width: 100%;
    height: 100%;
  }
}
</style>
