<script setup>
import XlMenu from "./index.vue";
import { computed } from "vue";

const props = defineProps({
  routes: {
    type: Array,
    required: true,
  },
  basePath: {
    type: String,
    default: "",
  },
});

// 筛选hidden为true的路由
const newRoutes = computed(() => props.routes.filter((route) => !route.hidden));

// 有子路由并且子路由中有不为hidden的路由
const isShowRoute = (children) => {
  if (children && children.length > 0) {
    return children.some((child) => !child.hidden);
  } else {
    return false;
  }
};
</script>

<template>
  <template v-for="route in newRoutes" :key="route.path">
    <el-sub-menu v-if="isShowRoute(route.children)" :index="route.path">
      <template #title>
        {{ route?.meta?.title }}
      </template>
      <xl-menu
        :routes="route.children"
        :base-path="(props.basePath ? props.basePath + '/' : '') + route.path"
      ></xl-menu>
    </el-sub-menu>

    <router-link
      v-else
      :to="(props.basePath ? props.basePath + '/' : '') + route.path"
    >
      <el-menu-item
        :index="(props.basePath ? props.basePath + '/' : '') + route.path"
      >
        <template #title>
          {{ route?.meta?.title }}
          <!-- {{ props.basePath }} {{ route.path }} -->
        </template>
      </el-menu-item>
    </router-link>
  </template>
</template>

<style lang="scss" scoped>
.menu {
  width: 100%;
  height: 100%;
  overflow: hidden;
  :deep(.el-menu) {
    height: 100%;
  }
}
</style>
