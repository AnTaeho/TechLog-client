<template>
  <div class="main-page">
    <h1>게시판</h1>
    <PostList :posts="posts" />
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 0">이전</button>
      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages - 1">다음</button>
    </div>
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
      posts: [],
      currentPage: 0,
      totalPages: 0,
      pageSize: 20
    };
  },
  created() {
    this.currentPage = parseInt(this.$route.query.page) || 0;
    this.fetchPosts();
  },
  watch: {
    '$route.query.page': 'fetchPosts'
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await this.$axios.get(`/posts?page=${this.currentPage}&size=${this.pageSize}`);
        this.posts = response.data.result.posts;
        this.totalPages = response.data.page.totalPages;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.updatePageQuery();
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updatePageQuery();
      }
    },
    updatePageQuery() {
      this.$router.push({ query: { page: this.currentPage } });
    }
  }
}
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
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
  grid-template-columns: repeat(5, 1fr); 
  gap: 15px; 
  width: 100%;
  max-width: 1500px;
  padding: 0; 
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
  height: 160px; 
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

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 5px 10px;
  font-size: 1em;
}

.pagination span {
  font-size: 1.2em;
}
</style>
