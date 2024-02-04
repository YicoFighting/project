<template>
  <div class="home">
    <div class="wrapper content">
      <swiper :banners="data.data.banners"></swiper>
      <tab-category
        :categorys="data.data.categorys"
        @itemClick="itemClick"
      ></tab-category>
      <template v-for="category in data.data.categorys" :key="category.id">
        <section-title :title="category.title"> </section-title>
        <grid-view
          v-if="category.productDetailss && category.productDetailss.length > 0"
          :category="category.productDetailss"
          :category-url="category.url"
        ></grid-view>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getHomeInfo } from "@/service/home";
const { data } = await getHomeInfo("onePlus");

const itemClick = (item: ICategory) => {
  console.log(item);
};
</script>

<style lang="scss">
.home {
  background-color: $bgGrayColor;
}
</style>
