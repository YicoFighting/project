<template>
  <div class="point">
    <div id="allmap"></div>
    <div class="btn">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { useScriptTag } from "@vueuse/core";
import { onBeforeUnmount, onMounted, ref } from "vue";

const { load, unload } = useScriptTag(
  "https://api.map.baidu.com/getscript?v=3.0&ak=1Ezs7OSm5EZ4Rz30LwTkE7Tqf0mFPY1M",
  () => {
    // 加载完的回调函数
  },
  { manual: true }
);

let map = null;
let marker = null;
const isMarker = ref(false);

const setOverlay = (e) => {
  const { lng, lat } = e.point;
  const point = new BMap.Point(lng, lat);
  // 重新设置位置
  if (isMarker.value) {
    marker.setPosition(point);
  } else {
    marker = new BMap.Marker(point); // 创建标注
    map.addOverlay(marker); // 将标注添加到地
    isMarker.value = true;
  }
  marker.enableDragging(); // 允许标记进行拖动``
};

// 点击保存
const save = () => {
  if (marker) {
    const { lng, lat } = marker.getPosition();
    const point = new BMap.Point(lng, lat); // 创建点坐标
    const geoc = new BMap.Geocoder();
    geoc.getLocation(point, ({ address }) => {
      localStorage.setItem(
        "point",
        JSON.stringify({
          lng,
          lat,
          address,
        })
      );
    });
  }
};

const initMap = async () => {
  await load();

  // 创建地图实例
  map = new BMap.Map("allmap", {
    coordsType: 5, // coordsType指定输入输出的坐标类型，3为gcj02坐标，5为bd0ll坐标，默认为5。
    enableMapClick: false,
  });
  const point = new BMap.Point(120.644485, 31.288875); // 创建点坐标
  map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  // 设置样式;
  map.setMapStyleV2({
    styleId: "ef89847589874ed9e7ba629decab2dd0",
  });

  let local = localStorage.getItem("point");
  if (local) {
    local = JSON.parse(local);
    const { lng, lat, address } = local;

    setOverlay({
      point: {
        lng,
        lat,
      },
    });
  }

  map.addEventListener("click", setOverlay);
};

onMounted(() => {
  initMap();
});

onBeforeUnmount(async () => {
  await unload();
  map.removeEventListener("click", setOverlay);
});
</script>

<style lang="scss" scoped>
.point {
  position: relative;
  width: 100%;
  height: 100%;
  #allmap {
    width: 100%;
    height: 100%;
    :deep(.anchorBL) {
      display: none;
    }
  }
  .btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
}
</style>
