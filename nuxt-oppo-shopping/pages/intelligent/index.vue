<template>
  <div class="home">
    <div class="wrapper content">
      <swiper :banners="data.data.banners"></swiper>
      <tab-category
        :categorys="data.data.categorys"
        @itemClick="itemClick"
      ></tab-category>
      <template v-for="category in data.data.categorys" :key="category.id">
        <template
          v-if="category.productDetailss && category.productDetailss.length > 0"
        >
          <section-title :title="category.title"> </section-title>
          <grid-view
            :category="category.productDetailss"
            :category-url="category.url"
          ></grid-view>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getHomeInfo } from "@/service/home";
const { data } = await getHomeInfo("intelligent");

const itemClick = (item: ICategory) => {
  console.log(item);
};
</script>

<style lang="scss">
.home {
  background-color: $bgGrayColor;
}
</style>
