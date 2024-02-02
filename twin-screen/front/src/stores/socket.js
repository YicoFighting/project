import { ref } from "vue";
import { defineStore } from "pinia";

export const useSocketInstance = defineStore("socket", () => {
  const socket = ref(null);
  const warningList = ref([]);
  return { socket, warningList };
});
