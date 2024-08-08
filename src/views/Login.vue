<template>
    <div class="login">
      <h1>로그인</h1>
      <form @submit.prevent="login">
        <div>
          <label for="email">아이디:</label>
          <input type="text" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">비밀번호:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">로그인</button>
      </form>
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        message: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:8081/users/login', {
            email: this.email,
            password: this.password
          });
          const { accessToken, refreshToken } = response.data.result;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          this.message = '로그인에 성공했습니다.';
          this.$router.push('/');
        } catch (error) {
          this.message = '로그인 중 오류가 발생했습니다.';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login {
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .login h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  .login form div {
    margin-bottom: 15px;
  }
  
  .login label {
    display: block;
    margin-bottom: 5px;
  }
  
  .login input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .login button {
    padding: 10px 20px;
  }
  
  .login p {
    color: red;
  }
  </style>
  