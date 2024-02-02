// src\types\components.d.ts
import XtxSwiper from '@/components/xtx-swiper/index.vue'
import XtxGuess from '@/components/xtx-guess/index.vue'

declare module 'vue' {
  export interface GlobalComponents {
    XtxSwiper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
  }
}

// 组件实例类型
export type XtxGuessInstance = InstanceType<typeof XtxGuess>
export type XtxSwiperInstance = InstanceType<typeof XtxSwiper>
