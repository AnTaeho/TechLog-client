// src/axios.js
import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',  // 백엔드 서버 주소
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // 인증이 필요한 경로를 정의
  const authRequiredEndpoints = [
    /^\/posts(?!\/\d+$)/,  // GET /posts/{id} 외의 모든 /posts 요청
    /^\/images/,           // 모든 이미지 업로드 및 삭제 요청
    // 필요한 다른 경로 추가
  ];

  // authRequiredEndpoints 중 하나와 일치하면 Authorization 헤더 추가
  if (authRequiredEndpoints.some((regex) => regex.test(config.url))) {
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
    // 성공적인 응답 처리
    return response;
  },
  (error) => {
    // 에러 응답 처리
    if (error.response && error.response.status === 401) {
      const { title, message } = error.response.data.error;
      
      if (title === "Unauthorized" && message === "인증에 실패했습니다.") {
        // accessToken 초기화
        localStorage.removeItem('accessToken');
        
        // 메인 페이지로 새로고침
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
