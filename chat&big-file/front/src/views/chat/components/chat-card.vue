<script setup>
import { onMounted, reactive, ref, toRef } from "vue";
import avatar from "@/assets/images/avatar.webp";
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["submit"]);

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
  emits("submit", text);
  formState.text = "";
};

//滚动条在最底部
const list = ref();
onMounted(() => {
  list.value.$el.scrollTop = list.value.$el.scrollHeight;
});
</script>

<template>
  <a-card :title="props.title" class="card">
    <a-list
      ref="list"
      item-layout="horizontal"
      :data-source="props.data"
      class="card_list"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :description="item['text']">
            <template #title>
              <a href="https://www.antdv.com/">
                {{ item["user"] }}
              </a>
            </template>
            <template #avatar>
              <a-avatar :src="avatar" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <a-form
      class="card_input"
      :model="formState"
      :rules="rules"
      @finish="handleFinish"
    >
      <a-form-item name="text" class="card_input_left">
        <a-textarea
          :rows="4"
          v-model:value="formState.text"
          autocomplete="off"
          @keyup.enter="handleFinish({ text: formState.text })"
          class="card_input_textarea"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          shape="round"
          size="large"
          html-type="submit"
          class="card_input_btn"
        >
          发送
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<style lang="less" scoped>
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
