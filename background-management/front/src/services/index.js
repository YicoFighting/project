import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  //自定义抛出错误的 HTTP code
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么(401码跳转登录)
    return Promise.reject(error);
  }
);

export default service;
