import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { requestConfig } from './type'

class Request {
  instance: AxiosInstance

  constructor(config: requestConfig) {
    this.instance = axios.create(config)

    // 全局对应请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return error
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        return res.data
      },
      (error) => {
        return error
      }
    )

    // 实例请求拦截
    if (config.interceptors) {
      this.instance.interceptors.request.use(
        config.interceptors?.requestSuccess,
        config.interceptors?.requestError
      )

      this.instance.interceptors.response.use(
        config.interceptors?.responseSuccess,
        config.interceptors?.responseError
      )
    }
  }

  // T：响应数据类型 第二个 T 将响应数据类型传入到响应拦截成功中
  request<T = any>(config: requestConfig<T>) {
    // 在请求之前更改config
    if (config.interceptors?.requestSuccess) {
      config = config.interceptors.requestSuccess(
        config as InternalAxiosRequestConfig<any>
      )
    }
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 在响应成功之前更改res
          if (config.interceptors?.responseSuccess) {
            res = config.interceptors.responseSuccess(res)
          }
          // 设置响应数据类型
          // resolve(res as unknown as T); 不建议
          resolve(res)
        })
        .catch(reject)
    })
  }
  get<T = any>(config: requestConfig<T>) {
    return this.request<T>({
      ...config,
      method: 'GET'
    })
  }
  post<T = any>(config: requestConfig<T>) {
    return this.request<T>({
      ...config,
      method: 'POST'
    })
  }
  delete<T = any>(config: requestConfig<T>) {
    return this.request<T>({
      ...config,
      method: 'DELETE'
    })
  }
  patch<T = any>(config: requestConfig<T>) {
    return this.request<T>({
      ...config,
      method: 'PATCH'
    })
  }
}

export default Request

// 成功的顺序：
//    单个请求成功的拦截 => 实例请求成功的拦截 => 全局请求成功的拦截 => 全局响应成功的拦截 => 实例响应成功的拦截 => 单个响应成功的拦截
