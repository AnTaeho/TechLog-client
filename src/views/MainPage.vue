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
      tags: [], // 태그 리스트
      currentPage: 0,
      totalPages: 0,
      pageSize: 20,
      accessToken: '', // accessToken을 저장할 변수
    };
  },
  mounted() { // mounted() 훅에서 로컬 스토리지 접근
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
        this.fetchPosts(); // 페이지 업데이트 후 게시글 다시 가져오기
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updatePageQuery();
        this.fetchPosts(); // 페이지 업데이트 후 게시글 다시 가져오기
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
  background-color: #f9f9f9;
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
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 0.75em;
  color: #007bff;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 80%;
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
