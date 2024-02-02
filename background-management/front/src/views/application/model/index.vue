<template>
  <div class="map">
    <div class="gis" ref="gis" id="gis"></div>
    <div class="box-select">
      <el-button type="primary" @click="startSelect">开始框选</el-button>
      <el-button @click="stopSelect">结束框选</el-button>
    </div>
    <div class="equipment">
      派出所列表：<el-tree-select
        v-model="checkedPolice"
        :data="list"
        multiple
        :render-after-expand="false"
        :default-expanded-keys="['0']"
        show-checkbox
        placeholder="请选择派出所"
        collapse-tags
        @change="changeSelect"
      />
      <el-tree-v2
        ref="leftTree"
        :data="treeData"
        :props="props"
        show-checkbox
        :height="treeHeight"
        value-key="apeId"
        :default-expanded-keys="[
          'all_0',
          'group_0',
          'group_1',
          'type_0',
          'type_1',
          'type_2',
          'type_3',
        ]"
      />
    </div>
    <div class="switch">
      <div class="switch-item">
        辖区显示
        <el-switch
          v-model="jurisdictionDisplay"
          :style="switchStyle"
          @change="switchAllAreaLayer($event)"
        />
      </div>
      <div class="switch-item">
        公安摄像头
        <div class="desc">
          <img
            src="@images/application/model/ga.webp"
            class="desc-img"
            alt="公安摄像头"
          />
          <el-switch
            v-model="gasxt"
            :style="switchStyle"
            @change="switchLayer($event, 'ga')"
          />
        </div>
      </div>
      <div class="switch-item">
        社会面摄像头
        <div class="desc">
          <img
            src="@images/application/model/shm.png"
            class="desc-img"
            alt="社会面摄像头"
          />
          <el-switch
            v-model="shmsxt"
            :style="switchStyle"
            @change="switchLayer($event, 'shm')"
          />
        </div>
      </div>
      <div class="switch-item">
        全部/框选设备
        <el-switch
          v-model="showBoxSelect"
          :style="switchStyle"
          @change="changeBoxSelect($event)"
        />
      </div>
    </div>
    <div class="select-devices">
      <el-tree-v2
        ref="rightTree"
        :data="rightDevices"
        :props="props"
        show-checkbox
        :height="rightTreeHeight"
        value-key="apeId"
        :default-expanded-keys="['right_0']"
        :default-checked-keys="['right_0']"
      />
      <div class="btns">
        <el-button @click="rightCancel">取消</el-button>
        <el-button type="primary" @click="rightConfirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue";

import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import XYZ from "ol/source/XYZ.js";
import Point from "ol/geom/Point.js";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style.js";
import { boundingExtent } from "ol/extent";
import gaIcon from "@images/application/model/ga.webp";
import shmIcon from "@images/application/model/shm.png";

import {
  getFeature,
  addClusterLayer,
  mapSelect,
  drawJurisdiction,
} from "@/utils";

import { list } from "./data/pcslist";
import dataA from "./data/devices/320509510000.json";
import dataB from "./data/devices/320509520000.json";
import dataC from "./data/devices/320509530000.json";
import dataD from "./data/devices/320509540000.json";
import dataE from "./data/devices/320509550000.json";
import dataF from "./data/devices/320509560000.json";
import dataG from "./data/devices/320509570000.json";
import dataH from "./data/devices/320509580000.json";
import dataI from "./data/devices/320509590000.json";
import dataJ from "./data/devices/320509600000.json";
import dataK from "./data/devices/320509610000.json";
import dataL from "./data/devices/320509640000.json";
import dataM from "./data/devices/320509650000.json";
import dataN from "./data/devices/320509660000.json";
import dataO from "./data/devices/320509670000.json";
import dataP from "./data/devices/320509680000.json";
import dataQ from "./data/devices/320509690000.json";
import dataR from "./data/devices/320509700000.json";
import dataS from "./data/devices/320509710000.json";
import dataT from "./data/devices/320509730000.json";

const Icons = {
  shm: shmIcon,
  ga: gaIcon,
};

const showBoxSelect = ref(false);

let map = null;

const leftTree = ref(null);
const rightTree = ref(null);

// 是否显示辖区
const jurisdictionDisplay = ref(true);
const gasxt = ref(true);
const shmsxt = ref(true);
const switchStyle = `--el-switch-on-color: rgba(43, 78, 255, 1);--el-switch-off-color: rgba(43, 78, 255, 0.2);`;

const mapData = {
  320509510000: dataA,
  320509520000: dataB,
  320509530000: dataC,
  320509540000: dataD,
  320509550000: dataE,
  320509560000: dataF,
  320509570000: dataG,
  320509580000: dataH,
  320509590000: dataI,
  320509600000: dataJ,

  320509610000: dataK,
  320509640000: dataL,
  320509650000: dataM,
  320509660000: dataN,
  320509670000: dataO,
  320509680000: dataP,
  320509690000: dataQ,
  320509700000: dataR,
  320509710000: dataS,
  320509730000: dataT,
};

const checkedPolice = ref(["320509730000"]);

const getTreeData = (obj) => {
  return [
    {
      apeId: "all_0",
      deviceName: "全部",
      children: [
        {
          apeId: "group_0",
          deviceName: "社会面",
          children: [
            {
              apeId: "type_0",
              deviceName: "车辆卡口",
              children: obj?.社会面_车辆卡口 ?? [],
            },
          ],
        },
        {
          apeId: "group_1",
          deviceName: "公安",
          children: [
            {
              apeId: "type_1",
              deviceName: "车辆卡口",
              children: obj?.公安_车辆卡口 ?? [],
            },
            {
              apeId: "type_2",
              deviceName: "人员卡口",
              children: obj?.公安_人员卡口 ?? [],
            },
            {
              apeId: "type_3",
              deviceName: "其他",
              children: obj?.公安_其他 ?? [],
            },
          ],
        },
      ],
    },
  ];
};

const props = {
  value: "apeId",
  label: "deviceName",
  children: "children",
};

// 虚拟树-数据
const treeData = ref(getTreeData([]));

// 虚拟树节点高度
const treeHeight = computed(() => {
  const nowHeight = window
    .getComputedStyle(document.body)
    .height.replace("px", "");
  return (nowHeight / 1080) * 760;
});
const rightTreeHeight = computed(() => {
  const nowHeight = window
    .getComputedStyle(document.body)
    .height.replace("px", "");
  return (nowHeight / 1080) * 360;
});

// 标记layer(公安或社会面)
const markerLayer = ref({
  shm: {},
  ga: {},
});
// 区域layer(20个区域)
const areaLayer = ref({});

// 得到地图上设备的数据
const getDevices = (obj) => {
  const newObj = {
    shm: [],
    ga: [],
  };
  const keys = Object.keys(obj);
  keys.map((key) => {
    if (key.startsWith("社会面")) {
      newObj.shm.push(...obj[key]);
    } else {
      newObj.ga.push(...obj[key]);
    }
  });
  return newObj;
};

// 下拉选择框改变时
const changeSelect = async () => {
  const arr = {
    社会面_车辆卡口: [],
    公安_车辆卡口: [],
    公安_人员卡口: [],
    公安_其他: [],
  };

  // 下拉选择框数据
  for (let i = 0; i < checkedPolice.value.length; i++) {
    const element = checkedPolice.value[i];
    const result = mapData[element];
    const oneArr = {
      社会面_车辆卡口: [],
      公安_车辆卡口: [],
      公安_人员卡口: [],
      公安_其他: [],
    };
    for (let j = 0; j < Object.keys(arr).length; j++) {
      const key = Object.keys(arr)[j];
      if (key.startsWith("社会面")) {
        result[key].forEach((item) => {
          item.isShm = true;
          return item;
        });
      }
      arr[key].push(...(result?.[key] ?? []));
      oneArr[key].push(...(result?.[key] ?? []));
    }
    // 辖区：找到没有生成过areaLayer的数据,生成对应的layer
    // 不管显示隐藏,都是要做的;要不然后面没有数据来进行切换
    const area = list[0].children.find(
      (item) =>
        item.value == element &&
        !Object.keys(areaLayer.value).includes(item.value)
    );
    if (area) {
      const { generateLayer } = drawJurisdiction(map, area, areaLayer.value);
      // 区域图层
      areaLayer.value = {
        ...areaLayer.value,
        ...generateLayer,
      };
    }
    const shmLayer = Object.keys(markerLayer.value.shm);
    const gaLayer = Object.keys(markerLayer.value.ga);
    const allLayer = Array.from(new Set([...shmLayer, ...gaLayer]));
    if (!allLayer.includes(element)) {
      // 设备：
      const markers = getDevices(oneArr);
      Object.keys(markers).forEach((key) => {
        const features = markers[key].map((tree) => {
          return getFeature({
            type: key,
            info: tree,
            geometry: new Point(fromLonLat([tree.longitude, tree.latitude])),
          });
        });
        const style = new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            src: Icons[key],
            scale: 0.4,
          }),
        });
        const layer = addClusterLayer(map, features, style);
        markerLayer.value[key][element] = layer;
      });
    }
  }

  // 树形数据
  nextTick(() => {
    treeData.value = getTreeData(arr);
  });

  /** ----------地图辖区------------ */
  if (jurisdictionDisplay.value) {
    const area = [];
    const unArea = [];
    Object.keys(areaLayer.value).forEach((key) => {
      if (checkedPolice.value.includes(key)) {
        area.push(key);
      } else {
        unArea.push(key);
      }
    });
    // 增加辖区
    switchAllAreaLayer(true, area);
    // 减少辖区
    switchAllAreaLayer(false, unArea);
  } else {
    switchAllAreaLayer(false);
  }
  /** ----------地图辖区------------ */

  /** ----------设备设备------------ */
  if (shmsxt.value) {
    const area = [];
    const unArea = [];
    Object.keys(markerLayer.value.shm).forEach((key) => {
      if (checkedPolice.value.includes(key)) {
        area.push(key);
      } else {
        unArea.push(key);
      }
    });
    // 增加社会面设备
    switchPcsLayer(true, "shm", area);
    // 减少社会面设备
    switchPcsLayer(false, "shm", unArea);
  } else {
    switchLayer(false, "shm");
  }

  if (gasxt.value) {
    const area = [];
    const unArea = [];
    Object.keys(markerLayer.value.ga).forEach((key) => {
      if (checkedPolice.value.includes(key)) {
        area.push(key);
      } else {
        unArea.push(key);
      }
    });
    // 增加公安设备
    switchPcsLayer(true, "ga", area);
    // 减少公安设备
    switchPcsLayer(false, "ga", unArea);
  } else {
    switchLayer(false, "ga");
  }
  /** ----------设备设备------------ */
};

// 管理全部
const manageAll = (e, key) => {
  Object.values(markerLayer.value[key]).forEach((item) => {
    item.setVisible(e);
  });
};

const manageSelect = (e, key) => {
  Object.values(selectLayer.value[key]).forEach((item) => {
    item.setVisible(e);
  });
};

// 切换显示layer
const switchLayer = (e, key) => {
  // 在框选下只管框选
  if (showBoxSelect.value) {
    // 在全部下只管全部
    manageSelect(e, key);
  } else {
    manageAll(e, key);
  }
};

const selectLayer = ref({
  shm: {},
  ga: {},
});

const addRightLayer = (target, node) => {
  const feature = getFeature({
    type: target,
    info: node,
    geometry: new Point(fromLonLat([node.longitude, node.latitude])),
  });
  const style = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      src: Icons[target],
      scale: 0.4,
    }),
  });
  const layer = addClusterLayer(map, [feature], style);
  selectLayer.value[target][node.apeId] = layer;
};

const generateSelectLayer = () => {
  const nodes = leftTree.value.getCheckedNodes();
  const shmLayer = Object.keys(selectLayer.value.shm);
  const gaLayer = Object.keys(selectLayer.value.ga);
  const allLayer = Array.from(new Set([...shmLayer, ...gaLayer]));

  nodes.forEach((node) => {
    if (node.apeId.startsWith("device") && !allLayer.includes(node.apeId)) {
      if (node.isShm) {
        addRightLayer("shm", node);
      } else {
        addRightLayer("ga", node);
      }
    }
  });
};

// 全部/框选设备
const changeBoxSelect = (e) => {
  // 全部标记的设置为false 框选设备的设为true
  if (e) {
    generateSelectLayer();
    switchLayer(true, "ga");
    switchLayer(true, "shm");
    manageAll(false, "ga");
    manageAll(false, "shm");
    // 全部标记的设置为true 框选设备的设为false
  } else {
    switchLayer(true, "ga");
    switchLayer(true, "shm");
    manageSelect(false, "ga");
    manageSelect(false, "shm");
  }
};

// 切换显示派出所下的设备layer
const switchPcsLayer = (e, key, data) => {
  data.forEach((item) => {
    const layer = markerLayer.value[key][item];
    layer.setVisible(e);
  });
};

// 切换当前区域的layer
const switchAllAreaLayer = (e, keys = checkedPolice.value) => {
  keys.forEach((key) => {
    areaLayer.value[key].setVisible(e);
  });
};

let endSelectFn = null;
const selectDevices = ref([]);
const rightDevices = ref([]);
// 开始框选
const startSelect = () => {
  const { startBoxSelect, endBoxSelect } = mapSelect(map, isDrawing);
  startBoxSelect(markerLayer.value, selectDevices);
  endSelectFn = endBoxSelect;
};
// 结束框选
const stopSelect = () => {
  endSelectFn && endSelectFn();
  rightDevices.value = [
    {
      apeId: "right_0",
      deviceName: "全部",
      children: selectDevices.value,
    },
  ];
};

const onClickIcon = () => {
  // 鼠标移入变成hover状态
  map.on("pointermove", function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? "pointer" : "";
  });

  map.on("click", (evt) => {
    if (isDrawing.value) return;
    const pixel = evt.pixel;
    map.forEachFeatureAtPixel(pixel, (feature) => {
      // true表示点击的是地图
      if (!feature.get("type")) {
        const property = feature.getProperties();
        const features = property.features;
        // 这个点是聚合点
        if (features.length > 1) {
          const extent = boundingExtent(
            features.map((r) => r.getGeometry().getCoordinates())
          );
          map
            .getView()
            .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] });
        } else {
          console.log(features[0].get("info"));
          // if (feature.get("info")) {
          //   const basicInfo = feature.get("info") ?? {};
          //   info.value = { ...basicInfo, type: feature.get("type") };
          //   const position = feature.getGeometry().getCoordinates();
          //   overlayInstance && overlayInstance.setPosition(position);
          // }
        }
      }
    });
  });
};

// 右侧取消
const rightCancel = () => {
  selectDevices.value = [];
  rightDevices.value = [
    {
      apeId: "right_0",
      deviceName: "全部",
      children: [],
    },
  ];
  rightTree.value.setCheckedKeys([]);
};
// 右侧确定
const rightConfirm = () => {
  const keys = rightTree.value.getCheckedKeys();
  const newKeys = keys.filter((key) => key !== "right_0");
  leftTree.value.setCheckedKeys(newKeys);
  rightCancel();
};

const isDrawing = ref(false);

onMounted(() => {
  const center = fromLonLat([120.638317, 31.159815]);
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
          // OpenCycleMap
          // url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Transport
          url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Landscape
          // url: "https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Outdoors
          // url: "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Transport Dark
          // url: "https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Spinal Map
          // url: "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Pioneer
          // url: "https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Mobile Atlas
          // url: "https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Neighbourhood
          // url: "https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
          // Atlas
          // url: "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=bf38e5d8ba12436e9e1be368139e1c6e",
        }),
      }),
    ],
  });
  changeSelect();
  onClickIcon();
});
</script>

<style lang="scss" scoped>
.map {
  position: relative;
  width: 100%;
  height: 100%;
  .gis {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .box-select {
    position: absolute;
    width: 500px;
    height: 40px;
    top: 20px;
    left: 40px;
    display: flex;
    justify-content: flex-end;
  }
  .equipment {
    position: absolute;
    width: 500px;
    height: 800px;
    top: 100px;
    left: 40px;
    background: #f4f5fa;
    backdrop-filter: blur(10px);
    opacity: 0.7; /* 调整透明度，可根据需要更改值 */
    border-radius: 10px;
    padding: 20px;
  }
  .switch {
    position: absolute;
    width: 200px;
    height: 300px;
    top: 100px;
    right: 40px;
    background: #f4f5fa;
    backdrop-filter: blur(10px);
    opacity: 0.7; /* 调整透明度，可根据需要更改值 */
    border-radius: 10px;
    padding: 20px;
    .desc {
      display: flex;
      align-items: center;
      &-img {
        display: block;
        width: 34px;
        height: 40px;
        object-fit: cover;
        margin-right: 20px;
      }
    }
  }
  .select-devices {
    position: absolute;
    width: 200px;
    height: 400px;
    top: 450px;
    right: 40px;
    background: #f4f5fa;
    backdrop-filter: blur(10px);
    opacity: 0.7; /* 调整透明度，可根据需要更改值 */
    border-radius: 10px;
    padding: 20px;
    .btns {
      margin-top: 10px;
    }
  }
}
</style>
