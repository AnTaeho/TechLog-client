<template>
  <div class="join-container">
    <div class="join-box">
      <h1>NAVER</h1>
      <form @submit.prevent="join">
        <div class="input-group">
          <label for="email">이메일</label>
          <input type="text" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="input-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <button type="submit" class="join-button">가입하기</button>
      </form>
      <div class="links">
        <router-link to="/login">로그인</router-link>
      </div>
      <p>{{ message }}</p>
    </div>
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
      name: '',
      message: ''
    };
  },
  methods: {
    async join() {
      try {
        const response = await axios.post('http://localhost:8081/users/join', {
          email: this.email,
          password: this.password,
          name: this.name
        });
        this.message = '회원가입이 완료되었습니다.';
        window.location.href = '/'; // 메인 페이지로 리디렉션하면서 새로고침
      } catch (error) {
        this.message = '회원가입 중 오류가 발생했습니다.';
      }
    }
  }
};
</script>

<style scoped>
.join-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.join-box {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

.join-box h1 {
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

.join-button {
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

.join-button:hover {
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
