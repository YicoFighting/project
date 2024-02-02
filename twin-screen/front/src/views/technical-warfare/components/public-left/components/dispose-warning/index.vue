<template>
  <xl-modal-prevention
    :width="421"
    :height="328"
    title-c="预警处置统计"
    title-e="Early warning "
    @mouseover="stopInterval"
    @mouseleave="startInterval"
  >
    <template #main>
      <div class="main">
        <div id="dispose" ref="disposeRef"></div>
        <div class="bg"></div>
        <div class="dispose-change">
          <div :class="[dateNum === 7 ? 'active' : '']" @click="dateSelect(7)">
            近7天
          </div>
          <div
            :class="[dateNum === 30 ? 'active' : '']"
            @click="dateSelect(30)"
          >
            近30天
          </div>
        </div>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { XlModalPrevention } from "@/components";
import { ref, onMounted, watch } from "vue";
import { useECharts } from "@/hooks";

const { setOptions } = useECharts("disposeRef");

const dateNum = ref(30);
const intervalId = ref();

// 切换日期选择
const dateSelect = (val) => {
  dateNum.value = val;
};

//按钮循环高亮并切换数据
const startInterval = () => {
  intervalId.value = setInterval(() => {
    dateNum.value = dateNum.value === 7 ? 30 : 7;
  }, 10000);
};

//划入清除高亮
const stopInterval = () => {
  clearInterval(intervalId.value);
};

// 获取数据
const getWarningOpetion = (day) => {
  if (day == 7) {
    return {
      code: 0,
      data: [
        {
          name: "误报",
          num: 3,
          operationType: "1",
        },
        {
          name: "自行处置",
          num: 6,
          operationType: "2",
        },
        {
          name: "推送家长",
          num: 5,
          operationType: "3",
        },
        {
          name: "报送第三方",
          num: 4,
          operationType: "4",
        },
      ],
      msg: "ok",
    };
  } else {
    return {
      code: 0,
      data: [
        {
          name: "误报",
          num: 12,
          operationType: "1",
        },
        {
          name: "自行处置",
          num: 20,
          operationType: "2",
        },
        {
          name: "推送家长",
          num: 15,
          operationType: "3",
        },
        {
          name: "报送第三方",
          num: 23,
          operationType: "4",
        },
      ],
      msg: "ok",
    };
  }
};

// echarts数据
const echartsData = ref([]);

// 获取对应配置
const getEchartsOptions = (data) => {
  return {
    //图例的配置
    legend: {
      orient: "vertical",
      left: "270",
      top: "50",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 29,
      formatter: (name) => {
        let value;
        for (let i = 0; i < data.length; i++) {
          if (data[i].name == name) {
            value = data[i].num;
          }
        }
        if (name == "自行处置") {
          return `  {a|${name}}  {b1|${value}}`;
        } else if (name == "误报") {
          return `  {a|${name}}  {b|${value}}`;
        } else if (name == "报送第三方") {
          return `  {a|${name}}  {b3|${value}}`;
        } else if (name == "推送家长") {
          return `  {a|${name}}  {b2|${value}}`;
        }
      },
      textStyle: {
        rich: {
          a: {
            fontSize: 14,
            fontFamily: "PingFangSC-Regular, PingFang SC",
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 20,
          },
          b: {
            fontSize: 16,
            fontFamily: "DS-Digital-Bold",
            fontWeight: "normal",
            lineHeight: "25",
            color: "#5797FF",
            textShadow: "0px 1px 1px rgba(0,0,0,0.5)",
          },
          b1: {
            fontSize: 16,
            fontFamily: "DS-Digital-Bold",
            fontWeight: "normal",
            lineHeight: "25",
            color: "#FFA958",
            textShadow: "0px 1px 1px rgba(0,0,0,0.5)",
          },
          b2: {
            fontSize: 16,
            fontFamily: "DS-Digital-Bold",
            fontWeight: "normal",
            lineHeight: "25",
            color: "#D2FF77",
            textShadow: "0px 1px 1px rgba(0,0,0,0.5)",
          },
          b3: {
            fontSize: 16,
            fontFamily: "DS-Digital-Bold",
            fontWeight: "normal",
            lineHeight: "25",
            color: "#FDFFFF",
            textShadow: "0px 1px 1px rgba(0,0,0,0.5)",
          },
        },
      },
    },
    backgroundColor: "rgba(34, 45, 70, 1)",
    color: ["#5797FF", "#FFA958", "#D2FF77", "#FDFFFF"],
    series: [
      {
        type: "pie",
        radius: ["46%", "67%"],
        center: ["35%", "50%"],
        avoidLabelOverlap: false,
        minAngle: 10,
        label: {
          show: false,
        },
        itemStyle: {
          borderColor: "rgba(34, 45, 70, 1)",
          borderWidth: 10,
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };
};

// 获取数据
const getList = () => {
  const res = getWarningOpetion(dateNum.value);
  if (res.code == 0) {
    echartsData.value = res.data;
    echartsData.value.forEach((item) => {
      item.value = item.num;
    });
    const option = getEchartsOptions(echartsData.value);
    setOptions(option);
  }
};

//监听按钮切换
// watch(
//   () => dateNum.value,
//   () => getList()
// );

onMounted(() => {
  getList();
  // startInterval();
});
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
  #dispose {
    width: 100%;
    height: 100%;
  }
  .bg {
    width: 185px;
    height: 185px;
    position: absolute;
    background: url("@images/technical-prevention/dispose_bg.png") no-repeat
      center;
    background-size: 100% 100%;
    left: 54px;
    top: 43px;
  }
  .dispose-change {
    border: 1px solid #5797ff;
    display: flex;
    position: absolute;
    top: -43px;
    right: 19px;
    > div {
      width: 71px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      cursor: pointer;
      box-sizing: border-box;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    :nth-child(1) {
      border-right: 1px solid#5797ff;
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
</style>
