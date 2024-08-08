<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Tech Log</h1>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">이메일</label>
          <input type="text" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="options">
          <label><input type="checkbox" v-model="rememberMe" /> 로그인 상태 유지</label>
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
      <div class="links">
        <router-link to="/join">회원가입</router-link>
      </div>
      <p>{{ message }}</p>
    </div>
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
      rememberMe: false,
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
        localStorage.setItem('email', this.email);
        this.message = '로그인에 성공했습니다.';
        this.$emit('login-success', this.email);
        window.location.href = '/'; // 메인 페이지로 리디렉션
      } catch (error) {
        this.message = '로그인 중 오류가 발생했습니다.';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

.login-box h1 {
  font-size: 2em;
  color: #2db400;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.options label {
  font-size: 0.9em;
}

.ip-security {
  display: flex;
  align-items: center;
}

.ip-security input {
  margin-left: 5px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #2db400;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #28a700;
}

.links {
  margin-top: 15px;
}

.links a {
  color: #2db400;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.message {
  color: red;
  margin-top: 10px;
}
</style>
