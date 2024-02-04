<template>
  <view>
    <tab-bar current="3">
      <view class="pr">
        <nav-bar title="产品中心" color="#fff"></nav-bar>
        <view class="pr-main">
          <view class="flex-space-between">
            <image src="../../static/images/pr/des.png" class="img-des"></image>
            <image src="../../static/images/pr/pr-icon.png" class="img-icon"></image>
          </view>
          <view class="pr-list">
            <view
              v-for="item in videoList"
              :key="item.title"
              class="pr-list_main flex-space-between"
            >
              <video
                :id="item.id"
                :src="item.url"
                controls
                class="pr-video"
                enable-play-gesture
                :direction="90"
                play-btn-position="center"
                :poster="item.poster"
                object-fit="fill"
                @play="goFull(item.id)"
              ></video>

              <view class="pr-list_des">
                <view class="title">
                  {{ item.title }}
                </view>
                <view class="des">
                  {{ item.des }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </tab-bar>
  </view>
</template>

<script lang="ts" setup>
import NavBar from '@/components/nav-bar/index.vue'
import TabBar from '@/components/tab-bar/index.vue'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
const imageUrl = 'https://digital.jiketravel.com/static/'
const videoUrl = 'https://digital.jiketravel.com/video/'
const videoList = ref([
  {
    id: 'myVideo1',
    title: 'AI无人机',
    des: 'AI全栈技术负载，支撑业务场景定制',
    url: `${videoUrl}ai.mp4`,
    poster: `${imageUrl}video-1.png`,
  },
  {
    id: 'myVideo2',
    title: '数智罗盘平台',
    des: '全系统灵活部署，软硬件协同定制',
    url: `${videoUrl}szlppt.mp4`,
    poster: `${imageUrl}video-2.png`,
  },
  {
    id: 'myVideo3',
    title: '数智车管平台',
    des: '多场景智能交互，多功能集成应用',
    url: `${videoUrl}szcgpt.mp4`,
    poster: `${imageUrl}video-3.png`,
  },
])
const videoContext = ref<UniApp.VideoContext>()
const isFullscreen = ref(false)

const goFull = (id: string) => {
  videoContext.value = uni.createVideoContext(id)
  if (!isFullscreen.value) {
    videoContext.value.requestFullScreen()
  }
}

onShow(() => {
  uni.hideTabBar({
    animation: false,
  })
})
</script>

<style lang="scss" scoped>
.pr {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: url('../../static/images/pr/pr-back.png') no-repeat;
  background-size: cover;
  padding: 0 50rpx;
  display: flex;
  flex-direction: column;
  .pr-main {
    flex: 1 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .img-des {
      width: 302rpx;
      height: 154rpx;
    }

    .img-icon {
      width: 226rpx;
      height: 252rpx;
    }

    .pr-list {
      flex: 1 0 0;
      overflow-x: hidden;
      overflow-y: auto;
      margin-top: 32rpx;

      .pr-list_main {
        width: calc(100% - 26rpx);
        margin-left: 26rpx;
        height: 264rpx;

        background: #f9fafc;
        /* box-shadow:
          -16rpx -16rpx 66rpx 2rpx #ffffff,
          16rpx 16rpx 66rpx 2rpx #dfe0e2; */
        border-radius: 28rpx;
        opacity: 1;
        border: 2rpx solid #ffffff;
        margin-top: 50rpx;
        padding-right: 36rpx;
        gap: 26rpx;

        &:nth-of-type(1) {
          box-shadow: none;
          margin-top: 0;
        }

        .pr-video {
          margin-left: -26rpx;
          width: 208rpx;
          height: 186rpx;
          /* box-shadow: 0rpx 16rpx 32rpx 2rpx #c5cdf1; */
          border-radius: 28rpx;
          opacity: 1;
        }

        .pr-list_des {
          .title {
            font-size: 40rpx;
            font-family:
              Source Han Sans CN-Medium,
              Source Han Sans CN;
            font-weight: 500;
            color: #232f45;
          }

          .des {
            margin-top: 6rpx;
            width: 380rpx;
            height: 90rpx;
            font-size: 32rpx;
            font-family:
              Source Han Sans CN-Regular,
              Source Han Sans CN;
            font-weight: 400;
            color: #6e7685;
            line-height: 42rpx;
          }
        }
      }

      .pr-list_main_down7 {
        height: 200rpx !important;
      }
    }
  }
}
.flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
