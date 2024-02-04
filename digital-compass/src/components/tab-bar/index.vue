<template>
  <view class="tab">
    <view class="tab-content">
      <slot></slot>
    </view>
    <view class="mask">
      <view class="tab-bar" :style="{ 'padding-bottom': paddingBottomHeight + 'rpx' }">
        <view
          class="tab-bar-item"
          v-for="(item, index) in list"
          :key="index"
          @click="tabbarChange(item.pagePath)"
        >
          <view v-if="index == 2">
            <image class="appointment_img" src="/static/images/tab-bars/appointment-icon.png" />
            <image class="tab_img" :src="item.iconPath" hidden></image>
            <view class="appointment_text tab_text" v-if="item.text">{{ item.text }}</view>
          </view>
          <template v-else>
            <image class="tab_img" :src="item.selectedIconPath" v-if="current == index"></image>
            <image class="tab_img" :src="item.iconPath" v-else></image>
            <view
              class="tab_text"
              :class="{ tab_text_active: current == index }"
              v-if="item.text"
              >{{ item.text }}</view
            >
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

defineProps<{
  current?: string | number
}>()

const paddingBottomHeight = shallowRef(0)
const list = [
  {
    pagePath: '/pages/home/index',
    selectedIconPath: '/static/images/tab-bars/home-active.png',
    iconPath: '/static/images/tab-bars/home.png',
    text: '首页',
  },
  {
    pagePath: '/pages/building/index',
    selectedIconPath: '/static/images/tab-bars/building-active.png',
    iconPath: '/static/images/tab-bars/building.png',
    text: '大厦导览',
  },
  {
    pagePath: '/pages/news/index',
    selectedIconPath: '/static/images/tab-bars/message-active.png',
    iconPath: '/static/images/tab-bars/message.png',
    text: '预约登记',
  },
  {
    pagePath: '/pages/pr/index',
    selectedIconPath: '/static/images/tab-bars/pr-active.png',
    iconPath: '/static/images/tab-bars/pr.png',
    text: '产品中心',
  },
  {
    pagePath: '/pages/admin/index',
    selectedIconPath: '/static/images/tab-bars/admin-active.png',
    iconPath: '/static/images/tab-bars/admin.png',
    text: '我的',
  },
]

const tabbarChange = (path: any) => {
  if (path === '/pages/news/index') {
    uni.navigateTo({
      url: path,
    })
  } else {
    uni.switchTab({
      url: path,
    })
  }
}
</script>

<style lang="scss">
.tab {
  width: 100%;
  height: 100vh;
  &-content {
    height: calc(100% - 170rpx);
    overflow-x: hidden;
    overflow-y: auto;
  }
}
.mask {
  position: relative;
  width: 100%;
  height: 170rpx;
  background: #f2f3f5;
}
.tab-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 170rpx;
  display: flex;
  background: url('/static/images/tab-bars/bars-back.png') no-repeat;
  background-size: 100%;
  vertical-align: middle;
  border: none;

  .tab-bar-item {
    flex: 1;
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    .appointment_img {
      width: 88rpx;
      height: 88rpx;
    }

    .tab_img {
      width: 52rpx;
      height: 52rpx;
    }

    .tab_text {
      margin: 16rpx 0;
      font-size: 24rpx;
      color: #8d939f;
    }
    .tab_text_active {
      color: #12132c;
    }
    .appointment_text {
      color: #546fff;
    }
  }
}
.middle {
  position: relative;
  width: 100rpx;
  height: 100rpx;

  .tab_img {
    position: absolute;
    top: -50rpx;
    left: 0;
    width: 80rpx !important;
    height: 80rpx !important;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    padding: 10rpx;
    background-color: rgba(#3c56e3, 0.8);
  }
  .tab_text {
    position: absolute;
    left: 30rpx;
    bottom: 14rpx;
  }
}
</style>
