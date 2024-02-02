<script setup>
import { useModel } from "@/hooks";

const props = defineProps({
  modelValue: {
    required: true,
  },
});

const emits = defineEmits(["update:modelValue"]);

const value = useModel(props, "modelValue", emits);
</script>

<template>
  <!-- :data="$attrs.options" -->
  <el-tree-select
    v-model="value[$attrs?.fieldName]"
    node-key="id"
    multiple
    :render-after-expand="false"
    :placeholder="`请选择${$attrs?.fieldCname}`"
    show-checkbox
    v-bind="$attrs"
  />
</template>

<style lang="scss" scoped></style>
