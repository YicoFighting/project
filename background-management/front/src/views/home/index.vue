<template>
  <div class="home">
    <xl-pdf url="/test.pdf"></xl-pdf>
  </div>
</template>

<script setup>
import { XlPdf } from "@/components";
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
