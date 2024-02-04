<script setup>
import { nextTick, ref } from "vue";
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css";
import ChatLogin from "./components/chat-login.vue";
import ChatIndividual from "./components/chat-individual.vue";
import WxCard from "./components/wx-card.vue";
import WxFace from "./components/wx-face.vue";
import WebSocket from "@/utils/WebSocket";
import bus from "@/utils/bus";
import base64ToUrl from "./utils";
import Layout from "@/views/layout/index.vue";

//存放记录
const data = ref({});
//显示哪个页面
const show = ref(0);
//自己的id
const myId = ref(0);
//对方id
const yourId = ref(0);
//记录发起方id
const startId = ref(0);
//本地流
const local = ref();
//远程流
const remote = ref();
// 对等连接(在两个对等端之间建立连接,其构造函数支持传一个配置对象,包含ICE"打洞")
const PeerConnection =
  window.RTCPeerConnection ||
  window.mozRTCPeerConnection ||
  window.webkitRTCPeerConnection;
//检测兼容性
!PeerConnection && message.error("浏览器不支持WebRTC！");
//对等连接实例
let peer = new PeerConnection();

// 将传入的轨迹连接到将用于显示传入<video>元素
peer.ontrack = (e) => {
  if (e && e.streams) {
    //收到对方音频/视频流数据
    remote.value = e.streams[0];
  }
};

//当获得新的源之后，需要将该源的信息发送给远端信号服务器，并分发至其它端的 RTCPeerConnection
peer.onicecandidate = (e) => {
  if (e.candidate) {
    //搜集并发送候选人
    WebSocket.webSocketSend({
      type: "ice",
      id: yourId.value,
      iceCandidate: e.candidate,
    });
    /* 在此次协商中，没有更多的候选了 */
  } else {
    console.log("候选人收集完成！");
  }
};

//登录
const login = (values) => {
  //联系人页面
  show.value = 1;
  //解构出用户名
  const { username } = values;
  //记录本地用户名(id)
  myId.value = username;
  //开启websocket
  const socket_url = `ws://localhost:8080/chat?id=${username}`;
  WebSocket.initWebSocket(socket_url);
};

//点击联系人
const chatWith = (id) => {
  console.log("点击联系人:", id);
  //记录对方id
  yourId.value = id;
  //检查是否在线
  WebSocket.webSocketSend({ type: "online", id });
};

//监听websocket的事件
bus.on("message", async (res) => {
  const { type } = res;
  if (type === "online") {
    res["status"] === 1 ? message.success("在线") : message.error("离线");
    show.value = 2;
  }
  if (type === "chat") {
    const { sendId, text, time, textType } = res;
    //data中的key是否有对方id
    data.value[sendId] = data.value[sendId] ?? [];
    // 将base64的图片转化为可展示的url
    data.value[sendId].push({
      user: 0,
      text: textType === "image" ? base64ToUrl(text) : text,
      time,
      textType,
    });
  }
  if (type === "face") {
    show.value = 3;
    const { offer, sendId, id } = res;
    const { type, sdp } = offer;
    const offerSdp = new RTCSessionDescription({ type, sdp });

    try {
      //创建本地流
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      //将媒体轨道添加到轨道集
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      //记录本地视频流
      local.value = stream;
    } catch (error) {
      if (error.message === "Permission denied") {
        message.error("请开启相关权限后重试!");
      } else {
        message.error("请联系平台!");
      }
    }

    await peer.setRemoteDescription(offerSdp);
    //创建接收方（应答）SDP
    const answer = await peer.createAnswer();
    //传输接收方（应答）SDP
    WebSocket.webSocketSend({
      type: "answer-sdp",
      sendId: id,
      id: sendId,
      answer,
    });
    yourId.value = sendId;
    await peer.setLocalDescription(answer);
  }
  if (type === "answer-sdp") {
    const { answer } = res;
    const { type, sdp } = answer;
    peer.setRemoteDescription(new RTCSessionDescription({ type, sdp }));
  }
  if (type === "ice") {
    const { iceCandidate } = res;

    try {
      await peer.addIceCandidate(iceCandidate);
    } catch (error) {}
  }
  if (type === "handDown") {
    local.value.getTracks().forEach((track) => {
      track.stop();
    });
    //只有全部电话被挂断才会有这个(第二次连接会有问题)
    // peer.close();
    // peer = null;
    show.value = 2;
  }
});

/**
 * 提交文本
 * @param {*} context
 */
const submit = (context) => {
  const { id, user, text, time, textType } = context;
  //data中的key是否有对方id
  data.value[id] = data.value[id] ?? [];
  // 将base64的图片转化为可展示的url
  data.value[id].push({
    user,
    text: textType === "image" ? base64ToUrl(text) : text,
    time,
    textType,
  });
  // 发送网络请求
  WebSocket.webSocketSend({
    type: "chat",
    sendId: myId.value,
    id,
    text,
    time,
    textType,
  });
};

/** 1、请求视频 */
const face = async ({ id }) => {
  //视频页面
  show.value = 3;
  try {
    //创建本地流
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    //将媒体轨道添加到轨道集
    stream.getTracks().forEach((track) => {
      console.log(track, stream);
      peer.addTrack(track, stream);
    });

    //记录本地视频流
    local.value = stream;

    //创建offer
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    //发送websocket请求
    WebSocket.webSocketSend({
      type: "face",
      sendId: myId.value,
      id,
      offer,
    });
    startId.value = myId.value;
  } catch (error) {
    console.log(error);
    if (error.message === "Permission denied") {
      message.error("请开启相关权限后重试!");
    } else {
      message.error("请联系平台!");
    }
  }
};

const handDown = () => {
  WebSocket.webSocketSend({
    type: "handDown",
    id: yourId.value,
    sendId: myId.value,
  });

  local.value.getTracks().forEach((track) => {
    track.stop();
  });
  //只有全部电话被挂断才会有这个
  // peer.close();
  // peer = null;
  show.value = 2;
};
</script>

<template>
  <layout :Level1="true">
    <a-card title="登录页面" class="login_wrapper" v-show="show === 0">
      <chat-login @login="login"></chat-login>
    </a-card>
    <!-- 首页 和 个人中心  -->
    <a-card v-show="show === 1" title="chat" class="individual_wrapper">
      <chat-individual
        :individual="myId.toString()"
        @chatWith="chatWith"
      ></chat-individual>
    </a-card>
    <wx-card
      :title="Number(yourId)"
      :data="data[yourId]"
      :chatWithId="Number(yourId)"
      v-show="show === 2"
      @submit="submit"
      @face="face"
    ></wx-card>
    <wx-face
      v-show="show === 3"
      :local="local"
      :remote="remote"
      @closed="handDown"
    ></wx-face>
  </layout>
</template>

<style lang="less" scoped>
.login_wrapper {
  width: 360px;
  height: 280px;
  margin: 100px auto 0;
  border-radius: 10px;
}
.individual_wrapper {
  width: 80%;
  height: 60%;
  margin: 100px auto 0;
  display: flex;
  flex-direction: column;

  :deep(.ant-card-body) {
    flex: 1;
    overflow: hidden;
  }
}
</style>
