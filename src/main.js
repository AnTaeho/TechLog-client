import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from './plugins/axios'; // 수정된 axios 인스턴스를 임포트

const app = createApp(App);

app.config.globalProperties.$axios = axios;  // Axios 인스턴스를 글로벌로 등록

app.use(router);
app.mount('#app');
