<script setup>
import { XlForm } from "@/components";
import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getQrCode,
  getQrcodeResult,
  getLoginQrCode,
  loginAction,
} from "@/services/login";

const yzmInfo = ref({
  fieldType: "input",
  fieldName: "yzm",
  fieldCname: "验证码",
});

const config = ref([
  {
    fieldType: "input",
    fieldName: "username",
    fieldCname: "用户名",
  },
  {
    fieldType: "input",
    fieldName: "password",
    fieldCname: "密码",
    type: "password",
    showPassword: true,
  },
  yzmInfo.value,
]);
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 6, message: "用户名至少为6位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少为6位", trigger: "blur" },
  ],
  yzm: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const { proxy } = getCurrentInstance();

const route = useRoute();
const router = useRouter();

// 二维码相关信息
const qrcodeInfo = ref({});

let intervalId = null;

// 点击登录
const login = async (formRef, query) => {
  try {
    const valid = await formRef.validate();
    if (valid) {
      const uuid = localStorage.getItem("login_uuid");
      const { token } = await loginAction({ ...query, uuid });
      localStorage.setItem("token", token);
      const redirect = route.query?.redirect;
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
      proxy.$Message.success("登录成功~");
    }
  } catch (error) {
    const message = error.message ?? "校验失败";
    proxy.$Message.error(message);
  }
};

// 获取二维码
const getQrCodeFn = async () => {
  const { data } = await getQrCode();
  localStorage.setItem("uuid", data?.uuid);
  qrcodeInfo.value = data;

  intervalId = setInterval(() => {
    getQrcodeResultFn();
  }, 2000);
};

// 轮询扫码结果
const getQrcodeResultFn = async () => {
  const uuid = localStorage.getItem("uuid");
  if (uuid) {
    const res = await getQrcodeResult({ uuid });

    if (res.code == 0) {
      console.log("扫码成功");
      intervalId && clearInterval(intervalId);
    } else if (res.code == 500) {
      console.log("二维码过期");
      intervalId && clearInterval(intervalId);
    }
    console.log(res);
  } else {
    intervalId && clearInterval(intervalId);
  }
};

// 获取登录二维码
const getLoginQrCodeFn = async () => {
  const { data } = await getLoginQrCode();
  localStorage.setItem("login_uuid", data.uuid);
  yzmInfo.value.append = data.svg;
};

onMounted(() => {
  getQrCodeFn();
  getLoginQrCodeFn();
});

onBeforeUnmount(() => {
  intervalId && clearInterval(intervalId);
});
</script>

<template>
  <div class="login">
    <div class="login-qr">
      <div class="code" v-if="qrcodeInfo?.qrcodeUrl">
        <img :src="qrcodeInfo?.qrcodeUrl" alt="扫码登录" />
      </div>
    </div>
    <div class="login-box">
      <xl-form
        :config="config"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <template #btns="{ formRef, query }">
          <div class="login-btn">
            <el-button type="primary" @click="login(formRef, query)">
              登录
            </el-button>
          </div>
        </template>
      </xl-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-right: 10%;
  &-qr {
    flex: 1 0 0;
    height: 100%;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;
    .code {
      // 148 * 148
      width: 296px;
      height: 296px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &-box {
    flex: 1 0 0;
  }
  &-btn {
    display: flex;
    justify-content: flex-end;
    padding-right: 5%;
  }
}
</style>
