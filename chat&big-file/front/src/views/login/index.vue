<script setup>
import { reactive } from "vue";
import axios from "@/service";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const formState = reactive({
  username: "develop_admin",
  password: "123456",
});
const onFinish = async (values) => {
  const { token } = await axios.post("/login", values, { isToken: false });
  console.log("token", token);
  localStorage.setItem("token", token);
  const redirect = route.query?.redirect;
  if (redirect) {
    router.push(redirect);
  } else {
    router.push("/index");
  }
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const toQrcode = () => {
  router.push({
    name: "qrCode",
  });
};
</script>

<template>
  <div class="login">
    <div class="login-panel">
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
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>
        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item class="action">
          <a-button @click="toQrcode"> 二维码登录 </a-button>
          <a-button type="primary" html-type="submit"> 登录 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
@border-color: #1890ff;
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &-panel {
    padding: 20px 20px 0 20px;
    border: 1px solid @border-color;
    border-radius: 10px;
    .action {
      display: flex;
      justify-content: center;
      :deep(.ant-btn) {
        width: 100%;
        border-radius: 5px;
      }
    }
  }
}
</style>
