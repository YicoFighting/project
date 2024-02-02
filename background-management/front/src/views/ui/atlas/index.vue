<template>
  <div class="wrap">
    <div class="relationGraph" id="relationGraph"></div>
    <!-- 框选 -->
    <div
      :class="[
        'box-select',
        selectModel ? 'active-select' : 'un-active-select',
      ]"
      @click="changeMouseModel"
    ></div>

    <!-- 导出 -->
    <div class="export" @click="save">导出关系数据</div>

    <!-- 菜单 -->
    <div v-show="showMenu" ref="menu" class="menu">
      <div class="flex handle-container">
        <div class="handle-btn">
          <el-button type="primary" class="active-parimary" @click="expansion">
            关系扩展
          </el-button>
        </div>
        <div class="handle-btn">
          <el-button type="primary" class="active-parimary" @click="archives">
            全息档案
          </el-button>
        </div>
        <div v-if="trackTypes.includes(menuType)" class="handle-btn">
          <el-button type="primary" class="active-parimary" @click="track">
            融合轨迹
          </el-button>
        </div>
        <div class="handle-btn">
          <el-button type="primary" class="active-parimary" @click="onDelete">
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { getInitialNode, getExpandNode } from "@/services/ui/atlas";
import peopleIcon from "@images/ui/people-icon.png";
import carIcon from "@images/ui/car-icon.png";
import caseIcon from "@images/ui/case-icon.png";

// 获取组件实例
const { proxy } = getCurrentInstance();
// 存在轨迹的点类型
const trackTypes = ["people", "car"];
// 加载中...
const loading = ref(false);
// 图谱实例
let graphVis = null;
// 是否展示菜单
const showMenu = ref(false);
// 菜单id
const menuId = ref(null);
// 菜单 点type
const menuType = ref(null);
// 框选模式
const selectModel = ref(false);
// 原始数据(第一次的数据)
let originData = {};

// graphvis 全局配置(点击节点或空白节点,移入或移除节点)
const visConfig = {
  node: {
    // 节点的默认配置
    label: {
      // 标签配置
      show: true, // 是否显示
      color: "70, 240, 255", // 字体颜色
      font: "14px 微软雅黑", // 字体大小及类型
      wrapText: false, // 节点包裹文字 (节点大小由文字大小决定，绘制较耗性能)
      textPosition: "Bottom_Center", // 文字位置 Middle_Center,Bottom_Center
      textOffsetY: 8, //文字竖向偏移距离
      //background:'250,250,250', //文字背景颜色
      //borderColor:'100,120,220' //背景边框
    },
    shape: "circle", // 节点形状 circle
    color: "17, 39, 42", // 节点颜色
    borderColor: "0,251,255", // 边框颜色
    borderWidth: 2, // 边框宽度,
    lineDash: [0], // 边框虚线间隔,borderWidth>0时生效
    alpha: 1, // 节点透明度
    size: 80, // 节点大小
    selected: {
      // 选中时的样式设置
      borderColor: "0,251,255", // 选中时边框颜色
      borderAlpha: 1, // 选中时的边框透明度
      borderWidth: 4, // 选中是的边框宽度
      showShadow: true, // 是否展示阴影
      shadowBlur: 30, //阴影范围大小
      shadowColor: "0,251,255", // 选中是的阴影颜色
    },
    // 节点单击显示菜单
    onClick: function (event, node) {
      // 记录点击信息
      menuType.value = node.properties.pointType;
      menuId.value = node.properties.pointId;

      // 菜单容器
      const rect = document
        .getElementById("relationGraph")
        .getBoundingClientRect(); // 获取画布相对于视窗的位置
      const mouseX = event.clientX - rect.left; // 计算鼠标相对于画布左上角的 X 坐标
      const mouseY = event.clientY - rect.top; // 计算鼠标相对于画布左上角的 Y 坐标
      let menu = proxy.$refs.menu;
      menu.style.top = mouseY + "px";
      menu.style.left = mouseX + "px";
      showMenu.value = true;
    },
    // 鼠标进入节点
    onMouseOver: function (event, node) {
      node.scaleX = 1.2;
      node.scaleY = 1.2;
      node.borderWidth = 4;
    },
    // 鼠标离开节点
    onMouseOut: function (event, node) {
      node.scaleX = 1;
      node.scaleY = 1;
      node.borderWidth = 2;
    },
  },
  link: {
    // 连线的默认配置
    label: {
      // 连线标签
      show: true, // 是否显示
      color: "70, 240, 255", // 字体颜色
      font: "22px 微软雅黑", // 字体大小及类型
      borderColor: "70, 240, 255", // 背景颜色
    },
    lineType: "direct", // 连线类型,direct,curver,
    arrowType: "thired",
    colorType: "defined", // 连线颜色类型 source:继承source颜色,target:继承target颜色 both:用双边颜色，defined:自定义
    color: "35, 236, 255", // 连线颜色  rgba(35, 236, 255, 1)
    alpha: 1, // 连线透明度
    lineWidth: 1, // 连线宽度
    // lineDash: [1, 6], // 虚线间隔样式如：[5,8]
    showArrow: true, // 显示箭头
    selected: {
      // 选中时的样式设置
      color: "50,120,230", // 选中时的颜色
      alpha: 1,
      showShadow: false, // 是否展示阴影
      shadowColor: "250,40,30", // 选中连线时的阴影颜色
    },
  },
  highLightNeiber: false, // 相邻节点高亮开关
  wheelZoom: 0.8, // 滚轮缩放开关，不使用时不设置[0,1]
  // 画布空白区域点击,鼠标框选开启后，点击画布空白不关闭框选
  noElementClick: function (event, _graphvis) {
    showMenu.value = false; // 关闭右键菜单

    selectModel.value
      ? _graphvis.setMouseModel("select")
      : _graphvis.setMouseModel("normal");
  },
};

// 将图片转成圆形
const turnIntoACircle = function (imgSrc, R = 35) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "";
    img.onload = function () {
      // 半径
      const radius = R;
      // 直径
      const side = R * 2;
      // canvas的长和宽
      canvas.width = side;
      canvas.height = side;
      // 默认长宽比为1
      const canvasRatio = 1;
      // 图片长度和宽度
      const imageWidth = img.width;
      const imageHeight = img.height;
      const imageRatio = imageWidth / imageHeight;
      // 修改纵横比
      let sx, sy, sHeight, sWidth;
      if (imageRatio < canvasRatio) {
        sWidth = imageWidth;
        sHeight = sWidth / canvasRatio;
        sx = 0;
        sy = (imageHeight - sHeight) / 2;
      } else {
        sHeight = imageHeight;
        sWidth = imageHeight * canvasRatio;
        sy = 0;
        sx = (imageWidth - sWidth) / 2;
      }

      context.clearRect(0, 0, side, side);
      context.save();
      context.beginPath();
      context.arc(radius, radius, radius, 0, 2 * Math.PI);
      context.clip();
      context.drawImage(img, sx, sy, sWidth, sHeight, 12, 10, 46, 48);
      context.restore();
      resolve(canvas.toDataURL("image/png", 1));
    };
    img.src = imgSrc;
  });
};

// 快速执行布局计算,用于节点数量多的情况
const runLayout = (graphData) => {
  const fastLayout = new LayoutFactory(graphData).createLayout("fastFR");
  fastLayout.initAlgo();
  const layoutConf = {
    froce: 0.95,
    linkDistance: 500,
    linkStrength: 0.09,
    charge: -200,
    gravity: 0.009,
    noverlap: false,
  };
  fastLayout.resetConfig(layoutConf); //设置布局算法参数
  var runLoopNum = 0;
  while (runLoopNum++ < 300) {
    fastLayout.runLayout(); //执行布局计算
  }
  graphVis.setZoom("auto"); //自动缩放
};

// 少量节点布局
const layoutSmall = (graphData) => {
  const layout = new LayoutFactory(graphData).createLayout("concentric");
  layout.boolTransition = false;
  layout.resetConfig({
    maxNodeSize: 350, //节点大小
    levelWidth: 5, //分层系数
  });
  layout.runLayout(); //执行布局计算
  graphVis.setZoom("auto"); //自动缩放
};

// 初始化vis
const initGraphVis = async (graphData) => {
  originData = graphData;
  let tempData = [];
  for (let i = 0; i < graphData.nodes.length; i++) {
    let item = graphData.nodes[i];
    let obj = {
      id: item.id,
      label: item.cname,
      pointType: item.pointType,
      pointId: item.pointId,
      image: await turnIntoACircle(
        item.pointType === "people"
          ? peopleIcon
          : item.pointType === "car"
          ? carIcon
          : caseIcon
      ),
      properties: { pointType: item.pointType, pointId: item.pointId },
    };
    tempData.push(obj);
  }
  graphData.nodes = tempData;
  // 根据数据进行绘制
  graphVis.drawData(graphData);
  // 居中
  graphVis.moveCenter();
  // 设置布局方法
  graphData.nodes.length > 20
    ? runLayout(graphVis.getGraphData())
    : layoutSmall(graphVis.getGraphData());
  // 设置画布缩小不隐藏线的label
  graphVis.setShowDetailScale(0.1);
};

// 初始化
const initChart = (res) => {
  graphVis = new VisGraph(document.getElementById("relationGraph"), visConfig);
  initGraphVis(res);
};

// 获取数据之后 初始化地图
const getNodeData = () => {
  getInitialNode().then((res) => {
    initChart(res);
  });
};

// 处理关系扩展数据
const handleExpandData = (nodes, links) => {
  let newNodes = [];
  let newLinks = [];
  newNodes = nodes.filter(
    (obj1) => !originData.nodes.some((obj2) => obj2.id === obj1.id)
  );
  newLinks = links.filter(
    (obj1) =>
      !originData.links.some(
        (obj2) =>
          obj2.source === obj1.source &&
          obj2.target === obj1.target &&
          obj2.type === obj1.type
      )
  );
  return { newNodes, newLinks };
};

// 关系扩展
const expansion = () => {
  showMenu.value = false;
  getExpandNode(menuId.value).then(async (res) => {
    const nodes = [...originData.nodes, ...(res.nodes ?? [])];
    const links = [...originData.links, ...(res.links ?? [])];
    const { newNodes, newLinks } = handleExpandData(nodes, links);
    if (newNodes.length === 0 && newLinks.length === 0) {
      return proxy.$Message.warning("暂无扩展关系");
    }

    let tempData = [];
    let tempLinks = [];
    for (let i = 0; i < newNodes.length; i++) {
      let item = newNodes[i];
      let obj = {
        id: item.id,
        label: item.cname,
        pointType: item.pointType,
        pointId: item.pointId,
        image: await turnIntoACircle(
          item.pointType === "people"
            ? peopleIcon
            : item.pointType === "car"
            ? carIcon
            : caseIcon
        ),
        properties: { pointType: item.pointType, pointId: item.pointId },
      };
      tempData.push(obj);
      // 控制扩展半径
      tempData.push({ ...obj, alpha: 0 });
    }
    // 处理links的label字段
    for (let i = 0; i < newLinks.length; i++) {
      const item = newLinks[i];
      tempLinks.push({
        ...item,
        // label为空就取type字段
        label: item.label || item.type,
      });
    }
    //计算新节点的旋转坐标
    // graphVis.incremaNodesCodinate(tempData);
    //将关系数据，动态追加到图中
    graphVis.activeAddNodeLinks(tempData, tempLinks);
  });
};

// 全息档案
const archives = () => {};
// 融合轨迹
const track = () => {};
// 删除
const onDelete = () => {
  showMenu.value = false;
  // 过滤当前搜索的节点
  const selectNodes = graphVis.getAllSelectedNodes();
  // deleteNodes 删除选中的
  graphVis.deleteNodes(selectNodes);
  // graphVis.deleteNode(graphVis.currentNode);
  //   if (selectNodes && selectNodes.length > 0) {
  //     const { pointType: type, pointId: id } = selectNodes[0].properties;
  //     emits("delete", { type, id });
  //   }
};

// 节点搜索(高亮)
const handleSearchNode = (value) => {
  const result = value?.split(",");
  // 先清空高亮
  const nodes = graphVis.getGraphData().nodes;
  nodes.forEach((item) => {
    result.includes(item.label)
      ? (item.selected = true)
      : (item.selected = false);
  });
  graphVis.refresh();
};
// 修改时间范围
const changeTime = () => {
  // 要去遍历当前所有数据
  initChart();
};

// 开启/关闭框选
const handleMouseMode = (val) => {
  graphVis.setMouseModel(val ? "select" : "normal");
};

// 修改框选模式
const changeMouseModel = () => {
  selectModel.value = !selectModel.value;
  handleMouseMode(selectModel.value);
};

// 导出
const save = () => {
  graphVis.saveImage({
    width: 1000,
    height: 1000,
    fileName: "人物关系",
    background: "#042F35",
    textWatermark: { content: "人物关系" },
  });
};

onMounted(() => {
  getNodeData();
  // 阻止右键默认的菜单弹出
  document.querySelector(".relationGraph").oncontextmenu = () => false;
});
</script>

<style lang="scss" scoped>
.box-select {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.export {
  position: absolute;
  top: 50px;
  left: 100px;
  color: #40e2ff;
  cursor: pointer;
}
.active-select {
  background-image: url("@images/ui/select-active.png");
}
.un-active-select {
  background-image: url("@images/ui/select.png");
}
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #042f35;
  .relationGraph {
    width: 100%;
    height: 100%;
  }
  .menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 139px;
    background: url("@images/ui/menu.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
.handle-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: unset;
}
.handle-container .handle-btn {
  margin-right: unset;
  width: 97px;
  margin-bottom: 20px;
  :deep(.el-button) {
    width: 100%;
  }
}
</style>
