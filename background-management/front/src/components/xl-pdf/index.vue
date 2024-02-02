<template>
  <iframe :src="src" frameborder="0" width="100%" height="100%"></iframe>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const src = computed(() => {
  // 拼接url路径,如果你的url有参数,那么需要URL编码一下
  return `/pdfjs/web/viewer.html?file=${props.url}`;
});
</script>
