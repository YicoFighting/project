<template>
  <div class="xl-echarts">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="title" name="echarts">
        <div class="element" ref="element"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { useECharts } from "@/hooks";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  callback: {
    type: Function,
  },
});

const { title, options, callback } = toRefs(props);

const activeNames = ref(["echarts"]);

const { setOptions } = useECharts("element");

onMounted(() => {
  setOptions(options.value).then((instance) => {
    callback.value && callback.value(instance);
  });
});
</script>

<style lang="scss" scoped>
.xl-echarts {
  width: 100%;
  height: 100%;
  :deep(.el-collapse) {
    height: 100%;
    .el-collapse-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .el-collapse-item__header {
        height: 40px;
        padding-left: 20px;
      }
      .el-collapse-item__wrap {
        flex: 1 0 0;
        overflow: hidden;
        .el-collapse-item__content {
          width: 100%;
          height: 100%;
          overflow: hidden;
          padding-bottom: 0;
          .element {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
