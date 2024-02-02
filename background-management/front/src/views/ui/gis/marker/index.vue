<template>
  <div class="box">
    <div class="gis" id="gis"></div>
    <div class="popup" id="popup">
      <div class="close" @click="close">x</div>
      <div class="desc" v-if="info?.longlat">
        经纬度：{{ info?.longlat[0] + "," + info?.longlat[1] }}
      </div>
      <div class="desc">描述：{{ info?.desc }}</div>
    </div>
    <div class="track">
      <div
        class="track-item"
        v-for="track in trackInfo"
        :key="track"
        @click="focusPoint(track.id)"
      >
        <div class="avatar">
          <img :src="track.url" alt="" />
        </div>
        <div class="desc">
          <div class="time">{{ track.time }}</div>
          <div class="text">{{ track.desc }}</div>
        </div>
      </div>
    </div>
    <div class="operation">
      <el-button type="primary" @click="startRunBtn">开始运动</el-button>
      <el-button @click="stopRunBtn">停止运动</el-button>
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
import VectorSource from "ol/source/Vector.js";
import {
  Icon,
  Style,
  Stroke,
  Circle as CircleStyle,
  Fill,
  Text,
} from "ol/style.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import Overlay from "ol/Overlay.js";
import LineString from "ol/geom/LineString.js";
import { createEmpty, extend as Extend } from "ol/extent";
import { getVectorContext } from "ol/render.js";
import { onMounted, ref } from "vue";
import markerIcon from "@images/gis/residence-icon.png";
import serialIcon from "@images/gis/serial.png";

let map = null; // 地图实例
let overlayInstance = null; // 弹框标记
const info = ref({});
let markers = []; // 用于点击列表聚焦

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

const trackInfo = [
  {
    id: 1,
    point: [120.63376568592098, 31.285184871341635],
    time: "2023-09-28 11:30:00",
    desc: "这是起点",
    url: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/p9/p97l5e.jpg?w=400&h=200&fmt=webp",
  },
  {
    id: 2,
    point: [120.63350403986813, 31.285144767271134],
    time: "2023-09-28 11:32:00",
    desc: "这是途经点1",
    url: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/p9/p97l5e.jpg?w=400&h=200&fmt=webp",
  },
  {
    id: 3,
    point: [120.63384082560714, 31.28320359515863],
    time: "2023-09-28 11:34:00",
    desc: "这是途经点2",
    url: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/p9/p97l5e.jpg?w=400&h=200&fmt=webp",
  },
  {
    id: 4,
    point: [120.63098086962657, 31.28298366016194],
    time: "2023-09-28 11:36:00",
    desc: "这是途经点3",
    url: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/p9/p97l5e.jpg?w=400&h=200&fmt=webp",
  },
  {
    id: 5,
    point: [120.63111737146492, 31.283553135758133],
    time: "2023-09-28 11:40:00",
    desc: "这是终点",
    url: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/small/p9/p97l5e.jpg?w=400&h=200&fmt=webp",
  },
];

const trackList = [
  [120.63376568592098, 31.285184871341635],
  [120.63350403986813, 31.285144767271134],
  [120.63384082560714, 31.28320359515863],
  [120.63098086962657, 31.28298366016194],
  [120.63111737146492, 31.283553135758133],
];

const close = () => {
  overlayInstance && overlayInstance.setPosition(undefined);
};

let startRun = null;
let stopRun = null;

const startRunBtn = () => {
  startRun && startRun();
};

const stopRunBtn = () => {
  stopRun && stopRun();
};

// 聚焦到某个点
const focusPoint = (id) => {
  const feature = markers.find((feature) => feature.get("info")?.id == id);
  const basicInfo = feature.get("info") ?? {};
  info.value = { ...basicInfo, type: feature.get("type") };
  const center = fromLonLat(basicInfo.point);
  const position = feature.getGeometry().getCoordinates();
  overlayInstance && overlayInstance.setPosition(position);

  // 设置中心点并运动
  map &&
    map.getView().animate({
      center,
    });
};

// 添加序号图标
const addSerial = (map, trackInfo, i) => {
  const track = trackInfo[i];
  const feature = new Feature({
    geometry: new Point(fromLonLat(track.point)),
    info: {
      index: ++i + 99,
    },
  });

  const source = new VectorSource({
    features: [feature],
  });

  const layer = new VectorLayer({
    source: source,
    style: function (feature) {
      const index = feature.get("info")?.index;
      return new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          src: serialIcon,
          scale: 0.4,
          displacement: [0, 15],
        }),
        text: new Text({
          font: "600 14px PingFangSC-Semibold,PingFang SC",
          text: index.toString(),
          fill: new Fill({
            color: "#fff",
          }),
          offsetY: -15,
        }),
      });
    },
    zIndex: i + 4,
  });

  map.addLayer(layer);
};

onMounted(async () => {
  // 弹框
  overlayInstance = new Overlay({
    element: document.getElementById("popup"),
    positioning: "bottom-center",
    stopEvent: false,
    offset: [0, -20],
  });
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
    overlays: [overlayInstance],
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "http://tile.thunderforest.com/cycle/{z}/{x}/{y}.png",
        }),
      }),
    ],
  });

  // 添加标记
  const fn = () => {
    return trackInfo.map((track) => {
      return new Feature({
        type: "icon",
        geometry: new Point(fromLonLat(track.point)),
        info: track,
      });
    });
  };
  // 路线
  markers = await fn();
  // 将坐标系转成墨卡托投影
  const convertCoordinates = (points) => {
    return points.map((point) => {
      return fromLonLat(point);
    });
  };
  // 转换后的路径
  const tracks = await convertCoordinates(trackList);
  // geometry
  const geometry = new LineString(tracks);
  // 路径
  const routeFeature = new Feature({
    type: "route",
    geometry,
  });
  let position = new Point(geometry.getFirstCoordinate());
  // 运动点位
  const geoMarker = new Feature({
    type: "geoMarker",
    geometry: position,
  });

  // 样式
  const styles = {
    icon: new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        src: markerIcon,
        scale: 0.4,
      }),
    }),
    route: new Style({
      stroke: new Stroke({
        width: 6,
        color: [237, 212, 0, 0.8],
      }),
    }),
    geoMarker: new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: "black" }),
      }),
    }),
  };

  // 区分出三个layer,然后编写层级
  const routeSource = new VectorSource({
    features: [routeFeature],
  });
  const routeLayer = new VectorLayer({
    source: routeSource,
    style: function (feature) {
      return styles[feature.get("type")];
    },
    zIndex: 1,
  });
  map.addLayer(routeLayer);

  const geoSource = new VectorSource({
    features: [geoMarker],
  });
  const geoLayer = new VectorLayer({
    source: geoSource,
    style: function (feature) {
      return styles[feature.get("type")];
    },
    zIndex: 2,
  });
  map.addLayer(geoLayer);

  const markerSource = new VectorSource({
    features: [...markers],
  });
  const markerLayer = new VectorLayer({
    source: markerSource,
    style: function (feature) {
      return styles[feature.get("type")];
    },
    zIndex: 3,
  });
  map.addLayer(markerLayer);

  // 添加序号 每一个序号图标都是不一样的图层,防止重叠
  for (let i = 0; i < trackInfo.length; i++) {
    await addSerial(map, trackInfo, i);
  }

  // 单独设置围栏的
  const source = new VectorSource({
    features: [routeFeature, geoMarker, ...markers],
  });
  enclosure(source, map);

  let distance = 0;
  let lastTime;

  function moveFeature(event) {
    const speed = Number(80);
    const time = event.frameState.time;
    const elapsedTime = time - lastTime;
    distance = (distance + (speed * elapsedTime) / 1e6) % 2;
    lastTime = time;

    if (distance > 1) return stopRun && stopRun();

    const currentCoordinate = geometry.getCoordinateAt(
      distance > 1 ? 2 - distance : distance
    );
    position.setCoordinates(currentCoordinate);
    const vectorContext = getVectorContext(event);
    vectorContext.setStyle(styles.geoMarker);
    vectorContext.drawGeometry(position);
    // tell OpenLayers to continue the postrender animation
    map.render();
  }

  startRun = () => {
    lastTime = Date.now();
    geoLayer.on("postrender", moveFeature);
    // hide geoMarker and trigger map render through change event
    geoMarker.setGeometry(null);
  };

  stopRun = () => {
    // Keep marker at current animation position
    geoMarker.setGeometry(position);
    geoLayer.un("postrender", moveFeature);
  };

  // 鼠标移入变成hover状态
  map.on("pointermove", function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? "pointer" : "";
  });
  // 点击地图
  map.on("click", function (evt) {
    const pixel = evt.pixel;
    map.forEachFeatureAtPixel(pixel, (feature) => {
      if (feature.get("info")) {
        const basicInfo = feature.get("info") ?? {};
        info.value = { ...basicInfo, type: feature.get("type") };
        const position = feature.getGeometry().getCoordinates();
        overlayInstance && overlayInstance.setPosition(position);
      }
    });
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
  .popup {
    position: relative;
    width: 248px;
    height: 217px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #e2f1ff;
    padding: 30px 20px;
    background: url("@images/gis/address-diog.png") no-repeat center / 100% 100%;
    .close {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .track {
    position: absolute;
    top: 100px;
    left: 20px;
    width: 200px;
    height: 355px;
    z-index: 999;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8);
    &-item {
      padding: 5px;
      height: 60px;
      display: flex;
      border-top: 1px dashed rgba(0, 0, 0, 0.1);
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 5px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .desc {
        flex: 1 0 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        overflow: hidden;
        .time {
          // flex: 1 0 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .text {
          overflow: hidden;
        }
      }
      &:hover {
        cursor: pointer;
        background: rgba(255, 255, 255, 1);
      }
    }
  }
  .operation {
    position: absolute;
    top: 100px;
    left: 240px;
  }
}
</style>
