<template>
  <div class="left">
    <device-statistics class="mb-20"></device-statistics>

    <div class="middle mb-20">
      <today-warning></today-warning>
      <dispose-warning></dispose-warning>
    </div>

    <div class="footer">
      <access-control></access-control>
      <online-equipment></online-equipment>
    </div>
  </div>
</template>

<script setup>
import {
  DeviceStatistics,
  TodayWarning,
  DisposeWarning,
  AccessControl,
  OnlineEquipment,
} from "./components";
</script>

<style lang="scss" scoped>
.mb-20 {
  margin-bottom: 20px;
}
.left {
  // box-sizing: border-box;
  // position: absolute;
  // top: 128px;
  // left: 24px;
  // width: 948px;
  // display: flex;
  // flex-wrap: wrap;
  // z-index: 2;
  // animation: fade-left 1s ease-in-out;

  box-sizing: border-box;
  position: absolute;
  top: 128px;
  right: 24px;
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

// @keyframes fade-left {
//   from {
//     opacity: 0;
//     transform: translateX(-100%);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// }

@keyframes fade-left {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
