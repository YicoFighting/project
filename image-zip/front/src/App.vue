<template>
  <div>
    <a href="http://localhost:3000/images.zip" download="images.zip">
      下载images.zip
    </a>
    <button @click="downloadFile">下载流数据</button>

    <webwork-down></webwork-down>
  </div>
</template>

<script setup>
import WebworkDown from "./WebworkDown.vue";

const downloadFile = async () => {
  try {
    const response = await fetch("http://localhost:3000/stream");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers.get("Content-disposition");
    const fileName = contentDisposition
      ? contentDisposition.split("filename=")[1]
      : "fileName.zip";
    link.setAttribute("download", fileName); // 替换为你想要的文件名
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};
</script>
