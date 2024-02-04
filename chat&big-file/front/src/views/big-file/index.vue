<script setup>
import { ref } from "vue";
import Layout from "@/views/layout/index.vue";
import {
  uploadBigFile,
  mergeBigFile,
  uploadFileByStrategy,
  mergeByStrategy,
} from "@/service/file.js";
import {
  sliceFile,
  calculateHashSample,
  concurrencyNetwork,
} from "@/utils/bigFile.js";

import { exportExcel } from "@/service/file.js";
const exportExcelBtn = () => {
  exportExcel().then((res) => {
    let fileName = decodeURI(
      res.headers["content-disposition"].substring(
        res.headers["content-disposition"].indexOf("=") + 1
      )
    );
    let type = res.headers["content-type"];
    let blob = new Blob([res.data], { type });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      //下载
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  });
};

/**
 * 大文件上传
 *    切片、秒传、断点续传、网络请求并发控制、慢启动策略
 */

/** 存放文件 */
const fileList = ref([]);
/** 进度相关信息 */
const allProgress = ref(0);
/** 文件上传进度条 */
const allUploadProgress = ref(0);
/** 存储分片进度 */
const fragmentProgress = ref([]);
/** 是否显示进度条 */
const showProgress = ref(false);

/** 上传前 */
const beforeUpload = (file) => {
  fileList.value = [...fileList.value, file];
  return false;
};

/** 数组求和 */
const sum = (arr, oneProgress) => {
  return arr.reduce((acr, cur) => {
    return acr + cur["progressNumber"] * oneProgress;
  }, 0);
};

/** 点击上传 */

/**
 * 网络并发控制
 */
const handleUploadNetwork = () => {
  showProgress.value = true;
  fileList.value.forEach(async (file) => {
    /** 抽样hash(文件秒传、断点续传) */
    const sampling = await calculateHashSample(file, allProgress);
    /** 文件名(不带后缀) */
    const fileName = file.name.substring(0, file.name.lastIndexOf("."));
    /** 切片得到的片段列表 */
    const fileChunkList = await sliceFile(file);
    /** 切片数量 */
    const chunkCount = fileChunkList.length;
    /** 每一片进度 */
    const oneProgress = Number((95 / chunkCount).toFixed(2));
    /** 存放所有切片的网络请求 */
    const networks = [];

    /** 遍历片段列表 */
    fileChunkList.map((item, index) => {
      /** 每个切片进度 */
      fragmentProgress.value.push({
        progressNumber: 0,
        progress: (e) => {
          fragmentProgress.value[index].progressNumber = Number(
            (e.progress * 100).toFixed(2)
          );
          allUploadProgress.value = Number(
            sum(fragmentProgress.value, oneProgress / 100).toFixed(2)
          );
        },
      });
      const formData = new FormData(); // 创建表单类型数据
      const fragmentName = fileName + "_" + index; //切片名
      item = new File([item["fragment"]], fragmentName, { type: file.type });
      formData.append("file", item); //对应文件
      formData.append("fileName", fileName); //不带后缀的文件名(用作临时存储切片)
      formData.append("fragmentName", fragmentName); //切片名
      const network = () =>
        uploadBigFile(formData, fragmentProgress.value[index]["progress"]);
      networks.push(network);
    });
    concurrencyNetwork(networks).then(() => {
      //发出合并请求
      mergeBigFile({ fileName: file.name }).then(() => {
        allUploadProgress.value = 100;
      });
    });
  });
};

/** 文件进度条 */
const sumStrategy = (arr) => {
  return arr.reduce((acr, cur) => {
    return acr + cur["progressNumber"] * cur["chunkSize"];
  }, 0);
};

/** 慢启动策略 */
const handleUpload = () => {
  showProgress.value = true;
  fileList.value.forEach(async (file) => {
    /** 抽样hash(文件秒传、断点续传) */
    const sampling = await calculateHashSample(file, allProgress);
    /** 文件后缀 */
    const ext = file.name.substring(file.name.lastIndexOf("."));
    /** hash+后缀名 */
    const fileName = sampling + ext;
    /** 默认切片大小:1M */
    let offset = 1024 * 1024;
    /** 切片的左范围 */
    let cur = 0;
    /** 切片的索引 */
    let index = 0;
    while (cur < file.size) {
      /** 切片名称 */
      const chunkName = sampling + "_" + index;
      /** 切片 */
      let chunk = file.slice(cur, cur + offset);
      chunk = new File([chunk], chunkName, { type: chunk["type"] });
      /** 修改切片的左范围 */
      cur += offset;
      const formData = new FormData();
      formData.append("chunk", chunk); //切片File
      formData.append("chunkName", chunkName); //切片名称
      formData.append("fileName", file.name); //原始文件名(包括后缀)
      formData.append("fileHash", sampling); //文件hash值
      formData.append("size", chunk.size); //切片大小
      /** 记录索引 */
      const _that = index;
      /** 每个切片进度 */
      fragmentProgress.value.push({
        progressNumber: 0,
        chunkSize: (chunk.size / file.size).toFixed(4),
        progress: (e) => {
          fragmentProgress.value[_that].progressNumber = Number(
            (e.progress * 100).toFixed(2)
          );
          allUploadProgress.value = Number(
            sumStrategy(fragmentProgress.value).toFixed(2)
          );
        },
      });
      const start = new Date().getTime();
      /** 网络请求 */
      await uploadFileByStrategy(
        formData,
        fragmentProgress.value[index]["progress"]
      );
      const end = new Date().getTime();
      /** 网络请求的耗时 */
      const interval = ((end - start) / 1000).toFixed(4);
      /** 希望在几秒内上传完切片,这个除数就是多少 */
      let rate = interval / 10;
      /** 0.5 <= rate <= 2 */
      if (rate < 0.5) rate = 0.5;
      if (rate > 2) rate = 2;
      /** 调整切片大小 */
      offset = parseInt(offset / rate);
      console.log(
        `切片${index}大小是${offset},耗时${interval}秒,是10秒的${rate}倍,修正大小为${offset}`
      );
      /** 切下一片 */
      index++;
    }

    /** 合并切片 */
    mergeByStrategy({
      hash: sampling,
      originFileName: file.name,
      fileName,
    }).then((res) => {});
  });
};
</script>

<template>
  <layout :Level1="true">
    <a-upload
      :file-list="fileList"
      :before-upload="beforeUpload"
      :showUploadList="false"
      multiple
    >
      <a-button type="primary"> 选择文件 </a-button>
    </a-upload>
    <a-button type="primary" @click="handleUpload" class="submit">
      上传
    </a-button>

    <a-button type="primary" @click="exportExcelBtn" class="submit">
      测试Excel导出
    </a-button>
    <div class="progress" v-show="showProgress">
      <span class="progress-title">创建hash进度条:</span>
      <a-progress :percent="allProgress" strokeColor="#1890ff" />
    </div>
    <div class="progress" v-show="showProgress">
      <span class="progress-title">文件上传进度条:</span>
      <a-progress :percent="allUploadProgress" strokeColor="#1890ff" />
    </div>
    <div class="fragment" v-if="showProgress">
      <div
        class="progress"
        v-for="(progress, progressIndex) in fragmentProgress"
        :key="progressIndex + 'progressIndex'"
      >
        <span class="progress-title">切片{{ progressIndex }}上传进度条:</span>
        <a-progress
          :percent="progress['progressNumber']"
          strokeColor="#1890ff"
        />
      </div>
    </div>
  </layout>
</template>

<style lang="less" scoped>
.submit {
  margin-left: 20px;
}
.progress {
  padding: 20px;
  display: flex;
  &-title {
    margin-right: 10px;
    white-space: nowrap;
    color: #fff;
  }
}
.fragment {
  height: 100px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
