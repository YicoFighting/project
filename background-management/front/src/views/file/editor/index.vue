<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { createEditor, createToolbar } from "@wangeditor/editor/dist";
import { Boot } from "@wangeditor/editor/dist";
import attachmentModule from "@wangeditor/plugin-upload-attachment/dist";
import mentionModule from "@wangeditor/plugin-mention/dist";
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";

// 编辑器实例
let editorInstance = null;
// 编辑器内容
const editorContent = ref("");

// editor.setHtml(axiosHTML)

// 显示弹框
const showModal = () => {
  const editorPopup = document.getElementById("editor-popup");
  // 获取光标位置，定位 modal
  const domSelection = document.getSelection();
  const domRange = domSelection.getRangeAt(0);
  if (domRange == null) return;
  const selectionRect = domRange.getBoundingClientRect();
  // 获取编辑区域 DOM 节点的位置，以辅助定位
  // const containerRect = editor.getEditableContainer().getBoundingClientRect();

  const x = selectionRect.x;
  const y = selectionRect.y;

  editorPopup.style.display = "block";
  editorPopup.style.top = y + "px";
  editorPopup.style.left = x + "px";
};

// 插入@内容
const insertMention = (value) => {
  const mentionNode = {
    type: "mention", // 必须是 'mention'
    value, // 文本
    info: { x: 1, y: 2 }, // 其他信息，自定义
    children: [{ text: "" }], // 必须有一个空 text 作为 children
  };
  editorInstance.restoreSelection(); // 恢复选区
  editorInstance.deleteBackward("character"); // 删除 '@'
  editorInstance.insertNode(mentionNode); // 插入 mention
  editorInstance.move(1); // 移动光标
};

// 隐藏弹框
const hideModal = () => {
  const editorPopup = document.getElementById("editor-popup");
  editorPopup.style.display = "none";
};

// 事件委托 监听@点击
const entrust = (e) => {
  const txt = e.target.innerText;
  insertMention(txt);
};

onBeforeMount(() => {
  // 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
  Boot.registerModule(attachmentModule);
  Boot.registerModule(mentionModule);
});

onMounted(() => {
  const editorConfig = {
    placeholder: "请输入...",
    // 在编辑器中，点击选中“附件”节点时，要弹出的菜单
    hoverbarKeys: {
      attachment: {
        menuKeys: ["downloadAttachment"], // “下载附件”菜单
      },
    },
    MENU_CONF: {
      uploadImage: {
        server: "http://127.0.0.1:3000/api/upload-img",
        fieldName: "custom-field-name",
        timeout: 5 * 1000,
        maxFileSize: 10 * 1024 * 1024,
        base64LimitSize: 5 * 1024,
        meta: { token: "xxx" },
        metaWithUrl: true,
        headers: { Accept: "text/x-json" },
        onBeforeUpload(file) {
          console.log("onBeforeUpload", file);
          return file;
        },
      },
      uploadVideo: {
        server: "http://127.0.0.1:3000/api/upload-video",
        fieldName: "custom-fileName",
        timeout: 5 * 1000,
        maxFileSize: 10 * 1024 * 1024,
        base64LimitSize: 5 * 1024,
        meta: { token: "xxx" },
        metaWithUrl: true,
        headers: { Accept: "text/x-json" },
        onBeforeUpload(file) {
          console.log("onBeforeUpload", file);
          return file;
        },
      },
      // 上传附件
      uploadAttachment: {
        server: "http://127.0.0.1:3000/api/upload-video",
        timeout: 5 * 1000,
        fieldName: "custom-fileName",
        meta: { token: "xxx" },
        metaWithUrl: true,
        headers: { Accept: "text/x-json" },
        maxFileSize: 10 * 1024 * 1024,
      },
    },
    EXTEND_CONF: {
      mentionConfig: {
        showModal, // 必须
        hideModal, // 必须
      },
    },
    onChange(editor) {
      const html = editor.getHtml();
      // const text = editor.getText();
      // const json = editor.children;
      // console.log("editor html", html);
      // console.log("editor json", json);
      // console.log("editor text", text);

      editorContent.value = html;
    },
  };

  editorInstance = createEditor({
    selector: "#editor-container",
    html: "",
    config: editorConfig,
    mode: "default", // or 'simple'
  });

  const toolbarConfig = {
    // 插入哪些菜单
    insertKeys: {
      index: 0, // 自定义插入的位置
      keys: ["uploadAttachment"], // “上传附件”菜单
    },
  };

  createToolbar({
    editor: editorInstance,
    selector: "#toolbar-container",
    config: toolbarConfig,
    mode: "default", // or 'simple'
  });
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  editorInstance && editorInstance.destroy();
});
</script>

<template>
  <div id="editor-wrapper">
    <!-- 工具栏 -->
    <div id="toolbar-container"></div>
    <!-- 编辑器 -->
    <div id="editor-container"></div>
    <!-- @弹框 -->
    <div id="editor-popup">
      <input id="mention-input" />
      <ul id="mention-list" @click="entrust">
        <li>张三</li>
        <li>李四</li>
        <li>小明</li>
        <li>小李</li>
        <li>小红</li>
      </ul>
    </div>
  </div>
  <div class="text" v-html="editorContent"></div>
</template>

<style scoped lang="scss">
#editor-popup {
  display: none;
  position: absolute;
  width: 200px;
  height: 300px;
  overflow: hidden;
  overflow-y: auto;
  ul {
    list-style: none;
  }
}
</style>
