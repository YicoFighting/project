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
  <el-input
    v-model="value[$attrs?.fieldName]"
    v-bind="$attrs"
    :placeholder="`请输入${$attrs?.fieldCname}`"
  >
    <!-- 遍历组件插槽 -->
    <template v-for="(_value, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"></slot>
    </template>
  </el-input>
</template>

<style lang="scss" scoped></style>
