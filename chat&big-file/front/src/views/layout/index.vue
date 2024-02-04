<script setup name="layout">
import SiderMenu from "./components/SiderMenu.vue";
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/Pinia/user";
const route = useRoute();
const router = useRouter();
const store = useUserStore();
const selectedKeys = ref([]);
const openKeys = ref([]);

defineProps({
  Level1: {
    type: Boolean,
    default: false,
  },
});
/**
 * 将路径一层层剥开,然后设置成penKeys
 * @param {*} full 完整的路由路径
 */
const getOpenKeys = (full) => {
  if (!full)
    throw new Error("The path is empty!I wish you wouldn not do that.");
  const arr = [];
  const keys = full.split("/").slice(1);
  keys.forEach((key, index) => {
    arr.push("/" + keys.slice(0, index + 1).join("/"));
  });
  return arr;
};
/**
 * 如果是关闭的话,inneropenKeys长度会小于openKeys的长度
 * @param {*} inneropenKeys
 */
const onOpenChange = (inneropenKeys) => {
  if (openKeys.value.length >= inneropenKeys.length) {
    openKeys.value = inneropenKeys;
  } else {
    const latestOpenKey = inneropenKeys.find(
      (key) => openKeys.value.indexOf(key) === -1
    );
    openKeys.value = getOpenKeys(latestOpenKey);
  }
};

watchEffect(() => {
  //刷新时选定
  selectedKeys.value = [route.path];
  //刷新时展开
  openKeys.value = getOpenKeys(route.fullPath);
});
</script>

<template>
  <a-layout class="layout">
    <a-layout-sider class="sider" theme="light">
      <div class="logo">LOGO</div>
      <a-menu
        mode="inline"
        v-model:selectedKeys="selectedKeys"
        :openKeys="openKeys"
        @openChange="onOpenChange"
      >
        <sider-menu :staticRoutes="store.siderMenu"></sider-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="top"> </a-layout-header>
      <a-layout-content class="content">
        <slot v-if="Level1"></slot>
        <router-view v-else> </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .sider {
    background-color: @body-background;
    overflow-x: hidden;
    overflow-y: auto;
    .logo {
      height: 32px;
      text-align: center;
      line-height: 32px;
      margin: 16px;
      background-color: @body-background;
      color: #fff;
    }
  }
  .top {
    text-align: right;
    background-color: @body-background;
    overflow: hidden;
    :deep(.ant-image) {
      img {
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .user {
      margin-left: 10px;
      cursor: pointer;
      &:hover {
        color: #1890ff;
      }
    }
  }
}
.content {
  background-color: @body-background;
}
.switch {
  margin-left: 10px;
}
</style>
