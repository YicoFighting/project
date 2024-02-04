import axios from "axios";
import { cryptParams, resolutionRes } from "@/utils";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  //自定义抛出错误的 HTTP code
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么(token)
    // 是否需要设置 token
    const isToken = config.headers?.isToken ?? true;
    if (isToken) {
      config.headers["Authorization"] = localStorage.getItem("token");
    }
    const origin = config?.params?.origin ?? false;
    if (config["data"]) {
      config["data"] = cryptParams(config["data"]);
      config["data"].origin = origin;
    }
    if (config["params"]) {
      config["params"] = cryptParams(config["params"]);
      config["params"].origin = origin;
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  async function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response["data"]?.["type"]) {
      return response["data"];
    } else {
      if (response.config.params?.origin) {
        return response.data;
      } else {
        const res = await resolutionRes(response["data"]);
        return res;
      }
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么(401码跳转登录)
    return Promise.reject(error);
  }
);

export default service;
