<template>
  <form>
    <slot></slot>
  </form>
</template>

<script setup>
import { provide, reactive } from "vue";

const props = defineProps({
  rules: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
});

// 维护字段的错误表
const errorMap = reactive({});

// 校验函数
const validateFn = (field) => {
  return new Promise((resolve, reject) => {
    const { rules, data } = props;
    // 字段校验规则
    const ruleItem = rules[field];
    // 字段对应的值
    const dataItem = data[field];
    // 如果字段为必传 但是字段对应的值为空的话报错
    if (ruleItem.required && dataItem === "") {
      return reject();
    }
    resolve();
  });
};

// 校验某个字段
const validate = (field) => {
  validateFn(field)
    .then(() => {
      errorMap[field] = false;
    })
    .catch(() => {
      errorMap[field] = true;
    });
};

// 注入
provide("a-form", {
  validate,
  getErrorMap: () => errorMap,
});
</script>
