<template>
  <div class="score" id="score"></div>
</template>

<script setup>
import { Chart } from "@antv/g2";
import { onMounted } from "vue";

const data = [
  {
    checkScore: 34.32,
    ranges: 80,
    sourceName: "数据源1",
  },
  {
    checkScore: 54.6,
    ranges: 80,
    sourceName: "数据源2",
  },
  {
    checkScore: 67.4,
    ranges: 80,
    sourceName: "数据源3",
  },
  {
    checkScore: 78.6,
    ranges: 80,
    sourceName: "数据源4",
  },
  {
    checkScore: 43.5,
    ranges: 80,
    sourceName: "数据源5",
  },
  {
    checkScore: 34.32,
    ranges: 80,
    sourceName: "数据源6",
  },
];

onMounted(() => {
  const chart = new Chart({
    container: "score",
    autoFit: true,
    pixelRatio: window.devicePixelRatio,
  });

  chart.data(data);

  chart
    .interval()
    .encode("x", "sourceName")
    .encode("y", "ranges")
    .encode("color", "#1E2640")
    .style("maxWidth", 25)
    .axis({
      x: {
        title: false,
      },
      y: {
        title: false,
      },
    });

  chart
    .interval()
    .encode("x", "sourceName")
    .encode("y", "checkScore")
    .axis("y", {
      title: false,
      label: true,
      tick: false,
      labelFill: "#fff",
      grid: true,
      gridStroke: "#fff",
      gridLineWidth: 1,
    })
    .axis("x", {
      title: false,
      titleStroke: "#fff",
      label: true,
      tick: false,
      labelFill: "#fff",
    })
    .style("fill", "l(90) 0:rgba(86, 150, 253, 1) 1:rgba(38, 55, 84, 1)")
    .style("maxWidth", 25)
    .style("cursor", "pointer")
    .state("active", { fill: "l(90) 0:#D1FE77 1:#394849" })
    .interaction("elementHighlight", true)
    .tooltip({
      title: false,
      items: [
        (d, i, data, column) => ({
          name: d["sourceName"],
          value: column.y.value[i].toFixed(1),
        }),
      ],
    });

  chart.render();
});
</script>

<style lang="scss" scoped>
.score {
  width: 100%;
  height: 100%;
}
</style>
