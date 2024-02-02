<template>
  <xl-atlas
    ref="graph"
    :high-light="false"
    :screen="false"
    :graph-data="graphData"
    @expansion="expansion"
    @delete="deleteData"
  ></xl-atlas>
</template>

<script setup>
import { XlAtlas } from "@/components";
import { getCurrentInstance, nextTick, onMounted, ref } from "vue";

const { proxy } = getCurrentInstance();

// 关键词
const keyword = ref("王俊");

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

<style lang="scss" scoped></style>
