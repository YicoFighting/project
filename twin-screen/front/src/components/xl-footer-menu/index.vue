<template>
  <div class="foot-menu">
    <div class="foot-menu-center">
      <div class="map-button">
        <div
          v-for="(menu, index) in menus"
          :key="menu.title"
          class="map-button-item"
          @click="changeType(index + 1)"
        >
          <img :src="index + 1 == activeMenu ? menu.actImg : menu.img" />
          <span :class="[activeMenu === index + 1 ? 'span-active ' : '']">
            {{ menu.title }}
          </span>
        </div>
      </div>
    </div>
    <div class="light"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import firstLevel from "@images/footer-menu/mbt-1.png";
import firstLevelAt from "@images/footer-menu/mbt-1-at.png";
import secondLevel from "@images/footer-menu/mbt-2.png";
import secondLevelAt from "@images/footer-menu/mbt-2-at.png";
import gis from "@images/footer-menu/mbt-3.png";
import gisAt from "@images/footer-menu/mbt-3-at.png";

const emits = defineEmits(["footer"]);

const menus = [
  {
    title: "一级",
    img: firstLevel,
    actImg: firstLevelAt,
  },
  {
    title: "二级",
    img: secondLevel,
    actImg: secondLevelAt,
  },
  {
    title: "gis",
    img: gis,
    actImg: gisAt,
  },
];

const activeMenu = ref(2);

const changeType = (type) => {
  activeMenu.value = type;
  emits("footer", type);
};
</script>

<style lang="scss" scoped>
.foot-menu {
  position: absolute;

  bottom: 0px;
  width: 100%;
  @include center(flex-end, center);
  background: url("@images/footer-menu/foot-menu-bg.png") no-repeat center 33px /
    101% 100%;
  height: 14%;
  font-size: 26px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 1px;
  z-index: 1;
  &-center {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 5px;
    @include center;

    .left-button,
    .right-button {
      font-size: 24px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #ffffff;
      text-shadow: 0px 0px 7px #5797ff, 0px 1px 2px rgba(0, 0, 0, 0.48);
      cursor: pointer;
      padding: 14px 30px;
      background: url("@images/footer-menu/fm-button-bg.png") no-repeat center /
        100% 100%;
    }
    .button-active {
      padding: 10px 30px 18px;
      position: relative;
      top: 6px;
      background: url("@images/footer-menu/fm-button-bg-at.png") no-repeat
        center / 100% 100%;
    }
    .map-button {
      width: 40%;
      padding-bottom: 5px;
      @include center;
      &-item:nth-child(2) {
        margin: 0 50px;
      }
      &-item {
        @include center;
        cursor: pointer;
        img {
          width: 81px;
          height: 90px;
        }
        span {
          @include fontGradient(
            rgba(255, 255, 255, 1),
            linear-gradient(180deg, #3b8ff5 0%, #ffffff 45%, #3b90f6 100%),
            26px,
            SourceHanSansCN-Regular SourceHanSansCN,
            400
          );
        }
        .span-active {
          @include fontGradient(
            rgba(255, 255, 255, 1),
            linear-gradient(180deg, #ffffff 0%, #d2ff77 100%),
            26px,
            SourceHanSansCN-Regular SourceHanSansCN,
            400
          );
        }
      }
    }
  }
}
</style>
