import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  //自定义抛出错误的 HTTP code
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
});

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => {
    // return res['data'];
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
