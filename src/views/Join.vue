<template>
    <div class="join">
      <h1>회원가입</h1>
      <form @submit.prevent="join">
        <div>
          <label for="email">아이디:</label>
          <input type="text" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">비밀번호:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">가입하기</button>
      </form>
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Join',
    data() {
      return {
        email: '',
        password: '',
        message: ''
      };
    },
    methods: {
      async join() {
        try {
          const response = await axios.post('http://localhost:8081/users/join', {
            email: this.email,
            password: this.password
          });
          this.message = '회원가입이 완료되었습니다.';
        } catch (error) {
          this.message = '회원가입 중 오류가 발생했습니다.';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .join {
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .join h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  .join form div {
    margin-bottom: 15px;
  }
  
  .join label {
    display: block;
    margin-bottom: 5px;
  }
  
  .join input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .join button {
    padding: 10px 20px;
  }
  
  .join p {
    color: red;
  }
  </style>
  