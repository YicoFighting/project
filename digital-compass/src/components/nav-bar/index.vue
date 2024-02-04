<template>
  <view class="title" :style="{ paddingTop: safeAreaInsets?.top + 'px', color: props.color }">{{
    title
  }}</view>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  color?: string
}
const props = withDefaults(defineProps<Props>(), {
  color: '#000',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<style lang="scss">
.title {
  text-align: center;
  color: #fff;
  font-size: 40rpx;
  height: 80rpx;
  line-height: 80rpx;
}
</style>
