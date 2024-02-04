<template>
  <!-- @click="cancelHandler" -->
  <view
    class="dialog-license-container"
    @tap="cancelHandler"
    :class="!isShowTopSelf ? 'wrapper-nomasker' : ''"
  >
    <view class="dialog-license-box" v-if="isShowTopSelf" @tap.stop="preventPierce">
      <view class="hide-icon" @tap="cancelHandler"></view>
      <view>请输入车牌号码</view>
      <view class="dialog-row-license-box">
        <template v-for="(item, index) in brand">
          <text
            v-if="item == '新能源'"
            :key="index"
            class="dialog-license new-energy"
            @tap="onBrandClick"
            :data-index="index"
            >{{ item }}</text
          >
          <text
            v-else
            :key="index + 'other'"
            class="dialog-license"
            :class="{ 'dialog-active': currentIndex === index }"
            @tap="onBrandClick"
            :data-index="index"
            >{{ item }}</text
          >
        </template>
      </view>
    </view>
    <!-- 省份 -->
    <view class="dialog-province-box" v-if="isShowProvinceSelect">
      <view class="dialog-header" @tap.stop="preventPierce">
        <text @tap="submitHandler">完成</text>
      </view>
      <view class="dialog-grid-box" @tap.stop="preventPierce">
        <text
          v-for="(item, index) in province"
          :key="index"
          @tap="provinceClick"
          :data-item="item"
          >{{ item }}</text
        >
        <view class="dialog-close-box" @tap="clearHandler">
          <image
            src="/static/images/icons/add_car_delete.png"
            mode="widthFix"
            style="width: 60rpx; height: 60rpx"
          />
        </view>
      </view>
    </view>

    <!-- 车牌 -->
    <view class="dialog-province-box" v-if="isShowBrandSelect" @tap.stop="preventPierce">
      <view class="dialog-header" @tap.stop="preventPierce">
        <text @tap="submitHandler">完成</text>
      </view>
      <view class="dialog-grid-box">
        <text
          v-for="(item, index) in brand_code"
          :key="index"
          @tap="brandCodeHandler"
          :data-item="item"
          :class="{ 'dialog-gray-text': !item.isShow }"
          >{{ item.code }}</text
        >
        <text @tap="clearHandler" class="dialog-close">删除</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
/* import useProps from '@/common/hooks/useProps.js'
	let props = useProps(); */
const emit = defineEmits(['onCancel', 'onOk', 'breadChange', 'currenIndexChange'])
const props = defineProps({
  isShowTop: {
    type: Boolean,
    default: true,
  },
  currentIndexProp: {
    type: Number,
    default: 2,
  },
})
let isShowTopSelf = computed(() => {
  return props.isShowTop
})
let isEnd = ref(false) //是否可以结束输入
let isNotEnergy = ref(true)
let brand = ref(['苏', 'E', ' ', ' ', ' ', ' ', ' ', '新能源'])
let currentIndex = ref(props.currentIndexProp)
let province = ref([
  '京',
  '津',
  '沪',
  '渝',
  '冀',
  '豫',
  '云',
  '辽',
  '黑',
  '湘',
  '皖',
  '鲁',
  '新',
  '苏',
  '浙',
  '赣',
  '鄂',
  '桂',
  '甘',
  '晋',
  '蒙',
  '陕',
  '吉',
  '闽',
  '贵',
  '粤',
  '青',
  '藏',
  '川',
  '宁',
  '琼',
  '使',
  '无',
])
let brand_code = ref([
  {
    code: '1',
    isShow: true,
  },
  {
    code: '2',
    isShow: true,
  },
  {
    code: '3',
    isShow: true,
  },
  {
    code: '4',
    isShow: true,
  },
  {
    code: '5',
    isShow: true,
  },
  {
    code: '6',
    isShow: true,
  },
  {
    code: '7',
    isShow: true,
  },
  {
    code: '8',
    isShow: true,
  },
  {
    code: '9',
    isShow: true,
  },
  {
    code: '0',
    isShow: true,
  },
  {
    code: 'Q',
    isShow: true,
  },
  {
    code: 'W',
    isShow: true,
  },
  {
    code: 'E',
    isShow: true,
  },
  {
    code: 'R',
    isShow: true,
  },
  {
    code: 'T',
    isShow: true,
  },
  {
    code: 'Y',
    isShow: true,
  },
  {
    code: 'U',
    isShow: true,
  },
  {
    code: 'O',
    isShow: false,
  },
  {
    code: 'P',
    isShow: true,
  },
  {
    code: '港',
    isShow: false,
  },
  {
    code: 'A',
    isShow: true,
  },
  {
    code: 'S',
    isShow: true,
  },
  {
    code: 'D',
    isShow: true,
  },
  {
    code: 'F',
    isShow: true,
  },
  {
    code: 'G',
    isShow: true,
  },
  {
    code: 'H',
    isShow: true,
  },
  {
    code: 'J',
    isShow: true,
  },
  {
    code: 'K',
    isShow: true,
  },
  {
    code: 'L',
    isShow: true,
  },
  {
    code: '澳',
    isShow: false,
  },
  {
    code: 'Z',
    isShow: true,
  },
  {
    code: 'X',
    isShow: true,
  },
  {
    code: 'C',
    isShow: true,
  },
  {
    code: 'V',
    isShow: true,
  },
  {
    code: 'B',
    isShow: true,
  },
  {
    code: 'N',
    isShow: true,
  },
  {
    code: 'M',
    isShow: true,
  },
  {
    code: '学',
    isShow: false,
  },
  {
    code: '领',
    isShow: false,
  },
])
let isShowProvinceSelect = computed(() => {
  return currentIndex.value === 0
})
let isShowBrandSelect = computed(() => {
  return currentIndex.value > 0
})

//方法
const preventPierce = (e) => {
  e.stopPropagation()
}
// 校验车牌
const isVehicleNumber = (vehicleNumber) => {
  let result = false
  const express =
    /^[测京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/
  result = express.test(vehicleNumber)
  return result
}
const onBrandClick = (e) => {
  e.stopPropagation()
  currentIndex.value = e.currentTarget.dataset.index
}
const provinceClick = (e) => {
  e.stopPropagation()
  brand.value[currentIndex.value++] = e.currentTarget.dataset.item

  currentIndex.value =
    currentIndex.value === brand.value.length ? currentIndex.value - 1 : currentIndex.value
  resetKeyboard()
  brandIsEnd()
}
const brandCodeHandler = (e) => {
  e.stopPropagation()

  if (!e.currentTarget.dataset.item.isShow) return
  const item = e.currentTarget.dataset.item
  if (
    (currentIndex.value === 6 && item.code === '澳') ||
    item.code === '港' ||
    item.code === '领' ||
    item.code === '学'
  ) {
    //处理选择了 港澳领学
    /* brand.value[currentIndex.value] = item.code */
    brand.value.splice(currentIndex.value, 1, item.code)
    isNotEnergy.value = false //设置最后一个味是否为灰色
  } else {
    /* brand.value[currentIndex.value++] = item.code */
    brand.value.splice(currentIndex.value++, 1, item.code)
    isNotEnergy.value = true
  }
  //brand = brand
  //brand_code = [...brand_code]
  currentIndex.value =
    currentIndex.value === brand.value.length ? currentIndex.value - 1 : currentIndex.value
  resetKeyboard()
  brandIsEnd()
}
//判断时候结束
const brandIsEnd = () => {
  isEnd.value = !brand.value.includes('')
}
//重新设置键盘
const resetKeyboard = () => {
  if (currentIndex.value === 1) {
    brand_code.value = brand_code.value.map((item) => {
      if (item.code === '澳' || item.code === '港' || item.code === '领' || item.code === '学') {
        return {
          ...item,
          isShow: false,
        }
      } else {
        return {
          ...item,
          isShow: true,
        }
      }
    })
  } else if (currentIndex.value === 6) {
    brand_code.value = brand_code.value.map((item) => {
      if (item.code === 'O') {
        return {
          ...item,
          isShow: false,
        }
      } else {
        return {
          ...item,
          isShow: true,
        }
      }
    })
  } else {
    brand_code.value = brand_code.value.map((item) => {
      if (
        item.code === '澳' ||
        item.code === '港' ||
        item.code === '领' ||
        item.code === '学' ||
        item.code === 'O'
      ) {
        return {
          ...item,
          isShow: false,
        }
      } else {
        return {
          ...item,
        }
      }
    })
  }
  // brand_code.value = brand_code.value
}
const clearHandler = (e) => {
  e.stopPropagation()
  if (currentIndex.value <= 0) return
  brand.value.splice(currentIndex.value--, 1, currentIndex.value === 6 ? '新能源' : ' ')
  resetKeyboard()
  brandIsEnd()
}
const submitHandler = (e) => {
  e.stopPropagation()
  let licensePlate = ''
  if (brand.value[brand.value.length - 1] === '新能源' && brand.value[6] !== ' ') {
    let trueBread = brand.value.slice(0, brand.value.length - 1)
    licensePlate = trueBread.join('')
  } else {
    licensePlate = brand.value.join('')
  }

  const checked = isVehicleNumber(licensePlate)
  if (checked) {
    emit('onOk', licensePlate)
    cancelHandler(e)
  } else {
    uni.showToast({
      title: '请输入正确的车牌号码',
      icon: 'none',
      duration: 1000,
      mask: true,
    })
  }
}
const cancelHandler = (e) => {
  e.stopPropagation()
  isEnd.value = false //是否可以结束输入
  isNotEnergy.value = true
  brand.value = ['苏', 'E', '', '', '', '', '', '新能源']
  currentIndex.value = 2
  emit('onCancel')
}
watch(
  brand,
  (value) => {
    if (!isShowTopSelf.value) {
      emit('breadChange', value)
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
watch(currentIndex, (value) => {
  if (!isShowTopSelf.value) {
    emit('currenIndexChange', value)
  }
})
watch(
  () => props.currentIndexProp,
  (value) => {
    if (!isShowTopSelf.value) {
      currentIndex.value = value
    }
  },
)
</script>

<style lang="scss">
.dialog-license-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999 !important;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;

  .dialog-license-box {
    width: 100%;
    background: #ffffff;
    border-radius: 40rpx 40rpx 0rpx 0rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    bottom: 460rpx;
    padding: 48rpx 0;

    .hide-icon {
      width: 63rpx;
      height: 63rpx;

      background: url('../../static/images/icons/x-icon.png') no-repeat;
      background-size: 100%;
      position: absolute;
      right: 52rpx;
    }

    .dialog-title {
      height: 48rpx;
      line-height: 48rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #232f45;
    }

    .dialog-sub-title {
      margin-top: 11rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #979899;
      line-height: 33rpx;
    }

    .dialog-row-license-box {
      margin-top: 65rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

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
          border: 2rpx solid #80adeb;
          color: #007aff;
        }

        &.new-energy {
          background: rgba(18, 191, 145, 0.04);
          border: 2rpx solid rgba(23, 186, 142, 0.46);
          font-size: 18rpx;
          color: #12bf91;
          border: 2rpx solid #80adeb;
        }
      }

      .dialog-license:nth-of-type(1) {
        margin-left: 0;
      }
    }

    .dialog-add-license {
      margin-top: 65rpx;
      width: 400rpx;
      height: 78rpx;
      line-height: 78rpx;
    }
  }

  .dialog-province-box {
    width: 100%;
    height: 460rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1rpx solid #e7e8ea;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 30rpx;
    background: #e7e8ea;

    .dialog-header {
      width: 100%;
      height: 60rpx;
      box-sizing: border-box;
      padding: 0 30rpx;
      display: flex;
      justify-content: space-between;
      line-height: 60rpx;
      font-size: 32rpx;
      color: #0f5bff;
      justify-content: flex-end;
    }

    .dialog-grid-box {
      flex: 1;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      padding-right: 1%;
      align-items: center;

      > text {
        width: 9%;
        margin-left: 1%;
        background: white;
        text-align: center;
        height: 70rpx;
        line-height: 70rpx;
        border-radius: 8rpx;
      }

      .dialog-gray-text {
        color: #e7e8ea;
      }

      .dialog-close-box {
        position: absolute;
        bottom: 38rpx;
        right: 10rpx;
        width: 80rpx;
        height: 70rpx;
        background: #cfd0d4;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dialog-close {
        background: #cfd0d4;
        font-size: 24rpx;
      }
    }
  }
}

.wrapper-nomasker {
  background-color: transparent;
}
</style>
