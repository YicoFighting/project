<template>
  <div class="wrap">
    <el-upload
      class="list"
      ref="upload"
      accept="image/svg+xml,image/jpeg,image/webp,image/png"
      action="http://localhost:8081/upload-img"
      v-model:file-list="fileList"
      multiple
      :limit="1"
      :auto-upload="false"
      :disabled="disabled"
      list-type="picture-card"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :style="{ '--show': disabled ? 'none' : 'inline-flex' }"
    >
      <el-icon><Plus /></el-icon>

      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePreview(file)"
            >
              <el-icon><zoom-in /></el-icon>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <el-icon><Download /></el-icon>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
          <span class="text">压缩前大小：{{ kb2M(file.size) }}</span>
        </div>
      </template>
    </el-upload>

    <div v-if="disabled" class="compress">
      <div class="box">
        <el-image :src="compressFile?.url" fit="contain" class="cover-img" />
        <div class="white-bg"></div>
      </div>
      <div class="text">压缩后大小:{{ kb2M(compressFile?.size) }}</div>
    </div>
  </div>

  <el-button type="primary" @click="submitUpload" class="upload">
    上传
  </el-button>

  <el-button type="primary" @click="download" class="upload" v-if="disabled">
    下载
  </el-button>
</template>
<script setup>
// 引入JSZip和FileSaver库
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { ref, getCurrentInstance, computed } from "vue";
import { Delete, Download, Key, Plus, ZoomIn } from "@element-plus/icons-vue";
import { compression } from "@/utils";

const { proxy } = getCurrentInstance();

// 上传组件示例
const upload = ref();
// 文件列表
const fileList = ref([]);
// 禁用
const disabled = computed(() => fileList.value.length === 1);
// 压缩后文件
const compressFile = ref(null);

// 将文件大小由kb转成M(策略模式)
const kb2M = (size) => {
  const format = [
    [
      1024 * 1024,
      (size) => {
        return (Number(size) / 1024 / 1024).toFixed(1) + "M";
      },
    ],
    [
      1024,
      (size) => {
        return (Number(size) / 1024).toFixed(1) + "kb";
      },
    ],
    [
      0,
      (size) => {
        return size + "b";
      },
    ],
  ];

  for (let i = 0; i < format.length; i++) {
    const arr = format[i];
    const formatSize = arr[0];
    const formatFn = arr[1];
    if (size >= formatSize) {
      return formatFn(size);
    }
  }
};

// 点击上传
const submitUpload = () => {
  upload.value.submit();
};

// file转base64
const file2Base = (file) => {
  return new Promise((resolve, reject) => {
    try {
      let reader = new FileReader();

      reader.onloadend = function () {
        resolve(reader.result);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

// 点击下载
const download = async () => {
  // 创建JSZip实例
  let zip = new JSZip();

  // 创建文件夹并添加图片文件
  let folder = zip.folder("images");

  for (let i = 0; i < fileList.value.length; i++) {
    const { raw } = fileList.value[i];
    const base = await file2Base(raw);
    folder.file("压缩前_" + raw.name, base);
  }

  if (compressFile.value?.result) {
    const base = await file2Base(compressFile.value?.result);
    folder.file("压缩后_" + compressFile.value?.result?.name, base);
  }

  // 生成zip文件并下载
  zip.generateAsync({ type: "blob" }).then(function (blob) {
    saveAs(blob, "example.zip");
  });
};

// 上传成功
const handleSuccess = (e) => {
  console.log("上传成功", e);
};

// 列表发生改变
const handleChange = async (file) => {
  const isUploaded = fileList.value.some(
    (item) => item.name === file.name && file.status !== "success"
  );
  if (isUploaded) {
    proxy.$Message.info(`${file.name}已经在列表中了`);
    fileList.value.splice(-1);
  } else {
    const uid = file.raw.uid;
    const result = await compression(file.raw);
    result.uid = uid;
    // file.raw = result;

    compressFile.value = {
      size: result.size,
      url: URL.createObjectURL(result),
      result,
    };
  }
};

// 图片超出数量
const handleExceed = () => {
  proxy.$Message.warning("图片数量超出限制");
};

// 预览文件
const handlePreview = (file) => {
  console.log("预览=>>", file);
};

// 下载文件
const handleDownload = (file) => {
  // 创建隐藏的可下载链接
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([file.raw]));
  link.download = file.name;

  // 触发点击事件
  link.click();

  // 释放链接对象
  URL.revokeObjectURL(link.href);
};

// 移除文件
const handleRemove = (file) => {
  const index = fileList.value.findIndex((item) => item.uid === file.uid);
  if (index > -1) {
    fileList.value.splice(index, 1);
  }
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 12px;
  color: #606266;
}
.wrap {
  display: flex;
}
.list {
  :deep(.el-upload--picture-card) {
    display: var(--show);
  }
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    overflow: visible;
  }
}
.compress {
  .box {
    position: relative;
    width: 148px;
    height: 148px;
    .cover-img {
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .white-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      inset: 0;
      background-color: #fff;
      z-index: 0;
    }
  }
  .text {
    margin-top: 8px;
  }
}

.upload {
  margin: 20px;
}
</style>
