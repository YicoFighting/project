<script setup>
import { onMounted, ref } from "vue";
import Layout from "@/views/layout/index.vue";
import axios from "@/service";

const carousel = ref();

onMounted(async () => {
  carousel.value = await axios.get("/carousel", { params: { origin: true } });
});
</script>

<template>
  <layout :Level1="true">
    <a-carousel arrows autoplay>
      <template #prevArrow>
        <div class="custom-slick-arrow left-arrow" style="top: 185px">&lt;</div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow right-arrow" style="top: 185px">
          &gt;
        </div>
      </template>
      <div v-for="car in carousel" :key="car['time']">
        <a-image :src="car['src']" />
        <div class="text">
          <span>
            <span v-indent>{{ car["text"] }}</span>
          </span>
        </div>
      </div>
    </a-carousel>
  </layout>
</template>

<style lang="less" scoped>
.text {
  height: 50px;
  display: flex;
  justify-content: space-between;
  &-time {
    white-space: nowrap;
  }
}
:deep(.ant-carousel) {
  width: 600px;

  overflow: hidden;
  margin: 20px auto;
  .slick-slide {
    width: 600px !important;
    overflow: hidden;
    .ant-image {
      width: 600px;
      height: 400px;
      border-radius: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .left-arrow {
    position: absolute;
    left: 20px;
  }
  .right-arrow {
    position: absolute;
    right: 20px;
  }
  .custom-slick-arrow {
    width: 30px;
    height: 30px;
    line-height: 25px;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 50%;

    color: #fff;
    background-color: rgba(31, 45, 61, 0.4);
    opacity: 0.3;
    z-index: 1;
    &:before {
      display: none;
    }
    &:hover {
      opacity: 1;
    }
  }
  .slick-dots-bottom {
    bottom: unset;
    top: 380px;
  }
}
</style>
