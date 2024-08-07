<template>
    <div class="post-item">
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
      <div class="post-meta">
        <p>작성자: {{ post.writer }}</p>
        <p>작성일: {{ post.createdAt }}</p>
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
    }
  }
  </script>
  
  <style scoped>
  .post-item {
    border: 1px solid #ccc;
    padding: 16px;
    margin: 8px;
    border-radius: 8px;
    background-color: #f9f9f9;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1 0 21%;
    box-sizing: border-box;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .post-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .post-item h2 {
    margin: 0 0 10px;
    font-size: 1.5em;
    color: #222;
  }
  
  .post-item p {
    margin: 5px 0;
  }
  
  .post-meta {
    font-size: 0.9em;
    color: #666;
  }
  </style>
  