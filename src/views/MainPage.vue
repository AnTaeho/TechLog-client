<template>
  <div class="main-page">
    <div v-if="accessToken" class="sidebar">
      <ul class="tag-list">
        <li 
          v-for="tag in tags" 
          :key="tag" 
          :class="{ 'tag-item': true, 'selected': selectedTag === tag }" 
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </li>
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
      selectedTag: '', // 선택된 태그 상태
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
        const response = await this.$axios.get('${process.env.VUE_APP_API_BASE_URL}/tags', {
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
        const response = await this.$axios.get(`${process.env.VUE_APP_API_BASE_URL}/posts`, {
          params: {
            page: this.currentPage,
            size: this.pageSize,
          }
        });
        this.posts = response.data.result.posts;
        this.totalPages = response.data.page.totalPages;
      } catch (error) {
        console.error('게시글을 가져오는 중 오류 발생:', error);
      }
    },
    async fetchPostsByTag(tag) {
      try {
        const response = await this.$axios.get(`${process.env.VUE_APP_API_BASE_URL}/posts/tag`, {
          params: {
            page: this.currentPage,
            size: this.pageSize,
            tag: tag,
          }
        });
        this.posts = response.data.result.posts;
        this.totalPages = response.data.page.totalPages;
      } catch (error) {
        console.error('태그로 게시글을 가져오는 중 오류 발생:', error);
      }
    },
    toggleTag(tag) {
      if (this.selectedTag === tag) {
        this.selectedTag = ''; // 태그 선택 해제
        this.fetchPosts(); // 전체 게시글 로드
      } else {
        this.selectedTag = tag; // 태그 선택
        this.fetchPostsByTag(tag); // 선택된 태그로 게시글 로드
      }
      this.currentPage = 0; // 페이지 번호 초기화
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.updatePageQuery();
        if (this.selectedTag) {
          this.fetchPostsByTag(this.selectedTag);
        } else {
          this.fetchPosts();
        }
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updatePageQuery();
        if (this.selectedTag) {
          this.fetchPostsByTag(this.selectedTag);
        } else {
          this.fetchPosts();
        }
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
  background-color: transparent;
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
  background-color: #f7f7f7;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.9em;
  color: #28a745;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tag-item:hover {
  background-color: #e0e0e0;
}

.selected {
  background-color: #28a745; /* 선택된 태그 배경색 */
  color: #fff; /* 선택된 태그 글자색 */
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
