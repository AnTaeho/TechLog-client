<template>
  <div class="post-list">
    <div
      v-for="post in posts"
      :key="post.postId"
      class="post-card"
      @click="goToDetail(post.postId)"
    >
      <img :src="getThumbnailUrl(post.thumbnail)" alt="Post thumbnail" class="post-thumbnail" />
      <div class="post-content">
        <h2>{{ post.title }}</h2>
        <p class="description">{{ post.description }}</p>
        <p class="meta">
          {{ post.createdAt }} · {{ post.writer }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostList',
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  methods: {
    getThumbnailUrl(thumbnail) {
      return thumbnail ? thumbnail : require('@/assets/logo.png');
    },
    goToDetail(postId) {
      this.$router.push(`/post/${postId}`);
    }
  }
}
</script>

<style scoped>
.post-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.post-card {
  width: 300px;
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
  height: 180px;
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
