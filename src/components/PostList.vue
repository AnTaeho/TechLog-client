<template>
  <div class="post-list">
    <div 
      v-for="post in posts" 
      :key="post.postId" 
      class="post-card" 
      @click="goToPostDetail(post.postId)">
      <img :src="getThumbnail(post.thumbnail)" alt="Post Thumbnail" class="post-thumbnail" />
      <div class="post-content">
        <h2>{{ post.title }}</h2>
        <div class="post-meta">
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag-item">{{ tag }}</span>
          </div>
          <div class="date-author">
            <span>{{ post.createdAt }}</span> · <span>{{ post.writer }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultThumbnail from '@/assets/logo.png';

export default {
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  methods: {
    getThumbnail(thumbnailUrl) {
      if (!thumbnailUrl || thumbnailUrl.startsWith('s3://')) {
        const s3Key = thumbnailUrl ? thumbnailUrl.replace(process.env.VUE_APP_API_S3_URL, '') : '';
        return s3Key 
          ? process.env.VUE_APP_API_S3_URL + `/${s3Key}`
          : defaultThumbnail;
      } else {
        return thumbnailUrl;
      }
    },
    goToPostDetail(postId) {
      if (postId) {
        this.$router.push({ name: 'PostDetail', params: { postId: postId } });
      } else {
        console.error('postId가 없습니다!');
      }
    }
  }
}
</script>

<style scoped>
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
  height: 140px;
  object-fit: cover;
}

.post-content {
  padding: 12px;
}

.post-content h2 {
  font-size: 1.1em;
  margin-bottom: 10px;
  color: #333;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 5px;
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
</style>
