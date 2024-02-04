<template>
  <view class="invite">
    <nav-bar title="预约登记" color="#fff"></nav-bar>
    <view class="car-invite-wrapper-top">
      <view>您好，</view>
      <view>罗盘科技欢迎您</view>
    </view>
    <view class="car-invite-wrapper-main">
      <view class="main-title flex-space-between_start">
        <view class="flex-direction-align_default main-title_left">
          <view class="main-title_left_carno">车牌号码</view>
        </view>
      </view>
      <view class="main-carbread flex-space-between" @tap="showCarKeyBord">
        <template v-for="(item, index) in brand">
          <text
            v-if="item == '新能源'"
            :key="index"
            class="dialog-license new-energy"
            @tap="onBrandClick(index)"
            :class="{ 'dialog-active': currentIndex === index }"
            :data-index="index"
            >{{ item }}
          </text>
          <text
            v-else
            :key="item"
            class="dialog-license"
            :class="{ 'dialog-active': currentIndex === index }"
            @tap="onBrandClick(index)"
            :data-index="index"
            >{{ item }}</text
          >
        </template>
      </view>
      <view class="main-car-list">
        <view v-for="(item, index) in numberPlates" :key="item" class="car-item flex-algin-center">
          <view class="car-left"></view>
          <view class="car-icon flex-default">
            <view></view>
          </view>
          <view class="car-des">{{ item }}</view>
          <view class="car-delete flex-default" @tap="deleteCarNo(index)">
            <view></view>
          </view>
        </view>
      </view>
      <view class="main-submit">
        <button @tap="submit" class="self-submit">提交</button>
      </view>
      <view class="main-time flex-default">
        <view>有效期至：</view>
        <view class="main-time_day">{{ end }}</view>
      </view>
    </view>
    <car-keybord
      v-if="showLicenseDialog"
      @onCancel="cancelLicenseDialog"
      @onOk="okLicense"
      @breadChange="breadChange"
      @currenIndexChange="currenIndexChange"
      :isShowTop="false"
      :currentIndexProp="currentIndex"
    ></car-keybord>
  </view>
</template>

<script lang="ts" setup>
import NavBar from '@/components/nav-bar/index.vue'
import CarKeybord from '@/components/car-keybord/index.vue'
import { ref } from 'vue'

type dateType = string | number
function formatDate(date: Date) {
  var year = date.getFullYear()
  var month: dateType = date.getMonth() + 1 // getMonth() 返回的月份从 0 开始
  var day: dateType = date.getDate()

  // 如果月份和日期小于 10，在前面添加 0
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return year + '.' + month + '.' + day
}

let showLicenseDialog = ref(false)

let end = ref(formatDate(new Date()))
let numberPlates = ref<string[]>([])
let brand = ref(['苏', 'E', ' ', ' ', ' ', ' ', ' ', '新能源'])
const showCarKeyBord = () => {
  showLicenseDialog.value = true
}
let currentIndex = ref(2)
const onBrandClick = (index: number) => {
  if (showLicenseDialog.value) {
    currentIndex.value = index
  }
}
const deleteCarNo = (index: number) => {
  numberPlates.value.splice(index, 1)
}

//取消添加车牌
const cancelLicenseDialog = () => {
  showLicenseDialog.value = false
  brand.value = ['苏', 'E', ' ', ' ', ' ', ' ', ' ', '新能源']
  currentIndex.value = 2
}
//添加车牌成功
const okLicense = (license: string) => {
  if (numberPlates.value.length > 50) {
    uni.showToast({
      title: '车牌最多只能输入50个',
      icon: 'none',
      duration: 1000,
      mask: true,
    })
    return
  }
  brand.value = Array.from(license)
  numberPlates.value.push(license)
  numberPlates.value = [...new Set(numberPlates.value)]
}
const breadChange = (brandInner: string[]) => {
  brand.value = brandInner
}
const currenIndexChange = (currentIndexInner: number) => {
  currentIndex.value = currentIndexInner
}
const submit = () => {
  if (numberPlates.value.length <= 0) {
    uni.showToast({
      title: '车牌号不能为空',
      icon: 'none',
      duration: 1500,
      mask: true,
    })
  }
}
</script>

<style lang="scss">
.invite {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url('/static/images/index/index-back.png') no-repeat;
  background-size: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.car-invite-wrapper-top {
  width: 424rpx;
  height: 236rpx;
  font-size: 60rpx;
  font-weight: bold;
  color: #eaeeff;
  line-height: 76rpx;
  text-align: left;
  margin-top: 90rpx;
  margin-left: 48rpx;
}
.car-invite-wrapper-main {
  /* margin-top: 48px; */
  flex: 1 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 48rpx;
  padding-bottom: 56rpx;
  background: #ffffff;

  box-shadow: 0rpx 16rpx 66rpx 2rpx #dfe0e2;
  border-radius: 40rpx 40rpx 0rpx 0rpx;
  opacity: 1;
  border: 2rpx solid #ffffff;

  .main-title {
    padding-left: 50rpx;
    padding-right: 48rpx;

    .main-title_left {
      .main-title_left_carno {
        height: 48rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #232f45;
      }
    }
  }

  .main-carbread {
    position: absolute;
    left: 0;
    z-index: 1000;
    margin-top: 62rpx;
    height: 80rpx;
    padding: 0 48rpx;

    .dialog-license {
      width: 64rpx;
      height: 92rpx;
      background: #f2f3f5;
      box-shadow: inset 2rpx 2rpx 6rpx 2rpx rgba(0, 0, 0, 0.16);
      border-radius: 28rpx;
      opacity: 1;
      border: 2rpx solid #ffffff;
      color: #232f45;
      line-height: 92rpx;
      text-align: center;
      margin-left: 19rpx;

      &.dialog-active {
        border: 2rpx solid #80adeb !important;
        color: #007aff;
      }

      &.new-energy {
        background: #dff4dc;
        border: 2rpx solid #ffffff;
        font-size: 18rpx;
        color: #79c472;
      }
    }

    .dialog-license:nth-of-type(1) {
      margin-left: 0;
    }
  }

  .main-car-list {
    flex: 1 0 0;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 206rpx;
    margin-bottom: 206rpx;
    padding-left: 52rpx;
    padding-right: 46rpx;
    max-height: 498rpx;
    overflow: auto;

    .car-item {
      margin: 0 auto;
      position: relative;
      width: 100%;
      height: 124rpx;
      background: #f9fafc;
      border-radius: 28rpx;
      border: 2rpx solid #ffffff;
      margin-top: 42rpx;

      .car-left {
        width: 6rpx;
        height: 26rpx;
        background: #506bff;
      }

      .car-icon {
        width: 70rpx;
        height: 70rpx;
        background: rgba(80, 107, 255, 0.2);
        border-radius: 30rpx;
        margin-left: 24rpx;

        view {
          width: 38rpx;
          height: 32rpx;
          background: url('../../../static/images/form/car-icon.png') no-repeat;
          background-size: 100%;
        }
      }

      .car-des {
        font-size: 28rpx;
        font-weight: 400;
        color: #232f45;
        margin-left: 30rpx;
        width: 300rpx;
      }

      .car-delete {
        position: absolute;
        right: 24rpx;
        width: 51rpx;
        height: 51rpx;
        background: #f9fafc;
        box-shadow:
          -8rpx -8rpx 16rpx 2rpx rgba(255, 255, 255, 0.7),
          16rpx 16rpx 66rpx 2rpx #dfe0e2;
        border-radius: 20rpx;
        border: 2rpx solid #ffffff;

        view {
          width: 25rpx;
          height: 25rpx;
          background: url('../../../static/images/form/delete.png') no-repeat;
          background-size: 100%;
        }
      }
    }

    .car-item:nth-of-type(1) {
      margin-top: 0;
    }
  }

  .main-submit {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 160rpx;

    .self-submit {
      background: linear-gradient(180deg, #5c75ff 0%, #3c56e3 100%);
      box-shadow:
        -8rpx -8rpx 32rpx 0rpx rgba(255, 255, 255, 0.5),
        16rpx 16rpx 32rpx 0rpx #c5cdf1;
      border-radius: 100rpx;
      opacity: 1;
      border: 2rpx solid #ffffff;
      font-size: 36rpx;
      font-weight: 400;
      width: 650rpx;
      height: 92rpx;
      color: #fff;
    }
  }

  .main-time {
    position: absolute;
    bottom: 56rpx;
    left: 50%;
    transform: translateX(-50%);
    height: 48rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: #506bff;

    .main-time_day {
      font-weight: 800;
    }
  }
}
.flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-space-between_start {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.flex-default {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-algin-center {
  display: flex;
  align-items: center;
}
</style>
