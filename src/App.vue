<template>
  <div id="app">
    <nav>
      <div v-if="isLoggedIn">
        <span class="email">{{ email }}</span>
        <button @click="logout" class="logout-button">로그아웃</button>
      </div>
      <div v-else>
        <router-link to="/login">로그인</router-link>
      </div>
    </nav>
    <router-view @login-success="handleLoginSuccess"></router-view>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      email: ''
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('accessToken');
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.email = localStorage.getItem('email'); // 로컬 스토리지에서 이메일을 가져옴
    }
  },
  methods: {
    handleLoginSuccess(email) {
      this.email = email;
      localStorage.setItem('email', email); // 이메일을 로컬 스토리지에 저장
      window.location.href = '/'; // 메인 페이지로 리디렉션
    },
    async logout() {
      try {
        await axios.post('http://localhost:8081/users/logout', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('email');
        this.email = '';
        this.$router.push('/');
        window.location.reload(); // 화면 새로고침
      } catch (error) {
        console.error('로그아웃 중 오류가 발생했습니다:', error);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  background-color: #fff;
  margin-top: 0;
}

nav {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}

.email {
  font-weight: bold;
  margin-right: 10px;
}

.logout-button {
  padding: 5px 10px;
  background-color: #2db400;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #28a700;
}

nav a {
  margin-left: 10px;
  text-decoration: none;
  color: #42b983;
}

nav a:hover {
  text-decoration: underline;
}
</style>
