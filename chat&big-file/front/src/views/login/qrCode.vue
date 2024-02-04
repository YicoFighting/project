<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import axios from '@/service';
import { saveAs } from 'file-saver';

const uuid = ref();
const url = ref('');

const refresh = async () => {
  uuid.value = uuidv4();
  const res = await axios.post(
    '/qr/buffer',
    { uuid: uuid.value },
    { responseType: 'blob' }
  );
  url.value = window.URL.createObjectURL(res);
  // const blob = new Blob([res.data]);
  saveAs(res, new Date().getTime() + '.jpeg');
};

refresh();
</script>

<template>
  <img v-if="url" :src="url" alt="二维码" />
  <a-button @click="refresh">刷新</a-button>
</template>

<style lang="less" scoped>
img {
  width: 200px;
  height: 200px;
}
</style>
