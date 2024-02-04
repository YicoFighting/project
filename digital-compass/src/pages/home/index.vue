<template>
  <view>
    <tab-bar current="0">
      <view class="home">
        <nav-bar title="罗盘科技" color="#fff"></nav-bar>
        <view class="home-content">
          <view class="index-top">
            <view>您好，</view>
            <view>罗盘科技欢迎您</view>
          </view>
          <view class="scroll">
            <view class="visitor-record_empty flex-center flex-direction-align">
              <view></view>
              <text>您暂无行程</text>
            </view>
            <view class="visitor-list">
              <view class="visitor-fill flex-space-between" @tap="goAboutLuopan">
                <view class="flex-default">
                  <view class="card-icon"></view>
                  <view class="card-des">关于罗盘</view>
                </view>
                <view class="card-right"></view>
              </view>
              <view class="visitor-fill flex-space-between" @tap="goGuide">
                <view class="flex-default">
                  <view class="card-icon"></view>
                  <view class="card-des">拜访指引</view>
                </view>
                <view class="card-right"></view>
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
const goAboutLuopan = () => {
  uni.navigateTo({
    url: '/pages/about/index',
  })
}
const goGuide = () => {
  uni.navigateTo({
    url: '/pages/guide/index',
  })
}
onShow(() => {
  uni.hideTabBar({
    animation: false,
  })
})
</script>

<style lang="scss" scoped>
.home {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: url('/static/images/index/index-back.png');
  background-size: cover;
  padding: 0 50rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &-content {
    flex: 1 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .scroll {
      flex: 1 0 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
.index-top {
  width: 424rpx;
  height: 226rpx;
  font-size: 60rpx;
  font-weight: bold;
  color: #eaeeff;
  line-height: 76rpx;
  text-align: left;
  margin-top: 160rpx;
}
.visitor-record_empty {
  margin: 0 auto;
  margin-bottom: 64rpx;
  width: 650rpx;
  height: 456rpx;
  background: #f9fafc;
  border-radius: 40rpx;
  opacity: 1;
  /* border: 2rpx solid #ffffff; */
  /* box-shadow: 16rpx 16rpx 66rpx 2rpx #dfe0e2; */
  padding-left: 38rpx;
  padding-right: 42rpx;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  view {
    width: 214rpx;
    height: 214rpx;
    background: url('../../static/images/home/no-record.png') no-repeat;
    background-size: 100%;
  }

  text {
    display: inline-block;
    width: 140rpx;
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #12132c;
    line-height: 40rpx;
    opacity: 0.5;
  }
}

.visitor-list {
  .visitor-fill {
    margin: 0 auto;
    margin-bottom: 64rpx;
    width: 651rpx;
    height: 148rpx;
    background: #f9fafc;
    /* box-shadow:
      -16rpx -16rpx 66rpx 2rpx #ffffff,
      16rpx 16rpx 66rpx 2rpx #dfe0e2; */
    border-radius: 28rpx;
    opacity: 1;
    border: 2rpx solid #ffffff;
    padding-left: 38rpx;
    padding-right: 42rpx;

    .card-icon {
      width: 80rpx;
      height: 80rpx;
      margin-right: 28rpx;
      background: url('../../static/images/icons/visitor.png') no-repeat;
      background-size: 100%;
    }

    &:nth-of-type(1) {
      .card-icon {
        width: 80rpx;
        height: 80rpx;
        margin-right: 28rpx;
        background: url('../../static/images/icons/about-luopan.png') no-repeat;
        background-size: 100%;
      }
    }

    .card-right {
      width: 40rpx;
      height: 40rpx;
      background: url('../../static/images/icons/go-right.png') no-repeat;
      background-size: 100%;
    }
  }

  .visitor-fill_down7 {
    margin-top: 26rpx !important;
  }

  .visitor-fill:nth-of-type(2) {
    margin-top: 46rpx;
  }
}

.flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-default {
  display: flex;
  align-items: center;
}
</style>
