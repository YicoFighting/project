<template>
  <div ref="map3d" class="map3d"></div>
</template>

<script setup>
import echarts from "@/utils/echarts";
import { onMounted, ref } from "vue";
import http from "@/services";

const map3d = ref(null);

onMounted(async () => {
  try {
    // 来源：https://datav.aliyun.com/portal/school/atlas/area_selector
    const mapJson = await http.get(
      "https://geo.datav.aliyun.com/areas_v3/bound/360000_full.json"
    );

    const mapData = [
      {
        name: "兴国",
        value: [115.35205287052659, 26.312225152640213],
        type: "normal",
        // img: this.examSite,
        symbol: "circle",
      },
    ];

    const instance = echarts.init(map3d.value, null, { renderer: "svg" });

    instance.showLoading();

    // 注册地图
    echarts.registerMap("ganzhou", mapJson);

    const option = {
      // 地理坐标系组件
      geo: [
        {
          // registerMap注册的地图名称
          map: "ganzhou",
          // 是否可缩放
          roam: false,
          // 地图层级
          zlevel: 2,
          label: {
            show: false,
          },
          emphasis: {
            show: false,
          },

          itemStyle: {
            areaColor: "rgba(43, 78, 255, 0.2)",
            borderWidth: 1,
            borderColor: "rgba(43, 78, 255, 1)",
            shadowColor: "rgba(43, 78, 255, 1)",
            shadowBlur: 1,
          },
          // 高亮样式
          emphasis: {
            itemStyle: {
              areaColor: "rgba(43, 78, 255, 1)",
            },
          },
        },
        // 这一个是为了仿3D地图，故创建一个低层级的一模一样的地图
        {
          map: "ganzhou",
          roam: false,
          zlevel: 1,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
            },
          },
          itemStyle: {
            areaColor: "rgba(43, 78, 255, 0.2)",
            shadowColor: "rgba(43, 78, 255, 1)",
            shadowOffsetX: 0,
            shadowOffsetY: 10,
          },
        },
      ],
      series: [
        {
          type: "map",
          map: "ganzhou",
          zlevel: 2,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
            },
            textStyle: {
              color: "#fff",
            },
          },
          roam: false,
          itemStyle: {
            areaColor: "rgba(43, 78, 255, 0.2)",
            borderColor: "rgba(43, 78, 255, 1)",
            borderWidth: 1,
          },
          emphasis: {
            disabled: true,
            itemStyle: {
              areaColor: "rgba(43, 78, 255, 1)",
            },
          },
          // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
          silent: true,
        },
        // 波纹涟漪
        {
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 3,
          symbol: "circle",
          data: mapData,
        },
      ],
    };

    instance.setOption(option);

    instance.hideLoading();

    window.addEventListener("resize", function () {
      instance.resize();
    });
  } catch (error) {
    console.log(error);
  }
});
</script>

<style lang="scss" scoped>
.map3d {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
