<script setup>
import { getHomeImages } from "@/services/home";
import { onMounted, ref } from "vue";
import { XlTooltip, XlCount } from "@/components";

const carousel = ref();

const wordDOM = ref(null);

const exportWordFn = () => {
  console.log(wordDOM.value.innerHTML);
};

const getImageCard = async () => {
  try {
    const { data } = await getHomeImages();
    carousel.value = data;
  } catch (error) {
    console.log(error);
  }
};
const longpress = () => {
  console.log("触发长按");
};

const debounceClick = () => {
  console.log("触发防抖");
};

// const toolText = ref(
//   "这里有一段很长很长的话,这里有一段很长很长的话这里有一段很长很长的话这里有一段很长很长的话"
// );

const toolText = ref("这段话变短了");

const changeText = () => {
  // toolText.value = "这段话变短了";
  toolText.value =
    "这里有一段很长很长的话,这里有一段很长很长的话这里有一段很长很长的话这里有一段很长很长的话";
};

onMounted(() => {
  getImageCard();
});
</script>

<template>
  <div class="instruction" ref="wordDOM">
    <div class="copy-text" v-copy="'这是一段文字，它可以被复制'">
      这是一段文字，它可以被复制
    </div>

    <el-button type="primary" v-longpress="longpress">长按</el-button>

    <el-button v-debounce="debounceClick">防抖</el-button>

    <el-button type="primary" @click="exportWordFn">导出word</el-button>

    <el-button @click="changeText">改变这段话</el-button>

    <xl-count :end="123456789" auto-play :duration="3000"></xl-count>

    <div class="tooltip" v-showTooltip="toolText">{{ toolText }}</div>

    <xl-tooltip :content="toolText" width="300"></xl-tooltip>

    <div class="dialog" v-draggable>这是一个可以随意拖动的盒子</div>

    <div class="water" v-waterMarker="{ text: `这是水印${new Date()}` }"></div>

    <div class="image-list">
      <div class="image-list-item" v-for="item in carousel" :key="item.src">
        <img v-lazyLoad="item.src" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tooltip {
  width: 300px;
}
.instruction {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.copy-text {
  margin-bottom: 20px;
}
.image-list {
  display: flex;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;

  &-item {
    flex-shrink: 0;
    height: 25%;
    overflow: hidden;
    img {
      height: 100%;
    }
  }
}
.dialog {
  position: absolute;
  width: 100px;
  height: 100px;
  padding: 10px;
  background-color: skyblue;
}
.water {
  height: 300px;
}
</style>
