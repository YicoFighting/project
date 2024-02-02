import { createApp } from "vue";
// import "@/utils/rem";
import "@/assets/css/index.scss";
import App from "./App.vue";
import Router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import initPlugins from "@/plugins";
import directives from "@/directives";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(createPinia());
app.use(Router);
app.use(ElementPlus);
app.use(initPlugins);
app.use(directives);
app.mount("#app");
