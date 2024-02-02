<template>
  <div class="gis" id="gis"></div>
</template>

<script setup name="normal-gis">
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import { fromLonLat } from "ol/proj";
import { onMounted } from "vue";

onMounted(() => {
  const center = fromLonLat([120.638317, 31.159815]);

  new Map({
    target: "gis",
    loadTilesWhileAnimating: true,
    view: new View({
      center: center,
      zoom: 15,
      minZoom: 4,
      maxZoom: 18,
    }),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
        }),
      }),
    ],
  });
});
</script>

<style lang="scss" scoped>
.gis {
  width: 100%;
  height: 100%;
}
</style>
