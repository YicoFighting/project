<template>
  <div class="box zy-tooltip" v-tooltip>
    <el-tooltip effect="dark" :content="props.content" placement="top-start">
      {{ props.content || "暂无" }}
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  content: {
    type: [String, Number],
    required: true,
  },
  width: {
    type: [String, Number],
    required: true,
  },
});

const boxWidth = computed(() => props.width / 19.2 + "vw");
</script>

<style lang="scss" scoped>
.box {
  width: v-bind(boxWidth);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
