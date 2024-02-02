<template>
  <div class="xl-screen">
    <div ref="screenRef" class="xl-screen-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import windowResize from "@/utils/resize";
import { onMounted, onUnmounted } from "vue";
const { screenRef, calcRate, windowDraw, unWindowDraw } = windowResize();

onMounted(() => {
  calcRate();
  // 监听浏览器窗口尺寸变化
  windowDraw();
});

onUnmounted(() => {
  // 取消监听浏览器窗口尺寸变化
  unWindowDraw();
});
</script>

<style lang="scss" scoped>
.xl-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-container {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 4000px;
    height: 1080px;
    translate: -50% -50%;
    background-image: url("@images/common/bg.png");
    background-size: 100% 100%;
    overflow: hidden;
  }
}
</style>
