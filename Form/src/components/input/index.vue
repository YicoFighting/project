<template>
  {{ AFormItem.getField() }}：
  <input @input="onChange" :value="data.inputValue" />
</template>

<script setup>
import { reactive, watch, inject } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["update:modelValue"]);

// 接收注入
const AForm = inject("a-form");
const AFormItem = inject("a-form-item");

// 内部维护 value
const data = reactive({
  inputValue: props.modelValue,
});

watch(
  () => props.modelValue,
  (v) => {
    data.inputValue = v;
  }
);

// 当值发生改变的时候，执行 validate、onChange
const onChange = (e) => {
  emits("update:modelValue", e.target.value);
  if (AForm && AFormItem) {
    AForm.validate(AFormItem.getField());
    AFormItem.onChange();
  }
};
</script>
