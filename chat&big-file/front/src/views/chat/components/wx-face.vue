<script setup>
import { nextTick, ref, toRefs, watch } from 'vue';

const props = defineProps({
  local: {
    requried: true,
  },
  remote: {
    requried: true,
  },
});
const emits = defineEmits(['closed']);
const videoRef = ref();
const { local, remote } = toRefs(props);

const generationVideo = (id, strem) => {
  const video = document.getElementById(id);
  video.srcObject = strem;

  video.onloadedmetadata = () => {
    video.play();
  };
};

const closed = () => {
  emits('closed');
};

watch(
  () => [local.value, remote.value],
  ([newLocal, newRemote]) => {
    nextTick(() => {
      //添加
      newLocal && generationVideo('v', newLocal);
      newRemote && generationVideo('r', newRemote);
      //移除
    });
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <div class="face" ref="videoRef">
    <div class="vr-wrap">
      <video id="v"></video>
      <video id="r"></video>
    </div>
    <a-button type="primary" @click="closed">挂 断</a-button>
  </div>
</template>

<style lang="less" scoped>
.face {
  color: #fff;
}
.vr-wrap {
  position: relative;
  width: 450px;
  height: 225px;
  #v {
    width: 100%;
    height: 100%;
  }
  #r {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 180px;
    height: 90px;
  }
}

video {
  // display: none;
  object-fit: cover;
}
</style>
