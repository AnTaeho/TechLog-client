import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/views/MainPage.vue';
import PostDetail from '@/views/PostDetail.vue'; // 새로 추가할 컴포넌트

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/post/:postId', // 상세 조회 페이지 경로
    name: 'PostDetail',
    component: PostDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
