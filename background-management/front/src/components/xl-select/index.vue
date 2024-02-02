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
  <!-- 遍历组件插槽 -->
  <el-select
    v-model="value[$attrs?.fieldName]"
    v-bind="$attrs"
    :placeholder="`请选择${$attrs?.fieldCname}`"
  >
    <el-option
      v-for="option in $attrs.options"
      :key="option"
      :label="option.label"
      :value="option.value"
    />

    <template v-for="(_value, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}"> </slot>
    </template>
  </el-select>
</template>

<style lang="scss" scoped></style>
