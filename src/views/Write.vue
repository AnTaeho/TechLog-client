<template>
    <div class="write-container">
      <div class="write-box">
        <h1>제목을 입력하세요</h1>
        <input type="text" v-model="title" placeholder="제목을 입력하세요" class="title-input" />
  
        <h2>태그를 입력하세요</h2>
        <input type="text" v-model="description" placeholder="태그를 입력하세요" class="description-input" />
  
        <div class="markdown-editor">
          <textarea v-model="content" placeholder="당신의 이야기를 적어보세요..." class="content-textarea"></textarea>
        </div>
  
        <div class="actions">
          <router-link to="/" class="back-button">나가기</router-link>
          <button @click="savePost" class="save-button">출간하기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Write',
    data() {
      return {
        title: '',
        description: '',
        content: ''
      };
    },
    methods: {
      async savePost() {
        try {
          await axios.post('http://localhost:8081/posts', {
            title: this.title,
            description: this.description,
            content: this.content
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          window.location.href = '/'; // 메인 페이지로 리디렉션하면서 새로고침
        } catch (error) {
          console.error('글 작성 중 오류가 발생했습니다:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .write-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .write-box {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: left;
    width: 800px;
  }
  
  .title-input,
  .description-input,
  .content-textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .content-textarea {
    height: 400px;
    resize: none;
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
  }
  
  .back-button,
  .save-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    text-decoration: none;
    color: white;
  }
  
  .back-button {
    background-color: #ccc;
  }
  
  .back-button:hover {
    background-color: #aaa;
  }
  
  .save-button {
    background-color: #2db400;
  }
  
  .save-button:hover {
    background-color: #28a700;
  }
  </style>
  