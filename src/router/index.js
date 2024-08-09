import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@/views/MainPage.vue';
import PostDetail from '@/views/PostDetail.vue';
import Join from '@/views/Join.vue';
import Login from '@/views/Login.vue';
import Write from '@/views/Write.vue';
import EditPost from '@/views/EditPost.vue';

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/post/:postId',
    name: 'PostDetail',
    component: PostDetail,
    props: true
  },
  {
    path: '/join',
    name: 'Join',
    component: Join
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/write',
    name: 'Write',
    component: Write
  },
  {
    path: '/edit/:postId',
    name: 'EditPost',
    component: EditPost,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
