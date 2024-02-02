<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <el-tooltip
    effect="dark"
    :content="props.text"
    placement="top-start"
    :disabled="props.disabled"
  >
    {{ props.text }}
  </el-tooltip>
</template>
