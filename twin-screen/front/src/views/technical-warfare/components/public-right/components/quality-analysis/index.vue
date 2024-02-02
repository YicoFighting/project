<template>
  <xl-modal-prevention
    :width="522"
    :height="311"
    title-c="数据质量分析"
    title-e="Data quality analysis"
  >
    <template #main>
      <div class="main-box">
        <quality-score></quality-score>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { XlModalPrevention } from "@/components";
import { QualityScore } from "../index";
</script>

<style lang="scss" scoped>
.main-box {
  width: 100%;
  height: 100%;
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
}
</style>
