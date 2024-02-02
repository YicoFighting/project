<script setup>
import { onMounted, ref, toRefs } from "vue";
import { XlInput, XlSelect, XlTreeSelect } from "../index";
import { useTableList, useDrag } from "@/hooks";
import { Setting } from "@element-plus/icons-vue";
import Sortable from "sortablejs";

const components = {
  input: XlInput,
  select: XlSelect,
  treeSelect: XlTreeSelect,
};

const props = defineProps({
  config: {
    type: Array,
    required: true,
  },
  tableConfig: {
    type: Array,
    required: true,
  },
});
const { config, tableConfig } = toRefs(props);

const api = (params) => {
  console.log("请求参数=>>", params);
  return Promise.resolve({
    code: 0,
    data: {
      records: [
        {
          id: 1,
          username: "develop",
          gender: 0,
          device: "华为手机",
          status: 0,
        },
        {
          id: 2,
          username: "develop",
          gender: 0,
          device: "华为手机",
          status: 0,
        },
      ],
      total: 8,
    },
  });
};

const { query, Page, loading, list, total, reset, getData } = useTableList(
  api,
  "",
  2
);

// 表单实例
const formRef = ref(null);

// 重置
const resetFn = () => {
  formRef.value?.resetFields();
  reset();
};

const handleSizeChange = (e) => {
  console.log(e);
};
const handleCurrentChange = (e) => {
  console.log(e);
};

const toolTitle = [
  {
    cname: "",
    ename: "checkbox",
  },
  {
    cname: "字段名称",
    ename: "field",
  },
  {
    cname: "拖拽排序",
    ename: "sort",
  },
];

const comTools = ref([]);

comTools.value = tableConfig.value.map((tab) => {
  tab.checkbox = true;
  tab.field = tab.label;
  return tab;
});

const { dragstart, dragenter, dragover, dragend } = useDrag(comTools);

const rowDrop = () => {
  const tbody = document.querySelector(".content-left .main");

  Sortable.create(tbody, {
    handle: ".move",
    animation: 300,
    ghostClass: "ghost",
    onEnd({ newIndex, oldIndex }) {
      // const tableData = usercolumn.value;
      const currRow = comTools.value.splice(oldIndex, 1)[0];
      comTools.value.splice(newIndex, 0, currRow);
    },
  });
};

onMounted(() => {
  getData();
  rowDrop();
});
</script>

<template>
  <div class="xl-search">
    <el-form ref="formRef" :model="query" v-bind="$attrs" status-icon>
      <div class="search">
        <template v-for="item in config" :key="item.fieldName">
          <el-form-item :label="item?.fieldCname" :prop="item?.fieldName">
            <component
              :is="components[item.fieldType]"
              v-model="query"
              v-bind="item"
            >
            </component>
          </el-form-item>
        </template>
        <slot name="btns" :formRef="formRef" :query="query">
          <el-form-item class="btns">
            <el-button type="default" @click="resetFn"> 重置 </el-button>
            <el-button type="primary" @click="getData"> 查询 </el-button>
          </el-form-item>
        </slot>
      </div>
    </el-form>
    <div class="container">
      <slot name="container" :list="list">
        <div class="container-table">
          <el-popover
            placement="bottom"
            :width="400"
            :teleported="false"
            trigger="click"
            effect="dark"
            :show-arrow="false"
          >
            <template #reference>
              <div class="tool-left">
                <el-icon color="#2B4EFF"><Setting /></el-icon>
              </div>
            </template>
            <div class="content content-left">
              <div class="header">
                <div class="title" v-for="tool in toolTitle" :key="tool.ename">
                  {{ tool.cname }}
                </div>
              </div>
              <div class="main">
                <div
                  class="header"
                  v-for="(item, index) in comTools"
                  :key="item.prop"
                >
                  <div
                    class="title"
                    v-for="tool in toolTitle"
                    :key="tool.ename"
                  >
                    <template v-if="tool.ename === 'checkbox'">
                      <el-checkbox v-model="item[tool.ename]"></el-checkbox>
                    </template>
                    <template v-else-if="tool.ename === 'sort'">
                      <img src="@images/technology/drag.png" class="move" />
                    </template>
                    <template v-else>
                      {{ item[tool.ename] }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </el-popover>

          <el-table
            :data="list"
            v-loading="loading"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <template v-for="tab in comTools" :key="tab.prop">
              <el-table-column :label="tab.label" v-if="tab.checkbox">
                <template #default="{ row, $index }">
                  <!-- 切换开关 -->
                  <el-switch
                    v-if="tab.type == 'switch'"
                    :loading="row?.loading"
                    size="small"
                    :before-change="
                      () => tab.beforeChange(list, $index, tab.prop)
                    "
                    :active-value="tab.activeValue"
                    :inactive-value="tab.inactiveValue"
                    :value="row?.[tab.prop]"
                  />

                  <!-- 跳转其他页面 -->
                  <template v-else-if="tab.type == 'link'">
                    <span
                      v-for="opt in tab.options"
                      :key="opt.name"
                      class="link"
                      @click="opt.click(row?.id)"
                    >
                      {{ opt.name }}
                    </span>
                  </template>

                  <!-- 数据转换 -->
                  <template v-else>
                    {{
                      tab.transform
                        ? tab.transform(row[tab.prop])
                        : row[tab.prop]
                    }}
                  </template>
                </template>
              </el-table-column>
            </template>
          </el-table>

          <el-popover
            placement="bottom"
            :width="400"
            :teleported="false"
            trigger="click"
            effect="dark"
          >
            <template #reference>
              <div class="tool">
                <el-icon color="#2B4EFF"><Setting /></el-icon>
              </div>
            </template>
            <div class="content">
              <div class="header">
                <div class="title" v-for="tool in toolTitle" :key="tool.ename">
                  {{ tool.cname }}
                </div>
              </div>
              <div class="main">
                <transition-group name="list">
                  <div
                    class="header"
                    v-for="(item, index) in comTools"
                    :key="item.prop"
                    :draggable="true"
                    @dragstart="dragstart($event, index)"
                    @dragenter="dragenter($event, index)"
                    @dragend="dragend($event)"
                    @dragover="dragover($event)"
                  >
                    <div
                      class="title"
                      v-for="tool in toolTitle"
                      :key="tool.ename"
                    >
                      <template v-if="tool.ename === 'checkbox'">
                        <el-checkbox v-model="item[tool.ename]"></el-checkbox>
                      </template>
                      <template v-else-if="tool.ename === 'sort'">
                        <img src="@images/technology/drag.png" />
                      </template>
                      <template v-else>
                        {{ item[tool.ename] }}
                      </template>
                    </div>
                  </div>
                </transition-group>
              </div>
            </div>
          </el-popover>
        </div>
      </slot>
    </div>

    <div class="footer">
      <el-pagination
        hide-on-single-page
        background
        :total="total"
        v-model:current-page="Page.current"
        v-model:page-size="Page.size"
        :page-sizes="[1, 2, 3, 4]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}
.xl-search {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .container {
    margin: 10px 0;
    flex: 1 0 0;
    overflow-x: hidden;
    overflow-y: auto;
    &-table {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      :deep(.el-table) {
        width: 100%;
        height: 100%;
        .link {
          cursor: pointer;
          color: #143bff;
        }
      }
      .tool {
        position: absolute;
        top: 15px;
        right: 20px;
        z-index: 99;
        cursor: pointer;
      }
      .tool-left {
        position: absolute;
        top: 15px;
        left: 20px;
        z-index: 99;
        cursor: pointer;
      }
      .content {
        .header {
          display: flex;
          .title {
            flex: 1 0 0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              display: block;
              width: 30px;
              height: 30px;
              cursor: move;
            }
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
  }
}
.search {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  :deep(.el-form-item) {
    padding: 5px;
    .el-form-item__content {
      width: 240px;
      .el-select {
        width: 100%;
      }
    }
  }
  .btns {
    :deep(.el-form-item__content) {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
