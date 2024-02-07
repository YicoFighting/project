import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

export interface IResultData<T> {
  code: number;
  data: T;
}

class Request {
  instance: AxiosInstance;
  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create(config);

    this.instance.interceptors.request.use((config) => {
      return config;
    });
    this.instance.interceptors.response.use((res) => {
      return res;
    });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<T>(config)
        .then((res) => {
          resolve(res.data);
        })
        .catch(reject);
    });
  }

  get<T = any>(url: string, params?: any): Promise<T> {
    return this.request<T>({ url, params, method: "GET" });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ url, data, method: "POST", ...config });
  }
}

const request = new Request({
  baseURL: "http://codercba.com:9060/music-next/api",
  timeout: 1000 * 60,
});

export default request;
