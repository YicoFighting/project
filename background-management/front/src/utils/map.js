import { Feature } from "ol";
import { Style, Circle as CircleStyle, Stroke, Fill, Text } from "ol/style.js";
import { Cluster, Vector as VectorSource } from "ol/source.js";
import VectorLayer from "ol/layer/Vector";
import { createEmpty } from "ol/extent";
import { Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Draw, Snap } from "ol/interaction.js";

// import WKT from "ol/format/WKT";
// import GeoJSON from "ol/format/GeoJSON";

/**
 * 传入配置,返回feature
 * @param {*} obj
 * @returns
 */
const getFeature = (obj) => new Feature(obj);

/**
 * 传入features,返回source
 * @param {Array} features
 * @returns
 */
const getSource = (features) =>
  new VectorSource({
    features,
  });

/**
 * 添加标记
 * @param {*} map 地图实例
 * @param {Array} features 数据风格
 * @param {*} style 数据样式
 * @param {*} zIndex 数据层级
 */
const addTags = (map, features, style, zIndex = 10) => {
  const source = getSource(features);

  const layer = new VectorLayer({
    source,
    style,
    zIndex,
  });

  map.addLayer(layer);

  return layer;
};

/**
 * 添加标记(带缩放)
 * @param {*} map 地图实例
 * @param {Array} features 数据风格
 * @param {*} style 数据样式
 * @param {*} zIndex 数据层级
 * @param {*} distance 最大距离
 * @param {*} minDistance 最小距离
 */
const addClusterLayer = (
  map,
  features,
  style,
  zIndex = 10,
  distance = 40,
  minDistance = 20
) => {
  let clusters = null;

  const source = getSource(features);

  const clusterSource = new Cluster({
    distance,
    minDistance,
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
        return style;
      }
    },
    zIndex,
  });

  map.addLayer(clusters);

  return clusters;
};

/**
 * 设置围栏
 * @param {*} sources 地图所有的source
 * @param {*} map
 */
const enclosure = (sources, map) => {
  // 围栏
  let extent = null;
  extent = createEmpty();
  sources.forEachFeature((feature) => {
    Extend(extent, feature.getGeometry().getExtent());
  });
  map.getView().fit(extent, { padding: [20, 20, 20, 20] });
};

const mapSelect = (map, isDrawing) => {
  let addInteractions = null; //开始框选函数
  let deleteInteractions = null; //取消框选函数

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
    addInteractions = (layers, selectDevices) => {
      draw = new Draw({
        source: boxSource,
        type: "Polygon",
      });
      map.addInteraction(draw);
      snap = new Snap({ source: boxSource });
      map.addInteraction(snap);

      const combinedSource = new VectorSource();

      // 将要合并的 source 添加到 combinedSource 中
      Object.values(layers).forEach((type) => {
        Object.values(type).map((layer) => {
          const source = layer.getSource();
          combinedSource.addFeatures(source.getFeatures());
        });
      });

      draw.on("drawstart", (e) => {
        isDrawing.value = true;
      });

      draw.on("drawend", (e) => {
        // 获取圆的外接矩形范围
        const area = e.feature.getGeometry();
        const extent = area.getExtent();

        // console.log(layers);

        if (combinedSource) {
          const features = combinedSource.getFeaturesInExtent(extent);

          // // 遍历feature数组
          features.forEach((feature) => {
            // 处理每个feature
            const properties = feature.getProperties();
            // properties.features 是一个数组
            properties.features.forEach((property) => {
              const info = property.get("info");
              selectDevices.value.push(info);
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
      isDrawing.value = false;
    };

    /** ==============框选================== */
  };

  // 开始框选
  const startBoxSelect = (layers, selectDevices) => {
    map && boxSelect(map);
    addInteractions && addInteractions(layers, selectDevices);
  };

  // 取消框选
  const endBoxSelect = () => {
    deleteInteractions && deleteInteractions();
  };

  return { startBoxSelect, endBoxSelect };
};

const convertCoordinatesPolices = (points) => {
  return points.map((point) => {
    let newPoint = point.split(",");
    return [newPoint[0], newPoint[1]];
  });
};

const drawJurisdiction = (map, jurisdiction, areaLayer = {}) => {
  let colors = [
    "rgba(255, 87, 0, 0.25)",
    "rgba(23, 114, 69, 0.25)",
    "rgba(0, 166, 90, 0.25)",
    "rgba(123, 31, 162, 0.25)",
    "rgba(153, 102, 204, 0.25)",
    "rgba(235, 64, 52, 0.25)",
    "rgba(128, 70, 27, 0.25)",
    "rgba(51, 187, 255, 0.25)",
    "rgba(255, 187, 51, 0.25)",
    "rgba(239, 71, 111, 0.25)",
    "rgba(0, 204, 153, 0.25)",
    "rgba(128, 208, 208, 0.25)",
    "rgba(255, 255, 0, 0.25)",
    "rgba(250, 164, 58, 0.25)",
    "rgba(0, 102, 255, 0.25)",
    "rgba(204, 102, 102, 0.25)",
    "rgba(69, 47, 32, 0.25)",
    "rgba(51, 204, 204, 0.25)",
    "rgba(153, 128, 250, 0.25)",
    "rgba(255, 102, 102, 0.25)",
  ];

  const areaKeys = Object.keys(areaLayer);
  const generateLayer = {};

  // 拿到辖区数据
  const { coordinates, value } = jurisdiction;
  if (!areaKeys.includes(value)) {
    // 分割开来
    const points = coordinates.split(";");
    // 变成数组[,]
    const newPoints = convertCoordinatesPolices(points);
    const projectedCoordinates = newPoints.map((point) => fromLonLat(point));
    const geometry = new Polygon([projectedCoordinates]);

    // const format = new WKT();
    // const wktString = format.writeGeometry(geometry);
    // const polygon = format.readGeometry(wktString);

    // 覆盖层样式
    const styleFunction = () => {
      return new Style({
        fill: new Fill({
          color: colors[areaKeys.length], // 设置填充颜色和透明度
        }),
      });
    };
    // 风格
    const feature = new Feature({
      geometry,
      type: "area",
    });
    // 设置样式
    feature.setStyle(styleFunction);
    // 图层
    const layer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
        zIndex: 2,
      }),
    });
    // 添加layer
    generateLayer[value] = layer;
    // 添加图层
    map.addLayer(layer);
  }

  return { generateLayer };
};

export {
  getFeature,
  getSource,
  addTags,
  addClusterLayer,
  enclosure,
  mapSelect,
  drawJurisdiction,
};
