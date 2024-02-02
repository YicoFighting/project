<template>
  <div class="holographic">
    <div class="search">
      <el-input v-model="keyword" placeholder="请输入"> </el-input>
      <el-button type="primary" class="search-btn" @click="queryClick">
        查询
      </el-button>
      <el-button class="search-btn" @click="add">添加</el-button>
    </div>

    <div class="graph">
      <xl-atlas
        ref="graph"
        :graph-data="graphData"
        @expansion="expansion"
        @delete="deleteData"
      ></xl-atlas>
    </div>
  </div>
</template>

<script setup>
import { XlAtlas } from "@/components";
import { getCurrentInstance, nextTick, onMounted, ref } from "vue";

const { proxy } = getCurrentInstance();

// 关键词
const keyword = ref("刘文伟");

// 关系信息数据
const graphData = ref({});

// mock数据
const mock = (searchKey) => {
  let res = {
    code: 0,
    data: {},
    msg: "ok",
  };
  searchKey = searchKey ?? keyword.value;
  // mock数据
  if (searchKey === "王俊") {
    res = {
      code: 0,
      data: {
        personAjRelationVos: [
          {
            ajDesc: "涉黄",
            ajNo: "123456",
            certNo: "123456",
            gxlx: "嫌疑人",
            personName: "刘文伟",
          },
          {
            ajDesc: "涉黄",
            ajNo: "123456",
            certNo: "321",
            gxlx: "打处人",
            personName: "王俊",
          },
        ],
        personCarRelationVos: [
          {
            certNo: "123456",
            gxlx: "驾车",
            personName: "刘文伟",
            plateNo: "苏123456",
            time: "202023-05-27 17:49:14",
          },
          {
            certNo: "321",
            gxlx: "乘车",
            personName: "王俊",
            plateNo: "苏123456",
            time: "202023-05-27 17:49:14",
          },
        ],
        personRelationsVos: [
          {
            endTime: "2023-06-27 17:49:14",
            fromCertNo: "321",
            fromPersonName: "王俊",
            gxlx: "同行关系",
            gxms: "",
            startTime: "2023-05-27 17:49:14",
            toCertNo: "123456",
            toPersonName: "刘文伟",
          },
          {
            endTime: "2023-05-27 17:49:14",
            fromCertNo: "321",
            fromPersonName: "王俊",
            gxlx: "同行关系",
            gxms: "",
            startTime: "2023-04-27 17:49:14",
            toCertNo: "654321",
            toPersonName: "元芳",
          },
          {
            fromCertNo: "321",
            fromPersonName: "王俊",
            gxlx: "同事关系",
            gxms: "",
            toCertNo: "987",
            toPersonName: "冯慷慨",
          },
          {
            fromCertNo: "321",
            fromPersonName: "王俊",
            gxlx: "同事关系",
            gxms: "",
            toCertNo: "654",
            toPersonName: "郑启航",
          },
          {
            fromCertNo: "987",
            fromPersonName: "冯慷慨",
            gxlx: "同事关系",
            gxms: "",
            toCertNo: "654",
            toPersonName: "郑启航",
          },
          {
            fromCertNo: "321",
            fromPersonName: "王俊",
            gxlx: "同行关系",
            gxms: "",
            toCertNo: "1234",
            toPersonName: "王盛",
          },
        ],
      },
      msg: "ok",
    };
  } else if (searchKey === "刘文伟") {
    res = {
      code: 0,
      data: {
        personAjRelationVos: [
          {
            ajDesc: "涉黄",
            ajNo: "123456",
            certNo: "123456",
            gxlx: "嫌疑人",
            personName: "刘文伟",
          },
          {
            ajDesc: "涉黄",
            ajNo: "123456",
            certNo: "321",
            gxlx: "打处人",
            personName: "王俊",
          },
        ],
        personCarRelationVos: [
          {
            certNo: "123456",
            gxlx: "驾车",
            personName: "刘文伟",
            plateNo: "苏123456",
            time: "202023-05-27 17:49:14",
          },
          {
            certNo: "321",
            gxlx: "乘车",
            personName: "王俊",
            plateNo: "苏123456",
            time: "202023-05-27 17:49:14",
          },
        ],
        personRelationsVos: [],
      },
      msg: "ok",
    };
  }

  return res;
};

// 查询
const queryClick = () => {
  const res = mock();

  graphData.value = res.data;

  nextTick(() => {
    proxy.$refs?.graph?.draw(true);
  });
};

// 添加数据(扩展及搜索添加)
const addData = (res) => {
  if (res.data.personRelationsVos) {
    graphData.value.personRelationsVos =
      graphData.value.personRelationsVos ?? [];
    graphData.value.personRelationsVos.push(...res.data.personRelationsVos);
  }

  if (res.data.personCarRelationVos) {
    graphData.value.personCarRelationVos =
      graphData.value.personCarRelationVos ?? [];
    graphData.value.personCarRelationVos.push(...res.data.personCarRelationVos);
  }

  if (res.data.personAjRelationVos) {
    graphData.value.personAjRelationVos =
      graphData.value.personAjRelationVos ?? [];
    graphData.value.personAjRelationVos.push(...res.data.personAjRelationVos);
  }
};

// 点击添加  列表页添加
const add = () => {
  const res = mock();

  addData(res);

  // 重新绘制画布
  proxy.$refs.graph.draw(true);
};

// 关系扩展 列表页添加
const expansion = (id) => {
  if (id == 321 || id == 123456) {
    const res = mock(id == 321 ? "王俊" : "刘文伟");
    addData(res);
    proxy.$refs.graph.handleExpand();
  } else {
    proxy.$Message.warning("没有更多关系");
  }
};

// 删除节点 这里其实要删除列表的数据
const deleteData = () => {};

onMounted(() => {
  queryClick();
});
</script>

<style lang="scss" scoped>
.holographic {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background: rgba(64, 158, 255, 0.1);
  .search {
    display: flex;
    &-btn {
      margin-left: 20px;
    }
  }
  .graph {
    flex: 1 0 0;
    overflow: hidden;
  }
}
</style>
