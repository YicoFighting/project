<template name="skeleton">
  <view class="sk-container">
    <view class="viewport viewport">
      <view is="components/nav-bar/index">
        <view class="navbar bar-index--navbar" style="padding-top: 20px">
          <view class="logo bar-index--logo">
            <image class="logo-image bar-index--logo-image sk-image"></image>
            <text class="logo-text bar-index--logo-text sk-transparent sk-text-0-0000-881 sk-text"
              >新鲜 · 亲民 · 快捷</text
            >
          </view>
          <view class="search bar-index--search">
            <text
              class="icon-search bar-index--icon-search sk-transparent sk-text-14-2857-524 sk-text sk-pseudo sk-pseudo-circle"
              >搜索商品</text
            >
            <text class="icon-scan bar-index--icon-scan sk-pseudo sk-pseudo-circle"></text>
          </view>
        </view>
      </view>
      <scroll-view enable-back-to-top refresher-enabled scroll-y class="scroll-view scroll-view">
        <view is="components/xtx-swiper/index">
          <view class="carousel swiper-index--carousel">
            <swiper circular :interval="3000" :current="0" :autoplay="false">
              <swiper-item
                style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  transform: translate(0%, 0px) translateZ(0px);
                "
              >
                <navigator class="navigator swiper-index--navigator" hover-class="none">
                  <image class="image swiper-index--image sk-image" mode="aspectFill"></image>
                </navigator>
              </swiper-item>
            </swiper>
            <view class="indicator swiper-index--indicator">
              <text class="dot swiper-index--dot active swiper-index--active"></text>
              <text class="dot swiper-index--dot"></text>
              <text class="dot swiper-index--dot"></text>
              <text class="dot swiper-index--dot"></text>
              <text class="dot swiper-index--dot"></text>
            </view>
          </view>
        </view>
        <view is="pages/home/components/category-panel/index">
          <view class="category panel-index--category">
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-259 sk-text"
                >居家</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-130 sk-text"
                >锦鲤</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-241 sk-text"
                >服饰</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-894 sk-text"
                >母婴</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-337 sk-text"
                >个护</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-976 sk-text"
                >严选</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-240 sk-text"
                >数码</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-859 sk-text"
                >运动</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-260 sk-text"
                >杂项</text
              >
            </navigator>
            <navigator class="category-item panel-index--category-item" hover-class="none">
              <image class="icon panel-index--icon sk-image"></image>
              <text class="text panel-index--text sk-transparent sk-text-14-2857-542 sk-text"
                >品牌</text
              >
            </navigator>
          </view>
        </view>
        <view is="pages/home/components/hot-panel/index">
          <view class="panel index--panel hot index--hot">
            <view class="item index--item">
              <view class="title index--title">
                <text
                  class="title-text index--title-text sk-transparent sk-text-14-2857-183 sk-text"
                  >特惠推荐</text
                >
                <text
                  class="title-desc index--title-desc sk-transparent sk-text-14-2857-808 sk-text"
                  >精选全攻略</text
                >
              </view>
              <navigator class="cards index--cards" hover-class="none">
                <image class="image index--image sk-image" mode="aspectFit"></image>
                <image class="image index--image sk-image" mode="aspectFit"></image>
              </navigator>
            </view>
            <view class="item index--item">
              <view class="title index--title">
                <text
                  class="title-text index--title-text sk-transparent sk-text-14-2857-177 sk-text"
                  >爆款推荐</text
                >
                <text
                  class="title-desc index--title-desc sk-transparent sk-text-14-2857-365 sk-text"
                  >最受欢迎</text
                >
              </view>
              <navigator class="cards index--cards" hover-class="none">
                <image class="image index--image sk-image" mode="aspectFit"></image>
                <image class="image index--image sk-image" mode="aspectFit"></image>
              </navigator>
            </view>
            <view class="item index--item">
              <view class="title index--title">
                <text
                  class="title-text index--title-text sk-transparent sk-text-14-2857-562 sk-text"
                  >一站买全</text
                >
                <text
                  class="title-desc index--title-desc sk-transparent sk-text-14-2857-183 sk-text"
                  >精心优选</text
                >
              </view>
              <navigator class="cards index--cards" hover-class="none">
                <image class="image index--image sk-image" mode="aspectFit"></image>
                <image class="image index--image sk-image" mode="aspectFit"></image>
              </navigator>
            </view>
            <view class="item index--item">
              <view class="title index--title">
                <text
                  class="title-text index--title-text sk-transparent sk-text-14-2857-516 sk-text"
                  >新鲜好物</text
                >
                <text class="title-desc index--title-desc sk-transparent sk-text-14-2857-67 sk-text"
                  >生活加分项</text
                >
              </view>
              <navigator class="cards index--cards" hover-class="none">
                <image class="image index--image sk-image" mode="aspectFit"></image>
                <image class="image index--image sk-image" mode="aspectFit"></image>
              </navigator>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss">
@import '@/styles/base.scss';
@import '../../styles/category.scss';
@import '../../styles/hot.scss';
@import '@/components/styles/XtxSwiper.scss';

.sk-transparent {
  color: transparent !important;
}
.sk-text-0-0000-881 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 25.7813rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-14-2857-524 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-259 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-130 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-241 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-894 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-337 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-976 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-240 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-859 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-260 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-542 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.0938rpx;
  position: relative !important;
}
.sk-text-14-2857-183 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42.6563rpx;
  position: relative !important;
}
.sk-text-14-2857-808 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 32.8125rpx;
  position: relative !important;
}
.sk-text-14-2857-177 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42.6563rpx;
  position: relative !important;
}
.sk-text-14-2857-365 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 32.8125rpx;
  position: relative !important;
}
.sk-text-14-2857-562 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42.6563rpx;
  position: relative !important;
}
.sk-text-14-2857-516 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42.6563rpx;
  position: relative !important;
}
.sk-text-14-2857-67 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 32.8125rpx;
  position: relative !important;
}
.sk-image {
  background: #efefef !important;
}
.sk-pseudo::before,
.sk-pseudo::after {
  background: #efefef !important;
  background-image: none !important;
  color: transparent !important;
  border-color: transparent !important;
}
.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
  border-radius: 0 !important;
}
.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
  border-radius: 50% !important;
}
.sk-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
</style>
