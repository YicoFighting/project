import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

interface interceptorsType<T> {
  requestSuccess?: (
    config: InternalAxiosRequestConfig<any>
  ) => InternalAxiosRequestConfig<any>
  requestError?: (err: any) => any
  responseSuccess?: (res: T) => T
  responseError?: (err: any) => any
}

export interface requestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: interceptorsType<T>
}

export interface resultType {
  data: {
    [key: string]: any
  }
  returnCode: 'SUCCESS' | 'ERROR'
  success?: boolean
}
