<script setup>
import { onMounted } from 'vue';
import init from '@/utils/consanguinity';
import relation from './relation.webp';
const roles = [
  ['1', '表1', relation],
  ['2', '表2', relation],
  ['3', '表3', relation],
  ['4', '表4', relation],
  ['5', '表5', relation],
  ['6', '表6', relation],
  ['7', '表7', relation],
];
const relations = [
  ['1', '2', '', 100],
  ['2', '1', '', 90],
  ['2', '3', '', 100],
  ['3', '2', '', 90],
  ['3', '4', '', 100],
  ['4', '3', '', 90],
  ['3', '5', '', 100],
  ['5', '3', '', 90],
  ['4', '6', '', 100],
  ['6', '4', '', 90],
  ['5', '7', '', 100],
  ['7', '5', '', 90],
];

onMounted(() => {
  const dom = document.querySelector('.map .stage');
  const wrap = document.querySelector('.map');
  init(roles, relations, dom, wrap, 'hero3');
});
</script>

<template>
  <div class="map">
    <div class="stage"></div>
  </div>
</template>

<style lang="less">
.name {
  text-align: center;
}

.map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.stage {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
}

.stage * {
  position: absolute;
}

.role {
  transform: scale(0.7, 0.7);
  border-radius: 100px;
  z-index: 2;
  z-index: 10;
  overflow: hidden;
  cursor: pointer;
}

.role .name {
  display: none;
}

.role img {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100px;
}

.role .cover {
  display: none;
  width: 100%;
  height: 100%;
  background: rgba(30, 40, 80, 0.5);
  border-radius: 100px;
}

.role.level0 {
  transform: scale(1, 1);
  z-index: 11;
  margin: -3px 0 0 -3px;
  // border: 2px solid #d9b386;
  background: #000;
}

.role.level0 img {
  transform: scale(0.93, 0.93);
}

.role.level1 {
  border: 1px solid #2e354a;
  background: #202535;
}

.role.level1.selected {
  // border: 3px solid #d9b386;
  margin: -3px 0 0 -3px;
}

.role.level1 img {
  transform: scale(0.9, 0.9);
}

.role.level2 {
  transform: scale(0.5, 0.5);
}

.role.level2 .cover {
  display: block;
}

.role.level0 .name,
.role.level1.selected .name {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 18px;
  background: rgba(0, 0, 0, 0.5);
  font-size: 10px;
  color: #fff;
  line-height: 16px;
}

.role.level1.selected .name {
  transform: scale(1.43);
}

.role.level1.selected .name {
  height: 22px;
  line-height: 16px;
}

.line {
  width: 400px;
  border-top: 1px solid #fff;
  z-index: 1;
  transform-origin: 0 0;
  z-index: 3;
}

.line span {
  position: static;
  display: inline-block;
}

.line div {
  width: 100%;
  opacity: 1;
  transform-origin: 50% 0;
  font-size: 10px;
  text-align: center;
  line-height: 20px;
}

.line div p {
  width: 100%;
  height: 100%;
}

.line .r0 {
  transform: rotateZ(0);
}

.line .r90 {
  right: -30px;
  writing-mode: vertical-lr;
  transform-origin: 0 0;
  transform: rotateZ(90deg);
}

.line .r180 {
  transform: rotateZ(180deg);
}

.line .r270 {
  writing-mode: vertical-lr;
  transform-origin: 0 0;
  transform: rotateZ(270deg);
}

.line.selected .r0 span {
  margin-top: -9px;
}

.line.selected .r180 span {
  margin-top: -8px;
}

.line.selected .r90 span {
  position: relative;
  margin-right: -9px;
}

.line.selected .r270 span {
  position: relative;
  margin-right: -7px;
}

.line.level0 {
  border-top: 1px solid #6f779c;
  z-index: 3;
  color: #6f779c;
}

.line.level1 {
  border-top: 1px solid #393b5a;
  z-index: 2;
}

.line.level2 {
  border-top: 1px solid #292b5a;
  z-index: 1;
}

.line.selected {
  border-top: 2px solid #a9936f;
  color: #a9936f;
}

.line.selected span {
  // background: #d9b386;
  vertical-align: baseline;
  font-size: 12px;
  transform: scale(0.875);
  line-height: 10px;
  border-radius: 15px;
  padding: 3px 3px;
  -webkit-text-size-adjust: none;
  color: #382611;
}

.line.vertical div {
  width: 0;
  height: 180px;
  color: #ff0;
  writing-mode: vertical-rl;
  transform: rotateZ(-90deg) !important;
}

.stage.moving .line div {
  opacity: 0;
}

.line.level1 div {
  opacity: 0;
}

.line.level2 div {
  opacity: 0;
}

.line.level1 {
  opacity: 1;
}

.line.level2 {
  opacity: 1;
}
</style>
