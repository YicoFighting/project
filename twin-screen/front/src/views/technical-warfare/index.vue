<template>
  <div class="app-main">
    <xl-pixel-stream ref="lpPixelStreamRef"></xl-pixel-stream>
    <xl-footer-menu @footer="handlefMethod"></xl-footer-menu>
    <public-left></public-left>
    <public-right></public-right>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from "vue";
import { XlPixelStream, XlFooterMenu } from "@/components";
import { PublicLeft, PublicRight } from "./components";

const mapState = reactive({
  lpPixelStreamRef: null,
  params: {
    eventName: "SceneChange",
    data: {
      name: "szwLevel2Map",
    },
  },
  paramsNameValue: {
    1: "szwLevel1Map",
    2: "szwLevel2Map",
  },
});

const { lpPixelStreamRef, params, paramsNameValue } = toRefs(mapState);

// UE发请求
const handlefMethod = (e) => {
  params.value.data.name = paramsNameValue.value[e];
  lpPixelStreamRef.value?.emitUIInteraction(params.value);
};

// UE响应请求
onMounted(() => {
  lpPixelStreamRef.value?.addResponseEventListener("clickResponses", (e) => {
    console.log("clickResponses=>>>", JSON.parse(e));
  });
  lpPixelStreamRef.value?.addResponseEventListener("handle_responses", (e) => {
    console.log("handle_responses=>>>", JSON.parse(e));
  });
});
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  box-sizing: border-box;
  padding-top: 132px;
  width: 100%;
  height: 100%;
}
</style>
