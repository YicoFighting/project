<script setup>
import { onMounted, reactive, ref } from "vue";
import avatar from "@/assets/images/avatar.webp";
const props = defineProps({
  title: {
    type: Number || String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [],
  },
  chatWithId: {
    type: Number || String,
    default: "",
  },
});

const emits = defineEmits(["submit", "face"]);

//双向绑定
const formState = reactive({
  text: "",
});
//规则
const rules = {
  text: [{ required: true, message: "请输入内容", trigger: ["change"] }],
};
//点击发送
const handleFinish = (value) => {
  const { text } = value;
  const time = new Date();
  emits("submit", {
    id: props.chatWithId,
    user: 1,
    text,
    time,
    textType: "string",
  });
  formState.text = "";
};

//图片加水印,转成base64
const img2base64 = (file, type, text = "chat") => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = "gray";
        ctx.textBaseline = "middle";
        ctx.font = "12px";
        ctx.fillText(text, 20, 20);
        // canvas.toBlob(resolve);
        const base64 = canvas.toDataURL(type, 1);
        resolve(base64);
      };
    };
  });
};
/**
 * 是否是图片格式
 * @param {*} type
 */
const isImg = (type) => /(png|jpe?g|gif|bmp|psd|tiff|tga|eps)/i.test(type);
const beforeUpload = async (file) => {
  const time = new Date();
  let base64 = file;
  if (isImg(file.type)) {
    base64 = await img2base64(file, file.type);
  }
  emits("submit", {
    id: props.chatWithId,
    user: 1,
    text: base64,
    time,
    textType: "image",
  });
  return false;
};
const face = () => {
  emits("face", {
    id: props.chatWithId,
  });
};

//滚动条在最底部
const list = ref();
onMounted(() => {
  list.value.scrollTop = list.value.scrollHeight;
});
</script>

<template>
  <a-card :title="props.title" class="card">
    <div class="card_list" ref="list">
      <template v-for="ctx in props.data" :key="ctx.time">
        <p v-if="ctx.user === 0">
          <a-avatar src="https://joeschmoe.io/api/v1/random" />
          <span class="text" v-if="ctx.textType === 'string'">
            {{ ctx.text }}
          </span>
          <a-image
            v-else-if="ctx.textType === 'image'"
            :width="200"
            :src="ctx.text"
          />
        </p>
        <p v-else class="right_user">
          <span class="text" v-if="ctx.textType === 'string'">
            {{ ctx.text }}
          </span>
          <a-image
            v-else-if="ctx.textType === 'image'"
            :width="200"
            :src="ctx.text"
          />
          <a-avatar :src="avatar" />
        </p>
      </template>
    </div>
    <a-form
      class="card_input"
      :model="formState"
      :rules="rules"
      @finish="handleFinish"
    >
      <a-form-item name="text" class="card_input_left">
        <a-textarea
          :rows="4"
          placeholder="按 Enter 发送消息"
          v-model:value="formState.text"
          autocomplete="off"
          @keyup.enter="handleFinish({ text: formState.text })"
          class="card_input_textarea"
        />
      </a-form-item>
      <a-form-item class="btns">
        <a-upload
          :before-upload="beforeUpload"
          :showUploadList="false"
          multiple
        >
          <a-button
            type="primary"
            shape="round"
            size="large"
            class="card_input_btn"
          >
            发送图片
          </a-button>
        </a-upload>
        <a-button
          type="primary"
          shape="round"
          size="large"
          class="card_input_btn"
          @click="face"
        >
          视频通话
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style lang="less" scoped>
img {
  width: 100px;
}
.card {
  width: 80%;
  height: 80%;
  margin: 3% 3%;
  display: flex;
  flex-direction: column;
  &_list {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    p {
      display: flex;
      vertical-align: middle;
    }
    .right_user {
      justify-content: flex-end;
    }
  }
  &_input {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_left {
      width: 100%;
      margin-bottom: unset !important;
    }
    &_textarea {
      resize: none;
    }
    &_btn {
      margin-left: 10px;
    }
    .btns {
      :deep(.ant-form-item-control-input-content) {
        display: flex;
      }
    }
  }
}
:deep(.ant-card) {
  &-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
}
</style>
