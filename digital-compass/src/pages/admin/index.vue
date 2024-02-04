<template>
  <view>
    <tab-bar current="4">
      <view class="admin">
        <nav-bar title="我的" color="#fff"></nav-bar>
        <view class="admin-main">
          <view class="admin-main_top flex-direction-align">
            <view class="admin-selfAvatar flex-center">
              <image src="/static/images/admin/avatar.png" class="self-avatar"></image>
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

onShow(() => {
  uni.hideTabBar({
    animation: false,
  })
})
</script>

<style lang="scss" scoped>
.admin {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #6e85ff 0%, #3f5ce8 55%, #f2f3f5 100%);
  display: flex;
  flex-direction: column;
  .admin-main {
    flex: 1 0 0;
    box-sizing: border-box;
    margin-top: 66rpx;
    padding: 0 50rpx;
    background: #f2f3f5;
    border-radius: 40rpx 40rpx 0rpx 0rpx;
    border: 2rpx solid #ffffff;
    border-bottom: none;
    .admin-main_top {
      margin-top: -46rpx;

      .self-avatar {
        background: none !important;
        width: 192rpx;
        height: 192rpx;
      }

      .admin-selfAvatar {
        width: 272rpx;
        height: 272rpx;
      }

      .admin-name {
        font-size: 44rpx;
        font-weight: 500;
        color: #12132c;
      }
    }
  }
}
.flex-direction-align,
.flex-center {
  display: flex;
  justify-content: center;
}
</style>
