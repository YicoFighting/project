<script setup name="Container">
import { XlSearch } from "@/components";
import { getDict, getTreeData } from "@/utils";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useTagsViewStore from "@/store/tagsView";

const tagsViewStore = useTagsViewStore();

const { gender } = getDict("gender");
const devices = ref([]);

const route = useRoute();
const router = useRouter();

const getTreeDataFn = async () => {
  devices.value = await getTreeData();
};

const config = ref([
  {
    fieldType: "input",
    fieldName: "username",
    fieldCname: "用户名",
  },
  // 数据字典
  {
    fieldType: "select",
    fieldName: "gender",
    fieldCname: "性别",
    options: gender,
  },
  // 树形数据
  {
    fieldType: "treeSelect",
    fieldName: "device",
    fieldCname: "设备",
    data: devices,
    props: {
      label: "name",
      children: "children",
    },
  },
]);

const tableConfig = ref([
  {
    prop: "username",
    label: "用户名",
  },
  {
    prop: "gender",
    label: "性别",
    transform(data) {
      if (gender.value) {
        const item = gender.value.find((one) => one.value == data);
        return item ? item["label"] : data;
      } else {
        return data;
      }
    },
  },
  {
    prop: "device",
    label: "设备",
  },
  {
    prop: "status",
    label: "状态",
    type: "switch",
    activeValue: 0,
    inactiveValue: 1,
    beforeChange() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    },
  },
  {
    prop: "options",
    label: "操作",
    options: [
      {
        name: "详情",
        click(id) {
          tagsViewStore.addView(route);
          router.push("/tools/container/detail/" + id);
        },
      },
    ],
    type: "link",
  },
]);

onMounted(() => {
  getTreeDataFn();
});
</script>

<script>
import useTagsViewStore from "@/store/tagsView";

export default {
  name: "container",
  beforeRouteEnter(to, from) {
    if (!from.path.startsWith("/tools/container/detail")) {
      const tagsViewStore = useTagsViewStore();
      tagsViewStore.delView({ name: "container" });
    }
  },
};
</script>

<template>
  <div class="container">
    <xl-search :config="config" :table-config="tableConfig"> </xl-search>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
