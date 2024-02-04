<template>
  <div>
    <slot></slot>
    <div style="color: red" v-if="data.showError">字段必填</div>
  </div>
</template>

<script setup>
import { provide, inject, reactive } from "vue";
const props = defineProps({
  field: {
    type: String,
    default: "",
  },
});

const data = reactive({
  showError: false,
});

const AForm = inject("a-form");

const onChange = () => {
  setTimeout(() => {
    if (AForm) {
      // 是否校验失败
      const showError = AForm.getErrorMap()[props.field];
      data.showError = showError;
    }
  });
};

// 注入
provide("a-form-item", {
  getField: () => props.field,
  onChange,
});
</script>
