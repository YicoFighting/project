<template>
  <xl-modal-prevention
    :width="522"
    :height="305"
    title-c="推送预警"
    title-e="Push alert"
  >
    <template #main>
      <div class="main-box">
        <el-button type="primary" @click="pushWarn">推送测试预警</el-button>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { XlModalPrevention } from "@/components";
import { storeToRefs } from "pinia";
import { useSocketInstance } from "@/stores/socket";

const store = useSocketInstance();
const { socket } = storeToRefs(store);

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${dd}-${mm} ${hh}:${min}:${ss}`;
};

const pushWarn = () => {
  const context = {
    id: new Date().getTime(),
    statusName: "待处置",
    typeName: "到离校预警",
    datetime: formatDate(new Date()),
    alarmName: "异常晚离校",
    img: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/zy/wallhaven-zydwwj.jpg?w=2560&h=1440&fmt=webp",
  };
  socket.value.sendMessage({
    type: "broadcast",
    payload: context,
  });
};
</script>

<style lang="scss" scoped>
.main-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
