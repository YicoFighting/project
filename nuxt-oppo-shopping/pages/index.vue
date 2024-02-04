<template>
  <div class="home">
    <div class="wrapper content">
      <swiper :banners="banners"></swiper>
      <tab-category
        :categorys="categorys"
        @itemClick="itemClick"
      ></tab-category>
      <template v-for="category in categorys" :key="category.id">
        <section-title :title="category.title"> </section-title>
        <grid-view
          :category="category.productDetailss"
          :category-url="category.url"
        ></grid-view>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useHomeStore, type ICategory } from "@/stores/home";

const store = useHomeStore();
const { banners, categorys } = storeToRefs(store);

const itemClick = (item: ICategory) => {
  console.log(item);
  return navigateTo({
    path: "/oppo-detail",
    query: {
      type: item.type,
    },
  });
};
</script>

<style lang="scss">
.home {
  background-color: $bgGrayColor;
}
</style>
