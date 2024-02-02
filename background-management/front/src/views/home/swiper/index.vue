<script setup>
import { onMounted, ref } from "vue";
import { getHomeImages } from "@/services/home";

const carousel = ref();

const getImageCard = async () => {
  try {
    const { data } = await getHomeImages();
    carousel.value = data;
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  getImageCard();
});
</script>

<template>
  <div class="index">
    <el-carousel indicator-position="outside" trigger="click">
      <el-carousel-item v-for="item in carousel" :key="item?.src">
        <el-image :src="item?.src" fit="cover" />
        <div class="text">
          <span>
            <span>{{ item["text"] }}</span>
          </span>
          <span class="text-time">{{ item["time"] }}</span>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style lang="scss" scoped>
.index {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  :deep(.el-carousel) {
    width: 600px;
    .el-carousel__container {
      height: 450px;
      .el-image {
        border-radius: 5px;
      }
    }
  }
}
.text {
  height: 50px;
  display: flex;
  justify-content: space-between;
  &-time {
    white-space: nowrap;
  }
}
</style>
