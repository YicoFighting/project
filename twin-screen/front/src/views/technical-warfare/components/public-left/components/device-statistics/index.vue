<template>
  <xl-modal-prevention
    :width="948"
    :height="242"
    title-c="设备在离线统计"
    title-e="Equipment in offline statistics"
  >
    <template #main>
      <div class="device">
        <div class="left">
          <el-progress
            type="circle"
            :percentage="deviceData.percent"
            color="rgba(210, 255, 119, 1)"
          >
            <template #default="{ percentage }">
              <div class="percentage-value">{{ percentage }}%</div>
              <span class="left_span">设备在线率</span>
            </template>
          </el-progress>
        </div>
        <div id="right" ref="deviceRef"></div>
        <div class="title">
          <div><span></span>离线</div>
          <div><span></span>在线</div>
        </div>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { XlModalPrevention } from "@/components";
import result from "../../data/device-statistics.json";
import echarts from "@/plugins/echarts";
import { useECharts } from "@/hooks";

const deviceData = reactive({
  percent: 0,
  offlineArr: [],
  onlineArr: [],
  deviceNameArr: [],
});

const { setOptions } = useECharts("deviceRef");

const getEchartsOptions = (deviceData) => {
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
      //自定义提示框内容
      formatter: function (params) {
        return `<div style='width:120px'>
            <p style='margin:0'>${params[0].name}</p>
            <p style='margin:5px'><span style='display: inline-block;
      width: 8px;
      height: 8px;
      background: #5694fb;
      border-radius: 8px;'></span> ${params[0].seriesName}：${params[0].value}</p>
            <p style='margin:5px'><span style='display: inline-block;
      width: 8px;
      height: 8px;
      background: #d2ff77;
      border-radius: 8px;'></span> ${params[1].seriesName}：${params[1].value}</p>
          </div>`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "8%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: deviceData.deviceNameArr,
      //设置x轴字体及刻度线颜色
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(189, 193, 200, 1)",
        },
      },
      axisTick: {
        //x轴刻度线
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      //设置图表刻度为虚线
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          opacity: "0.1",
        },
      },
      //设置y轴字体及刻度线颜色
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(189, 193, 200, 1)",
        },
      },
    },
    series: [
      {
        name: "离线",
        type: "bar",
        data: deviceData.offlineArr,
        // showBackground: true,
        barGap: 1,
        color: "#5694FB",
        barWidth: 10,
        markArea: {
          //  提示图表标域，常用于标记图表中某个范围的数据
          itemStyle: {
            color: "rgba(200, 239, 255, 0.15)",
          },
          data: [
            [{ x: "10%" }, { x: "18%" }],
            [{ x: "21%" }, { x: "29%" }],
            [{ x: "32%" }, { x: "40%" }],
            [{ x: "43%" }, { x: "51%" }],
            [{ x: "54%" }, { x: "62%" }],
            [{ x: "65%" }, { x: "73%" }],
            [{ x: "76%" }, { x: "84%" }],
            [{ x: "87%" }, { x: "95%" }],
          ],
        },
        //柱状图设置渐变色
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              // 四个数字分别对应 数组中颜色的开始位置，分别为 右，下，左，上。例如（1,0,0,0 ）代表从右边开始渐
              // 变。offset取值为0~1，0代表开始时的颜色，1代表结束时的颜色，柱子表现为这两种颜色的渐变。
              offset: 0,
              color: "rgba(87, 151, 255, 0)",
            },
            {
              offset: 1,
              color: "rgba(87, 151, 255, 1)",
            },
          ]),
        },
      },
      {
        name: "在线",
        type: "bar",
        data: deviceData.onlineArr,
        // showBackground: true,
        color: "#D2FF77",
        // barGap: 0,
        barWidth: 10,
        //柱状图设置渐变色
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              // 四个数字分别对应 数组中颜色的开始位置，分别为 右，下，左，上。例如（1,0,0,0 ）代表从右边开始渐
              // 变。offset取值为0~1，0代表开始时的颜色，1代表结束时的颜色，柱子表现为这两种颜色的渐变。
              offset: 0,
              color: "rgba(210, 255, 119, 0)",
            },
            {
              offset: 1,
              color: "rgba(210, 255, 119, 1)",
            },
          ]),
        },
      },
    ],
  };
};

// 设置数据
const setData = async () => {
  // progress
  deviceData.percent = parseFloat(result.data.percent.replace("%", ""));
  // echarts
  result.data.deviceCount.forEach((item) => {
    deviceData.offlineArr.push(item.offline);
    deviceData.onlineArr.push(item.online);
    deviceData.deviceNameArr.push(item.deviceTypeName);
  });
  // 获得echarts配置
  const options = await getEchartsOptions(deviceData);

  setOptions(options);
};

onMounted(() => {
  setData();
});
</script>

<style lang="scss" scoped>
.device {
  width: 100%;
  height: 100% !important;
  display: flex;
  color: #fff;
  position: relative;
  .left {
    width: 164px;
    height: 124px;
    background: url("@images/technical-prevention/device.png") no-repeat;
    background-size: 100% 100%;
    margin: 50px 34px 0px 46px;
    :deep(.el-progress-circle) {
      width: 71px !important;
      height: 53px !important;
    }
    .left_span {
      white-space: nowrap;
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 24px;
      text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    }
    .percentage-value {
      font-size: 31px;
      font-family: DS-Digital-Bold;
      font-weight: normal;
      color: #d2ff77;
      line-height: 49px;
      margin-top: -20px;
      margin-left: -30px;
    }
  }
  #right {
    flex: 1;
    height: 100%;
  }
}
.title {
  position: absolute;
  top: -40px;
  right: 16px;
  display: flex;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  div:nth-child(1) {
    margin-right: 33px;
    line-height: 18px;
    span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #5694fb;
      border-radius: 8px;
      margin-right: 7px;
    }
  }
  div:nth-child(2) {
    line-height: 18px;
    margin-right: 17px;
    span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #d2ff77;
      border-radius: 8px;
      margin-right: 7px;
    }
  }
}
:deep(.el-progress) {
  margin-left: 49px;
  margin-top: 4px;
}
:deep(.el-progress-circle) {
  transform: skew(-46deg, 29deg);
}
:deep(.el-progress__text) {
  margin-left: -20px;
  margin-top: -15px;
}
</style>
