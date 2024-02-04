import { createApp } from 'vue';
import '@/assets/style/index.css';
import App from './App.vue';
import router from '@/router';
import pinia from '@/pinia';
import plugins from '@/plugins';
import mitt from 'mitt';
import directive from '@/plugins/ellipsis';

const app = createApp(App);
app.config.globalProperties.$bus = new mitt();
app.use(directive);

app.use(plugins).use(pinia).use(router).mount('#app');
