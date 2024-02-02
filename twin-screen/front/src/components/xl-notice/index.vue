<template></template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSocket } from "@/utils/websocket";
import { useSocketInstance } from "@/stores/socket";
import { ElNotification } from "element-plus";
import "element-plus/theme-chalk/el-notification.css";

const warnNotice = (msg) => {
  const target = document.querySelector(".xl-screen-container");

  ElNotification({
    title: msg.typeName,
    type: "warning",
    duration: 0,
    appendTo: target,
    dangerouslyUseHTMLString: true,
    message: `<div>${msg.alarmName}(${msg.datetime})</div>
        <img src="${msg.img}"></img>
      `,
    customClass: "xl-notice",
  });
};

const store = useSocketInstance();
const { socket, warningList } = storeToRefs(store);

const initWebSocket = () => {
  const options = {
    url: "/websocket",
  };
  socket.value = useSocket(options);

  socket.value.subscribe("open", () => {
    console.log("WebSocket连接成功!");
    // 发送打招呼消息
    // socket.value.sendMessage(greet);
  });
  socket.value.subscribe("close", (reason) => {
    console.log("WebSocket连接关闭!", reason);
  });
  socket.value.subscribe("message", (result) => {
    console.log("WebSocket接收到消息:", result);
    const { type, payload } = result;
    if (type === "warning") {
      warnNotice(payload);
      warningList.value.unshift(payload);
    }
  });
  socket.value.subscribe("error", (err) => {
    console.log("WebSocket捕获错误:", err);
  });
  socket.value.subscribe("reconnect", (_socket) => {
    console.log("WebSocket断开重连:", _socket);
    socket.value = _socket;
  });
};

onMounted(() => {
  initWebSocket();
});
</script>

<style lang="scss" scoped></style>
