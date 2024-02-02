<template>
  <div class="right">
    <!-- 预警列表 -->
    <div class="top">
      <warning-list></warning-list>
      <div class="push">
        <quality-analysis class="mb-20"></quality-analysis>
        <push-warning></push-warning>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QualityAnalysis, WarningList, PushWarning } from "./components";
</script>

<style lang="scss" scoped>
.mb-20 {
  margin-bottom: 20px;
}
.right {
  // box-sizing: border-box;
  // position: absolute;
  // top: 128px;
  // right: 24px;
  // width: 948px;
  // display: flex;
  // flex-wrap: wrap;
  // z-index: 2;
  // animation: fade-left 1s ease-in-out;

  box-sizing: border-box;
  position: absolute;
  top: 128px;
  left: 24px;
  width: 948px;
  display: flex;
  flex-wrap: wrap;
  z-index: 2;
  animation: fade-left 1s ease-in-out;
  .middle,
  .footer {
    display: flex;
    gap: 20px;
  }
}

.top {
  width: 948px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

// @keyframes fade-left {
//   from {
//     opacity: 0;
//     transform: translateX(100%);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// }

@keyframes fade-left {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
