<template>
  <div class="post-detail">
    <h1>{{ post.title }}</h1>
    <div class="post-meta">
      <div class="meta-left">
        <div class="tags">
          <span v-for="tag in post.tags" :key="tag" class="tag-item">{{ tag }}</span>
        </div>
        <div class="date-author">
          <span class="createdAt">{{ post.createdAt }}</span> · <span class="writer">{{ post.writer }}</span>
        </div>
      </div>
      <div class="meta-right">
        <button v-if="canEdit" @click="editPost" class="edit-button">수정</button>
        <button v-if="canDelete" @click="deletePost" class="delete-button">삭제</button>
      </div>
    </div>
    <img :src="getThumbnailUrl(post.thumbnail)" alt="Post image" class="post-image" />
    <div class="content" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import 'prismjs/components/prism-java'; // Java 언어 지원
import 'prismjs/components/prism-javascript'; // JavaScript 언어 지원
import 'prismjs/themes/prism.css'; // 기본 테마

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
      md: new MarkdownIt({
        highlight: (str, lang) => {
          if (lang && Prism.languages[lang]) {
            try {
              return `<pre class="language-${lang}"><code>${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`;
            } catch (error) {
              console.error('Prism.js highlighting error:', error);
            }
          }
          return `<pre class="language-${lang}"><code>${this.escapeHtml(str)}</code></pre>`;
        }
      })
    };
  },
  computed: {
    compiledMarkdown() {
      return this.md.render(this.post.content || '');
    },
    canDelete() {
      return this.post.writer === localStorage.getItem('name');
    },
    canEdit() {
      return this.post.writer === localStorage.getItem('name');
    }
  },
  created() {
    this.fetchPostDetail();
  },
  methods: {
    escapeHtml(string) {
      return string
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"//g, '&quot;')
        .replace(/'/g, '&#039;');
    },
    getThumbnailUrl(thumbnail) {
      return thumbnail ? thumbnail : require('@/assets/logo.png');
    },
    async fetchPostDetail() {
      try {
        const response = await this.$axios.get(`/posts/${this.postId}`);
        this.post = response.data.result;
      } catch (error) {
        console.error('Error fetching post detail:', error);
      }
    },
    async deletePost() {
      try {
        await this.$axios.delete(`/posts/${this.postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        window.location.href = '/';
      } catch (error) {
        console.error('게시글 삭제 중 오류가 발생했습니다:', error);
      }
    },
    editPost() {
      this.$router.push({ name: 'EditPost', params: { postId: this.postId } });
    }
  }
}
</script>

<style scoped>
/* Prism.js 코드 블록 스타일 */
pre code {
  padding: 10px;
  background: #f8f8f8;
  border-radius: 5px;
  overflow-x: auto;
}

/* 기존 스타일을 유지하며 추가 수정 */
.post-detail {
  text-align: left;
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
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 20px;
}

.meta-left {
  display: flex;
  align-items: center;
}

.meta-left .tags {
  display: flex;
  gap: 5px;
  margin-right: 15px;
}

.tag-item {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 3px 6px;
  font-size: 0.7em;
  color: #007bff;
}

.date-author {
  font-size: 0.8em;
  color: #666;
}

.meta-right {
  display: flex;
  align-items: center;
}

.meta-right .createdAt {
  margin-right: 10px;
}

.edit-button,
.delete-button {
  font-weight: bold;
  background: none;
  border: none;
  font-size: 1em;
  cursor: pointer;
  transition: color 0.3s;
}

.edit-button {
  color: #3498db;
  margin-right: 5px;
}

.delete-button {
  color: #e74c3c;
}

.edit-button:hover {
  color: #2980b9;
}

.delete-button:hover {
  color: #c0392b;
}

.post-image {
  width: 80%;
  height: auto;
  max-height: 320px;
  object-fit: contain;
  object-position: center;
  margin-bottom: 20px;
}

.content {
  text-align: left;
  line-height: 1.6;
  color: #333;
}
</style>
