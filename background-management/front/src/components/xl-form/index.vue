<script setup>
import { ref, toRefs } from "vue";
import { XlInput } from "../index";

const props = defineProps({
  config: {
    type: Array,
    required: true,
  },
  rules: {
    type: Object,
    required: true,
  },
});
const { config, rules } = toRefs(props);

// 表单实例
const formRef = ref(null);

// 表单数据
const query = ref({});
</script>

<template>
  <el-form
    ref="formRef"
    :rules="rules"
    :model="query"
    v-bind="$attrs"
    status-icon
  >
    <template v-for="item in config" :key="item.fieldName">
      <el-form-item :label="item?.fieldCname" :prop="item?.fieldName">
        <xl-input v-model="query" v-bind="item">
          <template v-if="item.append" #append>
            <div v-html="item.append"></div>
          </template>
        </xl-input>
      </el-form-item>
    </template>
    <slot name="btns" :formRef="formRef" :query="query"> </slot>
  </el-form>
</template>

<style lang="scss" scoped></style>
