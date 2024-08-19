<template>
  <div class="main-page">
    <div v-if="accessToken" class="sidebar">
      <ul class="tag-list">
        <li v-for="tag in tags" :key="tag" class="tag-item">{{ tag }}</li>
      </ul>
    </div>
    <div :class="{ 'content': true, 'full-width': !accessToken }">
      <h1>게시판</h1>
      <PostList :posts="posts" />
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 0">이전</button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages - 1">다음</button>
      </div>
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
      tags: [],
      currentPage: 0,
      totalPages: 0,
      pageSize: 20,
      accessToken: '',
    };
  },
  mounted() {
    this.accessToken = localStorage.getItem('accessToken') || '';
    this.currentPage = parseInt(this.$route.query.page) || 0;
    
    if (this.accessToken) {
      this.fetchTags();
    }
    
    this.fetchPosts();
  },
  methods: {
    async fetchTags() {
      try {
        const response = await this.$axios.get('/tags', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });
        this.tags = response.data.result.tags;
      } catch (error) {
        console.error('태그를 가져오는 중 오류 발생:', error);
      }
    },
    async fetchPosts() {
      try {
        const response = await this.$axios.get(`/posts?page=${this.currentPage}&size=${this.pageSize}`);
        this.posts = response.data.result.posts;
        this.totalPages = response.data.page.totalPages;
      } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.updatePageQuery();
        this.fetchPosts();
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updatePageQuery();
        this.fetchPosts();
      }
    },
    updatePageQuery() {
      this.$router.push({ query: { page: this.currentPage } });
    }
  }
}
</script>

<style scoped>
.main-page {
  display: flex;
  background-color: #fff;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.sidebar {
  width: 160px;
  padding-right: 20px;
  margin-top: 120px;
  overflow-y: auto;
  height: calc(100vh - 160px);
  border-radius: 10px;
  background-color: transparent; /* 사이드바 배경색 제거 */
}

.tag-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.tag-item {
  display: inline-block;
  background-color: #f7f7f7; /* 태그 배경색 */
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.9em;
  color: #28a745; /* 태그 글자색 */
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tag-item:hover {
  background-color: #e0e0e0;
}

.content {
  flex-grow: 1;
  margin-left: 20px;
  margin-top: 20px;
}

.full-width {
  width: 100%;
}

.main-page h1 {
  margin: 20px 0;
  font-size: 2.5em;
  color: #333;
  text-align: center;
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
