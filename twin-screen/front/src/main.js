import "@/assets/styles/index.scss";
import "@/utils/rem";
// svg图标
import "virtual:svg-icons-register";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
