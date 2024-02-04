<template>
  <div class="layout">
    <!-- header -->
    <app-header></app-header>
    <nav-bar :navbars="navbars"></nav-bar>
    <slot></slot>
    <!-- footer -->
    <app-footer></app-footer>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useHomeStore } from "@/stores/home";
const store = useHomeStore();
store.fetchHomeInfoData("OPPO");
const { navbars } = storeToRefs(store);
</script>
