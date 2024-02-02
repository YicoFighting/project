<template>
  <!-- 导航栏 -->
  <div class="navbar">
    <!-- 菜单 -->
    <div class="navbar-content">
      <!-- 左半部分 -->
      <div class="navbar-box">
        <!-- 定位 -->
        <div class="navbar_location">
          <xl-svg-icon class="navbar_icon-location" name="navbar-location" />
          <span class="navbar_location-text">{{ location }}</span>
        </div>

        <!-- 左侧路由 -->
        <div class="navbar_menu">
          <router-link
            v-for="(menu, i) in menuList.slice(1, 5)"
            :key="i"
            :to="menu.link"
            :class="[
              'navbar_menu-item',
              { 'navbar_menu-item_active': route.path.includes(menu.link) },
            ]"
          >
            <xl-svg-icon
              class="navbar_icon"
              :name="`navbar-${menu.icon}${
                route.path.includes(menu.link) ? '_active' : ''
              }`"
            />
            <span>{{ menu.text }}</span>
          </router-link>
        </div>
      </div>

      <!-- 中间 -->
      <router-link :to="menuList[0].link" class="navbar_title">
        {{ menuList[0].text }}
      </router-link>

      <!-- 右侧 -->
      <div class="navbar-box">
        <div class="navbar_menu">
          <router-link
            v-for="(menu, i) in menuList.slice(5, 9)"
            :key="i"
            :to="menu.link"
            :class="[
              'navbar_menu-item',
              { 'navbar_menu-item_active': route.path.includes(menu.link) },
            ]"
          >
            <xl-svg-icon
              class="navbar_icon"
              :name="`navbar-${menu.icon}${
                route.path.includes(menu.link) ? '_active' : ''
              }`"
            />
            <span>{{ menu.text }}</span>
          </router-link>
        </div>

        <!-- 时间 -->
        <div class="navbar_time">
          <span class="navbar_time-text">{{ time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { reactive, toRefs, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { XlSvgIcon } from "@/components";

const route = useRoute();
// 给定数据
const state = reactive({
  location: "吴江区公安局",
  menuList: [
    { text: "多维感知驾驶舱", link: "/" },
    { text: "技战法仓", link: "/technical-warfare", icon: "technical-warfare" },
    { text: "重点区域", link: "/key-areas", icon: "key-area" },
    { text: "数据赋能", link: "/data-empowerment", icon: "data-empowerment" },
    {
      text: "设备监管",
      link: "/equipment-supervision",
      icon: "equipment-supervision",
    },
    { text: "智慧应用", link: "/smart-applications", icon: "smart-apply" },
    { text: "数据监控", link: "/data-monitor", icon: "data-monitor" },
    { text: "数据资产", link: "/data-assets", icon: "data-assets" },
    {
      text: "智慧技防",
      link: "/technical-prevention",
      icon: "technical-prevention",
    },
  ],
  time: dayjs().format("YYYY-MM-DD HH:mm:ss") || "2023-01-01 00:00:00",
  timer: 0,
});

const { location, menuList, time } = toRefs(state);

// 更新时间
function updateTime() {
  state.time = dayjs().format("YYYY-MM-DD HH:mm:ss") || "2023-01-01 00:00:00";
  state.timer = setTimeout(() => {
    updateTime();
  }, 1000);
}

onMounted(() => {
  updateTime();
});

onUnmounted(() => {
  if (state.timmer) clearTimeout(state.timer);
});
</script>
<style lang="scss" scoped>
@keyframes left_to_right {
  0% {
    opacity: 0;
    left: 0;
  }
  10% {
    opacity: 0;
  }
  50% {
    opacity: 1;
    left: 50%;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    left: 100%;
  }
}
@keyframes menu-bg {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
.align-items-center {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.navbar-text {
  font-size: 28px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 2px;
  white-space: nowrap;
}

.navbar_icon {
  width: 73px;
  height: 73px;
  color: transparent;
  &-location {
    width: 43px;
    height: 49px;
  }
}

.navbar {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 128px;
  z-index: 999;
  background-image: linear-gradient(
    to bottom,
    rgba(34, 45, 70, 0.7),
    rgba(34, 45, 70, 0)
  );

  &-content {
    @extend .align-items-center;
    justify-content: space-between;
    height: 128px;
    padding: 0 24px;
    background: url("@images/navbar/navbar-bg.png") no-repeat center / 100% 100%;
  }

  &-box {
    @extend .align-items-center;
    justify-content: space-between;
    width: calc((100% - 880px) / 2);
  }

  .navbar_title {
    position: relative;
    width: 780px;
    height: 128px;
    padding-left: 11px; // 由于letter-spacing过大,加padding居中
    font-size: 67px;
    font-family: "PangMenZhengDao";
    color: #ffffff;
    line-height: 108px;
    letter-spacing: 21px;
    text-shadow: 0px 0px 21px #5c83ff, 0px 5px 8px rgba(11, 44, 123, 0.65),
      0px 2px 2px #021849;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 7px;
      transform: translateX(-50%);
      width: 577px;
      height: 26px;
      background: url("@images/navbar/title-suf.png") no-repeat center / 100%
        100%;
      animation: left_to_right 2s linear 0s infinite alternate;
    }
  }

  .navbar_location,
  .navbar_time {
    @extend .align-items-center;
    &-text {
      @extend .navbar-text;
      font-family: DingTalk-JinBuTi, DingTalk;
      letter-spacing: 1px;
      background: linear-gradient(180deg, #ffffff 0%, #ccdfff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .navbar_time-text {
    width: 320px;
  }

  .navbar_menu {
    @extend .align-items-center;
    justify-content: space-around;
  }
  .navbar_menu-item {
    @extend .align-items-center;
    position: relative;
    margin: 20px 36px 0;
    padding: 0 28px 20px 0;
    height: 47px;
    cursor: pointer;
    span {
      @extend .navbar-text;
    }

    &_active {
      background: url("@images/navbar/menu-bg.png") no-repeat center / 100% 100%;

      span {
        font-weight: 500;
        text-shadow: 0px 0px 26px #6894ff, 0px 0px 8px rgba(62, 120, 255, 0.58),
          0px 3px 3px rgba(0, 0, 0, 0.71);
      }

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -2px;
        width: 175px;
        height: 22px;
        background: url("@images/navbar/menu-suf.png") no-repeat center / 100%
          100%;
        animation: menu-bg 0.8s linear 0.1s infinite alternate;
      }
    }
  }
}

@for $i from 1 through 6 {
  @keyframes breathe-#{$i} {
    0% {
      opacity: 1 - $i * 0.1;
    }
    100% {
      opacity: 0.7 - $i * 0.1;
    }
  }
}

.navbar_animation {
  position: absolute;
  width: 100%;
  top: 12px;
  @extend .align-items-center;
  justify-content: space-between;

  &-box {
    width: 1500px;
    padding: 0 20px;
    @extend .align-items-center;
    justify-content: space-between;

    &:nth-of-type(2) {
      transform: rotateX(180deg);
    }
  }
  &-item {
    @extend .align-items-center;

    i {
      margin-left: 6px;
      width: 6px;
      height: 7px;
      transform: skewX(48deg);
      background-color: #fff;
    }

    @for $i from 1 through 6 {
      i:nth-of-type(#{$i}) {
        animation: breathe- + $i 0.8s linear $i * 0.1s infinite alternate;
      }
    }
  }
}
</style>
