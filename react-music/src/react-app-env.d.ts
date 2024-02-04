/// <reference types="react-scripts" />

// 不修改源码的同时, 增加 ProcessEnv 的类型
declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BASE_URL: string
  }
}
