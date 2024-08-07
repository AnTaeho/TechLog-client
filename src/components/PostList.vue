<template>
  <div class="post-list">
    <PostItem v-for="post in posts" :key="post.title" :post="post" />
    <div v-for="n in emptySlots" :key="n" class="post-item empty"></div>
  </div>
</template>

<script>
import PostItem from './PostItem.vue';

export default {
  name: 'PostList',
  components: {
    PostItem
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  computed: {
    emptySlots() {
      const postsCount = this.posts.length;
      const itemsPerRow = 5; // 한 줄에 5개 아이템
      const rows = Math.ceil(postsCount / itemsPerRow);
      const totalSlots = rows * itemsPerRow;
      return totalSlots - postsCount;
    }
  }
}
</script>

<style scoped>
.post-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
}

.post-item.empty {
  visibility: hidden;
  border: none;
  box-shadow: none;
  margin: 12px; /* 카드 간의 간격을 살짝 늘리기 위해 변경 */
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  flex: 1 0 18%; /* 한 줄에 5개 아이템을 배치하기 위해 flex 속성 수정 */
  box-sizing: border-box;
}
</style>
