<script setup>
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { XMenu } from "./components";
import { usePermissionStore } from "@/store/permission";
import { computed } from "vue";

const route = useRoute();

const store = usePermissionStore();
const { routes } = storeToRefs(store);

import useTagsViewStore from "@/store/tagsView";
const tagsViewStore = useTagsViewStore();

const mouseEvent = (e) => {
  let percentage = e.clientX / window.outerWidth;
  let offset = 10 * percentage;
  let blur = 20;

  const images = document.querySelectorAll(".autumn > img");

  for (let [index, image] of images.entries()) {
    offset *= 1.3;

    let blurValue = Math.pow(index / images.length - percentage, 2) * blur;

    image.style.setProperty("--offset", `${offset}px`);
    image.style.setProperty("--blur", `${blurValue}px`);
  }
};

const activeMenu = computed(() => route?.meta?.activeMenu || route.path);
</script>

<template>
  <div class="layout">
    <el-container>
      <el-header @mousemove="mouseEvent">
        <div class="autumn">
          <img src="@/assets/images/bilibili/autumn-1.png" alt="" />
        </div>
        <div class="autumn">
          <img src="@/assets/images/bilibili/autumn-2.png" alt="" />
        </div>
        <div class="autumn">
          <img src="@/assets/images/bilibili/autumn-3.webp" alt="" />
        </div>
        <div class="autumn">
          <img src="@/assets/images/bilibili/autumn-4.png" alt="" />
        </div>
        <div class="autumn">
          <img src="@/assets/images/bilibili/autumn-5.webp" alt="" />
        </div>
        <div class="autumn">
          <img src="@/assets/images/bilibili/autumn-6.webp" alt="" />
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu unique-opened :default-active="activeMenu">
            <x-menu :routes="routes"></x-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- <keep-alive :include="['container']"></keep-alive> -->
          <router-view v-slot="{ Component, route }">
            <keep-alive :include="tagsViewStore.cachedViews">
              <component
                v-if="!route.meta.link"
                :is="Component"
                :key="route.path"
              />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  :deep(.el-header) {
    position: relative;
    height: 150px;
    overflow: hidden;
    .autumn {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      --offset: 0px;
      --blur: 2px;
      img {
        display: block;
        width: 110%;
        height: 100%;
        object-fit: cover;

        transform: translatex(var(--offset));
        filter: blur(var(--blur));
      }
    }
  }
  :deep(.el-container) {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--primary-bg-color);
  }
  :deep(.el-aside) {
    background: #fff;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .el-menu {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
  :deep(.el-main) {
    overflow: hidden;
    background: #fff;
  }
}
</style>
