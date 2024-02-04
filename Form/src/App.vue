<template>
  <a-form :rules="rules" :data="formData">
    <a-form-item v-for="item in Object.keys(rules)" :key="item" :field="item">
      <a-input v-model="formData[item]" />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive } from "vue";
import AForm from "./components/form/index.vue";
import AFormItem from "./components/form-item/index.vue";
import AInput from "./components/input/index.vue";

const rules = {
  username: {
    required: true,
  },
  password: {
    required: true,
  },
};

const formData = reactive({
  username: "哈哈哈",
  password: "",
});
</script>
