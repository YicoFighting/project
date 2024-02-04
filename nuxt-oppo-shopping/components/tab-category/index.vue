<template>
  <div class="tab-category">
    <div
      class="category-item"
      v-for="item in categorys"
      :key="item.id"
      @click="handleClick(item)"
    >
      <img class="pic-str" :src="item.picStr" :alt="item.title" />
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICategory } from "@/stores/home";
interface IProps {
  categorys: ICategory[];
}
const props = withDefaults(defineProps<IProps>(), {
  categorys: () => [],
});
const emits = defineEmits<{
  (e: "itemClick", item: ICategory): void;
}>();
const handleClick = (item: ICategory) => {
  emits("itemClick", item);
};
</script>

<style lang="scss" scoped>
.tab-category {
  margin-top: 40px; /* color: red; */
  /* @include border(); */
  @include normalFlex();
  align-items: center;
  .category-item {
    height: 100%;
    cursor: pointer;
    .pic-str {
      width: 80px;
      height: 80px;
    }

    .title {
      margin-top: 16px;
      font-size: 16px;
      text-align: center;
      height: 24px;
      max-width: "120px";
    }
  }
}
</style>
