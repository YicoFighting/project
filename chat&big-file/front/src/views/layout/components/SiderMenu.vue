<script setup name="sider-menu">
const props = defineProps({
  staticRoutes: {
    type: Array,
    default: () => [],
  },
  basePath: {
    type: String,
    default: "",
  },
});
const getFullPath = (path) =>
  (props.basePath ? props.basePath + "/" : "") + path;
const isHidden = (arr) => {
  return arr.some((item) => item.meta.hidden !== true);
};
</script>

<template>
  <template v-for="route in props.staticRoutes" :key="getFullPath(route.path)">
    <template v-if="route?.children && isHidden(route?.children)">
      <a-sub-menu :key="getFullPath(route.path)">
        <template #title>
          {{ route.meta.title }}
        </template>
        <sider-menu
          :staticRoutes="route?.children"
          :basePath="getFullPath(route.path)"
        ></sider-menu>
      </a-sub-menu>
    </template>
    <a-menu-item v-else :key="getFullPath(route.path)">
      <router-link :to="getFullPath(route.path)">
        {{ route?.meta?.title }}
      </router-link>
    </a-menu-item>
  </template>
</template>

<style lang="less" scoped></style>
