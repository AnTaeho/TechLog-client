<template>
  <div class="main-page">
    <h1>게시판</h1>
    <PostList :posts="posts" />
  </div>
</template>

<script>
import PostList from '@/components/PostList.vue';

export default {
  name: 'MainPage',
  components: {
    PostList
  },
  data() {
    return {
      posts: []
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await this.$axios.get('/posts');
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

.post-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5개의 카드를 한 줄에 고정으로 배치 */
  gap: 15px; /* 카드 간격을 줄였습니다 */
  width: 100%;
  max-width: 1500px; /* 화면 최대 너비 설정 */
  padding: 0; /* 좌우 끝단의 공백을 줄였습니다 */
}

.post-card {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
  background-color: white;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-thumbnail {
  width: 100%;
  height: 160px; /* 썸네일 높이를 조정했습니다 */
  object-fit: cover;
}

.post-content {
  padding: 15px;
}

.post-content h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #333;
}

.post-content .description {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
}

.post-content .meta {
  font-size: 0.8em;
  color: #999;
}
</style>
