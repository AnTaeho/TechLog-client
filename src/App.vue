<template>
  <div id="app">
    <nav>
      <div class="logo" @click="goHome">Tech Log</div>
      <div v-if="isLoggedIn">
        <span class="user-name">{{ name }}</span> <!-- 이름을 표시 -->
        <router-link to="/write" class="write-button">글쓰기</router-link>
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
      name: '' // 이메일 대신 이름을 저장할 변수
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('accessToken'); // accessToken이 존재하면 로그인 상태로 간주
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.name = localStorage.getItem('name'); // 로컬 스토리지에서 이름을 가져옴
    }
  },
  methods: {
    handleLoginSuccess(loginData) {
      const { name, accessToken, refreshToken } = loginData;

      // 토큰과 이름을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('name', name);

      // 상태 갱신
      this.name = name;

      // 메인 페이지로 리디렉션
      this.$router.push('/');
      window.location.reload(); // 리로드를 추가하여 페이지가 리프레시될 때 모든 상태를 가져오게 합니다.
    },
    async logout() {
      try {
        await axios.post('http://localhost:8081/users/logout', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        // 로컬 스토리지에서 인증 정보 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('name');
        this.name = '';
        this.$router.push('/');
        window.location.reload(); // 화면 새로고침
      } catch (error) {
        console.error('로그아웃 중 오류가 발생했습니다:', error);
      }
    },
    goHome() {
      window.location.href = '/'; // 메인 페이지로 새로고침
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
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
}

.user-name { /* 이름 스타일 */
  font-weight: bold;
  margin-right: 10px;
}

.write-button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #2db400;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.write-button:hover {
  background-color: #28a700;
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
