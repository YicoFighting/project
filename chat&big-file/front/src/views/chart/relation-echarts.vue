<script setup name="relation-diagram">
import echarts from "@/plugins/echarts";
import relation from "@/assets/images/relation.webp";
import { nextTick, onMounted, ref } from "vue";

// 节点图标
const relationSymbol = "image://" + relation;
//canvas的高度、y轴最大刻度
const domHeight = ref(0);

//树数据
const origin = {
  name: "ods_zd_into",
  children: [
    {
      parentId: "ods_zd_into",
      name: "2-1",
      children: [
        {
          parentId: "2-1",
          name: "3-1",
        },
        {
          parentId: "2-1",
          name: "3-2",
        },
      ],
    },
    {
      parentId: "ods_zd_into",
      name: "2-2",
      children: [
        {
          parentId: "2-2",
          name: "3-3",
        },
        {
          parentId: "2-2",
          name: "3-4",
        },
      ],
    },
  ],
};

//计算树每一行的元素个数
const getTree = (origin) => {
  const obj = {};
  const calculateTree = (origin, row = 0) => {
    obj[row] = obj[row] ?? 0;
    const child = origin.children;
    if (child) {
      obj[row] += child.length;
      row++;
      child.forEach((grand) => {
        calculateTree(grand, row);
      });
    }
  };
  calculateTree(origin);
  return obj;
};

//将数据加入至echarts类型数组
const replacement = (origin, obj, depth, maxHeight) => {
  const arr = [];
  const dividend = Object.assign({}, obj);
  const fn = (origin, obj, depth, maxHeight, row = 0) => {
    const childs = origin.children;
    if (childs) {
      row++;
      childs.forEach((child) => {
        arr.push({
          name: child["name"],
          linkTargetName: child["parentId"],
          coordConfig: {
            level: row,
          },
          value: [
            depth - row,
            (maxHeight * obj[row - 1]) / (dividend[row - 1] + 1),
          ],
          draggable: false,
          fixed: true,
          symbol: relationSymbol,
          symbolSize: 53,
        });
        obj[row - 1]--;
        fn(child, obj, depth, maxHeight, row);
      });
    }
  };
  fn(origin, obj, depth, maxHeight);
  return arr;
};

//糅合数据
const mashUpData = async (data) => {
  const obj = await getTree(data);
  const depth = Object.keys(obj)?.length;
  const maxHeight = Math.max(...Object.values(obj)) * 150;
  domHeight.value = maxHeight;
  const arr = await replacement(data, obj, depth - 1, maxHeight);
  arr.unshift({
    name: data["name"],
    linkTargetName: data["name"],
    value: [depth - 1, maxHeight / 2],
    draggable: false,
    fixed: true,
    symbol: relationSymbol,
    symbolSize: 53,
  });
  return arr;
};

onMounted(() => {
  nextTick(async () => {
    const chartDom = document.getElementById("main");
    let nodeDataList = await mashUpData(origin);
    const myChart = echarts.init(chartDom, null, {
      height: domHeight.value,
    });
    let option;

    myChart.resize();

    let getCoordDataList = () => {
      let coorDataDict = {};
      let defaultConfig = {
        type: "lines",
        coordinateSystem: "cartesian2d",
        z: 1,
        effect: {
          //显示
          show: true,
          smooth: true,
          trailLength: 0,
          //箭头
          symbol: "arrow",
          //颜色
          color: "#028FA6",
          //大小
          symbolSize: 10,
          //速度
          period: 3,
          //延时
          delay: 0,
          //循环
          loop: true,
        },
        lineStyle: {
          curveness: 0,
          //线颜色
          color: "#028FA6",
          //线宽度
          width: 1,
        },
        data: [],
      };
      nodeDataList.map((item) => {
        if (item.coordConfig !== undefined) {
          if (!(item.coordConfig.level in coorDataDict)) {
            let coorConfig = JSON.parse(JSON.stringify(defaultConfig));
            if (item.coordConfig.lineStyle !== undefined) {
              coorConfig.lineStyle = item.coordConfig.lineStyle;
            }
            if (item.coordConfig.effect !== undefined) {
              coorConfig.effect = item.coordConfig.effect;
            }
            coorDataDict[item.coordConfig.level] = coorConfig;
          }

          let coordData = [
            item.value,
            nodeDataList.filter((i) => i.name === item.linkTargetName)[0].value,
          ];
          coorDataDict[item.coordConfig.level].data.push({
            coords: coordData,
          });
          if (item.coordConfig.bilateral) {
            coorDataDict[item.coordConfig.level].data.push({
              coords: coordData.reverse(),
            });
          }
        }
      });
      return Object.values(coorDataDict);
    };

    option = {
      //用于确定图标位置
      xAxis: {
        show: false,
      },
      yAxis: {
        show: false,
        max: domHeight.value,
      },
      grid: {
        show: false,
        top: "0%",
        left: "3.5%",
        right: "3.5%",
        bottom: "3.5%",
        containLabel: false,
      },
      series: [
        {
          type: "graph",
          coordinateSystem: "cartesian2d",
          emphasis: {
            // hoverAnimation: false,
            scale: false,
          },
          nodeScaleRatio: false,
          //focusNodeAdjacency: true,
          // roam: false,
          //图形下面的文字
          label: {
            position: "bottom",
            show: true,
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
          },
          //图形颜色
          itemStyle: {
            color: "#028FA6",
          },
          data: nodeDataList,
        },
      ].concat(getCoordDataList()),
    };
    console.log(option);
    option && myChart.setOption(option);
  });
});
</script>

<template>
  <div id="main" class="main"></div>
</template>

<style lang="less" scoped>
.main {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  :deep(canvas) {
    &:hover {
      cursor: default;
    }
  }
}
</style>
