<template>
  <div class="box">
    <div class="gis" id="gis"></div>
    <div class="btns">
      <el-button type="primary" @click="startBoxSelect">开始框选</el-button>
      <el-button @click="endBoxSelect">取消框选</el-button>
    </div>
  </div>
</template>

<script setup name="normal-gis">
import Map from "ol/Map.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { Cluster, Vector as VectorSource } from "ol/source.js";
import {
  Icon,
  Style,
  Circle as CircleStyle,
  Stroke,
  Fill,
  Text,
} from "ol/style.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { createEmpty, extend as Extend, boundingExtent } from "ol/extent";
import { Draw, Snap } from "ol/interaction.js";
import { onMounted, ref } from "vue";
import markerIcon from "@images/gis/residence-icon.png";

let map = null; // 地图实例
let addInteractions = null; //开始框选函数
let deleteInteractions = null; //取消框选函数
const isDrawing = ref(false); // 是否正在框选
let clusters = null; // 点位图层

const boxSelect = (map) => {
  /** ==============框选================== */
  let draw, snap;
  const boxSource = new VectorSource();
  // 样式
  const boxStyle = new Style({
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: new Stroke({
      color: "#33cc33",
      width: 2,
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: "#ffcc33",
      }),
    }),
  });
  // 图层
  const boxVector = new VectorLayer({
    source: boxSource,
    style: boxStyle,
  });

  map.addLayer(boxVector);

  // 框选
  addInteractions = () => {
    draw = new Draw({
      source: boxSource,
      type: "Polygon",
    });
    map.addInteraction(draw);
    snap = new Snap({ source: boxSource });
    map.addInteraction(snap);

    draw.on("drawstart", (e) => {
      isDrawing.value = true;
    });

    draw.on("drawend", (e) => {
      isDrawing.value = false;

      // 获取圆的外接矩形范围
      const area = e.feature.getGeometry();
      const extent = area.getExtent();

      if (clusters) {
        const features = clusters.getSource().getFeaturesInExtent(extent);

        // 遍历feature数组
        features.forEach(function (feature) {
          // 处理每个feature
          const properties = feature.getProperties();
          // properties.features 是一个数组
          properties.features.forEach((property) => {
            console.log(property.get("info"));
          });
        });
      }
    });
  };

  // 取消框选
  deleteInteractions = () => {
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    map.removeLayer(boxVector);
  };

  /** ==============框选================== */
};

// 开始框选
const startBoxSelect = () => {
  map && boxSelect(map);
  addInteractions && addInteractions();
};

// 取消框选
const endBoxSelect = () => {
  deleteInteractions && deleteInteractions();
};

// 设置围栏
const enclosure = (routeSource, map) => {
  // 围栏
  let extent = null;
  extent = createEmpty();
  routeSource.forEachFeature((feature) => {
    Extend(extent, feature.getGeometry().getExtent());
  });
  map.getView().fit(extent, { padding: [20, 20, 20, 20] });
};

const generatePointData = (arr = [], max = 10000) => {
  for (let i = 1; i < max; i++) {
    arr.push({
      id: i,
      point: [
        120.63376568592098 + (Math.random() - 0.5) * 1.5,
        31.285184871341635 + (Math.random() - 0.5) * 1.5,
      ],
    });
  }
  return arr;
};

onMounted(async () => {
  const trackInfo = await generatePointData();
  const center = fromLonLat([120.63376568592098, 31.285184871341635]);
  // 地图实例
  map = new Map({
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
          //OSM Cycle Map
          url: "http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
        }),
      }),
    ],
  });

  const count = trackInfo.length;
  // 风格
  const features = new Array(count);
  for (let i = 0; i < count; i++) {
    features[i] = new Feature({
      geometry: new Point(fromLonLat(trackInfo[i]?.point)),
      info: {
        title: "标题一" + i,
      },
    });
  }
  // 资源
  const source = new VectorSource({
    features,
  });

  const clusterSource = new Cluster({
    distance: parseInt(40),
    minDistance: parseInt(20),
    source,
  });

  const styleCache = {};
  clusters = new VectorLayer({
    source: clusterSource,
    style: function (feature) {
      const size = feature.get("features").length;
      if (size > 1) {
        let style = styleCache[size];
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: "#fff",
              }),
              fill: new Fill({
                color: "#3399CC",
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: "#fff",
              }),
            }),
          });
          styleCache[size] = style;
        }
        return style;
      } else {
        return new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            src: markerIcon,
            scale: 0.4,
          }),
        });
      }
    },
  });

  map.addLayer(clusters);

  // 鼠标移入变成hover状态
  map.on("pointermove", function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? "pointer" : "";
  });

  // 点击时放大聚合点
  map.on("click", (e) => {
    if (!isDrawing.value) {
      clusters.getFeatures(e.pixel).then((clickedFeatures) => {
        if (clickedFeatures.length) {
          // Get clustered Coordinates
          const features = clickedFeatures[0].get("features");

          // 这个点是聚合点
          if (features.length > 1) {
            const extent = boundingExtent(
              features.map((r) => r.getGeometry().getCoordinates())
            );
            map
              .getView()
              .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
          }
        }
      });
    }
  });
});
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  width: 100%;
  height: 100%;
  .gis {
    width: 100%;
    height: 100%;
  }
  .btns {
    position: absolute;
    top: 80px;
    left: 20px;
  }
}
</style>
