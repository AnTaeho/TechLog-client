import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './plugins/axios'; // 수정된 axios 인스턴스를 임포트

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(router);
app.mount('#app');
