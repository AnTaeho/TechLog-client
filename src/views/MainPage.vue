<template>
    <div class="main-page">
      <h1>게시판</h1>
      <PostList :posts="posts" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import PostList from '@/components/PostList.vue';
  
  export default {
    name: 'MainPage',
    components: {
      PostList
    },
    data() {
      return {
        posts: []
      }
    },
    created() {
      this.fetchPosts();
    },
    methods: {
      async fetchPosts() {
        try {
          const accessToken = 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImV4cCI6MTcyMzAyMzE1OSwiZW1haWwiOiJhbjk4MTAyMkBuYXZlci5jb20ifQ.6XP4BI6ekBxSJjPoXeB3emJzFnqAYGFZLVJo26I86KUNVkigqSJ01V06LWJ53PUypgYUKVDlf1kuvyKY0JMYRw'; // 나중에 실제 토큰으로 대체
          const response = await axios.get('http://localhost:8081/posts', {
            headers: {
              Authorization: accessToken
            }
          });
          this.posts = response.data.result.posts;
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .main-page {
    text-align: center;
    background-color: #fff;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .main-page h1 {
    margin: 20px 0;
    font-size: 2.5em;
    color: #333;
  }
  </style>
  