<template>
  <div class="post-item" @click="goToDetail">
    <img :src="post.image || defaultImage" alt="Post image" class="post-image" />
    <div class="post-content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
      <div class="post-meta">
        <p>작성자: {{ post.writer }}</p>
        <p>작성일: {{ post.createdAt }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultImage: require('@/assets/logo.png')
    };
  },
  methods: {
    goToDetail() {
      this.$router.push({ name: 'PostDetail', params: { postId: this.post.postId } });
    }
  }
}
</script>

<style scoped>
.post-item {
  border: 1px solid #ccc;
  margin: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1 0 18%;
  box-sizing: border-box;
  transition: transform 0.3s, box-shadow 0.3s;
  overflow: hidden;
  cursor: pointer; /* 클릭 가능한 영역으로 표시 */
}

.post-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.post-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.post-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-content h2 {
  margin: 0 0 10px;
  font-size: 1.5em;
  color: #222;
}

.post-content p {
  margin: 5px 0;
}

.post-meta {
  font-size: 0.9em;
  color: #666;
}
</style>
