<script setup>
import { XlScreen, XlNavBar, XlNotice } from "./components";
</script>

<template>
  <xl-screen>
    <xl-nav-bar></xl-nav-bar>
    <router-view></router-view>
    <xl-notice></xl-notice>
  </xl-screen>
</template>

<style lang="scss" scoped></style>
