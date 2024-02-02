<template>
  <div class="plan-view">
    <div class="material">
      <div class="btn">
        <el-button type="primary" size="default" @click="savePoint">
          保存点位
        </el-button>
      </div>
      <div class="img-list">
        <img
          v-for="item in imgList"
          :key="item.key"
          :src="item.pic"
          :alt="item.key"
          draggable
          :data-icon="item.key"
          :data-img="item.pic"
          @dragstart="dragstart"
        />
      </div>
    </div>
    <div class="content">
      <div
        class="content-img"
        :style="{
          width: attribute.imgWidth + 'px',
          height: attribute.imgHeight + 'px',
        }"
        @dragover="dragover"
        @drop="drop"
      >
        <img :src="attribute.imgSrc" alt="" />

        <div
          v-for="(icon, index) in icons"
          :key="index"
          class="dropped-item"
          :data-key="icon.key"
          :data-img="icon.img"
          :style="{ top: icon.lastTop, left: icon.lastleft }"
          @mousedown="mousedown"
        >
          <img :src="icon.img" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import planUrl from "@images/technology/plan-view.png";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("@images/plan-view/**/*.*");

const attribute = ref({});
const imgList = ref([]);
const icons = ref([]);

// 计算图片的纵横比
const calculate = () => {
  const ctx = window.getComputedStyle(document.querySelector(".content"));
  const ctxWidth = ctx.width.replace("px", "");
  const ctxHeight = ctx.height.replace("px", "");
  const ratio = ctxWidth / ctxHeight;

  attribute.value.imgSrc = planUrl;

  const image = new Image();

  // 设置图片的src属性
  image.src = attribute.value.imgSrc;

  // 在图片加载完成后获取图片的宽度和高度
  image.onload = () => {
    // 获取图片的宽度和高度
    const width = image.width;
    const height = image.height;

    // 计算图片的纵横比
    const aspectRatio = width / height;

    // 输出图片的纵横比
    console.log("图片的纵横比为：" + aspectRatio);
    // 1920 * 1080 图片纵横比 比 盒子的纵横比大,也就是说同长度,图片高度更低
    if (aspectRatio > ratio) {
      attribute.value.imgWidth = ctxWidth * 1;
      attribute.value.imgHeight = attribute.value.imgWidth / aspectRatio;
    } else {
      attribute.value.imgHeight = ctxHeight * 1;
      attribute.value.imgWidth = attribute.value.imgHeight * aspectRatio;
    }
  };
};

// 获取设备图片
const getDeviceImg = async () => {
  for (const path in modules) {
    const img = await modules[path]();
    imgList.value.push({
      key: path.split("/").pop().split(".")[0],
      pic: img.default,
    });
  }
};

// 物料区拖动函数
const dragstart = (e) => {
  // 设置拖拽数据
  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      offsetX: e.offsetX,
      offsetY: e.offsetY,
      icon: e.target.dataset.icon,
      img: e.target.dataset.img,
    })
  );
};

// 拖动
const dragover = (e) => {
  // 阻止默认行为，允许拖放
  e.preventDefault();
};

// 盒内移动
const mousedown = (e) => {
  e.preventDefault();
  e.stopPropagation();

  // 鼠标按下时 记录点击的位置
  const newItem = e.target.parentNode;
  const left = getComputedStyle(newItem).left.replace("px", "");
  const top = getComputedStyle(newItem).top.replace("px", "");

  let disx = e.pageX - left;
  let disy = e.pageY - top;

  const rightContainer = document.querySelector(".content-img");

  // 鼠标移动
  document.onmousemove = function (e) {
    let x = e.pageX - disx;
    let y = e.pageY - disy;

    let maxX =
      parseInt(window.getComputedStyle(rightContainer).width) -
      parseInt(window.getComputedStyle(newItem).width);
    let maxY =
      parseInt(window.getComputedStyle(rightContainer).height) -
      parseInt(window.getComputedStyle(newItem).height);

    if (x < 0) {
      x = 0;
    } else if (x >= maxX) {
      x = maxX;
    }

    if (y < 0) {
      y = 0;
    } else if (y > maxY) {
      y = maxY;
    }

    newItem.style.left = x + "px";
    newItem.style.top = y + "px";
  };
  document.onmouseup = function () {
    document.onmousemove = document.onmouseup = null;
  };
};

// 放下
const drop = (e) => {
  // 阻止默认行为，允许拖放
  e.preventDefault();

  // 获取拖拽数据
  const data = JSON.parse(e.dataTransfer.getData("text/plain"));

  const rightContainer = document.querySelector(".content-img");

  // 创建一个新的元素，将拖拽数据显示在其中
  const newItem = document.createElement("div");
  newItem.classList.add("dropped-item");
  newItem.dataset.key = data.icon;
  newItem.dataset.img = data.img;
  const img = document.createElement("img");
  img.src = data.img;
  img.alt = data.icon;
  newItem.appendChild(img);
  newItem.style.top = e.offsetY - data.offsetY + "px";
  newItem.style.left = e.offsetX - data.offsetX + "px";

  newItem.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 鼠标按下时 记录点击的位置
    let disx = e.pageX - newItem.offsetLeft;
    let disy = e.pageY - newItem.offsetTop;

    // 鼠标移动
    document.onmousemove = function (e) {
      let x = e.pageX - disx;
      let y = e.pageY - disy;

      let maxX =
        parseInt(window.getComputedStyle(rightContainer).width) -
        parseInt(window.getComputedStyle(newItem).width);
      let maxY =
        parseInt(window.getComputedStyle(rightContainer).height) -
        parseInt(window.getComputedStyle(newItem).height);

      if (x < 0) {
        x = 0;
      } else if (x >= maxX) {
        x = maxX;
      }

      if (y < 0) {
        y = 0;
      } else if (y > maxY) {
        y = maxY;
      }

      newItem.style.left = x + "px";
      newItem.style.top = y + "px";
    };
    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
    };
  });

  // 将新元素添加到右侧容器中
  rightContainer.appendChild(newItem);
};

// 处理边界情况
const handBound = (data) => {
  if (data > 100) {
    return 100;
  } else if (data < 0) {
    return 0;
  } else {
    return data;
  }
};

// 保存点位
const savePoint = () => {
  const rightContainer = document.querySelector(".content-img");
  const ctx = getComputedStyle(rightContainer);
  const ctxWidth = ctx.width.replace("px", "");
  const ctxHeight = ctx.height.replace("px", "");
  const childNodes = rightContainer.children;
  const saveData = [];
  for (let i = 0; i < childNodes.length; i++) {
    const childNode = childNodes[i];
    const className = childNode.getAttribute("class");

    if (className) {
      const index = className.indexOf("dropped-item");
      if (index > -1) {
        const left = getComputedStyle(childNode).left.replace("px", "");
        const top = getComputedStyle(childNode).top.replace("px", "");

        const lastTop = handBound((top / ctxHeight) * 100) + "%";
        const lastleft = handBound((left / ctxWidth) * 100) + "%";

        const { key, img } = childNode.dataset;

        saveData.push({
          lastTop,
          lastleft,
          key,
          img,
        });
      }
    }
  }

  localStorage.setItem("icons", JSON.stringify(saveData));
};

onMounted(() => {
  calculate();
  getDeviceImg();

  icons.value = JSON.parse(localStorage.getItem("icons"));
});
</script>

<style lang="scss" scoped>
:deep(.dropped-item) {
  position: absolute;
  width: 40px;
  height: 40px;
  cursor: move;
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.plan-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  background-color: #001c20;
  .material {
    width: 200px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .btn {
      flex: 1 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .img-list {
      flex: 4 0 0;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      img {
        display: block;
        width: 40px;
        height: 40px;
        cursor: move;
      }
    }
  }
  .content {
    flex: 1 0 0;
    overflow: hidden;
    padding-right: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &-img {
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
