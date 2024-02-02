<template>
  <div
    class="modal-prevention"
    :style="{ width: props.width + 'px', height: props.height + 'px' }"
  >
    <div class="header">
      <img src="@/assets/icons/svg/components/icon_header.svg" alt="" />
      <span class="title-c">{{ props.titleC }}</span>
      <!-- 流光效果 -->
      <div class="light"></div>
    </div>
    <div
      class="main"
      :style="{ width: props.width + 'px', height: props.height - 56 + 'px' }"
    >
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: {
    type: Number,
    default: 493,
  },
  height: {
    type: Number,
    default: 249,
  },
  titleC: {
    type: String,
    default: "",
  },
  titleE: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
@keyframes light {
  0% {
    transform: translateX(-100%);
    opacity: 1;
  }
  100% {
    transform: translateX(250%);
    opacity: 0.2;
  }
}
.modal-prevention {
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(0, 9, 37, 0.55) 0%,
    rgba(6, 13, 42, 0.93) 21%,
    rgba(34, 45, 70, 0.71) 100%
  );
  border: 1px solid;
  border-image: linear-gradient(
      180deg,
      rgba(179, 211, 255, 0),
      rgba(86, 148, 255, 1)
    )
    11;
  .header {
    width: 100%;
    height: 56px;
    position: relative;
    overflow-x: hidden;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-size: 100% 100%;
    color: #86c4ff;
    line-height: 21px;
    text-shadow: 0px 0px 21px #40c3f9, 0px 5px 8px rgba(11, 90, 123, 0.65),
      0px 2px 2px #023449;
    background-image: url("@images/components/bg_header_mjlltj.png");
    .light {
      width: 360px;
      // border: 2px solid;
      border: 1.8px solid;
      border-image: linear-gradient(
          270deg,
          rgba(53, 125, 203, 0.1),
          #ffffff,
          rgba(53, 125, 203, 0.1)
        )
        1 1;
      position: absolute;
      bottom: 2px;
      animation: light 3s linear 0s infinite;
    }
    font: {
      size: 16px;
      family: OPPOSans-M, OPPOSans;
      weight: normal;
    }
    > img {
      width: 29px;
      height: 27px;
    }
    > .title-c {
      margin-left: 9px;
      color: #ffffff;
      line-height: 27px;
      letter-spacing: 2px;
      text-shadow: 0px 2px 1px rgba(2, 33, 73, 0.43);
      // white-space: nowrap;
      font: {
        size: 24px;
        family: PangMenZhengDao;
      }
    }
    .title-e {
      // white-space: nowrap;
    }
    > .icon {
      margin: 0 5px;
    }
  }
}
.modal-prevention::after {
  content: "";
  border: 3px solid #5797ff;
  border-right: none;
  border-top: none;
  width: 16px;
  height: 16px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
}
.modal-prevention::before {
  content: "";
  border: 3px solid #5797ff;
  border-left: none;
  border-top: none;
  width: 16px;
  height: 16px;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
