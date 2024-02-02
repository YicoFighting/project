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
const editorContent = ref(
  `<p style="text-indent: 2em;">重阳节临近，昨天（10月22日），市委书记@刘小涛结合开展主题教育，专程走访养老机构，调研养老工作，向全市广大老年人致以节日问候和祝福。他强调，要深入学习贯彻习近平总书记关于老龄工作重要指示精神，始终牢记人民至上，全心全意为民造福，围绕“人的一天、人的一生”办好民生实事，推进全龄友好型社会建设，大力健全养老服务体系，促进养老事业和养老产业协同发展，不断提升老年人获得感幸福感安全感。</p><p><img src="https://www.suzhou.gov.cn/szsrmzf/szyw/202310/14cb1ef38c6649ec9e3421afe4adf1f7/images/32ca5028ea2141da82877869b4759fff.png" alt="倪黎祥 摄" data-href="https://www.suzhou.gov.cn/szsrmzf/szyw/202310/14cb1ef38c6649ec9e3421afe4adf1f7/images/32ca5028ea2141da82877869b4759fff.png" style=""/>苏州市社会福利总院主要为“老孤病残”特定对象提供救助服务。老年福利中心内，老人们正在进行文艺表演、康复锻炼等活动。刘小涛来到活动区、宿舍楼，与入住老人亲切交流，详细了解他们的日常生活情况，叮嘱大家保重身体、愉快生活。他指出，各级各有关部门要关爱“一老一小”，特别是要格外关心老年困难群体，提供有力服务保障，让他们切实感受到党委政府的关怀和温暖。</p><p><br></p><p style="text-indent: 2em; text-align: justify; line-height: 1.5;">狮山怡养康养综合体项目由市康养集团管理运营，包含老年公寓、老年病医院、认知症照护中心和护理院等设施。刘小涛仔细察看内部环境设施，了解配套服务情况，认真询问入住老人的生活体验。他指出，市康养集团要积极发挥国企示范作用，进一步提升供给能力、推进业态融合，用心用情做好各项工作，全力打响养老服务品牌。</p><p style="text-indent: 2em; text-align: justify; line-height: 1.5;">沧浪街道潼泾综合为老服务中心辐射周边5个社区2.3万余居民，提供助餐、助浴、助急等综合化服务。刘小涛走进餐厅细致察看菜单，详细了解中心服务内容和运营模式，鼓励中心在做好基础服务的同时，积极探索市场化路径，提升运营质效。中心内，社区居民正在欣赏苏州评弹，刘小涛与大家深入交流，认真倾听对做好社区工作的意见建议。他要求，社区要紧贴群众需求、解决好“急难愁盼”问题，让大家收获更多“家门口的幸福”。</p><p style="text-indent: 2em; text-align: justify; line-height: 1.5;">调研中，刘小涛强调，养老工作与每一个人息息相关，是群众高度关注的民生要事。各地各有关部门要坚持以人民为中心的发展思想，不断健全居家社区机构相协调、医养康养相结合的养老服务体系。要全力办好养老事业，强化对困难群体的兜底保障，提升基本养老服务能力和水平。要积极发展养老产业，提供不同层次的养老服务，更好满足老年人多样化、个性化需求。要营造尊老爱老助老良好氛围，推动各行业各领域加大适老化升级改造力度，更好满足老年人精神文化生活需要。</p><p style="text-indent: 2em; text-align: justify; line-height: 1.5;">市领导@王飏、@方文浜、@查颖冬，市有关部门和单位主要负责同志参加调研。</p>`
);

// editor.setHtml(editorContent);

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

  editorInstance.setHtml(editorContent.value);
});

const save = () => {
  console.log(editorContent.value);
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  editorInstance && editorInstance.destroy();
});
</script>

<template>
  <div class="wrap">
    <div id="editor-wrapper">
      <!-- 工具栏 -->
      <div id="toolbar-container"></div>
      <!-- 编辑器 -->
      <div id="editor-container"></div>
      <!-- @弹框 -->
      <div id="editor-popup">
        <input id="mention-input" />
        <ul id="mention-list" @click="entrust">
          <li>方文浜</li>
          <li>查颖冬</li>
          <li>刘小涛</li>
          <li>王飏</li>
        </ul>
      </div>

      <div id="save">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="text" v-html="editorContent"></div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  #editor-wrapper,
  .text {
    flex: 1 0 0;
  }
  #editor-wrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    #editor-container {
      flex: 1 0 0;
    }
    #save {
      margin: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
  .text {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
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
