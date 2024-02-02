<template name="skeleton">
  <view class="sk-container">
    <scroll-view scroll-y class="viewport viewport" enable-back-to-top>
      <navigator class="shipment sk-image" hover-class="none">
        <view class="user sk-transparent sk-text-14-2857-866 sk-text">88 18289897475</view>
        <view class="address sk-transparent sk-text-14-2857-697 sk-text"
          >山西省 长治市 襄垣县 5555</view
        >
        <text class="icon icon-right sk-pseudo sk-pseudo-circle"></text>
      </navigator>
      <view class="goods goods">
        <navigator class="item item" hover-class="none">
          <image class="picture sk-image"></image>
          <view class="meta meta">
            <view class="name ellipsis sk-transparent sk-text-14-2857-941 sk-text"
              >法国年份雅文邑700毫升</view
            >
            <view class="attrs sk-transparent sk-text-22-2222-990 sk-text"
              >法国年份雅文邑1975年45.7度700mL</view
            >
            <view class="prices prices">
              <view
                class="pay-price symbol sk-transparent sk-text-14-2857-947 sk-text sk-pseudo sk-pseudo-circle"
                >2118.00</view
              >
              <view
                class="price symbol sk-transparent sk-text-14-2857-484 sk-text sk-pseudo sk-pseudo-circle"
                style="text-decoration-color: transparent"
                >2118.00</view
              >
            </view>
            <view class="count sk-transparent sk-text-14-2857-553 sk-text">x1</view>
          </view>
        </navigator>
      </view>
      <view class="related related">
        <view class="item item">
          <text class="text sk-transparent sk-text-14-2857-772 sk-text">配送时间</text>
          <view
            range='[{"type":1,"text":"时间不限 (周一至周日)"},{"type":2,"text":"工作日送 (周一至周五)"},{"type":3,"text":"周末配送 (周六至周日)"}]'
            range-key="text"
            class="sk-image"
          >
            <view
              class="icon-fonts picker sk-transparent sk-text-14-2857-894 sk-text sk-pseudo sk-pseudo-circle"
              >时间不限 (周一至周日)</view
            >
          </view>
        </view>
        <view class="item item">
          <text class="text sk-transparent sk-text-14-2857-44 sk-text">订单备注</text>
          <view
            class="input sk-image"
            placeholder="选填，建议留言前先与商家沟通确认"
            value="true"
          ></view>
        </view>
      </view>
      <view class="settlement settlement">
        <view class="item item">
          <text class="text sk-transparent sk-text-14-2857-131 sk-text">商品总价: </text>
          <text
            class="number symbol sk-transparent sk-text-14-2857-527 sk-text sk-pseudo sk-pseudo-circle"
            >2118.00</text
          >
        </view>
        <view class="item item">
          <text class="text sk-transparent sk-text-14-2857-21 sk-text">运费: </text>
          <text
            class="number symbol sk-transparent sk-text-14-2857-290 sk-text sk-pseudo sk-pseudo-circle"
            >7.00</text
          >
        </view>
      </view>
    </scroll-view>
    <view class="toolbar toolbar" style="padding-bottom: 0px">
      <view class="total-pay symbol sk-pseudo sk-pseudo-circle">
        <text class="number sk-transparent sk-text-14-2857-389 sk-text">2125.00</text>
      </view>
      <view
        class="button sk-transparent sk-text-31-9444-868 sk-text"
        style="background-position-x: 50%"
      >
        提交订单
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@import '../style/detail.scss';

.sk-transparent {
  color: transparent !important;
}
.sk-text-14-2857-866 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-14-2857-697 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-941 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-22-2222-990 {
  background-image: linear-gradient(
    transparent 22.2222%,
    #eeeeee 0%,
    #eeeeee 77.7778%,
    transparent 0%
  ) !important;
  background-size: 100% 43.2rpx;
  position: relative !important;
}
.sk-text-14-2857-947 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 39.2rpx;
  position: relative !important;
}
.sk-text-14-2857-484 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-14-2857-553 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: absolute !important;
}
.sk-text-14-2857-772 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-894 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-44 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-131 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-527 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-21 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-290 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-389 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 56rpx;
  position: relative !important;
}
.sk-text-31-9444-868 {
  background-image: linear-gradient(
    transparent 31.9444%,
    #eeeeee 0%,
    #eeeeee 68.0556%,
    transparent 0%
  ) !important;
  background-size: 100% 72rpx;
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
