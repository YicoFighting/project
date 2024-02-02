<template>
  <div class="box">
    <div class="left">
      <el-radio-group v-model="radio">
        <el-radio-button label="dataSource">数据源</el-radio-button>
        <el-radio-button label="operator">算子</el-radio-button>
      </el-radio-group>
      <template v-if="radio === 'dataSource'">
        <div class="data">
          <div
            class="item"
            v-for="source in sources"
            :key="source.id"
            @mousedown="startDrag($event, source)"
          >
            <img :src="iconPrefix + source.type + '.png'" alt="" srcset="" />
            <span>{{ source.label }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="data">
          <div
            class="item"
            v-for="icon in icons"
            :key="icon.id"
            @mousedown="startDrag($event, icon)"
          >
            <img :src="iconPrefix + icon.type + '.png'" alt="" srcset="" />
            <span>{{ icon.label }}</span>
          </div>
        </div>
      </template>
    </div>
    <div class="right">
      <div id="container"></div>
      <div class="custom-tools">
        <el-button type="primary" :disabled="!canUndo" @click="previousStep">
          上一步
        </el-button>
        <el-button type="primary" :disabled="!canRedo" @click="nextStep">
          下一步
        </el-button>
        <el-button type="primary" @click="empty">清空</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>

      <div class="menu" ref="menu">
        <el-button type="primary" @click="delEl">删除</el-button>
      </div>
    </div>

    <el-dialog
      v-model="visible"
      :title="dialogInfo.title"
      width="50%"
      destroy-on-close
      align-center
    >
      <template v-if="dialogInfo.type === 'datasouce'">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="数据结构" name="structure">
            <el-table
              :data="dialogInfo?.structure"
              height="400"
              style="width: 100%"
            >
              <el-table-column prop="fieldName" label="字段中文名" />
              <el-table-column prop="engFieldName" label="字段英文名" />
              <el-table-column prop="fieldType" label="字段类型" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="数据预览" name="preview">
            <el-table
              :data="dialogInfo?.preview"
              height="400"
              style="width: 100%"
            >
              <el-table-column
                v-for="header in dialogInfo?.structure"
                :key="header.id"
                :prop="header.engFieldName"
                :label="header.fieldName"
              />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-else>
        <el-tabs v-model="operator" class="demo-tabs">
          <el-tab-pane label="算子配置" name="allocation">
            <div style="height: 250px; overflow: auto">
              <el-select-v2
                v-model="info[dialogInfo.nodeId].allocation"
                :options="info[dialogInfo.nodeId].options"
                :props="defaultProps"
                placeholder="请选择字段名称"
                style="width: 240px"
                multiple
                filterable
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="1"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="保留字段" name="hold">
            <div style="height: 250px; overflow: auto">
              <el-select-v2
                v-model="info[dialogInfo.nodeId].preserveFields"
                :options="info[dialogInfo.nodeId].options"
                :props="defaultProps"
                placeholder="请选择字段名称"
                style="width: 240px"
                multiple
                filterable
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="1"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">关闭</el-button>
          <el-button type="primary" @click="saveParmas"> 保存参数 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { Graph, Shape } from "@antv/x6";
import { Dnd } from "@antv/x6-plugin-dnd";
import { History } from "@antv/x6-plugin-history";

// #region 数据
const { proxy } = getCurrentInstance();
// 是否显示弹框
const visible = ref(false);
// 激活的tab
const activeName = ref("structure");
// 激活的tab
const operator = ref("allocation");
// 算子配置选择的
const allocation = ref([]);
// 算子配置的
// dialog的信息
const dialogInfo = ref({});
// 是否可以回退
const canUndo = ref(false);
// 是否可以前进
const canRedo = ref(false);
// 等待被删除的元素
const deleteEl = ref({});
// 网络请求回来的数据
const info = ref({});
// 图表实例
let graph = null;
// 拖拽实例
let dnd = null;
// tab
const radio = ref("dataSource");
// 图标前缀
const iconPrefix = "https://pub-57c641e98b9e4c71983954df8e891350.r2.dev/";
// 数据源
const sources = [
  {
    id: "source_1",
    type: "datasouce",
    label: "数据源1",
  },
  {
    id: "source_2",
    type: "datasouce",
    label: "数据源2",
  },
  {
    id: "source_3",
    type: "datasouce",
    label: "数据源3",
  },
  {
    id: "source_4",
    type: "datasouce",
    label: "数据源4",
  },
  {
    id: "source_5",
    type: "datasouce",
    label: "数据源5",
  },
  {
    id: "source_6",
    type: "datasouce",
    label: "数据源6",
  },
  {
    id: "source_7",
    type: "datasouce",
    label: "数据源7",
  },
  {
    id: "source_8",
    type: "datasouce",
    label: "数据源8",
  },
  {
    id: "source_9",
    type: "datasouce",
    label: "数据源9",
  },
  {
    id: "source_10",
    type: "datasouce",
    label: "数据源10",
  },
];
// 算子图标
const icons = [
  {
    id: 1,
    label: "并集",
    type: "union",
  },
  {
    id: 2,
    label: "关联回填",
    type: "associatedBackfill",
  },
  {
    id: 3,
    label: "交集",
    type: "intersection",
  },
  {
    id: 4,
    label: "排序",
    type: "sort",
  },
  {
    id: 5,
    label: "聚合",
    type: "polymerization",
  },
  {
    id: 6,
    label: "去重",
    type: "weightlessnessReduction",
  },
  {
    id: 7,
    label: "全量输出",
    type: "fullOutput",
  },
  {
    id: 8,
    label: "筛选过滤",
    type: "filter",
  },
  {
    id: 9,
    label: "统计分析",
    type: "statisticalAnalysis",
  },
  {
    id: 10,
    label: "新增标识字段",
    type: "addIdentificationField",
  },
  {
    id: 11,
    label: "增量输出",
    type: "incrementalOutput",
  },
  {
    id: 12,
    label: "自定义SQL",
    type: "customSQL",
  },
];
// 链接桩
const ports = {
  groups: {
    top: {
      position: "top",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#f1f1f1",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    right: {
      position: {
        name: "absolute",
        args: { x: "68%", y: "18%" },
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#f1f1f1",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    bottom: {
      position: {
        name: "absolute",
        args: { x: "50%", y: "36%" },
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#f1f1f1",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    left: {
      position: {
        name: "absolute",
        args: { x: "32%", y: "18%" },
      },
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#f1f1f1",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
  },
  items: [
    {
      group: "top",
    },
    {
      group: "right",
    },
    {
      group: "bottom",
    },
    {
      group: "left",
    },
  ],
};
// 默认props
const defaultProps = {
  label: "fieldName",
  value: "engFieldName",
};
// #endregion

// 开始拖动
const startDrag = (e, params) => {
  const { id, type, label } = params;
  const items = [{ group: "right", id: "port-right" }];
  if (type !== "datasouce") {
    items.push({ group: "left", id: "port-left" });
  }
  const node = graph.createNode({
    shape: "datasouce",
    width: 100,
    height: 104,
    id,
    label,
    data: {
      id,
      type,
      label,
    },
    ports: {
      ...ports,
      items,
    },
  });
  dnd.start(node, e);
};

// #region 快捷键与事件
// 控制连接桩显示/隐藏
const showPorts = (ports, show) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? "visible" : "hidden";
  }
};
// 保存数据
const save = () => {
  console.log(graph.toJSON());
  // localStorage.setItem("antv", JSON.stringify(json));

  const nodes = graph.getNodes();
  const newNodes = nodes.map((node) => {
    const { x, y } = node.position();
    const { type, label } = node.getData();
    const items = [{ group: "right", id: "port-right" }];
    if (type !== "datasouce") {
      items.push({ group: "left", id: "port-left" });
    }
    const obj = {
      id: node.id,
      x,
      y,
      label,
      // width: 100,
      // height: 104,
      shape: "datasouce",
      data: {
        type,
        label,
      },
      ports: {
        ...ports,
        items,
      },
    };
    return obj;
  });

  const edges = graph.getEdges();
  const newEdges = edges.map((edge) => {
    const { id } = edge;
    const source = edge.source;
    const target = edge.target;
    return {
      id,
      source,
      target,
      shape: "edge",
      attrs: {
        line: {
          stroke: "#A2B1C3",
          strokeWidth: 2,
          targetMarker: {
            name: "block",
            width: 12,
            height: 8,
          },
        },
      },
    };
  });

  const json = {
    nodes: newNodes,
    edges: newEdges,
  };
  console.log(json);
  localStorage.setItem("antv", JSON.stringify(json));
  // localStorage.setItem("antv", JSON.stringify(graph.toJSON()));
};
// 历史记录被改变
const changeHistory = () => {
  canUndo.value = graph.canUndo();
  canRedo.value = graph.canRedo();
};
// 上一步
const previousStep = () => {
  graph.undo();
};
// 下一步
const nextStep = () => {
  graph.redo();
};
// 清空
const empty = () => {
  graph.cleanHistory();

  // const antv = localStorage.getItem("antv");
  // if (antv) {
  //   graph.fromJSON(JSON.parse(antv)); // 渲染元素
  // }
};
// 节点右键
const handleNodeClick = ({ e, node }) => {
  const { x, y } = graph.clientToGraph(e.clientX, e.clientY);
  proxy.$refs.menu.style.visibility = "visible";
  proxy.$refs.menu.style.top = y + "px";
  proxy.$refs.menu.style.left = x + "px";

  deleteEl.value = {
    type: "node",
    value: node,
  };

  // graph.removeNode(node);
};
// 边右键
const handleEdgeClick = ({ e, edge }) => {
  const { x, y } = graph.clientToGraph(e.clientX, e.clientY);

  proxy.$refs.menu.style.visibility = "visible";
  proxy.$refs.menu.style.top = y + "px";
  proxy.$refs.menu.style.left = x + "px";

  deleteEl.value = {
    type: "edge",
    value: edge,
  };

  // graph.removeEdge(edge);
};
// 删除元素
const delEl = () => {
  const { type, value } = deleteEl.value;
  if (type == "node") {
    graph.removeNode(value);
  } else {
    graph.removeEdge(value);
  }

  proxy.$refs.menu.style.visibility = "hidden";
};
// #endregion

// #region 其他事件
// 显示弹框
const showToast = (data) => {
  visible.value = true;
  dialogInfo.value = {
    nodeId: data.nodeId,
    type: data.type,
    title: data.label + `(${data.nodeId})`,
  };
  if (data.type === "datasouce") {
    dialogInfo.value.structure = info.value[data.nodeId].attribute;
    dialogInfo.value.preview = info.value[data.nodeId].tabData;
  }
};
// 关闭弹框
const closeDialog = () => {
  visible.value = false;
  // dialogInfo.value = {};
};
// 保存参数
const saveParmas = () => {
  try {
    const options = info.value[dialogInfo.value.nodeId].options;
    const preserveFields = info.value[dialogInfo.value.nodeId].preserveFields;
    const nextOptions = options.filter((option) =>
      preserveFields.includes(option.engFieldName)
    );

    info.value[dialogInfo.value.nodeId].nextOptions = nextOptions;

    closeDialog();
  } catch (error) {
    console.log("保存参数==>", error);
  }
};
// #endregion

onMounted(() => {
  graph = new Graph({
    container: document.getElementById("container"),
    // 设置画布背景颜色
    background: {
      color: "#F2F7FA",
    },
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: "ctrl",
      minScale: 0.5,
      maxScale: 3,
    },
    // https://x6.antv.antgroup.com/api/model/interaction#%E8%BF%9E%E7%BA%BF
    connecting: {
      // 实体关系路由
      router: {
        name: "er",
      },
      // 连接器
      connector: {
        // 圆角连接器，用直线连接起点、路由点和终点，并在线段连接处用圆弧链接（倒圆角）。
        name: "rounded",
        args: {
          radius: 8,
        },
      },
      // 当连接到节点时，通过 anchor 来指定被连接的节点的锚点
      anchor: "center",
      // 使用锚点作为连接点
      connectionPoint: "anchor",
      // 不允许连接到空白点
      allowBlank: false,
      // 不允许循环连线
      allowLoop: false,
      // 不允许在相同的起始节点和终止之间创建多条边
      allowMulti: false,
      // 自动吸附
      snap: {
        radius: 20,
      },
      // 自定义新建的边的样式。
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: "#A2B1C3",
              strokeWidth: 2,
              targetMarker: {
                name: "block",
                width: 12,
                height: 8,
              },
            },
          },
          zIndex: 0,
        });
      },
      // 在移动边的时候判断连接是否有效，如果返回 false ，当鼠标放开的时候，不会连接到当前元素，否则会连接到当前元素。
      validateConnection({ targetMagnet }) {
        return !!targetMagnet;
      },
    },
    // https://x6.antv.antgroup.com/tutorial/basic/interacting#%E9%AB%98%E4%BA%AE
    highlighting: {
      // 连接桩吸附连线时在连接桩外围围渲染一个包围框
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#5F95FF",
            stroke: "#5F95FF",
          },
        },
      },
    },
  });

  graph.use(
    new History({
      enabled: true,
    })
  );

  // 注册数据源节点
  Shape.HTML.register({
    shape: "datasouce",
    width: 100,
    height: 104,
    effect: ["data"],
    html(cell) {
      const { type, label } = cell.getData();

      // 创建自定义的节点容器
      const container = document.createElement("div");
      container.setAttribute("class", "cu-container");

      // 图片根据不同的类型进行切换，可以是后端返回的图标，也可以是自己本地的图标，如果是后端返回就通过节点的data传进来
      const container_img = document.createElement("img");
      container_img.setAttribute("class", "cu-container-img");
      container_img.setAttribute("alt", "节点ico");
      container_img.setAttribute("src", iconPrefix + type + ".png");
      container_img.style.cursor = "pointer";

      const container_title = document.createElement("div");
      container_title.setAttribute("class", "cu-container-title");
      container_title.innerText = label;
      if (label.length > 5) container_title.setAttribute("title", label);

      container.appendChild(container_img);
      container.appendChild(container_title);

      if (type === "datasouce") {
        const container_desc = document.createElement("div");
        container_desc.setAttribute("class", "cu-container-desc");
        container_desc.innerText = "(共" + 1314 + "条)";
        container.appendChild(container_desc);
      }

      return container;
    },
  });

  // 这样放置到画布上的节点 ID 和 dnd start 传入的 node ID 一致
  dnd = new Dnd({
    target: graph,
    // getDragNode: (node) => node.clone({ keepId: true }),
    // getDropNode: (node) => node.clone({ keepId: true }),
  });

  // 高亮连接桩
  graph.on("node:mouseenter", () => {
    const container = document.getElementById("container");
    const ports = container.querySelectorAll(".x6-port-body");
    showPorts(ports, true);
  });
  graph.on("node:mouseleave", () => {
    const container = document.getElementById("container");
    const ports = container.querySelectorAll(".x6-port-body");
    showPorts(ports, false);
  });

  // 连线
  graph.on("edge:connected", (e) => {
    const { isNew, edge } = e;
    if (isNew) {
      // 获取边的起始节点/起始点信息。
      const source = edge.getSourceCell();
      // 获取边的终止节点/终止点信息。
      const target = edge.getTargetCell();
      const sourceData = source.getData();
      const targetData = target.getData();

      if (targetData.type === "datasouce") {
        console.log("数据源不能作为输出源");
        // https://x6.antv.antgroup.com/api/mvc/model#removeedge
        return graph.removeEdge(edge);
      }

      // https://x6.antv.antgroup.com/api/mvc/model#getincomingedges
      const targetEdges = graph.getIncomingEdges(target);

      if (targetEdges.length > 1) {
        console.log(targetData.label + "只能有一个输入源");
        return graph.removeEdge(edge);
      }

      // 更新前后数据
      source.updateData({ ...sourceData, nextId: target.id });
      target.updateData({ ...targetData, prevId: target.id });
    }
  });

  // 历史记录被改变
  graph.on("history:change", changeHistory);

  // 右键节点
  graph.on("node:contextmenu", handleNodeClick);
  // 右键边
  graph.on("edge:contextmenu", handleEdgeClick);
  // 点击节点
  graph.on("node:click", ({ node }) => {
    // getIncomingEdges：获取连接到节点/边的输入边，即边的终点为指定节点/边的边。
    // getOutgoingEdges：获取连接到节点/边的输出边，即边的起点为指定节点/边的边。
    // getConnectedEdges：获取与节点/边相连接的边。
    // getPredecessors：返回节点的前序节点，即从根节点开始连接到指定节点的节点。
    // getSuccessors：获取所有后续节点，即从指定节点开始连接到叶子节点的节点。
    // node.setData：设置关联的业务数据。默认情况触发 change:data 事件和画布重绘，当 options.silent 为 true 时不触发 change:data 事件和画布重绘。
    // node.updateData：通过浅 merge 来更新数据，相当于调用 setData(data, { ...options, deep: false })。

    // 获取前序节点
    const prev = graph.getPredecessors(node, { distance: 1 });
    if (prev.length > 0) {
      const prevNode = prev[0];
      const { type } = prevNode.getData();
      if (type === "datasouce") {
        info.value[node.id].options = info.value[prevNode.id].attribute;
      } else {
        info.value[node.id].options = info.value[prevNode.id].nextOptions;
      }
    } else {
      info.value[node.id].options = [];
    }
    showToast({ ...node.getData(), nodeId: node.id });
  });

  // 点击空白处
  graph.on("blank:click", (e) => {
    proxy.$refs.menu.style.visibility = "hidden";
  });
  // 离开图表
  graph.on("graph:mouseleave", (e) => {
    proxy.$refs.menu.style.visibility = "hidden";
  });

  // 添加节点
  graph.on("node:added", ({ node }) => {
    const { type } = node.getData();

    if (type === "datasouce") {
      const id = node.id;

      const attribute = [
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "name",
          fieldName: "姓名",
          fieldType: "1",
          hideStatus: true,
          id: "9081",
          sort: 0,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "tel",
          fieldName: "手机号码",
          fieldType: "1",
          hideStatus: true,
          id: "9082",
          sort: 1,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "age",
          fieldName: "年龄",
          fieldType: "1",
          hideStatus: true,
          id: "9083",
          sort: 2,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "sex",
          fieldName: "性别",
          fieldType: "1",
          hideStatus: true,
          id: "9084",
          sort: 3,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "mname",
          fieldName: "母亲",
          fieldType: "1",
          hideStatus: true,
          id: "9085",
          sort: 4,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "fname",
          fieldName: "父亲",
          fieldType: "1",
          hideStatus: true,
          id: "9086",
          sort: 5,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "mtel",
          fieldName: "母亲手机号码",
          fieldType: "1",
          hideStatus: true,
          id: "9087",
          sort: 6,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "ftel",
          fieldName: "父亲手机号码",
          fieldType: "1",
          hideStatus: true,
          id: "9088",
          sort: 7,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "address",
          fieldName: "家庭住址",
          fieldType: "1",
          hideStatus: true,
          id: "9089",
          sort: 8,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "yimiao",
          fieldName: "疫苗接种情况",
          fieldType: "1",
          hideStatus: true,
          id: "9090",
          sort: 9,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "hukou",
          fieldName: "户口所在地",
          fieldType: "1",
          hideStatus: true,
          id: "9091",
          sort: 10,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "house",
          fieldName: "本地有房产",
          fieldType: "1",
          hideStatus: true,
          id: "9092",
          sort: 11,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "face",
          fieldName: "是否脸上有",
          fieldType: "1",
          hideStatus: true,
          id: "9093",
          sort: 12,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "cardnumber",
          fieldName: "身份证号码",
          fieldType: "1",
          hideStatus: true,
          id: "9094",
          sort: 13,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "heightway",
          fieldName: "身高",
          fieldType: "1",
          hideStatus: true,
          id: "9095",
          sort: 14,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "weightway",
          fieldName: "体重",
          fieldType: "1",
          hideStatus: true,
          id: "9096",
          sort: 15,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "classname",
          fieldName: "分班",
          fieldType: "1",
          hideStatus: true,
          id: "9097",
          sort: 16,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "birthday",
          fieldName: "出生日期",
          fieldType: "1",
          hideStatus: true,
          id: "9098",
          sort: 17,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "pinkun",
          fieldName: "是否贫困户",
          fieldType: "1",
          hideStatus: true,
          id: "9099",
          sort: 18,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "child",
          fieldName: "独生子女",
          fieldType: "1",
          hideStatus: true,
          id: "9100",
          sort: 19,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
        {
          createTime: "2023-06-29 17:14:46",
          engFieldName: "brother",
          fieldName: "是否有兄弟姐妹在同校",
          fieldType: "1",
          hideStatus: true,
          id: "9101",
          sort: 20,
          tableMetaId: "493",
          updateTime: "2023-06-29 17:14:46",
        },
      ];

      const tabData = [
        {
          birthday: "2015-09-12 00:00:00",
          fname: "陈晓8",
          address: "南园路8号",
          ftel: "19087655007",
          sex: "女",
          mname: "赵丽娜8",
          heightway: "121",
          house: "是",
          yimiao: "2",
          weightway: "42.1",
          face: "否",
          classname: "向日葵班",
          hukou: "本市",
          pinkun: "否",
          name: "朱飞9",
          tel: "189007600108",
          cardnumber: "350811201506110422",
          brother: "否",
          mtel: "18900765107",
          rowKey: "1688030085217",
          age: "3",
          child: "是",
        },
        {
          birthday: "2015-09-13 00:00:00",
          fname: "陈晓7",
          address: "南园路7号",
          ftel: "19087655006",
          sex: "女",
          mname: "赵丽娜7",
          heightway: "122",
          house: "是",
          yimiao: "2",
          weightway: "43.1",
          face: "否",
          classname: "向日葵班",
          hukou: "本市",
          pinkun: "否",
          name: "朱飞8",
          tel: "189007600107",
          cardnumber: "350811201506110431",
          brother: "否",
          mtel: "18900765106",
          rowKey: "1688030085219",
          age: "3",
          child: "是",
        },
        {
          birthday: "2015-09-14 00:00:00",
          fname: "陈晓6",
          address: "南园路6号",
          ftel: "19087655005",
          sex: "男",
          mname: "赵丽娜6",
          heightway: "123",
          house: "是",
          yimiao: "2",
          weightway: "44.1",
          face: "否",
          classname: "向日葵班",
          hukou: "本市",
          pinkun: "否",
          name: "朱飞7",
          tel: "189007600106",
          cardnumber: "350811201506110432",
          brother: "否",
          mtel: "18900765105",
          rowKey: "1688030085220",
          age: "3",
          child: "否",
        },
        {
          birthday: "2015-09-15 00:00:00",
          fname: "陈晓5",
          address: "南园路5号",
          ftel: "19087655004",
          sex: "男",
          mname: "赵丽娜5",
          heightway: "124",
          house: "是",
          yimiao: "2",
          weightway: "45.1",
          face: "否",
          classname: "向日葵班",
          hukou: "本市",
          pinkun: "否",
          name: "朱飞6",
          tel: "189007600105",
          cardnumber: "350811201506110445",
          brother: "否",
          mtel: "18900765104",
          rowKey: "1688030085221",
          age: "3",
          child: "是",
        },
        {
          birthday: "2015-09-16 00:00:00",
          fname: "陈晓4",
          address: "南园路4号",
          ftel: "19087655003",
          sex: "男",
          mname: "赵丽娜4",
          heightway: "125",
          house: "是",
          yimiao: "2",
          weightway: "46.1",
          face: "否",
          classname: "向日葵班",
          hukou: "本市",
          pinkun: "否",
          name: "朱飞5",
          tel: "189007600104",
          cardnumber: "350811201506110466",
          brother: "否",
          mtel: "18900765103",
          rowKey: "1688030085222",
          age: "4",
          child: "是",
        },
        {
          birthday: "2015-09-17 00:00:00",
          fname: "陈晓3",
          address: "南园路3号",
          ftel: "19087655002",
          sex: "男",
          mname: "赵丽娜3",
          heightway: "126",
          house: "是",
          yimiao: "3",
          weightway: "47.1",
          face: "否",
          classname: "向日葵班",
          hukou: "本市",
          pinkun: "否",
          name: "朱飞4",
          tel: "189007600103",
          cardnumber: "350811201506110412",
          brother: "否",
          mtel: "18900765102",
          rowKey: "1688030085223",
          age: "3",
          child: "是",
        },
        {
          birthday: "2015-09-18 00:00:00",
          fname: "陈晓32",
          address: "南园路32号怪不得开发开的及货到付款就的",
          ftel: "19087655031",
          sex: "男",
          mname: "赵丽娜32",
          heightway: "127",
          house: "否",
          yimiao: "4",
          weightway: "48.1",
          face: "否",
          classname: "向日葵班",
          hukou: "外市",
          pinkun: "否",
          name: "朱飞33",
          tel: "189007600132",
          cardnumber: "350811201506110413",
          brother: "是",
          mtel: "18900765131",
          rowKey: "1688030085224",
          age: "3",
          child: "否",
        },
        {
          birthday: "2015-09-19 00:00:00",
          fname: "陈晓31",
          address: "南园路31号",
          ftel: "19087655030",
          sex: "男",
          mname: "赵丽娜31",
          heightway: "128",
          house: "否",
          yimiao: "4",
          weightway: "49.1",
          face: "否",
          classname: "向日葵班",
          hukou: "外市",
          pinkun: "否",
          name: "朱飞32",
          tel: "189007600131",
          cardnumber: "350811201506110414",
          brother: "否",
          mtel: "18900765130",
          rowKey: "1688030085225",
          age: "3",
          child: "是",
        },
        {
          birthday: "2015-09-20 00:00:00",
          fname: "陈晓30",
          address: "南园路30号",
          ftel: "19087655029",
          sex: "男",
          mname: "赵丽娜30",
          heightway: "129",
          house: "否",
          yimiao: "4",
          weightway: "50.1",
          face: "否",
          classname: "向日葵班",
          hukou: "外市",
          pinkun: "否",
          name: "朱飞31",
          tel: "189007600130",
          cardnumber: "350811201506110415",
          brother: "否",
          mtel: "18900765129",
          rowKey: "1688030085226",
          age: "3",
          child: "是",
        },
        {
          birthday: "2016-01-15 00:00:00",
          fname: "陈晓29",
          address: "南园路29号",
          ftel: "19087655028",
          sex: "男",
          mname: "赵丽娜29",
          heightway: "130",
          house: "否",
          yimiao: "4",
          weightway: "51.1",
          face: "否",
          classname: "向日葵班",
          hukou: "外市",
          pinkun: "否",
          name: "朱飞30",
          tel: "189007600129",
          cardnumber: "350811201506110416",
          brother: "否",
          mtel: "18900765128",
          rowKey: "1688030085227",
          age: "3",
          child: "是",
        },
      ];

      info.value[id] = {
        type,
        attribute,
        tabData,
      };
    } else {
      info.value[node.id] = {};
    }
  });

  const antv = localStorage.getItem("antv");
  if (antv) {
    graph.fromJSON(JSON.parse(antv)); // 渲染元素
  }
  graph.centerContent(); // 居中显示
});
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  background: #f1f1f1;
  .left {
    width: 220px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 20px;
    .data {
      flex: 1 0 0;
      overflow-x: hidden;
      overflow-y: auto;
      padding-left: 20px;
      .item {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin: 10px;
        img {
          width: 24px;
          height: 24px;
          object-fit: cover;
          margin-right: 5px;
        }
      }
    }
  }
  .right {
    position: relative;
    flex: 1 0 0;
    height: 100%;
    overflow: hidden;
    .custom-tools {
      top: 20px;
      position: absolute;
    }
    #container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .menu {
      position: absolute;
      top: 0;
      left: 0;
      visibility: hidden;
    }
  }
}
</style>
