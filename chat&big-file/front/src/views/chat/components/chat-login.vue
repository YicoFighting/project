<script setup>
import { reactive } from "vue";
const emits = defineEmits(["login"]);
const formState = reactive({
  username: "",
  password: "123456",
});
const onFinish = (values) => {
  emits("login", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>

<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: '请选择登录账号' }]"
    >
      <a-select v-model:value="formState.username">
        <a-select-option value="810">xxxx-810</a-select-option>
        <a-select-option value="109">llll-109</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{ required: true, message: '请输入密码!' }]"
    >
      <a-input-password v-model:value="formState.password" autocomplete="off" />
    </a-form-item>
    <a-form-item class="action">
      <a-button type="primary" html-type="submit"> 登录 </a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="less" scoped>
.action {
  display: flex;
  justify-content: center;
  :deep(.ant-btn) {
    width: 100%;
    border-radius: 5px;
  }
}
</style>
