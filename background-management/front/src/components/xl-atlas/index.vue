<template>
  <div class="atlas" id="atlas">
    <div class="tooltip">
      <!-- 搜索高亮 -->
      <div class="atlas-search" v-if="highLight">
        <el-input
          v-model="keyword"
          placeholder="请输入"
          @keyup.enter="handleSearchNode"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearchNode" />
          </template>
        </el-input>
      </div>

      <!-- 框选 -->
      <div
        v-if="boxSelection"
        :class="[
          'box-select',
          selectModel ? 'active-select' : 'un-active-select',
        ]"
        @click="changeMouseModel"
      ></div>

      <!-- 导出 -->
      <div class="export" v-if="savePicture" @click="save">
        <el-tooltip effect="dark" content="导出关系数据" placement="top">
          <el-icon><Download color="#40e2ff" /></el-icon>
        </el-tooltip>
      </div>

      <!-- 复选框 -->
      <div class="atlas-checkbox" v-if="screen">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedList"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox v-for="item in checkboxList" :key="item" :label="item">
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="content">
      <div
        id="atlas-content"
        v-loading="loading"
        element-loading-background="transparent"
      ></div>
      <div ref="menu" class="menu">
        <div class="flex handle-container">
          <div class="handle-btn">
            <el-button
              type="primary"
              class="active-parimary"
              @click="expansion"
            >
              关系扩展
            </el-button>
          </div>
          <!-- <div class="handle-btn">
            <el-button type="primary" class="active-parimary" @click="archives">
              全息档案
            </el-button>
          </div>
          <div v-if="trackTypes.includes(menuType)" class="handle-btn">
            <el-button type="primary" class="active-parimary" @click="track">
              融合轨迹
            </el-button>
          </div> -->
          <div class="handle-btn">
            <el-button type="primary" class="active-parimary" @click="onDelete">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, getCurrentInstance } from "vue";
import { Search, Download } from "@element-plus/icons-vue";
import { getNodeLinks, turnIntoACircle } from "@/utils/build-atlas";
import peopleIcon from "@images/ui/people-icon.png";
import carIcon from "@images/ui/car-icon.png";
import caseIcon from "@images/ui/case-icon.png";

// 数据 搜索高亮 筛选 框选 导出
const props = defineProps({
  graphData: {
    type: Object,
    required: true,
  },
  highLight: {
    type: Boolean,
    default: true,
  },
  screen: {
    type: Boolean,
    default: true,
  },
  boxSelection: {
    type: Boolean,
    default: true,
  },
  savePicture: {
    type: Boolean,
    default: true,
  },
});
const { graphData, highLight, screen, boxSelection, savePicture } =
  toRefs(props);

const emits = defineEmits(["expansion", "delete"]);

const { proxy } = getCurrentInstance();

// 加载数据
const loading = ref(false);
// 图表实例
let graphVis = null;
// 总的复选框数据
const checkboxList = ref([]);
// 已选择数据
const checkedList = ref([]);
// 右键当前节点数据
const currentNode = ref(null);
// 是否展示菜单

// 菜单id
const menuId = ref(null);
// 菜单type
const menuType = ref(null);
// 存在轨迹的点类型
const trackTypes = ["people", "car"];

/**
 * 隐藏右键菜单
 */
const cancelNodeRightMenu = () => {
  let nodeRightMenuLayer = proxy.$refs.menu;
  if (nodeRightMenuLayer) {
    nodeRightMenuLayer.style.display = "none";
  }
};

// graphvis 默认配置
const defaultConfig = {
  node: {
    // 节点的默认配置
    label: {
      // 标签配置
      show: true, // 是否显示
      color: "0,0,0", // 字体颜色
      font: "22px 微软雅黑", // 字体大小及类型
      wrapText: false, // 节点包裹文字 (节点大小由文字大小决定，绘制较耗性能)
      textPosition: "Bottom_Center", // 文字位置 Middle_Center,Bottom_Center
      textOffsetY: 8, //文字竖向偏移距离
    },
    shape: "circle", // 节点形状 circle
    color: "160,207,255", // 节点颜色
    borderColor: "64,158,255", // 边框颜色
    borderWidth: 3, // 边框宽度,
    lineDash: [0], // 边框虚线间隔,borderWidth>0时生效
    alpha: 1, // 节点透明度
    size: 80, // 节点大小
    selected: {
      // 选中时的样式设置
      borderColor: "64,158,255", // 选中时边框颜色
      borderAlpha: 1, // 选中时的边框透明度
      borderWidth: 4, // 选中是的边框宽度
      showShadow: true, // 是否展示阴影
      shadowBlur: 30, //阴影范围大小
      shadowColor: "64,158,255", // 选中是的阴影颜色
    },
    // 节点单击显示菜单
    onClick: function (event, node) {
      currentNode.value = node;
      menuType.value = node.properties.pointType;
      menuId.value = node.properties.pointId;
      const rect = document
        .getElementById("atlas-content")
        .getBoundingClientRect(); // 获取画布相对于视窗的位置
      const mouseX = event.clientX - rect.left; // 计算鼠标相对于画布左上角的 X 坐标
      const mouseY = event.clientY - rect.top; // 计算鼠标相对于画布左上角的 Y 坐标
      const menuContainer = proxy.$refs.menu; // 菜单容器
      if (menuContainer) {
        menuContainer.style.left = mouseX + 10 + "px";
        menuContainer.style.top = mouseY - 5 + "px";
        menuContainer.style.display = "block";
      }
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
      color: "0,0,0", // 字体颜色
      font: "22px 微软雅黑", // 字体大小及类型
      borderColor: "64,158,255",
    },
    lineType: "direct", // 连线类型,direct,curver,
    arrowType: "thired",
    colorType: "defined", // 连线颜色类型 source:继承source颜色,target:继承target颜色 both:用双边颜色，defined:自定义
    color: "64,158,255",
    alpha: 1, // 连线透明度
    lineWidth: 3, // 连线宽度
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
    cancelNodeRightMenu(); // 关闭右键菜单
    selectModel.value
      ? _graphvis.setMouseModel("select")
      : _graphvis.setMouseModel("normal");
    // // 获取所有节点，如果是主体点击空白就不取消高亮
    // const graphData = _graphvis.getGraphData();
    // const keyword = subject.value;
    // graphData.nodes.forEach((item) => {
    //   if (
    //     keyword.includes(item.label) ||
    //     keyword.includes(item.properties.pointId)
    //   ) {
    //     item.selected = true;
    //   }
    //   _graphvis.refresh();
    // });
  },
  // 画布空白区域键盘按下事件
  noElementkeyDown: function (event, _graphvis) {
    // 关闭按住ctrl键开启框选功能
    if (event.keyCode === 17) {
      return _graphvis.setMouseModel("normal");
    }
  },
};
// 搜索高亮
const keyword = ref("");
// 框选模式
const selectModel = ref(false);
// 全选
const checkAll = ref(false);
// 半选
const isIndeterminate = ref(true);

// 全选
const handleCheckAllChange = (val) => {
  checkedList.value = val ? checkboxList.value : [];
  isIndeterminate.value = false;
  graphVis.getGraphData().links.forEach((item) => {
    item.alpha = val ? 1 : 0.3;
  });
  graphVis.getGraphData().nodes.forEach((item) => {
    item.alpha = val ? 1 : 0.3;
  });
  // 刷新视图，不然会特别卡顿
  graphVis.refresh();
};

// 勾选发生改变时
const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === checkboxList.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < checkboxList.value.length;

  graphVis.getGraphData().links.forEach((item) => {
    item.alpha = value.includes(item.type) ? 1 : 0.3;
    item.target.alpha = value.includes(item.type) ? 1 : 0.3;
    item.source.alpha = value.includes(item.type) ? 1 : 0.3;
  });
  // 刷新视图，不然会特别卡顿
  graphVis.refresh();
};

/**
 * 节点搜索-高亮
 */
const handleSearchNode = () => {
  // cancelNodeRightMenu();
  const result = keyword.value?.split(",");
  let nodes = [];
  setTimeout(() => {
    nodes = graphVis.getGraphData().nodes;
    //判断 subject 数据是为了解决节点搜索把主体的高亮删除的问题
    nodes.forEach((item) => {
      item.selected =
        result.includes(item.label) || result.includes(item.properties.pointId);
    });
    // 移动到中心
    graphVis.moveCenter(0.8);
    // 刷新
    graphVis.refresh();
  }, 200);
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

// 根据字段消除重复的连线
const deduplicateArrayObjectsByFields = (array, fields) => {
  const uniqueObjects = [];
  array.forEach((obj) => {
    const identifier = fields.map((field) => obj[field]).join(",");

    if (
      !uniqueObjects.some(
        (uniqueObj) =>
          fields.map((field) => uniqueObj[field]).join(",") === identifier
      )
    ) {
      uniqueObjects.push(obj);
    }
  });

  return uniqueObjects;
};

/**
 * 快速执行布局计算,用于节点数量多的情况
 * @param {*} graphData
 */
let fastLayout;
const reLayout = (graphData = graphVis.getGraphData()) => {
  fastLayout = null;
  const nodesL = graphData.nodes.length || 0;

  fastLayout = new LayoutFactory(graphData).createLayout("kk");

  fastLayout.resetConfig({
    realSize: nodesL < 50 ? "1100" : "2700",
  });

  //通过动画帧控制控制布局算法的执行，有动画效果
  let loopName = "";

  function loop() {
    cancelAnimationFrame(loopName);
    fastLayout.runLayout(); //运行布局算法
    graphVis.refresh(); //刷新视图（优化版本中需要手动刷新视图，原有版本自动刷新性能消耗较大）
    loopName = requestAnimationFrame(loop);
    graphVis.setZoom("auto"); //自动缩放
  }
  loopName = requestAnimationFrame(loop);
  // graphVis.moveCenter(0.8);
};

// 初始化vis
let originData = {};
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

  const tempLinks = deduplicateArrayObjectsByFields(graphData.links, [
    "source",
    "target",
    "label",
  ]);

  graphData.links = tempLinks;
  // 根据数据进行绘制
  graphVis.drawData(graphData);

  await reLayout();
  // 设置画布缩小不隐藏线的label
  graphVis.setShowDetailScale(0.1);
  // 设置滚轮缩放画布完整显示线段
  graphVis.setSmoothWheelMode(false);
  // 设置缩放范围
  graphVis.setZoomRange([0.1, 1]);
};

/**
 * 画图
 * @param {*} isInit 每一次搜索都是初始化
 */
const draw = async (isInit = false) => {
  loading.value = true;
  if (!graphVis) {
    isInit = true;
    graphVis = new VisGraph(
      document.getElementById("atlas-content"),
      defaultConfig
    );
  }
  const { nodes, links } = await getNodeLinks(graphData.value, checkboxList);
  loading.value = false;
  if (isInit) {
    checkedList.value = checkboxList.value.slice(0);
    handleCheckedCitiesChange(checkedList.value);
  }
  initGraphVis({ nodes, links });
};

// 导出
const save = () => {
  graphVis &&
    graphVis.saveImage({
      fileName: "人物关系",
      background: "#ffffff",
      textWatermark: { content: "人物关系" },
    });
};

// 关系拓展 emit
const expansion = () => {
  emits("expansion", menuId.value);
  cancelNodeRightMenu();
};

/**
 * 处理关系扩展数据
 */
const handleEpData = (nodes, links) => {
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

  return {
    newNodes,
    newLinks,
  };
};

// 动态添加节点
const addNodeLinksAsync = (tempData, tempLinks) => {
  return new Promise((resolve) => {
    graphVis.activeAddNodeLinks(tempData, tempLinks);
    resolve();
  });
};

// 处理加完数据的扩展关系
const handleExpand = async () => {
  const { nodes, links } = await getNodeLinks(graphData.value, checkboxList);
  const { newNodes, newLinks } = handleEpData(nodes, links);

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
    tempData.push({ ...obj, alpha: 0 });
    tempData.push({ ...obj, alpha: 0 });
  }
  for (let i = 0; i < newLinks.length; i++) {
    const item = newLinks[i];
    tempLinks.push({
      ...item,
      // label为空就取type字段
      label: item.label || item.type,
    });
  }
  //将关系数据，动态追加到图中 tempData, tempLinks
  addNodeLinksAsync(tempData, tempLinks).then(function () {
    setTimeout(function () {
      reLayout();
    }, 500);
  });
};

// 删除节点(需要处理复选框)
const onDelete = () => {
  const selectNodes = graphVis.getAllSelectedNodes();
  graphVis.deleteNodes(selectNodes);
  cancelNodeRightMenu();

  if (selectNodes && selectNodes.length > 0) {
    const newTypes = graphVis.getGraphData().links.map((link) => {
      return link.type;
    });

    const deleteTypes = checkboxList.value.filter(
      (item) => !newTypes.includes(item)
    );

    checkedList.value = checkedList.value.filter(
      (item) => !deleteTypes.includes(item)
    );

    checkboxList.value = newTypes;

    const deleteArr = selectNodes.map((item) => {
      const { pointType: type, pointId: id } = item.properties;
      return { type, id };
    });
    emits("delete", deleteArr);
  }
};

onMounted(() => {
  // 阻止右键默认的菜单弹出
  document.querySelector(".atlas").oncontextmenu = () => false;
});

defineExpose({
  draw,
  handleExpand,
});
</script>

<style lang="scss" scoped>
.atlas {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .tooltip {
    display: flex;
    margin-top: 20px;
    align-items: center;
  }
  &-search {
    :deep(.el-input-group) {
      width: 300px;
      .el-icon {
        svg {
          color: #909399;
        }
      }
      .el-input-group__append:hover {
        background: var(--el-color-primary);
        .el-icon {
          svg {
            color: var(--el-color-white);
          }
        }
      }
    }
  }
  .box-select {
    position: relative;
    width: 36px;
    height: 36px;
    margin-left: 20px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  .active-select {
    background-image: url("@images/ui/select-active.png");
  }
  .un-active-select {
    background-image: url("@images/ui/select.png");
  }
  .export {
    margin-left: 20px;
    cursor: pointer;
  }
  &-checkbox {
    display: flex;
    margin-left: 20px;
    :deep(.el-checkbox) {
      margin-right: 20px;
    }
  }
  .content {
    position: relative;
    flex: 1 0 0;
    overflow: hidden;
    #atlas-content {
      width: 100%;
      height: 100%;
    }
    .menu {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 139px;
      background-color: #d9ecff;
      border-radius: 5px;
    }
  }
}

.handle-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: unset;
}
.handle-container .handle-btn {
  margin-right: unset;
  width: 110px;
  margin: 10px 0;
  font-size: 12px;
  :deep(.el-button) {
    width: 100%;
  }
}
</style>
