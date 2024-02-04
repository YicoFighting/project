<template>
  <view>
    <tab-bar current="1">
      <view class="build">
        <nav-bar title="大厦导览"></nav-bar>
        <view class="building-des flex-space-between">
          <view
            v-for="item in buildList"
            :key="item.des"
            class="flex-direction-align building-des_item"
          >
            <image :src="item.icon"></image>
            <view class="building-des_name">
              {{ item.des }}
            </view>
          </view>
        </view>
        <view class="building-main">
          <image :src="planeImage" class="building-main_plane"> </image>
          <view class="flex-space-between building-main_floor">
            <view
              v-for="(item, index) in floorList"
              class="main_item flex-center"
              @click="floorClick(index)"
              :class="index === floorIndex ? 'main_item_active' : ''"
              :key="item.name"
            >
              {{ item.des }}
              <view class="main_item_des" v-show="index === floorIndex">
                {{ item.name }}
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

const buildList = ref([
  {
    icon: '/static/images/building/lift.png',
    des: '电梯',
  },
  {
    icon: '/static/images/building/bathroom.png',
    des: '卫生间',
  },
  {
    icon: '/static/images/building/parking.png',
    des: '停车场',
  },
  {
    icon: '/static/images/building/meeting.png',
    des: '会议室',
  },
])
const floorList = ref([
  {
    des: 'L1',
    name: '大厅',
  },
  {
    des: 'L2',
    name: '展厅',
  },
  {
    des: 'L3',
    name: '无人机、视频制作部',
  },
  {
    des: 'L4',
    name: '技术部',
  },
])
const imageUrl = 'https://digital.jiketravel.com/static/'
const floorIndex = ref(0)
const planeImage = ref(`${imageUrl}大厦导航-1.png`)
const floorClick = (index: number) => {
  floorIndex.value = index
  planeImage.value = `${imageUrl}大厦导航-${index + 1}.png`
}

onShow(() => {
  uni.hideTabBar({
    animation: false,
  })
})
</script>

<style lang="scss" scoped>
/* #ifdef APP-PLUS || H5 */
.build {
  width: 100%;
  height: 100%;
  padding: 0 50rpx;
  background: #f2f3f5;
  display: flex;
  flex-direction: column;

  .building-main_plane_down7 {
    height: 500rpx !important;
  }

  .building-des {
    margin-top: 52rpx;
    width: 100%;
    height: 180rpx;
    background: #f9fafc;
    /* box-shadow:
      -16rpx -16rpx 66rpx 2rpx #ffffff,
      16rpx 16rpx 66rpx 2rpx #dfe0e2; */
    border-radius: 28rpx;
    opacity: 1;
    border: 2rpx solid #ffffff;
    padding: 0 46rpx 0 48rpx;

    .building-des_item {
      image {
        width: 28rpx;
        height: 32rpx;
      }

      &:nth-of-type(4) {
        image {
          width: 32rpx;
          height: 29rpx;
        }
      }

      .building-des_name {
        font-size: 28rpx;
        font-weight: 400;
        color: #232f45;
        margin-top: 16rpx;
      }
    }
  }

  .building-main {
    flex: 1 0 0;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 52rpx;

    .building-main_plane {
      width: 100%;
      height: 697rpx;
    }

    .building-main_floor {
      width: 100%;
      height: 108rpx;
      background: #f9fafc;
      /* box-shadow:
        -16rpx -16rpx 66rpx 2rpx #ffffff,
        16rpx 16rpx 66rpx 2rpx #dfe0e2; */
      border-radius: 100rpx;
      opacity: 1;
      border: 2rpx solid #ffffff;
      margin-top: 42rpx;

      .main_item {
        position: relative;
        width: 108rpx;
        height: 108rpx;
        border-radius: 160rpx;
        opacity: 1;
        font-size: 32rpx;
        font-weight: 400;
        color: #232f45;

        .main_item_des {
          position: absolute;
          bottom: -58rpx;
          width: max-content;
          height: 40rpx;
          font-size: 28rpx;
          font-weight: bold;
          color: #232f45;
        }
      }

      .main_item_active {
        background: linear-gradient(180deg, #5c75ff 0%, #3c56e3 100%);
        /* box-shadow:
          0rpx 4rpx 16rpx 2rpx rgba(70, 96, 236, 0.63),
          inset 0rpx 6rpx 12rpx 2rpx #3955ef; */
        border: 2rpx solid #ffffff;
        color: #ffffff;
        font-size: 36rpx;
      }
    }
  }
}

/* #endif */
/* #ifdef  MP */
.building-wrapper {
  padding: 0 50rpx;

  .building-des {
    margin-top: 52rpx;
    width: 100%;
    height: 180rpx;
    background: #f9fafc;
    box-shadow:
      -16rpx -16rpx 66rpx 2rpx #ffffff,
      16rpx 16rpx 66rpx 2rpx #dfe0e2;
    border-radius: 28rpx;
    opacity: 1;
    border: 2rpx solid #ffffff;
    padding: 0 46rpx 0 48rpx;

    .building-des_item {
      image {
        width: 28rpx;
        height: 32rpx;
      }

      &:nth-of-type(4) {
        image {
          width: 32rpx;
          height: 29rpx;
        }
      }

      .building-des_name {
        font-size: 28rpx;
        font-weight: 400;
        color: #232f45;
        margin-top: 16rpx;
      }
    }
  }

  .building-main {
    margin-top: 52rpx;

    .building-main_plane {
      width: 100%;
      height: 697rpx;
    }

    .building-main_floor {
      width: 100%;
      height: 108rpx;
      background: #f9fafc;
      box-shadow:
        -16rpx -16rpx 66rpx 2rpx #ffffff,
        16rpx 16rpx 66rpx 2rpx #dfe0e2;
      border-radius: 100rpx;
      opacity: 1;
      border: 2rpx solid #ffffff;
      margin-top: 42rpx;

      .main_item {
        position: relative;
        width: 108rpx;
        height: 108rpx;
        border-radius: 160rpx;
        opacity: 1;
        font-size: 32rpx;
        font-weight: 400;
        color: #232f45;

        .main_item_des {
          position: absolute;
          bottom: -58rpx;
          width: max-content;
          height: 40rpx;
          font-size: 28rpx;
          font-weight: bold;
          color: #232f45;
        }
      }

      .main_item_active {
        background: linear-gradient(180deg, #5c75ff 0%, #3c56e3 100%);
        box-shadow:
          0rpx 4rpx 16rpx 2rpx rgba(70, 96, 236, 0.63),
          inset 0rpx 6rpx 12rpx 2rpx #3955ef;
        border: 2rpx solid #ffffff;
        color: #ffffff;
        font-size: 36rpx;
      }
    }
  }
}

/* #endif */

.flex-space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
