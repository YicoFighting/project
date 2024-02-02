<template>
  <div class="wrap">
    <div class="back">
      <img :src="imgUrl" alt="帧动画" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const imgUrl = ref("http://localhost:8080/body/人体_00000.png");

const universalFunction = (imgUrl, arrlength = 90, path = "body/人体") => {
  let frameIndex = 0;

  // 播放动画
  const playAnimation = () => {
    imgUrl.value = `http://localhost:8080/${path}_${frameIndex
      .toString()
      .padStart(5, "0")}.png`;

    frameIndex++;
    if (frameIndex > arrlength) {
      frameIndex = 0;
    }

    requestAnimationFrame(playAnimation);
  };

  // 启动动画
  playAnimation();
};

universalFunction(imgUrl);
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .back {
    width: 519px;
    height: 561px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .home {
    width: calc(384px * 3);
    height: calc(216px * 3);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .car {
    width: 531px;
    height: 340px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
