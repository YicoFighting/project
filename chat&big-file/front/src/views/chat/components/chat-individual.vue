<script setup>
import { computed, ref, toRefs } from "vue";
import avatar from "@/assets/images/avatar.webp";
const users = [810, 109];
const props = defineProps({
  individual: {
    type: String || Number,
    default: "",
  },
});
const { individual } = toRefs(props);
const emits = defineEmits(["chatWith"]);
const activeKey = ref("chat");
const friends = computed(() =>
  users.filter((item) => item != individual.value)
);
const chatWith = (id) => {
  emits("chatWith", id);
};
</script>

<template>
  <div class="individual">
    <a-tabs
      v-model:activeKey="activeKey"
      tab-position="bottom"
      centered
      class="tabs"
    >
      <a-tab-pane key="chat" tab="聊天界面">
        <a-list item-layout="horizontal" :data-source="friends">
          <template #renderItem="{ item }">
            <a-list-item @click="chatWith(item)">
              <a-list-item-meta description="这是我的朋友">
                <template #title>
                  <a href="https://www.antdv.com/">{{ item }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="avatar" />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="user" tab="个人中心"> {{ individual }} </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="less" scoped>
.individual {
  height: 100%;
  :deep(.ant-tabs) {
    display: flex;
    flex-direction: column;
    .ant-tabs-content-holder {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .ant-list-item-meta-title > a,
    .ant-list-item-meta-description {
      color: #b4b9ba;
    }
    .ant-list-split .ant-list-item {
      border: 1px solid #385055;
    }
    .ant-list-item {
      padding-left: 20px;
      &:hover {
        cursor: pointer;
        background: rgba(45, 220, 255, 0.14);
      }
    }
  }
}
.tabs {
  height: 100%;
}
:deep(.ant-tabs-nav-list) {
  width: 100%;
  .ant-tabs-tab {
    width: 50%;
    display: flex;
    justify-content: center;
  }
}
</style>
