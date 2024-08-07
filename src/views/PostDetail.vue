<template>
  <div class="post-detail">
    <h1>{{ post.title }}</h1>
    <div class="post-meta">
      <p class="writer">{{ post.writer }}</p>
      <p class="createdAt">{{ post.createdAt }}</p>
    </div>
    <img :src="defaultImage" alt="Post image" class="post-image" />
    <div class="content" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';

export default {
  name: 'PostDetail',
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      post: {},
      defaultImage: require('@/assets/logo.png'),
      md: new MarkdownIt()
    };
  },
  computed: {
    compiledMarkdown() {
      return this.md.render(this.post.content || '');
    }
  },
  created() {
    this.fetchPostDetail();
  },
  methods: {
    async fetchPostDetail() {
      try {
        const response = await this.$axios.get(`/posts/${this.postId}`);
        this.post = response.data.result;
      } catch (error) {
        console.error('Error fetching post detail:', error);
      }
    }
  }
}
</script>

<style scoped>
.post-detail {
  text-align: left; /* 전체 텍스트 왼쪽 정렬 */
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.post-detail h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 20px;
}

.post-meta .writer {
  font-weight: bold;
  margin-right: 15px; /* 작성자와 작성일 사이의 간격 */
}

.post-image {
  width: 80%; /* 이미지 크기를 80%로 조정 */
  height: auto;
  max-height: 320px;
  object-fit: cover;
  margin-bottom: 20px;
}

.content {
  text-align: left;
  line-height: 1.6;
  color: #333;
}
</style>
