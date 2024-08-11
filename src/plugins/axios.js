// src/plugins/axios.js
import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',  // 백엔드 서버 주소
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // 인증이 필요한 경로를 정의
  const nonAuthEndpoints = [
    /^\/users\/.*/,                  // 모든 /users/ 경로
    /^\/posts\/\d+$/,                // GET /posts/{id} 요청만 허용
    /^\/error\/.*/,                  // 모든 /error/ 경로
    /^\/$/,                          // 메인 페이지 (/)
  ];

  // nonAuthEndpoints와 일치하지 않는 경로에만 Authorization 헤더 추가
  if (!nonAuthEndpoints.some((regex) => regex.test(config.url))) {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.error('액세스 토큰이 없습니다.');
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const { title, message } = error.response.data.error;
      
      if (title === "Unauthorized" && message === "인증에 실패했습니다.") {
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
