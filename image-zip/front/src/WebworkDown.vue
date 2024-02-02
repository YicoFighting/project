<script setup>
import { onMounted } from "vue";

// 图片url
const url =
  "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/gp/wallhaven-gp9god.jpg?w=2560&h=1440&fmt=jpeg";

// 创建一个新的 Web Worker
const worker = new Worker("imageWorker.js");

onMounted(() => {
  const images = new Array(100).fill(url);
  // 向 Web Worker 发送要处理的 URL 列表
  worker.postMessage(images); // 发送需要处理的 URL 列表

  worker.onmessage = function (event) {
    const { type, payload } = event.data;

    if (type === "zipReady") {
      const blob = new Blob([payload], { type: "application/zip" });
      const url = URL.createObjectURL(blob);

      // 创建一个<a>标签来触发下载
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "images.zip";
      downloadLink.click();

      // 释放对象URL
      URL.revokeObjectURL(url);
    } else if (type === "error") {
      console.error(payload);
    }
  };
  const animation = document.querySelector(".animation");
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;

  setInterval(() => {
    const randomX = Math.random();
    const randomY = Math.random();
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    animation.style.transform = `translate(${clientWidth * randomX}px,${
      clientHeight * randomY
    }px)`;
    animation.style.background = color;
  }, 100);
});
</script>

<template>
  <div class="app">
    <div class="animation"></div>
  </div>
</template>

<style scoped></style>
